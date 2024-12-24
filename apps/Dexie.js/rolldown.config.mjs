import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-esbuild";
const sourceMap = !!process.env.SOURCE_MAP;
const m = !!process.env.MINIFY;
let tsSet = new Set();
let jsSet = new Set();
export default defineConfig({
	input: {
		main: "./src/index.ts",
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
  resolve: {
    extensions: [".ts", ".js", ".d.ts",],
  },
	plugins: [
    {
      transform(code, id) {
        if (id.endsWith(".ts")) {
          tsSet.add(id);
        }
        if (id.endsWith(".js")) {
          jsSet.add(id);
        }
      },
      buildEnd() {
        console.log(`TS: ${tsSet.size}, JS: ${jsSet.size}`);
      }
    },
		m
			? minify({
					minify: true,
					legalComments: "none",
					target: "es2022",
				})
			: null,
	].filter(Boolean),
	profilerNames: !m,
	output: {
		minify: false,
		sourcemap: sourceMap,
		dir: "rolldown-dist",
	},
});
