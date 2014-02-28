/**
 * @ignore
 * @file ie
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// IE10 及以下浏览器不支持 `__proto__` 继承，需重写 `.node()` 和 `.isNode()` 方法来兼容
if (!('__proto__' in {})) {
    mix($, {
        node: function(els) {
            els = els || [];
            mix(els, node);
            els.__node = true;
            return els;
        },
        isNode: function(obj) {
            return isArray(obj) && '__node' in obj;
        }
    });
}