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
                logLevel: 5 # by default the logging will be disabled
                            # values can go from 0 to 5 (5 means disabled)
            namespace: 'lodges' # TODO: change this to 'platform'

            extension: {} # define the namespace to define extension specific settings

        constructor: (config = {}) ->

            @config = Base.util._.defaults config, @cfg

            # this will track the state of the Core. When it is
            # true, it means the "start()" has been called
            @started = false

            # Set the logging level for the app
            Base.log.setLevel(@config.debug.logLevel)

            # The extension manager will be on charge of loading extensions
            # and make its functionality available to the stack
            @extManager = new ExtManager()

            # through this object the modules will be accesing the methods defined by the
            # extensions
            @sandbox = _.clone Base

            # namespace to hold all the sandboxes
            @sandboxes = {}

        addExtension: (ext) ->
            # we'll only allow to add new extensions before
            # the Core get started
            unless @started
                @extManager.add(ext)
            else
                Base.log.error("The Core has already been started. You could not add new extensions at this point.")
                throw new Error('You could not add extensions when the Core has already been started.')

        start: (options) ->

            Base.log.info("Start de Core")

            @started = true

            # Require core extensions
            Components = require('./extension/components.coffee')
            BackboneExt = require('./extension/backbone.ext.coffee')
            ResponsiveDesign = require('./extension/responsivedesign.coffee')


            # Add core extensions to the app
            @extManager.add(Components)
            @extManager.add(BackboneExt)
            @extManager.add(ResponsiveDesign)

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
            @sandboxes[name] = _.extend {}, @sandbox, name : name


    return NGL
)