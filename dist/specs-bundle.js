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
var Component, Core;

Component = require('../../src/extension/components.coffee');

Core = require('../../src/core.coffee');

describe('Components Extension', function() {
  before(function() {
    this.dummycomponent = fixture.load('dummycomponent.html');
    return $('body').append(this.dummycomponent);
  });
  after(function() {
    return fixture.cleanup();
  });
  it('should have an initialize method', function() {
    return Component.initialize.should.be.a('function');
  });
  it('should have a afterAppStarted method', function() {
    return Component.afterAppStarted.should.be.a('function');
  });
  it('should have a name defined', function() {
    return Component.name.should.be.a('string');
  });
  it('should have the class that gives the behavior to the extension exposed', function() {
    return Component.classes.should.be.defined;
  });
  return describe('is accessing the Component class', function() {
    var cmp;
    cmp = Component.classes;
    it('should have a startAll method', function() {
      return cmp.startAll.should.be.a('function');
    });
    it.skip('should have a start method to initialize one component', function() {
      return cmp.start.should.be.a('function');
    });
    return describe('and starting multiple components', function() {
      before(function() {
        NGL.modules.dummy = {
          initialize: sinon.spy(function(app) {}),
          afterAppStarted: sinon.spy()
        };
        NGL.modules.dummy2 = {
          initialize: sinon.spy(function(app) {}),
          afterAppStarted: sinon.spy()
        };
        NGL.modules.dummy3 = {
          initialize: sinon.spy(function(app) {}),
          afterAppStarted: sinon.spy()
        };
        return cmp.startAll('body', new NGL.Core());
      });
      after(function() {
        return delete NGL.modules.dummy;
      });
      it('should call the initialize method defined in the component', function() {
        NGL.modules.dummy.initialize.should.have.been.called;
        NGL.modules.dummy2.initialize.should.have.been.called;
        return NGL.modules.dummy3.initialize.should.have.been.called;
      });
      it('should give each component access to a sandbox', function() {
        NGL.modules.dummy.sandbox.should.be.an('object');
        NGL.modules.dummy2.sandbox.should.be.an('object');
        return NGL.modules.dummy3.sandbox.should.be.an('object');
      });
      it('should give each component access to a options object containing the options passed data-* attributes', function() {
        NGL.modules.dummy.options.should.be.an('object');
        NGL.modules.dummy2.options.should.be.an('object');
        return NGL.modules.dummy3.options.should.be.an('object');
      });
      it('should give access to the "el" element used to define the component', function() {
        NGL.modules.dummy.options.el.should.be.defined;
        $(NGL.modules.dummy.options.el).should.exist;
        NGL.modules.dummy2.options.el.should.be.defined;
        $(NGL.modules.dummy2.options.el).should.exist;
        NGL.modules.dummy3.options.el.should.be.defined;
        return $(NGL.modules.dummy3.options.el).should.exist;
      });
      it('should give access to each attr listed as data-NAMESPACE-* (different from data-NAMESPACE-component)', function() {
        $(NGL.modules.dummy.options.el).should.have.data('lodgesDataset');
        $(NGL.modules.dummy.options.el).should.have.data('lodgesObject');
        $(NGL.modules.dummy.options.el).should.have.data('lodgesString');
        NGL.modules.dummy.options.dataset.should.be.an('array');
        NGL.modules.dummy.options.object.should.be.an('object');
        NGL.modules.dummy.options.string.should.be.an('string');
        NGL.modules.dummy.options.length.should.be.equal(4);
        $(NGL.modules.dummy2.options.el).should.have.data('lodgesObject2');
        $(NGL.modules.dummy2.options.el).should.have.data('lodgesString2');
        NGL.modules.dummy2.options.object2.should.be.an('object');
        NGL.modules.dummy2.options.string2.should.be.an('string');
        NGL.modules.dummy2.options.length.should.be.equal(3);
        $(NGL.modules.dummy3.options.el).should.have.data('lodgesDataset');
        NGL.modules.dummy3.options.dataset.should.be.an('array');
        return NGL.modules.dummy3.options.length.should.be.equal(2);
      });
      return it('should give each component an unique sandbox', function() {
        NGL.modules.dummy.sandbox.should.not.deep.equal(NGL.modules.dummy2.sandbox);
        NGL.modules.dummy2.sandbox.should.not.deep.equal(NGL.modules.dummy3.sandbox);
        return NGL.modules.dummy3.sandbox.should.not.deep.equal(NGL.modules.dummy.sandbox);
      });
    });
  });
});



},{"../../src/core.coffee":7,"../../src/extension/components.coffee":10}],4:[function(require,module,exports){
var Base, Core, ExtManager;

Base = require('../../src/base.coffee');

ExtManager = require('../../src/extmanager.coffee');

Core = require('../../src/core.coffee');

describe('Core', function() {
  var core, ext;
  core = new NGL.Core();
  ext = {
    initialize: sinon.spy(function(app) {
      return app.sandbox.bar = 'foo';
    }),
    afterAppStarted: sinon.spy()
  };
  core.addExtension(ext);
  core.start();
  it.skip('shoul provide "platform" as the default namespace', function() {
    return core.config.namespace.should.be.equal('platform');
  });
  it('shoul provide a default logging level between 0 and 5', function() {
    return core.config.debug.logLevel.should.be.at.least(0).and.below(6);
  });
  it('should have a start Method', function() {
    return core.start.should.be.a('function');
  });
  it.skip('should have a stop Method', function() {
    return core.stop.should.be.a('function');
  });
  it('should have a addExtension Method', function() {
    return core.addExtension.should.be.a('function');
  });
  it('should throw an error if an extensions is added after the Core has been started', function() {
    var state;
    state = (function(_this) {
      return function() {
        return core.addExtension({
          initialize: function() {}
        });
      };
    })(this);
    return state.should["throw"](Error);
  });
  describe('Extension Manager', function() {
    it('should have an instance of the extension manager', function() {
      return core.extManager.should.be.an.instanceOf(ExtManager);
    });
    it('should call the initialize method for each extension', function() {
      return ext.initialize.should.have.been.called;
    });
    it('should pass the core as an argument to the initialize method for extensions', function() {
      return ext.initialize.should.have.been.calledWith(core);
    });
    return it('should call the after afterAppStarted on each extension', function() {
      return ext.afterAppStarted.should.have.been.called;
    });
  });
  return describe('Base libraries', function() {
    describe('Logger', function() {
      it('should have a Logger available', function() {
        return Base.should.have.property('log');
      });
      it('should provide a way to set logging levels', function() {
        return Base.log.setLevel.should.be.a('function');
      });
      it('should be available within sandboxes', function() {
        var sb;
        sb = core.createSandbox('test');
        return sb.should.have.property('log');
      });
      it('should provide a function to log trace messages', function() {
        return Base.log.trace.should.be.a('function');
      });
      it('should provide a function to log debug messages', function() {
        return Base.log.debug.should.be.a('function');
      });
      it('should provide a function to log info messages', function() {
        return Base.log.info.should.be.a('function');
      });
      it('should provide a function to log warning messages', function() {
        return Base.log.warn.should.be.a('function');
      });
      return it('should provide a function to log error messages', function() {
        return Base.log.error.should.be.a('function');
      });
    });
    return describe('Device Detection', function() {
      it('should have Device Detector available', function() {
        return Base.should.have.property('device');
      });
      it('should be available within sandboxes', function() {
        var sb;
        sb = core.createSandbox('test');
        return sb.should.have.property('device');
      });
      it('should provide an isMobile method', function() {
        return Base.device.isMobile.should.be.a('function');
      });
      it('should provide an isTablet method', function() {
        return Base.device.isTablet.should.be.a('function');
      });
      it('should provide an isIphone method', function() {
        return Base.device.isIphone.should.be.a('function');
      });
      it('should provide an isIpod method', function() {
        return Base.device.isIpod.should.be.a('function');
      });
      it('should provide an isIpad method', function() {
        return Base.device.isIpad.should.be.a('function');
      });
      it('should provide an isApple method', function() {
        return Base.device.isApple.should.be.a('function');
      });
      it('should provide an isAndroidPhone method', function() {
        return Base.device.isAndroidPhone.should.be.a('function');
      });
      it('should provide an isAndroidTablet method', function() {
        return Base.device.isAndroidTablet.should.be.a('function');
      });
      it('should provide an isAndroidDevice method', function() {
        return Base.device.isAndroidDevice.should.be.a('function');
      });
      it('should provide an isWindowsPhone method', function() {
        return Base.device.isWindowsPhone.should.be.a('function');
      });
      it('should provide an isWindowsTablet method', function() {
        return Base.device.isWindowsTablet.should.be.a('function');
      });
      return it('should provide an isWindowsDevice method', function() {
        return Base.device.isWindowsDevice.should.be.a('function');
      });
    });
  });
});



},{"../../src/base.coffee":6,"../../src/core.coffee":7,"../../src/extmanager.coffee":11}],5:[function(require,module,exports){
var ExtManager;

ExtManager = require('../../src/extmanager.coffee');

describe('ExtManager', function() {
  var extManager;
  extManager = new ExtManager();
  it('should be a constructor', function() {
    return ExtManager.should.be.a('function');
  });
  it('should have an Add method', function() {
    return extManager.add.should.be.a('function');
  });
  it('should have an Init method', function() {
    return extManager.init.should.be.a('function');
  });
  it('should have a getInitializedExtensions method', function() {
    return extManager.getInitializedExtensions.should.be.a('function');
  });
  return describe('adding extensions', function() {
    it('should be possible to add new extensions', function() {
      var context, ext1, ext2;
      ext1 = {
        initialize: sinon.spy(function(app) {
          return app.sandbox.foo = 'bar';
        }),
        afterAppStarted: sinon.spy()
      };
      ext2 = {
        initialize: sinon.spy(function(app) {
          return app.sandbox.bar = 'foo';
        }),
        afterAppStarted: sinon.spy()
      };
      context = {
        sandbox: {}
      };
      extManager.add(ext1);
      extManager.add(ext2);
      extManager.init(context);
      ext1.initialize.should.have.been.calledWith(context);
      return ext1.initialize.should.have.been.calledWith(context);
    });
    it('should not be possible to add the same extension twice', function() {
      var ext1, state;
      ext1 = {
        initialize: sinon.spy(function(app) {
          return app.sandbox.foo = 'bar';
        }),
        afterAppStarted: sinon.spy()
      };
      extManager.add(ext1);
      state = (function(_this) {
        return function() {
          return extManager.add(ext1);
        };
      })(this);
      return state.should["throw"](Error);
    });
    return it('should be possible to retrieve added extensions', function() {
      var extensions;
      extensions = extManager.getInitializedExtensions();
      return extensions.should.be.an('array');
    });
  });
});



},{"../../src/extmanager.coffee":11}],6:[function(require,module,exports){
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



},{"./devicedetection.coffee":8,"./logger.coffee":12}],7:[function(require,module,exports){
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



},{"./base.coffee":6,"./extension/backbone.ext.coffee":9,"./extension/components.coffee":10,"./extmanager.coffee":11}],8:[function(require,module,exports){
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



},{"ismobilejs":1}],9:[function(require,module,exports){

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



},{"./../base.coffee":6}],10:[function(require,module,exports){
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



},{"./../base.coffee":6}],11:[function(require,module,exports){
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



},{"./base.coffee":6}],12:[function(require,module,exports){
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



},{"loglevel":2}]},{},[3,4,5]);
