#import "RNKiwiViewController.h"
#import "RNKiwiSharedBridge.h"
#import "RNKiwiGestureController.h"

#import <RNModules/RNLoggingModule.h>
#import <RNModules/RNTranslationManager.h>
#import <RNModules/RNCurrencyManager.h>
#import <RNModules/RNDeviceInfo.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@interface RNKiwiViewController() <RNLogger, RNTranslator, RNCurrencyFormatter, RNKiwiGestureControllerDelegate>

@property (nonatomic, strong) NSString* moduleName;
@property (nonatomic, strong) NSDictionary* properties;
@property (nonatomic) BOOL isGestureAllowed;

@end

@implementation RNKiwiViewController

#pragma mark - Setup

- (instancetype)initWithModule:(NSString *)moduleName initialProperties:(NSDictionary*)properties {
  self = [super init];
  if (self) {
    _moduleName = moduleName;
    _properties = properties;
    _isGestureAllowed = YES;
    
    [self setupReactWrappersWithObject:self];
  }
  
  return self;
}

- (void)setupReactWrappersWithObject:(id)object {
  [RNLoggingModule setLogger:object];
  [RNTranslationManager setTranslator:object];
  [RNKiwiGestureController setGestureControllerDelegate:object];
  [RNCurrencyManager setCurrencyFormatter:object];
  if (object) {
    [self startObservingGestures];
  } else {
    [self stopObservingGestures];
  }
}

#pragma mark - View lifecycle

- (void)loadView {
  self.view = [[RCTRootView alloc] initWithBridge:[[RNKiwiSharedBridge sharedInstance] bridge]
                                       moduleName:_moduleName
                                initialProperties:_properties];
}

- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  
  if ([self isBeingDismissed] || [self isMovingFromParentViewController]) {
    [self notifyFinish];
    [self closeModal];
    [self setupReactWrappersWithObject:nil];
  }
}

#pragma mark - Overriden methods

- (BOOL)prefersStatusBarHidden {
  return NO;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
  return UIStatusBarStyleDefault;
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation {
  return UIStatusBarAnimationFade;
}

#pragma mark - RNLogger

- (void)ancillaryDisplayed:(NSString *)type {
  if ([self didDisplayAncillary]) {
    self.didDisplayAncillary(type);
  }
}

- (void)ancillaryPurchased:(NSString *)type {
  if ([self didPurchaseAncillary]) {
    self.didPurchaseAncillary(type);
  }
}

#pragma mark - RNTranslationManager

- (NSString *)translate:(NSString *)key {
  return [self.translationProvider localizedStringWithKey:key] ?: key;
}

#pragma mark - RNCurrencyManager

- (NSString *)formatAmount:(NSNumber *)amount toCurrency:(NSString *)currency {
  return [self.currencyFormatter formattedPrice:amount withCurrency:currency];
}

#pragma mark - Helpers

- (void)notifyFinish {
  if ([self.flowDelegate respondsToSelector:@selector(RNKiwiViewControllerDidFinish:)]) {
    [self.flowDelegate RNKiwiViewControllerDidFinish:self];
  }
}

#pragma mark - Gesture Controller Observers

- (void)disableGestures:(NSNotification *)notification {
  if ([notification.userInfo[@"moduleName"] isEqualToString:_moduleName]) {
    _isGestureAllowed = NO;
  }
}

- (void)enableGestures:(NSNotification *)notification {
  if ([notification.userInfo[@"moduleName"] isEqualToString:_moduleName]) {
    _isGestureAllowed = YES;
  }
}

- (void)closeModal:(NSNotification *)notification {
  if ([notification.userInfo[@"moduleName"] isEqualToString:_moduleName]) {
     [self dismissViewControllerAnimated:YES completion:nil];
  }
}

- (void)startObservingGestures {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(disableGestures:)
                                               name:RNKiwiDisableGestures
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(enableGestures:)
                                               name:RNKiwiEnableGestures
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(closeModal:)
                                               name:RNKiwiCloseModal
                                             object:nil];
}


- (void)stopObservingGestures {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (BOOL)isInteractivePopGestureAllowed {
  return _isGestureAllowed;
}

#pragma mark - Gesture Controller Delegate

- (void)invokeDefaultBackButton {
  [self notifyFinish];
}

- (void)closeModal {
  [self dismissViewControllerAnimated:YES completion:nil];
}

@end
