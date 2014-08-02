(function() {
  (function(root, factory) {
    return factory(root, exports);
  })(this, function(root, NGL) {
    var Base;
    Base = require('./base.coffee');
    return NGL.ExtManager = (function() {
      ExtManager.prototype._extensions = [];

      function ExtManager() {}

      ExtManager.prototype.add = function(ext) {
        if (_.include(this._extensions, ext)) {
          throw new Error("Extension: " + ext + " already exists.");
        }
        return this._extensions.push(ext);
      };

      ExtManager.prototype._initExtension = function(context) {};

      return ExtManager;

    })();
  });

}).call(this);
