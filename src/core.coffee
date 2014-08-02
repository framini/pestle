((root, factory) ->

    Base = require('./base.coffee')
    ExtManager = require('./extmanager.coffee')

    module.exports = root.NGL = factory(root, Base, ExtManager, {})

)(window, (root, Base, ExtManager, NGL) ->

    # we'll use the NGL object as the global Event bus
    _.extend NGL, Backbone.Events

    class NGL.Core
        # current version of the library
        version: "0.0.1"

        constructor: () ->
            @extManager = new ExtManager()

        addExtension: (ext) ->
            @extManager.add(ext)

        start: () ->
            console.log("Start de Core")

            @extManager.init(@)

            # NGL.trigger("app:extensions:init")

    return NGL
)