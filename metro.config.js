// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// resolver: for web, stub out native-only modules from react-native-maps
config.resolver.resolverMainFields.unshift('react-native');

// Block native-only react-native files from being resolved for web
config.resolver.blacklistRE = undefined;
config.resolver.nodes = config.resolver.nodes || {};
config.resolver.nodes.blockList = config.resolver.nodes.blockList || [];

// Stub out native-only files
config.resolver.resolve = config.resolver.resolve || {};
config.resolver.resolve.extraNodeModules = config.resolver.resolve.extraNodeModules || {};

// Map native-only react-native-maps imports to stubs on web
config.resolver.resolve.extraNodeModules = {
  ...config.resolver.resolve.extraNodeModules,
  'react-native-maps/lib/MapMarkerNativeComponent.js': require('path').resolve(__dirname, 'src/components/discover/MapMarkerNativeComponent.stub.js')
};

// For react-native 0.76+ hermes architecture files
const nativeOnly = [
  'react-native/Libraries/Utilities/codegenNativeCommands',
  'react-native/Libraries/NativeComponentRegistry/index.js',
];

function isWeb(resolverOptions) {
  return resolverOptions.platform === 'web';
}

module.exports = config;
