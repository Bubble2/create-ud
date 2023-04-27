module.exports = function (api) {
    api.cache.using(() => process.env.NODE_ENV)
    return {
        "presets": [
            [
                "@babel/preset-env", //根据配置的目标浏览器或者运行环境来自动编译es6代码
                {
                    "modules": false
                }
            ],
            "@babel/preset-react",
            "@babel/preset-typescript"
        ],
        "plugins": [
            //支持高阶组件装饰器
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            //支持class静态属性
            "@babel/plugin-proposal-class-properties",
            //启动react代码热替换
            api.env("development") ? "react-refresh/babel" : null,
            //支持import按需加载
            "@babel/plugin-syntax-dynamic-import",
            //自动引入antd组件的css
            // [
            // 	"import",
            // 	{
            // 		"libraryName": "antd",
            // 		"style": true
            // 	},
            // 	"antd"
            // ]
        ].filter(Boolean)
    }
}
