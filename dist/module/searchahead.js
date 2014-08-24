/*
# Models and Collections
*/


/**
 * Model for a Lodge
 * @type {[type]}
*/


(function() {
  var Dataset, Lodge, LodgeDatum, RoomType, RoomTypeDatum, RoomTypes, RoomTypesDataset, SearchResults;

  LodgeDatum = Backbone.Model.extend({
    idAttribute: "itemId",
    defaults: {
      "title": "",
      "nearby": "",
      "leadImage": "",
      "path": ""
    }
  });

  RoomTypeDatum = Backbone.Model.extend({
    defaults: {
      abstract: "",
      leadImage: "",
      numberOfRooms: "0",
      title: ""
    }
  });

  /**
   * Set of Lodges
   * @type {[type]}
  */


  Dataset = Backbone.Collection.extend({
    model: LodgeDatum
  });

  RoomTypesDataset = Backbone.Collection.extend({
    model: RoomTypeDatum,
    url: function() {
      return 'http://localhost:7878' + '/rooms';
    }
  });

  /*
  # Views
  */


  Lodge = Backbone.View.extend({
    tagName: 'div',
    className: 'searchahead-selectedlodges',
    template: JST['lodge'],
    initialize: function() {
      return _.bindAll(this, 'getRoomTypes');
    },
    events: {
      'click .searchahead-removeitem': 'removeItem'
    },
    removeItem: function(e) {
      e.preventDefault();
      Backbone.trigger('remove', this.model);
      return this.remove();
    },
    getRoomTypes: function() {
      this.rooms = new RoomTypesDataset();
      this.rooms.on('reset', this.renderRoomTypes, this);
      return this.rooms.fetch({
        reset: true,
        data: {
          itemId: this.model.get('itemId')
        }
      });
    },
    renderRoomTypes: function() {
      var roomTypes;
      this.rooms.each(function(roomType) {
        var num, numberOfRooms, numberOfRoomsArray;
        numberOfRooms = roomType.get('numberOfRooms');
        numberOfRoomsArray = (function() {
          var _i, _results;
          _results = [];
          for (num = _i = 0; 0 <= numberOfRooms ? _i <= numberOfRooms : _i >= numberOfRooms; num = 0 <= numberOfRooms ? ++_i : --_i) {
            _results.push({
              item: num
            });
          }
          return _results;
        })();
        return roomType.set('numberOfRoomsArray', numberOfRoomsArray);
      });
      roomTypes = new RoomTypes({
        collection: this.rooms
      });
      return this.attachItem(roomTypes.render().$el);
    },
    attachItem: function(item, elem) {
      if (elem == null) {
        elem = '.searchahead-roomtypes';
      }
      return this.$(elem).html(item);
    }
  });

  RoomTypes = Backbone.View.extend({
    template: JST['roomtypes'],
    title: "Selected Lodges",
    initialize: function() {
      console.log("Room types View initialized");
      return this.subViews = [];
    },
    afterRender: function() {
      var _this = this;
      this.collection.each(function(roomType) {
        var rt;
        rt = new RoomType({
          model: roomType
        });
        _this.subViews.push(rt);
        return _this.$('.searchahead-roomtypeslist').append(rt.render().$el);
      });
      return this;
    }
  });

  RoomType = Backbone.View.extend({
    tagName: 'li',
    template: JST['roomtype'],
    events: {
      'change .searchahead-roomtypes': 'updateRoomtypes'
    },
    initialize: function() {
      return console.log("Room types View initialized");
    },
    updateRoomtypes: function(e) {
      console.log("Cambio el roomtype");
      return console.log(e);
    }
  });

  /**
   * This view is gonna be listening for "select" events
   * on the searchahead module and displaying the selected result/(s)
   * (i.e adds a new lodge to the list)
   * @type {[type]}
  */


  SearchResults = Backbone.View.extend({
    tagName: 'div',
    className: 'searchahead-selectedlodgeslist',
    initialize: function() {
      _.bindAll(this, 'renderItem', 'processSelection', 'addItem', 'attachItem', 'updateCollection');
      Backbone.on('selected', this.processSelection);
      Backbone.on('remove', this.updateCollection);
      this.selectedLodges = new Dataset();
      return this.selectedLodges.on('add', this.renderItem);
    },
    processSelection: function(idLodge) {
      return this.addItem(idLodge);
    },
    updateCollection: function(lodge) {
      return this.selectedLodges.remove(lodge);
    },
    addItem: function(idLodge) {
      var lodgeDatum;
      lodgeDatum = this.collection.get(idLodge);
      return this.selectedLodges.add(lodgeDatum);
    },
    renderItem: function(lodge) {
      var s;
      s = new Lodge({
        model: lodge
      });
      s.getRoomTypes();
      return this.attachItem(s);
    },
    attachItem: function(item) {
      return this.$el.append(item.render().$el);
    }
  });

  NGL.modules.Searchahead = {
    initialize: function() {
      var c, sr;
      this.sandbox.mvc.mixin(Lodge, this.sandbox.mvc.BaseView);
      this.sandbox.mvc.mixin(RoomType, this.sandbox.mvc.BaseView);
      this.sandbox.mvc.mixin(RoomTypes, this.sandbox.mvc.BaseView);
      c = new Dataset(this.options.dataset);
      sr = new SearchResults({
        collection: c
      });
      return this.render(sr);
    },
    render: function(sa) {
      return $('body').append(sa.render().$el);
    }
  };

}).call(this);
