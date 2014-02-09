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
        $.map(el.childNodes, function(el) {
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

    item: function(index) {
        return this.slice(index, index + 1);
    },

    first: function(filter) {
        return nth(this[0] && this[0].firstChild, filter, 'nextElementSibling', true);
    },

    last: function(filter) {
        return nth(this[0] && this[0].lastChild, filter, 'previousElementSibling', true);
    },

    next: function(filter) {
        return nth(this[0], filter, 'nextElementSibling');
    },

    prev: function(filter) {
        return nth(this[0], filter, 'previousElementSibling');
    },

    parent: function(filter) {
        return nth(this[0], filter, 'parentNode');
    },

    children: function(selector) {
        var el = this[0];

        return el ?
            filtered(children(el), selector) :
            this;
    },

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

    contents: function() {
        var el = this[0];

        return el ?
            $(slice.call(el.childNodes)) :
            this;
    },

    contains: function(contained) {
        return some.call(this, function(el) {
            return el !== contained && el.contains(el);
        });
    }

});
