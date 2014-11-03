###*
 * The core layer will depend on the base layer and will provide
 * the core set of functionality to application framework
 * @author Francisco Ramini <framini at gmail.com>
###
((root, factory) ->

    module.exports = root.NGS = factory(root, {})

)(window, (root, NGS) ->

    Base       = require('./base.coffee')
    ExtManager = require('./util/extmanager.coffee')

    # we'll use the NGS object as the global Event bus
    NGS = new Base.Events()

    NGS.Module = require('./util/module.coffee')

    # Namespace for module definition
    NGS.modules = {}

    class NGS.Core
        # current version of the library
        version: "0.0.1"

        cfg:
            debug:
                logLevel: 5 # by default the logging will be disabled
                            # values can go from 0 to 5 (5 means disabled)
            namespace: 'platform'

            extension: {} # define the namespace to define extension specific settings

        constructor: (config = {}) ->

            @config = Base.util.defaults config, @cfg

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
            @sandbox = Base.util.clone Base

            # namespace to hold all the sandboxes
            @sandboxes = {}

            # Require core extensions
            Components = require('./extension/components.coffee')
            ResponsiveDesign = require('./extension/responsivedesign.coffee')
            ResponsiveImages = require('./extension/responsiveimages.coffee')

            # Add core extensions to the app
            @extManager.add(Components)
            @extManager.add(ResponsiveDesign)
            @extManager.add(ResponsiveImages)

        addExtension: (ext) ->
            # we'll only allow to add new extensions before
            # the Core get started
            unless @started
                @extManager.add(ext)
            else
                Base.log.error("The Core has already been started. You can not add new extensions at this point.")
                throw new Error('You can not add extensions when the Core has already been started.')

        start: (options) ->

            Base.log.info("Start de Core")

            @started = true

            # Init all the extensions
            @extManager.init(@)

            # Callback object that is gonna hold functions to be executed
            # after all extensions has been initialized and the each afterAppStarted
            # method executed
            cb = $.Callbacks "unique memory"

            # Once the extensions have been initialized, lets call the afterAppStarted
            # from each extension
            # Note: This method will let each extension to automatically execute some code
            #       once the app has started.
            Base.util.each @extManager.getInitializedExtensions(), (ext, i) =>

                if ext

                    if Base.util.isFunction ext.afterAppStarted
                        ext.afterAppStarted(@)

                    if Base.util.isFunction ext.afterAppInitialized
                        cb.add ext.afterAppInitialized

            # Call the .afterAppInitialized callbacks with @ as parameter
            cb.fire @

        createSandbox: (name, opts) ->
            @sandboxes[name] = Base.util.extend {}, @sandbox, name : name

        getInitializedComponents: () ->
            @sandbox.getInitializedComponents()


    return NGS
)
