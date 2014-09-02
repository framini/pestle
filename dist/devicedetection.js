(function() {
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

}).call(this);
