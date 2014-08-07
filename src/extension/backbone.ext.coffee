((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    # Default view that is gonna serve as the default view to every component
    # This view should extended instead of the Backbone.View
    BaseView = Backbone.View.extend

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
            Backbone.View.prototype.remove.call(this)


    # returns an object with the initialize method that will init the extension
    initialize : (app) ->

        console.log "Inicializada la componente de Backbone"

        app.sandbox.mvc = () ->
            console.log "Inicializada la componente de MVC"

        app.sandbox.mvc.BaseView = BaseView
)