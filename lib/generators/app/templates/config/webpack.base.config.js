const { pathResolve, getPackageConfig, getEntry } = require('./utils');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const WebpackBar = require('webpackbar')

const entryObj = getEntry(pathResolve('src/entry'))
module.exports = {
    entry: entryObj,
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
                test: /\.(js|jsx|ts|tsx|mjs)$/,
                include: [pathResolve('src')],
                use: [
                    {
                        loader: 'babel-loader', //主要用于编译es6语法和react的jsx语法
                        //options请看.babelrc文件
                    }
                ]
            },
            {
                test: /\.json$i/,
                include: [pathResolve('src')],
                use: ['json-loader'],
                type: 'javascript/auto'
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
                test: /\.(jpe?g|png|gif|ttf|eot|woff|woff2)$/,
                include: [pathResolve('src')],
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 4kb
                    }
                },
                generator: {
                    filename: 'assets/[name].[hash:8][ext]'
                }
            },
            {
                test: /\.svg$/,
                include: [pathResolve('src')],
                use: [
                    {
                        loader: require.resolve('@svgr/webpack'),
                        options: {
                            prettier: false,
                            svgo: false,
                            svgoConfig: {
                                plugins: [{ removeViewBox: false }],
                            },
                            titleProp: true,
                            ref: true,
                        },
                    },
                    {
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'assets/[name].[hash:8].[ext]',
                        },
                    },
                ],
                issuer: {
                    and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                }
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new WebpackBar()
    ],
    resolve: {
        modules: [
            pathResolve('src'),
            "node_modules"
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            "@@": pathResolve('src'),
            "@components": pathResolve('src/components'),
            "@pages": pathResolve('src/pages'),
            "@styles": pathResolve('src/styles'),
            "@images": pathResolve('src/images'),
            "@utils": pathResolve('src/utils'),
            "@router": pathResolve('src/router'),
            "@constants": pathResolve('src/constants'),
            "@hooks": pathResolve('src/hooks'),
            "@context": pathResolve('src/context'),
            "@state": pathResolve('src/state'),
            "react": pathResolve('./node_modules/react')
        }
    }
};
