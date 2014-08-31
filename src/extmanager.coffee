((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, NGL) ->

    Base = require('./base.coffee')

    class ExtManager

        _extensions: []

        _initializedExtensions: []

        constructor: () ->

        add: (ext) ->

            # checks if the name for the extension have been defined.
            # if not log a warning message
            unless ext.name
                msg = "The extension doesn't have a name associated. It will be hepfull " +
                      "if you have assing all of your extensions a name for better debugging"
                Base.log.warn msg

            # Lets throw an error if we try to initialize the same extension twices
            if _.include(this._extensions, ext) then throw new Error("Extension: " + ext.name + " already exists.")

            @_extensions.push(ext)

        init : (context) ->
            Base.log.info @_extensions

            @_initExtension(@_extensions, context)
    
        _initExtension : (extensions, context) ->

            if extensions.length > 0

                xt = extensions.shift()

                # Call extensions constructor
                xt.initialize(context)

                # Keep track of the initialized extensions for future reference
                @_initializedExtensions.push xt

                @_initExtension(extensions, context)

        getInitializedExtensions : () ->
            return @_initializedExtensions

    return ExtManager

)