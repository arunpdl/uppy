(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
(function (global){(function (){
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.4";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var _fromURI = function(a) {
        return String(a).replace(/[-_]/g, function(m0) {
            return m0 == '-' ? '+' : '/'
        }).replace(/[^A-Za-z0-9\+\/]/g, '');
    };
    var decode = function(a){
        return _decode(_fromURI(a));
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(_fromURI(a)), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":26}],6:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],7:[function(require,module,exports){
var n,l,u,t,i,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function p(n){var l=n.parentNode;l&&l.removeChild(n)}function v(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return h(l,f,i,o,null)}function h(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null!=l.vnode&&l.vnode(f),f}function y(n){return n.children}function d(n,l){this.props=n,this.context=l}function _(n,l){if(null==l)return n.__?_(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?_(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function x(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!b.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(b)}function b(){for(var n;b.__r=i.length;)n=i.sort(function(n,l){return n.__v.__b-l.__v.__b}),i=[],n.some(function(n){var l,u,t,i,o,r;n.__d&&(o=(i=(l=n).__v).__e,(r=l.__P)&&(u=[],(t=a({},i)).__v=i.__v+1,I(r,i,t,l.__n,void 0!==r.ownerSVGElement,null!=i.__h?[o]:null,u,null==o?_(i):o,i.__h),T(u,i),i.__e!=o&&k(i)))})}function m(n,l,u,t,i,o,r,f,s,a){var p,v,d,k,x,b,m,A=t&&t.__k||c,P=A.length;for(u.__k=[],p=0;p<l.length;p++)if(null!=(k=u.__k[p]=null==(k=l[p])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?h(null,k,null,null,k):Array.isArray(k)?h(y,{children:k},null,null,null):k.__b>0?h(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=A[p])||d&&k.key==d.key&&k.type===d.type)A[p]=void 0;else for(v=0;v<P;v++){if((d=A[v])&&k.key==d.key&&k.type===d.type){A[v]=void 0;break}d=null}I(n,k,d=d||e,i,o,r,f,s,a),x=k.__e,(v=k.ref)&&d.ref!=v&&(m||(m=[]),d.ref&&m.push(d.ref,null,k),m.push(v,k.__c||x,k)),null!=x?(null==b&&(b=x),"function"==typeof k.type&&null!=k.__k&&k.__k===d.__k?k.__d=s=g(k,s,n):s=w(n,k,d,A,x,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&d.__e==s&&s.parentNode!=n&&(s=_(d))}for(u.__e=b,p=P;p--;)null!=A[p]&&("function"==typeof u.type&&null!=A[p].__e&&A[p].__e==u.__d&&(u.__d=_(t,p+1)),L(A[p],A[p]));if(m)for(p=0;p<m.length;p++)z(m[p],m[++p],m[++p])}function g(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,l="function"==typeof i.type?g(i,l,u):w(u,i,i,n.__k,i.__e,l));return l}function w(n,l,u,t,i,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||i!=o||null==i.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(i),r=null;else{for(f=o,e=0;(f=f.nextSibling)&&e<t.length;e+=2)if(f==i)break n;n.insertBefore(i,o),r=o}return void 0!==r?r:i.nextSibling}function A(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||C(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],t)}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function C(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||P(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||P(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t||n.addEventListener(l,o?H:$,o):n.removeEventListener(l,o?H:$,o);else if("dangerouslySetInnerHTML"!==l){if(i)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function $(n){this.l[n.type+!1](l.event?l.event(n):n)}function H(n){this.l[n.type+!0](l.event?l.event(n):n)}function I(n,u,t,i,o,r,f,e,c){var s,p,v,h,_,k,x,b,g,w,A,P=u.type;if(void 0!==u.constructor)return null;null!=t.__h&&(c=t.__h,e=u.__e=t.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(b=u.props,g=(s=P.contextType)&&i[s.__c],w=s?g?g.props.value:s.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(b,w):(u.__c=p=new d(b,w),p.constructor=P,p.render=M),g&&g.sub(p),p.props=b,p.state||(p.state={}),p.context=w,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=a({},p.__s)),a(p.__s,P.getDerivedStateFromProps(b,p.__s))),h=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&b!==h&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(b,w),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(b,p.__s,w)||u.__v===t.__v){p.props=b,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),p.__h.length&&f.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(b,p.__s,w),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(h,_,k)})}p.context=w,p.props=b,p.state=p.__s,(s=l.__r)&&s(u),p.__d=!1,p.__v=u,p.__P=n,s=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=a(a({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(k=p.getSnapshotBeforeUpdate(h,_)),A=null!=s&&s.type===y&&null==s.key?s.props.children:s,m(n,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,u.__h=null,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,o,r,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,t)}}function T(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,o,r,f,c){var s,a,v,h=t.props,y=u.props,d=u.type,k=0;if("svg"===d&&(o=!0),null!=r)for(;k<r.length;k++)if((s=r[k])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,r[k]=null;break}if(null==l){if(null===d)return document.createTextNode(y);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,y.is&&y),r=null,c=!1}if(null===d)h===y||c&&l.data===y||(l.data=y);else{if(r=r&&n.call(l.childNodes),a=(h=t.props||e).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,!c){if(null!=r)for(h={},k=0;k<l.attributes.length;k++)h[l.attributes[k].name]=l.attributes[k].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""))}if(A(l,y,h,o,c),v)u.__k=[];else if(k=u.props.children,m(l,Array.isArray(k)?k:[k],u,t,i,o&&"foreignObject"!==d,r,f,r?r[0]:t.__k&&_(t,0),c),null!=r)for(k=r.length;k--;)null!=r[k]&&p(r[k]);c||("value"in y&&void 0!==(k=y.value)&&(k!==l.value||"progress"===d&&!k)&&C(l,"value",k,h.value,!1),"checked"in y&&void 0!==(k=y.checked)&&k!==l.checked&&C(l,"checked",k,h.checked,!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function L(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&L(i[o],u,"function"!=typeof n.type);t||null==n.__e||p(n.__e),n.__e=n.__d=void 0}function M(n,l,u){return this.constructor(n,u)}function N(u,t,i){var o,r,f;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],I(t,u=(!o&&i||t).__k=v(y,null,[u]),r||e,e,void 0!==t.ownerSVGElement,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o),T(f,u)}n=c.slice,l={__e:function(n,l){for(var u,t,i;l=l.__;)if((u=l.__c)&&!u.__)try{if((t=u.constructor)&&null!=t.getDerivedStateFromError&&(u.setState(t.getDerivedStateFromError(n)),i=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),i=u.__d),i)return u.__E=u}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),x(this))},d.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),x(this))},d.prototype.render=y,i=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,b.__r=0,f=0,exports.render=N,exports.hydrate=function n(l,u){N(l,u,n)},exports.createElement=v,exports.h=v,exports.Fragment=y,exports.createRef=function(){return{current:null}},exports.isValidElement=t,exports.Component=d,exports.cloneElement=function(l,u,t){var i,o,r,f=a({},l.props);for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),h(l.type,f,i||l.key,o||l.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(x)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.options=l;


},{}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],10:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

var _uriToBlob = _interopRequireDefault(require("./uriToBlob"));

var _isCordova = _interopRequireDefault(require("./isCordova"));

var _readAsByteArray = _interopRequireDefault(require("./readAsByteArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if ((0, _isCordova.default)()) {
        return (0, _readAsByteArray.default)(this._file.slice(start, end));
      }

      var value = this._file.slice(start, end);

      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {// Nothing to do here since we don't need to release any resources.
    }
  }]);

  return FileSource;
}();

var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader, chunkSize) {
    _classCallCheck(this, StreamSource);

    this._chunkSize = chunkSize;
    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }

  _createClass(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }

      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;

      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);

      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);

        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }

      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
            done = _ref.done;

        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }

        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      } // If the buffer is empty after removing old data, all data has been read.


      var hasAllDataBeenRead = len(this._buffer) === 0;

      if (this._done && hasAllDataBeenRead) {
        return null;
      } // We already removed data before `start`, so we just return the first
      // chunk from the buffer.


      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);

  return StreamSource;
}();

function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}
/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/


function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }

  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }

  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  throw new Error("Unknown data type");
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      // In React Native, when user selects a file, instead of a File or Blob,
      // you usually get a file object {} with a uri property that contains
      // a local path to the file. We use XMLHttpRequest to fetch
      // the file blob, before uploading with tus.
      if ((0, _isReactNative.default)() && input && typeof input.uri !== "undefined") {
        return (0, _uriToBlob.default)(input.uri).then(function (blob) {
          return new FileSource(blob);
        })["catch"](function (err) {
          throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. " + err);
        });
      } // Since we emulate the Blob type in our tests (not all target browsers
      // support it), we cannot use `instanceof` for testing whether the input value
      // can be handled. Instead, we simply check is the slice() function and the
      // size property are available.


      if (typeof input.slice === "function" && typeof input.size !== "undefined") {
        return Promise.resolve(new FileSource(input));
      }

      if (typeof input.read === "function") {
        chunkSize = +chunkSize;

        if (!isFinite(chunkSize)) {
          return Promise.reject(new Error("cannot create source for stream without a finite value for the `chunkSize` option"));
        }

        return Promise.resolve(new StreamSource(input, chunkSize));
      }

      return Promise.reject(new Error("source object may only be an instance of File, Blob, or Reader in this environment"));
    }
  }]);

  return FileReader;
}();

exports.default = FileReader;
},{"./isCordova":15,"./isReactNative":16,"./readAsByteArray":17,"./uriToBlob":18}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */
function fingerprint(file, options) {
  if ((0, _isReactNative.default)()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }

  return Promise.resolve(["tus-br", file.name, file.type, file.size, file.lastModified, options.endpoint].join("-"));
}

function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : "noexif";
  return ["tus-rn", file.name || "noname", file.size || "nosize", exifHash, options.endpoint].join("/");
}

function hashCode(str) {
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}
},{"./isReactNative":16}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck(this, XHRHttpStack);
  }

  _createClass(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return "XHRHttpStack";
    }
  }]);

  return XHRHttpStack;
}();

exports.default = XHRHttpStack;

var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this._xhr = new XMLHttpRequest();

    this._xhr.open(method, url, true);

    this._method = method;
    this._url = url;
    this._headers = {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);

      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!("upload" in this._xhr)) {
        return;
      }

      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }

        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };

        _this._xhr.onerror = function (err) {
          reject(err);
        };

        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();

      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck(this, Response);

    this._xhr = xhr;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Response;
}();
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "enableDebugLog", {
  enumerable: true,
  get: function () {
    return _logger.enableDebugLog;
  }
});
Object.defineProperty(exports, "canStoreURLs", {
  enumerable: true,
  get: function () {
    return _urlStorage.canStoreURLs;
  }
});
exports.isSupported = exports.defaultOptions = exports.Upload = void 0;

var _upload = _interopRequireDefault(require("../upload"));

var _noopUrlStorage = _interopRequireDefault(require("../noopUrlStorage"));

var _logger = require("../logger");

var _urlStorage = require("./urlStorage");

var _httpStack = _interopRequireDefault(require("./httpStack"));

var _fileReader = _interopRequireDefault(require("./fileReader"));

var _fingerprint = _interopRequireDefault(require("./fingerprint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* global window */


var defaultOptions = _objectSpread({}, _upload.default.defaultOptions, {
  httpStack: new _httpStack.default(),
  fileReader: new _fileReader.default(),
  urlStorage: _urlStorage.canStoreURLs ? new _urlStorage.WebStorageUrlStorage() : new _noopUrlStorage.default(),
  fingerprint: _fingerprint.default
});

exports.defaultOptions = defaultOptions;

var Upload = /*#__PURE__*/function (_BaseUpload) {
  _inherits(Upload, _BaseUpload);

  var _super = _createSuper(Upload);

  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Upload);

    options = _objectSpread({}, defaultOptions, {}, options);
    return _super.call(this, file, options);
  }

  _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url, options, cb) {
      options = _objectSpread({}, defaultOptions, {}, options);
      return _upload.default.terminate(url, options, cb);
    }
  }]);

  return Upload;
}(_upload.default);

exports.Upload = Upload;
var _window = window,
    XMLHttpRequest = _window.XMLHttpRequest,
    Blob = _window.Blob;
var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === "function";
exports.isSupported = isSupported;
},{"../logger":21,"../noopUrlStorage":22,"../upload":23,"./fileReader":11,"./fingerprint":12,"./httpStack":13,"./urlStorage":19}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isCordova = function isCordova() {
  return typeof window != "undefined" && (typeof window.PhoneGap != "undefined" || typeof window.Cordova != "undefined" || typeof window.cordova != "undefined");
};

var _default = isCordova;
exports.default = _default;
},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var isReactNative = function isReactNative() {
  return typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
};

var _default = isReactNative;
exports.default = _default;
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readAsByteArray;

/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */
function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(chunk);
  });
}
},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uriToBlob;

/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */
function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };

    xhr.onerror = function (err) {
      reject(err);
    };

    xhr.open("GET", uri);
    xhr.send();
  });
}
},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStorageUrlStorage = exports.canStoreURLs = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window, localStorage */


var hasStorage = false;

try {
  hasStorage = "localStorage" in window; // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)

  var key = "tusSupport";
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = hasStorage;
exports.canStoreURLs = canStoreURLs;

var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck(this, WebStorageUrlStorage);
  }

  _createClass(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries("tus::");

      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));

      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];

      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);

        if (_key.indexOf(prefix) !== 0) continue;

        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (e) {// The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }

      return results;
    }
  }]);

  return WebStorageUrlStorage;
}();

exports.WebStorageUrlStorage = WebStorageUrlStorage;
},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var DetailedError = /*#__PURE__*/function (_Error) {
  _inherits(DetailedError, _Error);

  var _super = _createSuper(DetailedError);

  function DetailedError(message) {
    var _this;

    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, DetailedError);

    _this = _super.call(this, message);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;

    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }

    if (req != null) {
      var requestId = req.getHeader("X-Request-ID") || "n/a";
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : "n/a";
      var body = res ? res.getBody() || "" : "n/a";
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }

    _this.message = message;
    return _this;
  }

  return DetailedError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _default = DetailedError;
exports.default = _default;
},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebugLog = enableDebugLog;
exports.log = log;

/* eslint no-console: "off" */
var isEnabled = false;

function enableDebugLog() {
  isEnabled = true;
}

function log(msg) {
  if (!isEnabled) return;
  console.log(msg);
}
},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* eslint no-unused-vars: "off" */


var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck(this, NoopUrlStorage);
  }

  _createClass(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      return Promise.resolve(null);
    }
  }]);

  return NoopUrlStorage;
}();

exports.default = NoopUrlStorage;
},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _error = _interopRequireDefault(require("./error"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _jsBase = require("js-base64");

var _urlParse = _interopRequireDefault(require("url-parse"));

var _logger = require("./logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/* global window */


var defaultOptions = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  _onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null
};

var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck(this, BaseUpload); // Warn about removed options from previous versions


    if ("resume" in options) {
      console.log("tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead."); // eslint-disable-line no-console
    } // The default options will already be added from the wrapper classes.


    this.options = options; // The storage module used to store URLs

    this._urlStorage = this.options.urlStorage; // The underlying File/Blob object

    this.file = file; // The URL against which the file will be uploaded

    this.url = null; // The underlying request object for the current PATCH request

    this._req = null; // The fingerpinrt for the current file (set after start())

    this._fingerprint = null; // The key that the URL storage returned when saving an URL with a fingerprint,

    this._urlStorageKey = null; // The offset used in the current PATCH request

    this._offset = null; // True if the current PATCH request has been aborted

    this._aborted = false; // The file's size in bytes

    this._size = null; // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.

    this._source = null; // The current count of attempts which have been made. Zero indicates none.

    this._retryAttempt = 0; // The timeout's ID which is used to delay the next retry

    this._retryTimeout = null; // The offset of the remote upload before the latest attempt was started.

    this._offsetBeforeRetry = 0; // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploads = null; // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploadUrls = null;
  }
  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */


  _createClass(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;

      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error("tus: no file or stream to upload provided"));

        return;
      }

      if (!this.options.endpoint && !this.options.uploadUrl) {
        this._emitError(new Error("tus: neither an endpoint or an upload URL is provided"));

        return;
      }

      var retryDelays = this.options.retryDelays;

      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== "[object Array]") {
        this._emitError(new Error("tus: the `retryDelays` option must either be an array or null"));

        return;
      }

      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        ["uploadUrl", "uploadSize", "uploadLengthDeferred"].forEach(function (optionName) {
          if (_this2.options[optionName]) {
            _this2._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));
          }
        });
      }

      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        if (fingerprint == null) {
          (0, _logger.log)("No fingerprint was calculated meaning that the upload cannot be stored in the URL storage.");
        } else {
          (0, _logger.log)("Calculated fingerprint: ".concat(fingerprint));
        }

        _this2._fingerprint = fingerprint;

        if (_this2._source) {
          return _this2._source;
        } else {
          return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
        }
      }).then(function (source) {
        _this2._source = source; // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.

        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */

  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this3 = this;

      var totalSize = this._size = this._source.size;
      var totalProgress = 0;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads; // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we generate the start and end position for the slices.

      var parts = splitSizeIntoParts(this._source.size, partCount, this._parallelUploadUrls); // Create an empty list for storing the upload URLs

      this._parallelUploadUrls = new Array(parts.length); // Generate a promise for each slice that will be resolve if the respective
      // upload is completed.

      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread({}, _this3.options, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              metadata: {},
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread({}, _this3.options.headers, {
                "Upload-Concat": "partial"
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Based in the progress for this partial upload, calculate the progress
              // for the entire final upload.
              onProgress: function onProgress(newPartProgress) {
                totalProgress = totalProgress - lastPartProgress + newPartProgress;
                lastPartProgress = newPartProgress;

                _this3._emitProgress(totalProgress, totalSize);
              },
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              _onUploadUrlAvailable: function _onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url; // Test if all uploads have received an URL

                if (_this3._parallelUploadUrls.filter(function (u) {
                  return !!u;
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });

            var upload = new BaseUpload(value, options);
            upload.start(); // Store the upload in an array, so we can later abort them if necessary.

            _this3._parallelUploads.push(upload);
          });
        });
      });
      var req; // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.

      Promise.all(uploads).then(function () {
        req = _this3._openRequest("POST", _this3.options.endpoint);
        req.setHeader("Upload-Concat", "final;".concat(_this3._parallelUploadUrls.join(" "))); // Add metadata if values have been added

        var metadata = encodeMetadata(_this3.options.metadata);

        if (metadata !== "") {
          req.setHeader("Upload-Metadata", metadata);
        }

        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, "tus: unexpected response while creating upload");

          return;
        }

        var location = res.getHeader("Location");

        if (location == null) {
          _this3._emitHttpError(req, res, "tus: invalid or missing Location header");

          return;
        }

        _this3.url = resolveUrl(_this3.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this3.url));

        _this3._emitSuccess();
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */

  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // First, we look at the uploadLengthDeferred option.
      // Next, we check if the caller has supplied a manual upload size.
      // Finally, we try to use the calculated size from the source object.
      if (this.options.uploadLengthDeferred) {
        this._size = null;
      } else if (this.options.uploadSize != null) {
        this._size = +this.options.uploadSize;

        if (isNaN(this._size)) {
          this._emitError(new Error("tus: cannot convert `uploadSize` option into a number"));

          return;
        }
      } else {
        this._size = this._source.size;

        if (this._size == null) {
          this._emitError(new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option"));

          return;
        }
      } // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.


      this._aborted = false; // The upload had been started previously and we should reuse this URL.

      if (this.url != null) {
        (0, _logger.log)("Resuming upload from previous URL: ".concat(this.url));

        this._resumeUpload();

        return;
      } // A URL has manually been specified, so we try to resume


      if (this.options.uploadUrl != null) {
        (0, _logger.log)("Resuming upload from provided URL: ".concat(this.options.url));
        this.url = this.options.uploadUrl;

        this._resumeUpload();

        return;
      } // An upload has not started for the file yet, so we start a new one


      (0, _logger.log)("Creating a new upload");

      this._createUpload();
    }
    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */

  }, {
    key: "abort",
    value: function abort(shouldTerminate, cb) {
      var _this4 = this;

      if (typeof cb === "function") {
        throw new Error("tus: the abort function does not accept a callback since v2 anymore; please use the returned Promise instead");
      } // Stop any parallel partial uploads, that have been started in _startParallelUploads.


      if (this._parallelUploads != null) {
        this._parallelUploads.forEach(function (upload) {
          upload.abort(shouldTerminate);
        });
      } // Stop any current running request.


      if (this._req !== null) {
        this._req.abort();

        this._source.close();
      }

      this._aborted = true; // Stop any timeout used for initiating a retry.

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }

      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }

      return BaseUpload.terminate(this.url, this.options) // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new _error.default(message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this; // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.


      if (this._aborted) return; // Check if we should retry, when enabled, before sending the error to the user.

      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;

        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }

        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }

      if (typeof this.options.onError === "function") {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @api private
     */

  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }

      if (typeof this.options.onSuccess === "function") {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === "function") {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }
    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === "function") {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;

      if (!this.options.endpoint) {
        this._emitError(new Error("tus: unable to create upload because no endpoint is provided"));

        return;
      }

      var req = this._openRequest("POST", this.options.endpoint);

      if (this.options.uploadLengthDeferred) {
        req.setHeader("Upload-Defer-Length", 1);
      } else {
        req.setHeader("Upload-Length", this._size);
      } // Add metadata if values have been added


      var metadata = encodeMetadata(this.options.metadata);

      if (metadata !== "") {
        req.setHeader("Upload-Metadata", metadata);
      }

      var promise;

      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        promise = this._sendRequest(req, null);
      }

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, "tus: unexpected response while creating upload");

          return;
        }

        var location = res.getHeader("Location");

        if (location == null) {
          _this6._emitHttpError(req, res, "tus: invalid or missing Location header");

          return;
        }

        _this6.url = resolveUrl(_this6.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this6.url));

        if (typeof _this6.options._onUploadUrlAvailable === "function") {
          _this6.options._onUploadUrlAvailable();
        }

        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess();

          _this6._source.close();

          return;
        }

        _this6._saveUploadInUrlStorage();

        if (_this6.options.uploadDataDuringCreation) {
          _this6._handleUploadResponse(req, res);
        } else {
          _this6._offset = 0;

          _this6._performUpload();
        }
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, "tus: failed to create upload", err);
      });
    }
    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;

      var req = this._openRequest("HEAD", this.url);

      var promise = this._sendRequest(req, null);

      promise.then(function (res) {
        var status = res.getStatus();

        if (!inStatusCategory(status, 200)) {
          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          } // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.


          if (status === 423) {
            _this7._emitHttpError(req, res, "tus: upload is currently locked; retry later");

            return;
          }

          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, "tus: unable to resume upload (new upload cannot be created without an endpoint)");

            return;
          } // Try to create a new upload


          _this7.url = null;

          _this7._createUpload();

          return;
        }

        var offset = parseInt(res.getHeader("Upload-Offset"), 10);

        if (isNaN(offset)) {
          _this7._emitHttpError(req, res, "tus: invalid or missing offset value");

          return;
        }

        var length = parseInt(res.getHeader("Upload-Length"), 10);

        if (isNaN(length) && !_this7.options.uploadLengthDeferred) {
          _this7._emitHttpError(req, res, "tus: invalid or missing length value");

          return;
        }

        if (typeof _this7.options._onUploadUrlAvailable === "function") {
          _this7.options._onUploadUrlAvailable();
        } // Upload has already been completed and we do not need to send additional
        // data to the server


        if (offset === length) {
          _this7._emitProgress(length, length);

          _this7._emitSuccess();

          return;
        }

        _this7._offset = offset;

        _this7._performUpload();
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, "tus: failed to resume upload", err);
      });
    }
    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this; // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.


      if (this._aborted) {
        return;
      }

      var req; // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.

      if (this.options.overridePatchMethod) {
        req = this._openRequest("POST", this.url);
        req.setHeader("X-HTTP-Method-Override", "PATCH");
      } else {
        req = this._openRequest("PATCH", this.url);
      }

      req.setHeader("Upload-Offset", this._offset);

      var promise = this._addChunkToRequest(req);

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, "tus: unexpected response while uploading chunk");

          return;
        }

        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }

        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset " + _this8._offset, err);
      });
    }
    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */

  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      req.setHeader("Content-Type", "application/offset+octet-stream"); // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.

      if ((end === Infinity || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }

      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
            done = _ref2.done; // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.

        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + (value && value.size ? value.size : 0);
          req.setHeader("Upload-Length", _this9._size);
        }

        if (value === null) {
          return _this9._sendRequest(req);
        } else {
          _this9._emitProgress(_this9._offset, _this9._size);

          return _this9._sendRequest(req, value);
        }
      });
    }
    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */

  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var offset = parseInt(res.getHeader("Upload-Offset"), 10);

      if (isNaN(offset)) {
        this._emitHttpError(req, res, "tus: invalid or missing offset value");

        return;
      }

      this._emitProgress(offset, this._size);

      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset == this._size) {
        // Yay, finally done :)
        this._emitSuccess();

        this._source.close();

        return;
      }

      this._performUpload();
    }
    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */

  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }
    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */

  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this10 = this;

      if (!this._urlStorageKey) return;

      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this10._emitError(err);
      });

      this._urlStorageKey = null;
    }
    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */

  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this11 = this; // Only if a fingerprint was calculated for the input (i.e. not a stream), we can store the upload URL.


      if (!this.options.storeFingerprintForResuming || !this._fingerprint) {
        return;
      }

      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };

      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }

      this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        return _this11._urlStorageKey = urlStorageKey;
      })["catch"](function (err) {
        _this11._emitError(err);
      });
    }
    /**
     * Send a request with the provided body while invoking the onBeforeRequest
     * and onAfterResponse callbacks.
     *
     * @api private
     */

  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var _this12 = this;

      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof this.options.onBeforeRequest === "function") {
        this.options.onBeforeRequest(req);
      }

      return req.send(body).then(function (res) {
        if (typeof _this12.options.onAfterResponse === "function") {
          _this12.options.onAfterResponse(req, res);
        }

        return res;
      });
    }
  }], [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 ? arguments[2] : undefined;

      if (typeof options === "function" || typeof cb === "function") {
        throw new Error("tus: the terminate function does not accept a callback since v2 anymore; please use the returned Promise instead");
      }

      var req = openRequest("DELETE", url, options);
      var promise = req.send();
      return promise.then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }

        throw new _error.default("tus: unexpected response while terminating upload", null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof _error.default)) {
          err = new _error.default("tus: failed to terminate upload", err, req, null);
        }

        if (!shouldRetry(err, 0, options)) {
          throw err;
        } // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.


        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);

        var newOptions = _objectSpread({}, options, {
          retryDelays: remainingDelays
        });

        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);

  return BaseUpload;
}();

function encodeMetadata(metadata) {
  var encoded = [];

  for (var key in metadata) {
    encoded.push(key + " " + _jsBase.Base64.encode(metadata[key]));
  }

  return encoded.join(",");
}
/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */


function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}
/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */


function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  req.setHeader("Tus-Resumable", "1.0.0");
  var headers = options.headers || {};

  for (var name in headers) {
    req.setHeader(name, headers[name]);
  }

  if (options.addRequestId) {
    var requestId = (0, _uuid.default)();
    req.setHeader("X-Request-ID", requestId);
  }

  return req;
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */


function isOnline() {
  var online = true;

  if (typeof window !== "undefined" && "navigator" in window && window.navigator.onLine === false) {
    online = false;
  }

  return online;
}
/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */


function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. no a status 4xx or a 409 or 423) and
  // - the browser does not indicate that we are offline
  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  var isServerError = !inStatusCategory(status, 400) || status === 409 || status === 423;
  return options.retryDelays != null && retryAttempt < options.retryDelays.length && err.originalRequest != null && isServerError && isOnline();
}
/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */


function resolveUrl(origin, link) {
  return new _urlParse.default(link, origin).toString();
}
/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @param {string[]} previousUrls The upload URLs for previous parts.
 * @return {object[]}
 * @api private
 */


function splitSizeIntoParts(totalSize, partCount, previousUrls) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];

  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }

  parts[partCount - 1].end = totalSize; // Attach URLs from previous uploads, if available.

  if (previousUrls) {
    parts.forEach(function (part, index) {
      part.uploadUrl = previousUrls[index] || null;
    });
  }

  return parts;
}

BaseUpload.defaultOptions = defaultOptions;
var _default = BaseUpload;
exports.default = _default;
},{"./error":20,"./logger":21,"./uuid":24,"js-base64":3,"url-parse":25}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
},{}],25:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:[\\/]+/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?([\\/]{1,})?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);

  var match = protocolre.exec(address)
    , protocol = match[1] ? match[1].toLowerCase() : ''
    , slashes = !!(match[2] && match[2].length >= 2)
    , rest =  match[2] && match[2].length === 1 ? '/' + match[3] : match[3];

  return {
    protocol: protocol,
    slashes: slashes,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && url.hostname) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":9,"requires-port":10}],26:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],27:[function(require,module,exports){
'use strict';

class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

},{}],28:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const tokenStorage = require('./tokenStorage');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(([headers, token]) => {
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }

  authUrl(queries = {}) {
    if (this.preAuthToken) {
      queries.uppyPreAuthToken = this.preAuthToken;
    }

    return `${this.hostname}/${this.id}/connect?${new URLSearchParams(queries)}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return Promise.resolve();
    }

    return this.post(`${this.id}/preauth/`, {
      params: this.companionKeysParams
    }).then(res => {
      this.preAuthToken = res.token;
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    });
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(([response]) => response);
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

},{"./RequestClient":29,"./tokenStorage":33}],29:[function(require,module,exports){
'use strict';

var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = require('./../../utils/lib/fetchWithNetworkError');

const AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(([allowedHeaders, headers]) => {
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.0.0-alpha.0", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      const error = new Error(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`);
      error.cause = err;
      err = error; // eslint-disable-line no-param-reassign
    }

    return Promise.reject(err);
  };
}

},{"./../../utils/lib/fetchWithNetworkError":54,"./AuthError":27}],30:[function(require,module,exports){
'use strict';

const RequestClient = require('./RequestClient');

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

},{"./RequestClient":29}],31:[function(require,module,exports){
"use strict";

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = require('namespace-emitter');

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

},{"namespace-emitter":6}],32:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

const RequestClient = require('./RequestClient');

const Provider = require('./Provider');

const SearchProvider = require('./SearchProvider');

const Socket = require('./Socket');

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

},{"./Provider":28,"./RequestClient":29,"./SearchProvider":30,"./Socket":31}],33:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

},{}],34:[function(require,module,exports){
(function (process){(function (){
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

let { urlAlphabet } = require('./url-alphabet/index.cjs')

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in the production bundle.
  if (
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative' &&
    typeof crypto === 'undefined'
  ) {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
        'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
        'For secure IDs, import `react-native-get-random-values` ' +
        'before Nano ID.'
    )
  }
  if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
    throw new Error(
      'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
        ' before importing Nano ID to fix IE 11 support'
    )
  }
  if (typeof crypto === 'undefined') {
    throw new Error(
      'Your browser does not have secure random generator. ' +
        'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))

let customRandom = (alphabet, size, getRandom) => {
  // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
  // values closer to the alphabet size. The bitmask calculates the closest
  // `2^31 - 1` number, which exceeds the alphabet size.
  // For example, the bitmask for the alphabet size 30 is 31 (00011111).
  // `Math.clz32` is not used, because it is not available in browsers.
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  // Though, the bitmask solution is not perfect since the bytes exceeding
  // the alphabet size are refused. Therefore, to reliably generate the ID,
  // the random bytes redundancy has to be satisfied.

  // Note: every hardware random generator call is performance expensive,
  // because the system call for entropy collection takes a lot of time.
  // So, to avoid additional system calls, extra bytes are requested in advance.

  // Next, a step determines how many random bytes to generate.
  // The number of random bytes gets decided upon the ID size, mask,
  // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
  // according to benchmarks).

  // `-~f => Math.ceil(f)` if f is a float
  // `-~i => i + 1` if i is an integer
  let step = -~((1.6 * mask * size) / alphabet.length)

  return () => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      // A compact alternative for `for (var i = 0; i < step; i++)`.
      let j = step
      while (j--) {
        // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}

let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random)

let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array(size))

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36)
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte < 63) {
      id += '_'
    } else {
      id += '-'
    }
  }
  return id
}

module.exports = { nanoid, customAlphabet, customRandom, urlAlphabet, random }

}).call(this)}).call(this,require('_process'))

},{"./url-alphabet/index.cjs":35,"_process":8}],35:[function(require,module,exports){
// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

module.exports = { urlAlphabet }

},{}],36:[function(require,module,exports){
"use strict";

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = require('./../../utils/lib/Translator');

module.exports = class BasePlugin {
  constructor(uppy, opts = {}) {
    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

},{"./../../utils/lib/Translator":52}],37:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render,
  h
} = require('preact');

const findDOMElement = require('./../../utils/lib/findDOMElement');

const BasePlugin = require('./BasePlugin');
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return (...args) => {
    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createDocumentFragment(); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement.firstElementChild;
      targetElement.appendChild(uppyRootElement);
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

},{"./../../utils/lib/findDOMElement":55,"./BasePlugin":36,"preact":7}],38:[function(require,module,exports){
"use strict";

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

},{}],39:[function(require,module,exports){
"use strict";

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/* global AggregateError */
const Translator = require('./../../utils/lib/Translator');

const ee = require('namespace-emitter');

const {
  nanoid
} = require('nanoid');

const throttle = require('lodash.throttle');

const prettierBytes = require('@transloadit/prettier-bytes');

const match = require('mime-match');

const DefaultStore = require('./../../store-default');

const getFileType = require('./../../utils/lib/getFileType');

const getFileNameAndExtension = require('./../../utils/lib/getFileNameAndExtension');

const generateFileID = require('./../../utils/lib/generateFileID');

const supportsUploadProgress = require('./supportsUploadProgress');

const getFileName = require('./getFileName');

const {
  justErrorsLogger,
  debugLogger
} = require('./loggers');

const UIPlugin = require('./UIPlugin');

const BasePlugin = require('./BasePlugin'); // Exported from here.


class RestrictionError extends Error {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(message, errors) {
      super(message);
      this.errors = errors;
    }

  };
}

class AggregateRestrictionError extends AggregateError {
  constructor(...args) {
    super(...args);
    this.isRestriction = true;
  }

}
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _checkRestrictions = /*#__PURE__*/_classPrivateFieldLooseKey("checkRestrictions");

var _checkMinNumberOfFiles = /*#__PURE__*/_classPrivateFieldLooseKey("checkMinNumberOfFiles");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _showOrLogErrorAndThrow = /*#__PURE__*/_classPrivateFieldLooseKey("showOrLogErrorAndThrow");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _showOrLogErrorAndThrow, {
      value: _showOrLogErrorAndThrow2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkMinNumberOfFiles, {
      value: _checkMinNumberOfFiles2
    });
    Object.defineProperty(this, _checkRestrictions, {
      value: _checkRestrictions2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = {
      strings: {
        addBulkFilesFailed: {
          0: 'Failed to add %{smart_count} file due to an internal error',
          1: 'Failed to add %{smart_count} files due to internal errors'
        },
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noNewAlreadyUploading: 'Cannot add new files: already uploading',
        noDuplicates: 'Cannot add the duplicate file \'%{fileName}\', it already exists',
        companionError: 'Connection with Companion failed',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}'
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        backToSearch: 'Back to Search',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null,
        requiredMetaFields: []
      },
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event, ...args) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(({
      progress
    }) => !progress.uploadComplete && progress.uploadStarted);
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /**
   * A public wrapper for _checkRestrictions — checks if a file passes a set of restrictions.
   * For use in UI pluigins (like Providers), to disallow selecting files that won’t pass restrictions.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @returns {object} { result: true/false, reason: why file didn’t pass restrictions }
   */


  validateRestrictions(file, files) {
    try {
      _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize, minFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @param {Array} [files] array to check maxNumberOfFiles and maxTotalFileSize
   * @private
   */


  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason = null) {
    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll() {
    this.emit('cancel-all');
    const {
      files
    } = this.getState();
    const fileIDs = Object.keys(files);

    if (fileIDs.length) {
      this.removeFiles(fileIDs, 'cancel-all');
    }

    this.setState({
      totalProgress: 0,
      error: null,
      recoveredState: null
    });
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  reset() {
    this.cancelAll();
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close() {
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.reset();

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type = 'info', duration = 3000) {
    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2](...args) {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...args);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => {
      _classPrivateFieldLooseBase(this, _checkMinNumberOfFiles)[_checkMinNumberOfFiles](files);

      _classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err);
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
        showInformer: false
      });
    });
  }

} // Expose class constructor.


function _checkRestrictions2(file, files = this.getFiles()) {
  const {
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    allowedFileTypes
  } = this.opts.restrictions;

  if (maxNumberOfFiles) {
    if (files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }
  }

  if (allowedFileTypes) {
    const isCorrectFileType = allowedFileTypes.some(type => {
      // check if this is a mime-type
      if (type.indexOf('/') > -1) {
        if (!file.type) return false;
        return match(file.type.replace(/;.*?$/, ''), type);
      } // otherwise this is likely an extension


      if (type[0] === '.' && file.extension) {
        return file.extension.toLowerCase() === type.substr(1).toLowerCase();
      }

      return false;
    });

    if (!isCorrectFileType) {
      const allowedFileTypesString = allowedFileTypes.join(', ');
      throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
        types: allowedFileTypesString
      }));
    }
  } // We can't check maxTotalFileSize if the size is unknown.


  if (maxTotalFileSize && file.size != null) {
    let totalFilesSize = 0;
    totalFilesSize += file.size;
    files.forEach(f => {
      totalFilesSize += f.size;
    });

    if (totalFilesSize > maxTotalFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxTotalFileSize),
        file: file.name
      }));
    }
  } // We can't check maxFileSize if the size is unknown.


  if (maxFileSize && file.size != null) {
    if (file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    }
  } // We can't check minFileSize if the size is unknown.


  if (minFileSize && file.size != null) {
    if (file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }
}

function _checkMinNumberOfFiles2(files) {
  const {
    minNumberOfFiles
  } = this.opts.restrictions;

  if (Object.keys(files).length < minNumberOfFiles) {
    throw new RestrictionError(`${this.i18n('youHaveToAtLeastSelectX', {
      smart_count: minNumberOfFiles
    })}`);
  }
}

function _checkRequiredMetaFields2(files) {
  const {
    requiredMetaFields
  } = this.opts.restrictions;
  const {
    hasOwnProperty
  } = Object.prototype.hasOwnProperty;
  const errors = [];
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const file = this.getFile(fileIDs[i]);

    for (let i = 0; i < requiredMetaFields.length; i++) {
      if (!hasOwnProperty.call(file.meta, requiredMetaFields[i])) {
        const err = new RestrictionError(`${this.i18n('missingRequiredMetaFieldOnFile', {
          fileName: file.name
        })}`);
        errors.push(err);

        _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
          file,
          showInformer: false,
          throwErr: false
        });
      }
    }
  }

  if (errors.length) {
    throw new AggregateRestrictionError(`${this.i18n('missingRequiredMetaField')}`, errors);
  }
}

function _showOrLogErrorAndThrow2(err, {
  showInformer = true,
  file = null,
  throwErr = true
} = {}) {
  const message = typeof err === 'object' ? err.message : err;
  const details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
  // as they are expected and shown in the UI.

  let logMessageWithDetails = message;

  if (details) {
    logMessageWithDetails += ` ${details}`;
  }

  if (err.isRestriction) {
    this.log(logMessageWithDetails);
    this.emit('restriction-failed', file, err);
  } else {
    this.log(logMessageWithDetails, 'error');
  } // Sometimes informer has to be shown manually by the developer,
  // for example, in `onBeforeFileAdded`.


  if (showInformer) {
    this.info({
      message,
      details
    }, 'error', this.opts.infoTimeout);
  }

  if (throwErr) {
    throw typeof err === 'object' ? err : new Error(err);
  }
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError(this.i18n('noNewAlreadyUploading')), {
      file
    });
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
      file: fileDescriptor
    });
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
      showInformer: false,
      fileDescriptor
    });
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _checkRestrictions)[_checkRestrictions](newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](err, {
      file: newFile
    });
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](newError, {
        throwErr: false
      });
    } else {
      _classPrivateFieldLooseBase(this, _showOrLogErrorAndThrow)[_showOrLogErrorAndThrow](error, {
        throwErr: false
      });
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (!this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts = {}) {
  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

function _runUpload2(uploadID) {
  const uploadData = this.getState().currentUploads[uploadID];
  const restoreStep = uploadData.step;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];
  let lastStep = Promise.resolve();
  steps.forEach((fn, step) => {
    // Skip this step if we are restoring and have already completed this step before.
    if (step < restoreStep) {
      return;
    }

    lastStep = lastStep.then(() => {
      const {
        currentUploads
      } = this.getState();
      const currentUpload = currentUploads[uploadID];

      if (!currentUpload) {
        return;
      }

      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      return fn(updatedUpload.fileIDs, uploadID); // eslint-disable-line consistent-return
    }).then(() => null);
  }); // Not returning the `catch`ed promise, because we still want to return a rejected
  // promise from this method if the upload failed.

  lastStep.catch(err => {
    this.emit('error', err);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  });
  return lastStep.then(() => {
    // Set result data.
    const {
      currentUploads
    } = this.getState();
    const currentUpload = currentUploads[uploadID];

    if (!currentUpload) {
      return;
    } // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.


    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    });
  }).then(() => {
    // Emit completion events.
    // This is in a separate function so that the `currentUploads` variable
    // always refers to the latest state. In the handler right above it refers
    // to an outdated object without the `.result` property.
    const {
      currentUploads
    } = this.getState();

    if (!currentUploads[uploadID]) {
      return;
    }

    const currentUpload = currentUploads[uploadID];
    const {
      result
    } = currentUpload;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID); // eslint-disable-next-line consistent-return


    return result;
  }).then(result => {
    if (result == null) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
    }

    return result;
  });
}

Uppy.VERSION = "2.0.0-alpha.0";
module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

},{"./../../store-default":46,"./../../utils/lib/Translator":52,"./../../utils/lib/generateFileID":56,"./../../utils/lib/getFileNameAndExtension":58,"./../../utils/lib/getFileType":59,"./BasePlugin":36,"./UIPlugin":37,"./getFileName":38,"./loggers":40,"./supportsUploadProgress":41,"@transloadit/prettier-bytes":1,"lodash.throttle":4,"mime-match":5,"namespace-emitter":6,"nanoid":34}],40:[function(require,module,exports){
"use strict";

/* eslint-disable no-console */
const getTimeStamp = require('./../../utils/lib/getTimeStamp'); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: (...args) => {},
  warn: (...args) => {},
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
  warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
  error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args)
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

},{"./../../utils/lib/getTimeStamp":63}],41:[function(require,module,exports){
"use strict";

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

},{}],42:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const toArray = require('./../../utils/lib/toArray');

const Translator = require('./../../utils/lib/Translator');

const {
  h
} = require('preact');

module.exports = (_temp = _class = class FileInput extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'FileInput';
    this.title = 'File Input';
    this.type = 'acquirer';
    this.defaultLocale = {
      strings: {
        // The same key is used for the same purpose by @uppy/robodog's `form()` API, but our
        // locale pack scripts can't access it in Robodog. If it is updated here, it should
        // also be updated there!
        chooseFiles: 'Choose files'
      }
    }; // Default options

    const defaultOptions = {
      target: null,
      pretty: true,
      inputName: 'files[]'
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  handleInputChange(event) {
    this.uppy.log('[FileInput] Something selected through input...');
    const files = toArray(event.target.files);
    this.addFiles(files); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  }

  handleClick(ev) {
    this.input.click();
  }

  render(state) {
    /* http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/ */
    const hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };
    const {
      restrictions
    } = this.uppy.opts;
    const accept = restrictions.allowedFileTypes ? restrictions.allowedFileTypes.join(',') : null;
    return h("div", {
      className: "uppy-Root uppy-FileInput-container"
    }, h("input", {
      className: "uppy-FileInput-input",
      style: this.opts.pretty && hiddenInputStyle,
      type: "file",
      name: this.opts.inputName,
      onChange: this.handleInputChange,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: accept,
      ref: input => {
        this.input = input;
      }
    }), this.opts.pretty && h("button", {
      className: "uppy-FileInput-btn",
      type: "button",
      onClick: this.handleClick
    }, this.i18n('chooseFiles')));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.0-alpha.0", _temp);

},{"./../../core":39,"./../../utils/lib/Translator":52,"./../../utils/lib/toArray":71,"preact":7}],43:[function(require,module,exports){
"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const throttle = require('lodash.throttle');

const classNames = require('classnames');

const prettierBytes = require('@transloadit/prettier-bytes');

const prettyETA = require('./../../utils/lib/prettyETA');

const {
  h
} = require('preact');

const statusBarStates = require('./StatusBarStates');

function calculateProcessingProgress(files) {
  // Collect pre or postprocessing progress states.
  const progresses = [];
  Object.keys(files).forEach(fileID => {
    const {
      progress
    } = files[fileID];

    if (progress.preprocess) {
      progresses.push(progress.preprocess);
    }

    if (progress.postprocess) {
      progresses.push(progress.postprocess);
    }
  }); // In the future we should probably do this differently. For now we'll take the
  // mode and message from the first file…

  const {
    mode,
    message
  } = progresses[0];
  const value = progresses.filter(isDeterminate).reduce((total, progress, index, all) => {
    return total + progress.value / all.length;
  }, 0);

  function isDeterminate(progress) {
    return progress.mode === 'determinate';
  }

  return {
    mode,
    message,
    value
  };
}

function togglePauseResume(props) {
  if (props.isAllComplete) return;

  if (!props.resumableUploads) {
    return props.uppy.cancelAll();
  }

  if (props.isAllPaused) {
    return props.uppy.resumeAll();
  }

  return props.uppy.pauseAll();
}

module.exports = props => {
  props = props || {};
  const {
    newFiles,
    allowNewUpload,
    isUploadInProgress,
    isAllPaused,
    resumableUploads,
    error,
    hideUploadButton,
    hidePauseResumeButton,
    hideCancelButton,
    hideRetryButton,
    recoveredState
  } = props;
  const {
    uploadState
  } = props;
  let progressValue = props.totalProgress;
  let progressMode;
  let progressBarContent;

  if (uploadState === statusBarStates.STATE_PREPROCESSING || uploadState === statusBarStates.STATE_POSTPROCESSING) {
    const progress = calculateProcessingProgress(props.files);
    progressMode = progress.mode;

    if (progressMode === 'determinate') {
      progressValue = progress.value * 100;
    }

    progressBarContent = ProgressBarProcessing(progress);
  } else if (uploadState === statusBarStates.STATE_COMPLETE) {
    progressBarContent = ProgressBarComplete(props);
  } else if (uploadState === statusBarStates.STATE_UPLOADING) {
    if (!props.supportsUploadProgress) {
      progressMode = 'indeterminate';
      progressValue = null;
    }

    progressBarContent = ProgressBarUploading(props);
  } else if (uploadState === statusBarStates.STATE_ERROR) {
    progressValue = undefined;
    progressBarContent = ProgressBarError(props);
  }

  const width = typeof progressValue === 'number' ? progressValue : 100;
  let isHidden = uploadState === statusBarStates.STATE_WAITING && props.hideUploadButton || uploadState === statusBarStates.STATE_WAITING && !props.newFiles > 0 || uploadState === statusBarStates.STATE_COMPLETE && props.hideAfterFinish;
  let showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;

  if (recoveredState) {
    isHidden = false;
    showUploadBtn = true;
  }

  const showCancelBtn = !hideCancelButton && uploadState !== statusBarStates.STATE_WAITING && uploadState !== statusBarStates.STATE_COMPLETE;
  const showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === statusBarStates.STATE_UPLOADING;
  const showRetryBtn = error && !hideRetryButton;
  const showDoneBtn = props.doneButtonHandler && uploadState === statusBarStates.STATE_COMPLETE;
  const progressClassNames = `uppy-StatusBar-progress
                           ${progressMode ? `is-${progressMode}` : ''}`;
  const statusBarClassNames = classNames({
    'uppy-Root': props.isTargetDOMEl
  }, 'uppy-StatusBar', `is-${uploadState}`, {
    'has-ghosts': props.isSomeGhost
  });
  return h("div", {
    className: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    className: progressClassNames,
    style: {
      width: `${width}%`
    },
    role: "progressbar",
    "aria-label": `${width}%`,
    "aria-valuetext": `${width}%`,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), progressBarContent, h("div", {
    className: "uppy-StatusBar-actions"
  }, showUploadBtn ? h(UploadBtn, _extends({}, props, {
    uploadState: uploadState
  })) : null, showRetryBtn ? h(RetryBtn, props) : null, showPauseResumeBtn ? h(PauseResumeButton, props) : null, showCancelBtn ? h(CancelBtn, props) : null, showDoneBtn ? h(DoneBtn, props) : null));
};

const UploadBtn = props => {
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': props.uploadState === statusBarStates.STATE_WAITING
  }, {
    'uppy-StatusBar-actionBtn--disabled': props.isSomeGhost
  });
  const uploadBtnText = props.newFiles && props.isUploadStarted && !props.recoveredState ? props.i18n('uploadXNewFiles', {
    smart_count: props.newFiles
  }) : props.i18n('uploadXFiles', {
    smart_count: props.newFiles
  });
  return h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onClick: props.startUpload,
    disabled: props.isSomeGhost,
    "data-uppy-super-focusable": true
  }, uploadBtnText);
};

const RetryBtn = props => {
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": props.i18n('retryUpload'),
    onClick: () => props.uppy.retryAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), props.i18n('retry'));
};

const CancelBtn = props => {
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: props.i18n('cancel'),
    "aria-label": props.i18n('cancel'),
    onClick: () => props.uppy.cancelAll(),
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
};

const PauseResumeButton = props => {
  const {
    isAllPaused,
    i18n
  } = props;
  const title = isAllPaused ? i18n('resume') : i18n('pause');
  return h("button", {
    title: title,
    "aria-label": title,
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onClick: () => togglePauseResume(props),
    "data-uppy-super-focusable": true
  }, isAllPaused ? h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M6 4.25L11.5 8 6 11.75z"
  }))) : h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    fillRule: "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    d: "M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z",
    fill: "#FFF"
  }))));
};

const DoneBtn = props => {
  const {
    i18n
  } = props;
  return h("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: props.doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
};

const LoadingSpinner = () => {
  return h("svg", {
    className: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    fillRule: "evenodd"
  }));
};

const ProgressBarProcessing = props => {
  const value = Math.round(props.value * 100);
  return h("div", {
    className: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), props.mode === 'determinate' ? `${value}% \u00B7 ` : '', props.message);
};

const renderDot = () => ' \u00B7 ';

const ProgressDetails = props => {
  const ifShowFilesUploadedOfTotal = props.numUploads > 1;
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }), h("span", {
    className: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), props.i18n('dataUploadedOfTotal', {
    complete: prettierBytes(props.totalUploadedSize),
    total: prettierBytes(props.totalSize)
  }), renderDot(), props.i18n('xTimeLeft', {
    time: prettyETA(props.totalETA)
  })));
};

const UnknownProgressDetails = props => {
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }));
};

const UploadNewlyAddedFiles = props => {
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    className: "uppy-StatusBar-statusSecondaryHint"
  }, props.i18n('xMoreFilesAdded', {
    smart_count: props.newFiles
  })), h("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onClick: props.startUpload
  }, props.i18n('upload')));
};

const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

const ProgressBarUploading = props => {
  if (!props.isUploadStarted || props.isAllComplete) {
    return null;
  }

  const title = props.isAllPaused ? props.i18n('paused') : props.i18n('uploading');
  const showUploadNewlyAddedFiles = props.newFiles && props.isUploadStarted;
  return h("div", {
    className: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !props.isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, props.supportsUploadProgress ? `${title}: ${props.totalProgress}%` : title), !props.isAllPaused && !showUploadNewlyAddedFiles && props.showProgressDetails ? props.supportsUploadProgress ? h(ThrottledProgressDetails, props) : h(UnknownProgressDetails, props) : null, showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, props) : null));
};

const ProgressBarComplete = ({
  totalProgress,
  i18n
}) => {
  return h("div", {
    className: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
};

const ProgressBarError = ({
  error,
  retryAll,
  hideRetryButton,
  i18n
}) => {
  function displayErrorAlert() {
    const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`; // eslint-disable-next-line no-alert

    alert(errorMessage); // TODO: move to custom alert implementation
  }

  return h("div", {
    className: "uppy-StatusBar-content",
    role: "alert",
    title: i18n('uploadFailed')
  }, h("div", {
    className: "uppy-StatusBar-status"
  }, h("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), i18n('uploadFailed'))), h("button", {
    className: "uppy-StatusBar-details",
    "aria-label": error,
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    onClick: displayErrorAlert,
    type: "button"
  }, "?"));
};

},{"./../../utils/lib/prettyETA":68,"./StatusBarStates":44,"@transloadit/prettier-bytes":1,"classnames":2,"lodash.throttle":4,"preact":7}],44:[function(require,module,exports){
"use strict";

module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

},{}],45:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  UIPlugin
} = require('./../../core');

const Translator = require('./../../utils/lib/Translator');

const getSpeed = require('./../../utils/lib/getSpeed');

const getBytesRemaining = require('./../../utils/lib/getBytesRemaining');

const getTextDirection = require('./../../utils/lib/getTextDirection');

const statusBarStates = require('./StatusBarStates');

const StatusBarUI = require('./StatusBar');
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class = class StatusBar extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.startUpload = () => {
      const {
        recoveredState
      } = this.uppy.getState();

      if (recoveredState) {
        this.uppy.emit('restore-confirmed');
        return;
      }

      return this.uppy.upload().catch(() => {// Error logged in Core
      });
    };

    this.id = this.opts.id || 'StatusBar';
    this.title = 'StatusBar';
    this.type = 'progressindicator';
    this.defaultLocale = {
      strings: {
        uploading: 'Uploading',
        upload: 'Upload',
        complete: 'Complete',
        uploadFailed: 'Upload failed',
        paused: 'Paused',
        retry: 'Retry',
        retryUpload: 'Retry upload',
        cancel: 'Cancel',
        pause: 'Pause',
        resume: 'Resume',
        done: 'Done',
        filesUploadedOfTotal: {
          0: '%{complete} of %{smart_count} file uploaded',
          1: '%{complete} of %{smart_count} files uploaded'
        },
        dataUploadedOfTotal: '%{complete} of %{total}',
        xTimeLeft: '%{time} left',
        uploadXFiles: {
          0: 'Upload %{smart_count} file',
          1: 'Upload %{smart_count} files'
        },
        uploadXNewFiles: {
          0: 'Upload +%{smart_count} file',
          1: 'Upload +%{smart_count} files'
        },
        xMoreFilesAdded: {
          0: '%{smart_count} more file added',
          1: '%{smart_count} more files added'
        }
      }
    }; // set default options

    const defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.install = this.install.bind(this);
  }

  getTotalSpeed(files) {
    let totalSpeed = 0;
    files.forEach(file => {
      totalSpeed += getSpeed(file.progress);
    });
    return totalSpeed;
  }

  getTotalETA(files) {
    const totalSpeed = this.getTotalSpeed(files);

    if (totalSpeed === 0) {
      return 0;
    }

    const totalBytesRemaining = files.reduce((total, file) => {
      return total + getBytesRemaining(file.progress);
    }, 0);
    return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
  }

  getUploadingState(isAllErrored, isAllComplete, recoveredState, files) {
    if (isAllErrored) {
      return statusBarStates.STATE_ERROR;
    }

    if (isAllComplete) {
      return statusBarStates.STATE_COMPLETE;
    }

    if (recoveredState) {
      return statusBarStates.STATE_WAITING;
    }

    let state = statusBarStates.STATE_WAITING;
    const fileIDs = Object.keys(files);

    for (let i = 0; i < fileIDs.length; i++) {
      const {
        progress
      } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

      if (progress.uploadStarted && !progress.uploadComplete) {
        return statusBarStates.STATE_UPLOADING;
      } // If files are being preprocessed AND postprocessed at this time, we show the
      // preprocess state. If any files are being uploaded we show uploading.


      if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
        state = statusBarStates.STATE_PREPROCESSING;
      } // If NO files are being preprocessed or uploaded right now, but some files are
      // being postprocessed, show the postprocess state.


      if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
        state = statusBarStates.STATE_POSTPROCESSING;
      }
    }

    return state;
  }

  render(state) {
    const {
      capabilities,
      files,
      allowNewUpload,
      totalProgress,
      error,
      recoveredState
    } = state;
    const {
      newFiles,
      startedFiles,
      completeFiles,
      inProgressNotPausedFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      isUploadInProgress,
      isSomeGhost
    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
    // for all the files, because in this case it’s not an Upload button,
    // but “Confirm Restore Button”

    const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
    const totalETA = this.getTotalETA(inProgressNotPausedFiles);
    const resumableUploads = !!capabilities.resumableUploads;
    const supportsUploadProgress = capabilities.uploadProgress !== false;
    let totalSize = 0;
    let totalUploadedSize = 0;
    startedFiles.forEach(file => {
      totalSize += file.progress.bytesTotal || 0;
      totalUploadedSize += file.progress.bytesUploaded || 0;
    });
    return StatusBarUI({
      error,
      uploadState: this.getUploadingState(isAllErrored, isAllComplete, recoveredState, state.files || {}),
      allowNewUpload,
      totalProgress,
      totalSize,
      totalUploadedSize,
      isAllComplete,
      isAllPaused,
      isAllErrored,
      isUploadStarted,
      isUploadInProgress,
      isSomeGhost,
      recoveredState,
      complete: completeFiles.length,
      newFiles: newFilesOrRecovered.length,
      numUploads: startedFiles.length,
      totalETA,
      files,
      i18n: this.i18n,
      uppy: this.uppy,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads,
      supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}, _class.VERSION = "2.0.0-alpha.0", _temp);

},{"./../../core":39,"./../../utils/lib/Translator":52,"./../../utils/lib/getBytesRemaining":57,"./../../utils/lib/getSpeed":61,"./../../utils/lib/getTextDirection":62,"./StatusBar":43,"./StatusBarStates":44}],46:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2(...args) {
  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.0-alpha.0";

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],47:[function(require,module,exports){
"use strict";

const tus = require('tus-js-client');

function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
}

function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
} // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.


module.exports = function getFingerprint(uppyFileObj) {
  return (file, options) => {
    if (isCordova() || isReactNative()) {
      return tus.defaultOptions.fingerprint(file, options);
    }

    const uppyFingerprint = ['tus', uppyFileObj.id, options.endpoint].join('-');
    return Promise.resolve(uppyFingerprint);
  };
};

},{"tus-js-client":14}],48:[function(require,module,exports){
"use strict";

var _class, _temp;

const {
  BasePlugin
} = require('./../../core');

const tus = require('tus-js-client');

const {
  Provider,
  RequestClient,
  Socket
} = require('./../../companion-client');

const emitSocketProgress = require('./../../utils/lib/emitSocketProgress');

const getSocketHost = require('./../../utils/lib/getSocketHost');

const settle = require('./../../utils/lib/settle');

const EventTracker = require('./../../utils/lib/EventTracker');

const NetworkError = require('./../../utils/lib/NetworkError');

const isNetworkError = require('./../../utils/lib/isNetworkError');

const {
  RateLimitedQueue
} = require('./../../utils/lib/RateLimitedQueue');

const hasProperty = require('./../../utils/lib/hasProperty');

const getFingerprint = require('./getFingerprint');
/** @typedef {import('..').TusOptions} TusOptions */

/** @typedef {import('tus-js-client').UploadOptions} RawTusOptions */

/** @typedef {import('@uppy/core').Uppy} Uppy */

/** @typedef {import('@uppy/core').UppyFile} UppyFile */

/** @typedef {import('@uppy/core').FailedUppyFile<{}>} FailedUppyFile */

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 *
 * @type {RawTusOptions}
 */


const tusDefaultOptions = {
  endpoint: '',
  uploadUrl: null,
  metadata: {},
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false
};
/**
 * Tus resumable file uploader
 */

module.exports = (_temp = _class = class Tus extends BasePlugin {
  /**
   * @param {Uppy} uppy
   * @param {TusOptions} opts
   */
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'Tus';
    this.title = 'Tus'; // set default options

    const defaultOptions = {
      useFastRemoteRetry: true,
      limit: 5,
      retryDelays: [0, 1000, 3000, 5000],
      withCredentials: false
    }; // merge default options with the ones set by user

    /** @type {import("..").TusOptions} */

    this.opts = { ...defaultOptions,
      ...opts
    };

    if ('autoRetry' in opts) {
      throw new Error('The `autoRetry` option was deprecated and has been removed.');
    }
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */


    this.requests = new RateLimitedQueue(this.opts.limit);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
    this.handleResetProgress = this.handleResetProgress.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleResetProgress() {
    const files = { ...this.uppy.getState().files
    };
    Object.keys(files).forEach(fileID => {
      // Only clone the file object if it has a Tus `uploadUrl` attached.
      if (files[fileID].tus && files[fileID].tus.uploadUrl) {
        const tusState = { ...files[fileID].tus
        };
        delete tusState.uploadUrl;
        files[fileID] = { ...files[fileID],
          tus: tusState
        };
      }
    });
    this.uppy.setState({
      files
    });
  }
  /**
   * Clean up all references for a file's upload: the tus.Upload instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * @param {string} fileID
   */


  resetUploaderReferences(fileID, opts = {}) {
    if (this.uploaders[fileID]) {
      const uploader = this.uploaders[fileID];
      uploader.abort();

      if (opts.abort) {
        uploader.abort(true);
      }

      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }
  /**
   * Create a new Tus upload.
   *
   * A lot can happen during an upload, so this is quite hard to follow!
   * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
   *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
   *   When an upload starts, we store the tus.Upload instance, and an EventTracker instance that manages the event listeners
   *   for pausing, cancellation, removal, etc.
   * - While the upload is in progress, it may be paused or cancelled.
   *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
   *   maintained.
   *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload-- the `tus.Upload`
   *   instance is aborted and discarded, the EventTracker instance is destroyed (removing all listeners).
   *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
   *   bypassing the limit.
   * - After completing an upload, the tus.Upload and EventTracker instances are cleaned up, and the upload is marked as done
   *   in the `this.requests` queue.
   * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is
   *   rejected.
   *
   * When working on this function, keep in mind:
   *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventTracker instances need to be cleaned
   *    up using this.resetUploaderReferences().
   *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using
   *    `queuedRequest.abort()`.
   *  - When an upload is completed for any reason, including errors, it needs to be marked as such using
   *    `queuedRequest.done()`.
   *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable
   *    must be updated so the other uses of it are valid.
   *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking
   *    up a spot in the queue.
   *
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  upload(file, current, total) {
    this.resetUploaderReferences(file.id); // Create a new tus upload

    return new Promise((resolve, reject) => {
      this.uppy.emit('upload-started', file);
      const opts = { ...this.opts,
        ...(file.tus || {})
      };
      /** @type {RawTusOptions} */

      const uploadOptions = { ...tusDefaultOptions,
        ...opts
      }; // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
      // now also includes `relativePath` for files added from folders.
      // This means you can add 2 identical files, if one is in folder a,
      // the other in folder b.

      uploadOptions.fingerprint = getFingerprint(file);

      uploadOptions.onBeforeRequest = req => {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = !!opts.withCredentials;

        if (typeof opts.onBeforeRequest === 'function') {
          opts.onBeforeRequest(req);
        }
      };

      uploadOptions.onError = err => {
        this.uppy.log(err);
        const xhr = err.originalRequest ? err.originalRequest.getUnderlyingObject() : null;

        if (isNetworkError(xhr)) {
          err = new NetworkError(err, xhr);
        }

        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-error', file, err);
        reject(err);
      };

      uploadOptions.onProgress = (bytesUploaded, bytesTotal) => {
        this.onReceiveUploadUrl(file, upload.url);
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      uploadOptions.onSuccess = () => {
        const uploadResp = {
          uploadURL: upload.url
        };
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        this.uppy.emit('upload-success', file, uploadResp);

        if (upload.url) {
          this.uppy.log(`Download ${upload.file.name} from ${upload.url}`);
        }

        resolve(upload);
      };

      const copyProp = (obj, srcProp, destProp) => {
        if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
          obj[destProp] = obj[srcProp];
        }
      };
      /** @type {Record<string, string>} */


      const meta = {};
      const metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(item => {
        meta[item] = file.meta[item];
      }); // tusd uses metadata fields 'filetype' and 'filename'

      copyProp(meta, 'type', 'filetype');
      copyProp(meta, 'name', 'filename');
      uploadOptions.metadata = meta;
      const upload = new tus.Upload(file.data, uploadOptions);
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      upload.findPreviousUploads().then(previousUploads => {
        const previousUpload = previousUploads[0];

        if (previousUpload) {
          this.uppy.log(`[Tus] Resuming upload of ${file.id} started at ${previousUpload.creationTime}`);
          upload.resumeFromPreviousUpload(previousUpload);
        }
      });
      let queuedRequest = this.requests.run(() => {
        if (!file.isPaused) {
          upload.start();
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
      this.onFileRemove(file.id, targetFileID => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${targetFileID} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.abort();
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            upload.start();
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        upload.abort();
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: !!upload.url
        });
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = this.requests.run(() => {
          upload.start();
          return () => {};
        });
      });
    }).catch(err => {
      this.uppy.emit('upload-error', file, err);
      throw err;
    });
  }
  /**
   * @param {UppyFile} file for use with upload
   * @param {number} current file in a queue
   * @param {number} total number of files in a queue
   * @returns {Promise<void>}
   */


  uploadRemote(file) {
    this.resetUploaderReferences(file.id);
    const opts = { ...this.opts
    };

    if (file.tus) {
      // Install file-specific upload overrides.
      Object.assign(opts, file.tus);
    }

    this.uppy.emit('upload-started', file);
    this.uppy.log(file.remote.url);

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise((resolve, reject) => {
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions); // !! cancellation is NOT supported at this stage yet

      client.post(file.remote.url, { ...file.remote.body,
        endpoint: opts.endpoint,
        uploadUrl: opts.uploadUrl,
        protocol: 'tus',
        size: file.data.size,
        headers: opts.headers,
        metadata: file.meta
      }).then(res => {
        this.uppy.setFileState(file.id, {
          serverToken: res.token
        });
        file = this.uppy.getFile(file.id);
        return this.connectToServerSocket(file);
      }).then(() => {
        resolve();
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }
  /**
   * See the comment on the upload() method.
   *
   * Additionally, when an upload is removed, completed, or cancelled, we need to close the WebSocket connection. This is
   * handled by the resetUploaderReferences() function, so the same guidelines apply as in upload().
   *
   * @param {UppyFile} file
   */


  connectToServerSocket(file) {
    return new Promise((resolve, reject) => {
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`,
        autoOpen: false
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was removed`);
      });
      this.onPause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id);
        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
          return () => {};
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        // See the comment in the onRetry() call
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        const {
          message
        } = errData.error;
        const error = Object.assign(new Error(message), {
          cause: errData.error
        }); // If the remote retry optimisation should not be used,
        // close the socket—this will tell companion to clear state and delete the file.

        if (!this.opts.useFastRemoteRetry) {
          this.resetUploaderReferences(file.id); // Remove the serverToken so that a new one will be created for the retry.

          this.uppy.setFileState(file.id, {
            serverToken: null
          });
        } else {
          socket.close();
        }

        this.uppy.emit('upload-error', file, error);
        queuedRequest.done();
        reject(error);
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      let queuedRequest = this.requests.run(() => {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.
        // Also, we need to remove the request from the queue _without_ destroying everything
        // related to this upload to handle pauses.


        return () => {};
      });
    });
  }
  /**
   * Store the uploadUrl on the file options, so that when Golden Retriever
   * restores state, we will continue uploading to the correct URL.
   *
   * @param {UppyFile} file
   * @param {string} uploadURL
   */


  onReceiveUploadUrl(file, uploadURL) {
    const currentFile = this.uppy.getFile(file.id);
    if (!currentFile) return; // Only do the update if we didn't have an upload URL yet.

    if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
      this.uppy.log('[Tus] Storing upload url');
      this.uppy.setFileState(currentFile.id, {
        tus: { ...currentFile.tus,
          uploadUrl: uploadURL
        }
      });
    }
  }
  /**
   * @param {string} fileID
   * @param {function(string): void} cb
   */


  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }
  /**
   * @param {string} fileID
   * @param {function(boolean): void} cb
   */


  onPause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', filesToRetry => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onCancelAll(fileID, cb) {
    this.uploaderEvents[fileID].on('cancel-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {string} fileID
   * @param {function(): void} cb
   */


  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }
  /**
   * @param {(UppyFile | FailedUppyFile)[]} files
   */


  uploadFiles(files) {
    const promises = files.map((file, i) => {
      const current = i + 1;
      const total = files.length;

      if ('error' in file && file.error) {
        return Promise.reject(new Error(file.error));
      }

      if (file.isRemote) {
        // We emit upload-started here, so that it's also emitted for files
        // that have to wait due to the `limit` option.
        // Don't double-emit upload-started for Golden Retriever-restored files that were already started
        if (!file.progress.uploadStarted || !file.isRestored) {
          this.uppy.emit('upload-started', file);
        }

        return this.uploadRemote(file, current, total);
      } // Don't double-emit upload-started for Golden Retriever-restored files that were already started


      if (!file.progress.uploadStarted || !file.isRestored) {
        this.uppy.emit('upload-started', file);
      }

      return this.upload(file, current, total);
    });
    return settle(promises);
  }
  /**
   * @param {string[]} fileIDs
   */


  handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[Tus] No files to upload');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
    }

    this.uppy.log('[Tus] Uploading...');
    const filesToUpload = fileIDs.map(fileID => this.uppy.getFile(fileID));
    return this.uploadFiles(filesToUpload).then(() => null);
  }

  install() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addUploader(this.handleUpload);
    this.uppy.on('reset-progress', this.handleResetProgress);
  }

  uninstall() {
    this.uppy.setState({
      capabilities: { ...this.uppy.getState().capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removeUploader(this.handleUpload);
  }

}, _class.VERSION = "2.0.0-alpha.0", _temp);

},{"./../../companion-client":32,"./../../core":39,"./../../utils/lib/EventTracker":49,"./../../utils/lib/NetworkError":50,"./../../utils/lib/RateLimitedQueue":51,"./../../utils/lib/emitSocketProgress":53,"./../../utils/lib/getSocketHost":60,"./../../utils/lib/hasProperty":64,"./../../utils/lib/isNetworkError":66,"./../../utils/lib/settle":70,"./getFingerprint":47,"tus-js-client":14}],49:[function(require,module,exports){
"use strict";

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

},{}],50:[function(require,module,exports){
"use strict";

class NetworkError extends Error {
  constructor(error, xhr = null) {
    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

},{}],51:[function(require,module,exports){
"use strict";

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    return (...args) => {
      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options = {}) {
  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

},{}],52:[function(require,module,exports){
"use strict";

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = require('./hasProperty');

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

},{"./hasProperty":64}],53:[function(require,module,exports){
"use strict";

const throttle = require('lodash.throttle');

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

},{"lodash.throttle":4}],54:[function(require,module,exports){
"use strict";

const NetworkError = require('./NetworkError');
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError(...options) {
  return fetch(...options).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

},{"./NetworkError":50}],55:[function(require,module,exports){
"use strict";

const isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context = document) {
  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

},{"./isDOMElement":65}],56:[function(require,module,exports){
"use strict";

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

},{}],57:[function(require,module,exports){
"use strict";

module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

},{}],58:[function(require,module,exports){
"use strict";

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

},{}],59:[function(require,module,exports){
"use strict";

const getFileNameAndExtension = require('./getFileNameAndExtension');

const mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

},{"./getFileNameAndExtension":58,"./mimeTypes":67}],60:[function(require,module,exports){
"use strict";

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

},{}],61:[function(require,module,exports){
"use strict";

module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  const timeElapsed = Date.now() - fileProgress.uploadStarted;
  const uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

},{}],62:[function(require,module,exports){
"use strict";

/**
 * Get the declared text direction for an element.
 *
 * @param {Node} element
 * @returns {string|undefined}
 */
function getTextDirection(element) {
  var _element;

  // There is another way to determine text direction using getComputedStyle(), as done here:
  // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
  //
  // We do not use that approach because we are interested specifically in the _declared_ text direction.
  // If no text direction is declared, we have to provide our own explicit text direction so our
  // bidirectional CSS style sheets work.
  while (element && !element.dir) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }

  return (_element = element) == null ? void 0 : _element.dir;
}

module.exports = getTextDirection;

},{}],63:[function(require,module,exports){
"use strict";

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

},{}],64:[function(require,module,exports){
"use strict";

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

},{}],65:[function(require,module,exports){
"use strict";

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

},{}],66:[function(require,module,exports){
"use strict";

function isNetworkError(xhr) {
  if (!xhr) {
    return false;
  }

  return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
}

module.exports = isNetworkError;

},{}],67:[function(require,module,exports){
"use strict";

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

},{}],68:[function(require,module,exports){
"use strict";

const secondsToTime = require('./secondsToTime');

module.exports = function prettyETA(seconds) {
  const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
  const minutesStr = time.minutes === 0 ? '' : `${time.hours === 0 ? time.minutes : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
  const secondsStr = time.hours !== 0 ? '' : `${time.minutes === 0 ? time.seconds : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

},{"./secondsToTime":69}],69:[function(require,module,exports){
"use strict";

module.exports = function secondsToTime(rawSeconds) {
  const hours = Math.floor(rawSeconds / 3600) % 24;
  const minutes = Math.floor(rawSeconds / 60) % 60;
  const seconds = Math.floor(rawSeconds % 60);
  return {
    hours,
    minutes,
    seconds
  };
};

},{}],70:[function(require,module,exports){
"use strict";

module.exports = function settle(promises) {
  const resolutions = [];
  const rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  const wait = Promise.all(promises.map(promise => promise.then(resolved, rejected)));
  return wait.then(() => {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};

},{}],71:[function(require,module,exports){
"use strict";

/**
 * Converts list into array
 */
module.exports = Array.from;

},{}],72:[function(require,module,exports){
"use strict";

const Uppy = require('./../../../../packages/@uppy/core');

const FileInput = require('./../../../../packages/@uppy/file-input');

const StatusBar = require('./../../../../packages/@uppy/status-bar');

const Tus = require('./../../../../packages/@uppy/tus');

const uppyOne = new Uppy({
  debug: true,
  autoProceed: true
});
uppyOne.use(FileInput, {
  target: '.UppyInput',
  pretty: false
}).use(Tus, {
  endpoint: 'https://tusd.tusdemo.net/files/'
}).use(StatusBar, {
  target: '.UppyInput-Progress',
  hideUploadButton: true,
  hideAfterFinish: false
});

},{"./../../../../packages/@uppy/core":39,"./../../../../packages/@uppy/file-input":42,"./../../../../packages/@uppy/status-bar":45,"./../../../../packages/@uppy/tus":48}]},{},[72])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQHRyYW5zbG9hZGl0L3ByZXR0aWVyLWJ5dGVzL3ByZXR0aWVyQnl0ZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9qcy1iYXNlNjQvYmFzZTY0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9taW1lLW1hdGNoL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbWVzcGFjZS1lbWl0dGVyL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmdpZnkvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmVxdWlyZXMtcG9ydC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9maWxlUmVhZGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL2ZpbmdlcnByaW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL2h0dHBTdGFjay5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9pc0NvcmRvdmEuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvaXNSZWFjdE5hdGl2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy90dXMtanMtY2xpZW50L2xpYi5lczUvYnJvd3Nlci9yZWFkQXNCeXRlQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Jyb3dzZXIvdXJpVG9CbG9iLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9icm93c2VyL3VybFN0b3JhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L2Vycm9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS9sb2dnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L25vb3BVcmxTdG9yYWdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3R1cy1qcy1jbGllbnQvbGliLmVzNS91cGxvYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvdHVzLWpzLWNsaWVudC9saWIuZXM1L3V1aWQuanMiLCIuLi9ub2RlX21vZHVsZXMvdXJsLXBhcnNlL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3dpbGRjYXJkL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvQXV0aEVycm9yLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvUHJvdmlkZXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9SZXF1ZXN0Q2xpZW50LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29tcGFuaW9uLWNsaWVudC9zcmMvU2VhcmNoUHJvdmlkZXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9Tb2NrZXQuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb21wYW5pb24tY2xpZW50L3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvbXBhbmlvbi1jbGllbnQvc3JjL3Rva2VuU3RvcmFnZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmNqcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguY2pzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvQmFzZVBsdWdpbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL1VJUGx1Z2luLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvY29yZS9zcmMvZ2V0RmlsZU5hbWUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L2NvcmUvc3JjL2xvZ2dlcnMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9jb3JlL3NyYy9zdXBwb3J0c1VwbG9hZFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvZmlsZS1pbnB1dC9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdGF0dXMtYmFyL3NyYy9TdGF0dXNCYXIuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdGF0dXMtYmFyL3NyYy9TdGF0dXNCYXJTdGF0ZXMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS9zdGF0dXMtYmFyL3NyYy9pbmRleC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3N0b3JlLWRlZmF1bHQvc3JjL2luZGV4LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdHVzL3NyYy9nZXRGaW5nZXJwcmludC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3R1cy9zcmMvaW5kZXguanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvRXZlbnRUcmFja2VyLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL05ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9SYXRlTGltaXRlZFF1ZXVlLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL1RyYW5zbGF0b3IuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZW1pdFNvY2tldFByb2dyZXNzLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2ZldGNoV2l0aE5ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9maW5kRE9NRWxlbWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZW5lcmF0ZUZpbGVJRC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRCeXRlc1JlbWFpbmluZy5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbi5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRGaWxlVHlwZS5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9nZXRTb2NrZXRIb3N0LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFNwZWVkLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2dldFRleHREaXJlY3Rpb24uanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvZ2V0VGltZVN0YW1wLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2hhc1Byb3BlcnR5LmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL2lzRE9NRWxlbWVudC5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9pc05ldHdvcmtFcnJvci5qcyIsIi4uL3BhY2thZ2VzL0B1cHB5L3V0aWxzL3NyYy9taW1lVHlwZXMuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvcHJldHR5RVRBLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3NlY29uZHNUb1RpbWUuanMiLCIuLi9wYWNrYWdlcy9AdXBweS91dGlscy9zcmMvc2V0dGxlLmpzIiwiLi4vcGFja2FnZXMvQHVwcHkvdXRpbHMvc3JjL3RvQXJyYXkuanMiLCJzcmMvZXhhbXBsZXMvc3RhdHVzYmFyL2FwcC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdmJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQXdCLEVBQUEsTUFBTSxFQUFFO0FBQWhDLENBRGxCLEVBRUcsR0FGSCxDQUVPLEdBRlAsRUFFWTtBQUFFLEVBQUEsUUFBUSxFQUFFO0FBQVosQ0FGWixFQUdHLEdBSEgsQ0FHTyxTQUhQLEVBR2tCO0FBQ2QsRUFBQSxNQUFNLEVBQUUscUJBRE07QUFFZCxFQUFBLGdCQUFnQixFQUFFLElBRko7QUFHZCxFQUFBLGVBQWUsRUFBRTtBQUhILENBSGxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GbGV0L3ByZXR0aWVyLWJ5dGVzL1xuLy8gQ2hhbmdpbmcgMTAwMCBieXRlcyB0byAxMDI0LCBzbyB3ZSBjYW4ga2VlcCB1cHBlcmNhc2UgS0IgdnMga0Jcbi8vIElTQyBMaWNlbnNlIChjKSBEYW4gRmxldHRyZSBodHRwczovL2dpdGh1Yi5jb20vRmxldC9wcmV0dGllci1ieXRlcy9ibG9iL21hc3Rlci9MSUNFTlNFXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByZXR0aWVyQnl0ZXMgKG51bSkge1xuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbnVtYmVyLCBnb3QgJyArIHR5cGVvZiBudW0pXG4gIH1cblxuICB2YXIgbmVnID0gbnVtIDwgMFxuICB2YXIgdW5pdHMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InLCAnVEInLCAnUEInLCAnRUInLCAnWkInLCAnWUInXVxuXG4gIGlmIChuZWcpIHtcbiAgICBudW0gPSAtbnVtXG4gIH1cblxuICBpZiAobnVtIDwgMSkge1xuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtICsgJyBCJ1xuICB9XG5cbiAgdmFyIGV4cG9uZW50ID0gTWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhudW0pIC8gTWF0aC5sb2coMTAyNCkpLCB1bml0cy5sZW5ndGggLSAxKVxuICBudW0gPSBOdW1iZXIobnVtIC8gTWF0aC5wb3coMTAyNCwgZXhwb25lbnQpKVxuICB2YXIgdW5pdCA9IHVuaXRzW2V4cG9uZW50XVxuXG4gIGlmIChudW0gPj0gMTAgfHwgbnVtICUgMSA9PT0gMCkge1xuICAgIC8vIERvIG5vdCBzaG93IGRlY2ltYWxzIHdoZW4gdGhlIG51bWJlciBpcyB0d28tZGlnaXQsIG9yIGlmIHRoZSBudW1iZXIgaGFzIG5vXG4gICAgLy8gZGVjaW1hbCBjb21wb25lbnQuXG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0udG9GaXhlZCgwKSArICcgJyArIHVuaXRcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bS50b0ZpeGVkKDEpICsgJyAnICsgdW5pdFxuICB9XG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE4IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0aWYgKGFyZy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdFx0aWYgKGlubmVyKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaW5uZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoYXJnLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZy50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qXG4gKiAgYmFzZTY0LmpzXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBCU0QgMy1DbGF1c2UgTGljZW5zZS5cbiAqICAgIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqXG4gKiAgUmVmZXJlbmNlczpcbiAqICAgIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0XG4gKi9cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShnbG9iYWwpXG4gICAgICAgIDogdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKGZhY3RvcnkpIDogZmFjdG9yeShnbG9iYWwpXG59KChcbiAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3dcbiAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFxuOiB0aGlzXG4pLCBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gZXhpc3RpbmcgdmVyc2lvbiBmb3Igbm9Db25mbGljdCgpXG4gICAgZ2xvYmFsID0gZ2xvYmFsIHx8IHt9O1xuICAgIHZhciBfQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB2YXIgdmVyc2lvbiA9IFwiMi42LjRcIjtcbiAgICAvLyBjb25zdGFudHNcbiAgICB2YXIgYjY0Y2hhcnNcbiAgICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4gICAgdmFyIGI2NHRhYiA9IGZ1bmN0aW9uKGJpbikge1xuICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJpbi5sZW5ndGg7IGkgPCBsOyBpKyspIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIHJldHVybiBjYyA8IDB4ODAgPyBjXG4gICAgICAgICAgICAgICAgOiBjYyA8IDB4ODAwID8gKGZyb21DaGFyQ29kZSgweGMwIHwgKGNjID4+PiA2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8IChjYyAmIDB4M2YpKSlcbiAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKChjYyA+Pj4gIDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoIGNjICAgICAgICAgJiAweDNmKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiAxMikgJiAweDNmKSlcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+ICA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKCBjYyAgICAgICAgICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlX3V0b2IgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGRl18W15cXHgwMC1cXHg3Rl0vZztcbiAgICB2YXIgdXRvYiA9IGZ1bmN0aW9uKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbihjY2MpIHtcbiAgICAgICAgdmFyIHBhZGxlbiA9IFswLCAyLCAxXVtjY2MubGVuZ3RoICUgM10sXG4gICAgICAgIG9yZCA9IGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2XG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDEgPyBjY2MuY2hhckNvZGVBdCgxKSA6IDApIDw8IDgpXG4gICAgICAgICAgICB8ICgoY2NjLmxlbmd0aCA+IDIgPyBjY2MuY2hhckNvZGVBdCgyKSA6IDApKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgJiYgdHlwZW9mIGdsb2JhbC5idG9hID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihiKXsgcmV0dXJuIGdsb2JhbC5idG9hKGIpIH0gOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmIChiLm1hdGNoKC9bXlxceDAwLVxceEZGXS8pKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICdUaGUgc3RyaW5nIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gZnVuY3Rpb24odSkge1xuICAgICAgICByZXR1cm4gYnRvYSh1dG9iKFN0cmluZyh1KSkpO1xuICAgIH07XG4gICAgdmFyIG1rVXJpU2FmZSA9IGZ1bmN0aW9uIChiNjQpIHtcbiAgICAgICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgIHJldHVybiBtMCA9PSAnKycgPyAnLScgOiAnXyc7XG4gICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uKHUsIHVyaXNhZmUpIHtcbiAgICAgICAgcmV0dXJuIHVyaXNhZmUgPyBta1VyaVNhZmUoX2VuY29kZSh1KSkgOiBfZW5jb2RlKHUpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uKHUpIHsgcmV0dXJuIGVuY29kZSh1LCB0cnVlKSB9O1xuICAgIHZhciBmcm9tVWludDhBcnJheTtcbiAgICBpZiAoZ2xvYmFsLlVpbnQ4QXJyYXkpIGZyb21VaW50OEFycmF5ID0gZnVuY3Rpb24oYSwgdXJpc2FmZSkge1xuICAgICAgICAvLyByZXR1cm4gYnRvYShmcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYSkpO1xuICAgICAgICB2YXIgYjY0ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYS5sZW5ndGg7IGkgPCBsOyBpICs9IDMpIHtcbiAgICAgICAgICAgIHZhciBhMCA9IGFbaV0sIGExID0gYVtpKzFdLCBhMiA9IGFbaSsyXTtcbiAgICAgICAgICAgIHZhciBvcmQgPSBhMCA8PCAxNiB8IGExIDw8IDggfCBhMjtcbiAgICAgICAgICAgIGI2NCArPSAgICBiNjRjaGFycy5jaGFyQXQoIG9yZCA+Pj4gMTgpXG4gICAgICAgICAgICAgICAgKyAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTEgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoKG9yZCA+Pj4gIDYpICYgNjMpIDogJz0nKVxuICAgICAgICAgICAgICAgICsgKCB0eXBlb2YgYTIgIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBiNjRjaGFycy5jaGFyQXQoIG9yZCAgICAgICAgICYgNjMpIDogJz0nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJpc2FmZSA/IG1rVXJpU2FmZShiNjQpIDogYjY0O1xuICAgIH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gL1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdfFtcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9fFtcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9L2c7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbihjY2NjKSB7XG4gICAgICAgIHN3aXRjaChjY2NjLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICB2YXIgY3AgPSAoKDB4MDcgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDE4KVxuICAgICAgICAgICAgICAgIHwgICAgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCAxMilcbiAgICAgICAgICAgICAgICB8ICAgICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgIDYpXG4gICAgICAgICAgICAgICAgfCAgICAgKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMykpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gY3AgLSAweDEwMDAwO1xuICAgICAgICAgICAgcmV0dXJuIChmcm9tQ2hhckNvZGUoKG9mZnNldCAgPj4+IDEwKSArIDB4RDgwMClcbiAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoKG9mZnNldCAmIDB4M0ZGKSArIDB4REMwMCkpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKFxuICAgICAgICAgICAgICAgICgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gIGZyb21DaGFyQ29kZShcbiAgICAgICAgICAgICAgICAoKDB4MWYgJiBjY2NjLmNoYXJDb2RlQXQoMCkpIDw8IDYpXG4gICAgICAgICAgICAgICAgICAgIHwgICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGJ0b3UgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UocmVfYnRvdSwgY2JfYnRvdSk7XG4gICAgfTtcbiAgICB2YXIgY2JfZGVjb2RlID0gZnVuY3Rpb24oY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsXG4gICAgICAgIHBhZGxlbiA9IGxlbiAlIDQsXG4gICAgICAgIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgIDYgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMyA/IGI2NHRhYltjY2NjLmNoYXJBdCgzKV0gICAgICAgOiAwKSxcbiAgICAgICAgY2hhcnMgPSBbXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gPj4+IDE2KSxcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZSgobiA+Pj4gIDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoIG4gICAgICAgICAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIF9hdG9iID0gZ2xvYmFsLmF0b2IgJiYgdHlwZW9mIGdsb2JhbC5hdG9iID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBmdW5jdGlvbihhKXsgcmV0dXJuIGdsb2JhbC5hdG9iKGEpIH0gOiBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIGEucmVwbGFjZSgvXFxTezEsNH0vZywgY2JfZGVjb2RlKTtcbiAgICB9O1xuICAgIHZhciBhdG9iID0gZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gX2F0b2IoU3RyaW5nKGEpLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJykpO1xuICAgIH07XG4gICAgdmFyIF9kZWNvZGUgPSBmdW5jdGlvbihhKSB7IHJldHVybiBidG91KF9hdG9iKGEpKSB9O1xuICAgIHZhciBfZnJvbVVSSSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uKG0wKSB7XG4gICAgICAgICAgICByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nXG4gICAgICAgIH0pLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJyk7XG4gICAgfTtcbiAgICB2YXIgZGVjb2RlID0gZnVuY3Rpb24oYSl7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKF9mcm9tVVJJKGEpKTtcbiAgICB9O1xuICAgIHZhciB0b1VpbnQ4QXJyYXk7XG4gICAgaWYgKGdsb2JhbC5VaW50OEFycmF5KSB0b1VpbnQ4QXJyYXkgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LmZyb20oYXRvYihfZnJvbVVSSShhKSksIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgICAgIGdsb2JhbC5CYXNlNjQgPSBfQmFzZTY0O1xuICAgICAgICByZXR1cm4gQmFzZTY0O1xuICAgIH07XG4gICAgLy8gZXhwb3J0IEJhc2U2NFxuICAgIGdsb2JhbC5CYXNlNjQgPSB7XG4gICAgICAgIFZFUlNJT046IHZlcnNpb24sXG4gICAgICAgIGF0b2I6IGF0b2IsXG4gICAgICAgIGJ0b2E6IGJ0b2EsXG4gICAgICAgIGZyb21CYXNlNjQ6IGRlY29kZSxcbiAgICAgICAgdG9CYXNlNjQ6IGVuY29kZSxcbiAgICAgICAgdXRvYjogdXRvYixcbiAgICAgICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgICAgIGVuY29kZVVSSTogZW5jb2RlVVJJLFxuICAgICAgICBidG91OiBidG91LFxuICAgICAgICBkZWNvZGU6IGRlY29kZSxcbiAgICAgICAgbm9Db25mbGljdDogbm9Db25mbGljdCxcbiAgICAgICAgZnJvbVVpbnQ4QXJyYXk6IGZyb21VaW50OEFycmF5LFxuICAgICAgICB0b1VpbnQ4QXJyYXk6IHRvVWludDhBcnJheVxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZTp2LGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX07XG4gICAgICAgIH07XG4gICAgICAgIGdsb2JhbC5CYXNlNjQuZXh0ZW5kU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIFN0cmluZy5wcm90b3R5cGUsICdmcm9tQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZSh0aGlzKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKHVyaXNhZmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlKHRoaXMsIHRydWUpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvL1xuICAgIC8vIGV4cG9ydCBCYXNlNjQgdG8gdGhlIG5hbWVzcGFjZVxuICAgIC8vXG4gICAgaWYgKGdsb2JhbFsnTWV0ZW9yJ10pIHsgLy8gTWV0ZW9yLmpzXG4gICAgICAgIEJhc2U2NCA9IGdsb2JhbC5CYXNlNjQ7XG4gICAgfVxuICAgIC8vIG1vZHVsZS5leHBvcnRzIGFuZCBBTUQgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS5cbiAgICAvLyBtb2R1bGUuZXhwb3J0cyBoYXMgcHJlY2VkZW5jZS5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuQmFzZTY0ID0gZ2xvYmFsLkJhc2U2NDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZ2xvYmFsLkJhc2U2NCB9KTtcbiAgICB9XG4gICAgLy8gdGhhdCdzIGl0IVxuICAgIHJldHVybiB7QmFzZTY0OiBnbG9iYWwuQmFzZTY0fVxufSkpO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIHdpbGRjYXJkID0gcmVxdWlyZSgnd2lsZGNhcmQnKTtcbnZhciByZU1pbWVQYXJ0U3BsaXQgPSAvW1xcL1xcK1xcLl0vO1xuXG4vKipcbiAgIyBtaW1lLW1hdGNoXG5cbiAgQSBzaW1wbGUgZnVuY3Rpb24gdG8gY2hlY2tlciB3aGV0aGVyIGEgdGFyZ2V0IG1pbWUgdHlwZSBtYXRjaGVzIGEgbWltZS10eXBlXG4gIHBhdHRlcm4gKGUuZy4gaW1hZ2UvanBlZyBtYXRjaGVzIGltYWdlL2pwZWcgT1IgaW1hZ2UvKikuXG5cbiAgIyMgRXhhbXBsZSBVc2FnZVxuXG4gIDw8PCBleGFtcGxlLmpzXG5cbioqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHBhdHRlcm4pIHtcbiAgZnVuY3Rpb24gdGVzdChwYXR0ZXJuKSB7XG4gICAgdmFyIHJlc3VsdCA9IHdpbGRjYXJkKHBhdHRlcm4sIHRhcmdldCwgcmVNaW1lUGFydFNwbGl0KTtcblxuICAgIC8vIGVuc3VyZSB0aGF0IHdlIGhhdmUgYSB2YWxpZCBtaW1lIHR5cGUgKHNob3VsZCBoYXZlIHR3byBwYXJ0cylcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPj0gMjtcbiAgfVxuXG4gIHJldHVybiBwYXR0ZXJuID8gdGVzdChwYXR0ZXJuLnNwbGl0KCc7JylbMF0pIDogdGVzdDtcbn07XG4iLCIvKipcbiogQ3JlYXRlIGFuIGV2ZW50IGVtaXR0ZXIgd2l0aCBuYW1lc3BhY2VzXG4qIEBuYW1lIGNyZWF0ZU5hbWVzcGFjZUVtaXR0ZXJcbiogQGV4YW1wbGVcbiogdmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2luZGV4JykoKVxuKlxuKiBlbWl0dGVyLm9uKCcqJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdhbGwgZXZlbnRzIGVtaXR0ZWQnLCB0aGlzLmV2ZW50KVxuKiB9KVxuKlxuKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge1xuKiAgIGNvbnNvbGUubG9nKCdleGFtcGxlIGV2ZW50IGVtaXR0ZWQnKVxuKiB9KVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTmFtZXNwYWNlRW1pdHRlciAoKSB7XG4gIHZhciBlbWl0dGVyID0ge31cbiAgdmFyIF9mbnMgPSBlbWl0dGVyLl9mbnMgPSB7fVxuXG4gIC8qKlxuICAqIEVtaXQgYW4gZXZlbnQuIE9wdGlvbmFsbHkgbmFtZXNwYWNlIHRoZSBldmVudC4gSGFuZGxlcnMgYXJlIGZpcmVkIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHdlcmUgYWRkZWQgd2l0aCBleGFjdCBtYXRjaGVzIHRha2luZyBwcmVjZWRlbmNlLiBTZXBhcmF0ZSB0aGUgbmFtZXNwYWNlIGFuZCBldmVudCB3aXRoIGEgYDpgXG4gICogQG5hbWUgZW1pdFxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCDigJMgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LCB3aXRoIG9wdGlvbmFsIG5hbWVzcGFjZVxuICAqIEBwYXJhbSB7Li4uKn0gZGF0YSDigJMgdXAgdG8gNiBhcmd1bWVudHMgdGhhdCBhcmUgcGFzc2VkIHRvIHRoZSBldmVudCBsaXN0ZW5lclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5lbWl0KCdleGFtcGxlJylcbiAgKiBlbWl0dGVyLmVtaXQoJ2RlbW86dGVzdCcpXG4gICogZW1pdHRlci5lbWl0KCdkYXRhJywgeyBleGFtcGxlOiB0cnVlfSwgJ2Egc3RyaW5nJywgMSlcbiAgKi9cbiAgZW1pdHRlci5lbWl0ID0gZnVuY3Rpb24gZW1pdCAoZXZlbnQsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzYpIHtcbiAgICB2YXIgdG9FbWl0ID0gZ2V0TGlzdGVuZXJzKGV2ZW50KVxuXG4gICAgaWYgKHRvRW1pdC5sZW5ndGgpIHtcbiAgICAgIGVtaXRBbGwoZXZlbnQsIHRvRW1pdCwgW2FyZzEsIGFyZzIsIGFyZzMsIGFyZzQsIGFyZzUsIGFyZzZdKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBlbiBldmVudCBsaXN0ZW5lci5cbiAgKiBAbmFtZSBvblxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9uKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge30pXG4gICogZW1pdHRlci5vbignZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uID0gZnVuY3Rpb24gb24gKGV2ZW50LCBmbikge1xuICAgIGlmICghX2Zuc1tldmVudF0pIHtcbiAgICAgIF9mbnNbZXZlbnRdID0gW11cbiAgICB9XG5cbiAgICBfZm5zW2V2ZW50XS5wdXNoKGZuKVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGVuIGV2ZW50IGxpc3RlbmVyIHRoYXQgZmlyZXMgb25jZS5cbiAgKiBAbmFtZSBvbmNlXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub25jZSgnZXhhbXBsZScsIGZ1bmN0aW9uICgpIHt9KVxuICAqIGVtaXR0ZXIub25jZSgnZGVtbycsIGZ1bmN0aW9uICgpIHt9KVxuICAqL1xuICBlbWl0dGVyLm9uY2UgPSBmdW5jdGlvbiBvbmNlIChldmVudCwgZm4pIHtcbiAgICBmdW5jdGlvbiBvbmUgKCkge1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgZW1pdHRlci5vZmYoZXZlbnQsIG9uZSlcbiAgICB9XG4gICAgdGhpcy5vbihldmVudCwgb25lKVxuICB9XG5cbiAgLyoqXG4gICogU3RvcCBsaXN0ZW5pbmcgdG8gYW4gZXZlbnQuIFN0b3AgYWxsIGxpc3RlbmVycyBvbiBhbiBldmVudCBieSBvbmx5IHBhc3NpbmcgdGhlIGV2ZW50IG5hbWUuIFN0b3AgYSBzaW5nbGUgbGlzdGVuZXIgYnkgcGFzc2luZyB0aGF0IGV2ZW50IGhhbmRsZXIgYXMgYSBjYWxsYmFjay5cbiAgKiBZb3UgbXVzdCBiZSBleHBsaWNpdCBhYm91dCB3aGF0IHdpbGwgYmUgdW5zdWJzY3JpYmVkOiBgZW1pdHRlci5vZmYoJ2RlbW8nKWAgd2lsbCB1bnN1YnNjcmliZSBhbiBgZW1pdHRlci5vbignZGVtbycpYCBsaXN0ZW5lcixcbiAgKiBgZW1pdHRlci5vZmYoJ2RlbW86ZXhhbXBsZScpYCB3aWxsIHVuc3Vic2NyaWJlIGFuIGBlbWl0dGVyLm9uKCdkZW1vOmV4YW1wbGUnKWAgbGlzdGVuZXJcbiAgKiBAbmFtZSBvZmZcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dIOKAkyB0aGUgc3BlY2lmaWMgaGFuZGxlclxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vZmYoJ2V4YW1wbGUnKVxuICAqIGVtaXR0ZXIub2ZmKCdkZW1vJywgZnVuY3Rpb24gKCkge30pXG4gICovXG4gIGVtaXR0ZXIub2ZmID0gZnVuY3Rpb24gb2ZmIChldmVudCwgZm4pIHtcbiAgICB2YXIga2VlcCA9IFtdXG5cbiAgICBpZiAoZXZlbnQgJiYgZm4pIHtcbiAgICAgIHZhciBmbnMgPSB0aGlzLl9mbnNbZXZlbnRdXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBsID0gZm5zID8gZm5zLmxlbmd0aCA6IDBcblxuICAgICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7XG4gICAgICAgICAga2VlcC5wdXNoKGZuc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGtlZXAubGVuZ3RoID8gdGhpcy5fZm5zW2V2ZW50XSA9IGtlZXAgOiBkZWxldGUgdGhpcy5fZm5zW2V2ZW50XVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGlzdGVuZXJzIChlKSB7XG4gICAgdmFyIG91dCA9IF9mbnNbZV0gPyBfZm5zW2VdIDogW11cbiAgICB2YXIgaWR4ID0gZS5pbmRleE9mKCc6JylcbiAgICB2YXIgYXJncyA9IChpZHggPT09IC0xKSA/IFtlXSA6IFtlLnN1YnN0cmluZygwLCBpZHgpLCBlLnN1YnN0cmluZyhpZHggKyAxKV1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoX2ZucylcbiAgICB2YXIgaSA9IDBcbiAgICB2YXIgbCA9IGtleXMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICBpZiAoa2V5ID09PSAnKicpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJiBhcmdzWzBdID09PSBrZXkpIHtcbiAgICAgICAgb3V0ID0gb3V0LmNvbmNhdChfZm5zW2tleV0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dFxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdEFsbCAoZSwgZm5zLCBhcmdzKSB7XG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBmbnMubGVuZ3RoXG5cbiAgICBmb3IgKGk7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICghZm5zW2ldKSBicmVha1xuICAgICAgZm5zW2ldLmV2ZW50ID0gZVxuICAgICAgZm5zW2ldLmFwcGx5KGZuc1tpXSwgYXJncylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZW1pdHRlclxufVxuIiwidmFyIG4sbCx1LHQsaSxvLHIsZixlPXt9LGM9W10scz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pO2Z1bmN0aW9uIGEobixsKXtmb3IodmFyIHUgaW4gbCluW3VdPWxbdV07cmV0dXJuIG59ZnVuY3Rpb24gcChuKXt2YXIgbD1uLnBhcmVudE5vZGU7bCYmbC5yZW1vdmVDaGlsZChuKX1mdW5jdGlvbiB2KGwsdSx0KXt2YXIgaSxvLHIsZj17fTtmb3IociBpbiB1KVwia2V5XCI9PXI/aT11W3JdOlwicmVmXCI9PXI/bz11W3JdOmZbcl09dVtyXTtpZihhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGwmJm51bGwhPWwuZGVmYXVsdFByb3BzKWZvcihyIGluIGwuZGVmYXVsdFByb3BzKXZvaWQgMD09PWZbcl0mJihmW3JdPWwuZGVmYXVsdFByb3BzW3JdKTtyZXR1cm4gaChsLGYsaSxvLG51bGwpfWZ1bmN0aW9uIGgobix0LGksbyxyKXt2YXIgZj17dHlwZTpuLHByb3BzOnQsa2V5OmkscmVmOm8sX19rOm51bGwsX186bnVsbCxfX2I6MCxfX2U6bnVsbCxfX2Q6dm9pZCAwLF9fYzpudWxsLF9faDpudWxsLGNvbnN0cnVjdG9yOnZvaWQgMCxfX3Y6bnVsbD09cj8rK3U6cn07cmV0dXJuIG51bGwhPWwudm5vZGUmJmwudm5vZGUoZiksZn1mdW5jdGlvbiB5KG4pe3JldHVybiBuLmNoaWxkcmVufWZ1bmN0aW9uIGQobixsKXt0aGlzLnByb3BzPW4sdGhpcy5jb250ZXh0PWx9ZnVuY3Rpb24gXyhuLGwpe2lmKG51bGw9PWwpcmV0dXJuIG4uX18/XyhuLl9fLG4uX18uX19rLmluZGV4T2YobikrMSk6bnVsbDtmb3IodmFyIHU7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2UpcmV0dXJuIHUuX19lO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4udHlwZT9fKG4pOm51bGx9ZnVuY3Rpb24gayhuKXt2YXIgbCx1O2lmKG51bGwhPShuPW4uX18pJiZudWxsIT1uLl9fYyl7Zm9yKG4uX19lPW4uX19jLmJhc2U9bnVsbCxsPTA7bDxuLl9fay5sZW5ndGg7bCsrKWlmKG51bGwhPSh1PW4uX19rW2xdKSYmbnVsbCE9dS5fX2Upe24uX19lPW4uX19jLmJhc2U9dS5fX2U7YnJlYWt9cmV0dXJuIGsobil9fWZ1bmN0aW9uIHgobil7KCFuLl9fZCYmKG4uX19kPSEwKSYmaS5wdXNoKG4pJiYhYi5fX3IrK3x8ciE9PWwuZGVib3VuY2VSZW5kZXJpbmcpJiYoKHI9bC5kZWJvdW5jZVJlbmRlcmluZyl8fG8pKGIpfWZ1bmN0aW9uIGIoKXtmb3IodmFyIG47Yi5fX3I9aS5sZW5ndGg7KW49aS5zb3J0KGZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9KSxpPVtdLG4uc29tZShmdW5jdGlvbihuKXt2YXIgbCx1LHQsaSxvLHI7bi5fX2QmJihvPShpPShsPW4pLl9fdikuX19lLChyPWwuX19QKSYmKHU9W10sKHQ9YSh7fSxpKSkuX192PWkuX192KzEsSShyLGksdCxsLl9fbix2b2lkIDAhPT1yLm93bmVyU1ZHRWxlbWVudCxudWxsIT1pLl9faD9bb106bnVsbCx1LG51bGw9PW8/XyhpKTpvLGkuX19oKSxUKHUsaSksaS5fX2UhPW8mJmsoaSkpKX0pfWZ1bmN0aW9uIG0obixsLHUsdCxpLG8scixmLHMsYSl7dmFyIHAsdixkLGsseCxiLG0sQT10JiZ0Ll9fa3x8YyxQPUEubGVuZ3RoO2Zvcih1Ll9faz1bXSxwPTA7cDxsLmxlbmd0aDtwKyspaWYobnVsbCE9KGs9dS5fX2tbcF09bnVsbD09KGs9bFtwXSl8fFwiYm9vbGVhblwiPT10eXBlb2Ygaz9udWxsOlwic3RyaW5nXCI9PXR5cGVvZiBrfHxcIm51bWJlclwiPT10eXBlb2Yga3x8XCJiaWdpbnRcIj09dHlwZW9mIGs/aChudWxsLGssbnVsbCxudWxsLGspOkFycmF5LmlzQXJyYXkoayk/aCh5LHtjaGlsZHJlbjprfSxudWxsLG51bGwsbnVsbCk6ay5fX2I+MD9oKGsudHlwZSxrLnByb3BzLGsua2V5LG51bGwsay5fX3YpOmspKXtpZihrLl9fPXUsay5fX2I9dS5fX2IrMSxudWxsPT09KGQ9QVtwXSl8fGQmJmsua2V5PT1kLmtleSYmay50eXBlPT09ZC50eXBlKUFbcF09dm9pZCAwO2Vsc2UgZm9yKHY9MDt2PFA7disrKXtpZigoZD1BW3ZdKSYmay5rZXk9PWQua2V5JiZrLnR5cGU9PT1kLnR5cGUpe0Fbdl09dm9pZCAwO2JyZWFrfWQ9bnVsbH1JKG4sayxkPWR8fGUsaSxvLHIsZixzLGEpLHg9ay5fX2UsKHY9ay5yZWYpJiZkLnJlZiE9diYmKG18fChtPVtdKSxkLnJlZiYmbS5wdXNoKGQucmVmLG51bGwsayksbS5wdXNoKHYsay5fX2N8fHgsaykpLG51bGwhPXg/KG51bGw9PWImJihiPXgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGsudHlwZSYmbnVsbCE9ay5fX2smJmsuX19rPT09ZC5fX2s/ay5fX2Q9cz1nKGsscyxuKTpzPXcobixrLGQsQSx4LHMpLGF8fFwib3B0aW9uXCIhPT11LnR5cGU/XCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiYodS5fX2Q9cyk6bi52YWx1ZT1cIlwiKTpzJiZkLl9fZT09cyYmcy5wYXJlbnROb2RlIT1uJiYocz1fKGQpKX1mb3IodS5fX2U9YixwPVA7cC0tOyludWxsIT1BW3BdJiYoXCJmdW5jdGlvblwiPT10eXBlb2YgdS50eXBlJiZudWxsIT1BW3BdLl9fZSYmQVtwXS5fX2U9PXUuX19kJiYodS5fX2Q9Xyh0LHArMSkpLEwoQVtwXSxBW3BdKSk7aWYobSlmb3IocD0wO3A8bS5sZW5ndGg7cCsrKXoobVtwXSxtWysrcF0sbVsrK3BdKX1mdW5jdGlvbiBnKG4sbCx1KXt2YXIgdCxpO2Zvcih0PTA7dDxuLl9fay5sZW5ndGg7dCsrKShpPW4uX19rW3RdKSYmKGkuX189bixsPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkudHlwZT9nKGksbCx1KTp3KHUsaSxpLG4uX19rLGkuX19lLGwpKTtyZXR1cm4gbH1mdW5jdGlvbiB3KG4sbCx1LHQsaSxvKXt2YXIgcixmLGU7aWYodm9pZCAwIT09bC5fX2Qpcj1sLl9fZCxsLl9fZD12b2lkIDA7ZWxzZSBpZihudWxsPT11fHxpIT1vfHxudWxsPT1pLnBhcmVudE5vZGUpbjppZihudWxsPT1vfHxvLnBhcmVudE5vZGUhPT1uKW4uYXBwZW5kQ2hpbGQoaSkscj1udWxsO2Vsc2V7Zm9yKGY9byxlPTA7KGY9Zi5uZXh0U2libGluZykmJmU8dC5sZW5ndGg7ZSs9MilpZihmPT1pKWJyZWFrIG47bi5pbnNlcnRCZWZvcmUoaSxvKSxyPW99cmV0dXJuIHZvaWQgMCE9PXI/cjppLm5leHRTaWJsaW5nfWZ1bmN0aW9uIEEobixsLHUsdCxpKXt2YXIgbztmb3IobyBpbiB1KVwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxvIGluIGx8fEMobixvLG51bGwsdVtvXSx0KTtmb3IobyBpbiBsKWkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGxbb118fFwiY2hpbGRyZW5cIj09PW98fFwia2V5XCI9PT1vfHxcInZhbHVlXCI9PT1vfHxcImNoZWNrZWRcIj09PW98fHVbb109PT1sW29dfHxDKG4sbyxsW29dLHVbb10sdCl9ZnVuY3Rpb24gUChuLGwsdSl7XCItXCI9PT1sWzBdP24uc2V0UHJvcGVydHkobCx1KTpuW2xdPW51bGw9PXU/XCJcIjpcIm51bWJlclwiIT10eXBlb2YgdXx8cy50ZXN0KGwpP3U6dStcInB4XCJ9ZnVuY3Rpb24gQyhuLGwsdSx0LGkpe3ZhciBvO246aWYoXCJzdHlsZVwiPT09bClpZihcInN0cmluZ1wiPT10eXBlb2YgdSluLnN0eWxlLmNzc1RleHQ9dTtlbHNle2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0JiYobi5zdHlsZS5jc3NUZXh0PXQ9XCJcIiksdClmb3IobCBpbiB0KXUmJmwgaW4gdXx8UChuLnN0eWxlLGwsXCJcIik7aWYodSlmb3IobCBpbiB1KXQmJnVbbF09PT10W2xdfHxQKG4uc3R5bGUsbCx1W2xdKX1lbHNlIGlmKFwib1wiPT09bFswXSYmXCJuXCI9PT1sWzFdKW89bCE9PShsPWwucmVwbGFjZSgvQ2FwdHVyZSQvLFwiXCIpKSxsPWwudG9Mb3dlckNhc2UoKWluIG4/bC50b0xvd2VyQ2FzZSgpLnNsaWNlKDIpOmwuc2xpY2UoMiksbi5sfHwobi5sPXt9KSxuLmxbbCtvXT11LHU/dHx8bi5hZGRFdmVudExpc3RlbmVyKGwsbz9IOiQsbyk6bi5yZW1vdmVFdmVudExpc3RlbmVyKGwsbz9IOiQsbyk7ZWxzZSBpZihcImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MXCIhPT1sKXtpZihpKWw9bC5yZXBsYWNlKC94bGlua1tIOmhdLyxcImhcIikucmVwbGFjZSgvc05hbWUkLyxcInNcIik7ZWxzZSBpZihcImhyZWZcIiE9PWwmJlwibGlzdFwiIT09bCYmXCJmb3JtXCIhPT1sJiZcInRhYkluZGV4XCIhPT1sJiZcImRvd25sb2FkXCIhPT1sJiZsIGluIG4pdHJ5e25bbF09bnVsbD09dT9cIlwiOnU7YnJlYWsgbn1jYXRjaChuKXt9XCJmdW5jdGlvblwiPT10eXBlb2YgdXx8KG51bGwhPXUmJighMSE9PXV8fFwiYVwiPT09bFswXSYmXCJyXCI9PT1sWzFdKT9uLnNldEF0dHJpYnV0ZShsLHUpOm4ucmVtb3ZlQXR0cmlidXRlKGwpKX19ZnVuY3Rpb24gJChuKXt0aGlzLmxbbi50eXBlKyExXShsLmV2ZW50P2wuZXZlbnQobik6bil9ZnVuY3Rpb24gSChuKXt0aGlzLmxbbi50eXBlKyEwXShsLmV2ZW50P2wuZXZlbnQobik6bil9ZnVuY3Rpb24gSShuLHUsdCxpLG8scixmLGUsYyl7dmFyIHMscCx2LGgsXyxrLHgsYixnLHcsQSxQPXUudHlwZTtpZih2b2lkIDAhPT11LmNvbnN0cnVjdG9yKXJldHVybiBudWxsO251bGwhPXQuX19oJiYoYz10Ll9faCxlPXUuX19lPXQuX19lLHUuX19oPW51bGwscj1bZV0pLChzPWwuX19iKSYmcyh1KTt0cnl7bjppZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBQKXtpZihiPXUucHJvcHMsZz0ocz1QLmNvbnRleHRUeXBlKSYmaVtzLl9fY10sdz1zP2c/Zy5wcm9wcy52YWx1ZTpzLl9fOmksdC5fX2M/eD0ocD11Ll9fYz10Ll9fYykuX189cC5fX0U6KFwicHJvdG90eXBlXCJpbiBQJiZQLnByb3RvdHlwZS5yZW5kZXI/dS5fX2M9cD1uZXcgUChiLHcpOih1Ll9fYz1wPW5ldyBkKGIsdykscC5jb25zdHJ1Y3Rvcj1QLHAucmVuZGVyPU0pLGcmJmcuc3ViKHApLHAucHJvcHM9YixwLnN0YXRlfHwocC5zdGF0ZT17fSkscC5jb250ZXh0PXcscC5fX249aSx2PXAuX19kPSEwLHAuX19oPVtdKSxudWxsPT1wLl9fcyYmKHAuX19zPXAuc3RhdGUpLG51bGwhPVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiYocC5fX3M9PXAuc3RhdGUmJihwLl9fcz1hKHt9LHAuX19zKSksYShwLl9fcyxQLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhiLHAuX19zKSkpLGg9cC5wcm9wcyxfPXAuc3RhdGUsdiludWxsPT1QLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmbnVsbCE9cC5jb21wb25lbnRXaWxsTW91bnQmJnAuY29tcG9uZW50V2lsbE1vdW50KCksbnVsbCE9cC5jb21wb25lbnREaWRNb3VudCYmcC5fX2gucHVzaChwLmNvbXBvbmVudERpZE1vdW50KTtlbHNle2lmKG51bGw9PVAuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzJiZiIT09aCYmbnVsbCE9cC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJiZwLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoYix3KSwhcC5fX2UmJm51bGwhPXAuc2hvdWxkQ29tcG9uZW50VXBkYXRlJiYhMT09PXAuc2hvdWxkQ29tcG9uZW50VXBkYXRlKGIscC5fX3Msdyl8fHUuX192PT09dC5fX3Ype3AucHJvcHM9YixwLnN0YXRlPXAuX19zLHUuX192IT09dC5fX3YmJihwLl9fZD0hMSkscC5fX3Y9dSx1Ll9fZT10Ll9fZSx1Ll9faz10Ll9fayx1Ll9fay5mb3JFYWNoKGZ1bmN0aW9uKG4pe24mJihuLl9fPXUpfSkscC5fX2gubGVuZ3RoJiZmLnB1c2gocCk7YnJlYWsgbn1udWxsIT1wLmNvbXBvbmVudFdpbGxVcGRhdGUmJnAuY29tcG9uZW50V2lsbFVwZGF0ZShiLHAuX19zLHcpLG51bGwhPXAuY29tcG9uZW50RGlkVXBkYXRlJiZwLl9faC5wdXNoKGZ1bmN0aW9uKCl7cC5jb21wb25lbnREaWRVcGRhdGUoaCxfLGspfSl9cC5jb250ZXh0PXcscC5wcm9wcz1iLHAuc3RhdGU9cC5fX3MsKHM9bC5fX3IpJiZzKHUpLHAuX19kPSExLHAuX192PXUscC5fX1A9bixzPXAucmVuZGVyKHAucHJvcHMscC5zdGF0ZSxwLmNvbnRleHQpLHAuc3RhdGU9cC5fX3MsbnVsbCE9cC5nZXRDaGlsZENvbnRleHQmJihpPWEoYSh7fSxpKSxwLmdldENoaWxkQ29udGV4dCgpKSksdnx8bnVsbD09cC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZXx8KGs9cC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShoLF8pKSxBPW51bGwhPXMmJnMudHlwZT09PXkmJm51bGw9PXMua2V5P3MucHJvcHMuY2hpbGRyZW46cyxtKG4sQXJyYXkuaXNBcnJheShBKT9BOltBXSx1LHQsaSxvLHIsZixlLGMpLHAuYmFzZT11Ll9fZSx1Ll9faD1udWxsLHAuX19oLmxlbmd0aCYmZi5wdXNoKHApLHgmJihwLl9fRT1wLl9fPW51bGwpLHAuX19lPSExfWVsc2UgbnVsbD09ciYmdS5fX3Y9PT10Ll9fdj8odS5fX2s9dC5fX2ssdS5fX2U9dC5fX2UpOnUuX19lPWoodC5fX2UsdSx0LGksbyxyLGYsYyk7KHM9bC5kaWZmZWQpJiZzKHUpfWNhdGNoKG4pe3UuX192PW51bGwsKGN8fG51bGwhPXIpJiYodS5fX2U9ZSx1Ll9faD0hIWMscltyLmluZGV4T2YoZSldPW51bGwpLGwuX19lKG4sdSx0KX19ZnVuY3Rpb24gVChuLHUpe2wuX19jJiZsLl9fYyh1LG4pLG4uc29tZShmdW5jdGlvbih1KXt0cnl7bj11Ll9faCx1Ll9faD1bXSxuLnNvbWUoZnVuY3Rpb24obil7bi5jYWxsKHUpfSl9Y2F0Y2gobil7bC5fX2Uobix1Ll9fdil9fSl9ZnVuY3Rpb24gaihsLHUsdCxpLG8scixmLGMpe3ZhciBzLGEsdixoPXQucHJvcHMseT11LnByb3BzLGQ9dS50eXBlLGs9MDtpZihcInN2Z1wiPT09ZCYmKG89ITApLG51bGwhPXIpZm9yKDtrPHIubGVuZ3RoO2srKylpZigocz1yW2tdKSYmKHM9PT1sfHwoZD9zLmxvY2FsTmFtZT09ZDozPT1zLm5vZGVUeXBlKSkpe2w9cyxyW2tdPW51bGw7YnJlYWt9aWYobnVsbD09bCl7aWYobnVsbD09PWQpcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHkpO2w9bz9kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLGQpOmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZCx5LmlzJiZ5KSxyPW51bGwsYz0hMX1pZihudWxsPT09ZCloPT09eXx8YyYmbC5kYXRhPT09eXx8KGwuZGF0YT15KTtlbHNle2lmKHI9ciYmbi5jYWxsKGwuY2hpbGROb2RlcyksYT0oaD10LnByb3BzfHxlKS5kYW5nZXJvdXNseVNldElubmVySFRNTCx2PXkuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwsIWMpe2lmKG51bGwhPXIpZm9yKGg9e30saz0wO2s8bC5hdHRyaWJ1dGVzLmxlbmd0aDtrKyspaFtsLmF0dHJpYnV0ZXNba10ubmFtZV09bC5hdHRyaWJ1dGVzW2tdLnZhbHVlOyh2fHxhKSYmKHYmJihhJiZ2Ll9faHRtbD09YS5fX2h0bWx8fHYuX19odG1sPT09bC5pbm5lckhUTUwpfHwobC5pbm5lckhUTUw9diYmdi5fX2h0bWx8fFwiXCIpKX1pZihBKGwseSxoLG8sYyksdil1Ll9faz1bXTtlbHNlIGlmKGs9dS5wcm9wcy5jaGlsZHJlbixtKGwsQXJyYXkuaXNBcnJheShrKT9rOltrXSx1LHQsaSxvJiZcImZvcmVpZ25PYmplY3RcIiE9PWQscixmLHI/clswXTp0Ll9fayYmXyh0LDApLGMpLG51bGwhPXIpZm9yKGs9ci5sZW5ndGg7ay0tOyludWxsIT1yW2tdJiZwKHJba10pO2N8fChcInZhbHVlXCJpbiB5JiZ2b2lkIDAhPT0oaz15LnZhbHVlKSYmKGshPT1sLnZhbHVlfHxcInByb2dyZXNzXCI9PT1kJiYhaykmJkMobCxcInZhbHVlXCIsayxoLnZhbHVlLCExKSxcImNoZWNrZWRcImluIHkmJnZvaWQgMCE9PShrPXkuY2hlY2tlZCkmJmshPT1sLmNoZWNrZWQmJkMobCxcImNoZWNrZWRcIixrLGguY2hlY2tlZCwhMSkpfXJldHVybiBsfWZ1bmN0aW9uIHoobix1LHQpe3RyeXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBuP24odSk6bi5jdXJyZW50PXV9Y2F0Y2gobil7bC5fX2Uobix0KX19ZnVuY3Rpb24gTChuLHUsdCl7dmFyIGksbztpZihsLnVubW91bnQmJmwudW5tb3VudChuKSwoaT1uLnJlZikmJihpLmN1cnJlbnQmJmkuY3VycmVudCE9PW4uX19lfHx6KGksbnVsbCx1KSksbnVsbCE9KGk9bi5fX2MpKXtpZihpLmNvbXBvbmVudFdpbGxVbm1vdW50KXRyeXtpLmNvbXBvbmVudFdpbGxVbm1vdW50KCl9Y2F0Y2gobil7bC5fX2Uobix1KX1pLmJhc2U9aS5fX1A9bnVsbH1pZihpPW4uX19rKWZvcihvPTA7bzxpLmxlbmd0aDtvKyspaVtvXSYmTChpW29dLHUsXCJmdW5jdGlvblwiIT10eXBlb2Ygbi50eXBlKTt0fHxudWxsPT1uLl9fZXx8cChuLl9fZSksbi5fX2U9bi5fX2Q9dm9pZCAwfWZ1bmN0aW9uIE0obixsLHUpe3JldHVybiB0aGlzLmNvbnN0cnVjdG9yKG4sdSl9ZnVuY3Rpb24gTih1LHQsaSl7dmFyIG8scixmO2wuX18mJmwuX18odSx0KSxyPShvPVwiZnVuY3Rpb25cIj09dHlwZW9mIGkpP251bGw6aSYmaS5fX2t8fHQuX19rLGY9W10sSSh0LHU9KCFvJiZpfHx0KS5fX2s9dih5LG51bGwsW3VdKSxyfHxlLGUsdm9pZCAwIT09dC5vd25lclNWR0VsZW1lbnQsIW8mJmk/W2ldOnI/bnVsbDp0LmZpcnN0Q2hpbGQ/bi5jYWxsKHQuY2hpbGROb2Rlcyk6bnVsbCxmLCFvJiZpP2k6cj9yLl9fZTp0LmZpcnN0Q2hpbGQsbyksVChmLHUpfW49Yy5zbGljZSxsPXtfX2U6ZnVuY3Rpb24obixsKXtmb3IodmFyIHUsdCxpO2w9bC5fXzspaWYoKHU9bC5fX2MpJiYhdS5fXyl0cnl7aWYoKHQ9dS5jb25zdHJ1Y3RvcikmJm51bGwhPXQuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYodS5zZXRTdGF0ZSh0LmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSksaT11Ll9fZCksbnVsbCE9dS5jb21wb25lbnREaWRDYXRjaCYmKHUuY29tcG9uZW50RGlkQ2F0Y2gobiksaT11Ll9fZCksaSlyZXR1cm4gdS5fX0U9dX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LHU9MCx0PWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZ2b2lkIDA9PT1uLmNvbnN0cnVjdG9yfSxkLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9bnVsbCE9dGhpcy5fX3MmJnRoaXMuX19zIT09dGhpcy5zdGF0ZT90aGlzLl9fczp0aGlzLl9fcz1hKHt9LHRoaXMuc3RhdGUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihuPW4oYSh7fSx1KSx0aGlzLnByb3BzKSksbiYmYSh1LG4pLG51bGwhPW4mJnRoaXMuX192JiYobCYmdGhpcy5fX2gucHVzaChsKSx4KHRoaXMpKX0sZC5wcm90b3R5cGUuZm9yY2VVcGRhdGU9ZnVuY3Rpb24obil7dGhpcy5fX3YmJih0aGlzLl9fZT0hMCxuJiZ0aGlzLl9faC5wdXNoKG4pLHgodGhpcykpfSxkLnByb3RvdHlwZS5yZW5kZXI9eSxpPVtdLG89XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZT9Qcm9taXNlLnByb3RvdHlwZS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpOnNldFRpbWVvdXQsYi5fX3I9MCxmPTAsZXhwb3J0cy5yZW5kZXI9TixleHBvcnRzLmh5ZHJhdGU9ZnVuY3Rpb24gbihsLHUpe04obCx1LG4pfSxleHBvcnRzLmNyZWF0ZUVsZW1lbnQ9dixleHBvcnRzLmg9dixleHBvcnRzLkZyYWdtZW50PXksZXhwb3J0cy5jcmVhdGVSZWY9ZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpudWxsfX0sZXhwb3J0cy5pc1ZhbGlkRWxlbWVudD10LGV4cG9ydHMuQ29tcG9uZW50PWQsZXhwb3J0cy5jbG9uZUVsZW1lbnQ9ZnVuY3Rpb24obCx1LHQpe3ZhciBpLG8scixmPWEoe30sbC5wcm9wcyk7Zm9yKHIgaW4gdSlcImtleVwiPT1yP2k9dVtyXTpcInJlZlwiPT1yP289dVtyXTpmW3JdPXVbcl07cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+MiYmKGYuY2hpbGRyZW49YXJndW1lbnRzLmxlbmd0aD4zP24uY2FsbChhcmd1bWVudHMsMik6dCksaChsLnR5cGUsZixpfHxsLmtleSxvfHxsLnJlZixudWxsKX0sZXhwb3J0cy5jcmVhdGVDb250ZXh0PWZ1bmN0aW9uKG4sbCl7dmFyIHU9e19fYzpsPVwiX19jQ1wiK2YrKyxfXzpuLENvbnN1bWVyOmZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9LFByb3ZpZGVyOmZ1bmN0aW9uKG4pe3ZhciB1LHQ7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwodT1bXSwodD17fSlbbF09dGhpcyx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0fSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLnByb3BzLnZhbHVlIT09bi52YWx1ZSYmdS5zb21lKHgpfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXt1LnB1c2gobik7dmFyIGw9bi5jb21wb25lbnRXaWxsVW5tb3VudDtuLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dS5zcGxpY2UodS5pbmRleE9mKG4pLDEpLGwmJmwuY2FsbChuKX19KSxuLmNoaWxkcmVufX07cmV0dXJuIHUuUHJvdmlkZXIuX189dS5Db25zdW1lci5jb250ZXh0VHlwZT11fSxleHBvcnRzLnRvQ2hpbGRBcnJheT1mdW5jdGlvbiBuKGwsdSl7cmV0dXJuIHU9dXx8W10sbnVsbD09bHx8XCJib29sZWFuXCI9PXR5cGVvZiBsfHwoQXJyYXkuaXNBcnJheShsKT9sLnNvbWUoZnVuY3Rpb24obCl7bihsLHUpfSk6dS5wdXNoKGwpKSx1fSxleHBvcnRzLm9wdGlvbnM9bDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXBcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgdW5kZWY7XG5cbi8qKlxuICogRGVjb2RlIGEgVVJJIGVuY29kZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgVVJJIGVuY29kZWQgc3RyaW5nLlxuICogQHJldHVybnMge1N0cmluZ3xOdWxsfSBUaGUgZGVjb2RlZCBzdHJpbmcuXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dC5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIGVuY29kZSBhIGdpdmVuIGlucHV0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIHRoYXQgbmVlZHMgdG8gYmUgZW5jb2RlZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd8TnVsbH0gVGhlIGVuY29kZWQgc3RyaW5nLlxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuICB0cnkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaW5wdXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgcXVlcnkgc3RyaW5nIHBhcnNlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVGhlIHF1ZXJ5IHN0cmluZyB0aGF0IG5lZWRzIHRvIGJlIHBhcnNlZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBxdWVyeXN0cmluZyhxdWVyeSkge1xuICB2YXIgcGFyc2VyID0gLyhbXj0/IyZdKyk9PyhbXiZdKikvZ1xuICAgICwgcmVzdWx0ID0ge31cbiAgICAsIHBhcnQ7XG5cbiAgd2hpbGUgKHBhcnQgPSBwYXJzZXIuZXhlYyhxdWVyeSkpIHtcbiAgICB2YXIga2V5ID0gZGVjb2RlKHBhcnRbMV0pXG4gICAgICAsIHZhbHVlID0gZGVjb2RlKHBhcnRbMl0pO1xuXG4gICAgLy9cbiAgICAvLyBQcmV2ZW50IG92ZXJyaWRpbmcgb2YgZXhpc3RpbmcgcHJvcGVydGllcy4gVGhpcyBlbnN1cmVzIHRoYXQgYnVpbGQtaW5cbiAgICAvLyBtZXRob2RzIGxpa2UgYHRvU3RyaW5nYCBvciBfX3Byb3RvX18gYXJlIG5vdCBvdmVycmlkZW4gYnkgbWFsaWNpb3VzXG4gICAgLy8gcXVlcnlzdHJpbmdzLlxuICAgIC8vXG4gICAgLy8gSW4gdGhlIGNhc2UgaWYgZmFpbGVkIGRlY29kaW5nLCB3ZSB3YW50IHRvIG9taXQgdGhlIGtleS92YWx1ZSBwYWlyc1xuICAgIC8vIGZyb20gdGhlIHJlc3VsdC5cbiAgICAvL1xuICAgIGlmIChrZXkgPT09IG51bGwgfHwgdmFsdWUgPT09IG51bGwgfHwga2V5IGluIHJlc3VsdCkgY29udGludWU7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGEgcXVlcnkgc3RyaW5nIHRvIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIE9iamVjdCB0aGF0IHNob3VsZCBiZSB0cmFuc2Zvcm1lZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggT3B0aW9uYWwgcHJlZml4LlxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5naWZ5KG9iaiwgcHJlZml4KSB7XG4gIHByZWZpeCA9IHByZWZpeCB8fCAnJztcblxuICB2YXIgcGFpcnMgPSBbXVxuICAgICwgdmFsdWVcbiAgICAsIGtleTtcblxuICAvL1xuICAvLyBPcHRpb25hbGx5IHByZWZpeCB3aXRoIGEgJz8nIGlmIG5lZWRlZFxuICAvL1xuICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBwcmVmaXgpIHByZWZpeCA9ICc/JztcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YWx1ZSA9IG9ialtrZXldO1xuXG4gICAgICAvL1xuICAgICAgLy8gRWRnZSBjYXNlcyB3aGVyZSB3ZSBhY3R1YWxseSB3YW50IHRvIGVuY29kZSB0aGUgdmFsdWUgdG8gYW4gZW1wdHlcbiAgICAgIC8vIHN0cmluZyBpbnN0ZWFkIG9mIHRoZSBzdHJpbmdpZmllZCB2YWx1ZS5cbiAgICAgIC8vXG4gICAgICBpZiAoIXZhbHVlICYmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWYgfHwgaXNOYU4odmFsdWUpKSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBlbmNvZGUoa2V5KTtcbiAgICAgIHZhbHVlID0gZW5jb2RlKHZhbHVlKTtcblxuICAgICAgLy9cbiAgICAgIC8vIElmIHdlIGZhaWxlZCB0byBlbmNvZGUgdGhlIHN0cmluZ3MsIHdlIHNob3VsZCBiYWlsIG91dCBhcyB3ZSBkb24ndFxuICAgICAgLy8gd2FudCB0byBhZGQgaW52YWxpZCBzdHJpbmdzIHRvIHRoZSBxdWVyeS5cbiAgICAgIC8vXG4gICAgICBpZiAoa2V5ID09PSBudWxsIHx8IHZhbHVlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgIHBhaXJzLnB1c2goa2V5ICsnPScrIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFpcnMubGVuZ3RoID8gcHJlZml4ICsgcGFpcnMuam9pbignJicpIDogJyc7XG59XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5leHBvcnRzLnN0cmluZ2lmeSA9IHF1ZXJ5c3RyaW5naWZ5O1xuZXhwb3J0cy5wYXJzZSA9IHF1ZXJ5c3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIGlmIHdlJ3JlIHJlcXVpcmVkIHRvIGFkZCBhIHBvcnQgbnVtYmVyLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly91cmwuc3BlYy53aGF0d2cub3JnLyNkZWZhdWx0LXBvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gcG9ydCBQb3J0IG51bWJlciB3ZSBuZWVkIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2wgUHJvdG9jb2wgd2UgbmVlZCB0byBjaGVjayBhZ2FpbnN0LlxuICogQHJldHVybnMge0Jvb2xlYW59IElzIGl0IGEgZGVmYXVsdCBwb3J0IGZvciB0aGUgZ2l2ZW4gcHJvdG9jb2xcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcXVpcmVkKHBvcnQsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wuc3BsaXQoJzonKVswXTtcbiAgcG9ydCA9ICtwb3J0O1xuXG4gIGlmICghcG9ydCkgcmV0dXJuIGZhbHNlO1xuXG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwJzpcbiAgICBjYXNlICd3cyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDgwO1xuXG4gICAgY2FzZSAnaHR0cHMnOlxuICAgIGNhc2UgJ3dzcyc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDQ0MztcblxuICAgIGNhc2UgJ2Z0cCc6XG4gICAgcmV0dXJuIHBvcnQgIT09IDIxO1xuXG4gICAgY2FzZSAnZ29waGVyJzpcbiAgICByZXR1cm4gcG9ydCAhPT0gNzA7XG5cbiAgICBjYXNlICdmaWxlJzpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcG9ydCAhPT0gMDtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxudmFyIF9pc1JlYWN0TmF0aXZlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc1JlYWN0TmF0aXZlXCIpKTtcblxudmFyIF91cmlUb0Jsb2IgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3VyaVRvQmxvYlwiKSk7XG5cbnZhciBfaXNDb3Jkb3ZhID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9pc0NvcmRvdmFcIikpO1xuXG52YXIgX3JlYWRBc0J5dGVBcnJheSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vcmVhZEFzQnl0ZUFycmF5XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG52YXIgRmlsZVNvdXJjZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8vIE1ha2UgdGhpcy5zaXplIGEgbWV0aG9kXG4gIGZ1bmN0aW9uIEZpbGVTb3VyY2UoZmlsZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlU291cmNlKTtcblxuICAgIHRoaXMuX2ZpbGUgPSBmaWxlO1xuICAgIHRoaXMuc2l6ZSA9IGZpbGUuc2l6ZTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhGaWxlU291cmNlLCBbe1xuICAgIGtleTogXCJzbGljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzbGljZShzdGFydCwgZW5kKSB7XG4gICAgICAvLyBJbiBBcGFjaGUgQ29yZG92YSBhcHBsaWNhdGlvbnMsIGEgRmlsZSBtdXN0IGJlIHJlc29sdmVkIHVzaW5nXG4gICAgICAvLyBGaWxlUmVhZGVyIGluc3RhbmNlcywgc2VlXG4gICAgICAvLyBodHRwczovL2NvcmRvdmEuYXBhY2hlLm9yZy9kb2NzL2VuLzgueC9yZWZlcmVuY2UvY29yZG92YS1wbHVnaW4tZmlsZS9pbmRleC5odG1sI3JlYWQtYS1maWxlXG4gICAgICBpZiAoKDAsIF9pc0NvcmRvdmEuZGVmYXVsdCkoKSkge1xuICAgICAgICByZXR1cm4gKDAsIF9yZWFkQXNCeXRlQXJyYXkuZGVmYXVsdCkodGhpcy5fZmlsZS5zbGljZShzdGFydCwgZW5kKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2ZpbGUuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZSgpIHsvLyBOb3RoaW5nIHRvIGRvIGhlcmUgc2luY2Ugd2UgZG9uJ3QgbmVlZCB0byByZWxlYXNlIGFueSByZXNvdXJjZXMuXG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEZpbGVTb3VyY2U7XG59KCk7XG5cbnZhciBTdHJlYW1Tb3VyY2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHJlYW1Tb3VyY2UocmVhZGVyLCBjaHVua1NpemUpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3RyZWFtU291cmNlKTtcblxuICAgIHRoaXMuX2NodW5rU2l6ZSA9IGNodW5rU2l6ZTtcbiAgICB0aGlzLl9idWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fYnVmZmVyT2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9yZWFkZXIgPSByZWFkZXI7XG4gICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFN0cmVhbVNvdXJjZSwgW3tcbiAgICBrZXk6IFwic2xpY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgICAgaWYgKHN0YXJ0IDwgdGhpcy5fYnVmZmVyT2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0ZWQgZGF0YSBpcyBiZWZvcmUgdGhlIHJlYWRlcidzIGN1cnJlbnQgb2Zmc2V0XCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3JlYWRVbnRpbEVub3VnaERhdGFPckRvbmUoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBoYXNFbm91Z2hEYXRhID0gZW5kIDw9IHRoaXMuX2J1ZmZlck9mZnNldCArIGxlbih0aGlzLl9idWZmZXIpO1xuXG4gICAgICBpZiAodGhpcy5fZG9uZSB8fCBoYXNFbm91Z2hEYXRhKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX2dldERhdGFGcm9tQnVmZmVyKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgIHZhciBkb25lID0gdmFsdWUgPT0gbnVsbCA/IHRoaXMuX2RvbmUgOiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZWFkZXIucmVhZCgpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gX3JlZi52YWx1ZSxcbiAgICAgICAgICAgIGRvbmUgPSBfcmVmLmRvbmU7XG5cbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICBfdGhpcy5fZG9uZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMuX2J1ZmZlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgX3RoaXMuX2J1ZmZlciA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLl9idWZmZXIgPSBjb25jYXQoX3RoaXMuX2J1ZmZlciwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLl9yZWFkVW50aWxFbm91Z2hEYXRhT3JEb25lKHN0YXJ0LCBlbmQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9nZXREYXRhRnJvbUJ1ZmZlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0RGF0YUZyb21CdWZmZXIoc3RhcnQsIGVuZCkge1xuICAgICAgLy8gUmVtb3ZlIGRhdGEgZnJvbSBidWZmZXIgYmVmb3JlIGBzdGFydGAuXG4gICAgICAvLyBEYXRhIG1pZ2h0IGJlIHJlcmVhZCBmcm9tIHRoZSBidWZmZXIgaWYgYW4gdXBsb2FkIGZhaWxzLCBzbyB3ZSBjYW4gb25seVxuICAgICAgLy8gc2FmZWx5IGRlbGV0ZSBkYXRhIHdoZW4gaXQgY29tZXMgKmJlZm9yZSogd2hhdCBpcyBjdXJyZW50bHkgYmVpbmcgcmVhZC5cbiAgICAgIGlmIChzdGFydCA+IHRoaXMuX2J1ZmZlck9mZnNldCkge1xuICAgICAgICB0aGlzLl9idWZmZXIgPSB0aGlzLl9idWZmZXIuc2xpY2Uoc3RhcnQgLSB0aGlzLl9idWZmZXJPZmZzZXQpO1xuICAgICAgICB0aGlzLl9idWZmZXJPZmZzZXQgPSBzdGFydDtcbiAgICAgIH0gLy8gSWYgdGhlIGJ1ZmZlciBpcyBlbXB0eSBhZnRlciByZW1vdmluZyBvbGQgZGF0YSwgYWxsIGRhdGEgaGFzIGJlZW4gcmVhZC5cblxuXG4gICAgICB2YXIgaGFzQWxsRGF0YUJlZW5SZWFkID0gbGVuKHRoaXMuX2J1ZmZlcikgPT09IDA7XG5cbiAgICAgIGlmICh0aGlzLl9kb25lICYmIGhhc0FsbERhdGFCZWVuUmVhZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gLy8gV2UgYWxyZWFkeSByZW1vdmVkIGRhdGEgYmVmb3JlIGBzdGFydGAsIHNvIHdlIGp1c3QgcmV0dXJuIHRoZSBmaXJzdFxuICAgICAgLy8gY2h1bmsgZnJvbSB0aGUgYnVmZmVyLlxuXG5cbiAgICAgIHJldHVybiB0aGlzLl9idWZmZXIuc2xpY2UoMCwgZW5kIC0gc3RhcnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgIGlmICh0aGlzLl9yZWFkZXIuY2FuY2VsKSB7XG4gICAgICAgIHRoaXMuX3JlYWRlci5jYW5jZWwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3RyZWFtU291cmNlO1xufSgpO1xuXG5mdW5jdGlvbiBsZW4oYmxvYk9yQXJyYXkpIHtcbiAgaWYgKGJsb2JPckFycmF5ID09PSB1bmRlZmluZWQpIHJldHVybiAwO1xuICBpZiAoYmxvYk9yQXJyYXkuc2l6ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYmxvYk9yQXJyYXkuc2l6ZTtcbiAgcmV0dXJuIGJsb2JPckFycmF5Lmxlbmd0aDtcbn1cbi8qXG4gIFR5cGVkIGFycmF5cyBhbmQgYmxvYnMgZG9uJ3QgaGF2ZSBhIGNvbmNhdCBtZXRob2QuXG4gIFRoaXMgZnVuY3Rpb24gaGVscHMgU3RyZWFtU291cmNlIGFjY3VtdWxhdGUgZGF0YSB0byByZWFjaCBjaHVua1NpemUuXG4qL1xuXG5cbmZ1bmN0aW9uIGNvbmNhdChhLCBiKSB7XG4gIGlmIChhLmNvbmNhdCkge1xuICAgIC8vIElzIGBhYCBhbiBBcnJheT9cbiAgICByZXR1cm4gYS5jb25jYXQoYik7XG4gIH1cblxuICBpZiAoYSBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICByZXR1cm4gbmV3IEJsb2IoW2EsIGJdLCB7XG4gICAgICB0eXBlOiBhLnR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChhLnNldCkge1xuICAgIC8vIElzIGBhYCBhIHR5cGVkIGFycmF5P1xuICAgIHZhciBjID0gbmV3IGEuY29uc3RydWN0b3IoYS5sZW5ndGggKyBiLmxlbmd0aCk7XG4gICAgYy5zZXQoYSk7XG4gICAgYy5zZXQoYiwgYS5sZW5ndGgpO1xuICAgIHJldHVybiBjO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBkYXRhIHR5cGVcIik7XG59XG5cbnZhciBGaWxlUmVhZGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRmlsZVJlYWRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZVJlYWRlcik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRmlsZVJlYWRlciwgW3tcbiAgICBrZXk6IFwib3BlbkZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbkZpbGUoaW5wdXQsIGNodW5rU2l6ZSkge1xuICAgICAgLy8gSW4gUmVhY3QgTmF0aXZlLCB3aGVuIHVzZXIgc2VsZWN0cyBhIGZpbGUsIGluc3RlYWQgb2YgYSBGaWxlIG9yIEJsb2IsXG4gICAgICAvLyB5b3UgdXN1YWxseSBnZXQgYSBmaWxlIG9iamVjdCB7fSB3aXRoIGEgdXJpIHByb3BlcnR5IHRoYXQgY29udGFpbnNcbiAgICAgIC8vIGEgbG9jYWwgcGF0aCB0byB0aGUgZmlsZS4gV2UgdXNlIFhNTEh0dHBSZXF1ZXN0IHRvIGZldGNoXG4gICAgICAvLyB0aGUgZmlsZSBibG9iLCBiZWZvcmUgdXBsb2FkaW5nIHdpdGggdHVzLlxuICAgICAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpICYmIGlucHV0ICYmIHR5cGVvZiBpbnB1dC51cmkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXJpVG9CbG9iLmRlZmF1bHQpKGlucHV0LnVyaSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICAgIHJldHVybiBuZXcgRmlsZVNvdXJjZShibG9iKTtcbiAgICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHVzOiBjYW5ub3QgZmV0Y2ggYGZpbGUudXJpYCBhcyBCbG9iLCBtYWtlIHN1cmUgdGhlIHVyaSBpcyBjb3JyZWN0IGFuZCBhY2Nlc3NpYmxlLiBcIiArIGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSAvLyBTaW5jZSB3ZSBlbXVsYXRlIHRoZSBCbG9iIHR5cGUgaW4gb3VyIHRlc3RzIChub3QgYWxsIHRhcmdldCBicm93c2Vyc1xuICAgICAgLy8gc3VwcG9ydCBpdCksIHdlIGNhbm5vdCB1c2UgYGluc3RhbmNlb2ZgIGZvciB0ZXN0aW5nIHdoZXRoZXIgdGhlIGlucHV0IHZhbHVlXG4gICAgICAvLyBjYW4gYmUgaGFuZGxlZC4gSW5zdGVhZCwgd2Ugc2ltcGx5IGNoZWNrIGlzIHRoZSBzbGljZSgpIGZ1bmN0aW9uIGFuZCB0aGVcbiAgICAgIC8vIHNpemUgcHJvcGVydHkgYXJlIGF2YWlsYWJsZS5cblxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnNsaWNlID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGlucHV0LnNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgRmlsZVNvdXJjZShpbnB1dCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGlucHV0LnJlYWQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjaHVua1NpemUgPSArY2h1bmtTaXplO1xuXG4gICAgICAgIGlmICghaXNGaW5pdGUoY2h1bmtTaXplKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJjYW5ub3QgY3JlYXRlIHNvdXJjZSBmb3Igc3RyZWFtIHdpdGhvdXQgYSBmaW5pdGUgdmFsdWUgZm9yIHRoZSBgY2h1bmtTaXplYCBvcHRpb25cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgU3RyZWFtU291cmNlKGlucHV0LCBjaHVua1NpemUpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcInNvdXJjZSBvYmplY3QgbWF5IG9ubHkgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZSwgQmxvYiwgb3IgUmVhZGVyIGluIHRoaXMgZW52aXJvbm1lbnRcIikpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlUmVhZGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBGaWxlUmVhZGVyOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmluZ2VycHJpbnQ7XG5cbnZhciBfaXNSZWFjdE5hdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaXNSZWFjdE5hdGl2ZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIFRPRE86IERpZmZlcmVuY2lhdGUgYmV0d2VlbiBpbnB1dCB0eXBlc1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgZmluZ2VycHJpbnQgZm9yIGEgZmlsZSB3aGljaCB3aWxsIGJlIHVzZWQgdGhlIHN0b3JlIHRoZSBlbmRwb2ludFxuICpcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpIHtcbiAgaWYgKCgwLCBfaXNSZWFjdE5hdGl2ZS5kZWZhdWx0KSgpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFjdE5hdGl2ZUZpbmdlcnByaW50KGZpbGUsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoW1widHVzLWJyXCIsIGZpbGUubmFtZSwgZmlsZS50eXBlLCBmaWxlLnNpemUsIGZpbGUubGFzdE1vZGlmaWVkLCBvcHRpb25zLmVuZHBvaW50XS5qb2luKFwiLVwiKSk7XG59XG5cbmZ1bmN0aW9uIHJlYWN0TmF0aXZlRmluZ2VycHJpbnQoZmlsZSwgb3B0aW9ucykge1xuICB2YXIgZXhpZkhhc2ggPSBmaWxlLmV4aWYgPyBoYXNoQ29kZShKU09OLnN0cmluZ2lmeShmaWxlLmV4aWYpKSA6IFwibm9leGlmXCI7XG4gIHJldHVybiBbXCJ0dXMtcm5cIiwgZmlsZS5uYW1lIHx8IFwibm9uYW1lXCIsIGZpbGUuc2l6ZSB8fCBcIm5vc2l6ZVwiLCBleGlmSGFzaCwgb3B0aW9ucy5lbmRwb2ludF0uam9pbihcIi9cIik7XG59XG5cbmZ1bmN0aW9uIGhhc2hDb2RlKHN0cikge1xuICAvLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODMxOTM3LzE1MTY2NlxuICB2YXIgaGFzaCA9IDA7XG5cbiAgaWYgKHN0ci5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaGFzaDtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9jaGFyID0gc3RyLmNoYXJDb2RlQXQoaSk7XG5cbiAgICBoYXNoID0gKGhhc2ggPDwgNSkgLSBoYXNoICsgX2NoYXI7XG4gICAgaGFzaCA9IGhhc2ggJiBoYXNoOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBoYXNoO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIFhIUkh0dHBTdGFjayA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFhIUkh0dHBTdGFjaygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgWEhSSHR0cFN0YWNrKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhYSFJIdHRwU3RhY2ssIFt7XG4gICAga2V5OiBcImNyZWF0ZVJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROYW1lKCkge1xuICAgICAgcmV0dXJuIFwiWEhSSHR0cFN0YWNrXCI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFhIUkh0dHBTdGFjaztcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gWEhSSHR0cFN0YWNrO1xuXG52YXIgUmVxdWVzdCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVxdWVzdCk7XG5cbiAgICB0aGlzLl94aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHRoaXMuX3hoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcblxuICAgIHRoaXMuX21ldGhvZCA9IG1ldGhvZDtcbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgdGhpcy5faGVhZGVycyA9IHt9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJlcXVlc3QsIFt7XG4gICAga2V5OiBcImdldE1ldGhvZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRNZXRob2QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWV0aG9kO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRVUkxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VVJMKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldEhlYWRlcihoZWFkZXIsIHZhbHVlKSB7XG4gICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcblxuICAgICAgdGhpcy5faGVhZGVyc1toZWFkZXJdID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEhlYWRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRIZWFkZXIoaGVhZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGVhZGVyc1toZWFkZXJdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRQcm9ncmVzc0hhbmRsZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0UHJvZ3Jlc3NIYW5kbGVyKHByb2dyZXNzSGFuZGxlcikge1xuICAgICAgLy8gVGVzdCBzdXBwb3J0IGZvciBwcm9ncmVzcyBldmVudHMgYmVmb3JlIGF0dGFjaGluZyBhbiBldmVudCBsaXN0ZW5lclxuICAgICAgaWYgKCEoXCJ1cGxvYWRcIiBpbiB0aGlzLl94aHIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5feGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwcm9ncmVzc0hhbmRsZXIoZS5sb2FkZWQpO1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGJvZHkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBfdGhpcy5feGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShfdGhpcy5feGhyKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMuX3hoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzLl94aHIuc2VuZChib2R5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlcXVlc3Q7XG59KCk7XG5cbnZhciBSZXNwb25zZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlc3BvbnNlKHhocikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXNwb25zZSk7XG5cbiAgICB0aGlzLl94aHIgPSB4aHI7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUmVzcG9uc2UsIFt7XG4gICAga2V5OiBcImdldFN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnN0YXR1cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhlYWRlcihoZWFkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Qm9keVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVRleHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVuZGVybHlpbmdPYmplY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VW5kZXJseWluZ09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlc3BvbnNlO1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZW5hYmxlRGVidWdMb2dcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xvZ2dlci5lbmFibGVEZWJ1Z0xvZztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5TdG9yZVVSTHNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3VybFN0b3JhZ2UuY2FuU3RvcmVVUkxzO1xuICB9XG59KTtcbmV4cG9ydHMuaXNTdXBwb3J0ZWQgPSBleHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZXhwb3J0cy5VcGxvYWQgPSB2b2lkIDA7XG5cbnZhciBfdXBsb2FkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vdXBsb2FkXCIpKTtcblxudmFyIF9ub29wVXJsU3RvcmFnZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL25vb3BVcmxTdG9yYWdlXCIpKTtcblxudmFyIF9sb2dnZXIgPSByZXF1aXJlKFwiLi4vbG9nZ2VyXCIpO1xuXG52YXIgX3VybFN0b3JhZ2UgPSByZXF1aXJlKFwiLi91cmxTdG9yYWdlXCIpO1xuXG52YXIgX2h0dHBTdGFjayA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vaHR0cFN0YWNrXCIpKTtcblxudmFyIF9maWxlUmVhZGVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9maWxlUmVhZGVyXCIpKTtcblxudmFyIF9maW5nZXJwcmludCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZmluZ2VycHJpbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7XG4gICAgICB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yO1xuXG4gICAgICByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlO1xuXG4gIHRyeSB7XG4gICAgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG4vKiBnbG9iYWwgd2luZG93ICovXG5cblxudmFyIGRlZmF1bHRPcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3VwbG9hZC5kZWZhdWx0LmRlZmF1bHRPcHRpb25zLCB7XG4gIGh0dHBTdGFjazogbmV3IF9odHRwU3RhY2suZGVmYXVsdCgpLFxuICBmaWxlUmVhZGVyOiBuZXcgX2ZpbGVSZWFkZXIuZGVmYXVsdCgpLFxuICB1cmxTdG9yYWdlOiBfdXJsU3RvcmFnZS5jYW5TdG9yZVVSTHMgPyBuZXcgX3VybFN0b3JhZ2UuV2ViU3RvcmFnZVVybFN0b3JhZ2UoKSA6IG5ldyBfbm9vcFVybFN0b3JhZ2UuZGVmYXVsdCgpLFxuICBmaW5nZXJwcmludDogX2ZpbmdlcnByaW50LmRlZmF1bHRcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbnZhciBVcGxvYWQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9CYXNlVXBsb2FkKSB7XG4gIF9pbmhlcml0cyhVcGxvYWQsIF9CYXNlVXBsb2FkKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKFVwbG9hZCk7XG5cbiAgZnVuY3Rpb24gVXBsb2FkKCkge1xuICAgIHZhciBmaWxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVcGxvYWQpO1xuXG4gICAgb3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIGRlZmF1bHRPcHRpb25zLCB7fSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGZpbGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFVwbG9hZCwgbnVsbCwgW3tcbiAgICBrZXk6IFwidGVybWluYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRlcm1pbmF0ZSh1cmwsIG9wdGlvbnMsIGNiKSB7XG4gICAgICBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHt9LCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBfdXBsb2FkLmRlZmF1bHQudGVybWluYXRlKHVybCwgb3B0aW9ucywgY2IpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBVcGxvYWQ7XG59KF91cGxvYWQuZGVmYXVsdCk7XG5cbmV4cG9ydHMuVXBsb2FkID0gVXBsb2FkO1xudmFyIF93aW5kb3cgPSB3aW5kb3csXG4gICAgWE1MSHR0cFJlcXVlc3QgPSBfd2luZG93LlhNTEh0dHBSZXF1ZXN0LFxuICAgIEJsb2IgPSBfd2luZG93LkJsb2I7XG52YXIgaXNTdXBwb3J0ZWQgPSBYTUxIdHRwUmVxdWVzdCAmJiBCbG9iICYmIHR5cGVvZiBCbG9iLnByb3RvdHlwZS5zbGljZSA9PT0gXCJmdW5jdGlvblwiO1xuZXhwb3J0cy5pc1N1cHBvcnRlZCA9IGlzU3VwcG9ydGVkOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgaXNDb3Jkb3ZhID0gZnVuY3Rpb24gaXNDb3Jkb3ZhKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiICYmICh0eXBlb2Ygd2luZG93LlBob25lR2FwICE9IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHdpbmRvdy5Db3Jkb3ZhICE9IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9IFwidW5kZWZpbmVkXCIpO1xufTtcblxudmFyIF9kZWZhdWx0ID0gaXNDb3Jkb3ZhO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBpc1JlYWN0TmF0aXZlID0gZnVuY3Rpb24gaXNSZWFjdE5hdGl2ZSgpIHtcbiAgcmV0dXJuIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG5hdmlnYXRvci5wcm9kdWN0ID09PSBcInN0cmluZ1wiICYmIG5hdmlnYXRvci5wcm9kdWN0LnRvTG93ZXJDYXNlKCkgPT09IFwicmVhY3RuYXRpdmVcIjtcbn07XG5cbnZhciBfZGVmYXVsdCA9IGlzUmVhY3ROYXRpdmU7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJlYWRBc0J5dGVBcnJheTtcblxuLyoqXG4gKiByZWFkQXNCeXRlQXJyYXkgY29udmVydHMgYSBGaWxlIG9iamVjdCB0byBhIFVpbnQ4QXJyYXkuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBvbiB0aGUgQXBhY2hlIENvcmRvdmEgcGxhdGZvcm0uXG4gKiBTZWUgaHR0cHM6Ly9jb3Jkb3ZhLmFwYWNoZS5vcmcvZG9jcy9lbi9sYXRlc3QvcmVmZXJlbmNlL2NvcmRvdmEtcGx1Z2luLWZpbGUvaW5kZXguaHRtbCNyZWFkLWEtZmlsZVxuICovXG5mdW5jdGlvbiByZWFkQXNCeXRlQXJyYXkoY2h1bmspIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBuZXcgVWludDhBcnJheShyZWFkZXIucmVzdWx0KTtcbiAgICAgIHJlc29sdmUoe1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH07XG5cbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoY2h1bmspO1xuICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHVyaVRvQmxvYjtcblxuLyoqXG4gKiB1cmlUb0Jsb2IgcmVzb2x2ZXMgYSBVUkkgdG8gYSBCbG9iIG9iamVjdC4gVGhpcyBpcyB1c2VkIGZvclxuICogUmVhY3QgTmF0aXZlIHRvIHJldHJpZXZlIGEgZmlsZSAoaWRlbnRpZmllZCBieSBhIGZpbGU6Ly9cbiAqIFVSSSkgYXMgYSBibG9iLlxuICovXG5mdW5jdGlvbiB1cmlUb0Jsb2IodXJpKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmxvYiA9IHhoci5yZXNwb25zZTtcbiAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfTtcblxuICAgIHhoci5vcGVuKFwiR0VUXCIsIHVyaSk7XG4gICAgeGhyLnNlbmQoKTtcbiAgfSk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldlYlN0b3JhZ2VVcmxTdG9yYWdlID0gZXhwb3J0cy5jYW5TdG9yZVVSTHMgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGdsb2JhbCB3aW5kb3csIGxvY2FsU3RvcmFnZSAqL1xuXG5cbnZhciBoYXNTdG9yYWdlID0gZmFsc2U7XG5cbnRyeSB7XG4gIGhhc1N0b3JhZ2UgPSBcImxvY2FsU3RvcmFnZVwiIGluIHdpbmRvdzsgLy8gQXR0ZW1wdCB0byBzdG9yZSBhbmQgcmVhZCBlbnRyaWVzIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UgdG8gZGV0ZWN0IFByaXZhdGVcbiAgLy8gTW9kZSBvbiBTYWZhcmkgb24gaU9TIChzZWUgIzQ5KVxuXG4gIHZhciBrZXkgPSBcInR1c1N1cHBvcnRcIjtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcbn0gY2F0Y2ggKGUpIHtcbiAgLy8gSWYgd2UgdHJ5IHRvIGFjY2VzcyBsb2NhbFN0b3JhZ2UgaW5zaWRlIGEgc2FuZGJveGVkIGlmcmFtZSwgYSBTZWN1cml0eUVycm9yXG4gIC8vIGlzIHRocm93bi4gV2hlbiBpbiBwcml2YXRlIG1vZGUgb24gaU9TIFNhZmFyaSwgYSBRdW90YUV4Y2VlZGVkRXJyb3IgaXNcbiAgLy8gdGhyb3duIChzZWUgIzQ5KVxuICBpZiAoZS5jb2RlID09PSBlLlNFQ1VSSVRZX0VSUiB8fCBlLmNvZGUgPT09IGUuUVVPVEFfRVhDRUVERURfRVJSKSB7XG4gICAgaGFzU3RvcmFnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IGU7XG4gIH1cbn1cblxudmFyIGNhblN0b3JlVVJMcyA9IGhhc1N0b3JhZ2U7XG5leHBvcnRzLmNhblN0b3JlVVJMcyA9IGNhblN0b3JlVVJMcztcblxudmFyIFdlYlN0b3JhZ2VVcmxTdG9yYWdlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gV2ViU3RvcmFnZVVybFN0b3JhZ2UoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdlYlN0b3JhZ2VVcmxTdG9yYWdlKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhXZWJTdG9yYWdlVXJsU3RvcmFnZSwgW3tcbiAgICBrZXk6IFwiZmluZEFsbFVwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZEFsbFVwbG9hZHMoKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IHRoaXMuX2ZpbmRFbnRyaWVzKFwidHVzOjpcIik7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRVcGxvYWRzQnlGaW5nZXJwcmludFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpIHtcbiAgICAgIHZhciByZXN1bHRzID0gdGhpcy5fZmluZEVudHJpZXMoXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZVVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVVcGxvYWQodXJsU3RvcmFnZUtleSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odXJsU3RvcmFnZUtleSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRVcGxvYWQoZmluZ2VycHJpbnQsIHVwbG9hZCkge1xuICAgICAgdmFyIGlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxMik7XG4gICAgICB2YXIga2V5ID0gXCJ0dXM6OlwiLmNvbmNhdChmaW5nZXJwcmludCwgXCI6OlwiKS5jb25jYXQoaWQpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh1cGxvYWQpKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoa2V5KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmRFbnRyaWVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5kRW50cmllcyhwcmVmaXgpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBfa2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcblxuICAgICAgICBpZiAoX2tleS5pbmRleE9mKHByZWZpeCkgIT09IDApIGNvbnRpbnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHVwbG9hZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oX2tleSkpO1xuICAgICAgICAgIHVwbG9hZC51cmxTdG9yYWdlS2V5ID0gX2tleTtcbiAgICAgICAgICByZXN1bHRzLnB1c2godXBsb2FkKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgey8vIFRoZSBKU09OIHBhcnNlIGVycm9yIGlzIGludGVudGlvbmFsbHkgaWdub3JlZCBoZXJlLCBzbyBhIG1hbGZvcm1lZFxuICAgICAgICAgIC8vIGVudHJ5IGluIHRoZSBzdG9yYWdlIGNhbm5vdCBwcmV2ZW50IGFuIHVwbG9hZC5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gV2ViU3RvcmFnZVVybFN0b3JhZ2U7XG59KCk7XG5cbmV4cG9ydHMuV2ViU3RvcmFnZVVybFN0b3JhZ2UgPSBXZWJTdG9yYWdlVXJsU3RvcmFnZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSkge1xuICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbmZ1bmN0aW9uIF93cmFwTmF0aXZlU3VwZXIoQ2xhc3MpIHtcbiAgdmFyIF9jYWNoZSA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiA/IG5ldyBNYXAoKSA6IHVuZGVmaW5lZDtcblxuICBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykge1xuICAgIGlmIChDbGFzcyA9PT0gbnVsbCB8fCAhX2lzTmF0aXZlRnVuY3Rpb24oQ2xhc3MpKSByZXR1cm4gQ2xhc3M7XG5cbiAgICBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIF9jYWNoZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYgKF9jYWNoZS5oYXMoQ2xhc3MpKSByZXR1cm4gX2NhY2hlLmdldChDbGFzcyk7XG5cbiAgICAgIF9jYWNoZS5zZXQoQ2xhc3MsIFdyYXBwZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFdyYXBwZXIoKSB7XG4gICAgICByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpO1xuICAgIH1cblxuICAgIFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBXcmFwcGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpO1xuICB9O1xuXG4gIHJldHVybiBfd3JhcE5hdGl2ZVN1cGVyKENsYXNzKTtcbn1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdChQYXJlbnQsIGFyZ3MsIENsYXNzKSB7XG4gIGlmIChfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHtcbiAgICBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7XG4gIH0gZWxzZSB7XG4gICAgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykge1xuICAgICAgdmFyIGEgPSBbbnVsbF07XG4gICAgICBhLnB1c2guYXBwbHkoYSwgYXJncyk7XG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAgIGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cbiAgdHJ5IHtcbiAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7XG4gIHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbnZhciBEZXRhaWxlZEVycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzKERldGFpbGVkRXJyb3IsIF9FcnJvcik7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEZXRhaWxlZEVycm9yKTtcblxuICBmdW5jdGlvbiBEZXRhaWxlZEVycm9yKG1lc3NhZ2UpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgY2F1c2luZ0VyciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICB2YXIgcmVxID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICAgIHZhciByZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV0YWlsZWRFcnJvcik7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuICAgIF90aGlzLm9yaWdpbmFsUmVxdWVzdCA9IHJlcTtcbiAgICBfdGhpcy5vcmlnaW5hbFJlc3BvbnNlID0gcmVzO1xuICAgIF90aGlzLmNhdXNpbmdFcnJvciA9IGNhdXNpbmdFcnI7XG5cbiAgICBpZiAoY2F1c2luZ0VyciAhPSBudWxsKSB7XG4gICAgICBtZXNzYWdlICs9IFwiLCBjYXVzZWQgYnkgXCIuY29uY2F0KGNhdXNpbmdFcnIudG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgaWYgKHJlcSAhPSBudWxsKSB7XG4gICAgICB2YXIgcmVxdWVzdElkID0gcmVxLmdldEhlYWRlcihcIlgtUmVxdWVzdC1JRFwiKSB8fCBcIm4vYVwiO1xuICAgICAgdmFyIG1ldGhvZCA9IHJlcS5nZXRNZXRob2QoKTtcbiAgICAgIHZhciB1cmwgPSByZXEuZ2V0VVJMKCk7XG4gICAgICB2YXIgc3RhdHVzID0gcmVzID8gcmVzLmdldFN0YXR1cygpIDogXCJuL2FcIjtcbiAgICAgIHZhciBib2R5ID0gcmVzID8gcmVzLmdldEJvZHkoKSB8fCBcIlwiIDogXCJuL2FcIjtcbiAgICAgIG1lc3NhZ2UgKz0gXCIsIG9yaWdpbmF0ZWQgZnJvbSByZXF1ZXN0IChtZXRob2Q6IFwiLmNvbmNhdChtZXRob2QsIFwiLCB1cmw6IFwiKS5jb25jYXQodXJsLCBcIiwgcmVzcG9uc2UgY29kZTogXCIpLmNvbmNhdChzdGF0dXMsIFwiLCByZXNwb25zZSB0ZXh0OiBcIikuY29uY2F0KGJvZHksIFwiLCByZXF1ZXN0IGlkOiBcIikuY29uY2F0KHJlcXVlc3RJZCwgXCIpXCIpO1xuICAgIH1cblxuICAgIF90aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHJldHVybiBEZXRhaWxlZEVycm9yO1xufSggLyojX19QVVJFX18qL193cmFwTmF0aXZlU3VwZXIoRXJyb3IpKTtcblxudmFyIF9kZWZhdWx0ID0gRGV0YWlsZWRFcnJvcjtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5lbmFibGVEZWJ1Z0xvZyA9IGVuYWJsZURlYnVnTG9nO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5cbi8qIGVzbGludCBuby1jb25zb2xlOiBcIm9mZlwiICovXG52YXIgaXNFbmFibGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnTG9nKCkge1xuICBpc0VuYWJsZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBsb2cobXNnKSB7XG4gIGlmICghaXNFbmFibGVkKSByZXR1cm47XG4gIGNvbnNvbGUubG9nKG1zZyk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiAqL1xuXG5cbnZhciBOb29wVXJsU3RvcmFnZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE5vb3BVcmxTdG9yYWdlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOb29wVXJsU3RvcmFnZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTm9vcFVybFN0b3JhZ2UsIFt7XG4gICAga2V5OiBcImxpc3RBbGxVcGxvYWRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RBbGxVcGxvYWRzKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpbmRVcGxvYWRzQnlGaW5nZXJwcmludFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlVXBsb2FkKHVybFN0b3JhZ2VLZXkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFVwbG9hZChmaW5nZXJwcmludCwgdXBsb2FkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOb29wVXJsU3RvcmFnZTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTm9vcFVybFN0b3JhZ2U7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBfZXJyb3IgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Vycm9yXCIpKTtcblxudmFyIF91dWlkID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dWlkXCIpKTtcblxudmFyIF9qc0Jhc2UgPSByZXF1aXJlKFwianMtYmFzZTY0XCIpO1xuXG52YXIgX3VybFBhcnNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwidXJsLXBhcnNlXCIpKTtcblxudmFyIF9sb2dnZXIgPSByZXF1aXJlKFwiLi9sb2dnZXJcIik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cbi8qIGdsb2JhbCB3aW5kb3cgKi9cblxuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVuZHBvaW50OiBudWxsLFxuICB1cGxvYWRVcmw6IG51bGwsXG4gIG1ldGFkYXRhOiB7fSxcbiAgZmluZ2VycHJpbnQ6IG51bGwsXG4gIHVwbG9hZFNpemU6IG51bGwsXG4gIG9uUHJvZ3Jlc3M6IG51bGwsXG4gIG9uQ2h1bmtDb21wbGV0ZTogbnVsbCxcbiAgb25TdWNjZXNzOiBudWxsLFxuICBvbkVycm9yOiBudWxsLFxuICBfb25VcGxvYWRVcmxBdmFpbGFibGU6IG51bGwsXG4gIG92ZXJyaWRlUGF0Y2hNZXRob2Q6IGZhbHNlLFxuICBoZWFkZXJzOiB7fSxcbiAgYWRkUmVxdWVzdElkOiBmYWxzZSxcbiAgb25CZWZvcmVSZXF1ZXN0OiBudWxsLFxuICBvbkFmdGVyUmVzcG9uc2U6IG51bGwsXG4gIGNodW5rU2l6ZTogSW5maW5pdHksXG4gIHJldHJ5RGVsYXlzOiBbMCwgMTAwMCwgMzAwMCwgNTAwMF0sXG4gIHBhcmFsbGVsVXBsb2FkczogMSxcbiAgc3RvcmVGaW5nZXJwcmludEZvclJlc3VtaW5nOiB0cnVlLFxuICByZW1vdmVGaW5nZXJwcmludE9uU3VjY2VzczogZmFsc2UsXG4gIHVwbG9hZExlbmd0aERlZmVycmVkOiBmYWxzZSxcbiAgdXBsb2FkRGF0YUR1cmluZ0NyZWF0aW9uOiBmYWxzZSxcbiAgdXJsU3RvcmFnZTogbnVsbCxcbiAgZmlsZVJlYWRlcjogbnVsbCxcbiAgaHR0cFN0YWNrOiBudWxsXG59O1xuXG52YXIgQmFzZVVwbG9hZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJhc2VVcGxvYWQoZmlsZSwgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlVXBsb2FkKTsgLy8gV2FybiBhYm91dCByZW1vdmVkIG9wdGlvbnMgZnJvbSBwcmV2aW91cyB2ZXJzaW9uc1xuXG5cbiAgICBpZiAoXCJyZXN1bWVcIiBpbiBvcHRpb25zKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInR1czogVGhlIGByZXN1bWVgIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkIGluIHR1cy1qcy1jbGllbnQgdjIuIFBsZWFzZSB1c2UgdGhlIFVSTCBzdG9yYWdlIEFQSSBpbnN0ZWFkLlwiKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgfSAvLyBUaGUgZGVmYXVsdCBvcHRpb25zIHdpbGwgYWxyZWFkeSBiZSBhZGRlZCBmcm9tIHRoZSB3cmFwcGVyIGNsYXNzZXMuXG5cblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7IC8vIFRoZSBzdG9yYWdlIG1vZHVsZSB1c2VkIHRvIHN0b3JlIFVSTHNcblxuICAgIHRoaXMuX3VybFN0b3JhZ2UgPSB0aGlzLm9wdGlvbnMudXJsU3RvcmFnZTsgLy8gVGhlIHVuZGVybHlpbmcgRmlsZS9CbG9iIG9iamVjdFxuXG4gICAgdGhpcy5maWxlID0gZmlsZTsgLy8gVGhlIFVSTCBhZ2FpbnN0IHdoaWNoIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWRcblxuICAgIHRoaXMudXJsID0gbnVsbDsgLy8gVGhlIHVuZGVybHlpbmcgcmVxdWVzdCBvYmplY3QgZm9yIHRoZSBjdXJyZW50IFBBVENIIHJlcXVlc3RcblxuICAgIHRoaXMuX3JlcSA9IG51bGw7IC8vIFRoZSBmaW5nZXJwaW5ydCBmb3IgdGhlIGN1cnJlbnQgZmlsZSAoc2V0IGFmdGVyIHN0YXJ0KCkpXG5cbiAgICB0aGlzLl9maW5nZXJwcmludCA9IG51bGw7IC8vIFRoZSBrZXkgdGhhdCB0aGUgVVJMIHN0b3JhZ2UgcmV0dXJuZWQgd2hlbiBzYXZpbmcgYW4gVVJMIHdpdGggYSBmaW5nZXJwcmludCxcblxuICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBudWxsOyAvLyBUaGUgb2Zmc2V0IHVzZWQgaW4gdGhlIGN1cnJlbnQgUEFUQ0ggcmVxdWVzdFxuXG4gICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDsgLy8gVHJ1ZSBpZiB0aGUgY3VycmVudCBQQVRDSCByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWRcblxuICAgIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTsgLy8gVGhlIGZpbGUncyBzaXplIGluIGJ5dGVzXG5cbiAgICB0aGlzLl9zaXplID0gbnVsbDsgLy8gVGhlIFNvdXJjZSBvYmplY3Qgd2hpY2ggd2lsbCB3cmFwIGFyb3VuZCB0aGUgZ2l2ZW4gZmlsZSBhbmQgcHJvdmlkZXMgdXNcbiAgICAvLyB3aXRoIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGdldHRpbmcgaXRzIHNpemUgYW5kIHNsaWNlIGNodW5rcyBmcm9tIGl0c1xuICAgIC8vIGNvbnRlbnQgYWxsb3dpbmcgdXMgdG8gZWFzaWx5IGhhbmRsZSBGaWxlcywgQmxvYnMsIEJ1ZmZlcnMgYW5kIFN0cmVhbXMuXG5cbiAgICB0aGlzLl9zb3VyY2UgPSBudWxsOyAvLyBUaGUgY3VycmVudCBjb3VudCBvZiBhdHRlbXB0cyB3aGljaCBoYXZlIGJlZW4gbWFkZS4gWmVybyBpbmRpY2F0ZXMgbm9uZS5cblxuICAgIHRoaXMuX3JldHJ5QXR0ZW1wdCA9IDA7IC8vIFRoZSB0aW1lb3V0J3MgSUQgd2hpY2ggaXMgdXNlZCB0byBkZWxheSB0aGUgbmV4dCByZXRyeVxuXG4gICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gbnVsbDsgLy8gVGhlIG9mZnNldCBvZiB0aGUgcmVtb3RlIHVwbG9hZCBiZWZvcmUgdGhlIGxhdGVzdCBhdHRlbXB0IHdhcyBzdGFydGVkLlxuXG4gICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSAwOyAvLyBBbiBhcnJheSBvZiBCYXNlVXBsb2FkIGluc3RhbmNlcyB3aGljaCBhcmUgdXNlZCBmb3IgdXBsb2FkaW5nIHRoZSBkaWZmZXJlbnRcbiAgICAvLyBwYXJ0cywgaWYgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gaXMgdXNlZC5cblxuICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IG51bGw7IC8vIEFuIGFycmF5IG9mIHVwbG9hZCBVUkxzIHdoaWNoIGFyZSB1c2VkIGZvciB1cGxvYWRpbmcgdGhlIGRpZmZlcmVudFxuICAgIC8vIHBhcnRzLCBpZiB0aGUgcGFyYWxsZWxVcGxvYWRzIG9wdGlvbiBpcyB1c2VkLlxuXG4gICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzID0gbnVsbDtcbiAgfVxuICAvKipcbiAgICogVXNlIHRoZSBUZXJtaW5hdGlvbiBleHRlbnNpb24gdG8gZGVsZXRlIGFuIHVwbG9hZCBmcm9tIHRoZSBzZXJ2ZXIgYnkgc2VuZGluZyBhIERFTEVURVxuICAgKiByZXF1ZXN0IHRvIHRoZSBzcGVjaWZpZWQgdXBsb2FkIFVSTC4gVGhpcyBpcyBvbmx5IHBvc3NpYmxlIGlmIHRoZSBzZXJ2ZXIgc3VwcG9ydHMgdGhlXG4gICAqIFRlcm1pbmF0aW9uIGV4dGVuc2lvbi4gSWYgdGhlIGBvcHRpb25zLnJldHJ5RGVsYXlzYCBwcm9wZXJ0eSBpcyBzZXQsIHRoZSBtZXRob2Qgd2lsbFxuICAgKiBhbHNvIHJldHJ5IGlmIGFuIGVycm9yIG9jdXJycy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgdXBsb2FkJ3MgVVJMIHdoaWNoIHdpbGwgYmUgdGVybWluYXRlZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgb3B0aW9ucyBmb3IgaW5mbHVlbmNpbmcgSFRUUCByZXF1ZXN0cy5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKEJhc2VVcGxvYWQsIFt7XG4gICAga2V5OiBcImZpbmRQcmV2aW91c1VwbG9hZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmluZFByZXZpb3VzVXBsb2FkcygpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZ2VycHJpbnQodGhpcy5maWxlLCB0aGlzLm9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGZpbmdlcnByaW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fdXJsU3RvcmFnZS5maW5kVXBsb2Fkc0J5RmluZ2VycHJpbnQoZmluZ2VycHJpbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3VtZUZyb21QcmV2aW91c1VwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXN1bWVGcm9tUHJldmlvdXNVcGxvYWQocHJldmlvdXNVcGxvYWQpIHtcbiAgICAgIHRoaXMudXJsID0gcHJldmlvdXNVcGxvYWQudXBsb2FkVXJsIHx8IG51bGw7XG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBwcmV2aW91c1VwbG9hZC5wYXJhbGxlbFVwbG9hZFVybHMgfHwgbnVsbDtcbiAgICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBwcmV2aW91c1VwbG9hZC51cmxTdG9yYWdlS2V5O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZmlsZSA9IHRoaXMuZmlsZTtcblxuICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IoXCJ0dXM6IG5vIGZpbGUgb3Igc3RyZWFtIHRvIHVwbG9hZCBwcm92aWRlZFwiKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbmRwb2ludCAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZFVybCkge1xuICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBuZWl0aGVyIGFuIGVuZHBvaW50IG9yIGFuIHVwbG9hZCBVUkwgaXMgcHJvdmlkZWRcIikpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJldHJ5RGVsYXlzID0gdGhpcy5vcHRpb25zLnJldHJ5RGVsYXlzO1xuXG4gICAgICBpZiAocmV0cnlEZWxheXMgIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmV0cnlEZWxheXMpICE9PSBcIltvYmplY3QgQXJyYXldXCIpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogdGhlIGByZXRyeURlbGF5c2Agb3B0aW9uIG11c3QgZWl0aGVyIGJlIGFuIGFycmF5IG9yIG51bGxcIikpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHMgPiAxKSB7XG4gICAgICAgIC8vIFRlc3Qgd2hpY2ggb3B0aW9ucyBhcmUgaW5jb21wYXRpYmxlIHdpdGggcGFyYWxsZWwgdXBsb2Fkcy5cbiAgICAgICAgW1widXBsb2FkVXJsXCIsIFwidXBsb2FkU2l6ZVwiLCBcInVwbG9hZExlbmd0aERlZmVycmVkXCJdLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbk5hbWUpIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnNbb3B0aW9uTmFtZV0pIHtcbiAgICAgICAgICAgIF90aGlzMi5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogY2Fubm90IHVzZSB0aGUgXCIuY29uY2F0KG9wdGlvbk5hbWUsIFwiIG9wdGlvbiB3aGVuIHBhcmFsbGVsVXBsb2FkcyBpcyBlbmFibGVkXCIpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmZpbmdlcnByaW50KGZpbGUsIHRoaXMub3B0aW9ucykudGhlbihmdW5jdGlvbiAoZmluZ2VycHJpbnQpIHtcbiAgICAgICAgaWYgKGZpbmdlcnByaW50ID09IG51bGwpIHtcbiAgICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiTm8gZmluZ2VycHJpbnQgd2FzIGNhbGN1bGF0ZWQgbWVhbmluZyB0aGF0IHRoZSB1cGxvYWQgY2Fubm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICgwLCBfbG9nZ2VyLmxvZykoXCJDYWxjdWxhdGVkIGZpbmdlcnByaW50OiBcIi5jb25jYXQoZmluZ2VycHJpbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5fZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDtcblxuICAgICAgICBpZiAoX3RoaXMyLl9zb3VyY2UpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMyLl9zb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMi5vcHRpb25zLmZpbGVSZWFkZXIub3BlbkZpbGUoZmlsZSwgX3RoaXMyLm9wdGlvbnMuY2h1bmtTaXplKTtcbiAgICAgICAgfVxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIF90aGlzMi5fc291cmNlID0gc291cmNlOyAvLyBJZiB0aGUgdXBsb2FkIHdhcyBjb25maWd1cmVkIHRvIHVzZSBtdWx0aXBsZSByZXF1ZXN0cyBvciBpZiB3ZSByZXN1bWUgZnJvbVxuICAgICAgICAvLyBhbiB1cGxvYWQgd2hpY2ggdXNlZCBtdWx0aXBsZSByZXF1ZXN0cywgd2Ugc3RhcnQgYSBwYXJhbGxlbCB1cGxvYWQuXG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnBhcmFsbGVsVXBsb2FkcyA+IDEgfHwgX3RoaXMyLl9wYXJhbGxlbFVwbG9hZFVybHMgIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRQYXJhbGxlbFVwbG9hZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzMi5fc3RhcnRTaW5nbGVVcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMi5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgcGFyYWxsZWxpemVkIHVwbG9hZCwgd2hlcmUgb25lIGZpbGUgaXMgc3BsaXQgaW50b1xuICAgICAqIG11bHRpcGxlIHJlcXVlc3Qgd2hpY2ggYXJlIHJ1biBpbiBwYXJhbGxlbC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3N0YXJ0UGFyYWxsZWxVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0UGFyYWxsZWxVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHRvdGFsU2l6ZSA9IHRoaXMuX3NpemUgPSB0aGlzLl9zb3VyY2Uuc2l6ZTtcbiAgICAgIHZhciB0b3RhbFByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuX3BhcmFsbGVsVXBsb2FkcyA9IFtdO1xuICAgICAgdmFyIHBhcnRDb3VudCA9IHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyAhPSBudWxsID8gdGhpcy5fcGFyYWxsZWxVcGxvYWRVcmxzLmxlbmd0aCA6IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7IC8vIFRoZSBpbnB1dCBmaWxlIHdpbGwgYmUgc3BsaXQgaW50byBtdWx0aXBsZSBzbGljZXMgd2hpY2ggYXJlIHVwbG9hZGVkIGluIHNlcGFyYXRlXG4gICAgICAvLyByZXF1ZXN0cy4gSGVyZSB3ZSBnZW5lcmF0ZSB0aGUgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBmb3IgdGhlIHNsaWNlcy5cblxuICAgICAgdmFyIHBhcnRzID0gc3BsaXRTaXplSW50b1BhcnRzKHRoaXMuX3NvdXJjZS5zaXplLCBwYXJ0Q291bnQsIHRoaXMuX3BhcmFsbGVsVXBsb2FkVXJscyk7IC8vIENyZWF0ZSBhbiBlbXB0eSBsaXN0IGZvciBzdG9yaW5nIHRoZSB1cGxvYWQgVVJMc1xuXG4gICAgICB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHMgPSBuZXcgQXJyYXkocGFydHMubGVuZ3RoKTsgLy8gR2VuZXJhdGUgYSBwcm9taXNlIGZvciBlYWNoIHNsaWNlIHRoYXQgd2lsbCBiZSByZXNvbHZlIGlmIHRoZSByZXNwZWN0aXZlXG4gICAgICAvLyB1cGxvYWQgaXMgY29tcGxldGVkLlxuXG4gICAgICB2YXIgdXBsb2FkcyA9IHBhcnRzLm1hcChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGxhc3RQYXJ0UHJvZ3Jlc3MgPSAwO1xuICAgICAgICByZXR1cm4gX3RoaXMzLl9zb3VyY2Uuc2xpY2UocGFydC5zdGFydCwgcGFydC5lbmQpLnRoZW4oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBfcmVmLnZhbHVlO1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvLyBNZXJnZSB3aXRoIHRoZSB1c2VyIHN1cHBsaWVkIG9wdGlvbnMgYnV0IG92ZXJ3cml0ZSBzb21lIHZhbHVlcy5cbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3RoaXMzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgLy8gSWYgYXZhaWxhYmxlLCB0aGUgcGFydGlhbCB1cGxvYWQgc2hvdWxkIGJlIHJlc3VtZWQgZnJvbSBhIHByZXZpb3VzIFVSTC5cbiAgICAgICAgICAgICAgdXBsb2FkVXJsOiBwYXJ0LnVwbG9hZFVybCB8fCBudWxsLFxuICAgICAgICAgICAgICAvLyBXZSB0YWtlIG1hbnVhbGx5IGNhcmUgb2YgcmVzdW1pbmcgZm9yIHBhcnRpYWwgdXBsb2Fkcywgc28gdGhleSBzaG91bGRcbiAgICAgICAgICAgICAgLy8gbm90IGJlIHN0b3JlZCBpbiB0aGUgVVJMIHN0b3JhZ2UuXG4gICAgICAgICAgICAgIHN0b3JlRmluZ2VycHJpbnRGb3JSZXN1bWluZzogZmFsc2UsXG4gICAgICAgICAgICAgIHJlbW92ZUZpbmdlcnByaW50T25TdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBhcmFsbGVsVXBsb2FkcyBvcHRpb24gdG8gbm90IGNhdXNlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxLFxuICAgICAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgICAgIC8vIEFkZCB0aGUgaGVhZGVyIHRvIGluZGljYXRlIHRoZSB0aGlzIGlzIGEgcGFydGlhbCB1cGxvYWQuXG4gICAgICAgICAgICAgIGhlYWRlcnM6IF9vYmplY3RTcHJlYWQoe30sIF90aGlzMy5vcHRpb25zLmhlYWRlcnMsIHtcbiAgICAgICAgICAgICAgICBcIlVwbG9hZC1Db25jYXRcIjogXCJwYXJ0aWFsXCJcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIC8vIFJlamVjdCBvciByZXNvbHZlIHRoZSBwcm9taXNlIGlmIHRoZSB1cGxvYWQgZXJyb3JzIG9yIGNvbXBsZXRlcy5cbiAgICAgICAgICAgICAgb25TdWNjZXNzOiByZXNvbHZlLFxuICAgICAgICAgICAgICBvbkVycm9yOiByZWplY3QsXG4gICAgICAgICAgICAgIC8vIEJhc2VkIGluIHRoZSBwcm9ncmVzcyBmb3IgdGhpcyBwYXJ0aWFsIHVwbG9hZCwgY2FsY3VsYXRlIHRoZSBwcm9ncmVzc1xuICAgICAgICAgICAgICAvLyBmb3IgdGhlIGVudGlyZSBmaW5hbCB1cGxvYWQuXG4gICAgICAgICAgICAgIG9uUHJvZ3Jlc3M6IGZ1bmN0aW9uIG9uUHJvZ3Jlc3MobmV3UGFydFByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgdG90YWxQcm9ncmVzcyA9IHRvdGFsUHJvZ3Jlc3MgLSBsYXN0UGFydFByb2dyZXNzICsgbmV3UGFydFByb2dyZXNzO1xuICAgICAgICAgICAgICAgIGxhc3RQYXJ0UHJvZ3Jlc3MgPSBuZXdQYXJ0UHJvZ3Jlc3M7XG5cbiAgICAgICAgICAgICAgICBfdGhpczMuX2VtaXRQcm9ncmVzcyh0b3RhbFByb2dyZXNzLCB0b3RhbFNpemUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAvLyBXYWl0IHVudGlsIGV2ZXJ5IHBhcnRpYWwgdXBsb2FkIGhhcyBhbiB1cGxvYWQgVVJMLCBzbyB3ZSBjYW4gYWRkXG4gICAgICAgICAgICAgIC8vIHRoZW0gdG8gdGhlIFVSTCBzdG9yYWdlLlxuICAgICAgICAgICAgICBfb25VcGxvYWRVcmxBdmFpbGFibGU6IGZ1bmN0aW9uIF9vblVwbG9hZFVybEF2YWlsYWJsZSgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMuX3BhcmFsbGVsVXBsb2FkVXJsc1tpbmRleF0gPSB1cGxvYWQudXJsOyAvLyBUZXN0IGlmIGFsbCB1cGxvYWRzIGhhdmUgcmVjZWl2ZWQgYW4gVVJMXG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMzLl9wYXJhbGxlbFVwbG9hZFVybHMuZmlsdGVyKGZ1bmN0aW9uICh1KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gISF1O1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA9PT0gcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczMuX3NhdmVVcGxvYWRJblVybFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdXBsb2FkID0gbmV3IEJhc2VVcGxvYWQodmFsdWUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdXBsb2FkLnN0YXJ0KCk7IC8vIFN0b3JlIHRoZSB1cGxvYWQgaW4gYW4gYXJyYXksIHNvIHdlIGNhbiBsYXRlciBhYm9ydCB0aGVtIGlmIG5lY2Vzc2FyeS5cblxuICAgICAgICAgICAgX3RoaXMzLl9wYXJhbGxlbFVwbG9hZHMucHVzaCh1cGxvYWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlcTsgLy8gV2FpdCB1bnRpbCBhbGwgcGFydGlhbCB1cGxvYWRzIGFyZSBmaW5pc2hlZCBhbmQgd2UgY2FuIHNlbmQgdGhlIFBPU1QgcmVxdWVzdCBmb3JcbiAgICAgIC8vIGNyZWF0aW5nIHRoZSBmaW5hbCB1cGxvYWQuXG5cbiAgICAgIFByb21pc2UuYWxsKHVwbG9hZHMpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXEgPSBfdGhpczMuX29wZW5SZXF1ZXN0KFwiUE9TVFwiLCBfdGhpczMub3B0aW9ucy5lbmRwb2ludCk7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtQ29uY2F0XCIsIFwiZmluYWw7XCIuY29uY2F0KF90aGlzMy5fcGFyYWxsZWxVcGxvYWRVcmxzLmpvaW4oXCIgXCIpKSk7IC8vIEFkZCBtZXRhZGF0YSBpZiB2YWx1ZXMgaGF2ZSBiZWVuIGFkZGVkXG5cbiAgICAgICAgdmFyIG1ldGFkYXRhID0gZW5jb2RlTWV0YWRhdGEoX3RoaXMzLm9wdGlvbnMubWV0YWRhdGEpO1xuXG4gICAgICAgIGlmIChtZXRhZGF0YSAhPT0gXCJcIikge1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtTWV0YWRhdGFcIiwgbWV0YWRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzMy5fc2VuZFJlcXVlc3QocmVxLCBudWxsKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIWluU3RhdHVzQ2F0ZWdvcnkocmVzLmdldFN0YXR1cygpLCAyMDApKSB7XG4gICAgICAgICAgX3RoaXMzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogdW5leHBlY3RlZCByZXNwb25zZSB3aGlsZSBjcmVhdGluZyB1cGxvYWRcIik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jYXRpb24gPSByZXMuZ2V0SGVhZGVyKFwiTG9jYXRpb25cIik7XG5cbiAgICAgICAgaWYgKGxvY2F0aW9uID09IG51bGwpIHtcbiAgICAgICAgICBfdGhpczMuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiBpbnZhbGlkIG9yIG1pc3NpbmcgTG9jYXRpb24gaGVhZGVyXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnVybCA9IHJlc29sdmVVcmwoX3RoaXMzLm9wdGlvbnMuZW5kcG9pbnQsIGxvY2F0aW9uKTtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIkNyZWF0ZWQgdXBsb2FkIGF0IFwiLmNvbmNhdChfdGhpczMudXJsKSk7XG5cbiAgICAgICAgX3RoaXMzLl9lbWl0U3VjY2VzcygpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMy5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5pdGlhdGUgdGhlIHVwbG9hZGluZyBwcm9jZWR1cmUgZm9yIGEgbm9uLXBhcmFsbGVsIHVwbG9hZC4gSGVyZSB0aGUgZW50aXJlIGZpbGUgaXNcbiAgICAgKiB1cGxvYWRlZCBpbiBhIHNlcXVlbnRpYWwgbWF0dGVyLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfc3RhcnRTaW5nbGVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3N0YXJ0U2luZ2xlVXBsb2FkKCkge1xuICAgICAgLy8gRmlyc3QsIHdlIGxvb2sgYXQgdGhlIHVwbG9hZExlbmd0aERlZmVycmVkIG9wdGlvbi5cbiAgICAgIC8vIE5leHQsIHdlIGNoZWNrIGlmIHRoZSBjYWxsZXIgaGFzIHN1cHBsaWVkIGEgbWFudWFsIHVwbG9hZCBzaXplLlxuICAgICAgLy8gRmluYWxseSwgd2UgdHJ5IHRvIHVzZSB0aGUgY2FsY3VsYXRlZCBzaXplIGZyb20gdGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSArdGhpcy5vcHRpb25zLnVwbG9hZFNpemU7XG5cbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuX3NpemUpKSB7XG4gICAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogY2Fubm90IGNvbnZlcnQgYHVwbG9hZFNpemVgIG9wdGlvbiBpbnRvIGEgbnVtYmVyXCIpKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHRoaXMuX3NvdXJjZS5zaXplO1xuXG4gICAgICAgIGlmICh0aGlzLl9zaXplID09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKFwidHVzOiBjYW5ub3QgYXV0b21hdGljYWxseSBkZXJpdmUgdXBsb2FkJ3Mgc2l6ZSBmcm9tIGlucHV0IGFuZCBtdXN0IGJlIHNwZWNpZmllZCBtYW51YWxseSB1c2luZyB0aGUgYHVwbG9hZFNpemVgIG9wdGlvblwiKSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gLy8gUmVzZXQgdGhlIGFib3J0ZWQgZmxhZyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RhcnRlZCBvciBlbHNlIHRoZVxuICAgICAgLy8gX3BlcmZvcm1VcGxvYWQgd2lsbCBzdG9wIGJlZm9yZSBzZW5kaW5nIGEgcmVxdWVzdCBpZiB0aGUgdXBsb2FkIGhhcyBiZWVuXG4gICAgICAvLyBhYm9ydGVkIHByZXZpb3VzbHkuXG5cblxuICAgICAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlOyAvLyBUaGUgdXBsb2FkIGhhZCBiZWVuIHN0YXJ0ZWQgcHJldmlvdXNseSBhbmQgd2Ugc2hvdWxkIHJldXNlIHRoaXMgVVJMLlxuXG4gICAgICBpZiAodGhpcy51cmwgIT0gbnVsbCkge1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiUmVzdW1pbmcgdXBsb2FkIGZyb20gcHJldmlvdXMgVVJMOiBcIi5jb25jYXQodGhpcy51cmwpKTtcblxuICAgICAgICB0aGlzLl9yZXN1bWVVcGxvYWQoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIEEgVVJMIGhhcyBtYW51YWxseSBiZWVuIHNwZWNpZmllZCwgc28gd2UgdHJ5IHRvIHJlc3VtZVxuXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkVXJsICE9IG51bGwpIHtcbiAgICAgICAgKDAsIF9sb2dnZXIubG9nKShcIlJlc3VtaW5nIHVwbG9hZCBmcm9tIHByb3ZpZGVkIFVSTDogXCIuY29uY2F0KHRoaXMub3B0aW9ucy51cmwpKTtcbiAgICAgICAgdGhpcy51cmwgPSB0aGlzLm9wdGlvbnMudXBsb2FkVXJsO1xuXG4gICAgICAgIHRoaXMuX3Jlc3VtZVVwbG9hZCgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gQW4gdXBsb2FkIGhhcyBub3Qgc3RhcnRlZCBmb3IgdGhlIGZpbGUgeWV0LCBzbyB3ZSBzdGFydCBhIG5ldyBvbmVcblxuXG4gICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiQ3JlYXRpbmcgYSBuZXcgdXBsb2FkXCIpO1xuXG4gICAgICB0aGlzLl9jcmVhdGVVcGxvYWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWJvcnQgYW55IHJ1bm5pbmcgcmVxdWVzdCBhbmQgc3RvcCB0aGUgY3VycmVudCB1cGxvYWQuIEFmdGVyIGFib3J0IGlzIGNhbGxlZCwgbm8gZXZlbnRcbiAgICAgKiBoYW5kbGVyIHdpbGwgYmUgaW52b2tlZCBhbnltb3JlLiBZb3UgY2FuIHVzZSB0aGUgYHN0YXJ0YCBtZXRob2QgdG8gcmVzdW1lIHRoZSB1cGxvYWRcbiAgICAgKiBhZ2Fpbi5cbiAgICAgKiBJZiBgc2hvdWxkVGVybWluYXRlYCBpcyB0cnVlLCB0aGUgYHRlcm1pbmF0ZWAgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gcmVtb3ZlIHRoZVxuICAgICAqIGN1cnJlbnQgdXBsb2FkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvdWxkVGVybWluYXRlIFRydWUgaWYgdGhlIHVwbG9hZCBzaG91bGQgYmUgZGVsZXRlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2Ugd2lsbCBiZSByZXNvbHZlZC9yZWplY3RlZCB3aGVuIHRoZSByZXF1ZXN0cyBmaW5pc2guXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJhYm9ydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhYm9ydChzaG91bGRUZXJtaW5hdGUsIGNiKSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogdGhlIGFib3J0IGZ1bmN0aW9uIGRvZXMgbm90IGFjY2VwdCBhIGNhbGxiYWNrIHNpbmNlIHYyIGFueW1vcmU7IHBsZWFzZSB1c2UgdGhlIHJldHVybmVkIFByb21pc2UgaW5zdGVhZFwiKTtcbiAgICAgIH0gLy8gU3RvcCBhbnkgcGFyYWxsZWwgcGFydGlhbCB1cGxvYWRzLCB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGluIF9zdGFydFBhcmFsbGVsVXBsb2Fkcy5cblxuXG4gICAgICBpZiAodGhpcy5fcGFyYWxsZWxVcGxvYWRzICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFyYWxsZWxVcGxvYWRzLmZvckVhY2goZnVuY3Rpb24gKHVwbG9hZCkge1xuICAgICAgICAgIHVwbG9hZC5hYm9ydChzaG91bGRUZXJtaW5hdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gLy8gU3RvcCBhbnkgY3VycmVudCBydW5uaW5nIHJlcXVlc3QuXG5cblxuICAgICAgaWYgKHRoaXMuX3JlcSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9yZXEuYWJvcnQoKTtcblxuICAgICAgICB0aGlzLl9zb3VyY2UuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWU7IC8vIFN0b3AgYW55IHRpbWVvdXQgdXNlZCBmb3IgaW5pdGlhdGluZyBhIHJldHJ5LlxuXG4gICAgICBpZiAodGhpcy5fcmV0cnlUaW1lb3V0ICE9IG51bGwpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JldHJ5VGltZW91dCk7XG4gICAgICAgIHRoaXMuX3JldHJ5VGltZW91dCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2hvdWxkVGVybWluYXRlIHx8IHRoaXMudXJsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQmFzZVVwbG9hZC50ZXJtaW5hdGUodGhpcy51cmwsIHRoaXMub3B0aW9ucykgLy8gUmVtb3ZlIGVudHJ5IGZyb20gdGhlIFVSTCBzdG9yYWdlIHNpbmNlIHRoZSB1cGxvYWQgVVJMIGlzIG5vIGxvbmdlciB2YWxpZC5cbiAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNC5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdEh0dHBFcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgbWVzc2FnZSwgY2F1c2luZ0Vycikge1xuICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBfZXJyb3IuZGVmYXVsdChtZXNzYWdlLCBjYXVzaW5nRXJyLCByZXEsIHJlcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZW1pdEVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0RXJyb3IoZXJyKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpczsgLy8gRG8gbm90IGVtaXQgZXJyb3JzLCBlLmcuIGZyb20gYWJvcnRlZCBIVFRQIHJlcXVlc3RzLCBpZiB0aGUgdXBsb2FkIGhhcyBiZWVuIHN0b3BwZWQuXG5cblxuICAgICAgaWYgKHRoaXMuX2Fib3J0ZWQpIHJldHVybjsgLy8gQ2hlY2sgaWYgd2Ugc2hvdWxkIHJldHJ5LCB3aGVuIGVuYWJsZWQsIGJlZm9yZSBzZW5kaW5nIHRoZSBlcnJvciB0byB0aGUgdXNlci5cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXRyeURlbGF5cyAhPSBudWxsKSB7XG4gICAgICAgIC8vIFdlIHdpbGwgcmVzZXQgdGhlIGF0dGVtcHQgY291bnRlciBpZlxuICAgICAgICAvLyAtIHdlIHdlcmUgYWxyZWFkeSBhYmxlIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlciAob2Zmc2V0ICE9IG51bGwpIGFuZFxuICAgICAgICAvLyAtIHdlIHdlcmUgYWJsZSB0byB1cGxvYWQgYSBzbWFsbCBjaHVuayBvZiBkYXRhIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgdmFyIHNob3VsZFJlc2V0RGVsYXlzID0gdGhpcy5fb2Zmc2V0ICE9IG51bGwgJiYgdGhpcy5fb2Zmc2V0ID4gdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnk7XG5cbiAgICAgICAgaWYgKHNob3VsZFJlc2V0RGVsYXlzKSB7XG4gICAgICAgICAgdGhpcy5fcmV0cnlBdHRlbXB0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRSZXRyeShlcnIsIHRoaXMuX3JldHJ5QXR0ZW1wdCwgdGhpcy5vcHRpb25zKSkge1xuICAgICAgICAgIHZhciBkZWxheSA9IHRoaXMub3B0aW9ucy5yZXRyeURlbGF5c1t0aGlzLl9yZXRyeUF0dGVtcHQrK107XG4gICAgICAgICAgdGhpcy5fb2Zmc2V0QmVmb3JlUmV0cnkgPSB0aGlzLl9vZmZzZXQ7XG4gICAgICAgICAgdGhpcy5fcmV0cnlUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczUuc3RhcnQoKTtcbiAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uRXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25FcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIGlmIHRoZSB1cGxvYWQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZC5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2VtaXRTdWNjZXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lbWl0U3VjY2VzcygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHN0b3JlZCBmaW5nZXJwcmludCBhbmQgY29ycmVzcG9uZGluZyBlbmRwb2ludC4gVGhpcyBjYXVzZXNcbiAgICAgICAgLy8gbmV3IHVwbG9hZHMgb2YgdGhlIHNhbWUgZmlsZSB0byBiZSB0cmVhdGVkIGFzIGEgZGlmZmVyZW50IGZpbGUuXG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21VcmxTdG9yYWdlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uU3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vblN1Y2Nlc3MoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVibGlzaGVzIG5vdGlmaWNhdGlvbiB3aGVuIGRhdGEgaGFzIGJlZW4gc2VudCB0byB0aGUgc2VydmVyLiBUaGlzXG4gICAgICogZGF0YSBtYXkgbm90IGhhdmUgYmVlbiBhY2NlcHRlZCBieSB0aGUgc2VydmVyIHlldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieXRlc1NlbnQgIE51bWJlciBvZiBieXRlcyBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0UHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VtaXRQcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uUHJvZ3Jlc3MgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25Qcm9ncmVzcyhieXRlc1NlbnQsIGJ5dGVzVG90YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdWJsaXNoZXMgbm90aWZpY2F0aW9uIHdoZW4gYSBjaHVuayBvZiBkYXRhIGhhcyBiZWVuIHNlbnQgdG8gdGhlIHNlcnZlclxuICAgICAqIGFuZCBhY2NlcHRlZCBieSB0aGUgc2VydmVyLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjaHVua1NpemUgIFNpemUgb2YgdGhlIGNodW5rIHRoYXQgd2FzIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzQWNjZXB0ZWQgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRoYXQgaGF2ZSBiZWVuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdGVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5dGVzVG90YWwgVG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9lbWl0Q2h1bmtDb21wbGV0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZW1pdENodW5rQ29tcGxldGUoY2h1bmtTaXplLCBieXRlc0FjY2VwdGVkLCBieXRlc1RvdGFsKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkNodW5rQ29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DaHVua0NvbXBsZXRlKGNodW5rU2l6ZSwgYnl0ZXNBY2NlcHRlZCwgYnl0ZXNUb3RhbCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyB1cGxvYWQgdXNpbmcgdGhlIGNyZWF0aW9uIGV4dGVuc2lvbiBieSBzZW5kaW5nIGEgUE9TVFxuICAgICAqIHJlcXVlc3QgdG8gdGhlIGVuZHBvaW50LiBBZnRlciBzdWNjZXNzZnVsIGNyZWF0aW9uIHRoZSBmaWxlIHdpbGwgYmVcbiAgICAgKiB1cGxvYWRlZFxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfY3JlYXRlVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVVcGxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdEVycm9yKG5ldyBFcnJvcihcInR1czogdW5hYmxlIHRvIGNyZWF0ZSB1cGxvYWQgYmVjYXVzZSBubyBlbmRwb2ludCBpcyBwcm92aWRlZFwiKSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJQT1NUXCIsIHRoaXMub3B0aW9ucy5lbmRwb2ludCk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgcmVxLnNldEhlYWRlcihcIlVwbG9hZC1EZWZlci1MZW5ndGhcIiwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEuc2V0SGVhZGVyKFwiVXBsb2FkLUxlbmd0aFwiLCB0aGlzLl9zaXplKTtcbiAgICAgIH0gLy8gQWRkIG1ldGFkYXRhIGlmIHZhbHVlcyBoYXZlIGJlZW4gYWRkZWRcblxuXG4gICAgICB2YXIgbWV0YWRhdGEgPSBlbmNvZGVNZXRhZGF0YSh0aGlzLm9wdGlvbnMubWV0YWRhdGEpO1xuXG4gICAgICBpZiAobWV0YWRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgcmVxLnNldEhlYWRlcihcIlVwbG9hZC1NZXRhZGF0YVwiLCBtZXRhZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9taXNlO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbiAmJiAhdGhpcy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgICAgIHByb21pc2UgPSB0aGlzLl9hZGRDaHVua1RvUmVxdWVzdChyZXEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZSA9IHRoaXMuX3NlbmRSZXF1ZXN0KHJlcSwgbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShyZXMuZ2V0U3RhdHVzKCksIDIwMCkpIHtcbiAgICAgICAgICBfdGhpczYuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIGNyZWF0aW5nIHVwbG9hZFwiKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NhdGlvbiA9IHJlcy5nZXRIZWFkZXIoXCJMb2NhdGlvblwiKTtcblxuICAgICAgICBpZiAobG9jYXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgXCJ0dXM6IGludmFsaWQgb3IgbWlzc2luZyBMb2NhdGlvbiBoZWFkZXJcIik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczYudXJsID0gcmVzb2x2ZVVybChfdGhpczYub3B0aW9ucy5lbmRwb2ludCwgbG9jYXRpb24pO1xuICAgICAgICAoMCwgX2xvZ2dlci5sb2cpKFwiQ3JlYXRlZCB1cGxvYWQgYXQgXCIuY29uY2F0KF90aGlzNi51cmwpKTtcblxuICAgICAgICBpZiAodHlwZW9mIF90aGlzNi5vcHRpb25zLl9vblVwbG9hZFVybEF2YWlsYWJsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgX3RoaXM2Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM2Ll9zaXplID09PSAwKSB7XG4gICAgICAgICAgLy8gTm90aGluZyB0byB1cGxvYWQgYW5kIGZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkXG4gICAgICAgICAgX3RoaXM2Ll9lbWl0U3VjY2VzcygpO1xuXG4gICAgICAgICAgX3RoaXM2Ll9zb3VyY2UuY2xvc2UoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNi5fc2F2ZVVwbG9hZEluVXJsU3RvcmFnZSgpO1xuXG4gICAgICAgIGlmIChfdGhpczYub3B0aW9ucy51cGxvYWREYXRhRHVyaW5nQ3JlYXRpb24pIHtcbiAgICAgICAgICBfdGhpczYuX2hhbmRsZVVwbG9hZFJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczYuX29mZnNldCA9IDA7XG5cbiAgICAgICAgICBfdGhpczYuX3BlcmZvcm1VcGxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNi5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsIFwidHVzOiBmYWlsZWQgdG8gY3JlYXRlIHVwbG9hZFwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qXG4gICAgICogVHJ5IHRvIHJlc3VtZSBhbiBleGlzdGluZyB1cGxvYWQuIEZpcnN0IGEgSEVBRCByZXF1ZXN0IHdpbGwgYmUgc2VudFxuICAgICAqIHRvIHJldHJpZXZlIHRoZSBvZmZzZXQuIElmIHRoZSByZXF1ZXN0IGZhaWxzIGEgbmV3IHVwbG9hZCB3aWxsIGJlXG4gICAgICogY3JlYXRlZC4gSW4gdGhlIGNhc2Ugb2YgYSBzdWNjZXNzZnVsIHJlc3BvbnNlIHRoZSBmaWxlIHdpbGwgYmUgdXBsb2FkZWQuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9yZXN1bWVVcGxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3Jlc3VtZVVwbG9hZCgpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICB2YXIgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJIRUFEXCIsIHRoaXMudXJsKTtcblxuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLl9zZW5kUmVxdWVzdChyZXEsIG51bGwpO1xuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgc3RhdHVzID0gcmVzLmdldFN0YXR1cygpO1xuXG4gICAgICAgIGlmICghaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDIwMCkpIHtcbiAgICAgICAgICBpZiAoaW5TdGF0dXNDYXRlZ29yeShzdGF0dXMsIDQwMCkpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzdG9yZWQgZmluZ2VycHJpbnQgYW5kIGNvcnJlc3BvbmRpbmcgZW5kcG9pbnQsXG4gICAgICAgICAgICAvLyBvbiBjbGllbnQgZXJyb3JzIHNpbmNlIHRoZSBmaWxlIGNhbiBub3QgYmUgZm91bmRcbiAgICAgICAgICAgIF90aGlzNy5fcmVtb3ZlRnJvbVVybFN0b3JhZ2UoKTtcbiAgICAgICAgICB9IC8vIElmIHRoZSB1cGxvYWQgaXMgbG9ja2VkIChpbmRpY2F0ZWQgYnkgdGhlIDQyMyBMb2NrZWQgc3RhdHVzIGNvZGUpLCB3ZVxuICAgICAgICAgIC8vIGVtaXQgYW4gZXJyb3IgaW5zdGVhZCBvZiBkaXJlY3RseSBzdGFydGluZyBhIG5ldyB1cGxvYWQuIFRoaXMgd2F5IHRoZVxuICAgICAgICAgIC8vIHJldHJ5IGxvZ2ljIGNhbiBjYXRjaCB0aGUgZXJyb3IgYW5kIHdpbGwgcmV0cnkgdGhlIHVwbG9hZC4gQW4gdXBsb2FkXG4gICAgICAgICAgLy8gaXMgdXN1YWxseSBsb2NrZWQgZm9yIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUgYW5kIHdpbGwgYmUgYXZhaWxhYmxlXG4gICAgICAgICAgLy8gYWZ0ZXJ3YXJkcy5cblxuXG4gICAgICAgICAgaWYgKHN0YXR1cyA9PT0gNDIzKSB7XG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1cGxvYWQgaXMgY3VycmVudGx5IGxvY2tlZDsgcmV0cnkgbGF0ZXJcIik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIV90aGlzNy5vcHRpb25zLmVuZHBvaW50KSB7XG4gICAgICAgICAgICAvLyBEb24ndCBhdHRlbXB0IHRvIGNyZWF0ZSBhIG5ldyB1cGxvYWQgaWYgbm8gZW5kcG9pbnQgaXMgcHJvdmlkZWQuXG4gICAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiB1bmFibGUgdG8gcmVzdW1lIHVwbG9hZCAobmV3IHVwbG9hZCBjYW5ub3QgYmUgY3JlYXRlZCB3aXRob3V0IGFuIGVuZHBvaW50KVwiKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gLy8gVHJ5IHRvIGNyZWF0ZSBhIG5ldyB1cGxvYWRcblxuXG4gICAgICAgICAgX3RoaXM3LnVybCA9IG51bGw7XG5cbiAgICAgICAgICBfdGhpczcuX2NyZWF0ZVVwbG9hZCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIpLCAxMCk7XG5cbiAgICAgICAgaWYgKGlzTmFOKG9mZnNldCkpIHtcbiAgICAgICAgICBfdGhpczcuX2VtaXRIdHRwRXJyb3IocmVxLCByZXMsIFwidHVzOiBpbnZhbGlkIG9yIG1pc3Npbmcgb2Zmc2V0IHZhbHVlXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHBhcnNlSW50KHJlcy5nZXRIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIpLCAxMCk7XG5cbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkgJiYgIV90aGlzNy5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkKSB7XG4gICAgICAgICAgX3RoaXM3Ll9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogaW52YWxpZCBvciBtaXNzaW5nIGxlbmd0aCB2YWx1ZVwiKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM3Lm9wdGlvbnMuX29uVXBsb2FkVXJsQXZhaWxhYmxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBfdGhpczcub3B0aW9ucy5fb25VcGxvYWRVcmxBdmFpbGFibGUoKTtcbiAgICAgICAgfSAvLyBVcGxvYWQgaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQgYW5kIHdlIGRvIG5vdCBuZWVkIHRvIHNlbmQgYWRkaXRpb25hbFxuICAgICAgICAvLyBkYXRhIHRvIHRoZSBzZXJ2ZXJcblxuXG4gICAgICAgIGlmIChvZmZzZXQgPT09IGxlbmd0aCkge1xuICAgICAgICAgIF90aGlzNy5fZW1pdFByb2dyZXNzKGxlbmd0aCwgbGVuZ3RoKTtcblxuICAgICAgICAgIF90aGlzNy5fZW1pdFN1Y2Nlc3MoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNy5fb2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgICAgIF90aGlzNy5fcGVyZm9ybVVwbG9hZCgpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzNy5fZW1pdEh0dHBFcnJvcihyZXEsIG51bGwsIFwidHVzOiBmYWlsZWQgdG8gcmVzdW1lIHVwbG9hZFwiLCBlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHVwbG9hZGluZyB0aGUgZmlsZSB1c2luZyBQQVRDSCByZXF1ZXN0cy4gVGhlIGZpbGUgd2lsbCBiZSBkaXZpZGVkXG4gICAgICogaW50byBjaHVua3MgYXMgc3BlY2lmaWVkIGluIHRoZSBjaHVua1NpemUgb3B0aW9uLiBEdXJpbmcgdGhlIHVwbG9hZFxuICAgICAqIHRoZSBvblByb2dyZXNzIGV2ZW50IGhhbmRsZXIgbWF5IGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9wZXJmb3JtVXBsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9wZXJmb3JtVXBsb2FkKCkge1xuICAgICAgdmFyIF90aGlzOCA9IHRoaXM7IC8vIElmIHRoZSB1cGxvYWQgaGFzIGJlZW4gYWJvcnRlZCwgd2Ugd2lsbCBub3Qgc2VuZCB0aGUgbmV4dCBQQVRDSCByZXF1ZXN0LlxuICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgaWYgdGhlIGFib3J0IG1ldGhvZCB3YXMgY2FsbGVkIGR1cmluZyBhIGNhbGxiYWNrLCBzdWNoXG4gICAgICAvLyBhcyBvbkNodW5rQ29tcGxldGUgb3Igb25Qcm9ncmVzcy5cblxuXG4gICAgICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciByZXE7IC8vIFNvbWUgYnJvd3NlciBhbmQgc2VydmVycyBtYXkgbm90IHN1cHBvcnQgdGhlIFBBVENIIG1ldGhvZC4gRm9yIHRob3NlXG4gICAgICAvLyBjYXNlcywgeW91IGNhbiB0ZWxsIHR1cy1qcy1jbGllbnQgdG8gdXNlIGEgUE9TVCByZXF1ZXN0IHdpdGggdGhlXG4gICAgICAvLyBYLUhUVFAtTWV0aG9kLU92ZXJyaWRlIGhlYWRlciBmb3Igc2ltdWxhdGluZyBhIFBBVENIIHJlcXVlc3QuXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcnJpZGVQYXRjaE1ldGhvZCkge1xuICAgICAgICByZXEgPSB0aGlzLl9vcGVuUmVxdWVzdChcIlBPU1RcIiwgdGhpcy51cmwpO1xuICAgICAgICByZXEuc2V0SGVhZGVyKFwiWC1IVFRQLU1ldGhvZC1PdmVycmlkZVwiLCBcIlBBVENIXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxID0gdGhpcy5fb3BlblJlcXVlc3QoXCJQQVRDSFwiLCB0aGlzLnVybCk7XG4gICAgICB9XG5cbiAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtT2Zmc2V0XCIsIHRoaXMuX29mZnNldCk7XG5cbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5fYWRkQ2h1bmtUb1JlcXVlc3QocmVxKTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFpblN0YXR1c0NhdGVnb3J5KHJlcy5nZXRTdGF0dXMoKSwgMjAwKSkge1xuICAgICAgICAgIF90aGlzOC5fZW1pdEh0dHBFcnJvcihyZXEsIHJlcywgXCJ0dXM6IHVuZXhwZWN0ZWQgcmVzcG9uc2Ugd2hpbGUgdXBsb2FkaW5nIGNodW5rXCIpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM4Ll9oYW5kbGVVcGxvYWRSZXNwb25zZShyZXEsIHJlcyk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgLy8gRG9uJ3QgZW1pdCBhbiBlcnJvciBpZiB0aGUgdXBsb2FkIHdhcyBhYm9ydGVkIG1hbnVhbGx5XG4gICAgICAgIGlmIChfdGhpczguX2Fib3J0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczguX2VtaXRIdHRwRXJyb3IocmVxLCBudWxsLCBcInR1czogZmFpbGVkIHRvIHVwbG9hZCBjaHVuayBhdCBvZmZzZXQgXCIgKyBfdGhpczguX29mZnNldCwgZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfYWRkQ2h1bmt0b1JlcXVlc3QgcmVhZHMgYSBjaHVuayBmcm9tIHRoZSBzb3VyY2UgYW5kIHNlbmRzIGl0IHVzaW5nIHRoZVxuICAgICAqIHN1cHBsaWVkIHJlcXVlc3Qgb2JqZWN0LiBJdCB3aWxsIG5vdCBoYW5kbGUgdGhlIHJlc3BvbnNlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkQ2h1bmtUb1JlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZENodW5rVG9SZXF1ZXN0KHJlcSkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIHZhciBzdGFydCA9IHRoaXMuX29mZnNldDtcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9vZmZzZXQgKyB0aGlzLm9wdGlvbnMuY2h1bmtTaXplO1xuICAgICAgcmVxLnNldFByb2dyZXNzSGFuZGxlcihmdW5jdGlvbiAoYnl0ZXNTZW50KSB7XG4gICAgICAgIF90aGlzOS5fZW1pdFByb2dyZXNzKHN0YXJ0ICsgYnl0ZXNTZW50LCBfdGhpczkuX3NpemUpO1xuICAgICAgfSk7XG4gICAgICByZXEuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vb2Zmc2V0K29jdGV0LXN0cmVhbVwiKTsgLy8gVGhlIHNwZWNpZmllZCBjaHVua1NpemUgbWF5IGJlIEluZmluaXR5IG9yIHRoZSBjYWxjbHVhdGVkIGVuZCBwb3NpdGlvblxuICAgICAgLy8gbWF5IGV4Y2VlZCB0aGUgZmlsZSdzIHNpemUuIEluIGJvdGggY2FzZXMsIHdlIGxpbWl0IHRoZSBlbmQgcG9zaXRpb24gdG9cbiAgICAgIC8vIHRoZSBpbnB1dCdzIHRvdGFsIHNpemUgZm9yIHNpbXBsZXIgY2FsY3VsYXRpb25zIGFuZCBjb3JyZWN0bmVzcy5cblxuICAgICAgaWYgKChlbmQgPT09IEluZmluaXR5IHx8IGVuZCA+IHRoaXMuX3NpemUpICYmICF0aGlzLm9wdGlvbnMudXBsb2FkTGVuZ3RoRGVmZXJyZWQpIHtcbiAgICAgICAgZW5kID0gdGhpcy5fc2l6ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5zbGljZShzdGFydCwgZW5kKS50aGVuKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmMi52YWx1ZSxcbiAgICAgICAgICAgIGRvbmUgPSBfcmVmMi5kb25lOyAvLyBJZiB0aGUgdXBsb2FkIGxlbmd0aCBpcyBkZWZlcnJlZCwgdGhlIHVwbG9hZCBzaXplIHdhcyBub3Qgc3BlY2lmaWVkIGR1cmluZ1xuICAgICAgICAvLyB1cGxvYWQgY3JlYXRpb24uIFNvLCBpZiB0aGUgZmlsZSByZWFkZXIgaXMgZG9uZSByZWFkaW5nLCB3ZSBrbm93IHRoZSB0b3RhbFxuICAgICAgICAvLyB1cGxvYWQgc2l6ZSBhbmQgY2FuIHRlbGwgdGhlIHR1cyBzZXJ2ZXIuXG5cbiAgICAgICAgaWYgKF90aGlzOS5vcHRpb25zLnVwbG9hZExlbmd0aERlZmVycmVkICYmIGRvbmUpIHtcbiAgICAgICAgICBfdGhpczkuX3NpemUgPSBfdGhpczkuX29mZnNldCArICh2YWx1ZSAmJiB2YWx1ZS5zaXplID8gdmFsdWUuc2l6ZSA6IDApO1xuICAgICAgICAgIHJlcS5zZXRIZWFkZXIoXCJVcGxvYWQtTGVuZ3RoXCIsIF90aGlzOS5fc2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM5Ll9zZW5kUmVxdWVzdChyZXEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzOS5fZW1pdFByb2dyZXNzKF90aGlzOS5fb2Zmc2V0LCBfdGhpczkuX3NpemUpO1xuXG4gICAgICAgICAgcmV0dXJuIF90aGlzOS5fc2VuZFJlcXVlc3QocmVxLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UgaXMgdXNlZCBieSByZXF1ZXN0cyB0aGF0IGhhdmVuIGJlZW4gc2VudCB1c2luZyBfYWRkQ2h1bmtUb1JlcXVlc3RcbiAgICAgKiBhbmQgYWxyZWFkeSBoYXZlIHJlY2VpdmVkIGEgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9oYW5kbGVVcGxvYWRSZXNwb25zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlVXBsb2FkUmVzcG9uc2UocmVxLCByZXMpIHtcbiAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChyZXMuZ2V0SGVhZGVyKFwiVXBsb2FkLU9mZnNldFwiKSwgMTApO1xuXG4gICAgICBpZiAoaXNOYU4ob2Zmc2V0KSkge1xuICAgICAgICB0aGlzLl9lbWl0SHR0cEVycm9yKHJlcSwgcmVzLCBcInR1czogaW52YWxpZCBvciBtaXNzaW5nIG9mZnNldCB2YWx1ZVwiKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VtaXRQcm9ncmVzcyhvZmZzZXQsIHRoaXMuX3NpemUpO1xuXG4gICAgICB0aGlzLl9lbWl0Q2h1bmtDb21wbGV0ZShvZmZzZXQgLSB0aGlzLl9vZmZzZXQsIG9mZnNldCwgdGhpcy5fc2l6ZSk7XG5cbiAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcblxuICAgICAgaWYgKG9mZnNldCA9PSB0aGlzLl9zaXplKSB7XG4gICAgICAgIC8vIFlheSwgZmluYWxseSBkb25lIDopXG4gICAgICAgIHRoaXMuX2VtaXRTdWNjZXNzKCk7XG5cbiAgICAgICAgdGhpcy5fc291cmNlLmNsb3NlKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wZXJmb3JtVXBsb2FkKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBIVFRQIHJlcXVlc3Qgb2JqZWN0IHdpdGggdGhlIGdpdmVuIG1ldGhvZCBhbmQgVVJMLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfb3BlblJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX29wZW5SZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gICAgICB2YXIgcmVxID0gb3BlblJlcXVlc3QobWV0aG9kLCB1cmwsIHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLl9yZXEgPSByZXE7XG4gICAgICByZXR1cm4gcmVxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGVudHJ5IGluIHRoZSBVUkwgc3RvcmFnZSwgaWYgaXQgaGFzIGJlZW4gc2F2ZWQgYmVmb3JlLlxuICAgICAqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVtb3ZlRnJvbVVybFN0b3JhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbW92ZUZyb21VcmxTdG9yYWdlKCkge1xuICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMuX3VybFN0b3JhZ2VLZXkpIHJldHVybjtcblxuICAgICAgdGhpcy5fdXJsU3RvcmFnZS5yZW1vdmVVcGxvYWQodGhpcy5fdXJsU3RvcmFnZUtleSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIF90aGlzMTAuX2VtaXRFcnJvcihlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3VybFN0b3JhZ2VLZXkgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIHVwbG9hZCBVUkwgdG8gdGhlIFVSTCBzdG9yYWdlLCBpZiBwb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3NhdmVVcGxvYWRJblVybFN0b3JhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3NhdmVVcGxvYWRJblVybFN0b3JhZ2UoKSB7XG4gICAgICB2YXIgX3RoaXMxMSA9IHRoaXM7IC8vIE9ubHkgaWYgYSBmaW5nZXJwcmludCB3YXMgY2FsY3VsYXRlZCBmb3IgdGhlIGlucHV0IChpLmUuIG5vdCBhIHN0cmVhbSksIHdlIGNhbiBzdG9yZSB0aGUgdXBsb2FkIFVSTC5cblxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zdG9yZUZpbmdlcnByaW50Rm9yUmVzdW1pbmcgfHwgIXRoaXMuX2ZpbmdlcnByaW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0b3JlZFVwbG9hZCA9IHtcbiAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcbiAgICAgICAgbWV0YWRhdGE6IHRoaXMub3B0aW9ucy5tZXRhZGF0YSxcbiAgICAgICAgY3JlYXRpb25UaW1lOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKClcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLl9wYXJhbGxlbFVwbG9hZHMpIHtcbiAgICAgICAgLy8gU2F2ZSBtdWx0aXBsZSBVUkxzIGlmIHRoZSBwYXJhbGxlbFVwbG9hZHMgb3B0aW9uIGlzIHVzZWQgLi4uXG4gICAgICAgIHN0b3JlZFVwbG9hZC5wYXJhbGxlbFVwbG9hZFVybHMgPSB0aGlzLl9wYXJhbGxlbFVwbG9hZFVybHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAuLi4gb3RoZXJ3aXNlIHdlIGp1c3Qgc2F2ZSB0aGUgb25lIGF2YWlsYWJsZSBVUkwuXG4gICAgICAgIHN0b3JlZFVwbG9hZC51cGxvYWRVcmwgPSB0aGlzLnVybDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdXJsU3RvcmFnZS5hZGRVcGxvYWQodGhpcy5fZmluZ2VycHJpbnQsIHN0b3JlZFVwbG9hZCkudGhlbihmdW5jdGlvbiAodXJsU3RvcmFnZUtleSkge1xuICAgICAgICByZXR1cm4gX3RoaXMxMS5fdXJsU3RvcmFnZUtleSA9IHVybFN0b3JhZ2VLZXk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgX3RoaXMxMS5fZW1pdEVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2VuZCBhIHJlcXVlc3Qgd2l0aCB0aGUgcHJvdmlkZWQgYm9keSB3aGlsZSBpbnZva2luZyB0aGUgb25CZWZvcmVSZXF1ZXN0XG4gICAgICogYW5kIG9uQWZ0ZXJSZXNwb25zZSBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zZW5kUmVxdWVzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc2VuZFJlcXVlc3QocmVxKSB7XG4gICAgICB2YXIgX3RoaXMxMiA9IHRoaXM7XG5cbiAgICAgIHZhciBib2R5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbkJlZm9yZVJlcXVlc3QgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzLm9wdGlvbnMub25CZWZvcmVSZXF1ZXN0KHJlcSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXEuc2VuZChib2R5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBfdGhpczEyLm9wdGlvbnMub25BZnRlclJlc3BvbnNlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBfdGhpczEyLm9wdGlvbnMub25BZnRlclJlc3BvbnNlKHJlcSwgcmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dLCBbe1xuICAgIGtleTogXCJ0ZXJtaW5hdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGVybWluYXRlKHVybCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgdmFyIGNiID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjYiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR1czogdGhlIHRlcm1pbmF0ZSBmdW5jdGlvbiBkb2VzIG5vdCBhY2NlcHQgYSBjYWxsYmFjayBzaW5jZSB2MiBhbnltb3JlOyBwbGVhc2UgdXNlIHRoZSByZXR1cm5lZCBQcm9taXNlIGluc3RlYWRcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXEgPSBvcGVuUmVxdWVzdChcIkRFTEVURVwiLCB1cmwsIG9wdGlvbnMpO1xuICAgICAgdmFyIHByb21pc2UgPSByZXEuc2VuZCgpO1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIEEgMjA0IHJlc3BvbnNlIGluZGljYXRlcyBhIHN1Y2Nlc3NmdWxsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcy5nZXRTdGF0dXMoKSA9PT0gMjA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IF9lcnJvci5kZWZhdWx0KFwidHVzOiB1bmV4cGVjdGVkIHJlc3BvbnNlIHdoaWxlIHRlcm1pbmF0aW5nIHVwbG9hZFwiLCBudWxsLCByZXEsIHJlcyk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgX2Vycm9yLmRlZmF1bHQpKSB7XG4gICAgICAgICAgZXJyID0gbmV3IF9lcnJvci5kZWZhdWx0KFwidHVzOiBmYWlsZWQgdG8gdGVybWluYXRlIHVwbG9hZFwiLCBlcnIsIHJlcSwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNob3VsZFJldHJ5KGVyciwgMCwgb3B0aW9ucykpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gLy8gSW5zdGVhZCBvZiBrZWVwaW5nIHRyYWNrIG9mIHRoZSByZXRyeSBhdHRlbXB0cywgd2UgcmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gdGhlIGRlbGF5c1xuICAgICAgICAvLyBhcnJheS4gSWYgdGhlIGFycmF5IGlzIGVtcHR5LCBhbGwgcmV0cnkgYXR0ZW1wdHMgYXJlIHVzZWQgdXAgYW5kIHdlIHdpbGwgYnViYmxlIHVwIHRoZSBlcnJvci5cbiAgICAgICAgLy8gV2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgdGVybWluYXRlIGZ1bmN0aW9uIHdpbGwgcmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgcmV0cnlEZWxheXMgYXJyYXkuXG5cblxuICAgICAgICB2YXIgZGVsYXkgPSBvcHRpb25zLnJldHJ5RGVsYXlzWzBdO1xuICAgICAgICB2YXIgcmVtYWluaW5nRGVsYXlzID0gb3B0aW9ucy5yZXRyeURlbGF5cy5zbGljZSgxKTtcblxuICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IF9vYmplY3RTcHJlYWQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICByZXRyeURlbGF5czogcmVtYWluaW5nRGVsYXlzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIEJhc2VVcGxvYWQudGVybWluYXRlKHVybCwgbmV3T3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhc2VVcGxvYWQ7XG59KCk7XG5cbmZ1bmN0aW9uIGVuY29kZU1ldGFkYXRhKG1ldGFkYXRhKSB7XG4gIHZhciBlbmNvZGVkID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG1ldGFkYXRhKSB7XG4gICAgZW5jb2RlZC5wdXNoKGtleSArIFwiIFwiICsgX2pzQmFzZS5CYXNlNjQuZW5jb2RlKG1ldGFkYXRhW2tleV0pKTtcbiAgfVxuXG4gIHJldHVybiBlbmNvZGVkLmpvaW4oXCIsXCIpO1xufVxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHN0YXR1cyBpcyBpbiB0aGUgcmFuZ2Ugb2YgdGhlIGV4cGVjdGVkIGNhdGVnb3J5LlxuICogRm9yIGV4YW1wbGUsIG9ubHkgYSBzdGF0dXMgYmV0d2VlbiAyMDAgYW5kIDI5OSB3aWxsIHNhdGlzZnkgdGhlIGNhdGVnb3J5IDIwMC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCBjYXRlZ29yeSkge1xuICByZXR1cm4gc3RhdHVzID49IGNhdGVnb3J5ICYmIHN0YXR1cyA8IGNhdGVnb3J5ICsgMTAwO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgSFRUUCByZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCBtZXRob2QgYW5kIFVSTC5cbiAqIFRoZSBuZWNlc3NhcnkgaGVhZGVycyB0aGF0IGFyZSBpbmNsdWRlZCBpbiBldmVyeSByZXF1ZXN0XG4gKiB3aWxsIGJlIGFkZGVkLCBpbmNsdWRpbmcgdGhlIHJlcXVlc3QgSUQuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBvcGVuUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucykge1xuICB2YXIgcmVxID0gb3B0aW9ucy5odHRwU3RhY2suY3JlYXRlUmVxdWVzdChtZXRob2QsIHVybCk7XG4gIHJlcS5zZXRIZWFkZXIoXCJUdXMtUmVzdW1hYmxlXCIsIFwiMS4wLjBcIik7XG4gIHZhciBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gIGZvciAodmFyIG5hbWUgaW4gaGVhZGVycykge1xuICAgIHJlcS5zZXRIZWFkZXIobmFtZSwgaGVhZGVyc1tuYW1lXSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5hZGRSZXF1ZXN0SWQpIHtcbiAgICB2YXIgcmVxdWVzdElkID0gKDAsIF91dWlkLmRlZmF1bHQpKCk7XG4gICAgcmVxLnNldEhlYWRlcihcIlgtUmVxdWVzdC1JRFwiLCByZXF1ZXN0SWQpO1xuICB9XG5cbiAgcmV0dXJuIHJlcTtcbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGJyb3dzZXIgcnVubmluZyB0aGlzIGNvZGUgaGFzIGludGVybmV0IGFjY2Vzcy5cbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhbHdheXMgcmV0dXJuIHRydWUgaW4gdGhlIG5vZGUuanMgZW52aXJvbm1lbnRcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzT25saW5lKCkge1xuICB2YXIgb25saW5lID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcIm5hdmlnYXRvclwiIGluIHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZSA9PT0gZmFsc2UpIHtcbiAgICBvbmxpbmUgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBvbmxpbmU7XG59XG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCBpdCBpcyBvayB0byByZXRyeSBhIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIHJldHVybmVkIGZyb20gdGhlIGxhc3QgcmVxdWVzdFxuICogQHBhcmFtIHtudW1iZXJ9IHJldHJ5QXR0ZW1wdCB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSByZXF1ZXN0IGhhcyBhbHJlYWR5IGJlZW4gcmV0cmllZFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgdHVzIFVwbG9hZCBvcHRpb25zXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzaG91bGRSZXRyeShlcnIsIHJldHJ5QXR0ZW1wdCwgb3B0aW9ucykge1xuICAvLyBXZSBvbmx5IGF0dGVtcHQgYSByZXRyeSBpZlxuICAvLyAtIHJldHJ5RGVsYXlzIG9wdGlvbiBpcyBzZXRcbiAgLy8gLSB3ZSBkaWRuJ3QgZXhjZWVkIHRoZSBtYXhpdW0gbnVtYmVyIG9mIHJldHJpZXMsIHlldCwgYW5kXG4gIC8vIC0gdGhpcyBlcnJvciB3YXMgY2F1c2VkIGJ5IGEgcmVxdWVzdCBvciBpdCdzIHJlc3BvbnNlIGFuZFxuICAvLyAtIHRoZSBlcnJvciBpcyBzZXJ2ZXIgZXJyb3IgKGkuZS4gbm8gYSBzdGF0dXMgNHh4IG9yIGEgNDA5IG9yIDQyMykgYW5kXG4gIC8vIC0gdGhlIGJyb3dzZXIgZG9lcyBub3QgaW5kaWNhdGUgdGhhdCB3ZSBhcmUgb2ZmbGluZVxuICB2YXIgc3RhdHVzID0gZXJyLm9yaWdpbmFsUmVzcG9uc2UgPyBlcnIub3JpZ2luYWxSZXNwb25zZS5nZXRTdGF0dXMoKSA6IDA7XG4gIHZhciBpc1NlcnZlckVycm9yID0gIWluU3RhdHVzQ2F0ZWdvcnkoc3RhdHVzLCA0MDApIHx8IHN0YXR1cyA9PT0gNDA5IHx8IHN0YXR1cyA9PT0gNDIzO1xuICByZXR1cm4gb3B0aW9ucy5yZXRyeURlbGF5cyAhPSBudWxsICYmIHJldHJ5QXR0ZW1wdCA8IG9wdGlvbnMucmV0cnlEZWxheXMubGVuZ3RoICYmIGVyci5vcmlnaW5hbFJlcXVlc3QgIT0gbnVsbCAmJiBpc1NlcnZlckVycm9yICYmIGlzT25saW5lKCk7XG59XG4vKipcbiAqIFJlc29sdmUgYSByZWxhdGl2ZSBsaW5rIGdpdmVuIHRoZSBvcmlnaW4gYXMgc291cmNlLiBGb3IgZXhhbXBsZSxcbiAqIGlmIGEgSFRUUCByZXF1ZXN0IHRvIGh0dHA6Ly9leGFtcGxlLmNvbS9maWxlcy8gcmV0dXJucyBhIExvY2F0aW9uXG4gKiBoZWFkZXIgd2l0aCB0aGUgdmFsdWUgL3VwbG9hZC9hYmMsIHRoZSByZXNvbHZlZCBVUkwgd2lsbCBiZTpcbiAqIGh0dHA6Ly9leGFtcGxlLmNvbS91cGxvYWQvYWJjXG4gKi9cblxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKG9yaWdpbiwgbGluaykge1xuICByZXR1cm4gbmV3IF91cmxQYXJzZS5kZWZhdWx0KGxpbmssIG9yaWdpbikudG9TdHJpbmcoKTtcbn1cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBzdGFydCBhbmQgZW5kIHBvc2l0aW9ucyBmb3IgdGhlIHBhcnRzIGlmIGFuIHVwbG9hZFxuICogaXMgc3BsaXQgaW50byBtdWx0aXBsZSBwYXJhbGxlbCByZXF1ZXN0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxTaXplIFRoZSBieXRlIHNpemUgb2YgdGhlIHVwbG9hZCwgd2hpY2ggd2lsbCBiZSBzcGxpdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJ0Q291bnQgVGhlIG51bWJlciBpbiBob3cgbWFueSBwYXJ0cyB0aGUgdXBsb2FkIHdpbGwgYmUgc3BsaXQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwcmV2aW91c1VybHMgVGhlIHVwbG9hZCBVUkxzIGZvciBwcmV2aW91cyBwYXJ0cy5cbiAqIEByZXR1cm4ge29iamVjdFtdfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzcGxpdFNpemVJbnRvUGFydHModG90YWxTaXplLCBwYXJ0Q291bnQsIHByZXZpb3VzVXJscykge1xuICB2YXIgcGFydFNpemUgPSBNYXRoLmZsb29yKHRvdGFsU2l6ZSAvIHBhcnRDb3VudCk7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydENvdW50OyBpKyspIHtcbiAgICBwYXJ0cy5wdXNoKHtcbiAgICAgIHN0YXJ0OiBwYXJ0U2l6ZSAqIGksXG4gICAgICBlbmQ6IHBhcnRTaXplICogKGkgKyAxKVxuICAgIH0pO1xuICB9XG5cbiAgcGFydHNbcGFydENvdW50IC0gMV0uZW5kID0gdG90YWxTaXplOyAvLyBBdHRhY2ggVVJMcyBmcm9tIHByZXZpb3VzIHVwbG9hZHMsIGlmIGF2YWlsYWJsZS5cblxuICBpZiAocHJldmlvdXNVcmxzKSB7XG4gICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbiAocGFydCwgaW5kZXgpIHtcbiAgICAgIHBhcnQudXBsb2FkVXJsID0gcHJldmlvdXNVcmxzW2luZGV4XSB8fCBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG5CYXNlVXBsb2FkLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG52YXIgX2RlZmF1bHQgPSBCYXNlVXBsb2FkO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB1dWlkO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgVVVJRCB2NCBiYXNlZCBvbiByYW5kb20gbnVtYmVycy4gV2UgaW50ZW50aW9hbmxseSB1c2UgdGhlIGxlc3NcbiAqIHNlY3VyZSBNYXRoLnJhbmRvbSBmdW5jdGlvbiBoZXJlIHNpbmNlIHRoZSBtb3JlIHNlY3VyZSBjcnlwdG8uZ2V0UmFuZG9tTnVtYmVyc1xuICogaXMgbm90IGF2YWlsYWJsZSBvbiBhbGwgcGxhdGZvcm1zLlxuICogVGhpcyBpcyBub3QgYSBwcm9ibGVtIGZvciB1cyBzaW5jZSB3ZSB1c2UgdGhlIFVVSUQgb25seSBmb3IgZ2VuZXJhdGluZyBhXG4gKiByZXF1ZXN0IElELCBzbyB3ZSBjYW4gY29ycmVsYXRlIHNlcnZlciBsb2dzIHRvIGNsaWVudCBlcnJvcnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyB0YWtlbiBmcm9tIGZvbGxvd2luZyBzaXRlOlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2NyZWF0ZS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGdlbmVyYXRlIFVVSURcbiAqL1xuZnVuY3Rpb24gdXVpZCgpIHtcbiAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVpcmVkID0gcmVxdWlyZSgncmVxdWlyZXMtcG9ydCcpXG4gICwgcXMgPSByZXF1aXJlKCdxdWVyeXN0cmluZ2lmeScpXG4gICwgc2xhc2hlcyA9IC9eW0EtWmEtel1bQS1aYS16MC05Ky0uXSo6W1xcXFwvXSsvXG4gICwgcHJvdG9jb2xyZSA9IC9eKFthLXpdW2EtejAtOS4rLV0qOik/KFtcXFxcL117MSx9KT8oW1xcU1xcc10qKS9pXG4gICwgd2hpdGVzcGFjZSA9ICdbXFxcXHgwOVxcXFx4MEFcXFxceDBCXFxcXHgwQ1xcXFx4MERcXFxceDIwXFxcXHhBMFxcXFx1MTY4MFxcXFx1MTgwRVxcXFx1MjAwMFxcXFx1MjAwMVxcXFx1MjAwMlxcXFx1MjAwM1xcXFx1MjAwNFxcXFx1MjAwNVxcXFx1MjAwNlxcXFx1MjAwN1xcXFx1MjAwOFxcXFx1MjAwOVxcXFx1MjAwQVxcXFx1MjAyRlxcXFx1MjA1RlxcXFx1MzAwMFxcXFx1MjAyOFxcXFx1MjAyOVxcXFx1RkVGRl0nXG4gICwgbGVmdCA9IG5ldyBSZWdFeHAoJ14nKyB3aGl0ZXNwYWNlICsnKycpO1xuXG4vKipcbiAqIFRyaW0gYSBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBTdHJpbmcgdG8gdHJpbS5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XG4gIHJldHVybiAoc3RyID8gc3RyIDogJycpLnRvU3RyaW5nKCkucmVwbGFjZShsZWZ0LCAnJyk7XG59XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBwYXJzZSBydWxlcyBmb3IgdGhlIFVSTCBwYXJzZXIsIGl0IGluZm9ybXMgdGhlIHBhcnNlclxuICogYWJvdXQ6XG4gKlxuICogMC4gVGhlIGNoYXIgaXQgTmVlZHMgdG8gcGFyc2UsIGlmIGl0J3MgYSBzdHJpbmcgaXQgc2hvdWxkIGJlIGRvbmUgdXNpbmdcbiAqICAgIGluZGV4T2YsIFJlZ0V4cCB1c2luZyBleGVjIGFuZCBOYU4gbWVhbnMgc2V0IGFzIGN1cnJlbnQgdmFsdWUuXG4gKiAxLiBUaGUgcHJvcGVydHkgd2Ugc2hvdWxkIHNldCB3aGVuIHBhcnNpbmcgdGhpcyB2YWx1ZS5cbiAqIDIuIEluZGljYXRpb24gaWYgaXQncyBiYWNrd2FyZHMgb3IgZm9yd2FyZCBwYXJzaW5nLCB3aGVuIHNldCBhcyBudW1iZXIgaXQnc1xuICogICAgdGhlIHZhbHVlIG9mIGV4dHJhIGNoYXJzIHRoYXQgc2hvdWxkIGJlIHNwbGl0IG9mZi5cbiAqIDMuIEluaGVyaXQgZnJvbSBsb2NhdGlvbiBpZiBub24gZXhpc3RpbmcgaW4gdGhlIHBhcnNlci5cbiAqIDQuIGB0b0xvd2VyQ2FzZWAgdGhlIHJlc3VsdGluZyB2YWx1ZS5cbiAqL1xudmFyIHJ1bGVzID0gW1xuICBbJyMnLCAnaGFzaCddLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgYmFjay5cbiAgWyc/JywgJ3F1ZXJ5J10sICAgICAgICAgICAgICAgICAgICAgICAvLyBFeHRyYWN0IGZyb20gdGhlIGJhY2suXG4gIGZ1bmN0aW9uIHNhbml0aXplKGFkZHJlc3MpIHsgICAgICAgICAgLy8gU2FuaXRpemUgd2hhdCBpcyBsZWZ0IG9mIHRoZSBhZGRyZXNzXG4gICAgcmV0dXJuIGFkZHJlc3MucmVwbGFjZSgnXFxcXCcsICcvJyk7XG4gIH0sXG4gIFsnLycsICdwYXRobmFtZSddLCAgICAgICAgICAgICAgICAgICAgLy8gRXh0cmFjdCBmcm9tIHRoZSBiYWNrLlxuICBbJ0AnLCAnYXV0aCcsIDFdLCAgICAgICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgZnJvbSB0aGUgZnJvbnQuXG4gIFtOYU4sICdob3N0JywgdW5kZWZpbmVkLCAxLCAxXSwgICAgICAgLy8gU2V0IGxlZnQgb3ZlciB2YWx1ZS5cbiAgWy86KFxcZCspJC8sICdwb3J0JywgdW5kZWZpbmVkLCAxXSwgICAgLy8gUmVnRXhwIHRoZSBiYWNrLlxuICBbTmFOLCAnaG9zdG5hbWUnLCB1bmRlZmluZWQsIDEsIDFdICAgIC8vIFNldCBsZWZ0IG92ZXIuXG5dO1xuXG4vKipcbiAqIFRoZXNlIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBjb3BpZWQgb3IgaW5oZXJpdGVkIGZyb20uIFRoaXMgaXMgb25seSBuZWVkZWRcbiAqIGZvciBhbGwgbm9uIGJsb2IgVVJMJ3MgYXMgYSBibG9iIFVSTCBkb2VzIG5vdCBpbmNsdWRlIGEgaGFzaCwgb25seSB0aGVcbiAqIG9yaWdpbi5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGlnbm9yZSA9IHsgaGFzaDogMSwgcXVlcnk6IDEgfTtcblxuLyoqXG4gKiBUaGUgbG9jYXRpb24gb2JqZWN0IGRpZmZlcnMgd2hlbiB5b3VyIGNvZGUgaXMgbG9hZGVkIHRocm91Z2ggYSBub3JtYWwgcGFnZSxcbiAqIFdvcmtlciBvciB0aHJvdWdoIGEgd29ya2VyIHVzaW5nIGEgYmxvYi4gQW5kIHdpdGggdGhlIGJsb2JibGUgYmVnaW5zIHRoZVxuICogdHJvdWJsZSBhcyB0aGUgbG9jYXRpb24gb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgVVJMIG9mIHRoZSBibG9iLCBub3QgdGhlXG4gKiBsb2NhdGlvbiBvZiB0aGUgcGFnZSB3aGVyZSBvdXIgY29kZSBpcyBsb2FkZWQgaW4uIFRoZSBhY3R1YWwgb3JpZ2luIGlzXG4gKiBlbmNvZGVkIGluIHRoZSBgcGF0aG5hbWVgIHNvIHdlIGNhbiB0aGFua2Z1bGx5IGdlbmVyYXRlIGEgZ29vZCBcImRlZmF1bHRcIlxuICogbG9jYXRpb24gZnJvbSBpdCBzbyB3ZSBjYW4gZ2VuZXJhdGUgcHJvcGVyIHJlbGF0aXZlIFVSTCdzIGFnYWluLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gbG9jIE9wdGlvbmFsIGRlZmF1bHQgbG9jYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gbG9sY2F0aW9uIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gbG9sY2F0aW9uKGxvYykge1xuICB2YXIgZ2xvYmFsVmFyO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gd2luZG93O1xuICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgZ2xvYmFsVmFyID0gZ2xvYmFsO1xuICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIGdsb2JhbFZhciA9IHNlbGY7XG4gIGVsc2UgZ2xvYmFsVmFyID0ge307XG5cbiAgdmFyIGxvY2F0aW9uID0gZ2xvYmFsVmFyLmxvY2F0aW9uIHx8IHt9O1xuICBsb2MgPSBsb2MgfHwgbG9jYXRpb247XG5cbiAgdmFyIGZpbmFsZGVzdGluYXRpb24gPSB7fVxuICAgICwgdHlwZSA9IHR5cGVvZiBsb2NcbiAgICAsIGtleTtcblxuICBpZiAoJ2Jsb2I6JyA9PT0gbG9jLnByb3RvY29sKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwodW5lc2NhcGUobG9jLnBhdGhuYW1lKSwge30pO1xuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlKSB7XG4gICAgZmluYWxkZXN0aW5hdGlvbiA9IG5ldyBVcmwobG9jLCB7fSk7XG4gICAgZm9yIChrZXkgaW4gaWdub3JlKSBkZWxldGUgZmluYWxkZXN0aW5hdGlvbltrZXldO1xuICB9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlKSB7XG4gICAgZm9yIChrZXkgaW4gbG9jKSB7XG4gICAgICBpZiAoa2V5IGluIGlnbm9yZSkgY29udGludWU7XG4gICAgICBmaW5hbGRlc3RpbmF0aW9uW2tleV0gPSBsb2Nba2V5XTtcbiAgICB9XG5cbiAgICBpZiAoZmluYWxkZXN0aW5hdGlvbi5zbGFzaGVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpbmFsZGVzdGluYXRpb24uc2xhc2hlcyA9IHNsYXNoZXMudGVzdChsb2MuaHJlZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZpbmFsZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogQHR5cGVkZWYgUHJvdG9jb2xFeHRyYWN0XG4gKiBAdHlwZSBPYmplY3RcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwcm90b2NvbCBQcm90b2NvbCBtYXRjaGVkIGluIHRoZSBVUkwsIGluIGxvd2VyY2FzZS5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2xhc2hlcyBgdHJ1ZWAgaWYgcHJvdG9jb2wgaXMgZm9sbG93ZWQgYnkgXCIvL1wiLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcmVzdCBSZXN0IG9mIHRoZSBVUkwgdGhhdCBpcyBub3QgcGFydCBvZiB0aGUgcHJvdG9jb2wuXG4gKi9cblxuLyoqXG4gKiBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGZyb20gYSBVUkwgd2l0aC93aXRob3V0IGRvdWJsZSBzbGFzaCAoXCIvL1wiKS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBVUkwgd2Ugd2FudCB0byBleHRyYWN0IGZyb20uXG4gKiBAcmV0dXJuIHtQcm90b2NvbEV4dHJhY3R9IEV4dHJhY3RlZCBpbmZvcm1hdGlvbi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm90b2NvbChhZGRyZXNzKSB7XG4gIGFkZHJlc3MgPSB0cmltTGVmdChhZGRyZXNzKTtcblxuICB2YXIgbWF0Y2ggPSBwcm90b2NvbHJlLmV4ZWMoYWRkcmVzcylcbiAgICAsIHByb3RvY29sID0gbWF0Y2hbMV0gPyBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpIDogJydcbiAgICAsIHNsYXNoZXMgPSAhIShtYXRjaFsyXSAmJiBtYXRjaFsyXS5sZW5ndGggPj0gMilcbiAgICAsIHJlc3QgPSAgbWF0Y2hbMl0gJiYgbWF0Y2hbMl0ubGVuZ3RoID09PSAxID8gJy8nICsgbWF0Y2hbM10gOiBtYXRjaFszXTtcblxuICByZXR1cm4ge1xuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBzbGFzaGVzOiBzbGFzaGVzLFxuICAgIHJlc3Q6IHJlc3RcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgcmVsYXRpdmUgVVJMIHBhdGhuYW1lIGFnYWluc3QgYSBiYXNlIFVSTCBwYXRobmFtZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpdmUgUGF0aG5hbWUgb2YgdGhlIHJlbGF0aXZlIFVSTC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlIFBhdGhuYW1lIG9mIHRoZSBiYXNlIFVSTC5cbiAqIEByZXR1cm4ge1N0cmluZ30gUmVzb2x2ZWQgcGF0aG5hbWUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZXNvbHZlKHJlbGF0aXZlLCBiYXNlKSB7XG4gIGlmIChyZWxhdGl2ZSA9PT0gJycpIHJldHVybiBiYXNlO1xuXG4gIHZhciBwYXRoID0gKGJhc2UgfHwgJy8nKS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5jb25jYXQocmVsYXRpdmUuc3BsaXQoJy8nKSlcbiAgICAsIGkgPSBwYXRoLmxlbmd0aFxuICAgICwgbGFzdCA9IHBhdGhbaSAtIDFdXG4gICAgLCB1bnNoaWZ0ID0gZmFsc2VcbiAgICAsIHVwID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHBhdGhbaV0gPT09ICcuJykge1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXRoW2ldID09PSAnLi4nKSB7XG4gICAgICBwYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgaWYgKGkgPT09IDApIHVuc2hpZnQgPSB0cnVlO1xuICAgICAgcGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bnNoaWZ0KSBwYXRoLnVuc2hpZnQoJycpO1xuICBpZiAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHBhdGgucHVzaCgnJyk7XG5cbiAgcmV0dXJuIHBhdGguam9pbignLycpO1xufVxuXG4vKipcbiAqIFRoZSBhY3R1YWwgVVJMIGluc3RhbmNlLiBJbnN0ZWFkIG9mIHJldHVybmluZyBhbiBvYmplY3Qgd2UndmUgb3B0ZWQtaW4gdG9cbiAqIGNyZWF0ZSBhbiBhY3R1YWwgY29uc3RydWN0b3IgYXMgaXQncyBtdWNoIG1vcmUgbWVtb3J5IGVmZmljaWVudCBhbmRcbiAqIGZhc3RlciBhbmQgaXQgcGxlYXNlcyBteSBPQ0QuXG4gKlxuICogSXQgaXMgd29ydGggbm90aW5nIHRoYXQgd2Ugc2hvdWxkIG5vdCB1c2UgYFVSTGAgYXMgY2xhc3MgbmFtZSB0byBwcmV2ZW50XG4gKiBjbGFzaGVzIHdpdGggdGhlIGdsb2JhbCBVUkwgaW5zdGFuY2UgdGhhdCBnb3QgaW50cm9kdWNlZCBpbiBicm93c2Vycy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBhZGRyZXNzIFVSTCB3ZSB3YW50IHRvIHBhcnNlLlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBbbG9jYXRpb25dIExvY2F0aW9uIGRlZmF1bHRzIGZvciByZWxhdGl2ZSBwYXRocy5cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gW3BhcnNlcl0gUGFyc2VyIGZvciB0aGUgcXVlcnkgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gVXJsKGFkZHJlc3MsIGxvY2F0aW9uLCBwYXJzZXIpIHtcbiAgYWRkcmVzcyA9IHRyaW1MZWZ0KGFkZHJlc3MpO1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVcmwpKSB7XG4gICAgcmV0dXJuIG5ldyBVcmwoYWRkcmVzcywgbG9jYXRpb24sIHBhcnNlcik7XG4gIH1cblxuICB2YXIgcmVsYXRpdmUsIGV4dHJhY3RlZCwgcGFyc2UsIGluc3RydWN0aW9uLCBpbmRleCwga2V5XG4gICAgLCBpbnN0cnVjdGlvbnMgPSBydWxlcy5zbGljZSgpXG4gICAgLCB0eXBlID0gdHlwZW9mIGxvY2F0aW9uXG4gICAgLCB1cmwgPSB0aGlzXG4gICAgLCBpID0gMDtcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGlmIHN0YXRlbWVudHMgYWxsb3dzIHRoaXMgbW9kdWxlIHR3byBoYXZlIGNvbXBhdGliaWxpdHkgd2l0aFxuICAvLyAyIGRpZmZlcmVudCBBUEk6XG4gIC8vXG4gIC8vIDEuIE5vZGUuanMncyBgdXJsLnBhcnNlYCBhcGkgd2hpY2ggYWNjZXB0cyBhIFVSTCwgYm9vbGVhbiBhcyBhcmd1bWVudHNcbiAgLy8gICAgd2hlcmUgdGhlIGJvb2xlYW4gaW5kaWNhdGVzIHRoYXQgdGhlIHF1ZXJ5IHN0cmluZyBzaG91bGQgYWxzbyBiZSBwYXJzZWQuXG4gIC8vXG4gIC8vIDIuIFRoZSBgVVJMYCBpbnRlcmZhY2Ugb2YgdGhlIGJyb3dzZXIgd2hpY2ggYWNjZXB0cyBhIFVSTCwgb2JqZWN0IGFzXG4gIC8vICAgIGFyZ3VtZW50cy4gVGhlIHN1cHBsaWVkIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdCB2YWx1ZXMgLyBmYWxsLWJhY2tcbiAgLy8gICAgZm9yIHJlbGF0aXZlIHBhdGhzLlxuICAvL1xuICBpZiAoJ29iamVjdCcgIT09IHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGUpIHtcbiAgICBwYXJzZXIgPSBsb2NhdGlvbjtcbiAgICBsb2NhdGlvbiA9IG51bGw7XG4gIH1cblxuICBpZiAocGFyc2VyICYmICdmdW5jdGlvbicgIT09IHR5cGVvZiBwYXJzZXIpIHBhcnNlciA9IHFzLnBhcnNlO1xuXG4gIGxvY2F0aW9uID0gbG9sY2F0aW9uKGxvY2F0aW9uKTtcblxuICAvL1xuICAvLyBFeHRyYWN0IHByb3RvY29sIGluZm9ybWF0aW9uIGJlZm9yZSBydW5uaW5nIHRoZSBpbnN0cnVjdGlvbnMuXG4gIC8vXG4gIGV4dHJhY3RlZCA9IGV4dHJhY3RQcm90b2NvbChhZGRyZXNzIHx8ICcnKTtcbiAgcmVsYXRpdmUgPSAhZXh0cmFjdGVkLnByb3RvY29sICYmICFleHRyYWN0ZWQuc2xhc2hlcztcbiAgdXJsLnNsYXNoZXMgPSBleHRyYWN0ZWQuc2xhc2hlcyB8fCByZWxhdGl2ZSAmJiBsb2NhdGlvbi5zbGFzaGVzO1xuICB1cmwucHJvdG9jb2wgPSBleHRyYWN0ZWQucHJvdG9jb2wgfHwgbG9jYXRpb24ucHJvdG9jb2wgfHwgJyc7XG4gIGFkZHJlc3MgPSBleHRyYWN0ZWQucmVzdDtcblxuICAvL1xuICAvLyBXaGVuIHRoZSBhdXRob3JpdHkgY29tcG9uZW50IGlzIGFic2VudCB0aGUgVVJMIHN0YXJ0cyB3aXRoIGEgcGF0aFxuICAvLyBjb21wb25lbnQuXG4gIC8vXG4gIGlmICghZXh0cmFjdGVkLnNsYXNoZXMpIGluc3RydWN0aW9uc1szXSA9IFsvKC4qKS8sICdwYXRobmFtZSddO1xuXG4gIGZvciAoOyBpIDwgaW5zdHJ1Y3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnNbaV07XG5cbiAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhZGRyZXNzID0gaW5zdHJ1Y3Rpb24oYWRkcmVzcyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwYXJzZSA9IGluc3RydWN0aW9uWzBdO1xuICAgIGtleSA9IGluc3RydWN0aW9uWzFdO1xuXG4gICAgaWYgKHBhcnNlICE9PSBwYXJzZSkge1xuICAgICAgdXJsW2tleV0gPSBhZGRyZXNzO1xuICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBwYXJzZSkge1xuICAgICAgaWYgKH4oaW5kZXggPSBhZGRyZXNzLmluZGV4T2YocGFyc2UpKSkge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBpbnN0cnVjdGlvblsyXSkge1xuICAgICAgICAgIHVybFtrZXldID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0cnVjdGlvblsyXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsW2tleV0gPSBhZGRyZXNzLnNsaWNlKGluZGV4KTtcbiAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChpbmRleCA9IHBhcnNlLmV4ZWMoYWRkcmVzcykpKSB7XG4gICAgICB1cmxba2V5XSA9IGluZGV4WzFdO1xuICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXguaW5kZXgpO1xuICAgIH1cblxuICAgIHVybFtrZXldID0gdXJsW2tleV0gfHwgKFxuICAgICAgcmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJydcbiAgICApO1xuXG4gICAgLy9cbiAgICAvLyBIb3N0bmFtZSwgaG9zdCBhbmQgcHJvdG9jb2wgc2hvdWxkIGJlIGxvd2VyY2FzZWQgc28gdGhleSBjYW4gYmUgdXNlZCB0b1xuICAgIC8vIGNyZWF0ZSBhIHByb3BlciBgb3JpZ2luYC5cbiAgICAvL1xuICAgIGlmIChpbnN0cnVjdGlvbls0XSkgdXJsW2tleV0gPSB1cmxba2V5XS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLy9cbiAgLy8gQWxzbyBwYXJzZSB0aGUgc3VwcGxpZWQgcXVlcnkgc3RyaW5nIGluIHRvIGFuIG9iamVjdC4gSWYgd2UncmUgc3VwcGxpZWRcbiAgLy8gd2l0aCBhIGN1c3RvbSBwYXJzZXIgYXMgZnVuY3Rpb24gdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgZGVmYXVsdCBidWlsZC1pblxuICAvLyBwYXJzZXIuXG4gIC8vXG4gIGlmIChwYXJzZXIpIHVybC5xdWVyeSA9IHBhcnNlcih1cmwucXVlcnkpO1xuXG4gIC8vXG4gIC8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHJlc29sdmUgdGhlIHBhdGhuYW1lIGFnYWluc3QgdGhlIGJhc2UgVVJMLlxuICAvL1xuICBpZiAoXG4gICAgICByZWxhdGl2ZVxuICAgICYmIGxvY2F0aW9uLnNsYXNoZXNcbiAgICAmJiB1cmwucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLydcbiAgICAmJiAodXJsLnBhdGhuYW1lICE9PSAnJyB8fCBsb2NhdGlvbi5wYXRobmFtZSAhPT0gJycpXG4gICkge1xuICAgIHVybC5wYXRobmFtZSA9IHJlc29sdmUodXJsLnBhdGhuYW1lLCBsb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICAvL1xuICAvLyBEZWZhdWx0IHRvIGEgLyBmb3IgcGF0aG5hbWUgaWYgbm9uZSBleGlzdHMuIFRoaXMgbm9ybWFsaXplcyB0aGUgVVJMXG4gIC8vIHRvIGFsd2F5cyBoYXZlIGEgL1xuICAvL1xuICBpZiAodXJsLnBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nICYmIHVybC5ob3N0bmFtZSkge1xuICAgIHVybC5wYXRobmFtZSA9ICcvJyArIHVybC5wYXRobmFtZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIHNob3VsZCBub3QgYWRkIHBvcnQgbnVtYmVycyBpZiB0aGV5IGFyZSBhbHJlYWR5IHRoZSBkZWZhdWx0IHBvcnQgbnVtYmVyXG4gIC8vIGZvciBhIGdpdmVuIHByb3RvY29sLiBBcyB0aGUgaG9zdCBhbHNvIGNvbnRhaW5zIHRoZSBwb3J0IG51bWJlciB3ZSdyZSBnb2luZ1xuICAvLyBvdmVycmlkZSBpdCB3aXRoIHRoZSBob3N0bmFtZSB3aGljaCBjb250YWlucyBubyBwb3J0IG51bWJlci5cbiAgLy9cbiAgaWYgKCFyZXF1aXJlZCh1cmwucG9ydCwgdXJsLnByb3RvY29sKSkge1xuICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICAgIHVybC5wb3J0ID0gJyc7XG4gIH1cblxuICAvL1xuICAvLyBQYXJzZSBkb3duIHRoZSBgYXV0aGAgZm9yIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQuXG4gIC8vXG4gIHVybC51c2VybmFtZSA9IHVybC5wYXNzd29yZCA9ICcnO1xuICBpZiAodXJsLmF1dGgpIHtcbiAgICBpbnN0cnVjdGlvbiA9IHVybC5hdXRoLnNwbGl0KCc6Jyk7XG4gICAgdXJsLnVzZXJuYW1lID0gaW5zdHJ1Y3Rpb25bMF0gfHwgJyc7XG4gICAgdXJsLnBhc3N3b3JkID0gaW5zdHJ1Y3Rpb25bMV0gfHwgJyc7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICYmIHVybC5ob3N0ICYmIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6J1xuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIC8vXG4gIC8vIFRoZSBocmVmIGlzIGp1c3QgdGhlIGNvbXBpbGVkIHJlc3VsdC5cbiAgLy9cbiAgdXJsLmhyZWYgPSB1cmwudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY2hhbmdpbmcgcHJvcGVydGllcyBpbiB0aGUgVVJMIGluc3RhbmNlIHRvXG4gKiBpbnN1cmUgdGhhdCB0aGV5IGFsbCBwcm9wYWdhdGUgY29ycmVjdGx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJ0ICAgICAgICAgIFByb3BlcnR5IHdlIG5lZWQgdG8gYWRqdXN0LlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgICAgICAgICAgVGhlIG5ld2x5IGFzc2lnbmVkIHZhbHVlLlxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSBmbiAgV2hlbiBzZXR0aW5nIHRoZSBxdWVyeSwgaXQgd2lsbCBiZSB0aGUgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQgdG8gcGFyc2UgdGhlIHF1ZXJ5LlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2hlbiBzZXR0aW5nIHRoZSBwcm90b2NvbCwgZG91YmxlIHNsYXNoIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgZnJvbSB0aGUgZmluYWwgdXJsIGlmIGl0IGlzIHRydWUuXG4gKiBAcmV0dXJucyB7VVJMfSBVUkwgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBzZXQocGFydCwgdmFsdWUsIGZuKSB7XG4gIHZhciB1cmwgPSB0aGlzO1xuXG4gIHN3aXRjaCAocGFydCkge1xuICAgIGNhc2UgJ3F1ZXJ5JzpcbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICB2YWx1ZSA9IChmbiB8fCBxcy5wYXJzZSkodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncG9ydCc6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcblxuICAgICAgaWYgKCFyZXF1aXJlZCh2YWx1ZSwgdXJsLnByb3RvY29sKSkge1xuICAgICAgICB1cmwuaG9zdCA9IHVybC5ob3N0bmFtZTtcbiAgICAgICAgdXJsW3BhcnRdID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgIHVybC5ob3N0ID0gdXJsLmhvc3RuYW1lICsnOicrIHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hvc3RuYW1lJzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAodXJsLnBvcnQpIHZhbHVlICs9ICc6JysgdXJsLnBvcnQ7XG4gICAgICB1cmwuaG9zdCA9IHZhbHVlO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdob3N0JzpcbiAgICAgIHVybFtwYXJ0XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoLzpcXGQrJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zcGxpdCgnOicpO1xuICAgICAgICB1cmwucG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZS5qb2luKCc6Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwuaG9zdG5hbWUgPSB2YWx1ZTtcbiAgICAgICAgdXJsLnBvcnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm90b2NvbCc6XG4gICAgICB1cmwucHJvdG9jb2wgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdXJsLnNsYXNoZXMgPSAhZm47XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BhdGhuYW1lJzpcbiAgICBjYXNlICdoYXNoJzpcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB2YXIgY2hhciA9IHBhcnQgPT09ICdwYXRobmFtZScgPyAnLycgOiAnIyc7XG4gICAgICAgIHVybFtwYXJ0XSA9IHZhbHVlLmNoYXJBdCgwKSAhPT0gY2hhciA/IGNoYXIgKyB2YWx1ZSA6IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsW3BhcnRdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB1cmxbcGFydF0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW5zID0gcnVsZXNbaV07XG5cbiAgICBpZiAoaW5zWzRdKSB1cmxbaW5zWzFdXSA9IHVybFtpbnNbMV1dLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICB1cmwub3JpZ2luID0gdXJsLnByb3RvY29sICYmIHVybC5ob3N0ICYmIHVybC5wcm90b2NvbCAhPT0gJ2ZpbGU6J1xuICAgID8gdXJsLnByb3RvY29sICsnLy8nKyB1cmwuaG9zdFxuICAgIDogJ251bGwnO1xuXG4gIHVybC5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIHByb3BlcnRpZXMgYmFjayBpbiB0byBhIHZhbGlkIGFuZCBmdWxsIFVSTCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5naWZ5IE9wdGlvbmFsIHF1ZXJ5IHN0cmluZ2lmeSBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IENvbXBpbGVkIHZlcnNpb24gb2YgdGhlIFVSTC5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcoc3RyaW5naWZ5KSB7XG4gIGlmICghc3RyaW5naWZ5IHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdHJpbmdpZnkpIHN0cmluZ2lmeSA9IHFzLnN0cmluZ2lmeTtcblxuICB2YXIgcXVlcnlcbiAgICAsIHVybCA9IHRoaXNcbiAgICAsIHByb3RvY29sID0gdXJsLnByb3RvY29sO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5jaGFyQXQocHJvdG9jb2wubGVuZ3RoIC0gMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICh1cmwuc2xhc2hlcyA/ICcvLycgOiAnJyk7XG5cbiAgaWYgKHVybC51c2VybmFtZSkge1xuICAgIHJlc3VsdCArPSB1cmwudXNlcm5hbWU7XG4gICAgaWYgKHVybC5wYXNzd29yZCkgcmVzdWx0ICs9ICc6JysgdXJsLnBhc3N3b3JkO1xuICAgIHJlc3VsdCArPSAnQCc7XG4gIH1cblxuICByZXN1bHQgKz0gdXJsLmhvc3QgKyB1cmwucGF0aG5hbWU7XG5cbiAgcXVlcnkgPSAnb2JqZWN0JyA9PT0gdHlwZW9mIHVybC5xdWVyeSA/IHN0cmluZ2lmeSh1cmwucXVlcnkpIDogdXJsLnF1ZXJ5O1xuICBpZiAocXVlcnkpIHJlc3VsdCArPSAnPycgIT09IHF1ZXJ5LmNoYXJBdCgwKSA/ICc/JysgcXVlcnkgOiBxdWVyeTtcblxuICBpZiAodXJsLmhhc2gpIHJlc3VsdCArPSB1cmwuaGFzaDtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5VcmwucHJvdG90eXBlID0geyBzZXQ6IHNldCwgdG9TdHJpbmc6IHRvU3RyaW5nIH07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIFVSTCBwYXJzZXIgYW5kIHNvbWUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgYmUgdXNlZnVsIGZvclxuLy8gb3RoZXJzIG9yIHRlc3RpbmcuXG4vL1xuVXJsLmV4dHJhY3RQcm90b2NvbCA9IGV4dHJhY3RQcm90b2NvbDtcblVybC5sb2NhdGlvbiA9IGxvbGNhdGlvbjtcblVybC50cmltTGVmdCA9IHRyaW1MZWZ0O1xuVXJsLnFzID0gcXM7XG5cbm1vZHVsZS5leHBvcnRzID0gVXJsO1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMgd2lsZGNhcmRcblxuICBWZXJ5IHNpbXBsZSB3aWxkY2FyZCBtYXRjaGluZywgd2hpY2ggaXMgZGVzaWduZWQgdG8gcHJvdmlkZSB0aGUgc2FtZVxuICBmdW5jdGlvbmFsaXR5IHRoYXQgaXMgZm91bmQgaW4gdGhlXG4gIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpIGV2ZW50aW5nIGxpYnJhcnkuXG5cbiAgIyMgVXNhZ2VcblxuICBJdCB3b3JrcyB3aXRoIHN0cmluZ3M6XG5cbiAgPDw8IGV4YW1wbGVzL3N0cmluZ3MuanNcblxuICBBcnJheXM6XG5cbiAgPDw8IGV4YW1wbGVzL2FycmF5cy5qc1xuXG4gIE9iamVjdHMgKG1hdGNoaW5nIGFnYWluc3Qga2V5cyk6XG5cbiAgPDw8IGV4YW1wbGVzL29iamVjdHMuanNcblxuICBXaGlsZSB0aGUgbGlicmFyeSB3b3JrcyBpbiBOb2RlLCBpZiB5b3UgYXJlIGFyZSBsb29raW5nIGZvciBmaWxlLWJhc2VkXG4gIHdpbGRjYXJkIG1hdGNoaW5nIHRoZW4geW91IHNob3VsZCBoYXZlIGEgbG9vayBhdDpcblxuICA8aHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2I+XG4qKi9cblxuZnVuY3Rpb24gV2lsZGNhcmRNYXRjaGVyKHRleHQsIHNlcGFyYXRvcikge1xuICB0aGlzLnRleHQgPSB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgdGhpcy5oYXNXaWxkID0gfnRleHQuaW5kZXhPZignKicpO1xuICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgdGhpcy5wYXJ0cyA9IHRleHQuc3BsaXQoc2VwYXJhdG9yKTtcbn1cblxuV2lsZGNhcmRNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgdmFyIHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgdmFyIGlpO1xuICB2YXIgcGFydHNDb3VudCA9IHBhcnRzLmxlbmd0aDtcbiAgdmFyIHRlc3RQYXJ0cztcblxuICBpZiAodHlwZW9mIGlucHV0ID09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc1dpbGQgJiYgdGhpcy50ZXh0ICE9IGlucHV0KSB7XG4gICAgICBtYXRjaGVzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlc3RQYXJ0cyA9IChpbnB1dCB8fCAnJykuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgICAgZm9yIChpaSA9IDA7IG1hdGNoZXMgJiYgaWkgPCBwYXJ0c0NvdW50OyBpaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpaV0gPT09ICcqJykgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpaSA8IHRlc3RQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXRjaGVzID0gcGFydHNbaWldID09PSB0ZXN0UGFydHNbaWldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXRjaGVzLCB0aGVuIHJldHVybiB0aGUgY29tcG9uZW50IHBhcnRzXG4gICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiB0ZXN0UGFydHM7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpbnB1dC5zcGxpY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hdGNoZXMgPSBbXTtcblxuICAgIGZvciAoaWkgPSBpbnB1dC5sZW5ndGg7IGlpLS07ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goaW5wdXRbaWldKSkge1xuICAgICAgICBtYXRjaGVzW21hdGNoZXMubGVuZ3RoXSA9IGlucHV0W2lpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0ID09ICdvYmplY3QnKSB7XG4gICAgbWF0Y2hlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChrZXkpKSB7XG4gICAgICAgIG1hdGNoZXNba2V5XSA9IGlucHV0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIHRlc3QsIHNlcGFyYXRvcikge1xuICB2YXIgbWF0Y2hlciA9IG5ldyBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yIHx8IC9bXFwvXFwuXS8pO1xuICBpZiAodHlwZW9mIHRlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbWF0Y2hlci5tYXRjaCh0ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcignQXV0aG9yaXphdGlvbiByZXF1aXJlZCcpXG4gICAgdGhpcy5uYW1lID0gJ0F1dGhFcnJvcidcbiAgICB0aGlzLmlzQXV0aEVycm9yID0gdHJ1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aEVycm9yXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5jb25zdCB0b2tlblN0b3JhZ2UgPSByZXF1aXJlKCcuL3Rva2VuU3RvcmFnZScpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICAgIHRoaXMudG9rZW5LZXkgPSBgY29tcGFuaW9uLSR7dGhpcy5wbHVnaW5JZH0tYXV0aC10b2tlbmBcbiAgICB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgPSB0aGlzLm9wdHMuY29tcGFuaW9uS2V5c1BhcmFtc1xuICAgIHRoaXMucHJlQXV0aFRva2VuID0gbnVsbFxuICB9XG5cbiAgaGVhZGVycyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtzdXBlci5oZWFkZXJzKCksIHRoaXMuZ2V0QXV0aFRva2VuKCldKVxuICAgICAgLnRoZW4oKFtoZWFkZXJzLCB0b2tlbl0pID0+IHtcbiAgICAgICAgY29uc3QgYXV0aEhlYWRlcnMgPSB7fVxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBhdXRoSGVhZGVyc1sndXBweS1hdXRoLXRva2VuJ10gPSB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcykge1xuICAgICAgICAgIGF1dGhIZWFkZXJzWyd1cHB5LWNyZWRlbnRpYWxzLXBhcmFtcyddID0gYnRvYShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgcGFyYW1zOiB0aGlzLmNvbXBhbmlvbktleXNQYXJhbXMgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uaGVhZGVycywgLi4uYXV0aEhlYWRlcnMgfVxuICAgICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIHJlc3BvbnNlID0gc3VwZXIub25SZWNlaXZlUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKVxuICAgIGNvbnN0IG9sZEF1dGhlbnRpY2F0ZWQgPSBwbHVnaW4uZ2V0UGx1Z2luU3RhdGUoKS5hdXRoZW50aWNhdGVkXG4gICAgY29uc3QgYXV0aGVudGljYXRlZCA9IG9sZEF1dGhlbnRpY2F0ZWQgPyByZXNwb25zZS5zdGF0dXMgIT09IDQwMSA6IHJlc3BvbnNlLnN0YXR1cyA8IDQwMFxuICAgIHBsdWdpbi5zZXRQbHVnaW5TdGF0ZSh7IGF1dGhlbnRpY2F0ZWQgfSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gIHNldEF1dGhUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnNldEl0ZW0odGhpcy50b2tlbktleSwgdG9rZW4pXG4gIH1cblxuICBnZXRBdXRoVG9rZW4gKCkge1xuICAgIHJldHVybiB0aGlzLnVwcHkuZ2V0UGx1Z2luKHRoaXMucGx1Z2luSWQpLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnRva2VuS2V5KVxuICB9XG5cbiAgYXV0aFVybCAocXVlcmllcyA9IHt9KSB7XG4gICAgaWYgKHRoaXMucHJlQXV0aFRva2VuKSB7XG4gICAgICBxdWVyaWVzLnVwcHlQcmVBdXRoVG9rZW4gPSB0aGlzLnByZUF1dGhUb2tlblxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aGlzLmhvc3RuYW1lfS8ke3RoaXMuaWR9L2Nvbm5lY3Q/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJpZXMpfWBcbiAgfVxuXG4gIGZpbGVVcmwgKGlkKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaG9zdG5hbWV9LyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgZmV0Y2hQcmVBdXRoVG9rZW4gKCkge1xuICAgIGlmICghdGhpcy5jb21wYW5pb25LZXlzUGFyYW1zKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KGAke3RoaXMuaWR9L3ByZWF1dGgvYCwgeyBwYXJhbXM6IHRoaXMuY29tcGFuaW9uS2V5c1BhcmFtcyB9KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnByZUF1dGhUb2tlbiA9IHJlcy50b2tlblxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSB1bmFibGUgdG8gZmV0Y2ggcHJlQXV0aFRva2VuICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgIH0pXG4gIH1cblxuICBsaXN0IChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbGlzdC8ke2RpcmVjdG9yeSB8fCAnJ31gKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoYCR7dGhpcy5pZH0vbG9nb3V0YClcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gUHJvbWlzZS5hbGwoW1xuICAgICAgICByZXNwb25zZSxcbiAgICAgICAgdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLnBsdWdpbklkKS5zdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy50b2tlbktleSksXG4gICAgICBdKSkudGhlbigoW3Jlc3BvbnNlXSkgPT4gcmVzcG9uc2UpXG4gIH1cblxuICBzdGF0aWMgaW5pdFBsdWdpbiAocGx1Z2luLCBvcHRzLCBkZWZhdWx0T3B0cykge1xuICAgIHBsdWdpbi50eXBlID0gJ2FjcXVpcmVyJ1xuICAgIHBsdWdpbi5maWxlcyA9IFtdXG4gICAgaWYgKGRlZmF1bHRPcHRzKSB7XG4gICAgICBwbHVnaW4ub3B0cyA9IHsgLi4uZGVmYXVsdE9wdHMsIC4uLm9wdHMgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlclVybCB8fCBvcHRzLnNlcnZlclBhdHRlcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlcnZlclVybGAgYW5kIGBzZXJ2ZXJQYXR0ZXJuYCBoYXZlIGJlZW4gcmVuYW1lZCB0byBgY29tcGFuaW9uVXJsYCBhbmQgYGNvbXBhbmlvbkFsbG93ZWRIb3N0c2AgcmVzcGVjdGl2ZWx5IGluIHRoZSAwLjMwLjUgcmVsZWFzZS4gUGxlYXNlIGNvbnN1bHQgdGhlIGRvY3MgKGZvciBleGFtcGxlLCBodHRwczovL3VwcHkuaW8vZG9jcy9pbnN0YWdyYW0vIGZvciB0aGUgSW5zdGFncmFtIHBsdWdpbikgYW5kIHVzZSB0aGUgdXBkYXRlZCBvcHRpb25zLmAnKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBhbmlvbkFsbG93ZWRIb3N0cykge1xuICAgICAgY29uc3QgcGF0dGVybiA9IG9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzXG4gICAgICAvLyB2YWxpZGF0ZSBjb21wYW5pb25BbGxvd2VkSG9zdHMgcGFyYW1cbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiAhPT0gJ3N0cmluZycgJiYgIUFycmF5LmlzQXJyYXkocGF0dGVybikgJiYgIShwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3BsdWdpbi5pZH06IHRoZSBvcHRpb24gXCJjb21wYW5pb25BbGxvd2VkSG9zdHNcIiBtdXN0IGJlIG9uZSBvZiBzdHJpbmcsIEFycmF5LCBSZWdFeHBgKVxuICAgICAgfVxuICAgICAgcGx1Z2luLm9wdHMuY29tcGFuaW9uQWxsb3dlZEhvc3RzID0gcGF0dGVyblxuICAgIH0gZWxzZSBpZiAoL14oPyFodHRwcz86XFwvXFwvKS4qJC9pLnRlc3Qob3B0cy5jb21wYW5pb25VcmwpKSB7XG4gICAgICAvLyBkb2VzIG5vdCBzdGFydCB3aXRoIGh0dHBzOi8vXG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBgaHR0cHM6Ly8ke29wdHMuY29tcGFuaW9uVXJsLnJlcGxhY2UoL15cXC9cXC8vLCAnJyl9YFxuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW4ub3B0cy5jb21wYW5pb25BbGxvd2VkSG9zdHMgPSBuZXcgVVJMKG9wdHMuY29tcGFuaW9uVXJsKS5vcmlnaW5cbiAgICB9XG5cbiAgICBwbHVnaW4uc3RvcmFnZSA9IHBsdWdpbi5vcHRzLnN0b3JhZ2UgfHwgdG9rZW5TdG9yYWdlXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmZXRjaFdpdGhOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmV0Y2hXaXRoTmV0d29ya0Vycm9yJylcbmNvbnN0IEF1dGhFcnJvciA9IHJlcXVpcmUoJy4vQXV0aEVycm9yJylcblxuLy8gUmVtb3ZlIHRoZSB0cmFpbGluZyBzbGFzaCBzbyB3ZSBjYW4gYWx3YXlzIHNhZmVseSBhcHBlbmQgL3h5ei5cbmZ1bmN0aW9uIHN0cmlwU2xhc2ggKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcLyQvLCAnJylcbn1cblxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSlNPTlJlc3BvbnNlIChyZXMpIHtcbiAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgIHRocm93IG5ldyBBdXRoRXJyb3IoKVxuICB9XG5cbiAgY29uc3QganNvblByb21pc2UgPSByZXMuanNvbigpXG5cbiAgaWYgKHJlcy5zdGF0dXMgPCAyMDAgfHwgcmVzLnN0YXR1cyA+IDMwMCkge1xuICAgIGxldCBlcnJNc2cgPSBgRmFpbGVkIHJlcXVlc3Qgd2l0aCBzdGF0dXM6ICR7cmVzLnN0YXR1c30uICR7cmVzLnN0YXR1c1RleHR9YFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBlcnJEYXRhID0gYXdhaXQganNvblByb21pc2VcbiAgICAgIGVyck1zZyA9IGVyckRhdGEubWVzc2FnZSA/IGAke2Vyck1zZ30gbWVzc2FnZTogJHtlcnJEYXRhLm1lc3NhZ2V9YCA6IGVyck1zZ1xuICAgICAgZXJyTXNnID0gZXJyRGF0YS5yZXF1ZXN0SWQgPyBgJHtlcnJNc2d9IHJlcXVlc3QtSWQ6ICR7ZXJyRGF0YS5yZXF1ZXN0SWR9YCA6IGVyck1zZ1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5zYWZlLWZpbmFsbHlcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpXG4gICAgfVxuICB9XG4gIHJldHVybiBqc29uUHJvbWlzZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlcXVlc3RDbGllbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgc3RhdGljIFZFUlNJT04gPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uXG5cbiAgI2dldFBvc3RSZXNwb25zZUZ1bmMgPSBza2lwID0+IHJlc3BvbnNlID0+IChza2lwID8gcmVzcG9uc2UgOiB0aGlzLm9uUmVjZWl2ZVJlc3BvbnNlKHJlc3BvbnNlKSlcblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5vblJlY2VpdmVSZXNwb25zZSA9IHRoaXMub25SZWNlaXZlUmVzcG9uc2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYWxsb3dlZEhlYWRlcnMgPSBbJ2FjY2VwdCcsICdjb250ZW50LXR5cGUnLCAndXBweS1hdXRoLXRva2VuJ11cbiAgICB0aGlzLnByZWZsaWdodERvbmUgPSBmYWxzZVxuICB9XG5cbiAgZ2V0IGhvc3RuYW1lICgpIHtcbiAgICBjb25zdCB7IGNvbXBhbmlvbiB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIHJldHVybiBzdHJpcFNsYXNoKGNvbXBhbmlvbiAmJiBjb21wYW5pb25baG9zdF0gPyBjb21wYW5pb25baG9zdF0gOiBob3N0KVxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRIZWFkZXJzID17XG4gICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnVXBweS1WZXJzaW9ucyc6IGBAdXBweS9jb21wYW5pb24tY2xpZW50PSR7UmVxdWVzdENsaWVudC5WRVJTSU9OfWAsXG4gIH1cblxuICBoZWFkZXJzICgpIHtcbiAgICBjb25zdCB1c2VySGVhZGVycyA9IHRoaXMub3B0cy5jb21wYW5pb25IZWFkZXJzIHx8IHt9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAuLi5SZXF1ZXN0Q2xpZW50LmRlZmF1bHRIZWFkZXJzLFxuICAgICAgLi4udXNlckhlYWRlcnMsXG4gICAgfSlcbiAgfVxuXG4gIG9uUmVjZWl2ZVJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBjb25zdCBjb21wYW5pb24gPSBzdGF0ZS5jb21wYW5pb24gfHwge31cbiAgICBjb25zdCBob3N0ID0gdGhpcy5vcHRzLmNvbXBhbmlvblVybFxuICAgIGNvbnN0IHsgaGVhZGVycyB9ID0gcmVzcG9uc2VcbiAgICAvLyBTdG9yZSB0aGUgc2VsZi1pZGVudGlmaWVkIGRvbWFpbiBuYW1lIGZvciB0aGUgQ29tcGFuaW9uIGluc3RhbmNlIHdlIGp1c3QgaGl0LlxuICAgIGlmIChoZWFkZXJzLmhhcygnaS1hbScpICYmIGhlYWRlcnMuZ2V0KCdpLWFtJykgIT09IGNvbXBhbmlvbltob3N0XSkge1xuICAgICAgdGhpcy51cHB5LnNldFN0YXRlKHtcbiAgICAgICAgY29tcGFuaW9uOiB7IC4uLmNvbXBhbmlvbiwgW2hvc3RdOiBoZWFkZXJzLmdldCgnaS1hbScpIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfVxuXG4gICNnZXRVcmwgKHVybCkge1xuICAgIGlmICgvXihodHRwcz86fClcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgcmV0dXJuIHVybFxuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vJHt1cmx9YFxuICB9XG5cbiAgI2Vycm9ySGFuZGxlciAobWV0aG9kLCBwYXRoKSB7XG4gICAgcmV0dXJuIChlcnIpID0+IHtcbiAgICAgIGlmICghZXJyPy5pc0F1dGhFcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgQ291bGQgbm90ICR7bWV0aG9kfSAke3RoaXMuI2dldFVybChwYXRoKX1gKVxuICAgICAgICBlcnJvci5jYXVzZSA9IGVyclxuICAgICAgICBlcnIgPSBlcnJvciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgIH1cbiAgfVxuXG4gIHByZWZsaWdodCAocGF0aCkge1xuICAgIGlmICh0aGlzLnByZWZsaWdodERvbmUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpKVxuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgIG1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmhlYWRlcnMuaGFzKCdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJykpIHtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRIZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnKVxuICAgICAgICAgICAgLnNwbGl0KCcsJykubWFwKChoZWFkZXJOYW1lKSA9PiBoZWFkZXJOYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0RG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEhlYWRlcnMuc2xpY2UoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coYFtDb21wYW5pb25DbGllbnRdIHVuYWJsZSB0byBtYWtlIHByZWZsaWdodCByZXF1ZXN0ICR7ZXJyfWAsICd3YXJuaW5nJylcbiAgICAgICAgdGhpcy5wcmVmbGlnaHREb25lID0gdHJ1ZVxuICAgICAgICByZXR1cm4gdGhpcy5hbGxvd2VkSGVhZGVycy5zbGljZSgpXG4gICAgICB9KVxuICB9XG5cbiAgcHJlZmxpZ2h0QW5kSGVhZGVycyAocGF0aCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5wcmVmbGlnaHQocGF0aCksIHRoaXMuaGVhZGVycygpXSlcbiAgICAgIC50aGVuKChbYWxsb3dlZEhlYWRlcnMsIGhlYWRlcnNdKSA9PiB7XG4gICAgICAgIC8vIGZpbHRlciB0byBrZWVwIG9ubHkgYWxsb3dlZCBIZWFkZXJzXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgIGlmICghYWxsb3dlZEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICB0aGlzLnVwcHkubG9nKGBbQ29tcGFuaW9uQ2xpZW50XSBleGNsdWRpbmcgZGlzYWxsb3dlZCBoZWFkZXIgJHtoZWFkZXJ9YClcbiAgICAgICAgICAgIGRlbGV0ZSBoZWFkZXJzW2hlYWRlcl0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gaGVhZGVyc1xuICAgICAgfSlcbiAgfVxuXG4gIGdldCAocGF0aCwgc2tpcFBvc3RSZXNwb25zZSkge1xuICAgIGNvbnN0IG1ldGhvZCA9ICdnZXQnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICB9KSlcbiAgICAgIC50aGVuKHRoaXMuI2dldFBvc3RSZXNwb25zZUZ1bmMoc2tpcFBvc3RSZXNwb25zZSkpXG4gICAgICAudGhlbihoYW5kbGVKU09OUmVzcG9uc2UpXG4gICAgICAuY2F0Y2godGhpcy4jZXJyb3JIYW5kbGVyKG1ldGhvZCwgcGF0aCkpXG4gIH1cblxuICBwb3N0IChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ3Bvc3QnXG4gICAgcmV0dXJuIHRoaXMucHJlZmxpZ2h0QW5kSGVhZGVycyhwYXRoKVxuICAgICAgLnRoZW4oKGhlYWRlcnMpID0+IGZldGNoV2l0aE5ldHdvcmtFcnJvcih0aGlzLiNnZXRVcmwocGF0aCksIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRzLmNvbXBhbmlvbkNvb2tpZXNSdWxlIHx8ICdzYW1lLW9yaWdpbicsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG5cbiAgZGVsZXRlIChwYXRoLCBkYXRhLCBza2lwUG9zdFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWV0aG9kID0gJ2RlbGV0ZSdcbiAgICByZXR1cm4gdGhpcy5wcmVmbGlnaHRBbmRIZWFkZXJzKHBhdGgpXG4gICAgICAudGhlbigoaGVhZGVycykgPT4gZmV0Y2hXaXRoTmV0d29ya0Vycm9yKGAke3RoaXMuaG9zdG5hbWV9LyR7cGF0aH1gLCB7XG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0cy5jb21wYW5pb25Db29raWVzUnVsZSB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICBib2R5OiBkYXRhID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBudWxsLFxuICAgICAgfSkpXG4gICAgICAudGhlbih0aGlzLiNnZXRQb3N0UmVzcG9uc2VGdW5jKHNraXBQb3N0UmVzcG9uc2UpKVxuICAgICAgLnRoZW4oaGFuZGxlSlNPTlJlc3BvbnNlKVxuICAgICAgLmNhdGNoKHRoaXMuI2Vycm9ySGFuZGxlcihtZXRob2QsIHBhdGgpKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgUmVxdWVzdENsaWVudCA9IHJlcXVpcmUoJy4vUmVxdWVzdENsaWVudCcpXG5cbmNvbnN0IGdldE5hbWUgPSAoaWQpID0+IHtcbiAgcmV0dXJuIGlkLnNwbGl0KCctJykubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSkuam9pbignICcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoUHJvdmlkZXIgZXh0ZW5kcyBSZXF1ZXN0Q2xpZW50IHtcbiAgY29uc3RydWN0b3IgKHVwcHksIG9wdHMpIHtcbiAgICBzdXBlcih1cHB5LCBvcHRzKVxuICAgIHRoaXMucHJvdmlkZXIgPSBvcHRzLnByb3ZpZGVyXG4gICAgdGhpcy5pZCA9IHRoaXMucHJvdmlkZXJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9wdHMubmFtZSB8fCBnZXROYW1lKHRoaXMuaWQpXG4gICAgdGhpcy5wbHVnaW5JZCA9IHRoaXMub3B0cy5wbHVnaW5JZFxuICB9XG5cbiAgZmlsZVVybCAoaWQpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5ob3N0bmFtZX0vc2VhcmNoLyR7dGhpcy5pZH0vZ2V0LyR7aWR9YFxuICB9XG5cbiAgc2VhcmNoICh0ZXh0LCBxdWVyaWVzKSB7XG4gICAgcXVlcmllcyA9IHF1ZXJpZXMgPyBgJiR7cXVlcmllc31gIDogJydcbiAgICByZXR1cm4gdGhpcy5nZXQoYHNlYXJjaC8ke3RoaXMuaWR9L2xpc3Q/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh0ZXh0KX0ke3F1ZXJpZXN9YClcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gICNxdWV1ZWQgPSBbXVxuXG4gICNlbWl0dGVyID0gZWUoKVxuXG4gICNpc09wZW4gPSBmYWxzZVxuXG4gICNzb2NrZXRcblxuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIHRoaXMub3B0cyA9IG9wdHNcblxuICAgIGlmICghb3B0cyB8fCBvcHRzLmF1dG9PcGVuICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNPcGVuICgpIHsgcmV0dXJuIHRoaXMuI2lzT3BlbiB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0U29ja2V0JyldICgpIHsgcmV0dXJuIHRoaXMuI3NvY2tldCB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogZ2V0UXVldWVkJyldICgpIHsgcmV0dXJuIHRoaXMuI3F1ZXVlZCB9XG5cbiAgb3BlbiAoKSB7XG4gICAgdGhpcy4jc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLm9wdHMudGFyZ2V0KVxuXG4gICAgdGhpcy4jc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMuI2lzT3BlbiA9IHRydWVcblxuICAgICAgd2hpbGUgKHRoaXMuI3F1ZXVlZC5sZW5ndGggPiAwICYmIHRoaXMuI2lzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuI3F1ZXVlZC5zaGlmdCgpXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLiNpc09wZW4gPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuI3NvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLiNoYW5kbGVNZXNzYWdlXG4gIH1cblxuICBjbG9zZSAoKSB7XG4gICAgdGhpcy4jc29ja2V0Py5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLiNpc09wZW4pIHtcbiAgICAgIHRoaXMuI3F1ZXVlZC5wdXNoKHsgYWN0aW9uLCBwYXlsb2FkIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiNzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3Rpb24sXG4gICAgICBwYXlsb2FkLFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgdGhpcy4jZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuI2VtaXR0ZXIub25jZShhY3Rpb24sIGhhbmRsZXIpXG4gIH1cblxuICAjaGFuZGxlTWVzc2FnZT0gKGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKVxuICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuYWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYSBtb3JlIHJvYnVzdCBlcnJvciBoYW5kbGVyLlxuICAgICAgY29uc29sZS5sb2coZXJyKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIE1hbmFnZXMgY29tbXVuaWNhdGlvbnMgd2l0aCBDb21wYW5pb25cbiAqL1xuXG5jb25zdCBSZXF1ZXN0Q2xpZW50ID0gcmVxdWlyZSgnLi9SZXF1ZXN0Q2xpZW50JylcbmNvbnN0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9Qcm92aWRlcicpXG5jb25zdCBTZWFyY2hQcm92aWRlciA9IHJlcXVpcmUoJy4vU2VhcmNoUHJvdmlkZXInKVxuY29uc3QgU29ja2V0ID0gcmVxdWlyZSgnLi9Tb2NrZXQnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgUmVxdWVzdENsaWVudCxcbiAgUHJvdmlkZXIsXG4gIFNlYXJjaFByb3ZpZGVyLFxuICBTb2NrZXQsXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgYW4gQXN5bmMgd3JhcHBlciBmb3IgTG9jYWxTdG9yYWdlXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldEl0ZW0gPSAoa2V5LCB2YWx1ZSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgIHJlc29sdmUoKVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5nZXRJdGVtID0gKGtleSkgPT4ge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpXG59XG5cbm1vZHVsZS5leHBvcnRzLnJlbW92ZUl0ZW0gPSAoa2V5KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgICByZXNvbHZlKClcbiAgfSlcbn1cbiIsIi8vIFRoaXMgZmlsZSByZXBsYWNlcyBgaW5kZXguanNgIGluIGJ1bmRsZXJzIGxpa2Ugd2VicGFjayBvciBSb2xsdXAsXG4vLyBhY2NvcmRpbmcgdG8gYGJyb3dzZXJgIGNvbmZpZyBpbiBgcGFja2FnZS5qc29uYC5cblxubGV0IHsgdXJsQWxwaGFiZXQgfSA9IHJlcXVpcmUoJy4vdXJsLWFscGhhYmV0L2luZGV4LmNqcycpXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIEFsbCBidW5kbGVycyB3aWxsIHJlbW92ZSB0aGlzIGJsb2NrIGluIHRoZSBwcm9kdWN0aW9uIGJ1bmRsZS5cbiAgaWYgKFxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgJiZcbiAgICB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnUmVhY3QgTmF0aXZlIGRvZXMgbm90IGhhdmUgYSBidWlsdC1pbiBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzIHVzZSBgbmFub2lkL25vbi1zZWN1cmVgLiAnICtcbiAgICAgICAgJ0ZvciBzZWN1cmUgSURzLCBpbXBvcnQgYHJlYWN0LW5hdGl2ZS1nZXQtcmFuZG9tLXZhbHVlc2AgJyArXG4gICAgICAgICdiZWZvcmUgTmFubyBJRC4nXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgbXNDcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0ltcG9ydCBmaWxlIHdpdGggYGlmICghd2luZG93LmNyeXB0bykgd2luZG93LmNyeXB0byA9IHdpbmRvdy5tc0NyeXB0b2AnICtcbiAgICAgICAgJyBiZWZvcmUgaW1wb3J0aW5nIE5hbm8gSUQgdG8gZml4IElFIDExIHN1cHBvcnQnXG4gICAgKVxuICB9XG4gIGlmICh0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdZb3VyIGJyb3dzZXIgZG9lcyBub3QgaGF2ZSBzZWN1cmUgcmFuZG9tIGdlbmVyYXRvci4gJyArXG4gICAgICAgICdJZiB5b3UgZG9u4oCZdCBuZWVkIHVucHJlZGljdGFibGUgSURzLCB5b3UgY2FuIHVzZSBuYW5vaWQvbm9uLXNlY3VyZS4nXG4gICAgKVxuICB9XG59XG5cbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxubGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgc2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIC8vIEZpcnN0LCBhIGJpdG1hc2sgaXMgbmVjZXNzYXJ5IHRvIGdlbmVyYXRlIHRoZSBJRC4gVGhlIGJpdG1hc2sgbWFrZXMgYnl0ZXNcbiAgLy8gdmFsdWVzIGNsb3NlciB0byB0aGUgYWxwaGFiZXQgc2l6ZS4gVGhlIGJpdG1hc2sgY2FsY3VsYXRlcyB0aGUgY2xvc2VzdFxuICAvLyBgMl4zMSAtIDFgIG51bWJlciwgd2hpY2ggZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgLy8gRm9yIGV4YW1wbGUsIHRoZSBiaXRtYXNrIGZvciB0aGUgYWxwaGFiZXQgc2l6ZSAzMCBpcyAzMSAoMDAwMTExMTEpLlxuICAvLyBgTWF0aC5jbHozMmAgaXMgbm90IHVzZWQsIGJlY2F1c2UgaXQgaXMgbm90IGF2YWlsYWJsZSBpbiBicm93c2Vycy5cbiAgbGV0IG1hc2sgPSAoMiA8PCAoTWF0aC5sb2coYWxwaGFiZXQubGVuZ3RoIC0gMSkgLyBNYXRoLkxOMikpIC0gMVxuICAvLyBUaG91Z2gsIHRoZSBiaXRtYXNrIHNvbHV0aW9uIGlzIG5vdCBwZXJmZWN0IHNpbmNlIHRoZSBieXRlcyBleGNlZWRpbmdcbiAgLy8gdGhlIGFscGhhYmV0IHNpemUgYXJlIHJlZnVzZWQuIFRoZXJlZm9yZSwgdG8gcmVsaWFibHkgZ2VuZXJhdGUgdGhlIElELFxuICAvLyB0aGUgcmFuZG9tIGJ5dGVzIHJlZHVuZGFuY3kgaGFzIHRvIGJlIHNhdGlzZmllZC5cblxuICAvLyBOb3RlOiBldmVyeSBoYXJkd2FyZSByYW5kb20gZ2VuZXJhdG9yIGNhbGwgaXMgcGVyZm9ybWFuY2UgZXhwZW5zaXZlLFxuICAvLyBiZWNhdXNlIHRoZSBzeXN0ZW0gY2FsbCBmb3IgZW50cm9weSBjb2xsZWN0aW9uIHRha2VzIGEgbG90IG9mIHRpbWUuXG4gIC8vIFNvLCB0byBhdm9pZCBhZGRpdGlvbmFsIHN5c3RlbSBjYWxscywgZXh0cmEgYnl0ZXMgYXJlIHJlcXVlc3RlZCBpbiBhZHZhbmNlLlxuXG4gIC8vIE5leHQsIGEgc3RlcCBkZXRlcm1pbmVzIGhvdyBtYW55IHJhbmRvbSBieXRlcyB0byBnZW5lcmF0ZS5cbiAgLy8gVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgZ2V0cyBkZWNpZGVkIHVwb24gdGhlIElEIHNpemUsIG1hc2ssXG4gIC8vIGFscGhhYmV0IHNpemUsIGFuZCBtYWdpYyBudW1iZXIgMS42ICh1c2luZyAxLjYgcGVha3MgYXQgcGVyZm9ybWFuY2VcbiAgLy8gYWNjb3JkaW5nIHRvIGJlbmNobWFya3MpLlxuXG4gIC8vIGAtfmYgPT4gTWF0aC5jZWlsKGYpYCBpZiBmIGlzIGEgZmxvYXRcbiAgLy8gYC1+aSA9PiBpICsgMWAgaWYgaSBpcyBhbiBpbnRlZ2VyXG4gIGxldCBzdGVwID0gLX4oKDEuNiAqIG1hc2sgKiBzaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgLy8gQSBjb21wYWN0IGFsdGVybmF0aXZlIGZvciBgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwOyBpKyspYC5cbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAvLyBBZGRpbmcgYHx8ICcnYCByZWZ1c2VzIGEgcmFuZG9tIGJ5dGUgdGhhdCBleGNlZWRzIHRoZSBhbHBoYWJldCBzaXplLlxuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUpID0+IGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxuXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT4ge1xuICBsZXQgaWQgPSAnJ1xuICBsZXQgYnl0ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKVxuXG4gIC8vIEEgY29tcGFjdCBhbHRlcm5hdGl2ZSBmb3IgYGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgaSsrKWAuXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICAvLyBJdCBpcyBpbmNvcnJlY3QgdG8gdXNlIGJ5dGVzIGV4Y2VlZGluZyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICAvLyBUaGUgZm9sbG93aW5nIG1hc2sgcmVkdWNlcyB0aGUgcmFuZG9tIGJ5dGUgaW4gdGhlIDAtMjU1IHZhbHVlXG4gICAgLy8gcmFuZ2UgdG8gdGhlIDAtNjMgdmFsdWUgcmFuZ2UuIFRoZXJlZm9yZSwgYWRkaW5nIGhhY2tzLCBzdWNoXG4gICAgLy8gYXMgZW1wdHkgc3RyaW5nIGZhbGxiYWNrIG9yIG1hZ2ljIG51bWJlcnMsIGlzIHVubmVjY2Vzc2FyeSBiZWNhdXNlXG4gICAgLy8gdGhlIGJpdG1hc2sgdHJpbXMgYnl0ZXMgZG93biB0byB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICBsZXQgYnl0ZSA9IGJ5dGVzW3NpemVdICYgNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICAvLyBgMC05YS16YFxuICAgICAgaWQgKz0gYnl0ZS50b1N0cmluZygzNilcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mikge1xuICAgICAgLy8gYEEtWmBcbiAgICAgIGlkICs9IChieXRlIC0gMjYpLnRvU3RyaW5nKDM2KS50b1VwcGVyQ2FzZSgpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjMpIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiLy8gVGhpcyBhbHBoYWJldCB1c2VzIGBBLVphLXowLTlfLWAgc3ltYm9scy4gVGhlIGdlbmV0aWMgYWxnb3JpdGhtIGhlbHBlZFxuLy8gb3B0aW1pemUgdGhlIGd6aXAgY29tcHJlc3Npb24gZm9yIHRoaXMgYWxwaGFiZXQuXG5sZXQgdXJsQWxwaGFiZXQgPVxuICAnTW9kdWxlU3ltYmhhc093blByLTAxMjM0NTY3ODlBQkNERUZHSE5SVmZnY3RpVXZ6X0txWVRKa0x4cFpYSWpRVydcblxubW9kdWxlLmV4cG9ydHMgPSB7IHVybEFscGhhYmV0IH1cbiIsIi8qKlxuICogQ29yZSBwbHVnaW4gbG9naWMgdGhhdCBhbGwgcGx1Z2lucyBzaGFyZS5cbiAqXG4gKiBCYXNlUGx1Z2luIGRvZXMgbm90IGNvbnRhaW4gRE9NIHJlbmRlcmluZyBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgcGx1Z2luc1xuICogd2l0aG91dCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIFNlZSBgUGx1Z2luYCBmb3IgdGhlIGV4dGVuZGVkIHZlcnNpb24gd2l0aCBQcmVhY3QgcmVuZGVyaW5nIGZvciBpbnRlcmZhY2VzLlxuICovXG5cbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvVHJhbnNsYXRvcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQmFzZVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLnVwcHkgPSB1cHB5XG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICB9XG5cbiAgZ2V0UGx1Z2luU3RhdGUgKCkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICByZXR1cm4gcGx1Z2luc1t0aGlzLmlkXSB8fCB7fVxuICB9XG5cbiAgc2V0UGx1Z2luU3RhdGUgKHVwZGF0ZSkge1xuICAgIGNvbnN0IHsgcGx1Z2lucyB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgIFt0aGlzLmlkXToge1xuICAgICAgICAgIC4uLnBsdWdpbnNbdGhpcy5pZF0sXG4gICAgICAgICAgLi4udXBkYXRlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHsgLi4udGhpcy5vcHRzLCAuLi5uZXdPcHRzIH1cbiAgICB0aGlzLnNldFBsdWdpblN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgICB0aGlzLmkxOG5Jbml0KClcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy51cHB5LmxvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5zZXRQbHVnaW5TdGF0ZSgpIC8vIHNvIHRoYXQgVUkgcmUtcmVuZGVycyBhbmQgd2Ugc2VlIHRoZSB1cGRhdGVkIGxvY2FsZVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZGFibGUgbWV0aG9kc1xuICAgKiA9PT09PT09PT09PT09PT09PT1cbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgaGVyZSB0byBzZXJ2ZSBhcyBhbiBvdmVydmlldyBvZiB0aGUgZXh0ZW5kYWJsZSBtZXRob2RzIGFzIHdlbGwgYXNcbiAgICogbWFraW5nIHRoZW0gbm90IGNvbmRpdGlvbmFsIGluIHVzZSwgc3VjaCBhcyBgaWYgKHRoaXMuYWZ0ZXJVcGRhdGUpYC5cbiAgICovXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWRkVGFyZ2V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4dGVuZCB0aGUgYWRkVGFyZ2V0IG1ldGhvZCB0byBhZGQgeW91ciBwbHVnaW4gdG8gYW5vdGhlciBwbHVnaW5cXCdzIHRhcmdldCcpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBpbnN0YWxsICgpIHt9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdW5pbnN0YWxsICgpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHBsdWdpbiBpcyBtb3VudGVkLCB3aGV0aGVyIGluIERPTSBvciBpbnRvIGFub3RoZXIgcGx1Z2luLlxuICAgKiBOZWVkZWQgYmVjYXVzZSBzb21ldGltZXMgcGx1Z2lucyBhcmUgbW91bnRlZCBzZXBhcmF0ZWx5L2FmdGVyIGBpbnN0YWxsYCxcbiAgICogc28gdGhpcy5lbCBhbmQgdGhpcy5wYXJlbnQgbWlnaHQgbm90IGJlIGF2YWlsYWJsZSBpbiBgaW5zdGFsbGAuXG4gICAqIFRoaXMgaXMgdGhlIGNhc2Ugd2l0aCBAdXBweS9yZWFjdCBwbHVnaW5zLCBmb3IgZXhhbXBsZS5cbiAgICovXG4gIHJlbmRlciAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgdXBkYXRlICgpIHt9XG5cbiAgLy8gQ2FsbGVkIGFmdGVyIGV2ZXJ5IHN0YXRlIHVwZGF0ZSwgYWZ0ZXIgZXZlcnl0aGluZydzIG1vdW50ZWQuIERlYm91bmNlZC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgYWZ0ZXJVcGRhdGUgKCkge31cbn1cbiIsImNvbnN0IHsgcmVuZGVyLCBoIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgZmluZERPTUVsZW1lbnQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZmluZERPTUVsZW1lbnQnKVxuXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLyoqXG4gKiBEZWZlciBhIGZyZXF1ZW50IGNhbGwgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0geygpID0+IFR9IGZuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UgKGZuKSB7XG4gIGxldCBjYWxsaW5nID0gbnVsbFxuICBsZXQgbGF0ZXN0QXJncyA9IG51bGxcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgbGF0ZXN0QXJncyA9IGFyZ3NcbiAgICBpZiAoIWNhbGxpbmcpIHtcbiAgICAgIGNhbGxpbmcgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGluZyA9IG51bGxcbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCBgYXJnc2AgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHRoZSBtb3N0XG4gICAgICAgIC8vIHJlY2VudCBzdGF0ZSwgaWYgbXVsdGlwbGUgY2FsbHMgaGFwcGVuZWQgc2luY2UgdGhpcyB0YXNrXG4gICAgICAgIC8vIHdhcyBxdWV1ZWQuIFNvIHdlIHVzZSB0aGUgYGxhdGVzdEFyZ3NgLCB3aGljaCBkZWZpbml0ZWx5XG4gICAgICAgIC8vIGlzIHRoZSBtb3N0IHJlY2VudCBjYWxsLlxuICAgICAgICByZXR1cm4gZm4oLi4ubGF0ZXN0QXJncylcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBjYWxsaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBVSVBsdWdpbiBpcyB0aGUgZXh0ZW5kZWQgdmVyc2lvbiBvZiBCYXNlUGx1Z2luIHRvIGluY29ycG9yYXRlIHJlbmRlcmluZyB3aXRoIFByZWFjdC5cbiAqIFVzZSB0aGlzIGZvciBwbHVnaW5zIHRoYXQgbmVlZCBhIHVzZXIgaW50ZXJmYWNlLlxuICpcbiAqIEZvciBwbHVnaW5zIHdpdGhvdXQgYW4gdXNlciBpbnRlcmZhY2UsIHNlZSBCYXNlUGx1Z2luLlxuICovXG5jbGFzcyBVSVBsdWdpbiBleHRlbmRzIEJhc2VQbHVnaW4ge1xuICAjdXBkYXRlVUlcblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLmlzVGFyZ2V0RE9NRWwgPSB0cnVlXG4gICAgICAvLyBXaGVuIHRhcmdldCBpcyA8Ym9keT4gd2l0aCBhIHNpbmdsZSA8ZGl2PiBlbGVtZW50LFxuICAgICAgLy8gUHJlYWN0IHRoaW5rcyBpdOKAmXMgdGhlIFVwcHkgcm9vdCBlbGVtZW50IGluIHRoZXJlIHdoZW4gZG9pbmcgYSBkaWZmLFxuICAgICAgLy8gYW5kIGRlc3Ryb3lzIGl0LiBTbyB3ZSBhcmUgY3JlYXRpbmcgYSBmcmFnbWVudCAoY291bGQgYmUgZW1wdHkgZGl2KVxuICAgICAgY29uc3QgdXBweVJvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cbiAgICAgIC8vIEFQSSBmb3IgcGx1Z2lucyB0aGF0IHJlcXVpcmUgYSBzeW5jaHJvbm91cyByZXJlbmRlci5cbiAgICAgIHRoaXMuI3VwZGF0ZVVJID0gZGVib3VuY2UoKHN0YXRlKSA9PiB7XG4gICAgICAgIC8vIHBsdWdpbiBjb3VsZCBiZSByZW1vdmVkLCBidXQgdGhpcy5yZXJlbmRlciBpcyBkZWJvdW5jZWQgYmVsb3csXG4gICAgICAgIC8vIHNvIGl0IGNvdWxkIHN0aWxsIGJlIGNhbGxlZCBldmVuIGFmdGVyIHVwcHkucmVtb3ZlUGx1Z2luIG9yIHVwcHkuY2xvc2VcbiAgICAgICAgLy8gaGVuY2UgdGhlIGNoZWNrXG4gICAgICAgIGlmICghdGhpcy51cHB5LmdldFBsdWdpbih0aGlzLmlkKSkgcmV0dXJuXG4gICAgICAgIHJlbmRlcih0aGlzLnJlbmRlcihzdGF0ZSksIHVwcHlSb290RWxlbWVudClcbiAgICAgICAgdGhpcy5hZnRlclVwZGF0ZSgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gYSBET00gZWxlbWVudCAnJHt0YXJnZXR9J2ApXG5cbiAgICAgIGlmICh0aGlzLm9wdHMucmVwbGFjZVRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgLy8gRG9pbmcgcmVuZGVyKGgobnVsbCksIHRhcmdldEVsZW1lbnQpLCB3aGljaCBzaG91bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGEgYmV0dGVyIHdheSwgc2luY2UgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IG5lZWQgdG8gZG8gYWRkaXRpb25hbCBjbGVhbnVwIHdoZW4gaXQgaXMgcmVtb3ZlZCxcbiAgICAgICAgLy8gc3RvcHBlZCB3b3JraW5nIOKAlCBQcmVhY3QganVzdCBhZGRzIG51bGwgaW50byB0YXJnZXQsIG5vdCByZXBsYWNpbmdcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuICAgICAgfVxuXG4gICAgICByZW5kZXIodGhpcy5yZW5kZXIodGhpcy51cHB5LmdldFN0YXRlKCkpLCB1cHB5Um9vdEVsZW1lbnQpXG4gICAgICB0aGlzLmVsID0gdXBweVJvb3RFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHVwcHlSb290RWxlbWVudClcblxuICAgICAgdGhpcy5vbk1vdW50KClcblxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0UGx1Z2luXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCBpbnN0YW5jZW9mIFVJUGx1Z2luKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gKmluc3RhbmNlKlxuICAgICAgdGFyZ2V0UGx1Z2luID0gdGFyZ2V0XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUYXJnZXRpbmcgYSBwbHVnaW4gdHlwZVxuICAgICAgY29uc3QgVGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgcGx1Z2luIGluc3RhbmNlLlxuICAgICAgdGhpcy51cHB5Lml0ZXJhdGVQbHVnaW5zKHAgPT4ge1xuICAgICAgICBpZiAocCBpbnN0YW5jZW9mIFRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFBsdWdpbiA9IHBcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UGx1Z2luKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKGBJbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX0gdG8gJHt0YXJnZXRQbHVnaW4uaWR9YClcbiAgICAgIHRoaXMucGFyZW50ID0gdGFyZ2V0UGx1Z2luXG4gICAgICB0aGlzLmVsID0gdGFyZ2V0UGx1Z2luLmFkZFRhcmdldChwbHVnaW4pXG5cbiAgICAgIHRoaXMub25Nb3VudCgpXG4gICAgICByZXR1cm4gdGhpcy5lbFxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coYE5vdCBpbnN0YWxsaW5nICR7Y2FsbGVyUGx1Z2luTmFtZX1gKVxuXG4gICAgbGV0IG1lc3NhZ2UgPSBgSW52YWxpZCB0YXJnZXQgb3B0aW9uIGdpdmVuIHRvICR7Y2FsbGVyUGx1Z2luTmFtZX0uYFxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlICs9ICcgVGhlIGdpdmVuIHRhcmdldCBpcyBub3QgYSBQbHVnaW4gY2xhc3MuICdcbiAgICAgICAgKyAnUGxlYXNlIGNoZWNrIHRoYXQgeW91XFwncmUgbm90IHNwZWNpZnlpbmcgYSBSZWFjdCBDb21wb25lbnQgaW5zdGVhZCBvZiBhIHBsdWdpbi4gJ1xuICAgICAgICArICdJZiB5b3UgYXJlIHVzaW5nIEB1cHB5LyogcGFja2FnZXMgZGlyZWN0bHksIG1ha2Ugc3VyZSB5b3UgaGF2ZSBvbmx5IDEgdmVyc2lvbiBvZiBAdXBweS9jb3JlIGluc3RhbGxlZDogJ1xuICAgICAgICArICdydW4gYG5wbSBscyBAdXBweS9jb3JlYCBvbiB0aGUgY29tbWFuZCBsaW5lIGFuZCB2ZXJpZnkgdGhhdCBhbGwgdGhlIHZlcnNpb25zIG1hdGNoIGFuZCBhcmUgZGVkdXBlZCBjb3JyZWN0bHkuJ1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlICs9ICdJZiB5b3UgbWVhbnQgdG8gdGFyZ2V0IGFuIEhUTUwgZWxlbWVudCwgcGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBlbGVtZW50IGV4aXN0cy4gJ1xuICAgICAgICArICdDaGVjayB0aGF0IHRoZSA8c2NyaXB0PiB0YWcgaW5pdGlhbGl6aW5nIFVwcHkgaXMgcmlnaHQgYmVmb3JlIHRoZSBjbG9zaW5nIDwvYm9keT4gdGFnIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UuICdcbiAgICAgICAgKyAnKHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHJhbnNsb2FkaXQvdXBweS9pc3N1ZXMvMTA0MilcXG5cXG4nXG4gICAgICAgICsgJ0lmIHlvdSBtZWFudCB0byB0YXJnZXQgYSBwbHVnaW4sIHBsZWFzZSBjb25maXJtIHRoYXQgeW91ciBgaW1wb3J0YCBzdGF0ZW1lbnRzIG9yIGByZXF1aXJlYCBjYWxscyBhcmUgY29ycmVjdC4nXG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICB9XG5cbiAgdXBkYXRlIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLmVsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuI3VwZGF0ZVVJPy4oc3RhdGUpXG4gICAgfVxuICB9XG5cbiAgdW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuaXNUYXJnZXRET01FbCkge1xuICAgICAgdGhpcy5lbD8ucmVtb3ZlKClcbiAgICB9XG4gICAgdGhpcy5vblVubW91bnQoKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgb25Nb3VudCAoKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG9uVW5tb3VudCAoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJUGx1Z2luXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lIChmaWxlVHlwZSwgZmlsZURlc2NyaXB0b3IpIHtcbiAgaWYgKGZpbGVEZXNjcmlwdG9yLm5hbWUpIHtcbiAgICByZXR1cm4gZmlsZURlc2NyaXB0b3IubmFtZVxuICB9XG5cbiAgaWYgKGZpbGVUeXBlLnNwbGl0KCcvJylbMF0gPT09ICdpbWFnZScpIHtcbiAgICByZXR1cm4gYCR7ZmlsZVR5cGUuc3BsaXQoJy8nKVswXX0uJHtmaWxlVHlwZS5zcGxpdCgnLycpWzFdfWBcbiAgfVxuXG4gIHJldHVybiAnbm9uYW1lJ1xufVxuIiwiLyogZ2xvYmFsIEFnZ3JlZ2F0ZUVycm9yICovXG5jb25zdCBUcmFuc2xhdG9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1RyYW5zbGF0b3InKVxuY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5jb25zdCB7IG5hbm9pZCB9ID0gcmVxdWlyZSgnbmFub2lkJylcbmNvbnN0IHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJylcbmNvbnN0IHByZXR0aWVyQnl0ZXMgPSByZXF1aXJlKCdAdHJhbnNsb2FkaXQvcHJldHRpZXItYnl0ZXMnKVxuY29uc3QgbWF0Y2ggPSByZXF1aXJlKCdtaW1lLW1hdGNoJylcbmNvbnN0IERlZmF1bHRTdG9yZSA9IHJlcXVpcmUoJ0B1cHB5L3N0b3JlLWRlZmF1bHQnKVxuY29uc3QgZ2V0RmlsZVR5cGUgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0RmlsZVR5cGUnKVxuY29uc3QgZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24nKVxuY29uc3QgZ2VuZXJhdGVGaWxlSUQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2VuZXJhdGVGaWxlSUQnKVxuY29uc3Qgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyA9IHJlcXVpcmUoJy4vc3VwcG9ydHNVcGxvYWRQcm9ncmVzcycpXG5jb25zdCBnZXRGaWxlTmFtZSA9IHJlcXVpcmUoJy4vZ2V0RmlsZU5hbWUnKVxuY29uc3QgeyBqdXN0RXJyb3JzTG9nZ2VyLCBkZWJ1Z0xvZ2dlciB9ID0gcmVxdWlyZSgnLi9sb2dnZXJzJylcbmNvbnN0IFVJUGx1Z2luID0gcmVxdWlyZSgnLi9VSVBsdWdpbicpXG5jb25zdCBCYXNlUGx1Z2luID0gcmVxdWlyZSgnLi9CYXNlUGx1Z2luJylcblxuLy8gRXhwb3J0ZWQgZnJvbSBoZXJlLlxuY2xhc3MgUmVzdHJpY3Rpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IgKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKVxuICAgIHRoaXMuaXNSZXN0cmljdGlvbiA9IHRydWVcbiAgfVxufVxuaWYgKHR5cGVvZiBBZ2dyZWdhdGVFcnJvciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWdsb2JhbC1hc3NpZ25cbiAgZ2xvYmFsVGhpcy5BZ2dyZWdhdGVFcnJvciA9IGNsYXNzIEFnZ3JlZ2F0ZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yIChtZXNzYWdlLCBlcnJvcnMpIHtcbiAgICAgIHN1cGVyKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVycm9ycyA9IGVycm9yc1xuICAgIH1cbiAgfVxufVxuY2xhc3MgQWdncmVnYXRlUmVzdHJpY3Rpb25FcnJvciBleHRlbmRzIEFnZ3JlZ2F0ZUVycm9yIHtcbiAgY29uc3RydWN0b3IgKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKVxuICAgIHRoaXMuaXNSZXN0cmljdGlvbiA9IHRydWVcbiAgfVxufVxuXG4vKipcbiAqIFVwcHkgQ29yZSBtb2R1bGUuXG4gKiBNYW5hZ2VzIHBsdWdpbnMsIHN0YXRlIHVwZGF0ZXMsIGFjdHMgYXMgYW4gZXZlbnQgYnVzLFxuICogYWRkcy9yZW1vdmVzIGZpbGVzIGFuZCBtZXRhZGF0YS5cbiAqL1xuY2xhc3MgVXBweSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBnbG9iYWwtcmVxdWlyZVxuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICAvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIEJhc2VQbHVnaW5bXT59ICovXG4gICNwbHVnaW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICNzdG9yZVVuc3Vic2NyaWJlXG5cbiAgI2VtaXR0ZXIgPSBlZSgpXG5cbiAgI3ByZVByb2Nlc3NvcnMgPSBuZXcgU2V0KClcblxuICAjdXBsb2FkZXJzID0gbmV3IFNldCgpXG5cbiAgI3Bvc3RQcm9jZXNzb3JzID0gbmV3IFNldCgpXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlIFVwcHlcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMg4oCUIFVwcHkgb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIGFkZEJ1bGtGaWxlc0ZhaWxlZDoge1xuICAgICAgICAgIDA6ICdGYWlsZWQgdG8gYWRkICV7c21hcnRfY291bnR9IGZpbGUgZHVlIHRvIGFuIGludGVybmFsIGVycm9yJyxcbiAgICAgICAgICAxOiAnRmFpbGVkIHRvIGFkZCAle3NtYXJ0X2NvdW50fSBmaWxlcyBkdWUgdG8gaW50ZXJuYWwgZXJyb3JzJyxcbiAgICAgICAgfSxcbiAgICAgICAgeW91Q2FuT25seVVwbG9hZFg6IHtcbiAgICAgICAgICAwOiAnWW91IGNhbiBvbmx5IHVwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnWW91IGNhbiBvbmx5IHVwbG9hZCAle3NtYXJ0X2NvdW50fSBmaWxlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHlvdUhhdmVUb0F0TGVhc3RTZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1lvdSBoYXZlIHRvIHNlbGVjdCBhdCBsZWFzdCAle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgZXhjZWVkc1NpemU6ICcle2ZpbGV9IGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIHNpemUgb2YgJXtzaXplfScsXG4gICAgICAgIG1pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZDogJ01pc3NpbmcgcmVxdWlyZWQgbWV0YSBmaWVsZHMnLFxuICAgICAgICBtaXNzaW5nUmVxdWlyZWRNZXRhRmllbGRPbkZpbGU6ICdNaXNzaW5nIHJlcXVpcmVkIG1ldGEgZmllbGRzIGluICV7ZmlsZU5hbWV9JyxcbiAgICAgICAgaW5mZXJpb3JTaXplOiAnVGhpcyBmaWxlIGlzIHNtYWxsZXIgdGhhbiB0aGUgYWxsb3dlZCBzaXplIG9mICV7c2l6ZX0nLFxuICAgICAgICB5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzOiAnWW91IGNhbiBvbmx5IHVwbG9hZDogJXt0eXBlc30nLFxuICAgICAgICBub05ld0FscmVhZHlVcGxvYWRpbmc6ICdDYW5ub3QgYWRkIG5ldyBmaWxlczogYWxyZWFkeSB1cGxvYWRpbmcnLFxuICAgICAgICBub0R1cGxpY2F0ZXM6ICdDYW5ub3QgYWRkIHRoZSBkdXBsaWNhdGUgZmlsZSBcXCcle2ZpbGVOYW1lfVxcJywgaXQgYWxyZWFkeSBleGlzdHMnLFxuICAgICAgICBjb21wYW5pb25FcnJvcjogJ0Nvbm5lY3Rpb24gd2l0aCBDb21wYW5pb24gZmFpbGVkJyxcbiAgICAgICAgY29tcGFuaW9uVW5hdXRob3JpemVIaW50OiAnVG8gdW5hdXRob3JpemUgdG8geW91ciAle3Byb3ZpZGVyfSBhY2NvdW50LCBwbGVhc2UgZ28gdG8gJXt1cmx9JyxcbiAgICAgICAgZmFpbGVkVG9VcGxvYWQ6ICdGYWlsZWQgdG8gdXBsb2FkICV7ZmlsZX0nLFxuICAgICAgICBub0ludGVybmV0Q29ubmVjdGlvbjogJ05vIEludGVybmV0IGNvbm5lY3Rpb24nLFxuICAgICAgICBjb25uZWN0ZWRUb0ludGVybmV0OiAnQ29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldCcsXG4gICAgICAgIC8vIFN0cmluZ3MgZm9yIHJlbW90ZSBwcm92aWRlcnNcbiAgICAgICAgbm9GaWxlc0ZvdW5kOiAnWW91IGhhdmUgbm8gZmlsZXMgb3IgZm9sZGVycyBoZXJlJyxcbiAgICAgICAgc2VsZWN0WDoge1xuICAgICAgICAgIDA6ICdTZWxlY3QgJXtzbWFydF9jb3VudH0nLFxuICAgICAgICAgIDE6ICdTZWxlY3QgJXtzbWFydF9jb3VudH0nLFxuICAgICAgICB9LFxuICAgICAgICBhbGxGaWxlc0Zyb21Gb2xkZXJOYW1lZDogJ0FsbCBmaWxlcyBmcm9tIGZvbGRlciAle25hbWV9JyxcbiAgICAgICAgb3BlbkZvbGRlck5hbWVkOiAnT3BlbiBmb2xkZXIgJXtuYW1lfScsXG4gICAgICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgICAgIGxvZ091dDogJ0xvZyBvdXQnLFxuICAgICAgICBmaWx0ZXI6ICdGaWx0ZXInLFxuICAgICAgICByZXNldEZpbHRlcjogJ1Jlc2V0IGZpbHRlcicsXG4gICAgICAgIGxvYWRpbmc6ICdMb2FkaW5nLi4uJyxcbiAgICAgICAgYXV0aGVudGljYXRlV2l0aFRpdGxlOiAnUGxlYXNlIGF1dGhlbnRpY2F0ZSB3aXRoICV7cGx1Z2luTmFtZX0gdG8gc2VsZWN0IGZpbGVzJyxcbiAgICAgICAgYXV0aGVudGljYXRlV2l0aDogJ0Nvbm5lY3QgdG8gJXtwbHVnaW5OYW1lfScsXG4gICAgICAgIHNlYXJjaEltYWdlczogJ1NlYXJjaCBmb3IgaW1hZ2VzJyxcbiAgICAgICAgZW50ZXJUZXh0VG9TZWFyY2g6ICdFbnRlciB0ZXh0IHRvIHNlYXJjaCBmb3IgaW1hZ2VzJyxcbiAgICAgICAgYmFja1RvU2VhcmNoOiAnQmFjayB0byBTZWFyY2gnLFxuICAgICAgICBlbXB0eUZvbGRlckFkZGVkOiAnTm8gZmlsZXMgd2VyZSBhZGRlZCBmcm9tIGVtcHR5IGZvbGRlcicsXG4gICAgICAgIGZvbGRlckFscmVhZHlBZGRlZDogJ1RoZSBmb2xkZXIgXCIle2ZvbGRlcn1cIiB3YXMgYWxyZWFkeSBhZGRlZCcsXG4gICAgICAgIGZvbGRlckFkZGVkOiB7XG4gICAgICAgICAgMDogJ0FkZGVkICV7c21hcnRfY291bnR9IGZpbGUgZnJvbSAle2ZvbGRlcn0nLFxuICAgICAgICAgIDE6ICdBZGRlZCAle3NtYXJ0X2NvdW50fSBmaWxlcyBmcm9tICV7Zm9sZGVyfScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1cblxuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgaWQ6ICd1cHB5JyxcbiAgICAgIGF1dG9Qcm9jZWVkOiBmYWxzZSxcbiAgICAgIGFsbG93TXVsdGlwbGVVcGxvYWRzOiB0cnVlLFxuICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgcmVzdHJpY3Rpb25zOiB7XG4gICAgICAgIG1heEZpbGVTaXplOiBudWxsLFxuICAgICAgICBtaW5GaWxlU2l6ZTogbnVsbCxcbiAgICAgICAgbWF4VG90YWxGaWxlU2l6ZTogbnVsbCxcbiAgICAgICAgbWF4TnVtYmVyT2ZGaWxlczogbnVsbCxcbiAgICAgICAgbWluTnVtYmVyT2ZGaWxlczogbnVsbCxcbiAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogbnVsbCxcbiAgICAgICAgcmVxdWlyZWRNZXRhRmllbGRzOiBbXSxcbiAgICAgIH0sXG4gICAgICBtZXRhOiB7fSxcbiAgICAgIG9uQmVmb3JlRmlsZUFkZGVkOiAoY3VycmVudEZpbGUpID0+IGN1cnJlbnRGaWxlLFxuICAgICAgb25CZWZvcmVVcGxvYWQ6IChmaWxlcykgPT4gZmlsZXMsXG4gICAgICBzdG9yZTogRGVmYXVsdFN0b3JlKCksXG4gICAgICBsb2dnZXI6IGp1c3RFcnJvcnNMb2dnZXIsXG4gICAgICBpbmZvVGltZW91dDogNTAwMCxcbiAgICB9XG5cbiAgICAvLyBNZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlcixcbiAgICAvLyBtYWtpbmcgc3VyZSB0byBtZXJnZSByZXN0cmljdGlvbnMgdG9vXG4gICAgdGhpcy5vcHRzID0ge1xuICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5vcHRzLFxuICAgICAgcmVzdHJpY3Rpb25zOiB7XG4gICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLnJlc3RyaWN0aW9ucyxcbiAgICAgICAgLi4uKG9wdHMgJiYgb3B0cy5yZXN0cmljdGlvbnMpLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICAvLyBTdXBwb3J0IGRlYnVnOiB0cnVlIGZvciBiYWNrd2FyZHMtY29tcGF0YWJpbGl0eSwgdW5sZXNzIGxvZ2dlciBpcyBzZXQgaW4gb3B0c1xuICAgIC8vIG9wdHMgaW5zdGVhZCBvZiB0aGlzLm9wdHMgdG8gYXZvaWQgY29tcGFyaW5nIG9iamVjdHMg4oCUIHdlIHNldCBsb2dnZXI6IGp1c3RFcnJvcnNMb2dnZXIgaW4gZGVmYXVsdE9wdGlvbnNcbiAgICBpZiAob3B0cyAmJiBvcHRzLmxvZ2dlciAmJiBvcHRzLmRlYnVnKSB7XG4gICAgICB0aGlzLmxvZygnWW91IGFyZSB1c2luZyBhIGN1c3RvbSBgbG9nZ2VyYCwgYnV0IGFsc28gc2V0IGBkZWJ1ZzogdHJ1ZWAsIHdoaWNoIHVzZXMgYnVpbHQtaW4gbG9nZ2VyIHRvIG91dHB1dCBsb2dzIHRvIGNvbnNvbGUuIElnbm9yaW5nIGBkZWJ1ZzogdHJ1ZWAgYW5kIHVzaW5nIHlvdXIgY3VzdG9tIGBsb2dnZXJgLicsICd3YXJuaW5nJylcbiAgICB9IGVsc2UgaWYgKG9wdHMgJiYgb3B0cy5kZWJ1Zykge1xuICAgICAgdGhpcy5vcHRzLmxvZ2dlciA9IGRlYnVnTG9nZ2VyXG4gICAgfVxuXG4gICAgdGhpcy5sb2coYFVzaW5nIENvcmUgdiR7dGhpcy5jb25zdHJ1Y3Rvci5WRVJTSU9OfWApXG5cbiAgICBpZiAodGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzXG4gICAgICAgICYmIHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dlZEZpbGVUeXBlcyAhPT0gbnVsbFxuICAgICAgICAmJiAhQXJyYXkuaXNBcnJheSh0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXNgIG11c3QgYmUgYW4gYXJyYXknKVxuICAgIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgLy8gX19fV2h5IHRocm90dGxlIGF0IDUwMG1zP1xuICAgIC8vICAgIC0gV2UgbXVzdCB0aHJvdHRsZSBhdCA+MjUwbXMgZm9yIHN1cGVyZm9jdXMgaW4gRGFzaGJvYXJkIHRvIHdvcmsgd2VsbFxuICAgIC8vICAgIChiZWNhdXNlIGFuaW1hdGlvbiB0YWtlcyAwLjI1cywgYW5kIHdlIHdhbnQgdG8gd2FpdCBmb3IgYWxsIGFuaW1hdGlvbnMgdG8gYmUgb3ZlciBiZWZvcmUgcmVmb2N1c2luZykuXG4gICAgLy8gICAgW1ByYWN0aWNhbCBDaGVja106IGlmIHRob3R0bGUgaXMgYXQgMTAwbXMsIHRoZW4gaWYgeW91IGFyZSB1cGxvYWRpbmcgYSBmaWxlLFxuICAgIC8vICAgIGFuZCBjbGljayAnQUREIE1PUkUgRklMRVMnLCAtIGZvY3VzIHdvbid0IGFjdGl2YXRlIGluIEZpcmVmb3guXG4gICAgLy8gICAgLSBXZSBtdXN0IHRocm90dGxlIGF0IGFyb3VuZCA+NTAwbXMgdG8gYXZvaWQgcGVyZm9ybWFuY2UgbGFncy5cbiAgICAvLyAgICBbUHJhY3RpY2FsIENoZWNrXSBGaXJlZm94LCB0cnkgdG8gdXBsb2FkIGEgYmlnIGZpbGUgZm9yIGEgcHJvbG9uZ2VkIHBlcmlvZCBvZiB0aW1lLiBMYXB0b3Agd2lsbCBzdGFydCB0byBoZWF0IHVwLlxuICAgIHRoaXMuY2FsY3VsYXRlUHJvZ3Jlc3MgPSB0aHJvdHRsZSh0aGlzLmNhbGN1bGF0ZVByb2dyZXNzLmJpbmQodGhpcyksIDUwMCwgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZSB9KVxuXG4gICAgdGhpcy5zdG9yZSA9IHRoaXMub3B0cy5zdG9yZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGx1Z2luczoge30sXG4gICAgICBmaWxlczoge30sXG4gICAgICBjdXJyZW50VXBsb2Fkczoge30sXG4gICAgICBhbGxvd05ld1VwbG9hZDogdHJ1ZSxcbiAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICB1cGxvYWRQcm9ncmVzczogc3VwcG9ydHNVcGxvYWRQcm9ncmVzcygpLFxuICAgICAgICBpbmRpdmlkdWFsQ2FuY2VsbGF0aW9uOiB0cnVlLFxuICAgICAgICByZXN1bWFibGVVcGxvYWRzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgbWV0YTogeyAuLi50aGlzLm9wdHMubWV0YSB9LFxuICAgICAgaW5mbzogW10sXG4gICAgICByZWNvdmVyZWRTdGF0ZTogbnVsbCxcbiAgICB9KVxuXG4gICAgdGhpcy4jc3RvcmVVbnN1YnNjcmliZSA9IHRoaXMuc3RvcmUuc3Vic2NyaWJlKChwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnc3RhdGUtdXBkYXRlJywgcHJldlN0YXRlLCBuZXh0U3RhdGUsIHBhdGNoKVxuICAgICAgdGhpcy51cGRhdGVBbGwobmV4dFN0YXRlKVxuICAgIH0pXG5cbiAgICAvLyBFeHBvc2luZyB1cHB5IG9iamVjdCBvbiB3aW5kb3cgZm9yIGRlYnVnZ2luZyBhbmQgdGVzdGluZ1xuICAgIGlmICh0aGlzLm9wdHMuZGVidWcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvd1t0aGlzLm9wdHMuaWRdID0gdGhpc1xuICAgIH1cblxuICAgIHRoaXMuI2FkZExpc3RlbmVycygpXG4gIH1cblxuICBlbWl0IChldmVudCwgLi4uYXJncykge1xuICAgIHRoaXMuI2VtaXR0ZXIuZW1pdChldmVudCwgLi4uYXJncylcbiAgfVxuXG4gIG9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9uKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgb25jZSAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy4jZW1pdHRlci5vbmNlKGV2ZW50LCBjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgb2ZmIChldmVudCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLiNlbWl0dGVyLm9mZihldmVudCwgY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG9uIGFsbCBwbHVnaW5zIGFuZCBydW4gYHVwZGF0ZWAgb24gdGhlbS5cbiAgICogQ2FsbGVkIGVhY2ggdGltZSBzdGF0ZSBjaGFuZ2VzLlxuICAgKlxuICAgKi9cbiAgdXBkYXRlQWxsIChzdGF0ZSkge1xuICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMocGx1Z2luID0+IHtcbiAgICAgIHBsdWdpbi51cGRhdGUoc3RhdGUpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHN0YXRlIHdpdGggYSBwYXRjaFxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF0Y2gge2ZvbzogJ2Jhcid9XG4gICAqL1xuICBzZXRTdGF0ZSAocGF0Y2gpIHtcbiAgICB0aGlzLnN0b3JlLnNldFN0YXRlKHBhdGNoKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHJldHVybnMge29iamVjdH1cbiAgICovXG4gIGdldFN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRTdGF0ZSgpXG4gIH1cblxuICAvKipcbiAgICogQmFjayBjb21wYXQgZm9yIHdoZW4gdXBweS5zdGF0ZSBpcyB1c2VkIGluc3RlYWQgb2YgdXBweS5nZXRTdGF0ZSgpLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgZ2V0IHN0YXRlICgpIHtcbiAgICAvLyBIZXJlLCBzdGF0ZSBpcyBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuICAgIHJldHVybiB0aGlzLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGhhbmQgdG8gc2V0IHN0YXRlIGZvciBhIHNwZWNpZmljIGZpbGUuXG4gICAqL1xuICBzZXRGaWxlU3RhdGUgKGZpbGVJRCwgc3RhdGUpIHtcbiAgICBpZiAoIXRoaXMuZ2V0U3RhdGUoKS5maWxlc1tmaWxlSURdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbuKAmXQgc2V0IHN0YXRlIGZvciAke2ZpbGVJRH0gKHRoZSBmaWxlIGNvdWxkIGhhdmUgYmVlbiByZW1vdmVkKWApXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWxlczogeyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMsIFtmaWxlSURdOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlc1tmaWxlSURdLCAuLi5zdGF0ZSB9IH0sXG4gICAgfSlcbiAgfVxuXG4gIGkxOG5Jbml0ICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3IoW3RoaXMuZGVmYXVsdExvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZV0pXG4gICAgdGhpcy5pMThuID0gdHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0cmFuc2xhdG9yKVxuICAgIHRoaXMuaTE4bkFycmF5ID0gdHJhbnNsYXRvci50cmFuc2xhdGVBcnJheS5iaW5kKHRyYW5zbGF0b3IpXG4gICAgdGhpcy5sb2NhbGUgPSB0cmFuc2xhdG9yLmxvY2FsZVxuICB9XG5cbiAgc2V0T3B0aW9ucyAobmV3T3B0cykge1xuICAgIHRoaXMub3B0cyA9IHtcbiAgICAgIC4uLnRoaXMub3B0cyxcbiAgICAgIC4uLm5ld09wdHMsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgLi4udGhpcy5vcHRzLnJlc3RyaWN0aW9ucyxcbiAgICAgICAgLi4uKG5ld09wdHMgJiYgbmV3T3B0cy5yZXN0cmljdGlvbnMpLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBpZiAobmV3T3B0cy5tZXRhKSB7XG4gICAgICB0aGlzLnNldE1ldGEobmV3T3B0cy5tZXRhKVxuICAgIH1cblxuICAgIHRoaXMuaTE4bkluaXQoKVxuXG4gICAgaWYgKG5ld09wdHMubG9jYWxlKSB7XG4gICAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKChwbHVnaW4pID0+IHtcbiAgICAgICAgcGx1Z2luLnNldE9wdGlvbnMoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBOb3RlOiB0aGlzIGlzIG5vdCB0aGUgcHJlYWN0IGBzZXRTdGF0ZWAsIGl0J3MgYW4gaW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBoYXMgdGhlIHNhbWUgbmFtZS5cbiAgICB0aGlzLnNldFN0YXRlKCkgLy8gc28gdGhhdCBVSSByZS1yZW5kZXJzIHdpdGggbmV3IG9wdGlvbnNcbiAgfVxuXG4gIHJlc2V0UHJvZ3Jlc3MgKCkge1xuICAgIGNvbnN0IGRlZmF1bHRQcm9ncmVzcyA9IHtcbiAgICAgIHBlcmNlbnRhZ2U6IDAsXG4gICAgICBieXRlc1VwbG9hZGVkOiAwLFxuICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgdXBsb2FkU3RhcnRlZDogbnVsbCxcbiAgICB9XG4gICAgY29uc3QgZmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0ge31cbiAgICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaChmaWxlSUQgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7IC4uLmZpbGVzW2ZpbGVJRF0gfVxuICAgICAgdXBkYXRlZEZpbGUucHJvZ3Jlc3MgPSB7IC4uLnVwZGF0ZWRGaWxlLnByb2dyZXNzLCAuLi5kZWZhdWx0UHJvZ3Jlc3MgfVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVJRF0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXMsXG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3Jlc2V0LXByb2dyZXNzJylcbiAgfVxuXG4gIGFkZFByZVByb2Nlc3NvciAoZm4pIHtcbiAgICB0aGlzLiNwcmVQcm9jZXNzb3JzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVByZVByb2Nlc3NvciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jcHJlUHJvY2Vzc29ycy5kZWxldGUoZm4pXG4gIH1cblxuICBhZGRQb3N0UHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMuI3Bvc3RQcm9jZXNzb3JzLmFkZChmbilcbiAgfVxuXG4gIHJlbW92ZVBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc3RQcm9jZXNzb3JzLmRlbGV0ZShmbilcbiAgfVxuXG4gIGFkZFVwbG9hZGVyIChmbikge1xuICAgIHRoaXMuI3VwbG9hZGVycy5hZGQoZm4pXG4gIH1cblxuICByZW1vdmVVcGxvYWRlciAoZm4pIHtcbiAgICByZXR1cm4gdGhpcy4jdXBsb2FkZXJzLmRlbGV0ZShmbilcbiAgfVxuXG4gIHNldE1ldGEgKGRhdGEpIHtcbiAgICBjb25zdCB1cGRhdGVkTWV0YSA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLm1ldGEsIC4uLmRhdGEgfVxuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cblxuICAgIE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHsgLi4udXBkYXRlZEZpbGVzW2ZpbGVJRF0sIG1ldGE6IHsgLi4udXBkYXRlZEZpbGVzW2ZpbGVJRF0ubWV0YSwgLi4uZGF0YSB9IH1cbiAgICB9KVxuXG4gICAgdGhpcy5sb2coJ0FkZGluZyBtZXRhZGF0YTonKVxuICAgIHRoaXMubG9nKGRhdGEpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1ldGE6IHVwZGF0ZWRNZXRhLFxuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICB9KVxuICB9XG5cbiAgc2V0RmlsZU1ldGEgKGZpbGVJRCwgZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBpZiAoIXVwZGF0ZWRGaWxlc1tmaWxlSURdKSB7XG4gICAgICB0aGlzLmxvZygnV2FzIHRyeWluZyB0byBzZXQgbWV0YWRhdGEgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICcsIGZpbGVJRClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBuZXdNZXRhID0geyAuLi51cGRhdGVkRmlsZXNbZmlsZUlEXS5tZXRhLCAuLi5kYXRhIH1cbiAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHsgLi4udXBkYXRlZEZpbGVzW2ZpbGVJRF0sIG1ldGE6IG5ld01ldGEgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogdXBkYXRlZEZpbGVzIH0pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgZmlsZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSUQgVGhlIElEIG9mIHRoZSBmaWxlIG9iamVjdCB0byByZXR1cm4uXG4gICAqL1xuICBnZXRGaWxlIChmaWxlSUQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIGZpbGVzIGluIGFuIGFycmF5LlxuICAgKi9cbiAgZ2V0RmlsZXMgKCkge1xuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGZpbGVzKVxuICB9XG5cbiAgZ2V0T2JqZWN0T2ZGaWxlc1BlclN0YXRlICgpIHtcbiAgICBjb25zdCB7IGZpbGVzOiBmaWxlc09iamVjdCwgdG90YWxQcm9ncmVzcywgZXJyb3IgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGZpbGVzID0gT2JqZWN0LnZhbHVlcyhmaWxlc09iamVjdClcbiAgICBjb25zdCBpblByb2dyZXNzRmlsZXMgPSBmaWxlcy5maWx0ZXIoKHsgcHJvZ3Jlc3MgfSkgPT4gIXByb2dyZXNzLnVwbG9hZENvbXBsZXRlICYmIHByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpXG4gICAgY29uc3QgbmV3RmlsZXMgPSAgZmlsZXMuZmlsdGVyKChmaWxlKSA9PiAhZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKVxuICAgIGNvbnN0IHN0YXJ0ZWRGaWxlcyA9IGZpbGVzLmZpbHRlcihcbiAgICAgIGZpbGUgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkIHx8IGZpbGUucHJvZ3Jlc3MucHJlcHJvY2VzcyB8fCBmaWxlLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgKVxuICAgIGNvbnN0IHVwbG9hZFN0YXJ0ZWRGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy51cGxvYWRTdGFydGVkKVxuICAgIGNvbnN0IHBhdXNlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmlzUGF1c2VkKVxuICAgIGNvbnN0IGNvbXBsZXRlRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUucHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUpXG4gICAgY29uc3QgZXJyb3JlZEZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVycm9yKVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NOb3RQYXVzZWRGaWxlcyA9IGluUHJvZ3Jlc3NGaWxlcy5maWx0ZXIoKGZpbGUpID0+ICFmaWxlLmlzUGF1c2VkKVxuICAgIGNvbnN0IHByb2Nlc3NpbmdGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3MpXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmV3RmlsZXMsXG4gICAgICBzdGFydGVkRmlsZXMsXG4gICAgICB1cGxvYWRTdGFydGVkRmlsZXMsXG4gICAgICBwYXVzZWRGaWxlcyxcbiAgICAgIGNvbXBsZXRlRmlsZXMsXG4gICAgICBlcnJvcmVkRmlsZXMsXG4gICAgICBpblByb2dyZXNzRmlsZXMsXG4gICAgICBpblByb2dyZXNzTm90UGF1c2VkRmlsZXMsXG4gICAgICBwcm9jZXNzaW5nRmlsZXMsXG5cbiAgICAgIGlzVXBsb2FkU3RhcnRlZDogdXBsb2FkU3RhcnRlZEZpbGVzLmxlbmd0aCA+IDAsXG4gICAgICBpc0FsbENvbXBsZXRlOiB0b3RhbFByb2dyZXNzID09PSAxMDBcbiAgICAgICAgJiYgY29tcGxldGVGaWxlcy5sZW5ndGggPT09IGZpbGVzLmxlbmd0aFxuICAgICAgICAmJiBwcm9jZXNzaW5nRmlsZXMubGVuZ3RoID09PSAwLFxuICAgICAgaXNBbGxFcnJvcmVkOiAhIWVycm9yICYmIGVycm9yZWRGaWxlcy5sZW5ndGggPT09IGZpbGVzLmxlbmd0aCxcbiAgICAgIGlzQWxsUGF1c2VkOiBpblByb2dyZXNzRmlsZXMubGVuZ3RoICE9PSAwICYmIHBhdXNlZEZpbGVzLmxlbmd0aCA9PT0gaW5Qcm9ncmVzc0ZpbGVzLmxlbmd0aCxcbiAgICAgIGlzVXBsb2FkSW5Qcm9ncmVzczogaW5Qcm9ncmVzc0ZpbGVzLmxlbmd0aCA+IDAsXG4gICAgICBpc1NvbWVHaG9zdDogZmlsZXMuc29tZShmaWxlID0+IGZpbGUuaXNHaG9zdCksXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcHVibGljIHdyYXBwZXIgZm9yIF9jaGVja1Jlc3RyaWN0aW9ucyDigJQgY2hlY2tzIGlmIGEgZmlsZSBwYXNzZXMgYSBzZXQgb2YgcmVzdHJpY3Rpb25zLlxuICAgKiBGb3IgdXNlIGluIFVJIHBsdWlnaW5zIChsaWtlIFByb3ZpZGVycyksIHRvIGRpc2FsbG93IHNlbGVjdGluZyBmaWxlcyB0aGF0IHdvbuKAmXQgcGFzcyByZXN0cmljdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBjaGVja1xuICAgKiBAcGFyYW0ge0FycmF5fSBbZmlsZXNdIGFycmF5IHRvIGNoZWNrIG1heE51bWJlck9mRmlsZXMgYW5kIG1heFRvdGFsRmlsZVNpemVcbiAgICogQHJldHVybnMge29iamVjdH0geyByZXN1bHQ6IHRydWUvZmFsc2UsIHJlYXNvbjogd2h5IGZpbGUgZGlkbuKAmXQgcGFzcyByZXN0cmljdGlvbnMgfVxuICAgKi9cbiAgdmFsaWRhdGVSZXN0cmljdGlvbnMgKGZpbGUsIGZpbGVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuI2NoZWNrUmVzdHJpY3Rpb25zKGZpbGUsIGZpbGVzKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiB0cnVlLFxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiBmYWxzZSxcbiAgICAgICAgcmVhc29uOiBlcnIubWVzc2FnZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgZmlsZSBwYXNzZXMgYSBzZXQgb2YgcmVzdHJpY3Rpb25zIHNldCBpbiBvcHRpb25zOiBtYXhGaWxlU2l6ZSwgbWluRmlsZVNpemUsXG4gICAqIG1heE51bWJlck9mRmlsZXMgYW5kIGFsbG93ZWRGaWxlVHlwZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBjaGVja1xuICAgKiBAcGFyYW0ge0FycmF5fSBbZmlsZXNdIGFycmF5IHRvIGNoZWNrIG1heE51bWJlck9mRmlsZXMgYW5kIG1heFRvdGFsRmlsZVNpemVcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjaGVja1Jlc3RyaWN0aW9ucyAoZmlsZSwgZmlsZXMgPSB0aGlzLmdldEZpbGVzKCkpIHtcbiAgICBjb25zdCB7IG1heEZpbGVTaXplLCBtaW5GaWxlU2l6ZSwgbWF4VG90YWxGaWxlU2l6ZSwgbWF4TnVtYmVyT2ZGaWxlcywgYWxsb3dlZEZpbGVUeXBlcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuXG4gICAgaWYgKG1heE51bWJlck9mRmlsZXMpIHtcbiAgICAgIGlmIChmaWxlcy5sZW5ndGggKyAxID4gbWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ3lvdUNhbk9ubHlVcGxvYWRYJywgeyBzbWFydF9jb3VudDogbWF4TnVtYmVyT2ZGaWxlcyB9KX1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhbGxvd2VkRmlsZVR5cGVzKSB7XG4gICAgICBjb25zdCBpc0NvcnJlY3RGaWxlVHlwZSA9IGFsbG93ZWRGaWxlVHlwZXMuc29tZSgodHlwZSkgPT4ge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIGlzIGEgbWltZS10eXBlXG4gICAgICAgIGlmICh0eXBlLmluZGV4T2YoJy8nKSA+IC0xKSB7XG4gICAgICAgICAgaWYgKCFmaWxlLnR5cGUpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHJldHVybiBtYXRjaChmaWxlLnR5cGUucmVwbGFjZSgvOy4qPyQvLCAnJyksIHR5cGUpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdGhlcndpc2UgdGhpcyBpcyBsaWtlbHkgYW4gZXh0ZW5zaW9uXG4gICAgICAgIGlmICh0eXBlWzBdID09PSAnLicgJiYgZmlsZS5leHRlbnNpb24pIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS5leHRlbnNpb24udG9Mb3dlckNhc2UoKSA9PT0gdHlwZS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSlcblxuICAgICAgaWYgKCFpc0NvcnJlY3RGaWxlVHlwZSkge1xuICAgICAgICBjb25zdCBhbGxvd2VkRmlsZVR5cGVzU3RyaW5nID0gYWxsb3dlZEZpbGVUeXBlcy5qb2luKCcsICcpXG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZEZpbGVUeXBlcycsIHsgdHlwZXM6IGFsbG93ZWRGaWxlVHlwZXNTdHJpbmcgfSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UgY2FuJ3QgY2hlY2sgbWF4VG90YWxGaWxlU2l6ZSBpZiB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGlmIChtYXhUb3RhbEZpbGVTaXplICYmIGZpbGUuc2l6ZSAhPSBudWxsKSB7XG4gICAgICBsZXQgdG90YWxGaWxlc1NpemUgPSAwXG4gICAgICB0b3RhbEZpbGVzU2l6ZSArPSBmaWxlLnNpemVcbiAgICAgIGZpbGVzLmZvckVhY2goKGYpID0+IHtcbiAgICAgICAgdG90YWxGaWxlc1NpemUgKz0gZi5zaXplXG4gICAgICB9KVxuICAgICAgaWYgKHRvdGFsRmlsZXNTaXplID4gbWF4VG90YWxGaWxlU2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVzdHJpY3Rpb25FcnJvcih0aGlzLmkxOG4oJ2V4Y2VlZHNTaXplJywge1xuICAgICAgICAgIHNpemU6IHByZXR0aWVyQnl0ZXMobWF4VG90YWxGaWxlU2l6ZSksXG4gICAgICAgICAgZmlsZTogZmlsZS5uYW1lLFxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtYXhGaWxlU2l6ZSBpZiB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGlmIChtYXhGaWxlU2l6ZSAmJiBmaWxlLnNpemUgIT0gbnVsbCkge1xuICAgICAgaWYgKGZpbGUuc2l6ZSA+IG1heEZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignZXhjZWVkc1NpemUnLCB7XG4gICAgICAgICAgc2l6ZTogcHJldHRpZXJCeXRlcyhtYXhGaWxlU2l6ZSksXG4gICAgICAgICAgZmlsZTogZmlsZS5uYW1lLFxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBjaGVjayBtaW5GaWxlU2l6ZSBpZiB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGlmIChtaW5GaWxlU2l6ZSAmJiBmaWxlLnNpemUgIT0gbnVsbCkge1xuICAgICAgaWYgKGZpbGUuc2l6ZSA8IG1pbkZpbGVTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignaW5mZXJpb3JTaXplJywge1xuICAgICAgICAgIHNpemU6IHByZXR0aWVyQnl0ZXMobWluRmlsZVNpemUpLFxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgbWluTnVtYmVyT2ZGaWxlcyByZXN0cmljdGlvbiBpcyByZWFjaGVkIGJlZm9yZSB1cGxvYWRpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAjY2hlY2tNaW5OdW1iZXJPZkZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IHsgbWluTnVtYmVyT2ZGaWxlcyB9ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9uc1xuICAgIGlmIChPYmplY3Qua2V5cyhmaWxlcykubGVuZ3RoIDwgbWluTnVtYmVyT2ZGaWxlcykge1xuICAgICAgdGhyb3cgbmV3IFJlc3RyaWN0aW9uRXJyb3IoYCR7dGhpcy5pMThuKCd5b3VIYXZlVG9BdExlYXN0U2VsZWN0WCcsIHsgc21hcnRfY291bnQ6IG1pbk51bWJlck9mRmlsZXMgfSl9YClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcmVxdWlyZWRNZXRhRmllbGQgcmVzdHJpY3Rpb24gaXMgbWV0IGJlZm9yZSB1cGxvYWRpbmcuXG4gICAqXG4gICAqL1xuICAjY2hlY2tSZXF1aXJlZE1ldGFGaWVsZHMgKGZpbGVzKSB7XG4gICAgY29uc3QgeyByZXF1aXJlZE1ldGFGaWVsZHMgfSA9IHRoaXMub3B0cy5yZXN0cmljdGlvbnNcbiAgICBjb25zdCB7IGhhc093blByb3BlcnR5IH0gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG5cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGNvbnN0IGZpbGVJRHMgPSBPYmplY3Qua2V5cyhmaWxlcylcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVJRHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGUoZmlsZUlEc1tpXSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWlyZWRNZXRhRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChmaWxlLm1ldGEsIHJlcXVpcmVkTWV0YUZpZWxkc1tpXSkpIHtcbiAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ21pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZE9uRmlsZScsIHsgZmlsZU5hbWU6IGZpbGUubmFtZSB9KX1gKVxuICAgICAgICAgIGVycm9ycy5wdXNoKGVycilcbiAgICAgICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwgeyBmaWxlLCBzaG93SW5mb3JtZXI6IGZhbHNlLCB0aHJvd0VycjogZmFsc2UgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQWdncmVnYXRlUmVzdHJpY3Rpb25FcnJvcihgJHt0aGlzLmkxOG4oJ21pc3NpbmdSZXF1aXJlZE1ldGFGaWVsZCcpfWAsIGVycm9ycylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhbiBlcnJvciwgc2V0cyBJbmZvcm1lciBtZXNzYWdlLCB0aGVuIHRocm93cyB0aGUgZXJyb3IuXG4gICAqIEVtaXRzIGEgJ3Jlc3RyaWN0aW9uLWZhaWxlZCcgZXZlbnQgaWYgaXTigJlzIGEgcmVzdHJpY3Rpb24gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3QgfCBzdHJpbmd9IGVyciDigJQgRXJyb3Igb2JqZWN0IG9yIHBsYWluIHN0cmluZyBtZXNzYWdlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zaG93SW5mb3JtZXI9dHJ1ZV0g4oCUIFNvbWV0aW1lcyBkZXZlbG9wZXIgbWlnaHQgd2FudCB0byBzaG93IEluZm9ybWVyIG1hbnVhbGx5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5maWxlPW51bGxdIOKAlCBGaWxlIG9iamVjdCB1c2VkIHRvIGVtaXQgdGhlIHJlc3RyaWN0aW9uIGVycm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudGhyb3dFcnI9dHJ1ZV0g4oCUIEVycm9ycyBzaG91bGRu4oCZdCBiZSB0aHJvd24sIGZvciBleGFtcGxlLCBpbiBgdXBsb2FkLWVycm9yYCBldmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cgKGVyciwgeyBzaG93SW5mb3JtZXIgPSB0cnVlLCBmaWxlID0gbnVsbCwgdGhyb3dFcnIgPSB0cnVlIH0gPSB7fSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyci5tZXNzYWdlIDogZXJyXG4gICAgY29uc3QgZGV0YWlscyA9ICh0eXBlb2YgZXJyID09PSAnb2JqZWN0JyAmJiBlcnIuZGV0YWlscykgPyBlcnIuZGV0YWlscyA6ICcnXG5cbiAgICAvLyBSZXN0cmljdGlvbiBlcnJvcnMgc2hvdWxkIGJlIGxvZ2dlZCwgYnV0IG5vdCBhcyBlcnJvcnMsXG4gICAgLy8gYXMgdGhleSBhcmUgZXhwZWN0ZWQgYW5kIHNob3duIGluIHRoZSBVSS5cbiAgICBsZXQgbG9nTWVzc2FnZVdpdGhEZXRhaWxzID0gbWVzc2FnZVxuICAgIGlmIChkZXRhaWxzKSB7XG4gICAgICBsb2dNZXNzYWdlV2l0aERldGFpbHMgKz0gYCAke2RldGFpbHN9YFxuICAgIH1cbiAgICBpZiAoZXJyLmlzUmVzdHJpY3Rpb24pIHtcbiAgICAgIHRoaXMubG9nKGxvZ01lc3NhZ2VXaXRoRGV0YWlscylcbiAgICAgIHRoaXMuZW1pdCgncmVzdHJpY3Rpb24tZmFpbGVkJywgZmlsZSwgZXJyKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZyhsb2dNZXNzYWdlV2l0aERldGFpbHMsICdlcnJvcicpXG4gICAgfVxuXG4gICAgLy8gU29tZXRpbWVzIGluZm9ybWVyIGhhcyB0byBiZSBzaG93biBtYW51YWxseSBieSB0aGUgZGV2ZWxvcGVyLFxuICAgIC8vIGZvciBleGFtcGxlLCBpbiBgb25CZWZvcmVGaWxlQWRkZWRgLlxuICAgIGlmIChzaG93SW5mb3JtZXIpIHtcbiAgICAgIHRoaXMuaW5mbyh7IG1lc3NhZ2UsIGRldGFpbHMgfSwgJ2Vycm9yJywgdGhpcy5vcHRzLmluZm9UaW1lb3V0KVxuICAgIH1cblxuICAgIGlmICh0aHJvd0Vycikge1xuICAgICAgdGhyb3cgKHR5cGVvZiBlcnIgPT09ICdvYmplY3QnID8gZXJyIDogbmV3IEVycm9yKGVycikpXG4gICAgfVxuICB9XG5cbiAgI2Fzc2VydE5ld1VwbG9hZEFsbG93ZWQgKGZpbGUpIHtcbiAgICBjb25zdCB7IGFsbG93TmV3VXBsb2FkIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIGlmIChhbGxvd05ld1VwbG9hZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3cobmV3IFJlc3RyaWN0aW9uRXJyb3IodGhpcy5pMThuKCdub05ld0FscmVhZHlVcGxvYWRpbmcnKSksIHsgZmlsZSB9KVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrSWZGaWxlQWxyZWFkeUV4aXN0cyAoZmlsZUlEKSB7XG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoZmlsZXNbZmlsZUlEXSAmJiAhZmlsZXNbZmlsZUlEXS5pc0dob3N0KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBmaWxlIHN0YXRlIG9iamVjdCBiYXNlZCBvbiB1c2VyLXByb3ZpZGVkIGBhZGRGaWxlKClgIG9wdGlvbnMuXG4gICAqXG4gICAqIE5vdGUgdGhpcyBpcyBleHRyZW1lbHkgc2lkZS1lZmZlY3RmdWwgYW5kIHNob3VsZCBvbmx5IGJlIGRvbmUgd2hlbiBhIGZpbGUgc3RhdGUgb2JqZWN0XG4gICAqIHdpbGwgYmUgYWRkZWQgdG8gc3RhdGUgaW1tZWRpYXRlbHkgYWZ0ZXJ3YXJkIVxuICAgKlxuICAgKiBUaGUgYGZpbGVzYCB2YWx1ZSBpcyBwYXNzZWQgaW4gYmVjYXVzZSBpdCBtYXkgYmUgdXBkYXRlZCBieSB0aGUgY2FsbGVyIHdpdGhvdXQgdXBkYXRpbmcgdGhlIHN0b3JlLlxuICAgKi9cbiAgI2NoZWNrQW5kQ3JlYXRlRmlsZVN0YXRlT2JqZWN0IChmaWxlcywgZmlsZURlc2NyaXB0b3IpIHtcbiAgICBjb25zdCBmaWxlVHlwZSA9IGdldEZpbGVUeXBlKGZpbGVEZXNjcmlwdG9yKVxuICAgIGNvbnN0IGZpbGVOYW1lID0gZ2V0RmlsZU5hbWUoZmlsZVR5cGUsIGZpbGVEZXNjcmlwdG9yKVxuICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmaWxlTmFtZSkuZXh0ZW5zaW9uXG4gICAgY29uc3QgaXNSZW1vdGUgPSBCb29sZWFuKGZpbGVEZXNjcmlwdG9yLmlzUmVtb3RlKVxuICAgIGNvbnN0IGZpbGVJRCA9IGdlbmVyYXRlRmlsZUlEKHtcbiAgICAgIC4uLmZpbGVEZXNjcmlwdG9yLFxuICAgICAgdHlwZTogZmlsZVR5cGUsXG4gICAgfSlcblxuICAgIGlmICh0aGlzLmNoZWNrSWZGaWxlQWxyZWFkeUV4aXN0cyhmaWxlSUQpKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBSZXN0cmljdGlvbkVycm9yKHRoaXMuaTE4bignbm9EdXBsaWNhdGVzJywgeyBmaWxlTmFtZSB9KSlcbiAgICAgIHRoaXMuI3Nob3dPckxvZ0Vycm9yQW5kVGhyb3coZXJyb3IsIHsgZmlsZTogZmlsZURlc2NyaXB0b3IgfSlcbiAgICB9XG5cbiAgICBjb25zdCBtZXRhID0gZmlsZURlc2NyaXB0b3IubWV0YSB8fCB7fVxuICAgIG1ldGEubmFtZSA9IGZpbGVOYW1lXG4gICAgbWV0YS50eXBlID0gZmlsZVR5cGVcblxuICAgIC8vIGBudWxsYCBtZWFucyB0aGUgc2l6ZSBpcyB1bmtub3duLlxuICAgIGNvbnN0IHNpemUgPSBOdW1iZXIuaXNGaW5pdGUoZmlsZURlc2NyaXB0b3IuZGF0YS5zaXplKSA/IGZpbGVEZXNjcmlwdG9yLmRhdGEuc2l6ZSA6IG51bGxcblxuICAgIGxldCBuZXdGaWxlID0ge1xuICAgICAgc291cmNlOiBmaWxlRGVzY3JpcHRvci5zb3VyY2UgfHwgJycsXG4gICAgICBpZDogZmlsZUlELFxuICAgICAgbmFtZTogZmlsZU5hbWUsXG4gICAgICBleHRlbnNpb246IGZpbGVFeHRlbnNpb24gfHwgJycsXG4gICAgICBtZXRhOiB7XG4gICAgICAgIC4uLnRoaXMuZ2V0U3RhdGUoKS5tZXRhLFxuICAgICAgICAuLi5tZXRhLFxuICAgICAgfSxcbiAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgICAgZGF0YTogZmlsZURlc2NyaXB0b3IuZGF0YSxcbiAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgIHBlcmNlbnRhZ2U6IDAsXG4gICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgIGJ5dGVzVG90YWw6IHNpemUsXG4gICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgdXBsb2FkU3RhcnRlZDogbnVsbCxcbiAgICAgIH0sXG4gICAgICBzaXplLFxuICAgICAgaXNSZW1vdGUsXG4gICAgICByZW1vdGU6IGZpbGVEZXNjcmlwdG9yLnJlbW90ZSB8fCAnJyxcbiAgICAgIHByZXZpZXc6IGZpbGVEZXNjcmlwdG9yLnByZXZpZXcsXG4gICAgfVxuXG4gICAgY29uc3Qgb25CZWZvcmVGaWxlQWRkZWRSZXN1bHQgPSB0aGlzLm9wdHMub25CZWZvcmVGaWxlQWRkZWQobmV3RmlsZSwgZmlsZXMpXG5cbiAgICBpZiAob25CZWZvcmVGaWxlQWRkZWRSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBEb27igJl0IHNob3cgVUkgaW5mbyBmb3IgdGhpcyBlcnJvciwgYXMgaXQgc2hvdWxkIGJlIGRvbmUgYnkgdGhlIGRldmVsb3BlclxuICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhuZXcgUmVzdHJpY3Rpb25FcnJvcignQ2Fubm90IGFkZCB0aGUgZmlsZSBiZWNhdXNlIG9uQmVmb3JlRmlsZUFkZGVkIHJldHVybmVkIGZhbHNlLicpLCB7IHNob3dJbmZvcm1lcjogZmFsc2UsIGZpbGVEZXNjcmlwdG9yIH0pXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb25CZWZvcmVGaWxlQWRkZWRSZXN1bHQgPT09ICdvYmplY3QnICYmIG9uQmVmb3JlRmlsZUFkZGVkUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICBuZXdGaWxlID0gb25CZWZvcmVGaWxlQWRkZWRSZXN1bHRcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgZmlsZXNBcnJheSA9IE9iamVjdC5rZXlzKGZpbGVzKS5tYXAoaSA9PiBmaWxlc1tpXSlcbiAgICAgIHRoaXMuI2NoZWNrUmVzdHJpY3Rpb25zKG5ld0ZpbGUsIGZpbGVzQXJyYXkpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwgeyBmaWxlOiBuZXdGaWxlIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0ZpbGVcbiAgfVxuXG4gIC8vIFNjaGVkdWxlIGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWRgIGlzIGVuYWJsZWQuXG4gICNzdGFydElmQXV0b1Byb2NlZWQgKCkge1xuICAgIGlmICh0aGlzLm9wdHMuYXV0b1Byb2NlZWQgJiYgIXRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRBdXRvUHJvY2VlZCA9IG51bGxcbiAgICAgICAgdGhpcy51cGxvYWQoKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKCFlcnIuaXNSZXN0cmljdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sb2coZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlIHx8IGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LCA0KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgZmlsZSB0byBgc3RhdGUuZmlsZXNgLiBUaGlzIHdpbGwgcnVuIGBvbkJlZm9yZUZpbGVBZGRlZGAsXG4gICAqIHRyeSB0byBndWVzcyBmaWxlIHR5cGUgaW4gYSBjbGV2ZXIgd2F5LCBjaGVjayBmaWxlIGFnYWluc3QgcmVzdHJpY3Rpb25zLFxuICAgKiBhbmQgc3RhcnQgYW4gdXBsb2FkIGlmIGBhdXRvUHJvY2VlZCA9PT0gdHJ1ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlIG9iamVjdCB0byBhZGRcbiAgICogQHJldHVybnMge3N0cmluZ30gaWQgZm9yIHRoZSBhZGRlZCBmaWxlXG4gICAqL1xuICBhZGRGaWxlIChmaWxlKSB7XG4gICAgdGhpcy4jYXNzZXJ0TmV3VXBsb2FkQWxsb3dlZChmaWxlKVxuXG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgbGV0IG5ld0ZpbGUgPSB0aGlzLiNjaGVja0FuZENyZWF0ZUZpbGVTdGF0ZU9iamVjdChmaWxlcywgZmlsZSlcblxuICAgIC8vIFVzZXJzIGFyZSBhc2tlZCB0byByZS1zZWxlY3QgcmVjb3ZlcmVkIGZpbGVzIHdpdGhvdXQgZGF0YSxcbiAgICAvLyBhbmQgdG8ga2VlcCB0aGUgcHJvZ3Jlc3MsIG1ldGEgYW5kIGV2ZXJ0aGluZyBlbHNlLCB3ZSBvbmx5IHJlcGxhY2Ugc2FpZCBkYXRhXG4gICAgaWYgKGZpbGVzW25ld0ZpbGUuaWRdICYmIGZpbGVzW25ld0ZpbGUuaWRdLmlzR2hvc3QpIHtcbiAgICAgIG5ld0ZpbGUgPSB7XG4gICAgICAgIC4uLmZpbGVzW25ld0ZpbGUuaWRdLFxuICAgICAgICBkYXRhOiBmaWxlLmRhdGEsXG4gICAgICAgIGlzR2hvc3Q6IGZhbHNlLFxuICAgICAgfVxuICAgICAgdGhpcy5sb2coYFJlcGxhY2VkIHRoZSBibG9iIGluIHRoZSByZXN0b3JlZCBnaG9zdCBmaWxlOiAke25ld0ZpbGUubmFtZX0sICR7bmV3RmlsZS5pZH1gKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHtcbiAgICAgICAgLi4uZmlsZXMsXG4gICAgICAgIFtuZXdGaWxlLmlkXTogbmV3RmlsZSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgnZmlsZS1hZGRlZCcsIG5ld0ZpbGUpXG4gICAgdGhpcy5lbWl0KCdmaWxlcy1hZGRlZCcsIFtuZXdGaWxlXSlcbiAgICB0aGlzLmxvZyhgQWRkZWQgZmlsZTogJHtuZXdGaWxlLm5hbWV9LCAke25ld0ZpbGUuaWR9LCBtaW1lIHR5cGU6ICR7bmV3RmlsZS50eXBlfWApXG5cbiAgICB0aGlzLiNzdGFydElmQXV0b1Byb2NlZWQoKVxuXG4gICAgcmV0dXJuIG5ld0ZpbGUuaWRcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbXVsdGlwbGUgZmlsZXMgdG8gYHN0YXRlLmZpbGVzYC4gU2VlIHRoZSBgYWRkRmlsZSgpYCBkb2N1bWVudGF0aW9uLlxuICAgKlxuICAgKiBJZiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgYWRkaW5nIGEgZmlsZSwgaXQgaXMgbG9nZ2VkIGFuZCB0aGUgdXNlciBpcyBub3RpZmllZC5cbiAgICogVGhpcyBpcyBnb29kIGZvciBVSSBwbHVnaW5zLCBidXQgbm90IGZvciBwcm9ncmFtbWF0aWMgdXNlLlxuICAgKiBQcm9ncmFtbWF0aWMgdXNlcnMgc2hvdWxkIHVzdWFsbHkgc3RpbGwgdXNlIGBhZGRGaWxlKClgIG9uIGluZGl2aWR1YWwgZmlsZXMuXG4gICAqL1xuICBhZGRGaWxlcyAoZmlsZURlc2NyaXB0b3JzKSB7XG4gICAgdGhpcy4jYXNzZXJ0TmV3VXBsb2FkQWxsb3dlZCgpXG5cbiAgICAvLyBjcmVhdGUgYSBjb3B5IG9mIHRoZSBmaWxlcyBvYmplY3Qgb25seSBvbmNlXG4gICAgY29uc3QgZmlsZXMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlcyB9XG4gICAgY29uc3QgbmV3RmlsZXMgPSBbXVxuICAgIGNvbnN0IGVycm9ycyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlRGVzY3JpcHRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBuZXdGaWxlID0gdGhpcy4jY2hlY2tBbmRDcmVhdGVGaWxlU3RhdGVPYmplY3QoZmlsZXMsIGZpbGVEZXNjcmlwdG9yc1tpXSlcbiAgICAgICAgLy8gVXNlcnMgYXJlIGFza2VkIHRvIHJlLXNlbGVjdCByZWNvdmVyZWQgZmlsZXMgd2l0aG91dCBkYXRhLFxuICAgICAgICAvLyBhbmQgdG8ga2VlcCB0aGUgcHJvZ3Jlc3MsIG1ldGEgYW5kIGV2ZXJ0aGluZyBlbHNlLCB3ZSBvbmx5IHJlcGxhY2Ugc2FpZCBkYXRhXG4gICAgICAgIGlmIChmaWxlc1tuZXdGaWxlLmlkXSAmJiBmaWxlc1tuZXdGaWxlLmlkXS5pc0dob3N0KSB7XG4gICAgICAgICAgbmV3RmlsZSA9IHtcbiAgICAgICAgICAgIC4uLmZpbGVzW25ld0ZpbGUuaWRdLFxuICAgICAgICAgICAgZGF0YTogZmlsZURlc2NyaXB0b3JzW2ldLmRhdGEsXG4gICAgICAgICAgICBpc0dob3N0OiBmYWxzZSxcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5sb2coYFJlcGxhY2VkIGJsb2IgaW4gYSBnaG9zdCBmaWxlOiAke25ld0ZpbGUubmFtZX0sICR7bmV3RmlsZS5pZH1gKVxuICAgICAgICB9XG4gICAgICAgIGZpbGVzW25ld0ZpbGUuaWRdID0gbmV3RmlsZVxuICAgICAgICBuZXdGaWxlcy5wdXNoKG5ld0ZpbGUpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKCFlcnIuaXNSZXN0cmljdGlvbikge1xuICAgICAgICAgIGVycm9ycy5wdXNoKGVycilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuXG4gICAgbmV3RmlsZXMuZm9yRWFjaCgobmV3RmlsZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdmaWxlLWFkZGVkJywgbmV3RmlsZSlcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0KCdmaWxlcy1hZGRlZCcsIG5ld0ZpbGVzKVxuXG4gICAgaWYgKG5ld0ZpbGVzLmxlbmd0aCA+IDUpIHtcbiAgICAgIHRoaXMubG9nKGBBZGRlZCBiYXRjaCBvZiAke25ld0ZpbGVzLmxlbmd0aH0gZmlsZXNgKVxuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhuZXdGaWxlcykuZm9yRWFjaChmaWxlSUQgPT4ge1xuICAgICAgICB0aGlzLmxvZyhgQWRkZWQgZmlsZTogJHtuZXdGaWxlc1tmaWxlSURdLm5hbWV9XFxuIGlkOiAke25ld0ZpbGVzW2ZpbGVJRF0uaWR9XFxuIHR5cGU6ICR7bmV3RmlsZXNbZmlsZUlEXS50eXBlfWApXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChuZXdGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLiNzdGFydElmQXV0b1Byb2NlZWQoKVxuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IG1lc3NhZ2UgPSAnTXVsdGlwbGUgZXJyb3JzIG9jY3VycmVkIHdoaWxlIGFkZGluZyBmaWxlczpcXG4nXG4gICAgICBlcnJvcnMuZm9yRWFjaCgoc3ViRXJyb3IpID0+IHtcbiAgICAgICAgbWVzc2FnZSArPSBgXFxuICogJHtzdWJFcnJvci5tZXNzYWdlfWBcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuaW5mbyh7XG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuaTE4bignYWRkQnVsa0ZpbGVzRmFpbGVkJywgeyBzbWFydF9jb3VudDogZXJyb3JzLmxlbmd0aCB9KSxcbiAgICAgICAgZGV0YWlsczogbWVzc2FnZSxcbiAgICAgIH0sICdlcnJvcicsIHRoaXMub3B0cy5pbmZvVGltZW91dClcblxuICAgICAgaWYgKHR5cGVvZiBBZ2dyZWdhdGVFcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgQWdncmVnYXRlRXJyb3IoZXJyb3JzLCBtZXNzYWdlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgIGVyci5lcnJvcnMgPSBlcnJvcnNcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRmlsZXMgKGZpbGVJRHMsIHJlYXNvbikge1xuICAgIGNvbnN0IHsgZmlsZXMsIGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7IC4uLmZpbGVzIH1cbiAgICBjb25zdCB1cGRhdGVkVXBsb2FkcyA9IHsgLi4uY3VycmVudFVwbG9hZHMgfVxuXG4gICAgY29uc3QgcmVtb3ZlZEZpbGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgIGZpbGVJRHMuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgICBpZiAoZmlsZXNbZmlsZUlEXSkge1xuICAgICAgICByZW1vdmVkRmlsZXNbZmlsZUlEXSA9IGZpbGVzW2ZpbGVJRF1cbiAgICAgICAgZGVsZXRlIHVwZGF0ZWRGaWxlc1tmaWxlSURdXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFJlbW92ZSBmaWxlcyBmcm9tIHRoZSBgZmlsZUlEc2AgbGlzdCBpbiBlYWNoIHVwbG9hZC5cbiAgICBmdW5jdGlvbiBmaWxlSXNOb3RSZW1vdmVkICh1cGxvYWRGaWxlSUQpIHtcbiAgICAgIHJldHVybiByZW1vdmVkRmlsZXNbdXBsb2FkRmlsZUlEXSA9PT0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZFVwbG9hZHMpLmZvckVhY2goKHVwbG9hZElEKSA9PiB7XG4gICAgICBjb25zdCBuZXdGaWxlSURzID0gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdLmZpbGVJRHMuZmlsdGVyKGZpbGVJc05vdFJlbW92ZWQpXG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgdXBsb2FkIGlmIG5vIGZpbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggaXQgYW55bW9yZS5cbiAgICAgIGlmIChuZXdGaWxlSURzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgdXBkYXRlZFVwbG9hZHNbdXBsb2FkSURdXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB1cGRhdGVkVXBsb2Fkc1t1cGxvYWRJRF0gPSB7XG4gICAgICAgIC4uLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSxcbiAgICAgICAgZmlsZUlEczogbmV3RmlsZUlEcyxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3Qgc3RhdGVVcGRhdGUgPSB7XG4gICAgICBjdXJyZW50VXBsb2FkczogdXBkYXRlZFVwbG9hZHMsXG4gICAgICBmaWxlczogdXBkYXRlZEZpbGVzLFxuICAgIH1cblxuICAgIC8vIElmIGFsbCBmaWxlcyB3ZXJlIHJlbW92ZWQgLSBhbGxvdyBuZXcgdXBsb2FkcyxcbiAgICAvLyBhbmQgY2xlYXIgcmVjb3ZlcmVkU3RhdGVcbiAgICBpZiAoT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHN0YXRlVXBkYXRlLmFsbG93TmV3VXBsb2FkID0gdHJ1ZVxuICAgICAgc3RhdGVVcGRhdGUuZXJyb3IgPSBudWxsXG4gICAgICBzdGF0ZVVwZGF0ZS5yZWNvdmVyZWRTdGF0ZSA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlVXBkYXRlKVxuICAgIHRoaXMuY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG5cbiAgICBjb25zdCByZW1vdmVkRmlsZUlEcyA9IE9iamVjdC5rZXlzKHJlbW92ZWRGaWxlcylcbiAgICByZW1vdmVkRmlsZUlEcy5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZmlsZS1yZW1vdmVkJywgcmVtb3ZlZEZpbGVzW2ZpbGVJRF0sIHJlYXNvbilcbiAgICB9KVxuXG4gICAgaWYgKHJlbW92ZWRGaWxlSURzLmxlbmd0aCA+IDUpIHtcbiAgICAgIHRoaXMubG9nKGBSZW1vdmVkICR7cmVtb3ZlZEZpbGVJRHMubGVuZ3RofSBmaWxlc2ApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9nKGBSZW1vdmVkIGZpbGVzOiAke3JlbW92ZWRGaWxlSURzLmpvaW4oJywgJyl9YClcbiAgICB9XG4gIH1cblxuICByZW1vdmVGaWxlIChmaWxlSUQsIHJlYXNvbiA9IG51bGwpIHtcbiAgICB0aGlzLnJlbW92ZUZpbGVzKFtmaWxlSURdLCByZWFzb24pXG4gIH1cblxuICBwYXVzZVJlc3VtZSAoZmlsZUlEKSB7XG4gICAgaWYgKCF0aGlzLmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLnJlc3VtYWJsZVVwbG9hZHNcbiAgICAgICAgIHx8IHRoaXMuZ2V0RmlsZShmaWxlSUQpLnVwbG9hZENvbXBsZXRlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgY29uc3Qgd2FzUGF1c2VkID0gdGhpcy5nZXRGaWxlKGZpbGVJRCkuaXNQYXVzZWQgfHwgZmFsc2VcbiAgICBjb25zdCBpc1BhdXNlZCA9ICF3YXNQYXVzZWRcblxuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgaXNQYXVzZWQsXG4gICAgfSlcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkLXBhdXNlJywgZmlsZUlELCBpc1BhdXNlZClcblxuICAgIHJldHVybiBpc1BhdXNlZFxuICB9XG5cbiAgcGF1c2VBbGwgKCkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IHsgLi4udGhpcy5nZXRTdGF0ZSgpLmZpbGVzIH1cbiAgICBjb25zdCBpblByb2dyZXNzVXBkYXRlZEZpbGVzID0gT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiAhdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZENvbXBsZXRlXG4gICAgICAgICAgICAgJiYgdXBkYXRlZEZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuXG4gICAgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IHsgLi4udXBkYXRlZEZpbGVzW2ZpbGVdLCBpc1BhdXNlZDogdHJ1ZSB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXM6IHVwZGF0ZWRGaWxlcyB9KVxuICAgIHRoaXMuZW1pdCgncGF1c2UtYWxsJylcbiAgfVxuXG4gIHJlc3VtZUFsbCAoKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuICF1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkQ29tcGxldGVcbiAgICAgICAgICAgICAmJiB1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZFxuICAgIH0pXG5cbiAgICBpblByb2dyZXNzVXBkYXRlZEZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0ge1xuICAgICAgICAuLi51cGRhdGVkRmlsZXNbZmlsZV0sXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9XG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZV0gPSB1cGRhdGVkRmlsZVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzOiB1cGRhdGVkRmlsZXMgfSlcblxuICAgIHRoaXMuZW1pdCgncmVzdW1lLWFsbCcpXG4gIH1cblxuICByZXRyeUFsbCAoKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIGNvbnN0IGZpbGVzVG9SZXRyeSA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKGZpbGUgPT4ge1xuICAgICAgcmV0dXJuIHVwZGF0ZWRGaWxlc1tmaWxlXS5lcnJvclxuICAgIH0pXG5cbiAgICBmaWxlc1RvUmV0cnkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSB7XG4gICAgICAgIC4uLnVwZGF0ZWRGaWxlc1tmaWxlXSxcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH1cbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXMsXG4gICAgICBlcnJvcjogbnVsbCxcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0KCdyZXRyeS1hbGwnLCBmaWxlc1RvUmV0cnkpXG5cbiAgICBpZiAoZmlsZXNUb1JldHJ5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgIHN1Y2Nlc3NmdWw6IFtdLFxuICAgICAgICBmYWlsZWQ6IFtdLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IHRoaXMuI2NyZWF0ZVVwbG9hZChmaWxlc1RvUmV0cnksIHtcbiAgICAgIGZvcmNlQWxsb3dOZXdVcGxvYWQ6IHRydWUsIC8vIGNyZWF0ZSBuZXcgdXBsb2FkIGV2ZW4gaWYgYWxsb3dOZXdVcGxvYWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy4jcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgY2FuY2VsQWxsICgpIHtcbiAgICB0aGlzLmVtaXQoJ2NhbmNlbC1hbGwnKVxuXG4gICAgY29uc3QgeyBmaWxlcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICBjb25zdCBmaWxlSURzID0gT2JqZWN0LmtleXMoZmlsZXMpXG4gICAgaWYgKGZpbGVJRHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJlbW92ZUZpbGVzKGZpbGVJRHMsICdjYW5jZWwtYWxsJylcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDAsXG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHJlY292ZXJlZFN0YXRlOiBudWxsLFxuICAgIH0pXG4gIH1cblxuICByZXRyeVVwbG9hZCAoZmlsZUlEKSB7XG4gICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0KCd1cGxvYWQtcmV0cnknLCBmaWxlSUQpXG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IHRoaXMuI2NyZWF0ZVVwbG9hZChbZmlsZUlEXSwge1xuICAgICAgZm9yY2VBbGxvd05ld1VwbG9hZDogdHJ1ZSwgLy8gY3JlYXRlIG5ldyB1cGxvYWQgZXZlbiBpZiBhbGxvd05ld1VwbG9hZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiB0aGlzLiNydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgdGhpcy5jYW5jZWxBbGwoKVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKHBsdWdpbiA9PiB7XG4gICAgICBpZiAocGx1Z2luLnByb3ZpZGVyICYmIHBsdWdpbi5wcm92aWRlci5sb2dvdXQpIHtcbiAgICAgICAgcGx1Z2luLnByb3ZpZGVyLmxvZ291dCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNhbGN1bGF0ZVByb2dyZXNzIChmaWxlLCBkYXRhKSB7XG4gICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBieXRlc1RvdGFsIG1heSBiZSBudWxsIG9yIHplcm87IGluIHRoYXQgY2FzZSB3ZSBjYW4ndCBkaXZpZGUgYnkgaXRcbiAgICBjb25zdCBjYW5IYXZlUGVyY2VudGFnZSA9IE51bWJlci5pc0Zpbml0ZShkYXRhLmJ5dGVzVG90YWwpICYmIGRhdGEuYnl0ZXNUb3RhbCA+IDBcbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICBwcm9ncmVzczoge1xuICAgICAgICAuLi50aGlzLmdldEZpbGUoZmlsZS5pZCkucHJvZ3Jlc3MsXG4gICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGRhdGEuYnl0ZXNVcGxvYWRlZCxcbiAgICAgICAgYnl0ZXNUb3RhbDogZGF0YS5ieXRlc1RvdGFsLFxuICAgICAgICBwZXJjZW50YWdlOiBjYW5IYXZlUGVyY2VudGFnZVxuICAgICAgICAgID8gTWF0aC5yb3VuZCgoZGF0YS5ieXRlc1VwbG9hZGVkIC8gZGF0YS5ieXRlc1RvdGFsKSAqIDEwMClcbiAgICAgICAgICA6IDAsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuICB9XG5cbiAgY2FsY3VsYXRlVG90YWxQcm9ncmVzcyAoKSB7XG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIHByb2dyZXNzLCB1c2luZyB0aGUgbnVtYmVyIG9mIGZpbGVzIGN1cnJlbnRseSB1cGxvYWRpbmcsXG4gICAgLy8gbXVsdGlwbGllZCBieSAxMDAgYW5kIHRoZSBzdW1tIG9mIGluZGl2aWR1YWwgcHJvZ3Jlc3Mgb2YgZWFjaCBmaWxlXG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzKClcblxuICAgIGNvbnN0IGluUHJvZ3Jlc3MgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiBmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICAgICAgfHwgZmlsZS5wcm9ncmVzcy5wcmVwcm9jZXNzXG4gICAgICAgIHx8IGZpbGUucHJvZ3Jlc3MucG9zdHByb2Nlc3NcbiAgICB9KVxuXG4gICAgaWYgKGluUHJvZ3Jlc3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzOiAwIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzaXplZEZpbGVzID0gaW5Qcm9ncmVzcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUucHJvZ3Jlc3MuYnl0ZXNUb3RhbCAhPSBudWxsKVxuICAgIGNvbnN0IHVuc2l6ZWRGaWxlcyA9IGluUHJvZ3Jlc3MuZmlsdGVyKChmaWxlKSA9PiBmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgPT0gbnVsbClcblxuICAgIGlmIChzaXplZEZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcHJvZ3Jlc3NNYXggPSBpblByb2dyZXNzLmxlbmd0aCAqIDEwMFxuICAgICAgY29uc3QgY3VycmVudFByb2dyZXNzID0gdW5zaXplZEZpbGVzLnJlZHVjZSgoYWNjLCBmaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiBhY2MgKyBmaWxlLnByb2dyZXNzLnBlcmNlbnRhZ2VcbiAgICAgIH0sIDApXG4gICAgICBjb25zdCB0b3RhbFByb2dyZXNzID0gTWF0aC5yb3VuZCgoY3VycmVudFByb2dyZXNzIC8gcHJvZ3Jlc3NNYXgpICogMTAwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRvdGFsUHJvZ3Jlc3MgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCB0b3RhbFNpemUgPSBzaXplZEZpbGVzLnJlZHVjZSgoYWNjLCBmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gYWNjICsgZmlsZS5wcm9ncmVzcy5ieXRlc1RvdGFsXG4gICAgfSwgMClcbiAgICBjb25zdCBhdmVyYWdlU2l6ZSA9IHRvdGFsU2l6ZSAvIHNpemVkRmlsZXMubGVuZ3RoXG4gICAgdG90YWxTaXplICs9IGF2ZXJhZ2VTaXplICogdW5zaXplZEZpbGVzLmxlbmd0aFxuXG4gICAgbGV0IHVwbG9hZGVkU2l6ZSA9IDBcbiAgICBzaXplZEZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIHVwbG9hZGVkU2l6ZSArPSBmaWxlLnByb2dyZXNzLmJ5dGVzVXBsb2FkZWRcbiAgICB9KVxuICAgIHVuc2l6ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB1cGxvYWRlZFNpemUgKz0gKGF2ZXJhZ2VTaXplICogKGZpbGUucHJvZ3Jlc3MucGVyY2VudGFnZSB8fCAwKSkgLyAxMDBcbiAgICB9KVxuXG4gICAgbGV0IHRvdGFsUHJvZ3Jlc3MgPSB0b3RhbFNpemUgPT09IDBcbiAgICAgID8gMFxuICAgICAgOiBNYXRoLnJvdW5kKCh1cGxvYWRlZFNpemUgLyB0b3RhbFNpemUpICogMTAwKVxuXG4gICAgLy8gaG90IGZpeCwgYmVjYXVzZTpcbiAgICAvLyB1cGxvYWRlZFNpemUgZW5kZWQgdXAgbGFyZ2VyIHRoYW4gdG90YWxTaXplLCByZXN1bHRpbmcgaW4gMTMyNSUgdG90YWxcbiAgICBpZiAodG90YWxQcm9ncmVzcyA+IDEwMCkge1xuICAgICAgdG90YWxQcm9ncmVzcyA9IDEwMFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB0b3RhbFByb2dyZXNzIH0pXG4gICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIHRvdGFsUHJvZ3Jlc3MpXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGxpc3RlbmVycyBmb3IgYWxsIGdsb2JhbCBhY3Rpb25zLCBsaWtlOlxuICAgKiBgZXJyb3JgLCBgZmlsZS1yZW1vdmVkYCwgYHVwbG9hZC1wcm9ncmVzc2BcbiAgICovXG4gICNhZGRMaXN0ZW5lcnMgKCkge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtmaWxlXVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbcmVzcG9uc2VdXG4gICAgICovXG4gICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycm9yLCBmaWxlLCByZXNwb25zZSkgPT4ge1xuICAgICAgbGV0IGVycm9yTXNnID0gZXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcidcbiAgICAgIGlmIChlcnJvci5kZXRhaWxzKSB7XG4gICAgICAgIGVycm9yTXNnICs9IGAgJHtlcnJvci5kZXRhaWxzfWBcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBlcnJvck1zZyB9KVxuXG4gICAgICBpZiAoZmlsZSAhPSBudWxsICYmIGZpbGUuaWQgaW4gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKSB7XG4gICAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgICBlcnJvcjogZXJyb3JNc2csXG4gICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vbignZXJyb3InLCBlcnJvckhhbmRsZXIpXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtZXJyb3InLCAoZmlsZSwgZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBlcnJvckhhbmRsZXIoZXJyb3IsIGZpbGUsIHJlc3BvbnNlKVxuXG4gICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Vycm9yID0gbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIG5ld0Vycm9yLmRldGFpbHMgPSBlcnJvci5tZXNzYWdlXG4gICAgICAgIGlmIChlcnJvci5kZXRhaWxzKSB7XG4gICAgICAgICAgbmV3RXJyb3IuZGV0YWlscyArPSBgICR7ZXJyb3IuZGV0YWlsc31gXG4gICAgICAgIH1cbiAgICAgICAgbmV3RXJyb3IubWVzc2FnZSA9IHRoaXMuaTE4bignZmFpbGVkVG9VcGxvYWQnLCB7IGZpbGU6IGZpbGUubmFtZSB9KVxuICAgICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KG5ld0Vycm9yLCB7XG4gICAgICAgICAgdGhyb3dFcnI6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4jc2hvd09yTG9nRXJyb3JBbmRUaHJvdyhlcnJvciwge1xuICAgICAgICAgIHRocm93RXJyOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3VwbG9hZC1zdGFydGVkJywgKGZpbGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5nZXRGaWxlKGZpbGUuaWQpKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyBwcm9ncmVzcyBmb3IgYSBmaWxlIHRoYXQgaGFzIGJlZW4gcmVtb3ZlZDogJHtmaWxlLmlkfWApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIHVwbG9hZFN0YXJ0ZWQ6IERhdGUubm93KCksXG4gICAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDAsXG4gICAgICAgICAgYnl0ZXNVcGxvYWRlZDogMCxcbiAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLnNpemUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtcHJvZ3Jlc3MnLCB0aGlzLmNhbGN1bGF0ZVByb2dyZXNzKVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXN1Y2Nlc3MnLCAoZmlsZSwgdXBsb2FkUmVzcCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRQcm9ncmVzcyA9IHRoaXMuZ2V0RmlsZShmaWxlLmlkKS5wcm9ncmVzc1xuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZS5pZCwge1xuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgIC4uLmN1cnJlbnRQcm9ncmVzcyxcbiAgICAgICAgICBwb3N0cHJvY2VzczogdGhpcy4jcG9zdFByb2Nlc3NvcnMuc2l6ZSA+IDAgPyB7XG4gICAgICAgICAgICBtb2RlOiAnaW5kZXRlcm1pbmF0ZScsXG4gICAgICAgICAgfSA6IG51bGwsXG4gICAgICAgICAgdXBsb2FkQ29tcGxldGU6IHRydWUsXG4gICAgICAgICAgcGVyY2VudGFnZTogMTAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGN1cnJlbnRQcm9ncmVzcy5ieXRlc1RvdGFsLFxuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZTogdXBsb2FkUmVzcCxcbiAgICAgICAgdXBsb2FkVVJMOiB1cGxvYWRSZXNwLnVwbG9hZFVSTCxcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gUmVtb3RlIHByb3ZpZGVycyBzb21ldGltZXMgZG9uJ3QgdGVsbCB1cyB0aGUgZmlsZSBzaXplLFxuICAgICAgLy8gYnV0IHdlIGNhbiBrbm93IGhvdyBtYW55IGJ5dGVzIHdlIHVwbG9hZGVkIG9uY2UgdGhlIHVwbG9hZCBpcyBjb21wbGV0ZS5cbiAgICAgIGlmIChmaWxlLnNpemUgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgc2l6ZTogdXBsb2FkUmVzcC5ieXRlc1VwbG9hZGVkIHx8IGN1cnJlbnRQcm9ncmVzcy5ieXRlc1RvdGFsLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsUHJvZ3Jlc3MoKVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdwcmVwcm9jZXNzLXByb2dyZXNzJywgKGZpbGUsIHByb2dyZXNzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGUuaWQsIHtcbiAgICAgICAgcHJvZ3Jlc3M6IHsgLi4udGhpcy5nZXRGaWxlKGZpbGUuaWQpLnByb2dyZXNzLCBwcmVwcm9jZXNzOiBwcm9ncmVzcyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncHJlcHJvY2Vzcy1jb21wbGV0ZScsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbGVzID0geyAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMgfVxuICAgICAgZmlsZXNbZmlsZS5pZF0gPSB7IC4uLmZpbGVzW2ZpbGUuaWRdLCBwcm9ncmVzczogeyAuLi5maWxlc1tmaWxlLmlkXS5wcm9ncmVzcyB9IH1cbiAgICAgIGRlbGV0ZSBmaWxlc1tmaWxlLmlkXS5wcm9ncmVzcy5wcmVwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlcyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdwb3N0cHJvY2Vzcy1wcm9ncmVzcycsIChmaWxlLCBwcm9ncmVzcykgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEZpbGUoZmlsZS5pZCkpIHtcbiAgICAgICAgdGhpcy5sb2coYE5vdCBzZXR0aW5nIHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdCBoYXMgYmVlbiByZW1vdmVkOiAke2ZpbGUuaWR9YClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgIHByb2dyZXNzOiB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5maWxlc1tmaWxlLmlkXS5wcm9ncmVzcywgcG9zdHByb2Nlc3M6IHByb2dyZXNzIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdwb3N0cHJvY2Vzcy1jb21wbGV0ZScsIChmaWxlKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0RmlsZShmaWxlLmlkKSkge1xuICAgICAgICB0aGlzLmxvZyhgTm90IHNldHRpbmcgcHJvZ3Jlc3MgZm9yIGEgZmlsZSB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7ZmlsZS5pZH1gKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbGVzID0ge1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkuZmlsZXMsXG4gICAgICB9XG4gICAgICBmaWxlc1tmaWxlLmlkXSA9IHtcbiAgICAgICAgLi4uZmlsZXNbZmlsZS5pZF0sXG4gICAgICAgIHByb2dyZXNzOiB7XG4gICAgICAgICAgLi4uZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBkZWxldGUgZmlsZXNbZmlsZS5pZF0ucHJvZ3Jlc3MucG9zdHByb2Nlc3NcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVzIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3Jlc3RvcmVkJywgKCkgPT4ge1xuICAgICAgLy8gRmlsZXMgbWF5IGhhdmUgY2hhbmdlZC0tZW5zdXJlIHByb2dyZXNzIGlzIHN0aWxsIGFjY3VyYXRlLlxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB9KVxuXG4gICAgLy8gc2hvdyBpbmZvcm1lciBpZiBvZmZsaW5lXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy4jdXBkYXRlT25saW5lU3RhdHVzKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgICBzZXRUaW1lb3V0KHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cywgMzAwMClcbiAgICB9XG4gIH1cblxuICB1cGRhdGVPbmxpbmVTdGF0dXMgKCkge1xuICAgIGNvbnN0IG9ubGluZVxuICAgICAgPSB0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5vbkxpbmUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gd2luZG93Lm5hdmlnYXRvci5vbkxpbmVcbiAgICAgICAgOiB0cnVlXG4gICAgaWYgKCFvbmxpbmUpIHtcbiAgICAgIHRoaXMuZW1pdCgnaXMtb2ZmbGluZScpXG4gICAgICB0aGlzLmluZm8odGhpcy5pMThuKCdub0ludGVybmV0Q29ubmVjdGlvbicpLCAnZXJyb3InLCAwKVxuICAgICAgdGhpcy53YXNPZmZsaW5lID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9ubGluZScpXG4gICAgICBpZiAodGhpcy53YXNPZmZsaW5lKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnYmFjay1vbmxpbmUnKVxuICAgICAgICB0aGlzLmluZm8odGhpcy5pMThuKCdjb25uZWN0ZWRUb0ludGVybmV0JyksICdzdWNjZXNzJywgMzAwMClcbiAgICAgICAgdGhpcy53YXNPZmZsaW5lID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAjdXBkYXRlT25saW5lU3RhdHVzID0gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMuYmluZCh0aGlzKVxuXG4gIGdldElEICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRzLmlkXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcGx1Z2luIHdpdGggQ29yZS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFBsdWdpbiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRzXSBvYmplY3Qgd2l0aCBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byBQbHVnaW5cbiAgICogQHJldHVybnMge29iamVjdH0gc2VsZiBmb3IgY2hhaW5pbmdcbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zaGFkb3dcbiAgdXNlIChQbHVnaW4sIG9wdHMpIHtcbiAgICBpZiAodHlwZW9mIFBsdWdpbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgbXNnID0gYEV4cGVjdGVkIGEgcGx1Z2luIGNsYXNzLCBidXQgZ290ICR7UGx1Z2luID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIFBsdWdpbn0uYFxuICAgICAgICArICcgUGxlYXNlIHZlcmlmeSB0aGF0IHRoZSBwbHVnaW4gd2FzIGltcG9ydGVkIGFuZCBzcGVsbGVkIGNvcnJlY3RseS4nXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG1zZylcbiAgICB9XG5cbiAgICAvLyBJbnN0YW50aWF0ZVxuICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBQbHVnaW4odGhpcywgb3B0cylcbiAgICBjb25zdCBwbHVnaW5JZCA9IHBsdWdpbi5pZFxuXG4gICAgaWYgKCFwbHVnaW5JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIHBsdWdpbiBtdXN0IGhhdmUgYW4gaWQnKVxuICAgIH1cblxuICAgIGlmICghcGx1Z2luLnR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGEgdHlwZScpXG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RzUGx1Z2luQWxyZWFkeSA9IHRoaXMuZ2V0UGx1Z2luKHBsdWdpbklkKVxuICAgIGlmIChleGlzdHNQbHVnaW5BbHJlYWR5KSB7XG4gICAgICBjb25zdCBtc2cgPSBgQWxyZWFkeSBmb3VuZCBhIHBsdWdpbiBuYW1lZCAnJHtleGlzdHNQbHVnaW5BbHJlYWR5LmlkfScuIGBcbiAgICAgICAgKyBgVHJpZWQgdG8gdXNlOiAnJHtwbHVnaW5JZH0nLlxcbmBcbiAgICAgICAgKyAnVXBweSBwbHVnaW5zIG11c3QgaGF2ZSB1bmlxdWUgYGlkYCBvcHRpb25zLiBTZWUgaHR0cHM6Ly91cHB5LmlvL2RvY3MvcGx1Z2lucy8jaWQuJ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgICB9XG5cbiAgICBpZiAoUGx1Z2luLlZFUlNJT04pIHtcbiAgICAgIHRoaXMubG9nKGBVc2luZyAke3BsdWdpbklkfSB2JHtQbHVnaW4uVkVSU0lPTn1gKVxuICAgIH1cblxuICAgIGlmIChwbHVnaW4udHlwZSBpbiB0aGlzLiNwbHVnaW5zKSB7XG4gICAgICB0aGlzLiNwbHVnaW5zW3BsdWdpbi50eXBlXS5wdXNoKHBsdWdpbilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jcGx1Z2luc1twbHVnaW4udHlwZV0gPSBbcGx1Z2luXVxuICAgIH1cbiAgICBwbHVnaW4uaW5zdGFsbCgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgb25lIFBsdWdpbiBieSBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgcGx1Z2luIGlkXG4gICAqIEByZXR1cm5zIHtCYXNlUGx1Z2lufHVuZGVmaW5lZH1cbiAgICovXG4gIGdldFBsdWdpbiAoaWQpIHtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbnMgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLiNwbHVnaW5zKSkge1xuICAgICAgY29uc3QgZm91bmRQbHVnaW4gPSBwbHVnaW5zLmZpbmQocGx1Z2luID0+IHBsdWdpbi5pZCA9PT0gaWQpXG4gICAgICBpZiAoZm91bmRQbHVnaW4gIT0gbnVsbCkgcmV0dXJuIGZvdW5kUGx1Z2luXG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIFtTeW1ib2wuZm9yKCd1cHB5IHRlc3Q6IGdldFBsdWdpbnMnKV0gKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy4jcGx1Z2luc1t0eXBlXVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgYHVzZWBkIHBsdWdpbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG1ldGhvZCB0aGF0IHdpbGwgYmUgcnVuIG9uIGVhY2ggcGx1Z2luXG4gICAqL1xuICBpdGVyYXRlUGx1Z2lucyAobWV0aG9kKSB7XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLiNwbHVnaW5zKS5mbGF0KDEpLmZvckVhY2gobWV0aG9kKVxuICB9XG5cbiAgLyoqXG4gICAqIFVuaW5zdGFsbCBhbmQgcmVtb3ZlIGEgcGx1Z2luLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5zdGFuY2UgVGhlIHBsdWdpbiBpbnN0YW5jZSB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQbHVnaW4gKGluc3RhbmNlKSB7XG4gICAgdGhpcy5sb2coYFJlbW92aW5nIHBsdWdpbiAke2luc3RhbmNlLmlkfWApXG4gICAgdGhpcy5lbWl0KCdwbHVnaW4tcmVtb3ZlJywgaW5zdGFuY2UpXG5cbiAgICBpZiAoaW5zdGFuY2UudW5pbnN0YWxsKSB7XG4gICAgICBpbnN0YW5jZS51bmluc3RhbGwoKVxuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLiNwbHVnaW5zW2luc3RhbmNlLnR5cGVdXG4gICAgLy8gbGlzdC5pbmRleE9mIGZhaWxlZCBoZXJlLCBiZWNhdXNlIFZ1ZTMgY29udmVydGVkIHRoZSBwbHVnaW4gaW5zdGFuY2VcbiAgICAvLyB0byBhIFByb3h5IG9iamVjdCwgd2hpY2ggZmFpbGVkIHRoZSBzdHJpY3QgY29tcGFyaXNvbiB0ZXN0OlxuICAgIC8vIG9iaiAhPT0gb2JqUHJveHlcbiAgICBjb25zdCBpbmRleCA9IGxpc3QuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gaW5zdGFuY2UuaWQpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCB1cGRhdGVkU3RhdGUgPSB7XG4gICAgICBwbHVnaW5zOiB7XG4gICAgICAgIC4uLnN0YXRlLnBsdWdpbnMsXG4gICAgICAgIFtpbnN0YW5jZS5pZF06IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUodXBkYXRlZFN0YXRlKVxuICB9XG5cbiAgLyoqXG4gICAqIFVuaW5zdGFsbCBhbGwgcGx1Z2lucyBhbmQgY2xvc2UgZG93biB0aGlzIFVwcHkgaW5zdGFuY2UuXG4gICAqL1xuICBjbG9zZSAoKSB7XG4gICAgdGhpcy5sb2coYENsb3NpbmcgVXBweSBpbnN0YW5jZSAke3RoaXMub3B0cy5pZH06IHJlbW92aW5nIGFsbCBmaWxlcyBhbmQgdW5pbnN0YWxsaW5nIHBsdWdpbnNgKVxuXG4gICAgdGhpcy5yZXNldCgpXG5cbiAgICB0aGlzLiNzdG9yZVVuc3Vic2NyaWJlKClcblxuICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVQbHVnaW4ocGx1Z2luKVxuICAgIH0pXG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB0aGlzLiN1cGRhdGVPbmxpbmVTdGF0dXMpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMuI3VwZGF0ZU9ubGluZVN0YXR1cylcbiAgICB9XG4gIH1cblxuICBoaWRlSW5mbyAoKSB7XG4gICAgY29uc3QgeyBpbmZvIH0gPSB0aGlzLmdldFN0YXRlKClcblxuICAgIHRoaXMuc2V0U3RhdGUoeyBpbmZvOiBpbmZvLnNsaWNlKDEpIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2luZm8taGlkZGVuJylcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgaW5mbyBtZXNzYWdlIGluIGBzdGF0ZS5pbmZvYCwgc28gdGhhdCBVSSBwbHVnaW5zIGxpa2UgYEluZm9ybWVyYFxuICAgKiBjYW4gZGlzcGxheSB0aGUgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBvYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgYnkgdGhlIGluZm9ybWVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV1cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbl1cbiAgICovXG4gIGluZm8gKG1lc3NhZ2UsIHR5cGUgPSAnaW5mbycsIGR1cmF0aW9uID0gMzAwMCkge1xuICAgIGNvbnN0IGlzQ29tcGxleE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCdcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5mbzogW1xuICAgICAgICAuLi50aGlzLmdldFN0YXRlKCkuaW5mbyxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgbWVzc2FnZTogaXNDb21wbGV4TWVzc2FnZSA/IG1lc3NhZ2UubWVzc2FnZSA6IG1lc3NhZ2UsXG4gICAgICAgICAgZGV0YWlsczogaXNDb21wbGV4TWVzc2FnZSA/IG1lc3NhZ2UuZGV0YWlscyA6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaGlkZUluZm8oKSwgZHVyYXRpb24pXG5cbiAgICB0aGlzLmVtaXQoJ2luZm8tdmlzaWJsZScpXG4gIH1cblxuICAvKipcbiAgICogUGFzc2VzIG1lc3NhZ2VzIHRvIGEgZnVuY3Rpb24sIHByb3ZpZGVkIGluIGBvcHRzLmxvZ2dlcmAuXG4gICAqIElmIGBvcHRzLmxvZ2dlcjogVXBweS5kZWJ1Z0xvZ2dlcmAgb3IgYG9wdHMuZGVidWc6IHRydWVgLCBsb2dzIHRvIHRoZSBicm93c2VyIGNvbnNvbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gbWVzc2FnZSB0byBsb2dcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBvcHRpb25hbCBgZXJyb3JgIG9yIGB3YXJuaW5nYFxuICAgKi9cbiAgbG9nIChtZXNzYWdlLCB0eXBlKSB7XG4gICAgY29uc3QgeyBsb2dnZXIgfSA9IHRoaXMub3B0c1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnZXJyb3InOiBsb2dnZXIuZXJyb3IobWVzc2FnZSk7IGJyZWFrXG4gICAgICBjYXNlICd3YXJuaW5nJzogbG9nZ2VyLndhcm4obWVzc2FnZSk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiBsb2dnZXIuZGVidWcobWVzc2FnZSk7IGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmUgYW4gdXBsb2FkIGJ5IGl0cyBJRC5cbiAgICovXG4gIHJlc3RvcmUgKHVwbG9hZElEKSB7XG4gICAgdGhpcy5sb2coYENvcmU6IGF0dGVtcHRpbmcgdG8gcmVzdG9yZSB1cGxvYWQgXCIke3VwbG9hZElEfVwiYClcblxuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSkge1xuICAgICAgdGhpcy4jcmVtb3ZlVXBsb2FkKHVwbG9hZElEKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm9uZXhpc3RlbnQgdXBsb2FkJykpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gdXBsb2FkIGZvciBhIGJ1bmNoIG9mIGZpbGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGZpbGVJRHMgRmlsZSBJRHMgdG8gaW5jbHVkZSBpbiB0aGlzIHVwbG9hZC5cbiAgICogQHJldHVybnMge3N0cmluZ30gSUQgb2YgdGhpcyB1cGxvYWQuXG4gICAqL1xuICAjY3JlYXRlVXBsb2FkIChmaWxlSURzLCBvcHRzID0ge30pIHtcbiAgICAvLyB1cHB5LnJldHJ5QWxsIHNldHMgdGhpcyB0byB0cnVlIOKAlCB3aGVuIHJldHJ5aW5nIHdlIHdhbnQgdG8gaWdub3JlIGBhbGxvd05ld1VwbG9hZDogZmFsc2VgXG4gICAgY29uc3QgeyBmb3JjZUFsbG93TmV3VXBsb2FkID0gZmFsc2UgfSA9IG9wdHNcblxuICAgIGNvbnN0IHsgYWxsb3dOZXdVcGxvYWQsIGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBpZiAoIWFsbG93TmV3VXBsb2FkICYmICFmb3JjZUFsbG93TmV3VXBsb2FkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBuZXcgdXBsb2FkOiBhbHJlYWR5IHVwbG9hZGluZy4nKVxuICAgIH1cblxuICAgIGNvbnN0IHVwbG9hZElEID0gbmFub2lkKClcblxuICAgIHRoaXMuZW1pdCgndXBsb2FkJywge1xuICAgICAgaWQ6IHVwbG9hZElELFxuICAgICAgZmlsZUlEcyxcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhbGxvd05ld1VwbG9hZDogdGhpcy5vcHRzLmFsbG93TXVsdGlwbGVVcGxvYWRzICE9PSBmYWxzZSxcblxuICAgICAgY3VycmVudFVwbG9hZHM6IHtcbiAgICAgICAgLi4uY3VycmVudFVwbG9hZHMsXG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDAsXG4gICAgICAgICAgcmVzdWx0OiB7fSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiB1cGxvYWRJRFxuICB9XG5cbiAgW1N5bWJvbC5mb3IoJ3VwcHkgdGVzdDogY3JlYXRlVXBsb2FkJyldICguLi5hcmdzKSB7IHJldHVybiB0aGlzLiNjcmVhdGVVcGxvYWQoLi4uYXJncykgfVxuXG4gICNnZXRVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gIH1cblxuICAvKipcbiAgICogQWRkIGRhdGEgdG8gYW4gdXBsb2FkJ3MgcmVzdWx0IG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBEYXRhIHByb3BlcnRpZXMgdG8gYWRkIHRvIHRoZSByZXN1bHQgb2JqZWN0LlxuICAgKi9cbiAgYWRkUmVzdWx0RGF0YSAodXBsb2FkSUQsIGRhdGEpIHtcbiAgICBpZiAoIXRoaXMuI2dldFVwbG9hZCh1cGxvYWRJRCkpIHtcbiAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkID0geyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0sIHJlc3VsdDogeyAuLi5jdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF0ucmVzdWx0LCAuLi5kYXRhIH0gfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVwbG9hZHM6IHsgLi4uY3VycmVudFVwbG9hZHMsIFt1cGxvYWRJRF06IGN1cnJlbnRVcGxvYWQgfSxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiB1cGxvYWQsIGVnLiBpZiBpdCBoYXMgYmVlbiBjYW5jZWxlZCBvciBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJRCBUaGUgSUQgb2YgdGhlIHVwbG9hZC5cbiAgICovXG4gICNyZW1vdmVVcGxvYWQgKHVwbG9hZElEKSB7XG4gICAgY29uc3QgY3VycmVudFVwbG9hZHMgPSB7IC4uLnRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcyB9XG4gICAgZGVsZXRlIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkcyxcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhbiB1cGxvYWQuIFRoaXMgcGlja3MgdXAgd2hlcmUgaXQgbGVmdCBvZmYgaW4gY2FzZSB0aGUgdXBsb2FkIGlzIGJlaW5nIHJlc3RvcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgI3J1blVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBjb25zdCB1cGxvYWREYXRhID0gdGhpcy5nZXRTdGF0ZSgpLmN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXVxuICAgIGNvbnN0IHJlc3RvcmVTdGVwID0gdXBsb2FkRGF0YS5zdGVwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMuI3ByZVByb2Nlc3NvcnMsXG4gICAgICAuLi50aGlzLiN1cGxvYWRlcnMsXG4gICAgICAuLi50aGlzLiNwb3N0UHJvY2Vzc29ycyxcbiAgICBdXG4gICAgbGV0IGxhc3RTdGVwID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgICBzdGVwcy5mb3JFYWNoKChmbiwgc3RlcCkgPT4ge1xuICAgICAgLy8gU2tpcCB0aGlzIHN0ZXAgaWYgd2UgYXJlIHJlc3RvcmluZyBhbmQgaGF2ZSBhbHJlYWR5IGNvbXBsZXRlZCB0aGlzIHN0ZXAgYmVmb3JlLlxuICAgICAgaWYgKHN0ZXAgPCByZXN0b3JlU3RlcCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGFzdFN0ZXAgPSBsYXN0U3RlcC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICAgICAgaWYgKCFjdXJyZW50VXBsb2FkKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGVkVXBsb2FkID0ge1xuICAgICAgICAgIC4uLmN1cnJlbnRVcGxvYWQsXG4gICAgICAgICAgc3RlcCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGN1cnJlbnRVcGxvYWRzOiB7XG4gICAgICAgICAgICAuLi5jdXJyZW50VXBsb2FkcyxcbiAgICAgICAgICAgIFt1cGxvYWRJRF06IHVwZGF0ZWRVcGxvYWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBUT0RPIGdpdmUgdGhpcyB0aGUgYHVwZGF0ZWRVcGxvYWRgIG9iamVjdCBhcyBpdHMgb25seSBwYXJhbWV0ZXIgbWF5YmU/XG4gICAgICAgIC8vIE90aGVyd2lzZSB3aGVuIG1vcmUgbWV0YWRhdGEgbWF5IGJlIGFkZGVkIHRvIHRoZSB1cGxvYWQgdGhpcyB3b3VsZCBrZWVwIGdldHRpbmcgbW9yZSBwYXJhbWV0ZXJzXG4gICAgICAgIHJldHVybiBmbih1cGRhdGVkVXBsb2FkLmZpbGVJRHMsIHVwbG9hZElEKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICB9KS50aGVuKCgpID0+IG51bGwpXG4gICAgfSlcblxuICAgIC8vIE5vdCByZXR1cm5pbmcgdGhlIGBjYXRjaGBlZCBwcm9taXNlLCBiZWNhdXNlIHdlIHN0aWxsIHdhbnQgdG8gcmV0dXJuIGEgcmVqZWN0ZWRcbiAgICAvLyBwcm9taXNlIGZyb20gdGhpcyBtZXRob2QgaWYgdGhlIHVwbG9hZCBmYWlsZWQuXG4gICAgbGFzdFN0ZXAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIHRoaXMuI3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGxhc3RTdGVwLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gU2V0IHJlc3VsdCBkYXRhLlxuICAgICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICBjb25zdCBjdXJyZW50VXBsb2FkID0gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gICAgICBpZiAoIWN1cnJlbnRVcGxvYWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIE1hcmsgcG9zdHByb2Nlc3Npbmcgc3RlcCBhcyBjb21wbGV0ZSBpZiBuZWNlc3Nhcnk7IHRoaXMgYWRkcmVzc2VzIGEgY2FzZSB3aGVyZSB3ZSBtaWdodCBnZXRcbiAgICAgIC8vIHN0dWNrIGluIHRoZSBwb3N0cHJvY2Vzc2luZyBVSSB3aGlsZSB0aGUgdXBsb2FkIGlzIGZ1bGx5IGNvbXBsZXRlLlxuICAgICAgLy8gSWYgdGhlIHBvc3Rwcm9jZXNzaW5nIHN0ZXBzIGRvIG5vdCBkbyBhbnkgd29yaywgdGhleSBtYXkgbm90IGVtaXQgcG9zdHByb2Nlc3NpbmcgZXZlbnRzIGF0XG4gICAgICAvLyBhbGwsIGFuZCBuZXZlciBtYXJrIHRoZSBwb3N0cHJvY2Vzc2luZyBhcyBjb21wbGV0ZS4gVGhpcyBpcyBmaW5lIG9uIGl0cyBvd24gYnV0IHdlXG4gICAgICAvLyBpbnRyb2R1Y2VkIGNvZGUgaW4gdGhlIEB1cHB5L2NvcmUgdXBsb2FkLXN1Y2Nlc3MgaGFuZGxlciB0byBwcmVwYXJlIHBvc3Rwcm9jZXNzaW5nIHByb2dyZXNzXG4gICAgICAvLyBzdGF0ZSBpZiBhbnkgcG9zdHByb2Nlc3NvcnMgYXJlIHJlZ2lzdGVyZWQuIFRoYXQgaXMgdG8gYXZvaWQgYSBcImZsYXNoIG9mIGNvbXBsZXRlZCBzdGF0ZVwiXG4gICAgICAvLyBiZWZvcmUgdGhlIHBvc3Rwcm9jZXNzaW5nIHBsdWdpbnMgY2FuIGVtaXQgZXZlbnRzLlxuICAgICAgLy9cbiAgICAgIC8vIFNvLCBqdXN0IGluIGNhc2UgYW4gdXBsb2FkIHdpdGggcG9zdHByb2Nlc3NpbmcgcGx1Z2lucyAqaGFzKiBjb21wbGV0ZWQgKndpdGhvdXQqIGVtaXR0aW5nXG4gICAgICAvLyBwb3N0cHJvY2Vzc2luZyBjb21wbGV0aW9uLCB3ZSBkbyBpdCBpbnN0ZWFkLlxuICAgICAgY3VycmVudFVwbG9hZC5maWxlSURzLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgICAgaWYgKGZpbGUgJiYgZmlsZS5wcm9ncmVzcy5wb3N0cHJvY2Vzcykge1xuICAgICAgICAgIHRoaXMuZW1pdCgncG9zdHByb2Nlc3MtY29tcGxldGUnLCBmaWxlKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBmaWxlcyA9IGN1cnJlbnRVcGxvYWQuZmlsZUlEcy5tYXAoKGZpbGVJRCkgPT4gdGhpcy5nZXRGaWxlKGZpbGVJRCkpXG4gICAgICBjb25zdCBzdWNjZXNzZnVsID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiAhZmlsZS5lcnJvcilcbiAgICAgIGNvbnN0IGZhaWxlZCA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5lcnJvcilcbiAgICAgIHRoaXMuYWRkUmVzdWx0RGF0YSh1cGxvYWRJRCwgeyBzdWNjZXNzZnVsLCBmYWlsZWQsIHVwbG9hZElEIH0pXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBFbWl0IGNvbXBsZXRpb24gZXZlbnRzLlxuICAgICAgLy8gVGhpcyBpcyBpbiBhIHNlcGFyYXRlIGZ1bmN0aW9uIHNvIHRoYXQgdGhlIGBjdXJyZW50VXBsb2Fkc2AgdmFyaWFibGVcbiAgICAgIC8vIGFsd2F5cyByZWZlcnMgdG8gdGhlIGxhdGVzdCBzdGF0ZS4gSW4gdGhlIGhhbmRsZXIgcmlnaHQgYWJvdmUgaXQgcmVmZXJzXG4gICAgICAvLyB0byBhbiBvdXRkYXRlZCBvYmplY3Qgd2l0aG91dCB0aGUgYC5yZXN1bHRgIHByb3BlcnR5LlxuICAgICAgY29uc3QgeyBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICBpZiAoIWN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnJlbnRVcGxvYWQgPSBjdXJyZW50VXBsb2Fkc1t1cGxvYWRJRF1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSBjdXJyZW50VXBsb2FkXG4gICAgICB0aGlzLmVtaXQoJ2NvbXBsZXRlJywgcmVzdWx0KVxuXG4gICAgICB0aGlzLiNyZW1vdmVVcGxvYWQodXBsb2FkSUQpXG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMubG9nKGBOb3Qgc2V0dGluZyByZXN1bHQgZm9yIGFuIHVwbG9hZCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQ6ICR7dXBsb2FkSUR9YClcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IGFuIHVwbG9hZCBmb3IgYWxsIHRoZSBmaWxlcyB0aGF0IGFyZSBub3QgY3VycmVudGx5IGJlaW5nIHVwbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIHVwbG9hZCAoKSB7XG4gICAgaWYgKCF0aGlzLiNwbHVnaW5zLnVwbG9hZGVyPy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubG9nKCdObyB1cGxvYWRlciB0eXBlIHBsdWdpbnMgYXJlIHVzZWQnLCAnd2FybmluZycpXG4gICAgfVxuXG4gICAgbGV0IHsgZmlsZXMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3Qgb25CZWZvcmVVcGxvYWRSZXN1bHQgPSB0aGlzLm9wdHMub25CZWZvcmVVcGxvYWQoZmlsZXMpXG5cbiAgICBpZiAob25CZWZvcmVVcGxvYWRSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3Qgc3RhcnRpbmcgdGhlIHVwbG9hZCBiZWNhdXNlIG9uQmVmb3JlVXBsb2FkIHJldHVybmVkIGZhbHNlJykpXG4gICAgfVxuXG4gICAgaWYgKG9uQmVmb3JlVXBsb2FkUmVzdWx0ICYmIHR5cGVvZiBvbkJlZm9yZVVwbG9hZFJlc3VsdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZpbGVzID0gb25CZWZvcmVVcGxvYWRSZXN1bHRcbiAgICAgIC8vIFVwZGF0aW5nIGZpbGVzIGluIHN0YXRlLCBiZWNhdXNlIHVwbG9hZGVyIHBsdWdpbnMgcmVjZWl2ZSBmaWxlIElEcyxcbiAgICAgIC8vIGFuZCB0aGVuIGZldGNoIHRoZSBhY3R1YWwgZmlsZSBvYmplY3QgZnJvbSBzdGF0ZVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZpbGVzLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy4jY2hlY2tNaW5OdW1iZXJPZkZpbGVzKGZpbGVzKVxuICAgICAgICB0aGlzLiNjaGVja1JlcXVpcmVkTWV0YUZpZWxkcyhmaWxlcylcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVycilcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFVwbG9hZHMgfSA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgICAgICAvLyBnZXQgYSBsaXN0IG9mIGZpbGVzIHRoYXQgYXJlIGN1cnJlbnRseSBhc3NpZ25lZCB0byB1cGxvYWRzXG4gICAgICAgIGNvbnN0IGN1cnJlbnRseVVwbG9hZGluZ0ZpbGVzID0gT2JqZWN0LnZhbHVlcyhjdXJyZW50VXBsb2FkcykuZmxhdE1hcChjdXJyID0+IGN1cnIuZmlsZUlEcylcblxuICAgICAgICBjb25zdCB3YWl0aW5nRmlsZUlEcyA9IFtdXG4gICAgICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcbiAgICAgICAgICAvLyBpZiB0aGUgZmlsZSBoYXNuJ3Qgc3RhcnRlZCB1cGxvYWRpbmcgYW5kIGhhc24ndCBhbHJlYWR5IGJlZW4gYXNzaWduZWQgdG8gYW4gdXBsb2FkLi5cbiAgICAgICAgICBpZiAoKCFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQpICYmIChjdXJyZW50bHlVcGxvYWRpbmdGaWxlcy5pbmRleE9mKGZpbGVJRCkgPT09IC0xKSkge1xuICAgICAgICAgICAgd2FpdGluZ0ZpbGVJRHMucHVzaChmaWxlLmlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB1cGxvYWRJRCA9IHRoaXMuI2NyZWF0ZVVwbG9hZCh3YWl0aW5nRmlsZUlEcylcbiAgICAgICAgcmV0dXJuIHRoaXMuI3J1blVwbG9hZCh1cGxvYWRJRClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLiNzaG93T3JMb2dFcnJvckFuZFRocm93KGVyciwge1xuICAgICAgICAgIHNob3dJbmZvcm1lcjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICB9XG59XG5cbi8vIEV4cG9zZSBjbGFzcyBjb25zdHJ1Y3Rvci5cbm1vZHVsZS5leHBvcnRzID0gVXBweVxubW9kdWxlLmV4cG9ydHMuVXBweSA9IFVwcHlcbm1vZHVsZS5leHBvcnRzLlVJUGx1Z2luID0gVUlQbHVnaW5cbm1vZHVsZS5leHBvcnRzLkJhc2VQbHVnaW4gPSBCYXNlUGx1Z2luXG5tb2R1bGUuZXhwb3J0cy5kZWJ1Z0xvZ2dlciA9IGRlYnVnTG9nZ2VyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5jb25zdCBnZXRUaW1lU3RhbXAgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0VGltZVN0YW1wJylcblxuLy8gU3dhbGxvdyBhbGwgbG9ncywgZXhjZXB0IGVycm9ycy5cbi8vIGRlZmF1bHQgaWYgbG9nZ2VyIGlzIG5vdCBzZXQgb3IgZGVidWc6IGZhbHNlXG5jb25zdCBqdXN0RXJyb3JzTG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHt9LFxuICB3YXJuOiAoLi4uYXJncykgPT4ge30sXG4gIGVycm9yOiAoLi4uYXJncykgPT4gY29uc29sZS5lcnJvcihgW1VwcHldIFske2dldFRpbWVTdGFtcCgpfV1gLCAuLi5hcmdzKSxcbn1cblxuLy8gUHJpbnQgbG9ncyB0byBjb25zb2xlIHdpdGggbmFtZXNwYWNlICsgdGltZXN0YW1wLFxuLy8gc2V0IGJ5IGxvZ2dlcjogVXBweS5kZWJ1Z0xvZ2dlciBvciBkZWJ1ZzogdHJ1ZVxuY29uc3QgZGVidWdMb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4gY29uc29sZS5kZWJ1ZyhgW1VwcHldIFske2dldFRpbWVTdGFtcCgpfV1gLCAuLi5hcmdzKSxcbiAgd2FybjogKC4uLmFyZ3MpID0+IGNvbnNvbGUud2FybihgW1VwcHldIFske2dldFRpbWVTdGFtcCgpfV1gLCAuLi5hcmdzKSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBjb25zb2xlLmVycm9yKGBbVXBweV0gWyR7Z2V0VGltZVN0YW1wKCl9XWAsIC4uLmFyZ3MpLFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAganVzdEVycm9yc0xvZ2dlcixcbiAgZGVidWdMb2dnZXIsXG59XG4iLCIvLyBFZGdlIDE1LnggZG9lcyBub3QgZmlyZSAncHJvZ3Jlc3MnIGV2ZW50cyBvbiB1cGxvYWRzLlxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90cmFuc2xvYWRpdC91cHB5L2lzc3Vlcy85NDVcbi8vIEFuZCBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy8xMjIyNDUxMC9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyAodXNlckFnZW50KSB7XG4gIC8vIEFsbG93IHBhc3NpbmcgaW4gdXNlckFnZW50IGZvciB0ZXN0c1xuICBpZiAodXNlckFnZW50ID09IG51bGwpIHtcbiAgICB1c2VyQWdlbnQgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/IG5hdmlnYXRvci51c2VyQWdlbnQgOiBudWxsXG4gIH1cbiAgLy8gQXNzdW1lIGl0IHdvcmtzIGJlY2F1c2UgYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgc3VwcG9ydHMgcHJvZ3Jlc3MgZXZlbnRzLlxuICBpZiAoIXVzZXJBZ2VudCkgcmV0dXJuIHRydWVcblxuICBjb25zdCBtID0gL0VkZ2VcXC8oXFxkK1xcLlxcZCspLy5leGVjKHVzZXJBZ2VudClcbiAgaWYgKCFtKSByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IGVkZ2VWZXJzaW9uID0gbVsxXVxuICBsZXQgW21ham9yLCBtaW5vcl0gPSBlZGdlVmVyc2lvbi5zcGxpdCgnLicpXG4gIG1ham9yID0gcGFyc2VJbnQobWFqb3IsIDEwKVxuICBtaW5vciA9IHBhcnNlSW50KG1pbm9yLCAxMClcblxuICAvLyBXb3JrZWQgYmVmb3JlOlxuICAvLyBFZGdlIDQwLjE1MDYzLjAuMFxuICAvLyBNaWNyb3NvZnQgRWRnZUhUTUwgMTUuMTUwNjNcbiAgaWYgKG1ham9yIDwgMTUgfHwgKG1ham9yID09PSAxNSAmJiBtaW5vciA8IDE1MDYzKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBGaXhlZCBpbjpcbiAgLy8gTWljcm9zb2Z0IEVkZ2VIVE1MIDE4LjE4MjE4XG4gIGlmIChtYWpvciA+IDE4IHx8IChtYWpvciA9PT0gMTggJiYgbWlub3IgPj0gMTgyMTgpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIG90aGVyIHZlcnNpb25zIGRvbid0IHdvcmsuXG4gIHJldHVybiBmYWxzZVxufVxuIiwiY29uc3QgeyBVSVBsdWdpbiB9ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCB0b0FycmF5ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL3RvQXJyYXknKVxuY29uc3QgVHJhbnNsYXRvciA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9UcmFuc2xhdG9yJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGaWxlSW5wdXQgZXh0ZW5kcyBVSVBsdWdpbiB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdGaWxlSW5wdXQnXG4gICAgdGhpcy50aXRsZSA9ICdGaWxlIElucHV0J1xuICAgIHRoaXMudHlwZSA9ICdhY3F1aXJlcidcblxuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgLy8gVGhlIHNhbWUga2V5IGlzIHVzZWQgZm9yIHRoZSBzYW1lIHB1cnBvc2UgYnkgQHVwcHkvcm9ib2RvZydzIGBmb3JtKClgIEFQSSwgYnV0IG91clxuICAgICAgICAvLyBsb2NhbGUgcGFjayBzY3JpcHRzIGNhbid0IGFjY2VzcyBpdCBpbiBSb2JvZG9nLiBJZiBpdCBpcyB1cGRhdGVkIGhlcmUsIGl0IHNob3VsZFxuICAgICAgICAvLyBhbHNvIGJlIHVwZGF0ZWQgdGhlcmUhXG4gICAgICAgIGNob29zZUZpbGVzOiAnQ2hvb3NlIGZpbGVzJyxcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6IG51bGwsXG4gICAgICBwcmV0dHk6IHRydWUsXG4gICAgICBpbnB1dE5hbWU6ICdmaWxlc1tdJyxcbiAgICB9XG5cbiAgICAvLyBNZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIHRoaXMub3B0cyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICB0aGlzLnJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlID0gdGhpcy5oYW5kbGVJbnB1dENoYW5nZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKVxuICB9XG5cbiAgYWRkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBmaWxlcy5tYXAoKGZpbGUpID0+ICh7XG4gICAgICBzb3VyY2U6IHRoaXMuaWQsXG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICB0eXBlOiBmaWxlLnR5cGUsXG4gICAgICBkYXRhOiBmaWxlLFxuICAgIH0pKVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudXBweS5hZGRGaWxlcyhkZXNjcmlwdG9ycylcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMudXBweS5sb2coZXJyKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUlucHV0Q2hhbmdlIChldmVudCkge1xuICAgIHRoaXMudXBweS5sb2coJ1tGaWxlSW5wdXRdIFNvbWV0aGluZyBzZWxlY3RlZCB0aHJvdWdoIGlucHV0Li4uJylcbiAgICBjb25zdCBmaWxlcyA9IHRvQXJyYXkoZXZlbnQudGFyZ2V0LmZpbGVzKVxuICAgIHRoaXMuYWRkRmlsZXMoZmlsZXMpXG5cbiAgICAvLyBXZSBjbGVhciB0aGUgaW5wdXQgYWZ0ZXIgYSBmaWxlIGlzIHNlbGVjdGVkLCBiZWNhdXNlIG90aGVyd2lzZVxuICAgIC8vIGNoYW5nZSBldmVudCBpcyBub3QgZmlyZWQgaW4gQ2hyb21lIGFuZCBTYWZhcmkgd2hlbiBhIGZpbGVcbiAgICAvLyB3aXRoIHRoZSBzYW1lIG5hbWUgaXMgc2VsZWN0ZWQuXG4gICAgLy8gX19fV2h5IG5vdCB1c2UgdmFsdWU9XCJcIiBvbiA8aW5wdXQvPiBpbnN0ZWFkP1xuICAgIC8vICAgIEJlY2F1c2UgaWYgd2UgdXNlIHRoYXQgbWV0aG9kIG9mIGNsZWFyaW5nIHRoZSBpbnB1dCxcbiAgICAvLyAgICBDaHJvbWUgd2lsbCBub3QgdHJpZ2dlciBjaGFuZ2UgaWYgd2UgZHJvcCB0aGUgc2FtZSBmaWxlIHR3aWNlIChJc3N1ZSAjNzY4KS5cbiAgICBldmVudC50YXJnZXQudmFsdWUgPSBudWxsXG4gIH1cblxuICBoYW5kbGVDbGljayAoZXYpIHtcbiAgICB0aGlzLmlucHV0LmNsaWNrKClcbiAgfVxuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICAvKiBodHRwOi8vdHltcGFudXMubmV0L2NvZHJvcHMvMjAxNS8wOS8xNS9zdHlsaW5nLWN1c3RvbWl6aW5nLWZpbGUtaW5wdXRzLXNtYXJ0LXdheS8gKi9cbiAgICBjb25zdCBoaWRkZW5JbnB1dFN0eWxlID0ge1xuICAgICAgd2lkdGg6ICcwLjFweCcsXG4gICAgICBoZWlnaHQ6ICcwLjFweCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgIH1cblxuICAgIGNvbnN0IHsgcmVzdHJpY3Rpb25zIH0gPSB0aGlzLnVwcHkub3B0c1xuICAgIGNvbnN0IGFjY2VwdCA9IHJlc3RyaWN0aW9ucy5hbGxvd2VkRmlsZVR5cGVzID8gcmVzdHJpY3Rpb25zLmFsbG93ZWRGaWxlVHlwZXMuam9pbignLCcpIDogbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1Sb290IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJ1cHB5LUZpbGVJbnB1dC1pbnB1dFwiXG4gICAgICAgICAgc3R5bGU9e3RoaXMub3B0cy5wcmV0dHkgJiYgaGlkZGVuSW5wdXRTdHlsZX1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgbmFtZT17dGhpcy5vcHRzLmlucHV0TmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX1cbiAgICAgICAgICBtdWx0aXBsZT17cmVzdHJpY3Rpb25zLm1heE51bWJlck9mRmlsZXMgIT09IDF9XG4gICAgICAgICAgYWNjZXB0PXthY2NlcHR9XG4gICAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpcy5pbnB1dCA9IGlucHV0IH19XG4gICAgICAgIC8+XG4gICAgICAgIHt0aGlzLm9wdHMucHJldHR5XG4gICAgICAgICAgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInVwcHktRmlsZUlucHV0LWJ0blwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMuaTE4bignY2hvb3NlRmlsZXMnKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKVxuY29uc3QgcHJldHRpZXJCeXRlcyA9IHJlcXVpcmUoJ0B0cmFuc2xvYWRpdC9wcmV0dGllci1ieXRlcycpXG5jb25zdCBwcmV0dHlFVEEgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvcHJldHR5RVRBJylcbmNvbnN0IHsgaCB9ID0gcmVxdWlyZSgncHJlYWN0JylcbmNvbnN0IHN0YXR1c0JhclN0YXRlcyA9IHJlcXVpcmUoJy4vU3RhdHVzQmFyU3RhdGVzJylcblxuZnVuY3Rpb24gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzIChmaWxlcykge1xuICAvLyBDb2xsZWN0IHByZSBvciBwb3N0cHJvY2Vzc2luZyBwcm9ncmVzcyBzdGF0ZXMuXG4gIGNvbnN0IHByb2dyZXNzZXMgPSBbXVxuICBPYmplY3Qua2V5cyhmaWxlcykuZm9yRWFjaCgoZmlsZUlEKSA9PiB7XG4gICAgY29uc3QgeyBwcm9ncmVzcyB9ID0gZmlsZXNbZmlsZUlEXVxuICAgIGlmIChwcm9ncmVzcy5wcmVwcm9jZXNzKSB7XG4gICAgICBwcm9ncmVzc2VzLnB1c2gocHJvZ3Jlc3MucHJlcHJvY2VzcylcbiAgICB9XG4gICAgaWYgKHByb2dyZXNzLnBvc3Rwcm9jZXNzKSB7XG4gICAgICBwcm9ncmVzc2VzLnB1c2gocHJvZ3Jlc3MucG9zdHByb2Nlc3MpXG4gICAgfVxuICB9KVxuXG4gIC8vIEluIHRoZSBmdXR1cmUgd2Ugc2hvdWxkIHByb2JhYmx5IGRvIHRoaXMgZGlmZmVyZW50bHkuIEZvciBub3cgd2UnbGwgdGFrZSB0aGVcbiAgLy8gbW9kZSBhbmQgbWVzc2FnZSBmcm9tIHRoZSBmaXJzdCBmaWxl4oCmXG4gIGNvbnN0IHsgbW9kZSwgbWVzc2FnZSB9ID0gcHJvZ3Jlc3Nlc1swXVxuICBjb25zdCB2YWx1ZSA9IHByb2dyZXNzZXMuZmlsdGVyKGlzRGV0ZXJtaW5hdGUpLnJlZHVjZSgodG90YWwsIHByb2dyZXNzLCBpbmRleCwgYWxsKSA9PiB7XG4gICAgcmV0dXJuIHRvdGFsICsgcHJvZ3Jlc3MudmFsdWUgLyBhbGwubGVuZ3RoXG4gIH0sIDApXG4gIGZ1bmN0aW9uIGlzRGV0ZXJtaW5hdGUgKHByb2dyZXNzKSB7XG4gICAgcmV0dXJuIHByb2dyZXNzLm1vZGUgPT09ICdkZXRlcm1pbmF0ZSdcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW9kZSxcbiAgICBtZXNzYWdlLFxuICAgIHZhbHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVBhdXNlUmVzdW1lIChwcm9wcykge1xuICBpZiAocHJvcHMuaXNBbGxDb21wbGV0ZSkgcmV0dXJuXG5cbiAgaWYgKCFwcm9wcy5yZXN1bWFibGVVcGxvYWRzKSB7XG4gICAgcmV0dXJuIHByb3BzLnVwcHkuY2FuY2VsQWxsKClcbiAgfVxuXG4gIGlmIChwcm9wcy5pc0FsbFBhdXNlZCkge1xuICAgIHJldHVybiBwcm9wcy51cHB5LnJlc3VtZUFsbCgpXG4gIH1cblxuICByZXR1cm4gcHJvcHMudXBweS5wYXVzZUFsbCgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gKHByb3BzKSA9PiB7XG4gIHByb3BzID0gcHJvcHMgfHwge31cblxuICBjb25zdCB7XG4gICAgbmV3RmlsZXMsXG4gICAgYWxsb3dOZXdVcGxvYWQsXG4gICAgaXNVcGxvYWRJblByb2dyZXNzLFxuICAgIGlzQWxsUGF1c2VkLFxuICAgIHJlc3VtYWJsZVVwbG9hZHMsXG4gICAgZXJyb3IsXG4gICAgaGlkZVVwbG9hZEJ1dHRvbixcbiAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgaGlkZUNhbmNlbEJ1dHRvbixcbiAgICBoaWRlUmV0cnlCdXR0b24sXG4gICAgcmVjb3ZlcmVkU3RhdGUsXG4gIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHsgdXBsb2FkU3RhdGUgfSA9IHByb3BzXG5cbiAgbGV0IHByb2dyZXNzVmFsdWUgPSBwcm9wcy50b3RhbFByb2dyZXNzXG4gIGxldCBwcm9ncmVzc01vZGVcbiAgbGV0IHByb2dyZXNzQmFyQ29udGVudFxuXG4gIGlmICh1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BSRVBST0NFU1NJTkcgfHwgdXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9QT1NUUFJPQ0VTU0lORykge1xuICAgIGNvbnN0IHByb2dyZXNzID0gY2FsY3VsYXRlUHJvY2Vzc2luZ1Byb2dyZXNzKHByb3BzLmZpbGVzKVxuICAgIHByb2dyZXNzTW9kZSA9IHByb2dyZXNzLm1vZGVcbiAgICBpZiAocHJvZ3Jlc3NNb2RlID09PSAnZGV0ZXJtaW5hdGUnKSB7XG4gICAgICBwcm9ncmVzc1ZhbHVlID0gcHJvZ3Jlc3MudmFsdWUgKiAxMDBcbiAgICB9XG5cbiAgICBwcm9ncmVzc0JhckNvbnRlbnQgPSBQcm9ncmVzc0JhclByb2Nlc3NpbmcocHJvZ3Jlc3MpXG4gIH0gZWxzZSBpZiAodXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9DT01QTEVURSkge1xuICAgIHByb2dyZXNzQmFyQ29udGVudCA9IFByb2dyZXNzQmFyQ29tcGxldGUocHJvcHMpXG4gIH0gZWxzZSBpZiAodXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkcpIHtcbiAgICBpZiAoIXByb3BzLnN1cHBvcnRzVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgIHByb2dyZXNzTW9kZSA9ICdpbmRldGVybWluYXRlJ1xuICAgICAgcHJvZ3Jlc3NWYWx1ZSA9IG51bGxcbiAgICB9XG5cbiAgICBwcm9ncmVzc0JhckNvbnRlbnQgPSBQcm9ncmVzc0JhclVwbG9hZGluZyhwcm9wcylcbiAgfSBlbHNlIGlmICh1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0VSUk9SKSB7XG4gICAgcHJvZ3Jlc3NWYWx1ZSA9IHVuZGVmaW5lZFxuICAgIHByb2dyZXNzQmFyQ29udGVudCA9IFByb2dyZXNzQmFyRXJyb3IocHJvcHMpXG4gIH1cblxuICBjb25zdCB3aWR0aCA9IHR5cGVvZiBwcm9ncmVzc1ZhbHVlID09PSAnbnVtYmVyJyA/IHByb2dyZXNzVmFsdWUgOiAxMDBcbiAgbGV0IGlzSGlkZGVuID0gKHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfV0FJVElORyAmJiBwcm9wcy5oaWRlVXBsb2FkQnV0dG9uKVxuICAgIHx8ICh1cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkcgJiYgIXByb3BzLm5ld0ZpbGVzID4gMClcbiAgICB8fCAodXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9DT01QTEVURSAmJiBwcm9wcy5oaWRlQWZ0ZXJGaW5pc2gpXG5cbiAgbGV0IHNob3dVcGxvYWRCdG4gPSAhZXJyb3IgJiYgbmV3RmlsZXNcbiAgICAmJiAhaXNVcGxvYWRJblByb2dyZXNzICYmICFpc0FsbFBhdXNlZFxuICAgICYmIGFsbG93TmV3VXBsb2FkICYmICFoaWRlVXBsb2FkQnV0dG9uXG5cbiAgaWYgKHJlY292ZXJlZFN0YXRlKSB7XG4gICAgaXNIaWRkZW4gPSBmYWxzZVxuICAgIHNob3dVcGxvYWRCdG4gPSB0cnVlXG4gIH1cblxuICBjb25zdCBzaG93Q2FuY2VsQnRuID0gIWhpZGVDYW5jZWxCdXR0b25cbiAgICAmJiB1cGxvYWRTdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkdcbiAgICAmJiB1cGxvYWRTdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0NPTVBMRVRFXG4gIGNvbnN0IHNob3dQYXVzZVJlc3VtZUJ0biA9IHJlc3VtYWJsZVVwbG9hZHMgJiYgIWhpZGVQYXVzZVJlc3VtZUJ1dHRvblxuICAgICYmIHVwbG9hZFN0YXRlID09PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HXG5cbiAgY29uc3Qgc2hvd1JldHJ5QnRuID0gZXJyb3IgJiYgIWhpZGVSZXRyeUJ1dHRvblxuXG4gIGNvbnN0IHNob3dEb25lQnRuID0gcHJvcHMuZG9uZUJ1dHRvbkhhbmRsZXIgJiYgdXBsb2FkU3RhdGUgPT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9DT01QTEVURVxuXG4gIGNvbnN0IHByb2dyZXNzQ2xhc3NOYW1lcyA9IGB1cHB5LVN0YXR1c0Jhci1wcm9ncmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtwcm9ncmVzc01vZGUgPyBgaXMtJHtwcm9ncmVzc01vZGV9YCA6ICcnfWBcblxuICBjb25zdCBzdGF0dXNCYXJDbGFzc05hbWVzID0gY2xhc3NOYW1lcyhcbiAgICB7ICd1cHB5LVJvb3QnOiBwcm9wcy5pc1RhcmdldERPTUVsIH0sXG4gICAgJ3VwcHktU3RhdHVzQmFyJyxcbiAgICBgaXMtJHt1cGxvYWRTdGF0ZX1gLFxuICAgIHsgJ2hhcy1naG9zdHMnOiBwcm9wcy5pc1NvbWVHaG9zdCB9XG4gIClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdGF0dXNCYXJDbGFzc05hbWVzfSBhcmlhLWhpZGRlbj17aXNIaWRkZW59PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e3Byb2dyZXNzQ2xhc3NOYW1lc31cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3dpZHRofSVgIH19XG4gICAgICAgIHJvbGU9XCJwcm9ncmVzc2JhclwiXG4gICAgICAgIGFyaWEtbGFiZWw9e2Ake3dpZHRofSVgfVxuICAgICAgICBhcmlhLXZhbHVldGV4dD17YCR7d2lkdGh9JWB9XG4gICAgICAgIGFyaWEtdmFsdWVtaW49XCIwXCJcbiAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgIGFyaWEtdmFsdWVub3c9e3Byb2dyZXNzVmFsdWV9XG4gICAgICAvPlxuICAgICAge3Byb2dyZXNzQmFyQ29udGVudH1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItYWN0aW9uc1wiPlxuICAgICAgICB7c2hvd1VwbG9hZEJ0biA/IDxVcGxvYWRCdG4gey4uLnByb3BzfSB1cGxvYWRTdGF0ZT17dXBsb2FkU3RhdGV9IC8+IDogbnVsbH1cbiAgICAgICAge3Nob3dSZXRyeUJ0biA/IDxSZXRyeUJ0biB7Li4ucHJvcHN9IC8+IDogbnVsbH1cbiAgICAgICAge3Nob3dQYXVzZVJlc3VtZUJ0biA/IDxQYXVzZVJlc3VtZUJ1dHRvbiB7Li4ucHJvcHN9IC8+IDogbnVsbH1cbiAgICAgICAge3Nob3dDYW5jZWxCdG4gPyA8Q2FuY2VsQnRuIHsuLi5wcm9wc30gLz4gOiBudWxsfVxuICAgICAgICB7c2hvd0RvbmVCdG4gPyA8RG9uZUJ0biB7Li4ucHJvcHN9IC8+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFVwbG9hZEJ0biA9IChwcm9wcykgPT4ge1xuICBjb25zdCB1cGxvYWRCdG5DbGFzc05hbWVzID0gY2xhc3NOYW1lcyhcbiAgICAndXBweS11LXJlc2V0JyxcbiAgICAndXBweS1jLWJ0bicsXG4gICAgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bicsXG4gICAgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bi0tdXBsb2FkJyxcbiAgICB7ICd1cHB5LWMtYnRuLXByaW1hcnknOiBwcm9wcy51cGxvYWRTdGF0ZSA9PT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1dBSVRJTkcgfSxcbiAgICB7ICd1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4tLWRpc2FibGVkJzogcHJvcHMuaXNTb21lR2hvc3QgfVxuICApXG5cbiAgY29uc3QgdXBsb2FkQnRuVGV4dCA9IHByb3BzLm5ld0ZpbGVzICYmIHByb3BzLmlzVXBsb2FkU3RhcnRlZCAmJiAhcHJvcHMucmVjb3ZlcmVkU3RhdGVcbiAgICA/IHByb3BzLmkxOG4oJ3VwbG9hZFhOZXdGaWxlcycsIHsgc21hcnRfY291bnQ6IHByb3BzLm5ld0ZpbGVzIH0pXG4gICAgOiBwcm9wcy5pMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBwcm9wcy5uZXdGaWxlcyB9KVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9e3VwbG9hZEJ0bkNsYXNzTmFtZXN9XG4gICAgICBhcmlhLWxhYmVsPXtwcm9wcy5pMThuKCd1cGxvYWRYRmlsZXMnLCB7IHNtYXJ0X2NvdW50OiBwcm9wcy5uZXdGaWxlcyB9KX1cbiAgICAgIG9uQ2xpY2s9e3Byb3BzLnN0YXJ0VXBsb2FkfVxuICAgICAgZGlzYWJsZWQ9e3Byb3BzLmlzU29tZUdob3N0fVxuICAgICAgZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVxuICAgID5cbiAgICAgIHt1cGxvYWRCdG5UZXh0fVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmNvbnN0IFJldHJ5QnRuID0gKHByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1jLWJ0biB1cHB5LVN0YXR1c0Jhci1hY3Rpb25CdG4gdXBweS1TdGF0dXNCYXItYWN0aW9uQnRuLS1yZXRyeVwiXG4gICAgICBhcmlhLWxhYmVsPXtwcm9wcy5pMThuKCdyZXRyeVVwbG9hZCcpfVxuICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMudXBweS5yZXRyeUFsbCgpfVxuICAgICAgZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVxuICAgID5cbiAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBjbGFzc05hbWU9XCJ1cHB5LWMtaWNvblwiIHdpZHRoPVwiOFwiIGhlaWdodD1cIjEwXCIgdmlld0JveD1cIjAgMCA4IDEwXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNNCAyLjQwOGEyLjc1IDIuNzUgMCAxIDAgMi43NSAyLjc1LjYyNi42MjYgMCAwIDEgMS4yNS4wMTh2LjAyM2E0IDQgMCAxIDEtNC00LjA0MVYuMjVhLjI1LjI1IDAgMCAxIC4zODktLjIwOGwyLjI5OSAxLjUzM2EuMjUuMjUgMCAwIDEgMCAuNDE2bC0yLjMgMS41MzNBLjI1LjI1IDAgMCAxIDQgMy4zMTZ2LS45MDh6XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgICAge3Byb3BzLmkxOG4oJ3JldHJ5Jyl9XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuY29uc3QgQ2FuY2VsQnRuID0gKHByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHRpdGxlPXtwcm9wcy5pMThuKCdjYW5jZWwnKX1cbiAgICAgIGFyaWEtbGFiZWw9e3Byb3BzLmkxOG4oJ2NhbmNlbCcpfVxuICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMudXBweS5jYW5jZWxBbGwoKX1cbiAgICAgIGRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcbiAgICA+XG4gICAgICA8c3ZnIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgY2xhc3NOYW1lPVwidXBweS1jLWljb25cIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XG4gICAgICAgIDxnIGZpbGw9XCJub25lXCIgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgPGNpcmNsZSBmaWxsPVwiIzg4OFwiIGN4PVwiOFwiIGN5PVwiOFwiIHI9XCI4XCIgLz5cbiAgICAgICAgICA8cGF0aCBmaWxsPVwiI0ZGRlwiIGQ9XCJNOS4yODMgOGwyLjU2NyAyLjU2Ny0xLjI4MyAxLjI4M0w4IDkuMjgzIDUuNDMzIDExLjg1IDQuMTUgMTAuNTY3IDYuNzE3IDggNC4xNSA1LjQzMyA1LjQzMyA0LjE1IDggNi43MTdsMi41NjctMi41NjcgMS4yODMgMS4yODN6XCIgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC9idXR0b24+XG4gIClcbn1cblxuY29uc3QgUGF1c2VSZXN1bWVCdXR0b24gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBpc0FsbFBhdXNlZCwgaTE4biB9ID0gcHJvcHNcbiAgY29uc3QgdGl0bGUgPSBpc0FsbFBhdXNlZCA/IGkxOG4oJ3Jlc3VtZScpIDogaTE4bigncGF1c2UnKVxuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgYXJpYS1sYWJlbD17dGl0bGV9XG4gICAgICBjbGFzc05hbWU9XCJ1cHB5LXUtcmVzZXQgdXBweS1TdGF0dXNCYXItYWN0aW9uQ2lyY2xlQnRuXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlUGF1c2VSZXN1bWUocHJvcHMpfVxuICAgICAgZGF0YS11cHB5LXN1cGVyLWZvY3VzYWJsZVxuICAgID5cbiAgICAgIHtpc0FsbFBhdXNlZCA/IChcbiAgICAgICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIGNsYXNzTmFtZT1cInVwcHktYy1pY29uXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICAgICAgICAgIDxnIGZpbGw9XCJub25lXCIgZmlsbFJ1bGU9XCJldmVub2RkXCI+XG4gICAgICAgICAgICA8Y2lyY2xlIGZpbGw9XCIjODg4XCIgY3g9XCI4XCIgY3k9XCI4XCIgcj1cIjhcIiAvPlxuICAgICAgICAgICAgPHBhdGggZmlsbD1cIiNGRkZcIiBkPVwiTTYgNC4yNUwxMS41IDggNiAxMS43NXpcIiAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApIDogKFxuICAgICAgICA8c3ZnIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgY2xhc3NOYW1lPVwidXBweS1jLWljb25cIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XG4gICAgICAgICAgPGcgZmlsbD1cIm5vbmVcIiBmaWxsUnVsZT1cImV2ZW5vZGRcIj5cbiAgICAgICAgICAgIDxjaXJjbGUgZmlsbD1cIiM4ODhcIiBjeD1cIjhcIiBjeT1cIjhcIiByPVwiOFwiIC8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTUgNC41aDJ2N0g1di03em00IDBoMnY3SDl2LTd6XCIgZmlsbD1cIiNGRkZcIiAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmNvbnN0IERvbmVCdG4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBpMThuIH0gPSBwcm9wc1xuICByZXR1cm4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3NOYW1lPVwidXBweS11LXJlc2V0IHVwcHktYy1idG4gdXBweS1TdGF0dXNCYXItYWN0aW9uQnRuIHVwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bi0tZG9uZVwiXG4gICAgICBvbkNsaWNrPXtwcm9wcy5kb25lQnV0dG9uSGFuZGxlcn1cbiAgICAgIGRhdGEtdXBweS1zdXBlci1mb2N1c2FibGVcbiAgICA+XG4gICAgICB7aTE4bignZG9uZScpfVxuICAgIDwvYnV0dG9uPlxuICApXG59XG5cbmNvbnN0IExvYWRpbmdTcGlubmVyID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxzdmcgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3Bpbm5lclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCI+XG4gICAgICA8cGF0aCBkPVwiTTEzLjk4MyA2LjU0N2MtLjEyLTIuNTA5LTEuNjQtNC44OTMtMy45MzktNS45MzYtMi40OC0xLjEyNy01LjQ4OC0uNjU2LTcuNTU2IDEuMDk0Qy41MjQgMy4zNjctLjM5OCA2LjA0OC4xNjIgOC41NjJjLjU1NiAyLjQ5NSAyLjQ2IDQuNTIgNC45NCA1LjE4MyAyLjkzMi43ODQgNS42MS0uNjAyIDcuMjU2LTMuMDE1LTEuNDkzIDEuOTkzLTMuNzQ1IDMuMzA5LTYuMjk4IDIuODY4LTIuNTE0LS40MzQtNC41NzgtMi4zNDktNS4xNTMtNC44NGE2LjIyNiA2LjIyNiAwIDAgMSAyLjk4LTYuNzc4QzYuMzQuNTg2IDkuNzQgMS4xIDExLjM3MyAzLjQ5M2MuNDA3LjU5Ni42OTMgMS4yODIuODQyIDEuOTg4LjEyNy41OTguMDczIDEuMTk3LjE2MSAxLjc5NC4wNzguNTI1LjU0MyAxLjI1NyAxLjE1Ljg2NC41MjUtLjM0MS40OS0xLjA1LjQ1Ni0xLjU5Mi0uMDA3LS4xNS4wMi4zIDAgMFwiIGZpbGxSdWxlPVwiZXZlbm9kZFwiIC8+XG4gICAgPC9zdmc+XG4gIClcbn1cblxuY29uc3QgUHJvZ3Jlc3NCYXJQcm9jZXNzaW5nID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gTWF0aC5yb3VuZChwcm9wcy52YWx1ZSAqIDEwMClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItY29udGVudFwiPlxuICAgICAgPExvYWRpbmdTcGlubmVyIC8+XG4gICAgICB7cHJvcHMubW9kZSA9PT0gJ2RldGVybWluYXRlJyA/IGAke3ZhbHVlfSUgXFx1MDBCNyBgIDogJyd9XG4gICAgICB7cHJvcHMubWVzc2FnZX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCByZW5kZXJEb3QgPSAoKSA9PiAnIFxcdTAwQjcgJ1xuXG5jb25zdCBQcm9ncmVzc0RldGFpbHMgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgaWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWwgPSBwcm9wcy5udW1VcGxvYWRzID4gMVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNTZWNvbmRhcnlcIj5cbiAgICAgIHtcbiAgICAgICAgaWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWxcbiAgICAgICAgJiYgcHJvcHMuaTE4bignZmlsZXNVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgY29tcGxldGU6IHByb3BzLmNvbXBsZXRlLFxuICAgICAgICAgIHNtYXJ0X2NvdW50OiBwcm9wcy5udW1VcGxvYWRzLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItYWRkaXRpb25hbEluZm9cIj5cbiAgICAgICAgey8qIFdoZW4gc2hvdWxkIHdlIHJlbmRlciB0aGlzIGRvdD9cbiAgICAgICAgICAxLiAuLWFkZGl0aW9uYWxJbmZvIGlzIHNob3duIChoYXBwZW5zIG9ubHkgb24gZGVza3RvcHMpXG4gICAgICAgICAgMi4gQU5EICdmaWxlc1VwbG9hZGVkT2ZUb3RhbCcgd2FzIHNob3duXG4gICAgICAgICovfVxuICAgICAgICB7aWZTaG93RmlsZXNVcGxvYWRlZE9mVG90YWwgJiYgcmVuZGVyRG90KCl9XG5cbiAgICAgICAge1xuICAgICAgICAgIHByb3BzLmkxOG4oJ2RhdGFVcGxvYWRlZE9mVG90YWwnLCB7XG4gICAgICAgICAgICBjb21wbGV0ZTogcHJldHRpZXJCeXRlcyhwcm9wcy50b3RhbFVwbG9hZGVkU2l6ZSksXG4gICAgICAgICAgICB0b3RhbDogcHJldHRpZXJCeXRlcyhwcm9wcy50b3RhbFNpemUpLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICB7cmVuZGVyRG90KCl9XG5cbiAgICAgICAge1xuICAgICAgICAgIHByb3BzLmkxOG4oJ3hUaW1lTGVmdCcsIHtcbiAgICAgICAgICAgIHRpbWU6IHByZXR0eUVUQShwcm9wcy50b3RhbEVUQSksXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFVua25vd25Qcm9ncmVzc0RldGFpbHMgPSAocHJvcHMpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1NlY29uZGFyeVwiPlxuICAgICAge3Byb3BzLmkxOG4oJ2ZpbGVzVXBsb2FkZWRPZlRvdGFsJywgeyBjb21wbGV0ZTogcHJvcHMuY29tcGxldGUsIHNtYXJ0X2NvdW50OiBwcm9wcy5udW1VcGxvYWRzIH0pfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFVwbG9hZE5ld2x5QWRkZWRGaWxlcyA9IChwcm9wcykgPT4ge1xuICBjb25zdCB1cGxvYWRCdG5DbGFzc05hbWVzID0gY2xhc3NOYW1lcyhcbiAgICAndXBweS11LXJlc2V0JyxcbiAgICAndXBweS1jLWJ0bicsXG4gICAgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bicsXG4gICAgJ3VwcHktU3RhdHVzQmFyLWFjdGlvbkJ0bi0tdXBsb2FkTmV3bHlBZGRlZCdcbiAgKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNTZWNvbmRhcnlcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzU2Vjb25kYXJ5SGludFwiPlxuICAgICAgICB7cHJvcHMuaTE4bigneE1vcmVGaWxlc0FkZGVkJywgeyBzbWFydF9jb3VudDogcHJvcHMubmV3RmlsZXMgfSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT17dXBsb2FkQnRuQ2xhc3NOYW1lc31cbiAgICAgICAgYXJpYS1sYWJlbD17cHJvcHMuaTE4bigndXBsb2FkWEZpbGVzJywgeyBzbWFydF9jb3VudDogcHJvcHMubmV3RmlsZXMgfSl9XG4gICAgICAgIG9uQ2xpY2s9e3Byb3BzLnN0YXJ0VXBsb2FkfVxuICAgICAgPlxuICAgICAgICB7cHJvcHMuaTE4bigndXBsb2FkJyl9XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBUaHJvdHRsZWRQcm9ncmVzc0RldGFpbHMgPSB0aHJvdHRsZShQcm9ncmVzc0RldGFpbHMsIDUwMCwgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZSB9KVxuXG5jb25zdCBQcm9ncmVzc0JhclVwbG9hZGluZyA9IChwcm9wcykgPT4ge1xuICBpZiAoIXByb3BzLmlzVXBsb2FkU3RhcnRlZCB8fCBwcm9wcy5pc0FsbENvbXBsZXRlKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IHRpdGxlID0gcHJvcHMuaXNBbGxQYXVzZWQgPyBwcm9wcy5pMThuKCdwYXVzZWQnKSA6IHByb3BzLmkxOG4oJ3VwbG9hZGluZycpXG4gIGNvbnN0IHNob3dVcGxvYWROZXdseUFkZGVkRmlsZXMgPSBwcm9wcy5uZXdGaWxlcyAmJiBwcm9wcy5pc1VwbG9hZFN0YXJ0ZWRcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItY29udGVudFwiIGFyaWEtbGFiZWw9e3RpdGxlfSB0aXRsZT17dGl0bGV9PlxuICAgICAgeyFwcm9wcy5pc0FsbFBhdXNlZCA/IDxMb2FkaW5nU3Bpbm5lciAvPiA6IG51bGx9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1ByaW1hcnlcIj5cbiAgICAgICAgICB7cHJvcHMuc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyA/IGAke3RpdGxlfTogJHtwcm9wcy50b3RhbFByb2dyZXNzfSVgIDogdGl0bGV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7LyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5ICovfVxuICAgICAgICB7IXByb3BzLmlzQWxsUGF1c2VkICYmICFzaG93VXBsb2FkTmV3bHlBZGRlZEZpbGVzICYmIHByb3BzLnNob3dQcm9ncmVzc0RldGFpbHNcbiAgICAgICAgICA/IChwcm9wcy5zdXBwb3J0c1VwbG9hZFByb2dyZXNzID8gPFRocm90dGxlZFByb2dyZXNzRGV0YWlscyB7Li4ucHJvcHN9IC8+IDogPFVua25vd25Qcm9ncmVzc0RldGFpbHMgey4uLnByb3BzfSAvPilcbiAgICAgICAgICA6IG51bGx9XG4gICAgICAgIHtzaG93VXBsb2FkTmV3bHlBZGRlZEZpbGVzID8gPFVwbG9hZE5ld2x5QWRkZWRGaWxlcyB7Li4ucHJvcHN9IC8+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFByb2dyZXNzQmFyQ29tcGxldGUgPSAoeyB0b3RhbFByb2dyZXNzLCBpMThuIH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLWNvbnRlbnRcIiByb2xlPVwic3RhdHVzXCIgdGl0bGU9e2kxOG4oJ2NvbXBsZXRlJyl9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cHB5LVN0YXR1c0Jhci1zdGF0dXNQcmltYXJ5XCI+XG4gICAgICAgICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c0luZGljYXRvciB1cHB5LWMtaWNvblwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxMVwiIHZpZXdCb3g9XCIwIDAgMTUgMTFcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNLjQxNCA1Ljg0M0wxLjYyNyA0LjYzbDMuNDcyIDMuNDcyTDEzLjIwMiAwbDEuMjEyIDEuMjEzTDUuMSAxMC41Mjh6XCIgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICB7aTE4bignY29tcGxldGUnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBQcm9ncmVzc0JhckVycm9yID0gKHsgZXJyb3IsIHJldHJ5QWxsLCBoaWRlUmV0cnlCdXR0b24sIGkxOG4gfSkgPT4ge1xuICBmdW5jdGlvbiBkaXNwbGF5RXJyb3JBbGVydCAoKSB7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gYCR7aTE4bigndXBsb2FkRmFpbGVkJyl9IFxcblxcbiAke2Vycm9yfWBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYWxlcnRcbiAgICBhbGVydChlcnJvck1lc3NhZ2UpIC8vIFRPRE86IG1vdmUgdG8gY3VzdG9tIGFsZXJ0IGltcGxlbWVudGF0aW9uXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItY29udGVudFwiIHJvbGU9XCJhbGVydFwiIHRpdGxlPXtpMThuKCd1cGxvYWRGYWlsZWQnKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwcHktU3RhdHVzQmFyLXN0YXR1c1ByaW1hcnlcIj5cbiAgICAgICAgICA8c3ZnIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItc3RhdHVzSW5kaWNhdG9yIHVwcHktYy1pY29uXCIgd2lkdGg9XCIxMVwiIGhlaWdodD1cIjExXCIgdmlld0JveD1cIjAgMCAxMSAxMVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00LjI3OCA1LjVMMCAxLjIyMiAxLjIyMiAwIDUuNSA0LjI3OCA5Ljc3OCAwIDExIDEuMjIyIDYuNzIyIDUuNSAxMSA5Ljc3OCA5Ljc3OCAxMSA1LjUgNi43MjIgMS4yMjIgMTEgMCA5Ljc3OHpcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIHtpMThuKCd1cGxvYWRGYWlsZWQnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwidXBweS1TdGF0dXNCYXItZGV0YWlsc1wiXG4gICAgICAgIGFyaWEtbGFiZWw9e2Vycm9yfVxuICAgICAgICBkYXRhLW1pY3JvdGlwLXBvc2l0aW9uPVwidG9wLXJpZ2h0XCJcbiAgICAgICAgZGF0YS1taWNyb3RpcC1zaXplPVwibWVkaXVtXCJcbiAgICAgICAgb25DbGljaz17ZGlzcGxheUVycm9yQWxlcnR9XG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgPlxuICAgICAgICA/XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNUQVRFX0VSUk9SOiAnZXJyb3InLFxuICBTVEFURV9XQUlUSU5HOiAnd2FpdGluZycsXG4gIFNUQVRFX1BSRVBST0NFU1NJTkc6ICdwcmVwcm9jZXNzaW5nJyxcbiAgU1RBVEVfVVBMT0FESU5HOiAndXBsb2FkaW5nJyxcbiAgU1RBVEVfUE9TVFBST0NFU1NJTkc6ICdwb3N0cHJvY2Vzc2luZycsXG4gIFNUQVRFX0NPTVBMRVRFOiAnY29tcGxldGUnLFxufVxuIiwiY29uc3QgeyBVSVBsdWdpbiB9ID0gcmVxdWlyZSgnQHVwcHkvY29yZScpXG5jb25zdCBUcmFuc2xhdG9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1RyYW5zbGF0b3InKVxuY29uc3QgZ2V0U3BlZWQgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0U3BlZWQnKVxuY29uc3QgZ2V0Qnl0ZXNSZW1haW5pbmcgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvZ2V0Qnl0ZXNSZW1haW5pbmcnKVxuY29uc3QgZ2V0VGV4dERpcmVjdGlvbiA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRUZXh0RGlyZWN0aW9uJylcbmNvbnN0IHN0YXR1c0JhclN0YXRlcyA9IHJlcXVpcmUoJy4vU3RhdHVzQmFyU3RhdGVzJylcbmNvbnN0IFN0YXR1c0JhclVJID0gcmVxdWlyZSgnLi9TdGF0dXNCYXInKVxuXG4vKipcbiAqIFN0YXR1c0JhcjogcmVuZGVycyBhIHN0YXR1cyBiYXIgd2l0aCB1cGxvYWQvcGF1c2UvcmVzdW1lL2NhbmNlbC9yZXRyeSBidXR0b25zLFxuICogcHJvZ3Jlc3MgcGVyY2VudGFnZSBhbmQgdGltZSByZW1haW5pbmcuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgVUlQbHVnaW4ge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy5pZCA9IHRoaXMub3B0cy5pZCB8fCAnU3RhdHVzQmFyJ1xuICAgIHRoaXMudGl0bGUgPSAnU3RhdHVzQmFyJ1xuICAgIHRoaXMudHlwZSA9ICdwcm9ncmVzc2luZGljYXRvcidcblxuICAgIHRoaXMuZGVmYXVsdExvY2FsZSA9IHtcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgdXBsb2FkaW5nOiAnVXBsb2FkaW5nJyxcbiAgICAgICAgdXBsb2FkOiAnVXBsb2FkJyxcbiAgICAgICAgY29tcGxldGU6ICdDb21wbGV0ZScsXG4gICAgICAgIHVwbG9hZEZhaWxlZDogJ1VwbG9hZCBmYWlsZWQnLFxuICAgICAgICBwYXVzZWQ6ICdQYXVzZWQnLFxuICAgICAgICByZXRyeTogJ1JldHJ5JyxcbiAgICAgICAgcmV0cnlVcGxvYWQ6ICdSZXRyeSB1cGxvYWQnLFxuICAgICAgICBjYW5jZWw6ICdDYW5jZWwnLFxuICAgICAgICBwYXVzZTogJ1BhdXNlJyxcbiAgICAgICAgcmVzdW1lOiAnUmVzdW1lJyxcbiAgICAgICAgZG9uZTogJ0RvbmUnLFxuICAgICAgICBmaWxlc1VwbG9hZGVkT2ZUb3RhbDoge1xuICAgICAgICAgIDA6ICcle2NvbXBsZXRlfSBvZiAle3NtYXJ0X2NvdW50fSBmaWxlIHVwbG9hZGVkJyxcbiAgICAgICAgICAxOiAnJXtjb21wbGV0ZX0gb2YgJXtzbWFydF9jb3VudH0gZmlsZXMgdXBsb2FkZWQnLFxuICAgICAgICB9LFxuICAgICAgICBkYXRhVXBsb2FkZWRPZlRvdGFsOiAnJXtjb21wbGV0ZX0gb2YgJXt0b3RhbH0nLFxuICAgICAgICB4VGltZUxlZnQ6ICcle3RpbWV9IGxlZnQnLFxuICAgICAgICB1cGxvYWRYRmlsZXM6IHtcbiAgICAgICAgICAwOiAnVXBsb2FkICV7c21hcnRfY291bnR9IGZpbGUnLFxuICAgICAgICAgIDE6ICdVcGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZXMnLFxuICAgICAgICB9LFxuICAgICAgICB1cGxvYWRYTmV3RmlsZXM6IHtcbiAgICAgICAgICAwOiAnVXBsb2FkICsle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnVXBsb2FkICsle3NtYXJ0X2NvdW50fSBmaWxlcycsXG4gICAgICAgIH0sXG4gICAgICAgIHhNb3JlRmlsZXNBZGRlZDoge1xuICAgICAgICAgIDA6ICcle3NtYXJ0X2NvdW50fSBtb3JlIGZpbGUgYWRkZWQnLFxuICAgICAgICAgIDE6ICcle3NtYXJ0X2NvdW50fSBtb3JlIGZpbGVzIGFkZGVkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiAnYm9keScsXG4gICAgICBoaWRlVXBsb2FkQnV0dG9uOiBmYWxzZSxcbiAgICAgIGhpZGVSZXRyeUJ1dHRvbjogZmFsc2UsXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b246IGZhbHNlLFxuICAgICAgaGlkZUNhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBzaG93UHJvZ3Jlc3NEZXRhaWxzOiBmYWxzZSxcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdHJ1ZSxcbiAgICAgIGRvbmVCdXR0b25IYW5kbGVyOiBudWxsLFxuICAgIH1cblxuICAgIHRoaXMub3B0cyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdHMgfVxuXG4gICAgdGhpcy5pMThuSW5pdCgpXG5cbiAgICB0aGlzLnJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcylcbiAgICB0aGlzLmluc3RhbGwgPSB0aGlzLmluc3RhbGwuYmluZCh0aGlzKVxuICB9XG5cbiAgZ2V0VG90YWxTcGVlZCAoZmlsZXMpIHtcbiAgICBsZXQgdG90YWxTcGVlZCA9IDBcbiAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICB0b3RhbFNwZWVkICs9IGdldFNwZWVkKGZpbGUucHJvZ3Jlc3MpXG4gICAgfSlcbiAgICByZXR1cm4gdG90YWxTcGVlZFxuICB9XG5cbiAgZ2V0VG90YWxFVEEgKGZpbGVzKSB7XG4gICAgY29uc3QgdG90YWxTcGVlZCA9IHRoaXMuZ2V0VG90YWxTcGVlZChmaWxlcylcbiAgICBpZiAodG90YWxTcGVlZCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDBcbiAgICB9XG5cbiAgICBjb25zdCB0b3RhbEJ5dGVzUmVtYWluaW5nID0gZmlsZXMucmVkdWNlKCh0b3RhbCwgZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIHRvdGFsICsgZ2V0Qnl0ZXNSZW1haW5pbmcoZmlsZS5wcm9ncmVzcylcbiAgICB9LCAwKVxuXG4gICAgcmV0dXJuIE1hdGgucm91bmQodG90YWxCeXRlc1JlbWFpbmluZyAvIHRvdGFsU3BlZWQgKiAxMCkgLyAxMFxuICB9XG5cbiAgc3RhcnRVcGxvYWQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyByZWNvdmVyZWRTdGF0ZSB9ID0gdGhpcy51cHB5LmdldFN0YXRlKClcbiAgICBpZiAocmVjb3ZlcmVkU3RhdGUpIHtcbiAgICAgIHRoaXMudXBweS5lbWl0KCdyZXN0b3JlLWNvbmZpcm1lZCcpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudXBweS51cGxvYWQoKS5jYXRjaCgoKSA9PiB7XG4gICAgICAvLyBFcnJvciBsb2dnZWQgaW4gQ29yZVxuICAgIH0pXG4gIH1cblxuICBnZXRVcGxvYWRpbmdTdGF0ZSAoaXNBbGxFcnJvcmVkLCBpc0FsbENvbXBsZXRlLCByZWNvdmVyZWRTdGF0ZSwgZmlsZXMpIHtcbiAgICBpZiAoaXNBbGxFcnJvcmVkKSB7XG4gICAgICByZXR1cm4gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX0VSUk9SXG4gICAgfVxuXG4gICAgaWYgKGlzQWxsQ29tcGxldGUpIHtcbiAgICAgIHJldHVybiBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfQ09NUExFVEVcbiAgICB9XG5cbiAgICBpZiAocmVjb3ZlcmVkU3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfV0FJVElOR1xuICAgIH1cblxuICAgIGxldCBzdGF0ZSA9IHN0YXR1c0JhclN0YXRlcy5TVEFURV9XQUlUSU5HXG4gICAgY29uc3QgZmlsZUlEcyA9IE9iamVjdC5rZXlzKGZpbGVzKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZUlEcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgeyBwcm9ncmVzcyB9ID0gZmlsZXNbZmlsZUlEc1tpXV1cbiAgICAgIC8vIElmIEFOWSBmaWxlcyBhcmUgYmVpbmcgdXBsb2FkZWQgcmlnaHQgbm93LCBzaG93IHRoZSB1cGxvYWRpbmcgc3RhdGUuXG4gICAgICBpZiAocHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCAmJiAhcHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkdcbiAgICAgIH1cbiAgICAgIC8vIElmIGZpbGVzIGFyZSBiZWluZyBwcmVwcm9jZXNzZWQgQU5EIHBvc3Rwcm9jZXNzZWQgYXQgdGhpcyB0aW1lLCB3ZSBzaG93IHRoZVxuICAgICAgLy8gcHJlcHJvY2VzcyBzdGF0ZS4gSWYgYW55IGZpbGVzIGFyZSBiZWluZyB1cGxvYWRlZCB3ZSBzaG93IHVwbG9hZGluZy5cbiAgICAgIGlmIChwcm9ncmVzcy5wcmVwcm9jZXNzICYmIHN0YXRlICE9PSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfVVBMT0FESU5HKSB7XG4gICAgICAgIHN0YXRlID0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BSRVBST0NFU1NJTkdcbiAgICAgIH1cbiAgICAgIC8vIElmIE5PIGZpbGVzIGFyZSBiZWluZyBwcmVwcm9jZXNzZWQgb3IgdXBsb2FkZWQgcmlnaHQgbm93LCBidXQgc29tZSBmaWxlcyBhcmVcbiAgICAgIC8vIGJlaW5nIHBvc3Rwcm9jZXNzZWQsIHNob3cgdGhlIHBvc3Rwcm9jZXNzIHN0YXRlLlxuICAgICAgaWYgKHByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgICAgICAgJiYgc3RhdGUgIT09IHN0YXR1c0JhclN0YXRlcy5TVEFURV9VUExPQURJTkdcbiAgICAgICAgICAmJiBzdGF0ZSAhPT0gc3RhdHVzQmFyU3RhdGVzLlNUQVRFX1BSRVBST0NFU1NJTkcpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0dXNCYXJTdGF0ZXMuU1RBVEVfUE9TVFBST0NFU1NJTkdcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cblxuICByZW5kZXIgKHN0YXRlKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2FwYWJpbGl0aWVzLFxuICAgICAgZmlsZXMsXG4gICAgICBhbGxvd05ld1VwbG9hZCxcbiAgICAgIHRvdGFsUHJvZ3Jlc3MsXG4gICAgICBlcnJvcixcbiAgICAgIHJlY292ZXJlZFN0YXRlLFxuICAgIH0gPSBzdGF0ZVxuXG4gICAgY29uc3Qge1xuICAgICAgbmV3RmlsZXMsXG4gICAgICBzdGFydGVkRmlsZXMsXG4gICAgICBjb21wbGV0ZUZpbGVzLFxuICAgICAgaW5Qcm9ncmVzc05vdFBhdXNlZEZpbGVzLFxuXG4gICAgICBpc1VwbG9hZFN0YXJ0ZWQsXG4gICAgICBpc0FsbENvbXBsZXRlLFxuICAgICAgaXNBbGxFcnJvcmVkLFxuICAgICAgaXNBbGxQYXVzZWQsXG4gICAgICBpc1VwbG9hZEluUHJvZ3Jlc3MsXG4gICAgICBpc1NvbWVHaG9zdCxcbiAgICB9ID0gdGhpcy51cHB5LmdldE9iamVjdE9mRmlsZXNQZXJTdGF0ZSgpXG5cbiAgICAvLyBJZiBzb21lIHN0YXRlIHdhcyByZWNvdmVyZWQsIHdlIHdhbnQgdG8gc2hvdyBVcGxvYWQgYnV0dG9uL2NvdW50ZXJcbiAgICAvLyBmb3IgYWxsIHRoZSBmaWxlcywgYmVjYXVzZSBpbiB0aGlzIGNhc2UgaXTigJlzIG5vdCBhbiBVcGxvYWQgYnV0dG9uLFxuICAgIC8vIGJ1dCDigJxDb25maXJtIFJlc3RvcmUgQnV0dG9u4oCdXG4gICAgY29uc3QgbmV3RmlsZXNPclJlY292ZXJlZCA9IHJlY292ZXJlZFN0YXRlID8gT2JqZWN0LnZhbHVlcyhmaWxlcykgOiBuZXdGaWxlc1xuICAgIGNvbnN0IHRvdGFsRVRBID0gdGhpcy5nZXRUb3RhbEVUQShpblByb2dyZXNzTm90UGF1c2VkRmlsZXMpXG4gICAgY29uc3QgcmVzdW1hYmxlVXBsb2FkcyA9ICEhY2FwYWJpbGl0aWVzLnJlc3VtYWJsZVVwbG9hZHNcbiAgICBjb25zdCBzdXBwb3J0c1VwbG9hZFByb2dyZXNzID0gY2FwYWJpbGl0aWVzLnVwbG9hZFByb2dyZXNzICE9PSBmYWxzZVxuXG4gICAgbGV0IHRvdGFsU2l6ZSA9IDBcbiAgICBsZXQgdG90YWxVcGxvYWRlZFNpemUgPSAwXG5cbiAgICBzdGFydGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdG90YWxTaXplICs9IChmaWxlLnByb2dyZXNzLmJ5dGVzVG90YWwgfHwgMClcbiAgICAgIHRvdGFsVXBsb2FkZWRTaXplICs9IChmaWxlLnByb2dyZXNzLmJ5dGVzVXBsb2FkZWQgfHwgMClcbiAgICB9KVxuXG4gICAgcmV0dXJuIFN0YXR1c0JhclVJKHtcbiAgICAgIGVycm9yLFxuICAgICAgdXBsb2FkU3RhdGU6IHRoaXMuZ2V0VXBsb2FkaW5nU3RhdGUoaXNBbGxFcnJvcmVkLCBpc0FsbENvbXBsZXRlLCByZWNvdmVyZWRTdGF0ZSwgc3RhdGUuZmlsZXMgfHwge30pLFxuICAgICAgYWxsb3dOZXdVcGxvYWQsXG4gICAgICB0b3RhbFByb2dyZXNzLFxuICAgICAgdG90YWxTaXplLFxuICAgICAgdG90YWxVcGxvYWRlZFNpemUsXG4gICAgICBpc0FsbENvbXBsZXRlLFxuICAgICAgaXNBbGxQYXVzZWQsXG4gICAgICBpc0FsbEVycm9yZWQsXG4gICAgICBpc1VwbG9hZFN0YXJ0ZWQsXG4gICAgICBpc1VwbG9hZEluUHJvZ3Jlc3MsXG4gICAgICBpc1NvbWVHaG9zdCxcbiAgICAgIHJlY292ZXJlZFN0YXRlLFxuICAgICAgY29tcGxldGU6IGNvbXBsZXRlRmlsZXMubGVuZ3RoLFxuICAgICAgbmV3RmlsZXM6IG5ld0ZpbGVzT3JSZWNvdmVyZWQubGVuZ3RoLFxuICAgICAgbnVtVXBsb2Fkczogc3RhcnRlZEZpbGVzLmxlbmd0aCxcbiAgICAgIHRvdGFsRVRBLFxuICAgICAgZmlsZXMsXG4gICAgICBpMThuOiB0aGlzLmkxOG4sXG4gICAgICB1cHB5OiB0aGlzLnVwcHksXG4gICAgICBzdGFydFVwbG9hZDogdGhpcy5zdGFydFVwbG9hZCxcbiAgICAgIGRvbmVCdXR0b25IYW5kbGVyOiB0aGlzLm9wdHMuZG9uZUJ1dHRvbkhhbmRsZXIsXG4gICAgICByZXN1bWFibGVVcGxvYWRzLFxuICAgICAgc3VwcG9ydHNVcGxvYWRQcm9ncmVzcyxcbiAgICAgIHNob3dQcm9ncmVzc0RldGFpbHM6IHRoaXMub3B0cy5zaG93UHJvZ3Jlc3NEZXRhaWxzLFxuICAgICAgaGlkZVVwbG9hZEJ1dHRvbjogdGhpcy5vcHRzLmhpZGVVcGxvYWRCdXR0b24sXG4gICAgICBoaWRlUmV0cnlCdXR0b246IHRoaXMub3B0cy5oaWRlUmV0cnlCdXR0b24sXG4gICAgICBoaWRlUGF1c2VSZXN1bWVCdXR0b246IHRoaXMub3B0cy5oaWRlUGF1c2VSZXN1bWVCdXR0b24sXG4gICAgICBoaWRlQ2FuY2VsQnV0dG9uOiB0aGlzLm9wdHMuaGlkZUNhbmNlbEJ1dHRvbixcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdGhpcy5vcHRzLmhpZGVBZnRlckZpbmlzaCxcbiAgICAgIGlzVGFyZ2V0RE9NRWw6IHRoaXMuaXNUYXJnZXRET01FbCxcbiAgICB9KVxuICB9XG5cbiAgb25Nb3VudCAoKSB7XG4gICAgLy8gU2V0IHRoZSB0ZXh0IGRpcmVjdGlvbiBpZiB0aGUgcGFnZSBoYXMgbm90IGRlZmluZWQgb25lLlxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZ2V0VGV4dERpcmVjdGlvbihlbGVtZW50KVxuICAgIGlmICghZGlyZWN0aW9uKSB7XG4gICAgICBlbGVtZW50LmRpciA9ICdsdHInXG4gICAgfVxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgeyB0YXJnZXQgfSA9IHRoaXMub3B0c1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiLyoqXG4gKiBEZWZhdWx0IHN0b3JlIHRoYXQga2VlcHMgc3RhdGUgaW4gYSBzaW1wbGUgb2JqZWN0LlxuICovXG5jbGFzcyBEZWZhdWx0U3RvcmUge1xuICBzdGF0aWMgVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb25cblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5jYWxsYmFja3MgPSBbXVxuICB9XG5cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlXG4gIH1cblxuICBzZXRTdGF0ZSAocGF0Y2gpIHtcbiAgICBjb25zdCBwcmV2U3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUgfVxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHsgLi4udGhpcy5zdGF0ZSwgLi4ucGF0Y2ggfVxuXG4gICAgdGhpcy5zdGF0ZSA9IG5leHRTdGF0ZVxuICAgIHRoaXMuI3B1Ymxpc2gocHJldlN0YXRlLCBuZXh0U3RhdGUsIHBhdGNoKVxuICB9XG5cbiAgc3Vic2NyaWJlIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY2FsbGJhY2tzLnB1c2gobGlzdGVuZXIpXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLmluZGV4T2YobGlzdGVuZXIpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgI3B1Ymxpc2ggKC4uLmFyZ3MpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgbGlzdGVuZXIoLi4uYXJncylcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdFN0b3JlICgpIHtcbiAgcmV0dXJuIG5ldyBEZWZhdWx0U3RvcmUoKVxufVxuIiwiY29uc3QgdHVzID0gcmVxdWlyZSgndHVzLWpzLWNsaWVudCcpXG5cbmZ1bmN0aW9uIGlzQ29yZG92YSAoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAoXG4gICAgdHlwZW9mIHdpbmRvdy5QaG9uZUdhcCAhPT0gJ3VuZGVmaW5lZCdcbiAgICB8fCB0eXBlb2Ygd2luZG93LkNvcmRvdmEgIT09ICd1bmRlZmluZWQnXG4gICAgfHwgdHlwZW9mIHdpbmRvdy5jb3Jkb3ZhICE9PSAndW5kZWZpbmVkJ1xuICApXG59XG5cbmZ1bmN0aW9uIGlzUmVhY3ROYXRpdmUgKCkge1xuICByZXR1cm4gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB0eXBlb2YgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdzdHJpbmcnXG4gICAgJiYgbmF2aWdhdG9yLnByb2R1Y3QudG9Mb3dlckNhc2UoKSA9PT0gJ3JlYWN0bmF0aXZlJ1xufVxuXG4vLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4vLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuLy8gdGhlIG90aGVyIGluIGZvbGRlciBiIOKAlCBgYS9maWxlLmpwZ2AgYW5kIGBiL2ZpbGUuanBnYCwgd2hlbiBhZGRlZFxuLy8gdG9nZXRoZXIgd2l0aCBhIGZvbGRlciwgd2lsbCBiZSB0cmVhdGVkIGFzIDIgc2VwYXJhdGUgZmlsZXMuXG4vL1xuLy8gRm9yIFJlYWN0IE5hdGl2ZSBhbmQgQ29yZG92YSwgd2UgbGV0IHR1cy1qcy1jbGllbnTigJlzIGRlZmF1bHRcbi8vIGZpbmdlcnByaW50IGhhbmRsaW5nIHRha2UgY2hhcmdlLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRGaW5nZXJwcmludCAodXBweUZpbGVPYmopIHtcbiAgcmV0dXJuIChmaWxlLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKGlzQ29yZG92YSgpIHx8IGlzUmVhY3ROYXRpdmUoKSkge1xuICAgICAgcmV0dXJuIHR1cy5kZWZhdWx0T3B0aW9ucy5maW5nZXJwcmludChmaWxlLCBvcHRpb25zKVxuICAgIH1cblxuICAgIGNvbnN0IHVwcHlGaW5nZXJwcmludCA9IFtcbiAgICAgICd0dXMnLFxuICAgICAgdXBweUZpbGVPYmouaWQsXG4gICAgICBvcHRpb25zLmVuZHBvaW50LFxuICAgIF0uam9pbignLScpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwcHlGaW5nZXJwcmludClcbiAgfVxufVxuIiwiY29uc3QgeyBCYXNlUGx1Z2luIH0gPSByZXF1aXJlKCdAdXBweS9jb3JlJylcbmNvbnN0IHR1cyA9IHJlcXVpcmUoJ3R1cy1qcy1jbGllbnQnKVxuY29uc3QgeyBQcm92aWRlciwgUmVxdWVzdENsaWVudCwgU29ja2V0IH0gPSByZXF1aXJlKCdAdXBweS9jb21wYW5pb24tY2xpZW50JylcbmNvbnN0IGVtaXRTb2NrZXRQcm9ncmVzcyA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9lbWl0U29ja2V0UHJvZ3Jlc3MnKVxuY29uc3QgZ2V0U29ja2V0SG9zdCA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9nZXRTb2NrZXRIb3N0JylcbmNvbnN0IHNldHRsZSA9IHJlcXVpcmUoJ0B1cHB5L3V0aWxzL2xpYi9zZXR0bGUnKVxuY29uc3QgRXZlbnRUcmFja2VyID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL0V2ZW50VHJhY2tlcicpXG5jb25zdCBOZXR3b3JrRXJyb3IgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvTmV0d29ya0Vycm9yJylcbmNvbnN0IGlzTmV0d29ya0Vycm9yID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL2lzTmV0d29ya0Vycm9yJylcbmNvbnN0IHsgUmF0ZUxpbWl0ZWRRdWV1ZSB9ID0gcmVxdWlyZSgnQHVwcHkvdXRpbHMvbGliL1JhdGVMaW1pdGVkUXVldWUnKVxuY29uc3QgaGFzUHJvcGVydHkgPSByZXF1aXJlKCdAdXBweS91dGlscy9saWIvaGFzUHJvcGVydHknKVxuY29uc3QgZ2V0RmluZ2VycHJpbnQgPSByZXF1aXJlKCcuL2dldEZpbmdlcnByaW50JylcblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uJykuVHVzT3B0aW9uc30gVHVzT3B0aW9ucyAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJ3R1cy1qcy1jbGllbnQnKS5VcGxvYWRPcHRpb25zfSBSYXdUdXNPcHRpb25zICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnQHVwcHkvY29yZScpLlVwcHl9IFVwcHkgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCdAdXBweS9jb3JlJykuVXBweUZpbGV9IFVwcHlGaWxlICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnQHVwcHkvY29yZScpLkZhaWxlZFVwcHlGaWxlPHt9Pn0gRmFpbGVkVXBweUZpbGUgKi9cblxuLyoqXG4gKiBFeHRyYWN0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdHVzL3R1cy1qcy1jbGllbnQvYmxvYi9tYXN0ZXIvbGliL3VwbG9hZC5qcyNMMTNcbiAqIGV4Y2VwdGVkIHdlIHJlbW92ZWQgJ2ZpbmdlcnByaW50JyBrZXkgdG8gYXZvaWQgYWRkaW5nIG1vcmUgZGVwZW5kZW5jaWVzXG4gKlxuICogQHR5cGUge1Jhd1R1c09wdGlvbnN9XG4gKi9cbmNvbnN0IHR1c0RlZmF1bHRPcHRpb25zID0ge1xuICBlbmRwb2ludDogJycsXG5cbiAgdXBsb2FkVXJsOiBudWxsLFxuICBtZXRhZGF0YToge30sXG4gIHVwbG9hZFNpemU6IG51bGwsXG5cbiAgb25Qcm9ncmVzczogbnVsbCxcbiAgb25DaHVua0NvbXBsZXRlOiBudWxsLFxuICBvblN1Y2Nlc3M6IG51bGwsXG4gIG9uRXJyb3I6IG51bGwsXG5cbiAgb3ZlcnJpZGVQYXRjaE1ldGhvZDogZmFsc2UsXG4gIGhlYWRlcnM6IHt9LFxuICBhZGRSZXF1ZXN0SWQ6IGZhbHNlLFxuXG4gIGNodW5rU2l6ZTogSW5maW5pdHksXG4gIHJldHJ5RGVsYXlzOiBbMCwgMTAwMCwgMzAwMCwgNTAwMF0sXG4gIHBhcmFsbGVsVXBsb2FkczogMSxcbiAgcmVtb3ZlRmluZ2VycHJpbnRPblN1Y2Nlc3M6IGZhbHNlLFxuICB1cGxvYWRMZW5ndGhEZWZlcnJlZDogZmFsc2UsXG4gIHVwbG9hZERhdGFEdXJpbmdDcmVhdGlvbjogZmFsc2UsXG59XG5cbi8qKlxuICogVHVzIHJlc3VtYWJsZSBmaWxlIHVwbG9hZGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHVzIGV4dGVuZHMgQmFzZVBsdWdpbiB7XG4gIHN0YXRpYyBWRVJTSU9OID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHl9IHVwcHlcbiAgICogQHBhcmFtIHtUdXNPcHRpb25zfSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHN1cGVyKHVwcHksIG9wdHMpXG4gICAgdGhpcy50eXBlID0gJ3VwbG9hZGVyJ1xuICAgIHRoaXMuaWQgPSB0aGlzLm9wdHMuaWQgfHwgJ1R1cydcbiAgICB0aGlzLnRpdGxlID0gJ1R1cydcblxuICAgIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHVzZUZhc3RSZW1vdGVSZXRyeTogdHJ1ZSxcbiAgICAgIGxpbWl0OiA1LFxuICAgICAgcmV0cnlEZWxheXM6IFswLCAxMDAwLCAzMDAwLCA1MDAwXSxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgfVxuXG4gICAgLy8gbWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICAvKiogQHR5cGUge2ltcG9ydChcIi4uXCIpLlR1c09wdGlvbnN9ICovXG4gICAgdGhpcy5vcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0cyB9XG5cbiAgICBpZiAoJ2F1dG9SZXRyeScgaW4gb3B0cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGF1dG9SZXRyeWAgb3B0aW9uIHdhcyBkZXByZWNhdGVkIGFuZCBoYXMgYmVlbiByZW1vdmVkLicpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltdWx0YW5lb3VzIHVwbG9hZCBsaW1pdGluZyBpcyBzaGFyZWQgYWNyb3NzIGFsbCB1cGxvYWRzIHdpdGggdGhpcyBwbHVnaW4uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7UmF0ZUxpbWl0ZWRRdWV1ZX1cbiAgICAgKi9cbiAgICB0aGlzLnJlcXVlc3RzID0gbmV3IFJhdGVMaW1pdGVkUXVldWUodGhpcy5vcHRzLmxpbWl0KVxuXG4gICAgdGhpcy51cGxvYWRlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgdGhpcy51cGxvYWRlckV2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzLnVwbG9hZGVyU29ja2V0cyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIHRoaXMuaGFuZGxlUmVzZXRQcm9ncmVzcyA9IHRoaXMuaGFuZGxlUmVzZXRQcm9ncmVzcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVVcGxvYWQgPSB0aGlzLmhhbmRsZVVwbG9hZC5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVSZXNldFByb2dyZXNzICgpIHtcbiAgICBjb25zdCBmaWxlcyA9IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuZmlsZXMgfVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIC8vIE9ubHkgY2xvbmUgdGhlIGZpbGUgb2JqZWN0IGlmIGl0IGhhcyBhIFR1cyBgdXBsb2FkVXJsYCBhdHRhY2hlZC5cbiAgICAgIGlmIChmaWxlc1tmaWxlSURdLnR1cyAmJiBmaWxlc1tmaWxlSURdLnR1cy51cGxvYWRVcmwpIHtcbiAgICAgICAgY29uc3QgdHVzU3RhdGUgPSB7IC4uLmZpbGVzW2ZpbGVJRF0udHVzIH1cbiAgICAgICAgZGVsZXRlIHR1c1N0YXRlLnVwbG9hZFVybFxuICAgICAgICBmaWxlc1tmaWxlSURdID0geyAuLi5maWxlc1tmaWxlSURdLCB0dXM6IHR1c1N0YXRlIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy51cHB5LnNldFN0YXRlKHsgZmlsZXMgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiB1cCBhbGwgcmVmZXJlbmNlcyBmb3IgYSBmaWxlJ3MgdXBsb2FkOiB0aGUgdHVzLlVwbG9hZCBpbnN0YW5jZSxcbiAgICogYW55IGV2ZW50cyByZWxhdGVkIHRvIHRoZSBmaWxlLCBhbmQgdGhlIENvbXBhbmlvbiBXZWJTb2NrZXQgY29ubmVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJRFxuICAgKi9cbiAgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMgKGZpbGVJRCwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKHRoaXMudXBsb2FkZXJzW2ZpbGVJRF0pIHtcbiAgICAgIGNvbnN0IHVwbG9hZGVyID0gdGhpcy51cGxvYWRlcnNbZmlsZUlEXVxuXG4gICAgICB1cGxvYWRlci5hYm9ydCgpXG5cbiAgICAgIGlmIChvcHRzLmFib3J0KSB7XG4gICAgICAgIHVwbG9hZGVyLmFib3J0KHRydWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBsb2FkZXJzW2ZpbGVJRF0gPSBudWxsXG4gICAgfVxuICAgIGlmICh0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5yZW1vdmUoKVxuICAgICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy51cGxvYWRlclNvY2tldHNbZmlsZUlEXSkge1xuICAgICAgdGhpcy51cGxvYWRlclNvY2tldHNbZmlsZUlEXS5jbG9zZSgpXG4gICAgICB0aGlzLnVwbG9hZGVyU29ja2V0c1tmaWxlSURdID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgVHVzIHVwbG9hZC5cbiAgICpcbiAgICogQSBsb3QgY2FuIGhhcHBlbiBkdXJpbmcgYW4gdXBsb2FkLCBzbyB0aGlzIGlzIHF1aXRlIGhhcmQgdG8gZm9sbG93IVxuICAgKiAtIEZpcnN0LCB0aGUgdXBsb2FkIGlzIHN0YXJ0ZWQuIElmIHRoZSBmaWxlIHdhcyBhbHJlYWR5IHBhdXNlZCBieSB0aGUgdGltZSB0aGUgdXBsb2FkIHN0YXJ0cywgbm90aGluZyBzaG91bGQgaGFwcGVuLlxuICAgKiAgIElmIHRoZSBgbGltaXRgIG9wdGlvbiBpcyB1c2VkLCB0aGUgdXBsb2FkIG11c3QgYmUgcXVldWVkIG9udG8gdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZS5cbiAgICogICBXaGVuIGFuIHVwbG9hZCBzdGFydHMsIHdlIHN0b3JlIHRoZSB0dXMuVXBsb2FkIGluc3RhbmNlLCBhbmQgYW4gRXZlbnRUcmFja2VyIGluc3RhbmNlIHRoYXQgbWFuYWdlcyB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAqICAgZm9yIHBhdXNpbmcsIGNhbmNlbGxhdGlvbiwgcmVtb3ZhbCwgZXRjLlxuICAgKiAtIFdoaWxlIHRoZSB1cGxvYWQgaXMgaW4gcHJvZ3Jlc3MsIGl0IG1heSBiZSBwYXVzZWQgb3IgY2FuY2VsbGVkLlxuICAgKiAgIFBhdXNpbmcgYWJvcnRzIHRoZSB1bmRlcmx5aW5nIHR1cy5VcGxvYWQsIGFuZCByZW1vdmVzIHRoZSB1cGxvYWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLiBBbGwgb3RoZXIgc3RhdGUgaXNcbiAgICogICBtYWludGFpbmVkLlxuICAgKiAgIENhbmNlbGxpbmcgcmVtb3ZlcyB0aGUgdXBsb2FkIGZyb20gdGhlIGB0aGlzLnJlcXVlc3RzYCBxdWV1ZSwgYW5kIGNvbXBsZXRlbHkgYWJvcnRzIHRoZSB1cGxvYWQtLSB0aGUgYHR1cy5VcGxvYWRgXG4gICAqICAgaW5zdGFuY2UgaXMgYWJvcnRlZCBhbmQgZGlzY2FyZGVkLCB0aGUgRXZlbnRUcmFja2VyIGluc3RhbmNlIGlzIGRlc3Ryb3llZCAocmVtb3ZpbmcgYWxsIGxpc3RlbmVycykuXG4gICAqICAgUmVzdW1pbmcgdGhlIHVwbG9hZCB1c2VzIHRoZSBgdGhpcy5yZXF1ZXN0c2AgcXVldWUgYXMgd2VsbCwgdG8gcHJldmVudCBzZWxlY3RpdmVseSBwYXVzaW5nIGFuZCByZXN1bWluZyB1cGxvYWRzIGZyb21cbiAgICogICBieXBhc3NpbmcgdGhlIGxpbWl0LlxuICAgKiAtIEFmdGVyIGNvbXBsZXRpbmcgYW4gdXBsb2FkLCB0aGUgdHVzLlVwbG9hZCBhbmQgRXZlbnRUcmFja2VyIGluc3RhbmNlcyBhcmUgY2xlYW5lZCB1cCwgYW5kIHRoZSB1cGxvYWQgaXMgbWFya2VkIGFzIGRvbmVcbiAgICogICBpbiB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLlxuICAgKiAtIFdoZW4gYW4gdXBsb2FkIGNvbXBsZXRlZCB3aXRoIGFuIGVycm9yLCB0aGUgc2FtZSBoYXBwZW5zIGFzIG9uIHN1Y2Nlc3NmdWwgY29tcGxldGlvbiwgYnV0IHRoZSBgdXBsb2FkKClgIHByb21pc2UgaXNcbiAgICogICByZWplY3RlZC5cbiAgICpcbiAgICogV2hlbiB3b3JraW5nIG9uIHRoaXMgZnVuY3Rpb24sIGtlZXAgaW4gbWluZDpcbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY29tcGxldGVkIG9yIGNhbmNlbGxlZCBmb3IgYW55IHJlYXNvbiwgdGhlIHR1cy5VcGxvYWQgYW5kIEV2ZW50VHJhY2tlciBpbnN0YW5jZXMgbmVlZCB0byBiZSBjbGVhbmVkXG4gICAqICAgIHVwIHVzaW5nIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS5cbiAgICogIC0gV2hlbiBhbiB1cGxvYWQgaXMgY2FuY2VsbGVkIG9yIHBhdXNlZCwgZm9yIGFueSByZWFzb24sIGl0IG5lZWRzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlIHVzaW5nXG4gICAqICAgIGBxdWV1ZWRSZXF1ZXN0LmFib3J0KClgLlxuICAgKiAgLSBXaGVuIGFuIHVwbG9hZCBpcyBjb21wbGV0ZWQgZm9yIGFueSByZWFzb24sIGluY2x1ZGluZyBlcnJvcnMsIGl0IG5lZWRzIHRvIGJlIG1hcmtlZCBhcyBzdWNoIHVzaW5nXG4gICAqICAgIGBxdWV1ZWRSZXF1ZXN0LmRvbmUoKWAuXG4gICAqICAtIFdoZW4gYW4gdXBsb2FkIGlzIHN0YXJ0ZWQgb3IgcmVzdW1lZCwgaXQgbmVlZHMgdG8gZ28gdGhyb3VnaCB0aGUgYHRoaXMucmVxdWVzdHNgIHF1ZXVlLiBUaGUgYHF1ZXVlZFJlcXVlc3RgIHZhcmlhYmxlXG4gICAqICAgIG11c3QgYmUgdXBkYXRlZCBzbyB0aGUgb3RoZXIgdXNlcyBvZiBpdCBhcmUgdmFsaWQuXG4gICAqICAtIEJlZm9yZSByZXBsYWNpbmcgdGhlIGBxdWV1ZWRSZXF1ZXN0YCB2YXJpYWJsZSwgdGhlIHByZXZpb3VzIGBxdWV1ZWRSZXF1ZXN0YCBtdXN0IGJlIGFib3J0ZWQsIGVsc2UgaXQgd2lsbCBrZWVwIHRha2luZ1xuICAgKiAgICB1cCBhIHNwb3QgaW4gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIHVwbG9hZCAoZmlsZSwgY3VycmVudCwgdG90YWwpIHtcbiAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQpXG5cbiAgICAvLyBDcmVhdGUgYSBuZXcgdHVzIHVwbG9hZFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuXG4gICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICAuLi50aGlzLm9wdHMsXG4gICAgICAgIC4uLihmaWxlLnR1cyB8fCB7fSksXG4gICAgICB9XG5cbiAgICAgIC8qKiBAdHlwZSB7UmF3VHVzT3B0aW9uc30gKi9cbiAgICAgIGNvbnN0IHVwbG9hZE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLnR1c0RlZmF1bHRPcHRpb25zLFxuICAgICAgICAuLi5vcHRzLFxuICAgICAgfVxuXG4gICAgICAvLyBXZSBvdmVycmlkZSB0dXMgZmluZ2VycHJpbnQgdG8gdXBweeKAmXMgYGZpbGUuaWRgLCBzaW5jZSB0aGUgYGZpbGUuaWRgXG4gICAgICAvLyBub3cgYWxzbyBpbmNsdWRlcyBgcmVsYXRpdmVQYXRoYCBmb3IgZmlsZXMgYWRkZWQgZnJvbSBmb2xkZXJzLlxuICAgICAgLy8gVGhpcyBtZWFucyB5b3UgY2FuIGFkZCAyIGlkZW50aWNhbCBmaWxlcywgaWYgb25lIGlzIGluIGZvbGRlciBhLFxuICAgICAgLy8gdGhlIG90aGVyIGluIGZvbGRlciBiLlxuICAgICAgdXBsb2FkT3B0aW9ucy5maW5nZXJwcmludCA9IGdldEZpbmdlcnByaW50KGZpbGUpXG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25CZWZvcmVSZXF1ZXN0ID0gKHJlcSkgPT4ge1xuICAgICAgICBjb25zdCB4aHIgPSByZXEuZ2V0VW5kZXJseWluZ09iamVjdCgpXG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdHMud2l0aENyZWRlbnRpYWxzXG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzLm9uQmVmb3JlUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG9wdHMub25CZWZvcmVSZXF1ZXN0KHJlcSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB1cGxvYWRPcHRpb25zLm9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMudXBweS5sb2coZXJyKVxuXG4gICAgICAgIGNvbnN0IHhociA9IGVyci5vcmlnaW5hbFJlcXVlc3QgPyBlcnIub3JpZ2luYWxSZXF1ZXN0LmdldFVuZGVybHlpbmdPYmplY3QoKSA6IG51bGxcbiAgICAgICAgaWYgKGlzTmV0d29ya0Vycm9yKHhocikpIHtcbiAgICAgICAgICBlcnIgPSBuZXcgTmV0d29ya0Vycm9yKGVyciwgeGhyKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLCBlcnIpXG5cbiAgICAgICAgcmVqZWN0KGVycilcbiAgICAgIH1cblxuICAgICAgdXBsb2FkT3B0aW9ucy5vblByb2dyZXNzID0gKGJ5dGVzVXBsb2FkZWQsIGJ5dGVzVG90YWwpID0+IHtcbiAgICAgICAgdGhpcy5vblJlY2VpdmVVcGxvYWRVcmwoZmlsZSwgdXBsb2FkLnVybClcbiAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgICAgICB1cGxvYWRlcjogdGhpcyxcbiAgICAgICAgICBieXRlc1VwbG9hZGVkLFxuICAgICAgICAgIGJ5dGVzVG90YWwsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHVwbG9hZE9wdGlvbnMub25TdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1cGxvYWRSZXNwID0ge1xuICAgICAgICAgIHVwbG9hZFVSTDogdXBsb2FkLnVybCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcblxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN1Y2Nlc3MnLCBmaWxlLCB1cGxvYWRSZXNwKVxuXG4gICAgICAgIGlmICh1cGxvYWQudXJsKSB7XG4gICAgICAgICAgdGhpcy51cHB5LmxvZyhgRG93bmxvYWQgJHt1cGxvYWQuZmlsZS5uYW1lfSBmcm9tICR7dXBsb2FkLnVybH1gKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh1cGxvYWQpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvcHlQcm9wID0gKG9iaiwgc3JjUHJvcCwgZGVzdFByb3ApID0+IHtcbiAgICAgICAgaWYgKGhhc1Byb3BlcnR5KG9iaiwgc3JjUHJvcCkgJiYgIWhhc1Byb3BlcnR5KG9iaiwgZGVzdFByb3ApKSB7XG4gICAgICAgICAgb2JqW2Rlc3RQcm9wXSA9IG9ialtzcmNQcm9wXVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgc3RyaW5nPn0gKi9cbiAgICAgIGNvbnN0IG1ldGEgPSB7fVxuICAgICAgY29uc3QgbWV0YUZpZWxkcyA9IEFycmF5LmlzQXJyYXkob3B0cy5tZXRhRmllbGRzKVxuICAgICAgICA/IG9wdHMubWV0YUZpZWxkc1xuICAgICAgICAvLyBTZW5kIGFsb25nIGFsbCBmaWVsZHMgYnkgZGVmYXVsdC5cbiAgICAgICAgOiBPYmplY3Qua2V5cyhmaWxlLm1ldGEpXG4gICAgICBtZXRhRmllbGRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgbWV0YVtpdGVtXSA9IGZpbGUubWV0YVtpdGVtXVxuICAgICAgfSlcblxuICAgICAgLy8gdHVzZCB1c2VzIG1ldGFkYXRhIGZpZWxkcyAnZmlsZXR5cGUnIGFuZCAnZmlsZW5hbWUnXG4gICAgICBjb3B5UHJvcChtZXRhLCAndHlwZScsICdmaWxldHlwZScpXG4gICAgICBjb3B5UHJvcChtZXRhLCAnbmFtZScsICdmaWxlbmFtZScpXG5cbiAgICAgIHVwbG9hZE9wdGlvbnMubWV0YWRhdGEgPSBtZXRhXG5cbiAgICAgIGNvbnN0IHVwbG9hZCA9IG5ldyB0dXMuVXBsb2FkKGZpbGUuZGF0YSwgdXBsb2FkT3B0aW9ucylcbiAgICAgIHRoaXMudXBsb2FkZXJzW2ZpbGUuaWRdID0gdXBsb2FkXG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIHVwbG9hZC5maW5kUHJldmlvdXNVcGxvYWRzKCkudGhlbigocHJldmlvdXNVcGxvYWRzKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzVXBsb2FkID0gcHJldmlvdXNVcGxvYWRzWzBdXG4gICAgICAgIGlmIChwcmV2aW91c1VwbG9hZCkge1xuICAgICAgICAgIHRoaXMudXBweS5sb2coYFtUdXNdIFJlc3VtaW5nIHVwbG9hZCBvZiAke2ZpbGUuaWR9IHN0YXJ0ZWQgYXQgJHtwcmV2aW91c1VwbG9hZC5jcmVhdGlvblRpbWV9YClcbiAgICAgICAgICB1cGxvYWQucmVzdW1lRnJvbVByZXZpb3VzVXBsb2FkKHByZXZpb3VzVXBsb2FkKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgaWYgKCFmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgdXBsb2FkLnN0YXJ0KClcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBoZXJlLCB0aGUgY2FsbGVyIHdpbGwgdGFrZSBjYXJlIG9mIGNhbmNlbGxpbmcgdGhlIHVwbG9hZCBpdHNlbGZcbiAgICAgICAgLy8gdXNpbmcgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS4gVGhpcyBpcyBiZWNhdXNlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgaGFzIHRvIGJlXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoaXMgcmVxdWVzdCBpcyBzdGlsbCBpbiB0aGUgcXVldWUsIGFuZCBoYXMgbm90IGJlZW4gc3RhcnRlZCB5ZXQsIHRvby4gQXRcbiAgICAgICAgLy8gdGhhdCBwb2ludCB0aGlzIGNhbmNlbGxhdGlvbiBmdW5jdGlvbiBpcyBub3QgZ29pbmcgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBBbHNvLCB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmVxdWVzdCBmcm9tIHRoZSBxdWV1ZSBfd2l0aG91dF8gZGVzdHJveWluZyBldmVyeXRoaW5nXG4gICAgICAgIC8vIHJlbGF0ZWQgdG8gdGhpcyB1cGxvYWQgdG8gaGFuZGxlIHBhdXNlcy5cbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uRmlsZVJlbW92ZShmaWxlLmlkLCAodGFyZ2V0RmlsZUlEKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQsIHsgYWJvcnQ6ICEhdXBsb2FkLnVybCB9KVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHt0YXJnZXRGaWxlSUR9IHdhcyByZW1vdmVkYClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZShmaWxlLmlkLCAoaXNQYXVzZWQpID0+IHtcbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgZmlsZSBmcm9tIHRoZSBxdWV1ZSBzbyBhbm90aGVyIGZpbGUgY2FuIHN0YXJ0IGluIGl0cyBwbGFjZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICB1cGxvYWQuYWJvcnQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlc3VtaW5nIGFuIHVwbG9hZCBzaG91bGQgYmUgcXVldWVkLCBlbHNlIHlvdSBjb3VsZCBwYXVzZSBhbmQgdGhlblxuICAgICAgICAgIC8vIHJlc3VtZSBhIHF1ZXVlZCB1cGxvYWQgdG8gbWFrZSBpdCBza2lwIHRoZSBxdWV1ZS5cbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgICBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdXBsb2FkLnN0YXJ0KClcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMub25QYXVzZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB1cGxvYWQuYWJvcnQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vbkNhbmNlbEFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICB0aGlzLnJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKGZpbGUuaWQsIHsgYWJvcnQ6ICEhdXBsb2FkLnVybCB9KVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgY2FuY2VsZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJlc3VtZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICAgIHVwbG9hZC5hYm9ydCgpXG4gICAgICAgIH1cbiAgICAgICAgcXVldWVkUmVxdWVzdCA9IHRoaXMucmVxdWVzdHMucnVuKCgpID0+IHtcbiAgICAgICAgICB1cGxvYWQuc3RhcnQoKVxuICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyKVxuICAgICAgdGhyb3cgZXJyXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlIGZvciB1c2Ugd2l0aCB1cGxvYWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnQgZmlsZSBpbiBhIHF1ZXVlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbCBudW1iZXIgb2YgZmlsZXMgaW4gYSBxdWV1ZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIHVwbG9hZFJlbW90ZSAoZmlsZSkge1xuICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcblxuICAgIGNvbnN0IG9wdHMgPSB7IC4uLnRoaXMub3B0cyB9XG4gICAgaWYgKGZpbGUudHVzKSB7XG4gICAgICAvLyBJbnN0YWxsIGZpbGUtc3BlY2lmaWMgdXBsb2FkIG92ZXJyaWRlcy5cbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cywgZmlsZS50dXMpXG4gICAgfVxuXG4gICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZSlcbiAgICB0aGlzLnVwcHkubG9nKGZpbGUucmVtb3RlLnVybClcblxuICAgIGlmIChmaWxlLnNlcnZlclRva2VuKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0VG9TZXJ2ZXJTb2NrZXQoZmlsZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgQ2xpZW50ID0gZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zLnByb3ZpZGVyID8gUHJvdmlkZXIgOiBSZXF1ZXN0Q2xpZW50XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHRoaXMudXBweSwgZmlsZS5yZW1vdGUucHJvdmlkZXJPcHRpb25zKVxuXG4gICAgICAvLyAhISBjYW5jZWxsYXRpb24gaXMgTk9UIHN1cHBvcnRlZCBhdCB0aGlzIHN0YWdlIHlldFxuICAgICAgY2xpZW50LnBvc3QoZmlsZS5yZW1vdGUudXJsLCB7XG4gICAgICAgIC4uLmZpbGUucmVtb3RlLmJvZHksXG4gICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICB1cGxvYWRVcmw6IG9wdHMudXBsb2FkVXJsLFxuICAgICAgICBwcm90b2NvbDogJ3R1cycsXG4gICAgICAgIHNpemU6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICBoZWFkZXJzOiBvcHRzLmhlYWRlcnMsXG4gICAgICAgIG1ldGFkYXRhOiBmaWxlLm1ldGEsXG4gICAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7IHNlcnZlclRva2VuOiByZXMudG9rZW4gfSlcbiAgICAgICAgZmlsZSA9IHRoaXMudXBweS5nZXRGaWxlKGZpbGUuaWQpXG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RUb1NlcnZlclNvY2tldChmaWxlKVxuICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyKVxuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSB0aGUgY29tbWVudCBvbiB0aGUgdXBsb2FkKCkgbWV0aG9kLlxuICAgKlxuICAgKiBBZGRpdGlvbmFsbHksIHdoZW4gYW4gdXBsb2FkIGlzIHJlbW92ZWQsIGNvbXBsZXRlZCwgb3IgY2FuY2VsbGVkLCB3ZSBuZWVkIHRvIGNsb3NlIHRoZSBXZWJTb2NrZXQgY29ubmVjdGlvbi4gVGhpcyBpc1xuICAgKiBoYW5kbGVkIGJ5IHRoZSByZXNldFVwbG9hZGVyUmVmZXJlbmNlcygpIGZ1bmN0aW9uLCBzbyB0aGUgc2FtZSBndWlkZWxpbmVzIGFwcGx5IGFzIGluIHVwbG9hZCgpLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlXG4gICAqL1xuICBjb25uZWN0VG9TZXJ2ZXJTb2NrZXQgKGZpbGUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW4gPSBmaWxlLnNlcnZlclRva2VuXG4gICAgICBjb25zdCBob3N0ID0gZ2V0U29ja2V0SG9zdChmaWxlLnJlbW90ZS5jb21wYW5pb25VcmwpXG4gICAgICBjb25zdCBzb2NrZXQgPSBuZXcgU29ja2V0KHsgdGFyZ2V0OiBgJHtob3N0fS9hcGkvJHt0b2tlbn1gLCBhdXRvT3BlbjogZmFsc2UgfSlcbiAgICAgIHRoaXMudXBsb2FkZXJTb2NrZXRzW2ZpbGUuaWRdID0gc29ja2V0XG4gICAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGUuaWRdID0gbmV3IEV2ZW50VHJhY2tlcih0aGlzLnVwcHkpXG5cbiAgICAgIHRoaXMub25GaWxlUmVtb3ZlKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHNvY2tldC5zZW5kKCdjYW5jZWwnLCB7fSlcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgcmVtb3ZlZGApXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUGF1c2UoZmlsZS5pZCwgKGlzUGF1c2VkKSA9PiB7XG4gICAgICAgIGlmIChpc1BhdXNlZCkge1xuICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIGZpbGUgZnJvbSB0aGUgcXVldWUgc28gYW5vdGhlciBmaWxlIGNhbiBzdGFydCBpbiBpdHMgcGxhY2UuXG4gICAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVzdW1pbmcgYW4gdXBsb2FkIHNob3VsZCBiZSBxdWV1ZWQsIGVsc2UgeW91IGNvdWxkIHBhdXNlIGFuZCB0aGVuXG4gICAgICAgICAgLy8gcmVzdW1lIGEgcXVldWVkIHVwbG9hZCB0byBtYWtlIGl0IHNraXAgdGhlIHF1ZXVlLlxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZCgncmVzdW1lJywge30pXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge31cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uUGF1c2VBbGwoZmlsZS5pZCwgKCkgPT4ge1xuICAgICAgICBxdWV1ZWRSZXF1ZXN0LmFib3J0KClcbiAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLm9uQ2FuY2VsQWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgcXVldWVkUmVxdWVzdC5hYm9ydCgpXG4gICAgICAgIHNvY2tldC5zZW5kKCdjYW5jZWwnLCB7fSlcbiAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICByZXNvbHZlKGB1cGxvYWQgJHtmaWxlLmlkfSB3YXMgY2FuY2VsZWRgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJlc3VtZUFsbChmaWxlLmlkLCAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgICBpZiAoZmlsZS5lcnJvcikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJlcXVlc3RzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3Jlc3VtZScsIHt9KVxuICAgICAgICAgIHJldHVybiAoKSA9PiB7fVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJldHJ5KGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgLy8gT25seSBkbyB0aGUgcmV0cnkgaWYgdGhlIHVwbG9hZCBpcyBhY3R1YWxseSBpbiBwcm9ncmVzcztcbiAgICAgICAgLy8gZWxzZSB3ZSBjb3VsZCB0cnkgdG8gc2VuZCB0aGVzZSBtZXNzYWdlcyB3aGVuIHRoZSB1cGxvYWQgaXMgc3RpbGwgcXVldWVkLlxuICAgICAgICAvLyBXZSBtYXkgbmVlZCBhIGJldHRlciBjaGVjayBmb3IgdGhpcyBzaW5jZSB0aGUgc29ja2V0IG1heSBhbHNvIGJlIGNsb3NlZFxuICAgICAgICAvLyBmb3Igb3RoZXIgcmVhc29ucywgbGlrZSBuZXR3b3JrIGZhaWx1cmVzLlxuICAgICAgICBpZiAoc29ja2V0LmlzT3Blbikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5vblJldHJ5QWxsKGZpbGUuaWQsICgpID0+IHtcbiAgICAgICAgLy8gU2VlIHRoZSBjb21tZW50IGluIHRoZSBvblJldHJ5KCkgY2FsbFxuICAgICAgICBpZiAoc29ja2V0LmlzT3Blbikge1xuICAgICAgICAgIHNvY2tldC5zZW5kKCdwYXVzZScsIHt9KVxuICAgICAgICAgIHNvY2tldC5zZW5kKCdyZXN1bWUnLCB7fSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgc29ja2V0Lm9uKCdwcm9ncmVzcycsIChwcm9ncmVzc0RhdGEpID0+IGVtaXRTb2NrZXRQcm9ncmVzcyh0aGlzLCBwcm9ncmVzc0RhdGEsIGZpbGUpKVxuXG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgKGVyckRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBlcnJEYXRhLmVycm9yXG4gICAgICAgIGNvbnN0IGVycm9yID0gT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IobWVzc2FnZSksIHsgY2F1c2U6IGVyckRhdGEuZXJyb3IgfSlcblxuICAgICAgICAvLyBJZiB0aGUgcmVtb3RlIHJldHJ5IG9wdGltaXNhdGlvbiBzaG91bGQgbm90IGJlIHVzZWQsXG4gICAgICAgIC8vIGNsb3NlIHRoZSBzb2NrZXTigJR0aGlzIHdpbGwgdGVsbCBjb21wYW5pb24gdG8gY2xlYXIgc3RhdGUgYW5kIGRlbGV0ZSB0aGUgZmlsZS5cbiAgICAgICAgaWYgKCF0aGlzLm9wdHMudXNlRmFzdFJlbW90ZVJldHJ5KSB7XG4gICAgICAgICAgdGhpcy5yZXNldFVwbG9hZGVyUmVmZXJlbmNlcyhmaWxlLmlkKVxuICAgICAgICAgIC8vIFJlbW92ZSB0aGUgc2VydmVyVG9rZW4gc28gdGhhdCBhIG5ldyBvbmUgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGUgcmV0cnkuXG4gICAgICAgICAgdGhpcy51cHB5LnNldEZpbGVTdGF0ZShmaWxlLmlkLCB7XG4gICAgICAgICAgICBzZXJ2ZXJUb2tlbjogbnVsbCxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNvY2tldC5jbG9zZSgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZSwgZXJyb3IpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0pXG5cbiAgICAgIHNvY2tldC5vbignc3VjY2VzcycsIChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwbG9hZFJlc3AgPSB7XG4gICAgICAgICAgdXBsb2FkVVJMOiBkYXRhLnVybCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUsIHVwbG9hZFJlc3ApXG4gICAgICAgIHRoaXMucmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoZmlsZS5pZClcbiAgICAgICAgcXVldWVkUmVxdWVzdC5kb25lKClcblxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG5cbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0cy5ydW4oKCkgPT4ge1xuICAgICAgICBzb2NrZXQub3BlbigpXG4gICAgICAgIGlmIChmaWxlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgc29ja2V0LnNlbmQoJ3BhdXNlJywge30pXG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBoZXJlLCB0aGUgY2FsbGVyIHdpbGwgdGFrZSBjYXJlIG9mIGNhbmNlbGxpbmcgdGhlIHVwbG9hZCBpdHNlbGZcbiAgICAgICAgLy8gdXNpbmcgcmVzZXRVcGxvYWRlclJlZmVyZW5jZXMoKS4gVGhpcyBpcyBiZWNhdXNlIHJlc2V0VXBsb2FkZXJSZWZlcmVuY2VzKCkgaGFzIHRvIGJlXG4gICAgICAgIC8vIGNhbGxlZCB3aGVuIHRoaXMgcmVxdWVzdCBpcyBzdGlsbCBpbiB0aGUgcXVldWUsIGFuZCBoYXMgbm90IGJlZW4gc3RhcnRlZCB5ZXQsIHRvby4gQXRcbiAgICAgICAgLy8gdGhhdCBwb2ludCB0aGlzIGNhbmNlbGxhdGlvbiBmdW5jdGlvbiBpcyBub3QgZ29pbmcgdG8gYmUgY2FsbGVkLlxuICAgICAgICAvLyBBbHNvLCB3ZSBuZWVkIHRvIHJlbW92ZSB0aGUgcmVxdWVzdCBmcm9tIHRoZSBxdWV1ZSBfd2l0aG91dF8gZGVzdHJveWluZyBldmVyeXRoaW5nXG4gICAgICAgIC8vIHJlbGF0ZWQgdG8gdGhpcyB1cGxvYWQgdG8gaGFuZGxlIHBhdXNlcy5cbiAgICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIHVwbG9hZFVybCBvbiB0aGUgZmlsZSBvcHRpb25zLCBzbyB0aGF0IHdoZW4gR29sZGVuIFJldHJpZXZlclxuICAgKiByZXN0b3JlcyBzdGF0ZSwgd2Ugd2lsbCBjb250aW51ZSB1cGxvYWRpbmcgdG8gdGhlIGNvcnJlY3QgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0ge1VwcHlGaWxlfSBmaWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRVUkxcbiAgICovXG4gIG9uUmVjZWl2ZVVwbG9hZFVybCAoZmlsZSwgdXBsb2FkVVJMKSB7XG4gICAgY29uc3QgY3VycmVudEZpbGUgPSB0aGlzLnVwcHkuZ2V0RmlsZShmaWxlLmlkKVxuICAgIGlmICghY3VycmVudEZpbGUpIHJldHVyblxuICAgIC8vIE9ubHkgZG8gdGhlIHVwZGF0ZSBpZiB3ZSBkaWRuJ3QgaGF2ZSBhbiB1cGxvYWQgVVJMIHlldC5cbiAgICBpZiAoIWN1cnJlbnRGaWxlLnR1cyB8fCBjdXJyZW50RmlsZS50dXMudXBsb2FkVXJsICE9PSB1cGxvYWRVUkwpIHtcbiAgICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFN0b3JpbmcgdXBsb2FkIHVybCcpXG4gICAgICB0aGlzLnVwcHkuc2V0RmlsZVN0YXRlKGN1cnJlbnRGaWxlLmlkLCB7XG4gICAgICAgIHR1czogeyAuLi5jdXJyZW50RmlsZS50dXMsIHVwbG9hZFVybDogdXBsb2FkVVJMIH0sXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nKTogdm9pZH0gY2JcbiAgICovXG4gIG9uRmlsZVJlbW92ZSAoZmlsZUlELCBjYikge1xuICAgIHRoaXMudXBsb2FkZXJFdmVudHNbZmlsZUlEXS5vbignZmlsZS1yZW1vdmVkJywgKGZpbGUpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IGZpbGUuaWQpIGNiKGZpbGUuaWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oYm9vbGVhbik6IHZvaWR9IGNiXG4gICAqL1xuICBvblBhdXNlIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCd1cGxvYWQtcGF1c2UnLCAodGFyZ2V0RmlsZUlELCBpc1BhdXNlZCkgPT4ge1xuICAgICAgaWYgKGZpbGVJRCA9PT0gdGFyZ2V0RmlsZUlEKSB7XG4gICAgICAgIC8vIGNvbnN0IGlzUGF1c2VkID0gdGhpcy51cHB5LnBhdXNlUmVzdW1lKGZpbGVJRClcbiAgICAgICAgY2IoaXNQYXVzZWQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUmV0cnkgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3VwbG9hZC1yZXRyeScsICh0YXJnZXRGaWxlSUQpID0+IHtcbiAgICAgIGlmIChmaWxlSUQgPT09IHRhcmdldEZpbGVJRCkge1xuICAgICAgICBjYigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUmV0cnlBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3JldHJ5LWFsbCcsIChmaWxlc1RvUmV0cnkpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uUGF1c2VBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3BhdXNlLWFsbCcsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy51cHB5LmdldEZpbGUoZmlsZUlEKSkgcmV0dXJuXG4gICAgICBjYigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlEXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gY2JcbiAgICovXG4gIG9uQ2FuY2VsQWxsIChmaWxlSUQsIGNiKSB7XG4gICAgdGhpcy51cGxvYWRlckV2ZW50c1tmaWxlSURdLm9uKCdjYW5jZWwtYWxsJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVwcHkuZ2V0RmlsZShmaWxlSUQpKSByZXR1cm5cbiAgICAgIGNiKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSURcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBjYlxuICAgKi9cbiAgb25SZXN1bWVBbGwgKGZpbGVJRCwgY2IpIHtcbiAgICB0aGlzLnVwbG9hZGVyRXZlbnRzW2ZpbGVJRF0ub24oJ3Jlc3VtZS1hbGwnLCAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpIHJldHVyblxuICAgICAgY2IoKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHsoVXBweUZpbGUgfCBGYWlsZWRVcHB5RmlsZSlbXX0gZmlsZXNcbiAgICovXG4gIHVwbG9hZEZpbGVzIChmaWxlcykge1xuICAgIGNvbnN0IHByb21pc2VzID0gZmlsZXMubWFwKChmaWxlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gaSArIDFcbiAgICAgIGNvbnN0IHRvdGFsID0gZmlsZXMubGVuZ3RoXG5cbiAgICAgIGlmICgnZXJyb3InIGluIGZpbGUgJiYgZmlsZS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGZpbGUuZXJyb3IpKVxuICAgICAgfSBpZiAoZmlsZS5pc1JlbW90ZSkge1xuICAgICAgICAvLyBXZSBlbWl0IHVwbG9hZC1zdGFydGVkIGhlcmUsIHNvIHRoYXQgaXQncyBhbHNvIGVtaXR0ZWQgZm9yIGZpbGVzXG4gICAgICAgIC8vIHRoYXQgaGF2ZSB0byB3YWl0IGR1ZSB0byB0aGUgYGxpbWl0YCBvcHRpb24uXG4gICAgICAgIC8vIERvbid0IGRvdWJsZS1lbWl0IHVwbG9hZC1zdGFydGVkIGZvciBHb2xkZW4gUmV0cmlldmVyLXJlc3RvcmVkIGZpbGVzIHRoYXQgd2VyZSBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgICAgaWYgKCFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgIWZpbGUuaXNSZXN0b3JlZCkge1xuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3RhcnRlZCcsIGZpbGUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudXBsb2FkUmVtb3RlKGZpbGUsIGN1cnJlbnQsIHRvdGFsKVxuICAgICAgfVxuICAgICAgLy8gRG9uJ3QgZG91YmxlLWVtaXQgdXBsb2FkLXN0YXJ0ZWQgZm9yIEdvbGRlbiBSZXRyaWV2ZXItcmVzdG9yZWQgZmlsZXMgdGhhdCB3ZXJlIGFscmVhZHkgc3RhcnRlZFxuICAgICAgaWYgKCFmaWxlLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWQgfHwgIWZpbGUuaXNSZXN0b3JlZCkge1xuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXN0YXJ0ZWQnLCBmaWxlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkKGZpbGUsIGN1cnJlbnQsIHRvdGFsKVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2V0dGxlKHByb21pc2VzKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGZpbGVJRHNcbiAgICovXG4gIGhhbmRsZVVwbG9hZCAoZmlsZUlEcykge1xuICAgIGlmIChmaWxlSURzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy51cHB5LmxvZygnW1R1c10gTm8gZmlsZXMgdG8gdXBsb2FkJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdHMubGltaXQgPT09IDApIHtcbiAgICAgIHRoaXMudXBweS5sb2coXG4gICAgICAgICdbVHVzXSBXaGVuIHVwbG9hZGluZyBtdWx0aXBsZSBmaWxlcyBhdCBvbmNlLCBjb25zaWRlciBzZXR0aW5nIHRoZSBgbGltaXRgIG9wdGlvbiAodG8gYDEwYCBmb3IgZXhhbXBsZSksIHRvIGxpbWl0IHRoZSBudW1iZXIgb2YgY29uY3VycmVudCB1cGxvYWRzLCB3aGljaCBoZWxwcyBwcmV2ZW50IG1lbW9yeSBhbmQgbmV0d29yayBpc3N1ZXM6IGh0dHBzOi8vdXBweS5pby9kb2NzL3R1cy8jbGltaXQtMCcsXG4gICAgICAgICd3YXJuaW5nJ1xuICAgICAgKVxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coJ1tUdXNdIFVwbG9hZGluZy4uLicpXG4gICAgY29uc3QgZmlsZXNUb1VwbG9hZCA9IGZpbGVJRHMubWFwKChmaWxlSUQpID0+IHRoaXMudXBweS5nZXRGaWxlKGZpbGVJRCkpXG5cbiAgICByZXR1cm4gdGhpcy51cGxvYWRGaWxlcyhmaWxlc1RvVXBsb2FkKVxuICAgICAgLnRoZW4oKCkgPT4gbnVsbClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBjYXBhYmlsaXRpZXM6IHsgLi4udGhpcy51cHB5LmdldFN0YXRlKCkuY2FwYWJpbGl0aWVzLCByZXN1bWFibGVVcGxvYWRzOiB0cnVlIH0sXG4gICAgfSlcbiAgICB0aGlzLnVwcHkuYWRkVXBsb2FkZXIodGhpcy5oYW5kbGVVcGxvYWQpXG5cbiAgICB0aGlzLnVwcHkub24oJ3Jlc2V0LXByb2dyZXNzJywgdGhpcy5oYW5kbGVSZXNldFByb2dyZXNzKVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVwcHkuc2V0U3RhdGUoe1xuICAgICAgY2FwYWJpbGl0aWVzOiB7IC4uLnRoaXMudXBweS5nZXRTdGF0ZSgpLmNhcGFiaWxpdGllcywgcmVzdW1hYmxlVXBsb2FkczogZmFsc2UgfSxcbiAgICB9KVxuICAgIHRoaXMudXBweS5yZW1vdmVVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGUgYSB3cmFwcGVyIGFyb3VuZCBhbiBldmVudCBlbWl0dGVyIHdpdGggYSBgcmVtb3ZlYCBtZXRob2QgdG8gcmVtb3ZlXG4gKiBhbGwgZXZlbnRzIHRoYXQgd2VyZSBhZGRlZCB1c2luZyB0aGUgd3JhcHBlZCBlbWl0dGVyLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEV2ZW50VHJhY2tlciB7XG4gICNlbWl0dGVyXG5cbiAgI2V2ZW50cyA9IFtdXG5cbiAgY29uc3RydWN0b3IgKGVtaXR0ZXIpIHtcbiAgICB0aGlzLiNlbWl0dGVyID0gZW1pdHRlclxuICB9XG5cbiAgb24gKGV2ZW50LCBmbikge1xuICAgIHRoaXMuI2V2ZW50cy5wdXNoKFtldmVudCwgZm5dKVxuICAgIHJldHVybiB0aGlzLiNlbWl0dGVyLm9uKGV2ZW50LCBmbilcbiAgfVxuXG4gIHJlbW92ZSAoKSB7XG4gICAgZm9yIChjb25zdCBbZXZlbnQsIGZuXSBvZiB0aGlzLiNldmVudHMuc3BsaWNlKDApKSB7XG4gICAgICB0aGlzLiNlbWl0dGVyLm9mZihldmVudCwgZm4pXG4gICAgfVxuICB9XG59XG4iLCJjbGFzcyBOZXR3b3JrRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yIChlcnJvciwgeGhyID0gbnVsbCkge1xuICAgIHN1cGVyKGBUaGlzIGxvb2tzIGxpa2UgYSBuZXR3b3JrIGVycm9yLCB0aGUgZW5kcG9pbnQgbWlnaHQgYmUgYmxvY2tlZCBieSBhbiBpbnRlcm5ldCBwcm92aWRlciBvciBhIGZpcmV3YWxsLmApXG5cbiAgICB0aGlzLmNhdXNlID0gZXJyb3JcbiAgICB0aGlzLmlzTmV0d29ya0Vycm9yID0gdHJ1ZVxuICAgIHRoaXMucmVxdWVzdCA9IHhoclxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0d29ya0Vycm9yXG4iLCJmdW5jdGlvbiBjcmVhdGVDYW5jZWxFcnJvciAoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0NhbmNlbGxlZCcpXG59XG5cbmNsYXNzIFJhdGVMaW1pdGVkUXVldWUge1xuICAjYWN0aXZlUmVxdWVzdHMgPSAwXG5cbiAgI3F1ZXVlZEhhbmRsZXJzID0gW11cblxuICBjb25zdHJ1Y3RvciAobGltaXQpIHtcbiAgICBpZiAodHlwZW9mIGxpbWl0ICE9PSAnbnVtYmVyJyB8fCBsaW1pdCA9PT0gMCkge1xuICAgICAgdGhpcy5saW1pdCA9IEluZmluaXR5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGltaXQgPSBsaW1pdFxuICAgIH1cbiAgfVxuXG4gICNjYWxsIChmbikge1xuICAgIHRoaXMuI2FjdGl2ZVJlcXVlc3RzICs9IDFcblxuICAgIGxldCBkb25lID0gZmFsc2VcblxuICAgIGxldCBjYW5jZWxBY3RpdmVcbiAgICB0cnkge1xuICAgICAgY2FuY2VsQWN0aXZlID0gZm4oKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgdGhyb3cgZXJyXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm5cbiAgICAgICAgZG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy4jYWN0aXZlUmVxdWVzdHMgLT0gMVxuICAgICAgICBjYW5jZWxBY3RpdmUoKVxuICAgICAgICB0aGlzLiNxdWV1ZU5leHQoKVxuICAgICAgfSxcblxuICAgICAgZG9uZTogKCkgPT4ge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuXG4gICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIHRoaXMuI2FjdGl2ZVJlcXVlc3RzIC09IDFcbiAgICAgICAgdGhpcy4jcXVldWVOZXh0KClcbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgI3F1ZXVlTmV4dCAoKSB7XG4gICAgLy8gRG8gaXQgc29vbiBidXQgbm90IGltbWVkaWF0ZWx5LCB0aGlzIGFsbG93cyBjbGVhcmluZyBvdXQgdGhlIGVudGlyZSBxdWV1ZSBzeW5jaHJvbm91c2x5XG4gICAgLy8gb25lIGJ5IG9uZSB3aXRob3V0IGNvbnRpbnVvdXNseSBfYWR2YW5jaW5nXyBpdCAoYW5kIHN0YXJ0aW5nIG5ldyB0YXNrcyBiZWZvcmUgaW1tZWRpYXRlbHlcbiAgICAvLyBhYm9ydGluZyB0aGVtKVxuICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHRoaXMuI25leHQoKSlcbiAgfVxuXG4gICNuZXh0ICgpIHtcbiAgICBpZiAodGhpcy4jYWN0aXZlUmVxdWVzdHMgPj0gdGhpcy5saW1pdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLiNxdWV1ZWRIYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIERpc3BhdGNoIHRoZSBuZXh0IHJlcXVlc3QsIGFuZCB1cGRhdGUgdGhlIGFib3J0L2RvbmUgaGFuZGxlcnNcbiAgICAvLyBzbyB0aGF0IGNhbmNlbGxpbmcgaXQgZG9lcyB0aGUgUmlnaHQgVGhpbmcgKGFuZCBkb2Vzbid0IGp1c3QgdHJ5XG4gICAgLy8gdG8gZGVxdWV1ZSBhbiBhbHJlYWR5LXJ1bm5pbmcgcmVxdWVzdCkuXG4gICAgY29uc3QgbmV4dCA9IHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnNoaWZ0KClcbiAgICBjb25zdCBoYW5kbGVyID0gdGhpcy4jY2FsbChuZXh0LmZuKVxuICAgIG5leHQuYWJvcnQgPSBoYW5kbGVyLmFib3J0XG4gICAgbmV4dC5kb25lID0gaGFuZGxlci5kb25lXG4gIH1cblxuICAjcXVldWUgKGZuLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoYW5kbGVyID0ge1xuICAgICAgZm4sXG4gICAgICBwcmlvcml0eTogb3B0aW9ucy5wcmlvcml0eSB8fCAwLFxuICAgICAgYWJvcnQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy4jZGVxdWV1ZShoYW5kbGVyKVxuICAgICAgfSxcbiAgICAgIGRvbmU6ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbWFyayBhIHF1ZXVlZCByZXF1ZXN0IGFzIGRvbmU6IHRoaXMgaW5kaWNhdGVzIGEgYnVnJylcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLiNxdWV1ZWRIYW5kbGVycy5maW5kSW5kZXgoKG90aGVyKSA9PiB7XG4gICAgICByZXR1cm4gaGFuZGxlci5wcmlvcml0eSA+IG90aGVyLnByaW9yaXR5XG4gICAgfSlcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aGlzLiNxdWV1ZWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3F1ZXVlZEhhbmRsZXJzLnNwbGljZShpbmRleCwgMCwgaGFuZGxlcilcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxuXG4gICNkZXF1ZXVlIChoYW5kbGVyKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLiNxdWV1ZWRIYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy4jcXVldWVkSGFuZGxlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cbiAgfVxuXG4gIHJ1biAoZm4sIHF1ZXVlT3B0aW9ucykge1xuICAgIGlmICh0aGlzLiNhY3RpdmVSZXF1ZXN0cyA8IHRoaXMubGltaXQpIHtcbiAgICAgIHJldHVybiB0aGlzLiNjYWxsKGZuKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4jcXVldWUoZm4sIHF1ZXVlT3B0aW9ucylcbiAgfVxuXG4gIHdyYXBQcm9taXNlRnVuY3Rpb24gKGZuLCBxdWV1ZU9wdGlvbnMpIHtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGxldCBxdWV1ZWRSZXF1ZXN0XG4gICAgICBjb25zdCBvdXRlclByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QgPSB0aGlzLnJ1bigoKSA9PiB7XG4gICAgICAgICAgbGV0IGNhbmNlbEVycm9yXG4gICAgICAgICAgbGV0IGlubmVyUHJvbWlzZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpbm5lclByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoZm4oLi4uYXJncykpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpbm5lclByb21pc2UgPSBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5uZXJQcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbmNlbEVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChjYW5jZWxFcnJvcilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZG9uZSgpXG4gICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChjYW5jZWxFcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoY2FuY2VsRXJyb3IpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBxdWV1ZWRSZXF1ZXN0LmRvbmUoKVxuICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsRXJyb3IgPSBjcmVhdGVDYW5jZWxFcnJvcigpXG4gICAgICAgICAgfVxuICAgICAgICB9LCBxdWV1ZU9wdGlvbnMpXG4gICAgICB9KVxuXG4gICAgICBvdXRlclByb21pc2UuYWJvcnQgPSAoKSA9PiB7XG4gICAgICAgIHF1ZXVlZFJlcXVlc3QuYWJvcnQoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0ZXJQcm9taXNlXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBSYXRlTGltaXRlZFF1ZXVlLFxuICBpbnRlcm5hbFJhdGVMaW1pdGVkUXVldWU6IFN5bWJvbCgnX19xdWV1ZScpLFxufVxuIiwiY29uc3QgaGFzID0gcmVxdWlyZSgnLi9oYXNQcm9wZXJ0eScpXG5cbmZ1bmN0aW9uIGluc2VydFJlcGxhY2VtZW50IChzb3VyY2UsIHJ4LCByZXBsYWNlbWVudCkge1xuICBjb25zdCBuZXdQYXJ0cyA9IFtdXG4gIHNvdXJjZS5mb3JFYWNoKChjaHVuaykgPT4ge1xuICAgIC8vIFdoZW4gdGhlIHNvdXJjZSBjb250YWlucyBtdWx0aXBsZSBwbGFjZWhvbGRlcnMgZm9yIGludGVycG9sYXRpb24sXG4gICAgLy8gd2Ugc2hvdWxkIGlnbm9yZSBjaHVua3MgdGhhdCBhcmUgbm90IHN0cmluZ3MsIGJlY2F1c2UgdGhvc2VcbiAgICAvLyBjYW4gYmUgSlNYIG9iamVjdHMgYW5kIHdpbGwgYmUgb3RoZXJ3aXNlIGluY29ycmVjdGx5IHR1cm5lZCBpbnRvIHN0cmluZ3MuXG4gICAgLy8gV2l0aG91dCB0aGlzIGNvbmRpdGlvbiB3ZeKAmWQgZ2V0IHRoaXM6IFtvYmplY3QgT2JqZWN0XSBoZWxsbyBbb2JqZWN0IE9iamVjdF0gbXkgPGJ1dHRvbj5cbiAgICBpZiAodHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ld1BhcnRzLnB1c2goY2h1bmspXG4gICAgfVxuXG4gICAgcmV0dXJuIHJ4W1N5bWJvbC5zcGxpdF0oY2h1bmspLmZvckVhY2goKHJhdywgaSwgbGlzdCkgPT4ge1xuICAgICAgaWYgKHJhdyAhPT0gJycpIHtcbiAgICAgICAgbmV3UGFydHMucHVzaChyYXcpXG4gICAgICB9XG5cbiAgICAgIC8vIEludGVybGFjZSB3aXRoIHRoZSBgcmVwbGFjZW1lbnRgIHZhbHVlXG4gICAgICBpZiAoaSA8IGxpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICBuZXdQYXJ0cy5wdXNoKHJlcGxhY2VtZW50KVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiBuZXdQYXJ0c1xufVxuXG4vKipcbiAqIFRha2VzIGEgc3RyaW5nIHdpdGggcGxhY2Vob2xkZXIgdmFyaWFibGVzIGxpa2UgYCV7c21hcnRfY291bnR9IGZpbGUgc2VsZWN0ZWRgXG4gKiBhbmQgcmVwbGFjZXMgaXQgd2l0aCB2YWx1ZXMgZnJvbSBvcHRpb25zIGB7c21hcnRfY291bnQ6IDV9YFxuICpcbiAqIEBsaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS9haXJibmIvcG9seWdsb3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICogdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzL2Jsb2IvbWFzdGVyL2xpYi9wb2x5Z2xvdC5qcyNMMjk5XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBocmFzZSB0aGF0IG5lZWRzIGludGVycG9sYXRpb24sIHdpdGggcGxhY2Vob2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyB3aXRoIHZhbHVlcyB0aGF0IHdpbGwgYmUgdXNlZCB0byByZXBsYWNlIHBsYWNlaG9sZGVyc1xuICogQHJldHVybnMge2FueVtdfSBpbnRlcnBvbGF0ZWRcbiAqL1xuZnVuY3Rpb24gaW50ZXJwb2xhdGUgKHBocmFzZSwgb3B0aW9ucykge1xuICBjb25zdCBkb2xsYXJSZWdleCA9IC9cXCQvZ1xuICBjb25zdCBkb2xsYXJCaWxsc1lhbGwgPSAnJCQkJCdcbiAgbGV0IGludGVycG9sYXRlZCA9IFtwaHJhc2VdXG5cbiAgaWYgKG9wdGlvbnMgPT0gbnVsbCkgcmV0dXJuIGludGVycG9sYXRlZFxuXG4gIGZvciAoY29uc3QgYXJnIG9mIE9iamVjdC5rZXlzKG9wdGlvbnMpKSB7XG4gICAgaWYgKGFyZyAhPT0gJ18nKSB7XG4gICAgICAvLyBFbnN1cmUgcmVwbGFjZW1lbnQgdmFsdWUgaXMgZXNjYXBlZCB0byBwcmV2ZW50IHNwZWNpYWwgJC1wcmVmaXhlZFxuICAgICAgLy8gcmVnZXggcmVwbGFjZSB0b2tlbnMuIHRoZSBcIiQkJCRcIiBpcyBuZWVkZWQgYmVjYXVzZSBlYWNoIFwiJFwiIG5lZWRzIHRvXG4gICAgICAvLyBiZSBlc2NhcGVkIHdpdGggXCIkXCIgaXRzZWxmLCBhbmQgd2UgbmVlZCB0d28gaW4gdGhlIHJlc3VsdGluZyBvdXRwdXQuXG4gICAgICBsZXQgcmVwbGFjZW1lbnQgPSBvcHRpb25zW2FyZ11cbiAgICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcGxhY2VtZW50ID0gZG9sbGFyUmVnZXhbU3ltYm9sLnJlcGxhY2VdKHJlcGxhY2VtZW50LCBkb2xsYXJCaWxsc1lhbGwpXG4gICAgICB9XG4gICAgICAvLyBXZSBjcmVhdGUgYSBuZXcgYFJlZ0V4cGAgZWFjaCB0aW1lIGluc3RlYWQgb2YgdXNpbmcgYSBtb3JlLWVmZmljaWVudFxuICAgICAgLy8gc3RyaW5nIHJlcGxhY2Ugc28gdGhhdCB0aGUgc2FtZSBhcmd1bWVudCBjYW4gYmUgcmVwbGFjZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cbiAgICAgIGludGVycG9sYXRlZCA9IGluc2VydFJlcGxhY2VtZW50KGludGVycG9sYXRlZCwgbmV3IFJlZ0V4cChgJVxcXFx7JHthcmd9XFxcXH1gLCAnZycpLCByZXBsYWNlbWVudClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW50ZXJwb2xhdGVkXG59XG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIHdpdGggaW50ZXJwb2xhdGlvbiAmIHBsdXJhbGl6YXRpb24gc3VwcG9ydC5cbiAqIEV4dGVuc2libGUgd2l0aCBjdXN0b20gZGljdGlvbmFyaWVzIGFuZCBwbHVyYWxpemF0aW9uIGZ1bmN0aW9ucy5cbiAqXG4gKiBCb3Jyb3dzIGhlYXZpbHkgZnJvbSBhbmQgaW5zcGlyZWQgYnkgUG9seWdsb3QgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyxcbiAqIGJhc2ljYWxseSBhIHN0cmlwcGVkLWRvd24gdmVyc2lvbiBvZiBpdC4gRGlmZmVyZW5jZXM6IHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zIGFyZSBub3QgaGFyZGNvZGVkXG4gKiBhbmQgY2FuIGJlIGVhc2lseSBhZGRlZCBhbW9uZyB3aXRoIGRpY3Rpb25hcmllcywgbmVzdGVkIG9iamVjdHMgYXJlIHVzZWQgZm9yIHBsdXJhbGl6YXRpb25cbiAqIGFzIG9wcG9zZWQgdG8gYHx8fHxgIGRlbGltZXRlclxuICpcbiAqIFVzYWdlIGV4YW1wbGU6IGB0cmFuc2xhdG9yLnRyYW5zbGF0ZSgnZmlsZXNfY2hvc2VuJywge3NtYXJ0X2NvdW50OiAzfSlgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhbnNsYXRvciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdHxBcnJheTxvYmplY3Q+fSBsb2NhbGVzIC0gbG9jYWxlIG9yIGxpc3Qgb2YgbG9jYWxlcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChsb2NhbGVzKSB7XG4gICAgdGhpcy5sb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7fSxcbiAgICAgIHBsdXJhbGl6ZSAobikge1xuICAgICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDFcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobG9jYWxlcykpIHtcbiAgICAgIGxvY2FsZXMuZm9yRWFjaCh0aGlzLiNhcHBseSwgdGhpcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jYXBwbHkobG9jYWxlcylcbiAgICB9XG4gIH1cblxuICAjYXBwbHkgKGxvY2FsZSkge1xuICAgIGlmICghbG9jYWxlPy5zdHJpbmdzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBwcmV2TG9jYWxlID0gdGhpcy5sb2NhbGVcbiAgICB0aGlzLmxvY2FsZSA9IHsgLi4ucHJldkxvY2FsZSwgc3RyaW5nczogeyAuLi5wcmV2TG9jYWxlLnN0cmluZ3MsIC4uLmxvY2FsZS5zdHJpbmdzIH0gfVxuICAgIHRoaXMubG9jYWxlLnBsdXJhbGl6ZSA9IGxvY2FsZS5wbHVyYWxpemUgfHwgcHJldkxvY2FsZS5wbHVyYWxpemVcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgdHJhbnNsYXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIGxhdGVyIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0cmFuc2xhdGVkIChhbmQgaW50ZXJwb2xhdGVkKVxuICAgKi9cbiAgdHJhbnNsYXRlIChrZXksIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVBcnJheShrZXksIG9wdGlvbnMpLmpvaW4oJycpXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgdHJhbnNsYXRpb24gYW5kIHJldHVybiB0aGUgdHJhbnNsYXRlZCBhbmQgaW50ZXJwb2xhdGVkIHBhcnRzIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzXG4gICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHRyYW5zbGF0ZWQgYW5kIGludGVycG9sYXRlZCBwYXJ0cywgaW4gb3JkZXIuXG4gICAqL1xuICB0cmFuc2xhdGVBcnJheSAoa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFoYXModGhpcy5sb2NhbGUuc3RyaW5ncywga2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBtaXNzaW5nIHN0cmluZzogJHtrZXl9YClcbiAgICB9XG5cbiAgICBjb25zdCBzdHJpbmcgPSB0aGlzLmxvY2FsZS5zdHJpbmdzW2tleV1cbiAgICBjb25zdCBoYXNQbHVyYWxGb3JtcyA9IHR5cGVvZiBzdHJpbmcgPT09ICdvYmplY3QnXG5cbiAgICBpZiAoaGFzUGx1cmFsRm9ybXMpIHtcbiAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnNtYXJ0X2NvdW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zdCBwbHVyYWwgPSB0aGlzLmxvY2FsZS5wbHVyYWxpemUob3B0aW9ucy5zbWFydF9jb3VudClcbiAgICAgICAgcmV0dXJuIGludGVycG9sYXRlKHN0cmluZ1twbHVyYWxdLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gdXNlIGEgc3RyaW5nIHdpdGggcGx1cmFsIGZvcm1zLCBidXQgbm8gdmFsdWUgd2FzIGdpdmVuIGZvciAle3NtYXJ0X2NvdW50fScpXG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVycG9sYXRlKHN0cmluZywgb3B0aW9ucylcbiAgfVxufVxuIiwiY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuXG5mdW5jdGlvbiBlbWl0U29ja2V0UHJvZ3Jlc3MgKHVwbG9hZGVyLCBwcm9ncmVzc0RhdGEsIGZpbGUpIHtcbiAgY29uc3QgeyBwcm9ncmVzcywgYnl0ZXNVcGxvYWRlZCwgYnl0ZXNUb3RhbCB9ID0gcHJvZ3Jlc3NEYXRhXG4gIGlmIChwcm9ncmVzcykge1xuICAgIHVwbG9hZGVyLnVwcHkubG9nKGBVcGxvYWQgcHJvZ3Jlc3M6ICR7cHJvZ3Jlc3N9YClcbiAgICB1cGxvYWRlci51cHB5LmVtaXQoJ3VwbG9hZC1wcm9ncmVzcycsIGZpbGUsIHtcbiAgICAgIHVwbG9hZGVyLFxuICAgICAgYnl0ZXNVcGxvYWRlZCxcbiAgICAgIGJ5dGVzVG90YWwsXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlKGVtaXRTb2NrZXRQcm9ncmVzcywgMzAwLCB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiB0cnVlLFxufSlcbiIsImNvbnN0IE5ldHdvcmtFcnJvciA9IHJlcXVpcmUoJy4vTmV0d29ya0Vycm9yJylcblxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB3aW5kb3cuZmV0Y2ggdGhhdCB0aHJvd3MgYSBOZXR3b3JrRXJyb3Igd2hlbiBhcHByb3ByaWF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZldGNoV2l0aE5ldHdvcmtFcnJvciAoLi4ub3B0aW9ucykge1xuICByZXR1cm4gZmV0Y2goLi4ub3B0aW9ucylcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgTmV0d29ya0Vycm9yKGVycilcbiAgICAgIH1cbiAgICB9KVxufVxuIiwiY29uc3QgaXNET01FbGVtZW50ID0gcmVxdWlyZSgnLi9pc0RPTUVsZW1lbnQnKVxuXG4vKipcbiAqIEZpbmQgYSBET00gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Tm9kZXxudWxsfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbmRET01FbGVtZW50IChlbGVtZW50LCBjb250ZXh0ID0gZG9jdW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgfVxuXG4gIGlmIChpc0RPTUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiIsImZ1bmN0aW9uIGVuY29kZUNoYXJhY3RlciAoY2hhcmFjdGVyKSB7XG4gIHJldHVybiBjaGFyYWN0ZXIuY2hhckNvZGVBdCgwKS50b1N0cmluZygzMilcbn1cblxuZnVuY3Rpb24gZW5jb2RlRmlsZW5hbWUgKG5hbWUpIHtcbiAgbGV0IHN1ZmZpeCA9ICcnXG4gIHJldHVybiBuYW1lLnJlcGxhY2UoL1teQS1aMC05XS9pZywgKGNoYXJhY3RlcikgPT4ge1xuICAgIHN1ZmZpeCArPSBgLSR7ZW5jb2RlQ2hhcmFjdGVyKGNoYXJhY3Rlcil9YFxuICAgIHJldHVybiAnLydcbiAgfSkgKyBzdWZmaXhcbn1cblxuLyoqXG4gKiBUYWtlcyBhIGZpbGUgb2JqZWN0IGFuZCB0dXJucyBpdCBpbnRvIGZpbGVJRCwgYnkgY29udmVydGluZyBmaWxlLm5hbWUgdG8gbG93ZXJjYXNlLFxuICogcmVtb3ZpbmcgZXh0cmEgY2hhcmFjdGVycyBhbmQgYWRkaW5nIHR5cGUsIHNpemUgYW5kIGxhc3RNb2RpZmllZFxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZmlsZUlEXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVGaWxlSUQgKGZpbGUpIHtcbiAgLy8gSXQncyB0ZW1wdGluZyB0byBkbyBgW2l0ZW1zXS5maWx0ZXIoQm9vbGVhbikuam9pbignLScpYCBoZXJlLCBidXQgdGhhdFxuICAvLyBpcyBzbG93ZXIhIHNpbXBsZSBzdHJpbmcgY29uY2F0ZW5hdGlvbiBpcyBmYXN0XG5cbiAgbGV0IGlkID0gJ3VwcHknXG4gIGlmICh0eXBlb2YgZmlsZS5uYW1lID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9IGAtJHtlbmNvZGVGaWxlbmFtZShmaWxlLm5hbWUudG9Mb3dlckNhc2UoKSl9YFxuICB9XG5cbiAgaWYgKGZpbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUudHlwZX1gXG4gIH1cblxuICBpZiAoZmlsZS5tZXRhICYmIHR5cGVvZiBmaWxlLm1ldGEucmVsYXRpdmVQYXRoID09PSAnc3RyaW5nJykge1xuICAgIGlkICs9IGAtJHtlbmNvZGVGaWxlbmFtZShmaWxlLm1ldGEucmVsYXRpdmVQYXRoLnRvTG93ZXJDYXNlKCkpfWBcbiAgfVxuXG4gIGlmIChmaWxlLmRhdGEuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUuZGF0YS5zaXplfWBcbiAgfVxuICBpZiAoZmlsZS5kYXRhLmxhc3RNb2RpZmllZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWQgKz0gYC0ke2ZpbGUuZGF0YS5sYXN0TW9kaWZpZWR9YFxuICB9XG5cbiAgcmV0dXJuIGlkXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEJ5dGVzUmVtYWluaW5nIChmaWxlUHJvZ3Jlc3MpIHtcbiAgcmV0dXJuIGZpbGVQcm9ncmVzcy5ieXRlc1RvdGFsIC0gZmlsZVByb2dyZXNzLmJ5dGVzVXBsb2FkZWRcbn1cbiIsIi8qKlxuICogVGFrZXMgYSBmdWxsIGZpbGVuYW1lIHN0cmluZyBhbmQgcmV0dXJucyBhbiBvYmplY3Qge25hbWUsIGV4dGVuc2lvbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZnVsbEZpbGVOYW1lXG4gKiBAcmV0dXJucyB7b2JqZWN0fSB7bmFtZSwgZXh0ZW5zaW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uIChmdWxsRmlsZU5hbWUpIHtcbiAgY29uc3QgbGFzdERvdCA9IGZ1bGxGaWxlTmFtZS5sYXN0SW5kZXhPZignLicpXG4gIC8vIHRoZXNlIGNvdW50IGFzIG5vIGV4dGVuc2lvbjogXCJuby1kb3RcIiwgXCJ0cmFpbGluZy1kb3QuXCJcbiAgaWYgKGxhc3REb3QgPT09IC0xIHx8IGxhc3REb3QgPT09IGZ1bGxGaWxlTmFtZS5sZW5ndGggLSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGZ1bGxGaWxlTmFtZSxcbiAgICAgIGV4dGVuc2lvbjogdW5kZWZpbmVkLFxuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6IGZ1bGxGaWxlTmFtZS5zbGljZSgwLCBsYXN0RG90KSxcbiAgICBleHRlbnNpb246IGZ1bGxGaWxlTmFtZS5zbGljZShsYXN0RG90ICsgMSksXG4gIH1cbn1cbiIsImNvbnN0IGdldEZpbGVOYW1lQW5kRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9nZXRGaWxlTmFtZUFuZEV4dGVuc2lvbicpXG5jb25zdCBtaW1lVHlwZXMgPSByZXF1aXJlKCcuL21pbWVUeXBlcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0RmlsZVR5cGUgKGZpbGUpIHtcbiAgaWYgKGZpbGUudHlwZSkgcmV0dXJuIGZpbGUudHlwZVxuXG4gIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBmaWxlLm5hbWUgPyBnZXRGaWxlTmFtZUFuZEV4dGVuc2lvbihmaWxlLm5hbWUpLmV4dGVuc2lvbj8udG9Mb3dlckNhc2UoKSA6IG51bGxcbiAgaWYgKGZpbGVFeHRlbnNpb24gJiYgZmlsZUV4dGVuc2lvbiBpbiBtaW1lVHlwZXMpIHtcbiAgICAvLyBlbHNlLCBzZWUgaWYgd2UgY2FuIG1hcCBleHRlbnNpb24gdG8gYSBtaW1lIHR5cGVcbiAgICByZXR1cm4gbWltZVR5cGVzW2ZpbGVFeHRlbnNpb25dXG4gIH1cbiAgLy8gaWYgYWxsIGZhaWxzLCBmYWxsIGJhY2sgdG8gYSBnZW5lcmljIGJ5dGUgc3RyZWFtIHR5cGVcbiAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNvY2tldEhvc3QgKHVybCkge1xuICAvLyBnZXQgdGhlIGhvc3QgZG9tYWluXG4gIGNvbnN0IHJlZ2V4ID0gL14oPzpodHRwcz86XFwvXFwvfFxcL1xcLyk/KD86W15AXFxuXStAKT8oPzp3d3dcXC4pPyhbXlxcbl0rKS9pXG4gIGNvbnN0IGhvc3QgPSByZWdleC5leGVjKHVybClbMV1cbiAgY29uc3Qgc29ja2V0UHJvdG9jb2wgPSAvXmh0dHA6XFwvXFwvL2kudGVzdCh1cmwpID8gJ3dzJyA6ICd3c3MnXG5cbiAgcmV0dXJuIGAke3NvY2tldFByb3RvY29sfTovLyR7aG9zdH1gXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFNwZWVkIChmaWxlUHJvZ3Jlc3MpIHtcbiAgaWYgKCFmaWxlUHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCkgcmV0dXJuIDBcblxuICBjb25zdCB0aW1lRWxhcHNlZCA9IERhdGUubm93KCkgLSBmaWxlUHJvZ3Jlc3MudXBsb2FkU3RhcnRlZFxuICBjb25zdCB1cGxvYWRTcGVlZCA9IGZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkIC8gKHRpbWVFbGFwc2VkIC8gMTAwMClcbiAgcmV0dXJuIHVwbG9hZFNwZWVkXG59XG4iLCIvKipcbiAqIEdldCB0aGUgZGVjbGFyZWQgdGV4dCBkaXJlY3Rpb24gZm9yIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbGVtZW50XG4gKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBnZXRUZXh0RGlyZWN0aW9uIChlbGVtZW50KSB7XG4gIC8vIFRoZXJlIGlzIGFub3RoZXIgd2F5IHRvIGRldGVybWluZSB0ZXh0IGRpcmVjdGlvbiB1c2luZyBnZXRDb21wdXRlZFN0eWxlKCksIGFzIGRvbmUgaGVyZTpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BlbmNpbC1qcy90ZXh0LWRpcmVjdGlvbi9ibG9iLzJhMjM1Y2U5NTA4OWIzMTg1YWNlYzNiNTEzMTNjYmJhOTIxYjM4MTEvdGV4dC1kaXJlY3Rpb24uanNcbiAgLy9cbiAgLy8gV2UgZG8gbm90IHVzZSB0aGF0IGFwcHJvYWNoIGJlY2F1c2Ugd2UgYXJlIGludGVyZXN0ZWQgc3BlY2lmaWNhbGx5IGluIHRoZSBfZGVjbGFyZWRfIHRleHQgZGlyZWN0aW9uLlxuICAvLyBJZiBubyB0ZXh0IGRpcmVjdGlvbiBpcyBkZWNsYXJlZCwgd2UgaGF2ZSB0byBwcm92aWRlIG91ciBvd24gZXhwbGljaXQgdGV4dCBkaXJlY3Rpb24gc28gb3VyXG4gIC8vIGJpZGlyZWN0aW9uYWwgQ1NTIHN0eWxlIHNoZWV0cyB3b3JrLlxuICB3aGlsZSAoZWxlbWVudCAmJiAhZWxlbWVudC5kaXIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQ/LmRpclxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRleHREaXJlY3Rpb25cbiIsIi8qKlxuICogQWRkcyB6ZXJvIHRvIHN0cmluZ3Mgc2hvcnRlciB0aGFuIHR3byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHBhZCAobnVtYmVyKSB7XG4gIHJldHVybiBudW1iZXIgPCAxMCA/IGAwJHtudW1iZXJ9YCA6IG51bWJlci50b1N0cmluZygpXG59XG5cbi8qKlxuICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiB0aGUgZm9ybWF0IG9mIGBob3VyczptaW51dGVzOnNlY29uZHNgXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0VGltZVN0YW1wICgpIHtcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKClcbiAgY29uc3QgaG91cnMgPSBwYWQoZGF0ZS5nZXRIb3VycygpKVxuICBjb25zdCBtaW51dGVzID0gcGFkKGRhdGUuZ2V0TWludXRlcygpKVxuICBjb25zdCBzZWNvbmRzID0gcGFkKGRhdGUuZ2V0U2Vjb25kcygpKVxuICByZXR1cm4gYCR7aG91cnN9OiR7bWludXRlc306JHtzZWNvbmRzfWBcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzIChvYmplY3QsIGtleSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KVxufVxuIiwiLyoqXG4gKiBDaGVjayBpZiBhbiBvYmplY3QgaXMgYSBET00gZWxlbWVudC4gRHVjay10eXBpbmcgYmFzZWQgb24gYG5vZGVUeXBlYC5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRE9NRWxlbWVudCAob2JqKSB7XG4gIHJldHVybiBvYmo/Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERVxufVxuIiwiZnVuY3Rpb24gaXNOZXR3b3JrRXJyb3IgKHhocikge1xuICBpZiAoIXhocikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiAoeGhyLnJlYWR5U3RhdGUgIT09IDAgJiYgeGhyLnJlYWR5U3RhdGUgIT09IDQpIHx8IHhoci5zdGF0dXMgPT09IDBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05ldHdvcmtFcnJvclxuIiwiLy8gX19fV2h5IG5vdCBhZGQgdGhlIG1pbWUtdHlwZXMgcGFja2FnZT9cbi8vICAgIEl0J3MgMTkuN2tCIGd6aXBwZWQsIGFuZCB3ZSBvbmx5IG5lZWQgbWltZSB0eXBlcyBmb3Igd2VsbC1rbm93biBleHRlbnNpb25zIChmb3IgZmlsZSBwcmV2aWV3cykuXG4vLyBfX19XaGVyZSB0byB0YWtlIG5ldyBleHRlbnNpb25zIGZyb20/XG4vLyAgICBodHRwczovL2dpdGh1Yi5jb20vanNodHRwL21pbWUtZGIvYmxvYi9tYXN0ZXIvZGIuanNvblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWQ6ICd0ZXh0L21hcmtkb3duJyxcbiAgbWFya2Rvd246ICd0ZXh0L21hcmtkb3duJyxcbiAgbXA0OiAndmlkZW8vbXA0JyxcbiAgbXAzOiAnYXVkaW8vbXAzJyxcbiAgc3ZnOiAnaW1hZ2Uvc3ZnK3htbCcsXG4gIGpwZzogJ2ltYWdlL2pwZWcnLFxuICBwbmc6ICdpbWFnZS9wbmcnLFxuICBnaWY6ICdpbWFnZS9naWYnLFxuICBoZWljOiAnaW1hZ2UvaGVpYycsXG4gIGhlaWY6ICdpbWFnZS9oZWlmJyxcbiAgeWFtbDogJ3RleHQveWFtbCcsXG4gIHltbDogJ3RleHQveWFtbCcsXG4gIGNzdjogJ3RleHQvY3N2JyxcbiAgdHN2OiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcycsXG4gIHRhYjogJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnLFxuICBhdmk6ICd2aWRlby94LW1zdmlkZW8nLFxuICBta3M6ICd2aWRlby94LW1hdHJvc2thJyxcbiAgbWt2OiAndmlkZW8veC1tYXRyb3NrYScsXG4gIG1vdjogJ3ZpZGVvL3F1aWNrdGltZScsXG4gIGRvYzogJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gIGRvY206ICdhcHBsaWNhdGlvbi92bmQubXMtd29yZC5kb2N1bWVudC5tYWNyb2VuYWJsZWQuMTInLFxuICBkb2N4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnLFxuICBkb3Q6ICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICBkb3RtOiAnYXBwbGljYXRpb24vdm5kLm1zLXdvcmQudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyJyxcbiAgZG90eDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLnRlbXBsYXRlJyxcbiAgeGxhOiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGxhbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5hZGRpbi5tYWNyb2VuYWJsZWQuMTInLFxuICB4bGM6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB4bGY6ICdhcHBsaWNhdGlvbi94LXhsaWZmK3htbCcsXG4gIHhsbTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsczogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gIHhsc2I6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQuYmluYXJ5Lm1hY3JvZW5hYmxlZC4xMicsXG4gIHhsc206ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQubWFjcm9lbmFibGVkLjEyJyxcbiAgeGxzeDogJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0JyxcbiAgeGx0OiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgeGx0bTogJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTInLFxuICB4bHR4OiAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGVtcGxhdGUnLFxuICB4bHc6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICB0eHQ6ICd0ZXh0L3BsYWluJyxcbiAgdGV4dDogJ3RleHQvcGxhaW4nLFxuICBjb25mOiAndGV4dC9wbGFpbicsXG4gIGxvZzogJ3RleHQvcGxhaW4nLFxuICBwZGY6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICB6aXA6ICdhcHBsaWNhdGlvbi96aXAnLFxuICAnN3onOiAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcbiAgcmFyOiAnYXBwbGljYXRpb24veC1yYXItY29tcHJlc3NlZCcsXG4gIHRhcjogJ2FwcGxpY2F0aW9uL3gtdGFyJyxcbiAgZ3o6ICdhcHBsaWNhdGlvbi9nemlwJyxcbiAgZG1nOiAnYXBwbGljYXRpb24veC1hcHBsZS1kaXNraW1hZ2UnLFxufVxuIiwiY29uc3Qgc2Vjb25kc1RvVGltZSA9IHJlcXVpcmUoJy4vc2Vjb25kc1RvVGltZScpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcHJldHR5RVRBIChzZWNvbmRzKSB7XG4gIGNvbnN0IHRpbWUgPSBzZWNvbmRzVG9UaW1lKHNlY29uZHMpXG5cbiAgLy8gT25seSBkaXNwbGF5IGhvdXJzIGFuZCBtaW51dGVzIGlmIHRoZXkgYXJlIGdyZWF0ZXIgdGhhbiAwIGJ1dCBhbHdheXNcbiAgLy8gZGlzcGxheSBtaW51dGVzIGlmIGhvdXJzIGlzIGJlaW5nIGRpc3BsYXllZFxuICAvLyBEaXNwbGF5IGEgbGVhZGluZyB6ZXJvIGlmIHRoZSB0aGVyZSBpcyBhIHByZWNlZGluZyB1bml0OiAxbSAwNXMsIGJ1dCA1c1xuICBjb25zdCBob3Vyc1N0ciA9IHRpbWUuaG91cnMgPT09IDAgPyAnJyA6IGAke3RpbWUuaG91cnN9aGBcbiAgY29uc3QgbWludXRlc1N0ciA9IHRpbWUubWludXRlcyA9PT0gMCA/ICcnIDogYCR7dGltZS5ob3VycyA9PT0gMCA/IHRpbWUubWludXRlcyA6IGAgJHt0aW1lLm1pbnV0ZXMudG9TdHJpbmcoMTApLnBhZFN0YXJ0KDIsICcwJyl9YH1tYFxuICBjb25zdCBzZWNvbmRzU3RyID0gdGltZS5ob3VycyAhPT0gMCA/ICcnIDogYCR7dGltZS5taW51dGVzID09PSAwID8gdGltZS5zZWNvbmRzIDogYCAke3RpbWUuc2Vjb25kcy50b1N0cmluZygxMCkucGFkU3RhcnQoMiwgJzAnKX1gfXNgXG5cbiAgcmV0dXJuIGAke2hvdXJzU3RyfSR7bWludXRlc1N0cn0ke3NlY29uZHNTdHJ9YFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWNvbmRzVG9UaW1lIChyYXdTZWNvbmRzKSB7XG4gIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcihyYXdTZWNvbmRzIC8gMzYwMCkgJSAyNFxuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihyYXdTZWNvbmRzIC8gNjApICUgNjBcbiAgY29uc3Qgc2Vjb25kcyA9IE1hdGguZmxvb3IocmF3U2Vjb25kcyAlIDYwKVxuXG4gIHJldHVybiB7IGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlIChwcm9taXNlcykge1xuICBjb25zdCByZXNvbHV0aW9ucyA9IFtdXG4gIGNvbnN0IHJlamVjdGlvbnMgPSBbXVxuICBmdW5jdGlvbiByZXNvbHZlZCAodmFsdWUpIHtcbiAgICByZXNvbHV0aW9ucy5wdXNoKHZhbHVlKVxuICB9XG4gIGZ1bmN0aW9uIHJlamVjdGVkIChlcnJvcikge1xuICAgIHJlamVjdGlvbnMucHVzaChlcnJvcilcbiAgfVxuXG4gIGNvbnN0IHdhaXQgPSBQcm9taXNlLmFsbChcbiAgICBwcm9taXNlcy5tYXAoKHByb21pc2UpID0+IHByb21pc2UudGhlbihyZXNvbHZlZCwgcmVqZWN0ZWQpKVxuICApXG5cbiAgcmV0dXJuIHdhaXQudGhlbigoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3NmdWw6IHJlc29sdXRpb25zLFxuICAgICAgZmFpbGVkOiByZWplY3Rpb25zLFxuICAgIH1cbiAgfSlcbn1cbiIsIi8qKlxuICogQ29udmVydHMgbGlzdCBpbnRvIGFycmF5XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuZnJvbVxuIiwiY29uc3QgVXBweSA9IHJlcXVpcmUoJ0B1cHB5L2NvcmUnKVxuY29uc3QgRmlsZUlucHV0ID0gcmVxdWlyZSgnQHVwcHkvZmlsZS1pbnB1dCcpXG5jb25zdCBTdGF0dXNCYXIgPSByZXF1aXJlKCdAdXBweS9zdGF0dXMtYmFyJylcbmNvbnN0IFR1cyA9IHJlcXVpcmUoJ0B1cHB5L3R1cycpXG5cbmNvbnN0IHVwcHlPbmUgPSBuZXcgVXBweSh7ZGVidWc6IHRydWUsIGF1dG9Qcm9jZWVkOiB0cnVlfSlcbnVwcHlPbmVcbiAgLnVzZShGaWxlSW5wdXQsIHsgdGFyZ2V0OiAnLlVwcHlJbnB1dCcsIHByZXR0eTogZmFsc2UgfSlcbiAgLnVzZShUdXMsIHsgZW5kcG9pbnQ6ICdodHRwczovL3R1c2QudHVzZGVtby5uZXQvZmlsZXMvJyB9KVxuICAudXNlKFN0YXR1c0Jhciwge1xuICAgIHRhcmdldDogJy5VcHB5SW5wdXQtUHJvZ3Jlc3MnLFxuICAgIGhpZGVVcGxvYWRCdXR0b246IHRydWUsXG4gICAgaGlkZUFmdGVyRmluaXNoOiBmYWxzZVxuICB9KVxuIl19
