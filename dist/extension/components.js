(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    var Component;
    Component = (function() {
      function Component() {}

      Component.startAll = function(components) {};

      Component.parseList = function(components) {};

      return Component;

    })();
    return {
      initialize: function(app) {
        console.log("Inicializada la componente de Componentes");
        return app.sandbox.startComponents = function(list) {};
      },
      afterAppStarted: function(app) {
        return console.log("Llamando al afterAppStarted");
      }
    };
  });

}).call(this);
