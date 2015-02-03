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



},{"./base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee","./extension/components.coffee":"/home/dirigaray/projects/pestle/src/extension/components.coffee","./extension/responsivedesign.coffee":"/home/dirigaray/projects/pestle/src/extension/responsivedesign.coffee","./extension/responsiveimages.coffee":"/home/dirigaray/projects/pestle/src/extension/responsiveimages.coffee","./util/extmanager.coffee":"/home/dirigaray/projects/pestle/src/util/extmanager.coffee","./util/module.coffee":"/home/dirigaray/projects/pestle/src/util/module.coffee"}],"/home/dirigaray/projects/pestle/node_modules/cookies-js/src/cookies.js":[function(_dereq_,module,exports){
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
},{}],"/home/dirigaray/projects/pestle/node_modules/imager.js/Imager.js":[function(_dereq_,module,exports){
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
            .replace(/\.(jpg|gif|bmp|png)[^s]?({width})?[^s]({pixel_ratio})?/gi, '.' + this.adaptSelector + '.$2.$3' + squareSelector + '.$1');
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
},{}],"/home/dirigaray/projects/pestle/node_modules/ismobilejs/isMobile.js":[function(_dereq_,module,exports){
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

},{}],"/home/dirigaray/projects/pestle/node_modules/loglevel/lib/loglevel.js":[function(_dereq_,module,exports){
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

},{}],"/home/dirigaray/projects/pestle/node_modules/verge/verge.js":[function(_dereq_,module,exports){
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
},{}],"/home/dirigaray/projects/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js":[function(_dereq_,module,exports){
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
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

},{}],"/home/dirigaray/projects/pestle/src/base.coffee":[function(_dereq_,module,exports){

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



},{"./util/cookies.coffee":"/home/dirigaray/projects/pestle/src/util/cookies.coffee","./util/devicedetection.coffee":"/home/dirigaray/projects/pestle/src/util/devicedetection.coffee","./util/eventbus.coffee":"/home/dirigaray/projects/pestle/src/util/eventbus.coffee","./util/general.coffee":"/home/dirigaray/projects/pestle/src/util/general.coffee","./util/logger.coffee":"/home/dirigaray/projects/pestle/src/util/logger.coffee","./util/versionchecker.coffee":"/home/dirigaray/projects/pestle/src/util/versionchecker.coffee","./util/viewportdetection.coffee":"/home/dirigaray/projects/pestle/src/util/viewportdetection.coffee","imager.js":"/home/dirigaray/projects/pestle/node_modules/imager.js/Imager.js"}],"/home/dirigaray/projects/pestle/src/extension/components.coffee":[function(_dereq_,module,exports){
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



},{"./../base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee","./../util/module.coffee":"/home/dirigaray/projects/pestle/src/util/module.coffee"}],"/home/dirigaray/projects/pestle/src/extension/responsivedesign.coffee":[function(_dereq_,module,exports){

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



},{"./../base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee"}],"/home/dirigaray/projects/pestle/src/extension/responsiveimages.coffee":[function(_dereq_,module,exports){

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



},{"./../base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee"}],"/home/dirigaray/projects/pestle/src/util/cookies.coffee":[function(_dereq_,module,exports){
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



},{"cookies-js":"/home/dirigaray/projects/pestle/node_modules/cookies-js/src/cookies.js"}],"/home/dirigaray/projects/pestle/src/util/devicedetection.coffee":[function(_dereq_,module,exports){
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



},{"ismobilejs":"/home/dirigaray/projects/pestle/node_modules/ismobilejs/isMobile.js"}],"/home/dirigaray/projects/pestle/src/util/eventbus.coffee":[function(_dereq_,module,exports){
var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

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



},{"wolfy87-eventemitter":"/home/dirigaray/projects/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js"}],"/home/dirigaray/projects/pestle/src/util/extmanager.coffee":[function(_dereq_,module,exports){

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



},{"../base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee"}],"/home/dirigaray/projects/pestle/src/util/general.coffee":[function(_dereq_,module,exports){
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



},{}],"/home/dirigaray/projects/pestle/src/util/logger.coffee":[function(_dereq_,module,exports){
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



},{"loglevel":"/home/dirigaray/projects/pestle/node_modules/loglevel/lib/loglevel.js"}],"/home/dirigaray/projects/pestle/src/util/module.coffee":[function(_dereq_,module,exports){

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



},{"../base.coffee":"/home/dirigaray/projects/pestle/src/base.coffee"}],"/home/dirigaray/projects/pestle/src/util/versionchecker.coffee":[function(_dereq_,module,exports){
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



},{"./general.coffee":"/home/dirigaray/projects/pestle/src/util/general.coffee","./logger.coffee":"/home/dirigaray/projects/pestle/src/util/logger.coffee"}],"/home/dirigaray/projects/pestle/src/util/viewportdetection.coffee":[function(_dereq_,module,exports){
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



},{"verge":"/home/dirigaray/projects/pestle/node_modules/verge/verge.js"}]},{},["./src/core.coffee"])("./src/core.coffee")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9jb29raWVzLWpzL3NyYy9jb29raWVzLmpzIiwibm9kZV9tb2R1bGVzL2ltYWdlci5qcy9JbWFnZXIuanMiLCJub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJub2RlX21vZHVsZXMvdmVyZ2UvdmVyZ2UuanMiLCJub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V4dG1hbmFnZXIuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9nZW5lcmFsLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbW9kdWxlLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVBRmxDO0FBQUEsQ0FBRCxDQUFBLENBSUUsTUFKRixFQUlVLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUVOLE1BQUEsZ0JBQUE7QUFBQSxFQUFBLElBQUEsR0FBYSxPQUFBLENBQVMsZUFBVCxDQUFiLENBQUE7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVMsMEJBQVQsQ0FEYixDQUFBO0FBQUEsRUFJQSxNQUFBLEdBQWEsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSmIsQ0FBQTtBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFTLHNCQUFULENBTmhCLENBQUE7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBVGpCLENBQUE7QUFBQSxFQVdNLE1BQU0sQ0FBQztBQUVULG1CQUFBLE9BQUEsR0FBVSxPQUFWLENBQUE7O0FBQUEsbUJBRUEsR0FBQSxHQUNJO0FBQUEsTUFBQSxLQUFBLEVBQ0k7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFWO09BREo7QUFBQSxNQUdBLFNBQUEsRUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGRBO0FBQUE7Ozs7O0dBQUE7QUFBQSxDQU1DLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtT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ZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyMqXG4gKiBUaGUgY29yZSBsYXllciB3aWxsIGRlcGVuZCBvbiB0aGUgYmFzZSBsYXllciBhbmQgd2lsbCBwcm92aWRlXG4gKiB0aGUgY29yZSBzZXQgb2YgZnVuY3Rpb25hbGl0eSB0byBhcHBsaWNhdGlvbiBmcmFtZXdvcmtcbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5QZXN0bGUgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFBlc3RsZSkgLT5cblxuICAgIEJhc2UgICAgICAgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcbiAgICBFeHRNYW5hZ2VyID0gcmVxdWlyZSgnLi91dGlsL2V4dG1hbmFnZXIuY29mZmVlJylcblxuICAgICMgd2UnbGwgdXNlIHRoZSBQZXN0bGUgb2JqZWN0IGFzIHRoZSBnbG9iYWwgRXZlbnQgYnVzXG4gICAgUGVzdGxlID0gbmV3IEJhc2UuRXZlbnRzKClcblxuICAgIFBlc3RsZS5Nb2R1bGUgPSByZXF1aXJlKCcuL3V0aWwvbW9kdWxlLmNvZmZlZScpXG5cbiAgICAjIE5hbWVzcGFjZSBmb3IgbW9kdWxlIGRlZmluaXRpb25cbiAgICBQZXN0bGUubW9kdWxlcyA9IHt9XG5cbiAgICBjbGFzcyBQZXN0bGUuQ29yZVxuICAgICAgICAjIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeVxuICAgICAgICB2ZXJzaW9uOiBcIjAuMC4xXCJcblxuICAgICAgICBjZmc6XG4gICAgICAgICAgICBkZWJ1ZzpcbiAgICAgICAgICAgICAgICBsb2dMZXZlbDogNSAjIGJ5IGRlZmF1bHQgdGhlIGxvZ2dpbmcgd2lsbCBiZSBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdmFsdWVzIGNhbiBnbyBmcm9tIDAgdG8gNSAoNSBtZWFucyBkaXNhYmxlZClcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ3BsYXRmb3JtJ1xuXG4gICAgICAgICAgICBleHRlbnNpb246IHt9ICMgZGVmaW5lIHRoZSBuYW1lc3BhY2UgdG8gZGVmaW5lIGV4dGVuc2lvbiBzcGVjaWZpYyBzZXR0aW5nc1xuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG4gICAgICAgICAgICAjIGluaXRpYWxpemUgdGhlIGNvbmZpZyBvYmplY3RcbiAgICAgICAgICAgIEBzZXRDb25maWcoY29uZmlnKVxuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFRoZSBleHRlbnNpb24gbWFuYWdlciB3aWxsIGJlIG9uIGNoYXJnZSBvZiBsb2FkaW5nIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICMgYW5kIG1ha2UgaXRzIGZ1bmN0aW9uYWxpdHkgYXZhaWxhYmxlIHRvIHRoZSBzdGFja1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIgPSBuZXcgRXh0TWFuYWdlcigpXG5cbiAgICAgICAgICAgICMgdGhyb3VnaCB0aGlzIG9iamVjdCB0aGUgbW9kdWxlcyB3aWxsIGJlIGFjY2VzaW5nIHRoZSBtZXRob2RzIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gQmFzZS51dGlsLmNsb25lIEJhc2VcblxuICAgICAgICAgICAgIyBuYW1lc3BhY2UgdG8gaG9sZCBhbGwgdGhlIHNhbmRib3hlc1xuICAgICAgICAgICAgQHNhbmRib3hlcyA9IHt9XG5cbiAgICAgICAgICAgICMgUmVxdWlyZSBjb3JlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZScpXG4gICAgICAgICAgICBSZXNwb25zaXZlRGVzaWduID0gcmVxdWlyZSgnLi9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZUltYWdlcyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVpbWFnZXMuY29mZmVlJylcblxuICAgICAgICAgICAgIyBBZGQgY29yZSBleHRlbnNpb25zIHRvIHRoZSBhcHBcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChDb21wb25lbnRzKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVEZXNpZ24pXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoUmVzcG9uc2l2ZUltYWdlcylcblxuICAgICAgICBhZGRFeHRlbnNpb246IChleHQpIC0+XG4gICAgICAgICAgICAjIHdlJ2xsIG9ubHkgYWxsb3cgdG8gYWRkIG5ldyBleHRlbnNpb25zIGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgQ29yZSBnZXQgc3RhcnRlZFxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKGV4dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4gWW91IGNhbiBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG5vdCBhZGQgZXh0ZW5zaW9ucyB3aGVuIHRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4nKVxuXG4gICAgICAgICMgcHJvdmlkZXMgYSB3YXkgZm9yIHNldHRpbmcgdXAgY29uZmlnc1xuICAgICAgICAjIGFmdGVyIFBlc3RsZSBoYXMgYmVlbiBpbnN0YW50aWF0ZWRcbiAgICAgICAgc2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzT2JqZWN0IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUgaXQgbWVhbnMgUGVzdGxlIGhhcyBiZWVuIGFscmVhZHkgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAgICAgIyBkdXJpbmcgaW5zdGFudGlhdGlvbiwgc28gd2UnbGwgdXNlIHRoZSBjb25maWcgb2JqZWN0IGFzIGFcbiAgICAgICAgICAgICAgICAgICAgIyBwcm92aWRlciBmb3IgZGVmYXVsdCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRW1wdHkgQGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyBjb25maWcsIEBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBpdCBpcyBlbXB0eSwgaXQgbWVhbnMgd2UgYXJlIGdvaW5nIHNldHRpbmcgdXAgUGVzdGxlIGZvclxuICAgICAgICAgICAgICAgICAgICAjIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMgY29uZmlnLCBAY2ZnXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIltzZXRDb25maWcgbWV0aG9kXSBvbmx5IGFjY2VwdCBhbiBvYmplY3QgYXMgYSBwYXJhbWV0ZXIgYW5kIHlvdSdyZSBwYXNzaW5nOiBcIiArIHR5cGVvZiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IobXNnKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKFwiVGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLiBZb3UgY2FuIG5vdCBhZGQgbmV3IGV4dGVuc2lvbnMgYXQgdGhpcyBwb2ludC5cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChzZWxlY3RvciA9ICcnKSAtPlxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgbGV0IHVzIGluaXRpYWxpemUgY29tcG9uZW50cyBhdCBhIGxhdGVyIHN0YWdlXG4gICAgICAgICAgICBpZiBAc3RhcnRlZCBhbmQgc2VsZWN0b3IgaXNudCAnJ1xuXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlBlc3RsZSBpcyBpbml0aWFsaXppbmcgYSBjb21wb25lbnRcIilcblxuICAgICAgICAgICAgICAgIEBzYW5kYm94LnN0YXJ0Q29tcG9uZW50cyBzZWxlY3RvciwgQFxuXG5cbiAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSwgaXQgbWVhbnMgaXQgaXMgdGhlIGZpc3QgdGltZSB0aGUgc3RhcnRcbiAgICAgICAgICAgICMgbWV0aG9kIGlzIGNhbGxlZCBhbmQgd2UnbGwgaGF2ZSB0byBpbml0aWFsaXplIGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlBlc3RsZSBzdGFydGVkIHRoZSBpbml0aWFsaXppbmcgcHJvY2Vzc1wiKVxuXG4gICAgICAgICAgICAgICAgQHN0YXJ0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAjIEluaXQgYWxsIHRoZSBleHRlbnNpb25zXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAgICAgIyBDYWxsYmFjayBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZFxuICAgICAgICAgICAgICAgICMgYWZ0ZXIgYWxsIGV4dGVuc2lvbnMgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYW5kIHRoZSBlYWNoIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgICAgICMgbWV0aG9kIGV4ZWN1dGVkXG4gICAgICAgICAgICAgICAgY2IgPSAkLkNhbGxiYWNrcyBcInVuaXF1ZSBtZW1vcnlcIlxuXG4gICAgICAgICAgICAgICAgIyBPbmNlIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBpbml0aWFsaXplZCwgbGV0cyBjYWxsIHRoZSBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAjIGZyb20gZWFjaCBleHRlbnNpb25cbiAgICAgICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICAgICAjICAgICAgIG9uY2UgdGhlIGFwcCBoYXMgc3RhcnRlZC5cbiAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAZXh0TWFuYWdlci5nZXRJbml0aWFsaXplZEV4dGVuc2lvbnMoKSwgKGV4dCwgaSkgPT5cblxuICAgICAgICAgICAgICAgICAgICBpZiBleHRcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24oZXh0LmFmdGVyQXBwU3RhcnRlZCkgYW5kIGV4dC5hY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHNpbmNlIHRoZSBjb21wb25lbnQgZXh0ZW5zaW9uIGlzIHRoZSBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZm9yIGluaXRpYWxpemluZyB0aGUgYXBwLCB3ZSdsbCBnaXZlIGl0IHNwZWNpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRyZWF0bWVudCBhbmQgZ2l2ZSBpdCB0aGUgYWJpbGl0eSB0byByZWNlaXZlIGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBleHRyYSBwYXJhbWV0ZXIgKHRvIHN0YXJ0IGNvbXBvbmVudHMgdGhhdCBvbmx5IGJlbG9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdG8gYSBwYXJ0aWN1bGFyIERPTSBlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGV4dC5vcHRpb25LZXkgaXMgXCJjb21wb25lbnRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZCBzZWxlY3RvciwgQFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZChAKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbihleHQuYWZ0ZXJBcHBJbml0aWFsaXplZCkgYW5kIGV4dC5hY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5hZGQgZXh0LmFmdGVyQXBwSW5pdGlhbGl6ZWRcblxuICAgICAgICAgICAgICAgICMgQ2FsbCB0aGUgLmFmdGVyQXBwSW5pdGlhbGl6ZWQgY2FsbGJhY2tzIHdpdGggQCBhcyBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICBjYi5maXJlIEBcblxuICAgICAgICBjcmVhdGVTYW5kYm94OiAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ZXNbbmFtZV0gPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAc2FuZGJveCwgbmFtZSA6IG5hbWVcblxuICAgICAgICBnZXRJbml0aWFsaXplZENvbXBvbmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAc2FuZGJveC5nZXRJbml0aWFsaXplZENvbXBvbmVudHMoKVxuXG5cbiAgICByZXR1cm4gUGVzdGxlXG4pXG4iLCIvKlxyXG4gKiBDb29raWVzLmpzIC0gMS4xLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1Njb3R0SGFtcGVyL0Nvb2tpZXNcclxuICpcclxuICogVGhpcyBpcyBmcmVlIGFuZCB1bmVuY3VtYmVyZWQgc29mdHdhcmUgcmVsZWFzZWQgaW50byB0aGUgcHVibGljIGRvbWFpbi5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVzLmpzIHJlcXVpcmVzIGEgYHdpbmRvd2Agd2l0aCBhIGBkb2N1bWVudGAgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQ29va2llcyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cclxuICAgICAgICAgICAgICAgIENvb2tpZXMuZ2V0KGtleSkgOiBDb29raWVzLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xyXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAvLyBVc2VkIHRvIGVuc3VyZSBjb29raWUga2V5cyBkbyBub3QgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgLy8gYnVpbHQtaW4gYE9iamVjdGAgcHJvcGVydGllc1xyXG4gICAgICAgIENvb2tpZXMuX2NhY2hlS2V5UHJlZml4ID0gJ2Nvb2tleS4nOyAvLyBIdXJyIGh1cnIsIDopXHJcblxyXG4gICAgICAgIENvb2tpZXMuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgIT09IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5fY2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBrZXldO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcclxuXHJcbiAgICAgICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcclxuICAgICAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9pc1ZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAhaXNOYU4oZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xyXG4gICAgICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgZXhwaXJlcykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzogZXhwaXJlcyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzogZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGlyZXMgJiYgIUNvb2tpZXMuX2lzVmFsaWREYXRlKGV4cGlyZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BleHBpcmVzYCBwYXJhbWV0ZXIgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHZhbGlkIERhdGUgaW5zdGFuY2UnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XHJcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb29raWVTdHJpbmcgPSBrZXkgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMucGF0aCA/ICc7cGF0aD0nICsgb3B0aW9ucy5wYXRoIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmRvbWFpbiA/ICc7ZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbiA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5leHBpcmVzID8gJztleHBpcmVzPScgKyBvcHRpb25zLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5zZWN1cmUgPyAnO3NlY3VyZScgOiAnJztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVTdHJpbmc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0Q2FjaGVGcm9tU3RyaW5nID0gZnVuY3Rpb24gKGRvY3VtZW50Q29va2llKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVDYWNoZSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgY29va2llc0FycmF5ID0gZG9jdW1lbnRDb29raWUgPyBkb2N1bWVudENvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPSBjb29raWVLdnAudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVDYWNoZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGNvb2tpZVN0cmluZykge1xyXG4gICAgICAgICAgICAvLyBcIj1cIiBpcyBhIHZhbGlkIGNoYXJhY3RlciBpbiBhIGNvb2tpZSB2YWx1ZSBhY2NvcmRpbmcgdG8gUkZDNjI2NSwgc28gY2Fubm90IGBzcGxpdCgnPScpYFxyXG4gICAgICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBjb29raWVTdHJpbmcuaW5kZXhPZignPScpO1xyXG5cclxuICAgICAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcclxuICAgICAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cigwLCBzZXBhcmF0b3JJbmRleCkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29va2llc0V4cG9ydCA9IHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnID8gZmFjdG9yeShnbG9iYWwpIDogZmFjdG9yeTtcclxuXHJcbiAgICAvLyBBTUQgc3VwcG9ydFxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb29raWVzRXhwb3J0OyB9KTtcclxuICAgIC8vIENvbW1vbkpTL05vZGUuanMgc3VwcG9ydFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29va2llc0V4cG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpOyIsIjtcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZGVmYXVsdFdpZHRocywgZ2V0S2V5cywgbmV4dFRpY2ssIGFkZEV2ZW50LCBnZXROYXR1cmFsV2lkdGg7XG5cbiAgICBuZXh0VGljayA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYXBwbHlFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrRWFjaCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIG5ld19jb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb25baV0gPSBjYWxsYmFja0VhY2goY29sbGVjdGlvbltpXSwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3X2NvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0dXJuRGlyZWN0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldE5hdHVyYWxXaWR0aCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSwgJ25hdHVyYWxXaWR0aCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRTggYW5kIGJlbG93IGxhY2tzIHRoZSBuYXR1cmFsV2lkdGggcHJvcGVydHlcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNvdXJjZS5zcmM7XG4gICAgICAgICAgICByZXR1cm4gaW1nLndpZHRoO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBhZGRFdmVudCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhZGRTdGFuZGFyZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZElFRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBmbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIGRlZmF1bHRXaWR0aHMgPSBbOTYsIDEzMCwgMTY1LCAyMDAsIDIzNSwgMjcwLCAzMDQsIDM0MCwgMzc1LCA0MTAsIDQ0NSwgNDg1LCA1MjAsIDU1NSwgNTkwLCA2MjUsIDY2MCwgNjk1LCA3MzZdO1xuXG4gICAgZ2V0S2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5rZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIG5ldyBJbWFnZXIgaW5zdGFuY2UsIHBhc3NpbmcgYW4gb3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QuXG5cbiAgICAgICAgRXhhbXBsZSB1c2FnZTpcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEF2YWlsYWJsZSB3aWR0aHMgZm9yIHlvdXIgaW1hZ2VzXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbTnVtYmVyXSxcblxuICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yIHRvIGJlIHVzZWQgdG8gbG9jYXRlIHlvdXIgZGl2IHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnJyxcblxuICAgICAgICAgICAgICAgIC8vIENsYXNzIG5hbWUgdG8gZ2l2ZSB5b3VyIHJlc2l6YWJsZSBpbWFnZXNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gSWYgc2V0IHRvIHRydWUsIEltYWdlciB3aWxsIHVwZGF0ZSB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgcmVsZXZhbnQgaW1hZ2VzXG4gICAgICAgICAgICAgICAgb25SZXNpemU6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBUb2dnbGUgdGhlIGxhenkgbG9hZCBmdW5jdGlvbmFsaXR5IG9uIG9yIG9mZlxuICAgICAgICAgICAgICAgIGxhenlsb2FkOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAgICAgLy8gVXNlZCBhbG9uZ3NpZGUgdGhlIGxhenlsb2FkIGZlYXR1cmUgKGhlbHBzIHBlcmZvcm1hbmNlIGJ5IHNldHRpbmcgYSBoaWdoZXIgZGVsYXkpXG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsYXk6IE51bWJlclxuICAgICAgICAgICAgfVxuXG4gICAgICAgIEBwYXJhbSB7b2JqZWN0fSBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAgICAgIEByZXR1cm4ge29iamVjdH0gaW5zdGFuY2Ugb2YgSW1hZ2VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gSW1hZ2VyKGVsZW1lbnRzLCBvcHRzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGRvYyA9IGRvY3VtZW50O1xuXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICAgIGlmIChlbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyBzZWxlY3RvciBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5zZWxlY3RvciA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyB0aGUgYG9wdHNgIG9iamVjdCwgYGVsZW1lbnRzYCBpcyBpbXBsaWNpdGx5IHRoZSBgb3B0cy5zZWxlY3RvcmAgc3RyaW5nXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudHMubGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wdHMgPSBlbGVtZW50cztcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuID0gW107XG4gICAgICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG9wdHMuc2VsZWN0b3IgfHwgJy5kZWxheWVkLWltYWdlLWxvYWQnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdHMuY2xhc3NOYW1lIHx8ICdpbWFnZS1yZXBsYWNlJztcbiAgICAgICAgdGhpcy5naWYgPSBkb2MuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIHRoaXMuZ2lmLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhFQUFKQUlBQUFQLy8vd0FBQUNINUJBRUFBQUFBTEFBQUFBQVFBQWtBQUFJS2hJK3B5KzBQbzV5VUZRQTcnO1xuICAgICAgICB0aGlzLmdpZi5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgdGhpcy5naWYuYWx0ID0gJyc7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGVsYXkgPSBvcHRzLnNjcm9sbERlbGF5IHx8IDI1MDtcbiAgICAgICAgdGhpcy5vblJlc2l6ZSA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ29uUmVzaXplJykgPyBvcHRzLm9uUmVzaXplIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXp5bG9hZCA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ2xhenlsb2FkJykgPyBvcHRzLmxhenlsb2FkIDogZmFsc2U7XG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyA9IG9wdHMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MgfHwgWzEsIDJdO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IG9wdHMuYXZhaWxhYmxlV2lkdGhzIHx8IGRlZmF1bHRXaWR0aHM7XG4gICAgICAgIHRoaXMub25JbWFnZXNSZXBsYWNlZCA9IG9wdHMub25JbWFnZXNSZXBsYWNlZCB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLndpZHRoc01hcCA9IHt9O1xuICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG4gICAgICAgIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IgPSBvcHRzLndpZHRoSW50ZXJwb2xhdG9yIHx8IHJldHVybkRpcmVjdFZhbHVlO1xuICAgICAgICB0aGlzLmRlbHRhU3F1YXJlID0gb3B0cy5kZWx0YVNxdWFyZSB8fCAxLjU7XG4gICAgICAgIHRoaXMuc3F1YXJlU2VsZWN0b3IgPSBvcHRzLnNxdWFyZVNlbGVjdG9yIHx8ICdzcXJjcm9wJztcbiAgICAgICAgdGhpcy5hZGFwdFNlbGVjdG9yID0gdGhpcy5hZGFwdFNlbGVjdG9yIHx8ICdhZGFwdCc7XG5cbiAgICAgICAgLy8gTmVlZGVkIGFzIElFOCBhZGRzIGEgZGVmYXVsdCBgd2lkdGhgL2BoZWlnaHRgIGF0dHJpYnV0ZeKAplxuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocy5sZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwKHRoaXMuYXZhaWxhYmxlV2lkdGhzLCB0aGlzLndpZHRoSW50ZXJwb2xhdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSB0aGlzLmF2YWlsYWJsZVdpZHRocztcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IGdldEtleXModGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGVsZW1lbnRzLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IGFwcGx5RWFjaChkb2MucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKSwgcmV0dXJuRGlyZWN0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuXG4gICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEltYWdlci5wcm90b3R5cGUuc2Nyb2xsQ2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IHRoaXMuaW1hZ2VzT2ZmU2NyZWVuLnNsaWNlKDApOyAvLyBjb3B5IGJ5IHZhbHVlLCBkb24ndCBjb3B5IGJ5IHJlZmVyZW5jZVxuICAgICAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHRoaXMuZGl2cyk7XG5cbiAgICAgICAgaWYgKHRoaXMub25SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJSZXNpemVFdmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eWxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJTY3JvbGxFdmVudCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY3JlYXRlR2lmID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGEgcmVzcG9uc2l2ZSBpbWFnZSB0aGVuIHdlIGRvbid0IHJlcGxhY2UgaXQgYWdhaW5cbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhefCApJyArIHRoaXMuY2xhc3NOYW1lICsgJyggfCQpJykpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtZW50Q2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnKTtcbiAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJyk7XG4gICAgICAgIHZhciBnaWYgPSB0aGlzLmdpZi5jbG9uZU5vZGUoZmFsc2UpO1xuXG4gICAgICAgIGlmIChlbGVtZW50V2lkdGgpIHtcbiAgICAgICAgICAgIGdpZi53aWR0aCA9IGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnLCBlbGVtZW50V2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2lmLmNsYXNzTmFtZSA9IChlbGVtZW50Q2xhc3NOYW1lID8gZWxlbWVudENsYXNzTmFtZSArICcgJyA6ICcnKSArIHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnYWx0JywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWx0JykgfHwgdGhpcy5naWYuYWx0KTtcblxuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGdpZiwgZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGdpZjtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgYXBwbHlFYWNoKHRoaXMuZGl2cywgZnVuY3Rpb24oZWxlbWVudCwgaSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGF6eWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1RoaXNFbGVtZW50T25TY3JlZW4oZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbWFnZXNPZmZTY3JlZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZGl2c1tpXSA9IHNlbGYuY3JlYXRlR2lmKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmlzVGhpc0VsZW1lbnRPblNjcmVlbiA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3Agd2FzIHdvcmtpbmcgaW4gQ2hyb21lIGJ1dCBkaWRuJ3Qgd29yayBvbiBGaXJlZm94LCBzbyBoYWQgdG8gcmVzb3J0IHRvIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAvLyBidXQgY2FuJ3QgZmFsbGJhY2sgdG8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgYXMgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUUgd2l0aCBhIGRvY3R5cGUgKD8pIHNvIGhhdmUgdG8gdXNlIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgdmFyIG9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0KCk7XG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0VG9wID0gMDtcblxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRPZmZzZXRUb3AgPCAodGhpcy52aWV3cG9ydEhlaWdodCArIG9mZnNldCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyA9IGZ1bmN0aW9uKGltYWdlcykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG5cbiAgICAgICAgICAgIGFwcGx5RWFjaChpbWFnZXMsIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMoaW1hZ2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkKGltYWdlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMgPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICB2YXIgY29tcHV0ZWRXaWR0aCwgc3JjLCBuYXR1cmFsV2lkdGg7XG5cbiAgICAgICAgbmF0dXJhbFdpZHRoID0gZ2V0TmF0dXJhbFdpZHRoKGltYWdlKTtcbiAgICAgICAgY29tcHV0ZWRXaWR0aCA9IHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuYXZhaWxhYmxlV2lkdGhzKGltYWdlKSA6IHRoaXMuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uKGltYWdlKTtcblxuICAgICAgICBpbWFnZS53aWR0aCA9IGNvbXB1dGVkV2lkdGg7XG5cbiAgICAgICAgaWYgKGltYWdlLnNyYyAhPT0gdGhpcy5naWYuc3JjICYmIGNvbXB1dGVkV2lkdGggPD0gbmF0dXJhbFdpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzcmMgPSB0aGlzLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnModGhpcy5idWlsZFVybFN0cnVjdHVyZShpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyksIGltYWdlKSwgY29tcHV0ZWRXaWR0aCk7XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmRldGVybWluZUFwcHJvcHJpYXRlUmVzb2x1dGlvbiA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpIHx8IGltYWdlLnBhcmVudE5vZGUuY2xpZW50V2lkdGgsIHRoaXMuYXZhaWxhYmxlV2lkdGhzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvIHZhbHVlIHVzZWQgYnkgSW1hZ2VyXG4gICAgICpcbiAgICAgKiBJdCBpcyBwZXJmb3JtZWQgYmVmb3JlIGVhY2ggcmVwbGFjZW1lbnQgbG9vcCwgaW4gY2FzZSBhIHVzZXIgem9vbWVkIGluL291dFxuICAgICAqIGFuZCB0aHVzIHVwZGF0ZWQgdGhlIGB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb2AgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICovXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWZyZXNoUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIHJlZnJlc2hQaXhlbFJhdGlvKCkge1xuICAgICAgICB0aGlzLmRldmljZVBpeGVsUmF0aW8gPSBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKEltYWdlci5nZXRQaXhlbFJhdGlvKCksIHRoaXMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnMgPSBmdW5jdGlvbihzcmMsIHNlbGVjdGVkV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHNyY1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t3aWR0aH0vZywgSW1hZ2VyLnRyYW5zZm9ybXMud2lkdGgoc2VsZWN0ZWRXaWR0aCwgdGhpcy53aWR0aHNNYXApKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3twaXhlbF9yYXRpb30vZywgSW1hZ2VyLnRyYW5zZm9ybXMucGl4ZWxSYXRpbyh0aGlzLmRldmljZVBpeGVsUmF0aW8pKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5idWlsZFVybFN0cnVjdHVyZSA9IGZ1bmN0aW9uKHNyYywgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHNxdWFyZVNlbGVjdG9yID0gdGhpcy5pc0ltYWdlQ29udGFpbmVyU3F1YXJlKGltYWdlKSA/ICcuJyArIHRoaXMuc3F1YXJlU2VsZWN0b3IgOiAnJztcblxuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwuKGpwZ3xnaWZ8Ym1wfHBuZylbXnNdPyh7d2lkdGh9KT9bXnNdKHtwaXhlbF9yYXRpb30pPy9naSwgJy4nICsgdGhpcy5hZGFwdFNlbGVjdG9yICsgJy4kMi4kMycgKyBzcXVhcmVTZWxlY3RvciArICcuJDEnKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pc0ltYWdlQ29udGFpbmVyU3F1YXJlID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIChpbWFnZS5wYXJlbnROb2RlLmNsaWVudFdpZHRoIC8gaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRIZWlnaHQpIDw9IHRoaXMuZGVsdGFTcXVhcmVcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBpeGVsUmF0aW8gPSBmdW5jdGlvbiBnZXRQaXhlbFJhdGlvKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIChjb250ZXh0IHx8IHdpbmRvdylbJ2RldmljZVBpeGVsUmF0aW8nXSB8fCAxO1xuICAgIH07XG5cbiAgICBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwID0gZnVuY3Rpb24gY3JlYXRlV2lkdGhzTWFwKHdpZHRocywgaW50ZXJwb2xhdG9yKSB7XG4gICAgICAgIHZhciBtYXAgPSB7fSxcbiAgICAgICAgICAgIGkgPSB3aWR0aHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIG1hcFt3aWR0aHNbaV1dID0gaW50ZXJwb2xhdG9yKHdpZHRoc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH07XG5cbiAgICBJbWFnZXIudHJhbnNmb3JtcyA9IHtcbiAgICAgICAgcGl4ZWxSYXRpbzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoLCBtYXApIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBbd2lkdGhdIHx8IHdpZHRoO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNsb3Nlc3QgdXBwZXIgdmFsdWUuXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqIHZhciBjYW5kaWRhdGVzID0gWzEsIDEuNSwgMl07XG4gICAgICpcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDAuOCwgY2FuZGlkYXRlcyk7IC8vIC0+IDFcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDEsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLjMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxLjVcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAyXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJhc2VWYWx1ZVxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGNhbmRpZGF0ZXNcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIEltYWdlci5nZXRDbG9zZXN0VmFsdWUgPSBmdW5jdGlvbiBnZXRDbG9zZXN0VmFsdWUoYmFzZVZhbHVlLCBjYW5kaWRhdGVzKSB7XG4gICAgICAgIHZhciBpID0gY2FuZGlkYXRlcy5sZW5ndGgsXG4gICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpIC0gMV07XG5cbiAgICAgICAgYmFzZVZhbHVlID0gcGFyc2VGbG9hdChiYXNlVmFsdWUsIDEwKTtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoYmFzZVZhbHVlIDw9IGNhbmRpZGF0ZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxlY3RlZFdpZHRoO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyUmVzaXplRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcoc2VsZi5kaXZzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVnaXN0ZXJTY3JvbGxFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnNjcm9sbENoZWNrKCk7XG4gICAgICAgIH0sIHNlbGYuc2Nyb2xsRGVsYXkpO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvciA9IGZ1bmN0aW9uIGdldFBhZ2VWZXJ0aWNhbE9mZnNldCh0ZXN0Q2FzZSkge1xuICAgICAgICBpZiAodGVzdENhc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmb3JtIGlzIHVzZWQgYmVjYXVzZSBpdCBzZWVtcyBpbXBvc3NpYmxlIHRvIHN0dWIgYHdpbmRvdy5wYWdlWU9mZnNldGBcbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0R2VuZXJhdG9yKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh3aW5kb3csICdwYWdlWU9mZnNldCcpKTtcblxuICAgIC8vIEV4cG9ydGluZyBmb3IgdGVzdGluZyBwdXJwb3NlXG4gICAgSW1hZ2VyLmFwcGx5RWFjaCA9IGFwcGx5RWFjaDtcblxuICAgIC8qIGdsb2JhbCBtb2R1bGUsIGV4cG9ydHM6IHRydWUsIGRlZmluZSAqL1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTLCBqdXN0IGV4cG9ydFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBJbWFnZXI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EIHN1cHBvcnRcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIEltYWdlcjtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBJZiBubyBBTUQgYW5kIHdlIGFyZSBpbiB0aGUgYnJvd3NlciwgYXR0YWNoIHRvIHdpbmRvd1xuICAgICAgICB3aW5kb3cuSW1hZ2VyID0gSW1hZ2VyO1xuICAgIH1cbiAgICAvKiBnbG9iYWwgLW1vZHVsZSwgLWV4cG9ydHMsIC1kZWZpbmUgKi9cblxufSh3aW5kb3csIGRvY3VtZW50KSk7IiwiLyoqXG4gKiBpc01vYmlsZS5qcyB2MC4zLjVcbiAqXG4gKiBBIHNpbXBsZSBsaWJyYXJ5IHRvIGRldGVjdCBBcHBsZSBwaG9uZXMgYW5kIHRhYmxldHMsXG4gKiBBbmRyb2lkIHBob25lcyBhbmQgdGFibGV0cywgb3RoZXIgbW9iaWxlIGRldmljZXMgKGxpa2UgYmxhY2tiZXJyeSwgbWluaS1vcGVyYSBhbmQgd2luZG93cyBwaG9uZSksXG4gKiBhbmQgYW55IGtpbmQgb2Ygc2V2ZW4gaW5jaCBkZXZpY2UsIHZpYSB1c2VyIGFnZW50IHNuaWZmaW5nLlxuICpcbiAqIEBhdXRob3I6IEthaSBNYWxsZWEgKGttYWxsZWFAZ21haWwuY29tKVxuICpcbiAqIEBsaWNlbnNlOiBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICB2YXIgYXBwbGVfcGhvbmUgICAgICAgICA9IC9pUGhvbmUvaSxcbiAgICAgICAgYXBwbGVfaXBvZCAgICAgICAgICA9IC9pUG9kL2ksXG4gICAgICAgIGFwcGxlX3RhYmxldCAgICAgICAgPSAvaVBhZC9pLFxuICAgICAgICBhbmRyb2lkX3Bob25lICAgICAgID0gLyg/PS4qXFxiQW5kcm9pZFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0FuZHJvaWQnIEFORCAnTW9iaWxlJ1xuICAgICAgICBhbmRyb2lkX3RhYmxldCAgICAgID0gL0FuZHJvaWQvaSxcbiAgICAgICAgd2luZG93c19waG9uZSAgICAgICA9IC9JRU1vYmlsZS9pLFxuICAgICAgICB3aW5kb3dzX3RhYmxldCAgICAgID0gLyg/PS4qXFxiV2luZG93c1xcYikoPz0uKlxcYkFSTVxcYikvaSwgLy8gTWF0Y2ggJ1dpbmRvd3MnIEFORCAnQVJNJ1xuICAgICAgICBvdGhlcl9ibGFja2JlcnJ5ICAgID0gL0JsYWNrQmVycnkvaSxcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeV8xMCA9IC9CQjEwL2ksXG4gICAgICAgIG90aGVyX29wZXJhICAgICAgICAgPSAvT3BlcmEgTWluaS9pLFxuICAgICAgICBvdGhlcl9maXJlZm94ICAgICAgID0gLyg/PS4qXFxiRmlyZWZveFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0ZpcmVmb3gnIEFORCAnTW9iaWxlJ1xuICAgICAgICBzZXZlbl9pbmNoID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICcoPzonICsgICAgICAgICAvLyBOb24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdOZXh1cyA3JyArICAgICAvLyBOZXh1cyA3XG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnQk5UVjI1MCcgKyAgICAgLy8gQiZOIE5vb2sgVGFibGV0IDcgaW5jaFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0tpbmRsZSBGaXJlJyArIC8vIEtpbmRsZSBGaXJlXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnU2lsaycgKyAgICAgICAgLy8gS2luZGxlIEZpcmUsIFNpbGsgQWNjZWxlcmF0ZWRcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdHVC1QMTAwMCcgKyAgICAvLyBHYWxheHkgVGFiIDcgaW5jaFxuXG4gICAgICAgICAgICAnKScsICAgICAgICAgICAgLy8gRW5kIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ2knKTsgICAgICAgICAgIC8vIENhc2UtaW5zZW5zaXRpdmUgbWF0Y2hpbmdcblxuICAgIHZhciBtYXRjaCA9IGZ1bmN0aW9uKHJlZ2V4LCB1c2VyQWdlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodXNlckFnZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIElzTW9iaWxlQ2xhc3MgPSBmdW5jdGlvbih1c2VyQWdlbnQpIHtcbiAgICAgICAgdmFyIHVhID0gdXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgdGhpcy5hcHBsZSA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIGlwb2Q6ICAgbWF0Y2goYXBwbGVfaXBvZCwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaChhcHBsZV90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSB8fCBtYXRjaChhcHBsZV9pcG9kLCB1YSkgfHwgbWF0Y2goYXBwbGVfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmRyb2lkID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6ICFtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgJiYgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpIHx8IG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53aW5kb3dzID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSB8fCBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3RoZXIgPSB7XG4gICAgICAgICAgICBibGFja2JlcnJ5OiAgIG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSxcbiAgICAgICAgICAgIGJsYWNrYmVycnkxMDogbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpLFxuICAgICAgICAgICAgb3BlcmE6ICAgICAgICBtYXRjaChvdGhlcl9vcGVyYSwgdWEpLFxuICAgICAgICAgICAgZmlyZWZveDogICAgICBtYXRjaChvdGhlcl9maXJlZm94LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6ICAgICAgIG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSB8fCBtYXRjaChvdGhlcl9ibGFja2JlcnJ5XzEwLCB1YSkgfHwgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSB8fCBtYXRjaChvdGhlcl9maXJlZm94LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXZlbl9pbmNoID0gbWF0Y2goc2V2ZW5faW5jaCwgdWEpO1xuICAgICAgICB0aGlzLmFueSA9IHRoaXMuYXBwbGUuZGV2aWNlIHx8IHRoaXMuYW5kcm9pZC5kZXZpY2UgfHwgdGhpcy53aW5kb3dzLmRldmljZSB8fCB0aGlzLm90aGVyLmRldmljZSB8fCB0aGlzLnNldmVuX2luY2g7XG4gICAgICAgIC8vIGV4Y2x1ZGVzICdvdGhlcicgZGV2aWNlcyBhbmQgaXBvZHMsIHRhcmdldGluZyB0b3VjaHNjcmVlbiBwaG9uZXNcbiAgICAgICAgdGhpcy5waG9uZSA9IHRoaXMuYXBwbGUucGhvbmUgfHwgdGhpcy5hbmRyb2lkLnBob25lIHx8IHRoaXMud2luZG93cy5waG9uZTtcbiAgICAgICAgLy8gZXhjbHVkZXMgNyBpbmNoIGRldmljZXMsIGNsYXNzaWZ5aW5nIGFzIHBob25lIG9yIHRhYmxldCBpcyBsZWZ0IHRvIHRoZSB1c2VyXG4gICAgICAgIHRoaXMudGFibGV0ID0gdGhpcy5hcHBsZS50YWJsZXQgfHwgdGhpcy5hbmRyb2lkLnRhYmxldCB8fCB0aGlzLndpbmRvd3MudGFibGV0O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBJTSA9IG5ldyBJc01vYmlsZUNsYXNzKCk7XG4gICAgICAgIElNLkNsYXNzID0gSXNNb2JpbGVDbGFzcztcbiAgICAgICAgcmV0dXJuIElNO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL25vZGVcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBJc01vYmlsZUNsYXNzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL2Jyb3dzZXJpZnlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vQU1EXG4gICAgICAgIGRlZmluZShnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCIvKlxyXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXHJcbipcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB7fTtcclxuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcclxuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgIFwidHJhY2VcIixcclxuICAgICAgICBcImRlYnVnXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJ3YXJuXCIsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XHJcbiAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/IG5vb3AgOiBzZWxmLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XHJcbiAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddID0gbGV2ZWxOYW1lO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID0gXCJsb2dsZXZlbD1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUGVyc2lzdGVkTGV2ZWwoKSB7XHJcbiAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9sb2dsZXZlbD0oW147XSspLy5leGVjKHdpbmRvdy5kb2N1bWVudC5jb29raWUpWzFdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IFwiV0FSTlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKlxyXG4gICAgICogUHVibGljIEFQSVxyXG4gICAgICpcclxuICAgICAqL1xyXG5cclxuICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxyXG4gICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XHJcblxyXG4gICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcclxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcclxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcclxuICAgIHNlbGYubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IHNlbGYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZFBlcnNpc3RlZExldmVsKCk7XHJcbiAgICByZXR1cm4gc2VsZjtcclxufSkpO1xyXG4iLCIvKiFcclxuICogdmVyZ2UgMS45LjErMjAxNDAyMTMwODAzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFudmUvdmVyZ2VcclxuICogTUlUIExpY2Vuc2UgMjAxMyBSeWFuIFZhbiBFdHRlblxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihyb290LCBuYW1lLCBtYWtlKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIG1vZHVsZVsnZXhwb3J0cyddID0gbWFrZSgpO1xyXG4gIGVsc2Ugcm9vdFtuYW1lXSA9IG1ha2UoKTtcclxufSh0aGlzLCAndmVyZ2UnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIHhwb3J0cyA9IHt9XHJcbiAgICAsIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93XHJcbiAgICAsIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudFxyXG4gICAgLCBkb2NFbGVtID0gZG9jICYmIGRvYy5kb2N1bWVudEVsZW1lbnRcclxuICAgICwgbWF0Y2hNZWRpYSA9IHdpblsnbWF0Y2hNZWRpYSddIHx8IHdpblsnbXNNYXRjaE1lZGlhJ11cclxuICAgICwgbXEgPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24ocSkge1xyXG4gICAgICAgIHJldHVybiAhIW1hdGNoTWVkaWEuY2FsbCh3aW4sIHEpLm1hdGNoZXM7XHJcbiAgICAgIH0gOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICwgdmlld3BvcnRXID0geHBvcnRzWyd2aWV3cG9ydFcnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhID0gZG9jRWxlbVsnY2xpZW50V2lkdGgnXSwgYiA9IHdpblsnaW5uZXJXaWR0aCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0SCA9IHhwb3J0c1sndmlld3BvcnRIJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudEhlaWdodCddLCBiID0gd2luWydpbm5lckhlaWdodCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9O1xyXG4gIFxyXG4gIC8qKiBcclxuICAgKiBUZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlLiBMaWtlIE1vZGVybml6ci5tcVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovICBcclxuICB4cG9ydHNbJ21xJ10gPSBtcTtcclxuXHJcbiAgLyoqIFxyXG4gICAqIE5vcm1hbGl6ZWQgbWF0Y2hNZWRpYVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge01lZGlhUXVlcnlMaXN0fE9iamVjdH1cclxuICAgKi8gXHJcbiAgeHBvcnRzWydtYXRjaE1lZGlhJ10gPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBtYXRjaE1lZGlhIG11c3QgYmUgYmluZGVkIHRvIHdpbmRvd1xyXG4gICAgcmV0dXJuIG1hdGNoTWVkaWEuYXBwbHkod2luLCBhcmd1bWVudHMpO1xyXG4gIH0gOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIEdyYWNlZnVsbHkgZGVncmFkZSB0byBwbGFpbiBvYmplY3RcclxuICAgIHJldHVybiB7fTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAc2luY2UgMS44LjBcclxuICAgKiBAcmV0dXJuIHt7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfX1cclxuICAgKi9cclxuICBmdW5jdGlvbiB2aWV3cG9ydCgpIHtcclxuICAgIHJldHVybiB7J3dpZHRoJzp2aWV3cG9ydFcoKSwgJ2hlaWdodCc6dmlld3BvcnRIKCl9O1xyXG4gIH1cclxuICB4cG9ydHNbJ3ZpZXdwb3J0J10gPSB2aWV3cG9ydDtcclxuICBcclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWFxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFgnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWE9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbExlZnQ7IFxyXG4gIH07XHJcblxyXG4gIC8qKiBcclxuICAgKiBDcm9zcy1icm93c2VyIHdpbmRvdy5zY3JvbGxZXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHhwb3J0c1snc2Nyb2xsWSddID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luLnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsVG9wOyBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3t0b3A6bnVtYmVyLCByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXIsIGxlZnQ6bnVtYmVyfX0gY29vcmRzXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uIGFkanVzdG1lbnRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2FsaWJyYXRlKGNvb3JkcywgY3VzaGlvbikge1xyXG4gICAgdmFyIG8gPSB7fTtcclxuICAgIGN1c2hpb24gPSArY3VzaGlvbiB8fCAwO1xyXG4gICAgb1snd2lkdGgnXSA9IChvWydyaWdodCddID0gY29vcmRzWydyaWdodCddICsgY3VzaGlvbikgLSAob1snbGVmdCddID0gY29vcmRzWydsZWZ0J10gLSBjdXNoaW9uKTtcclxuICAgIG9bJ2hlaWdodCddID0gKG9bJ2JvdHRvbSddID0gY29vcmRzWydib3R0b20nXSArIGN1c2hpb24pIC0gKG9bJ3RvcCddID0gY29vcmRzWyd0b3AnXSAtIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuIG87XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcm9zcy1icm93c2VyIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHBsdXMgb3B0aW9uYWwgY3VzaGlvbi5cclxuICAgKiBDb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsIGVsZW1lbnQgb3Igc3RhY2sgKHVzZXMgZmlyc3QgaXRlbSlcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb24gKy8tIHBpeGVsIGFkanVzdG1lbnQgYW1vdW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fGJvb2xlYW59XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKSB7XHJcbiAgICBlbCA9IGVsICYmICFlbC5ub2RlVHlwZSA/IGVsWzBdIDogZWw7XHJcbiAgICBpZiAoIWVsIHx8IDEgIT09IGVsLm5vZGVUeXBlKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gY2FsaWJyYXRlKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBjdXNoaW9uKTtcclxuICB9XHJcbiAgeHBvcnRzWydyZWN0YW5nbGUnXSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB2aWV3cG9ydCBhc3BlY3QgcmF0aW8gKG9yIHRoZSBhc3BlY3QgcmF0aW8gb2YgYW4gb2JqZWN0IG9yIGVsZW1lbnQpXHJcbiAgICogQHNpbmNlIDEuNy4wXHJcbiAgICogQHBhcmFtIHsoRWxlbWVudHxPYmplY3QpPX0gbyBvcHRpb25hbCBvYmplY3Qgd2l0aCB3aWR0aC9oZWlnaHQgcHJvcHMgb3IgbWV0aG9kc1xyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKiBAbGluayBodHRwOi8vdzMub3JnL1RSL2NzczMtbWVkaWFxdWVyaWVzLyNvcmllbnRhdGlvblxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzcGVjdChvKSB7XHJcbiAgICBvID0gbnVsbCA9PSBvID8gdmlld3BvcnQoKSA6IDEgPT09IG8ubm9kZVR5cGUgPyByZWN0YW5nbGUobykgOiBvO1xyXG4gICAgdmFyIGggPSBvWydoZWlnaHQnXSwgdyA9IG9bJ3dpZHRoJ107XHJcbiAgICBoID0gdHlwZW9mIGggPT0gJ2Z1bmN0aW9uJyA/IGguY2FsbChvKSA6IGg7XHJcbiAgICB3ID0gdHlwZW9mIHcgPT0gJ2Z1bmN0aW9uJyA/IHcuY2FsbChvKSA6IHc7XHJcbiAgICByZXR1cm4gdy9oO1xyXG4gIH1cclxuICB4cG9ydHNbJ2FzcGVjdCddID0gYXNwZWN0O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeC1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWCddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5yaWdodCA+PSAwICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeS1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWSddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5ib3R0b20gPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luVmlld3BvcnQnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICAvLyBFcXVpdiB0byBgaW5YKGVsLCBjdXNoaW9uKSAmJiBpblkoZWwsIGN1c2hpb24pYCBidXQganVzdCBtYW51YWxseSBkbyBib3RoIFxyXG4gICAgLy8gdG8gYXZvaWQgY2FsbGluZyByZWN0YW5nbGUoKSB0d2ljZS4gSXQgZ3ppcHMganVzdCBhcyBzbWFsbCBsaWtlIHRoaXMuXHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci5yaWdodCA+PSAwICYmIHIudG9wIDw9IHZpZXdwb3J0SCgpICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4geHBvcnRzO1xyXG59KSk7IiwiLyohXG4gKiBFdmVudEVtaXR0ZXIgdjQuMi4xMSAtIGdpdC5pby9lZVxuICogVW5saWNlbnNlIC0gaHR0cDovL3VubGljZW5zZS5vcmcvXG4gKiBPbGl2ZXIgQ2FsZHdlbGwgLSBodHRwOi8vb2xpLm1lLnVrL1xuICogQHByZXNlcnZlXG4gKi9cblxuOyhmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIG1hbmFnaW5nIGV2ZW50cy5cbiAgICAgKiBDYW4gYmUgZXh0ZW5kZWQgdG8gcHJvdmlkZSBldmVudCBmdW5jdGlvbmFsaXR5IGluIG90aGVyIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAY2xhc3MgRXZlbnRFbWl0dGVyIE1hbmFnZXMgZXZlbnQgcmVnaXN0ZXJpbmcgYW5kIGVtaXR0aW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHt9XG5cbiAgICAvLyBTaG9ydGN1dHMgdG8gaW1wcm92ZSBzcGVlZCBhbmQgc2l6ZVxuICAgIHZhciBwcm90byA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG4gICAgdmFyIGV4cG9ydHMgPSB0aGlzO1xuICAgIHZhciBvcmlnaW5hbEdsb2JhbFZhbHVlID0gZXhwb3J0cy5FdmVudEVtaXR0ZXI7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQgaW4gaXRzIHN0b3JhZ2UgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGxpc3RlbmVycyBBcnJheSBvZiBsaXN0ZW5lcnMgdG8gc2VhcmNoIHRocm91Z2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGxvb2sgZm9yLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gSW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0ZW5lciwgLTEgaWYgbm90IGZvdW5kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVycywgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsaWFzIGEgbWV0aG9kIHdoaWxlIGtlZXBpbmcgdGhlIGNvbnRleHQgY29ycmVjdCwgdG8gYWxsb3cgZm9yIG92ZXJ3cml0aW5nIG9mIHRhcmdldCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGFsaWFzZWQgbWV0aG9kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxpYXMobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWxpYXNDbG9zdXJlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0ZW5lciBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaWxsIGluaXRpYWxpc2UgdGhlIGV2ZW50IG9iamVjdCBhbmQgbGlzdGVuZXIgYXJyYXlzIGlmIHJlcXVpcmVkLlxuICAgICAqIFdpbGwgcmV0dXJuIGFuIG9iamVjdCBpZiB5b3UgdXNlIGEgcmVnZXggc2VhcmNoLiBUaGUgb2JqZWN0IGNvbnRhaW5zIGtleXMgZm9yIGVhY2ggbWF0Y2hlZCBldmVudC4gU28gL2JhW3J6XS8gbWlnaHQgcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGJhciBhbmQgYmF6LiBCdXQgb25seSBpZiB5b3UgaGF2ZSBlaXRoZXIgZGVmaW5lZCB0aGVtIHdpdGggZGVmaW5lRXZlbnQgb3IgYWRkZWQgc29tZSBsaXN0ZW5lcnMgdG8gdGhlbS5cbiAgICAgKiBFYWNoIHByb3BlcnR5IGluIHRoZSBvYmplY3QgcmVzcG9uc2UgaXMgYW4gYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfE9iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgdGhlIGV2ZW50LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldExpc3RlbmVycyhldnQpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgY29uY2F0ZW5hdGVkIGFycmF5IG9mIGFsbCBtYXRjaGluZyBldmVudHMgaWZcbiAgICAgICAgLy8gdGhlIHNlbGVjdG9yIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Vba2V5XSA9IGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gZXZlbnRzW2V2dF0gfHwgKGV2ZW50c1tldnRdID0gW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGxpc3Qgb2YgbGlzdGVuZXIgb2JqZWN0cyBhbmQgZmxhdHRlbnMgaXQgaW50byBhIGxpc3Qgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gbGlzdGVuZXJzIFJhdyBsaXN0ZW5lciBvYmplY3RzLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW119IEp1c3QgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBwcm90by5mbGF0dGVuTGlzdGVuZXJzID0gZnVuY3Rpb24gZmxhdHRlbkxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGZsYXRMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmxhdExpc3RlbmVycy5wdXNoKGxpc3RlbmVyc1tpXS5saXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmxhdExpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgcmVxdWVzdGVkIGxpc3RlbmVycyB2aWEgZ2V0TGlzdGVuZXJzIGJ1dCB3aWxsIGFsd2F5cyByZXR1cm4gdGhlIHJlc3VsdHMgaW5zaWRlIGFuIG9iamVjdC4gVGhpcyBpcyBtYWlubHkgZm9yIGludGVybmFsIHVzZSBidXQgb3RoZXJzIG1heSBmaW5kIGl0IHVzZWZ1bC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBpbiBhbiBvYmplY3QuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzQXNPYmplY3QgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnNBc09iamVjdChldnQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBpZiAobGlzdGVuZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICByZXNwb25zZVtldnRdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGxpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogVGhlIGxpc3RlbmVyIHdpbGwgbm90IGJlIGFkZGVkIGlmIGl0IGlzIGEgZHVwbGljYXRlLlxuICAgICAqIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgaXQgaXMgY2FsbGVkLlxuICAgICAqIElmIHlvdSBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lIHRoZW4gdGhlIGxpc3RlbmVyIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVySXNXcmFwcGVkID0gdHlwZW9mIGxpc3RlbmVyID09PSAnb2JqZWN0JztcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5wdXNoKGxpc3RlbmVySXNXcmFwcGVkID8gbGlzdGVuZXIgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICAgICAgb25jZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9uID0gYWxpYXMoJ2FkZExpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLWFsaWFzIG9mIGFkZExpc3RlbmVyLiBJdCB3aWxsIGFkZCBhIGxpc3RlbmVyIHRoYXQgd2lsbCBiZVxuICAgICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBhZnRlciBpdHMgZmlyc3QgZXhlY3V0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRPbmNlTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRPbmNlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihldnQsIHtcbiAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgIG9uY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZE9uY2VMaXN0ZW5lci5cbiAgICAgKi9cbiAgICBwcm90by5vbmNlID0gYWxpYXMoJ2FkZE9uY2VMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBldmVudCBuYW1lLiBUaGlzIGlzIHJlcXVpcmVkIGlmIHlvdSB3YW50IHRvIHVzZSBhIHJlZ2V4IHRvIGFkZCBhIGxpc3RlbmVyIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBJZiB5b3UgZG9uJ3QgZG8gdGhpcyB0aGVuIGhvdyBkbyB5b3UgZXhwZWN0IGl0IHRvIGtub3cgd2hhdCBldmVudCB0byBhZGQgdG8/IFNob3VsZCBpdCBqdXN0IGFkZCB0byBldmVyeSBwb3NzaWJsZSBtYXRjaCBmb3IgYSByZWdleD8gTm8uIFRoYXQgaXMgc2NhcnkgYW5kIGJhZC5cbiAgICAgKiBZb3UgbmVlZCB0byB0ZWxsIGl0IHdoYXQgZXZlbnQgbmFtZXMgc2hvdWxkIGJlIG1hdGNoZWQgYnkgYSByZWdleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gY3JlYXRlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50ID0gZnVuY3Rpb24gZGVmaW5lRXZlbnQoZXZ0KSB7XG4gICAgICAgIHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIGRlZmluZUV2ZW50IHRvIGRlZmluZSBtdWx0aXBsZSBldmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBldnRzIEFuIGFycmF5IG9mIGV2ZW50IG5hbWVzIHRvIGRlZmluZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudHMgPSBmdW5jdGlvbiBkZWZpbmVFdmVudHMoZXZ0cykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2dHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lRXZlbnQoZXZ0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmdW5jdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2hlbiBwYXNzZWQgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUsIGl0IHdpbGwgcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gcmVtb3ZlIGZyb20gdGhlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9mZiA9IGFsaWFzKCdyZW1vdmVMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy4gWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIGFkZCB0aGUgYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKiBZZWFoLCB0aGlzIGZ1bmN0aW9uIGRvZXMgcXVpdGUgYSBiaXQuIFRoYXQncyBwcm9iYWJseSBhIGJhZCB0aGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVycyA9IGZ1bmN0aW9uIGFkZExpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKGZhbHNlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVycyBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnModHJ1ZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyBsaXN0ZW5lcnMgaW4gYnVsay4gVGhlIGFkZExpc3RlbmVycyBhbmQgcmVtb3ZlTGlzdGVuZXJzIG1ldGhvZHMgYm90aCB1c2UgdGhpcyB0byBkbyB0aGVpciBqb2IuIFlvdSBzaG91bGQgcmVhbGx5IHVzZSB0aG9zZSBpbnN0ZWFkLCB0aGlzIGlzIGEgbGl0dGxlIGxvd2VyIGxldmVsLlxuICAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGRldGVybWluZSBpZiB0aGUgbGlzdGVuZXJzIGFyZSByZW1vdmVkICh0cnVlKSBvciBhZGRlZCAoZmFsc2UpLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkL3JlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFuaXB1bGF0ZSB0aGUgbGlzdGVuZXJzIG9mIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlIFRydWUgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIGxpc3RlbmVycywgZmFsc2UgaWYgeW91IHdhbnQgdG8gYWRkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkL3JlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5tYW5pcHVsYXRlTGlzdGVuZXJzID0gZnVuY3Rpb24gbWFuaXB1bGF0ZUxpc3RlbmVycyhyZW1vdmUsIGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIHZhciBzaW5nbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVyIDogdGhpcy5hZGRMaXN0ZW5lcjtcbiAgICAgICAgdmFyIG11bHRpcGxlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lcnMgOiB0aGlzLmFkZExpc3RlbmVycztcblxuICAgICAgICAvLyBJZiBldnQgaXMgYW4gb2JqZWN0IHRoZW4gcGFzcyBlYWNoIG9mIGl0cyBwcm9wZXJ0aWVzIHRvIHRoaXMgbWV0aG9kXG4gICAgICAgIGlmICh0eXBlb2YgZXZ0ID09PSAnb2JqZWN0JyAmJiAhKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpICYmICh2YWx1ZSA9IGV2dFtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgc2luZ2xlIGxpc3RlbmVyIHN0cmFpZ2h0IHRocm91Z2ggdG8gdGhlIHNpbmd1bGFyIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgcGFzcyBiYWNrIHRvIHRoZSBtdWx0aXBsZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTbyBldnQgbXVzdCBiZSBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gQW5kIGxpc3RlbmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIGxpc3RlbmVyc1xuICAgICAgICAgICAgLy8gTG9vcCBvdmVyIGl0IGFuZCBwYXNzIGVhY2ggb25lIHRvIHRoZSBtdWx0aXBsZSBtZXRob2RcbiAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGV2dCwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMgZnJvbSBhIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYW4gZXZlbnQgdGhlbiBhbGwgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiBUaGF0IG1lYW5zIGV2ZXJ5IGV2ZW50IHdpbGwgYmUgZW1wdGllZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ2V4IHRvIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IFtldnRdIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci4gV2lsbCByZW1vdmUgZnJvbSBldmVyeSBldmVudCBpZiBub3QgcGFzc2VkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZXZ0KSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGV2dDtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJlbW92ZSBkaWZmZXJlbnQgdGhpbmdzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgZXZ0XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbZXZ0XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgZXZlbnRzIG1hdGNoaW5nIHRoZSByZWdleC5cbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBpbiBhbGwgZXZlbnRzXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUV2ZW50LlxuICAgICAqXG4gICAgICogQWRkZWQgdG8gbWlycm9yIHRoZSBub2RlIEFQSS5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBhbGlhcygncmVtb3ZlRXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IG9mIHlvdXIgY2hvaWNlLlxuICAgICAqIFdoZW4gZW1pdHRlZCwgZXZlcnkgbGlzdGVuZXIgYXR0YWNoZWQgdG8gdGhhdCBldmVudCB3aWxsIGJlIGV4ZWN1dGVkLlxuICAgICAqIElmIHlvdSBwYXNzIHRoZSBvcHRpb25hbCBhcmd1bWVudCBhcnJheSB0aGVuIHRob3NlIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0byBldmVyeSBsaXN0ZW5lciB1cG9uIGV4ZWN1dGlvbi5cbiAgICAgKiBCZWNhdXNlIGl0IHVzZXMgYGFwcGx5YCwgeW91ciBhcnJheSBvZiBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXMgaWYgeW91IHdyb3RlIHRoZW0gb3V0IHNlcGFyYXRlbHkuXG4gICAgICogU28gdGhleSB3aWxsIG5vdCBhcnJpdmUgd2l0aGluIHRoZSBhcnJheSBvbiB0aGUgb3RoZXIgc2lkZSwgdGhleSB3aWxsIGJlIHNlcGFyYXRlLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXSBPcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdEV2ZW50ID0gZnVuY3Rpb24gZW1pdEV2ZW50KGV2dCwgYXJncykge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpID0gbGlzdGVuZXJzW2tleV0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgc2hhbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWl0aGVyIHdpdGggYSBiYXNpYyBjYWxsIG9yIGFuIGFwcGx5IGlmIHRoZXJlIGlzIGFuIGFyZ3MgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNba2V5XVtpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25jZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gbGlzdGVuZXIubGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBlbWl0RXZlbnRcbiAgICAgKi9cbiAgICBwcm90by50cmlnZ2VyID0gYWxpYXMoJ2VtaXRFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogU3VidGx5IGRpZmZlcmVudCBmcm9tIGVtaXRFdmVudCBpbiB0aGF0IGl0IHdpbGwgcGFzcyBpdHMgYXJndW1lbnRzIG9uIHRvIHRoZSBsaXN0ZW5lcnMsIGFzIG9wcG9zZWQgdG8gdGFraW5nIGEgc2luZ2xlIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwYXNzIG9uLlxuICAgICAqIEFzIHdpdGggZW1pdEV2ZW50LCB5b3UgY2FuIHBhc3MgYSByZWdleCBpbiBwbGFjZSBvZiB0aGUgZXZlbnQgbmFtZSB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0gey4uLip9IE9wdGlvbmFsIGFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2dCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRFdmVudChldnQsIGFyZ3MpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZiBhXG4gICAgICogbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoZSBvbmUgc2V0IGhlcmUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBhZnRlciBleGVjdXRpb24uIFRoaXMgdmFsdWUgZGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIG5ldyB2YWx1ZSB0byBjaGVjayBmb3Igd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnNldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIHNldE9uY2VSZXR1cm5WYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9vbmNlUmV0dXJuVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmXG4gICAgICogdGhlIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGlzIG9uZSB0aGVuIGl0IHNob3VsZCBiZSByZW1vdmVkXG4gICAgICogYXV0b21hdGljYWxseS4gSXQgd2lsbCByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7KnxCb29sZWFufSBUaGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBmb3Igb3IgdGhlIGRlZmF1bHQsIHRydWUuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIF9nZXRPbmNlUmV0dXJuVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdfb25jZVJldHVyblZhbHVlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBldmVudHMgb2JqZWN0IGFuZCBjcmVhdGVzIG9uZSBpZiByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV2ZW50cyBzdG9yYWdlIG9iamVjdC5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0RXZlbnRzID0gZnVuY3Rpb24gX2dldEV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXZlcnRzIHRoZSBnbG9iYWwge0BsaW5rIEV2ZW50RW1pdHRlcn0gdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBOb24gY29uZmxpY3RpbmcgRXZlbnRFbWl0dGVyIGNsYXNzLlxuICAgICAqL1xuICAgIEV2ZW50RW1pdHRlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBvcmlnaW5hbEdsb2JhbFZhbHVlO1xuICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBvc2UgdGhlIGNsYXNzIGVpdGhlciB2aWEgQU1ELCBDb21tb25KUyBvciB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIiMjIypcbiAqIFRoZSBwdXJwb3NlIG9mIHRoaXMgbGF5ZXIgaXMgdG8gZGVjbGFyZSBhbmQgYWJzdHJhY3QgdGhlIGFjY2VzcyB0b1xuICogdGhlIGNvcmUgYmFzZSBvZiBsaWJyYXJpZXMgdGhhdCB0aGUgcmVzdCBvZiB0aGUgc3RhY2sgKHRoZSBhcHAgZnJhbWV3b3JrKVxuICogd2lsbCBkZXBlbmQuXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgQmFzZSkgLT5cblxuICAgICMgQXJyYXkgdGhhdCBob2xkcyBoYXJkIGRlcGVuZGVuY2llcyBmb3IgdGhlIFNES1xuICAgIGRlcGVuZGVuY2llcyA9IFtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImpRdWVyeVwiXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IFwiMS4xMFwiICMgcmVxdWlyZWQgdmVyc2lvblxuICAgICAgICAgICAgXCJvYmpcIjogcm9vdC4kICMgZ2xvYmFsIG9iamVjdFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IGlmIHJvb3QuJCB0aGVuIHJvb3QuJC5mbi5qcXVlcnkgZWxzZSAwICMgZ2l2ZXMgdGhlIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgb2YgdGhlIGxvYWRlZCBsaWJcbiAgICAgICAgLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiVW5kZXJzY29yZVwiXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IFwiMS43LjBcIiAjIHJlcXVpcmVkIHZlcnNpb25cbiAgICAgICAgICAgIFwib2JqXCI6IHJvb3QuXyAjIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBpZiByb290Ll8gdGhlbiByb290Ll8uVkVSU0lPTiBlbHNlIDBcbiAgICBdXG5cbiAgICAjIFZlcnNpb24gY2hlY2tlciB1dGlsXG4gICAgVmVyc2lvbkNoZWNrZXIgPSByZXF1aXJlICcuL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlJ1xuXG4gICAgIyBJbiBjYXNlIGFueSBvZiBvdXIgZGVwZW5kZW5jaWVzIHdlcmUgbm90IGxvYWRlZCwgb3IgaXRzIHZlcnNpb24gZG9lc3Qgbm90IGNvcnJlc3BvbmQgdG8gb3Vyc1xuICAgICMgbmVlZHMsIHRoZSB2ZXJzaW9uQ2hlY2tlciB3aWxsIHRob3J3IGFuIGVycm9yIGV4cGxhaW5pbmcgd2h5XG4gICAgVmVyc2lvbkNoZWNrZXIuY2hlY2soZGVwZW5kZW5jaWVzKVxuXG4gICAgIyBMb2dnZXJcbiAgICBCYXNlLmxvZyA9IHJlcXVpcmUgJy4vdXRpbC9sb2dnZXIuY29mZmVlJ1xuXG4gICAgIyBEZXZpY2UgZGV0ZWN0aW9uXG4gICAgQmFzZS5kZXZpY2UgPSByZXF1aXJlICcuL3V0aWwvZGV2aWNlZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgQ29va2llcyBBUElcbiAgICBCYXNlLmNvb2tpZXMgPSByZXF1aXJlICcuL3V0aWwvY29va2llcy5jb2ZmZWUnXG5cbiAgICAjIFZpZXdwb3J0IGRldGVjdGlvblxuICAgIEJhc2UudnAgPSByZXF1aXJlICcuL3V0aWwvdmlld3BvcnRkZXRlY3Rpb24uY29mZmVlJ1xuXG4gICAgIyBGdW5jdGlvbiB0aGF0IGlzIGdvbm5hIGhhbmRsZSByZXNwb25zaXZlIGltYWdlc1xuICAgIEJhc2UuSW1hZ2VyID0gcmVxdWlyZSAnaW1hZ2VyLmpzJ1xuXG4gICAgIyBFdmVudCBCdXNcbiAgICBCYXNlLkV2ZW50cyA9IHJlcXVpcmUgJy4vdXRpbC9ldmVudGJ1cy5jb2ZmZWUnXG5cbiAgICAjIEdlbmVyYWwgVXRpbHNcbiAgICBVdGlscyA9IHJlcXVpcmUgJy4vdXRpbC9nZW5lcmFsLmNvZmZlZSdcblxuICAgICMgVXRpbHNcbiAgICBCYXNlLnV0aWwgPSByb290Ll8uZXh0ZW5kIFV0aWxzLCByb290Ll9cblxuICAgIHJldHVybiBCYXNlXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgICA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuICAgIE1vZHVsZSA9IHJlcXVpcmUoJy4vLi4vdXRpbC9tb2R1bGUuY29mZmVlJylcblxuICAgIGNsYXNzIENvbXBvbmVudFxuXG4gICAgICAgICMgb2JqZWN0IHRvIHN0b3JlIGluaXRpYWxpemVkIGNvbXBvbmVudHNcbiAgICAgICAgQGluaXRpYWxpemVkQ29tcG9uZW50cyA6IHt9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBzdGFydEFsbCBtZXRob2RcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBsb29rIGZvciBjb21wb25lbnRzIHRvIHN0YXJ0IHdpdGhpbiB0aGUgcGFzc2VkIHNlbGVjdG9yXG4gICAgICAgICAqIGFuZCBjYWxsIHRoZWlyIC5pbml0aWFsaXplKCkgbWV0aG9kXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciA9ICdib2R5Jy4gQ1NTIHNlbGVjdG9yIHRvIHRlbGwgdGhlIGFwcCB3aGVyZSB0byBsb29rIGZvciBjb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdGFydEFsbDogKHNlbGVjdG9yID0gJ2JvZHknLCBhcHAsIG5hbWVzcGFjZSA9IFBlc3RsZS5tb2R1bGVzKSAtPlxuXG4gICAgICAgICAgICBjb21wb25lbnRzID0gQ29tcG9uZW50LnBhcnNlKHNlbGVjdG9yLCBhcHAuY29uZmlnLm5hbWVzcGFjZSlcblxuICAgICAgICAgICAgY21wY2xvbmUgPSBCYXNlLnV0aWwuY2xvbmUgY29tcG9uZW50c1xuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiUGFyc2VkIGNvbXBvbmVudHNcIlxuICAgICAgICAgICAgQmFzZS5sb2cuZGVidWcgY21wY2xvbmVcblxuICAgICAgICAgICAgIyBhZGRlZCB0byBrZWVwIG5hbWVzcGFjZS5OQU1FID0gREVGSU5JVElPTiBzaW50YXguIFRoaXMgd2lsbCBleHRlbmRcbiAgICAgICAgICAgICMgdGhlIG9iamVjdCBkZWZpbml0aW9uIHdpdGggdGhlIE1vZHVsZSBjbGFzc1xuICAgICAgICAgICAgIyB0aGlzIG1pZ2h0IG5lZWQgdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0VtcHR5IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2UsIChkZWZpbml0aW9uLCBuYW1lKSAtPlxuICAgICAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRnVuY3Rpb24gZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgTW9kdWxlLmV4dGVuZCBuYW1lLCBkZWZpbml0aW9uXG5cbiAgICAgICAgICAgICMgZ3JhYiBhIHJlZmVyZW5jZSBvZiBhbGwgdGhlIG1vZHVsZSBkZWZpbmVkIHVzaW5nIHRoZSBNb2R1bGUuYWRkXG4gICAgICAgICAgICAjIG1ldGhvZC5cbiAgICAgICAgICAgIEJhc2UudXRpbC5leHRlbmQgbmFtZXNwYWNlLCBQZXN0bGUuTW9kdWxlLmxpc3RcblxuICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhbGw6IENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBuZXc6IGNtcGNsb25lXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiB0aGUgcGFyc2UgbWV0aG9kIHdpbGwgbG9vayBmb3IgY29tcG9uZW50cyBkZWZpbmVkIHVzaW5nXG4gICAgICAgICAqIHRoZSBjb25maWd1cmVkIG5hbWVzcGFjZSBhbmQgbGl2aW5nIHdpdGhpbiB0aGUgcGFzc2VkXG4gICAgICAgICAqIENTUyBzZWxlY3RvclxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmFtZXNwYWNlIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAjIyNcbiAgICAgICAgQHBhcnNlOiAoc2VsZWN0b3IsIG5hbWVzcGFjZSkgLT5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gc3RvcmUgcGFyc2VkIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGxpc3QgPSBbXVxuXG4gICAgICAgICAgICAjIGlmIGFuIGFycmF5IGlzIHBhc3NlZCwgdXNlIGl0IGFzIGl0IGlzXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNBcnJheSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VzID0gbmFtZXNwYWNlXG4gICAgICAgICAgICAjIGlmIGEgc3RyaW5nIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIsIGNvbnZlcnQgaXQgdG8gYW4gYXJyYXlcbiAgICAgICAgICAgIGVsc2UgaWYgQmFzZS51dGlsLmlzU3RyaW5nIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZXMgPSBuYW1lc3BhY2Uuc3BsaXQgJywnXG5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gc3RvcmUgdGhlIGNvbXBvc2VkIGNzcyBzZWxlY3RvciB0aGF0IHdpbGwgbG9vayB1cCBmb3JcbiAgICAgICAgICAgICMgY29tcG9uZW50IGRlZmluaXRpb25zXG4gICAgICAgICAgICBjc3NTZWxlY3RvcnMgPSBbXVxuXG4gICAgICAgICAgICAjIGl0ZXJhdGVzIG92ZXIgdGhlIG5hbWVzcGFjZSBhcnJheSBhbmQgY3JlYXRlIHRoZSBuZWVkZWQgY3NzIHNlbGVjdG9yc1xuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICMgaWYgYSBuZXcgbmFtZXNwYWNlIGhhcyBiZWVuIHByb3ZpZGVkIGxldHMgYWRkIGl0IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgY3NzU2VsZWN0b3JzLnB1c2ggXCJbZGF0YS1cIiArIG5zICsgXCItY29tcG9uZW50XVwiXG5cbiAgICAgICAgICAgICMgVE9ETzogQWNjZXNzIHRoZXNlIERPTSBmdW5jdGlvbmFsaXR5IHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgJChzZWxlY3RvcikuZmluZChjc3NTZWxlY3RvcnMuam9pbignLCcpKS5lYWNoIChpLCBjb21wKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUgY29tcCBhbHJlYWR5IGhhcyB0aGUgcGVzdGxlLWd1aWQgYXR0YWNoZWQsIGl0IG1lYW5zXG4gICAgICAgICAgICAgICAgIyBpdCB3YXMgYWxyZWFkeSBzdGFydGVkLCBzbyB3ZSdsbCBvbmx5IGxvb2sgZm9yIHVubml0aWFsaXplZFxuICAgICAgICAgICAgICAgICMgY29tcG9uZW50cyBoZXJlXG4gICAgICAgICAgICAgICAgdW5sZXNzICQoY29tcCkuZGF0YSgncGVzdGxlLWd1aWQnKVxuXG4gICAgICAgICAgICAgICAgICAgIG5zID0gZG8gKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFRoaXMgd2F5IHdlIG9idGFpbiB0aGUgbmFtZXNwYWNlIG9mIHRoZSBjdXJyZW50IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICQoY29tcCkuZGF0YShucyArIFwiLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlXG5cbiAgICAgICAgICAgICAgICAgICAgIyBvcHRpb25zIHdpbGwgaG9sZCBhbGwgdGhlIGRhdGEtKiBhdHRyaWJ1dGVzIHJlbGF0ZWQgdG8gdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gQ29tcG9uZW50LnBhcnNlQ29tcG9uZW50T3B0aW9ucyhALCBucylcblxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeyBuYW1lOiBvcHRpb25zLm5hbWUsIG9wdGlvbnM6IG9wdGlvbnMgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RcblxuICAgICAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgaW4gY2hhcmdlIG9mIHBhcnNpbmcgYWxsIHRoZSBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAjIGRlZmluZWQgaW4gdGhlIGl0cyAkZWwgbWFya3VwIGFuZCBwbGFjaW5nIHRoZW0gaW4gYSBvYmplY3RcbiAgICAgICAgQHBhcnNlQ29tcG9uZW50T3B0aW9uczogKGVsLCBuYW1lc3BhY2UsIG9wdHMpIC0+XG4gICAgICAgICAgICBvcHRpb25zID0gQmFzZS51dGlsLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcbiAgICAgICAgICAgIGxlbmd0aCA9IDBcblxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggZGF0YSwgKHYsIGspIC0+XG5cbiAgICAgICAgICAgICAgICAjIHJlbW92ZXMgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGsgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIG5hbWVzcGFjZSksIFwiXCIpXG5cbiAgICAgICAgICAgICAgICAjIGRlY2FtZWxpemUgdGhlIG9wdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgayA9IGsuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBrLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBrZXkgaXMgZGlmZmVyZW50IGZyb20gXCJjb21wb25lbnRcIiBpdCBtZWFucyBpdCBpc1xuICAgICAgICAgICAgICAgICMgYW4gb3B0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgayAhPSBcImNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSB2XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCsrXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdlxuXG4gICAgICAgICAgICAjIGFkZCBvbmUgYmVjYXVzZSB3ZSd2ZSBhZGRlZCAnZWwnIGF1dG9tYXRpY2FsbHkgYXMgYW4gZXh0cmEgb3B0aW9uXG4gICAgICAgICAgICBvcHRpb25zLmxlbmd0aCA9IGxlbmd0aCArIDFcblxuICAgICAgICAgICAgIyBidWlsZCBhZCByZXR1cm4gdGhlIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgIENvbXBvbmVudC5idWlsZE9wdGlvbnNPYmplY3QobmFtZSwgb3B0aW9ucylcblxuXG4gICAgICAgIEBidWlsZE9wdGlvbnNPYmplY3Q6IChuYW1lLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBvcHRpb25zLm5hbWUgPSBuYW1lXG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zXG5cbiAgICAgICAgQGluc3RhbnRpYXRlOiAoY29tcG9uZW50cywgYXBwKSAtPlxuXG4gICAgICAgICAgICBpZiBjb21wb25lbnRzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIG0gPSBjb21wb25lbnRzLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIG1vZHVsZXMgYXJlIGRlZmluZWQgdXNpbmcgdGhlIG1vZHVsZXMgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgIyBUT0RPOiBQcm92aWRlIGFuIGFsdGVybmF0ZSB3YXkgdG8gZGVmaW5lIHRoZVxuICAgICAgICAgICAgICAgICMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5KFBlc3RsZS5tb2R1bGVzKSBhbmQgUGVzdGxlLm1vZHVsZXNbbS5uYW1lXSBhbmQgbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZCA9IFBlc3RsZS5tb2R1bGVzW20ubmFtZV1cblxuICAgICAgICAgICAgICAgICAgICAjIGNyZWF0ZSBhIG5ldyBzYW5kYm94IGZvciB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBzYiA9IGFwcC5jcmVhdGVTYW5kYm94KG0ubmFtZSlcblxuICAgICAgICAgICAgICAgICAgICAjIGdlbmVyYXRlcyBhbiB1bmlxdWUgZ3VpZCBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtLm9wdGlvbnMuZ3VpZCA9IEJhc2UudXRpbC51bmlxdWVJZChtLm5hbWUgKyBcIl9cIilcblxuICAgICAgICAgICAgICAgICAgICAjIGluamVjdCB0aGUgc2FuZGJveCBhbmQgdGhlIG9wdGlvbnMgaW4gdGhlIG1vZHVsZSBwcm90b1xuICAgICAgICAgICAgICAgICAgICAjIEJhc2UudXRpbC5leHRlbmQgbW9kLCBzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2R4ID0gbmV3IG1vZChzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9ucylcblxuICAgICAgICAgICAgICAgICAgICAjIGluaXQgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtb2R4LmluaXRpYWxpemUoKVxuXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2Ugb2YgdGhlIGdlbmVyYXRlZCBndWlkIG9uIHRoZSBlbFxuICAgICAgICAgICAgICAgICAgICAkKG0ub3B0aW9ucy5lbCkuZGF0YSAncGVzdGxlLWd1aWQnLCBtLm9wdGlvbnMuZ3VpZFxuXG4gICAgICAgICAgICAgICAgICAgICMgc2F2ZXMgYSByZWZlcmVuY2Ugb2YgdGhlIGluaXRpYWxpemVkIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzWyBtLm9wdGlvbnMuZ3VpZCBdID0gbW9keFxuXG4gICAgICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBDb21wb25lbnQgZXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSB7fVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyA9IChzZWxlY3RvciwgYXBwKSAtPlxuXG4gICAgICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSBDb21wb25lbnQuc3RhcnRBbGwoc2VsZWN0b3IsIGFwcClcblxuICAgICAgICBhcHAuc2FuZGJveC5nZXRJbml0aWFsaXplZENvbXBvbmVudHMgPSAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZWRDb21wb25lbnRzLmFsbFxuXG4gICAgICAgIGFwcC5zYW5kYm94LmdldExhc3Rlc3RJbml0aWFsaXplZENvbXBvbmVudHMgPSAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZWRDb21wb25lbnRzLm5ld1xuXG5cbiAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBsb2FkZWRcbiAgICBhZnRlckFwcFN0YXJ0ZWQ6IChzZWxlY3RvciwgYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJDYWxsaW5nIHN0YXJ0Q29tcG9uZW50cyBmcm9tIGFmdGVyQXBwU3RhcnRlZFwiXG4gICAgICAgIHMgPSBpZiBzZWxlY3RvciB0aGVuIHNlbGVjdG9yIGVsc2UgbnVsbFxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMocywgYXBwKVxuXG4gICAgbmFtZTogJ0NvbXBvbmVudCBFeHRlbnNpb24nXG5cbiAgICAjIHRoaXMgcHJvcGVydHkgd2lsbCBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgIyB0byB2YWxpZGF0ZSB0aGUgQ29tcG9uZW50IGNsYXNzIGluIGlzb2xhdGlvblxuICAgIGNsYXNzZXMgOiBDb21wb25lbnRcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAnY29tcG9uZW50cydcbilcbiIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgdHJpZ2dlcmluZyBldmVudHMgb25jZSB0aGUgRGV2aWNlIGluIHdoaWNoIHRoZVxuICogdXNlciBpcyBuYXZpZ2F0aW5nIHRoZSBzaXRlIGlzIGRldGVjdGVkLiBJdHMgZnVjaW9uYWxpdHkgbW9zdGx5IGRlcGVuZHNcbiAqIG9uIHRoZSBjb25maWd1cmF0aW9ucyBzZXR0aW5ncyAocHJvdmlkZWQgYnkgZGVmYXVsdCwgYnV0IHRoZXkgY2FuIGJlIG92ZXJyaWRlbilcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIFJlc3BvbnNpdmVEZXNpZ25cblxuICAgICAgICBjZmcgOlxuICAgICAgICAgICAgIyBUaGlzIGxpbWl0IHdpbGwgYmUgdXNlZCB0byBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAjIHdoZW4gdGhlIHVzZXIgcmVzaXplIHRoZSB3aW5kb3dcbiAgICAgICAgICAgIHdhaXRMaW1pdDogMzAwXG5cbiAgICAgICAgICAgICMgZGVmaW5lcyBpZiB3ZSBoYXZlIHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93IG9ialxuICAgICAgICAgICAgd2luZG93UmVzaXplRXZlbnQ6IHRydWVcblxuICAgICAgICAgICAgIyBEZWZhdWx0IGJyZWFrcG9pbnRzXG4gICAgICAgICAgICBicmVha3BvaW50cyA6IFtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJtb2JpbGVcIlxuICAgICAgICAgICAgICAgICAgICAjIHVudGlsIHRoaXMgcG9pbnQgd2lsbCBiZWhhdmVzIGFzIG1vYmlsZVxuICAgICAgICAgICAgICAgICAgICBicG1pbjogMFxuICAgICAgICAgICAgICAgICAgICBicG1heDogNzY3XG4gICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInRhYmxldFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA3NjhcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDk1OVxuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgIyBieSBkZWZhdWx0IGFueXRoaW5nIGdyZWF0ZXIgdGhhbiB0YWJsZXQgaXMgYSBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZGVza3RvcFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA5NjBcbiAgICAgICAgICAgIF1cblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXRlY3REZXZpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jaGVja1ZpZXdwb3J0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfYXR0YWNoV2luZG93SGFuZGxlcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2V0RGV2aWNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9yZXNpemVIYW5kbGVyXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICBAX2F0dGFjaFdpbmRvd0hhbmRsZXJzKCkgaWYgQGNvbmZpZy53aW5kb3dSZXNpemVFdmVudFxuXG4gICAgICAgICAgICBAZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBfYXR0YWNoV2luZG93SGFuZGxlcnM6ICgpIC0+XG5cbiAgICAgICAgICAgIGxhenlSZXNpemUgPSBCYXNlLnV0aWwuZGVib3VuY2UgQF9yZXNpemVIYW5kbGVyLCBAY29uZmlnLndhaXRMaW1pdFxuXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGxhenlSZXNpemUpXG5cbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXI6ICgpIC0+XG4gICAgICAgICAgICAjIHRyaWdnZXJzIGEgd2luZG93c3Jlc2l6ZSBldmVudCBzbyB0aGlzIHdheSB3ZSBoYXZlIGEgY2VudHJhbGl6ZWRcbiAgICAgICAgICAgICMgd2F5IHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93cyBhbmQgdGhlIGNvbXBvbmVuc1xuICAgICAgICAgICAgIyBjYW4gbGlzdGVuIGRpcmVjdGx5IHRvIHRoaXMgZXZlbnQgaW5zdGVhZCBvZiBkZWZpbmluZyBhIG5ldyBsaXN0ZW5lclxuICAgICAgICAgICAgUGVzdGxlLmVtaXQgXCJyd2Q6d2luZG93cmVzaXplXCJcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgZGV0ZWN0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICBicCA9IEBjb25maWcuYnJlYWtwb2ludHNcblxuICAgICAgICAgICAgdnAgPSBCYXNlLnZwLnZpZXdwb3J0VygpXG5cbiAgICAgICAgICAgICMgZ2V0IGEgcmVmZXJlbmNlIChpZiBhbnkpIHRvIHRoZSBjb3JyZXNwb25kaW5nIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICMgZGVmaW5lZCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgdnBkID0gQF9jaGVja1ZpZXdwb3J0KHZwLCBicClcblxuICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5IHZwZFxuXG4gICAgICAgICAgICAgICAgY2FwaXRhbGl6ZWRCUE5hbWUgPSBCYXNlLnV0aWwuc3RyaW5nLmNhcGl0YWxpemUodnBkLm5hbWUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIyBsZXQncyBmaXN0IGNoZWNrIGlmIHdlIGhhdmUgYSBtZXRob2QgdG8gZGV0ZWN0IHRoZSBkZXZpY2UgdGhyb3VnaCBVQVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cbiAgICAgICAgICAgICAgICAgICAgVUFEZXRlY3RvciA9IEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cblxuICAgICAgICAgICAgICAgICMgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgcmVzdWx0IG9mIGEgVUEgY2hlY2suXG4gICAgICAgICAgICAgICAgIyBVbmxlc3MgdGhlcmUgaXMgYSBtZXRob2QgdG8gY2hlY2sgdGhlIFVBLCBsZXRzXG4gICAgICAgICAgICAgICAgIyBsZWF2ZSBpdCBhcyBmYWxzZSBhbmQgdXNlIG9ubHkgdGhlIHZpZXdwb3J0IHRvXG4gICAgICAgICAgICAgICAgIyBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAgICAgc3RhdGVVQSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gVUFEZXRlY3RvclxuXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBVQURldGVjdG9yKClcblxuICAgICAgICAgICAgICAgICMgRmluYWwgY2hlY2suIEZpcnN0IHdlJ2xsIHRyeSB0byBtYWtlIHRvIG1ha2UgdGhlIGRlY2lzaW9uXG4gICAgICAgICAgICAgICAgIyB1cG9uIHRoZSBjdXJyZW50IGRldmljZSBiYXNlZCBvbiBVQSwgaWYgaXMgbm90IHBvc3NpYmxlLCBsZXRzIGp1c3RcbiAgICAgICAgICAgICAgICAjIHVzZSB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICBpZiBzdGF0ZVVBIG9yIHZwZC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICMgVHJpZ2dlciBhIGV2ZW50IHRoYXQgZm9sbG93cyB0aGUgZm9sbG93aW5nIG5hbWluZyBjb252ZW50aW9uXG4gICAgICAgICAgICAgICAgICAgICMgcndkOjxkZXZpY2U+XG4gICAgICAgICAgICAgICAgICAgICMgRXhhbXBsZTogcndkOnRhYmxldCBvciByd2Q6bW9iaWxlXG5cbiAgICAgICAgICAgICAgICAgICAgZXZ0ID0gJ3J3ZDonICsgdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIERlc2lnbiBleHRlbnNpb24gaXMgdHJpZ2dlcmluZyB0aGUgZm9sbG93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBldnRcblxuICAgICAgICAgICAgICAgICAgICBQZXN0bGUuZW1pdCBldnRcblxuICAgICAgICAgICAgICAgICAgICAjIFN0b3JlIHRoZSBjdXJyZW50IGRldmljZVxuICAgICAgICAgICAgICAgICAgICBAZGV2aWNlID0gdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbXNnID0gXCJbZXh0XSBUaGUgcGFzc2VkIHNldHRpbmdzIHRvIHRoZSBSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1pZ2h0IG5vdCBiZSBjb3JyZWN0IHNpbmNlIHdlIGhhdmVuJ3QgYmVlbiBhYmxlIHRvIGRldGVjdCBhbiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXNvY2lhdGVkIGJyZWFrcG9pbnQgdG8gdGhlIGN1cnJlbnQgdmlld3BvcnRcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgZ2V0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gQGRldmljZVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogZGV0ZWN0IGlmIHRoZSBjdXJyZW50IHZpZXdwb3J0XG4gICAgICAgICAqIGNvcnJlc3BvbmQgdG8gYW55IG9mIHRoZSBkZWZpbmVkIGJwIGluIHRoZSBjb25maWcgc2V0dGluZ1xuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHZwIFtudW1iZXIuIEN1cnJlbnQgdmlld3BvcnRdXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gYnJlYWtwb2ludHMgW2Nsb25lIG9mIHRoZSBicmVha3BvaW50IGtleSBvYmplY3RdXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gdGhlIGJyZWFrcG9pbnQgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgY3VycmVudGx5XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWQgdmlld3BvcnRcbiAgICAgICAgIyMjXG4gICAgICAgIF9jaGVja1ZpZXdwb3J0OiAodnAsIGJyZWFrcG9pbnRzKSAtPlxuXG4gICAgICAgICAgICBicmVha3BvaW50ID0gQmFzZS51dGlsLmZpbHRlcihicmVha3BvaW50cywgKGJwKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBzdGFydHMgY2hlY2tpbmcgaWYgdGhlIGRldGVjdGVkIHZpZXdwb3J0IGlzXG4gICAgICAgICAgICAgICAgIyBiaWdnZXIgdGhhbiB0aGUgYnBtaW4gZGVmaW5lZCBpbiB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICMgaXRlcmF0ZWQgYnJlYWtwb2ludFxuICAgICAgICAgICAgICAgIGlmIHZwID49IGJwLmJwbWluXG5cbiAgICAgICAgICAgICAgICAgICAgIyB3ZSdsbCBuZWVkIHRvIGNoZWNrIHRoaXMgd2F5IGJlY2F1c2UgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAjIGlmIGEgQlAgZG9lc24ndCBoYXZlIGEgYnBtYXggcHJvcGVydHkgaXQgbWVhbnNcbiAgICAgICAgICAgICAgICAgICAgIyBpcyB0aGUgbGFzdCBhbmQgYmlnZ2VyIGNhc2UgdG8gY2hlY2suIEJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpcyBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIGJwLmJwbWF4IGFuZCBicC5icG1heCAhPSAwXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgaXQncyB3aXRoaW4gdGhlIHJhbmdlLCBhbGwgZ29vZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdnAgPD0gYnAuYnBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBzaG91bGQgb25seSBiZSB0cnVlIGluIG9ubHkgb25lIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgQnkgZGVmYXVsdCwganVzdCBmb3IgZGVza3RvcCB3aGljaCBkb2Vzbid0IGhhdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICMgYW4gXCJ1bnRpbFwiIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlXG5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgYnJlYWtwb2ludC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyZWFrcG9pbnQuc2hpZnQoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB7fVxuXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBjb25maWcgPSB7fVxuXG4gICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICBpZiBhcHAuY29uZmlnLmV4dGVuc2lvbiBhbmQgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cbiAgICAgICAgICAgIGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyB7fSwgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cblxuICAgICAgICByd2QgPSBuZXcgUmVzcG9uc2l2ZURlc2lnbihjb25maWcpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkID0gKCkgLT5cbiAgICAgICAgICAgICMgY2FsbCBkZXRlY3QgRGV2aWNlIGluIG9yZGVyIHRvIHRyaWdnZXIgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICMgZGV2aWNlIGV2ZW50XG4gICAgICAgICAgICByd2QuZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QuZ2V0RGV2aWNlID0gKCkgLT5cblxuICAgICAgICAgICAgcndkLmdldERldmljZSgpXG5cbiAgICAjIHRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBvbmVudHMgaGF2ZSBiZWVuXG4gICAgIyBpbml0aWFsaXplZFxuICAgIGFmdGVyQXBwSW5pdGlhbGl6ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcImFmdGVyQXBwSW5pdGlhbGl6ZWQgbWV0aG9kIGZyb20gUmVzcG9uc2l2ZURlc2lnblwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkKClcblxuICAgIG5hbWU6ICdSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24nXG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ3Jlc3BvbnNpdmVkZXNpZ24nXG4pIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBiZSBoYW5kbGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlSW1hZ2VzXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgQXJyYXkgb2Ygc3VwcG9ydGVkIFBpeGVsIHdpZHRoIGZvciBpbWFnZXNcbiAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogWzEzMywxNTIsMTYyLDIyNSwyMTAsMjI0LDI4MCwzNTIsNDcwLDUzNiw1OTAsNjc2LDcxMCw3NjgsODg1LDk0NSwxMTkwXVxuXG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlciBwaXhlbCByYXRpb3NcbiAgICAgICAgICAgIGF2YWlsYWJsZVBpeGVsUmF0aW9zOiBbMSwgMiwgM11cblxuICAgICAgICAgICAgIyBTZWxlY3RvciB0byBiZSB1c2VkIHdoZW4gaW5zdGFudGluZyBJbWFnZXJcbiAgICAgICAgICAgIGRlZmF1bHRTZWxlY3RvciA6ICcuZGVsYXllZC1pbWFnZS1sb2FkJ1xuXG4gICAgICAgICAgICAjIGxhenkgbW9kZSBlbmFibGVkXG4gICAgICAgICAgICBsYXp5bW9kZSA6IHRydWVcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlTGlzdGVuZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlSW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQGNmZywgY29uZmlnXG5cbiAgICAgICAgICAgIEBfaW5pdCgpXG5cbiAgICAgICAgX2luaXQ6ICgpIC0+XG5cbiAgICAgICAgICAgICMgY3JlYXRlcyBsaXN0ZW5lcnMgdG8gYWxsb3cgdGhlIGluc3RhbnRpYXRvbiBvZiB0aGUgSW1hZ2VyXG4gICAgICAgICAgICAjIGluIGxhenkgbG9hZCBtb2RlLlxuICAgICAgICAgICAgIyBVc2VmdWwgZm9yIGluZmluaXRlIHNjcm9sbHMgb3IgaW1hZ2VzIGNyZWF0ZWQgb24gZGVtYW5kXG4gICAgICAgICAgICBAX2NyZWF0ZUxpc3RlbmVycygpIGlmIEBjb25maWcubGF6eW1vZGVcblxuICAgICAgICAgICAgIyBBcyBzb29uIGFzIHRoaXMgZXh0ZW5zaW9uIGlzIGluaXRpYWxpemVkIHdlIGFyZSBnb25uYSBiZSBjcmVhdGluZ1xuICAgICAgICAgICAgIyB0aGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICAgICAgICAgIEBfY3JlYXRlSW5zdGFuY2UoKVxuXG4gICAgICAgIF9jcmVhdGVMaXN0ZW5lcnM6ICgpIC0+XG4gICAgICAgICAgICAjIHRoaXMgZ2l2ZXMgdGhlIGFiaWxpdHkgdG8gY3JlYXRlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICAjIGJ5IHRyaWdnZXIgdGhpcyBldmVudCB3aXRoIG9wdGlvbmFsIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIFBlc3RsZS5vbiAncmVzcG9uc2l2ZWltYWdlczpjcmVhdGUnLCBAX2NyZWF0ZUluc3RhbmNlXG5cbiAgICAgICAgX2NyZWF0ZUluc3RhbmNlIDogKG9wdGlvbnMgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBjcmVhdGluZyBhIG5ldyBJbWFnZXIgaW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBzZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3Igb3IgQGNvbmZpZy5kZWZhdWx0U2VsZWN0b3JcbiAgICAgICAgICAgIG9wdHMgPSBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkgb3B0aW9ucyB0aGVuIG9wdGlvbnMgZWxzZSBAY29uZmlnXG5cbiAgICAgICAgICAgIG5ldyBCYXNlLkltYWdlcihzZWxlY3Rvciwgb3B0cylcblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgIyBDaGVjayBpZiB0aGUgZXh0ZW5zaW9uIGhhcyBhIGN1c3RvbSBjb25maWcgdG8gdXNlXG4gICAgICAgIGlmIGFwcC5jb25maWcuZXh0ZW5zaW9uIGFuZCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJlc3BvbnNpdmVpbWFnZXMgPSAoKSAtPlxuXG4gICAgICAgICAgICBycCA9IG5ldyBSZXNwb25zaXZlSW1hZ2VzKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0cmlnZ2VyIHRoZSBldmVudCB0byBsZXQgZXZlcnlib2R5IGtub3dzIHRoYXQgdGhpcyBleHRlbnNpb24gZmluaXNoZWRcbiAgICAgICAgICAgICMgaXRzIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICBQZXN0bGUuZW1pdCAncmVzcG9uc2l2ZWltYWdlczppbml0aWFsaXplZCdcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlSW1hZ2VzXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzKClcblxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWltYWdlcydcbilcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBDb29raWVzKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBjb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpXG5cbiAgICAjIEV4cG9zZSBDb29raWVzIEFQSVxuICAgIENvb2tpZXMgPVxuXG4gICAgICAgIHNldDogKGtleSwgdmFsdWUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLnNldCBrZXksIHZhbHVlLCBvcHRpb25zXG5cbiAgICAgICAgZ2V0OiAoa2V5KSAtPlxuICAgICAgICAgICAgY29va2llcy5nZXQga2V5XG5cbiAgICAgICAgZXhwaXJlOiAoa2V5LCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgY29va2llcy5leHBpcmUga2V5LCBvcHRpb25zXG5cbiAgICByZXR1cm4gQ29va2llc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBEZXZpY2VEZXRlY3Rpb24pIC0+XG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBpc01vYmlsZSA9IHJlcXVpcmUoJ2lzbW9iaWxlanMnKVxuXG4gICAgIyBFeHBvc2UgZGV2aWNlIGRldGVjdGlvbiBBUElcbiAgICBEZXZpY2VEZXRlY3Rpb24gPVxuXG4gICAgICAgICMgR3JvdXBzXG4gICAgICAgIGlzTW9iaWxlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUucGhvbmVcblxuICAgICAgICBpc1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLnRhYmxldFxuXG4gICAgICAgICMgQXBwbGUgZGV2aWNlc1xuICAgICAgICBpc0lwaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnBob25lXG5cbiAgICAgICAgaXNJcG9kOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuaXBvZFxuXG4gICAgICAgIGlzSXBhZDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnRhYmxldFxuXG4gICAgICAgIGlzQXBwbGUgOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuZGV2aWNlXG5cbiAgICAgICAgIyBBbmRyb2lkIGRldmljZXNcbiAgICAgICAgaXNBbmRyb2lkUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnBob25lXG5cbiAgICAgICAgaXNBbmRyb2lkVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC50YWJsZXRcblxuICAgICAgICBpc0FuZHJvaWREZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLmRldmljZVxuXG4gICAgICAgICMgV2luZG93cyBkZXZpY2VzXG4gICAgICAgIGlzV2luZG93c1Bob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5waG9uZVxuXG4gICAgICAgIGlzV2luZG93c1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MudGFibGV0XG5cbiAgICAgICAgaXNXaW5kb3dzRGV2aWNlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5kZXZpY2VcblxuICAgIHJldHVybiBEZXZpY2VEZXRlY3Rpb25cbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXZlbnRCdXMpIC0+XG5cbiAgICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCd3b2xmeTg3LWV2ZW50ZW1pdHRlcicpXG5cbiAgICAjIyMqXG4gICAgICogY2xhc3MgdGhhdCBzZXJ2ZXMgYXMgYSBmYWNhZGUgZm9yIHRoZSBFdmVudEVtaXR0ZXIgY2xhc3NcbiAgICAjIyNcbiAgICBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50RW1pdHRlclxuXG4gICAgcmV0dXJuIEV2ZW50QnVzXG4pIiwiIyMjKlxuICogVGhlIEV4dGVuc2lvbiBNYW5hbmdlciB3aWxsIHByb3ZpZGUgdGhlIGJhc2Ugc2V0IG9mIGZ1bmN0aW9uYWxpdGllc1xuICogdG8gbWFrZSB0aGUgQ29yZSBsaWJyYXJ5IGV4dGVuc2libGUuXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0TWFuYWdlcikgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBFeHRNYW5hZ2VyXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBEZWZhdWx0cyBjb25maWdzIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBfZXh0ZW5zaW9uQ29uZmlnRGVmYXVsdHM6XG4gICAgICAgICAgICBhY3RpdmF0ZWQgOiB0cnVlICMgdW5sZXNzIHNhaWQgb3RoZXJ3aXNlLCBldmVyeSBhZGRlZCBleHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB3aWxsIGJlIGFjdGl2YXRlZCBvbiBzdGFydFxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICAgICAgIyB0byBrZWVwIHRyYWNrIG9mIGFsbCBleHRlbnNpb25zXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMgPSBbXVxuXG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGluaXRpYWxpemVkIGV4dGVuc2lvblxuICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMgPSBbXVxuXG4gICAgICAgIGFkZDogKGV4dCkgLT5cblxuICAgICAgICAgICAgIyBjaGVja3MgaWYgdGhlIG5hbWUgZm9yIHRoZSBleHRlbnNpb24gaGF2ZSBiZWVuIGRlZmluZWQuXG4gICAgICAgICAgICAjIGlmIG5vdCBsb2cgYSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgIHVubGVzcyBleHQubmFtZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiVGhlIGV4dGVuc2lvbiBkb2Vzbid0IGhhdmUgYSBuYW1lIGFzc29jaWF0ZWQuIEl0IHdpbGwgYmUgaGVwZnVsbCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCJpZiB5b3UgaGF2ZSBhc3NpbmcgYWxsIG9mIHlvdXIgZXh0ZW5zaW9ucyBhIG5hbWUgZm9yIGJldHRlciBkZWJ1Z2dpbmdcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICMgTGV0cyB0aHJvdyBhbiBlcnJvciBpZiB3ZSB0cnkgdG8gaW5pdGlhbGl6ZSB0aGUgc2FtZSBleHRlbnNpb24gdHdpY2VzXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAX2V4dGVuc2lvbnMsICh4dCwgaSkgLT5cbiAgICAgICAgICAgICAgICBpZiBfLmlzRXF1YWwgeHQsIGV4dFxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHRlbnNpb246IFwiICsgZXh0Lm5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIilcblxuICAgICAgICAgICAgQF9leHRlbnNpb25zLnB1c2goZXh0KVxuXG4gICAgICAgIGluaXQgOiAoY29udGV4dCkgLT5cbiAgICAgICAgICAgIHh0Y2xvbmUgPSBCYXNlLnV0aWwuY2xvbmUgQF9leHRlbnNpb25zXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJBZGRlZCBleHRlbnNpb25zIChzdGlsbCBub3QgaW5pdGlhbGl6ZWQpOlwiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyB4dGNsb25lXG5cbiAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihAX2V4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJJbml0aWFsaXplZCBleHRlbnNpb25zOlwiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgaWYgQF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkKHh0LCBjb250ZXh0LmNvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgIyB0aGlzIHN0YXRlIGNvdWxkIHRlbGwgdG8gdGhlIHJlc3Qgb2YgdGhlIHdvcmxkIGlmXG4gICAgICAgICAgICAgICAgICAgICMgZXh0ZW5zaW9ucyBoYXMgYmVlbiBpbml0aWFsaXplZCBvciBub3RcbiAgICAgICAgICAgICAgICAgICAgeHQuYWN0aXZhdGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgICMgY2FsbCB0byB0aGUgZXh0ZW5zaW9uIGluaXRpYWxpemUgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dClcblxuICAgICAgICAgICAgICAgICAgICAjIEtlZXAgdHJhY2sgb2YgdGhlIGluaXRpYWxpemVkIGV4dGVuc2lvbnMgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgeHQuYWN0aXZhdGVkID0gZmFsc2VcblxuICAgICAgICAgICAgICAgICMgY2FsbCB0aGlzIG1ldGhvZCByZWN1cnNpdmVseSB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZVxuICAgICAgICAgICAgICAgICMgZWxlbWVudHMgaW4gdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQ6ICh4dCwgY29uZmlnKSAtPlxuXG4gICAgICAgICAgICAjIGZpcnN0IHdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIFwib3B0aW9uc1wiIGtleSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAjIGJ5IHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIHVubGVzcyB4dC5vcHRpb25LZXlcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBvcHRpb25LZXkgaXMgcmVxdWlyZWQgYW5kIHdhcyBub3QgZGVmaW5lZCBieTogXCIgKyB4dC5uYW1lXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgIyBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWQgdG8gdGhlIGV4dGVuc2lvbiwgbGV0cyBjaGVjayBqdXN0IGZvciBcImFjdGl2YXRlZFwiXG4gICAgICAgICAgICAjIHdoaWNoIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IHNob3VsZCBtYXR0ZXIgd2l0aGluIHRoaXMgbWV0aG9kXG4gICAgICAgICAgICBpZiBjb25maWcuZXh0ZW5zaW9uIGFuZCBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0gYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uaGFzT3duUHJvcGVydHkgJ2FjdGl2YXRlZCdcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWQgPSBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uYWN0aXZhdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gQF9leHRlbnNpb25Db25maWdEZWZhdWx0cy5hY3RpdmF0ZWRcblxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2YXRlZFxuXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9uQnlOYW1lIDogKG5hbWUpIC0+XG4gICAgICAgICAgICBCYXNlLnV0aWwud2hlcmUgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgICAgIGdldEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfZXh0ZW5zaW9ucywgb3B0aW9uS2V5OiBuYW1lXG5cbiAgICByZXR1cm4gRXh0TWFuYWdlclxuXG4pXG4iLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVXRpbHMpIC0+XG5cbiAgICAjIEV4cG9zZSBVdGlscyBBUElcbiAgICBVdGlscyA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIGxpYnJhcnkgdmVyc2lvbmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgdmVyc2lvbkNvbXBhcmUgOiAodjEsIHYyLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBpc1ZhbGlkUGFydCA9ICh4KSAtPlxuICAgICAgICAgICAgICAgICgoaWYgbGV4aWNvZ3JhcGhpY2FsIHRoZW4gL15cXGQrW0EtWmEtel0qJC8gZWxzZSAvXlxcZCskLykpLnRlc3QgeFxuXG4gICAgICAgICAgICBsZXhpY29ncmFwaGljYWwgPSBvcHRpb25zIGFuZCBvcHRpb25zLmxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgemVyb0V4dGVuZCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMuemVyb0V4dGVuZFxuICAgICAgICAgICAgdjFwYXJ0cyA9IHYxLnNwbGl0KFwiLlwiKVxuICAgICAgICAgICAgdjJwYXJ0cyA9IHYyLnNwbGl0KFwiLlwiKVxuXG4gICAgICAgICAgICByZXR1cm4gTmFOIGlmIG5vdCB2MXBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KSBvciBub3QgdjJwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydClcblxuICAgICAgICAgICAgaWYgemVyb0V4dGVuZFxuICAgICAgICAgICAgICAgIHYxcGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MXBhcnRzLmxlbmd0aCA8IHYycGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgdjJwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYycGFydHMubGVuZ3RoIDwgdjFwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgdW5sZXNzIGxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgICAgIHYxcGFydHMgPSB2MXBhcnRzLm1hcChOdW1iZXIpXG4gICAgICAgICAgICAgICAgdjJwYXJ0cyA9IHYycGFydHMubWFwKE51bWJlcilcblxuICAgICAgICAgICAgaSA9IC0xXG4gICAgICAgICAgICB3aGlsZSBpIDwgdjFwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgICAgIGlmIHYycGFydHMubGVuZ3RoIDwgaVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGlmIHYxcGFydHNbaV0gPT0gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjFwYXJ0c1tpXSA+IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYycGFydHNbaV0gPiB2MXBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuXG4gICAgICAgICAgICByZXR1cm4gLTEgaWYgdjFwYXJ0cy5sZW5ndGggIT0gdjJwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICBzdHJpbmc6XG4gICAgICAgICAgICBjYXBpdGFsaXplOiAoc3RyKSAtPlxuICAgICAgICAgICAgICAgIHN0ciA9IChpZiBub3Qgc3RyPyB0aGVuIFwiXCIgZWxzZSBTdHJpbmcoc3RyKSlcbiAgICAgICAgICAgICAgICBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcblxuICAgIHJldHVybiBVdGlsc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBMb2dnZXIpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGxvZ2xldmVsID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBFeHBvc2UgdGhlIExvZ2dlciBBUElcbiAgICBMb2dnZXIgPVxuXG4gICAgICAgIHNldExldmVsOiAobGV2ZWwpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5zZXRMZXZlbChsZXZlbClcblxuICAgICAgICB0cmFjZTogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnRyYWNlKG1zZylcblxuICAgICAgICBkZWJ1ZzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmRlYnVnKG1zZylcblxuICAgICAgICBpbmZvOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuaW5mbyhtc2cpXG5cbiAgICAgICAgd2FybjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLndhcm4obXNnKVxuXG4gICAgICAgIGVycm9yOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZXJyb3IobXNnKVxuXG4gICAgcmV0dXJuIExvZ2dlclxuKSIsIiMjIypcbiAqIFRoaXMgd2lsbCBwcm92aWRlIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGRlZmluZSBNb2R1bGVzXG4gKiBhbmQgcHJvdmlkZSBhIHdheSB0byBleHRlbmQgdGhlbVxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE1vZHVsZSkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLi9iYXNlLmNvZmZlZScpXG5cbiAgICAjIHRoaXMgd2lsbCBzZXJ2ZSBhcyB0aGUgYmFzZSBjbGFzcyBmb3IgYSBNb2R1bGVcbiAgICBjbGFzcyBNb2R1bGVcbiAgICAgICAgY29uc3RydWN0b3I6IChvcHQpIC0+XG4gICAgICAgICAgICBAc2FuZGJveCA9IG9wdC5zYW5kYm94XG4gICAgICAgICAgICBAb3B0aW9ucyA9IG9wdC5vcHRpb25zXG4gICAgICAgICAgICBAc2V0RWxlbWVudCgpXG5cblxuICAgICMgdGhpcyBjbGFzcyB3aWxsIGV4cG9zZSBzdGF0aWMgbWV0aG9kcyB0byBhZGQsIGV4dGVuZCBhbmRcbiAgICAjIGdldCB0aGUgbGlzdCBvZiBhZGRlZCBtb2R1bGVzXG4gICAgY2xhc3MgTW9kdWxlc1xuXG4gICAgICAgICMgdGhpcyB3aWxsIGhvbGQgdGhlIGxpc3Qgb2YgYWRkZWQgbW9kdWxlc1xuICAgICAgICBAbGlzdCA6IHt9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBqdXN0IGFuIGFsaWFzIGZvciB0aGUgZXh0ZW5kIG1ldGhvZFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nXX0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gZGVmaW5pdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQGFkZCA6IChuYW1lLCBkZWZpbml0aW9uKSAtPlxuICAgICAgICAgICAgQGV4dGVuZChuYW1lLCBkZWZpbml0aW9uLCBNb2R1bGUpXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBnZXR0ZXIgZm9yIHJldHJpZXZpbmcgbW9kdWxlcyBkZWZpbml0aW9uc1xuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG5hbWVcbiAgICAgICAgICogQHJldHVybiB7W0Z1bmN0aW9uL3VuZGVmaW5lZF19XG4gICAgICAgICMjI1xuICAgICAgICBAZ2V0IDogKG5hbWUpIC0+XG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcobmFtZSkgYW5kIEBsaXN0W25hbWVdXG4gICAgICAgICAgICAgICAgcmV0dXJuIEBsaXN0W25hbWVdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogdGhpcyB3aWxsIGFsbG93cyB1cyB0byBzaW1wbGlmeSBhbmQgaGF2ZSBtb3JlIGNvbnRyb2xcbiAgICAgICAgICogb3ZlciBhZGRpbmcvZGVmaW5pbmcgbW9kdWxlc1xuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nXX0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gZGVmaW5pdGlvblxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nL0Z1bmN0aW9uXX0gQmFzZUNsYXNzXG4gICAgICAgICMjI1xuICAgICAgICBAZXh0ZW5kIDogKG5hbWUsIGRlZmluaXRpb24sIEJhc2VDbGFzcykgLT5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgQmFzZS51dGlsLmlzT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgICAgICAgICAgIyBpZiBubyBCYXNlQ2xhc3MgaXMgcGFzc2VkLCBieSBkZWZhdWx0IHdlJ2xsIHVzZSB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICBCYXNlQ2xhc3MgPSBNb2R1bGVcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgYXJlIHBhc3NpbmcgdGhlIEJhc2VDbGFzcyBhcyBhIHN0cmluZywgaXQgbWVhbnMgdGhhdCBjbGFzc1xuICAgICAgICAgICAgICAgICAgICAjIHNob3VsZCBoYXZlIGJlZW4gYWRkZWQgcHJldmlvdXNseSwgc28gd2UnbGwgbG9vayB1bmRlciB0aGUgbGlzdCBvYmpcbiAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgIyBjaGVjayBpZiB0aGUgY2xhc3MgaGFzIGJlZW4gYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgYmMgPSBAbGlzdFtCYXNlQ2xhc3NdXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIHRoZSBkZWZpbml0aW9uIGV4aXN0cywgbGV0cyBhc3NpZ24gaXQgdG8gQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBiY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIG5vdCwgbGV0cyB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbTW9kdWxlLyAnKyBuYW1lICsnIF06IGlzIHRyeWluZyB0byBleHRlbmQgWycgKyBCYXNlQ2xhc3MgKyAnXSB3aGljaCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgICAgICAgICAgICAgICAgICAjIGlmIGl0IGlzIGEgZnVuY3Rpb24sIHdlJ2xsIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICAjIFRPRE86IGRvIHNvbWUgY2hlY2tpbmcgYmVmb3JlIHRyeWluZyB0byB1c2UgaXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IEJhc2VDbGFzc1xuXG4gICAgICAgICAgICAgICAgZXh0ZW5kZWRDbGFzcyA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICMgd2UnbGwgb25seSB0cnkgdG8gYWRkIHRoaXMgZGVmaW5pdGlvbiBpbiBjYXNlXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5oYXMgQGxpc3QsIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgIyBleHRlbmRzIHRoZSBjdXJyZW50IGRlZmluaXRpb24gd2l0aCB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZGVkRGVmaW5pdGlvbiA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHN0b3JlIHRoZSByZWZlcmVuY2UgZm9yIGxhdGVyIHVzYWdlXG4gICAgICAgICAgICAgICAgICAgIEBsaXN0W25hbWVdID0gZXh0ZW5kZWREZWZpbml0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuZGVkRGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpbmZvcm0gdGhlIGRldnMgdGhhdCBzb21lb25lIGlzIHRyeWluZyB0byBhZGQgYSBtb2R1bGUnc1xuICAgICAgICAgICAgICAgICAgICAjIGRlZmluaXRpb24gdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbQ29tcG9uZW50OicgKyBuYW1lICsgJ10gaGF2ZSBhbHJlYWR5IGJlZW4gZGVmaW5lZCcgXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgQmFzZS51dGlsLmV4dGVuZCBNb2R1bGU6OiwgQmFzZS5FdmVudHMsXG5cbiAgICAgICAgIyB0aGlzIGhhcyB0byBiZSBvdmV3cml0dGVuIGJ5IHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICBpbml0aWFsaXplOiAoKSAtPlxuICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQvJyArIEBvcHRpb25zLm5hbWUgKyAnXTonICsgJ0RvZXNuXFwndCBoYXZlIGFuIGluaXRpYWxpemUgbWV0aG9kIGRlZmluZWQnXG4gICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIHNldEVsZW1lbnQ6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIEBlbCA9IEBvcHRpb25zLmVsXG4gICAgICAgICAgICBAJGVsID0gJChAZWwpXG5cbiAgICAgICAgICAgIEBkZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgZGVsZWdhdGVFdmVudHM6IChldmVudHMpIC0+XG4gICAgICAgICAgICAjIHJlZ2V4IHRvIHNwbGl0IHRoZSBldmVudHMga2V5IChzZXBhcmF0ZXMgdGhlIGV2ZW50IGZyb20gdGhlIHNlbGVjdG9yKVxuICAgICAgICAgICAgZGVsZWdhdGVFdmVudFNwbGl0dGVyID0gL14oXFxTKylcXHMqKC4qKSQvXG5cbiAgICAgICAgICAgICMgaWYgdGhlIGV2ZW50cyBvYmplY3QgaXMgbm90IGRlZmluZWQgb3IgcGFzc2VkIGFzIGEgcGFyYW1ldGVyXG4gICAgICAgICAgICAjIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgcmV0dXJuICAgIHVubGVzcyBldmVudHMgb3IgKGV2ZW50cyA9IEJhc2UudXRpbC5yZXN1bHQoQCwgXCJldmVudHNcIikpXG4gICAgICAgICAgICAjIGJlZm9yZSB0cnlpbmcgdG8gYXR0YWNoIG5ldyBldmVudHMsIGxldHMgcmVtb3ZlIGFueSBwcmV2aW91c1xuICAgICAgICAgICAgIyBhdHRhY2hlZCBldmVudFxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuXG4gICAgICAgICAgICBmb3Iga2V5IG9mIGV2ZW50c1xuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kIG5hbWVcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBldmVudHNba2V5XVxuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kJ3MgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IEBbZXZlbnRzW2tleV1dICAgIHVubGVzcyBCYXNlLnV0aWwuaXNGdW5jdGlvbihtZXRob2QpXG4gICAgICAgICAgICAgICAgY29udGludWUgICAgdW5sZXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIG1hdGNoID0ga2V5Lm1hdGNoKGRlbGVnYXRlRXZlbnRTcGxpdHRlcilcbiAgICAgICAgICAgICAgICBAZGVsZWdhdGUgbWF0Y2hbMV0sIG1hdGNoWzJdLCBCYXNlLnV0aWwuYmluZChtZXRob2QsIEApXG5cbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgZGVsZWdhdGU6IChldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikgLT5cbiAgICAgICAgICAgIEAkZWwub24gZXZlbnROYW1lICsgXCIucGVzdGxlRXZlbnRcIiArIEBvcHRpb25zLmd1aWQsIHNlbGVjdG9yLCBsaXN0ZW5lclxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICB1bmRlbGVnYXRlRXZlbnRzOiAoKSAtPlxuICAgICAgICAgICAgQCRlbC5vZmYoJy5wZXN0bGVFdmVudCcgKyBAb3B0aW9ucy5ndWlkKSAgICBpZiBAJGVsXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgICMgYnkgZGVmYXVsdCwgaXQgd2lsbCByZW1vdmUgZXZlbnRsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGVcbiAgICAgICAgIyAkZWwgZnJvbSB0aGUgRE9NXG4gICAgICAgIHN0b3A6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICBAJGVsLnJlbW92ZSgpIGlmIEAkZWxcblxuICAgICMgSGVscGVyc1xuICAgIGV4dGVuZCA9IChwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgLT5cbiAgICAgICAgcGFyZW50ID0gQFxuXG4gICAgICAgICMgVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgICAgICAjICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgICAgICAjIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3RvclxuICAgICAgICBpZiBwcm90b1Byb3BzIGFuZCBCYXNlLnV0aWwuaGFzKHByb3RvUHJvcHMsIFwiY29uc3RydWN0b3JcIilcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGlsZCA9IC0+XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGx5IEAsIGFyZ3VtZW50c1xuXG4gICAgICAgICMgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gICAgICAgIEJhc2UudXRpbC5leHRlbmQgY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHNcblxuICAgICAgICAjIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgICAgICMgYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgICAgU3Vycm9nYXRlID0gLT5cbiAgICAgICAgICAgIEBjb25zdHJ1Y3RvciA9IGNoaWxkXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBTdXJyb2dhdGU6OiA9IHBhcmVudDo6XG4gICAgICAgIGNoaWxkOjogPSBuZXcgU3Vycm9nYXRlXG5cbiAgICAgICAgIyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgICAgICAgIyBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZDo6LCBwcm90b1Byb3BzICAgIGlmIHByb3RvUHJvcHNcblxuICAgICAgICAjIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBpbml0aWFsaXplIG1ldGhvZCBzbyBpdCBjYW4gYmUgY2FsbGVkXG4gICAgICAgICMgZnJvbSBpdHMgY2hpbGRzXG4gICAgICAgIGNoaWxkOjpfc3VwZXJfID0gcGFyZW50Ojppbml0aWFsaXplXG5cbiAgICAgICAgcmV0dXJuIGNoaWxkXG5cbiAgICAjIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBiYXNlIGNsYXNzIGZvciBtb2R1bGVzXG4gICAgTW9kdWxlcy5Nb2R1bGUgPSBNb2R1bGVcblxuICAgIHJldHVybiBNb2R1bGVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZlcnNpb25DaGVja2VyKSAtPlxuXG4gICAgbG9nID0gcmVxdWlyZSAnLi9sb2dnZXIuY29mZmVlJ1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi9nZW5lcmFsLmNvZmZlZSdcblxuICAgICMgRXhwb3NlIFZlcnNpb25DaGVja2VyIEFQSVxuICAgIFZlcnNpb25DaGVja2VyID1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdG8gY2hlY2sgdmVyc2lvbmluZyBmb3IgYWxsIHRoZSBkZWZpbmVkIGxpYnJhcmllc1xuICAgICAgICAgKiB3aXRoaW4gdGhlIGRlcGVuZGVuY3kgYXJyYXlcbiAgICAgICAgIyMjXG4gICAgICAgIGNoZWNrOiAoZGVwZW5kZW5jaWVzKSAtPlxuXG4gICAgICAgICAgICBpZiBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgZHAgPSBkZXBlbmRlbmNpZXMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgdW5sZXNzIGRwLm9ialxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBkcC5uYW1lICsgXCIgaXMgYSBoYXJkIGRlcGVuZGVuY3kgYW5kIGl0IGhhcyB0byBiZSBsb2FkZWQgYmVmb3JlIHBlc3RsZS5qc1wiXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgICMgY29tcGFyZSB0aGUgdmVyc2lvblxuICAgICAgICAgICAgICAgIHVubGVzcyBVdGlscy52ZXJzaW9uQ29tcGFyZShkcC52ZXJzaW9uLCBkcC5yZXF1aXJlZCkgPj0gMFxuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUgaXQgbWVhbnMgdGhlIGxvYWRlZCBsaWJyYXJ5IGRvZXN0IG5vdCBmdWxmaWxsIG91ciBuZWVkc1xuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIltGQUlMXSBcIiArIGRwLm5hbWUgKyBcIjogdmVyc2lvbiByZXF1aXJlZDogXCIgKyBkcC5yZXF1aXJlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIDwtLT4gTG9hZGVkIHZlcnNpb246IFwiICsgZHAudmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cblxuICAgIHJldHVybiBWZXJzaW9uQ2hlY2tlclxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWaWV3cG9ydCkgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCd2ZXJnZScpXG5cbiAgICAjIEV4cG9zZSBWaWV3cG9ydCBkZXRlY3Rpb24gQVBJXG4gICAgVmlld3BvcnQgPVxuXG4gICAgICAgIHZpZXdwb3J0VzogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0VygpXG5cbiAgICAgICAgdmlld3BvcnRIOiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRIKClcblxuICAgICAgICB2aWV3cG9ydDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0KClcblxuICAgICAgICBpblZpZXdwb3J0OiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblZpZXdwb3J0KGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5YKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5ZKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIHNjcm9sbFg6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxYKClcblxuICAgICAgICBzY3JvbGxZOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWSgpXG5cbiAgICAgICAgIyBUbyB0ZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlXG4gICAgICAgIG1xOiAobWVkaWFRdWVyeVN0cmluZykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0Lm1xKG1lZGlhUXVlcnlTdHJpbmcpXG5cbiAgICAgICAgcmVjdGFuZ2xlOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5yZWN0YW5nbGUoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgIyBpZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIHRoZW4gaXQgcmV0dXJucyB0aGUgYXNwZWN0XG4gICAgICAgICMgcmF0aW8gb2YgdGhlIHZpZXdwb3J0LiBJZiBhbiBlbGVtZW50IGlzIHBhc3NlZCBpdCByZXR1cm5zXG4gICAgICAgICMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZWxlbWVudFxuICAgICAgICBhc3BlY3Q6IChvKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuYXNwZWN0KG8pXG5cbiAgICByZXR1cm4gVmlld3BvcnRcbikiXX0=
