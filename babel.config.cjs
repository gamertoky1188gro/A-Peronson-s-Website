module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        modules: process.env.NODE_ENV === "test" ? "auto" : false,
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["babel-plugin-transform-vite-meta-env"],
};
