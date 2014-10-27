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
  ExtManager = _dereq_('./extmanager.coffee');
  NGS = new Base.Events();
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
        Base.log.error("The Core has already been started. You could not add new extensions at this point.");
        throw new Error('You could not add extensions when the Core has already been started.');
      }
    };

    Core.prototype.start = function(options) {
      var cb;
      Base.log.info("Start de Core");
      this.started = true;
      this.extManager.init(this);
      cb = $.Callbacks("unique memory");
      Base.util.each(this.extManager.getInitializedExtensions(), (function(_this) {
        return function(ext, i) {
          if (ext) {
            if (Base.util.isFunction(ext.afterAppStarted)) {
              ext.afterAppStarted(_this);
            }
            if (Base.util.isFunction(ext.afterAppInitialized)) {
              return cb.add(ext.afterAppInitialized);
            }
          }
        };
      })(this));
      return cb.fire(this);
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



},{"./base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee","./extension/components.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/components.coffee","./extension/responsivedesign.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsivedesign.coffee","./extension/responsiveimages.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsiveimages.coffee","./extmanager.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extmanager.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/cookies-js/src/cookies.js":[function(_dereq_,module,exports){
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
  var Base, Component;
  Base = _dereq_('./../base.coffee');
  Component = (function() {
    function Component() {}

    Component.initializedComponents = {};


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
      Component.instantiate(components, app);
      return Component.initializedComponents;
    };

    Component.parseList = function(selector, namespace) {
      var cssSelectors, list, namespaces;
      list = [];
      namespaces = ['platform'];
      if (namespace !== 'platform') {
        namespaces.push(namespace);
      }
      cssSelectors = [];
      Base.util.each(namespaces, function(ns, i) {
        return cssSelectors.push("[data-" + ns + "-component]");
      });
      $(selector).find(cssSelectors.join(',')).each(function(i, comp) {
        var ns, options;
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
      var m, mod, sb;
      if (components.length > 0) {
        m = components.shift();
        if (!Base.util.isEmpty(NGS.modules) && NGS.modules[m.name] && m.options) {
          mod = Base.util.clone(NGS.modules[m.name]);
          sb = app.createSandbox(m.name);
          m.options.guid = Base.util.uniqueId(m.name + "_");
          Base.util.extend(mod, {
            sandbox: sb,
            options: m.options
          });
          mod.initialize();
          $(mod.options.el).data('__guid__', m.options.guid);
          Component.initializedComponents[m.options.guid] = mod;
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
      app.sandbox.startComponents = function(list, app) {
        return initializedComponents = Component.startAll(list, app);
      };
      return app.sandbox.getInitializedComponents = function() {
        return initializedComponents;
      };
    },
    afterAppStarted: function(app) {
      Base.log.info("Calling startComponents from afterAppStarted");
      return app.sandbox.startComponents(null, app);
    },
    name: 'Component Extension',
    classes: Component,
    optionKey: 'components'
  };
});



},{"./../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsivedesign.coffee":[function(_dereq_,module,exports){

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



},{"./../base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extmanager.coffee":[function(_dereq_,module,exports){

/**
 * The Extension Mananger will provide the base set of functionalities
 * to make the Core library extensible.
 * @author Francisco Ramini <framini at gmail.com>
 */
(function(root, factory) {
  return module.exports = factory(root, {});
})(window, function(root, NGS) {
  var Base, ExtManager;
  Base = _dereq_('./base.coffee');
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



},{"./base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/cookies.coffee":[function(_dereq_,module,exports){
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



},{"wolfy87-eventemitter":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/wolfy87-eventemitter/EventEmitter.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/general.coffee":[function(_dereq_,module,exports){
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



},{"loglevel":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/loglevel/lib/loglevel.js"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/versionchecker.coffee":[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL2Nvb2tpZXMtanMvc3JjL2Nvb2tpZXMuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL25vZGVfbW9kdWxlcy9pbWFnZXIuanMvSW1hZ2VyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9ub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL3ZlcmdlL3ZlcmdlLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9ub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRtYW5hZ2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvY29va2llcy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V2ZW50YnVzLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvZ2VuZXJhbC5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2xvZ2dlci5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL3ZlcnNpb25jaGVja2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmlld3BvcnRkZXRlY3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFBQTs7OztHQUFBO0FBQUEsQ0FLQyxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7U0FFRyxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJLENBQUMsR0FBTCxHQUFXLE9BQUEsQ0FBUSxJQUFSLEVBQWMsRUFBZCxFQUYvQjtBQUFBLENBQUQsQ0FBQSxDQUlFLE1BSkYsRUFJVSxTQUFDLElBQUQsRUFBTyxHQUFQLEdBQUE7QUFFTixNQUFBLGdCQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBO0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSLENBRGIsQ0FBQTtBQUFBLEVBSUEsR0FBQSxHQUFVLElBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUpWLENBQUE7QUFBQSxFQU9BLEdBQUcsQ0FBQyxPQUFKLEdBQWMsRUFQZCxDQUFBO0FBQUEsRUFTTSxHQUFHLENBQUM7QUFFTixtQkFBQSxPQUFBLEdBQVMsT0FBVCxDQUFBOztBQUFBLG1CQUVBLEdBQUEsR0FDSTtBQUFBLE1BQUEsS0FBQSxFQUNJO0FBQUEsUUFBQSxRQUFBLEVBQVUsQ0FBVjtPQURKO0FBQUEsTUFHQSxTQUFBLEVBQVcsVUFIWDtBQUFBLE1BS0EsU0FBQSxFQUFXLEVBTFg7S0FISixDQUFBOztBQVVhLElBQUEsY0FBQyxNQUFELEdBQUE7QUFFVCxVQUFBLDhDQUFBOztRQUZVLFNBQVM7T0FFbkI7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFWLENBQW1CLE1BQW5CLEVBQTJCLElBQUMsQ0FBQSxHQUE1QixDQUFWLENBQUE7QUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QSxDQVRaO0FBQUEsSUFZQSxHQUFBLEVBQUssU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO2FBQ0QsUUFBUSxDQUFDLEdBQVQsQ0FBYSxFQUFiLEVBQWlCLE9BQWpCLEVBREM7SUFBQSxDQVpMO0FBQUEsSUFlQSxHQUFBLEVBQUssU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO2FBQ0QsUUFBUSxDQUFDLEdBQVQsQ0FBYSxFQUFiLEVBQWlCLE9BQWpCLEVBREM7SUFBQSxDQWZMO0FBQUEsSUFrQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBbEJUO0FBQUEsSUFxQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUNMLFFBQVEsQ0FBQyxPQUFULENBQUEsRUFESztJQUFBLENBckJUO0FBQUEsSUF5QkEsRUFBQSxFQUFJLFNBQUMsZ0JBQUQsR0FBQTthQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksZ0JBQVosRUFEQTtJQUFBLENBekJKO0FBQUEsSUE0QkEsU0FBQSxFQUFXLFNBQUMsRUFBRCxFQUFLLE9BQUwsR0FBQTthQUNQLFFBQVEsQ0FBQyxTQUFULENBQW1CLEVBQW5CLEVBQXVCLE9BQXZCLEVBRE87SUFBQSxDQTVCWDtBQUFBLElBa0NBLE1BQUEsRUFBUSxTQUFDLENBQUQsR0FBQTthQUNKLFFBQVEsQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBREk7SUFBQSxDQWxDUjtHQUxKLENBQUE7QUEwQ0EsU0FBTyxRQUFQLENBN0NNO0FBQUEsQ0FKVixDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyMjKlxuICogVGhlIGNvcmUgbGF5ZXIgd2lsbCBkZXBlbmQgb24gdGhlIGJhc2UgbGF5ZXIgYW5kIHdpbGwgcHJvdmlkZVxuICogdGhlIGNvcmUgc2V0IG9mIGZ1bmN0aW9uYWxpdHkgdG8gYXBwbGljYXRpb24gZnJhbWV3b3JrXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW1pbmkgYXQgZ21haWwuY29tPlxuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuTkdTID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR1MpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi9iYXNlLmNvZmZlZScpXG4gICAgRXh0TWFuYWdlciA9IHJlcXVpcmUoJy4vZXh0bWFuYWdlci5jb2ZmZWUnKVxuXG4gICAgIyB3ZSdsbCB1c2UgdGhlIE5HUyBvYmplY3QgYXMgdGhlIGdsb2JhbCBFdmVudCBidXNcbiAgICBOR1MgPSBuZXcgQmFzZS5FdmVudHMoKVxuXG4gICAgIyBOYW1lc3BhY2UgZm9yIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgTkdTLm1vZHVsZXMgPSB7fVxuXG4gICAgY2xhc3MgTkdTLkNvcmVcbiAgICAgICAgIyBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGxpYnJhcnlcbiAgICAgICAgdmVyc2lvbjogXCIwLjAuMVwiXG5cbiAgICAgICAgY2ZnOlxuICAgICAgICAgICAgZGVidWc6XG4gICAgICAgICAgICAgICAgbG9nTGV2ZWw6IDUgIyBieSBkZWZhdWx0IHRoZSBsb2dnaW5nIHdpbGwgYmUgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHZhbHVlcyBjYW4gZ28gZnJvbSAwIHRvIDUgKDUgbWVhbnMgZGlzYWJsZWQpXG4gICAgICAgICAgICBuYW1lc3BhY2U6ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgZXh0ZW5zaW9uOiB7fSAjIGRlZmluZSB0aGUgbmFtZXNwYWNlIHRvIGRlZmluZSBleHRlbnNpb24gc3BlY2lmaWMgc2V0dGluZ3NcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIGNvbmZpZywgQGNmZ1xuXG4gICAgICAgICAgICAjIHRoaXMgd2lsbCB0cmFjayB0aGUgc3RhdGUgb2YgdGhlIENvcmUuIFdoZW4gaXQgaXNcbiAgICAgICAgICAgICMgdHJ1ZSwgaXQgbWVhbnMgdGhlIFwic3RhcnQoKVwiIGhhcyBiZWVuIGNhbGxlZFxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAgICAgICAjIFNldCB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhlIGFwcFxuICAgICAgICAgICAgQmFzZS5sb2cuc2V0TGV2ZWwoQGNvbmZpZy5kZWJ1Zy5sb2dMZXZlbClcblxuICAgICAgICAgICAgIyBUaGUgZXh0ZW5zaW9uIG1hbmFnZXIgd2lsbCBiZSBvbiBjaGFyZ2Ugb2YgbG9hZGluZyBleHRlbnNpb25zXG4gICAgICAgICAgICAjIGFuZCBtYWtlIGl0cyBmdW5jdGlvbmFsaXR5IGF2YWlsYWJsZSB0byB0aGUgc3RhY2tcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyID0gbmV3IEV4dE1hbmFnZXIoKVxuXG4gICAgICAgICAgICAjIHRocm91Z2ggdGhpcyBvYmplY3QgdGhlIG1vZHVsZXMgd2lsbCBiZSBhY2Nlc2luZyB0aGUgbWV0aG9kcyBkZWZpbmVkIGJ5IHRoZVxuICAgICAgICAgICAgIyBleHRlbnNpb25zXG4gICAgICAgICAgICBAc2FuZGJveCA9IEJhc2UudXRpbC5jbG9uZSBCYXNlXG5cbiAgICAgICAgICAgICMgbmFtZXNwYWNlIHRvIGhvbGQgYWxsIHRoZSBzYW5kYm94ZXNcbiAgICAgICAgICAgIEBzYW5kYm94ZXMgPSB7fVxuXG4gICAgICAgICAgICAjIFJlcXVpcmUgY29yZSBleHRlbnNpb25zXG4gICAgICAgICAgICBDb21wb25lbnRzID0gcmVxdWlyZSgnLi9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZURlc2lnbiA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVkZXNpZ24uY29mZmVlJylcbiAgICAgICAgICAgIFJlc3BvbnNpdmVJbWFnZXMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9yZXNwb25zaXZlaW1hZ2VzLmNvZmZlZScpXG5cbiAgICAgICAgICAgICMgQWRkIGNvcmUgZXh0ZW5zaW9ucyB0byB0aGUgYXBwXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoQ29tcG9uZW50cylcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChSZXNwb25zaXZlRGVzaWduKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVJbWFnZXMpXG5cbiAgICAgICAgYWRkRXh0ZW5zaW9uOiAoZXh0KSAtPlxuICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IGFsbG93IHRvIGFkZCBuZXcgZXh0ZW5zaW9ucyBiZWZvcmVcbiAgICAgICAgICAgICMgdGhlIENvcmUgZ2V0IHN0YXJ0ZWRcbiAgICAgICAgICAgIHVubGVzcyBAc3RhcnRlZFxuICAgICAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChleHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IoXCJUaGUgQ29yZSBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuIFlvdSBjb3VsZCBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY291bGQgbm90IGFkZCBleHRlbnNpb25zIHdoZW4gdGhlIENvcmUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLicpXG5cbiAgICAgICAgc3RhcnQ6IChvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvKFwiU3RhcnQgZGUgQ29yZVwiKVxuXG4gICAgICAgICAgICBAc3RhcnRlZCA9IHRydWVcblxuICAgICAgICAgICAgIyBJbml0IGFsbCB0aGUgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIuaW5pdChAKVxuXG4gICAgICAgICAgICAjIENhbGxiYWNrIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgZnVuY3Rpb25zIHRvIGJlIGV4ZWN1dGVkXG4gICAgICAgICAgICAjIGFmdGVyIGFsbCBleHRlbnNpb25zIGhhcyBiZWVuIGluaXRpYWxpemVkIGFuZCB0aGUgZWFjaCBhZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICMgbWV0aG9kIGV4ZWN1dGVkXG4gICAgICAgICAgICBjYiA9ICQuQ2FsbGJhY2tzIFwidW5pcXVlIG1lbW9yeVwiXG5cbiAgICAgICAgICAgICMgT25jZSB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQsIGxldHMgY2FsbCB0aGUgYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAjIGZyb20gZWFjaCBleHRlbnNpb25cbiAgICAgICAgICAgICMgTm90ZTogVGhpcyBtZXRob2Qgd2lsbCBsZXQgZWFjaCBleHRlbnNpb24gdG8gYXV0b21hdGljYWxseSBleGVjdXRlIHNvbWUgY29kZVxuICAgICAgICAgICAgIyAgICAgICBvbmNlIHRoZSBhcHAgaGFzIHN0YXJ0ZWQuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBAZXh0TWFuYWdlci5nZXRJbml0aWFsaXplZEV4dGVuc2lvbnMoKSwgKGV4dCwgaSkgPT5cblxuICAgICAgICAgICAgICAgIGlmIGV4dFxuXG4gICAgICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIGV4dC5hZnRlckFwcFN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dC5hZnRlckFwcFN0YXJ0ZWQoQClcblxuICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBleHQuYWZ0ZXJBcHBJbml0aWFsaXplZFxuICAgICAgICAgICAgICAgICAgICAgICAgY2IuYWRkIGV4dC5hZnRlckFwcEluaXRpYWxpemVkXG5cbiAgICAgICAgICAgICMgQ2FsbCB0aGUgLmFmdGVyQXBwSW5pdGlhbGl6ZWQgY2FsbGJhY2tzIHdpdGggQCBhcyBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGNiLmZpcmUgQFxuXG4gICAgICAgIGNyZWF0ZVNhbmRib3g6IChuYW1lLCBvcHRzKSAtPlxuICAgICAgICAgICAgQHNhbmRib3hlc1tuYW1lXSA9IEJhc2UudXRpbC5leHRlbmQge30sIEBzYW5kYm94LCBuYW1lIDogbmFtZVxuXG4gICAgICAgIGdldEluaXRpYWxpemVkQ29tcG9uZW50czogKCkgLT5cbiAgICAgICAgICAgIEBzYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cygpXG5cblxuICAgIHJldHVybiBOR1NcbilcbiIsIi8qIVxuICogQ29va2llcy5qcyAtIDAuNC4wXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBTY290dCBIYW1wZXJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSxcbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cbihmdW5jdGlvbiAodW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIC8vIEFsbG93cyBmb3Igc2V0dGVyIGluamVjdGlvbiBpbiB1bml0IHRlc3RzXG4gICAgQ29va2llcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICBDb29raWVzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XG5cbiAgICBDb29raWVzLmRlZmF1bHRzID0ge1xuICAgICAgICBwYXRoOiAnLydcbiAgICB9O1xuXG4gICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XG4gICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29va2llcy5fY2FjaGVba2V5XTtcbiAgICB9O1xuXG4gICAgQ29va2llcy5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLmV4cGlyZXMgPSBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gLTEgOiBvcHRpb25zLmV4cGlyZXMpO1xuXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBDb29raWVzO1xuICAgIH07XG5cbiAgICBDb29raWVzLmV4cGlyZSA9IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIENvb2tpZXMuc2V0KGtleSwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcbiAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcbiAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcbiAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgQ29va2llcy5faXNWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09PSAnW29iamVjdCBEYXRlXScgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKTtcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUgPSBmdW5jdGlvbiAoZXhwaXJlcywgbm93KSB7XG4gICAgICAgIG5vdyA9IG5vdyB8fCBuZXcgRGF0ZSgpO1xuICAgICAgICBzd2l0Y2ggKHR5cGVvZiBleHBpcmVzKSB7XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOiBleHBpcmVzID0gbmV3IERhdGUobm93LmdldFRpbWUoKSArIGV4cGlyZXMgKiAxMDAwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOiBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV4cGlyZXMgJiYgIUNvb2tpZXMuX2lzVmFsaWREYXRlKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BleHBpcmVzYCBwYXJhbWV0ZXIgY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhIHZhbGlkIERhdGUgaW5zdGFuY2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHBpcmVzO1xuICAgIH07XG5cbiAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcbiAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcbiAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHZhciBjb29raWVTdHJpbmcgPSBrZXkgKyAnPScgKyB2YWx1ZTtcbiAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMucGF0aCA/ICc7cGF0aD0nICsgb3B0aW9ucy5wYXRoIDogJyc7XG4gICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmRvbWFpbiA/ICc7ZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbiA6ICcnO1xuICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5leHBpcmVzID8gJztleHBpcmVzPScgKyBvcHRpb25zLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnO1xuICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5zZWN1cmUgPyAnO3NlY3VyZScgOiAnJztcblxuICAgICAgICByZXR1cm4gY29va2llU3RyaW5nO1xuICAgIH07XG5cbiAgICBDb29raWVzLl9nZXRDb29raWVPYmplY3RGcm9tU3RyaW5nID0gZnVuY3Rpb24gKGRvY3VtZW50Q29va2llKSB7XG4gICAgICAgIHZhciBjb29raWVPYmplY3QgPSB7fTtcbiAgICAgICAgdmFyIGNvb2tpZXNBcnJheSA9IGRvY3VtZW50Q29va2llID8gZG9jdW1lbnRDb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcblxuICAgICAgICAgICAgaWYgKGNvb2tpZU9iamVjdFtjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29va2llT2JqZWN0W2Nvb2tpZUt2cC5rZXldID0gY29va2llS3ZwLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvb2tpZU9iamVjdDtcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChjb29raWVTdHJpbmcpIHtcbiAgICAgICAgLy8gXCI9XCIgaXMgYSB2YWxpZCBjaGFyYWN0ZXIgaW4gYSBjb29raWUgdmFsdWUgYWNjb3JkaW5nIHRvIFJGQzYyNjUsIHNvIGNhbm5vdCBgc3BsaXQoJz0nKWBcbiAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gY29va2llU3RyaW5nLmluZGV4T2YoJz0nKTtcblxuICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cigwLCBzZXBhcmF0b3JJbmRleCkpLFxuICAgICAgICAgICAgdmFsdWU6IGRlY29kZVVSSUNvbXBvbmVudChjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkpXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIENvb2tpZXMuX3JlbmV3Q2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIENvb2tpZXMuX2NhY2hlID0gQ29va2llcy5fZ2V0Q29va2llT2JqZWN0RnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xuICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcbiAgICB9O1xuXG4gICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XG4gICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XG4gICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xuICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcbiAgICB9O1xuXG4gICAgQ29va2llcy5lbmFibGVkID0gQ29va2llcy5fYXJlRW5hYmxlZCgpO1xuXG4gICAgLy8gQU1EIHN1cHBvcnRcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBDb29raWVzOyB9KTtcbiAgICAvLyBDb21tb25KUyBhbmQgTm9kZS5qcyBtb2R1bGUgc3VwcG9ydC5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gQ29va2llcztcbiAgICAgICAgfVxuICAgICAgICAvLyBCdXQgYWx3YXlzIHN1cHBvcnQgQ29tbW9uSlMgbW9kdWxlIDEuMS4xIHNwZWMgKGBleHBvcnRzYCBjYW5ub3QgYmUgYSBmdW5jdGlvbilcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gQ29va2llcztcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuQ29va2llcyA9IENvb2tpZXM7XG4gICAgfVxufSkoKTsiLCI7XG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRlZmF1bHRXaWR0aHMsIGdldEtleXMsIG5leHRUaWNrLCBhZGRFdmVudCwgZ2V0TmF0dXJhbFdpZHRoO1xuXG4gICAgbmV4dFRpY2sgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFwcGx5RWFjaChjb2xsZWN0aW9uLCBjYWxsYmFja0VhY2gpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgICAgICBuZXdfY29sbGVjdGlvbiA9IFtdO1xuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5ld19jb2xsZWN0aW9uW2ldID0gY2FsbGJhY2tFYWNoKGNvbGxlY3Rpb25baV0sIGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld19jb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldHVybkRpcmVjdFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXROYXR1cmFsV2lkdGggPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyksICduYXR1cmFsV2lkdGgnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlLm5hdHVyYWxXaWR0aDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gSUU4IGFuZCBiZWxvdyBsYWNrcyB0aGUgbmF0dXJhbFdpZHRoIHByb3BlcnR5XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGltZy5zcmMgPSBzb3VyY2Uuc3JjO1xuICAgICAgICAgICAgcmV0dXJuIGltZy53aWR0aDtcbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgYWRkRXZlbnQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWRkU3RhbmRhcmRFdmVudExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGZuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmbiwgZmFsc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBhZGRJRUV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICBkZWZhdWx0V2lkdGhzID0gWzk2LCAxMzAsIDE2NSwgMjAwLCAyMzUsIDI3MCwgMzA0LCAzNDAsIDM3NSwgNDEwLCA0NDUsIDQ4NSwgNTIwLCA1NTUsIDU5MCwgNjI1LCA2NjAsIDY5NSwgNzM2XTtcblxuICAgIGdldEtleXMgPSB0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgPyBPYmplY3Qua2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICB2YXIga2V5cyA9IFtdLFxuICAgICAgICAgICAga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAgICBDb25zdHJ1Y3QgYSBuZXcgSW1hZ2VyIGluc3RhbmNlLCBwYXNzaW5nIGFuIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuXG4gICAgICAgIEV4YW1wbGUgdXNhZ2U6XG5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBBdmFpbGFibGUgd2lkdGhzIGZvciB5b3VyIGltYWdlc1xuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogW051bWJlcl0sXG5cbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RvciB0byBiZSB1c2VkIHRvIGxvY2F0ZSB5b3VyIGRpdiBwbGFjZWhvbGRlcnNcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJycsXG5cbiAgICAgICAgICAgICAgICAvLyBDbGFzcyBuYW1lIHRvIGdpdmUgeW91ciByZXNpemFibGUgaW1hZ2VzXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnJyxcblxuICAgICAgICAgICAgICAgIC8vIElmIHNldCB0byB0cnVlLCBJbWFnZXIgd2lsbCB1cGRhdGUgdGhlIHNyYyBhdHRyaWJ1dGUgb2YgdGhlIHJlbGV2YW50IGltYWdlc1xuICAgICAgICAgICAgICAgIG9uUmVzaXplOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAgICAgLy8gVG9nZ2xlIHRoZSBsYXp5IGxvYWQgZnVuY3Rpb25hbGl0eSBvbiBvciBvZmZcbiAgICAgICAgICAgICAgICBsYXp5bG9hZDogQm9vbGVhbixcblxuICAgICAgICAgICAgICAgIC8vIFVzZWQgYWxvbmdzaWRlIHRoZSBsYXp5bG9hZCBmZWF0dXJlIChoZWxwcyBwZXJmb3JtYW5jZSBieSBzZXR0aW5nIGEgaGlnaGVyIGRlbGF5KVxuICAgICAgICAgICAgICAgIHNjcm9sbERlbGF5OiBOdW1iZXJcbiAgICAgICAgICAgIH1cblxuICAgICAgICBAcGFyYW0ge29iamVjdH0gY29uZmlndXJhdGlvbiBzZXR0aW5nc1xuICAgICAgICBAcmV0dXJuIHtvYmplY3R9IGluc3RhbmNlIG9mIEltYWdlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEltYWdlcihlbGVtZW50cywgb3B0cykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBkb2MgPSBkb2N1bWVudDtcblxuICAgICAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgICAgICBpZiAoZWxlbWVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gZmlyc3QgYXJndW1lbnQgaXMgc2VsZWN0b3Igc3RyaW5nXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIG9wdHMuc2VsZWN0b3IgPSBlbGVtZW50cztcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlyc3QgYXJndW1lbnQgaXMgdGhlIGBvcHRzYCBvYmplY3QsIGBlbGVtZW50c2AgaXMgaW1wbGljaXRseSB0aGUgYG9wdHMuc2VsZWN0b3JgIHN0cmluZ1xuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnRzLmxlbmd0aCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBvcHRzID0gZWxlbWVudHM7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmltYWdlc09mZlNjcmVlbiA9IFtdO1xuICAgICAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSBvcHRzLnNlbGVjdG9yIHx8ICcuZGVsYXllZC1pbWFnZS1sb2FkJztcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBvcHRzLmNsYXNzTmFtZSB8fCAnaW1hZ2UtcmVwbGFjZSc7XG4gICAgICAgIHRoaXMuZ2lmID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICB0aGlzLmdpZi5zcmMgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoRUFBSkFJQUFBUC8vL3dBQUFDSDVCQUVBQUFBQUxBQUFBQUFRQUFrQUFBSUtoSStweSswUG81eVVGUUE3JztcbiAgICAgICAgdGhpcy5naWYuY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWU7XG4gICAgICAgIHRoaXMuZ2lmLmFsdCA9ICcnO1xuICAgICAgICB0aGlzLnNjcm9sbERlbGF5ID0gb3B0cy5zY3JvbGxEZWxheSB8fCAyNTA7XG4gICAgICAgIHRoaXMub25SZXNpemUgPSBvcHRzLmhhc093blByb3BlcnR5KCdvblJlc2l6ZScpID8gb3B0cy5vblJlc2l6ZSA6IHRydWU7XG4gICAgICAgIHRoaXMubGF6eWxvYWQgPSBvcHRzLmhhc093blByb3BlcnR5KCdsYXp5bG9hZCcpID8gb3B0cy5sYXp5bG9hZCA6IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlUGl4ZWxSYXRpb3MgPSBvcHRzLmF2YWlsYWJsZVBpeGVsUmF0aW9zIHx8IFsxLCAyXTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVXaWR0aHMgPSBvcHRzLmF2YWlsYWJsZVdpZHRocyB8fCBkZWZhdWx0V2lkdGhzO1xuICAgICAgICB0aGlzLm9uSW1hZ2VzUmVwbGFjZWQgPSBvcHRzLm9uSW1hZ2VzUmVwbGFjZWQgfHwgZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgdGhpcy53aWR0aHNNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5yZWZyZXNoUGl4ZWxSYXRpbygpO1xuICAgICAgICB0aGlzLndpZHRoSW50ZXJwb2xhdG9yID0gb3B0cy53aWR0aEludGVycG9sYXRvciB8fCByZXR1cm5EaXJlY3RWYWx1ZTtcbiAgICAgICAgdGhpcy5kZWx0YVNxdWFyZSA9IG9wdHMuZGVsdGFTcXVhcmUgfHwgMS41O1xuICAgICAgICB0aGlzLnNxdWFyZVNlbGVjdG9yID0gb3B0cy5zcXVhcmVTZWxlY3RvciB8fCAnc3FyY3JvcCc7XG4gICAgICAgIHRoaXMuYWRhcHRTZWxlY3RvciA9IHRoaXMuYWRhcHRTZWxlY3RvciB8fCAnYWRhcHQnO1xuXG4gICAgICAgIC8vIE5lZWRlZCBhcyBJRTggYWRkcyBhIGRlZmF1bHQgYHdpZHRoYC9gaGVpZ2h0YCBhdHRyaWJ1dGXigKZcbiAgICAgICAgdGhpcy5naWYucmVtb3ZlQXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgICAgdGhpcy5naWYucmVtb3ZlQXR0cmlidXRlKCd3aWR0aCcpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hdmFpbGFibGVXaWR0aHMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5hdmFpbGFibGVXaWR0aHMubGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGhzTWFwID0gSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCh0aGlzLmF2YWlsYWJsZVdpZHRocywgdGhpcy53aWR0aEludGVycG9sYXRvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGhzTWFwID0gdGhpcy5hdmFpbGFibGVXaWR0aHM7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVXaWR0aHMgPSBnZXRLZXlzKHRoaXMuYXZhaWxhYmxlV2lkdGhzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVXaWR0aHMgPSB0aGlzLmF2YWlsYWJsZVdpZHRocy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBpZiAoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2cyA9IGFwcGx5RWFjaChlbGVtZW50cywgcmV0dXJuRGlyZWN0VmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpdnMgPSBhcHBseUVhY2goZG9jLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvciksIHJldHVybkRpcmVjdFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMoKTtcblxuICAgICAgICBuZXh0VGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnNjcm9sbENoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1hZ2VzT2ZmU2NyZWVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRpdnMgPSB0aGlzLmltYWdlc09mZlNjcmVlbi5zbGljZSgwKTsgLy8gY29weSBieSB2YWx1ZSwgZG9uJ3QgY29weSBieSByZWZlcmVuY2VcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzT2ZmU2NyZWVuLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuXG4gICAgICAgIGlmICh0aGlzLm9uUmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyUmVzaXplRXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhenlsb2FkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyU2Nyb2xsRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNyZWF0ZUdpZiA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBhIHJlc3BvbnNpdmUgaW1hZ2UgdGhlbiB3ZSBkb24ndCByZXBsYWNlIGl0IGFnYWluXG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXnwgKScgKyB0aGlzLmNsYXNzTmFtZSArICcoIHwkKScpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbWVudENsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyk7XG4gICAgICAgIHZhciBlbGVtZW50V2lkdGggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpO1xuICAgICAgICB2YXIgZ2lmID0gdGhpcy5naWYuY2xvbmVOb2RlKGZhbHNlKTtcblxuICAgICAgICBpZiAoZWxlbWVudFdpZHRoKSB7XG4gICAgICAgICAgICBnaWYud2lkdGggPSBlbGVtZW50V2lkdGg7XG4gICAgICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJywgZWxlbWVudFdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdpZi5jbGFzc05hbWUgPSAoZWxlbWVudENsYXNzTmFtZSA/IGVsZW1lbnRDbGFzc05hbWUgKyAnICcgOiAnJykgKyB0aGlzLmNsYXNzTmFtZTtcbiAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2FsdCcsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWFsdCcpIHx8IHRoaXMuZ2lmLmFsdCk7XG5cbiAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChnaWYsIGVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiBnaWY7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hhbmdlRGl2c1RvRW1wdHlJbWFnZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGFwcGx5RWFjaCh0aGlzLmRpdnMsIGZ1bmN0aW9uKGVsZW1lbnQsIGkpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmxhenlsb2FkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNUaGlzRWxlbWVudE9uU2NyZWVuKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGl2c1tpXSA9IHNlbGYuY3JlYXRlR2lmKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW1hZ2VzT2ZmU2NyZWVuLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRpdnNbaV0gPSBzZWxmLmNyZWF0ZUdpZihlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHRoaXMuZGl2cyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pc1RoaXNFbGVtZW50T25TY3JlZW4gPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHdhcyB3b3JraW5nIGluIENocm9tZSBidXQgZGlkbid0IHdvcmsgb24gRmlyZWZveCwgc28gaGFkIHRvIHJlc29ydCB0byB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgLy8gYnV0IGNhbid0IGZhbGxiYWNrIHRvIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIGFzIHRoYXQgZG9lc24ndCB3b3JrIGluIElFIHdpdGggYSBkb2N0eXBlICg/KSBzbyBoYXZlIHRvIHVzZSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICAgIHZhciBvZmZzZXQgPSBJbWFnZXIuZ2V0UGFnZU9mZnNldCgpO1xuICAgICAgICB2YXIgZWxlbWVudE9mZnNldFRvcCA9IDA7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgZWxlbWVudE9mZnNldFRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChlbGVtZW50T2Zmc2V0VG9wIDwgKHRoaXMudmlld3BvcnRIZWlnaHQgKyBvZmZzZXQpKSA/IHRydWUgOiBmYWxzZTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcgPSBmdW5jdGlvbihpbWFnZXMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghdGhpcy5pc1Jlc2l6aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoUGl4ZWxSYXRpbygpO1xuXG4gICAgICAgICAgICBhcHBseUVhY2goaW1hZ2VzLCBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVwbGFjZUltYWdlc0Jhc2VkT25TY3JlZW5EaW1lbnNpb25zKGltYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25JbWFnZXNSZXBsYWNlZChpbWFnZXMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVwbGFjZUltYWdlc0Jhc2VkT25TY3JlZW5EaW1lbnNpb25zID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgdmFyIGNvbXB1dGVkV2lkdGgsIHNyYywgbmF0dXJhbFdpZHRoO1xuXG4gICAgICAgIG5hdHVyYWxXaWR0aCA9IGdldE5hdHVyYWxXaWR0aChpbWFnZSk7XG4gICAgICAgIGNvbXB1dGVkV2lkdGggPSB0eXBlb2YgdGhpcy5hdmFpbGFibGVXaWR0aHMgPT09ICdmdW5jdGlvbicgPyB0aGlzLmF2YWlsYWJsZVdpZHRocyhpbWFnZSkgOiB0aGlzLmRldGVybWluZUFwcHJvcHJpYXRlUmVzb2x1dGlvbihpbWFnZSk7XG5cbiAgICAgICAgaW1hZ2Uud2lkdGggPSBjb21wdXRlZFdpZHRoO1xuXG4gICAgICAgIGlmIChpbWFnZS5zcmMgIT09IHRoaXMuZ2lmLnNyYyAmJiBjb21wdXRlZFdpZHRoIDw9IG5hdHVyYWxXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3JjID0gdGhpcy5jaGFuZ2VJbWFnZVNyY1RvVXNlTmV3SW1hZ2VEaW1lbnNpb25zKHRoaXMuYnVpbGRVcmxTdHJ1Y3R1cmUoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpLCBpbWFnZSksIGNvbXB1dGVkV2lkdGgpO1xuXG4gICAgICAgIGltYWdlLnNyYyA9IHNyYztcblxuICAgICAgICBpZiAoQmFja2JvbmUpIHtcbiAgICAgICAgICAgIEJhY2tib25lLnRyaWdnZXIoJ2ltYWdlcjpyZWFkeScpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5kZXRlcm1pbmVBcHByb3ByaWF0ZVJlc29sdXRpb24gPSBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICByZXR1cm4gSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZShpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKSB8fCBpbWFnZS5wYXJlbnROb2RlLmNsaWVudFdpZHRoLCB0aGlzLmF2YWlsYWJsZVdpZHRocyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGRldmljZSBwaXhlbCByYXRpbyB2YWx1ZSB1c2VkIGJ5IEltYWdlclxuICAgICAqXG4gICAgICogSXQgaXMgcGVyZm9ybWVkIGJlZm9yZSBlYWNoIHJlcGxhY2VtZW50IGxvb3AsIGluIGNhc2UgYSB1c2VyIHpvb21lZCBpbi9vdXRcbiAgICAgKiBhbmQgdGh1cyB1cGRhdGVkIHRoZSBgd2luZG93LmRldmljZVBpeGVsUmF0aW9gIHZhbHVlLlxuICAgICAqXG4gICAgICogQGFwaVxuICAgICAqIEBzaW5jZSAxLjAuMVxuICAgICAqL1xuICAgIEltYWdlci5wcm90b3R5cGUucmVmcmVzaFBpeGVsUmF0aW8gPSBmdW5jdGlvbiByZWZyZXNoUGl4ZWxSYXRpbygpIHtcbiAgICAgICAgdGhpcy5kZXZpY2VQaXhlbFJhdGlvID0gSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZShJbWFnZXIuZ2V0UGl4ZWxSYXRpbygpLCB0aGlzLmF2YWlsYWJsZVBpeGVsUmF0aW9zKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jaGFuZ2VJbWFnZVNyY1RvVXNlTmV3SW1hZ2VEaW1lbnNpb25zID0gZnVuY3Rpb24oc3JjLCBzZWxlY3RlZFdpZHRoKSB7XG4gICAgICAgIHJldHVybiBzcmNcbiAgICAgICAgICAgIC5yZXBsYWNlKC97d2lkdGh9L2csIEltYWdlci50cmFuc2Zvcm1zLndpZHRoKHNlbGVjdGVkV2lkdGgsIHRoaXMud2lkdGhzTWFwKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC97cGl4ZWxfcmF0aW99L2csIEltYWdlci50cmFuc2Zvcm1zLnBpeGVsUmF0aW8odGhpcy5kZXZpY2VQaXhlbFJhdGlvKSk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuYnVpbGRVcmxTdHJ1Y3R1cmUgPSBmdW5jdGlvbihzcmMsIGltYWdlKSB7XG4gICAgICAgIHZhciBzcXVhcmVTZWxlY3RvciA9IHRoaXMuaXNJbWFnZUNvbnRhaW5lclNxdWFyZShpbWFnZSkgPyAnLicgKyB0aGlzLnNxdWFyZVNlbGVjdG9yIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIHNyY1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLihqcGd8Z2lmfGJtcHxwbmcpW15zXT8oe3dpZHRofSk/W15zXSh7cGl4ZWxfcmF0aW99KT8vZywgJy4nICsgdGhpcy5hZGFwdFNlbGVjdG9yICsgJy4kMi4kMycgKyBzcXVhcmVTZWxlY3RvciArICcuJDEnKTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5pc0ltYWdlQ29udGFpbmVyU3F1YXJlID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIChpbWFnZS5wYXJlbnROb2RlLmNsaWVudFdpZHRoIC8gaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRIZWlnaHQpIDw9IHRoaXMuZGVsdGFTcXVhcmVcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBpeGVsUmF0aW8gPSBmdW5jdGlvbiBnZXRQaXhlbFJhdGlvKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIChjb250ZXh0IHx8IHdpbmRvdylbJ2RldmljZVBpeGVsUmF0aW8nXSB8fCAxO1xuICAgIH07XG5cbiAgICBJbWFnZXIuY3JlYXRlV2lkdGhzTWFwID0gZnVuY3Rpb24gY3JlYXRlV2lkdGhzTWFwKHdpZHRocywgaW50ZXJwb2xhdG9yKSB7XG4gICAgICAgIHZhciBtYXAgPSB7fSxcbiAgICAgICAgICAgIGkgPSB3aWR0aHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIG1hcFt3aWR0aHNbaV1dID0gaW50ZXJwb2xhdG9yKHdpZHRoc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH07XG5cbiAgICBJbWFnZXIudHJhbnNmb3JtcyA9IHtcbiAgICAgICAgcGl4ZWxSYXRpbzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoLCBtYXApIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBbd2lkdGhdIHx8IHdpZHRoO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNsb3Nlc3QgdXBwZXIgdmFsdWUuXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqIHZhciBjYW5kaWRhdGVzID0gWzEsIDEuNSwgMl07XG4gICAgICpcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDAuOCwgY2FuZGlkYXRlcyk7IC8vIC0+IDFcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDEsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLjMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxLjVcbiAgICAgKiBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlKDMsIGNhbmRpZGF0ZXMpOyAvLyAtPiAyXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAYXBpXG4gICAgICogQHNpbmNlIDEuMC4xXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJhc2VWYWx1ZVxuICAgICAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGNhbmRpZGF0ZXNcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIEltYWdlci5nZXRDbG9zZXN0VmFsdWUgPSBmdW5jdGlvbiBnZXRDbG9zZXN0VmFsdWUoYmFzZVZhbHVlLCBjYW5kaWRhdGVzKSB7XG4gICAgICAgIHZhciBpID0gY2FuZGlkYXRlcy5sZW5ndGgsXG4gICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpIC0gMV07XG5cbiAgICAgICAgYmFzZVZhbHVlID0gcGFyc2VGbG9hdChiYXNlVmFsdWUsIDEwKTtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoYmFzZVZhbHVlIDw9IGNhbmRpZGF0ZXNbaV0pIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFdpZHRoID0gY2FuZGlkYXRlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxlY3RlZFdpZHRoO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyUmVzaXplRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcoc2VsZi5kaXZzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUucmVnaXN0ZXJTY3JvbGxFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnNjcm9sbENoZWNrKCk7XG4gICAgICAgIH0sIHNlbGYuc2Nyb2xsRGVsYXkpO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvciA9IGZ1bmN0aW9uIGdldFBhZ2VWZXJ0aWNhbE9mZnNldCh0ZXN0Q2FzZSkge1xuICAgICAgICBpZiAodGVzdENhc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmb3JtIGlzIHVzZWQgYmVjYXVzZSBpdCBzZWVtcyBpbXBvc3NpYmxlIHRvIHN0dWIgYHdpbmRvdy5wYWdlWU9mZnNldGBcbiAgICBJbWFnZXIuZ2V0UGFnZU9mZnNldCA9IEltYWdlci5nZXRQYWdlT2Zmc2V0R2VuZXJhdG9yKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh3aW5kb3csICdwYWdlWU9mZnNldCcpKTtcblxuICAgIC8vIEV4cG9ydGluZyBmb3IgdGVzdGluZyBwdXJwb3NlXG4gICAgSW1hZ2VyLmFwcGx5RWFjaCA9IGFwcGx5RWFjaDtcblxuICAgIC8qIGdsb2JhbCBtb2R1bGUsIGV4cG9ydHM6IHRydWUsIGRlZmluZSAqL1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTLCBqdXN0IGV4cG9ydFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBJbWFnZXI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EIHN1cHBvcnRcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIEltYWdlcjtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBJZiBubyBBTUQgYW5kIHdlIGFyZSBpbiB0aGUgYnJvd3NlciwgYXR0YWNoIHRvIHdpbmRvd1xuICAgICAgICB3aW5kb3cuSW1hZ2VyID0gSW1hZ2VyO1xuICAgIH1cbiAgICAvKiBnbG9iYWwgLW1vZHVsZSwgLWV4cG9ydHMsIC1kZWZpbmUgKi9cblxufSh3aW5kb3csIGRvY3VtZW50KSk7IiwiLyoqXG4gKiBpc01vYmlsZS5qcyB2MC4zLjJcbiAqXG4gKiBBIHNpbXBsZSBsaWJyYXJ5IHRvIGRldGVjdCBBcHBsZSBwaG9uZXMgYW5kIHRhYmxldHMsXG4gKiBBbmRyb2lkIHBob25lcyBhbmQgdGFibGV0cywgb3RoZXIgbW9iaWxlIGRldmljZXMgKGxpa2UgYmxhY2tiZXJyeSwgbWluaS1vcGVyYSBhbmQgd2luZG93cyBwaG9uZSksXG4gKiBhbmQgYW55IGtpbmQgb2Ygc2V2ZW4gaW5jaCBkZXZpY2UsIHZpYSB1c2VyIGFnZW50IHNuaWZmaW5nLlxuICpcbiAqIEBhdXRob3I6IEthaSBNYWxsZWEgKGttYWxsZWFAZ21haWwuY29tKVxuICpcbiAqIEBsaWNlbnNlOiBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cbiAgICB2YXIgYXBwbGVfcGhvbmUgICAgICA9IC9pUGhvbmUvaSxcbiAgICAgICAgYXBwbGVfaXBvZCAgICAgICA9IC9pUG9kL2ksXG4gICAgICAgIGFwcGxlX3RhYmxldCAgICAgPSAvaVBhZC9pLFxuICAgICAgICBhbmRyb2lkX3Bob25lICAgID0gLyg/PS4qXFxiQW5kcm9pZFxcYikoPz0uKlxcYk1vYmlsZVxcYikvaSwgLy8gTWF0Y2ggJ0FuZHJvaWQnIEFORCAnTW9iaWxlJ1xuICAgICAgICBhbmRyb2lkX3RhYmxldCAgID0gL0FuZHJvaWQvaSxcbiAgICAgICAgd2luZG93c19waG9uZSAgICA9IC9JRU1vYmlsZS9pLFxuICAgICAgICB3aW5kb3dzX3RhYmxldCAgID0gLyg/PS4qXFxiV2luZG93c1xcYikoPz0uKlxcYkFSTVxcYikvaSwgLy8gTWF0Y2ggJ1dpbmRvd3MnIEFORCAnQVJNJ1xuICAgICAgICBvdGhlcl9ibGFja2JlcnJ5ID0gL0JsYWNrQmVycnkvaSxcbiAgICAgICAgb3RoZXJfb3BlcmEgICAgICA9IC9PcGVyYSBNaW5pL2ksXG4gICAgICAgIG90aGVyX2ZpcmVmb3ggICAgPSAvKD89LipcXGJGaXJlZm94XFxiKSg/PS4qXFxiTW9iaWxlXFxiKS9pLCAvLyBNYXRjaCAnRmlyZWZveCcgQU5EICdNb2JpbGUnXG4gICAgICAgIHNldmVuX2luY2ggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJyg/OicgKyAgICAgICAgIC8vIE5vbi1jYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICAgICAgJ05leHVzIDcnICsgICAgIC8vIE5leHVzIDdcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdCTlRWMjUwJyArICAgICAvLyBCJk4gTm9vayBUYWJsZXQgNyBpbmNoXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnS2luZGxlIEZpcmUnICsgLy8gS2luZGxlIEZpcmVcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdTaWxrJyArICAgICAgICAvLyBLaW5kbGUgRmlyZSwgU2lsayBBY2NlbGVyYXRlZFxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0dULVAxMDAwJyArICAgIC8vIEdhbGF4eSBUYWIgNyBpbmNoXG5cbiAgICAgICAgICAgICcpJywgICAgICAgICAgICAvLyBFbmQgbm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnaScpOyAgICAgICAgICAgLy8gQ2FzZS1pbnNlbnNpdGl2ZSBtYXRjaGluZ1xuXG4gICAgdmFyIG1hdGNoID0gZnVuY3Rpb24ocmVnZXgsIHVzZXJBZ2VudCkge1xuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh1c2VyQWdlbnQpO1xuICAgIH07XG5cbiAgICB2YXIgSXNNb2JpbGVDbGFzcyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCkge1xuICAgICAgICB2YXIgdWEgPSB1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgICAgICB0aGlzLmFwcGxlID0ge1xuICAgICAgICAgICAgcGhvbmU6ICBtYXRjaChhcHBsZV9waG9uZSwgdWEpLFxuICAgICAgICAgICAgaXBvZDogICBtYXRjaChhcHBsZV9pcG9kLCB1YSksXG4gICAgICAgICAgICB0YWJsZXQ6IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhcHBsZV9waG9uZSwgdWEpIHx8IG1hdGNoKGFwcGxlX2lwb2QsIHVhKSB8fCBtYXRjaChhcHBsZV90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFuZHJvaWQgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogIW1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSAmJiBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaChhbmRyb2lkX3Bob25lLCB1YSkgfHwgbWF0Y2goYW5kcm9pZF90YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKHdpbmRvd3NfcGhvbmUsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2god2luZG93c190YWJsZXQsIHVhKSxcbiAgICAgICAgICAgIGRldmljZTogbWF0Y2god2luZG93c19waG9uZSwgdWEpIHx8IG1hdGNoKHdpbmRvd3NfdGFibGV0LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vdGhlciA9IHtcbiAgICAgICAgICAgIGJsYWNrYmVycnk6IG1hdGNoKG90aGVyX2JsYWNrYmVycnksIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgIG1hdGNoKG90aGVyX29wZXJhLCB1YSksXG4gICAgICAgICAgICBmaXJlZm94OiAgICBtYXRjaChvdGhlcl9maXJlZm94LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6ICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSB8fCBtYXRjaChvdGhlcl9maXJlZm94LCB1YSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXZlbl9pbmNoID0gbWF0Y2goc2V2ZW5faW5jaCwgdWEpO1xuICAgICAgICB0aGlzLmFueSA9IHRoaXMuYXBwbGUuZGV2aWNlIHx8IHRoaXMuYW5kcm9pZC5kZXZpY2UgfHwgdGhpcy53aW5kb3dzLmRldmljZSB8fCB0aGlzLm90aGVyLmRldmljZSB8fCB0aGlzLnNldmVuX2luY2g7XG4gICAgICAgIC8vIGV4Y2x1ZGVzICdvdGhlcicgZGV2aWNlcyBhbmQgaXBvZHMsIHRhcmdldGluZyB0b3VjaHNjcmVlbiBwaG9uZXNcbiAgICAgICAgdGhpcy5waG9uZSA9IHRoaXMuYXBwbGUucGhvbmUgfHwgdGhpcy5hbmRyb2lkLnBob25lIHx8IHRoaXMud2luZG93cy5waG9uZTtcbiAgICAgICAgLy8gZXhjbHVkZXMgNyBpbmNoIGRldmljZXMsIGNsYXNzaWZ5aW5nIGFzIHBob25lIG9yIHRhYmxldCBpcyBsZWZ0IHRvIHRoZSB1c2VyXG4gICAgICAgIHRoaXMudGFibGV0ID0gdGhpcy5hcHBsZS50YWJsZXQgfHwgdGhpcy5hbmRyb2lkLnRhYmxldCB8fCB0aGlzLndpbmRvd3MudGFibGV0O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBJTSA9IG5ldyBJc01vYmlsZUNsYXNzKCk7XG4gICAgICAgIElNLkNsYXNzID0gSXNNb2JpbGVDbGFzcztcbiAgICAgICAgcmV0dXJuIElNO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL25vZGVcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBJc01vYmlsZUNsYXNzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvL2Jyb3dzZXJpZnlcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vQU1EXG4gICAgICAgIGRlZmluZShpbnN0YW50aWF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnbG9iYWwuaXNNb2JpbGUgPSBpbnN0YW50aWF0ZSgpO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCIvKlxyXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXHJcbipcclxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB7fTtcclxuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcclxuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcclxuXHJcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcclxuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2dNZXRob2RzID0gW1xyXG4gICAgICAgIFwidHJhY2VcIixcclxuICAgICAgICBcImRlYnVnXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJ3YXJuXCIsXHJcbiAgICAgICAgXCJlcnJvclwiXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XHJcbiAgICAgICAgICAgIHNlbGZbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/IG5vb3AgOiBzZWxmLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XHJcbiAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddID0gbGV2ZWxOYW1lO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID0gXCJsb2dsZXZlbD1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUGVyc2lzdGVkTGV2ZWwoKSB7XHJcbiAgICAgICAgdmFyIHN0b3JlZExldmVsO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2xvZ2xldmVsJ107XHJcbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9sb2dsZXZlbD0oW147XSspLy5leGVjKHdpbmRvdy5kb2N1bWVudC5jb29raWUpWzFdO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzdG9yZWRMZXZlbCA9IFwiV0FSTlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKlxyXG4gICAgICogUHVibGljIEFQSVxyXG4gICAgICpcclxuICAgICAqL1xyXG5cclxuICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxyXG4gICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XHJcblxyXG4gICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcclxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcclxuICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcclxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcclxuICAgIHNlbGYubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXHJcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IHNlbGYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZFBlcnNpc3RlZExldmVsKCk7XHJcbiAgICByZXR1cm4gc2VsZjtcclxufSkpO1xyXG4iLCIvKiFcclxuICogdmVyZ2UgMS45LjErMjAxNDAyMTMwODAzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFudmUvdmVyZ2VcclxuICogTUlUIExpY2Vuc2UgMjAxMyBSeWFuIFZhbiBFdHRlblxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihyb290LCBuYW1lLCBtYWtlKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIG1vZHVsZVsnZXhwb3J0cyddID0gbWFrZSgpO1xyXG4gIGVsc2Ugcm9vdFtuYW1lXSA9IG1ha2UoKTtcclxufSh0aGlzLCAndmVyZ2UnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIHhwb3J0cyA9IHt9XHJcbiAgICAsIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93XHJcbiAgICAsIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudFxyXG4gICAgLCBkb2NFbGVtID0gZG9jICYmIGRvYy5kb2N1bWVudEVsZW1lbnRcclxuICAgICwgbWF0Y2hNZWRpYSA9IHdpblsnbWF0Y2hNZWRpYSddIHx8IHdpblsnbXNNYXRjaE1lZGlhJ11cclxuICAgICwgbXEgPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24ocSkge1xyXG4gICAgICAgIHJldHVybiAhIW1hdGNoTWVkaWEuY2FsbCh3aW4sIHEpLm1hdGNoZXM7XHJcbiAgICAgIH0gOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICwgdmlld3BvcnRXID0geHBvcnRzWyd2aWV3cG9ydFcnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBhID0gZG9jRWxlbVsnY2xpZW50V2lkdGgnXSwgYiA9IHdpblsnaW5uZXJXaWR0aCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0SCA9IHhwb3J0c1sndmlld3BvcnRIJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudEhlaWdodCddLCBiID0gd2luWydpbm5lckhlaWdodCddO1xyXG4gICAgICAgIHJldHVybiBhIDwgYiA/IGIgOiBhO1xyXG4gICAgICB9O1xyXG4gIFxyXG4gIC8qKiBcclxuICAgKiBUZXN0IGlmIGEgbWVkaWEgcXVlcnkgaXMgYWN0aXZlLiBMaWtlIE1vZGVybml6ci5tcVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovICBcclxuICB4cG9ydHNbJ21xJ10gPSBtcTtcclxuXHJcbiAgLyoqIFxyXG4gICAqIE5vcm1hbGl6ZWQgbWF0Y2hNZWRpYVxyXG4gICAqIEBzaW5jZSAxLjYuMFxyXG4gICAqIEByZXR1cm4ge01lZGlhUXVlcnlMaXN0fE9iamVjdH1cclxuICAgKi8gXHJcbiAgeHBvcnRzWydtYXRjaE1lZGlhJ10gPSBtYXRjaE1lZGlhID8gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBtYXRjaE1lZGlhIG11c3QgYmUgYmluZGVkIHRvIHdpbmRvd1xyXG4gICAgcmV0dXJuIG1hdGNoTWVkaWEuYXBwbHkod2luLCBhcmd1bWVudHMpO1xyXG4gIH0gOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIEdyYWNlZnVsbHkgZGVncmFkZSB0byBwbGFpbiBvYmplY3RcclxuICAgIHJldHVybiB7fTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAc2luY2UgMS44LjBcclxuICAgKiBAcmV0dXJuIHt7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfX1cclxuICAgKi9cclxuICBmdW5jdGlvbiB2aWV3cG9ydCgpIHtcclxuICAgIHJldHVybiB7J3dpZHRoJzp2aWV3cG9ydFcoKSwgJ2hlaWdodCc6dmlld3BvcnRIKCl9O1xyXG4gIH1cclxuICB4cG9ydHNbJ3ZpZXdwb3J0J10gPSB2aWV3cG9ydDtcclxuICBcclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWFxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFgnXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWE9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbExlZnQ7IFxyXG4gIH07XHJcblxyXG4gIC8qKiBcclxuICAgKiBDcm9zcy1icm93c2VyIHdpbmRvdy5zY3JvbGxZXHJcbiAgICogQHNpbmNlIDEuMC4wXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHhwb3J0c1snc2Nyb2xsWSddID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luLnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0uc2Nyb2xsVG9wOyBcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3t0b3A6bnVtYmVyLCByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXIsIGxlZnQ6bnVtYmVyfX0gY29vcmRzXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uIGFkanVzdG1lbnRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2FsaWJyYXRlKGNvb3JkcywgY3VzaGlvbikge1xyXG4gICAgdmFyIG8gPSB7fTtcclxuICAgIGN1c2hpb24gPSArY3VzaGlvbiB8fCAwO1xyXG4gICAgb1snd2lkdGgnXSA9IChvWydyaWdodCddID0gY29vcmRzWydyaWdodCddICsgY3VzaGlvbikgLSAob1snbGVmdCddID0gY29vcmRzWydsZWZ0J10gLSBjdXNoaW9uKTtcclxuICAgIG9bJ2hlaWdodCddID0gKG9bJ2JvdHRvbSddID0gY29vcmRzWydib3R0b20nXSArIGN1c2hpb24pIC0gKG9bJ3RvcCddID0gY29vcmRzWyd0b3AnXSAtIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuIG87XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcm9zcy1icm93c2VyIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHBsdXMgb3B0aW9uYWwgY3VzaGlvbi5cclxuICAgKiBDb29yZHMgYXJlIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsIGVsZW1lbnQgb3Igc3RhY2sgKHVzZXMgZmlyc3QgaXRlbSlcclxuICAgKiBAcGFyYW0ge251bWJlcj19IGN1c2hpb24gKy8tIHBpeGVsIGFkanVzdG1lbnQgYW1vdW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fGJvb2xlYW59XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKSB7XHJcbiAgICBlbCA9IGVsICYmICFlbC5ub2RlVHlwZSA/IGVsWzBdIDogZWw7XHJcbiAgICBpZiAoIWVsIHx8IDEgIT09IGVsLm5vZGVUeXBlKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gY2FsaWJyYXRlKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBjdXNoaW9uKTtcclxuICB9XHJcbiAgeHBvcnRzWydyZWN0YW5nbGUnXSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB2aWV3cG9ydCBhc3BlY3QgcmF0aW8gKG9yIHRoZSBhc3BlY3QgcmF0aW8gb2YgYW4gb2JqZWN0IG9yIGVsZW1lbnQpXHJcbiAgICogQHNpbmNlIDEuNy4wXHJcbiAgICogQHBhcmFtIHsoRWxlbWVudHxPYmplY3QpPX0gbyBvcHRpb25hbCBvYmplY3Qgd2l0aCB3aWR0aC9oZWlnaHQgcHJvcHMgb3IgbWV0aG9kc1xyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKiBAbGluayBodHRwOi8vdzMub3JnL1RSL2NzczMtbWVkaWFxdWVyaWVzLyNvcmllbnRhdGlvblxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGFzcGVjdChvKSB7XHJcbiAgICBvID0gbnVsbCA9PSBvID8gdmlld3BvcnQoKSA6IDEgPT09IG8ubm9kZVR5cGUgPyByZWN0YW5nbGUobykgOiBvO1xyXG4gICAgdmFyIGggPSBvWydoZWlnaHQnXSwgdyA9IG9bJ3dpZHRoJ107XHJcbiAgICBoID0gdHlwZW9mIGggPT0gJ2Z1bmN0aW9uJyA/IGguY2FsbChvKSA6IGg7XHJcbiAgICB3ID0gdHlwZW9mIHcgPT0gJ2Z1bmN0aW9uJyA/IHcuY2FsbChvKSA6IHc7XHJcbiAgICByZXR1cm4gdy9oO1xyXG4gIH1cclxuICB4cG9ydHNbJ2FzcGVjdCddID0gYXNwZWN0O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeC1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWCddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5yaWdodCA+PSAwICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHNhbWUgeS1heGlzIHNlY3Rpb24gYXMgdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luWSddID0gZnVuY3Rpb24oZWwsIGN1c2hpb24pIHtcclxuICAgIHZhciByID0gcmVjdGFuZ2xlKGVsLCBjdXNoaW9uKTtcclxuICAgIHJldHVybiAhIXIgJiYgci5ib3R0b20gPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUZXN0IGlmIGFuIGVsZW1lbnQgaXMgaW4gdGhlIHZpZXdwb3J0LlxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB4cG9ydHNbJ2luVmlld3BvcnQnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICAvLyBFcXVpdiB0byBgaW5YKGVsLCBjdXNoaW9uKSAmJiBpblkoZWwsIGN1c2hpb24pYCBidXQganVzdCBtYW51YWxseSBkbyBib3RoIFxyXG4gICAgLy8gdG8gYXZvaWQgY2FsbGluZyByZWN0YW5nbGUoKSB0d2ljZS4gSXQgZ3ppcHMganVzdCBhcyBzbWFsbCBsaWtlIHRoaXMuXHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci5yaWdodCA+PSAwICYmIHIudG9wIDw9IHZpZXdwb3J0SCgpICYmIHIubGVmdCA8PSB2aWV3cG9ydFcoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4geHBvcnRzO1xyXG59KSk7IiwiLyohXG4gKiBFdmVudEVtaXR0ZXIgdjQuMi45IC0gZ2l0LmlvL2VlXG4gKiBPbGl2ZXIgQ2FsZHdlbGxcbiAqIE1JVCBsaWNlbnNlXG4gKiBAcHJlc2VydmVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBtYW5hZ2luZyBldmVudHMuXG4gICAgICogQ2FuIGJlIGV4dGVuZGVkIHRvIHByb3ZpZGUgZXZlbnQgZnVuY3Rpb25hbGl0eSBpbiBvdGhlciBjbGFzc2VzLlxuICAgICAqXG4gICAgICogQGNsYXNzIEV2ZW50RW1pdHRlciBNYW5hZ2VzIGV2ZW50IHJlZ2lzdGVyaW5nIGFuZCBlbWl0dGluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fVxuXG4gICAgLy8gU2hvcnRjdXRzIHRvIGltcHJvdmUgc3BlZWQgYW5kIHNpemVcbiAgICB2YXIgcHJvdG8gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuICAgIHZhciBleHBvcnRzID0gdGhpcztcbiAgICB2YXIgb3JpZ2luYWxHbG9iYWxWYWx1ZSA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIGluZGV4IG9mIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGV2ZW50IGluIGl0cyBzdG9yYWdlIGFycmF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBsaXN0ZW5lcnMgQXJyYXkgb2YgbGlzdGVuZXJzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBsb29rIGZvci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEluZGV4IG9mIHRoZSBzcGVjaWZpZWQgbGlzdGVuZXIsIC0xIGlmIG5vdCBmb3VuZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnMsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBhIG1ldGhvZCB3aGlsZSBrZWVwaW5nIHRoZSBjb250ZXh0IGNvcnJlY3QsIHRvIGFsbG93IGZvciBvdmVyd3JpdGluZyBvZiB0YXJnZXQgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHRhcmdldCBtZXRob2QuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBhbGlhc2VkIG1ldGhvZFxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsaWFzKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFsaWFzQ2xvc3VyZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW25hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2lsbCBpbml0aWFsaXNlIHRoZSBldmVudCBvYmplY3QgYW5kIGxpc3RlbmVyIGFycmF5cyBpZiByZXF1aXJlZC5cbiAgICAgKiBXaWxsIHJldHVybiBhbiBvYmplY3QgaWYgeW91IHVzZSBhIHJlZ2V4IHNlYXJjaC4gVGhlIG9iamVjdCBjb250YWlucyBrZXlzIGZvciBlYWNoIG1hdGNoZWQgZXZlbnQuIFNvIC9iYVtyel0vIG1pZ2h0IHJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyBiYXIgYW5kIGJhei4gQnV0IG9ubHkgaWYgeW91IGhhdmUgZWl0aGVyIGRlZmluZWQgdGhlbSB3aXRoIGRlZmluZUV2ZW50IG9yIGFkZGVkIHNvbWUgbGlzdGVuZXJzIHRvIHRoZW0uXG4gICAgICogRWFjaCBwcm9wZXJ0eSBpbiB0aGUgb2JqZWN0IHJlc3BvbnNlIGlzIGFuIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXXxPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIHRoZSBldmVudC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoZXZ0KSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJldHVybiBhIGNvbmNhdGVuYXRlZCBhcnJheSBvZiBhbGwgbWF0Y2hpbmcgZXZlbnRzIGlmXG4gICAgICAgIC8vIHRoZSBzZWxlY3RvciBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgICAgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlW2tleV0gPSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGV2ZW50c1tldnRdIHx8IChldmVudHNbZXZ0XSA9IFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBsaXN0IG9mIGxpc3RlbmVyIG9iamVjdHMgYW5kIGZsYXR0ZW5zIGl0IGludG8gYSBsaXN0IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W119IGxpc3RlbmVycyBSYXcgbGlzdGVuZXIgb2JqZWN0cy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfSBKdXN0IHRoZSBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICovXG4gICAgcHJvdG8uZmxhdHRlbkxpc3RlbmVycyA9IGZ1bmN0aW9uIGZsYXR0ZW5MaXN0ZW5lcnMobGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBmbGF0TGlzdGVuZXJzID0gW107XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZsYXRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZsYXRMaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIHJlcXVlc3RlZCBsaXN0ZW5lcnMgdmlhIGdldExpc3RlbmVycyBidXQgd2lsbCBhbHdheXMgcmV0dXJuIHRoZSByZXN1bHRzIGluc2lkZSBhbiBvYmplY3QuIFRoaXMgaXMgbWFpbmx5IGZvciBpbnRlcm5hbCB1c2UgYnV0IG90aGVycyBtYXkgZmluZCBpdCB1c2VmdWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgaW4gYW4gb2JqZWN0LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVyc0FzT2JqZWN0ID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgaWYgKGxpc3RlbmVycyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgcmVzcG9uc2VbZXZ0XSA9IGxpc3RlbmVycztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZSB8fCBsaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciBmdW5jdGlvbiB0byB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFRoZSBsaXN0ZW5lciB3aWxsIG5vdCBiZSBhZGRlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZS5cbiAgICAgKiBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGl0IGlzIGNhbGxlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSB0aGVuIHRoZSBsaXN0ZW5lciB3aWxsIGJlIGFkZGVkIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcklzV3JhcHBlZCA9IHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCc7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkgJiYgaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0ucHVzaChsaXN0ZW5lcklzV3JhcHBlZCA/IGxpc3RlbmVyIDoge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uY2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vbiA9IGFsaWFzKCdhZGRMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogU2VtaS1hbGlhcyBvZiBhZGRMaXN0ZW5lci4gSXQgd2lsbCBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmVcbiAgICAgKiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgYWZ0ZXIgaXRzIGZpcnN0IGV4ZWN1dGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkT25jZUxpc3RlbmVyID0gZnVuY3Rpb24gYWRkT25jZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZXZ0LCB7XG4gICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRPbmNlTGlzdGVuZXIuXG4gICAgICovXG4gICAgcHJvdG8ub25jZSA9IGFsaWFzKCdhZGRPbmNlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXZlbnQgbmFtZS4gVGhpcyBpcyByZXF1aXJlZCBpZiB5b3Ugd2FudCB0byB1c2UgYSByZWdleCB0byBhZGQgYSBsaXN0ZW5lciB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gSWYgeW91IGRvbid0IGRvIHRoaXMgdGhlbiBob3cgZG8geW91IGV4cGVjdCBpdCB0byBrbm93IHdoYXQgZXZlbnQgdG8gYWRkIHRvPyBTaG91bGQgaXQganVzdCBhZGQgdG8gZXZlcnkgcG9zc2libGUgbWF0Y2ggZm9yIGEgcmVnZXg/IE5vLiBUaGF0IGlzIHNjYXJ5IGFuZCBiYWQuXG4gICAgICogWW91IG5lZWQgdG8gdGVsbCBpdCB3aGF0IGV2ZW50IG5hbWVzIHNob3VsZCBiZSBtYXRjaGVkIGJ5IGEgcmVnZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudCA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50KGV2dCkge1xuICAgICAgICB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXNlcyBkZWZpbmVFdmVudCB0byBkZWZpbmUgbXVsdGlwbGUgZXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gZXZ0cyBBbiBhcnJheSBvZiBldmVudCBuYW1lcyB0byBkZWZpbmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnRzID0gZnVuY3Rpb24gZGVmaW5lRXZlbnRzKGV2dHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZUV2ZW50KGV2dHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnVuY3Rpb24gZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdoZW4gcGFzc2VkIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lLCBpdCB3aWxsIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIHJlbW92ZSBmcm9tIHRoZSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vZmYgPSBhbGlhcygncmVtb3ZlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBhZGQgdGhlIGFycmF5IG9mIGxpc3RlbmVycyB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICogWWVhaCwgdGhpcyBmdW5jdGlvbiBkb2VzIHF1aXRlIGEgYml0LiBUaGF0J3MgcHJvYmFibHkgYSBiYWQgdGhpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyhmYWxzZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIHJlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKHRydWUsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRWRpdHMgbGlzdGVuZXJzIGluIGJ1bGsuIFRoZSBhZGRMaXN0ZW5lcnMgYW5kIHJlbW92ZUxpc3RlbmVycyBtZXRob2RzIGJvdGggdXNlIHRoaXMgdG8gZG8gdGhlaXIgam9iLiBZb3Ugc2hvdWxkIHJlYWxseSB1c2UgdGhvc2UgaW5zdGVhZCwgdGhpcyBpcyBhIGxpdHRsZSBsb3dlciBsZXZlbC5cbiAgICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBkZXRlcm1pbmUgaWYgdGhlIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCAodHJ1ZSkgb3IgYWRkZWQgKGZhbHNlKS5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC9yZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1hbmlwdWxhdGUgdGhlIGxpc3RlbmVycyBvZiBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSBUcnVlIGlmIHlvdSB3YW50IHRvIHJlbW92ZSBsaXN0ZW5lcnMsIGZhbHNlIGlmIHlvdSB3YW50IHRvIGFkZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC9yZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ubWFuaXB1bGF0ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIG1hbmlwdWxhdGVMaXN0ZW5lcnMocmVtb3ZlLCBldnQsIGxpc3RlbmVycykge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICB2YXIgc2luZ2xlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lciA6IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgICAgIHZhciBtdWx0aXBsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXJzIDogdGhpcy5hZGRMaXN0ZW5lcnM7XG5cbiAgICAgICAgLy8gSWYgZXZ0IGlzIGFuIG9iamVjdCB0aGVuIHBhc3MgZWFjaCBvZiBpdHMgcHJvcGVydGllcyB0byB0aGlzIG1ldGhvZFxuICAgICAgICBpZiAodHlwZW9mIGV2dCA9PT0gJ29iamVjdCcgJiYgIShldnQgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5oYXNPd25Qcm9wZXJ0eShpKSAmJiAodmFsdWUgPSBldnRbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIHNpbmdsZSBsaXN0ZW5lciBzdHJhaWdodCB0aHJvdWdoIHRvIHRoZSBzaW5ndWxhciBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHBhc3MgYmFjayB0byB0aGUgbXVsdGlwbGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU28gZXZ0IG11c3QgYmUgYSBzdHJpbmdcbiAgICAgICAgICAgIC8vIEFuZCBsaXN0ZW5lcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBsaXN0ZW5lcnNcbiAgICAgICAgICAgIC8vIExvb3Agb3ZlciBpdCBhbmQgcGFzcyBlYWNoIG9uZSB0byB0aGUgbXVsdGlwbGUgbWV0aG9kXG4gICAgICAgICAgICBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBldnQsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gYSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGFuIGV2ZW50IHRoZW4gYWxsIGxpc3RlbmVycyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogVGhhdCBtZWFucyBldmVyeSBldmVudCB3aWxsIGJlIGVtcHRpZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWdleCB0byByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBbZXZ0XSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuIFdpbGwgcmVtb3ZlIGZyb20gZXZlcnkgZXZlbnQgaWYgbm90IHBhc3NlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2dCkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBldnQ7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZW1vdmUgZGlmZmVyZW50IHRoaW5ncyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIGV2dFxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW2V2dF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50cyBtYXRjaGluZyB0aGUgcmVnZXguXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gYWxsIGV2ZW50c1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVFdmVudC5cbiAgICAgKlxuICAgICAqIEFkZGVkIHRvIG1pcnJvciB0aGUgbm9kZSBBUEkuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlQWxsTGlzdGVuZXJzID0gYWxpYXMoJ3JlbW92ZUV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudCBvZiB5b3VyIGNob2ljZS5cbiAgICAgKiBXaGVuIGVtaXR0ZWQsIGV2ZXJ5IGxpc3RlbmVyIGF0dGFjaGVkIHRvIHRoYXQgZXZlbnQgd2lsbCBiZSBleGVjdXRlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYXJyYXkgdGhlbiB0aG9zZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgbGlzdGVuZXIgdXBvbiBleGVjdXRpb24uXG4gICAgICogQmVjYXVzZSBpdCB1c2VzIGBhcHBseWAsIHlvdXIgYXJyYXkgb2YgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzIGlmIHlvdSB3cm90ZSB0aGVtIG91dCBzZXBhcmF0ZWx5LlxuICAgICAqIFNvIHRoZXkgd2lsbCBub3QgYXJyaXZlIHdpdGhpbiB0aGUgYXJyYXkgb24gdGhlIG90aGVyIHNpZGUsIHRoZXkgd2lsbCBiZSBzZXBhcmF0ZS5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gT3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uIGVtaXRFdmVudChldnQsIGFyZ3MpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVyO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGxpc3RlbmVyc1trZXldLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHNoYWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGVpdGhlciB3aXRoIGEgYmFzaWMgY2FsbCBvciBhbiBhcHBseSBpZiB0aGVyZSBpcyBhbiBhcmdzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzW2tleV1baV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGxpc3RlbmVyLmxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgZW1pdEV2ZW50XG4gICAgICovXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdlbWl0RXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cbiAgICAgKiBBcyB3aXRoIGVtaXRFdmVudCwgeW91IGNhbiBwYXNzIGEgcmVnZXggaW4gcGxhY2Ugb2YgdGhlIGV2ZW50IG5hbWUgdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHsuLi4qfSBPcHRpb25hbCBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0ID0gZnVuY3Rpb24gZW1pdChldnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0RXZlbnQoZXZ0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWYgYVxuICAgICAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogYWZ0ZXIgZXhlY3V0aW9uLiBUaGlzIHZhbHVlIGRlZmF1bHRzIHRvIHRydWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25jZVJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZlxuICAgICAqIHRoZSBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhpcyBvbmUgdGhlbiBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4geyp8Qm9vbGVhbn0gVGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgZm9yIG9yIHRoZSBkZWZhdWx0LCB0cnVlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBfZ2V0T25jZVJldHVyblZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX29uY2VSZXR1cm5WYWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZXZlbnRzIG9iamVjdCBhbmQgY3JlYXRlcyBvbmUgaWYgcmVxdWlyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgZ2xvYmFsIHtAbGluayBFdmVudEVtaXR0ZXJ9IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGlzIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTm9uIGNvbmZsaWN0aW5nIEV2ZW50RW1pdHRlciBjbGFzcy5cbiAgICAgKi9cbiAgICBFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gb3JpZ2luYWxHbG9iYWxWYWx1ZTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIjIyMqXG4gKiBUaGUgcHVycG9zZSBvZiB0aGlzIGxheWVyIGlzIHRvIGRlY2xhcmUgYW5kIGFic3RyYWN0IHRoZSBhY2Nlc3MgdG9cbiAqIHRoZSBjb3JlIGJhc2Ugb2YgbGlicmFyaWVzIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIHN0YWNrICh0aGUgYXBwIGZyYW1ld29yaylcbiAqIHdpbGwgZGVwZW5kLlxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEJhc2UpIC0+XG5cbiAgICAjIEFycmF5IHRoYXQgaG9sZHMgaGFyZCBkZXBlbmRlbmNpZXMgZm9yIHRoZSBTREtcbiAgICBkZXBlbmRlbmNpZXMgPSBbXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJqUXVlcnlcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuMTBcIiAjIHJlcXVpcmVkIHZlcnNpb25cbiAgICAgICAgICAgIFwib2JqXCI6IHJvb3QuJCAjIGdsb2JhbCBvYmplY3RcbiAgICAgICAgICAgIFwidmVyc2lvblwiOiBpZiByb290LiQgdGhlbiByb290LiQuZm4uanF1ZXJ5IGVsc2UgMCAjIGdpdmVzIHRoZSB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIG9mIHRoZSBsb2FkZWQgbGliXG4gICAgICAgICxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIlVuZGVyc2NvcmVcIlxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBcIjEuNy4wXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290Ll8gIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC5fIHRoZW4gcm9vdC5fLlZFUlNJT04gZWxzZSAwXG4gICAgXVxuXG4gICAgIyBWZXJzaW9uIGNoZWNrZXIgdXRpbFxuICAgIFZlcnNpb25DaGVja2VyID0gcmVxdWlyZSAnLi91dGlsL3ZlcnNpb25jaGVja2VyLmNvZmZlZSdcblxuICAgICMgSW4gY2FzZSBhbnkgb2Ygb3VyIGRlcGVuZGVuY2llcyB3ZXJlIG5vdCBsb2FkZWQsIG9yIGl0cyB2ZXJzaW9uIGRvZXN0IG5vdCBjb3JyZXNwb25kIHRvIG91cnNcbiAgICAjIG5lZWRzLCB0aGUgdmVyc2lvbkNoZWNrZXIgd2lsbCB0aG9ydyBhbiBlcnJvciBleHBsYWluaW5nIHdoeVxuICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuICAgICMgTG9nZ2VyXG4gICAgQmFzZS5sb2cgPSByZXF1aXJlICcuL3V0aWwvbG9nZ2VyLmNvZmZlZSdcblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIEJhc2UuZGV2aWNlID0gcmVxdWlyZSAnLi91dGlsL2RldmljZWRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIENvb2tpZXMgQVBJXG4gICAgQmFzZS5jb29raWVzID0gcmVxdWlyZSAnLi91dGlsL2Nvb2tpZXMuY29mZmVlJ1xuXG4gICAgIyBWaWV3cG9ydCBkZXRlY3Rpb25cbiAgICBCYXNlLnZwID0gcmVxdWlyZSAnLi91dGlsL3ZpZXdwb3J0ZGV0ZWN0aW9uLmNvZmZlZSdcblxuICAgICMgRnVuY3Rpb24gdGhhdCBpcyBnb25uYSBoYW5kbGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICBCYXNlLkltYWdlciA9IHJlcXVpcmUgJ2ltYWdlci5qcydcblxuICAgICMgRXZlbnQgQnVzXG4gICAgQmFzZS5FdmVudHMgPSByZXF1aXJlICcuL3V0aWwvZXZlbnRidXMuY29mZmVlJ1xuXG4gICAgIyBHZW5lcmFsIFV0aWxzXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL3V0aWwvZ2VuZXJhbC5jb2ZmZWUnXG5cbiAgICAjIFV0aWxzXG4gICAgQmFzZS51dGlsID0gcm9vdC5fLmV4dGVuZCBVdGlscywgcm9vdC5fXG5cbiAgICByZXR1cm4gQmFzZVxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBDb21wb25lbnRcblxuICAgICAgICAjIG9iamVjdCB0byBzdG9yZSBpbml0aWFsaXplZCBjb21wb25lbnRzXG4gICAgICAgIEBpbml0aWFsaXplZENvbXBvbmVudHMgOiB7fVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogW3N0YXJ0QWxsIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAYXV0aG9yIEZyYW5jaXNjbyBSYW1pbmkgPGZyYW5jaXNjby5yYW1pbmkgYXQgZ2xvYmFudC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3IgPSAnYm9keScuIENTUyBzZWxlY3RvciB0byB0ZWxsIHRoZSBhcHAgd2hlcmUgdG8gbG9vayBmb3IgY29tcG9uZW50c1xuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICMjI1xuICAgICAgICBAc3RhcnRBbGw6IChzZWxlY3RvciA9ICdib2R5JywgYXBwKSAtPlxuXG4gICAgICAgICAgICBjb21wb25lbnRzID0gQ29tcG9uZW50LnBhcnNlTGlzdChzZWxlY3RvciwgYXBwLmNvbmZpZy5uYW1lc3BhY2UpXG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJQYXJzZWQgY29tcG9uZW50c1wiXG4gICAgICAgICAgICBCYXNlLmxvZy5kZWJ1ZyBjb21wb25lbnRzXG5cbiAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cbiAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzXG5cbiAgICAgICAgQHBhcnNlTGlzdDogKHNlbGVjdG9yLCBuYW1lc3BhY2UpIC0+XG4gICAgICAgICAgICAjIGFycmF5IHRvIGhvbGQgcGFyc2VkIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGxpc3QgPSBbXVxuXG4gICAgICAgICAgICBuYW1lc3BhY2VzID0gWydwbGF0Zm9ybSddXG5cbiAgICAgICAgICAgICMgVE9ETzogQWRkIHRoZSBhYmlsaXR5IHRvIHBhc3MgYW4gYXJyYXkvb2JqZWN0IG9mIG5hbWVzcGFjZXMgaW5zdGVhZCBvZiBqdXN0IG9uZVxuICAgICAgICAgICAgbmFtZXNwYWNlcy5wdXNoIG5hbWVzcGFjZSBpZiBuYW1lc3BhY2UgaXNudCAncGxhdGZvcm0nXG5cbiAgICAgICAgICAgIGNzc1NlbGVjdG9ycyA9IFtdXG5cbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAjIGlmIGEgbmV3IG5hbWVzcGFjZSBoYXMgYmVlbiBwcm92aWRlZCBsZXRzIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNzc1NlbGVjdG9ycy5wdXNoIFwiW2RhdGEtXCIgKyBucyArIFwiLWNvbXBvbmVudF1cIlxuXG4gICAgICAgICAgICAjIFRPRE86IEFjY2VzcyB0aGVzZSBET00gZnVuY3Rpb25hbGl0eSB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgICQoc2VsZWN0b3IpLmZpbmQoY3NzU2VsZWN0b3JzLmpvaW4oJywnKSkuZWFjaCAoaSwgY29tcCkgLT5cblxuICAgICAgICAgICAgICAgIG5zID0gZG8gKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBuYW1lc3BhY2VzLCAobnMsIGkpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRoaXMgd2F5IHdlIG9idGFpbiB0aGUgbmFtZXNwYWNlIG9mIHRoZSBjdXJyZW50IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgJChjb21wKS5kYXRhKG5zICsgXCItY29tcG9uZW50XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbnNcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXNwYWNlXG5cbiAgICAgICAgICAgICAgICAjIG9wdGlvbnMgd2lsbCBob2xkIGFsbCB0aGUgZGF0YS0qIHJlbGF0ZWQgdG8gdGhlIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBDb21wb25lbnQucGFyc2VDb21wb25lbnRPcHRpb25zKEAsIG5zKVxuXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHsgbmFtZTogb3B0aW9ucy5uYW1lLCBvcHRpb25zOiBvcHRpb25zIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0XG5cbiAgICAgICAgQHBhcnNlQ29tcG9uZW50T3B0aW9uczogKGVsLCBuYW1lc3BhY2UsIG9wdHMpIC0+XG4gICAgICAgICAgICBvcHRpb25zID0gQmFzZS51dGlsLmNsb25lKG9wdHMgfHwge30pXG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWxcblxuICAgICAgICAgICAgIyBUT0RPOiBhY2Nlc3MgdGhpcyBET00gZnVuY3Rpb24gdGhyb3VnaCBCYXNlXG4gICAgICAgICAgICBkYXRhID0gJChlbCkuZGF0YSgpXG4gICAgICAgICAgICBuYW1lID0gJydcbiAgICAgICAgICAgIGxlbmd0aCA9IDBcblxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggZGF0YSwgKHYsIGspIC0+XG5cbiAgICAgICAgICAgICAgICAjIHJlbW92ZXMgdGhlIG5hbWVzcGFjZVxuICAgICAgICAgICAgICAgIGsgPSBrLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIG5hbWVzcGFjZSksIFwiXCIpXG5cbiAgICAgICAgICAgICAgICAjIGRlY2FtZWxpemUgdGhlIG9wdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgayA9IGsuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBrLnNsaWNlKDEpXG5cbiAgICAgICAgICAgICAgICAjIGlmIHRoZSBrZXkgaXMgZGlmZmVyZW50IGZyb20gXCJjb21wb25lbnRcIiBpdCBtZWFucyBpdCBpc1xuICAgICAgICAgICAgICAgICMgYW4gb3B0aW9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgayAhPSBcImNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNba10gPSB2XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCsrXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdlxuXG4gICAgICAgICAgICAjIGFkZCBvbmUgYmVjYXVzZSB3ZSd2ZSBhZGRlZCAnZWwnIGF1dG9tYXRpY2FsbHkgYXMgYW4gZXh0cmEgb3B0aW9uXG4gICAgICAgICAgICBvcHRpb25zLmxlbmd0aCA9IGxlbmd0aCArIDFcblxuICAgICAgICAgICAgIyBidWlsZCBhZCByZXR1cm4gdGhlIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAgIENvbXBvbmVudC5idWlsZE9wdGlvbnNPYmplY3QobmFtZSwgb3B0aW9ucylcblxuXG4gICAgICAgIEBidWlsZE9wdGlvbnNPYmplY3Q6IChuYW1lLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBvcHRpb25zLm5hbWUgPSBuYW1lXG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zXG5cbiAgICAgICAgQGluc3RhbnRpYXRlOiAoY29tcG9uZW50cywgYXBwKSAtPlxuXG4gICAgICAgICAgICBpZiBjb21wb25lbnRzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIG0gPSBjb21wb25lbnRzLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIG1vZHVsZXMgYXJlIGRlZmluZWQgdXNpbmcgdGhlIG1vZHVsZXMgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgIyBUT0RPOiBQcm92aWRlIGFuIGFsdGVybmF0ZSB3YXkgdG8gZGVmaW5lIHRoZVxuICAgICAgICAgICAgICAgICMgZ2xvYmFsIG9iamVjdCB0aGF0IGlzIGdvbm5hIGhvbGQgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5KE5HUy5tb2R1bGVzKSBhbmQgTkdTLm1vZHVsZXNbbS5uYW1lXSBhbmQgbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZCA9IEJhc2UudXRpbC5jbG9uZSBOR1MubW9kdWxlc1ttLm5hbWVdXG5cbiAgICAgICAgICAgICAgICAgICAgIyBjcmVhdGUgYSBuZXcgc2FuZGJveCBmb3IgdGhpcyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgc2IgPSBhcHAuY3JlYXRlU2FuZGJveChtLm5hbWUpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBnZW5lcmF0ZXMgYW4gdW5pcXVlIGd1aWQgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbS5vcHRpb25zLmd1aWQgPSBCYXNlLnV0aWwudW5pcXVlSWQobS5uYW1lICsgXCJfXCIpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbmplY3QgdGhlIHNhbmRib3ggYW5kIHRoZSBvcHRpb25zIGluIHRoZSBtb2R1bGUgcHJvdG9cbiAgICAgICAgICAgICAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBtb2QsIHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zXG5cbiAgICAgICAgICAgICAgICAgICAgIyBpbml0IHRoZSBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgbW9kLmluaXRpYWxpemUoKVxuXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2Ugb2YgdGhlIGdlbmVyYXRlZCBndWlkIG9uIHRoZSBlbFxuICAgICAgICAgICAgICAgICAgICAkKG1vZC5vcHRpb25zLmVsKS5kYXRhICdfX2d1aWRfXycsIG0ub3B0aW9ucy5ndWlkXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzYXZlcyBhIHJlZmVyZW5jZSBvZiB0aGUgaW5pdGlhbGl6ZWQgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNbIG0ub3B0aW9ucy5ndWlkIF0gPSBtb2RcblxuICAgICAgICAgICAgICAgIENvbXBvbmVudC5pbnN0YW50aWF0ZShjb21wb25lbnRzLCBhcHApXG5cblxuICAgICMjXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgIyNcblxuICAgICMgY29uc3RydWN0b3JcbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gQ29tcG9uZW50IGV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgaW5pdGlhbGl6ZWRDb21wb25lbnRzID0ge31cblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMgPSAobGlzdCwgYXBwKSAtPlxuXG4gICAgICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSBDb21wb25lbnQuc3RhcnRBbGwobGlzdCwgYXBwKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LmdldEluaXRpYWxpemVkQ29tcG9uZW50cyA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsaXplZENvbXBvbmVudHNcblxuXG4gICAgIyB0aGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBvbmNlIGFsbCB0aGUgZXh0ZW5zaW9ucyBoYXZlIGJlZW4gbG9hZGVkXG4gICAgYWZ0ZXJBcHBTdGFydGVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJDYWxsaW5nIHN0YXJ0Q29tcG9uZW50cyBmcm9tIGFmdGVyQXBwU3RhcnRlZFwiXG5cbiAgICAgICAgYXBwLnNhbmRib3guc3RhcnRDb21wb25lbnRzKG51bGwsIGFwcClcblxuICAgIG5hbWU6ICdDb21wb25lbnQgRXh0ZW5zaW9uJ1xuXG4gICAgIyB0aGlzIHByb3BlcnR5IHdpbGwgYmUgdXNlZCBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuICAgICMgdG8gdmFsaWRhdGUgdGhlIENvbXBvbmVudCBjbGFzcyBpbiBpc29sYXRpb25cbiAgICBjbGFzc2VzIDogQ29tcG9uZW50XG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ2NvbXBvbmVudHMnXG4pXG4iLCIjIyMqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGJlIHRyaWdnZXJpbmcgZXZlbnRzIG9uY2UgdGhlIERldmljZSBpbiB3aGljaCB0aGVcbiAqIHVzZXIgaXMgbmF2aWdhdGluZyB0aGUgc2l0ZSBpcyBkZXRlY3RlZC4gSXRzIGZ1Y2lvbmFsaXR5IG1vc3RseSBkZXBlbmRzXG4gKiBvbiB0aGUgY29uZmlndXJhdGlvbnMgc2V0dGluZ3MgKHByb3ZpZGVkIGJ5IGRlZmF1bHQsIGJ1dCB0aGV5IGNhbiBiZSBvdmVycmlkZW4pXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlRGVzaWduXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgVGhpcyBsaW1pdCB3aWxsIGJlIHVzZWQgdG8gbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgIyB3aGVuIHRoZSB1c2VyIHJlc2l6ZSB0aGUgd2luZG93XG4gICAgICAgICAgICB3YWl0TGltaXQ6IDMwMFxuXG4gICAgICAgICAgICAjIGRlZmluZXMgaWYgd2UgaGF2ZSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvdyBvYmpcbiAgICAgICAgICAgIHdpbmRvd1Jlc2l6ZUV2ZW50OiB0cnVlXG5cbiAgICAgICAgICAgICMgRGVmYXVsdCBicmVha3BvaW50c1xuICAgICAgICAgICAgYnJlYWtwb2ludHMgOiBbXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibW9iaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgIyB1bnRpbCB0aGlzIHBvaW50IHdpbGwgYmVoYXZlcyBhcyBtb2JpbGVcbiAgICAgICAgICAgICAgICAgICAgYnBtaW46IDBcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDc2N1xuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJ0YWJsZXRcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogNzY4XG4gICAgICAgICAgICAgICAgICAgIGJwbWF4OiA5NTlcbiAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgICAgICMgYnkgZGVmYXVsdCBhbnl0aGluZyBncmVhdGVyIHRoYW4gdGFibGV0IGlzIGEgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImRlc2t0b3BcIlxuICAgICAgICAgICAgICAgICAgICBicG1pbjogOTYwXG4gICAgICAgICAgICBdXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGV0ZWN0RGV2aWNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY2hlY2tWaWV3cG9ydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2F0dGFjaFdpbmRvd0hhbmRsZXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImdldERldmljZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfcmVzaXplSGFuZGxlclwiXG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAY2ZnLCBjb25maWdcblxuICAgICAgICAgICAgQF9pbml0KClcblxuICAgICAgICBfaW5pdDogKCkgLT5cblxuICAgICAgICAgICAgQF9hdHRhY2hXaW5kb3dIYW5kbGVycygpIGlmIEBjb25maWcud2luZG93UmVzaXplRXZlbnRcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgX2F0dGFjaFdpbmRvd0hhbmRsZXJzOiAoKSAtPlxuXG4gICAgICAgICAgICBsYXp5UmVzaXplID0gQmFzZS51dGlsLmRlYm91bmNlIEBfcmVzaXplSGFuZGxlciwgQGNvbmZpZy53YWl0TGltaXRcblxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShsYXp5UmVzaXplKVxuXG4gICAgICAgIF9yZXNpemVIYW5kbGVyOiAoKSAtPlxuICAgICAgICAgICAgIyB0cmlnZ2VycyBhIHdpbmRvd3NyZXNpemUgZXZlbnQgc28gdGhpcyB3YXkgd2UgaGF2ZSBhIGNlbnRyYWxpemVkXG4gICAgICAgICAgICAjIHdheSB0byBsaXN0ZW4gZm9yIHRoZSByZXNpemUgZXZlbnQgb24gdGhlIHdpbmRvd3MgYW5kIHRoZSBjb21wb25lbnNcbiAgICAgICAgICAgICMgY2FuIGxpc3RlbiBkaXJlY3RseSB0byB0aGlzIGV2ZW50IGluc3RlYWQgb2YgZGVmaW5pbmcgYSBuZXcgbGlzdGVuZXJcbiAgICAgICAgICAgIE5HUy5lbWl0IFwicndkOndpbmRvd3Jlc2l6ZVwiXG5cbiAgICAgICAgICAgIEBkZXRlY3REZXZpY2UoKVxuXG4gICAgICAgIGRldGVjdERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgYnAgPSBAY29uZmlnLmJyZWFrcG9pbnRzXG5cbiAgICAgICAgICAgIHZwID0gQmFzZS52cC52aWV3cG9ydFcoKVxuXG4gICAgICAgICAgICAjIGdldCBhIHJlZmVyZW5jZSAoaWYgYW55KSB0byB0aGUgY29ycmVzcG9uZGluZyBicmVha3BvaW50XG4gICAgICAgICAgICAjIGRlZmluZWQgaW4gdGhlIGNvbmZpZy5cbiAgICAgICAgICAgIHZwZCA9IEBfY2hlY2tWaWV3cG9ydCh2cCwgYnApXG5cbiAgICAgICAgICAgIGlmIG5vdCBCYXNlLnV0aWwuaXNFbXB0eSB2cGRcblxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkQlBOYW1lID0gQmFzZS51dGlsLnN0cmluZy5jYXBpdGFsaXplKHZwZC5uYW1lKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICMgbGV0J3MgZmlzdCBjaGVjayBpZiB3ZSBoYXZlIGEgbWV0aG9kIHRvIGRldGVjdCB0aGUgZGV2aWNlIHRocm91Z2ggVUFcbiAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIFVBRGV0ZWN0b3IgPSBCYXNlLmRldmljZVsnaXMnICsgY2FwaXRhbGl6ZWRCUE5hbWVdXG5cbiAgICAgICAgICAgICAgICAjIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIHJlc3VsdCBvZiBhIFVBIGNoZWNrLlxuICAgICAgICAgICAgICAgICMgVW5sZXNzIHRoZXJlIGlzIGEgbWV0aG9kIHRvIGNoZWNrIHRoZSBVQSwgbGV0c1xuICAgICAgICAgICAgICAgICMgbGVhdmUgaXQgYXMgZmFsc2UgYW5kIHVzZSBvbmx5IHRoZSB2aWV3cG9ydCB0b1xuICAgICAgICAgICAgICAgICMgbWFrZSB0aGUgZGV2aWNlIGRldGVjdGlvblxuICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIFVBRGV0ZWN0b3JcblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZVVBID0gVUFEZXRlY3RvcigpXG5cbiAgICAgICAgICAgICAgICAjIEZpbmFsIGNoZWNrLiBGaXJzdCB3ZSdsbCB0cnkgdG8gbWFrZSB0byBtYWtlIHRoZSBkZWNpc2lvblxuICAgICAgICAgICAgICAgICMgdXBvbiB0aGUgY3VycmVudCBkZXZpY2UgYmFzZWQgb24gVUEsIGlmIGlzIG5vdCBwb3NzaWJsZSwgbGV0cyBqdXN0XG4gICAgICAgICAgICAgICAgIyB1c2UgdGhlIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgaWYgc3RhdGVVQSBvciB2cGQubmFtZVxuICAgICAgICAgICAgICAgICAgICAjIFRyaWdnZXIgYSBldmVudCB0aGF0IGZvbGxvd3MgdGhlIGZvbGxvd2luZyBuYW1pbmcgY29udmVudGlvblxuICAgICAgICAgICAgICAgICAgICAjIHJ3ZDo8ZGV2aWNlPlxuICAgICAgICAgICAgICAgICAgICAjIEV4YW1wbGU6IHJ3ZDp0YWJsZXQgb3IgcndkOm1vYmlsZVxuXG4gICAgICAgICAgICAgICAgICAgIGV2dCA9ICdyd2Q6JyArIHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gZXh0ZW5zaW9uIGlzIHRyaWdnZXJpbmcgdGhlIGZvbGxvd2luZ1wiXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgTkdTLmVtaXQgZXZ0XG5cbiAgICAgICAgICAgICAgICAgICAgIyBTdG9yZSB0aGUgY3VycmVudCBkZXZpY2VcbiAgICAgICAgICAgICAgICAgICAgQGRldmljZSA9IHZwZC5uYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1zZyA9IFwiW2V4dF0gVGhlIHBhc3NlZCBzZXR0aW5ncyB0byB0aGUgUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtaWdodCBub3QgYmUgY29ycmVjdCBzaW5jZSB3ZSBoYXZlbid0IGJlZW4gYWJsZSB0byBkZXRlY3QgYW4gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImFzb2NpYXRlZCBicmVha3BvaW50IHRvIHRoZSBjdXJyZW50IHZpZXdwb3J0XCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgIGdldERldmljZTogKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIEBkZXZpY2VcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIGRldGVjdCBpZiB0aGUgY3VycmVudCB2aWV3cG9ydFxuICAgICAgICAgKiBjb3JyZXNwb25kIHRvIGFueSBvZiB0aGUgZGVmaW5lZCBicCBpbiB0aGUgY29uZmlnIHNldHRpbmdcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSB2cCBbbnVtYmVyLiBDdXJyZW50IHZpZXdwb3J0XVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGJyZWFrcG9pbnRzIFtjbG9uZSBvZiB0aGUgYnJlYWtwb2ludCBrZXkgb2JqZWN0XVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IHRoZSBicmVha3BvaW50IHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGN1cnJlbnRseVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGRldGVjdGVkIHZpZXdwb3J0XG4gICAgICAgICMjI1xuICAgICAgICBfY2hlY2tWaWV3cG9ydDogKHZwLCBicmVha3BvaW50cykgLT5cblxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IEJhc2UudXRpbC5maWx0ZXIoYnJlYWtwb2ludHMsIChicCkgLT5cblxuICAgICAgICAgICAgICAgICMgc3RhcnRzIGNoZWNraW5nIGlmIHRoZSBkZXRlY3RlZCB2aWV3cG9ydCBpc1xuICAgICAgICAgICAgICAgICMgYmlnZ2VyIHRoYW4gdGhlIGJwbWluIGRlZmluZWQgaW4gdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAjIGl0ZXJhdGVkIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICBpZiB2cCA+PSBicC5icG1pblxuXG4gICAgICAgICAgICAgICAgICAgICMgd2UnbGwgbmVlZCB0byBjaGVjayB0aGlzIHdheSBiZWNhdXNlIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpZiBhIEJQIGRvZXNuJ3QgaGF2ZSBhIGJwbWF4IHByb3BlcnR5IGl0IG1lYW5zXG4gICAgICAgICAgICAgICAgICAgICMgaXMgdGhlIGxhc3QgYW5kIGJpZ2dlciBjYXNlIHRvIGNoZWNrLiBCeSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICMgaXMgZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBpZiBicC5icG1heCBhbmQgYnAuYnBtYXggIT0gMFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGlmIGl0J3Mgd2l0aGluIHRoZSByYW5nZSwgYWxsIGdvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHZwIDw9IGJwLmJwbWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRoaXMgc2hvdWxkIG9ubHkgYmUgdHJ1ZSBpbiBvbmx5IG9uZSBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEJ5IGRlZmF1bHQsIGp1c3QgZm9yIGRlc2t0b3Agd2hpY2ggZG9lc24ndCBoYXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGFuIFwidW50aWxcIiBicmVha3BvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmYWxzZVxuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmIGJyZWFrcG9pbnQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIHJldHVybiBicmVha3BvaW50LnNoaWZ0KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4ge31cblxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgRGVzaWduIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAjIENoZWNrIGlmIHRoZSBleHRlbnNpb24gaGFzIGEgY3VzdG9tIGNvbmZpZyB0byB1c2VcbiAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgcndkID0gbmV3IFJlc3BvbnNpdmVEZXNpZ24oY29uZmlnKVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCA9ICgpIC0+XG4gICAgICAgICAgICAjIGNhbGwgZGV0ZWN0IERldmljZSBpbiBvcmRlciB0byB0cmlnZ2VyIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAgICAgICAjIGRldmljZSBldmVudFxuICAgICAgICAgICAgcndkLmRldGVjdERldmljZSgpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkLmdldERldmljZSA9ICgpIC0+XG5cbiAgICAgICAgICAgIHJ3ZC5nZXREZXZpY2UoKVxuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVEZXNpZ25cIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJ3ZCgpXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlZGVzaWduJ1xuKSIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgaGFuZGxpbmcgdGhlIGNyZWF0aW9uIG9mIHRoZSByZXNwb25zaXZlIGltYWdlc1xuIyMjXG4oKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSA9IHJlcXVpcmUoJy4vLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgUmVzcG9uc2l2ZUltYWdlc1xuXG4gICAgICAgIGNmZyA6XG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlZCBQaXhlbCB3aWR0aCBmb3IgaW1hZ2VzXG4gICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFsxMzMsMTUyLDE2MiwyMjUsMjEwLDIyNCwyODAsMzUyLDQ3MCw1MzYsNTkwLDY3Niw3MTAsNzY4LDg4NSw5NDUsMTE5MF1cblxuICAgICAgICAgICAgIyBBcnJheSBvZiBzdXBwb3J0ZXIgcGl4ZWwgcmF0aW9zXG4gICAgICAgICAgICBhdmFpbGFibGVQaXhlbFJhdGlvczogWzEsIDIsIDNdXG5cbiAgICAgICAgICAgICMgU2VsZWN0b3IgdG8gYmUgdXNlZCB3aGVuIGluc3RhbnRpbmcgSW1hZ2VyXG4gICAgICAgICAgICBkZWZhdWx0U2VsZWN0b3IgOiAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCdcblxuICAgICAgICAgICAgIyBsYXp5IG1vZGUgZW5hYmxlZFxuICAgICAgICAgICAgbGF6eW1vZGUgOiB0cnVlXG5cbiAgICAgICAgY29uc3RydWN0b3I6IChjb25maWcgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS51dGlsLmJpbmRBbGwgQCwgXCJfaW5pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUxpc3RlbmVyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2NyZWF0ZUluc3RhbmNlXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICAjIGNyZWF0ZXMgbGlzdGVuZXJzIHRvIGFsbG93IHRoZSBpbnN0YW50aWF0b24gb2YgdGhlIEltYWdlclxuICAgICAgICAgICAgIyBpbiBsYXp5IGxvYWQgbW9kZS5cbiAgICAgICAgICAgICMgVXNlZnVsIGZvciBpbmZpbml0ZSBzY3JvbGxzIG9yIGltYWdlcyBjcmVhdGVkIG9uIGRlbWFuZFxuICAgICAgICAgICAgQF9jcmVhdGVMaXN0ZW5lcnMoKSBpZiBAY29uZmlnLmxhenltb2RlXG5cbiAgICAgICAgICAgICMgQXMgc29vbiBhcyB0aGlzIGV4dGVuc2lvbiBpcyBpbml0aWFsaXplZCB3ZSBhcmUgZ29ubmEgYmUgY3JlYXRpbmdcbiAgICAgICAgICAgICMgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICBAX2NyZWF0ZUluc3RhbmNlKClcblxuICAgICAgICBfY3JlYXRlTGlzdGVuZXJzOiAoKSAtPlxuICAgICAgICAgICAgIyB0aGlzIGdpdmVzIHRoZSBhYmlsaXR5IHRvIGNyZWF0ZSByZXNwb25zaXZlIGltYWdlc1xuICAgICAgICAgICAgIyBieSB0cmlnZ2VyIHRoaXMgZXZlbnQgd2l0aCBvcHRpb25hbCBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBOR1Mub24gJ3Jlc3BvbnNpdmVpbWFnZXM6Y3JlYXRlJywgQF9jcmVhdGVJbnN0YW5jZVxuXG4gICAgICAgIF9jcmVhdGVJbnN0YW5jZSA6IChvcHRpb25zID0ge30pIC0+XG5cbiAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIEltYWdlcyBFeHRlbnNpb24gY3JlYXRpbmcgYSBuZXcgSW1hZ2VyIGluc3RhbmNlXCJcblxuICAgICAgICAgICAgbmV3IEJhc2UuSW1hZ2VyKCBvcHRpb25zLnNlbGVjdG9yIG9yIEBjb25maWcuZGVmYXVsdFNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogb3B0aW9ucy5hdmFpbGFibGVXaWR0aHMgb3IgQGNvbmZpZy5hdmFpbGFibGVXaWR0aHMsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlUGl4ZWxSYXRpb3M6IG9wdGlvbnMuYXZhaWxhYmxlUGl4ZWxSYXRpb3Mgb3IgQGNvbmZpZy5hdmFpbGFibGVQaXhlbFJhdGlvc1xuICAgICAgICAgICAgKVxuXG4gICAgIyByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBpbml0aWFsaXplIG1ldGhvZCB0aGF0IHdpbGwgYmUgdXNlZCB0b1xuICAgICMgaW5pdCB0aGUgZXh0ZW5zaW9uXG4gICAgaW5pdGlhbGl6ZSA6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBpbml0aWFsaXplZFwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucmVzcG9uc2l2ZWltYWdlcyA9ICgpIC0+XG5cbiAgICAgICAgICAgIGNvbmZpZyA9IHt9XG5cbiAgICAgICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICAgICAgaWYgYXBwLmNvbmZpZy5leHRlbnNpb24gYW5kIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG4gICAgICAgICAgICAgICAgY29uZmlnID0gQmFzZS51dGlsLmRlZmF1bHRzIHt9LCBhcHAuY29uZmlnLmV4dGVuc2lvbltAb3B0aW9uS2V5XVxuXG4gICAgICAgICAgICBycCA9IG5ldyBSZXNwb25zaXZlSW1hZ2VzKGNvbmZpZylcblxuICAgICAgICAgICAgIyB0cmlnZ2VyIHRoZSBldmVudCB0byBsZXQgZXZlcnlib2R5IGtub3dzIHRoYXQgdGhpcyBleHRlbnNpb24gZmluaXNoZWRcbiAgICAgICAgICAgICMgaXRzIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgICBOR1MuZW1pdCAncmVzcG9uc2l2ZWltYWdlczppbml0aWFsaXplZCdcblxuICAgICMgdGhpcyBtZXRob2QgaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgY29tcG9uZW50cyBoYXZlIGJlZW5cbiAgICAjIGluaXRpYWxpemVkXG4gICAgYWZ0ZXJBcHBJbml0aWFsaXplZDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiYWZ0ZXJBcHBJbml0aWFsaXplZCBtZXRob2QgZnJvbSBSZXNwb25zaXZlSW1hZ2VzXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzKClcblxuXG4gICAgbmFtZTogJ1Jlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbidcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAncmVzcG9uc2l2ZWltYWdlcydcbilcbiIsIiMjIypcbiAqIFRoZSBFeHRlbnNpb24gTWFuYW5nZXIgd2lsbCBwcm92aWRlIHRoZSBiYXNlIHNldCBvZiBmdW5jdGlvbmFsaXRpZXNcbiAqIHRvIG1ha2UgdGhlIENvcmUgbGlicmFyeSBleHRlbnNpYmxlLlxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HUykgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIEV4dE1hbmFnZXJcblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIERlZmF1bHRzIGNvbmZpZ3MgZm9yIHRoZSBtb2R1bGVcbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgIyMjXG4gICAgICAgIF9leHRlbnNpb25Db25maWdEZWZhdWx0czpcbiAgICAgICAgICAgIGFjdGl2YXRlZCA6IHRydWUgIyB1bmxlc3Mgc2FpZCBvdGhlcndpc2UsIGV2ZXJ5IGFkZGVkIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHdpbGwgYmUgYWN0aXZhdGVkIG9uIHN0YXJ0XG5cbiAgICAgICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAjIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBAX2luaXRpYWxpemVkRXh0ZW5zaW9ucyA9IFtdXG5cbiAgICAgICAgYWRkOiAoZXh0KSAtPlxuXG4gICAgICAgICAgICAjIGNoZWNrcyBpZiB0aGUgbmFtZSBmb3IgdGhlIGV4dGVuc2lvbiBoYXZlIGJlZW4gZGVmaW5lZC5cbiAgICAgICAgICAgICMgaWYgbm90IGxvZyBhIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgdW5sZXNzIGV4dC5uYW1lXG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgZXh0ZW5zaW9uIGRvZXNuJ3QgaGF2ZSBhIG5hbWUgYXNzb2NpYXRlZC4gSXQgd2lsbCBiZSBoZXBmdWxsIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcImlmIHlvdSBoYXZlIGFzc2luZyBhbGwgb2YgeW91ciBleHRlbnNpb25zIGEgbmFtZSBmb3IgYmV0dGVyIGRlYnVnZ2luZ1wiXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgIyBMZXRzIHRocm93IGFuIGVycm9yIGlmIHdlIHRyeSB0byBpbml0aWFsaXplIHRoZSBzYW1lIGV4dGVuc2lvbiB0d2ljZXNcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIEBfZXh0ZW5zaW9ucywgKHh0LCBpKSAtPlxuICAgICAgICAgICAgICAgIGlmIF8uaXNFcXVhbCB4dCwgZXh0XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4dGVuc2lvbjogXCIgKyBleHQubmFtZSArIFwiIGFscmVhZHkgZXhpc3RzLlwiKVxuXG4gICAgICAgICAgICBAX2V4dGVuc2lvbnMucHVzaChleHQpXG5cbiAgICAgICAgaW5pdCA6IChjb250ZXh0KSAtPlxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBAX2V4dGVuc2lvbnNcblxuICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKEBfZXh0ZW5zaW9ucywgY29udGV4dClcblxuICAgICAgICBfaW5pdEV4dGVuc2lvbiA6IChleHRlbnNpb25zLCBjb250ZXh0KSAtPlxuXG4gICAgICAgICAgICBpZiBleHRlbnNpb25zLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIHh0ID0gZXh0ZW5zaW9ucy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICAjIENhbGwgZXh0ZW5zaW9ucyBjb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgIHh0LmluaXRpYWxpemUoY29udGV4dCkgaWYgQF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkKHh0LCBjb250ZXh0LmNvbmZpZylcblxuICAgICAgICAgICAgICAgICMgS2VlcCB0cmFjayBvZiB0aGUgaW5pdGlhbGl6ZWQgZXh0ZW5zaW9ucyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLnB1c2ggeHRcblxuICAgICAgICAgICAgICAgIEBfaW5pdEV4dGVuc2lvbihleHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIF9pc0V4dGVuc2lvbkFsbG93ZWRUb0JlQWN0aXZhdGVkOiAoeHQsIGNvbmZpZykgLT5cblxuICAgICAgICAgICAgIyBmaXJzdCB3ZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBcIm9wdGlvbnNcIiBrZXkgaXMgZGVmaW5lZFxuICAgICAgICAgICAgIyBieSB0aGUgZXh0ZW5zaW9uXG4gICAgICAgICAgICB1bmxlc3MgeHQub3B0aW9uS2V5XG4gICAgICAgICAgICAgICAgbXNnID0gXCJUaGUgb3B0aW9uS2V5IGlzIHJlcXVpcmVkIGFuZCB3YXMgbm90IGRlZmluZWQgYnk6IFwiICsgeHQubmFtZVxuICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICMgaWYgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkIHRvIHRoZSBleHRlbnNpb24sIGxldHMgY2hlY2sganVzdCBmb3IgXCJhY3RpdmF0ZWRcIlxuICAgICAgICAgICAgIyB3aGljaCBpcyB0aGUgb25seSBvcHRpb24gdGhhdCBzaG91bGQgbWF0dGVyIHdpdGhpbiB0aGlzIG1ldGhvZFxuICAgICAgICAgICAgaWYgY29uZmlnLmV4dGVuc2lvbiBhbmQgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmhhc093blByb3BlcnR5ICdhY3RpdmF0ZWQnXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gY29uZmlnLmV4dGVuc2lvblt4dC5vcHRpb25LZXldLmFjdGl2YXRlZFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGFjdGl2YXRlZCA9IEBfZXh0ZW5zaW9uQ29uZmlnRGVmYXVsdHMuYWN0aXZhdGVkXG5cbiAgICAgICAgICAgIHJldHVybiBhY3RpdmF0ZWRcblxuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9ucyA6ICgpIC0+XG4gICAgICAgICAgICByZXR1cm4gQF9pbml0aWFsaXplZEV4dGVuc2lvbnNcblxuICAgICAgICBnZXRJbml0aWFsaXplZEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zLCBvcHRpb25LZXk6IG5hbWVcblxuICAgICAgICBnZXRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2V4dGVuc2lvbnNcblxuICAgICAgICBnZXRFeHRlbnNpb25CeU5hbWUgOiAobmFtZSkgLT5cbiAgICAgICAgICAgIEJhc2UudXRpbC53aGVyZSBAX2V4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgcmV0dXJuIEV4dE1hbmFnZXJcblxuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIENvb2tpZXMpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGNvb2tpZXMgPSByZXF1aXJlKCdjb29raWVzLWpzJylcblxuICAgICMgRXhwb3NlIENvb2tpZXMgQVBJXG4gICAgQ29va2llcyA9XG5cbiAgICAgICAgc2V0OiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuc2V0IGtleSwgdmFsdWUsIG9wdGlvbnNcblxuICAgICAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgICAgICBjb29raWVzLmdldCBrZXlcblxuICAgICAgICBleHBpcmU6IChrZXksIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLmV4cGlyZSBrZXksIG9wdGlvbnNcblxuICAgIHJldHVybiBDb29raWVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIERldmljZURldGVjdGlvbikgLT5cblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIGlzTW9iaWxlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIEV4cG9zZSBkZXZpY2UgZGV0ZWN0aW9uIEFQSVxuICAgIERldmljZURldGVjdGlvbiA9XG5cbiAgICAgICAgIyBHcm91cHNcbiAgICAgICAgaXNNb2JpbGU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5waG9uZVxuXG4gICAgICAgIGlzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUudGFibGV0XG5cbiAgICAgICAgIyBBcHBsZSBkZXZpY2VzXG4gICAgICAgIGlzSXBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUucGhvbmVcblxuICAgICAgICBpc0lwb2Q6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5pcG9kXG5cbiAgICAgICAgaXNJcGFkOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUudGFibGV0XG5cbiAgICAgICAgaXNBcHBsZSA6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5kZXZpY2VcblxuICAgICAgICAjIEFuZHJvaWQgZGV2aWNlc1xuICAgICAgICBpc0FuZHJvaWRQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQucGhvbmVcblxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnRhYmxldFxuXG4gICAgICAgIGlzQW5kcm9pZERldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQuZGV2aWNlXG5cbiAgICAgICAgIyBXaW5kb3dzIGRldmljZXNcbiAgICAgICAgaXNXaW5kb3dzUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnBob25lXG5cbiAgICAgICAgaXNXaW5kb3dzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy50YWJsZXRcblxuICAgICAgICBpc1dpbmRvd3NEZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLmRldmljZVxuXG4gICAgcmV0dXJuIERldmljZURldGVjdGlvblxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFdmVudEJ1cykgLT5cblxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJylcblxuICAgICMjIypcbiAgICAgKiBjbGFzcyB0aGF0IHNlcnZlcyBhcyBhIGZhY2FkZSBmb3IgdGhlIEV2ZW50RW1pdHRlciBjbGFzc1xuICAgICMjI1xuICAgIGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cbiAgICByZXR1cm4gRXZlbnRCdXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVXRpbHMpIC0+XG5cbiAgICAjIEV4cG9zZSBVdGlscyBBUElcbiAgICBVdGlscyA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIGxpYnJhcnkgdmVyc2lvbmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgdmVyc2lvbkNvbXBhcmUgOiAodjEsIHYyLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBpc1ZhbGlkUGFydCA9ICh4KSAtPlxuICAgICAgICAgICAgICAgICgoaWYgbGV4aWNvZ3JhcGhpY2FsIHRoZW4gL15cXGQrW0EtWmEtel0qJC8gZWxzZSAvXlxcZCskLykpLnRlc3QgeFxuXG4gICAgICAgICAgICBsZXhpY29ncmFwaGljYWwgPSBvcHRpb25zIGFuZCBvcHRpb25zLmxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgemVyb0V4dGVuZCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMuemVyb0V4dGVuZFxuICAgICAgICAgICAgdjFwYXJ0cyA9IHYxLnNwbGl0KFwiLlwiKVxuICAgICAgICAgICAgdjJwYXJ0cyA9IHYyLnNwbGl0KFwiLlwiKVxuXG4gICAgICAgICAgICByZXR1cm4gTmFOIGlmIG5vdCB2MXBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KSBvciBub3QgdjJwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydClcblxuICAgICAgICAgICAgaWYgemVyb0V4dGVuZFxuICAgICAgICAgICAgICAgIHYxcGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MXBhcnRzLmxlbmd0aCA8IHYycGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgdjJwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYycGFydHMubGVuZ3RoIDwgdjFwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgdW5sZXNzIGxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgICAgIHYxcGFydHMgPSB2MXBhcnRzLm1hcChOdW1iZXIpXG4gICAgICAgICAgICAgICAgdjJwYXJ0cyA9IHYycGFydHMubWFwKE51bWJlcilcblxuICAgICAgICAgICAgaSA9IC0xXG4gICAgICAgICAgICB3aGlsZSBpIDwgdjFwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgICAgIGlmIHYycGFydHMubGVuZ3RoIDwgaVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGlmIHYxcGFydHNbaV0gPT0gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjFwYXJ0c1tpXSA+IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYycGFydHNbaV0gPiB2MXBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuXG4gICAgICAgICAgICByZXR1cm4gLTEgaWYgdjFwYXJ0cy5sZW5ndGggIT0gdjJwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICBzdHJpbmc6XG4gICAgICAgICAgICBjYXBpdGFsaXplOiAoc3RyKSAtPlxuICAgICAgICAgICAgICAgIHN0ciA9IChpZiBub3Qgc3RyPyB0aGVuIFwiXCIgZWxzZSBTdHJpbmcoc3RyKSlcbiAgICAgICAgICAgICAgICBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcblxuICAgIHJldHVybiBVdGlsc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBMb2dnZXIpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGxvZ2xldmVsID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBFeHBvc2UgdGhlIExvZ2dlciBBUElcbiAgICBMb2dnZXIgPVxuXG4gICAgICAgIHNldExldmVsOiAobGV2ZWwpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5zZXRMZXZlbChsZXZlbClcblxuICAgICAgICB0cmFjZTogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnRyYWNlKG1zZylcblxuICAgICAgICBkZWJ1ZzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmRlYnVnKG1zZylcblxuICAgICAgICBpbmZvOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuaW5mbyhtc2cpXG5cbiAgICAgICAgd2FybjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLndhcm4obXNnKVxuXG4gICAgICAgIGVycm9yOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZXJyb3IobXNnKVxuXG4gICAgcmV0dXJuIExvZ2dlclxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBWZXJzaW9uQ2hlY2tlcikgLT5cblxuICAgIGxvZyA9IHJlcXVpcmUgJy4vbG9nZ2VyLmNvZmZlZSdcbiAgICBVdGlscyA9IHJlcXVpcmUgJy4vZ2VuZXJhbC5jb2ZmZWUnXG5cbiAgICAjIEV4cG9zZSBWZXJzaW9uQ2hlY2tlciBBUElcbiAgICBWZXJzaW9uQ2hlY2tlciA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRvIGNoZWNrIHZlcnNpb25pbmcgZm9yIGFsbCB0aGUgZGVmaW5lZCBsaWJyYXJpZXNcbiAgICAgICAgICogd2l0aGluIHRoZSBkZXBlbmRlbmN5IGFycmF5XG4gICAgICAgICMjI1xuICAgICAgICBjaGVjazogKGRlcGVuZGVuY2llcykgLT5cblxuICAgICAgICAgICAgaWYgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDBcblxuICAgICAgICAgICAgICAgIGRwID0gZGVwZW5kZW5jaWVzLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgIHVubGVzcyBkcC5vYmpcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gZHAubmFtZSArIFwiIGlzIGEgaGFyZCBkZXBlbmRlbmN5IGFuZCBpdCBoYXMgdG8gYmUgbG9hZGVkIGJlZm9yZSBwZXN0bGUuanNcIlxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG5cbiAgICAgICAgICAgICAgICAjIGNvbXBhcmUgdGhlIHZlcnNpb25cbiAgICAgICAgICAgICAgICB1bmxlc3MgVXRpbHMudmVyc2lvbkNvbXBhcmUoZHAudmVyc2lvbiwgZHAucmVxdWlyZWQpID49IDBcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBlbnRlciBoZXJlIGl0IG1lYW5zIHRoZSBsb2FkZWQgbGlicmFyeSBkb2VzdCBub3QgZnVsZmlsbCBvdXIgbmVlZHNcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gXCJbRkFJTF0gXCIgKyBkcC5uYW1lICsgXCI6IHZlcnNpb24gcmVxdWlyZWQ6IFwiICsgZHAucmVxdWlyZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiA8LS0+IExvYWRlZCB2ZXJzaW9uOiBcIiArIGRwLnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAgICAgVmVyc2lvbkNoZWNrZXIuY2hlY2soZGVwZW5kZW5jaWVzKVxuXG5cbiAgICByZXR1cm4gVmVyc2lvbkNoZWNrZXJcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVmlld3BvcnQpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIHZpZXdwb3J0ID0gcmVxdWlyZSgndmVyZ2UnKVxuXG4gICAgIyBFeHBvc2UgVmlld3BvcnQgZGV0ZWN0aW9uIEFQSVxuICAgIFZpZXdwb3J0ID1cblxuICAgICAgICB2aWV3cG9ydFc6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydFcoKVxuXG4gICAgICAgIHZpZXdwb3J0SDogKGtleSkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnZpZXdwb3J0SCgpXG5cbiAgICAgICAgdmlld3BvcnQ6IChrZXkpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydCgpXG5cbiAgICAgICAgaW5WaWV3cG9ydDogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuaW5WaWV3cG9ydChlbCwgY3VzaGlvbilcblxuICAgICAgICBpblg6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluWChlbCwgY3VzaGlvbilcblxuICAgICAgICBpblk6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluWShlbCwgY3VzaGlvbilcblxuICAgICAgICBzY3JvbGxYOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQuc2Nyb2xsWCgpXG5cbiAgICAgICAgc2Nyb2xsWTogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnNjcm9sbFkoKVxuXG4gICAgICAgICMgVG8gdGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZVxuICAgICAgICBtcTogKG1lZGlhUXVlcnlTdHJpbmcpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5tcShtZWRpYVF1ZXJ5U3RyaW5nKVxuXG4gICAgICAgIHJlY3RhbmdsZTogKGVsLCBjdXNoaW9uKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQucmVjdGFuZ2xlKGVsLCBjdXNoaW9uKVxuXG4gICAgICAgICMgaWYgbm8gYXJndW1lbnQgaXMgcGFzc2VkLCB0aGVuIGl0IHJldHVybnMgdGhlIGFzcGVjdFxuICAgICAgICAjIHJhdGlvIG9mIHRoZSB2aWV3cG9ydC4gSWYgYW4gZWxlbWVudCBpcyBwYXNzZWQgaXQgcmV0dXJuc1xuICAgICAgICAjIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgYXNwZWN0OiAobykgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmFzcGVjdChvKVxuXG4gICAgcmV0dXJuIFZpZXdwb3J0XG4pIl19
