// metro.config.js

const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default config from Expo
const config = getDefaultConfig(__dirname);

// Add 'cjs' to sourceExts
if (config.resolver && config.resolver.sourceExts) {
  config.resolver.sourceExts.push("cjs");
}

// Set unstable_enablePackageExports to false
config.resolver.unstable_enablePackageExports = false;

// Apply NativeWind configuration
const nativeWindConfig = withNativeWind(config, { input: "./global.css" });

// Apply Reanimated configuration on top of NativeWind config
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });

// // metro.config.js
// const {
//   wrapWithReanimatedMetroConfig,
// } = require("react-native-reanimated/metro-config");

// const config = {
//   // Your existing Metro configuration options
// };

// module.exports = wrapWithReanimatedMetroConfig(config);
