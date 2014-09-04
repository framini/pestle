module.exports =
    compile:
        options:
            namespace: "JST"
            processName: ( path ) ->
                path.replace /(.*\/)|(\.handlebars)/g, ""
        files: [
            expand: true,
            flatten: false,
            cwd: './',
            src: ['src/**/*.handlebars', 'example/**/*.handlebars'],
            dest: '<%= ng.buildFolder %>',
            ext: '.js'
        ]