((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    class Component

        @startAll: (components) ->

        @parseList: (components) ->

    ##
    # returns an object with the initialize method that will init the extension
    ##

    # constructor
    initialize : (app) ->

        console.log "Inicializada la componente de Componentes"

        app.sandbox.startComponents = (list) ->



    # this method will be called once all the extensions have been loaded
    afterAppStarted: (app) ->

        console.log "Llamando al afterAppStarted"
)