(function() {
  (function(root, factory) {
    var Base;
    Base = require('./base.coffee');
    return module.exports = factory(root, Base, {});
  })(window, function(root, Base, NGL) {
    var ExtManager, _initExtension;
    ExtManager = (function() {
      ExtManager.prototype._extensions = [];

      function ExtManager() {}

      ExtManager.prototype.add = function(ext) {
        if (_.include(this._extensions, ext)) {
          throw new Error("Extension: " + ext + " already exists.");
        }
        return this._extensions.push(ext);
      };

      ExtManager.prototype.init = function(context) {
        return console.log(this._extensions);
      };

      return ExtManager;

    })();
    _initExtension = function() {};
    return ExtManager;
  });

}).call(this);
