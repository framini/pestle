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
        },
        namespace: 'lodges'
      };

      function Core(config) {
        if (config == null) {
          config = {};
        }
        this.config = Base.util._.defaults(config, this.cfg);
        this.started = false;
        Base.log.setLevel(this.config.debug.logLevel);
        this.extManager = new ExtManager();
        this.sandbox = Object.create(Base);
        this.sandboxes = {};
      }

      Core.prototype.addExtension = function(ext) {
        if (!this.started) {
          return this.extManager.add(ext);
        } else {
          Base.log.error("The Core has already been started. You could not add new extensions at this point.");
          throw new Error('You could not add extensions when the Core has already been started.');
        }
      };

      Core.prototype.start = function(options) {
        var BackboneExt, Components,
          _this = this;
        Base.log.info("Start de Core");
        this.started = true;
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
        return this.sandboxes[name] = _.extend(Object.create(this.sandbox), {
          name: name
        });
      };

      return Core;

    })();
    return NGL;
  });

}).call(this);
