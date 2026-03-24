import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tseslint from "typescript-eslint";

const astroA11yConfig = astro.configs["flat/jsx-a11y-recommended"].map(
  (config) =>
    config.plugins?.["jsx-a11y"] === null
      ? {
          ...config,
          plugins: {
            ...config.plugins,
            "jsx-a11y": jsxA11y,
          },
        }
      : config,
);

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...astroA11yConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
