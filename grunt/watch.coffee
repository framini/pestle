module.exports =
    coffee:
        files: [
            'src/**/*.coffee'
        ]
        tasks: [
            'coffee:compile',
            'browserify',
            'coffeelint'
        ]
        options:
            livereload: true

    js:
        files: ['/']
        options:
            livereload: true

    compass:
        files: ['src/*.{scss,sass}']
        tasks: ['compass:server']

    css:
        files: ['dist/style.css']
        options:
            livereload: true

    handlebars:
        files: 'src/**/*.handlebars'
        tasks: [
            'handlebars:compile'
        ]
        options:
            livereload: true