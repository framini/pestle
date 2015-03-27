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
      extension: {},
      component: {}
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
        Base.log.error("Pestle has already been started. You can not set up configs at this point.");
        throw new Error('You can not set up configs when Pestle has already started.');
      }
    };

    Core.prototype.setComponentConfig = function(comp, config) {
      var msg;
      if (!this.started) {
        if (!(comp && Base.util.isString(comp))) {
          msg = "[setComponentConfig method] 1st param should be a string, you're passing:" + typeof config;
          Base.log.error(msg);
          throw new Error(msg);
        }
        if (Base.util.isObject(config)) {
          if (!Base.util.isEmpty(this.config)) {
            return this.config.component[comp] = Base.util.defaults(config, this.config.component[comp]);
          } else {
            this.config = this.config || {};
            return this.config.component[comp] = Base.util.defaults(config, this.cfg.component[comp]);
          }
        } else {
          msg = "[setComponentConfig method] 2nd param should be an object & you're passing:" + typeof config;
          Base.log.error(msg);
          throw new Error(msg);
        }
      } else {
        Base.log.error("Pestle has already been started. You can not add new extensions at this point.");
        throw new Error('You can not add extensions when Pestle has already started.');
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



},{"./base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee","./extension/components.coffee":"/home/dirigaray/projects/natgeo/pestle/src/extension/components.coffee","./extension/responsivedesign.coffee":"/home/dirigaray/projects/natgeo/pestle/src/extension/responsivedesign.coffee","./extension/responsiveimages.coffee":"/home/dirigaray/projects/natgeo/pestle/src/extension/responsiveimages.coffee","./util/extmanager.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/extmanager.coffee","./util/module.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/module.coffee"}],"/home/dirigaray/projects/natgeo/pestle/node_modules/cookies-js/dist/cookies.js":[function(_dereq_,module,exports){
/*
 * Cookies.js - 1.2.1
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
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

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

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
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
},{}],"/home/dirigaray/projects/natgeo/pestle/node_modules/imager.js/Imager.js":[function(_dereq_,module,exports){
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
        this.allowedExtensions = ["jpg","bmp","png","jpeg"];

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
        gif.setAttribute('itemprop', element.getAttribute('data-itemprop') || "contentUrl");
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

        if (this.isExtensionAllowed(image)) {
            src = this.changeImageSrcToUseNewImageDimensions(this.buildUrlStructure(image.getAttribute('data-src'), image), computedWidth);
        } else {
            src = this.removeModifiersfromImageSrc(image.getAttribute('data-src'));
        }

        image.src = src;
    };

    Imager.prototype.removeModifiersfromImageSrc = function(src) {
        var regExp = new RegExp("\\/{width}\\/{pixel_ratio}", "g");
        return src.replace(regExp, '');
    };

    Imager.prototype.isExtensionAllowed = function(image) {
        var imageExtension = this.getImageExtension(image);
        return imageExtension ? this.allowedExtensions.indexOf(imageExtension.toLowerCase()) > -1 : false;
    };

    Imager.prototype.getImageExtension = function(image) {
        var regExp = new RegExp("\\/.*\\.(.*)\\/{width}\\/{pixel_ratio}?", "gi");
        var match = regExp.exec(image.getAttribute('data-src'));
        return match ? match[1] : "";
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

        var regExp = new RegExp("\\.(" + this.allowedExtensions.join("|")  + ")\\/({width})\\/({pixel_ratio})?", "gi");

        return src.replace(regExp, '.' + this.adaptSelector + '.$2.$3' + squareSelector + '.$1');
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
},{}],"/home/dirigaray/projects/natgeo/pestle/node_modules/ismobilejs/isMobile.js":[function(_dereq_,module,exports){
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

},{}],"/home/dirigaray/projects/natgeo/pestle/node_modules/loglevel/lib/loglevel.js":[function(_dereq_,module,exports){
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

},{}],"/home/dirigaray/projects/natgeo/pestle/node_modules/verge/verge.js":[function(_dereq_,module,exports){
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
},{}],"/home/dirigaray/projects/natgeo/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js":[function(_dereq_,module,exports){
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

},{}],"/home/dirigaray/projects/natgeo/pestle/src/base.coffee":[function(_dereq_,module,exports){

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



},{"./util/cookies.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/cookies.coffee","./util/devicedetection.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/devicedetection.coffee","./util/eventbus.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/eventbus.coffee","./util/general.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/general.coffee","./util/logger.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/logger.coffee","./util/versionchecker.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/versionchecker.coffee","./util/viewportdetection.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/viewportdetection.coffee","imager.js":"/home/dirigaray/projects/natgeo/pestle/node_modules/imager.js/Imager.js"}],"/home/dirigaray/projects/natgeo/pestle/src/extension/components.coffee":[function(_dereq_,module,exports){
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
          m.options.__defaults__ = app.config.component[m.name];
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



},{"./../base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee","./../util/module.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/module.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/extension/responsivedesign.coffee":[function(_dereq_,module,exports){

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



},{"./../base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/extension/responsiveimages.coffee":[function(_dereq_,module,exports){

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



},{"./../base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/util/cookies.coffee":[function(_dereq_,module,exports){
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



},{"cookies-js":"/home/dirigaray/projects/natgeo/pestle/node_modules/cookies-js/dist/cookies.js"}],"/home/dirigaray/projects/natgeo/pestle/src/util/devicedetection.coffee":[function(_dereq_,module,exports){
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



},{"ismobilejs":"/home/dirigaray/projects/natgeo/pestle/node_modules/ismobilejs/isMobile.js"}],"/home/dirigaray/projects/natgeo/pestle/src/util/eventbus.coffee":[function(_dereq_,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, EventBus) {
  var EventEmitter;
  EventEmitter = _dereq_('wolfy87-eventemitter');

  /**
   * class that serves as a facade for the EventEmitter class
   */
  EventBus = (function(superClass) {
    extend(EventBus, superClass);

    function EventBus() {
      return EventBus.__super__.constructor.apply(this, arguments);
    }

    return EventBus;

  })(EventEmitter);
  return EventBus;
});



},{"wolfy87-eventemitter":"/home/dirigaray/projects/natgeo/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js"}],"/home/dirigaray/projects/natgeo/pestle/src/util/extmanager.coffee":[function(_dereq_,module,exports){

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



},{"../base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/util/general.coffee":[function(_dereq_,module,exports){
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



},{}],"/home/dirigaray/projects/natgeo/pestle/src/util/logger.coffee":[function(_dereq_,module,exports){
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



},{"loglevel":"/home/dirigaray/projects/natgeo/pestle/node_modules/loglevel/lib/loglevel.js"}],"/home/dirigaray/projects/natgeo/pestle/src/util/module.coffee":[function(_dereq_,module,exports){

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



},{"../base.coffee":"/home/dirigaray/projects/natgeo/pestle/src/base.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/util/versionchecker.coffee":[function(_dereq_,module,exports){
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



},{"./general.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/general.coffee","./logger.coffee":"/home/dirigaray/projects/natgeo/pestle/src/util/logger.coffee"}],"/home/dirigaray/projects/natgeo/pestle/src/util/viewportdetection.coffee":[function(_dereq_,module,exports){
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



},{"verge":"/home/dirigaray/projects/natgeo/pestle/node_modules/verge/verge.js"}]},{},["./src/core.coffee"])("./src/core.coffee")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvY29yZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvY29va2llcy1qcy9kaXN0L2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvaW1hZ2VyLmpzL0ltYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9pc21vYmlsZWpzL2lzTW9iaWxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIm5vZGVfbW9kdWxlcy92ZXJnZS92ZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy93b2xmeTg3LWV2ZW50ZW1pdHRlci9FdmVudEVtaXR0ZXIuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL25hdGdlby9wZXN0bGUvc3JjL2V4dGVuc2lvbi9yZXNwb25zaXZlZGVzaWduLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9jb29raWVzLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9leHRtYW5hZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL2dlbmVyYWwuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL25hdGdlby9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL21vZHVsZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC92ZXJzaW9uY2hlY2tlci5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVBRmxDO0FBQUEsQ0FBRCxDQUFBLENBSUUsTUFKRixFQUlVLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUVOLE1BQUEsZ0JBQUE7QUFBQSxFQUFBLElBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUFiLENBQUE7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FEYixDQUFBO0FBQUEsRUFJQSxNQUFBLEdBQWEsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSmIsQ0FBQTtBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBTmhCLENBQUE7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBVGpCLENBQUE7QUFBQSxFQVdNLE1BQU0sQ0FBQztBQUVULG1CQUFBLE9BQUEsR0FBUyxP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUEsSUFlQSxHQUFBLEVBQUssU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO2FBQ0QsUUFBUSxDQUFDLEdBQVQsQ0FBYSxFQUFiLEVBQWlCLE9BQWpCLEVBREM7SUFBQSxDQWZMO0FBQUEsSUFrQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBbEJUO0FBQUEsSUFxQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBckJUO0FBQUEsSUF5QkEsRUFBQSxFQUFJLFNBQUMsZ0JBQUQsR0FBQTthQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksZ0JBQVosRUFEQTtJQUFBLENBekJKO0FBQUEsSUE0QkEsU0FBQSxFQUFXLFNBQUMsRUFBRCxFQUFLLE9BQUwsR0FBQTthQUNQLFFBQVEsQ0FBQyxTQUFULENBQW1CLEVBQW5CLEVBQXVCLE9BQXZCLEVBRE87SUFBQSxDQTVCWDtBQUFBLElBa0NBLE1BQUEsRUFBUSxTQUFDLENBQUQsR0FBQTthQUNKLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBREk7SUFBQSxDQWxDUjtHQUxKLENBQUE7QUEwQ0EsU0FBTyxRQUFQLENBN0NNO0FBQUEsQ0FKVixDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjKlxuICogVGhlIGNvcmUgbGF5ZXIgd2lsbCBkZXBlbmQgb24gdGhlIGJhc2UgbGF5ZXIgYW5kIHdpbGwgcHJvdmlkZVxuICogdGhlIGNvcmUgc2V0IG9mIGZ1bmN0aW9uYWxpdHkgdG8gYXBwbGljYXRpb24gZnJhbWV3b3JrXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuUGVzdGxlID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBQZXN0bGUpIC0+XG5cbiAgICBCYXNlICAgICAgID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vdXRpbC9leHRtYW5hZ2VyLmNvZmZlZScpXG5cbiAgICAjIHdlJ2xsIHVzZSB0aGUgUGVzdGxlIG9iamVjdCBhcyB0aGUgZ2xvYmFsIEV2ZW50IGJ1c1xuICAgIFBlc3RsZSA9IG5ldyBCYXNlLkV2ZW50cygpXG5cbiAgICBQZXN0bGUuTW9kdWxlID0gcmVxdWlyZSgnLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgUGVzdGxlLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgUGVzdGxlLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIHdpbGwgYmUgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgZXh0ZW5zaW9uOiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBleHRlbnNpb24gc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICAgICAgY29tcG9uZW50OiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBjb21wb25lbnQgc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuICAgICAgICAgICAgIyBpbml0aWFsaXplIHRoZSBjb25maWcgb2JqZWN0XG4gICAgICAgICAgICBAc2V0Q29uZmlnKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgdHJhY2sgdGhlIHN0YXRlIG9mIHRoZSBDb3JlLiBXaGVuIGl0IGlzXG4gICAgICAgICAgICAjIHRydWUsIGl0IG1lYW5zIHRoZSBcInN0YXJ0KClcIiBoYXMgYmVlbiBjYWxsZWRcbiAgICAgICAgICAgIEBzdGFydGVkID0gZmFsc2VcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kcyBkZWZpbmVkIGJ5IHRoZVxuICAgICAgICAgICAgIyBleHRlbnNpb25zXG4gICAgICAgICAgICBAc2FuZGJveCA9IEJhc2UudXRpbC5jbG9uZSBCYXNlXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZURlc2lnbiA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVkZXNpZ24uY29mZmVlJylcbiAgICAgICAgICAgIFJlc3BvbnNpdmVJbWFnZXMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9yZXNwb25zaXZlaW1hZ2VzLmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChSZXNwb25zaXZlRGVzaWduKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVJbWFnZXMpXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICAjIHByb3ZpZGVzIGEgd2F5IGZvciBzZXR0aW5nIHVwIGNvbmZpZ3NcbiAgICAgICAgIyBhZnRlciBQZXN0bGUgaGFzIGJlZW4gaW5zdGFudGlhdGVkXG4gICAgICAgIHNldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc09iamVjdCBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBlbnRlciBoZXJlIGl0IG1lYW5zIFBlc3RsZSBoYXMgYmVlbiBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgICAgICMgZHVyaW5nIGluc3RhbnRpYXRpb24sIHNvIHdlJ2xsIHVzZSB0aGUgY29uZmlnIG9iamVjdCBhcyBhXG4gICAgICAgICAgICAgICAgICAgICMgcHJvdmlkZXIgZm9yIGRlZmF1bHQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0VtcHR5IEBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMgY29uZmlnLCBAY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICMgaWYgaXQgaXMgZW1wdHksIGl0IG1lYW5zIHdlIGFyZSBnb2luZyBzZXR0aW5nIHVwIFBlc3RsZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgIyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gXCJbc2V0Q29uZmlnIG1ldGhvZF0gb25seSBhY2NlcHQgYW4gb2JqZWN0IGFzIGEgcGFyYW1ldGVyIGFuZCB5b3UncmUgcGFzc2luZzogXCIgKyB0eXBlb2YgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKG1zZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlBlc3RsZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IHNldCB1cCBjb25maWdzIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG5vdCBzZXQgdXAgY29uZmlncyB3aGVuIFBlc3RsZSBoYXMgYWxyZWFkeSBzdGFydGVkLicpXG5cbiAgICAgICAgc2V0Q29tcG9uZW50Q29uZmlnOiAoY29tcCwgY29uZmlnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgXG4gICAgICAgICAgICAgICAgdW5sZXNzIGNvbXAgYW5kIEJhc2UudXRpbC5pc1N0cmluZyBjb21wXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW3NldENvbXBvbmVudENvbmZpZyBtZXRob2RdIDFzdCBwYXJhbSBzaG91bGQgYmUgYSBzdHJpbmcsIHlvdSdyZSBwYXNzaW5nOlwiICsgdHlwZW9mIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNPYmplY3QgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyBQZXN0bGUgaGFzIGJlZW4gYWxyZWFkeSBpbml0aWFsaXplZFxuICAgICAgICAgICAgICAgICAgICAjIGR1cmluZyBpbnN0YW50aWF0aW9uLCBzbyB3ZSdsbCB1c2UgdGhlIGNvbmZpZyBvYmplY3QgYXMgYVxuICAgICAgICAgICAgICAgICAgICAjIHByb3ZpZGVyIGZvciBkZWZhdWx0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNFbXB0eSBAY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29uZmlnLmNvbXBvbmVudFtjb21wXSA9IEJhc2UudXRpbC5kZWZhdWx0cyBjb25maWcsIEBjb25maWcuY29tcG9uZW50W2NvbXBdXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbmZpZyA9IEBjb25maWcgb3Ige31cbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcuY29tcG9uZW50W2NvbXBdID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZy5jb21wb25lbnRbY29tcF1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW3NldENvbXBvbmVudENvbmZpZyBtZXRob2RdIDJuZCBwYXJhbSBzaG91bGQgYmUgYW4gb2JqZWN0ICYgeW91J3JlIHBhc3Npbmc6XCIgKyB0eXBlb2YgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKG1zZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlBlc3RsZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiBQZXN0bGUgaGFzIGFscmVhZHkgc3RhcnRlZC4nKVxuXG4gICAgICAgIHN0YXJ0OiAoc2VsZWN0b3IgPSAnJykgLT5cblxuICAgICAgICAgICAgIyBTZXQgdGhlIGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBhcHBcbiAgICAgICAgICAgIEJhc2UubG9nLnNldExldmVsKEBjb25maWcuZGVidWcubG9nTGV2ZWwpXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIGxldCB1cyBpbml0aWFsaXplIGNvbXBvbmVudHMgYXQgYSBsYXRlciBzdGFnZVxuICAgICAgICAgICAgaWYgQHN0YXJ0ZWQgYW5kIHNlbGVjdG9yIGlzbnQgJydcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgaXMgaW5pdGlhbGl6aW5nIGEgY29tcG9uZW50XCIpXG5cbiAgICAgICAgICAgICAgICBAc2FuZGJveC5zdGFydENvbXBvbmVudHMgc2VsZWN0b3IsIEBcblxuXG4gICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUsIGl0IG1lYW5zIGl0IGlzIHRoZSBmaXN0IHRpbWUgdGhlIHN0YXJ0XG4gICAgICAgICAgICAjIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHdlJ2xsIGhhdmUgdG8gaW5pdGlhbGl6ZSBhbGwgdGhlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgc3RhcnRlZCB0aGUgaW5pdGlhbGl6aW5nIHByb2Nlc3NcIilcblxuICAgICAgICAgICAgICAgIEBzdGFydGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmluaXQoQClcblxuICAgICAgICAgICAgICAgICMgQ2FsbGJhY2sgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICAjIGFmdGVyIGFsbCBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIGFuZCB0aGUgZWFjaCBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAjIG1ldGhvZCBleGVjdXRlZFxuICAgICAgICAgICAgICAgIGNiID0gJC5DYWxsYmFja3MgXCJ1bmlxdWUgbWVtb3J5XCJcblxuICAgICAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgIyBOb3RlOiBUaGlzIG1ldGhvZCB3aWxsIGxldCBlYWNoIGV4dGVuc2lvbiB0byBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgc29tZSBjb2RlXG4gICAgICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChleHQsIGkpID0+XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXh0XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uKGV4dC5hZnRlckFwcFN0YXJ0ZWQpIGFuZCBleHQuYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBzaW5jZSB0aGUgY29tcG9uZW50IGV4dGVuc2lvbiBpcyB0aGUgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGZvciBpbml0aWFsaXppbmcgdGhlIGFwcCwgd2UnbGwgZ2l2ZSBpdCBzcGVjaWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0cmVhdG1lbnQgYW5kIGdpdmUgaXQgdGhlIGFiaWxpdHkgdG8gcmVjZWl2ZSBhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZXh0cmEgcGFyYW1ldGVyICh0byBzdGFydCBjb21wb25lbnRzIHRoYXQgb25seSBiZWxvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRvIGEgcGFydGljdWxhciBET00gZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBleHQub3B0aW9uS2V5IGlzIFwiY29tcG9uZW50c1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQgc2VsZWN0b3IsIEBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQoQClcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24oZXh0LmFmdGVyQXBwSW5pdGlhbGl6ZWQpIGFuZCBleHQuYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuYWRkIGV4dC5hZnRlckFwcEluaXRpYWxpemVkXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgdGhlIC5hZnRlckFwcEluaXRpYWxpemVkIGNhbGxiYWNrcyB3aXRoIEAgYXMgcGFyYW1ldGVyXG4gICAgICAgICAgICAgICAgY2IuZmlyZSBAXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQHNhbmRib3gsIG5hbWUgOiBuYW1lXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzOiAoKSAtPlxuICAgICAgICAgICAgQHNhbmRib3guZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzKClcblxuXG4gICAgcmV0dXJuIFBlc3RsZVxuKVxuIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4xXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLl9jYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGtleV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmV4cGlyZXMgPSBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gLTEgOiBvcHRpb25zLmV4cGlyZXMpO1xyXG5cclxuICAgICAgICAgICAgQ29va2llcy5fZG9jdW1lbnQuY29va2llID0gQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmV4cGlyZSA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuc2V0KGtleSwgdW5kZWZpbmVkLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucyAmJiBvcHRpb25zLnBhdGggfHwgQ29va2llcy5kZWZhdWx0cy5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBvcHRpb25zICYmIG9wdGlvbnMuZG9tYWluIHx8IENvb2tpZXMuZGVmYXVsdHMuZG9tYWluLFxyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogb3B0aW9ucyAmJiBvcHRpb25zLmV4cGlyZXMgfHwgQ29va2llcy5kZWZhdWx0cy5leHBpcmVzLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBvcHRpb25zICYmIG9wdGlvbnMuc2VjdXJlICE9PSB1bmRlZmluZWQgPyAgb3B0aW9ucy5zZWN1cmUgOiBDb29raWVzLmRlZmF1bHRzLnNlY3VyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUgPSBmdW5jdGlvbiAoZXhwaXJlcywgbm93KSB7XHJcbiAgICAgICAgICAgIG5vdyA9IG5vdyB8fCBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IGV4cGlyZXMgPT09IEluZmluaXR5ID9cclxuICAgICAgICAgICAgICAgICAgICBDb29raWVzLl9tYXhFeHBpcmVEYXRlIDogbmV3IERhdGUobm93LmdldFRpbWUoKSArIGV4cGlyZXMgKiAxMDAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwaXJlcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXMgPSBuZXcgRGF0ZShleHBpcmVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGlyZXMgJiYgIUNvb2tpZXMuX2lzVmFsaWREYXRlKGV4cGlyZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BleHBpcmVzYCBwYXJhbWV0ZXIgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHZhbGlkIERhdGUgaW5zdGFuY2UnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XHJcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb29raWVTdHJpbmcgPSBrZXkgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMucGF0aCA/ICc7cGF0aD0nICsgb3B0aW9ucy5wYXRoIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmRvbWFpbiA/ICc7ZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbiA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5leHBpcmVzID8gJztleHBpcmVzPScgKyBvcHRpb25zLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5zZWN1cmUgPyAnO3NlY3VyZScgOiAnJztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVTdHJpbmc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0Q2FjaGVGcm9tU3RyaW5nID0gZnVuY3Rpb24gKGRvY3VtZW50Q29va2llKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVDYWNoZSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgY29va2llc0FycmF5ID0gZG9jdW1lbnRDb29raWUgPyBkb2N1bWVudENvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPSBjb29raWVLdnAudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVDYWNoZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGNvb2tpZVN0cmluZykge1xyXG4gICAgICAgICAgICAvLyBcIj1cIiBpcyBhIHZhbGlkIGNoYXJhY3RlciBpbiBhIGNvb2tpZSB2YWx1ZSBhY2NvcmRpbmcgdG8gUkZDNjI2NSwgc28gY2Fubm90IGBzcGxpdCgnPScpYFxyXG4gICAgICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBjb29raWVTdHJpbmcuaW5kZXhPZignPScpO1xyXG5cclxuICAgICAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcclxuICAgICAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cigwLCBzZXBhcmF0b3JJbmRleCkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29va2llc0V4cG9ydCA9IHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnID8gZmFjdG9yeShnbG9iYWwpIDogZmFjdG9yeTtcclxuXHJcbiAgICAvLyBBTUQgc3VwcG9ydFxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb29raWVzRXhwb3J0OyB9KTtcclxuICAgIC8vIENvbW1vbkpTL05vZGUuanMgc3VwcG9ydFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29va2llc0V4cG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpOyIsIjtcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZGVmYXVsdFdpZHRocywgZ2V0S2V5cywgbmV4dFRpY2ssIGFkZEV2ZW50LCBnZXROYXR1cmFsV2lkdGg7XG5cbiAgICBuZXh0VGljayA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYXBwbHlFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrRWFjaCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIG5ld19jb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb25baV0gPSBjYWxsYmFja0VhY2goY29sbGVjdGlvbltpXSwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3X2NvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0dXJuRGlyZWN0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldE5hdHVyYWxXaWR0aCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSwgJ25hdHVyYWxXaWR0aCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRTggYW5kIGJlbG93IGxhY2tzIHRoZSBuYXR1cmFsV2lkdGggcHJvcGVydHlcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNvdXJjZS5zcmM7XG4gICAgICAgICAgICByZXR1cm4gaW1nLndpZHRoO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBhZGRFdmVudCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhZGRTdGFuZGFyZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZElFRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBmbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIGRlZmF1bHRXaWR0aHMgPSBbOTYsIDEzMCwgMTY1LCAyMDAsIDIzNSwgMjcwLCAzMDQsIDM0MCwgMzc1LCA0MTAsIDQ0NSwgNDg1LCA1MjAsIDU1NSwgNTkwLCA2MjUsIDY2MCwgNjk1LCA3MzZdO1xuXG4gICAgZ2V0S2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5rZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIG5ldyBJbWFnZXIgaW5zdGFuY2UsIHBhc3NpbmcgYW4gb3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QuXG5cbiAgICAgICAgRXhhbXBsZSB1c2FnZTpcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEF2YWlsYWJsZSB3aWR0aHMgZm9yIHlvdXIgaW1hZ2VzXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbTnVtYmVyXSxcblxuICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yIHRvIGJlIHVzZWQgdG8gbG9jYXRlIHlvdXIgZGl2IHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnJyxcblxuICAgICAgICAgICAgICAgIC8vIENsYXNzIG5hbWUgdG8gZ2l2ZSB5b3VyIHJlc2l6YWJsZSBpbWFnZXNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gSWYgc2V0IHRvIHRydWUsIEltYWdlciB3aWxsIHVwZGF0ZSB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgcmVsZXZhbnQgaW1hZ2VzXG4gICAgICAgICAgICAgICAgb25SZXNpemU6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBUb2dnbGUgdGhlIGxhenkgbG9hZCBmdW5jdGlvbmFsaXR5IG9uIG9yIG9mZlxuICAgICAgICAgICAgICAgIGxhenlsb2FkOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAgICAgLy8gVXNlZCBhbG9uZ3NpZGUgdGhlIGxhenlsb2FkIGZlYXR1cmUgKGhlbHBzIHBlcmZvcm1hbmNlIGJ5IHNldHRpbmcgYSBoaWdoZXIgZGVsYXkpXG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsYXk6IE51bWJlclxuICAgICAgICAgICAgfVxuXG4gICAgICAgIEBwYXJhbSB7b2JqZWN0fSBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAgICAgIEByZXR1cm4ge29iamVjdH0gaW5zdGFuY2Ugb2YgSW1hZ2VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gSW1hZ2VyKGVsZW1lbnRzLCBvcHRzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGRvYyA9IGRvY3VtZW50O1xuXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICAgIGlmIChlbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyBzZWxlY3RvciBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5zZWxlY3RvciA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyB0aGUgYG9wdHNgIG9iamVjdCwgYGVsZW1lbnRzYCBpcyBpbXBsaWNpdGx5IHRoZSBgb3B0cy5zZWxlY3RvcmAgc3RyaW5nXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudHMubGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wdHMgPSBlbGVtZW50cztcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuID0gW107XG4gICAgICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG9wdHMuc2VsZWN0b3IgfHwgJy5kZWxheWVkLWltYWdlLWxvYWQnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdHMuY2xhc3NOYW1lIHx8ICdpbWFnZS1yZXBsYWNlJztcbiAgICAgICAgdGhpcy5naWYgPSBkb2MuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIHRoaXMuZ2lmLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhFQUFKQUlBQUFQLy8vd0FBQUNINUJBRUFBQUFBTEFBQUFBQVFBQWtBQUFJS2hJK3B5KzBQbzV5VUZRQTcnO1xuICAgICAgICB0aGlzLmdpZi5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgdGhpcy5naWYuYWx0ID0gJyc7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGVsYXkgPSBvcHRzLnNjcm9sbERlbGF5IHx8IDI1MDtcbiAgICAgICAgdGhpcy5vblJlc2l6ZSA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ29uUmVzaXplJykgPyBvcHRzLm9uUmVzaXplIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXp5bG9hZCA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ2xhenlsb2FkJykgPyBvcHRzLmxhenlsb2FkIDogZmFsc2U7XG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyA9IG9wdHMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MgfHwgWzEsIDJdO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IG9wdHMuYXZhaWxhYmxlV2lkdGhzIHx8IGRlZmF1bHRXaWR0aHM7XG4gICAgICAgIHRoaXMub25JbWFnZXNSZXBsYWNlZCA9IG9wdHMub25JbWFnZXNSZXBsYWNlZCB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLndpZHRoc01hcCA9IHt9O1xuICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG4gICAgICAgIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IgPSBvcHRzLndpZHRoSW50ZXJwb2xhdG9yIHx8IHJldHVybkRpcmVjdFZhbHVlO1xuICAgICAgICB0aGlzLmRlbHRhU3F1YXJlID0gb3B0cy5kZWx0YVNxdWFyZSB8fCAxLjU7XG4gICAgICAgIHRoaXMuc3F1YXJlU2VsZWN0b3IgPSBvcHRzLnNxdWFyZVNlbGVjdG9yIHx8ICdzcXJjcm9wJztcbiAgICAgICAgdGhpcy5hZGFwdFNlbGVjdG9yID0gdGhpcy5hZGFwdFNlbGVjdG9yIHx8ICdhZGFwdCc7XG4gICAgICAgIHRoaXMuYWxsb3dlZEV4dGVuc2lvbnMgPSBbXCJqcGdcIixcImJtcFwiLFwicG5nXCIsXCJqcGVnXCJdO1xuXG4gICAgICAgIC8vIE5lZWRlZCBhcyBJRTggYWRkcyBhIGRlZmF1bHQgYHdpZHRoYC9gaGVpZ2h0YCBhdHRyaWJ1dGXigKZcbiAgICAgICAgdGhpcy5naWYucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgICAgdGhpcy5naWYucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hdmFpbGFibGVXaWR0aHMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5hdmFpbGFibGVXaWR0aHMubGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGhzTWFwID0gSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCh0aGlzLmF2YWlsYWJsZVdpZHRocywgdGhpcy53aWR0aEludGVycG9sYXRvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGhzTWFwID0gdGhpcy5hdmFpbGFibGVXaWR0aHM7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVXaWR0aHMgPSBnZXRLZXlzKHRoaXMuYXZhaWxhYmxlV2lkdGhzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVXaWR0aHMgPSB0aGlzLmF2YWlsYWJsZVdpZHRocy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IGFwcGx5RWFjaChlbGVtZW50cywgcmV0dXJuRGlyZWN0VmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpdnMgPSBhcHBseUVhY2goZG9jLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvciksIHJldHVybkRpcmVjdFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMoKTtcblxuICAgICAgICBuZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnNjcm9sbENoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1hZ2VzT2ZmU2NyZWVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRpdnMgPSB0aGlzLmltYWdlc09mZlNjcmVlbi5zbGljZSgwKTsgLy8gY29weSBieSB2YWx1ZSwgZG9uJ3QgY29weSBieSByZWZlcmVuY2VcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uUmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyUmVzaXplRXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhenlsb2FkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyU2Nyb2xsRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNyZWF0ZUdpZiA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBhIHJlc3BvbnNpdmUgaW1hZ2UgdGhlbiB3ZSBkb24ndCByZXBsYWNlIGl0IGFnYWluXG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXnwgKScgKyB0aGlzLmNsYXNzTmFtZSArICcoIHwkKScpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudENsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyk7XG4gICAgICAgIHZhciBlbGVtZW50V2lkdGggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpO1xuICAgICAgICB2YXIgZ2lmID0gdGhpcy5naWYuY2xvbmVOb2RlKGZhbHNlKTtcblxuICAgICAgICBpZiAoZWxlbWVudFdpZHRoKSB7XG4gICAgICAgICAgICBnaWYud2lkdGggPSBlbGVtZW50V2lkdGg7XG4gICAgICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJywgZWxlbWVudFdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdpZi5jbGFzc05hbWUgPSAoZWxlbWVudENsYXNzTmFtZSA/IGVsZW1lbnRDbGFzc05hbWUgKyAnICcgOiAnJykgKyB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2FsdCcsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWFsdCcpIHx8IHRoaXMuZ2lmLmFsdCk7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2l0ZW1wcm9wJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaXRlbXByb3AnKSB8fCBcImNvbnRlbnRVcmxcIik7XG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZ2lmLCBlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gZ2lmO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhcHBseUVhY2godGhpcy5kaXZzLCBmdW5jdGlvbihlbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5sYXp5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzVGhpc0VsZW1lbnRPblNjcmVlbihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRpdnNbaV0gPSBzZWxmLmNyZWF0ZUdpZihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmltYWdlc09mZlNjcmVlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNUaGlzRWxlbWVudE9uU2NyZWVuID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB3YXMgd29ya2luZyBpbiBDaHJvbWUgYnV0IGRpZG4ndCB3b3JrIG9uIEZpcmVmb3gsIHNvIGhhZCB0byByZXNvcnQgdG8gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIC8vIGJ1dCBjYW4ndCBmYWxsYmFjayB0byBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCBhcyB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRSB3aXRoIGEgZG9jdHlwZSAoPykgc28gaGF2ZSB0byB1c2UgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICB2YXIgb2Zmc2V0ID0gSW1hZ2VyLmdldFBhZ2VPZmZzZXQoKTtcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRUb3AgPSAwO1xuXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXRUb3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoZWxlbWVudE9mZnNldFRvcCA8ICh0aGlzLnZpZXdwb3J0SGVpZ2h0ICsgb2Zmc2V0KSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNpemluZykge1xuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcblxuICAgICAgICAgICAgYXBwbHlFYWNoKGltYWdlcywgZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyhpbWFnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uSW1hZ2VzUmVwbGFjZWQoaW1hZ2VzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciBjb21wdXRlZFdpZHRoLCBzcmMsIG5hdHVyYWxXaWR0aDtcblxuICAgICAgICBuYXR1cmFsV2lkdGggPSBnZXROYXR1cmFsV2lkdGgoaW1hZ2UpO1xuICAgICAgICBjb21wdXRlZFdpZHRoID0gdHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzID09PSAnZnVuY3Rpb24nID8gdGhpcy5hdmFpbGFibGVXaWR0aHMoaW1hZ2UpIDogdGhpcy5kZXRlcm1pbmVBcHByb3ByaWF0ZVJlc29sdXRpb24oaW1hZ2UpO1xuXG4gICAgICAgIGltYWdlLndpZHRoID0gY29tcHV0ZWRXaWR0aDtcblxuICAgICAgICBpZiAoaW1hZ2Uuc3JjICE9PSB0aGlzLmdpZi5zcmMgJiYgY29tcHV0ZWRXaWR0aCA8PSBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzRXh0ZW5zaW9uQWxsb3dlZChpbWFnZSkpIHtcbiAgICAgICAgICAgIHNyYyA9IHRoaXMuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyh0aGlzLmJ1aWxkVXJsU3RydWN0dXJlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSwgaW1hZ2UpLCBjb21wdXRlZFdpZHRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNyYyA9IHRoaXMucmVtb3ZlTW9kaWZpZXJzZnJvbUltYWdlU3JjKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVtb3ZlTW9kaWZpZXJzZnJvbUltYWdlU3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKFwiXFxcXC97d2lkdGh9XFxcXC97cGl4ZWxfcmF0aW99XCIsIFwiZ1wiKTtcbiAgICAgICAgcmV0dXJuIHNyYy5yZXBsYWNlKHJlZ0V4cCwgJycpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmlzRXh0ZW5zaW9uQWxsb3dlZCA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciBpbWFnZUV4dGVuc2lvbiA9IHRoaXMuZ2V0SW1hZ2VFeHRlbnNpb24oaW1hZ2UpO1xuICAgICAgICByZXR1cm4gaW1hZ2VFeHRlbnNpb24gPyB0aGlzLmFsbG93ZWRFeHRlbnNpb25zLmluZGV4T2YoaW1hZ2VFeHRlbnNpb24udG9Mb3dlckNhc2UoKSkgPiAtMSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmdldEltYWdlRXh0ZW5zaW9uID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAoXCJcXFxcLy4qXFxcXC4oLiopXFxcXC97d2lkdGh9XFxcXC97cGl4ZWxfcmF0aW99P1wiLCBcImdpXCIpO1xuICAgICAgICB2YXIgbWF0Y2ggPSByZWdFeHAuZXhlYyhpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IFwiXCI7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJykgfHwgaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCwgdGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gdmFsdWUgdXNlZCBieSBJbWFnZXJcbiAgICAgKlxuICAgICAqIEl0IGlzIHBlcmZvcm1lZCBiZWZvcmUgZWFjaCByZXBsYWNlbWVudCBsb29wLCBpbiBjYXNlIGEgdXNlciB6b29tZWQgaW4vb3V0XG4gICAgICogYW5kIHRodXMgdXBkYXRlZCB0aGUgYHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvYCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBhcGlcbiAgICAgKiBAc2luY2UgMS4wLjFcbiAgICAgKi9cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZnJlc2hQaXhlbFJhdGlvID0gZnVuY3Rpb24gcmVmcmVzaFBpeGVsUmF0aW8oKSB7XG4gICAgICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyA9IEltYWdlci5nZXRDbG9zZXN0VmFsdWUoSW1hZ2VyLmdldFBpeGVsUmF0aW8oKSwgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyA9IGZ1bmN0aW9uKHNyYywgc2VsZWN0ZWRXaWR0aCkge1xuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgve3dpZHRofS9nLCBJbWFnZXIudHJhbnNmb3Jtcy53aWR0aChzZWxlY3RlZFdpZHRoLCB0aGlzLndpZHRoc01hcCkpXG4gICAgICAgICAgICAucmVwbGFjZSgve3BpeGVsX3JhdGlvfS9nLCBJbWFnZXIudHJhbnNmb3Jtcy5waXhlbFJhdGlvKHRoaXMuZGV2aWNlUGl4ZWxSYXRpbykpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmJ1aWxkVXJsU3RydWN0dXJlID0gZnVuY3Rpb24oc3JjLCBpbWFnZSkge1xuICAgICAgICB2YXIgc3F1YXJlU2VsZWN0b3IgPSB0aGlzLmlzSW1hZ2VDb250YWluZXJTcXVhcmUoaW1hZ2UpID8gJy4nICsgdGhpcy5zcXVhcmVTZWxlY3RvciA6ICcnO1xuXG4gICAgICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKFwiXFxcXC4oXCIgKyB0aGlzLmFsbG93ZWRFeHRlbnNpb25zLmpvaW4oXCJ8XCIpICArIFwiKVxcXFwvKHt3aWR0aH0pXFxcXC8oe3BpeGVsX3JhdGlvfSk/XCIsIFwiZ2lcIik7XG5cbiAgICAgICAgcmV0dXJuIHNyYy5yZXBsYWNlKHJlZ0V4cCwgJy4nICsgdGhpcy5hZGFwdFNlbGVjdG9yICsgJy4kMi4kMycgKyBzcXVhcmVTZWxlY3RvciArICcuJDEnKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pc0ltYWdlQ29udGFpbmVyU3F1YXJlID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIChpbWFnZS5wYXJlbnROb2RlLmNsaWVudFdpZHRoIC8gaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRIZWlnaHQpIDw9IHRoaXMuZGVsdGFTcXVhcmVcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBpeGVsUmF0aW8gPSBmdW5jdGlvbiBnZXRQaXhlbFJhdGlvKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIChjb250ZXh0IHx8IHdpbmRvdylbJ2RldmljZVBpeGVsUmF0aW8nXSB8fCAxO1xuICAgIH07XG5cbiAgICBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwID0gZnVuY3Rpb24gY3JlYXRlV2lkdGhzTWFwKHdpZHRocywgaW50ZXJwb2xhdG9yKSB7XG4gICAgICAgIHZhciBtYXAgPSB7fSxcbiAgICAgICAgICAgIGkgPSB3aWR0aHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIG1hcFt3aWR0aHNbaV1dID0gaW50ZXJwb2xhdG9yKHdpZHRoc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH07XG5cbiAgICBJbWFnZXIudHJhbnNmb3JtcyA9IHtcbiAgICAgICAgcGl4ZWxSYXRpbzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoLCBtYXApIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBbd2lkdGhdIHx8IHdpZHRoO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNsb3Nlc3QgdXBwZXIgdmFsdWUuXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqIHZhciBjYW5kaWRhdGVzID0gWzEsIDEuNSwgMl07XG4gICAgICpcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDAuOCwgY2FuZGlkYXRlcyk7IC8vIC0+IDFcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDEsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLjMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxLjVcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAyXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJhc2VWYWx1ZVxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGNhbmRpZGF0ZXNcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIEltYWdlci5nZXRDbG9zZXN0VmFsdWUgPSBmdW5jdGlvbiBnZXRDbG9zZXN0VmFsdWUoYmFzZVZhbHVlLCBjYW5kaWRhdGVzKSB7XG4gICAgICAgIHZhciBpID0gY2FuZGlkYXRlcy5sZW5ndGgsXG4gICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpIC0gMV07XG5cbiAgICAgICAgYmFzZVZhbHVlID0gcGFyc2VGbG9hdChiYXNlVmFsdWUsIDEwKTtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoYmFzZVZhbHVlIDw9IGNhbmRpZGF0ZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxlY3RlZFdpZHRoO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyUmVzaXplRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcoc2VsZi5kaXZzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVnaXN0ZXJTY3JvbGxFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnNjcm9sbENoZWNrKCk7XG4gICAgICAgIH0sIHNlbGYuc2Nyb2xsRGVsYXkpO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvciA9IGZ1bmN0aW9uIGdldFBhZ2VWZXJ0aWNhbE9mZnNldCh0ZXN0Q2FzZSkge1xuICAgICAgICBpZiAodGVzdENhc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmb3JtIGlzIHVzZWQgYmVjYXVzZSBpdCBzZWVtcyBpbXBvc3NpYmxlIHRvIHN0dWIgYHdpbmRvdy5wYWdlWU9mZnNldGBcbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0R2VuZXJhdG9yKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh3aW5kb3csICdwYWdlWU9mZnNldCcpKTtcblxuICAgIC8vIEV4cG9ydGluZyBmb3IgdGVzdGluZyBwdXJwb3NlXG4gICAgSW1hZ2VyLmFwcGx5RWFjaCA9IGFwcGx5RWFjaDtcblxuICAgIC8qIGdsb2JhbCBtb2R1bGUsIGV4cG9ydHM6IHRydWUsIGRlZmluZSAqL1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTLCBqdXN0IGV4cG9ydFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBJbWFnZXI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EIHN1cHBvcnRcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIEltYWdlcjtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBJZiBubyBBTUQgYW5kIHdlIGFyZSBpbiB0aGUgYnJvd3NlciwgYXR0YWNoIHRvIHdpbmRvd1xuICAgICAgICB3aW5kb3cuSW1hZ2VyID0gSW1hZ2VyO1xuICAgIH1cbiAgICAvKiBnbG9iYWwgLW1vZHVsZSwgLWV4cG9ydHMsIC1kZWZpbmUgKi9cblxufSh3aW5kb3csIGRvY3VtZW50KSk7IiwiLyoqXG4gKiBpc01vYmlsZS5qcyB2MC4zLjVcbiAqXG4gKiBBIHNpbXBsZSBsaWJyYXJ5IHRvIGRldGVjdCBBcHBsZSBwaG9uZXMgYW5kIHRhYmxldHMsXG4gKiBBbmRyb2lkIHBob25lcyBhbmQgdGFibGV0cywgb3RoZXIgbW9iaWxlIGRldmljZXMgKGxpa2UgYmxhY2tiZXJyeSwgbWluaS1vcGVyYSBhbmQgd2luZG93cyBwaG9uZSksXG4gKiBhbmQgYW55IGtpbmQgb2Ygc2V2ZW4gaW5jaCBkZXZpY2UsIHZpYSB1c2VyIGFnZW50IHNuaWZmaW5nLlxuICpcbiAqIEBhdXRob3I6IEthaSBNYWxsZWEgKGttYWxsZWFAZ21haWwuY29tKVxuICpcbiAqIEBsaWNlbnNlOiBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICB2YXIgYXBwbGVfcGhvbmUgICAgICAgICA9IC9pUGhvbmUvaSxcbiAgICAgICAgYXBwbGVfaXBvZCAgICAgICAgICA9IC9pUG9kL2ksXG4gICAgICAgIGFwcGxlX3RhYmxldCAgICAgICAgPSAvaVBhZC9pLFxuICAgICAgICBhbmRyb2lkX3Bob25lICAgICAgID0gLyg/PS4qXFxiQW5kcm9pZFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0FuZHJvaWQnIEFORCAnTW9iaWxlJ1xuICAgICAgICBhbmRyb2lkX3RhYmxldCAgICAgID0gL0FuZHJvaWQvaSxcbiAgICAgICAgd2luZG93c19waG9uZSAgICAgICA9IC9JRU1vYmlsZS9pLFxuICAgICAgICB3aW5kb3dzX3RhYmxldCAgICAgID0gLyg/PS4qXFxiV2luZG93c1xcYikoPz0uKlxcYkFSTVxcYikvaSwgLy8gTWF0Y2ggJ1dpbmRvd3MnIEFORCAnQVJNJ1xuICAgICAgICBvdGhlcl9ibGFja2JlcnJ5ICAgID0gL0JsYWNrQmVycnkvaSxcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeV8xMCA9IC9CQjEwL2ksXG4gICAgICAgIG90aGVyX29wZXJhICAgICAgICAgPSAvT3BlcmEgTWluaS9pLFxuICAgICAgICBvdGhlcl9maXJlZm94ICAgICAgID0gLyg/PS4qXFxiRmlyZWZveFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0ZpcmVmb3gnIEFORCAnTW9iaWxlJ1xuICAgICAgICBzZXZlbl9pbmNoID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICcoPzonICsgICAgICAgICAvLyBOb24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdOZXh1cyA3JyArICAgICAvLyBOZXh1cyA3XG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnQk5UVjI1MCcgKyAgICAgLy8gQiZOIE5vb2sgVGFibGV0IDcgaW5jaFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0tpbmRsZSBGaXJlJyArIC8vIEtpbmRsZSBGaXJlXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnU2lsaycgKyAgICAgICAgLy8gS2luZGxlIEZpcmUsIFNpbGsgQWNjZWxlcmF0ZWRcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdHVC1QMTAwMCcgKyAgICAvLyBHYWxheHkgVGFiIDcgaW5jaFxuXG4gICAgICAgICAgICAnKScsICAgICAgICAgICAgLy8gRW5kIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ2knKTsgICAgICAgICAgIC8vIENhc2UtaW5zZW5zaXRpdmUgbWF0Y2hpbmdcblxuICAgIHZhciBtYXRjaCA9IGZ1bmN0aW9uKHJlZ2V4LCB1c2VyQWdlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodXNlckFnZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIElzTW9iaWxlQ2xhc3MgPSBmdW5jdGlvbih1c2VyQWdlbnQpIHtcbiAgICAgICAgdmFyIHVhID0gdXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgdGhpcy5hcHBsZSA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIGlwb2Q6ICAgbWF0Y2goYXBwbGVfaXBvZCwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaChhcHBsZV90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYXBwbGVfcGhvbmUsIHVhKSB8fCBtYXRjaChhcHBsZV9pcG9kLCB1YSkgfHwgbWF0Y2goYXBwbGVfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hbmRyb2lkID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6ICFtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgJiYgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpIHx8IG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53aW5kb3dzID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSB8fCBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3RoZXIgPSB7XG4gICAgICAgICAgICBibGFja2JlcnJ5OiAgIG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSxcbiAgICAgICAgICAgIGJsYWNrYmVycnkxMDogbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpLFxuICAgICAgICAgICAgb3BlcmE6ICAgICAgICBtYXRjaChvdGhlcl9vcGVyYSwgdWEpLFxuICAgICAgICAgICAgZmlyZWZveDogICAgICBtYXRjaChvdGhlcl9maXJlZm94LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6ICAgICAgIG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSB8fCBtYXRjaChvdGhlcl9ibGFja2JlcnJ5XzEwLCB1YSkgfHwgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSB8fCBtYXRjaChvdGhlcl9maXJlZm94LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXZlbl9pbmNoID0gbWF0Y2goc2V2ZW5faW5jaCwgdWEpO1xuICAgICAgICB0aGlzLmFueSA9IHRoaXMuYXBwbGUuZGV2aWNlIHx8IHRoaXMuYW5kcm9pZC5kZXZpY2UgfHwgdGhpcy53aW5kb3dzLmRldmljZSB8fCB0aGlzLm90aGVyLmRldmljZSB8fCB0aGlzLnNldmVuX2luY2g7XG4gICAgICAgIC8vIGV4Y2x1ZGVzICdvdGhlcicgZGV2aWNlcyBhbmQgaXBvZHMsIHRhcmdldGluZyB0b3VjaHNjcmVlbiBwaG9uZXNcbiAgICAgICAgdGhpcy5waG9uZSA9IHRoaXMuYXBwbGUucGhvbmUgfHwgdGhpcy5hbmRyb2lkLnBob25lIHx8IHRoaXMud2luZG93cy5waG9uZTtcbiAgICAgICAgLy8gZXhjbHVkZXMgNyBpbmNoIGRldmljZXMsIGNsYXNzaWZ5aW5nIGFzIHBob25lIG9yIHRhYmxldCBpcyBsZWZ0IHRvIHRoZSB1c2VyXG4gICAgICAgIHRoaXMudGFibGV0ID0gdGhpcy5hcHBsZS50YWJsZXQgfHwgdGhpcy5hbmRyb2lkLnRhYmxldCB8fCB0aGlzLndpbmRvd3MudGFibGV0O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBJTSA9IG5ldyBJc01vYmlsZUNsYXNzKCk7XG4gICAgICAgIElNLkNsYXNzID0gSXNNb2JpbGVDbGFzcztcbiAgICAgICAgcmV0dXJuIElNO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL25vZGVcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBJc01vYmlsZUNsYXNzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL2Jyb3dzZXJpZnlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vQU1EXG4gICAgICAgIGRlZmluZShnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCIvKlxyXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXHJcbipcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB7fTtcclxuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcclxuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgIFwidHJhY2VcIixcclxuICAgICAgICBcImRlYnVnXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJ3YXJuXCIsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XHJcbiAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/IG5vb3AgOiBzZWxmLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XHJcbiAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddID0gbGV2ZWxOYW1lO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID0gXCJsb2dsZXZlbD1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUGVyc2lzdGVkTGV2ZWwoKSB7XHJcbiAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9sb2dsZXZlbD0oW147XSspLy5leGVjKHdpbmRvdy5kb2N1bWVudC5jb29raWUpWzFdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IFwiV0FSTlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKlxyXG4gICAgICogUHVibGljIEFQSVxyXG4gICAgICpcclxuICAgICAqL1xyXG5cclxuICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxyXG4gICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XHJcblxyXG4gICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcclxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcclxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcclxuICAgIHNlbGYubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IHNlbGYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZFBlcnNpc3RlZExldmVsKCk7XHJcbiAgICByZXR1cm4gc2VsZjtcclxufSkpO1xyXG4iLCIvKiFcclxuICogdmVyZ2UgMS45LjErMjAxNDAyMTMwODAzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFudmUvdmVyZ2VcclxuICogTUlUIExpY2Vuc2UgMjAxMyBSeWFuIFZhbiBFdHRlblxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihyb290LCBuYW1lLCBtYWtlKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIG1vZHVsZVsnZXhwb3J0cyddID0gbWFrZSgpO1xyXG4gIGVsc2Ugcm9vdFtuYW1lXSA9IG1ha2UoKTtcclxufSh0aGlzLCAndmVyZ2UnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIHhwb3J0cyA9IHt9XHJcbiAgICAsIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93XHJcbiAgICAsIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudFxyXG4gICAgLCBkb2NFbGVtID0gZG9jICYmIGRvYy5kb2N1bWVudEVsZW1lbnRcclxuICAgICwgbWF0Y2hNZWRpYSA9IHdpblsnbWF0Y2hNZWRpYSddIHx8IHdpblsnbXNNYXRjaE1lZGlhJ11cclxuICAgICwgbXEgPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24ocSkge1xyXG4gICAgICAgIHJldHVybiAhIW1hdGNoTWVkaWEuY2FsbCh3aW4sIHEpLm1hdGNoZXM7XHJcbiAgICAgIH0gOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICwgdmlld3BvcnRXID0geHBvcnRzWyd2aWV3cG9ydFcnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhID0gZG9jRWxlbVsnY2xpZW50V2lkdGgnXSwgYiA9IHdpblsnaW5uZXJXaWR0aCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0SCA9IHhwb3J0c1sndmlld3BvcnRIJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudEhlaWdodCddLCBiID0gd2luWydpbm5lckhlaWdodCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9O1xyXG4gIFxyXG4gIC8qKiBcclxuICAgKiBUZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlLiBMaWtlIE1vZGVybml6ci5tcVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovICBcclxuICB4cG9ydHNbJ21xJ10gPSBtcTtcclxuXHJcbiAgLyoqIFxyXG4gICAqIE5vcm1hbGl6ZWQgbWF0Y2hNZWRpYVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge01lZGlhUXVlcnlMaXN0fE9iamVjdH1cclxuICAgKi8gXHJcbiAgeHBvcnRzWydtYXRjaE1lZGlhJ10gPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBtYXRjaE1lZGlhIG11c3QgYmUgYmluZGVkIHRvIHdpbmRvd1xyXG4gICAgcmV0dXJuIG1hdGNoTWVkaWEuYXBwbHkod2luLCBhcmd1bWVudHMpO1xyXG4gIH0gOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIEdyYWNlZnVsbHkgZGVncmFkZSB0byBwbGFpbiBvYmplY3RcclxuICAgIHJldHVybiB7fTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAc2luY2UgMS44LjBcclxuICAgKiBAcmV0dXJuIHt7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfX1cclxuICAgKi9cclxuICBmdW5jdGlvbiB2aWV3cG9ydCgpIHtcclxuICAgIHJldHVybiB7J3dpZHRoJzp2aWV3cG9ydFcoKSwgJ2hlaWdodCc6dmlld3BvcnRIKCl9O1xyXG4gIH1cclxuICB4cG9ydHNbJ3ZpZXdwb3J0J10gPSB2aWV3cG9ydDtcclxuICBcclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWFxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFgnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWE9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbExlZnQ7IFxyXG4gIH07XHJcblxyXG4gIC8qKiBcclxuICAgKiBDcm9zcy1icm93c2VyIHdpbmRvdy5zY3JvbGxZXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHhwb3J0c1snc2Nyb2xsWSddID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luLnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsVG9wOyBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3t0b3A6bnVtYmVyLCByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXIsIGxlZnQ6bnVtYmVyfX0gY29vcmRzXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uIGFkanVzdG1lbnRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2FsaWJyYXRlKGNvb3JkcywgY3VzaGlvbikge1xyXG4gICAgdmFyIG8gPSB7fTtcclxuICAgIGN1c2hpb24gPSArY3VzaGlvbiB8fCAwO1xyXG4gICAgb1snd2lkdGgnXSA9IChvWydyaWdodCddID0gY29vcmRzWydyaWdodCddICsgY3VzaGlvbikgLSAob1snbGVmdCddID0gY29vcmRzWydsZWZ0J10gLSBjdXNoaW9uKTtcclxuICAgIG9bJ2hlaWdodCddID0gKG9bJ2JvdHRvbSddID0gY29vcmRzWydib3R0b20nXSArIGN1c2hpb24pIC0gKG9bJ3RvcCddID0gY29vcmRzWyd0b3AnXSAtIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuIG87XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcm9zcy1icm93c2VyIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHBsdXMgb3B0aW9uYWwgY3VzaGlvbi5cclxuICAgKiBDb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsIGVsZW1lbnQgb3Igc3RhY2sgKHVzZXMgZmlyc3QgaXRlbSlcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb24gKy8tIHBpeGVsIGFkanVzdG1lbnQgYW1vdW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fGJvb2xlYW59XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKSB7XHJcbiAgICBlbCA9IGVsICYmICFlbC5ub2RlVHlwZSA/IGVsWzBdIDogZWw7XHJcbiAgICBpZiAoIWVsIHx8IDEgIT09IGVsLm5vZGVUeXBlKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gY2FsaWJyYXRlKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBjdXNoaW9uKTtcclxuICB9XHJcbiAgeHBvcnRzWydyZWN0YW5nbGUnXSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB2aWV3cG9ydCBhc3BlY3QgcmF0aW8gKG9yIHRoZSBhc3BlY3QgcmF0aW8gb2YgYW4gb2JqZWN0IG9yIGVsZW1lbnQpXHJcbiAgICogQHNpbmNlIDEuNy4wXHJcbiAgICogQHBhcmFtIHsoRWxlbWVudHxPYmplY3QpPX0gbyBvcHRpb25hbCBvYmplY3Qgd2l0aCB3aWR0aC9oZWlnaHQgcHJvcHMgb3IgbWV0aG9kc1xyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKiBAbGluayBodHRwOi8vdzMub3JnL1RSL2NzczMtbWVkaWFxdWVyaWVzLyNvcmllbnRhdGlvblxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzcGVjdChvKSB7XHJcbiAgICBvID0gbnVsbCA9PSBvID8gdmlld3BvcnQoKSA6IDEgPT09IG8ubm9kZVR5cGUgPyByZWN0YW5nbGUobykgOiBvO1xyXG4gICAgdmFyIGggPSBvWydoZWlnaHQnXSwgdyA9IG9bJ3dpZHRoJ107XHJcbiAgICBoID0gdHlwZW9mIGggPT0gJ2Z1bmN0aW9uJyA/IGguY2FsbChvKSA6IGg7XHJcbiAgICB3ID0gdHlwZW9mIHcgPT0gJ2Z1bmN0aW9uJyA/IHcuY2FsbChvKSA6IHc7XHJcbiAgICByZXR1cm4gdy9oO1xyXG4gIH1cclxuICB4cG9ydHNbJ2FzcGVjdCddID0gYXNwZWN0O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeC1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWCddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5yaWdodCA+PSAwICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeS1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWSddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5ib3R0b20gPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luVmlld3BvcnQnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICAvLyBFcXVpdiB0byBgaW5YKGVsLCBjdXNoaW9uKSAmJiBpblkoZWwsIGN1c2hpb24pYCBidXQganVzdCBtYW51YWxseSBkbyBib3RoIFxyXG4gICAgLy8gdG8gYXZvaWQgY2FsbGluZyByZWN0YW5nbGUoKSB0d2ljZS4gSXQgZ3ppcHMganVzdCBhcyBzbWFsbCBsaWtlIHRoaXMuXHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci5yaWdodCA+PSAwICYmIHIudG9wIDw9IHZpZXdwb3J0SCgpICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4geHBvcnRzO1xyXG59KSk7IiwiLyohXG4gKiBFdmVudEVtaXR0ZXIgdjQuMi4xMSAtIGdpdC5pby9lZVxuICogVW5saWNlbnNlIC0gaHR0cDovL3VubGljZW5zZS5vcmcvXG4gKiBPbGl2ZXIgQ2FsZHdlbGwgLSBodHRwOi8vb2xpLm1lLnVrL1xuICogQHByZXNlcnZlXG4gKi9cblxuOyhmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIG1hbmFnaW5nIGV2ZW50cy5cbiAgICAgKiBDYW4gYmUgZXh0ZW5kZWQgdG8gcHJvdmlkZSBldmVudCBmdW5jdGlvbmFsaXR5IGluIG90aGVyIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAY2xhc3MgRXZlbnRFbWl0dGVyIE1hbmFnZXMgZXZlbnQgcmVnaXN0ZXJpbmcgYW5kIGVtaXR0aW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHt9XG5cbiAgICAvLyBTaG9ydGN1dHMgdG8gaW1wcm92ZSBzcGVlZCBhbmQgc2l6ZVxuICAgIHZhciBwcm90byA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG4gICAgdmFyIGV4cG9ydHMgPSB0aGlzO1xuICAgIHZhciBvcmlnaW5hbEdsb2JhbFZhbHVlID0gZXhwb3J0cy5FdmVudEVtaXR0ZXI7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQgaW4gaXRzIHN0b3JhZ2UgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGxpc3RlbmVycyBBcnJheSBvZiBsaXN0ZW5lcnMgdG8gc2VhcmNoIHRocm91Z2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGxvb2sgZm9yLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gSW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0ZW5lciwgLTEgaWYgbm90IGZvdW5kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVycywgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsaWFzIGEgbWV0aG9kIHdoaWxlIGtlZXBpbmcgdGhlIGNvbnRleHQgY29ycmVjdCwgdG8gYWxsb3cgZm9yIG92ZXJ3cml0aW5nIG9mIHRhcmdldCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGFsaWFzZWQgbWV0aG9kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxpYXMobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWxpYXNDbG9zdXJlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0ZW5lciBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaWxsIGluaXRpYWxpc2UgdGhlIGV2ZW50IG9iamVjdCBhbmQgbGlzdGVuZXIgYXJyYXlzIGlmIHJlcXVpcmVkLlxuICAgICAqIFdpbGwgcmV0dXJuIGFuIG9iamVjdCBpZiB5b3UgdXNlIGEgcmVnZXggc2VhcmNoLiBUaGUgb2JqZWN0IGNvbnRhaW5zIGtleXMgZm9yIGVhY2ggbWF0Y2hlZCBldmVudC4gU28gL2JhW3J6XS8gbWlnaHQgcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGJhciBhbmQgYmF6LiBCdXQgb25seSBpZiB5b3UgaGF2ZSBlaXRoZXIgZGVmaW5lZCB0aGVtIHdpdGggZGVmaW5lRXZlbnQgb3IgYWRkZWQgc29tZSBsaXN0ZW5lcnMgdG8gdGhlbS5cbiAgICAgKiBFYWNoIHByb3BlcnR5IGluIHRoZSBvYmplY3QgcmVzcG9uc2UgaXMgYW4gYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfE9iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgdGhlIGV2ZW50LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldExpc3RlbmVycyhldnQpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgY29uY2F0ZW5hdGVkIGFycmF5IG9mIGFsbCBtYXRjaGluZyBldmVudHMgaWZcbiAgICAgICAgLy8gdGhlIHNlbGVjdG9yIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Vba2V5XSA9IGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gZXZlbnRzW2V2dF0gfHwgKGV2ZW50c1tldnRdID0gW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGxpc3Qgb2YgbGlzdGVuZXIgb2JqZWN0cyBhbmQgZmxhdHRlbnMgaXQgaW50byBhIGxpc3Qgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gbGlzdGVuZXJzIFJhdyBsaXN0ZW5lciBvYmplY3RzLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW119IEp1c3QgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBwcm90by5mbGF0dGVuTGlzdGVuZXJzID0gZnVuY3Rpb24gZmxhdHRlbkxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGZsYXRMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmxhdExpc3RlbmVycy5wdXNoKGxpc3RlbmVyc1tpXS5saXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmxhdExpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgcmVxdWVzdGVkIGxpc3RlbmVycyB2aWEgZ2V0TGlzdGVuZXJzIGJ1dCB3aWxsIGFsd2F5cyByZXR1cm4gdGhlIHJlc3VsdHMgaW5zaWRlIGFuIG9iamVjdC4gVGhpcyBpcyBtYWlubHkgZm9yIGludGVybmFsIHVzZSBidXQgb3RoZXJzIG1heSBmaW5kIGl0IHVzZWZ1bC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBpbiBhbiBvYmplY3QuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzQXNPYmplY3QgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnNBc09iamVjdChldnQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBpZiAobGlzdGVuZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICByZXNwb25zZVtldnRdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGxpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogVGhlIGxpc3RlbmVyIHdpbGwgbm90IGJlIGFkZGVkIGlmIGl0IGlzIGEgZHVwbGljYXRlLlxuICAgICAqIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgaXQgaXMgY2FsbGVkLlxuICAgICAqIElmIHlvdSBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lIHRoZW4gdGhlIGxpc3RlbmVyIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVySXNXcmFwcGVkID0gdHlwZW9mIGxpc3RlbmVyID09PSAnb2JqZWN0JztcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5wdXNoKGxpc3RlbmVySXNXcmFwcGVkID8gbGlzdGVuZXIgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICAgICAgb25jZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9uID0gYWxpYXMoJ2FkZExpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLWFsaWFzIG9mIGFkZExpc3RlbmVyLiBJdCB3aWxsIGFkZCBhIGxpc3RlbmVyIHRoYXQgd2lsbCBiZVxuICAgICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBhZnRlciBpdHMgZmlyc3QgZXhlY3V0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRPbmNlTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRPbmNlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihldnQsIHtcbiAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgIG9uY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZE9uY2VMaXN0ZW5lci5cbiAgICAgKi9cbiAgICBwcm90by5vbmNlID0gYWxpYXMoJ2FkZE9uY2VMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBldmVudCBuYW1lLiBUaGlzIGlzIHJlcXVpcmVkIGlmIHlvdSB3YW50IHRvIHVzZSBhIHJlZ2V4IHRvIGFkZCBhIGxpc3RlbmVyIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBJZiB5b3UgZG9uJ3QgZG8gdGhpcyB0aGVuIGhvdyBkbyB5b3UgZXhwZWN0IGl0IHRvIGtub3cgd2hhdCBldmVudCB0byBhZGQgdG8/IFNob3VsZCBpdCBqdXN0IGFkZCB0byBldmVyeSBwb3NzaWJsZSBtYXRjaCBmb3IgYSByZWdleD8gTm8uIFRoYXQgaXMgc2NhcnkgYW5kIGJhZC5cbiAgICAgKiBZb3UgbmVlZCB0byB0ZWxsIGl0IHdoYXQgZXZlbnQgbmFtZXMgc2hvdWxkIGJlIG1hdGNoZWQgYnkgYSByZWdleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gY3JlYXRlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50ID0gZnVuY3Rpb24gZGVmaW5lRXZlbnQoZXZ0KSB7XG4gICAgICAgIHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIGRlZmluZUV2ZW50IHRvIGRlZmluZSBtdWx0aXBsZSBldmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBldnRzIEFuIGFycmF5IG9mIGV2ZW50IG5hbWVzIHRvIGRlZmluZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudHMgPSBmdW5jdGlvbiBkZWZpbmVFdmVudHMoZXZ0cykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2dHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lRXZlbnQoZXZ0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmdW5jdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2hlbiBwYXNzZWQgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUsIGl0IHdpbGwgcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gcmVtb3ZlIGZyb20gdGhlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9mZiA9IGFsaWFzKCdyZW1vdmVMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy4gWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIGFkZCB0aGUgYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKiBZZWFoLCB0aGlzIGZ1bmN0aW9uIGRvZXMgcXVpdGUgYSBiaXQuIFRoYXQncyBwcm9iYWJseSBhIGJhZCB0aGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVycyA9IGZ1bmN0aW9uIGFkZExpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKGZhbHNlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVycyBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnModHJ1ZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyBsaXN0ZW5lcnMgaW4gYnVsay4gVGhlIGFkZExpc3RlbmVycyBhbmQgcmVtb3ZlTGlzdGVuZXJzIG1ldGhvZHMgYm90aCB1c2UgdGhpcyB0byBkbyB0aGVpciBqb2IuIFlvdSBzaG91bGQgcmVhbGx5IHVzZSB0aG9zZSBpbnN0ZWFkLCB0aGlzIGlzIGEgbGl0dGxlIGxvd2VyIGxldmVsLlxuICAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGRldGVybWluZSBpZiB0aGUgbGlzdGVuZXJzIGFyZSByZW1vdmVkICh0cnVlKSBvciBhZGRlZCAoZmFsc2UpLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkL3JlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFuaXB1bGF0ZSB0aGUgbGlzdGVuZXJzIG9mIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlIFRydWUgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIGxpc3RlbmVycywgZmFsc2UgaWYgeW91IHdhbnQgdG8gYWRkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkL3JlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5tYW5pcHVsYXRlTGlzdGVuZXJzID0gZnVuY3Rpb24gbWFuaXB1bGF0ZUxpc3RlbmVycyhyZW1vdmUsIGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIHZhciBzaW5nbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVyIDogdGhpcy5hZGRMaXN0ZW5lcjtcbiAgICAgICAgdmFyIG11bHRpcGxlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lcnMgOiB0aGlzLmFkZExpc3RlbmVycztcblxuICAgICAgICAvLyBJZiBldnQgaXMgYW4gb2JqZWN0IHRoZW4gcGFzcyBlYWNoIG9mIGl0cyBwcm9wZXJ0aWVzIHRvIHRoaXMgbWV0aG9kXG4gICAgICAgIGlmICh0eXBlb2YgZXZ0ID09PSAnb2JqZWN0JyAmJiAhKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpICYmICh2YWx1ZSA9IGV2dFtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgc2luZ2xlIGxpc3RlbmVyIHN0cmFpZ2h0IHRocm91Z2ggdG8gdGhlIHNpbmd1bGFyIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgcGFzcyBiYWNrIHRvIHRoZSBtdWx0aXBsZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTbyBldnQgbXVzdCBiZSBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gQW5kIGxpc3RlbmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIGxpc3RlbmVyc1xuICAgICAgICAgICAgLy8gTG9vcCBvdmVyIGl0IGFuZCBwYXNzIGVhY2ggb25lIHRvIHRoZSBtdWx0aXBsZSBtZXRob2RcbiAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGV2dCwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMgZnJvbSBhIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYW4gZXZlbnQgdGhlbiBhbGwgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiBUaGF0IG1lYW5zIGV2ZXJ5IGV2ZW50IHdpbGwgYmUgZW1wdGllZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ2V4IHRvIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IFtldnRdIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci4gV2lsbCByZW1vdmUgZnJvbSBldmVyeSBldmVudCBpZiBub3QgcGFzc2VkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZXZ0KSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGV2dDtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJlbW92ZSBkaWZmZXJlbnQgdGhpbmdzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgZXZ0XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbZXZ0XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgZXZlbnRzIG1hdGNoaW5nIHRoZSByZWdleC5cbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBpbiBhbGwgZXZlbnRzXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUV2ZW50LlxuICAgICAqXG4gICAgICogQWRkZWQgdG8gbWlycm9yIHRoZSBub2RlIEFQSS5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBhbGlhcygncmVtb3ZlRXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IG9mIHlvdXIgY2hvaWNlLlxuICAgICAqIFdoZW4gZW1pdHRlZCwgZXZlcnkgbGlzdGVuZXIgYXR0YWNoZWQgdG8gdGhhdCBldmVudCB3aWxsIGJlIGV4ZWN1dGVkLlxuICAgICAqIElmIHlvdSBwYXNzIHRoZSBvcHRpb25hbCBhcmd1bWVudCBhcnJheSB0aGVuIHRob3NlIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0byBldmVyeSBsaXN0ZW5lciB1cG9uIGV4ZWN1dGlvbi5cbiAgICAgKiBCZWNhdXNlIGl0IHVzZXMgYGFwcGx5YCwgeW91ciBhcnJheSBvZiBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXMgaWYgeW91IHdyb3RlIHRoZW0gb3V0IHNlcGFyYXRlbHkuXG4gICAgICogU28gdGhleSB3aWxsIG5vdCBhcnJpdmUgd2l0aGluIHRoZSBhcnJheSBvbiB0aGUgb3RoZXIgc2lkZSwgdGhleSB3aWxsIGJlIHNlcGFyYXRlLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXSBPcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdEV2ZW50ID0gZnVuY3Rpb24gZW1pdEV2ZW50KGV2dCwgYXJncykge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpID0gbGlzdGVuZXJzW2tleV0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgc2hhbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWl0aGVyIHdpdGggYSBiYXNpYyBjYWxsIG9yIGFuIGFwcGx5IGlmIHRoZXJlIGlzIGFuIGFyZ3MgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNba2V5XVtpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25jZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gbGlzdGVuZXIubGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBlbWl0RXZlbnRcbiAgICAgKi9cbiAgICBwcm90by50cmlnZ2VyID0gYWxpYXMoJ2VtaXRFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogU3VidGx5IGRpZmZlcmVudCBmcm9tIGVtaXRFdmVudCBpbiB0aGF0IGl0IHdpbGwgcGFzcyBpdHMgYXJndW1lbnRzIG9uIHRvIHRoZSBsaXN0ZW5lcnMsIGFzIG9wcG9zZWQgdG8gdGFraW5nIGEgc2luZ2xlIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwYXNzIG9uLlxuICAgICAqIEFzIHdpdGggZW1pdEV2ZW50LCB5b3UgY2FuIHBhc3MgYSByZWdleCBpbiBwbGFjZSBvZiB0aGUgZXZlbnQgbmFtZSB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0gey4uLip9IE9wdGlvbmFsIGFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2dCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRFdmVudChldnQsIGFyZ3MpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZiBhXG4gICAgICogbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoZSBvbmUgc2V0IGhlcmUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBhZnRlciBleGVjdXRpb24uIFRoaXMgdmFsdWUgZGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIG5ldyB2YWx1ZSB0byBjaGVjayBmb3Igd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnNldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIHNldE9uY2VSZXR1cm5WYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9vbmNlUmV0dXJuVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmXG4gICAgICogdGhlIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGlzIG9uZSB0aGVuIGl0IHNob3VsZCBiZSByZW1vdmVkXG4gICAgICogYXV0b21hdGljYWxseS4gSXQgd2lsbCByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7KnxCb29sZWFufSBUaGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBmb3Igb3IgdGhlIGRlZmF1bHQsIHRydWUuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIF9nZXRPbmNlUmV0dXJuVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdfb25jZVJldHVyblZhbHVlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBldmVudHMgb2JqZWN0IGFuZCBjcmVhdGVzIG9uZSBpZiByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV2ZW50cyBzdG9yYWdlIG9iamVjdC5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0RXZlbnRzID0gZnVuY3Rpb24gX2dldEV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXZlcnRzIHRoZSBnbG9iYWwge0BsaW5rIEV2ZW50RW1pdHRlcn0gdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBOb24gY29uZmxpY3RpbmcgRXZlbnRFbWl0dGVyIGNsYXNzLlxuICAgICAqL1xuICAgIEV2ZW50RW1pdHRlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBvcmlnaW5hbEdsb2JhbFZhbHVlO1xuICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBvc2UgdGhlIGNsYXNzIGVpdGhlciB2aWEgQU1ELCBDb21tb25KUyBvciB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIiMjIypcbiAqIFRoZSBwdXJwb3NlIG9mIHRoaXMgbGF5ZXIgaXMgdG8gZGVjbGFyZSBhbmQgYWJzdHJhY3QgdGhlIGFjY2VzcyB0b1xuICogdGhlIGNvcmUgYmFzZSBvZiBsaWJyYXJpZXMgdGhhdCB0aGUgcmVzdCBvZiB0aGUgc3RhY2sgKHRoZSBhcHAgZnJhbWV3b3JrKVxuICogd2lsbCBkZXBlbmQuXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgQmFzZSkgLT5cblxuICAgICMgQXJyYXkgdGhhdCBob2xkcyBoYXJkIGRlcGVuZGVuY2llcyBmb3IgdGhlIFNES1xuICAgIGRlcGVuZGVuY2llcyA9IFtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImpRdWVyeVwiXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IFwiMS4xMFwiICMgcmVxdWlyZWQgdmVyc2lvblxuICAgICAgICAgICAgXCJvYmpcIjogcm9vdC4kICMgZ2xvYmFsIG9iamVjdFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IGlmIHJvb3QuJCB0aGVuIHJvb3QuJC5mbi5qcXVlcnkgZWxzZSAwICMgZ2l2ZXMgdGhlIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgb2YgdGhlIGxvYWRlZCBsaWJcbiAgICAgICAgLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiVW5kZXJzY29yZVwiXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IFwiMS43LjBcIiAjIHJlcXVpcmVkIHZlcnNpb25cbiAgICAgICAgICAgIFwib2JqXCI6IHJvb3QuXyAjIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBpZiByb290Ll8gdGhlbiByb290Ll8uVkVSU0lPTiBlbHNlIDBcbiAgICBdXG5cbiAgICAjIFZlcnNpb24gY2hlY2tlciB1dGlsXG4gICAgVmVyc2lvbkNoZWNrZXIgPSByZXF1aXJlICcuL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlJ1xuXG4gICAgIyBJbiBjYXNlIGFueSBvZiBvdXIgZGVwZW5kZW5jaWVzIHdlcmUgbm90IGxvYWRlZCwgb3IgaXRzIHZlcnNpb24gZG9lc3Qgbm90IGNvcnJlc3BvbmQgdG8gb3Vyc1xuICAgICMgbmVlZHMsIHRoZSB2ZXJzaW9uQ2hlY2tlciB3aWxsIHRob3J3IGFuIGVycm9yIGV4cGxhaW5pbmcgd2h5XG4gICAgVmVyc2lvbkNoZWNrZXIuY2hlY2soZGVwZW5kZW5jaWVzKVxuXG4gICAgIyBMb2dnZXJcbiAgICBCYXNlLmxvZyA9IHJlcXVpcmUgJy4vdXRpbC9sb2dnZXIuY29mZmVlJ1xuXG4gICAgIyBEZXZpY2UgZGV0ZWN0aW9uXG4gICAgQmFzZS5kZXZpY2UgPSByZXF1aXJlICcuL3V0aWwvZGV2aWNlZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgQ29va2llcyBBUElcbiAgICBCYXNlLmNvb2tpZXMgPSByZXF1aXJlICcuL3V0aWwvY29va2llcy5jb2ZmZWUnXG5cbiAgICAjIFZpZXdwb3J0IGRldGVjdGlvblxuICAgIEJhc2UudnAgPSByZXF1aXJlICcuL3V0aWwvdmlld3BvcnRkZXRlY3Rpb24uY29mZmVlJ1xuXG4gICAgIyBGdW5jdGlvbiB0aGF0IGlzIGdvbm5hIGhhbmRsZSByZXNwb25zaXZlIGltYWdlc1xuICAgIEJhc2UuSW1hZ2VyID0gcmVxdWlyZSAnaW1hZ2VyLmpzJ1xuXG4gICAgIyBFdmVudCBCdXNcbiAgICBCYXNlLkV2ZW50cyA9IHJlcXVpcmUgJy4vdXRpbC9ldmVudGJ1cy5jb2ZmZWUnXG5cbiAgICAjIEdlbmVyYWwgVXRpbHNcbiAgICBVdGlscyA9IHJlcXVpcmUgJy4vdXRpbC9nZW5lcmFsLmNvZmZlZSdcblxuICAgICMgVXRpbHNcbiAgICBCYXNlLnV0aWwgPSByb290Ll8uZXh0ZW5kIFV0aWxzLCByb290Ll9cblxuICAgIHJldHVybiBCYXNlXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgICA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuICAgIE1vZHVsZSA9IHJlcXVpcmUoJy4vLi4vdXRpbC9tb2R1bGUuY29mZmVlJylcblxuICAgIGNsYXNzIENvbXBvbmVudFxuXG4gICAgICAgICMgb2JqZWN0IHRvIHN0b3JlIGluaXRpYWxpemVkIGNvbXBvbmVudHNcbiAgICAgICAgQGluaXRpYWxpemVkQ29tcG9uZW50cyA6IHt9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBzdGFydEFsbCBtZXRob2RcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBsb29rIGZvciBjb21wb25lbnRzIHRvIHN0YXJ0IHdpdGhpbiB0aGUgcGFzc2VkIHNlbGVjdG9yXG4gICAgICAgICAqIGFuZCBjYWxsIHRoZWlyIC5pbml0aWFsaXplKCkgbWV0aG9kXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbmNpc2NvLnJhbWluaSBhdCBnbG9iYW50LmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciA9ICdib2R5Jy4gQ1NTIHNlbGVjdG9yIHRvIHRlbGwgdGhlIGFwcCB3aGVyZSB0byBsb29rIGZvciBjb21wb25lbnRzXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdGFydEFsbDogKHNlbGVjdG9yID0gJ2JvZHknLCBhcHAsIG5hbWVzcGFjZSA9IFBlc3RsZS5tb2R1bGVzKSAtPlxuXG4gICAgICAgICAgICBjb21wb25lbnRzID0gQ29tcG9uZW50LnBhcnNlKHNlbGVjdG9yLCBhcHAuY29uZmlnLm5hbWVzcGFjZSlcblxuICAgICAgICAgICAgY21wY2xvbmUgPSBCYXNlLnV0aWwuY2xvbmUgY29tcG9uZW50c1xuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiUGFyc2VkIGNvbXBvbmVudHNcIlxuICAgICAgICAgICAgQmFzZS5sb2cuZGVidWcgY21wY2xvbmVcblxuICAgICAgICAgICAgIyBhZGRlZCB0byBrZWVwIG5hbWVzcGFjZS5OQU1FID0gREVGSU5JVElPTiBzaW50YXguIFRoaXMgd2lsbCBleHRlbmRcbiAgICAgICAgICAgICMgdGhlIG9iamVjdCBkZWZpbml0aW9uIHdpdGggdGhlIE1vZHVsZSBjbGFzc1xuICAgICAgICAgICAgIyB0aGlzIG1pZ2h0IG5lZWQgdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0VtcHR5IGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2UsIChkZWZpbml0aW9uLCBuYW1lKSAtPlxuICAgICAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmlzRnVuY3Rpb24gZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgTW9kdWxlLmV4dGVuZCBuYW1lLCBkZWZpbml0aW9uXG5cbiAgICAgICAgICAgICMgZ3JhYiBhIHJlZmVyZW5jZSBvZiBhbGwgdGhlIG1vZHVsZSBkZWZpbmVkIHVzaW5nIHRoZSBNb2R1bGUuYWRkXG4gICAgICAgICAgICAjIG1ldGhvZC5cbiAgICAgICAgICAgIEJhc2UudXRpbC5leHRlbmQgbmFtZXNwYWNlLCBQZXN0bGUuTW9kdWxlLmxpc3RcblxuICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhbGw6IENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBuZXc6IGNtcGNsb25lXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiB0aGUgcGFyc2UgbWV0aG9kIHdpbGwgbG9vayBmb3IgY29tcG9uZW50cyBkZWZpbmVkIHVzaW5nXG4gICAgICAgICAqIHRoZSBjb25maWd1cmVkIG5hbWVzcGFjZSBhbmQgbGl2aW5nIHdpdGhpbiB0aGUgcGFzc2VkXG4gICAgICAgICAqIENTUyBzZWxlY3RvclxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmFtZXNwYWNlIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAjIyNcbiAgICAgICAgQHBhcnNlOiAoc2VsZWN0b3IsIG5hbWVzcGFjZSkgLT5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gc3RvcmUgcGFyc2VkIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGxpc3QgPSBbXVxuXG4gICAgICAgICAgICAjIGlmIGFuIGFycmF5IGlzIHBhc3NlZCwgdXNlIGl0IGFzIGl0IGlzXG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNBcnJheSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VzID0gbmFtZXNwYWNlXG4gICAgICAgICAgICAjIGlmIGEgc3RyaW5nIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIsIGNvbnZlcnQgaXQgdG8gYW4gYXJyYXlcbiAgICAgICAgICAgIGVsc2UgaWYgQmFzZS51dGlsLmlzU3RyaW5nIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZXMgPSBuYW1lc3BhY2Uuc3BsaXQgJywnXG5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gc3RvcmUgdGhlIGNvbXBvc2VkIGNzcyBzZWxlY3RvciB0aGF0IHdpbGwgbG9vayB1cCBmb3JcbiAgICAgICAgICAgICMgY29tcG9uZW50IGRlZmluaXRpb25zXG4gICAgICAgICAgICBjc3NTZWxlY3RvcnMgPSBbXVxuXG4gICAgICAgICAgICAjIGl0ZXJhdGVzIG92ZXIgdGhlIG5hbWVzcGFjZSBhcnJheSBhbmQgY3JlYXRlIHRoZSBuZWVkZWQgY3NzIHNlbGVjdG9yc1xuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICMgaWYgYSBuZXcgbmFtZXNwYWNlIGhhcyBiZWVuIHByb3ZpZGVkIGxldHMgYWRkIGl0IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgY3NzU2VsZWN0b3JzLnB1c2ggXCJbZGF0YS1cIiArIG5zICsgXCItY29tcG9uZW50XVwiXG5cbiAgICAgICAgICAgICMgVE9ETzogQWNjZXNzIHRoZXNlIERPTSBmdW5jdGlvbmFsaXR5IHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgJChzZWxlY3RvcikuZmluZChjc3NTZWxlY3RvcnMuam9pbignLCcpKS5lYWNoIChpLCBjb21wKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUgY29tcCBhbHJlYWR5IGhhcyB0aGUgcGVzdGxlLWd1aWQgYXR0YWNoZWQsIGl0IG1lYW5zXG4gICAgICAgICAgICAgICAgIyBpdCB3YXMgYWxyZWFkeSBzdGFydGVkLCBzbyB3ZSdsbCBvbmx5IGxvb2sgZm9yIHVubml0aWFsaXplZFxuICAgICAgICAgICAgICAgICMgY29tcG9uZW50cyBoZXJlXG4gICAgICAgICAgICAgICAgdW5sZXNzICQoY29tcCkuZGF0YSgncGVzdGxlLWd1aWQnKVxuXG4gICAgICAgICAgICAgICAgICAgIG5zID0gZG8gKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFRoaXMgd2F5IHdlIG9idGFpbiB0aGUgbmFtZXNwYWNlIG9mIHRoZSBjdXJyZW50IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICQoY29tcCkuZGF0YShucyArIFwiLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlXG5cbiAgICAgICAgICAgICAgICAgICAgIyBvcHRpb25zIHdpbGwgaG9sZCBhbGwgdGhlIGRhdGEtKiBhdHRyaWJ1dGVzIHJlbGF0ZWQgdG8gdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gQ29tcG9uZW50LnBhcnNlQ29tcG9uZW50T3B0aW9ucyhALCBucylcblxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goeyBuYW1lOiBvcHRpb25zLm5hbWUsIG9wdGlvbnM6IG9wdGlvbnMgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RcblxuICAgICAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgaW4gY2hhcmdlIG9mIHBhcnNpbmcgYWxsIHRoZSBkYXRhLSogYXR0cmlidXRlc1xuICAgICAgICAjIGRlZmluZWQgaW4gdGhlIGl0cyAkZWwgbWFya3VwIGFuZCBwbGFjaW5nIHRoZW0gaW4gYSBvYmplY3RcbiAgICAgICAgQHBhcnNlQ29tcG9uZW50T3B0aW9uczogKGVsLCBuYW1lc3BhY2UsIG9wdHMpIC0+XG4gICAgICAgICAgICBvcHRpb25zID0gQmFzZS51dGlsLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcbiAgICAgICAgICAgIGxlbmd0aCA9IDBcblxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggZGF0YSwgKHYsIGspIC0+XG5cbiAgICAgICAgICAgICAgICAjIHJlbW92ZXMgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGsgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIG5hbWVzcGFjZSksIFwiXCIpXG5cbiAgICAgICAgICAgICAgICAjIGRlY2FtZWxpemUgdGhlIG9wdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgayA9IGsuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBrLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBrZXkgaXMgZGlmZmVyZW50IGZyb20gXCJjb21wb25lbnRcIiBpdCBtZWFucyBpdCBpc1xuICAgICAgICAgICAgICAgICMgYW4gb3B0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgayAhPSBcImNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSB2XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCsrXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdlxuXG4gICAgICAgICAgICAjIGFkZCBvbmUgYmVjYXVzZSB3ZSd2ZSBhZGRlZCAnZWwnIGF1dG9tYXRpY2FsbHkgYXMgYW4gZXh0cmEgb3B0aW9uXG4gICAgICAgICAgICBvcHRpb25zLmxlbmd0aCA9IGxlbmd0aCArIDFcblxuICAgICAgICAgICAgIyBidWlsZCBhZCByZXR1cm4gdGhlIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgIENvbXBvbmVudC5idWlsZE9wdGlvbnNPYmplY3QobmFtZSwgb3B0aW9ucylcblxuXG4gICAgICAgIEBidWlsZE9wdGlvbnNPYmplY3Q6IChuYW1lLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBvcHRpb25zLm5hbWUgPSBuYW1lXG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zXG5cbiAgICAgICAgQGluc3RhbnRpYXRlOiAoY29tcG9uZW50cywgYXBwKSAtPlxuXG4gICAgICAgICAgICBpZiBjb21wb25lbnRzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIG0gPSBjb21wb25lbnRzLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIG1vZHVsZXMgYXJlIGRlZmluZWQgdXNpbmcgdGhlIG1vZHVsZXMgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgIyBUT0RPOiBQcm92aWRlIGFuIGFsdGVybmF0ZSB3YXkgdG8gZGVmaW5lIHRoZVxuICAgICAgICAgICAgICAgICMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5KFBlc3RsZS5tb2R1bGVzKSBhbmQgUGVzdGxlLm1vZHVsZXNbbS5uYW1lXSBhbmQgbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZCA9IFBlc3RsZS5tb2R1bGVzW20ubmFtZV1cblxuICAgICAgICAgICAgICAgICAgICAjIGNyZWF0ZSBhIG5ldyBzYW5kYm94IGZvciB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBzYiA9IGFwcC5jcmVhdGVTYW5kYm94KG0ubmFtZSlcblxuICAgICAgICAgICAgICAgICAgICAjIGdlbmVyYXRlcyBhbiB1bmlxdWUgZ3VpZCBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtLm9wdGlvbnMuZ3VpZCA9IEJhc2UudXRpbC51bmlxdWVJZChtLm5hbWUgKyBcIl9cIilcblxuICAgICAgICAgICAgICAgICAgICBtLm9wdGlvbnMuX19kZWZhdWx0c19fID0gYXBwLmNvbmZpZy5jb21wb25lbnRbbS5uYW1lXVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5qZWN0IHRoZSBzYW5kYm94IGFuZCB0aGUgb3B0aW9ucyBpbiB0aGUgbW9kdWxlIHByb3RvXG4gICAgICAgICAgICAgICAgICAgICMgQmFzZS51dGlsLmV4dGVuZCBtb2QsIHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZHggPSBuZXcgbW9kKHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZHguaW5pdGlhbGl6ZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzdG9yZSBhIHJlZmVyZW5jZSBvZiB0aGUgZ2VuZXJhdGVkIGd1aWQgb24gdGhlIGVsXG4gICAgICAgICAgICAgICAgICAgICQobS5vcHRpb25zLmVsKS5kYXRhICdwZXN0bGUtZ3VpZCcsIG0ub3B0aW9ucy5ndWlkXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzYXZlcyBhIHJlZmVyZW5jZSBvZiB0aGUgaW5pdGlhbGl6ZWQgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNbIG0ub3B0aW9ucy5ndWlkIF0gPSBtb2R4XG5cbiAgICAgICAgICAgICAgICBDb21wb25lbnQuaW5zdGFudGlhdGUoY29tcG9uZW50cywgYXBwKVxuXG5cbiAgICAjI1xuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGluaXQgdGhlIGV4dGVuc2lvblxuICAgICMjXG5cbiAgICAjIGNvbnN0cnVjdG9yXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIENvbXBvbmVudCBleHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGluaXRpYWxpemVkQ29tcG9uZW50cyA9IHt9XG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzID0gKHNlbGVjdG9yLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGluaXRpYWxpemVkQ29tcG9uZW50cyA9IENvbXBvbmVudC5zdGFydEFsbChzZWxlY3RvciwgYXBwKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsaXplZENvbXBvbmVudHMuYWxsXG5cbiAgICAgICAgYXBwLnNhbmRib3guZ2V0TGFzdGVzdEluaXRpYWxpemVkQ29tcG9uZW50cyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsaXplZENvbXBvbmVudHMubmV3XG5cblxuICAgICMgdGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgb25jZSBhbGwgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGxvYWRlZFxuICAgIGFmdGVyQXBwU3RhcnRlZDogKHNlbGVjdG9yLCBhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkNhbGxpbmcgc3RhcnRDb21wb25lbnRzIGZyb20gYWZ0ZXJBcHBTdGFydGVkXCJcbiAgICAgICAgcyA9IGlmIHNlbGVjdG9yIHRoZW4gc2VsZWN0b3IgZWxzZSBudWxsXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyhzLCBhcHApXG5cbiAgICBuYW1lOiAnQ29tcG9uZW50IEV4dGVuc2lvbidcblxuICAgICMgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXNcbiAgICAjIHRvIHZhbGlkYXRlIHRoZSBDb21wb25lbnQgY2xhc3MgaW4gaXNvbGF0aW9uXG4gICAgY2xhc3NlcyA6IENvbXBvbmVudFxuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdjb21wb25lbnRzJ1xuKVxuIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBiZSB0cmlnZ2VyaW5nIGV2ZW50cyBvbmNlIHRoZSBEZXZpY2UgaW4gd2hpY2ggdGhlXG4gKiB1c2VyIGlzIG5hdmlnYXRpbmcgdGhlIHNpdGUgaXMgZGV0ZWN0ZWQuIEl0cyBmdWNpb25hbGl0eSBtb3N0bHkgZGVwZW5kc1xuICogb24gdGhlIGNvbmZpZ3VyYXRpb25zIHNldHRpbmdzIChwcm92aWRlZCBieSBkZWZhdWx0LCBidXQgdGhleSBjYW4gYmUgb3ZlcnJpZGVuKVxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgUmVzcG9uc2l2ZURlc2lnblxuXG4gICAgICAgIGNmZyA6XG4gICAgICAgICAgICAjIFRoaXMgbGltaXQgd2lsbCBiZSB1c2VkIHRvIG1ha2UgdGhlIGRldmljZSBkZXRlY3Rpb25cbiAgICAgICAgICAgICMgd2hlbiB0aGUgdXNlciByZXNpemUgdGhlIHdpbmRvd1xuICAgICAgICAgICAgd2FpdExpbWl0OiAzMDBcblxuICAgICAgICAgICAgIyBkZWZpbmVzIGlmIHdlIGhhdmUgdG8gbGlzdGVuIGZvciB0aGUgcmVzaXplIGV2ZW50IG9uIHRoZSB3aW5kb3cgb2JqXG4gICAgICAgICAgICB3aW5kb3dSZXNpemVFdmVudDogdHJ1ZVxuXG4gICAgICAgICAgICAjIERlZmF1bHQgYnJlYWtwb2ludHNcbiAgICAgICAgICAgIGJyZWFrcG9pbnRzIDogW1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIm1vYmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICMgdW50aWwgdGhpcyBwb2ludCB3aWxsIGJlaGF2ZXMgYXMgbW9iaWxlXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiAwXG4gICAgICAgICAgICAgICAgICAgIGJwbWF4OiA3NjdcbiAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwidGFibGV0XCJcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDc2OFxuICAgICAgICAgICAgICAgICAgICBicG1heDogOTU5XG4gICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgICAgICAgICAjIGJ5IGRlZmF1bHQgYW55dGhpbmcgZ3JlYXRlciB0aGFuIHRhYmxldCBpcyBhIGRlc2t0b3BcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJkZXNrdG9wXCJcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDk2MFxuICAgICAgICAgICAgXVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5iaW5kQWxsIEAsIFwiX2luaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImRldGVjdERldmljZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NoZWNrVmlld3BvcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9hdHRhY2hXaW5kb3dIYW5kbGVyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJnZXREZXZpY2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX3Jlc2l6ZUhhbmRsZXJcIlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQGNmZywgY29uZmlnXG5cbiAgICAgICAgICAgIEBfaW5pdCgpXG5cbiAgICAgICAgX2luaXQ6ICgpIC0+XG5cbiAgICAgICAgICAgIEBfYXR0YWNoV2luZG93SGFuZGxlcnMoKSBpZiBAY29uZmlnLndpbmRvd1Jlc2l6ZUV2ZW50XG5cbiAgICAgICAgICAgIEBkZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIF9hdHRhY2hXaW5kb3dIYW5kbGVyczogKCkgLT5cblxuICAgICAgICAgICAgbGF6eVJlc2l6ZSA9IEJhc2UudXRpbC5kZWJvdW5jZSBAX3Jlc2l6ZUhhbmRsZXIsIEBjb25maWcud2FpdExpbWl0XG5cbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUobGF6eVJlc2l6ZSlcblxuICAgICAgICBfcmVzaXplSGFuZGxlcjogKCkgLT5cbiAgICAgICAgICAgICMgdHJpZ2dlcnMgYSB3aW5kb3dzcmVzaXplIGV2ZW50IHNvIHRoaXMgd2F5IHdlIGhhdmUgYSBjZW50cmFsaXplZFxuICAgICAgICAgICAgIyB3YXkgdG8gbGlzdGVuIGZvciB0aGUgcmVzaXplIGV2ZW50IG9uIHRoZSB3aW5kb3dzIGFuZCB0aGUgY29tcG9uZW5zXG4gICAgICAgICAgICAjIGNhbiBsaXN0ZW4gZGlyZWN0bHkgdG8gdGhpcyBldmVudCBpbnN0ZWFkIG9mIGRlZmluaW5nIGEgbmV3IGxpc3RlbmVyXG4gICAgICAgICAgICBQZXN0bGUuZW1pdCBcInJ3ZDp3aW5kb3dyZXNpemVcIlxuXG4gICAgICAgICAgICBAZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBkZXRlY3REZXZpY2U6ICgpIC0+XG5cbiAgICAgICAgICAgIGJwID0gQGNvbmZpZy5icmVha3BvaW50c1xuXG4gICAgICAgICAgICB2cCA9IEJhc2UudnAudmlld3BvcnRXKClcblxuICAgICAgICAgICAgIyBnZXQgYSByZWZlcmVuY2UgKGlmIGFueSkgdG8gdGhlIGNvcnJlc3BvbmRpbmcgYnJlYWtwb2ludFxuICAgICAgICAgICAgIyBkZWZpbmVkIGluIHRoZSBjb25maWcuXG4gICAgICAgICAgICB2cGQgPSBAX2NoZWNrVmlld3BvcnQodnAsIGJwKVxuXG4gICAgICAgICAgICBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkgdnBkXG5cbiAgICAgICAgICAgICAgICBjYXBpdGFsaXplZEJQTmFtZSA9IEJhc2UudXRpbC5zdHJpbmcuY2FwaXRhbGl6ZSh2cGQubmFtZSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAjIGxldCdzIGZpc3QgY2hlY2sgaWYgd2UgaGF2ZSBhIG1ldGhvZCB0byBkZXRlY3QgdGhlIGRldmljZSB0aHJvdWdoIFVBXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gQmFzZS5kZXZpY2VbJ2lzJyArIGNhcGl0YWxpemVkQlBOYW1lXVxuICAgICAgICAgICAgICAgICAgICBVQURldGVjdG9yID0gQmFzZS5kZXZpY2VbJ2lzJyArIGNhcGl0YWxpemVkQlBOYW1lXVxuXG4gICAgICAgICAgICAgICAgIyB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSByZXN1bHQgb2YgYSBVQSBjaGVjay5cbiAgICAgICAgICAgICAgICAjIFVubGVzcyB0aGVyZSBpcyBhIG1ldGhvZCB0byBjaGVjayB0aGUgVUEsIGxldHNcbiAgICAgICAgICAgICAgICAjIGxlYXZlIGl0IGFzIGZhbHNlIGFuZCB1c2Ugb25seSB0aGUgdmlld3BvcnQgdG9cbiAgICAgICAgICAgICAgICAjIG1ha2UgdGhlIGRldmljZSBkZXRlY3Rpb25cbiAgICAgICAgICAgICAgICBzdGF0ZVVBID0gZmFsc2VcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBVQURldGVjdG9yXG5cbiAgICAgICAgICAgICAgICAgICAgc3RhdGVVQSA9IFVBRGV0ZWN0b3IoKVxuXG4gICAgICAgICAgICAgICAgIyBGaW5hbCBjaGVjay4gRmlyc3Qgd2UnbGwgdHJ5IHRvIG1ha2UgdG8gbWFrZSB0aGUgZGVjaXNpb25cbiAgICAgICAgICAgICAgICAjIHVwb24gdGhlIGN1cnJlbnQgZGV2aWNlIGJhc2VkIG9uIFVBLCBpZiBpcyBub3QgcG9zc2libGUsIGxldHMganVzdFxuICAgICAgICAgICAgICAgICMgdXNlIHRoZSB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIGlmIHN0YXRlVUEgb3IgdnBkLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgIyBUcmlnZ2VyIGEgZXZlbnQgdGhhdCBmb2xsb3dzIHRoZSBmb2xsb3dpbmcgbmFtaW5nIGNvbnZlbnRpb25cbiAgICAgICAgICAgICAgICAgICAgIyByd2Q6PGRldmljZT5cbiAgICAgICAgICAgICAgICAgICAgIyBFeGFtcGxlOiByd2Q6dGFibGV0IG9yIHJ3ZDptb2JpbGVcblxuICAgICAgICAgICAgICAgICAgICBldnQgPSAncndkOicgKyB2cGQubmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgRGVzaWduIGV4dGVuc2lvbiBpcyB0cmlnZ2VyaW5nIHRoZSBmb2xsb3dpbmdcIlxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvIGV2dFxuXG4gICAgICAgICAgICAgICAgICAgIFBlc3RsZS5lbWl0IGV2dFxuXG4gICAgICAgICAgICAgICAgICAgICMgU3RvcmUgdGhlIGN1cnJlbnQgZGV2aWNlXG4gICAgICAgICAgICAgICAgICAgIEBkZXZpY2UgPSB2cGQubmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtc2cgPSBcIltleHRdIFRoZSBwYXNzZWQgc2V0dGluZ3MgdG8gdGhlIFJlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibWlnaHQgbm90IGJlIGNvcnJlY3Qgc2luY2Ugd2UgaGF2ZW4ndCBiZWVuIGFibGUgdG8gZGV0ZWN0IGFuIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhc29jaWF0ZWQgYnJlYWtwb2ludCB0byB0aGUgY3VycmVudCB2aWV3cG9ydFwiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICBnZXREZXZpY2U6ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBAZGV2aWNlXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBkZXRlY3QgaWYgdGhlIGN1cnJlbnQgdmlld3BvcnRcbiAgICAgICAgICogY29ycmVzcG9uZCB0byBhbnkgb2YgdGhlIGRlZmluZWQgYnAgaW4gdGhlIGNvbmZpZyBzZXR0aW5nXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdnAgW251bWJlci4gQ3VycmVudCB2aWV3cG9ydF1cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBicmVha3BvaW50cyBbY2xvbmUgb2YgdGhlIGJyZWFrcG9pbnQga2V5IG9iamVjdF1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSB0aGUgYnJlYWtwb2ludCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZSBjdXJyZW50bHlcbiAgICAgICAgICogICAgICAgICAgICAgICAgICBkZXRlY3RlZCB2aWV3cG9ydFxuICAgICAgICAjIyNcbiAgICAgICAgX2NoZWNrVmlld3BvcnQ6ICh2cCwgYnJlYWtwb2ludHMpIC0+XG5cbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBCYXNlLnV0aWwuZmlsdGVyKGJyZWFrcG9pbnRzLCAoYnApIC0+XG5cbiAgICAgICAgICAgICAgICAjIHN0YXJ0cyBjaGVja2luZyBpZiB0aGUgZGV0ZWN0ZWQgdmlld3BvcnQgaXNcbiAgICAgICAgICAgICAgICAjIGJpZ2dlciB0aGFuIHRoZSBicG1pbiBkZWZpbmVkIGluIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAgICAgIyBpdGVyYXRlZCBicmVha3BvaW50XG4gICAgICAgICAgICAgICAgaWYgdnAgPj0gYnAuYnBtaW5cblxuICAgICAgICAgICAgICAgICAgICAjIHdlJ2xsIG5lZWQgdG8gY2hlY2sgdGhpcyB3YXkgYmVjYXVzZSBieSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICMgaWYgYSBCUCBkb2Vzbid0IGhhdmUgYSBicG1heCBwcm9wZXJ0eSBpdCBtZWFuc1xuICAgICAgICAgICAgICAgICAgICAjIGlzIHRoZSBsYXN0IGFuZCBiaWdnZXIgY2FzZSB0byBjaGVjay4gQnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAjIGlzIGRlc2t0b3BcbiAgICAgICAgICAgICAgICAgICAgaWYgYnAuYnBtYXggYW5kIGJwLmJwbWF4ICE9IDBcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBpdCdzIHdpdGhpbiB0aGUgcmFuZ2UsIGFsbCBnb29kXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB2cCA8PSBicC5icG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0aGlzIHNob3VsZCBvbmx5IGJlIHRydWUgaW4gb25seSBvbmUgY2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBCeSBkZWZhdWx0LCBqdXN0IGZvciBkZXNrdG9wIHdoaWNoIGRvZXNuJ3QgaGF2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBhbiBcInVudGlsXCIgYnJlYWtwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZmFsc2VcblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiBicmVha3BvaW50Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICByZXR1cm4gYnJlYWtwb2ludC5zaGlmdCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9XG5cblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgIyBDaGVjayBpZiB0aGUgZXh0ZW5zaW9uIGhhcyBhIGN1c3RvbSBjb25maWcgdG8gdXNlXG4gICAgICAgIGlmIGFwcC5jb25maWcuZXh0ZW5zaW9uIGFuZCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgIHJ3ZCA9IG5ldyBSZXNwb25zaXZlRGVzaWduKGNvbmZpZylcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QgPSAoKSAtPlxuICAgICAgICAgICAgIyBjYWxsIGRldGVjdCBEZXZpY2UgaW4gb3JkZXIgdG8gdHJpZ2dlciB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgICAgICAgIyBkZXZpY2UgZXZlbnRcbiAgICAgICAgICAgIHJ3ZC5kZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZC5nZXREZXZpY2UgPSAoKSAtPlxuXG4gICAgICAgICAgICByd2QuZ2V0RGV2aWNlKClcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlRGVzaWduXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QoKVxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWRlc2lnbidcbikiLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGJlIGhhbmRsaW5nIHRoZSBjcmVhdGlvbiBvZiB0aGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIFJlc3BvbnNpdmVJbWFnZXNcblxuICAgICAgICBjZmcgOlxuICAgICAgICAgICAgIyBBcnJheSBvZiBzdXBwb3J0ZWQgUGl4ZWwgd2lkdGggZm9yIGltYWdlc1xuICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbMTMzLDE1MiwxNjIsMjI1LDIxMCwyMjQsMjgwLDM1Miw0NzAsNTM2LDU5MCw2NzYsNzEwLDc2OCw4ODUsOTQ1LDExOTBdXG5cbiAgICAgICAgICAgICMgQXJyYXkgb2Ygc3VwcG9ydGVyIHBpeGVsIHJhdGlvc1xuICAgICAgICAgICAgYXZhaWxhYmxlUGl4ZWxSYXRpb3M6IFsxLCAyLCAzXVxuXG4gICAgICAgICAgICAjIFNlbGVjdG9yIHRvIGJlIHVzZWQgd2hlbiBpbnN0YW50aW5nIEltYWdlclxuICAgICAgICAgICAgZGVmYXVsdFNlbGVjdG9yIDogJy5kZWxheWVkLWltYWdlLWxvYWQnXG5cbiAgICAgICAgICAgICMgbGF6eSBtb2RlIGVuYWJsZWRcbiAgICAgICAgICAgIGxhenltb2RlIDogdHJ1ZVxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5iaW5kQWxsIEAsIFwiX2luaXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jcmVhdGVMaXN0ZW5lcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jcmVhdGVJbnN0YW5jZVwiXG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAY2ZnLCBjb25maWdcblxuICAgICAgICAgICAgQF9pbml0KClcblxuICAgICAgICBfaW5pdDogKCkgLT5cblxuICAgICAgICAgICAgIyBjcmVhdGVzIGxpc3RlbmVycyB0byBhbGxvdyB0aGUgaW5zdGFudGlhdG9uIG9mIHRoZSBJbWFnZXJcbiAgICAgICAgICAgICMgaW4gbGF6eSBsb2FkIG1vZGUuXG4gICAgICAgICAgICAjIFVzZWZ1bCBmb3IgaW5maW5pdGUgc2Nyb2xscyBvciBpbWFnZXMgY3JlYXRlZCBvbiBkZW1hbmRcbiAgICAgICAgICAgIEBfY3JlYXRlTGlzdGVuZXJzKCkgaWYgQGNvbmZpZy5sYXp5bW9kZVxuXG4gICAgICAgICAgICAjIEFzIHNvb24gYXMgdGhpcyBleHRlbnNpb24gaXMgaW5pdGlhbGl6ZWQgd2UgYXJlIGdvbm5hIGJlIGNyZWF0aW5nXG4gICAgICAgICAgICAjIHRoZSByZXNwb25zaXZlIGltYWdlc1xuICAgICAgICAgICAgQF9jcmVhdGVJbnN0YW5jZSgpXG5cbiAgICAgICAgX2NyZWF0ZUxpc3RlbmVyczogKCkgLT5cbiAgICAgICAgICAgICMgdGhpcyBnaXZlcyB0aGUgYWJpbGl0eSB0byBjcmVhdGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICAgICAgICAgICMgYnkgdHJpZ2dlciB0aGlzIGV2ZW50IHdpdGggb3B0aW9uYWwgYXR0cmlidXRlc1xuICAgICAgICAgICAgUGVzdGxlLm9uICdyZXNwb25zaXZlaW1hZ2VzOmNyZWF0ZScsIEBfY3JlYXRlSW5zdGFuY2VcblxuICAgICAgICBfY3JlYXRlSW5zdGFuY2UgOiAob3B0aW9ucyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uIGNyZWF0aW5nIGEgbmV3IEltYWdlciBpbnN0YW5jZVwiXG5cbiAgICAgICAgICAgIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciBvciBAY29uZmlnLmRlZmF1bHRTZWxlY3RvclxuICAgICAgICAgICAgb3B0cyA9IGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eSBvcHRpb25zIHRoZW4gb3B0aW9ucyBlbHNlIEBjb25maWdcblxuICAgICAgICAgICAgbmV3IEJhc2UuSW1hZ2VyKHNlbGVjdG9yLCBvcHRzKVxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAjIENoZWNrIGlmIHRoZSBleHRlbnNpb24gaGFzIGEgY3VzdG9tIGNvbmZpZyB0byB1c2VcbiAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgYXBwLnNhbmRib3gucmVzcG9uc2l2ZWltYWdlcyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJwID0gbmV3IFJlc3BvbnNpdmVJbWFnZXMoY29uZmlnKVxuXG4gICAgICAgICAgICAjIHRyaWdnZXIgdGhlIGV2ZW50IHRvIGxldCBldmVyeWJvZHkga25vd3MgdGhhdCB0aGlzIGV4dGVuc2lvbiBmaW5pc2hlZFxuICAgICAgICAgICAgIyBpdHMgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIFBlc3RsZS5lbWl0ICdyZXNwb25zaXZlaW1hZ2VzOmluaXRpYWxpemVkJ1xuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVJbWFnZXNcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJlc3BvbnNpdmVpbWFnZXMoKVxuXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlaW1hZ2VzJ1xuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIENvb2tpZXMpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGNvb2tpZXMgPSByZXF1aXJlKCdjb29raWVzLWpzJylcblxuICAgICMgRXhwb3NlIENvb2tpZXMgQVBJXG4gICAgQ29va2llcyA9XG5cbiAgICAgICAgc2V0OiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuc2V0IGtleSwgdmFsdWUsIG9wdGlvbnNcblxuICAgICAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgICAgICBjb29raWVzLmdldCBrZXlcblxuICAgICAgICBleHBpcmU6IChrZXksIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLmV4cGlyZSBrZXksIG9wdGlvbnNcblxuICAgIHJldHVybiBDb29raWVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIERldmljZURldGVjdGlvbikgLT5cblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIGlzTW9iaWxlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIEV4cG9zZSBkZXZpY2UgZGV0ZWN0aW9uIEFQSVxuICAgIERldmljZURldGVjdGlvbiA9XG5cbiAgICAgICAgIyBHcm91cHNcbiAgICAgICAgaXNNb2JpbGU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5waG9uZVxuXG4gICAgICAgIGlzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUudGFibGV0XG5cbiAgICAgICAgIyBBcHBsZSBkZXZpY2VzXG4gICAgICAgIGlzSXBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUucGhvbmVcblxuICAgICAgICBpc0lwb2Q6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5pcG9kXG5cbiAgICAgICAgaXNJcGFkOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUudGFibGV0XG5cbiAgICAgICAgaXNBcHBsZSA6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5kZXZpY2VcblxuICAgICAgICAjIEFuZHJvaWQgZGV2aWNlc1xuICAgICAgICBpc0FuZHJvaWRQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQucGhvbmVcblxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnRhYmxldFxuXG4gICAgICAgIGlzQW5kcm9pZERldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQuZGV2aWNlXG5cbiAgICAgICAgIyBXaW5kb3dzIGRldmljZXNcbiAgICAgICAgaXNXaW5kb3dzUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnBob25lXG5cbiAgICAgICAgaXNXaW5kb3dzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy50YWJsZXRcblxuICAgICAgICBpc1dpbmRvd3NEZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLmRldmljZVxuXG4gICAgcmV0dXJuIERldmljZURldGVjdGlvblxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFdmVudEJ1cykgLT5cblxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJylcblxuICAgICMjIypcbiAgICAgKiBjbGFzcyB0aGF0IHNlcnZlcyBhcyBhIGZhY2FkZSBmb3IgdGhlIEV2ZW50RW1pdHRlciBjbGFzc1xuICAgICMjI1xuICAgIGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cbiAgICByZXR1cm4gRXZlbnRCdXNcbikiLCIjIyMqXG4gKiBUaGUgRXh0ZW5zaW9uIE1hbmFuZ2VyIHdpbGwgcHJvdmlkZSB0aGUgYmFzZSBzZXQgb2YgZnVuY3Rpb25hbGl0aWVzXG4gKiB0byBtYWtlIHRoZSBDb3JlIGxpYnJhcnkgZXh0ZW5zaWJsZS5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHRNYW5hZ2VyKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIERlZmF1bHRzIGNvbmZpZ3MgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIF9leHRlbnNpb25Db25maWdEZWZhdWx0czpcbiAgICAgICAgICAgIGFjdGl2YXRlZCA6IHRydWUgIyB1bmxlc3Mgc2FpZCBvdGhlcndpc2UsIGV2ZXJ5IGFkZGVkIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdpbGwgYmUgYWN0aXZhdGVkIG9uIHN0YXJ0XG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICAjIGNoZWNrcyBpZiB0aGUgbmFtZSBmb3IgdGhlIGV4dGVuc2lvbiBoYXZlIGJlZW4gZGVmaW5lZC5cbiAgICAgICAgICAgICMgaWYgbm90IGxvZyBhIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgdW5sZXNzIGV4dC5uYW1lXG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgZXh0ZW5zaW9uIGRvZXNuJ3QgaGF2ZSBhIG5hbWUgYXNzb2NpYXRlZC4gSXQgd2lsbCBiZSBoZXBmdWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcImlmIHlvdSBoYXZlIGFzc2luZyBhbGwgb2YgeW91ciBleHRlbnNpb25zIGEgbmFtZSBmb3IgYmV0dGVyIGRlYnVnZ2luZ1wiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgIyBMZXRzIHRocm93IGFuIGVycm9yIGlmIHdlIHRyeSB0byBpbml0aWFsaXplIHRoZSBzYW1lIGV4dGVuc2lvbiB0d2ljZXNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIEBfZXh0ZW5zaW9ucywgKHh0LCBpKSAtPlxuICAgICAgICAgICAgICAgIGlmIF8uaXNFcXVhbCB4dCwgZXh0XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQubmFtZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiKVxuXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMucHVzaChleHQpXG5cbiAgICAgICAgaW5pdCA6IChjb250ZXh0KSAtPlxuICAgICAgICAgICAgeHRjbG9uZSA9IEJhc2UudXRpbC5jbG9uZSBAX2V4dGVuc2lvbnNcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkFkZGVkIGV4dGVuc2lvbnMgKHN0aWxsIG5vdCBpbml0aWFsaXplZCk6XCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIHh0Y2xvbmVcblxuICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKEBfZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkluaXRpYWxpemVkIGV4dGVuc2lvbnM6XCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zXG5cbiAgICAgICAgX2luaXRFeHRlbnNpb24gOiAoZXh0ZW5zaW9ucywgY29udGV4dCkgLT5cblxuICAgICAgICAgICAgaWYgZXh0ZW5zaW9ucy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICB4dCA9IGV4dGVuc2lvbnMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgIyBDYWxsIGV4dGVuc2lvbnMgY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICBpZiBAX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQoeHQsIGNvbnRleHQuY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAjIHRoaXMgc3RhdGUgY291bGQgdGVsbCB0byB0aGUgcmVzdCBvZiB0aGUgd29ybGQgaWZcbiAgICAgICAgICAgICAgICAgICAgIyBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIG9yIG5vdFxuICAgICAgICAgICAgICAgICAgICB4dC5hY3RpdmF0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjYWxsIHRvIHRoZSBleHRlbnNpb24gaW5pdGlhbGl6ZSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KVxuXG4gICAgICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucy5wdXNoIHh0XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB4dC5hY3RpdmF0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgIyBjYWxsIHRoaXMgbWV0aG9kIHJlY3Vyc2l2ZWx5IHVudGlsIHRoZXJlIGFyZSBubyBtb3JlXG4gICAgICAgICAgICAgICAgIyBlbGVtZW50cyBpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICBfaXNFeHRlbnNpb25BbGxvd2VkVG9CZUFjdGl2YXRlZDogKHh0LCBjb25maWcpIC0+XG5cbiAgICAgICAgICAgICMgZmlyc3Qgd2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgXCJvcHRpb25zXCIga2V5IGlzIGRlZmluZWRcbiAgICAgICAgICAgICMgYnkgdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgdW5sZXNzIHh0Lm9wdGlvbktleVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiVGhlIG9wdGlvbktleSBpcyByZXF1aXJlZCBhbmQgd2FzIG5vdCBkZWZpbmVkIGJ5OiBcIiArIHh0Lm5hbWVcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAjIGlmIG9wdGlvbnMgd2VyZSBwcm92aWRlZCB0byB0aGUgZXh0ZW5zaW9uLCBsZXRzIGNoZWNrIGp1c3QgZm9yIFwiYWN0aXZhdGVkXCJcbiAgICAgICAgICAgICMgd2hpY2ggaXMgdGhlIG9ubHkgb3B0aW9uIHRoYXQgc2hvdWxkIG1hdHRlciB3aXRoaW4gdGhpcyBtZXRob2RcbiAgICAgICAgICAgIGlmIGNvbmZpZy5leHRlbnNpb24gYW5kIGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XSBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XS5oYXNPd25Qcm9wZXJ0eSAnYWN0aXZhdGVkJ1xuICAgICAgICAgICAgICAgIGFjdGl2YXRlZCA9IGNvbmZpZy5leHRlbnNpb25beHQub3B0aW9uS2V5XS5hY3RpdmF0ZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWQgPSBAX2V4dGVuc2lvbkNvbmZpZ0RlZmF1bHRzLmFjdGl2YXRlZFxuXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZhdGVkXG5cblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25CeU5hbWUgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIEJhc2UudXRpbC53aGVyZSBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucywgb3B0aW9uS2V5OiBuYW1lXG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9leHRlbnNpb25zXG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9uQnlOYW1lIDogKG5hbWUpIC0+XG4gICAgICAgICAgICBCYXNlLnV0aWwud2hlcmUgQF9leHRlbnNpb25zLCBvcHRpb25LZXk6IG5hbWVcblxuICAgIHJldHVybiBFeHRNYW5hZ2VyXG5cbilcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBVdGlscykgLT5cblxuICAgICMgRXhwb3NlIFV0aWxzIEFQSVxuICAgIFV0aWxzID1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgbGlicmFyeSB2ZXJzaW9uaW5nXG4gICAgICAgICMjI1xuICAgICAgICB2ZXJzaW9uQ29tcGFyZSA6ICh2MSwgdjIsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIGlzVmFsaWRQYXJ0ID0gKHgpIC0+XG4gICAgICAgICAgICAgICAgKChpZiBsZXhpY29ncmFwaGljYWwgdGhlbiAvXlxcZCtbQS1aYS16XSokLyBlbHNlIC9eXFxkKyQvKSkudGVzdCB4XG5cbiAgICAgICAgICAgIGxleGljb2dyYXBoaWNhbCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMubGV4aWNvZ3JhcGhpY2FsXG4gICAgICAgICAgICB6ZXJvRXh0ZW5kID0gb3B0aW9ucyBhbmQgb3B0aW9ucy56ZXJvRXh0ZW5kXG4gICAgICAgICAgICB2MXBhcnRzID0gdjEuc3BsaXQoXCIuXCIpXG4gICAgICAgICAgICB2MnBhcnRzID0gdjIuc3BsaXQoXCIuXCIpXG5cbiAgICAgICAgICAgIHJldHVybiBOYU4gaWYgbm90IHYxcGFydHMuZXZlcnkoaXNWYWxpZFBhcnQpIG9yIG5vdCB2MnBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KVxuXG4gICAgICAgICAgICBpZiB6ZXJvRXh0ZW5kXG4gICAgICAgICAgICAgICAgdjFwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYxcGFydHMubGVuZ3RoIDwgdjJwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICB2MnBhcnRzLnB1c2ggXCIwXCIgICAgd2hpbGUgdjJwYXJ0cy5sZW5ndGggPCB2MXBhcnRzLmxlbmd0aFxuXG4gICAgICAgICAgICB1bmxlc3MgbGV4aWNvZ3JhcGhpY2FsXG4gICAgICAgICAgICAgICAgdjFwYXJ0cyA9IHYxcGFydHMubWFwKE51bWJlcilcbiAgICAgICAgICAgICAgICB2MnBhcnRzID0gdjJwYXJ0cy5tYXAoTnVtYmVyKVxuXG4gICAgICAgICAgICBpID0gLTFcbiAgICAgICAgICAgIHdoaWxlIGkgPCB2MXBhcnRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICAgICAgaWYgdjJwYXJ0cy5sZW5ndGggPCBpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgaWYgdjFwYXJ0c1tpXSA9PSB2MnBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgZWxzZSBpZiB2MXBhcnRzW2ldID4gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjJwYXJ0c1tpXSA+IHYxcGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xXG5cbiAgICAgICAgICAgIHJldHVybiAtMSBpZiB2MXBhcnRzLmxlbmd0aCAhPSB2MnBhcnRzLmxlbmd0aFxuXG4gICAgICAgICAgICByZXR1cm4gMFxuXG4gICAgICAgIHN0cmluZzpcbiAgICAgICAgICAgIGNhcGl0YWxpemU6IChzdHIpIC0+XG4gICAgICAgICAgICAgICAgc3RyID0gKGlmIG5vdCBzdHI/IHRoZW4gXCJcIiBlbHNlIFN0cmluZyhzdHIpKVxuICAgICAgICAgICAgICAgIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKVxuXG4gICAgcmV0dXJuIFV0aWxzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIExvZ2dlcikgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgbG9nbGV2ZWwgPSByZXF1aXJlKCdsb2dsZXZlbCcpXG5cbiAgICAjIEV4cG9zZSB0aGUgTG9nZ2VyIEFQSVxuICAgIExvZ2dlciA9XG5cbiAgICAgICAgc2V0TGV2ZWw6IChsZXZlbCkgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnNldExldmVsKGxldmVsKVxuXG4gICAgICAgIHRyYWNlOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwudHJhY2UobXNnKVxuXG4gICAgICAgIGRlYnVnOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZGVidWcobXNnKVxuXG4gICAgICAgIGluZm86IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5pbmZvKG1zZylcblxuICAgICAgICB3YXJuOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwud2Fybihtc2cpXG5cbiAgICAgICAgZXJyb3I6IChtc2cpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5lcnJvcihtc2cpXG5cbiAgICByZXR1cm4gTG9nZ2VyXG4pIiwiIyMjKlxuICogVGhpcyB3aWxsIHByb3ZpZGUgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gZGVmaW5lIE1vZHVsZXNcbiAqIGFuZCBwcm92aWRlIGEgd2F5IHRvIGV4dGVuZCB0aGVtXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgTW9kdWxlKSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4uL2Jhc2UuY29mZmVlJylcblxuICAgICMgdGhpcyB3aWxsIHNlcnZlIGFzIHRoZSBiYXNlIGNsYXNzIGZvciBhIE1vZHVsZVxuICAgIGNsYXNzIE1vZHVsZVxuICAgICAgICBjb25zdHJ1Y3RvcjogKG9wdCkgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ID0gb3B0LnNhbmRib3hcbiAgICAgICAgICAgIEBvcHRpb25zID0gb3B0Lm9wdGlvbnNcbiAgICAgICAgICAgIEBzZXRFbGVtZW50KClcblxuXG4gICAgIyB0aGlzIGNsYXNzIHdpbGwgZXhwb3NlIHN0YXRpYyBtZXRob2RzIHRvIGFkZCwgZXh0ZW5kIGFuZFxuICAgICMgZ2V0IHRoZSBsaXN0IG9mIGFkZGVkIG1vZHVsZXNcbiAgICBjbGFzcyBNb2R1bGVzXG5cbiAgICAgICAgIyB0aGlzIHdpbGwgaG9sZCB0aGUgbGlzdCBvZiBhZGRlZCBtb2R1bGVzXG4gICAgICAgIEBsaXN0IDoge31cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGp1c3QgYW4gYWxpYXMgZm9yIHRoZSBleHRlbmQgbWV0aG9kXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmddfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBkZWZpbml0aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAYWRkIDogKG5hbWUsIGRlZmluaXRpb24pIC0+XG4gICAgICAgICAgICBAZXh0ZW5kKG5hbWUsIGRlZmluaXRpb24sIE1vZHVsZSlcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGdldHRlciBmb3IgcmV0cmlldmluZyBtb2R1bGVzIGRlZmluaXRpb25zXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmFtZVxuICAgICAgICAgKiBAcmV0dXJuIHtbRnVuY3Rpb24vdW5kZWZpbmVkXX1cbiAgICAgICAgIyMjXG4gICAgICAgIEBnZXQgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgQGxpc3RbbmFtZV1cbiAgICAgICAgICAgICAgICByZXR1cm4gQGxpc3RbbmFtZV1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiB0aGlzIHdpbGwgYWxsb3dzIHVzIHRvIHNpbXBsaWZ5IGFuZCBoYXZlIG1vcmUgY29udHJvbFxuICAgICAgICAgKiBvdmVyIGFkZGluZy9kZWZpbmluZyBtb2R1bGVzXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmddfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBkZWZpbml0aW9uXG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmcvRnVuY3Rpb25dfSBCYXNlQ2xhc3NcbiAgICAgICAgIyMjXG4gICAgICAgIEBleHRlbmQgOiAobmFtZSwgZGVmaW5pdGlvbiwgQmFzZUNsYXNzKSAtPlxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nKG5hbWUpIGFuZCBCYXNlLnV0aWwuaXNPYmplY3QoZGVmaW5pdGlvbilcbiAgICAgICAgICAgICAgICAjIGlmIG5vIEJhc2VDbGFzcyBpcyBwYXNzZWQsIGJ5IGRlZmF1bHQgd2UnbGwgdXNlIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IE1vZHVsZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBhcmUgcGFzc2luZyB0aGUgQmFzZUNsYXNzIGFzIGEgc3RyaW5nLCBpdCBtZWFucyB0aGF0IGNsYXNzXG4gICAgICAgICAgICAgICAgICAgICMgc2hvdWxkIGhhdmUgYmVlbiBhZGRlZCBwcmV2aW91c2x5LCBzbyB3ZSdsbCBsb29rIHVuZGVyIHRoZSBsaXN0IG9ialxuICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGNoZWNrIGlmIHRoZSBjbGFzcyBoYXMgYmVlbiBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBiYyA9IEBsaXN0W0Jhc2VDbGFzc11cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgdGhlIGRlZmluaXRpb24gZXhpc3RzLCBsZXRzIGFzc2lnbiBpdCB0byBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gYmNcbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgbm90LCBsZXRzIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tNb2R1bGUvICcrIG5hbWUgKycgXTogaXMgdHJ5aW5nIHRvIGV4dGVuZCBbJyArIEJhc2VDbGFzcyArICddIHdoaWNoIGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgICMgaWYgaXQgaXMgYSBmdW5jdGlvbiwgd2UnbGwgdXNlIGl0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgICAgICMgVE9ETzogZG8gc29tZSBjaGVja2luZyBiZWZvcmUgdHJ5aW5nIHRvIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gQmFzZUNsYXNzXG5cbiAgICAgICAgICAgICAgICBleHRlbmRlZENsYXNzID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IHRyeSB0byBhZGQgdGhpcyBkZWZpbml0aW9uIGluIGNhc2VcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmhhcyBAbGlzdCwgbmFtZVxuICAgICAgICAgICAgICAgICAgICAjIGV4dGVuZHMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kZWREZWZpbml0aW9uID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgdGhlIHJlZmVyZW5jZSBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgICAgICAgICAgICAgICAgQGxpc3RbbmFtZV0gPSBleHRlbmRlZERlZmluaXRpb25cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5kZWREZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAjIGluZm9ybSB0aGUgZGV2cyB0aGF0IHNvbWVvbmUgaXMgdHJ5aW5nIHRvIGFkZCBhIG1vZHVsZSdzXG4gICAgICAgICAgICAgICAgICAgICMgZGVmaW5pdGlvbiB0aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQ6JyArIG5hbWUgKyAnXSBoYXZlIGFscmVhZHkgYmVlbiBkZWZpbmVkJyBcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICBCYXNlLnV0aWwuZXh0ZW5kIE1vZHVsZTo6LCBCYXNlLkV2ZW50cyxcblxuICAgICAgICAjIHRoaXMgaGFzIHRvIGJlIG92ZXdyaXR0ZW4gYnkgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgIGluaXRpYWxpemU6ICgpIC0+XG4gICAgICAgICAgICBtc2cgPSAnW0NvbXBvbmVudC8nICsgQG9wdGlvbnMubmFtZSArICddOicgKyAnRG9lc25cXCd0IGhhdmUgYW4gaW5pdGlhbGl6ZSBtZXRob2QgZGVmaW5lZCdcbiAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgc2V0RWxlbWVudDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICAgICAgQGVsID0gQG9wdGlvbnMuZWxcbiAgICAgICAgICAgIEAkZWwgPSAkKEBlbClcblxuICAgICAgICAgICAgQGRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICBkZWxlZ2F0ZUV2ZW50czogKGV2ZW50cykgLT5cbiAgICAgICAgICAgICMgcmVnZXggdG8gc3BsaXQgdGhlIGV2ZW50cyBrZXkgKHNlcGFyYXRlcyB0aGUgZXZlbnQgZnJvbSB0aGUgc2VsZWN0b3IpXG4gICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC9cblxuICAgICAgICAgICAgIyBpZiB0aGUgZXZlbnRzIG9iamVjdCBpcyBub3QgZGVmaW5lZCBvciBwYXNzZWQgYXMgYSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICMgdGhlcmUgaXMgbm90aGluZyB0byBkbyBoZXJlXG4gICAgICAgICAgICByZXR1cm4gICAgdW5sZXNzIGV2ZW50cyBvciAoZXZlbnRzID0gQmFzZS51dGlsLnJlc3VsdChALCBcImV2ZW50c1wiKSlcbiAgICAgICAgICAgICMgYmVmb3JlIHRyeWluZyB0byBhdHRhY2ggbmV3IGV2ZW50cywgbGV0cyByZW1vdmUgYW55IHByZXZpb3VzXG4gICAgICAgICAgICAjIGF0dGFjaGVkIGV2ZW50XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIGZvciBrZXkgb2YgZXZlbnRzXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QgbmFtZVxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGV2ZW50c1trZXldXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QncyBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gQFtldmVudHNba2V5XV0gICAgdW5sZXNzIEJhc2UudXRpbC5pc0Z1bmN0aW9uKG1ldGhvZClcbiAgICAgICAgICAgICAgICBjb250aW51ZSAgICB1bmxlc3MgbWV0aG9kXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBrZXkubWF0Y2goZGVsZWdhdGVFdmVudFNwbGl0dGVyKVxuICAgICAgICAgICAgICAgIEBkZWxlZ2F0ZSBtYXRjaFsxXSwgbWF0Y2hbMl0sIEJhc2UudXRpbC5iaW5kKG1ldGhvZCwgQClcblxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICBkZWxlZ2F0ZTogKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSAtPlxuICAgICAgICAgICAgQCRlbC5vbiBldmVudE5hbWUgKyBcIi5wZXN0bGVFdmVudFwiICsgQG9wdGlvbnMuZ3VpZCwgc2VsZWN0b3IsIGxpc3RlbmVyXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgIHVuZGVsZWdhdGVFdmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAJGVsLm9mZignLnBlc3RsZUV2ZW50JyArIEBvcHRpb25zLmd1aWQpICAgIGlmIEAkZWxcbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgIyBieSBkZWZhdWx0LCBpdCB3aWxsIHJlbW92ZSBldmVudGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZVxuICAgICAgICAjICRlbCBmcm9tIHRoZSBET01cbiAgICAgICAgc3RvcDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlKCkgaWYgQCRlbFxuXG4gICAgIyBIZWxwZXJzXG4gICAgZXh0ZW5kID0gKHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSAtPlxuICAgICAgICBwYXJlbnQgPSBAXG5cbiAgICAgICAgIyBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBuZXcgc3ViY2xhc3MgaXMgZWl0aGVyIGRlZmluZWQgYnkgeW91XG4gICAgICAgICMgKHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgaW4geW91ciBgZXh0ZW5kYCBkZWZpbml0aW9uKSwgb3IgZGVmYXVsdGVkXG4gICAgICAgICMgYnkgdXMgdG8gc2ltcGx5IGNhbGwgdGhlIHBhcmVudCdzIGNvbnN0cnVjdG9yXG4gICAgICAgIGlmIHByb3RvUHJvcHMgYW5kIEJhc2UudXRpbC5oYXMocHJvdG9Qcm9wcywgXCJjb25zdHJ1Y3RvclwiKVxuICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoaWxkID0gLT5cbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwbHkgQCwgYXJndW1lbnRzXG5cbiAgICAgICAgIyBBZGQgc3RhdGljIHByb3BlcnRpZXMgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLCBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wc1xuXG4gICAgICAgICMgU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcbiAgICAgICAgIyBgcGFyZW50YCdzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAgICBTdXJyb2dhdGUgPSAtPlxuICAgICAgICAgICAgQGNvbnN0cnVjdG9yID0gY2hpbGRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIFN1cnJvZ2F0ZTo6ID0gcGFyZW50OjpcbiAgICAgICAgY2hpbGQ6OiA9IG5ldyBTdXJyb2dhdGVcblxuICAgICAgICAjIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuICAgICAgICAjIGlmIHN1cHBsaWVkLlxuICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIGNoaWxkOjosIHByb3RvUHJvcHMgICAgaWYgcHJvdG9Qcm9wc1xuXG4gICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGluaXRpYWxpemUgbWV0aG9kIHNvIGl0IGNhbiBiZSBjYWxsZWRcbiAgICAgICAgIyBmcm9tIGl0cyBjaGlsZHNcbiAgICAgICAgY2hpbGQ6Ol9zdXBlcl8gPSBwYXJlbnQ6OmluaXRpYWxpemVcblxuICAgICAgICByZXR1cm4gY2hpbGRcblxuICAgICMgU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGJhc2UgY2xhc3MgZm9yIG1vZHVsZXNcbiAgICBNb2R1bGVzLk1vZHVsZSA9IE1vZHVsZVxuXG4gICAgcmV0dXJuIE1vZHVsZXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVmVyc2lvbkNoZWNrZXIpIC0+XG5cbiAgICBsb2cgPSByZXF1aXJlICcuL2xvZ2dlci5jb2ZmZWUnXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBFeHBvc2UgVmVyc2lvbkNoZWNrZXIgQVBJXG4gICAgVmVyc2lvbkNoZWNrZXIgPVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogUmVjdXJzaXZlIG1ldGhvZCB0byBjaGVjayB2ZXJzaW9uaW5nIGZvciBhbGwgdGhlIGRlZmluZWQgbGlicmFyaWVzXG4gICAgICAgICAqIHdpdGhpbiB0aGUgZGVwZW5kZW5jeSBhcnJheVxuICAgICAgICAjIyNcbiAgICAgICAgY2hlY2s6IChkZXBlbmRlbmNpZXMpIC0+XG5cbiAgICAgICAgICAgIGlmIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBkcCA9IGRlcGVuZGVuY2llcy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICB1bmxlc3MgZHAub2JqXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IGRwLm5hbWUgKyBcIiBpcyBhIGhhcmQgZGVwZW5kZW5jeSBhbmQgaXQgaGFzIHRvIGJlIGxvYWRlZCBiZWZvcmUgcGVzdGxlLmpzXCJcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAgICAgIyBjb21wYXJlIHRoZSB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdW5sZXNzIFV0aWxzLnZlcnNpb25Db21wYXJlKGRwLnZlcnNpb24sIGRwLnJlcXVpcmVkKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyB0aGUgbG9hZGVkIGxpYnJhcnkgZG9lc3Qgbm90IGZ1bGZpbGwgb3VyIG5lZWRzXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW0ZBSUxdIFwiICsgZHAubmFtZSArIFwiOiB2ZXJzaW9uIHJlcXVpcmVkOiBcIiArIGRwLnJlcXVpcmVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgPC0tPiBMb2FkZWQgdmVyc2lvbjogXCIgKyBkcC52ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuXG4gICAgcmV0dXJuIFZlcnNpb25DaGVja2VyXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZpZXdwb3J0KSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICB2aWV3cG9ydCA9IHJlcXVpcmUoJ3ZlcmdlJylcblxuICAgICMgRXhwb3NlIFZpZXdwb3J0IGRldGVjdGlvbiBBUElcbiAgICBWaWV3cG9ydCA9XG5cbiAgICAgICAgdmlld3BvcnRXOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRXKClcblxuICAgICAgICB2aWV3cG9ydEg6IChrZXkpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydEgoKVxuXG4gICAgICAgIHZpZXdwb3J0OiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnQoKVxuXG4gICAgICAgIGluVmlld3BvcnQ6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluVmlld3BvcnQoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5YOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblgoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5ZOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblkoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgc2Nyb2xsWDogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnNjcm9sbFgoKVxuXG4gICAgICAgIHNjcm9sbFk6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxZKClcblxuICAgICAgICAjIFRvIHRlc3QgaWYgYSBtZWRpYSBxdWVyeSBpcyBhY3RpdmVcbiAgICAgICAgbXE6IChtZWRpYVF1ZXJ5U3RyaW5nKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQubXEobWVkaWFRdWVyeVN0cmluZylcblxuICAgICAgICByZWN0YW5nbGU6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnJlY3RhbmdsZShlbCwgY3VzaGlvbilcblxuICAgICAgICAjIGlmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgdGhlbiBpdCByZXR1cm5zIHRoZSBhc3BlY3RcbiAgICAgICAgIyByYXRpbyBvZiB0aGUgdmlld3BvcnQuIElmIGFuIGVsZW1lbnQgaXMgcGFzc2VkIGl0IHJldHVybnNcbiAgICAgICAgIyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBlbGVtZW50XG4gICAgICAgIGFzcGVjdDogKG8pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5hc3BlY3QobylcblxuICAgIHJldHVybiBWaWV3cG9ydFxuKSJdfQ==
