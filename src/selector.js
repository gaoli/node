/**
 * @ignore
 * @file node-selector
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var tempParent = document.createElement('div');

function find(selector, context) {
    return context.length === 1 ?
        query(selector, context[0]) :
        unique(
            map(context, function(el) {
                return query(selector, el);
            })
        );
}

function query(selector, context) {
    var s        = selector.charAt(0), ret,
        maybeID  = s === '#',
        maybeCls = s === '.',
        nameOnly = maybeID || maybeCls ? selector.slice(1) : selector,
        isSimple = /^[\w-]*$/.test(nameOnly);

    return isDocument(context) || isElement(context) ?
        isDocument(context) && maybeID && isSimple ?
            (ret = context.getElementById(nameOnly)) ? [ret] : [] :
            slice.call(
                !maybeID && isSimple ?
                    maybeCls ?
                        context.getElementsByClassName(nameOnly) :
                        context.getElementsByTagName(selector) :
                    context.querySelectorAll(selector)
            )
        : [];
}

function matches(el, selector) {
    if (!el || !selector || !isElement(el)) {
        return false;
    }

    var matchesSelector = el.webkitMatchesSelector ||
                          el.mozMatchesSelector ||
                          el.oMatchesSelector ||
                          el.matchesSelector;

    if (matchesSelector) {
        return matchesSelector.call(el, selector);
    } else {
        var parent    = el.parentNode,
            hasParent = !!parent,
            match;

        if (!hasParent) {
            parent = tempParent;
            parent.appendChild(el);
        }

        match = ~query(selector, parent).indexOf(el);
        !hasParent && parent.removeChild(el);

        return match;
    }
}

mix(S, {
    query: query
});

mix(node, {

    all: function(selector) {
        var self = this,
            ret;

        ret = $(find(selector, self));
        ret.__parent = self;

        return ret;
    },

    one: function(selector) {
        var self = this,
            ret;

        ret = $(query(selector, self[0]));
        ret = ret.length ? ret.slice(0, 1) : null;

        if (ret) {
            ret.__parent = self;
        }

        return ret;
    },

    filter: function(selector) {
        if (isFunction(selector)) {
            return $(filter.call(this, function(el) {
                return selector.call(el, el);
            }));
        } else {
            return $(filter.call(this, function(el) {
                return matches(el, selector);
            }));
        }
    }

});
