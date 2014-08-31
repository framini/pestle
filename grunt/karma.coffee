module.exports =
    options:
        configFile: 'karma.conf.js'
        runnerPort: 9999
        browsers: ['PhantomJS']
    continuous:
        singleRun: true
        browsers: ['PhantomJS']
    dev:
        reporters: 'dots'
        background: true