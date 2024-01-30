(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter21() {
        EventEmitter21.init.call(this);
      }
      module.exports = EventEmitter21;
      module.exports.once = once;
      EventEmitter21.EventEmitter = EventEmitter21;
      EventEmitter21.prototype._events = void 0;
      EventEmitter21.prototype._eventsCount = 0;
      EventEmitter21.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter21, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter21.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter21.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter21.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter21.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter21.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter21.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter21.prototype.on = EventEmitter21.prototype.addListener;
      EventEmitter21.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter21.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter21.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter21.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter21.prototype.off = EventEmitter21.prototype.removeListener;
      EventEmitter21.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter21.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter21.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter21.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter21.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter21.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // src/client/dom/document.js
  var import_events = __toESM(require_events(), 1);

  // src/client/hook.js
  var HookEvent = class {
    #intercepted;
    #returnValue;
    /**
     *
     * @param {Data} data
     * @param {Target} target
     * @param {That} that
     */
    constructor(data = {}, target = null, that = null) {
      this.#intercepted = false;
      this.#returnValue = null;
      this.data = data;
      this.target = target;
      this.that = that;
    }
    get intercepted() {
      return this.#intercepted;
    }
    get returnValue() {
      return this.#returnValue;
    }
    respondWith(input) {
      this.#returnValue = input;
      this.#intercepted = true;
    }
  };
  var hook_default = HookEvent;

  // src/client/dom/document.js
  var DocumentHook = class extends import_events.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.document = this.window.document;
      this.Document = this.window.Document || {};
      this.DOMParser = this.window.DOMParser || {};
      this.docProto = this.Document.prototype || {};
      this.domProto = this.DOMParser.prototype || {};
      this.title = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "title"
      );
      this.cookie = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "cookie"
      );
      this.referrer = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "referrer"
      );
      this.domain = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "domain"
      );
      this.documentURI = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "documentURI"
      );
      this.write = this.docProto.write;
      this.writeln = this.docProto.writeln;
      this.querySelector = this.docProto.querySelector;
      this.querySelectorAll = this.docProto.querySelectorAll;
      this.parseFromString = this.domProto.parseFromString;
      this.URL = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.docProto,
        "URL"
      );
    }
    overrideParseFromString() {
      this.ctx.override(
        this.domProto,
        "parseFromString",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [string, type] = args;
          const event = new hook_default({ string, type }, target, that);
          this.emit("parseFromString", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.string,
            event.data.type
          );
        }
      );
    }
    overrideQuerySelector() {
      this.ctx.override(
        this.docProto,
        "querySelector",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [selectors] = args;
          const event = new hook_default({ selectors }, target, that);
          this.emit("querySelector", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.selectors);
        }
      );
    }
    overrideDomain() {
      this.ctx.overrideDescriptor(this.docProto, "domain", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getDomain", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default({ value: val }, target, that);
          this.emit("setDomain", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.value);
        }
      });
    }
    overrideReferrer() {
      this.ctx.overrideDescriptor(this.docProto, "referrer", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("referrer", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideCreateTreeWalker() {
      this.ctx.override(
        this.docProto,
        "createTreeWalker",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [root, show = 4294967295, filter, expandEntityReferences] = args;
          const event = new hook_default(
            { root, show, filter, expandEntityReferences },
            target,
            that
          );
          this.emit("createTreeWalker", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.root,
            event.data.show,
            event.data.filter,
            event.data.expandEntityReferences
          );
        }
      );
    }
    overrideWrite() {
      this.ctx.override(this.docProto, "write", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [...html] = args;
        const event = new hook_default({ html }, target, that);
        this.emit("write", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.apply(event.that, event.data.html);
      });
      this.ctx.override(this.docProto, "writeln", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [...html] = args;
        const event = new hook_default({ html }, target, that);
        this.emit("writeln", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.apply(event.that, event.data.html);
      });
    }
    overrideDocumentURI() {
      this.ctx.overrideDescriptor(this.docProto, "documentURI", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("documentURI", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideURL() {
      this.ctx.overrideDescriptor(this.docProto, "URL", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("url", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideCookie() {
      this.ctx.overrideDescriptor(this.docProto, "cookie", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getCookie", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [value]) => {
          const event = new hook_default({ value }, target, that);
          this.emit("setCookie", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.value);
        }
      });
    }
    overrideTitle() {
      this.ctx.overrideDescriptor(this.docProto, "title", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getTitle", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [value]) => {
          const event = new hook_default({ value }, target, that);
          this.emit("setTitle", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.value);
        }
      });
    }
  };
  var document_default = DocumentHook;

  // src/client/dom/element.js
  var import_events2 = __toESM(require_events(), 1);
  var ElementApi = class extends import_events2.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Audio = this.window.Audio;
      this.Element = this.window.Element;
      this.elemProto = this.Element ? this.Element.prototype : {};
      this.innerHTML = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.elemProto,
        "innerHTML"
      );
      this.outerHTML = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.elemProto,
        "outerHTML"
      );
      this.setAttribute = this.elemProto.setAttribute;
      this.getAttribute = this.elemProto.getAttribute;
      this.removeAttribute = this.elemProto.removeAttribute;
      this.hasAttribute = this.elemProto.hasAttribute;
      this.querySelector = this.elemProto.querySelector;
      this.querySelectorAll = this.elemProto.querySelectorAll;
      this.insertAdjacentHTML = this.elemProto.insertAdjacentHTML;
      this.insertAdjacentText = this.elemProto.insertAdjacentText;
    }
    overrideQuerySelector() {
      this.ctx.override(
        this.elemProto,
        "querySelector",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [selectors] = args;
          const event = new hook_default({ selectors }, target, that);
          this.emit("querySelector", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.selectors);
        }
      );
    }
    overrideAttribute() {
      this.ctx.override(
        this.elemProto,
        "getAttribute",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default({ name }, target, that);
          this.emit("getAttribute", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(
        this.elemProto,
        "setAttribute",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [name, value] = args;
          const event = new hook_default({ name, value }, target, that);
          this.emit("setAttribute", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.name,
            event.data.value
          );
        }
      );
      this.ctx.override(
        this.elemProto,
        "hasAttribute",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default({ name }, target, that);
          this.emit("hasAttribute", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(
        this.elemProto,
        "removeAttribute",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default({ name }, target, that);
          this.emit("removeAttribute", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
    }
    overrideAudio() {
      this.ctx.override(
        this.window,
        "Audio",
        (target, that, args) => {
          if (!args.length)
            return new target(...args);
          let [url] = args;
          const event = new hook_default({ url }, target, that);
          this.emit("audio", event);
          if (event.intercepted)
            return event.returnValue;
          return new event.target(event.data.url);
        },
        true
      );
    }
    overrideHtml() {
      this.hookProperty(this.Element, "innerHTML", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getInnerHTML", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default({ value: val }, target, that);
          this.emit("setInnerHTML", event);
          if (event.intercepted)
            return event.returnValue;
          target.call(that, event.data.value);
        }
      });
      this.hookProperty(this.Element, "outerHTML", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getOuterHTML", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default({ value: val }, target, that);
          this.emit("setOuterHTML", event);
          if (event.intercepted)
            return event.returnValue;
          target.call(that, event.data.value);
        }
      });
    }
    overrideInsertAdjacentHTML() {
      this.ctx.override(
        this.elemProto,
        "insertAdjacentHTML",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [position, html] = args;
          const event = new hook_default({ position, html }, target, that);
          this.emit("insertAdjacentHTML", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.position,
            event.data.html
          );
        }
      );
    }
    overrideInsertAdjacentText() {
      this.ctx.override(
        this.elemProto,
        "insertAdjacentText",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [position, text] = args;
          const event = new hook_default({ position, text }, target, that);
          this.emit("insertAdjacentText", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.position,
            event.data.text
          );
        }
      );
    }
    hookProperty(element, prop, handler) {
      if (!element)
        return false;
      if (this.ctx.nativeMethods.isArray(element)) {
        for (const elem of element) {
          this.hookProperty(elem, prop, handler);
        }
        return true;
      }
      const proto = element.prototype;
      this.ctx.overrideDescriptor(proto, prop, handler);
      return true;
    }
  };
  var element_default = ElementApi;

  // src/client/dom/node.js
  var import_events3 = __toESM(require_events(), 1);
  var NodeApi = class extends import_events3.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Node = ctx.window.Node || {};
      this.nodeProto = this.Node.prototype || {};
      this.compareDocumentPosition = this.nodeProto.compareDocumentPosition;
      this.contains = this.nodeProto.contains;
      this.insertBefore = this.nodeProto.insertBefore;
      this.replaceChild = this.nodeProto.replaceChild;
      this.append = this.nodeProto.append;
      this.appendChild = this.nodeProto.appendChild;
      this.removeChild = this.nodeProto.removeChild;
      this.textContent = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "textContent"
      );
      this.parentNode = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "parentNode"
      );
      this.parentElement = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "parentElement"
      );
      this.childNodes = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "childNodes"
      );
      this.baseURI = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "baseURI"
      );
      this.previousSibling = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "previousSibling"
      );
      this.ownerDocument = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.nodeProto,
        "ownerDocument"
      );
    }
    overrideTextContent() {
      this.ctx.overrideDescriptor(this.nodeProto, "textContent", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getTextContent", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default({ value: val }, target, that);
          this.emit("setTextContent", event);
          if (event.intercepted)
            return event.returnValue;
          target.call(that, event.data.value);
        }
      });
    }
    overrideAppend() {
      this.ctx.override(
        this.nodeProto,
        "append",
        (target, that, [...nodes]) => {
          const event = new hook_default({ nodes }, target, that);
          this.emit("append", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.nodes);
        }
      );
      this.ctx.override(
        this.nodeProto,
        "appendChild",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [node] = args;
          const event = new hook_default({ node }, target, that);
          this.emit("appendChild", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.node);
        }
      );
    }
    overrideBaseURI() {
      this.ctx.overrideDescriptor(this.nodeProto, "baseURI", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("baseURI", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideParent() {
      this.ctx.overrideDescriptor(this.nodeProto, "parentNode", {
        get: (target, that) => {
          const event = new hook_default(
            { node: target.call(that) },
            target,
            that
          );
          this.emit("parentNode", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.node;
        }
      });
      this.ctx.overrideDescriptor(this.nodeProto, "parentElement", {
        get: (target, that) => {
          const event = new hook_default(
            { element: target.call(that) },
            target,
            that
          );
          this.emit("parentElement", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.node;
        }
      });
    }
    overrideOwnerDocument() {
      this.ctx.overrideDescriptor(this.nodeProto, "ownerDocument", {
        get: (target, that) => {
          const event = new hook_default(
            { document: target.call(that) },
            target,
            that
          );
          this.emit("ownerDocument", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.document;
        }
      });
    }
    overrideCompareDocumentPosit1ion() {
      this.ctx.override(
        this.nodeProto,
        "compareDocumentPosition",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [node] = args;
          const event = new hook_default({ node }, target, that);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.node);
        }
      );
    }
    overrideChildMethods() {
      this.ctx.override(this.nodeProto, "removeChild");
    }
  };
  var node_default = NodeApi;

  // src/client/dom/attr.js
  var import_events4 = __toESM(require_events(), 1);
  var AttrApi = class extends import_events4.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Attr = this.window.Attr || {};
      this.attrProto = this.Attr.prototype || {};
      this.value = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.attrProto,
        "value"
      );
      this.name = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.attrProto,
        "name"
      );
      this.getNamedItem = this.attrProto.getNamedItem || null;
      this.setNamedItem = this.attrProto.setNamedItem || null;
      this.removeNamedItem = this.attrProto.removeNamedItem || null;
      this.getNamedItemNS = this.attrProto.getNamedItemNS || null;
      this.setNamedItemNS = this.attrProto.setNamedItemNS || null;
      this.removeNamedItemNS = this.attrProto.removeNamedItemNS || null;
      this.item = this.attrProto.item || null;
    }
    overrideNameValue() {
      this.ctx.overrideDescriptor(this.attrProto, "name", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("name", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
      this.ctx.overrideDescriptor(this.attrProto, "value", {
        get: (target, that) => {
          const event = new hook_default(
            {
              name: this.name.get.call(that),
              value: target.call(that)
            },
            target,
            that
          );
          this.emit("getValue", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default(
            { name: this.name.get.call(that), value: val },
            target,
            that
          );
          this.emit("setValue", event);
          if (event.intercepted)
            return event.returnValue;
          event.target.call(event.that, event.data.value);
        }
      });
    }
    overrideItemMethods() {
      this.ctx.override(
        this.attrProto,
        "getNamedItem",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default({ name }, target, that);
          this.emit("getNamedItem", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(
        this.attrProto,
        "setNamedItem",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [name, value] = args;
          const event = new hook_default({ name, value }, target, that);
          this.emit("setNamedItem", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.name,
            event.data.value
          );
        }
      );
      this.ctx.override(
        this.attrProto,
        "removeNamedItem",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default({ name }, target, that);
          this.emit("removeNamedItem", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(this.attrProto, "item", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [index] = args;
        const event = new hook_default({ index }, target, that);
        this.emit("item", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.name);
      });
      this.ctx.override(
        this.attrProto,
        "getNamedItemNS",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [namespace, localName] = args;
          const event = new hook_default(
            { namespace, localName },
            target,
            that
          );
          this.emit("getNamedItemNS", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.namespace,
            event.data.localName
          );
        }
      );
      this.ctx.override(
        this.attrProto,
        "setNamedItemNS",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [attr] = args;
          const event = new hook_default({ attr }, target, that);
          this.emit("setNamedItemNS", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(
        this.attrProto,
        "removeNamedItemNS",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [namespace, localName] = args;
          const event = new hook_default(
            { namespace, localName },
            target,
            that
          );
          this.emit("removeNamedItemNS", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.namespace,
            event.data.localName
          );
        }
      );
    }
  };
  var attr_default = AttrApi;

  // src/client/native/function.js
  var import_events5 = __toESM(require_events(), 1);
  var FunctionHook = class extends import_events5.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Function = this.window.Function;
      this.fnProto = this.Function.prototype;
      this.toString = this.fnProto.toString;
      this.fnStrings = ctx.fnStrings;
      this.call = this.fnProto.call;
      this.apply = this.fnProto.apply;
      this.bind = this.fnProto.bind;
    }
    overrideFunction() {
      this.ctx.override(
        this.window,
        "Function",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let script = args[args.length - 1];
          let fnArgs = [];
          for (let i = 0; i < args.length - 1; i++) {
            fnArgs.push(args[i]);
          }
          const event = new hook_default(
            { script, args: fnArgs },
            target,
            that
          );
          this.emit("function", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            ...event.data.args,
            event.data.script
          );
        },
        true
      );
    }
    overrideToString() {
      this.ctx.override(this.fnProto, "toString", (target, that) => {
        const event = new hook_default({ fn: that }, target, that);
        this.emit("toString", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.data.fn);
      });
    }
  };
  var function_default = FunctionHook;

  // src/client/native/object.js
  var import_events6 = __toESM(require_events(), 1);
  var ObjectHook = class extends import_events6.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Object = this.window.Object;
      this.getOwnPropertyDescriptors = this.Object.getOwnPropertyDescriptors;
      this.getOwnPropertyDescriptor = this.Object.getOwnPropertyDescriptor;
      this.getOwnPropertyNames = this.Object.getOwnPropertyNames;
    }
    overrideGetPropertyNames() {
      this.ctx.override(
        this.Object,
        "getOwnPropertyNames",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [object] = args;
          const event = new hook_default(
            { names: target.call(that, object) },
            target,
            that
          );
          this.emit("getOwnPropertyNames", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.names;
        }
      );
    }
    overrideGetOwnPropertyDescriptors() {
      this.ctx.override(
        this.Object,
        "getOwnPropertyDescriptors",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [object] = args;
          const event = new hook_default(
            { descriptors: target.call(that, object) },
            target,
            that
          );
          this.emit("getOwnPropertyDescriptors", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.descriptors;
        }
      );
    }
  };
  var object_default = ObjectHook;

  // src/client/requests/fetch.js
  var import_events7 = __toESM(require_events(), 1);
  var Fetch = class extends import_events7.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.fetch = this.window.fetch;
      this.Request = this.window.Request;
      this.Response = this.window.Response;
      this.Headers = this.window.Headers;
      this.reqProto = this.Request ? this.Request.prototype : {};
      this.resProto = this.Response ? this.Response.prototype : {};
      this.headersProto = this.Headers ? this.Headers.prototype : {};
      this.reqUrl = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.reqProto,
        "url"
      );
      this.resUrl = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.resProto,
        "url"
      );
      this.reqHeaders = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.reqProto,
        "headers"
      );
      this.resHeaders = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.resProto,
        "headers"
      );
    }
    override() {
      this.overrideRequest();
      this.overrideUrl();
      this.overrideHeaders();
      return true;
    }
    overrideRequest() {
      if (!this.fetch)
        return false;
      this.ctx.override(this.window, "fetch", (target, that, args) => {
        if (!args.length || args[0] instanceof this.Request)
          return target.apply(that, args);
        let [input, options = {}] = args;
        const event = new hook_default({ input, options }, target, that);
        this.emit("request", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.input,
          event.data.options
        );
      });
      this.ctx.override(
        this.window,
        "Request",
        (target, that, args) => {
          if (!args.length)
            return new target(...args);
          let [input, options = {}] = args;
          const event = new hook_default({ input, options }, target);
          this.emit("request", event);
          if (event.intercepted)
            return event.returnValue;
          return new event.target(event.data.input, event.data.options);
        },
        true
      );
      return true;
    }
    overrideUrl() {
      this.ctx.overrideDescriptor(this.reqProto, "url", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("requestUrl", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
      this.ctx.overrideDescriptor(this.resProto, "url", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("responseUrl", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
      return true;
    }
    overrideHeaders() {
      if (!this.Headers)
        return false;
      this.ctx.overrideDescriptor(this.reqProto, "headers", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("requestHeaders", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
      this.ctx.overrideDescriptor(this.resProto, "headers", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("responseHeaders", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
      this.ctx.override(this.headersProto, "get", (target, that, [name]) => {
        if (!name)
          return target.call(that);
        const event = new hook_default(
          { name, value: target.call(that, name) },
          target,
          that
        );
        this.emit("getHeader", event);
        if (event.intercepted)
          return event.returnValue;
        return event.data.value;
      });
      this.ctx.override(this.headersProto, "set", (target, that, args) => {
        if (2 > args.length)
          return target.apply(that, args);
        let [name, value] = args;
        const event = new hook_default({ name, value }, target, that);
        this.emit("setHeader", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.name,
          event.data.value
        );
      });
      this.ctx.override(this.headersProto, "has", (target, that, args) => {
        if (!args.length)
          return target.call(that);
        let [name] = args;
        const event = new hook_default(
          { name, value: target.call(that, name) },
          target,
          that
        );
        this.emit("hasHeader", event);
        if (event.intercepted)
          return event.returnValue;
        return event.data;
      });
      this.ctx.override(this.headersProto, "append", (target, that, args) => {
        if (2 > args.length)
          return target.apply(that, args);
        let [name, value] = args;
        const event = new hook_default({ name, value }, target, that);
        this.emit("appendHeader", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.name,
          event.data.value
        );
      });
      this.ctx.override(this.headersProto, "delete", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [name] = args;
        const event = new hook_default({ name }, target, that);
        this.emit("deleteHeader", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.name);
      });
      return true;
    }
  };
  var fetch_default = Fetch;

  // src/client/requests/xhr.js
  var import_events8 = __toESM(require_events(), 1);
  var Xhr = class extends import_events8.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.XMLHttpRequest = this.window.XMLHttpRequest;
      this.xhrProto = this.window.XMLHttpRequest ? this.window.XMLHttpRequest.prototype : {};
      this.open = this.xhrProto.open;
      this.abort = this.xhrProto.abort;
      this.send = this.xhrProto.send;
      this.overrideMimeType = this.xhrProto.overrideMimeType;
      this.getAllResponseHeaders = this.xhrProto.getAllResponseHeaders;
      this.getResponseHeader = this.xhrProto.getResponseHeader;
      this.setRequestHeader = this.xhrProto.setRequestHeader;
      this.responseURL = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.xhrProto,
        "responseURL"
      );
      this.responseText = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.xhrProto,
        "responseText"
      );
    }
    override() {
      this.overrideOpen();
      this.overrideSend();
      this.overrideMimeType();
      this.overrideGetResHeader();
      this.overrideGetResHeaders();
      this.overrideSetReqHeader();
    }
    overrideOpen() {
      this.ctx.override(this.xhrProto, "open", (target, that, args) => {
        if (2 > args.length)
          return target.apply(that, args);
        let [method, input, async = true, user = null, password = null] = args;
        const event = new hook_default(
          { method, input, async, user, password },
          target,
          that
        );
        this.emit("open", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.method,
          event.data.input,
          event.data.async,
          event.data.user,
          event.data.password
        );
      });
    }
    overrideResponseUrl() {
      this.ctx.overrideDescriptor(this.xhrProto, "responseURL", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("responseUrl", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideSend() {
      this.ctx.override(
        this.xhrProto,
        "send",
        (target, that, [body = null]) => {
          const event = new hook_default({ body }, target, that);
          this.emit("send", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.body);
        }
      );
    }
    overrideSetReqHeader() {
      this.ctx.override(
        this.xhrProto,
        "setRequestHeader",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [name, value] = args;
          const event = new hook_default({ name, value }, target, that);
          this.emit("setReqHeader", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.name,
            event.data.value
          );
        }
      );
    }
    overrideGetResHeaders() {
      this.ctx.override(
        this.xhrProto,
        "getAllResponseHeaders",
        (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getAllResponseHeaders", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      );
    }
    overrideGetResHeader() {
      this.ctx.override(
        this.xhrProto,
        "getResponseHeader",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [name] = args;
          const event = new hook_default(
            { name, value: target.call(that, name) },
            target,
            that
          );
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      );
    }
  };
  var xhr_default = Xhr;

  // src/client/requests/eventsource.js
  var import_events9 = __toESM(require_events(), 1);
  var EventSourceApi = class extends import_events9.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.EventSource = this.window.EventSource || {};
      this.esProto = this.EventSource.prototype || {};
      this.url = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.esProto,
        "url"
      );
      this.CONNECTING = 0;
      this.OPEN = 1;
      this.CLOSED = 2;
    }
    overrideConstruct() {
      this.ctx.override(
        this.window,
        "EventSource",
        (target, that, args) => {
          if (!args.length)
            return new target(...args);
          let [url, config = {}] = args;
          const event = new hook_default({ url, config }, target, that);
          this.emit("construct", event);
          if (event.intercepted)
            return event.returnValue;
          return new event.target(event.data.url, event.data.config);
        },
        true
      );
      if ("EventSource" in this.window) {
        this.window.EventSource.CONNECTING = this.CONNECTING;
        this.window.EventSource.OPEN = this.OPEN;
        this.window.EventSource.CLOSED = this.CLOSED;
      }
    }
    overrideUrl() {
      this.ctx.overrideDescriptor(this.esProto, "url", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("url", event);
          return event.data.value;
        }
      });
    }
  };
  var eventsource_default = EventSourceApi;

  // src/client/history.js
  var import_events10 = __toESM(require_events(), 1);
  var History = class extends import_events10.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = this.ctx.window;
      this.History = this.window.History;
      this.history = this.window.history;
      this.historyProto = this.History ? this.History.prototype : {};
      this.pushState = this.historyProto.pushState;
      this.replaceState = this.historyProto.replaceState;
      this.go = this.historyProto.go;
      this.back = this.historyProto.back;
      this.forward = this.historyProto.forward;
    }
    override() {
      this.overridePushState();
      this.overrideReplaceState();
      this.overrideGo();
      this.overrideForward();
      this.overrideBack();
    }
    overridePushState() {
      this.ctx.override(
        this.historyProto,
        "pushState",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [state, title, url = ""] = args;
          const event = new hook_default(
            { state, title, url },
            target,
            that
          );
          this.emit("pushState", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.state,
            event.data.title,
            event.data.url
          );
        }
      );
    }
    overrideReplaceState() {
      this.ctx.override(
        this.historyProto,
        "replaceState",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [state, title, url = ""] = args;
          const event = new hook_default(
            { state, title, url },
            target,
            that
          );
          this.emit("replaceState", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.state,
            event.data.title,
            event.data.url
          );
        }
      );
    }
    overrideGo() {
      this.ctx.override(this.historyProto, "go", (target, that, [delta]) => {
        const event = new hook_default({ delta }, target, that);
        this.emit("go", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.delta);
      });
    }
    overrideForward() {
      this.ctx.override(this.historyProto, "forward", (target, that) => {
        const event = new hook_default(null, target, that);
        this.emit("forward", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that);
      });
    }
    overrideBack() {
      this.ctx.override(this.historyProto, "back", (target, that) => {
        const event = new hook_default(null, target, that);
        this.emit("back", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that);
      });
    }
  };
  var history_default = History;

  // src/client/location.js
  var import_events11 = __toESM(require_events(), 1);
  var LocationApi = class extends import_events11.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.location = this.window.location;
      this.WorkerLocation = this.ctx.worker ? this.window.WorkerLocation : null;
      this.workerLocProto = this.WorkerLocation ? this.WorkerLocation.prototype : {};
      this.keys = [
        "href",
        "protocol",
        "host",
        "hostname",
        "port",
        "pathname",
        "search",
        "hash",
        "origin"
      ];
      this.HashChangeEvent = this.window.HashChangeEvent || null;
      this.href = this.WorkerLocation ? ctx.nativeMethods.getOwnPropertyDescriptor(
        this.workerLocProto,
        "href"
      ) : ctx.nativeMethods.getOwnPropertyDescriptor(this.location, "href");
    }
    overrideWorkerLocation(parse) {
      if (!this.WorkerLocation)
        return false;
      const uv = this;
      for (const key of this.keys) {
        this.ctx.overrideDescriptor(this.workerLocProto, key, {
          get: () => {
            return parse(uv.href.get.call(this.location))[key];
          }
        });
      }
      return true;
    }
    emulate(parse, wrap) {
      const emulation = {};
      const that = this;
      for (const key of that.keys) {
        this.ctx.nativeMethods.defineProperty(emulation, key, {
          get() {
            return parse(that.href.get.call(that.location))[key];
          },
          set: key !== "origin" ? function(val) {
            switch (key) {
              case "href":
                that.location.href = wrap(val);
                break;
              case "hash":
                that.emit(
                  "hashchange",
                  emulation.href,
                  val.trim().startsWith("#") ? new URL(
                    val.trim(),
                    emulation.href
                  ).href : new URL(
                    "#" + val.trim(),
                    emulation.href
                  ).href,
                  that
                );
                break;
              default:
                {
                  const url = new URL(emulation.href);
                  url[key] = val;
                  that.location.href = wrap(url.href);
                }
                break;
            }
          } : void 0,
          configurable: false,
          enumerable: true
        });
      }
      if ("reload" in this.location) {
        this.ctx.nativeMethods.defineProperty(emulation, "reload", {
          value: this.ctx.wrap(
            this.location,
            "reload",
            (target, that2) => {
              return target.call(
                that2 === emulation ? this.location : that2
              );
            }
          ),
          writable: false,
          enumerable: true
        });
      }
      if ("replace" in this.location) {
        this.ctx.nativeMethods.defineProperty(emulation, "replace", {
          value: this.ctx.wrap(
            this.location,
            "assign",
            (target, that2, args) => {
              if (!args.length || that2 !== emulation)
                target.call(that2);
              that2 = this.location;
              let [input] = args;
              const url = new URL(input, emulation.href);
              return target.call(
                that2 === emulation ? this.location : that2,
                wrap(url.href)
              );
            }
          ),
          writable: false,
          enumerable: true
        });
      }
      if ("assign" in this.location) {
        this.ctx.nativeMethods.defineProperty(emulation, "assign", {
          value: this.ctx.wrap(
            this.location,
            "assign",
            (target, that2, args) => {
              if (!args.length || that2 !== emulation)
                target.call(that2);
              that2 = this.location;
              let [input] = args;
              const url = new URL(input, emulation.href);
              return target.call(
                that2 === emulation ? this.location : that2,
                wrap(url.href)
              );
            }
          ),
          writable: false,
          enumerable: true
        });
      }
      if ("ancestorOrigins" in this.location) {
        this.ctx.nativeMethods.defineProperty(
          emulation,
          "ancestorOrigins",
          {
            get() {
              const arr = [];
              if (that.window.DOMStringList)
                that.ctx.nativeMethods.setPrototypeOf(
                  arr,
                  that.window.DOMStringList.prototype
                );
              return arr;
            },
            set: void 0,
            enumerable: true
          }
        );
      }
      this.ctx.nativeMethods.defineProperty(emulation, "toString", {
        value: this.ctx.wrap(this.location, "toString", () => {
          return emulation.href;
        }),
        enumerable: true,
        writable: false
      });
      this.ctx.nativeMethods.defineProperty(emulation, Symbol.toPrimitive, {
        value: () => emulation.href,
        writable: false,
        enumerable: false
      });
      if (this.ctx.window.Location)
        this.ctx.nativeMethods.setPrototypeOf(
          emulation,
          this.ctx.window.Location.prototype
        );
      return emulation;
    }
  };
  var location_default = LocationApi;

  // src/client/message.js
  var import_events12 = __toESM(require_events(), 1);
  var MessageApi = class extends import_events12.default {
    /**
     *
     * @param {Ultraviolet} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = this.ctx.window;
      this.postMessage = this.window.postMessage;
      this.MessageEvent = this.window.MessageEvent || {};
      this.MessagePort = this.window.MessagePort || {};
      this.mpProto = this.MessagePort.prototype || {};
      this.mpPostMessage = this.mpProto.postMessage;
      this.messageProto = this.MessageEvent.prototype || {};
      this.messageData = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.messageProto,
        "data"
      );
      this.messageOrigin = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.messageProto,
        "origin"
      );
    }
    overridePostMessage() {
      this.ctx.override(this.window, "postMessage", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let message;
        let origin;
        let transfer;
        if (!this.ctx.worker) {
          [message, origin, transfer = []] = args;
        } else {
          [message, transfer = []] = args;
        }
        const event = new hook_default(
          { message, origin, transfer, worker: this.ctx.worker },
          target,
          that
        );
        this.emit("postMessage", event);
        if (event.intercepted)
          return event.returnValue;
        return this.ctx.worker ? event.target.call(
          event.that,
          event.data.message,
          event.data.transfer
        ) : event.target.call(
          event.that,
          event.data.message,
          event.data.origin,
          event.data.transfer
        );
      });
    }
    wrapPostMessage(obj, prop, noOrigin = false) {
      return this.ctx.wrap(obj, prop, (target, that, args) => {
        if (this.ctx.worker ? !args.length : 2 > args)
          return target.apply(that, args);
        let message;
        let origin;
        let transfer;
        if (!noOrigin) {
          [message, origin, transfer = []] = args;
        } else {
          [message, transfer = []] = args;
          origin = null;
        }
        const event = new hook_default(
          { message, origin, transfer, worker: this.ctx.worker },
          target,
          obj
        );
        this.emit("postMessage", event);
        if (event.intercepted)
          return event.returnValue;
        return noOrigin ? event.target.call(
          event.that,
          event.data.message,
          event.data.transfer
        ) : event.target.call(
          event.that,
          event.data.message,
          event.data.origin,
          event.data.transfer
        );
      });
    }
    overrideMessageOrigin() {
      this.ctx.overrideDescriptor(this.messageProto, "origin", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("origin", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
    overrideMessageData() {
      this.ctx.overrideDescriptor(this.messageProto, "data", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("data", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
  };
  var message_default = MessageApi;

  // src/client/navigator.js
  var import_events13 = __toESM(require_events(), 1);
  var NavigatorApi = class extends import_events13.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.navigator = this.window.navigator;
      this.Navigator = this.window.Navigator || {};
      this.navProto = this.Navigator.prototype || {};
      this.sendBeacon = this.navProto.sendBeacon;
    }
    overrideSendBeacon() {
      this.ctx.override(this.navProto, "sendBeacon", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [url, data = ""] = args;
        const event = new hook_default({ url, data }, target, that);
        this.emit("sendBeacon", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.url,
          event.data.data
        );
      });
    }
  };
  var navigator_default = NavigatorApi;

  // src/client/worker.js
  var import_events14 = __toESM(require_events(), 1);
  var Workers = class extends import_events14.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.Worker = this.window.Worker || {};
      this.Worklet = this.window.Worklet || {};
      this.workletProto = this.Worklet.prototype || {};
      this.workerProto = this.Worker.prototype || {};
      this.postMessage = this.workerProto.postMessage;
      this.terminate = this.workerProto.terminate;
      this.addModule = this.workletProto.addModule;
    }
    overrideWorker() {
      this.ctx.override(
        this.window,
        "Worker",
        (target, that, args) => {
          if (!args.length)
            return new target(...args);
          let [url, options = {}] = args;
          const event = new hook_default({ url, options }, target, that);
          this.emit("worker", event);
          if (event.intercepted)
            return event.returnValue;
          return new event.target(
            ...[event.data.url, event.data.options]
          );
        },
        true
      );
    }
    overrideAddModule() {
      this.ctx.override(
        this.workletProto,
        "addModule",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [url, options = {}] = args;
          const event = new hook_default({ url, options }, target, that);
          this.emit("addModule", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.url,
            event.data.options
          );
        }
      );
    }
    overridePostMessage() {
      this.ctx.override(
        this.workerProto,
        "postMessage",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [message, transfer = []] = args;
          const event = new hook_default(
            { message, transfer },
            target,
            that
          );
          this.emit("postMessage", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.message,
            event.data.transfer
          );
        }
      );
    }
    overrideImportScripts() {
      this.ctx.override(
        this.window,
        "importScripts",
        (target, that, scripts) => {
          if (!scripts.length)
            return target.apply(that, scripts);
          const event = new hook_default({ scripts }, target, that);
          this.emit("importScripts", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.apply(event.that, event.data.scripts);
        }
      );
    }
  };
  var worker_default = Workers;

  // src/client/url.js
  var import_events15 = __toESM(require_events(), 1);
  var URLApi = class extends import_events15.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = this.ctx.window;
      this.URL = this.window.URL || {};
      this.createObjectURL = this.URL.createObjectURL;
      this.revokeObjectURL = this.URL.revokeObjectURL;
    }
    overrideObjectURL() {
      this.ctx.override(this.URL, "createObjectURL", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [object] = args;
        const event = new hook_default({ object }, target, that);
        this.emit("createObjectURL", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.object);
      });
      this.ctx.override(this.URL, "revokeObjectURL", (target, that, args) => {
        if (!args.length)
          return target.apply(that, args);
        let [url] = args;
        const event = new hook_default({ url }, target, that);
        this.emit("revokeObjectURL", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.url);
      });
    }
  };
  var url_default = URLApi;

  // src/client/index.js
  var import_events20 = __toESM(require_events(), 1);

  // src/client/storage.js
  var import_events16 = __toESM(require_events(), 1);
  var StorageApi = class extends import_events16.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.localStorage = this.window.localStorage || null;
      this.sessionStorage = this.window.sessionStorage || null;
      this.Storage = this.window.Storage || {};
      this.storeProto = this.Storage.prototype || {};
      this.getItem = this.storeProto.getItem || null;
      this.setItem = this.storeProto.setItem || null;
      this.removeItem = this.storeProto.removeItem || null;
      this.clear = this.storeProto.clear || null;
      this.key = this.storeProto.key || null;
      this.methods = ["key", "getItem", "setItem", "removeItem", "clear"];
      this.wrappers = new ctx.nativeMethods.Map();
    }
    overrideMethods() {
      this.ctx.override(this.storeProto, "getItem", (target, that, args) => {
        if (!args.length)
          return target.apply(this.wrappers.get(that) || that, args);
        let [name] = args;
        const event = new hook_default(
          { name },
          target,
          this.wrappers.get(that) || that
        );
        this.emit("getItem", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.name);
      });
      this.ctx.override(this.storeProto, "setItem", (target, that, args) => {
        if (2 > args.length)
          return target.apply(this.wrappers.get(that) || that, args);
        let [name, value] = args;
        const event = new hook_default(
          { name, value },
          target,
          this.wrappers.get(that) || that
        );
        this.emit("setItem", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(
          event.that,
          event.data.name,
          event.data.value
        );
      });
      this.ctx.override(
        this.storeProto,
        "removeItem",
        (target, that, args) => {
          if (!args.length)
            return target.apply(this.wrappers.get(that) || that, args);
          let [name] = args;
          const event = new hook_default(
            { name },
            target,
            this.wrappers.get(that) || that
          );
          this.emit("removeItem", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.name);
        }
      );
      this.ctx.override(this.storeProto, "clear", (target, that) => {
        const event = new hook_default(
          null,
          target,
          this.wrappers.get(that) || that
        );
        this.emit("clear", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that);
      });
      this.ctx.override(this.storeProto, "key", (target, that, args) => {
        if (!args.length)
          return target.apply(this.wrappers.get(that) || that, args);
        let [index] = args;
        const event = new hook_default(
          { index },
          target,
          this.wrappers.get(that) || that
        );
        this.emit("key", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.index);
      });
    }
    overrideLength() {
      this.ctx.overrideDescriptor(this.storeProto, "length", {
        get: (target, that) => {
          const event = new hook_default(
            { length: target.call(this.wrappers.get(that) || that) },
            target,
            this.wrappers.get(that) || that
          );
          this.emit("length", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.length;
        }
      });
    }
    emulate(storage, obj = {}) {
      this.ctx.nativeMethods.setPrototypeOf(obj, this.storeProto);
      const proxy = new this.ctx.window.Proxy(obj, {
        get: (target, prop) => {
          if (prop in this.storeProto || typeof prop === "symbol")
            return storage[prop];
          const event = new hook_default({ name: prop }, null, storage);
          this.emit("get", event);
          if (event.intercepted)
            return event.returnValue;
          return storage[event.data.name];
        },
        set: (target, prop, value) => {
          if (prop in this.storeProto || typeof prop === "symbol")
            return storage[prop] = value;
          const event = new hook_default(
            { name: prop, value },
            null,
            storage
          );
          this.emit("set", event);
          if (event.intercepted)
            return event.returnValue;
          return storage[event.data.name] = event.data.value;
        },
        deleteProperty: (target, prop) => {
          if (typeof prop === "symbol")
            return delete storage[prop];
          const event = new hook_default({ name: prop }, null, storage);
          this.emit("delete", event);
          if (event.intercepted)
            return event.returnValue;
          return delete storage[event.data.name];
        }
      });
      this.wrappers.set(proxy, storage);
      this.ctx.nativeMethods.setPrototypeOf(proxy, this.storeProto);
      return proxy;
    }
  };
  var storage_default = StorageApi;

  // src/client/dom/style.js
  var import_events17 = __toESM(require_events(), 1);
  var StyleApi = class extends import_events17.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.CSSStyleDeclaration = this.window.CSSStyleDeclaration || {};
      this.cssStyleProto = this.CSSStyleDeclaration.prototype || {};
      this.getPropertyValue = this.cssStyleProto.getPropertyValue || null;
      this.setProperty = this.cssStyleProto.setProperty || null;
      this.cssText - ctx.nativeMethods.getOwnPropertyDescriptors(
        this.cssStyleProto,
        "cssText"
      );
      this.urlProps = [
        "background",
        "backgroundImage",
        "borderImage",
        "borderImageSource",
        "listStyle",
        "listStyleImage",
        "cursor"
      ];
      this.dashedUrlProps = [
        "background",
        "background-image",
        "border-image",
        "border-image-source",
        "list-style",
        "list-style-image",
        "cursor"
      ];
      this.propToDashed = {
        background: "background",
        backgroundImage: "background-image",
        borderImage: "border-image",
        borderImageSource: "border-image-source",
        listStyle: "list-style",
        listStyleImage: "list-style-image",
        cursor: "cursor"
      };
    }
    overrideSetGetProperty() {
      this.ctx.override(
        this.cssStyleProto,
        "getPropertyValue",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          let [property] = args;
          const event = new hook_default({ property }, target, that);
          this.emit("getPropertyValue", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.property);
        }
      );
      this.ctx.override(
        this.cssStyleProto,
        "setProperty",
        (target, that, args) => {
          if (2 > args.length)
            return target.apply(that, args);
          let [property, value] = args;
          const event = new hook_default({ property, value }, target, that);
          this.emit("setProperty", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.property,
            event.data.value
          );
        }
      );
    }
    overrideCssText() {
      this.ctx.overrideDescriptor(this.cssStyleProto, "cssText", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("getCssText", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        },
        set: (target, that, [val]) => {
          const event = new hook_default({ value: val }, target, that);
          this.emit("setCssText", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(event.that, event.data.value);
        }
      });
    }
  };
  var style_default = StyleApi;

  // src/client/idb.js
  var import_events18 = __toESM(require_events(), 1);
  var IDBApi = class extends import_events18.default {
    /**
     *
     * @param {Ultraviolet} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = this.ctx.window;
      this.IDBDatabase = this.window.IDBDatabase || {};
      this.idbDatabaseProto = this.IDBDatabase.prototype || {};
      this.IDBFactory = this.window.IDBFactory || {};
      this.idbFactoryProto = this.IDBFactory.prototype || {};
      this.open = this.idbFactoryProto.open;
    }
    overrideOpen() {
      this.ctx.override(
        this.IDBFactory.prototype,
        "open",
        (target, that, args) => {
          if (!args.length)
            return target.apply(that, args);
          if (!args.length)
            return target.apply(that, args);
          const [name, version] = args;
          const event = new hook_default({ name, version }, target, that);
          this.emit("idbFactoryOpen", event);
          if (event.intercepted)
            return event.returnValue;
          return event.target.call(
            event.that,
            event.data.name,
            event.data.version
          );
        }
      );
    }
    overrideName() {
      this.ctx.overrideDescriptor(this.idbDatabaseProto, "name", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("idbFactoryName", event);
          if (event.intercepted)
            return event.returnValue;
          return event.data.value;
        }
      });
    }
  };
  var idb_default = IDBApi;

  // src/client/requests/websocket.js
  var import_events19 = __toESM(require_events(), 1);
  var WebSocketApi = class extends import_events19.default {
    /**
     *
     * @param {UVClient} ctx
     */
    constructor(ctx) {
      super();
      this.ctx = ctx;
      this.window = ctx.window;
      this.WebSocket = this.window.WebSocket || {};
      this.wsProto = this.WebSocket.prototype || {};
      this.url = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.wsProto,
        "url"
      );
      this.protocol = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.wsProto,
        "protocol"
      );
      this.readyState = ctx.nativeMethods.getOwnPropertyDescriptor(
        this.wsProto,
        "readyState"
      );
      this.send = this.wsProto.send;
      this.CONNECTING = WebSocket.CONNECTING;
      this.OPEN = WebSocket.OPEN;
      this.CLOSING = WebSocket.CLOSING;
      this.CLOSED = WebSocket.CLOSED;
    }
    overrideWebSocket() {
      this.ctx.override(
        this.window,
        "WebSocket",
        (target, that, args) => {
          if (!args.length)
            return new target(...args);
          const event = new hook_default({ args }, target, that);
          this.emit("websocket", event);
          if (event.intercepted)
            return event.returnValue;
          return new event.target(event.data.url, event.data.protocols);
        },
        true
      );
      this.window.WebSocket.CONNECTING = this.CONNECTING;
      this.window.WebSocket.OPEN = this.OPEN;
      this.window.WebSocket.CLOSING = this.CLOSING;
      this.window.WebSocket.CLOSED = this.CLOSED;
    }
    overrideURL() {
      this.ctx.overrideDescriptor(this.wsProto, "url", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("url", event);
          return event.data.value;
        }
      });
    }
    overrideProtocol() {
      this.ctx.overrideDescriptor(this.wsProto, "protocol", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("protocol", event);
          return event.data.value;
        }
      });
    }
    overrideReadyState() {
      this.ctx.overrideDescriptor(this.wsProto, "readyState", {
        get: (target, that) => {
          const event = new hook_default(
            { value: target.call(that) },
            target,
            that
          );
          this.emit("readyState", event);
          return event.data.value;
        }
      });
    }
    overrideSend() {
      this.ctx.override(this.wsProto, "send", (target, that, args) => {
        const event = new hook_default({ args }, target, that);
        this.emit("send", event);
        if (event.intercepted)
          return event.returnValue;
        return event.target.call(event.that, event.data.args);
      });
    }
  };
  var websocket_default = WebSocketApi;

  // src/client/index.js
  var UVClient = class extends import_events20.default {
    /**
     *
     * @param {typeof globalThis} window
     * @param {import('@tomphttp/bare-client').BareClient} bareClient
     * @param {boolean} worker
     */
    constructor(window = self, bareClient, worker = !window.window) {
      super();
      this.window = window;
      this.nativeMethods = {
        fnToString: this.window.Function.prototype.toString,
        defineProperty: this.window.Object.defineProperty,
        getOwnPropertyDescriptor: this.window.Object.getOwnPropertyDescriptor,
        getOwnPropertyDescriptors: this.window.Object.getOwnPropertyDescriptors,
        getOwnPropertyNames: this.window.Object.getOwnPropertyNames,
        keys: this.window.Object.keys,
        getOwnPropertySymbols: this.window.Object.getOwnPropertySymbols,
        isArray: this.window.Array.isArray,
        setPrototypeOf: this.window.Object.setPrototypeOf,
        isExtensible: this.window.Object.isExtensible,
        Map: this.window.Map,
        Proxy: this.window.Proxy
      };
      this.worker = worker;
      this.bareClient = bareClient;
      this.fetch = new fetch_default(this);
      this.xhr = new xhr_default(this);
      this.idb = new idb_default(this);
      this.history = new history_default(this);
      this.element = new element_default(this);
      this.node = new node_default(this);
      this.document = new document_default(this);
      this.function = new function_default(this);
      this.object = new object_default(this);
      this.websocket = new websocket_default(this);
      this.message = new message_default(this);
      this.navigator = new navigator_default(this);
      this.eventSource = new eventsource_default(this);
      this.attribute = new attr_default(this);
      this.url = new url_default(this);
      this.workers = new worker_default(this);
      this.location = new location_default(this);
      this.storage = new storage_default(this);
      this.style = new style_default(this);
    }
    /**
     *
     * @param {*} obj
     * @param {PropertyKey} prop
     * @param {WrapFun} wrapper
     * @param {boolean} [construct]
     * @returns
     */
    override(obj, prop, wrapper, construct) {
      const wrapped = this.wrap(obj, prop, wrapper, construct);
      obj[prop] = wrapped;
      return wrapped;
    }
    /**
     *
     * @param {*} obj
     * @param {PropertyKey} prop
     * @param {WrapPropertyDescriptor} [wrapObj]
     * @returns
     */
    overrideDescriptor(obj, prop, wrapObj = {}) {
      const wrapped = this.wrapDescriptor(obj, prop, wrapObj);
      if (!wrapped)
        return {};
      this.nativeMethods.defineProperty(obj, prop, wrapped);
      return wrapped;
    }
    /**
     *
     * @template T
     * @param {*} obj
     * @param {PropertyKey} prop
     * @param {WrapFun<T>} wrap
     * @param {boolean} [construct]
     * @returns {T}
     */
    wrap(obj, prop, wrap, construct = false) {
      const fn = obj[prop];
      if (!fn)
        return fn;
      const wrapped = "prototype" in fn ? function attach() {
        return wrap(fn, this, [...arguments]);
      } : {
        attach() {
          return wrap(fn, this, [...arguments]);
        }
      }.attach;
      if (construct) {
        wrapped.prototype = fn.prototype;
        wrapped.prototype.constructor = wrapped;
      }
      this.emit("wrap", fn, wrapped, construct);
      return wrapped;
    }
    /**
     *
     * @param {*} obj
     * @param {PropertyKey} prop
     * @param {WrapPropertyDescriptor} [wrapObj]
     * @returns
     */
    wrapDescriptor(obj, prop, wrapObj = {}) {
      const descriptor = this.nativeMethods.getOwnPropertyDescriptor(
        obj,
        prop
      );
      if (!descriptor)
        return false;
      for (let key in wrapObj) {
        if (key in descriptor) {
          if (key === "get" || key === "set") {
            descriptor[key] = this.wrap(descriptor, key, wrapObj[key]);
          } else {
            descriptor[key] = typeof wrapObj[key] == "function" ? wrapObj[key](descriptor[key]) : wrapObj[key];
          }
        }
      }
      return descriptor;
    }
  };
  var client_default = UVClient;
  if (typeof self === "object")
    self.UVClient = UVClient;
})();
//# sourceMappingURL=uv.client.js.map
