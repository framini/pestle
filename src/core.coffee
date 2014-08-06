((root, factory) ->

    module.exports = root.NGL = factory(root, {})

)(window, (root, NGL) ->

    Base = require('./base.coffee')
    ExtManager = require('./extmanager.coffee')

    # we'll use the NGL object as the global Event bus
    _.extend NGL, Backbone.Events

    class NGL.Core
        # current version of the library
        version: "0.0.1"

        constructor: () ->
            @extManager = new ExtManager()

            @sandbox = Object.create(Base)

        addExtension: (ext) ->
            @extManager.add(ext)

        start: () ->
            console.log("Start de Core")

            @extManager.init(@)

            # console.log @sandbox.mvc()

            # console.log @sandbox.mvc.BaseView

            # pepe = Object.create(@sandbox)

            # asd = do(pepe) ->
            #     console.log "sanbox unico"
            #     console.log pepe.mvc.BaseView

            # NGL.trigger("app:extensions:init")

    return NGL
)