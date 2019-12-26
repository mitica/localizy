module.exports = function(wallaby) {
  return {
    files: ["src/**/*.ts", "!src/**/*.test.ts"],
    tests: ["src/**/*.test.ts"],
    env: {
      type: "node",
      runner: "node"
    },
    compilers: {
      "**/*.ts?(x)": wallaby.compilers.typeScript({
        typescript: require("typescript")
      })
    },
    testFramework: "ava",
    debug: true
  };
};
