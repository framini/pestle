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
        this.allowedExtensions = ["jpg","gif","bmp","png","jpeg"];

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

        if (this.isExtensionAllowed(image)) {
            src = this.changeImageSrcToUseNewImageDimensions(this.buildUrlStructure(image.getAttribute('data-src'), image), computedWidth);
        } else {
            src = this.removeModifiersfromImageSrc(image.getAttribute('data-src'));
        }

        image.src = src;
    };

    Imager.prototype.removeModifiersfromImageSrc = function(src) {
        var regExp = new RegExp("\\/.*\\.(.*)\\/{width}\\/{pixel_ratio}?", "gi");
        return src.replace(regExp, '.$1');
    };

    Imager.prototype.isExtensionAllowed = function(image) {
        var imageExtension = this.getImageExtension(image);
        return imageExtension ? this.allowedExtensions.indexOf(imageExtension) > 0 : false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvY29yZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvY29va2llcy1qcy9kaXN0L2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvaW1hZ2VyLmpzL0ltYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9pc21vYmlsZWpzL2lzTW9iaWxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIm5vZGVfbW9kdWxlcy92ZXJnZS92ZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy93b2xmeTg3LWV2ZW50ZW1pdHRlci9FdmVudEVtaXR0ZXIuanMiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvZXh0ZW5zaW9uL2NvbXBvbmVudHMuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL25hdGdlby9wZXN0bGUvc3JjL2V4dGVuc2lvbi9yZXNwb25zaXZlZGVzaWduLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9jb29raWVzLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC9leHRtYW5hZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL2dlbmVyYWwuY29mZmVlIiwiL2hvbWUvZGlyaWdhcmF5L3Byb2plY3RzL25hdGdlby9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2RpcmlnYXJheS9wcm9qZWN0cy9uYXRnZW8vcGVzdGxlL3NyYy91dGlsL21vZHVsZS5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC92ZXJzaW9uY2hlY2tlci5jb2ZmZWUiLCIvaG9tZS9kaXJpZ2FyYXkvcHJvamVjdHMvbmF0Z2VvL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVBRmxDO0FBQUEsQ0FBRCxDQUFBLENBSUUsTUFKRixFQUlVLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUVOLE1BQUEsZ0JBQUE7QUFBQSxFQUFBLElBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUFiLENBQUE7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FEYixDQUFBO0FBQUEsRUFJQSxNQUFBLEdBQWEsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSmIsQ0FBQTtBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBTmhCLENBQUE7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBVGpCLENBQUE7QUFBQSxFQVdNLE1BQU0sQ0FBQztBQUVULG1CQUFBLE9BQUEsR0FBUyxP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUEsSUFlQSxHQUFBLEVBQUssU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO2FBQ0QsUUFBUSxDQUFDLEdBQVQsQ0FBYSxFQUFiLEVBQWlCLE9BQWpCLEVBREM7SUFBQSxDQWZMO0FBQUEsSUFrQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBbEJUO0FBQUEsSUFxQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBckJUO0FBQUEsSUF5QkEsRUFBQSxFQUFJLFNBQUMsZ0JBQUQsR0FBQTthQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksZ0JBQVosRUFEQTtJQUFBLENBekJKO0FBQUEsSUE0QkEsU0FBQSxFQUFXLFNBQUMsRUFBRCxFQUFLLE9BQUwsR0FBQTthQUNQLFFBQVEsQ0FBQyxTQUFULENBQW1CLEVBQW5CLEVBQXVCLE9BQXZCLEVBRE87SUFBQSxDQTVCWDtBQUFBLElBa0NBLE1BQUEsRUFBUSxTQUFDLENBQUQsR0FBQTthQUNKLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBREk7SUFBQSxDQWxDUjtHQUxKLENBQUE7QUEwQ0EsU0FBTyxRQUFQLENBN0NNO0FBQUEsQ0FKVixDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjKlxuICogVGhlIGNvcmUgbGF5ZXIgd2lsbCBkZXBlbmQgb24gdGhlIGJhc2UgbGF5ZXIgYW5kIHdpbGwgcHJvdmlkZVxuICogdGhlIGNvcmUgc2V0IG9mIGZ1bmN0aW9uYWxpdHkgdG8gYXBwbGljYXRpb24gZnJhbWV3b3JrXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuUGVzdGxlID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBQZXN0bGUpIC0+XG5cbiAgICBCYXNlICAgICAgID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vdXRpbC9leHRtYW5hZ2VyLmNvZmZlZScpXG5cbiAgICAjIHdlJ2xsIHVzZSB0aGUgUGVzdGxlIG9iamVjdCBhcyB0aGUgZ2xvYmFsIEV2ZW50IGJ1c1xuICAgIFBlc3RsZSA9IG5ldyBCYXNlLkV2ZW50cygpXG5cbiAgICBQZXN0bGUuTW9kdWxlID0gcmVxdWlyZSgnLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgUGVzdGxlLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgUGVzdGxlLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIHdpbGwgYmUgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgZXh0ZW5zaW9uOiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBleHRlbnNpb24gc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICAgICAgY29tcG9uZW50OiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBjb21wb25lbnQgc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuICAgICAgICAgICAgIyBpbml0aWFsaXplIHRoZSBjb25maWcgb2JqZWN0XG4gICAgICAgICAgICBAc2V0Q29uZmlnKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0aGlzIHdpbGwgdHJhY2sgdGhlIHN0YXRlIG9mIHRoZSBDb3JlLiBXaGVuIGl0IGlzXG4gICAgICAgICAgICAjIHRydWUsIGl0IG1lYW5zIHRoZSBcInN0YXJ0KClcIiBoYXMgYmVlbiBjYWxsZWRcbiAgICAgICAgICAgIEBzdGFydGVkID0gZmFsc2VcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kcyBkZWZpbmVkIGJ5IHRoZVxuICAgICAgICAgICAgIyBleHRlbnNpb25zXG4gICAgICAgICAgICBAc2FuZGJveCA9IEJhc2UudXRpbC5jbG9uZSBCYXNlXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZURlc2lnbiA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVkZXNpZ24uY29mZmVlJylcbiAgICAgICAgICAgIFJlc3BvbnNpdmVJbWFnZXMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9yZXNwb25zaXZlaW1hZ2VzLmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChSZXNwb25zaXZlRGVzaWduKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVJbWFnZXMpXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiB0aGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuJylcblxuICAgICAgICAjIHByb3ZpZGVzIGEgd2F5IGZvciBzZXR0aW5nIHVwIGNvbmZpZ3NcbiAgICAgICAgIyBhZnRlciBQZXN0bGUgaGFzIGJlZW4gaW5zdGFudGlhdGVkXG4gICAgICAgIHNldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc09iamVjdCBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBlbnRlciBoZXJlIGl0IG1lYW5zIFBlc3RsZSBoYXMgYmVlbiBhbHJlYWR5IGluaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgICAgICMgZHVyaW5nIGluc3RhbnRpYXRpb24sIHNvIHdlJ2xsIHVzZSB0aGUgY29uZmlnIG9iamVjdCBhcyBhXG4gICAgICAgICAgICAgICAgICAgICMgcHJvdmlkZXIgZm9yIGRlZmF1bHQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0VtcHR5IEBjb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMgY29uZmlnLCBAY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICMgaWYgaXQgaXMgZW1wdHksIGl0IG1lYW5zIHdlIGFyZSBnb2luZyBzZXR0aW5nIHVwIFBlc3RsZSBmb3JcbiAgICAgICAgICAgICAgICAgICAgIyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gXCJbc2V0Q29uZmlnIG1ldGhvZF0gb25seSBhY2NlcHQgYW4gb2JqZWN0IGFzIGEgcGFyYW1ldGVyIGFuZCB5b3UncmUgcGFzc2luZzogXCIgKyB0eXBlb2YgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKG1zZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlBlc3RsZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IHNldCB1cCBjb25maWdzIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG5vdCBzZXQgdXAgY29uZmlncyB3aGVuIFBlc3RsZSBoYXMgYWxyZWFkeSBzdGFydGVkLicpXG5cbiAgICAgICAgc2V0Q29tcG9uZW50Q29uZmlnOiAoY29tcCwgY29uZmlnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgXG4gICAgICAgICAgICAgICAgdW5sZXNzIGNvbXAgYW5kIEJhc2UudXRpbC5pc1N0cmluZyBjb21wXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW3NldENvbXBvbmVudENvbmZpZyBtZXRob2RdIDFzdCBwYXJhbSBzaG91bGQgYmUgYSBzdHJpbmcsIHlvdSdyZSBwYXNzaW5nOlwiICsgdHlwZW9mIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNPYmplY3QgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyBQZXN0bGUgaGFzIGJlZW4gYWxyZWFkeSBpbml0aWFsaXplZFxuICAgICAgICAgICAgICAgICAgICAjIGR1cmluZyBpbnN0YW50aWF0aW9uLCBzbyB3ZSdsbCB1c2UgdGhlIGNvbmZpZyBvYmplY3QgYXMgYVxuICAgICAgICAgICAgICAgICAgICAjIHByb3ZpZGVyIGZvciBkZWZhdWx0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNFbXB0eSBAY29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29uZmlnLmNvbXBvbmVudFtjb21wXSA9IEJhc2UudXRpbC5kZWZhdWx0cyBjb25maWcsIEBjb25maWcuY29tcG9uZW50W2NvbXBdXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbmZpZyA9IEBjb25maWcgb3Ige31cbiAgICAgICAgICAgICAgICAgICAgICAgIEBjb25maWcuY29tcG9uZW50W2NvbXBdID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZy5jb21wb25lbnRbY29tcF1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW3NldENvbXBvbmVudENvbmZpZyBtZXRob2RdIDJuZCBwYXJhbSBzaG91bGQgYmUgYW4gb2JqZWN0ICYgeW91J3JlIHBhc3Npbmc6XCIgKyB0eXBlb2YgY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yKG1zZylcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlBlc3RsZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjYW4gbm90IGFkZCBuZXcgZXh0ZW5zaW9ucyBhdCB0aGlzIHBvaW50LlwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbiBub3QgYWRkIGV4dGVuc2lvbnMgd2hlbiBQZXN0bGUgaGFzIGFscmVhZHkgc3RhcnRlZC4nKVxuXG4gICAgICAgIHN0YXJ0OiAoc2VsZWN0b3IgPSAnJykgLT5cblxuICAgICAgICAgICAgIyBTZXQgdGhlIGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBhcHBcbiAgICAgICAgICAgIEJhc2UubG9nLnNldExldmVsKEBjb25maWcuZGVidWcubG9nTGV2ZWwpXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIGxldCB1cyBpbml0aWFsaXplIGNvbXBvbmVudHMgYXQgYSBsYXRlciBzdGFnZVxuICAgICAgICAgICAgaWYgQHN0YXJ0ZWQgYW5kIHNlbGVjdG9yIGlzbnQgJydcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgaXMgaW5pdGlhbGl6aW5nIGEgY29tcG9uZW50XCIpXG5cbiAgICAgICAgICAgICAgICBAc2FuZGJveC5zdGFydENvbXBvbmVudHMgc2VsZWN0b3IsIEBcblxuXG4gICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUsIGl0IG1lYW5zIGl0IGlzIHRoZSBmaXN0IHRpbWUgdGhlIHN0YXJ0XG4gICAgICAgICAgICAjIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHdlJ2xsIGhhdmUgdG8gaW5pdGlhbGl6ZSBhbGwgdGhlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8oXCJQZXN0bGUgc3RhcnRlZCB0aGUgaW5pdGlhbGl6aW5nIHByb2Nlc3NcIilcblxuICAgICAgICAgICAgICAgIEBzdGFydGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmluaXQoQClcblxuICAgICAgICAgICAgICAgICMgQ2FsbGJhY2sgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWRcbiAgICAgICAgICAgICAgICAjIGFmdGVyIGFsbCBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIGFuZCB0aGUgZWFjaCBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAjIG1ldGhvZCBleGVjdXRlZFxuICAgICAgICAgICAgICAgIGNiID0gJC5DYWxsYmFja3MgXCJ1bmlxdWUgbWVtb3J5XCJcblxuICAgICAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgIyBOb3RlOiBUaGlzIG1ldGhvZCB3aWxsIGxldCBlYWNoIGV4dGVuc2lvbiB0byBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgc29tZSBjb2RlXG4gICAgICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChleHQsIGkpID0+XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXh0XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uKGV4dC5hZnRlckFwcFN0YXJ0ZWQpIGFuZCBleHQuYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBzaW5jZSB0aGUgY29tcG9uZW50IGV4dGVuc2lvbiBpcyB0aGUgZW50cnkgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGZvciBpbml0aWFsaXppbmcgdGhlIGFwcCwgd2UnbGwgZ2l2ZSBpdCBzcGVjaWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0cmVhdG1lbnQgYW5kIGdpdmUgaXQgdGhlIGFiaWxpdHkgdG8gcmVjZWl2ZSBhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZXh0cmEgcGFyYW1ldGVyICh0byBzdGFydCBjb21wb25lbnRzIHRoYXQgb25seSBiZWxvbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRvIGEgcGFydGljdWxhciBET00gZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBleHQub3B0aW9uS2V5IGlzIFwiY29tcG9uZW50c1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQgc2VsZWN0b3IsIEBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQoQClcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24oZXh0LmFmdGVyQXBwSW5pdGlhbGl6ZWQpIGFuZCBleHQuYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuYWRkIGV4dC5hZnRlckFwcEluaXRpYWxpemVkXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgdGhlIC5hZnRlckFwcEluaXRpYWxpemVkIGNhbGxiYWNrcyB3aXRoIEAgYXMgcGFyYW1ldGVyXG4gICAgICAgICAgICAgICAgY2IuZmlyZSBAXG5cbiAgICAgICAgY3JlYXRlU2FuZGJveDogKG5hbWUsIG9wdHMpIC0+XG4gICAgICAgICAgICBAc2FuZGJveGVzW25hbWVdID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQHNhbmRib3gsIG5hbWUgOiBuYW1lXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzOiAoKSAtPlxuICAgICAgICAgICAgQHNhbmRib3guZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzKClcblxuXG4gICAgcmV0dXJuIFBlc3RsZVxuKVxuIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4xXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLl9jYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGtleV07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmV4cGlyZXMgPSBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gLTEgOiBvcHRpb25zLmV4cGlyZXMpO1xyXG5cclxuICAgICAgICAgICAgQ29va2llcy5fZG9jdW1lbnQuY29va2llID0gQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmV4cGlyZSA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuc2V0KGtleSwgdW5kZWZpbmVkLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogb3B0aW9ucyAmJiBvcHRpb25zLnBhdGggfHwgQ29va2llcy5kZWZhdWx0cy5wYXRoLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBvcHRpb25zICYmIG9wdGlvbnMuZG9tYWluIHx8IENvb2tpZXMuZGVmYXVsdHMuZG9tYWluLFxyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogb3B0aW9ucyAmJiBvcHRpb25zLmV4cGlyZXMgfHwgQ29va2llcy5kZWZhdWx0cy5leHBpcmVzLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBvcHRpb25zICYmIG9wdGlvbnMuc2VjdXJlICE9PSB1bmRlZmluZWQgPyAgb3B0aW9ucy5zZWN1cmUgOiBDb29raWVzLmRlZmF1bHRzLnNlY3VyZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUgPSBmdW5jdGlvbiAoZXhwaXJlcywgbm93KSB7XHJcbiAgICAgICAgICAgIG5vdyA9IG5vdyB8fCBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IGV4cGlyZXMgPT09IEluZmluaXR5ID9cclxuICAgICAgICAgICAgICAgICAgICBDb29raWVzLl9tYXhFeHBpcmVEYXRlIDogbmV3IERhdGUobm93LmdldFRpbWUoKSArIGV4cGlyZXMgKiAxMDAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwaXJlcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXMgPSBuZXcgRGF0ZShleHBpcmVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cGlyZXMgJiYgIUNvb2tpZXMuX2lzVmFsaWREYXRlKGV4cGlyZXMpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BleHBpcmVzYCBwYXJhbWV0ZXIgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHZhbGlkIERhdGUgaW5zdGFuY2UnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGV4cGlyZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XHJcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb29raWVTdHJpbmcgPSBrZXkgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMucGF0aCA/ICc7cGF0aD0nICsgb3B0aW9ucy5wYXRoIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmRvbWFpbiA/ICc7ZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbiA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5leHBpcmVzID8gJztleHBpcmVzPScgKyBvcHRpb25zLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5zZWN1cmUgPyAnO3NlY3VyZScgOiAnJztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVTdHJpbmc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0Q2FjaGVGcm9tU3RyaW5nID0gZnVuY3Rpb24gKGRvY3VtZW50Q29va2llKSB7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVDYWNoZSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgY29va2llc0FycmF5ID0gZG9jdW1lbnRDb29raWUgPyBkb2N1bWVudENvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZUNhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsgY29va2llS3ZwLmtleV0gPSBjb29raWVLdnAudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVDYWNoZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGNvb2tpZVN0cmluZykge1xyXG4gICAgICAgICAgICAvLyBcIj1cIiBpcyBhIHZhbGlkIGNoYXJhY3RlciBpbiBhIGNvb2tpZSB2YWx1ZSBhY2NvcmRpbmcgdG8gUkZDNjI2NSwgc28gY2Fubm90IGBzcGxpdCgnPScpYFxyXG4gICAgICAgICAgICB2YXIgc2VwYXJhdG9ySW5kZXggPSBjb29raWVTdHJpbmcuaW5kZXhPZignPScpO1xyXG5cclxuICAgICAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcclxuICAgICAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cigwLCBzZXBhcmF0b3JJbmRleCkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29va2llc0V4cG9ydCA9IHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnID8gZmFjdG9yeShnbG9iYWwpIDogZmFjdG9yeTtcclxuXHJcbiAgICAvLyBBTUQgc3VwcG9ydFxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb29raWVzRXhwb3J0OyB9KTtcclxuICAgIC8vIENvbW1vbkpTL05vZGUuanMgc3VwcG9ydFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29va2llc0V4cG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpOyIsIjtcbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZGVmYXVsdFdpZHRocywgZ2V0S2V5cywgbmV4dFRpY2ssIGFkZEV2ZW50LCBnZXROYXR1cmFsV2lkdGg7XG5cbiAgICBuZXh0VGljayA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYXBwbHlFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrRWFjaCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgICAgIG5ld19jb2xsZWN0aW9uID0gW107XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb25baV0gPSBjYWxsYmFja0VhY2goY29sbGVjdGlvbltpXSwgaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3X2NvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0dXJuRGlyZWN0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldE5hdHVyYWxXaWR0aCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSwgJ25hdHVyYWxXaWR0aCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2UubmF0dXJhbFdpZHRoO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJRTggYW5kIGJlbG93IGxhY2tzIHRoZSBuYXR1cmFsV2lkdGggcHJvcGVydHlcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgaW1nLnNyYyA9IHNvdXJjZS5zcmM7XG4gICAgICAgICAgICByZXR1cm4gaW1nLndpZHRoO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICBhZGRFdmVudCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhZGRTdGFuZGFyZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuLCBmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZElFRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBmbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoKTtcblxuICAgIGRlZmF1bHRXaWR0aHMgPSBbOTYsIDEzMCwgMTY1LCAyMDAsIDIzNSwgMjcwLCAzMDQsIDM0MCwgMzc1LCA0MTAsIDQ0NSwgNDg1LCA1MjAsIDU1NSwgNTkwLCA2MjUsIDY2MCwgNjk1LCA3MzZdO1xuXG4gICAgZ2V0S2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5rZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICAgIENvbnN0cnVjdCBhIG5ldyBJbWFnZXIgaW5zdGFuY2UsIHBhc3NpbmcgYW4gb3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QuXG5cbiAgICAgICAgRXhhbXBsZSB1c2FnZTpcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEF2YWlsYWJsZSB3aWR0aHMgZm9yIHlvdXIgaW1hZ2VzXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBbTnVtYmVyXSxcblxuICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yIHRvIGJlIHVzZWQgdG8gbG9jYXRlIHlvdXIgZGl2IHBsYWNlaG9sZGVyc1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnJyxcblxuICAgICAgICAgICAgICAgIC8vIENsYXNzIG5hbWUgdG8gZ2l2ZSB5b3VyIHJlc2l6YWJsZSBpbWFnZXNcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gSWYgc2V0IHRvIHRydWUsIEltYWdlciB3aWxsIHVwZGF0ZSB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgcmVsZXZhbnQgaW1hZ2VzXG4gICAgICAgICAgICAgICAgb25SZXNpemU6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBUb2dnbGUgdGhlIGxhenkgbG9hZCBmdW5jdGlvbmFsaXR5IG9uIG9yIG9mZlxuICAgICAgICAgICAgICAgIGxhenlsb2FkOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAgICAgLy8gVXNlZCBhbG9uZ3NpZGUgdGhlIGxhenlsb2FkIGZlYXR1cmUgKGhlbHBzIHBlcmZvcm1hbmNlIGJ5IHNldHRpbmcgYSBoaWdoZXIgZGVsYXkpXG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsYXk6IE51bWJlclxuICAgICAgICAgICAgfVxuXG4gICAgICAgIEBwYXJhbSB7b2JqZWN0fSBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAgICAgIEByZXR1cm4ge29iamVjdH0gaW5zdGFuY2Ugb2YgSW1hZ2VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gSW1hZ2VyKGVsZW1lbnRzLCBvcHRzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGRvYyA9IGRvY3VtZW50O1xuXG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICAgIGlmIChlbGVtZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyBzZWxlY3RvciBzdHJpbmdcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5zZWxlY3RvciA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBhcmd1bWVudCBpcyB0aGUgYG9wdHNgIG9iamVjdCwgYGVsZW1lbnRzYCBpcyBpbXBsaWNpdGx5IHRoZSBgb3B0cy5zZWxlY3RvcmAgc3RyaW5nXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudHMubGVuZ3RoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wdHMgPSBlbGVtZW50cztcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuID0gW107XG4gICAgICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IG9wdHMuc2VsZWN0b3IgfHwgJy5kZWxheWVkLWltYWdlLWxvYWQnO1xuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IG9wdHMuY2xhc3NOYW1lIHx8ICdpbWFnZS1yZXBsYWNlJztcbiAgICAgICAgdGhpcy5naWYgPSBkb2MuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIHRoaXMuZ2lmLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhFQUFKQUlBQUFQLy8vd0FBQUNINUJBRUFBQUFBTEFBQUFBQVFBQWtBQUFJS2hJK3B5KzBQbzV5VUZRQTcnO1xuICAgICAgICB0aGlzLmdpZi5jbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgdGhpcy5naWYuYWx0ID0gJyc7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGVsYXkgPSBvcHRzLnNjcm9sbERlbGF5IHx8IDI1MDtcbiAgICAgICAgdGhpcy5vblJlc2l6ZSA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ29uUmVzaXplJykgPyBvcHRzLm9uUmVzaXplIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXp5bG9hZCA9IG9wdHMuaGFzT3duUHJvcGVydHkoJ2xhenlsb2FkJykgPyBvcHRzLmxhenlsb2FkIDogZmFsc2U7XG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyA9IG9wdHMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MgfHwgWzEsIDJdO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IG9wdHMuYXZhaWxhYmxlV2lkdGhzIHx8IGRlZmF1bHRXaWR0aHM7XG4gICAgICAgIHRoaXMub25JbWFnZXNSZXBsYWNlZCA9IG9wdHMub25JbWFnZXNSZXBsYWNlZCB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgICB0aGlzLndpZHRoc01hcCA9IHt9O1xuICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG4gICAgICAgIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IgPSBvcHRzLndpZHRoSW50ZXJwb2xhdG9yIHx8IHJldHVybkRpcmVjdFZhbHVlO1xuICAgICAgICB0aGlzLmRlbHRhU3F1YXJlID0gb3B0cy5kZWx0YVNxdWFyZSB8fCAxLjU7XG4gICAgICAgIHRoaXMuc3F1YXJlU2VsZWN0b3IgPSBvcHRzLnNxdWFyZVNlbGVjdG9yIHx8ICdzcXJjcm9wJztcbiAgICAgICAgdGhpcy5hZGFwdFNlbGVjdG9yID0gdGhpcy5hZGFwdFNlbGVjdG9yIHx8ICdhZGFwdCc7XG4gICAgICAgIHRoaXMuYWxsb3dlZEV4dGVuc2lvbnMgPSBbXCJqcGdcIixcImdpZlwiLFwiYm1wXCIsXCJwbmdcIixcImpwZWdcIl07XG5cbiAgICAgICAgLy8gTmVlZGVkIGFzIElFOCBhZGRzIGEgZGVmYXVsdCBgd2lkdGhgL2BoZWlnaHRgIGF0dHJpYnV0ZeKAplxuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgICAgICB0aGlzLmdpZi5yZW1vdmVBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocy5sZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwKHRoaXMuYXZhaWxhYmxlV2lkdGhzLCB0aGlzLndpZHRoSW50ZXJwb2xhdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aHNNYXAgPSB0aGlzLmF2YWlsYWJsZVdpZHRocztcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IGdldEtleXModGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVdpZHRocyA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGVsZW1lbnRzLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IGFwcGx5RWFjaChkb2MucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKSwgcmV0dXJuRGlyZWN0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuXG4gICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEltYWdlci5wcm90b3R5cGUuc2Nyb2xsQ2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IHRoaXMuaW1hZ2VzT2ZmU2NyZWVuLnNsaWNlKDApOyAvLyBjb3B5IGJ5IHZhbHVlLCBkb24ndCBjb3B5IGJ5IHJlZmVyZW5jZVxuICAgICAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4ubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHRoaXMuZGl2cyk7XG5cbiAgICAgICAgaWYgKHRoaXMub25SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJSZXNpemVFdmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eWxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJTY3JvbGxFdmVudCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY3JlYXRlR2lmID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGEgcmVzcG9uc2l2ZSBpbWFnZSB0aGVuIHdlIGRvbid0IHJlcGxhY2UgaXQgYWdhaW5cbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhefCApJyArIHRoaXMuY2xhc3NOYW1lICsgJyggfCQpJykpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtZW50Q2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnKTtcbiAgICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJyk7XG4gICAgICAgIHZhciBnaWYgPSB0aGlzLmdpZi5jbG9uZU5vZGUoZmFsc2UpO1xuXG4gICAgICAgIGlmIChlbGVtZW50V2lkdGgpIHtcbiAgICAgICAgICAgIGdpZi53aWR0aCA9IGVsZW1lbnRXaWR0aDtcbiAgICAgICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnLCBlbGVtZW50V2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2lmLmNsYXNzTmFtZSA9IChlbGVtZW50Q2xhc3NOYW1lID8gZWxlbWVudENsYXNzTmFtZSArICcgJyA6ICcnKSArIHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnYWx0JywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWx0JykgfHwgdGhpcy5naWYuYWx0KTtcblxuICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGdpZiwgZWxlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGdpZjtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgYXBwbHlFYWNoKHRoaXMuZGl2cywgZnVuY3Rpb24oZWxlbWVudCwgaSkge1xuICAgICAgICAgICAgaWYgKHNlbGYubGF6eWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1RoaXNFbGVtZW50T25TY3JlZW4oZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbWFnZXNPZmZTY3JlZW4ucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuZGl2c1tpXSA9IHNlbGYuY3JlYXRlR2lmKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmlzVGhpc0VsZW1lbnRPblNjcmVlbiA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3Agd2FzIHdvcmtpbmcgaW4gQ2hyb21lIGJ1dCBkaWRuJ3Qgd29yayBvbiBGaXJlZm94LCBzbyBoYWQgdG8gcmVzb3J0IHRvIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAvLyBidXQgY2FuJ3QgZmFsbGJhY2sgdG8gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgYXMgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUUgd2l0aCBhIGRvY3R5cGUgKD8pIHNvIGhhdmUgdG8gdXNlIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgdmFyIG9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0KCk7XG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0VG9wID0gMDtcblxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0VG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRPZmZzZXRUb3AgPCAodGhpcy52aWV3cG9ydEhlaWdodCArIG9mZnNldCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyA9IGZ1bmN0aW9uKGltYWdlcykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzaXppbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hQaXhlbFJhdGlvKCk7XG5cbiAgICAgICAgICAgIGFwcGx5RWFjaChpbWFnZXMsIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMoaW1hZ2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkKGltYWdlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZXBsYWNlSW1hZ2VzQmFzZWRPblNjcmVlbkRpbWVuc2lvbnMgPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICB2YXIgY29tcHV0ZWRXaWR0aCwgc3JjLCBuYXR1cmFsV2lkdGg7XG5cbiAgICAgICAgbmF0dXJhbFdpZHRoID0gZ2V0TmF0dXJhbFdpZHRoKGltYWdlKTtcbiAgICAgICAgY29tcHV0ZWRXaWR0aCA9IHR5cGVvZiB0aGlzLmF2YWlsYWJsZVdpZHRocyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuYXZhaWxhYmxlV2lkdGhzKGltYWdlKSA6IHRoaXMuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uKGltYWdlKTtcblxuICAgICAgICBpbWFnZS53aWR0aCA9IGNvbXB1dGVkV2lkdGg7XG5cbiAgICAgICAgaWYgKGltYWdlLnNyYyAhPT0gdGhpcy5naWYuc3JjICYmIGNvbXB1dGVkV2lkdGggPD0gbmF0dXJhbFdpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0V4dGVuc2lvbkFsbG93ZWQoaW1hZ2UpKSB7XG4gICAgICAgICAgICBzcmMgPSB0aGlzLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnModGhpcy5idWlsZFVybFN0cnVjdHVyZShpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyksIGltYWdlKSwgY29tcHV0ZWRXaWR0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzcmMgPSB0aGlzLnJlbW92ZU1vZGlmaWVyc2Zyb21JbWFnZVNyYyhpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlbW92ZU1vZGlmaWVyc2Zyb21JbWFnZVNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgICB2YXIgcmVnRXhwID0gbmV3IFJlZ0V4cChcIlxcXFwvLipcXFxcLiguKilcXFxcL3t3aWR0aH1cXFxcL3twaXhlbF9yYXRpb30/XCIsIFwiZ2lcIik7XG4gICAgICAgIHJldHVybiBzcmMucmVwbGFjZShyZWdFeHAsICcuJDEnKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pc0V4dGVuc2lvbkFsbG93ZWQgPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICB2YXIgaW1hZ2VFeHRlbnNpb24gPSB0aGlzLmdldEltYWdlRXh0ZW5zaW9uKGltYWdlKTtcbiAgICAgICAgcmV0dXJuIGltYWdlRXh0ZW5zaW9uID8gdGhpcy5hbGxvd2VkRXh0ZW5zaW9ucy5pbmRleE9mKGltYWdlRXh0ZW5zaW9uKSA+IDAgOiBmYWxzZTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5nZXRJbWFnZUV4dGVuc2lvbiA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKFwiXFxcXC8uKlxcXFwuKC4qKVxcXFwve3dpZHRofVxcXFwve3BpeGVsX3JhdGlvfT9cIiwgXCJnaVwiKTtcbiAgICAgICAgdmFyIG1hdGNoID0gcmVnRXhwLmV4ZWMoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiBcIlwiO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmRldGVybWluZUFwcHJvcHJpYXRlUmVzb2x1dGlvbiA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpIHx8IGltYWdlLnBhcmVudE5vZGUuY2xpZW50V2lkdGgsIHRoaXMuYXZhaWxhYmxlV2lkdGhzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvIHZhbHVlIHVzZWQgYnkgSW1hZ2VyXG4gICAgICpcbiAgICAgKiBJdCBpcyBwZXJmb3JtZWQgYmVmb3JlIGVhY2ggcmVwbGFjZW1lbnQgbG9vcCwgaW4gY2FzZSBhIHVzZXIgem9vbWVkIGluL291dFxuICAgICAqIGFuZCB0aHVzIHVwZGF0ZWQgdGhlIGB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb2AgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICovXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWZyZXNoUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIHJlZnJlc2hQaXhlbFJhdGlvKCkge1xuICAgICAgICB0aGlzLmRldmljZVBpeGVsUmF0aW8gPSBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKEltYWdlci5nZXRQaXhlbFJhdGlvKCksIHRoaXMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZUltYWdlU3JjVG9Vc2VOZXdJbWFnZURpbWVuc2lvbnMgPSBmdW5jdGlvbihzcmMsIHNlbGVjdGVkV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHNyY1xuICAgICAgICAgICAgLnJlcGxhY2UoL3t3aWR0aH0vZywgSW1hZ2VyLnRyYW5zZm9ybXMud2lkdGgoc2VsZWN0ZWRXaWR0aCwgdGhpcy53aWR0aHNNYXApKVxuICAgICAgICAgICAgLnJlcGxhY2UoL3twaXhlbF9yYXRpb30vZywgSW1hZ2VyLnRyYW5zZm9ybXMucGl4ZWxSYXRpbyh0aGlzLmRldmljZVBpeGVsUmF0aW8pKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5idWlsZFVybFN0cnVjdHVyZSA9IGZ1bmN0aW9uKHNyYywgaW1hZ2UpIHtcbiAgICAgICAgdmFyIHNxdWFyZVNlbGVjdG9yID0gdGhpcy5pc0ltYWdlQ29udGFpbmVyU3F1YXJlKGltYWdlKSA/ICcuJyArIHRoaXMuc3F1YXJlU2VsZWN0b3IgOiAnJztcblxuICAgICAgICB2YXIgcmVnRXhwID0gbmV3IFJlZ0V4cChcIlxcXFwuKFwiICsgdGhpcy5hbGxvd2VkRXh0ZW5zaW9ucy5qb2luKFwifFwiKSAgKyBcIilcXFxcLyh7d2lkdGh9KVxcXFwvKHtwaXhlbF9yYXRpb30pP1wiLCBcImdpXCIpO1xuXG4gICAgICAgIHJldHVybiBzcmMucmVwbGFjZShyZWdFeHAsICcuJyArIHRoaXMuYWRhcHRTZWxlY3RvciArICcuJDIuJDMnICsgc3F1YXJlU2VsZWN0b3IgKyAnLiQxJyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNJbWFnZUNvbnRhaW5lclNxdWFyZSA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiAoaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCAvIGltYWdlLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0KSA8PSB0aGlzLmRlbHRhU3F1YXJlXG4gICAgfTtcblxuICAgIEltYWdlci5nZXRQaXhlbFJhdGlvID0gZnVuY3Rpb24gZ2V0UGl4ZWxSYXRpbyhjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAoY29udGV4dCB8fCB3aW5kb3cpWydkZXZpY2VQaXhlbFJhdGlvJ10gfHwgMTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCA9IGZ1bmN0aW9uIGNyZWF0ZVdpZHRoc01hcCh3aWR0aHMsIGludGVycG9sYXRvcikge1xuICAgICAgICB2YXIgbWFwID0ge30sXG4gICAgICAgICAgICBpID0gd2lkdGhzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBtYXBbd2lkdGhzW2ldXSA9IGludGVycG9sYXRvcih3aWR0aHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnRyYW5zZm9ybXMgPSB7XG4gICAgICAgIHBpeGVsUmF0aW86IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiBmdW5jdGlvbih3aWR0aCwgbWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwW3dpZHRoXSB8fCB3aWR0aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbG9zZXN0IHVwcGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiB2YXIgY2FuZGlkYXRlcyA9IFsxLCAxLjUsIDJdO1xuICAgICAqXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgwLjgsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLCBjYW5kaWRhdGVzKTsgLy8gLT4gMVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMS4zLCBjYW5kaWRhdGVzKTsgLy8gLT4gMS41XG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgzLCBjYW5kaWRhdGVzKTsgLy8gLT4gMlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGFwaVxuICAgICAqIEBzaW5jZSAxLjAuMVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiYXNlVmFsdWVcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBjYW5kaWRhdGVzXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlID0gZnVuY3Rpb24gZ2V0Q2xvc2VzdFZhbHVlKGJhc2VWYWx1ZSwgY2FuZGlkYXRlcykge1xuICAgICAgICB2YXIgaSA9IGNhbmRpZGF0ZXMubGVuZ3RoLFxuICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaSAtIDFdO1xuXG4gICAgICAgIGJhc2VWYWx1ZSA9IHBhcnNlRmxvYXQoYmFzZVZhbHVlLCAxMCk7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGJhc2VWYWx1ZSA8PSBjYW5kaWRhdGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRXaWR0aDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWdpc3RlclJlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHNlbGYuZGl2cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyU2Nyb2xsRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxDaGVjaygpO1xuICAgICAgICB9LCBzZWxmLnNjcm9sbERlbGF5KTtcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXRHZW5lcmF0b3IgPSBmdW5jdGlvbiBnZXRQYWdlVmVydGljYWxPZmZzZXQodGVzdENhc2UpIHtcbiAgICAgICAgaWYgKHRlc3RDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZm9ybSBpcyB1c2VkIGJlY2F1c2UgaXQgc2VlbXMgaW1wb3NzaWJsZSB0byBzdHViIGB3aW5kb3cucGFnZVlPZmZzZXRgXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXQgPSBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvcihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwod2luZG93LCAncGFnZVlPZmZzZXQnKSk7XG5cbiAgICAvLyBFeHBvcnRpbmcgZm9yIHRlc3RpbmcgcHVycG9zZVxuICAgIEltYWdlci5hcHBseUVhY2ggPSBhcHBseUVhY2g7XG5cbiAgICAvKiBnbG9iYWwgbW9kdWxlLCBleHBvcnRzOiB0cnVlLCBkZWZpbmUgKi9cbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KUywganVzdCBleHBvcnRcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gSW1hZ2VyO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBJbWFnZXI7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gSWYgbm8gQU1EIGFuZCB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIsIGF0dGFjaCB0byB3aW5kb3dcbiAgICAgICAgd2luZG93LkltYWdlciA9IEltYWdlcjtcbiAgICB9XG4gICAgLyogZ2xvYmFsIC1tb2R1bGUsIC1leHBvcnRzLCAtZGVmaW5lICovXG5cbn0od2luZG93LCBkb2N1bWVudCkpOyIsIi8qKlxuICogaXNNb2JpbGUuanMgdjAuMy41XG4gKlxuICogQSBzaW1wbGUgbGlicmFyeSB0byBkZXRlY3QgQXBwbGUgcGhvbmVzIGFuZCB0YWJsZXRzLFxuICogQW5kcm9pZCBwaG9uZXMgYW5kIHRhYmxldHMsIG90aGVyIG1vYmlsZSBkZXZpY2VzIChsaWtlIGJsYWNrYmVycnksIG1pbmktb3BlcmEgYW5kIHdpbmRvd3MgcGhvbmUpLFxuICogYW5kIGFueSBraW5kIG9mIHNldmVuIGluY2ggZGV2aWNlLCB2aWEgdXNlciBhZ2VudCBzbmlmZmluZy5cbiAqXG4gKiBAYXV0aG9yOiBLYWkgTWFsbGVhIChrbWFsbGVhQGdtYWlsLmNvbSlcbiAqXG4gKiBAbGljZW5zZTogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXG4gICAgdmFyIGFwcGxlX3Bob25lICAgICAgICAgPSAvaVBob25lL2ksXG4gICAgICAgIGFwcGxlX2lwb2QgICAgICAgICAgPSAvaVBvZC9pLFxuICAgICAgICBhcHBsZV90YWJsZXQgICAgICAgID0gL2lQYWQvaSxcbiAgICAgICAgYW5kcm9pZF9waG9uZSAgICAgICA9IC8oPz0uKlxcYkFuZHJvaWRcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdBbmRyb2lkJyBBTkQgJ01vYmlsZSdcbiAgICAgICAgYW5kcm9pZF90YWJsZXQgICAgICA9IC9BbmRyb2lkL2ksXG4gICAgICAgIHdpbmRvd3NfcGhvbmUgICAgICAgPSAvSUVNb2JpbGUvaSxcbiAgICAgICAgd2luZG93c190YWJsZXQgICAgICA9IC8oPz0uKlxcYldpbmRvd3NcXGIpKD89LipcXGJBUk1cXGIpL2ksIC8vIE1hdGNoICdXaW5kb3dzJyBBTkQgJ0FSTSdcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeSAgICA9IC9CbGFja0JlcnJ5L2ksXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnlfMTAgPSAvQkIxMC9pLFxuICAgICAgICBvdGhlcl9vcGVyYSAgICAgICAgID0gL09wZXJhIE1pbmkvaSxcbiAgICAgICAgb3RoZXJfZmlyZWZveCAgICAgICA9IC8oPz0uKlxcYkZpcmVmb3hcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdGaXJlZm94JyBBTkQgJ01vYmlsZSdcbiAgICAgICAgc2V2ZW5faW5jaCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnKD86JyArICAgICAgICAgLy8gTm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnTmV4dXMgNycgKyAgICAgLy8gTmV4dXMgN1xuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0JOVFYyNTAnICsgICAgIC8vIEImTiBOb29rIFRhYmxldCA3IGluY2hcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdLaW5kbGUgRmlyZScgKyAvLyBLaW5kbGUgRmlyZVxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ1NpbGsnICsgICAgICAgIC8vIEtpbmRsZSBGaXJlLCBTaWxrIEFjY2VsZXJhdGVkXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnR1QtUDEwMDAnICsgICAgLy8gR2FsYXh5IFRhYiA3IGluY2hcblxuICAgICAgICAgICAgJyknLCAgICAgICAgICAgIC8vIEVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdpJyk7ICAgICAgICAgICAvLyBDYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nXG5cbiAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbihyZWdleCwgdXNlckFnZW50KSB7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHZhciBJc01vYmlsZUNsYXNzID0gZnVuY3Rpb24odXNlckFnZW50KSB7XG4gICAgICAgIHZhciB1YSA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgICAgIHRoaXMuYXBwbGUgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFwcGxlX3Bob25lLCB1YSksXG4gICAgICAgICAgICBpcG9kOiAgIG1hdGNoKGFwcGxlX2lwb2QsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2goYXBwbGVfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFwcGxlX3Bob25lLCB1YSkgfHwgbWF0Y2goYXBwbGVfaXBvZCwgdWEpIHx8IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5kcm9pZCA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiAhbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpICYmIG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSB8fCBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2luZG93cyA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2god2luZG93c19waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSkgfHwgbWF0Y2god2luZG93c190YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm90aGVyID0ge1xuICAgICAgICAgICAgYmxhY2tiZXJyeTogICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSksXG4gICAgICAgICAgICBibGFja2JlcnJ5MTA6IG1hdGNoKG90aGVyX2JsYWNrYmVycnlfMTAsIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgICAgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSxcbiAgICAgICAgICAgIGZpcmVmb3g6ICAgICAgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiAgICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpIHx8IG1hdGNoKG90aGVyX29wZXJhLCB1YSkgfHwgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V2ZW5faW5jaCA9IG1hdGNoKHNldmVuX2luY2gsIHVhKTtcbiAgICAgICAgdGhpcy5hbnkgPSB0aGlzLmFwcGxlLmRldmljZSB8fCB0aGlzLmFuZHJvaWQuZGV2aWNlIHx8IHRoaXMud2luZG93cy5kZXZpY2UgfHwgdGhpcy5vdGhlci5kZXZpY2UgfHwgdGhpcy5zZXZlbl9pbmNoO1xuICAgICAgICAvLyBleGNsdWRlcyAnb3RoZXInIGRldmljZXMgYW5kIGlwb2RzLCB0YXJnZXRpbmcgdG91Y2hzY3JlZW4gcGhvbmVzXG4gICAgICAgIHRoaXMucGhvbmUgPSB0aGlzLmFwcGxlLnBob25lIHx8IHRoaXMuYW5kcm9pZC5waG9uZSB8fCB0aGlzLndpbmRvd3MucGhvbmU7XG4gICAgICAgIC8vIGV4Y2x1ZGVzIDcgaW5jaCBkZXZpY2VzLCBjbGFzc2lmeWluZyBhcyBwaG9uZSBvciB0YWJsZXQgaXMgbGVmdCB0byB0aGUgdXNlclxuICAgICAgICB0aGlzLnRhYmxldCA9IHRoaXMuYXBwbGUudGFibGV0IHx8IHRoaXMuYW5kcm9pZC50YWJsZXQgfHwgdGhpcy53aW5kb3dzLnRhYmxldDtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgSU0gPSBuZXcgSXNNb2JpbGVDbGFzcygpO1xuICAgICAgICBJTS5DbGFzcyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgICAgIHJldHVybiBJTTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSXNNb2JpbGVDbGFzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9icm93c2VyaWZ5XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gaW5zdGFudGlhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvL0FNRFxuICAgICAgICBkZWZpbmUoZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xyXG4gICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgPyBub29wIDogc2VsZi5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXSA9IGxldmVsTmFtZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFBlcnNpc3RlZExldmVsKCkge1xyXG4gICAgICAgIHZhciBzdG9yZWRMZXZlbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvbG9nbGV2ZWw9KFteO10rKS8uZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKVsxXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICpcclxuICAgICAqIFB1YmxpYyBBUElcclxuICAgICAqXHJcbiAgICAgKi9cclxuXHJcbiAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xyXG5cclxuICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBsZXZlbCkge1xyXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XHJcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiLyohXHJcbiAqIHZlcmdlIDEuOS4xKzIwMTQwMjEzMDgwM1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcnlhbnZlL3ZlcmdlXHJcbiAqIE1JVCBMaWNlbnNlIDIwMTMgUnlhbiBWYW4gRXR0ZW5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ocm9vdCwgbmFtZSwgbWFrZSkge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSBtb2R1bGVbJ2V4cG9ydHMnXSA9IG1ha2UoKTtcclxuICBlbHNlIHJvb3RbbmFtZV0gPSBtYWtlKCk7XHJcbn0odGhpcywgJ3ZlcmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciB4cG9ydHMgPSB7fVxyXG4gICAgLCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvd1xyXG4gICAgLCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRcclxuICAgICwgZG9jRWxlbSA9IGRvYyAmJiBkb2MuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAsIG1hdGNoTWVkaWEgPSB3aW5bJ21hdGNoTWVkaWEnXSB8fCB3aW5bJ21zTWF0Y2hNZWRpYSddXHJcbiAgICAsIG1xID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKHEpIHtcclxuICAgICAgICByZXR1cm4gISFtYXRjaE1lZGlhLmNhbGwod2luLCBxKS5tYXRjaGVzO1xyXG4gICAgICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0VyA9IHhwb3J0c1sndmlld3BvcnRXJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudFdpZHRoJ10sIGIgPSB3aW5bJ2lubmVyV2lkdGgnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydEggPSB4cG9ydHNbJ3ZpZXdwb3J0SCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRIZWlnaHQnXSwgYiA9IHdpblsnaW5uZXJIZWlnaHQnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfTtcclxuICBcclxuICAvKiogXHJcbiAgICogVGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZS4gTGlrZSBNb2Rlcm5penIubXFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqLyAgXHJcbiAgeHBvcnRzWydtcSddID0gbXE7XHJcblxyXG4gIC8qKiBcclxuICAgKiBOb3JtYWxpemVkIG1hdGNoTWVkaWFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtNZWRpYVF1ZXJ5TGlzdHxPYmplY3R9XHJcbiAgICovIFxyXG4gIHhwb3J0c1snbWF0Y2hNZWRpYSddID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbWF0Y2hNZWRpYSBtdXN0IGJlIGJpbmRlZCB0byB3aW5kb3dcclxuICAgIHJldHVybiBtYXRjaE1lZGlhLmFwcGx5KHdpbiwgYXJndW1lbnRzKTtcclxuICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHcmFjZWZ1bGx5IGRlZ3JhZGUgdG8gcGxhaW4gb2JqZWN0XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHNpbmNlIDEuOC4wXHJcbiAgICogQHJldHVybiB7e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn19XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdmlld3BvcnQoKSB7XHJcbiAgICByZXR1cm4geyd3aWR0aCc6dmlld3BvcnRXKCksICdoZWlnaHQnOnZpZXdwb3J0SCgpfTtcclxuICB9XHJcbiAgeHBvcnRzWyd2aWV3cG9ydCddID0gdmlld3BvcnQ7XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFhcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxYJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0OyBcclxuICB9O1xyXG5cclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWVxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFknXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHt7dG9wOm51bWJlciwgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyLCBsZWZ0Om51bWJlcn19IGNvb3Jkc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiBhZGp1c3RtZW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZShjb29yZHMsIGN1c2hpb24pIHtcclxuICAgIHZhciBvID0ge307XHJcbiAgICBjdXNoaW9uID0gK2N1c2hpb24gfHwgMDtcclxuICAgIG9bJ3dpZHRoJ10gPSAob1sncmlnaHQnXSA9IGNvb3Jkc1sncmlnaHQnXSArIGN1c2hpb24pIC0gKG9bJ2xlZnQnXSA9IGNvb3Jkc1snbGVmdCddIC0gY3VzaGlvbik7XHJcbiAgICBvWydoZWlnaHQnXSA9IChvWydib3R0b20nXSA9IGNvb3Jkc1snYm90dG9tJ10gKyBjdXNoaW9uKSAtIChvWyd0b3AnXSA9IGNvb3Jkc1sndG9wJ10gLSBjdXNoaW9uKTtcclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3Jvc3MtYnJvd3NlciBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCBwbHVzIG9wdGlvbmFsIGN1c2hpb24uXHJcbiAgICogQ29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbCBlbGVtZW50IG9yIHN0YWNrICh1c2VzIGZpcnN0IGl0ZW0pXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uICsvLSBwaXhlbCBhZGp1c3RtZW50IGFtb3VudFxyXG4gICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlY3RhbmdsZShlbCwgY3VzaGlvbikge1xyXG4gICAgZWwgPSBlbCAmJiAhZWwubm9kZVR5cGUgPyBlbFswXSA6IGVsO1xyXG4gICAgaWYgKCFlbCB8fCAxICE9PSBlbC5ub2RlVHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGNhbGlicmF0ZShlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgY3VzaGlvbik7XHJcbiAgfVxyXG4gIHhwb3J0c1sncmVjdGFuZ2xlJ10gPSByZWN0YW5nbGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgdmlld3BvcnQgYXNwZWN0IHJhdGlvIChvciB0aGUgYXNwZWN0IHJhdGlvIG9mIGFuIG9iamVjdCBvciBlbGVtZW50KVxyXG4gICAqIEBzaW5jZSAxLjcuMFxyXG4gICAqIEBwYXJhbSB7KEVsZW1lbnR8T2JqZWN0KT19IG8gb3B0aW9uYWwgb2JqZWN0IHdpdGggd2lkdGgvaGVpZ2h0IHByb3BzIG9yIG1ldGhvZHNcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICogQGxpbmsgaHR0cDovL3czLm9yZy9UUi9jc3MzLW1lZGlhcXVlcmllcy8jb3JpZW50YXRpb25cclxuICAgKi9cclxuICBmdW5jdGlvbiBhc3BlY3Qobykge1xyXG4gICAgbyA9IG51bGwgPT0gbyA/IHZpZXdwb3J0KCkgOiAxID09PSBvLm5vZGVUeXBlID8gcmVjdGFuZ2xlKG8pIDogbztcclxuICAgIHZhciBoID0gb1snaGVpZ2h0J10sIHcgPSBvWyd3aWR0aCddO1xyXG4gICAgaCA9IHR5cGVvZiBoID09ICdmdW5jdGlvbicgPyBoLmNhbGwobykgOiBoO1xyXG4gICAgdyA9IHR5cGVvZiB3ID09ICdmdW5jdGlvbicgPyB3LmNhbGwobykgOiB3O1xyXG4gICAgcmV0dXJuIHcvaDtcclxuICB9XHJcbiAgeHBvcnRzWydhc3BlY3QnXSA9IGFzcGVjdDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHgtYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblgnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIucmlnaHQgPj0gMCAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHktYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblknXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblZpZXdwb3J0J10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgLy8gRXF1aXYgdG8gYGluWChlbCwgY3VzaGlvbikgJiYgaW5ZKGVsLCBjdXNoaW9uKWAgYnV0IGp1c3QgbWFudWFsbHkgZG8gYm90aCBcclxuICAgIC8vIHRvIGF2b2lkIGNhbGxpbmcgcmVjdGFuZ2xlKCkgdHdpY2UuIEl0IGd6aXBzIGp1c3QgYXMgc21hbGwgbGlrZSB0aGlzLlxyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIucmlnaHQgPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKSAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHhwb3J0cztcclxufSkpOyIsIi8qIVxuICogRXZlbnRFbWl0dGVyIHY0LjIuMTEgLSBnaXQuaW8vZWVcbiAqIFVubGljZW5zZSAtIGh0dHA6Ly91bmxpY2Vuc2Uub3JnL1xuICogT2xpdmVyIENhbGR3ZWxsIC0gaHR0cDovL29saS5tZS51ay9cbiAqIEBwcmVzZXJ2ZVxuICovXG5cbjsoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBtYW5hZ2luZyBldmVudHMuXG4gICAgICogQ2FuIGJlIGV4dGVuZGVkIHRvIHByb3ZpZGUgZXZlbnQgZnVuY3Rpb25hbGl0eSBpbiBvdGhlciBjbGFzc2VzLlxuICAgICAqXG4gICAgICogQGNsYXNzIEV2ZW50RW1pdHRlciBNYW5hZ2VzIGV2ZW50IHJlZ2lzdGVyaW5nIGFuZCBlbWl0dGluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fVxuXG4gICAgLy8gU2hvcnRjdXRzIHRvIGltcHJvdmUgc3BlZWQgYW5kIHNpemVcbiAgICB2YXIgcHJvdG8gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuICAgIHZhciBleHBvcnRzID0gdGhpcztcbiAgICB2YXIgb3JpZ2luYWxHbG9iYWxWYWx1ZSA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIGluZGV4IG9mIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGV2ZW50IGluIGl0cyBzdG9yYWdlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBsaXN0ZW5lcnMgQXJyYXkgb2YgbGlzdGVuZXJzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBsb29rIGZvci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdGVuZXIsIC0xIGlmIG5vdCBmb3VuZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnMsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBhIG1ldGhvZCB3aGlsZSBrZWVwaW5nIHRoZSBjb250ZXh0IGNvcnJlY3QsIHRvIGFsbG93IGZvciBvdmVyd3JpdGluZyBvZiB0YXJnZXQgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHRhcmdldCBtZXRob2QuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBhbGlhc2VkIG1ldGhvZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsaWFzKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFsaWFzQ2xvc3VyZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW25hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2lsbCBpbml0aWFsaXNlIHRoZSBldmVudCBvYmplY3QgYW5kIGxpc3RlbmVyIGFycmF5cyBpZiByZXF1aXJlZC5cbiAgICAgKiBXaWxsIHJldHVybiBhbiBvYmplY3QgaWYgeW91IHVzZSBhIHJlZ2V4IHNlYXJjaC4gVGhlIG9iamVjdCBjb250YWlucyBrZXlzIGZvciBlYWNoIG1hdGNoZWQgZXZlbnQuIFNvIC9iYVtyel0vIG1pZ2h0IHJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyBiYXIgYW5kIGJhei4gQnV0IG9ubHkgaWYgeW91IGhhdmUgZWl0aGVyIGRlZmluZWQgdGhlbSB3aXRoIGRlZmluZUV2ZW50IG9yIGFkZGVkIHNvbWUgbGlzdGVuZXJzIHRvIHRoZW0uXG4gICAgICogRWFjaCBwcm9wZXJ0eSBpbiB0aGUgb2JqZWN0IHJlc3BvbnNlIGlzIGFuIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXXxPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIHRoZSBldmVudC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoZXZ0KSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJldHVybiBhIGNvbmNhdGVuYXRlZCBhcnJheSBvZiBhbGwgbWF0Y2hpbmcgZXZlbnRzIGlmXG4gICAgICAgIC8vIHRoZSBzZWxlY3RvciBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgICAgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlW2tleV0gPSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGV2ZW50c1tldnRdIHx8IChldmVudHNbZXZ0XSA9IFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGxpc3RlbmVyIG9iamVjdHMgYW5kIGZsYXR0ZW5zIGl0IGludG8gYSBsaXN0IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W119IGxpc3RlbmVycyBSYXcgbGlzdGVuZXIgb2JqZWN0cy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfSBKdXN0IHRoZSBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICovXG4gICAgcHJvdG8uZmxhdHRlbkxpc3RlbmVycyA9IGZ1bmN0aW9uIGZsYXR0ZW5MaXN0ZW5lcnMobGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBmbGF0TGlzdGVuZXJzID0gW107XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZsYXRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZsYXRMaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIHJlcXVlc3RlZCBsaXN0ZW5lcnMgdmlhIGdldExpc3RlbmVycyBidXQgd2lsbCBhbHdheXMgcmV0dXJuIHRoZSByZXN1bHRzIGluc2lkZSBhbiBvYmplY3QuIFRoaXMgaXMgbWFpbmx5IGZvciBpbnRlcm5hbCB1c2UgYnV0IG90aGVycyBtYXkgZmluZCBpdCB1c2VmdWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgaW4gYW4gb2JqZWN0LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVyc0FzT2JqZWN0ID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgaWYgKGxpc3RlbmVycyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgcmVzcG9uc2VbZXZ0XSA9IGxpc3RlbmVycztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZSB8fCBsaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciBmdW5jdGlvbiB0byB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFRoZSBsaXN0ZW5lciB3aWxsIG5vdCBiZSBhZGRlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZS5cbiAgICAgKiBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGl0IGlzIGNhbGxlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSB0aGVuIHRoZSBsaXN0ZW5lciB3aWxsIGJlIGFkZGVkIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcklzV3JhcHBlZCA9IHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCc7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkgJiYgaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0ucHVzaChsaXN0ZW5lcklzV3JhcHBlZCA/IGxpc3RlbmVyIDoge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uY2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vbiA9IGFsaWFzKCdhZGRMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogU2VtaS1hbGlhcyBvZiBhZGRMaXN0ZW5lci4gSXQgd2lsbCBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmVcbiAgICAgKiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgYWZ0ZXIgaXRzIGZpcnN0IGV4ZWN1dGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkT25jZUxpc3RlbmVyID0gZnVuY3Rpb24gYWRkT25jZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZXZ0LCB7XG4gICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRPbmNlTGlzdGVuZXIuXG4gICAgICovXG4gICAgcHJvdG8ub25jZSA9IGFsaWFzKCdhZGRPbmNlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXZlbnQgbmFtZS4gVGhpcyBpcyByZXF1aXJlZCBpZiB5b3Ugd2FudCB0byB1c2UgYSByZWdleCB0byBhZGQgYSBsaXN0ZW5lciB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gSWYgeW91IGRvbid0IGRvIHRoaXMgdGhlbiBob3cgZG8geW91IGV4cGVjdCBpdCB0byBrbm93IHdoYXQgZXZlbnQgdG8gYWRkIHRvPyBTaG91bGQgaXQganVzdCBhZGQgdG8gZXZlcnkgcG9zc2libGUgbWF0Y2ggZm9yIGEgcmVnZXg/IE5vLiBUaGF0IGlzIHNjYXJ5IGFuZCBiYWQuXG4gICAgICogWW91IG5lZWQgdG8gdGVsbCBpdCB3aGF0IGV2ZW50IG5hbWVzIHNob3VsZCBiZSBtYXRjaGVkIGJ5IGEgcmVnZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudCA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50KGV2dCkge1xuICAgICAgICB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXNlcyBkZWZpbmVFdmVudCB0byBkZWZpbmUgbXVsdGlwbGUgZXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gZXZ0cyBBbiBhcnJheSBvZiBldmVudCBuYW1lcyB0byBkZWZpbmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnRzID0gZnVuY3Rpb24gZGVmaW5lRXZlbnRzKGV2dHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZUV2ZW50KGV2dHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnVuY3Rpb24gZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdoZW4gcGFzc2VkIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lLCBpdCB3aWxsIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIHJlbW92ZSBmcm9tIHRoZSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vZmYgPSBhbGlhcygncmVtb3ZlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBhZGQgdGhlIGFycmF5IG9mIGxpc3RlbmVycyB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICogWWVhaCwgdGhpcyBmdW5jdGlvbiBkb2VzIHF1aXRlIGEgYml0LiBUaGF0J3MgcHJvYmFibHkgYSBiYWQgdGhpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyhmYWxzZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIHJlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKHRydWUsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRWRpdHMgbGlzdGVuZXJzIGluIGJ1bGsuIFRoZSBhZGRMaXN0ZW5lcnMgYW5kIHJlbW92ZUxpc3RlbmVycyBtZXRob2RzIGJvdGggdXNlIHRoaXMgdG8gZG8gdGhlaXIgam9iLiBZb3Ugc2hvdWxkIHJlYWxseSB1c2UgdGhvc2UgaW5zdGVhZCwgdGhpcyBpcyBhIGxpdHRsZSBsb3dlciBsZXZlbC5cbiAgICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBkZXRlcm1pbmUgaWYgdGhlIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCAodHJ1ZSkgb3IgYWRkZWQgKGZhbHNlKS5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC9yZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1hbmlwdWxhdGUgdGhlIGxpc3RlbmVycyBvZiBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSBUcnVlIGlmIHlvdSB3YW50IHRvIHJlbW92ZSBsaXN0ZW5lcnMsIGZhbHNlIGlmIHlvdSB3YW50IHRvIGFkZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC9yZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ubWFuaXB1bGF0ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIG1hbmlwdWxhdGVMaXN0ZW5lcnMocmVtb3ZlLCBldnQsIGxpc3RlbmVycykge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICB2YXIgc2luZ2xlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lciA6IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgICAgIHZhciBtdWx0aXBsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXJzIDogdGhpcy5hZGRMaXN0ZW5lcnM7XG5cbiAgICAgICAgLy8gSWYgZXZ0IGlzIGFuIG9iamVjdCB0aGVuIHBhc3MgZWFjaCBvZiBpdHMgcHJvcGVydGllcyB0byB0aGlzIG1ldGhvZFxuICAgICAgICBpZiAodHlwZW9mIGV2dCA9PT0gJ29iamVjdCcgJiYgIShldnQgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5oYXNPd25Qcm9wZXJ0eShpKSAmJiAodmFsdWUgPSBldnRbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIHNpbmdsZSBsaXN0ZW5lciBzdHJhaWdodCB0aHJvdWdoIHRvIHRoZSBzaW5ndWxhciBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHBhc3MgYmFjayB0byB0aGUgbXVsdGlwbGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU28gZXZ0IG11c3QgYmUgYSBzdHJpbmdcbiAgICAgICAgICAgIC8vIEFuZCBsaXN0ZW5lcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBsaXN0ZW5lcnNcbiAgICAgICAgICAgIC8vIExvb3Agb3ZlciBpdCBhbmQgcGFzcyBlYWNoIG9uZSB0byB0aGUgbXVsdGlwbGUgbWV0aG9kXG4gICAgICAgICAgICBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBldnQsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gYSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGFuIGV2ZW50IHRoZW4gYWxsIGxpc3RlbmVycyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogVGhhdCBtZWFucyBldmVyeSBldmVudCB3aWxsIGJlIGVtcHRpZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWdleCB0byByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBbZXZ0XSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuIFdpbGwgcmVtb3ZlIGZyb20gZXZlcnkgZXZlbnQgaWYgbm90IHBhc3NlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2dCkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBldnQ7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZW1vdmUgZGlmZmVyZW50IHRoaW5ncyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIGV2dFxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW2V2dF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50cyBtYXRjaGluZyB0aGUgcmVnZXguXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gYWxsIGV2ZW50c1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVFdmVudC5cbiAgICAgKlxuICAgICAqIEFkZGVkIHRvIG1pcnJvciB0aGUgbm9kZSBBUEkuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlQWxsTGlzdGVuZXJzID0gYWxpYXMoJ3JlbW92ZUV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudCBvZiB5b3VyIGNob2ljZS5cbiAgICAgKiBXaGVuIGVtaXR0ZWQsIGV2ZXJ5IGxpc3RlbmVyIGF0dGFjaGVkIHRvIHRoYXQgZXZlbnQgd2lsbCBiZSBleGVjdXRlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYXJyYXkgdGhlbiB0aG9zZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgbGlzdGVuZXIgdXBvbiBleGVjdXRpb24uXG4gICAgICogQmVjYXVzZSBpdCB1c2VzIGBhcHBseWAsIHlvdXIgYXJyYXkgb2YgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzIGlmIHlvdSB3cm90ZSB0aGVtIG91dCBzZXBhcmF0ZWx5LlxuICAgICAqIFNvIHRoZXkgd2lsbCBub3QgYXJyaXZlIHdpdGhpbiB0aGUgYXJyYXkgb24gdGhlIG90aGVyIHNpZGUsIHRoZXkgd2lsbCBiZSBzZXBhcmF0ZS5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gT3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uIGVtaXRFdmVudChldnQsIGFyZ3MpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVyO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGxpc3RlbmVyc1trZXldLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHNoYWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGVpdGhlciB3aXRoIGEgYmFzaWMgY2FsbCBvciBhbiBhcHBseSBpZiB0aGVyZSBpcyBhbiBhcmdzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2tleV1baV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGxpc3RlbmVyLmxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgZW1pdEV2ZW50XG4gICAgICovXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdlbWl0RXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cbiAgICAgKiBBcyB3aXRoIGVtaXRFdmVudCwgeW91IGNhbiBwYXNzIGEgcmVnZXggaW4gcGxhY2Ugb2YgdGhlIGV2ZW50IG5hbWUgdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHsuLi4qfSBPcHRpb25hbCBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0ID0gZnVuY3Rpb24gZW1pdChldnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0RXZlbnQoZXZ0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWYgYVxuICAgICAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogYWZ0ZXIgZXhlY3V0aW9uLiBUaGlzIHZhbHVlIGRlZmF1bHRzIHRvIHRydWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25jZVJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZlxuICAgICAqIHRoZSBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhpcyBvbmUgdGhlbiBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4geyp8Qm9vbGVhbn0gVGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgZm9yIG9yIHRoZSBkZWZhdWx0LCB0cnVlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBfZ2V0T25jZVJldHVyblZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX29uY2VSZXR1cm5WYWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZXZlbnRzIG9iamVjdCBhbmQgY3JlYXRlcyBvbmUgaWYgcmVxdWlyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgZ2xvYmFsIHtAbGluayBFdmVudEVtaXR0ZXJ9IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGlzIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTm9uIGNvbmZsaWN0aW5nIEV2ZW50RW1pdHRlciBjbGFzcy5cbiAgICAgKi9cbiAgICBFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gb3JpZ2luYWxHbG9iYWxWYWx1ZTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIjIyMqXG4gKiBUaGUgcHVycG9zZSBvZiB0aGlzIGxheWVyIGlzIHRvIGRlY2xhcmUgYW5kIGFic3RyYWN0IHRoZSBhY2Nlc3MgdG9cbiAqIHRoZSBjb3JlIGJhc2Ugb2YgbGlicmFyaWVzIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIHN0YWNrICh0aGUgYXBwIGZyYW1ld29yaylcbiAqIHdpbGwgZGVwZW5kLlxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEJhc2UpIC0+XG5cbiAgICAjIEFycmF5IHRoYXQgaG9sZHMgaGFyZCBkZXBlbmRlbmNpZXMgZm9yIHRoZSBTREtcbiAgICBkZXBlbmRlbmNpZXMgPSBbXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJqUXVlcnlcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuMTBcIiAjIHJlcXVpcmVkIHZlcnNpb25cbiAgICAgICAgICAgIFwib2JqXCI6IHJvb3QuJCAjIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBpZiByb290LiQgdGhlbiByb290LiQuZm4uanF1ZXJ5IGVsc2UgMCAjIGdpdmVzIHRoZSB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIG9mIHRoZSBsb2FkZWQgbGliXG4gICAgICAgICxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIlVuZGVyc2NvcmVcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuNy4wXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290Ll8gIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC5fIHRoZW4gcm9vdC5fLlZFUlNJT04gZWxzZSAwXG4gICAgXVxuXG4gICAgIyBWZXJzaW9uIGNoZWNrZXIgdXRpbFxuICAgIFZlcnNpb25DaGVja2VyID0gcmVxdWlyZSAnLi91dGlsL3ZlcnNpb25jaGVja2VyLmNvZmZlZSdcblxuICAgICMgSW4gY2FzZSBhbnkgb2Ygb3VyIGRlcGVuZGVuY2llcyB3ZXJlIG5vdCBsb2FkZWQsIG9yIGl0cyB2ZXJzaW9uIGRvZXN0IG5vdCBjb3JyZXNwb25kIHRvIG91cnNcbiAgICAjIG5lZWRzLCB0aGUgdmVyc2lvbkNoZWNrZXIgd2lsbCB0aG9ydyBhbiBlcnJvciBleHBsYWluaW5nIHdoeVxuICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuICAgICMgTG9nZ2VyXG4gICAgQmFzZS5sb2cgPSByZXF1aXJlICcuL3V0aWwvbG9nZ2VyLmNvZmZlZSdcblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIEJhc2UuZGV2aWNlID0gcmVxdWlyZSAnLi91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIENvb2tpZXMgQVBJXG4gICAgQmFzZS5jb29raWVzID0gcmVxdWlyZSAnLi91dGlsL2Nvb2tpZXMuY29mZmVlJ1xuXG4gICAgIyBWaWV3cG9ydCBkZXRlY3Rpb25cbiAgICBCYXNlLnZwID0gcmVxdWlyZSAnLi91dGlsL3ZpZXdwb3J0ZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgRnVuY3Rpb24gdGhhdCBpcyBnb25uYSBoYW5kbGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICBCYXNlLkltYWdlciA9IHJlcXVpcmUgJ2ltYWdlci5qcydcblxuICAgICMgRXZlbnQgQnVzXG4gICAgQmFzZS5FdmVudHMgPSByZXF1aXJlICcuL3V0aWwvZXZlbnRidXMuY29mZmVlJ1xuXG4gICAgIyBHZW5lcmFsIFV0aWxzXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL3V0aWwvZ2VuZXJhbC5jb2ZmZWUnXG5cbiAgICAjIFV0aWxzXG4gICAgQmFzZS51dGlsID0gcm9vdC5fLmV4dGVuZCBVdGlscywgcm9vdC5fXG5cbiAgICByZXR1cm4gQmFzZVxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlICAgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcbiAgICBNb2R1bGUgPSByZXF1aXJlKCcuLy4uL3V0aWwvbW9kdWxlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBDb21wb25lbnRcblxuICAgICAgICAjIG9iamVjdCB0byBzdG9yZSBpbml0aWFsaXplZCBjb21wb25lbnRzXG4gICAgICAgIEBpbml0aWFsaXplZENvbXBvbmVudHMgOiB7fVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogc3RhcnRBbGwgbWV0aG9kXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgbG9vayBmb3IgY29tcG9uZW50cyB0byBzdGFydCB3aXRoaW4gdGhlIHBhc3NlZCBzZWxlY3RvclxuICAgICAgICAgKiBhbmQgY2FsbCB0aGVpciAuaW5pdGlhbGl6ZSgpIG1ldGhvZFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgPSAnYm9keScuIENTUyBzZWxlY3RvciB0byB0ZWxsIHRoZSBhcHAgd2hlcmUgdG8gbG9vayBmb3IgY29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBAc3RhcnRBbGw6IChzZWxlY3RvciA9ICdib2R5JywgYXBwLCBuYW1lc3BhY2UgPSBQZXN0bGUubW9kdWxlcykgLT5cblxuICAgICAgICAgICAgY29tcG9uZW50cyA9IENvbXBvbmVudC5wYXJzZShzZWxlY3RvciwgYXBwLmNvbmZpZy5uYW1lc3BhY2UpXG5cbiAgICAgICAgICAgIGNtcGNsb25lID0gQmFzZS51dGlsLmNsb25lIGNvbXBvbmVudHNcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIlBhcnNlZCBjb21wb25lbnRzXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIGNtcGNsb25lXG5cbiAgICAgICAgICAgICMgYWRkZWQgdG8ga2VlcCBuYW1lc3BhY2UuTkFNRSA9IERFRklOSVRJT04gc2ludGF4LiBUaGlzIHdpbGwgZXh0ZW5kXG4gICAgICAgICAgICAjIHRoZSBvYmplY3QgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICMgdGhpcyBtaWdodCBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHVubGVzcyBCYXNlLnV0aWwuaXNFbXB0eSBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlLCAoZGVmaW5pdGlvbiwgbmFtZSkgLT5cbiAgICAgICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5pc0Z1bmN0aW9uIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIE1vZHVsZS5leHRlbmQgbmFtZSwgZGVmaW5pdGlvblxuXG4gICAgICAgICAgICAjIGdyYWIgYSByZWZlcmVuY2Ugb2YgYWxsIHRoZSBtb2R1bGUgZGVmaW5lZCB1c2luZyB0aGUgTW9kdWxlLmFkZFxuICAgICAgICAgICAgIyBtZXRob2QuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIG5hbWVzcGFjZSwgUGVzdGxlLk1vZHVsZS5saXN0XG5cbiAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYWxsOiBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzXG4gICAgICAgICAgICAgICAgbmV3OiBjbXBjbG9uZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogdGhlIHBhcnNlIG1ldGhvZCB3aWxsIGxvb2sgZm9yIGNvbXBvbmVudHMgZGVmaW5lZCB1c2luZ1xuICAgICAgICAgKiB0aGUgY29uZmlndXJlZCBuYW1lc3BhY2UgYW5kIGxpdmluZyB3aXRoaW4gdGhlIHBhc3NlZFxuICAgICAgICAgKiBDU1Mgc2VsZWN0b3JcbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvciAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG5hbWVzcGFjZSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgIyMjXG4gICAgICAgIEBwYXJzZTogKHNlbGVjdG9yLCBuYW1lc3BhY2UpIC0+XG4gICAgICAgICAgICAjIGFycmF5IHRvIHN0b3JlIHBhcnNlZCBjb21wb25lbnRzXG4gICAgICAgICAgICBsaXN0ID0gW11cblxuICAgICAgICAgICAgIyBpZiBhbiBhcnJheSBpcyBwYXNzZWQsIHVzZSBpdCBhcyBpdCBpc1xuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzQXJyYXkgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZVxuICAgICAgICAgICAgIyBpZiBhIHN0cmluZyBpcyBwYXNzZWQgYXMgcGFyYW1ldGVyLCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5XG4gICAgICAgICAgICBlbHNlIGlmIEJhc2UudXRpbC5pc1N0cmluZyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2VzID0gbmFtZXNwYWNlLnNwbGl0ICcsJ1xuXG4gICAgICAgICAgICAjIGFycmF5IHRvIHN0b3JlIHRoZSBjb21wb3NlZCBjc3Mgc2VsZWN0b3IgdGhhdCB3aWxsIGxvb2sgdXAgZm9yXG4gICAgICAgICAgICAjIGNvbXBvbmVudCBkZWZpbml0aW9uc1xuICAgICAgICAgICAgY3NzU2VsZWN0b3JzID0gW11cblxuICAgICAgICAgICAgIyBpdGVyYXRlcyBvdmVyIHRoZSBuYW1lc3BhY2UgYXJyYXkgYW5kIGNyZWF0ZSB0aGUgbmVlZGVkIGNzcyBzZWxlY3RvcnNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGNvbXAgYWxyZWFkeSBoYXMgdGhlIHBlc3RsZS1ndWlkIGF0dGFjaGVkLCBpdCBtZWFuc1xuICAgICAgICAgICAgICAgICMgaXQgd2FzIGFscmVhZHkgc3RhcnRlZCwgc28gd2UnbGwgb25seSBsb29rIGZvciB1bm5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAjIGNvbXBvbmVudHMgaGVyZVxuICAgICAgICAgICAgICAgIHVubGVzcyAkKGNvbXApLmRhdGEoJ3Blc3RsZS1ndWlkJylcblxuICAgICAgICAgICAgICAgICAgICBucyA9IGRvICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBUaGlzIHdheSB3ZSBvYnRhaW4gdGhlIG5hbWVzcGFjZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAkKGNvbXApLmRhdGEobnMgKyBcIi1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbnNcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVxuXG4gICAgICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogYXR0cmlidXRlcyByZWxhdGVkIHRvIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKHsgbmFtZTogb3B0aW9ucy5uYW1lLCBvcHRpb25zOiBvcHRpb25zIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0XG5cbiAgICAgICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGluIGNoYXJnZSBvZiBwYXJzaW5nIGFsbCB0aGUgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgIyBkZWZpbmVkIGluIHRoZSBpdHMgJGVsIG1hcmt1cCBhbmQgcGxhY2luZyB0aGVtIGluIGEgb2JqZWN0XG4gICAgICAgIEBwYXJzZUNvbXBvbmVudE9wdGlvbnM6IChlbCwgbmFtZXNwYWNlLCBvcHRzKSAtPlxuICAgICAgICAgICAgb3B0aW9ucyA9IEJhc2UudXRpbC5jbG9uZShvcHRzIHx8IHt9KVxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsXG5cbiAgICAgICAgICAgICMgVE9ETzogYWNjZXNzIHRoaXMgRE9NIGZ1bmN0aW9uIHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgZGF0YSA9ICQoZWwpLmRhdGEoKVxuICAgICAgICAgICAgbmFtZSA9ICcnXG4gICAgICAgICAgICBsZW5ndGggPSAwXG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIGRhdGEsICh2LCBrKSAtPlxuXG4gICAgICAgICAgICAgICAgIyByZW1vdmVzIHRoZSBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICBrID0gay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBuYW1lc3BhY2UpLCBcIlwiKVxuXG4gICAgICAgICAgICAgICAgIyBkZWNhbWVsaXplIHRoZSBvcHRpb24gbmFtZVxuICAgICAgICAgICAgICAgIGsgPSBrLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgay5zbGljZSgxKVxuXG4gICAgICAgICAgICAgICAgIyBpZiB0aGUga2V5IGlzIGRpZmZlcmVudCBmcm9tIFwiY29tcG9uZW50XCIgaXQgbWVhbnMgaXQgaXNcbiAgICAgICAgICAgICAgICAjIGFuIG9wdGlvbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIGsgIT0gXCJjb21wb25lbnRcIlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tdID0gdlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGgrK1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IHZcblxuICAgICAgICAgICAgIyBhZGQgb25lIGJlY2F1c2Ugd2UndmUgYWRkZWQgJ2VsJyBhdXRvbWF0aWNhbGx5IGFzIGFuIGV4dHJhIG9wdGlvblxuICAgICAgICAgICAgb3B0aW9ucy5sZW5ndGggPSBsZW5ndGggKyAxXG5cbiAgICAgICAgICAgICMgYnVpbGQgYWQgcmV0dXJuIHRoZSBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgICBDb21wb25lbnQuYnVpbGRPcHRpb25zT2JqZWN0KG5hbWUsIG9wdGlvbnMpXG5cblxuICAgICAgICBAYnVpbGRPcHRpb25zT2JqZWN0OiAobmFtZSwgb3B0aW9ucykgLT5cblxuICAgICAgICAgICAgb3B0aW9ucy5uYW1lID0gbmFtZVxuXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG4gICAgICAgIEBpbnN0YW50aWF0ZTogKGNvbXBvbmVudHMsIGFwcCkgLT5cblxuICAgICAgICAgICAgaWYgY29tcG9uZW50cy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBtID0gY29tcG9uZW50cy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENoZWNrIGlmIHRoZSBtb2R1bGVzIGFyZSBkZWZpbmVkIHVzaW5nIHRoZSBtb2R1bGVzIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgICMgVE9ETzogUHJvdmlkZSBhbiBhbHRlcm5hdGUgd2F5IHRvIGRlZmluZSB0aGVcbiAgICAgICAgICAgICAgICAjIGdsb2JhbCBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eShQZXN0bGUubW9kdWxlcykgYW5kIFBlc3RsZS5tb2R1bGVzW20ubmFtZV0gYW5kIG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2QgPSBQZXN0bGUubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBnZW5lcmF0ZXMgYW4gdW5pcXVlIGd1aWQgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbS5vcHRpb25zLmd1aWQgPSBCYXNlLnV0aWwudW5pcXVlSWQobS5uYW1lICsgXCJfXCIpXG5cbiAgICAgICAgICAgICAgICAgICAgbS5vcHRpb25zLl9fZGVmYXVsdHNfXyA9IGFwcC5jb25maWcuY29tcG9uZW50W20ubmFtZV1cblxuICAgICAgICAgICAgICAgICAgICAjIGluamVjdCB0aGUgc2FuZGJveCBhbmQgdGhlIG9wdGlvbnMgaW4gdGhlIG1vZHVsZSBwcm90b1xuICAgICAgICAgICAgICAgICAgICAjIEJhc2UudXRpbC5leHRlbmQgbW9kLCBzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBtb2R4ID0gbmV3IG1vZChzYW5kYm94IDogc2IsIG9wdGlvbnM6IG0ub3B0aW9ucylcblxuICAgICAgICAgICAgICAgICAgICAjIGluaXQgdGhlIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBtb2R4LmluaXRpYWxpemUoKVxuXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2Ugb2YgdGhlIGdlbmVyYXRlZCBndWlkIG9uIHRoZSBlbFxuICAgICAgICAgICAgICAgICAgICAkKG0ub3B0aW9ucy5lbCkuZGF0YSAncGVzdGxlLWd1aWQnLCBtLm9wdGlvbnMuZ3VpZFxuXG4gICAgICAgICAgICAgICAgICAgICMgc2F2ZXMgYSByZWZlcmVuY2Ugb2YgdGhlIGluaXRpYWxpemVkIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzWyBtLm9wdGlvbnMuZ3VpZCBdID0gbW9keFxuXG4gICAgICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBDb21wb25lbnQgZXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSB7fVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyA9IChzZWxlY3RvciwgYXBwKSAtPlxuXG4gICAgICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSBDb21wb25lbnQuc3RhcnRBbGwoc2VsZWN0b3IsIGFwcClcblxuICAgICAgICBhcHAuc2FuZGJveC5nZXRJbml0aWFsaXplZENvbXBvbmVudHMgPSAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZWRDb21wb25lbnRzLmFsbFxuXG4gICAgICAgIGFwcC5zYW5kYm94LmdldExhc3Rlc3RJbml0aWFsaXplZENvbXBvbmVudHMgPSAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZWRDb21wb25lbnRzLm5ld1xuXG5cbiAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBsb2FkZWRcbiAgICBhZnRlckFwcFN0YXJ0ZWQ6IChzZWxlY3RvciwgYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJDYWxsaW5nIHN0YXJ0Q29tcG9uZW50cyBmcm9tIGFmdGVyQXBwU3RhcnRlZFwiXG4gICAgICAgIHMgPSBpZiBzZWxlY3RvciB0aGVuIHNlbGVjdG9yIGVsc2UgbnVsbFxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMocywgYXBwKVxuXG4gICAgbmFtZTogJ0NvbXBvbmVudCBFeHRlbnNpb24nXG5cbiAgICAjIHRoaXMgcHJvcGVydHkgd2lsbCBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgIyB0byB2YWxpZGF0ZSB0aGUgQ29tcG9uZW50IGNsYXNzIGluIGlzb2xhdGlvblxuICAgIGNsYXNzZXMgOiBDb21wb25lbnRcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAnY29tcG9uZW50cydcbilcbiIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgdHJpZ2dlcmluZyBldmVudHMgb25jZSB0aGUgRGV2aWNlIGluIHdoaWNoIHRoZVxuICogdXNlciBpcyBuYXZpZ2F0aW5nIHRoZSBzaXRlIGlzIGRldGVjdGVkLiBJdHMgZnVjaW9uYWxpdHkgbW9zdGx5IGRlcGVuZHNcbiAqIG9uIHRoZSBjb25maWd1cmF0aW9ucyBzZXR0aW5ncyAocHJvdmlkZWQgYnkgZGVmYXVsdCwgYnV0IHRoZXkgY2FuIGJlIG92ZXJyaWRlbilcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIFJlc3BvbnNpdmVEZXNpZ25cblxuICAgICAgICBjZmcgOlxuICAgICAgICAgICAgIyBUaGlzIGxpbWl0IHdpbGwgYmUgdXNlZCB0byBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAjIHdoZW4gdGhlIHVzZXIgcmVzaXplIHRoZSB3aW5kb3dcbiAgICAgICAgICAgIHdhaXRMaW1pdDogMzAwXG5cbiAgICAgICAgICAgICMgZGVmaW5lcyBpZiB3ZSBoYXZlIHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93IG9ialxuICAgICAgICAgICAgd2luZG93UmVzaXplRXZlbnQ6IHRydWVcblxuICAgICAgICAgICAgIyBEZWZhdWx0IGJyZWFrcG9pbnRzXG4gICAgICAgICAgICBicmVha3BvaW50cyA6IFtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJtb2JpbGVcIlxuICAgICAgICAgICAgICAgICAgICAjIHVudGlsIHRoaXMgcG9pbnQgd2lsbCBiZWhhdmVzIGFzIG1vYmlsZVxuICAgICAgICAgICAgICAgICAgICBicG1pbjogMFxuICAgICAgICAgICAgICAgICAgICBicG1heDogNzY3XG4gICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInRhYmxldFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA3NjhcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDk1OVxuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgIyBieSBkZWZhdWx0IGFueXRoaW5nIGdyZWF0ZXIgdGhhbiB0YWJsZXQgaXMgYSBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZGVza3RvcFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA5NjBcbiAgICAgICAgICAgIF1cblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXRlY3REZXZpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jaGVja1ZpZXdwb3J0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfYXR0YWNoV2luZG93SGFuZGxlcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2V0RGV2aWNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9yZXNpemVIYW5kbGVyXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICBAX2F0dGFjaFdpbmRvd0hhbmRsZXJzKCkgaWYgQGNvbmZpZy53aW5kb3dSZXNpemVFdmVudFxuXG4gICAgICAgICAgICBAZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBfYXR0YWNoV2luZG93SGFuZGxlcnM6ICgpIC0+XG5cbiAgICAgICAgICAgIGxhenlSZXNpemUgPSBCYXNlLnV0aWwuZGVib3VuY2UgQF9yZXNpemVIYW5kbGVyLCBAY29uZmlnLndhaXRMaW1pdFxuXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGxhenlSZXNpemUpXG5cbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXI6ICgpIC0+XG4gICAgICAgICAgICAjIHRyaWdnZXJzIGEgd2luZG93c3Jlc2l6ZSBldmVudCBzbyB0aGlzIHdheSB3ZSBoYXZlIGEgY2VudHJhbGl6ZWRcbiAgICAgICAgICAgICMgd2F5IHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93cyBhbmQgdGhlIGNvbXBvbmVuc1xuICAgICAgICAgICAgIyBjYW4gbGlzdGVuIGRpcmVjdGx5IHRvIHRoaXMgZXZlbnQgaW5zdGVhZCBvZiBkZWZpbmluZyBhIG5ldyBsaXN0ZW5lclxuICAgICAgICAgICAgUGVzdGxlLmVtaXQgXCJyd2Q6d2luZG93cmVzaXplXCJcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgZGV0ZWN0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICBicCA9IEBjb25maWcuYnJlYWtwb2ludHNcblxuICAgICAgICAgICAgdnAgPSBCYXNlLnZwLnZpZXdwb3J0VygpXG5cbiAgICAgICAgICAgICMgZ2V0IGEgcmVmZXJlbmNlIChpZiBhbnkpIHRvIHRoZSBjb3JyZXNwb25kaW5nIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICMgZGVmaW5lZCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgdnBkID0gQF9jaGVja1ZpZXdwb3J0KHZwLCBicClcblxuICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5IHZwZFxuXG4gICAgICAgICAgICAgICAgY2FwaXRhbGl6ZWRCUE5hbWUgPSBCYXNlLnV0aWwuc3RyaW5nLmNhcGl0YWxpemUodnBkLm5hbWUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIyBsZXQncyBmaXN0IGNoZWNrIGlmIHdlIGhhdmUgYSBtZXRob2QgdG8gZGV0ZWN0IHRoZSBkZXZpY2UgdGhyb3VnaCBVQVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cbiAgICAgICAgICAgICAgICAgICAgVUFEZXRlY3RvciA9IEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cblxuICAgICAgICAgICAgICAgICMgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgcmVzdWx0IG9mIGEgVUEgY2hlY2suXG4gICAgICAgICAgICAgICAgIyBVbmxlc3MgdGhlcmUgaXMgYSBtZXRob2QgdG8gY2hlY2sgdGhlIFVBLCBsZXRzXG4gICAgICAgICAgICAgICAgIyBsZWF2ZSBpdCBhcyBmYWxzZSBhbmQgdXNlIG9ubHkgdGhlIHZpZXdwb3J0IHRvXG4gICAgICAgICAgICAgICAgIyBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAgICAgc3RhdGVVQSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gVUFEZXRlY3RvclxuXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBVQURldGVjdG9yKClcblxuICAgICAgICAgICAgICAgICMgRmluYWwgY2hlY2suIEZpcnN0IHdlJ2xsIHRyeSB0byBtYWtlIHRvIG1ha2UgdGhlIGRlY2lzaW9uXG4gICAgICAgICAgICAgICAgIyB1cG9uIHRoZSBjdXJyZW50IGRldmljZSBiYXNlZCBvbiBVQSwgaWYgaXMgbm90IHBvc3NpYmxlLCBsZXRzIGp1c3RcbiAgICAgICAgICAgICAgICAjIHVzZSB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICBpZiBzdGF0ZVVBIG9yIHZwZC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICMgVHJpZ2dlciBhIGV2ZW50IHRoYXQgZm9sbG93cyB0aGUgZm9sbG93aW5nIG5hbWluZyBjb252ZW50aW9uXG4gICAgICAgICAgICAgICAgICAgICMgcndkOjxkZXZpY2U+XG4gICAgICAgICAgICAgICAgICAgICMgRXhhbXBsZTogcndkOnRhYmxldCBvciByd2Q6bW9iaWxlXG5cbiAgICAgICAgICAgICAgICAgICAgZXZ0ID0gJ3J3ZDonICsgdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIERlc2lnbiBleHRlbnNpb24gaXMgdHJpZ2dlcmluZyB0aGUgZm9sbG93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBldnRcblxuICAgICAgICAgICAgICAgICAgICBQZXN0bGUuZW1pdCBldnRcblxuICAgICAgICAgICAgICAgICAgICAjIFN0b3JlIHRoZSBjdXJyZW50IGRldmljZVxuICAgICAgICAgICAgICAgICAgICBAZGV2aWNlID0gdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbXNnID0gXCJbZXh0XSBUaGUgcGFzc2VkIHNldHRpbmdzIHRvIHRoZSBSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1pZ2h0IG5vdCBiZSBjb3JyZWN0IHNpbmNlIHdlIGhhdmVuJ3QgYmVlbiBhYmxlIHRvIGRldGVjdCBhbiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXNvY2lhdGVkIGJyZWFrcG9pbnQgdG8gdGhlIGN1cnJlbnQgdmlld3BvcnRcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgZ2V0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gQGRldmljZVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogZGV0ZWN0IGlmIHRoZSBjdXJyZW50IHZpZXdwb3J0XG4gICAgICAgICAqIGNvcnJlc3BvbmQgdG8gYW55IG9mIHRoZSBkZWZpbmVkIGJwIGluIHRoZSBjb25maWcgc2V0dGluZ1xuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHZwIFtudW1iZXIuIEN1cnJlbnQgdmlld3BvcnRdXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gYnJlYWtwb2ludHMgW2Nsb25lIG9mIHRoZSBicmVha3BvaW50IGtleSBvYmplY3RdXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gdGhlIGJyZWFrcG9pbnQgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgY3VycmVudGx5XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWQgdmlld3BvcnRcbiAgICAgICAgIyMjXG4gICAgICAgIF9jaGVja1ZpZXdwb3J0OiAodnAsIGJyZWFrcG9pbnRzKSAtPlxuXG4gICAgICAgICAgICBicmVha3BvaW50ID0gQmFzZS51dGlsLmZpbHRlcihicmVha3BvaW50cywgKGJwKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBzdGFydHMgY2hlY2tpbmcgaWYgdGhlIGRldGVjdGVkIHZpZXdwb3J0IGlzXG4gICAgICAgICAgICAgICAgIyBiaWdnZXIgdGhhbiB0aGUgYnBtaW4gZGVmaW5lZCBpbiB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICMgaXRlcmF0ZWQgYnJlYWtwb2ludFxuICAgICAgICAgICAgICAgIGlmIHZwID49IGJwLmJwbWluXG5cbiAgICAgICAgICAgICAgICAgICAgIyB3ZSdsbCBuZWVkIHRvIGNoZWNrIHRoaXMgd2F5IGJlY2F1c2UgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAjIGlmIGEgQlAgZG9lc24ndCBoYXZlIGEgYnBtYXggcHJvcGVydHkgaXQgbWVhbnNcbiAgICAgICAgICAgICAgICAgICAgIyBpcyB0aGUgbGFzdCBhbmQgYmlnZ2VyIGNhc2UgdG8gY2hlY2suIEJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpcyBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIGJwLmJwbWF4IGFuZCBicC5icG1heCAhPSAwXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgaXQncyB3aXRoaW4gdGhlIHJhbmdlLCBhbGwgZ29vZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdnAgPD0gYnAuYnBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBzaG91bGQgb25seSBiZSB0cnVlIGluIG9ubHkgb25lIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgQnkgZGVmYXVsdCwganVzdCBmb3IgZGVza3RvcCB3aGljaCBkb2Vzbid0IGhhdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICMgYW4gXCJ1bnRpbFwiIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlXG5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgYnJlYWtwb2ludC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyZWFrcG9pbnQuc2hpZnQoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB7fVxuXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBjb25maWcgPSB7fVxuXG4gICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICBpZiBhcHAuY29uZmlnLmV4dGVuc2lvbiBhbmQgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cbiAgICAgICAgICAgIGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyB7fSwgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cblxuICAgICAgICByd2QgPSBuZXcgUmVzcG9uc2l2ZURlc2lnbihjb25maWcpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkID0gKCkgLT5cbiAgICAgICAgICAgICMgY2FsbCBkZXRlY3QgRGV2aWNlIGluIG9yZGVyIHRvIHRyaWdnZXIgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICMgZGV2aWNlIGV2ZW50XG4gICAgICAgICAgICByd2QuZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QuZ2V0RGV2aWNlID0gKCkgLT5cblxuICAgICAgICAgICAgcndkLmdldERldmljZSgpXG5cbiAgICAjIHRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBvbmVudHMgaGF2ZSBiZWVuXG4gICAgIyBpbml0aWFsaXplZFxuICAgIGFmdGVyQXBwSW5pdGlhbGl6ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcImFmdGVyQXBwSW5pdGlhbGl6ZWQgbWV0aG9kIGZyb20gUmVzcG9uc2l2ZURlc2lnblwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkKClcblxuICAgIG5hbWU6ICdSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24nXG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ3Jlc3BvbnNpdmVkZXNpZ24nXG4pIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBiZSBoYW5kbGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlSW1hZ2VzXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgQXJyYXkgb2Ygc3VwcG9ydGVkIFBpeGVsIHdpZHRoIGZvciBpbWFnZXNcbiAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogWzEzMywxNTIsMTYyLDIyNSwyMTAsMjI0LDI4MCwzNTIsNDcwLDUzNiw1OTAsNjc2LDcxMCw3NjgsODg1LDk0NSwxMTkwXVxuXG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlciBwaXhlbCByYXRpb3NcbiAgICAgICAgICAgIGF2YWlsYWJsZVBpeGVsUmF0aW9zOiBbMSwgMiwgM11cblxuICAgICAgICAgICAgIyBTZWxlY3RvciB0byBiZSB1c2VkIHdoZW4gaW5zdGFudGluZyBJbWFnZXJcbiAgICAgICAgICAgIGRlZmF1bHRTZWxlY3RvciA6ICcuZGVsYXllZC1pbWFnZS1sb2FkJ1xuXG4gICAgICAgICAgICAjIGxhenkgbW9kZSBlbmFibGVkXG4gICAgICAgICAgICBsYXp5bW9kZSA6IHRydWVcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlTGlzdGVuZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlSW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQGNmZywgY29uZmlnXG5cbiAgICAgICAgICAgIEBfaW5pdCgpXG5cbiAgICAgICAgX2luaXQ6ICgpIC0+XG5cbiAgICAgICAgICAgICMgY3JlYXRlcyBsaXN0ZW5lcnMgdG8gYWxsb3cgdGhlIGluc3RhbnRpYXRvbiBvZiB0aGUgSW1hZ2VyXG4gICAgICAgICAgICAjIGluIGxhenkgbG9hZCBtb2RlLlxuICAgICAgICAgICAgIyBVc2VmdWwgZm9yIGluZmluaXRlIHNjcm9sbHMgb3IgaW1hZ2VzIGNyZWF0ZWQgb24gZGVtYW5kXG4gICAgICAgICAgICBAX2NyZWF0ZUxpc3RlbmVycygpIGlmIEBjb25maWcubGF6eW1vZGVcblxuICAgICAgICAgICAgIyBBcyBzb29uIGFzIHRoaXMgZXh0ZW5zaW9uIGlzIGluaXRpYWxpemVkIHdlIGFyZSBnb25uYSBiZSBjcmVhdGluZ1xuICAgICAgICAgICAgIyB0aGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICAgICAgICAgIEBfY3JlYXRlSW5zdGFuY2UoKVxuXG4gICAgICAgIF9jcmVhdGVMaXN0ZW5lcnM6ICgpIC0+XG4gICAgICAgICAgICAjIHRoaXMgZ2l2ZXMgdGhlIGFiaWxpdHkgdG8gY3JlYXRlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICAjIGJ5IHRyaWdnZXIgdGhpcyBldmVudCB3aXRoIG9wdGlvbmFsIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIFBlc3RsZS5vbiAncmVzcG9uc2l2ZWltYWdlczpjcmVhdGUnLCBAX2NyZWF0ZUluc3RhbmNlXG5cbiAgICAgICAgX2NyZWF0ZUluc3RhbmNlIDogKG9wdGlvbnMgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBjcmVhdGluZyBhIG5ldyBJbWFnZXIgaW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBzZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3Igb3IgQGNvbmZpZy5kZWZhdWx0U2VsZWN0b3JcbiAgICAgICAgICAgIG9wdHMgPSBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkgb3B0aW9ucyB0aGVuIG9wdGlvbnMgZWxzZSBAY29uZmlnXG5cbiAgICAgICAgICAgIG5ldyBCYXNlLkltYWdlcihzZWxlY3Rvciwgb3B0cylcblxuICAgICMgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgaW5pdGlhbGl6ZSBtZXRob2QgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAjIGluaXQgdGhlIGV4dGVuc2lvblxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24gaW5pdGlhbGl6ZWRcIlxuXG4gICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgIyBDaGVjayBpZiB0aGUgZXh0ZW5zaW9uIGhhcyBhIGN1c3RvbSBjb25maWcgdG8gdXNlXG4gICAgICAgIGlmIGFwcC5jb25maWcuZXh0ZW5zaW9uIGFuZCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJlc3BvbnNpdmVpbWFnZXMgPSAoKSAtPlxuXG4gICAgICAgICAgICBycCA9IG5ldyBSZXNwb25zaXZlSW1hZ2VzKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0cmlnZ2VyIHRoZSBldmVudCB0byBsZXQgZXZlcnlib2R5IGtub3dzIHRoYXQgdGhpcyBleHRlbnNpb24gZmluaXNoZWRcbiAgICAgICAgICAgICMgaXRzIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICBQZXN0bGUuZW1pdCAncmVzcG9uc2l2ZWltYWdlczppbml0aWFsaXplZCdcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlSW1hZ2VzXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzKClcblxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWltYWdlcydcbilcbiIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBDb29raWVzKSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICBjb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpXG5cbiAgICAjIEV4cG9zZSBDb29raWVzIEFQSVxuICAgIENvb2tpZXMgPVxuXG4gICAgICAgIHNldDogKGtleSwgdmFsdWUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLnNldCBrZXksIHZhbHVlLCBvcHRpb25zXG5cbiAgICAgICAgZ2V0OiAoa2V5KSAtPlxuICAgICAgICAgICAgY29va2llcy5nZXQga2V5XG5cbiAgICAgICAgZXhwaXJlOiAoa2V5LCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgY29va2llcy5leHBpcmUga2V5LCBvcHRpb25zXG5cbiAgICByZXR1cm4gQ29va2llc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBEZXZpY2VEZXRlY3Rpb24pIC0+XG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBpc01vYmlsZSA9IHJlcXVpcmUoJ2lzbW9iaWxlanMnKVxuXG4gICAgIyBFeHBvc2UgZGV2aWNlIGRldGVjdGlvbiBBUElcbiAgICBEZXZpY2VEZXRlY3Rpb24gPVxuXG4gICAgICAgICMgR3JvdXBzXG4gICAgICAgIGlzTW9iaWxlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUucGhvbmVcblxuICAgICAgICBpc1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLnRhYmxldFxuXG4gICAgICAgICMgQXBwbGUgZGV2aWNlc1xuICAgICAgICBpc0lwaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnBob25lXG5cbiAgICAgICAgaXNJcG9kOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuaXBvZFxuXG4gICAgICAgIGlzSXBhZDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFwcGxlLnRhYmxldFxuXG4gICAgICAgIGlzQXBwbGUgOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUuZGV2aWNlXG5cbiAgICAgICAgIyBBbmRyb2lkIGRldmljZXNcbiAgICAgICAgaXNBbmRyb2lkUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnBob25lXG5cbiAgICAgICAgaXNBbmRyb2lkVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYW5kcm9pZC50YWJsZXRcblxuICAgICAgICBpc0FuZHJvaWREZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLmRldmljZVxuXG4gICAgICAgICMgV2luZG93cyBkZXZpY2VzXG4gICAgICAgIGlzV2luZG93c1Bob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5waG9uZVxuXG4gICAgICAgIGlzV2luZG93c1RhYmxldDogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLndpbmRvd3MudGFibGV0XG5cbiAgICAgICAgaXNXaW5kb3dzRGV2aWNlOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy5kZXZpY2VcblxuICAgIHJldHVybiBEZXZpY2VEZXRlY3Rpb25cbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXZlbnRCdXMpIC0+XG5cbiAgICBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCd3b2xmeTg3LWV2ZW50ZW1pdHRlcicpXG5cbiAgICAjIyMqXG4gICAgICogY2xhc3MgdGhhdCBzZXJ2ZXMgYXMgYSBmYWNhZGUgZm9yIHRoZSBFdmVudEVtaXR0ZXIgY2xhc3NcbiAgICAjIyNcbiAgICBjbGFzcyBFdmVudEJ1cyBleHRlbmRzIEV2ZW50RW1pdHRlclxuXG4gICAgcmV0dXJuIEV2ZW50QnVzXG4pIiwiIyMjKlxuICogVGhlIEV4dGVuc2lvbiBNYW5hbmdlciB3aWxsIHByb3ZpZGUgdGhlIGJhc2Ugc2V0IG9mIGZ1bmN0aW9uYWxpdGllc1xuICogdG8gbWFrZSB0aGUgQ29yZSBsaWJyYXJ5IGV4dGVuc2libGUuXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0TWFuYWdlcikgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBFeHRNYW5hZ2VyXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBEZWZhdWx0cyBjb25maWdzIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBfZXh0ZW5zaW9uQ29uZmlnRGVmYXVsdHM6XG4gICAgICAgICAgICBhY3RpdmF0ZWQgOiB0cnVlICMgdW5sZXNzIHNhaWQgb3RoZXJ3aXNlLCBldmVyeSBhZGRlZCBleHRlbnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB3aWxsIGJlIGFjdGl2YXRlZCBvbiBzdGFydFxuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICAgICAgIyB0byBrZWVwIHRyYWNrIG9mIGFsbCBleHRlbnNpb25zXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMgPSBbXVxuXG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGluaXRpYWxpemVkIGV4dGVuc2lvblxuICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMgPSBbXVxuXG4gICAgICAgIGFkZDogKGV4dCkgLT5cblxuICAgICAgICAgICAgIyBjaGVja3MgaWYgdGhlIG5hbWUgZm9yIHRoZSBleHRlbnNpb24gaGF2ZSBiZWVuIGRlZmluZWQuXG4gICAgICAgICAgICAjIGlmIG5vdCBsb2cgYSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgIHVubGVzcyBleHQubmFtZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiVGhlIGV4dGVuc2lvbiBkb2Vzbid0IGhhdmUgYSBuYW1lIGFzc29jaWF0ZWQuIEl0IHdpbGwgYmUgaGVwZnVsbCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCJpZiB5b3UgaGF2ZSBhc3NpbmcgYWxsIG9mIHlvdXIgZXh0ZW5zaW9ucyBhIG5hbWUgZm9yIGJldHRlciBkZWJ1Z2dpbmdcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICMgTGV0cyB0aHJvdyBhbiBlcnJvciBpZiB3ZSB0cnkgdG8gaW5pdGlhbGl6ZSB0aGUgc2FtZSBleHRlbnNpb24gdHdpY2VzXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAX2V4dGVuc2lvbnMsICh4dCwgaSkgLT5cbiAgICAgICAgICAgICAgICBpZiBfLmlzRXF1YWwgeHQsIGV4dFxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHRlbnNpb246IFwiICsgZXh0Lm5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0cy5cIilcblxuICAgICAgICAgICAgQF9leHRlbnNpb25zLnB1c2goZXh0KVxuXG4gICAgICAgIGluaXQgOiAoY29udGV4dCkgLT5cbiAgICAgICAgICAgIHh0Y2xvbmUgPSBCYXNlLnV0aWwuY2xvbmUgQF9leHRlbnNpb25zXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJBZGRlZCBleHRlbnNpb25zIChzdGlsbCBub3QgaW5pdGlhbGl6ZWQpOlwiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyB4dGNsb25lXG5cbiAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihAX2V4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJJbml0aWFsaXplZCBleHRlbnNpb25zOlwiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgaWYgQF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkKHh0LCBjb250ZXh0LmNvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgIyB0aGlzIHN0YXRlIGNvdWxkIHRlbGwgdG8gdGhlIHJlc3Qgb2YgdGhlIHdvcmxkIGlmXG4gICAgICAgICAgICAgICAgICAgICMgZXh0ZW5zaW9ucyBoYXMgYmVlbiBpbml0aWFsaXplZCBvciBub3RcbiAgICAgICAgICAgICAgICAgICAgeHQuYWN0aXZhdGVkID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgICMgY2FsbCB0byB0aGUgZXh0ZW5zaW9uIGluaXRpYWxpemUgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dClcblxuICAgICAgICAgICAgICAgICAgICAjIEtlZXAgdHJhY2sgb2YgdGhlIGluaXRpYWxpemVkIGV4dGVuc2lvbnMgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgeHQuYWN0aXZhdGVkID0gZmFsc2VcblxuICAgICAgICAgICAgICAgICMgY2FsbCB0aGlzIG1ldGhvZCByZWN1cnNpdmVseSB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZVxuICAgICAgICAgICAgICAgICMgZWxlbWVudHMgaW4gdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQ6ICh4dCwgY29uZmlnKSAtPlxuXG4gICAgICAgICAgICAjIGZpcnN0IHdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIFwib3B0aW9uc1wiIGtleSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAjIGJ5IHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIHVubGVzcyB4dC5vcHRpb25LZXlcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBvcHRpb25LZXkgaXMgcmVxdWlyZWQgYW5kIHdhcyBub3QgZGVmaW5lZCBieTogXCIgKyB4dC5uYW1lXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgIyBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWQgdG8gdGhlIGV4dGVuc2lvbiwgbGV0cyBjaGVjayBqdXN0IGZvciBcImFjdGl2YXRlZFwiXG4gICAgICAgICAgICAjIHdoaWNoIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IHNob3VsZCBtYXR0ZXIgd2l0aGluIHRoaXMgbWV0aG9kXG4gICAgICAgICAgICBpZiBjb25maWcuZXh0ZW5zaW9uIGFuZCBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0gYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uaGFzT3duUHJvcGVydHkgJ2FjdGl2YXRlZCdcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWQgPSBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uYWN0aXZhdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gQF9leHRlbnNpb25Db25maWdEZWZhdWx0cy5hY3RpdmF0ZWRcblxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2YXRlZFxuXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9uQnlOYW1lIDogKG5hbWUpIC0+XG4gICAgICAgICAgICBCYXNlLnV0aWwud2hlcmUgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgICAgIGdldEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfZXh0ZW5zaW9ucywgb3B0aW9uS2V5OiBuYW1lXG5cbiAgICByZXR1cm4gRXh0TWFuYWdlclxuXG4pXG4iLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVXRpbHMpIC0+XG5cbiAgICAjIEV4cG9zZSBVdGlscyBBUElcbiAgICBVdGlscyA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIGxpYnJhcnkgdmVyc2lvbmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgdmVyc2lvbkNvbXBhcmUgOiAodjEsIHYyLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBpc1ZhbGlkUGFydCA9ICh4KSAtPlxuICAgICAgICAgICAgICAgICgoaWYgbGV4aWNvZ3JhcGhpY2FsIHRoZW4gL15cXGQrW0EtWmEtel0qJC8gZWxzZSAvXlxcZCskLykpLnRlc3QgeFxuXG4gICAgICAgICAgICBsZXhpY29ncmFwaGljYWwgPSBvcHRpb25zIGFuZCBvcHRpb25zLmxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgemVyb0V4dGVuZCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMuemVyb0V4dGVuZFxuICAgICAgICAgICAgdjFwYXJ0cyA9IHYxLnNwbGl0KFwiLlwiKVxuICAgICAgICAgICAgdjJwYXJ0cyA9IHYyLnNwbGl0KFwiLlwiKVxuXG4gICAgICAgICAgICByZXR1cm4gTmFOIGlmIG5vdCB2MXBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KSBvciBub3QgdjJwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydClcblxuICAgICAgICAgICAgaWYgemVyb0V4dGVuZFxuICAgICAgICAgICAgICAgIHYxcGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MXBhcnRzLmxlbmd0aCA8IHYycGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgdjJwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYycGFydHMubGVuZ3RoIDwgdjFwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgdW5sZXNzIGxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgICAgIHYxcGFydHMgPSB2MXBhcnRzLm1hcChOdW1iZXIpXG4gICAgICAgICAgICAgICAgdjJwYXJ0cyA9IHYycGFydHMubWFwKE51bWJlcilcblxuICAgICAgICAgICAgaSA9IC0xXG4gICAgICAgICAgICB3aGlsZSBpIDwgdjFwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgICAgIGlmIHYycGFydHMubGVuZ3RoIDwgaVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGlmIHYxcGFydHNbaV0gPT0gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjFwYXJ0c1tpXSA+IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYycGFydHNbaV0gPiB2MXBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuXG4gICAgICAgICAgICByZXR1cm4gLTEgaWYgdjFwYXJ0cy5sZW5ndGggIT0gdjJwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICBzdHJpbmc6XG4gICAgICAgICAgICBjYXBpdGFsaXplOiAoc3RyKSAtPlxuICAgICAgICAgICAgICAgIHN0ciA9IChpZiBub3Qgc3RyPyB0aGVuIFwiXCIgZWxzZSBTdHJpbmcoc3RyKSlcbiAgICAgICAgICAgICAgICBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcblxuICAgIHJldHVybiBVdGlsc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBMb2dnZXIpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGxvZ2xldmVsID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBFeHBvc2UgdGhlIExvZ2dlciBBUElcbiAgICBMb2dnZXIgPVxuXG4gICAgICAgIHNldExldmVsOiAobGV2ZWwpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5zZXRMZXZlbChsZXZlbClcblxuICAgICAgICB0cmFjZTogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnRyYWNlKG1zZylcblxuICAgICAgICBkZWJ1ZzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmRlYnVnKG1zZylcblxuICAgICAgICBpbmZvOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuaW5mbyhtc2cpXG5cbiAgICAgICAgd2FybjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLndhcm4obXNnKVxuXG4gICAgICAgIGVycm9yOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZXJyb3IobXNnKVxuXG4gICAgcmV0dXJuIExvZ2dlclxuKSIsIiMjIypcbiAqIFRoaXMgd2lsbCBwcm92aWRlIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGRlZmluZSBNb2R1bGVzXG4gKiBhbmQgcHJvdmlkZSBhIHdheSB0byBleHRlbmQgdGhlbVxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE1vZHVsZSkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLi9iYXNlLmNvZmZlZScpXG5cbiAgICAjIHRoaXMgd2lsbCBzZXJ2ZSBhcyB0aGUgYmFzZSBjbGFzcyBmb3IgYSBNb2R1bGVcbiAgICBjbGFzcyBNb2R1bGVcbiAgICAgICAgY29uc3RydWN0b3I6IChvcHQpIC0+XG4gICAgICAgICAgICBAc2FuZGJveCA9IG9wdC5zYW5kYm94XG4gICAgICAgICAgICBAb3B0aW9ucyA9IG9wdC5vcHRpb25zXG4gICAgICAgICAgICBAc2V0RWxlbWVudCgpXG5cblxuICAgICMgdGhpcyBjbGFzcyB3aWxsIGV4cG9zZSBzdGF0aWMgbWV0aG9kcyB0byBhZGQsIGV4dGVuZCBhbmRcbiAgICAjIGdldCB0aGUgbGlzdCBvZiBhZGRlZCBtb2R1bGVzXG4gICAgY2xhc3MgTW9kdWxlc1xuXG4gICAgICAgICMgdGhpcyB3aWxsIGhvbGQgdGhlIGxpc3Qgb2YgYWRkZWQgbW9kdWxlc1xuICAgICAgICBAbGlzdCA6IHt9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBqdXN0IGFuIGFsaWFzIGZvciB0aGUgZXh0ZW5kIG1ldGhvZFxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nXX0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gZGVmaW5pdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQGFkZCA6IChuYW1lLCBkZWZpbml0aW9uKSAtPlxuICAgICAgICAgICAgQGV4dGVuZChuYW1lLCBkZWZpbml0aW9uLCBNb2R1bGUpXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBnZXR0ZXIgZm9yIHJldHJpZXZpbmcgbW9kdWxlcyBkZWZpbml0aW9uc1xuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG5hbWVcbiAgICAgICAgICogQHJldHVybiB7W0Z1bmN0aW9uL3VuZGVmaW5lZF19XG4gICAgICAgICMjI1xuICAgICAgICBAZ2V0IDogKG5hbWUpIC0+XG4gICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcobmFtZSkgYW5kIEBsaXN0W25hbWVdXG4gICAgICAgICAgICAgICAgcmV0dXJuIEBsaXN0W25hbWVdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogdGhpcyB3aWxsIGFsbG93cyB1cyB0byBzaW1wbGlmeSBhbmQgaGF2ZSBtb3JlIGNvbnRyb2xcbiAgICAgICAgICogb3ZlciBhZGRpbmcvZGVmaW5pbmcgbW9kdWxlc1xuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nXX0gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gZGVmaW5pdGlvblxuICAgICAgICAgKiBAcGFyYW0gIHtbU3RyaW5nL0Z1bmN0aW9uXX0gQmFzZUNsYXNzXG4gICAgICAgICMjI1xuICAgICAgICBAZXh0ZW5kIDogKG5hbWUsIGRlZmluaXRpb24sIEJhc2VDbGFzcykgLT5cbiAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgQmFzZS51dGlsLmlzT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgICAgICAgICAgIyBpZiBubyBCYXNlQ2xhc3MgaXMgcGFzc2VkLCBieSBkZWZhdWx0IHdlJ2xsIHVzZSB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICBCYXNlQ2xhc3MgPSBNb2R1bGVcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgYXJlIHBhc3NpbmcgdGhlIEJhc2VDbGFzcyBhcyBhIHN0cmluZywgaXQgbWVhbnMgdGhhdCBjbGFzc1xuICAgICAgICAgICAgICAgICAgICAjIHNob3VsZCBoYXZlIGJlZW4gYWRkZWQgcHJldmlvdXNseSwgc28gd2UnbGwgbG9vayB1bmRlciB0aGUgbGlzdCBvYmpcbiAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgIyBjaGVjayBpZiB0aGUgY2xhc3MgaGFzIGJlZW4gYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgYmMgPSBAbGlzdFtCYXNlQ2xhc3NdXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIHRoZSBkZWZpbml0aW9uIGV4aXN0cywgbGV0cyBhc3NpZ24gaXQgdG8gQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBiY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIG5vdCwgbGV0cyB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbTW9kdWxlLyAnKyBuYW1lICsnIF06IGlzIHRyeWluZyB0byBleHRlbmQgWycgKyBCYXNlQ2xhc3MgKyAnXSB3aGljaCBkb2VzIG5vdCBleGlzdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuICAgICAgICAgICAgICAgICAgICAjIGlmIGl0IGlzIGEgZnVuY3Rpb24sIHdlJ2xsIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICAjIFRPRE86IGRvIHNvbWUgY2hlY2tpbmcgYmVmb3JlIHRyeWluZyB0byB1c2UgaXQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IEJhc2VDbGFzc1xuXG4gICAgICAgICAgICAgICAgZXh0ZW5kZWRDbGFzcyA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICMgd2UnbGwgb25seSB0cnkgdG8gYWRkIHRoaXMgZGVmaW5pdGlvbiBpbiBjYXNlXG4gICAgICAgICAgICAgICAgdW5sZXNzIEJhc2UudXRpbC5oYXMgQGxpc3QsIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgIyBleHRlbmRzIHRoZSBjdXJyZW50IGRlZmluaXRpb24gd2l0aCB0aGUgTW9kdWxlIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuZGVkRGVmaW5pdGlvbiA9IGV4dGVuZC5jYWxsIEJhc2VDbGFzcywgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHN0b3JlIHRoZSByZWZlcmVuY2UgZm9yIGxhdGVyIHVzYWdlXG4gICAgICAgICAgICAgICAgICAgIEBsaXN0W25hbWVdID0gZXh0ZW5kZWREZWZpbml0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuZGVkRGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpbmZvcm0gdGhlIGRldnMgdGhhdCBzb21lb25lIGlzIHRyeWluZyB0byBhZGQgYSBtb2R1bGUnc1xuICAgICAgICAgICAgICAgICAgICAjIGRlZmluaXRpb24gdGhhdCBoYXMgYmVlbiBwcmV2aW91c2x5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9ICdbQ29tcG9uZW50OicgKyBuYW1lICsgJ10gaGF2ZSBhbHJlYWR5IGJlZW4gZGVmaW5lZCcgXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBcblxuXG4gICAgQmFzZS51dGlsLmV4dGVuZCBNb2R1bGU6OiwgQmFzZS5FdmVudHMsXG5cbiAgICAgICAgIyB0aGlzIGhhcyB0byBiZSBvdmV3cml0dGVuIGJ5IHRoZSBtb2R1bGUgZGVmaW5pdGlvblxuICAgICAgICBpbml0aWFsaXplOiAoKSAtPlxuICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQvJyArIEBvcHRpb25zLm5hbWUgKyAnXTonICsgJ0RvZXNuXFwndCBoYXZlIGFuIGluaXRpYWxpemUgbWV0aG9kIGRlZmluZWQnXG4gICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIHNldEVsZW1lbnQ6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIEBlbCA9IEBvcHRpb25zLmVsXG4gICAgICAgICAgICBAJGVsID0gJChAZWwpXG5cbiAgICAgICAgICAgIEBkZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgZGVsZWdhdGVFdmVudHM6IChldmVudHMpIC0+XG4gICAgICAgICAgICAjIHJlZ2V4IHRvIHNwbGl0IHRoZSBldmVudHMga2V5IChzZXBhcmF0ZXMgdGhlIGV2ZW50IGZyb20gdGhlIHNlbGVjdG9yKVxuICAgICAgICAgICAgZGVsZWdhdGVFdmVudFNwbGl0dGVyID0gL14oXFxTKylcXHMqKC4qKSQvXG5cbiAgICAgICAgICAgICMgaWYgdGhlIGV2ZW50cyBvYmplY3QgaXMgbm90IGRlZmluZWQgb3IgcGFzc2VkIGFzIGEgcGFyYW1ldGVyXG4gICAgICAgICAgICAjIHRoZXJlIGlzIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgcmV0dXJuICAgIHVubGVzcyBldmVudHMgb3IgKGV2ZW50cyA9IEJhc2UudXRpbC5yZXN1bHQoQCwgXCJldmVudHNcIikpXG4gICAgICAgICAgICAjIGJlZm9yZSB0cnlpbmcgdG8gYXR0YWNoIG5ldyBldmVudHMsIGxldHMgcmVtb3ZlIGFueSBwcmV2aW91c1xuICAgICAgICAgICAgIyBhdHRhY2hlZCBldmVudFxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuXG4gICAgICAgICAgICBmb3Iga2V5IG9mIGV2ZW50c1xuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kIG5hbWVcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBldmVudHNba2V5XVxuICAgICAgICAgICAgICAgICMgZ3JhYiB0aGUgbWV0aG9kJ3MgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IEBbZXZlbnRzW2tleV1dICAgIHVubGVzcyBCYXNlLnV0aWwuaXNGdW5jdGlvbihtZXRob2QpXG4gICAgICAgICAgICAgICAgY29udGludWUgICAgdW5sZXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIG1hdGNoID0ga2V5Lm1hdGNoKGRlbGVnYXRlRXZlbnRTcGxpdHRlcilcbiAgICAgICAgICAgICAgICBAZGVsZWdhdGUgbWF0Y2hbMV0sIG1hdGNoWzJdLCBCYXNlLnV0aWwuYmluZChtZXRob2QsIEApXG5cbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgZGVsZWdhdGU6IChldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikgLT5cbiAgICAgICAgICAgIEAkZWwub24gZXZlbnROYW1lICsgXCIucGVzdGxlRXZlbnRcIiArIEBvcHRpb25zLmd1aWQsIHNlbGVjdG9yLCBsaXN0ZW5lclxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICB1bmRlbGVnYXRlRXZlbnRzOiAoKSAtPlxuICAgICAgICAgICAgQCRlbC5vZmYoJy5wZXN0bGVFdmVudCcgKyBAb3B0aW9ucy5ndWlkKSAgICBpZiBAJGVsXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgICMgYnkgZGVmYXVsdCwgaXQgd2lsbCByZW1vdmUgZXZlbnRsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGVcbiAgICAgICAgIyAkZWwgZnJvbSB0aGUgRE9NXG4gICAgICAgIHN0b3A6ICgpIC0+XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICBAJGVsLnJlbW92ZSgpIGlmIEAkZWxcblxuICAgICMgSGVscGVyc1xuICAgIGV4dGVuZCA9IChwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgLT5cbiAgICAgICAgcGFyZW50ID0gQFxuXG4gICAgICAgICMgVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgICAgICAjICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgICAgICAjIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3RvclxuICAgICAgICBpZiBwcm90b1Byb3BzIGFuZCBCYXNlLnV0aWwuaGFzKHByb3RvUHJvcHMsIFwiY29uc3RydWN0b3JcIilcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGlsZCA9IC0+XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGx5IEAsIGFyZ3VtZW50c1xuXG4gICAgICAgICMgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gICAgICAgIEJhc2UudXRpbC5leHRlbmQgY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHNcblxuICAgICAgICAjIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgICAgICMgYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgICAgU3Vycm9nYXRlID0gLT5cbiAgICAgICAgICAgIEBjb25zdHJ1Y3RvciA9IGNoaWxkXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBTdXJyb2dhdGU6OiA9IHBhcmVudDo6XG4gICAgICAgIGNoaWxkOjogPSBuZXcgU3Vycm9nYXRlXG5cbiAgICAgICAgIyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgICAgICAgIyBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZDo6LCBwcm90b1Byb3BzICAgIGlmIHByb3RvUHJvcHNcblxuICAgICAgICAjIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBpbml0aWFsaXplIG1ldGhvZCBzbyBpdCBjYW4gYmUgY2FsbGVkXG4gICAgICAgICMgZnJvbSBpdHMgY2hpbGRzXG4gICAgICAgIGNoaWxkOjpfc3VwZXJfID0gcGFyZW50Ojppbml0aWFsaXplXG5cbiAgICAgICAgcmV0dXJuIGNoaWxkXG5cbiAgICAjIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBiYXNlIGNsYXNzIGZvciBtb2R1bGVzXG4gICAgTW9kdWxlcy5Nb2R1bGUgPSBNb2R1bGVcblxuICAgIHJldHVybiBNb2R1bGVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZlcnNpb25DaGVja2VyKSAtPlxuXG4gICAgbG9nID0gcmVxdWlyZSAnLi9sb2dnZXIuY29mZmVlJ1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi9nZW5lcmFsLmNvZmZlZSdcblxuICAgICMgRXhwb3NlIFZlcnNpb25DaGVja2VyIEFQSVxuICAgIFZlcnNpb25DaGVja2VyID1cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdG8gY2hlY2sgdmVyc2lvbmluZyBmb3IgYWxsIHRoZSBkZWZpbmVkIGxpYnJhcmllc1xuICAgICAgICAgKiB3aXRoaW4gdGhlIGRlcGVuZGVuY3kgYXJyYXlcbiAgICAgICAgIyMjXG4gICAgICAgIGNoZWNrOiAoZGVwZW5kZW5jaWVzKSAtPlxuXG4gICAgICAgICAgICBpZiBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgZHAgPSBkZXBlbmRlbmNpZXMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgdW5sZXNzIGRwLm9ialxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBkcC5uYW1lICsgXCIgaXMgYSBoYXJkIGRlcGVuZGVuY3kgYW5kIGl0IGhhcyB0byBiZSBsb2FkZWQgYmVmb3JlIHBlc3RsZS5qc1wiXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgICMgY29tcGFyZSB0aGUgdmVyc2lvblxuICAgICAgICAgICAgICAgIHVubGVzcyBVdGlscy52ZXJzaW9uQ29tcGFyZShkcC52ZXJzaW9uLCBkcC5yZXF1aXJlZCkgPj0gMFxuICAgICAgICAgICAgICAgICAgICAjIGlmIHdlIGVudGVyIGhlcmUgaXQgbWVhbnMgdGhlIGxvYWRlZCBsaWJyYXJ5IGRvZXN0IG5vdCBmdWxmaWxsIG91ciBuZWVkc1xuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIltGQUlMXSBcIiArIGRwLm5hbWUgKyBcIjogdmVyc2lvbiByZXF1aXJlZDogXCIgKyBkcC5yZXF1aXJlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIDwtLT4gTG9hZGVkIHZlcnNpb246IFwiICsgZHAudmVyc2lvblxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cblxuICAgIHJldHVybiBWZXJzaW9uQ2hlY2tlclxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWaWV3cG9ydCkgLT5cblxuICAgICMgTG9nZ2VyXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCd2ZXJnZScpXG5cbiAgICAjIEV4cG9zZSBWaWV3cG9ydCBkZXRlY3Rpb24gQVBJXG4gICAgVmlld3BvcnQgPVxuXG4gICAgICAgIHZpZXdwb3J0VzogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0VygpXG5cbiAgICAgICAgdmlld3BvcnRIOiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRIKClcblxuICAgICAgICB2aWV3cG9ydDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0KClcblxuICAgICAgICBpblZpZXdwb3J0OiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblZpZXdwb3J0KGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5YKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIGluWTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5ZKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgIHNjcm9sbFg6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxYKClcblxuICAgICAgICBzY3JvbGxZOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWSgpXG5cbiAgICAgICAgIyBUbyB0ZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlXG4gICAgICAgIG1xOiAobWVkaWFRdWVyeVN0cmluZykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0Lm1xKG1lZGlhUXVlcnlTdHJpbmcpXG5cbiAgICAgICAgcmVjdGFuZ2xlOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5yZWN0YW5nbGUoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgIyBpZiBubyBhcmd1bWVudCBpcyBwYXNzZWQsIHRoZW4gaXQgcmV0dXJucyB0aGUgYXNwZWN0XG4gICAgICAgICMgcmF0aW8gb2YgdGhlIHZpZXdwb3J0LiBJZiBhbiBlbGVtZW50IGlzIHBhc3NlZCBpdCByZXR1cm5zXG4gICAgICAgICMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZWxlbWVudFxuICAgICAgICBhc3BlY3Q6IChvKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuYXNwZWN0KG8pXG5cbiAgICByZXR1cm4gVmlld3BvcnRcbikiXX0=
