(function() {
  (function(root, factory) {
    return module.exports = factory(root, {});
  })(window, function(root, Ext) {
    var Base, Component;
    Base = require('./../base.coffee');
    Component = (function() {
      function Component() {}

      /**
       * [startAll description]
       * @author Francisco Ramini <francisco.ramini at globant.com>
       * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
       * @return {[type]}
      */


      Component.startAll = function(selector, app) {
        var components;
        if (selector == null) {
          selector = 'body';
        }
        components = Component.parseList(selector, app.config.namespace);
        Base.log.info("Parsed components");
        Base.log.debug(components);
        return Component.instantiate(components, app);
      };

      Component.parseList = function(selector, namespace) {
        var cssSelectors, list, namespaces;
        list = [];
        namespaces = ['platform'];
        if (namespace !== 'platform') {
          namespaces.push(namespace);
        }
        cssSelectors = [];
        _.each(namespaces, function(ns, i) {
          return cssSelectors.push("[data-" + ns + "-component]");
        });
        $(selector).find(cssSelectors.join(',')).each(function(i, comp) {
          var ns, options;
          ns = (function() {
            namespace = "";
            _.each(namespaces, function(ns, i) {
              if ($(comp).data(ns + "-component")) {
                return namespace = ns;
              }
            });
            return namespace;
          })();
          options = Component.parseComponentOptions(this, ns);
          return list.push({
            name: options.name,
            options: options
          });
        });
        return list;
      };

      Component.parseComponentOptions = function(el, namespace, opts) {
        var data, length, name, options;
        options = _.clone(opts || {});
        options.el = el;
        data = $(el).data();
        name = '';
        length = 0;
        $.each(data, function(k, v) {
          k = k.replace(new RegExp("^" + namespace), "");
          k = k.charAt(0).toLowerCase() + k.slice(1);
          if (k !== "component") {
            options[k] = v;
            return length++;
          } else {
            return name = v;
          }
        });
        options.length = length + 1;
        return Component.buildOptionsObject(name, options);
      };

      Component.buildOptionsObject = function(name, options) {
        options.name = name;
        return options;
      };

      Component.instantiate = function(components, app) {
        return _.each(components, function(m, i) {
          var mod, sb;
          if (!_.isEmpty(NGL.modules) && NGL.modules[m.name] && m.options) {
            mod = NGL.modules[m.name];
            sb = app.createSandbox(m.name);
            _.extend(mod, {
              sandbox: sb,
              options: m.options
            });
            return mod.initialize();
          }
        });
      };

      return Component;

    })();
    return {
      initialize: function(app) {
        Base.log.info("Inicializada la componente de Componentes");
        return app.sandbox.startComponents = function(list, app) {
          return Component.startAll(list, app);
        };
      },
      afterAppStarted: function(app) {
        Base.log.info("Llamando al afterAppStarted");
        return app.sandbox.startComponents(null, app);
      },
      name: 'Component Extension',
      classes: Component
    };
  });

}).call(this);
