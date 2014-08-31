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
        var msg;
        if (!ext.name) {
          msg = "The extension doesn't have a name associated. It will be hepfull " + "if you have assing all of your extensions a name for better debugging";
          Base.log.warn(msg);
        }
        if (_.include(this._extensions, ext)) {
          throw new Error("Extension: " + ext.name + " already exists.");
        }
        return this._extensions.push(ext);
      };

      ExtManager.prototype.init = function(context) {
        Base.log.info(this._extensions);
        return this._initExtension(this._extensions, context);
      };

      ExtManager.prototype._initExtension = function(extensions, context) {
        var xt;
        if (extensions.length > 0) {
          xt = extensions.shift();
          xt.initialize(context);
          this._initializedExtensions.push(xt);
          return this._initExtension(extensions, context);
        }
      };

      ExtManager.prototype.getInitializedExtensions = function() {
        return this._initializedExtensions;
      };

      return ExtManager;

    })();
    return ExtManager;
  });

}).call(this);
