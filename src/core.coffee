((root, factory) ->

    module.exports = root.NGL = factory(root, {})

)(window, (root, NGL) ->

    Base = require('./base.coffee')
    ExtManager = require('./extmanager.coffee')

    # we'll use the NGL object as the global Event bus
    _.extend NGL, Backbone.Events

    # Namespace for module definition
    NGL.modules = {}

    class NGL.Core
        # current version of the library
        version: "0.0.1"

        cfg:
            debug: 
                logLevel: 5 # by default the logging is disabled
                            # values can go from 0 to 5 (5 means disabled)

        constructor: (config = {}) ->

            @config = Base.util._.defaults config, @cfg

            # Set the logging level for the app
            Base.log.setLevel(@config.debug.logLevel)

            # The extension manager will be on charge of loading extensions
            # and make its functionality available to the stack
            @extManager = new ExtManager()

            # through this object the modules will be accesing the method defined by the 
            # extensions
            @sandbox = Object.create(Base)

            # namespace to hold all the sandboxes
            @sandboxes = {}



        addExtension: (ext) ->
            @extManager.add(ext)

        start: () ->
            Base.log.info("Start de Core")

            # Require core extensions
            Components = require('./extension/components.coffee')
            BackboneExt = require('./extension/backbone.ext.coffee')

            # Add core extensions to the app
            @extManager.add(Components)
            @extManager.add(BackboneExt)

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

        createSandbox: (name, opts) ->
            @sandboxes[name] = Object.create(@.sandbox)


    return NGL
)