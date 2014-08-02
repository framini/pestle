(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    Ext = {
      initialize: function(app) {
        return app.extensions.mvc = function() {
          return console.log("Inicializada la componente de Backbone");
        };
      }
    };
    return Ext;
  });

}).call(this);
