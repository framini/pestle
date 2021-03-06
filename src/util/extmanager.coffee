###*
 * The Extension Mananger will provide the base set of functionalities
 * to make the Core library extensible.
 * @author Francisco Ramini <framini at gmail.com>
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, ExtManager) ->

    Base = require('../base.coffee')

    class ExtManager

        ###*
         * Defaults configs for the module
         * @type {[type]}
        ###
        _extensionConfigDefaults:
            activated : true # unless said otherwise, every added extension
                             # will be activated on start

        constructor: () ->
            # to keep track of all extensions
            @_extensions = []

            # to keep track of all initialized extension
            @_initializedExtensions = []

        add: (ext) ->

            # checks if the name for the extension have been defined.
            # if not log a warning message
            unless ext.name
                msg = "The extension doesn't have a name associated. It will be hepfull " +
                      "if you have assing all of your extensions a name for better debugging"
                Base.log.warn msg

            # Lets throw an error if we try to initialize the same extension twices
            Base.util.each @_extensions, (xt, i) ->
                if _.isEqual xt, ext
                    throw new Error("Extension: " + ext.name + " already exists.")

            @_extensions.push(ext)

        init : (context) ->
            xtclone = Base.util.clone @_extensions

            Base.log.info "Added extensions (still not initialized):"
            Base.log.debug xtclone

            @_initExtension(@_extensions, context)

            Base.log.info "Initialized extensions:"
            Base.log.debug @_initializedExtensions

        _initExtension : (extensions, context) ->

            if extensions.length > 0

                xt = extensions.shift()

                # Call extensions constructor
                if @_isExtensionAllowedToBeActivated(xt, context.config)
                    # this state could tell to the rest of the world if
                    # extensions has been initialized or not
                    xt.activated = true

                    # call to the extension initialize method
                    xt.initialize(context)

                    # Keep track of the initialized extensions for future reference
                    @_initializedExtensions.push xt
                else
                    xt.activated = false

                # call this method recursively until there are no more
                # elements in the array
                @_initExtension(extensions, context)

        _isExtensionAllowedToBeActivated: (xt, config) ->

            # first we have to make sure that the "options" key is defined
            # by the extension
            unless xt.optionKey
                msg = "The optionKey is required and was not defined by: " + xt.name
                Base.log.error msg
                throw new Error(msg)

            # if options were provided to the extension, lets check just for "activated"
            # which is the only option that should matter within this method
            if config.extension and config.extension[xt.optionKey] and
                                    config.extension[xt.optionKey].hasOwnProperty 'activated'
                activated = config.extension[xt.optionKey].activated
            else
                activated = @_extensionConfigDefaults.activated

            return activated


        getInitializedExtensions : () ->
            return @_initializedExtensions

        getInitializedExtensionByName : (name) ->
            Base.util.where @_initializedExtensions, optionKey: name

        getExtensions : () ->
            return @_extensions

        getExtensionByName : (name) ->
            Base.util.where @_extensions, optionKey: name

    return ExtManager

)
