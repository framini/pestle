(function() {
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

}).call(this);
