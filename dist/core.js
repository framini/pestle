(function() {
  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      return define(["underscore", "backbone", "jquery", "exports"], function(_, backbone, $, exports) {
        return factory(root, _, backbone, $, exports);
      });
    } else {
      return root.NGL = factory(root, root._, root.Backbone, root.$, {});
    }
  })(this, function(root, _, Backbone, $, NGL) {
    NGL.version = "0.0.1";
    NGL.view = NGL.view || {};
    NGL.model = NGL.model || {};
    NGL.collection = NGL.collection || {};
    _.extend(NGL, Backbone.Events);
    NGL.ViewItem = Backbone.View.extend({
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
        return data;
      },
      destroy: function() {
        this.undelegateEvents();
        if (this.$el) {
          this.$el.removeData().unbind();
        }
        this.remove();
        return Backbone.View.prototype.remove.call(this);
      }
    });
    return NGL;
  });

}).call(this);
