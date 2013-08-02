
/**
 * @library blend.js
 * @author Edward Hotchkiss <edward@candidblend.la>
 * @description HTML5 Router with Minimal MV(.*?) Architecture
 * @license MIT
 */

wrapper('Blend', ['Logger'], function(Logger) {

  'use strict';

  /**
   * @constructor
   */

  var Blend = function Blend(params) {
    _extend(this, params);
    this.routes = [];
    this.baseURL = this.baseURL || window.location;
    this.hasPushstate = !!(window.history && window.history.pushState);
    this.console = (typeof(window.console) === 'object');
    $(function() {
      this.onDOMReady();
    }.bind(this));
    return this;
  };

  /**
   * @private _extend
   */

  function _extend(parent, params) {
    params = params || {};
    return Object.keys(params).forEach(function(key, index, obj) {
      parent[key] = params[key];
    });
  }

  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };

  /**
   * @description instance methods
   */

  Blend.prototype = {

    /**
     * @public DOMReady
     */

    onDOMReady: function() {
      var context = this;
      this.navigate(this.getPath());
      $('a').on('click', function(evt) {
        var pathname = evt.target.pathname;
        if (pathname !== undefined) {
          evt.preventDefault();
          context.navigate(pathname);
        }
      });
      return this;
    },

    /**
     * @public log
     * @description console.log helper
     */

    log: function(msg) {
      Logger.log(arguments);
      return this;
    },

    /**
     * @public getEventPathname
     * @description get path to navigate to
     * @param {Object} evt passed event object
     */

    getEventPathname: function(evt) {
      return evt.target.pathname || '/';
    },

    /**
     * @public getHash
     * @description get current window hash
     */

    getHash: function() {
      var hash = '/' + window.location.hash;
      return hash;
    },

    /**
     * @public setHash
     * @description set window hash
     * @param {String} path hash to set as pathname
     */

    setHash: function(path) {
      if (path === '/') {
        window.location.hash = '/';
      } else {
        window.location.hash = '/' + path;
      }
    },
  
    /**
     * @public getPath
     * @description get current /path
     */

    getPath: function() {
      return window.location.pathname;
    },

    /**
     * @public findRoute
     * @description match Route Object based on pathname
     */

    findRoute: function(path) {
      var matches = [], route, key;
      if (this.hasPushstate !== true) {
        path = '/' + path;
      }
      for (key in this.routes) {
        if (this.routes.hasOwnProperty(key)) {
          route = this.routes[key];
          if (route.path.test(path)) {
            matches.push(route);
          }
        }
      }
      if (matches) {
        return (matches.length > 1) ? matches.pop() : matches[0];
      }
      return this;
    },
  
    /**
     * @public navigate
     * @description Navigate to a specified path (HTML5 pushState)
     */

    navigate: function(path) {
      var state = this.findRoute(path);
      if (state !== undefined) {
        if (this.hasPushstate) {
          window.history.pushState(null, document.title, path);
          state.callback.call(this);
        } else {
          this.setHash(path);
          state.callback.call(this);
        }
      } else {
        Logger.log('Error 404.');
      }
    },

    /**
     * @public get
     * @param {String} path Path to route for a GET
     * @param {Function} callback Method to execute on pathname match
     */

    get: function(path, callback) {
      path = (path instanceof RegExp) ? path : new RegExp(path, 'i');
      callback = callback || function () {};
      this.routes.push({
        path     : path,
        callback : callback
      });
      return this;
    },

    /**
     * @public Controller
     * @description Setup an OOP blend.js controller
     * @return {Object} _Controller blend.js controller
     */

    controller: function (methods) {
      if (typeof methods === 'object') {
        return _extend(this, params);
      }
    }

  };

  /**
   * @description AMD || attach to root (window)
   */

  return Blend;

});

/* EOF */