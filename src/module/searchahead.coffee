Lodge = Backbone.View.extend

    template: JST['lodge']

    initialize: () ->


###*
 * Model for a Lodge
 * @type {[type]}
###
LodgeDatum = Backbone.Model.extend
    idAttribute: "itemId"
    defaults:
        "title": ""
        "nearby": ""
        "leadImage": ""
        "path": ""

###*
 * Set of Lodges
 * @type {[type]}
###
Dataset = Backbone.Collection.extend
    model: LodgeDatum


###*
 * This view is gonna be listening for "select" events
 * on the searchahead module and displaying the selected result/(s)
 * @type {[type]}
###
SearchResults = Backbone.View.extend

    initialize: () ->

        _.bindAll @, "renderItem",
                     "processSelection",
                     "attachItem"

        # TODO: Replace this with Postaljs
        Backbone.on('selected', @processSelection)

    processSelection: (idLodge) ->

        @renderItem(idLodge)

    renderItem: (idLodge) ->

        lodgeDatum = @collection.get(idLodge)

        if lodgeDatum
            s = new Lodge( model: lodgeDatum )
            @attachItem(s)

    attachItem: (item) ->

        $('body').append(item.render().$el)



##
# returns an object with the initialize method that will init the module
##

NGL.modules.Searchahead =

    # constructor
    initialize : () ->

        # merge our view with the default "view" object that will
        # abstract some common behavior to all views
        @sandbox.mvc.mixin(Lodge, @sandbox.mvc.BaseView)

        # creates a backbone model based on the parameters passed to the module
        c = new Dataset @options.dataset

        sr = new SearchResults(collection : c)

        # @render(sa)

    render: (sa) ->

        # $('body').append(sa.render().$el)