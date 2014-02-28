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
    // * .toggleClass(names[, when])
    //
    //  操作符合选择器的所有元素，如果存在值为 names 的 class，则移除掉，反之添加
    //
    //  如果 when 的值为真，这个功能类似于 `.addClass()` 方法，如果为假，这个功能类似与 `.removeClass()` 方法
    toggleClass: function(names, when) {
        if (!names) return this;
        return each(this, function(el) {
            var $el = $(el);

            each(classSplit(names), function(name) {
                (when === undefined ? !$el.hasClass(name) : when) ?
                    $el.addClass(name) : $el.removeClass(name);
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
