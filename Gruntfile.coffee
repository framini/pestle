module.exports = (grunt) ->

    require('load-grunt-config') grunt,
        init : true
        data :
            pkg : grunt.file.readJSON 'package.json'
            ng : 
                rootFolder: 'src'
                buildFolder: '.tmp'
                distFolder: 'dist'
                pkg: grunt.file.readJSON 'package.json'
                projectName : 'platform-sdk'


    grunt.registerTask 'dist', [
        'browserify:dist',
        'browserify:karma'
        'coffeelint'
        'karma:continuous'
    ]

    grunt.registerTask 'server', (target) ->

        grunt.task.run [
            'coffee:compile',
            'browserify:dev'
            'browserify:karma'
            'apimocker'
            'compass:server'
            'handlebars:compile'
            'coffeelint'
            'karma:dev'
            'connect:livereload'
            'watch'
        ]