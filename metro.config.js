const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/react-native"
    ),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
};
