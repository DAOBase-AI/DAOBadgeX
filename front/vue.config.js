const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  devServer: {
    client: {
      overlay: false,
    },
  },
  transpileDependencies: true,
  // pwa: {
  //   themeColor: '#121416',
  // },
  lintOnSave: false,
  parallel: false,
  configureWebpack: (config) => {
    // config.plugins.push(
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: 'static',
    //     reportFilename: 'report.html',
    //     openAnalyzer: true,
    //   }),
    // );
    if (process.env.NODE_ENV === 'production') {
      //生产包取消console debugger打印
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
    } else {
      config.devtool = 'source-map';
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_module/,
      type: 'javascript/auto',
    });
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'file-loader', // or 'file-loader'
    });
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      const conf = args[0];
      conf['process.env']['AWS_ACCESS_KEY_ID'] = '';
      conf['process.env']['AWS_SECRET_ACCESS_KEY'] =
        '';
      conf['process.env']['AWS_REGION'] = '';
      conf['process.env']['AWS_BUCKET'] = '';
      return args;
    });
    // config.module.rules.delete('eslint');
    config.module.rules.delete('svg');
    // config.module
    //   .rule('walletConnect')
    //   .test(/node_modules[\\/]@walletconnect/)
    //   .use('babel-loader')
    //   .loader('babel-loader');
    // Use multi-loader to load AVIF images
    // config.module
    //   .rule('avif')
    //   .test(/\.(avif)$/i)
    //   .use('file-loader')
    //   .loader('file-loader')
    //   .options({
    //     name: 'images/[name].[ext]',
    //     esModule: false,
    //     mimetype: 'image/avif',
    //   });
    // .end();
    // config.module
    //   .rule('svg-sprite-loader')
    //   .test(/\.svg$/)
    //   .include.add(path.join(__dirname, './src/assets/svgs'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'svg-[name]',
    //   });
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpg|jpeg|JPEG|avif|gif)$/i)
    //   .use('file-loader')
    //   .loader('file-loader')
    //   .options({
    //     limit: '10*1024',
    //     // name: '[path]/[name].[ext]',
    //     esModule: false,
    //   })
    //   .end();
  },
});
