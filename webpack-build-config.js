var webpack = require('webpack');
var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件

//定义路径
var rootPath = path.resolve(__dirname);
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var distPath = path.resolve(rootPath,'dist');

module.exports = {
    entry: {
        p2:'./src/js/p2.js',
        p6:'./src/js/p6.js',
        index:'./src/js/index.js'
    },
    output: {
        path: distPath,
        filename: "js/[name].js"
    },
    module:{
        loaders:[{
            test:/\.js$/,
            loader:'babel-loader',
            exclude:nodeModulesPath,
            include:path.resolve(rootPath,'./src/'),
            query:{
                presets:['es2015']
            }
        },{
            test:/\.(png|jpg|gif|svg|ttf)$/i,
            loader:'file-loader?name=[path]/[name].[ext]&context=src/',
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/asset'),
            to: path.resolve(__dirname,'dist/asset')
        },{
            from: path.resolve(__dirname, 'src/libs'),
            to: path.resolve(__dirname,'dist/libs')
        },{
            from: path.resolve(__dirname, 'src/css'),
            to: path.resolve(__dirname,'dist/css')
        },{
            from: path.resolve(__dirname, 'src/imgs'),
            to: path.resolve(__dirname,'dist/imgs')
        }]),
        new htmlWebpackPlugin({
            filename:'index.html',
            template:path.resolve(__dirname,'./src/index.html'),
            chunks:['index'],
            title:'目录'
        }),
        new htmlWebpackPlugin({
            filename:'p2.html',
            template:path.resolve(__dirname,'./src/p2.html'),
            chunks:['p2'],
            title:'原油生产'
        }),
        new htmlWebpackPlugin({
            filename:'p6.html',
            template:path.resolve(__dirname,'./src/p6.html'),
            chunks:['p6'],
            title:'地面工程'
        })
    ]
};
