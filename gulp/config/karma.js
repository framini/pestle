var generalConfig = require('./general')

module.exports = function(config) {
    config.set({

        basePath:           '../../',

        autoWatch:          false,
        colors:             true,
        logLevel:           config.LOG_INFO,
        port:               9876,
        reportSlowerThan:   500,
        singleRun: true,

        frameworks: [
            'browserify',
            'mocha', 
            'mocha-debug', 
            'sinon-chai',
            'fixture'
        ],

        reporters: ['mocha'],

        browsers: ['PhantomJS'],

        files: [
            {
                pattern: 'spec/fixtures/**/*',
            },
            'node_modules/jquery/dist/jquery.js',
            'node_modules/chai-jquery/chai-jquery.js',
            'node_modules/underscore/underscore.js',

            'spec/**/*_spec.coffee'
        ],

        preprocessors: {
            'spec/**/*.coffee': ['browserify'],
            '**/*.html'   : ['html2js'],
            '**/*.json'   : ['html2js']
        },
        // browserify configuration
        browserify: {
          debug: true
        }
    })
}