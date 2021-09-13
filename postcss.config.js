module.exports = {
  // eslint-disable-next-line no-process-env
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    ...(process.env.HUGO_ENVIRONMENT === "production"
      ? { autoprefixer: {} }
      : {}),
    // "postcss-preset-env": {
    //   features: { "nesting-rules": false },
    // },
  },
};
