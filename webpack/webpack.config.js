const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const optimizeCss = require('optimize-css-assets-webpack-plugin');


module.exports = {
  //入口文件的配置项
  entry: {
    home: path.resolve(__dirname,'../src/page/home.js'),
    about: path.resolve(__dirname,'../src/page/about.js'),
    vendor: ['react', 'react-dom'],
  },
  //出口文件的配置项
  output: {
    path:path.resolve(__dirname,'../dist'),
    publicPath:'/',
    filename:'js/[name].[hash:8].js',
    chunkFilename: "js/[name].chunk.js"
  },
  resolve: {
    //引入模块的时候，可以不用扩展名
    extensions: [".js", ".jsx", ".css", ".less", ".sass", ".json"],
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../src')
    ],
  },
  //模块：例如解读CSS,图片如何转换，压缩
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader" },
          {loader: "postcss-loader" }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'commons',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        },
      }
    },
  },
  stats: {
    colors: true,
    modules: false,
  },
  //插件，用于生产模版和各项功能
  plugins:[
    new CleanWebpackPlugin(
      [
        'dist/**/*.js',
        'dist/**/*.css',
      ],　 //匹配删除的文件
      {
        root: path.resolve(__dirname,'../'),     //根目录
        verbose:  false,        　　　　　　　　　　//开启在控制台输出信息
        dry:      false,        　　　　　　　　　　//启用删除文件
      }
    ),
    new webpack.HotModuleReplacementPlugin(),
    /* css压缩 */
    new optimizeCss({
      assetNameRegExp: /.css$/,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new htmlPlugin({
      minify:{
        removeAttributeQuotes:true,
        removeComments:true,  //移除HTML中的注释
        collapseWhitespace:true  ////删除空白符与换行符
      },
      filename: 'home.html',
      title: '首页',
      template: path.resolve(__dirname,'../src/tpl/home.html'),
      chunks: ["vendor",'home', 'commons']
    }),
    new htmlPlugin({
      minify:{
        removeAttributeQuotes:true,
        removeComments:true,  //移除HTML中的注释
        collapseWhitespace:true  ////删除空白符与换行符
      },
      filename: 'about.html',
      title: '关于我们',
      template: path.resolve(__dirname,'../src/tpl/about.html'),
      chunks: ["vendor",'about','commons']
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:8].css",
      chunkFilename: "css/[name].chunk.css"
    }),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: false
    })
  ],
  // 配置webpack开发服务功能
  devServer:{
    contentBase:path.resolve(__dirname,'dist'),
    host:'localhost',
    compress:true,
    inline: true,  // 自动刷新
    open: true,  //打开浏览器
    hot: true,  //开启热更新
    port:8089,  //端口
  }
}
