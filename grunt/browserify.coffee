module.exports =
    dist:
        files:
            'dist/sdk.js': ['src/base.coffee', 'src/extmanager.coffee', 'src/core.coffee', 'extension/*.coffee']

        options:
            transform: ['coffeeify']
            extensions: ['.coffee']
            browserifyOptions:
                debug : false

    dev:
        files:
            'dist/sdk.js': ['src/base.coffee', 'src/extmanager.coffee', 'src/core.coffee', 'extension/*.coffee']

        options:
            transform: ['coffeeify']
            extensions: ['.coffee']
            browserifyOptions:
                debug : true

    karma:
        dest: 'dist/specs-bundle.js'
        src: 'test/**/*.coffee'
        options:
            transform: ['coffeeify']
            debug: false
            multifile: true