module.exports =
    compile:
        options:
            sassDir: '<%= ng.rootFolder %>',
            cssDir: '<%= ng.buildFolder %>',
            imageDir: '<%= ng.rootFolder %>/etc/designs/lodges/global/images/',
            generatedImagesDir: 'etc/designs/lodges/global/images/',
            require: 'breakpoint'