(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Cookies.js - 0.4.0
 *
 * Copyright (c) 2014, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
(function (undefined) {
    'use strict';

    var Cookies = function (key, value, options) {
        return arguments.length === 1 ?
            Cookies.get(key) : Cookies.set(key, value, options);
    };

    // Allows for setter injection in unit tests
    Cookies._document = document;
    Cookies._navigator = navigator;

    Cookies.defaults = {
        path: '/'
    };

    Cookies.get = function (key) {
        if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
            Cookies._renewCache();
        }

        return Cookies._cache[key];
    };

    Cookies.set = function (key, value, options) {
        options = Cookies._getExtendedOptions(options);
        options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

        Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

        return Cookies;
    };

    Cookies.expire = function (key, options) {
        return Cookies.set(key, undefined, options);
    };

    Cookies._getExtendedOptions = function (options) {
        return {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
        };
    };

    Cookies._isValidDate = function (date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };

    Cookies._getExpiresDate = function (expires, now) {
        now = now || new Date();
        switch (typeof expires) {
            case 'number': expires = new Date(now.getTime() + expires * 1000); break;
            case 'string': expires = new Date(expires); break;
        }

        if (expires && !Cookies._isValidDate(expires)) {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
        }

        return expires;
    };

    Cookies._generateCookieString = function (key, value, options) {
        key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
        value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
        options = options || {};

        var cookieString = key + '=' + value;
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
        cookieString += options.secure ? ';secure' : '';

        return cookieString;
    };

    Cookies._getCookieObjectFromString = function (documentCookie) {
        var cookieObject = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

            if (cookieObject[cookieKvp.key] === undefined) {
                cookieObject[cookieKvp.key] = cookieKvp.value;
            }
        }

        return cookieObject;
    };

    Cookies._getKeyValuePairFromCookieString = function (cookieString) {
        // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
        var separatorIndex = cookieString.indexOf('=');

        // IE omits the "=" when the cookie value is an empty string
        separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

        return {
            key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
            value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
        };
    };

    Cookies._renewCache = function () {
        Cookies._cache = Cookies._getCookieObjectFromString(Cookies._document.cookie);
        Cookies._cachedDocumentCookie = Cookies._document.cookie;
    };

    Cookies._areEnabled = function () {
        var testKey = 'cookies.js';
        var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
        Cookies.expire(testKey);
        return areEnabled;
    };

    Cookies.enabled = Cookies._areEnabled();

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return Cookies; });
    // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Cookies;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = Cookies;
    } else {
        window.Cookies = Cookies;
    }
})();
},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/*
 * loglevel - https://github.com/pimterry/loglevel
 *
 * Copyright (c) 2013 Tim Perry
 * Licensed under the MIT license.
 */

;(function (undefined) {
    var undefinedType = "undefined";

    (function (name, definition) {
        if (typeof module === 'object' && module.exports && typeof require === 'function') {
            module.exports = definition();
        } else if (typeof define === 'function' && typeof define.amd === 'object') {
            define(definition);
        } else {
            this[name] = definition();
        }
    }('log', function () {
        var self = {};
        var noop = function() {};

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
})();

},{}],4:[function(require,module,exports){
/*!
 * verge 1.9.1+201402130803
 * https://github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 */

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'verge', function() {

  var xports = {}
    , win = typeof window != 'undefined' && window
    , doc = typeof document != 'undefined' && document
    , docElem = doc && doc.documentElement
    , matchMedia = win['matchMedia'] || win['msMatchMedia']
    , mq = matchMedia ? function(q) {
        return !!matchMedia.call(win, q).matches;
      } : function() {
        return false;
      }
    , viewportW = xports['viewportW'] = function() {
        var a = docElem['clientWidth'], b = win['innerWidth'];
        return a < b ? b : a;
      }
    , viewportH = xports['viewportH'] = function() {
        var a = docElem['clientHeight'], b = win['innerHeight'];
        return a < b ? b : a;
      };
  
  /** 
   * Test if a media query is active. Like Modernizr.mq
   * @since 1.6.0
   * @return {boolean}
   */  
  xports['mq'] = mq;

  /** 
   * Normalized matchMedia
   * @since 1.6.0
   * @return {MediaQueryList|Object}
   */ 
  xports['matchMedia'] = matchMedia ? function() {
    // matchMedia must be binded to window
    return matchMedia.apply(win, arguments);
  } : function() {
    // Gracefully degrade to plain object
    return {};
  };

  /**
   * @since 1.8.0
   * @return {{width:number, height:number}}
   */
  function viewport() {
    return {'width':viewportW(), 'height':viewportH()};
  }
  xports['viewport'] = viewport;
  
  /** 
   * Cross-browser window.scrollX
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollX'] = function() {
    return win.pageXOffset || docElem.scrollLeft; 
  };

  /** 
   * Cross-browser window.scrollY
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollY'] = function() {
    return win.pageYOffset || docElem.scrollTop; 
  };

  /**
   * @param {{top:number, right:number, bottom:number, left:number}} coords
   * @param {number=} cushion adjustment
   * @return {Object}
   */
  function calibrate(coords, cushion) {
    var o = {};
    cushion = +cushion || 0;
    o['width'] = (o['right'] = coords['right'] + cushion) - (o['left'] = coords['left'] - cushion);
    o['height'] = (o['bottom'] = coords['bottom'] + cushion) - (o['top'] = coords['top'] - cushion);
    return o;
  }

  /**
   * Cross-browser element.getBoundingClientRect plus optional cushion.
   * Coords are relative to the top-left corner of the viewport.
   * @since 1.0.0
   * @param {Element|Object} el element or stack (uses first item)
   * @param {number=} cushion +/- pixel adjustment amount
   * @return {Object|boolean}
   */
  function rectangle(el, cushion) {
    el = el && !el.nodeType ? el[0] : el;
    if (!el || 1 !== el.nodeType) return false;
    return calibrate(el.getBoundingClientRect(), cushion);
  }
  xports['rectangle'] = rectangle;

  /**
   * Get the viewport aspect ratio (or the aspect ratio of an object or element)
   * @since 1.7.0
   * @param {(Element|Object)=} o optional object with width/height props or methods
   * @return {number}
   * @link http://w3.org/TR/css3-mediaqueries/#orientation
   */
  function aspect(o) {
    o = null == o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
    var h = o['height'], w = o['width'];
    h = typeof h == 'function' ? h.call(o) : h;
    w = typeof w == 'function' ? w.call(o) : w;
    return w/h;
  }
  xports['aspect'] = aspect;

  /**
   * Test if an element is in the same x-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inX'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.right >= 0 && r.left <= viewportW();
  };

  /**
   * Test if an element is in the same y-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inY'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.top <= viewportH();
  };

  /**
   * Test if an element is in the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inViewport'] = function(el, cushion) {
    // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both 
    // to avoid calling rectangle() twice. It gzips just as small like this.
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
  };

  return xports;
}));
},{}],5:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Base) {
  Base.log = require('./logger.coffee');
  Base.device = require('./devicedetection.coffee');
  Base.cookies = require('./cookies.coffee');
  Base.vp = require('./viewportdetection.coffee');
  Base.util = {
    each: $.each,
    extend: $.extend,
    uniq: root._.uniq,
    _: root._
  };
  return Base;
});



},{"./cookies.coffee":6,"./devicedetection.coffee":8,"./logger.coffee":12,"./viewportdetection.coffee":13}],6:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Cookies) {
  var cookies;
  cookies = require('cookies-js');
  Cookies = {
    set: function(key, value, options) {
      return cookies.set(key, value, options);
    },
    get: function(key) {
      return cookies.get(key);
    },
    expire: function(key, options) {
      return cookies.expire(key, options);
    }
  };
  return Cookies;
});



},{"cookies-js":1}],7:[function(require,module,exports){
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



},{"./base.coffee":5,"./extension/backbone.ext.coffee":9,"./extension/components.coffee":10,"./extmanager.coffee":11}],8:[function(require,module,exports){
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



},{"ismobilejs":2}],9:[function(require,module,exports){

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



},{"./../base.coffee":5}],10:[function(require,module,exports){
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



},{"./../base.coffee":5}],11:[function(require,module,exports){
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



},{"./base.coffee":5}],12:[function(require,module,exports){
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



},{"loglevel":3}],13:[function(require,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Viewport) {
  var viewport;
  viewport = require('verge');
  Viewport = {
    viewportW: function() {
      return viewport.viewportW();
    },
    viewportH: function(key) {
      return viewport.viewportH();
    },
    viewport: function(key) {
      return viewport.viewport();
    },
    inViewport: function(el, cushion) {
      return viewport.inViewport(el, cushion);
    },
    inX: function(el, cushion) {
      return viewport.inX(el, cushion);
    },
    inY: function(el, cushion) {
      return viewport.inY(el, cushion);
    },
    scrollX: function() {
      return viewport.scrollX();
    },
    scrollY: function() {
      return viewport.scrollY();
    },
    mq: function(mediaQueryString) {
      return viewport.mq(mediaQueryString);
    },
    rectangle: function(el, cushion) {
      return viewport.rectangle(el, cushion);
    },
    aspect: function(o) {
      return viewport.aspect(o);
    }
  };
  return Viewport;
});



},{"verge":4}]},{},[5,11,7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wbGF0Zm9ybS1zZGsvbm9kZV9tb2R1bGVzL2Nvb2tpZXMtanMvc3JjL2Nvb2tpZXMuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL25vZGVfbW9kdWxlcy9pc21vYmlsZWpzL2lzTW9iaWxlLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3BsYXRmb3JtLXNkay9ub2RlX21vZHVsZXMvbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3BsYXRmb3JtLXNkay9ub2RlX21vZHVsZXMvdmVyZ2UvdmVyZ2UuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL3NyYy9iYXNlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wbGF0Zm9ybS1zZGsvc3JjL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3BsYXRmb3JtLXNkay9zcmMvY29yZS5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL3NyYy9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3BsYXRmb3JtLXNkay9zcmMvZXh0ZW5zaW9uL2JhY2tib25lLmV4dC5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL3NyYy9leHRtYW5hZ2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wbGF0Zm9ybS1zZGsvc3JjL2xvZ2dlci5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGxhdGZvcm0tc2RrL3NyYy92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0FBRCxHQUFBO2FBQ0osUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFESTtJQUFBLENBbENSO0dBTEosQ0FBQTtBQTBDQSxTQUFPLFFBQVAsQ0E3Q007QUFBQSxDQUpWLENBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIENvb2tpZXMuanMgLSAwLjQuMFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgU2NvdHQgSGFtcGVyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UsXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBDb29raWVzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xuICAgICAgICAgICAgQ29va2llcy5nZXQoa2V5KSA6IENvb2tpZXMuc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xuICAgIENvb2tpZXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgQ29va2llcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xuXG4gICAgQ29va2llcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgfTtcblxuICAgIENvb2tpZXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgIT09IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSkge1xuICAgICAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvb2tpZXMuX2NhY2hlW2tleV07XG4gICAgfTtcblxuICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcblxuICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgICByZXR1cm4gQ29va2llcztcbiAgICB9O1xuXG4gICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXG4gICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXG4gICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXG4gICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xuICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgZXhwaXJlcykge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzogZXhwaXJlcyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzogZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleHBpcmVzICYmICFDb29raWVzLl9pc1ZhbGlkRGF0ZShleHBpcmVzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZXhwaXJlc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBEYXRlIGluc3RhbmNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwaXJlcztcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XG4gICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XG4gICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB2YXIgY29va2llU3RyaW5nID0ga2V5ICsgJz0nICsgdmFsdWU7XG4gICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnBhdGggPyAnO3BhdGg9JyArIG9wdGlvbnMucGF0aCA6ICcnO1xuICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5kb21haW4gPyAnO2RvbWFpbj0nICsgb3B0aW9ucy5kb21haW4gOiAnJztcbiAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZXhwaXJlcyA/ICc7ZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcbiAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuc2VjdXJlID8gJztzZWN1cmUnIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2V0Q29va2llT2JqZWN0RnJvbVN0cmluZyA9IGZ1bmN0aW9uIChkb2N1bWVudENvb2tpZSkge1xuICAgICAgICB2YXIgY29va2llT2JqZWN0ID0ge307XG4gICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XG5cbiAgICAgICAgICAgIGlmIChjb29raWVPYmplY3RbY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvb2tpZU9iamVjdFtjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb29raWVPYmplY3Q7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XG4gICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXG4gICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XG5cbiAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVN0cmluZy5zdWJzdHIoMCwgc2VwYXJhdG9ySW5kZXgpKSxcbiAgICAgICAgICAgIHZhbHVlOiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpKVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENvb2tpZU9iamVjdEZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcbiAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2FyZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ZXN0S2V5ID0gJ2Nvb2tpZXMuanMnO1xuICAgICAgICB2YXIgYXJlRW5hYmxlZCA9IENvb2tpZXMuc2V0KHRlc3RLZXksIDEpLmdldCh0ZXN0S2V5KSA9PT0gJzEnO1xuICAgICAgICBDb29raWVzLmV4cGlyZSh0ZXN0S2V5KTtcbiAgICAgICAgcmV0dXJuIGFyZUVuYWJsZWQ7XG4gICAgfTtcblxuICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcblxuICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gQ29va2llczsgfSk7XG4gICAgLy8gQ29tbW9uSlMgYW5kIE5vZGUuanMgbW9kdWxlIHN1cHBvcnQuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gU3VwcG9ydCBOb2RlLmpzIHNwZWNpZmljIGBtb2R1bGUuZXhwb3J0c2AgKHdoaWNoIGNhbiBiZSBhIGZ1bmN0aW9uKVxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IENvb2tpZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXG4gICAgICAgIGV4cG9ydHMuQ29va2llcyA9IENvb2tpZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LkNvb2tpZXMgPSBDb29raWVzO1xuICAgIH1cbn0pKCk7IiwiLyoqXG4gKiBpc01vYmlsZS5qcyB2MC4zLjJcbiAqXG4gKiBBIHNpbXBsZSBsaWJyYXJ5IHRvIGRldGVjdCBBcHBsZSBwaG9uZXMgYW5kIHRhYmxldHMsXG4gKiBBbmRyb2lkIHBob25lcyBhbmQgdGFibGV0cywgb3RoZXIgbW9iaWxlIGRldmljZXMgKGxpa2UgYmxhY2tiZXJyeSwgbWluaS1vcGVyYSBhbmQgd2luZG93cyBwaG9uZSksXG4gKiBhbmQgYW55IGtpbmQgb2Ygc2V2ZW4gaW5jaCBkZXZpY2UsIHZpYSB1c2VyIGFnZW50IHNuaWZmaW5nLlxuICpcbiAqIEBhdXRob3I6IEthaSBNYWxsZWEgKGttYWxsZWFAZ21haWwuY29tKVxuICpcbiAqIEBsaWNlbnNlOiBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICB2YXIgYXBwbGVfcGhvbmUgICAgICA9IC9pUGhvbmUvaSxcbiAgICAgICAgYXBwbGVfaXBvZCAgICAgICA9IC9pUG9kL2ksXG4gICAgICAgIGFwcGxlX3RhYmxldCAgICAgPSAvaVBhZC9pLFxuICAgICAgICBhbmRyb2lkX3Bob25lICAgID0gLyg/PS4qXFxiQW5kcm9pZFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0FuZHJvaWQnIEFORCAnTW9iaWxlJ1xuICAgICAgICBhbmRyb2lkX3RhYmxldCAgID0gL0FuZHJvaWQvaSxcbiAgICAgICAgd2luZG93c19waG9uZSAgICA9IC9JRU1vYmlsZS9pLFxuICAgICAgICB3aW5kb3dzX3RhYmxldCAgID0gLyg/PS4qXFxiV2luZG93c1xcYikoPz0uKlxcYkFSTVxcYikvaSwgLy8gTWF0Y2ggJ1dpbmRvd3MnIEFORCAnQVJNJ1xuICAgICAgICBvdGhlcl9ibGFja2JlcnJ5ID0gL0JsYWNrQmVycnkvaSxcbiAgICAgICAgb3RoZXJfb3BlcmEgICAgICA9IC9PcGVyYSBNaW5pL2ksXG4gICAgICAgIG90aGVyX2ZpcmVmb3ggICAgPSAvKD89LipcXGJGaXJlZm94XFxiKSg/PS4qXFxiTW9iaWxlXFxiKS9pLCAvLyBNYXRjaCAnRmlyZWZveCcgQU5EICdNb2JpbGUnXG4gICAgICAgIHNldmVuX2luY2ggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJyg/OicgKyAgICAgICAgIC8vIE5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ05leHVzIDcnICsgICAgIC8vIE5leHVzIDdcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdCTlRWMjUwJyArICAgICAvLyBCJk4gTm9vayBUYWJsZXQgNyBpbmNoXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnS2luZGxlIEZpcmUnICsgLy8gS2luZGxlIEZpcmVcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdTaWxrJyArICAgICAgICAvLyBLaW5kbGUgRmlyZSwgU2lsayBBY2NlbGVyYXRlZFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0dULVAxMDAwJyArICAgIC8vIEdhbGF4eSBUYWIgNyBpbmNoXG5cbiAgICAgICAgICAgICcpJywgICAgICAgICAgICAvLyBFbmQgbm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnaScpOyAgICAgICAgICAgLy8gQ2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGluZ1xuXG4gICAgdmFyIG1hdGNoID0gZnVuY3Rpb24ocmVnZXgsIHVzZXJBZ2VudCkge1xuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh1c2VyQWdlbnQpO1xuICAgIH07XG5cbiAgICB2YXIgSXNNb2JpbGVDbGFzcyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCkge1xuICAgICAgICB2YXIgdWEgPSB1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgICAgICB0aGlzLmFwcGxlID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhcHBsZV9waG9uZSwgdWEpLFxuICAgICAgICAgICAgaXBvZDogICBtYXRjaChhcHBsZV9pcG9kLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhcHBsZV9waG9uZSwgdWEpIHx8IG1hdGNoKGFwcGxlX2lwb2QsIHVhKSB8fCBtYXRjaChhcHBsZV90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFuZHJvaWQgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogIW1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSAmJiBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgfHwgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2god2luZG93c190YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2god2luZG93c19waG9uZSwgdWEpIHx8IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vdGhlciA9IHtcbiAgICAgICAgICAgIGJsYWNrYmVycnk6IG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgIG1hdGNoKG90aGVyX29wZXJhLCB1YSksXG4gICAgICAgICAgICBmaXJlZm94OiAgICBtYXRjaChvdGhlcl9maXJlZm94LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6ICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSB8fCBtYXRjaChvdGhlcl9maXJlZm94LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXZlbl9pbmNoID0gbWF0Y2goc2V2ZW5faW5jaCwgdWEpO1xuICAgICAgICB0aGlzLmFueSA9IHRoaXMuYXBwbGUuZGV2aWNlIHx8IHRoaXMuYW5kcm9pZC5kZXZpY2UgfHwgdGhpcy53aW5kb3dzLmRldmljZSB8fCB0aGlzLm90aGVyLmRldmljZSB8fCB0aGlzLnNldmVuX2luY2g7XG4gICAgICAgIC8vIGV4Y2x1ZGVzICdvdGhlcicgZGV2aWNlcyBhbmQgaXBvZHMsIHRhcmdldGluZyB0b3VjaHNjcmVlbiBwaG9uZXNcbiAgICAgICAgdGhpcy5waG9uZSA9IHRoaXMuYXBwbGUucGhvbmUgfHwgdGhpcy5hbmRyb2lkLnBob25lIHx8IHRoaXMud2luZG93cy5waG9uZTtcbiAgICAgICAgLy8gZXhjbHVkZXMgNyBpbmNoIGRldmljZXMsIGNsYXNzaWZ5aW5nIGFzIHBob25lIG9yIHRhYmxldCBpcyBsZWZ0IHRvIHRoZSB1c2VyXG4gICAgICAgIHRoaXMudGFibGV0ID0gdGhpcy5hcHBsZS50YWJsZXQgfHwgdGhpcy5hbmRyb2lkLnRhYmxldCB8fCB0aGlzLndpbmRvd3MudGFibGV0O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBJTSA9IG5ldyBJc01vYmlsZUNsYXNzKCk7XG4gICAgICAgIElNLkNsYXNzID0gSXNNb2JpbGVDbGFzcztcbiAgICAgICAgcmV0dXJuIElNO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL25vZGVcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBJc01vYmlsZUNsYXNzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL2Jyb3dzZXJpZnlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vQU1EXG4gICAgICAgIGRlZmluZShpbnN0YW50aWF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCIvKlxyXG4gKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuICovXHJcblxyXG47KGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcclxuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICAoZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9KCdsb2cnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB7fTtcclxuICAgICAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBib3VuZFRvQ29uc29sZShjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYm91bmRUb0NvbnNvbGUoY29uc29sZSwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gY29uc29sZVttZXRob2ROYW1lXTtcclxuICAgICAgICAgICAgaWYgKG1ldGhvZC5iaW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwoY29uc29sZVttZXRob2ROYW1lXSwgY29uc29sZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbiBJRTggKyBNb2Rlcm5penIsIHRoZSBiaW5kIHNoaW0gd2lsbCByZWplY3QgdGhlIGFib3ZlLCBzbyB3ZSBmYWxsIGJhY2sgdG8gd3JhcHBpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uQmluZGluZ1dyYXBwZXIobWV0aG9kLCBjb25zb2xlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmdW5jdGlvbkJpbmRpbmdXcmFwcGVyKGYsIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KGYsIFtjb250ZXh0LCBhcmd1bWVudHNdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgICAgIFwiZGVidWdcIixcclxuICAgICAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobWV0aG9kRmFjdG9yeSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGlpKyspIHtcclxuICAgICAgICAgICAgICAgIHNlbGZbbG9nTWV0aG9kc1tpaV1dID0gbWV0aG9kRmFjdG9yeShsb2dNZXRob2RzW2lpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNvb2tpZXNBdmFpbGFibGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSAhPT0gdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gbnVsbCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYWxTdG9yYWdlRmFpbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGV2ZWxOYW1lO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYubGV2ZWxzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5sZXZlbHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBzZWxmLmxldmVsc1trZXldID09PSBsZXZlbE51bSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsTmFtZSA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU2V0dGluZyBsb2NhbFN0b3JhZ2UgY2FuIGNyZWF0ZSBhIERPTSAyMiBFeGNlcHRpb24gaWYgcnVubmluZyBpbiBQcml2YXRlIG1vZGVcclxuICAgICAgICAgICAgICAgICAqIGluIFNhZmFyaSwgc28gZXZlbiBpZiBpdCBpcyBhdmFpbGFibGUgd2UgbmVlZCB0byBjYXRjaCBhbnkgZXJyb3JzIHdoZW4gdHJ5aW5nXHJcbiAgICAgICAgICAgICAgICAgKiB0byB3cml0ZSB0byBpdFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ10gPSBsZXZlbE5hbWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlRmFpbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VGYWlsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUZhaWwgJiYgY29va2llc0F2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID0gXCJsb2dsZXZlbD1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY29va2llUmVnZXggPSAvbG9nbGV2ZWw9KFteO10rKS87XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQZXJzaXN0ZWRMZXZlbCgpIHtcclxuICAgICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkICYmIGNvb2tpZXNBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZU1hdGNoID0gY29va2llUmVnZXguZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gY29va2llTWF0Y2hbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFB1YmxpYyBBUElcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPT09IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMoZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxldmVsIDw9IHNlbGYubGV2ZWxzW21ldGhvZE5hbWUudG9VcHBlckNhc2UoKV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxyXG4gICAgICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcclxuICAgICAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IHNlbGYpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsb2FkUGVyc2lzdGVkTGV2ZWwoKTtcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH0pKTtcclxufSkoKTtcclxuIiwiLyohXHJcbiAqIHZlcmdlIDEuOS4xKzIwMTQwMjEzMDgwM1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcnlhbnZlL3ZlcmdlXHJcbiAqIE1JVCBMaWNlbnNlIDIwMTMgUnlhbiBWYW4gRXR0ZW5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ocm9vdCwgbmFtZSwgbWFrZSkge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSBtb2R1bGVbJ2V4cG9ydHMnXSA9IG1ha2UoKTtcclxuICBlbHNlIHJvb3RbbmFtZV0gPSBtYWtlKCk7XHJcbn0odGhpcywgJ3ZlcmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciB4cG9ydHMgPSB7fVxyXG4gICAgLCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvd1xyXG4gICAgLCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRcclxuICAgICwgZG9jRWxlbSA9IGRvYyAmJiBkb2MuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAsIG1hdGNoTWVkaWEgPSB3aW5bJ21hdGNoTWVkaWEnXSB8fCB3aW5bJ21zTWF0Y2hNZWRpYSddXHJcbiAgICAsIG1xID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKHEpIHtcclxuICAgICAgICByZXR1cm4gISFtYXRjaE1lZGlhLmNhbGwod2luLCBxKS5tYXRjaGVzO1xyXG4gICAgICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0VyA9IHhwb3J0c1sndmlld3BvcnRXJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudFdpZHRoJ10sIGIgPSB3aW5bJ2lubmVyV2lkdGgnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydEggPSB4cG9ydHNbJ3ZpZXdwb3J0SCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRIZWlnaHQnXSwgYiA9IHdpblsnaW5uZXJIZWlnaHQnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfTtcclxuICBcclxuICAvKiogXHJcbiAgICogVGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZS4gTGlrZSBNb2Rlcm5penIubXFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqLyAgXHJcbiAgeHBvcnRzWydtcSddID0gbXE7XHJcblxyXG4gIC8qKiBcclxuICAgKiBOb3JtYWxpemVkIG1hdGNoTWVkaWFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtNZWRpYVF1ZXJ5TGlzdHxPYmplY3R9XHJcbiAgICovIFxyXG4gIHhwb3J0c1snbWF0Y2hNZWRpYSddID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbWF0Y2hNZWRpYSBtdXN0IGJlIGJpbmRlZCB0byB3aW5kb3dcclxuICAgIHJldHVybiBtYXRjaE1lZGlhLmFwcGx5KHdpbiwgYXJndW1lbnRzKTtcclxuICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHcmFjZWZ1bGx5IGRlZ3JhZGUgdG8gcGxhaW4gb2JqZWN0XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHNpbmNlIDEuOC4wXHJcbiAgICogQHJldHVybiB7e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn19XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdmlld3BvcnQoKSB7XHJcbiAgICByZXR1cm4geyd3aWR0aCc6dmlld3BvcnRXKCksICdoZWlnaHQnOnZpZXdwb3J0SCgpfTtcclxuICB9XHJcbiAgeHBvcnRzWyd2aWV3cG9ydCddID0gdmlld3BvcnQ7XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFhcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxYJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0OyBcclxuICB9O1xyXG5cclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWVxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFknXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHt7dG9wOm51bWJlciwgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyLCBsZWZ0Om51bWJlcn19IGNvb3Jkc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiBhZGp1c3RtZW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZShjb29yZHMsIGN1c2hpb24pIHtcclxuICAgIHZhciBvID0ge307XHJcbiAgICBjdXNoaW9uID0gK2N1c2hpb24gfHwgMDtcclxuICAgIG9bJ3dpZHRoJ10gPSAob1sncmlnaHQnXSA9IGNvb3Jkc1sncmlnaHQnXSArIGN1c2hpb24pIC0gKG9bJ2xlZnQnXSA9IGNvb3Jkc1snbGVmdCddIC0gY3VzaGlvbik7XHJcbiAgICBvWydoZWlnaHQnXSA9IChvWydib3R0b20nXSA9IGNvb3Jkc1snYm90dG9tJ10gKyBjdXNoaW9uKSAtIChvWyd0b3AnXSA9IGNvb3Jkc1sndG9wJ10gLSBjdXNoaW9uKTtcclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3Jvc3MtYnJvd3NlciBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCBwbHVzIG9wdGlvbmFsIGN1c2hpb24uXHJcbiAgICogQ29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbCBlbGVtZW50IG9yIHN0YWNrICh1c2VzIGZpcnN0IGl0ZW0pXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uICsvLSBwaXhlbCBhZGp1c3RtZW50IGFtb3VudFxyXG4gICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlY3RhbmdsZShlbCwgY3VzaGlvbikge1xyXG4gICAgZWwgPSBlbCAmJiAhZWwubm9kZVR5cGUgPyBlbFswXSA6IGVsO1xyXG4gICAgaWYgKCFlbCB8fCAxICE9PSBlbC5ub2RlVHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGNhbGlicmF0ZShlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgY3VzaGlvbik7XHJcbiAgfVxyXG4gIHhwb3J0c1sncmVjdGFuZ2xlJ10gPSByZWN0YW5nbGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgdmlld3BvcnQgYXNwZWN0IHJhdGlvIChvciB0aGUgYXNwZWN0IHJhdGlvIG9mIGFuIG9iamVjdCBvciBlbGVtZW50KVxyXG4gICAqIEBzaW5jZSAxLjcuMFxyXG4gICAqIEBwYXJhbSB7KEVsZW1lbnR8T2JqZWN0KT19IG8gb3B0aW9uYWwgb2JqZWN0IHdpdGggd2lkdGgvaGVpZ2h0IHByb3BzIG9yIG1ldGhvZHNcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICogQGxpbmsgaHR0cDovL3czLm9yZy9UUi9jc3MzLW1lZGlhcXVlcmllcy8jb3JpZW50YXRpb25cclxuICAgKi9cclxuICBmdW5jdGlvbiBhc3BlY3Qobykge1xyXG4gICAgbyA9IG51bGwgPT0gbyA/IHZpZXdwb3J0KCkgOiAxID09PSBvLm5vZGVUeXBlID8gcmVjdGFuZ2xlKG8pIDogbztcclxuICAgIHZhciBoID0gb1snaGVpZ2h0J10sIHcgPSBvWyd3aWR0aCddO1xyXG4gICAgaCA9IHR5cGVvZiBoID09ICdmdW5jdGlvbicgPyBoLmNhbGwobykgOiBoO1xyXG4gICAgdyA9IHR5cGVvZiB3ID09ICdmdW5jdGlvbicgPyB3LmNhbGwobykgOiB3O1xyXG4gICAgcmV0dXJuIHcvaDtcclxuICB9XHJcbiAgeHBvcnRzWydhc3BlY3QnXSA9IGFzcGVjdDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHgtYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblgnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIucmlnaHQgPj0gMCAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHktYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblknXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblZpZXdwb3J0J10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgLy8gRXF1aXYgdG8gYGluWChlbCwgY3VzaGlvbikgJiYgaW5ZKGVsLCBjdXNoaW9uKWAgYnV0IGp1c3QgbWFudWFsbHkgZG8gYm90aCBcclxuICAgIC8vIHRvIGF2b2lkIGNhbGxpbmcgcmVjdGFuZ2xlKCkgdHdpY2UuIEl0IGd6aXBzIGp1c3QgYXMgc21hbGwgbGlrZSB0aGlzLlxyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIucmlnaHQgPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKSAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHhwb3J0cztcclxufSkpOyIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBQcm9taXNlIGFic3RyYWN0aW9uXG5cbiAgICAjIERPTSBtYW5pcHVsYXRpb25cblxuICAgICMgTG9nZ2VyXG4gICAgQmFzZS5sb2cgPSByZXF1aXJlICcuL2xvZ2dlci5jb2ZmZWUnXG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBCYXNlLmRldmljZSA9IHJlcXVpcmUgJy4vZGV2aWNlZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgQ29va2llcyBBUElcbiAgICBCYXNlLmNvb2tpZXMgPSByZXF1aXJlICcuL2Nvb2tpZXMuY29mZmVlJ1xuXG4gICAgIyBWaWV3cG9ydCBkZXRlY3Rpb25cbiAgICBCYXNlLnZwID0gcmVxdWlyZSAnLi92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIFV0aWxzXG4gICAgIyBMaWJyYXJpZXMgbGlrZSB1bmRlcnNjb3JlLCBiYWNrYm9uZSwgd2lsbCBiZSBsb2FkZWQgYnkgdGhlIHByb2plY3RcbiAgICAjIGFzIGhhcmQgZGVwZW5kZW5jaWVzIGZvciB0aGlzIGxheWVyXG4gICAgIyBUT0RPOiBNYWtlIHNvbWV0aGluZyB3aXRoIHRoaXMuIEFzIGl0IGlzLCBpcyB1c2VsZXNzXG4gICAgQmFzZS51dGlsID1cbiAgICAgICAgZWFjaDogJC5lYWNoLFxuICAgICAgICBleHRlbmQ6ICQuZXh0ZW5kLFxuICAgICAgICB1bmlxOiByb290Ll8udW5pcSxcbiAgICAgICAgXzogcm9vdC5fXG5cbiAgICByZXR1cm4gQmFzZVxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBDb29raWVzKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBjb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpXG5cbiAgICAjIEV4cG9zZSBDb29raWVzIEFQSVxuICAgIENvb2tpZXMgPVxuXG4gICAgICAgIHNldDogKGtleSwgdmFsdWUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLnNldCBrZXksIHZhbHVlLCBvcHRpb25zXG5cbiAgICAgICAgZ2V0OiAoa2V5KSAtPlxuICAgICAgICAgICAgY29va2llcy5nZXQga2V5XG5cbiAgICAgICAgZXhwaXJlOiAoa2V5LCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgY29va2llcy5leHBpcmUga2V5LCBvcHRpb25zXG5cbiAgICByZXR1cm4gQ29va2llc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5OR0wgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HTCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcbiAgICBFeHRNYW5hZ2VyID0gcmVxdWlyZSgnLi9leHRtYW5hZ2VyLmNvZmZlZScpXG5cbiAgICAjIHdlJ2xsIHVzZSB0aGUgTkdMIG9iamVjdCBhcyB0aGUgZ2xvYmFsIEV2ZW50IGJ1c1xuICAgIF8uZXh0ZW5kIE5HTCwgQmFja2JvbmUuRXZlbnRzXG5cbiAgICAjIE5hbWVzcGFjZSBmb3IgbW9kdWxlIGRlZmluaXRpb25cbiAgICBOR0wubW9kdWxlcyA9IHt9XG5cbiAgICBjbGFzcyBOR0wuQ29yZVxuICAgICAgICAjIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeVxuICAgICAgICB2ZXJzaW9uOiBcIjAuMC4xXCJcblxuICAgICAgICBjZmc6XG4gICAgICAgICAgICBkZWJ1ZzpcbiAgICAgICAgICAgICAgICBsb2dMZXZlbDogNSAjIGJ5IGRlZmF1bHQgdGhlIGxvZ2dpbmcgaXMgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdsb2RnZXMnICMgVE9ETzogY2hhbmdlIHRoaXMgdG8gJ3BsYXRmb3JtJ1xuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuXy5kZWZhdWx0cyBjb25maWcsIEBjZmdcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgdHJhY2sgdGhlIHN0YXRlIG9mIHRoZSBDb3JlLiBXaGVuIGl0IGlzXG4gICAgICAgICAgICAjIHRydWUsIGl0IG1lYW5zIHRoZSBcInN0YXJ0KClcIiBoYXMgYmVlbiBjYWxsZWRcbiAgICAgICAgICAgIEBzdGFydGVkID0gZmFsc2VcblxuICAgICAgICAgICAgIyBTZXQgdGhlIGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBhcHBcbiAgICAgICAgICAgIEJhc2UubG9nLnNldExldmVsKEBjb25maWcuZGVidWcubG9nTGV2ZWwpXG5cbiAgICAgICAgICAgICMgVGhlIGV4dGVuc2lvbiBtYW5hZ2VyIHdpbGwgYmUgb24gY2hhcmdlIG9mIGxvYWRpbmcgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgIyBhbmQgbWFrZSBpdHMgZnVuY3Rpb25hbGl0eSBhdmFpbGFibGUgdG8gdGhlIHN0YWNrXG4gICAgICAgICAgICBAZXh0TWFuYWdlciA9IG5ldyBFeHRNYW5hZ2VyKClcblxuICAgICAgICAgICAgIyB0aHJvdWdoIHRoaXMgb2JqZWN0IHRoZSBtb2R1bGVzIHdpbGwgYmUgYWNjZXNpbmcgdGhlIG1ldGhvZHMgZGVmaW5lZCBieSB0aGVcbiAgICAgICAgICAgICMgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQHNhbmRib3ggPSBfLmNsb25lIEJhc2VcblxuICAgICAgICAgICAgIyBuYW1lc3BhY2UgdG8gaG9sZCBhbGwgdGhlIHNhbmRib3hlc1xuICAgICAgICAgICAgQHNhbmRib3hlcyA9IHt9XG5cblxuICAgICAgICBhZGRFeHRlbnNpb246IChleHQpIC0+XG4gICAgICAgICAgICAjIHdlJ2xsIG9ubHkgYWxsb3cgdG8gYWRkIG5ldyBleHRlbnNpb25zIGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgQ29yZSBnZXQgc3RhcnRlZFxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKGV4dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4gWW91IGNvdWxkIG5vdCBhZGQgbmV3IGV4dGVuc2lvbnMgYXQgdGhpcyBwb2ludC5cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjb3VsZCBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICBzdGFydDogKG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJTdGFydCBkZSBDb3JlXCIpXG5cbiAgICAgICAgICAgIEBzdGFydGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgQmFja2JvbmVFeHQgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9iYWNrYm9uZS5leHQuY29mZmVlJylcblxuICAgICAgICAgICAgIyBBZGQgY29yZSBleHRlbnNpb25zIHRvIHRoZSBhcHBcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChDb21wb25lbnRzKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKEJhY2tib25lRXh0KVxuXG4gICAgICAgICAgICAjIEluaXQgYWxsIHRoZSBleHRlbnNpb25zXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5pbml0KEApXG5cbiAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAjIGZyb20gZWFjaCBleHRlbnNpb25cbiAgICAgICAgICAgICMgTm90ZTogVGhpcyBtZXRob2Qgd2lsbCBsZXQgZWFjaCBleHRlbnNpb24gdG8gYXV0b21hdGljYWxseSBleGVjdXRlIHNvbWUgY29kZVxuICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAZXh0TWFuYWdlci5nZXRJbml0aWFsaXplZEV4dGVuc2lvbnMoKSwgKGksIGV4dCkgPT5cbiAgICAgICAgICAgICAgICAjIFNpbmNlIHRoaXMgbWV0aG9kIGlzIG5vdCByZXF1aXJlZCBsZXRzIGNoZWNrIGlmIGl0J3MgZGVmaW5lZFxuICAgICAgICAgICAgICAgIGlmIGV4dCAmJiB0eXBlb2YgZXh0LmFmdGVyQXBwU3RhcnRlZCA9PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQoQClcblxuICAgICAgICBjcmVhdGVTYW5kYm94OiAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ZXNbbmFtZV0gPSBfLmV4dGVuZCB7fSwgQHNhbmRib3gsIG5hbWUgOiBuYW1lXG5cblxuICAgIHJldHVybiBOR0xcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRGV2aWNlRGV0ZWN0aW9uKSAtPlxuXG4gICAgIyBEZXZpY2UgZGV0ZWN0aW9uXG4gICAgaXNNb2JpbGUgPSByZXF1aXJlKCdpc21vYmlsZWpzJylcblxuICAgICMgRXhwb3NlIGRldmljZSBkZXRlY3Rpb24gQVBJXG4gICAgRGV2aWNlRGV0ZWN0aW9uID1cblxuICAgICAgICAjIEdyb3Vwc1xuICAgICAgICBpc01vYmlsZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLnBob25lXG5cbiAgICAgICAgaXNUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS50YWJsZXRcblxuICAgICAgICAjIEFwcGxlIGRldmljZXNcbiAgICAgICAgaXNJcGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5waG9uZVxuXG4gICAgICAgIGlzSXBvZDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLmlwb2RcblxuICAgICAgICBpc0lwYWQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS50YWJsZXRcblxuICAgICAgICBpc0FwcGxlIDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLmRldmljZVxuXG4gICAgICAgICMgQW5kcm9pZCBkZXZpY2VzXG4gICAgICAgIGlzQW5kcm9pZFBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC5waG9uZVxuXG4gICAgICAgIGlzQW5kcm9pZFRhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQudGFibGV0XG5cbiAgICAgICAgaXNBbmRyb2lkRGV2aWNlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC5kZXZpY2VcblxuICAgICAgICAjIFdpbmRvd3MgZGV2aWNlc1xuICAgICAgICBpc1dpbmRvd3NQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MucGhvbmVcblxuICAgICAgICBpc1dpbmRvd3NUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnRhYmxldFxuXG4gICAgICAgIGlzV2luZG93c0RldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MuZGV2aWNlXG5cbiAgICByZXR1cm4gRGV2aWNlRGV0ZWN0aW9uXG4pIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gc2hvdWxkIHByb2JhYmx5IGJlIGRlZmluZWQgYXQgYSBwcm9qZWN0IGxldmVsLCBub3QgaGVyZVxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgUmVuZGVyZXIgPVxuXG4gICAgICAgIHJlbmRlcjogKHRlbXBsYXRlLCBkYXRhKSAtPlxuXG4gICAgICAgICAgICB1bmxlc3MgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBcIlRoZSB0ZW1wbGF0ZSBwYXNzZWQgdG8gdGhlIFJlbmRlcmVyIGlzIG5vdCBkZWZpbmVkXCJcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlIGRhdGFcblxuXG5cbiAgICAjIERlZmF1bHQgYmFzZSBvYmplY3QgdGhhdCBpcyBnb25uYSBiZSB1c2VkIGFzIHRoZSBkZWZhdWx0IG9iamVjdCB0byBiZSBtaXhlZFxuICAgICMgaW50byBvdGhlciB2aWV3c1xuICAgIEJhc2VWaWV3ID1cblxuICAgICAgICBpbml0aWFsaXplOiAoKSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcImluaXRpYWxpemUgZGVsIEJhc2VWaWV3XCJcblxuICAgICAgICAgICAgXy5iaW5kQWxsIEAsICdyZW5kZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICdyZW5kZXJXcmFwcGVyJ1xuXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuXy5pc0Z1bmN0aW9uIEBiZWZvcmVSZW5kZXJcbiAgICAgICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ2JlZm9yZVJlbmRlcidcblxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYWZ0ZXJSZW5kZXJcbiAgICAgICAgICAgICAgICBfLmJpbmRBbGwgQCwgJ2FmdGVyUmVuZGVyJ1xuXG4gICAgICAgICAgICBAcmVuZGVyID0gQmFzZS51dGlsLl8ud3JhcCBAcmVuZGVyLCBAcmVuZGVyV3JhcHBlclxuXG4gICAgICAgICMgTWV0aG9kIHRvIGVuc3VyZSB0aGF0IHRoZSBkYXRhIGlzIGFsd2F5cyBwYXNzZWQgdG8gdGhlIHRlbXBsYXRlIGluIHRoZSBzYW1lIHdheVxuICAgICAgICBzZXJpYWxpemVEYXRhIDogKCkgLT5cblxuICAgICAgICAgICAgZGF0YSA9IHt9XG5cbiAgICAgICAgICAgIGlmIEBtb2RlbFxuICAgICAgICAgICAgICAgIGRhdGEgPSBAbW9kZWwudG9KU09OKClcbiAgICAgICAgICAgIGVsc2UgaWYgQGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAjIHRoaXMgd2F5IHdlIG5vcm1hbGl6ZSB0aGUgcHJvcGVydHkgd2UnbGwgdXNlIHRvIGl0ZXJhdGVcbiAgICAgICAgICAgICAgICAjIHRoZSBjb2xsZWN0aW9uIGluc2lkZSB0aGUgaGJzXG4gICAgICAgICAgICAgICAgZGF0YSA9IGl0ZW1zIDogQGNvbGxlY3Rpb24udG9KU09OKClcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgYmUgaGVscGZ1bGwgaW4gdmlld3Mgd2hpY2ggcmVuZGVycyBjb2xsZWN0aW9uc1xuICAgICAgICAgICAgIyBhbmQgbmVlZHMgdG8gZGlzcGxheSBhIGN1c3RvbWl6YWJsZSB0aXRsZSBvbiB0b3BcbiAgICAgICAgICAgIGlmIEB0aXRsZVxuICAgICAgICAgICAgICAgIGRhdGEudGl0bGUgPSBAdGl0bGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGRhdGFcblxuICAgICAgICAjIEVuc3VyZXMgdGhhdCBldmVudHMgYXJlIHJlbW92ZWQgYmVmb3JlIHRoZSBWaWV3IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICAgIGRlc3Ryb3kgOiAoKSAtPlxuXG4gICAgICAgICAgICAjIHVuYmluZCBldmVudHNcbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlRGF0YSgpLnVuYmluZCgpIGlmIEAkZWxcblxuICAgICAgICAgICAgI1JlbW92ZSB2aWV3IGZyb20gRE9NXG4gICAgICAgICAgICBAcmVtb3ZlKClcbiAgICAgICAgICAgIEJhY2tib25lLlZpZXc6OnJlbW92ZS5jYWxsKHRoaXMpXG5cbiAgICAgICAgIyBXcmFwcGVyIHRvIGFkZCBcImJlZm9yZVJlbmRlclwiIGFuZCBcImFmdGVyUmVuZGVyXCIgbWV0aG9kcy5cbiAgICAgICAgcmVuZGVyV3JhcHBlcjogKG9yaWdpbmFsUmVuZGVyKSAtPlxuICAgICAgICAgICAgQGJlZm9yZVJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gQGJlZm9yZVJlbmRlclxuXG4gICAgICAgICAgICBvcmlnaW5hbFJlbmRlcigpIGlmIEJhc2UudXRpbC5fLmlzRnVuY3Rpb24gb3JpZ2luYWxSZW5kZXJcblxuICAgICAgICAgICAgQGFmdGVyUmVuZGVyKCkgaWYgQmFzZS51dGlsLl8uaXNGdW5jdGlvbiBAYWZ0ZXJSZW5kZXJcblxuICAgICAgICAgICAgQFxuXG4gICAgICAgIHJlbmRlcjogKCkgLT5cblxuICAgICAgICAgICAgIyBhcyBhIHJ1bGUsIGlmIHRoZSB0ZW1wbGF0ZSBpcyBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICMgdGhpcyBvcHRpb24gd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdCB0ZW1wbGF0ZSBvZiB0aGUgdmlld1xuICAgICAgICAgICAgaWYgQG1vZGVsIGFuZCBAbW9kZWwuZ2V0KCd0ZW1wbGF0ZScpXG4gICAgICAgICAgICAgICAgdHBsID0gSlNUW0Btb2RlbC5nZXQoJ3RlbXBsYXRlJyldXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdHBsID0gQHRlbXBsYXRlXG5cbiAgICAgICAgICAgIGRhdGEgPSBAc2VyaWFsaXplRGF0YSgpXG5cbiAgICAgICAgICAgIGh0bWwgPSBSZW5kZXJlci5yZW5kZXIodHBsLCBkYXRhKVxuXG4gICAgICAgICAgICBAYXR0YWNoRWxDb250ZW50IGh0bWxcblxuICAgICAgICAgICAgQFxuXG4gICAgICAgIGF0dGFjaEVsQ29udGVudDogKGh0bWwpIC0+XG5cbiAgICAgICAgICAgIEAkZWwuYXBwZW5kKGh0bWwpXG4gIFxuICAgICAgICAgICAgQFxuXG5cblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBCYWNrYm9uZVwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gubXZjID0gKCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBNVkNcIlxuXG4gICAgICAgICMgdGhpcyBnaXZlcyBhY2Nlc3MgdG8gQmFzZVZpZXcgZnJvbSB0aGUgb3V0c2lkZVxuICAgICAgICBhcHAuc2FuZGJveC5tdmMuQmFzZVZpZXcgPSBCYXNlVmlld1xuXG4gICAgICAgICMjIypcbiAgICAgICAgICogVGhpcyBtZXRob2QgYWxsb3dzIHRvIG1peCBhIGJhY2tib25lIHZpZXcgd2l0aCBhbiBvYmplY3RcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHZpZXdcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBtaXhpbiA9IEJhc2VWaWV3XG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIGFwcC5zYW5kYm94Lm12Yy5taXhpbiA9ICh2aWV3LCBtaXhpbiA9IEJhc2VWaWV3KSAtPlxuXG4gICAgICAgICAgICBpZiBtaXhpbi5pbml0aWFsaXplIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICBvbGRJbml0aWFsaXplID0gdmlldzo6aW5pdGlhbGl6ZVxuXG4gICAgICAgICAgICBfLmV4dGVuZCB2aWV3OjosIG1peGluXG4gICAgICAgICAgICBfLmRlZmF1bHRzIHZpZXc6OmV2ZW50cywgbWl4aW4uZXZlbnRzXG5cbiAgICAgICAgICAgIGlmIG9sZEluaXRpYWxpemVcbiAgICAgICAgICAgICAgICB2aWV3Ojppbml0aWFsaXplID0gLT5cbiAgICAgICAgICAgICAgICAgICAgbWl4aW4uaW5pdGlhbGl6ZS5hcHBseSB0aGlzXG4gICAgICAgICAgICAgICAgICAgIG9sZEluaXRpYWxpemUuYXBwbHkgdGhpc1xuXG4gICAgbmFtZTogJ0JhY2tib25lIEV4dGVuc2lvbidcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBbc3RhcnRBbGwgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciA9ICdib2R5Jy4gQ1NTIHNlbGVjdG9yIHRvIHRlbGwgdGhlIGFwcCB3aGVyZSB0byBsb29rIGZvciBjb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdGFydEFsbDogKHNlbGVjdG9yID0gJ2JvZHknLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2VMaXN0KHNlbGVjdG9yLCBhcHAuY29uZmlnLm5hbWVzcGFjZSlcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIlBhcnNlZCBjb21wb25lbnRzXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIGNvbXBvbmVudHNcblxuICAgICAgICAgICAgIyBUT0RPOiBQcm94aW1vIHBhc28gaW5pY2lhbGl6YXIgbGFzIGNvbXBvbmVudGVzXG4gICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG4gICAgICAgIEBwYXJzZUxpc3Q6IChzZWxlY3RvciwgbmFtZXNwYWNlKSAtPlxuICAgICAgICAgICAgIyBhcnJheSB0byBob2xkIHBhcnNlZCBjb21wb25lbnRzXG4gICAgICAgICAgICBsaXN0ID0gW11cblxuICAgICAgICAgICAgbmFtZXNwYWNlcyA9IFsncGxhdGZvcm0nXVxuXG4gICAgICAgICAgICAjIFRPRE86IEFkZCB0aGUgYWJpbGl0eSB0byBwYXNzIGFuIGFycmF5L29iamVjdCBvZiBuYW1lc3BhY2VzIGluc3RlYWQgb2YganVzdCBvbmVcbiAgICAgICAgICAgIG5hbWVzcGFjZXMucHVzaCBuYW1lc3BhY2UgaWYgbmFtZXNwYWNlIGlzbnQgJ3BsYXRmb3JtJ1xuXG4gICAgICAgICAgICBjc3NTZWxlY3RvcnMgPSBbXVxuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIHV0aWxzIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgXy5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgIG5zID0gZG8gKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICBfLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUaGlzIHdheSB3ZSBvYnRhaW4gdGhlIG5hbWVzcGFjZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICQoY29tcCkuZGF0YShucyArIFwiLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IG5zXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAgICAgIyBvcHRpb25zIHdpbGwgaG9sZCBhbGwgdGhlIGRhdGEtKiByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gQ29tcG9uZW50LnBhcnNlQ29tcG9uZW50T3B0aW9ucyhALCBucylcblxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7IG5hbWU6IG9wdGlvbnMubmFtZSwgb3B0aW9uczogb3B0aW9ucyB9KVxuXG4gICAgICAgICAgICByZXR1cm4gbGlzdFxuXG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcbiAgICAgICAgICAgIGxlbmd0aCA9IDBcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyB1dGlscyBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQuZWFjaCBkYXRhLCAoaywgdikgLT5cblxuICAgICAgICAgICAgICAgICMgcmVtb3ZlcyB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgayA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgbmFtZXNwYWNlKSwgXCJcIilcblxuICAgICAgICAgICAgICAgICMgZGVjYW1lbGl6ZSB0aGUgb3B0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBrID0gay5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGsuc2xpY2UoMSlcblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGtleSBpcyBkaWZmZXJlbnQgZnJvbSBcImNvbXBvbmVudFwiIGl0IG1lYW5zIGl0IGlzXG4gICAgICAgICAgICAgICAgIyBhbiBvcHRpb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiBrICE9IFwiY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IHZcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoKytcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB2XG5cbiAgICAgICAgICAgICMgYWRkIG9uZSBiZWNhdXNlIHdlJ3ZlIGFkZGVkICdlbCcgYXV0b21hdGljYWxseSBhcyBhbiBleHRyYSBvcHRpb25cbiAgICAgICAgICAgIG9wdGlvbnMubGVuZ3RoID0gbGVuZ3RoICsgMVxuXG4gICAgICAgICAgICAjIGJ1aWxkIGFkIHJldHVybiB0aGUgb3B0aW9uIG9iamVjdFxuICAgICAgICAgICAgQ29tcG9uZW50LmJ1aWxkT3B0aW9uc09iamVjdChuYW1lLCBvcHRpb25zKVxuXG4gICAgICAgIFxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgdXRpbHMgZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBfLmVhY2goY29tcG9uZW50cywgKG0sIGkpIC0+XG4gICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgbW9kdWxlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgbW9kdWxlcyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIFRPRE86IFByb3ZpZGUgYW4gYWx0ZXJuYXRlIHdheSB0byBkZWZpbmUgd2hpY2ggaXMgZ29ubmEgYmVcbiAgICAgICAgICAgICAgICAjIHRoaXMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IF8uaXNFbXB0eShOR0wubW9kdWxlcykgYW5kIE5HTC5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBOR0wubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQgbW9kLCBzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9uc1xuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZC5pbml0aWFsaXplKClcbiAgICAgICAgICAgIClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJJbmljaWFsaXphZGEgbGEgY29tcG9uZW50ZSBkZSBDb21wb25lbnRlc1wiXG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzID0gKGxpc3QsIGFwcCkgLT5cblxuICAgICAgICAgICAgQ29tcG9uZW50LnN0YXJ0QWxsKGxpc3QsIGFwcClcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJMbGFtYW5kbyBhbCBhZnRlckFwcFN0YXJ0ZWRcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyhudWxsLCBhcHApXG5cbiAgICBuYW1lOiAnQ29tcG9uZW50IEV4dGVuc2lvbidcblxuICAgICMgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAgICAjIHRvIHZhbGlkYXRlIHRoZSBDb21wb25lbnQgY2xhc3MgaW4gaXNvbGF0aW9uXG4gICAgY2xhc3NlcyA6IENvbXBvbmVudFxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR0wpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBFeHRNYW5hZ2VyXG5cbiAgICAgICAgX2V4dGVuc2lvbnM6IFtdXG5cbiAgICAgICAgX2luaXRpYWxpemVkRXh0ZW5zaW9uczogW11cblxuICAgICAgICBjb25zdHJ1Y3RvcjogKCkgLT5cblxuICAgICAgICBhZGQ6IChleHQpIC0+XG5cbiAgICAgICAgICAgICMgY2hlY2tzIGlmIHRoZSBuYW1lIGZvciB0aGUgZXh0ZW5zaW9uIGhhdmUgYmVlbiBkZWZpbmVkLlxuICAgICAgICAgICAgIyBpZiBub3QgbG9nIGEgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICB1bmxlc3MgZXh0Lm5hbWVcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBleHRlbnNpb24gZG9lc24ndCBoYXZlIGEgbmFtZSBhc3NvY2lhdGVkLiBJdCB3aWxsIGJlIGhlcGZ1bGwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiaWYgeW91IGhhdmUgYXNzaW5nIGFsbCBvZiB5b3VyIGV4dGVuc2lvbnMgYSBuYW1lIGZvciBiZXR0ZXIgZGVidWdnaW5nXCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgICAgICAjIExldHMgdGhyb3cgYW4gZXJyb3IgaWYgd2UgdHJ5IHRvIGluaXRpYWxpemUgdGhlIHNhbWUgZXh0ZW5zaW9uIHR3aWNlc1xuICAgICAgICAgICAgaWYgXy5pbmNsdWRlKHRoaXMuX2V4dGVuc2lvbnMsIGV4dCkgdGhlbiB0aHJvdyBuZXcgRXJyb3IoXCJFeHRlbnNpb246IFwiICsgZXh0Lm5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIilcblxuICAgICAgICAgICAgQF9leHRlbnNpb25zLnB1c2goZXh0KVxuXG4gICAgICAgIGluaXQgOiAoY29udGV4dCkgLT5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gQF9leHRlbnNpb25zXG5cbiAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihAX2V4dGVuc2lvbnMsIGNvbnRleHQpXG4gICAgXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KVxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbml0aWFsaXplZCBleHRlbnNpb25zIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuXG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBMb2dnZXIpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGxvZ2xldmVsID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBFeHBvc2UgdGhlIExvZ2dlciBBUElcbiAgICBMb2dnZXIgPVxuXG4gICAgICAgIHNldExldmVsOiAobGV2ZWwpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5zZXRMZXZlbChsZXZlbClcblxuICAgICAgICB0cmFjZTogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnRyYWNlKG1zZylcblxuICAgICAgICBkZWJ1ZzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmRlYnVnKG1zZylcblxuICAgICAgICBpbmZvOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuaW5mbyhtc2cpXG5cbiAgICAgICAgd2FybjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLndhcm4obXNnKVxuXG4gICAgICAgIGVycm9yOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZXJyb3IobXNnKVxuXG4gICAgcmV0dXJuIExvZ2dlclxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWaWV3cG9ydCkgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCd2ZXJnZScpXG5cbiAgICAjIEV4cG9zZSBWaWV3cG9ydCBkZXRlY3Rpb24gQVBJXG4gICAgVmlld3BvcnQgPVxuXG4gICAgICAgIHZpZXdwb3J0VzogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0VygpXG5cbiAgICAgICAgdmlld3BvcnRIOiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRIKClcblxuICAgICAgICB2aWV3cG9ydDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0KClcblxuICAgICAgICBpblZpZXdwb3J0OiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblZpZXdwb3J0KGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5YKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5ZKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIHNjcm9sbFg6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxYKClcblxuICAgICAgICBzY3JvbGxZOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWSgpXG5cbiAgICAgICAgIyBUbyB0ZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlXG4gICAgICAgIG1xOiAobWVkaWFRdWVyeVN0cmluZykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0Lm1xKG1lZGlhUXVlcnlTdHJpbmcpXG5cbiAgICAgICAgcmVjdGFuZ2xlOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5yZWN0YW5nbGUoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgIyBpZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIHRoZW4gaXQgcmV0dXJucyB0aGUgYXNwZWN0XG4gICAgICAgICMgcmF0aW8gb2YgdGhlIHZpZXdwb3J0LiBJZiBhbiBlbGVtZW50IGlzIHBhc3NlZCBpdCByZXR1cm5zXG4gICAgICAgICMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZWxlbWVudFxuICAgICAgICBhc3BlY3Q6IChvKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuYXNwZWN0KG8pXG5cbiAgICByZXR1cm4gVmlld3BvcnRcbikiXX0=
