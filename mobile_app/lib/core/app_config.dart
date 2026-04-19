import 'package:flutter/foundation.dart';

class AppConfig {
  // Use this for running in Android Emulator
  static const String emulatorApiUrl = 'http://10.0.2.2:8080/api';

  // Use this when testing on a physical device on the same WiFi network
  // Change 192.168.1.X to your computer's actual local IP address
  static const String localNetworkApiUrl = 'http://192.168.0.247:8080/api';

  // Use this for production
  static const String productionApiUrl = 'http://192.168.0.247:8080/api';

  // >>> Set the actively used URL here <<<
  // During development, use emulatorApiUrl for emulator
  // or localNetworkApiUrl for physical device.
  // When building for release (APK), you generally want productionApiUrl.
  static const String baseUrl = kReleaseMode
      ? productionApiUrl
      : localNetworkApiUrl;

  static String get serverUrl => baseUrl.replaceAll('/api', '');
}
