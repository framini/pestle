(function() {
  (function(root, factory) {
    var Base, ExtManager;
    Base = require('./base.coffee');
    ExtManager = require('./extmanager.coffee');
    return factory(root, Base, ExtManager, exports);
  })(window, function(root, Base, ExtManager, NGL) {
    var app;
    _.extend(NGL, Backbone.Events);
    root.Core = (function() {
      Core.prototype.version = "0.0.1";

      function Core() {
        this.extManager = new ExtManager.ExtManager();
      }

      Core.prototype.addExtension = function(ext) {};

      Core.prototype.start = function() {
        console.log("Start de Core");
        return NGL.trigger("app:extensions:init");
      };

      return Core;

    })();
    app = new root.Core();
    app.start();
    return NGL;
  });

}).call(this);
