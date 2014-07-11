module.exports =
    compile:
        expand: true,
        flatten: false,
        cwd: '<%= ng.rootFolder %>',
        src: ['**/*.coffee'],
        dest: '<%= ng.buildFolder %>',
        ext: '.js'