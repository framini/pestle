###*
 * This will provide the functionality to define Modules
 * and provide a way to extend them
 * @author Francisco Ramini <framini at gmail.com>
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Module) ->

    Base = require('../base.coffee')

    # this will serve as the base class for a Module
    class Module
        constructor: (opt) ->
            @sandbox = opt.sandbox
            @options = opt.options
            @setElement()


    # this class will expose static methods to add, extend and
    # get the list of added modules
    class Modules

        # this will hold the list of added modules
        @list : {}

        # just an alias for extend
        @add : (name, definition) ->
            @extend(name, definition, Module)

        ###*
         * this will allows us to simplify and have more control
         * over adding/defining modules
         * @author Francisco Ramini <framini at gmail.com>
         * @param  {[String]} name
         * @param  {[Object]} definition
         * @param  {[String/Function]} BaseClass
        ###
        @extend : (name, definition, BaseClass) ->
            if Base.util.isString(name) and Base.util.isObject(definition)
                # if no BaseClass is passed, by default we'll use the Module class
                unless BaseClass
                    BaseClass = Module
                else
                    # if we are passing the BaseClass as a string, it means that class
                    # should have been added previously, so we'll look under the list obj
                    if Base.util.isString BaseClass
                        # check if the class has been already added
                        bc = @list[BaseClass]
                        # if the definition exists, lets assign it to BaseClass
                        if bc
                            BaseClass = bc
                        # if not, lets throw an error
                        else
                            msg = '[Module/ '+ name +' ]: is trying to extend [' + BaseClass + '] which does not exist'
                            Base.log.error msg
                            throw new Error(msg)
                    # if it is a function, we'll use it directly
                    # TODO: do some checking before trying to use it directly
                    else if Base.util.isFunction BaseClass
                        BaseClass = BaseClass

                extendedClass = extend.call BaseClass, definition
                # we'll only try to add this definition in case
                unless Base.util.has @list, name
                    # extends the current definition with the Module class
                    extendedDefinition = extend.call BaseClass, definition
                    # store the reference for later usage
                    @list[name] = extendedDefinition

                    return extendedDefinition
                else
                    # inform the devs that someone is trying to add a module's
                    # definition that has been previously added
                    msg = '[Component:' + name + '] have already been defined' 
                    Base.log.warn msg

                    return @


    Base.util.extend Module::, Base.Events,

        # this has to be ovewritten by the module definition
        initialize: () ->
            msg = '[Component/' + @options.name + ']:' + 'Doesn\'t have an initialize method defined'
            Base.log.warn msg

        setElement: () ->
            @undelegateEvents()

            @el = @options.el
            @$el = $(@el)

            @delegateEvents()

        delegateEvents: (events) ->
            # regex to split the events key (separates the event from the selector)
            delegateEventSplitter = /^(\S+)\s*(.*)$/

            # if the events object is not defined or passed as a parameter
            # there is nothing to do here
            return    unless events or (events = Base.util.result(@, "events"))
            # before trying to attach new events, lets remove any previous
            # attached event
            @undelegateEvents()

            for key of events
                # grab the method name
                method = events[key]
                # grab the method's definition
                method = @[events[key]]    unless Base.util.isFunction(method)
                continue    unless method
                match = key.match(delegateEventSplitter)
                @delegate match[1], match[2], Base.util.bind(method, @)

            return @

        delegate: (eventName, selector, listener) ->
            @$el.on eventName + ".pestleEvent" + @options.guid, selector, listener
            return @

        undelegateEvents: () ->
            @$el.off('.pestleEvent' + @options.guid)    if @$el
            return @

        # by default, it will remove eventlisteners and remove the
        # $el from the DOM
        stop: () ->
            @undelegateEvents()
            @$el.remove() if @$el

    # Helpers
    extend = (protoProps, staticProps) ->
        parent = @

        # The constructor function for the new subclass is either defined by you
        # (the "constructor" property in your `extend` definition), or defaulted
        # by us to simply call the parent's constructor
        if protoProps and Base.util.has(protoProps, "constructor")
            child = protoProps.constructor
        else
            child = ->
                parent.apply @, arguments

        # Add static properties to the constructor function, if supplied.
        Base.util.extend child, parent, staticProps

        # Set the prototype chain to inherit from `parent`, without calling
        # `parent`'s constructor function.
        Surrogate = ->
            @constructor = child
            return

        Surrogate:: = parent::
        child:: = new Surrogate

        # Add prototype properties (instance properties) to the subclass,
        # if supplied.
        Base.util.extend child::, protoProps    if protoProps

        # store a reference to the initialize method so it can be called
        # from its childs
        child::_super_ = parent::initialize

        return child

    # Store a reference to the base class for modules
    Modules.Module = Module

    return Modules
)