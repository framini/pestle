(function() {
  (function(root, factory) {
    var _;
    _ = require('underscore');
    return module.exports = factory(root, _, exports);
  })(this, function(root, _, Base) {
    return Base.util = {
      each: $.each,
      extend: $.extend,
      uniq: _.uniq,
      _: _
    };
  });

}).call(this);
