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
    //
    // * .offset(coordinates)
    //
    //  给符合选择器的所有元素设置偏移值
    offset: function(coordinates) {
        var ret;

        if (this.length) {
            if (coordinates === undefined) {
                var obj = this[0].getBoundingClientRect();

                ret = {
                    left  : obj.left + win.pageXOffset,
                    top   : obj.top  + win.pageYOffset,
                    width : Math.round(obj.width),
                    height: Math.round(obj.height)
                }
            } else {
                each(this, function(el) {
                    var ret = {},
                        $el = $(el),
                        old = $el.offset(),
                        key,
                        current;

                    if ($el.css('position') === 'static') {
                        $el.css('position', 'relative');
                    }

                    for (key in coordinates) {
                        current  = parseFloat($el.css(key)) || 0;
                        ret[key] = current + coordinates[key] - old[key];
                    }

                    $el.css(ret);
                });

                return this;
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
