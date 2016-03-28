module.exports = {
    entry: [
        './index'
    ],
    output: {
        path: 'dist/',
        filename: 'index.js',
        libraryTarget: 'commonjs',
    },
    externals: {
        'q': 'q',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            }
        ]
    }
}
