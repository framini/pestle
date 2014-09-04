module.exports =
    compile:
        expand: true,
        flatten: false,
        cwd: './',
        src: ['src/**/*.coffee', 'example/**/*.coffee'],
        dest: '<%= ng.buildFolder %>',
        ext: '.js'