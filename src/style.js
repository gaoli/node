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
