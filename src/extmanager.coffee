((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, NGL) ->

    Base = require('./base.coffee')

    class ExtManager

        _extensions: []

        _initializedExtensions: []

        constructor: () ->

        add: (ext) ->

            if _.include(this._extensions, ext) then throw new Error("Extension: " + ext + " already exists.")

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