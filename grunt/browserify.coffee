module.exports =
    dist:
        files:
            'dist/sdk.js': ['src/base.coffee', 'src/extmanager.coffee', 'src/core.coffee', 'extension/*.coffee']

        options:
            transform: ['coffeeify']
            extensions: ['.coffee']