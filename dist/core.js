(function() {
  (function(root, factory) {
    var Base, ExtManager;
    Base = require('./base.coffee');
    ExtManager = require('./extmanager.coffee');
    return module.exports = root.NGL = factory(root, Base, ExtManager, {});
  })(window, function(root, Base, ExtManager, NGL) {
    _.extend(NGL, Backbone.Events);
    NGL.Core = (function() {
      Core.prototype.version = "0.0.1";

      function Core() {
        this.extManager = new ExtManager();
      }

      Core.prototype.addExtension = function(ext) {
        return this.extManager.add(ext);
      };

      Core.prototype.start = function() {
        console.log("Start de Core");
        return this.extManager.init(this);
      };

      return Core;

    })();
    return NGL;
  });

}).call(this);
