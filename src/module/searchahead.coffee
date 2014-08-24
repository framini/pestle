Lodge = Backbone.View.extend

    tagName: 'div'

    className: 'searchahead-selectedlodges'

    template: JST['lodge']

    initialize: () ->

    events: 
        'click .searchahead-removeitem': 'removeItem'

    removeItem: (e) ->
        e.preventDefault()

        # TODO: Replace this with PostalJS
        Backbone.trigger('remove', @model)

        @remove()


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

    tagName: 'div'

    className: 'searchahead-selectedlodgeslist'

    initialize: () ->

        _.bindAll @, 'renderItem',
                     'processSelection',
                     'addItem',
                     'attachItem',
                     'updateCollection'

        # TODO: Replace this with Postaljs
        Backbone.on('selected', @processSelection)
        Backbone.on('remove', @updateCollection)

        # collection to keep track of selected lodges
        @selectedLodges = new Dataset()

        # we only render an item when the lodge is new to
        # the collection
        @selectedLodges.on 'add', @renderItem

    processSelection: (idLodge) ->

        @addItem(idLodge)

    updateCollection: (lodge) ->

        @selectedLodges.remove(lodge)

    addItem: (idLodge) ->

        lodgeDatum = @collection.get(idLodge)

        # we are gonna take advantage on Backbones functionality
        # that prevents duplicate models on the same collection.
        # When a new Lodge is added to the collection, the 'add'
        # event will fire and the element is gonna be rendered
        @selectedLodges.add(lodgeDatum)

    renderItem: (lodge) ->

        s = new Lodge( model: lodge )
        @attachItem(s)

    attachItem: (item) ->

        @$el.append(item.render().$el)



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

        @render(sr)

    render: (sa) ->

        $('body').append(sa.render().$el)