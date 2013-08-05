
(function() {

  var demo = new Blend({
    pushState : true
  })

  .get('/', function() {
    this.log('route hit: "%s"', this.getPath());
  })

  .get('/about', function() {
    this.log('route hit: "%s"', this.getPath());
  })

  .get('/blog/:title', function(title) {
    this.log('route hit: "%s"', this.getPath());
    this.log('dynamic blog title: "%s"', title);
  })

  .get('/blog/:category/:title', function(category, title) {
    this.log('route hit: "%s"', this.getPath());
    this.log('dynamic /blog/ :category "%s", :title: "%s"', category, title);
  })

}(window));
