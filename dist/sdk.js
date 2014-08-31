(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    if (typeof module === 'object' && module.exports && typeof require === 'function') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        root.log = definition();
    }
}(this, function () {
    var self = {};
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return noop;
        } else if (console[methodName] === undefined) {
            if (console.log !== undefined) {
                return boundToConsole(console, 'log');
            } else {
                return noop;
            }
        } else {
            return boundToConsole(console, methodName);
        }
    }

    function boundToConsole(console, methodName) {
        var method = console[methodName];
        if (method.bind === undefined) {
            if (Function.prototype.bind === undefined) {
                return functionBindingWrapper(method, console);
            } else {
                try {
                    return Function.prototype.bind.call(console[methodName], console);
                } catch (e) {
                    // In IE8 + Modernizr, the bind shim will reject the above, so we fall back to wrapping
                    return functionBindingWrapper(method, console);
                }
            }
        } else {
            return console[methodName].bind(console);
        }
    }

    function functionBindingWrapper(f, context) {
        return function() {
            Function.prototype.apply.apply(f, [context, arguments]);
        };
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function replaceLoggingMethods(methodFactory) {
        for (var ii = 0; ii < logMethods.length; ii++) {
            self[logMethods[ii]] = methodFactory(logMethods[ii]);
        }
    }

    function cookiesAvailable() {
        return (typeof window !== undefinedType &&
                window.document !== undefined &&
                window.document.cookie !== undefined);
    }

    function localStorageAvailable() {
        try {
            return (typeof window !== undefinedType &&
                    window.localStorage !== undefined &&
                    window.localStorage !== null);
        } catch (e) {
            return false;
        }
    }

    function persistLevelIfPossible(levelNum) {
        var localStorageFail = false,
            levelName;

        for (var key in self.levels) {
            if (self.levels.hasOwnProperty(key) && self.levels[key] === levelNum) {
                levelName = key;
                break;
            }
        }

        if (localStorageAvailable()) {
            /*
             * Setting localStorage can create a DOM 22 Exception if running in Private mode
             * in Safari, so even if it is available we need to catch any errors when trying
             * to write to it
             */
            try {
                window.localStorage['loglevel'] = levelName;
            } catch (e) {
                localStorageFail = true;
            }
        } else {
            localStorageFail = true;
        }

        if (localStorageFail && cookiesAvailable()) {
            window.document.cookie = "loglevel=" + levelName + ";";
        }
    }

    var cookieRegex = /loglevel=([^;]+)/;

    function loadPersistedLevel() {
        var storedLevel;

        if (localStorageAvailable()) {
            storedLevel = window.localStorage['loglevel'];
        }

        if (storedLevel === undefined && cookiesAvailable()) {
            var cookieMatch = cookieRegex.exec(window.document.cookie) || [];
            storedLevel = cookieMatch[1];
        }
        
        if (self.levels[storedLevel] === undefined) {
            storedLevel = "WARN";
        }

        self.setLevel(self.levels[storedLevel]);
    }

    /*
     *
     * Public API
     *
     */

    self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
        "ERROR": 4, "SILENT": 5};

    self.setLevel = function (level) {
        if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
            persistLevelIfPossible(level);

            if (level === self.levels.SILENT) {
                replaceLoggingMethods(function () {
                    return noop;
                });
                return;
            } else if (typeof console === undefinedType) {
                replaceLoggingMethods(function (methodName) {
                    return function () {
                        if (typeof console !== undefinedType) {
                            self.setLevel(level);
                            self[methodName].apply(self, arguments);
                        }
                    };
                });
                return "No console available for logging";
            } else {
                replaceLoggingMethods(function (methodName) {
                    if (level <= self.levels[methodName.toUpperCase()]) {
                        return realMethod(methodName);
                    } else {
                        return noop;
                    }
                });
            }
        } else if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
            self.setLevel(self.levels[level.toUpperCase()]);
        } else {
            throw "log.setLevel() called with invalid level: " + level;
        }
    };

    self.enableAll = function() {
        self.setLevel(self.levels.TRACE);
    };

    self.disableAll = function() {
        self.setLevel(self.levels.SILENT);
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    self.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === self) {
            window.log = _log;
        }

        return self;
    };

    loadPersistedLevel();
    return self;
}));

},{}],2:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Base) {
  Base.log = require('loglevel');
  Base.util = {
    each: $.each,
    extend: $.extend,
    uniq: root._.uniq,
    _: root._
  };
  return Base;
});



},{"loglevel":1}],3:[function(require,module,exports){
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
      var BackboneExt, Components;
      Base.log.info("Start de Core");
      this.started = true;
      Components = require('./extension/components.coffee');
      BackboneExt = require('./extension/backbone.ext.coffee');
      this.extManager.add(Components);
      this.extManager.add(BackboneExt);
      this.extManager.init(this);
      return Base.util.each(this.extManager.getInitializedExtensions(), (function(_this) {
        return function(i, ext) {
          if (ext && typeof ext.afterAppStarted === 'function') {
            return ext.afterAppStarted(_this);
          }
        };
      })(this));
    };

    Core.prototype.createSandbox = function(name, opts) {
      return this.sandboxes[name] = Object.create(this.sandbox);
    };

    return Core;

  })();
  return NGL;
});



},{"./base.coffee":2,"./extension/backbone.ext.coffee":4,"./extension/components.coffee":5,"./extmanager.coffee":6}],4:[function(require,module,exports){

/**
 * This extension should probably be defined at a project level, not here
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Ext) {
  var Base, BaseView, Renderer;
  Base = require('./../base.coffee');
  Renderer = {
    render: function(template, data) {
      if (!template) {
        Base.log.error("The template passed to the Renderer is not defined");
        return;
      }
      if (_.isFunction(template)) {
        return template(data);
      }
    }
  };
  BaseView = {
    initialize: function() {
      Base.log.info("initialize del BaseView");
      _.bindAll(this, 'render', 'renderWrapper');
      if (Base.util._.isFunction(this.beforeRender)) {
        _.bindAll(this, 'beforeRender');
      }
      if (Base.util._.isFunction(this.afterRender)) {
        _.bindAll(this, 'afterRender');
      }
      return this.render = Base.util._.wrap(this.render, this.renderWrapper);
    },
    serializeData: function() {
      var data;
      data = {};
      if (this.model) {
        data = this.model.toJSON();
      } else if (this.collection) {
        data = {
          items: this.collection.toJSON()
        };
      }
      if (this.title) {
        data.title = this.title;
      }
      return data;
    },
    destroy: function() {
      this.undelegateEvents();
      if (this.$el) {
        this.$el.removeData().unbind();
      }
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    },
    renderWrapper: function(originalRender) {
      if (Base.util._.isFunction(this.beforeRender)) {
        this.beforeRender();
      }
      if (Base.util._.isFunction(originalRender)) {
        originalRender();
      }
      if (Base.util._.isFunction(this.afterRender)) {
        this.afterRender();
      }
      return this;
    },
    render: function() {
      var data, html, tpl;
      if (this.model && this.model.get('template')) {
        tpl = JST[this.model.get('template')];
      } else {
        tpl = this.template;
      }
      data = this.serializeData();
      html = Renderer.render(tpl, data);
      this.attachElContent(html);
      return this;
    },
    attachElContent: function(html) {
      this.$el.append(html);
      return this;
    }
  };
  return {
    initialize: function(app) {
      Base.log.info("Inicializada la componente de Backbone");
      app.sandbox.mvc = function() {
        return Base.log.info("Inicializada la componente de MVC");
      };
      app.sandbox.mvc.BaseView = BaseView;

      /**
       * This method allows to mix a backbone view with an object
       * @author Francisco Ramini <francisco.ramini at globant.com>
       * @param  {[type]} view
       * @param  {[type]} mixin = BaseView
       * @return {[type]}
       */
      return app.sandbox.mvc.mixin = function(view, mixin) {
        var oldInitialize;
        if (mixin == null) {
          mixin = BaseView;
        }
        if (mixin.initialize !== 'undefined') {
          oldInitialize = view.prototype.initialize;
        }
        _.extend(view.prototype, mixin);
        _.defaults(view.prototype.events, mixin.events);
        if (oldInitialize) {
          return view.prototype.initialize = function() {
            mixin.initialize.apply(this);
            return oldInitialize.apply(this);
          };
        }
      };
    },
    name: 'Backbone Extension'
  };
});



},{"./../base.coffee":2}],5:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Ext) {
  var Base, Component;
  Base = require('./../base.coffee');
  Component = (function() {
    function Component() {}


    /**
     * [startAll description]
     * @author Francisco Ramini <francisco.ramini at globant.com>
     * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
     * @return {[type]}
     */

    Component.startAll = function(selector, app) {
      var components;
      if (selector == null) {
        selector = 'body';
      }
      components = Component.parseList(selector);
      Base.log.info("ESTAS SERIAN LAS COMPONENTES PARSEADAS");
      Base.log.debug(components);
      return Component.instantiate(components, app);
    };

    Component.parseList = function(selector) {
      var cssSelector, list, namespace;
      list = [];
      namespace = "lodges";
      cssSelector = ["[data-lodges-component]"];
      $(selector).find(cssSelector.join(',')).each(function(i, comp) {
        var options;
        options = Component.parseComponentOptions(this, "lodges");
        return list.push({
          name: options.name,
          options: options
        });
      });
      return list;
    };

    Component.parseComponentOptions = function(el, namespace, opts) {
      var data, name, options;
      options = _.clone(opts || {});
      options.el = el;
      data = $(el).data();
      name = '';
      $.each(data, function(k, v) {
        k = k.replace(new RegExp("^" + namespace), "");
        k = k.charAt(0).toLowerCase() + k.slice(1);
        if (k !== "component") {
          return options[k] = v;
        } else {
          return name = v;
        }
      });
      return Component.buildOptionsObject(name, options);
    };

    Component.buildOptionsObject = function(name, options) {
      options.name = name;
      return options;
    };

    Component.instantiate = function(components, app) {
      return _.each(components, function(m, i) {
        var mod, sb;
        if (!_.isEmpty(NGL.modules) && NGL.modules[m.name] && m.options) {
          mod = NGL.modules[m.name];
          sb = app.createSandbox(m.name);
          _.extend(mod, {
            sandbox: sb,
            options: m.options
          });
          return mod.initialize();
        }
      });
    };

    return Component;

  })();
  return {
    initialize: function(app) {
      Base.log.info("Inicializada la componente de Componentes");
      return app.sandbox.startComponents = function(list, app) {
        return Component.startAll(list, app);
      };
    },
    afterAppStarted: function(app) {
      Base.log.info("Llamando al afterAppStarted");
      return app.sandbox.startComponents(null, app);
    },
    name: 'Component Extension'
  };
});



},{"./../base.coffee":2}],6:[function(require,module,exports){
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



},{"./base.coffee":2}]},{},[2,6,3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2Jhc2UuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvY29yZS5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dG1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUEsQ0FBQyxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7U0FFRyxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLENBQVEsSUFBUixFQUFjLEVBQWQsRUFGcEI7QUFBQSxDQUFELENBQUEsQ0FJRSxNQUpGLEVBSVUsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBUU4sRUFBQSxJQUFJLENBQUMsR0FBTCxHQUFXLE9BQUEsQ0FBUSxVQUFSLENB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LGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLFdBQWpCLEVBQThCLE9BQTlCLEVBSEc7SUFBQSxDQXBCUCxDQUFBOztBQUFBLHlCQXlCQSxjQUFBLEdBQWlCLFNBQUMsVUFBRCxFQUFhLE9BQWIsR0FBQTtBQUViLFVBQUEsRUFBQTtBQUFBLE1BQUEsSUFBRyxVQUFVLENBQUMsTUFBWCxHQUFvQixDQUF2QjtBQUVJLFFBQUEsRUFBQSxHQUFLLFVBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBTCxDQUFBO0FBQUEsUUFHQSxFQUFFLENBQUMsVUFBSCxDQUFjLE9BQWQsQ0FIQSxDQUFBO0FBQUEsUUFNQSxJQUFDLENBQUEsc0JBQXNCLENBQUMsSUFBeEIsQ0FBNkIsRUFBN0IsQ0FOQSxDQUFBO2VBUUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsVUFBaEIsRUFBNEIsT0FBNUIsRUFWSjtPQUZhO0lBQUEsQ0F6QmpCLENBQUE7O0FBQUEseUJBdUNBLHdCQUFBLEdBQTJCLFNBQUEsR0FBQTtBQUN2QixhQUFPLElBQUMsQ0FBQSxzQkFBUixDQUR1QjtJQUFBLENBdkMzQixDQUFBOztzQkFBQTs7TUFKSixDQUFBO0FBOENBLFNBQU8sVUFBUCxDQWhETTtBQUFBLENBSlYsQ0FBQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXHJcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcclxuKlxyXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHt9O1xyXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsICdsb2cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBib3VuZFRvQ29uc29sZShjb25zb2xlLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZCA9IGNvbnNvbGVbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKG1ldGhvZC5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKG1ldGhvZCwgY29uc29sZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGVbbWV0aG9kTmFtZV0sIGNvbnNvbGUpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEluIElFOCArIE1vZGVybml6ciwgdGhlIGJpbmQgc2hpbSB3aWxsIHJlamVjdCB0aGUgYWJvdmUsIHNvIHdlIGZhbGwgYmFjayB0byB3cmFwcGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKG1ldGhvZCwgY29uc29sZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKGYsIGNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShmLCBbY29udGV4dCwgYXJndW1lbnRzXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobWV0aG9kRmFjdG9yeSkge1xyXG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBzZWxmW2xvZ01ldGhvZHNbaWldXSA9IG1ldGhvZEZhY3RvcnkobG9nTWV0aG9kc1tpaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb29raWVzQXZhaWxhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgIT09IHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IG51bGwpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XHJcbiAgICAgICAgdmFyIGxvY2FsU3RvcmFnZUZhaWwgPSBmYWxzZSxcclxuICAgICAgICAgICAgbGV2ZWxOYW1lO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2VsZi5sZXZlbHMpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYubGV2ZWxzLmhhc093blByb3BlcnR5KGtleSkgJiYgc2VsZi5sZXZlbHNba2V5XSA9PT0gbGV2ZWxOdW0pIHtcclxuICAgICAgICAgICAgICAgIGxldmVsTmFtZSA9IGtleTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2V0dGluZyBsb2NhbFN0b3JhZ2UgY2FuIGNyZWF0ZSBhIERPTSAyMiBFeGNlcHRpb24gaWYgcnVubmluZyBpbiBQcml2YXRlIG1vZGVcclxuICAgICAgICAgICAgICogaW4gU2FmYXJpLCBzbyBldmVuIGlmIGl0IGlzIGF2YWlsYWJsZSB3ZSBuZWVkIHRvIGNhdGNoIGFueSBlcnJvcnMgd2hlbiB0cnlpbmdcclxuICAgICAgICAgICAgICogdG8gd3JpdGUgdG8gaXRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddID0gbGV2ZWxOYW1lO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VGYWlsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUZhaWwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUZhaWwgJiYgY29va2llc0F2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPSBcImxvZ2xldmVsPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb29raWVSZWdleCA9IC9sb2dsZXZlbD0oW147XSspLztcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUGVyc2lzdGVkTGV2ZWwoKSB7XHJcbiAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0b3JlZExldmVsID09PSB1bmRlZmluZWQgJiYgY29va2llc0F2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVNYXRjaCA9IGNvb2tpZVJlZ2V4LmV4ZWMod2luZG93LmRvY3VtZW50LmNvb2tpZSkgfHwgW107XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gY29va2llTWF0Y2hbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IFwiV0FSTlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKlxyXG4gICAgICogUHVibGljIEFQSVxyXG4gICAgICpcclxuICAgICAqL1xyXG5cclxuICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxyXG4gICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XHJcblxyXG4gICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGV2ZWwgPT09IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXZlbCA8PSBzZWxmLmxldmVsc1ttZXRob2ROYW1lLnRvVXBwZXJDYXNlKCldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxyXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xyXG4gICAgc2VsZi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gc2VsZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUGVyc2lzdGVkTGV2ZWwoKTtcclxuICAgIHJldHVybiBzZWxmO1xyXG59KSk7XHJcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBQcm9taXNlIGFic3RyYWN0aW9uXG5cbiAgICAjIERPTSBtYW5pcHVsYXRpb25cblxuICAgICMgTG9nZ2VyXG4gICAgIyBsb2dsZXZlbCBpcyBzbWFsbCBlbm91Z2ggdG8gYmUgcGFydCBvZiB0aGUgZGlzdFxuICAgIEJhc2UubG9nID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBVdGlsc1xuICAgICMgTGlicmFyaXMgbGlrZSB1bmRlcnNjb3JlLCBiYWNrYm9uZSwgd2lsbCBiZSBsb2FkZWQgYnkgdGhlIHByb2plY3RcbiAgICAjIGFzIGhhcmQgZGVwZW5kZW5jaWVzIGZvciB0aGlzIGxheWVyXG4gICAgQmFzZS51dGlsID1cbiAgICAgICAgZWFjaDogJC5lYWNoLFxuICAgICAgICBleHRlbmQ6ICQuZXh0ZW5kLFxuICAgICAgICB1bmlxOiByb290Ll8udW5pcSxcbiAgICAgICAgXzogcm9vdC5fXG5cbiAgICByZXR1cm4gQmFzZVxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5OR0wgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HTCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcbiAgICBFeHRNYW5hZ2VyID0gcmVxdWlyZSgnLi9leHRtYW5hZ2VyLmNvZmZlZScpXG5cbiAgICAjIHdlJ2xsIHVzZSB0aGUgTkdMIG9iamVjdCBhcyB0aGUgZ2xvYmFsIEV2ZW50IGJ1c1xuICAgIF8uZXh0ZW5kIE5HTCwgQmFja2JvbmUuRXZlbnRzXG5cbiAgICAjIE5hbWVzcGFjZSBmb3IgbW9kdWxlIGRlZmluaXRpb25cbiAgICBOR0wubW9kdWxlcyA9IHt9XG5cbiAgICBjbGFzcyBOR0wuQ29yZVxuICAgICAgICAjIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeVxuICAgICAgICB2ZXJzaW9uOiBcIjAuMC4xXCJcblxuICAgICAgICBjZmc6XG4gICAgICAgICAgICBkZWJ1ZzpcbiAgICAgICAgICAgICAgICBsb2dMZXZlbDogNSAjIGJ5IGRlZmF1bHQgdGhlIGxvZ2dpbmcgaXMgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5fLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gT2JqZWN0LmNyZWF0ZShCYXNlKVxuXG4gICAgICAgICAgICAjIG5hbWVzcGFjZSB0byBob2xkIGFsbCB0aGUgc2FuZGJveGVzXG4gICAgICAgICAgICBAc2FuZGJveGVzID0ge31cblxuXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjb3VsZCBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY291bGQgbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiU3RhcnQgZGUgQ29yZVwiKVxuXG4gICAgICAgICAgICBAc3RhcnRlZCA9IHRydWVcblxuICAgICAgICAgICAgIyBSZXF1aXJlIGNvcmUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQ29tcG9uZW50cyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlJylcbiAgICAgICAgICAgIEJhY2tib25lRXh0ID0gcmVxdWlyZSgnLi9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChCYWNrYm9uZUV4dClcblxuICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChpLCBleHQpID0+XG4gICAgICAgICAgICAgICAgIyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBub3QgcmVxdWlyZWQgbGV0cyBjaGVjayBpZiBpdCdzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZiBleHQgJiYgdHlwZW9mIGV4dC5hZnRlckFwcFN0YXJ0ZWQgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gT2JqZWN0LmNyZWF0ZShALnNhbmRib3gpXG5cblxuICAgIHJldHVybiBOR0xcbikiLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiBzaG91bGQgcHJvYmFibHkgYmUgZGVmaW5lZCBhdCBhIHByb2plY3QgbGV2ZWwsIG5vdCBoZXJlXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBSZW5kZXJlciA9XG5cbiAgICAgICAgcmVuZGVyOiAodGVtcGxhdGUsIGRhdGEpIC0+XG5cbiAgICAgICAgICAgIHVubGVzcyB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIFwiVGhlIHRlbXBsYXRlIHBhc3NlZCB0byB0aGUgUmVuZGVyZXIgaXMgbm90IGRlZmluZWRcIlxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUgZGF0YVxuXG5cblxuICAgICMgRGVmYXVsdCBiYXNlIG9iamVjdCB0aGF0IGlzIGdvbm5hIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgb2JqZWN0IHRvIGJlIG1peGVkXG4gICAgIyBpbnRvIG90aGVyIHZpZXdzXG4gICAgQmFzZVZpZXcgPVxuXG4gICAgICAgIGluaXRpYWxpemU6ICgpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiaW5pdGlhbGl6ZSBkZWwgQmFzZVZpZXdcIlxuXG4gICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ3JlbmRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3JlbmRlcldyYXBwZXInXG5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGJlZm9yZVJlbmRlclxuICAgICAgICAgICAgICAgIF8uYmluZEFsbCBALCAnYmVmb3JlUmVuZGVyJ1xuXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBhZnRlclJlbmRlclxuICAgICAgICAgICAgICAgIF8uYmluZEFsbCBALCAnYWZ0ZXJSZW5kZXInXG5cbiAgICAgICAgICAgIEByZW5kZXIgPSBCYXNlLnV0aWwuXy53cmFwIEByZW5kZXIsIEByZW5kZXJXcmFwcGVyXG5cbiAgICAgICAgIyBNZXRob2QgdG8gZW5zdXJlIHRoYXQgdGhlIGRhdGEgaXMgYWx3YXlzIHBhc3NlZCB0byB0aGUgdGVtcGxhdGUgaW4gdGhlIHNhbWUgd2F5XG4gICAgICAgIHNlcmlhbGl6ZURhdGEgOiAoKSAtPlxuXG4gICAgICAgICAgICBkYXRhID0ge31cblxuICAgICAgICAgICAgaWYgQG1vZGVsXG4gICAgICAgICAgICAgICAgZGF0YSA9IEBtb2RlbC50b0pTT04oKVxuICAgICAgICAgICAgZWxzZSBpZiBAY29sbGVjdGlvblxuICAgICAgICAgICAgICAgICMgdGhpcyB3YXkgd2Ugbm9ybWFsaXplIHRoZSBwcm9wZXJ0eSB3ZSdsbCB1c2UgdG8gaXRlcmF0ZVxuICAgICAgICAgICAgICAgICMgdGhlIGNvbGxlY3Rpb24gaW5zaWRlIHRoZSBoYnNcbiAgICAgICAgICAgICAgICBkYXRhID0gaXRlbXMgOiBAY29sbGVjdGlvbi50b0pTT04oKVxuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCBiZSBoZWxwZnVsbCBpbiB2aWV3cyB3aGljaCByZW5kZXJzIGNvbGxlY3Rpb25zXG4gICAgICAgICAgICAjIGFuZCBuZWVkcyB0byBkaXNwbGF5IGEgY3VzdG9taXphYmxlIHRpdGxlIG9uIHRvcFxuICAgICAgICAgICAgaWYgQHRpdGxlXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9IEB0aXRsZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZGF0YVxuXG4gICAgICAgICMgRW5zdXJlcyB0aGF0IGV2ZW50cyBhcmUgcmVtb3ZlZCBiZWZvcmUgdGhlIFZpZXcgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAgICAgICAgZGVzdHJveSA6ICgpIC0+XG5cbiAgICAgICAgICAgICMgdW5iaW5kIGV2ZW50c1xuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuICAgICAgICAgICAgQCRlbC5yZW1vdmVEYXRhKCkudW5iaW5kKCkgaWYgQCRlbFxuXG4gICAgICAgICAgICAjUmVtb3ZlIHZpZXcgZnJvbSBET01cbiAgICAgICAgICAgIEByZW1vdmUoKVxuICAgICAgICAgICAgQmFja2JvbmUuVmlldzo6cmVtb3ZlLmNhbGwodGhpcylcblxuICAgICAgICAjIFdyYXBwZXIgdG8gYWRkIFwiYmVmb3JlUmVuZGVyXCIgYW5kIFwiYWZ0ZXJSZW5kZXJcIiBtZXRob2RzLlxuICAgICAgICByZW5kZXJXcmFwcGVyOiAob3JpZ2luYWxSZW5kZXIpIC0+XG4gICAgICAgICAgICBAYmVmb3JlUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYmVmb3JlUmVuZGVyXG5cbiAgICAgICAgICAgIG9yaWdpbmFsUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBvcmlnaW5hbFJlbmRlclxuXG4gICAgICAgICAgICBAYWZ0ZXJSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBhZnRlclJlbmRlclxuXG4gICAgICAgICAgICBAXG5cbiAgICAgICAgcmVuZGVyOiAoKSAtPlxuXG4gICAgICAgICAgICAjIGFzIGEgcnVsZSwgaWYgdGhlIHRlbXBsYXRlIGlzIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgICAgIyB0aGlzIG9wdGlvbiB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSB2aWV3XG4gICAgICAgICAgICBpZiBAbW9kZWwgYW5kIEBtb2RlbC5nZXQoJ3RlbXBsYXRlJylcbiAgICAgICAgICAgICAgICB0cGwgPSBKU1RbQG1vZGVsLmdldCgndGVtcGxhdGUnKV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0cGwgPSBAdGVtcGxhdGVcblxuICAgICAgICAgICAgZGF0YSA9IEBzZXJpYWxpemVEYXRhKClcblxuICAgICAgICAgICAgaHRtbCA9IFJlbmRlcmVyLnJlbmRlcih0cGwsIGRhdGEpXG5cbiAgICAgICAgICAgIEBhdHRhY2hFbENvbnRlbnQgaHRtbFxuXG4gICAgICAgICAgICBAXG5cbiAgICAgICAgYXR0YWNoRWxDb250ZW50OiAoaHRtbCkgLT5cblxuICAgICAgICAgICAgQCRlbC5hcHBlbmQoaHRtbClcbiAgXG4gICAgICAgICAgICBAXG5cblxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaWNpYWxpemFkYSBsYSBjb21wb25lbnRlIGRlIEJhY2tib25lXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5tdmMgPSAoKSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaWNpYWxpemFkYSBsYSBjb21wb25lbnRlIGRlIE1WQ1wiXG5cbiAgICAgICAgIyB0aGlzIGdpdmVzIGFjY2VzcyB0byBCYXNlVmlldyBmcm9tIHRoZSBvdXRzaWRlXG4gICAgICAgIGFwcC5zYW5kYm94Lm12Yy5CYXNlVmlldyA9IEJhc2VWaWV3XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBhbGxvd3MgdG8gbWl4IGEgYmFja2JvbmUgdmlldyB3aXRoIGFuIG9iamVjdFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdmlld1xuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG1peGluID0gQmFzZVZpZXdcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgYXBwLnNhbmRib3gubXZjLm1peGluID0gKHZpZXcsIG1peGluID0gQmFzZVZpZXcpIC0+XG5cbiAgICAgICAgICAgIGlmIG1peGluLmluaXRpYWxpemUgaXNudCAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgIG9sZEluaXRpYWxpemUgPSB2aWV3Ojppbml0aWFsaXplXG5cbiAgICAgICAgICAgIF8uZXh0ZW5kIHZpZXc6OiwgbWl4aW5cbiAgICAgICAgICAgIF8uZGVmYXVsdHMgdmlldzo6ZXZlbnRzLCBtaXhpbi5ldmVudHNcblxuICAgICAgICAgICAgaWYgb2xkSW5pdGlhbGl6ZVxuICAgICAgICAgICAgICAgIHZpZXc6OmluaXRpYWxpemUgPSAtPlxuICAgICAgICAgICAgICAgICAgICBtaXhpbi5pbml0aWFsaXplLmFwcGx5IHRoaXNcbiAgICAgICAgICAgICAgICAgICAgb2xkSW5pdGlhbGl6ZS5hcHBseSB0aGlzXG5cbiAgICBuYW1lOiAnQmFja2JvbmUgRXh0ZW5zaW9uJ1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBDb21wb25lbnRcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFtzdGFydEFsbCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yID0gJ2JvZHknLiBDU1Mgc2VsZWN0b3IgdG8gdGVsbCB0aGUgYXBwIHdoZXJlIHRvIGxvb2sgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgQHN0YXJ0QWxsOiAoc2VsZWN0b3IgPSAnYm9keScsIGFwcCkgLT5cblxuICAgICAgICAgICAgY29tcG9uZW50cyA9IENvbXBvbmVudC5wYXJzZUxpc3Qoc2VsZWN0b3IpXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJFU1RBUyBTRVJJQU4gTEFTIENPTVBPTkVOVEVTIFBBUlNFQURBU1wiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBjb21wb25lbnRzXG5cbiAgICAgICAgICAgICMgVE9ETzogUHJveGltbyBwYXNvIGluaWNpYWxpemFyIGxhcyBjb21wb25lbnRlc1xuICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuICAgICAgICBAcGFyc2VMaXN0OiAoc2VsZWN0b3IpIC0+XG5cbiAgICAgICAgICAgIGxpc3QgPSBbXVxuXG4gICAgICAgICAgICAjIGhlcmUgd2UgY291bGQgZGVmaW5lIHRoZSBkZWZhdWx0IGRhdGEtKmEgYXR0cmlidXRlc1xuICAgICAgICAgICAgIyBkZWZpbmVkIHRvIGRlZmluZSBhIGNvbXBvbmVudFxuICAgICAgICAgICAgIyBUT0RPOiBNYWtlIHRoZSBuYW1lc3BhY2UgXCJsb2RnZXNcIiBjb25maWd1cmFibGVcbiAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwibG9kZ2VzXCJcbiAgICAgICAgICAgIGNzc1NlbGVjdG9yID0gW1wiW2RhdGEtbG9kZ2VzLWNvbXBvbmVudF1cIl1cblxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3Iuam9pbignLCcpKS5lYWNoIChpLCBjb21wKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBvcHRpb25zIHdpbGwgaG9sZCBhbGwgdGhlIGRhdGEtKiByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gQ29tcG9uZW50LnBhcnNlQ29tcG9uZW50T3B0aW9ucyhALCBcImxvZGdlc1wiKVxuXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHsgbmFtZTogb3B0aW9ucy5uYW1lLCBvcHRpb25zOiBvcHRpb25zIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0XG5cbiAgICAgICAgQHBhcnNlQ29tcG9uZW50T3B0aW9uczogKGVsLCBuYW1lc3BhY2UsIG9wdHMpIC0+XG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0cyB8fCB7fSlcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbFxuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIERPTSBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIGRhdGEgPSAkKGVsKS5kYXRhKClcbiAgICAgICAgICAgIG5hbWUgPSAnJ1xuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgJC5lYWNoIGRhdGEsIChrLCB2KSAtPlxuXG4gICAgICAgICAgICAgICAgIyByZW1vdmVzIHRoZSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBrID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBuYW1lc3BhY2UpLCBcIlwiKVxuXG4gICAgICAgICAgICAgICAgIyBkZWNhbWVsaXplIHRoZSBvcHRpb24gbmFtZVxuICAgICAgICAgICAgICAgIGsgPSBrLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgay5zbGljZSgxKVxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUga2V5IGlzIGRpZmZlcmVudCBmcm9tIFwiY29tcG9uZW50XCIgaXQgbWVhbnMgaXQgaXNcbiAgICAgICAgICAgICAgICAjIGFuIG9wdGlvbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIGsgIT0gXCJjb21wb25lbnRcIlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gdlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHZcblxuICAgICAgICAgICAgIyBidWlsZCBhZCByZXR1cm4gdGhlIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgIENvbXBvbmVudC5idWlsZE9wdGlvbnNPYmplY3QobmFtZSwgb3B0aW9ucylcblxuICAgICAgICBcbiAgICAgICAgQGJ1aWxkT3B0aW9uc09iamVjdDogKG5hbWUsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IG5hbWVcblxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNcblxuICAgICAgICBAaW5zdGFudGlhdGU6IChjb21wb25lbnRzLCBhcHApIC0+XG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgXy5lYWNoKGNvbXBvbmVudHMsIChtLCBpKSAtPlxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIG1vZHVsZXMgYXJlIGRlZmluZWQgdXNpbmcgdGhlIG1vZHVsZXMgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgIyBUT0RPOiBQcm92aWRlIGFuIGFsdGVybmF0ZSB3YXkgdG8gZGVmaW5lIHdoaWNoIGlzIGdvbm5hIGJlXG4gICAgICAgICAgICAgICAgIyB0aGlzIGdsb2JhbCBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBfLmlzRW1wdHkoTkdMLm1vZHVsZXMpIGFuZCBOR0wubW9kdWxlc1ttLm5hbWVdIGFuZCBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9kID0gTkdMLm1vZHVsZXNbbS5uYW1lXVxuXG4gICAgICAgICAgICAgICAgICAgICMgY3JlYXRlIGEgbmV3IHNhbmRib3ggZm9yIHRoaXMgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIHNiID0gYXBwLmNyZWF0ZVNhbmRib3gobS5uYW1lKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5qZWN0IHRoZSBzYW5kYm94IGFuZCB0aGUgb3B0aW9ucyBpbiB0aGUgbW9kdWxlIHByb3RvXG4gICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kIG1vZCwgc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnNcblxuICAgICAgICAgICAgICAgICAgICAjIGluaXQgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtb2QuaW5pdGlhbGl6ZSgpXG4gICAgICAgICAgICApXG5cblxuICAgICMjXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgIyNcblxuICAgICMgY29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgQ29tcG9uZW50ZXNcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyA9IChsaXN0LCBhcHApIC0+XG5cbiAgICAgICAgICAgIENvbXBvbmVudC5zdGFydEFsbChsaXN0LCBhcHApXG5cblxuICAgICMgdGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGxvYWRlZFxuICAgIGFmdGVyQXBwU3RhcnRlZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiTGxhbWFuZG8gYWwgYWZ0ZXJBcHBTdGFydGVkXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMobnVsbCwgYXBwKVxuXG4gICAgbmFtZTogJ0NvbXBvbmVudCBFeHRlbnNpb24nXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HTCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICBfZXh0ZW5zaW9uczogW11cblxuICAgICAgICBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zOiBbXVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuXG4gICAgICAgIGFkZDogKGV4dCkgLT5cblxuICAgICAgICAgICAgIyBjaGVja3MgaWYgdGhlIG5hbWUgZm9yIHRoZSBleHRlbnNpb24gaGF2ZSBiZWVuIGRlZmluZWQuXG4gICAgICAgICAgICAjIGlmIG5vdCBsb2cgYSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgIHVubGVzcyBleHQubmFtZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiVGhlIGV4dGVuc2lvbiBkb2Vzbid0IGhhdmUgYSBuYW1lIGFzc29jaWF0ZWQuIEl0IHdpbGwgYmUgaGVwZnVsbCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCJpZiB5b3UgaGF2ZSBhc3NpbmcgYWxsIG9mIHlvdXIgZXh0ZW5zaW9ucyBhIG5hbWUgZm9yIGJldHRlciBkZWJ1Z2dpbmdcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICMgTGV0cyB0aHJvdyBhbiBlcnJvciBpZiB3ZSB0cnkgdG8gaW5pdGlhbGl6ZSB0aGUgc2FtZSBleHRlbnNpb24gdHdpY2VzXG4gICAgICAgICAgICBpZiBfLmluY2x1ZGUodGhpcy5fZXh0ZW5zaW9ucywgZXh0KSB0aGVuIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQubmFtZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiKVxuXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMucHVzaChleHQpXG5cbiAgICAgICAgaW5pdCA6IChjb250ZXh0KSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBAX2V4dGVuc2lvbnNcblxuICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKEBfZXh0ZW5zaW9ucywgY29udGV4dClcbiAgICBcbiAgICAgICAgX2luaXRFeHRlbnNpb24gOiAoZXh0ZW5zaW9ucywgY29udGV4dCkgLT5cblxuICAgICAgICAgICAgaWYgZXh0ZW5zaW9ucy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICB4dCA9IGV4dGVuc2lvbnMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgIyBDYWxsIGV4dGVuc2lvbnMgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICB4dC5pbml0aWFsaXplKGNvbnRleHQpXG5cbiAgICAgICAgICAgICAgICAjIEtlZXAgdHJhY2sgb2YgdGhlIGluaXRpYWxpemVkIGV4dGVuc2lvbnMgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucy5wdXNoIHh0XG5cbiAgICAgICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zXG5cbiAgICByZXR1cm4gRXh0TWFuYWdlclxuXG4pIl19
