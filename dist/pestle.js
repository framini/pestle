!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.pestle=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/core.coffee":[function(_dereq_,module,exports){

/**
 * The core layer will depend on the base layer and will provide
 * the core set of functionality to application framework
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = root.Pestle = factory(root, {});
})(window, function(root, Pestle) {
  var Base, ExtManager;
  Base = _dereq_('./base.coffee');
  ExtManager = _dereq_('./util/extmanager.coffee');
  Pestle = new Base.Events();
  Pestle.Module = _dereq_('./util/module.coffee');
  Pestle.modules = {};
  Pestle.Core = (function() {
    Core.prototype.version = "0.0.1";

    Core.prototype.cfg = {
      debug: {
        logLevel: 5
      },
      namespace: 'platform',
      extension: {}
    };

    function Core(config) {
      var Components, ResponsiveDesign, ResponsiveImages;
      if (config == null) {
        config = {};
      }
      this.setConfig(config);
      this.started = false;
      this.extManager = new ExtManager();
      this.sandbox = Base.util.clone(Base);
      this.sandboxes = {};
      Components = _dereq_('./extension/components.coffee');
      ResponsiveDesign = _dereq_('./extension/responsivedesign.coffee');
      ResponsiveImages = _dereq_('./extension/responsiveimages.coffee');
      this.extManager.add(Components);
      this.extManager.add(ResponsiveDesign);
      this.extManager.add(ResponsiveImages);
    }

    Core.prototype.addExtension = function(ext) {
      if (!this.started) {
        return this.extManager.add(ext);
      } else {
        Base.log.error("The Core has already been started. You can not add new extensions at this point.");
        throw new Error('You can not add extensions when the Core has already been started.');
      }
    };

    Core.prototype.setConfig = function(config) {
      var msg;
      if (!this.started) {
        if (Base.util.isObject(config)) {
          if (!Base.util.isEmpty(this.config)) {
            return this.config = Base.util.defaults(config, this.config);
          } else {
            return this.config = Base.util.defaults(config, this.cfg);
          }
        } else {
          msg = "[setConfig method] only accept an object as a parameter and you're passing: " + typeof config;
          Base.log.error(msg);
          throw new Error(msg);
        }
      } else {
        Base.log.error("The Core has already been started. You can not add new extensions at this point.");
        throw new Error('You can not add extensions when the Core has already been started.');
      }
    };

    Core.prototype.start = function(selector) {
      var cb;
      if (selector == null) {
        selector = '';
      }
      Base.log.setLevel(this.config.debug.logLevel);
      if (this.started && selector !== '') {
        Base.log.info("Pestle is initializing a component");
        return this.sandbox.startComponents(selector, this);
      } else {
        Base.log.info("Pestle started the initializing process");
        this.started = true;
        this.extManager.init(this);
        cb = $.Callbacks("unique memory");
        Base.util.each(this.extManager.getInitializedExtensions(), (function(_this) {
          return function(ext, i) {
            if (ext) {
              if (Base.util.isFunction(ext.afterAppStarted) && ext.activated) {
                if (ext.optionKey === "components") {
                  ext.afterAppStarted(selector, _this);
                } else {
                  ext.afterAppStarted(_this);
                }
              }
              if (Base.util.isFunction(ext.afterAppInitialized) && ext.activated) {
                return cb.add(ext.afterAppInitialized);
              }
            }
          };
        })(this));
        return cb.fire(this);
      }
    };

    Core.prototype.createSandbox = function(name, opts) {
      return this.sandboxes[name] = Base.util.extend({}, this.sandbox, {
        name: name
      });
    };

    Core.prototype.getInitializedComponents = function() {
      return this.sandbox.getInitializedComponents();
    };

    return Core;

  })();
  return Pestle;
});



},{"./base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee","./extension/components.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/components.coffee","./extension/responsivedesign.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsivedesign.coffee","./extension/responsiveimages.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsiveimages.coffee","./util/extmanager.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/extmanager.coffee","./util/module.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/module.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/cookies-js/src/cookies.js":[function(_dereq_,module,exports){
/*
 * Cookies.js - 1.1.0
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }

            return Cookies._cache[Cookies._cacheKeyPrefix + key];
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

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
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
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/imager.js/Imager.js":[function(_dereq_,module,exports){
;
(function(window, document) {

    'use strict';

    var defaultWidths, getKeys, nextTick, addEvent, getNaturalWidth;

    nextTick = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
    };

    function applyEach(collection, callbackEach) {
        var i = 0,
            length = collection.length,
            new_collection = [];

        for (; i < length; i++) {
            new_collection[i] = callbackEach(collection[i], i);
        }

        return new_collection;
    }

    function returnDirectValue(value) {
        return value;
    }

    getNaturalWidth = (function() {
        if (Object.prototype.hasOwnProperty.call(document.createElement('img'), 'naturalWidth')) {
            return function(image) {
                return image.naturalWidth;
            };
        }
        // IE8 and below lacks the naturalWidth property
        return function(source) {
            var img = document.createElement('img');
            img.src = source.src;
            return img.width;
        };
    })();

    addEvent = (function() {
        if (document.addEventListener) {
            return function addStandardEventListener(el, eventName, fn) {
                return el.addEventListener(eventName, fn, false);
            };
        } else {
            return function addIEEventListener(el, eventName, fn) {
                return el.attachEvent('on' + eventName, fn);
            };
        }
    })();

    defaultWidths = [96, 130, 165, 200, 235, 270, 304, 340, 375, 410, 445, 485, 520, 555, 590, 625, 660, 695, 736];

    getKeys = typeof Object.keys === 'function' ? Object.keys : function(object) {
        var keys = [],
            key;

        for (key in object) {
            keys.push(key);
        }

        return keys;
    };


    /*
        Construct a new Imager instance, passing an optional configuration object.

        Example usage:

            {
                // Available widths for your images
                availableWidths: [Number],

                // Selector to be used to locate your div placeholders
                selector: '',

                // Class name to give your resizable images
                className: '',

                // If set to true, Imager will update the src attribute of the relevant images
                onResize: Boolean,

                // Toggle the lazy load functionality on or off
                lazyload: Boolean,

                // Used alongside the lazyload feature (helps performance by setting a higher delay)
                scrollDelay: Number
            }

        @param {object} configuration settings
        @return {object} instance of Imager
     */
    function Imager(elements, opts) {
        var self = this,
            doc = document;

        opts = opts || {};

        if (elements !== undefined) {
            // first argument is selector string
            if (typeof elements === 'string') {
                opts.selector = elements;
                elements = undefined;
            }

            // first argument is the `opts` object, `elements` is implicitly the `opts.selector` string
            else if (typeof elements.length === 'undefined') {
                opts = elements;
                elements = undefined;
            }
        }

        this.imagesOffScreen = [];
        this.viewportHeight = doc.documentElement.clientHeight;
        this.selector = opts.selector || '.delayed-image-load';
        this.className = opts.className || 'image-replace';
        this.gif = doc.createElement('img');
        this.gif.src = 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7';
        this.gif.className = this.className;
        this.gif.alt = '';
        this.scrollDelay = opts.scrollDelay || 250;
        this.onResize = opts.hasOwnProperty('onResize') ? opts.onResize : true;
        this.lazyload = opts.hasOwnProperty('lazyload') ? opts.lazyload : false;
        this.scrolled = false;
        this.availablePixelRatios = opts.availablePixelRatios || [1, 2];
        this.availableWidths = opts.availableWidths || defaultWidths;
        this.onImagesReplaced = opts.onImagesReplaced || function() {};
        this.widthsMap = {};
        this.refreshPixelRatio();
        this.widthInterpolator = opts.widthInterpolator || returnDirectValue;
        this.deltaSquare = opts.deltaSquare || 1.5;
        this.squareSelector = opts.squareSelector || 'sqrcrop';
        this.adaptSelector = this.adaptSelector || 'adapt';

        // Needed as IE8 adds a default `width`/`height` attribute…
        this.gif.removeAttribute('height');
        this.gif.removeAttribute('width');

        if (typeof this.availableWidths !== 'function') {
            if (typeof this.availableWidths.length === 'number') {
                this.widthsMap = Imager.createWidthsMap(this.availableWidths, this.widthInterpolator);
            } else {
                this.widthsMap = this.availableWidths;
                this.availableWidths = getKeys(this.availableWidths);
            }

            this.availableWidths = this.availableWidths.sort(function(a, b) {
                return a - b;
            });
        }



        if (elements) {
            this.divs = applyEach(elements, returnDirectValue);
            this.selector = null;
        } else {
            this.divs = applyEach(doc.querySelectorAll(this.selector), returnDirectValue);
        }

        this.changeDivsToEmptyImages();

        nextTick(function() {
            self.init();
        });
    }

    Imager.prototype.scrollCheck = function() {
        if (this.scrolled) {
            if (!this.imagesOffScreen.length) {
                window.clearInterval(this.interval);
            }

            this.divs = this.imagesOffScreen.slice(0); // copy by value, don't copy by reference
            this.imagesOffScreen.length = 0;
            this.changeDivsToEmptyImages();
            this.scrolled = false;
        }
    };

    Imager.prototype.init = function() {
        this.initialized = true;
        this.checkImagesNeedReplacing(this.divs);

        if (this.onResize) {
            this.registerResizeEvent();
        }

        if (this.lazyload) {
            this.registerScrollEvent();
        }
    };

    Imager.prototype.createGif = function(element) {
        // if the element is already a responsive image then we don't replace it again
        if (element.className.match(new RegExp('(^| )' + this.className + '( |$)'))) {
            return element;
        }

        var elementClassName = element.getAttribute('data-class');
        var elementWidth = element.getAttribute('data-width');
        var gif = this.gif.cloneNode(false);

        if (elementWidth) {
            gif.width = elementWidth;
            gif.setAttribute('data-width', elementWidth);
        }

        gif.className = (elementClassName ? elementClassName + ' ' : '') + this.className;
        gif.setAttribute('data-src', element.getAttribute('data-src'));
        gif.setAttribute('alt', element.getAttribute('data-alt') || this.gif.alt);

        element.parentNode.replaceChild(gif, element);

        return gif;
    };

    Imager.prototype.changeDivsToEmptyImages = function() {
        var self = this;

        applyEach(this.divs, function(element, i) {
            if (self.lazyload) {
                if (self.isThisElementOnScreen(element)) {
                    self.divs[i] = self.createGif(element);
                } else {
                    self.imagesOffScreen.push(element);
                }
            } else {
                self.divs[i] = self.createGif(element);
            }
        });

        if (this.initialized) {
            this.checkImagesNeedReplacing(this.divs);
        }
    };

    Imager.prototype.isThisElementOnScreen = function(element) {
        // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
        // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
        var offset = Imager.getPageOffset();
        var elementOffsetTop = 0;

        if (element.offsetParent) {
            do {
                elementOffsetTop += element.offsetTop;
            }
            while (element = element.offsetParent);
        }

        return (elementOffsetTop < (this.viewportHeight + offset)) ? true : false;
    };

    Imager.prototype.checkImagesNeedReplacing = function(images) {
        var self = this;

        if (!this.isResizing) {
            this.isResizing = true;
            this.refreshPixelRatio();

            applyEach(images, function(image) {
                self.replaceImagesBasedOnScreenDimensions(image);
            });

            this.isResizing = false;
            this.onImagesReplaced(images);
        }
    };

    Imager.prototype.replaceImagesBasedOnScreenDimensions = function(image) {
        var computedWidth, src, naturalWidth;

        naturalWidth = getNaturalWidth(image);
        computedWidth = typeof this.availableWidths === 'function' ? this.availableWidths(image) : this.determineAppropriateResolution(image);

        image.width = computedWidth;

        if (image.src !== this.gif.src && computedWidth <= naturalWidth) {
            return;
        }

        src = this.changeImageSrcToUseNewImageDimensions(this.buildUrlStructure(image.getAttribute('data-src'), image), computedWidth);

        image.src = src;
    };

    Imager.prototype.determineAppropriateResolution = function(image) {
        return Imager.getClosestValue(image.getAttribute('data-width') || image.parentNode.clientWidth, this.availableWidths);
    };

    /**
     * Updates the device pixel ratio value used by Imager
     *
     * It is performed before each replacement loop, in case a user zoomed in/out
     * and thus updated the `window.devicePixelRatio` value.
     *
     * @api
     * @since 1.0.1
     */
    Imager.prototype.refreshPixelRatio = function refreshPixelRatio() {
        this.devicePixelRatio = Imager.getClosestValue(Imager.getPixelRatio(), this.availablePixelRatios);
    };

    Imager.prototype.changeImageSrcToUseNewImageDimensions = function(src, selectedWidth) {
        return src
            .replace(/{width}/g, Imager.transforms.width(selectedWidth, this.widthsMap))
            .replace(/{pixel_ratio}/g, Imager.transforms.pixelRatio(this.devicePixelRatio));
    };

    Imager.prototype.buildUrlStructure = function(src, image) {
        var squareSelector = this.isImageContainerSquare(image) ? '.' + this.squareSelector : '';

        return src
            .replace(/\.(jpg|gif|bmp|png)[^s]?({width})?[^s]({pixel_ratio})?/g, '.' + this.adaptSelector + '.$2.$3' + squareSelector + '.$1');
    };

    Imager.prototype.isImageContainerSquare = function(image) {
        return (image.parentNode.clientWidth / image.parentNode.clientHeight) <= this.deltaSquare
    };

    Imager.getPixelRatio = function getPixelRatio(context) {
        return (context || window)['devicePixelRatio'] || 1;
    };

    Imager.createWidthsMap = function createWidthsMap(widths, interpolator) {
        var map = {},
            i = widths.length;

        while (i--) {
            map[widths[i]] = interpolator(widths[i]);
        }

        return map;
    };

    Imager.transforms = {
        pixelRatio: function(value) {
            return value;
        },
        width: function(width, map) {
            return map[width] || width;
        }
    };

    /**
     * Returns the closest upper value.
     *
     * ```js
     * var candidates = [1, 1.5, 2];
     *
     * Imager.getClosestValue(0.8, candidates); // -> 1
     * Imager.getClosestValue(1, candidates); // -> 1
     * Imager.getClosestValue(1.3, candidates); // -> 1.5
     * Imager.getClosestValue(3, candidates); // -> 2
     * ```
     *
     * @api
     * @since 1.0.1
     * @param {Number} baseValue
     * @param {Array.<Number>} candidates
     * @returns {Number}
     */
    Imager.getClosestValue = function getClosestValue(baseValue, candidates) {
        var i = candidates.length,
            selectedWidth = candidates[i - 1];

        baseValue = parseFloat(baseValue, 10);

        while (i--) {
            if (baseValue <= candidates[i]) {
                selectedWidth = candidates[i];
            }
        }

        return selectedWidth;
    };

    Imager.prototype.registerResizeEvent = function() {
        var self = this;

        addEvent(window, 'resize', function() {
            self.checkImagesNeedReplacing(self.divs);
        });
    };

    Imager.prototype.registerScrollEvent = function() {
        var self = this;

        this.scrolled = false;

        this.interval = window.setInterval(function() {
            self.scrollCheck();
        }, self.scrollDelay);

        addEvent(window, 'scroll', function() {
            self.scrolled = true;
        });
    };

    Imager.getPageOffsetGenerator = function getPageVerticalOffset(testCase) {
        if (testCase) {
            return function() {
                return window.pageYOffset;
            };
        } else {
            return function() {
                return document.documentElement.scrollTop;
            };
        }
    };

    // This form is used because it seems impossible to stub `window.pageYOffset`
    Imager.getPageOffset = Imager.getPageOffsetGenerator(Object.prototype.hasOwnProperty.call(window, 'pageYOffset'));

    // Exporting for testing purpose
    Imager.applyEach = applyEach;

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Imager;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function() {
            return Imager;
        });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.Imager = Imager;
    }
    /* global -module, -exports, -define */

}(window, document));
},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/ismobilejs/isMobile.js":[function(_dereq_,module,exports){
/**
 * isMobile.js v0.3.5
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

    var apple_phone         = /iPhone/i,
        apple_ipod          = /iPod/i,
        apple_tablet        = /iPad/i,
        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet      = /Android/i,
        windows_phone       = /IEMobile/i,
        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry    = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera         = /Opera Mini/i,
        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
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
            blackberry:   match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera:        match(other_opera, ua),
            firefox:      match(other_firefox, ua),
            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua)
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
        define(global.isMobile = instantiate());
    } else {
        global.isMobile = instantiate();
    }

})(this);

},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/loglevel/lib/loglevel.js":[function(_dereq_,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    if (typeof module === 'object' && module.exports && typeof _dereq_ === 'function') {
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
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    function enableLoggingWhenConsoleArrives(methodName, level) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods(level);
                self[methodName].apply(self, arguments);
            }
        };
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function replaceLoggingMethods(level) {
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            self[methodName] = (i < level) ? noop : self.methodFactory(methodName, level);
        }
    }

    function persistLevelIfPossible(levelNum) {
        var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

        // Use localStorage if available
        try {
            window.localStorage['loglevel'] = levelName;
            return;
        } catch (ignore) {}

        // Use session cookie as fallback
        try {
            window.document.cookie = "loglevel=" + levelName + ";";
        } catch (ignore) {}
    }

    function loadPersistedLevel() {
        var storedLevel;

        try {
            storedLevel = window.localStorage['loglevel'];
        } catch (ignore) {}

        if (typeof storedLevel === undefinedType) {
            try {
                storedLevel = /loglevel=([^;]+)/.exec(window.document.cookie)[1];
            } catch (ignore) {}
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

    self.methodFactory = function (methodName, level) {
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives(methodName, level);
    };

    self.setLevel = function (level) {
        if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
            level = self.levels[level.toUpperCase()];
        }
        if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
            persistLevelIfPossible(level);
            replaceLoggingMethods(level);
            if (typeof console === undefinedType && level < self.levels.SILENT) {
                return "No console available for logging";
            }
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

},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/verge/verge.js":[function(_dereq_,module,exports){
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
},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js":[function(_dereq_,module,exports){
/*!
 * EventEmitter v4.2.10 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee":[function(_dereq_,module,exports){

/**
 * The purpose of this layer is to declare and abstract the access to
 * the core base of libraries that the rest of the stack (the app framework)
 * will depend.
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Base) {
  var Utils, VersionChecker, dependencies;
  dependencies = [
    {
      "name": "jQuery",
      "required": "1.10",
      "obj": root.$,
      "version": root.$ ? root.$.fn.jquery : 0
    }, {
      "name": "Underscore",
      "required": "1.7.0",
      "obj": root._,
      "version": root._ ? root._.VERSION : 0
    }
  ];
  VersionChecker = _dereq_('./util/versionchecker.coffee');
  VersionChecker.check(dependencies);
  Base.log = _dereq_('./util/logger.coffee');
  Base.device = _dereq_('./util/devicedetection.coffee');
  Base.cookies = _dereq_('./util/cookies.coffee');
  Base.vp = _dereq_('./util/viewportdetection.coffee');
  Base.Imager = _dereq_('imager.js');
  Base.Events = _dereq_('./util/eventbus.coffee');
  Utils = _dereq_('./util/general.coffee');
  Base.util = root._.extend(Utils, root._);
  return Base;
});



},{"./util/cookies.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/cookies.coffee","./util/devicedetection.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/devicedetection.coffee","./util/eventbus.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/eventbus.coffee","./util/general.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/general.coffee","./util/logger.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/logger.coffee","./util/versionchecker.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/versionchecker.coffee","./util/viewportdetection.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/viewportdetection.coffee","imager.js":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/imager.js/Imager.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/components.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Ext) {
  var Base, Component, Module;
  Base = _dereq_('./../base.coffee');
  Module = _dereq_('./../util/module.coffee');
  Component = (function() {
    function Component() {}

    Component.initializedComponents = {};


    /**
     * startAll method
     * This method will look for components to start within the passed selector
     * and call their .initialize() method
     * @author Francisco Ramini <francisco.ramini at globant.com>
     * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
     * @return {[type]}
     */

    Component.startAll = function(selector, app, namespace) {
      var cmpclone, components;
      if (selector == null) {
        selector = 'body';
      }
      if (namespace == null) {
        namespace = Pestle.modules;
      }
      components = Component.parse(selector, app.config.namespace);
      cmpclone = Base.util.clone(components);
      Base.log.info("Parsed components");
      Base.log.debug(cmpclone);
      if (!Base.util.isEmpty(components)) {
        Base.util.each(namespace, function(definition, name) {
          if (!Base.util.isFunction(definition)) {
            return Module.extend(name, definition);
          }
        });
      }
      Base.util.extend(namespace, Pestle.Module.list);
      Component.instantiate(components, app);
      return {
        all: Component.initializedComponents,
        "new": cmpclone
      };
    };


    /**
     * the parse method will look for components defined using
     * the configured namespace and living within the passed
     * CSS selector
     * @author Francisco Ramini <framini at gmail.com>
     * @param  {[type]} selector  [description]
     * @param  {[type]} namespace [description]
     * @return {[type]}           [description]
     */

    Component.parse = function(selector, namespace) {
      var cssSelectors, list, namespaces;
      list = [];
      if (Base.util.isArray(namespace)) {
        namespaces = namespace;
      } else if (Base.util.isString(namespace)) {
        namespaces = namespace.split(',');
      }
      cssSelectors = [];
      Base.util.each(namespaces, function(ns, i) {
        return cssSelectors.push("[data-" + ns + "-component]");
      });
      $(selector).find(cssSelectors.join(',')).each(function(i, comp) {
        var ns, options;
        if (!$(comp).data('pestle-guid')) {
          ns = (function() {
            namespace = "";
            Base.util.each(namespaces, function(ns, i) {
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
        }
      });
      return list;
    };

    Component.parseComponentOptions = function(el, namespace, opts) {
      var data, length, name, options;
      options = Base.util.clone(opts || {});
      options.el = el;
      data = $(el).data();
      name = '';
      length = 0;
      Base.util.each(data, function(v, k) {
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
      var m, mod, modx, sb;
      if (components.length > 0) {
        m = components.shift();
        if (!Base.util.isEmpty(Pestle.modules) && Pestle.modules[m.name] && m.options) {
          mod = Pestle.modules[m.name];
          sb = app.createSandbox(m.name);
          m.options.guid = Base.util.uniqueId(m.name + "_");
          modx = new mod({
            sandbox: sb,
            options: m.options
          });
          modx.initialize();
          $(m.options.el).data('pestle-guid', m.options.guid);
          Component.initializedComponents[m.options.guid] = modx;
        }
        return Component.instantiate(components, app);
      }
    };

    return Component;

  })();
  return {
    initialize: function(app) {
      var initializedComponents;
      Base.log.info("[ext] Component extension initialized");
      initializedComponents = {};
      app.sandbox.startComponents = function(selector, app) {
        return initializedComponents = Component.startAll(selector, app);
      };
      app.sandbox.getInitializedComponents = function() {
        return initializedComponents.all;
      };
      return app.sandbox.getLastestInitializedComponents = function() {
        return initializedComponents["new"];
      };
    },
    afterAppStarted: function(selector, app) {
      var s;
      Base.log.info("Calling startComponents from afterAppStarted");
      s = selector ? selector : null;
      return app.sandbox.startComponents(s, app);
    },
    name: 'Component Extension',
    classes: Component,
    optionKey: 'components'
  };
});



},{"./../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee","./../util/module.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/module.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsivedesign.coffee":[function(_dereq_,module,exports){

/**
 * This extension will be triggering events once the Device in which the
 * user is navigating the site is detected. Its fucionality mostly depends
 * on the configurations settings (provided by default, but they can be overriden)
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Ext) {
  var Base, ResponsiveDesign;
  Base = _dereq_('./../base.coffee');
  ResponsiveDesign = (function() {
    ResponsiveDesign.prototype.cfg = {
      waitLimit: 300,
      windowResizeEvent: true,
      breakpoints: [
        {
          name: "mobile",
          bpmin: 0,
          bpmax: 767
        }, {
          name: "tablet",
          bpmin: 768,
          bpmax: 959
        }, {
          name: "desktop",
          bpmin: 960
        }
      ]
    };

    function ResponsiveDesign(config) {
      if (config == null) {
        config = {};
      }
      Base.util.bindAll(this, "_init", "detectDevice", "_checkViewport", "_attachWindowHandlers", "getDevice", "_resizeHandler");
      this.config = Base.util.extend({}, this.cfg, config);
      this._init();
    }

    ResponsiveDesign.prototype._init = function() {
      if (this.config.windowResizeEvent) {
        this._attachWindowHandlers();
      }
      return this.detectDevice();
    };

    ResponsiveDesign.prototype._attachWindowHandlers = function() {
      var lazyResize;
      lazyResize = Base.util.debounce(this._resizeHandler, this.config.waitLimit);
      return $(window).resize(lazyResize);
    };

    ResponsiveDesign.prototype._resizeHandler = function() {
      Pestle.emit("rwd:windowresize");
      return this.detectDevice();
    };

    ResponsiveDesign.prototype.detectDevice = function() {
      var UADetector, bp, capitalizedBPName, evt, msg, stateUA, vp, vpd;
      bp = this.config.breakpoints;
      vp = Base.vp.viewportW();
      vpd = this._checkViewport(vp, bp);
      if (!Base.util.isEmpty(vpd)) {
        capitalizedBPName = Base.util.string.capitalize(vpd.name);
        if (Base.util.isFunction(Base.device['is' + capitalizedBPName])) {
          UADetector = Base.device['is' + capitalizedBPName];
        }
        stateUA = false;
        if (Base.util.isFunction(UADetector)) {
          stateUA = UADetector();
        }
        if (stateUA || vpd.name) {
          evt = 'rwd:' + vpd.name.toLowerCase();
          Base.log.info("[ext] Responsive Design extension is triggering the following");
          Base.log.info(evt);
          Pestle.emit(evt);
          return this.device = vpd.name.toLowerCase();
        }
      } else {
        msg = "[ext] The passed settings to the Responsive Design Extension " + "might not be correct since we haven't been able to detect an " + "asociated breakpoint to the current viewport";
        return Base.log.warn(msg);
      }
    };

    ResponsiveDesign.prototype.getDevice = function() {
      return this.device;
    };


    /**
     * detect if the current viewport
     * correspond to any of the defined bp in the config setting
     * @param  {[type]} vp [number. Current viewport]
     * @param  {[type]} breakpoints [clone of the breakpoint key object]
     * @return {[type]} the breakpoint that corresponds to the currently
     *                  detected viewport
     */

    ResponsiveDesign.prototype._checkViewport = function(vp, breakpoints) {
      var breakpoint;
      breakpoint = Base.util.filter(breakpoints, function(bp) {
        if (vp >= bp.bpmin) {
          if (bp.bpmax && bp.bpmax !== 0) {
            if (vp <= bp.bpmax) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      });
      if (breakpoint.length > 0) {
        return breakpoint.shift();
      } else {
        return {};
      }
    };

    return ResponsiveDesign;

  })();
  return {
    initialize: function(app) {
      var config, rwd;
      Base.log.info("[ext] Responsive Design Extension initialized");
      config = {};
      if (app.config.extension && app.config.extension[this.optionKey]) {
        config = Base.util.defaults({}, app.config.extension[this.optionKey]);
      }
      rwd = new ResponsiveDesign(config);
      app.sandbox.rwd = function() {
        return rwd.detectDevice();
      };
      return app.sandbox.rwd.getDevice = function() {
        return rwd.getDevice();
      };
    },
    afterAppInitialized: function(app) {
      Base.log.info("afterAppInitialized method from ResponsiveDesign");
      return app.sandbox.rwd();
    },
    name: 'Responsive Design Extension',
    optionKey: 'responsivedesign'
  };
});



},{"./../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsiveimages.coffee":[function(_dereq_,module,exports){

/**
 * This extension will be handling the creation of the responsive images
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Ext) {
  var Base, ResponsiveImages;
  Base = _dereq_('./../base.coffee');
  ResponsiveImages = (function() {
    ResponsiveImages.prototype.cfg = {
      availableWidths: [133, 152, 162, 225, 210, 224, 280, 352, 470, 536, 590, 676, 710, 768, 885, 945, 1190],
      availablePixelRatios: [1, 2, 3],
      defaultSelector: '.delayed-image-load',
      lazymode: true
    };

    function ResponsiveImages(config) {
      if (config == null) {
        config = {};
      }
      Base.util.bindAll(this, "_init", "_createListeners", "_createInstance");
      this.config = Base.util.extend({}, this.cfg, config);
      this._init();
    }

    ResponsiveImages.prototype._init = function() {
      if (this.config.lazymode) {
        this._createListeners();
      }
      return this._createInstance();
    };

    ResponsiveImages.prototype._createListeners = function() {
      return Pestle.on('responsiveimages:create', this._createInstance);
    };

    ResponsiveImages.prototype._createInstance = function(options) {
      var opts, selector;
      if (options == null) {
        options = {};
      }
      Base.log.info("[ext] Responsive Images Extension creating a new Imager instance");
      selector = options.selector || this.config.defaultSelector;
      opts = !Base.util.isEmpty(options) ? options : this.config;
      return new Base.Imager(selector, opts);
    };

    return ResponsiveImages;

  })();
  return {
    initialize: function(app) {
      var config;
      Base.log.info("[ext] Responsive Images Extension initialized");
      config = {};
      if (app.config.extension && app.config.extension[this.optionKey]) {
        config = Base.util.defaults({}, app.config.extension[this.optionKey]);
      }
      return app.sandbox.responsiveimages = function() {
        var rp;
        rp = new ResponsiveImages(config);
        return Pestle.emit('responsiveimages:initialized');
      };
    },
    afterAppInitialized: function(app) {
      Base.log.info("afterAppInitialized method from ResponsiveImages");
      return app.sandbox.responsiveimages();
    },
    name: 'Responsive Images Extension',
    optionKey: 'responsiveimages'
  };
});



},{"./../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/cookies.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Cookies) {
  var cookies;
  cookies = _dereq_('cookies-js');
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



},{"cookies-js":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/cookies-js/src/cookies.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/devicedetection.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, DeviceDetection) {
  var isMobile;
  isMobile = _dereq_('ismobilejs');
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



},{"ismobilejs":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/ismobilejs/isMobile.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/eventbus.coffee":[function(_dereq_,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, EventBus) {
  var EventEmitter;
  EventEmitter = _dereq_('wolfy87-eventemitter');

  /**
   * class that serves as a facade for the EventEmitter class
   */
  EventBus = (function(_super) {
    __extends(EventBus, _super);

    function EventBus() {
      return EventBus.__super__.constructor.apply(this, arguments);
    }

    return EventBus;

  })(EventEmitter);
  return EventBus;
});



},{"wolfy87-eventemitter":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/extmanager.coffee":[function(_dereq_,module,exports){

/**
 * The Extension Mananger will provide the base set of functionalities
 * to make the Core library extensible.
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, ExtManager) {
  var Base;
  Base = _dereq_('../base.coffee');
  ExtManager = (function() {

    /**
     * Defaults configs for the module
     * @type {[type]}
     */
    ExtManager.prototype._extensionConfigDefaults = {
      activated: true
    };

    function ExtManager() {
      this._extensions = [];
      this._initializedExtensions = [];
    }

    ExtManager.prototype.add = function(ext) {
      var msg;
      if (!ext.name) {
        msg = "The extension doesn't have a name associated. It will be hepfull " + "if you have assing all of your extensions a name for better debugging";
        Base.log.warn(msg);
      }
      Base.util.each(this._extensions, function(xt, i) {
        if (_.isEqual(xt, ext)) {
          throw new Error("Extension: " + ext.name + " already exists.");
        }
      });
      return this._extensions.push(ext);
    };

    ExtManager.prototype.init = function(context) {
      var xtclone;
      xtclone = Base.util.clone(this._extensions);
      Base.log.info("Added extensions (still not initialized):");
      Base.log.debug(xtclone);
      this._initExtension(this._extensions, context);
      Base.log.info("Initialized extensions:");
      return Base.log.debug(this._initializedExtensions);
    };

    ExtManager.prototype._initExtension = function(extensions, context) {
      var xt;
      if (extensions.length > 0) {
        xt = extensions.shift();
        if (this._isExtensionAllowedToBeActivated(xt, context.config)) {
          xt.activated = true;
          xt.initialize(context);
          this._initializedExtensions.push(xt);
        } else {
          xt.activated = false;
        }
        return this._initExtension(extensions, context);
      }
    };

    ExtManager.prototype._isExtensionAllowedToBeActivated = function(xt, config) {
      var activated, msg;
      if (!xt.optionKey) {
        msg = "The optionKey is required and was not defined by: " + xt.name;
        Base.log.error(msg);
        throw new Error(msg);
      }
      if (config.extension && config.extension[xt.optionKey] && config.extension[xt.optionKey].hasOwnProperty('activated')) {
        activated = config.extension[xt.optionKey].activated;
      } else {
        activated = this._extensionConfigDefaults.activated;
      }
      return activated;
    };

    ExtManager.prototype.getInitializedExtensions = function() {
      return this._initializedExtensions;
    };

    ExtManager.prototype.getInitializedExtensionByName = function(name) {
      return Base.util.where(this._initializedExtensions, {
        optionKey: name
      });
    };

    ExtManager.prototype.getExtensions = function() {
      return this._extensions;
    };

    ExtManager.prototype.getExtensionByName = function(name) {
      return Base.util.where(this._extensions, {
        optionKey: name
      });
    };

    return ExtManager;

  })();
  return ExtManager;
});



},{"../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/general.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Utils) {
  Utils = {

    /**
     * Function to compare library versioning
     */
    versionCompare: function(v1, v2, options) {
      var i, isValidPart, lexicographical, v1parts, v2parts, zeroExtend;
      isValidPart = function(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
      };
      lexicographical = options && options.lexicographical;
      zeroExtend = options && options.zeroExtend;
      v1parts = v1.split(".");
      v2parts = v2.split(".");
      if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
      }
      if (zeroExtend) {
        while (v1parts.length < v2parts.length) {
          v1parts.push("0");
        }
        while (v2parts.length < v1parts.length) {
          v2parts.push("0");
        }
      }
      if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
      }
      i = -1;
      while (i < v1parts.length) {
        i++;
        if (v2parts.length < i) {
          return 1;
        }
        if (v1parts[i] === v2parts[i]) {
          continue;
        } else if (v1parts[i] > v2parts[i]) {
          return 1;
        } else if (v2parts[i] > v1parts[i]) {
          return -1;
        }
      }
      if (v1parts.length !== v2parts.length) {
        return -1;
      }
      return 0;
    },
    string: {
      capitalize: function(str) {
        str = (str == null ? "" : String(str));
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }
  };
  return Utils;
});



},{}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/logger.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Logger) {
  var loglevel;
  loglevel = _dereq_('loglevel');
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



},{"loglevel":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/loglevel/lib/loglevel.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/module.coffee":[function(_dereq_,module,exports){

/**
 * This will provide the functionality to define Modules
 * and provide a way to extend them
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Module) {
  var Base, Modules, extend;
  Base = _dereq_('../base.coffee');
  Module = (function() {
    function Module(opt) {
      this.sandbox = opt.sandbox;
      this.options = opt.options;
      this.setElement();
    }

    return Module;

  })();
  Modules = (function() {
    function Modules() {}

    Modules.list = {};


    /**
     * just an alias for the extend method
     * @author Francisco Ramini <framini at gmail.com>
     * @param  {[String]} name
     * @param  {[Object]} definition
     */

    Modules.add = function(name, definition) {
      return this.extend(name, definition, Module);
    };


    /**
     * getter for retrieving modules definitions
     * @author Francisco Ramini <framini at gmail.com>
     * @param  {[type]} name
     * @return {[Function/undefined]}
     */

    Modules.get = function(name) {
      if (Base.util.isString(name) && this.list[name]) {
        return this.list[name];
      } else {
        return void 0;
      }
    };


    /**
     * this will allows us to simplify and have more control
     * over adding/defining modules
     * @author Francisco Ramini <framini at gmail.com>
     * @param  {[String]} name
     * @param  {[Object]} definition
     * @param  {[String/Function]} BaseClass
     */

    Modules.extend = function(name, definition, BaseClass) {
      var bc, extendedClass, extendedDefinition, msg;
      if (Base.util.isString(name) && Base.util.isObject(definition)) {
        if (!BaseClass) {
          BaseClass = Module;
        } else {
          if (Base.util.isString(BaseClass)) {
            bc = this.list[BaseClass];
            if (bc) {
              BaseClass = bc;
            } else {
              msg = '[Module/ ' + name(+' ]: is trying to extend [' + BaseClass + '] which does not exist');
              Base.log.error(msg);
              throw new Error(msg);
            }
          } else if (Base.util.isFunction(BaseClass)) {
            BaseClass = BaseClass;
          }
        }
        extendedClass = extend.call(BaseClass, definition);
        if (!Base.util.has(this.list, name)) {
          extendedDefinition = extend.call(BaseClass, definition);
          this.list[name] = extendedDefinition;
          return extendedDefinition;
        } else {
          msg = '[Component:' + name + '] have already been defined';
          Base.log.warn(msg);
          return this;
        }
      }
    };

    return Modules;

  })();
  Base.util.extend(Module.prototype, Base.Events, {
    initialize: function() {
      var msg;
      msg = '[Component/' + this.options.name + ']:' + 'Doesn\'t have an initialize method defined';
      return Base.log.warn(msg);
    },
    setElement: function() {
      this.undelegateEvents();
      this.el = this.options.el;
      this.$el = $(this.el);
      return this.delegateEvents();
    },
    delegateEvents: function(events) {
      var delegateEventSplitter, key, match, method;
      delegateEventSplitter = /^(\S+)\s*(.*)$/;
      if (!(events || (events = Base.util.result(this, "events")))) {
        return;
      }
      this.undelegateEvents();
      for (key in events) {
        method = events[key];
        if (!Base.util.isFunction(method)) {
          method = this[events[key]];
        }
        if (!method) {
          continue;
        }
        match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], Base.util.bind(method, this));
      }
      return this;
    },
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + ".pestleEvent" + this.options.guid, selector, listener);
      return this;
    },
    undelegateEvents: function() {
      if (this.$el) {
        this.$el.off('.pestleEvent' + this.options.guid);
      }
      return this;
    },
    stop: function() {
      this.undelegateEvents();
      if (this.$el) {
        return this.$el.remove();
      }
    }
  });
  extend = function(protoProps, staticProps) {
    var Surrogate, child, parent;
    parent = this;
    if (protoProps && Base.util.has(protoProps, "constructor")) {
      child = protoProps.constructor;
    } else {
      child = function() {
        return parent.apply(this, arguments);
      };
    }
    Base.util.extend(child, parent, staticProps);
    Surrogate = function() {
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    if (protoProps) {
      Base.util.extend(child.prototype, protoProps);
    }
    child.prototype._super_ = parent.prototype.initialize;
    return child;
  };
  Modules.Module = Module;
  return Modules;
});



},{"../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/versionchecker.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, VersionChecker) {
  var Utils, log;
  log = _dereq_('./logger.coffee');
  Utils = _dereq_('./general.coffee');
  VersionChecker = {

    /**
     * Recursive method to check versioning for all the defined libraries
     * within the dependency array
     */
    check: function(dependencies) {
      var dp, msg;
      if (dependencies.length > 0) {
        dp = dependencies.shift();
        if (!dp.obj) {
          msg = dp.name + " is a hard dependency and it has to be loaded before pestle.js";
          log.error(msg);
          throw new Error(msg);
        }
        if (!(Utils.versionCompare(dp.version, dp.required) >= 0)) {
          msg = "[FAIL] " + dp.name + ": version required: " + dp.required + " <--> Loaded version: " + dp.version;
          log.error(msg);
          throw new Error(msg);
        }
        return VersionChecker.check(dependencies);
      }
    }
  };
  return VersionChecker;
});



},{"./general.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/general.coffee","./logger.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/logger.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/viewportdetection.coffee":[function(_dereq_,module,exports){
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, Viewport) {
  var viewport;
  viewport = _dereq_('verge');
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



},{"verge":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/verge/verge.js"}]},{},["./src/core.coffee"])("./src/core.coffee")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9jb29raWVzLWpzL3NyYy9jb29raWVzLmpzIiwibm9kZV9tb2R1bGVzL2ltYWdlci5qcy9JbWFnZXIuanMiLCJub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJub2RlX21vZHVsZXMvdmVyZ2UvdmVyZ2UuanMiLCJub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V4dG1hbmFnZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9nZW5lcmFsLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbW9kdWxlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVB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QVQsQ0FBQSxFQURzQjtJQUFBLENBL0gxQixDQUFBOztnQkFBQTs7TUFiSixDQUFBO0FBZ0pBLFNBQU8sTUFBUCxDQWxKTTtBQUFBLENBSlYsQ0FMQSxDQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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UyxTQUFBLEdBQUE7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFBLEVBREs7SUFBQSxDQWxCVDtBQUFBLElBcUJBLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFBLEVBREs7SUFBQSxDQXJCVDtBQUFBLElBeUJBLEVBQUEsRUFBSSxTQUFDLGdCQUFELEdBQUE7YUFDQSxRQUFRLENBQUMsRUFBVCxDQUFZLGdCQUFaLEVBREE7SUFBQSxDQXpCSjtBQUFBLElBNEJBLFNBQUEsRUFBVyxTQUFDLEVBQUQsRUFBSyxPQUFMLEdBQUE7YUFDUCxRQUFRLENBQUMsU0FBVCxDQUFtQixFQUFuQixFQUF1QixPQUF2QixFQURPO0lBQUEsQ0E1Qlg7QUFBQSxJQWtDQSxNQUFBLEVBQVEsU0FBQyxDQUFELEdBQUE7YUFDSixRQUFRLENBQUMsTUFBVCxDQUFnQixDQUFoQixFQURJO0lBQUEsQ0FsQ1I7R0FMSixDQUFBO0FBMENBLFNBQU8sUUFBUCxDQTdDTTtBQUFBLENBSlYsQ0FBQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjIypcbiAqIFRoZSBjb3JlIGxheWVyIHdpbGwgZGVwZW5kIG9uIHRoZSBiYXNlIGxheWVyIGFuZCB3aWxsIHByb3ZpZGVcbiAqIHRoZSBjb3JlIHNldCBvZiBmdW5jdGlvbmFsaXR5IHRvIGFwcGxpY2F0aW9uIGZyYW1ld29ya1xuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByb290LlBlc3RsZSA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgUGVzdGxlKSAtPlxuXG4gICAgQmFzZSAgICAgICA9IHJlcXVpcmUoJy4vYmFzZS5jb2ZmZWUnKVxuICAgIEV4dE1hbmFnZXIgPSByZXF1aXJlKCcuL3V0aWwvZXh0bWFuYWdlci5jb2ZmZWUnKVxuXG4gICAgIyB3ZSdsbCB1c2UgdGhlIFBlc3RsZSBvYmplY3QgYXMgdGhlIGdsb2JhbCBFdmVudCBidXNcbiAgICBQZXN0bGUgPSBuZXcgQmFzZS5FdmVudHMoKVxuXG4gICAgUGVzdGxlLk1vZHVsZSA9IHJlcXVpcmUoJy4vdXRpbC9tb2R1bGUuY29mZmVlJylcblxuICAgICMgTmFtZXNwYWNlIGZvciBtb2R1bGUgZGVmaW5pdGlvblxuICAgIFBlc3RsZS5tb2R1bGVzID0ge31cblxuICAgIGNsYXNzIFBlc3RsZS5Db3JlXG4gICAgICAgICMgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5XG4gICAgICAgIHZlcnNpb246IFwiMC4wLjFcIlxuXG4gICAgICAgIGNmZzpcbiAgICAgICAgICAgIGRlYnVnOlxuICAgICAgICAgICAgICAgIGxvZ0xldmVsOiA1ICMgYnkgZGVmYXVsdCB0aGUgbG9nZ2luZyB3aWxsIGJlIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB2YWx1ZXMgY2FuIGdvIGZyb20gMCB0byA1ICg1IG1lYW5zIGRpc2FibGVkKVxuICAgICAgICAgICAgbmFtZXNwYWNlOiAncGxhdGZvcm0nXG5cbiAgICAgICAgICAgIGV4dGVuc2lvbjoge30gIyBkZWZpbmUgdGhlIG5hbWVzcGFjZSB0byBkZWZpbmUgZXh0ZW5zaW9uIHNwZWNpZmljIHNldHRpbmdzXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cbiAgICAgICAgICAgICMgaW5pdGlhbGl6ZSB0aGUgY29uZmlnIG9iamVjdFxuICAgICAgICAgICAgQHNldENvbmZpZyhjb25maWcpXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIHRyYWNrIHRoZSBzdGF0ZSBvZiB0aGUgQ29yZS4gV2hlbiBpdCBpc1xuICAgICAgICAgICAgIyB0cnVlLCBpdCBtZWFucyB0aGUgXCJzdGFydCgpXCIgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgICAgICBAc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICMgVGhlIGV4dGVuc2lvbiBtYW5hZ2VyIHdpbGwgYmUgb24gY2hhcmdlIG9mIGxvYWRpbmcgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgIyBhbmQgbWFrZSBpdHMgZnVuY3Rpb25hbGl0eSBhdmFpbGFibGUgdG8gdGhlIHN0YWNrXG4gICAgICAgICAgICBAZXh0TWFuYWdlciA9IG5ldyBFeHRNYW5hZ2VyKClcblxuICAgICAgICAgICAgIyB0aHJvdWdoIHRoaXMgb2JqZWN0IHRoZSBtb2R1bGVzIHdpbGwgYmUgYWNjZXNpbmcgdGhlIG1ldGhvZHMgZGVmaW5lZCBieSB0aGVcbiAgICAgICAgICAgICMgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQHNhbmRib3ggPSBCYXNlLnV0aWwuY2xvbmUgQmFzZVxuXG4gICAgICAgICAgICAjIG5hbWVzcGFjZSB0byBob2xkIGFsbCB0aGUgc2FuZGJveGVzXG4gICAgICAgICAgICBAc2FuZGJveGVzID0ge31cblxuICAgICAgICAgICAgIyBSZXF1aXJlIGNvcmUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQ29tcG9uZW50cyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlJylcbiAgICAgICAgICAgIFJlc3BvbnNpdmVEZXNpZ24gPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9yZXNwb25zaXZlZGVzaWduLmNvZmZlZScpXG4gICAgICAgICAgICBSZXNwb25zaXZlSW1hZ2VzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUnKVxuXG4gICAgICAgICAgICAjIEFkZCBjb3JlIGV4dGVuc2lvbnMgdG8gdGhlIGFwcFxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKENvbXBvbmVudHMpXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoUmVzcG9uc2l2ZURlc2lnbilcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChSZXNwb25zaXZlSW1hZ2VzKVxuXG4gICAgICAgIGFkZEV4dGVuc2lvbjogKGV4dCkgLT5cbiAgICAgICAgICAgICMgd2UnbGwgb25seSBhbGxvdyB0byBhZGQgbmV3IGV4dGVuc2lvbnMgYmVmb3JlXG4gICAgICAgICAgICAjIHRoZSBDb3JlIGdldCBzdGFydGVkXG4gICAgICAgICAgICB1bmxlc3MgQHN0YXJ0ZWRcbiAgICAgICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoZXh0KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKFwiVGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLiBZb3UgY2FuIG5vdCBhZGQgbmV3IGV4dGVuc2lvbnMgYXQgdGhpcyBwb2ludC5cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgIyBwcm92aWRlcyBhIHdheSBmb3Igc2V0dGluZyB1cCBjb25maWdzXG4gICAgICAgICMgYWZ0ZXIgUGVzdGxlIGhhcyBiZWVuIGluc3RhbnRpYXRlZFxuICAgICAgICBzZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgQHN0YXJ0ZWRcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNPYmplY3QgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyBQZXN0bGUgaGFzIGJlZW4gYWxyZWFkeSBpbml0aWFsaXplZFxuICAgICAgICAgICAgICAgICAgICAjIGR1cmluZyBpbnN0YW50aWF0aW9uLCBzbyB3ZSdsbCB1c2UgdGhlIGNvbmZpZyBvYmplY3QgYXMgYVxuICAgICAgICAgICAgICAgICAgICAjIHByb3ZpZGVyIGZvciBkZWZhdWx0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNFbXB0eSBAY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAjIGlmIGl0IGlzIGVtcHR5LCBpdCBtZWFucyB3ZSBhcmUgZ29pbmcgc2V0dGluZyB1cCBQZXN0bGUgZm9yXG4gICAgICAgICAgICAgICAgICAgICMgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyBjb25maWcsIEBjZmdcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW3NldENvbmZpZyBtZXRob2RdIG9ubHkgYWNjZXB0IGFuIG9iamVjdCBhcyBhIHBhcmFtZXRlciBhbmQgeW91J3JlIHBhc3Npbmc6IFwiICsgdHlwZW9mIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICBzdGFydDogKHNlbGVjdG9yID0gJycpIC0+XG5cbiAgICAgICAgICAgICMgU2V0IHRoZSBsb2dnaW5nIGxldmVsIGZvciB0aGUgYXBwXG4gICAgICAgICAgICBCYXNlLmxvZy5zZXRMZXZlbChAY29uZmlnLmRlYnVnLmxvZ0xldmVsKVxuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCBsZXQgdXMgaW5pdGlhbGl6ZSBjb21wb25lbnRzIGF0IGEgbGF0ZXIgc3RhZ2VcbiAgICAgICAgICAgIGlmIEBzdGFydGVkIGFuZCBzZWxlY3RvciBpc250ICcnXG5cbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiUGVzdGxlIGlzIGluaXRpYWxpemluZyBhIGNvbXBvbmVudFwiKVxuXG4gICAgICAgICAgICAgICAgQHNhbmRib3guc3RhcnRDb21wb25lbnRzIHNlbGVjdG9yLCBAXG5cblxuICAgICAgICAgICAgIyBpZiB3ZSBlbnRlciBoZXJlLCBpdCBtZWFucyBpdCBpcyB0aGUgZmlzdCB0aW1lIHRoZSBzdGFydFxuICAgICAgICAgICAgIyBtZXRob2QgaXMgY2FsbGVkIGFuZCB3ZSdsbCBoYXZlIHRvIGluaXRpYWxpemUgYWxsIHRoZSBleHRlbnNpb25zXG4gICAgICAgICAgICBlbHNlXG5cbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiUGVzdGxlIHN0YXJ0ZWQgdGhlIGluaXRpYWxpemluZyBwcm9jZXNzXCIpXG5cbiAgICAgICAgICAgICAgICBAc3RhcnRlZCA9IHRydWVcblxuICAgICAgICAgICAgICAgICMgSW5pdCBhbGwgdGhlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICAgICBAZXh0TWFuYWdlci5pbml0KEApXG5cbiAgICAgICAgICAgICAgICAjIENhbGxiYWNrIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgZnVuY3Rpb25zIHRvIGJlIGV4ZWN1dGVkXG4gICAgICAgICAgICAgICAgIyBhZnRlciBhbGwgZXh0ZW5zaW9ucyBoYXMgYmVlbiBpbml0aWFsaXplZCBhbmQgdGhlIGVhY2ggYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAgICAgIyBtZXRob2QgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICBjYiA9ICQuQ2FsbGJhY2tzIFwidW5pcXVlIG1lbW9yeVwiXG5cbiAgICAgICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgICAgICMgZnJvbSBlYWNoIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgICMgTm90ZTogVGhpcyBtZXRob2Qgd2lsbCBsZXQgZWFjaCBleHRlbnNpb24gdG8gYXV0b21hdGljYWxseSBleGVjdXRlIHNvbWUgY29kZVxuICAgICAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIEBleHRNYW5hZ2VyLmdldEluaXRpYWxpemVkRXh0ZW5zaW9ucygpLCAoZXh0LCBpKSA9PlxuXG4gICAgICAgICAgICAgICAgICAgIGlmIGV4dFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbihleHQuYWZ0ZXJBcHBTdGFydGVkKSBhbmQgZXh0LmFjdGl2YXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgc2luY2UgdGhlIGNvbXBvbmVudCBleHRlbnNpb24gaXMgdGhlIGVudHJ5IHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBmb3IgaW5pdGlhbGl6aW5nIHRoZSBhcHAsIHdlJ2xsIGdpdmUgaXQgc3BlY2lhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdHJlYXRtZW50IGFuZCBnaXZlIGl0IHRoZSBhYmlsaXR5IHRvIHJlY2VpdmUgYW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGV4dHJhIHBhcmFtZXRlciAodG8gc3RhcnQgY29tcG9uZW50cyB0aGF0IG9ubHkgYmVsb25nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0byBhIHBhcnRpY3VsYXIgRE9NIGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZXh0Lm9wdGlvbktleSBpcyBcImNvbXBvbmVudHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkIHNlbGVjdG9yLCBAXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uKGV4dC5hZnRlckFwcEluaXRpYWxpemVkKSBhbmQgZXh0LmFjdGl2YXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmFkZCBleHQuYWZ0ZXJBcHBJbml0aWFsaXplZFxuXG4gICAgICAgICAgICAgICAgIyBDYWxsIHRoZSAuYWZ0ZXJBcHBJbml0aWFsaXplZCBjYWxsYmFja3Mgd2l0aCBAIGFzIHBhcmFtZXRlclxuICAgICAgICAgICAgICAgIGNiLmZpcmUgQFxuXG4gICAgICAgIGNyZWF0ZVNhbmRib3g6IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICAgICAgQHNhbmRib3hlc1tuYW1lXSA9IEJhc2UudXRpbC5leHRlbmQge30sIEBzYW5kYm94LCBuYW1lIDogbmFtZVxuXG4gICAgICAgIGdldEluaXRpYWxpemVkQ29tcG9uZW50czogKCkgLT5cbiAgICAgICAgICAgIEBzYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cygpXG5cblxuICAgIHJldHVybiBQZXN0bGVcbilcbiIsIi8qXHJcbiAqIENvb2tpZXMuanMgLSAxLjEuMFxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vU2NvdHRIYW1wZXIvQ29va2llc1xyXG4gKlxyXG4gKiBUaGlzIGlzIGZyZWUgYW5kIHVuZW5jdW1iZXJlZCBzb2Z0d2FyZSByZWxlYXNlZCBpbnRvIHRoZSBwdWJsaWMgZG9tYWluLlxyXG4gKi9cclxuKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBmYWN0b3J5ID0gZnVuY3Rpb24gKHdpbmRvdykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nvb2tpZXMuanMgcmVxdWlyZXMgYSBgd2luZG93YCB3aXRoIGEgYGRvY3VtZW50YCBvYmplY3QnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBDb29raWVzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5nZXQoa2V5KSA6IENvb2tpZXMuc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEFsbG93cyBmb3Igc2V0dGVyIGluamVjdGlvbiBpbiB1bml0IHRlc3RzXHJcbiAgICAgICAgQ29va2llcy5fZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIFVzZWQgdG8gZW5zdXJlIGNvb2tpZSBrZXlzIGRvIG5vdCBjb2xsaWRlIHdpdGhcclxuICAgICAgICAvLyBidWlsdC1pbiBgT2JqZWN0YCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgQ29va2llcy5fY2FjaGVLZXlQcmVmaXggPSAnY29va2V5Lic7IC8vIEh1cnIgaHVyciwgOilcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLl9jYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGtleV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmV4cGlyZXMgPSBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gLTEgOiBvcHRpb25zLmV4cGlyZXMpO1xyXG5cclxuICAgICAgICAgICAgQ29va2llcy5fZG9jdW1lbnQuY29va2llID0gQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmV4cGlyZSA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuc2V0KGtleSwgdW5kZWZpbmVkLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucyAmJiBvcHRpb25zLnBhdGggfHwgQ29va2llcy5kZWZhdWx0cy5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBvcHRpb25zICYmIG9wdGlvbnMuZG9tYWluIHx8IENvb2tpZXMuZGVmYXVsdHMuZG9tYWluLFxyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogb3B0aW9ucyAmJiBvcHRpb25zLmV4cGlyZXMgfHwgQ29va2llcy5kZWZhdWx0cy5leHBpcmVzLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBvcHRpb25zICYmIG9wdGlvbnMuc2VjdXJlICE9PSB1bmRlZmluZWQgPyAgb3B0aW9ucy5zZWN1cmUgOiBDb29raWVzLmRlZmF1bHRzLnNlY3VyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUgPSBmdW5jdGlvbiAoZXhwaXJlcywgbm93KSB7XHJcbiAgICAgICAgICAgIG5vdyA9IG5vdyB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBleHBpcmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOiBleHBpcmVzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIGV4cGlyZXMgKiAxMDAwKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOiBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KSksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVN0cmluZy5zdWJzdHIoc2VwYXJhdG9ySW5kZXggKyAxKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9hcmVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVzdEtleSA9ICdjb29raWVzLmpzJztcclxuICAgICAgICAgICAgdmFyIGFyZUVuYWJsZWQgPSBDb29raWVzLnNldCh0ZXN0S2V5LCAxKS5nZXQodGVzdEtleSkgPT09ICcxJztcclxuICAgICAgICAgICAgQ29va2llcy5leHBpcmUodGVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmVFbmFibGVkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBjb29raWVzRXhwb3J0ID0gdHlwZW9mIGdsb2JhbC5kb2N1bWVudCA9PT0gJ29iamVjdCcgPyBmYWN0b3J5KGdsb2JhbCkgOiBmYWN0b3J5O1xyXG5cclxuICAgIC8vIEFNRCBzdXBwb3J0XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb2tpZXNFeHBvcnQ7IH0pO1xyXG4gICAgLy8gQ29tbW9uSlMvTm9kZS5qcyBzdXBwb3J0XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIFN1cHBvcnQgTm9kZS5qcyBzcGVjaWZpYyBgbW9kdWxlLmV4cG9ydHNgICh3aGljaCBjYW4gYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBleHBvcnRzLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7IiwiO1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkZWZhdWx0V2lkdGhzLCBnZXRLZXlzLCBuZXh0VGljaywgYWRkRXZlbnQsIGdldE5hdHVyYWxXaWR0aDtcblxuICAgIG5leHRUaWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhcHBseUVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2tFYWNoKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb24gPSBbXTtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdfY29sbGVjdGlvbltpXSA9IGNhbGxiYWNrRWFjaChjb2xsZWN0aW9uW2ldLCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdfY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXR1cm5EaXJlY3RWYWx1ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0TmF0dXJhbFdpZHRoID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLCAnbmF0dXJhbFdpZHRoJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS5uYXR1cmFsV2lkdGg7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIElFOCBhbmQgYmVsb3cgbGFja3MgdGhlIG5hdHVyYWxXaWR0aCBwcm9wZXJ0eVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBpbWcuc3JjID0gc291cmNlLnNyYztcbiAgICAgICAgICAgIHJldHVybiBpbWcud2lkdGg7XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIGFkZEV2ZW50ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZFN0YW5kYXJkRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sIGZhbHNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWRkSUVFdmVudExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGZuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgZGVmYXVsdFdpZHRocyA9IFs5NiwgMTMwLCAxNjUsIDIwMCwgMjM1LCAyNzAsIDMwNCwgMzQwLCAzNzUsIDQxMCwgNDQ1LCA0ODUsIDUyMCwgNTU1LCA1OTAsIDYyNSwgNjYwLCA2OTUsIDczNl07XG5cbiAgICBnZXRLZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXSxcbiAgICAgICAgICAgIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbmV3IEltYWdlciBpbnN0YW5jZSwgcGFzc2luZyBhbiBvcHRpb25hbCBjb25maWd1cmF0aW9uIG9iamVjdC5cblxuICAgICAgICBFeGFtcGxlIHVzYWdlOlxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gQXZhaWxhYmxlIHdpZHRocyBmb3IgeW91ciBpbWFnZXNcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFtOdW1iZXJdLFxuXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0b3IgdG8gYmUgdXNlZCB0byBsb2NhdGUgeW91ciBkaXYgcGxhY2Vob2xkZXJzXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gQ2xhc3MgbmFtZSB0byBnaXZlIHlvdXIgcmVzaXphYmxlIGltYWdlc1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJycsXG5cbiAgICAgICAgICAgICAgICAvLyBJZiBzZXQgdG8gdHJ1ZSwgSW1hZ2VyIHdpbGwgdXBkYXRlIHRoZSBzcmMgYXR0cmlidXRlIG9mIHRoZSByZWxldmFudCBpbWFnZXNcbiAgICAgICAgICAgICAgICBvblJlc2l6ZTogQm9vbGVhbixcblxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgbGF6eSBsb2FkIGZ1bmN0aW9uYWxpdHkgb24gb3Igb2ZmXG4gICAgICAgICAgICAgICAgbGF6eWxvYWQ6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBVc2VkIGFsb25nc2lkZSB0aGUgbGF6eWxvYWQgZmVhdHVyZSAoaGVscHMgcGVyZm9ybWFuY2UgYnkgc2V0dGluZyBhIGhpZ2hlciBkZWxheSlcbiAgICAgICAgICAgICAgICBzY3JvbGxEZWxheTogTnVtYmVyXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgQHBhcmFtIHtvYmplY3R9IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICAgICAgQHJldHVybiB7b2JqZWN0fSBpbnN0YW5jZSBvZiBJbWFnZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJbWFnZXIoZWxlbWVudHMsIG9wdHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgZG9jID0gZG9jdW1lbnQ7XG5cbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICAgICAgaWYgKGVsZW1lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHNlbGVjdG9yIHN0cmluZ1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnNlbGVjdG9yID0gZWxlbWVudHM7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSBgb3B0c2Agb2JqZWN0LCBgZWxlbWVudHNgIGlzIGltcGxpY2l0bHkgdGhlIGBvcHRzLnNlbGVjdG9yYCBzdHJpbmdcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50cy5sZW5ndGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3B0cyA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4gPSBbXTtcbiAgICAgICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLnNlbGVjdG9yID0gb3B0cy5zZWxlY3RvciB8fCAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0cy5jbGFzc05hbWUgfHwgJ2ltYWdlLXJlcGxhY2UnO1xuICAgICAgICB0aGlzLmdpZiA9IGRvYy5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgdGhpcy5naWYuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEVBQUpBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBUUFBa0FBQUlLaEkrcHkrMFBvNXlVRlFBNyc7XG4gICAgICAgIHRoaXMuZ2lmLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICB0aGlzLmdpZi5hbHQgPSAnJztcbiAgICAgICAgdGhpcy5zY3JvbGxEZWxheSA9IG9wdHMuc2Nyb2xsRGVsYXkgfHwgMjUwO1xuICAgICAgICB0aGlzLm9uUmVzaXplID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnb25SZXNpemUnKSA/IG9wdHMub25SZXNpemUgOiB0cnVlO1xuICAgICAgICB0aGlzLmxhenlsb2FkID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnbGF6eWxvYWQnKSA/IG9wdHMubGF6eWxvYWQgOiBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVBpeGVsUmF0aW9zID0gb3B0cy5hdmFpbGFibGVQaXhlbFJhdGlvcyB8fCBbMSwgMl07XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gb3B0cy5hdmFpbGFibGVXaWR0aHMgfHwgZGVmYXVsdFdpZHRocztcbiAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkID0gb3B0cy5vbkltYWdlc1JlcGxhY2VkIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHRoaXMud2lkdGhzTWFwID0ge307XG4gICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcbiAgICAgICAgdGhpcy53aWR0aEludGVycG9sYXRvciA9IG9wdHMud2lkdGhJbnRlcnBvbGF0b3IgfHwgcmV0dXJuRGlyZWN0VmFsdWU7XG4gICAgICAgIHRoaXMuZGVsdGFTcXVhcmUgPSBvcHRzLmRlbHRhU3F1YXJlIHx8IDEuNTtcbiAgICAgICAgdGhpcy5zcXVhcmVTZWxlY3RvciA9IG9wdHMuc3F1YXJlU2VsZWN0b3IgfHwgJ3NxcmNyb3AnO1xuICAgICAgICB0aGlzLmFkYXB0U2VsZWN0b3IgPSB0aGlzLmFkYXB0U2VsZWN0b3IgfHwgJ2FkYXB0JztcblxuICAgICAgICAvLyBOZWVkZWQgYXMgSUU4IGFkZHMgYSBkZWZhdWx0IGB3aWR0aGAvYGhlaWdodGAgYXR0cmlidXRl4oCmXG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzLmxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IEltYWdlci5jcmVhdGVXaWR0aHNNYXAodGhpcy5hdmFpbGFibGVXaWR0aHMsIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzO1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gZ2V0S2V5cyh0aGlzLmF2YWlsYWJsZVdpZHRocyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gdGhpcy5hdmFpbGFibGVXaWR0aHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmRpdnMgPSBhcHBseUVhY2goZWxlbWVudHMsIHJldHVybkRpcmVjdFZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0b3IgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGRvYy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzKCk7XG5cbiAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5zY3JvbGxDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kaXZzID0gdGhpcy5pbWFnZXNPZmZTY3JlZW4uc2xpY2UoMCk7IC8vIGNvcHkgYnkgdmFsdWUsIGRvbid0IGNvcHkgYnkgcmVmZXJlbmNlXG4gICAgICAgICAgICB0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcblxuICAgICAgICBpZiAodGhpcy5vblJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclJlc2l6ZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXp5bG9hZCkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclNjcm9sbEV2ZW50KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jcmVhdGVHaWYgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgYSByZXNwb25zaXZlIGltYWdlIHRoZW4gd2UgZG9uJ3QgcmVwbGFjZSBpdCBhZ2FpblxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58ICknICsgdGhpcy5jbGFzc05hbWUgKyAnKCB8JCknKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnRDbGFzc05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycpO1xuICAgICAgICB2YXIgZWxlbWVudFdpZHRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKTtcbiAgICAgICAgdmFyIGdpZiA9IHRoaXMuZ2lmLmNsb25lTm9kZShmYWxzZSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCkge1xuICAgICAgICAgICAgZ2lmLndpZHRoID0gZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcsIGVsZW1lbnRXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBnaWYuY2xhc3NOYW1lID0gKGVsZW1lbnRDbGFzc05hbWUgPyBlbGVtZW50Q2xhc3NOYW1lICsgJyAnIDogJycpICsgdGhpcy5jbGFzc05hbWU7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdhbHQnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1hbHQnKSB8fCB0aGlzLmdpZi5hbHQpO1xuXG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZ2lmLCBlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gZ2lmO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhcHBseUVhY2godGhpcy5kaXZzLCBmdW5jdGlvbihlbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5sYXp5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzVGhpc0VsZW1lbnRPblNjcmVlbihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRpdnNbaV0gPSBzZWxmLmNyZWF0ZUdpZihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmltYWdlc09mZlNjcmVlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNUaGlzRWxlbWVudE9uU2NyZWVuID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB3YXMgd29ya2luZyBpbiBDaHJvbWUgYnV0IGRpZG4ndCB3b3JrIG9uIEZpcmVmb3gsIHNvIGhhZCB0byByZXNvcnQgdG8gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIC8vIGJ1dCBjYW4ndCBmYWxsYmFjayB0byBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCBhcyB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRSB3aXRoIGEgZG9jdHlwZSAoPykgc28gaGF2ZSB0byB1c2UgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICB2YXIgb2Zmc2V0ID0gSW1hZ2VyLmdldFBhZ2VPZmZzZXQoKTtcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRUb3AgPSAwO1xuXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXRUb3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoZWxlbWVudE9mZnNldFRvcCA8ICh0aGlzLnZpZXdwb3J0SGVpZ2h0ICsgb2Zmc2V0KSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNpemluZykge1xuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcblxuICAgICAgICAgICAgYXBwbHlFYWNoKGltYWdlcywgZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyhpbWFnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uSW1hZ2VzUmVwbGFjZWQoaW1hZ2VzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciBjb21wdXRlZFdpZHRoLCBzcmMsIG5hdHVyYWxXaWR0aDtcblxuICAgICAgICBuYXR1cmFsV2lkdGggPSBnZXROYXR1cmFsV2lkdGgoaW1hZ2UpO1xuICAgICAgICBjb21wdXRlZFdpZHRoID0gdHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzID09PSAnZnVuY3Rpb24nID8gdGhpcy5hdmFpbGFibGVXaWR0aHMoaW1hZ2UpIDogdGhpcy5kZXRlcm1pbmVBcHByb3ByaWF0ZVJlc29sdXRpb24oaW1hZ2UpO1xuXG4gICAgICAgIGltYWdlLndpZHRoID0gY29tcHV0ZWRXaWR0aDtcblxuICAgICAgICBpZiAoaW1hZ2Uuc3JjICE9PSB0aGlzLmdpZi5zcmMgJiYgY29tcHV0ZWRXaWR0aCA8PSBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNyYyA9IHRoaXMuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyh0aGlzLmJ1aWxkVXJsU3RydWN0dXJlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSwgaW1hZ2UpLCBjb21wdXRlZFdpZHRoKTtcblxuICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJykgfHwgaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCwgdGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gdmFsdWUgdXNlZCBieSBJbWFnZXJcbiAgICAgKlxuICAgICAqIEl0IGlzIHBlcmZvcm1lZCBiZWZvcmUgZWFjaCByZXBsYWNlbWVudCBsb29wLCBpbiBjYXNlIGEgdXNlciB6b29tZWQgaW4vb3V0XG4gICAgICogYW5kIHRodXMgdXBkYXRlZCB0aGUgYHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvYCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBhcGlcbiAgICAgKiBAc2luY2UgMS4wLjFcbiAgICAgKi9cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZnJlc2hQaXhlbFJhdGlvID0gZnVuY3Rpb24gcmVmcmVzaFBpeGVsUmF0aW8oKSB7XG4gICAgICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyA9IEltYWdlci5nZXRDbG9zZXN0VmFsdWUoSW1hZ2VyLmdldFBpeGVsUmF0aW8oKSwgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyA9IGZ1bmN0aW9uKHNyYywgc2VsZWN0ZWRXaWR0aCkge1xuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgve3dpZHRofS9nLCBJbWFnZXIudHJhbnNmb3Jtcy53aWR0aChzZWxlY3RlZFdpZHRoLCB0aGlzLndpZHRoc01hcCkpXG4gICAgICAgICAgICAucmVwbGFjZSgve3BpeGVsX3JhdGlvfS9nLCBJbWFnZXIudHJhbnNmb3Jtcy5waXhlbFJhdGlvKHRoaXMuZGV2aWNlUGl4ZWxSYXRpbykpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmJ1aWxkVXJsU3RydWN0dXJlID0gZnVuY3Rpb24oc3JjLCBpbWFnZSkge1xuICAgICAgICB2YXIgc3F1YXJlU2VsZWN0b3IgPSB0aGlzLmlzSW1hZ2VDb250YWluZXJTcXVhcmUoaW1hZ2UpID8gJy4nICsgdGhpcy5zcXVhcmVTZWxlY3RvciA6ICcnO1xuXG4gICAgICAgIHJldHVybiBzcmNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4oanBnfGdpZnxibXB8cG5nKVtec10/KHt3aWR0aH0pP1tec10oe3BpeGVsX3JhdGlvfSk/L2csICcuJyArIHRoaXMuYWRhcHRTZWxlY3RvciArICcuJDIuJDMnICsgc3F1YXJlU2VsZWN0b3IgKyAnLiQxJyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNJbWFnZUNvbnRhaW5lclNxdWFyZSA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiAoaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCAvIGltYWdlLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0KSA8PSB0aGlzLmRlbHRhU3F1YXJlXG4gICAgfTtcblxuICAgIEltYWdlci5nZXRQaXhlbFJhdGlvID0gZnVuY3Rpb24gZ2V0UGl4ZWxSYXRpbyhjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAoY29udGV4dCB8fCB3aW5kb3cpWydkZXZpY2VQaXhlbFJhdGlvJ10gfHwgMTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCA9IGZ1bmN0aW9uIGNyZWF0ZVdpZHRoc01hcCh3aWR0aHMsIGludGVycG9sYXRvcikge1xuICAgICAgICB2YXIgbWFwID0ge30sXG4gICAgICAgICAgICBpID0gd2lkdGhzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBtYXBbd2lkdGhzW2ldXSA9IGludGVycG9sYXRvcih3aWR0aHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnRyYW5zZm9ybXMgPSB7XG4gICAgICAgIHBpeGVsUmF0aW86IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiBmdW5jdGlvbih3aWR0aCwgbWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwW3dpZHRoXSB8fCB3aWR0aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbG9zZXN0IHVwcGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiB2YXIgY2FuZGlkYXRlcyA9IFsxLCAxLjUsIDJdO1xuICAgICAqXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgwLjgsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLCBjYW5kaWRhdGVzKTsgLy8gLT4gMVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMS4zLCBjYW5kaWRhdGVzKTsgLy8gLT4gMS41XG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgzLCBjYW5kaWRhdGVzKTsgLy8gLT4gMlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGFwaVxuICAgICAqIEBzaW5jZSAxLjAuMVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiYXNlVmFsdWVcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBjYW5kaWRhdGVzXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlID0gZnVuY3Rpb24gZ2V0Q2xvc2VzdFZhbHVlKGJhc2VWYWx1ZSwgY2FuZGlkYXRlcykge1xuICAgICAgICB2YXIgaSA9IGNhbmRpZGF0ZXMubGVuZ3RoLFxuICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaSAtIDFdO1xuXG4gICAgICAgIGJhc2VWYWx1ZSA9IHBhcnNlRmxvYXQoYmFzZVZhbHVlLCAxMCk7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGJhc2VWYWx1ZSA8PSBjYW5kaWRhdGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRXaWR0aDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWdpc3RlclJlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHNlbGYuZGl2cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyU2Nyb2xsRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxDaGVjaygpO1xuICAgICAgICB9LCBzZWxmLnNjcm9sbERlbGF5KTtcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXRHZW5lcmF0b3IgPSBmdW5jdGlvbiBnZXRQYWdlVmVydGljYWxPZmZzZXQodGVzdENhc2UpIHtcbiAgICAgICAgaWYgKHRlc3RDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZm9ybSBpcyB1c2VkIGJlY2F1c2UgaXQgc2VlbXMgaW1wb3NzaWJsZSB0byBzdHViIGB3aW5kb3cucGFnZVlPZmZzZXRgXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXQgPSBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvcihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwod2luZG93LCAncGFnZVlPZmZzZXQnKSk7XG5cbiAgICAvLyBFeHBvcnRpbmcgZm9yIHRlc3RpbmcgcHVycG9zZVxuICAgIEltYWdlci5hcHBseUVhY2ggPSBhcHBseUVhY2g7XG5cbiAgICAvKiBnbG9iYWwgbW9kdWxlLCBleHBvcnRzOiB0cnVlLCBkZWZpbmUgKi9cbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KUywganVzdCBleHBvcnRcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gSW1hZ2VyO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBJbWFnZXI7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gSWYgbm8gQU1EIGFuZCB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIsIGF0dGFjaCB0byB3aW5kb3dcbiAgICAgICAgd2luZG93LkltYWdlciA9IEltYWdlcjtcbiAgICB9XG4gICAgLyogZ2xvYmFsIC1tb2R1bGUsIC1leHBvcnRzLCAtZGVmaW5lICovXG5cbn0od2luZG93LCBkb2N1bWVudCkpOyIsIi8qKlxuICogaXNNb2JpbGUuanMgdjAuMy41XG4gKlxuICogQSBzaW1wbGUgbGlicmFyeSB0byBkZXRlY3QgQXBwbGUgcGhvbmVzIGFuZCB0YWJsZXRzLFxuICogQW5kcm9pZCBwaG9uZXMgYW5kIHRhYmxldHMsIG90aGVyIG1vYmlsZSBkZXZpY2VzIChsaWtlIGJsYWNrYmVycnksIG1pbmktb3BlcmEgYW5kIHdpbmRvd3MgcGhvbmUpLFxuICogYW5kIGFueSBraW5kIG9mIHNldmVuIGluY2ggZGV2aWNlLCB2aWEgdXNlciBhZ2VudCBzbmlmZmluZy5cbiAqXG4gKiBAYXV0aG9yOiBLYWkgTWFsbGVhIChrbWFsbGVhQGdtYWlsLmNvbSlcbiAqXG4gKiBAbGljZW5zZTogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXG4gICAgdmFyIGFwcGxlX3Bob25lICAgICAgICAgPSAvaVBob25lL2ksXG4gICAgICAgIGFwcGxlX2lwb2QgICAgICAgICAgPSAvaVBvZC9pLFxuICAgICAgICBhcHBsZV90YWJsZXQgICAgICAgID0gL2lQYWQvaSxcbiAgICAgICAgYW5kcm9pZF9waG9uZSAgICAgICA9IC8oPz0uKlxcYkFuZHJvaWRcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdBbmRyb2lkJyBBTkQgJ01vYmlsZSdcbiAgICAgICAgYW5kcm9pZF90YWJsZXQgICAgICA9IC9BbmRyb2lkL2ksXG4gICAgICAgIHdpbmRvd3NfcGhvbmUgICAgICAgPSAvSUVNb2JpbGUvaSxcbiAgICAgICAgd2luZG93c190YWJsZXQgICAgICA9IC8oPz0uKlxcYldpbmRvd3NcXGIpKD89LipcXGJBUk1cXGIpL2ksIC8vIE1hdGNoICdXaW5kb3dzJyBBTkQgJ0FSTSdcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeSAgICA9IC9CbGFja0JlcnJ5L2ksXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnlfMTAgPSAvQkIxMC9pLFxuICAgICAgICBvdGhlcl9vcGVyYSAgICAgICAgID0gL09wZXJhIE1pbmkvaSxcbiAgICAgICAgb3RoZXJfZmlyZWZveCAgICAgICA9IC8oPz0uKlxcYkZpcmVmb3hcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdGaXJlZm94JyBBTkQgJ01vYmlsZSdcbiAgICAgICAgc2V2ZW5faW5jaCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnKD86JyArICAgICAgICAgLy8gTm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnTmV4dXMgNycgKyAgICAgLy8gTmV4dXMgN1xuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0JOVFYyNTAnICsgICAgIC8vIEImTiBOb29rIFRhYmxldCA3IGluY2hcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdLaW5kbGUgRmlyZScgKyAvLyBLaW5kbGUgRmlyZVxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ1NpbGsnICsgICAgICAgIC8vIEtpbmRsZSBGaXJlLCBTaWxrIEFjY2VsZXJhdGVkXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnR1QtUDEwMDAnICsgICAgLy8gR2FsYXh5IFRhYiA3IGluY2hcblxuICAgICAgICAgICAgJyknLCAgICAgICAgICAgIC8vIEVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdpJyk7ICAgICAgICAgICAvLyBDYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nXG5cbiAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbihyZWdleCwgdXNlckFnZW50KSB7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHZhciBJc01vYmlsZUNsYXNzID0gZnVuY3Rpb24odXNlckFnZW50KSB7XG4gICAgICAgIHZhciB1YSA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgICAgIHRoaXMuYXBwbGUgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFwcGxlX3Bob25lLCB1YSksXG4gICAgICAgICAgICBpcG9kOiAgIG1hdGNoKGFwcGxlX2lwb2QsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2goYXBwbGVfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFwcGxlX3Bob25lLCB1YSkgfHwgbWF0Y2goYXBwbGVfaXBvZCwgdWEpIHx8IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5kcm9pZCA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiAhbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpICYmIG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSB8fCBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2luZG93cyA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2god2luZG93c19waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSkgfHwgbWF0Y2god2luZG93c190YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm90aGVyID0ge1xuICAgICAgICAgICAgYmxhY2tiZXJyeTogICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSksXG4gICAgICAgICAgICBibGFja2JlcnJ5MTA6IG1hdGNoKG90aGVyX2JsYWNrYmVycnlfMTAsIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgICAgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSxcbiAgICAgICAgICAgIGZpcmVmb3g6ICAgICAgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiAgICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpIHx8IG1hdGNoKG90aGVyX29wZXJhLCB1YSkgfHwgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V2ZW5faW5jaCA9IG1hdGNoKHNldmVuX2luY2gsIHVhKTtcbiAgICAgICAgdGhpcy5hbnkgPSB0aGlzLmFwcGxlLmRldmljZSB8fCB0aGlzLmFuZHJvaWQuZGV2aWNlIHx8IHRoaXMud2luZG93cy5kZXZpY2UgfHwgdGhpcy5vdGhlci5kZXZpY2UgfHwgdGhpcy5zZXZlbl9pbmNoO1xuICAgICAgICAvLyBleGNsdWRlcyAnb3RoZXInIGRldmljZXMgYW5kIGlwb2RzLCB0YXJnZXRpbmcgdG91Y2hzY3JlZW4gcGhvbmVzXG4gICAgICAgIHRoaXMucGhvbmUgPSB0aGlzLmFwcGxlLnBob25lIHx8IHRoaXMuYW5kcm9pZC5waG9uZSB8fCB0aGlzLndpbmRvd3MucGhvbmU7XG4gICAgICAgIC8vIGV4Y2x1ZGVzIDcgaW5jaCBkZXZpY2VzLCBjbGFzc2lmeWluZyBhcyBwaG9uZSBvciB0YWJsZXQgaXMgbGVmdCB0byB0aGUgdXNlclxuICAgICAgICB0aGlzLnRhYmxldCA9IHRoaXMuYXBwbGUudGFibGV0IHx8IHRoaXMuYW5kcm9pZC50YWJsZXQgfHwgdGhpcy53aW5kb3dzLnRhYmxldDtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgSU0gPSBuZXcgSXNNb2JpbGVDbGFzcygpO1xuICAgICAgICBJTS5DbGFzcyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgICAgIHJldHVybiBJTTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSXNNb2JpbGVDbGFzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9icm93c2VyaWZ5XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gaW5zdGFudGlhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvL0FNRFxuICAgICAgICBkZWZpbmUoZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xyXG4gICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgPyBub29wIDogc2VsZi5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXSA9IGxldmVsTmFtZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFBlcnNpc3RlZExldmVsKCkge1xyXG4gICAgICAgIHZhciBzdG9yZWRMZXZlbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvbG9nbGV2ZWw9KFteO10rKS8uZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKVsxXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICpcclxuICAgICAqIFB1YmxpYyBBUElcclxuICAgICAqXHJcbiAgICAgKi9cclxuXHJcbiAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xyXG5cclxuICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBsZXZlbCkge1xyXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XHJcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiLyohXHJcbiAqIHZlcmdlIDEuOS4xKzIwMTQwMjEzMDgwM1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcnlhbnZlL3ZlcmdlXHJcbiAqIE1JVCBMaWNlbnNlIDIwMTMgUnlhbiBWYW4gRXR0ZW5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ocm9vdCwgbmFtZSwgbWFrZSkge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSBtb2R1bGVbJ2V4cG9ydHMnXSA9IG1ha2UoKTtcclxuICBlbHNlIHJvb3RbbmFtZV0gPSBtYWtlKCk7XHJcbn0odGhpcywgJ3ZlcmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciB4cG9ydHMgPSB7fVxyXG4gICAgLCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvd1xyXG4gICAgLCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRcclxuICAgICwgZG9jRWxlbSA9IGRvYyAmJiBkb2MuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAsIG1hdGNoTWVkaWEgPSB3aW5bJ21hdGNoTWVkaWEnXSB8fCB3aW5bJ21zTWF0Y2hNZWRpYSddXHJcbiAgICAsIG1xID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKHEpIHtcclxuICAgICAgICByZXR1cm4gISFtYXRjaE1lZGlhLmNhbGwod2luLCBxKS5tYXRjaGVzO1xyXG4gICAgICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0VyA9IHhwb3J0c1sndmlld3BvcnRXJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudFdpZHRoJ10sIGIgPSB3aW5bJ2lubmVyV2lkdGgnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydEggPSB4cG9ydHNbJ3ZpZXdwb3J0SCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRIZWlnaHQnXSwgYiA9IHdpblsnaW5uZXJIZWlnaHQnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfTtcclxuICBcclxuICAvKiogXHJcbiAgICogVGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZS4gTGlrZSBNb2Rlcm5penIubXFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqLyAgXHJcbiAgeHBvcnRzWydtcSddID0gbXE7XHJcblxyXG4gIC8qKiBcclxuICAgKiBOb3JtYWxpemVkIG1hdGNoTWVkaWFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtNZWRpYVF1ZXJ5TGlzdHxPYmplY3R9XHJcbiAgICovIFxyXG4gIHhwb3J0c1snbWF0Y2hNZWRpYSddID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbWF0Y2hNZWRpYSBtdXN0IGJlIGJpbmRlZCB0byB3aW5kb3dcclxuICAgIHJldHVybiBtYXRjaE1lZGlhLmFwcGx5KHdpbiwgYXJndW1lbnRzKTtcclxuICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHcmFjZWZ1bGx5IGRlZ3JhZGUgdG8gcGxhaW4gb2JqZWN0XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHNpbmNlIDEuOC4wXHJcbiAgICogQHJldHVybiB7e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn19XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdmlld3BvcnQoKSB7XHJcbiAgICByZXR1cm4geyd3aWR0aCc6dmlld3BvcnRXKCksICdoZWlnaHQnOnZpZXdwb3J0SCgpfTtcclxuICB9XHJcbiAgeHBvcnRzWyd2aWV3cG9ydCddID0gdmlld3BvcnQ7XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFhcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxYJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0OyBcclxuICB9O1xyXG5cclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWVxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFknXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHt7dG9wOm51bWJlciwgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyLCBsZWZ0Om51bWJlcn19IGNvb3Jkc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiBhZGp1c3RtZW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZShjb29yZHMsIGN1c2hpb24pIHtcclxuICAgIHZhciBvID0ge307XHJcbiAgICBjdXNoaW9uID0gK2N1c2hpb24gfHwgMDtcclxuICAgIG9bJ3dpZHRoJ10gPSAob1sncmlnaHQnXSA9IGNvb3Jkc1sncmlnaHQnXSArIGN1c2hpb24pIC0gKG9bJ2xlZnQnXSA9IGNvb3Jkc1snbGVmdCddIC0gY3VzaGlvbik7XHJcbiAgICBvWydoZWlnaHQnXSA9IChvWydib3R0b20nXSA9IGNvb3Jkc1snYm90dG9tJ10gKyBjdXNoaW9uKSAtIChvWyd0b3AnXSA9IGNvb3Jkc1sndG9wJ10gLSBjdXNoaW9uKTtcclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3Jvc3MtYnJvd3NlciBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCBwbHVzIG9wdGlvbmFsIGN1c2hpb24uXHJcbiAgICogQ29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbCBlbGVtZW50IG9yIHN0YWNrICh1c2VzIGZpcnN0IGl0ZW0pXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uICsvLSBwaXhlbCBhZGp1c3RtZW50IGFtb3VudFxyXG4gICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlY3RhbmdsZShlbCwgY3VzaGlvbikge1xyXG4gICAgZWwgPSBlbCAmJiAhZWwubm9kZVR5cGUgPyBlbFswXSA6IGVsO1xyXG4gICAgaWYgKCFlbCB8fCAxICE9PSBlbC5ub2RlVHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGNhbGlicmF0ZShlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgY3VzaGlvbik7XHJcbiAgfVxyXG4gIHhwb3J0c1sncmVjdGFuZ2xlJ10gPSByZWN0YW5nbGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgdmlld3BvcnQgYXNwZWN0IHJhdGlvIChvciB0aGUgYXNwZWN0IHJhdGlvIG9mIGFuIG9iamVjdCBvciBlbGVtZW50KVxyXG4gICAqIEBzaW5jZSAxLjcuMFxyXG4gICAqIEBwYXJhbSB7KEVsZW1lbnR8T2JqZWN0KT19IG8gb3B0aW9uYWwgb2JqZWN0IHdpdGggd2lkdGgvaGVpZ2h0IHByb3BzIG9yIG1ldGhvZHNcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICogQGxpbmsgaHR0cDovL3czLm9yZy9UUi9jc3MzLW1lZGlhcXVlcmllcy8jb3JpZW50YXRpb25cclxuICAgKi9cclxuICBmdW5jdGlvbiBhc3BlY3Qobykge1xyXG4gICAgbyA9IG51bGwgPT0gbyA/IHZpZXdwb3J0KCkgOiAxID09PSBvLm5vZGVUeXBlID8gcmVjdGFuZ2xlKG8pIDogbztcclxuICAgIHZhciBoID0gb1snaGVpZ2h0J10sIHcgPSBvWyd3aWR0aCddO1xyXG4gICAgaCA9IHR5cGVvZiBoID09ICdmdW5jdGlvbicgPyBoLmNhbGwobykgOiBoO1xyXG4gICAgdyA9IHR5cGVvZiB3ID09ICdmdW5jdGlvbicgPyB3LmNhbGwobykgOiB3O1xyXG4gICAgcmV0dXJuIHcvaDtcclxuICB9XHJcbiAgeHBvcnRzWydhc3BlY3QnXSA9IGFzcGVjdDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHgtYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblgnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIucmlnaHQgPj0gMCAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHktYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblknXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblZpZXdwb3J0J10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgLy8gRXF1aXYgdG8gYGluWChlbCwgY3VzaGlvbikgJiYgaW5ZKGVsLCBjdXNoaW9uKWAgYnV0IGp1c3QgbWFudWFsbHkgZG8gYm90aCBcclxuICAgIC8vIHRvIGF2b2lkIGNhbGxpbmcgcmVjdGFuZ2xlKCkgdHdpY2UuIEl0IGd6aXBzIGp1c3QgYXMgc21hbGwgbGlrZSB0aGlzLlxyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIucmlnaHQgPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKSAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHhwb3J0cztcclxufSkpOyIsIi8qIVxuICogRXZlbnRFbWl0dGVyIHY0LjIuMTAgLSBnaXQuaW8vZWVcbiAqIE9saXZlciBDYWxkd2VsbFxuICogTUlUIGxpY2Vuc2VcbiAqIEBwcmVzZXJ2ZVxuICovXG5cbjsoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBtYW5hZ2luZyBldmVudHMuXG4gICAgICogQ2FuIGJlIGV4dGVuZGVkIHRvIHByb3ZpZGUgZXZlbnQgZnVuY3Rpb25hbGl0eSBpbiBvdGhlciBjbGFzc2VzLlxuICAgICAqXG4gICAgICogQGNsYXNzIEV2ZW50RW1pdHRlciBNYW5hZ2VzIGV2ZW50IHJlZ2lzdGVyaW5nIGFuZCBlbWl0dGluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fVxuXG4gICAgLy8gU2hvcnRjdXRzIHRvIGltcHJvdmUgc3BlZWQgYW5kIHNpemVcbiAgICB2YXIgcHJvdG8gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuICAgIHZhciBleHBvcnRzID0gdGhpcztcbiAgICB2YXIgb3JpZ2luYWxHbG9iYWxWYWx1ZSA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIGluZGV4IG9mIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGV2ZW50IGluIGl0cyBzdG9yYWdlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBsaXN0ZW5lcnMgQXJyYXkgb2YgbGlzdGVuZXJzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBsb29rIGZvci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdGVuZXIsIC0xIGlmIG5vdCBmb3VuZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnMsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBhIG1ldGhvZCB3aGlsZSBrZWVwaW5nIHRoZSBjb250ZXh0IGNvcnJlY3QsIHRvIGFsbG93IGZvciBvdmVyd3JpdGluZyBvZiB0YXJnZXQgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHRhcmdldCBtZXRob2QuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBhbGlhc2VkIG1ldGhvZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsaWFzKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFsaWFzQ2xvc3VyZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW25hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2lsbCBpbml0aWFsaXNlIHRoZSBldmVudCBvYmplY3QgYW5kIGxpc3RlbmVyIGFycmF5cyBpZiByZXF1aXJlZC5cbiAgICAgKiBXaWxsIHJldHVybiBhbiBvYmplY3QgaWYgeW91IHVzZSBhIHJlZ2V4IHNlYXJjaC4gVGhlIG9iamVjdCBjb250YWlucyBrZXlzIGZvciBlYWNoIG1hdGNoZWQgZXZlbnQuIFNvIC9iYVtyel0vIG1pZ2h0IHJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyBiYXIgYW5kIGJhei4gQnV0IG9ubHkgaWYgeW91IGhhdmUgZWl0aGVyIGRlZmluZWQgdGhlbSB3aXRoIGRlZmluZUV2ZW50IG9yIGFkZGVkIHNvbWUgbGlzdGVuZXJzIHRvIHRoZW0uXG4gICAgICogRWFjaCBwcm9wZXJ0eSBpbiB0aGUgb2JqZWN0IHJlc3BvbnNlIGlzIGFuIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXXxPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIHRoZSBldmVudC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoZXZ0KSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJldHVybiBhIGNvbmNhdGVuYXRlZCBhcnJheSBvZiBhbGwgbWF0Y2hpbmcgZXZlbnRzIGlmXG4gICAgICAgIC8vIHRoZSBzZWxlY3RvciBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgICAgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlW2tleV0gPSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGV2ZW50c1tldnRdIHx8IChldmVudHNbZXZ0XSA9IFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGxpc3RlbmVyIG9iamVjdHMgYW5kIGZsYXR0ZW5zIGl0IGludG8gYSBsaXN0IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W119IGxpc3RlbmVycyBSYXcgbGlzdGVuZXIgb2JqZWN0cy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfSBKdXN0IHRoZSBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICovXG4gICAgcHJvdG8uZmxhdHRlbkxpc3RlbmVycyA9IGZ1bmN0aW9uIGZsYXR0ZW5MaXN0ZW5lcnMobGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBmbGF0TGlzdGVuZXJzID0gW107XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZsYXRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZsYXRMaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIHJlcXVlc3RlZCBsaXN0ZW5lcnMgdmlhIGdldExpc3RlbmVycyBidXQgd2lsbCBhbHdheXMgcmV0dXJuIHRoZSByZXN1bHRzIGluc2lkZSBhbiBvYmplY3QuIFRoaXMgaXMgbWFpbmx5IGZvciBpbnRlcm5hbCB1c2UgYnV0IG90aGVycyBtYXkgZmluZCBpdCB1c2VmdWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgaW4gYW4gb2JqZWN0LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVyc0FzT2JqZWN0ID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgaWYgKGxpc3RlbmVycyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgcmVzcG9uc2VbZXZ0XSA9IGxpc3RlbmVycztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZSB8fCBsaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciBmdW5jdGlvbiB0byB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFRoZSBsaXN0ZW5lciB3aWxsIG5vdCBiZSBhZGRlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZS5cbiAgICAgKiBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGl0IGlzIGNhbGxlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSB0aGVuIHRoZSBsaXN0ZW5lciB3aWxsIGJlIGFkZGVkIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcklzV3JhcHBlZCA9IHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCc7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkgJiYgaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0ucHVzaChsaXN0ZW5lcklzV3JhcHBlZCA/IGxpc3RlbmVyIDoge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uY2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vbiA9IGFsaWFzKCdhZGRMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogU2VtaS1hbGlhcyBvZiBhZGRMaXN0ZW5lci4gSXQgd2lsbCBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmVcbiAgICAgKiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgYWZ0ZXIgaXRzIGZpcnN0IGV4ZWN1dGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkT25jZUxpc3RlbmVyID0gZnVuY3Rpb24gYWRkT25jZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZXZ0LCB7XG4gICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRPbmNlTGlzdGVuZXIuXG4gICAgICovXG4gICAgcHJvdG8ub25jZSA9IGFsaWFzKCdhZGRPbmNlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXZlbnQgbmFtZS4gVGhpcyBpcyByZXF1aXJlZCBpZiB5b3Ugd2FudCB0byB1c2UgYSByZWdleCB0byBhZGQgYSBsaXN0ZW5lciB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gSWYgeW91IGRvbid0IGRvIHRoaXMgdGhlbiBob3cgZG8geW91IGV4cGVjdCBpdCB0byBrbm93IHdoYXQgZXZlbnQgdG8gYWRkIHRvPyBTaG91bGQgaXQganVzdCBhZGQgdG8gZXZlcnkgcG9zc2libGUgbWF0Y2ggZm9yIGEgcmVnZXg/IE5vLiBUaGF0IGlzIHNjYXJ5IGFuZCBiYWQuXG4gICAgICogWW91IG5lZWQgdG8gdGVsbCBpdCB3aGF0IGV2ZW50IG5hbWVzIHNob3VsZCBiZSBtYXRjaGVkIGJ5IGEgcmVnZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudCA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50KGV2dCkge1xuICAgICAgICB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXNlcyBkZWZpbmVFdmVudCB0byBkZWZpbmUgbXVsdGlwbGUgZXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gZXZ0cyBBbiBhcnJheSBvZiBldmVudCBuYW1lcyB0byBkZWZpbmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnRzID0gZnVuY3Rpb24gZGVmaW5lRXZlbnRzKGV2dHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZUV2ZW50KGV2dHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnVuY3Rpb24gZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdoZW4gcGFzc2VkIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lLCBpdCB3aWxsIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIHJlbW92ZSBmcm9tIHRoZSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vZmYgPSBhbGlhcygncmVtb3ZlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBhZGQgdGhlIGFycmF5IG9mIGxpc3RlbmVycyB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICogWWVhaCwgdGhpcyBmdW5jdGlvbiBkb2VzIHF1aXRlIGEgYml0LiBUaGF0J3MgcHJvYmFibHkgYSBiYWQgdGhpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyhmYWxzZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIHJlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKHRydWUsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRWRpdHMgbGlzdGVuZXJzIGluIGJ1bGsuIFRoZSBhZGRMaXN0ZW5lcnMgYW5kIHJlbW92ZUxpc3RlbmVycyBtZXRob2RzIGJvdGggdXNlIHRoaXMgdG8gZG8gdGhlaXIgam9iLiBZb3Ugc2hvdWxkIHJlYWxseSB1c2UgdGhvc2UgaW5zdGVhZCwgdGhpcyBpcyBhIGxpdHRsZSBsb3dlciBsZXZlbC5cbiAgICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBkZXRlcm1pbmUgaWYgdGhlIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCAodHJ1ZSkgb3IgYWRkZWQgKGZhbHNlKS5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC9yZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1hbmlwdWxhdGUgdGhlIGxpc3RlbmVycyBvZiBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSBUcnVlIGlmIHlvdSB3YW50IHRvIHJlbW92ZSBsaXN0ZW5lcnMsIGZhbHNlIGlmIHlvdSB3YW50IHRvIGFkZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC9yZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ubWFuaXB1bGF0ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIG1hbmlwdWxhdGVMaXN0ZW5lcnMocmVtb3ZlLCBldnQsIGxpc3RlbmVycykge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICB2YXIgc2luZ2xlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lciA6IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgICAgIHZhciBtdWx0aXBsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXJzIDogdGhpcy5hZGRMaXN0ZW5lcnM7XG5cbiAgICAgICAgLy8gSWYgZXZ0IGlzIGFuIG9iamVjdCB0aGVuIHBhc3MgZWFjaCBvZiBpdHMgcHJvcGVydGllcyB0byB0aGlzIG1ldGhvZFxuICAgICAgICBpZiAodHlwZW9mIGV2dCA9PT0gJ29iamVjdCcgJiYgIShldnQgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5oYXNPd25Qcm9wZXJ0eShpKSAmJiAodmFsdWUgPSBldnRbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIHNpbmdsZSBsaXN0ZW5lciBzdHJhaWdodCB0aHJvdWdoIHRvIHRoZSBzaW5ndWxhciBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHBhc3MgYmFjayB0byB0aGUgbXVsdGlwbGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU28gZXZ0IG11c3QgYmUgYSBzdHJpbmdcbiAgICAgICAgICAgIC8vIEFuZCBsaXN0ZW5lcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBsaXN0ZW5lcnNcbiAgICAgICAgICAgIC8vIExvb3Agb3ZlciBpdCBhbmQgcGFzcyBlYWNoIG9uZSB0byB0aGUgbXVsdGlwbGUgbWV0aG9kXG4gICAgICAgICAgICBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBldnQsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gYSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGFuIGV2ZW50IHRoZW4gYWxsIGxpc3RlbmVycyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogVGhhdCBtZWFucyBldmVyeSBldmVudCB3aWxsIGJlIGVtcHRpZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWdleCB0byByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBbZXZ0XSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuIFdpbGwgcmVtb3ZlIGZyb20gZXZlcnkgZXZlbnQgaWYgbm90IHBhc3NlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2dCkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBldnQ7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZW1vdmUgZGlmZmVyZW50IHRoaW5ncyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIGV2dFxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW2V2dF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50cyBtYXRjaGluZyB0aGUgcmVnZXguXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gYWxsIGV2ZW50c1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVFdmVudC5cbiAgICAgKlxuICAgICAqIEFkZGVkIHRvIG1pcnJvciB0aGUgbm9kZSBBUEkuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlQWxsTGlzdGVuZXJzID0gYWxpYXMoJ3JlbW92ZUV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudCBvZiB5b3VyIGNob2ljZS5cbiAgICAgKiBXaGVuIGVtaXR0ZWQsIGV2ZXJ5IGxpc3RlbmVyIGF0dGFjaGVkIHRvIHRoYXQgZXZlbnQgd2lsbCBiZSBleGVjdXRlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYXJyYXkgdGhlbiB0aG9zZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgbGlzdGVuZXIgdXBvbiBleGVjdXRpb24uXG4gICAgICogQmVjYXVzZSBpdCB1c2VzIGBhcHBseWAsIHlvdXIgYXJyYXkgb2YgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzIGlmIHlvdSB3cm90ZSB0aGVtIG91dCBzZXBhcmF0ZWx5LlxuICAgICAqIFNvIHRoZXkgd2lsbCBub3QgYXJyaXZlIHdpdGhpbiB0aGUgYXJyYXkgb24gdGhlIG90aGVyIHNpZGUsIHRoZXkgd2lsbCBiZSBzZXBhcmF0ZS5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gT3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uIGVtaXRFdmVudChldnQsIGFyZ3MpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVyO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGxpc3RlbmVyc1trZXldLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHNoYWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGVpdGhlciB3aXRoIGEgYmFzaWMgY2FsbCBvciBhbiBhcHBseSBpZiB0aGVyZSBpcyBhbiBhcmdzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2tleV1baV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGxpc3RlbmVyLmxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgZW1pdEV2ZW50XG4gICAgICovXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdlbWl0RXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cbiAgICAgKiBBcyB3aXRoIGVtaXRFdmVudCwgeW91IGNhbiBwYXNzIGEgcmVnZXggaW4gcGxhY2Ugb2YgdGhlIGV2ZW50IG5hbWUgdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHsuLi4qfSBPcHRpb25hbCBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0ID0gZnVuY3Rpb24gZW1pdChldnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0RXZlbnQoZXZ0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWYgYVxuICAgICAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogYWZ0ZXIgZXhlY3V0aW9uLiBUaGlzIHZhbHVlIGRlZmF1bHRzIHRvIHRydWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25jZVJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZlxuICAgICAqIHRoZSBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhpcyBvbmUgdGhlbiBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4geyp8Qm9vbGVhbn0gVGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgZm9yIG9yIHRoZSBkZWZhdWx0LCB0cnVlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBfZ2V0T25jZVJldHVyblZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX29uY2VSZXR1cm5WYWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZXZlbnRzIG9iamVjdCBhbmQgY3JlYXRlcyBvbmUgaWYgcmVxdWlyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgZ2xvYmFsIHtAbGluayBFdmVudEVtaXR0ZXJ9IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGlzIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTm9uIGNvbmZsaWN0aW5nIEV2ZW50RW1pdHRlciBjbGFzcy5cbiAgICAgKi9cbiAgICBFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gb3JpZ2luYWxHbG9iYWxWYWx1ZTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIjIyMqXG4gKiBUaGUgcHVycG9zZSBvZiB0aGlzIGxheWVyIGlzIHRvIGRlY2xhcmUgYW5kIGFic3RyYWN0IHRoZSBhY2Nlc3MgdG9cbiAqIHRoZSBjb3JlIGJhc2Ugb2YgbGlicmFyaWVzIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIHN0YWNrICh0aGUgYXBwIGZyYW1ld29yaylcbiAqIHdpbGwgZGVwZW5kLlxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEJhc2UpIC0+XG5cbiAgICAjIEFycmF5IHRoYXQgaG9sZHMgaGFyZCBkZXBlbmRlbmNpZXMgZm9yIHRoZSBTREtcbiAgICBkZXBlbmRlbmNpZXMgPSBbXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJqUXVlcnlcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuMTBcIiAjIHJlcXVpcmVkIHZlcnNpb25cbiAgICAgICAgICAgIFwib2JqXCI6IHJvb3QuJCAjIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBpZiByb290LiQgdGhlbiByb290LiQuZm4uanF1ZXJ5IGVsc2UgMCAjIGdpdmVzIHRoZSB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIG9mIHRoZSBsb2FkZWQgbGliXG4gICAgICAgICxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIlVuZGVyc2NvcmVcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuNy4wXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290Ll8gIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC5fIHRoZW4gcm9vdC5fLlZFUlNJT04gZWxzZSAwXG4gICAgXVxuXG4gICAgIyBWZXJzaW9uIGNoZWNrZXIgdXRpbFxuICAgIFZlcnNpb25DaGVja2VyID0gcmVxdWlyZSAnLi91dGlsL3ZlcnNpb25jaGVja2VyLmNvZmZlZSdcblxuICAgICMgSW4gY2FzZSBhbnkgb2Ygb3VyIGRlcGVuZGVuY2llcyB3ZXJlIG5vdCBsb2FkZWQsIG9yIGl0cyB2ZXJzaW9uIGRvZXN0IG5vdCBjb3JyZXNwb25kIHRvIG91cnNcbiAgICAjIG5lZWRzLCB0aGUgdmVyc2lvbkNoZWNrZXIgd2lsbCB0aG9ydyBhbiBlcnJvciBleHBsYWluaW5nIHdoeVxuICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuICAgICMgTG9nZ2VyXG4gICAgQmFzZS5sb2cgPSByZXF1aXJlICcuL3V0aWwvbG9nZ2VyLmNvZmZlZSdcblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIEJhc2UuZGV2aWNlID0gcmVxdWlyZSAnLi91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIENvb2tpZXMgQVBJXG4gICAgQmFzZS5jb29raWVzID0gcmVxdWlyZSAnLi91dGlsL2Nvb2tpZXMuY29mZmVlJ1xuXG4gICAgIyBWaWV3cG9ydCBkZXRlY3Rpb25cbiAgICBCYXNlLnZwID0gcmVxdWlyZSAnLi91dGlsL3ZpZXdwb3J0ZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgRnVuY3Rpb24gdGhhdCBpcyBnb25uYSBoYW5kbGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICBCYXNlLkltYWdlciA9IHJlcXVpcmUgJ2ltYWdlci5qcydcblxuICAgICMgRXZlbnQgQnVzXG4gICAgQmFzZS5FdmVudHMgPSByZXF1aXJlICcuL3V0aWwvZXZlbnRidXMuY29mZmVlJ1xuXG4gICAgIyBHZW5lcmFsIFV0aWxzXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL3V0aWwvZ2VuZXJhbC5jb2ZmZWUnXG5cbiAgICAjIFV0aWxzXG4gICAgQmFzZS51dGlsID0gcm9vdC5fLmV4dGVuZCBVdGlscywgcm9vdC5fXG5cbiAgICByZXR1cm4gQmFzZVxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlICAgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcbiAgICBNb2R1bGUgPSByZXF1aXJlKCcuLy4uL3V0aWwvbW9kdWxlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBDb21wb25lbnRcblxuICAgICAgICAjIG9iamVjdCB0byBzdG9yZSBpbml0aWFsaXplZCBjb21wb25lbnRzXG4gICAgICAgIEBpbml0aWFsaXplZENvbXBvbmVudHMgOiB7fVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogc3RhcnRBbGwgbWV0aG9kXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgbG9vayBmb3IgY29tcG9uZW50cyB0byBzdGFydCB3aXRoaW4gdGhlIHBhc3NlZCBzZWxlY3RvclxuICAgICAgICAgKiBhbmQgY2FsbCB0aGVpciAuaW5pdGlhbGl6ZSgpIG1ldGhvZFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgPSAnYm9keScuIENTUyBzZWxlY3RvciB0byB0ZWxsIHRoZSBhcHAgd2hlcmUgdG8gbG9vayBmb3IgY29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBAc3RhcnRBbGw6IChzZWxlY3RvciA9ICdib2R5JywgYXBwLCBuYW1lc3BhY2UgPSBQZXN0bGUubW9kdWxlcykgLT5cblxuICAgICAgICAgICAgY29tcG9uZW50cyA9IENvbXBvbmVudC5wYXJzZShzZWxlY3RvciwgYXBwLmNvbmZpZy5uYW1lc3BhY2UpXG5cbiAgICAgICAgICAgIGNtcGNsb25lID0gQmFzZS51dGlsLmNsb25lIGNvbXBvbmVudHNcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIlBhcnNlZCBjb21wb25lbnRzXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIGNtcGNsb25lXG5cbiAgICAgICAgICAgICMgYWRkZWQgdG8ga2VlcCBuYW1lc3BhY2UuTkFNRSA9IERFRklOSVRJT04gc2ludGF4LiBUaGlzIHdpbGwgZXh0ZW5kXG4gICAgICAgICAgICAjIHRoZSBvYmplY3QgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICMgdGhpcyBtaWdodCBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNFbXB0eSBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlLCAoZGVmaW5pdGlvbiwgbmFtZSkgLT5cbiAgICAgICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0Z1bmN0aW9uIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIE1vZHVsZS5leHRlbmQgbmFtZSwgZGVmaW5pdGlvblxuXG4gICAgICAgICAgICAjIGdyYWIgYSByZWZlcmVuY2Ugb2YgYWxsIHRoZSBtb2R1bGUgZGVmaW5lZCB1c2luZyB0aGUgTW9kdWxlLmFkZFxuICAgICAgICAgICAgIyBtZXRob2QuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIG5hbWVzcGFjZSwgUGVzdGxlLk1vZHVsZS5saXN0XG5cbiAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYWxsOiBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzXG4gICAgICAgICAgICAgICAgbmV3OiBjbXBjbG9uZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogdGhlIHBhcnNlIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGNvbXBvbmVudHMgZGVmaW5lZCB1c2luZ1xuICAgICAgICAgKiB0aGUgY29uZmlndXJlZCBuYW1lc3BhY2UgYW5kIGxpdmluZyB3aXRoaW4gdGhlIHBhc3NlZFxuICAgICAgICAgKiBDU1Mgc2VsZWN0b3JcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG5hbWVzcGFjZSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgIyMjXG4gICAgICAgIEBwYXJzZTogKHNlbGVjdG9yLCBuYW1lc3BhY2UpIC0+XG4gICAgICAgICAgICAjIGFycmF5IHRvIHN0b3JlIHBhcnNlZCBjb21wb25lbnRzXG4gICAgICAgICAgICBsaXN0ID0gW11cblxuICAgICAgICAgICAgIyBpZiBhbiBhcnJheSBpcyBwYXNzZWQsIHVzZSBpdCBhcyBpdCBpc1xuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzQXJyYXkgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZVxuICAgICAgICAgICAgIyBpZiBhIHN0cmluZyBpcyBwYXNzZWQgYXMgcGFyYW1ldGVyLCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5XG4gICAgICAgICAgICBlbHNlIGlmIEJhc2UudXRpbC5pc1N0cmluZyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VzID0gbmFtZXNwYWNlLnNwbGl0ICcsJ1xuXG4gICAgICAgICAgICAjIGFycmF5IHRvIHN0b3JlIHRoZSBjb21wb3NlZCBjc3Mgc2VsZWN0b3IgdGhhdCB3aWxsIGxvb2sgdXAgZm9yXG4gICAgICAgICAgICAjIGNvbXBvbmVudCBkZWZpbml0aW9uc1xuICAgICAgICAgICAgY3NzU2VsZWN0b3JzID0gW11cblxuICAgICAgICAgICAgIyBpdGVyYXRlcyBvdmVyIHRoZSBuYW1lc3BhY2UgYXJyYXkgYW5kIGNyZWF0ZSB0aGUgbmVlZGVkIGNzcyBzZWxlY3RvcnNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGNvbXAgYWxyZWFkeSBoYXMgdGhlIHBlc3RsZS1ndWlkIGF0dGFjaGVkLCBpdCBtZWFuc1xuICAgICAgICAgICAgICAgICMgaXQgd2FzIGFscmVhZHkgc3RhcnRlZCwgc28gd2UnbGwgb25seSBsb29rIGZvciB1bm5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAjIGNvbXBvbmVudHMgaGVyZVxuICAgICAgICAgICAgICAgIHVubGVzcyAkKGNvbXApLmRhdGEoJ3Blc3RsZS1ndWlkJylcblxuICAgICAgICAgICAgICAgICAgICBucyA9IGRvICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBUaGlzIHdheSB3ZSBvYnRhaW4gdGhlIG5hbWVzcGFjZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAkKGNvbXApLmRhdGEobnMgKyBcIi1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbnNcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogYXR0cmlidXRlcyByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHsgbmFtZTogb3B0aW9ucy5uYW1lLCBvcHRpb25zOiBvcHRpb25zIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0XG5cbiAgICAgICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGluIGNoYXJnZSBvZiBwYXJzaW5nIGFsbCB0aGUgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgIyBkZWZpbmVkIGluIHRoZSBpdHMgJGVsIG1hcmt1cCBhbmQgcGxhY2luZyB0aGVtIGluIGEgb2JqZWN0XG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgb3B0aW9ucyA9IEJhc2UudXRpbC5jbG9uZShvcHRzIHx8IHt9KVxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgRE9NIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgZGF0YSA9ICQoZWwpLmRhdGEoKVxuICAgICAgICAgICAgbmFtZSA9ICcnXG4gICAgICAgICAgICBsZW5ndGggPSAwXG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIGRhdGEsICh2LCBrKSAtPlxuXG4gICAgICAgICAgICAgICAgIyByZW1vdmVzIHRoZSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBrID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBuYW1lc3BhY2UpLCBcIlwiKVxuXG4gICAgICAgICAgICAgICAgIyBkZWNhbWVsaXplIHRoZSBvcHRpb24gbmFtZVxuICAgICAgICAgICAgICAgIGsgPSBrLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgay5zbGljZSgxKVxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUga2V5IGlzIGRpZmZlcmVudCBmcm9tIFwiY29tcG9uZW50XCIgaXQgbWVhbnMgaXQgaXNcbiAgICAgICAgICAgICAgICAjIGFuIG9wdGlvbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIGsgIT0gXCJjb21wb25lbnRcIlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gdlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGgrK1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHZcblxuICAgICAgICAgICAgIyBhZGQgb25lIGJlY2F1c2Ugd2UndmUgYWRkZWQgJ2VsJyBhdXRvbWF0aWNhbGx5IGFzIGFuIGV4dHJhIG9wdGlvblxuICAgICAgICAgICAgb3B0aW9ucy5sZW5ndGggPSBsZW5ndGggKyAxXG5cbiAgICAgICAgICAgICMgYnVpbGQgYWQgcmV0dXJuIHRoZSBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICBDb21wb25lbnQuYnVpbGRPcHRpb25zT2JqZWN0KG5hbWUsIG9wdGlvbnMpXG5cblxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cblxuICAgICAgICAgICAgaWYgY29tcG9uZW50cy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBtID0gY29tcG9uZW50cy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZSBtb2R1bGVzIGFyZSBkZWZpbmVkIHVzaW5nIHRoZSBtb2R1bGVzIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICMgVE9ETzogUHJvdmlkZSBhbiBhbHRlcm5hdGUgd2F5IHRvIGRlZmluZSB0aGVcbiAgICAgICAgICAgICAgICAjIGdsb2JhbCBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eShQZXN0bGUubW9kdWxlcykgYW5kIFBlc3RsZS5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBQZXN0bGUubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBnZW5lcmF0ZXMgYW4gdW5pcXVlIGd1aWQgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbS5vcHRpb25zLmd1aWQgPSBCYXNlLnV0aWwudW5pcXVlSWQobS5uYW1lICsgXCJfXCIpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgIyBCYXNlLnV0aWwuZXh0ZW5kIG1vZCwgc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9keCA9IG5ldyBtb2Qoc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbml0IHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbW9keC5pbml0aWFsaXplKClcblxuICAgICAgICAgICAgICAgICAgICAjIHN0b3JlIGEgcmVmZXJlbmNlIG9mIHRoZSBnZW5lcmF0ZWQgZ3VpZCBvbiB0aGUgZWxcbiAgICAgICAgICAgICAgICAgICAgJChtLm9wdGlvbnMuZWwpLmRhdGEgJ3Blc3RsZS1ndWlkJywgbS5vcHRpb25zLmd1aWRcblxuICAgICAgICAgICAgICAgICAgICAjIHNhdmVzIGEgcmVmZXJlbmNlIG9mIHRoZSBpbml0aWFsaXplZCBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50LmluaXRpYWxpemVkQ29tcG9uZW50c1sgbS5vcHRpb25zLmd1aWQgXSA9IG1vZHhcblxuICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cblxuICAgICMjXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgIyNcblxuICAgICMgY29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gQ29tcG9uZW50IGV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgaW5pdGlhbGl6ZWRDb21wb25lbnRzID0ge31cblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMgPSAoc2VsZWN0b3IsIGFwcCkgLT5cblxuICAgICAgICAgICAgaW5pdGlhbGl6ZWRDb21wb25lbnRzID0gQ29tcG9uZW50LnN0YXJ0QWxsKHNlbGVjdG9yLCBhcHApXG5cbiAgICAgICAgYXBwLnNhbmRib3guZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzID0gKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkQ29tcG9uZW50cy5hbGxcblxuICAgICAgICBhcHAuc2FuZGJveC5nZXRMYXN0ZXN0SW5pdGlhbGl6ZWRDb21wb25lbnRzID0gKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkQ29tcG9uZW50cy5uZXdcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoc2VsZWN0b3IsIGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiQ2FsbGluZyBzdGFydENvbXBvbmVudHMgZnJvbSBhZnRlckFwcFN0YXJ0ZWRcIlxuICAgICAgICBzID0gaWYgc2VsZWN0b3IgdGhlbiBzZWxlY3RvciBlbHNlIG51bGxcbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzKHMsIGFwcClcblxuICAgIG5hbWU6ICdDb21wb25lbnQgRXh0ZW5zaW9uJ1xuXG4gICAgIyB0aGlzIHByb3BlcnR5IHdpbGwgYmUgdXNlZCBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuICAgICMgdG8gdmFsaWRhdGUgdGhlIENvbXBvbmVudCBjbGFzcyBpbiBpc29sYXRpb25cbiAgICBjbGFzc2VzIDogQ29tcG9uZW50XG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ2NvbXBvbmVudHMnXG4pXG4iLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGJlIHRyaWdnZXJpbmcgZXZlbnRzIG9uY2UgdGhlIERldmljZSBpbiB3aGljaCB0aGVcbiAqIHVzZXIgaXMgbmF2aWdhdGluZyB0aGUgc2l0ZSBpcyBkZXRlY3RlZC4gSXRzIGZ1Y2lvbmFsaXR5IG1vc3RseSBkZXBlbmRzXG4gKiBvbiB0aGUgY29uZmlndXJhdGlvbnMgc2V0dGluZ3MgKHByb3ZpZGVkIGJ5IGRlZmF1bHQsIGJ1dCB0aGV5IGNhbiBiZSBvdmVycmlkZW4pXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlRGVzaWduXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgVGhpcyBsaW1pdCB3aWxsIGJlIHVzZWQgdG8gbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgIyB3aGVuIHRoZSB1c2VyIHJlc2l6ZSB0aGUgd2luZG93XG4gICAgICAgICAgICB3YWl0TGltaXQ6IDMwMFxuXG4gICAgICAgICAgICAjIGRlZmluZXMgaWYgd2UgaGF2ZSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvdyBvYmpcbiAgICAgICAgICAgIHdpbmRvd1Jlc2l6ZUV2ZW50OiB0cnVlXG5cbiAgICAgICAgICAgICMgRGVmYXVsdCBicmVha3BvaW50c1xuICAgICAgICAgICAgYnJlYWtwb2ludHMgOiBbXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibW9iaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgIyB1bnRpbCB0aGlzIHBvaW50IHdpbGwgYmVoYXZlcyBhcyBtb2JpbGVcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDBcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDc2N1xuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJ0YWJsZXRcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogNzY4XG4gICAgICAgICAgICAgICAgICAgIGJwbWF4OiA5NTlcbiAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgICAgICMgYnkgZGVmYXVsdCBhbnl0aGluZyBncmVhdGVyIHRoYW4gdGFibGV0IGlzIGEgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImRlc2t0b3BcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogOTYwXG4gICAgICAgICAgICBdXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGV0ZWN0RGV2aWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY2hlY2tWaWV3cG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2F0dGFjaFdpbmRvd0hhbmRsZXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImdldERldmljZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfcmVzaXplSGFuZGxlclwiXG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAY2ZnLCBjb25maWdcblxuICAgICAgICAgICAgQF9pbml0KClcblxuICAgICAgICBfaW5pdDogKCkgLT5cblxuICAgICAgICAgICAgQF9hdHRhY2hXaW5kb3dIYW5kbGVycygpIGlmIEBjb25maWcud2luZG93UmVzaXplRXZlbnRcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgX2F0dGFjaFdpbmRvd0hhbmRsZXJzOiAoKSAtPlxuXG4gICAgICAgICAgICBsYXp5UmVzaXplID0gQmFzZS51dGlsLmRlYm91bmNlIEBfcmVzaXplSGFuZGxlciwgQGNvbmZpZy53YWl0TGltaXRcblxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShsYXp5UmVzaXplKVxuXG4gICAgICAgIF9yZXNpemVIYW5kbGVyOiAoKSAtPlxuICAgICAgICAgICAgIyB0cmlnZ2VycyBhIHdpbmRvd3NyZXNpemUgZXZlbnQgc28gdGhpcyB3YXkgd2UgaGF2ZSBhIGNlbnRyYWxpemVkXG4gICAgICAgICAgICAjIHdheSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvd3MgYW5kIHRoZSBjb21wb25lbnNcbiAgICAgICAgICAgICMgY2FuIGxpc3RlbiBkaXJlY3RseSB0byB0aGlzIGV2ZW50IGluc3RlYWQgb2YgZGVmaW5pbmcgYSBuZXcgbGlzdGVuZXJcbiAgICAgICAgICAgIFBlc3RsZS5lbWl0IFwicndkOndpbmRvd3Jlc2l6ZVwiXG5cbiAgICAgICAgICAgIEBkZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIGRldGVjdERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgYnAgPSBAY29uZmlnLmJyZWFrcG9pbnRzXG5cbiAgICAgICAgICAgIHZwID0gQmFzZS52cC52aWV3cG9ydFcoKVxuXG4gICAgICAgICAgICAjIGdldCBhIHJlZmVyZW5jZSAoaWYgYW55KSB0byB0aGUgY29ycmVzcG9uZGluZyBicmVha3BvaW50XG4gICAgICAgICAgICAjIGRlZmluZWQgaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgIHZwZCA9IEBfY2hlY2tWaWV3cG9ydCh2cCwgYnApXG5cbiAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eSB2cGRcblxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkQlBOYW1lID0gQmFzZS51dGlsLnN0cmluZy5jYXBpdGFsaXplKHZwZC5uYW1lKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICMgbGV0J3MgZmlzdCBjaGVjayBpZiB3ZSBoYXZlIGEgbWV0aG9kIHRvIGRldGVjdCB0aGUgZGV2aWNlIHRocm91Z2ggVUFcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIFVBRGV0ZWN0b3IgPSBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG5cbiAgICAgICAgICAgICAgICAjIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIHJlc3VsdCBvZiBhIFVBIGNoZWNrLlxuICAgICAgICAgICAgICAgICMgVW5sZXNzIHRoZXJlIGlzIGEgbWV0aG9kIHRvIGNoZWNrIHRoZSBVQSwgbGV0c1xuICAgICAgICAgICAgICAgICMgbGVhdmUgaXQgYXMgZmFsc2UgYW5kIHVzZSBvbmx5IHRoZSB2aWV3cG9ydCB0b1xuICAgICAgICAgICAgICAgICMgbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIFVBRGV0ZWN0b3JcblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVVBID0gVUFEZXRlY3RvcigpXG5cbiAgICAgICAgICAgICAgICAjIEZpbmFsIGNoZWNrLiBGaXJzdCB3ZSdsbCB0cnkgdG8gbWFrZSB0byBtYWtlIHRoZSBkZWNpc2lvblxuICAgICAgICAgICAgICAgICMgdXBvbiB0aGUgY3VycmVudCBkZXZpY2UgYmFzZWQgb24gVUEsIGlmIGlzIG5vdCBwb3NzaWJsZSwgbGV0cyBqdXN0XG4gICAgICAgICAgICAgICAgIyB1c2UgdGhlIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgaWYgc3RhdGVVQSBvciB2cGQubmFtZVxuICAgICAgICAgICAgICAgICAgICAjIFRyaWdnZXIgYSBldmVudCB0aGF0IGZvbGxvd3MgdGhlIGZvbGxvd2luZyBuYW1pbmcgY29udmVudGlvblxuICAgICAgICAgICAgICAgICAgICAjIHJ3ZDo8ZGV2aWNlPlxuICAgICAgICAgICAgICAgICAgICAjIEV4YW1wbGU6IHJ3ZDp0YWJsZXQgb3IgcndkOm1vYmlsZVxuXG4gICAgICAgICAgICAgICAgICAgIGV2dCA9ICdyd2Q6JyArIHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gZXh0ZW5zaW9uIGlzIHRyaWdnZXJpbmcgdGhlIGZvbGxvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgUGVzdGxlLmVtaXQgZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgIyBTdG9yZSB0aGUgY3VycmVudCBkZXZpY2VcbiAgICAgICAgICAgICAgICAgICAgQGRldmljZSA9IHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiW2V4dF0gVGhlIHBhc3NlZCBzZXR0aW5ncyB0byB0aGUgUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtaWdodCBub3QgYmUgY29ycmVjdCBzaW5jZSB3ZSBoYXZlbid0IGJlZW4gYWJsZSB0byBkZXRlY3QgYW4gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImFzb2NpYXRlZCBicmVha3BvaW50IHRvIHRoZSBjdXJyZW50IHZpZXdwb3J0XCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIGdldERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIEBkZXZpY2VcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGRldGVjdCBpZiB0aGUgY3VycmVudCB2aWV3cG9ydFxuICAgICAgICAgKiBjb3JyZXNwb25kIHRvIGFueSBvZiB0aGUgZGVmaW5lZCBicCBpbiB0aGUgY29uZmlnIHNldHRpbmdcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSB2cCBbbnVtYmVyLiBDdXJyZW50IHZpZXdwb3J0XVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGJyZWFrcG9pbnRzIFtjbG9uZSBvZiB0aGUgYnJlYWtwb2ludCBrZXkgb2JqZWN0XVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IHRoZSBicmVha3BvaW50IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGN1cnJlbnRseVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGRldGVjdGVkIHZpZXdwb3J0XG4gICAgICAgICMjI1xuICAgICAgICBfY2hlY2tWaWV3cG9ydDogKHZwLCBicmVha3BvaW50cykgLT5cblxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IEJhc2UudXRpbC5maWx0ZXIoYnJlYWtwb2ludHMsIChicCkgLT5cblxuICAgICAgICAgICAgICAgICMgc3RhcnRzIGNoZWNraW5nIGlmIHRoZSBkZXRlY3RlZCB2aWV3cG9ydCBpc1xuICAgICAgICAgICAgICAgICMgYmlnZ2VyIHRoYW4gdGhlIGJwbWluIGRlZmluZWQgaW4gdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAjIGl0ZXJhdGVkIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICBpZiB2cCA+PSBicC5icG1pblxuXG4gICAgICAgICAgICAgICAgICAgICMgd2UnbGwgbmVlZCB0byBjaGVjayB0aGlzIHdheSBiZWNhdXNlIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBhIEJQIGRvZXNuJ3QgaGF2ZSBhIGJwbWF4IHByb3BlcnR5IGl0IG1lYW5zXG4gICAgICAgICAgICAgICAgICAgICMgaXMgdGhlIGxhc3QgYW5kIGJpZ2dlciBjYXNlIHRvIGNoZWNrLiBCeSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICMgaXMgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBpZiBicC5icG1heCBhbmQgYnAuYnBtYXggIT0gMFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIGl0J3Mgd2l0aGluIHRoZSByYW5nZSwgYWxsIGdvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHZwIDw9IGJwLmJwbWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgc2hvdWxkIG9ubHkgYmUgdHJ1ZSBpbiBvbmx5IG9uZSBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEJ5IGRlZmF1bHQsIGp1c3QgZm9yIGRlc2t0b3Agd2hpY2ggZG9lc24ndCBoYXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGFuIFwidW50aWxcIiBicmVha3BvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmYWxzZVxuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIGJyZWFrcG9pbnQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIHJldHVybiBicmVha3BvaW50LnNoaWZ0KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4ge31cblxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAjIENoZWNrIGlmIHRoZSBleHRlbnNpb24gaGFzIGEgY3VzdG9tIGNvbmZpZyB0byB1c2VcbiAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgcndkID0gbmV3IFJlc3BvbnNpdmVEZXNpZ24oY29uZmlnKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCA9ICgpIC0+XG4gICAgICAgICAgICAjIGNhbGwgZGV0ZWN0IERldmljZSBpbiBvcmRlciB0byB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAgICAgICAjIGRldmljZSBldmVudFxuICAgICAgICAgICAgcndkLmRldGVjdERldmljZSgpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkLmdldERldmljZSA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJ3ZC5nZXREZXZpY2UoKVxuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVEZXNpZ25cIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCgpXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlZGVzaWduJ1xuKSIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgaGFuZGxpbmcgdGhlIGNyZWF0aW9uIG9mIHRoZSByZXNwb25zaXZlIGltYWdlc1xuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgUmVzcG9uc2l2ZUltYWdlc1xuXG4gICAgICAgIGNmZyA6XG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlZCBQaXhlbCB3aWR0aCBmb3IgaW1hZ2VzXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFsxMzMsMTUyLDE2MiwyMjUsMjEwLDIyNCwyODAsMzUyLDQ3MCw1MzYsNTkwLDY3Niw3MTAsNzY4LDg4NSw5NDUsMTE5MF1cblxuICAgICAgICAgICAgIyBBcnJheSBvZiBzdXBwb3J0ZXIgcGl4ZWwgcmF0aW9zXG4gICAgICAgICAgICBhdmFpbGFibGVQaXhlbFJhdGlvczogWzEsIDIsIDNdXG5cbiAgICAgICAgICAgICMgU2VsZWN0b3IgdG8gYmUgdXNlZCB3aGVuIGluc3RhbnRpbmcgSW1hZ2VyXG4gICAgICAgICAgICBkZWZhdWx0U2VsZWN0b3IgOiAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCdcblxuICAgICAgICAgICAgIyBsYXp5IG1vZGUgZW5hYmxlZFxuICAgICAgICAgICAgbGF6eW1vZGUgOiB0cnVlXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUxpc3RlbmVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUluc3RhbmNlXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICAjIGNyZWF0ZXMgbGlzdGVuZXJzIHRvIGFsbG93IHRoZSBpbnN0YW50aWF0b24gb2YgdGhlIEltYWdlclxuICAgICAgICAgICAgIyBpbiBsYXp5IGxvYWQgbW9kZS5cbiAgICAgICAgICAgICMgVXNlZnVsIGZvciBpbmZpbml0ZSBzY3JvbGxzIG9yIGltYWdlcyBjcmVhdGVkIG9uIGRlbWFuZFxuICAgICAgICAgICAgQF9jcmVhdGVMaXN0ZW5lcnMoKSBpZiBAY29uZmlnLmxhenltb2RlXG5cbiAgICAgICAgICAgICMgQXMgc29vbiBhcyB0aGlzIGV4dGVuc2lvbiBpcyBpbml0aWFsaXplZCB3ZSBhcmUgZ29ubmEgYmUgY3JlYXRpbmdcbiAgICAgICAgICAgICMgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICBAX2NyZWF0ZUluc3RhbmNlKClcblxuICAgICAgICBfY3JlYXRlTGlzdGVuZXJzOiAoKSAtPlxuICAgICAgICAgICAgIyB0aGlzIGdpdmVzIHRoZSBhYmlsaXR5IHRvIGNyZWF0ZSByZXNwb25zaXZlIGltYWdlc1xuICAgICAgICAgICAgIyBieSB0cmlnZ2VyIHRoaXMgZXZlbnQgd2l0aCBvcHRpb25hbCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBQZXN0bGUub24gJ3Jlc3BvbnNpdmVpbWFnZXM6Y3JlYXRlJywgQF9jcmVhdGVJbnN0YW5jZVxuXG4gICAgICAgIF9jcmVhdGVJbnN0YW5jZSA6IChvcHRpb25zID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24gY3JlYXRpbmcgYSBuZXcgSW1hZ2VyIGluc3RhbmNlXCJcblxuICAgICAgICAgICAgc2VsZWN0b3IgPSBvcHRpb25zLnNlbGVjdG9yIG9yIEBjb25maWcuZGVmYXVsdFNlbGVjdG9yXG4gICAgICAgICAgICBvcHRzID0gaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5IG9wdGlvbnMgdGhlbiBvcHRpb25zIGVsc2UgQGNvbmZpZ1xuXG4gICAgICAgICAgICBuZXcgQmFzZS5JbWFnZXIoc2VsZWN0b3IsIG9wdHMpXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBjb25maWcgPSB7fVxuXG4gICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICBpZiBhcHAuY29uZmlnLmV4dGVuc2lvbiBhbmQgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cbiAgICAgICAgICAgIGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyB7fSwgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzID0gKCkgLT5cblxuICAgICAgICAgICAgcnAgPSBuZXcgUmVzcG9uc2l2ZUltYWdlcyhjb25maWcpXG5cbiAgICAgICAgICAgICMgdHJpZ2dlciB0aGUgZXZlbnQgdG8gbGV0IGV2ZXJ5Ym9keSBrbm93cyB0aGF0IHRoaXMgZXh0ZW5zaW9uIGZpbmlzaGVkXG4gICAgICAgICAgICAjIGl0cyBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgUGVzdGxlLmVtaXQgJ3Jlc3BvbnNpdmVpbWFnZXM6aW5pdGlhbGl6ZWQnXG5cbiAgICAjIHRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBvbmVudHMgaGF2ZSBiZWVuXG4gICAgIyBpbml0aWFsaXplZFxuICAgIGFmdGVyQXBwSW5pdGlhbGl6ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcImFmdGVyQXBwSW5pdGlhbGl6ZWQgbWV0aG9kIGZyb20gUmVzcG9uc2l2ZUltYWdlc1wiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucmVzcG9uc2l2ZWltYWdlcygpXG5cblxuICAgIG5hbWU6ICdSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24nXG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ3Jlc3BvbnNpdmVpbWFnZXMnXG4pXG4iLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgQ29va2llcykgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgY29va2llcyA9IHJlcXVpcmUoJ2Nvb2tpZXMtanMnKVxuXG4gICAgIyBFeHBvc2UgQ29va2llcyBBUElcbiAgICBDb29raWVzID1cblxuICAgICAgICBzZXQ6IChrZXksIHZhbHVlLCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgY29va2llcy5zZXQga2V5LCB2YWx1ZSwgb3B0aW9uc1xuXG4gICAgICAgIGdldDogKGtleSkgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuZ2V0IGtleVxuXG4gICAgICAgIGV4cGlyZTogKGtleSwgb3B0aW9ucykgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuZXhwaXJlIGtleSwgb3B0aW9uc1xuXG4gICAgcmV0dXJuIENvb2tpZXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRGV2aWNlRGV0ZWN0aW9uKSAtPlxuXG4gICAgIyBEZXZpY2UgZGV0ZWN0aW9uXG4gICAgaXNNb2JpbGUgPSByZXF1aXJlKCdpc21vYmlsZWpzJylcblxuICAgICMgRXhwb3NlIGRldmljZSBkZXRlY3Rpb24gQVBJXG4gICAgRGV2aWNlRGV0ZWN0aW9uID1cblxuICAgICAgICAjIEdyb3Vwc1xuICAgICAgICBpc01vYmlsZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLnBob25lXG5cbiAgICAgICAgaXNUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS50YWJsZXRcblxuICAgICAgICAjIEFwcGxlIGRldmljZXNcbiAgICAgICAgaXNJcGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5waG9uZVxuXG4gICAgICAgIGlzSXBvZDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLmlwb2RcblxuICAgICAgICBpc0lwYWQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS50YWJsZXRcblxuICAgICAgICBpc0FwcGxlIDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLmRldmljZVxuXG4gICAgICAgICMgQW5kcm9pZCBkZXZpY2VzXG4gICAgICAgIGlzQW5kcm9pZFBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC5waG9uZVxuXG4gICAgICAgIGlzQW5kcm9pZFRhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQudGFibGV0XG5cbiAgICAgICAgaXNBbmRyb2lkRGV2aWNlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC5kZXZpY2VcblxuICAgICAgICAjIFdpbmRvd3MgZGV2aWNlc1xuICAgICAgICBpc1dpbmRvd3NQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MucGhvbmVcblxuICAgICAgICBpc1dpbmRvd3NUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnRhYmxldFxuXG4gICAgICAgIGlzV2luZG93c0RldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MuZGV2aWNlXG5cbiAgICByZXR1cm4gRGV2aWNlRGV0ZWN0aW9uXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV2ZW50QnVzKSAtPlxuXG4gICAgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnd29sZnk4Ny1ldmVudGVtaXR0ZXInKVxuXG4gICAgIyMjKlxuICAgICAqIGNsYXNzIHRoYXQgc2VydmVzIGFzIGEgZmFjYWRlIGZvciB0aGUgRXZlbnRFbWl0dGVyIGNsYXNzXG4gICAgIyMjXG4gICAgY2xhc3MgRXZlbnRCdXMgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcblxuICAgIHJldHVybiBFdmVudEJ1c1xuKSIsIiMjIypcbiAqIFRoZSBFeHRlbnNpb24gTWFuYW5nZXIgd2lsbCBwcm92aWRlIHRoZSBiYXNlIHNldCBvZiBmdW5jdGlvbmFsaXRpZXNcbiAqIHRvIG1ha2UgdGhlIENvcmUgbGlicmFyeSBleHRlbnNpYmxlLlxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dE1hbmFnZXIpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgRXh0TWFuYWdlclxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogRGVmYXVsdHMgY29uZmlncyBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgX2V4dGVuc2lvbkNvbmZpZ0RlZmF1bHRzOlxuICAgICAgICAgICAgYWN0aXZhdGVkIDogdHJ1ZSAjIHVubGVzcyBzYWlkIG90aGVyd2lzZSwgZXZlcnkgYWRkZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgd2lsbCBiZSBhY3RpdmF0ZWQgb24gc3RhcnRcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQF9leHRlbnNpb25zID0gW11cblxuICAgICAgICAgICAgIyB0byBrZWVwIHRyYWNrIG9mIGFsbCBpbml0aWFsaXplZCBleHRlbnNpb25cbiAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zID0gW11cblxuICAgICAgICBhZGQ6IChleHQpIC0+XG5cbiAgICAgICAgICAgICMgY2hlY2tzIGlmIHRoZSBuYW1lIGZvciB0aGUgZXh0ZW5zaW9uIGhhdmUgYmVlbiBkZWZpbmVkLlxuICAgICAgICAgICAgIyBpZiBub3QgbG9nIGEgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICB1bmxlc3MgZXh0Lm5hbWVcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBleHRlbnNpb24gZG9lc24ndCBoYXZlIGEgbmFtZSBhc3NvY2lhdGVkLiBJdCB3aWxsIGJlIGhlcGZ1bGwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiaWYgeW91IGhhdmUgYXNzaW5nIGFsbCBvZiB5b3VyIGV4dGVuc2lvbnMgYSBuYW1lIGZvciBiZXR0ZXIgZGVidWdnaW5nXCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgICAgICAjIExldHMgdGhyb3cgYW4gZXJyb3IgaWYgd2UgdHJ5IHRvIGluaXRpYWxpemUgdGhlIHNhbWUgZXh0ZW5zaW9uIHR3aWNlc1xuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQF9leHRlbnNpb25zLCAoeHQsIGkpIC0+XG4gICAgICAgICAgICAgICAgaWYgXy5pc0VxdWFsIHh0LCBleHRcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXh0ZW5zaW9uOiBcIiArIGV4dC5uYW1lICsgXCIgYWxyZWFkeSBleGlzdHMuXCIpXG5cbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucy5wdXNoKGV4dClcblxuICAgICAgICBpbml0IDogKGNvbnRleHQpIC0+XG4gICAgICAgICAgICB4dGNsb25lID0gQmFzZS51dGlsLmNsb25lIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiQWRkZWQgZXh0ZW5zaW9ucyAoc3RpbGwgbm90IGluaXRpYWxpemVkKTpcIlxuICAgICAgICAgICAgQmFzZS5sb2cuZGVidWcgeHRjbG9uZVxuXG4gICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oQF9leHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiSW5pdGlhbGl6ZWQgZXh0ZW5zaW9uczpcIlxuICAgICAgICAgICAgQmFzZS5sb2cuZGVidWcgQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgICAgICBfaW5pdEV4dGVuc2lvbiA6IChleHRlbnNpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBleHRlbnNpb25zLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHh0ID0gZXh0ZW5zaW9ucy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgZXh0ZW5zaW9ucyBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIGlmIEBfaXNFeHRlbnNpb25BbGxvd2VkVG9CZUFjdGl2YXRlZCh4dCwgY29udGV4dC5jb25maWcpXG4gICAgICAgICAgICAgICAgICAgICMgdGhpcyBzdGF0ZSBjb3VsZCB0ZWxsIHRvIHRoZSByZXN0IG9mIHRoZSB3b3JsZCBpZlxuICAgICAgICAgICAgICAgICAgICAjIGV4dGVuc2lvbnMgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgb3Igbm90XG4gICAgICAgICAgICAgICAgICAgIHh0LmFjdGl2YXRlZCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAjIGNhbGwgdG8gdGhlIGV4dGVuc2lvbiBpbml0aWFsaXplIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICB4dC5pbml0aWFsaXplKGNvbnRleHQpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbml0aWFsaXplZCBleHRlbnNpb25zIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLnB1c2ggeHRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHh0LmFjdGl2YXRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgICAjIGNhbGwgdGhpcyBtZXRob2QgcmVjdXJzaXZlbHkgdW50aWwgdGhlcmUgYXJlIG5vIG1vcmVcbiAgICAgICAgICAgICAgICAjIGVsZW1lbnRzIGluIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihleHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkOiAoeHQsIGNvbmZpZykgLT5cblxuICAgICAgICAgICAgIyBmaXJzdCB3ZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBcIm9wdGlvbnNcIiBrZXkgaXMgZGVmaW5lZFxuICAgICAgICAgICAgIyBieSB0aGUgZXh0ZW5zaW9uXG4gICAgICAgICAgICB1bmxlc3MgeHQub3B0aW9uS2V5XG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgb3B0aW9uS2V5IGlzIHJlcXVpcmVkIGFuZCB3YXMgbm90IGRlZmluZWQgYnk6IFwiICsgeHQubmFtZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICMgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkIHRvIHRoZSBleHRlbnNpb24sIGxldHMgY2hlY2sganVzdCBmb3IgXCJhY3RpdmF0ZWRcIlxuICAgICAgICAgICAgIyB3aGljaCBpcyB0aGUgb25seSBvcHRpb24gdGhhdCBzaG91bGQgbWF0dGVyIHdpdGhpbiB0aGlzIG1ldGhvZFxuICAgICAgICAgICAgaWYgY29uZmlnLmV4dGVuc2lvbiBhbmQgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmhhc093blByb3BlcnR5ICdhY3RpdmF0ZWQnXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmFjdGl2YXRlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFjdGl2YXRlZCA9IEBfZXh0ZW5zaW9uQ29uZmlnRGVmYXVsdHMuYWN0aXZhdGVkXG5cbiAgICAgICAgICAgIHJldHVybiBhY3RpdmF0ZWRcblxuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLCBvcHRpb25LZXk6IG5hbWVcblxuICAgICAgICBnZXRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2V4dGVuc2lvbnNcblxuICAgICAgICBnZXRFeHRlbnNpb25CeU5hbWUgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIEJhc2UudXRpbC53aGVyZSBAX2V4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFV0aWxzKSAtPlxuXG4gICAgIyBFeHBvc2UgVXRpbHMgQVBJXG4gICAgVXRpbHMgPVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogRnVuY3Rpb24gdG8gY29tcGFyZSBsaWJyYXJ5IHZlcnNpb25pbmdcbiAgICAgICAgIyMjXG4gICAgICAgIHZlcnNpb25Db21wYXJlIDogKHYxLCB2Miwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgaXNWYWxpZFBhcnQgPSAoeCkgLT5cbiAgICAgICAgICAgICAgICAoKGlmIGxleGljb2dyYXBoaWNhbCB0aGVuIC9eXFxkK1tBLVphLXpdKiQvIGVsc2UgL15cXGQrJC8pKS50ZXN0IHhcblxuICAgICAgICAgICAgbGV4aWNvZ3JhcGhpY2FsID0gb3B0aW9ucyBhbmQgb3B0aW9ucy5sZXhpY29ncmFwaGljYWxcbiAgICAgICAgICAgIHplcm9FeHRlbmQgPSBvcHRpb25zIGFuZCBvcHRpb25zLnplcm9FeHRlbmRcbiAgICAgICAgICAgIHYxcGFydHMgPSB2MS5zcGxpdChcIi5cIilcbiAgICAgICAgICAgIHYycGFydHMgPSB2Mi5zcGxpdChcIi5cIilcblxuICAgICAgICAgICAgcmV0dXJuIE5hTiBpZiBub3QgdjFwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydCkgb3Igbm90IHYycGFydHMuZXZlcnkoaXNWYWxpZFBhcnQpXG5cbiAgICAgICAgICAgIGlmIHplcm9FeHRlbmRcbiAgICAgICAgICAgICAgICB2MXBhcnRzLnB1c2ggXCIwXCIgICAgd2hpbGUgdjFwYXJ0cy5sZW5ndGggPCB2MnBhcnRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIHYycGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MnBhcnRzLmxlbmd0aCA8IHYxcGFydHMubGVuZ3RoXG5cbiAgICAgICAgICAgIHVubGVzcyBsZXhpY29ncmFwaGljYWxcbiAgICAgICAgICAgICAgICB2MXBhcnRzID0gdjFwYXJ0cy5tYXAoTnVtYmVyKVxuICAgICAgICAgICAgICAgIHYycGFydHMgPSB2MnBhcnRzLm1hcChOdW1iZXIpXG5cbiAgICAgICAgICAgIGkgPSAtMVxuICAgICAgICAgICAgd2hpbGUgaSA8IHYxcGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICAgICAgICBpZiB2MnBhcnRzLmxlbmd0aCA8IGlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBpZiB2MXBhcnRzW2ldID09IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYxcGFydHNbaV0gPiB2MnBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgZWxzZSBpZiB2MnBhcnRzW2ldID4gdjFwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcblxuICAgICAgICAgICAgcmV0dXJuIC0xIGlmIHYxcGFydHMubGVuZ3RoICE9IHYycGFydHMubGVuZ3RoXG5cbiAgICAgICAgICAgIHJldHVybiAwXG5cbiAgICAgICAgc3RyaW5nOlxuICAgICAgICAgICAgY2FwaXRhbGl6ZTogKHN0cikgLT5cbiAgICAgICAgICAgICAgICBzdHIgPSAoaWYgbm90IHN0cj8gdGhlbiBcIlwiIGVsc2UgU3RyaW5nKHN0cikpXG4gICAgICAgICAgICAgICAgc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXG5cbiAgICByZXR1cm4gVXRpbHNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTG9nZ2VyKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBsb2dsZXZlbCA9IHJlcXVpcmUoJ2xvZ2xldmVsJylcblxuICAgICMgRXhwb3NlIHRoZSBMb2dnZXIgQVBJXG4gICAgTG9nZ2VyID1cblxuICAgICAgICBzZXRMZXZlbDogKGxldmVsKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuc2V0TGV2ZWwobGV2ZWwpXG5cbiAgICAgICAgdHJhY2U6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC50cmFjZShtc2cpXG5cbiAgICAgICAgZGVidWc6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5kZWJ1Zyhtc2cpXG5cbiAgICAgICAgaW5mbzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmluZm8obXNnKVxuXG4gICAgICAgIHdhcm46IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC53YXJuKG1zZylcblxuICAgICAgICBlcnJvcjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmVycm9yKG1zZylcblxuICAgIHJldHVybiBMb2dnZXJcbikiLCIjIyMqXG4gKiBUaGlzIHdpbGwgcHJvdmlkZSB0aGUgZnVuY3Rpb25hbGl0eSB0byBkZWZpbmUgTW9kdWxlc1xuICogYW5kIHByb3ZpZGUgYSB3YXkgdG8gZXh0ZW5kIHRoZW1cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBNb2R1bGUpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgIyB0aGlzIHdpbGwgc2VydmUgYXMgdGhlIGJhc2UgY2xhc3MgZm9yIGEgTW9kdWxlXG4gICAgY2xhc3MgTW9kdWxlXG4gICAgICAgIGNvbnN0cnVjdG9yOiAob3B0KSAtPlxuICAgICAgICAgICAgQHNhbmRib3ggPSBvcHQuc2FuZGJveFxuICAgICAgICAgICAgQG9wdGlvbnMgPSBvcHQub3B0aW9uc1xuICAgICAgICAgICAgQHNldEVsZW1lbnQoKVxuXG5cbiAgICAjIHRoaXMgY2xhc3Mgd2lsbCBleHBvc2Ugc3RhdGljIG1ldGhvZHMgdG8gYWRkLCBleHRlbmQgYW5kXG4gICAgIyBnZXQgdGhlIGxpc3Qgb2YgYWRkZWQgbW9kdWxlc1xuICAgIGNsYXNzIE1vZHVsZXNcblxuICAgICAgICAjIHRoaXMgd2lsbCBob2xkIHRoZSBsaXN0IG9mIGFkZGVkIG1vZHVsZXNcbiAgICAgICAgQGxpc3QgOiB7fVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICoganVzdCBhbiBhbGlhcyBmb3IgdGhlIGV4dGVuZCBtZXRob2RcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W1N0cmluZ119IG5hbWVcbiAgICAgICAgICogQHBhcmFtICB7W09iamVjdF19IGRlZmluaXRpb25cbiAgICAgICAgIyMjXG4gICAgICAgIEBhZGQgOiAobmFtZSwgZGVmaW5pdGlvbikgLT5cbiAgICAgICAgICAgIEBleHRlbmQobmFtZSwgZGVmaW5pdGlvbiwgTW9kdWxlKVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogZ2V0dGVyIGZvciByZXRyaWV2aW5nIG1vZHVsZXMgZGVmaW5pdGlvbnNcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBuYW1lXG4gICAgICAgICAqIEByZXR1cm4ge1tGdW5jdGlvbi91bmRlZmluZWRdfVxuICAgICAgICAjIyNcbiAgICAgICAgQGdldCA6IChuYW1lKSAtPlxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nKG5hbWUpIGFuZCBAbGlzdFtuYW1lXVxuICAgICAgICAgICAgICAgIHJldHVybiBAbGlzdFtuYW1lXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIHRoaXMgd2lsbCBhbGxvd3MgdXMgdG8gc2ltcGxpZnkgYW5kIGhhdmUgbW9yZSBjb250cm9sXG4gICAgICAgICAqIG92ZXIgYWRkaW5nL2RlZmluaW5nIG1vZHVsZXNcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W1N0cmluZ119IG5hbWVcbiAgICAgICAgICogQHBhcmFtICB7W09iamVjdF19IGRlZmluaXRpb25cbiAgICAgICAgICogQHBhcmFtICB7W1N0cmluZy9GdW5jdGlvbl19IEJhc2VDbGFzc1xuICAgICAgICAjIyNcbiAgICAgICAgQGV4dGVuZCA6IChuYW1lLCBkZWZpbml0aW9uLCBCYXNlQ2xhc3MpIC0+XG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcobmFtZSkgYW5kIEJhc2UudXRpbC5pc09iamVjdChkZWZpbml0aW9uKVxuICAgICAgICAgICAgICAgICMgaWYgbm8gQmFzZUNsYXNzIGlzIHBhc3NlZCwgYnkgZGVmYXVsdCB3ZSdsbCB1c2UgdGhlIE1vZHVsZSBjbGFzc1xuICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gTW9kdWxlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGFyZSBwYXNzaW5nIHRoZSBCYXNlQ2xhc3MgYXMgYSBzdHJpbmcsIGl0IG1lYW5zIHRoYXQgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgIyBzaG91bGQgaGF2ZSBiZWVuIGFkZGVkIHByZXZpb3VzbHksIHNvIHdlJ2xsIGxvb2sgdW5kZXIgdGhlIGxpc3Qgb2JqXG4gICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICMgY2hlY2sgaWYgdGhlIGNsYXNzIGhhcyBiZWVuIGFscmVhZHkgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGJjID0gQGxpc3RbQmFzZUNsYXNzXVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiB0aGUgZGVmaW5pdGlvbiBleGlzdHMsIGxldHMgYXNzaWduIGl0IHRvIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYmNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYXNlQ2xhc3MgPSBiY1xuICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBub3QsIGxldHMgdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSAnW01vZHVsZS8gJysgbmFtZSArJyBdOiBpcyB0cnlpbmcgdG8gZXh0ZW5kIFsnICsgQmFzZUNsYXNzICsgJ10gd2hpY2ggZG9lcyBub3QgZXhpc3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBpdCBpcyBhIGZ1bmN0aW9uLCB3ZSdsbCB1c2UgaXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgIyBUT0RPOiBkbyBzb21lIGNoZWNraW5nIGJlZm9yZSB0cnlpbmcgdG8gdXNlIGl0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlQ2xhc3MgPSBCYXNlQ2xhc3NcblxuICAgICAgICAgICAgICAgIGV4dGVuZGVkQ2xhc3MgPSBleHRlbmQuY2FsbCBCYXNlQ2xhc3MsIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAjIHdlJ2xsIG9ubHkgdHJ5IHRvIGFkZCB0aGlzIGRlZmluaXRpb24gaW4gY2FzZVxuICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaGFzIEBsaXN0LCBuYW1lXG4gICAgICAgICAgICAgICAgICAgICMgZXh0ZW5kcyB0aGUgY3VycmVudCBkZWZpbml0aW9uIHdpdGggdGhlIE1vZHVsZSBjbGFzc1xuICAgICAgICAgICAgICAgICAgICBleHRlbmRlZERlZmluaXRpb24gPSBleHRlbmQuY2FsbCBCYXNlQ2xhc3MsIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyBzdG9yZSB0aGUgcmVmZXJlbmNlIGZvciBsYXRlciB1c2FnZVxuICAgICAgICAgICAgICAgICAgICBAbGlzdFtuYW1lXSA9IGV4dGVuZGVkRGVmaW5pdGlvblxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRlbmRlZERlZmluaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICMgaW5mb3JtIHRoZSBkZXZzIHRoYXQgc29tZW9uZSBpcyB0cnlpbmcgdG8gYWRkIGEgbW9kdWxlJ3NcbiAgICAgICAgICAgICAgICAgICAgIyBkZWZpbml0aW9uIHRoYXQgaGFzIGJlZW4gcHJldmlvdXNseSBhZGRlZFxuICAgICAgICAgICAgICAgICAgICBtc2cgPSAnW0NvbXBvbmVudDonICsgbmFtZSArICddIGhhdmUgYWxyZWFkeSBiZWVuIGRlZmluZWQnIFxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBAXG5cblxuICAgIEJhc2UudXRpbC5leHRlbmQgTW9kdWxlOjosIEJhc2UuRXZlbnRzLFxuXG4gICAgICAgICMgdGhpcyBoYXMgdG8gYmUgb3Zld3JpdHRlbiBieSB0aGUgbW9kdWxlIGRlZmluaXRpb25cbiAgICAgICAgaW5pdGlhbGl6ZTogKCkgLT5cbiAgICAgICAgICAgIG1zZyA9ICdbQ29tcG9uZW50LycgKyBAb3B0aW9ucy5uYW1lICsgJ106JyArICdEb2VzblxcJ3QgaGF2ZSBhbiBpbml0aWFsaXplIG1ldGhvZCBkZWZpbmVkJ1xuICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICBzZXRFbGVtZW50OiAoKSAtPlxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuXG4gICAgICAgICAgICBAZWwgPSBAb3B0aW9ucy5lbFxuICAgICAgICAgICAgQCRlbCA9ICQoQGVsKVxuXG4gICAgICAgICAgICBAZGVsZWdhdGVFdmVudHMoKVxuXG4gICAgICAgIGRlbGVnYXRlRXZlbnRzOiAoZXZlbnRzKSAtPlxuICAgICAgICAgICAgIyByZWdleCB0byBzcGxpdCB0aGUgZXZlbnRzIGtleSAoc2VwYXJhdGVzIHRoZSBldmVudCBmcm9tIHRoZSBzZWxlY3RvcilcbiAgICAgICAgICAgIGRlbGVnYXRlRXZlbnRTcGxpdHRlciA9IC9eKFxcUyspXFxzKiguKikkL1xuXG4gICAgICAgICAgICAjIGlmIHRoZSBldmVudHMgb2JqZWN0IGlzIG5vdCBkZWZpbmVkIG9yIHBhc3NlZCBhcyBhIHBhcmFtZXRlclxuICAgICAgICAgICAgIyB0aGVyZSBpcyBub3RoaW5nIHRvIGRvIGhlcmVcbiAgICAgICAgICAgIHJldHVybiAgICB1bmxlc3MgZXZlbnRzIG9yIChldmVudHMgPSBCYXNlLnV0aWwucmVzdWx0KEAsIFwiZXZlbnRzXCIpKVxuICAgICAgICAgICAgIyBiZWZvcmUgdHJ5aW5nIHRvIGF0dGFjaCBuZXcgZXZlbnRzLCBsZXRzIHJlbW92ZSBhbnkgcHJldmlvdXNcbiAgICAgICAgICAgICMgYXR0YWNoZWQgZXZlbnRcbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICAgICAgZm9yIGtleSBvZiBldmVudHNcbiAgICAgICAgICAgICAgICAjIGdyYWIgdGhlIG1ldGhvZCBuYW1lXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gZXZlbnRzW2tleV1cbiAgICAgICAgICAgICAgICAjIGdyYWIgdGhlIG1ldGhvZCdzIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBtZXRob2QgPSBAW2V2ZW50c1trZXldXSAgICB1bmxlc3MgQmFzZS51dGlsLmlzRnVuY3Rpb24obWV0aG9kKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlICAgIHVubGVzcyBtZXRob2RcbiAgICAgICAgICAgICAgICBtYXRjaCA9IGtleS5tYXRjaChkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIpXG4gICAgICAgICAgICAgICAgQGRlbGVnYXRlIG1hdGNoWzFdLCBtYXRjaFsyXSwgQmFzZS51dGlsLmJpbmQobWV0aG9kLCBAKVxuXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgIGRlbGVnYXRlOiAoZXZlbnROYW1lLCBzZWxlY3RvciwgbGlzdGVuZXIpIC0+XG4gICAgICAgICAgICBAJGVsLm9uIGV2ZW50TmFtZSArIFwiLnBlc3RsZUV2ZW50XCIgKyBAb3B0aW9ucy5ndWlkLCBzZWxlY3RvciwgbGlzdGVuZXJcbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgdW5kZWxlZ2F0ZUV2ZW50czogKCkgLT5cbiAgICAgICAgICAgIEAkZWwub2ZmKCcucGVzdGxlRXZlbnQnICsgQG9wdGlvbnMuZ3VpZCkgICAgaWYgQCRlbFxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICAjIGJ5IGRlZmF1bHQsIGl0IHdpbGwgcmVtb3ZlIGV2ZW50bGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlXG4gICAgICAgICMgJGVsIGZyb20gdGhlIERPTVxuICAgICAgICBzdG9wOiAoKSAtPlxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuICAgICAgICAgICAgQCRlbC5yZW1vdmUoKSBpZiBAJGVsXG5cbiAgICAjIEhlbHBlcnNcbiAgICBleHRlbmQgPSAocHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIC0+XG4gICAgICAgIHBhcmVudCA9IEBcblxuICAgICAgICAjIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIG5ldyBzdWJjbGFzcyBpcyBlaXRoZXIgZGVmaW5lZCBieSB5b3VcbiAgICAgICAgIyAodGhlIFwiY29uc3RydWN0b3JcIiBwcm9wZXJ0eSBpbiB5b3VyIGBleHRlbmRgIGRlZmluaXRpb24pLCBvciBkZWZhdWx0ZWRcbiAgICAgICAgIyBieSB1cyB0byBzaW1wbHkgY2FsbCB0aGUgcGFyZW50J3MgY29uc3RydWN0b3JcbiAgICAgICAgaWYgcHJvdG9Qcm9wcyBhbmQgQmFzZS51dGlsLmhhcyhwcm90b1Byb3BzLCBcImNvbnN0cnVjdG9yXCIpXG4gICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hpbGQgPSAtPlxuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBseSBALCBhcmd1bWVudHNcblxuICAgICAgICAjIEFkZCBzdGF0aWMgcHJvcGVydGllcyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24sIGlmIHN1cHBsaWVkLlxuICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzXG5cbiAgICAgICAgIyBTZXQgdGhlIHByb3RvdHlwZSBjaGFpbiB0byBpbmhlcml0IGZyb20gYHBhcmVudGAsIHdpdGhvdXQgY2FsbGluZ1xuICAgICAgICAjIGBwYXJlbnRgJ3MgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAgICAgIFN1cnJvZ2F0ZSA9IC0+XG4gICAgICAgICAgICBAY29uc3RydWN0b3IgPSBjaGlsZFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgU3Vycm9nYXRlOjogPSBwYXJlbnQ6OlxuICAgICAgICBjaGlsZDo6ID0gbmV3IFN1cnJvZ2F0ZVxuXG4gICAgICAgICMgQWRkIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChpbnN0YW5jZSBwcm9wZXJ0aWVzKSB0byB0aGUgc3ViY2xhc3MsXG4gICAgICAgICMgaWYgc3VwcGxpZWQuXG4gICAgICAgIEJhc2UudXRpbC5leHRlbmQgY2hpbGQ6OiwgcHJvdG9Qcm9wcyAgICBpZiBwcm90b1Byb3BzXG5cbiAgICAgICAgIyBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgaW5pdGlhbGl6ZSBtZXRob2Qgc28gaXQgY2FuIGJlIGNhbGxlZFxuICAgICAgICAjIGZyb20gaXRzIGNoaWxkc1xuICAgICAgICBjaGlsZDo6X3N1cGVyXyA9IHBhcmVudDo6aW5pdGlhbGl6ZVxuXG4gICAgICAgIHJldHVybiBjaGlsZFxuXG4gICAgIyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgYmFzZSBjbGFzcyBmb3IgbW9kdWxlc1xuICAgIE1vZHVsZXMuTW9kdWxlID0gTW9kdWxlXG5cbiAgICByZXR1cm4gTW9kdWxlc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWZXJzaW9uQ2hlY2tlcikgLT5cblxuICAgIGxvZyA9IHJlcXVpcmUgJy4vbG9nZ2VyLmNvZmZlZSdcbiAgICBVdGlscyA9IHJlcXVpcmUgJy4vZ2VuZXJhbC5jb2ZmZWUnXG5cbiAgICAjIEV4cG9zZSBWZXJzaW9uQ2hlY2tlciBBUElcbiAgICBWZXJzaW9uQ2hlY2tlciA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRvIGNoZWNrIHZlcnNpb25pbmcgZm9yIGFsbCB0aGUgZGVmaW5lZCBsaWJyYXJpZXNcbiAgICAgICAgICogd2l0aGluIHRoZSBkZXBlbmRlbmN5IGFycmF5XG4gICAgICAgICMjI1xuICAgICAgICBjaGVjazogKGRlcGVuZGVuY2llcykgLT5cblxuICAgICAgICAgICAgaWYgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIGRwID0gZGVwZW5kZW5jaWVzLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgIHVubGVzcyBkcC5vYmpcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gZHAubmFtZSArIFwiIGlzIGEgaGFyZCBkZXBlbmRlbmN5IGFuZCBpdCBoYXMgdG8gYmUgbG9hZGVkIGJlZm9yZSBwZXN0bGUuanNcIlxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICAjIGNvbXBhcmUgdGhlIHZlcnNpb25cbiAgICAgICAgICAgICAgICB1bmxlc3MgVXRpbHMudmVyc2lvbkNvbXBhcmUoZHAudmVyc2lvbiwgZHAucmVxdWlyZWQpID49IDBcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBlbnRlciBoZXJlIGl0IG1lYW5zIHRoZSBsb2FkZWQgbGlicmFyeSBkb2VzdCBub3QgZnVsZmlsbCBvdXIgbmVlZHNcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gXCJbRkFJTF0gXCIgKyBkcC5uYW1lICsgXCI6IHZlcnNpb24gcmVxdWlyZWQ6IFwiICsgZHAucmVxdWlyZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiA8LS0+IExvYWRlZCB2ZXJzaW9uOiBcIiArIGRwLnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAgICAgVmVyc2lvbkNoZWNrZXIuY2hlY2soZGVwZW5kZW5jaWVzKVxuXG5cbiAgICByZXR1cm4gVmVyc2lvbkNoZWNrZXJcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVmlld3BvcnQpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIHZpZXdwb3J0ID0gcmVxdWlyZSgndmVyZ2UnKVxuXG4gICAgIyBFeHBvc2UgVmlld3BvcnQgZGV0ZWN0aW9uIEFQSVxuICAgIFZpZXdwb3J0ID1cblxuICAgICAgICB2aWV3cG9ydFc6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydFcoKVxuXG4gICAgICAgIHZpZXdwb3J0SDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0SCgpXG5cbiAgICAgICAgdmlld3BvcnQ6IChrZXkpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydCgpXG5cbiAgICAgICAgaW5WaWV3cG9ydDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5WaWV3cG9ydChlbCwgY3VzaGlvbilcblxuICAgICAgICBpblg6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluWChlbCwgY3VzaGlvbilcblxuICAgICAgICBpblk6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluWShlbCwgY3VzaGlvbilcblxuICAgICAgICBzY3JvbGxYOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWCgpXG5cbiAgICAgICAgc2Nyb2xsWTogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnNjcm9sbFkoKVxuXG4gICAgICAgICMgVG8gdGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZVxuICAgICAgICBtcTogKG1lZGlhUXVlcnlTdHJpbmcpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5tcShtZWRpYVF1ZXJ5U3RyaW5nKVxuXG4gICAgICAgIHJlY3RhbmdsZTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQucmVjdGFuZ2xlKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgICMgaWYgbm8gYXJndW1lbnQgaXMgcGFzc2VkLCB0aGVuIGl0IHJldHVybnMgdGhlIGFzcGVjdFxuICAgICAgICAjIHJhdGlvIG9mIHRoZSB2aWV3cG9ydC4gSWYgYW4gZWxlbWVudCBpcyBwYXNzZWQgaXQgcmV0dXJuc1xuICAgICAgICAjIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgYXNwZWN0OiAobykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmFzcGVjdChvKVxuXG4gICAgcmV0dXJuIFZpZXdwb3J0XG4pIl19
