module.exports =
    dist:
        files:
            '<%= ng.distFolder %>/pestle.js': ['src/base.coffee', 'src/extmanager.coffee', 'src/core.coffee', 'extension/*.coffee']

        options:
            transform: ['coffeeify']
            extensions: ['.coffee']
            browserifyOptions:
                debug : false

    dev:
        files:
            '<%= ng.buildFolder %>/pestle.js': ['src/base.coffee', 'src/extmanager.coffee', 'src/core.coffee', 'extension/*.coffee']

        options:
            transform: ['coffeeify']
            extensions: ['.coffee']
            browserifyOptions:
                debug : true

    karma:
        dest: '<%= ng.buildFolder %>/specs-bundle.js'
        src: 'spec/**/*.coffee'
        options:
            transform: ['coffeeify']
            debug: false
            multifile: true