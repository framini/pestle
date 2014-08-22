(function() {
  var Hero;

  Hero = Backbone.View.extend({
    template: JST['herotmpl'],
    initialize: function() {}
  });

  NGL.modules.Hero = {
    initialize: function() {
      var m;
      this.log = this.sandbox.log;
      this.log.info("Inicializada la componente HERO");
      this.log.info("ESTO SERIA EL SANDBOX DEL MODULO HERO");
      this.log.debug(this.sandbox);
      this.log.info("ESTO SERIA LAS OPCIONES DEL MODULO HERO");
      this.log.debug(this.options);
      this.sandbox.mvc.mixin(Hero, this.sandbox.mvc.BaseView);
      m = new Backbone.Model(this.options);
      this.H = new Hero({
        model: m
      });
      this.log.info("ESTO SERIA la CLASE HERO EXTENDIDA");
      this.log.debug(this.H);
      return this.render();
    },
    render: function() {
      this.log.info("ESTOY EN EL METODO RENDER");
      return $('body').append(this.H.render().$el);
    }
  };

}).call(this);
