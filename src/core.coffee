((root, factory) ->

    Base = require('./base.coffee')
    ExtManager = require('./extmanager.coffee')

    factory(root, Base, ExtManager, exports)

)(window, (root, Base, ExtManager, NGL) ->

    # we'll use the NGL object as the global Event bus
    _.extend NGL, Backbone.Events

    class root.Core
        # current version of the library
        version: "0.0.1"

        constructor: () ->
            @extManager = new ExtManager.ExtManager()

        addExtension: (ext) ->
            # @extManager.add(ext)

        start: () ->
            console.log("Start de Core")

            NGL.trigger("app:extensions:init")

    # This shouldn't be here
    app = new root.Core()
    app.start()
    ##

    return NGL
)