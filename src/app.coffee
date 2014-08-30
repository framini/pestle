c = new NGL.Core(
    debug:
        logLevel: 0
)

# An extension could be loaded this way in case app.coffee was defined
# within a browserify env
# bbExt = require('./extension/backbone.ext.coffee')
# c.addExtension(bbExt)

c.start()