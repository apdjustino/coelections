module.exports = {
    root: true,
    parserOptions: {
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    env: {
      browser: true,
      node: true,
      jquery: true,
      es2020: true,
      jest: true,
    },
    // extending recommended config and config derived from eslint-config-prettier
    extends: ["plugin:prettier/recommended", "plugin:react/recommended"],
    // required to lint *.vue files
    plugins: ["html", "prettier", "react", "react-hooks"],
    // add your custom rules here
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      // allow paren-less arrow functions
      "arrow-parens": 0,
      // allow async-await
      "generator-star-spacing": 0,
      // allow debugger during development
      "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
      // allow the use of console (no-console) only for warning and error messages
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/prop-types": 0,
      "react/display-name": 0,
      "max-len": ["error", { code: 160, ignoreStrings: true, ignoreRegExpLiterals: true }],
      "no-console": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  