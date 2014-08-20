(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NGL.modules.Hero = {
    initialize: function() {
      var H, Hero;
      console.log("Inicializada la componente HERO");
      console.log("ESTO SERIA EL SANDBOX DEL MODULO HERO");
      console.log(this.sandbox);
      console.log("ESTO SERIA LAS OPCIONES DEL MODULO HERO");
      console.log(this.options);
      Hero = (function(_super) {
        __extends(Hero, _super);

        function Hero() {
          console.log("Constructor de la clase Hero");
        }

        return Hero;

      })(this.sandbox.mvc.BaseView);
      H = new Hero();
      console.log("ESTO SERIA la CLASE HERO EXTENDIDA");
      console.log(H);
      return this.render();
    },
    render: function() {
      return console.log("ESTOY EN EL METODO RENDER");
    }
  };

}).call(this);
