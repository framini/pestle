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
            'bower_components/jquery/dist/jquery.js',
            'bower_components/chai-jquery/chai-jquery.js',
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js',
            'bower_components/handlebars/handlebars.js',

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