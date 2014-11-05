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



},{"./base.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/base.coffee","./extension/components.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/components.coffee","./extension/responsivedesign.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsivedesign.coffee","./extension/responsiveimages.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/extension/responsiveimages.coffee","./util/extmanager.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/extmanager.coffee","./util/module.coffee":"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/src/util/module.coffee"}],"/home/likewise-open/GLOBANT/francisco.ramini/dev/projects/pestle/node_modules/cookies-js/src/cookies.js":[function(_dereq_,module,exports){
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
     * [startAll description]
     * @author Francisco Ramini <francisco.ramini at globant.com>
     * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
     * @return {[type]}
     */

    Component.startAll = function(selector, app, namespace) {
      var components;
      if (selector == null) {
        selector = 'body';
      }
      if (namespace == null) {
        namespace = NGS.modules;
      }
      components = Component.parseList(selector, app.config.namespace);
      Base.log.info("Parsed components");
      Base.log.debug(Base.util.clone(components));
      Base.util.each(namespace, function(definition, name) {
        if (Base.util.isObject(definition)) {
          return Module.extend(name, definition);
        }
      });
      Base.util.extend(namespace, NGS.Module.list);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9jb3JlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL2Nvb2tpZXMtanMvc3JjL2Nvb2tpZXMuanMiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL25vZGVfbW9kdWxlcy9pbWFnZXIuanMvSW1hZ2VyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9ub2RlX21vZHVsZXMvaXNtb2JpbGVqcy9pc01vYmlsZS5qcyIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvbm9kZV9tb2R1bGVzL3ZlcmdlL3ZlcmdlLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9ub2RlX21vZHVsZXMvd29sZnk4Ny1ldmVudGVtaXR0ZXIvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvYmFzZS5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vY29tcG9uZW50cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy9leHRlbnNpb24vcmVzcG9uc2l2ZWltYWdlcy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2Nvb2tpZXMuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9ldmVudGJ1cy5jb2ZmZWUiLCIvaG9tZS9saWtld2lzZS1vcGVuL0dMT0JBTlQvZnJhbmNpc2NvLnJhbWluaS9kZXYvcHJvamVjdHMvcGVzdGxlL3NyYy91dGlsL2V4dG1hbmFnZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC9nZW5lcmFsLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbG9nZ2VyLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvbW9kdWxlLmNvZmZlZSIsIi9ob21lL2xpa2V3aXNlLW9wZW4vR0xPQkFOVC9mcmFuY2lzY28ucmFtaW5pL2Rldi9wcm9qZWN0cy9wZXN0bGUvc3JjL3V0aWwvdmVyc2lvbmNoZWNrZXIuY29mZmVlIiwiL2hvbWUvbGlrZXdpc2Utb3Blbi9HTE9CQU5UL2ZyYW5jaXNjby5yYW1pbmkvZGV2L3Byb2plY3RzL3Blc3RsZS9zcmMvdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUFBOzs7O0dBQUE7QUFBQSxDQUtDLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtTQUVHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUksQ0FBQyxHQUFMLEdBQVcsT0FBQSxDQUFRLElBQVIsRUFBYyxFQUFkLEVBRi9CO0FBQUEsQ0FBRCxDQUFBLENBSUUsTUFKRixFQUlVLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTtBQUVOLE1BQUEsZ0JBQUE7QUFBQSxFQUFBLElBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUFiLENBQUE7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FEYixDQUFBO0FBQUEsRUFJQSxHQUFBLEdBQVUsSUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSlYsQ0FBQTtBQUFBLEVBTUEsR0FBRyxDQUFDLE1BQUosR0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FOYixDQUFBO0FBQUEsRUFTQSxHQUFHLENBQUMsT0FBSixHQUFjLEVBVGQsQ0FBQTtBQUFBLEVBV00sR0FBRyxDQUFDO0FBRU4sbUJBQUEsT0FBQSxHQUFTLE9BQVQsQ0FBQTs7QUFBQSxtQkFFQSxHQUFBLEdBQ0k7QUFBQSxNQUFBLEtBQUEsRUFDSTtBQUFBLFFBQUEsUUFBQSxFQUFVLENBQVY7T0FESjtBQUFBLE1BR0EsU0FBQSxFQUFXLFVBSFg7QUFBQSxNQUtBLFNBQUEsRUFBVyxFQUxYO0tBSEosQ0FBQTs7QUFVYSxJQUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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WSxnQkFBWixFQURBO0lBQUEsQ0F6Qko7QUFBQSxJQTRCQSxTQUFBLEVBQVcsU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO2FBQ1AsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsRUFBbkIsRUFBdUIsT0FBdkIsRUFETztJQUFBLENBNUJYO0FBQUEsSUFrQ0EsTUFBQSxFQUFRLFNBQUMsQ0FBRCxHQUFBO2FBQ0osUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFESTtJQUFBLENBbENSO0dBTEosQ0FBQTtBQTBDQSxTQUFPLFFBQVAsQ0E3Q007QUFBQSxDQUpWLENBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyMqXG4gKiBUaGUgY29yZSBsYXllciB3aWxsIGRlcGVuZCBvbiB0aGUgYmFzZSBsYXllciBhbmQgd2lsbCBwcm92aWRlXG4gKiB0aGUgY29yZSBzZXQgb2YgZnVuY3Rpb25hbGl0eSB0byBhcHBsaWNhdGlvbiBmcmFtZXdvcmtcbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcm9vdC5OR1MgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE5HUykgLT5cblxuICAgIEJhc2UgICAgICAgPSByZXF1aXJlKCcuL2Jhc2UuY29mZmVlJylcbiAgICBFeHRNYW5hZ2VyID0gcmVxdWlyZSgnLi91dGlsL2V4dG1hbmFnZXIuY29mZmVlJylcblxuICAgICMgd2UnbGwgdXNlIHRoZSBOR1Mgb2JqZWN0IGFzIHRoZSBnbG9iYWwgRXZlbnQgYnVzXG4gICAgTkdTID0gbmV3IEJhc2UuRXZlbnRzKClcblxuICAgIE5HUy5Nb2R1bGUgPSByZXF1aXJlKCcuL3V0aWwvbW9kdWxlLmNvZmZlZScpXG5cbiAgICAjIE5hbWVzcGFjZSBmb3IgbW9kdWxlIGRlZmluaXRpb25cbiAgICBOR1MubW9kdWxlcyA9IHt9XG5cbiAgICBjbGFzcyBOR1MuQ29yZVxuICAgICAgICAjIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgbGlicmFyeVxuICAgICAgICB2ZXJzaW9uOiBcIjAuMC4xXCJcblxuICAgICAgICBjZmc6XG4gICAgICAgICAgICBkZWJ1ZzpcbiAgICAgICAgICAgICAgICBsb2dMZXZlbDogNSAjIGJ5IGRlZmF1bHQgdGhlIGxvZ2dpbmcgd2lsbCBiZSBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdmFsdWVzIGNhbiBnbyBmcm9tIDAgdG8gNSAoNSBtZWFucyBkaXNhYmxlZClcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ3BsYXRmb3JtJ1xuXG4gICAgICAgICAgICBleHRlbnNpb246IHt9ICMgZGVmaW5lIHRoZSBuYW1lc3BhY2UgdG8gZGVmaW5lIGV4dGVuc2lvbiBzcGVjaWZpYyBzZXR0aW5nc1xuXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoY29uZmlnID0ge30pIC0+XG5cbiAgICAgICAgICAgIEBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMgY29uZmlnLCBAY2ZnXG5cbiAgICAgICAgICAgICMgdGhpcyB3aWxsIHRyYWNrIHRoZSBzdGF0ZSBvZiB0aGUgQ29yZS4gV2hlbiBpdCBpc1xuICAgICAgICAgICAgIyB0cnVlLCBpdCBtZWFucyB0aGUgXCJzdGFydCgpXCIgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgICAgICBAc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICMgU2V0IHRoZSBsb2dnaW5nIGxldmVsIGZvciB0aGUgYXBwXG4gICAgICAgICAgICBCYXNlLmxvZy5zZXRMZXZlbChAY29uZmlnLmRlYnVnLmxvZ0xldmVsKVxuXG4gICAgICAgICAgICAjIFRoZSBleHRlbnNpb24gbWFuYWdlciB3aWxsIGJlIG9uIGNoYXJnZSBvZiBsb2FkaW5nIGV4dGVuc2lvbnNcbiAgICAgICAgICAgICMgYW5kIG1ha2UgaXRzIGZ1bmN0aW9uYWxpdHkgYXZhaWxhYmxlIHRvIHRoZSBzdGFja1xuICAgICAgICAgICAgQGV4dE1hbmFnZXIgPSBuZXcgRXh0TWFuYWdlcigpXG5cbiAgICAgICAgICAgICMgdGhyb3VnaCB0aGlzIG9iamVjdCB0aGUgbW9kdWxlcyB3aWxsIGJlIGFjY2VzaW5nIHRoZSBtZXRob2RzIGRlZmluZWQgYnkgdGhlXG4gICAgICAgICAgICAjIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBzYW5kYm94ID0gQmFzZS51dGlsLmNsb25lIEJhc2VcblxuICAgICAgICAgICAgIyBuYW1lc3BhY2UgdG8gaG9sZCBhbGwgdGhlIHNhbmRib3hlc1xuICAgICAgICAgICAgQHNhbmRib3hlcyA9IHt9XG5cbiAgICAgICAgICAgICMgUmVxdWlyZSBjb3JlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbi9jb21wb25lbnRzLmNvZmZlZScpXG4gICAgICAgICAgICBSZXNwb25zaXZlRGVzaWduID0gcmVxdWlyZSgnLi9leHRlbnNpb24vcmVzcG9uc2l2ZWRlc2lnbi5jb2ZmZWUnKVxuICAgICAgICAgICAgUmVzcG9uc2l2ZUltYWdlcyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uL3Jlc3BvbnNpdmVpbWFnZXMuY29mZmVlJylcblxuICAgICAgICAgICAgIyBBZGQgY29yZSBleHRlbnNpb25zIHRvIHRoZSBhcHBcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmFkZChDb21wb25lbnRzKVxuICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKFJlc3BvbnNpdmVEZXNpZ24pXG4gICAgICAgICAgICBAZXh0TWFuYWdlci5hZGQoUmVzcG9uc2l2ZUltYWdlcylcblxuICAgICAgICBhZGRFeHRlbnNpb246IChleHQpIC0+XG4gICAgICAgICAgICAjIHdlJ2xsIG9ubHkgYWxsb3cgdG8gYWRkIG5ldyBleHRlbnNpb25zIGJlZm9yZVxuICAgICAgICAgICAgIyB0aGUgQ29yZSBnZXQgc3RhcnRlZFxuICAgICAgICAgICAgdW5sZXNzIEBzdGFydGVkXG4gICAgICAgICAgICAgICAgQGV4dE1hbmFnZXIuYWRkKGV4dClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy5lcnJvcihcIlRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4gWW91IGNhbiBub3QgYWRkIG5ldyBleHRlbnNpb25zIGF0IHRoaXMgcG9pbnQuXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG5vdCBhZGQgZXh0ZW5zaW9ucyB3aGVuIHRoZSBDb3JlIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC4nKVxuXG4gICAgICAgIHN0YXJ0OiAob3B0aW9ucykgLT5cblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyhcIlN0YXJ0IGRlIENvcmVcIilcblxuICAgICAgICAgICAgQHN0YXJ0ZWQgPSB0cnVlXG5cbiAgICAgICAgICAgICMgSW5pdCBhbGwgdGhlIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIEBleHRNYW5hZ2VyLmluaXQoQClcblxuICAgICAgICAgICAgIyBDYWxsYmFjayBvYmplY3QgdGhhdCBpcyBnb25uYSBob2xkIGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZFxuICAgICAgICAgICAgIyBhZnRlciBhbGwgZXh0ZW5zaW9ucyBoYXMgYmVlbiBpbml0aWFsaXplZCBhbmQgdGhlIGVhY2ggYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAjIG1ldGhvZCBleGVjdXRlZFxuICAgICAgICAgICAgY2IgPSAkLkNhbGxiYWNrcyBcInVuaXF1ZSBtZW1vcnlcIlxuXG4gICAgICAgICAgICAjIE9uY2UgdGhlIGV4dGVuc2lvbnMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLCBsZXRzIGNhbGwgdGhlIGFmdGVyQXBwU3RhcnRlZFxuICAgICAgICAgICAgIyBmcm9tIGVhY2ggZXh0ZW5zaW9uXG4gICAgICAgICAgICAjIE5vdGU6IFRoaXMgbWV0aG9kIHdpbGwgbGV0IGVhY2ggZXh0ZW5zaW9uIHRvIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBzb21lIGNvZGVcbiAgICAgICAgICAgICMgICAgICAgb25jZSB0aGUgYXBwIGhhcyBzdGFydGVkLlxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQGV4dE1hbmFnZXIuZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zKCksIChleHQsIGkpID0+XG5cbiAgICAgICAgICAgICAgICBpZiBleHRcblxuICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNGdW5jdGlvbiBleHQuYWZ0ZXJBcHBTdGFydGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBleHQuYWZ0ZXJBcHBTdGFydGVkKEApXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gZXh0LmFmdGVyQXBwSW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmFkZCBleHQuYWZ0ZXJBcHBJbml0aWFsaXplZFxuXG4gICAgICAgICAgICAjIENhbGwgdGhlIC5hZnRlckFwcEluaXRpYWxpemVkIGNhbGxiYWNrcyB3aXRoIEAgYXMgcGFyYW1ldGVyXG4gICAgICAgICAgICBjYi5maXJlIEBcblxuICAgICAgICBjcmVhdGVTYW5kYm94OiAobmFtZSwgb3B0cykgLT5cbiAgICAgICAgICAgIEBzYW5kYm94ZXNbbmFtZV0gPSBCYXNlLnV0aWwuZXh0ZW5kIHt9LCBAc2FuZGJveCwgbmFtZSA6IG5hbWVcblxuICAgICAgICBnZXRJbml0aWFsaXplZENvbXBvbmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAc2FuZGJveC5nZXRJbml0aWFsaXplZENvbXBvbmVudHMoKVxuXG5cbiAgICByZXR1cm4gTkdTXG4pXG4iLCIvKiFcbiAqIENvb2tpZXMuanMgLSAwLjQuMFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgU2NvdHQgSGFtcGVyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UsXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBDb29raWVzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xuICAgICAgICAgICAgQ29va2llcy5nZXQoa2V5KSA6IENvb2tpZXMuc2V0KGtleSwgdmFsdWUsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xuICAgIENvb2tpZXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgQ29va2llcy5fbmF2aWdhdG9yID0gbmF2aWdhdG9yO1xuXG4gICAgQ29va2llcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgfTtcblxuICAgIENvb2tpZXMuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgIT09IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSkge1xuICAgICAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvb2tpZXMuX2NhY2hlW2tleV07XG4gICAgfTtcblxuICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcblxuICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcblxuICAgICAgICByZXR1cm4gQ29va2llcztcbiAgICB9O1xuXG4gICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXG4gICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXG4gICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXG4gICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2lzVmFsaWREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nICYmICFpc05hTihkYXRlLmdldFRpbWUoKSk7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xuICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcbiAgICAgICAgc3dpdGNoICh0eXBlb2YgZXhwaXJlcykge1xuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzogZXhwaXJlcyA9IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzogZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChleHBpcmVzICYmICFDb29raWVzLl9pc1ZhbGlkRGF0ZShleHBpcmVzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZXhwaXJlc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBEYXRlIGluc3RhbmNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwaXJlcztcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2VuZXJhdGVDb29raWVTdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvW14jJCYrXFxeYHxdL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XG4gICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXCgvZywgJyUyOCcpLnJlcGxhY2UoL1xcKS9nLCAnJTI5Jyk7XG4gICAgICAgIHZhbHVlID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teISMkJi0rXFwtLTo8LVxcW1xcXS1+XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB2YXIgY29va2llU3RyaW5nID0ga2V5ICsgJz0nICsgdmFsdWU7XG4gICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnBhdGggPyAnO3BhdGg9JyArIG9wdGlvbnMucGF0aCA6ICcnO1xuICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5kb21haW4gPyAnO2RvbWFpbj0nICsgb3B0aW9ucy5kb21haW4gOiAnJztcbiAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZXhwaXJlcyA/ICc7ZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcbiAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuc2VjdXJlID8gJztzZWN1cmUnIDogJyc7XG5cbiAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcbiAgICB9O1xuXG4gICAgQ29va2llcy5fZ2V0Q29va2llT2JqZWN0RnJvbVN0cmluZyA9IGZ1bmN0aW9uIChkb2N1bWVudENvb2tpZSkge1xuICAgICAgICB2YXIgY29va2llT2JqZWN0ID0ge307XG4gICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWVLdnAgPSBDb29raWVzLl9nZXRLZXlWYWx1ZVBhaXJGcm9tQ29va2llU3RyaW5nKGNvb2tpZXNBcnJheVtpXSk7XG5cbiAgICAgICAgICAgIGlmIChjb29raWVPYmplY3RbY29va2llS3ZwLmtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvb2tpZU9iamVjdFtjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb29raWVPYmplY3Q7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XG4gICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXG4gICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XG5cbiAgICAgICAgLy8gSUUgb21pdHMgdGhlIFwiPVwiIHdoZW4gdGhlIGNvb2tpZSB2YWx1ZSBpcyBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgc2VwYXJhdG9ySW5kZXggPSBzZXBhcmF0b3JJbmRleCA8IDAgPyBjb29raWVTdHJpbmcubGVuZ3RoIDogc2VwYXJhdG9ySW5kZXg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZVN0cmluZy5zdWJzdHIoMCwgc2VwYXJhdG9ySW5kZXgpKSxcbiAgICAgICAgICAgIHZhbHVlOiBkZWNvZGVVUklDb21wb25lbnQoY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpKVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENvb2tpZU9iamVjdEZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcbiAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XG4gICAgfTtcblxuICAgIENvb2tpZXMuX2FyZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0ZXN0S2V5ID0gJ2Nvb2tpZXMuanMnO1xuICAgICAgICB2YXIgYXJlRW5hYmxlZCA9IENvb2tpZXMuc2V0KHRlc3RLZXksIDEpLmdldCh0ZXN0S2V5KSA9PT0gJzEnO1xuICAgICAgICBDb29raWVzLmV4cGlyZSh0ZXN0S2V5KTtcbiAgICAgICAgcmV0dXJuIGFyZUVuYWJsZWQ7XG4gICAgfTtcblxuICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcblxuICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gQ29va2llczsgfSk7XG4gICAgLy8gQ29tbW9uSlMgYW5kIE5vZGUuanMgbW9kdWxlIHN1cHBvcnQuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gU3VwcG9ydCBOb2RlLmpzIHNwZWNpZmljIGBtb2R1bGUuZXhwb3J0c2AgKHdoaWNoIGNhbiBiZSBhIGZ1bmN0aW9uKVxuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IENvb2tpZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXG4gICAgICAgIGV4cG9ydHMuQ29va2llcyA9IENvb2tpZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LkNvb2tpZXMgPSBDb29raWVzO1xuICAgIH1cbn0pKCk7IiwiO1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkZWZhdWx0V2lkdGhzLCBnZXRLZXlzLCBuZXh0VGljaywgYWRkRXZlbnQsIGdldE5hdHVyYWxXaWR0aDtcblxuICAgIG5leHRUaWNrID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhcHBseUVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2tFYWNoKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICAgICAgbmV3X2NvbGxlY3Rpb24gPSBbXTtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdfY29sbGVjdGlvbltpXSA9IGNhbGxiYWNrRWFjaChjb2xsZWN0aW9uW2ldLCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdfY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXR1cm5EaXJlY3RWYWx1ZSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0TmF0dXJhbFdpZHRoID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpLCAnbmF0dXJhbFdpZHRoJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpbWFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS5uYXR1cmFsV2lkdGg7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIElFOCBhbmQgYmVsb3cgbGFja3MgdGhlIG5hdHVyYWxXaWR0aCBwcm9wZXJ0eVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBpbWcuc3JjID0gc291cmNlLnNyYztcbiAgICAgICAgICAgIHJldHVybiBpbWcud2lkdGg7XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIGFkZEV2ZW50ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFkZFN0YW5kYXJkRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4sIGZhbHNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWRkSUVFdmVudExpc3RlbmVyKGVsLCBldmVudE5hbWUsIGZuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgZGVmYXVsdFdpZHRocyA9IFs5NiwgMTMwLCAxNjUsIDIwMCwgMjM1LCAyNzAsIDMwNCwgMzQwLCAzNzUsIDQxMCwgNDQ1LCA0ODUsIDUyMCwgNTU1LCA1OTAsIDYyNSwgNjYwLCA2OTUsIDczNl07XG5cbiAgICBnZXRLZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXSxcbiAgICAgICAgICAgIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgICAgQ29uc3RydWN0IGEgbmV3IEltYWdlciBpbnN0YW5jZSwgcGFzc2luZyBhbiBvcHRpb25hbCBjb25maWd1cmF0aW9uIG9iamVjdC5cblxuICAgICAgICBFeGFtcGxlIHVzYWdlOlxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gQXZhaWxhYmxlIHdpZHRocyBmb3IgeW91ciBpbWFnZXNcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVXaWR0aHM6IFtOdW1iZXJdLFxuXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0b3IgdG8gYmUgdXNlZCB0byBsb2NhdGUgeW91ciBkaXYgcGxhY2Vob2xkZXJzXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICcnLFxuXG4gICAgICAgICAgICAgICAgLy8gQ2xhc3MgbmFtZSB0byBnaXZlIHlvdXIgcmVzaXphYmxlIGltYWdlc1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJycsXG5cbiAgICAgICAgICAgICAgICAvLyBJZiBzZXQgdG8gdHJ1ZSwgSW1hZ2VyIHdpbGwgdXBkYXRlIHRoZSBzcmMgYXR0cmlidXRlIG9mIHRoZSByZWxldmFudCBpbWFnZXNcbiAgICAgICAgICAgICAgICBvblJlc2l6ZTogQm9vbGVhbixcblxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGUgbGF6eSBsb2FkIGZ1bmN0aW9uYWxpdHkgb24gb3Igb2ZmXG4gICAgICAgICAgICAgICAgbGF6eWxvYWQ6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgICAgICAvLyBVc2VkIGFsb25nc2lkZSB0aGUgbGF6eWxvYWQgZmVhdHVyZSAoaGVscHMgcGVyZm9ybWFuY2UgYnkgc2V0dGluZyBhIGhpZ2hlciBkZWxheSlcbiAgICAgICAgICAgICAgICBzY3JvbGxEZWxheTogTnVtYmVyXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgQHBhcmFtIHtvYmplY3R9IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICAgICAgQHJldHVybiB7b2JqZWN0fSBpbnN0YW5jZSBvZiBJbWFnZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJbWFnZXIoZWxlbWVudHMsIG9wdHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgZG9jID0gZG9jdW1lbnQ7XG5cbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICAgICAgaWYgKGVsZW1lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHNlbGVjdG9yIHN0cmluZ1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnNlbGVjdG9yID0gZWxlbWVudHM7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSBgb3B0c2Agb2JqZWN0LCBgZWxlbWVudHNgIGlzIGltcGxpY2l0bHkgdGhlIGBvcHRzLnNlbGVjdG9yYCBzdHJpbmdcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50cy5sZW5ndGggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgb3B0cyA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbWFnZXNPZmZTY3JlZW4gPSBbXTtcbiAgICAgICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLnNlbGVjdG9yID0gb3B0cy5zZWxlY3RvciB8fCAnLmRlbGF5ZWQtaW1hZ2UtbG9hZCc7XG4gICAgICAgIHRoaXMuY2xhc3NOYW1lID0gb3B0cy5jbGFzc05hbWUgfHwgJ2ltYWdlLXJlcGxhY2UnO1xuICAgICAgICB0aGlzLmdpZiA9IGRvYy5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgdGhpcy5naWYuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEVBQUpBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBUUFBa0FBQUlLaEkrcHkrMFBvNXlVRlFBNyc7XG4gICAgICAgIHRoaXMuZ2lmLmNsYXNzTmFtZSA9IHRoaXMuY2xhc3NOYW1lO1xuICAgICAgICB0aGlzLmdpZi5hbHQgPSAnJztcbiAgICAgICAgdGhpcy5zY3JvbGxEZWxheSA9IG9wdHMuc2Nyb2xsRGVsYXkgfHwgMjUwO1xuICAgICAgICB0aGlzLm9uUmVzaXplID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnb25SZXNpemUnKSA/IG9wdHMub25SZXNpemUgOiB0cnVlO1xuICAgICAgICB0aGlzLmxhenlsb2FkID0gb3B0cy5oYXNPd25Qcm9wZXJ0eSgnbGF6eWxvYWQnKSA/IG9wdHMubGF6eWxvYWQgOiBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVBpeGVsUmF0aW9zID0gb3B0cy5hdmFpbGFibGVQaXhlbFJhdGlvcyB8fCBbMSwgMl07XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gb3B0cy5hdmFpbGFibGVXaWR0aHMgfHwgZGVmYXVsdFdpZHRocztcbiAgICAgICAgdGhpcy5vbkltYWdlc1JlcGxhY2VkID0gb3B0cy5vbkltYWdlc1JlcGxhY2VkIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHRoaXMud2lkdGhzTWFwID0ge307XG4gICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcbiAgICAgICAgdGhpcy53aWR0aEludGVycG9sYXRvciA9IG9wdHMud2lkdGhJbnRlcnBvbGF0b3IgfHwgcmV0dXJuRGlyZWN0VmFsdWU7XG4gICAgICAgIHRoaXMuZGVsdGFTcXVhcmUgPSBvcHRzLmRlbHRhU3F1YXJlIHx8IDEuNTtcbiAgICAgICAgdGhpcy5zcXVhcmVTZWxlY3RvciA9IG9wdHMuc3F1YXJlU2VsZWN0b3IgfHwgJ3NxcmNyb3AnO1xuICAgICAgICB0aGlzLmFkYXB0U2VsZWN0b3IgPSB0aGlzLmFkYXB0U2VsZWN0b3IgfHwgJ2FkYXB0JztcblxuICAgICAgICAvLyBOZWVkZWQgYXMgSUU4IGFkZHMgYSBkZWZhdWx0IGB3aWR0aGAvYGhlaWdodGAgYXR0cmlidXRl4oCmXG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgICAgIHRoaXMuZ2lmLnJlbW92ZUF0dHJpYnV0ZSgnd2lkdGgnKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzLmxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IEltYWdlci5jcmVhdGVXaWR0aHNNYXAodGhpcy5hdmFpbGFibGVXaWR0aHMsIHRoaXMud2lkdGhJbnRlcnBvbGF0b3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoc01hcCA9IHRoaXMuYXZhaWxhYmxlV2lkdGhzO1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gZ2V0S2V5cyh0aGlzLmF2YWlsYWJsZVdpZHRocyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlV2lkdGhzID0gdGhpcy5hdmFpbGFibGVXaWR0aHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmRpdnMgPSBhcHBseUVhY2goZWxlbWVudHMsIHJldHVybkRpcmVjdFZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0b3IgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXZzID0gYXBwbHlFYWNoKGRvYy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpLCByZXR1cm5EaXJlY3RWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzKCk7XG5cbiAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5zY3JvbGxDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxlZCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kaXZzID0gdGhpcy5pbWFnZXNPZmZTY3JlZW4uc2xpY2UoMCk7IC8vIGNvcHkgYnkgdmFsdWUsIGRvbid0IGNvcHkgYnkgcmVmZXJlbmNlXG4gICAgICAgICAgICB0aGlzLmltYWdlc09mZlNjcmVlbi5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEaXZzVG9FbXB0eUltYWdlcygpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGVja0ltYWdlc05lZWRSZXBsYWNpbmcodGhpcy5kaXZzKTtcblxuICAgICAgICBpZiAodGhpcy5vblJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclJlc2l6ZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXp5bG9hZCkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclNjcm9sbEV2ZW50KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5jcmVhdGVHaWYgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgYSByZXNwb25zaXZlIGltYWdlIHRoZW4gd2UgZG9uJ3QgcmVwbGFjZSBpdCBhZ2FpblxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58ICknICsgdGhpcy5jbGFzc05hbWUgKyAnKCB8JCknKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnRDbGFzc05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycpO1xuICAgICAgICB2YXIgZWxlbWVudFdpZHRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKTtcbiAgICAgICAgdmFyIGdpZiA9IHRoaXMuZ2lmLmNsb25lTm9kZShmYWxzZSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnRXaWR0aCkge1xuICAgICAgICAgICAgZ2lmLndpZHRoID0gZWxlbWVudFdpZHRoO1xuICAgICAgICAgICAgZ2lmLnNldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcsIGVsZW1lbnRXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBnaWYuY2xhc3NOYW1lID0gKGVsZW1lbnRDbGFzc05hbWUgPyBlbGVtZW50Q2xhc3NOYW1lICsgJyAnIDogJycpICsgdGhpcy5jbGFzc05hbWU7XG4gICAgICAgIGdpZi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpO1xuICAgICAgICBnaWYuc2V0QXR0cmlidXRlKCdhbHQnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1hbHQnKSB8fCB0aGlzLmdpZi5hbHQpO1xuXG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoZ2lmLCBlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gZ2lmO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmNoYW5nZURpdnNUb0VtcHR5SW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhcHBseUVhY2godGhpcy5kaXZzLCBmdW5jdGlvbihlbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5sYXp5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzVGhpc0VsZW1lbnRPblNjcmVlbihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRpdnNbaV0gPSBzZWxmLmNyZWF0ZUdpZihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmltYWdlc09mZlNjcmVlbi5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kaXZzW2ldID0gc2VsZi5jcmVhdGVHaWYoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrSW1hZ2VzTmVlZFJlcGxhY2luZyh0aGlzLmRpdnMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNUaGlzRWxlbWVudE9uU2NyZWVuID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvLyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB3YXMgd29ya2luZyBpbiBDaHJvbWUgYnV0IGRpZG4ndCB3b3JrIG9uIEZpcmVmb3gsIHNvIGhhZCB0byByZXNvcnQgdG8gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIC8vIGJ1dCBjYW4ndCBmYWxsYmFjayB0byBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCBhcyB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRSB3aXRoIGEgZG9jdHlwZSAoPykgc28gaGF2ZSB0byB1c2UgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgICAgICB2YXIgb2Zmc2V0ID0gSW1hZ2VyLmdldFBhZ2VPZmZzZXQoKTtcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXRUb3AgPSAwO1xuXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXRUb3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoZWxlbWVudE9mZnNldFRvcCA8ICh0aGlzLnZpZXdwb3J0SGVpZ2h0ICsgb2Zmc2V0KSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNpemluZykge1xuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBpeGVsUmF0aW8oKTtcblxuICAgICAgICAgICAgYXBwbHlFYWNoKGltYWdlcywgZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyhpbWFnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uSW1hZ2VzUmVwbGFjZWQoaW1hZ2VzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlcGxhY2VJbWFnZXNCYXNlZE9uU2NyZWVuRGltZW5zaW9ucyA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHZhciBjb21wdXRlZFdpZHRoLCBzcmMsIG5hdHVyYWxXaWR0aDtcblxuICAgICAgICBuYXR1cmFsV2lkdGggPSBnZXROYXR1cmFsV2lkdGgoaW1hZ2UpO1xuICAgICAgICBjb21wdXRlZFdpZHRoID0gdHlwZW9mIHRoaXMuYXZhaWxhYmxlV2lkdGhzID09PSAnZnVuY3Rpb24nID8gdGhpcy5hdmFpbGFibGVXaWR0aHMoaW1hZ2UpIDogdGhpcy5kZXRlcm1pbmVBcHByb3ByaWF0ZVJlc29sdXRpb24oaW1hZ2UpO1xuXG4gICAgICAgIGltYWdlLndpZHRoID0gY29tcHV0ZWRXaWR0aDtcblxuICAgICAgICBpZiAoaW1hZ2Uuc3JjICE9PSB0aGlzLmdpZi5zcmMgJiYgY29tcHV0ZWRXaWR0aCA8PSBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNyYyA9IHRoaXMuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyh0aGlzLmJ1aWxkVXJsU3RydWN0dXJlKGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSwgaW1hZ2UpLCBjb21wdXRlZFdpZHRoKTtcblxuICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG5cbiAgICAgICAgaWYgKEJhY2tib25lKSB7XG4gICAgICAgICAgICBCYWNrYm9uZS50cmlnZ2VyKCdpbWFnZXI6cmVhZHknKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuZGV0ZXJtaW5lQXBwcm9wcmlhdGVSZXNvbHV0aW9uID0gZnVuY3Rpb24oaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJykgfHwgaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCwgdGhpcy5hdmFpbGFibGVXaWR0aHMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gdmFsdWUgdXNlZCBieSBJbWFnZXJcbiAgICAgKlxuICAgICAqIEl0IGlzIHBlcmZvcm1lZCBiZWZvcmUgZWFjaCByZXBsYWNlbWVudCBsb29wLCBpbiBjYXNlIGEgdXNlciB6b29tZWQgaW4vb3V0XG4gICAgICogYW5kIHRodXMgdXBkYXRlZCB0aGUgYHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvYCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBhcGlcbiAgICAgKiBAc2luY2UgMS4wLjFcbiAgICAgKi9cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZnJlc2hQaXhlbFJhdGlvID0gZnVuY3Rpb24gcmVmcmVzaFBpeGVsUmF0aW8oKSB7XG4gICAgICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyA9IEltYWdlci5nZXRDbG9zZXN0VmFsdWUoSW1hZ2VyLmdldFBpeGVsUmF0aW8oKSwgdGhpcy5hdmFpbGFibGVQaXhlbFJhdGlvcyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuY2hhbmdlSW1hZ2VTcmNUb1VzZU5ld0ltYWdlRGltZW5zaW9ucyA9IGZ1bmN0aW9uKHNyYywgc2VsZWN0ZWRXaWR0aCkge1xuICAgICAgICByZXR1cm4gc3JjXG4gICAgICAgICAgICAucmVwbGFjZSgve3dpZHRofS9nLCBJbWFnZXIudHJhbnNmb3Jtcy53aWR0aChzZWxlY3RlZFdpZHRoLCB0aGlzLndpZHRoc01hcCkpXG4gICAgICAgICAgICAucmVwbGFjZSgve3BpeGVsX3JhdGlvfS9nLCBJbWFnZXIudHJhbnNmb3Jtcy5waXhlbFJhdGlvKHRoaXMuZGV2aWNlUGl4ZWxSYXRpbykpO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLmJ1aWxkVXJsU3RydWN0dXJlID0gZnVuY3Rpb24oc3JjLCBpbWFnZSkge1xuICAgICAgICB2YXIgc3F1YXJlU2VsZWN0b3IgPSB0aGlzLmlzSW1hZ2VDb250YWluZXJTcXVhcmUoaW1hZ2UpID8gJy4nICsgdGhpcy5zcXVhcmVTZWxlY3RvciA6ICcnO1xuXG4gICAgICAgIHJldHVybiBzcmNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4oanBnfGdpZnxibXB8cG5nKVtec10/KHt3aWR0aH0pP1tec10oe3BpeGVsX3JhdGlvfSk/L2csICcuJyArIHRoaXMuYWRhcHRTZWxlY3RvciArICcuJDIuJDMnICsgc3F1YXJlU2VsZWN0b3IgKyAnLiQxJyk7XG4gICAgfTtcblxuICAgIEltYWdlci5wcm90b3R5cGUuaXNJbWFnZUNvbnRhaW5lclNxdWFyZSA9IGZ1bmN0aW9uKGltYWdlKSB7XG4gICAgICAgIHJldHVybiAoaW1hZ2UucGFyZW50Tm9kZS5jbGllbnRXaWR0aCAvIGltYWdlLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0KSA8PSB0aGlzLmRlbHRhU3F1YXJlXG4gICAgfTtcblxuICAgIEltYWdlci5nZXRQaXhlbFJhdGlvID0gZnVuY3Rpb24gZ2V0UGl4ZWxSYXRpbyhjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAoY29udGV4dCB8fCB3aW5kb3cpWydkZXZpY2VQaXhlbFJhdGlvJ10gfHwgMTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmNyZWF0ZVdpZHRoc01hcCA9IGZ1bmN0aW9uIGNyZWF0ZVdpZHRoc01hcCh3aWR0aHMsIGludGVycG9sYXRvcikge1xuICAgICAgICB2YXIgbWFwID0ge30sXG4gICAgICAgICAgICBpID0gd2lkdGhzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBtYXBbd2lkdGhzW2ldXSA9IGludGVycG9sYXRvcih3aWR0aHNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnRyYW5zZm9ybXMgPSB7XG4gICAgICAgIHBpeGVsUmF0aW86IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiBmdW5jdGlvbih3aWR0aCwgbWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwW3dpZHRoXSB8fCB3aWR0aDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbG9zZXN0IHVwcGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiB2YXIgY2FuZGlkYXRlcyA9IFsxLCAxLjUsIDJdO1xuICAgICAqXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgwLjgsIGNhbmRpZGF0ZXMpOyAvLyAtPiAxXG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgxLCBjYW5kaWRhdGVzKTsgLy8gLT4gMVxuICAgICAqIEltYWdlci5nZXRDbG9zZXN0VmFsdWUoMS4zLCBjYW5kaWRhdGVzKTsgLy8gLT4gMS41XG4gICAgICogSW1hZ2VyLmdldENsb3Nlc3RWYWx1ZSgzLCBjYW5kaWRhdGVzKTsgLy8gLT4gMlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGFwaVxuICAgICAqIEBzaW5jZSAxLjAuMVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiYXNlVmFsdWVcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBjYW5kaWRhdGVzXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKi9cbiAgICBJbWFnZXIuZ2V0Q2xvc2VzdFZhbHVlID0gZnVuY3Rpb24gZ2V0Q2xvc2VzdFZhbHVlKGJhc2VWYWx1ZSwgY2FuZGlkYXRlcykge1xuICAgICAgICB2YXIgaSA9IGNhbmRpZGF0ZXMubGVuZ3RoLFxuICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaSAtIDFdO1xuXG4gICAgICAgIGJhc2VWYWx1ZSA9IHBhcnNlRmxvYXQoYmFzZVZhbHVlLCAxMCk7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGJhc2VWYWx1ZSA8PSBjYW5kaWRhdGVzW2ldKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRXaWR0aCA9IGNhbmRpZGF0ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRXaWR0aDtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLnByb3RvdHlwZS5yZWdpc3RlclJlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hlY2tJbWFnZXNOZWVkUmVwbGFjaW5nKHNlbGYuZGl2cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBJbWFnZXIucHJvdG90eXBlLnJlZ2lzdGVyU2Nyb2xsRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5zY3JvbGxDaGVjaygpO1xuICAgICAgICB9LCBzZWxmLnNjcm9sbERlbGF5KTtcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csICdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXRHZW5lcmF0b3IgPSBmdW5jdGlvbiBnZXRQYWdlVmVydGljYWxPZmZzZXQodGVzdENhc2UpIHtcbiAgICAgICAgaWYgKHRlc3RDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZm9ybSBpcyB1c2VkIGJlY2F1c2UgaXQgc2VlbXMgaW1wb3NzaWJsZSB0byBzdHViIGB3aW5kb3cucGFnZVlPZmZzZXRgXG4gICAgSW1hZ2VyLmdldFBhZ2VPZmZzZXQgPSBJbWFnZXIuZ2V0UGFnZU9mZnNldEdlbmVyYXRvcihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwod2luZG93LCAncGFnZVlPZmZzZXQnKSk7XG5cbiAgICAvLyBFeHBvcnRpbmcgZm9yIHRlc3RpbmcgcHVycG9zZVxuICAgIEltYWdlci5hcHBseUVhY2ggPSBhcHBseUVhY2g7XG5cbiAgICAvKiBnbG9iYWwgbW9kdWxlLCBleHBvcnRzOiB0cnVlLCBkZWZpbmUgKi9cbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KUywganVzdCBleHBvcnRcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gSW1hZ2VyO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRCBzdXBwb3J0XG4gICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBJbWFnZXI7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gSWYgbm8gQU1EIGFuZCB3ZSBhcmUgaW4gdGhlIGJyb3dzZXIsIGF0dGFjaCB0byB3aW5kb3dcbiAgICAgICAgd2luZG93LkltYWdlciA9IEltYWdlcjtcbiAgICB9XG4gICAgLyogZ2xvYmFsIC1tb2R1bGUsIC1leHBvcnRzLCAtZGVmaW5lICovXG5cbn0od2luZG93LCBkb2N1bWVudCkpOyIsIi8qKlxuICogaXNNb2JpbGUuanMgdjAuMy40XG4gKlxuICogQSBzaW1wbGUgbGlicmFyeSB0byBkZXRlY3QgQXBwbGUgcGhvbmVzIGFuZCB0YWJsZXRzLFxuICogQW5kcm9pZCBwaG9uZXMgYW5kIHRhYmxldHMsIG90aGVyIG1vYmlsZSBkZXZpY2VzIChsaWtlIGJsYWNrYmVycnksIG1pbmktb3BlcmEgYW5kIHdpbmRvd3MgcGhvbmUpLFxuICogYW5kIGFueSBraW5kIG9mIHNldmVuIGluY2ggZGV2aWNlLCB2aWEgdXNlciBhZ2VudCBzbmlmZmluZy5cbiAqXG4gKiBAYXV0aG9yOiBLYWkgTWFsbGVhIChrbWFsbGVhQGdtYWlsLmNvbSlcbiAqXG4gKiBAbGljZW5zZTogaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXG4gICAgdmFyIGFwcGxlX3Bob25lICAgICAgICAgPSAvaVBob25lL2ksXG4gICAgICAgIGFwcGxlX2lwb2QgICAgICAgICAgPSAvaVBvZC9pLFxuICAgICAgICBhcHBsZV90YWJsZXQgICAgICAgID0gL2lQYWQvaSxcbiAgICAgICAgYW5kcm9pZF9waG9uZSAgICAgICA9IC8oPz0uKlxcYkFuZHJvaWRcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdBbmRyb2lkJyBBTkQgJ01vYmlsZSdcbiAgICAgICAgYW5kcm9pZF90YWJsZXQgICAgICA9IC9BbmRyb2lkL2ksXG4gICAgICAgIHdpbmRvd3NfcGhvbmUgICAgICAgPSAvSUVNb2JpbGUvaSxcbiAgICAgICAgd2luZG93c190YWJsZXQgICAgICA9IC8oPz0uKlxcYldpbmRvd3NcXGIpKD89LipcXGJBUk1cXGIpL2ksIC8vIE1hdGNoICdXaW5kb3dzJyBBTkQgJ0FSTSdcbiAgICAgICAgb3RoZXJfYmxhY2tiZXJyeSAgICA9IC9CbGFja0JlcnJ5L2ksXG4gICAgICAgIG90aGVyX2JsYWNrYmVycnlfMTAgPSAvQkIxMC9pLFxuICAgICAgICBvdGhlcl9vcGVyYSAgICAgICAgID0gL09wZXJhIE1pbmkvaSxcbiAgICAgICAgb3RoZXJfZmlyZWZveCAgICAgICA9IC8oPz0uKlxcYkZpcmVmb3hcXGIpKD89LipcXGJNb2JpbGVcXGIpL2ksIC8vIE1hdGNoICdGaXJlZm94JyBBTkQgJ01vYmlsZSdcbiAgICAgICAgc2V2ZW5faW5jaCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnKD86JyArICAgICAgICAgLy8gTm9uLWNhcHR1cmluZyBncm91cFxuXG4gICAgICAgICAgICAnTmV4dXMgNycgKyAgICAgLy8gTmV4dXMgN1xuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ0JOVFYyNTAnICsgICAgIC8vIEImTiBOb29rIFRhYmxldCA3IGluY2hcblxuICAgICAgICAgICAgJ3wnICsgICAgICAgICAgIC8vIE9SXG5cbiAgICAgICAgICAgICdLaW5kbGUgRmlyZScgKyAvLyBLaW5kbGUgRmlyZVxuXG4gICAgICAgICAgICAnfCcgKyAgICAgICAgICAgLy8gT1JcblxuICAgICAgICAgICAgJ1NpbGsnICsgICAgICAgIC8vIEtpbmRsZSBGaXJlLCBTaWxrIEFjY2VsZXJhdGVkXG5cbiAgICAgICAgICAgICd8JyArICAgICAgICAgICAvLyBPUlxuXG4gICAgICAgICAgICAnR1QtUDEwMDAnICsgICAgLy8gR2FsYXh5IFRhYiA3IGluY2hcblxuICAgICAgICAgICAgJyknLCAgICAgICAgICAgIC8vIEVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgICAgICdpJyk7ICAgICAgICAgICAvLyBDYXNlLWluc2Vuc2l0aXZlIG1hdGNoaW5nXG5cbiAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbihyZWdleCwgdXNlckFnZW50KSB7XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHVzZXJBZ2VudCk7XG4gICAgfTtcblxuICAgIHZhciBJc01vYmlsZUNsYXNzID0gZnVuY3Rpb24odXNlckFnZW50KSB7XG4gICAgICAgIHZhciB1YSA9IHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgICAgIHRoaXMuYXBwbGUgPSB7XG4gICAgICAgICAgICBwaG9uZTogIG1hdGNoKGFwcGxlX3Bob25lLCB1YSksXG4gICAgICAgICAgICBpcG9kOiAgIG1hdGNoKGFwcGxlX2lwb2QsIHVhKSxcbiAgICAgICAgICAgIHRhYmxldDogbWF0Y2goYXBwbGVfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFwcGxlX3Bob25lLCB1YSkgfHwgbWF0Y2goYXBwbGVfaXBvZCwgdWEpIHx8IG1hdGNoKGFwcGxlX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5kcm9pZCA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiAhbWF0Y2goYW5kcm9pZF9waG9uZSwgdWEpICYmIG1hdGNoKGFuZHJvaWRfdGFibGV0LCB1YSksXG4gICAgICAgICAgICBkZXZpY2U6IG1hdGNoKGFuZHJvaWRfcGhvbmUsIHVhKSB8fCBtYXRjaChhbmRyb2lkX3RhYmxldCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2luZG93cyA9IHtcbiAgICAgICAgICAgIHBob25lOiAgbWF0Y2god2luZG93c19waG9uZSwgdWEpLFxuICAgICAgICAgICAgdGFibGV0OiBtYXRjaCh3aW5kb3dzX3RhYmxldCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiBtYXRjaCh3aW5kb3dzX3Bob25lLCB1YSkgfHwgbWF0Y2god2luZG93c190YWJsZXQsIHVhKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm90aGVyID0ge1xuICAgICAgICAgICAgYmxhY2tiZXJyeTogICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSksXG4gICAgICAgICAgICBibGFja2JlcnJ5MTA6IG1hdGNoKG90aGVyX2JsYWNrYmVycnlfMTAsIHVhKSxcbiAgICAgICAgICAgIG9wZXJhOiAgICAgICAgbWF0Y2gob3RoZXJfb3BlcmEsIHVhKSxcbiAgICAgICAgICAgIGZpcmVmb3g6ICAgICAgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpLFxuICAgICAgICAgICAgZGV2aWNlOiAgICAgICBtYXRjaChvdGhlcl9ibGFja2JlcnJ5LCB1YSkgfHwgbWF0Y2gob3RoZXJfYmxhY2tiZXJyeV8xMCwgdWEpIHx8IG1hdGNoKG90aGVyX29wZXJhLCB1YSkgfHwgbWF0Y2gob3RoZXJfZmlyZWZveCwgdWEpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V2ZW5faW5jaCA9IG1hdGNoKHNldmVuX2luY2gsIHVhKTtcbiAgICAgICAgdGhpcy5hbnkgPSB0aGlzLmFwcGxlLmRldmljZSB8fCB0aGlzLmFuZHJvaWQuZGV2aWNlIHx8IHRoaXMud2luZG93cy5kZXZpY2UgfHwgdGhpcy5vdGhlci5kZXZpY2UgfHwgdGhpcy5zZXZlbl9pbmNoO1xuICAgICAgICAvLyBleGNsdWRlcyAnb3RoZXInIGRldmljZXMgYW5kIGlwb2RzLCB0YXJnZXRpbmcgdG91Y2hzY3JlZW4gcGhvbmVzXG4gICAgICAgIHRoaXMucGhvbmUgPSB0aGlzLmFwcGxlLnBob25lIHx8IHRoaXMuYW5kcm9pZC5waG9uZSB8fCB0aGlzLndpbmRvd3MucGhvbmU7XG4gICAgICAgIC8vIGV4Y2x1ZGVzIDcgaW5jaCBkZXZpY2VzLCBjbGFzc2lmeWluZyBhcyBwaG9uZSBvciB0YWJsZXQgaXMgbGVmdCB0byB0aGUgdXNlclxuICAgICAgICB0aGlzLnRhYmxldCA9IHRoaXMuYXBwbGUudGFibGV0IHx8IHRoaXMuYW5kcm9pZC50YWJsZXQgfHwgdGhpcy53aW5kb3dzLnRhYmxldDtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgSU0gPSBuZXcgSXNNb2JpbGVDbGFzcygpO1xuICAgICAgICBJTS5DbGFzcyA9IElzTW9iaWxlQ2xhc3M7XG4gICAgICAgIHJldHVybiBJTTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSXNNb2JpbGVDbGFzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy9icm93c2VyaWZ5XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gaW5zdGFudGlhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvL0FNRFxuICAgICAgICBkZWZpbmUoaW5zdGFudGlhdGUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLmlzTW9iaWxlID0gaW5zdGFudGlhdGUoKTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLypcclxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxyXG4qXHJcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0ge307XHJcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xyXG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgc2VsZlttZXRob2ROYW1lXS5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcclxuICAgICAgICBcInRyYWNlXCIsXHJcbiAgICAgICAgXCJkZWJ1Z1wiLFxyXG4gICAgICAgIFwiaW5mb1wiLFxyXG4gICAgICAgIFwid2FyblwiLFxyXG4gICAgICAgIFwiZXJyb3JcIlxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xyXG4gICAgICAgICAgICBzZWxmW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgPyBub29wIDogc2VsZi5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xyXG4gICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVsnbG9nbGV2ZWwnXSA9IGxldmVsTmFtZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9IFwibG9nbGV2ZWw9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcclxuICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFBlcnNpc3RlZExldmVsKCkge1xyXG4gICAgICAgIHZhciBzdG9yZWRMZXZlbDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlWydsb2dsZXZlbCddO1xyXG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvbG9nbGV2ZWw9KFteO10rKS8uZXhlYyh3aW5kb3cuZG9jdW1lbnQuY29va2llKVsxXTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSBcIldBUk5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICpcclxuICAgICAqIFB1YmxpYyBBUElcclxuICAgICAqXHJcbiAgICAgKi9cclxuXHJcbiAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcclxuICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xyXG5cclxuICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBsZXZlbCkge1xyXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XHJcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcclxuICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5UKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXHJcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XHJcbiAgICBzZWxmLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxyXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBzZWxmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRQZXJzaXN0ZWRMZXZlbCgpO1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbn0pKTtcclxuIiwiLyohXHJcbiAqIHZlcmdlIDEuOS4xKzIwMTQwMjEzMDgwM1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcnlhbnZlL3ZlcmdlXHJcbiAqIE1JVCBMaWNlbnNlIDIwMTMgUnlhbiBWYW4gRXR0ZW5cclxuICovXHJcblxyXG4oZnVuY3Rpb24ocm9vdCwgbmFtZSwgbWFrZSkge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSBtb2R1bGVbJ2V4cG9ydHMnXSA9IG1ha2UoKTtcclxuICBlbHNlIHJvb3RbbmFtZV0gPSBtYWtlKCk7XHJcbn0odGhpcywgJ3ZlcmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciB4cG9ydHMgPSB7fVxyXG4gICAgLCB3aW4gPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvd1xyXG4gICAgLCBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnRcclxuICAgICwgZG9jRWxlbSA9IGRvYyAmJiBkb2MuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAsIG1hdGNoTWVkaWEgPSB3aW5bJ21hdGNoTWVkaWEnXSB8fCB3aW5bJ21zTWF0Y2hNZWRpYSddXHJcbiAgICAsIG1xID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKHEpIHtcclxuICAgICAgICByZXR1cm4gISFtYXRjaE1lZGlhLmNhbGwod2luLCBxKS5tYXRjaGVzO1xyXG4gICAgICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAsIHZpZXdwb3J0VyA9IHhwb3J0c1sndmlld3BvcnRXJ10gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYSA9IGRvY0VsZW1bJ2NsaWVudFdpZHRoJ10sIGIgPSB3aW5bJ2lubmVyV2lkdGgnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfVxyXG4gICAgLCB2aWV3cG9ydEggPSB4cG9ydHNbJ3ZpZXdwb3J0SCddID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGEgPSBkb2NFbGVtWydjbGllbnRIZWlnaHQnXSwgYiA9IHdpblsnaW5uZXJIZWlnaHQnXTtcclxuICAgICAgICByZXR1cm4gYSA8IGIgPyBiIDogYTtcclxuICAgICAgfTtcclxuICBcclxuICAvKiogXHJcbiAgICogVGVzdCBpZiBhIG1lZGlhIHF1ZXJ5IGlzIGFjdGl2ZS4gTGlrZSBNb2Rlcm5penIubXFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqLyAgXHJcbiAgeHBvcnRzWydtcSddID0gbXE7XHJcblxyXG4gIC8qKiBcclxuICAgKiBOb3JtYWxpemVkIG1hdGNoTWVkaWFcclxuICAgKiBAc2luY2UgMS42LjBcclxuICAgKiBAcmV0dXJuIHtNZWRpYVF1ZXJ5TGlzdHxPYmplY3R9XHJcbiAgICovIFxyXG4gIHhwb3J0c1snbWF0Y2hNZWRpYSddID0gbWF0Y2hNZWRpYSA/IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gbWF0Y2hNZWRpYSBtdXN0IGJlIGJpbmRlZCB0byB3aW5kb3dcclxuICAgIHJldHVybiBtYXRjaE1lZGlhLmFwcGx5KHdpbiwgYXJndW1lbnRzKTtcclxuICB9IDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBHcmFjZWZ1bGx5IGRlZ3JhZGUgdG8gcGxhaW4gb2JqZWN0XHJcbiAgICByZXR1cm4ge307XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHNpbmNlIDEuOC4wXHJcbiAgICogQHJldHVybiB7e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn19XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdmlld3BvcnQoKSB7XHJcbiAgICByZXR1cm4geyd3aWR0aCc6dmlld3BvcnRXKCksICdoZWlnaHQnOnZpZXdwb3J0SCgpfTtcclxuICB9XHJcbiAgeHBvcnRzWyd2aWV3cG9ydCddID0gdmlld3BvcnQ7XHJcbiAgXHJcbiAgLyoqIFxyXG4gICAqIENyb3NzLWJyb3dzZXIgd2luZG93LnNjcm9sbFhcclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgeHBvcnRzWydzY3JvbGxYJ10gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW4ucGFnZVhPZmZzZXQgfHwgZG9jRWxlbS5zY3JvbGxMZWZ0OyBcclxuICB9O1xyXG5cclxuICAvKiogXHJcbiAgICogQ3Jvc3MtYnJvd3NlciB3aW5kb3cuc2Nyb2xsWVxyXG4gICAqIEBzaW5jZSAxLjAuMFxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cclxuICB4cG9ydHNbJ3Njcm9sbFknXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbi5wYWdlWU9mZnNldCB8fCBkb2NFbGVtLnNjcm9sbFRvcDsgXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHt7dG9wOm51bWJlciwgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyLCBsZWZ0Om51bWJlcn19IGNvb3Jkc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvbiBhZGp1c3RtZW50XHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZShjb29yZHMsIGN1c2hpb24pIHtcclxuICAgIHZhciBvID0ge307XHJcbiAgICBjdXNoaW9uID0gK2N1c2hpb24gfHwgMDtcclxuICAgIG9bJ3dpZHRoJ10gPSAob1sncmlnaHQnXSA9IGNvb3Jkc1sncmlnaHQnXSArIGN1c2hpb24pIC0gKG9bJ2xlZnQnXSA9IGNvb3Jkc1snbGVmdCddIC0gY3VzaGlvbik7XHJcbiAgICBvWydoZWlnaHQnXSA9IChvWydib3R0b20nXSA9IGNvb3Jkc1snYm90dG9tJ10gKyBjdXNoaW9uKSAtIChvWyd0b3AnXSA9IGNvb3Jkc1sndG9wJ10gLSBjdXNoaW9uKTtcclxuICAgIHJldHVybiBvO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3Jvc3MtYnJvd3NlciBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCBwbHVzIG9wdGlvbmFsIGN1c2hpb24uXHJcbiAgICogQ29vcmRzIGFyZSByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbCBlbGVtZW50IG9yIHN0YWNrICh1c2VzIGZpcnN0IGl0ZW0pXHJcbiAgICogQHBhcmFtIHtudW1iZXI9fSBjdXNoaW9uICsvLSBwaXhlbCBhZGp1c3RtZW50IGFtb3VudFxyXG4gICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlY3RhbmdsZShlbCwgY3VzaGlvbikge1xyXG4gICAgZWwgPSBlbCAmJiAhZWwubm9kZVR5cGUgPyBlbFswXSA6IGVsO1xyXG4gICAgaWYgKCFlbCB8fCAxICE9PSBlbC5ub2RlVHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGNhbGlicmF0ZShlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgY3VzaGlvbik7XHJcbiAgfVxyXG4gIHhwb3J0c1sncmVjdGFuZ2xlJ10gPSByZWN0YW5nbGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgdmlld3BvcnQgYXNwZWN0IHJhdGlvIChvciB0aGUgYXNwZWN0IHJhdGlvIG9mIGFuIG9iamVjdCBvciBlbGVtZW50KVxyXG4gICAqIEBzaW5jZSAxLjcuMFxyXG4gICAqIEBwYXJhbSB7KEVsZW1lbnR8T2JqZWN0KT19IG8gb3B0aW9uYWwgb2JqZWN0IHdpdGggd2lkdGgvaGVpZ2h0IHByb3BzIG9yIG1ldGhvZHNcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICogQGxpbmsgaHR0cDovL3czLm9yZy9UUi9jc3MzLW1lZGlhcXVlcmllcy8jb3JpZW50YXRpb25cclxuICAgKi9cclxuICBmdW5jdGlvbiBhc3BlY3Qobykge1xyXG4gICAgbyA9IG51bGwgPT0gbyA/IHZpZXdwb3J0KCkgOiAxID09PSBvLm5vZGVUeXBlID8gcmVjdGFuZ2xlKG8pIDogbztcclxuICAgIHZhciBoID0gb1snaGVpZ2h0J10sIHcgPSBvWyd3aWR0aCddO1xyXG4gICAgaCA9IHR5cGVvZiBoID09ICdmdW5jdGlvbicgPyBoLmNhbGwobykgOiBoO1xyXG4gICAgdyA9IHR5cGVvZiB3ID09ICdmdW5jdGlvbicgPyB3LmNhbGwobykgOiB3O1xyXG4gICAgcmV0dXJuIHcvaDtcclxuICB9XHJcbiAgeHBvcnRzWydhc3BlY3QnXSA9IGFzcGVjdDtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHgtYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblgnXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIucmlnaHQgPj0gMCAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSBzYW1lIHktYXhpcyBzZWN0aW9uIGFzIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblknXSA9IGZ1bmN0aW9uKGVsLCBjdXNoaW9uKSB7XHJcbiAgICB2YXIgciA9IHJlY3RhbmdsZShlbCwgY3VzaGlvbik7XHJcbiAgICByZXR1cm4gISFyICYmIHIuYm90dG9tID49IDAgJiYgci50b3AgPD0gdmlld3BvcnRIKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGVzdCBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aWV3cG9ydC5cclxuICAgKiBAc2luY2UgMS4wLjBcclxuICAgKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyPX0gY3VzaGlvblxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgeHBvcnRzWydpblZpZXdwb3J0J10gPSBmdW5jdGlvbihlbCwgY3VzaGlvbikge1xyXG4gICAgLy8gRXF1aXYgdG8gYGluWChlbCwgY3VzaGlvbikgJiYgaW5ZKGVsLCBjdXNoaW9uKWAgYnV0IGp1c3QgbWFudWFsbHkgZG8gYm90aCBcclxuICAgIC8vIHRvIGF2b2lkIGNhbGxpbmcgcmVjdGFuZ2xlKCkgdHdpY2UuIEl0IGd6aXBzIGp1c3QgYXMgc21hbGwgbGlrZSB0aGlzLlxyXG4gICAgdmFyIHIgPSByZWN0YW5nbGUoZWwsIGN1c2hpb24pO1xyXG4gICAgcmV0dXJuICEhciAmJiByLmJvdHRvbSA+PSAwICYmIHIucmlnaHQgPj0gMCAmJiByLnRvcCA8PSB2aWV3cG9ydEgoKSAmJiByLmxlZnQgPD0gdmlld3BvcnRXKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHhwb3J0cztcclxufSkpOyIsIi8qIVxuICogRXZlbnRFbWl0dGVyIHY0LjIuOSAtIGdpdC5pby9lZVxuICogT2xpdmVyIENhbGR3ZWxsXG4gKiBNSVQgbGljZW5zZVxuICogQHByZXNlcnZlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgbWFuYWdpbmcgZXZlbnRzLlxuICAgICAqIENhbiBiZSBleHRlbmRlZCB0byBwcm92aWRlIGV2ZW50IGZ1bmN0aW9uYWxpdHkgaW4gb3RoZXIgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBjbGFzcyBFdmVudEVtaXR0ZXIgTWFuYWdlcyBldmVudCByZWdpc3RlcmluZyBhbmQgZW1pdHRpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cblxuICAgIC8vIFNob3J0Y3V0cyB0byBpbXByb3ZlIHNwZWVkIGFuZCBzaXplXG4gICAgdmFyIHByb3RvID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcbiAgICB2YXIgZXhwb3J0cyA9IHRoaXM7XG4gICAgdmFyIG9yaWdpbmFsR2xvYmFsVmFsdWUgPSBleHBvcnRzLkV2ZW50RW1pdHRlcjtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdHMgc3RvcmFnZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gbG9vayBmb3IuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLCAtMSBpZiBub3QgZm91bmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgYSBtZXRob2Qgd2hpbGUga2VlcGluZyB0aGUgY29udGV4dCBjb3JyZWN0LCB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGlhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbGlhc0Nsb3N1cmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdpbGwgaW5pdGlhbGlzZSB0aGUgZXZlbnQgb2JqZWN0IGFuZCBsaXN0ZW5lciBhcnJheXMgaWYgcmVxdWlyZWQuXG4gICAgICogV2lsbCByZXR1cm4gYW4gb2JqZWN0IGlmIHlvdSB1c2UgYSByZWdleCBzZWFyY2guIFRoZSBvYmplY3QgY29udGFpbnMga2V5cyBmb3IgZWFjaCBtYXRjaGVkIGV2ZW50LiBTbyAvYmFbcnpdLyBtaWdodCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYmFyIGFuZCBiYXouIEJ1dCBvbmx5IGlmIHlvdSBoYXZlIGVpdGhlciBkZWZpbmVkIHRoZW0gd2l0aCBkZWZpbmVFdmVudCBvciBhZGRlZCBzb21lIGxpc3RlbmVycyB0byB0aGVtLlxuICAgICAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBjb25jYXRlbmF0ZWQgYXJyYXkgb2YgYWxsIG1hdGNoaW5nIGV2ZW50cyBpZlxuICAgICAgICAvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtrZXldID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgbGlzdCBvZiBsaXN0ZW5lciBvYmplY3RzIGFuZCBmbGF0dGVucyBpdCBpbnRvIGEgbGlzdCBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXX0gSnVzdCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZmxhdExpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF0TGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSByZXF1ZXN0ZWQgbGlzdGVuZXJzIHZpYSBnZXRMaXN0ZW5lcnMgYnV0IHdpbGwgYWx3YXlzIHJldHVybiB0aGUgcmVzdWx0cyBpbnNpZGUgYW4gb2JqZWN0LiBUaGlzIGlzIG1haW5seSBmb3IgaW50ZXJuYWwgdXNlIGJ1dCBvdGhlcnMgbWF5IGZpbmQgaXQgdXNlZnVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IGluIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgZnVuY3Rpb24gdG8gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBUaGUgbGlzdGVuZXIgd2lsbCBub3QgYmUgYWRkZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUuXG4gICAgICogSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBpdCBpcyBjYWxsZWQuXG4gICAgICogSWYgeW91IHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUgdGhlbiB0aGUgbGlzdGVuZXIgd2lsbCBiZSBhZGRlZCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXJJc1dyYXBwZWQgPSB0eXBlb2YgbGlzdGVuZXIgPT09ICdvYmplY3QnO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXJJc1dyYXBwZWQgPyBsaXN0ZW5lciA6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBvbmNlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZExpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIFNlbWktYWxpYXMgb2YgYWRkTGlzdGVuZXIuIEl0IHdpbGwgYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlXG4gICAgICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0cyBmaXJzdCBleGVjdXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZE9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZE9uY2VMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgb25jZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkT25jZUxpc3RlbmVyLlxuICAgICAqL1xuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnYWRkT25jZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuICAgICAqIFlvdSBuZWVkIHRvIHRlbGwgaXQgd2hhdCBldmVudCBuYW1lcyBzaG91bGQgYmUgbWF0Y2hlZCBieSBhIHJlZ2V4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcbiAgICAgICAgdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXMgZGVmaW5lRXZlbnQgdG8gZGVmaW5lIG11bHRpcGxlIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFdmVudChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaGVuIHBhc3NlZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSwgaXQgd2lsbCByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byByZW1vdmUgZnJvbSB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqIFllYWgsIHRoaXMgZnVuY3Rpb24gZG9lcyBxdWl0ZSBhIGJpdC4gVGhhdCdzIHByb2JhYmx5IGEgYmFkIHRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gYWRkTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoZmFsc2UsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSByZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG4gICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgZGV0ZXJtaW5lIGlmIHRoZSBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgKHRydWUpIG9yIGFkZGVkIChmYWxzZSkuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYW5pcHVsYXRlIHRoZSBsaXN0ZW5lcnMgb2YgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQvcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLm1hbmlwdWxhdGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiBtYW5pcHVsYXRlTGlzdGVuZXJzKHJlbW92ZSwgZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIHNpbmdsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXIgOiB0aGlzLmFkZExpc3RlbmVyO1xuICAgICAgICB2YXIgbXVsdGlwbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVycyA6IHRoaXMuYWRkTGlzdGVuZXJzO1xuXG4gICAgICAgIC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXRzIHByb3BlcnRpZXMgdG8gdGhpcyBtZXRob2RcbiAgICAgICAgaWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICAgICAgZm9yIChpIGluIGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkgJiYgKHZhbHVlID0gZXZ0W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvIGV2dCBtdXN0IGJlIGEgc3RyaW5nXG4gICAgICAgICAgICAvLyBBbmQgbGlzdGVuZXJzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyBMb29wIG92ZXIgaXQgYW5kIHBhc3MgZWFjaCBvbmUgdG8gdGhlIG11bHRpcGxlIG1ldGhvZFxuICAgICAgICAgICAgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgZXZ0LCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhbiBldmVudCB0aGVuIGFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIFRoYXQgbWVhbnMgZXZlcnkgZXZlbnQgd2lsbCBiZSBlbXB0aWVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gW2V2dF0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLiBXaWxsIHJlbW92ZSBmcm9tIGV2ZXJ5IGV2ZW50IGlmIG5vdCBwYXNzZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVFdmVudChldnQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZXZ0O1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRpZmZlcmVudCB0aGluZ3MgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiBldnRcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1tldnRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIGFsbCBldmVudHNcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG4gICAgICpcbiAgICAgKiBBZGRlZCB0byBtaXJyb3IgdGhlIG5vZGUgQVBJLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IGFsaWFzKCdyZW1vdmVFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG4gICAgICogV2hlbiBlbWl0dGVkLCBldmVyeSBsaXN0ZW5lciBhdHRhY2hlZCB0byB0aGF0IGV2ZW50IHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICogSWYgeW91IHBhc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGFycmF5IHRoZW4gdGhvc2UgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRvIGV2ZXJ5IGxpc3RlbmVyIHVwb24gZXhlY3V0aW9uLlxuICAgICAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cbiAgICAgKiBTbyB0aGV5IHdpbGwgbm90IGFycml2ZSB3aXRoaW4gdGhlIGFycmF5IG9uIHRoZSBvdGhlciBzaWRlLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGUuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdIE9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZ0LCBhcmdzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnNba2V5XS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCBzaGFsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBlaXRoZXIgd2l0aCBhIGJhc2ljIGNhbGwgb3IgYW4gYXBwbHkgaWYgdGhlcmUgaXMgYW4gYXJncyBhcnJheVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1trZXldW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBsaXN0ZW5lci5saXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzIHx8IFtdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IHRoaXMuX2dldE9uY2VSZXR1cm5WYWx1ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIubGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGVtaXRFdmVudFxuICAgICAqL1xuICAgIHByb3RvLnRyaWdnZXIgPSBhbGlhcygnZW1pdEV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0bHkgZGlmZmVyZW50IGZyb20gZW1pdEV2ZW50IGluIHRoYXQgaXQgd2lsbCBwYXNzIGl0cyBhcmd1bWVudHMgb24gdG8gdGhlIGxpc3RlbmVycywgYXMgb3Bwb3NlZCB0byB0YWtpbmcgYSBzaW5nbGUgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHBhc3Mgb24uXG4gICAgICogQXMgd2l0aCBlbWl0RXZlbnQsIHlvdSBjYW4gcGFzcyBhIHJlZ2V4IGluIHBsYWNlIG9mIHRoZSBldmVudCBuYW1lIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gT3B0aW9uYWwgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZ0KSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdEV2ZW50KGV2dCwgYXJncyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmIGFcbiAgICAgKiBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhlIG9uZSBzZXQgaGVyZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIGFmdGVyIGV4ZWN1dGlvbi4gVGhpcyB2YWx1ZSBkZWZhdWx0cyB0byB0cnVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIHRvIGNoZWNrIGZvciB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uc2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gc2V0T25jZVJldHVyblZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29uY2VSZXR1cm5WYWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWZcbiAgICAgKiB0aGUgbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoaXMgb25lIHRoZW4gaXQgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICAgKiBhdXRvbWF0aWNhbGx5LiBJdCB3aWxsIHJldHVybiB0cnVlIGJ5IGRlZmF1bHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHsqfEJvb2xlYW59IFRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGZvciBvciB0aGUgZGVmYXVsdCwgdHJ1ZS5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0T25jZVJldHVyblZhbHVlID0gZnVuY3Rpb24gX2dldE9uY2VSZXR1cm5WYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ19vbmNlUmV0dXJuVmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uY2VSZXR1cm5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGV2ZW50cyBvYmplY3QgYW5kIGNyZWF0ZXMgb25lIGlmIHJlcXVpcmVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXZlbnRzIHN0b3JhZ2Ugb2JqZWN0LlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRFdmVudHMgPSBmdW5jdGlvbiBfZ2V0RXZlbnRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldmVydHMgdGhlIGdsb2JhbCB7QGxpbmsgRXZlbnRFbWl0dGVyfSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhpcyB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IE5vbiBjb25mbGljdGluZyBFdmVudEVtaXR0ZXIgY2xhc3MuXG4gICAgICovXG4gICAgRXZlbnRFbWl0dGVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IG9yaWdpbmFsR2xvYmFsVmFsdWU7XG4gICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgfTtcblxuICAgIC8vIEV4cG9zZSB0aGUgY2xhc3MgZWl0aGVyIHZpYSBBTUQsIENvbW1vbkpTIG9yIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG59LmNhbGwodGhpcykpO1xuIiwiIyMjKlxuICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBsYXllciBpcyB0byBkZWNsYXJlIGFuZCBhYnN0cmFjdCB0aGUgYWNjZXNzIHRvXG4gKiB0aGUgY29yZSBiYXNlIG9mIGxpYnJhcmllcyB0aGF0IHRoZSByZXN0IG9mIHRoZSBzdGFjayAodGhlIGFwcCBmcmFtZXdvcmspXG4gKiB3aWxsIGRlcGVuZC5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBCYXNlKSAtPlxuXG4gICAgIyBBcnJheSB0aGF0IGhvbGRzIGhhcmQgZGVwZW5kZW5jaWVzIGZvciB0aGUgU0RLXG4gICAgZGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwialF1ZXJ5XCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjEwXCIgIyByZXF1aXJlZCB2ZXJzaW9uXG4gICAgICAgICAgICBcIm9ialwiOiByb290LiQgIyBnbG9iYWwgb2JqZWN0XG4gICAgICAgICAgICBcInZlcnNpb25cIjogaWYgcm9vdC4kIHRoZW4gcm9vdC4kLmZuLmpxdWVyeSBlbHNlIDAgIyBnaXZlcyB0aGUgdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBvZiB0aGUgbG9hZGVkIGxpYlxuICAgICAgICAsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJVbmRlcnNjb3JlXCJcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogXCIxLjcuMFwiICMgcmVxdWlyZWQgdmVyc2lvblxuICAgICAgICAgICAgXCJvYmpcIjogcm9vdC5fICMgZ2xvYmFsIG9iamVjdFxuICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IGlmIHJvb3QuXyB0aGVuIHJvb3QuXy5WRVJTSU9OIGVsc2UgMFxuICAgIF1cblxuICAgICMgVmVyc2lvbiBjaGVja2VyIHV0aWxcbiAgICBWZXJzaW9uQ2hlY2tlciA9IHJlcXVpcmUgJy4vdXRpbC92ZXJzaW9uY2hlY2tlci5jb2ZmZWUnXG5cbiAgICAjIEluIGNhc2UgYW55IG9mIG91ciBkZXBlbmRlbmNpZXMgd2VyZSBub3QgbG9hZGVkLCBvciBpdHMgdmVyc2lvbiBkb2VzdCBub3QgY29ycmVzcG9uZCB0byBvdXJzXG4gICAgIyBuZWVkcywgdGhlIHZlcnNpb25DaGVja2VyIHdpbGwgdGhvcncgYW4gZXJyb3IgZXhwbGFpbmluZyB3aHlcbiAgICBWZXJzaW9uQ2hlY2tlci5jaGVjayhkZXBlbmRlbmNpZXMpXG5cbiAgICAjIExvZ2dlclxuICAgIEJhc2UubG9nID0gcmVxdWlyZSAnLi91dGlsL2xvZ2dlci5jb2ZmZWUnXG5cbiAgICAjIERldmljZSBkZXRlY3Rpb25cbiAgICBCYXNlLmRldmljZSA9IHJlcXVpcmUgJy4vdXRpbC9kZXZpY2VkZXRlY3Rpb24uY29mZmVlJ1xuXG4gICAgIyBDb29raWVzIEFQSVxuICAgIEJhc2UuY29va2llcyA9IHJlcXVpcmUgJy4vdXRpbC9jb29raWVzLmNvZmZlZSdcblxuICAgICMgVmlld3BvcnQgZGV0ZWN0aW9uXG4gICAgQmFzZS52cCA9IHJlcXVpcmUgJy4vdXRpbC92aWV3cG9ydGRldGVjdGlvbi5jb2ZmZWUnXG5cbiAgICAjIEZ1bmN0aW9uIHRoYXQgaXMgZ29ubmEgaGFuZGxlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgQmFzZS5JbWFnZXIgPSByZXF1aXJlICdpbWFnZXIuanMnXG5cbiAgICAjIEV2ZW50IEJ1c1xuICAgIEJhc2UuRXZlbnRzID0gcmVxdWlyZSAnLi91dGlsL2V2ZW50YnVzLmNvZmZlZSdcblxuICAgICMgR2VuZXJhbCBVdGlsc1xuICAgIFV0aWxzID0gcmVxdWlyZSAnLi91dGlsL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBVdGlsc1xuICAgIEJhc2UudXRpbCA9IHJvb3QuXy5leHRlbmQgVXRpbHMsIHJvb3QuX1xuXG4gICAgcmV0dXJuIEJhc2VcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgRXh0KSAtPlxuXG4gICAgQmFzZSAgID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG4gICAgTW9kdWxlID0gcmVxdWlyZSgnLi8uLi91dGlsL21vZHVsZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgQ29tcG9uZW50XG5cbiAgICAgICAgIyBvYmplY3QgdG8gc3RvcmUgaW5pdGlhbGl6ZWQgY29tcG9uZW50c1xuICAgICAgICBAaW5pdGlhbGl6ZWRDb21wb25lbnRzIDoge31cblxuICAgICAgICAjIyMqXG4gICAgICAgICAqIFtzdGFydEFsbCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFuY2lzY28ucmFtaW5pIGF0IGdsb2JhbnQuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9yID0gJ2JvZHknLiBDU1Mgc2VsZWN0b3IgdG8gdGVsbCB0aGUgYXBwIHdoZXJlIHRvIGxvb2sgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgQHN0YXJ0QWxsOiAoc2VsZWN0b3IgPSAnYm9keScsIGFwcCwgbmFtZXNwYWNlID0gTkdTLm1vZHVsZXMpIC0+XG5cbiAgICAgICAgICAgIGNvbXBvbmVudHMgPSBDb21wb25lbnQucGFyc2VMaXN0KHNlbGVjdG9yLCBhcHAuY29uZmlnLm5hbWVzcGFjZSlcblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIlBhcnNlZCBjb21wb25lbnRzXCJcbiAgICAgICAgICAgIEJhc2UubG9nLmRlYnVnIEJhc2UudXRpbC5jbG9uZSBjb21wb25lbnRzXG5cbiAgICAgICAgICAgICMgYWRkZWQgdG8ga2VlcCBuYW1lc3BhY2UuTkFNRSA9IERFRklOSVRJT04gc2ludGF4LiBUaGlzIHdpbGwgZXh0ZW5kXG4gICAgICAgICAgICAjIHRoZSBvYmplY3QgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICMgdGhpcyBtaWdodCBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZSwgKGRlZmluaXRpb24sIG5hbWUpIC0+XG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzT2JqZWN0IGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAgICAgTW9kdWxlLmV4dGVuZCBuYW1lLCBkZWZpbml0aW9uXG5cbiAgICAgICAgICAgICMgZ3JhYiBhIHJlZmVyZW5jZSBvZiBhbGwgdGhlIG1vZHVsZSBkZWZpbmVkIHVzaW5nIHRoZSBNb2R1bGUuYWRkXG4gICAgICAgICAgICAjIG1ldGhvZC5cbiAgICAgICAgICAgIEJhc2UudXRpbC5leHRlbmQgbmFtZXNwYWNlLCBOR1MuTW9kdWxlLmxpc3RcblxuICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5pbml0aWFsaXplZENvbXBvbmVudHNcblxuICAgICAgICBAcGFyc2VMaXN0OiAoc2VsZWN0b3IsIG5hbWVzcGFjZSkgLT5cbiAgICAgICAgICAgICMgYXJyYXkgdG8gaG9sZCBwYXJzZWQgY29tcG9uZW50c1xuICAgICAgICAgICAgbGlzdCA9IFtdXG5cbiAgICAgICAgICAgIG5hbWVzcGFjZXMgPSBbJ3BsYXRmb3JtJ11cblxuICAgICAgICAgICAgIyBUT0RPOiBBZGQgdGhlIGFiaWxpdHkgdG8gcGFzcyBhbiBhcnJheS9vYmplY3Qgb2YgbmFtZXNwYWNlcyBpbnN0ZWFkIG9mIGp1c3Qgb25lXG4gICAgICAgICAgICBuYW1lc3BhY2VzLnB1c2ggbmFtZXNwYWNlIGlmIG5hbWVzcGFjZSBpc250ICdwbGF0Zm9ybSdcblxuICAgICAgICAgICAgY3NzU2VsZWN0b3JzID0gW11cblxuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggbmFtZXNwYWNlcywgKG5zLCBpKSAtPlxuICAgICAgICAgICAgICAgICMgaWYgYSBuZXcgbmFtZXNwYWNlIGhhcyBiZWVuIHByb3ZpZGVkIGxldHMgYWRkIGl0IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgY3NzU2VsZWN0b3JzLnB1c2ggXCJbZGF0YS1cIiArIG5zICsgXCItY29tcG9uZW50XVwiXG5cbiAgICAgICAgICAgICMgVE9ETzogQWNjZXNzIHRoZXNlIERPTSBmdW5jdGlvbmFsaXR5IHRocm91Z2ggQmFzZVxuICAgICAgICAgICAgJChzZWxlY3RvcikuZmluZChjc3NTZWxlY3RvcnMuam9pbignLCcpKS5lYWNoIChpLCBjb21wKSAtPlxuXG4gICAgICAgICAgICAgICAgbnMgPSBkbyAoKSAtPlxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgIEJhc2UudXRpbC5lYWNoIG5hbWVzcGFjZXMsIChucywgaSkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgVGhpcyB3YXkgd2Ugb2J0YWluIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAkKGNvbXApLmRhdGEobnMgKyBcIi1jb21wb25lbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuc1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lc3BhY2VcblxuICAgICAgICAgICAgICAgICMgb3B0aW9ucyB3aWxsIGhvbGQgYWxsIHRoZSBkYXRhLSogcmVsYXRlZCB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IENvbXBvbmVudC5wYXJzZUNvbXBvbmVudE9wdGlvbnMoQCwgbnMpXG5cbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goeyBuYW1lOiBvcHRpb25zLm5hbWUsIG9wdGlvbnM6IG9wdGlvbnMgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RcblxuICAgICAgICBAcGFyc2VDb21wb25lbnRPcHRpb25zOiAoZWwsIG5hbWVzcGFjZSwgb3B0cykgLT5cbiAgICAgICAgICAgIG9wdGlvbnMgPSBCYXNlLnV0aWwuY2xvbmUob3B0cyB8fCB7fSlcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbFxuXG4gICAgICAgICAgICAjIFRPRE86IGFjY2VzcyB0aGlzIERPTSBmdW5jdGlvbiB0aHJvdWdoIEJhc2VcbiAgICAgICAgICAgIGRhdGEgPSAkKGVsKS5kYXRhKClcbiAgICAgICAgICAgIG5hbWUgPSAnJ1xuICAgICAgICAgICAgbGVuZ3RoID0gMFxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuZWFjaCBkYXRhLCAodiwgaykgLT5cblxuICAgICAgICAgICAgICAgICMgcmVtb3ZlcyB0aGUgbmFtZXNwYWNlXG4gICAgICAgICAgICAgICAgayA9IGsucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgbmFtZXNwYWNlKSwgXCJcIilcblxuICAgICAgICAgICAgICAgICMgZGVjYW1lbGl6ZSB0aGUgb3B0aW9uIG5hbWVcbiAgICAgICAgICAgICAgICBrID0gay5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGsuc2xpY2UoMSlcblxuICAgICAgICAgICAgICAgICMgaWYgdGhlIGtleSBpcyBkaWZmZXJlbnQgZnJvbSBcImNvbXBvbmVudFwiIGl0IG1lYW5zIGl0IGlzXG4gICAgICAgICAgICAgICAgIyBhbiBvcHRpb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiBrICE9IFwiY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trXSA9IHZcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoKytcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSB2XG5cbiAgICAgICAgICAgICMgYWRkIG9uZSBiZWNhdXNlIHdlJ3ZlIGFkZGVkICdlbCcgYXV0b21hdGljYWxseSBhcyBhbiBleHRyYSBvcHRpb25cbiAgICAgICAgICAgIG9wdGlvbnMubGVuZ3RoID0gbGVuZ3RoICsgMVxuXG4gICAgICAgICAgICAjIGJ1aWxkIGFkIHJldHVybiB0aGUgb3B0aW9uIG9iamVjdFxuICAgICAgICAgICAgQ29tcG9uZW50LmJ1aWxkT3B0aW9uc09iamVjdChuYW1lLCBvcHRpb25zKVxuXG5cbiAgICAgICAgQGJ1aWxkT3B0aW9uc09iamVjdDogKG5hbWUsIG9wdGlvbnMpIC0+XG5cbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IG5hbWVcblxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNcblxuICAgICAgICBAaW5zdGFudGlhdGU6IChjb21wb25lbnRzLCBhcHApIC0+XG5cbiAgICAgICAgICAgIGlmIGNvbXBvbmVudHMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgbSA9IGNvbXBvbmVudHMuc2hpZnQoKVxuXG4gICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgbW9kdWxlcyBhcmUgZGVmaW5lZCB1c2luZyB0aGUgbW9kdWxlcyBuYW1lc3BhY2VcbiAgICAgICAgICAgICAgICAjIFRPRE86IFByb3ZpZGUgYW4gYWx0ZXJuYXRlIHdheSB0byBkZWZpbmUgdGhlXG4gICAgICAgICAgICAgICAgIyBnbG9iYWwgb2JqZWN0IHRoYXQgaXMgZ29ubmEgaG9sZCB0aGUgbW9kdWxlIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiBub3QgQmFzZS51dGlsLmlzRW1wdHkoTkdTLm1vZHVsZXMpIGFuZCBOR1MubW9kdWxlc1ttLm5hbWVdIGFuZCBtLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgbW9kID0gTkdTLm1vZHVsZXNbbS5uYW1lXVxuXG4gICAgICAgICAgICAgICAgICAgICMgY3JlYXRlIGEgbmV3IHNhbmRib3ggZm9yIHRoaXMgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIHNiID0gYXBwLmNyZWF0ZVNhbmRib3gobS5uYW1lKVxuXG4gICAgICAgICAgICAgICAgICAgICMgZ2VuZXJhdGVzIGFuIHVuaXF1ZSBndWlkIGZvciB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG0ub3B0aW9ucy5ndWlkID0gQmFzZS51dGlsLnVuaXF1ZUlkKG0ubmFtZSArIFwiX1wiKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5qZWN0IHRoZSBzYW5kYm94IGFuZCB0aGUgb3B0aW9ucyBpbiB0aGUgbW9kdWxlIHByb3RvXG4gICAgICAgICAgICAgICAgICAgICMgQmFzZS51dGlsLmV4dGVuZCBtb2QsIHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIG1vZHggPSBuZXcgbW9kKHNhbmRib3ggOiBzYiwgb3B0aW9uczogbS5vcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgICAgICMgaW5pdCB0aGUgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgIG1vZHguaW5pdGlhbGl6ZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgIyBzdG9yZSBhIHJlZmVyZW5jZSBvZiB0aGUgZ2VuZXJhdGVkIGd1aWQgb24gdGhlIGVsXG4gICAgICAgICAgICAgICAgICAgICMgJChtb2Qub3B0aW9ucy5lbCkuZGF0YSAnX19ndWlkX18nLCBtLm9wdGlvbnMuZ3VpZFxuXG4gICAgICAgICAgICAgICAgICAgICMgc2F2ZXMgYSByZWZlcmVuY2Ugb2YgdGhlIGluaXRpYWxpemVkIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQuaW5pdGlhbGl6ZWRDb21wb25lbnRzWyBtLm9wdGlvbnMuZ3VpZCBdID0gbW9keFxuXG4gICAgICAgICAgICAgICAgQ29tcG9uZW50Lmluc3RhbnRpYXRlKGNvbXBvbmVudHMsIGFwcClcblxuXG4gICAgIyNcbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBpbml0IHRoZSBleHRlbnNpb25cbiAgICAjI1xuXG4gICAgIyBjb25zdHJ1Y3RvclxuICAgIGluaXRpYWxpemUgOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBDb21wb25lbnQgZXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBpbml0aWFsaXplZENvbXBvbmVudHMgPSB7fVxuXG4gICAgICAgIGFwcC5zYW5kYm94LnN0YXJ0Q29tcG9uZW50cyA9IChsaXN0LCBhcHApIC0+XG5cbiAgICAgICAgICAgIGluaXRpYWxpemVkQ29tcG9uZW50cyA9IENvbXBvbmVudC5zdGFydEFsbChsaXN0LCBhcHApXG5cbiAgICAgICAgYXBwLnNhbmRib3guZ2V0SW5pdGlhbGl6ZWRDb21wb25lbnRzID0gKCkgLT5cblxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkQ29tcG9uZW50c1xuXG5cbiAgICAjIHRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHRoZSBleHRlbnNpb25zIGhhdmUgYmVlbiBsb2FkZWRcbiAgICBhZnRlckFwcFN0YXJ0ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcIkNhbGxpbmcgc3RhcnRDb21wb25lbnRzIGZyb20gYWZ0ZXJBcHBTdGFydGVkXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5zdGFydENvbXBvbmVudHMobnVsbCwgYXBwKVxuXG4gICAgbmFtZTogJ0NvbXBvbmVudCBFeHRlbnNpb24nXG5cbiAgICAjIHRoaXMgcHJvcGVydHkgd2lsbCBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgIyB0byB2YWxpZGF0ZSB0aGUgQ29tcG9uZW50IGNsYXNzIGluIGlzb2xhdGlvblxuICAgIGNsYXNzZXMgOiBDb21wb25lbnRcblxuICAgICMgVGhlIGV4cG9zZWQga2V5IG5hbWUgdGhhdCBjb3VsZCBiZSB1c2VkIHRvIHBhc3Mgb3B0aW9uc1xuICAgICMgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAjIFRoaXMgaXMgZ29ubmEgYmUgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlIENvcmUgb2JqZWN0LlxuICAgICMgTm90ZTogQnkgY29udmVudGlvbiB3ZSdsbCB1c2UgdGhlIGZpbGVuYW1lXG4gICAgb3B0aW9uS2V5OiAnY29tcG9uZW50cydcbilcbiIsIiMjIypcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgYmUgdHJpZ2dlcmluZyBldmVudHMgb25jZSB0aGUgRGV2aWNlIGluIHdoaWNoIHRoZVxuICogdXNlciBpcyBuYXZpZ2F0aW5nIHRoZSBzaXRlIGlzIGRldGVjdGVkLiBJdHMgZnVjaW9uYWxpdHkgbW9zdGx5IGRlcGVuZHNcbiAqIG9uIHRoZSBjb25maWd1cmF0aW9ucyBzZXR0aW5ncyAocHJvdmlkZWQgYnkgZGVmYXVsdCwgYnV0IHRoZXkgY2FuIGJlIG92ZXJyaWRlbilcbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIEV4dCkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLy4uL2Jhc2UuY29mZmVlJylcblxuICAgIGNsYXNzIFJlc3BvbnNpdmVEZXNpZ25cblxuICAgICAgICBjZmcgOlxuICAgICAgICAgICAgIyBUaGlzIGxpbWl0IHdpbGwgYmUgdXNlZCB0byBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAjIHdoZW4gdGhlIHVzZXIgcmVzaXplIHRoZSB3aW5kb3dcbiAgICAgICAgICAgIHdhaXRMaW1pdDogMzAwXG5cbiAgICAgICAgICAgICMgZGVmaW5lcyBpZiB3ZSBoYXZlIHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93IG9ialxuICAgICAgICAgICAgd2luZG93UmVzaXplRXZlbnQ6IHRydWVcblxuICAgICAgICAgICAgIyBEZWZhdWx0IGJyZWFrcG9pbnRzXG4gICAgICAgICAgICBicmVha3BvaW50cyA6IFtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJtb2JpbGVcIlxuICAgICAgICAgICAgICAgICAgICAjIHVudGlsIHRoaXMgcG9pbnQgd2lsbCBiZWhhdmVzIGFzIG1vYmlsZVxuICAgICAgICAgICAgICAgICAgICBicG1pbjogMFxuICAgICAgICAgICAgICAgICAgICBicG1heDogNzY3XG4gICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInRhYmxldFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA3NjhcbiAgICAgICAgICAgICAgICAgICAgYnBtYXg6IDk1OVxuICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICAgICAgICAgIyBieSBkZWZhdWx0IGFueXRoaW5nIGdyZWF0ZXIgdGhhbiB0YWJsZXQgaXMgYSBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZGVza3RvcFwiXG4gICAgICAgICAgICAgICAgICAgIGJwbWluOiA5NjBcbiAgICAgICAgICAgIF1cblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXRlY3REZXZpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9jaGVja1ZpZXdwb3J0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfYXR0YWNoV2luZG93SGFuZGxlcnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ2V0RGV2aWNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl9yZXNpemVIYW5kbGVyXCJcblxuICAgICAgICAgICAgQGNvbmZpZyA9IEJhc2UudXRpbC5leHRlbmQge30sIEBjZmcsIGNvbmZpZ1xuXG4gICAgICAgICAgICBAX2luaXQoKVxuXG4gICAgICAgIF9pbml0OiAoKSAtPlxuXG4gICAgICAgICAgICBAX2F0dGFjaFdpbmRvd0hhbmRsZXJzKCkgaWYgQGNvbmZpZy53aW5kb3dSZXNpemVFdmVudFxuXG4gICAgICAgICAgICBAZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBfYXR0YWNoV2luZG93SGFuZGxlcnM6ICgpIC0+XG5cbiAgICAgICAgICAgIGxhenlSZXNpemUgPSBCYXNlLnV0aWwuZGVib3VuY2UgQF9yZXNpemVIYW5kbGVyLCBAY29uZmlnLndhaXRMaW1pdFxuXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGxhenlSZXNpemUpXG5cbiAgICAgICAgX3Jlc2l6ZUhhbmRsZXI6ICgpIC0+XG4gICAgICAgICAgICAjIHRyaWdnZXJzIGEgd2luZG93c3Jlc2l6ZSBldmVudCBzbyB0aGlzIHdheSB3ZSBoYXZlIGEgY2VudHJhbGl6ZWRcbiAgICAgICAgICAgICMgd2F5IHRvIGxpc3RlbiBmb3IgdGhlIHJlc2l6ZSBldmVudCBvbiB0aGUgd2luZG93cyBhbmQgdGhlIGNvbXBvbmVuc1xuICAgICAgICAgICAgIyBjYW4gbGlzdGVuIGRpcmVjdGx5IHRvIHRoaXMgZXZlbnQgaW5zdGVhZCBvZiBkZWZpbmluZyBhIG5ldyBsaXN0ZW5lclxuICAgICAgICAgICAgTkdTLmVtaXQgXCJyd2Q6d2luZG93cmVzaXplXCJcblxuICAgICAgICAgICAgQGRldGVjdERldmljZSgpXG5cbiAgICAgICAgZGV0ZWN0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICBicCA9IEBjb25maWcuYnJlYWtwb2ludHNcblxuICAgICAgICAgICAgdnAgPSBCYXNlLnZwLnZpZXdwb3J0VygpXG5cbiAgICAgICAgICAgICMgZ2V0IGEgcmVmZXJlbmNlIChpZiBhbnkpIHRvIHRoZSBjb3JyZXNwb25kaW5nIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICMgZGVmaW5lZCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgdnBkID0gQF9jaGVja1ZpZXdwb3J0KHZwLCBicClcblxuICAgICAgICAgICAgaWYgbm90IEJhc2UudXRpbC5pc0VtcHR5IHZwZFxuXG4gICAgICAgICAgICAgICAgY2FwaXRhbGl6ZWRCUE5hbWUgPSBCYXNlLnV0aWwuc3RyaW5nLmNhcGl0YWxpemUodnBkLm5hbWUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIyBsZXQncyBmaXN0IGNoZWNrIGlmIHdlIGhhdmUgYSBtZXRob2QgdG8gZGV0ZWN0IHRoZSBkZXZpY2UgdGhyb3VnaCBVQVxuICAgICAgICAgICAgICAgIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cbiAgICAgICAgICAgICAgICAgICAgVUFEZXRlY3RvciA9IEJhc2UuZGV2aWNlWydpcycgKyBjYXBpdGFsaXplZEJQTmFtZV1cblxuICAgICAgICAgICAgICAgICMgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgcmVzdWx0IG9mIGEgVUEgY2hlY2suXG4gICAgICAgICAgICAgICAgIyBVbmxlc3MgdGhlcmUgaXMgYSBtZXRob2QgdG8gY2hlY2sgdGhlIFVBLCBsZXRzXG4gICAgICAgICAgICAgICAgIyBsZWF2ZSBpdCBhcyBmYWxzZSBhbmQgdXNlIG9ubHkgdGhlIHZpZXdwb3J0IHRvXG4gICAgICAgICAgICAgICAgIyBtYWtlIHRoZSBkZXZpY2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICAgICAgc3RhdGVVQSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzRnVuY3Rpb24gVUFEZXRlY3RvclxuXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlVUEgPSBVQURldGVjdG9yKClcblxuICAgICAgICAgICAgICAgICMgRmluYWwgY2hlY2suIEZpcnN0IHdlJ2xsIHRyeSB0byBtYWtlIHRvIG1ha2UgdGhlIGRlY2lzaW9uXG4gICAgICAgICAgICAgICAgIyB1cG9uIHRoZSBjdXJyZW50IGRldmljZSBiYXNlZCBvbiBVQSwgaWYgaXMgbm90IHBvc3NpYmxlLCBsZXRzIGp1c3RcbiAgICAgICAgICAgICAgICAjIHVzZSB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICBpZiBzdGF0ZVVBIG9yIHZwZC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICMgVHJpZ2dlciBhIGV2ZW50IHRoYXQgZm9sbG93cyB0aGUgZm9sbG93aW5nIG5hbWluZyBjb252ZW50aW9uXG4gICAgICAgICAgICAgICAgICAgICMgcndkOjxkZXZpY2U+XG4gICAgICAgICAgICAgICAgICAgICMgRXhhbXBsZTogcndkOnRhYmxldCBvciByd2Q6bW9iaWxlXG5cbiAgICAgICAgICAgICAgICAgICAgZXZ0ID0gJ3J3ZDonICsgdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmluZm8gXCJbZXh0XSBSZXNwb25zaXZlIERlc2lnbiBleHRlbnNpb24gaXMgdHJpZ2dlcmluZyB0aGUgZm9sbG93aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBldnRcblxuICAgICAgICAgICAgICAgICAgICBOR1MuZW1pdCBldnRcblxuICAgICAgICAgICAgICAgICAgICAjIFN0b3JlIHRoZSBjdXJyZW50IGRldmljZVxuICAgICAgICAgICAgICAgICAgICBAZGV2aWNlID0gdnBkLm5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbXNnID0gXCJbZXh0XSBUaGUgcGFzc2VkIHNldHRpbmdzIHRvIHRoZSBSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1pZ2h0IG5vdCBiZSBjb3JyZWN0IHNpbmNlIHdlIGhhdmVuJ3QgYmVlbiBhYmxlIHRvIGRldGVjdCBhbiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXNvY2lhdGVkIGJyZWFrcG9pbnQgdG8gdGhlIGN1cnJlbnQgdmlld3BvcnRcIlxuICAgICAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgZ2V0RGV2aWNlOiAoKSAtPlxuXG4gICAgICAgICAgICByZXR1cm4gQGRldmljZVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogZGV0ZWN0IGlmIHRoZSBjdXJyZW50IHZpZXdwb3J0XG4gICAgICAgICAqIGNvcnJlc3BvbmQgdG8gYW55IG9mIHRoZSBkZWZpbmVkIGJwIGluIHRoZSBjb25maWcgc2V0dGluZ1xuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHZwIFtudW1iZXIuIEN1cnJlbnQgdmlld3BvcnRdXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gYnJlYWtwb2ludHMgW2Nsb25lIG9mIHRoZSBicmVha3BvaW50IGtleSBvYmplY3RdXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gdGhlIGJyZWFrcG9pbnQgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgY3VycmVudGx5XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWQgdmlld3BvcnRcbiAgICAgICAgIyMjXG4gICAgICAgIF9jaGVja1ZpZXdwb3J0OiAodnAsIGJyZWFrcG9pbnRzKSAtPlxuXG4gICAgICAgICAgICBicmVha3BvaW50ID0gQmFzZS51dGlsLmZpbHRlcihicmVha3BvaW50cywgKGJwKSAtPlxuXG4gICAgICAgICAgICAgICAgIyBzdGFydHMgY2hlY2tpbmcgaWYgdGhlIGRldGVjdGVkIHZpZXdwb3J0IGlzXG4gICAgICAgICAgICAgICAgIyBiaWdnZXIgdGhhbiB0aGUgYnBtaW4gZGVmaW5lZCBpbiB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICMgaXRlcmF0ZWQgYnJlYWtwb2ludFxuICAgICAgICAgICAgICAgIGlmIHZwID49IGJwLmJwbWluXG5cbiAgICAgICAgICAgICAgICAgICAgIyB3ZSdsbCBuZWVkIHRvIGNoZWNrIHRoaXMgd2F5IGJlY2F1c2UgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAjIGlmIGEgQlAgZG9lc24ndCBoYXZlIGEgYnBtYXggcHJvcGVydHkgaXQgbWVhbnNcbiAgICAgICAgICAgICAgICAgICAgIyBpcyB0aGUgbGFzdCBhbmQgYmlnZ2VyIGNhc2UgdG8gY2hlY2suIEJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICAgICAgIyBpcyBkZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIGJwLmJwbWF4IGFuZCBicC5icG1heCAhPSAwXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgaXQncyB3aXRoaW4gdGhlIHJhbmdlLCBhbGwgZ29vZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdnAgPD0gYnAuYnBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGhpcyBzaG91bGQgb25seSBiZSB0cnVlIGluIG9ubHkgb25lIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICMgQnkgZGVmYXVsdCwganVzdCBmb3IgZGVza3RvcCB3aGljaCBkb2Vzbid0IGhhdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICMgYW4gXCJ1bnRpbFwiIGJyZWFrcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlXG5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgaWYgYnJlYWtwb2ludC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyZWFrcG9pbnQuc2hpZnQoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB7fVxuXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBEZXNpZ24gRXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBjb25maWcgPSB7fVxuXG4gICAgICAgICMgQ2hlY2sgaWYgdGhlIGV4dGVuc2lvbiBoYXMgYSBjdXN0b20gY29uZmlnIHRvIHVzZVxuICAgICAgICBpZiBhcHAuY29uZmlnLmV4dGVuc2lvbiBhbmQgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cbiAgICAgICAgICAgIGNvbmZpZyA9IEJhc2UudXRpbC5kZWZhdWx0cyB7fSwgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cblxuICAgICAgICByd2QgPSBuZXcgUmVzcG9uc2l2ZURlc2lnbihjb25maWcpXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkID0gKCkgLT5cbiAgICAgICAgICAgICMgY2FsbCBkZXRlY3QgRGV2aWNlIGluIG9yZGVyIHRvIHRyaWdnZXIgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICMgZGV2aWNlIGV2ZW50XG4gICAgICAgICAgICByd2QuZGV0ZWN0RGV2aWNlKClcblxuICAgICAgICBhcHAuc2FuZGJveC5yd2QuZ2V0RGV2aWNlID0gKCkgLT5cblxuICAgICAgICAgICAgcndkLmdldERldmljZSgpXG5cbiAgICAjIHRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGNvbXBvbmVudHMgaGF2ZSBiZWVuXG4gICAgIyBpbml0aWFsaXplZFxuICAgIGFmdGVyQXBwSW5pdGlhbGl6ZWQ6IChhcHApIC0+XG5cbiAgICAgICAgQmFzZS5sb2cuaW5mbyBcImFmdGVyQXBwSW5pdGlhbGl6ZWQgbWV0aG9kIGZyb20gUmVzcG9uc2l2ZURlc2lnblwiXG5cbiAgICAgICAgYXBwLnNhbmRib3gucndkKClcblxuICAgIG5hbWU6ICdSZXNwb25zaXZlIERlc2lnbiBFeHRlbnNpb24nXG5cbiAgICAjIFRoZSBleHBvc2VkIGtleSBuYW1lIHRoYXQgY291bGQgYmUgdXNlZCB0byBwYXNzIG9wdGlvbnNcbiAgICAjIHRvIHRoZSBleHRlbnNpb24uXG4gICAgIyBUaGlzIGlzIGdvbm5hIGJlIHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBDb3JlIG9iamVjdC5cbiAgICAjIE5vdGU6IEJ5IGNvbnZlbnRpb24gd2UnbGwgdXNlIHRoZSBmaWxlbmFtZVxuICAgIG9wdGlvbktleTogJ3Jlc3BvbnNpdmVkZXNpZ24nXG4pIiwiIyMjKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBiZSBoYW5kbGluZyB0aGUgY3JlYXRpb24gb2YgdGhlIHJlc3BvbnNpdmUgaW1hZ2VzXG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFeHQpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi8uLi9iYXNlLmNvZmZlZScpXG5cbiAgICBjbGFzcyBSZXNwb25zaXZlSW1hZ2VzXG5cbiAgICAgICAgY2ZnIDpcbiAgICAgICAgICAgICMgQXJyYXkgb2Ygc3VwcG9ydGVkIFBpeGVsIHdpZHRoIGZvciBpbWFnZXNcbiAgICAgICAgICAgIGF2YWlsYWJsZVdpZHRoczogWzEzMywxNTIsMTYyLDIyNSwyMTAsMjI0LDI4MCwzNTIsNDcwLDUzNiw1OTAsNjc2LDcxMCw3NjgsODg1LDk0NSwxMTkwXVxuXG4gICAgICAgICAgICAjIEFycmF5IG9mIHN1cHBvcnRlciBwaXhlbCByYXRpb3NcbiAgICAgICAgICAgIGF2YWlsYWJsZVBpeGVsUmF0aW9zOiBbMSwgMiwgM11cblxuICAgICAgICAgICAgIyBTZWxlY3RvciB0byBiZSB1c2VkIHdoZW4gaW5zdGFudGluZyBJbWFnZXJcbiAgICAgICAgICAgIGRlZmF1bHRTZWxlY3RvciA6ICcuZGVsYXllZC1pbWFnZS1sb2FkJ1xuXG4gICAgICAgICAgICAjIGxhenkgbW9kZSBlbmFibGVkXG4gICAgICAgICAgICBsYXp5bW9kZSA6IHRydWVcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKGNvbmZpZyA9IHt9KSAtPlxuXG4gICAgICAgICAgICBCYXNlLnV0aWwuYmluZEFsbCBALCBcIl9pbml0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlTGlzdGVuZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJfY3JlYXRlSW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBAY29uZmlnID0gQmFzZS51dGlsLmV4dGVuZCB7fSwgQGNmZywgY29uZmlnXG5cbiAgICAgICAgICAgIEBfaW5pdCgpXG5cbiAgICAgICAgX2luaXQ6ICgpIC0+XG5cbiAgICAgICAgICAgICMgY3JlYXRlcyBsaXN0ZW5lcnMgdG8gYWxsb3cgdGhlIGluc3RhbnRpYXRvbiBvZiB0aGUgSW1hZ2VyXG4gICAgICAgICAgICAjIGluIGxhenkgbG9hZCBtb2RlLlxuICAgICAgICAgICAgIyBVc2VmdWwgZm9yIGluZmluaXRlIHNjcm9sbHMgb3IgaW1hZ2VzIGNyZWF0ZWQgb24gZGVtYW5kXG4gICAgICAgICAgICBAX2NyZWF0ZUxpc3RlbmVycygpIGlmIEBjb25maWcubGF6eW1vZGVcblxuICAgICAgICAgICAgIyBBcyBzb29uIGFzIHRoaXMgZXh0ZW5zaW9uIGlzIGluaXRpYWxpemVkIHdlIGFyZSBnb25uYSBiZSBjcmVhdGluZ1xuICAgICAgICAgICAgIyB0aGUgcmVzcG9uc2l2ZSBpbWFnZXNcbiAgICAgICAgICAgIEBfY3JlYXRlSW5zdGFuY2UoKVxuXG4gICAgICAgIF9jcmVhdGVMaXN0ZW5lcnM6ICgpIC0+XG4gICAgICAgICAgICAjIHRoaXMgZ2l2ZXMgdGhlIGFiaWxpdHkgdG8gY3JlYXRlIHJlc3BvbnNpdmUgaW1hZ2VzXG4gICAgICAgICAgICAjIGJ5IHRyaWdnZXIgdGhpcyBldmVudCB3aXRoIG9wdGlvbmFsIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIE5HUy5vbiAncmVzcG9uc2l2ZWltYWdlczpjcmVhdGUnLCBAX2NyZWF0ZUluc3RhbmNlXG5cbiAgICAgICAgX2NyZWF0ZUluc3RhbmNlIDogKG9wdGlvbnMgPSB7fSkgLT5cblxuICAgICAgICAgICAgQmFzZS5sb2cuaW5mbyBcIltleHRdIFJlc3BvbnNpdmUgSW1hZ2VzIEV4dGVuc2lvbiBjcmVhdGluZyBhIG5ldyBJbWFnZXIgaW5zdGFuY2VcIlxuXG4gICAgICAgICAgICBuZXcgQmFzZS5JbWFnZXIoIG9wdGlvbnMuc2VsZWN0b3Igb3IgQGNvbmZpZy5kZWZhdWx0U2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlV2lkdGhzOiBvcHRpb25zLmF2YWlsYWJsZVdpZHRocyBvciBAY29uZmlnLmF2YWlsYWJsZVdpZHRocyxcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVQaXhlbFJhdGlvczogb3B0aW9ucy5hdmFpbGFibGVQaXhlbFJhdGlvcyBvciBAY29uZmlnLmF2YWlsYWJsZVBpeGVsUmF0aW9zXG4gICAgICAgICAgICApXG5cbiAgICAjIHJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGluaXRpYWxpemUgbWV0aG9kIHRoYXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgIyBpbml0IHRoZSBleHRlbnNpb25cbiAgICBpbml0aWFsaXplIDogKGFwcCkgLT5cblxuICAgICAgICBCYXNlLmxvZy5pbmZvIFwiW2V4dF0gUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uIGluaXRpYWxpemVkXCJcblxuICAgICAgICBhcHAuc2FuZGJveC5yZXNwb25zaXZlaW1hZ2VzID0gKCkgLT5cblxuICAgICAgICAgICAgY29uZmlnID0ge31cblxuICAgICAgICAgICAgIyBDaGVjayBpZiB0aGUgZXh0ZW5zaW9uIGhhcyBhIGN1c3RvbSBjb25maWcgdG8gdXNlXG4gICAgICAgICAgICBpZiBhcHAuY29uZmlnLmV4dGVuc2lvbiBhbmQgYXBwLmNvbmZpZy5leHRlbnNpb25bQG9wdGlvbktleV1cbiAgICAgICAgICAgICAgICBjb25maWcgPSBCYXNlLnV0aWwuZGVmYXVsdHMge30sIGFwcC5jb25maWcuZXh0ZW5zaW9uW0BvcHRpb25LZXldXG5cbiAgICAgICAgICAgIHJwID0gbmV3IFJlc3BvbnNpdmVJbWFnZXMoY29uZmlnKVxuXG4gICAgICAgICAgICAjIHRyaWdnZXIgdGhlIGV2ZW50IHRvIGxldCBldmVyeWJvZHkga25vd3MgdGhhdCB0aGlzIGV4dGVuc2lvbiBmaW5pc2hlZFxuICAgICAgICAgICAgIyBpdHMgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAgIE5HUy5lbWl0ICdyZXNwb25zaXZlaW1hZ2VzOmluaXRpYWxpemVkJ1xuXG4gICAgIyB0aGlzIG1ldGhvZCBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBhZnRlciBjb21wb25lbnRzIGhhdmUgYmVlblxuICAgICMgaW5pdGlhbGl6ZWRcbiAgICBhZnRlckFwcEluaXRpYWxpemVkOiAoYXBwKSAtPlxuXG4gICAgICAgIEJhc2UubG9nLmluZm8gXCJhZnRlckFwcEluaXRpYWxpemVkIG1ldGhvZCBmcm9tIFJlc3BvbnNpdmVJbWFnZXNcIlxuXG4gICAgICAgIGFwcC5zYW5kYm94LnJlc3BvbnNpdmVpbWFnZXMoKVxuXG5cbiAgICBuYW1lOiAnUmVzcG9uc2l2ZSBJbWFnZXMgRXh0ZW5zaW9uJ1xuXG4gICAgIyBUaGUgZXhwb3NlZCBrZXkgbmFtZSB0aGF0IGNvdWxkIGJlIHVzZWQgdG8gcGFzcyBvcHRpb25zXG4gICAgIyB0byB0aGUgZXh0ZW5zaW9uLlxuICAgICMgVGhpcyBpcyBnb25uYSBiZSB1c2VkIHdoZW4gaW5zdGFudGlhdGluZyB0aGUgQ29yZSBvYmplY3QuXG4gICAgIyBOb3RlOiBCeSBjb252ZW50aW9uIHdlJ2xsIHVzZSB0aGUgZmlsZW5hbWVcbiAgICBvcHRpb25LZXk6ICdyZXNwb25zaXZlaW1hZ2VzJ1xuKVxuIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIENvb2tpZXMpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGNvb2tpZXMgPSByZXF1aXJlKCdjb29raWVzLWpzJylcblxuICAgICMgRXhwb3NlIENvb2tpZXMgQVBJXG4gICAgQ29va2llcyA9XG5cbiAgICAgICAgc2V0OiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICAgICAgICAgIGNvb2tpZXMuc2V0IGtleSwgdmFsdWUsIG9wdGlvbnNcblxuICAgICAgICBnZXQ6IChrZXkpIC0+XG4gICAgICAgICAgICBjb29raWVzLmdldCBrZXlcblxuICAgICAgICBleHBpcmU6IChrZXksIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICBjb29raWVzLmV4cGlyZSBrZXksIG9wdGlvbnNcblxuICAgIHJldHVybiBDb29raWVzXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIERldmljZURldGVjdGlvbikgLT5cblxuICAgICMgRGV2aWNlIGRldGVjdGlvblxuICAgIGlzTW9iaWxlID0gcmVxdWlyZSgnaXNtb2JpbGVqcycpXG5cbiAgICAjIEV4cG9zZSBkZXZpY2UgZGV0ZWN0aW9uIEFQSVxuICAgIERldmljZURldGVjdGlvbiA9XG5cbiAgICAgICAgIyBHcm91cHNcbiAgICAgICAgaXNNb2JpbGU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5waG9uZVxuXG4gICAgICAgIGlzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUudGFibGV0XG5cbiAgICAgICAgIyBBcHBsZSBkZXZpY2VzXG4gICAgICAgIGlzSXBob25lOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUucGhvbmVcblxuICAgICAgICBpc0lwb2Q6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5pcG9kXG5cbiAgICAgICAgaXNJcGFkOiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUuYXBwbGUudGFibGV0XG5cbiAgICAgICAgaXNBcHBsZSA6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hcHBsZS5kZXZpY2VcblxuICAgICAgICAjIEFuZHJvaWQgZGV2aWNlc1xuICAgICAgICBpc0FuZHJvaWRQaG9uZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQucGhvbmVcblxuICAgICAgICBpc0FuZHJvaWRUYWJsZXQ6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS5hbmRyb2lkLnRhYmxldFxuXG4gICAgICAgIGlzQW5kcm9pZERldmljZTogKCkgLT5cbiAgICAgICAgICAgIGlzTW9iaWxlLmFuZHJvaWQuZGV2aWNlXG5cbiAgICAgICAgIyBXaW5kb3dzIGRldmljZXNcbiAgICAgICAgaXNXaW5kb3dzUGhvbmU6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLnBob25lXG5cbiAgICAgICAgaXNXaW5kb3dzVGFibGV0OiAoKSAtPlxuICAgICAgICAgICAgaXNNb2JpbGUud2luZG93cy50YWJsZXRcblxuICAgICAgICBpc1dpbmRvd3NEZXZpY2U6ICgpIC0+XG4gICAgICAgICAgICBpc01vYmlsZS53aW5kb3dzLmRldmljZVxuXG4gICAgcmV0dXJuIERldmljZURldGVjdGlvblxuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBFdmVudEJ1cykgLT5cblxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJylcblxuICAgICMjIypcbiAgICAgKiBjbGFzcyB0aGF0IHNlcnZlcyBhcyBhIGZhY2FkZSBmb3IgdGhlIEV2ZW50RW1pdHRlciBjbGFzc1xuICAgICMjI1xuICAgIGNsYXNzIEV2ZW50QnVzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cbiAgICByZXR1cm4gRXZlbnRCdXNcbikiLCIjIyMqXG4gKiBUaGUgRXh0ZW5zaW9uIE1hbmFuZ2VyIHdpbGwgcHJvdmlkZSB0aGUgYmFzZSBzZXQgb2YgZnVuY3Rpb25hbGl0aWVzXG4gKiB0byBtYWtlIHRoZSBDb3JlIGxpYnJhcnkgZXh0ZW5zaWJsZS5cbiAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4jIyNcbigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBOR1MpIC0+XG5cbiAgICBCYXNlID0gcmVxdWlyZSgnLi4vYmFzZS5jb2ZmZWUnKVxuXG4gICAgY2xhc3MgRXh0TWFuYWdlclxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogRGVmYXVsdHMgY29uZmlncyBmb3IgdGhlIG1vZHVsZVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAjIyNcbiAgICAgICAgX2V4dGVuc2lvbkNvbmZpZ0RlZmF1bHRzOlxuICAgICAgICAgICAgYWN0aXZhdGVkIDogdHJ1ZSAjIHVubGVzcyBzYWlkIG90aGVyd2lzZSwgZXZlcnkgYWRkZWQgZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgd2lsbCBiZSBhY3RpdmF0ZWQgb24gc3RhcnRcblxuICAgICAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgICAgICMgdG8ga2VlcCB0cmFjayBvZiBhbGwgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgQF9leHRlbnNpb25zID0gW11cblxuICAgICAgICAgICAgIyB0byBrZWVwIHRyYWNrIG9mIGFsbCBpbml0aWFsaXplZCBleHRlbnNpb25cbiAgICAgICAgICAgIEBfaW5pdGlhbGl6ZWRFeHRlbnNpb25zID0gW11cblxuICAgICAgICBhZGQ6IChleHQpIC0+XG5cbiAgICAgICAgICAgICMgY2hlY2tzIGlmIHRoZSBuYW1lIGZvciB0aGUgZXh0ZW5zaW9uIGhhdmUgYmVlbiBkZWZpbmVkLlxuICAgICAgICAgICAgIyBpZiBub3QgbG9nIGEgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICB1bmxlc3MgZXh0Lm5hbWVcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBleHRlbnNpb24gZG9lc24ndCBoYXZlIGEgbmFtZSBhc3NvY2lhdGVkLiBJdCB3aWxsIGJlIGhlcGZ1bGwgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiaWYgeW91IGhhdmUgYXNzaW5nIGFsbCBvZiB5b3VyIGV4dGVuc2lvbnMgYSBuYW1lIGZvciBiZXR0ZXIgZGVidWdnaW5nXCJcbiAgICAgICAgICAgICAgICBCYXNlLmxvZy53YXJuIG1zZ1xuXG4gICAgICAgICAgICAjIExldHMgdGhyb3cgYW4gZXJyb3IgaWYgd2UgdHJ5IHRvIGluaXRpYWxpemUgdGhlIHNhbWUgZXh0ZW5zaW9uIHR3aWNlc1xuICAgICAgICAgICAgQmFzZS51dGlsLmVhY2ggQF9leHRlbnNpb25zLCAoeHQsIGkpIC0+XG4gICAgICAgICAgICAgICAgaWYgXy5pc0VxdWFsIHh0LCBleHRcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXh0ZW5zaW9uOiBcIiArIGV4dC5uYW1lICsgXCIgYWxyZWFkeSBleGlzdHMuXCIpXG5cbiAgICAgICAgICAgIEBfZXh0ZW5zaW9ucy5wdXNoKGV4dClcblxuICAgICAgICBpbml0IDogKGNvbnRleHQpIC0+XG4gICAgICAgICAgICBCYXNlLmxvZy5pbmZvIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgICAgICBAX2luaXRFeHRlbnNpb24oQF9leHRlbnNpb25zLCBjb250ZXh0KVxuXG4gICAgICAgIF9pbml0RXh0ZW5zaW9uIDogKGV4dGVuc2lvbnMsIGNvbnRleHQpIC0+XG5cbiAgICAgICAgICAgIGlmIGV4dGVuc2lvbnMubGVuZ3RoID4gMFxuXG4gICAgICAgICAgICAgICAgeHQgPSBleHRlbnNpb25zLnNoaWZ0KClcblxuICAgICAgICAgICAgICAgICMgQ2FsbCBleHRlbnNpb25zIGNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgeHQuaW5pdGlhbGl6ZShjb250ZXh0KSBpZiBAX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQoeHQsIGNvbnRleHQuY29uZmlnKVxuXG4gICAgICAgICAgICAgICAgIyBLZWVwIHRyYWNrIG9mIHRoZSBpbml0aWFsaXplZCBleHRlbnNpb25zIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMucHVzaCB4dFxuXG4gICAgICAgICAgICAgICAgQF9pbml0RXh0ZW5zaW9uKGV4dGVuc2lvbnMsIGNvbnRleHQpXG5cbiAgICAgICAgX2lzRXh0ZW5zaW9uQWxsb3dlZFRvQmVBY3RpdmF0ZWQ6ICh4dCwgY29uZmlnKSAtPlxuXG4gICAgICAgICAgICAjIGZpcnN0IHdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIFwib3B0aW9uc1wiIGtleSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAjIGJ5IHRoZSBleHRlbnNpb25cbiAgICAgICAgICAgIHVubGVzcyB4dC5vcHRpb25LZXlcbiAgICAgICAgICAgICAgICBtc2cgPSBcIlRoZSBvcHRpb25LZXkgaXMgcmVxdWlyZWQgYW5kIHdhcyBub3QgZGVmaW5lZCBieTogXCIgKyB4dC5uYW1lXG4gICAgICAgICAgICAgICAgQmFzZS5sb2cuZXJyb3IgbXNnXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgIyBpZiBvcHRpb25zIHdlcmUgcHJvdmlkZWQgdG8gdGhlIGV4dGVuc2lvbiwgbGV0cyBjaGVjayBqdXN0IGZvciBcImFjdGl2YXRlZFwiXG4gICAgICAgICAgICAjIHdoaWNoIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IHNob3VsZCBtYXR0ZXIgd2l0aGluIHRoaXMgbWV0aG9kXG4gICAgICAgICAgICBpZiBjb25maWcuZXh0ZW5zaW9uIGFuZCBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0gYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uaGFzT3duUHJvcGVydHkgJ2FjdGl2YXRlZCdcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZWQgPSBjb25maWcuZXh0ZW5zaW9uW3h0Lm9wdGlvbktleV0uYWN0aXZhdGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkID0gQF9leHRlbnNpb25Db25maWdEZWZhdWx0cy5hY3RpdmF0ZWRcblxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2YXRlZFxuXG5cbiAgICAgICAgZ2V0SW5pdGlhbGl6ZWRFeHRlbnNpb25zIDogKCkgLT5cbiAgICAgICAgICAgIHJldHVybiBAX2luaXRpYWxpemVkRXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEluaXRpYWxpemVkRXh0ZW5zaW9uQnlOYW1lIDogKG5hbWUpIC0+XG4gICAgICAgICAgICBCYXNlLnV0aWwud2hlcmUgQF9pbml0aWFsaXplZEV4dGVuc2lvbnMsIG9wdGlvbktleTogbmFtZVxuXG4gICAgICAgIGdldEV4dGVuc2lvbnMgOiAoKSAtPlxuICAgICAgICAgICAgcmV0dXJuIEBfZXh0ZW5zaW9uc1xuXG4gICAgICAgIGdldEV4dGVuc2lvbkJ5TmFtZSA6IChuYW1lKSAtPlxuICAgICAgICAgICAgQmFzZS51dGlsLndoZXJlIEBfZXh0ZW5zaW9ucywgb3B0aW9uS2V5OiBuYW1lXG5cbiAgICByZXR1cm4gRXh0TWFuYWdlclxuXG4pXG4iLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVXRpbHMpIC0+XG5cbiAgICAjIEV4cG9zZSBVdGlscyBBUElcbiAgICBVdGlscyA9XG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIGxpYnJhcnkgdmVyc2lvbmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgdmVyc2lvbkNvbXBhcmUgOiAodjEsIHYyLCBvcHRpb25zKSAtPlxuXG4gICAgICAgICAgICBpc1ZhbGlkUGFydCA9ICh4KSAtPlxuICAgICAgICAgICAgICAgICgoaWYgbGV4aWNvZ3JhcGhpY2FsIHRoZW4gL15cXGQrW0EtWmEtel0qJC8gZWxzZSAvXlxcZCskLykpLnRlc3QgeFxuXG4gICAgICAgICAgICBsZXhpY29ncmFwaGljYWwgPSBvcHRpb25zIGFuZCBvcHRpb25zLmxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgemVyb0V4dGVuZCA9IG9wdGlvbnMgYW5kIG9wdGlvbnMuemVyb0V4dGVuZFxuICAgICAgICAgICAgdjFwYXJ0cyA9IHYxLnNwbGl0KFwiLlwiKVxuICAgICAgICAgICAgdjJwYXJ0cyA9IHYyLnNwbGl0KFwiLlwiKVxuXG4gICAgICAgICAgICByZXR1cm4gTmFOIGlmIG5vdCB2MXBhcnRzLmV2ZXJ5KGlzVmFsaWRQYXJ0KSBvciBub3QgdjJwYXJ0cy5ldmVyeShpc1ZhbGlkUGFydClcblxuICAgICAgICAgICAgaWYgemVyb0V4dGVuZFxuICAgICAgICAgICAgICAgIHYxcGFydHMucHVzaCBcIjBcIiAgICB3aGlsZSB2MXBhcnRzLmxlbmd0aCA8IHYycGFydHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgdjJwYXJ0cy5wdXNoIFwiMFwiICAgIHdoaWxlIHYycGFydHMubGVuZ3RoIDwgdjFwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgdW5sZXNzIGxleGljb2dyYXBoaWNhbFxuICAgICAgICAgICAgICAgIHYxcGFydHMgPSB2MXBhcnRzLm1hcChOdW1iZXIpXG4gICAgICAgICAgICAgICAgdjJwYXJ0cyA9IHYycGFydHMubWFwKE51bWJlcilcblxuICAgICAgICAgICAgaSA9IC0xXG4gICAgICAgICAgICB3aGlsZSBpIDwgdjFwYXJ0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgICAgIGlmIHYycGFydHMubGVuZ3RoIDwgaVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgICAgIGlmIHYxcGFydHNbaV0gPT0gdjJwYXJ0c1tpXVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdjFwYXJ0c1tpXSA+IHYycGFydHNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHYycGFydHNbaV0gPiB2MXBhcnRzW2ldXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuXG4gICAgICAgICAgICByZXR1cm4gLTEgaWYgdjFwYXJ0cy5sZW5ndGggIT0gdjJwYXJ0cy5sZW5ndGhcblxuICAgICAgICAgICAgcmV0dXJuIDBcblxuICAgICAgICBzdHJpbmc6XG4gICAgICAgICAgICBjYXBpdGFsaXplOiAoc3RyKSAtPlxuICAgICAgICAgICAgICAgIHN0ciA9IChpZiBub3Qgc3RyPyB0aGVuIFwiXCIgZWxzZSBTdHJpbmcoc3RyKSlcbiAgICAgICAgICAgICAgICBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcblxuICAgIHJldHVybiBVdGlsc1xuKSIsIigocm9vdCwgZmFjdG9yeSkgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyb290LCB7fSlcblxuKSh3aW5kb3csIChyb290LCBMb2dnZXIpIC0+XG5cbiAgICAjIExvZ2dlclxuICAgIGxvZ2xldmVsID0gcmVxdWlyZSgnbG9nbGV2ZWwnKVxuXG4gICAgIyBFeHBvc2UgdGhlIExvZ2dlciBBUElcbiAgICBMb2dnZXIgPVxuXG4gICAgICAgIHNldExldmVsOiAobGV2ZWwpIC0+XG4gICAgICAgICAgICBsb2dsZXZlbC5zZXRMZXZlbChsZXZlbClcblxuICAgICAgICB0cmFjZTogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLnRyYWNlKG1zZylcblxuICAgICAgICBkZWJ1ZzogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLmRlYnVnKG1zZylcblxuICAgICAgICBpbmZvOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuaW5mbyhtc2cpXG5cbiAgICAgICAgd2FybjogKG1zZykgLT5cbiAgICAgICAgICAgIGxvZ2xldmVsLndhcm4obXNnKVxuXG4gICAgICAgIGVycm9yOiAobXNnKSAtPlxuICAgICAgICAgICAgbG9nbGV2ZWwuZXJyb3IobXNnKVxuXG4gICAgcmV0dXJuIExvZ2dlclxuKSIsIiMjIypcbiAqIFRoaXMgd2lsbCBwcm92aWRlIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGRlZmluZSBNb2R1bGVzXG4gKiBhbmQgcHJvdmlkZSBhIHdheSB0byBleHRlbmQgdGhlbVxuICogQGF1dGhvciBGcmFuY2lzY28gUmFtaW5pIDxmcmFtaW5pIGF0IGdtYWlsLmNvbT5cbiMjI1xuKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIE1vZHVsZSkgLT5cblxuICAgIEJhc2UgPSByZXF1aXJlKCcuLi9iYXNlLmNvZmZlZScpXG5cbiAgICAjIHRoaXMgd2lsbCBzZXJ2ZSBhcyB0aGUgYmFzZSBjbGFzcyBmb3IgYSBNb2R1bGVcbiAgICBjbGFzcyBNb2R1bGVcbiAgICAgICAgY29uc3RydWN0b3I6IChvcHQpIC0+XG4gICAgICAgICAgICBAc2FuZGJveCA9IG9wdC5zYW5kYm94XG4gICAgICAgICAgICBAb3B0aW9ucyA9IG9wdC5vcHRpb25zXG4gICAgICAgICAgICBAc2V0RWxlbWVudCgpXG5cblxuICAgICMgdGhpcyBjbGFzcyB3aWxsIGV4cG9zZSBzdGF0aWMgbWV0aG9kcyB0byBhZGQsIGV4dGVuZCBhbmRcbiAgICAjIGdldCB0aGUgbGlzdCBvZiBhZGRlZCBtb2R1bGVzXG4gICAgY2xhc3MgTW9kdWxlc1xuXG4gICAgICAgICMgdGhpcyB3aWxsIGhvbGQgdGhlIGxpc3Qgb2YgYWRkZWQgbW9kdWxlc1xuICAgICAgICBAbGlzdCA6IHt9XG5cbiAgICAgICAgIyBqdXN0IGFuIGFsaWFzIGZvciBleHRlbmRcbiAgICAgICAgQGFkZCA6IChuYW1lLCBkZWZpbml0aW9uKSAtPlxuICAgICAgICAgICAgQGV4dGVuZChuYW1lLCBkZWZpbml0aW9uLCBNb2R1bGUpXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAgKiB0aGlzIHdpbGwgYWxsb3dzIHVzIHRvIHNpbXBsaWZ5IGFuZCBoYXZlIG1vcmUgY29udHJvbFxuICAgICAgICAgKiBvdmVyIGFkZGluZy9kZWZpbmluZyBtb2R1bGVzXG4gICAgICAgICAqIEBhdXRob3IgRnJhbmNpc2NvIFJhbWluaSA8ZnJhbWluaSBhdCBnbWFpbC5jb20+XG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmddfSBuYW1lXG4gICAgICAgICAqIEBwYXJhbSAge1tPYmplY3RdfSBkZWZpbml0aW9uXG4gICAgICAgICAqIEBwYXJhbSAge1tTdHJpbmcvRnVuY3Rpb25dfSBCYXNlQ2xhc3NcbiAgICAgICAgIyMjXG4gICAgICAgIEBleHRlbmQgOiAobmFtZSwgZGVmaW5pdGlvbiwgQmFzZUNsYXNzKSAtPlxuICAgICAgICAgICAgaWYgQmFzZS51dGlsLmlzU3RyaW5nKG5hbWUpIGFuZCBCYXNlLnV0aWwuaXNPYmplY3QoZGVmaW5pdGlvbilcbiAgICAgICAgICAgICAgICAjIGlmIG5vIEJhc2VDbGFzcyBpcyBwYXNzZWQsIGJ5IGRlZmF1bHQgd2UnbGwgdXNlIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgIEJhc2VDbGFzcyA9IE1vZHVsZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIyBpZiB3ZSBhcmUgcGFzc2luZyB0aGUgQmFzZUNsYXNzIGFzIGEgc3RyaW5nLCBpdCBtZWFucyB0aGF0IGNsYXNzXG4gICAgICAgICAgICAgICAgICAgICMgc2hvdWxkIGhhdmUgYmVlbiBhZGRlZCBwcmV2aW91c2x5LCBzbyB3ZSdsbCBsb29rIHVuZGVyIHRoZSBsaXN0IG9ialxuICAgICAgICAgICAgICAgICAgICBpZiBCYXNlLnV0aWwuaXNTdHJpbmcgQmFzZUNsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGNoZWNrIGlmIHRoZSBjbGFzcyBoYXMgYmVlbiBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBiYyA9IEBsaXN0W0Jhc2VDbGFzc11cbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgdGhlIGRlZmluaXRpb24gZXhpc3RzLCBsZXRzIGFzc2lnbiBpdCB0byBCYXNlQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGJjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gYmNcbiAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgbm90LCBsZXRzIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tNb2R1bGUvICcrIG5hbWUgKycgXTogaXMgdHJ5aW5nIHRvIGV4dGVuZCBbJyArIEJhc2VDbGFzcyArICddIHdoaWNoIGRvZXMgbm90IGV4aXN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhc2UubG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgICAgICAgICAgICAgICAgICMgaWYgaXQgaXMgYSBmdW5jdGlvbiwgd2UnbGwgdXNlIGl0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgICAgICMgVE9ETzogZG8gc29tZSBjaGVja2luZyBiZWZvcmUgdHJ5aW5nIHRvIHVzZSBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIEJhc2UudXRpbC5pc0Z1bmN0aW9uIEJhc2VDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgQmFzZUNsYXNzID0gQmFzZUNsYXNzXG5cbiAgICAgICAgICAgICAgICBleHRlbmRlZENsYXNzID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgIyB3ZSdsbCBvbmx5IHRyeSB0byBhZGQgdGhpcyBkZWZpbml0aW9uIGluIGNhc2VcbiAgICAgICAgICAgICAgICB1bmxlc3MgQmFzZS51dGlsLmhhcyBAbGlzdCwgbmFtZVxuICAgICAgICAgICAgICAgICAgICAjIGV4dGVuZHMgdGhlIGN1cnJlbnQgZGVmaW5pdGlvbiB3aXRoIHRoZSBNb2R1bGUgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5kZWREZWZpbml0aW9uID0gZXh0ZW5kLmNhbGwgQmFzZUNsYXNzLCBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgc3RvcmUgdGhlIHJlZmVyZW5jZSBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgICAgICAgICAgICAgICAgQGxpc3RbbmFtZV0gPSBleHRlbmRlZERlZmluaXRpb25cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5kZWREZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAjIGluZm9ybSB0aGUgZGV2cyB0aGF0IHNvbWVvbmUgaXMgdHJ5aW5nIHRvIGFkZCBhIG1vZHVsZSdzXG4gICAgICAgICAgICAgICAgICAgICMgZGVmaW5pdGlvbiB0aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gJ1tDb21wb25lbnQ6JyArIG5hbWUgKyAnXSBoYXZlIGFscmVhZHkgYmVlbiBkZWZpbmVkJyBcbiAgICAgICAgICAgICAgICAgICAgQmFzZS5sb2cud2FybiBtc2dcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQFxuXG5cbiAgICBCYXNlLnV0aWwuZXh0ZW5kIE1vZHVsZTo6LCBCYXNlLkV2ZW50cyxcblxuICAgICAgICAjIHRoaXMgaGFzIHRvIGJlIG92ZXdyaXR0ZW4gYnkgdGhlIG1vZHVsZSBkZWZpbml0aW9uXG4gICAgICAgIGluaXRpYWxpemU6ICgpIC0+XG4gICAgICAgICAgICBtc2cgPSAnW0NvbXBvbmVudC8nICsgQG9wdGlvbnMubmFtZSArICddOicgKyAnRG9lc25cXCd0IGhhdmUgYW4gaW5pdGlhbGl6ZSBtZXRob2QgZGVmaW5lZCdcbiAgICAgICAgICAgIEJhc2UubG9nLndhcm4gbXNnXG5cbiAgICAgICAgc2V0RWxlbWVudDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICAgICAgQGVsID0gQG9wdGlvbnMuZWxcbiAgICAgICAgICAgIEAkZWwgPSAkKEBlbClcblxuICAgICAgICAgICAgQGRlbGVnYXRlRXZlbnRzKClcblxuICAgICAgICBkZWxlZ2F0ZUV2ZW50czogKGV2ZW50cykgLT5cbiAgICAgICAgICAgICMgcmVnZXggdG8gc3BsaXQgdGhlIGV2ZW50cyBrZXkgKHNlcGFyYXRlcyB0aGUgZXZlbnQgZnJvbSB0aGUgc2VsZWN0b3IpXG4gICAgICAgICAgICBkZWxlZ2F0ZUV2ZW50U3BsaXR0ZXIgPSAvXihcXFMrKVxccyooLiopJC9cblxuICAgICAgICAgICAgIyBpZiB0aGUgZXZlbnRzIG9iamVjdCBpcyBub3QgZGVmaW5lZCBvciBwYXNzZWQgYXMgYSBwYXJhbWV0ZXJcbiAgICAgICAgICAgICMgdGhlcmUgaXMgbm90aGluZyB0byBkbyBoZXJlXG4gICAgICAgICAgICByZXR1cm4gICAgdW5sZXNzIGV2ZW50cyBvciAoZXZlbnRzID0gQmFzZS51dGlsLnJlc3VsdChALCBcImV2ZW50c1wiKSlcbiAgICAgICAgICAgICMgYmVmb3JlIHRyeWluZyB0byBhdHRhY2ggbmV3IGV2ZW50cywgbGV0cyByZW1vdmUgYW55IHByZXZpb3VzXG4gICAgICAgICAgICAjIGF0dGFjaGVkIGV2ZW50XG4gICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG5cbiAgICAgICAgICAgIGZvciBrZXkgb2YgZXZlbnRzXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QgbmFtZVxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGV2ZW50c1trZXldXG4gICAgICAgICAgICAgICAgIyBncmFiIHRoZSBtZXRob2QncyBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gQFtldmVudHNba2V5XV0gICAgdW5sZXNzIEJhc2UudXRpbC5pc0Z1bmN0aW9uKG1ldGhvZClcbiAgICAgICAgICAgICAgICBjb250aW51ZSAgICB1bmxlc3MgbWV0aG9kXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBrZXkubWF0Y2goZGVsZWdhdGVFdmVudFNwbGl0dGVyKVxuICAgICAgICAgICAgICAgIEBkZWxlZ2F0ZSBtYXRjaFsxXSwgbWF0Y2hbMl0sIEJhc2UudXRpbC5iaW5kKG1ldGhvZCwgQClcblxuICAgICAgICAgICAgcmV0dXJuIEBcblxuICAgICAgICBkZWxlZ2F0ZTogKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSAtPlxuICAgICAgICAgICAgQCRlbC5vbiBldmVudE5hbWUgKyBcIi5wZXN0bGVFdmVudFwiICsgQG9wdGlvbnMuZ3VpZCwgc2VsZWN0b3IsIGxpc3RlbmVyXG4gICAgICAgICAgICByZXR1cm4gQFxuXG4gICAgICAgIHVuZGVsZWdhdGVFdmVudHM6ICgpIC0+XG4gICAgICAgICAgICBAJGVsLm9mZignLnBlc3RsZUV2ZW50JyArIEBvcHRpb25zLmd1aWQpICAgIGlmIEAkZWxcbiAgICAgICAgICAgIHJldHVybiBAXG5cbiAgICAgICAgIyBieSBkZWZhdWx0LCBpdCB3aWxsIHJlbW92ZSBldmVudGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZVxuICAgICAgICAjICRlbCBmcm9tIHRoZSBET01cbiAgICAgICAgc3RvcDogKCkgLT5cbiAgICAgICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlKCkgaWYgQCRlbFxuXG4gICAgIyBIZWxwZXJzXG4gICAgZXh0ZW5kID0gKHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSAtPlxuICAgICAgICBwYXJlbnQgPSBAXG5cbiAgICAgICAgIyBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHRoZSBuZXcgc3ViY2xhc3MgaXMgZWl0aGVyIGRlZmluZWQgYnkgeW91XG4gICAgICAgICMgKHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgaW4geW91ciBgZXh0ZW5kYCBkZWZpbml0aW9uKSwgb3IgZGVmYXVsdGVkXG4gICAgICAgICMgYnkgdXMgdG8gc2ltcGx5IGNhbGwgdGhlIHBhcmVudCdzIGNvbnN0cnVjdG9yXG4gICAgICAgIGlmIHByb3RvUHJvcHMgYW5kIEJhc2UudXRpbC5oYXMocHJvdG9Qcm9wcywgXCJjb25zdHJ1Y3RvclwiKVxuICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoaWxkID0gLT5cbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwbHkgQCwgYXJndW1lbnRzXG5cbiAgICAgICAgIyBBZGQgc3RhdGljIHByb3BlcnRpZXMgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLCBpZiBzdXBwbGllZC5cbiAgICAgICAgQmFzZS51dGlsLmV4dGVuZCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wc1xuXG4gICAgICAgICMgU2V0IHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gaW5oZXJpdCBmcm9tIGBwYXJlbnRgLCB3aXRob3V0IGNhbGxpbmdcbiAgICAgICAgIyBgcGFyZW50YCdzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAgICBTdXJyb2dhdGUgPSAtPlxuICAgICAgICAgICAgQGNvbnN0cnVjdG9yID0gY2hpbGRcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIFN1cnJvZ2F0ZTo6ID0gcGFyZW50OjpcbiAgICAgICAgY2hpbGQ6OiA9IG5ldyBTdXJyb2dhdGVcblxuICAgICAgICAjIEFkZCBwcm90b3R5cGUgcHJvcGVydGllcyAoaW5zdGFuY2UgcHJvcGVydGllcykgdG8gdGhlIHN1YmNsYXNzLFxuICAgICAgICAjIGlmIHN1cHBsaWVkLlxuICAgICAgICBCYXNlLnV0aWwuZXh0ZW5kIGNoaWxkOjosIHByb3RvUHJvcHMgICAgaWYgcHJvdG9Qcm9wc1xuXG4gICAgICAgICMgc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGluaXRpYWxpemUgbWV0aG9kIHNvIGl0IGNhbiBiZSBjYWxsZWRcbiAgICAgICAgIyBmcm9tIGl0cyBjaGlsZHNcbiAgICAgICAgY2hpbGQ6Ol9zdXBlcl8gPSBwYXJlbnQ6OmluaXRpYWxpemVcblxuICAgICAgICByZXR1cm4gY2hpbGRcblxuICAgICMgU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGJhc2UgY2xhc3MgZm9yIG1vZHVsZXNcbiAgICBNb2R1bGVzLk1vZHVsZSA9IE1vZHVsZVxuXG4gICAgcmV0dXJuIE1vZHVsZXNcbikiLCIoKHJvb3QsIGZhY3RvcnkpIC0+XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCwge30pXG5cbikod2luZG93LCAocm9vdCwgVmVyc2lvbkNoZWNrZXIpIC0+XG5cbiAgICBsb2cgPSByZXF1aXJlICcuL2xvZ2dlci5jb2ZmZWUnXG4gICAgVXRpbHMgPSByZXF1aXJlICcuL2dlbmVyYWwuY29mZmVlJ1xuXG4gICAgIyBFeHBvc2UgVmVyc2lvbkNoZWNrZXIgQVBJXG4gICAgVmVyc2lvbkNoZWNrZXIgPVxuXG4gICAgICAgICMjIypcbiAgICAgICAgICogUmVjdXJzaXZlIG1ldGhvZCB0byBjaGVjayB2ZXJzaW9uaW5nIGZvciBhbGwgdGhlIGRlZmluZWQgbGlicmFyaWVzXG4gICAgICAgICAqIHdpdGhpbiB0aGUgZGVwZW5kZW5jeSBhcnJheVxuICAgICAgICAjIyNcbiAgICAgICAgY2hlY2s6IChkZXBlbmRlbmNpZXMpIC0+XG5cbiAgICAgICAgICAgIGlmIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgICAgICBkcCA9IGRlcGVuZGVuY2llcy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgICB1bmxlc3MgZHAub2JqXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IGRwLm5hbWUgKyBcIiBpcyBhIGhhcmQgZGVwZW5kZW5jeSBhbmQgaXQgaGFzIHRvIGJlIGxvYWRlZCBiZWZvcmUgcGVzdGxlLmpzXCJcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yIG1zZ1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKVxuXG4gICAgICAgICAgICAgICAgIyBjb21wYXJlIHRoZSB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgdW5sZXNzIFV0aWxzLnZlcnNpb25Db21wYXJlKGRwLnZlcnNpb24sIGRwLnJlcXVpcmVkKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICMgaWYgd2UgZW50ZXIgaGVyZSBpdCBtZWFucyB0aGUgbG9hZGVkIGxpYnJhcnkgZG9lc3Qgbm90IGZ1bGZpbGwgb3VyIG5lZWRzXG4gICAgICAgICAgICAgICAgICAgIG1zZyA9IFwiW0ZBSUxdIFwiICsgZHAubmFtZSArIFwiOiB2ZXJzaW9uIHJlcXVpcmVkOiBcIiArIGRwLnJlcXVpcmVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgPC0tPiBMb2FkZWQgdmVyc2lvbjogXCIgKyBkcC52ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvciBtc2dcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcblxuICAgICAgICAgICAgICAgIFZlcnNpb25DaGVja2VyLmNoZWNrKGRlcGVuZGVuY2llcylcblxuXG4gICAgcmV0dXJuIFZlcnNpb25DaGVja2VyXG4pIiwiKChyb290LCBmYWN0b3J5KSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJvb3QsIHt9KVxuXG4pKHdpbmRvdywgKHJvb3QsIFZpZXdwb3J0KSAtPlxuXG4gICAgIyBMb2dnZXJcbiAgICB2aWV3cG9ydCA9IHJlcXVpcmUoJ3ZlcmdlJylcblxuICAgICMgRXhwb3NlIFZpZXdwb3J0IGRldGVjdGlvbiBBUElcbiAgICBWaWV3cG9ydCA9XG5cbiAgICAgICAgdmlld3BvcnRXOiAoKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnRXKClcblxuICAgICAgICB2aWV3cG9ydEg6IChrZXkpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC52aWV3cG9ydEgoKVxuXG4gICAgICAgIHZpZXdwb3J0OiAoa2V5KSAtPlxuICAgICAgICAgICAgdmlld3BvcnQudmlld3BvcnQoKVxuXG4gICAgICAgIGluVmlld3BvcnQ6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LmluVmlld3BvcnQoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5YOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblgoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgaW5ZOiAoZWwsIGN1c2hpb24pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5pblkoZWwsIGN1c2hpb24pXG5cbiAgICAgICAgc2Nyb2xsWDogKCkgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnNjcm9sbFgoKVxuXG4gICAgICAgIHNjcm9sbFk6ICgpIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5zY3JvbGxZKClcblxuICAgICAgICAjIFRvIHRlc3QgaWYgYSBtZWRpYSBxdWVyeSBpcyBhY3RpdmVcbiAgICAgICAgbXE6IChtZWRpYVF1ZXJ5U3RyaW5nKSAtPlxuICAgICAgICAgICAgdmlld3BvcnQubXEobWVkaWFRdWVyeVN0cmluZylcblxuICAgICAgICByZWN0YW5nbGU6IChlbCwgY3VzaGlvbikgLT5cbiAgICAgICAgICAgIHZpZXdwb3J0LnJlY3RhbmdsZShlbCwgY3VzaGlvbilcblxuICAgICAgICAjIGlmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgdGhlbiBpdCByZXR1cm5zIHRoZSBhc3BlY3RcbiAgICAgICAgIyByYXRpbyBvZiB0aGUgdmlld3BvcnQuIElmIGFuIGVsZW1lbnQgaXMgcGFzc2VkIGl0IHJldHVybnNcbiAgICAgICAgIyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBlbGVtZW50XG4gICAgICAgIGFzcGVjdDogKG8pIC0+XG4gICAgICAgICAgICB2aWV3cG9ydC5hc3BlY3QobylcblxuICAgIHJldHVybiBWaWV3cG9ydFxuKSJdfQ==
