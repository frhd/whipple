module.exports = {
  extends: "dacz",
  rules: {
    "no-param-reassign": 0,
    "quotes": [2, "double", "avoid-escape"],
    "react/prefer-stateless-function": 0,
    "array-bracket-spacing": 0,
  },
  "plugins": [
    "jest"
  ],
  "env": {
    "jest/globals": true
  }
};
