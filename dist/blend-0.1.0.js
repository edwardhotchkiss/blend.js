
/**
 * @library blend.js
 * @author Edward Hotchkiss <edward@candidblend.la>
 * @description HTML5 Router with Minimal MV(.*?) Architecture
 * @license MIT
 */

wrapper('Blend', ['Logger'], function() {

  'use strict';

  /**
   * @constructor
   */

  var Blend = function Blend(params) {
    this.params = params || {};
    this.routes = [];
    this.baseURL = this.params.baseURL || window.location;
    this.hasPushstate = !!(window.history && window.history.pushState);
    this.partials = {};
    this.init(params);
    $(document).ready(function() {
      this.DOMReady();
    }.bind(this));
  };

  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };

  /**
   * @public DOMReady
   */

  Blend.prototype.DOMReady = function() {
    var _self = this;
    // initialize routing
    _self.navigate(_self.getPath());
    // attach all anchors
    $('a').on('click', function (evt) {
      var pathname = evt.target.pathname;
      if (pathname !== undefined) {
        evt.preventDefault();
        _self.navigate(pathname);
      }
    });
  };

  /**
   * @private Route
   * @param {String} path Pathname to route
   * @param {Function} callback Function to execute upon route match
   * @return {Object} route Object containing the routes path and callback method
   */

  function Route(path, callback) {
    path = (path instanceof RegExp) ? path : new RegExp(path, 'i');
    callback = callback || function () {};
    return {
      path     : path,
      callback : callback
    };
  }

  /**
   * @public getEventPathname
   * @description get path to navigate to
   * @param {Object} evt passed event object
   */

  Blend.prototype.getEventPathname = function(evt) {
    return evt.target.pathname || '/';
  };

  /**
   * @public getHash
   * @description get current window hash
   */

  Blend.prototype.getHash = function() {
    var hash = '/' + window.location.hash;
    return hash;
  };

  /**
   * @public setHash
   * @description set window hash
   * @param {String} path hash to set as pathname
   */

  Blend.prototype.setHash = function(path) {
    if (path === '/') {
      window.location.hash = '/';
    } else {
      window.location.hash = '/' + path;
    }
  };
  
  /**
   * @public getPath
   * @description get current /path
   */

  Blend.prototype.getPath = function() {
    return window.location.pathname;
  };

  /**
   * @public getRoute
   * @description Get Route Object based on pathname
   */

  Blend.prototype.getRoute = function(path) {
    var _self = this, matches = [], route, key;
    if (_self.hasPushstate !== true) {
      path = '/' + path;
    }
    for (key in _self.routes) {
      if (_self.routes.hasOwnProperty(key)) {
        route = _self.routes[key];
        if (route.path.test(path)) {
          matches.push(route);
        }
      }
    }
    if (matches) {
      return (matches.length > 1) ? matches.pop() : matches[0];
    }
  };
  
  /**
   * @public navigate
   * @description Navigate to a specified path (HTML5 pushState)
   */

  Blend.prototype.navigate = function(path) {
    var _self = this, state = this.getRoute(path);
    if (state !== undefined) {
      // HTML5
      if (_self.hasPushstate) {
        window.history.pushState(null, document.title, path);
        state.callback();
      } else {
        _self.setHash(path);
        state.callback();
      }
    } else {
      // 404
      _self.log('Error 404.');
    }
  };

  /**
   * @public get
   * @param {String} path Path to route for a GET
   * @param {Function} callback Method to execute on pathname match
   */

  Blend.prototype.get = function(path, callback) {
    this.routes.push(new Route(path, callback));
  };

  /*! ---- CONTROLLER ---- */

  /**
   * @private Controller
   * @description Setup an OOP blend.js controller
   * @return {Object} controller blend.js controller
   */

  function Controller(methods) {
    var _self = this, controller = {}, key;
    // attach iterated properties
    for (key in methods) {
      if (methods.hasOwnProperty(key)) {
        controller[key] = methods[key];
      }
    }
    return controller;
  }

  /**
   * @public Controller
   * @description Setup an OOP blend.js controller
   * @return {Object} _Controller blend.js controller
   */

  Blend.prototype.Controller = function (methods) {
    var _self = this, controller;
    if (typeof methods === 'object') {
      return new Controller(methods);
    }
  };

  /**
   * @description AMD || attach to root (window)
   */

  return Blend;

});

/* EOF */