(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * isMobile.js v0.3.2
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */
(function (global) {

    var apple_phone      = /iPhone/i,
        apple_ipod       = /iPod/i,
        apple_tablet     = /iPad/i,
        android_phone    = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet   = /Android/i,
        windows_phone    = /IEMobile/i,
        windows_tablet   = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry = /BlackBerry/i,
        other_opera      = /Opera Mini/i,
        other_firefox    = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' +         // Non-capturing group

            'Nexus 7' +     // Nexus 7

            '|' +           // OR

            'BNTV250' +     // B&N Nook Tablet 7 inch

            '|' +           // OR

            'Kindle Fire' + // Kindle Fire

            '|' +           // OR

            'Silk' +        // Kindle Fire, Silk Accelerated

            '|' +           // OR

            'GT-P1000' +    // Galaxy Tab 7 inch

            ')',            // End non-capturing group

            'i');           // Case-insensitive matching

    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };

    var IsMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;

        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.android = {
            phone:  match(android_phone, ua),
            tablet: !match(android_phone, ua) && match(android_tablet, ua),
            device: match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry: match(other_blackberry, ua),
            opera:      match(other_opera, ua),
            firefox:    match(other_firefox, ua),
            device:     match(other_blackberry, ua) || match(other_opera, ua) || match(other_firefox, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;
        // excludes 'other' devices and ipods, targeting touchscreen phones
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;
        // excludes 7 inch devices, classifying as phone or tablet is left to the user
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function() {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };

    if (typeof module != 'undefined' && module.exports && typeof window === 'undefined') {
        //node
        module.exports = IsMobileClass;
    } else if (typeof module != 'undefined' && module.exports && typeof window !== 'undefined') {
        //browserify
        module.exports = instantiate();
    } else if (typeof define === 'function' && define.amd) {
        //AMD
        define(instantiate());
    } else {
        global.isMobile = instantiate();
    }

})(this);

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Base) {
  Base.log = require('loglevel');
  Base.device = require('ismobilejs');
  Base.util = {
    each: $.each,
    extend: $.extend,
    uniq: root._.uniq,
    _: root._
  };
  return Base;
});



},{"ismobilejs":1,"loglevel":2}],4:[function(require,module,exports){
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
      return this.sandboxes[name] = _.extend(Object.create(this.sandbox), {
        name: name
      });
    };

    return Core;

  })();
  return NGL;
});



},{"./base.coffee":3,"./extension/backbone.ext.coffee":5,"./extension/components.coffee":6,"./extmanager.coffee":7}],5:[function(require,module,exports){

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



},{"./../base.coffee":3}],6:[function(require,module,exports){
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
      components = Component.parseList(selector, app.config.namespace);
      Base.log.info("Parsed components");
      Base.log.debug(components);
      return Component.instantiate(components, app);
    };

    Component.parseList = function(selector, namespace) {
      var cssSelectors, list, namespaces;
      list = [];
      namespaces = ['platform'];
      if (namespace !== 'platform') {
        namespaces.push(namespace);
      }
      cssSelectors = [];
      _.each(namespaces, function(ns, i) {
        return cssSelectors.push("[data-" + ns + "-component]");
      });
      $(selector).find(cssSelectors.join(',')).each(function(i, comp) {
        var ns, options;
        ns = (function() {
          namespace = "";
          _.each(namespaces, function(ns, i) {
            if ($(comp).data(ns + "-component")) {
              return namespace = ns;
            }
          });
          return namespace;
        })();
        options = Component.parseComponentOptions(this, ns);
        return list.push({
          name: options.name,
          options: options
        });
      });
      return list;
    };

    Component.parseComponentOptions = function(el, namespace, opts) {
      var data, length, name, options;
      options = _.clone(opts || {});
      options.el = el;
      data = $(el).data();
      name = '';
      length = 0;
      $.each(data, function(k, v) {
        k = k.replace(new RegExp("^" + namespace), "");
        k = k.charAt(0).toLowerCase() + k.slice(1);
        if (k !== "component") {
          options[k] = v;
          return length++;
        } else {
          return name = v;
        }
      });
      options.length = length + 1;
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
    name: 'Component Extension',
    classes: Component
  };
});



},{"./../base.coffee":3}],7:[function(require,module,exports){
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



},{"./base.coffee":3}]},{},[3,7,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2lzbW9iaWxlanMvaXNNb2JpbGUuanMiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL25vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9iYXNlLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2NvcmUuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvZXh0ZW5zaW9uL2JhY2tib25lLmV4dC5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9leHRtYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O2VBUUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsVUFBaEIsRUFBNEIsT0FBNUIsRUFWSjtPQUZhO0lBQUEsQ0F6QmpCLENBQUE7O0FBQUEseUJBdUNBLHdCQUFBLEdBQTJCLFNBQUEsR0FBQTtBQUN2QixhQUFPLElBQUMsQ0FBQSxzQkFBUixDQUR1QjtJQUFBLENBdkMzQixDQUFBOztzQkFBQTs7TUFKSixDQUFBO0FBOENBLFNBQU8sVUFBUCxDQWhETTtBQUFBLENBSlYsQ0FBQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogaXNNb2JpbGUuanMgdjAuMy4yXG4gKlxuICogQSBzaW1wbGUgbGlicmFyeSB0byBkZXRlY3QgQXBwbGUgcGhvbmVzIGFuZCB0YWJsZXRzLFxuICogQW5kcm9pZCBwaG9uZXMgYW5kIHRhYmxldHMsIG90aGVyIG1vYmlsZSBkZXZpY2VzIChsaWtlIGJsYWNrYmVycnksIG1pbmktb3BlcmEgYW5kIHdpbmRvd3MgcGhvbmUpLFxuICogYW5kIGFueSBraW5kIG9mIHNldmVuIGluY2ggZGV2aWNlLCB2aWEgdXNlciBhZ2VudCBzbmlmZmluZy5cbiAqXG4gKiBAYXV0aG9yOiBLYWkgTWFsbGVhIChrbWFsbGVhQGdtYWlsLmNvbSlcbiAqXG4gKiBAbGljZW5zZTogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXG4gICAgdmFyIGFwcGxlX3Bob25lICAgICAgPSAvaVBob25lL2ksXG4gICAgICAgIGFwcGxlX2lwb2QgICAgICAgPSAvaVBvZC9pLFxuICAgICAgICBhcHBsZV90YWJsZXQgICAgID0gL2lQYWQvaSxcbiAgICAgICAgYW5kcm9pZF9waG9uZSAgICA9IC8oPz0uKlxcYkFuZHJvaWRcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdBbmRyb2lkJyBBTkQgJ01vYmlsZSdcbiAgICAgICAgYW5kcm9pZF90YWJsZXQgICA9IC9BbmRyb2lkL2ksXG4gICAgICAgIHdpbmRvd3NfcGhvbmUgICAgPSAvSUVNb2JpbGUvaSxcbiAgICAgICAgd2luZG93c190YWJsZXQgICA9IC8oPz0uKlxcYldpbmRvd3NcXGIpKD89LipcXGJBUk1cXGIpL2ksIC8vIE1hdGNoICdXaW5kb3dzJyBBTkQgJ0FSTSdcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeSA9IC9CbGFja0JlcnJ5L2ksXG4gICAgICAgIG90aGVyX29wZXJhICAgICAgPSAvT3BlcmEgTWluaS9pLFxuICAgICAgICBvdGhlcl9maXJlZm94ICAgID0gLyg/PS4qXFxiRmlyZWZveFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0ZpcmVmb3gnIEFORCAnTW9iaWxlJ1xuICAgICAgICBzZXZlbl9pbmNoID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICcoPzonICsgICAgICAgICAvLyBOb24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdOZXh1cyA3JyArICAgICAvLyBOZXh1cyA3XG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnQk5UVjI1MCcgKyAgICAgLy8gQiZOIE5vb2sgVGFibGV0IDcgaW5jaFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0tpbmRsZSBGaXJlJyArIC8vIEtpbmRsZSBGaXJlXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnU2lsaycgKyAgICAgICAgLy8gS2luZGxlIEZpcmUsIFNpbGsgQWNjZWxlcmF0ZWRcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdHVC1QMTAwMCcgKyAgICAvLyBHYWxheHkgVGFiIDcgaW5jaFxuXG4gICAgICAgICAgICAnKScsICAgICAgICAgICAgLy8gRW5kIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ2knKTsgICAgICAgICAgIC8vIENhc2UtaW5zZW5zaXRpdmUgbWF0Y2hpbmdcblxuICAgIHZhciBtYXRjaCA9IGZ1bmN0aW9uKHJlZ2V4LCB1c2VyQWdlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodXNlckFnZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIElzTW9iaWxlQ2xhc3MgPSBmdW5jdGlvbih1c2VyQWdlbnQpIHtcbiAgICAgICAgdmFyIHVhID0gdXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgdGhpcy5hcHBsZSA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIGlwb2Q6ICAgbWF0Y2goYXBwbGVfaXBvZCwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaChhcHBsZV90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSB8fCBtYXRjaChhcHBsZV9pcG9kLCB1YSkgfHwgbWF0Y2goYXBwbGVfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmRyb2lkID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6ICFtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgJiYgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpIHx8IG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53aW5kb3dzID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSB8fCBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3RoZXIgPSB7XG4gICAgICAgICAgICBibGFja2JlcnJ5OiBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSksXG4gICAgICAgICAgICBvcGVyYTogICAgICBtYXRjaChvdGhlcl9vcGVyYSwgdWEpLFxuICAgICAgICAgICAgZmlyZWZveDogICAgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiAgICAgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeSwgdWEpIHx8IG1hdGNoKG90aGVyX29wZXJhLCB1YSkgfHwgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V2ZW5faW5jaCA9IG1hdGNoKHNldmVuX2luY2gsIHVhKTtcbiAgICAgICAgdGhpcy5hbnkgPSB0aGlzLmFwcGxlLmRldmljZSB8fCB0aGlzLmFuZHJvaWQuZGV2aWNlIHx8IHRoaXMud2luZG93cy5kZXZpY2UgfHwgdGhpcy5vdGhlci5kZXZpY2UgfHwgdGhpcy5zZXZlbl9pbmNoO1xuICAgICAgICAvLyBleGNsdWRlcyAnb3RoZXInIGRldmljZXMgYW5kIGlwb2RzLCB0YXJnZXRpbmcgdG91Y2hzY3JlZW4gcGhvbmVzXG4gICAgICAgIHRoaXMucGhvbmUgPSB0aGlzLmFwcGxlLnBob25lIHx8IHRoaXMuYW5kcm9pZC5waG9uZSB8fCB0aGlzLndpbmRvd3MucGhvbmU7XG4gICAgICAgIC8vIGV4Y2x1ZGVzIDcgaW5jaCBkZXZpY2VzLCBjbGFzc2lmeWluZyBhcyBwaG9uZSBvciB0YWJsZXQgaXMgbGVmdCB0byB0aGUgdXNlclxuICAgICAgICB0aGlzLnRhYmxldCA9IHRoaXMuYXBwbGUudGFibGV0IHx8IHRoaXMuYW5kcm9pZC50YWJsZXQgfHwgdGhpcy53aW5kb3dzLnRhYmxldDtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgSU0gPSBuZXcgSXNNb2JpbGVDbGFzcygpO1xuICAgICAgICBJTS5DbGFzcyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgICAgIHJldHVybiBJTTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSXNNb2JpbGVDbGFzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9icm93c2VyaWZ5XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gaW5zdGFudGlhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvL0FNRFxuICAgICAgICBkZWZpbmUoaW5zdGFudGlhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgbWV0aG9kTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsIG1ldGhvZE5hbWUpIHtcclxuICAgICAgICB2YXIgbWV0aG9kID0gY29uc29sZVttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAobWV0aG9kLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoY29uc29sZVttZXRob2ROYW1lXSwgY29uc29sZSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gSUU4ICsgTW9kZXJuaXpyLCB0aGUgYmluZCBzaGltIHdpbGwgcmVqZWN0IHRoZSBhYm92ZSwgc28gd2UgZmFsbCBiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIoZiwgY29udGV4dCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KGYsIFtjb250ZXh0LCBhcmd1bWVudHNdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgIFwidHJhY2VcIixcclxuICAgICAgICBcImRlYnVnXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJ3YXJuXCIsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhtZXRob2RGYWN0b3J5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIHNlbGZbbG9nTWV0aG9kc1tpaV1dID0gbWV0aG9kRmFjdG9yeShsb2dNZXRob2RzW2lpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvb2tpZXNBdmFpbGFibGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSAhPT0gdW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gbnVsbCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcclxuICAgICAgICB2YXIgbG9jYWxTdG9yYWdlRmFpbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBsZXZlbE5hbWU7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzZWxmLmxldmVscykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5sZXZlbHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBzZWxmLmxldmVsc1trZXldID09PSBsZXZlbE51bSkge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWxOYW1lID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBTZXR0aW5nIGxvY2FsU3RvcmFnZSBjYW4gY3JlYXRlIGEgRE9NIDIyIEV4Y2VwdGlvbiBpZiBydW5uaW5nIGluIFByaXZhdGUgbW9kZVxyXG4gICAgICAgICAgICAgKiBpbiBTYWZhcmksIHNvIGV2ZW4gaWYgaXQgaXMgYXZhaWxhYmxlIHdlIG5lZWQgdG8gY2F0Y2ggYW55IGVycm9ycyB3aGVuIHRyeWluZ1xyXG4gICAgICAgICAgICAgKiB0byB3cml0ZSB0byBpdFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ10gPSBsZXZlbE5hbWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUZhaWwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlRmFpbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlRmFpbCAmJiBjb29raWVzQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvb2tpZVJlZ2V4ID0gL2xvZ2xldmVsPShbXjtdKykvO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRQZXJzaXN0ZWRMZXZlbCgpIHtcclxuICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XHJcblxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2VBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZCAmJiBjb29raWVzQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZU1hdGNoID0gY29va2llUmVnZXguZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKSB8fCBbXTtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBjb29raWVNYXRjaFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gXCJXQVJOXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqXHJcbiAgICAgKiBQdWJsaWMgQVBJXHJcbiAgICAgKlxyXG4gICAgICovXHJcblxyXG4gICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXHJcbiAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsZXZlbCA9PT0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxldmVsIDw9IHNlbGYubGV2ZWxzW21ldGhvZE5hbWUudG9VcHBlckNhc2UoKV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEJhc2UpIC0+XG5cbiAgICAjIFByb21pc2UgYWJzdHJhY3Rpb25cblxuICAgICMgRE9NIG1hbmlwdWxhdGlvblxuXG4gICAgIyBMb2dnZXJcbiAgICBCYXNlLmxvZyA9IHJlcXVpcmUoJ2xvZ2xldmVsJylcblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIEJhc2UuZGV2aWNlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIFV0aWxzXG4gICAgIyBMaWJyYXJpcyBsaWtlIHVuZGVyc2NvcmUsIGJhY2tib25lLCB3aWxsIGJlIGxvYWRlZCBieSB0aGUgcHJvamVjdFxuICAgICMgYXMgaGFyZCBkZXBlbmRlbmNpZXMgZm9yIHRoaXMgbGF5ZXJcbiAgICBCYXNlLnV0aWwgPVxuICAgICAgICBlYWNoOiAkLmVhY2gsXG4gICAgICAgIGV4dGVuZDogJC5leHRlbmQsXG4gICAgICAgIHVuaXE6IHJvb3QuXy51bmlxLFxuICAgICAgICBfOiByb290Ll9cblxuICAgIHJldHVybiBCYXNlXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByb290Lk5HTCA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTkdMKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5jb2ZmZWUnKVxuICAgIEV4dE1hbmFnZXIgPSByZXF1aXJlKCcuL2V4dG1hbmFnZXIuY29mZmVlJylcblxuICAgICMgd2UnbGwgdXNlIHRoZSBOR0wgb2JqZWN0IGFzIHRoZSBnbG9iYWwgRXZlbnQgYnVzXG4gICAgXy5leHRlbmQgTkdMLCBCYWNrYm9uZS5FdmVudHNcblxuICAgICMgTmFtZXNwYWNlIGZvciBtb2R1bGUgZGVmaW5pdGlvblxuICAgIE5HTC5tb2R1bGVzID0ge31cblxuICAgIGNsYXNzIE5HTC5Db3JlXG4gICAgICAgICMgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5XG4gICAgICAgIHZlcnNpb246IFwiMC4wLjFcIlxuXG4gICAgICAgIGNmZzpcbiAgICAgICAgICAgIGRlYnVnOlxuICAgICAgICAgICAgICAgIGxvZ0xldmVsOiA1ICMgYnkgZGVmYXVsdCB0aGUgbG9nZ2luZyBpcyBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdmFsdWVzIGNhbiBnbyBmcm9tIDAgdG8gNSAoNSBtZWFucyBkaXNhYmxlZClcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ2xvZGdlcycgIyBUT0RPOiBjaGFuZ2UgdGhpcyB0byAncGxhdGZvcm0nXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5fLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gT2JqZWN0LmNyZWF0ZShCYXNlKVxuXG4gICAgICAgICAgICAjIG5hbWVzcGFjZSB0byBob2xkIGFsbCB0aGUgc2FuZGJveGVzXG4gICAgICAgICAgICBAc2FuZGJveGVzID0ge31cblxuXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjb3VsZCBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY291bGQgbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiU3RhcnQgZGUgQ29yZVwiKVxuXG4gICAgICAgICAgICBAc3RhcnRlZCA9IHRydWVcblxuICAgICAgICAgICAgIyBSZXF1aXJlIGNvcmUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQ29tcG9uZW50cyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlJylcbiAgICAgICAgICAgIEJhY2tib25lRXh0ID0gcmVxdWlyZSgnLi9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChCYWNrYm9uZUV4dClcblxuICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChpLCBleHQpID0+XG4gICAgICAgICAgICAgICAgIyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBub3QgcmVxdWlyZWQgbGV0cyBjaGVjayBpZiBpdCdzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZiBleHQgJiYgdHlwZW9mIGV4dC5hZnRlckFwcFN0YXJ0ZWQgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gXy5leHRlbmQgT2JqZWN0LmNyZWF0ZShALnNhbmRib3gpLCBuYW1lIDogbmFtZVxuXG5cbiAgICByZXR1cm4gTkdMXG4pIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gc2hvdWxkIHByb2JhYmx5IGJlIGRlZmluZWQgYXQgYSBwcm9qZWN0IGxldmVsLCBub3QgaGVyZVxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgUmVuZGVyZXIgPVxuXG4gICAgICAgIHJlbmRlcjogKHRlbXBsYXRlLCBkYXRhKSAtPlxuXG4gICAgICAgICAgICB1bmxlc3MgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBcIlRoZSB0ZW1wbGF0ZSBwYXNzZWQgdG8gdGhlIFJlbmRlcmVyIGlzIG5vdCBkZWZpbmVkXCJcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlIGRhdGFcblxuXG5cbiAgICAjIERlZmF1bHQgYmFzZSBvYmplY3QgdGhhdCBpcyBnb25uYSBiZSB1c2VkIGFzIHRoZSBkZWZhdWx0IG9iamVjdCB0byBiZSBtaXhlZFxuICAgICMgaW50byBvdGhlciB2aWV3c1xuICAgIEJhc2VWaWV3ID1cblxuICAgICAgICBpbml0aWFsaXplOiAoKSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcImluaXRpYWxpemUgZGVsIEJhc2VWaWV3XCJcblxuICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdyZW5kZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICdyZW5kZXJXcmFwcGVyJ1xuXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBiZWZvcmVSZW5kZXJcbiAgICAgICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ2JlZm9yZVJlbmRlcidcblxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYWZ0ZXJSZW5kZXJcbiAgICAgICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ2FmdGVyUmVuZGVyJ1xuXG4gICAgICAgICAgICBAcmVuZGVyID0gQmFzZS51dGlsLl8ud3JhcCBAcmVuZGVyLCBAcmVuZGVyV3JhcHBlclxuXG4gICAgICAgICMgTWV0aG9kIHRvIGVuc3VyZSB0aGF0IHRoZSBkYXRhIGlzIGFsd2F5cyBwYXNzZWQgdG8gdGhlIHRlbXBsYXRlIGluIHRoZSBzYW1lIHdheVxuICAgICAgICBzZXJpYWxpemVEYXRhIDogKCkgLT5cblxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICAgIGlmIEBtb2RlbFxuICAgICAgICAgICAgICAgIGRhdGEgPSBAbW9kZWwudG9KU09OKClcbiAgICAgICAgICAgIGVsc2UgaWYgQGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAjIHRoaXMgd2F5IHdlIG5vcm1hbGl6ZSB0aGUgcHJvcGVydHkgd2UnbGwgdXNlIHRvIGl0ZXJhdGVcbiAgICAgICAgICAgICAgICAjIHRoZSBjb2xsZWN0aW9uIGluc2lkZSB0aGUgaGJzXG4gICAgICAgICAgICAgICAgZGF0YSA9IGl0ZW1zIDogQGNvbGxlY3Rpb24udG9KU09OKClcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgYmUgaGVscGZ1bGwgaW4gdmlld3Mgd2hpY2ggcmVuZGVycyBjb2xsZWN0aW9uc1xuICAgICAgICAgICAgIyBhbmQgbmVlZHMgdG8gZGlzcGxheSBhIGN1c3RvbWl6YWJsZSB0aXRsZSBvbiB0b3BcbiAgICAgICAgICAgIGlmIEB0aXRsZVxuICAgICAgICAgICAgICAgIGRhdGEudGl0bGUgPSBAdGl0bGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGRhdGFcblxuICAgICAgICAjIEVuc3VyZXMgdGhhdCBldmVudHMgYXJlIHJlbW92ZWQgYmVmb3JlIHRoZSBWaWV3IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICAgIGRlc3Ryb3kgOiAoKSAtPlxuXG4gICAgICAgICAgICAjIHVuYmluZCBldmVudHNcbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlRGF0YSgpLnVuYmluZCgpIGlmIEAkZWxcblxuICAgICAgICAgICAgI1JlbW92ZSB2aWV3IGZyb20gRE9NXG4gICAgICAgICAgICBAcmVtb3ZlKClcbiAgICAgICAgICAgIEJhY2tib25lLlZpZXc6OnJlbW92ZS5jYWxsKHRoaXMpXG5cbiAgICAgICAgIyBXcmFwcGVyIHRvIGFkZCBcImJlZm9yZVJlbmRlclwiIGFuZCBcImFmdGVyUmVuZGVyXCIgbWV0aG9kcy5cbiAgICAgICAgcmVuZGVyV3JhcHBlcjogKG9yaWdpbmFsUmVuZGVyKSAtPlxuICAgICAgICAgICAgQGJlZm9yZVJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGJlZm9yZVJlbmRlclxuXG4gICAgICAgICAgICBvcmlnaW5hbFJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gb3JpZ2luYWxSZW5kZXJcblxuICAgICAgICAgICAgQGFmdGVyUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYWZ0ZXJSZW5kZXJcblxuICAgICAgICAgICAgQFxuXG4gICAgICAgIHJlbmRlcjogKCkgLT5cblxuICAgICAgICAgICAgIyBhcyBhIHJ1bGUsIGlmIHRoZSB0ZW1wbGF0ZSBpcyBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICMgdGhpcyBvcHRpb24gd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdCB0ZW1wbGF0ZSBvZiB0aGUgdmlld1xuICAgICAgICAgICAgaWYgQG1vZGVsIGFuZCBAbW9kZWwuZ2V0KCd0ZW1wbGF0ZScpXG4gICAgICAgICAgICAgICAgdHBsID0gSlNUW0Btb2RlbC5nZXQoJ3RlbXBsYXRlJyldXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdHBsID0gQHRlbXBsYXRlXG5cbiAgICAgICAgICAgIGRhdGEgPSBAc2VyaWFsaXplRGF0YSgpXG5cbiAgICAgICAgICAgIGh0bWwgPSBSZW5kZXJlci5yZW5kZXIodHBsLCBkYXRhKVxuXG4gICAgICAgICAgICBAYXR0YWNoRWxDb250ZW50IGh0bWxcblxuICAgICAgICAgICAgQFxuXG4gICAgICAgIGF0dGFjaEVsQ29udGVudDogKGh0bWwpIC0+XG5cbiAgICAgICAgICAgIEAkZWwuYXBwZW5kKGh0bWwpXG4gIFxuICAgICAgICAgICAgQFxuXG5cblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBCYWNrYm9uZVwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gubXZjID0gKCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBNVkNcIlxuXG4gICAgICAgICMgdGhpcyBnaXZlcyBhY2Nlc3MgdG8gQmFzZVZpZXcgZnJvbSB0aGUgb3V0c2lkZVxuICAgICAgICBhcHAuc2FuZGJveC5tdmMuQmFzZVZpZXcgPSBCYXNlVmlld1xuXG4gICAgICAgICMjIypcbiAgICAgICAgICogVGhpcyBtZXRob2QgYWxsb3dzIHRvIG1peCBhIGJhY2tib25lIHZpZXcgd2l0aCBhbiBvYmplY3RcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHZpZXdcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBtaXhpbiA9IEJhc2VWaWV3XG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIGFwcC5zYW5kYm94Lm12Yy5taXhpbiA9ICh2aWV3LCBtaXhpbiA9IEJhc2VWaWV3KSAtPlxuXG4gICAgICAgICAgICBpZiBtaXhpbi5pbml0aWFsaXplIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICBvbGRJbml0aWFsaXplID0gdmlldzo6aW5pdGlhbGl6ZVxuXG4gICAgICAgICAgICBfLmV4dGVuZCB2aWV3OjosIG1peGluXG4gICAgICAgICAgICBfLmRlZmF1bHRzIHZpZXc6OmV2ZW50cywgbWl4aW4uZXZlbnRzXG5cbiAgICAgICAgICAgIGlmIG9sZEluaXRpYWxpemVcbiAgICAgICAgICAgICAgICB2aWV3Ojppbml0aWFsaXplID0gLT5cbiAgICAgICAgICAgICAgICAgICAgbWl4aW4uaW5pdGlhbGl6ZS5hcHBseSB0aGlzXG4gICAgICAgICAgICAgICAgICAgIG9sZEluaXRpYWxpemUuYXBwbHkgdGhpc1xuXG4gICAgbmFtZTogJ0JhY2tib25lIEV4dGVuc2lvbidcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBbc3RhcnRBbGwgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciA9ICdib2R5Jy4gQ1NTIHNlbGVjdG9yIHRvIHRlbGwgdGhlIGFwcCB3aGVyZSB0byBsb29rIGZvciBjb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdGFydEFsbDogKHNlbGVjdG9yID0gJ2JvZHknLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2VMaXN0KHNlbGVjdG9yLCBhcHAuY29uZmlnLm5hbWVzcGFjZSlcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIlBhcnNlZCBjb21wb25lbnRzXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIGNvbXBvbmVudHNcblxuICAgICAgICAgICAgIyBUT0RPOiBQcm94aW1vIHBhc28gaW5pY2lhbGl6YXIgbGFzIGNvbXBvbmVudGVzXG4gICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG4gICAgICAgIEBwYXJzZUxpc3Q6IChzZWxlY3RvciwgbmFtZXNwYWNlKSAtPlxuICAgICAgICAgICAgIyBhcnJheSB0byBob2xkIHBhcnNlZCBjb21wb25lbnRzXG4gICAgICAgICAgICBsaXN0ID0gW11cblxuICAgICAgICAgICAgbmFtZXNwYWNlcyA9IFsncGxhdGZvcm0nXVxuXG4gICAgICAgICAgICAjIFRPRE86IEFkZCB0aGUgYWJpbGl0eSB0byBwYXNzIGFuIGFycmF5L29iamVjdCBvZiBuYW1lc3BhY2VzIGluc3RlYWQgb2YganVzdCBvbmVcbiAgICAgICAgICAgIG5hbWVzcGFjZXMucHVzaCBuYW1lc3BhY2UgaWYgbmFtZXNwYWNlIGlzbnQgJ3BsYXRmb3JtJ1xuXG4gICAgICAgICAgICBjc3NTZWxlY3RvcnMgPSBbXVxuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgXy5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgIG5zID0gZG8gKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICBfLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUaGlzIHdheSB3ZSBvYnRhaW4gdGhlIG5hbWVzcGFjZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICQoY29tcCkuZGF0YShucyArIFwiLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IG5zXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAgICAgIyBvcHRpb25zIHdpbGwgaG9sZCBhbGwgdGhlIGRhdGEtKiByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gQ29tcG9uZW50LnBhcnNlQ29tcG9uZW50T3B0aW9ucyhALCBucylcblxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7IG5hbWU6IG9wdGlvbnMubmFtZSwgb3B0aW9uczogb3B0aW9ucyB9KVxuXG4gICAgICAgICAgICByZXR1cm4gbGlzdFxuXG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcbiAgICAgICAgICAgIGxlbmd0aCA9IDBcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQuZWFjaCBkYXRhLCAoaywgdikgLT5cblxuICAgICAgICAgICAgICAgICMgcmVtb3ZlcyB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgayA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgbmFtZXNwYWNlKSwgXCJcIilcblxuICAgICAgICAgICAgICAgICMgZGVjYW1lbGl6ZSB0aGUgb3B0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBrID0gay5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGsuc2xpY2UoMSlcblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGtleSBpcyBkaWZmZXJlbnQgZnJvbSBcImNvbXBvbmVudFwiIGl0IG1lYW5zIGl0IGlzXG4gICAgICAgICAgICAgICAgIyBhbiBvcHRpb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiBrICE9IFwiY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IHZcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoKytcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB2XG5cbiAgICAgICAgICAgICMgYWRkIG9uZSBiZWNhdXNlIHdlJ3ZlIGFkZGVkICdlbCcgYXV0b21hdGljYWxseSBhcyBhbiBleHRyYSBvcHRpb25cbiAgICAgICAgICAgIG9wdGlvbnMubGVuZ3RoID0gbGVuZ3RoICsgMVxuXG4gICAgICAgICAgICAjIGJ1aWxkIGFkIHJldHVybiB0aGUgb3B0aW9uIG9iamVjdFxuICAgICAgICAgICAgQ29tcG9uZW50LmJ1aWxkT3B0aW9uc09iamVjdChuYW1lLCBvcHRpb25zKVxuXG4gICAgICAgIFxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBfLmVhY2goY29tcG9uZW50cywgKG0sIGkpIC0+XG4gICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgbW9kdWxlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgbW9kdWxlcyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIFRPRE86IFByb3ZpZGUgYW4gYWx0ZXJuYXRlIHdheSB0byBkZWZpbmUgd2hpY2ggaXMgZ29ubmEgYmVcbiAgICAgICAgICAgICAgICAjIHRoaXMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IF8uaXNFbXB0eShOR0wubW9kdWxlcykgYW5kIE5HTC5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBOR0wubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQgbW9kLCBzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9uc1xuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZC5pbml0aWFsaXplKClcbiAgICAgICAgICAgIClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBDb21wb25lbnRlc1wiXG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzID0gKGxpc3QsIGFwcCkgLT5cblxuICAgICAgICAgICAgQ29tcG9uZW50LnN0YXJ0QWxsKGxpc3QsIGFwcClcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJMbGFtYW5kbyBhbCBhZnRlckFwcFN0YXJ0ZWRcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyhudWxsLCBhcHApXG5cbiAgICBuYW1lOiAnQ29tcG9uZW50IEV4dGVuc2lvbidcblxuICAgICMgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAgICAjIHRvIHZhbGlkYXRlIHRoZSBDb21wb25lbnQgY2xhc3MgaW4gaXNvbGF0aW9uXG4gICAgY2xhc3NlcyA6IENvbXBvbmVudFxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR0wpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBFeHRNYW5hZ2VyXG5cbiAgICAgICAgX2V4dGVuc2lvbnM6IFtdXG5cbiAgICAgICAgX2luaXRpYWxpemVkRXh0ZW5zaW9uczogW11cblxuICAgICAgICBjb25zdHJ1Y3RvcjogKCkgLT5cblxuICAgICAgICBhZGQ6IChleHQpIC0+XG5cbiAgICAgICAgICAgICMgY2hlY2tzIGlmIHRoZSBuYW1lIGZvciB0aGUgZXh0ZW5zaW9uIGhhdmUgYmVlbiBkZWZpbmVkLlxuICAgICAgICAgICAgIyBpZiBub3QgbG9nIGEgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICB1bmxlc3MgZXh0Lm5hbWVcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBleHRlbnNpb24gZG9lc24ndCBoYXZlIGEgbmFtZSBhc3NvY2lhdGVkLiBJdCB3aWxsIGJlIGhlcGZ1bGwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiaWYgeW91IGhhdmUgYXNzaW5nIGFsbCBvZiB5b3VyIGV4dGVuc2lvbnMgYSBuYW1lIGZvciBiZXR0ZXIgZGVidWdnaW5nXCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgICAgICAjIExldHMgdGhyb3cgYW4gZXJyb3IgaWYgd2UgdHJ5IHRvIGluaXRpYWxpemUgdGhlIHNhbWUgZXh0ZW5zaW9uIHR3aWNlc1xuICAgICAgICAgICAgaWYgXy5pbmNsdWRlKHRoaXMuX2V4dGVuc2lvbnMsIGV4dCkgdGhlbiB0aHJvdyBuZXcgRXJyb3IoXCJFeHRlbnNpb246IFwiICsgZXh0Lm5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIilcblxuICAgICAgICAgICAgQF9leHRlbnNpb25zLnB1c2goZXh0KVxuXG4gICAgICAgIGluaXQgOiAoY29udGV4dCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gQF9leHRlbnNpb25zXG5cbiAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihAX2V4dGVuc2lvbnMsIGNvbnRleHQpXG4gICAgXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KVxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbml0aWFsaXplZCBleHRlbnNpb25zIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuXG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKSJdfQ==
