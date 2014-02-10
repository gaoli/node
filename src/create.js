/**
 * @ignore
 * @file node-create
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var RE_TAG        = /<([\w:]+)/,
    RE_XHTML_TAG  = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    RE_SINGLE_TAG = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

var div        = doc.createElement('div'),
    table      = doc.createElement('table'),
    tableBody  = doc.createElement('tbody'),
    tableRow   = doc.createElement('tr'),
    containers = {
        '*'  : div,
        thead: table,
        tbody: table,
        tfoot: table,
        tr   : tableBody,
        th   : tableRow,
        td   : tableRow
    };

mix(node, {

    create: function(html, props) {
        var key,
            ret = [],
            tag,
            container;

        if (!html || !isString(html)) {
            return ret;
        }

        if (RE_SINGLE_TAG.test(html)) {
            ret = $(doc.createElement(RegExp.$1));
        } else {
            html = html.replace(RE_XHTML_TAG, '<$1></$2>');
            tag  = RE_TAG.test(html) && RegExp.$1;

            container = containers[tag] || containers['*'];
            container.innerHTML = html;

            ret = each(slice.call(container.childNodes), function(el) {
                container.removeChild(el);
            });
        }

        if (isPlainObject(props)) {
            for (key in props) {
                ret.attr(key, props[key]);
            }
        }

        return ret;
    },

    html: function(html, loadScripts) {
        return arguments.length ?
            each(this, function(el) {
                $(el).empty().append(html, loadScripts);
            }) :
            this.length ? this[0].textContent : null;
    },

    remove: function() {
        return each(this, function(el) {
            el.parentNode && el.parentNode.removeChild(el)
        });
    },

    empty: function() {
        return each(this, function(el) {
            el.innerHTML = '';
        });
    },

    clone: function() {
        return this.map(function(el) {
            return el.cloneNode(true);
        });
    }

});
