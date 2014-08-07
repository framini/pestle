(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Base) {
    var _;
    _ = require('underscore');
    Base.util = {
      each: $.each,
      extend: $.extend,
      uniq: _.uniq,
      _: _
    };
    return Base;
  });

}).call(this);
