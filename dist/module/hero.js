(function() {
  var Hero;

  Hero = Backbone.View.extend({
    initialize: function() {
      return console.log("initialize del Hero");
    }
  });

  NGL.modules.Hero = {
    initialize: function() {
      var H;
      console.log("Inicializada la componente HERO");
      console.log("ESTO SERIA EL SANDBOX DEL MODULO HERO");
      console.log(this.sandbox);
      console.log("ESTO SERIA LAS OPCIONES DEL MODULO HERO");
      console.log(this.options);
      this.sandbox.mvc.mixin(Hero, this.sandbox.mvc.BaseView);
      H = new Hero;
      console.log("ESTO SERIA la CLASE HERO EXTENDIDA");
      console.log(H);
      return this.render();
    },
    render: function() {
      return console.log("ESTOY EN EL METODO RENDER");
    }
  };

}).call(this);
