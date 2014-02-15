/**
 * @ignore
 * @file node-insertion
 * @author 莫争 <gaoli.gl@taobao.com>
 */

function filterScripts(nodes, scripts) {
    var ret = [];

    each(nodes, function(node) {
        var name = node.nodeName,
            type = node.type,
            temp = [];

        if (name && name === 'SCRIPT' && (!type || type === 'text/javascript')) {
            node.parentNode && node.parentNode.removeChild(node);
            scripts && scripts.push(node);
        } else {
            if (isElement(node)) {
                each(node.getElementsByTagName('script'), function(el) {
                    temp.push(el);
                });
                filterScripts(temp, scripts);
            }
            ret.push(node);
        }
    });

    return ret;
}

function nodeListToFragment(nodes) {
    var ret = null;

    if (nodes && likeArray(nodes)) {
        ret = doc.createDocumentFragment();

        each(nodes, function(node) {
            ret.appendChild(node);
        });
    }

    return ret;
}

mix(node, {

    // ** .wrapAll() **
    //
    // * .wrapAll(wrapperNode)
    //
    //  在所有匹配元素外面包一层 HTML 结构
    wrapAll: function(wrapperNode) {
        var el = this[0];

        if (el) {
            var $wrapperNode = $(wrapperNode),
                $wrapperChildren;

            $wrapperNode.insertBefore(el);

            while (($wrapperChildren = $wrapperNode.children()).length) {
                $wrapperNode = $wrapperNode.first();
            }

            $wrapperNode.append(this);
        }

        return this;
    },

    // ** .wrap() **
    //
    // * .wrap(wrapperNode)
    //
    //  在每个匹配的元素外层包上一个 HTML 元素
    wrap: function(wrapperNode) {
        var $wrapperNode = $(wrapperNode),
            wrapperClone = $wrapperNode[0].parentNode || this.length;

        return each(this, function(el) {
            $(el).wrapAll(
                wrapperClone ? $wrapperNode[0].cloneNode(true) : $wrapperNode[0]
            )
        });
    },

    // ** .unwrap() **
    //
    // * .unwrap()
    //
    //  移除集合中每个元素的直接父节点，并把他们的子元素保留在原来的位置
    unwrap: function() {
        return each(this, function(el) {
            var $el     = $(el),
                $parent = $el.parent();

            $parent.replaceWith($parent.children());
        });
    },

    // ** .wrapInner() **
    //
    // * .wrapInner(wrapperNode)
    //
    //  将每个元素中的内容包裹在一个单独的结构中
    wrapInner: function(wrapperNode) {
        return each(this, function(el) {
            var $el       = $(el),
                $children = $el.children();

            if ($children.length) {
                $children.wrapAll(wrapperNode);
            } else {
                $el.append(wrapperNode);
            }
        });
    },

    // ** .replaceWith() **
    //
    // * .replaceWith(newNodes)
    //
    //  用给定的内容替换所有匹配的元素
    replaceWith: function(newNodes) {
        return this.before(newNodes).remove();
    }

});

// ** .after() **
//
// * .after(html)
//
//  在匹配元素集合中的每个元素后面插入内容，作为其兄弟节点
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .prepend() **
//
// * .prepend(html)
//
//  将内容插入到每个匹配元素的前面（元素内部）
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .before() **
//
// * .before(html)
//
//  在匹配元素的前面（元素外部）插入内容
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .append() **
//
// * .append(html)
//
//  在每个匹配元素里面的末尾处插入内容
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组

each(['after', 'prepend', 'before', 'append'], function(method, index) {
    var inside = index % 2;

    node[method] = function(html, loadScripts) {
        var nodes  = isString(html) ? node.create(html) : html,
            isCopy = this.length > 1,
            parent,
            target;

        if (loadScripts) {
            var scripts = [];
        }

        if (nodes.length) {
            nodes = nodeListToFragment(filterScripts(nodes, scripts));
        } else {
            return this;
        }

        return each(this, function(el) {
            parent = inside ? el : el.parentNode;

            switch (index) {
                case 0:
                    target = el.nextSibling;
                    break;
                case 1:
                    target = el.firstChild;
                    break;
                case 2:
                    target = el;
                    break;
                default:
                    target = null
            }

            parent.insertBefore(isCopy ? nodes.cloneNode(true) : nodes, target);

            each(scripts, function(el) {
                if (el.src) {
                    getScript(el.src);
                } else {
                    win['eval'].call(win, el.innerHTML);
                }
            });
        });
    };

    // ** .insertAfter() **
    //
    // * .insertAfter(target)
    //
    //  将集合中的元素插入到指定的目标元素后面（外部插入）
    //
    // ** .prependTo() **
    //
    // * .prependTo(target)
    //
    //  将所有元素插入到目标前面（内部插入）
    //
    // ** .insertBefore() **
    //
    // * .insertBefore(target)
    //
    //  将集合中的元素插入到指定的目标元素前面（外部插入）
    //
    // ** .appendTo() **
    //
    // * .appendTo(target)
    //
    //  将匹配的元素插入到目标元素的末尾（内部插入）
    node[inside ? method + 'To' : 'insert' + (index ? 'Before' : 'After')] = function(target) {
        $(target)[method](this);
        return this;
    };
});
