(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('vue'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'vue'], factory)
    : ((global = global || self),
      factory((global['vue3-virtual-scroller'] = {}), global.vue));
})(this, function (exports, vue) {
  'use strict';

  var config = {
    itemsLimit: 1000,
  };

  function _typeof(obj) {
    '@babel/helpers - typeof';

    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source),
        );
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key),
          );
        });
      }
    }

    return target;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(n);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length)
              return {
                done: true,
              };
            return {
              done: false,
              value: o[i++],
            };
          },
          e: function (e) {
            throw e;
          },
          f: F,
        };
      }

      throw new TypeError(
        'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
      );
    }

    var it,
      normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      },
    };
  }

  function getInternetExplorerVersion() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');

    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');

    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    } // other browser

    return -1;
  }

  let isIE;

  function initCompat() {
    if (!initCompat.init) {
      initCompat.init = true;
      isIE = getInternetExplorerVersion() !== -1;
    }
  }

  var script = {
    name: 'ResizeObserver',
    props: {
      showTrigger: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['notify'],

    setup(props, { emit }) {
      let _w = 0;
      let _h = 0;
      const elRef = vue.ref(null);
      let _resizeObject = null;

      const compareAndNotify = () => {
        if (_w !== elRef.value.offsetWidth || _h !== elRef.value.offsetHeight) {
          _w = elRef.value.offsetWidth;
          _h = elRef.value.offsetHeight;
          emit('notify', {
            width: _w,
            height: _h,
          });
        }
      };

      const addResizeHandlers = () => {
        _resizeObject.contentDocument.defaultView.addEventListener(
          'resize',
          compareAndNotify,
        );

        compareAndNotify();
      };

      const removeResizeHandlers = () => {
        if (_resizeObject && _resizeObject.onload) {
          if (!isIE && _resizeObject.contentDocument) {
            _resizeObject.contentDocument.defaultView.removeEventListener(
              'resize',
              compareAndNotify,
            );
          }

          elRef.value.removeChild(_resizeObject);
          _resizeObject.onload = null;
          _resizeObject = null;
        }
      };

      vue.onMounted(() => {
        initCompat();
        _w = elRef.value.offsetWidth;
        _h = elRef.value.offsetHeight;
        const object = document.createElement('object');
        _resizeObject = object;
        object.setAttribute('aria-hidden', 'true');
        object.setAttribute('tabindex', '-1');
        object.onload = addResizeHandlers;
        object.type = 'text/html';

        if (isIE) {
          elRef.value.appendChild(object);
        }

        object.data = 'about:blank';

        if (!isIE) {
          elRef.value.appendChild(object);
        }

        if (props.showTrigger) {
          compareAndNotify();
        }
      });
      vue.onBeforeUnmount(() => {
        removeResizeHandlers();
      });
      return {
        elRef,
      };
    },
  };

  const _hoisted_1 = {
    ref: 'elRef',
    class: 'vue3-resize-observer',
    tabindex: '-1',
  };
  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (
      vue.openBlock(),
      vue.createBlock(
        'div',
        _hoisted_1,
        null,
        512,
        /* NEED_PATCH */
      )
    );
  }

  script.render = render;
  script.__file = 'src/package/ResizeObserver/ResizeObserver.vue';

  script.install = function (app) {
    app.component(script.name, script);
  };

  function _typeof$1(obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof$1 = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof$1 = function (obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };
    }

    return _typeof$1(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return (
      _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
    );
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (
      Symbol.iterator in Object(iter) ||
      Object.prototype.toString.call(iter) === '[object Arguments]'
    )
      return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
  }

  function processOptions(value) {
    var options;

    if (typeof value === 'function') {
      // Simple options (callback-only)
      options = {
        callback: value,
      };
    } else {
      // Options object
      options = value;
    }

    return options;
  }
  function throttle(callback, delay) {
    var options =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var timeout;
    var lastState;
    var currentArgs;

    var throttled = function throttled(state) {
      for (
        var _len = arguments.length,
          args = new Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        args[_key - 1] = arguments[_key];
      }

      currentArgs = args;
      if (timeout && state === lastState) return;
      var leading = options.leading;

      if (typeof leading === 'function') {
        leading = leading(state, lastState);
      }

      if ((!timeout || state !== lastState) && leading) {
        callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
      }

      lastState = state;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
        timeout = 0;
      }, delay);
    };

    throttled._clear = function () {
      clearTimeout(timeout);
      timeout = null;
    };

    return throttled;
  }
  function deepEqual(val1, val2) {
    if (val1 === val2) return true;

    if (_typeof$1(val1) === 'object') {
      // eslint-disable-next-line no-restricted-syntax
      for (var key in val1) {
        if (!deepEqual(val1[key], val2[key])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  var VisibilityState =
    /*#__PURE__*/
    (function () {
      function VisibilityState(el, options, vnode) {
        _classCallCheck(this, VisibilityState);

        this.el = el;
        this.observer = null;
        this.frozen = false;
        this.createObserver(options, vnode);
      }

      _createClass(VisibilityState, [
        {
          key: 'createObserver',
          value: function createObserver(options) {
            var _this = this;

            if (this.observer) {
              this.destroyObserver();
            }

            if (this.frozen) return;
            this.options = processOptions(options);

            this.callback = function (result, entry) {
              _this.options.callback(result, entry);

              if (result && _this.options.once) {
                _this.frozen = true;

                _this.destroyObserver();
              }
            }; // Throttle

            if (this.callback && this.options.throttle) {
              var _ref = this.options.throttleOptions || {},
                _leading = _ref.leading;

              this.callback = throttle(this.callback, this.options.throttle, {
                leading: function leading(state) {
                  return (
                    _leading === 'both' ||
                    (_leading === 'visible' && state) ||
                    (_leading === 'hidden' && !state)
                  );
                },
              });
            }

            this.oldResult = undefined;
            this.observer = new IntersectionObserver(function (entries) {
              var entry = entries[0];

              if (entries.length > 1) {
                var intersectingEntry = entries.find(function (e) {
                  return e.isIntersecting;
                });

                if (intersectingEntry) {
                  entry = intersectingEntry;
                }
              }

              if (_this.callback) {
                // Use isIntersecting if possible because browsers can report isIntersecting as true, but intersectionRatio as 0, when something very slowly enters the viewport.
                var result =
                  entry.isIntersecting &&
                  entry.intersectionRatio >= _this.threshold;
                if (result === _this.oldResult) return;
                _this.oldResult = result;

                _this.callback(result, entry);
              }
            }, this.options.intersection); // Wait for the element to be in document

            setTimeout(function () {
              if (_this.observer) {
                _this.observer.observe(_this.el);
              }
            });
          },
        },
        {
          key: 'destroyObserver',
          value: function destroyObserver() {
            if (this.observer) {
              this.observer.disconnect();
              this.observer = null;
            } // Cancel throttled call

            if (this.callback && this.callback._clear) {
              this.callback._clear();

              this.callback = null;
            }
          },
        },
        {
          key: 'threshold',
          get: function get() {
            return (
              (this.options.intersection &&
                this.options.intersection.threshold) ||
              0
            );
          },
        },
      ]);

      return VisibilityState;
    })();

  function mounted(el, _ref2, vnode) {
    var value = _ref2.value;
    if (!value) return;

    if (typeof IntersectionObserver === 'undefined') {
      console.warn(
        '[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill',
      );
    } else {
      var state = new VisibilityState(el, value, vnode);
      el._vue_visibilityState = state;
    }
  }

  function unmounted(el) {
    var state = el._vue_visibilityState;

    if (state) {
      state.destroyObserver();
      delete el._vue_visibilityState;
    }
  }

  function componentUpdated(el, _ref3, vnode) {
    var value = _ref3.value,
      oldValue = _ref3.oldValue;
    if (deepEqual(value, oldValue)) return;
    var state = el._vue_visibilityState;

    if (!value) {
      unmounted(el);
      return;
    }

    if (state) {
      state.createObserver(value, vnode);
    } else {
      mounted(
        el,
        {
          value: value,
        },
        vnode,
      );
    }
  }

  var ObserveVisibility = {
    mounted: mounted,
    componentUpdated: componentUpdated,
    unmounted: unmounted,
  };

  var props = {
    items: {
      type: Array,
      required: true,
    },
    keyField: {
      type: String,
      default: 'id',
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: function validator(value) {
        return ['vertical', 'horizontal'].includes(value);
      },
    },
  };
  var scrollParent = function scrollParent(node) {
    var regex = /(auto|scroll)/;

    function parents(node, ps) {
      if (node.parentNode === null) {
        return ps;
      }

      return parents(node.parentNode, ps.concat([node]));
    }

    function style(node, prop) {
      return getComputedStyle(node, null).getPropertyValue(prop);
    }

    function overflow(node) {
      return (
        style(node, 'overflow') +
        style(node, 'overflow-y') +
        style(node, 'overflow-x')
      );
    }

    function scroll(node) {
      return regex.test(overflow(node));
    }

    function scrollParent(node) {
      if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return;
      }

      var ps = parents(node.parentNode, []);

      for (var i = 0; i < ps.length; i += 1) {
        if (scroll(ps[i])) {
          return ps[i];
        }
      }

      return document.scrollingElement || document.documentElement;
    }

    return scrollParent(node);
  };
  function simpleArray() {
    return this.items.length && _typeof(this.items[0]) !== 'object';
  }

  var supportsPassive = false;

  if (typeof window !== 'undefined') {
    supportsPassive = false;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  var uid = 0;
  var script$1 = vue.defineComponent({
    name: 'RecycleScroller',
    components: {
      ResizeObserver: script,
    },
    directives: {
      ObserveVisibility: ObserveVisibility,
    },
    props: _objectSpread2({}, props, {
      itemSize: {
        type: Number,
        default: null,
      },
      minItemSize: {
        type: [Number, String],
        default: null,
      },
      sizeField: {
        type: String,
        default: 'size',
      },
      typeField: {
        type: String,
        default: 'type',
      },
      buffer: {
        type: Number,
        default: 200,
      },
      pageMode: {
        type: Boolean,
        default: false,
      },
      prerender: {
        type: Number,
        default: 0,
      },
      emitUpdate: {
        type: Boolean,
        default: false,
      },
    }),
    emits: ['visible', 'hidden', 'resize', 'update', 'bottom'],
    data: function data() {
      return {
        pool: [],
        totalSize: 0,
        ready: false,
        hoverKey: null,
      };
    },
    computed: {
      sizes: function sizes() {
        if (this.itemSize === null) {
          var sizes = {
            '-1': {
              accumulator: 0,
            },
          };
          var items = this.items;
          var field = this.sizeField;
          var minItemSize = this.minItemSize;
          var computedMinSize = 10000;
          var accumulator = 0;
          var current;

          for (var i = 0, l = items.length; i < l; i++) {
            current = items[i][field] || minItemSize;

            if (current < computedMinSize) {
              computedMinSize = current;
            }

            accumulator += current;
            sizes[i] = {
              accumulator: accumulator,
              size: current,
            };
          } // eslint-disable-next-line

          this.$_computedMinItemSize = computedMinSize;
          return sizes;
        }

        return [];
      },
      simpleArray: simpleArray,
    },
    watch: {
      items: function items() {
        this.updateVisibleItems(true);
      },
      pageMode: function pageMode() {
        this.applyPageMode();
        this.updateVisibleItems(false);
      },
      sizes: {
        handler: function handler() {
          this.updateVisibleItems(false);
        },
        deep: true,
      },
    },
    created: function created() {
      this.$_startIndex = 0;
      this.$_endIndex = 0;
      this.$_views = new Map();
      this.$_unusedViews = new Map();
      this.$_scrollDirty = false;
      this.$_lastUpdateScrollPosition = 0; // In SSR mode, we also prerender the same number of item for the first render
      // to avoir mismatch between server and client templates

      if (this.prerender) {
        this.$_prerender = true;
        this.updateVisibleItems(false);
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.applyPageMode();
      this.$nextTick(function () {
        // In SSR mode, render the real number of visible items
        _this.$_prerender = false;

        _this.updateVisibleItems(true);

        _this.ready = true;
      });
    },
    beforeUnmount: function beforeUnmount() {
      this.removeListeners();
    },
    methods: {
      addView: function addView(pool, index, item, key, type) {
        var view = {
          item: item,
          position: 0,
        };
        view.nr = {
          id: uid++,
          index: index,
          used: true,
          key: key,
          type: type,
        };
        pool.push(view);
        return view;
      },
      unuseView: function unuseView(view) {
        var fake =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
        var unusedViews = this.$_unusedViews;
        var type = view.nr.type;
        var unusedPool = unusedViews.get(type);

        if (!unusedPool) {
          unusedPool = [];
          unusedViews.set(type, unusedPool);
        }

        unusedPool.push(view);

        if (!fake) {
          view.nr.used = false;
          view.position = -9999;
          this.$_views.delete(view.nr.key);
        }
      },
      handleResize: function handleResize() {
        this.$emit('resize');
        if (this.ready) this.updateVisibleItems(false);
      },
      handleScroll: function handleScroll(event) {
        var _this2 = this;

        if (!this.$_scrollDirty) {
          this.$_scrollDirty = true;
          requestAnimationFrame(function () {
            _this2.$_scrollDirty = false;

            var _this2$updateVisibleI = _this2.updateVisibleItems(false, true),
              continuous = _this2$updateVisibleI.continuous; // It seems sometimes chrome doesn't fire scroll event :/
            // When non continous scrolling is ending, we force a refresh

            if (!continuous) {
              clearTimeout(_this2.$_refreshTimout);
              _this2.$_refreshTimout = setTimeout(_this2.handleScroll, 100);
            }
          });
        }
      },
      handleVisibilityChange: function handleVisibilityChange(
        isVisible,
        entry,
      ) {
        var _this3 = this;

        if (this.ready) {
          if (
            isVisible ||
            entry.boundingClientRect.width !== 0 ||
            entry.boundingClientRect.height !== 0
          ) {
            this.$emit('visible');
            requestAnimationFrame(function () {
              _this3.updateVisibleItems(false);
            });
          } else {
            this.$emit('hidden');
          }
        }
      },
      updateVisibleItems: function updateVisibleItems(checkItem) {
        var checkPositionDiff =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
        var itemSize = this.itemSize;
        var minItemSize = this.$_computedMinItemSize;
        var typeField = this.typeField;
        var keyField = this.simpleArray ? null : this.keyField;
        var items = this.items;
        var count = items.length;
        var sizes = this.sizes;
        var views = this.$_views;
        var unusedViews = this.$_unusedViews;
        var pool = this.pool;
        var startIndex, endIndex;
        var totalSize;

        if (!count) {
          startIndex = endIndex = totalSize = 0;
        } else if (this.$_prerender) {
          startIndex = 0;
          endIndex = this.prerender;
          totalSize = null;
        } else {
          var scroll = this.getScroll(); // Skip update if use hasn't scrolled enough

          if (checkPositionDiff) {
            var positionDiff = scroll.start - this.$_lastUpdateScrollPosition;
            if (positionDiff < 0) positionDiff = -positionDiff;

            if (
              (itemSize === null && positionDiff < minItemSize) ||
              positionDiff < itemSize
            ) {
              return {
                continuous: true,
              };
            }
          }

          this.$_lastUpdateScrollPosition = scroll.start;
          var buffer = this.buffer;
          scroll.start -= buffer;
          scroll.end += buffer; // Variable size mode

          if (itemSize === null) {
            var h;
            var a = 0;
            var b = count - 1;
            var i = ~~(count / 2);
            var oldI; // Searching for startIndex

            do {
              oldI = i;
              h = sizes[i].accumulator;

              if (h < scroll.start) {
                a = i;
              } else if (
                i < count - 1 &&
                sizes[i + 1].accumulator > scroll.start
              ) {
                b = i;
              }

              i = ~~((a + b) / 2);
            } while (i !== oldI);

            i < 0 && (i = 0);
            startIndex = i; // For container style

            totalSize = sizes[count - 1].accumulator; // Searching for endIndex

            for (
              endIndex = i;
              endIndex < count && sizes[endIndex].accumulator < scroll.end;
              endIndex++
            ) {}

            if (endIndex === -1) {
              endIndex = items.length - 1;
            } else {
              endIndex++; // Bounds

              endIndex > count && (endIndex = count);
            }
          } else {
            // Fixed size mode
            startIndex = ~~(scroll.start / itemSize);
            endIndex = Math.ceil(scroll.end / itemSize); // Bounds

            startIndex < 0 && (startIndex = 0);
            endIndex > count && (endIndex = count);
            totalSize = count * itemSize;
          }
        }

        if (endIndex - startIndex > config.itemsLimit) {
          this.itemsLimitError();
        }

        this.totalSize = totalSize;
        var view;
        var continuous =
          startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;

        if (this.$_continuous !== continuous) {
          if (continuous) {
            views.clear();
            unusedViews.clear();

            for (var _i = 0, l = pool.length; _i < l; _i++) {
              view = pool[_i];
              this.unuseView(view);
            }
          }

          this.$_continuous = continuous;
        } else if (continuous) {
          for (var _i2 = 0, _l = pool.length; _i2 < _l; _i2++) {
            view = pool[_i2];

            if (view.nr.used) {
              // Update view item index
              if (checkItem) {
                view.nr.index = items.findIndex(function (item) {
                  return keyField
                    ? item[keyField] === view.item[keyField]
                    : item === view.item;
                });
              } // Check if index is still in visible range

              if (
                view.nr.index === -1 ||
                view.nr.index < startIndex ||
                view.nr.index >= endIndex
              ) {
                this.unuseView(view);
              }
            }
          }
        }

        var unusedIndex = continuous ? null : new Map();
        var item, type, unusedPool;
        var v;

        for (var _i3 = startIndex; _i3 < endIndex; _i3++) {
          item = items[_i3];
          var key = keyField ? item[keyField] : item;

          if (key == null) {
            throw new Error(
              'Key is '
                .concat(key, " on item (keyField is '")
                .concat(keyField, "')"),
            );
          }

          view = views.get(key);

          if (!itemSize && !sizes[_i3].size) {
            if (view) this.unuseView(view);
            continue;
          } // No view assigned to item

          if (!view) {
            type = item[typeField];
            unusedPool = unusedViews.get(type);

            if (continuous) {
              // Reuse existing view
              if (unusedPool && unusedPool.length) {
                view = unusedPool.pop();
                view.item = item;
                view.nr.used = true;
                view.nr.index = _i3;
                view.nr.key = key;
                view.nr.type = type;
              } else {
                view = this.addView(pool, _i3, item, key, type);
              }
            } else {
              // Use existing view
              // We don't care if they are already used
              // because we are not in continous scrolling
              v = unusedIndex.get(type) || 0;

              if (!unusedPool || v >= unusedPool.length) {
                view = this.addView(pool, _i3, item, key, type);
                this.unuseView(view, true);
                unusedPool = unusedViews.get(type);
              }

              view = unusedPool[v];
              view.item = item;
              view.nr.used = true;
              view.nr.index = _i3;
              view.nr.key = key;
              view.nr.type = type;
              unusedIndex.set(type, v + 1);
              v++;
            }

            views.set(key, view);
          } else {
            view.nr.used = true;
            view.item = item;
          } // Update position

          if (itemSize === null) {
            view.position = sizes[_i3 - 1].accumulator;
          } else {
            view.position = _i3 * itemSize;
          }
        }

        this.$_startIndex = startIndex;
        this.$_endIndex = endIndex;
        if (this.emitUpdate) this.$emit('update', startIndex, endIndex);
        if (endIndex === this.items.length)
          this.$emit('bottom', startIndex, endIndex); // After the user has finished scrolling
        // Sort views so text selection is correct

        clearTimeout(this.$_sortTimer);
        this.$_sortTimer = setTimeout(this.sortViews, 300);
        return {
          continuous: continuous,
        };
      },
      getListenerTarget: function getListenerTarget() {
        var target = scrollParent(this.$el); // Fix global scroll target for Chrome and Safari

        if (
          window.document &&
          (target === window.document.documentElement ||
            target === window.document.body)
        ) {
          target = window;
        }

        return target;
      },
      getScroll: function getScroll() {
        var el = this.$el,
          direction = this.direction;
        var isVertical = direction === 'vertical';
        var scrollState;

        if (this.pageMode) {
          var bounds = el.getBoundingClientRect();
          var boundsSize = isVertical ? bounds.height : bounds.width;
          var start = -(isVertical ? bounds.top : bounds.left);
          var size = isVertical ? window.innerHeight : window.innerWidth;

          if (start < 0) {
            size += start;
            start = 0;
          }

          if (start + size > boundsSize) {
            size = boundsSize - start;
          }

          scrollState = {
            start: start,
            end: start + size,
          };
        } else if (isVertical) {
          scrollState = {
            start: el.scrollTop,
            end: el.scrollTop + el.clientHeight,
          };
        } else {
          scrollState = {
            start: el.scrollLeft,
            end: el.scrollLeft + el.clientWidth,
          };
        }

        return scrollState;
      },
      applyPageMode: function applyPageMode() {
        if (this.pageMode) {
          this.addListeners();
        } else {
          this.removeListeners();
        }
      },
      addListeners: function addListeners() {
        this.listenerTarget = this.getListenerTarget();
        this.listenerTarget.addEventListener(
          'scroll',
          this.handleScroll,
          supportsPassive
            ? {
                passive: true,
              }
            : false,
        );
        this.listenerTarget.addEventListener('resize', this.handleResize);
      },
      removeListeners: function removeListeners() {
        if (!this.listenerTarget) {
          return;
        }

        this.listenerTarget.removeEventListener('scroll', this.handleScroll);
        this.listenerTarget.removeEventListener('resize', this.handleResize);
        this.listenerTarget = null;
      },
      scrollToItem: function scrollToItem(index) {
        var scroll;

        if (this.itemSize === null) {
          scroll = index > 0 ? this.sizes[index - 1].accumulator : 0;
        } else {
          scroll = index * this.itemSize;
        }

        this.scrollToPosition(scroll);
      },
      scrollToPosition: function scrollToPosition(position) {
        if (this.direction === 'vertical') {
          this.$el.scrollTop = position;
        } else {
          this.$el.scrollLeft = position;
        }
      },
      itemsLimitError: function itemsLimitError() {
        var _this4 = this;

        setTimeout(function () {
          console.log(
            "It seems the scroller element isn't scrolling, so it tries to render all the items at once.",
            'Scroller:',
            _this4.$el,
          );
          console.log(
            "Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.",
          );
        });
        throw new Error('Rendered items limit reached');
      },
      sortViews: function sortViews() {
        this.pool.sort(function (viewA, viewB) {
          return viewA.nr.index - viewB.nr.index;
        });
      },
    },
  });

  var _hoisted_1$1 = {
    key: 0,
    class: 'vue-recycle-scroller__slot',
  };
  var _hoisted_2 = {
    key: 1,
    class: 'vue-recycle-scroller__slot',
  };
  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_ResizeObserver = vue.resolveComponent('ResizeObserver');

    var _directive_observe_visibility =
      vue.resolveDirective('observe-visibility');

    return vue.withDirectives(
      (vue.openBlock(),
      vue.createBlock(
        'div',
        {
          class: [
            'vue-recycle-scroller',
            _defineProperty(
              {
                ready: _ctx.ready,
                'page-mode': _ctx.pageMode,
              },
              'direction-'.concat(_ctx.direction),
              true,
            ),
          ],
          onScrollPassive:
            _cache[2] ||
            (_cache[2] = function () {
              return _ctx.handleScroll.apply(_ctx, arguments);
            }),
        },
        [
          _ctx.$slots.before
            ? (vue.openBlock(),
              vue.createBlock('div', _hoisted_1$1, [
                vue.renderSlot(_ctx.$slots, 'before'),
              ]))
            : vue.createCommentVNode('v-if', true),
          vue.createVNode(
            'div',
            {
              ref: 'wrapper',
              style: _defineProperty(
                {},
                _ctx.direction === 'vertical' ? 'minHeight' : 'minWidth',
                _ctx.totalSize + 'px',
              ),
              class: 'vue-recycle-scroller__item-wrapper',
            },
            [
              (vue.openBlock(true),
              vue.createBlock(
                vue.Fragment,
                null,
                vue.renderList(_ctx.pool, function (view) {
                  return (
                    vue.openBlock(),
                    vue.createBlock(
                      'div',
                      {
                        key: view.nr.id,
                        style: _ctx.ready
                          ? {
                              transform: 'translate'
                                .concat(
                                  _ctx.direction === 'vertical' ? 'Y' : 'X',
                                  '(',
                                )
                                .concat(view.position, 'px)'),
                            }
                          : null,
                        class: [
                          'vue-recycle-scroller__item-view',
                          {
                            hover: _ctx.hoverKey === view.nr.key,
                          },
                        ],
                        onMouseenter: function onMouseenter($event) {
                          return (_ctx.hoverKey = view.nr.key);
                        },
                        onMouseleave:
                          _cache[1] ||
                          (_cache[1] = function ($event) {
                            return (_ctx.hoverKey = null);
                          }),
                      },
                      [
                        vue.renderSlot(_ctx.$slots, 'default', {
                          item: view.item,
                          index: view.nr.index,
                          active: view.nr.used,
                        }),
                      ],
                      46,
                      /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */
                      ['onMouseenter'],
                    )
                  );
                }),
                128,
                /* KEYED_FRAGMENT */
              )),
            ],
            4,
            /* STYLE */
          ),
          _ctx.$slots.after
            ? (vue.openBlock(),
              vue.createBlock('div', _hoisted_2, [
                vue.renderSlot(_ctx.$slots, 'after'),
              ]))
            : vue.createCommentVNode('v-if', true),
          vue.createVNode(
            _component_ResizeObserver,
            {
              onNotify: _ctx.handleResize,
            },
            null,
            8,
            /* PROPS */
            ['onNotify'],
          ),
        ],
        34,
        /* CLASS, HYDRATE_EVENTS */
      )),
      [[_directive_observe_visibility, _ctx.handleVisibilityChange]],
    );
  }

  script$1.render = render$1;
  script$1.__file = 'src/components/RecycleScroller.vue';

  var script$2 = {
    name: 'DynamicScroller',
    components: {
      RecycleScroller: script$1,
    },
    provide: function provide() {
      var _this = this;

      var vscrollResizeObserver = undefined;

      if (typeof ResizeObserver !== 'undefined') {
        vscrollResizeObserver = new ResizeObserver(function (entries) {
          var _iterator = _createForOfIteratorHelper(entries),
            _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              var entry = _step.value;

              if (entry.target) {
                var event = new CustomEvent('resize', {
                  detail: {
                    contentRect: entry.contentRect,
                  },
                });
                entry.target.dispatchEvent(event);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        });
      }

      return {
        vscrollData: this.vscrollData,
        vscrollParent: this,
        vscrollResizeObserver: vscrollResizeObserver,
        onUpdateScroll: function onUpdateScroll(cb) {
          return _this.vScrollMap.push(cb);
        },
      };
    },
    inheritAttrs: false,
    props: _objectSpread2({}, props, {
      minItemSize: {
        type: [Number, String],
        required: true,
      },
    }),
    emits: ['vscroll:update', 'resize', 'visible'],
    data: function data() {
      return {
        vscrollData: {
          active: true,
          sizes: {},
          validSizes: {},
          keyField: this.keyField,
          simpleArray: false,
        },
        vScrollMap: [],
      };
    },
    computed: {
      simpleArray: simpleArray,
      itemsWithSize: function itemsWithSize() {
        var result = [];
        var items = this.items,
          keyField = this.keyField,
          simpleArray = this.simpleArray;
        var sizes = this.vscrollData.sizes;

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var id = simpleArray ? i : item[keyField];
          var size = sizes[id];

          if (typeof size === 'undefined' && !this.$_undefinedMap[id]) {
            size = 0;
          }

          result.push({
            item: item,
            id: id,
            size: size,
          });
        }

        return result;
      },
      listeners: function listeners() {
        var listeners = {};

        for (var key in this.$attrs) {
          if (key.startsWith('on')) {
            if (key !== 'onResize' && key !== 'onVisible') {
              listeners[key] = this.$attrs;
            }
          }
        }

        return listeners;
      },
    },
    watch: {
      items: function items() {
        this.forceUpdate(false);
      },
      simpleArray: {
        handler: function handler(value) {
          this.vscrollData.simpleArray = value;
        },
        immediate: true,
      },
      direction: function direction(value) {
        this.forceUpdate(true);
      },
    },
    created: function created() {
      this.$_updates = [];
      this.$_undefinedSizes = 0;
      this.$_undefinedMap = {};
    },
    activated: function activated() {
      this.vscrollData.active = true;
    },
    deactivated: function deactivated() {
      this.vscrollData.active = false;
    },
    methods: {
      onScrollerResize: function onScrollerResize() {
        var scroller = this.$refs.scroller;

        if (scroller) {
          this.forceUpdate();
        }

        this.$emit('resize');
      },
      onScrollerVisible: function onScrollerVisible() {
        this.vScrollUpdate(false);
        this.$emit('visible');
      },
      vScrollUpdate: function vScrollUpdate() {
        var force =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : false;
        var data = {
          force: force,
        };
        this.$emit('vscroll:update', data);
        this.vScrollMap.forEach(function (callback) {
          return callback(data);
        });
      },
      forceUpdate: function forceUpdate() {
        var clear =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : true;

        if (clear || this.simpleArray) {
          this.vscrollData.validSizes = {};
        }

        this.vScrollUpdate(true);
      },
      scrollToItem: function scrollToItem(index) {
        var scroller = this.$refs.scroller;
        if (scroller) scroller.scrollToItem(index);
      },
      getItemSize: function getItemSize(item) {
        var index =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : undefined;
        var id = this.simpleArray
          ? index != null
            ? index
            : this.items.indexOf(item)
          : item[this.keyField];
        return this.vscrollData.sizes[id] || 0;
      },
      scrollToBottom: function scrollToBottom() {
        var _this2 = this;

        if (this.$_scrollingToBottom) return;
        this.$_scrollingToBottom = true;
        var el = this.$el; // Item is inserted to the DOM

        this.$nextTick(function () {
          el.scrollTop = el.scrollHeight + 5000; // Item sizes are computed

          var cb = function cb() {
            el.scrollTop = el.scrollHeight + 5000;
            requestAnimationFrame(function () {
              el.scrollTop = el.scrollHeight + 5000;

              if (_this2.$_undefinedSizes === 0) {
                _this2.$_scrollingToBottom = false;
              } else {
                requestAnimationFrame(cb);
              }
            });
          };

          requestAnimationFrame(cb);
        });
      },
    },
  };

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_RecycleScroller = vue.resolveComponent('RecycleScroller');

    return (
      vue.openBlock(),
      vue.createBlock(
        _component_RecycleScroller,
        vue.mergeProps(
          {
            ref: 'scroller',
            items: $options.itemsWithSize,
            'min-item-size': $props.minItemSize,
            direction: _ctx.direction,
            'key-field': 'id',
          },
          _ctx.$attrs,
          {
            onResize: $options.onScrollerResize,
            onVisible: $options.onScrollerVisible,
          },
          vue.toHandlers($options.listeners),
        ),
        {
          default: vue.withCtx(function (_ref) {
            var itemWithSize = _ref.item,
              index = _ref.index,
              active = _ref.active;
            return [
              vue.renderSlot(_ctx.$slots, 'default', {
                item: itemWithSize.item,
                index: index,
                active: active,
                itemWithSize: itemWithSize,
              }),
            ];
          }),
          before: vue.withCtx(function () {
            return [vue.renderSlot(_ctx.$slots, 'before')];
          }),
          after: vue.withCtx(function () {
            return [vue.renderSlot(_ctx.$slots, 'after')];
          }),
          _: 1,
        },
        16,
        /* FULL_PROPS */
        ['items', 'min-item-size', 'direction', 'onResize', 'onVisible'],
      )
    );
  }

  script$2.render = render$2;
  script$2.__file = 'src/components/DynamicScroller.vue';

  var DynamicScrollerItem = {
    name: 'DynamicScrollerItem',
    inject: [
      'vscrollData',
      'vscrollParent',
      'onUpdateScroll',
      'vscrollResizeObserver',
    ],
    props: {
      item: {
        required: true,
      },
      watchData: {
        type: Boolean,
        default: false,
      },

      /**
       * Indicates if the view is actively used to display an item.
       */
      active: {
        type: Boolean,
        required: true,
      },
      index: {
        type: Number,
        default: undefined,
      },
      sizeDependencies: {
        type: [Array, Object],
        default: null,
      },
      emitResize: {
        type: Boolean,
        default: false,
      },
      tag: {
        type: String,
        default: 'div',
      },
    },
    computed: {
      id: function id() {
        return this.vscrollData.simpleArray
          ? this.index
          : this.item[this.vscrollData.keyField];
      },
      size: function size() {
        return (
          (this.vscrollData.validSizes[this.id] &&
            this.vscrollData.sizes[this.id]) ||
          0
        );
      },
      finalActive: function finalActive() {
        return this.active && this.vscrollData.active;
      },
    },
    watch: {
      watchData: 'updateWatchData',
      id: function id() {
        if (!this.size) {
          this.onDataUpdate();
        }
      },
      finalActive: function finalActive(value) {
        if (!this.size) {
          if (value) {
            if (!this.vscrollParent.$_undefinedMap[this.id]) {
              this.vscrollParent.$_undefinedSizes++;
              this.vscrollParent.$_undefinedMap[this.id] = true;
            }
          } else {
            if (this.vscrollParent.$_undefinedMap[this.id]) {
              this.vscrollParent.$_undefinedSizes--;
              this.vscrollParent.$_undefinedMap[this.id] = false;
            }
          }
        }

        if (this.vscrollResizeObserver) {
          if (value) {
            this.observeSize();
          } else {
            this.unobserveSize();
          }
        } else if (value && this.$_pendingVScrollUpdate === this.id) {
          this.updateSize();
        }
      },
    },
    created: function created() {
      var _this = this;

      if (this.$isServer) return;
      this.$_forceNextVScrollUpdate = null;
      this.updateWatchData();

      if (!this.vscrollResizeObserver) {
        var _loop = function _loop(k) {
          _this.$watch(function () {
            return _this.sizeDependencies[k];
          }, _this.onDataUpdate);
        };

        for (var k in this.sizeDependencies) {
          _loop(k);
        }

        this.onUpdateScroll('vscroll:update', this.onVscrollUpdate);
      }
    },
    mounted: function mounted() {
      if (this.vscrollData.active) {
        this.updateSize();
        this.observeSize();
      }
    },
    beforeUnmount: function beforeUnmount() {
      this.unobserveSize();
    },
    methods: {
      updateSize: function updateSize() {
        if (this.finalActive) {
          if (this.$_pendingSizeUpdate !== this.id) {
            this.$_pendingSizeUpdate = this.id;
            this.$_forceNextVScrollUpdate = null;
            this.$_pendingVScrollUpdate = null;
            this.computeSize(this.id);
          }
        } else {
          this.$_forceNextVScrollUpdate = this.id;
        }
      },
      updateWatchData: function updateWatchData() {
        var _this2 = this;

        if (this.watchData) {
          this.$_watchData = this.$watch(
            'data',
            function () {
              _this2.onDataUpdate();
            },
            {
              deep: true,
            },
          );
        } else if (this.$_watchData) {
          this.$_watchData();
          this.$_watchData = null;
        }
      },
      onVscrollUpdate: function onVscrollUpdate(_ref) {
        var force = _ref.force;

        // If not active, sechedule a size update when it becomes active
        if (!this.finalActive && force) {
          this.$_pendingVScrollUpdate = this.id;
        }

        if (this.$_forceNextVScrollUpdate === this.id || force || !this.size) {
          this.updateSize();
        }
      },
      onDataUpdate: function onDataUpdate() {
        this.updateSize();
      },
      computeSize: function computeSize(id) {
        var _this3 = this;

        vue
          .nextTick(function () {
            if (_this3.id === id) {
              var width = _this3.$el.offsetWidth;
              var height = _this3.$el.offsetHeight;

              _this3.applySize(width, height);
            }

            _this3.$_pendingSizeUpdate = null;
          })
          .then();
      },
      applySize: function applySize(width, height) {
        var size = Math.round(
          this.vscrollParent.direction === 'vertical' ? height : width,
        );

        if (size && this.size !== size) {
          if (this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes--;
            this.vscrollParent.$_undefinedMap[this.id] = undefined;
          }

          this.vscrollData.sizes[this.id] = size;
          this.vscrollData.validSizes[this.id] = true;
          if (this.emitResize) this.$emit('resize', this.id);
        }
      },
      observeSize: function observeSize() {
        if (!this.vscrollResizeObserver) return;
        this.vscrollResizeObserver.observe(this.$el.parentNode);
        this.$el.parentNode.addEventListener('resize', this.onResize);
      },
      unobserveSize: function unobserveSize() {
        if (!this.vscrollResizeObserver) return;
        this.vscrollResizeObserver.unobserve(this.$el.parentNode);
        this.$el.parentNode.removeEventListener('resize', this.onResize);
      },
      onResize: function onResize(event) {
        var _event$detail$content = event.detail.contentRect,
          width = _event$detail$content.width,
          height = _event$detail$content.height;
        this.applySize(width, height);
      },
    },
    render: function render() {
      return vue.createVNode(this.tag, null, this.$slots.default());
    },
  };

  var version = '0.2.3';

  function registerComponents(app, prefix) {
    app.component(''.concat(prefix, 'recycle-scroller'), script$1);
    app.component(''.concat(prefix, 'RecycleScroller'), script$1);
    app.component(''.concat(prefix, 'dynamic-scroller'), script$2);
    app.component(''.concat(prefix, 'DynamicScroller'), script$2);
    app.component(
      ''.concat(prefix, 'dynamic-scroller-item'),
      DynamicScrollerItem,
    );
    app.component(
      ''.concat(prefix, 'DynamicScrollerItem'),
      DynamicScrollerItem,
    );
  }

  var plugin = {
    version: version,
    install: function install(app, options) {
      var finalOptions = Object.assign(
        {},
        {
          installComponents: true,
          componentsPrefix: '',
        },
        options,
      );

      for (var key in finalOptions) {
        if (typeof finalOptions[key] !== 'undefined') {
          config[key] = finalOptions[key];
        }
      }

      if (finalOptions.installComponents) {
        registerComponents(app, finalOptions.componentsPrefix);
      }
    },
  };

  exports.DynamicScroller = script$2;
  exports.DynamicScrollerItem = DynamicScrollerItem;
  exports.RecycleScroller = script$1;
  exports.default = plugin;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=vue3-virtual-scroller.umd.js.map
