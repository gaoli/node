;(function(global, S) {

/**
 * @ignore
 * @file util
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var win   = window,
    doc   = document,
    body  = doc.body,
    docEl = doc.documentElement;

var emptyArray = [],
    some       = emptyArray.some,
    every      = emptyArray.every,
    slice      = emptyArray.slice,
    filter     = emptyArray.filter,
    concat     = emptyArray.concat,
    indexOf    = emptyArray.indexOf,
    forEach    = emptyArray.forEach;

function mix(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
}

function map(els, cb) {
    var val,
        ret = [];

    els && forEach.call(els, function(el, index) {
        val = cb(el, index);
        if (val !== null) {
            ret.push(val);
        }
    });

    return ret.length ? concat.apply([], ret) : ret;
}

function each(els, callback) {
    els && forEach.call(els, callback);
    return els;
}

function isWindow(node) {
    return node && node == node.window;
}

function isDocument(node) {
    return node && node.nodeType === 9;
}

function isElement(node) {
    return node && node.nodeType === 1;
}

function likeArray(nodes) {
    return typeof nodes.length == 'number';
}

function unique(array) {
    return filter.call(array, function(item, index) {
        return array.indexOf(item) == index;
    });
}

function getScript(url) {
    var script = doc.createElement('script'),
        head   = doc.getElementsByTagName('head')[0] || docEl;

    script.src = url;
    head.insertBefore(script, head.firstChild);
}

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    }
}

var isNumber   = isType('Number'),
    isString   = isType('String'),
    isObject   = isType('Object'),
    isArray    = Array.isArray || isType('Array'),
    isFunction = isType('Function');

var isPlainObject = function(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};
/**
 * @ignore
 * @file node
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var node = {};

mix(node, {

    indexOf: indexOf,

    each: function(cb) {
        every.call(this, function(el, index) {
            el = $(el);
            return cb.call(el, el, index) !== false;
        });
        return this;
    },

    slice: function() {
        return $(slice.apply(this, arguments));
    },

    end: function() {
        return this.__parent || this;
    }

});

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

$.one = function(selector, context) {
    return $(selector, context).item(0);
};

$.node = function(els) {
    els = els || [];
    els.__proto__ = S.node;
    return els;
};

$.isNode = function(obj) {
    return obj instanceof $.node;
};
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

        ret = self.all(selector);
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

/**
 * @ignore
 * @file node-class
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var classCache = {};

function classRE(name) {
    return name in classCache ?
        classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
}

function className(el, val) {
    if (val === undefined) {
        return el.className;
    } else {
        el.className = val;
    }
}

function classSplit(names) {
    return names.split(/[\.\s]\s*\.?/);
}

mix(node, {

    addClass: function(names) {
        if (!names) return this;
        return each(this, function(el) {
            var $el       = $(el),
                cls       = className(el),
                classList = [];

            each(classSplit(names), function(name) {
                !$el.hasClass(name) && classList.push(name)
            });

            classList.length && className(el, cls + (cls ? ' ' : '') + classList.join(' '))
        });
    },

    removeClass: function(names) {
        return each(this, function(el) {
            if (names === undefined) {
                return className(el, '');
            } else {
                var classList = className(el);

                each(classSplit(names), function(name) {
                    classList = classList.replace(classRE(name), ' ');
                });

                className(el, classList.trim());
            }
        });
    },

    toggleClass: function(names) {
        if (!names) return this;
        return each(this, function(el) {
            var $el = $(el);

            each(classSplit(names), function(name) {
                $el.hasClass(name) ? $el.removeClass(name) : $el.addClass(name)
            });
        });
    },

    hasClass: function(names) {
        if (!names) return false;
        return some.call(this, function(el) {
            return every.call(this, function(name) {
                return name ? classRE(name).test(className(el)) : true;
            });
        }, classSplit(names));
    }

});

/**
 * @ignore
 * @file node-attr
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var RE_BOOLEAN = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;

var attrMethod = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
    propFixMap = {
        hidefocus      : 'hideFocus',
        tabindex       : 'tabIndex',
        readonly       : 'readOnly',
        'for'          : 'htmlFor',
        'class'        : 'className',
        maxlength      : 'maxLength',
        cellspacing    : 'cellSpacing',
        cellpadding    : 'cellPadding',
        rowspan        : 'rowSpan',
        colspan        : 'colSpan',
        usemap         : 'useMap',
        frameborder    : 'frameBorder',
        contenteditable: 'contentEditable'
    };

function pluck(els, property) {
    return map(els, function(el) {
        return el[property];
    });
}

function setAttribute(el, name, val) {
    val == null ? el.removeAttribute(name) : el.setAttribute(name, val)
}

mix(node, {

    // ** .attr() **
    //
    // * .attr(name)
    //
    //   获取符合选择器的第一个元素的属性值
    //
    // * .attr(name, val)
    //
    //   给符合选择器的所有元素设置属性值
    //
    // * .attr(kv)
    //
    //   给符合选择器的所有元素设置属性值
    //
    // `.attr()` 和 `.prop()` 的区别
    //
    // ```
    // el.attr('checked') // => "checked"
    // el.prop('checked') // => true
    // ```
    //
    // `.attr()` 和 `.prop()` 的使用
    //
    // 从中文意思看，两者分别是获取 / 设置 attributes 和 properties 的方法，分别在这两个场景中使用：具有 true 和 false 两个属性的属性，如 checked，selected 或者 disabled 使用 `.prop()`，其他的使用 `.attr()`
    attr: function(name, val) {
        var key,
            ret;

        if (isPlainObject(name)) {
            for (key in name) {
                node.attr.call(this, key, name[key]);
            }
            return this;
        }

        if (~attrMethod.indexOf(name)) {
            return $(this)[name](val);
        }

        if (val == undefined) {
            var el = this[0];

            if (el && isElement(el)) {
                if (RE_BOOLEAN.test(name)) {
                    ret = $(el).prop(name) ? name.toLowerCase() : undefined;
                } else if (name == 'value' && el.nodeName == 'INPUT') {
                    ret = this.val();
                } else {
                    ret = el.getAttribute(name);
                    ret = !ret && name in el ? el[name] : ret;
                }
            }
        } else {
            ret = each(this, function(el) {
                isElement(el) && setAttribute(el, name, val);
            });
        }

        return ret === null ? undefined : ret;
    },

    // ** .removeAttr() **
    //
    // * .removeAttr(name)
    //
    //   移除符合选择器的所有元素的指定属性
    removeAttr: function(name) {
        return each(this, function(el) {
            isElement(el) && setAttribute(el, name)
        });
    },

    // ** .hasAttr() **
    //
    // * .hasAttr(name)
    //
    //   判断符合选择器的所有元素中是否有某个元素含有特定属性
    hasAttr: function(name) {
        if (!name) return false;
        return some.call(this, function(el) {
            return isElement(el) && el.getAttribute(name);
        });
    },

    // ** .prop() **
    //
    // * .prop(name)
    //
    //   获取符合选择器的第一个元素的对应 property 值
    //
    // * .prop(name, val)
    //
    //   给符合选择器的所有元素设置 property 值
    //
    // * .prop(kv)
    //
    //   给符合选择器的所有元素设置 property 值
    prop: function(name, val) {
        name = propFixMap[name] || name;
        return val == undefined ?
            this[0] && this[0][name] :
            each(this, function(el) {
                el[name] = val;
            });
    },

    // ** .hasProp() **
    //
    // * .hasProp(name)
    //
    //  判断符合选择器的第一个元素是否含有特定 property 属性
    hasProp: function(name) {
        if (!name) return false;
        name = propFixMap[name] || name;
        return some.call(this, function(el) {
            return isElement(el) && el[name];
        });
    },

    removeProp: function(name) {
        return each(this, function(el) {
            try {
                el[name] = undefined;
                delete el[name];
            } catch (e) {
            }
        });
    },

    // ** .val() **
    //
    // * .val()
    //
    //  获取符合选择器的第一个元素所的 value 值
    //
    // * .val(val)
    //
    //  给符合选择器的所有元素设置 value 值
    //
    // 如果是 `<select multiple>` 标签，则返回一个数组
    val: function(val) {
        var el = this[0];

        if (!el) return this;

        if (el.multiple) {
            var opts = $('option', el);

            return val == undefined ?
                slice.call(
                    pluck(
                        opts.filter(function(opt) {
                            return opt.selected;
                        }), 'value'
                    )
                ) :
                each(opts, function(opt) {
                    opt.selected = ~val.indexOf(opt.value);
                });
        } else {
            return val == undefined ?
                el.value :
                each(this, function(el) {
                    el.value = val;
                });
        }
    },

    // ** .text() **
    //
    // * .text()
    //
    //  获取符合选择器的第一个元素所包含的文本值
    //
    // * .val(text)
    //
    //  给符合选择器的所有元素设置文本值
    text: function(text) {
        return arguments.length ?
            each(this, function(el) {
                el.textContent = (text === undefined) ? '' : '' + text
            }) :
            this.length ? this[0].textContent : null;
    }

});

/**
 * @ignore
 * @file node-style
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var cssNumber = {
        columnCount: 1,
        columns    : 1,
        fontWeight : 1,
        lineHeight : 1,
        opacity    : 1,
        zIndex     : 1,
        zoom       : 1
    },
    elDisplay = {};

function camelCase(name) {
    return name.replace(/-+(.)?/g, function() {
        return arguments[1].toUpperCase();
    });
}

function maybeAddPx(name, val) {
    return isNumber(val) && !cssNumber[camelCase(name)] ? val + 'px' : val;
}

function getComputedStyle(el, name) {
    return win.getComputedStyle(el, null).getPropertyValue(name);
}

function getDefaultDisplay(tagName) {
    if (!elDisplay[tagName]) {
        var el = doc.createElement(tagName),
            display;

        body.appendChild(el);
        display = getComputedStyle(el, 'display');
        el.parentNode.removeChild(el);
        display == 'none' && (display = 'block');
        elDisplay[tagName] = display;
    }

    return elDisplay[tagName];
}

mix(node, {

    css: function(name, val) {
        var key,
            ret = '';

        if (val == undefined) {
            if (isString(name)) {
                var el = this[0];

                return el ? el.style[camelCase(name)] || getComputedStyle(el, name) : '';
            } else if (isObject(name)) {
                for (key in name) {
                    ret += key + ':' + maybeAddPx(key, name[key]) + ';';
                }
            }
        } else {
            ret = name + ':' + maybeAddPx(name, val) + ';';
        }

        return each(this, function(el) {
            el.style.cssText += ';' + ret;
        });
    },

    show: function() {
        return each(this, function(el) {
            el.style.display == 'none' && (el.style.display = '');
            if (getComputedStyle(el, 'display') == 'none') {
                el.style.display = getDefaultDisplay(el.nodeName);
            }
        });
    },

    hide: function() {
        return this.css('display', 'none');
    },

    toggle: function() {
        return each(this, function(el) {
            var $el = $(el);

            $el.css('display') == 'none' ? $el.show() : $el.hide();
        });
    }

});

each(['width', 'height'], function(method) {
    node[method] = function(val) {
        var el = this[0];

        if (val) {
            return $(this).css(method, val);
        } else {
            return isWindow(el) ? el[camelCase('inner-' + method)] :
                isDocument(el) ? docEl[camelCase('scroll-' + method)] :
                    this.offset()[method];
        }
    };
});

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

    item: function(index) {
        var self = this;

        return isNumber(index) ?
            index >= self.length ?
                null :
                $(self[index]) :
            $(index);
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

    wrap: function(wrapperNode) {
        var $wrapperNode = $(wrapperNode),
            wrapperClone = $wrapperNode[0].parentNode || this.length;

        return each(this, function(el) {
            $(el).wrapAll(
                wrapperClone ? $wrapperNode[0].cloneNode(true) : $wrapperNode[0]
            )
        });
    },

    unwrap: function() {
        return each(this, function(el) {
            var $el     = $(el),
                $parent = $el.parent();

            $parent.replaceWith($parent.children());
        });
    },

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

    replaceWith: function(newNodes) {
        return this.before(newNodes).remove();
    }

});

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

    node[inside ? method + 'To' : 'insert' + (index ? 'Before' : 'After')] = function(html) {
        $(html)[method](this);
        return this;
    };
});

/**
 * @ignore
 * @file node-offset
 * @author 莫争 <gaoli.gl@taobao.com>
 */

mix(node, {

    offset: function() {
        var ret = null,
            obj;

        if (this.length) {
            obj = this[0].getBoundingClientRect();
            ret = {
                left  : obj.left + win.pageXOffset,
                top   : obj.top + win.pageYOffset,
                width : Math.round(obj.width),
                height: Math.round(obj.height)
            }
        }

        return ret;
    }

});

each(['scrollTop', 'scrollLeft'], function(method, index) {

    node[method] = function(val) {
        var el        = this[0],
            hasScroll = method in el;

        return val === undefined ?
            hasScroll ?
                el[method] :
                el['page' + (index ? 'X' : 'Y') + 'Offset']
            :
            hasScroll ?
                each(this, function(el) {
                    el[method] = val;
                }) :
                each(this, function(el) {
                    if (index) {
                        el.scrollTo(val, el.scrollY);
                    } else {
                        el.scrollTo(el.scrollX, val);
                    }
                });
    }

});

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

/**
 * @ignore
 * @file output
 * @author 莫争 <gaoli.gl@taobao.com>
 */

mix(S, {
    node    : node,
    Node    : $,
    NodeList: $,
    one     : $.one,
    all     : $.all
});

S.add && S.add('node', function (S) {
    return $;
});

}(this, KISSY));