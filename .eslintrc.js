module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    app: "readonly",
    $: "readonly",
    ElementPlacement: "readonly",
    RGBColor: "readonly",
    redraw: "readonly",
    Folder: "readonly",
    ExportType: "readonly",
    ExportOptionsPNG8: "readonly",
    ExportOptionsPNG24: "readonly",
    PDFSaveOptions: "readonly",
    PDFCompatibility: "readonly",
    ExportOptionsJPEG: "readonly",
    EPSSaveOptions: "readonly",
    DocumentPreset: "readonly",
    DocumentColorSpace: "readonly",
    system: "readonly",
    ParagraphJustification: "readonly",
    ImportOptions: "readonly",
    ImportAsType: "readonly",
    ScriptUI: "readonly",
    CompItem: "readonly",
    SolidSource: "readonly",
    PlaceholderSource: "readonly",
    FileSource: "readonly",
    XLSX: "readonly",
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["package.json", "actions/*", "static/*"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-control-regex": 0,
    "no-inner-declarations": "warn",
    "no-useless-escape": "warn",
    "no-misleading-character-class": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": "off"
  },
};
