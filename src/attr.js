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
