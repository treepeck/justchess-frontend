import DotenvWebpackPlugin from "dotenv-webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const prod = process.env.NODE_ENV === "production"

export default {
	mode: prod ? "production" : "development",
	entry: "./src/index.tsx",
	output: {
		path: import.meta.dirname + '/dist/',
		filename: "[name][contenthash].js",
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				resolve: {
					extensions: [".js", ".jsx", ".ts", ".tsx"]
				},
				use: "ts-loader"
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css"
		}),
		new DotenvWebpackPlugin(),
	],
	devServer: {
		historyApiFallback: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp",
		}
	}
}