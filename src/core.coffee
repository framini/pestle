((root, factory) ->

    # Definition for AMD
    if typeof define is "function" and define.amd
        define [
            "underscore"
            "backbone"
            "jquery"
            "exports"
        ], (_, backbone, $, exports) ->

            factory(root, _, backbone, $, exports)


    # Definition as a global variable in case we dont use requirejs 
    else
        root.NGL = factory(root, root._, root.Backbone, root.$, {})

)(this, (root, _, Backbone, $, NGL) ->

    # current version of the library
    NGL.version = "0.0.1"

    # Default namespaces
    NGL.view = NGL.view or {}
    NGL.model = NGL.model or {}
    NGL.collection = NGL.collection or {}

    # we'll use the NGL object as the global Event bus
    _.extend NGL, Backbone.Events

    # Default view that is gonna serve as the default view to every component
    # This view should extended instead of the Backbone.View
    NGL.ViewItem = Backbone.View.extend

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


    return NGL
)