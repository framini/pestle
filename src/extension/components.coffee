((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Base = require('./../base.coffee')

    class Component

        ###*
         * [startAll description]
         * @author Francisco Ramini <francisco.ramini at globant.com>
         * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
         * @return {[type]}
        ###
        @startAll: (selector = 'body') ->
            components = Component.parseList(selector)

            console.log "ESTAS SERIAN LAS COMPONENTES PARSEADAS"
            console.log components

            # TODO: Proximo paso inicializar las componentes

        @parseList: (selector) ->

            list = []

            # here we could define the default data-*a attributes
            # defined to define a component
            # TODO: Make the namespace "lodges" configurable
            namespace = "lodges"
            cssSelector = ["[data-lodges-component]"]


            # TODO: Access these DOM functionality through Base
            $(selector).find(cssSelector.join(',')).each (i, comp) ->

                # options will hold all the data-* related to the component
                options = Component.parseComponentOptions(@, "lodges");

                list.push({ name: options.name, options: options })

            return list

        @parseComponentOptions: (el, namespace, opts) ->
            # TODO: access this utils function through Base
            options = _.clone(opts || {})
            options.el = el

            # TODO: access this DOM function through Base
            data = $(el).data()
            name = ''

            # TODO: access this utils function through Base
            $.each data, (k, v) ->

                # removes the namespace
                k = k.replace(new RegExp("^" + namespace), "")

                # decamelize the option name
                k = k.charAt(0).toLowerCase() + k.slice(1);

                # if the key is different from "component" it means it is
                # an option value
                if k != "component"
                    options[k] = v
                else
                    name = v

            # build ad return the option object
            Component.buildOptionsObject(name, options)

        
        @buildOptionsObject: (name, options) ->

            options.name = name

            return options



    ##
    # returns an object with the initialize method that will init the extension
    ##

    # constructor
    initialize : (app) ->

        console.log "Inicializada la componente de Componentes"

        app.sandbox.startComponents = (list) ->

            Component.startAll()


    # this method will be called once all the extensions have been loaded
    afterAppStarted: (app) ->

        console.log "Llamando al afterAppStarted"

        app.sandbox.startComponents()
)