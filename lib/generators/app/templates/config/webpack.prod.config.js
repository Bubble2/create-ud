const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const { pathResolve, getPackageConfig, getEntry, getEnvConfig } = require('./utils');
const webpackConfig = getPackageConfig();
const entryObj = getEntry(pathResolve('src/entry'))
const publicPath = webpackConfig.assetsPath || '//jxcstatic.abiz.com/';
const distApiPath = webpackConfig.distApiPath || '//jxc.abiz.com/';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv,) => {
    const envArg = Object.keys(argv.env).find(item => item.indexOf('env-') > -1)
    let resolvedEnvArg = 'prod';
    if (envArg) {
        resolvedEnvArg = envArg.split('-')[1]
    }
    console.log(`${resolvedEnvArg}环境正在打包...`)
    const resolvedEnvObj = getEnvConfig(resolvedEnvArg)
    return merge(webpackBaseConfig, {
        cache: {
            type: 'filesystem', // 使用文件缓存
            buildDependencies: {
                // This makes all dependencies of this file - build dependencies
                config: [__filename],
                // 默认情况下 webpack 与 loader 是构建依赖。
            }
        },
        output: {
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js',
            path: pathResolve('build'),
            publicPath: publicPath
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: [pathResolve('src')],
                    exclude: [/node_modules/, pathResolve('src/js')],
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../' //css中引入背景图片会在图片url前面加上该路径
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1, //使用import之前还要经过几次loader
                                modules: {
                                    localIdentName: '[local]--[hash:base64:5]'
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
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
                        filename: 'assets/[name].[hash:8][ext]'
                    }
                }
            ]
        },
        plugins: [
            //清除dist目录文件
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: pathResolve('build/**/*')
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public/locales",
                        to: "locales"
                    },
                    {
                        from: "public/files",
                        to: "files"
                    }
                    // ,
                    // {
                    //     from: "public/fonts",
                    //     to: "fonts"
                    // }
                ]
            }),
            //提取css为单独css文件
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
                ignoreOrder: true
            }),
            // new BundleAnalyzerPlugin()
        ].concat(
            Object.keys(entryObj).filter(chunkName => {
                //产品模式下，只有单页引用会生成html文件，多页走后端项目中的html
                return chunkName.indexOf('/') !== -1 || chunkName === 'index';
            }).map(chunkName => {
                return new HtmlWebpackPlugin({
                    filename: `${chunkName}.html`,
                    chunks: [chunkName],
                    template: pathResolve('public/index.html'),
                    favicon: pathResolve('public/favicon.ico'),
                    // chunksSortMode: function (chunk1, chunk2) {
                    //     var orders = ['commons', 'antd'];
                    //     var order1 = orders.indexOf(chunk1.names[0]);
                    //     var order2 = orders.indexOf(chunk2.names[0]);
                    //     return order1 - order2;
                    // }
                })
            })
        ),
        optimization: {
            runtimeChunk: {
                name: "runtime",
            },
            splitChunks: {
                chunks: 'all',
                // minSize: 30000,
                // maxSize: 0,
                // minChunks: 1,
                // maxAsyncRequests: 5,
                // maxInitialRequests: 20,
                // automaticNameDelimiter: '~',
                // name: true,
                cacheGroups: {
                    defaultVendors: {
                        name: "vendors",
                        test: /[\\/]node_modules[\\/]/,
                        chunks: "initial", // 只打包初始时依赖的第三方
                        priority: 10
                    },
                    vendors2: {
                        name: "vendors2",
                        test: /[\\/]node_modules[\\/]rc-select|core-js|immutable|bn.js[\\/]/,
                        priority: 20
                    },
                    vendors3: {
                        name: "vendors3",
                        test: /[\\/]node_modules[\\/]i18next|rc-trigger|rc-field-form|rc-util|@web3-react|rc-virtual-list|ua-parser-js|hash.js|rc-align|idna-uts46-hx|rc-table|rc-tree|crypto-js[\\/]/,
                        priority: 21
                    },
                    vendors4: {
                        name: "vendors4",
                        test: /[\\/]node_modules[\\/]zrender|@apollo|lodash|elliptic[\\/]/,
                        priority: 22
                    },
                    reactDOM: {
                        name: 'react-dom',
                        test: /[\\/]node_modules[\\/]react-dom[\\/]/,
                        priority: 21
                    },
                    antd: {
                        name: 'antd',
                        test: /[\\/]node_modules[\\/]antd|@ant-design[\\/]/,
                        priority: 22
                    },
                    ethers: {
                        name: 'ethers',
                        test: /[\\/]node_modules[\\/]@ethersproject[\\/]/,
                        priority: 23
                    },
                    echarts: {
                        name: 'echarts',
                        test: /[\\/]node_modules[\\/]echarts[\\/]/,
                        chunks: "initial", // 只打包初始时依赖的第三方
                        priority: 24
                    },
                    ethereumjs: {
                        name: 'ethereumjs',
                        test: /[\\/]node_modules[\\/]@ethereumjs[\\/]/,
                        chunks: "initial", // 只打包初始时依赖的第三方
                        priority: 23
                    },
                    commons: {
                        name: "commons",
                        test: pathResolve('src/components'), // 可自定义拓展你的规则
                        minChunks: 1, // 最小共用次数
                        priority: 20,
                        reuseExistingChunk: true
                    }
                }
            },
            minimizer: [
                new TerserPlugin({
                    // cache: true, //启用文件缓存
                    parallel: true,  //启用多进程
                    terserOptions: {
                        compress: {
                            drop_console: true //删除所有的console
                        }
                    }
                }),
                new CssMinimizerPlugin(),
                new webpack.DefinePlugin({
                    //所有ajax请求的基础url
                    'BASE_URL': JSON.stringify(`${distApiPath}`),
                    'process.env.NODE_ENV': JSON.stringify(`production`),
                    'process.env.WALLETCONNECT_BRIDGE_URL': JSON.stringify(`https://bridge.walletconnect.org`),
                    ...resolvedEnvObj
                })
            ],
        }
    });
}
