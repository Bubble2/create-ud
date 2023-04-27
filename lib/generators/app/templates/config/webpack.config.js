const webpackDevConfig = require('./webpack.dev.config');
const webpackProdConfig = require('./webpack.prod.config');

let webpackConfig = {};

module.exports = (env, argv) => {
	switch (argv.mode) {
		case 'development':
			webpackConfig = webpackDevConfig;
			break;
		case 'production':
			webpackConfig = webpackProdConfig;
			break;
		default:
			break;
	}
	return webpackConfig.call(this, env, argv);
};
