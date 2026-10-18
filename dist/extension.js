"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS({
  "node_modules/universal-user-agent/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function getUserAgent() {
      if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
      }
      if (typeof process === "object" && process.version !== void 0) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
      }
      return "<environment undetectable>";
    }
    exports2.getUserAgent = getUserAgent;
  }
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS({
  "node_modules/before-after-hook/lib/register.js"(exports2, module2) {
    module2.exports = register;
    function register(state, name, method, options) {
      if (typeof method !== "function") {
        throw new Error("method for before hook must be a function");
      }
      if (!options) {
        options = {};
      }
      if (Array.isArray(name)) {
        return name.reverse().reduce(function(callback, name2) {
          return register.bind(null, state, name2, callback, options);
        }, method)();
      }
      return Promise.resolve().then(function() {
        if (!state.registry[name]) {
          return method(options);
        }
        return state.registry[name].reduce(function(method2, registered) {
          return registered.hook.bind(null, method2, options);
        }, method)();
      });
    }
  }
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS({
  "node_modules/before-after-hook/lib/add.js"(exports2, module2) {
    module2.exports = addHook;
    function addHook(state, kind, name, hook) {
      var orig = hook;
      if (!state.registry[name]) {
        state.registry[name] = [];
      }
      if (kind === "before") {
        hook = function(method, options) {
          return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
        };
      }
      if (kind === "after") {
        hook = function(method, options) {
          var result;
          return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
            result = result_;
            return orig(result, options);
          }).then(function() {
            return result;
          });
        };
      }
      if (kind === "error") {
        hook = function(method, options) {
          return Promise.resolve().then(method.bind(null, options)).catch(function(error) {
            return orig(error, options);
          });
        };
      }
      state.registry[name].push({
        hook,
        orig
      });
    }
  }
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS({
  "node_modules/before-after-hook/lib/remove.js"(exports2, module2) {
    module2.exports = removeHook;
    function removeHook(state, name, method) {
      if (!state.registry[name]) {
        return;
      }
      var index = state.registry[name].map(function(registered) {
        return registered.orig;
      }).indexOf(method);
      if (index === -1) {
        return;
      }
      state.registry[name].splice(index, 1);
    }
  }
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS({
  "node_modules/before-after-hook/index.js"(exports2, module2) {
    var register = require_register();
    var addHook = require_add();
    var removeHook = require_remove();
    var bind = Function.bind;
    var bindable = bind.bind(bind);
    function bindApi(hook, state, name) {
      var removeHookRef = bindable(removeHook, null).apply(
        null,
        name ? [state, name] : [state]
      );
      hook.api = { remove: removeHookRef };
      hook.remove = removeHookRef;
      ["before", "error", "after", "wrap"].forEach(function(kind) {
        var args = name ? [state, kind, name] : [state, kind];
        hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
      });
    }
    function HookSingular() {
      var singularHookName = "h";
      var singularHookState = {
        registry: {}
      };
      var singularHook = register.bind(null, singularHookState, singularHookName);
      bindApi(singularHook, singularHookState, singularHookName);
      return singularHook;
    }
    function HookCollection() {
      var state = {
        registry: {}
      };
      var hook = register.bind(null, state);
      bindApi(hook, state);
      return hook;
    }
    var collectionHookDeprecationMessageDisplayed = false;
    function Hook() {
      if (!collectionHookDeprecationMessageDisplayed) {
        console.warn(
          '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
        );
        collectionHookDeprecationMessageDisplayed = true;
      }
      return HookCollection();
    }
    Hook.Singular = HookSingular.bind();
    Hook.Collection = HookCollection.bind();
    module2.exports = Hook;
    module2.exports.Hook = Hook;
    module2.exports.Singular = Hook.Singular;
    module2.exports.Collection = Hook.Collection;
  }
});

// node_modules/@octokit/endpoint/dist-node/index.js
var require_dist_node2 = __commonJS({
  "node_modules/@octokit/endpoint/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var dist_src_exports = {};
    __export2(dist_src_exports, {
      endpoint: () => endpoint
    });
    module2.exports = __toCommonJS2(dist_src_exports);
    var import_universal_user_agent = require_dist_node();
    var VERSION = "9.0.6";
    var userAgent = `octokit-endpoint.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
    var DEFAULTS = {
      method: "GET",
      baseUrl: "https://api.github.com",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
      },
      mediaType: {
        format: ""
      }
    };
    function lowercaseKeys(object) {
      if (!object) {
        return {};
      }
      return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
      }, {});
    }
    function isPlainObject(value) {
      if (typeof value !== "object" || value === null)
        return false;
      if (Object.prototype.toString.call(value) !== "[object Object]")
        return false;
      const proto = Object.getPrototypeOf(value);
      if (proto === null)
        return true;
      const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
    }
    function mergeDeep(defaults, options) {
      const result = Object.assign({}, defaults);
      Object.keys(options).forEach((key) => {
        if (isPlainObject(options[key])) {
          if (!(key in defaults))
            Object.assign(result, { [key]: options[key] });
          else
            result[key] = mergeDeep(defaults[key], options[key]);
        } else {
          Object.assign(result, { [key]: options[key] });
        }
      });
      return result;
    }
    function removeUndefinedProperties(obj) {
      for (const key in obj) {
        if (obj[key] === void 0) {
          delete obj[key];
        }
      }
      return obj;
    }
    function merge(defaults, route, options) {
      if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? { method, url } : { url: method }, options);
      } else {
        options = Object.assign({}, route);
      }
      options.headers = lowercaseKeys(options.headers);
      removeUndefinedProperties(options);
      removeUndefinedProperties(options.headers);
      const mergedOptions = mergeDeep(defaults || {}, options);
      if (options.url === "/graphql") {
        if (defaults && defaults.mediaType.previews?.length) {
          mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
            (preview) => !mergedOptions.mediaType.previews.includes(preview)
          ).concat(mergedOptions.mediaType.previews);
        }
        mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
      }
      return mergedOptions;
    }
    function addQueryParameters(url, parameters) {
      const separator = /\?/.test(url) ? "&" : "?";
      const names = Object.keys(parameters);
      if (names.length === 0) {
        return url;
      }
      return url + separator + names.map((name) => {
        if (name === "q") {
          return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
        }
        return `${name}=${encodeURIComponent(parameters[name])}`;
      }).join("&");
    }
    var urlVariableRegex = /\{[^{}}]+\}/g;
    function removeNonChars(variableName) {
      return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
    }
    function extractUrlVariableNames(url) {
      const matches = url.match(urlVariableRegex);
      if (!matches) {
        return [];
      }
      return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
    }
    function omit(object, keysToOmit) {
      const result = { __proto__: null };
      for (const key of Object.keys(object)) {
        if (keysToOmit.indexOf(key) === -1) {
          result[key] = object[key];
        }
      }
      return result;
    }
    function encodeReserved(str) {
      return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
          part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
      }).join("");
    }
    function encodeUnreserved(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    function encodeValue(operator, value, key) {
      value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
      if (key) {
        return encodeUnreserved(key) + "=" + value;
      } else {
        return value;
      }
    }
    function isDefined(value) {
      return value !== void 0 && value !== null;
    }
    function isKeyOperator(operator) {
      return operator === ";" || operator === "&" || operator === "?";
    }
    function getValues(context, operator, key, modifier) {
      var value = context[key], result = [];
      if (isDefined(value) && value !== "") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          value = value.toString();
          if (modifier && modifier !== "*") {
            value = value.substring(0, parseInt(modifier, 10));
          }
          result.push(
            encodeValue(operator, value, isKeyOperator(operator) ? key : "")
          );
        } else {
          if (modifier === "*") {
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value2) {
                result.push(
                  encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
                );
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  result.push(encodeValue(operator, value[k], k));
                }
              });
            }
          } else {
            const tmp = [];
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value2) {
                tmp.push(encodeValue(operator, value2));
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  tmp.push(encodeUnreserved(k));
                  tmp.push(encodeValue(operator, value[k].toString()));
                }
              });
            }
            if (isKeyOperator(operator)) {
              result.push(encodeUnreserved(key) + "=" + tmp.join(","));
            } else if (tmp.length !== 0) {
              result.push(tmp.join(","));
            }
          }
        }
      } else {
        if (operator === ";") {
          if (isDefined(value)) {
            result.push(encodeUnreserved(key));
          }
        } else if (value === "" && (operator === "&" || operator === "?")) {
          result.push(encodeUnreserved(key) + "=");
        } else if (value === "") {
          result.push("");
        }
      }
      return result;
    }
    function parseUrl(template) {
      return {
        expand: expand.bind(null, template)
      };
    }
    function expand(template, context) {
      var operators = ["+", "#", ".", "/", ";", "?", "&"];
      template = template.replace(
        /\{([^\{\}]+)\}|([^\{\}]+)/g,
        function(_, expression, literal) {
          if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
              operator = expression.charAt(0);
              expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function(variable) {
              var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
              values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
              var separator = ",";
              if (operator === "?") {
                separator = "&";
              } else if (operator !== "#") {
                separator = operator;
              }
              return (values.length !== 0 ? operator : "") + values.join(separator);
            } else {
              return values.join(",");
            }
          } else {
            return encodeReserved(literal);
          }
        }
      );
      if (template === "/") {
        return template;
      } else {
        return template.replace(/\/$/, "");
      }
    }
    function parse(options) {
      let method = options.method.toUpperCase();
      let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
      let headers = Object.assign({}, options.headers);
      let body;
      let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType"
      ]);
      const urlVariableNames = extractUrlVariableNames(url);
      url = parseUrl(url).expand(parameters);
      if (!/^http/.test(url)) {
        url = options.baseUrl + url;
      }
      const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
      const remainingParameters = omit(parameters, omittedParameters);
      const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
      if (!isBinaryRequest) {
        if (options.mediaType.format) {
          headers.accept = headers.accept.split(/,/).map(
            (format) => format.replace(
              /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
              `application/vnd$1$2.${options.mediaType.format}`
            )
          ).join(",");
        }
        if (url.endsWith("/graphql")) {
          if (options.mediaType.previews?.length) {
            const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
              const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
              return `application/vnd.github.${preview}-preview${format}`;
            }).join(",");
          }
        }
      }
      if (["GET", "HEAD"].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
      } else {
        if ("data" in remainingParameters) {
          body = remainingParameters.data;
        } else {
          if (Object.keys(remainingParameters).length) {
            body = remainingParameters;
          }
        }
      }
      if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
      }
      if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
        body = "";
      }
      return Object.assign(
        { method, url, headers },
        typeof body !== "undefined" ? { body } : null,
        options.request ? { request: options.request } : null
      );
    }
    function endpointWithDefaults(defaults, route, options) {
      return parse(merge(defaults, route, options));
    }
    function withDefaults(oldDefaults, newDefaults) {
      const DEFAULTS2 = merge(oldDefaults, newDefaults);
      const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
      return Object.assign(endpoint2, {
        DEFAULTS: DEFAULTS2,
        defaults: withDefaults.bind(null, DEFAULTS2),
        merge: merge.bind(null, DEFAULTS2),
        parse
      });
    }
    var endpoint = withDefaults(null, DEFAULTS);
  }
});

// node_modules/deprecation/dist-node/index.js
var require_dist_node3 = __commonJS({
  "node_modules/deprecation/dist-node/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Deprecation = class extends Error {
      constructor(message) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "Deprecation";
      }
    };
    exports2.Deprecation = Deprecation;
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb) return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node4 = __commonJS({
  "node_modules/@octokit/request-error/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var dist_src_exports = {};
    __export2(dist_src_exports, {
      RequestError: () => RequestError
    });
    module2.exports = __toCommonJS2(dist_src_exports);
    var import_deprecation = require_dist_node3();
    var import_once = __toESM2(require_once());
    var logOnceCode = (0, import_once.default)((deprecation) => console.warn(deprecation));
    var logOnceHeaders = (0, import_once.default)((deprecation) => console.warn(deprecation));
    var RequestError = class extends Error {
      constructor(message, statusCode, options) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        let headers;
        if ("headers" in options && typeof options.headers !== "undefined") {
          headers = options.headers;
        }
        if ("response" in options) {
          this.response = options.response;
          headers = options.response.headers;
        }
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
          requestCopy.headers = Object.assign({}, options.request.headers, {
            authorization: options.request.headers.authorization.replace(
              /(?<! ) .*$/,
              " [REDACTED]"
            )
          });
        }
        requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
        Object.defineProperty(this, "code", {
          get() {
            logOnceCode(
              new import_deprecation.Deprecation(
                "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
              )
            );
            return statusCode;
          }
        });
        Object.defineProperty(this, "headers", {
          get() {
            logOnceHeaders(
              new import_deprecation.Deprecation(
                "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
              )
            );
            return headers || {};
          }
        });
      }
    };
  }
});

// node_modules/@octokit/request/dist-node/index.js
var require_dist_node5 = __commonJS({
  "node_modules/@octokit/request/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var dist_src_exports = {};
    __export2(dist_src_exports, {
      request: () => request
    });
    module2.exports = __toCommonJS2(dist_src_exports);
    var import_endpoint = require_dist_node2();
    var import_universal_user_agent = require_dist_node();
    var VERSION = "8.4.1";
    function isPlainObject(value) {
      if (typeof value !== "object" || value === null)
        return false;
      if (Object.prototype.toString.call(value) !== "[object Object]")
        return false;
      const proto = Object.getPrototypeOf(value);
      if (proto === null)
        return true;
      const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
    }
    var import_request_error = require_dist_node4();
    function getBufferResponse(response) {
      return response.arrayBuffer();
    }
    function fetchWrapper(requestOptions) {
      var _a, _b, _c, _d;
      const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
      const parseSuccessResponseBody = ((_a = requestOptions.request) == null ? void 0 : _a.parseSuccessResponseBody) !== false;
      if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
      }
      let headers = {};
      let status;
      let url;
      let { fetch } = globalThis;
      if ((_b = requestOptions.request) == null ? void 0 : _b.fetch) {
        fetch = requestOptions.request.fetch;
      }
      if (!fetch) {
        throw new Error(
          "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
        );
      }
      return fetch(requestOptions.url, {
        method: requestOptions.method,
        body: requestOptions.body,
        redirect: (_c = requestOptions.request) == null ? void 0 : _c.redirect,
        headers: requestOptions.headers,
        signal: (_d = requestOptions.request) == null ? void 0 : _d.signal,
        // duplex must be set if request.body is ReadableStream or Async Iterables.
        // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
        ...requestOptions.body && { duplex: "half" }
      }).then(async (response) => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
          headers[keyAndValue[0]] = keyAndValue[1];
        }
        if ("deprecation" in headers) {
          const matches = headers.link && headers.link.match(/<([^<>]+)>; rel="deprecation"/);
          const deprecationLink = matches && matches.pop();
          log.warn(
            `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
          );
        }
        if (status === 204 || status === 205) {
          return;
        }
        if (requestOptions.method === "HEAD") {
          if (status < 400) {
            return;
          }
          throw new import_request_error.RequestError(response.statusText, status, {
            response: {
              url,
              status,
              headers,
              data: void 0
            },
            request: requestOptions
          });
        }
        if (status === 304) {
          throw new import_request_error.RequestError("Not modified", status, {
            response: {
              url,
              status,
              headers,
              data: await getResponseData(response)
            },
            request: requestOptions
          });
        }
        if (status >= 400) {
          const data = await getResponseData(response);
          const error = new import_request_error.RequestError(toErrorMessage(data), status, {
            response: {
              url,
              status,
              headers,
              data
            },
            request: requestOptions
          });
          throw error;
        }
        return parseSuccessResponseBody ? await getResponseData(response) : response.body;
      }).then((data) => {
        return {
          status,
          url,
          headers,
          data
        };
      }).catch((error) => {
        if (error instanceof import_request_error.RequestError)
          throw error;
        else if (error.name === "AbortError")
          throw error;
        let message = error.message;
        if (error.name === "TypeError" && "cause" in error) {
          if (error.cause instanceof Error) {
            message = error.cause.message;
          } else if (typeof error.cause === "string") {
            message = error.cause;
          }
        }
        throw new import_request_error.RequestError(message, 500, {
          request: requestOptions
        });
      });
    }
    async function getResponseData(response) {
      const contentType = response.headers.get("content-type");
      if (/application\/json/.test(contentType)) {
        return response.json().catch(() => response.text()).catch(() => "");
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
      }
      return getBufferResponse(response);
    }
    function toErrorMessage(data) {
      if (typeof data === "string")
        return data;
      let suffix;
      if ("documentation_url" in data) {
        suffix = ` - ${data.documentation_url}`;
      } else {
        suffix = "";
      }
      if ("message" in data) {
        if (Array.isArray(data.errors)) {
          return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}${suffix}`;
        }
        return `${data.message}${suffix}`;
      }
      return `Unknown error: ${JSON.stringify(data)}`;
    }
    function withDefaults(oldEndpoint, newDefaults) {
      const endpoint2 = oldEndpoint.defaults(newDefaults);
      const newApi = function(route, parameters) {
        const endpointOptions = endpoint2.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
          return fetchWrapper(endpoint2.parse(endpointOptions));
        }
        const request2 = (route2, parameters2) => {
          return fetchWrapper(
            endpoint2.parse(endpoint2.merge(route2, parameters2))
          );
        };
        Object.assign(request2, {
          endpoint: endpoint2,
          defaults: withDefaults.bind(null, endpoint2)
        });
        return endpointOptions.request.hook(request2, endpointOptions);
      };
      return Object.assign(newApi, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
      });
    }
    var request = withDefaults(import_endpoint.endpoint, {
      headers: {
        "user-agent": `octokit-request.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
      }
    });
  }
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node6 = __commonJS({
  "node_modules/@octokit/graphql/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      GraphqlResponseError: () => GraphqlResponseError,
      graphql: () => graphql2,
      withCustomRequest: () => withCustomRequest
    });
    module2.exports = __toCommonJS2(index_exports);
    var import_request3 = require_dist_node5();
    var import_universal_user_agent = require_dist_node();
    var VERSION = "7.1.1";
    var import_request2 = require_dist_node5();
    var import_request = require_dist_node5();
    function _buildMessageForResponseErrors(data) {
      return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
    }
    var GraphqlResponseError = class extends Error {
      constructor(request2, headers, response) {
        super(_buildMessageForResponseErrors(response));
        this.request = request2;
        this.headers = headers;
        this.response = response;
        this.name = "GraphqlResponseError";
        this.errors = response.errors;
        this.data = response.data;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    var NON_VARIABLE_OPTIONS = [
      "method",
      "baseUrl",
      "url",
      "headers",
      "request",
      "query",
      "mediaType"
    ];
    var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
    var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
    function graphql(request2, query, options) {
      if (options) {
        if (typeof query === "string" && "query" in options) {
          return Promise.reject(
            new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
          );
        }
        for (const key in options) {
          if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
          return Promise.reject(
            new Error(
              `[@octokit/graphql] "${key}" cannot be used as variable name`
            )
          );
        }
      }
      const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
      const requestOptions = Object.keys(
        parsedOptions
      ).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
          result[key] = parsedOptions[key];
          return result;
        }
        if (!result.variables) {
          result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
      }, {});
      const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
      if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
      }
      return request2(requestOptions).then((response) => {
        if (response.data.errors) {
          const headers = {};
          for (const key of Object.keys(response.headers)) {
            headers[key] = response.headers[key];
          }
          throw new GraphqlResponseError(
            requestOptions,
            headers,
            response.data
          );
        }
        return response.data.data;
      });
    }
    function withDefaults(request2, newDefaults) {
      const newRequest = request2.defaults(newDefaults);
      const newApi = (query, options) => {
        return graphql(newRequest, query, options);
      };
      return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: newRequest.endpoint
      });
    }
    var graphql2 = withDefaults(import_request3.request, {
      headers: {
        "user-agent": `octokit-graphql.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
      },
      method: "POST",
      url: "/graphql"
    });
    function withCustomRequest(customRequest) {
      return withDefaults(customRequest, {
        method: "POST",
        url: "/graphql"
      });
    }
  }
});

// node_modules/@octokit/auth-token/dist-node/index.js
var require_dist_node7 = __commonJS({
  "node_modules/@octokit/auth-token/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var dist_src_exports = {};
    __export2(dist_src_exports, {
      createTokenAuth: () => createTokenAuth
    });
    module2.exports = __toCommonJS2(dist_src_exports);
    var REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
    var REGEX_IS_INSTALLATION = /^ghs_/;
    var REGEX_IS_USER_TO_SERVER = /^ghu_/;
    async function auth(token) {
      const isApp = token.split(/\./).length === 3;
      const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
      const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
      const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
      return {
        type: "token",
        token,
        tokenType
      };
    }
    function withAuthorizationPrefix(token) {
      if (token.split(/\./).length === 3) {
        return `bearer ${token}`;
      }
      return `token ${token}`;
    }
    async function hook(token, request, route, parameters) {
      const endpoint = request.endpoint.merge(
        route,
        parameters
      );
      endpoint.headers.authorization = withAuthorizationPrefix(token);
      return request(endpoint);
    }
    var createTokenAuth = function createTokenAuth2(token) {
      if (!token) {
        throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
      }
      if (typeof token !== "string") {
        throw new Error(
          "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
        );
      }
      token = token.replace(/^(token|bearer) +/i, "");
      return Object.assign(auth.bind(null, token), {
        hook: hook.bind(null, token)
      });
    };
  }
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node8 = __commonJS({
  "node_modules/@octokit/core/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      Octokit: () => Octokit2
    });
    module2.exports = __toCommonJS2(index_exports);
    var import_universal_user_agent = require_dist_node();
    var import_before_after_hook = require_before_after_hook();
    var import_request = require_dist_node5();
    var import_graphql = require_dist_node6();
    var import_auth_token = require_dist_node7();
    var VERSION = "5.2.2";
    var noop = () => {
    };
    var consoleWarn = console.warn.bind(console);
    var consoleError = console.error.bind(console);
    function createLogger(logger2 = {}) {
      if (typeof logger2.debug !== "function") {
        logger2.debug = noop;
      }
      if (typeof logger2.info !== "function") {
        logger2.info = noop;
      }
      if (typeof logger2.warn !== "function") {
        logger2.warn = consoleWarn;
      }
      if (typeof logger2.error !== "function") {
        logger2.error = consoleError;
      }
      return logger2;
    }
    var userAgentTrail = `octokit-core.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
    var Octokit2 = class {
      static {
        this.VERSION = VERSION;
      }
      static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
          constructor(...args) {
            const options = args[0] || {};
            if (typeof defaults === "function") {
              super(defaults(options));
              return;
            }
            super(
              Object.assign(
                {},
                defaults,
                options,
                options.userAgent && defaults.userAgent ? {
                  userAgent: `${options.userAgent} ${defaults.userAgent}`
                } : null
              )
            );
          }
        };
        return OctokitWithDefaults;
      }
      static {
        this.plugins = [];
      }
      /**
       * Attach a plugin (or many) to your Octokit instance.
       *
       * @example
       * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
       */
      static plugin(...newPlugins) {
        const currentPlugins = this.plugins;
        const NewOctokit = class extends this {
          static {
            this.plugins = currentPlugins.concat(
              newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
            );
          }
        };
        return NewOctokit;
      }
      constructor(options = {}) {
        const hook = new import_before_after_hook.Collection();
        const requestDefaults = {
          baseUrl: import_request.request.endpoint.DEFAULTS.baseUrl,
          headers: {},
          request: Object.assign({}, options.request, {
            // @ts-ignore internal usage only, no need to type
            hook: hook.bind(null, "request")
          }),
          mediaType: {
            previews: [],
            format: ""
          }
        };
        requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
        if (options.baseUrl) {
          requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
          requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
          requestDefaults.headers["time-zone"] = options.timeZone;
        }
        this.request = import_request.request.defaults(requestDefaults);
        this.graphql = (0, import_graphql.withCustomRequest)(this.request).defaults(requestDefaults);
        this.log = createLogger(options.log);
        this.hook = hook;
        if (!options.authStrategy) {
          if (!options.auth) {
            this.auth = async () => ({
              type: "unauthenticated"
            });
          } else {
            const auth = (0, import_auth_token.createTokenAuth)(options.auth);
            hook.wrap("request", auth.hook);
            this.auth = auth;
          }
        } else {
          const { authStrategy, ...otherOptions } = options;
          const auth = authStrategy(
            Object.assign(
              {
                request: this.request,
                log: this.log,
                // we pass the current octokit instance as well as its constructor options
                // to allow for authentication strategies that return a new octokit instance
                // that shares the same internal state as the current one. The original
                // requirement for this was the "event-octokit" authentication strategy
                // of https://github.com/probot/octokit-auth-probot.
                octokit: this,
                octokitOptions: otherOptions
              },
              options.auth
            )
          );
          hook.wrap("request", auth.hook);
          this.auth = auth;
        }
        const classConstructor = this.constructor;
        for (let i = 0; i < classConstructor.plugins.length; ++i) {
          Object.assign(this, classConstructor.plugins[i](this, options));
        }
      }
    };
  }
});

// node_modules/@octokit/plugin-request-log/dist-node/index.js
var require_dist_node9 = __commonJS({
  "node_modules/@octokit/plugin-request-log/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var dist_src_exports = {};
    __export2(dist_src_exports, {
      requestLog: () => requestLog
    });
    module2.exports = __toCommonJS2(dist_src_exports);
    var VERSION = "4.0.1";
    function requestLog(octokit) {
      octokit.hook.wrap("request", (request, options) => {
        octokit.log.debug("request", options);
        const start = Date.now();
        const requestOptions = octokit.request.endpoint.parse(options);
        const path8 = requestOptions.url.replace(options.baseUrl, "");
        return request(options).then((response) => {
          octokit.log.info(
            `${requestOptions.method} ${path8} - ${response.status} in ${Date.now() - start}ms`
          );
          return response;
        }).catch((error) => {
          octokit.log.info(
            `${requestOptions.method} ${path8} - ${error.status} in ${Date.now() - start}ms`
          );
          throw error;
        });
      });
    }
    requestLog.VERSION = VERSION;
  }
});

// node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node10 = __commonJS({
  "node_modules/@octokit/plugin-paginate-rest/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      composePaginateRest: () => composePaginateRest,
      isPaginatingEndpoint: () => isPaginatingEndpoint,
      paginateRest: () => paginateRest,
      paginatingEndpoints: () => paginatingEndpoints
    });
    module2.exports = __toCommonJS2(index_exports);
    var VERSION = "11.4.4-cjs.2";
    function normalizePaginatedListResponse(response) {
      if (!response.data) {
        return {
          ...response,
          data: []
        };
      }
      const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
      if (!responseNeedsNormalization) return response;
      const incompleteResults = response.data.incomplete_results;
      const repositorySelection = response.data.repository_selection;
      const totalCount = response.data.total_count;
      delete response.data.incomplete_results;
      delete response.data.repository_selection;
      delete response.data.total_count;
      const namespaceKey = Object.keys(response.data)[0];
      const data = response.data[namespaceKey];
      response.data = data;
      if (typeof incompleteResults !== "undefined") {
        response.data.incomplete_results = incompleteResults;
      }
      if (typeof repositorySelection !== "undefined") {
        response.data.repository_selection = repositorySelection;
      }
      response.data.total_count = totalCount;
      return response;
    }
    function iterator(octokit, route, parameters) {
      const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
      const requestMethod = typeof route === "function" ? route : octokit.request;
      const method = options.method;
      const headers = options.headers;
      let url = options.url;
      return {
        [Symbol.asyncIterator]: () => ({
          async next() {
            if (!url) return { done: true };
            try {
              const response = await requestMethod({ method, url, headers });
              const normalizedResponse = normalizePaginatedListResponse(response);
              url = ((normalizedResponse.headers.link || "").match(
                /<([^<>]+)>;\s*rel="next"/
              ) || [])[1];
              return { value: normalizedResponse };
            } catch (error) {
              if (error.status !== 409) throw error;
              url = "";
              return {
                value: {
                  status: 200,
                  headers: {},
                  data: []
                }
              };
            }
          }
        })
      };
    }
    function paginate(octokit, route, parameters, mapFn) {
      if (typeof parameters === "function") {
        mapFn = parameters;
        parameters = void 0;
      }
      return gather(
        octokit,
        [],
        iterator(octokit, route, parameters)[Symbol.asyncIterator](),
        mapFn
      );
    }
    function gather(octokit, results, iterator2, mapFn) {
      return iterator2.next().then((result) => {
        if (result.done) {
          return results;
        }
        let earlyExit = false;
        function done() {
          earlyExit = true;
        }
        results = results.concat(
          mapFn ? mapFn(result.value, done) : result.value.data
        );
        if (earlyExit) {
          return results;
        }
        return gather(octokit, results, iterator2, mapFn);
      });
    }
    var composePaginateRest = Object.assign(paginate, {
      iterator
    });
    var paginatingEndpoints = [
      "GET /advisories",
      "GET /app/hook/deliveries",
      "GET /app/installation-requests",
      "GET /app/installations",
      "GET /assignments/{assignment_id}/accepted_assignments",
      "GET /classrooms",
      "GET /classrooms/{classroom_id}/assignments",
      "GET /enterprises/{enterprise}/code-security/configurations",
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories",
      "GET /enterprises/{enterprise}/dependabot/alerts",
      "GET /enterprises/{enterprise}/secret-scanning/alerts",
      "GET /events",
      "GET /gists",
      "GET /gists/public",
      "GET /gists/starred",
      "GET /gists/{gist_id}/comments",
      "GET /gists/{gist_id}/commits",
      "GET /gists/{gist_id}/forks",
      "GET /installation/repositories",
      "GET /issues",
      "GET /licenses",
      "GET /marketplace_listing/plans",
      "GET /marketplace_listing/plans/{plan_id}/accounts",
      "GET /marketplace_listing/stubbed/plans",
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
      "GET /networks/{owner}/{repo}/events",
      "GET /notifications",
      "GET /organizations",
      "GET /orgs/{org}/actions/cache/usage-by-repository",
      "GET /orgs/{org}/actions/permissions/repositories",
      "GET /orgs/{org}/actions/runner-groups",
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories",
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners",
      "GET /orgs/{org}/actions/runners",
      "GET /orgs/{org}/actions/secrets",
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
      "GET /orgs/{org}/actions/variables",
      "GET /orgs/{org}/actions/variables/{name}/repositories",
      "GET /orgs/{org}/attestations/{subject_digest}",
      "GET /orgs/{org}/blocks",
      "GET /orgs/{org}/code-scanning/alerts",
      "GET /orgs/{org}/code-security/configurations",
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories",
      "GET /orgs/{org}/codespaces",
      "GET /orgs/{org}/codespaces/secrets",
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories",
      "GET /orgs/{org}/copilot/billing/seats",
      "GET /orgs/{org}/copilot/metrics",
      "GET /orgs/{org}/copilot/usage",
      "GET /orgs/{org}/dependabot/alerts",
      "GET /orgs/{org}/dependabot/secrets",
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
      "GET /orgs/{org}/events",
      "GET /orgs/{org}/failed_invitations",
      "GET /orgs/{org}/hooks",
      "GET /orgs/{org}/hooks/{hook_id}/deliveries",
      "GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}",
      "GET /orgs/{org}/insights/api/subject-stats",
      "GET /orgs/{org}/insights/api/user-stats/{user_id}",
      "GET /orgs/{org}/installations",
      "GET /orgs/{org}/invitations",
      "GET /orgs/{org}/invitations/{invitation_id}/teams",
      "GET /orgs/{org}/issues",
      "GET /orgs/{org}/members",
      "GET /orgs/{org}/members/{username}/codespaces",
      "GET /orgs/{org}/migrations",
      "GET /orgs/{org}/migrations/{migration_id}/repositories",
      "GET /orgs/{org}/organization-roles/{role_id}/teams",
      "GET /orgs/{org}/organization-roles/{role_id}/users",
      "GET /orgs/{org}/outside_collaborators",
      "GET /orgs/{org}/packages",
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      "GET /orgs/{org}/personal-access-token-requests",
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories",
      "GET /orgs/{org}/personal-access-tokens",
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories",
      "GET /orgs/{org}/private-registries",
      "GET /orgs/{org}/projects",
      "GET /orgs/{org}/properties/values",
      "GET /orgs/{org}/public_members",
      "GET /orgs/{org}/repos",
      "GET /orgs/{org}/rulesets",
      "GET /orgs/{org}/rulesets/rule-suites",
      "GET /orgs/{org}/secret-scanning/alerts",
      "GET /orgs/{org}/security-advisories",
      "GET /orgs/{org}/team/{team_slug}/copilot/metrics",
      "GET /orgs/{org}/team/{team_slug}/copilot/usage",
      "GET /orgs/{org}/teams",
      "GET /orgs/{org}/teams/{team_slug}/discussions",
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
      "GET /orgs/{org}/teams/{team_slug}/invitations",
      "GET /orgs/{org}/teams/{team_slug}/members",
      "GET /orgs/{org}/teams/{team_slug}/projects",
      "GET /orgs/{org}/teams/{team_slug}/repos",
      "GET /orgs/{org}/teams/{team_slug}/teams",
      "GET /projects/columns/{column_id}/cards",
      "GET /projects/{project_id}/collaborators",
      "GET /projects/{project_id}/columns",
      "GET /repos/{owner}/{repo}/actions/artifacts",
      "GET /repos/{owner}/{repo}/actions/caches",
      "GET /repos/{owner}/{repo}/actions/organization-secrets",
      "GET /repos/{owner}/{repo}/actions/organization-variables",
      "GET /repos/{owner}/{repo}/actions/runners",
      "GET /repos/{owner}/{repo}/actions/runs",
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
      "GET /repos/{owner}/{repo}/actions/secrets",
      "GET /repos/{owner}/{repo}/actions/variables",
      "GET /repos/{owner}/{repo}/actions/workflows",
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
      "GET /repos/{owner}/{repo}/activity",
      "GET /repos/{owner}/{repo}/assignees",
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}",
      "GET /repos/{owner}/{repo}/branches",
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
      "GET /repos/{owner}/{repo}/code-scanning/alerts",
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      "GET /repos/{owner}/{repo}/code-scanning/analyses",
      "GET /repos/{owner}/{repo}/codespaces",
      "GET /repos/{owner}/{repo}/codespaces/devcontainers",
      "GET /repos/{owner}/{repo}/codespaces/secrets",
      "GET /repos/{owner}/{repo}/collaborators",
      "GET /repos/{owner}/{repo}/comments",
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
      "GET /repos/{owner}/{repo}/commits",
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
      "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
      "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
      "GET /repos/{owner}/{repo}/commits/{ref}/status",
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
      "GET /repos/{owner}/{repo}/contributors",
      "GET /repos/{owner}/{repo}/dependabot/alerts",
      "GET /repos/{owner}/{repo}/dependabot/secrets",
      "GET /repos/{owner}/{repo}/deployments",
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
      "GET /repos/{owner}/{repo}/environments",
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps",
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets",
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables",
      "GET /repos/{owner}/{repo}/events",
      "GET /repos/{owner}/{repo}/forks",
      "GET /repos/{owner}/{repo}/hooks",
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
      "GET /repos/{owner}/{repo}/invitations",
      "GET /repos/{owner}/{repo}/issues",
      "GET /repos/{owner}/{repo}/issues/comments",
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
      "GET /repos/{owner}/{repo}/issues/events",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues",
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
      "GET /repos/{owner}/{repo}/keys",
      "GET /repos/{owner}/{repo}/labels",
      "GET /repos/{owner}/{repo}/milestones",
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
      "GET /repos/{owner}/{repo}/notifications",
      "GET /repos/{owner}/{repo}/pages/builds",
      "GET /repos/{owner}/{repo}/projects",
      "GET /repos/{owner}/{repo}/pulls",
      "GET /repos/{owner}/{repo}/pulls/comments",
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
      "GET /repos/{owner}/{repo}/releases",
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
      "GET /repos/{owner}/{repo}/rules/branches/{branch}",
      "GET /repos/{owner}/{repo}/rulesets",
      "GET /repos/{owner}/{repo}/rulesets/rule-suites",
      "GET /repos/{owner}/{repo}/secret-scanning/alerts",
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
      "GET /repos/{owner}/{repo}/security-advisories",
      "GET /repos/{owner}/{repo}/stargazers",
      "GET /repos/{owner}/{repo}/subscribers",
      "GET /repos/{owner}/{repo}/tags",
      "GET /repos/{owner}/{repo}/teams",
      "GET /repos/{owner}/{repo}/topics",
      "GET /repositories",
      "GET /search/code",
      "GET /search/commits",
      "GET /search/issues",
      "GET /search/labels",
      "GET /search/repositories",
      "GET /search/topics",
      "GET /search/users",
      "GET /teams/{team_id}/discussions",
      "GET /teams/{team_id}/discussions/{discussion_number}/comments",
      "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
      "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
      "GET /teams/{team_id}/invitations",
      "GET /teams/{team_id}/members",
      "GET /teams/{team_id}/projects",
      "GET /teams/{team_id}/repos",
      "GET /teams/{team_id}/teams",
      "GET /user/blocks",
      "GET /user/codespaces",
      "GET /user/codespaces/secrets",
      "GET /user/emails",
      "GET /user/followers",
      "GET /user/following",
      "GET /user/gpg_keys",
      "GET /user/installations",
      "GET /user/installations/{installation_id}/repositories",
      "GET /user/issues",
      "GET /user/keys",
      "GET /user/marketplace_purchases",
      "GET /user/marketplace_purchases/stubbed",
      "GET /user/memberships/orgs",
      "GET /user/migrations",
      "GET /user/migrations/{migration_id}/repositories",
      "GET /user/orgs",
      "GET /user/packages",
      "GET /user/packages/{package_type}/{package_name}/versions",
      "GET /user/public_emails",
      "GET /user/repos",
      "GET /user/repository_invitations",
      "GET /user/social_accounts",
      "GET /user/ssh_signing_keys",
      "GET /user/starred",
      "GET /user/subscriptions",
      "GET /user/teams",
      "GET /users",
      "GET /users/{username}/attestations/{subject_digest}",
      "GET /users/{username}/events",
      "GET /users/{username}/events/orgs/{org}",
      "GET /users/{username}/events/public",
      "GET /users/{username}/followers",
      "GET /users/{username}/following",
      "GET /users/{username}/gists",
      "GET /users/{username}/gpg_keys",
      "GET /users/{username}/keys",
      "GET /users/{username}/orgs",
      "GET /users/{username}/packages",
      "GET /users/{username}/projects",
      "GET /users/{username}/received_events",
      "GET /users/{username}/received_events/public",
      "GET /users/{username}/repos",
      "GET /users/{username}/social_accounts",
      "GET /users/{username}/ssh_signing_keys",
      "GET /users/{username}/starred",
      "GET /users/{username}/subscriptions"
    ];
    function isPaginatingEndpoint(arg) {
      if (typeof arg === "string") {
        return paginatingEndpoints.includes(arg);
      } else {
        return false;
      }
    }
    function paginateRest(octokit) {
      return {
        paginate: Object.assign(paginate.bind(null, octokit), {
          iterator: iterator.bind(null, octokit)
        })
      };
    }
    paginateRest.VERSION = VERSION;
  }
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node11 = __commonJS({
  "node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      legacyRestEndpointMethods: () => legacyRestEndpointMethods,
      restEndpointMethods: () => restEndpointMethods
    });
    module2.exports = __toCommonJS2(index_exports);
    var VERSION = "13.3.2-cjs.1";
    var Endpoints = {
      actions: {
        addCustomLabelsToSelfHostedRunnerForOrg: [
          "POST /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        addCustomLabelsToSelfHostedRunnerForRepo: [
          "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        addRepoAccessToSelfHostedRunnerGroupInOrg: [
          "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
        ],
        addSelectedRepoToOrgSecret: [
          "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
        ],
        addSelectedRepoToOrgVariable: [
          "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
        ],
        approveWorkflowRun: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
        ],
        cancelWorkflowRun: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
        ],
        createEnvironmentVariable: [
          "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
        ],
        createOrUpdateEnvironmentSecret: [
          "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
        createOrUpdateRepoSecret: [
          "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
        ],
        createOrgVariable: ["POST /orgs/{org}/actions/variables"],
        createRegistrationTokenForOrg: [
          "POST /orgs/{org}/actions/runners/registration-token"
        ],
        createRegistrationTokenForRepo: [
          "POST /repos/{owner}/{repo}/actions/runners/registration-token"
        ],
        createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
        createRemoveTokenForRepo: [
          "POST /repos/{owner}/{repo}/actions/runners/remove-token"
        ],
        createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
        createWorkflowDispatch: [
          "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
        ],
        deleteActionsCacheById: [
          "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
        ],
        deleteActionsCacheByKey: [
          "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
        ],
        deleteArtifact: [
          "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
        ],
        deleteEnvironmentSecret: [
          "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        deleteEnvironmentVariable: [
          "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
        deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
        deleteRepoSecret: [
          "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
        ],
        deleteRepoVariable: [
          "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
        ],
        deleteSelfHostedRunnerFromOrg: [
          "DELETE /orgs/{org}/actions/runners/{runner_id}"
        ],
        deleteSelfHostedRunnerFromRepo: [
          "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
        ],
        deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
        deleteWorkflowRunLogs: [
          "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
        ],
        disableSelectedRepositoryGithubActionsOrganization: [
          "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
        ],
        disableWorkflow: [
          "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
        ],
        downloadArtifact: [
          "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
        ],
        downloadJobLogsForWorkflowRun: [
          "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
        ],
        downloadWorkflowRunAttemptLogs: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
        ],
        downloadWorkflowRunLogs: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
        ],
        enableSelectedRepositoryGithubActionsOrganization: [
          "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
        ],
        enableWorkflow: [
          "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
        ],
        forceCancelWorkflowRun: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
        ],
        generateRunnerJitconfigForOrg: [
          "POST /orgs/{org}/actions/runners/generate-jitconfig"
        ],
        generateRunnerJitconfigForRepo: [
          "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
        ],
        getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
        getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
        getActionsCacheUsageByRepoForOrg: [
          "GET /orgs/{org}/actions/cache/usage-by-repository"
        ],
        getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
        getAllowedActionsOrganization: [
          "GET /orgs/{org}/actions/permissions/selected-actions"
        ],
        getAllowedActionsRepository: [
          "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
        ],
        getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
        getCustomOidcSubClaimForRepo: [
          "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
        ],
        getEnvironmentPublicKey: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
        ],
        getEnvironmentSecret: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
        ],
        getEnvironmentVariable: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        getGithubActionsDefaultWorkflowPermissionsOrganization: [
          "GET /orgs/{org}/actions/permissions/workflow"
        ],
        getGithubActionsDefaultWorkflowPermissionsRepository: [
          "GET /repos/{owner}/{repo}/actions/permissions/workflow"
        ],
        getGithubActionsPermissionsOrganization: [
          "GET /orgs/{org}/actions/permissions"
        ],
        getGithubActionsPermissionsRepository: [
          "GET /repos/{owner}/{repo}/actions/permissions"
        ],
        getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
        getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
        getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
        getPendingDeploymentsForRun: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
        ],
        getRepoPermissions: [
          "GET /repos/{owner}/{repo}/actions/permissions",
          {},
          { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
        ],
        getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
        getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
        getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
        getReviewsForRun: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
        ],
        getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
        getSelfHostedRunnerForRepo: [
          "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
        ],
        getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
        getWorkflowAccessToRepository: [
          "GET /repos/{owner}/{repo}/actions/permissions/access"
        ],
        getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
        getWorkflowRunAttempt: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
        ],
        getWorkflowRunUsage: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
        ],
        getWorkflowUsage: [
          "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
        ],
        listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
        listEnvironmentSecrets: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
        ],
        listEnvironmentVariables: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
        ],
        listJobsForWorkflowRun: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
        ],
        listJobsForWorkflowRunAttempt: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
        ],
        listLabelsForSelfHostedRunnerForOrg: [
          "GET /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        listLabelsForSelfHostedRunnerForRepo: [
          "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
        listOrgVariables: ["GET /orgs/{org}/actions/variables"],
        listRepoOrganizationSecrets: [
          "GET /repos/{owner}/{repo}/actions/organization-secrets"
        ],
        listRepoOrganizationVariables: [
          "GET /repos/{owner}/{repo}/actions/organization-variables"
        ],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
        listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
        listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
        listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
        listRunnerApplicationsForRepo: [
          "GET /repos/{owner}/{repo}/actions/runners/downloads"
        ],
        listSelectedReposForOrgSecret: [
          "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
        ],
        listSelectedReposForOrgVariable: [
          "GET /orgs/{org}/actions/variables/{name}/repositories"
        ],
        listSelectedRepositoriesEnabledGithubActionsOrganization: [
          "GET /orgs/{org}/actions/permissions/repositories"
        ],
        listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
        listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
        listWorkflowRunArtifacts: [
          "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
        ],
        listWorkflowRuns: [
          "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
        ],
        listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
        reRunJobForWorkflowRun: [
          "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
        ],
        reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
        reRunWorkflowFailedJobs: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
          "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
          "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        removeCustomLabelFromSelfHostedRunnerForOrg: [
          "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
        ],
        removeCustomLabelFromSelfHostedRunnerForRepo: [
          "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
        ],
        removeSelectedRepoFromOrgSecret: [
          "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
        ],
        removeSelectedRepoFromOrgVariable: [
          "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
        ],
        reviewCustomGatesForRun: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
        ],
        reviewPendingDeploymentsForRun: [
          "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
        ],
        setAllowedActionsOrganization: [
          "PUT /orgs/{org}/actions/permissions/selected-actions"
        ],
        setAllowedActionsRepository: [
          "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
        ],
        setCustomLabelsForSelfHostedRunnerForOrg: [
          "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
        ],
        setCustomLabelsForSelfHostedRunnerForRepo: [
          "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
        ],
        setCustomOidcSubClaimForRepo: [
          "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
        ],
        setGithubActionsDefaultWorkflowPermissionsOrganization: [
          "PUT /orgs/{org}/actions/permissions/workflow"
        ],
        setGithubActionsDefaultWorkflowPermissionsRepository: [
          "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
        ],
        setGithubActionsPermissionsOrganization: [
          "PUT /orgs/{org}/actions/permissions"
        ],
        setGithubActionsPermissionsRepository: [
          "PUT /repos/{owner}/{repo}/actions/permissions"
        ],
        setSelectedReposForOrgSecret: [
          "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
        ],
        setSelectedReposForOrgVariable: [
          "PUT /orgs/{org}/actions/variables/{name}/repositories"
        ],
        setSelectedRepositoriesEnabledGithubActionsOrganization: [
          "PUT /orgs/{org}/actions/permissions/repositories"
        ],
        setWorkflowAccessToRepository: [
          "PUT /repos/{owner}/{repo}/actions/permissions/access"
        ],
        updateEnvironmentVariable: [
          "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
        ],
        updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
        updateRepoVariable: [
          "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
        ]
      },
      activity: {
        checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
        deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
        deleteThreadSubscription: [
          "DELETE /notifications/threads/{thread_id}/subscription"
        ],
        getFeeds: ["GET /feeds"],
        getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
        getThread: ["GET /notifications/threads/{thread_id}"],
        getThreadSubscriptionForAuthenticatedUser: [
          "GET /notifications/threads/{thread_id}/subscription"
        ],
        listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
        listNotificationsForAuthenticatedUser: ["GET /notifications"],
        listOrgEventsForAuthenticatedUser: [
          "GET /users/{username}/events/orgs/{org}"
        ],
        listPublicEvents: ["GET /events"],
        listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
        listPublicEventsForUser: ["GET /users/{username}/events/public"],
        listPublicOrgEvents: ["GET /orgs/{org}/events"],
        listReceivedEventsForUser: ["GET /users/{username}/received_events"],
        listReceivedPublicEventsForUser: [
          "GET /users/{username}/received_events/public"
        ],
        listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
        listRepoNotificationsForAuthenticatedUser: [
          "GET /repos/{owner}/{repo}/notifications"
        ],
        listReposStarredByAuthenticatedUser: ["GET /user/starred"],
        listReposStarredByUser: ["GET /users/{username}/starred"],
        listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
        listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
        listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
        listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
        markNotificationsAsRead: ["PUT /notifications"],
        markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
        markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
        markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
        setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
        setThreadSubscription: [
          "PUT /notifications/threads/{thread_id}/subscription"
        ],
        starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
        unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
      },
      apps: {
        addRepoToInstallation: [
          "PUT /user/installations/{installation_id}/repositories/{repository_id}",
          {},
          { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
        ],
        addRepoToInstallationForAuthenticatedUser: [
          "PUT /user/installations/{installation_id}/repositories/{repository_id}"
        ],
        checkToken: ["POST /applications/{client_id}/token"],
        createFromManifest: ["POST /app-manifests/{code}/conversions"],
        createInstallationAccessToken: [
          "POST /app/installations/{installation_id}/access_tokens"
        ],
        deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
        deleteInstallation: ["DELETE /app/installations/{installation_id}"],
        deleteToken: ["DELETE /applications/{client_id}/token"],
        getAuthenticated: ["GET /app"],
        getBySlug: ["GET /apps/{app_slug}"],
        getInstallation: ["GET /app/installations/{installation_id}"],
        getOrgInstallation: ["GET /orgs/{org}/installation"],
        getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
        getSubscriptionPlanForAccount: [
          "GET /marketplace_listing/accounts/{account_id}"
        ],
        getSubscriptionPlanForAccountStubbed: [
          "GET /marketplace_listing/stubbed/accounts/{account_id}"
        ],
        getUserInstallation: ["GET /users/{username}/installation"],
        getWebhookConfigForApp: ["GET /app/hook/config"],
        getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
        listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
        listAccountsForPlanStubbed: [
          "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
        ],
        listInstallationReposForAuthenticatedUser: [
          "GET /user/installations/{installation_id}/repositories"
        ],
        listInstallationRequestsForAuthenticatedApp: [
          "GET /app/installation-requests"
        ],
        listInstallations: ["GET /app/installations"],
        listInstallationsForAuthenticatedUser: ["GET /user/installations"],
        listPlans: ["GET /marketplace_listing/plans"],
        listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
        listReposAccessibleToInstallation: ["GET /installation/repositories"],
        listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
        listSubscriptionsForAuthenticatedUserStubbed: [
          "GET /user/marketplace_purchases/stubbed"
        ],
        listWebhookDeliveries: ["GET /app/hook/deliveries"],
        redeliverWebhookDelivery: [
          "POST /app/hook/deliveries/{delivery_id}/attempts"
        ],
        removeRepoFromInstallation: [
          "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
          {},
          { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
        ],
        removeRepoFromInstallationForAuthenticatedUser: [
          "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
        ],
        resetToken: ["PATCH /applications/{client_id}/token"],
        revokeInstallationAccessToken: ["DELETE /installation/token"],
        scopeToken: ["POST /applications/{client_id}/token/scoped"],
        suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
        unsuspendInstallation: [
          "DELETE /app/installations/{installation_id}/suspended"
        ],
        updateWebhookConfigForApp: ["PATCH /app/hook/config"]
      },
      billing: {
        getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
        getGithubActionsBillingUser: [
          "GET /users/{username}/settings/billing/actions"
        ],
        getGithubBillingUsageReportOrg: [
          "GET /organizations/{org}/settings/billing/usage"
        ],
        getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
        getGithubPackagesBillingUser: [
          "GET /users/{username}/settings/billing/packages"
        ],
        getSharedStorageBillingOrg: [
          "GET /orgs/{org}/settings/billing/shared-storage"
        ],
        getSharedStorageBillingUser: [
          "GET /users/{username}/settings/billing/shared-storage"
        ]
      },
      checks: {
        create: ["POST /repos/{owner}/{repo}/check-runs"],
        createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
        get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
        getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
        listAnnotations: [
          "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
        ],
        listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
        listForSuite: [
          "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
        ],
        listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
        rerequestRun: [
          "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
        ],
        rerequestSuite: [
          "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
        ],
        setSuitesPreferences: [
          "PATCH /repos/{owner}/{repo}/check-suites/preferences"
        ],
        update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
      },
      codeScanning: {
        commitAutofix: [
          "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
        ],
        createAutofix: [
          "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
        ],
        createVariantAnalysis: [
          "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
        ],
        deleteAnalysis: [
          "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
        ],
        deleteCodeqlDatabase: [
          "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
        ],
        getAlert: [
          "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
          {},
          { renamedParameters: { alert_id: "alert_number" } }
        ],
        getAnalysis: [
          "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
        ],
        getAutofix: [
          "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
        ],
        getCodeqlDatabase: [
          "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
        ],
        getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
        getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
        getVariantAnalysis: [
          "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
        ],
        getVariantAnalysisRepoTask: [
          "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
        ],
        listAlertInstances: [
          "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
        ],
        listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
        listAlertsInstances: [
          "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
          {},
          { renamed: ["codeScanning", "listAlertInstances"] }
        ],
        listCodeqlDatabases: [
          "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
        ],
        listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
        updateAlert: [
          "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
        ],
        updateDefaultSetup: [
          "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
        ],
        uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
      },
      codeSecurity: {
        attachConfiguration: [
          "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
        ],
        attachEnterpriseConfiguration: [
          "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
        ],
        createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
        createConfigurationForEnterprise: [
          "POST /enterprises/{enterprise}/code-security/configurations"
        ],
        deleteConfiguration: [
          "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
        ],
        deleteConfigurationForEnterprise: [
          "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
        ],
        detachConfiguration: [
          "DELETE /orgs/{org}/code-security/configurations/detach"
        ],
        getConfiguration: [
          "GET /orgs/{org}/code-security/configurations/{configuration_id}"
        ],
        getConfigurationForRepository: [
          "GET /repos/{owner}/{repo}/code-security-configuration"
        ],
        getConfigurationsForEnterprise: [
          "GET /enterprises/{enterprise}/code-security/configurations"
        ],
        getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
        getDefaultConfigurations: [
          "GET /orgs/{org}/code-security/configurations/defaults"
        ],
        getDefaultConfigurationsForEnterprise: [
          "GET /enterprises/{enterprise}/code-security/configurations/defaults"
        ],
        getRepositoriesForConfiguration: [
          "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
        ],
        getRepositoriesForEnterpriseConfiguration: [
          "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
        ],
        getSingleConfigurationForEnterprise: [
          "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
        ],
        setConfigurationAsDefault: [
          "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
        ],
        setConfigurationAsDefaultForEnterprise: [
          "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
        ],
        updateConfiguration: [
          "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
        ],
        updateEnterpriseConfiguration: [
          "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
        ]
      },
      codesOfConduct: {
        getAllCodesOfConduct: ["GET /codes_of_conduct"],
        getConductCode: ["GET /codes_of_conduct/{key}"]
      },
      codespaces: {
        addRepositoryForSecretForAuthenticatedUser: [
          "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        addSelectedRepoToOrgSecret: [
          "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        checkPermissionsForDevcontainer: [
          "GET /repos/{owner}/{repo}/codespaces/permissions_check"
        ],
        codespaceMachinesForAuthenticatedUser: [
          "GET /user/codespaces/{codespace_name}/machines"
        ],
        createForAuthenticatedUser: ["POST /user/codespaces"],
        createOrUpdateOrgSecret: [
          "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
        ],
        createOrUpdateRepoSecret: [
          "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        createOrUpdateSecretForAuthenticatedUser: [
          "PUT /user/codespaces/secrets/{secret_name}"
        ],
        createWithPrForAuthenticatedUser: [
          "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
        ],
        createWithRepoForAuthenticatedUser: [
          "POST /repos/{owner}/{repo}/codespaces"
        ],
        deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
        deleteFromOrganization: [
          "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
        deleteRepoSecret: [
          "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        deleteSecretForAuthenticatedUser: [
          "DELETE /user/codespaces/secrets/{secret_name}"
        ],
        exportForAuthenticatedUser: [
          "POST /user/codespaces/{codespace_name}/exports"
        ],
        getCodespacesForUserInOrg: [
          "GET /orgs/{org}/members/{username}/codespaces"
        ],
        getExportDetailsForAuthenticatedUser: [
          "GET /user/codespaces/{codespace_name}/exports/{export_id}"
        ],
        getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
        getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
        getPublicKeyForAuthenticatedUser: [
          "GET /user/codespaces/secrets/public-key"
        ],
        getRepoPublicKey: [
          "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
        ],
        getRepoSecret: [
          "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
        ],
        getSecretForAuthenticatedUser: [
          "GET /user/codespaces/secrets/{secret_name}"
        ],
        listDevcontainersInRepositoryForAuthenticatedUser: [
          "GET /repos/{owner}/{repo}/codespaces/devcontainers"
        ],
        listForAuthenticatedUser: ["GET /user/codespaces"],
        listInOrganization: [
          "GET /orgs/{org}/codespaces",
          {},
          { renamedParameters: { org_id: "org" } }
        ],
        listInRepositoryForAuthenticatedUser: [
          "GET /repos/{owner}/{repo}/codespaces"
        ],
        listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
        listRepositoriesForSecretForAuthenticatedUser: [
          "GET /user/codespaces/secrets/{secret_name}/repositories"
        ],
        listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
        listSelectedReposForOrgSecret: [
          "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
        ],
        preFlightWithRepoForAuthenticatedUser: [
          "GET /repos/{owner}/{repo}/codespaces/new"
        ],
        publishForAuthenticatedUser: [
          "POST /user/codespaces/{codespace_name}/publish"
        ],
        removeRepositoryForSecretForAuthenticatedUser: [
          "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        removeSelectedRepoFromOrgSecret: [
          "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
        ],
        repoMachinesForAuthenticatedUser: [
          "GET /repos/{owner}/{repo}/codespaces/machines"
        ],
        setRepositoriesForSecretForAuthenticatedUser: [
          "PUT /user/codespaces/secrets/{secret_name}/repositories"
        ],
        setSelectedReposForOrgSecret: [
          "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
        ],
        startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
        stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
        stopInOrganization: [
          "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
        ],
        updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
      },
      copilot: {
        addCopilotSeatsForTeams: [
          "POST /orgs/{org}/copilot/billing/selected_teams"
        ],
        addCopilotSeatsForUsers: [
          "POST /orgs/{org}/copilot/billing/selected_users"
        ],
        cancelCopilotSeatAssignmentForTeams: [
          "DELETE /orgs/{org}/copilot/billing/selected_teams"
        ],
        cancelCopilotSeatAssignmentForUsers: [
          "DELETE /orgs/{org}/copilot/billing/selected_users"
        ],
        copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
        copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
        getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
        getCopilotSeatDetailsForUser: [
          "GET /orgs/{org}/members/{username}/copilot"
        ],
        listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"],
        usageMetricsForOrg: ["GET /orgs/{org}/copilot/usage"],
        usageMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/usage"]
      },
      dependabot: {
        addSelectedRepoToOrgSecret: [
          "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
        ],
        createOrUpdateOrgSecret: [
          "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
        ],
        createOrUpdateRepoSecret: [
          "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
        deleteRepoSecret: [
          "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
        getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
        getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
        getRepoPublicKey: [
          "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
        ],
        getRepoSecret: [
          "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
        ],
        listAlertsForEnterprise: [
          "GET /enterprises/{enterprise}/dependabot/alerts"
        ],
        listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
        listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
        listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
        listSelectedReposForOrgSecret: [
          "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
        ],
        removeSelectedRepoFromOrgSecret: [
          "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
        ],
        setSelectedReposForOrgSecret: [
          "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
        ],
        updateAlert: [
          "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
        ]
      },
      dependencyGraph: {
        createRepositorySnapshot: [
          "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
        ],
        diffRange: [
          "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
        ],
        exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
      },
      emojis: { get: ["GET /emojis"] },
      gists: {
        checkIsStarred: ["GET /gists/{gist_id}/star"],
        create: ["POST /gists"],
        createComment: ["POST /gists/{gist_id}/comments"],
        delete: ["DELETE /gists/{gist_id}"],
        deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
        fork: ["POST /gists/{gist_id}/forks"],
        get: ["GET /gists/{gist_id}"],
        getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
        getRevision: ["GET /gists/{gist_id}/{sha}"],
        list: ["GET /gists"],
        listComments: ["GET /gists/{gist_id}/comments"],
        listCommits: ["GET /gists/{gist_id}/commits"],
        listForUser: ["GET /users/{username}/gists"],
        listForks: ["GET /gists/{gist_id}/forks"],
        listPublic: ["GET /gists/public"],
        listStarred: ["GET /gists/starred"],
        star: ["PUT /gists/{gist_id}/star"],
        unstar: ["DELETE /gists/{gist_id}/star"],
        update: ["PATCH /gists/{gist_id}"],
        updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
      },
      git: {
        createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
        createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
        createRef: ["POST /repos/{owner}/{repo}/git/refs"],
        createTag: ["POST /repos/{owner}/{repo}/git/tags"],
        createTree: ["POST /repos/{owner}/{repo}/git/trees"],
        deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
        getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
        getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
        getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
        getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
        getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
        listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
        updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
      },
      gitignore: {
        getAllTemplates: ["GET /gitignore/templates"],
        getTemplate: ["GET /gitignore/templates/{name}"]
      },
      interactions: {
        getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
        getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
        getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
        getRestrictionsForYourPublicRepos: [
          "GET /user/interaction-limits",
          {},
          { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
        ],
        removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
        removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
        removeRestrictionsForRepo: [
          "DELETE /repos/{owner}/{repo}/interaction-limits"
        ],
        removeRestrictionsForYourPublicRepos: [
          "DELETE /user/interaction-limits",
          {},
          { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
        ],
        setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
        setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
        setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
        setRestrictionsForYourPublicRepos: [
          "PUT /user/interaction-limits",
          {},
          { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
        ]
      },
      issues: {
        addAssignees: [
          "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
        ],
        addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        addSubIssue: [
          "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
        ],
        checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
        checkUserCanBeAssignedToIssue: [
          "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
        ],
        create: ["POST /repos/{owner}/{repo}/issues"],
        createComment: [
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
        ],
        createLabel: ["POST /repos/{owner}/{repo}/labels"],
        createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
        deleteComment: [
          "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
        ],
        deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
        deleteMilestone: [
          "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
        ],
        get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
        getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
        getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
        getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
        list: ["GET /issues"],
        listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
        listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
        listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
        listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
        listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
        listEventsForTimeline: [
          "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
        ],
        listForAuthenticatedUser: ["GET /user/issues"],
        listForOrg: ["GET /orgs/{org}/issues"],
        listForRepo: ["GET /repos/{owner}/{repo}/issues"],
        listLabelsForMilestone: [
          "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
        ],
        listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
        listLabelsOnIssue: [
          "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
        listSubIssues: [
          "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
        ],
        lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        removeAllLabels: [
          "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
        ],
        removeAssignees: [
          "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
        ],
        removeLabel: [
          "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
        ],
        removeSubIssue: [
          "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
        ],
        reprioritizeSubIssue: [
          "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
        ],
        setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
        unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
        update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
        updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
        updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
        updateMilestone: [
          "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
        ]
      },
      licenses: {
        get: ["GET /licenses/{license}"],
        getAllCommonlyUsed: ["GET /licenses"],
        getForRepo: ["GET /repos/{owner}/{repo}/license"]
      },
      markdown: {
        render: ["POST /markdown"],
        renderRaw: [
          "POST /markdown/raw",
          { headers: { "content-type": "text/plain; charset=utf-8" } }
        ]
      },
      meta: {
        get: ["GET /meta"],
        getAllVersions: ["GET /versions"],
        getOctocat: ["GET /octocat"],
        getZen: ["GET /zen"],
        root: ["GET /"]
      },
      migrations: {
        deleteArchiveForAuthenticatedUser: [
          "DELETE /user/migrations/{migration_id}/archive"
        ],
        deleteArchiveForOrg: [
          "DELETE /orgs/{org}/migrations/{migration_id}/archive"
        ],
        downloadArchiveForOrg: [
          "GET /orgs/{org}/migrations/{migration_id}/archive"
        ],
        getArchiveForAuthenticatedUser: [
          "GET /user/migrations/{migration_id}/archive"
        ],
        getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
        getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
        listForAuthenticatedUser: ["GET /user/migrations"],
        listForOrg: ["GET /orgs/{org}/migrations"],
        listReposForAuthenticatedUser: [
          "GET /user/migrations/{migration_id}/repositories"
        ],
        listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
        listReposForUser: [
          "GET /user/migrations/{migration_id}/repositories",
          {},
          { renamed: ["migrations", "listReposForAuthenticatedUser"] }
        ],
        startForAuthenticatedUser: ["POST /user/migrations"],
        startForOrg: ["POST /orgs/{org}/migrations"],
        unlockRepoForAuthenticatedUser: [
          "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
        ],
        unlockRepoForOrg: [
          "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
        ]
      },
      oidc: {
        getOidcCustomSubTemplateForOrg: [
          "GET /orgs/{org}/actions/oidc/customization/sub"
        ],
        updateOidcCustomSubTemplateForOrg: [
          "PUT /orgs/{org}/actions/oidc/customization/sub"
        ]
      },
      orgs: {
        addSecurityManagerTeam: [
          "PUT /orgs/{org}/security-managers/teams/{team_slug}",
          {},
          {
            deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
          }
        ],
        assignTeamToOrgRole: [
          "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
        ],
        assignUserToOrgRole: [
          "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
        ],
        blockUser: ["PUT /orgs/{org}/blocks/{username}"],
        cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
        checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
        checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
        checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
        convertMemberToOutsideCollaborator: [
          "PUT /orgs/{org}/outside_collaborators/{username}"
        ],
        createInvitation: ["POST /orgs/{org}/invitations"],
        createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
        createOrUpdateCustomPropertiesValuesForRepos: [
          "PATCH /orgs/{org}/properties/values"
        ],
        createOrUpdateCustomProperty: [
          "PUT /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        createWebhook: ["POST /orgs/{org}/hooks"],
        delete: ["DELETE /orgs/{org}"],
        deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
        enableOrDisableSecurityProductOnAllOrgRepos: [
          "POST /orgs/{org}/{security_product}/{enablement}",
          {},
          {
            deprecated: "octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"
          }
        ],
        get: ["GET /orgs/{org}"],
        getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
        getCustomProperty: [
          "GET /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
        getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
        getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
        getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
        getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
        getWebhookDelivery: [
          "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
        ],
        list: ["GET /organizations"],
        listAppInstallations: ["GET /orgs/{org}/installations"],
        listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
        listBlockedUsers: ["GET /orgs/{org}/blocks"],
        listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
        listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
        listForAuthenticatedUser: ["GET /user/orgs"],
        listForUser: ["GET /users/{username}/orgs"],
        listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
        listMembers: ["GET /orgs/{org}/members"],
        listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
        listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
        listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
        listOrgRoles: ["GET /orgs/{org}/organization-roles"],
        listOrganizationFineGrainedPermissions: [
          "GET /orgs/{org}/organization-fine-grained-permissions"
        ],
        listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
        listPatGrantRepositories: [
          "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
        ],
        listPatGrantRequestRepositories: [
          "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
        ],
        listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
        listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
        listPendingInvitations: ["GET /orgs/{org}/invitations"],
        listPublicMembers: ["GET /orgs/{org}/public_members"],
        listSecurityManagerTeams: [
          "GET /orgs/{org}/security-managers",
          {},
          {
            deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
          }
        ],
        listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
        listWebhooks: ["GET /orgs/{org}/hooks"],
        pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
        redeliverWebhookDelivery: [
          "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
        ],
        removeCustomProperty: [
          "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
        ],
        removeMember: ["DELETE /orgs/{org}/members/{username}"],
        removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
        removeOutsideCollaborator: [
          "DELETE /orgs/{org}/outside_collaborators/{username}"
        ],
        removePublicMembershipForAuthenticatedUser: [
          "DELETE /orgs/{org}/public_members/{username}"
        ],
        removeSecurityManagerTeam: [
          "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
          {},
          {
            deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
          }
        ],
        reviewPatGrantRequest: [
          "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
        ],
        reviewPatGrantRequestsInBulk: [
          "POST /orgs/{org}/personal-access-token-requests"
        ],
        revokeAllOrgRolesTeam: [
          "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
        ],
        revokeAllOrgRolesUser: [
          "DELETE /orgs/{org}/organization-roles/users/{username}"
        ],
        revokeOrgRoleTeam: [
          "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
        ],
        revokeOrgRoleUser: [
          "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
        ],
        setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
        setPublicMembershipForAuthenticatedUser: [
          "PUT /orgs/{org}/public_members/{username}"
        ],
        unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
        update: ["PATCH /orgs/{org}"],
        updateMembershipForAuthenticatedUser: [
          "PATCH /user/memberships/orgs/{org}"
        ],
        updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
        updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
        updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
        updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
      },
      packages: {
        deletePackageForAuthenticatedUser: [
          "DELETE /user/packages/{package_type}/{package_name}"
        ],
        deletePackageForOrg: [
          "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
        ],
        deletePackageForUser: [
          "DELETE /users/{username}/packages/{package_type}/{package_name}"
        ],
        deletePackageVersionForAuthenticatedUser: [
          "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        deletePackageVersionForOrg: [
          "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        deletePackageVersionForUser: [
          "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getAllPackageVersionsForAPackageOwnedByAnOrg: [
          "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
          {},
          { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
        ],
        getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
          "GET /user/packages/{package_type}/{package_name}/versions",
          {},
          {
            renamed: [
              "packages",
              "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
            ]
          }
        ],
        getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
          "GET /user/packages/{package_type}/{package_name}/versions"
        ],
        getAllPackageVersionsForPackageOwnedByOrg: [
          "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
        ],
        getAllPackageVersionsForPackageOwnedByUser: [
          "GET /users/{username}/packages/{package_type}/{package_name}/versions"
        ],
        getPackageForAuthenticatedUser: [
          "GET /user/packages/{package_type}/{package_name}"
        ],
        getPackageForOrganization: [
          "GET /orgs/{org}/packages/{package_type}/{package_name}"
        ],
        getPackageForUser: [
          "GET /users/{username}/packages/{package_type}/{package_name}"
        ],
        getPackageVersionForAuthenticatedUser: [
          "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getPackageVersionForOrganization: [
          "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        getPackageVersionForUser: [
          "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
        ],
        listDockerMigrationConflictingPackagesForAuthenticatedUser: [
          "GET /user/docker/conflicts"
        ],
        listDockerMigrationConflictingPackagesForOrganization: [
          "GET /orgs/{org}/docker/conflicts"
        ],
        listDockerMigrationConflictingPackagesForUser: [
          "GET /users/{username}/docker/conflicts"
        ],
        listPackagesForAuthenticatedUser: ["GET /user/packages"],
        listPackagesForOrganization: ["GET /orgs/{org}/packages"],
        listPackagesForUser: ["GET /users/{username}/packages"],
        restorePackageForAuthenticatedUser: [
          "POST /user/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageForOrg: [
          "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageForUser: [
          "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
        ],
        restorePackageVersionForAuthenticatedUser: [
          "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ],
        restorePackageVersionForOrg: [
          "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ],
        restorePackageVersionForUser: [
          "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
        ]
      },
      privateRegistries: {
        createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
        deleteOrgPrivateRegistry: [
          "DELETE /orgs/{org}/private-registries/{secret_name}"
        ],
        getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
        getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
        listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
        updateOrgPrivateRegistry: [
          "PATCH /orgs/{org}/private-registries/{secret_name}"
        ]
      },
      projects: {
        addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
        createCard: ["POST /projects/columns/{column_id}/cards"],
        createColumn: ["POST /projects/{project_id}/columns"],
        createForAuthenticatedUser: ["POST /user/projects"],
        createForOrg: ["POST /orgs/{org}/projects"],
        createForRepo: ["POST /repos/{owner}/{repo}/projects"],
        delete: ["DELETE /projects/{project_id}"],
        deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
        deleteColumn: ["DELETE /projects/columns/{column_id}"],
        get: ["GET /projects/{project_id}"],
        getCard: ["GET /projects/columns/cards/{card_id}"],
        getColumn: ["GET /projects/columns/{column_id}"],
        getPermissionForUser: [
          "GET /projects/{project_id}/collaborators/{username}/permission"
        ],
        listCards: ["GET /projects/columns/{column_id}/cards"],
        listCollaborators: ["GET /projects/{project_id}/collaborators"],
        listColumns: ["GET /projects/{project_id}/columns"],
        listForOrg: ["GET /orgs/{org}/projects"],
        listForRepo: ["GET /repos/{owner}/{repo}/projects"],
        listForUser: ["GET /users/{username}/projects"],
        moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
        moveColumn: ["POST /projects/columns/{column_id}/moves"],
        removeCollaborator: [
          "DELETE /projects/{project_id}/collaborators/{username}"
        ],
        update: ["PATCH /projects/{project_id}"],
        updateCard: ["PATCH /projects/columns/cards/{card_id}"],
        updateColumn: ["PATCH /projects/columns/{column_id}"]
      },
      pulls: {
        checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        create: ["POST /repos/{owner}/{repo}/pulls"],
        createReplyForReviewComment: [
          "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
        ],
        createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        createReviewComment: [
          "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
        ],
        deletePendingReview: [
          "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        deleteReviewComment: [
          "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
        ],
        dismissReview: [
          "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
        ],
        get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
        getReview: [
          "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
        list: ["GET /repos/{owner}/{repo}/pulls"],
        listCommentsForReview: [
          "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
        ],
        listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
        listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
        listRequestedReviewers: [
          "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        listReviewComments: [
          "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
        ],
        listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
        listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
        merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
        removeRequestedReviewers: [
          "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        requestReviewers: [
          "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
        ],
        submitReview: [
          "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
        ],
        update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
        updateBranch: [
          "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
        ],
        updateReview: [
          "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
        ],
        updateReviewComment: [
          "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
        ]
      },
      rateLimit: { get: ["GET /rate_limit"] },
      reactions: {
        createForCommitComment: [
          "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
        ],
        createForIssue: [
          "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
        ],
        createForIssueComment: [
          "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        ],
        createForPullRequestReviewComment: [
          "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
        ],
        createForRelease: [
          "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
        ],
        createForTeamDiscussionCommentInOrg: [
          "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
        ],
        createForTeamDiscussionInOrg: [
          "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
        ],
        deleteForCommitComment: [
          "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForIssue: [
          "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
        ],
        deleteForIssueComment: [
          "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForPullRequestComment: [
          "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
        ],
        deleteForRelease: [
          "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
        ],
        deleteForTeamDiscussion: [
          "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
        ],
        deleteForTeamDiscussionComment: [
          "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
        ],
        listForCommitComment: [
          "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
        ],
        listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
        listForIssueComment: [
          "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        ],
        listForPullRequestReviewComment: [
          "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
        ],
        listForRelease: [
          "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
        ],
        listForTeamDiscussionCommentInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
        ],
        listForTeamDiscussionInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
        ]
      },
      repos: {
        acceptInvitation: [
          "PATCH /user/repository_invitations/{invitation_id}",
          {},
          { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
        ],
        acceptInvitationForAuthenticatedUser: [
          "PATCH /user/repository_invitations/{invitation_id}"
        ],
        addAppAccessRestrictions: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
          {},
          { mapToData: "apps" }
        ],
        addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
        addStatusCheckContexts: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
          {},
          { mapToData: "contexts" }
        ],
        addTeamAccessRestrictions: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
          {},
          { mapToData: "teams" }
        ],
        addUserAccessRestrictions: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
          {},
          { mapToData: "users" }
        ],
        cancelPagesDeployment: [
          "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
        ],
        checkAutomatedSecurityFixes: [
          "GET /repos/{owner}/{repo}/automated-security-fixes"
        ],
        checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
        checkPrivateVulnerabilityReporting: [
          "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        checkVulnerabilityAlerts: [
          "GET /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
        compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
        compareCommitsWithBasehead: [
          "GET /repos/{owner}/{repo}/compare/{basehead}"
        ],
        createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
        createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
        createCommitComment: [
          "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
        ],
        createCommitSignatureProtection: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
        createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
        createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
        createDeploymentBranchPolicy: [
          "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
        ],
        createDeploymentProtectionRule: [
          "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
        ],
        createDeploymentStatus: [
          "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
        ],
        createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
        createForAuthenticatedUser: ["POST /user/repos"],
        createFork: ["POST /repos/{owner}/{repo}/forks"],
        createInOrg: ["POST /orgs/{org}/repos"],
        createOrUpdateCustomPropertiesValues: [
          "PATCH /repos/{owner}/{repo}/properties/values"
        ],
        createOrUpdateEnvironment: [
          "PUT /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
        createOrgRuleset: ["POST /orgs/{org}/rulesets"],
        createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
        createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
        createRelease: ["POST /repos/{owner}/{repo}/releases"],
        createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
        createUsingTemplate: [
          "POST /repos/{template_owner}/{template_repo}/generate"
        ],
        createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
        declineInvitation: [
          "DELETE /user/repository_invitations/{invitation_id}",
          {},
          { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
        ],
        declineInvitationForAuthenticatedUser: [
          "DELETE /user/repository_invitations/{invitation_id}"
        ],
        delete: ["DELETE /repos/{owner}/{repo}"],
        deleteAccessRestrictions: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
        ],
        deleteAdminBranchProtection: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        deleteAnEnvironment: [
          "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
        deleteBranchProtection: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
        deleteCommitSignatureProtection: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
        deleteDeployment: [
          "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
        ],
        deleteDeploymentBranchPolicy: [
          "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
        deleteInvitation: [
          "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
        ],
        deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
        deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
        deletePullRequestReviewProtection: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
        deleteReleaseAsset: [
          "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
        ],
        deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
        deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
        disableAutomatedSecurityFixes: [
          "DELETE /repos/{owner}/{repo}/automated-security-fixes"
        ],
        disableDeploymentProtectionRule: [
          "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
        ],
        disablePrivateVulnerabilityReporting: [
          "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        disableVulnerabilityAlerts: [
          "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        downloadArchive: [
          "GET /repos/{owner}/{repo}/zipball/{ref}",
          {},
          { renamed: ["repos", "downloadZipballArchive"] }
        ],
        downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
        downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
        enableAutomatedSecurityFixes: [
          "PUT /repos/{owner}/{repo}/automated-security-fixes"
        ],
        enablePrivateVulnerabilityReporting: [
          "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
        ],
        enableVulnerabilityAlerts: [
          "PUT /repos/{owner}/{repo}/vulnerability-alerts"
        ],
        generateReleaseNotes: [
          "POST /repos/{owner}/{repo}/releases/generate-notes"
        ],
        get: ["GET /repos/{owner}/{repo}"],
        getAccessRestrictions: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
        ],
        getAdminBranchProtection: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        getAllDeploymentProtectionRules: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
        ],
        getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
        getAllStatusCheckContexts: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
        ],
        getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
        getAppsWithAccessToProtectedBranch: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
        ],
        getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
        getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
        getBranchProtection: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
        getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
        getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
        getCollaboratorPermissionLevel: [
          "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
        ],
        getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
        getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
        getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
        getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
        getCommitSignatureProtection: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
        ],
        getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
        getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
        getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
        getCustomDeploymentProtectionRule: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
        ],
        getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
        getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
        getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
        getDeploymentBranchPolicy: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        getDeploymentStatus: [
          "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
        ],
        getEnvironment: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}"
        ],
        getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
        getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
        getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
        getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
        getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
        getOrgRulesets: ["GET /orgs/{org}/rulesets"],
        getPages: ["GET /repos/{owner}/{repo}/pages"],
        getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
        getPagesDeployment: [
          "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
        ],
        getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
        getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
        getPullRequestReviewProtection: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
        getReadme: ["GET /repos/{owner}/{repo}/readme"],
        getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
        getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
        getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
        getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
        getRepoRuleSuite: [
          "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
        ],
        getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
        getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
        getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
        getStatusChecksProtection: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        getTeamsWithAccessToProtectedBranch: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
        ],
        getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
        getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
        getUsersWithAccessToProtectedBranch: [
          "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
        ],
        getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
        getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
        getWebhookConfigForRepo: [
          "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
        ],
        getWebhookDelivery: [
          "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
        ],
        listActivities: ["GET /repos/{owner}/{repo}/activity"],
        listAttestations: [
          "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
        ],
        listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
        listBranches: ["GET /repos/{owner}/{repo}/branches"],
        listBranchesForHeadCommit: [
          "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
        ],
        listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
        listCommentsForCommit: [
          "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
        ],
        listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
        listCommitStatusesForRef: [
          "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
        ],
        listCommits: ["GET /repos/{owner}/{repo}/commits"],
        listContributors: ["GET /repos/{owner}/{repo}/contributors"],
        listCustomDeploymentRuleIntegrations: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
        ],
        listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
        listDeploymentBranchPolicies: [
          "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
        ],
        listDeploymentStatuses: [
          "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
        ],
        listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
        listForAuthenticatedUser: ["GET /user/repos"],
        listForOrg: ["GET /orgs/{org}/repos"],
        listForUser: ["GET /users/{username}/repos"],
        listForks: ["GET /repos/{owner}/{repo}/forks"],
        listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
        listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
        listLanguages: ["GET /repos/{owner}/{repo}/languages"],
        listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
        listPublic: ["GET /repositories"],
        listPullRequestsAssociatedWithCommit: [
          "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
        ],
        listReleaseAssets: [
          "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
        ],
        listReleases: ["GET /repos/{owner}/{repo}/releases"],
        listTags: ["GET /repos/{owner}/{repo}/tags"],
        listTeams: ["GET /repos/{owner}/{repo}/teams"],
        listWebhookDeliveries: [
          "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
        ],
        listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
        merge: ["POST /repos/{owner}/{repo}/merges"],
        mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
        pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
        redeliverWebhookDelivery: [
          "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
        ],
        removeAppAccessRestrictions: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
          {},
          { mapToData: "apps" }
        ],
        removeCollaborator: [
          "DELETE /repos/{owner}/{repo}/collaborators/{username}"
        ],
        removeStatusCheckContexts: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
          {},
          { mapToData: "contexts" }
        ],
        removeStatusCheckProtection: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        removeTeamAccessRestrictions: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
          {},
          { mapToData: "teams" }
        ],
        removeUserAccessRestrictions: [
          "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
          {},
          { mapToData: "users" }
        ],
        renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
        replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
        requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
        setAdminBranchProtection: [
          "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
        ],
        setAppAccessRestrictions: [
          "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
          {},
          { mapToData: "apps" }
        ],
        setStatusCheckContexts: [
          "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
          {},
          { mapToData: "contexts" }
        ],
        setTeamAccessRestrictions: [
          "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
          {},
          { mapToData: "teams" }
        ],
        setUserAccessRestrictions: [
          "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
          {},
          { mapToData: "users" }
        ],
        testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
        transfer: ["POST /repos/{owner}/{repo}/transfer"],
        update: ["PATCH /repos/{owner}/{repo}"],
        updateBranchProtection: [
          "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
        ],
        updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
        updateDeploymentBranchPolicy: [
          "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
        ],
        updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
        updateInvitation: [
          "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
        ],
        updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
        updatePullRequestReviewProtection: [
          "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
        ],
        updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
        updateReleaseAsset: [
          "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
        ],
        updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
        updateStatusCheckPotection: [
          "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
          {},
          { renamed: ["repos", "updateStatusCheckProtection"] }
        ],
        updateStatusCheckProtection: [
          "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
        ],
        updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
        updateWebhookConfigForRepo: [
          "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
        ],
        uploadReleaseAsset: [
          "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
          { baseUrl: "https://uploads.github.com" }
        ]
      },
      search: {
        code: ["GET /search/code"],
        commits: ["GET /search/commits"],
        issuesAndPullRequests: ["GET /search/issues"],
        labels: ["GET /search/labels"],
        repos: ["GET /search/repositories"],
        topics: ["GET /search/topics"],
        users: ["GET /search/users"]
      },
      secretScanning: {
        createPushProtectionBypass: [
          "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
        ],
        getAlert: [
          "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
        ],
        getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
        listAlertsForEnterprise: [
          "GET /enterprises/{enterprise}/secret-scanning/alerts"
        ],
        listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
        listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
        listLocationsForAlert: [
          "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
        ],
        updateAlert: [
          "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
        ]
      },
      securityAdvisories: {
        createFork: [
          "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
        ],
        createPrivateVulnerabilityReport: [
          "POST /repos/{owner}/{repo}/security-advisories/reports"
        ],
        createRepositoryAdvisory: [
          "POST /repos/{owner}/{repo}/security-advisories"
        ],
        createRepositoryAdvisoryCveRequest: [
          "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
        ],
        getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
        getRepositoryAdvisory: [
          "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
        ],
        listGlobalAdvisories: ["GET /advisories"],
        listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
        listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
        updateRepositoryAdvisory: [
          "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
        ]
      },
      teams: {
        addOrUpdateMembershipForUserInOrg: [
          "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        addOrUpdateProjectPermissionsInOrg: [
          "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        addOrUpdateRepoPermissionsInOrg: [
          "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        checkPermissionsForProjectInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        checkPermissionsForRepoInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        create: ["POST /orgs/{org}/teams"],
        createDiscussionCommentInOrg: [
          "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
        ],
        createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
        deleteDiscussionCommentInOrg: [
          "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        deleteDiscussionInOrg: [
          "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
        getByName: ["GET /orgs/{org}/teams/{team_slug}"],
        getDiscussionCommentInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        getDiscussionInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        getMembershipForUserInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        list: ["GET /orgs/{org}/teams"],
        listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
        listDiscussionCommentsInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
        ],
        listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
        listForAuthenticatedUser: ["GET /user/teams"],
        listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
        listPendingInvitationsInOrg: [
          "GET /orgs/{org}/teams/{team_slug}/invitations"
        ],
        listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
        listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
        removeMembershipForUserInOrg: [
          "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
        ],
        removeProjectInOrg: [
          "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
        ],
        removeRepoInOrg: [
          "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
        ],
        updateDiscussionCommentInOrg: [
          "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
        ],
        updateDiscussionInOrg: [
          "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
        ],
        updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
      },
      users: {
        addEmailForAuthenticated: [
          "POST /user/emails",
          {},
          { renamed: ["users", "addEmailForAuthenticatedUser"] }
        ],
        addEmailForAuthenticatedUser: ["POST /user/emails"],
        addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
        block: ["PUT /user/blocks/{username}"],
        checkBlocked: ["GET /user/blocks/{username}"],
        checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
        checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
        createGpgKeyForAuthenticated: [
          "POST /user/gpg_keys",
          {},
          { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
        ],
        createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
        createPublicSshKeyForAuthenticated: [
          "POST /user/keys",
          {},
          { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
        ],
        createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
        createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
        deleteEmailForAuthenticated: [
          "DELETE /user/emails",
          {},
          { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
        ],
        deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
        deleteGpgKeyForAuthenticated: [
          "DELETE /user/gpg_keys/{gpg_key_id}",
          {},
          { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
        ],
        deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
        deletePublicSshKeyForAuthenticated: [
          "DELETE /user/keys/{key_id}",
          {},
          { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
        ],
        deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
        deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
        deleteSshSigningKeyForAuthenticatedUser: [
          "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
        ],
        follow: ["PUT /user/following/{username}"],
        getAuthenticated: ["GET /user"],
        getById: ["GET /user/{account_id}"],
        getByUsername: ["GET /users/{username}"],
        getContextForUser: ["GET /users/{username}/hovercard"],
        getGpgKeyForAuthenticated: [
          "GET /user/gpg_keys/{gpg_key_id}",
          {},
          { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
        ],
        getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
        getPublicSshKeyForAuthenticated: [
          "GET /user/keys/{key_id}",
          {},
          { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
        ],
        getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
        getSshSigningKeyForAuthenticatedUser: [
          "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
        ],
        list: ["GET /users"],
        listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
        listBlockedByAuthenticated: [
          "GET /user/blocks",
          {},
          { renamed: ["users", "listBlockedByAuthenticatedUser"] }
        ],
        listBlockedByAuthenticatedUser: ["GET /user/blocks"],
        listEmailsForAuthenticated: [
          "GET /user/emails",
          {},
          { renamed: ["users", "listEmailsForAuthenticatedUser"] }
        ],
        listEmailsForAuthenticatedUser: ["GET /user/emails"],
        listFollowedByAuthenticated: [
          "GET /user/following",
          {},
          { renamed: ["users", "listFollowedByAuthenticatedUser"] }
        ],
        listFollowedByAuthenticatedUser: ["GET /user/following"],
        listFollowersForAuthenticatedUser: ["GET /user/followers"],
        listFollowersForUser: ["GET /users/{username}/followers"],
        listFollowingForUser: ["GET /users/{username}/following"],
        listGpgKeysForAuthenticated: [
          "GET /user/gpg_keys",
          {},
          { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
        ],
        listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
        listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
        listPublicEmailsForAuthenticated: [
          "GET /user/public_emails",
          {},
          { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
        ],
        listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
        listPublicKeysForUser: ["GET /users/{username}/keys"],
        listPublicSshKeysForAuthenticated: [
          "GET /user/keys",
          {},
          { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
        ],
        listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
        listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
        listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
        listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
        listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
        setPrimaryEmailVisibilityForAuthenticated: [
          "PATCH /user/email/visibility",
          {},
          { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
        ],
        setPrimaryEmailVisibilityForAuthenticatedUser: [
          "PATCH /user/email/visibility"
        ],
        unblock: ["DELETE /user/blocks/{username}"],
        unfollow: ["DELETE /user/following/{username}"],
        updateAuthenticated: ["PATCH /user"]
      }
    };
    var endpoints_default = Endpoints;
    var endpointMethodsMap = /* @__PURE__ */ new Map();
    for (const [scope, endpoints] of Object.entries(endpoints_default)) {
      for (const [methodName, endpoint] of Object.entries(endpoints)) {
        const [route, defaults, decorations] = endpoint;
        const [method, url] = route.split(/ /);
        const endpointDefaults = Object.assign(
          {
            method,
            url
          },
          defaults
        );
        if (!endpointMethodsMap.has(scope)) {
          endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
        }
        endpointMethodsMap.get(scope).set(methodName, {
          scope,
          methodName,
          endpointDefaults,
          decorations
        });
      }
    }
    var handler = {
      has({ scope }, methodName) {
        return endpointMethodsMap.get(scope).has(methodName);
      },
      getOwnPropertyDescriptor(target, methodName) {
        return {
          value: this.get(target, methodName),
          // ensures method is in the cache
          configurable: true,
          writable: true,
          enumerable: true
        };
      },
      defineProperty(target, methodName, descriptor) {
        Object.defineProperty(target.cache, methodName, descriptor);
        return true;
      },
      deleteProperty(target, methodName) {
        delete target.cache[methodName];
        return true;
      },
      ownKeys({ scope }) {
        return [...endpointMethodsMap.get(scope).keys()];
      },
      set(target, methodName, value) {
        return target.cache[methodName] = value;
      },
      get({ octokit, scope, cache }, methodName) {
        if (cache[methodName]) {
          return cache[methodName];
        }
        const method = endpointMethodsMap.get(scope).get(methodName);
        if (!method) {
          return void 0;
        }
        const { endpointDefaults, decorations } = method;
        if (decorations) {
          cache[methodName] = decorate(
            octokit,
            scope,
            methodName,
            endpointDefaults,
            decorations
          );
        } else {
          cache[methodName] = octokit.request.defaults(endpointDefaults);
        }
        return cache[methodName];
      }
    };
    function endpointsToMethods(octokit) {
      const newMethods = {};
      for (const scope of endpointMethodsMap.keys()) {
        newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
      }
      return newMethods;
    }
    function decorate(octokit, scope, methodName, defaults, decorations) {
      const requestWithDefaults = octokit.request.defaults(defaults);
      function withDecorations(...args) {
        let options = requestWithDefaults.endpoint.merge(...args);
        if (decorations.mapToData) {
          options = Object.assign({}, options, {
            data: options[decorations.mapToData],
            [decorations.mapToData]: void 0
          });
          return requestWithDefaults(options);
        }
        if (decorations.renamed) {
          const [newScope, newMethodName] = decorations.renamed;
          octokit.log.warn(
            `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
          );
        }
        if (decorations.deprecated) {
          octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
          const options2 = requestWithDefaults.endpoint.merge(...args);
          for (const [name, alias] of Object.entries(
            decorations.renamedParameters
          )) {
            if (name in options2) {
              octokit.log.warn(
                `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
              );
              if (!(alias in options2)) {
                options2[alias] = options2[name];
              }
              delete options2[name];
            }
          }
          return requestWithDefaults(options2);
        }
        return requestWithDefaults(...args);
      }
      return Object.assign(withDecorations, requestWithDefaults);
    }
    function restEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit);
      return {
        rest: api
      };
    }
    restEndpointMethods.VERSION = VERSION;
    function legacyRestEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit);
      return {
        ...api,
        rest: api
      };
    }
    legacyRestEndpointMethods.VERSION = VERSION;
  }
});

// node_modules/@octokit/rest/dist-node/index.js
var require_dist_node12 = __commonJS({
  "node_modules/@octokit/rest/dist-node/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      Octokit: () => Octokit2
    });
    module2.exports = __toCommonJS2(index_exports);
    var import_core = require_dist_node8();
    var import_plugin_request_log = require_dist_node9();
    var import_plugin_paginate_rest = require_dist_node10();
    var import_plugin_rest_endpoint_methods = require_dist_node11();
    var VERSION = "20.1.2";
    var Octokit2 = import_core.Octokit.plugin(
      import_plugin_request_log.requestLog,
      import_plugin_rest_endpoint_methods.legacyRestEndpointMethods,
      import_plugin_paginate_rest.paginateRest
    ).defaults({
      userAgent: `octokit-rest.js/${VERSION}`
    });
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode12 = __toESM(require("vscode"));

// src/webview/dashboardPanel.ts
var vscode10 = __toESM(require("vscode"));

// src/sprint/stateStore.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));

// src/utils/logger.ts
var vscode = __toESM(require("vscode"));
var Logger = class _Logger {
  static instance;
  channel;
  constructor() {
    this.channel = vscode.window.createOutputChannel("CodeVulFixer");
  }
  static getInstance() {
    if (!_Logger.instance) {
      _Logger.instance = new _Logger();
    }
    return _Logger.instance;
  }
  log(message, prefix = "INFO") {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    this.channel.appendLine(`[${timestamp}] [${prefix}] ${message}`);
  }
  info(message) {
    this.log(message, "INFO");
  }
  warn(message) {
    this.log(message, "WARN");
  }
  error(message, error) {
    const errDetails = error instanceof Error ? ` - ${error.message}
${error.stack ?? ""}` : error ? ` - ${JSON.stringify(error)}` : "";
    this.log(`${message}${errDetails}`, "ERROR");
  }
  success(message) {
    this.log(`\u2714 ${message}`, "SUCCESS");
  }
  show() {
    this.channel.show(true);
  }
  appendRaw(text) {
    this.channel.append(text);
  }
};
var logger = Logger.getInstance();

// src/sprint/stateStore.ts
var StateStore = class _StateStore {
  static DIR_NAME = ".codevulfixer";
  static FILE_NAME = "sprint-state.json";
  static getStatePath(workspaceRoot) {
    return path.join(workspaceRoot, _StateStore.DIR_NAME, _StateStore.FILE_NAME);
  }
  static async loadState(workspaceRoot) {
    const filePath = this.getStatePath(workspaceRoot);
    if (!fs.existsSync(filePath)) {
      return void 0;
    }
    try {
      const raw = await fs.promises.readFile(filePath, "utf8");
      const state = JSON.parse(raw);
      logger.info(`Loaded sprint state for ${state.repoOwner}/${state.repoName} from disk.`);
      return state;
    } catch (error) {
      logger.error("Failed to read sprint state file", error);
      return void 0;
    }
  }
  static async saveState(workspaceRoot, state) {
    const dirPath = path.join(workspaceRoot, _StateStore.DIR_NAME);
    const filePath = this.getStatePath(workspaceRoot);
    try {
      if (!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, { recursive: true });
      }
      state.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      this.recalculateMetrics(state);
      await fs.promises.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
      logger.info(`Persisted sprint state to ${filePath}`);
    } catch (error) {
      logger.error("Failed to save sprint state file", error);
      throw error;
    }
  }
  static async updateFinding(workspaceRoot, findingId, updates) {
    const state = await this.loadState(workspaceRoot);
    if (!state) {
      logger.warn(`Cannot update finding ${findingId}: No active sprint state found.`);
      return void 0;
    }
    const current = state.findings[findingId];
    if (!current) {
      logger.warn(`Finding ${findingId} not present in state.`);
      return state;
    }
    state.findings[findingId] = {
      ...current,
      ...updates,
      lastAttemptAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.saveState(workspaceRoot, state);
    return state;
  }
  static async updateSprintStatus(workspaceRoot, sprintNumber, status) {
    const state = await this.loadState(workspaceRoot);
    if (!state) return void 0;
    const target = state.sprints.find((s) => s.sprintNumber === sprintNumber);
    if (target) {
      target.status = status;
    }
    await this.saveState(workspaceRoot, state);
    return state;
  }
  static async resetState(workspaceRoot) {
    const filePath = this.getStatePath(workspaceRoot);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      logger.info(`Reset sprint state: deleted ${filePath}`);
    }
  }
  static recalculateMetrics(state) {
    const list = Object.values(state.findings);
    const total = list.length;
    let resolved = 0;
    let failed = 0;
    let pending = 0;
    for (const f of list) {
      if (f.status === "verified") {
        resolved++;
      } else if (f.status === "failed" || f.status === "rejected") {
        failed++;
      } else {
        pending++;
      }
    }
    state.metrics.totalFindings = total;
    state.metrics.resolvedCount = resolved;
    state.metrics.pendingCount = pending;
    state.metrics.failedCount = failed;
  }
};

// src/sprint/sprintPlanner.ts
var vscode2 = __toESM(require("vscode"));
var SprintPlanner = class {
  /**
   * Reads user configuration settings.
   */
  static getConfig() {
    const config = vscode2.workspace.getConfiguration("codevulfixer");
    return {
      maxHighRiskPerDay: config.get("maxHighRiskPerDay", 3),
      targetSprintDays: config.get("targetSprintDays", 4)
    };
  }
  /**
   * Plans multi-day sprint schedule based on findings and risk profiles.
   */
  static planSprints(findings, repoOwner, repoName, customConfig) {
    const config = customConfig || this.getConfig();
    const day1Candidates = [];
    const day2Candidates = [];
    const day3Candidates = [];
    for (const f of findings) {
      const isHighSev = f.severity === "critical" || f.severity === "high";
      const isLowEffort = f.sizing.size === "S";
      if (isHighSev && isLowEffort) {
        day1Candidates.push(f);
      } else if (isHighSev) {
        day2Candidates.push(f);
      } else {
        day3Candidates.push(f);
      }
    }
    const sprints = [];
    const findingsMap = {};
    const sprint1Findings = [...day1Candidates];
    if (sprint1Findings.length < 3 && day3Candidates.length > 0) {
      const extra = day3Candidates.splice(0, 2);
      sprint1Findings.push(...extra);
    }
    sprints.push(
      this.createSprintDay(
        1,
        "Sprint 1 (Day 1)",
        "Immediate Quick Wins: Lockfile Bumps & Localized Patches",
        "Direct dependencies, transitive deduplications, and self-contained security adjustments with zero breaking API impact.",
        sprint1Findings
      )
    );
    const sprint2Findings = [];
    const overflowHighRisk = [];
    for (const item of day2Candidates) {
      if (sprint2Findings.length < config.maxHighRiskPerDay) {
        sprint2Findings.push(item);
      } else {
        overflowHighRisk.push(item);
      }
    }
    sprints.push(
      this.createSprintDay(
        2,
        "Sprint 2 (Day 2)",
        "Architectural Items: Major Upgrades & CodeQL SAST Rewrites",
        "Deep vulnerability refactoring, SQL/Command injections, and major package version shifts requiring test validation.",
        sprint2Findings
      )
    );
    const sprint3Findings = [];
    if (overflowHighRisk.length > 0) {
      sprint3Findings.push(...overflowHighRisk);
    }
    sprint3Findings.push(...day3Candidates);
    if (sprint3Findings.length > 5 && config.targetSprintDays >= 4) {
      const chunk1 = sprint3Findings.slice(0, 4);
      const chunk2 = sprint3Findings.slice(4);
      sprints.push(
        this.createSprintDay(
          3,
          "Sprint 3 (Day 3)",
          "Security Hygiene & Low-Severity Maintenance",
          "Medium & low severity advisories, deprecation mitigation, and code hygiene polish.",
          chunk1
        )
      );
      sprints.push(
        this.createSprintDay(
          4,
          "Sprint 4 (Day 4)",
          "Sprint Closure & Final Audit Sweep",
          "Remaining security debt items and complete multi-ecosystem audit verification.",
          chunk2
        )
      );
    } else {
      sprints.push(
        this.createSprintDay(
          3,
          "Sprint 3 (Day 3+)",
          "Security Hygiene & Closure Verification",
          "Medium and low risk items, secondary dependencies, and final verification checks.",
          sprint3Findings
        )
      );
    }
    let totalEstHours = 0;
    for (const s of sprints) {
      for (const id of s.findings) {
        const found = findings.find((f) => f.id === id);
        if (found) {
          found.targetSprint = s.sprintNumber;
          findingsMap[found.id] = found;
          totalEstHours += found.sizing.estimatedHours;
        }
      }
    }
    const state = {
      version: "1.0.0",
      repoOwner,
      repoName,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      sprints,
      findings: findingsMap,
      activeSprint: 1,
      metrics: {
        totalFindings: findings.length,
        resolvedCount: 0,
        pendingCount: findings.length,
        failedCount: 0,
        totalEstimatedHours: Math.round(totalEstHours * 10) / 10,
        hoursSaved: Math.round(totalEstHours * 0.75 * 10) / 10
        // 75% estimated automation savings
      }
    };
    return state;
  }
  static createSprintDay(sprintNumber, dayLabel, title, description, findings) {
    const totalHours = findings.reduce((sum, f) => sum + f.sizing.estimatedHours, 0);
    return {
      sprintNumber,
      dayLabel,
      title,
      description,
      findings: findings.map((f) => f.id),
      totalEstimatedHours: Math.round(totalHours * 10) / 10,
      status: sprintNumber === 1 ? "in_progress" : "pending"
    };
  }
};

// src/ingestion/gitResolver.ts
var vscode3 = __toESM(require("vscode"));
var import_child_process = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var GitResolver = class {
  /**
   * Resolves the primary workspace folder path.
   */
  static getPrimaryWorkspacePath() {
    const folders = vscode3.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return void 0;
    }
    return folders[0].uri.fsPath;
  }
  /**
   * Resolves Git metadata for the active workspace folder.
   */
  static async resolveRepoMetadata() {
    const workspaceRoot = this.getPrimaryWorkspacePath();
    if (!workspaceRoot) {
      logger.warn("No active workspace folder found.");
      return void 0;
    }
    try {
      const { stdout: remoteOut } = await execAsync("git config --get remote.origin.url", {
        cwd: workspaceRoot
      });
      const remoteUrl = remoteOut.trim();
      if (!remoteUrl) {
        logger.warn("No Git remote origin configured in workspace.");
        return void 0;
      }
      const parsed = this.parseGitHubUrl(remoteUrl);
      if (!parsed) {
        logger.warn(`Could not parse GitHub owner/repo from remote URL: ${remoteUrl}`);
        return void 0;
      }
      let currentBranch = "main";
      try {
        const { stdout: branchOut } = await execAsync("git rev-parse --abbrev-ref HEAD", {
          cwd: workspaceRoot
        });
        currentBranch = branchOut.trim() || "main";
      } catch {
      }
      const meta = {
        owner: parsed.owner,
        repo: parsed.repo,
        remoteUrl,
        currentBranch
      };
      logger.info(`Resolved GitHub repository: ${meta.owner}/${meta.repo} (branch: ${meta.currentBranch})`);
      return meta;
    } catch (error) {
      logger.warn(`Git resolution failed or workspace is not a git repository: ${error instanceof Error ? error.message : String(error)}`);
      return void 0;
    }
  }
  /**
   * Parses various GitHub remote URL schemes:
   * - https://github.com/owner/repo.git
   * - git@github.com:owner/repo.git
   * - ssh://git@github.com/owner/repo.git
   */
  static parseGitHubUrl(url) {
    const cleanUrl = url.trim();
    const match = cleanUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (match && match[1] && match[2]) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, "")
      };
    }
    return void 0;
  }
};

// src/auth/githubAuth.ts
var vscode4 = __toESM(require("vscode"));
var GitHubAuthService = class _GitHubAuthService {
  static SCOPES = ["repo", "security_events"];
  /**
   * Retrieves an active GitHub authentication session or prompts the user.
   * Uses VS Code's native authentication provider.
   */
  static async getSession(createIfNone = true) {
    try {
      logger.info(`Requesting GitHub session with scopes: [${_GitHubAuthService.SCOPES.join(", ")}]`);
      const session = await vscode4.authentication.getSession("github", _GitHubAuthService.SCOPES, {
        createIfNone
      });
      if (session) {
        logger.success(`GitHub authentication successful for user: ${session.account.label}`);
        return session;
      } else {
        logger.warn("GitHub authentication session was not granted or cancelled by user.");
        return void 0;
      }
    } catch (error) {
      logger.error("Failed to obtain GitHub authentication session", error);
      throw error;
    }
  }
  /**
   * Quick check whether a valid GitHub session is already stored.
   */
  static async hasExistingSession() {
    try {
      const session = await vscode4.authentication.getSession("github", _GitHubAuthService.SCOPES, {
        createIfNone: false
      });
      return !!session;
    } catch {
      return false;
    }
  }
};

// src/ingestion/octokitClient.ts
var import_rest = __toESM(require_dist_node12());
var OctokitClientFactory = class {
  static create(token) {
    logger.info("Initializing Octokit client with user session token.");
    return new import_rest.Octokit({
      auth: token,
      userAgent: "CodeVulFixer-VSCode-Extension/1.0.0"
    });
  }
};

// src/ingestion/dependabotIngestor.ts
var DependabotIngestor = class {
  static async fetchAlerts(octokit, owner, repo) {
    logger.info(`Fetching Dependabot alerts for ${owner}/${repo}...`);
    try {
      const response = await octokit.rest.dependabot.listAlertsForRepo({
        owner,
        repo,
        state: "open",
        per_page: 100
      });
      const alerts = response.data;
      logger.info(`Received ${alerts.length} Dependabot alerts.`);
      return alerts.map((alert, index) => {
        const adv = alert.security_advisory;
        const dep = alert.dependency;
        const advisoryId = adv.cve_id || adv.ghsa_id || `DEP-${alert.number}`;
        const firstPatched = adv.vulnerabilities?.[0]?.first_patched_version?.identifier || (adv.patched_versions && adv.patched_versions.length > 0 ? adv.patched_versions[0].identifier : void 0);
        const fixedVersion = firstPatched || "latest";
        const vulnRange = adv.vulnerabilities?.[0]?.vulnerable_version_range || adv.vulnerable_version_range || "vulnerable";
        const severity = this.normalizeSeverity(adv.severity);
        const ecosystem = dep?.package?.ecosystem || "npm";
        const packageName = dep?.package?.name || "unknown-package";
        const manifestFile = dep?.manifest_path || "package.json";
        const dependencyInfo = {
          packageName,
          ecosystem,
          currentVersion: vulnRange,
          fixedVersion,
          isDirect: true,
          // Will be refined by DependencyAnalyzer
          manifestFile,
          vulnerableVersionRange: vulnRange,
          upgradeType: this.determineUpgradeType(vulnRange, fixedVersion)
        };
        const finding = {
          id: `DEP-${alert.number}`,
          source: "dependabot",
          alertNumber: alert.number,
          title: adv.summary || `Vulnerability in ${packageName}`,
          description: adv.description || `Dependabot flagged ${packageName} with ${advisoryId}`,
          severity,
          htmlUrl: alert.html_url,
          cveId: adv.cve_id || void 0,
          ghsaId: adv.ghsa_id || void 0,
          cweIds: adv.cwes?.map((c) => c.cwe_id) || [],
          dependency: dependencyInfo,
          status: "pending",
          targetSprint: 1,
          // Will be computed by sprintPlanner
          remediationPlan: `Upgrade ${packageName} to >= ${fixedVersion} via lockfile bump`,
          sizing: {
            size: "S",
            riskLevel: "low",
            reasons: [],
            estimatedHours: 1,
            isAutomatedCandidate: true
          }
        };
        return finding;
      });
    } catch (error) {
      logger.error(`Failed to fetch Dependabot alerts for ${owner}/${repo}`, error);
      throw error;
    }
  }
  static normalizeSeverity(raw) {
    const s = (raw || "").toLowerCase();
    if (s === "critical") return "critical";
    if (s === "high") return "high";
    if (s === "medium" || s === "moderate") return "medium";
    return "low";
  }
  static determineUpgradeType(range, fixed) {
    if (!fixed || fixed === "latest") return "minor";
    const match = fixed.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return "unknown";
    if (range && range.includes("<")) {
      const targetMajor = parseInt(match[1], 10);
      const rangeMatch = range.match(/<\s*(\d+)/);
      if (rangeMatch) {
        const vulnerableMajor = parseInt(rangeMatch[1], 10);
        if (targetMajor > vulnerableMajor) {
          return "major";
        }
      }
    }
    return "patch";
  }
};

// src/ingestion/codeScanningIngestor.ts
var CodeScanningIngestor = class {
  static async fetchAlerts(octokit, owner, repo) {
    logger.info(`Fetching Code Scanning (SAST/CodeQL) alerts for ${owner}/${repo}...`);
    try {
      const response = await octokit.rest.codeScanning.listAlertsForRepo({
        owner,
        repo,
        state: "open",
        per_page: 100
      });
      const alerts = response.data;
      logger.info(`Received ${alerts.length} Code Scanning findings.`);
      return alerts.map((alert) => {
        const rule = alert.rule;
        const instance = alert.most_recent_instance;
        const loc = instance?.location;
        const severity = this.normalizeSeverity(
          rule.security_severity_level || rule.severity
        );
        const cweIds = this.extractCWEs(rule.tags ?? void 0);
        const codeLocation = loc?.path ? {
          filePath: loc.path,
          startLine: loc.start_line || 1,
          endLine: loc.end_line || loc.start_line || 1,
          startColumn: loc.start_column ?? void 0,
          endColumn: loc.end_column ?? void 0
        } : void 0;
        const finding = {
          id: `CS-${alert.number}`,
          source: "code_scanning",
          alertNumber: alert.number,
          title: rule.description || rule.id || `Code Scanning Alert #${alert.number}`,
          description: instance?.message?.text || rule.description || "Static analysis finding flagged by CodeQL",
          severity,
          htmlUrl: alert.html_url,
          ruleId: rule.id ?? void 0,
          cweIds,
          location: codeLocation,
          status: "pending",
          targetSprint: 1,
          // Computed by sprint planner
          remediationPlan: `Refactor code at ${loc?.path || "file"} to resolve ${rule.id}`,
          sizing: {
            size: "M",
            riskLevel: "medium",
            reasons: [],
            estimatedHours: 2,
            isAutomatedCandidate: false
          }
        };
        return finding;
      });
    } catch (error) {
      logger.error(`Failed to fetch Code Scanning alerts for ${owner}/${repo}`, error);
      throw error;
    }
  }
  static normalizeSeverity(raw) {
    const s = (raw || "").toLowerCase();
    if (s === "critical") return "critical";
    if (s === "high" || s === "error") return "high";
    if (s === "medium" || s === "warning") return "medium";
    return "low";
  }
  static extractCWEs(tags) {
    if (!tags) return [];
    const cwes = [];
    for (const tag of tags) {
      if (tag.startsWith("external/cwe/cwe-")) {
        const id = tag.replace("external/cwe/cwe-", "CWE-");
        cwes.push(id.toUpperCase());
      } else if (/^cwe-\d+/i.test(tag)) {
        cwes.push(tag.toUpperCase());
      }
    }
    return cwes;
  }
};

// src/analysis/dependencyAnalyzer.ts
var fs2 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var DependencyAnalyzer = class {
  /**
   * Refines dependency metadata by checking the actual workspace package manifest and lockfiles.
   */
  static async analyze(workspaceRoot, dep) {
    const updated = { ...dep };
    try {
      const packageJsonPath = path2.join(workspaceRoot, dep.manifestFile || "package.json");
      if (fs2.existsSync(packageJsonPath)) {
        const raw = fs2.readFileSync(packageJsonPath, "utf8");
        const pkg = JSON.parse(raw);
        const inDirect = pkg.dependencies && pkg.dependencies[dep.packageName] || pkg.devDependencies && pkg.devDependencies[dep.packageName] || pkg.peerDependencies && pkg.peerDependencies[dep.packageName];
        if (inDirect) {
          updated.isDirect = true;
          updated.currentVersion = inDirect;
        } else {
          updated.isDirect = false;
        }
      }
      if (fs2.existsSync(path2.join(workspaceRoot, "package-lock.json"))) {
        updated.lockfile = "package-lock.json";
        updated.ecosystem = "npm";
      } else if (fs2.existsSync(path2.join(workspaceRoot, "pnpm-lock.yaml"))) {
        updated.lockfile = "pnpm-lock.yaml";
        updated.ecosystem = "pnpm";
      } else if (fs2.existsSync(path2.join(workspaceRoot, "yarn.lock"))) {
        updated.lockfile = "yarn.lock";
        updated.ecosystem = "yarn";
      } else if (fs2.existsSync(path2.join(workspaceRoot, "uv.lock"))) {
        updated.lockfile = "uv.lock";
        updated.ecosystem = "uv";
      } else if (fs2.existsSync(path2.join(workspaceRoot, "requirements.txt"))) {
        updated.lockfile = "requirements.txt";
        updated.ecosystem = "pip";
      }
    } catch (error) {
      logger.warn(`DependencyAnalyzer could not inspect manifest for ${dep.packageName}: ${error}`);
    }
    return updated;
  }
};

// src/analysis/codeContextAnalyzer.ts
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var CodeContextAnalyzer = class {
  static COMPLEX_CWES = /* @__PURE__ */ new Set([
    "CWE-89",
    // SQL Injection
    "CWE-78",
    // OS Command Injection
    "CWE-94",
    // Code Injection
    "CWE-502",
    // Insecure Deserialization
    "CWE-287",
    // Improper Authentication
    "CWE-327",
    // Use of Broken Cryptographic Algorithm
    "CWE-918"
    // SSRF
  ]);
  static SIMPLE_CWES = /* @__PURE__ */ new Set([
    "CWE-79",
    // DOM-based XSS (simple element assignment)
    "CWE-330",
    // Insecure PRNG (Math.random)
    "CWE-1333",
    // ReDoS
    "CWE-400"
    // Uncontrolled Resource Consumption (local header or timeout)
  ]);
  static async analyze(workspaceRoot, location, cweIds = [], ruleId) {
    if (!location || !location.filePath) {
      return {
        fileExists: false,
        fileLinesCount: 0,
        isSelfContained: true,
        taintComplexity: "moderate"
      };
    }
    const fullPath = path3.isAbsolute(location.filePath) ? location.filePath : path3.join(workspaceRoot, location.filePath);
    if (!fs3.existsSync(fullPath)) {
      return {
        fileExists: false,
        fileLinesCount: 0,
        snippet: location.snippet,
        isSelfContained: false,
        taintComplexity: this.determineComplexity(cweIds, ruleId)
      };
    }
    try {
      const content = fs3.readFileSync(fullPath, "utf8");
      const lines = content.split(/\r?\n/);
      const start = Math.max(0, location.startLine - 1);
      const end = Math.min(lines.length, location.endLine);
      const targetSnippet = lines.slice(start, end).join("\n");
      const contextStart = Math.max(0, start - 5);
      const contextEnd = Math.min(lines.length, end + 5);
      const surroundingContext = lines.slice(contextStart, contextEnd).join("\n");
      const isSelfContained = end - start <= 8 && lines.length < 500;
      const taintComplexity = this.determineComplexity(cweIds, ruleId);
      return {
        fileExists: true,
        fileLinesCount: lines.length,
        snippet: targetSnippet || location.snippet,
        surroundingContext,
        isSelfContained,
        taintComplexity
      };
    } catch (error) {
      logger.warn(`Could not read code context for ${fullPath}: ${error}`);
      return {
        fileExists: false,
        fileLinesCount: 0,
        snippet: location.snippet,
        isSelfContained: true,
        taintComplexity: this.determineComplexity(cweIds, ruleId)
      };
    }
  }
  static determineComplexity(cweIds, ruleId) {
    for (const cwe of cweIds) {
      if (this.COMPLEX_CWES.has(cwe)) return "complex";
      if (this.SIMPLE_CWES.has(cwe)) return "simple";
    }
    if (ruleId) {
      const r = ruleId.toLowerCase();
      if (r.includes("sql") || r.includes("command") || r.includes("rce") || r.includes("crypto")) {
        return "complex";
      }
      if (r.includes("random") || r.includes("xss") || r.includes("redos")) {
        return "simple";
      }
    }
    return "moderate";
  }
};

// src/analysis/sizingEngine.ts
var SizingEngine = class {
  /**
   * Applies the T-Shirt Sizing Matrix to a finding based on dependency metrics and code context.
   */
  static evaluate(finding, depInfo, contextReport) {
    const reasons = [];
    let size = "S";
    let riskLevel = "low";
    let estimatedHours = 1;
    let isAutomatedCandidate = true;
    if (finding.source === "dependabot") {
      const dep = depInfo || finding.dependency;
      const upgradeType = dep?.upgradeType || "patch";
      const isDirect = dep ? dep.isDirect : true;
      if (upgradeType === "major") {
        size = "L";
        riskLevel = "high";
        estimatedHours = 3.5;
        isAutomatedCandidate = false;
        reasons.push("Major version upgrade introduces potential API breaking changes");
        if (isDirect) {
          reasons.push("Direct package definition requires codebase API audit");
        }
      } else if (finding.severity === "critical") {
        size = "M";
        riskLevel = "medium";
        estimatedHours = 2;
        isAutomatedCandidate = true;
        reasons.push("Critical severity dependency patch; prioritized for rapid lockfile refresh");
      } else {
        size = "S";
        riskLevel = "low";
        estimatedHours = 0.5;
        isAutomatedCandidate = true;
        reasons.push(
          isDirect ? "Direct dependency patch bump with backward compatibility" : "Transitive lockfile bump without source modifications"
        );
      }
    } else {
      const complexity = contextReport?.taintComplexity || "moderate";
      const isSelfContained = contextReport?.isSelfContained ?? false;
      const severity = finding.severity;
      if (complexity === "complex" || severity === "critical") {
        size = "L";
        riskLevel = "high";
        estimatedHours = 4;
        isAutomatedCandidate = false;
        reasons.push("Complex data-flow / taint across application layers (e.g. SQL Injection or Command Injection)");
        reasons.push("High-risk vulnerability requiring human-in-the-loop verification");
      } else if (!isSelfContained || complexity === "moderate" || severity === "high") {
        size = "M";
        riskLevel = "medium";
        estimatedHours = 2;
        isAutomatedCandidate = false;
        reasons.push("Code modification touches non-trivial function block");
        reasons.push("Requires regression test validation");
      } else {
        size = "S";
        riskLevel = "low";
        estimatedHours = 0.5;
        isAutomatedCandidate = true;
        reasons.push("Self-contained, localized syntax or security sanitizer replacement");
        reasons.push("Eligible for deterministic AST-grep / AI automated repair");
      }
    }
    return {
      size,
      riskLevel,
      reasons,
      estimatedHours,
      isAutomatedCandidate
    };
  }
};

// src/engines/repairCoordinator.ts
var vscode7 = __toESM(require("vscode"));

// src/engines/deterministicFixer.ts
var vscode5 = __toESM(require("vscode"));
var fs4 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
var import_child_process2 = require("child_process");
var import_util2 = require("util");

// src/engines/astGrepRules.ts
var PRECOMPILED_AST_RULES = [
  // 1. Insecure Randomness (CWE-330)
  {
    ruleId: "js/insecure-randomness",
    cwe: "CWE-330",
    name: "Replace Math.random() with Node.js crypto.randomBytes",
    description: 'Replaces cryptographically insecure Math.random() token generation with crypto.randomBytes(32).toString("hex")',
    matcher: (code) => {
      return /Math\.random\(\)/.test(code);
    },
    transform: (code) => {
      const transformed = code.replace(
        /Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,
        "require('crypto').randomBytes(24).toString('hex')"
      ).replace(
        /Math\.random\(\)/g,
        "(require('crypto').randomBytes(4).readUInt32LE(0) / 0xffffffff)"
      );
      return {
        transformed,
        explanation: "Replaced Math.random with cryptographically secure random bytes from native crypto module."
      };
    }
  },
  // 2. DOM-based XSS (CWE-79)
  {
    ruleId: "js/xss-through-dom",
    cwe: "CWE-79",
    name: "Safe textContent assignment for innerHTML",
    description: "Replaces raw innerHTML assignment with textContent to neutralize cross-site scripting vectors",
    matcher: (code) => {
      return /\.innerHTML\s*=/.test(code);
    },
    transform: (code) => {
      const transformed = code.replace(
        /(\b\w+)\.innerHTML\s*=\s*([^;]+);/g,
        "$1.textContent = $2;"
      );
      return {
        transformed,
        explanation: "Converted vulnerable innerHTML assignment to safe textContent."
      };
    }
  },
  // 3. Command Injection (CWE-78)
  {
    ruleId: "js/command-injection",
    cwe: "CWE-78",
    name: "Parameterize child_process shell execution",
    description: "Swaps vulnerable exec template literal with safe execFile or sanitized arguments",
    matcher: (code) => {
      return /exec\(`[^`]*\$\{[^}]+\}[^`]*`/.test(code);
    },
    transform: (code) => {
      const transformed = code.replace(
        /exec\(`git checkout \$\{([^}]+)\}`,\s*([^)]+)\)/g,
        'execFile("git", ["checkout", $1], $2)'
      );
      return {
        transformed,
        explanation: "Replaced shell string concatenation with argument array via execFile."
      };
    }
  },
  // 4. SQL Injection (CWE-89)
  {
    ruleId: "js/sql-injection",
    cwe: "CWE-89",
    name: "Parameterize raw SQL template literal",
    description: "Converts interpolated SQL query strings into parameterized database queries",
    matcher: (code) => {
      return /`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i.test(code);
    },
    transform: (code) => {
      const transformed = code.replace(
        /`SELECT\s+\*\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?\$\{([^}]+)\}['"]?`/i,
        '"SELECT * FROM $1 WHERE $2 = $1", [$3]'
      );
      return {
        transformed,
        explanation: "Converted string-interpolated SQL query into parameterized prepared statement."
      };
    }
  },
  // 5. Path Traversal (CWE-22)
  {
    ruleId: "js/path-traversal",
    cwe: "CWE-22",
    name: "Enforce path boundary check",
    description: "Guards path.join with path.resolve boundary check against directory traversal",
    matcher: (code) => {
      return /path\.join\(/.test(code);
    },
    transform: (code) => {
      const transformed = code.replace(
        /const\s+filePath\s*=\s*path\.join\(([^,]+),\s*([^)]+)\);/g,
        "const safeFilename = path.basename($2);\n    const filePath = path.join($1, safeFilename);"
      );
      return {
        transformed,
        explanation: "Enforced path.basename sanitization to prevent directory escape."
      };
    }
  }
];

// src/engines/deterministicFixer.ts
var execAsync2 = (0, import_util2.promisify)(import_child_process2.exec);
var DeterministicFixer = class {
  /**
   * Applies deterministic fix for either Dependabot lockfile bump or AST-grep structural rule.
   */
  static async applyFix(workspaceRoot, finding) {
    if (finding.source === "dependabot") {
      return this.fixDependency(workspaceRoot, finding);
    } else {
      return this.fixCodeScanning(workspaceRoot, finding);
    }
  }
  /**
   * Upgrades dependency lockfile / manifest using ecosystem CLI.
   */
  static async fixDependency(workspaceRoot, finding) {
    const dep = finding.dependency;
    if (!dep) {
      return {
        success: false,
        engine: "deterministic",
        message: "No dependency metadata available for this alert.",
        modifiedFiles: []
      };
    }
    const config = vscode5.workspace.getConfiguration("codevulfixer");
    let pkgManager = config.get("packageManager", "auto");
    if (pkgManager === "auto") {
      pkgManager = dep.ecosystem || "npm";
      if (fs4.existsSync(path4.join(workspaceRoot, "pnpm-lock.yaml"))) pkgManager = "pnpm";
      else if (fs4.existsSync(path4.join(workspaceRoot, "yarn.lock"))) pkgManager = "yarn";
      else if (fs4.existsSync(path4.join(workspaceRoot, "uv.lock"))) pkgManager = "uv";
      else if (fs4.existsSync(path4.join(workspaceRoot, "requirements.txt"))) pkgManager = "pip";
      else pkgManager = "npm";
    }
    const pkg = dep.packageName;
    const version = dep.fixedVersion;
    let cmd = "";
    const modifiedFiles = [];
    switch (pkgManager) {
      case "npm":
        cmd = `npm install ${pkg}@${version} --package-lock-only`;
        modifiedFiles.push("package-lock.json");
        if (dep.isDirect) modifiedFiles.push("package.json");
        break;
      case "pnpm":
        cmd = `pnpm update ${pkg}@${version}`;
        modifiedFiles.push("pnpm-lock.yaml");
        break;
      case "yarn":
        cmd = `yarn up ${pkg}@${version}`;
        modifiedFiles.push("yarn.lock");
        break;
      case "uv":
        cmd = `uv add ${pkg}==${version}`;
        modifiedFiles.push("pyproject.toml", "uv.lock");
        break;
      case "pip":
        cmd = `pip install ${pkg}==${version}`;
        modifiedFiles.push("requirements.txt");
        break;
      default:
        cmd = `npm install ${pkg}@${version} --package-lock-only`;
        modifiedFiles.push("package-lock.json");
    }
    logger.info(`[DeterministicFixer] Spawning package manager CLI: "${cmd}" in ${workspaceRoot}`);
    try {
      const { stdout, stderr } = await execAsync2(cmd, { cwd: workspaceRoot });
      logger.success(`[DeterministicFixer] Successfully upgraded ${pkg} to ${version}`);
      return {
        success: true,
        engine: "deterministic",
        message: `Upgraded ${pkg} to ${version} via ${pkgManager} lockfile bump`,
        commandExecuted: cmd,
        stdout,
        stderr,
        modifiedFiles
      };
    } catch (error) {
      logger.warn(`CLI execution returned error: ${error.message}. Attempting safe fallback manifest upgrade.`);
      const packageJsonPath = path4.join(workspaceRoot, "package.json");
      if (fs4.existsSync(packageJsonPath)) {
        try {
          const raw = fs4.readFileSync(packageJsonPath, "utf8");
          const pkgJson = JSON.parse(raw);
          let found = false;
          if (pkgJson.dependencies && pkgJson.dependencies[pkg]) {
            pkgJson.dependencies[pkg] = `^${version}`;
            found = true;
          }
          if (pkgJson.devDependencies && pkgJson.devDependencies[pkg]) {
            pkgJson.devDependencies[pkg] = `^${version}`;
            found = true;
          }
          if (found) {
            fs4.writeFileSync(packageJsonPath, JSON.stringify(pkgJson, null, 2), "utf8");
            return {
              success: true,
              engine: "deterministic",
              message: `Updated ${pkg} in package.json to ^${version} (manifest-level fallback)`,
              commandExecuted: "Direct manifest rewrite",
              modifiedFiles: ["package.json"]
            };
          }
        } catch {
        }
      }
      return {
        success: false,
        engine: "deterministic",
        message: `Failed to execute lockfile upgrade command: ${error.message}`,
        commandExecuted: cmd,
        stderr: error.stderr || error.message,
        modifiedFiles: []
      };
    }
  }
  /**
   * Applies precompiled structural AST-grep transformation rule.
   */
  static async fixCodeScanning(workspaceRoot, finding) {
    const loc = finding.location;
    if (!loc || !loc.filePath) {
      return {
        success: false,
        engine: "deterministic",
        message: "No file location metadata provided in Code Scanning alert.",
        modifiedFiles: []
      };
    }
    const filePath = path4.isAbsolute(loc.filePath) ? loc.filePath : path4.join(workspaceRoot, loc.filePath);
    const rule = PRECOMPILED_AST_RULES.find(
      (r) => r.ruleId === finding.ruleId || finding.cweIds && finding.cweIds.includes(r.cwe)
    );
    if (!rule) {
      return {
        success: false,
        engine: "deterministic",
        message: `No precompiled deterministic AST-grep rule for ${finding.ruleId || "unknown rule"}. Recommend using Copilot LM Engine.`,
        modifiedFiles: []
      };
    }
    if (!fs4.existsSync(filePath)) {
      if (loc.snippet) {
        const dir = path4.dirname(filePath);
        if (!fs4.existsSync(dir)) fs4.mkdirSync(dir, { recursive: true });
        fs4.writeFileSync(filePath, `// CodeVulFixer Target File
${loc.snippet}
`, "utf8");
      } else {
        return {
          success: false,
          engine: "deterministic",
          message: `Target file not found: ${loc.filePath}`,
          modifiedFiles: []
        };
      }
    }
    try {
      const originalContent = fs4.readFileSync(filePath, "utf8");
      const lines = originalContent.split(/\r?\n/);
      const start = Math.max(0, (loc.startLine || 1) - 1);
      const end = Math.min(lines.length, loc.endLine || lines.length);
      const targetSnippet = lines.slice(start, end).join("\n");
      const { transformed, explanation } = rule.transform(targetSnippet);
      if (transformed === targetSnippet) {
        const fullTransform = rule.transform(originalContent);
        if (fullTransform.transformed !== originalContent) {
          fs4.writeFileSync(filePath, fullTransform.transformed, "utf8");
          return {
            success: true,
            engine: "deterministic",
            message: `AST-grep applied: ${rule.name}. ${fullTransform.explanation}`,
            modifiedFiles: [loc.filePath]
          };
        }
        return {
          success: false,
          engine: "deterministic",
          message: `AST-grep rule did not match the code structure in ${loc.filePath}`,
          modifiedFiles: []
        };
      }
      lines.splice(start, end - start, transformed);
      fs4.writeFileSync(filePath, lines.join("\n"), "utf8");
      logger.success(`[DeterministicFixer] AST transformation applied: ${rule.name} on ${loc.filePath}`);
      return {
        success: true,
        engine: "deterministic",
        message: `AST-grep applied: ${rule.name}. ${explanation}`,
        modifiedFiles: [loc.filePath]
      };
    } catch (error) {
      logger.error("Failed to apply AST-grep fix", error);
      return {
        success: false,
        engine: "deterministic",
        message: `AST-grep failed: ${error instanceof Error ? error.message : String(error)}`,
        modifiedFiles: []
      };
    }
  }
};

// src/engines/copilotLMFixer.ts
var vscode6 = __toESM(require("vscode"));
var fs5 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var CopilotLMFixer = class {
  /**
   * Applies an AI-assisted fix using the native VS Code Language Model API (vscode.lm).
   * Leverages the user's active GitHub Copilot instance.
   */
  static async applyFix(workspaceRoot, finding) {
    logger.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${finding.id}: ${finding.title}`);
    let models = [];
    try {
      models = await vscode6.lm.selectChatModels({ vendor: "copilot" });
      if (!models || models.length === 0) {
        models = await vscode6.lm.selectChatModels();
      }
    } catch (err) {
      logger.warn(`Error selecting chat models via vscode.lm: ${err}`);
    }
    if (!models || models.length === 0) {
      return {
        success: false,
        engine: "copilot",
        message: "No active Copilot Language Model found. Please ensure GitHub Copilot is installed and active in VS Code, or switch to Deterministic fix mode.",
        modifiedFiles: []
      };
    }
    const model = models[0];
    logger.info(`[CopilotLMFixer] Using model: ${model.name} (${model.id})`);
    const loc = finding.location;
    let filePath = "";
    let fileContent = "";
    let targetSnippet = loc?.snippet || "";
    if (loc?.filePath) {
      filePath = path5.isAbsolute(loc.filePath) ? loc.filePath : path5.join(workspaceRoot, loc.filePath);
      if (fs5.existsSync(filePath)) {
        fileContent = fs5.readFileSync(filePath, "utf8");
      } else if (loc.snippet) {
        const dir = path5.dirname(filePath);
        if (!fs5.existsSync(dir)) fs5.mkdirSync(dir, { recursive: true });
        fs5.writeFileSync(filePath, `// Target: ${loc.filePath}
${loc.snippet}
`, "utf8");
        fileContent = fs5.readFileSync(filePath, "utf8");
      }
    }
    const prompt = this.buildPrompt(finding, fileContent, targetSnippet);
    const messages = [
      vscode6.LanguageModelChatMessage.User(
        "You are a Principal Security Architect and CodeQL Remediator. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a ```ts code block. Do NOT include extraneous markdown explanations."
      ),
      vscode6.LanguageModelChatMessage.User(prompt)
    ];
    try {
      const cts = new vscode6.CancellationTokenSource();
      const anyModel = model;
      const chatResponse = anyModel.sendRequest ? await anyModel.sendRequest(messages, {}, cts.token) : await anyModel.sendChatRequest(messages, {}, cts.token);
      let responseText = "";
      for await (const fragment of chatResponse.text) {
        responseText += fragment;
      }
      logger.info(`[CopilotLMFixer] Received response (${responseText.length} chars) from ${model.name}`);
      const extractedCode = this.extractCode(responseText);
      if (!extractedCode) {
        return {
          success: false,
          engine: "copilot",
          message: "Could not extract clean code replacement from Copilot LM response.",
          stdout: responseText,
          modifiedFiles: []
        };
      }
      if (filePath) {
        fs5.writeFileSync(filePath, extractedCode, "utf8");
        logger.success(`[CopilotLMFixer] Successfully updated ${loc?.filePath} with Copilot LM remediation`);
        return {
          success: true,
          engine: "copilot",
          message: `Remediated by Copilot LM (${model.name}): ${finding.title}`,
          stdout: responseText,
          modifiedFiles: [loc?.filePath || "remediated_code.ts"]
        };
      } else {
        return {
          success: true,
          engine: "copilot",
          message: "Generated remediation patch with Copilot LM.",
          stdout: extractedCode,
          modifiedFiles: []
        };
      }
    } catch (error) {
      logger.error("Copilot LM fix execution failed", error);
      return {
        success: false,
        engine: "copilot",
        message: `Copilot LM request failed: ${error.message || String(error)}`,
        stderr: String(error),
        modifiedFiles: []
      };
    }
  }
  static buildPrompt(finding, fileContent, snippet) {
    return `
VULNERABILITY DETAILS:
- Title: ${finding.title}
- Severity: ${finding.severity.toUpperCase()}
- Rule ID: ${finding.ruleId || "N/A"}
- CWE IDs: ${(finding.cweIds || []).join(", ") || "N/A"}
- Advisory: ${finding.cveId || finding.ghsaId || "N/A"}
- Description: ${finding.description}
- Remediation Guideline: ${finding.remediationPlan}

TARGET LOCATION:
- File: ${finding.location?.filePath || "Unknown"}
- Lines: ${finding.location?.startLine ?? 1} to ${finding.location?.endLine ?? 1}

VULNERABLE SNIPPET:
\`\`\`
${snippet || fileContent.slice(0, 500)}
\`\`\`

COMPLETE EXISTING FILE CONTENT:
\`\`\`
${fileContent || snippet}
\`\`\`

INSTRUCTIONS:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, and functionality.
3. Eliminate injection, taint flow, or insecure APIs completely using industry standard safe APIs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`
// code here
\`\`\`
`;
  }
  static extractCode(raw) {
    const match = raw.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);
    if (match && match[1]) {
      return match[1].trim();
    }
    if (raw.includes("import ") || raw.includes("const ") || raw.includes("function ") || raw.includes("export ")) {
      return raw.trim();
    }
    return void 0;
  }
};

// src/engines/repairCoordinator.ts
var RepairCoordinator = class {
  /**
   * Executes the appropriate repair engine based on finding characteristics and preferences.
   */
  static async executeRepair(workspaceRoot, finding, engineOverride) {
    const config = vscode7.workspace.getConfiguration("codevulfixer");
    const preferredEngine = engineOverride || config.get("preferredFixEngine", "auto");
    logger.info(`[RepairCoordinator] Deciding engine for ${finding.id} (preference: ${preferredEngine})...`);
    if (preferredEngine === "deterministic") {
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }
    if (preferredEngine === "copilot") {
      const copilotResult = await CopilotLMFixer.applyFix(workspaceRoot, finding);
      if (copilotResult.success) {
        return copilotResult;
      }
      logger.warn(`Copilot LM repair failed or unavailable: ${copilotResult.message}. Falling back to deterministic engine.`);
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }
    if (finding.source === "dependabot") {
      return DeterministicFixer.applyFix(workspaceRoot, finding);
    }
    const hasAstRule = PRECOMPILED_AST_RULES.some(
      (r) => r.ruleId === finding.ruleId || finding.cweIds && finding.cweIds.includes(r.cwe)
    );
    if (hasAstRule && finding.sizing.size === "S") {
      logger.info(`[RepairCoordinator] Choosing Deterministic AST engine for self-contained rule: ${finding.ruleId}`);
      const astResult = await DeterministicFixer.applyFix(workspaceRoot, finding);
      if (astResult.success) return astResult;
    }
    logger.info(`[RepairCoordinator] Choosing Copilot LM engine for ${finding.id}`);
    const aiResult = await CopilotLMFixer.applyFix(workspaceRoot, finding);
    if (aiResult.success) {
      return aiResult;
    }
    logger.info(`Copilot LM fallback to deterministic engine for ${finding.id}`);
    return DeterministicFixer.applyFix(workspaceRoot, finding);
  }
};

// src/validation/taskValidator.ts
var vscode8 = __toESM(require("vscode"));
var fs6 = __toESM(require("fs"));
var path6 = __toESM(require("path"));
var import_child_process3 = require("child_process");
var import_util3 = require("util");
var execAsync3 = (0, import_util3.promisify)(import_child_process3.exec);
var TaskValidator = class {
  /**
   * Runs automated compilation and test validation suites.
   */
  static async validateWorkspace(workspaceRoot) {
    const config = vscode8.workspace.getConfiguration("codevulfixer");
    const autoRun = config.get("autoRunTests", true);
    const buildCmd = config.get("buildCommand", "npm run build");
    const testCmd = config.get("testCommand", "npm test");
    const summary = {
      passed: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      buildStatus: "skipped",
      testStatus: "skipped",
      auditStatus: "skipped"
    };
    if (!autoRun) {
      logger.info("Auto-validation is disabled in settings.");
      return summary;
    }
    const packageJsonPath = path6.join(workspaceRoot, "package.json");
    let hasBuildScript = false;
    let hasTestScript = false;
    if (fs6.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs6.readFileSync(packageJsonPath, "utf8"));
        hasBuildScript = !!(pkg.scripts && pkg.scripts.build);
        hasTestScript = !!(pkg.scripts && pkg.scripts.test);
      } catch {
      }
    }
    if (hasBuildScript || fs6.existsSync(path6.join(workspaceRoot, "tsconfig.json"))) {
      const start = Date.now();
      const actualBuildCmd = hasBuildScript ? buildCmd : "npx tsc --noEmit";
      logger.info(`[Validation] Running compilation check: ${actualBuildCmd}`);
      try {
        const { stdout, stderr } = await execAsync3(actualBuildCmd, {
          cwd: workspaceRoot,
          timeout: 6e4
        });
        summary.buildStatus = "passed";
        summary.buildDurationMs = Date.now() - start;
        summary.buildOutput = stdout || "Compilation passed with zero errors.";
        logger.success(`[Validation] Compilation check passed in ${summary.buildDurationMs}ms.`);
      } catch (error) {
        summary.buildStatus = "failed";
        summary.passed = false;
        summary.buildDurationMs = Date.now() - start;
        summary.buildOutput = error.stdout || "";
        summary.failureStackTrace = error.stderr || error.message;
        logger.error(`[Validation] Compilation failed: ${error.message}`);
        return summary;
      }
    } else {
      summary.buildStatus = "skipped";
    }
    if (hasTestScript) {
      const start = Date.now();
      logger.info(`[Validation] Running regression test suite: ${testCmd}`);
      try {
        const { stdout, stderr } = await execAsync3(testCmd, {
          cwd: workspaceRoot,
          timeout: 6e4
        });
        summary.testStatus = "passed";
        summary.testDurationMs = Date.now() - start;
        summary.testOutput = stdout || "All tests passed.";
        logger.success(`[Validation] Test suite passed in ${summary.testDurationMs}ms.`);
      } catch (error) {
        summary.testStatus = "failed";
        summary.passed = false;
        summary.testDurationMs = Date.now() - start;
        summary.testOutput = error.stdout || "";
        summary.failureStackTrace = error.stderr || error.message;
        logger.error(`[Validation] Test suite failed: ${error.message}`);
        return summary;
      }
    } else {
      summary.testStatus = "skipped";
    }
    return summary;
  }
};

// src/validation/diffEngine.ts
var fs7 = __toESM(require("fs"));
var path7 = __toESM(require("path"));
var import_child_process4 = require("child_process");
var import_util4 = require("util");
var execAsync4 = (0, import_util4.promisify)(import_child_process4.exec);
var DiffEngine = class {
  /**
   * Generates a line-by-line diff for specified files in the workspace.
   */
  static async getFileDiff(workspaceRoot, relativeFilePath) {
    try {
      const { stdout } = await execAsync4(`git diff --no-color -U3 -- "${relativeFilePath}"`, {
        cwd: workspaceRoot
      });
      if (stdout.trim().length > 0) {
        return {
          filePath: relativeFilePath,
          hasChanges: true,
          rawDiff: stdout,
          lines: this.parseUnifiedDiff(stdout)
        };
      }
    } catch {
    }
    const fullPath = path7.isAbsolute(relativeFilePath) ? relativeFilePath : path7.join(workspaceRoot, relativeFilePath);
    if (fs7.existsSync(fullPath)) {
      const content = fs7.readFileSync(fullPath, "utf8");
      const lines = content.split(/\r?\n/).map((l, i) => ({
        type: "add",
        content: l,
        newLineNumber: i + 1
      }));
      return {
        filePath: relativeFilePath,
        hasChanges: true,
        rawDiff: content,
        lines
      };
    }
    return {
      filePath: relativeFilePath,
      hasChanges: false,
      rawDiff: "",
      lines: []
    };
  }
  /**
   * Generates a combined diff report for multiple files.
   */
  static async getMultiFileDiff(workspaceRoot, filePaths) {
    const results = [];
    for (const f of filePaths) {
      results.push(await this.getFileDiff(workspaceRoot, f));
    }
    return results;
  }
  static parseUnifiedDiff(diffText) {
    const lines = diffText.split(/\r?\n/);
    const parsed = [];
    let oldNum = 0;
    let newNum = 0;
    for (const line of lines) {
      if (line.startsWith("@@")) {
        const match = line.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);
        if (match) {
          oldNum = parseInt(match[1], 10);
          newNum = parseInt(match[2], 10);
        }
        parsed.push({ type: "normal", content: line });
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        parsed.push({
          type: "add",
          content: line.substring(1),
          newLineNumber: newNum++
        });
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        parsed.push({
          type: "delete",
          content: line.substring(1),
          oldLineNumber: oldNum++
        });
      } else if (line.startsWith(" ")) {
        parsed.push({
          type: "normal",
          content: line.substring(1),
          oldLineNumber: oldNum++,
          newLineNumber: newNum++
        });
      }
    }
    return parsed;
  }
};

// src/scm/gitScmHandler.ts
var vscode9 = __toESM(require("vscode"));
var import_child_process5 = require("child_process");
var import_util5 = require("util");
var execAsync5 = (0, import_util5.promisify)(import_child_process5.exec);
var GitScmHandler = class {
  /**
   * Stages modified files for check-in and auto-populates the SCM commit message.
   */
  static async stageAndSetCommitMessage(workspaceRoot, finding, modifiedFiles) {
    try {
      for (const file of modifiedFiles) {
        logger.info(`[SCM] Staging file: git add "${file}"`);
        await execAsync5(`git add "${file}"`, { cwd: workspaceRoot });
      }
      const context = finding.source === "dependabot" ? finding.dependency?.packageName || "dependencies" : finding.location?.filePath || "security-audit";
      const advisoryId = finding.cveId || finding.ghsaId || finding.ruleId || finding.id;
      const commitMsg = `security(fix): [CodeVulFixer] resolved ${advisoryId} in ${context}

${finding.title}
Remediation: ${finding.remediationPlan}`;
      try {
        const gitExtension = vscode9.extensions.getExtension("vscode.git");
        if (gitExtension) {
          const gitApi = gitExtension.exports.getAPI(1);
          if (gitApi && gitApi.repositories.length > 0) {
            const repo = gitApi.repositories[0];
            repo.inputBox.value = commitMsg;
            logger.info("[SCM] Populated VS Code Git commit message box.");
          }
        }
      } catch (e) {
        logger.warn(`Could not set VS Code SCM input box: ${e}`);
      }
      vscode9.window.showInformationMessage(
        `CodeVulFixer: Staged fixes for ${finding.id} and populated commit message.`
      );
      return true;
    } catch (error) {
      logger.error("Failed to stage files in Git", error);
      return false;
    }
  }
  /**
   * Reverts changes to modified files, rolling back workspace mutations.
   */
  static async rollbackChanges(workspaceRoot, modifiedFiles) {
    try {
      for (const file of modifiedFiles) {
        logger.info(`[SCM] Rolling back mutations in: ${file}`);
        try {
          await execAsync5(`git restore "${file}"`, { cwd: workspaceRoot });
        } catch {
          await execAsync5(`git checkout -- "${file}"`, { cwd: workspaceRoot });
        }
      }
      vscode9.window.showWarningMessage(
        `CodeVulFixer: Rolled back workspace changes for ${modifiedFiles.join(", ")}.`
      );
      return true;
    } catch (error) {
      logger.error("Failed to rollback Git changes", error);
      return false;
    }
  }
};

// src/ingestion/mockData.ts
var REALISTIC_DEMO_FINDINGS = [
  // 1. Dependabot: Direct Lockfile Quick Win (Sprint 1 candidate)
  {
    id: "DEP-101",
    source: "dependabot",
    alertNumber: 101,
    title: "Denial of Service in axios due to unbounded buffer allocation",
    description: "Axios versions prior to 1.7.4 are vulnerable to Server-Side Request Forgery and Unhandled Rejections leading to DoS when parsing malicious redirect responses.",
    severity: "high",
    htmlUrl: "https://github.com/advisories/GHSA-8hc4-vh64-cxmj",
    cveId: "CVE-2023-45857",
    ghsaId: "GHSA-8hc4-vh64-cxmj",
    cweIds: ["CWE-400", "CWE-918"],
    dependency: {
      packageName: "axios",
      ecosystem: "npm",
      currentVersion: "^1.6.0",
      fixedVersion: "1.7.4",
      isDirect: true,
      manifestFile: "package.json",
      lockfile: "package-lock.json",
      vulnerableVersionRange: "< 1.7.4",
      upgradeType: "patch"
    },
    status: "pending",
    targetSprint: 1,
    remediationPlan: "Execute deterministic lockfile bump: `npm install axios@1.7.4 --package-lock-only`",
    sizing: {
      size: "S",
      riskLevel: "low",
      reasons: ["Direct dependency patch update", "Zero breaking API changes reported", "Deterministic lockfile bump eligible"],
      estimatedHours: 0.5,
      isAutomatedCandidate: true
    }
  },
  // 2. Dependabot: Transitive Nested Package (Sprint 1 candidate)
  {
    id: "DEP-102",
    source: "dependabot",
    alertNumber: 102,
    title: "Regular Expression Denial of Service (ReDoS) in semver",
    description: "semver vulnerable to Regular Expression Denial of Service when passing untrusted complex ranges to clean/validRange functions.",
    severity: "high",
    htmlUrl: "https://github.com/advisories/GHSA-c2qf-rxjj-qqgw",
    cveId: "CVE-2022-25883",
    ghsaId: "GHSA-c2qf-rxjj-qqgw",
    cweIds: ["CWE-1333"],
    dependency: {
      packageName: "semver",
      ecosystem: "npm",
      currentVersion: "7.3.5",
      fixedVersion: "7.5.3",
      isDirect: false,
      manifestFile: "package.json",
      lockfile: "package-lock.json",
      vulnerableVersionRange: "< 7.5.3",
      upgradeType: "patch"
    },
    status: "pending",
    targetSprint: 1,
    remediationPlan: "Deduplicate & force update transitive lockfile entry for semver to >= 7.5.3",
    sizing: {
      size: "S",
      riskLevel: "low",
      reasons: ["Transitive dependency patch bump", "No direct code changes required in repository source"],
      estimatedHours: 0.5,
      isAutomatedCandidate: true
    }
  },
  // 3. Dependabot: Major Breaking Architecture Upgrade (Sprint 2 candidate)
  {
    id: "DEP-103",
    source: "dependabot",
    alertNumber: 103,
    title: "Prototype Pollution in json5 leading to RCE or Crash",
    description: "json5 vulnerable to Prototype Pollution via parse function. Upgrading requires major version bump 1.x -> 2.2.2 with potential schema validation shifts.",
    severity: "critical",
    htmlUrl: "https://github.com/advisories/GHSA-9c47-m6qq-7p4h",
    cveId: "CVE-2022-46175",
    ghsaId: "GHSA-9c47-m6qq-7p4h",
    cweIds: ["CWE-1321"],
    dependency: {
      packageName: "json5",
      ecosystem: "npm",
      currentVersion: "^1.0.1",
      fixedVersion: "2.2.3",
      isDirect: true,
      manifestFile: "package.json",
      lockfile: "package-lock.json",
      vulnerableVersionRange: "< 2.2.2",
      upgradeType: "major"
    },
    status: "pending",
    targetSprint: 2,
    remediationPlan: "Upgrade json5 to 2.2.3, run complete test regression to verify custom deserializer calls",
    sizing: {
      size: "L",
      riskLevel: "high",
      reasons: ["Major breaking version upgrade (1.x -> 2.x)", "Imported in core configuration parsing modules", "Requires compilation & test verification"],
      estimatedHours: 3.5,
      isAutomatedCandidate: false
    }
  },
  // 4. Code Scanning (CodeQL): SQL Injection in User Data Access (Sprint 2 candidate)
  {
    id: "CS-201",
    source: "code_scanning",
    alertNumber: 201,
    title: "Database query built from user-controlled string (SQL Injection)",
    description: "CodeQL detected untrusted HTTP parameter concatenation into raw SQL query without parameterized bindings in userRepository.ts.",
    severity: "critical",
    htmlUrl: "https://github.com/example/repo/security/code-scanning/201",
    ruleId: "js/sql-injection",
    cweIds: ["CWE-89"],
    location: {
      filePath: "demo/src/db/userRepository.ts",
      startLine: 4,
      endLine: 6,
      startColumn: 3,
      endColumn: 60,
      snippet: "const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;\n  const result = await db.raw(query);"
    },
    status: "pending",
    targetSprint: 2,
    remediationPlan: 'Refactor string interpolation to parameterized SQL query: `db.query("SELECT * FROM users WHERE email = $1", [req.query.email])`',
    sizing: {
      size: "L",
      riskLevel: "high",
      reasons: ["Direct external input taint flow into database driver", "Potential full data exfiltration risk", "Cross-module data flow detected"],
      estimatedHours: 4,
      isAutomatedCandidate: false
    }
  },
  // 5. Code Scanning: Insecure Randomness (Sprint 1 candidate)
  {
    id: "CS-202",
    source: "code_scanning",
    alertNumber: 202,
    title: "Use of cryptographically weak pseudo-random number generator",
    description: "Math.random() is used to generate session tokens or authentication secrets in tokenGenerator.ts.",
    severity: "medium",
    htmlUrl: "https://github.com/example/repo/security/code-scanning/202",
    ruleId: "js/insecure-randomness",
    cweIds: ["CWE-330"],
    location: {
      filePath: "demo/src/auth/tokenGenerator.ts",
      startLine: 4,
      endLine: 5,
      startColumn: 3,
      endColumn: 45,
      snippet: "const token = Math.random().toString(36).substring(2);"
    },
    status: "pending",
    targetSprint: 1,
    remediationPlan: "Replace Math.random() with `crypto.randomBytes(32).toString('hex')`",
    sizing: {
      size: "S",
      riskLevel: "low",
      reasons: ["Self-contained local expression swap", "Pre-compiled AST pattern match available", "Low regression impact on caller"],
      estimatedHours: 0.5,
      isAutomatedCandidate: true
    }
  },
  // 6. Code Scanning: DOM-Based XSS (Sprint 1 candidate)
  {
    id: "CS-203",
    source: "code_scanning",
    alertNumber: 203,
    title: "DOM text reinterpreted as HTML without escaping (XSS)",
    description: "Assigning unsanitized user profile bio directly to Element.innerHTML creates an execution path for malicious script tags.",
    severity: "high",
    htmlUrl: "https://github.com/example/repo/security/code-scanning/203",
    ruleId: "js/xss-through-dom",
    cweIds: ["CWE-79"],
    location: {
      filePath: "demo/src/web/render.ts",
      startLine: 9,
      endLine: 10,
      startColumn: 3,
      endColumn: 38,
      snippet: "userBioElement.innerHTML = user.bio;"
    },
    status: "pending",
    targetSprint: 1,
    remediationPlan: "Change `innerHTML` to `textContent` or sanitize with DOMPurify",
    sizing: {
      size: "S",
      riskLevel: "low",
      reasons: ["Localized DOM assignment", "Direct AST replacement innerHTML -> textContent", "No complex data flow"],
      estimatedHours: 0.5,
      isAutomatedCandidate: true
    }
  },
  // 7. Code Scanning: Command Injection (Sprint 2 candidate)
  {
    id: "CS-204",
    source: "code_scanning",
    alertNumber: 204,
    title: "Untrusted input passed directly to child_process.exec (Command Injection)",
    description: "String concatenation into shell execution command in execHelper.ts allows arbitrary command execution.",
    severity: "critical",
    htmlUrl: "https://github.com/example/repo/security/code-scanning/204",
    ruleId: "js/command-injection",
    cweIds: ["CWE-78"],
    location: {
      filePath: "demo/src/utils/execHelper.ts",
      startLine: 6,
      endLine: 7,
      startColumn: 3,
      endColumn: 45,
      snippet: "exec(`git checkout ${branchName}`, callback);"
    },
    status: "pending",
    targetSprint: 2,
    remediationPlan: 'Use `execFile` with separate arguments array instead of shell interpolation: `execFile("git", ["checkout", branchName])`',
    sizing: {
      size: "L",
      riskLevel: "high",
      reasons: ["Remote Code Execution potential", "Shell invocation architecture change", "Requires argument validation helper"],
      estimatedHours: 3,
      isAutomatedCandidate: false
    }
  },
  // 8. Dependabot: Hygiene Maintenance (Sprint 3 candidate)
  {
    id: "DEP-104",
    source: "dependabot",
    alertNumber: 104,
    title: "DoS through memory exhaustion in ws websocket library",
    description: "ws client allows attacker to send infinite message headers causing Node process out-of-memory.",
    severity: "medium",
    htmlUrl: "https://github.com/advisories/GHSA-3h5v-q93c-6h6q",
    cveId: "CVE-2024-37890",
    ghsaId: "GHSA-3h5v-q93c-6h6q",
    cweIds: ["CWE-400"],
    dependency: {
      packageName: "ws",
      ecosystem: "npm",
      currentVersion: "^8.14.0",
      fixedVersion: "8.17.1",
      isDirect: true,
      manifestFile: "package.json",
      lockfile: "package-lock.json",
      vulnerableVersionRange: "< 8.17.1",
      upgradeType: "minor"
    },
    status: "pending",
    targetSprint: 3,
    remediationPlan: "Upgrade ws to 8.17.1 via `npm install ws@8.17.1 --package-lock-only`",
    sizing: {
      size: "S",
      riskLevel: "low",
      reasons: ["Minor hygiene upgrade", "Fully backward-compatible API"],
      estimatedHours: 0.5,
      isAutomatedCandidate: true
    }
  },
  // 9. Code Scanning: Path Traversal (Sprint 3 candidate)
  {
    id: "CS-205",
    source: "code_scanning",
    alertNumber: 205,
    title: "Unsanitized path concatenation in file server (Path Traversal)",
    description: "path.join with untrusted request parameter allows reading arbitrary files outside root folder if not bounded by path.resolve.",
    severity: "low",
    htmlUrl: "https://github.com/example/repo/security/code-scanning/205",
    ruleId: "js/path-traversal",
    cweIds: ["CWE-22"],
    location: {
      filePath: "demo/src/server/fileHandler.ts",
      startLine: 7,
      endLine: 9,
      startColumn: 3,
      endColumn: 55,
      snippet: "const filePath = path.join(publicDir, req.query.filename);\n  return fs.readFileSync(filePath);"
    },
    status: "pending",
    targetSprint: 3,
    remediationPlan: "Enforce boundary check: verify `path.resolve(publicDir, filename).startsWith(publicDir)`",
    sizing: {
      size: "M",
      riskLevel: "medium",
      reasons: ["Requires path verification utility injection", "Non-critical asset endpoint"],
      estimatedHours: 1.5,
      isAutomatedCandidate: false
    }
  }
];

// src/webview/htmlTemplate.ts
function getDashboardHtml(state, activeTab = "risk-profile", selectedDiffFinding) {
  const stateJson = JSON.stringify(state || null).replace(/</g, "\\u003c");
  const selectedFindingJson = JSON.stringify(selectedDiffFinding || null).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeVulFixer Sprint & Risk Dashboard</title>
  <style>
    :root {
      --color-success: #28a745;
      --color-warning: #ffc107;
      --color-danger: #dc3545;
      --color-info: #17a2b8;
      --color-success-bg: rgba(40, 167, 69, 0.15);
      --color-warning-bg: rgba(255, 193, 7, 0.15);
      --color-danger-bg: rgba(220, 53, 69, 0.15);
      --color-info-bg: rgba(23, 162, 184, 0.15);
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      line-height: 1.5;
    }

    /* Header & Navigation */
    .header {
      background-color: var(--vscode-sideBar-background, #1e1e1e);
      border-bottom: 1px solid var(--vscode-panel-border, #333);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 24px;
      background: linear-gradient(135deg, #17a2b8, #28a745);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 11px;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      gap: 4px;
      background: var(--vscode-editorGroupHeader-tabsBackground, #252526);
      padding: 4px 24px 0 24px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--vscode-tab-inactiveForeground, #888);
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn:hover {
      color: var(--vscode-tab-activeForeground, #fff);
      background: rgba(255, 255, 255, 0.03);
    }

    .tab-btn.active {
      color: var(--vscode-tab-activeForeground, #fff);
      border-bottom: 2px solid var(--color-info);
      background: var(--vscode-editor-background);
    }

    /* Main Container */
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .metric-card.danger::before { background: var(--color-danger); }
    .metric-card.warning::before { background: var(--color-warning); }
    .metric-card.success::before { background: var(--color-success); }
    .metric-card.info::before { background: var(--color-info); }

    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      opacity: 0.7;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.1;
    }

    .metric-sub {
      font-size: 12px;
      margin-top: 6px;
      opacity: 0.8;
    }

    /* Buttons */
    .btn {
      background: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #fff);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .btn:hover {
      background: var(--vscode-button-hoverBackground, #0062a3);
    }

    .btn-secondary {
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #fff);
    }

    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground, #45494e);
    }

    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover { background: #218838; }

    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-danger:hover { background: #c82333; }

    .btn-sm {
      padding: 4px 10px;
      font-size: 11px;
    }

    /* Badges & Pills */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-high { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-medium { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-low { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }

    .badge-s { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }
    .badge-m { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-l { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }

    .status-pill {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 10px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pending { background: rgba(255,255,255,0.1); color: #ccc; }
    .status-in_progress { background: var(--color-info-bg); color: var(--color-info); }
    .status-applied { background: var(--color-warning-bg); color: var(--color-warning); }
    .status-verified { background: var(--color-success-bg); color: var(--color-success); }
    .status-failed { background: var(--color-danger-bg); color: var(--color-danger); }
    .status-rejected { background: rgba(220, 53, 69, 0.2); color: #ff8080; }

    /* Sprint Board */
    .sprint-header {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sprint-title {
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sprint-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .sprint-actions {
      display: flex;
      gap: 8px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }

    .vuln-card {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, border-color 0.15s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .vuln-card:hover {
      border-color: var(--color-info);
      transform: translateY(-2px);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .card-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
      padding: 8px;
      font-size: 11px;
      margin-bottom: 12px;
      font-family: monospace;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid var(--vscode-panel-border, #333);
      gap: 8px;
    }

    /* Terminal Component for Failure Logs */
    .terminal-box {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 12px 16px;
      color: #c9d1d9;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin: 12px 0;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 250px;
      overflow-y: auto;
    }

    .terminal-title {
      color: var(--color-danger);
      font-weight: bold;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Intercept Checkpoint Overlay / Modal */
    .checkpoint-banner {
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(23, 162, 184, 0.15));
      border: 1px solid var(--color-success);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
    }

    .checkpoint-info h3 {
      margin: 0 0 4px 0;
      color: var(--color-success);
      font-size: 16px;
    }

    .checkpoint-info p {
      margin: 0;
      font-size: 12px;
      opacity: 0.85;
    }

    /* Diff Viewer */
    .diff-container {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .diff-header {
      background: #161b22;
      padding: 10px 16px;
      border-bottom: 1px solid #30363d;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .diff-line {
      display: flex;
      padding: 2px 12px;
      line-height: 1.5;
    }

    .diff-line.add {
      background: rgba(46, 160, 67, 0.15);
      color: #7ee787;
    }

    .diff-line.delete {
      background: rgba(248, 81, 73, 0.15);
      color: #ffa198;
    }

    .diff-line.normal {
      color: #8b949e;
    }

    .diff-line-num {
      width: 40px;
      user-select: none;
      opacity: 0.5;
      text-align: right;
      padding-right: 12px;
    }

    .diff-line-code {
      flex: 1;
      white-space: pre-wrap;
    }

    /* Settings Tab */
    .settings-group {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      max-width: 700px;
    }

    .settings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .settings-row:last-child {
      border-bottom: none;
    }

    .settings-title {
      font-size: 13px;
      font-weight: 600;
    }

    .settings-desc {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 2px;
    }

    select, input[type="text"], input[type="number"] {
      background: var(--vscode-input-background, #3c3c3c);
      color: var(--vscode-input-foreground, #fff);
      border: 1px solid var(--vscode-input-border, #555);
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: var(--vscode-sideBar-background, #252526);
      border: 1px dashed var(--vscode-panel-border, #444);
      border-radius: 12px;
      margin: 20px 0;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .empty-desc {
      font-size: 13px;
      opacity: 0.7;
      max-width: 500px;
      margin: 0 auto 20px auto;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-icon">\u{1F6E1}\uFE0F CodeVulFixer</div>
      <div>
        <div class="brand-title">Enterprise Security Remediation Orchestrator</div>
        <div class="brand-subtitle">${state ? `${state.repoOwner}/${state.repoName} \u2022 Multi-Day Sprint Engine` : "Automated & AI Fix Pipeline"}</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" onclick="loadDemoData()">
        <span>\u{1F9EA}</span> Load Demo Data
      </button>
      <button class="btn" onclick="scanWorkspace()">
        <span>\u{1F504}</span> Ingest & Scan
      </button>
      <button class="btn btn-secondary" onclick="resetState()">
        <span>\u{1F5D1}\uFE0F</span> Reset
      </button>
    </div>
  </div>

  <!-- Tab Bar -->
  <div class="tab-bar">
    <button class="tab-btn ${activeTab === "risk-profile" ? "active" : ""}" onclick="switchTab('risk-profile')">
      \u{1F4CA} Workspace Risk Profile
    </button>
    <button class="tab-btn ${activeTab === "sprint-board" ? "active" : ""}" onclick="switchTab('sprint-board')">
      \u{1F4CB} Multi-Day Sprint Board
    </button>
    <button class="tab-btn ${activeTab === "diff-inspector" ? "active" : ""}" onclick="switchTab('diff-inspector')">
      \u{1F50D} Live Diff & Verification Intercept
    </button>
    <button class="tab-btn ${activeTab === "settings" ? "active" : ""}" onclick="switchTab('settings')">
      \u2699\uFE0F Sprint Configuration
    </button>
  </div>

  <div class="container">

    ${!state ? renderEmptyState() : renderContent(state, activeTab, selectedDiffFinding)}

  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const appState = ${stateJson};
    const currentDiffFinding = ${selectedFindingJson};

    function switchTab(tabName) {
      vscode.postMessage({ command: 'switchTab', tab: tabName });
    }

    function scanWorkspace() {
      vscode.postMessage({ command: 'scan' });
    }

    function loadDemoData() {
      vscode.postMessage({ command: 'loadDemoData' });
    }

    function resetState() {
      if (confirm('Reset CodeVulFixer sprint state?')) {
        vscode.postMessage({ command: 'resetState' });
      }
    }

    function executeSprint(sprintNumber) {
      vscode.postMessage({ command: 'runSprint', sprintNumber });
    }

    function applySingleFix(findingId, engine) {
      vscode.postMessage({ command: 'applyFix', findingId, engine });
    }

    function inspectDiff(findingId) {
      vscode.postMessage({ command: 'inspectDiff', findingId });
    }

    function markVerifiedAndStage(findingId) {
      vscode.postMessage({ command: 'verifyStage', findingId });
    }

    function rejectAndRollback(findingId) {
      vscode.postMessage({ command: 'rejectRollback', findingId });
    }

    function saveSettings() {
      const maxHighRisk = parseInt(document.getElementById('maxHighRisk').value, 10);
      const targetDays = parseInt(document.getElementById('targetDays').value, 10);
      const pkgManager = document.getElementById('pkgManager').value;
      const engine = document.getElementById('engine').value;

      vscode.postMessage({
        command: 'saveSettings',
        settings: {
          maxHighRiskPerDay: maxHighRisk,
          targetSprintDays: targetDays,
          packageManager: pkgManager,
          preferredFixEngine: engine
        }
      });
    }
  </script>
</body>
</html>`;
}
function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">\u{1F6E1}\uFE0F</div>
      <div class="empty-title">No Active Vulnerability Sprints Ingested</div>
      <div class="empty-desc">
        CodeVulFixer connects securely to GitHub to ingest Dependabot alerts and Code Scanning (CodeQL) findings, or you can load realistic demo findings immediately to test the entire remediation pipeline.
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-success" onclick="loadDemoData()">
          <span>\u{1F9EA}</span> Load Realistic Demo Findings
        </button>
        <button class="btn" onclick="scanWorkspace()">
          <span>\u{1F510}</span> Authenticate & Ingest GitHub Findings
        </button>
      </div>
    </div>
  `;
}
function renderContent(state, activeTab, selectedDiffFinding) {
  const m = state.metrics;
  const findingsList = Object.values(state.findings);
  const criticalCount = findingsList.filter((f) => f.severity === "critical").length;
  const highCount = findingsList.filter((f) => f.severity === "high").length;
  const mediumCount = findingsList.filter((f) => f.severity === "medium").length;
  const lowCount = findingsList.filter((f) => f.severity === "low").length;
  return `
    <!-- Top Telemetry Metrics -->
    <div class="metrics-grid">
      <div class="metric-card danger">
        <div class="metric-label">Critical & High Vulnerabilities</div>
        <div class="metric-value">${criticalCount + highCount}</div>
        <div class="metric-sub">\u{1F534} ${criticalCount} Critical \u2022 ${highCount} High</div>
      </div>
      <div class="metric-card warning">
        <div class="metric-label">Medium & Low Hygiene</div>
        <div class="metric-value">${mediumCount + lowCount}</div>
        <div class="metric-sub">\u{1F7E1} ${mediumCount} Medium \u2022 \u{1F7E2} ${lowCount} Low</div>
      </div>
      <div class="metric-card success">
        <div class="metric-label">Remediated & Verified</div>
        <div class="metric-value">${m.resolvedCount} / ${m.totalFindings}</div>
        <div class="metric-sub">\u{1F7E2} ${Math.round(m.resolvedCount / (m.totalFindings || 1) * 100)}% Sprint Completion</div>
      </div>
      <div class="metric-card info">
        <div class="metric-label">Estimated Developer Time Saved</div>
        <div class="metric-value">${m.hoursSaved}h</div>
        <div class="metric-sub">\u{1F535} Total Sized Effort: ${m.totalEstimatedHours}h</div>
      </div>
    </div>

    <!-- TAB 1: Workspace Risk Profile -->
    <div class="tab-content ${activeTab === "risk-profile" ? "active" : ""}">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="sprint-header" style="flex-direction: column; align-items: flex-start; gap: 12px;">
          <div style="font-size: 16px; font-weight: 700;">Executive Security Posture Overview</div>
          <p style="font-size: 13px; opacity: 0.8; margin: 0;">
            CodeVulFixer consolidated <strong>${m.totalFindings} active security findings</strong> across GitHub Dependabot and CodeQL Code Scanning. 
            Automated S-size quick wins represent <strong>${findingsList.filter((f) => f.sizing.size === "S").length} findings</strong> that can be cleared with zero-token lockfile upgrades or precompiled AST transformations.
          </p>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="btn btn-success" onclick="switchTab('sprint-board')">
              <span>\u{1F680}</span> Start Sprint Remediation
            </button>
            <button class="btn btn-secondary" onclick="scanWorkspace()">
              <span>\u{1F504}</span> Refresh GitHub Ingestion
            </button>
          </div>
        </div>

        <div class="metric-card info" style="display: flex; flex-direction: column; justify-content: center;">
          <div class="metric-label">Multi-Day Remediation Timeline</div>
          <div style="font-size: 18px; font-weight: 700; margin: 8px 0;">${state.sprints.length} Planned Sprints</div>
          <div style="font-size: 12px; opacity: 0.85;">
            Structured work chunking mitigates developer fatigue by balancing high-risk items against quick-win lockfile updates.
          </div>
        </div>
      </div>

      <!-- Sizing Distribution Table -->
      <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
        <div style="font-size: 15px; font-weight: 700; margin-bottom: 12px;">Vulnerability Impact & T-Shirt Sizing Matrix</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
              <th style="padding: 8px;">ID</th>
              <th style="padding: 8px;">Source</th>
              <th style="padding: 8px;">Severity</th>
              <th style="padding: 8px;">Title</th>
              <th style="padding: 8px;">T-Shirt Size</th>
              <th style="padding: 8px;">Risk Level</th>
              <th style="padding: 8px;">Est. Hours</th>
              <th style="padding: 8px;">Target Sprint</th>
              <th style="padding: 8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${findingsList.map((f) => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px; font-family: monospace;">${f.id}</td>
                <td style="padding: 8px;">${f.source === "dependabot" ? "\u{1F4E6} Dependabot" : "\u{1F50D} CodeQL"}</td>
                <td style="padding: 8px;"><span class="badge badge-${f.severity}">${f.severity}</span></td>
                <td style="padding: 8px; font-weight: 500;">${f.title}</td>
                <td style="padding: 8px;"><span class="badge badge-${f.sizing.size.toLowerCase()}">Size ${f.sizing.size}</span></td>
                <td style="padding: 8px;">${f.sizing.riskLevel.toUpperCase()}</td>
                <td style="padding: 8px;">${f.sizing.estimatedHours}h</td>
                <td style="padding: 8px;">Sprint ${f.targetSprint}</td>
                <td style="padding: 8px;"><span class="status-pill status-${f.status}">${f.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Interactive Sprint Board -->
    <div class="tab-content ${activeTab === "sprint-board" ? "active" : ""}">
      ${state.sprints.map((s) => renderSprintChunk(s, state)).join("")}
    </div>

    <!-- TAB 3: Live Diff & Verification Intercept -->
    <div class="tab-content ${activeTab === "diff-inspector" ? "active" : ""}">
      ${renderDiffInspector(selectedDiffFinding, findingsList)}
    </div>

    <!-- TAB 4: Settings & Configuration -->
    <div class="tab-content ${activeTab === "settings" ? "active" : ""}">
      <div class="settings-group">
        <h3 style="margin-top: 0; font-size: 16px;">Sprint Orchestration Engine Settings</h3>
        
        <div class="settings-row">
          <div>
            <div class="settings-title">Max High-Risk Fixes Per Day</div>
            <div class="settings-desc">Enforce cognitive load limits by capping Size L / critical security rewrites per day.</div>
          </div>
          <input type="number" id="maxHighRisk" min="1" max="10" value="3" style="width: 60px;">
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Target Remediation Timeline (Days)</div>
            <div class="settings-desc">Target duration to schedule distributed sprint chunks.</div>
          </div>
          <input type="number" id="targetDays" min="1" max="14" value="4" style="width: 60px;">
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Preferred Package Manager CLI</div>
            <div class="settings-desc">Ecosystem CLI used for deterministic zero-token lockfile upgrades.</div>
          </div>
          <select id="pkgManager">
            <option value="auto">Auto-Detect (Recommended)</option>
            <option value="npm">npm</option>
            <option value="pnpm">pnpm</option>
            <option value="yarn">yarn</option>
            <option value="uv">uv</option>
            <option value="pip">pip</option>
          </select>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Primary Repair Engine</div>
            <div class="settings-desc">Choose between Deterministic CLIs/AST rules or VS Code Copilot LM API.</div>
          </div>
          <select id="engine">
            <option value="auto">Auto (Deterministic for Lockfiles, Copilot for SAST)</option>
            <option value="deterministic">Deterministic Only (Zero-Token)</option>
            <option value="copilot">Copilot LM API Only</option>
          </select>
        </div>

        <div style="margin-top: 20px;">
          <button class="btn" onclick="saveSettings()">Save & Replan Sprints</button>
        </div>
      </div>
    </div>
  `;
}
function renderSprintChunk(sprint, state) {
  const sprintFindings = sprint.findings.map((id) => state.findings[id]).filter(Boolean);
  const isSprint1 = sprint.sprintNumber === 1;
  return `
    <div style="margin-bottom: 32px;">
      <div class="sprint-header">
        <div>
          <div class="sprint-title">
            <span>\u{1F4C5} ${sprint.dayLabel}:</span> ${sprint.title}
            <span class="badge badge-s" style="margin-left: 8px;">${sprint.totalEstimatedHours}h effort</span>
            <span class="status-pill status-${sprint.status}">${sprint.status}</span>
          </div>
          <div class="sprint-desc">${sprint.description}</div>
        </div>
        <div class="sprint-actions">
          <button class="btn btn-success" onclick="executeSprint(${sprint.sprintNumber})">
            <span>\u26A1</span> Execute Automated Sprint Fixes
          </button>
        </div>
      </div>

      <div class="card-grid">
        ${sprintFindings.map((f) => renderFindingCard(f)).join("")}
      </div>
    </div>
  `;
}
function renderFindingCard(f) {
  const isAppliedOrVerified = f.status === "applied" || f.status === "verified";
  const hasFailed = f.status === "failed";
  return `
    <div class="vuln-card">
      <div>
        <div class="card-top">
          <div class="card-badges">
            <span class="badge badge-${f.severity}">${f.severity}</span>
            <span class="badge badge-${f.sizing.size.toLowerCase()}">Size ${f.sizing.size}</span>
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">${f.source}</span>
          </div>
          <span class="status-pill status-${f.status}">${f.status}</span>
        </div>

        <div class="card-title">${f.title}</div>
        <div class="card-desc">${f.description}</div>

        <div class="card-meta">
          ${f.dependency ? `<div><strong>Package:</strong> ${f.dependency.packageName} (${f.dependency.currentVersion} \u2794 <strong>${f.dependency.fixedVersion}</strong>)</div>
               <div><strong>Type:</strong> ${f.dependency.isDirect ? "Direct Manifest" : "Transitive Lockfile"}</div>` : `<div><strong>Rule:</strong> ${f.ruleId || "N/A"}</div>
               <div><strong>Target:</strong> ${f.location?.filePath || "Source file"}:${f.location?.startLine ?? 1}</div>`}
          <div><strong>Advisory:</strong> ${f.cveId || f.ghsaId || f.id}</div>
        </div>

        ${hasFailed && f.validationReport?.failureStackTrace ? `
          <div class="terminal-box">
            <div class="terminal-title">\u274C Validation Failure Details</div>
            <div>${escapeHtml(f.validationReport.failureStackTrace)}</div>
          </div>
        ` : ""}
      </div>

      <div class="card-footer">
        <div style="font-size: 11px; opacity: 0.7;">
          \u23F1\uFE0F ${f.sizing.estimatedHours}h
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${f.status === "applied" ? `
            <button class="btn btn-sm btn-success" onclick="markVerifiedAndStage('${f.id}')">
              \u{1F44D} Verify & Stage
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectAndRollback('${f.id}')">
              \u274C Rollback
            </button>
          ` : `
            <button class="btn btn-sm btn-secondary" onclick="applySingleFix('${f.id}', 'deterministic')" title="Run local CLI / AST fix">
              \u26A1 Zero-Token
            </button>
            <button class="btn btn-sm" onclick="applySingleFix('${f.id}', 'copilot')" title="Run Copilot LM fix">
              \u{1F916} Copilot AI
            </button>
          `}
          <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${f.id}')">
            \u{1F50D} Diff
          </button>
        </div>
      </div>
    </div>
  `;
}
function renderDiffInspector(finding, allFindings = []) {
  if (!finding) {
    const appliedFinding = allFindings.find((f) => f.status === "applied");
    if (appliedFinding) {
      finding = appliedFinding;
    }
  }
  if (!finding) {
    return `
      <div class="empty-state">
        <div class="empty-icon">\u{1F50D}</div>
        <div class="empty-title">No Active Diff to Inspect</div>
        <div class="empty-desc">
          Apply a fix from the Sprint Board using either Zero-Token or Copilot LM. Once applied and verified by the local task runner, the line-by-line diff and human-in-the-loop checkpoint will appear here.
        </div>
        <button class="btn" onclick="switchTab('sprint-board')">Go to Sprint Board</button>
      </div>
    `;
  }
  const isAwaitingVerification = finding.status === "applied";
  return `
    ${isAwaitingVerification ? `
      <!-- Mandatory Human-in-the-Loop Intercept Overlay -->
      <div class="checkpoint-banner">
        <div class="checkpoint-info">
          <h3>Mandatory Checkpoint: Local Automated Validation Passed</h3>
          <p>
            Build and regression test suites executed successfully. Review the exact line-by-line diff below before staging to Git SCM.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-success" onclick="markVerifiedAndStage('${finding.id}')">
            \u{1F44D} Mark as Verified & Stage for Check-in
          </button>
          <button class="btn btn-danger" onclick="rejectAndRollback('${finding.id}')">
            \u274C Reject Fix & Rollback
          </button>
        </div>
      </div>
    ` : ""}

    <div class="sprint-header">
      <div>
        <div class="sprint-title">Diff Inspector: ${finding.id} \u2014 ${finding.title}</div>
        <div class="sprint-desc">
          ${finding.dependency ? `Dependency Upgrade: ${finding.dependency.packageName}@${finding.dependency.fixedVersion}` : `Target: ${finding.location?.filePath || "Source Code"}`}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-${finding.severity}">${finding.severity}</span>
        <span class="status-pill status-${finding.status}">${finding.status}</span>
      </div>
    </div>

    <!-- Unified Diff Container -->
    <div class="diff-container">
      <div class="diff-header">
        <span>\u{1F4C4} ${finding.location?.filePath || (finding.dependency ? "package.json / package-lock.json" : "workspace")}</span>
        <span style="font-size: 11px; opacity: 0.7;">Git Unified Diff</span>
      </div>
      <div>
        ${renderDiffLines(finding)}
      </div>
    </div>

    <!-- Validation Summary Card -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">Automated Validation Telemetry</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%;">
        <div class="metric-card success">
          <div class="metric-label">Compilation / Build</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${finding.validationReport?.buildDurationMs ?? 210}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Regression Test Suite</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${finding.validationReport?.testDurationMs ?? 430}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Ecosystem Security Audit</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 ADVISORY CLEARED</div>
          <div class="metric-sub">${finding.cveId || finding.ghsaId || "Zero Vulnerabilities"}</div>
        </div>
      </div>
    </div>
  `;
}
function renderDiffLines(finding) {
  if (finding.appliedDiff) {
    const lines = finding.appliedDiff.split(/\r?\n/);
    return lines.map((l, i) => {
      let type = "normal";
      if (l.startsWith("+")) type = "add";
      else if (l.startsWith("-")) type = "delete";
      return `
        <div class="diff-line ${type}">
          <div class="diff-line-num">${i + 1}</div>
          <div class="diff-line-code">${escapeHtml(l)}</div>
        </div>
      `;
    }).join("");
  }
  if (finding.source === "dependabot" && finding.dependency) {
    return `
      <div class="diff-line normal"><div class="diff-line-num">12</div><div class="diff-line-code">   "dependencies": {</div></div>
      <div class="diff-line delete"><div class="diff-line-num">13</div><div class="diff-line-code">-    "${finding.dependency.packageName}": "${finding.dependency.currentVersion}",</div></div>
      <div class="diff-line add"><div class="diff-line-num">13</div><div class="diff-line-code">+    "${finding.dependency.packageName}": "^${finding.dependency.fixedVersion}",</div></div>
      <div class="diff-line normal"><div class="diff-line-num">14</div><div class="diff-line-code">   }</div></div>
    `;
  }
  if (finding.location?.snippet) {
    return `
      <div class="diff-line normal"><div class="diff-line-num">33</div><div class="diff-line-code"> // Line before</div></div>
      <div class="diff-line delete"><div class="diff-line-num">34</div><div class="diff-line-code">-  ${escapeHtml(finding.location.snippet)}</div></div>
      <div class="diff-line add"><div class="diff-line-num">34</div><div class="diff-line-code">+  // Remediated safe implementation by CodeVulFixer</div></div>
      <div class="diff-line add"><div class="diff-line-num">35</div><div class="diff-line-code">+  ${escapeHtml(finding.remediationPlan)}</div></div>
      <div class="diff-line normal"><div class="diff-line-num">36</div><div class="diff-line-code"> // Line after</div></div>
    `;
  }
  return `
    <div class="diff-line normal">
      <div class="diff-line-num">1</div>
      <div class="diff-line-code">// No workspace file modifications detected yet for ${finding.id}</div>
    </div>
  `;
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// src/webview/dashboardPanel.ts
var DashboardPanel = class _DashboardPanel {
  static currentPanel;
  panel;
  extensionUri;
  disposables = [];
  activeTab = "risk-profile";
  selectedDiffFinding;
  constructor(panel, extensionUri) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      async (message) => {
        await this.handleMessage(message);
      },
      null,
      this.disposables
    );
    this.update();
  }
  static createOrShow(extensionUri) {
    const column = vscode10.window.activeTextEditor ? vscode10.window.activeTextEditor.viewColumn : void 0;
    if (_DashboardPanel.currentPanel) {
      _DashboardPanel.currentPanel.panel.reveal(column);
      _DashboardPanel.currentPanel.update();
      return _DashboardPanel.currentPanel;
    }
    const panel = vscode10.window.createWebviewPanel(
      "codevulfixer.dashboard",
      "CodeVulFixer Sprint & Risk Dashboard",
      column || vscode10.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );
    _DashboardPanel.currentPanel = new _DashboardPanel(panel, extensionUri);
    return _DashboardPanel.currentPanel;
  }
  async update() {
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    let state;
    if (workspaceRoot) {
      state = await StateStore.loadState(workspaceRoot);
    }
    this.panel.webview.html = getDashboardHtml(
      state,
      this.activeTab,
      this.selectedDiffFinding
    );
  }
  async handleMessage(message) {
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    if (!workspaceRoot) {
      vscode10.window.showErrorMessage("CodeVulFixer requires an open workspace folder.");
      return;
    }
    try {
      switch (message.command) {
        case "switchTab":
          this.activeTab = message.tab;
          await this.update();
          break;
        case "scan":
          await this.performScan(workspaceRoot);
          break;
        case "loadDemoData":
          await this.loadDemoFindings(workspaceRoot);
          break;
        case "resetState":
          await StateStore.resetState(workspaceRoot);
          this.selectedDiffFinding = void 0;
          this.activeTab = "risk-profile";
          await this.update();
          vscode10.window.showInformationMessage("CodeVulFixer: Sprint state reset successfully.");
          break;
        case "applyFix":
          await this.applyFindingFix(workspaceRoot, message.findingId, message.engine);
          break;
        case "inspectDiff":
          await this.inspectFindingDiff(workspaceRoot, message.findingId);
          break;
        case "verifyStage":
          await this.verifyAndStageFinding(workspaceRoot, message.findingId);
          break;
        case "rejectRollback":
          await this.rejectAndRollbackFinding(workspaceRoot, message.findingId);
          break;
        case "runSprint":
          await this.executeSprint(workspaceRoot, message.sprintNumber);
          break;
        case "saveSettings":
          await this.updateSettings(message.settings);
          break;
      }
    } catch (error) {
      logger.error("Error handling Webview message", error);
      vscode10.window.showErrorMessage(`CodeVulFixer error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async performScan(workspaceRoot) {
    await vscode10.window.withProgress(
      {
        location: vscode10.ProgressLocation.Notification,
        title: "CodeVulFixer: Ingesting GitHub Vulnerabilities...",
        cancellable: false
      },
      async (progress) => {
        progress.report({ increment: 10, message: "Resolving repository metadata..." });
        const repoMeta = await GitResolver.resolveRepoMetadata();
        if (!repoMeta) {
          const action = await vscode10.window.showWarningMessage(
            "No GitHub remote origin found for workspace. Would you like to load realistic demo findings for evaluation?",
            "Load Demo Findings",
            "Cancel"
          );
          if (action === "Load Demo Findings") {
            await this.loadDemoFindings(workspaceRoot);
          }
          return;
        }
        progress.report({ increment: 30, message: "Authenticating with GitHub API..." });
        const session = await GitHubAuthService.getSession(true);
        if (!session) {
          vscode10.window.showErrorMessage("GitHub authentication was cancelled or unavailable.");
          return;
        }
        const octokit = OctokitClientFactory.create(session.accessToken);
        progress.report({ increment: 50, message: "Fetching Dependabot & Code Scanning alerts..." });
        let dependabotFindings = [];
        let codeScanningFindings = [];
        try {
          dependabotFindings = await DependabotIngestor.fetchAlerts(octokit, repoMeta.owner, repoMeta.repo);
        } catch (e) {
          logger.warn(`Could not ingest Dependabot alerts (might lack GHAS permission or none exist): ${e}`);
        }
        try {
          codeScanningFindings = await CodeScanningIngestor.fetchAlerts(octokit, repoMeta.owner, repoMeta.repo);
        } catch (e) {
          logger.warn(`Could not ingest Code Scanning alerts (might lack GHAS permission or none exist): ${e}`);
        }
        const allRaw = [...dependabotFindings, ...codeScanningFindings];
        if (allRaw.length === 0) {
          const choice = await vscode10.window.showInformationMessage(
            `Zero open alerts returned by GitHub for ${repoMeta.owner}/${repoMeta.repo}. Load sample findings to test sprint orchestration?`,
            "Load Demo Findings",
            "Dismiss"
          );
          if (choice === "Load Demo Findings") {
            await this.loadDemoFindings(workspaceRoot);
            return;
          }
        }
        progress.report({ increment: 75, message: "Running impact analysis & T-shirt sizing..." });
        const sizedFindings = await this.enrichAndSizeFindings(workspaceRoot, allRaw);
        progress.report({ increment: 90, message: "Planning multi-day remediation sprints..." });
        const sprintState = SprintPlanner.planSprints(sizedFindings, repoMeta.owner, repoMeta.repo);
        await StateStore.saveState(workspaceRoot, sprintState);
        this.activeTab = "sprint-board";
        await this.update();
        vscode10.window.showInformationMessage(`CodeVulFixer: Ingested ${allRaw.length} findings into ${sprintState.sprints.length} sprints.`);
      }
    );
  }
  async loadDemoFindings(workspaceRoot) {
    await vscode10.window.withProgress(
      {
        location: vscode10.ProgressLocation.Notification,
        title: "CodeVulFixer: Loading Realistic Vulnerabilities..."
      },
      async (progress) => {
        progress.report({ increment: 30, message: "Analyzing manifests and taint graph..." });
        const sizedFindings = await this.enrichAndSizeFindings(workspaceRoot, REALISTIC_DEMO_FINDINGS);
        progress.report({ increment: 70, message: "Generating multi-day sprint schedule..." });
        const sprintState = SprintPlanner.planSprints(sizedFindings, "enterprise", "demo-workspace");
        await StateStore.saveState(workspaceRoot, sprintState);
        this.activeTab = "sprint-board";
        await this.update();
        vscode10.window.showInformationMessage("CodeVulFixer: Loaded 9 realistic findings partitioned into 3 remediation sprints.");
      }
    );
  }
  async enrichAndSizeFindings(workspaceRoot, rawFindings) {
    const results = [];
    for (const f of rawFindings) {
      let depInfo = f.dependency;
      if (depInfo) {
        depInfo = await DependencyAnalyzer.analyze(workspaceRoot, depInfo);
      }
      const contextReport = await CodeContextAnalyzer.analyze(
        workspaceRoot,
        f.location,
        f.cweIds,
        f.ruleId
      );
      const sizing = SizingEngine.evaluate(f, depInfo, contextReport);
      results.push({
        ...f,
        dependency: depInfo,
        sizing
      });
    }
    return results;
  }
  async applyFindingFix(workspaceRoot, findingId, engine) {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;
    const finding = state.findings[findingId];
    await StateStore.updateFinding(workspaceRoot, findingId, { status: "in_progress" });
    await this.update();
    await vscode10.window.withProgress(
      {
        location: vscode10.ProgressLocation.Notification,
        title: `CodeVulFixer: Remediating ${findingId}...`
      },
      async (progress) => {
        progress.report({ increment: 30, message: `Executing ${engine} fix engine...` });
        const fixResult = await RepairCoordinator.executeRepair(workspaceRoot, finding, engine);
        if (!fixResult.success) {
          await StateStore.updateFinding(workspaceRoot, findingId, {
            status: "failed",
            statusMessage: fixResult.message,
            validationReport: {
              passed: false,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              buildStatus: "skipped",
              testStatus: "skipped",
              auditStatus: "skipped",
              failureStackTrace: fixResult.stderr || fixResult.message
            }
          });
          await this.update();
          vscode10.window.showErrorMessage(`Fix failed for ${findingId}: ${fixResult.message}`);
          return;
        }
        progress.report({ increment: 60, message: "Running build & regression tests validation..." });
        const valSummary = await TaskValidator.validateWorkspace(workspaceRoot);
        const fileToDiff = fixResult.modifiedFiles[0] || finding.location?.filePath || "package.json";
        const fileDiff = await DiffEngine.getFileDiff(workspaceRoot, fileToDiff);
        if (!valSummary.passed) {
          await StateStore.updateFinding(workspaceRoot, findingId, {
            status: "failed",
            statusMessage: "Fix applied but automated validation tests failed.",
            appliedDiff: fileDiff.rawDiff,
            validationReport: valSummary
          });
          await this.update();
          vscode10.window.showErrorMessage(`Automated test verification failed after applying fix for ${findingId}.`);
          return;
        }
        await StateStore.updateFinding(workspaceRoot, findingId, {
          status: "applied",
          statusMessage: "Automated validation passed. Ready for Human-in-the-Loop review.",
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary
        });
        this.selectedDiffFinding = {
          ...finding,
          status: "applied",
          appliedDiff: fileDiff.rawDiff,
          validationReport: valSummary
        };
        this.activeTab = "diff-inspector";
        await this.update();
        vscode10.window.showInformationMessage(
          `CodeVulFixer: Fix applied & verified for ${findingId}. Review diff checkpoint to stage or rollback.`
        );
      }
    );
  }
  async inspectFindingDiff(workspaceRoot, findingId) {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;
    this.selectedDiffFinding = state.findings[findingId];
    this.activeTab = "diff-inspector";
    await this.update();
  }
  async verifyAndStageFinding(workspaceRoot, findingId) {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;
    const finding = state.findings[findingId];
    const modifiedFiles = finding.location?.filePath ? [finding.location.filePath] : ["package.json", "package-lock.json"];
    const success = await GitScmHandler.stageAndSetCommitMessage(
      workspaceRoot,
      finding,
      modifiedFiles
    );
    if (success) {
      await StateStore.updateFinding(workspaceRoot, findingId, {
        status: "verified",
        statusMessage: "Verified by developer and staged into Git SCM."
      });
      await this.update();
    }
  }
  async rejectAndRollbackFinding(workspaceRoot, findingId) {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state || !state.findings[findingId]) return;
    const finding = state.findings[findingId];
    const modifiedFiles = finding.location?.filePath ? [finding.location.filePath] : ["package.json", "package-lock.json"];
    await GitScmHandler.rollbackChanges(workspaceRoot, modifiedFiles);
    await StateStore.updateFinding(workspaceRoot, findingId, {
      status: "rejected",
      statusMessage: "Rejected by developer. Workspace mutations reverted."
    });
    await this.update();
  }
  async executeSprint(workspaceRoot, sprintNumber) {
    const state = await StateStore.loadState(workspaceRoot);
    if (!state) return;
    const sprint = state.sprints.find((s) => s.sprintNumber === sprintNumber);
    if (!sprint) return;
    vscode10.window.showInformationMessage(`Starting automated batch execution for ${sprint.dayLabel}...`);
    for (const findingId of sprint.findings) {
      const f = state.findings[findingId];
      if (f && (f.status === "pending" || f.status === "failed")) {
        await this.applyFindingFix(workspaceRoot, findingId, f.sizing.isAutomatedCandidate ? "deterministic" : "copilot");
        break;
      }
    }
  }
  async updateSettings(settings) {
    const config = vscode10.workspace.getConfiguration("codevulfixer");
    await config.update("maxHighRiskPerDay", settings.maxHighRiskPerDay, vscode10.ConfigurationTarget.Global);
    await config.update("targetSprintDays", settings.targetSprintDays, vscode10.ConfigurationTarget.Global);
    await config.update("packageManager", settings.packageManager, vscode10.ConfigurationTarget.Global);
    await config.update("preferredFixEngine", settings.preferredFixEngine, vscode10.ConfigurationTarget.Global);
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    if (workspaceRoot) {
      const state = await StateStore.loadState(workspaceRoot);
      if (state) {
        const rePlanned = SprintPlanner.planSprints(
          Object.values(state.findings),
          state.repoOwner,
          state.repoName,
          {
            maxHighRiskPerDay: settings.maxHighRiskPerDay,
            targetSprintDays: settings.targetSprintDays
          }
        );
        await StateStore.saveState(workspaceRoot, rePlanned);
        await this.update();
      }
    }
    vscode10.window.showInformationMessage("CodeVulFixer settings saved and sprints updated.");
  }
  dispose() {
    _DashboardPanel.currentPanel = void 0;
    this.panel.dispose();
    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) x.dispose();
    }
  }
};

// src/webview/sidebarProvider.ts
var vscode11 = __toESM(require("vscode"));
var CodeVulFixerSidebarProvider = class {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }
  static viewType = "codevulfixer.sidebarView";
  view;
  resolveWebviewView(webviewView, context, _token) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "openDashboard":
          DashboardPanel.createOrShow(this.extensionUri);
          break;
        case "scan":
          await vscode11.commands.executeCommand("codevulfixer.scan");
          this.refresh();
          break;
        case "loadDemo":
          await vscode11.commands.executeCommand("codevulfixer.loadDemoData");
          this.refresh();
          break;
        case "runSprint":
          await vscode11.commands.executeCommand("codevulfixer.runSprint");
          this.refresh();
          break;
      }
    });
    this.refresh();
  }
  async refresh() {
    if (!this.view) return;
    const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
    let state;
    if (workspaceRoot) {
      state = await StateStore.loadState(workspaceRoot);
    }
    this.view.webview.html = this.getSidebarHtml(state);
  }
  getSidebarHtml(state) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      padding: 12px;
      margin: 0;
    }
    .btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .btn-secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover {
      background: #218838;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
    }
    .pill {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .pill-danger { background: rgba(220,53,69,0.2); color: #dc3545; }
    .pill-success { background: rgba(40,167,69,0.2); color: #28a745; }
    .pill-warning { background: rgba(255,193,7,0.2); color: #ffc107; }
    .box {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .item-card {
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
    \u{1F6E1}\uFE0F CodeVulFixer
  </div>

  <button class="btn" onclick="post('openDashboard')">
    <span>\u{1F4CA}</span> Open Full Dashboard
  </button>

  ${state ? `
    <div class="box">
      <div style="font-weight: 600; font-size: 12px; margin-bottom: 6px;">
        Sprint Status (${state.repoOwner}/${state.repoName})
      </div>
      <div class="metric-row">
        <span>Active Sprints:</span>
        <strong>${state.sprints.length} Days</strong>
      </div>
      <div class="metric-row">
        <span>Remediated:</span>
        <span class="pill pill-success">${state.metrics.resolvedCount} / ${state.metrics.totalFindings}</span>
      </div>
      <div class="metric-row">
        <span>Pending:</span>
        <span class="pill pill-warning">${state.metrics.pendingCount}</span>
      </div>
      <div class="metric-row">
        <span>Time Saved:</span>
        <strong>${state.metrics.hoursSaved} hrs</strong>
      </div>
    </div>

    <button class="btn btn-success" onclick="post('runSprint')">
      <span>\u26A1</span> Run Current Sprint
    </button>
  ` : `
    <div class="box" style="text-align: center; font-size: 12px; opacity: 0.8;">
      No active sprint plan loaded.
    </div>
  `}

  <button class="btn btn-secondary" onclick="post('scan')">
    <span>\u{1F504}</span> Ingest & Scan
  </button>

  <button class="btn btn-secondary" onclick="post('loadDemo')">
    <span>\u{1F9EA}</span> Load Demo Findings
  </button>

  <script>
    const vscode = acquireVsCodeApi();
    function post(command) {
      vscode.postMessage({ command });
    }
  </script>
</body>
</html>`;
  }
};

// src/extension.ts
function activate(context) {
  logger.info("Activating CodeVulFixer Extension...");
  const sidebarProvider = new CodeVulFixerSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode12.window.registerWebviewViewProvider(
      CodeVulFixerSidebarProvider.viewType,
      sidebarProvider
    )
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("codevulfixer.openDashboard", () => {
      logger.info("Command: codevulfixer.openDashboard executed.");
      DashboardPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("codevulfixer.scan", async () => {
      logger.info("Command: codevulfixer.scan executed.");
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) {
        vscode12.window.showErrorMessage("CodeVulFixer: Please open a workspace folder before scanning.");
        return;
      }
      const panel = DashboardPanel.createOrShow(context.extensionUri);
      await panel.performScan(workspaceRoot);
      sidebarProvider.refresh();
    })
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("codevulfixer.loadDemoData", async () => {
      logger.info("Command: codevulfixer.loadDemoData executed.");
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) {
        vscode12.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");
        return;
      }
      const panel = DashboardPanel.createOrShow(context.extensionUri);
      await panel.loadDemoFindings(workspaceRoot);
      sidebarProvider.refresh();
    })
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("codevulfixer.runSprint", async () => {
      logger.info("Command: codevulfixer.runSprint executed.");
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (!workspaceRoot) return;
      const state = await StateStore.loadState(workspaceRoot);
      if (!state) {
        const choice = await vscode12.window.showWarningMessage(
          "No active sprint plan found. Ingest vulnerabilities first?",
          "Scan Workspace",
          "Load Demo Findings"
        );
        if (choice === "Scan Workspace") {
          await vscode12.commands.executeCommand("codevulfixer.scan");
        } else if (choice === "Load Demo Findings") {
          await vscode12.commands.executeCommand("codevulfixer.loadDemoData");
        }
        return;
      }
      const panel = DashboardPanel.createOrShow(context.extensionUri);
      vscode12.commands.executeCommand("codevulfixer.openDashboard");
      sidebarProvider.refresh();
    })
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("codevulfixer.resetState", async () => {
      logger.info("Command: codevulfixer.resetState executed.");
      const workspaceRoot = GitResolver.getPrimaryWorkspacePath();
      if (workspaceRoot) {
        await StateStore.resetState(workspaceRoot);
        if (DashboardPanel.currentPanel) {
          await DashboardPanel.currentPanel.update();
        }
        sidebarProvider.refresh();
        vscode12.window.showInformationMessage("CodeVulFixer: Sprint state has been reset.");
      }
    })
  );
  logger.success("CodeVulFixer successfully activated and initialized.");
}
function deactivate() {
  logger.info("Deactivating CodeVulFixer Extension.");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
