module.exports =
    compile:
        options:
            namespace: "JST"
            processName: ( path ) ->
                path.replace /(.*\/)|(\.handlebars)/g, ""
        files: [
            expand: true,
            flatten: false,
            cwd: '<%= ng.rootFolder %>',
            src: ['**/*.handlebars'],
            dest: '<%= ng.buildFolder %>',
            ext: '.js'
        ]