(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    var BaseView;
    BaseView = Backbone.View.extend({
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
    return {
      initialize: function(app) {
        app.sandbox.mvc = function() {
          return console.log("Inicializada la componente de MVC");
        };
        return app.sandbox.mvc.BaseView = BaseView;
      }
    };
  });

}).call(this);
