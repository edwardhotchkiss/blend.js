
(function() {

  var demo = new Blend({
    pushState : true
  })

  .get('/', function() {
    this.log('hit: "%s"', this.getPath());
  })

  .get('/about', function() {
    this.log('hit: "%s"', this.getPath());
  })

  .get('/blog/:title', function(title) {
    this.log('hit :/blog/ title: "%s"', title);
  })

  .get('/blog/:category/:title', function(category, title) {
    this.log('hit /blog/ category: "%s", title: "%s"', category, title);
  });

}(window));
