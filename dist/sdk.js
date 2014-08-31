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
    }
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
    }
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
      if (_.include(this._extensions, ext)) {
        throw new Error("Extension: " + ext + " already exists.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2Jhc2UuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvY29yZS5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dG1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUEsQ0FBQyxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7U0FFRyxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLENBQVEsSUFBUixFQUFjLEVBQWQsRUFGcEI7QUFBQSxDQUFELENBQUEsQ0FJRSxNQUpGLEVBSVUsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBUU4sRUFBQSxJQUFJLENBQUMsR0FBTCxHQUFXLE9BQUEsQ0FBUSxVQUFSLENB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QSxRQUdBLEVBQUUsQ0FBQyxVQUFILENBQWMsT0FBZCxDQUhBLENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxzQkFBc0IsQ0FBQyxJQUF4QixDQUE2QixFQUE3QixDQU5BLENBQUE7ZUFRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixVQUFoQixFQUE0QixPQUE1QixFQVZKO09BRmE7SUFBQSxDQWpCakIsQ0FBQTs7QUFBQSx5QkErQkEsd0JBQUEsR0FBMkIsU0FBQSxHQUFBO0FBQ3ZCLGFBQU8sSUFBQyxDQUFBLHNCQUFSLENBRHVCO0lBQUEsQ0EvQjNCLENBQUE7O3NCQUFBOztNQUpKLENBQUE7QUFzQ0EsU0FBTyxVQUFQLENBeENNO0FBQUEsQ0FKVixDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgbWV0aG9kTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsIG1ldGhvZE5hbWUpIHtcclxuICAgICAgICB2YXIgbWV0aG9kID0gY29uc29sZVttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAobWV0aG9kLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoY29uc29sZVttZXRob2ROYW1lXSwgY29uc29sZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gSUU4ICsgTW9kZXJuaXpyLCB0aGUgYmluZCBzaGltIHdpbGwgcmVqZWN0IHRoZSBhYm92ZSwgc28gd2UgZmFsbCBiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIoZiwgY29udGV4dCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KGYsIFtjb250ZXh0LCBhcmd1bWVudHNdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgIFwidHJhY2VcIixcclxuICAgICAgICBcImRlYnVnXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJ3YXJuXCIsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhtZXRob2RGYWN0b3J5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIHNlbGZbbG9nTWV0aG9kc1tpaV1dID0gbWV0aG9kRmFjdG9yeShsb2dNZXRob2RzW2lpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvb2tpZXNBdmFpbGFibGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSAhPT0gdW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gbnVsbCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcclxuICAgICAgICB2YXIgbG9jYWxTdG9yYWdlRmFpbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBsZXZlbE5hbWU7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzZWxmLmxldmVscykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5sZXZlbHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBzZWxmLmxldmVsc1trZXldID09PSBsZXZlbE51bSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWxOYW1lID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTZXR0aW5nIGxvY2FsU3RvcmFnZSBjYW4gY3JlYXRlIGEgRE9NIDIyIEV4Y2VwdGlvbiBpZiBydW5uaW5nIGluIFByaXZhdGUgbW9kZVxyXG4gICAgICAgICAgICAgKiBpbiBTYWZhcmksIHNvIGV2ZW4gaWYgaXQgaXMgYXZhaWxhYmxlIHdlIG5lZWQgdG8gY2F0Y2ggYW55IGVycm9ycyB3aGVuIHRyeWluZ1xyXG4gICAgICAgICAgICAgKiB0byB3cml0ZSB0byBpdFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ10gPSBsZXZlbE5hbWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUZhaWwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlRmFpbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlRmFpbCAmJiBjb29raWVzQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvb2tpZVJlZ2V4ID0gL2xvZ2xldmVsPShbXjtdKykvO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRQZXJzaXN0ZWRMZXZlbCgpIHtcclxuICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZCAmJiBjb29raWVzQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZU1hdGNoID0gY29va2llUmVnZXguZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKSB8fCBbXTtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBjb29raWVNYXRjaFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gXCJXQVJOXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqXHJcbiAgICAgKiBQdWJsaWMgQVBJXHJcbiAgICAgKlxyXG4gICAgICovXHJcblxyXG4gICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXHJcbiAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsZXZlbCA9PT0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxldmVsIDw9IHNlbGYubGV2ZWxzW21ldGhvZE5hbWUudG9VcHBlckNhc2UoKV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEJhc2UpIC0+XG5cbiAgICAjIFByb21pc2UgYWJzdHJhY3Rpb25cblxuICAgICMgRE9NIG1hbmlwdWxhdGlvblxuXG4gICAgIyBMb2dnZXJcbiAgICAjIGxvZ2xldmVsIGlzIHNtYWxsIGVub3VnaCB0byBiZSBwYXJ0IG9mIHRoZSBkaXN0XG4gICAgQmFzZS5sb2cgPSByZXF1aXJlKCdsb2dsZXZlbCcpXG5cbiAgICAjIFV0aWxzXG4gICAgIyBMaWJyYXJpcyBsaWtlIHVuZGVyc2NvcmUsIGJhY2tib25lLCB3aWxsIGJlIGxvYWRlZCBieSB0aGUgcHJvamVjdFxuICAgICMgYXMgaGFyZCBkZXBlbmRlbmNpZXMgZm9yIHRoaXMgbGF5ZXJcbiAgICBCYXNlLnV0aWwgPVxuICAgICAgICBlYWNoOiAkLmVhY2gsXG4gICAgICAgIGV4dGVuZDogJC5leHRlbmQsXG4gICAgICAgIHVuaXE6IHJvb3QuXy51bmlxLFxuICAgICAgICBfOiByb290Ll9cblxuICAgIHJldHVybiBCYXNlXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByb290Lk5HTCA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTkdMKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5jb2ZmZWUnKVxuICAgIEV4dE1hbmFnZXIgPSByZXF1aXJlKCcuL2V4dG1hbmFnZXIuY29mZmVlJylcblxuICAgICMgd2UnbGwgdXNlIHRoZSBOR0wgb2JqZWN0IGFzIHRoZSBnbG9iYWwgRXZlbnQgYnVzXG4gICAgXy5leHRlbmQgTkdMLCBCYWNrYm9uZS5FdmVudHNcblxuICAgICMgTmFtZXNwYWNlIGZvciBtb2R1bGUgZGVmaW5pdGlvblxuICAgIE5HTC5tb2R1bGVzID0ge31cblxuICAgIGNsYXNzIE5HTC5Db3JlXG4gICAgICAgICMgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5XG4gICAgICAgIHZlcnNpb246IFwiMC4wLjFcIlxuXG4gICAgICAgIGNmZzpcbiAgICAgICAgICAgIGRlYnVnOlxuICAgICAgICAgICAgICAgIGxvZ0xldmVsOiA1ICMgYnkgZGVmYXVsdCB0aGUgbG9nZ2luZyBpcyBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdmFsdWVzIGNhbiBnbyBmcm9tIDAgdG8gNSAoNSBtZWFucyBkaXNhYmxlZClcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLl8uZGVmYXVsdHMgY29uZmlnLCBAY2ZnXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIHRyYWNrIHRoZSBzdGF0ZSBvZiB0aGUgQ29yZS4gV2hlbiBpdCBpc1xuICAgICAgICAgICAgIyB0cnVlLCBpdCBtZWFucyB0aGUgXCJzdGFydCgpXCIgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgICAgICBAc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICMgU2V0IHRoZSBsb2dnaW5nIGxldmVsIGZvciB0aGUgYXBwXG4gICAgICAgICAgICBCYXNlLmxvZy5zZXRMZXZlbChAY29uZmlnLmRlYnVnLmxvZ0xldmVsKVxuXG4gICAgICAgICAgICAjIFRoZSBleHRlbnNpb24gbWFuYWdlciB3aWxsIGJlIG9uIGNoYXJnZSBvZiBsb2FkaW5nIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICMgYW5kIG1ha2UgaXRzIGZ1bmN0aW9uYWxpdHkgYXZhaWxhYmxlIHRvIHRoZSBzdGFja1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIgPSBuZXcgRXh0TWFuYWdlcigpXG5cbiAgICAgICAgICAgICMgdGhyb3VnaCB0aGlzIG9iamVjdCB0aGUgbW9kdWxlcyB3aWxsIGJlIGFjY2VzaW5nIHRoZSBtZXRob2QgZGVmaW5lZCBieSB0aGVcbiAgICAgICAgICAgICMgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQHNhbmRib3ggPSBPYmplY3QuY3JlYXRlKEJhc2UpXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG5cblxuICAgICAgICBhZGRFeHRlbnNpb246IChleHQpIC0+XG4gICAgICAgICAgICAjIHdlJ2xsIG9ubHkgYWxsb3cgdG8gYWRkIG5ldyBleHRlbnNpb25zIGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgQ29yZSBnZXQgc3RhcnRlZFxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKGV4dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4gWW91IGNvdWxkIG5vdCBhZGQgbmV3IGV4dGVuc2lvbnMgYXQgdGhpcyBwb2ludC5cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjb3VsZCBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICBzdGFydDogKG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJTdGFydCBkZSBDb3JlXCIpXG5cbiAgICAgICAgICAgIEBzdGFydGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgQmFja2JvbmVFeHQgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9iYWNrYm9uZS5leHQuY29mZmVlJylcblxuICAgICAgICAgICAgIyBBZGQgY29yZSBleHRlbnNpb25zIHRvIHRoZSBhcHBcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChDb21wb25lbnRzKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKEJhY2tib25lRXh0KVxuXG4gICAgICAgICAgICAjIEluaXQgYWxsIHRoZSBleHRlbnNpb25zXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5pbml0KEApXG5cbiAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAjIGZyb20gZWFjaCBleHRlbnNpb25cbiAgICAgICAgICAgICMgTm90ZTogVGhpcyBtZXRob2Qgd2lsbCBsZXQgZWFjaCBleHRlbnNpb24gdG8gYXV0b21hdGljYWxseSBleGVjdXRlIHNvbWUgY29kZVxuICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAZXh0TWFuYWdlci5nZXRJbml0aWFsaXplZEV4dGVuc2lvbnMoKSwgKGksIGV4dCkgPT5cbiAgICAgICAgICAgICAgICAjIFNpbmNlIHRoaXMgbWV0aG9kIGlzIG5vdCByZXF1aXJlZCBsZXRzIGNoZWNrIGlmIGl0J3MgZGVmaW5lZFxuICAgICAgICAgICAgICAgIGlmIGV4dCAmJiB0eXBlb2YgZXh0LmFmdGVyQXBwU3RhcnRlZCA9PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQoQClcblxuICAgICAgICBjcmVhdGVTYW5kYm94OiAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ZXNbbmFtZV0gPSBPYmplY3QuY3JlYXRlKEAuc2FuZGJveClcblxuXG4gICAgcmV0dXJuIE5HTFxuKSIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHNob3VsZCBwcm9iYWJseSBiZSBkZWZpbmVkIGF0IGEgcHJvamVjdCBsZXZlbCwgbm90IGhlcmVcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIFJlbmRlcmVyID1cblxuICAgICAgICByZW5kZXI6ICh0ZW1wbGF0ZSwgZGF0YSkgLT5cblxuICAgICAgICAgICAgdW5sZXNzIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgXCJUaGUgdGVtcGxhdGUgcGFzc2VkIHRvIHRoZSBSZW5kZXJlciBpcyBub3QgZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbiB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZSBkYXRhXG5cblxuXG4gICAgIyBEZWZhdWx0IGJhc2Ugb2JqZWN0IHRoYXQgaXMgZ29ubmEgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBvYmplY3QgdG8gYmUgbWl4ZWRcbiAgICAjIGludG8gb3RoZXIgdmlld3NcbiAgICBCYXNlVmlldyA9XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogKCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJpbml0aWFsaXplIGRlbCBCYXNlVmlld1wiXG5cbiAgICAgICAgICAgIF8uYmluZEFsbCBALCAncmVuZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAncmVuZGVyV3JhcHBlcidcblxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYmVmb3JlUmVuZGVyXG4gICAgICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdiZWZvcmVSZW5kZXInXG5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGFmdGVyUmVuZGVyXG4gICAgICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdhZnRlclJlbmRlcidcblxuICAgICAgICAgICAgQHJlbmRlciA9IEJhc2UudXRpbC5fLndyYXAgQHJlbmRlciwgQHJlbmRlcldyYXBwZXJcblxuICAgICAgICAjIE1ldGhvZCB0byBlbnN1cmUgdGhhdCB0aGUgZGF0YSBpcyBhbHdheXMgcGFzc2VkIHRvIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgc2FtZSB3YXlcbiAgICAgICAgc2VyaWFsaXplRGF0YSA6ICgpIC0+XG5cbiAgICAgICAgICAgIGRhdGEgPSB7fVxuXG4gICAgICAgICAgICBpZiBAbW9kZWxcbiAgICAgICAgICAgICAgICBkYXRhID0gQG1vZGVsLnRvSlNPTigpXG4gICAgICAgICAgICBlbHNlIGlmIEBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgIyB0aGlzIHdheSB3ZSBub3JtYWxpemUgdGhlIHByb3BlcnR5IHdlJ2xsIHVzZSB0byBpdGVyYXRlXG4gICAgICAgICAgICAgICAgIyB0aGUgY29sbGVjdGlvbiBpbnNpZGUgdGhlIGhic1xuICAgICAgICAgICAgICAgIGRhdGEgPSBpdGVtcyA6IEBjb2xsZWN0aW9uLnRvSlNPTigpXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIGJlIGhlbHBmdWxsIGluIHZpZXdzIHdoaWNoIHJlbmRlcnMgY29sbGVjdGlvbnNcbiAgICAgICAgICAgICMgYW5kIG5lZWRzIHRvIGRpc3BsYXkgYSBjdXN0b21pemFibGUgdGl0bGUgb24gdG9wXG4gICAgICAgICAgICBpZiBAdGl0bGVcbiAgICAgICAgICAgICAgICBkYXRhLnRpdGxlID0gQHRpdGxlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBkYXRhXG5cbiAgICAgICAgIyBFbnN1cmVzIHRoYXQgZXZlbnRzIGFyZSByZW1vdmVkIGJlZm9yZSB0aGUgVmlldyBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICBkZXN0cm95IDogKCkgLT5cblxuICAgICAgICAgICAgIyB1bmJpbmQgZXZlbnRzXG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICBAJGVsLnJlbW92ZURhdGEoKS51bmJpbmQoKSBpZiBAJGVsXG5cbiAgICAgICAgICAgICNSZW1vdmUgdmlldyBmcm9tIERPTVxuICAgICAgICAgICAgQHJlbW92ZSgpXG4gICAgICAgICAgICBCYWNrYm9uZS5WaWV3OjpyZW1vdmUuY2FsbCh0aGlzKVxuXG4gICAgICAgICMgV3JhcHBlciB0byBhZGQgXCJiZWZvcmVSZW5kZXJcIiBhbmQgXCJhZnRlclJlbmRlclwiIG1ldGhvZHMuXG4gICAgICAgIHJlbmRlcldyYXBwZXI6IChvcmlnaW5hbFJlbmRlcikgLT5cbiAgICAgICAgICAgIEBiZWZvcmVSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBiZWZvcmVSZW5kZXJcblxuICAgICAgICAgICAgb3JpZ2luYWxSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIG9yaWdpbmFsUmVuZGVyXG5cbiAgICAgICAgICAgIEBhZnRlclJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGFmdGVyUmVuZGVyXG5cbiAgICAgICAgICAgIEBcblxuICAgICAgICByZW5kZXI6ICgpIC0+XG5cbiAgICAgICAgICAgICMgYXMgYSBydWxlLCBpZiB0aGUgdGVtcGxhdGUgaXMgcGFzc2VkIGFzIGEgcGFyYW1ldGVyIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAgICAjIHRoaXMgb3B0aW9uIHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIHZpZXdcbiAgICAgICAgICAgIGlmIEBtb2RlbCBhbmQgQG1vZGVsLmdldCgndGVtcGxhdGUnKVxuICAgICAgICAgICAgICAgIHRwbCA9IEpTVFtAbW9kZWwuZ2V0KCd0ZW1wbGF0ZScpXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRwbCA9IEB0ZW1wbGF0ZVxuXG4gICAgICAgICAgICBkYXRhID0gQHNlcmlhbGl6ZURhdGEoKVxuXG4gICAgICAgICAgICBodG1sID0gUmVuZGVyZXIucmVuZGVyKHRwbCwgZGF0YSlcblxuICAgICAgICAgICAgQGF0dGFjaEVsQ29udGVudCBodG1sXG5cbiAgICAgICAgICAgIEBcblxuICAgICAgICBhdHRhY2hFbENvbnRlbnQ6IChodG1sKSAtPlxuXG4gICAgICAgICAgICBAJGVsLmFwcGVuZChodG1sKVxuICBcbiAgICAgICAgICAgIEBcblxuXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgQmFja2JvbmVcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94Lm12YyA9ICgpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgTVZDXCJcblxuICAgICAgICAjIHRoaXMgZ2l2ZXMgYWNjZXNzIHRvIEJhc2VWaWV3IGZyb20gdGhlIG91dHNpZGVcbiAgICAgICAgYXBwLnNhbmRib3gubXZjLkJhc2VWaWV3ID0gQmFzZVZpZXdcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGFsbG93cyB0byBtaXggYSBiYWNrYm9uZSB2aWV3IHdpdGggYW4gb2JqZWN0XG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSB2aWV3XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbWl4aW4gPSBCYXNlVmlld1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBhcHAuc2FuZGJveC5tdmMubWl4aW4gPSAodmlldywgbWl4aW4gPSBCYXNlVmlldykgLT5cblxuICAgICAgICAgICAgaWYgbWl4aW4uaW5pdGlhbGl6ZSBpc250ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgb2xkSW5pdGlhbGl6ZSA9IHZpZXc6OmluaXRpYWxpemVcblxuICAgICAgICAgICAgXy5leHRlbmQgdmlldzo6LCBtaXhpblxuICAgICAgICAgICAgXy5kZWZhdWx0cyB2aWV3OjpldmVudHMsIG1peGluLmV2ZW50c1xuXG4gICAgICAgICAgICBpZiBvbGRJbml0aWFsaXplXG4gICAgICAgICAgICAgICAgdmlldzo6aW5pdGlhbGl6ZSA9IC0+XG4gICAgICAgICAgICAgICAgICAgIG1peGluLmluaXRpYWxpemUuYXBwbHkgdGhpc1xuICAgICAgICAgICAgICAgICAgICBvbGRJbml0aWFsaXplLmFwcGx5IHRoaXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBbc3RhcnRBbGwgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciA9ICdib2R5Jy4gQ1NTIHNlbGVjdG9yIHRvIHRlbGwgdGhlIGFwcCB3aGVyZSB0byBsb29rIGZvciBjb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdGFydEFsbDogKHNlbGVjdG9yID0gJ2JvZHknLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2VMaXN0KHNlbGVjdG9yKVxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiRVNUQVMgU0VSSUFOIExBUyBDT01QT05FTlRFUyBQQVJTRUFEQVNcIlxuICAgICAgICAgICAgQmFzZS5sb2cuZGVidWcgY29tcG9uZW50c1xuXG4gICAgICAgICAgICAjIFRPRE86IFByb3hpbW8gcGFzbyBpbmljaWFsaXphciBsYXMgY29tcG9uZW50ZXNcbiAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cbiAgICAgICAgQHBhcnNlTGlzdDogKHNlbGVjdG9yKSAtPlxuXG4gICAgICAgICAgICBsaXN0ID0gW11cblxuICAgICAgICAgICAgIyBoZXJlIHdlIGNvdWxkIGRlZmluZSB0aGUgZGVmYXVsdCBkYXRhLSphIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICMgZGVmaW5lZCB0byBkZWZpbmUgYSBjb21wb25lbnRcbiAgICAgICAgICAgICMgVE9ETzogTWFrZSB0aGUgbmFtZXNwYWNlIFwibG9kZ2VzXCIgY29uZmlndXJhYmxlXG4gICAgICAgICAgICBuYW1lc3BhY2UgPSBcImxvZGdlc1wiXG4gICAgICAgICAgICBjc3NTZWxlY3RvciA9IFtcIltkYXRhLWxvZGdlcy1jb21wb25lbnRdXCJdXG5cblxuICAgICAgICAgICAgIyBUT0RPOiBBY2Nlc3MgdGhlc2UgRE9NIGZ1bmN0aW9uYWxpdHkgdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICAkKHNlbGVjdG9yKS5maW5kKGNzc1NlbGVjdG9yLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogcmVsYXRlZCB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgXCJsb2RnZXNcIilcblxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7IG5hbWU6IG9wdGlvbnMubmFtZSwgb3B0aW9uczogb3B0aW9ucyB9KVxuXG4gICAgICAgICAgICByZXR1cm4gbGlzdFxuXG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQuZWFjaCBkYXRhLCAoaywgdikgLT5cblxuICAgICAgICAgICAgICAgICMgcmVtb3ZlcyB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgayA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgbmFtZXNwYWNlKSwgXCJcIilcblxuICAgICAgICAgICAgICAgICMgZGVjYW1lbGl6ZSB0aGUgb3B0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBrID0gay5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGsuc2xpY2UoMSlcblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGtleSBpcyBkaWZmZXJlbnQgZnJvbSBcImNvbXBvbmVudFwiIGl0IG1lYW5zIGl0IGlzXG4gICAgICAgICAgICAgICAgIyBhbiBvcHRpb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiBrICE9IFwiY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IHZcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB2XG5cbiAgICAgICAgICAgICMgYnVpbGQgYWQgcmV0dXJuIHRoZSBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICBDb21wb25lbnQuYnVpbGRPcHRpb25zT2JqZWN0KG5hbWUsIG9wdGlvbnMpXG5cbiAgICAgICAgXG4gICAgICAgIEBidWlsZE9wdGlvbnNPYmplY3Q6IChuYW1lLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBvcHRpb25zLm5hbWUgPSBuYW1lXG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zXG5cbiAgICAgICAgQGluc3RhbnRpYXRlOiAoY29tcG9uZW50cywgYXBwKSAtPlxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIF8uZWFjaChjb21wb25lbnRzLCAobSwgaSkgLT5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZSBtb2R1bGVzIGFyZSBkZWZpbmVkIHVzaW5nIHRoZSBtb2R1bGVzIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICMgVE9ETzogUHJvdmlkZSBhbiBhbHRlcm5hdGUgd2F5IHRvIGRlZmluZSB3aGljaCBpcyBnb25uYSBiZVxuICAgICAgICAgICAgICAgICMgdGhpcyBnbG9iYWwgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCB0aGUgbW9kdWxlIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiBub3QgXy5pc0VtcHR5KE5HTC5tb2R1bGVzKSBhbmQgTkdMLm1vZHVsZXNbbS5uYW1lXSBhbmQgbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZCA9IE5HTC5tb2R1bGVzW20ubmFtZV1cblxuICAgICAgICAgICAgICAgICAgICAjIGNyZWF0ZSBhIG5ldyBzYW5kYm94IGZvciB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBzYiA9IGFwcC5jcmVhdGVTYW5kYm94KG0ubmFtZSlcblxuICAgICAgICAgICAgICAgICAgICAjIGluamVjdCB0aGUgc2FuZGJveCBhbmQgdGhlIG9wdGlvbnMgaW4gdGhlIG1vZHVsZSBwcm90b1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCBtb2QsIHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbml0IHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbW9kLmluaXRpYWxpemUoKVxuICAgICAgICAgICAgKVxuXG5cbiAgICAjI1xuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGluaXQgdGhlIGV4dGVuc2lvblxuICAgICMjXG5cbiAgICAjIGNvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaWNpYWxpemFkYSBsYSBjb21wb25lbnRlIGRlIENvbXBvbmVudGVzXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMgPSAobGlzdCwgYXBwKSAtPlxuXG4gICAgICAgICAgICBDb21wb25lbnQuc3RhcnRBbGwobGlzdCwgYXBwKVxuXG5cbiAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBsb2FkZWRcbiAgICBhZnRlckFwcFN0YXJ0ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkxsYW1hbmRvIGFsIGFmdGVyQXBwU3RhcnRlZFwiXG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzKG51bGwsIGFwcClcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTkdMKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgRXh0TWFuYWdlclxuXG4gICAgICAgIF9leHRlbnNpb25zOiBbXVxuXG4gICAgICAgIF9pbml0aWFsaXplZEV4dGVuc2lvbnM6IFtdXG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBfLmluY2x1ZGUodGhpcy5fZXh0ZW5zaW9ucywgZXh0KSB0aGVuIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIilcblxuICAgICAgICAgICAgQF9leHRlbnNpb25zLnB1c2goZXh0KVxuXG4gICAgICAgIGluaXQgOiAoY29udGV4dCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gQF9leHRlbnNpb25zXG5cbiAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihAX2V4dGVuc2lvbnMsIGNvbnRleHQpXG4gICAgXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KVxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbml0aWFsaXplZCBleHRlbnNpb25zIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuXG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKSJdfQ==
