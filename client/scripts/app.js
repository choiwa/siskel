var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    (this.get('like') === true) ? this.set('like', false) : this.set('like', true);
    // this.on('change', this.collection.sortByField('like'));
    // this.render();
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() { 
    this.on('change:like', function(e) {
      this.sort();
    })
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    // let ordered = {};
    // Object.keys(this).sort().forEach(function(field) {
    //   ordered[field] = this[field];
    // })
    this.sort((a,b) => {
      if (this.models[a].attributes.field < this.models[b].attributes.field) {
        return -1;
      }
      if (this.models[a].attributes.field > this.models[b].attributes.field) {
        return 1;
      }
      return 0;
    });
  }
    //   this.model.on('change', function(e) {
    //   this.render()
    // }, this);
});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change', function(e) {
      this.render()
    }, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function(e) {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sort', function(e) {
      this.render()
    }, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
