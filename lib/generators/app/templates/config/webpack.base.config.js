const { pathResolve, getPackageConfig, getEntry } = require('./utils');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const WebpackBar = require('webpackbar')

const entryObj = getEntry(pathResolve('src/entry'))
module.exports = {
    entry: entryObj,
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx|mjs)$/,
                include: [pathResolve('src')],
                exclude: [/node_modules/, pathResolve('src/js')],
                use: [
                    {
                        loader: 'babel-loader', //主要用于编译es6语法和react的jsx语法
                        //options请看.babelrc文件
                    }
                ]
            },
            // {
            //     test: /\.(ts|tsx)$/,
            //     include: [pathResolve('src')],
            //     exclude: [/node_modules/, pathResolve('src/js')],
            //     use: [
            //         {
            //             loader: 'ts-loader'
            //         }
            //     ]
            // },
            {
                test: /\.json$i/,
                include: [pathResolve('src')],
                exclude: [/node_modules/, pathResolve('src/js')],
                use: ['json-loader'],
                type: 'javascript/auto'
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
