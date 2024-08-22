import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJsx from '@stylistic/eslint-plugin-jsx';

console.log("Running eslint config");
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
      plugins: {
          '@stylistic/jsx': stylisticJsx
      }
  },
  {
      rules: {
        '@stylistic/jsx/jsx-indent': ['error', 4]
      }
  }
];
