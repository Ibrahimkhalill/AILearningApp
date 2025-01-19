module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Expo preset handles asset plugins internally
    plugins: [
      "nativewind/babel",           // Tailwind CSS plugin (if used)
      "react-native-reanimated/plugin", // Required for react-native-reanimated
      [
        "module:react-native-dotenv", // dotenv plugin
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
