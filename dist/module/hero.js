(function() {
  var Hero;

  Hero = Backbone.View.extend({
    initialize: function() {}
  });

  NGL.modules.Hero = {
    initialize: function() {
      var H;
      this.log = this.sandbox.log;
      this.log.info("Inicializada la componente HERO");
      this.log.info("ESTO SERIA EL SANDBOX DEL MODULO HERO");
      this.log.debug(this.sandbox);
      this.log.info("ESTO SERIA LAS OPCIONES DEL MODULO HERO");
      this.log.debug(this.options);
      this.sandbox.mvc.mixin(Hero, this.sandbox.mvc.BaseView);
      H = new Hero;
      this.log.info("ESTO SERIA la CLASE HERO EXTENDIDA");
      this.log.debug(H);
      return this.render();
    },
    render: function() {
      return this.log.info("ESTOY EN EL METODO RENDER");
    }
  };

}).call(this);
