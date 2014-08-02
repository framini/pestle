((root, factory) ->

    Base = require('./base.coffee')

    module.exports = factory(root, Base, {})

)(window, (root, Base, NGL) ->

    

    class ExtManager

        _extensions: []

        constructor: () ->

        add: (ext) ->

            if _.include(this._extensions, ext) then throw new Error("Extension: " + ext + " already exists.")

            @_extensions.push(ext)

        init : (context) ->
            console.log @_extensions

    _initExtension = () ->

    return ExtManager

)