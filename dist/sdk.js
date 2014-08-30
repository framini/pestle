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
      Base.log.setLevel(this.config.debug.logLevel);
      this.extManager = new ExtManager();
      this.sandbox = Object.create(Base);
      this.sandboxes = {};
    }

    Core.prototype.addExtension = function(ext) {
      return this.extManager.add(ext);
    };

    Core.prototype.start = function(options) {
      var BackboneExt, Components;
      Base.log.info("Start de Core");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2Jhc2UuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvY29yZS5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dG1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUEsQ0FBQyxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7U0FFRyxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLENBQVEsSUFBUixFQUFjLEVBQWQsRUFGcEI7QUFBQSxDQUFELENBQUEsQ0FJRSxNQUpGLEVBSVUsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBUU4sRUFBQSxJQUFJLENBQUMsR0FBTCxHQUFXLE9BQUEsQ0FBUSxVQUFSLENB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c0JBQVIsQ0FEdUI7SUFBQSxDQS9CM0IsQ0FBQTs7c0JBQUE7O01BSkosQ0FBQTtBQXNDQSxTQUFPLFVBQVAsQ0F4Q007QUFBQSxDQUpWLENBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxyXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXHJcbipcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB7fTtcclxuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcclxuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib3VuZFRvQ29uc29sZShjb25zb2xlLCAnbG9nJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZFRvQ29uc29sZShjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBjb25zb2xlW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIGlmIChtZXRob2QuYmluZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25CaW5kaW5nV3JhcHBlcihtZXRob2QsIGNvbnNvbGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChjb25zb2xlW21ldGhvZE5hbWVdLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJbiBJRTggKyBNb2Rlcm5penIsIHRoZSBiaW5kIHNoaW0gd2lsbCByZWplY3QgdGhlIGFib3ZlLCBzbyB3ZSBmYWxsIGJhY2sgdG8gd3JhcHBpbmdcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25CaW5kaW5nV3JhcHBlcihtZXRob2QsIGNvbnNvbGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZnVuY3Rpb25CaW5kaW5nV3JhcHBlcihmLCBjb250ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkoZiwgW2NvbnRleHQsIGFyZ3VtZW50c10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXHJcbiAgICAgICAgXCJ0cmFjZVwiLFxyXG4gICAgICAgIFwiZGVidWdcIixcclxuICAgICAgICBcImluZm9cIixcclxuICAgICAgICBcIndhcm5cIixcclxuICAgICAgICBcImVycm9yXCJcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKG1ldGhvZEZhY3RvcnkpIHtcclxuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgc2VsZltsb2dNZXRob2RzW2lpXV0gPSBtZXRob2RGYWN0b3J5KGxvZ01ldGhvZHNbaWldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29va2llc0F2YWlsYWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llICE9PSB1bmRlZmluZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlICE9PSBudWxsKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgIHZhciBsb2NhbFN0b3JhZ2VGYWlsID0gZmFsc2UsXHJcbiAgICAgICAgICAgIGxldmVsTmFtZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYubGV2ZWxzKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmxldmVscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHNlbGYubGV2ZWxzW2tleV0gPT09IGxldmVsTnVtKSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbE5hbWUgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNldHRpbmcgbG9jYWxTdG9yYWdlIGNhbiBjcmVhdGUgYSBET00gMjIgRXhjZXB0aW9uIGlmIHJ1bm5pbmcgaW4gUHJpdmF0ZSBtb2RlXHJcbiAgICAgICAgICAgICAqIGluIFNhZmFyaSwgc28gZXZlbiBpZiBpdCBpcyBhdmFpbGFibGUgd2UgbmVlZCB0byBjYXRjaCBhbnkgZXJyb3JzIHdoZW4gdHJ5aW5nXHJcbiAgICAgICAgICAgICAqIHRvIHdyaXRlIHRvIGl0XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXSA9IGxldmVsTmFtZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlRmFpbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VGYWlsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VGYWlsICYmIGNvb2tpZXNBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID0gXCJsb2dsZXZlbD1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29va2llUmVnZXggPSAvbG9nbGV2ZWw9KFteO10rKS87XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFBlcnNpc3RlZExldmVsKCkge1xyXG4gICAgICAgIHZhciBzdG9yZWRMZXZlbDtcclxuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkICYmIGNvb2tpZXNBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICB2YXIgY29va2llTWF0Y2ggPSBjb29raWVSZWdleC5leGVjKHdpbmRvdy5kb2N1bWVudC5jb29raWUpIHx8IFtdO1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IGNvb2tpZU1hdGNoWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICpcclxuICAgICAqIFB1YmxpYyBBUElcclxuICAgICAqXHJcbiAgICAgKi9cclxuXHJcbiAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xyXG5cclxuICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxldmVsID09PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPD0gc2VsZi5sZXZlbHNbbWV0aG9kTmFtZS50b1VwcGVyQ2FzZSgpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcclxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcclxuICAgIHNlbGYubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IHNlbGYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZFBlcnNpc3RlZExldmVsKCk7XHJcbiAgICByZXR1cm4gc2VsZjtcclxufSkpO1xyXG4iLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgQmFzZSkgLT5cblxuICAgICMgUHJvbWlzZSBhYnN0cmFjdGlvblxuXG4gICAgIyBET00gbWFuaXB1bGF0aW9uXG5cbiAgICAjIExvZ2dlclxuICAgICMgbG9nbGV2ZWwgaXMgc21hbGwgZW5vdWdoIHRvIGJlIHBhcnQgb2YgdGhlIGRpc3RcbiAgICBCYXNlLmxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJylcblxuICAgICMgVXRpbHNcbiAgICAjIExpYnJhcmlzIGxpa2UgdW5kZXJzY29yZSwgYmFja2JvbmUsIHdpbGwgYmUgbG9hZGVkIGJ5IHRoZSBwcm9qZWN0XG4gICAgIyBhcyBoYXJkIGRlcGVuZGVuY2llcyBmb3IgdGhpcyBsYXllclxuICAgIEJhc2UudXRpbCA9XG4gICAgICAgIGVhY2g6ICQuZWFjaCxcbiAgICAgICAgZXh0ZW5kOiAkLmV4dGVuZCxcbiAgICAgICAgdW5pcTogcm9vdC5fLnVuaXEsXG4gICAgICAgIF86IHJvb3QuX1xuXG4gICAgcmV0dXJuIEJhc2VcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuTkdMID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR0wpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vZXh0bWFuYWdlci5jb2ZmZWUnKVxuXG4gICAgIyB3ZSdsbCB1c2UgdGhlIE5HTCBvYmplY3QgYXMgdGhlIGdsb2JhbCBFdmVudCBidXNcbiAgICBfLmV4dGVuZCBOR0wsIEJhY2tib25lLkV2ZW50c1xuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgTkdMLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgTkdMLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIGlzIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB2YWx1ZXMgY2FuIGdvIGZyb20gMCB0byA1ICg1IG1lYW5zIGRpc2FibGVkKVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuXy5kZWZhdWx0cyBjb25maWcsIEBjZmdcblxuICAgICAgICAgICAgIyBTZXQgdGhlIGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBhcHBcbiAgICAgICAgICAgIEJhc2UubG9nLnNldExldmVsKEBjb25maWcuZGVidWcubG9nTGV2ZWwpXG5cbiAgICAgICAgICAgICMgVGhlIGV4dGVuc2lvbiBtYW5hZ2VyIHdpbGwgYmUgb24gY2hhcmdlIG9mIGxvYWRpbmcgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgIyBhbmQgbWFrZSBpdHMgZnVuY3Rpb25hbGl0eSBhdmFpbGFibGUgdG8gdGhlIHN0YWNrXG4gICAgICAgICAgICBAZXh0TWFuYWdlciA9IG5ldyBFeHRNYW5hZ2VyKClcblxuICAgICAgICAgICAgIyB0aHJvdWdoIHRoaXMgb2JqZWN0IHRoZSBtb2R1bGVzIHdpbGwgYmUgYWNjZXNpbmcgdGhlIG1ldGhvZCBkZWZpbmVkIGJ5IHRoZVxuICAgICAgICAgICAgIyBleHRlbnNpb25zXG4gICAgICAgICAgICBAc2FuZGJveCA9IE9iamVjdC5jcmVhdGUoQmFzZSlcblxuICAgICAgICAgICAgIyBuYW1lc3BhY2UgdG8gaG9sZCBhbGwgdGhlIHNhbmRib3hlc1xuICAgICAgICAgICAgQHNhbmRib3hlcyA9IHt9XG5cblxuXG4gICAgICAgIGFkZEV4dGVuc2lvbjogKGV4dCkgLT5cbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG5cbiAgICAgICAgc3RhcnQ6IChvcHRpb25zKSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlN0YXJ0IGRlIENvcmVcIilcblxuICAgICAgICAgICAgIyBSZXF1aXJlIGNvcmUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQ29tcG9uZW50cyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlJylcbiAgICAgICAgICAgIEJhY2tib25lRXh0ID0gcmVxdWlyZSgnLi9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChCYWNrYm9uZUV4dClcblxuICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChpLCBleHQpID0+XG4gICAgICAgICAgICAgICAgIyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBub3QgcmVxdWlyZWQgbGV0cyBjaGVjayBpZiBpdCdzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZiBleHQgJiYgdHlwZW9mIGV4dC5hZnRlckFwcFN0YXJ0ZWQgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gT2JqZWN0LmNyZWF0ZShALnNhbmRib3gpXG5cblxuICAgIHJldHVybiBOR0xcbikiLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiBzaG91bGQgcHJvYmFibHkgYmUgZGVmaW5lZCBhdCBhIHByb2plY3QgbGV2ZWwsIG5vdCBoZXJlXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBSZW5kZXJlciA9XG5cbiAgICAgICAgcmVuZGVyOiAodGVtcGxhdGUsIGRhdGEpIC0+XG5cbiAgICAgICAgICAgIHVubGVzcyB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIFwiVGhlIHRlbXBsYXRlIHBhc3NlZCB0byB0aGUgUmVuZGVyZXIgaXMgbm90IGRlZmluZWRcIlxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUgZGF0YVxuXG5cblxuICAgICMgRGVmYXVsdCBiYXNlIG9iamVjdCB0aGF0IGlzIGdvbm5hIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgb2JqZWN0IHRvIGJlIG1peGVkXG4gICAgIyBpbnRvIG90aGVyIHZpZXdzXG4gICAgQmFzZVZpZXcgPVxuXG4gICAgICAgIGluaXRpYWxpemU6ICgpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiaW5pdGlhbGl6ZSBkZWwgQmFzZVZpZXdcIlxuXG4gICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ3JlbmRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3JlbmRlcldyYXBwZXInXG5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGJlZm9yZVJlbmRlclxuICAgICAgICAgICAgICAgIF8uYmluZEFsbCBALCAnYmVmb3JlUmVuZGVyJ1xuXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBhZnRlclJlbmRlclxuICAgICAgICAgICAgICAgIF8uYmluZEFsbCBALCAnYWZ0ZXJSZW5kZXInXG5cbiAgICAgICAgICAgIEByZW5kZXIgPSBCYXNlLnV0aWwuXy53cmFwIEByZW5kZXIsIEByZW5kZXJXcmFwcGVyXG5cbiAgICAgICAgIyBNZXRob2QgdG8gZW5zdXJlIHRoYXQgdGhlIGRhdGEgaXMgYWx3YXlzIHBhc3NlZCB0byB0aGUgdGVtcGxhdGUgaW4gdGhlIHNhbWUgd2F5XG4gICAgICAgIHNlcmlhbGl6ZURhdGEgOiAoKSAtPlxuXG4gICAgICAgICAgICBkYXRhID0ge31cblxuICAgICAgICAgICAgaWYgQG1vZGVsXG4gICAgICAgICAgICAgICAgZGF0YSA9IEBtb2RlbC50b0pTT04oKVxuICAgICAgICAgICAgZWxzZSBpZiBAY29sbGVjdGlvblxuICAgICAgICAgICAgICAgICMgdGhpcyB3YXkgd2Ugbm9ybWFsaXplIHRoZSBwcm9wZXJ0eSB3ZSdsbCB1c2UgdG8gaXRlcmF0ZVxuICAgICAgICAgICAgICAgICMgdGhlIGNvbGxlY3Rpb24gaW5zaWRlIHRoZSBoYnNcbiAgICAgICAgICAgICAgICBkYXRhID0gaXRlbXMgOiBAY29sbGVjdGlvbi50b0pTT04oKVxuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCBiZSBoZWxwZnVsbCBpbiB2aWV3cyB3aGljaCByZW5kZXJzIGNvbGxlY3Rpb25zXG4gICAgICAgICAgICAjIGFuZCBuZWVkcyB0byBkaXNwbGF5IGEgY3VzdG9taXphYmxlIHRpdGxlIG9uIHRvcFxuICAgICAgICAgICAgaWYgQHRpdGxlXG4gICAgICAgICAgICAgICAgZGF0YS50aXRsZSA9IEB0aXRsZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZGF0YVxuXG4gICAgICAgICMgRW5zdXJlcyB0aGF0IGV2ZW50cyBhcmUgcmVtb3ZlZCBiZWZvcmUgdGhlIFZpZXcgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET01cbiAgICAgICAgZGVzdHJveSA6ICgpIC0+XG5cbiAgICAgICAgICAgICMgdW5iaW5kIGV2ZW50c1xuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuICAgICAgICAgICAgQCRlbC5yZW1vdmVEYXRhKCkudW5iaW5kKCkgaWYgQCRlbFxuXG4gICAgICAgICAgICAjUmVtb3ZlIHZpZXcgZnJvbSBET01cbiAgICAgICAgICAgIEByZW1vdmUoKVxuICAgICAgICAgICAgQmFja2JvbmUuVmlldzo6cmVtb3ZlLmNhbGwodGhpcylcblxuICAgICAgICAjIFdyYXBwZXIgdG8gYWRkIFwiYmVmb3JlUmVuZGVyXCIgYW5kIFwiYWZ0ZXJSZW5kZXJcIiBtZXRob2RzLlxuICAgICAgICByZW5kZXJXcmFwcGVyOiAob3JpZ2luYWxSZW5kZXIpIC0+XG4gICAgICAgICAgICBAYmVmb3JlUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYmVmb3JlUmVuZGVyXG5cbiAgICAgICAgICAgIG9yaWdpbmFsUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBvcmlnaW5hbFJlbmRlclxuXG4gICAgICAgICAgICBAYWZ0ZXJSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBhZnRlclJlbmRlclxuXG4gICAgICAgICAgICBAXG5cbiAgICAgICAgcmVuZGVyOiAoKSAtPlxuXG4gICAgICAgICAgICAjIGFzIGEgcnVsZSwgaWYgdGhlIHRlbXBsYXRlIGlzIHBhc3NlZCBhcyBhIHBhcmFtZXRlciBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgICAgIyB0aGlzIG9wdGlvbiB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSB2aWV3XG4gICAgICAgICAgICBpZiBAbW9kZWwgYW5kIEBtb2RlbC5nZXQoJ3RlbXBsYXRlJylcbiAgICAgICAgICAgICAgICB0cGwgPSBKU1RbQG1vZGVsLmdldCgndGVtcGxhdGUnKV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0cGwgPSBAdGVtcGxhdGVcblxuICAgICAgICAgICAgZGF0YSA9IEBzZXJpYWxpemVEYXRhKClcblxuICAgICAgICAgICAgaHRtbCA9IFJlbmRlcmVyLnJlbmRlcih0cGwsIGRhdGEpXG5cbiAgICAgICAgICAgIEBhdHRhY2hFbENvbnRlbnQgaHRtbFxuXG4gICAgICAgICAgICBAXG5cbiAgICAgICAgYXR0YWNoRWxDb250ZW50OiAoaHRtbCkgLT5cblxuICAgICAgICAgICAgQCRlbC5hcHBlbmQoaHRtbClcbiAgXG4gICAgICAgICAgICBAXG5cblxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaWNpYWxpemFkYSBsYSBjb21wb25lbnRlIGRlIEJhY2tib25lXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5tdmMgPSAoKSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaWNpYWxpemFkYSBsYSBjb21wb25lbnRlIGRlIE1WQ1wiXG5cbiAgICAgICAgIyB0aGlzIGdpdmVzIGFjY2VzcyB0byBCYXNlVmlldyBmcm9tIHRoZSBvdXRzaWRlXG4gICAgICAgIGFwcC5zYW5kYm94Lm12Yy5CYXNlVmlldyA9IEJhc2VWaWV3XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBhbGxvd3MgdG8gbWl4IGEgYmFja2JvbmUgdmlldyB3aXRoIGFuIG9iamVjdFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdmlld1xuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG1peGluID0gQmFzZVZpZXdcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgYXBwLnNhbmRib3gubXZjLm1peGluID0gKHZpZXcsIG1peGluID0gQmFzZVZpZXcpIC0+XG5cbiAgICAgICAgICAgIGlmIG1peGluLmluaXRpYWxpemUgaXNudCAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgIG9sZEluaXRpYWxpemUgPSB2aWV3Ojppbml0aWFsaXplXG5cbiAgICAgICAgICAgIF8uZXh0ZW5kIHZpZXc6OiwgbWl4aW5cbiAgICAgICAgICAgIF8uZGVmYXVsdHMgdmlldzo6ZXZlbnRzLCBtaXhpbi5ldmVudHNcblxuICAgICAgICAgICAgaWYgb2xkSW5pdGlhbGl6ZVxuICAgICAgICAgICAgICAgIHZpZXc6OmluaXRpYWxpemUgPSAtPlxuICAgICAgICAgICAgICAgICAgICBtaXhpbi5pbml0aWFsaXplLmFwcGx5IHRoaXNcbiAgICAgICAgICAgICAgICAgICAgb2xkSW5pdGlhbGl6ZS5hcHBseSB0aGlzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIENvbXBvbmVudFxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogW3N0YXJ0QWxsIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgPSAnYm9keScuIENTUyBzZWxlY3RvciB0byB0ZWxsIHRoZSBhcHAgd2hlcmUgdG8gbG9vayBmb3IgY29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBAc3RhcnRBbGw6IChzZWxlY3RvciA9ICdib2R5JywgYXBwKSAtPlxuXG4gICAgICAgICAgICBjb21wb25lbnRzID0gQ29tcG9uZW50LnBhcnNlTGlzdChzZWxlY3RvcilcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkVTVEFTIFNFUklBTiBMQVMgQ09NUE9ORU5URVMgUEFSU0VBREFTXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIGNvbXBvbmVudHNcblxuICAgICAgICAgICAgIyBUT0RPOiBQcm94aW1vIHBhc28gaW5pY2lhbGl6YXIgbGFzIGNvbXBvbmVudGVzXG4gICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG4gICAgICAgIEBwYXJzZUxpc3Q6IChzZWxlY3RvcikgLT5cblxuICAgICAgICAgICAgbGlzdCA9IFtdXG5cbiAgICAgICAgICAgICMgaGVyZSB3ZSBjb3VsZCBkZWZpbmUgdGhlIGRlZmF1bHQgZGF0YS0qYSBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAjIGRlZmluZWQgdG8gZGVmaW5lIGEgY29tcG9uZW50XG4gICAgICAgICAgICAjIFRPRE86IE1ha2UgdGhlIG5hbWVzcGFjZSBcImxvZGdlc1wiIGNvbmZpZ3VyYWJsZVxuICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJsb2RnZXNcIlxuICAgICAgICAgICAgY3NzU2VsZWN0b3IgPSBbXCJbZGF0YS1sb2RnZXMtY29tcG9uZW50XVwiXVxuXG5cbiAgICAgICAgICAgICMgVE9ETzogQWNjZXNzIHRoZXNlIERPTSBmdW5jdGlvbmFsaXR5IHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgJChzZWxlY3RvcikuZmluZChjc3NTZWxlY3Rvci5qb2luKCcsJykpLmVhY2ggKGksIGNvbXApIC0+XG5cbiAgICAgICAgICAgICAgICAjIG9wdGlvbnMgd2lsbCBob2xkIGFsbCB0aGUgZGF0YS0qIHJlbGF0ZWQgdG8gdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBDb21wb25lbnQucGFyc2VDb21wb25lbnRPcHRpb25zKEAsIFwibG9kZ2VzXCIpXG5cbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goeyBuYW1lOiBvcHRpb25zLm5hbWUsIG9wdGlvbnM6IG9wdGlvbnMgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RcblxuICAgICAgICBAcGFyc2VDb21wb25lbnRPcHRpb25zOiAoZWwsIG5hbWVzcGFjZSwgb3B0cykgLT5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBvcHRpb25zID0gXy5jbG9uZShvcHRzIHx8IHt9KVxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgRE9NIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgZGF0YSA9ICQoZWwpLmRhdGEoKVxuICAgICAgICAgICAgbmFtZSA9ICcnXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICAkLmVhY2ggZGF0YSwgKGssIHYpIC0+XG5cbiAgICAgICAgICAgICAgICAjIHJlbW92ZXMgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGsgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIG5hbWVzcGFjZSksIFwiXCIpXG5cbiAgICAgICAgICAgICAgICAjIGRlY2FtZWxpemUgdGhlIG9wdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgayA9IGsuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBrLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBrZXkgaXMgZGlmZmVyZW50IGZyb20gXCJjb21wb25lbnRcIiBpdCBtZWFucyBpdCBpc1xuICAgICAgICAgICAgICAgICMgYW4gb3B0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgayAhPSBcImNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSB2XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdlxuXG4gICAgICAgICAgICAjIGJ1aWxkIGFkIHJldHVybiB0aGUgb3B0aW9uIG9iamVjdFxuICAgICAgICAgICAgQ29tcG9uZW50LmJ1aWxkT3B0aW9uc09iamVjdChuYW1lLCBvcHRpb25zKVxuXG4gICAgICAgIFxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBfLmVhY2goY29tcG9uZW50cywgKG0sIGkpIC0+XG4gICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgbW9kdWxlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgbW9kdWxlcyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIFRPRE86IFByb3ZpZGUgYW4gYWx0ZXJuYXRlIHdheSB0byBkZWZpbmUgd2hpY2ggaXMgZ29ubmEgYmVcbiAgICAgICAgICAgICAgICAjIHRoaXMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IF8uaXNFbXB0eShOR0wubW9kdWxlcykgYW5kIE5HTC5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBOR0wubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQgbW9kLCBzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9uc1xuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZC5pbml0aWFsaXplKClcbiAgICAgICAgICAgIClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBDb21wb25lbnRlc1wiXG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzID0gKGxpc3QsIGFwcCkgLT5cblxuICAgICAgICAgICAgQ29tcG9uZW50LnN0YXJ0QWxsKGxpc3QsIGFwcClcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJMbGFtYW5kbyBhbCBhZnRlckFwcFN0YXJ0ZWRcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyhudWxsLCBhcHApXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HTCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICBfZXh0ZW5zaW9uczogW11cblxuICAgICAgICBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zOiBbXVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuXG4gICAgICAgIGFkZDogKGV4dCkgLT5cblxuICAgICAgICAgICAgaWYgXy5pbmNsdWRlKHRoaXMuX2V4dGVuc2lvbnMsIGV4dCkgdGhlbiB0aHJvdyBuZXcgRXJyb3IoXCJFeHRlbnNpb246IFwiICsgZXh0ICsgXCIgYWxyZWFkeSBleGlzdHMuXCIpXG5cbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucy5wdXNoKGV4dClcblxuICAgICAgICBpbml0IDogKGNvbnRleHQpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oQF9leHRlbnNpb25zLCBjb250ZXh0KVxuICAgIFxuICAgICAgICBfaW5pdEV4dGVuc2lvbiA6IChleHRlbnNpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBleHRlbnNpb25zLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHh0ID0gZXh0ZW5zaW9ucy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgZXh0ZW5zaW9ucyBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dClcblxuICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLnB1c2ggeHRcblxuICAgICAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihleHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgIHJldHVybiBFeHRNYW5hZ2VyXG5cbikiXX0=
