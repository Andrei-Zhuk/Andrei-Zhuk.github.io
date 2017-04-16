const path = require('path');
module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, './temp/scripts'),
        filename: 'main-bundle.js'
    }
    // module: {
    //     loaders: [
    //         {
    //             loader: 'babel',
    //             query: {
    //                 presets: ['es2015']
    //             },
    //             test: /\.js$/,
    //             exclude: /node_modules/
    //         }
    //     ]
    // }
}
