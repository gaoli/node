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
