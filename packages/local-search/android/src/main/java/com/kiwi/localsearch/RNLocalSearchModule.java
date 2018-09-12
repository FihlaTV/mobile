
package com.kiwi.localsearch;

import android.location.Geocoder;
import android.location.Address;
import android.app.Activity;
import android.text.TextUtils;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.lang.System;
import java.util.ArrayList;
import java.util.Locale;
import java.util.List;
import java.util.HashMap;
import java.util.Map;


public class RNLocalSearchModule extends ReactContextBaseJavaModule {

  private static int MAX_RESULTS = 10;

  private final ReactApplicationContext reactContext;

  public RNLocalSearchModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNLocalSearch";
  }

  private WritableMap getLocationFromAddress(Address address) {
    WritableMap location = new WritableNativeMap();
    location.putDouble("latitude", address.getLatitude());
    location.putDouble("longitude", address.getLongitude());
    return location;
  }

  private String getFirstLineOfAddress(Address address) {
    if (address.getMaxAddressLineIndex() > -1) {
      return address.getAddressLine(0);
    }
    return "";
  }

  private WritableMap formatAddress(Address address) {
    WritableMap addressObject = new WritableNativeMap();
    
    addressObject.putNull("name");
    addressObject.putMap("location", getLocationFromAddress(address));
    addressObject.putString("address", getFirstLineOfAddress(address));
    
    return addressObject;
  }

  private WritableArray formatAddresses(List<Address> addresses) {
    WritableArray formattedAddresses = new WritableNativeArray();
    
    for(int i = 0; i < addresses.size(); i++) {
      Address address = addresses.get(i);
      formattedAddresses.pushMap(formatAddress(address));
    }
    
    return formattedAddresses;
  }

  @ReactMethod
  public void searchForLocations(
    String searchText,
    ReadableMap region,
    Callback callback
  ) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      callback.invoke("Activity doesn't exist", null);
      return;
    }

    if (!Geocoder.isPresent()) {
      callback.invoke("Geocoder is not present", null);
    }

    double latitude = region.getDouble("latitude");
    double longitude = region.getDouble("longitude");
    double latitudeDelta = region.getDouble("latitudeDelta");
    double longitudeDelta = region.getDouble("longitudeDelta");

    double lowerLeftLatitude = latitude - Math.abs(latitudeDelta);
    double lowerLeftLongitude = longitude - Math.abs(longitudeDelta);
    double upperRightLatitude = latitude + Math.abs(latitudeDelta);
    double upperRightLongitude = longitude + Math.abs(longitudeDelta);
    
    try {
      List<Address> addresses = null;
      Geocoder geocoder = new Geocoder(reactContext, Locale.getDefault());
      
      // First fetch as many local addresses as possible
      addresses = geocoder.getFromLocationName(
        searchText,
        MAX_RESULTS,
        lowerLeftLatitude,
        lowerLeftLongitude,
        upperRightLatitude,
        upperRightLongitude
      );

      // Then add other more remote possibilities
      addresses = geocoder.getFromLocationName(
        searchText,
        MAX_RESULTS - addresses.size()
      );

      callback.invoke(null,formatAddresses(addresses));
    
    } catch (Exception e) {
      callback.invoke(e, null);
    }
  }
  }