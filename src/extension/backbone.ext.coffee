###*
 * This extension should probably be defined at a project level, not here
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Base = require('./../base.coffee')

    # Default base object that is gonna be used as the default object to be mixed
    # into other views
    BaseView =

        initialize: () ->
            Base.log.info "initialize del BaseView"

        # Method to ensure that the data is always passed to the template in the same way
        serializeData : () ->

            data = {}

            if @model
                data = @model.toJSON()
            else if @collection
                # this way we normalize the property we'll use to iterate
                # the collection inside the hbs 
                data = items : @collection.toJSON()
            
            return data

        # Ensures that events are removed before the View is removed from the DOM
        destroy : () ->

            # unbind events
            @undelegateEvents()
            @$el.removeData().unbind() if @$el

            #Remove view from DOM
            @remove()
            Backbone.View::remove.call(this)


    # returns an object with the initialize method that will be used to 
    # init the extension
    initialize : (app) ->

        Base.log.info "Inicializada la componente de Backbone"

        app.sandbox.mvc = () ->
            Base.log.info "Inicializada la componente de MVC"

        # this gives access to BaseView from the outside
        app.sandbox.mvc.BaseView = BaseView

        ###*
         * This method allows to mix a backbone view with an object
         * @author Francisco Ramini <francisco.ramini at globant.com>
         * @param  {[type]} view
         * @param  {[type]} mixin = BaseView
         * @return {[type]}
        ###
        app.sandbox.mvc.mixin = (view, mixin = BaseView) ->
            _.defaults view::, mixin
            _.defaults view::events, mixin.events

            if mixin.initialize isnt `undefined`
                oldInitialize = view::initialize
                view::initialize = ->
                    mixin.initialize.apply this
                    oldInitialize.apply this
)