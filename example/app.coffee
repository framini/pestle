c = new NGS.Core(
    debug:
        logLevel: 0
    extension:
        "responsiveimages" :
            "availableWidths": [133,152,162,225,210,224,280,352,470,536,590,676,710,768,885,945,1190]
)

# An extension could be loaded this way in case app.coffee was defined
# within a browserify env
# bbExt = require('./extension/backbone.ext.coffee')
# c.addExtension(bbExt)

c.start()