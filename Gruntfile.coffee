module.exports = (grunt) ->

    require('load-grunt-config') grunt,
        init : true
        data :
            pkg : grunt.file.readJSON 'package.json'
            ng : 
                rootFolder: 'src'
                buildFolder: 'dist'
                pkg: grunt.file.readJSON 'package.json'
                projectName : 'platform-sdk'

    grunt.registerTask 'compile', [
        'compass:compile'
        'coffee:compile'
        'handlebars:compile'
    ]

    grunt.registerTask 'test', [
        'coffeelint'
    ]