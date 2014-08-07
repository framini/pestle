(function() {
  (function(root, factory) {
    return module.exports = root.NGL = factory(root, {});
  })(window, function(root, NGL) {
    var Base, ExtManager;
    Base = require('./base.coffee');
    ExtManager = require('./extmanager.coffee');
    _.extend(NGL, Backbone.Events);
    NGL.Core = (function() {
      Core.prototype.version = "0.0.1";

      function Core() {
        this.extManager = new ExtManager();
        this.sandbox = Object.create(Base);
      }

      Core.prototype.addExtension = function(ext) {
        return this.extManager.add(ext);
      };

      Core.prototype.start = function() {
        var Components;
        console.log("Start de Core");
        Components = require('./extension/components.coffee');
        this.extManager.add(Components);
        this.extManager.init(this);
        return Base.util.each(this.extManager.getInitializedExtensions(), function(i, ext) {
          if (ext && typeof ext.afterAppStarted === 'function') {
            return ext.afterAppStarted(this);
          }
        });
      };

      return Core;

    })();
    return NGL;
  });

}).call(this);
