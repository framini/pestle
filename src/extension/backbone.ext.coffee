((root, factory) ->

    factory(root, root.NGL.Base, root.NGL)

)(this, (root, Base, NGL) ->

    NGL.on('app:extensions:init', () ->
        console.log "HAGO algo?"
        NGL.Core.addExtension
            init : 
                console.log "Inicializada la componente de Backbone"

    )

    return NGL
)