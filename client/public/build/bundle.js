
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const token = writable("");
    const loggedUser = writable("");
    const loggedId = writable("");
    const target = writable("");

    /* src/Menu.svelte generated by Svelte v3.44.2 */
    const file$4 = "src/Menu.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (39:24) {#each menu as item}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t_value = /*item*/ ctx[4].name + "";
    	let t;
    	let a_href_value;
    	let li_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[4].path);
    			add_location(a, file$4, 40, 32, 1429);

    			attr_dev(li, "class", li_class_value = /*item*/ ctx[4].name == /*title*/ ctx[1]
    			? "bordered"
    			: "");

    			add_location(li, file$4, 39, 28, 1346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*item*/ ctx[4].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*menu*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[4].path)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*menu, title*/ 3 && li_class_value !== (li_class_value = /*item*/ ctx[4].name == /*title*/ ctx[1]
    			? "bordered"
    			: "")) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(39:24) {#each menu as item}",
    		ctx
    	});

    	return block;
    }

    // (45:24) {#if $token != ""}
    function create_if_block_1$1(ctx) {
    	let li;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Esci";
    			attr_dev(a, "href", "/");
    			add_location(a, file$4, 46, 32, 1646);
    			add_location(li, file$4, 45, 28, 1608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*logout*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(45:24) {#if $token != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#each menu as item}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t_value = /*item*/ ctx[4].name + "";
    	let t;
    	let a_href_value;
    	let a_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[4].path);

    			attr_dev(a, "class", a_class_value = "block text-sm px-2 py-4 text-white font-semibold " + (/*item*/ ctx[4].name == /*title*/ ctx[1]
    			? "bg-black"
    			: "bg-green-500"));

    			add_location(a, file$4, 81, 20, 2951);
    			attr_dev(li, "class", "active");
    			add_location(li, file$4, 80, 16, 2910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*item*/ ctx[4].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*menu*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[4].path)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*menu, title*/ 3 && a_class_value !== (a_class_value = "block text-sm px-2 py-4 text-white font-semibold " + (/*item*/ ctx[4].name == /*title*/ ctx[1]
    			? "bg-black"
    			: "bg-green-500"))) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(80:12) {#each menu as item}",
    		ctx
    	});

    	return block;
    }

    // (90:12) {#if $token != ""}
    function create_if_block$3(ctx) {
    	let li;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Esci";
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "block text-sm px-2 py-4 text-white font-semibold bg-green-500");
    			add_location(a, file$4, 91, 20, 3361);
    			attr_dev(li, "class", "active");
    			add_location(li, file$4, 90, 16, 3320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*logout*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(90:12) {#if $token != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let nav;
    	let div5;
    	let div4;
    	let div2;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let ul0;
    	let t1;
    	let t2;
    	let div3;
    	let button;
    	let svg;
    	let path;
    	let t3;
    	let div6;
    	let ul1;
    	let t4;
    	let each_value_1 = /*menu*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*$token*/ ctx[2] != "" && create_if_block_1$1(ctx);
    	let each_value = /*menu*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block1 = /*$token*/ ctx[2] != "" && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div3 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t3 = space();
    			div6 = element("div");
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block1) if_block1.c();
    			if (!src_url_equal(img.src, img_src_value = "/logonuvolaris.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "class", "h-8 w-auto mr-2");
    			add_location(img, file$4, 26, 24, 800);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "flex items-center py-4 px-2");
    			add_location(a, file$4, 25, 20, 726);
    			add_location(div0, file$4, 23, 16, 656);
    			attr_dev(ul0, "class", "menu items-stretch px-3 shadow-lg bg-base-100 horizontal rounded-box");
    			add_location(ul0, file$4, 35, 20, 1142);
    			attr_dev(div1, "class", "hidden md:flex items-center space-x-1");
    			add_location(div1, file$4, 34, 16, 1069);
    			attr_dev(div2, "class", "flex space-x-7");
    			add_location(div2, file$4, 22, 12, 610);
    			attr_dev(path, "d", "M4 6h16M4 12h16M4 18h16");
    			add_location(path, file$4, 70, 24, 2632);
    			attr_dev(svg, "class", "w-6 h-6 text-gray-500 hover:text-green-500 ");
    			attr_dev(svg, "x-show", "!showMenu");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$4, 60, 20, 2189);
    			attr_dev(button, "class", "outline-none mobile-menu-button");
    			add_location(button, file$4, 59, 16, 2119);
    			attr_dev(div3, "class", "md:hidden flex items-center");
    			add_location(div3, file$4, 58, 12, 2060);
    			attr_dev(div4, "class", "flex justify-between");
    			add_location(div4, file$4, 21, 8, 562);
    			attr_dev(div5, "class", "max-w-6xl mx-auto px-4");
    			add_location(div5, file$4, 20, 4, 516);
    			attr_dev(ul1, "class", "");
    			add_location(ul1, file$4, 78, 8, 2845);
    			attr_dev(div6, "class", "hidden mobile-menu");
    			add_location(div6, file$4, 77, 4, 2803);
    			attr_dev(nav, "class", "bg-white shadow-lg");
    			add_location(nav, file$4, 19, 0, 478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(ul0, t1);
    			if (if_block0) if_block0.m(ul0, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(nav, t3);
    			append_dev(nav, div6);
    			append_dev(div6, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			append_dev(ul1, t4);
    			if (if_block1) if_block1.m(ul1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menu, title*/ 3) {
    				each_value_1 = /*menu*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, t1);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (/*$token*/ ctx[2] != "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(ul0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*menu, title*/ 3) {
    				each_value = /*menu*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$token*/ ctx[2] != "") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(ul1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks_1, detaching);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $token;
    	validate_store(token, 'token');
    	component_subscribe($$self, token, $$value => $$invalidate(2, $token = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { menu } = $$props;
    	let { title } = $$props;

    	onMount(() => {
    		const btn = document.querySelector("button.mobile-menu-button");
    		const menu = document.querySelector(".mobile-menu");

    		btn.addEventListener("click", () => {
    			menu.classList.toggle("hidden");
    		});
    	});

    	function logout() {
    		token.set("");
    	}

    	const writable_props = ['menu', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		menu,
    		title,
    		onMount,
    		logout,
    		token,
    		$token
    	});

    	$$self.$inject_state = $$props => {
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menu, title, $token, logout];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { menu: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menu*/ ctx[0] === undefined && !('menu' in props)) {
    			console.warn("<Menu> was created without expected prop 'menu'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Menu> was created without expected prop 'title'");
    		}
    	}

    	get menu() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * validate.js 0.13.1
     *
     * (c) 2013-2019 Nicklas Ansman, 2013 Wrapp
     * Validate.js may be freely distributed under the MIT license.
     * For all details and documentation:
     * http://validatejs.org/
     */

    var validate = createCommonjsModule(function (module, exports) {
    (function(exports, module, define) {

      // The main function that calls the validators specified by the constraints.
      // The options are the following:
      //   - format (string) - An option that controls how the returned value is formatted
      //     * flat - Returns a flat array of just the error messages
      //     * grouped - Returns the messages grouped by attribute (default)
      //     * detailed - Returns an array of the raw validation data
      //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
      //
      // Please note that the options are also passed to each validator.
      var validate = function(attributes, constraints, options) {
        options = v.extend({}, v.options, options);

        var results = v.runValidations(attributes, constraints, options)
          ;

        if (results.some(function(r) { return v.isPromise(r.error); })) {
          throw new Error("Use validate.async if you want support for promises");
        }
        return validate.processValidationResults(results, options);
      };

      var v = validate;

      // Copies over attributes from one or more sources to a single destination.
      // Very much similar to underscore's extend.
      // The first argument is the target object and the remaining arguments will be
      // used as sources.
      v.extend = function(obj) {
        [].slice.call(arguments, 1).forEach(function(source) {
          for (var attr in source) {
            obj[attr] = source[attr];
          }
        });
        return obj;
      };

      v.extend(validate, {
        // This is the version of the library as a semver.
        // The toString function will allow it to be coerced into a string
        version: {
          major: 0,
          minor: 13,
          patch: 1,
          metadata: null,
          toString: function() {
            var version = v.format("%{major}.%{minor}.%{patch}", v.version);
            if (!v.isEmpty(v.version.metadata)) {
              version += "+" + v.version.metadata;
            }
            return version;
          }
        },

        // Below is the dependencies that are used in validate.js

        // The constructor of the Promise implementation.
        // If you are using Q.js, RSVP or any other A+ compatible implementation
        // override this attribute to be the constructor of that promise.
        // Since jQuery promises aren't A+ compatible they won't work.
        Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

        EMPTY_STRING_REGEXP: /^\s*$/,

        // Runs the validators specified by the constraints object.
        // Will return an array of the format:
        //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
        runValidations: function(attributes, constraints, options) {
          var results = []
            , attr
            , validatorName
            , value
            , validators
            , validator
            , validatorOptions
            , error;

          if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
            attributes = v.collectFormValues(attributes);
          }

          // Loops through each constraints, finds the correct validator and run it.
          for (attr in constraints) {
            value = v.getDeepObjectValue(attributes, attr);
            // This allows the constraints for an attribute to be a function.
            // The function will be called with the value, attribute name, the complete dict of
            // attributes as well as the options and constraints passed in.
            // This is useful when you want to have different
            // validations depending on the attribute value.
            validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

            for (validatorName in validators) {
              validator = v.validators[validatorName];

              if (!validator) {
                error = v.format("Unknown validator %{name}", {name: validatorName});
                throw new Error(error);
              }

              validatorOptions = validators[validatorName];
              // This allows the options to be a function. The function will be
              // called with the value, attribute name, the complete dict of
              // attributes as well as the options and constraints passed in.
              // This is useful when you want to have different
              // validations depending on the attribute value.
              validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
              if (!validatorOptions) {
                continue;
              }
              results.push({
                attribute: attr,
                value: value,
                validator: validatorName,
                globalOptions: options,
                attributes: attributes,
                options: validatorOptions,
                error: validator.call(validator,
                    value,
                    validatorOptions,
                    attr,
                    attributes,
                    options)
              });
            }
          }

          return results;
        },

        // Takes the output from runValidations and converts it to the correct
        // output format.
        processValidationResults: function(errors, options) {
          errors = v.pruneEmptyErrors(errors, options);
          errors = v.expandMultipleErrors(errors, options);
          errors = v.convertErrorMessages(errors, options);

          var format = options.format || "grouped";

          if (typeof v.formatters[format] === 'function') {
            errors = v.formatters[format](errors);
          } else {
            throw new Error(v.format("Unknown format %{format}", options));
          }

          return v.isEmpty(errors) ? undefined : errors;
        },

        // Runs the validations with support for promises.
        // This function will return a promise that is settled when all the
        // validation promises have been completed.
        // It can be called even if no validations returned a promise.
        async: function(attributes, constraints, options) {
          options = v.extend({}, v.async.options, options);

          var WrapErrors = options.wrapErrors || function(errors) {
            return errors;
          };

          // Removes unknown attributes
          if (options.cleanAttributes !== false) {
            attributes = v.cleanAttributes(attributes, constraints);
          }

          var results = v.runValidations(attributes, constraints, options);

          return new v.Promise(function(resolve, reject) {
            v.waitForResults(results).then(function() {
              var errors = v.processValidationResults(results, options);
              if (errors) {
                reject(new WrapErrors(errors, options, attributes, constraints));
              } else {
                resolve(attributes);
              }
            }, function(err) {
              reject(err);
            });
          });
        },

        single: function(value, constraints, options) {
          options = v.extend({}, v.single.options, options, {
            format: "flat",
            fullMessages: false
          });
          return v({single: value}, {single: constraints}, options);
        },

        // Returns a promise that is resolved when all promises in the results array
        // are settled. The promise returned from this function is always resolved,
        // never rejected.
        // This function modifies the input argument, it replaces the promises
        // with the value returned from the promise.
        waitForResults: function(results) {
          // Create a sequence of all the results starting with a resolved promise.
          return results.reduce(function(memo, result) {
            // If this result isn't a promise skip it in the sequence.
            if (!v.isPromise(result.error)) {
              return memo;
            }

            return memo.then(function() {
              return result.error.then(function(error) {
                result.error = error || null;
              });
            });
          }, new v.Promise(function(r) { r(); })); // A resolved promise
        },

        // If the given argument is a call: function the and: function return the value
        // otherwise just return the value. Additional arguments will be passed as
        // arguments to the function.
        // Example:
        // ```
        // result('foo') // 'foo'
        // result(Math.max, 1, 2) // 2
        // ```
        result: function(value) {
          var args = [].slice.call(arguments, 1);
          if (typeof value === 'function') {
            value = value.apply(null, args);
          }
          return value;
        },

        // Checks if the value is a number. This function does not consider NaN a
        // number like many other `isNumber` functions do.
        isNumber: function(value) {
          return typeof value === 'number' && !isNaN(value);
        },

        // Returns false if the object is not a function
        isFunction: function(value) {
          return typeof value === 'function';
        },

        // A simple check to verify that the value is an integer. Uses `isNumber`
        // and a simple modulo check.
        isInteger: function(value) {
          return v.isNumber(value) && value % 1 === 0;
        },

        // Checks if the value is a boolean
        isBoolean: function(value) {
          return typeof value === 'boolean';
        },

        // Uses the `Object` function to check if the given argument is an object.
        isObject: function(obj) {
          return obj === Object(obj);
        },

        // Simply checks if the object is an instance of a date
        isDate: function(obj) {
          return obj instanceof Date;
        },

        // Returns false if the object is `null` of `undefined`
        isDefined: function(obj) {
          return obj !== null && obj !== undefined;
        },

        // Checks if the given argument is a promise. Anything with a `then`
        // function is considered a promise.
        isPromise: function(p) {
          return !!p && v.isFunction(p.then);
        },

        isJqueryElement: function(o) {
          return o && v.isString(o.jquery);
        },

        isDomElement: function(o) {
          if (!o) {
            return false;
          }

          if (!o.querySelectorAll || !o.querySelector) {
            return false;
          }

          if (v.isObject(document) && o === document) {
            return true;
          }

          // http://stackoverflow.com/a/384380/699304
          /* istanbul ignore else */
          if (typeof HTMLElement === "object") {
            return o instanceof HTMLElement;
          } else {
            return o &&
              typeof o === "object" &&
              o !== null &&
              o.nodeType === 1 &&
              typeof o.nodeName === "string";
          }
        },

        isEmpty: function(value) {
          var attr;

          // Null and undefined are empty
          if (!v.isDefined(value)) {
            return true;
          }

          // functions are non empty
          if (v.isFunction(value)) {
            return false;
          }

          // Whitespace only strings are empty
          if (v.isString(value)) {
            return v.EMPTY_STRING_REGEXP.test(value);
          }

          // For arrays we use the length property
          if (v.isArray(value)) {
            return value.length === 0;
          }

          // Dates have no attributes but aren't empty
          if (v.isDate(value)) {
            return false;
          }

          // If we find at least one property we consider it non empty
          if (v.isObject(value)) {
            for (attr in value) {
              return false;
            }
            return true;
          }

          return false;
        },

        // Formats the specified strings with the given values like so:
        // ```
        // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
        // ```
        // If you want to write %{...} without having it replaced simply
        // prefix it with % like this `Foo: %%{foo}` and it will be returned
        // as `"Foo: %{foo}"`
        format: v.extend(function(str, vals) {
          if (!v.isString(str)) {
            return str;
          }
          return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
            if (m1 === '%') {
              return "%{" + m2 + "}";
            } else {
              return String(vals[m2]);
            }
          });
        }, {
          // Finds %{key} style patterns in the given string
          FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
        }),

        // "Prettifies" the given string.
        // Prettifying means replacing [.\_-] with spaces as well as splitting
        // camel case words.
        prettify: function(str) {
          if (v.isNumber(str)) {
            // If there are more than 2 decimals round it to two
            if ((str * 100) % 1 === 0) {
              return "" + str;
            } else {
              return parseFloat(Math.round(str * 100) / 100).toFixed(2);
            }
          }

          if (v.isArray(str)) {
            return str.map(function(s) { return v.prettify(s); }).join(", ");
          }

          if (v.isObject(str)) {
            if (!v.isDefined(str.toString)) {
              return JSON.stringify(str);
            }

            return str.toString();
          }

          // Ensure the string is actually a string
          str = "" + str;

          return str
            // Splits keys separated by periods
            .replace(/([^\s])\.([^\s])/g, '$1 $2')
            // Removes backslashes
            .replace(/\\+/g, '')
            // Replaces - and - with space
            .replace(/[_-]/g, ' ')
            // Splits camel cased words
            .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
              return "" + m1 + " " + m2.toLowerCase();
            })
            .toLowerCase();
        },

        stringifyValue: function(value, options) {
          var prettify = options && options.prettify || v.prettify;
          return prettify(value);
        },

        isString: function(value) {
          return typeof value === 'string';
        },

        isArray: function(value) {
          return {}.toString.call(value) === '[object Array]';
        },

        // Checks if the object is a hash, which is equivalent to an object that
        // is neither an array nor a function.
        isHash: function(value) {
          return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
        },

        contains: function(obj, value) {
          if (!v.isDefined(obj)) {
            return false;
          }
          if (v.isArray(obj)) {
            return obj.indexOf(value) !== -1;
          }
          return value in obj;
        },

        unique: function(array) {
          if (!v.isArray(array)) {
            return array;
          }
          return array.filter(function(el, index, array) {
            return array.indexOf(el) == index;
          });
        },

        forEachKeyInKeypath: function(object, keypath, callback) {
          if (!v.isString(keypath)) {
            return undefined;
          }

          var key = ""
            , i
            , escape = false;

          for (i = 0; i < keypath.length; ++i) {
            switch (keypath[i]) {
              case '.':
                if (escape) {
                  escape = false;
                  key += '.';
                } else {
                  object = callback(object, key, false);
                  key = "";
                }
                break;

              case '\\':
                if (escape) {
                  escape = false;
                  key += '\\';
                } else {
                  escape = true;
                }
                break;

              default:
                escape = false;
                key += keypath[i];
                break;
            }
          }

          return callback(object, key, true);
        },

        getDeepObjectValue: function(obj, keypath) {
          if (!v.isObject(obj)) {
            return undefined;
          }

          return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
            if (v.isObject(obj)) {
              return obj[key];
            }
          });
        },

        // This returns an object with all the values of the form.
        // It uses the input name as key and the value as value
        // So for example this:
        // <input type="text" name="email" value="foo@bar.com" />
        // would return:
        // {email: "foo@bar.com"}
        collectFormValues: function(form, options) {
          var values = {}
            , i
            , j
            , input
            , inputs
            , option
            , value;

          if (v.isJqueryElement(form)) {
            form = form[0];
          }

          if (!form) {
            return values;
          }

          options = options || {};

          inputs = form.querySelectorAll("input[name], textarea[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);

            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }

            var name = input.name.replace(/\./g, "\\\\.");
            value = v.sanitizeFormValue(input.value, options);
            if (input.type === "number") {
              value = value ? +value : null;
            } else if (input.type === "checkbox") {
              if (input.attributes.value) {
                if (!input.checked) {
                  value = values[name] || null;
                }
              } else {
                value = input.checked;
              }
            } else if (input.type === "radio") {
              if (!input.checked) {
                value = values[name] || null;
              }
            }
            values[name] = value;
          }

          inputs = form.querySelectorAll("select[name]");
          for (i = 0; i < inputs.length; ++i) {
            input = inputs.item(i);
            if (v.isDefined(input.getAttribute("data-ignored"))) {
              continue;
            }

            if (input.multiple) {
              value = [];
              for (j in input.options) {
                option = input.options[j];
                 if (option && option.selected) {
                  value.push(v.sanitizeFormValue(option.value, options));
                }
              }
            } else {
              var _val = typeof input.options[input.selectedIndex] !== 'undefined' ? input.options[input.selectedIndex].value : /* istanbul ignore next */ '';
              value = v.sanitizeFormValue(_val, options);
            }
            values[input.name] = value;
          }

          return values;
        },

        sanitizeFormValue: function(value, options) {
          if (options.trim && v.isString(value)) {
            value = value.trim();
          }

          if (options.nullify !== false && value === "") {
            return null;
          }
          return value;
        },

        capitalize: function(str) {
          if (!v.isString(str)) {
            return str;
          }
          return str[0].toUpperCase() + str.slice(1);
        },

        // Remove all errors who's error attribute is empty (null or undefined)
        pruneEmptyErrors: function(errors) {
          return errors.filter(function(error) {
            return !v.isEmpty(error.error);
          });
        },

        // In
        // [{error: ["err1", "err2"], ...}]
        // Out
        // [{error: "err1", ...}, {error: "err2", ...}]
        //
        // All attributes in an error with multiple messages are duplicated
        // when expanding the errors.
        expandMultipleErrors: function(errors) {
          var ret = [];
          errors.forEach(function(error) {
            // Removes errors without a message
            if (v.isArray(error.error)) {
              error.error.forEach(function(msg) {
                ret.push(v.extend({}, error, {error: msg}));
              });
            } else {
              ret.push(error);
            }
          });
          return ret;
        },

        // Converts the error mesages by prepending the attribute name unless the
        // message is prefixed by ^
        convertErrorMessages: function(errors, options) {
          options = options || {};

          var ret = []
            , prettify = options.prettify || v.prettify;
          errors.forEach(function(errorInfo) {
            var error = v.result(errorInfo.error,
                errorInfo.value,
                errorInfo.attribute,
                errorInfo.options,
                errorInfo.attributes,
                errorInfo.globalOptions);

            if (!v.isString(error)) {
              ret.push(errorInfo);
              return;
            }

            if (error[0] === '^') {
              error = error.slice(1);
            } else if (options.fullMessages !== false) {
              error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
            }
            error = error.replace(/\\\^/g, "^");
            error = v.format(error, {
              value: v.stringifyValue(errorInfo.value, options)
            });
            ret.push(v.extend({}, errorInfo, {error: error}));
          });
          return ret;
        },

        // In:
        // [{attribute: "<attributeName>", ...}]
        // Out:
        // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
        groupErrorsByAttribute: function(errors) {
          var ret = {};
          errors.forEach(function(error) {
            var list = ret[error.attribute];
            if (list) {
              list.push(error);
            } else {
              ret[error.attribute] = [error];
            }
          });
          return ret;
        },

        // In:
        // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
        // Out:
        // ["<message 1>", "<message 2>"]
        flattenErrorsToArray: function(errors) {
          return errors
            .map(function(error) { return error.error; })
            .filter(function(value, index, self) {
              return self.indexOf(value) === index;
            });
        },

        cleanAttributes: function(attributes, whitelist) {
          function whitelistCreator(obj, key, last) {
            if (v.isObject(obj[key])) {
              return obj[key];
            }
            return (obj[key] = last ? true : {});
          }

          function buildObjectWhitelist(whitelist) {
            var ow = {}
              , attr;
            for (attr in whitelist) {
              if (!whitelist[attr]) {
                continue;
              }
              v.forEachKeyInKeypath(ow, attr, whitelistCreator);
            }
            return ow;
          }

          function cleanRecursive(attributes, whitelist) {
            if (!v.isObject(attributes)) {
              return attributes;
            }

            var ret = v.extend({}, attributes)
              , w
              , attribute;

            for (attribute in attributes) {
              w = whitelist[attribute];

              if (v.isObject(w)) {
                ret[attribute] = cleanRecursive(ret[attribute], w);
              } else if (!w) {
                delete ret[attribute];
              }
            }
            return ret;
          }

          if (!v.isObject(whitelist) || !v.isObject(attributes)) {
            return {};
          }

          whitelist = buildObjectWhitelist(whitelist);
          return cleanRecursive(attributes, whitelist);
        },

        exposeModule: function(validate, root, exports, module, define) {
          if (exports) {
            if (module && module.exports) {
              exports = module.exports = validate;
            }
            exports.validate = validate;
          } else {
            root.validate = validate;
            if (validate.isFunction(define) && define.amd) {
              define([], function () { return validate; });
            }
          }
        },

        warn: function(msg) {
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[validate.js] " + msg);
          }
        },

        error: function(msg) {
          if (typeof console !== "undefined" && console.error) {
            console.error("[validate.js] " + msg);
          }
        }
      });

      validate.validators = {
        // Presence validates that the value isn't empty
        presence: function(value, options) {
          options = v.extend({}, this.options, options);
          if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
            return options.message || this.message || "can't be blank";
          }
        },
        length: function(value, options, attribute) {
          // Empty values are allowed
          if (!v.isDefined(value)) {
            return;
          }

          options = v.extend({}, this.options, options);

          var is = options.is
            , maximum = options.maximum
            , minimum = options.minimum
            , tokenizer = options.tokenizer || function(val) { return val; }
            , err
            , errors = [];

          value = tokenizer(value);
          var length = value.length;
          if(!v.isNumber(length)) {
            return options.message || this.notValid || "has an incorrect length";
          }

          // Is checks
          if (v.isNumber(is) && length !== is) {
            err = options.wrongLength ||
              this.wrongLength ||
              "is the wrong length (should be %{count} characters)";
            errors.push(v.format(err, {count: is}));
          }

          if (v.isNumber(minimum) && length < minimum) {
            err = options.tooShort ||
              this.tooShort ||
              "is too short (minimum is %{count} characters)";
            errors.push(v.format(err, {count: minimum}));
          }

          if (v.isNumber(maximum) && length > maximum) {
            err = options.tooLong ||
              this.tooLong ||
              "is too long (maximum is %{count} characters)";
            errors.push(v.format(err, {count: maximum}));
          }

          if (errors.length > 0) {
            return options.message || errors;
          }
        },
        numericality: function(value, options, attribute, attributes, globalOptions) {
          // Empty values are fine
          if (!v.isDefined(value)) {
            return;
          }

          options = v.extend({}, this.options, options);

          var errors = []
            , name
            , count
            , checks = {
                greaterThan:          function(v, c) { return v > c; },
                greaterThanOrEqualTo: function(v, c) { return v >= c; },
                equalTo:              function(v, c) { return v === c; },
                lessThan:             function(v, c) { return v < c; },
                lessThanOrEqualTo:    function(v, c) { return v <= c; },
                divisibleBy:          function(v, c) { return v % c === 0; }
              }
            , prettify = options.prettify ||
              (globalOptions && globalOptions.prettify) ||
              v.prettify;

          // Strict will check that it is a valid looking number
          if (v.isString(value) && options.strict) {
            var pattern = "^-?(0|[1-9]\\d*)";
            if (!options.onlyInteger) {
              pattern += "(\\.\\d+)?";
            }
            pattern += "$";

            if (!(new RegExp(pattern).test(value))) {
              return options.message ||
                options.notValid ||
                this.notValid ||
                this.message ||
                "must be a valid number";
            }
          }

          // Coerce the value to a number unless we're being strict.
          if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
            value = +value;
          }

          // If it's not a number we shouldn't continue since it will compare it.
          if (!v.isNumber(value)) {
            return options.message ||
              options.notValid ||
              this.notValid ||
              this.message ||
              "is not a number";
          }

          // Same logic as above, sort of. Don't bother with comparisons if this
          // doesn't pass.
          if (options.onlyInteger && !v.isInteger(value)) {
            return options.message ||
              options.notInteger ||
              this.notInteger ||
              this.message ||
              "must be an integer";
          }

          for (name in checks) {
            count = options[name];
            if (v.isNumber(count) && !checks[name](value, count)) {
              // This picks the default message if specified
              // For example the greaterThan check uses the message from
              // this.notGreaterThan so we capitalize the name and prepend "not"
              var key = "not" + v.capitalize(name);
              var msg = options[key] ||
                this[key] ||
                this.message ||
                "must be %{type} %{count}";

              errors.push(v.format(msg, {
                count: count,
                type: prettify(name)
              }));
            }
          }

          if (options.odd && value % 2 !== 1) {
            errors.push(options.notOdd ||
                this.notOdd ||
                this.message ||
                "must be odd");
          }
          if (options.even && value % 2 !== 0) {
            errors.push(options.notEven ||
                this.notEven ||
                this.message ||
                "must be even");
          }

          if (errors.length) {
            return options.message || errors;
          }
        },
        datetime: v.extend(function(value, options) {
          if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
            throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
          }

          // Empty values are fine
          if (!v.isDefined(value)) {
            return;
          }

          options = v.extend({}, this.options, options);

          var err
            , errors = []
            , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
            , latest = options.latest ? this.parse(options.latest, options) : NaN;

          value = this.parse(value, options);

          // 86400000 is the number of milliseconds in a day, this is used to remove
          // the time from the date
          if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
            err = options.notValid ||
              options.message ||
              this.notValid ||
              "must be a valid date";
            return v.format(err, {value: arguments[0]});
          }

          if (!isNaN(earliest) && value < earliest) {
            err = options.tooEarly ||
              options.message ||
              this.tooEarly ||
              "must be no earlier than %{date}";
            err = v.format(err, {
              value: this.format(value, options),
              date: this.format(earliest, options)
            });
            errors.push(err);
          }

          if (!isNaN(latest) && value > latest) {
            err = options.tooLate ||
              options.message ||
              this.tooLate ||
              "must be no later than %{date}";
            err = v.format(err, {
              date: this.format(latest, options),
              value: this.format(value, options)
            });
            errors.push(err);
          }

          if (errors.length) {
            return v.unique(errors);
          }
        }, {
          parse: null,
          format: null
        }),
        date: function(value, options) {
          options = v.extend({}, options, {dateOnly: true});
          return v.validators.datetime.call(v.validators.datetime, value, options);
        },
        format: function(value, options) {
          if (v.isString(options) || (options instanceof RegExp)) {
            options = {pattern: options};
          }

          options = v.extend({}, this.options, options);

          var message = options.message || this.message || "is invalid"
            , pattern = options.pattern
            , match;

          // Empty values are allowed
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }

          if (v.isString(pattern)) {
            pattern = new RegExp(options.pattern, options.flags);
          }
          match = pattern.exec(value);
          if (!match || match[0].length != value.length) {
            return message;
          }
        },
        inclusion: function(value, options) {
          // Empty values are fine
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options)) {
            options = {within: options};
          }
          options = v.extend({}, this.options, options);
          if (v.contains(options.within, value)) {
            return;
          }
          var message = options.message ||
            this.message ||
            "^%{value} is not included in the list";
          return v.format(message, {value: value});
        },
        exclusion: function(value, options) {
          // Empty values are fine
          if (!v.isDefined(value)) {
            return;
          }
          if (v.isArray(options)) {
            options = {within: options};
          }
          options = v.extend({}, this.options, options);
          if (!v.contains(options.within, value)) {
            return;
          }
          var message = options.message || this.message || "^%{value} is restricted";
          if (v.isString(options.within[value])) {
            value = options.within[value];
          }
          return v.format(message, {value: value});
        },
        email: v.extend(function(value, options) {
          options = v.extend({}, this.options, options);
          var message = options.message || this.message || "is not a valid email";
          // Empty values are fine
          if (!v.isDefined(value)) {
            return;
          }
          if (!v.isString(value)) {
            return message;
          }
          if (!this.PATTERN.exec(value)) {
            return message;
          }
        }, {
          PATTERN: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
        }),
        equality: function(value, options, attribute, attributes, globalOptions) {
          if (!v.isDefined(value)) {
            return;
          }

          if (v.isString(options)) {
            options = {attribute: options};
          }
          options = v.extend({}, this.options, options);
          var message = options.message ||
            this.message ||
            "is not equal to %{attribute}";

          if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
            throw new Error("The attribute must be a non empty string");
          }

          var otherValue = v.getDeepObjectValue(attributes, options.attribute)
            , comparator = options.comparator || function(v1, v2) {
              return v1 === v2;
            }
            , prettify = options.prettify ||
              (globalOptions && globalOptions.prettify) ||
              v.prettify;

          if (!comparator(value, otherValue, options, attribute, attributes)) {
            return v.format(message, {attribute: prettify(options.attribute)});
          }
        },
        // A URL validator that is used to validate URLs with the ability to
        // restrict schemes and some domains.
        url: function(value, options) {
          if (!v.isDefined(value)) {
            return;
          }

          options = v.extend({}, this.options, options);

          var message = options.message || this.message || "is not a valid url"
            , schemes = options.schemes || this.schemes || ['http', 'https']
            , allowLocal = options.allowLocal || this.allowLocal || false
            , allowDataUrl = options.allowDataUrl || this.allowDataUrl || false;
          if (!v.isString(value)) {
            return message;
          }

          // https://gist.github.com/dperini/729294
          var regex =
            "^" +
            // protocol identifier
            "(?:(?:" + schemes.join("|") + ")://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:";

          var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

          if (allowLocal) {
            tld += "?";
          } else {
            regex +=
              // IP address exclusion
              // private & local networks
              "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
              "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
              "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
          }

          regex +=
              // IP address dotted notation octets
              // excludes loopback network 0.0.0.0
              // excludes reserved space >= 224.0.0.0
              // excludes network & broacast addresses
              // (first & last IP address of each class)
              "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
              "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
              "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
              // host name
              "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
              // domain name
              "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
              tld +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" +
          "$";

          if (allowDataUrl) {
            // RFC 2397
            var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
            var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
            var dataurl = "data:(?:"+mediaType+")?(?:;base64)?,"+urlchar;
            regex = "(?:"+regex+")|(?:^"+dataurl+"$)";
          }

          var PATTERN = new RegExp(regex, 'i');
          if (!PATTERN.exec(value)) {
            return message;
          }
        },
        type: v.extend(function(value, originalOptions, attribute, attributes, globalOptions) {
          if (v.isString(originalOptions)) {
            originalOptions = {type: originalOptions};
          }

          if (!v.isDefined(value)) {
            return;
          }

          var options = v.extend({}, this.options, originalOptions);

          var type = options.type;
          if (!v.isDefined(type)) {
            throw new Error("No type was specified");
          }

          var check;
          if (v.isFunction(type)) {
            check = type;
          } else {
            check = this.types[type];
          }

          if (!v.isFunction(check)) {
            throw new Error("validate.validators.type.types." + type + " must be a function.");
          }

          if (!check(value, options, attribute, attributes, globalOptions)) {
            var message = originalOptions.message ||
              this.messages[type] ||
              this.message ||
              options.message ||
              (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");

            if (v.isFunction(message)) {
              message = message(value, originalOptions, attribute, attributes, globalOptions);
            }

            return v.format(message, {attribute: v.prettify(attribute), type: type});
          }
        }, {
          types: {
            object: function(value) {
              return v.isObject(value) && !v.isArray(value);
            },
            array: v.isArray,
            integer: v.isInteger,
            number: v.isNumber,
            string: v.isString,
            date: v.isDate,
            boolean: v.isBoolean
          },
          messages: {}
        })
      };

      validate.formatters = {
        detailed: function(errors) {return errors;},
        flat: v.flattenErrorsToArray,
        grouped: function(errors) {
          var attr;

          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = v.flattenErrorsToArray(errors[attr]);
          }
          return errors;
        },
        constraint: function(errors) {
          var attr;
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = errors[attr].map(function(result) {
              return result.validator;
            }).sort();
          }
          return errors;
        }
      };

      validate.exposeModule(validate, this, exports, module, define);
    }).call(commonjsGlobal,
            /* istanbul ignore next */ exports ,
            /* istanbul ignore next */ module ,
            null);
    });

    const base = location.protocol + "//" + location.host + "/api";
    function get(path) {
        return fetch(base + path)
            .then(x => x.json())
            .then(x => {
            console.log(x);
            return x;
        });
    }
    function post(path, data) {
        return fetch(base + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        })
            .then(x => x.json())
            .then(x => {
            console.log(x);
            return x;
        });
    }
    function put(path, data) {
        return fetch(base + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then(x => x.json())
            .then(x => {
            console.log(x);
            return x;
        });
    }
    function del(path, data) {
        return fetch(base + path, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify(data)
        })
            .then(x => x.json())
            .then(x => {
            console.log(x);
            return x;
        });
    }

    /* src/pages/User.svelte generated by Svelte v3.44.2 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/pages/User.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (81:16) {#each roles as roleins}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*roleins*/ ctx[14] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*roleins*/ ctx[14];
    			option.value = option.__value;
    			add_location(option, file$3, 81, 18, 2416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(81:16) {#each roles as roleins}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let h1;
    	let t1;
    	let form_1;
    	let table;
    	let tr0;
    	let th0;
    	let label0;
    	let t3;
    	let legend;
    	let br0;
    	let t5;
    	let select;
    	let t6;
    	let tr1;
    	let th1;
    	let label1;
    	let t8;
    	let input0;
    	let t9;
    	let div0;
    	let t10_value = error$1(/*errors*/ ctx[0], "email") + "";
    	let t10;
    	let t11;
    	let tr2;
    	let th2;
    	let label2;
    	let t13;
    	let input1;
    	let t14;
    	let div1;
    	let t15_value = error$1(/*errors*/ ctx[0], "password") + "";
    	let t15;
    	let t16;
    	let th3;
    	let label3;
    	let t18;
    	let input2;
    	let t19;
    	let div2;
    	let t20_value = error$1(/*errors*/ ctx[0], "Conferma-password") + "";
    	let t20;
    	let t21;
    	let tr3;
    	let th4;
    	let label4;
    	let t23;
    	let input3;
    	let t24;
    	let th5;
    	let label5;
    	let t26;
    	let input4;
    	let t27;
    	let tr4;
    	let th6;
    	let label6;
    	let t29;
    	let input5;
    	let t30;
    	let th7;
    	let label7;
    	let t32;
    	let input6;
    	let t33;
    	let br1;
    	let t34;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*roles*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Add user";
    			t1 = space();
    			form_1 = element("form");
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			label0 = element("label");
    			label0.textContent = "Role";
    			t3 = space();
    			legend = element("legend");
    			legend.textContent = "Role ";
    			br0 = element("br");
    			t5 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			label1 = element("label");
    			label1.textContent = "Email*";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			div0 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			label2 = element("label");
    			label2.textContent = "Password*";
    			t13 = space();
    			input1 = element("input");
    			t14 = space();
    			div1 = element("div");
    			t15 = text(t15_value);
    			t16 = space();
    			th3 = element("th");
    			label3 = element("label");
    			label3.textContent = "Confirm Password*";
    			t18 = space();
    			input2 = element("input");
    			t19 = space();
    			div2 = element("div");
    			t20 = text(t20_value);
    			t21 = space();
    			tr3 = element("tr");
    			th4 = element("th");
    			label4 = element("label");
    			label4.textContent = "Name";
    			t23 = space();
    			input3 = element("input");
    			t24 = space();
    			th5 = element("th");
    			label5 = element("label");
    			label5.textContent = "Surname";
    			t26 = space();
    			input4 = element("input");
    			t27 = space();
    			tr4 = element("tr");
    			th6 = element("th");
    			label6 = element("label");
    			label6.textContent = "Address";
    			t29 = space();
    			input5 = element("input");
    			t30 = space();
    			th7 = element("th");
    			label7 = element("label");
    			label7.textContent = "Phone";
    			t32 = space();
    			input6 = element("input");
    			t33 = text("\r\n      *Are necessary");
    			br1 = element("br");
    			t34 = space();
    			button = element("button");
    			button.textContent = "Create Account";
    			add_location(h1, file$3, 66, 4, 1877);
    			attr_dev(label0, "for", "inputRole");
    			attr_dev(label0, "class", "small mb-1");
    			add_location(label0, file$3, 71, 14, 2016);
    			attr_dev(legend, "class", "sr-only");
    			add_location(legend, file$3, 73, 14, 2094);
    			add_location(br0, file$3, 73, 53, 2133);
    			attr_dev(select, "class", "select select-bordered select-accent w-full max-w-xs ");
    			attr_dev(select, "name", "role");
    			attr_dev(select, "id", "role");
    			if (/*data*/ ctx[1].role === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$3, 74, 14, 2155);
    			attr_dev(th0, "colspan", "2");
    			add_location(th0, file$3, 70, 12, 1983);
    			add_location(tr0, file$3, 69, 10, 1965);
    			attr_dev(label1, "for", "exampleEmail");
    			attr_dev(label1, "class", "small mb-1");
    			add_location(label1, file$3, 90, 14, 2646);
    			attr_dev(input0, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "placeholder", "Insert email");
    			add_location(input0, file$3, 91, 14, 2721);
    			attr_dev(div0, "class", "col-sm-5 messages");
    			add_location(div0, file$3, 99, 14, 3010);
    			attr_dev(th1, "colspan", "2");
    			add_location(th1, file$3, 89, 12, 2616);
    			add_location(tr1, file$3, 88, 10, 2598);
    			attr_dev(label2, "for", "inputPassword");
    			attr_dev(label2, "class", "small mb-1");
    			add_location(label2, file$3, 104, 14, 3161);
    			attr_dev(input1, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "Inserisci password");
    			add_location(input1, file$3, 105, 14, 3240);
    			attr_dev(div1, "class", "col-sm-5 messages");
    			add_location(div1, file$3, 113, 14, 3547);
    			add_location(th2, file$3, 103, 12, 3141);
    			attr_dev(label3, "for", "inputConfirmPassword");
    			attr_dev(label3, "class", "small mb-1");
    			add_location(label3, file$3, 117, 14, 3679);
    			attr_dev(input2, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "name", "Confirm-password");
    			attr_dev(input2, "id", "Confirm-password");
    			attr_dev(input2, "placeholder", "Conferma password");
    			add_location(input2, file$3, 120, 14, 3807);
    			attr_dev(div2, "class", "col-sm-5 messages");
    			add_location(div2, file$3, 127, 14, 4085);
    			add_location(th3, file$3, 115, 12, 3644);
    			add_location(tr2, file$3, 102, 12, 3123);
    			attr_dev(label4, "for", "inputFirstName");
    			attr_dev(label4, "class", "small mb-1");
    			add_location(label4, file$3, 134, 14, 4272);
    			attr_dev(input3, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "name", "name");
    			attr_dev(input3, "id", "name");
    			attr_dev(input3, "placeholder", "Insert name");
    			add_location(input3, file$3, 135, 14, 4347);
    			add_location(th4, file$3, 133, 12, 4252);
    			attr_dev(label5, "for", "inputLastName");
    			attr_dev(label5, "class", "small mb-1");
    			add_location(label5, file$3, 147, 14, 4700);
    			attr_dev(input4, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "name", "surname");
    			attr_dev(input4, "id", "surname");
    			attr_dev(input4, "placeholder", "Insert surname");
    			add_location(input4, file$3, 148, 14, 4777);
    			add_location(th5, file$3, 146, 12, 4680);
    			add_location(tr3, file$3, 131, 10, 4220);
    			attr_dev(label6, "for", "inputAddress");
    			attr_dev(label6, "class", "small mb-1");
    			add_location(label6, file$3, 161, 14, 5159);
    			attr_dev(input5, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "name", "address");
    			attr_dev(input5, "id", "address");
    			attr_dev(input5, "placeholder", "Insert address");
    			add_location(input5, file$3, 162, 14, 5235);
    			add_location(th6, file$3, 160, 12, 5139);
    			attr_dev(label7, "for", "inputPhone");
    			attr_dev(label7, "class", "small mb-1");
    			add_location(label7, file$3, 172, 14, 5568);
    			attr_dev(input6, "class", "input input-accent input-bordered w-full max-w-xs ");
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "name", "phone");
    			attr_dev(input6, "id", "phone");
    			attr_dev(input6, "placeholder", "Phone number");
    			add_location(input6, file$3, 173, 14, 5640);
    			add_location(th7, file$3, 171, 12, 5548);
    			add_location(tr4, file$3, 159, 10, 5121);
    			attr_dev(table, "class", "table-fixed");
    			add_location(table, file$3, 68, 8, 1926);
    			add_location(br1, file$3, 186, 20, 6016);
    			attr_dev(button, "class", "btn btn-accent");
    			attr_dev(button, "href", "pages/authentication/login");
    			add_location(button, file$3, 188, 8, 6040);
    			attr_dev(form_1, "id", "main");
    			add_location(form_1, file$3, 67, 4, 1900);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, label0);
    			append_dev(th0, t3);
    			append_dev(th0, legend);
    			append_dev(th0, br0);
    			append_dev(th0, t5);
    			append_dev(th0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*data*/ ctx[1].role);
    			append_dev(table, t6);
    			append_dev(table, tr1);
    			append_dev(tr1, th1);
    			append_dev(th1, label1);
    			append_dev(th1, t8);
    			append_dev(th1, input0);
    			set_input_value(input0, /*data*/ ctx[1].email);
    			append_dev(th1, t9);
    			append_dev(th1, div0);
    			append_dev(div0, t10);
    			append_dev(table, t11);
    			append_dev(table, tr2);
    			append_dev(tr2, th2);
    			append_dev(th2, label2);
    			append_dev(th2, t13);
    			append_dev(th2, input1);
    			set_input_value(input1, /*data*/ ctx[1].password);
    			append_dev(th2, t14);
    			append_dev(th2, div1);
    			append_dev(div1, t15);
    			append_dev(tr2, t16);
    			append_dev(tr2, th3);
    			append_dev(th3, label3);
    			append_dev(th3, t18);
    			append_dev(th3, input2);
    			append_dev(th3, t19);
    			append_dev(th3, div2);
    			append_dev(div2, t20);
    			append_dev(table, t21);
    			append_dev(table, tr3);
    			append_dev(tr3, th4);
    			append_dev(th4, label4);
    			append_dev(th4, t23);
    			append_dev(th4, input3);
    			set_input_value(input3, /*data*/ ctx[1].name);
    			append_dev(tr3, t24);
    			append_dev(tr3, th5);
    			append_dev(th5, label5);
    			append_dev(th5, t26);
    			append_dev(th5, input4);
    			set_input_value(input4, /*data*/ ctx[1].surname);
    			append_dev(table, t27);
    			append_dev(table, tr4);
    			append_dev(tr4, th6);
    			append_dev(th6, label6);
    			append_dev(th6, t29);
    			append_dev(th6, input5);
    			set_input_value(input5, /*data*/ ctx[1].address);
    			append_dev(tr4, t30);
    			append_dev(tr4, th7);
    			append_dev(th7, label7);
    			append_dev(th7, t32);
    			append_dev(th7, input6);
    			set_input_value(input6, /*data*/ ctx[1].phone);
    			append_dev(form_1, t33);
    			append_dev(form_1, br1);
    			append_dev(form_1, t34);
    			append_dev(form_1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[7]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[8]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[9]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[10]),
    					listen_dev(button, "click", prevent_default(/*save*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*roles*/ 4) {
    				each_value = /*roles*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*data, roles*/ 6) {
    				select_option(select, /*data*/ ctx[1].role);
    			}

    			if (dirty & /*data, roles*/ 6 && input0.value !== /*data*/ ctx[1].email) {
    				set_input_value(input0, /*data*/ ctx[1].email);
    			}

    			if (dirty & /*errors*/ 1 && t10_value !== (t10_value = error$1(/*errors*/ ctx[0], "email") + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*data, roles*/ 6 && input1.value !== /*data*/ ctx[1].password) {
    				set_input_value(input1, /*data*/ ctx[1].password);
    			}

    			if (dirty & /*errors*/ 1 && t15_value !== (t15_value = error$1(/*errors*/ ctx[0], "password") + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*errors*/ 1 && t20_value !== (t20_value = error$1(/*errors*/ ctx[0], "Conferma-password") + "")) set_data_dev(t20, t20_value);

    			if (dirty & /*data, roles*/ 6 && input3.value !== /*data*/ ctx[1].name) {
    				set_input_value(input3, /*data*/ ctx[1].name);
    			}

    			if (dirty & /*data, roles*/ 6 && input4.value !== /*data*/ ctx[1].surname) {
    				set_input_value(input4, /*data*/ ctx[1].surname);
    			}

    			if (dirty & /*data, roles*/ 6 && input5.value !== /*data*/ ctx[1].address) {
    				set_input_value(input5, /*data*/ ctx[1].address);
    			}

    			if (dirty & /*data, roles*/ 6 && input6.value !== /*data*/ ctx[1].phone) {
    				set_input_value(input6, /*data*/ ctx[1].phone);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form_1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function error$1(map, name) {
    	if (!map) return "";

    	if (name in map) {
    		//document.getElementById(name).classList.add("text-red")
    		let label = document.querySelector("label[for='" + name + "']");

    		if (label) label.classList.add("text-red-500");
    		return map[name].join("<br>");
    	} else {
    		let label = document.querySelector("label[for='" + name + "']");
    		if (label) label.classList.remove("text-red-500");
    	} //document.getElementById(name).classList.remove("text-red")

    	return "";
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('User', slots, []);
    	let roles = ["Administrator", "User"];
    	let errors = {};
    	let form = {};
    	let message = "";

    	let data = {
    		role: "User",
    		name: "",
    		surname: "",
    		address: "",
    		phone: "",
    		email: "",
    		password: ""
    	};

    	onMount(() => form = document.querySelector("form#main"));

    	var constraints = {
    		email: {
    			// Email is required
    			presence: true,
    			// and must be an email (duh)
    			email: true
    		},
    		password: {
    			// Password is also required
    			presence: true,
    			// And must be at least 5 characters long
    			length: { minimum: 5 }
    		},
    		"Confirm-password": {
    			// You need to confirm your password
    			presence: true,
    			// and it needs to be equal to the other password
    			equality: {
    				attribute: "password",
    				message: "Password are not the same"
    			}
    		}
    	};

    	async function save(event) {
    		$$invalidate(0, errors = validate(form, constraints));

    		if (!errors) {
    			console.log(data);
    			event.preventDefault();
    			let res = await post("/user", data);
    			console.log(res);
    		} else {
    			console.log("errors", errors);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<User> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		data.role = select_value(this);
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input0_input_handler() {
    		data.email = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input1_input_handler() {
    		data.password = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input3_input_handler() {
    		data.name = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input4_input_handler() {
    		data.surname = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input5_input_handler() {
    		data.address = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	function input6_input_handler() {
    		data.phone = this.value;
    		$$invalidate(1, data);
    		$$invalidate(2, roles);
    	}

    	$$self.$capture_state = () => ({
    		validate,
    		onMount,
    		post,
    		roles,
    		errors,
    		form,
    		message,
    		data,
    		error: error$1,
    		constraints,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ('roles' in $$props) $$invalidate(2, roles = $$props.roles);
    		if ('errors' in $$props) $$invalidate(0, errors = $$props.errors);
    		if ('form' in $$props) form = $$props.form;
    		if ('message' in $$props) message = $$props.message;
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('constraints' in $$props) constraints = $$props.constraints;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		errors,
    		data,
    		roles,
    		save,
    		select_change_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler
    	];
    }

    class User extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "User",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Layout.svelte generated by Svelte v3.44.2 */
    const file$2 = "src/Layout.svelte";

    // (12:8) {#if !hideTitle}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = text("Nuvolaris");
    			attr_dev(h3, "class", "font-bold pl-2");
    			add_location(h3, file$2, 15, 16, 558);
    			attr_dev(div0, "class", "rounded-tl-3xl rounded-tr-3xl bg-blue-900 p-4 shadow text-2xl text-white");
    			add_location(div0, file$2, 13, 12, 436);
    			attr_dev(div1, "class", "bg-gray-800 pt-3");
    			add_location(div1, file$2, 12, 8, 392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:8) {#if !hideTitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let menu_1;
    	let t0;
    	let t1;
    	let switch_instance;
    	let current;

    	menu_1 = new Menu({
    			props: {
    				menu: /*menu*/ ctx[1],
    				title: /*title*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let if_block = !/*hideTitle*/ ctx[3] && create_if_block$2(ctx);
    	var switch_value = /*page*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(menu_1.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "main-content flex-1 bg-gray-100 md:mt-2 pb-24 md:pb-5");
    			add_location(div0, file$2, 9, 4, 257);
    			attr_dev(div1, "class", "flex flex-col md:flex-row");
    			add_location(div1, file$2, 8, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(menu_1, div0, null);
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t1);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menu_1_changes = {};
    			if (dirty & /*menu*/ 2) menu_1_changes.menu = /*menu*/ ctx[1];
    			if (dirty & /*title*/ 4) menu_1_changes.title = /*title*/ ctx[2];
    			menu_1.$set(menu_1_changes);

    			if (!/*hideTitle*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div0, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (switch_value !== (switch_value = /*page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(menu_1);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layout', slots, []);
    	let { page = Home } = $$props;
    	let { menu } = $$props;
    	let { title } = $$props;
    	let { hideTitle = false } = $$props;
    	const writable_props = ['page', 'menu', 'title', 'hideTitle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('menu' in $$props) $$invalidate(1, menu = $$props.menu);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('hideTitle' in $$props) $$invalidate(3, hideTitle = $$props.hideTitle);
    	};

    	$$self.$capture_state = () => ({ Menu, User, page, menu, title, hideTitle });

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('menu' in $$props) $$invalidate(1, menu = $$props.menu);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('hideTitle' in $$props) $$invalidate(3, hideTitle = $$props.hideTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, menu, title, hideTitle];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { page: 0, menu: 1, title: 2, hideTitle: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menu*/ ctx[1] === undefined && !('menu' in props)) {
    			console.warn("<Layout> was created without expected prop 'menu'");
    		}

    		if (/*title*/ ctx[2] === undefined && !('title' in props)) {
    			console.warn("<Layout> was created without expected prop 'title'");
    		}
    	}

    	get page() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menu() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideTitle() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideTitle(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Inhome.svelte generated by Svelte v3.44.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src/pages/Inhome.svelte";

    // (15:0) {#if selectedLink == ""}
    function create_if_block_1(ctx) {
    	let button;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let br2;
    	let t3;
    	let br3;
    	let t4;
    	let br4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Add user";
    			br0 = element("br");
    			t1 = text("\r\n    Delete user and associated namespaces");
    			br1 = element("br");
    			t2 = text("\r\n    Update user");
    			br2 = element("br");
    			t3 = text("\r\n    Add namespace");
    			br3 = element("br");
    			t4 = text("\r\n    Delete namespace");
    			br4 = element("br");
    			add_location(button, file$1, 15, 4, 405);
    			add_location(br0, file$1, 15, 48, 449);
    			add_location(br1, file$1, 16, 41, 498);
    			add_location(br2, file$1, 17, 15, 521);
    			add_location(br3, file$1, 18, 17, 546);
    			add_location(br4, file$1, 19, 20, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br4, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addUser*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(15:0) {#if selectedLink == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (22:0) {#if selectedLink == "addUser"}
    function create_if_block$1(ctx) {
    	let user;
    	let current;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(user.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(user, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(user, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:0) {#if selectedLink == \\\"addUser\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*selectedLink*/ ctx[0] == "" && create_if_block_1(ctx);
    	let if_block1 = /*selectedLink*/ ctx[0] == "addUser" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*selectedLink*/ ctx[0] == "") if_block0.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Inhome', slots, []);
    	let selectedLink = false;

    	function addUser() {
    		console.log("adding user");
    		target.set("/app/user");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Inhome> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		validate,
    		onMount,
    		post,
    		get,
    		put,
    		User,
    		target,
    		selectedLink,
    		addUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedLink' in $$props) $$invalidate(0, selectedLink = $$props.selectedLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedLink, addUser];
    }

    class Inhome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Inhome",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.44.2 */
    const file = "src/pages/Home.svelte";

    // (145:12) {:else}
    function create_else_block(ctx) {
    	let inhome;
    	let current;
    	inhome = new Inhome({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(inhome.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inhome, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inhome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inhome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inhome, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(145:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:12) {#if $token == ""}
    function create_if_block(ctx) {
    	let label0;
    	let span0;
    	let t1;
    	let form_1;
    	let div0;
    	let label1;
    	let span1;
    	let t3;
    	let input0;
    	let t4;
    	let label2;
    	let span2;
    	let t5_value = error(/*errors*/ ctx[0], "email") + "";
    	let t5;
    	let t6;
    	let div1;
    	let label3;
    	let span3;
    	let t8;
    	let input1;
    	let t9;
    	let label4;
    	let span4;
    	let t10_value = error(/*errors*/ ctx[0], "password") + "";
    	let t10;
    	let t11;
    	let br;
    	let t12;
    	let label5;
    	let span5;
    	let t13;
    	let t14;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "Insert login and password";
    			t1 = space();
    			form_1 = element("form");
    			div0 = element("div");
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "Email";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label2 = element("label");
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			label3 = element("label");
    			span3 = element("span");
    			span3.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			label4 = element("label");
    			span4 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			br = element("br");
    			t12 = space();
    			label5 = element("label");
    			span5 = element("span");
    			t13 = text(/*message*/ ctx[1]);
    			t14 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "Login";
    			attr_dev(span0, "class", "label-text text-blue-500");
    			add_location(span0, file, 88, 16, 2727);
    			attr_dev(label0, "class", "label");
    			add_location(label0, file, 87, 12, 2688);
    			attr_dev(span1, "class", "label-text text-black");
    			add_location(span1, file, 94, 28, 3057);
    			attr_dev(label1, "class", "label");
    			add_location(label1, file, 93, 24, 3006);
    			attr_dev(input0, "class", "input input-accent input-bordered w-full max-w-xs text-black");
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "placeholder", "Enter email address");
    			add_location(input0, file, 96, 24, 3165);
    			attr_dev(span2, "class", "label-text text-red-600");
    			add_location(span2, file, 105, 28, 3614);
    			attr_dev(label2, "class", "label");
    			add_location(label2, file, 104, 24, 3563);
    			attr_dev(div0, "class", "form-control");
    			add_location(div0, file, 92, 20, 2954);
    			attr_dev(span3, "class", "label-text text-black");
    			add_location(span3, file, 113, 28, 4012);
    			attr_dev(label3, "class", "label");
    			add_location(label3, file, 112, 24, 3961);
    			attr_dev(input1, "class", "input input-accent input-bordered w-full max-w-xs text-black");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "Enter password");
    			add_location(input1, file, 115, 24, 4123);
    			attr_dev(span4, "class", "label-text text-red-600");
    			add_location(span4, file, 124, 28, 4580);
    			attr_dev(label4, "class", "label");
    			add_location(label4, file, 123, 24, 4529);
    			attr_dev(div1, "class", "form-control");
    			add_location(div1, file, 111, 20, 3909);
    			add_location(br, file, 129, 20, 4800);
    			attr_dev(span5, "class", "label-text text-red-600");
    			add_location(span5, file, 132, 24, 4953);
    			attr_dev(label5, "class", "label");
    			add_location(label5, file, 131, 20, 4906);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out");
    			attr_dev(button, "color", "primary");
    			attr_dev(button, "block", "");
    			attr_dev(button, "href", "pages/authentication/login");
    			add_location(button, file, 135, 24, 5111);
    			attr_dev(div2, "class", "form-control");
    			add_location(div2, file, 134, 20, 5059);
    			attr_dev(form_1, "id", "main");
    			add_location(form_1, file, 90, 16, 2838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label0, anchor);
    			append_dev(label0, span0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, div0);
    			append_dev(div0, label1);
    			append_dev(label1, span1);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*data*/ ctx[2].email);
    			append_dev(div0, t4);
    			append_dev(div0, label2);
    			append_dev(label2, span2);
    			append_dev(span2, t5);
    			append_dev(form_1, t6);
    			append_dev(form_1, div1);
    			append_dev(div1, label3);
    			append_dev(label3, span3);
    			append_dev(div1, t8);
    			append_dev(div1, input1);
    			set_input_value(input1, /*data*/ ctx[2].password);
    			append_dev(div1, t9);
    			append_dev(div1, label4);
    			append_dev(label4, span4);
    			append_dev(span4, t10);
    			append_dev(form_1, t11);
    			append_dev(form_1, br);
    			append_dev(form_1, t12);
    			append_dev(form_1, label5);
    			append_dev(label5, span5);
    			append_dev(span5, t13);
    			append_dev(form_1, t14);
    			append_dev(form_1, div2);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(button, "click", prevent_default(/*submit*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 4 && input0.value !== /*data*/ ctx[2].email) {
    				set_input_value(input0, /*data*/ ctx[2].email);
    			}

    			if (dirty & /*errors*/ 1 && t5_value !== (t5_value = error(/*errors*/ ctx[0], "email") + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*data*/ 4 && input1.value !== /*data*/ ctx[2].password) {
    				set_input_value(input1, /*data*/ ctx[2].password);
    			}

    			if (dirty & /*errors*/ 1 && t10_value !== (t10_value = error(/*errors*/ ctx[0], "password") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*message*/ 2) set_data_dev(t13, /*message*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(87:12) {#if $token == \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let br;
    	let t1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$token*/ ctx[3] == "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Managing namespaces";
    			br = element("br");
    			t1 = space();
    			div0 = element("div");
    			if_block.c();
    			add_location(h1, file, 81, 8, 2463);
    			add_location(br, file, 81, 36, 2491);
    			attr_dev(div0, "class", "justify-end card-body align:center");
    			add_location(div0, file, 84, 8, 2581);
    			attr_dev(div1, "class", "card shadow-xl image-full");
    			add_location(div1, file, 79, 4, 2348);
    			attr_dev(div2, "class", "p-3");
    			add_location(div2, file, 78, 0, 2325);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, br);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function error(map, name) {
    	if (!map) return "";

    	if (name in map) {
    		//document.getElementById(name).classList.add("text-red")
    		let label = document.querySelector("label[for='" + name + "']");

    		if (label) label.classList.add("text-red-500");
    		return map[name].join("<br>");
    	} else {
    		let label = document.querySelector("label[for='" + name + "']");
    		if (label) label.classList.remove("text-red-500");
    	} //document.getElementById(name).classList.remove("text-red")

    	return "";
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $token;
    	validate_store(token, 'token');
    	component_subscribe($$self, token, $$value => $$invalidate(3, $token = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let form = {};
    	let errors = {};
    	let isUser;
    	let message = "";
    	onMount(() => form = document.querySelector("form#main"));

    	var constraints = {
    		email: {
    			// Email is required
    			presence: true,
    			// and must be an email (duh)
    			email: true
    		},
    		password: {
    			// Password is also required
    			presence: true,
    			// And must be at least 5 characters long
    			length: {
    				minimum: 5,
    				message: "Troppo corta almeno 5 caratteri"
    			}
    		}
    	};

    	async function submit() {
    		// validate the form against the constraints
    		$$invalidate(0, errors = validate(form, constraints));

    		if (!errors) {
    			//alert("success");
    			isUser = await post("/login", data);

    			if ("error" in isUser) $$invalidate(1, message = isUser.error); else {
    				token.set(isUser.token);
    				loggedId.set(isUser.loggedId);
    			}
    		}
    	}

    	function logout() {
    		token.set("");
    		loggedId.set("");
    	}

    	let data = {
    		"username": "info@sciabarra.com",
    		"password": "openmed"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		data.email = this.value;
    		$$invalidate(2, data);
    	}

    	function input1_input_handler() {
    		data.password = this.value;
    		$$invalidate(2, data);
    	}

    	$$self.$capture_state = () => ({
    		get,
    		post,
    		del,
    		onMount,
    		token,
    		loggedId,
    		validate,
    		Inhome,
    		form,
    		errors,
    		isUser,
    		message,
    		error,
    		constraints,
    		submit,
    		logout,
    		data,
    		loggedUser,
    		$token
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) form = $$props.form;
    		if ('errors' in $$props) $$invalidate(0, errors = $$props.errors);
    		if ('isUser' in $$props) isUser = $$props.isUser;
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('constraints' in $$props) constraints = $$props.constraints;
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		errors,
    		message,
    		data,
    		$token,
    		submit,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Home$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Router.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;

    function create_fragment$1(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				page: /*page*/ ctx[0],
    				menu: /*menu*/ ctx[3],
    				title: /*title*/ ctx[1],
    				hideTitle: /*hideTitle*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layout_changes = {};
    			if (dirty & /*page*/ 1) layout_changes.page = /*page*/ ctx[0];
    			if (dirty & /*title*/ 2) layout_changes.title = /*title*/ ctx[1];
    			if (dirty & /*hideTitle*/ 4) layout_changes.hideTitle = /*hideTitle*/ ctx[2];
    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let page$1 = Home$1;
    	let title = "Home";
    	let hideTitle = true;
    	let menu = [];
    	page("/", () => $$invalidate(0, [page$1, title, hideTitle] = [Home$1, "Home", true], page$1, $$invalidate(1, title), $$invalidate(2, hideTitle)));

    	page("/app/user", () => {
    		console.log("cucu");
    		$$invalidate(0, [page$1, title, hideTitle] = [User, "user", true], page$1, $$invalidate(1, title), $$invalidate(2, hideTitle));
    	});

    	target.subscribe(url => {
    		console.log("routing url='" + url + "'", page);
    		if (url != '') page(url);
    	});

    	/* role.subscribe((r) => {
        menu = [];
        if (r != "") {
            
            menu.push({ path: "/app/calendar", name: "Appuntamenti" });
            if (r=="Infermiere" || r=="Amministratore" || r=="Stomaterapista"){
                menu.push({ path: "/app/schedule", name: "Prenota" });
                menu.push({ path: "/app/users", name: "Gestione" });
            }
            menu.push({ path: "/app/conference", name: "Conferenza" });
        }
        
    });



    router(
        "/app/calendar",
        () => $role!="" ? ([page, title, hideTitle] = [Calendar, "Appuntamenti", false]) : undefined
    );

    router(
        "/app/schedule",
        () => $role!="" ? ([page, title, hideTitle] = [Schedule, "Prenota", false]) : undefined
    );

    router(
        "/app/users",
        () => $role!="" ? ([page, title, hideTitle] = [Users, "Gestione", false]) : undefined
    );

    router(
        "/app/conference",
        () =>  ([page, title, hideTitle] = [Conference, "Conferenza", true])
    );

    */
    	page.start();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		router: page,
    		target,
    		Layout,
    		Home: Home$1,
    		User,
    		page: page$1,
    		title,
    		hideTitle,
    		menu
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page$1 = $$props.page);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('hideTitle' in $$props) $$invalidate(2, hideTitle = $$props.hideTitle);
    		if ('menu' in $$props) $$invalidate(3, menu = $$props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page$1, title, hideTitle, menu];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.2 */

    function create_fragment(ctx) {
    	let router;
    	let current;
    	router = new Router({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /*
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     *
     */
    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
