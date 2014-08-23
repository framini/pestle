(function() {
  var Dataset, Lodge, LodgeDatum, SearchResults;

  Lodge = Backbone.View.extend({
    template: JST['lodge'],
    initialize: function() {}
  });

  /**
   * Model for a Lodge
   * @type {[type]}
  */


  LodgeDatum = Backbone.Model.extend({
    idAttribute: "itemId",
    defaults: {
      "title": "",
      "nearby": "",
      "leadImage": "",
      "path": ""
    }
  });

  /**
   * Set of Lodges
   * @type {[type]}
  */


  Dataset = Backbone.Collection.extend({
    model: LodgeDatum
  });

  /**
   * This view is gonna be listening for "select" events
   * on the searchahead module and displaying the selected result/(s)
   * @type {[type]}
  */


  SearchResults = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "renderItem", "processSelection", "attachItem");
      return Backbone.on('selected', this.processSelection);
    },
    processSelection: function(idLodge) {
      return this.renderItem(idLodge);
    },
    renderItem: function(idLodge) {
      var lodgeDatum, s;
      lodgeDatum = this.collection.get(idLodge);
      if (lodgeDatum) {
        s = new Lodge({
          model: lodgeDatum
        });
        return this.attachItem(s);
      }
    },
    attachItem: function(item) {
      return $('body').append(item.render().$el);
    }
  });

  NGL.modules.Searchahead = {
    initialize: function() {
      var c, sr;
      this.sandbox.mvc.mixin(Lodge, this.sandbox.mvc.BaseView);
      c = new Dataset(this.options.dataset);
      return sr = new SearchResults({
        collection: c
      });
    },
    render: function(sa) {}
  };

}).call(this);
