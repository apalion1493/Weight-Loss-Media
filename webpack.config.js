const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')

// Функция для автоматической генерации HtmlWebpackPlugin для каждого HTML файла
function generateHtmlPlugins(templateDir) {
	const templateFiles = glob.sync(`${templateDir}/**/*.html`)
	return templateFiles.map(filePath => {
		const fileName = path.basename(filePath)
		const name = fileName.replace('.html', '')
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: filePath,
			chunks: ['index'], // Указываем, что для всех страниц используется один и тот же бандл
		})
	})
}

const htmlPlugins = generateHtmlPlugins(path.resolve(__dirname, 'src'))

module.exports = {
	mode: 'development',
	entry: {
		index: path.resolve(__dirname, 'src/index.js'), // Одна точка входа
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js', // Имена файлов будут как index.bundle.js
		clean: true,
		assetModuleFilename: 'assets/[name][ext]', // Помещаем ассеты в папку 'assets'
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg|ico|webmanifest)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]', // Помещаем изображения в отдельную папку
				},
			},
		],
	},
	plugins: [
		...htmlPlugins,
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src', 'assets'), // Указываем папку 'src/assets'
					to: path.resolve(__dirname, 'dist', 'assets'), // Копируем в 'dist/assets'
					noErrorOnMissing: true, // Если папка отсутствует, не выдавать ошибку
				},
			],
		}),
	],
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		port: 3000,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: {
			rewrites: [
				{ from: /^\/$/, to: '/index.html' },
				{ from: /^\/about/, to: '/about.html' },
				{ from: /^\/contact/, to: '/contact.html' },
			],
		},
		watchFiles: ['src/**/*.html'], // Следить за изменениями в HTML файлах
	},
}
