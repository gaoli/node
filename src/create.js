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

    // ** .create() **
    //
    // * .create(html, props)
    //
    //  创建 dom 节点
    //
    // ```
    // S.node.create('<div>')
    // S.node.create('<div />')
    // S.node.create('<div></div>') //=> 创建 DIV 节点
    // ```
    // ```
    // S.node.create('<div></div>', {
    //     text: 'ok',
    //     css : {color: 'red'}
    // }); //=> 创建 DIV 节点，内容为'ok'，颜色为红色
    // ```
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

    // ** .html() **
    //
    // * .html()
    //
    //  获取符合选择器的第一个元素的 innerHTML
    //
    // * .html(html[, loadScripts])
    //
    //  给符合选择器的所有元素设置 innerHTML 值
    //
    //  loadScripts 表示是否执行 html 中的内嵌脚本，默认 false
    //
    // ```
    // var el   = S.node.create('<div id="J_check"></div>');
    // var html = [
    //     '<h3>This is the added part</h3>',
    //     '<script>alert(1)</script>'
    // ].join('');
    // el.html(html);
    // //=> 不会 alert(1)
    // el.html();
    // //=> <h3>This is the added part</h3>
    // el.html(html, true);
    // //=> alert(1)
    // ```
    html: function(html, loadScripts) {
        return html === undefined ?
            this.length ? this[0].innerHTML : null
            :
            each(this, function(el) {
                $(el).empty().append(html, loadScripts);
            });
    },

    // ** .remove() **
    //
    // * .remove()
    //
    //  将符合选择器的所有元素从 DOM 中移除
    remove: function() {
        var self = this;

        // 移除所有事件绑定
        self.detach && self.detach();

        return each(self, function(el) {
            el.parentNode && el.parentNode.removeChild(el)
        });
    },

    // ** .empty() **
    //
    // * .empty()
    //
    //  清除节点的所有子孙节点
    empty: function() {
        return each(this, function(el) {
            el.innerHTML = '';
        });
    },

    // ** .clone() **
    //
    // * .clone([deep])
    //
    //  获取符合选择器的第一个元素的克隆元素
    //
    //  deep 表示是否深度克隆（克隆节点的子孙节点），默认 false
    clone: function(deep) {
        return $(
            map(this, function(el) {
                return el.cloneNode(!!deep);
            })
        );
    }

});
