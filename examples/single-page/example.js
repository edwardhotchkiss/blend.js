
$(function() {

  var demo = new Blend();

  demo.get('/', function() {
    this.log('index route hit ("/")');
  });

});
