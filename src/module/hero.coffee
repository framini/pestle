Hero = Backbone.View.extend

    initialize: () ->
        # Base.log.info "initialize del Hero"

##
# returns an object with the initialize method that will init the module
# Note: This is an example on how to define a component outside a browserify
# build
##

NGL.modules.Hero =

    # constructor
    initialize : () ->

        @log = @sandbox.log

        @log.info "Inicializada la componente HERO"

        @log.info "ESTO SERIA EL SANDBOX DEL MODULO HERO"
        @log.debug this.sandbox

        @log.info "ESTO SERIA LAS OPCIONES DEL MODULO HERO"
        @log.debug this.options

        # merge our view with the default "view" object that will
        # abstract some common behavior to all views
        @sandbox.mvc.mixin(Hero, @sandbox.mvc.BaseView)

        H = new Hero

        @log.info "ESTO SERIA la CLASE HERO EXTENDIDA"
        @log.debug H

        this.render()

    render: () ->
        @log.info "ESTOY EN EL METODO RENDER"