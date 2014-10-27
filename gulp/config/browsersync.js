config = require('./general');

module.exports = {
    server: {
        // We're serving the src folder as well
        // for sass sourcemap linking
        baseDir: [config.paths.example, config.paths.src]
    },
    files: [
        config.paths.build + "/**",
        // Exclude Map files
        "!" + config.paths.build + "/**.map"
    ]
}