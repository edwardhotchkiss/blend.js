
(function() {

  var demo = new Blend({
    pushState : true
  })

  .get('/', function(request) {
    this.log('route hit: "%s"', this.getPath());
  })

  .get('/about', function(request) {
    this.log('route hit: "%s"', this.getPath());
  })

  .get('/blog/:article-title', function(request) {
    this.log('route hit: "%s"', this.getPath());
    this.log('dynamic blog title: "%s"', request['article-title']);
  })

}(window));
