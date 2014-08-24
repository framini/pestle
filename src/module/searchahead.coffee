###
# Models and Collections
###

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

RoomTypeDatum = Backbone.Model.extend

    defaults:
        abstract: "",
        leadImage: "",
        numberOfRooms: "0",
        title: ""

###*
 * Set of Lodges
 * @type {[type]}
###
Dataset = Backbone.Collection.extend

    model: LodgeDatum


RoomTypesDataset = Backbone.Collection.extend

    model: RoomTypeDatum

    url: () ->
        'http://localhost:7878' + '/rooms'

###
# Views
###

# this view is gonna be used to represent a Lodge
Lodge = Backbone.View.extend

    tagName: 'div'

    className: 'searchahead-selectedlodges'

    template: JST['lodge']

    initialize: () ->
        _.bindAll @, 'getRoomTypes'

    events: 
        'click .searchahead-removeitem': 'removeItem'

    removeItem: (e) ->
        e.preventDefault()

        # TODO: Replace this with PostalJS
        Backbone.trigger('remove', @model)

        @remove()

    getRoomTypes: () ->
        @rooms = new RoomTypesDataset()
        @rooms.on 'reset', @renderRoomTypes, @

        @rooms.fetch(
            reset: true
            data:
                itemId: @model.get('itemId')
        )

    renderRoomTypes: () ->
        # generates an array of number to render a dropdown menu
        @rooms.each( (roomType)->
            numberOfRooms = roomType.get('numberOfRooms')
            numberOfRoomsArray = (item: num for num in [0..numberOfRooms])
            roomType.set('numberOfRoomsArray', numberOfRoomsArray)
        )

        roomTypes = new RoomTypes(
            collection: @rooms
        )

        @attachItem(roomTypes.render().$el)

    attachItem: (item, elem = '.searchahead-roomtypes') ->
        @$(elem).html(item)

# this view is gonna be used to create the list
# of room types
RoomTypes = Backbone.View.extend

    template: JST['roomtypes']

    title: "Selected Lodges"

    initialize: () ->

        console.log "Room types View initialized"

        # Array to keep track of the subviews
        @subViews = []

    afterRender: () ->

        @collection.each (roomType) =>

            rt = new RoomType(model: roomType)
            @subViews.push( rt )
            @$('.searchahead-roomtypeslist').append(rt.render().$el)

        @

# This view is gonna be created for each room type
RoomType = Backbone.View.extend

    tagName: 'li'

    template: JST['roomtype']

    events: 
        'change .searchahead-roomtypes': 'updateRoomtypes'

    initialize: () ->
        console.log "Room types View initialized"

    updateRoomtypes: (e) ->
        console.log "Cambio el roomtype"
        console.log e


###*
 * This view is gonna be listening for "select" events
 * on the searchahead module and displaying the selected result/(s)
 * (i.e adds a new lodge to the list)
 * @type {[type]}
###
SearchResults = Backbone.View.extend

    tagName: 'div'

    className: 'searchahead-selectedlodgeslist'

    initialize: (options) ->

        _.bindAll @, 'renderItem',
                     'processSelection',
                     'addItem',
                     'attachItem',
                     'updateCollection',
                     '_isLodgeAdditionAllowed'

        # if single is true, the list of selected lodges would
        # be limited to one. If false (for custom trips) the user
        # could generate list composed of more than 1 lodge
        @single = options.single

        # TODO: Replace this with Postaljs
        Backbone.on('selected', @processSelection)
        Backbone.on('remove', @updateCollection)

        # collection to keep track of selected lodges
        @selectedLodges = new Dataset()

        # we only render an item when the lodge is new to
        # the collection
        @selectedLodges.on 'add', @renderItem

    processSelection: (idLodge) ->
        if @_isLodgeAdditionAllowed()
            @addItem(idLodge)

    # this method will serve as the limiter to set a maximun
    # ammount of selected lodges.
    _isLodgeAdditionAllowed: () ->
        if @single and @selectedLodges.length == 0 or not @single
            return true
        else
            return false


    updateCollection: (lodge) ->

        @selectedLodges.remove(lodge)

    addItem: (idLodge) ->

        lodgeDatum = @collection.get(idLodge)

        # we are gonna to take advantage on Backbone's default functionality
        # that prevents duplicate models to be added the same collection.
        # When a new Lodge is added to the collection, the 'add'
        # event will fire and the element is gonna be rendered
        @selectedLodges.add(lodgeDatum)

    renderItem: (lodge) ->

        s = new Lodge( model: lodge )

        s.getRoomTypes()

        # we need to ask the associated room types

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
        @sandbox.mvc.mixin(RoomType, @sandbox.mvc.BaseView)
        @sandbox.mvc.mixin(RoomTypes, @sandbox.mvc.BaseView)

        # creates a backbone model based on the parameters passed to the module
        c = new Dataset @options.dataset

        sr = new SearchResults(
            collection : c
            single: if @options.single == "no" then false else true
        )

        @render(sr)

    render: (sa) ->

        $('body').append(sa.render().$el)