c = new NGL.Core()

bbExt = require('./extension/backbone.ext.coffee')

c.addExtension(bbExt)

c.start()

