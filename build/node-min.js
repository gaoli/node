!function(a,b){function c(a,b){for(var c in b)a[c]=b[c]}function d(a,b){var c,d=[];return a&&O.call(a,function(a,e){c=b(a,e),null!==c&&d.push(c)}),d.length?M.apply([],d):d}function e(a,b){return a&&O.call(a,b),a}function f(a){return a&&a==a.window}function g(a){return a&&9===a.nodeType}function h(a){return a&&1===a.nodeType}function i(a){return a&&"number"==typeof a.length}function j(a){return L.call(a,function(b,c){return a.indexOf(b)==c})}function k(a){var b=F.createElement("script"),c=F.getElementsByTagName("head")[0]||G;b.src=a,c.insertBefore(b,c.firstChild)}function l(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function m(a,b){return 1===b.length?n(a,b[0]):j(d(b,function(b){return n(a,b)}))}function n(a,b){var c,d=a.charAt(0),e="#"===d,f="."===d,i=e||f?a.slice(1):a,j=/^[\w-]*$/.test(i);return g(b)||h(b)?g(b)&&e&&j?(c=b.getElementById(i))?[c]:[]:K.call(!e&&j?f?b.getElementsByClassName(i):b.getElementsByTagName(a):b.querySelectorAll(a)):[]}function o(a,b){if(!a||!b||!h(a))return!1;var c=a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.matchesSelector;if(c)return c.call(a,b);var d,e=a.parentNode,f=!!e;return f||(e=X,e.appendChild(a)),d=~n(b,e).indexOf(a),!f&&e.removeChild(a),d}function p(a){return a in Y?Y[a]:Y[a]=new RegExp("(^|\\s)"+a+"(\\s|$)")}function q(a,b){return void 0===b?a.className:void(a.className=b)}function r(a){return a.split(/[\.\s]\s*\.?/)}function s(a,b){return d(a,function(a){return a[b]})}function t(a,b,c){null==c?a.removeAttribute(b):a.setAttribute(b,c)}function u(a){return a.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function v(a){return a.replace(/-+(.)?/g,function(){return arguments[1].toUpperCase()})}function w(a,b){return P(b)&&!ab[u(a)]?b+"px":b}function x(a,b){return E.getComputedStyle(a,null).getPropertyValue(b)}function y(a){if(!bb[a]){var b,c=F.createElement(a);F.body.appendChild(c),b=x(c,"display"),c.parentNode.removeChild(c),"none"==b&&(b="block"),bb[a]=b}return bb[a]}function z(a,b){var c=W(a);return void 0!==b?c.filter(S(b)?function(a){return I.call(b,function(b){return o(a,b)})}:b):c}function A(a){return"children"in a?K.call(a.children):d(a.childNodes,function(a){return h(a)?a:void 0})}function B(a,b,c,d){var e=[],f=S(b);for(a=d?a:a[c];a;)a&&!g(a)&&h(a)&&e.indexOf(a)<0&&e.push(a),a=a[c];return f&&!b.length&&(b=void 0),e=z(e,b),f?e:e.item(0)}function C(a,b){var c=[];return e(a,function(a){var d=a.nodeName,f=a.type,g=[];!d||"SCRIPT"!==d||f&&"text/javascript"!==f?(h(a)&&(e(a.getElementsByTagName("script"),function(a){g.push(a)}),C(g,b)),c.push(a)):(a.parentNode&&a.parentNode.removeChild(a),b&&b.push(a))}),c}function D(a){var b=null;return a&&i(a)&&(b=F.createDocumentFragment(),e(a,function(a){b.appendChild(a)})),b}var E=window,F=document,G=F.documentElement,H=[],I=H.some,J=H.every,K=H.slice,L=H.filter,M=H.concat,N=H.indexOf,O=H.forEach,P=l("Number"),Q=l("String"),R=l("Object"),S=Array.isArray||l("Array"),T=l("Function"),U=function(a){return R(a)&&!f(a)&&Object.getPrototypeOf(a)==Object.prototype},V={};c(V,{indexOf:function(a){return i(a)?N.call(this,a[0]):N.apply(this,arguments)},each:function(a){return J.call(this,function(b,c){return b=W(b),a.call(b,b,c)!==!1}),this},slice:function(){return W(K.apply(this,arguments))},end:function(){return this.__parent||this},getDOMNode:function(){return this[0]}});var W=function(a,b){var c=[];if(a)if(Q(a))a=a.trim(),c="<"==a[0]&&/<([\w:]+)/.test(a)?V.create(a):void 0!==b?m(a,W(b)):n(a,F);else{if(W.isNode(a))return a;a.nodeType||a.setTimeout?c=[a]:S(a)?c=a:a.nodeType||a.setTimeout||!a.item||(c=K.call(a))}return W.node(c)};W.all=function(a,b){return W(a,b)},W.one=function(a,b){return W(a,b).item(0)},W.node=function(a){return a=a||[],a.__proto__=V,a},W.node.prototype=V,W.isNode=function(a){return a instanceof W.node};var X=document.createElement("div");c(b,{query:n}),c(V,{all:function(a){var b,c=this;return b=W(m(a,c)),b.__parent=c,b},one:function(a){var b,c=this;return b=c.all(a),b=b.length?b.slice(0,1):null,b&&(b.__parent=c),b},filter:function(a){return W(T(a)?L.call(this,function(b){return a.call(b,b)}):L.call(this,function(b){return o(b,a)}))}});var Y={};c(V,{addClass:function(a){return a?e(this,function(b){var c=W(b),d=q(b),f=[];e(r(a),function(a){!c.hasClass(a)&&f.push(a)}),f.length&&q(b,d+(d?" ":"")+f.join(" "))}):this},removeClass:function(a){return e(this,function(b){if(void 0===a)return q(b,"");var c=q(b);e(r(a),function(a){c=c.replace(p(a)," ")}),q(b,c.trim())})},toggleClass:function(a){return a?e(this,function(b){var c=W(b);e(r(a),function(a){c.hasClass(a)?c.removeClass(a):c.addClass(a)})}):this},hasClass:function(a){return a?I.call(this,function(a){return J.call(this,function(b){return b?p(b).test(q(a)):!0})},r(a)):!1}});var Z=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,$=["val","css","html","text","data","width","height","offset"],_={hidefocus:"hideFocus",tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"};c(V,{attr:function(a,b){var c,d;if(U(a)){for(c in a)V.attr.call(this,c,a[c]);return this}if(~$.indexOf(a))return W(this)[a](b);if(void 0==b){var f=this[0];f&&h(f)&&(Z.test(a)?d=W(f).prop(a)?a.toLowerCase():void 0:"value"==a&&"INPUT"==f.nodeName?d=this.val():(d=f.getAttribute(a),d=!d&&a in f?f[a]:d))}else d=e(this,function(c){h(c)&&t(c,a,b)});return null===d?void 0:d},removeAttr:function(a){return e(this,function(b){h(b)&&t(b,a)})},hasAttr:function(a){return a?I.call(this,function(b){return h(b)&&b.getAttribute(a)}):!1},prop:function(a,b){return a=_[a]||a,void 0==b?this[0]&&this[0][a]:e(this,function(c){c[a]=b})},hasProp:function(a){return a?(a=_[a]||a,I.call(this,function(b){return h(b)&&b[a]})):!1},val:function(a){var b=this[0];if(!b)return this;if(b.multiple){var c=W("option",b);return void 0==a?K.call(s(c.filter(function(a){return a.selected}),"value")):e(c,function(b){b.selected=~a.indexOf(b.value)})}return void 0==a?b.value:e(this,function(b){b.value=a})},text:function(a){return arguments.length?e(this,function(b){b.textContent=void 0===a?"":""+a}):this.length?this[0].textContent:null}});var ab={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},bb={};c(V,{css:function(a,b){var c,d="";if(void 0==b){if(Q(a)){var f=this[0];return f?f.style[v(a)]||x(f,a):""}if(R(a))for(c in a)d+=u(c)+":"+w(c,a[c])+";"}else d=u(a)+":"+w(a,b)+";";return e(this,function(a){a.style.cssText+=";"+d})},show:function(){return e(this,function(a){"none"==a.style.display&&(a.style.display=""),"none"==x(a,"display")&&(a.style.display=y(a.nodeName))})},hide:function(){return this.css("display","none")},toggle:function(){return e(this,function(a){var b=W(a);"none"==b.css("display")?b.show():b.hide()})}}),e(["width","height"],function(a){V[a]=function(b){var c=this[0];return b?W(this).css(a,b):f(c)?c[v("inner-"+a)]:g(c)?G[v("scroll-"+a)]:this.offset()[a]}}),c(V,{item:function(a){var b=this;return P(a)?a>=b.length?null:W(b[a]):W(a)},first:function(a){return B(this[0]&&this[0].firstChild,a,"nextElementSibling",!0)},last:function(a){return B(this[0]&&this[0].lastChild,a,"previousElementSibling",!0)},next:function(a){return B(this[0],a,"nextElementSibling")},prev:function(a){return B(this[0],a,"previousElementSibling")},parent:function(a){return B(this[0],a,"parentNode")},children:function(a){var b=this[0];return b?z(A(b),a):this},siblings:function(a){var b=this[0];return b?z(L.call(A(b.parentNode),function(a){return a!==b}),a):this},contents:function(){var a=this[0];return a?W(K.call(a.childNodes)):this},contains:function(a){var b=this[0],a=i(a)?a[0]:a;return b&&a?b!==a&&b.contains(a):!1}}),c(V,{wrapAll:function(a){var b=this[0];if(b){var c,d=W(a);for(d.insertBefore(b);(c=d.children()).length;)d=d.first();d.append(this)}return this},wrap:function(a){var b=W(a),c=b[0].parentNode||this.length;return e(this,function(a){W(a).wrapAll(c?b[0].cloneNode(!0):b[0])})},unwrap:function(){return e(this,function(a){var b=W(a),c=b.parent();c.replaceWith(c.children())})},wrapInner:function(a){return e(this,function(b){var c=W(b),d=c.children();d.length?d.wrapAll(a):c.append(a)})},replaceWith:function(a){return this.before(a).remove()}}),e(["after","prepend","before","append"],function(a,b){var c=b%2;V[a]=function(a,d){var f,g,h=Q(a)?V.create(a):a,i=this.length>1;if(d)var j=[];return h.length?(h=D(C(h,j)),e(this,function(a){switch(f=c?a:a.parentNode,b){case 0:g=a.nextSibling;break;case 1:g=a.firstChild;break;case 2:g=a;break;default:g=null}f.insertBefore(i?h.cloneNode(!0):h,g),e(j,function(a){a.src?k(a.src):E.eval.call(E,a.innerHTML)})})):this},V[c?a+"To":"insert"+(b?"Before":"After")]=function(b){return W(b)[a](this),this}}),c(V,{offset:function(a){var b;if(this.length){if(void 0!==a)return e(this,function(b){var c,d,e={},f=W(b),g=f.offset();"static"===f.css("position")&&f.css("position","relative");for(c in a)d=parseFloat(f.css(c))||0,e[c]=d+a[c]-g[c];f.css(e)}),this;var c=this[0].getBoundingClientRect();b={left:c.left+E.pageXOffset,top:c.top+E.pageYOffset,width:Math.round(c.width),height:Math.round(c.height)}}return b}}),e(["scrollTop","scrollLeft"],function(a,b){V[a]=function(c){var d=this[0],f=a in d;return void 0===c?f?d[a]:d["page"+(b?"X":"Y")+"Offset"]:f?e(this,function(b){b[a]=c}):e(this,function(a){b?a.scrollTo(c,a.scrollY):a.scrollTo(a.scrollX,c)})}});var cb=/<([\w:]+)/,db=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,eb=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,fb=F.createElement("div"),gb=F.createElement("table"),hb=F.createElement("tbody"),ib=F.createElement("tr"),jb={"*":fb,thead:gb,tbody:gb,tfoot:gb,tr:hb,th:ib,td:ib};c(V,{create:function(a,b){var c,d,f,g=[];if(!a||!Q(a))return g;if(eb.test(a)?g=W(F.createElement(RegExp.$1)):(a=a.replace(db,"<$1></$2>"),d=cb.test(a)&&RegExp.$1,f=jb[d]||jb["*"],f.innerHTML=a,g=e(K.call(f.childNodes),function(a){f.removeChild(a)})),U(b))for(c in b)g.attr(c,b[c]);return g},html:function(a,b){return arguments.length?e(this,function(c){W(c).empty().append(a,b)}):this.length?this[0].textContent:null},remove:function(){return e(this,function(a){a.parentNode&&a.parentNode.removeChild(a)})},empty:function(){return e(this,function(a){a.innerHTML=""})},clone:function(a){return W(d(this,function(b){return b.cloneNode(!!a)}))}}),c(b,{node:V,Node:W,NodeList:W,one:W.one,all:W.all}),b.add&&b.add("node",function(){return W})}(this,KISSY);