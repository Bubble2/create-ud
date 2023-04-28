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
                    test: /\.scss$/,
                    include: [pathResolve('src')],
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
