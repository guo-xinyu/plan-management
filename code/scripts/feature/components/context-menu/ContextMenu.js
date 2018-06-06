// define(function() {
//   function Contextmenu(opts) {
//     var defaults = {
//       fadeSpeed: 100,
//       container: 'body',
//       above: 'auto',
//       items: {},
//       show: $.noop,
//       hide: $.noop,
//       trigger: 'contextmenu'
//     };
//     opts = $.extend({}, defaults, opts)
//     this.opts = {};
//     this.opts.contextmenu = opts;
//     this._delegateContextmenuEvents(opts);
//     this._createContextmenu(opts);
//   }

//   Contextmenu.prototype._delegateContextmenuEvents = function(o) {
//     $(this.opts.contextmenu.container).off('click')
//       .on({ 'click': this._hideContextmenu, 'contextmenu': this._hideContextmenu }, o)
//       .on('click', '.topo-dropdown-context li', o, this._contextItemClick)
//       .on('contextmenu', '.topo-dropdown-context', function(e) {
//         e.preventDefault();
//       });
//   }
//   Contextmenu.prototype._createContextmenu = function(o) {
//     $(this.opts.contextmenu.container).append(_createMenu(o, true));

//     function _createMenu(opt, root, cfg) {
//       var $li, $a;

//       if (cfg === undefined) {
//         cfg = opt;
//       }
//       opt.$menu = root ? $('<ul class="dropdown-menu topo-dropdown-context"></ul>') : $('<ul class="dropdown-menu topo-dropdown-context topo-dropdown-context-sub"></ul>');
//       opt.$menu.data({
//         'contextMenu': opt,
//         'contextMenuRoot': cfg
//       });
//       opt.callbacks = {};
//       if (!cfg.callbacks) {
//         cfg.callbacks = {};
//       }

//       $.each(opt.items, function(key, item) {
//         $li = $('<li></li>');
//         $a = $('<a href="#"></a>');
//         if (item.disabled) {
//           $a = $('<a href="javascript:void(0)" class="disabled"></a>');
//         }
//         item.$node = $li.data({
//           'contextMenu': opt,
//           'contextMenuRoot': cfg,
//           'contextMenuKey': key
//         });
//         if (item.items) {
//           item.appendTo = item.$node;
//           $a.append(item.name || '');
//           $li.append($a)
//             .append(_createMenu(item, false, cfg))
//             .addClass('topo-dropdown-submenu')
//             .data('contextMenu', item);
//           item.callback = null;
//         } else {
//           $.each([opt, cfg], function(i, k) {
//             if ($.isFunction(item.callback)) {
//               k.callbacks[key] = item.callback;
//             }
//           });
//           $a.append(item.name || '');
//           $li.append($a);
//         }
//         opt.$menu.append($li);
//       });
//       return opt.$menu;
//     }
//   }

//   Contextmenu.prototype.buildMenu = function(e, trigger) {
//     e = $.extend(e, { data: this.opts.contextmenu });
//     var $contextmenu = e.data.$menu;
//     e.data.$trigger = trigger;
//     e.data.contextmenuEl = e.target;
//     $('.topo-dropdown-context:not(.topo-dropdown-context-sub)').hide();
//     if (typeof e.data.above == 'boolean' && e.data.above) {
//       $contextmenu.addClass('dropdown-context-up').css({
//         top: e.pageY - $contextmenu.height(),
//         left: e.pageX - 13
//       }).fadeIn(e.data.fadeSpeed);
//     } else if (typeof e.data.above == 'string' && e.data.above == 'auto') {
//       var autoH = $contextmenu.height() + 12;
//       var autoW = $contextmenu.width();
//       var htmlH = $('html').height();
//       var htmlW = $('html').width();
//       var left, top, right;
//       if ((e.pageY + autoH) > htmlH) {
//         top = e.pageY - autoH;
//       } else {
//         top = e.pageY;
//       }
//       if ((e.pageX + autoW) > htmlW) { //距离右边没有空间了
//         left = 'auto';
//         right = 0;
//       } else {
//         left = e.pageX - 13;
//         right = 'auto';
//       }
//       $contextmenu.css({
//         top: top,
//         left: left,
//         right: right
//       }).fadeIn(e.data.fadeSpeed);
//     }
//     e.data.show.call(this, e);
//   }

//   Contextmenu.prototype._contextItemClick = function(e) {
//     var $this = $(this),
//       data = $this.data(),
//       opt = data.contextMenu,
//       root = data.contextMenuRoot,
//       key = data.contextMenuKey,
//       callback;

//     if (!opt.items[key] || $this.is('.topo-dropdown-submenu')) {
//       return;
//     }

//     e.preventDefault();

//     if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
//       callback = root.callbacks[key];
//     } else if ($.isFunction(root.callback)) {
//       callback = root.callback;
//     } else {
//       return;
//     }

//     callback.call(root.$trigger, e, opt.items[key]);
//   }

//   Contextmenu.prototype._hideContextmenu = function(e) {
//     if ($('.topo-dropdown-context').is(":visible")) {
//       $('.topo-dropdown-context').fadeOut(e.data.fadeSpeed, function() {
//         $('.topo-dropdown-context').css({ display: '' });
//       });
//       e.data.hide.call(this, this);
//     }
//   }
//   return Contextmenu;
// });
