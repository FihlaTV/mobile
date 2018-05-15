//
//  RNHotelsViewController.h
//  RNHotels
//
//  Created by Radek Pistelak on 07/02/2018.
//  Copyright © 2018 Kiwi.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

@class RNHotelsViewController, RNHotelsParameters;

@protocol RNHotelsViewControllerFlowDelegate <NSObject>

- (void)RNHotelsViewControllerDidFinish:(nonnull RNHotelsViewController *)viewController;

@end

@protocol RNCurrencyManager <NSObject>

- (nonnull NSString *)formattedPrice:(nonnull NSNumber *)price withCurrency:(nullable NSString *)currencyCode;

@end

@protocol RNTranslationProvider <NSObject>

- (nonnull NSString *)localizedStringWithKey:(nonnull NSString *)key;

@end

@interface RNHotelsViewController: UIViewController

- (nonnull instancetype)initWithParams:(NSDictionary * _Nonnull)params;
- (nonnull instancetype)init;

@property (nonatomic, weak, nullable) id<RNCurrencyManager> currencyFormatter;
@property (nonatomic, weak, nullable) id<RNTranslationProvider> translationProvider;

// Logging

@property (nonatomic, copy, nullable) void (^didDisplayAncillary)(NSString * _Nonnull type);
@property (nonatomic, copy, nullable) void (^didPurchaseAncillary)(NSString * _Nonnull type);

// Flow

@property (nonatomic, weak, nullable) id<RNHotelsViewControllerFlowDelegate> flowDelegate;

@end
