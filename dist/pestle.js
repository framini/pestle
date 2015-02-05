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
            .replace(/\.(jpg|gif|bmp|png|jpeg)[^s]?({width})?[^s]({pixel_ratio})?/gi, '.' + this.adaptSelector + '.$2.$3' + squareSelector + '.$1');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9jb29raWVzLWpzL3NyYy9jb29raWVzLmpzIiwibm9kZV9tb2R1bGVzL2ltYWdlci5qcy9JbWFnZXIuanMiLCJub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJub2RlX21vZHVsZXMvdmVyZ2UvdmVyZ2UuanMiLCJub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V4dG1hbmFnZXIuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9nZW5lcmFsLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbW9kdWxlLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVBRmxDO0FBQUEsQ0FBRCxDQUFBLENBSUUsTUFKRixFQUlVLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUVOLE1BQUEsZ0JBQUE7QUFBQSxFQUFBLElBQUEsR0FBYSxPQUFBLENBQVMsZUFBVCxDQUFiLENBQUE7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVMsMEJBQVQsQ0FEYixDQUFBO0FBQUEsRUFJQSxNQUFBLEdBQWEsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSmIsQ0FBQTtBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFTLHNCQUFULENBTmhCLENBQUE7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBVGpCLENBQUE7QUFBQSxFQVdNLE1BQU0sQ0FBQztBQUVULG1CQUFBLE9BQUEsR0FBVSxPQUFWLENBQUE7O0FBQUEsbUJBRUEsR0FBQSxHQUNJO0FBQUEsTUFBQSxLQUFBLEVBQ0k7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFWO09BREo7QUFBQSxNQUdBLFNBQUEsRUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGRBO0FBQUE7Ozs7O0dBQUE7QUFBQSxDQU1DLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtT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ZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyMqXG4gKiBUaGUgY29yZSBsYXllciB3aWxsIGRlcGVuZCBvbiB0aGUgYmFzZSBsYXllciBhbmQgd2lsbCBwcm92aWRlXG4gKiB0aGUgY29yZSBzZXQgb2YgZnVuY3Rpb25hbGl0eSB0byBhcHBsaWNhdGlvbiBmcmFtZXdvcmtcbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5QZXN0bGUgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFBlc3RsZSkgLT5cblxuICAgIEJhc2UgICAgICAgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcbiAgICBFeHRNYW5hZ2VyID0gcmVxdWlyZSgnLi91dGlsL2V4dG1hbmFnZXIuY29mZmVlJylcblxuICAgICMgd2UnbGwgdXNlIHRoZSBQZXN0bGUgb2JqZWN0IGFzIHRoZSBnbG9iYWwgRXZlbnQgYnVzXG4gICAgUGVzdGxlID0gbmV3IEJhc2UuRXZlbnRzKClcblxuICAgIFBlc3RsZS5Nb2R1bGUgPSByZXF1aXJlKCcuL3V0aWwvbW9kdWxlLmNvZmZlZScpXG5cbiAgICAjIE5hbWVzcGFjZSBmb3IgbW9kdWxlIGRlZmluaXRpb25cbiAgICBQZXN0bGUubW9kdWxlcyA9IHt9XG5cbiAgICBjbGFzcyBQZXN0bGUuQ29yZVxuICAgICAgICAjIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeVxuICAgICAgICB2ZXJzaW9uOiBcIjAuMC4xXCJcblxuICAgICAgICBjZmc6XG4gICAgICAgICAgICBkZWJ1ZzpcbiAgICAgICAgICAgICAgICBsb2dMZXZlbDogNSAjIGJ5IGRlZmF1bHQgdGhlIGxvZ2dpbmcgd2lsbCBiZSBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdmFsdWVzIGNhbiBnbyBmcm9tIDAgdG8gNSAoNSBtZWFucyBkaXNhYmxlZClcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ3BsYXRmb3JtJ1xuXG4gICAgICAgICAgICBleHRlbnNpb246IHt9ICMgZGVmaW5lIHRoZSBuYW1lc3BhY2UgdG8gZGVmaW5lIGV4dGVuc2lvbiBzcGVjaWZpYyBzZXR0aW5nc1xuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG4gICAgICAgICAgICAjIGluaXRpYWxpemUgdGhlIGNvbmZpZyBvYmplY3RcbiAgICAgICAgICAgIEBzZXRDb25maWcoY29uZmlnKVxuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFRoZSBleHRlbnNpb24gbWFuYWdlciB3aWxsIGJlIG9uIGNoYXJnZSBvZiBsb2FkaW5nIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICMgYW5kIG1ha2UgaXRzIGZ1bmN0aW9uYWxpdHkgYXZhaWxhYmxlIHRvIHRoZSBzdGFja1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIgPSBuZXcgRXh0TWFuYWdlcigpXG5cbiAgICAgICAgICAgICMgdGhyb3VnaCB0aGlzIG9iamVjdCB0aGUgbW9kdWxlcyB3aWxsIGJlIGFjY2VzaW5nIHRoZSBtZXRob2RzIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gQmFzZS51dGlsLmNsb25lIEJhc2VcblxuICAgICAgICAgICAgIyBuYW1lc3BhY2UgdG8gaG9sZCBhbGwgdGhlIHNhbmRib3hlc1xuICAgICAgICAgICAgQHNhbmRib3hlcyA9IHt9XG5cbiAgICAgICAgICAgICMgUmVxdWlyZSBjb3JlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZScpXG4gICAgICAgICAgICBSZXNwb25zaXZlRGVzaWduID0gcmVxdWlyZSgnLi9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZUltYWdlcyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVpbWFnZXMuY29mZmVlJylcblxuICAgICAgICAgICAgIyBBZGQgY29yZSBleHRlbnNpb25zIHRvIHRoZSBhcHBcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChDb21wb25lbnRzKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVEZXNpZ24pXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoUmVzcG9uc2l2ZUltYWdlcylcblxuICAgICAgICBhZGRFeHRlbnNpb246IChleHQpIC0+XG4gICAgICAgICAgICAjIHdlJ2xsIG9ubHkgYWxsb3cgdG8gYWRkIG5ldyBleHRlbnNpb25zIGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgQ29yZSBnZXQgc3RhcnRlZFxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKGV4dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4gWW91IGNhbiBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG5vdCBhZGQgZXh0ZW5zaW9ucyB3aGVuIHRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4nKVxuXG4gICAgICAgICMgcHJvdmlkZXMgYSB3YXkgZm9yIHNldHRpbmcgdXAgY29uZmlnc1xuICAgICAgICAjIGFmdGVyIFBlc3RsZSBoYXMgYmVlbiBpbnN0YW50aWF0ZWRcbiAgICAgICAgc2V0Q29uZmlnOiAoY29uZmlnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzT2JqZWN0IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUgaXQgbWVhbnMgUGVzdGxlIGhhcyBiZWVuIGFscmVhZHkgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAgICAgIyBkdXJpbmcgaW5zdGFudGlhdGlvbiwgc28gd2UnbGwgdXNlIHRoZSBjb25maWcgb2JqZWN0IGFzIGFcbiAgICAgICAgICAgICAgICAgICAgIyBwcm92aWRlciBmb3IgZGVmYXVsdCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRW1wdHkgQGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyBjb25maWcsIEBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBpdCBpcyBlbXB0eSwgaXQgbWVhbnMgd2UgYXJlIGdvaW5nIHNldHRpbmcgdXAgUGVzdGxlIGZvclxuICAgICAgICAgICAgICAgICAgICAjIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMgY29uZmlnLCBAY2ZnXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIltzZXRDb25maWcgbWV0aG9kXSBvbmx5IGFjY2VwdCBhbiBvYmplY3QgYXMgYSBwYXJhbWV0ZXIgYW5kIHlvdSdyZSBwYXNzaW5nOiBcIiArIHR5cGVvZiBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IobXNnKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKFwiVGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLiBZb3UgY2FuIG5vdCBhZGQgbmV3IGV4dGVuc2lvbnMgYXQgdGhpcyBwb2ludC5cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChzZWxlY3RvciA9ICcnKSAtPlxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgbGV0IHVzIGluaXRpYWxpemUgY29tcG9uZW50cyBhdCBhIGxhdGVyIHN0YWdlXG4gICAgICAgICAgICBpZiBAc3RhcnRlZCBhbmQgc2VsZWN0b3IgaXNudCAnJ1xuXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlBlc3RsZSBpcyBpbml0aWFsaXppbmcgYSBjb21wb25lbnRcIilcblxuICAgICAgICAgICAgICAgIEBzYW5kYm94LnN0YXJ0Q29tcG9uZW50cyBzZWxlY3RvciwgQFxuXG5cbiAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSwgaXQgbWVhbnMgaXQgaXMgdGhlIGZpc3QgdGltZSB0aGUgc3RhcnRcbiAgICAgICAgICAgICMgbWV0aG9kIGlzIGNhbGxlZCBhbmQgd2UnbGwgaGF2ZSB0byBpbml0aWFsaXplIGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlBlc3RsZSBzdGFydGVkIHRoZSBpbml0aWFsaXppbmcgcHJvY2Vzc1wiKVxuXG4gICAgICAgICAgICAgICAgQHN0YXJ0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAjIEluaXQgYWxsIHRoZSBleHRlbnNpb25zXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAgICAgIyBDYWxsYmFjayBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZFxuICAgICAgICAgICAgICAgICMgYWZ0ZXIgYWxsIGV4dGVuc2lvbnMgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYW5kIHRoZSBlYWNoIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgICAgICMgbWV0aG9kIGV4ZWN1dGVkXG4gICAgICAgICAgICAgICAgY2IgPSAkLkNhbGxiYWNrcyBcInVuaXF1ZSBtZW1vcnlcIlxuXG4gICAgICAgICAgICAgICAgIyBPbmNlIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBpbml0aWFsaXplZCwgbGV0cyBjYWxsIHRoZSBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAjIGZyb20gZWFjaCBleHRlbnNpb25cbiAgICAgICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICAgICAjICAgICAgIG9uY2UgdGhlIGFwcCBoYXMgc3RhcnRlZC5cbiAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAZXh0TWFuYWdlci5nZXRJbml0aWFsaXplZEV4dGVuc2lvbnMoKSwgKGV4dCwgaSkgPT5cblxuICAgICAgICAgICAgICAgICAgICBpZiBleHRcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24oZXh0LmFmdGVyQXBwU3RhcnRlZCkgYW5kIGV4dC5hY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHNpbmNlIHRoZSBjb21wb25lbnQgZXh0ZW5zaW9uIGlzIHRoZSBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZm9yIGluaXRpYWxpemluZyB0aGUgYXBwLCB3ZSdsbCBnaXZlIGl0IHNwZWNpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRyZWF0bWVudCBhbmQgZ2l2ZSBpdCB0aGUgYWJpbGl0eSB0byByZWNlaXZlIGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBleHRyYSBwYXJhbWV0ZXIgKHRvIHN0YXJ0IGNvbXBvbmVudHMgdGhhdCBvbmx5IGJlbG9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdG8gYSBwYXJ0aWN1bGFyIERPTSBlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGV4dC5vcHRpb25LZXkgaXMgXCJjb21wb25lbnRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZCBzZWxlY3RvciwgQFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZChAKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbihleHQuYWZ0ZXJBcHBJbml0aWFsaXplZCkgYW5kIGV4dC5hY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5hZGQgZXh0LmFmdGVyQXBwSW5pdGlhbGl6ZWRcblxuICAgICAgICAgICAgICAgICMgQ2FsbCB0aGUgLmFmdGVyQXBwSW5pdGlhbGl6ZWQgY2FsbGJhY2tzIHdpdGggQCBhcyBwYXJhbWV0ZXJcbiAgICAgICAgICAgICAgICBjYi5maXJlIEBcblxuICAgICAgICBjcmVhdGVTYW5kYm94OiAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ZXNbbmFtZV0gPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAc2FuZGJveCwgbmFtZSA6IG5hbWVcblxuICAgICAgICBnZXRJbml0aWFsaXplZENvbXBvbmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAc2FuZGJveC5nZXRJbml0aWFsaXplZENvbXBvbmVudHMoKVxuXG5cbiAgICByZXR1cm4gUGVzdGxlXG4pXG4iLCIvKlxyXG4gKiBDb29raWVzLmpzIC0gMS4xLjBcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1Njb3R0SGFtcGVyL0Nvb2tpZXNcclxuICpcclxuICogVGhpcyBpcyBmcmVlIGFuZCB1bmVuY3VtYmVyZWQgc29mdHdhcmUgcmVsZWFzZWQgaW50byB0aGUgcHVibGljIGRvbWFpbi5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVzLmpzIHJlcXVpcmVzIGEgYHdpbmRvd2Agd2l0aCBhIGBkb2N1bWVudGAgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQ29va2llcyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cclxuICAgICAgICAgICAgICAgIENvb2tpZXMuZ2V0KGtleSkgOiBDb29raWVzLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xyXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAvLyBVc2VkIHRvIGVuc3VyZSBjb29raWUga2V5cyBkbyBub3QgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgLy8gYnVpbHQtaW4gYE9iamVjdGAgcHJvcGVydGllc1xyXG4gICAgICAgIENvb2tpZXMuX2NhY2hlS2V5UHJlZml4ID0gJ2Nvb2tleS4nOyAvLyBIdXJyIGh1cnIsIDopXHJcblxyXG4gICAgICAgIENvb2tpZXMuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgIT09IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5fY2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBrZXldO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcclxuXHJcbiAgICAgICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcclxuICAgICAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9pc1ZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAhaXNOYU4oZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xyXG4gICAgICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgZXhwaXJlcykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzogZXhwaXJlcyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzogZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGlyZXMgJiYgIUNvb2tpZXMuX2lzVmFsaWREYXRlKGV4cGlyZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BleHBpcmVzYCBwYXJhbWV0ZXIgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHZhbGlkIERhdGUgaW5zdGFuY2UnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XHJcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb29raWVTdHJpbmcgPSBrZXkgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMucGF0aCA/ICc7cGF0aD0nICsgb3B0aW9ucy5wYXRoIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmRvbWFpbiA/ICc7ZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbiA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5leHBpcmVzID8gJztleHBpcmVzPScgKyBvcHRpb25zLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5zZWN1cmUgPyAnO3NlY3VyZScgOiAnJztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVTdHJpbmc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0Q2FjaGVGcm9tU3RyaW5nID0gZnVuY3Rpb24gKGRvY3VtZW50Q29va2llKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVDYWNoZSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgY29va2llc0FycmF5ID0gZG9jdW1lbnRDb29raWUgPyBkb2N1bWVudENvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPSBjb29raWVLdnAudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVDYWNoZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGNvb2tpZVN0cmluZykge1xyXG4gICAgICAgICAgICAvLyBcIj1cIiBpcyBhIHZhbGlkIGNoYXJhY3RlciBpbiBhIGNvb2tpZSB2YWx1ZSBhY2NvcmRpbmcgdG8gUkZDNjI2NSwgc28gY2Fubm90IGBzcGxpdCgnPScpYFxyXG4gICAgICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBjb29raWVTdHJpbmcuaW5kZXhPZignPScpO1xyXG5cclxuICAgICAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcclxuICAgICAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cigwLCBzZXBhcmF0b3JJbmRleCkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29va2llc0V4cG9ydCA9IHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnID8gZmFjdG9yeShnbG9iYWwpIDogZmFjdG9yeTtcclxuXHJcbiAgICAvLyBBTUQgc3VwcG9ydFxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb29raWVzRXhwb3J0OyB9KTtcclxuICAgIC8vIENvbW1vbkpTL05vZGUuanMgc3VwcG9ydFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29va2llc0V4cG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpOyIsIjtcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZGVmYXVsdFdpZHRocywgZ2V0S2V5cywgbmV4dFRpY2ssIGFkZEV2ZW50LCBnZXROYXR1cmFsV2lkdGg7XG5cbiAgICBuZXh0VGljayA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYXBwbHlFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrRWFjaCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIG5ld19jb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb25baV0gPSBjYWxsYmFja0VhY2goY29sbGVjdGlvbltpXSwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3X2NvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0dXJuRGlyZWN0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldE5hdHVyYWxXaWR0aCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSwgJ25hdHVyYWxXaWR0aCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRTggYW5kIGJlbG93IGxhY2tzIHRoZSBuYXR1cmFsV2lkdGggcHJvcGVydHlcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNvdXJjZS5zcmM7XG4gICAgICAgICAgICByZXR1cm4gaW1nLndpZHRoO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBhZGRFdmVudCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhZGRTdGFuZGFyZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZElFRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBmbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIGRlZmF1bHRXaWR0aHMgPSBbOTYsIDEzMCwgMTY1LCAyMDAsIDIzNSwgMjcwLCAzMDQsIDM0MCwgMzc1LCA0MTAsIDQ0NSwgNDg1LCA1MjAsIDU1NSwgNTkwLCA2MjUsIDY2MCwgNjk1LCA3MzZdO1xuXG4gICAgZ2V0S2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5rZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIG5ldyBJbWFnZXIgaW5zdGFuY2UsIHBhc3NpbmcgYW4gb3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QuXG5cbiAgICAgICAgRXhhbXBsZSB1c2FnZTpcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEF2YWlsYWJsZSB3aWR0aHMgZm9yIHlvdXIgaW1hZ2VzXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbTnVtYmVyXSxcblxuICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yIHRvIGJlIHVzZWQgdG8gbG9jYXRlIHlvdXIgZGl2IHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnJyxcblxuICAgICAgICAgICAgICAgIC8vIENsYXNzIG5hbWUgdG8gZ2l2ZSB5b3VyIHJlc2l6YWJsZSBpbWFnZXNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gSWYgc2V0IHRvIHRydWUsIEltYWdlciB3aWxsIHVwZGF0ZSB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgcmVsZXZhbnQgaW1hZ2VzXG4gICAgICAgICAgICAgICAgb25SZXNpemU6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBUb2dnbGUgdGhlIGxhenkgbG9hZCBmdW5jdGlvbmFsaXR5IG9uIG9yIG9mZlxuICAgICAgICAgICAgICAgIGxhenlsb2FkOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAgICAgLy8gVXNlZCBhbG9uZ3NpZGUgdGhlIGxhenlsb2FkIGZlYXR1cmUgKGhlbHBzIHBlcmZvcm1hbmNlIGJ5IHNldHRpbmcgYSBoaWdoZXIgZGVsYXkpXG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsYXk6IE51bWJlclxuICAgICAgICAgICAgfVxuXG4gICAgICAgIEBwYXJhbSB7b2JqZWN0fSBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAgICAgIEByZXR1cm4ge29iamVjdH0gaW5zdGFuY2Ugb2YgSW1hZ2VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gSW1hZ2VyKGVsZW1lbnRzLCBvcHRzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGRvYyA9IGRvY3VtZW50O1xuXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICAgIGlmIChlbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyBzZWxlY3RvciBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5zZWxlY3RvciA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyB0aGUgYG9wdHNgIG9iamVjdCwgYGVsZW1lbnRzYCBpcyBpbXBsaWNpdGx5IHRoZSBgb3B0cy5zZWxlY3RvcmAgc3RyaW5nXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudHMubGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wdHMgPSBlbGVtZW50cztcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuID0gW107XG4gICAgICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG9wdHMuc2VsZWN0b3IgfHwgJy5kZWxheWVkLWltYWdlLWxvYWQnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdHMuY2xhc3NOYW1lIHx8ICdpbWFnZS1yZXBsYWNlJztcbiAgICAgICAgdGhpcy5naWYgPSBkb2MuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIHRoaXMuZ2lmLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhFQUFKQUlBQUFQLy8vd0FBQUNINUJBRUFBQUFBTEFBQUFBQVFBQWtBQUFJS2hJK3B5KzBQbzV5VUZRQTcnO1xuICAgICAgICB0aGlzLmdpZi5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgdGhpcy5naWYuYWx0ID0gJyc7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGVsYXkgPSBvcHRzLnNjcm9sbERlbGF5IHx8IDI1MDtcbiAgICAgICAgdGhpcy5vblJlc2l6ZSA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ29uUmVzaXplJykgPyBvcHRzLm9uUmVzaXplIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXp5bG9hZCA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ2xhenlsb2FkJykgPyBvcHRzLmxhenlsb2FkIDogZmFsc2U7XG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyA9IG9wdHMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MgfHwgWzEsIDJdO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IG9wdHMuYXZhaWxhYmxlV2lkdGhzIHx8IGRlZmF1bHRXaWR0aHM7XG4gICAgICAgIHRoaXMub25JbWFnZXNSZXBsYWNlZCA9IG9wdHMub25JbWFnZXNSZXBsYWNlZCB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLndpZHRoc01hcCA9IHt9O1xuICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG4gICAgICAgIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IgPSBvcHRzLndpZHRoSW50ZXJwb2xhdG9yIHx8IHJldHVybkRpcmVjdFZhbHVlO1xuICAgICAgICB0aGlzLmRlbHRhU3F1YXJlID0gb3B0cy5kZWx0YVNxdWFyZSB8fCAxLjU7XG4gICAgICAgIHRoaXMuc3F1YXJlU2VsZWN0b3IgPSBvcHRzLnNxdWFyZVNlbGVjdG9yIHx8ICdzcXJjcm9wJztcbiAgICAgICAgdGhpcy5hZGFwdFNlbGVjdG9yID0gdGhpcy5hZGFwdFNlbGVjdG9yIHx8ICdhZGFwdCc7XG5cbiAgICAgICAgLy8gTmVlZGVkIGFzIElFOCBhZGRzIGEgZGVmYXVsdCBgd2lkdGhgL2BoZWlnaHRgIGF0dHJpYnV0ZeKAplxuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocy5sZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwKHRoaXMuYXZhaWxhYmxlV2lkdGhzLCB0aGlzLndpZHRoSW50ZXJwb2xhdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSB0aGlzLmF2YWlsYWJsZVdpZHRocztcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IGdldEtleXModGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGVsZW1lbnRzLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IGFwcGx5RWFjaChkb2MucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKSwgcmV0dXJuRGlyZWN0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuXG4gICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEltYWdlci5wcm90b3R5cGUuc2Nyb2xsQ2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IHRoaXMuaW1hZ2VzT2ZmU2NyZWVuLnNsaWNlKDApOyAvLyBjb3B5IGJ5IHZhbHVlLCBkb24ndCBjb3B5IGJ5IHJlZmVyZW5jZVxuICAgICAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHRoaXMuZGl2cyk7XG5cbiAgICAgICAgaWYgKHRoaXMub25SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJSZXNpemVFdmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eWxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJTY3JvbGxFdmVudCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY3JlYXRlR2lmID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGEgcmVzcG9uc2l2ZSBpbWFnZSB0aGVuIHdlIGRvbid0IHJlcGxhY2UgaXQgYWdhaW5cbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhefCApJyArIHRoaXMuY2xhc3NOYW1lICsgJyggfCQpJykpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtZW50Q2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnKTtcbiAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJyk7XG4gICAgICAgIHZhciBnaWYgPSB0aGlzLmdpZi5jbG9uZU5vZGUoZmFsc2UpO1xuXG4gICAgICAgIGlmIChlbGVtZW50V2lkdGgpIHtcbiAgICAgICAgICAgIGdpZi53aWR0aCA9IGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnLCBlbGVtZW50V2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2lmLmNsYXNzTmFtZSA9IChlbGVtZW50Q2xhc3NOYW1lID8gZWxlbWVudENsYXNzTmFtZSArICcgJyA6ICcnKSArIHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnYWx0JywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWx0JykgfHwgdGhpcy5naWYuYWx0KTtcblxuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGdpZiwgZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGdpZjtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgYXBwbHlFYWNoKHRoaXMuZGl2cywgZnVuY3Rpb24oZWxlbWVudCwgaSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGF6eWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1RoaXNFbGVtZW50T25TY3JlZW4oZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbWFnZXNPZmZTY3JlZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZGl2c1tpXSA9IHNlbGYuY3JlYXRlR2lmKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmlzVGhpc0VsZW1lbnRPblNjcmVlbiA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3Agd2FzIHdvcmtpbmcgaW4gQ2hyb21lIGJ1dCBkaWRuJ3Qgd29yayBvbiBGaXJlZm94LCBzbyBoYWQgdG8gcmVzb3J0IHRvIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAvLyBidXQgY2FuJ3QgZmFsbGJhY2sgdG8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgYXMgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUUgd2l0aCBhIGRvY3R5cGUgKD8pIHNvIGhhdmUgdG8gdXNlIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgdmFyIG9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0KCk7XG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0VG9wID0gMDtcblxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRPZmZzZXRUb3AgPCAodGhpcy52aWV3cG9ydEhlaWdodCArIG9mZnNldCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyA9IGZ1bmN0aW9uKGltYWdlcykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG5cbiAgICAgICAgICAgIGFwcGx5RWFjaChpbWFnZXMsIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMoaW1hZ2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkKGltYWdlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMgPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICB2YXIgY29tcHV0ZWRXaWR0aCwgc3JjLCBuYXR1cmFsV2lkdGg7XG5cbiAgICAgICAgbmF0dXJhbFdpZHRoID0gZ2V0TmF0dXJhbFdpZHRoKGltYWdlKTtcbiAgICAgICAgY29tcHV0ZWRXaWR0aCA9IHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuYXZhaWxhYmxlV2lkdGhzKGltYWdlKSA6IHRoaXMuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uKGltYWdlKTtcblxuICAgICAgICBpbWFnZS53aWR0aCA9IGNvbXB1dGVkV2lkdGg7XG5cbiAgICAgICAgaWYgKGltYWdlLnNyYyAhPT0gdGhpcy5naWYuc3JjICYmIGNvbXB1dGVkV2lkdGggPD0gbmF0dXJhbFdpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzcmMgPSB0aGlzLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnModGhpcy5idWlsZFVybFN0cnVjdHVyZShpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyksIGltYWdlKSwgY29tcHV0ZWRXaWR0aCk7XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmRldGVybWluZUFwcHJvcHJpYXRlUmVzb2x1dGlvbiA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpIHx8IGltYWdlLnBhcmVudE5vZGUuY2xpZW50V2lkdGgsIHRoaXMuYXZhaWxhYmxlV2lkdGhzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvIHZhbHVlIHVzZWQgYnkgSW1hZ2VyXG4gICAgICpcbiAgICAgKiBJdCBpcyBwZXJmb3JtZWQgYmVmb3JlIGVhY2ggcmVwbGFjZW1lbnQgbG9vcCwgaW4gY2FzZSBhIHVzZXIgem9vbWVkIGluL291dFxuICAgICAqIGFuZCB0aHVzIHVwZGF0ZWQgdGhlIGB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb2AgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICovXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWZyZXNoUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIHJlZnJlc2hQaXhlbFJhdGlvKCkge1xuICAgICAgICB0aGlzLmRldmljZVBpeGVsUmF0aW8gPSBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKEltYWdlci5nZXRQaXhlbFJhdGlvKCksIHRoaXMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnMgPSBmdW5jdGlvbihzcmMsIHNlbGVjdGVkV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHNyY1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t3aWR0aH0vZywgSW1hZ2VyLnRyYW5zZm9ybXMud2lkdGgoc2VsZWN0ZWRXaWR0aCwgdGhpcy53aWR0aHNNYXApKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3twaXhlbF9yYXRpb30vZywgSW1hZ2VyLnRyYW5zZm9ybXMucGl4ZWxSYXRpbyh0aGlzLmRldmljZVBpeGVsUmF0aW8pKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5idWlsZFVybFN0cnVjdHVyZSA9IGZ1bmN0aW9uKHNyYywgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHNxdWFyZVNlbGVjdG9yID0gdGhpcy5pc0ltYWdlQ29udGFpbmVyU3F1YXJlKGltYWdlKSA/ICcuJyArIHRoaXMuc3F1YXJlU2VsZWN0b3IgOiAnJztcblxuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwuKGpwZ3xnaWZ8Ym1wfHBuZ3xqcGVnKVtec10/KHt3aWR0aH0pP1tec10oe3BpeGVsX3JhdGlvfSk/L2dpLCAnLicgKyB0aGlzLmFkYXB0U2VsZWN0b3IgKyAnLiQyLiQzJyArIHNxdWFyZVNlbGVjdG9yICsgJy4kMScpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmlzSW1hZ2VDb250YWluZXJTcXVhcmUgPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICByZXR1cm4gKGltYWdlLnBhcmVudE5vZGUuY2xpZW50V2lkdGggLyBpbWFnZS5wYXJlbnROb2RlLmNsaWVudEhlaWdodCkgPD0gdGhpcy5kZWx0YVNxdWFyZVxuICAgIH07XG5cbiAgICBJbWFnZXIuZ2V0UGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIGdldFBpeGVsUmF0aW8oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gKGNvbnRleHQgfHwgd2luZG93KVsnZGV2aWNlUGl4ZWxSYXRpbyddIHx8IDE7XG4gICAgfTtcblxuICAgIEltYWdlci5jcmVhdGVXaWR0aHNNYXAgPSBmdW5jdGlvbiBjcmVhdGVXaWR0aHNNYXAod2lkdGhzLCBpbnRlcnBvbGF0b3IpIHtcbiAgICAgICAgdmFyIG1hcCA9IHt9LFxuICAgICAgICAgICAgaSA9IHdpZHRocy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgbWFwW3dpZHRoc1tpXV0gPSBpbnRlcnBvbGF0b3Iod2lkdGhzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfTtcblxuICAgIEltYWdlci50cmFuc2Zvcm1zID0ge1xuICAgICAgICBwaXhlbFJhdGlvOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogZnVuY3Rpb24od2lkdGgsIG1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcFt3aWR0aF0gfHwgd2lkdGg7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY2xvc2VzdCB1cHBlciB2YWx1ZS5cbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogdmFyIGNhbmRpZGF0ZXMgPSBbMSwgMS41LCAyXTtcbiAgICAgKlxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMC44LCBjYW5kaWRhdGVzKTsgLy8gLT4gMVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMSwgY2FuZGlkYXRlcyk7IC8vIC0+IDFcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDEuMywgY2FuZGlkYXRlcyk7IC8vIC0+IDEuNVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMywgY2FuZGlkYXRlcyk7IC8vIC0+IDJcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBhcGlcbiAgICAgKiBAc2luY2UgMS4wLjFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYmFzZVZhbHVlXG4gICAgICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gY2FuZGlkYXRlc1xuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICovXG4gICAgSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSA9IGZ1bmN0aW9uIGdldENsb3Nlc3RWYWx1ZShiYXNlVmFsdWUsIGNhbmRpZGF0ZXMpIHtcbiAgICAgICAgdmFyIGkgPSBjYW5kaWRhdGVzLmxlbmd0aCxcbiAgICAgICAgICAgIHNlbGVjdGVkV2lkdGggPSBjYW5kaWRhdGVzW2kgLSAxXTtcblxuICAgICAgICBiYXNlVmFsdWUgPSBwYXJzZUZsb2F0KGJhc2VWYWx1ZSwgMTApO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChiYXNlVmFsdWUgPD0gY2FuZGlkYXRlc1tpXSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkV2lkdGggPSBjYW5kaWRhdGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkV2lkdGg7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVnaXN0ZXJSZXNpemVFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgYWRkRXZlbnQod2luZG93LCAncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyhzZWxmLmRpdnMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWdpc3RlclNjcm9sbEV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuc2Nyb2xsQ2hlY2soKTtcbiAgICAgICAgfSwgc2VsZi5zY3JvbGxEZWxheSk7XG5cbiAgICAgICAgYWRkRXZlbnQod2luZG93LCAnc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnNjcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEltYWdlci5nZXRQYWdlT2Zmc2V0R2VuZXJhdG9yID0gZnVuY3Rpb24gZ2V0UGFnZVZlcnRpY2FsT2Zmc2V0KHRlc3RDYXNlKSB7XG4gICAgICAgIGlmICh0ZXN0Q2FzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaGlzIGZvcm0gaXMgdXNlZCBiZWNhdXNlIGl0IHNlZW1zIGltcG9zc2libGUgdG8gc3R1YiBgd2luZG93LnBhZ2VZT2Zmc2V0YFxuICAgIEltYWdlci5nZXRQYWdlT2Zmc2V0ID0gSW1hZ2VyLmdldFBhZ2VPZmZzZXRHZW5lcmF0b3IoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHdpbmRvdywgJ3BhZ2VZT2Zmc2V0JykpO1xuXG4gICAgLy8gRXhwb3J0aW5nIGZvciB0ZXN0aW5nIHB1cnBvc2VcbiAgICBJbWFnZXIuYXBwbHlFYWNoID0gYXBwbHlFYWNoO1xuXG4gICAgLyogZ2xvYmFsIG1vZHVsZSwgZXhwb3J0czogdHJ1ZSwgZGVmaW5lICovXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlMsIGp1c3QgZXhwb3J0XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IEltYWdlcjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQgc3VwcG9ydFxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gSW1hZ2VyO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIElmIG5vIEFNRCBhbmQgd2UgYXJlIGluIHRoZSBicm93c2VyLCBhdHRhY2ggdG8gd2luZG93XG4gICAgICAgIHdpbmRvdy5JbWFnZXIgPSBJbWFnZXI7XG4gICAgfVxuICAgIC8qIGdsb2JhbCAtbW9kdWxlLCAtZXhwb3J0cywgLWRlZmluZSAqL1xuXG59KHdpbmRvdywgZG9jdW1lbnQpKTsiLCIvKipcbiAqIGlzTW9iaWxlLmpzIHYwLjMuNVxuICpcbiAqIEEgc2ltcGxlIGxpYnJhcnkgdG8gZGV0ZWN0IEFwcGxlIHBob25lcyBhbmQgdGFibGV0cyxcbiAqIEFuZHJvaWQgcGhvbmVzIGFuZCB0YWJsZXRzLCBvdGhlciBtb2JpbGUgZGV2aWNlcyAobGlrZSBibGFja2JlcnJ5LCBtaW5pLW9wZXJhIGFuZCB3aW5kb3dzIHBob25lKSxcbiAqIGFuZCBhbnkga2luZCBvZiBzZXZlbiBpbmNoIGRldmljZSwgdmlhIHVzZXIgYWdlbnQgc25pZmZpbmcuXG4gKlxuICogQGF1dGhvcjogS2FpIE1hbGxlYSAoa21hbGxlYUBnbWFpbC5jb20pXG4gKlxuICogQGxpY2Vuc2U6IGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cbiAqL1xuKGZ1bmN0aW9uIChnbG9iYWwpIHtcblxuICAgIHZhciBhcHBsZV9waG9uZSAgICAgICAgID0gL2lQaG9uZS9pLFxuICAgICAgICBhcHBsZV9pcG9kICAgICAgICAgID0gL2lQb2QvaSxcbiAgICAgICAgYXBwbGVfdGFibGV0ICAgICAgICA9IC9pUGFkL2ksXG4gICAgICAgIGFuZHJvaWRfcGhvbmUgICAgICAgPSAvKD89LipcXGJBbmRyb2lkXFxiKSg/PS4qXFxiTW9iaWxlXFxiKS9pLCAvLyBNYXRjaCAnQW5kcm9pZCcgQU5EICdNb2JpbGUnXG4gICAgICAgIGFuZHJvaWRfdGFibGV0ICAgICAgPSAvQW5kcm9pZC9pLFxuICAgICAgICB3aW5kb3dzX3Bob25lICAgICAgID0gL0lFTW9iaWxlL2ksXG4gICAgICAgIHdpbmRvd3NfdGFibGV0ICAgICAgPSAvKD89LipcXGJXaW5kb3dzXFxiKSg/PS4qXFxiQVJNXFxiKS9pLCAvLyBNYXRjaCAnV2luZG93cycgQU5EICdBUk0nXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnkgICAgPSAvQmxhY2tCZXJyeS9pLFxuICAgICAgICBvdGhlcl9ibGFja2JlcnJ5XzEwID0gL0JCMTAvaSxcbiAgICAgICAgb3RoZXJfb3BlcmEgICAgICAgICA9IC9PcGVyYSBNaW5pL2ksXG4gICAgICAgIG90aGVyX2ZpcmVmb3ggICAgICAgPSAvKD89LipcXGJGaXJlZm94XFxiKSg/PS4qXFxiTW9iaWxlXFxiKS9pLCAvLyBNYXRjaCAnRmlyZWZveCcgQU5EICdNb2JpbGUnXG4gICAgICAgIHNldmVuX2luY2ggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJyg/OicgKyAgICAgICAgIC8vIE5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ05leHVzIDcnICsgICAgIC8vIE5leHVzIDdcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdCTlRWMjUwJyArICAgICAvLyBCJk4gTm9vayBUYWJsZXQgNyBpbmNoXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnS2luZGxlIEZpcmUnICsgLy8gS2luZGxlIEZpcmVcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdTaWxrJyArICAgICAgICAvLyBLaW5kbGUgRmlyZSwgU2lsayBBY2NlbGVyYXRlZFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0dULVAxMDAwJyArICAgIC8vIEdhbGF4eSBUYWIgNyBpbmNoXG5cbiAgICAgICAgICAgICcpJywgICAgICAgICAgICAvLyBFbmQgbm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnaScpOyAgICAgICAgICAgLy8gQ2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGluZ1xuXG4gICAgdmFyIG1hdGNoID0gZnVuY3Rpb24ocmVnZXgsIHVzZXJBZ2VudCkge1xuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh1c2VyQWdlbnQpO1xuICAgIH07XG5cbiAgICB2YXIgSXNNb2JpbGVDbGFzcyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCkge1xuICAgICAgICB2YXIgdWEgPSB1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgICAgICB0aGlzLmFwcGxlID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhcHBsZV9waG9uZSwgdWEpLFxuICAgICAgICAgICAgaXBvZDogICBtYXRjaChhcHBsZV9pcG9kLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhcHBsZV9waG9uZSwgdWEpIHx8IG1hdGNoKGFwcGxlX2lwb2QsIHVhKSB8fCBtYXRjaChhcHBsZV90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFuZHJvaWQgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogIW1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSAmJiBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgfHwgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2god2luZG93c190YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2god2luZG93c19waG9uZSwgdWEpIHx8IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vdGhlciA9IHtcbiAgICAgICAgICAgIGJsYWNrYmVycnk6ICAgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeSwgdWEpLFxuICAgICAgICAgICAgYmxhY2tiZXJyeTEwOiBtYXRjaChvdGhlcl9ibGFja2JlcnJ5XzEwLCB1YSksXG4gICAgICAgICAgICBvcGVyYTogICAgICAgIG1hdGNoKG90aGVyX29wZXJhLCB1YSksXG4gICAgICAgICAgICBmaXJlZm94OiAgICAgIG1hdGNoKG90aGVyX2ZpcmVmb3gsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogICAgICAgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeSwgdWEpIHx8IG1hdGNoKG90aGVyX2JsYWNrYmVycnlfMTAsIHVhKSB8fCBtYXRjaChvdGhlcl9vcGVyYSwgdWEpIHx8IG1hdGNoKG90aGVyX2ZpcmVmb3gsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldmVuX2luY2ggPSBtYXRjaChzZXZlbl9pbmNoLCB1YSk7XG4gICAgICAgIHRoaXMuYW55ID0gdGhpcy5hcHBsZS5kZXZpY2UgfHwgdGhpcy5hbmRyb2lkLmRldmljZSB8fCB0aGlzLndpbmRvd3MuZGV2aWNlIHx8IHRoaXMub3RoZXIuZGV2aWNlIHx8IHRoaXMuc2V2ZW5faW5jaDtcbiAgICAgICAgLy8gZXhjbHVkZXMgJ290aGVyJyBkZXZpY2VzIGFuZCBpcG9kcywgdGFyZ2V0aW5nIHRvdWNoc2NyZWVuIHBob25lc1xuICAgICAgICB0aGlzLnBob25lID0gdGhpcy5hcHBsZS5waG9uZSB8fCB0aGlzLmFuZHJvaWQucGhvbmUgfHwgdGhpcy53aW5kb3dzLnBob25lO1xuICAgICAgICAvLyBleGNsdWRlcyA3IGluY2ggZGV2aWNlcywgY2xhc3NpZnlpbmcgYXMgcGhvbmUgb3IgdGFibGV0IGlzIGxlZnQgdG8gdGhlIHVzZXJcbiAgICAgICAgdGhpcy50YWJsZXQgPSB0aGlzLmFwcGxlLnRhYmxldCB8fCB0aGlzLmFuZHJvaWQudGFibGV0IHx8IHRoaXMud2luZG93cy50YWJsZXQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIElNID0gbmV3IElzTW9iaWxlQ2xhc3MoKTtcbiAgICAgICAgSU0uQ2xhc3MgPSBJc01vYmlsZUNsYXNzO1xuICAgICAgICByZXR1cm4gSU07XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vbm9kZVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vYnJvd3NlcmlmeVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGluc3RhbnRpYXRlKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy9BTURcbiAgICAgICAgZGVmaW5lKGdsb2JhbC5pc01vYmlsZSA9IGluc3RhbnRpYXRlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGdsb2JhbC5pc01vYmlsZSA9IGluc3RhbnRpYXRlKCk7XG4gICAgfVxuXG59KSh0aGlzKTtcbiIsIi8qXHJcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcclxuKlxyXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHt9O1xyXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xyXG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIFdlIGNhbid0IGJ1aWxkIGEgcmVhbCBtZXRob2Qgd2l0aG91dCBhIGNvbnNvbGUgdG8gbG9nIHRvXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcclxuICAgICAgICB2YXIgbWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkobWV0aG9kLCBbb2JqLCBhcmd1bWVudHNdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsKTtcclxuICAgICAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXHJcbiAgICAgICAgXCJ0cmFjZVwiLFxyXG4gICAgICAgIFwiZGVidWdcIixcclxuICAgICAgICBcImluZm9cIixcclxuICAgICAgICBcIndhcm5cIixcclxuICAgICAgICBcImVycm9yXCJcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcclxuICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID8gbm9vcCA6IHNlbGYubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcclxuICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ10gPSBsZXZlbE5hbWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcblxyXG4gICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPSBcImxvZ2xldmVsPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRQZXJzaXN0ZWRMZXZlbCgpIHtcclxuICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXTtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gL2xvZ2xldmVsPShbXjtdKykvLmV4ZWMod2luZG93LmRvY3VtZW50LmNvb2tpZSlbMV07XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN0b3JlZExldmVsID0gXCJXQVJOXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqXHJcbiAgICAgKiBQdWJsaWMgQVBJXHJcbiAgICAgKlxyXG4gICAgICovXHJcblxyXG4gICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXHJcbiAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcclxuXHJcbiAgICBzZWxmLm1ldGhvZEZhY3RvcnkgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgbGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxyXG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xyXG4gICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUgJiYgbGV2ZWwgPCBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxyXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xyXG4gICAgc2VsZi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcclxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gc2VsZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUGVyc2lzdGVkTGV2ZWwoKTtcclxuICAgIHJldHVybiBzZWxmO1xyXG59KSk7XHJcbiIsIi8qIVxyXG4gKiB2ZXJnZSAxLjkuMSsyMDE0MDIxMzA4MDNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3J5YW52ZS92ZXJnZVxyXG4gKiBNSVQgTGljZW5zZSAyMDEzIFJ5YW4gVmFuIEV0dGVuXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKHJvb3QsIG5hbWUsIG1ha2UpIHtcclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGVbJ2V4cG9ydHMnXSkgbW9kdWxlWydleHBvcnRzJ10gPSBtYWtlKCk7XHJcbiAgZWxzZSByb290W25hbWVdID0gbWFrZSgpO1xyXG59KHRoaXMsICd2ZXJnZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICB2YXIgeHBvcnRzID0ge31cclxuICAgICwgd2luID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3dcclxuICAgICwgZG9jID0gdHlwZW9mIGRvY3VtZW50ICE9ICd1bmRlZmluZWQnICYmIGRvY3VtZW50XHJcbiAgICAsIGRvY0VsZW0gPSBkb2MgJiYgZG9jLmRvY3VtZW50RWxlbWVudFxyXG4gICAgLCBtYXRjaE1lZGlhID0gd2luWydtYXRjaE1lZGlhJ10gfHwgd2luWydtc01hdGNoTWVkaWEnXVxyXG4gICAgLCBtcSA9IG1hdGNoTWVkaWEgPyBmdW5jdGlvbihxKSB7XHJcbiAgICAgICAgcmV0dXJuICEhbWF0Y2hNZWRpYS5jYWxsKHdpbiwgcSkubWF0Y2hlcztcclxuICAgICAgfSA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydFcgPSB4cG9ydHNbJ3ZpZXdwb3J0VyddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRXaWR0aCddLCBiID0gd2luWydpbm5lcldpZHRoJ107XHJcbiAgICAgICAgcmV0dXJuIGEgPCBiID8gYiA6IGE7XHJcbiAgICAgIH1cclxuICAgICwgdmlld3BvcnRIID0geHBvcnRzWyd2aWV3cG9ydEgnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhID0gZG9jRWxlbVsnY2xpZW50SGVpZ2h0J10sIGIgPSB3aW5bJ2lubmVySGVpZ2h0J107XHJcbiAgICAgICAgcmV0dXJuIGEgPCBiID8gYiA6IGE7XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIFRlc3QgaWYgYSBtZWRpYSBxdWVyeSBpcyBhY3RpdmUuIExpa2UgTW9kZXJuaXpyLm1xXHJcbiAgICogQHNpbmNlIDEuNi4wXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi8gIFxyXG4gIHhwb3J0c1snbXEnXSA9IG1xO1xyXG5cclxuICAvKiogXHJcbiAgICogTm9ybWFsaXplZCBtYXRjaE1lZGlhXHJcbiAgICogQHNpbmNlIDEuNi4wXHJcbiAgICogQHJldHVybiB7TWVkaWFRdWVyeUxpc3R8T2JqZWN0fVxyXG4gICAqLyBcclxuICB4cG9ydHNbJ21hdGNoTWVkaWEnXSA9IG1hdGNoTWVkaWEgPyBmdW5jdGlvbigpIHtcclxuICAgIC8vIG1hdGNoTWVkaWEgbXVzdCBiZSBiaW5kZWQgdG8gd2luZG93XHJcbiAgICByZXR1cm4gbWF0Y2hNZWRpYS5hcHBseSh3aW4sIGFyZ3VtZW50cyk7XHJcbiAgfSA6IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gR3JhY2VmdWxseSBkZWdyYWRlIHRvIHBsYWluIG9iamVjdFxyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEBzaW5jZSAxLjguMFxyXG4gICAqIEByZXR1cm4ge3t3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXJ9fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHZpZXdwb3J0KCkge1xyXG4gICAgcmV0dXJuIHsnd2lkdGgnOnZpZXdwb3J0VygpLCAnaGVpZ2h0Jzp2aWV3cG9ydEgoKX07XHJcbiAgfVxyXG4gIHhwb3J0c1sndmlld3BvcnQnXSA9IHZpZXdwb3J0O1xyXG4gIFxyXG4gIC8qKiBcclxuICAgKiBDcm9zcy1icm93c2VyIHdpbmRvdy5zY3JvbGxYXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHhwb3J0c1snc2Nyb2xsWCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luLnBhZ2VYT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsTGVmdDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFlcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxZJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVlPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxUb3A7IFxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7e3RvcDpudW1iZXIsIHJpZ2h0Om51bWJlciwgYm90dG9tOm51bWJlciwgbGVmdDpudW1iZXJ9fSBjb29yZHNcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb24gYWRqdXN0bWVudFxyXG4gICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgKi9cclxuICBmdW5jdGlvbiBjYWxpYnJhdGUoY29vcmRzLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgbyA9IHt9O1xyXG4gICAgY3VzaGlvbiA9ICtjdXNoaW9uIHx8IDA7XHJcbiAgICBvWyd3aWR0aCddID0gKG9bJ3JpZ2h0J10gPSBjb29yZHNbJ3JpZ2h0J10gKyBjdXNoaW9uKSAtIChvWydsZWZ0J10gPSBjb29yZHNbJ2xlZnQnXSAtIGN1c2hpb24pO1xyXG4gICAgb1snaGVpZ2h0J10gPSAob1snYm90dG9tJ10gPSBjb29yZHNbJ2JvdHRvbSddICsgY3VzaGlvbikgLSAob1sndG9wJ10gPSBjb29yZHNbJ3RvcCddIC0gY3VzaGlvbik7XHJcbiAgICByZXR1cm4gbztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyb3NzLWJyb3dzZXIgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgcGx1cyBvcHRpb25hbCBjdXNoaW9uLlxyXG4gICAqIENvb3JkcyBhcmUgcmVsYXRpdmUgdG8gdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGUgdmlld3BvcnQuXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWwgZWxlbWVudCBvciBzdGFjayAodXNlcyBmaXJzdCBpdGVtKVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiArLy0gcGl4ZWwgYWRqdXN0bWVudCBhbW91bnRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R8Ym9vbGVhbn1cclxuICAgKi9cclxuICBmdW5jdGlvbiByZWN0YW5nbGUoZWwsIGN1c2hpb24pIHtcclxuICAgIGVsID0gZWwgJiYgIWVsLm5vZGVUeXBlID8gZWxbMF0gOiBlbDtcclxuICAgIGlmICghZWwgfHwgMSAhPT0gZWwubm9kZVR5cGUpIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiBjYWxpYnJhdGUoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGN1c2hpb24pO1xyXG4gIH1cclxuICB4cG9ydHNbJ3JlY3RhbmdsZSddID0gcmVjdGFuZ2xlO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHZpZXdwb3J0IGFzcGVjdCByYXRpbyAob3IgdGhlIGFzcGVjdCByYXRpbyBvZiBhbiBvYmplY3Qgb3IgZWxlbWVudClcclxuICAgKiBAc2luY2UgMS43LjBcclxuICAgKiBAcGFyYW0geyhFbGVtZW50fE9iamVjdCk9fSBvIG9wdGlvbmFsIG9iamVjdCB3aXRoIHdpZHRoL2hlaWdodCBwcm9wcyBvciBtZXRob2RzXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqIEBsaW5rIGh0dHA6Ly93My5vcmcvVFIvY3NzMy1tZWRpYXF1ZXJpZXMvI29yaWVudGF0aW9uXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gYXNwZWN0KG8pIHtcclxuICAgIG8gPSBudWxsID09IG8gPyB2aWV3cG9ydCgpIDogMSA9PT0gby5ub2RlVHlwZSA/IHJlY3RhbmdsZShvKSA6IG87XHJcbiAgICB2YXIgaCA9IG9bJ2hlaWdodCddLCB3ID0gb1snd2lkdGgnXTtcclxuICAgIGggPSB0eXBlb2YgaCA9PSAnZnVuY3Rpb24nID8gaC5jYWxsKG8pIDogaDtcclxuICAgIHcgPSB0eXBlb2YgdyA9PSAnZnVuY3Rpb24nID8gdy5jYWxsKG8pIDogdztcclxuICAgIHJldHVybiB3L2g7XHJcbiAgfVxyXG4gIHhwb3J0c1snYXNwZWN0J10gPSBhc3BlY3Q7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlc3QgaWYgYW4gZWxlbWVudCBpcyBpbiB0aGUgc2FtZSB4LWF4aXMgc2VjdGlvbiBhcyB0aGUgdmlld3BvcnQuXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb25cclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHhwb3J0c1snaW5YJ10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLnJpZ2h0ID49IDAgJiYgci5sZWZ0IDw9IHZpZXdwb3J0VygpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlc3QgaWYgYW4gZWxlbWVudCBpcyBpbiB0aGUgc2FtZSB5LWF4aXMgc2VjdGlvbiBhcyB0aGUgdmlld3BvcnQuXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb25cclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHhwb3J0c1snaW5ZJ10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIudG9wIDw9IHZpZXdwb3J0SCgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlc3QgaWYgYW4gZWxlbWVudCBpcyBpbiB0aGUgdmlld3BvcnQuXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb25cclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHhwb3J0c1snaW5WaWV3cG9ydCddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIC8vIEVxdWl2IHRvIGBpblgoZWwsIGN1c2hpb24pICYmIGluWShlbCwgY3VzaGlvbilgIGJ1dCBqdXN0IG1hbnVhbGx5IGRvIGJvdGggXHJcbiAgICAvLyB0byBhdm9pZCBjYWxsaW5nIHJlY3RhbmdsZSgpIHR3aWNlLiBJdCBnemlwcyBqdXN0IGFzIHNtYWxsIGxpa2UgdGhpcy5cclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5ib3R0b20gPj0gMCAmJiByLnJpZ2h0ID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCkgJiYgci5sZWZ0IDw9IHZpZXdwb3J0VygpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB4cG9ydHM7XHJcbn0pKTsiLCIvKiFcbiAqIEV2ZW50RW1pdHRlciB2NC4yLjExIC0gZ2l0LmlvL2VlXG4gKiBVbmxpY2Vuc2UgLSBodHRwOi8vdW5saWNlbnNlLm9yZy9cbiAqIE9saXZlciBDYWxkd2VsbCAtIGh0dHA6Ly9vbGkubWUudWsvXG4gKiBAcHJlc2VydmVcbiAqL1xuXG47KGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgbWFuYWdpbmcgZXZlbnRzLlxuICAgICAqIENhbiBiZSBleHRlbmRlZCB0byBwcm92aWRlIGV2ZW50IGZ1bmN0aW9uYWxpdHkgaW4gb3RoZXIgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBjbGFzcyBFdmVudEVtaXR0ZXIgTWFuYWdlcyBldmVudCByZWdpc3RlcmluZyBhbmQgZW1pdHRpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cblxuICAgIC8vIFNob3J0Y3V0cyB0byBpbXByb3ZlIHNwZWVkIGFuZCBzaXplXG4gICAgdmFyIHByb3RvID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcbiAgICB2YXIgZXhwb3J0cyA9IHRoaXM7XG4gICAgdmFyIG9yaWdpbmFsR2xvYmFsVmFsdWUgPSBleHBvcnRzLkV2ZW50RW1pdHRlcjtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdHMgc3RvcmFnZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gbG9vayBmb3IuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLCAtMSBpZiBub3QgZm91bmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgYSBtZXRob2Qgd2hpbGUga2VlcGluZyB0aGUgY29udGV4dCBjb3JyZWN0LCB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGlhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbGlhc0Nsb3N1cmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdpbGwgaW5pdGlhbGlzZSB0aGUgZXZlbnQgb2JqZWN0IGFuZCBsaXN0ZW5lciBhcnJheXMgaWYgcmVxdWlyZWQuXG4gICAgICogV2lsbCByZXR1cm4gYW4gb2JqZWN0IGlmIHlvdSB1c2UgYSByZWdleCBzZWFyY2guIFRoZSBvYmplY3QgY29udGFpbnMga2V5cyBmb3IgZWFjaCBtYXRjaGVkIGV2ZW50LiBTbyAvYmFbcnpdLyBtaWdodCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYmFyIGFuZCBiYXouIEJ1dCBvbmx5IGlmIHlvdSBoYXZlIGVpdGhlciBkZWZpbmVkIHRoZW0gd2l0aCBkZWZpbmVFdmVudCBvciBhZGRlZCBzb21lIGxpc3RlbmVycyB0byB0aGVtLlxuICAgICAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBjb25jYXRlbmF0ZWQgYXJyYXkgb2YgYWxsIG1hdGNoaW5nIGV2ZW50cyBpZlxuICAgICAgICAvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtrZXldID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgbGlzdCBvZiBsaXN0ZW5lciBvYmplY3RzIGFuZCBmbGF0dGVucyBpdCBpbnRvIGEgbGlzdCBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXX0gSnVzdCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZmxhdExpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF0TGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSByZXF1ZXN0ZWQgbGlzdGVuZXJzIHZpYSBnZXRMaXN0ZW5lcnMgYnV0IHdpbGwgYWx3YXlzIHJldHVybiB0aGUgcmVzdWx0cyBpbnNpZGUgYW4gb2JqZWN0LiBUaGlzIGlzIG1haW5seSBmb3IgaW50ZXJuYWwgdXNlIGJ1dCBvdGhlcnMgbWF5IGZpbmQgaXQgdXNlZnVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IGluIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgZnVuY3Rpb24gdG8gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBUaGUgbGlzdGVuZXIgd2lsbCBub3QgYmUgYWRkZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUuXG4gICAgICogSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBpdCBpcyBjYWxsZWQuXG4gICAgICogSWYgeW91IHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUgdGhlbiB0aGUgbGlzdGVuZXIgd2lsbCBiZSBhZGRlZCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXJJc1dyYXBwZWQgPSB0eXBlb2YgbGlzdGVuZXIgPT09ICdvYmplY3QnO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXJJc1dyYXBwZWQgPyBsaXN0ZW5lciA6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBvbmNlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZExpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIFNlbWktYWxpYXMgb2YgYWRkTGlzdGVuZXIuIEl0IHdpbGwgYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlXG4gICAgICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0cyBmaXJzdCBleGVjdXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZE9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZE9uY2VMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgb25jZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkT25jZUxpc3RlbmVyLlxuICAgICAqL1xuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnYWRkT25jZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuICAgICAqIFlvdSBuZWVkIHRvIHRlbGwgaXQgd2hhdCBldmVudCBuYW1lcyBzaG91bGQgYmUgbWF0Y2hlZCBieSBhIHJlZ2V4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcbiAgICAgICAgdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXMgZGVmaW5lRXZlbnQgdG8gZGVmaW5lIG11bHRpcGxlIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFdmVudChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaGVuIHBhc3NlZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSwgaXQgd2lsbCByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byByZW1vdmUgZnJvbSB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqIFllYWgsIHRoaXMgZnVuY3Rpb24gZG9lcyBxdWl0ZSBhIGJpdC4gVGhhdCdzIHByb2JhYmx5IGEgYmFkIHRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gYWRkTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoZmFsc2UsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSByZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG4gICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgZGV0ZXJtaW5lIGlmIHRoZSBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgKHRydWUpIG9yIGFkZGVkIChmYWxzZSkuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYW5pcHVsYXRlIHRoZSBsaXN0ZW5lcnMgb2YgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQvcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLm1hbmlwdWxhdGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiBtYW5pcHVsYXRlTGlzdGVuZXJzKHJlbW92ZSwgZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIHNpbmdsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXIgOiB0aGlzLmFkZExpc3RlbmVyO1xuICAgICAgICB2YXIgbXVsdGlwbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVycyA6IHRoaXMuYWRkTGlzdGVuZXJzO1xuXG4gICAgICAgIC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXRzIHByb3BlcnRpZXMgdG8gdGhpcyBtZXRob2RcbiAgICAgICAgaWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICAgICAgZm9yIChpIGluIGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkgJiYgKHZhbHVlID0gZXZ0W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvIGV2dCBtdXN0IGJlIGEgc3RyaW5nXG4gICAgICAgICAgICAvLyBBbmQgbGlzdGVuZXJzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyBMb29wIG92ZXIgaXQgYW5kIHBhc3MgZWFjaCBvbmUgdG8gdGhlIG11bHRpcGxlIG1ldGhvZFxuICAgICAgICAgICAgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgZXZ0LCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhbiBldmVudCB0aGVuIGFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIFRoYXQgbWVhbnMgZXZlcnkgZXZlbnQgd2lsbCBiZSBlbXB0aWVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gW2V2dF0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLiBXaWxsIHJlbW92ZSBmcm9tIGV2ZXJ5IGV2ZW50IGlmIG5vdCBwYXNzZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVFdmVudChldnQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZXZ0O1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRpZmZlcmVudCB0aGluZ3MgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiBldnRcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1tldnRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIGFsbCBldmVudHNcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG4gICAgICpcbiAgICAgKiBBZGRlZCB0byBtaXJyb3IgdGhlIG5vZGUgQVBJLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IGFsaWFzKCdyZW1vdmVFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG4gICAgICogV2hlbiBlbWl0dGVkLCBldmVyeSBsaXN0ZW5lciBhdHRhY2hlZCB0byB0aGF0IGV2ZW50IHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICogSWYgeW91IHBhc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGFycmF5IHRoZW4gdGhvc2UgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRvIGV2ZXJ5IGxpc3RlbmVyIHVwb24gZXhlY3V0aW9uLlxuICAgICAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cbiAgICAgKiBTbyB0aGV5IHdpbGwgbm90IGFycml2ZSB3aXRoaW4gdGhlIGFycmF5IG9uIHRoZSBvdGhlciBzaWRlLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGUuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdIE9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZ0LCBhcmdzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnNba2V5XS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCBzaGFsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBlaXRoZXIgd2l0aCBhIGJhc2ljIGNhbGwgb3IgYW4gYXBwbHkgaWYgdGhlcmUgaXMgYW4gYXJncyBhcnJheVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1trZXldW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBsaXN0ZW5lci5saXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzIHx8IFtdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGVtaXRFdmVudFxuICAgICAqL1xuICAgIHByb3RvLnRyaWdnZXIgPSBhbGlhcygnZW1pdEV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0bHkgZGlmZmVyZW50IGZyb20gZW1pdEV2ZW50IGluIHRoYXQgaXQgd2lsbCBwYXNzIGl0cyBhcmd1bWVudHMgb24gdG8gdGhlIGxpc3RlbmVycywgYXMgb3Bwb3NlZCB0byB0YWtpbmcgYSBzaW5nbGUgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHBhc3Mgb24uXG4gICAgICogQXMgd2l0aCBlbWl0RXZlbnQsIHlvdSBjYW4gcGFzcyBhIHJlZ2V4IGluIHBsYWNlIG9mIHRoZSBldmVudCBuYW1lIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gT3B0aW9uYWwgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZ0KSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdEV2ZW50KGV2dCwgYXJncyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmIGFcbiAgICAgKiBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhlIG9uZSBzZXQgaGVyZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIGFmdGVyIGV4ZWN1dGlvbi4gVGhpcyB2YWx1ZSBkZWZhdWx0cyB0byB0cnVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIHRvIGNoZWNrIGZvciB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uc2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gc2V0T25jZVJldHVyblZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uY2VSZXR1cm5WYWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWZcbiAgICAgKiB0aGUgbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoaXMgb25lIHRoZW4gaXQgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICAgKiBhdXRvbWF0aWNhbGx5LiBJdCB3aWxsIHJldHVybiB0cnVlIGJ5IGRlZmF1bHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHsqfEJvb2xlYW59IFRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGZvciBvciB0aGUgZGVmYXVsdCwgdHJ1ZS5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gX2dldE9uY2VSZXR1cm5WYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ19vbmNlUmV0dXJuVmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGV2ZW50cyBvYmplY3QgYW5kIGNyZWF0ZXMgb25lIGlmIHJlcXVpcmVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXZlbnRzIHN0b3JhZ2Ugb2JqZWN0LlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRFdmVudHMgPSBmdW5jdGlvbiBfZ2V0RXZlbnRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldmVydHMgdGhlIGdsb2JhbCB7QGxpbmsgRXZlbnRFbWl0dGVyfSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhpcyB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IE5vbiBjb25mbGljdGluZyBFdmVudEVtaXR0ZXIgY2xhc3MuXG4gICAgICovXG4gICAgRXZlbnRFbWl0dGVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IG9yaWdpbmFsR2xvYmFsVmFsdWU7XG4gICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgfTtcblxuICAgIC8vIEV4cG9zZSB0aGUgY2xhc3MgZWl0aGVyIHZpYSBBTUQsIENvbW1vbkpTIG9yIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG59LmNhbGwodGhpcykpO1xuIiwiIyMjKlxuICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBsYXllciBpcyB0byBkZWNsYXJlIGFuZCBhYnN0cmFjdCB0aGUgYWNjZXNzIHRvXG4gKiB0aGUgY29yZSBiYXNlIG9mIGxpYnJhcmllcyB0aGF0IHRoZSByZXN0IG9mIHRoZSBzdGFjayAodGhlIGFwcCBmcmFtZXdvcmspXG4gKiB3aWxsIGRlcGVuZC5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBBcnJheSB0aGF0IGhvbGRzIGhhcmQgZGVwZW5kZW5jaWVzIGZvciB0aGUgU0RLXG4gICAgZGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwialF1ZXJ5XCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjEwXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290LiQgIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC4kIHRoZW4gcm9vdC4kLmZuLmpxdWVyeSBlbHNlIDAgIyBnaXZlcyB0aGUgdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBvZiB0aGUgbG9hZGVkIGxpYlxuICAgICAgICAsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJVbmRlcnNjb3JlXCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjcuMFwiICMgcmVxdWlyZWQgdmVyc2lvblxuICAgICAgICAgICAgXCJvYmpcIjogcm9vdC5fICMgZ2xvYmFsIG9iamVjdFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IGlmIHJvb3QuXyB0aGVuIHJvb3QuXy5WRVJTSU9OIGVsc2UgMFxuICAgIF1cblxuICAgICMgVmVyc2lvbiBjaGVja2VyIHV0aWxcbiAgICBWZXJzaW9uQ2hlY2tlciA9IHJlcXVpcmUgJy4vdXRpbC92ZXJzaW9uY2hlY2tlci5jb2ZmZWUnXG5cbiAgICAjIEluIGNhc2UgYW55IG9mIG91ciBkZXBlbmRlbmNpZXMgd2VyZSBub3QgbG9hZGVkLCBvciBpdHMgdmVyc2lvbiBkb2VzdCBub3QgY29ycmVzcG9uZCB0byBvdXJzXG4gICAgIyBuZWVkcywgdGhlIHZlcnNpb25DaGVja2VyIHdpbGwgdGhvcncgYW4gZXJyb3IgZXhwbGFpbmluZyB3aHlcbiAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cbiAgICAjIExvZ2dlclxuICAgIEJhc2UubG9nID0gcmVxdWlyZSAnLi91dGlsL2xvZ2dlci5jb2ZmZWUnXG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBCYXNlLmRldmljZSA9IHJlcXVpcmUgJy4vdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlJ1xuXG4gICAgIyBDb29raWVzIEFQSVxuICAgIEJhc2UuY29va2llcyA9IHJlcXVpcmUgJy4vdXRpbC9jb29raWVzLmNvZmZlZSdcblxuICAgICMgVmlld3BvcnQgZGV0ZWN0aW9uXG4gICAgQmFzZS52cCA9IHJlcXVpcmUgJy4vdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIEZ1bmN0aW9uIHRoYXQgaXMgZ29ubmEgaGFuZGxlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgQmFzZS5JbWFnZXIgPSByZXF1aXJlICdpbWFnZXIuanMnXG5cbiAgICAjIEV2ZW50IEJ1c1xuICAgIEJhc2UuRXZlbnRzID0gcmVxdWlyZSAnLi91dGlsL2V2ZW50YnVzLmNvZmZlZSdcblxuICAgICMgR2VuZXJhbCBVdGlsc1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi91dGlsL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBVdGlsc1xuICAgIEJhc2UudXRpbCA9IHJvb3QuXy5leHRlbmQgVXRpbHMsIHJvb3QuX1xuXG4gICAgcmV0dXJuIEJhc2VcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSAgID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG4gICAgTW9kdWxlID0gcmVxdWlyZSgnLi8uLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyBvYmplY3QgdG8gc3RvcmUgaW5pdGlhbGl6ZWQgY29tcG9uZW50c1xuICAgICAgICBAaW5pdGlhbGl6ZWRDb21wb25lbnRzIDoge31cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIHN0YXJ0QWxsIG1ldGhvZFxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGNvbXBvbmVudHMgdG8gc3RhcnQgd2l0aGluIHRoZSBwYXNzZWQgc2VsZWN0b3JcbiAgICAgICAgICogYW5kIGNhbGwgdGhlaXIgLmluaXRpYWxpemUoKSBtZXRob2RcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yID0gJ2JvZHknLiBDU1Mgc2VsZWN0b3IgdG8gdGVsbCB0aGUgYXBwIHdoZXJlIHRvIGxvb2sgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgQHN0YXJ0QWxsOiAoc2VsZWN0b3IgPSAnYm9keScsIGFwcCwgbmFtZXNwYWNlID0gUGVzdGxlLm1vZHVsZXMpIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2Uoc2VsZWN0b3IsIGFwcC5jb25maWcubmFtZXNwYWNlKVxuXG4gICAgICAgICAgICBjbXBjbG9uZSA9IEJhc2UudXRpbC5jbG9uZSBjb21wb25lbnRzXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJQYXJzZWQgY29tcG9uZW50c1wiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBjbXBjbG9uZVxuXG4gICAgICAgICAgICAjIGFkZGVkIHRvIGtlZXAgbmFtZXNwYWNlLk5BTUUgPSBERUZJTklUSU9OIHNpbnRheC4gVGhpcyB3aWxsIGV4dGVuZFxuICAgICAgICAgICAgIyB0aGUgb2JqZWN0IGRlZmluaXRpb24gd2l0aCB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAjIHRoaXMgbWlnaHQgbmVlZCB0byBiZSByZW1vdmVkXG4gICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRW1wdHkgY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZSwgKGRlZmluaXRpb24sIG5hbWUpIC0+XG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNGdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBNb2R1bGUuZXh0ZW5kIG5hbWUsIGRlZmluaXRpb25cblxuICAgICAgICAgICAgIyBncmFiIGEgcmVmZXJlbmNlIG9mIGFsbCB0aGUgbW9kdWxlIGRlZmluZWQgdXNpbmcgdGhlIE1vZHVsZS5hZGRcbiAgICAgICAgICAgICMgbWV0aG9kLlxuICAgICAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBuYW1lc3BhY2UsIFBlc3RsZS5Nb2R1bGUubGlzdFxuXG4gICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFsbDogQ29tcG9uZW50LmluaXRpYWxpemVkQ29tcG9uZW50c1xuICAgICAgICAgICAgICAgIG5ldzogY21wY2xvbmVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIHRoZSBwYXJzZSBtZXRob2Qgd2lsbCBsb29rIGZvciBjb21wb25lbnRzIGRlZmluZWQgdXNpbmdcbiAgICAgICAgICogdGhlIGNvbmZpZ3VyZWQgbmFtZXNwYWNlIGFuZCBsaXZpbmcgd2l0aGluIHRoZSBwYXNzZWRcbiAgICAgICAgICogQ1NTIHNlbGVjdG9yXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBuYW1lc3BhY2UgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICMjI1xuICAgICAgICBAcGFyc2U6IChzZWxlY3RvciwgbmFtZXNwYWNlKSAtPlxuICAgICAgICAgICAgIyBhcnJheSB0byBzdG9yZSBwYXJzZWQgY29tcG9uZW50c1xuICAgICAgICAgICAgbGlzdCA9IFtdXG5cbiAgICAgICAgICAgICMgaWYgYW4gYXJyYXkgaXMgcGFzc2VkLCB1c2UgaXQgYXMgaXQgaXNcbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0FycmF5IG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZXMgPSBuYW1lc3BhY2VcbiAgICAgICAgICAgICMgaWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFzIHBhcmFtZXRlciwgY29udmVydCBpdCB0byBhbiBhcnJheVxuICAgICAgICAgICAgZWxzZSBpZiBCYXNlLnV0aWwuaXNTdHJpbmcgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZS5zcGxpdCAnLCdcblxuICAgICAgICAgICAgIyBhcnJheSB0byBzdG9yZSB0aGUgY29tcG9zZWQgY3NzIHNlbGVjdG9yIHRoYXQgd2lsbCBsb29rIHVwIGZvclxuICAgICAgICAgICAgIyBjb21wb25lbnQgZGVmaW5pdGlvbnNcbiAgICAgICAgICAgIGNzc1NlbGVjdG9ycyA9IFtdXG5cbiAgICAgICAgICAgICMgaXRlcmF0ZXMgb3ZlciB0aGUgbmFtZXNwYWNlIGFycmF5IGFuZCBjcmVhdGUgdGhlIG5lZWRlZCBjc3Mgc2VsZWN0b3JzXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgIyBpZiBhIG5ldyBuYW1lc3BhY2UgaGFzIGJlZW4gcHJvdmlkZWQgbGV0cyBhZGQgaXQgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBjc3NTZWxlY3RvcnMucHVzaCBcIltkYXRhLVwiICsgbnMgKyBcIi1jb21wb25lbnRdXCJcblxuICAgICAgICAgICAgIyBUT0RPOiBBY2Nlc3MgdGhlc2UgRE9NIGZ1bmN0aW9uYWxpdHkgdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICAkKHNlbGVjdG9yKS5maW5kKGNzc1NlbGVjdG9ycy5qb2luKCcsJykpLmVhY2ggKGksIGNvbXApIC0+XG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBjb21wIGFscmVhZHkgaGFzIHRoZSBwZXN0bGUtZ3VpZCBhdHRhY2hlZCwgaXQgbWVhbnNcbiAgICAgICAgICAgICAgICAjIGl0IHdhcyBhbHJlYWR5IHN0YXJ0ZWQsIHNvIHdlJ2xsIG9ubHkgbG9vayBmb3IgdW5uaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgIyBjb21wb25lbnRzIGhlcmVcbiAgICAgICAgICAgICAgICB1bmxlc3MgJChjb21wKS5kYXRhKCdwZXN0bGUtZ3VpZCcpXG5cbiAgICAgICAgICAgICAgICAgICAgbnMgPSBkbyAoKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgVGhpcyB3YXkgd2Ugb2J0YWluIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgJChjb21wKS5kYXRhKG5zICsgXCItY29tcG9uZW50XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IG5zXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2VcblxuICAgICAgICAgICAgICAgICAgICAjIG9wdGlvbnMgd2lsbCBob2xkIGFsbCB0aGUgZGF0YS0qIGF0dHJpYnV0ZXMgcmVsYXRlZCB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBDb21wb25lbnQucGFyc2VDb21wb25lbnRPcHRpb25zKEAsIG5zKVxuXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaCh7IG5hbWU6IG9wdGlvbnMubmFtZSwgb3B0aW9uczogb3B0aW9ucyB9KVxuXG4gICAgICAgICAgICByZXR1cm4gbGlzdFxuXG4gICAgICAgICMgdGhpcyBtZXRob2Qgd2lsbCBiZSBpbiBjaGFyZ2Ugb2YgcGFyc2luZyBhbGwgdGhlIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICMgZGVmaW5lZCBpbiB0aGUgaXRzICRlbCBtYXJrdXAgYW5kIHBsYWNpbmcgdGhlbSBpbiBhIG9iamVjdFxuICAgICAgICBAcGFyc2VDb21wb25lbnRPcHRpb25zOiAoZWwsIG5hbWVzcGFjZSwgb3B0cykgLT5cbiAgICAgICAgICAgIG9wdGlvbnMgPSBCYXNlLnV0aWwuY2xvbmUob3B0cyB8fCB7fSlcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbFxuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIERPTSBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIGRhdGEgPSAkKGVsKS5kYXRhKClcbiAgICAgICAgICAgIG5hbWUgPSAnJ1xuICAgICAgICAgICAgbGVuZ3RoID0gMFxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBkYXRhLCAodiwgaykgLT5cblxuICAgICAgICAgICAgICAgICMgcmVtb3ZlcyB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgayA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgbmFtZXNwYWNlKSwgXCJcIilcblxuICAgICAgICAgICAgICAgICMgZGVjYW1lbGl6ZSB0aGUgb3B0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBrID0gay5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGsuc2xpY2UoMSlcblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGtleSBpcyBkaWZmZXJlbnQgZnJvbSBcImNvbXBvbmVudFwiIGl0IG1lYW5zIGl0IGlzXG4gICAgICAgICAgICAgICAgIyBhbiBvcHRpb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiBrICE9IFwiY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IHZcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoKytcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB2XG5cbiAgICAgICAgICAgICMgYWRkIG9uZSBiZWNhdXNlIHdlJ3ZlIGFkZGVkICdlbCcgYXV0b21hdGljYWxseSBhcyBhbiBleHRyYSBvcHRpb25cbiAgICAgICAgICAgIG9wdGlvbnMubGVuZ3RoID0gbGVuZ3RoICsgMVxuXG4gICAgICAgICAgICAjIGJ1aWxkIGFkIHJldHVybiB0aGUgb3B0aW9uIG9iamVjdFxuICAgICAgICAgICAgQ29tcG9uZW50LmJ1aWxkT3B0aW9uc09iamVjdChuYW1lLCBvcHRpb25zKVxuXG5cbiAgICAgICAgQGJ1aWxkT3B0aW9uc09iamVjdDogKG5hbWUsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IG5hbWVcblxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNcblxuICAgICAgICBAaW5zdGFudGlhdGU6IChjb21wb25lbnRzLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGlmIGNvbXBvbmVudHMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgbSA9IGNvbXBvbmVudHMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgbW9kdWxlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgbW9kdWxlcyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIFRPRE86IFByb3ZpZGUgYW4gYWx0ZXJuYXRlIHdheSB0byBkZWZpbmUgdGhlXG4gICAgICAgICAgICAgICAgIyBnbG9iYWwgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCB0aGUgbW9kdWxlIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkoUGVzdGxlLm1vZHVsZXMpIGFuZCBQZXN0bGUubW9kdWxlc1ttLm5hbWVdIGFuZCBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9kID0gUGVzdGxlLm1vZHVsZXNbbS5uYW1lXVxuXG4gICAgICAgICAgICAgICAgICAgICMgY3JlYXRlIGEgbmV3IHNhbmRib3ggZm9yIHRoaXMgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIHNiID0gYXBwLmNyZWF0ZVNhbmRib3gobS5uYW1lKVxuXG4gICAgICAgICAgICAgICAgICAgICMgZ2VuZXJhdGVzIGFuIHVuaXF1ZSBndWlkIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG0ub3B0aW9ucy5ndWlkID0gQmFzZS51dGlsLnVuaXF1ZUlkKG0ubmFtZSArIFwiX1wiKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5qZWN0IHRoZSBzYW5kYm94IGFuZCB0aGUgb3B0aW9ucyBpbiB0aGUgbW9kdWxlIHByb3RvXG4gICAgICAgICAgICAgICAgICAgICMgQmFzZS51dGlsLmV4dGVuZCBtb2QsIHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZHggPSBuZXcgbW9kKHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZHguaW5pdGlhbGl6ZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzdG9yZSBhIHJlZmVyZW5jZSBvZiB0aGUgZ2VuZXJhdGVkIGd1aWQgb24gdGhlIGVsXG4gICAgICAgICAgICAgICAgICAgICQobS5vcHRpb25zLmVsKS5kYXRhICdwZXN0bGUtZ3VpZCcsIG0ub3B0aW9ucy5ndWlkXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzYXZlcyBhIHJlZmVyZW5jZSBvZiB0aGUgaW5pdGlhbGl6ZWQgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNbIG0ub3B0aW9ucy5ndWlkIF0gPSBtb2R4XG5cbiAgICAgICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG5cbiAgICAjI1xuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGluaXQgdGhlIGV4dGVuc2lvblxuICAgICMjXG5cbiAgICAjIGNvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIENvbXBvbmVudCBleHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGluaXRpYWxpemVkQ29tcG9uZW50cyA9IHt9XG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzID0gKHNlbGVjdG9yLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGluaXRpYWxpemVkQ29tcG9uZW50cyA9IENvbXBvbmVudC5zdGFydEFsbChzZWxlY3RvciwgYXBwKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsaXplZENvbXBvbmVudHMuYWxsXG5cbiAgICAgICAgYXBwLnNhbmRib3guZ2V0TGFzdGVzdEluaXRpYWxpemVkQ29tcG9uZW50cyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsaXplZENvbXBvbmVudHMubmV3XG5cblxuICAgICMgdGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGxvYWRlZFxuICAgIGFmdGVyQXBwU3RhcnRlZDogKHNlbGVjdG9yLCBhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkNhbGxpbmcgc3RhcnRDb21wb25lbnRzIGZyb20gYWZ0ZXJBcHBTdGFydGVkXCJcbiAgICAgICAgcyA9IGlmIHNlbGVjdG9yIHRoZW4gc2VsZWN0b3IgZWxzZSBudWxsXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyhzLCBhcHApXG5cbiAgICBuYW1lOiAnQ29tcG9uZW50IEV4dGVuc2lvbidcblxuICAgICMgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAgICAjIHRvIHZhbGlkYXRlIHRoZSBDb21wb25lbnQgY2xhc3MgaW4gaXNvbGF0aW9uXG4gICAgY2xhc3NlcyA6IENvbXBvbmVudFxuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdjb21wb25lbnRzJ1xuKVxuIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBiZSB0cmlnZ2VyaW5nIGV2ZW50cyBvbmNlIHRoZSBEZXZpY2UgaW4gd2hpY2ggdGhlXG4gKiB1c2VyIGlzIG5hdmlnYXRpbmcgdGhlIHNpdGUgaXMgZGV0ZWN0ZWQuIEl0cyBmdWNpb25hbGl0eSBtb3N0bHkgZGVwZW5kc1xuICogb24gdGhlIGNvbmZpZ3VyYXRpb25zIHNldHRpbmdzIChwcm92aWRlZCBieSBkZWZhdWx0LCBidXQgdGhleSBjYW4gYmUgb3ZlcnJpZGVuKVxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgUmVzcG9uc2l2ZURlc2lnblxuXG4gICAgICAgIGNmZyA6XG4gICAgICAgICAgICAjIFRoaXMgbGltaXQgd2lsbCBiZSB1c2VkIHRvIG1ha2UgdGhlIGRldmljZSBkZXRlY3Rpb25cbiAgICAgICAgICAgICMgd2hlbiB0aGUgdXNlciByZXNpemUgdGhlIHdpbmRvd1xuICAgICAgICAgICAgd2FpdExpbWl0OiAzMDBcblxuICAgICAgICAgICAgIyBkZWZpbmVzIGlmIHdlIGhhdmUgdG8gbGlzdGVuIGZvciB0aGUgcmVzaXplIGV2ZW50IG9uIHRoZSB3aW5kb3cgb2JqXG4gICAgICAgICAgICB3aW5kb3dSZXNpemVFdmVudDogdHJ1ZVxuXG4gICAgICAgICAgICAjIERlZmF1bHQgYnJlYWtwb2ludHNcbiAgICAgICAgICAgIGJyZWFrcG9pbnRzIDogW1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIm1vYmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICMgdW50aWwgdGhpcyBwb2ludCB3aWxsIGJlaGF2ZXMgYXMgbW9iaWxlXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiAwXG4gICAgICAgICAgICAgICAgICAgIGJwbWF4OiA3NjdcbiAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwidGFibGV0XCJcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDc2OFxuICAgICAgICAgICAgICAgICAgICBicG1heDogOTU5XG4gICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgICAgICAgICAjIGJ5IGRlZmF1bHQgYW55dGhpbmcgZ3JlYXRlciB0aGFuIHRhYmxldCBpcyBhIGRlc2t0b3BcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJkZXNrdG9wXCJcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDk2MFxuICAgICAgICAgICAgXVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5iaW5kQWxsIEAsIFwiX2luaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImRldGVjdERldmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NoZWNrVmlld3BvcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9hdHRhY2hXaW5kb3dIYW5kbGVyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJnZXREZXZpY2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX3Jlc2l6ZUhhbmRsZXJcIlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQGNmZywgY29uZmlnXG5cbiAgICAgICAgICAgIEBfaW5pdCgpXG5cbiAgICAgICAgX2luaXQ6ICgpIC0+XG5cbiAgICAgICAgICAgIEBfYXR0YWNoV2luZG93SGFuZGxlcnMoKSBpZiBAY29uZmlnLndpbmRvd1Jlc2l6ZUV2ZW50XG5cbiAgICAgICAgICAgIEBkZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIF9hdHRhY2hXaW5kb3dIYW5kbGVyczogKCkgLT5cblxuICAgICAgICAgICAgbGF6eVJlc2l6ZSA9IEJhc2UudXRpbC5kZWJvdW5jZSBAX3Jlc2l6ZUhhbmRsZXIsIEBjb25maWcud2FpdExpbWl0XG5cbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUobGF6eVJlc2l6ZSlcblxuICAgICAgICBfcmVzaXplSGFuZGxlcjogKCkgLT5cbiAgICAgICAgICAgICMgdHJpZ2dlcnMgYSB3aW5kb3dzcmVzaXplIGV2ZW50IHNvIHRoaXMgd2F5IHdlIGhhdmUgYSBjZW50cmFsaXplZFxuICAgICAgICAgICAgIyB3YXkgdG8gbGlzdGVuIGZvciB0aGUgcmVzaXplIGV2ZW50IG9uIHRoZSB3aW5kb3dzIGFuZCB0aGUgY29tcG9uZW5zXG4gICAgICAgICAgICAjIGNhbiBsaXN0ZW4gZGlyZWN0bHkgdG8gdGhpcyBldmVudCBpbnN0ZWFkIG9mIGRlZmluaW5nIGEgbmV3IGxpc3RlbmVyXG4gICAgICAgICAgICBQZXN0bGUuZW1pdCBcInJ3ZDp3aW5kb3dyZXNpemVcIlxuXG4gICAgICAgICAgICBAZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBkZXRlY3REZXZpY2U6ICgpIC0+XG5cbiAgICAgICAgICAgIGJwID0gQGNvbmZpZy5icmVha3BvaW50c1xuXG4gICAgICAgICAgICB2cCA9IEJhc2UudnAudmlld3BvcnRXKClcblxuICAgICAgICAgICAgIyBnZXQgYSByZWZlcmVuY2UgKGlmIGFueSkgdG8gdGhlIGNvcnJlc3BvbmRpbmcgYnJlYWtwb2ludFxuICAgICAgICAgICAgIyBkZWZpbmVkIGluIHRoZSBjb25maWcuXG4gICAgICAgICAgICB2cGQgPSBAX2NoZWNrVmlld3BvcnQodnAsIGJwKVxuXG4gICAgICAgICAgICBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkgdnBkXG5cbiAgICAgICAgICAgICAgICBjYXBpdGFsaXplZEJQTmFtZSA9IEJhc2UudXRpbC5zdHJpbmcuY2FwaXRhbGl6ZSh2cGQubmFtZSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAjIGxldCdzIGZpc3QgY2hlY2sgaWYgd2UgaGF2ZSBhIG1ldGhvZCB0byBkZXRlY3QgdGhlIGRldmljZSB0aHJvdWdoIFVBXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gQmFzZS5kZXZpY2VbJ2lzJyArIGNhcGl0YWxpemVkQlBOYW1lXVxuICAgICAgICAgICAgICAgICAgICBVQURldGVjdG9yID0gQmFzZS5kZXZpY2VbJ2lzJyArIGNhcGl0YWxpemVkQlBOYW1lXVxuXG4gICAgICAgICAgICAgICAgIyB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSByZXN1bHQgb2YgYSBVQSBjaGVjay5cbiAgICAgICAgICAgICAgICAjIFVubGVzcyB0aGVyZSBpcyBhIG1ldGhvZCB0byBjaGVjayB0aGUgVUEsIGxldHNcbiAgICAgICAgICAgICAgICAjIGxlYXZlIGl0IGFzIGZhbHNlIGFuZCB1c2Ugb25seSB0aGUgdmlld3BvcnQgdG9cbiAgICAgICAgICAgICAgICAjIG1ha2UgdGhlIGRldmljZSBkZXRlY3Rpb25cbiAgICAgICAgICAgICAgICBzdGF0ZVVBID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBVQURldGVjdG9yXG5cbiAgICAgICAgICAgICAgICAgICAgc3RhdGVVQSA9IFVBRGV0ZWN0b3IoKVxuXG4gICAgICAgICAgICAgICAgIyBGaW5hbCBjaGVjay4gRmlyc3Qgd2UnbGwgdHJ5IHRvIG1ha2UgdG8gbWFrZSB0aGUgZGVjaXNpb25cbiAgICAgICAgICAgICAgICAjIHVwb24gdGhlIGN1cnJlbnQgZGV2aWNlIGJhc2VkIG9uIFVBLCBpZiBpcyBub3QgcG9zc2libGUsIGxldHMganVzdFxuICAgICAgICAgICAgICAgICMgdXNlIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIGlmIHN0YXRlVUEgb3IgdnBkLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgIyBUcmlnZ2VyIGEgZXZlbnQgdGhhdCBmb2xsb3dzIHRoZSBmb2xsb3dpbmcgbmFtaW5nIGNvbnZlbnRpb25cbiAgICAgICAgICAgICAgICAgICAgIyByd2Q6PGRldmljZT5cbiAgICAgICAgICAgICAgICAgICAgIyBFeGFtcGxlOiByd2Q6dGFibGV0IG9yIHJ3ZDptb2JpbGVcblxuICAgICAgICAgICAgICAgICAgICBldnQgPSAncndkOicgKyB2cGQubmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgRGVzaWduIGV4dGVuc2lvbiBpcyB0cmlnZ2VyaW5nIHRoZSBmb2xsb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvIGV2dFxuXG4gICAgICAgICAgICAgICAgICAgIFBlc3RsZS5lbWl0IGV2dFxuXG4gICAgICAgICAgICAgICAgICAgICMgU3RvcmUgdGhlIGN1cnJlbnQgZGV2aWNlXG4gICAgICAgICAgICAgICAgICAgIEBkZXZpY2UgPSB2cGQubmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtc2cgPSBcIltleHRdIFRoZSBwYXNzZWQgc2V0dGluZ3MgdG8gdGhlIFJlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibWlnaHQgbm90IGJlIGNvcnJlY3Qgc2luY2Ugd2UgaGF2ZW4ndCBiZWVuIGFibGUgdG8gZGV0ZWN0IGFuIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhc29jaWF0ZWQgYnJlYWtwb2ludCB0byB0aGUgY3VycmVudCB2aWV3cG9ydFwiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICBnZXREZXZpY2U6ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBAZGV2aWNlXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBkZXRlY3QgaWYgdGhlIGN1cnJlbnQgdmlld3BvcnRcbiAgICAgICAgICogY29ycmVzcG9uZCB0byBhbnkgb2YgdGhlIGRlZmluZWQgYnAgaW4gdGhlIGNvbmZpZyBzZXR0aW5nXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdnAgW251bWJlci4gQ3VycmVudCB2aWV3cG9ydF1cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBicmVha3BvaW50cyBbY2xvbmUgb2YgdGhlIGJyZWFrcG9pbnQga2V5IG9iamVjdF1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSB0aGUgYnJlYWtwb2ludCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBjdXJyZW50bHlcbiAgICAgICAgICogICAgICAgICAgICAgICAgICBkZXRlY3RlZCB2aWV3cG9ydFxuICAgICAgICAjIyNcbiAgICAgICAgX2NoZWNrVmlld3BvcnQ6ICh2cCwgYnJlYWtwb2ludHMpIC0+XG5cbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBCYXNlLnV0aWwuZmlsdGVyKGJyZWFrcG9pbnRzLCAoYnApIC0+XG5cbiAgICAgICAgICAgICAgICAjIHN0YXJ0cyBjaGVja2luZyBpZiB0aGUgZGV0ZWN0ZWQgdmlld3BvcnQgaXNcbiAgICAgICAgICAgICAgICAjIGJpZ2dlciB0aGFuIHRoZSBicG1pbiBkZWZpbmVkIGluIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAgICAgIyBpdGVyYXRlZCBicmVha3BvaW50XG4gICAgICAgICAgICAgICAgaWYgdnAgPj0gYnAuYnBtaW5cblxuICAgICAgICAgICAgICAgICAgICAjIHdlJ2xsIG5lZWQgdG8gY2hlY2sgdGhpcyB3YXkgYmVjYXVzZSBieSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICMgaWYgYSBCUCBkb2Vzbid0IGhhdmUgYSBicG1heCBwcm9wZXJ0eSBpdCBtZWFuc1xuICAgICAgICAgICAgICAgICAgICAjIGlzIHRoZSBsYXN0IGFuZCBiaWdnZXIgY2FzZSB0byBjaGVjay4gQnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAjIGlzIGRlc2t0b3BcbiAgICAgICAgICAgICAgICAgICAgaWYgYnAuYnBtYXggYW5kIGJwLmJwbWF4ICE9IDBcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBpdCdzIHdpdGhpbiB0aGUgcmFuZ2UsIGFsbCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB2cCA8PSBicC5icG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0aGlzIHNob3VsZCBvbmx5IGJlIHRydWUgaW4gb25seSBvbmUgY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBCeSBkZWZhdWx0LCBqdXN0IGZvciBkZXNrdG9wIHdoaWNoIGRvZXNuJ3QgaGF2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBhbiBcInVudGlsXCIgYnJlYWtwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZmFsc2VcblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiBicmVha3BvaW50Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICByZXR1cm4gYnJlYWtwb2ludC5zaGlmdCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9XG5cblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgIyBDaGVjayBpZiB0aGUgZXh0ZW5zaW9uIGhhcyBhIGN1c3RvbSBjb25maWcgdG8gdXNlXG4gICAgICAgIGlmIGFwcC5jb25maWcuZXh0ZW5zaW9uIGFuZCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgIHJ3ZCA9IG5ldyBSZXNwb25zaXZlRGVzaWduKGNvbmZpZylcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QgPSAoKSAtPlxuICAgICAgICAgICAgIyBjYWxsIGRldGVjdCBEZXZpY2UgaW4gb3JkZXIgdG8gdHJpZ2dlciB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgICAgICAgIyBkZXZpY2UgZXZlbnRcbiAgICAgICAgICAgIHJ3ZC5kZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZC5nZXREZXZpY2UgPSAoKSAtPlxuXG4gICAgICAgICAgICByd2QuZ2V0RGV2aWNlKClcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlRGVzaWduXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QoKVxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWRlc2lnbidcbikiLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGJlIGhhbmRsaW5nIHRoZSBjcmVhdGlvbiBvZiB0aGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIFJlc3BvbnNpdmVJbWFnZXNcblxuICAgICAgICBjZmcgOlxuICAgICAgICAgICAgIyBBcnJheSBvZiBzdXBwb3J0ZWQgUGl4ZWwgd2lkdGggZm9yIGltYWdlc1xuICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbMTMzLDE1MiwxNjIsMjI1LDIxMCwyMjQsMjgwLDM1Miw0NzAsNTM2LDU5MCw2NzYsNzEwLDc2OCw4ODUsOTQ1LDExOTBdXG5cbiAgICAgICAgICAgICMgQXJyYXkgb2Ygc3VwcG9ydGVyIHBpeGVsIHJhdGlvc1xuICAgICAgICAgICAgYXZhaWxhYmxlUGl4ZWxSYXRpb3M6IFsxLCAyLCAzXVxuXG4gICAgICAgICAgICAjIFNlbGVjdG9yIHRvIGJlIHVzZWQgd2hlbiBpbnN0YW50aW5nIEltYWdlclxuICAgICAgICAgICAgZGVmYXVsdFNlbGVjdG9yIDogJy5kZWxheWVkLWltYWdlLWxvYWQnXG5cbiAgICAgICAgICAgICMgbGF6eSBtb2RlIGVuYWJsZWRcbiAgICAgICAgICAgIGxhenltb2RlIDogdHJ1ZVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5iaW5kQWxsIEAsIFwiX2luaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jcmVhdGVMaXN0ZW5lcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jcmVhdGVJbnN0YW5jZVwiXG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAY2ZnLCBjb25maWdcblxuICAgICAgICAgICAgQF9pbml0KClcblxuICAgICAgICBfaW5pdDogKCkgLT5cblxuICAgICAgICAgICAgIyBjcmVhdGVzIGxpc3RlbmVycyB0byBhbGxvdyB0aGUgaW5zdGFudGlhdG9uIG9mIHRoZSBJbWFnZXJcbiAgICAgICAgICAgICMgaW4gbGF6eSBsb2FkIG1vZGUuXG4gICAgICAgICAgICAjIFVzZWZ1bCBmb3IgaW5maW5pdGUgc2Nyb2xscyBvciBpbWFnZXMgY3JlYXRlZCBvbiBkZW1hbmRcbiAgICAgICAgICAgIEBfY3JlYXRlTGlzdGVuZXJzKCkgaWYgQGNvbmZpZy5sYXp5bW9kZVxuXG4gICAgICAgICAgICAjIEFzIHNvb24gYXMgdGhpcyBleHRlbnNpb24gaXMgaW5pdGlhbGl6ZWQgd2UgYXJlIGdvbm5hIGJlIGNyZWF0aW5nXG4gICAgICAgICAgICAjIHRoZSByZXNwb25zaXZlIGltYWdlc1xuICAgICAgICAgICAgQF9jcmVhdGVJbnN0YW5jZSgpXG5cbiAgICAgICAgX2NyZWF0ZUxpc3RlbmVyczogKCkgLT5cbiAgICAgICAgICAgICMgdGhpcyBnaXZlcyB0aGUgYWJpbGl0eSB0byBjcmVhdGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICAgICAgICAgICMgYnkgdHJpZ2dlciB0aGlzIGV2ZW50IHdpdGggb3B0aW9uYWwgYXR0cmlidXRlc1xuICAgICAgICAgICAgUGVzdGxlLm9uICdyZXNwb25zaXZlaW1hZ2VzOmNyZWF0ZScsIEBfY3JlYXRlSW5zdGFuY2VcblxuICAgICAgICBfY3JlYXRlSW5zdGFuY2UgOiAob3B0aW9ucyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uIGNyZWF0aW5nIGEgbmV3IEltYWdlciBpbnN0YW5jZVwiXG5cbiAgICAgICAgICAgIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciBvciBAY29uZmlnLmRlZmF1bHRTZWxlY3RvclxuICAgICAgICAgICAgb3B0cyA9IGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eSBvcHRpb25zIHRoZW4gb3B0aW9ucyBlbHNlIEBjb25maWdcblxuICAgICAgICAgICAgbmV3IEJhc2UuSW1hZ2VyKHNlbGVjdG9yLCBvcHRzKVxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAjIENoZWNrIGlmIHRoZSBleHRlbnNpb24gaGFzIGEgY3VzdG9tIGNvbmZpZyB0byB1c2VcbiAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgYXBwLnNhbmRib3gucmVzcG9uc2l2ZWltYWdlcyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJwID0gbmV3IFJlc3BvbnNpdmVJbWFnZXMoY29uZmlnKVxuXG4gICAgICAgICAgICAjIHRyaWdnZXIgdGhlIGV2ZW50IHRvIGxldCBldmVyeWJvZHkga25vd3MgdGhhdCB0aGlzIGV4dGVuc2lvbiBmaW5pc2hlZFxuICAgICAgICAgICAgIyBpdHMgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIFBlc3RsZS5lbWl0ICdyZXNwb25zaXZlaW1hZ2VzOmluaXRpYWxpemVkJ1xuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVJbWFnZXNcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJlc3BvbnNpdmVpbWFnZXMoKVxuXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlaW1hZ2VzJ1xuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIENvb2tpZXMpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGNvb2tpZXMgPSByZXF1aXJlKCdjb29raWVzLWpzJylcblxuICAgICMgRXhwb3NlIENvb2tpZXMgQVBJXG4gICAgQ29va2llcyA9XG5cbiAgICAgICAgc2V0OiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuc2V0IGtleSwgdmFsdWUsIG9wdGlvbnNcblxuICAgICAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgICAgICBjb29raWVzLmdldCBrZXlcblxuICAgICAgICBleHBpcmU6IChrZXksIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLmV4cGlyZSBrZXksIG9wdGlvbnNcblxuICAgIHJldHVybiBDb29raWVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIERldmljZURldGVjdGlvbikgLT5cblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIGlzTW9iaWxlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIEV4cG9zZSBkZXZpY2UgZGV0ZWN0aW9uIEFQSVxuICAgIERldmljZURldGVjdGlvbiA9XG5cbiAgICAgICAgIyBHcm91cHNcbiAgICAgICAgaXNNb2JpbGU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5waG9uZVxuXG4gICAgICAgIGlzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUudGFibGV0XG5cbiAgICAgICAgIyBBcHBsZSBkZXZpY2VzXG4gICAgICAgIGlzSXBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUucGhvbmVcblxuICAgICAgICBpc0lwb2Q6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5pcG9kXG5cbiAgICAgICAgaXNJcGFkOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUudGFibGV0XG5cbiAgICAgICAgaXNBcHBsZSA6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5kZXZpY2VcblxuICAgICAgICAjIEFuZHJvaWQgZGV2aWNlc1xuICAgICAgICBpc0FuZHJvaWRQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQucGhvbmVcblxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnRhYmxldFxuXG4gICAgICAgIGlzQW5kcm9pZERldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQuZGV2aWNlXG5cbiAgICAgICAgIyBXaW5kb3dzIGRldmljZXNcbiAgICAgICAgaXNXaW5kb3dzUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnBob25lXG5cbiAgICAgICAgaXNXaW5kb3dzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy50YWJsZXRcblxuICAgICAgICBpc1dpbmRvd3NEZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLmRldmljZVxuXG4gICAgcmV0dXJuIERldmljZURldGVjdGlvblxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFdmVudEJ1cykgLT5cblxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJylcblxuICAgICMjIypcbiAgICAgKiBjbGFzcyB0aGF0IHNlcnZlcyBhcyBhIGZhY2FkZSBmb3IgdGhlIEV2ZW50RW1pdHRlciBjbGFzc1xuICAgICMjI1xuICAgIGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cbiAgICByZXR1cm4gRXZlbnRCdXNcbikiLCIjIyMqXG4gKiBUaGUgRXh0ZW5zaW9uIE1hbmFuZ2VyIHdpbGwgcHJvdmlkZSB0aGUgYmFzZSBzZXQgb2YgZnVuY3Rpb25hbGl0aWVzXG4gKiB0byBtYWtlIHRoZSBDb3JlIGxpYnJhcnkgZXh0ZW5zaWJsZS5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHRNYW5hZ2VyKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIERlZmF1bHRzIGNvbmZpZ3MgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIF9leHRlbnNpb25Db25maWdEZWZhdWx0czpcbiAgICAgICAgICAgIGFjdGl2YXRlZCA6IHRydWUgIyB1bmxlc3Mgc2FpZCBvdGhlcndpc2UsIGV2ZXJ5IGFkZGVkIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdpbGwgYmUgYWN0aXZhdGVkIG9uIHN0YXJ0XG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICAjIGNoZWNrcyBpZiB0aGUgbmFtZSBmb3IgdGhlIGV4dGVuc2lvbiBoYXZlIGJlZW4gZGVmaW5lZC5cbiAgICAgICAgICAgICMgaWYgbm90IGxvZyBhIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgdW5sZXNzIGV4dC5uYW1lXG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgZXh0ZW5zaW9uIGRvZXNuJ3QgaGF2ZSBhIG5hbWUgYXNzb2NpYXRlZC4gSXQgd2lsbCBiZSBoZXBmdWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcImlmIHlvdSBoYXZlIGFzc2luZyBhbGwgb2YgeW91ciBleHRlbnNpb25zIGEgbmFtZSBmb3IgYmV0dGVyIGRlYnVnZ2luZ1wiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgIyBMZXRzIHRocm93IGFuIGVycm9yIGlmIHdlIHRyeSB0byBpbml0aWFsaXplIHRoZSBzYW1lIGV4dGVuc2lvbiB0d2ljZXNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIEBfZXh0ZW5zaW9ucywgKHh0LCBpKSAtPlxuICAgICAgICAgICAgICAgIGlmIF8uaXNFcXVhbCB4dCwgZXh0XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQubmFtZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiKVxuXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMucHVzaChleHQpXG5cbiAgICAgICAgaW5pdCA6IChjb250ZXh0KSAtPlxuICAgICAgICAgICAgeHRjbG9uZSA9IEJhc2UudXRpbC5jbG9uZSBAX2V4dGVuc2lvbnNcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkFkZGVkIGV4dGVuc2lvbnMgKHN0aWxsIG5vdCBpbml0aWFsaXplZCk6XCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIHh0Y2xvbmVcblxuICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKEBfZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaXRpYWxpemVkIGV4dGVuc2lvbnM6XCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zXG5cbiAgICAgICAgX2luaXRFeHRlbnNpb24gOiAoZXh0ZW5zaW9ucywgY29udGV4dCkgLT5cblxuICAgICAgICAgICAgaWYgZXh0ZW5zaW9ucy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICB4dCA9IGV4dGVuc2lvbnMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgIyBDYWxsIGV4dGVuc2lvbnMgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBpZiBAX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQoeHQsIGNvbnRleHQuY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAjIHRoaXMgc3RhdGUgY291bGQgdGVsbCB0byB0aGUgcmVzdCBvZiB0aGUgd29ybGQgaWZcbiAgICAgICAgICAgICAgICAgICAgIyBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIG9yIG5vdFxuICAgICAgICAgICAgICAgICAgICB4dC5hY3RpdmF0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjYWxsIHRvIHRoZSBleHRlbnNpb24gaW5pdGlhbGl6ZSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KVxuXG4gICAgICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucy5wdXNoIHh0XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB4dC5hY3RpdmF0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgIyBjYWxsIHRoaXMgbWV0aG9kIHJlY3Vyc2l2ZWx5IHVudGlsIHRoZXJlIGFyZSBubyBtb3JlXG4gICAgICAgICAgICAgICAgIyBlbGVtZW50cyBpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICBfaXNFeHRlbnNpb25BbGxvd2VkVG9CZUFjdGl2YXRlZDogKHh0LCBjb25maWcpIC0+XG5cbiAgICAgICAgICAgICMgZmlyc3Qgd2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgXCJvcHRpb25zXCIga2V5IGlzIGRlZmluZWRcbiAgICAgICAgICAgICMgYnkgdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgdW5sZXNzIHh0Lm9wdGlvbktleVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiVGhlIG9wdGlvbktleSBpcyByZXF1aXJlZCBhbmQgd2FzIG5vdCBkZWZpbmVkIGJ5OiBcIiArIHh0Lm5hbWVcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAjIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZCB0byB0aGUgZXh0ZW5zaW9uLCBsZXRzIGNoZWNrIGp1c3QgZm9yIFwiYWN0aXZhdGVkXCJcbiAgICAgICAgICAgICMgd2hpY2ggaXMgdGhlIG9ubHkgb3B0aW9uIHRoYXQgc2hvdWxkIG1hdHRlciB3aXRoaW4gdGhpcyBtZXRob2RcbiAgICAgICAgICAgIGlmIGNvbmZpZy5leHRlbnNpb24gYW5kIGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XSBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XS5oYXNPd25Qcm9wZXJ0eSAnYWN0aXZhdGVkJ1xuICAgICAgICAgICAgICAgIGFjdGl2YXRlZCA9IGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XS5hY3RpdmF0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWQgPSBAX2V4dGVuc2lvbkNvbmZpZ0RlZmF1bHRzLmFjdGl2YXRlZFxuXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZhdGVkXG5cblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25CeU5hbWUgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIEJhc2UudXRpbC53aGVyZSBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucywgb3B0aW9uS2V5OiBuYW1lXG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9leHRlbnNpb25zXG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9uQnlOYW1lIDogKG5hbWUpIC0+XG4gICAgICAgICAgICBCYXNlLnV0aWwud2hlcmUgQF9leHRlbnNpb25zLCBvcHRpb25LZXk6IG5hbWVcblxuICAgIHJldHVybiBFeHRNYW5hZ2VyXG5cbilcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBVdGlscykgLT5cblxuICAgICMgRXhwb3NlIFV0aWxzIEFQSVxuICAgIFV0aWxzID1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgbGlicmFyeSB2ZXJzaW9uaW5nXG4gICAgICAgICMjI1xuICAgICAgICB2ZXJzaW9uQ29tcGFyZSA6ICh2MSwgdjIsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIGlzVmFsaWRQYXJ0ID0gKHgpIC0+XG4gICAgICAgICAgICAgICAgKChpZiBsZXhpY29ncmFwaGljYWwgdGhlbiAvXlxcZCtbQS1aYS16XSokLyBlbHNlIC9eXFxkKyQvKSkudGVzdCB4XG5cbiAgICAgICAgICAgIGxleGljb2dyYXBoaWNhbCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMubGV4aWNvZ3JhcGhpY2FsXG4gICAgICAgICAgICB6ZXJvRXh0ZW5kID0gb3B0aW9ucyBhbmQgb3B0aW9ucy56ZXJvRXh0ZW5kXG4gICAgICAgICAgICB2MXBhcnRzID0gdjEuc3BsaXQoXCIuXCIpXG4gICAgICAgICAgICB2MnBhcnRzID0gdjIuc3BsaXQoXCIuXCIpXG5cbiAgICAgICAgICAgIHJldHVybiBOYU4gaWYgbm90IHYxcGFydHMuZXZlcnkoaXNWYWxpZFBhcnQpIG9yIG5vdCB2MnBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KVxuXG4gICAgICAgICAgICBpZiB6ZXJvRXh0ZW5kXG4gICAgICAgICAgICAgICAgdjFwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYxcGFydHMubGVuZ3RoIDwgdjJwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICB2MnBhcnRzLnB1c2ggXCIwXCIgICAgd2hpbGUgdjJwYXJ0cy5sZW5ndGggPCB2MXBhcnRzLmxlbmd0aFxuXG4gICAgICAgICAgICB1bmxlc3MgbGV4aWNvZ3JhcGhpY2FsXG4gICAgICAgICAgICAgICAgdjFwYXJ0cyA9IHYxcGFydHMubWFwKE51bWJlcilcbiAgICAgICAgICAgICAgICB2MnBhcnRzID0gdjJwYXJ0cy5tYXAoTnVtYmVyKVxuXG4gICAgICAgICAgICBpID0gLTFcbiAgICAgICAgICAgIHdoaWxlIGkgPCB2MXBhcnRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICAgICAgaWYgdjJwYXJ0cy5sZW5ndGggPCBpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgaWYgdjFwYXJ0c1tpXSA9PSB2MnBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgZWxzZSBpZiB2MXBhcnRzW2ldID4gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjJwYXJ0c1tpXSA+IHYxcGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG5cbiAgICAgICAgICAgIHJldHVybiAtMSBpZiB2MXBhcnRzLmxlbmd0aCAhPSB2MnBhcnRzLmxlbmd0aFxuXG4gICAgICAgICAgICByZXR1cm4gMFxuXG4gICAgICAgIHN0cmluZzpcbiAgICAgICAgICAgIGNhcGl0YWxpemU6IChzdHIpIC0+XG4gICAgICAgICAgICAgICAgc3RyID0gKGlmIG5vdCBzdHI/IHRoZW4gXCJcIiBlbHNlIFN0cmluZyhzdHIpKVxuICAgICAgICAgICAgICAgIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKVxuXG4gICAgcmV0dXJuIFV0aWxzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIExvZ2dlcikgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgbG9nbGV2ZWwgPSByZXF1aXJlKCdsb2dsZXZlbCcpXG5cbiAgICAjIEV4cG9zZSB0aGUgTG9nZ2VyIEFQSVxuICAgIExvZ2dlciA9XG5cbiAgICAgICAgc2V0TGV2ZWw6IChsZXZlbCkgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnNldExldmVsKGxldmVsKVxuXG4gICAgICAgIHRyYWNlOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwudHJhY2UobXNnKVxuXG4gICAgICAgIGRlYnVnOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZGVidWcobXNnKVxuXG4gICAgICAgIGluZm86IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5pbmZvKG1zZylcblxuICAgICAgICB3YXJuOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwud2Fybihtc2cpXG5cbiAgICAgICAgZXJyb3I6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5lcnJvcihtc2cpXG5cbiAgICByZXR1cm4gTG9nZ2VyXG4pIiwiIyMjKlxuICogVGhpcyB3aWxsIHByb3ZpZGUgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gZGVmaW5lIE1vZHVsZXNcbiAqIGFuZCBwcm92aWRlIGEgd2F5IHRvIGV4dGVuZCB0aGVtXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTW9kdWxlKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UuY29mZmVlJylcblxuICAgICMgdGhpcyB3aWxsIHNlcnZlIGFzIHRoZSBiYXNlIGNsYXNzIGZvciBhIE1vZHVsZVxuICAgIGNsYXNzIE1vZHVsZVxuICAgICAgICBjb25zdHJ1Y3RvcjogKG9wdCkgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ID0gb3B0LnNhbmRib3hcbiAgICAgICAgICAgIEBvcHRpb25zID0gb3B0Lm9wdGlvbnNcbiAgICAgICAgICAgIEBzZXRFbGVtZW50KClcblxuXG4gICAgIyB0aGlzIGNsYXNzIHdpbGwgZXhwb3NlIHN0YXRpYyBtZXRob2RzIHRvIGFkZCwgZXh0ZW5kIGFuZFxuICAgICMgZ2V0IHRoZSBsaXN0IG9mIGFkZGVkIG1vZHVsZXNcbiAgICBjbGFzcyBNb2R1bGVzXG5cbiAgICAgICAgIyB0aGlzIHdpbGwgaG9sZCB0aGUgbGlzdCBvZiBhZGRlZCBtb2R1bGVzXG4gICAgICAgIEBsaXN0IDoge31cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGp1c3QgYW4gYWxpYXMgZm9yIHRoZSBleHRlbmQgbWV0aG9kXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmddfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBkZWZpbml0aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAYWRkIDogKG5hbWUsIGRlZmluaXRpb24pIC0+XG4gICAgICAgICAgICBAZXh0ZW5kKG5hbWUsIGRlZmluaXRpb24sIE1vZHVsZSlcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGdldHRlciBmb3IgcmV0cmlldmluZyBtb2R1bGVzIGRlZmluaXRpb25zXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmFtZVxuICAgICAgICAgKiBAcmV0dXJuIHtbRnVuY3Rpb24vdW5kZWZpbmVkXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBnZXQgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgQGxpc3RbbmFtZV1cbiAgICAgICAgICAgICAgICByZXR1cm4gQGxpc3RbbmFtZV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiB0aGlzIHdpbGwgYWxsb3dzIHVzIHRvIHNpbXBsaWZ5IGFuZCBoYXZlIG1vcmUgY29udHJvbFxuICAgICAgICAgKiBvdmVyIGFkZGluZy9kZWZpbmluZyBtb2R1bGVzXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmddfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBkZWZpbml0aW9uXG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmcvRnVuY3Rpb25dfSBCYXNlQ2xhc3NcbiAgICAgICAgIyMjXG4gICAgICAgIEBleHRlbmQgOiAobmFtZSwgZGVmaW5pdGlvbiwgQmFzZUNsYXNzKSAtPlxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nKG5hbWUpIGFuZCBCYXNlLnV0aWwuaXNPYmplY3QoZGVmaW5pdGlvbilcbiAgICAgICAgICAgICAgICAjIGlmIG5vIEJhc2VDbGFzcyBpcyBwYXNzZWQsIGJ5IGRlZmF1bHQgd2UnbGwgdXNlIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IE1vZHVsZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBhcmUgcGFzc2luZyB0aGUgQmFzZUNsYXNzIGFzIGEgc3RyaW5nLCBpdCBtZWFucyB0aGF0IGNsYXNzXG4gICAgICAgICAgICAgICAgICAgICMgc2hvdWxkIGhhdmUgYmVlbiBhZGRlZCBwcmV2aW91c2x5LCBzbyB3ZSdsbCBsb29rIHVuZGVyIHRoZSBsaXN0IG9ialxuICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGNoZWNrIGlmIHRoZSBjbGFzcyBoYXMgYmVlbiBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBiYyA9IEBsaXN0W0Jhc2VDbGFzc11cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgdGhlIGRlZmluaXRpb24gZXhpc3RzLCBsZXRzIGFzc2lnbiBpdCB0byBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gYmNcbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgbm90LCBsZXRzIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tNb2R1bGUvICcrIG5hbWUgKycgXTogaXMgdHJ5aW5nIHRvIGV4dGVuZCBbJyArIEJhc2VDbGFzcyArICddIHdoaWNoIGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgICMgaWYgaXQgaXMgYSBmdW5jdGlvbiwgd2UnbGwgdXNlIGl0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgICAgICMgVE9ETzogZG8gc29tZSBjaGVja2luZyBiZWZvcmUgdHJ5aW5nIHRvIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gQmFzZUNsYXNzXG5cbiAgICAgICAgICAgICAgICBleHRlbmRlZENsYXNzID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IHRyeSB0byBhZGQgdGhpcyBkZWZpbml0aW9uIGluIGNhc2VcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmhhcyBAbGlzdCwgbmFtZVxuICAgICAgICAgICAgICAgICAgICAjIGV4dGVuZHMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kZWREZWZpbml0aW9uID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgdGhlIHJlZmVyZW5jZSBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgICAgICAgICAgICAgICAgQGxpc3RbbmFtZV0gPSBleHRlbmRlZERlZmluaXRpb25cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5kZWREZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAjIGluZm9ybSB0aGUgZGV2cyB0aGF0IHNvbWVvbmUgaXMgdHJ5aW5nIHRvIGFkZCBhIG1vZHVsZSdzXG4gICAgICAgICAgICAgICAgICAgICMgZGVmaW5pdGlvbiB0aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQ6JyArIG5hbWUgKyAnXSBoYXZlIGFscmVhZHkgYmVlbiBkZWZpbmVkJyBcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICBCYXNlLnV0aWwuZXh0ZW5kIE1vZHVsZTo6LCBCYXNlLkV2ZW50cyxcblxuICAgICAgICAjIHRoaXMgaGFzIHRvIGJlIG92ZXdyaXR0ZW4gYnkgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgIGluaXRpYWxpemU6ICgpIC0+XG4gICAgICAgICAgICBtc2cgPSAnW0NvbXBvbmVudC8nICsgQG9wdGlvbnMubmFtZSArICddOicgKyAnRG9lc25cXCd0IGhhdmUgYW4gaW5pdGlhbGl6ZSBtZXRob2QgZGVmaW5lZCdcbiAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgc2V0RWxlbWVudDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICAgICAgQGVsID0gQG9wdGlvbnMuZWxcbiAgICAgICAgICAgIEAkZWwgPSAkKEBlbClcblxuICAgICAgICAgICAgQGRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICBkZWxlZ2F0ZUV2ZW50czogKGV2ZW50cykgLT5cbiAgICAgICAgICAgICMgcmVnZXggdG8gc3BsaXQgdGhlIGV2ZW50cyBrZXkgKHNlcGFyYXRlcyB0aGUgZXZlbnQgZnJvbSB0aGUgc2VsZWN0b3IpXG4gICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC9cblxuICAgICAgICAgICAgIyBpZiB0aGUgZXZlbnRzIG9iamVjdCBpcyBub3QgZGVmaW5lZCBvciBwYXNzZWQgYXMgYSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICMgdGhlcmUgaXMgbm90aGluZyB0byBkbyBoZXJlXG4gICAgICAgICAgICByZXR1cm4gICAgdW5sZXNzIGV2ZW50cyBvciAoZXZlbnRzID0gQmFzZS51dGlsLnJlc3VsdChALCBcImV2ZW50c1wiKSlcbiAgICAgICAgICAgICMgYmVmb3JlIHRyeWluZyB0byBhdHRhY2ggbmV3IGV2ZW50cywgbGV0cyByZW1vdmUgYW55IHByZXZpb3VzXG4gICAgICAgICAgICAjIGF0dGFjaGVkIGV2ZW50XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIGZvciBrZXkgb2YgZXZlbnRzXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QgbmFtZVxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGV2ZW50c1trZXldXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QncyBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gQFtldmVudHNba2V5XV0gICAgdW5sZXNzIEJhc2UudXRpbC5pc0Z1bmN0aW9uKG1ldGhvZClcbiAgICAgICAgICAgICAgICBjb250aW51ZSAgICB1bmxlc3MgbWV0aG9kXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBrZXkubWF0Y2goZGVsZWdhdGVFdmVudFNwbGl0dGVyKVxuICAgICAgICAgICAgICAgIEBkZWxlZ2F0ZSBtYXRjaFsxXSwgbWF0Y2hbMl0sIEJhc2UudXRpbC5iaW5kKG1ldGhvZCwgQClcblxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICBkZWxlZ2F0ZTogKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSAtPlxuICAgICAgICAgICAgQCRlbC5vbiBldmVudE5hbWUgKyBcIi5wZXN0bGVFdmVudFwiICsgQG9wdGlvbnMuZ3VpZCwgc2VsZWN0b3IsIGxpc3RlbmVyXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgIHVuZGVsZWdhdGVFdmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAJGVsLm9mZignLnBlc3RsZUV2ZW50JyArIEBvcHRpb25zLmd1aWQpICAgIGlmIEAkZWxcbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgIyBieSBkZWZhdWx0LCBpdCB3aWxsIHJlbW92ZSBldmVudGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZVxuICAgICAgICAjICRlbCBmcm9tIHRoZSBET01cbiAgICAgICAgc3RvcDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlKCkgaWYgQCRlbFxuXG4gICAgIyBIZWxwZXJzXG4gICAgZXh0ZW5kID0gKHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSAtPlxuICAgICAgICBwYXJlbnQgPSBAXG5cbiAgICAgICAgIyBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBuZXcgc3ViY2xhc3MgaXMgZWl0aGVyIGRlZmluZWQgYnkgeW91XG4gICAgICAgICMgKHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgaW4geW91ciBgZXh0ZW5kYCBkZWZpbml0aW9uKSwgb3IgZGVmYXVsdGVkXG4gICAgICAgICMgYnkgdXMgdG8gc2ltcGx5IGNhbGwgdGhlIHBhcmVudCdzIGNvbnN0cnVjdG9yXG4gICAgICAgIGlmIHByb3RvUHJvcHMgYW5kIEJhc2UudXRpbC5oYXMocHJvdG9Qcm9wcywgXCJjb25zdHJ1Y3RvclwiKVxuICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoaWxkID0gLT5cbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwbHkgQCwgYXJndW1lbnRzXG5cbiAgICAgICAgIyBBZGQgc3RhdGljIHByb3BlcnRpZXMgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLCBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wc1xuXG4gICAgICAgICMgU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcbiAgICAgICAgIyBgcGFyZW50YCdzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAgICBTdXJyb2dhdGUgPSAtPlxuICAgICAgICAgICAgQGNvbnN0cnVjdG9yID0gY2hpbGRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIFN1cnJvZ2F0ZTo6ID0gcGFyZW50OjpcbiAgICAgICAgY2hpbGQ6OiA9IG5ldyBTdXJyb2dhdGVcblxuICAgICAgICAjIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuICAgICAgICAjIGlmIHN1cHBsaWVkLlxuICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIGNoaWxkOjosIHByb3RvUHJvcHMgICAgaWYgcHJvdG9Qcm9wc1xuXG4gICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGluaXRpYWxpemUgbWV0aG9kIHNvIGl0IGNhbiBiZSBjYWxsZWRcbiAgICAgICAgIyBmcm9tIGl0cyBjaGlsZHNcbiAgICAgICAgY2hpbGQ6Ol9zdXBlcl8gPSBwYXJlbnQ6OmluaXRpYWxpemVcblxuICAgICAgICByZXR1cm4gY2hpbGRcblxuICAgICMgU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGJhc2UgY2xhc3MgZm9yIG1vZHVsZXNcbiAgICBNb2R1bGVzLk1vZHVsZSA9IE1vZHVsZVxuXG4gICAgcmV0dXJuIE1vZHVsZXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVmVyc2lvbkNoZWNrZXIpIC0+XG5cbiAgICBsb2cgPSByZXF1aXJlICcuL2xvZ2dlci5jb2ZmZWUnXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBFeHBvc2UgVmVyc2lvbkNoZWNrZXIgQVBJXG4gICAgVmVyc2lvbkNoZWNrZXIgPVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogUmVjdXJzaXZlIG1ldGhvZCB0byBjaGVjayB2ZXJzaW9uaW5nIGZvciBhbGwgdGhlIGRlZmluZWQgbGlicmFyaWVzXG4gICAgICAgICAqIHdpdGhpbiB0aGUgZGVwZW5kZW5jeSBhcnJheVxuICAgICAgICAjIyNcbiAgICAgICAgY2hlY2s6IChkZXBlbmRlbmNpZXMpIC0+XG5cbiAgICAgICAgICAgIGlmIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBkcCA9IGRlcGVuZGVuY2llcy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICB1bmxlc3MgZHAub2JqXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IGRwLm5hbWUgKyBcIiBpcyBhIGhhcmQgZGVwZW5kZW5jeSBhbmQgaXQgaGFzIHRvIGJlIGxvYWRlZCBiZWZvcmUgcGVzdGxlLmpzXCJcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAgICAgIyBjb21wYXJlIHRoZSB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdW5sZXNzIFV0aWxzLnZlcnNpb25Db21wYXJlKGRwLnZlcnNpb24sIGRwLnJlcXVpcmVkKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyB0aGUgbG9hZGVkIGxpYnJhcnkgZG9lc3Qgbm90IGZ1bGZpbGwgb3VyIG5lZWRzXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW0ZBSUxdIFwiICsgZHAubmFtZSArIFwiOiB2ZXJzaW9uIHJlcXVpcmVkOiBcIiArIGRwLnJlcXVpcmVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgPC0tPiBMb2FkZWQgdmVyc2lvbjogXCIgKyBkcC52ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuXG4gICAgcmV0dXJuIFZlcnNpb25DaGVja2VyXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZpZXdwb3J0KSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICB2aWV3cG9ydCA9IHJlcXVpcmUoJ3ZlcmdlJylcblxuICAgICMgRXhwb3NlIFZpZXdwb3J0IGRldGVjdGlvbiBBUElcbiAgICBWaWV3cG9ydCA9XG5cbiAgICAgICAgdmlld3BvcnRXOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRXKClcblxuICAgICAgICB2aWV3cG9ydEg6IChrZXkpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydEgoKVxuXG4gICAgICAgIHZpZXdwb3J0OiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnQoKVxuXG4gICAgICAgIGluVmlld3BvcnQ6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluVmlld3BvcnQoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5YOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblgoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5ZOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblkoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgc2Nyb2xsWDogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnNjcm9sbFgoKVxuXG4gICAgICAgIHNjcm9sbFk6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxZKClcblxuICAgICAgICAjIFRvIHRlc3QgaWYgYSBtZWRpYSBxdWVyeSBpcyBhY3RpdmVcbiAgICAgICAgbXE6IChtZWRpYVF1ZXJ5U3RyaW5nKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQubXEobWVkaWFRdWVyeVN0cmluZylcblxuICAgICAgICByZWN0YW5nbGU6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnJlY3RhbmdsZShlbCwgY3VzaGlvbilcblxuICAgICAgICAjIGlmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgdGhlbiBpdCByZXR1cm5zIHRoZSBhc3BlY3RcbiAgICAgICAgIyByYXRpbyBvZiB0aGUgdmlld3BvcnQuIElmIGFuIGVsZW1lbnQgaXMgcGFzc2VkIGl0IHJldHVybnNcbiAgICAgICAgIyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBlbGVtZW50XG4gICAgICAgIGFzcGVjdDogKG8pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5hc3BlY3QobylcblxuICAgIHJldHVybiBWaWV3cG9ydFxuKSJdfQ==
