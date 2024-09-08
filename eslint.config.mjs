import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";

console.log("Running eslint config");
export default [
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    jest.configs["flat/recommended"],
    {
        rules: {
            indent: ["error", 4],
        },
    },
];
