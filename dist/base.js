(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Base) {
    var _;
    _ = require('underscore');
    return Base.util = {
      each: $.each,
      extend: $.extend,
      uniq: _.uniq,
      _: _
    };
  });

}).call(this);
