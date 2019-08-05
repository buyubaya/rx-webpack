const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'development';
const CONSTANTS = require('./constants')(environment);
// PLUGINS & LOADERS
const plugins = require('./webpack.plugins')(
    {
        environment: environment,
        devtools: isProduction ? false : true
    }
);
const loaders = require('./webpack.loaders')(
    {
        environment: environment,
        devtools: isProduction ? false : true
    }
);
// COMMON CONFIG
let config = {
    mode: environment,
    entry: CONSTANTS.entryPath,
    output: {
        path: CONSTANTS.outputPath,
        publicPath: CONSTANTS.outputPublicPath,
        filename: CONSTANTS.jsBundleFileName
    },
    plugins: plugins,
    module: {
        rules: loaders
    },
    resolve: {
        alias: {
            '@': CONSTANTS.srcPath
        }
    }
};


if(isProduction){
    const TerserPlugin = require('terser-webpack-plugin');
    const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

    config = {
        ...config,
        optimization: {
            minimize: true,
            noEmitOnErrors: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            inline: 2
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        }
    };
}
else {
    const devServer = require('./webpack.devServer.js');

    config = {
        ...config,
        devtool: 'cheap-module-eval-source-map',
        devServer
    };
}


module.exports = config;