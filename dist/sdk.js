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
  Base.log = require('./logger.coffee');
  Base.device = require('./devicedetection.coffee');
  Base.util = {
    each: $.each,
    extend: $.extend,
    uniq: root._.uniq,
    _: root._
  };
  return Base;
});



},{"./devicedetection.coffee":5,"./logger.coffee":9}],4:[function(require,module,exports){
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
      this.sandbox = _.clone(Base);
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
      return this.sandboxes[name] = _.extend({}, this.sandbox, {
        name: name
      });
    };

    return Core;

  })();
  return NGL;
});



},{"./base.coffee":3,"./extension/backbone.ext.coffee":6,"./extension/components.coffee":7,"./extmanager.coffee":8}],5:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, DeviceDetection) {
  var isMobile;
  isMobile = require('ismobilejs');
  DeviceDetection = {
    isMobile: function() {
      return isMobile.phone;
    },
    isTablet: function() {
      return isMobile.tablet;
    },
    isIphone: function() {
      return isMobile.apple.phone;
    },
    isIpod: function() {
      return isMobile.apple.ipod;
    },
    isIpad: function() {
      return isMobile.apple.tablet;
    },
    isApple: function() {
      return isMobile.apple.device;
    },
    isAndroidPhone: function() {
      return isMobile.android.phone;
    },
    isAndroidTablet: function() {
      return isMobile.android.tablet;
    },
    isAndroidDevice: function() {
      return isMobile.android.device;
    },
    isWindowsPhone: function() {
      return isMobile.windows.phone;
    },
    isWindowsTablet: function() {
      return isMobile.windows.tablet;
    },
    isWindowsDevice: function() {
      return isMobile.windows.device;
    }
  };
  return DeviceDetection;
});



},{"ismobilejs":1}],6:[function(require,module,exports){

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



},{"./../base.coffee":3}],7:[function(require,module,exports){
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



},{"./../base.coffee":3}],8:[function(require,module,exports){
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



},{"./base.coffee":3}],9:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Logger) {
  var loglevel;
  loglevel = require('loglevel');
  Logger = {
    setLevel: function(level) {
      return loglevel.setLevel(level);
    },
    trace: function(msg) {
      return loglevel.trace(msg);
    },
    debug: function(msg) {
      return loglevel.debug(msg);
    },
    info: function(msg) {
      return loglevel.info(msg);
    },
    warn: function(msg) {
      return loglevel.warn(msg);
    },
    error: function(msg) {
      return loglevel.error(msg);
    }
  };
  return Logger;
});



},{"loglevel":2}]},{},[3,8,4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2lzbW9iaWxlanMvaXNNb2JpbGUuanMiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL25vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9iYXNlLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2NvcmUuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvZGV2aWNlZGV0ZWN0aW9uLmNvZmZlZSIsIi9Vc2Vycy9mcmFtaW5pL1dvcmsvR2xvYmFudC9wbGF0Zm9ybS1zZGsvc3JjL2V4dGVuc2lvbi9iYWNrYm9uZS5leHQuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlIiwiL1VzZXJzL2ZyYW1pbmkvV29yay9HbG9iYW50L3BsYXRmb3JtLXNkay9zcmMvZXh0bWFuYWdlci5jb2ZmZWUiLCIvVXNlcnMvZnJhbWluaS9Xb3JrL0dsb2JhbnQvcGxhdGZvcm0tc2RrL3NyYy9sb2dnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LEdBQUQsR0FBQTthQUNILFFBQVEsQ0FBQyxLQUFULENBQWUsR0FBZixFQURHO0lBQUEsQ0FIUDtBQUFBLElBTUEsS0FBQSxFQUFPLFNBQUMsR0FBRCxHQUFBO2FBQ0gsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLEVBREc7SUFBQSxDQU5QO0FBQUEsSUFTQSxJQUFBLEVBQU0sU0FBQyxHQUFELEdBQUE7YUFDRixRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsRUFERTtJQUFBLENBVE47QUFBQSxJQVlBLElBQUEsRUFBTSxTQUFDLEdBQUQsR0FBQTthQUNGLFFBQVEsQ0FBQyxJQUFULENBQWMsR0FBZCxFQURFO0lBQUEsQ0FaTjtBQUFBLElBZUEsS0FBQSxFQUFPLFNBQUMsR0FBRCxHQUFBO2FBQ0gsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLEVBREc7SUFBQSxDQWZQO0dBTEosQ0FBQTtBQXVCQSxTQUFPLE1BQVAsQ0ExQk07QUFBQSxDQUpWLENBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIGlzTW9iaWxlLmpzIHYwLjMuMlxuICpcbiAqIEEgc2ltcGxlIGxpYnJhcnkgdG8gZGV0ZWN0IEFwcGxlIHBob25lcyBhbmQgdGFibGV0cyxcbiAqIEFuZHJvaWQgcGhvbmVzIGFuZCB0YWJsZXRzLCBvdGhlciBtb2JpbGUgZGV2aWNlcyAobGlrZSBibGFja2JlcnJ5LCBtaW5pLW9wZXJhIGFuZCB3aW5kb3dzIHBob25lKSxcbiAqIGFuZCBhbnkga2luZCBvZiBzZXZlbiBpbmNoIGRldmljZSwgdmlhIHVzZXIgYWdlbnQgc25pZmZpbmcuXG4gKlxuICogQGF1dGhvcjogS2FpIE1hbGxlYSAoa21hbGxlYUBnbWFpbC5jb20pXG4gKlxuICogQGxpY2Vuc2U6IGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cbiAqL1xuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIHZhciBhcHBsZV9waG9uZSAgICAgID0gL2lQaG9uZS9pLFxuICAgICAgICBhcHBsZV9pcG9kICAgICAgID0gL2lQb2QvaSxcbiAgICAgICAgYXBwbGVfdGFibGV0ICAgICA9IC9pUGFkL2ksXG4gICAgICAgIGFuZHJvaWRfcGhvbmUgICAgPSAvKD89LipcXGJBbmRyb2lkXFxiKSg/PS4qXFxiTW9iaWxlXFxiKS9pLCAvLyBNYXRjaCAnQW5kcm9pZCcgQU5EICdNb2JpbGUnXG4gICAgICAgIGFuZHJvaWRfdGFibGV0ICAgPSAvQW5kcm9pZC9pLFxuICAgICAgICB3aW5kb3dzX3Bob25lICAgID0gL0lFTW9iaWxlL2ksXG4gICAgICAgIHdpbmRvd3NfdGFibGV0ICAgPSAvKD89LipcXGJXaW5kb3dzXFxiKSg/PS4qXFxiQVJNXFxiKS9pLCAvLyBNYXRjaCAnV2luZG93cycgQU5EICdBUk0nXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnkgPSAvQmxhY2tCZXJyeS9pLFxuICAgICAgICBvdGhlcl9vcGVyYSAgICAgID0gL09wZXJhIE1pbmkvaSxcbiAgICAgICAgb3RoZXJfZmlyZWZveCAgICA9IC8oPz0uKlxcYkZpcmVmb3hcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdGaXJlZm94JyBBTkQgJ01vYmlsZSdcbiAgICAgICAgc2V2ZW5faW5jaCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnKD86JyArICAgICAgICAgLy8gTm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnTmV4dXMgNycgKyAgICAgLy8gTmV4dXMgN1xuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0JOVFYyNTAnICsgICAgIC8vIEImTiBOb29rIFRhYmxldCA3IGluY2hcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdLaW5kbGUgRmlyZScgKyAvLyBLaW5kbGUgRmlyZVxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ1NpbGsnICsgICAgICAgIC8vIEtpbmRsZSBGaXJlLCBTaWxrIEFjY2VsZXJhdGVkXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnR1QtUDEwMDAnICsgICAgLy8gR2FsYXh5IFRhYiA3IGluY2hcblxuICAgICAgICAgICAgJyknLCAgICAgICAgICAgIC8vIEVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdpJyk7ICAgICAgICAgICAvLyBDYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nXG5cbiAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbihyZWdleCwgdXNlckFnZW50KSB7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHZhciBJc01vYmlsZUNsYXNzID0gZnVuY3Rpb24odXNlckFnZW50KSB7XG4gICAgICAgIHZhciB1YSA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgICAgIHRoaXMuYXBwbGUgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFwcGxlX3Bob25lLCB1YSksXG4gICAgICAgICAgICBpcG9kOiAgIG1hdGNoKGFwcGxlX2lwb2QsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2goYXBwbGVfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFwcGxlX3Bob25lLCB1YSkgfHwgbWF0Y2goYXBwbGVfaXBvZCwgdWEpIHx8IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5kcm9pZCA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiAhbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpICYmIG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSB8fCBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2luZG93cyA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2god2luZG93c19waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSkgfHwgbWF0Y2god2luZG93c190YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm90aGVyID0ge1xuICAgICAgICAgICAgYmxhY2tiZXJyeTogbWF0Y2gob3RoZXJfYmxhY2tiZXJyeSwgdWEpLFxuICAgICAgICAgICAgb3BlcmE6ICAgICAgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSxcbiAgICAgICAgICAgIGZpcmVmb3g6ICAgIG1hdGNoKG90aGVyX2ZpcmVmb3gsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogICAgIG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSB8fCBtYXRjaChvdGhlcl9vcGVyYSwgdWEpIHx8IG1hdGNoKG90aGVyX2ZpcmVmb3gsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldmVuX2luY2ggPSBtYXRjaChzZXZlbl9pbmNoLCB1YSk7XG4gICAgICAgIHRoaXMuYW55ID0gdGhpcy5hcHBsZS5kZXZpY2UgfHwgdGhpcy5hbmRyb2lkLmRldmljZSB8fCB0aGlzLndpbmRvd3MuZGV2aWNlIHx8IHRoaXMub3RoZXIuZGV2aWNlIHx8IHRoaXMuc2V2ZW5faW5jaDtcbiAgICAgICAgLy8gZXhjbHVkZXMgJ290aGVyJyBkZXZpY2VzIGFuZCBpcG9kcywgdGFyZ2V0aW5nIHRvdWNoc2NyZWVuIHBob25lc1xuICAgICAgICB0aGlzLnBob25lID0gdGhpcy5hcHBsZS5waG9uZSB8fCB0aGlzLmFuZHJvaWQucGhvbmUgfHwgdGhpcy53aW5kb3dzLnBob25lO1xuICAgICAgICAvLyBleGNsdWRlcyA3IGluY2ggZGV2aWNlcywgY2xhc3NpZnlpbmcgYXMgcGhvbmUgb3IgdGFibGV0IGlzIGxlZnQgdG8gdGhlIHVzZXJcbiAgICAgICAgdGhpcy50YWJsZXQgPSB0aGlzLmFwcGxlLnRhYmxldCB8fCB0aGlzLmFuZHJvaWQudGFibGV0IHx8IHRoaXMud2luZG93cy50YWJsZXQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIElNID0gbmV3IElzTW9iaWxlQ2xhc3MoKTtcbiAgICAgICAgSU0uQ2xhc3MgPSBJc01vYmlsZUNsYXNzO1xuICAgICAgICByZXR1cm4gSU07XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vbm9kZVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vYnJvd3NlcmlmeVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGluc3RhbnRpYXRlKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy9BTURcbiAgICAgICAgZGVmaW5lKGluc3RhbnRpYXRlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbC5pc01vYmlsZSA9IGluc3RhbnRpYXRlKCk7XG4gICAgfVxuXG59KSh0aGlzKTtcbiIsIi8qXHJcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcclxuKlxyXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHt9O1xyXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsICdsb2cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kVG9Db25zb2xlKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBib3VuZFRvQ29uc29sZShjb25zb2xlLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZCA9IGNvbnNvbGVbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKG1ldGhvZC5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKG1ldGhvZCwgY29uc29sZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGVbbWV0aG9kTmFtZV0sIGNvbnNvbGUpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEluIElFOCArIE1vZGVybml6ciwgdGhlIGJpbmQgc2hpbSB3aWxsIHJlamVjdCB0aGUgYWJvdmUsIHNvIHdlIGZhbGwgYmFjayB0byB3cmFwcGluZ1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKG1ldGhvZCwgY29uc29sZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKGYsIGNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShmLCBbY29udGV4dCwgYXJndW1lbnRzXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobWV0aG9kRmFjdG9yeSkge1xyXG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaWkrKykge1xyXG4gICAgICAgICAgICBzZWxmW2xvZ01ldGhvZHNbaWldXSA9IG1ldGhvZEZhY3RvcnkobG9nTWV0aG9kc1tpaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb29raWVzQXZhaWxhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgIT09IHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IG51bGwpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XHJcbiAgICAgICAgdmFyIGxvY2FsU3RvcmFnZUZhaWwgPSBmYWxzZSxcclxuICAgICAgICAgICAgbGV2ZWxOYW1lO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2VsZi5sZXZlbHMpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYubGV2ZWxzLmhhc093blByb3BlcnR5KGtleSkgJiYgc2VsZi5sZXZlbHNba2V5XSA9PT0gbGV2ZWxOdW0pIHtcclxuICAgICAgICAgICAgICAgIGxldmVsTmFtZSA9IGtleTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2V0dGluZyBsb2NhbFN0b3JhZ2UgY2FuIGNyZWF0ZSBhIERPTSAyMiBFeGNlcHRpb24gaWYgcnVubmluZyBpbiBQcml2YXRlIG1vZGVcclxuICAgICAgICAgICAgICogaW4gU2FmYXJpLCBzbyBldmVuIGlmIGl0IGlzIGF2YWlsYWJsZSB3ZSBuZWVkIHRvIGNhdGNoIGFueSBlcnJvcnMgd2hlbiB0cnlpbmdcclxuICAgICAgICAgICAgICogdG8gd3JpdGUgdG8gaXRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddID0gbGV2ZWxOYW1lO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VGYWlsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUZhaWwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUZhaWwgJiYgY29va2llc0F2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPSBcImxvZ2xldmVsPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb29raWVSZWdleCA9IC9sb2dsZXZlbD0oW147XSspLztcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUGVyc2lzdGVkTGV2ZWwoKSB7XHJcbiAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0b3JlZExldmVsID09PSB1bmRlZmluZWQgJiYgY29va2llc0F2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVNYXRjaCA9IGNvb2tpZVJlZ2V4LmV4ZWMod2luZG93LmRvY3VtZW50LmNvb2tpZSkgfHwgW107XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gY29va2llTWF0Y2hbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IFwiV0FSTlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKlxyXG4gICAgICogUHVibGljIEFQSVxyXG4gICAgICpcclxuICAgICAqL1xyXG5cclxuICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxyXG4gICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XHJcblxyXG4gICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGV2ZWwgPT09IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsZXZlbCA8PSBzZWxmLmxldmVsc1ttZXRob2ROYW1lLnRvVXBwZXJDYXNlKCldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxyXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xyXG4gICAgc2VsZi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gc2VsZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUGVyc2lzdGVkTGV2ZWwoKTtcclxuICAgIHJldHVybiBzZWxmO1xyXG59KSk7XHJcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBQcm9taXNlIGFic3RyYWN0aW9uXG5cbiAgICAjIERPTSBtYW5pcHVsYXRpb25cblxuICAgICMgTG9nZ2VyXG4gICAgQmFzZS5sb2cgPSByZXF1aXJlICcuL2xvZ2dlci5jb2ZmZWUnXG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBCYXNlLmRldmljZSA9IHJlcXVpcmUgJy4vZGV2aWNlZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgVXRpbHNcbiAgICAjIExpYnJhcmlzIGxpa2UgdW5kZXJzY29yZSwgYmFja2JvbmUsIHdpbGwgYmUgbG9hZGVkIGJ5IHRoZSBwcm9qZWN0XG4gICAgIyBhcyBoYXJkIGRlcGVuZGVuY2llcyBmb3IgdGhpcyBsYXllclxuICAgIEJhc2UudXRpbCA9XG4gICAgICAgIGVhY2g6ICQuZWFjaCxcbiAgICAgICAgZXh0ZW5kOiAkLmV4dGVuZCxcbiAgICAgICAgdW5pcTogcm9vdC5fLnVuaXEsXG4gICAgICAgIF86IHJvb3QuX1xuXG4gICAgcmV0dXJuIEJhc2VcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuTkdMID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR0wpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vZXh0bWFuYWdlci5jb2ZmZWUnKVxuXG4gICAgIyB3ZSdsbCB1c2UgdGhlIE5HTCBvYmplY3QgYXMgdGhlIGdsb2JhbCBFdmVudCBidXNcbiAgICBfLmV4dGVuZCBOR0wsIEJhY2tib25lLkV2ZW50c1xuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgTkdMLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgTkdMLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIGlzIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB2YWx1ZXMgY2FuIGdvIGZyb20gMCB0byA1ICg1IG1lYW5zIGRpc2FibGVkKVxuICAgICAgICAgICAgbmFtZXNwYWNlOiAnbG9kZ2VzJyAjIFRPRE86IGNoYW5nZSB0aGlzIHRvICdwbGF0Zm9ybSdcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLl8uZGVmYXVsdHMgY29uZmlnLCBAY2ZnXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIHRyYWNrIHRoZSBzdGF0ZSBvZiB0aGUgQ29yZS4gV2hlbiBpdCBpc1xuICAgICAgICAgICAgIyB0cnVlLCBpdCBtZWFucyB0aGUgXCJzdGFydCgpXCIgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgICAgICBAc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICMgU2V0IHRoZSBsb2dnaW5nIGxldmVsIGZvciB0aGUgYXBwXG4gICAgICAgICAgICBCYXNlLmxvZy5zZXRMZXZlbChAY29uZmlnLmRlYnVnLmxvZ0xldmVsKVxuXG4gICAgICAgICAgICAjIFRoZSBleHRlbnNpb24gbWFuYWdlciB3aWxsIGJlIG9uIGNoYXJnZSBvZiBsb2FkaW5nIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICMgYW5kIG1ha2UgaXRzIGZ1bmN0aW9uYWxpdHkgYXZhaWxhYmxlIHRvIHRoZSBzdGFja1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIgPSBuZXcgRXh0TWFuYWdlcigpXG5cbiAgICAgICAgICAgICMgdGhyb3VnaCB0aGlzIG9iamVjdCB0aGUgbW9kdWxlcyB3aWxsIGJlIGFjY2VzaW5nIHRoZSBtZXRob2RzIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gXy5jbG9uZSBCYXNlXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjb3VsZCBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY291bGQgbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiU3RhcnQgZGUgQ29yZVwiKVxuXG4gICAgICAgICAgICBAc3RhcnRlZCA9IHRydWVcblxuICAgICAgICAgICAgIyBSZXF1aXJlIGNvcmUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQ29tcG9uZW50cyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlJylcbiAgICAgICAgICAgIEJhY2tib25lRXh0ID0gcmVxdWlyZSgnLi9leHRlbnNpb24vYmFja2JvbmUuZXh0LmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChCYWNrYm9uZUV4dClcblxuICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChpLCBleHQpID0+XG4gICAgICAgICAgICAgICAgIyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBub3QgcmVxdWlyZWQgbGV0cyBjaGVjayBpZiBpdCdzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZiBleHQgJiYgdHlwZW9mIGV4dC5hZnRlckFwcFN0YXJ0ZWQgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gXy5leHRlbmQge30sIEBzYW5kYm94LCBuYW1lIDogbmFtZVxuXG5cbiAgICByZXR1cm4gTkdMXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIERldmljZURldGVjdGlvbikgLT5cblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIGlzTW9iaWxlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIEV4cG9zZSBkZXZpY2UgZGV0ZWN0aW9uIEFQSVxuICAgIERldmljZURldGVjdGlvbiA9XG5cbiAgICAgICAgIyBHcm91cHNcbiAgICAgICAgaXNNb2JpbGU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5waG9uZVxuXG4gICAgICAgIGlzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUudGFibGV0XG5cbiAgICAgICAgIyBBcHBsZSBkZXZpY2VzXG4gICAgICAgIGlzSXBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUucGhvbmVcblxuICAgICAgICBpc0lwb2Q6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5pcG9kXG5cbiAgICAgICAgaXNJcGFkOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUudGFibGV0XG5cbiAgICAgICAgaXNBcHBsZSA6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5kZXZpY2VcblxuICAgICAgICAjIEFuZHJvaWQgZGV2aWNlc1xuICAgICAgICBpc0FuZHJvaWRQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQucGhvbmVcblxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnRhYmxldFxuXG4gICAgICAgIGlzQW5kcm9pZERldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQuZGV2aWNlXG5cbiAgICAgICAgIyBXaW5kb3dzIGRldmljZXNcbiAgICAgICAgaXNXaW5kb3dzUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnBob25lXG5cbiAgICAgICAgaXNXaW5kb3dzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy50YWJsZXRcblxuICAgICAgICBpc1dpbmRvd3NEZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLmRldmljZVxuXG4gICAgcmV0dXJuIERldmljZURldGVjdGlvblxuKSIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHNob3VsZCBwcm9iYWJseSBiZSBkZWZpbmVkIGF0IGEgcHJvamVjdCBsZXZlbCwgbm90IGhlcmVcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIFJlbmRlcmVyID1cblxuICAgICAgICByZW5kZXI6ICh0ZW1wbGF0ZSwgZGF0YSkgLT5cblxuICAgICAgICAgICAgdW5sZXNzIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgXCJUaGUgdGVtcGxhdGUgcGFzc2VkIHRvIHRoZSBSZW5kZXJlciBpcyBub3QgZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbiB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZSBkYXRhXG5cblxuXG4gICAgIyBEZWZhdWx0IGJhc2Ugb2JqZWN0IHRoYXQgaXMgZ29ubmEgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBvYmplY3QgdG8gYmUgbWl4ZWRcbiAgICAjIGludG8gb3RoZXIgdmlld3NcbiAgICBCYXNlVmlldyA9XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogKCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJpbml0aWFsaXplIGRlbCBCYXNlVmlld1wiXG5cbiAgICAgICAgICAgIF8uYmluZEFsbCBALCAncmVuZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAncmVuZGVyV3JhcHBlcidcblxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYmVmb3JlUmVuZGVyXG4gICAgICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdiZWZvcmVSZW5kZXInXG5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGFmdGVyUmVuZGVyXG4gICAgICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdhZnRlclJlbmRlcidcblxuICAgICAgICAgICAgQHJlbmRlciA9IEJhc2UudXRpbC5fLndyYXAgQHJlbmRlciwgQHJlbmRlcldyYXBwZXJcblxuICAgICAgICAjIE1ldGhvZCB0byBlbnN1cmUgdGhhdCB0aGUgZGF0YSBpcyBhbHdheXMgcGFzc2VkIHRvIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgc2FtZSB3YXlcbiAgICAgICAgc2VyaWFsaXplRGF0YSA6ICgpIC0+XG5cbiAgICAgICAgICAgIGRhdGEgPSB7fVxuXG4gICAgICAgICAgICBpZiBAbW9kZWxcbiAgICAgICAgICAgICAgICBkYXRhID0gQG1vZGVsLnRvSlNPTigpXG4gICAgICAgICAgICBlbHNlIGlmIEBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgIyB0aGlzIHdheSB3ZSBub3JtYWxpemUgdGhlIHByb3BlcnR5IHdlJ2xsIHVzZSB0byBpdGVyYXRlXG4gICAgICAgICAgICAgICAgIyB0aGUgY29sbGVjdGlvbiBpbnNpZGUgdGhlIGhic1xuICAgICAgICAgICAgICAgIGRhdGEgPSBpdGVtcyA6IEBjb2xsZWN0aW9uLnRvSlNPTigpXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIGJlIGhlbHBmdWxsIGluIHZpZXdzIHdoaWNoIHJlbmRlcnMgY29sbGVjdGlvbnNcbiAgICAgICAgICAgICMgYW5kIG5lZWRzIHRvIGRpc3BsYXkgYSBjdXN0b21pemFibGUgdGl0bGUgb24gdG9wXG4gICAgICAgICAgICBpZiBAdGl0bGVcbiAgICAgICAgICAgICAgICBkYXRhLnRpdGxlID0gQHRpdGxlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBkYXRhXG5cbiAgICAgICAgIyBFbnN1cmVzIHRoYXQgZXZlbnRzIGFyZSByZW1vdmVkIGJlZm9yZSB0aGUgVmlldyBpcyByZW1vdmVkIGZyb20gdGhlIERPTVxuICAgICAgICBkZXN0cm95IDogKCkgLT5cblxuICAgICAgICAgICAgIyB1bmJpbmQgZXZlbnRzXG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICBAJGVsLnJlbW92ZURhdGEoKS51bmJpbmQoKSBpZiBAJGVsXG5cbiAgICAgICAgICAgICNSZW1vdmUgdmlldyBmcm9tIERPTVxuICAgICAgICAgICAgQHJlbW92ZSgpXG4gICAgICAgICAgICBCYWNrYm9uZS5WaWV3OjpyZW1vdmUuY2FsbCh0aGlzKVxuXG4gICAgICAgICMgV3JhcHBlciB0byBhZGQgXCJiZWZvcmVSZW5kZXJcIiBhbmQgXCJhZnRlclJlbmRlclwiIG1ldGhvZHMuXG4gICAgICAgIHJlbmRlcldyYXBwZXI6IChvcmlnaW5hbFJlbmRlcikgLT5cbiAgICAgICAgICAgIEBiZWZvcmVSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBiZWZvcmVSZW5kZXJcblxuICAgICAgICAgICAgb3JpZ2luYWxSZW5kZXIoKSBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIG9yaWdpbmFsUmVuZGVyXG5cbiAgICAgICAgICAgIEBhZnRlclJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGFmdGVyUmVuZGVyXG5cbiAgICAgICAgICAgIEBcblxuICAgICAgICByZW5kZXI6ICgpIC0+XG5cbiAgICAgICAgICAgICMgYXMgYSBydWxlLCBpZiB0aGUgdGVtcGxhdGUgaXMgcGFzc2VkIGFzIGEgcGFyYW1ldGVyIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAgICAjIHRoaXMgb3B0aW9uIHdpbGwgb3ZlcnJpZGUgdGhlIGRlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIHZpZXdcbiAgICAgICAgICAgIGlmIEBtb2RlbCBhbmQgQG1vZGVsLmdldCgndGVtcGxhdGUnKVxuICAgICAgICAgICAgICAgIHRwbCA9IEpTVFtAbW9kZWwuZ2V0KCd0ZW1wbGF0ZScpXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRwbCA9IEB0ZW1wbGF0ZVxuXG4gICAgICAgICAgICBkYXRhID0gQHNlcmlhbGl6ZURhdGEoKVxuXG4gICAgICAgICAgICBodG1sID0gUmVuZGVyZXIucmVuZGVyKHRwbCwgZGF0YSlcblxuICAgICAgICAgICAgQGF0dGFjaEVsQ29udGVudCBodG1sXG5cbiAgICAgICAgICAgIEBcblxuICAgICAgICBhdHRhY2hFbENvbnRlbnQ6IChodG1sKSAtPlxuXG4gICAgICAgICAgICBAJGVsLmFwcGVuZChodG1sKVxuICBcbiAgICAgICAgICAgIEBcblxuXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgQmFja2JvbmVcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94Lm12YyA9ICgpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgTVZDXCJcblxuICAgICAgICAjIHRoaXMgZ2l2ZXMgYWNjZXNzIHRvIEJhc2VWaWV3IGZyb20gdGhlIG91dHNpZGVcbiAgICAgICAgYXBwLnNhbmRib3gubXZjLkJhc2VWaWV3ID0gQmFzZVZpZXdcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGFsbG93cyB0byBtaXggYSBiYWNrYm9uZSB2aWV3IHdpdGggYW4gb2JqZWN0XG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSB2aWV3XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbWl4aW4gPSBCYXNlVmlld1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBhcHAuc2FuZGJveC5tdmMubWl4aW4gPSAodmlldywgbWl4aW4gPSBCYXNlVmlldykgLT5cblxuICAgICAgICAgICAgaWYgbWl4aW4uaW5pdGlhbGl6ZSBpc250ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgb2xkSW5pdGlhbGl6ZSA9IHZpZXc6OmluaXRpYWxpemVcblxuICAgICAgICAgICAgXy5leHRlbmQgdmlldzo6LCBtaXhpblxuICAgICAgICAgICAgXy5kZWZhdWx0cyB2aWV3OjpldmVudHMsIG1peGluLmV2ZW50c1xuXG4gICAgICAgICAgICBpZiBvbGRJbml0aWFsaXplXG4gICAgICAgICAgICAgICAgdmlldzo6aW5pdGlhbGl6ZSA9IC0+XG4gICAgICAgICAgICAgICAgICAgIG1peGluLmluaXRpYWxpemUuYXBwbHkgdGhpc1xuICAgICAgICAgICAgICAgICAgICBvbGRJbml0aWFsaXplLmFwcGx5IHRoaXNcblxuICAgIG5hbWU6ICdCYWNrYm9uZSBFeHRlbnNpb24nXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIENvbXBvbmVudFxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogW3N0YXJ0QWxsIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgPSAnYm9keScuIENTUyBzZWxlY3RvciB0byB0ZWxsIHRoZSBhcHAgd2hlcmUgdG8gbG9vayBmb3IgY29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBAc3RhcnRBbGw6IChzZWxlY3RvciA9ICdib2R5JywgYXBwKSAtPlxuXG4gICAgICAgICAgICBjb21wb25lbnRzID0gQ29tcG9uZW50LnBhcnNlTGlzdChzZWxlY3RvciwgYXBwLmNvbmZpZy5uYW1lc3BhY2UpXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJQYXJzZWQgY29tcG9uZW50c1wiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBjb21wb25lbnRzXG5cbiAgICAgICAgICAgICMgVE9ETzogUHJveGltbyBwYXNvIGluaWNpYWxpemFyIGxhcyBjb21wb25lbnRlc1xuICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuICAgICAgICBAcGFyc2VMaXN0OiAoc2VsZWN0b3IsIG5hbWVzcGFjZSkgLT5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gaG9sZCBwYXJzZWQgY29tcG9uZW50c1xuICAgICAgICAgICAgbGlzdCA9IFtdXG5cbiAgICAgICAgICAgIG5hbWVzcGFjZXMgPSBbJ3BsYXRmb3JtJ11cblxuICAgICAgICAgICAgIyBUT0RPOiBBZGQgdGhlIGFiaWxpdHkgdG8gcGFzcyBhbiBhcnJheS9vYmplY3Qgb2YgbmFtZXNwYWNlcyBpbnN0ZWFkIG9mIGp1c3Qgb25lXG4gICAgICAgICAgICBuYW1lc3BhY2VzLnB1c2ggbmFtZXNwYWNlIGlmIG5hbWVzcGFjZSBpc250ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgY3NzU2VsZWN0b3JzID0gW11cblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIF8uZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgIyBpZiBhIG5ldyBuYW1lc3BhY2UgaGFzIGJlZW4gcHJvdmlkZWQgbGV0cyBhZGQgaXQgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBjc3NTZWxlY3RvcnMucHVzaCBcIltkYXRhLVwiICsgbnMgKyBcIi1jb21wb25lbnRdXCJcblxuICAgICAgICAgICAgIyBUT0RPOiBBY2Nlc3MgdGhlc2UgRE9NIGZ1bmN0aW9uYWxpdHkgdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICAkKHNlbGVjdG9yKS5maW5kKGNzc1NlbGVjdG9ycy5qb2luKCcsJykpLmVhY2ggKGksIGNvbXApIC0+XG5cbiAgICAgICAgICAgICAgICBucyA9IGRvICgpIC0+XG4gICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgVGhpcyB3YXkgd2Ugb2J0YWluIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAkKGNvbXApLmRhdGEobnMgKyBcIi1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuc1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2VcblxuICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogcmVsYXRlZCB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgbnMpXG5cbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goeyBuYW1lOiBvcHRpb25zLm5hbWUsIG9wdGlvbnM6IG9wdGlvbnMgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RcblxuICAgICAgICBAcGFyc2VDb21wb25lbnRPcHRpb25zOiAoZWwsIG5hbWVzcGFjZSwgb3B0cykgLT5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBvcHRpb25zID0gXy5jbG9uZShvcHRzIHx8IHt9KVxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgRE9NIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgZGF0YSA9ICQoZWwpLmRhdGEoKVxuICAgICAgICAgICAgbmFtZSA9ICcnXG4gICAgICAgICAgICBsZW5ndGggPSAwXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICAkLmVhY2ggZGF0YSwgKGssIHYpIC0+XG5cbiAgICAgICAgICAgICAgICAjIHJlbW92ZXMgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGsgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIG5hbWVzcGFjZSksIFwiXCIpXG5cbiAgICAgICAgICAgICAgICAjIGRlY2FtZWxpemUgdGhlIG9wdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgayA9IGsuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBrLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBrZXkgaXMgZGlmZmVyZW50IGZyb20gXCJjb21wb25lbnRcIiBpdCBtZWFucyBpdCBpc1xuICAgICAgICAgICAgICAgICMgYW4gb3B0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgayAhPSBcImNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSB2XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCsrXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdlxuXG4gICAgICAgICAgICAjIGFkZCBvbmUgYmVjYXVzZSB3ZSd2ZSBhZGRlZCAnZWwnIGF1dG9tYXRpY2FsbHkgYXMgYW4gZXh0cmEgb3B0aW9uXG4gICAgICAgICAgICBvcHRpb25zLmxlbmd0aCA9IGxlbmd0aCArIDFcblxuICAgICAgICAgICAgIyBidWlsZCBhZCByZXR1cm4gdGhlIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgIENvbXBvbmVudC5idWlsZE9wdGlvbnNPYmplY3QobmFtZSwgb3B0aW9ucylcblxuICAgICAgICBcbiAgICAgICAgQGJ1aWxkT3B0aW9uc09iamVjdDogKG5hbWUsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IG5hbWVcblxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNcblxuICAgICAgICBAaW5zdGFudGlhdGU6IChjb21wb25lbnRzLCBhcHApIC0+XG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgXy5lYWNoKGNvbXBvbmVudHMsIChtLCBpKSAtPlxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIG1vZHVsZXMgYXJlIGRlZmluZWQgdXNpbmcgdGhlIG1vZHVsZXMgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgIyBUT0RPOiBQcm92aWRlIGFuIGFsdGVybmF0ZSB3YXkgdG8gZGVmaW5lIHdoaWNoIGlzIGdvbm5hIGJlXG4gICAgICAgICAgICAgICAgIyB0aGlzIGdsb2JhbCBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBfLmlzRW1wdHkoTkdMLm1vZHVsZXMpIGFuZCBOR0wubW9kdWxlc1ttLm5hbWVdIGFuZCBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9kID0gTkdMLm1vZHVsZXNbbS5uYW1lXVxuXG4gICAgICAgICAgICAgICAgICAgICMgY3JlYXRlIGEgbmV3IHNhbmRib3ggZm9yIHRoaXMgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIHNiID0gYXBwLmNyZWF0ZVNhbmRib3gobS5uYW1lKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5qZWN0IHRoZSBzYW5kYm94IGFuZCB0aGUgb3B0aW9ucyBpbiB0aGUgbW9kdWxlIHByb3RvXG4gICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kIG1vZCwgc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnNcblxuICAgICAgICAgICAgICAgICAgICAjIGluaXQgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtb2QuaW5pdGlhbGl6ZSgpXG4gICAgICAgICAgICApXG5cblxuICAgICMjXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgIyNcblxuICAgICMgY29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pY2lhbGl6YWRhIGxhIGNvbXBvbmVudGUgZGUgQ29tcG9uZW50ZXNcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyA9IChsaXN0LCBhcHApIC0+XG5cbiAgICAgICAgICAgIENvbXBvbmVudC5zdGFydEFsbChsaXN0LCBhcHApXG5cblxuICAgICMgdGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGxvYWRlZFxuICAgIGFmdGVyQXBwU3RhcnRlZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiTGxhbWFuZG8gYWwgYWZ0ZXJBcHBTdGFydGVkXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMobnVsbCwgYXBwKVxuXG4gICAgbmFtZTogJ0NvbXBvbmVudCBFeHRlbnNpb24nXG5cbiAgICAjIHRoaXMgcHJvcGVydHkgd2lsbCBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgIyB0byB2YWxpZGF0ZSB0aGUgQ29tcG9uZW50IGNsYXNzIGluIGlzb2xhdGlvblxuICAgIGNsYXNzZXMgOiBDb21wb25lbnRcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTkdMKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgRXh0TWFuYWdlclxuXG4gICAgICAgIF9leHRlbnNpb25zOiBbXVxuXG4gICAgICAgIF9pbml0aWFsaXplZEV4dGVuc2lvbnM6IFtdXG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICAjIGNoZWNrcyBpZiB0aGUgbmFtZSBmb3IgdGhlIGV4dGVuc2lvbiBoYXZlIGJlZW4gZGVmaW5lZC5cbiAgICAgICAgICAgICMgaWYgbm90IGxvZyBhIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgdW5sZXNzIGV4dC5uYW1lXG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgZXh0ZW5zaW9uIGRvZXNuJ3QgaGF2ZSBhIG5hbWUgYXNzb2NpYXRlZC4gSXQgd2lsbCBiZSBoZXBmdWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcImlmIHlvdSBoYXZlIGFzc2luZyBhbGwgb2YgeW91ciBleHRlbnNpb25zIGEgbmFtZSBmb3IgYmV0dGVyIGRlYnVnZ2luZ1wiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgIyBMZXRzIHRocm93IGFuIGVycm9yIGlmIHdlIHRyeSB0byBpbml0aWFsaXplIHRoZSBzYW1lIGV4dGVuc2lvbiB0d2ljZXNcbiAgICAgICAgICAgIGlmIF8uaW5jbHVkZSh0aGlzLl9leHRlbnNpb25zLCBleHQpIHRoZW4gdGhyb3cgbmV3IEVycm9yKFwiRXh0ZW5zaW9uOiBcIiArIGV4dC5uYW1lICsgXCIgYWxyZWFkeSBleGlzdHMuXCIpXG5cbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucy5wdXNoKGV4dClcblxuICAgICAgICBpbml0IDogKGNvbnRleHQpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oQF9leHRlbnNpb25zLCBjb250ZXh0KVxuICAgIFxuICAgICAgICBfaW5pdEV4dGVuc2lvbiA6IChleHRlbnNpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBleHRlbnNpb25zLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHh0ID0gZXh0ZW5zaW9ucy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgZXh0ZW5zaW9ucyBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dClcblxuICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLnB1c2ggeHRcblxuICAgICAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihleHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgIHJldHVybiBFeHRNYW5hZ2VyXG5cbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTG9nZ2VyKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBsb2dsZXZlbCA9IHJlcXVpcmUoJ2xvZ2xldmVsJylcblxuICAgICMgRXhwb3NlIHRoZSBMb2dnZXIgQVBJXG4gICAgTG9nZ2VyID1cblxuICAgICAgICBzZXRMZXZlbDogKGxldmVsKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuc2V0TGV2ZWwobGV2ZWwpXG5cbiAgICAgICAgdHJhY2U6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC50cmFjZShtc2cpXG5cbiAgICAgICAgZGVidWc6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5kZWJ1Zyhtc2cpXG5cbiAgICAgICAgaW5mbzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmluZm8obXNnKVxuXG4gICAgICAgIHdhcm46IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC53YXJuKG1zZylcblxuICAgICAgICBlcnJvcjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmVycm9yKG1zZylcblxuICAgIHJldHVybiBMb2dnZXJcbikiXX0=
