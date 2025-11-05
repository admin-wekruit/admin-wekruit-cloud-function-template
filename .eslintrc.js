module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: ["@typescript-eslint", "import"],
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "linebreak-style": 0,
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "max-len": 0,
        "indent": ["error", 4],
        "object-curly-spacing": 0,
        "@typescript-eslint/no-var-requires": 0,
        "camelcase": 0,
    },
};
