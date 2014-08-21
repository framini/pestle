(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Base) {
    Base.log = require('loglevel');
    Base.util = {
      each: $.each,
      extend: $.extend,
      uniq: root._.uniq,
      _: root._
    };
    return Base;
  });

}).call(this);