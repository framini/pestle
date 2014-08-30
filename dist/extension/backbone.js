/**
 * This extension should probably be defined at a project level, not here
*/


(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    var Base, BaseView, Renderer;
    Base = require('./../base.coffee');
    Renderer = {
      render: function(template, data) {
        if (!template) {
          Base.log.error("The template passed to the Renderer is not defined");
          return;
        }
        if (_.isFunction(template)) {
          return template(data);
        }
      }
    };
    BaseView = {
      initialize: function() {
        Base.log.info("initialize del BaseView");
        _.bindAll(this, 'render', 'renderWrapper');
        if (Base.util._.isFunction(this.beforeRender)) {
          _.bindAll(this, 'beforeRender');
        }
        if (Base.util._.isFunction(this.afterRender)) {
          _.bindAll(this, 'afterRender');
        }
        return this.render = Base.util._.wrap(this.render, this.renderWrapper);
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
        if (this.title) {
          data.title = this.title;
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
      },
      renderWrapper: function(originalRender) {
        if (Base.util._.isFunction(this.beforeRender)) {
          this.beforeRender();
        }
        if (Base.util._.isFunction(originalRender)) {
          originalRender();
        }
        if (Base.util._.isFunction(this.afterRender)) {
          this.afterRender();
        }
        return this;
      },
      render: function() {
        var data, html, tpl;
        if (this.model && this.model.get('template')) {
          tpl = JST[this.model.get('template')];
        } else {
          tpl = this.template;
        }
        data = this.serializeData();
        html = Renderer.render(tpl, data);
        this.attachElContent(html);
        return this;
      },
      attachElContent: function(html) {
        this.$el.append(html);
        return this;
      }
    };
    return {
      initialize: function(app) {
        Base.log.info("Inicializada la componente de Backbone");
        app.sandbox.mvc = function() {
          return Base.log.info("Inicializada la componente de MVC");
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
          if (mixin.initialize !== 'undefined') {
            oldInitialize = view.prototype.initialize;
          }
          _.extend(view.prototype, mixin);
          _.defaults(view.prototype.events, mixin.events);
          if (oldInitialize) {
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
