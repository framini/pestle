(function() {
  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      return define(["../core", "exports"], function(Core, exports) {
        return factory(root, NGL, exports);
      });
    } else {
      return factory(root, root.NGL, {});
    }
  })(this, function(root, NGL, Hero) {
    NGL.Hero = function() {
      return console.log("SOY UN HERO");
    };
    return NGL;
  });

}).call(this);
