(function() {
  (function(root, factory) {
    return module.exports = root.NGL = factory(root, {});
  })(window, function(root, NGL) {
    var Base, ExtManager;
    Base = require('./base.coffee');
    ExtManager = require('./extmanager.coffee');
    _.extend(NGL, Backbone.Events);
    NGL.modules = {};
    NGL.Core = (function() {
      Core.prototype.version = "0.0.1";

      Core.prototype.cfg = {
        debug: {
          logLevel: 5
        }
      };

      function Core(config) {
        if (config == null) {
          config = {};
        }
        this.config = Base.util._.defaults(config, this.cfg);
        Base.log.setLevel(this.config.debug.logLevel);
        this.extManager = new ExtManager();
        this.sandbox = Object.create(Base);
        this.sandboxes = {};
      }

      Core.prototype.addExtension = function(ext) {
        return this.extManager.add(ext);
      };

      Core.prototype.start = function(options) {
        var BackboneExt, Components,
          _this = this;
        Base.log.info("Start de Core");
        Components = require('./extension/components.coffee');
        BackboneExt = require('./extension/backbone.ext.coffee');
        this.extManager.add(Components);
        this.extManager.add(BackboneExt);
        this.extManager.init(this);
        return Base.util.each(this.extManager.getInitializedExtensions(), function(i, ext) {
          if (ext && typeof ext.afterAppStarted === 'function') {
            return ext.afterAppStarted(_this);
          }
        });
      };

      Core.prototype.createSandbox = function(name, opts) {
        return this.sandboxes[name] = Object.create(this.sandbox);
      };

      return Core;

    })();
    return NGL;
  });

}).call(this);
