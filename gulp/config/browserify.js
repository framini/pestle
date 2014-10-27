config = require('./general');

module.exports = {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.coffee', '.handlebars'],
    // Name used for standalone mode
    moduleName: 'pestle',
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
        entries: './src/core.coffee',
        dest: config.paths.build,
        outputName: 'pestle.js',
        dist: true
    }, {
        entries: './example/module/searchahead.coffee',
        dest: config.paths.build,
        outputName: 'searchahead.js',
        dist: ''
    }]
}