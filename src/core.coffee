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

            # Require core extensions
            Components = require('./extension/components.coffee')

            # Add core extensions to the app
            @extManager.add(Components)

            # Init all the extensions
            @extManager.init(@)

            # Once the extensions have been initialized, lets call the afterAppStarted 
            # from each extension
            # Note: This method will let each extension to automatically execute some code
            #       once the app has started. 
            Base.util.each @extManager.getInitializedExtensions(), (i, ext) =>
                # Since this method is not required lets check if it's defined
                if ext && typeof ext.afterAppStarted == 'function'
                    ext.afterAppStarted(@)

            # console.log @sandbox.mvc()

            # console.log @sandbox.mvc.BaseView

            # pepe = Object.create(@sandbox)

            # asd = do(pepe) ->
            #     console.log "sanbox unico"
            #     console.log pepe.mvc.BaseView

            # NGL.trigger("app:extensions:init")

    return NGL
)