(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Viewport) {
    var viewport;
    viewport = require('verge');
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

}).call(this);
