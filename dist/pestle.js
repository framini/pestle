!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.pestle=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/core.coffee":[function(_dereq_,module,exports){

/**
 * The core layer will depend on the base layer and will provide
 * the core set of functionality to application framework
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = root.NGS = factory(root, {});
})(window, function(root, NGS) {
  var Base, ExtManager;
  Base = _dereq_('./base.coffee');
  ExtManager = _dereq_('./util/extmanager.coffee');
  NGS = new Base.Events();
  NGS.Module = _dereq_('./util/module.coffee');
  NGS.modules = {};
  NGS.Core = (function() {
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
      this.config = Base.util.defaults(config, this.cfg);
      this.started = false;
      Base.log.setLevel(this.config.debug.logLevel);
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

    Core.prototype.start = function(selector) {
      var cb;
      if (selector == null) {
        selector = '';
      }
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
              if (Base.util.isFunction(ext.afterAppStarted)) {
                if (ext.optionKey === "components") {
                  ext.afterAppStarted(selector, _this);
                } else {
                  ext.afterAppStarted(_this);
                }
              }
              if (Base.util.isFunction(ext.afterAppInitialized)) {
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
  return NGS;
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

        if (Backbone) {
            Backbone.trigger('imager:ready')
        }
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
 * isMobile.js v0.3.4
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
        define(instantiate());
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
 * EventEmitter v4.2.9 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
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
        namespace = NGS.modules;
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
      Base.util.extend(namespace, NGS.Module.list);
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
      if (!Base.util.isArray(namespace)) {
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
        if (!Base.util.isEmpty(NGS.modules) && NGS.modules[m.name] && m.options) {
          mod = NGS.modules[m.name];
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
      NGS.emit("rwd:windowresize");
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
          NGS.emit(evt);
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
      return NGS.on('responsiveimages:create', this._createInstance);
    };

    ResponsiveImages.prototype._createInstance = function(options) {
      if (options == null) {
        options = {};
      }
      Base.log.info("[ext] Responsive Images Extension creating a new Imager instance");
      return new Base.Imager(options.selector || this.config.defaultSelector, {
        availableWidths: options.availableWidths || this.config.availableWidths,
        availablePixelRatios: options.availablePixelRatios || this.config.availablePixelRatios
      });
    };

    return ResponsiveImages;

  })();
  return {
    initialize: function(app) {
      Base.log.info("[ext] Responsive Images Extension initialized");
      return app.sandbox.responsiveimages = function() {
        var config, rp;
        config = {};
        if (app.config.extension && app.config.extension[this.optionKey]) {
          config = Base.util.defaults({}, app.config.extension[this.optionKey]);
        }
        rp = new ResponsiveImages(config);
        return NGS.emit('responsiveimages:initialized');
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
})(window, function(root, NGS) {
  var Base, ExtManager;
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
      Base.log.info(this._extensions);
      return this._initExtension(this._extensions, context);
    };

    ExtManager.prototype._initExtension = function(extensions, context) {
      var xt;
      if (extensions.length > 0) {
        xt = extensions.shift();
        if (this._isExtensionAllowedToBeActivated(xt, context.config)) {
          xt.initialize(context);
        }
        this._initializedExtensions.push(xt);
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

    Modules.add = function(name, definition) {
      return this.extend(name, definition, Module);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9jb29raWVzLWpzL3NyYy9jb29raWVzLmpzIiwibm9kZV9tb2R1bGVzL2ltYWdlci5qcy9JbWFnZXIuanMiLCJub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJub2RlX21vZHVsZXMvdmVyZ2UvdmVyZ2UuanMiLCJub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V4dG1hbmFnZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9nZW5lcmFsLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbW9kdWxlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxHQUFMLEdBQVcsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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KHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjKlxuICogVGhlIGNvcmUgbGF5ZXIgd2lsbCBkZXBlbmQgb24gdGhlIGJhc2UgbGF5ZXIgYW5kIHdpbGwgcHJvdmlkZVxuICogdGhlIGNvcmUgc2V0IG9mIGZ1bmN0aW9uYWxpdHkgdG8gYXBwbGljYXRpb24gZnJhbWV3b3JrXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuTkdTID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR1MpIC0+XG5cbiAgICBCYXNlICAgICAgID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vdXRpbC9leHRtYW5hZ2VyLmNvZmZlZScpXG5cbiAgICAjIHdlJ2xsIHVzZSB0aGUgTkdTIG9iamVjdCBhcyB0aGUgZ2xvYmFsIEV2ZW50IGJ1c1xuICAgIE5HUyA9IG5ldyBCYXNlLkV2ZW50cygpXG5cbiAgICBOR1MuTW9kdWxlID0gcmVxdWlyZSgnLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgTkdTLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgTkdTLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIHdpbGwgYmUgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgZXh0ZW5zaW9uOiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBleHRlbnNpb24gc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kcyBkZWZpbmVkIGJ5IHRoZVxuICAgICAgICAgICAgIyBleHRlbnNpb25zXG4gICAgICAgICAgICBAc2FuZGJveCA9IEJhc2UudXRpbC5jbG9uZSBCYXNlXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZURlc2lnbiA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVkZXNpZ24uY29mZmVlJylcbiAgICAgICAgICAgIFJlc3BvbnNpdmVJbWFnZXMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9yZXNwb25zaXZlaW1hZ2VzLmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChSZXNwb25zaXZlRGVzaWduKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVJbWFnZXMpXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICBzdGFydDogKHNlbGVjdG9yID0gJycpIC0+XG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIGxldCB1cyBpbml0aWFsaXplIGNvbXBvbmVudHMgYXQgYSBsYXRlciBzdGFnZVxuICAgICAgICAgICAgaWYgQHN0YXJ0ZWQgYW5kIHNlbGVjdG9yIGlzbnQgJydcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgaXMgaW5pdGlhbGl6aW5nIGEgY29tcG9uZW50XCIpXG5cbiAgICAgICAgICAgICAgICBAc2FuZGJveC5zdGFydENvbXBvbmVudHMgc2VsZWN0b3IsIEBcblxuXG4gICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUsIGl0IG1lYW5zIGl0IGlzIHRoZSBmaXN0IHRpbWUgdGhlIHN0YXJ0XG4gICAgICAgICAgICAjIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHdlJ2xsIGhhdmUgdG8gaW5pdGlhbGl6ZSBhbGwgdGhlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgc3RhcnRlZCB0aGUgaW5pdGlhbGl6aW5nIHByb2Nlc3NcIilcblxuICAgICAgICAgICAgICAgIEBzdGFydGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmluaXQoQClcblxuICAgICAgICAgICAgICAgICMgQ2FsbGJhY2sgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICAjIGFmdGVyIGFsbCBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIGFuZCB0aGUgZWFjaCBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAjIG1ldGhvZCBleGVjdXRlZFxuICAgICAgICAgICAgICAgIGNiID0gJC5DYWxsYmFja3MgXCJ1bmlxdWUgbWVtb3J5XCJcblxuICAgICAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgIyBOb3RlOiBUaGlzIG1ldGhvZCB3aWxsIGxldCBlYWNoIGV4dGVuc2lvbiB0byBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgc29tZSBjb2RlXG4gICAgICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChleHQsIGkpID0+XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXh0XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIGV4dC5hZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHNpbmNlIHRoZSBjb21wb25lbnQgZXh0ZW5zaW9uIGlzIHRoZSBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZm9yIGluaXRpYWxpemluZyB0aGUgYXBwLCB3ZSdsbCBnaXZlIGl0IHNwZWNpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRyZWF0bWVudCBhbmQgZ2l2ZSBpdCB0aGUgYWJpbGl0eSB0byByZWNlaXZlIGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBleHRyYSBwYXJhbWV0ZXIgKHRvIHN0YXJ0IGNvbXBvbmVudHMgdGhhdCBvbmx5IGJlbG9uZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdG8gYSBwYXJ0aWN1bGFyIERPTSBlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGV4dC5vcHRpb25LZXkgaXMgXCJjb21wb25lbnRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZCBzZWxlY3RvciwgQFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0LmFmdGVyQXBwU3RhcnRlZChAKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBleHQuYWZ0ZXJBcHBJbml0aWFsaXplZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmFkZCBleHQuYWZ0ZXJBcHBJbml0aWFsaXplZFxuXG4gICAgICAgICAgICAgICAgIyBDYWxsIHRoZSAuYWZ0ZXJBcHBJbml0aWFsaXplZCBjYWxsYmFja3Mgd2l0aCBAIGFzIHBhcmFtZXRlclxuICAgICAgICAgICAgICAgIGNiLmZpcmUgQFxuXG4gICAgICAgIGNyZWF0ZVNhbmRib3g6IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICAgICAgQHNhbmRib3hlc1tuYW1lXSA9IEJhc2UudXRpbC5leHRlbmQge30sIEBzYW5kYm94LCBuYW1lIDogbmFtZVxuXG4gICAgICAgIGdldEluaXRpYWxpemVkQ29tcG9uZW50czogKCkgLT5cbiAgICAgICAgICAgIEBzYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cygpXG5cblxuICAgIHJldHVybiBOR1NcbilcbiIsIi8qXHJcbiAqIENvb2tpZXMuanMgLSAxLjEuMFxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vU2NvdHRIYW1wZXIvQ29va2llc1xyXG4gKlxyXG4gKiBUaGlzIGlzIGZyZWUgYW5kIHVuZW5jdW1iZXJlZCBzb2Z0d2FyZSByZWxlYXNlZCBpbnRvIHRoZSBwdWJsaWMgZG9tYWluLlxyXG4gKi9cclxuKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBmYWN0b3J5ID0gZnVuY3Rpb24gKHdpbmRvdykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nvb2tpZXMuanMgcmVxdWlyZXMgYSBgd2luZG93YCB3aXRoIGEgYGRvY3VtZW50YCBvYmplY3QnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBDb29raWVzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xyXG4gICAgICAgICAgICAgICAgQ29va2llcy5nZXQoa2V5KSA6IENvb2tpZXMuc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEFsbG93cyBmb3Igc2V0dGVyIGluamVjdGlvbiBpbiB1bml0IHRlc3RzXHJcbiAgICAgICAgQ29va2llcy5fZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIFVzZWQgdG8gZW5zdXJlIGNvb2tpZSBrZXlzIGRvIG5vdCBjb2xsaWRlIHdpdGhcclxuICAgICAgICAvLyBidWlsdC1pbiBgT2JqZWN0YCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgQ29va2llcy5fY2FjaGVLZXlQcmVmaXggPSAnY29va2V5Lic7IC8vIEh1cnIgaHVyciwgOilcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLl9jYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGtleV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmV4cGlyZXMgPSBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gLTEgOiBvcHRpb25zLmV4cGlyZXMpO1xyXG5cclxuICAgICAgICAgICAgQ29va2llcy5fZG9jdW1lbnQuY29va2llID0gQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmV4cGlyZSA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuc2V0KGtleSwgdW5kZWZpbmVkLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucyAmJiBvcHRpb25zLnBhdGggfHwgQ29va2llcy5kZWZhdWx0cy5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBvcHRpb25zICYmIG9wdGlvbnMuZG9tYWluIHx8IENvb2tpZXMuZGVmYXVsdHMuZG9tYWluLFxyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogb3B0aW9ucyAmJiBvcHRpb25zLmV4cGlyZXMgfHwgQ29va2llcy5kZWZhdWx0cy5leHBpcmVzLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBvcHRpb25zICYmIG9wdGlvbnMuc2VjdXJlICE9PSB1bmRlZmluZWQgPyAgb3B0aW9ucy5zZWN1cmUgOiBDb29raWVzLmRlZmF1bHRzLnNlY3VyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUgPSBmdW5jdGlvbiAoZXhwaXJlcywgbm93KSB7XHJcbiAgICAgICAgICAgIG5vdyA9IG5vdyB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBleHBpcmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdudW1iZXInOiBleHBpcmVzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIGV4cGlyZXMgKiAxMDAwKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOiBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KSksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVN0cmluZy5zdWJzdHIoc2VwYXJhdG9ySW5kZXggKyAxKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9hcmVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVzdEtleSA9ICdjb29raWVzLmpzJztcclxuICAgICAgICAgICAgdmFyIGFyZUVuYWJsZWQgPSBDb29raWVzLnNldCh0ZXN0S2V5LCAxKS5nZXQodGVzdEtleSkgPT09ICcxJztcclxuICAgICAgICAgICAgQ29va2llcy5leHBpcmUodGVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmVFbmFibGVkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBjb29raWVzRXhwb3J0ID0gdHlwZW9mIGdsb2JhbC5kb2N1bWVudCA9PT0gJ29iamVjdCcgPyBmYWN0b3J5KGdsb2JhbCkgOiBmYWN0b3J5O1xyXG5cclxuICAgIC8vIEFNRCBzdXBwb3J0XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb2tpZXNFeHBvcnQ7IH0pO1xyXG4gICAgLy8gQ29tbW9uSlMvTm9kZS5qcyBzdXBwb3J0XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIFN1cHBvcnQgTm9kZS5qcyBzcGVjaWZpYyBgbW9kdWxlLmV4cG9ydHNgICh3aGljaCBjYW4gYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcclxuICAgICAgICBleHBvcnRzLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9XHJcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvdyk7IiwiO1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkZWZhdWx0V2lkdGhzLCBnZXRLZXlzLCBuZXh0VGljaywgYWRkRXZlbnQsIGdldE5hdHVyYWxXaWR0aDtcblxuICAgIG5leHRUaWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhcHBseUVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2tFYWNoKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb24gPSBbXTtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdfY29sbGVjdGlvbltpXSA9IGNhbGxiYWNrRWFjaChjb2xsZWN0aW9uW2ldLCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdfY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXR1cm5EaXJlY3RWYWx1ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0TmF0dXJhbFdpZHRoID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLCAnbmF0dXJhbFdpZHRoJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS5uYXR1cmFsV2lkdGg7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIElFOCBhbmQgYmVsb3cgbGFja3MgdGhlIG5hdHVyYWxXaWR0aCBwcm9wZXJ0eVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBpbWcuc3JjID0gc291cmNlLnNyYztcbiAgICAgICAgICAgIHJldHVybiBpbWcud2lkdGg7XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIGFkZEV2ZW50ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZFN0YW5kYXJkRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sIGZhbHNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWRkSUVFdmVudExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGZuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgZGVmYXVsdFdpZHRocyA9IFs5NiwgMTMwLCAxNjUsIDIwMCwgMjM1LCAyNzAsIDMwNCwgMzQwLCAzNzUsIDQxMCwgNDQ1LCA0ODUsIDUyMCwgNTU1LCA1OTAsIDYyNSwgNjYwLCA2OTUsIDczNl07XG5cbiAgICBnZXRLZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXSxcbiAgICAgICAgICAgIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbmV3IEltYWdlciBpbnN0YW5jZSwgcGFzc2luZyBhbiBvcHRpb25hbCBjb25maWd1cmF0aW9uIG9iamVjdC5cblxuICAgICAgICBFeGFtcGxlIHVzYWdlOlxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gQXZhaWxhYmxlIHdpZHRocyBmb3IgeW91ciBpbWFnZXNcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFtOdW1iZXJdLFxuXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0b3IgdG8gYmUgdXNlZCB0byBsb2NhdGUgeW91ciBkaXYgcGxhY2Vob2xkZXJzXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gQ2xhc3MgbmFtZSB0byBnaXZlIHlvdXIgcmVzaXphYmxlIGltYWdlc1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJycsXG5cbiAgICAgICAgICAgICAgICAvLyBJZiBzZXQgdG8gdHJ1ZSwgSW1hZ2VyIHdpbGwgdXBkYXRlIHRoZSBzcmMgYXR0cmlidXRlIG9mIHRoZSByZWxldmFudCBpbWFnZXNcbiAgICAgICAgICAgICAgICBvblJlc2l6ZTogQm9vbGVhbixcblxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgbGF6eSBsb2FkIGZ1bmN0aW9uYWxpdHkgb24gb3Igb2ZmXG4gICAgICAgICAgICAgICAgbGF6eWxvYWQ6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBVc2VkIGFsb25nc2lkZSB0aGUgbGF6eWxvYWQgZmVhdHVyZSAoaGVscHMgcGVyZm9ybWFuY2UgYnkgc2V0dGluZyBhIGhpZ2hlciBkZWxheSlcbiAgICAgICAgICAgICAgICBzY3JvbGxEZWxheTogTnVtYmVyXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgQHBhcmFtIHtvYmplY3R9IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICAgICAgQHJldHVybiB7b2JqZWN0fSBpbnN0YW5jZSBvZiBJbWFnZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJbWFnZXIoZWxlbWVudHMsIG9wdHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgZG9jID0gZG9jdW1lbnQ7XG5cbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICAgICAgaWYgKGVsZW1lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHNlbGVjdG9yIHN0cmluZ1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnNlbGVjdG9yID0gZWxlbWVudHM7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSBgb3B0c2Agb2JqZWN0LCBgZWxlbWVudHNgIGlzIGltcGxpY2l0bHkgdGhlIGBvcHRzLnNlbGVjdG9yYCBzdHJpbmdcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50cy5sZW5ndGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3B0cyA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4gPSBbXTtcbiAgICAgICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLnNlbGVjdG9yID0gb3B0cy5zZWxlY3RvciB8fCAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0cy5jbGFzc05hbWUgfHwgJ2ltYWdlLXJlcGxhY2UnO1xuICAgICAgICB0aGlzLmdpZiA9IGRvYy5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgdGhpcy5naWYuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEVBQUpBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBUUFBa0FBQUlLaEkrcHkrMFBvNXlVRlFBNyc7XG4gICAgICAgIHRoaXMuZ2lmLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICB0aGlzLmdpZi5hbHQgPSAnJztcbiAgICAgICAgdGhpcy5zY3JvbGxEZWxheSA9IG9wdHMuc2Nyb2xsRGVsYXkgfHwgMjUwO1xuICAgICAgICB0aGlzLm9uUmVzaXplID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnb25SZXNpemUnKSA/IG9wdHMub25SZXNpemUgOiB0cnVlO1xuICAgICAgICB0aGlzLmxhenlsb2FkID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnbGF6eWxvYWQnKSA/IG9wdHMubGF6eWxvYWQgOiBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVBpeGVsUmF0aW9zID0gb3B0cy5hdmFpbGFibGVQaXhlbFJhdGlvcyB8fCBbMSwgMl07XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gb3B0cy5hdmFpbGFibGVXaWR0aHMgfHwgZGVmYXVsdFdpZHRocztcbiAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkID0gb3B0cy5vbkltYWdlc1JlcGxhY2VkIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHRoaXMud2lkdGhzTWFwID0ge307XG4gICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcbiAgICAgICAgdGhpcy53aWR0aEludGVycG9sYXRvciA9IG9wdHMud2lkdGhJbnRlcnBvbGF0b3IgfHwgcmV0dXJuRGlyZWN0VmFsdWU7XG4gICAgICAgIHRoaXMuZGVsdGFTcXVhcmUgPSBvcHRzLmRlbHRhU3F1YXJlIHx8IDEuNTtcbiAgICAgICAgdGhpcy5zcXVhcmVTZWxlY3RvciA9IG9wdHMuc3F1YXJlU2VsZWN0b3IgfHwgJ3NxcmNyb3AnO1xuICAgICAgICB0aGlzLmFkYXB0U2VsZWN0b3IgPSB0aGlzLmFkYXB0U2VsZWN0b3IgfHwgJ2FkYXB0JztcblxuICAgICAgICAvLyBOZWVkZWQgYXMgSUU4IGFkZHMgYSBkZWZhdWx0IGB3aWR0aGAvYGhlaWdodGAgYXR0cmlidXRl4oCmXG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzLmxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IEltYWdlci5jcmVhdGVXaWR0aHNNYXAodGhpcy5hdmFpbGFibGVXaWR0aHMsIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzO1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gZ2V0S2V5cyh0aGlzLmF2YWlsYWJsZVdpZHRocyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gdGhpcy5hdmFpbGFibGVXaWR0aHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmRpdnMgPSBhcHBseUVhY2goZWxlbWVudHMsIHJldHVybkRpcmVjdFZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0b3IgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGRvYy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzKCk7XG5cbiAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5zY3JvbGxDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kaXZzID0gdGhpcy5pbWFnZXNPZmZTY3JlZW4uc2xpY2UoMCk7IC8vIGNvcHkgYnkgdmFsdWUsIGRvbid0IGNvcHkgYnkgcmVmZXJlbmNlXG4gICAgICAgICAgICB0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcblxuICAgICAgICBpZiAodGhpcy5vblJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclJlc2l6ZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXp5bG9hZCkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclNjcm9sbEV2ZW50KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jcmVhdGVHaWYgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgYSByZXNwb25zaXZlIGltYWdlIHRoZW4gd2UgZG9uJ3QgcmVwbGFjZSBpdCBhZ2FpblxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58ICknICsgdGhpcy5jbGFzc05hbWUgKyAnKCB8JCknKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnRDbGFzc05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycpO1xuICAgICAgICB2YXIgZWxlbWVudFdpZHRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKTtcbiAgICAgICAgdmFyIGdpZiA9IHRoaXMuZ2lmLmNsb25lTm9kZShmYWxzZSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCkge1xuICAgICAgICAgICAgZ2lmLndpZHRoID0gZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcsIGVsZW1lbnRXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBnaWYuY2xhc3NOYW1lID0gKGVsZW1lbnRDbGFzc05hbWUgPyBlbGVtZW50Q2xhc3NOYW1lICsgJyAnIDogJycpICsgdGhpcy5jbGFzc05hbWU7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdhbHQnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1hbHQnKSB8fCB0aGlzLmdpZi5hbHQpO1xuXG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZ2lmLCBlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gZ2lmO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhcHBseUVhY2godGhpcy5kaXZzLCBmdW5jdGlvbihlbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5sYXp5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzVGhpc0VsZW1lbnRPblNjcmVlbihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRpdnNbaV0gPSBzZWxmLmNyZWF0ZUdpZihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmltYWdlc09mZlNjcmVlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNUaGlzRWxlbWVudE9uU2NyZWVuID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB3YXMgd29ya2luZyBpbiBDaHJvbWUgYnV0IGRpZG4ndCB3b3JrIG9uIEZpcmVmb3gsIHNvIGhhZCB0byByZXNvcnQgdG8gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIC8vIGJ1dCBjYW4ndCBmYWxsYmFjayB0byBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCBhcyB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRSB3aXRoIGEgZG9jdHlwZSAoPykgc28gaGF2ZSB0byB1c2UgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICB2YXIgb2Zmc2V0ID0gSW1hZ2VyLmdldFBhZ2VPZmZzZXQoKTtcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRUb3AgPSAwO1xuXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXRUb3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoZWxlbWVudE9mZnNldFRvcCA8ICh0aGlzLnZpZXdwb3J0SGVpZ2h0ICsgb2Zmc2V0KSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNpemluZykge1xuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcblxuICAgICAgICAgICAgYXBwbHlFYWNoKGltYWdlcywgZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyhpbWFnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uSW1hZ2VzUmVwbGFjZWQoaW1hZ2VzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciBjb21wdXRlZFdpZHRoLCBzcmMsIG5hdHVyYWxXaWR0aDtcblxuICAgICAgICBuYXR1cmFsV2lkdGggPSBnZXROYXR1cmFsV2lkdGgoaW1hZ2UpO1xuICAgICAgICBjb21wdXRlZFdpZHRoID0gdHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzID09PSAnZnVuY3Rpb24nID8gdGhpcy5hdmFpbGFibGVXaWR0aHMoaW1hZ2UpIDogdGhpcy5kZXRlcm1pbmVBcHByb3ByaWF0ZVJlc29sdXRpb24oaW1hZ2UpO1xuXG4gICAgICAgIGltYWdlLndpZHRoID0gY29tcHV0ZWRXaWR0aDtcblxuICAgICAgICBpZiAoaW1hZ2Uuc3JjICE9PSB0aGlzLmdpZi5zcmMgJiYgY29tcHV0ZWRXaWR0aCA8PSBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNyYyA9IHRoaXMuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyh0aGlzLmJ1aWxkVXJsU3RydWN0dXJlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSwgaW1hZ2UpLCBjb21wdXRlZFdpZHRoKTtcblxuICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG5cbiAgICAgICAgaWYgKEJhY2tib25lKSB7XG4gICAgICAgICAgICBCYWNrYm9uZS50cmlnZ2VyKCdpbWFnZXI6cmVhZHknKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJykgfHwgaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCwgdGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gdmFsdWUgdXNlZCBieSBJbWFnZXJcbiAgICAgKlxuICAgICAqIEl0IGlzIHBlcmZvcm1lZCBiZWZvcmUgZWFjaCByZXBsYWNlbWVudCBsb29wLCBpbiBjYXNlIGEgdXNlciB6b29tZWQgaW4vb3V0XG4gICAgICogYW5kIHRodXMgdXBkYXRlZCB0aGUgYHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvYCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBhcGlcbiAgICAgKiBAc2luY2UgMS4wLjFcbiAgICAgKi9cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZnJlc2hQaXhlbFJhdGlvID0gZnVuY3Rpb24gcmVmcmVzaFBpeGVsUmF0aW8oKSB7XG4gICAgICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyA9IEltYWdlci5nZXRDbG9zZXN0VmFsdWUoSW1hZ2VyLmdldFBpeGVsUmF0aW8oKSwgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyA9IGZ1bmN0aW9uKHNyYywgc2VsZWN0ZWRXaWR0aCkge1xuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgve3dpZHRofS9nLCBJbWFnZXIudHJhbnNmb3Jtcy53aWR0aChzZWxlY3RlZFdpZHRoLCB0aGlzLndpZHRoc01hcCkpXG4gICAgICAgICAgICAucmVwbGFjZSgve3BpeGVsX3JhdGlvfS9nLCBJbWFnZXIudHJhbnNmb3Jtcy5waXhlbFJhdGlvKHRoaXMuZGV2aWNlUGl4ZWxSYXRpbykpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmJ1aWxkVXJsU3RydWN0dXJlID0gZnVuY3Rpb24oc3JjLCBpbWFnZSkge1xuICAgICAgICB2YXIgc3F1YXJlU2VsZWN0b3IgPSB0aGlzLmlzSW1hZ2VDb250YWluZXJTcXVhcmUoaW1hZ2UpID8gJy4nICsgdGhpcy5zcXVhcmVTZWxlY3RvciA6ICcnO1xuXG4gICAgICAgIHJldHVybiBzcmNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4oanBnfGdpZnxibXB8cG5nKVtec10/KHt3aWR0aH0pP1tec10oe3BpeGVsX3JhdGlvfSk/L2csICcuJyArIHRoaXMuYWRhcHRTZWxlY3RvciArICcuJDIuJDMnICsgc3F1YXJlU2VsZWN0b3IgKyAnLiQxJyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNJbWFnZUNvbnRhaW5lclNxdWFyZSA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiAoaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCAvIGltYWdlLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0KSA8PSB0aGlzLmRlbHRhU3F1YXJlXG4gICAgfTtcblxuICAgIEltYWdlci5nZXRQaXhlbFJhdGlvID0gZnVuY3Rpb24gZ2V0UGl4ZWxSYXRpbyhjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAoY29udGV4dCB8fCB3aW5kb3cpWydkZXZpY2VQaXhlbFJhdGlvJ10gfHwgMTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCA9IGZ1bmN0aW9uIGNyZWF0ZVdpZHRoc01hcCh3aWR0aHMsIGludGVycG9sYXRvcikge1xuICAgICAgICB2YXIgbWFwID0ge30sXG4gICAgICAgICAgICBpID0gd2lkdGhzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBtYXBbd2lkdGhzW2ldXSA9IGludGVycG9sYXRvcih3aWR0aHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnRyYW5zZm9ybXMgPSB7XG4gICAgICAgIHBpeGVsUmF0aW86IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiBmdW5jdGlvbih3aWR0aCwgbWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwW3dpZHRoXSB8fCB3aWR0aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbG9zZXN0IHVwcGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiB2YXIgY2FuZGlkYXRlcyA9IFsxLCAxLjUsIDJdO1xuICAgICAqXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgwLjgsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLCBjYW5kaWRhdGVzKTsgLy8gLT4gMVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMS4zLCBjYW5kaWRhdGVzKTsgLy8gLT4gMS41XG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgzLCBjYW5kaWRhdGVzKTsgLy8gLT4gMlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGFwaVxuICAgICAqIEBzaW5jZSAxLjAuMVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiYXNlVmFsdWVcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBjYW5kaWRhdGVzXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlID0gZnVuY3Rpb24gZ2V0Q2xvc2VzdFZhbHVlKGJhc2VWYWx1ZSwgY2FuZGlkYXRlcykge1xuICAgICAgICB2YXIgaSA9IGNhbmRpZGF0ZXMubGVuZ3RoLFxuICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaSAtIDFdO1xuXG4gICAgICAgIGJhc2VWYWx1ZSA9IHBhcnNlRmxvYXQoYmFzZVZhbHVlLCAxMCk7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGJhc2VWYWx1ZSA8PSBjYW5kaWRhdGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRXaWR0aDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWdpc3RlclJlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHNlbGYuZGl2cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyU2Nyb2xsRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxDaGVjaygpO1xuICAgICAgICB9LCBzZWxmLnNjcm9sbERlbGF5KTtcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXRHZW5lcmF0b3IgPSBmdW5jdGlvbiBnZXRQYWdlVmVydGljYWxPZmZzZXQodGVzdENhc2UpIHtcbiAgICAgICAgaWYgKHRlc3RDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZm9ybSBpcyB1c2VkIGJlY2F1c2UgaXQgc2VlbXMgaW1wb3NzaWJsZSB0byBzdHViIGB3aW5kb3cucGFnZVlPZmZzZXRgXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXQgPSBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvcihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwod2luZG93LCAncGFnZVlPZmZzZXQnKSk7XG5cbiAgICAvLyBFeHBvcnRpbmcgZm9yIHRlc3RpbmcgcHVycG9zZVxuICAgIEltYWdlci5hcHBseUVhY2ggPSBhcHBseUVhY2g7XG5cbiAgICAvKiBnbG9iYWwgbW9kdWxlLCBleHBvcnRzOiB0cnVlLCBkZWZpbmUgKi9cbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KUywganVzdCBleHBvcnRcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gSW1hZ2VyO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBJbWFnZXI7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gSWYgbm8gQU1EIGFuZCB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIsIGF0dGFjaCB0byB3aW5kb3dcbiAgICAgICAgd2luZG93LkltYWdlciA9IEltYWdlcjtcbiAgICB9XG4gICAgLyogZ2xvYmFsIC1tb2R1bGUsIC1leHBvcnRzLCAtZGVmaW5lICovXG5cbn0od2luZG93LCBkb2N1bWVudCkpOyIsIi8qKlxuICogaXNNb2JpbGUuanMgdjAuMy40XG4gKlxuICogQSBzaW1wbGUgbGlicmFyeSB0byBkZXRlY3QgQXBwbGUgcGhvbmVzIGFuZCB0YWJsZXRzLFxuICogQW5kcm9pZCBwaG9uZXMgYW5kIHRhYmxldHMsIG90aGVyIG1vYmlsZSBkZXZpY2VzIChsaWtlIGJsYWNrYmVycnksIG1pbmktb3BlcmEgYW5kIHdpbmRvd3MgcGhvbmUpLFxuICogYW5kIGFueSBraW5kIG9mIHNldmVuIGluY2ggZGV2aWNlLCB2aWEgdXNlciBhZ2VudCBzbmlmZmluZy5cbiAqXG4gKiBAYXV0aG9yOiBLYWkgTWFsbGVhIChrbWFsbGVhQGdtYWlsLmNvbSlcbiAqXG4gKiBAbGljZW5zZTogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXG4gICAgdmFyIGFwcGxlX3Bob25lICAgICAgICAgPSAvaVBob25lL2ksXG4gICAgICAgIGFwcGxlX2lwb2QgICAgICAgICAgPSAvaVBvZC9pLFxuICAgICAgICBhcHBsZV90YWJsZXQgICAgICAgID0gL2lQYWQvaSxcbiAgICAgICAgYW5kcm9pZF9waG9uZSAgICAgICA9IC8oPz0uKlxcYkFuZHJvaWRcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdBbmRyb2lkJyBBTkQgJ01vYmlsZSdcbiAgICAgICAgYW5kcm9pZF90YWJsZXQgICAgICA9IC9BbmRyb2lkL2ksXG4gICAgICAgIHdpbmRvd3NfcGhvbmUgICAgICAgPSAvSUVNb2JpbGUvaSxcbiAgICAgICAgd2luZG93c190YWJsZXQgICAgICA9IC8oPz0uKlxcYldpbmRvd3NcXGIpKD89LipcXGJBUk1cXGIpL2ksIC8vIE1hdGNoICdXaW5kb3dzJyBBTkQgJ0FSTSdcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeSAgICA9IC9CbGFja0JlcnJ5L2ksXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnlfMTAgPSAvQkIxMC9pLFxuICAgICAgICBvdGhlcl9vcGVyYSAgICAgICAgID0gL09wZXJhIE1pbmkvaSxcbiAgICAgICAgb3RoZXJfZmlyZWZveCAgICAgICA9IC8oPz0uKlxcYkZpcmVmb3hcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdGaXJlZm94JyBBTkQgJ01vYmlsZSdcbiAgICAgICAgc2V2ZW5faW5jaCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnKD86JyArICAgICAgICAgLy8gTm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnTmV4dXMgNycgKyAgICAgLy8gTmV4dXMgN1xuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0JOVFYyNTAnICsgICAgIC8vIEImTiBOb29rIFRhYmxldCA3IGluY2hcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdLaW5kbGUgRmlyZScgKyAvLyBLaW5kbGUgRmlyZVxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ1NpbGsnICsgICAgICAgIC8vIEtpbmRsZSBGaXJlLCBTaWxrIEFjY2VsZXJhdGVkXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnR1QtUDEwMDAnICsgICAgLy8gR2FsYXh5IFRhYiA3IGluY2hcblxuICAgICAgICAgICAgJyknLCAgICAgICAgICAgIC8vIEVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdpJyk7ICAgICAgICAgICAvLyBDYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nXG5cbiAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbihyZWdleCwgdXNlckFnZW50KSB7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHZhciBJc01vYmlsZUNsYXNzID0gZnVuY3Rpb24odXNlckFnZW50KSB7XG4gICAgICAgIHZhciB1YSA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgICAgIHRoaXMuYXBwbGUgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFwcGxlX3Bob25lLCB1YSksXG4gICAgICAgICAgICBpcG9kOiAgIG1hdGNoKGFwcGxlX2lwb2QsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2goYXBwbGVfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFwcGxlX3Bob25lLCB1YSkgfHwgbWF0Y2goYXBwbGVfaXBvZCwgdWEpIHx8IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5kcm9pZCA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiAhbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpICYmIG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSB8fCBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2luZG93cyA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2god2luZG93c19waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSkgfHwgbWF0Y2god2luZG93c190YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm90aGVyID0ge1xuICAgICAgICAgICAgYmxhY2tiZXJyeTogICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSksXG4gICAgICAgICAgICBibGFja2JlcnJ5MTA6IG1hdGNoKG90aGVyX2JsYWNrYmVycnlfMTAsIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgICAgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSxcbiAgICAgICAgICAgIGZpcmVmb3g6ICAgICAgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiAgICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpIHx8IG1hdGNoKG90aGVyX29wZXJhLCB1YSkgfHwgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V2ZW5faW5jaCA9IG1hdGNoKHNldmVuX2luY2gsIHVhKTtcbiAgICAgICAgdGhpcy5hbnkgPSB0aGlzLmFwcGxlLmRldmljZSB8fCB0aGlzLmFuZHJvaWQuZGV2aWNlIHx8IHRoaXMud2luZG93cy5kZXZpY2UgfHwgdGhpcy5vdGhlci5kZXZpY2UgfHwgdGhpcy5zZXZlbl9pbmNoO1xuICAgICAgICAvLyBleGNsdWRlcyAnb3RoZXInIGRldmljZXMgYW5kIGlwb2RzLCB0YXJnZXRpbmcgdG91Y2hzY3JlZW4gcGhvbmVzXG4gICAgICAgIHRoaXMucGhvbmUgPSB0aGlzLmFwcGxlLnBob25lIHx8IHRoaXMuYW5kcm9pZC5waG9uZSB8fCB0aGlzLndpbmRvd3MucGhvbmU7XG4gICAgICAgIC8vIGV4Y2x1ZGVzIDcgaW5jaCBkZXZpY2VzLCBjbGFzc2lmeWluZyBhcyBwaG9uZSBvciB0YWJsZXQgaXMgbGVmdCB0byB0aGUgdXNlclxuICAgICAgICB0aGlzLnRhYmxldCA9IHRoaXMuYXBwbGUudGFibGV0IHx8IHRoaXMuYW5kcm9pZC50YWJsZXQgfHwgdGhpcy53aW5kb3dzLnRhYmxldDtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgSU0gPSBuZXcgSXNNb2JpbGVDbGFzcygpO1xuICAgICAgICBJTS5DbGFzcyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgICAgIHJldHVybiBJTTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSXNNb2JpbGVDbGFzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9icm93c2VyaWZ5XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gaW5zdGFudGlhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvL0FNRFxuICAgICAgICBkZWZpbmUoaW5zdGFudGlhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xyXG4gICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgPyBub29wIDogc2VsZi5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXSA9IGxldmVsTmFtZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFBlcnNpc3RlZExldmVsKCkge1xyXG4gICAgICAgIHZhciBzdG9yZWRMZXZlbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvbG9nbGV2ZWw9KFteO10rKS8uZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKVsxXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICpcclxuICAgICAqIFB1YmxpYyBBUElcclxuICAgICAqXHJcbiAgICAgKi9cclxuXHJcbiAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xyXG5cclxuICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBsZXZlbCkge1xyXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XHJcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiLyohXHJcbiAqIHZlcmdlIDEuOS4xKzIwMTQwMjEzMDgwM1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcnlhbnZlL3ZlcmdlXHJcbiAqIE1JVCBMaWNlbnNlIDIwMTMgUnlhbiBWYW4gRXR0ZW5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ocm9vdCwgbmFtZSwgbWFrZSkge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSBtb2R1bGVbJ2V4cG9ydHMnXSA9IG1ha2UoKTtcclxuICBlbHNlIHJvb3RbbmFtZV0gPSBtYWtlKCk7XHJcbn0odGhpcywgJ3ZlcmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciB4cG9ydHMgPSB7fVxyXG4gICAgLCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvd1xyXG4gICAgLCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRcclxuICAgICwgZG9jRWxlbSA9IGRvYyAmJiBkb2MuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAsIG1hdGNoTWVkaWEgPSB3aW5bJ21hdGNoTWVkaWEnXSB8fCB3aW5bJ21zTWF0Y2hNZWRpYSddXHJcbiAgICAsIG1xID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKHEpIHtcclxuICAgICAgICByZXR1cm4gISFtYXRjaE1lZGlhLmNhbGwod2luLCBxKS5tYXRjaGVzO1xyXG4gICAgICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0VyA9IHhwb3J0c1sndmlld3BvcnRXJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudFdpZHRoJ10sIGIgPSB3aW5bJ2lubmVyV2lkdGgnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydEggPSB4cG9ydHNbJ3ZpZXdwb3J0SCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRIZWlnaHQnXSwgYiA9IHdpblsnaW5uZXJIZWlnaHQnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfTtcclxuICBcclxuICAvKiogXHJcbiAgICogVGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZS4gTGlrZSBNb2Rlcm5penIubXFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqLyAgXHJcbiAgeHBvcnRzWydtcSddID0gbXE7XHJcblxyXG4gIC8qKiBcclxuICAgKiBOb3JtYWxpemVkIG1hdGNoTWVkaWFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtNZWRpYVF1ZXJ5TGlzdHxPYmplY3R9XHJcbiAgICovIFxyXG4gIHhwb3J0c1snbWF0Y2hNZWRpYSddID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbWF0Y2hNZWRpYSBtdXN0IGJlIGJpbmRlZCB0byB3aW5kb3dcclxuICAgIHJldHVybiBtYXRjaE1lZGlhLmFwcGx5KHdpbiwgYXJndW1lbnRzKTtcclxuICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHcmFjZWZ1bGx5IGRlZ3JhZGUgdG8gcGxhaW4gb2JqZWN0XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHNpbmNlIDEuOC4wXHJcbiAgICogQHJldHVybiB7e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn19XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdmlld3BvcnQoKSB7XHJcbiAgICByZXR1cm4geyd3aWR0aCc6dmlld3BvcnRXKCksICdoZWlnaHQnOnZpZXdwb3J0SCgpfTtcclxuICB9XHJcbiAgeHBvcnRzWyd2aWV3cG9ydCddID0gdmlld3BvcnQ7XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFhcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxYJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0OyBcclxuICB9O1xyXG5cclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWVxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFknXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHt7dG9wOm51bWJlciwgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyLCBsZWZ0Om51bWJlcn19IGNvb3Jkc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiBhZGp1c3RtZW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZShjb29yZHMsIGN1c2hpb24pIHtcclxuICAgIHZhciBvID0ge307XHJcbiAgICBjdXNoaW9uID0gK2N1c2hpb24gfHwgMDtcclxuICAgIG9bJ3dpZHRoJ10gPSAob1sncmlnaHQnXSA9IGNvb3Jkc1sncmlnaHQnXSArIGN1c2hpb24pIC0gKG9bJ2xlZnQnXSA9IGNvb3Jkc1snbGVmdCddIC0gY3VzaGlvbik7XHJcbiAgICBvWydoZWlnaHQnXSA9IChvWydib3R0b20nXSA9IGNvb3Jkc1snYm90dG9tJ10gKyBjdXNoaW9uKSAtIChvWyd0b3AnXSA9IGNvb3Jkc1sndG9wJ10gLSBjdXNoaW9uKTtcclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3Jvc3MtYnJvd3NlciBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCBwbHVzIG9wdGlvbmFsIGN1c2hpb24uXHJcbiAgICogQ29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbCBlbGVtZW50IG9yIHN0YWNrICh1c2VzIGZpcnN0IGl0ZW0pXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uICsvLSBwaXhlbCBhZGp1c3RtZW50IGFtb3VudFxyXG4gICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlY3RhbmdsZShlbCwgY3VzaGlvbikge1xyXG4gICAgZWwgPSBlbCAmJiAhZWwubm9kZVR5cGUgPyBlbFswXSA6IGVsO1xyXG4gICAgaWYgKCFlbCB8fCAxICE9PSBlbC5ub2RlVHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGNhbGlicmF0ZShlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgY3VzaGlvbik7XHJcbiAgfVxyXG4gIHhwb3J0c1sncmVjdGFuZ2xlJ10gPSByZWN0YW5nbGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgdmlld3BvcnQgYXNwZWN0IHJhdGlvIChvciB0aGUgYXNwZWN0IHJhdGlvIG9mIGFuIG9iamVjdCBvciBlbGVtZW50KVxyXG4gICAqIEBzaW5jZSAxLjcuMFxyXG4gICAqIEBwYXJhbSB7KEVsZW1lbnR8T2JqZWN0KT19IG8gb3B0aW9uYWwgb2JqZWN0IHdpdGggd2lkdGgvaGVpZ2h0IHByb3BzIG9yIG1ldGhvZHNcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICogQGxpbmsgaHR0cDovL3czLm9yZy9UUi9jc3MzLW1lZGlhcXVlcmllcy8jb3JpZW50YXRpb25cclxuICAgKi9cclxuICBmdW5jdGlvbiBhc3BlY3Qobykge1xyXG4gICAgbyA9IG51bGwgPT0gbyA/IHZpZXdwb3J0KCkgOiAxID09PSBvLm5vZGVUeXBlID8gcmVjdGFuZ2xlKG8pIDogbztcclxuICAgIHZhciBoID0gb1snaGVpZ2h0J10sIHcgPSBvWyd3aWR0aCddO1xyXG4gICAgaCA9IHR5cGVvZiBoID09ICdmdW5jdGlvbicgPyBoLmNhbGwobykgOiBoO1xyXG4gICAgdyA9IHR5cGVvZiB3ID09ICdmdW5jdGlvbicgPyB3LmNhbGwobykgOiB3O1xyXG4gICAgcmV0dXJuIHcvaDtcclxuICB9XHJcbiAgeHBvcnRzWydhc3BlY3QnXSA9IGFzcGVjdDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHgtYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblgnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIucmlnaHQgPj0gMCAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHktYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblknXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblZpZXdwb3J0J10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgLy8gRXF1aXYgdG8gYGluWChlbCwgY3VzaGlvbikgJiYgaW5ZKGVsLCBjdXNoaW9uKWAgYnV0IGp1c3QgbWFudWFsbHkgZG8gYm90aCBcclxuICAgIC8vIHRvIGF2b2lkIGNhbGxpbmcgcmVjdGFuZ2xlKCkgdHdpY2UuIEl0IGd6aXBzIGp1c3QgYXMgc21hbGwgbGlrZSB0aGlzLlxyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIucmlnaHQgPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKSAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHhwb3J0cztcclxufSkpOyIsIi8qIVxuICogRXZlbnRFbWl0dGVyIHY0LjIuOSAtIGdpdC5pby9lZVxuICogT2xpdmVyIENhbGR3ZWxsXG4gKiBNSVQgbGljZW5zZVxuICogQHByZXNlcnZlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgbWFuYWdpbmcgZXZlbnRzLlxuICAgICAqIENhbiBiZSBleHRlbmRlZCB0byBwcm92aWRlIGV2ZW50IGZ1bmN0aW9uYWxpdHkgaW4gb3RoZXIgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBjbGFzcyBFdmVudEVtaXR0ZXIgTWFuYWdlcyBldmVudCByZWdpc3RlcmluZyBhbmQgZW1pdHRpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cblxuICAgIC8vIFNob3J0Y3V0cyB0byBpbXByb3ZlIHNwZWVkIGFuZCBzaXplXG4gICAgdmFyIHByb3RvID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcbiAgICB2YXIgZXhwb3J0cyA9IHRoaXM7XG4gICAgdmFyIG9yaWdpbmFsR2xvYmFsVmFsdWUgPSBleHBvcnRzLkV2ZW50RW1pdHRlcjtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdHMgc3RvcmFnZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gbG9vayBmb3IuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLCAtMSBpZiBub3QgZm91bmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgYSBtZXRob2Qgd2hpbGUga2VlcGluZyB0aGUgY29udGV4dCBjb3JyZWN0LCB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGlhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbGlhc0Nsb3N1cmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdpbGwgaW5pdGlhbGlzZSB0aGUgZXZlbnQgb2JqZWN0IGFuZCBsaXN0ZW5lciBhcnJheXMgaWYgcmVxdWlyZWQuXG4gICAgICogV2lsbCByZXR1cm4gYW4gb2JqZWN0IGlmIHlvdSB1c2UgYSByZWdleCBzZWFyY2guIFRoZSBvYmplY3QgY29udGFpbnMga2V5cyBmb3IgZWFjaCBtYXRjaGVkIGV2ZW50LiBTbyAvYmFbcnpdLyBtaWdodCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYmFyIGFuZCBiYXouIEJ1dCBvbmx5IGlmIHlvdSBoYXZlIGVpdGhlciBkZWZpbmVkIHRoZW0gd2l0aCBkZWZpbmVFdmVudCBvciBhZGRlZCBzb21lIGxpc3RlbmVycyB0byB0aGVtLlxuICAgICAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBjb25jYXRlbmF0ZWQgYXJyYXkgb2YgYWxsIG1hdGNoaW5nIGV2ZW50cyBpZlxuICAgICAgICAvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtrZXldID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgbGlzdCBvZiBsaXN0ZW5lciBvYmplY3RzIGFuZCBmbGF0dGVucyBpdCBpbnRvIGEgbGlzdCBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXX0gSnVzdCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZmxhdExpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF0TGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSByZXF1ZXN0ZWQgbGlzdGVuZXJzIHZpYSBnZXRMaXN0ZW5lcnMgYnV0IHdpbGwgYWx3YXlzIHJldHVybiB0aGUgcmVzdWx0cyBpbnNpZGUgYW4gb2JqZWN0LiBUaGlzIGlzIG1haW5seSBmb3IgaW50ZXJuYWwgdXNlIGJ1dCBvdGhlcnMgbWF5IGZpbmQgaXQgdXNlZnVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IGluIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgZnVuY3Rpb24gdG8gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBUaGUgbGlzdGVuZXIgd2lsbCBub3QgYmUgYWRkZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUuXG4gICAgICogSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBpdCBpcyBjYWxsZWQuXG4gICAgICogSWYgeW91IHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUgdGhlbiB0aGUgbGlzdGVuZXIgd2lsbCBiZSBhZGRlZCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXJJc1dyYXBwZWQgPSB0eXBlb2YgbGlzdGVuZXIgPT09ICdvYmplY3QnO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXJJc1dyYXBwZWQgPyBsaXN0ZW5lciA6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBvbmNlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZExpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIFNlbWktYWxpYXMgb2YgYWRkTGlzdGVuZXIuIEl0IHdpbGwgYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlXG4gICAgICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0cyBmaXJzdCBleGVjdXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZE9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZE9uY2VMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgb25jZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkT25jZUxpc3RlbmVyLlxuICAgICAqL1xuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnYWRkT25jZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuICAgICAqIFlvdSBuZWVkIHRvIHRlbGwgaXQgd2hhdCBldmVudCBuYW1lcyBzaG91bGQgYmUgbWF0Y2hlZCBieSBhIHJlZ2V4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcbiAgICAgICAgdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXMgZGVmaW5lRXZlbnQgdG8gZGVmaW5lIG11bHRpcGxlIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFdmVudChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaGVuIHBhc3NlZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSwgaXQgd2lsbCByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byByZW1vdmUgZnJvbSB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqIFllYWgsIHRoaXMgZnVuY3Rpb24gZG9lcyBxdWl0ZSBhIGJpdC4gVGhhdCdzIHByb2JhYmx5IGEgYmFkIHRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gYWRkTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoZmFsc2UsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSByZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG4gICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgZGV0ZXJtaW5lIGlmIHRoZSBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgKHRydWUpIG9yIGFkZGVkIChmYWxzZSkuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYW5pcHVsYXRlIHRoZSBsaXN0ZW5lcnMgb2YgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQvcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLm1hbmlwdWxhdGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiBtYW5pcHVsYXRlTGlzdGVuZXJzKHJlbW92ZSwgZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIHNpbmdsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXIgOiB0aGlzLmFkZExpc3RlbmVyO1xuICAgICAgICB2YXIgbXVsdGlwbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVycyA6IHRoaXMuYWRkTGlzdGVuZXJzO1xuXG4gICAgICAgIC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXRzIHByb3BlcnRpZXMgdG8gdGhpcyBtZXRob2RcbiAgICAgICAgaWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICAgICAgZm9yIChpIGluIGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkgJiYgKHZhbHVlID0gZXZ0W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvIGV2dCBtdXN0IGJlIGEgc3RyaW5nXG4gICAgICAgICAgICAvLyBBbmQgbGlzdGVuZXJzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyBMb29wIG92ZXIgaXQgYW5kIHBhc3MgZWFjaCBvbmUgdG8gdGhlIG11bHRpcGxlIG1ldGhvZFxuICAgICAgICAgICAgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgZXZ0LCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhbiBldmVudCB0aGVuIGFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIFRoYXQgbWVhbnMgZXZlcnkgZXZlbnQgd2lsbCBiZSBlbXB0aWVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gW2V2dF0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLiBXaWxsIHJlbW92ZSBmcm9tIGV2ZXJ5IGV2ZW50IGlmIG5vdCBwYXNzZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVFdmVudChldnQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZXZ0O1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRpZmZlcmVudCB0aGluZ3MgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiBldnRcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1tldnRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIGFsbCBldmVudHNcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG4gICAgICpcbiAgICAgKiBBZGRlZCB0byBtaXJyb3IgdGhlIG5vZGUgQVBJLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IGFsaWFzKCdyZW1vdmVFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG4gICAgICogV2hlbiBlbWl0dGVkLCBldmVyeSBsaXN0ZW5lciBhdHRhY2hlZCB0byB0aGF0IGV2ZW50IHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICogSWYgeW91IHBhc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGFycmF5IHRoZW4gdGhvc2UgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRvIGV2ZXJ5IGxpc3RlbmVyIHVwb24gZXhlY3V0aW9uLlxuICAgICAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cbiAgICAgKiBTbyB0aGV5IHdpbGwgbm90IGFycml2ZSB3aXRoaW4gdGhlIGFycmF5IG9uIHRoZSBvdGhlciBzaWRlLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGUuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdIE9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZ0LCBhcmdzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnNba2V5XS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCBzaGFsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBlaXRoZXIgd2l0aCBhIGJhc2ljIGNhbGwgb3IgYW4gYXBwbHkgaWYgdGhlcmUgaXMgYW4gYXJncyBhcnJheVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1trZXldW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBsaXN0ZW5lci5saXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzIHx8IFtdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGVtaXRFdmVudFxuICAgICAqL1xuICAgIHByb3RvLnRyaWdnZXIgPSBhbGlhcygnZW1pdEV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0bHkgZGlmZmVyZW50IGZyb20gZW1pdEV2ZW50IGluIHRoYXQgaXQgd2lsbCBwYXNzIGl0cyBhcmd1bWVudHMgb24gdG8gdGhlIGxpc3RlbmVycywgYXMgb3Bwb3NlZCB0byB0YWtpbmcgYSBzaW5nbGUgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHBhc3Mgb24uXG4gICAgICogQXMgd2l0aCBlbWl0RXZlbnQsIHlvdSBjYW4gcGFzcyBhIHJlZ2V4IGluIHBsYWNlIG9mIHRoZSBldmVudCBuYW1lIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gT3B0aW9uYWwgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZ0KSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdEV2ZW50KGV2dCwgYXJncyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmIGFcbiAgICAgKiBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhlIG9uZSBzZXQgaGVyZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIGFmdGVyIGV4ZWN1dGlvbi4gVGhpcyB2YWx1ZSBkZWZhdWx0cyB0byB0cnVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIHRvIGNoZWNrIGZvciB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uc2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gc2V0T25jZVJldHVyblZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uY2VSZXR1cm5WYWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWZcbiAgICAgKiB0aGUgbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoaXMgb25lIHRoZW4gaXQgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICAgKiBhdXRvbWF0aWNhbGx5LiBJdCB3aWxsIHJldHVybiB0cnVlIGJ5IGRlZmF1bHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHsqfEJvb2xlYW59IFRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGZvciBvciB0aGUgZGVmYXVsdCwgdHJ1ZS5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gX2dldE9uY2VSZXR1cm5WYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ19vbmNlUmV0dXJuVmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGV2ZW50cyBvYmplY3QgYW5kIGNyZWF0ZXMgb25lIGlmIHJlcXVpcmVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXZlbnRzIHN0b3JhZ2Ugb2JqZWN0LlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRFdmVudHMgPSBmdW5jdGlvbiBfZ2V0RXZlbnRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldmVydHMgdGhlIGdsb2JhbCB7QGxpbmsgRXZlbnRFbWl0dGVyfSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhpcyB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IE5vbiBjb25mbGljdGluZyBFdmVudEVtaXR0ZXIgY2xhc3MuXG4gICAgICovXG4gICAgRXZlbnRFbWl0dGVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IG9yaWdpbmFsR2xvYmFsVmFsdWU7XG4gICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgfTtcblxuICAgIC8vIEV4cG9zZSB0aGUgY2xhc3MgZWl0aGVyIHZpYSBBTUQsIENvbW1vbkpTIG9yIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG59LmNhbGwodGhpcykpO1xuIiwiIyMjKlxuICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBsYXllciBpcyB0byBkZWNsYXJlIGFuZCBhYnN0cmFjdCB0aGUgYWNjZXNzIHRvXG4gKiB0aGUgY29yZSBiYXNlIG9mIGxpYnJhcmllcyB0aGF0IHRoZSByZXN0IG9mIHRoZSBzdGFjayAodGhlIGFwcCBmcmFtZXdvcmspXG4gKiB3aWxsIGRlcGVuZC5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBBcnJheSB0aGF0IGhvbGRzIGhhcmQgZGVwZW5kZW5jaWVzIGZvciB0aGUgU0RLXG4gICAgZGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwialF1ZXJ5XCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjEwXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290LiQgIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC4kIHRoZW4gcm9vdC4kLmZuLmpxdWVyeSBlbHNlIDAgIyBnaXZlcyB0aGUgdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBvZiB0aGUgbG9hZGVkIGxpYlxuICAgICAgICAsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJVbmRlcnNjb3JlXCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjcuMFwiICMgcmVxdWlyZWQgdmVyc2lvblxuICAgICAgICAgICAgXCJvYmpcIjogcm9vdC5fICMgZ2xvYmFsIG9iamVjdFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IGlmIHJvb3QuXyB0aGVuIHJvb3QuXy5WRVJTSU9OIGVsc2UgMFxuICAgIF1cblxuICAgICMgVmVyc2lvbiBjaGVja2VyIHV0aWxcbiAgICBWZXJzaW9uQ2hlY2tlciA9IHJlcXVpcmUgJy4vdXRpbC92ZXJzaW9uY2hlY2tlci5jb2ZmZWUnXG5cbiAgICAjIEluIGNhc2UgYW55IG9mIG91ciBkZXBlbmRlbmNpZXMgd2VyZSBub3QgbG9hZGVkLCBvciBpdHMgdmVyc2lvbiBkb2VzdCBub3QgY29ycmVzcG9uZCB0byBvdXJzXG4gICAgIyBuZWVkcywgdGhlIHZlcnNpb25DaGVja2VyIHdpbGwgdGhvcncgYW4gZXJyb3IgZXhwbGFpbmluZyB3aHlcbiAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cbiAgICAjIExvZ2dlclxuICAgIEJhc2UubG9nID0gcmVxdWlyZSAnLi91dGlsL2xvZ2dlci5jb2ZmZWUnXG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBCYXNlLmRldmljZSA9IHJlcXVpcmUgJy4vdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlJ1xuXG4gICAgIyBDb29raWVzIEFQSVxuICAgIEJhc2UuY29va2llcyA9IHJlcXVpcmUgJy4vdXRpbC9jb29raWVzLmNvZmZlZSdcblxuICAgICMgVmlld3BvcnQgZGV0ZWN0aW9uXG4gICAgQmFzZS52cCA9IHJlcXVpcmUgJy4vdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIEZ1bmN0aW9uIHRoYXQgaXMgZ29ubmEgaGFuZGxlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgQmFzZS5JbWFnZXIgPSByZXF1aXJlICdpbWFnZXIuanMnXG5cbiAgICAjIEV2ZW50IEJ1c1xuICAgIEJhc2UuRXZlbnRzID0gcmVxdWlyZSAnLi91dGlsL2V2ZW50YnVzLmNvZmZlZSdcblxuICAgICMgR2VuZXJhbCBVdGlsc1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi91dGlsL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBVdGlsc1xuICAgIEJhc2UudXRpbCA9IHJvb3QuXy5leHRlbmQgVXRpbHMsIHJvb3QuX1xuXG4gICAgcmV0dXJuIEJhc2VcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSAgID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG4gICAgTW9kdWxlID0gcmVxdWlyZSgnLi8uLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyBvYmplY3QgdG8gc3RvcmUgaW5pdGlhbGl6ZWQgY29tcG9uZW50c1xuICAgICAgICBAaW5pdGlhbGl6ZWRDb21wb25lbnRzIDoge31cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIHN0YXJ0QWxsIG1ldGhvZFxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGNvbXBvbmVudHMgdG8gc3RhcnQgd2l0aGluIHRoZSBwYXNzZWQgc2VsZWN0b3JcbiAgICAgICAgICogYW5kIGNhbGwgdGhlaXIgLmluaXRpYWxpemUoKSBtZXRob2RcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yID0gJ2JvZHknLiBDU1Mgc2VsZWN0b3IgdG8gdGVsbCB0aGUgYXBwIHdoZXJlIHRvIGxvb2sgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgQHN0YXJ0QWxsOiAoc2VsZWN0b3IgPSAnYm9keScsIGFwcCwgbmFtZXNwYWNlID0gTkdTLm1vZHVsZXMpIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2Uoc2VsZWN0b3IsIGFwcC5jb25maWcubmFtZXNwYWNlKVxuXG4gICAgICAgICAgICBjbXBjbG9uZSA9IEJhc2UudXRpbC5jbG9uZSBjb21wb25lbnRzXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJQYXJzZWQgY29tcG9uZW50c1wiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBjbXBjbG9uZVxuXG4gICAgICAgICAgICAjIGFkZGVkIHRvIGtlZXAgbmFtZXNwYWNlLk5BTUUgPSBERUZJTklUSU9OIHNpbnRheC4gVGhpcyB3aWxsIGV4dGVuZFxuICAgICAgICAgICAgIyB0aGUgb2JqZWN0IGRlZmluaXRpb24gd2l0aCB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAjIHRoaXMgbWlnaHQgbmVlZCB0byBiZSByZW1vdmVkXG4gICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRW1wdHkgY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZSwgKGRlZmluaXRpb24sIG5hbWUpIC0+XG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNGdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBNb2R1bGUuZXh0ZW5kIG5hbWUsIGRlZmluaXRpb25cblxuICAgICAgICAgICAgIyBncmFiIGEgcmVmZXJlbmNlIG9mIGFsbCB0aGUgbW9kdWxlIGRlZmluZWQgdXNpbmcgdGhlIE1vZHVsZS5hZGRcbiAgICAgICAgICAgICMgbWV0aG9kLlxuICAgICAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBuYW1lc3BhY2UsIE5HUy5Nb2R1bGUubGlzdFxuXG4gICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFsbDogQ29tcG9uZW50LmluaXRpYWxpemVkQ29tcG9uZW50c1xuICAgICAgICAgICAgICAgIG5ldzogY21wY2xvbmVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIHRoZSBwYXJzZSBtZXRob2Qgd2lsbCBsb29rIGZvciBjb21wb25lbnRzIGRlZmluZWQgdXNpbmdcbiAgICAgICAgICogdGhlIGNvbmZpZ3VyZWQgbmFtZXNwYWNlIGFuZCBsaXZpbmcgd2l0aGluIHRoZSBwYXNzZWRcbiAgICAgICAgICogQ1NTIHNlbGVjdG9yXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBuYW1lc3BhY2UgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICMjI1xuICAgICAgICBAcGFyc2U6IChzZWxlY3RvciwgbmFtZXNwYWNlKSAtPlxuICAgICAgICAgICAgIyBhcnJheSB0byBzdG9yZSBwYXJzZWQgY29tcG9uZW50c1xuICAgICAgICAgICAgbGlzdCA9IFtdXG5cbiAgICAgICAgICAgICMgaWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFzIHBhcmFtZXRlciwgY29udmVydCBpdCB0byBhbiBhcnJheVxuICAgICAgICAgICAgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZS5zcGxpdCAnLCcgICAgdW5sZXNzIEJhc2UudXRpbC5pc0FycmF5IG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAjIGFycmF5IHRvIHN0b3JlIHRoZSBjb21wb3NlZCBjc3Mgc2VsZWN0b3IgdGhhdCB3aWxsIGxvb2sgdXAgZm9yXG4gICAgICAgICAgICAjIGNvbXBvbmVudCBkZWZpbml0aW9uc1xuICAgICAgICAgICAgY3NzU2VsZWN0b3JzID0gW11cblxuICAgICAgICAgICAgIyBpdGVyYXRlcyBvdmVyIHRoZSBuYW1lc3BhY2UgYXJyYXkgYW5kIGNyZWF0ZSB0aGUgbmVlZGVkIGNzcyBzZWxlY3RvcnNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGNvbXAgYWxyZWFkeSBoYXMgdGhlIHBlc3RsZS1ndWlkIGF0dGFjaGVkLCBpdCBtZWFuc1xuICAgICAgICAgICAgICAgICMgaXQgd2FzIGFscmVhZHkgc3RhcnRlZCwgc28gd2UnbGwgb25seSBsb29rIGZvciB1bm5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAjIGNvbXBvbmVudHMgaGVyZVxuICAgICAgICAgICAgICAgIHVubGVzcyAkKGNvbXApLmRhdGEoJ3Blc3RsZS1ndWlkJylcblxuICAgICAgICAgICAgICAgICAgICBucyA9IGRvICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBUaGlzIHdheSB3ZSBvYnRhaW4gdGhlIG5hbWVzcGFjZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAkKGNvbXApLmRhdGEobnMgKyBcIi1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbnNcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogYXR0cmlidXRlcyByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHsgbmFtZTogb3B0aW9ucy5uYW1lLCBvcHRpb25zOiBvcHRpb25zIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0XG5cbiAgICAgICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGluIGNoYXJnZSBvZiBwYXJzaW5nIGFsbCB0aGUgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgIyBkZWZpbmVkIGluIHRoZSBpdHMgJGVsIG1hcmt1cCBhbmQgcGxhY2luZyB0aGVtIGluIGEgb2JqZWN0XG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgb3B0aW9ucyA9IEJhc2UudXRpbC5jbG9uZShvcHRzIHx8IHt9KVxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgRE9NIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgZGF0YSA9ICQoZWwpLmRhdGEoKVxuICAgICAgICAgICAgbmFtZSA9ICcnXG4gICAgICAgICAgICBsZW5ndGggPSAwXG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIGRhdGEsICh2LCBrKSAtPlxuXG4gICAgICAgICAgICAgICAgIyByZW1vdmVzIHRoZSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBrID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBuYW1lc3BhY2UpLCBcIlwiKVxuXG4gICAgICAgICAgICAgICAgIyBkZWNhbWVsaXplIHRoZSBvcHRpb24gbmFtZVxuICAgICAgICAgICAgICAgIGsgPSBrLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgay5zbGljZSgxKVxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUga2V5IGlzIGRpZmZlcmVudCBmcm9tIFwiY29tcG9uZW50XCIgaXQgbWVhbnMgaXQgaXNcbiAgICAgICAgICAgICAgICAjIGFuIG9wdGlvbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIGsgIT0gXCJjb21wb25lbnRcIlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gdlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGgrK1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHZcblxuICAgICAgICAgICAgIyBhZGQgb25lIGJlY2F1c2Ugd2UndmUgYWRkZWQgJ2VsJyBhdXRvbWF0aWNhbGx5IGFzIGFuIGV4dHJhIG9wdGlvblxuICAgICAgICAgICAgb3B0aW9ucy5sZW5ndGggPSBsZW5ndGggKyAxXG5cbiAgICAgICAgICAgICMgYnVpbGQgYWQgcmV0dXJuIHRoZSBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICBDb21wb25lbnQuYnVpbGRPcHRpb25zT2JqZWN0KG5hbWUsIG9wdGlvbnMpXG5cblxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cblxuICAgICAgICAgICAgaWYgY29tcG9uZW50cy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBtID0gY29tcG9uZW50cy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZSBtb2R1bGVzIGFyZSBkZWZpbmVkIHVzaW5nIHRoZSBtb2R1bGVzIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICMgVE9ETzogUHJvdmlkZSBhbiBhbHRlcm5hdGUgd2F5IHRvIGRlZmluZSB0aGVcbiAgICAgICAgICAgICAgICAjIGdsb2JhbCBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eShOR1MubW9kdWxlcykgYW5kIE5HUy5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBOR1MubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBnZW5lcmF0ZXMgYW4gdW5pcXVlIGd1aWQgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbS5vcHRpb25zLmd1aWQgPSBCYXNlLnV0aWwudW5pcXVlSWQobS5uYW1lICsgXCJfXCIpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgIyBCYXNlLnV0aWwuZXh0ZW5kIG1vZCwgc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9keCA9IG5ldyBtb2Qoc2FuZGJveCA6IHNiLCBvcHRpb25zOiBtLm9wdGlvbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbml0IHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbW9keC5pbml0aWFsaXplKClcblxuICAgICAgICAgICAgICAgICAgICAjIHN0b3JlIGEgcmVmZXJlbmNlIG9mIHRoZSBnZW5lcmF0ZWQgZ3VpZCBvbiB0aGUgZWxcbiAgICAgICAgICAgICAgICAgICAgJChtLm9wdGlvbnMuZWwpLmRhdGEgJ3Blc3RsZS1ndWlkJywgbS5vcHRpb25zLmd1aWRcblxuICAgICAgICAgICAgICAgICAgICAjIHNhdmVzIGEgcmVmZXJlbmNlIG9mIHRoZSBpbml0aWFsaXplZCBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50LmluaXRpYWxpemVkQ29tcG9uZW50c1sgbS5vcHRpb25zLmd1aWQgXSA9IG1vZHhcblxuICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cblxuICAgICMjXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgIyNcblxuICAgICMgY29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gQ29tcG9uZW50IGV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgaW5pdGlhbGl6ZWRDb21wb25lbnRzID0ge31cblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMgPSAoc2VsZWN0b3IsIGFwcCkgLT5cblxuICAgICAgICAgICAgaW5pdGlhbGl6ZWRDb21wb25lbnRzID0gQ29tcG9uZW50LnN0YXJ0QWxsKHNlbGVjdG9yLCBhcHApXG5cbiAgICAgICAgYXBwLnNhbmRib3guZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzID0gKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkQ29tcG9uZW50cy5hbGxcblxuICAgICAgICBhcHAuc2FuZGJveC5nZXRMYXN0ZXN0SW5pdGlhbGl6ZWRDb21wb25lbnRzID0gKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkQ29tcG9uZW50cy5uZXdcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoc2VsZWN0b3IsIGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiQ2FsbGluZyBzdGFydENvbXBvbmVudHMgZnJvbSBhZnRlckFwcFN0YXJ0ZWRcIlxuICAgICAgICBzID0gaWYgc2VsZWN0b3IgdGhlbiBzZWxlY3RvciBlbHNlIG51bGxcbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzKHMsIGFwcClcblxuICAgIG5hbWU6ICdDb21wb25lbnQgRXh0ZW5zaW9uJ1xuXG4gICAgIyB0aGlzIHByb3BlcnR5IHdpbGwgYmUgdXNlZCBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuICAgICMgdG8gdmFsaWRhdGUgdGhlIENvbXBvbmVudCBjbGFzcyBpbiBpc29sYXRpb25cbiAgICBjbGFzc2VzIDogQ29tcG9uZW50XG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ2NvbXBvbmVudHMnXG4pXG4iLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGJlIHRyaWdnZXJpbmcgZXZlbnRzIG9uY2UgdGhlIERldmljZSBpbiB3aGljaCB0aGVcbiAqIHVzZXIgaXMgbmF2aWdhdGluZyB0aGUgc2l0ZSBpcyBkZXRlY3RlZC4gSXRzIGZ1Y2lvbmFsaXR5IG1vc3RseSBkZXBlbmRzXG4gKiBvbiB0aGUgY29uZmlndXJhdGlvbnMgc2V0dGluZ3MgKHByb3ZpZGVkIGJ5IGRlZmF1bHQsIGJ1dCB0aGV5IGNhbiBiZSBvdmVycmlkZW4pXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlRGVzaWduXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgVGhpcyBsaW1pdCB3aWxsIGJlIHVzZWQgdG8gbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgIyB3aGVuIHRoZSB1c2VyIHJlc2l6ZSB0aGUgd2luZG93XG4gICAgICAgICAgICB3YWl0TGltaXQ6IDMwMFxuXG4gICAgICAgICAgICAjIGRlZmluZXMgaWYgd2UgaGF2ZSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvdyBvYmpcbiAgICAgICAgICAgIHdpbmRvd1Jlc2l6ZUV2ZW50OiB0cnVlXG5cbiAgICAgICAgICAgICMgRGVmYXVsdCBicmVha3BvaW50c1xuICAgICAgICAgICAgYnJlYWtwb2ludHMgOiBbXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibW9iaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgIyB1bnRpbCB0aGlzIHBvaW50IHdpbGwgYmVoYXZlcyBhcyBtb2JpbGVcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDBcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDc2N1xuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJ0YWJsZXRcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogNzY4XG4gICAgICAgICAgICAgICAgICAgIGJwbWF4OiA5NTlcbiAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgICAgICMgYnkgZGVmYXVsdCBhbnl0aGluZyBncmVhdGVyIHRoYW4gdGFibGV0IGlzIGEgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImRlc2t0b3BcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogOTYwXG4gICAgICAgICAgICBdXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGV0ZWN0RGV2aWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY2hlY2tWaWV3cG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2F0dGFjaFdpbmRvd0hhbmRsZXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImdldERldmljZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfcmVzaXplSGFuZGxlclwiXG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAY2ZnLCBjb25maWdcblxuICAgICAgICAgICAgQF9pbml0KClcblxuICAgICAgICBfaW5pdDogKCkgLT5cblxuICAgICAgICAgICAgQF9hdHRhY2hXaW5kb3dIYW5kbGVycygpIGlmIEBjb25maWcud2luZG93UmVzaXplRXZlbnRcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgX2F0dGFjaFdpbmRvd0hhbmRsZXJzOiAoKSAtPlxuXG4gICAgICAgICAgICBsYXp5UmVzaXplID0gQmFzZS51dGlsLmRlYm91bmNlIEBfcmVzaXplSGFuZGxlciwgQGNvbmZpZy53YWl0TGltaXRcblxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShsYXp5UmVzaXplKVxuXG4gICAgICAgIF9yZXNpemVIYW5kbGVyOiAoKSAtPlxuICAgICAgICAgICAgIyB0cmlnZ2VycyBhIHdpbmRvd3NyZXNpemUgZXZlbnQgc28gdGhpcyB3YXkgd2UgaGF2ZSBhIGNlbnRyYWxpemVkXG4gICAgICAgICAgICAjIHdheSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvd3MgYW5kIHRoZSBjb21wb25lbnNcbiAgICAgICAgICAgICMgY2FuIGxpc3RlbiBkaXJlY3RseSB0byB0aGlzIGV2ZW50IGluc3RlYWQgb2YgZGVmaW5pbmcgYSBuZXcgbGlzdGVuZXJcbiAgICAgICAgICAgIE5HUy5lbWl0IFwicndkOndpbmRvd3Jlc2l6ZVwiXG5cbiAgICAgICAgICAgIEBkZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIGRldGVjdERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgYnAgPSBAY29uZmlnLmJyZWFrcG9pbnRzXG5cbiAgICAgICAgICAgIHZwID0gQmFzZS52cC52aWV3cG9ydFcoKVxuXG4gICAgICAgICAgICAjIGdldCBhIHJlZmVyZW5jZSAoaWYgYW55KSB0byB0aGUgY29ycmVzcG9uZGluZyBicmVha3BvaW50XG4gICAgICAgICAgICAjIGRlZmluZWQgaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgIHZwZCA9IEBfY2hlY2tWaWV3cG9ydCh2cCwgYnApXG5cbiAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eSB2cGRcblxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkQlBOYW1lID0gQmFzZS51dGlsLnN0cmluZy5jYXBpdGFsaXplKHZwZC5uYW1lKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICMgbGV0J3MgZmlzdCBjaGVjayBpZiB3ZSBoYXZlIGEgbWV0aG9kIHRvIGRldGVjdCB0aGUgZGV2aWNlIHRocm91Z2ggVUFcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIFVBRGV0ZWN0b3IgPSBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG5cbiAgICAgICAgICAgICAgICAjIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIHJlc3VsdCBvZiBhIFVBIGNoZWNrLlxuICAgICAgICAgICAgICAgICMgVW5sZXNzIHRoZXJlIGlzIGEgbWV0aG9kIHRvIGNoZWNrIHRoZSBVQSwgbGV0c1xuICAgICAgICAgICAgICAgICMgbGVhdmUgaXQgYXMgZmFsc2UgYW5kIHVzZSBvbmx5IHRoZSB2aWV3cG9ydCB0b1xuICAgICAgICAgICAgICAgICMgbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIFVBRGV0ZWN0b3JcblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVVBID0gVUFEZXRlY3RvcigpXG5cbiAgICAgICAgICAgICAgICAjIEZpbmFsIGNoZWNrLiBGaXJzdCB3ZSdsbCB0cnkgdG8gbWFrZSB0byBtYWtlIHRoZSBkZWNpc2lvblxuICAgICAgICAgICAgICAgICMgdXBvbiB0aGUgY3VycmVudCBkZXZpY2UgYmFzZWQgb24gVUEsIGlmIGlzIG5vdCBwb3NzaWJsZSwgbGV0cyBqdXN0XG4gICAgICAgICAgICAgICAgIyB1c2UgdGhlIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgaWYgc3RhdGVVQSBvciB2cGQubmFtZVxuICAgICAgICAgICAgICAgICAgICAjIFRyaWdnZXIgYSBldmVudCB0aGF0IGZvbGxvd3MgdGhlIGZvbGxvd2luZyBuYW1pbmcgY29udmVudGlvblxuICAgICAgICAgICAgICAgICAgICAjIHJ3ZDo8ZGV2aWNlPlxuICAgICAgICAgICAgICAgICAgICAjIEV4YW1wbGU6IHJ3ZDp0YWJsZXQgb3IgcndkOm1vYmlsZVxuXG4gICAgICAgICAgICAgICAgICAgIGV2dCA9ICdyd2Q6JyArIHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gZXh0ZW5zaW9uIGlzIHRyaWdnZXJpbmcgdGhlIGZvbGxvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgTkdTLmVtaXQgZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgIyBTdG9yZSB0aGUgY3VycmVudCBkZXZpY2VcbiAgICAgICAgICAgICAgICAgICAgQGRldmljZSA9IHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiW2V4dF0gVGhlIHBhc3NlZCBzZXR0aW5ncyB0byB0aGUgUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtaWdodCBub3QgYmUgY29ycmVjdCBzaW5jZSB3ZSBoYXZlbid0IGJlZW4gYWJsZSB0byBkZXRlY3QgYW4gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImFzb2NpYXRlZCBicmVha3BvaW50IHRvIHRoZSBjdXJyZW50IHZpZXdwb3J0XCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIGdldERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIEBkZXZpY2VcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGRldGVjdCBpZiB0aGUgY3VycmVudCB2aWV3cG9ydFxuICAgICAgICAgKiBjb3JyZXNwb25kIHRvIGFueSBvZiB0aGUgZGVmaW5lZCBicCBpbiB0aGUgY29uZmlnIHNldHRpbmdcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSB2cCBbbnVtYmVyLiBDdXJyZW50IHZpZXdwb3J0XVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGJyZWFrcG9pbnRzIFtjbG9uZSBvZiB0aGUgYnJlYWtwb2ludCBrZXkgb2JqZWN0XVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IHRoZSBicmVha3BvaW50IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGN1cnJlbnRseVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGRldGVjdGVkIHZpZXdwb3J0XG4gICAgICAgICMjI1xuICAgICAgICBfY2hlY2tWaWV3cG9ydDogKHZwLCBicmVha3BvaW50cykgLT5cblxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IEJhc2UudXRpbC5maWx0ZXIoYnJlYWtwb2ludHMsIChicCkgLT5cblxuICAgICAgICAgICAgICAgICMgc3RhcnRzIGNoZWNraW5nIGlmIHRoZSBkZXRlY3RlZCB2aWV3cG9ydCBpc1xuICAgICAgICAgICAgICAgICMgYmlnZ2VyIHRoYW4gdGhlIGJwbWluIGRlZmluZWQgaW4gdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAjIGl0ZXJhdGVkIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICBpZiB2cCA+PSBicC5icG1pblxuXG4gICAgICAgICAgICAgICAgICAgICMgd2UnbGwgbmVlZCB0byBjaGVjayB0aGlzIHdheSBiZWNhdXNlIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBhIEJQIGRvZXNuJ3QgaGF2ZSBhIGJwbWF4IHByb3BlcnR5IGl0IG1lYW5zXG4gICAgICAgICAgICAgICAgICAgICMgaXMgdGhlIGxhc3QgYW5kIGJpZ2dlciBjYXNlIHRvIGNoZWNrLiBCeSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICMgaXMgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBpZiBicC5icG1heCBhbmQgYnAuYnBtYXggIT0gMFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIGl0J3Mgd2l0aGluIHRoZSByYW5nZSwgYWxsIGdvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHZwIDw9IGJwLmJwbWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgc2hvdWxkIG9ubHkgYmUgdHJ1ZSBpbiBvbmx5IG9uZSBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEJ5IGRlZmF1bHQsIGp1c3QgZm9yIGRlc2t0b3Agd2hpY2ggZG9lc24ndCBoYXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGFuIFwidW50aWxcIiBicmVha3BvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmYWxzZVxuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIGJyZWFrcG9pbnQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIHJldHVybiBicmVha3BvaW50LnNoaWZ0KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4ge31cblxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAjIENoZWNrIGlmIHRoZSBleHRlbnNpb24gaGFzIGEgY3VzdG9tIGNvbmZpZyB0byB1c2VcbiAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgcndkID0gbmV3IFJlc3BvbnNpdmVEZXNpZ24oY29uZmlnKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCA9ICgpIC0+XG4gICAgICAgICAgICAjIGNhbGwgZGV0ZWN0IERldmljZSBpbiBvcmRlciB0byB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAgICAgICAjIGRldmljZSBldmVudFxuICAgICAgICAgICAgcndkLmRldGVjdERldmljZSgpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkLmdldERldmljZSA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJ3ZC5nZXREZXZpY2UoKVxuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVEZXNpZ25cIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCgpXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlZGVzaWduJ1xuKSIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgaGFuZGxpbmcgdGhlIGNyZWF0aW9uIG9mIHRoZSByZXNwb25zaXZlIGltYWdlc1xuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgUmVzcG9uc2l2ZUltYWdlc1xuXG4gICAgICAgIGNmZyA6XG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlZCBQaXhlbCB3aWR0aCBmb3IgaW1hZ2VzXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFsxMzMsMTUyLDE2MiwyMjUsMjEwLDIyNCwyODAsMzUyLDQ3MCw1MzYsNTkwLDY3Niw3MTAsNzY4LDg4NSw5NDUsMTE5MF1cblxuICAgICAgICAgICAgIyBBcnJheSBvZiBzdXBwb3J0ZXIgcGl4ZWwgcmF0aW9zXG4gICAgICAgICAgICBhdmFpbGFibGVQaXhlbFJhdGlvczogWzEsIDIsIDNdXG5cbiAgICAgICAgICAgICMgU2VsZWN0b3IgdG8gYmUgdXNlZCB3aGVuIGluc3RhbnRpbmcgSW1hZ2VyXG4gICAgICAgICAgICBkZWZhdWx0U2VsZWN0b3IgOiAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCdcblxuICAgICAgICAgICAgIyBsYXp5IG1vZGUgZW5hYmxlZFxuICAgICAgICAgICAgbGF6eW1vZGUgOiB0cnVlXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUxpc3RlbmVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUluc3RhbmNlXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICAjIGNyZWF0ZXMgbGlzdGVuZXJzIHRvIGFsbG93IHRoZSBpbnN0YW50aWF0b24gb2YgdGhlIEltYWdlclxuICAgICAgICAgICAgIyBpbiBsYXp5IGxvYWQgbW9kZS5cbiAgICAgICAgICAgICMgVXNlZnVsIGZvciBpbmZpbml0ZSBzY3JvbGxzIG9yIGltYWdlcyBjcmVhdGVkIG9uIGRlbWFuZFxuICAgICAgICAgICAgQF9jcmVhdGVMaXN0ZW5lcnMoKSBpZiBAY29uZmlnLmxhenltb2RlXG5cbiAgICAgICAgICAgICMgQXMgc29vbiBhcyB0aGlzIGV4dGVuc2lvbiBpcyBpbml0aWFsaXplZCB3ZSBhcmUgZ29ubmEgYmUgY3JlYXRpbmdcbiAgICAgICAgICAgICMgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICBAX2NyZWF0ZUluc3RhbmNlKClcblxuICAgICAgICBfY3JlYXRlTGlzdGVuZXJzOiAoKSAtPlxuICAgICAgICAgICAgIyB0aGlzIGdpdmVzIHRoZSBhYmlsaXR5IHRvIGNyZWF0ZSByZXNwb25zaXZlIGltYWdlc1xuICAgICAgICAgICAgIyBieSB0cmlnZ2VyIHRoaXMgZXZlbnQgd2l0aCBvcHRpb25hbCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBOR1Mub24gJ3Jlc3BvbnNpdmVpbWFnZXM6Y3JlYXRlJywgQF9jcmVhdGVJbnN0YW5jZVxuXG4gICAgICAgIF9jcmVhdGVJbnN0YW5jZSA6IChvcHRpb25zID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24gY3JlYXRpbmcgYSBuZXcgSW1hZ2VyIGluc3RhbmNlXCJcblxuICAgICAgICAgICAgbmV3IEJhc2UuSW1hZ2VyKCBvcHRpb25zLnNlbGVjdG9yIG9yIEBjb25maWcuZGVmYXVsdFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogb3B0aW9ucy5hdmFpbGFibGVXaWR0aHMgb3IgQGNvbmZpZy5hdmFpbGFibGVXaWR0aHMsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlUGl4ZWxSYXRpb3M6IG9wdGlvbnMuYXZhaWxhYmxlUGl4ZWxSYXRpb3Mgb3IgQGNvbmZpZy5hdmFpbGFibGVQaXhlbFJhdGlvc1xuICAgICAgICAgICAgKVxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucmVzcG9uc2l2ZWltYWdlcyA9ICgpIC0+XG5cbiAgICAgICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgICAgICBycCA9IG5ldyBSZXNwb25zaXZlSW1hZ2VzKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0cmlnZ2VyIHRoZSBldmVudCB0byBsZXQgZXZlcnlib2R5IGtub3dzIHRoYXQgdGhpcyBleHRlbnNpb24gZmluaXNoZWRcbiAgICAgICAgICAgICMgaXRzIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICBOR1MuZW1pdCAncmVzcG9uc2l2ZWltYWdlczppbml0aWFsaXplZCdcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlSW1hZ2VzXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzKClcblxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWltYWdlcydcbilcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBDb29raWVzKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBjb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpXG5cbiAgICAjIEV4cG9zZSBDb29raWVzIEFQSVxuICAgIENvb2tpZXMgPVxuXG4gICAgICAgIHNldDogKGtleSwgdmFsdWUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLnNldCBrZXksIHZhbHVlLCBvcHRpb25zXG5cbiAgICAgICAgZ2V0OiAoa2V5KSAtPlxuICAgICAgICAgICAgY29va2llcy5nZXQga2V5XG5cbiAgICAgICAgZXhwaXJlOiAoa2V5LCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgY29va2llcy5leHBpcmUga2V5LCBvcHRpb25zXG5cbiAgICByZXR1cm4gQ29va2llc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBEZXZpY2VEZXRlY3Rpb24pIC0+XG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBpc01vYmlsZSA9IHJlcXVpcmUoJ2lzbW9iaWxlanMnKVxuXG4gICAgIyBFeHBvc2UgZGV2aWNlIGRldGVjdGlvbiBBUElcbiAgICBEZXZpY2VEZXRlY3Rpb24gPVxuXG4gICAgICAgICMgR3JvdXBzXG4gICAgICAgIGlzTW9iaWxlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUucGhvbmVcblxuICAgICAgICBpc1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLnRhYmxldFxuXG4gICAgICAgICMgQXBwbGUgZGV2aWNlc1xuICAgICAgICBpc0lwaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnBob25lXG5cbiAgICAgICAgaXNJcG9kOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuaXBvZFxuXG4gICAgICAgIGlzSXBhZDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnRhYmxldFxuXG4gICAgICAgIGlzQXBwbGUgOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuZGV2aWNlXG5cbiAgICAgICAgIyBBbmRyb2lkIGRldmljZXNcbiAgICAgICAgaXNBbmRyb2lkUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnBob25lXG5cbiAgICAgICAgaXNBbmRyb2lkVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC50YWJsZXRcblxuICAgICAgICBpc0FuZHJvaWREZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLmRldmljZVxuXG4gICAgICAgICMgV2luZG93cyBkZXZpY2VzXG4gICAgICAgIGlzV2luZG93c1Bob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5waG9uZVxuXG4gICAgICAgIGlzV2luZG93c1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MudGFibGV0XG5cbiAgICAgICAgaXNXaW5kb3dzRGV2aWNlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5kZXZpY2VcblxuICAgIHJldHVybiBEZXZpY2VEZXRlY3Rpb25cbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXZlbnRCdXMpIC0+XG5cbiAgICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCd3b2xmeTg3LWV2ZW50ZW1pdHRlcicpXG5cbiAgICAjIyMqXG4gICAgICogY2xhc3MgdGhhdCBzZXJ2ZXMgYXMgYSBmYWNhZGUgZm9yIHRoZSBFdmVudEVtaXR0ZXIgY2xhc3NcbiAgICAjIyNcbiAgICBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50RW1pdHRlclxuXG4gICAgcmV0dXJuIEV2ZW50QnVzXG4pIiwiIyMjKlxuICogVGhlIEV4dGVuc2lvbiBNYW5hbmdlciB3aWxsIHByb3ZpZGUgdGhlIGJhc2Ugc2V0IG9mIGZ1bmN0aW9uYWxpdGllc1xuICogdG8gbWFrZSB0aGUgQ29yZSBsaWJyYXJ5IGV4dGVuc2libGUuXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTkdTKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIERlZmF1bHRzIGNvbmZpZ3MgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIF9leHRlbnNpb25Db25maWdEZWZhdWx0czpcbiAgICAgICAgICAgIGFjdGl2YXRlZCA6IHRydWUgIyB1bmxlc3Mgc2FpZCBvdGhlcndpc2UsIGV2ZXJ5IGFkZGVkIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdpbGwgYmUgYWN0aXZhdGVkIG9uIHN0YXJ0XG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICAjIGNoZWNrcyBpZiB0aGUgbmFtZSBmb3IgdGhlIGV4dGVuc2lvbiBoYXZlIGJlZW4gZGVmaW5lZC5cbiAgICAgICAgICAgICMgaWYgbm90IGxvZyBhIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgdW5sZXNzIGV4dC5uYW1lXG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgZXh0ZW5zaW9uIGRvZXNuJ3QgaGF2ZSBhIG5hbWUgYXNzb2NpYXRlZC4gSXQgd2lsbCBiZSBoZXBmdWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcImlmIHlvdSBoYXZlIGFzc2luZyBhbGwgb2YgeW91ciBleHRlbnNpb25zIGEgbmFtZSBmb3IgYmV0dGVyIGRlYnVnZ2luZ1wiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgIyBMZXRzIHRocm93IGFuIGVycm9yIGlmIHdlIHRyeSB0byBpbml0aWFsaXplIHRoZSBzYW1lIGV4dGVuc2lvbiB0d2ljZXNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIEBfZXh0ZW5zaW9ucywgKHh0LCBpKSAtPlxuICAgICAgICAgICAgICAgIGlmIF8uaXNFcXVhbCB4dCwgZXh0XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQubmFtZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiKVxuXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMucHVzaChleHQpXG5cbiAgICAgICAgaW5pdCA6IChjb250ZXh0KSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBAX2V4dGVuc2lvbnNcblxuICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKEBfZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICBfaW5pdEV4dGVuc2lvbiA6IChleHRlbnNpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBleHRlbnNpb25zLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHh0ID0gZXh0ZW5zaW9ucy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgZXh0ZW5zaW9ucyBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dCkgaWYgQF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkKHh0LCBjb250ZXh0LmNvbmZpZylcblxuICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLnB1c2ggeHRcblxuICAgICAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihleHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkOiAoeHQsIGNvbmZpZykgLT5cblxuICAgICAgICAgICAgIyBmaXJzdCB3ZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBcIm9wdGlvbnNcIiBrZXkgaXMgZGVmaW5lZFxuICAgICAgICAgICAgIyBieSB0aGUgZXh0ZW5zaW9uXG4gICAgICAgICAgICB1bmxlc3MgeHQub3B0aW9uS2V5XG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgb3B0aW9uS2V5IGlzIHJlcXVpcmVkIGFuZCB3YXMgbm90IGRlZmluZWQgYnk6IFwiICsgeHQubmFtZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICMgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkIHRvIHRoZSBleHRlbnNpb24sIGxldHMgY2hlY2sganVzdCBmb3IgXCJhY3RpdmF0ZWRcIlxuICAgICAgICAgICAgIyB3aGljaCBpcyB0aGUgb25seSBvcHRpb24gdGhhdCBzaG91bGQgbWF0dGVyIHdpdGhpbiB0aGlzIG1ldGhvZFxuICAgICAgICAgICAgaWYgY29uZmlnLmV4dGVuc2lvbiBhbmQgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmhhc093blByb3BlcnR5ICdhY3RpdmF0ZWQnXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmFjdGl2YXRlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFjdGl2YXRlZCA9IEBfZXh0ZW5zaW9uQ29uZmlnRGVmYXVsdHMuYWN0aXZhdGVkXG5cbiAgICAgICAgICAgIHJldHVybiBhY3RpdmF0ZWRcblxuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLCBvcHRpb25LZXk6IG5hbWVcblxuICAgICAgICBnZXRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2V4dGVuc2lvbnNcblxuICAgICAgICBnZXRFeHRlbnNpb25CeU5hbWUgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIEJhc2UudXRpbC53aGVyZSBAX2V4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFV0aWxzKSAtPlxuXG4gICAgIyBFeHBvc2UgVXRpbHMgQVBJXG4gICAgVXRpbHMgPVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogRnVuY3Rpb24gdG8gY29tcGFyZSBsaWJyYXJ5IHZlcnNpb25pbmdcbiAgICAgICAgIyMjXG4gICAgICAgIHZlcnNpb25Db21wYXJlIDogKHYxLCB2Miwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgaXNWYWxpZFBhcnQgPSAoeCkgLT5cbiAgICAgICAgICAgICAgICAoKGlmIGxleGljb2dyYXBoaWNhbCB0aGVuIC9eXFxkK1tBLVphLXpdKiQvIGVsc2UgL15cXGQrJC8pKS50ZXN0IHhcblxuICAgICAgICAgICAgbGV4aWNvZ3JhcGhpY2FsID0gb3B0aW9ucyBhbmQgb3B0aW9ucy5sZXhpY29ncmFwaGljYWxcbiAgICAgICAgICAgIHplcm9FeHRlbmQgPSBvcHRpb25zIGFuZCBvcHRpb25zLnplcm9FeHRlbmRcbiAgICAgICAgICAgIHYxcGFydHMgPSB2MS5zcGxpdChcIi5cIilcbiAgICAgICAgICAgIHYycGFydHMgPSB2Mi5zcGxpdChcIi5cIilcblxuICAgICAgICAgICAgcmV0dXJuIE5hTiBpZiBub3QgdjFwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydCkgb3Igbm90IHYycGFydHMuZXZlcnkoaXNWYWxpZFBhcnQpXG5cbiAgICAgICAgICAgIGlmIHplcm9FeHRlbmRcbiAgICAgICAgICAgICAgICB2MXBhcnRzLnB1c2ggXCIwXCIgICAgd2hpbGUgdjFwYXJ0cy5sZW5ndGggPCB2MnBhcnRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIHYycGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MnBhcnRzLmxlbmd0aCA8IHYxcGFydHMubGVuZ3RoXG5cbiAgICAgICAgICAgIHVubGVzcyBsZXhpY29ncmFwaGljYWxcbiAgICAgICAgICAgICAgICB2MXBhcnRzID0gdjFwYXJ0cy5tYXAoTnVtYmVyKVxuICAgICAgICAgICAgICAgIHYycGFydHMgPSB2MnBhcnRzLm1hcChOdW1iZXIpXG5cbiAgICAgICAgICAgIGkgPSAtMVxuICAgICAgICAgICAgd2hpbGUgaSA8IHYxcGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICAgICAgICBpZiB2MnBhcnRzLmxlbmd0aCA8IGlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBpZiB2MXBhcnRzW2ldID09IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYxcGFydHNbaV0gPiB2MnBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgZWxzZSBpZiB2MnBhcnRzW2ldID4gdjFwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcblxuICAgICAgICAgICAgcmV0dXJuIC0xIGlmIHYxcGFydHMubGVuZ3RoICE9IHYycGFydHMubGVuZ3RoXG5cbiAgICAgICAgICAgIHJldHVybiAwXG5cbiAgICAgICAgc3RyaW5nOlxuICAgICAgICAgICAgY2FwaXRhbGl6ZTogKHN0cikgLT5cbiAgICAgICAgICAgICAgICBzdHIgPSAoaWYgbm90IHN0cj8gdGhlbiBcIlwiIGVsc2UgU3RyaW5nKHN0cikpXG4gICAgICAgICAgICAgICAgc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXG5cbiAgICByZXR1cm4gVXRpbHNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTG9nZ2VyKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBsb2dsZXZlbCA9IHJlcXVpcmUoJ2xvZ2xldmVsJylcblxuICAgICMgRXhwb3NlIHRoZSBMb2dnZXIgQVBJXG4gICAgTG9nZ2VyID1cblxuICAgICAgICBzZXRMZXZlbDogKGxldmVsKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuc2V0TGV2ZWwobGV2ZWwpXG5cbiAgICAgICAgdHJhY2U6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC50cmFjZShtc2cpXG5cbiAgICAgICAgZGVidWc6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5kZWJ1Zyhtc2cpXG5cbiAgICAgICAgaW5mbzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmluZm8obXNnKVxuXG4gICAgICAgIHdhcm46IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC53YXJuKG1zZylcblxuICAgICAgICBlcnJvcjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmVycm9yKG1zZylcblxuICAgIHJldHVybiBMb2dnZXJcbikiLCIjIyMqXG4gKiBUaGlzIHdpbGwgcHJvdmlkZSB0aGUgZnVuY3Rpb25hbGl0eSB0byBkZWZpbmUgTW9kdWxlc1xuICogYW5kIHByb3ZpZGUgYSB3YXkgdG8gZXh0ZW5kIHRoZW1cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBNb2R1bGUpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgIyB0aGlzIHdpbGwgc2VydmUgYXMgdGhlIGJhc2UgY2xhc3MgZm9yIGEgTW9kdWxlXG4gICAgY2xhc3MgTW9kdWxlXG4gICAgICAgIGNvbnN0cnVjdG9yOiAob3B0KSAtPlxuICAgICAgICAgICAgQHNhbmRib3ggPSBvcHQuc2FuZGJveFxuICAgICAgICAgICAgQG9wdGlvbnMgPSBvcHQub3B0aW9uc1xuICAgICAgICAgICAgQHNldEVsZW1lbnQoKVxuXG5cbiAgICAjIHRoaXMgY2xhc3Mgd2lsbCBleHBvc2Ugc3RhdGljIG1ldGhvZHMgdG8gYWRkLCBleHRlbmQgYW5kXG4gICAgIyBnZXQgdGhlIGxpc3Qgb2YgYWRkZWQgbW9kdWxlc1xuICAgIGNsYXNzIE1vZHVsZXNcblxuICAgICAgICAjIHRoaXMgd2lsbCBob2xkIHRoZSBsaXN0IG9mIGFkZGVkIG1vZHVsZXNcbiAgICAgICAgQGxpc3QgOiB7fVxuXG4gICAgICAgICMganVzdCBhbiBhbGlhcyBmb3IgZXh0ZW5kXG4gICAgICAgIEBhZGQgOiAobmFtZSwgZGVmaW5pdGlvbikgLT5cbiAgICAgICAgICAgIEBleHRlbmQobmFtZSwgZGVmaW5pdGlvbiwgTW9kdWxlKVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogdGhpcyB3aWxsIGFsbG93cyB1cyB0byBzaW1wbGlmeSBhbmQgaGF2ZSBtb3JlIGNvbnRyb2xcbiAgICAgICAgICogb3ZlciBhZGRpbmcvZGVmaW5pbmcgbW9kdWxlc1xuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nXX0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gZGVmaW5pdGlvblxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nL0Z1bmN0aW9uXX0gQmFzZUNsYXNzXG4gICAgICAgICMjI1xuICAgICAgICBAZXh0ZW5kIDogKG5hbWUsIGRlZmluaXRpb24sIEJhc2VDbGFzcykgLT5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgQmFzZS51dGlsLmlzT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgICAgICAgICAgIyBpZiBubyBCYXNlQ2xhc3MgaXMgcGFzc2VkLCBieSBkZWZhdWx0IHdlJ2xsIHVzZSB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICBCYXNlQ2xhc3MgPSBNb2R1bGVcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgYXJlIHBhc3NpbmcgdGhlIEJhc2VDbGFzcyBhcyBhIHN0cmluZywgaXQgbWVhbnMgdGhhdCBjbGFzc1xuICAgICAgICAgICAgICAgICAgICAjIHNob3VsZCBoYXZlIGJlZW4gYWRkZWQgcHJldmlvdXNseSwgc28gd2UnbGwgbG9vayB1bmRlciB0aGUgbGlzdCBvYmpcbiAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgIyBjaGVjayBpZiB0aGUgY2xhc3MgaGFzIGJlZW4gYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgYmMgPSBAbGlzdFtCYXNlQ2xhc3NdXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIHRoZSBkZWZpbml0aW9uIGV4aXN0cywgbGV0cyBhc3NpZ24gaXQgdG8gQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBiY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIG5vdCwgbGV0cyB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbTW9kdWxlLyAnKyBuYW1lICsnIF06IGlzIHRyeWluZyB0byBleHRlbmQgWycgKyBCYXNlQ2xhc3MgKyAnXSB3aGljaCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgICAgICAgICAgICAgICAgICAjIGlmIGl0IGlzIGEgZnVuY3Rpb24sIHdlJ2xsIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICAjIFRPRE86IGRvIHNvbWUgY2hlY2tpbmcgYmVmb3JlIHRyeWluZyB0byB1c2UgaXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IEJhc2VDbGFzc1xuXG4gICAgICAgICAgICAgICAgZXh0ZW5kZWRDbGFzcyA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICMgd2UnbGwgb25seSB0cnkgdG8gYWRkIHRoaXMgZGVmaW5pdGlvbiBpbiBjYXNlXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5oYXMgQGxpc3QsIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgIyBleHRlbmRzIHRoZSBjdXJyZW50IGRlZmluaXRpb24gd2l0aCB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZGVkRGVmaW5pdGlvbiA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHN0b3JlIHRoZSByZWZlcmVuY2UgZm9yIGxhdGVyIHVzYWdlXG4gICAgICAgICAgICAgICAgICAgIEBsaXN0W25hbWVdID0gZXh0ZW5kZWREZWZpbml0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuZGVkRGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpbmZvcm0gdGhlIGRldnMgdGhhdCBzb21lb25lIGlzIHRyeWluZyB0byBhZGQgYSBtb2R1bGUnc1xuICAgICAgICAgICAgICAgICAgICAjIGRlZmluaXRpb24gdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbQ29tcG9uZW50OicgKyBuYW1lICsgJ10gaGF2ZSBhbHJlYWR5IGJlZW4gZGVmaW5lZCcgXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgQmFzZS51dGlsLmV4dGVuZCBNb2R1bGU6OiwgQmFzZS5FdmVudHMsXG5cbiAgICAgICAgIyB0aGlzIGhhcyB0byBiZSBvdmV3cml0dGVuIGJ5IHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICBpbml0aWFsaXplOiAoKSAtPlxuICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQvJyArIEBvcHRpb25zLm5hbWUgKyAnXTonICsgJ0RvZXNuXFwndCBoYXZlIGFuIGluaXRpYWxpemUgbWV0aG9kIGRlZmluZWQnXG4gICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIHNldEVsZW1lbnQ6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIEBlbCA9IEBvcHRpb25zLmVsXG4gICAgICAgICAgICBAJGVsID0gJChAZWwpXG5cbiAgICAgICAgICAgIEBkZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgZGVsZWdhdGVFdmVudHM6IChldmVudHMpIC0+XG4gICAgICAgICAgICAjIHJlZ2V4IHRvIHNwbGl0IHRoZSBldmVudHMga2V5IChzZXBhcmF0ZXMgdGhlIGV2ZW50IGZyb20gdGhlIHNlbGVjdG9yKVxuICAgICAgICAgICAgZGVsZWdhdGVFdmVudFNwbGl0dGVyID0gL14oXFxTKylcXHMqKC4qKSQvXG5cbiAgICAgICAgICAgICMgaWYgdGhlIGV2ZW50cyBvYmplY3QgaXMgbm90IGRlZmluZWQgb3IgcGFzc2VkIGFzIGEgcGFyYW1ldGVyXG4gICAgICAgICAgICAjIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgcmV0dXJuICAgIHVubGVzcyBldmVudHMgb3IgKGV2ZW50cyA9IEJhc2UudXRpbC5yZXN1bHQoQCwgXCJldmVudHNcIikpXG4gICAgICAgICAgICAjIGJlZm9yZSB0cnlpbmcgdG8gYXR0YWNoIG5ldyBldmVudHMsIGxldHMgcmVtb3ZlIGFueSBwcmV2aW91c1xuICAgICAgICAgICAgIyBhdHRhY2hlZCBldmVudFxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuXG4gICAgICAgICAgICBmb3Iga2V5IG9mIGV2ZW50c1xuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kIG5hbWVcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBldmVudHNba2V5XVxuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kJ3MgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IEBbZXZlbnRzW2tleV1dICAgIHVubGVzcyBCYXNlLnV0aWwuaXNGdW5jdGlvbihtZXRob2QpXG4gICAgICAgICAgICAgICAgY29udGludWUgICAgdW5sZXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIG1hdGNoID0ga2V5Lm1hdGNoKGRlbGVnYXRlRXZlbnRTcGxpdHRlcilcbiAgICAgICAgICAgICAgICBAZGVsZWdhdGUgbWF0Y2hbMV0sIG1hdGNoWzJdLCBCYXNlLnV0aWwuYmluZChtZXRob2QsIEApXG5cbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgZGVsZWdhdGU6IChldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikgLT5cbiAgICAgICAgICAgIEAkZWwub24gZXZlbnROYW1lICsgXCIucGVzdGxlRXZlbnRcIiArIEBvcHRpb25zLmd1aWQsIHNlbGVjdG9yLCBsaXN0ZW5lclxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICB1bmRlbGVnYXRlRXZlbnRzOiAoKSAtPlxuICAgICAgICAgICAgQCRlbC5vZmYoJy5wZXN0bGVFdmVudCcgKyBAb3B0aW9ucy5ndWlkKSAgICBpZiBAJGVsXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgICMgYnkgZGVmYXVsdCwgaXQgd2lsbCByZW1vdmUgZXZlbnRsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGVcbiAgICAgICAgIyAkZWwgZnJvbSB0aGUgRE9NXG4gICAgICAgIHN0b3A6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICBAJGVsLnJlbW92ZSgpIGlmIEAkZWxcblxuICAgICMgSGVscGVyc1xuICAgIGV4dGVuZCA9IChwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgLT5cbiAgICAgICAgcGFyZW50ID0gQFxuXG4gICAgICAgICMgVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgICAgICAjICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgICAgICAjIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3RvclxuICAgICAgICBpZiBwcm90b1Byb3BzIGFuZCBCYXNlLnV0aWwuaGFzKHByb3RvUHJvcHMsIFwiY29uc3RydWN0b3JcIilcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGlsZCA9IC0+XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGx5IEAsIGFyZ3VtZW50c1xuXG4gICAgICAgICMgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gICAgICAgIEJhc2UudXRpbC5leHRlbmQgY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHNcblxuICAgICAgICAjIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgICAgICMgYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgICAgU3Vycm9nYXRlID0gLT5cbiAgICAgICAgICAgIEBjb25zdHJ1Y3RvciA9IGNoaWxkXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBTdXJyb2dhdGU6OiA9IHBhcmVudDo6XG4gICAgICAgIGNoaWxkOjogPSBuZXcgU3Vycm9nYXRlXG5cbiAgICAgICAgIyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgICAgICAgIyBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZDo6LCBwcm90b1Byb3BzICAgIGlmIHByb3RvUHJvcHNcblxuICAgICAgICAjIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBpbml0aWFsaXplIG1ldGhvZCBzbyBpdCBjYW4gYmUgY2FsbGVkXG4gICAgICAgICMgZnJvbSBpdHMgY2hpbGRzXG4gICAgICAgIGNoaWxkOjpfc3VwZXJfID0gcGFyZW50Ojppbml0aWFsaXplXG5cbiAgICAgICAgcmV0dXJuIGNoaWxkXG5cbiAgICAjIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBiYXNlIGNsYXNzIGZvciBtb2R1bGVzXG4gICAgTW9kdWxlcy5Nb2R1bGUgPSBNb2R1bGVcblxuICAgIHJldHVybiBNb2R1bGVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZlcnNpb25DaGVja2VyKSAtPlxuXG4gICAgbG9nID0gcmVxdWlyZSAnLi9sb2dnZXIuY29mZmVlJ1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi9nZW5lcmFsLmNvZmZlZSdcblxuICAgICMgRXhwb3NlIFZlcnNpb25DaGVja2VyIEFQSVxuICAgIFZlcnNpb25DaGVja2VyID1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdG8gY2hlY2sgdmVyc2lvbmluZyBmb3IgYWxsIHRoZSBkZWZpbmVkIGxpYnJhcmllc1xuICAgICAgICAgKiB3aXRoaW4gdGhlIGRlcGVuZGVuY3kgYXJyYXlcbiAgICAgICAgIyMjXG4gICAgICAgIGNoZWNrOiAoZGVwZW5kZW5jaWVzKSAtPlxuXG4gICAgICAgICAgICBpZiBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgZHAgPSBkZXBlbmRlbmNpZXMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgdW5sZXNzIGRwLm9ialxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBkcC5uYW1lICsgXCIgaXMgYSBoYXJkIGRlcGVuZGVuY3kgYW5kIGl0IGhhcyB0byBiZSBsb2FkZWQgYmVmb3JlIHBlc3RsZS5qc1wiXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgICMgY29tcGFyZSB0aGUgdmVyc2lvblxuICAgICAgICAgICAgICAgIHVubGVzcyBVdGlscy52ZXJzaW9uQ29tcGFyZShkcC52ZXJzaW9uLCBkcC5yZXF1aXJlZCkgPj0gMFxuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUgaXQgbWVhbnMgdGhlIGxvYWRlZCBsaWJyYXJ5IGRvZXN0IG5vdCBmdWxmaWxsIG91ciBuZWVkc1xuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIltGQUlMXSBcIiArIGRwLm5hbWUgKyBcIjogdmVyc2lvbiByZXF1aXJlZDogXCIgKyBkcC5yZXF1aXJlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIDwtLT4gTG9hZGVkIHZlcnNpb246IFwiICsgZHAudmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cblxuICAgIHJldHVybiBWZXJzaW9uQ2hlY2tlclxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWaWV3cG9ydCkgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCd2ZXJnZScpXG5cbiAgICAjIEV4cG9zZSBWaWV3cG9ydCBkZXRlY3Rpb24gQVBJXG4gICAgVmlld3BvcnQgPVxuXG4gICAgICAgIHZpZXdwb3J0VzogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0VygpXG5cbiAgICAgICAgdmlld3BvcnRIOiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRIKClcblxuICAgICAgICB2aWV3cG9ydDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0KClcblxuICAgICAgICBpblZpZXdwb3J0OiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblZpZXdwb3J0KGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5YKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5ZKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIHNjcm9sbFg6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxYKClcblxuICAgICAgICBzY3JvbGxZOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWSgpXG5cbiAgICAgICAgIyBUbyB0ZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlXG4gICAgICAgIG1xOiAobWVkaWFRdWVyeVN0cmluZykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0Lm1xKG1lZGlhUXVlcnlTdHJpbmcpXG5cbiAgICAgICAgcmVjdGFuZ2xlOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5yZWN0YW5nbGUoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgIyBpZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIHRoZW4gaXQgcmV0dXJucyB0aGUgYXNwZWN0XG4gICAgICAgICMgcmF0aW8gb2YgdGhlIHZpZXdwb3J0LiBJZiBhbiBlbGVtZW50IGlzIHBhc3NlZCBpdCByZXR1cm5zXG4gICAgICAgICMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZWxlbWVudFxuICAgICAgICBhc3BlY3Q6IChvKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuYXNwZWN0KG8pXG5cbiAgICByZXR1cm4gVmlld3BvcnRcbikiXX0=
