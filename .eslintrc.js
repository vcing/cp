module.exports = {
  extends: [
    "react-app",
    "airbnb",
    "plugin:prettier/recommended", // prettier配置
  ],
  rules: {
    "react/jsx-filename-extension": "off", // 关闭airbnb对于jsx必须写在jsx文件中的设置
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
