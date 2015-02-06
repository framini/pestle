((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Base   = require('./../base.coffee')
    Module = require('./../util/module.coffee')

    class Component

        # object to store initialized components
        @initializedComponents : {}

        ###*
         * startAll method
         * This method will look for components to start within the passed selector
         * and call their .initialize() method
         * @author Francisco Ramini <francisco.ramini at globant.com>
         * @param  {[type]} selector = 'body'. CSS selector to tell the app where to look for components
         * @return {[type]}
        ###
        @startAll: (selector = 'body', app, namespace = Pestle.modules) ->

            components = Component.parse(selector, app.config.namespace)

            cmpclone = Base.util.clone components

            Base.log.info "Parsed components"
            Base.log.debug cmpclone

            # added to keep namespace.NAME = DEFINITION sintax. This will extend
            # the object definition with the Module class
            # this might need to be removed
            unless Base.util.isEmpty components
                Base.util.each namespace, (definition, name) ->
                    unless Base.util.isFunction definition
                        Module.extend name, definition

            # grab a reference of all the module defined using the Module.add
            # method.
            Base.util.extend namespace, Pestle.Module.list

            Component.instantiate(components, app)

            return {
                all: Component.initializedComponents
                new: cmpclone
            }

        ###*
         * the parse method will look for components defined using
         * the configured namespace and living within the passed
         * CSS selector
         * @author Francisco Ramini <framini at gmail.com>
         * @param  {[type]} selector  [description]
         * @param  {[type]} namespace [description]
         * @return {[type]}           [description]
        ###
        @parse: (selector, namespace) ->
            # array to store parsed components
            list = []

            # if an array is passed, use it as it is
            if Base.util.isArray namespace
                namespaces = namespace
            # if a string is passed as parameter, convert it to an array
            else if Base.util.isString namespace
                namespaces = namespace.split ','

            # array to store the composed css selector that will look up for
            # component definitions
            cssSelectors = []

            # iterates over the namespace array and create the needed css selectors
            Base.util.each namespaces, (ns, i) ->
                # if a new namespace has been provided lets add it to the list
                cssSelectors.push "[data-" + ns + "-component]"

            # TODO: Access these DOM functionality through Base
            $(selector).find(cssSelectors.join(',')).each (i, comp) ->

                # if the comp already has the pestle-guid attached, it means
                # it was already started, so we'll only look for unnitialized
                # components here
                unless $(comp).data('pestle-guid')

                    ns = do () ->
                        namespace = ""
                        Base.util.each namespaces, (ns, i) ->
                            # This way we obtain the namespace of the current component
                            if $(comp).data(ns + "-component")
                                namespace = ns

                        return namespace

                    # options will hold all the data-* attributes related to the component
                    options = Component.parseComponentOptions(@, ns)

                    list.push({ name: options.name, options: options })

            return list

        # this method will be in charge of parsing all the data-* attributes
        # defined in the its $el markup and placing them in a object
        @parseComponentOptions: (el, namespace, opts) ->
            options = Base.util.clone(opts || {})
            options.el = el

            # TODO: access this DOM function through Base
            data = $(el).data()
            name = ''
            length = 0

            Base.util.each data, (v, k) ->

                # removes the namespace
                k = k.replace(new RegExp("^" + namespace), "")

                # decamelize the option name
                k = k.charAt(0).toLowerCase() + k.slice(1)

                # if the key is different from "component" it means it is
                # an option value
                if k != "component"
                    options[k] = v
                    length++
                else
                    name = v

            # add one because we've added 'el' automatically as an extra option
            options.length = length + 1

            # build ad return the option object
            Component.buildOptionsObject(name, options)


        @buildOptionsObject: (name, options) ->

            options.name = name

            return options

        @instantiate: (components, app) ->

            if components.length > 0

                m = components.shift()

                # Check if the modules are defined using the modules namespace
                # TODO: Provide an alternate way to define the
                # global object that is gonna hold the module definition
                if not Base.util.isEmpty(Pestle.modules) and Pestle.modules[m.name] and m.options
                    mod = Pestle.modules[m.name]

                    # create a new sandbox for this module
                    sb = app.createSandbox(m.name)

                    # generates an unique guid for the module
                    m.options.guid = Base.util.uniqueId(m.name + "_")

                    m.options.__defaults__ = app.config.component[m.name]

                    # inject the sandbox and the options in the module proto
                    # Base.util.extend mod, sandbox : sb, options: m.options
                    modx = new mod(sandbox : sb, options: m.options)

                    # init the module
                    modx.initialize()

                    # store a reference of the generated guid on the el
                    $(m.options.el).data 'pestle-guid', m.options.guid

                    # saves a reference of the initialized module
                    Component.initializedComponents[ m.options.guid ] = modx

                Component.instantiate(components, app)


    ##
    # returns an object with the initialize method that will init the extension
    ##

    # constructor
    initialize : (app) ->

        Base.log.info "[ext] Component extension initialized"

        initializedComponents = {}

        app.sandbox.startComponents = (selector, app) ->

            initializedComponents = Component.startAll(selector, app)

        app.sandbox.getInitializedComponents = () ->

            return initializedComponents.all

        app.sandbox.getLastestInitializedComponents = () ->

            return initializedComponents.new


    # this method will be called once all the extensions have been loaded
    afterAppStarted: (selector, app) ->

        Base.log.info "Calling startComponents from afterAppStarted"
        s = if selector then selector else null
        app.sandbox.startComponents(s, app)

    name: 'Component Extension'

    # this property will be used for testing purposes
    # to validate the Component class in isolation
    classes : Component

    # The exposed key name that could be used to pass options
    # to the extension.
    # This is gonna be used when instantiating the Core object.
    # Note: By convention we'll use the filename
    optionKey: 'components'
)
