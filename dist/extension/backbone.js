/**
 * This extension should probably be defined at a project level, not here
*/


(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    var BaseView;
    BaseView = {
      initialize: function() {
        return console.log("initialize del BaseView");
      },
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
    };
    return {
      initialize: function(app) {
        console.log("Inicializada la componente de Backbone");
        app.sandbox.mvc = function() {
          return console.log("Inicializada la componente de MVC");
        };
        app.sandbox.mvc.BaseView = BaseView;
        /**
         * This method allows to mix a backbone view with an object
         * @author Francisco Ramini <francisco.ramini at globant.com>
         * @param  {[type]} view
         * @param  {[type]} mixin = BaseView
         * @return {[type]}
        */

        return app.sandbox.mvc.mixin = function(view, mixin) {
          var oldInitialize;
          if (mixin == null) {
            mixin = BaseView;
          }
          _.defaults(view.prototype, mixin);
          _.defaults(view.prototype.events, mixin.events);
          if (mixin.initialize !== undefined) {
            oldInitialize = view.prototype.initialize;
            return view.prototype.initialize = function() {
              mixin.initialize.apply(this);
              return oldInitialize.apply(this);
            };
          }
        };
      }
    };
  });

}).call(this);
