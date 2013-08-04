
/**
 * @library blend.js
 * @author Edward Hotchkiss <edward@candidblend.la>
 * @description HTML5 Router with Minimal MV(.*?) Architecture
 * @license MIT
 */

(function(root) {

  'use strict';

  /**
   * @private _startedAt
   */

  var _startedAt = new Date().getTime();

  /**
   * @private _extend
   */

  function _extend(parent, params) {
    params = params || {};
    return Object.keys(params).forEach(function(key, index, obj) {
      parent[key] = params[key];
    });
  }

  /**
   * @private _padMilliseconds
   * @description pads timer with up to six zeroes
   */

  function _padMilliseconds(ms) {
    var max = '00000000';
    return (max + ms).slice(-(max.length));
  }

  /**
   * @private _elapsed
   */

  function _elapsed() {
    return (new Date().getTime() - _startedAt);
  }

  /**
   * @private _stampMessage
   */

  function _stampMessage(args) {
    var message = args[0];
    args[0] = ('DEBUG [' + _padMilliseconds(_elapsed()) + '] > ') + message;
    return args;
  }

  /**
   * @private _consoled
   */

  function _consoled(level) {
    return function() {
      if (typeof(window.console) === 'object') {
        var args = Array.prototype.slice.call(arguments)
          , fn = Function.prototype.bind.call(console[level], console);
        fn.apply(console, _stampMessage(args));
      }
    };
  }

  /**
   * @private _createPathRE
   */

  function _createPathRE(path) {
    var pathRE; 
    if (path instanceof RegExp) {
      return path;
    }
    return new RegExp('^'+path+'\/*$');
  }

  /**
   * @private _log
   */

  var _log = _consoled('log');

  /**
   * @constructor
   */

  function Blend(params) {
    _extend(this, params);
    this.routes = [];
    this.pushState = this.pushState || true;
    document.addEventListener('DOMContentLoaded', function() {
      this.start();
    }.bind(this));
    return this;
  }

  /**
   * @description instance methods
   */

  Blend.prototype = {

    /**
     * @list console debug helpers
     */

    log: _log,

    /**
     * @method on
     * @param {String} name event name
     * @param {Function} fn trigger function to store
     * @description bind function to event name
     */

    on: function(name, fn) {
      this.listeners[name] = this.listeners[name] || [];
      this.listeners[name].push(fn);
      return this;
    },

    /**
     * @method off
     * @param {String} name event name
     * @description remove event listener
     */

    off: function(name) {
      if (this.listeners[name]) {
        delete this.listeners[name];
      }
      return this;
    },

    /**
     * @method trigger
     * @param {String} name Event name
     * @description trigger event listener
     */

    trigger: function(name) {
      if (!this.listeners[name]) {
        return this;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      this.listeners[name].forEach(function(val, index, arr) {
        val.apply(this, args);
      }, this);
      return this;
    },

    /**
     * @method getHash
     * @description get current window hash
     */

    getHash: function() {
      var hash = '/' + window.location.hash;
      return hash;
    },

    /**
     * @method setHash
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
     * @method getPath
     * @description get current /path
     */

    getPath: function() {
      return window.location.pathname;
    },

    /**
     * @method findRoute
     * @description match Route Object based on pathname
     */

    findRoute: function(path) {
      var matches = [], route, key;
      if (!this.pushState) {
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
     * @method navigate
     * @description Navigate to a specified path (HTML5 pushState)
     */

    navigate: function(path) {
      var state = this.findRoute(path);
      if (state !== undefined) {
        if (this.pushState) {
          window.history.pushState(null, document.title, path);
          state.handler.call(this);
        } else {
          this.setHash(path);
          state.handler.call(this);
        }
      } else {
        this.log('Error 404.');
      }
    },

    /**
     * @method get
     * @param {String} path GET path to route
     * @param {Function} handler Method to execute on path match
     */

    get: function(path, handler) {
      if (typeof(handler) !== 'function') {
        throw new Error('must define a route handler!');
      }
      this.routes.push({
        path    : _createPathRE(path),
        handler : handler
      });
      return this;
    },

    /**
     * @method controller
     */

    controller: function(methods) {
      if (typeof methods === 'object') {
        return _extend(this, params);
      }
    },

    /**
     * @method start
     */

    start: function() {
      var links, context = this;
      this.navigate(this.getPath());
      links = document.getElementsByTagName('a');
      Array.prototype.slice.call(links).forEach(function(anchor, index, arr) {
        anchor.addEventListener('click', function(evt) {
          evt.preventDefault();
          if (evt.currentTarget.host !== window.location.host) {
            window.open(evt.currentTarget.href, '_blank');
          } else if (evt.currentTarget.pathname !== undefined) {
            context.navigate(evt.currentTarget.pathname);
          } else {
            window.open(evt.currentTarget.href, '_blank');
          }
        }, false);
      });
      return this;
    }

  };

  /**
   * @description attach
   */

  root.Blend = Blend;

}(window));
