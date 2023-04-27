const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const { pathResolve, getPackageConfig, getEntry, getEnvConfig, getIPAdress } = require('./utils');
const webpackConfig = getPackageConfig();
const entryObj = getEntry(pathResolve('src/entry'));
const path = require('path');

const port = webpackConfig.port || 3000;
const publicPath = '/';
const devApiPath = webpackConfig.devApiPath || 'http://localhost:' + port + '/';

module.exports = () => {
    const resolvedEnvObj = getEnvConfig('dev');
    const myHostIp = getIPAdress();
    return merge(webpackBaseConfig, {
        cache: {
            type: 'filesystem'
        },
        output: {
            filename: '[name].js',
            publicPath: publicPath
        },
        devtool: 'eval-cheap-module-source-map',

        devServer: {
            proxy: {
                // '/volcano': 'http://192.168.110.248:9798' //开发服务器
                '/volcano': 'http://172.16.12.112:9798', //测试服务器
                // '/volcano': 'http://172.16.12.112:7475',//测试服务器
                // '/union/saving': 'http://192.168.208.106:4848',
                '/union/saving': 'http://172.16.12.112:4848',
                '/union/price': 'http://47.241.44.166:7474', //线上服务器，因为要翻墙，所以拿价格的接口是单独部署的正式环境新加坡服务器上进行了一次代理
                // '/union': 'http://192.168.110.248:7474',//开发服务器
                '/union/tt': 'http://192.168.208.180:7474', //测试服务器
                '/union': 'http://47.241.44.166:7474',
                // '/nft/': 'http://192.168.208.106:8080/',//陈明星本机服务器
                // '/nft/': 'http://47.241.44.166:8080/',//正式环境服务器
                '/nft/': 'http://172.16.12.112:8080/', //测试环境服务器
                '/udimage': 'http://192.168.208.106:8000', //陈明星本机服务器
                // '/udimage': 'http://47.241.44.166:8000', //正式环境服务器
                // '/udimage': 'http://172.16.12.112:8000',//测试环境服务器
                // '/report': 'http://192.168.208.154​:8085'
                // '/report': 'http://192.168.110.135​:8603/gateway',
                // "/api/unionDefi": "https://chainaegis-stage.tongfudun.com",
                '/api/unionDefi': 'http://192.168.110.135:8620', //测试环境
                '/api/v2/unionDefi': 'http://192.168.110.135:8620', //测试环境
                // '/api/unionDefi': 'https://app.chainaegis.com',//生产环境
                '/api/v0': 'http://172.16.12.112:5001',
                '/ipfs': 'http://172.16.12.112:8099',
                '/v1/quote': {
                    target: 'https://api.uniswap.org',
                    secure: false,
                    changeOrigin: true,
                    headers: {
                        referer: 'https://app.uniswap.org',
                        origin: 'https://app.uniswap.org'
                    }
                },
                '/dayRisk': 'http://172.16.12.112:9099',
                '/priceRisk': 'http://172.16.12.112:9099',
            },
            // static: {
            //     publicPath: '/'
            // },
            client: {
                progress: true
            },
            server: 'http',
            port: port,
            compress: true,
            host: '0.0.0.0',
            hot: true,
            liveReload: false,
            open: 'http://localhost:' + port + '/',
            historyApiFallback: {
                //单页应用刷新页面重定向到对应的单页目录下，以便支持多个单页和多页共存
                rewrites: Object.keys(entryObj)
                    .filter(chunkName => {
                        return chunkName.indexOf('/') !== -1;
                    })
                    .map(chunkName => {
                        chunkName = chunkName.split('/')[0];
                        return {
                            from: new RegExp('^/' + chunkName + '/', 'g'),
                            to: '/' + chunkName + '/'
                        };
                    })
                // rewrites: [
                //     {
                //         from:  /^\/spa2\//g,
                //         to: '/spa2/'
                //     }
                // ]
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [pathResolve('src/js')],
                    exclude: /node_modules/,
                    enforce: 'pre',
                    use: ['source-map-loader']
                },
                {
                    test: /\.scss$/,
                    include: [pathResolve('src')],
                    exclude: [/node_modules/, pathResolve('src/js')],
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1, //使用import之前还要经过几次loader
                                sourceMap: true,
                                modules: {
                                    localIdentName: '[local]--[hash:base64:5]'
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg|ttf|eot|woff|woff2)$/,
                    include: [pathResolve('src')],
                    exclude: [/node_modules/, pathResolve('src/js')],
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024 // 4kb
                        }
                    },
                    generator: {
                        filename: '[path][name][ext]'
                    }
                }
            ]
        },
        plugins: [
            new ReactRefreshPlugin({
                overlay: false
            }),
            new webpack.DefinePlugin({
                //所有ajax请求的基础url
                BASE_URL: JSON.stringify(`${devApiPath}`),
                'process.env.NODE_ENV': JSON.stringify(`development`),
                'process.env.WALLETCONNECT_BRIDGE_URL': JSON.stringify(`https://bridge.walletconnect.org`),
                UNIONDEFI_URL: JSON.stringify(`http://${myHostIp}:3333`),
                ...resolvedEnvObj
            })
        ].concat(
            Object.keys(entryObj).map(chunkName => {
                return new HtmlWebpackPlugin({
                    filename: `${chunkName}.html`,
                    chunks: [chunkName],
                    template: pathResolve('public/index.html'),
                    favicon: pathResolve('public/favicon.ico')
                });
            })
        )
    });
};
