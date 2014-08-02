(function() {
  (function(root, factory) {
    return factory(root, root.NGL.Base, root.NGL);
  })(this, function(root, Base, NGL) {
    NGL.on('app:extensions:init', function() {
      console.log("HAGO algo?");
      return NGL.Core.addExtension({
        init: console.log("Inicializada la componente de Backbone")
      });
    });
    return NGL;
  });

}).call(this);
