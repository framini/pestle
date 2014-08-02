((root, factory) ->

    factory(root, exports)

)(this, (root, NGL) ->

    Base = require('./base.coffee')

    class NGL.ExtManager

        _extensions: []

        constructor: () ->

        add: (ext) ->

            if _.include(this._extensions, ext) then throw new Error("Extension: " + ext + " already exists.")

            @_extensions.push(ext)

        _initExtension : (context) ->
)