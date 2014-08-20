##
# returns an object with the initialize method that will init the module
# Note: This is an example on how to define a component outside a browserify
# build
##

NGL.modules.Hero =

    # constructor
    initialize : () ->

        console.log "Inicializada la componente HERO"

        console.log "ESTO SERIA EL SANDBOX DEL MODULO HERO"
        console.log this.sandbox

        console.log "ESTO SERIA LAS OPCIONES DEL MODULO HERO"
        console.log this.options

        class Hero extends this.sandbox.mvc.BaseView

            constructor : () ->
                console.log "Constructor de la clase Hero"

        H = new Hero()

        console.log "ESTO SERIA la CLASE HERO EXTENDIDA"
        console.log H

        this.render()

    render: () ->
        console.log "ESTOY EN EL METODO RENDER"