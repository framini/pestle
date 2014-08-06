(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, NGL) {
    var Base, ExtManager;
    Base = require('./base.coffee');
    ExtManager = (function() {
      ExtManager.prototype._extensions = [];

      ExtManager.prototype._initializedExtensions = [];

      function ExtManager() {}

      ExtManager.prototype.add = function(ext) {
        if (_.include(this._extensions, ext)) {
          throw new Error("Extension: " + ext + " already exists.");
        }
        return this._extensions.push(ext);
      };

      ExtManager.prototype.init = function(context) {
        console.log(this._extensions);
        return this._initExtension(this._extensions, context);
      };

      ExtManager.prototype._initExtension = function(extensions, context) {
        var xt;
        if (extensions.length > 0) {
          xt = extensions.shift();
          this._initializedExtensions.push(xt.initialize(context));
          return this._initExtension(extensions, context);
        }
      };

      return ExtManager;

    })();
    return ExtManager;
  });

}).call(this);
