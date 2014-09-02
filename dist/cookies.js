(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Cookies) {
    var cookies;
    cookies = require('cookies-js');
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

}).call(this);
