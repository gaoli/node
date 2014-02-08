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
