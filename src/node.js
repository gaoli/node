/**
 * @ignore
 * @file node
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var node = {};

mix(node, {

    // ** .indexOf() **
    //
    // * .indexOf(el)
    //
    //   逻辑类似 `Array.prototype.indexOf`
    //
    //   查找 el 在 els（元素列表）中的位置，el 类型可以是 Node，也可以是原生节点
    indexOf: function(el) {
        return likeArray(el) ?
            indexOf.call(this, el[0]) :
            indexOf.apply(this, arguments);
    },

    // ** .each() **
    //
    // * .each(cb)
    //
    //  遍历数组中的每一项，执行指定方法，函数返回 false 则遍历结束
    //
    //  this 关键字指向当前 item（作为函数的第一个参数传递）
    each: function(cb) {
        every.call(this, function(el, index) {
            el = $(el);
            return cb.call(el, el, index) !== false;
        });
        return this;
    },

    // ** .slice() **
    //
    // * .slice(start[, end])
    //
    //  返回一个新的 Node 集合对象，提取包含从 start 到 end （不包括该元素）的元素
    slice: function() {
        return $(slice.apply(this, arguments));
    },

    // ** .end() **
    //
    // * .end()
    //
    //   得到上一次 S.one() / S.all() 操作前的 Node 对象
    //
    //   引入该方法是为了更好的支持链式操作( chaining )
    //
    //   可以在一个语句内对不同层次得节点集合进行不同的操作
    end: function() {
        return this.__parent || this;
    },

    // ** .getDOMNode() **
    //
    // * .getDOMNode()
    //
    //   得到该 Node 对象包含的第一个原生节点
    getDOMNode: function() {
        return this[0]
    }

});

// ** .all() **
//
// * .all(selector[, context])
//
//   通过执行 css 选择器包装 dom 节点，创建元素或者从一个 html 片段来创建一个 Node 对象
//
//   Node 集合是一个类似数组的对象，它具有链式方法来操作它指向的 dom ，文档对象中的所有方法都是集合方法
//
//   如果选择器中存在 content 参数（css 选择器，dom，或者 Node 集合对象），那么只在所给的节点背景下进行 css 选择器，这个功能有点像使用 `S.all(context).all(selector)`
//
//   可以通过一个 html 字符串片段来创建一个 dom 节点。也可以通过给定一组属性映射来创建节点。最快的创建元素，使用 `<div>` 或 `<div/>` 形式
//
// ```
// var $ = S.all;
//
// $('div');          //=> 获取所有 div 节点
// $('#foo');         //=> 获取 ID 为 'foo' 的节点
// $('<p>Hello</p>'); //=> 创建 p 节点
// $('<div />', {
//     text: 'ok',
//     css : {
//         color: 'red'
//     }
// }); //=> <div style="color:red">ok</div>
// ```
var $ = function(selector, context) {
    var ret = [];

    if (selector) {
        if (isString(selector)) {
            selector = selector.trim();

            if (selector[0] == '<' && /<([\w:]+)/.test(selector)) {
                ret = node.create(selector);
            } else if (context !== undefined) {
                ret = find(selector, $(context));
            } else {
                ret = query(selector, doc);
            }
        } else if ($.isNode(selector)) {
            return selector;
        } else {
            if (selector.nodeType || selector.setTimeout) {
                ret = [selector];
            } else if (isArray(selector)) {
                ret = selector;
            } else if (!selector.nodeType && !selector.setTimeout && selector.item) {
                ret = slice.call(selector);
            }
        }
    }

    return $.node(ret);
};

$.all = function(selector, context) {
    return $(selector, context);
};

// ** .one() **
//
// * .one(selector[, context])
//
//   返回一个节点，用法同 `.all()`
$.one = function(selector, context) {
    return $(selector, context).item(0);
};

// ** .node() **
//
// * .node(els)
//
//   把一个节点（数组）转换为 Node（集合）对象
//
// 这里 `$.node` 实际指的是 `S.Node.node`，Node 对象实例将会继承 `S.node` 里的方法
//
// `S.Node.node` 一般情况下可以使用 `S.all()` 来代替
$.node = function(els) {
    els = els || [];
    els.__proto__ = node;
    return els;
};

$.node.prototype = node;

// ** .isNode() **
//
// * .isNode(obj)
//
//   判断一个变量是否为 Node 对象
$.isNode = function(obj) {
    return obj instanceof $.node;
};