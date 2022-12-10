import { resolve } from "path";

import { babel } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "output/standalone.js",
    format: "umd",
    name: "prettierPlugins.apex",
    exports: "named",
    globals: {
      prettier: "prettier",
      axios: "axios",
    },
  },
  external: ["prettier", "axios"],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: true,
    }),
    json(),
    commonjs(),
    nodePolyfills(),
    typescript({
      tsconfig: "tsconfig.prod.json",
    }),
    babel({
      babelrc: false,
      extensions: [".ts", ".js"],
      include: resolve("src", "**", "*"),
      plugins: [],
      compact: false,
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { browsers: [">0.25%", "not ie 11", "not op_mini all"] },
            modules: false,
          },
        ],
      ],
    }),
    terser(),
  ],
};
