require({cache:{"dbootstrap/icon_support":function(){define(["dojo/_base/kernel","dojo/_base/lang","dojo/_base/array","dojo/dom-construct","dojo/dom-class"],function(f,l,b,e,m){function d(a){var h=["IMG","INPUT"],k="dijitIcon dijitTabStripIcon dijitMenuExpand dijitCalendarIncrementControl dijitArrowButtonInner dijitTreeExpando dijitArrowNode".split(" "),f=["class","data-dojo-attach-point"],d=a;l.isArray(d)||(d=a.all||a.getElementsByTagName("*"));for(var c=l.isArray(a)?0:-1;0>c||d[c];c++){var p=-1==
c?a:d[c];if(-1!==b.indexOf(h,p.tagName))for(var t=0,g=k.length;t<g;t++)if(m.contains(p,k[t])){var u={};b.forEach(f,function(c){var a=p.getAttribute(c);a&&(u[c]=a)});e.create("span",u,p,"replace");break}}}function g(a){var b=a.prototype._attachTemplateNodes;a.prototype._attachTemplateNodes=function(a){d(a);return b.apply(this,arguments)}}return{load:function(a,b,k){a=["dijit/_TemplatedMixin"];9<=f.version.minor&&a.push("dijit/_AttachMixin");b(a,function(a,b){g(b||a);k(a)})}}})}}});define("dbootstrap/main",["./icon_support!"],function(f){return{TemplatedMixin:f}});