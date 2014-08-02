((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Ext = 
        initialize : (app) ->
            app.extensions.mvc = () ->
                console.log "Inicializada la componente de Backbone"

    return Ext
)