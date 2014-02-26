// ### API Delete
// ---

// | API                  | KISSY                | KISSY-MINI           |
// |:-------------------- |:--------------------:|:--------------------:|
// | test                 | √                    | ╳                    |
// | replaceClass         | √                    | ╳                    |
// | style                | √                    | ╳                    |
// | innerWidth           | √                    | ╳                    |
// | innerHeight          | √                    | ╳                    |
// | outerWidth           | √                    | ╳                    |
// | outerHeight          | √                    | ╳                    |
// | addStyleSheet        | √                    | ╳                    |
// | docHeight            | √                    | ╳                    |
// | docWidth             | √                    | ╳                    |
// | viewportHeight       | √                    | ╳                    |
// | viewportWidth        | √                    | ╳                    |
// | scrollIntoView       | √                    | ╳                    |
// | unselectable         | √                    | ╳                    |
// | nodeName             | √                    | ╳                    |
// | outerHTML            | √                    | ╳                    |

// ### API TODO
// ---

// | API                  | KISSY                | KISSY-MINI           |
// |:-------------------- |:--------------------:|:--------------------:|
// | data                 | √                    | ╳                    |
// | removeData           | √                    | ╳                    |
// | hasData              | √                    | ╳                    |

// ### KISSY VS KISSY-MINI
// ---

// | KISSY                | KISSY-MINI           | Note                 |
// |:-------------------- |:--------------------:|:--------------------:|
// | S.DOM.css(el, name)  | S.all(el).css(name)  | 只支持链式写法         |
// | S.DOM.parent(el, 2)  | ╳                    | 不支持指定层级         |
// | S.DOM.clone()        |                      | 只支持元素复制         |

;(function(global, S) {

/**
 * @ignore
 * @file util
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var win   = window,
    doc   = document,
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
    return nodes && typeof nodes.length == 'number';
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
/**
 * @ignore
 * @file node-selector
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var tempParent = document.createElement('div');

// ** .find() **
//
// * .find(selector, context)
//
//  内部方法，在 context 范围内查找节点（增强版）
function find(selector, context) {
    return context.length === 1 ?
        query(selector, context[0]) :
        unique(
            map(context, function(el) {
                return query(selector, el);
            })
        );
}

// ** .query() **
//
// * .query(selector, context)
//
//  内部方法，在 context 范围内查找节点
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

// ** .matches() **
//
// * .matches(el, selector)
//
//  内部方法，选择器匹配加速
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

    // ** .all() **
    //
    // * .all(selector)
    //
    //  给 `S.node` 参元类挂载 `.all()` 方法，推荐直接使用 `S.all()`
    all: function(selector) {
        var self = this,
            ret;

        ret = $(find(selector, self));
        ret.__parent = self;

        return ret;
    },

    // ** .one() **
    //
    // * .one(selector)
    //
    //  给 `S.node` 参元类挂载 `.one()` 方法，推荐直接使用 `S.one()`
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

    // ** .filter() **
    //
    // * .filter(selector)
    //
    //  给 `S.node` 参元类挂载 `.filter()` 方法，推荐直接使用 `els.filter()`
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

    // ** .addClass() **
    //
    // * .addClass(names)
    //
    //  给符合选择器的所有元素添加指定 class
    //
    //  多个 class 类名通过空格分隔
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

    // ** .removeClass() **
    //
    // * .removeClass()
    //
    //  给符合选择器的所有元素移除所有 class
    //
    // * .removeClass(names)
    //
    //  给符合选择器的所有元素移除指定 class
    //
    //  多个 class 类名通过空格分隔
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

    // ** .toggleClass() **
    //
    // * .toggleClass(names)
    //
    //  操作符合选择器的所有元素, 如果存在值为 names 的 class, 则移除掉, 反之添加
    toggleClass: function(names) {
        if (!names) return this;
        return each(this, function(el) {
            var $el = $(el);

            each(classSplit(names), function(name) {
                $el.hasClass(name) ? $el.removeClass(name) : $el.addClass(name)
            });
        });
    },

    // ** .hasClass() **
    //
    // * .hasClass(names)
    //
    //  判断符合选择器的所有元素中是否有某个元素含有特定 class
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
        'column-count': 1,
        'columns'     : 1,
        'font-weight' : 1,
        'line-height' : 1,
        'opacity'     : 1,
        'z-index'     : 1,
        'zoom'        : 1
    },
    elDisplay = {};

function dasherize(str) {
    return str.replace(/::/g, '/')
              .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
              .replace(/([a-z\d])([A-Z])/g, '$1_$2')
              .replace(/_/g, '-')
              .toLowerCase();
}

// ** .camelCase() **
//
// * .camelCase(name)
//
//  内部方法，将一组字符串变成“骆驼”命名法的新字符串，如果该字符已经是“骆驼”命名法，则不变化
//
// ```
// .camelCase('abc-def'); //=> 'abcDef'
// .camelCase('abcDef');  //=> 'abcDef'
// ```
function camelCase(name) {
    return name.replace(/-+(.)?/g, function() {
        return arguments[1].toUpperCase();
    });
}

// ** .maybeAddPx() **
//
// * .maybeAddPx(name, val)
//
//  内部方法，根据情况将数字转换为带单位的值
//
// ```
// .maybeAddPx('width', 12); //=> '12px'
// ```
function maybeAddPx(name, val) {
    return isNumber(val) && !cssNumber[dasherize(name)] ? val + 'px' : val;
}

// ** .getComputedStyle() **
//
// * .getComputedStyle(el, name)
//
//  内部方法，获取元素所有最终使用的 CSS 属性值
function getComputedStyle(el, name) {
    return win.getComputedStyle(el, null).getPropertyValue(name);
}

// ** .getDefaultDisplay() **
//
// * .getDefaultDisplay(tagName)
//
//  内部方法，获取 tag 元素原始 display 属性
function getDefaultDisplay(tagName) {
    if (!elDisplay[tagName]) {
        var el = doc.createElement(tagName),
            display;

        doc.body.appendChild(el);
        display = getComputedStyle(el, 'display');
        el.parentNode.removeChild(el);
        display == 'none' && (display = 'block');
        elDisplay[tagName] = display;
    }

    return elDisplay[tagName];
}

mix(node, {

    // ** .css() **
    //
    // * .css(name)
    //
    //  获取符合选择器的第一个元素的样式值
    //
    // * .css(name, val)
    //
    //  给符合选择器的所有元素设置样式值
    //
    // * .css(kv)
    //
    //  给符合选择器的所有元素设置样式值
    //
    // ```
    // var el = $('h1');
    // el.css('background-color');         // 获取属性
    // el.css('background-color', '#369'); // 设置属性
    // el.css('background-color', '');     // 删除属性
    // // 设置多个属性
    // el.css({
    //     fontSize       : 28,
    //     backgroundColor: '#8EE'
    // });
    // ```
    css: function(name, val) {
        var key,
            ret = '';

        if (val == undefined) {
            if (isString(name)) {
                var el = this[0];

                return el ? el.style[camelCase(name)] || getComputedStyle(el, name) : '';
            } else if (isObject(name)) {
                for (key in name) {
                    ret += dasherize(key) + ':' + maybeAddPx(key, name[key]) + ';';
                }
            }
        } else {
            ret = dasherize(name) + ':' + maybeAddPx(name, val) + ';';
        }

        return each(this, function(el) {
            el.style.cssText += ';' + ret;
        });
    },

    // ** .show() **
    //
    // * .show()
    //
    //  显示符合选择器的所有元素
    show: function() {
        return each(this, function(el) {
            el.style.display == 'none' && (el.style.display = '');
            if (getComputedStyle(el, 'display') == 'none') {
                el.style.display = getDefaultDisplay(el.nodeName);
            }
        });
    },

    // ** .hide() **
    //
    // * .hide()
    //
    //  隐藏符合选择器的所有元素
    hide: function() {
        return this.css('display', 'none');
    },

    // ** .toggle() **
    //
    // * .toggle()
    //
    //  将符合选择器的所有元素切换显示/隐藏两个状态
    toggle: function() {
        return each(this, function(el) {
            var $el = $(el);

            $el.css('display') == 'none' ? $el.show() : $el.hide();
        });
    }

});

// ** .width() **
//
// * .width()
//
//  获取符合选择器的第一个元素的宽度值
//
// * .width(val)
//
//  给符合选择器的所有元素设置宽度值
//
// `.width()` 和 `.css('width')` 的区别
//
// `.width()` 返回不带单位的纯数值，`.css('width')` 返回带单位的原始值（例如：400px），当需要数值计算时, 推荐该方法.
//
// 获取 `window` 和 `document` 的宽度
//
// ```
// // 获取当前可视区域的宽度值, 相当于 viewportWidth
// S.all(window).width();
//
// // 获取页面文档 document 的总宽度, 相当于 docWidth
// S.all(document).width();
// ```
//
// ** .height() **
//
// * .height()
//
//  获取符合选择器的第一个元素的高度值
//
// * .height(val)
//
//  给符合选择器的所有元素设置高度值
//
// 获取 `window` 和 `document` 的高度
//
// ```
// // 获取当前可视区域的高度值, 相当于 viewportHeight
// S.all(window).height();
//
// // 获取页面文档 document 的总高度, 相当于 docHeight
// S.all(document).height();
// ```
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

/**
 * @ignore
 * @file node-insertion
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// ** .filterScripts() **
//
// * .filterScripts(nodes, scripts)
//
//  内部方法，将 nodes 中的脚本节点过滤掉
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

// ** .nodeListToFragment() **
//
// * .nodeListToFragment(nodes)
//
//  内部方法，将 nodes 转换为文档片段，不会被添加到文档树中
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
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrapAll('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    // ```
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
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrap('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //     </div>
    //     <div class="new">
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    // ```
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
    //
    // ```
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //     </div>
    //     <div class="new">
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    //
    // S.all('.inner').unwrap(); //=>
    //
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    // ```
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
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrapInner('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="inner">
    //         <div class="new">Hello</div>
    //     </div>
    //     <div class="inner">
    //         <div class="new">Goodbye</div>
    //     </div>
    // </div>
    // ```
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

/**
 * @ignore
 * @file node-offset
 * @author 莫争 <gaoli.gl@taobao.com>
 */

mix(node, {

    // ** .offset() **
    //
    // * .offset()
    //
    //  获取符合选择器的第一个元素相对页面文档左上角的偏移值
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

// ** .scrollTop() **
//
// * .scrollTop()
//
//  获取窗口或元素的 scrollTop 值
//
// * .scrollTop(val)
//
//  设置窗口或元素的 scrollTop 值
//
// ** .scrollLeft() **
//
// * .scrollLeft()
//
//  获取窗口或元素的 scrollLeft 值
//
// * .scrollLeft(val)
//
//  设置窗口或元素的 scrollLeft 值
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
        return arguments.length ?
            each(this, function(el) {
                $(el).empty().append(html, loadScripts);
            }) :
            this.length ? this[0].textContent : null;
    },

    // ** .remove() **
    //
    // * .remove()
    //
    //  将符合选择器的所有元素从 DOM 中移除
    remove: function() {
        return each(this, function(el) {
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

/**
 * @ignore
 * @file output
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// ** Node 模块提供的快捷方式 **
//
// ```
// mix(S, {
//     node    : node,  // 参元类
//     Node    : $,     // 构造器
//     NodeList: $,     // 构造器
//     one     : $.one, // 获取 / 创建一个 Node 对象
//     all     : $.all  // 获取 / 创建一批 Node 对象
// });
// ```
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