/**
 * @ignore
 * @file node-traversal
 * @author 莫争 <gaoli.gl@taobao.com>
 */

function filtered(els, selector) {
    var $els = $(els);

    return selector !== undefined ?
        $els.filter(
            isArray(selector) ?
                function(el) {
                    return some.call(selector, function(filter) {
                        return matches(el, filter);
                    });
                } :
                selector
        ) :
        $els;
}

function children(el) {
    return 'children' in el ?
        slice.call(el.children) :
        map(el.childNodes, function(el) {
            if (isElement(el)) {
                return el;
            }
        });
}

function nth(el, filter, property, includeSelf) {
    var ret   = [],
        array = isArray(filter);

    el = includeSelf ? el : el[property];

    while (el) {
        if (el && !isDocument(el) && isElement(el) && ret.indexOf(el) < 0) {
            ret.push(el);
        }
        el = el[property];
    }

    if (array && !filter.length) {
        filter = undefined
    }

    ret = filtered(ret, filter);

    return array ?
        ret :
        ret.item(0);
}

mix(node, {

    // ** .item() **
    //
    // * .item(index)
    //
    //  获取包含当前节点列表 index 位置处的单个原生节点的新 NodeList 对象
    item: function(index) {
        var self = this;

        return isNumber(index) ?
            index >= self.length ?
                null :
                $(self[index]) :
            $(index);
    },

    // ** .first() **
    //
    // * .first([filter])
    //
    //  获取符合选择器的第一个元素的第一个子节点
    first: function(filter) {
        return nth(this[0] && this[0].firstChild, filter, 'nextElementSibling', true);
    },

    // ** .last() **
    //
    // * .last([filter])
    //
    //  获取符合选择器的第一个元素的最后一个子节点
    last: function(filter) {
        return nth(this[0] && this[0].lastChild, filter, 'previousElementSibling', true);
    },

    // ** .next() **
    //
    // * .next([filter])
    //
    //  获取符合选择器的第一个元素的下一个同级节点
    next: function(filter) {
        return nth(this[0], filter, 'nextElementSibling');
    },

    // ** .prev() **
    //
    // * .prev([filter])
    //
    //  获取符合选择器的第一个元素的上一个同级节点
    prev: function(filter) {
        return nth(this[0], filter, 'previousElementSibling');
    },

    // ** .parent() **
    //
    // * .parent([filter])
    //
    //  获取符合选择器的第一个元素的祖先元素
    parent: function(filter) {
        return nth(this[0], filter, 'parentNode');
    },

    // ** .children() **
    //
    // * .children([filter])
    //
    //  获取符合选择器的所有非文字节点的子节点
    children: function(selector) {
        var el = this[0];

        return el ?
            filtered(children(el), selector) :
            this;
    },

    // ** .siblings() **
    //
    // * .siblings([filter])
    //
    //  获取符合选择器的第一个元素的相应同级节点
    siblings: function(selector) {
        var el = this[0];

        return el ?
            filtered(
                filter.call(children(el.parentNode), function(child) {
                    return child !== el;
                })
            , selector) :
            this;
    },

    // ** .contents() **
    //
    // * .contents()
    //
    //  获取符合选择器的所有子节点（包括文字节点）
    contents: function() {
        var el = this[0];

        return el ?
            $(slice.call(el.childNodes)) :
            this;
    },

    // ** .contains() **
    //
    // * .contains(contained)
    //
    //  判断某一容器（container）是否包含另一（contained）节点
    contains: function(contained) {
        var container = this[0],
            contained = likeArray(contained) ? contained[0] : contained;

        return container && contained ?
            container !== contained && container.contains(contained) :
            false;
    }

});
