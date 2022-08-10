'use strict';

module.exports = (env, argv) => {
    const path = require('path');
    const TerserPlugin = require('terser-webpack-plugin')
    const pkg = require('package.json')

    /**
     * Environment
     *
     * @type {any}
     */
    const NODE_ENV = argv.mode || 'development'
    const VERSION = process.env.VERSION || pkg.version

    /**
     * Plugins for bundle
     *
     * @type {webpack}
     */
    const webpack = require('webpack')

    return {
        entry: '.src/contractsGeneratorEditor.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'contractsGeneratorEditor.js',
            library: {
                name: 'ContractsGeneratorEditor.js',
                type: "umd"
            },
        },

        watchOptions: {
            aggregateTimeout: 50
        },

        /**
         * Tell webpack what directories should be searched when resolving modules.
         */
        resolve: {
            modules: [path.join(__dirname, 'src'), 'node_modules'],
            extensions: ['.js', '.ts']
        },

        plugins: [
            /** Pass variables into modules */
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(NODE_ENV),
                VERSION: JSON.stringify(VERSION),
            }),

            new webpack.BannerPlugin({
                banner: 'HELLO BANNER PLUGIN',
            }),

        ],

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: true,
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: NODE_ENV === 'production' ? 'tsconfig.build.json' : 'tsconfig.json'
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    type: "asset/source"
                },
            ],
        },

        devtool: NODE_ENV === 'development' ? 'source-map' : false,

        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true
                }),
            ],
        },

        cache: true,

        stats: {
            errorDetails: true,
            entrypoints: true
        }
    };
};