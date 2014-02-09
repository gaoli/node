/**
 * @ignore
 * @file node-selector
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var tempParent = document.createElement('div');

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
        return this.length === 1 ?
            $(query(selector, this[0])) :
            S.unique(
                this.map(function(el) {
                    return query(selector, el);
                })
            );
    },

    one: function(selector) {
        return $(query(selector, this[0])[0]);
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
