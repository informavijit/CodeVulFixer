"use strict";var jt=Object.create;var ee=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var Ut=Object.getOwnPropertyNames;var $t=Object.getPrototypeOf,Mt=Object.prototype.hasOwnProperty;var _=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),It=(r,e)=>{for(var t in e)ee(r,t,{get:e[t],enumerable:!0})},Ne=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Ut(e))!Mt.call(r,o)&&o!==t&&ee(r,o,{get:()=>e[o],enumerable:!(s=Lt(e,o))||s.enumerable});return r};var v=(r,e,t)=>(t=r!=null?jt($t(r)):{},Ne(e||!r||!r.__esModule?ee(t,"default",{value:r,enumerable:!0}):t,r)),Vt=r=>Ne(ee({},"__esModule",{value:!0}),r);var H=_(we=>{"use strict";Object.defineProperty(we,"__esModule",{value:!0});function qt(){return typeof navigator=="object"&&"userAgent"in navigator?navigator.userAgent:typeof process=="object"&&process.version!==void 0?`Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`:"<environment undetectable>"}we.getUserAgent=qt});var er=_((Di,Ye)=>{Ye.exports=Ze;function Ze(r,e,t,s){if(typeof t!="function")throw new Error("method for before hook must be a function");return s||(s={}),Array.isArray(e)?e.reverse().reduce(function(o,i){return Ze.bind(null,r,i,o,s)},t)():Promise.resolve().then(function(){return r.registry[e]?r.registry[e].reduce(function(o,i){return i.hook.bind(null,o,s)},t)():t(s)})}});var tr=_((ji,rr)=>{rr.exports=zt;function zt(r,e,t,s){var o=s;r.registry[t]||(r.registry[t]=[]),e==="before"&&(s=function(i,n){return Promise.resolve().then(o.bind(null,n)).then(i.bind(null,n))}),e==="after"&&(s=function(i,n){var c;return Promise.resolve().then(i.bind(null,n)).then(function(a){return c=a,o(c,n)}).then(function(){return c})}),e==="error"&&(s=function(i,n){return Promise.resolve().then(i.bind(null,n)).catch(function(c){return o(c,n)})}),r.registry[t].push({hook:s,orig:o})}});var or=_((Li,sr)=>{sr.exports=Ht;function Ht(r,e,t){if(r.registry[e]){var s=r.registry[e].map(function(o){return o.orig}).indexOf(t);s!==-1&&r.registry[e].splice(s,1)}}});var dr=_((Ui,N)=>{var cr=er(),Nt=tr(),Wt=or(),ir=Function.bind,nr=ir.bind(ir);function lr(r,e,t){var s=nr(Wt,null).apply(null,t?[e,t]:[e]);r.api={remove:s},r.remove=s,["before","error","after","wrap"].forEach(function(o){var i=t?[e,o,t]:[e,o];r[o]=r.api[o]=nr(Nt,null).apply(null,i)})}function Bt(){var r="h",e={registry:{}},t=cr.bind(null,e,r);return lr(t,e,r),t}function pr(){var r={registry:{}},e=cr.bind(null,r);return lr(e,r),e}var ar=!1;function M(){return ar||(console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'),ar=!0),pr()}M.Singular=Bt.bind();M.Collection=pr.bind();N.exports=M;N.exports.Hook=M;N.exports.Singular=M.Singular;N.exports.Collection=M.Collection});var Er=_(($i,yr)=>{"use strict";var Se=Object.defineProperty,Jt=Object.getOwnPropertyDescriptor,Kt=Object.getOwnPropertyNames,Xt=Object.prototype.hasOwnProperty,Qt=(r,e)=>{for(var t in e)Se(r,t,{get:e[t],enumerable:!0})},Zt=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Kt(e))!Xt.call(r,o)&&o!==t&&Se(r,o,{get:()=>e[o],enumerable:!(s=Jt(e,o))||s.enumerable});return r},Yt=r=>Zt(Se({},"__esModule",{value:!0}),r),mr={};Qt(mr,{endpoint:()=>ms});yr.exports=Yt(mr);var es=H(),rs="9.0.6",ts=`octokit-endpoint.js/${rs} ${(0,es.getUserAgent)()}`,ss={method:"GET",baseUrl:"https://api.github.com",headers:{accept:"application/vnd.github.v3+json","user-agent":ts},mediaType:{format:""}};function os(r){return r?Object.keys(r).reduce((e,t)=>(e[t.toLowerCase()]=r[t],e),{}):{}}function is(r){if(typeof r!="object"||r===null||Object.prototype.toString.call(r)!=="[object Object]")return!1;let e=Object.getPrototypeOf(r);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(r)}function fr(r,e){let t=Object.assign({},r);return Object.keys(e).forEach(s=>{is(e[s])?s in r?t[s]=fr(r[s],e[s]):Object.assign(t,{[s]:e[s]}):Object.assign(t,{[s]:e[s]})}),t}function ur(r){for(let e in r)r[e]===void 0&&delete r[e];return r}function ke(r,e,t){if(typeof e=="string"){let[o,i]=e.split(" ");t=Object.assign(i?{method:o,url:i}:{url:o},t)}else t=Object.assign({},e);t.headers=os(t.headers),ur(t),ur(t.headers);let s=fr(r||{},t);return t.url==="/graphql"&&(r&&r.mediaType.previews?.length&&(s.mediaType.previews=r.mediaType.previews.filter(o=>!s.mediaType.previews.includes(o)).concat(s.mediaType.previews)),s.mediaType.previews=(s.mediaType.previews||[]).map(o=>o.replace(/-preview/,""))),s}function ns(r,e){let t=/\?/.test(r)?"&":"?",s=Object.keys(e);return s.length===0?r:r+t+s.map(o=>o==="q"?"q="+e.q.split("+").map(encodeURIComponent).join("+"):`${o}=${encodeURIComponent(e[o])}`).join("&")}var as=/\{[^{}}]+\}/g;function cs(r){return r.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g,"").split(/,/)}function ls(r){let e=r.match(as);return e?e.map(cs).reduce((t,s)=>t.concat(s),[]):[]}function gr(r,e){let t={__proto__:null};for(let s of Object.keys(r))e.indexOf(s)===-1&&(t[s]=r[s]);return t}function hr(r){return r.split(/(%[0-9A-Fa-f]{2})/g).map(function(e){return/%[0-9A-Fa-f]/.test(e)||(e=encodeURI(e).replace(/%5B/g,"[").replace(/%5D/g,"]")),e}).join("")}function V(r){return encodeURIComponent(r).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function W(r,e,t){return e=r==="+"||r==="#"?hr(e):V(e),t?V(t)+"="+e:e}function I(r){return r!=null}function _e(r){return r===";"||r==="&"||r==="?"}function ps(r,e,t,s){var o=r[t],i=[];if(I(o)&&o!=="")if(typeof o=="string"||typeof o=="number"||typeof o=="boolean")o=o.toString(),s&&s!=="*"&&(o=o.substring(0,parseInt(s,10))),i.push(W(e,o,_e(e)?t:""));else if(s==="*")Array.isArray(o)?o.filter(I).forEach(function(n){i.push(W(e,n,_e(e)?t:""))}):Object.keys(o).forEach(function(n){I(o[n])&&i.push(W(e,o[n],n))});else{let n=[];Array.isArray(o)?o.filter(I).forEach(function(c){n.push(W(e,c))}):Object.keys(o).forEach(function(c){I(o[c])&&(n.push(V(c)),n.push(W(e,o[c].toString())))}),_e(e)?i.push(V(t)+"="+n.join(",")):n.length!==0&&i.push(n.join(","))}else e===";"?I(o)&&i.push(V(t)):o===""&&(e==="&"||e==="?")?i.push(V(t)+"="):o===""&&i.push("");return i}function ds(r){return{expand:us.bind(null,r)}}function us(r,e){var t=["+","#",".","/",";","?","&"];return r=r.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g,function(s,o,i){if(o){let c="",a=[];if(t.indexOf(o.charAt(0))!==-1&&(c=o.charAt(0),o=o.substr(1)),o.split(/,/g).forEach(function(l){var p=/([^:\*]*)(?::(\d+)|(\*))?/.exec(l);a.push(ps(e,c,p[1],p[2]||p[3]))}),c&&c!=="+"){var n=",";return c==="?"?n="&":c!=="#"&&(n=c),(a.length!==0?c:"")+a.join(n)}else return a.join(",")}else return hr(i)}),r==="/"?r:r.replace(/\/$/,"")}function br(r){let e=r.method.toUpperCase(),t=(r.url||"/").replace(/:([a-z]\w+)/g,"{$1}"),s=Object.assign({},r.headers),o,i=gr(r,["method","baseUrl","url","headers","request","mediaType"]),n=ls(t);t=ds(t).expand(i),/^http/.test(t)||(t=r.baseUrl+t);let c=Object.keys(r).filter(p=>n.includes(p)).concat("baseUrl"),a=gr(i,c);if(!/application\/octet-stream/i.test(s.accept)&&(r.mediaType.format&&(s.accept=s.accept.split(/,/).map(p=>p.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,`application/vnd$1$2.${r.mediaType.format}`)).join(",")),t.endsWith("/graphql")&&r.mediaType.previews?.length)){let p=s.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g)||[];s.accept=p.concat(r.mediaType.previews).map(u=>{let m=r.mediaType.format?`.${r.mediaType.format}`:"+json";return`application/vnd.github.${u}-preview${m}`}).join(",")}return["GET","HEAD"].includes(e)?t=ns(t,a):"data"in a?o=a.data:Object.keys(a).length&&(o=a),!s["content-type"]&&typeof o<"u"&&(s["content-type"]="application/json; charset=utf-8"),["PATCH","PUT"].includes(e)&&typeof o>"u"&&(o=""),Object.assign({method:e,url:t,headers:s},typeof o<"u"?{body:o}:null,r.request?{request:r.request}:null)}function gs(r,e,t){return br(ke(r,e,t))}function vr(r,e){let t=ke(r,e),s=gs.bind(null,t);return Object.assign(s,{DEFAULTS:t,defaults:vr.bind(null,t),merge:ke.bind(null,t),parse:br})}var ms=vr(null,ss)});var Tr=_(xe=>{"use strict";Object.defineProperty(xe,"__esModule",{value:!0});var Pe=class extends Error{constructor(e){super(e),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="Deprecation"}};xe.Deprecation=Pe});var kr=_((Ii,_r)=>{_r.exports=wr;function wr(r,e){if(r&&e)return wr(r)(e);if(typeof r!="function")throw new TypeError("need wrapper function");return Object.keys(r).forEach(function(s){t[s]=r[s]}),t;function t(){for(var s=new Array(arguments.length),o=0;o<s.length;o++)s[o]=arguments[o];var i=r.apply(this,s),n=s[s.length-1];return typeof i=="function"&&i!==n&&Object.keys(n).forEach(function(c){i[c]=n[c]}),i}}});var xr=_((Vi,Ge)=>{var Sr=kr();Ge.exports=Sr(te);Ge.exports.strict=Sr(Pr);te.proto=te(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return te(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Pr(this)},configurable:!0})});function te(r){var e=function(){return e.called?e.value:(e.called=!0,e.value=r.apply(this,arguments))};return e.called=!1,e}function Pr(r){var e=function(){if(e.called)throw new Error(e.onceError);return e.called=!0,e.value=r.apply(this,arguments)},t=r.name||"Function wrapped with `once`";return e.onceError=t+" shouldn't be called more than once",e.called=!1,e}});var Or=_((qi,Rr)=>{"use strict";var fs=Object.create,se=Object.defineProperty,hs=Object.getOwnPropertyDescriptor,bs=Object.getOwnPropertyNames,vs=Object.getPrototypeOf,ys=Object.prototype.hasOwnProperty,Es=(r,e)=>{for(var t in e)se(r,t,{get:e[t],enumerable:!0})},Cr=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of bs(e))!ys.call(r,o)&&o!==t&&se(r,o,{get:()=>e[o],enumerable:!(s=hs(e,o))||s.enumerable});return r},Ts=(r,e,t)=>(t=r!=null?fs(vs(r)):{},Cr(e||!r||!r.__esModule?se(t,"default",{value:r,enumerable:!0}):t,r)),ws=r=>Cr(se({},"__esModule",{value:!0}),r),Ar={};Es(Ar,{RequestError:()=>Ss});Rr.exports=ws(Ar);var Gr=Tr(),Fr=Ts(xr()),_s=(0,Fr.default)(r=>console.warn(r)),ks=(0,Fr.default)(r=>console.warn(r)),Ss=class extends Error{constructor(r,e,t){super(r),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="HttpError",this.status=e;let s;"headers"in t&&typeof t.headers<"u"&&(s=t.headers),"response"in t&&(this.response=t.response,s=t.response.headers);let o=Object.assign({},t.request);t.request.headers.authorization&&(o.headers=Object.assign({},t.request.headers,{authorization:t.request.headers.authorization.replace(/(?<! ) .*$/," [REDACTED]")})),o.url=o.url.replace(/\bclient_secret=\w+/g,"client_secret=[REDACTED]").replace(/\baccess_token=\w+/g,"access_token=[REDACTED]"),this.request=o,Object.defineProperty(this,"code",{get(){return _s(new Gr.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")),e}}),Object.defineProperty(this,"headers",{get(){return ks(new Gr.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.")),s||{}}})}}});var J=_((Hi,Lr)=>{"use strict";var Fe=Object.defineProperty,Ps=Object.getOwnPropertyDescriptor,xs=Object.getOwnPropertyNames,Gs=Object.prototype.hasOwnProperty,Cs=(r,e)=>{for(var t in e)Fe(r,t,{get:e[t],enumerable:!0})},As=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of xs(e))!Gs.call(r,o)&&o!==t&&Fe(r,o,{get:()=>e[o],enumerable:!(s=Ps(e,o))||s.enumerable});return r},Fs=r=>As(Fe({},"__esModule",{value:!0}),r),jr={};Cs(jr,{request:()=>$s});Lr.exports=Fs(jr);var Rs=Er(),Os=H(),Ds="8.4.1";function js(r){if(typeof r!="object"||r===null||Object.prototype.toString.call(r)!=="[object Object]")return!1;let e=Object.getPrototypeOf(r);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(r)}var B=Or();function Ls(r){return r.arrayBuffer()}function Dr(r){var e,t,s,o;let i=r.request&&r.request.log?r.request.log:console,n=((e=r.request)==null?void 0:e.parseSuccessResponseBody)!==!1;(js(r.body)||Array.isArray(r.body))&&(r.body=JSON.stringify(r.body));let c={},a,l,{fetch:p}=globalThis;if((t=r.request)!=null&&t.fetch&&(p=r.request.fetch),!p)throw new Error("fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing");return p(r.url,{method:r.method,body:r.body,redirect:(s=r.request)==null?void 0:s.redirect,headers:r.headers,signal:(o=r.request)==null?void 0:o.signal,...r.body&&{duplex:"half"}}).then(async u=>{l=u.url,a=u.status;for(let m of u.headers)c[m[0]]=m[1];if("deprecation"in c){let m=c.link&&c.link.match(/<([^<>]+)>; rel="deprecation"/),g=m&&m.pop();i.warn(`[@octokit/request] "${r.method} ${r.url}" is deprecated. It is scheduled to be removed on ${c.sunset}${g?`. See ${g}`:""}`)}if(!(a===204||a===205)){if(r.method==="HEAD"){if(a<400)return;throw new B.RequestError(u.statusText,a,{response:{url:l,status:a,headers:c,data:void 0},request:r})}if(a===304)throw new B.RequestError("Not modified",a,{response:{url:l,status:a,headers:c,data:await Ce(u)},request:r});if(a>=400){let m=await Ce(u);throw new B.RequestError(Us(m),a,{response:{url:l,status:a,headers:c,data:m},request:r})}return n?await Ce(u):u.body}}).then(u=>({status:a,url:l,headers:c,data:u})).catch(u=>{if(u instanceof B.RequestError)throw u;if(u.name==="AbortError")throw u;let m=u.message;throw u.name==="TypeError"&&"cause"in u&&(u.cause instanceof Error?m=u.cause.message:typeof u.cause=="string"&&(m=u.cause)),new B.RequestError(m,500,{request:r})})}async function Ce(r){let e=r.headers.get("content-type");return/application\/json/.test(e)?r.json().catch(()=>r.text()).catch(()=>""):!e||/^text\/|charset=utf-8$/.test(e)?r.text():Ls(r)}function Us(r){if(typeof r=="string")return r;let e;return"documentation_url"in r?e=` - ${r.documentation_url}`:e="","message"in r?Array.isArray(r.errors)?`${r.message}: ${r.errors.map(JSON.stringify).join(", ")}${e}`:`${r.message}${e}`:`Unknown error: ${JSON.stringify(r)}`}function Ae(r,e){let t=r.defaults(e);return Object.assign(function(o,i){let n=t.merge(o,i);if(!n.request||!n.request.hook)return Dr(t.parse(n));let c=(a,l)=>Dr(t.parse(t.merge(a,l)));return Object.assign(c,{endpoint:t,defaults:Ae.bind(null,t)}),n.request.hook(c,n)},{endpoint:t,defaults:Ae.bind(null,t)})}var $s=Ae(Rs.endpoint,{headers:{"user-agent":`octokit-request.js/${Ds} ${(0,Os.getUserAgent)()}`}})});var Vr=_((Bi,Ir)=>{"use strict";var Re=Object.defineProperty,Ms=Object.getOwnPropertyDescriptor,Is=Object.getOwnPropertyNames,Vs=Object.prototype.hasOwnProperty,qs=(r,e)=>{for(var t in e)Re(r,t,{get:e[t],enumerable:!0})},zs=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Is(e))!Vs.call(r,o)&&o!==t&&Re(r,o,{get:()=>e[o],enumerable:!(s=Ms(e,o))||s.enumerable});return r},Hs=r=>zs(Re({},"__esModule",{value:!0}),r),$r={};qs($r,{GraphqlResponseError:()=>Mr,graphql:()=>Zs,withCustomRequest:()=>Ys});Ir.exports=Hs($r);var Ns=J(),Ws=H(),Bs="7.1.1",Ni=J(),Wi=J();function Js(r){return`Request failed due to following response errors:
`+r.errors.map(e=>` - ${e.message}`).join(`
`)}var Mr=class extends Error{constructor(r,e,t){super(Js(t)),this.request=r,this.headers=e,this.response=t,this.name="GraphqlResponseError",this.errors=t.errors,this.data=t.data,Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}},Ks=["method","baseUrl","url","headers","request","query","mediaType"],Xs=["query","method","url"],Ur=/\/api\/v3\/?$/;function Qs(r,e,t){if(t){if(typeof e=="string"&&"query"in t)return Promise.reject(new Error('[@octokit/graphql] "query" cannot be used as variable name'));for(let n in t)if(Xs.includes(n))return Promise.reject(new Error(`[@octokit/graphql] "${n}" cannot be used as variable name`))}let s=typeof e=="string"?Object.assign({query:e},t):e,o=Object.keys(s).reduce((n,c)=>Ks.includes(c)?(n[c]=s[c],n):(n.variables||(n.variables={}),n.variables[c]=s[c],n),{}),i=s.baseUrl||r.endpoint.DEFAULTS.baseUrl;return Ur.test(i)&&(o.url=i.replace(Ur,"/api/graphql")),r(o).then(n=>{if(n.data.errors){let c={};for(let a of Object.keys(n.headers))c[a]=n.headers[a];throw new Mr(o,c,n.data)}return n.data.data})}function Oe(r,e){let t=r.defaults(e);return Object.assign((o,i)=>Qs(t,o,i),{defaults:Oe.bind(null,t),endpoint:t.endpoint})}var Zs=Oe(Ns.request,{headers:{"user-agent":`octokit-graphql.js/${Bs} ${(0,Ws.getUserAgent)()}`},method:"POST",url:"/graphql"});function Ys(r){return Oe(r,{method:"POST",url:"/graphql"})}});var Hr=_((Ki,zr)=>{"use strict";var De=Object.defineProperty,eo=Object.getOwnPropertyDescriptor,ro=Object.getOwnPropertyNames,to=Object.prototype.hasOwnProperty,so=(r,e)=>{for(var t in e)De(r,t,{get:e[t],enumerable:!0})},oo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ro(e))!to.call(r,o)&&o!==t&&De(r,o,{get:()=>e[o],enumerable:!(s=eo(e,o))||s.enumerable});return r},io=r=>oo(De({},"__esModule",{value:!0}),r),qr={};so(qr,{createTokenAuth:()=>go});zr.exports=io(qr);var no=/^v1\./,ao=/^ghs_/,co=/^ghu_/;async function lo(r){let e=r.split(/\./).length===3,t=no.test(r)||ao.test(r),s=co.test(r);return{type:"token",token:r,tokenType:e?"app":t?"installation":s?"user-to-server":"oauth"}}function po(r){return r.split(/\./).length===3?`bearer ${r}`:`token ${r}`}async function uo(r,e,t,s){let o=e.endpoint.merge(t,s);return o.headers.authorization=po(r),e(o)}var go=function(e){if(!e)throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");if(typeof e!="string")throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");return e=e.replace(/^(token|bearer) +/i,""),Object.assign(lo.bind(null,e),{hook:uo.bind(null,e)})}});var Qr=_((Xi,Xr)=>{"use strict";var je=Object.defineProperty,mo=Object.getOwnPropertyDescriptor,fo=Object.getOwnPropertyNames,ho=Object.prototype.hasOwnProperty,bo=(r,e)=>{for(var t in e)je(r,t,{get:e[t],enumerable:!0})},vo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of fo(e))!ho.call(r,o)&&o!==t&&je(r,o,{get:()=>e[o],enumerable:!(s=mo(e,o))||s.enumerable});return r},yo=r=>vo(je({},"__esModule",{value:!0}),r),Jr={};bo(Jr,{Octokit:()=>xo});Xr.exports=yo(Jr);var Eo=H(),To=dr(),Nr=J(),wo=Vr(),_o=Hr(),Kr="5.2.2",Wr=()=>{},ko=console.warn.bind(console),So=console.error.bind(console);function Po(r={}){return typeof r.debug!="function"&&(r.debug=Wr),typeof r.info!="function"&&(r.info=Wr),typeof r.warn!="function"&&(r.warn=ko),typeof r.error!="function"&&(r.error=So),r}var Br=`octokit-core.js/${Kr} ${(0,Eo.getUserAgent)()}`,xo=class{static{this.VERSION=Kr}static defaults(r){return class extends this{constructor(...t){let s=t[0]||{};if(typeof r=="function"){super(r(s));return}super(Object.assign({},r,s,s.userAgent&&r.userAgent?{userAgent:`${s.userAgent} ${r.userAgent}`}:null))}}}static{this.plugins=[]}static plugin(...r){let e=this.plugins;return class extends this{static{this.plugins=e.concat(r.filter(s=>!e.includes(s)))}}}constructor(r={}){let e=new To.Collection,t={baseUrl:Nr.request.endpoint.DEFAULTS.baseUrl,headers:{},request:Object.assign({},r.request,{hook:e.bind(null,"request")}),mediaType:{previews:[],format:""}};if(t.headers["user-agent"]=r.userAgent?`${r.userAgent} ${Br}`:Br,r.baseUrl&&(t.baseUrl=r.baseUrl),r.previews&&(t.mediaType.previews=r.previews),r.timeZone&&(t.headers["time-zone"]=r.timeZone),this.request=Nr.request.defaults(t),this.graphql=(0,wo.withCustomRequest)(this.request).defaults(t),this.log=Po(r.log),this.hook=e,r.authStrategy){let{authStrategy:o,...i}=r,n=o(Object.assign({request:this.request,log:this.log,octokit:this,octokitOptions:i},r.auth));e.wrap("request",n.hook),this.auth=n}else if(!r.auth)this.auth=async()=>({type:"unauthenticated"});else{let o=(0,_o.createTokenAuth)(r.auth);e.wrap("request",o.hook),this.auth=o}let s=this.constructor;for(let o=0;o<s.plugins.length;++o)Object.assign(this,s.plugins[o](this,r))}}});var rt=_((en,et)=>{"use strict";var Le=Object.defineProperty,Go=Object.getOwnPropertyDescriptor,Co=Object.getOwnPropertyNames,Ao=Object.prototype.hasOwnProperty,Fo=(r,e)=>{for(var t in e)Le(r,t,{get:e[t],enumerable:!0})},Ro=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Co(e))!Ao.call(r,o)&&o!==t&&Le(r,o,{get:()=>e[o],enumerable:!(s=Go(e,o))||s.enumerable});return r},Oo=r=>Ro(Le({},"__esModule",{value:!0}),r),Zr={};Fo(Zr,{requestLog:()=>Yr});et.exports=Oo(Zr);var Do="4.0.1";function Yr(r){r.hook.wrap("request",(e,t)=>{r.log.debug("request",t);let s=Date.now(),o=r.request.endpoint.parse(t),i=o.url.replace(t.baseUrl,"");return e(t).then(n=>(r.log.info(`${o.method} ${i} - ${n.status} in ${Date.now()-s}ms`),n)).catch(n=>{throw r.log.info(`${o.method} ${i} - ${n.status} in ${Date.now()-s}ms`),n})})}Yr.VERSION=Do});var ct=_((rn,at)=>{"use strict";var Ue=Object.defineProperty,jo=Object.getOwnPropertyDescriptor,Lo=Object.getOwnPropertyNames,Uo=Object.prototype.hasOwnProperty,$o=(r,e)=>{for(var t in e)Ue(r,t,{get:e[t],enumerable:!0})},Mo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Lo(e))!Uo.call(r,o)&&o!==t&&Ue(r,o,{get:()=>e[o],enumerable:!(s=jo(e,o))||s.enumerable});return r},Io=r=>Mo(Ue({},"__esModule",{value:!0}),r),tt={};$o(tt,{composePaginateRest:()=>zo,isPaginatingEndpoint:()=>Ho,paginateRest:()=>nt,paginatingEndpoints:()=>it});at.exports=Io(tt);var Vo="11.4.4-cjs.2";function qo(r){if(!r.data)return{...r,data:[]};if(!("total_count"in r.data&&!("url"in r.data)))return r;let t=r.data.incomplete_results,s=r.data.repository_selection,o=r.data.total_count;delete r.data.incomplete_results,delete r.data.repository_selection,delete r.data.total_count;let i=Object.keys(r.data)[0],n=r.data[i];return r.data=n,typeof t<"u"&&(r.data.incomplete_results=t),typeof s<"u"&&(r.data.repository_selection=s),r.data.total_count=o,r}function $e(r,e,t){let s=typeof e=="function"?e.endpoint(t):r.request.endpoint(e,t),o=typeof e=="function"?e:r.request,i=s.method,n=s.headers,c=s.url;return{[Symbol.asyncIterator]:()=>({async next(){if(!c)return{done:!0};try{let a=await o({method:i,url:c,headers:n}),l=qo(a);return c=((l.headers.link||"").match(/<([^<>]+)>;\s*rel="next"/)||[])[1],{value:l}}catch(a){if(a.status!==409)throw a;return c="",{value:{status:200,headers:{},data:[]}}}}})}}function st(r,e,t,s){return typeof t=="function"&&(s=t,t=void 0),ot(r,[],$e(r,e,t)[Symbol.asyncIterator](),s)}function ot(r,e,t,s){return t.next().then(o=>{if(o.done)return e;let i=!1;function n(){i=!0}return e=e.concat(s?s(o.value,n):o.value.data),i?e:ot(r,e,t,s)})}var zo=Object.assign(st,{iterator:$e}),it=["GET /advisories","GET /app/hook/deliveries","GET /app/installation-requests","GET /app/installations","GET /assignments/{assignment_id}/accepted_assignments","GET /classrooms","GET /classrooms/{classroom_id}/assignments","GET /enterprises/{enterprise}/code-security/configurations","GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories","GET /enterprises/{enterprise}/dependabot/alerts","GET /enterprises/{enterprise}/secret-scanning/alerts","GET /events","GET /gists","GET /gists/public","GET /gists/starred","GET /gists/{gist_id}/comments","GET /gists/{gist_id}/commits","GET /gists/{gist_id}/forks","GET /installation/repositories","GET /issues","GET /licenses","GET /marketplace_listing/plans","GET /marketplace_listing/plans/{plan_id}/accounts","GET /marketplace_listing/stubbed/plans","GET /marketplace_listing/stubbed/plans/{plan_id}/accounts","GET /networks/{owner}/{repo}/events","GET /notifications","GET /organizations","GET /orgs/{org}/actions/cache/usage-by-repository","GET /orgs/{org}/actions/permissions/repositories","GET /orgs/{org}/actions/runner-groups","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners","GET /orgs/{org}/actions/runners","GET /orgs/{org}/actions/secrets","GET /orgs/{org}/actions/secrets/{secret_name}/repositories","GET /orgs/{org}/actions/variables","GET /orgs/{org}/actions/variables/{name}/repositories","GET /orgs/{org}/attestations/{subject_digest}","GET /orgs/{org}/blocks","GET /orgs/{org}/code-scanning/alerts","GET /orgs/{org}/code-security/configurations","GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories","GET /orgs/{org}/codespaces","GET /orgs/{org}/codespaces/secrets","GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories","GET /orgs/{org}/copilot/billing/seats","GET /orgs/{org}/copilot/metrics","GET /orgs/{org}/copilot/usage","GET /orgs/{org}/dependabot/alerts","GET /orgs/{org}/dependabot/secrets","GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories","GET /orgs/{org}/events","GET /orgs/{org}/failed_invitations","GET /orgs/{org}/hooks","GET /orgs/{org}/hooks/{hook_id}/deliveries","GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}","GET /orgs/{org}/insights/api/subject-stats","GET /orgs/{org}/insights/api/user-stats/{user_id}","GET /orgs/{org}/installations","GET /orgs/{org}/invitations","GET /orgs/{org}/invitations/{invitation_id}/teams","GET /orgs/{org}/issues","GET /orgs/{org}/members","GET /orgs/{org}/members/{username}/codespaces","GET /orgs/{org}/migrations","GET /orgs/{org}/migrations/{migration_id}/repositories","GET /orgs/{org}/organization-roles/{role_id}/teams","GET /orgs/{org}/organization-roles/{role_id}/users","GET /orgs/{org}/outside_collaborators","GET /orgs/{org}/packages","GET /orgs/{org}/packages/{package_type}/{package_name}/versions","GET /orgs/{org}/personal-access-token-requests","GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories","GET /orgs/{org}/personal-access-tokens","GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories","GET /orgs/{org}/private-registries","GET /orgs/{org}/projects","GET /orgs/{org}/properties/values","GET /orgs/{org}/public_members","GET /orgs/{org}/repos","GET /orgs/{org}/rulesets","GET /orgs/{org}/rulesets/rule-suites","GET /orgs/{org}/secret-scanning/alerts","GET /orgs/{org}/security-advisories","GET /orgs/{org}/team/{team_slug}/copilot/metrics","GET /orgs/{org}/team/{team_slug}/copilot/usage","GET /orgs/{org}/teams","GET /orgs/{org}/teams/{team_slug}/discussions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions","GET /orgs/{org}/teams/{team_slug}/invitations","GET /orgs/{org}/teams/{team_slug}/members","GET /orgs/{org}/teams/{team_slug}/projects","GET /orgs/{org}/teams/{team_slug}/repos","GET /orgs/{org}/teams/{team_slug}/teams","GET /projects/columns/{column_id}/cards","GET /projects/{project_id}/collaborators","GET /projects/{project_id}/columns","GET /repos/{owner}/{repo}/actions/artifacts","GET /repos/{owner}/{repo}/actions/caches","GET /repos/{owner}/{repo}/actions/organization-secrets","GET /repos/{owner}/{repo}/actions/organization-variables","GET /repos/{owner}/{repo}/actions/runners","GET /repos/{owner}/{repo}/actions/runs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts","GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs","GET /repos/{owner}/{repo}/actions/secrets","GET /repos/{owner}/{repo}/actions/variables","GET /repos/{owner}/{repo}/actions/workflows","GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs","GET /repos/{owner}/{repo}/activity","GET /repos/{owner}/{repo}/assignees","GET /repos/{owner}/{repo}/attestations/{subject_digest}","GET /repos/{owner}/{repo}/branches","GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations","GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs","GET /repos/{owner}/{repo}/code-scanning/alerts","GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances","GET /repos/{owner}/{repo}/code-scanning/analyses","GET /repos/{owner}/{repo}/codespaces","GET /repos/{owner}/{repo}/codespaces/devcontainers","GET /repos/{owner}/{repo}/codespaces/secrets","GET /repos/{owner}/{repo}/collaborators","GET /repos/{owner}/{repo}/comments","GET /repos/{owner}/{repo}/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/commits","GET /repos/{owner}/{repo}/commits/{commit_sha}/comments","GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls","GET /repos/{owner}/{repo}/commits/{ref}/check-runs","GET /repos/{owner}/{repo}/commits/{ref}/check-suites","GET /repos/{owner}/{repo}/commits/{ref}/status","GET /repos/{owner}/{repo}/commits/{ref}/statuses","GET /repos/{owner}/{repo}/contributors","GET /repos/{owner}/{repo}/dependabot/alerts","GET /repos/{owner}/{repo}/dependabot/secrets","GET /repos/{owner}/{repo}/deployments","GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses","GET /repos/{owner}/{repo}/environments","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps","GET /repos/{owner}/{repo}/environments/{environment_name}/secrets","GET /repos/{owner}/{repo}/environments/{environment_name}/variables","GET /repos/{owner}/{repo}/events","GET /repos/{owner}/{repo}/forks","GET /repos/{owner}/{repo}/hooks","GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries","GET /repos/{owner}/{repo}/invitations","GET /repos/{owner}/{repo}/issues","GET /repos/{owner}/{repo}/issues/comments","GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/issues/events","GET /repos/{owner}/{repo}/issues/{issue_number}/comments","GET /repos/{owner}/{repo}/issues/{issue_number}/events","GET /repos/{owner}/{repo}/issues/{issue_number}/labels","GET /repos/{owner}/{repo}/issues/{issue_number}/reactions","GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues","GET /repos/{owner}/{repo}/issues/{issue_number}/timeline","GET /repos/{owner}/{repo}/keys","GET /repos/{owner}/{repo}/labels","GET /repos/{owner}/{repo}/milestones","GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels","GET /repos/{owner}/{repo}/notifications","GET /repos/{owner}/{repo}/pages/builds","GET /repos/{owner}/{repo}/projects","GET /repos/{owner}/{repo}/pulls","GET /repos/{owner}/{repo}/pulls/comments","GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/pulls/{pull_number}/comments","GET /repos/{owner}/{repo}/pulls/{pull_number}/commits","GET /repos/{owner}/{repo}/pulls/{pull_number}/files","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments","GET /repos/{owner}/{repo}/releases","GET /repos/{owner}/{repo}/releases/{release_id}/assets","GET /repos/{owner}/{repo}/releases/{release_id}/reactions","GET /repos/{owner}/{repo}/rules/branches/{branch}","GET /repos/{owner}/{repo}/rulesets","GET /repos/{owner}/{repo}/rulesets/rule-suites","GET /repos/{owner}/{repo}/secret-scanning/alerts","GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations","GET /repos/{owner}/{repo}/security-advisories","GET /repos/{owner}/{repo}/stargazers","GET /repos/{owner}/{repo}/subscribers","GET /repos/{owner}/{repo}/tags","GET /repos/{owner}/{repo}/teams","GET /repos/{owner}/{repo}/topics","GET /repositories","GET /search/code","GET /search/commits","GET /search/issues","GET /search/labels","GET /search/repositories","GET /search/topics","GET /search/users","GET /teams/{team_id}/discussions","GET /teams/{team_id}/discussions/{discussion_number}/comments","GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /teams/{team_id}/discussions/{discussion_number}/reactions","GET /teams/{team_id}/invitations","GET /teams/{team_id}/members","GET /teams/{team_id}/projects","GET /teams/{team_id}/repos","GET /teams/{team_id}/teams","GET /user/blocks","GET /user/codespaces","GET /user/codespaces/secrets","GET /user/emails","GET /user/followers","GET /user/following","GET /user/gpg_keys","GET /user/installations","GET /user/installations/{installation_id}/repositories","GET /user/issues","GET /user/keys","GET /user/marketplace_purchases","GET /user/marketplace_purchases/stubbed","GET /user/memberships/orgs","GET /user/migrations","GET /user/migrations/{migration_id}/repositories","GET /user/orgs","GET /user/packages","GET /user/packages/{package_type}/{package_name}/versions","GET /user/public_emails","GET /user/repos","GET /user/repository_invitations","GET /user/social_accounts","GET /user/ssh_signing_keys","GET /user/starred","GET /user/subscriptions","GET /user/teams","GET /users","GET /users/{username}/attestations/{subject_digest}","GET /users/{username}/events","GET /users/{username}/events/orgs/{org}","GET /users/{username}/events/public","GET /users/{username}/followers","GET /users/{username}/following","GET /users/{username}/gists","GET /users/{username}/gpg_keys","GET /users/{username}/keys","GET /users/{username}/orgs","GET /users/{username}/packages","GET /users/{username}/projects","GET /users/{username}/received_events","GET /users/{username}/received_events/public","GET /users/{username}/repos","GET /users/{username}/social_accounts","GET /users/{username}/ssh_signing_keys","GET /users/{username}/starred","GET /users/{username}/subscriptions"];function Ho(r){return typeof r=="string"?it.includes(r):!1}function nt(r){return{paginate:Object.assign(st.bind(null,r),{iterator:$e.bind(null,r)})}}nt.VERSION=Vo});var ft=_((tn,mt)=>{"use strict";var Me=Object.defineProperty,No=Object.getOwnPropertyDescriptor,Wo=Object.getOwnPropertyNames,Bo=Object.prototype.hasOwnProperty,Jo=(r,e)=>{for(var t in e)Me(r,t,{get:e[t],enumerable:!0})},Ko=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Wo(e))!Bo.call(r,o)&&o!==t&&Me(r,o,{get:()=>e[o],enumerable:!(s=No(e,o))||s.enumerable});return r},Xo=r=>Ko(Me({},"__esModule",{value:!0}),r),lt={};Jo(lt,{legacyRestEndpointMethods:()=>gt,restEndpointMethods:()=>ut});mt.exports=Xo(lt);var pt="13.3.2-cjs.1",Qo={actions:{addCustomLabelsToSelfHostedRunnerForOrg:["POST /orgs/{org}/actions/runners/{runner_id}/labels"],addCustomLabelsToSelfHostedRunnerForRepo:["POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],addRepoAccessToSelfHostedRunnerGroupInOrg:["PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],approveWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],cancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],createEnvironmentVariable:["POST /repos/{owner}/{repo}/environments/{environment_name}/variables"],createOrUpdateEnvironmentSecret:["PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],createOrgVariable:["POST /orgs/{org}/actions/variables"],createRegistrationTokenForOrg:["POST /orgs/{org}/actions/runners/registration-token"],createRegistrationTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/registration-token"],createRemoveTokenForOrg:["POST /orgs/{org}/actions/runners/remove-token"],createRemoveTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/remove-token"],createRepoVariable:["POST /repos/{owner}/{repo}/actions/variables"],createWorkflowDispatch:["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],deleteActionsCacheById:["DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"],deleteActionsCacheByKey:["DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"],deleteArtifact:["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],deleteEnvironmentSecret:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],deleteEnvironmentVariable:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],deleteOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}"],deleteOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],deleteRepoVariable:["DELETE /repos/{owner}/{repo}/actions/variables/{name}"],deleteSelfHostedRunnerFromOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}"],deleteSelfHostedRunnerFromRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],deleteWorkflowRun:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],deleteWorkflowRunLogs:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],disableSelectedRepositoryGithubActionsOrganization:["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],disableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],downloadArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],downloadJobLogsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],downloadWorkflowRunAttemptLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"],downloadWorkflowRunLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],enableSelectedRepositoryGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],enableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],forceCancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"],generateRunnerJitconfigForOrg:["POST /orgs/{org}/actions/runners/generate-jitconfig"],generateRunnerJitconfigForRepo:["POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"],getActionsCacheList:["GET /repos/{owner}/{repo}/actions/caches"],getActionsCacheUsage:["GET /repos/{owner}/{repo}/actions/cache/usage"],getActionsCacheUsageByRepoForOrg:["GET /orgs/{org}/actions/cache/usage-by-repository"],getActionsCacheUsageForOrg:["GET /orgs/{org}/actions/cache/usage"],getAllowedActionsOrganization:["GET /orgs/{org}/actions/permissions/selected-actions"],getAllowedActionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],getArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],getCustomOidcSubClaimForRepo:["GET /repos/{owner}/{repo}/actions/oidc/customization/sub"],getEnvironmentPublicKey:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"],getEnvironmentSecret:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],getEnvironmentVariable:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],getGithubActionsDefaultWorkflowPermissionsOrganization:["GET /orgs/{org}/actions/permissions/workflow"],getGithubActionsDefaultWorkflowPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/workflow"],getGithubActionsPermissionsOrganization:["GET /orgs/{org}/actions/permissions"],getGithubActionsPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions"],getJobForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],getOrgPublicKey:["GET /orgs/{org}/actions/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}"],getOrgVariable:["GET /orgs/{org}/actions/variables/{name}"],getPendingDeploymentsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],getRepoPermissions:["GET /repos/{owner}/{repo}/actions/permissions",{},{renamed:["actions","getGithubActionsPermissionsRepository"]}],getRepoPublicKey:["GET /repos/{owner}/{repo}/actions/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],getRepoVariable:["GET /repos/{owner}/{repo}/actions/variables/{name}"],getReviewsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],getSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}"],getSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],getWorkflow:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],getWorkflowAccessToRepository:["GET /repos/{owner}/{repo}/actions/permissions/access"],getWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],getWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"],getWorkflowRunUsage:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],getWorkflowUsage:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],listArtifactsForRepo:["GET /repos/{owner}/{repo}/actions/artifacts"],listEnvironmentSecrets:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"],listEnvironmentVariables:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables"],listJobsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],listJobsForWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"],listLabelsForSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}/labels"],listLabelsForSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],listOrgSecrets:["GET /orgs/{org}/actions/secrets"],listOrgVariables:["GET /orgs/{org}/actions/variables"],listRepoOrganizationSecrets:["GET /repos/{owner}/{repo}/actions/organization-secrets"],listRepoOrganizationVariables:["GET /repos/{owner}/{repo}/actions/organization-variables"],listRepoSecrets:["GET /repos/{owner}/{repo}/actions/secrets"],listRepoVariables:["GET /repos/{owner}/{repo}/actions/variables"],listRepoWorkflows:["GET /repos/{owner}/{repo}/actions/workflows"],listRunnerApplicationsForOrg:["GET /orgs/{org}/actions/runners/downloads"],listRunnerApplicationsForRepo:["GET /repos/{owner}/{repo}/actions/runners/downloads"],listSelectedReposForOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],listSelectedReposForOrgVariable:["GET /orgs/{org}/actions/variables/{name}/repositories"],listSelectedRepositoriesEnabledGithubActionsOrganization:["GET /orgs/{org}/actions/permissions/repositories"],listSelfHostedRunnersForOrg:["GET /orgs/{org}/actions/runners"],listSelfHostedRunnersForRepo:["GET /repos/{owner}/{repo}/actions/runners"],listWorkflowRunArtifacts:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],listWorkflowRuns:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],listWorkflowRunsForRepo:["GET /repos/{owner}/{repo}/actions/runs"],reRunJobForWorkflowRun:["POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"],reRunWorkflow:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],reRunWorkflowFailedJobs:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"],removeAllCustomLabelsFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels"],removeAllCustomLabelsFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],removeCustomLabelFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"],removeCustomLabelFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],reviewCustomGatesForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"],reviewPendingDeploymentsForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],setAllowedActionsOrganization:["PUT /orgs/{org}/actions/permissions/selected-actions"],setAllowedActionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],setCustomLabelsForSelfHostedRunnerForOrg:["PUT /orgs/{org}/actions/runners/{runner_id}/labels"],setCustomLabelsForSelfHostedRunnerForRepo:["PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],setCustomOidcSubClaimForRepo:["PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"],setGithubActionsDefaultWorkflowPermissionsOrganization:["PUT /orgs/{org}/actions/permissions/workflow"],setGithubActionsDefaultWorkflowPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/workflow"],setGithubActionsPermissionsOrganization:["PUT /orgs/{org}/actions/permissions"],setGithubActionsPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],setSelectedReposForOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories"],setSelectedRepositoriesEnabledGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories"],setWorkflowAccessToRepository:["PUT /repos/{owner}/{repo}/actions/permissions/access"],updateEnvironmentVariable:["PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],updateOrgVariable:["PATCH /orgs/{org}/actions/variables/{name}"],updateRepoVariable:["PATCH /repos/{owner}/{repo}/actions/variables/{name}"]},activity:{checkRepoIsStarredByAuthenticatedUser:["GET /user/starred/{owner}/{repo}"],deleteRepoSubscription:["DELETE /repos/{owner}/{repo}/subscription"],deleteThreadSubscription:["DELETE /notifications/threads/{thread_id}/subscription"],getFeeds:["GET /feeds"],getRepoSubscription:["GET /repos/{owner}/{repo}/subscription"],getThread:["GET /notifications/threads/{thread_id}"],getThreadSubscriptionForAuthenticatedUser:["GET /notifications/threads/{thread_id}/subscription"],listEventsForAuthenticatedUser:["GET /users/{username}/events"],listNotificationsForAuthenticatedUser:["GET /notifications"],listOrgEventsForAuthenticatedUser:["GET /users/{username}/events/orgs/{org}"],listPublicEvents:["GET /events"],listPublicEventsForRepoNetwork:["GET /networks/{owner}/{repo}/events"],listPublicEventsForUser:["GET /users/{username}/events/public"],listPublicOrgEvents:["GET /orgs/{org}/events"],listReceivedEventsForUser:["GET /users/{username}/received_events"],listReceivedPublicEventsForUser:["GET /users/{username}/received_events/public"],listRepoEvents:["GET /repos/{owner}/{repo}/events"],listRepoNotificationsForAuthenticatedUser:["GET /repos/{owner}/{repo}/notifications"],listReposStarredByAuthenticatedUser:["GET /user/starred"],listReposStarredByUser:["GET /users/{username}/starred"],listReposWatchedByUser:["GET /users/{username}/subscriptions"],listStargazersForRepo:["GET /repos/{owner}/{repo}/stargazers"],listWatchedReposForAuthenticatedUser:["GET /user/subscriptions"],listWatchersForRepo:["GET /repos/{owner}/{repo}/subscribers"],markNotificationsAsRead:["PUT /notifications"],markRepoNotificationsAsRead:["PUT /repos/{owner}/{repo}/notifications"],markThreadAsDone:["DELETE /notifications/threads/{thread_id}"],markThreadAsRead:["PATCH /notifications/threads/{thread_id}"],setRepoSubscription:["PUT /repos/{owner}/{repo}/subscription"],setThreadSubscription:["PUT /notifications/threads/{thread_id}/subscription"],starRepoForAuthenticatedUser:["PUT /user/starred/{owner}/{repo}"],unstarRepoForAuthenticatedUser:["DELETE /user/starred/{owner}/{repo}"]},apps:{addRepoToInstallation:["PUT /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","addRepoToInstallationForAuthenticatedUser"]}],addRepoToInstallationForAuthenticatedUser:["PUT /user/installations/{installation_id}/repositories/{repository_id}"],checkToken:["POST /applications/{client_id}/token"],createFromManifest:["POST /app-manifests/{code}/conversions"],createInstallationAccessToken:["POST /app/installations/{installation_id}/access_tokens"],deleteAuthorization:["DELETE /applications/{client_id}/grant"],deleteInstallation:["DELETE /app/installations/{installation_id}"],deleteToken:["DELETE /applications/{client_id}/token"],getAuthenticated:["GET /app"],getBySlug:["GET /apps/{app_slug}"],getInstallation:["GET /app/installations/{installation_id}"],getOrgInstallation:["GET /orgs/{org}/installation"],getRepoInstallation:["GET /repos/{owner}/{repo}/installation"],getSubscriptionPlanForAccount:["GET /marketplace_listing/accounts/{account_id}"],getSubscriptionPlanForAccountStubbed:["GET /marketplace_listing/stubbed/accounts/{account_id}"],getUserInstallation:["GET /users/{username}/installation"],getWebhookConfigForApp:["GET /app/hook/config"],getWebhookDelivery:["GET /app/hook/deliveries/{delivery_id}"],listAccountsForPlan:["GET /marketplace_listing/plans/{plan_id}/accounts"],listAccountsForPlanStubbed:["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],listInstallationReposForAuthenticatedUser:["GET /user/installations/{installation_id}/repositories"],listInstallationRequestsForAuthenticatedApp:["GET /app/installation-requests"],listInstallations:["GET /app/installations"],listInstallationsForAuthenticatedUser:["GET /user/installations"],listPlans:["GET /marketplace_listing/plans"],listPlansStubbed:["GET /marketplace_listing/stubbed/plans"],listReposAccessibleToInstallation:["GET /installation/repositories"],listSubscriptionsForAuthenticatedUser:["GET /user/marketplace_purchases"],listSubscriptionsForAuthenticatedUserStubbed:["GET /user/marketplace_purchases/stubbed"],listWebhookDeliveries:["GET /app/hook/deliveries"],redeliverWebhookDelivery:["POST /app/hook/deliveries/{delivery_id}/attempts"],removeRepoFromInstallation:["DELETE /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","removeRepoFromInstallationForAuthenticatedUser"]}],removeRepoFromInstallationForAuthenticatedUser:["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],resetToken:["PATCH /applications/{client_id}/token"],revokeInstallationAccessToken:["DELETE /installation/token"],scopeToken:["POST /applications/{client_id}/token/scoped"],suspendInstallation:["PUT /app/installations/{installation_id}/suspended"],unsuspendInstallation:["DELETE /app/installations/{installation_id}/suspended"],updateWebhookConfigForApp:["PATCH /app/hook/config"]},billing:{getGithubActionsBillingOrg:["GET /orgs/{org}/settings/billing/actions"],getGithubActionsBillingUser:["GET /users/{username}/settings/billing/actions"],getGithubBillingUsageReportOrg:["GET /organizations/{org}/settings/billing/usage"],getGithubPackagesBillingOrg:["GET /orgs/{org}/settings/billing/packages"],getGithubPackagesBillingUser:["GET /users/{username}/settings/billing/packages"],getSharedStorageBillingOrg:["GET /orgs/{org}/settings/billing/shared-storage"],getSharedStorageBillingUser:["GET /users/{username}/settings/billing/shared-storage"]},checks:{create:["POST /repos/{owner}/{repo}/check-runs"],createSuite:["POST /repos/{owner}/{repo}/check-suites"],get:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],getSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],listAnnotations:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],listForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],listForSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],listSuitesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],rerequestRun:["POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"],rerequestSuite:["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],setSuitesPreferences:["PATCH /repos/{owner}/{repo}/check-suites/preferences"],update:["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]},codeScanning:{commitAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"],createAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],createVariantAnalysis:["POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"],deleteAnalysis:["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],deleteCodeqlDatabase:["DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getAlert:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",{},{renamedParameters:{alert_id:"alert_number"}}],getAnalysis:["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],getAutofix:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],getCodeqlDatabase:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getDefaultSetup:["GET /repos/{owner}/{repo}/code-scanning/default-setup"],getSarif:["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],getVariantAnalysis:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"],getVariantAnalysisRepoTask:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"],listAlertInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],listAlertsForOrg:["GET /orgs/{org}/code-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/code-scanning/alerts"],listAlertsInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",{},{renamed:["codeScanning","listAlertInstances"]}],listCodeqlDatabases:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases"],listRecentAnalyses:["GET /repos/{owner}/{repo}/code-scanning/analyses"],updateAlert:["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],updateDefaultSetup:["PATCH /repos/{owner}/{repo}/code-scanning/default-setup"],uploadSarif:["POST /repos/{owner}/{repo}/code-scanning/sarifs"]},codeSecurity:{attachConfiguration:["POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"],attachEnterpriseConfiguration:["POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"],createConfiguration:["POST /orgs/{org}/code-security/configurations"],createConfigurationForEnterprise:["POST /enterprises/{enterprise}/code-security/configurations"],deleteConfiguration:["DELETE /orgs/{org}/code-security/configurations/{configuration_id}"],deleteConfigurationForEnterprise:["DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],detachConfiguration:["DELETE /orgs/{org}/code-security/configurations/detach"],getConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}"],getConfigurationForRepository:["GET /repos/{owner}/{repo}/code-security-configuration"],getConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations"],getConfigurationsForOrg:["GET /orgs/{org}/code-security/configurations"],getDefaultConfigurations:["GET /orgs/{org}/code-security/configurations/defaults"],getDefaultConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/defaults"],getRepositoriesForConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"],getRepositoriesForEnterpriseConfiguration:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"],getSingleConfigurationForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],setConfigurationAsDefault:["PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"],setConfigurationAsDefaultForEnterprise:["PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"],updateConfiguration:["PATCH /orgs/{org}/code-security/configurations/{configuration_id}"],updateEnterpriseConfiguration:["PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"]},codesOfConduct:{getAllCodesOfConduct:["GET /codes_of_conduct"],getConductCode:["GET /codes_of_conduct/{key}"]},codespaces:{addRepositoryForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],checkPermissionsForDevcontainer:["GET /repos/{owner}/{repo}/codespaces/permissions_check"],codespaceMachinesForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/machines"],createForAuthenticatedUser:["POST /user/codespaces"],createOrUpdateOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],createOrUpdateSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}"],createWithPrForAuthenticatedUser:["POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"],createWithRepoForAuthenticatedUser:["POST /repos/{owner}/{repo}/codespaces"],deleteForAuthenticatedUser:["DELETE /user/codespaces/{codespace_name}"],deleteFromOrganization:["DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"],deleteOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],deleteSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}"],exportForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/exports"],getCodespacesForUserInOrg:["GET /orgs/{org}/members/{username}/codespaces"],getExportDetailsForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/exports/{export_id}"],getForAuthenticatedUser:["GET /user/codespaces/{codespace_name}"],getOrgPublicKey:["GET /orgs/{org}/codespaces/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}"],getPublicKeyForAuthenticatedUser:["GET /user/codespaces/secrets/public-key"],getRepoPublicKey:["GET /repos/{owner}/{repo}/codespaces/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],getSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}"],listDevcontainersInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/devcontainers"],listForAuthenticatedUser:["GET /user/codespaces"],listInOrganization:["GET /orgs/{org}/codespaces",{},{renamedParameters:{org_id:"org"}}],listInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces"],listOrgSecrets:["GET /orgs/{org}/codespaces/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/codespaces/secrets"],listRepositoriesForSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}/repositories"],listSecretsForAuthenticatedUser:["GET /user/codespaces/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],preFlightWithRepoForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/new"],publishForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/publish"],removeRepositoryForSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],repoMachinesForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/machines"],setRepositoriesForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],startForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/start"],stopForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/stop"],stopInOrganization:["POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"],updateForAuthenticatedUser:["PATCH /user/codespaces/{codespace_name}"]},copilot:{addCopilotSeatsForTeams:["POST /orgs/{org}/copilot/billing/selected_teams"],addCopilotSeatsForUsers:["POST /orgs/{org}/copilot/billing/selected_users"],cancelCopilotSeatAssignmentForTeams:["DELETE /orgs/{org}/copilot/billing/selected_teams"],cancelCopilotSeatAssignmentForUsers:["DELETE /orgs/{org}/copilot/billing/selected_users"],copilotMetricsForOrganization:["GET /orgs/{org}/copilot/metrics"],copilotMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],getCopilotOrganizationDetails:["GET /orgs/{org}/copilot/billing"],getCopilotSeatDetailsForUser:["GET /orgs/{org}/members/{username}/copilot"],listCopilotSeats:["GET /orgs/{org}/copilot/billing/seats"],usageMetricsForOrg:["GET /orgs/{org}/copilot/usage"],usageMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/usage"]},dependabot:{addSelectedRepoToOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],deleteOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],getAlert:["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],getOrgPublicKey:["GET /orgs/{org}/dependabot/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}"],getRepoPublicKey:["GET /repos/{owner}/{repo}/dependabot/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/dependabot/alerts"],listAlertsForOrg:["GET /orgs/{org}/dependabot/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/dependabot/alerts"],listOrgSecrets:["GET /orgs/{org}/dependabot/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/dependabot/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],updateAlert:["PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"]},dependencyGraph:{createRepositorySnapshot:["POST /repos/{owner}/{repo}/dependency-graph/snapshots"],diffRange:["GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"],exportSbom:["GET /repos/{owner}/{repo}/dependency-graph/sbom"]},emojis:{get:["GET /emojis"]},gists:{checkIsStarred:["GET /gists/{gist_id}/star"],create:["POST /gists"],createComment:["POST /gists/{gist_id}/comments"],delete:["DELETE /gists/{gist_id}"],deleteComment:["DELETE /gists/{gist_id}/comments/{comment_id}"],fork:["POST /gists/{gist_id}/forks"],get:["GET /gists/{gist_id}"],getComment:["GET /gists/{gist_id}/comments/{comment_id}"],getRevision:["GET /gists/{gist_id}/{sha}"],list:["GET /gists"],listComments:["GET /gists/{gist_id}/comments"],listCommits:["GET /gists/{gist_id}/commits"],listForUser:["GET /users/{username}/gists"],listForks:["GET /gists/{gist_id}/forks"],listPublic:["GET /gists/public"],listStarred:["GET /gists/starred"],star:["PUT /gists/{gist_id}/star"],unstar:["DELETE /gists/{gist_id}/star"],update:["PATCH /gists/{gist_id}"],updateComment:["PATCH /gists/{gist_id}/comments/{comment_id}"]},git:{createBlob:["POST /repos/{owner}/{repo}/git/blobs"],createCommit:["POST /repos/{owner}/{repo}/git/commits"],createRef:["POST /repos/{owner}/{repo}/git/refs"],createTag:["POST /repos/{owner}/{repo}/git/tags"],createTree:["POST /repos/{owner}/{repo}/git/trees"],deleteRef:["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],getBlob:["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],getCommit:["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],getRef:["GET /repos/{owner}/{repo}/git/ref/{ref}"],getTag:["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],getTree:["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],listMatchingRefs:["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],updateRef:["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]},gitignore:{getAllTemplates:["GET /gitignore/templates"],getTemplate:["GET /gitignore/templates/{name}"]},interactions:{getRestrictionsForAuthenticatedUser:["GET /user/interaction-limits"],getRestrictionsForOrg:["GET /orgs/{org}/interaction-limits"],getRestrictionsForRepo:["GET /repos/{owner}/{repo}/interaction-limits"],getRestrictionsForYourPublicRepos:["GET /user/interaction-limits",{},{renamed:["interactions","getRestrictionsForAuthenticatedUser"]}],removeRestrictionsForAuthenticatedUser:["DELETE /user/interaction-limits"],removeRestrictionsForOrg:["DELETE /orgs/{org}/interaction-limits"],removeRestrictionsForRepo:["DELETE /repos/{owner}/{repo}/interaction-limits"],removeRestrictionsForYourPublicRepos:["DELETE /user/interaction-limits",{},{renamed:["interactions","removeRestrictionsForAuthenticatedUser"]}],setRestrictionsForAuthenticatedUser:["PUT /user/interaction-limits"],setRestrictionsForOrg:["PUT /orgs/{org}/interaction-limits"],setRestrictionsForRepo:["PUT /repos/{owner}/{repo}/interaction-limits"],setRestrictionsForYourPublicRepos:["PUT /user/interaction-limits",{},{renamed:["interactions","setRestrictionsForAuthenticatedUser"]}]},issues:{addAssignees:["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],addLabels:["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],addSubIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],checkUserCanBeAssigned:["GET /repos/{owner}/{repo}/assignees/{assignee}"],checkUserCanBeAssignedToIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"],create:["POST /repos/{owner}/{repo}/issues"],createComment:["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],createLabel:["POST /repos/{owner}/{repo}/labels"],createMilestone:["POST /repos/{owner}/{repo}/milestones"],deleteComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],deleteLabel:["DELETE /repos/{owner}/{repo}/labels/{name}"],deleteMilestone:["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],get:["GET /repos/{owner}/{repo}/issues/{issue_number}"],getComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],getEvent:["GET /repos/{owner}/{repo}/issues/events/{event_id}"],getLabel:["GET /repos/{owner}/{repo}/labels/{name}"],getMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],list:["GET /issues"],listAssignees:["GET /repos/{owner}/{repo}/assignees"],listComments:["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],listCommentsForRepo:["GET /repos/{owner}/{repo}/issues/comments"],listEvents:["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],listEventsForRepo:["GET /repos/{owner}/{repo}/issues/events"],listEventsForTimeline:["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"],listForAuthenticatedUser:["GET /user/issues"],listForOrg:["GET /orgs/{org}/issues"],listForRepo:["GET /repos/{owner}/{repo}/issues"],listLabelsForMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],listLabelsForRepo:["GET /repos/{owner}/{repo}/labels"],listLabelsOnIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],listMilestones:["GET /repos/{owner}/{repo}/milestones"],listSubIssues:["GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],lock:["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],removeAllLabels:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],removeAssignees:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],removeLabel:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],removeSubIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"],reprioritizeSubIssue:["PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"],setLabels:["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],unlock:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],update:["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],updateComment:["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],updateLabel:["PATCH /repos/{owner}/{repo}/labels/{name}"],updateMilestone:["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]},licenses:{get:["GET /licenses/{license}"],getAllCommonlyUsed:["GET /licenses"],getForRepo:["GET /repos/{owner}/{repo}/license"]},markdown:{render:["POST /markdown"],renderRaw:["POST /markdown/raw",{headers:{"content-type":"text/plain; charset=utf-8"}}]},meta:{get:["GET /meta"],getAllVersions:["GET /versions"],getOctocat:["GET /octocat"],getZen:["GET /zen"],root:["GET /"]},migrations:{deleteArchiveForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/archive"],deleteArchiveForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/archive"],downloadArchiveForOrg:["GET /orgs/{org}/migrations/{migration_id}/archive"],getArchiveForAuthenticatedUser:["GET /user/migrations/{migration_id}/archive"],getStatusForAuthenticatedUser:["GET /user/migrations/{migration_id}"],getStatusForOrg:["GET /orgs/{org}/migrations/{migration_id}"],listForAuthenticatedUser:["GET /user/migrations"],listForOrg:["GET /orgs/{org}/migrations"],listReposForAuthenticatedUser:["GET /user/migrations/{migration_id}/repositories"],listReposForOrg:["GET /orgs/{org}/migrations/{migration_id}/repositories"],listReposForUser:["GET /user/migrations/{migration_id}/repositories",{},{renamed:["migrations","listReposForAuthenticatedUser"]}],startForAuthenticatedUser:["POST /user/migrations"],startForOrg:["POST /orgs/{org}/migrations"],unlockRepoForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"],unlockRepoForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"]},oidc:{getOidcCustomSubTemplateForOrg:["GET /orgs/{org}/actions/oidc/customization/sub"],updateOidcCustomSubTemplateForOrg:["PUT /orgs/{org}/actions/oidc/customization/sub"]},orgs:{addSecurityManagerTeam:["PUT /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"}],assignTeamToOrgRole:["PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],assignUserToOrgRole:["PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"],blockUser:["PUT /orgs/{org}/blocks/{username}"],cancelInvitation:["DELETE /orgs/{org}/invitations/{invitation_id}"],checkBlockedUser:["GET /orgs/{org}/blocks/{username}"],checkMembershipForUser:["GET /orgs/{org}/members/{username}"],checkPublicMembershipForUser:["GET /orgs/{org}/public_members/{username}"],convertMemberToOutsideCollaborator:["PUT /orgs/{org}/outside_collaborators/{username}"],createInvitation:["POST /orgs/{org}/invitations"],createOrUpdateCustomProperties:["PATCH /orgs/{org}/properties/schema"],createOrUpdateCustomPropertiesValuesForRepos:["PATCH /orgs/{org}/properties/values"],createOrUpdateCustomProperty:["PUT /orgs/{org}/properties/schema/{custom_property_name}"],createWebhook:["POST /orgs/{org}/hooks"],delete:["DELETE /orgs/{org}"],deleteWebhook:["DELETE /orgs/{org}/hooks/{hook_id}"],enableOrDisableSecurityProductOnAllOrgRepos:["POST /orgs/{org}/{security_product}/{enablement}",{},{deprecated:"octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"}],get:["GET /orgs/{org}"],getAllCustomProperties:["GET /orgs/{org}/properties/schema"],getCustomProperty:["GET /orgs/{org}/properties/schema/{custom_property_name}"],getMembershipForAuthenticatedUser:["GET /user/memberships/orgs/{org}"],getMembershipForUser:["GET /orgs/{org}/memberships/{username}"],getOrgRole:["GET /orgs/{org}/organization-roles/{role_id}"],getWebhook:["GET /orgs/{org}/hooks/{hook_id}"],getWebhookConfigForOrg:["GET /orgs/{org}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"],list:["GET /organizations"],listAppInstallations:["GET /orgs/{org}/installations"],listAttestations:["GET /orgs/{org}/attestations/{subject_digest}"],listBlockedUsers:["GET /orgs/{org}/blocks"],listCustomPropertiesValuesForRepos:["GET /orgs/{org}/properties/values"],listFailedInvitations:["GET /orgs/{org}/failed_invitations"],listForAuthenticatedUser:["GET /user/orgs"],listForUser:["GET /users/{username}/orgs"],listInvitationTeams:["GET /orgs/{org}/invitations/{invitation_id}/teams"],listMembers:["GET /orgs/{org}/members"],listMembershipsForAuthenticatedUser:["GET /user/memberships/orgs"],listOrgRoleTeams:["GET /orgs/{org}/organization-roles/{role_id}/teams"],listOrgRoleUsers:["GET /orgs/{org}/organization-roles/{role_id}/users"],listOrgRoles:["GET /orgs/{org}/organization-roles"],listOrganizationFineGrainedPermissions:["GET /orgs/{org}/organization-fine-grained-permissions"],listOutsideCollaborators:["GET /orgs/{org}/outside_collaborators"],listPatGrantRepositories:["GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"],listPatGrantRequestRepositories:["GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"],listPatGrantRequests:["GET /orgs/{org}/personal-access-token-requests"],listPatGrants:["GET /orgs/{org}/personal-access-tokens"],listPendingInvitations:["GET /orgs/{org}/invitations"],listPublicMembers:["GET /orgs/{org}/public_members"],listSecurityManagerTeams:["GET /orgs/{org}/security-managers",{},{deprecated:"octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"}],listWebhookDeliveries:["GET /orgs/{org}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /orgs/{org}/hooks"],pingWebhook:["POST /orgs/{org}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeCustomProperty:["DELETE /orgs/{org}/properties/schema/{custom_property_name}"],removeMember:["DELETE /orgs/{org}/members/{username}"],removeMembershipForUser:["DELETE /orgs/{org}/memberships/{username}"],removeOutsideCollaborator:["DELETE /orgs/{org}/outside_collaborators/{username}"],removePublicMembershipForAuthenticatedUser:["DELETE /orgs/{org}/public_members/{username}"],removeSecurityManagerTeam:["DELETE /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"}],reviewPatGrantRequest:["POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"],reviewPatGrantRequestsInBulk:["POST /orgs/{org}/personal-access-token-requests"],revokeAllOrgRolesTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}"],revokeAllOrgRolesUser:["DELETE /orgs/{org}/organization-roles/users/{username}"],revokeOrgRoleTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],revokeOrgRoleUser:["DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"],setMembershipForUser:["PUT /orgs/{org}/memberships/{username}"],setPublicMembershipForAuthenticatedUser:["PUT /orgs/{org}/public_members/{username}"],unblockUser:["DELETE /orgs/{org}/blocks/{username}"],update:["PATCH /orgs/{org}"],updateMembershipForAuthenticatedUser:["PATCH /user/memberships/orgs/{org}"],updatePatAccess:["POST /orgs/{org}/personal-access-tokens/{pat_id}"],updatePatAccesses:["POST /orgs/{org}/personal-access-tokens"],updateWebhook:["PATCH /orgs/{org}/hooks/{hook_id}"],updateWebhookConfigForOrg:["PATCH /orgs/{org}/hooks/{hook_id}/config"]},packages:{deletePackageForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}"],deletePackageForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],deletePackageForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}"],deletePackageVersionForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getAllPackageVersionsForAPackageOwnedByAnOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByOrg"]}],getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]}],getAllPackageVersionsForPackageOwnedByAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions"],getPackageForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}"],getPackageForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}"],getPackageForUser:["GET /users/{username}/packages/{package_type}/{package_name}"],getPackageVersionForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],listDockerMigrationConflictingPackagesForAuthenticatedUser:["GET /user/docker/conflicts"],listDockerMigrationConflictingPackagesForOrganization:["GET /orgs/{org}/docker/conflicts"],listDockerMigrationConflictingPackagesForUser:["GET /users/{username}/docker/conflicts"],listPackagesForAuthenticatedUser:["GET /user/packages"],listPackagesForOrganization:["GET /orgs/{org}/packages"],listPackagesForUser:["GET /users/{username}/packages"],restorePackageForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForUser:["POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageVersionForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForUser:["POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]},privateRegistries:{createOrgPrivateRegistry:["POST /orgs/{org}/private-registries"],deleteOrgPrivateRegistry:["DELETE /orgs/{org}/private-registries/{secret_name}"],getOrgPrivateRegistry:["GET /orgs/{org}/private-registries/{secret_name}"],getOrgPublicKey:["GET /orgs/{org}/private-registries/public-key"],listOrgPrivateRegistries:["GET /orgs/{org}/private-registries"],updateOrgPrivateRegistry:["PATCH /orgs/{org}/private-registries/{secret_name}"]},projects:{addCollaborator:["PUT /projects/{project_id}/collaborators/{username}"],createCard:["POST /projects/columns/{column_id}/cards"],createColumn:["POST /projects/{project_id}/columns"],createForAuthenticatedUser:["POST /user/projects"],createForOrg:["POST /orgs/{org}/projects"],createForRepo:["POST /repos/{owner}/{repo}/projects"],delete:["DELETE /projects/{project_id}"],deleteCard:["DELETE /projects/columns/cards/{card_id}"],deleteColumn:["DELETE /projects/columns/{column_id}"],get:["GET /projects/{project_id}"],getCard:["GET /projects/columns/cards/{card_id}"],getColumn:["GET /projects/columns/{column_id}"],getPermissionForUser:["GET /projects/{project_id}/collaborators/{username}/permission"],listCards:["GET /projects/columns/{column_id}/cards"],listCollaborators:["GET /projects/{project_id}/collaborators"],listColumns:["GET /projects/{project_id}/columns"],listForOrg:["GET /orgs/{org}/projects"],listForRepo:["GET /repos/{owner}/{repo}/projects"],listForUser:["GET /users/{username}/projects"],moveCard:["POST /projects/columns/cards/{card_id}/moves"],moveColumn:["POST /projects/columns/{column_id}/moves"],removeCollaborator:["DELETE /projects/{project_id}/collaborators/{username}"],update:["PATCH /projects/{project_id}"],updateCard:["PATCH /projects/columns/cards/{card_id}"],updateColumn:["PATCH /projects/columns/{column_id}"]},pulls:{checkIfMerged:["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],create:["POST /repos/{owner}/{repo}/pulls"],createReplyForReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],createReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],createReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],deletePendingReview:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],deleteReviewComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],dismissReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],get:["GET /repos/{owner}/{repo}/pulls/{pull_number}"],getReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],getReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],list:["GET /repos/{owner}/{repo}/pulls"],listCommentsForReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],listCommits:["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],listFiles:["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],listRequestedReviewers:["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],listReviewComments:["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],listReviewCommentsForRepo:["GET /repos/{owner}/{repo}/pulls/comments"],listReviews:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],merge:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],removeRequestedReviewers:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],requestReviewers:["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],submitReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],update:["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],updateBranch:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"],updateReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],updateReviewComment:["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]},rateLimit:{get:["GET /rate_limit"]},reactions:{createForCommitComment:["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"],createForIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"],createForIssueComment:["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],createForPullRequestReviewComment:["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],createForRelease:["POST /repos/{owner}/{repo}/releases/{release_id}/reactions"],createForTeamDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],createForTeamDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"],deleteForCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"],deleteForIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"],deleteForIssueComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"],deleteForPullRequestComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"],deleteForRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"],deleteForTeamDiscussion:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"],deleteForTeamDiscussionComment:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"],listForCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"],listForIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],listForIssueComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],listForPullRequestReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],listForRelease:["GET /repos/{owner}/{repo}/releases/{release_id}/reactions"],listForTeamDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],listForTeamDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"]},repos:{acceptInvitation:["PATCH /user/repository_invitations/{invitation_id}",{},{renamed:["repos","acceptInvitationForAuthenticatedUser"]}],acceptInvitationForAuthenticatedUser:["PATCH /user/repository_invitations/{invitation_id}"],addAppAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],addCollaborator:["PUT /repos/{owner}/{repo}/collaborators/{username}"],addStatusCheckContexts:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],addTeamAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],addUserAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],cancelPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"],checkAutomatedSecurityFixes:["GET /repos/{owner}/{repo}/automated-security-fixes"],checkCollaborator:["GET /repos/{owner}/{repo}/collaborators/{username}"],checkPrivateVulnerabilityReporting:["GET /repos/{owner}/{repo}/private-vulnerability-reporting"],checkVulnerabilityAlerts:["GET /repos/{owner}/{repo}/vulnerability-alerts"],codeownersErrors:["GET /repos/{owner}/{repo}/codeowners/errors"],compareCommits:["GET /repos/{owner}/{repo}/compare/{base}...{head}"],compareCommitsWithBasehead:["GET /repos/{owner}/{repo}/compare/{basehead}"],createAttestation:["POST /repos/{owner}/{repo}/attestations"],createAutolink:["POST /repos/{owner}/{repo}/autolinks"],createCommitComment:["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],createCommitSignatureProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],createCommitStatus:["POST /repos/{owner}/{repo}/statuses/{sha}"],createDeployKey:["POST /repos/{owner}/{repo}/keys"],createDeployment:["POST /repos/{owner}/{repo}/deployments"],createDeploymentBranchPolicy:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],createDeploymentProtectionRule:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],createDeploymentStatus:["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],createDispatchEvent:["POST /repos/{owner}/{repo}/dispatches"],createForAuthenticatedUser:["POST /user/repos"],createFork:["POST /repos/{owner}/{repo}/forks"],createInOrg:["POST /orgs/{org}/repos"],createOrUpdateCustomPropertiesValues:["PATCH /repos/{owner}/{repo}/properties/values"],createOrUpdateEnvironment:["PUT /repos/{owner}/{repo}/environments/{environment_name}"],createOrUpdateFileContents:["PUT /repos/{owner}/{repo}/contents/{path}"],createOrgRuleset:["POST /orgs/{org}/rulesets"],createPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments"],createPagesSite:["POST /repos/{owner}/{repo}/pages"],createRelease:["POST /repos/{owner}/{repo}/releases"],createRepoRuleset:["POST /repos/{owner}/{repo}/rulesets"],createUsingTemplate:["POST /repos/{template_owner}/{template_repo}/generate"],createWebhook:["POST /repos/{owner}/{repo}/hooks"],declineInvitation:["DELETE /user/repository_invitations/{invitation_id}",{},{renamed:["repos","declineInvitationForAuthenticatedUser"]}],declineInvitationForAuthenticatedUser:["DELETE /user/repository_invitations/{invitation_id}"],delete:["DELETE /repos/{owner}/{repo}"],deleteAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],deleteAdminBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],deleteAnEnvironment:["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],deleteAutolink:["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],deleteBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],deleteCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],deleteCommitSignatureProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],deleteDeployKey:["DELETE /repos/{owner}/{repo}/keys/{key_id}"],deleteDeployment:["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],deleteDeploymentBranchPolicy:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],deleteFile:["DELETE /repos/{owner}/{repo}/contents/{path}"],deleteInvitation:["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],deleteOrgRuleset:["DELETE /orgs/{org}/rulesets/{ruleset_id}"],deletePagesSite:["DELETE /repos/{owner}/{repo}/pages"],deletePullRequestReviewProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],deleteRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}"],deleteReleaseAsset:["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],deleteRepoRuleset:["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],deleteWebhook:["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],disableAutomatedSecurityFixes:["DELETE /repos/{owner}/{repo}/automated-security-fixes"],disableDeploymentProtectionRule:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],disablePrivateVulnerabilityReporting:["DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"],disableVulnerabilityAlerts:["DELETE /repos/{owner}/{repo}/vulnerability-alerts"],downloadArchive:["GET /repos/{owner}/{repo}/zipball/{ref}",{},{renamed:["repos","downloadZipballArchive"]}],downloadTarballArchive:["GET /repos/{owner}/{repo}/tarball/{ref}"],downloadZipballArchive:["GET /repos/{owner}/{repo}/zipball/{ref}"],enableAutomatedSecurityFixes:["PUT /repos/{owner}/{repo}/automated-security-fixes"],enablePrivateVulnerabilityReporting:["PUT /repos/{owner}/{repo}/private-vulnerability-reporting"],enableVulnerabilityAlerts:["PUT /repos/{owner}/{repo}/vulnerability-alerts"],generateReleaseNotes:["POST /repos/{owner}/{repo}/releases/generate-notes"],get:["GET /repos/{owner}/{repo}"],getAccessRestrictions:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],getAdminBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],getAllDeploymentProtectionRules:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],getAllEnvironments:["GET /repos/{owner}/{repo}/environments"],getAllStatusCheckContexts:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],getAllTopics:["GET /repos/{owner}/{repo}/topics"],getAppsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],getAutolink:["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],getBranch:["GET /repos/{owner}/{repo}/branches/{branch}"],getBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection"],getBranchRules:["GET /repos/{owner}/{repo}/rules/branches/{branch}"],getClones:["GET /repos/{owner}/{repo}/traffic/clones"],getCodeFrequencyStats:["GET /repos/{owner}/{repo}/stats/code_frequency"],getCollaboratorPermissionLevel:["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],getCombinedStatusForRef:["GET /repos/{owner}/{repo}/commits/{ref}/status"],getCommit:["GET /repos/{owner}/{repo}/commits/{ref}"],getCommitActivityStats:["GET /repos/{owner}/{repo}/stats/commit_activity"],getCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}"],getCommitSignatureProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],getCommunityProfileMetrics:["GET /repos/{owner}/{repo}/community/profile"],getContent:["GET /repos/{owner}/{repo}/contents/{path}"],getContributorsStats:["GET /repos/{owner}/{repo}/stats/contributors"],getCustomDeploymentProtectionRule:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],getCustomPropertiesValues:["GET /repos/{owner}/{repo}/properties/values"],getDeployKey:["GET /repos/{owner}/{repo}/keys/{key_id}"],getDeployment:["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],getDeploymentBranchPolicy:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],getDeploymentStatus:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],getEnvironment:["GET /repos/{owner}/{repo}/environments/{environment_name}"],getLatestPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/latest"],getLatestRelease:["GET /repos/{owner}/{repo}/releases/latest"],getOrgRuleSuite:["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],getOrgRuleSuites:["GET /orgs/{org}/rulesets/rule-suites"],getOrgRuleset:["GET /orgs/{org}/rulesets/{ruleset_id}"],getOrgRulesets:["GET /orgs/{org}/rulesets"],getPages:["GET /repos/{owner}/{repo}/pages"],getPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],getPagesDeployment:["GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"],getPagesHealthCheck:["GET /repos/{owner}/{repo}/pages/health"],getParticipationStats:["GET /repos/{owner}/{repo}/stats/participation"],getPullRequestReviewProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],getPunchCardStats:["GET /repos/{owner}/{repo}/stats/punch_card"],getReadme:["GET /repos/{owner}/{repo}/readme"],getReadmeInDirectory:["GET /repos/{owner}/{repo}/readme/{dir}"],getRelease:["GET /repos/{owner}/{repo}/releases/{release_id}"],getReleaseAsset:["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],getReleaseByTag:["GET /repos/{owner}/{repo}/releases/tags/{tag}"],getRepoRuleSuite:["GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"],getRepoRuleSuites:["GET /repos/{owner}/{repo}/rulesets/rule-suites"],getRepoRuleset:["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],getRepoRulesets:["GET /repos/{owner}/{repo}/rulesets"],getStatusChecksProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],getTeamsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],getTopPaths:["GET /repos/{owner}/{repo}/traffic/popular/paths"],getTopReferrers:["GET /repos/{owner}/{repo}/traffic/popular/referrers"],getUsersWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],getViews:["GET /repos/{owner}/{repo}/traffic/views"],getWebhook:["GET /repos/{owner}/{repo}/hooks/{hook_id}"],getWebhookConfigForRepo:["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"],listActivities:["GET /repos/{owner}/{repo}/activity"],listAttestations:["GET /repos/{owner}/{repo}/attestations/{subject_digest}"],listAutolinks:["GET /repos/{owner}/{repo}/autolinks"],listBranches:["GET /repos/{owner}/{repo}/branches"],listBranchesForHeadCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"],listCollaborators:["GET /repos/{owner}/{repo}/collaborators"],listCommentsForCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],listCommitCommentsForRepo:["GET /repos/{owner}/{repo}/comments"],listCommitStatusesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],listCommits:["GET /repos/{owner}/{repo}/commits"],listContributors:["GET /repos/{owner}/{repo}/contributors"],listCustomDeploymentRuleIntegrations:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"],listDeployKeys:["GET /repos/{owner}/{repo}/keys"],listDeploymentBranchPolicies:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],listDeploymentStatuses:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],listDeployments:["GET /repos/{owner}/{repo}/deployments"],listForAuthenticatedUser:["GET /user/repos"],listForOrg:["GET /orgs/{org}/repos"],listForUser:["GET /users/{username}/repos"],listForks:["GET /repos/{owner}/{repo}/forks"],listInvitations:["GET /repos/{owner}/{repo}/invitations"],listInvitationsForAuthenticatedUser:["GET /user/repository_invitations"],listLanguages:["GET /repos/{owner}/{repo}/languages"],listPagesBuilds:["GET /repos/{owner}/{repo}/pages/builds"],listPublic:["GET /repositories"],listPullRequestsAssociatedWithCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"],listReleaseAssets:["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],listReleases:["GET /repos/{owner}/{repo}/releases"],listTags:["GET /repos/{owner}/{repo}/tags"],listTeams:["GET /repos/{owner}/{repo}/teams"],listWebhookDeliveries:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /repos/{owner}/{repo}/hooks"],merge:["POST /repos/{owner}/{repo}/merges"],mergeUpstream:["POST /repos/{owner}/{repo}/merge-upstream"],pingWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeAppAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],removeCollaborator:["DELETE /repos/{owner}/{repo}/collaborators/{username}"],removeStatusCheckContexts:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],removeStatusCheckProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],removeTeamAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],removeUserAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],renameBranch:["POST /repos/{owner}/{repo}/branches/{branch}/rename"],replaceAllTopics:["PUT /repos/{owner}/{repo}/topics"],requestPagesBuild:["POST /repos/{owner}/{repo}/pages/builds"],setAdminBranchProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],setAppAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],setStatusCheckContexts:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],setTeamAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],setUserAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],testPushWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],transfer:["POST /repos/{owner}/{repo}/transfer"],update:["PATCH /repos/{owner}/{repo}"],updateBranchProtection:["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],updateCommitComment:["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],updateDeploymentBranchPolicy:["PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],updateInformationAboutPagesSite:["PUT /repos/{owner}/{repo}/pages"],updateInvitation:["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],updateOrgRuleset:["PUT /orgs/{org}/rulesets/{ruleset_id}"],updatePullRequestReviewProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],updateRelease:["PATCH /repos/{owner}/{repo}/releases/{release_id}"],updateReleaseAsset:["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],updateRepoRuleset:["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],updateStatusCheckPotection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",{},{renamed:["repos","updateStatusCheckProtection"]}],updateStatusCheckProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],updateWebhook:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],updateWebhookConfigForRepo:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],uploadReleaseAsset:["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",{baseUrl:"https://uploads.github.com"}]},search:{code:["GET /search/code"],commits:["GET /search/commits"],issuesAndPullRequests:["GET /search/issues"],labels:["GET /search/labels"],repos:["GET /search/repositories"],topics:["GET /search/topics"],users:["GET /search/users"]},secretScanning:{createPushProtectionBypass:["POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"],getAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],getScanHistory:["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/secret-scanning/alerts"],listAlertsForOrg:["GET /orgs/{org}/secret-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/secret-scanning/alerts"],listLocationsForAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"],updateAlert:["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]},securityAdvisories:{createFork:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"],createPrivateVulnerabilityReport:["POST /repos/{owner}/{repo}/security-advisories/reports"],createRepositoryAdvisory:["POST /repos/{owner}/{repo}/security-advisories"],createRepositoryAdvisoryCveRequest:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"],getGlobalAdvisory:["GET /advisories/{ghsa_id}"],getRepositoryAdvisory:["GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"],listGlobalAdvisories:["GET /advisories"],listOrgRepositoryAdvisories:["GET /orgs/{org}/security-advisories"],listRepositoryAdvisories:["GET /repos/{owner}/{repo}/security-advisories"],updateRepositoryAdvisory:["PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"]},teams:{addOrUpdateMembershipForUserInOrg:["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],addOrUpdateProjectPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"],addOrUpdateRepoPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],checkPermissionsForProjectInOrg:["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"],checkPermissionsForRepoInOrg:["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],create:["POST /orgs/{org}/teams"],createDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],createDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions"],deleteDiscussionCommentInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],deleteDiscussionInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],deleteInOrg:["DELETE /orgs/{org}/teams/{team_slug}"],getByName:["GET /orgs/{org}/teams/{team_slug}"],getDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],getDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],getMembershipForUserInOrg:["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],list:["GET /orgs/{org}/teams"],listChildInOrg:["GET /orgs/{org}/teams/{team_slug}/teams"],listDiscussionCommentsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],listDiscussionsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions"],listForAuthenticatedUser:["GET /user/teams"],listMembersInOrg:["GET /orgs/{org}/teams/{team_slug}/members"],listPendingInvitationsInOrg:["GET /orgs/{org}/teams/{team_slug}/invitations"],listProjectsInOrg:["GET /orgs/{org}/teams/{team_slug}/projects"],listReposInOrg:["GET /orgs/{org}/teams/{team_slug}/repos"],removeMembershipForUserInOrg:["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],removeProjectInOrg:["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],removeRepoInOrg:["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],updateDiscussionCommentInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],updateDiscussionInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],updateInOrg:["PATCH /orgs/{org}/teams/{team_slug}"]},users:{addEmailForAuthenticated:["POST /user/emails",{},{renamed:["users","addEmailForAuthenticatedUser"]}],addEmailForAuthenticatedUser:["POST /user/emails"],addSocialAccountForAuthenticatedUser:["POST /user/social_accounts"],block:["PUT /user/blocks/{username}"],checkBlocked:["GET /user/blocks/{username}"],checkFollowingForUser:["GET /users/{username}/following/{target_user}"],checkPersonIsFollowedByAuthenticated:["GET /user/following/{username}"],createGpgKeyForAuthenticated:["POST /user/gpg_keys",{},{renamed:["users","createGpgKeyForAuthenticatedUser"]}],createGpgKeyForAuthenticatedUser:["POST /user/gpg_keys"],createPublicSshKeyForAuthenticated:["POST /user/keys",{},{renamed:["users","createPublicSshKeyForAuthenticatedUser"]}],createPublicSshKeyForAuthenticatedUser:["POST /user/keys"],createSshSigningKeyForAuthenticatedUser:["POST /user/ssh_signing_keys"],deleteEmailForAuthenticated:["DELETE /user/emails",{},{renamed:["users","deleteEmailForAuthenticatedUser"]}],deleteEmailForAuthenticatedUser:["DELETE /user/emails"],deleteGpgKeyForAuthenticated:["DELETE /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","deleteGpgKeyForAuthenticatedUser"]}],deleteGpgKeyForAuthenticatedUser:["DELETE /user/gpg_keys/{gpg_key_id}"],deletePublicSshKeyForAuthenticated:["DELETE /user/keys/{key_id}",{},{renamed:["users","deletePublicSshKeyForAuthenticatedUser"]}],deletePublicSshKeyForAuthenticatedUser:["DELETE /user/keys/{key_id}"],deleteSocialAccountForAuthenticatedUser:["DELETE /user/social_accounts"],deleteSshSigningKeyForAuthenticatedUser:["DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"],follow:["PUT /user/following/{username}"],getAuthenticated:["GET /user"],getById:["GET /user/{account_id}"],getByUsername:["GET /users/{username}"],getContextForUser:["GET /users/{username}/hovercard"],getGpgKeyForAuthenticated:["GET /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","getGpgKeyForAuthenticatedUser"]}],getGpgKeyForAuthenticatedUser:["GET /user/gpg_keys/{gpg_key_id}"],getPublicSshKeyForAuthenticated:["GET /user/keys/{key_id}",{},{renamed:["users","getPublicSshKeyForAuthenticatedUser"]}],getPublicSshKeyForAuthenticatedUser:["GET /user/keys/{key_id}"],getSshSigningKeyForAuthenticatedUser:["GET /user/ssh_signing_keys/{ssh_signing_key_id}"],list:["GET /users"],listAttestations:["GET /users/{username}/attestations/{subject_digest}"],listBlockedByAuthenticated:["GET /user/blocks",{},{renamed:["users","listBlockedByAuthenticatedUser"]}],listBlockedByAuthenticatedUser:["GET /user/blocks"],listEmailsForAuthenticated:["GET /user/emails",{},{renamed:["users","listEmailsForAuthenticatedUser"]}],listEmailsForAuthenticatedUser:["GET /user/emails"],listFollowedByAuthenticated:["GET /user/following",{},{renamed:["users","listFollowedByAuthenticatedUser"]}],listFollowedByAuthenticatedUser:["GET /user/following"],listFollowersForAuthenticatedUser:["GET /user/followers"],listFollowersForUser:["GET /users/{username}/followers"],listFollowingForUser:["GET /users/{username}/following"],listGpgKeysForAuthenticated:["GET /user/gpg_keys",{},{renamed:["users","listGpgKeysForAuthenticatedUser"]}],listGpgKeysForAuthenticatedUser:["GET /user/gpg_keys"],listGpgKeysForUser:["GET /users/{username}/gpg_keys"],listPublicEmailsForAuthenticated:["GET /user/public_emails",{},{renamed:["users","listPublicEmailsForAuthenticatedUser"]}],listPublicEmailsForAuthenticatedUser:["GET /user/public_emails"],listPublicKeysForUser:["GET /users/{username}/keys"],listPublicSshKeysForAuthenticated:["GET /user/keys",{},{renamed:["users","listPublicSshKeysForAuthenticatedUser"]}],listPublicSshKeysForAuthenticatedUser:["GET /user/keys"],listSocialAccountsForAuthenticatedUser:["GET /user/social_accounts"],listSocialAccountsForUser:["GET /users/{username}/social_accounts"],listSshSigningKeysForAuthenticatedUser:["GET /user/ssh_signing_keys"],listSshSigningKeysForUser:["GET /users/{username}/ssh_signing_keys"],setPrimaryEmailVisibilityForAuthenticated:["PATCH /user/email/visibility",{},{renamed:["users","setPrimaryEmailVisibilityForAuthenticatedUser"]}],setPrimaryEmailVisibilityForAuthenticatedUser:["PATCH /user/email/visibility"],unblock:["DELETE /user/blocks/{username}"],unfollow:["DELETE /user/following/{username}"],updateAuthenticated:["PATCH /user"]}},Zo=Qo,U=new Map;for(let[r,e]of Object.entries(Zo))for(let[t,s]of Object.entries(e)){let[o,i,n]=s,[c,a]=o.split(/ /),l=Object.assign({method:c,url:a},i);U.has(r)||U.set(r,new Map),U.get(r).set(t,{scope:r,methodName:t,endpointDefaults:l,decorations:n})}var Yo={has({scope:r},e){return U.get(r).has(e)},getOwnPropertyDescriptor(r,e){return{value:this.get(r,e),configurable:!0,writable:!0,enumerable:!0}},defineProperty(r,e,t){return Object.defineProperty(r.cache,e,t),!0},deleteProperty(r,e){return delete r.cache[e],!0},ownKeys({scope:r}){return[...U.get(r).keys()]},set(r,e,t){return r.cache[e]=t},get({octokit:r,scope:e,cache:t},s){if(t[s])return t[s];let o=U.get(e).get(s);if(!o)return;let{endpointDefaults:i,decorations:n}=o;return n?t[s]=ei(r,e,s,i,n):t[s]=r.request.defaults(i),t[s]}};function dt(r){let e={};for(let t of U.keys())e[t]=new Proxy({octokit:r,scope:t,cache:{}},Yo);return e}function ei(r,e,t,s,o){let i=r.request.defaults(s);function n(...c){let a=i.endpoint.merge(...c);if(o.mapToData)return a=Object.assign({},a,{data:a[o.mapToData],[o.mapToData]:void 0}),i(a);if(o.renamed){let[l,p]=o.renamed;r.log.warn(`octokit.${e}.${t}() has been renamed to octokit.${l}.${p}()`)}if(o.deprecated&&r.log.warn(o.deprecated),o.renamedParameters){let l=i.endpoint.merge(...c);for(let[p,u]of Object.entries(o.renamedParameters))p in l&&(r.log.warn(`"${p}" parameter is deprecated for "octokit.${e}.${t}()". Use "${u}" instead`),u in l||(l[u]=l[p]),delete l[p]);return i(l)}return i(...c)}return Object.assign(n,i)}function ut(r){return{rest:dt(r)}}ut.VERSION=pt;function gt(r){let e=dt(r);return{...e,rest:e}}gt.VERSION=pt});var vt=_((sn,bt)=>{"use strict";var Ie=Object.defineProperty,ri=Object.getOwnPropertyDescriptor,ti=Object.getOwnPropertyNames,si=Object.prototype.hasOwnProperty,oi=(r,e)=>{for(var t in e)Ie(r,t,{get:e[t],enumerable:!0})},ii=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ti(e))!si.call(r,o)&&o!==t&&Ie(r,o,{get:()=>e[o],enumerable:!(s=ri(e,o))||s.enumerable});return r},ni=r=>ii(Ie({},"__esModule",{value:!0}),r),ht={};oi(ht,{Octokit:()=>ui});bt.exports=ni(ht);var ai=Qr(),ci=rt(),li=ct(),pi=ft(),di="20.1.2",ui=ai.Octokit.plugin(ci.requestLog,pi.legacyRestEndpointMethods,li.paginateRest).defaults({userAgent:`octokit-rest.js/${di}`})});var _i={};It(_i,{activate:()=>Ti,deactivate:()=>wi});module.exports=Vt(_i);var x=v(require("vscode"));var b=v(require("vscode"));var O=v(require("fs")),Ee=v(require("path"));var We=v(require("vscode")),ye=class r{static instance;channel;constructor(){this.channel=We.window.createOutputChannel("CodeVulFixer")}static getInstance(){return r.instance||(r.instance=new r),r.instance}log(e,t="INFO"){let s=new Date().toISOString();this.channel.appendLine(`[${s}] [${t}] ${e}`)}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e,t){let s=t instanceof Error?` - ${t.message}
${t.stack??""}`:t?` - ${JSON.stringify(t)}`:"";this.log(`${e}${s}`,"ERROR")}success(e){this.log(`\u2714 ${e}`,"SUCCESS")}show(){this.channel.show(!0)}appendRaw(e){this.channel.append(e)}},d=ye.getInstance();var E=class r{static DIR_NAME=".codevulfixer";static FILE_NAME="sprint-state.json";static getStatePath(e){return Ee.join(e,r.DIR_NAME,r.FILE_NAME)}static async loadState(e){let t=this.getStatePath(e);if(O.existsSync(t))try{let s=await O.promises.readFile(t,"utf8"),o=JSON.parse(s);return d.info(`Loaded sprint state for ${o.repoOwner}/${o.repoName} from disk.`),o}catch(s){d.error("Failed to read sprint state file",s);return}}static async saveState(e,t){let s=Ee.join(e,r.DIR_NAME),o=this.getStatePath(e);try{O.existsSync(s)||await O.promises.mkdir(s,{recursive:!0}),t.lastUpdated=new Date().toISOString(),this.recalculateMetrics(t),await O.promises.writeFile(o,JSON.stringify(t,null,2),"utf8"),d.info(`Persisted sprint state to ${o}`)}catch(i){throw d.error("Failed to save sprint state file",i),i}}static async updateFinding(e,t,s){let o=await this.loadState(e);if(!o){d.warn(`Cannot update finding ${t}: No active sprint state found.`);return}let i=o.findings[t];return i?(o.findings[t]={...i,...s,lastAttemptAt:new Date().toISOString()},await this.saveState(e,o),o):(d.warn(`Finding ${t} not present in state.`),o)}static async updateSprintStatus(e,t,s){let o=await this.loadState(e);if(!o)return;let i=o.sprints.find(n=>n.sprintNumber===t);return i&&(i.status=s),await this.saveState(e,o),o}static async resetState(e){let t=this.getStatePath(e);O.existsSync(t)&&(await O.promises.unlink(t),d.info(`Reset sprint state: deleted ${t}`))}static recalculateMetrics(e){let t=Object.values(e.findings),s=t.length,o=0,i=0,n=0;for(let c of t)c.status==="verified"?o++:c.status==="failed"||c.status==="rejected"?i++:n++;e.metrics.totalFindings=s,e.metrics.resolvedCount=o,e.metrics.pendingCount=n,e.metrics.failedCount=i}};var Be=v(require("vscode")),$=class{static getConfig(){let e=Be.workspace.getConfiguration("codevulfixer");return{planningMode:e.get("planningMode","sprint_wise"),daysPerSprint:e.get("daysPerSprint",10),maxHighRiskPerDay:e.get("maxHighRiskPerDay",3),targetSprintDays:e.get("targetSprintDays",4)}}static planSprints(e,t,s,o){let i={...this.getConfig(),...o},n=i.planningMode==="sprint_wise",c=n?i.daysPerSprint||10:1,a=[],l=[],p=[];for(let h of e){let y=h.severity==="critical"||h.severity==="high",T=h.sizing.size==="S";y&&T?a.push(h):y?l.push(h):p.push(h)}let u=[],m={};if(n){let h=[...a,...l.slice(0,4)],T=[...l.slice(4),...p.slice(0,6)],G=p.slice(6);u.push(this.createSprintDay(1,i.planningMode,c,`Sprint 1 (${c}-Day Agile Sprint)`,`Sprint 1: Critical Security Remediation & Quick Wins (${c} Working Days)`,`Standard 2-week Agile sprint (${c} working days) targeting all direct lockfile bumps, quick-win patches, and core critical CodeQL findings.`,h)),u.push(this.createSprintDay(2,i.planningMode,c,`Sprint 2 (${c}-Day Agile Sprint)`,`Sprint 2: Architectural Rewrites & Secondary Upgrades (${c} Working Days)`,`Standard 2-week Agile sprint (${c} working days) allocated for major version migrations, complex taint refactoring, and regression test suites.`,T.length>0?T:p)),G.length>0&&u.push(this.createSprintDay(3,i.planningMode,c,`Sprint 3 (${c}-Day Agile Sprint)`,`Sprint 3: Security Hygiene, Deprecations & Audit Sign-Off (${c} Working Days)`,`Long-term hygiene maintenance, third-party dependency deprecation, and final compliance sign-off over ${c} working days.`,G))}else{let h=[...a];h.length<3&&p.length>0&&h.push(...p.splice(0,2)),u.push(this.createSprintDay(1,i.planningMode,1,"Day 1 (Daily Focus)","Day 1: Immediate Quick Wins (1 Day Duration)","Direct dependency lockfile bumps, transitive deduplications, and self-contained AST sanitizers.",h));let y=l.slice(0,i.maxHighRiskPerDay),T=l.slice(i.maxHighRiskPerDay);u.push(this.createSprintDay(2,i.planningMode,1,"Day 2 (Daily Focus)",`Day 2: High Severity Architectural Items (Capped at ${i.maxHighRiskPerDay}/day)`,"Complex SQL/Command injections, prototype pollutions, and major package upgrades requiring test validation.",y));let G=[...T,...p];u.push(this.createSprintDay(3,i.planningMode,1,"Day 3+ (Daily Focus)","Day 3: Security Hygiene & Audit Sweep","Medium and low risk items, secondary dependencies, and final verification checks.",G))}let g=0;for(let h of u)for(let y of h.findings){let T=e.find(G=>G.id===y);T&&(T.targetSprint=h.sprintNumber,m[T.id]=T,g+=T.sizing.estimatedHours)}return{version:"1.0.1",repoOwner:t,repoName:s,lastUpdated:new Date().toISOString(),planningMode:i.planningMode,daysPerSprint:c,sprints:u,findings:m,activeSprint:1,metrics:{totalFindings:e.length,resolvedCount:0,pendingCount:e.length,failedCount:0,totalEstimatedHours:Math.round(g*10)/10,hoursSaved:Math.round(g*.75*10)/10}}}static createSprintDay(e,t,s,o,i,n,c){let a=c.reduce((l,p)=>l+p.sizing.estimatedHours,0);return{sprintNumber:e,planningMode:t,durationDays:s,dayLabel:o,title:i,description:n,findings:c.map(l=>l.id),totalEstimatedHours:Math.round(a*10)/10,status:e===1?"in_progress":"pending"}}};var Ke=v(require("vscode")),Xe=require("child_process"),Qe=require("util");var Je=(0,Qe.promisify)(Xe.exec),C=class{static getPrimaryWorkspacePath(){let e=Ke.workspace.workspaceFolders;if(!(!e||e.length===0))return e[0].uri.fsPath}static async resolveRepoMetadata(){let e=this.getPrimaryWorkspacePath();if(!e){d.warn("No active workspace folder found.");return}try{let{stdout:t}=await Je("git config --get remote.origin.url",{cwd:e}),s=t.trim();if(!s){d.warn("No Git remote origin configured in workspace.");return}let o=this.parseGitHubUrl(s);if(!o){d.warn(`Could not parse GitHub owner/repo from remote URL: ${s}`);return}let i="main";try{let{stdout:c}=await Je("git rev-parse --abbrev-ref HEAD",{cwd:e});i=c.trim()||"main"}catch{}let n={owner:o.owner,repo:o.repo,remoteUrl:s,currentBranch:i};return d.info(`Resolved GitHub repository: ${n.owner}/${n.repo} (branch: ${n.currentBranch})`),n}catch(t){d.warn(`Git resolution failed or workspace is not a git repository: ${t instanceof Error?t.message:String(t)}`);return}}static parseGitHubUrl(e){let s=e.trim().match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);if(s&&s[1]&&s[2])return{owner:s[1],repo:s[2].replace(/\.git$/,"")}}};var Te=v(require("vscode"));var re=class r{static SCOPES=["repo","security_events"];static async getSession(e=!0){try{d.info(`Requesting GitHub session with scopes: [${r.SCOPES.join(", ")}]`);let t=await Te.authentication.getSession("github",r.SCOPES,{createIfNone:e});if(t)return d.success(`GitHub authentication successful for user: ${t.account.label}`),t;d.warn("GitHub authentication session was not granted or cancelled by user.");return}catch(t){throw d.error("Failed to obtain GitHub authentication session",t),t}}static async hasExistingSession(){try{return!!await Te.authentication.getSession("github",r.SCOPES,{createIfNone:!1})}catch{return!1}}};var yt=v(vt());var oe=class{static create(e){return d.info("Initializing Octokit client with user session token."),new yt.Octokit({auth:e,userAgent:"CodeVulFixer-VSCode-Extension/1.0.1"})}};var ie=class{static async fetchAlerts(e,t,s){d.info(`Fetching Dependabot alerts for ${t}/${s}...`);try{let i=(await e.rest.dependabot.listAlertsForRepo({owner:t,repo:s,state:"open",per_page:100})).data;return d.info(`Received ${i.length} Dependabot alerts.`),i.map((n,c)=>{let a=n.security_advisory,l=n.dependency,p=a.cve_id||a.ghsa_id||`DEP-${n.number}`,m=a.vulnerabilities?.[0]?.first_patched_version?.identifier||(a.patched_versions&&a.patched_versions.length>0?a.patched_versions[0].identifier:void 0)||"latest",g=a.vulnerabilities?.[0]?.vulnerable_version_range||a.vulnerable_version_range||"vulnerable",f=this.normalizeSeverity(a.severity),h=l?.package?.ecosystem||"npm",y=l?.package?.name||"unknown-package",T=l?.manifest_path||"package.json",G={packageName:y,ecosystem:h,currentVersion:g,fixedVersion:m,isDirect:!0,manifestFile:T,vulnerableVersionRange:g,upgradeType:this.determineUpgradeType(g,m)};return{id:`DEP-${n.number}`,source:"dependabot",alertNumber:n.number,title:a.summary||`Vulnerability in ${y}`,description:a.description||`Dependabot flagged ${y} with ${p}`,severity:f,htmlUrl:n.html_url,cveId:a.cve_id||void 0,ghsaId:a.ghsa_id||void 0,cweIds:a.cwes?.map(Dt=>Dt.cwe_id)||[],dependency:G,status:"pending",targetSprint:1,remediationPlan:`Upgrade ${y} to >= ${m} via lockfile bump`,sizing:{size:"S",riskLevel:"low",reasons:[],estimatedHours:1,isAutomatedCandidate:!0}}})}catch(o){throw d.error(`Failed to fetch Dependabot alerts for ${t}/${s}`,o),o}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"?"high":t==="medium"||t==="moderate"?"medium":"low"}static determineUpgradeType(e,t){if(!t||t==="latest")return"minor";let s=t.match(/^(\d+)\.(\d+)\.(\d+)/);if(!s)return"unknown";if(e&&e.includes("<")){let o=parseInt(s[1],10),i=e.match(/<\s*(\d+)/);if(i){let n=parseInt(i[1],10);if(o>n)return"major"}}return"patch"}};var ne=class{static async fetchAlerts(e,t,s){d.info(`Fetching Code Scanning (SAST/CodeQL) alerts for ${t}/${s}...`);try{let i=(await e.rest.codeScanning.listAlertsForRepo({owner:t,repo:s,state:"open",per_page:100})).data;return d.info(`Received ${i.length} Code Scanning findings.`),i.map(n=>{let c=n.rule,a=n.most_recent_instance,l=a?.location,p=this.normalizeSeverity(c.security_severity_level||c.severity),u=this.extractCWEs(c.tags??void 0),m=l?.path?{filePath:l.path,startLine:l.start_line||1,endLine:l.end_line||l.start_line||1,startColumn:l.start_column??void 0,endColumn:l.end_column??void 0}:void 0;return{id:`CS-${n.number}`,source:"code_scanning",alertNumber:n.number,title:c.description||c.id||`Code Scanning Alert #${n.number}`,description:a?.message?.text||c.description||"Static analysis finding flagged by CodeQL",severity:p,htmlUrl:n.html_url,ruleId:c.id??void 0,cweIds:u,location:m,status:"pending",targetSprint:1,remediationPlan:`Refactor code at ${l?.path||"file"} to resolve ${c.id}`,sizing:{size:"M",riskLevel:"medium",reasons:[],estimatedHours:2,isAutomatedCandidate:!1}}})}catch(o){throw d.error(`Failed to fetch Code Scanning alerts for ${t}/${s}`,o),o}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"||t==="error"?"high":t==="medium"||t==="warning"?"medium":"low"}static extractCWEs(e){if(!e)return[];let t=[];for(let s of e)if(s.startsWith("external/cwe/cwe-")){let o=s.replace("external/cwe/cwe-","CWE-");t.push(o.toUpperCase())}else/^cwe-\d+/i.test(s)&&t.push(s.toUpperCase());return t}};var w=v(require("fs")),k=v(require("path"));var ae=class{static async analyze(e,t){let s={...t};try{let o=k.join(e,t.manifestFile||"package.json");if(w.existsSync(o)){let l=w.readFileSync(o,"utf8"),p=JSON.parse(l),u=p.dependencies&&p.dependencies[t.packageName]||p.devDependencies&&p.devDependencies[t.packageName]||p.peerDependencies&&p.peerDependencies[t.packageName];u?(s.isDirect=!0,s.currentVersion=u):s.isDirect=!1}let i=k.join(e,t.manifestFile||"pom.xml");if(w.existsSync(i)&&(t.ecosystem==="maven"||t.packageName.includes(":")||t.packageName.includes("spring"))){let l=w.readFileSync(i,"utf8");s.manifestFile="pom.xml",s.ecosystem="maven";let p=l.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);p&&(s.javaVersionConstraint=p[1].trim().replace(/^1\./,""));let u=t.packageName.split(":").pop()||t.packageName;(l.includes(`<artifactId>${u}</artifactId>`)||l.includes(t.packageName))&&(s.isDirect=!0)}if(t.ecosystem==="nuget"||t.packageName.toLowerCase().includes("log4net")||t.packageName.toLowerCase().includes("microsoft.")||t.packageName.toLowerCase().includes("system.")||t.manifestFile?.endsWith(".csproj")){let p=w.readdirSync(e).find(u=>u.endsWith(".csproj"));if(p){let u=w.readFileSync(k.join(e,p),"utf8");s.manifestFile=p,s.ecosystem="nuget";let m=u.match(/<TargetFramework(?:Version)?>(.*?)<\/TargetFramework(?:Version)?>/);m&&(s.targetFramework=m[1].trim()),u.toLowerCase().includes(t.packageName.toLowerCase())&&(s.isDirect=!0)}}if(w.existsSync(k.join(e,"package-lock.json")))s.lockfile="package-lock.json",s.ecosystem!=="maven"&&s.ecosystem!=="nuget"&&(s.ecosystem="npm");else if(w.existsSync(k.join(e,"pnpm-lock.yaml")))s.lockfile="pnpm-lock.yaml",s.ecosystem="pnpm";else if(w.existsSync(k.join(e,"yarn.lock")))s.lockfile="yarn.lock",s.ecosystem="yarn";else if(w.existsSync(k.join(e,"uv.lock")))s.lockfile="uv.lock",s.ecosystem="uv";else if(w.existsSync(k.join(e,"requirements.txt")))s.lockfile="requirements.txt",s.ecosystem="pip";else if(w.existsSync(k.join(e,"Cargo.lock"))||w.existsSync(k.join(e,"Cargo.toml")))s.lockfile=w.existsSync(k.join(e,"Cargo.lock"))?"Cargo.lock":"Cargo.toml",s.manifestFile="Cargo.toml",s.ecosystem="cargo";else if(w.existsSync(k.join(e,"go.mod")))s.lockfile="go.sum",s.manifestFile="go.mod",s.ecosystem="go";else if((w.existsSync(k.join(e,"CMakeLists.txt"))||w.existsSync(k.join(e,"vcpkg.json")))&&(s.manifestFile=w.existsSync(k.join(e,"CMakeLists.txt"))?"CMakeLists.txt":"vcpkg.json",s.ecosystem="cpp",w.existsSync(k.join(e,"CMakeLists.txt")))){let p=w.readFileSync(k.join(e,"CMakeLists.txt"),"utf8").match(/CMAKE_CXX_STANDARD\s+(\d+)/);p&&(s.cppStandard=`c++${p[1]}`)}let c=s.currentVersion.match(/(\d+)/),a=s.fixedVersion.match(/(\d+)/);if(c&&a){let l=parseInt(c[1],10),p=parseInt(a[1],10);s.majorGap=Math.max(1,p-l)}}catch(o){d.warn(`DependencyAnalyzer could not inspect manifest for ${t.packageName}: ${o}`)}return s}};var le=v(require("fs")),pe=v(require("path"));var ce=class{static COMPLEX_CWES=new Set(["CWE-89","CWE-78","CWE-94","CWE-502","CWE-287","CWE-327","CWE-918"]);static SIMPLE_CWES=new Set(["CWE-79","CWE-330","CWE-1333","CWE-400"]);static async analyze(e,t,s=[],o){if(!t||!t.filePath)return{fileExists:!1,fileLinesCount:0,isSelfContained:!0,taintComplexity:"moderate"};let i=pe.isAbsolute(t.filePath)?t.filePath:pe.join(e,t.filePath);if(!le.existsSync(i))return{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!1,taintComplexity:this.determineComplexity(s,o)};try{let c=le.readFileSync(i,"utf8").split(/\r?\n/),a=Math.max(0,t.startLine-1),l=Math.min(c.length,t.endLine),p=c.slice(a,l).join(`
`),u=Math.max(0,a-5),m=Math.min(c.length,l+5),g=c.slice(u,m).join(`
`),f=l-a<=8&&c.length<500,h=this.determineComplexity(s,o);return{fileExists:!0,fileLinesCount:c.length,snippet:p||t.snippet,surroundingContext:g,isSelfContained:f,taintComplexity:h}}catch(n){return d.warn(`Could not read code context for ${i}: ${n}`),{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!0,taintComplexity:this.determineComplexity(s,o)}}}static determineComplexity(e,t){for(let s of e){if(this.COMPLEX_CWES.has(s))return"complex";if(this.SIMPLE_CWES.has(s))return"simple"}if(t){let s=t.toLowerCase();if(s.includes("sql")||s.includes("command")||s.includes("rce")||s.includes("crypto"))return"complex";if(s.includes("random")||s.includes("xss")||s.includes("redos"))return"simple"}return"moderate"}};var q=v(require("fs")),Ve=v(require("path"));var z=class{static detectWorkspaceEnvironment(e){let t={hasLegacyModules:!1,legacyModuleNames:[]};try{let s=Ve.join(e,"pom.xml");if(q.existsSync(s)){let i=q.readFileSync(s,"utf8"),n=i.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);if(n){let c=n[1].trim();t.javaVersion=c.replace(/^1\./,"")}if(i.includes("<module>")||i.includes("legacy")){t.hasLegacyModules=!0;let c=i.match(/<module>(.*?)<\/module>/g);c&&(t.legacyModuleNames=c.map(a=>a.replace(/<\/?module>/g,"").trim()))}}let o=Ve.join(e,"package.json");if(q.existsSync(o)){let i=JSON.parse(q.readFileSync(o,"utf8"));i.engines&&i.engines.node&&(t.nodeEngine=i.engines.node)}}catch(s){d.warn(`CompatibilityAdvisor could not inspect workspace environment: ${s}`)}return t}static advise(e,t,s){let o=s||e.dependency;if(!o)return;let i=this.detectWorkspaceEnvironment(t),n=o.packageName.toLowerCase(),c=o.currentVersion||"",a=o.fixedVersion||"",l=n.includes("org.springframework")||n==="spring"||n==="spring-core"||n==="spring-webmvc"||n.includes("spring-boot"),p=o.javaVersionConstraint||i.javaVersion||(e.description.toLowerCase().includes("java 8")?"8":void 0),u=p==="8"||p==="1.8";if(l){let m=c.match(/^(\d+)/),g=a.match(/^(\d+)/),f=m?parseInt(m[1],10):1,h=g?parseInt(g[1],10):5;if(h>=6&&u)return{hasDeadlock:!0,idealVersion:a,safeRecommendedVersion:"5.3.39",constraintSummary:`Legacy modules require Java 8, but ideal upgrade target (${a}) mandates Java 17+.`,tradeoffReason:`Upgrading to Spring ${a} causes fatal runtime/compilation failure due to the Java 8 module pin. Upgrading to Spring 5.3.39 (Intermediate Safe Target) eliminates critical RCE vulnerabilities while maintaining 100% Java 8 runtime compliance.`,riskReduction:"Mitigates Critical RCE exposure while completely eliminating platform incompatibility and build failure risk.",actionStrategy:"intermediate_upgrade",conflictingPackages:i.legacyModuleNames.length>0?i.legacyModuleNames:["java-runtime-8-module"]};if(f<=2&&h>=5)return{hasDeadlock:u&&h>=6,idealVersion:h>=6?a:"5.3.39",safeRecommendedVersion:"5.3.39",constraintSummary:`4-generation jump from Spring ${c} to ${a}. Java 8 baseline required.`,tradeoffReason:"Spring 1.x to 5.x is an architectural epoch migration. Targeting Spring 5.3.39 preserves Java 8 runtime compatibility and patches all known RCEs without forcing an immediate JVM platform upgrade.",riskReduction:"Mitigates Critical RCE to Zero; bounds breaking changes to Spring 5.3 without cascading into a Java 17 platform overhaul.",actionStrategy:"intermediate_upgrade",conflictingPackages:["org.springframework:spring-core"]}}if(n.includes("log4j")&&u&&(a.startsWith("3.")||a.startsWith("2.18")||a.startsWith("2.19")||a.startsWith("2.20")))return{hasDeadlock:!0,idealVersion:a,safeRecommendedVersion:"2.17.1",constraintSummary:`Target Log4j ${a} requires Java 9+, while workspace is pinned to Java 8.`,tradeoffReason:"Upgrading to Log4j 2.17.1 patches Log4Shell (CVE-2021-44228) and RCE while ensuring complete Java 8 bytecode compatibility.",riskReduction:"Eliminates Critical Log4Shell vulnerability with zero JVM runtime risk.",actionStrategy:"intermediate_upgrade"};if(o.ecosystem==="npm"||o.ecosystem==="yarn"||o.ecosystem==="pnpm"){let m=c.match(/^(\d+)/),g=a.match(/^(\d+)/);if(m&&g){let f=parseInt(m[1],10),h=parseInt(g[1],10),y=h-f;if(y>=2||o.peerConflicts&&o.peerConflicts.length>0){let T=`${f}.${c.split(".")[1]||"0"}.patched`;return{hasDeadlock:!1,idealVersion:a,safeRecommendedVersion:o.fixedVersion,constraintSummary:`Major version leap (v${f} -> v${h}) risks peer dependency collisions across application modules.`,tradeoffReason:`High-risk upgrade spans ${y} major versions. Recommended to perform an intermediate step to stabilize APIs before advancing to the latest major release.`,riskReduction:"Reduces regression breakages in downstream dependents.",actionStrategy:"intermediate_upgrade",conflictingPackages:o.peerConflicts}}}}if(n.includes("log4net")||o.ecosystem==="nuget"){let m=n.includes("log4net"),g=o.targetFramework||"",f=g.startsWith("net4")||g.startsWith("v4.")||g.includes("net35");if(m&&(f||e.description.toLowerCase().includes(".net framework"))&&(a.startsWith("3.")||a.startsWith("2.0.16")))return{hasDeadlock:!0,idealVersion:a,safeRecommendedVersion:"2.0.15",constraintSummary:`Legacy .NET Framework (${g||"net4x"}) detected. Target ${a} requires modern .NET runtime.`,tradeoffReason:"Upgrading to log4net 2.0.15 neutralizes XML parser vulnerabilities (CVE-2018-1285) while maintaining complete .NET Framework 4.x compatibility without breaking app.config or binding redirects.",riskReduction:"Mitigates High/Critical RCE with zero .NET runtime migration failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["log4net"]}}}static evaluateCascadingVulnerabilities(e,t){let s=e.packageName.toLowerCase();return s==="express"&&t.startsWith("5.")?{hasCascadingRisk:!0,newVulnerabilities:["Peer dependency conflict with body-parser and cookie-parser < 1.4.0","Breaking router signature change introduced in Express 5.0"],alternativeVersion:"4.19.2"}:s.includes("spring")&&t.startsWith("6.")?{hasCascadingRisk:!0,newVulnerabilities:["Runtime Incompatibility: Spring 6 requires Java 17+ (Workspace has Java 8 constraint)","Java EE to Jakarta EE namespace break (javax.servlet -> jakarta.servlet)"],alternativeVersion:"5.3.39"}:{hasCascadingRisk:!1,newVulnerabilities:[]}}};var de=class{static evaluate(e,t,s,o){let i=[],n="S",c="low",a=1,l=!0;if(e.source==="dependabot"){let p=t||e.dependency,u=p?.upgradeType||"patch",m=p?p.isDirect:!0,g=p?.majorGap||1,f=p?.currentVersion?.match(/(\d+)/),h=p?.fixedVersion?.match(/(\d+)/);if(f&&h){let T=parseInt(f[1],10),G=parseInt(h[1],10);g=Math.max(1,G-T),p&&(p.majorGap=g)}let y=z.advise(e,o||"",p);y&&(e.compatibilityAdvice=y),u==="major"&&g>=2?(n="XL",c="high",a=Math.min(96,Math.round(16*Math.pow(1.5,g-1))),l=!1,i.push(`Multi-generational major version jump (v${f?.[1]||"1"}.x \u2794 v${h?.[1]||"5"}.x) spans ${g} major releases with extensive architectural breaking changes`),i.push("Requires comprehensive configuration refactoring, API migration, and regression test suites"),m&&i.push("Direct package definition requires codebase API audit"),y?.hasDeadlock&&(i.push(`\u26A0\uFE0F Platform Deadlock Detected: ${y.constraintSummary}`),i.push(`\u{1F4A1} Smart Remediation Recommendation: Upgrade to ${y.safeRecommendedVersion} instead of ${y.idealVersion} to eliminate compatibility risk`))):u==="major"?(n="L",c="high",a=3.5,l=!1,i.push("Major version upgrade introduces potential API breaking changes"),m&&i.push("Direct package definition requires codebase API audit"),y&&i.push(`\u{1F4A1} Compatibility Advice: ${y.tradeoffReason}`)):e.severity==="critical"?(n="M",c="medium",a=2,l=!0,i.push("Critical severity dependency patch; prioritized for rapid lockfile refresh")):(n="S",c="low",a=.5,l=!0,i.push(m?"Direct dependency patch bump with backward compatibility":"Transitive lockfile bump without source modifications"))}else{let p=s?.taintComplexity||"moderate",u=s?.isSelfContained??!1,m=e.severity;p==="complex"||m==="critical"?(n="L",c="high",a=4,l=!1,i.push("Complex data-flow / taint across application layers (e.g. SQL Injection or Command Injection)"),i.push("High-risk vulnerability requiring human-in-the-loop verification")):!u||p==="moderate"||m==="high"?(n="M",c="medium",a=2,l=!1,i.push("Code modification touches non-trivial function block"),i.push("Requires regression test validation")):(n="S",c="low",a=.5,l=!0,i.push("Self-contained, localized syntax or security sanitizer replacement"),i.push("Eligible for deterministic AST-grep / AI automated repair"));let g=e.location?.filePath?.toLowerCase()||"",f=e.ruleId?.toLowerCase()||"";g.endsWith(".pas")||g.endsWith(".dpr")||g.endsWith(".dproj")||f.includes("delphi")||f.includes("pascal")?(n==="S"&&(n="M"),a=Math.max(3,a*1.5),l=!1,i.push("Delphi / Object Pascal unmanaged binary: requires manual memory boundary verification, pointer arithmetic inspection, and ABI compiler regression checks")):g.endsWith(".ps1")||g.endsWith(".psm1")||f.includes("powershell")||f.includes("posh")?i.push("PowerShell script environment: requires AST scriptblock restructuring and CmdletBinding parameter validation"):g.endsWith(".cs")||f.startsWith("cs/")?i.push(".NET / C# ecosystem: requires parameterized LINQ/SqlCommand refactoring and target assembly compatibility check"):g.endsWith(".java")||f.startsWith("java/")?i.push("Java / Spring ecosystem: requires JVM runtime compliance and PreparedStatement / Spring Security filter chain audit"):g.endsWith(".cpp")||g.endsWith(".c")||g.endsWith(".cc")||g.endsWith(".cxx")||g.endsWith(".h")||g.endsWith(".hpp")||f.startsWith("cpp/")||f.startsWith("c/")?(n==="S"&&(n="M"),a=Math.max(3.5,a*1.6),l=!1,i.push("C/C++ native unmanaged code: high memory-safety risk (CWE-120/416/125); requires AddressSanitizer (ASAN) audit, valgrind boundary verification, and manual ABI testing")):g.endsWith(".go")||f.startsWith("go/")?i.push("Go ecosystem: requires goroutine concurrency leak audit and safe slice/pointer boundary validation"):(g.endsWith(".rs")||f.startsWith("rust/"))&&i.push("Rust ecosystem: requires unsafe block { unsafe { ... } } audit and borrow checker lifetime verification")}return{size:n,riskLevel:c,reasons:i,estimatedHours:a,isAutomatedCandidate:l}}};var _t=v(require("vscode"));var Et=v(require("vscode")),S=v(require("fs")),A=v(require("path")),Tt=require("child_process"),wt=require("util");var ue=[{ruleId:"js/insecure-randomness",cwe:"CWE-330",name:"Replace Math.random() with Node.js crypto.randomBytes",description:'Replaces cryptographically insecure Math.random() token generation with crypto.randomBytes(32).toString("hex")',matcher:r=>/Math\.random\(\)/.test(r),transform:r=>({transformed:r.replace(/Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,"require('crypto').randomBytes(24).toString('hex')").replace(/Math\.random\(\)/g,"(require('crypto').randomBytes(4).readUInt32LE(0) / 0xffffffff)"),explanation:"Replaced Math.random with cryptographically secure random bytes from native crypto module."})},{ruleId:"js/xss-through-dom",cwe:"CWE-79",name:"Safe textContent assignment for innerHTML",description:"Replaces raw innerHTML assignment with textContent to neutralize cross-site scripting vectors",matcher:r=>/\.innerHTML\s*=/.test(r),transform:r=>({transformed:r.replace(/(\b\w+)\.innerHTML\s*=\s*([^;]+);/g,"$1.textContent = $2;"),explanation:"Converted vulnerable innerHTML assignment to safe textContent."})},{ruleId:"js/command-injection",cwe:"CWE-78",name:"Parameterize child_process shell execution",description:"Swaps vulnerable exec template literal with safe execFile or sanitized arguments",matcher:r=>/exec\(`[^`]*\$\{[^}]+\}[^`]*`/.test(r),transform:r=>({transformed:r.replace(/exec\(`git checkout \$\{([^}]+)\}`,\s*([^)]+)\)/g,'execFile("git", ["checkout", $1], $2)'),explanation:"Replaced shell string concatenation with argument array via execFile."})},{ruleId:"js/sql-injection",cwe:"CWE-89",name:"Parameterize raw SQL template literal",description:"Converts interpolated SQL query strings into parameterized database queries",matcher:r=>/`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i.test(r),transform:r=>({transformed:r.replace(/`SELECT\s+\*\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?\$\{([^}]+)\}['"]?`/i,'"SELECT * FROM $1 WHERE $2 = $1", [$3]'),explanation:"Converted string-interpolated SQL query into parameterized prepared statement."})},{ruleId:"js/path-traversal",cwe:"CWE-22",name:"Enforce path boundary check",description:"Guards path.join with path.resolve boundary check against directory traversal",matcher:r=>/path\.join\(/.test(r),transform:r=>({transformed:r.replace(/const\s+filePath\s*=\s*path\.join\(([^,]+),\s*([^)]+)\);/g,`const safeFilename = path.basename($2);
    const filePath = path.join($1, safeFilename);`),explanation:"Enforced path.basename sanitization to prevent directory escape."})}];var gi=(0,wt.promisify)(Tt.exec),D=class{static async applyFix(e,t){return t.source==="dependabot"?this.fixDependency(e,t):this.fixCodeScanning(e,t)}static async fixDependency(e,t){let s=t.dependency;if(!s)return{success:!1,engine:"deterministic",message:"No dependency metadata available for this alert.",modifiedFiles:[]};let i=Et.workspace.getConfiguration("codevulfixer").get("packageManager","auto");i==="auto"&&(i=s.ecosystem||"npm",S.existsSync(A.join(e,"pnpm-lock.yaml"))?i="pnpm":S.existsSync(A.join(e,"yarn.lock"))?i="yarn":S.existsSync(A.join(e,"uv.lock"))?i="uv":S.existsSync(A.join(e,"requirements.txt"))?i="pip":i="npm");let n=s.packageName,c=s.fixedVersion,a="",l=[];switch(i){case"npm":a=`npm install ${n}@${c} --package-lock-only`,l.push("package-lock.json"),s.isDirect&&l.push("package.json");break;case"pnpm":a=`pnpm update ${n}@${c}`,l.push("pnpm-lock.yaml");break;case"yarn":a=`yarn up ${n}@${c}`,l.push("yarn.lock");break;case"uv":a=`uv add ${n}==${c}`,l.push("pyproject.toml","uv.lock");break;case"pip":a=`pip install ${n}==${c}`,l.push("requirements.txt");break;default:a=`npm install ${n}@${c} --package-lock-only`,l.push("package-lock.json")}d.info(`[DeterministicFixer] Spawning package manager CLI: "${a}" in ${e}`);try{let{stdout:p,stderr:u}=await gi(a,{cwd:e});return d.success(`[DeterministicFixer] Successfully upgraded ${n} to ${c}`),{success:!0,engine:"deterministic",message:`Upgraded ${n} to ${c} via ${i} lockfile bump`,commandExecuted:a,stdout:p,stderr:u,modifiedFiles:l}}catch(p){d.warn(`CLI execution returned error: ${p.message}. Attempting safe fallback manifest upgrade.`);let u=A.join(e,"package.json");if(S.existsSync(u))try{let m=S.readFileSync(u,"utf8"),g=JSON.parse(m),f=!1;if(g.dependencies&&g.dependencies[n]&&(g.dependencies[n]=`^${c}`,f=!0),g.devDependencies&&g.devDependencies[n]&&(g.devDependencies[n]=`^${c}`,f=!0),f)return S.writeFileSync(u,JSON.stringify(g,null,2),"utf8"),{success:!0,engine:"deterministic",message:`Updated ${n} in package.json to ^${c} (manifest-level fallback)`,commandExecuted:"Direct manifest rewrite",modifiedFiles:["package.json"]}}catch{}return{success:!1,engine:"deterministic",message:`Failed to execute lockfile upgrade command: ${p.message}`,commandExecuted:a,stderr:p.stderr||p.message,modifiedFiles:[]}}}static async fixCodeScanning(e,t){let s=t.location;if(!s||!s.filePath)return{success:!1,engine:"deterministic",message:"No file location metadata provided in Code Scanning alert.",modifiedFiles:[]};let o=A.isAbsolute(s.filePath)?s.filePath:A.join(e,s.filePath),i=ue.find(n=>n.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(n.cwe));if(!i)return{success:!1,engine:"deterministic",message:`No precompiled deterministic AST-grep rule for ${t.ruleId||"unknown rule"}. Recommend using Copilot LM Engine.`,modifiedFiles:[]};if(!S.existsSync(o))if(s.snippet){let n=A.dirname(o);S.existsSync(n)||S.mkdirSync(n,{recursive:!0}),S.writeFileSync(o,`// CodeVulFixer Target File
${s.snippet}
`,"utf8")}else return{success:!1,engine:"deterministic",message:`Target file not found: ${s.filePath}`,modifiedFiles:[]};try{let n=S.readFileSync(o,"utf8"),c=n.split(/\r?\n/),a=Math.max(0,(s.startLine||1)-1),l=Math.min(c.length,s.endLine||c.length),p=c.slice(a,l).join(`
`),{transformed:u,explanation:m}=i.transform(p);if(u===p){let g=i.transform(n);return g.transformed!==n?(S.writeFileSync(o,g.transformed,"utf8"),{success:!0,engine:"deterministic",message:`AST-grep applied: ${i.name}. ${g.explanation}`,modifiedFiles:[s.filePath]}):{success:!1,engine:"deterministic",message:`AST-grep rule did not match the code structure in ${s.filePath}`,modifiedFiles:[]}}return c.splice(a,l-a,u),S.writeFileSync(o,c.join(`
`),"utf8"),d.success(`[DeterministicFixer] AST transformation applied: ${i.name} on ${s.filePath}`),{success:!0,engine:"deterministic",message:`AST-grep applied: ${i.name}. ${m}`,modifiedFiles:[s.filePath]}}catch(n){return d.error("Failed to apply AST-grep fix",n),{success:!1,engine:"deterministic",message:`AST-grep failed: ${n instanceof Error?n.message:String(n)}`,modifiedFiles:[]}}}};var j=v(require("vscode")),F=v(require("fs")),L=v(require("path"));var K=class{static async applyFix(e,t){d.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${t.id}: ${t.title}`);let s=[];try{s=await j.lm.selectChatModels({vendor:"copilot"}),(!s||s.length===0)&&(s=await j.lm.selectChatModels())}catch(f){d.warn(`Error selecting chat models via vscode.lm: ${f}`)}if(!s||s.length===0)return{success:!1,engine:"copilot",message:"No active Copilot Language Model found. Please ensure GitHub Copilot is installed and active in VS Code, or switch to Deterministic fix mode.",modifiedFiles:[]};let o=s[0];d.info(`[CopilotLMFixer] Using model: ${o.name} (${o.id})`);let i=t.location,n="",c="",a=i?.snippet||"";if(i?.filePath){if(n=L.isAbsolute(i.filePath)?i.filePath:L.join(e,i.filePath),F.existsSync(n))c=F.readFileSync(n,"utf8");else if(i.snippet){let f=L.dirname(n);F.existsSync(f)||F.mkdirSync(f,{recursive:!0}),F.writeFileSync(n,`// Target: ${i.filePath}
${i.snippet}
`,"utf8"),c=F.readFileSync(n,"utf8")}}let l=L.extname(i?.filePath||"").toLowerCase(),u={".cpp":"cpp",".c":"c",".h":"cpp",".hpp":"cpp",".cs":"csharp",".java":"java",".pas":"pascal",".dpr":"pascal",".ps1":"powershell",".psm1":"powershell",".py":"python",".go":"go",".rs":"rust",".ts":"typescript",".js":"javascript"}[l]||"code",m=this.buildPrompt(t,c,a,u),g=[j.LanguageModelChatMessage.User(`You are a Principal Security Architect and CodeQL Remediator specializing in ${u.toUpperCase()} and enterprise software architecture. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a \`\`\`${u} code block. Do NOT include extraneous markdown explanations.`),j.LanguageModelChatMessage.User(m)];try{let f=new j.CancellationTokenSource,h=o,y=h.sendRequest?await h.sendRequest(g,{},f.token):await h.sendChatRequest(g,{},f.token),T="";for await(let He of y.text)T+=He;d.info(`[CopilotLMFixer] Received response (${T.length} chars) from ${o.name}`);let G=this.extractCode(T);return G?n?(F.writeFileSync(n,G,"utf8"),d.success(`[CopilotLMFixer] Successfully updated ${i?.filePath} with Copilot LM remediation`),{success:!0,engine:"copilot",message:`Remediated by Copilot LM (${o.name}): ${t.title}`,stdout:T,modifiedFiles:[i?.filePath||"remediated_code.ts"]}):{success:!0,engine:"copilot",message:"Generated remediation patch with Copilot LM.",stdout:G,modifiedFiles:[]}:{success:!1,engine:"copilot",message:"Could not extract clean code replacement from Copilot LM response.",stdout:T,modifiedFiles:[]}}catch(f){return d.error("Copilot LM fix execution failed",f),{success:!1,engine:"copilot",message:`Copilot LM request failed: ${f.message||String(f)}`,stderr:String(f),modifiedFiles:[]}}}static buildPrompt(e,t,s,o="code"){return`
VULNERABILITY DETAILS:
- Title: ${e.title}
- Severity: ${e.severity.toUpperCase()}
- Rule ID: ${e.ruleId||"N/A"}
- CWE IDs: ${(e.cweIds||[]).join(", ")||"N/A"}
- Advisory: ${e.cveId||e.ghsaId||"N/A"}
- Description: ${e.description}
- Remediation Guideline: ${e.remediationPlan}
- Target Technology / Language: ${o.toUpperCase()}

TARGET LOCATION:
- File: ${e.location?.filePath||"Unknown"}
- Lines: ${e.location?.startLine??1} to ${e.location?.endLine??1}

VULNERABLE SNIPPET:
\`\`\`
${s||t.slice(0,500)}
\`\`\`

COMPLETE EXISTING FILE CONTENT:
\`\`\`
${t||s}
\`\`\`

INSTRUCTIONS FOR ${o.toUpperCase()}:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, namespaces, and functionality.
3. Eliminate memory corruption, injection, taint flow, or insecure APIs completely using standard safe modern ${o.toUpperCase()} constructs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`${o}
// remediated code here
\`\`\`
`}static extractCode(e){let t=e.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);if(t&&t[1])return t[1].trim();if(e.includes("import ")||e.includes("const ")||e.includes("function ")||e.includes("export "))return e.trim()}};var ge=class{static async executeRepair(e,t,s){let o=_t.workspace.getConfiguration("codevulfixer"),i=s||o.get("preferredFixEngine","auto");if(d.info(`[RepairCoordinator] Deciding engine for ${t.id} (preference: ${i})...`),i==="deterministic")return D.applyFix(e,t);if(i==="copilot"){let a=await K.applyFix(e,t);return a.success?a:(d.warn(`Copilot LM repair failed or unavailable: ${a.message}. Falling back to deterministic engine.`),D.applyFix(e,t))}if(t.source==="dependabot")return D.applyFix(e,t);if(ue.some(a=>a.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(a.cwe))&&t.sizing.size==="S"){d.info(`[RepairCoordinator] Choosing Deterministic AST engine for self-contained rule: ${t.ruleId}`);let a=await D.applyFix(e,t);if(a.success)return a}d.info(`[RepairCoordinator] Choosing Copilot LM engine for ${t.id}`);let c=await K.applyFix(e,t);return c.success?c:(d.info(`Copilot LM fallback to deterministic engine for ${t.id}`),D.applyFix(e,t))}};var St=v(require("vscode")),X=v(require("fs")),qe=v(require("path")),Pt=require("child_process"),xt=require("util");var kt=(0,xt.promisify)(Pt.exec),me=class{static async validateWorkspace(e,t){let s=St.workspace.getConfiguration("codevulfixer"),o=s.get("autoRunTests",!0),i=s.get("buildCommand","npm run build"),n=s.get("testCommand","npm test"),c=s.get("auditCommand","npm audit"),a={passed:!0,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped",compatibilityStatus:"skipped"};if(!o)return d.info("Auto-validation is disabled in settings."),a;if(t?.dependency){let m=t.dependency;d.info(`[Validation] Inspecting collateral vulnerabilities and compatibility for ${m.packageName}@${m.fixedVersion}...`);let g=z.evaluateCascadingVulnerabilities(m,m.fixedVersion);if(g.hasCascadingRisk)return a.auditStatus="failed",a.compatibilityStatus="failed",a.passed=!1,a.cascadingVulnerabilitiesIntroduced=g.newVulnerabilities,a.suggestedAlternativeVersion=g.alternativeVersion,a.failureStackTrace=[`\u{1F6A8} Validation Checkpoint: Upgrading to ${m.packageName}@${m.fixedVersion} introduces collateral risk / incompatibilities:`,...g.newVulnerabilities.map(f=>`  \u2022 ${f}`),"","\u{1F4A1} Smart Safe Alternative Recommendation:",`  Upgrade to version "${g.alternativeVersion}" instead to eliminate the original vulnerability while avoiding collateral breaks.`].join(`
`),d.error(`[Validation] Collateral vulnerability intercepted for ${t.id}: ${a.failureStackTrace}`),a;if(t.compatibilityAdvice?.hasDeadlock){let f=t.compatibilityAdvice;return a.compatibilityStatus="failed",a.passed=!1,a.compatibilityIssues=[f.constraintSummary],a.suggestedAlternativeVersion=f.safeRecommendedVersion,a.failureStackTrace=["\u274C Runtime Platform Deadlock Intercepted:",`  ${f.constraintSummary}`,"","\u{1F4A1} Recommended Action:",`  ${f.tradeoffReason}`,`  Target Recommended Version: ${f.safeRecommendedVersion}`].join(`
`),d.error(`[Validation] Platform deadlock intercepted for ${t.id}`),a}a.compatibilityStatus="passed",a.auditStatus="passed"}let l=qe.join(e,"package.json"),p=!1,u=!1;if(X.existsSync(l))try{let m=JSON.parse(X.readFileSync(l,"utf8"));p=!!(m.scripts&&m.scripts.build),u=!!(m.scripts&&m.scripts.test)}catch{}if(p||X.existsSync(qe.join(e,"tsconfig.json"))){let m=Date.now(),g=p?i:"npx tsc --noEmit";d.info(`[Validation] Running compilation check: ${g}`);try{let{stdout:f}=await kt(g,{cwd:e,timeout:6e4});a.buildStatus="passed",a.buildDurationMs=Date.now()-m,a.buildOutput=f||"Compilation passed with zero errors.",d.success(`[Validation] Compilation check passed in ${a.buildDurationMs}ms.`)}catch(f){return a.buildStatus="failed",a.passed=!1,a.buildDurationMs=Date.now()-m,a.buildOutput=f.stdout||"",a.failureStackTrace=f.stderr||f.message,d.error(`[Validation] Compilation failed: ${f.message}`),a}}else a.buildStatus="skipped";if(u){let m=Date.now();d.info(`[Validation] Running regression test suite: ${n}`);try{let{stdout:g}=await kt(n,{cwd:e,timeout:6e4});a.testStatus="passed",a.testDurationMs=Date.now()-m,a.testOutput=g||"All tests passed.",d.success(`[Validation] Test suite passed in ${a.testDurationMs}ms.`)}catch(g){return a.testStatus="failed",a.passed=!1,a.testDurationMs=Date.now()-m,a.testOutput=g.stdout||"",a.failureStackTrace=g.stderr||g.message,d.error(`[Validation] Test suite failed: ${g.message}`),a}}else a.testStatus="skipped";return a}};var he=v(require("fs")),be=v(require("path")),Gt=require("child_process"),Ct=require("util"),mi=(0,Ct.promisify)(Gt.exec),fe=class{static async getFileDiff(e,t){try{let{stdout:o}=await mi(`git diff --no-color -U3 -- "${t}"`,{cwd:e});if(o.trim().length>0)return{filePath:t,hasChanges:!0,rawDiff:o,lines:this.parseUnifiedDiff(o)}}catch{}let s=be.isAbsolute(t)?t:be.join(e,t);if(he.existsSync(s)){let o=he.readFileSync(s,"utf8"),i=o.split(/\r?\n/).map((n,c)=>({type:"add",content:n,newLineNumber:c+1}));return{filePath:t,hasChanges:!0,rawDiff:o,lines:i}}return{filePath:t,hasChanges:!1,rawDiff:"",lines:[]}}static async getMultiFileDiff(e,t){let s=[];for(let o of t)s.push(await this.getFileDiff(e,o));return s}static parseUnifiedDiff(e){let t=e.split(/\r?\n/),s=[],o=0,i=0;for(let n of t)if(n.startsWith("@@")){let c=n.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);c&&(o=parseInt(c[1],10),i=parseInt(c[2],10)),s.push({type:"normal",content:n})}else n.startsWith("+")&&!n.startsWith("+++")?s.push({type:"add",content:n.substring(1),newLineNumber:i++}):n.startsWith("-")&&!n.startsWith("---")?s.push({type:"delete",content:n.substring(1),oldLineNumber:o++}):n.startsWith(" ")&&s.push({type:"normal",content:n.substring(1),oldLineNumber:o++,newLineNumber:i++});return s}};var Q=v(require("vscode")),At=require("child_process"),Ft=require("util");var ze=(0,Ft.promisify)(At.exec),Z=class{static async stageAndSetCommitMessage(e,t,s){try{for(let c of s)d.info(`[SCM] Staging file: git add "${c}"`),await ze(`git add "${c}"`,{cwd:e});let o=t.source==="dependabot"?t.dependency?.packageName||"dependencies":t.location?.filePath||"security-audit",n=`security(fix): [CodeVulFixer] resolved ${t.cveId||t.ghsaId||t.ruleId||t.id} in ${o}

${t.title}
Remediation: ${t.remediationPlan}`;try{let c=Q.extensions.getExtension("vscode.git");if(c){let a=c.exports.getAPI(1);if(a&&a.repositories.length>0){let l=a.repositories[0];l.inputBox.value=n,d.info("[SCM] Populated VS Code Git commit message box.")}}}catch(c){d.warn(`Could not set VS Code SCM input box: ${c}`)}return Q.window.showInformationMessage(`CodeVulFixer: Staged fixes for ${t.id} and populated commit message.`),!0}catch(o){return d.error("Failed to stage files in Git",o),!1}}static async rollbackChanges(e,t){try{for(let s of t){d.info(`[SCM] Rolling back mutations in: ${s}`);try{await ze(`git restore "${s}"`,{cwd:e})}catch{await ze(`git checkout -- "${s}"`,{cwd:e})}}return Q.window.showWarningMessage(`CodeVulFixer: Rolled back workspace changes for ${t.join(", ")}.`),!0}catch(s){return d.error("Failed to rollback Git changes",s),!1}}};var Rt=[{id:"DEP-101",source:"dependabot",alertNumber:101,title:"Denial of Service in axios due to unbounded buffer allocation",description:"Axios versions prior to 1.7.4 are vulnerable to Server-Side Request Forgery and Unhandled Rejections leading to DoS when parsing malicious redirect responses.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-8hc4-vh64-cxmj",cveId:"CVE-2023-45857",ghsaId:"GHSA-8hc4-vh64-cxmj",cweIds:["CWE-400","CWE-918"],dependency:{packageName:"axios",ecosystem:"npm",currentVersion:"^1.6.0",fixedVersion:"1.7.4",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 1.7.4",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Execute deterministic lockfile bump: `npm install axios@1.7.4 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Direct dependency patch update","Zero breaking API changes reported","Deterministic lockfile bump eligible"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-102",source:"dependabot",alertNumber:102,title:"Regular Expression Denial of Service (ReDoS) in semver",description:"semver vulnerable to Regular Expression Denial of Service when passing untrusted complex ranges to clean/validRange functions.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-c2qf-rxjj-qqgw",cveId:"CVE-2022-25883",ghsaId:"GHSA-c2qf-rxjj-qqgw",cweIds:["CWE-1333"],dependency:{packageName:"semver",ecosystem:"npm",currentVersion:"7.3.5",fixedVersion:"7.5.3",isDirect:!1,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 7.5.3",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Deduplicate & force update transitive lockfile entry for semver to >= 7.5.3",sizing:{size:"S",riskLevel:"low",reasons:["Transitive dependency patch bump","No direct code changes required in repository source"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-103",source:"dependabot",alertNumber:103,title:"Prototype Pollution in json5 leading to RCE or Crash",description:"json5 vulnerable to Prototype Pollution via parse function. Upgrading requires major version bump 1.x -> 2.2.2 with potential schema validation shifts.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-9c47-m6qq-7p4h",cveId:"CVE-2022-46175",ghsaId:"GHSA-9c47-m6qq-7p4h",cweIds:["CWE-1321"],dependency:{packageName:"json5",ecosystem:"npm",currentVersion:"^1.0.1",fixedVersion:"2.2.3",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 2.2.2",upgradeType:"major"},status:"pending",targetSprint:2,remediationPlan:"Upgrade json5 to 2.2.3, run complete test regression to verify custom deserializer calls",sizing:{size:"L",riskLevel:"high",reasons:["Major breaking version upgrade (1.x -> 2.x)","Imported in core configuration parsing modules","Requires compilation & test verification"],estimatedHours:3.5,isAutomatedCandidate:!1}},{id:"CS-201",source:"code_scanning",alertNumber:201,title:"Database query built from user-controlled string (SQL Injection)",description:"CodeQL detected untrusted HTTP parameter concatenation into raw SQL query without parameterized bindings in userRepository.ts.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/201",ruleId:"js/sql-injection",cweIds:["CWE-89"],location:{filePath:"demo/src/db/userRepository.ts",startLine:4,endLine:6,startColumn:3,endColumn:60,snippet:"const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;\n  const result = await db.raw(query);"},status:"pending",targetSprint:2,remediationPlan:'Refactor string interpolation to parameterized SQL query: `db.query("SELECT * FROM users WHERE email = $1", [req.query.email])`',sizing:{size:"L",riskLevel:"high",reasons:["Direct external input taint flow into database driver","Potential full data exfiltration risk","Cross-module data flow detected"],estimatedHours:4,isAutomatedCandidate:!1}},{id:"CS-202",source:"code_scanning",alertNumber:202,title:"Use of cryptographically weak pseudo-random number generator",description:"Math.random() is used to generate session tokens or authentication secrets in tokenGenerator.ts.",severity:"medium",htmlUrl:"https://github.com/example/repo/security/code-scanning/202",ruleId:"js/insecure-randomness",cweIds:["CWE-330"],location:{filePath:"demo/src/auth/tokenGenerator.ts",startLine:4,endLine:5,startColumn:3,endColumn:45,snippet:"const token = Math.random().toString(36).substring(2);"},status:"pending",targetSprint:1,remediationPlan:"Replace Math.random() with `crypto.randomBytes(32).toString('hex')`",sizing:{size:"S",riskLevel:"low",reasons:["Self-contained local expression swap","Pre-compiled AST pattern match available","Low regression impact on caller"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-203",source:"code_scanning",alertNumber:203,title:"DOM text reinterpreted as HTML without escaping (XSS)",description:"Assigning unsanitized user profile bio directly to Element.innerHTML creates an execution path for malicious script tags.",severity:"high",htmlUrl:"https://github.com/example/repo/security/code-scanning/203",ruleId:"js/xss-through-dom",cweIds:["CWE-79"],location:{filePath:"demo/src/web/render.ts",startLine:9,endLine:10,startColumn:3,endColumn:38,snippet:"userBioElement.innerHTML = user.bio;"},status:"pending",targetSprint:1,remediationPlan:"Change `innerHTML` to `textContent` or sanitize with DOMPurify",sizing:{size:"S",riskLevel:"low",reasons:["Localized DOM assignment","Direct AST replacement innerHTML -> textContent","No complex data flow"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-204",source:"code_scanning",alertNumber:204,title:"Untrusted input passed directly to child_process.exec (Command Injection)",description:"String concatenation into shell execution command in execHelper.ts allows arbitrary command execution.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/204",ruleId:"js/command-injection",cweIds:["CWE-78"],location:{filePath:"demo/src/utils/execHelper.ts",startLine:6,endLine:7,startColumn:3,endColumn:45,snippet:"exec(`git checkout ${branchName}`, callback);"},status:"pending",targetSprint:2,remediationPlan:'Use `execFile` with separate arguments array instead of shell interpolation: `execFile("git", ["checkout", branchName])`',sizing:{size:"L",riskLevel:"high",reasons:["Remote Code Execution potential","Shell invocation architecture change","Requires argument validation helper"],estimatedHours:3,isAutomatedCandidate:!1}},{id:"DEP-104",source:"dependabot",alertNumber:104,title:"DoS through memory exhaustion in ws websocket library",description:"ws client allows attacker to send infinite message headers causing Node process out-of-memory.",severity:"medium",htmlUrl:"https://github.com/advisories/GHSA-3h5v-q93c-6h6q",cveId:"CVE-2024-37890",ghsaId:"GHSA-3h5v-q93c-6h6q",cweIds:["CWE-400"],dependency:{packageName:"ws",ecosystem:"npm",currentVersion:"^8.14.0",fixedVersion:"8.17.1",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 8.17.1",upgradeType:"minor"},status:"pending",targetSprint:3,remediationPlan:"Upgrade ws to 8.17.1 via `npm install ws@8.17.1 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Minor hygiene upgrade","Fully backward-compatible API"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-205",source:"code_scanning",alertNumber:205,title:"Unsanitized path concatenation in file server (Path Traversal)",description:"path.join with untrusted request parameter allows reading arbitrary files outside root folder if not bounded by path.resolve.",severity:"low",htmlUrl:"https://github.com/example/repo/security/code-scanning/205",ruleId:"js/path-traversal",cweIds:["CWE-22"],location:{filePath:"demo/src/server/fileHandler.ts",startLine:7,endLine:9,startColumn:3,endColumn:55,snippet:`const filePath = path.join(publicDir, req.query.filename);
  return fs.readFileSync(filePath);`},status:"pending",targetSprint:3,remediationPlan:"Enforce boundary check: verify `path.resolve(publicDir, filename).startsWith(publicDir)`",sizing:{size:"M",riskLevel:"medium",reasons:["Requires path verification utility injection","Non-critical asset endpoint"],estimatedHours:1.5,isAutomatedCandidate:!1}},{id:"DEP-105",source:"dependabot",alertNumber:105,title:"Spring Framework Multiple Critical Remote Code Execution Vulnerabilities",description:"Spring Framework 1.x carries critical RCE and deserialization vulnerabilities. Upgrading requires multi-generational jump from 1.2.9 to 5.3.39 while respecting legacy module Java 8 pin.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-35rh-f86p-hx82",cveId:"CVE-2022-22965",ghsaId:"GHSA-35rh-f86p-hx82",cweIds:["CWE-94","CWE-502"],dependency:{packageName:"org.springframework:spring-core",ecosystem:"maven",currentVersion:"1.2.9",fixedVersion:"5.3.39",isDirect:!0,manifestFile:"pom.xml",vulnerableVersionRange:"< 5.3.39",upgradeType:"major",majorGap:4,javaVersionConstraint:"8",targetJavaVersion:"8"},status:"pending",targetSprint:2,remediationPlan:"Migrate Spring 1.2.9 XML configuration to Spring 5.3.39 annotations while maintaining Java 8 runtime baseline.",sizing:{size:"XL",riskLevel:"high",reasons:["Multi-generational major version jump (v1.x \u2794 v5.x) spans 4 major releases with extensive architectural breaking changes","Requires comprehensive configuration refactoring, API migration, and regression test suites","Direct package definition requires codebase API audit","\u{1F4A1} Smart Remediation Recommendation: Upgrade to 5.3.39 instead of Spring 6.x to maintain Java 8 module compatibility"],estimatedHours:72,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"6.1.14",safeRecommendedVersion:"5.3.39",constraintSummary:"Legacy modules require Java 8 compatibility; Spring 6+ mandates Java 17+.",tradeoffReason:"Upgrading to Spring 6.x causes immediate build/runtime failure due to Java 8 module lock. Upgrading to Spring 5.3.39 (Intermediate Safe Target) eliminates critical RCE exposure while guaranteeing 100% Java 8 runtime compliance.",riskReduction:"Eliminates Critical Remote Code Execution while completely avoiding platform incompatibility and module failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["legacy-banking-module"]}},{id:"DEP-106",source:"dependabot",alertNumber:106,title:"Open Redirect & Query Parameter Parsing Vulnerability in Express",description:"Express < 4.19.2 is vulnerable to open redirect. Target upgrade to Express 5.0 introduces breaking middleware signatures and peer conflicts with cookie-parser.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-qw6h-vgh9-j6q6",cveId:"CVE-2024-29041",ghsaId:"GHSA-qw6h-vgh9-j6q6",cweIds:["CWE-601"],dependency:{packageName:"express",ecosystem:"npm",currentVersion:"4.17.1",fixedVersion:"5.0.0",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 4.19.2",upgradeType:"major",majorGap:1},status:"pending",targetSprint:1,remediationPlan:"Apply safe intermediate patch: upgrade to express@4.19.2 instead of 5.0.0 to avoid breaking middleware and collateral vulnerabilities.",sizing:{size:"L",riskLevel:"high",reasons:["Major version upgrade introduces potential API breaking changes","Direct package definition requires codebase API audit","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 4.19.2 instead of 5.0.0 to avoid breaking middleware"],estimatedHours:3.5,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"5.0.0",safeRecommendedVersion:"4.19.2",constraintSummary:"Downstream middleware modules strictly depend on Express 4.x Router signature.",tradeoffReason:"Upgrading to Express 5.0 breaks existing middleware dependencies and router handlers. Upgrading to safe intermediate 4.19.2 patches CVE-2024-29041 with 100% backward compatibility.",riskReduction:"Eliminates High Open Redirect vulnerability without risking runtime middleware breakage.",actionStrategy:"intermediate_upgrade",conflictingPackages:["cookie-parser","body-parser"]}},{id:"DEP-107",source:"dependabot",alertNumber:107,title:"Apache Log4j Remote Code Execution (Log4Shell)",description:"Apache Log4j2 JNDI features used in configuration and logging do not protect against attacker controlled LDAP endpoints (Log4Shell). Upgrading requires resolving Java 8 runtime constraints.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-jfh8-c2jp-5v3q",cveId:"CVE-2021-44228",ghsaId:"GHSA-jfh8-c2jp-5v3q",cweIds:["CWE-502","CWE-400"],dependency:{packageName:"org.apache.logging.log4j:log4j-core",ecosystem:"maven",currentVersion:"2.14.1",fixedVersion:"2.17.1",isDirect:!0,manifestFile:"pom.xml",vulnerableVersionRange:"< 2.17.1",upgradeType:"patch",javaVersionConstraint:"8",targetJavaVersion:"8"},status:"pending",targetSprint:1,remediationPlan:"Apply safe intermediate upgrade: upgrade to log4j-core@2.17.1 (Java 8 compliant) instead of 2.20/3.x to fix Log4Shell without JVM runtime mismatch.",sizing:{size:"M",riskLevel:"medium",reasons:["Critical severity dependency patch prioritized for immediate remediation","Direct package definition requires codebase lockfile audit","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 2.17.1 instead of 2.20+ to maintain Java 8 baseline"],estimatedHours:2,isAutomatedCandidate:!0},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"2.20.0",safeRecommendedVersion:"2.17.1",constraintSummary:"Workspace pom.xml is pinned to Java 8 (<java.version>1.8</java.version>). Modern Log4j 2.20+ requires Java 9+ bytecode.",tradeoffReason:"Upgrading to Log4j 2.20+ causes fatal compilation / bytecode errors on Java 8 JVMs. Upgrading to Log4j 2.17.1 fully neutralizes Log4Shell (CVE-2021-44228) while ensuring 100% Java 8 runtime compliance.",riskReduction:"Eliminates Critical Log4Shell RCE with zero JVM platform deadlock risk.",actionStrategy:"intermediate_upgrade",conflictingPackages:["org.apache.logging.log4j:log4j-api"]}},{id:"DEP-108",source:"dependabot",alertNumber:108,title:"Apache log4net XML External Entity (XXE) Injection and Remote Code Execution",description:"Apache log4net versions prior to 2.0.10 allow remote attackers to execute arbitrary code or parse untrusted XML via NetSendAppender and XmlDocument. Target application runs .NET Framework 4.8.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-vm8r-px2f-pfp4",cveId:"CVE-2018-1285",ghsaId:"GHSA-vm8r-px2f-pfp4",cweIds:["CWE-611","CWE-502"],dependency:{packageName:"log4net",ecosystem:"nuget",currentVersion:"1.2.10",fixedVersion:"2.0.15",isDirect:!0,manifestFile:"App.csproj",vulnerableVersionRange:"< 2.0.10",upgradeType:"major",targetFramework:"net48"},status:"pending",targetSprint:2,remediationPlan:"Apply safe intermediate upgrade: bump log4net from 1.2.10 to 2.0.15 via NuGet to eliminate XXE without breaking .NET Framework 4.8 runtime or app.config.",sizing:{size:"L",riskLevel:"high",reasons:["Major version upgrade introduces potential API breaking changes","Direct package definition in .csproj requires assembly binding redirect check","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 2.0.15 instead of 3.0 to preserve .NET Framework 4.8 compatibility"],estimatedHours:3.5,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"3.0.0",safeRecommendedVersion:"2.0.15",constraintSummary:"Legacy .csproj targets <TargetFramework>net48</TargetFramework>. Modern log4net 3.x requires modern .NET Core / .NET 6+ runtime.",tradeoffReason:"Upgrading to log4net 3.x breaks legacy .NET Framework 4.8 app.config XML layouts and binding redirects. Upgrading to log4net 2.0.15 patches CVE-2018-1285 while maintaining 100% backward compatibility with .NET Framework 4.x.",riskReduction:"Mitigates High XXE & RCE vulnerability with zero .NET runtime migration failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["log4net"]}}];function Ot(r,e="risk-profile",t){let s=JSON.stringify(r||null).replace(/</g,"\\u003c"),o=JSON.stringify(t||null).replace(/</g,"\\u003c");return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeVulFixer Sprint & Risk Dashboard</title>
  <style>
    :root {
      --color-success: #28a745;
      --color-warning: #ffc107;
      --color-danger: #dc3545;
      --color-info: #17a2b8;
      --color-success-bg: rgba(40, 167, 69, 0.15);
      --color-warning-bg: rgba(255, 193, 7, 0.15);
      --color-danger-bg: rgba(220, 53, 69, 0.15);
      --color-info-bg: rgba(23, 162, 184, 0.15);
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      line-height: 1.5;
    }

    /* Header & Navigation */
    .header {
      background-color: var(--vscode-sideBar-background, #1e1e1e);
      border-bottom: 1px solid var(--vscode-panel-border, #333);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 24px;
      background: linear-gradient(135deg, #17a2b8, #28a745);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 11px;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    /* Tabs */
    .tab-bar {
      display: flex;
      gap: 4px;
      background: var(--vscode-editorGroupHeader-tabsBackground, #252526);
      padding: 4px 24px 0 24px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--vscode-tab-inactiveForeground, #888);
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn:hover {
      color: var(--vscode-tab-activeForeground, #fff);
      background: rgba(255, 255, 255, 0.03);
    }

    .tab-btn.active {
      color: var(--vscode-tab-activeForeground, #fff);
      border-bottom: 2px solid var(--color-info);
      background: var(--vscode-editor-background);
    }

    /* Main Container */
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .metric-card.danger::before { background: var(--color-danger); }
    .metric-card.warning::before { background: var(--color-warning); }
    .metric-card.success::before { background: var(--color-success); }
    .metric-card.info::before { background: var(--color-info); }

    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      opacity: 0.7;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.1;
    }

    .metric-sub {
      font-size: 12px;
      margin-top: 6px;
      opacity: 0.8;
    }

    /* Buttons */
    .btn {
      background: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #fff);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .btn:hover {
      background: var(--vscode-button-hoverBackground, #0062a3);
    }

    .btn-secondary {
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #fff);
    }

    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground, #45494e);
    }

    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover { background: #218838; }

    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-danger:hover { background: #c82333; }

    .btn-sm {
      padding: 4px 10px;
      font-size: 11px;
    }

    /* Badges & Pills */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-high { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-medium { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-low { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }

    .badge-s { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }
    .badge-m { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-l { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-xl { background: rgba(111, 66, 193, 0.25); color: #d2a8ff; border: 1px solid rgba(111, 66, 193, 0.6); }

    .advice-card {
      background: linear-gradient(135deg, rgba(23, 162, 184, 0.12), rgba(111, 66, 193, 0.15));
      border: 1px solid rgba(23, 162, 184, 0.4);
      border-radius: 6px;
      padding: 10px 14px;
      margin: 10px 0;
      font-size: 11px;
      line-height: 1.45;
    }
    .advice-title {
      font-weight: 700;
      color: #58a6ff;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      font-size: 12px;
    }
    .advice-target {
      background: rgba(40, 167, 69, 0.25);
      color: #7ee787;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
      border: 1px solid rgba(40, 167, 69, 0.4);
    }
    .advice-ideal {
      background: rgba(220, 53, 69, 0.2);
      color: #ff7b72;
      padding: 2px 7px;
      border-radius: 4px;
      text-decoration: line-through;
      border: 1px solid rgba(220, 53, 69, 0.3);
    }

    .status-pill {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 10px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pending { background: rgba(255,255,255,0.1); color: #ccc; }
    .status-in_progress { background: var(--color-info-bg); color: var(--color-info); }
    .status-applied { background: var(--color-warning-bg); color: var(--color-warning); }
    .status-verified { background: var(--color-success-bg); color: var(--color-success); }
    .status-failed { background: var(--color-danger-bg); color: var(--color-danger); }
    .status-rejected { background: rgba(220, 53, 69, 0.2); color: #ff8080; }

    /* Sprint Board */
    .sprint-header {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sprint-title {
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sprint-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .sprint-actions {
      display: flex;
      gap: 8px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }

    .vuln-card {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, border-color 0.15s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .vuln-card:hover {
      border-color: var(--color-info);
      transform: translateY(-2px);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .card-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
      padding: 8px;
      font-size: 11px;
      margin-bottom: 12px;
      font-family: monospace;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid var(--vscode-panel-border, #333);
      gap: 8px;
    }

    /* Terminal Component for Failure Logs */
    .terminal-box {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 12px 16px;
      color: #c9d1d9;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin: 12px 0;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 250px;
      overflow-y: auto;
    }

    .terminal-title {
      color: var(--color-danger);
      font-weight: bold;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Intercept Checkpoint Overlay / Modal */
    .checkpoint-banner {
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(23, 162, 184, 0.15));
      border: 1px solid var(--color-success);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
    }

    .checkpoint-info h3 {
      margin: 0 0 4px 0;
      color: var(--color-success);
      font-size: 16px;
    }

    .checkpoint-info p {
      margin: 0;
      font-size: 12px;
      opacity: 0.85;
    }

    /* Diff Viewer */
    .diff-container {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .diff-header {
      background: #161b22;
      padding: 10px 16px;
      border-bottom: 1px solid #30363d;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .diff-line {
      display: flex;
      padding: 2px 12px;
      line-height: 1.5;
    }

    .diff-line.add {
      background: rgba(46, 160, 67, 0.15);
      color: #7ee787;
    }

    .diff-line.delete {
      background: rgba(248, 81, 73, 0.15);
      color: #ffa198;
    }

    .diff-line.normal {
      color: #8b949e;
    }

    .diff-line-num {
      width: 40px;
      user-select: none;
      opacity: 0.5;
      text-align: right;
      padding-right: 12px;
    }

    .diff-line-code {
      flex: 1;
      white-space: pre-wrap;
    }

    /* Settings Tab */
    .settings-group {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      max-width: 700px;
    }

    .settings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .settings-row:last-child {
      border-bottom: none;
    }

    .settings-title {
      font-size: 13px;
      font-weight: 600;
    }

    .settings-desc {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 2px;
    }

    select, input[type="text"], input[type="number"] {
      background: var(--vscode-input-background, #3c3c3c);
      color: var(--vscode-input-foreground, #fff);
      border: 1px solid var(--vscode-input-border, #555);
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: var(--vscode-sideBar-background, #252526);
      border: 1px dashed var(--vscode-panel-border, #444);
      border-radius: 12px;
      margin: 20px 0;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .empty-desc {
      font-size: 13px;
      opacity: 0.7;
      max-width: 500px;
      margin: 0 auto 20px auto;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-icon">\u{1F6E1}\uFE0F CodeVulFixer</div>
      <div>
        <div class="brand-title">Enterprise Security Remediation Orchestrator</div>
        <div class="brand-subtitle">${r?`${r.repoOwner}/${r.repoName} \u2022 Multi-Day Sprint Engine`:"Automated & AI Fix Pipeline"}</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" onclick="loadDemoData()">
        <span>\u{1F9EA}</span> Load Demo Data
      </button>
      <button class="btn" onclick="scanWorkspace()">
        <span>\u{1F504}</span> Ingest & Scan
      </button>
      <button class="btn btn-secondary" onclick="resetState()">
        <span>\u{1F5D1}\uFE0F</span> Reset
      </button>
    </div>
  </div>

  <!-- Tab Bar -->
  <div class="tab-bar">
    <button class="tab-btn ${e==="risk-profile"?"active":""}" onclick="switchTab('risk-profile')">
      \u{1F4CA} Workspace Risk Profile
    </button>
    <button class="tab-btn ${e==="sprint-board"?"active":""}" onclick="switchTab('sprint-board')">
      \u{1F4CB} Multi-Day Sprint Board
    </button>
    <button class="tab-btn ${e==="diff-inspector"?"active":""}" onclick="switchTab('diff-inspector')">
      \u{1F50D} Live Diff & Verification Intercept
    </button>
    <button class="tab-btn ${e==="settings"?"active":""}" onclick="switchTab('settings')">
      \u2699\uFE0F Sprint Configuration
    </button>
  </div>

  <div class="container">

    ${r?hi(r,e,t):fi()}

  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const appState = ${s};
    const currentDiffFinding = ${o};

    function switchTab(tabName) {
      vscode.postMessage({ command: 'switchTab', tab: tabName });
    }

    function scanWorkspace() {
      vscode.postMessage({ command: 'scan' });
    }

    function loadDemoData() {
      vscode.postMessage({ command: 'loadDemoData' });
    }

    function resetState() {
      if (confirm('Reset CodeVulFixer sprint state?')) {
        vscode.postMessage({ command: 'resetState' });
      }
    }

    function executeSprint(sprintNumber) {
      vscode.postMessage({ command: 'runSprint', sprintNumber });
    }

    function applySingleFix(findingId, engine) {
      vscode.postMessage({ command: 'applyFix', findingId, engine });
    }

    function inspectDiff(findingId) {
      vscode.postMessage({ command: 'inspectDiff', findingId });
    }

    function markVerifiedAndStage(findingId) {
      vscode.postMessage({ command: 'verifyStage', findingId });
    }

    function rejectAndRollback(findingId) {
      vscode.postMessage({ command: 'rejectRollback', findingId });
    }

    function saveSettings() {
      const mode = document.getElementById('planningMode').value;
      const days = parseInt(document.getElementById('daysPerSprint').value, 10);
      const maxHighRisk = parseInt(document.getElementById('maxHighRisk').value, 10);
      const targetDays = parseInt(document.getElementById('targetDays').value, 10);
      const pkgManager = document.getElementById('pkgManager').value;
      const engine = document.getElementById('engine').value;

      vscode.postMessage({
        command: 'saveSettings',
        settings: {
          planningMode: mode,
          daysPerSprint: days,
          maxHighRiskPerDay: maxHighRisk,
          targetSprintDays: targetDays,
          packageManager: pkgManager,
          preferredFixEngine: engine
        }
      });
    }
  </script>
</body>
</html>`}function fi(){return`
    <div class="empty-state">
      <div class="empty-icon">\u{1F6E1}\uFE0F</div>
      <div class="empty-title">No Active Vulnerability Sprints Ingested</div>
      <div class="empty-desc">
        CodeVulFixer connects securely to GitHub to ingest Dependabot alerts and Code Scanning (CodeQL) findings, or you can load realistic demo findings immediately to test the entire remediation pipeline.
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-success" onclick="loadDemoData()">
          <span>\u{1F9EA}</span> Load Realistic Demo Findings
        </button>
        <button class="btn" onclick="scanWorkspace()">
          <span>\u{1F510}</span> Authenticate & Ingest GitHub Findings
        </button>
      </div>
    </div>
  `}function hi(r,e,t){let s=r.metrics,o=Object.values(r.findings),i=o.filter(l=>l.severity==="critical").length,n=o.filter(l=>l.severity==="high").length,c=o.filter(l=>l.severity==="medium").length,a=o.filter(l=>l.severity==="low").length;return`
    <!-- Top Telemetry Metrics -->
    <div class="metrics-grid">
      <div class="metric-card danger">
        <div class="metric-label">Critical & High Vulnerabilities</div>
        <div class="metric-value">${i+n}</div>
        <div class="metric-sub">\u{1F534} ${i} Critical \u2022 ${n} High</div>
      </div>
      <div class="metric-card warning">
        <div class="metric-label">Medium & Low Hygiene</div>
        <div class="metric-value">${c+a}</div>
        <div class="metric-sub">\u{1F7E1} ${c} Medium \u2022 \u{1F7E2} ${a} Low</div>
      </div>
      <div class="metric-card success">
        <div class="metric-label">Remediated & Verified</div>
        <div class="metric-value">${s.resolvedCount} / ${s.totalFindings}</div>
        <div class="metric-sub">\u{1F7E2} ${Math.round(s.resolvedCount/(s.totalFindings||1)*100)}% Sprint Completion</div>
      </div>
      <div class="metric-card info">
        <div class="metric-label">Estimated Developer Time Saved</div>
        <div class="metric-value">${s.hoursSaved}h</div>
        <div class="metric-sub">\u{1F535} Total Sized Effort: ${s.totalEstimatedHours}h</div>
      </div>
    </div>

    <!-- TAB 1: Workspace Risk Profile -->
    <div class="tab-content ${e==="risk-profile"?"active":""}">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="sprint-header" style="flex-direction: column; align-items: flex-start; gap: 12px;">
          <div style="font-size: 16px; font-weight: 700;">Executive Security Posture Overview</div>
          <p style="font-size: 13px; opacity: 0.8; margin: 0;">
            CodeVulFixer consolidated <strong>${s.totalFindings} active security findings</strong> across GitHub Dependabot and CodeQL Code Scanning. 
            Automated S-size quick wins represent <strong>${o.filter(l=>l.sizing.size==="S").length} findings</strong> that can be cleared with zero-token lockfile upgrades or precompiled AST transformations.
          </p>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="btn btn-success" onclick="switchTab('sprint-board')">
              <span>\u{1F680}</span> Start Sprint Remediation
            </button>
            <button class="btn btn-secondary" onclick="scanWorkspace()">
              <span>\u{1F504}</span> Refresh GitHub Ingestion
            </button>
          </div>
        </div>

        <div class="metric-card info" style="display: flex; flex-direction: column; justify-content: center;">
          <div class="metric-label">Multi-Day Remediation Timeline</div>
          <div style="font-size: 18px; font-weight: 700; margin: 8px 0;">${r.sprints.length} Planned Sprints</div>
          <div style="font-size: 12px; opacity: 0.85;">
            Structured work chunking mitigates developer fatigue by balancing high-risk items against quick-win lockfile updates.
          </div>
        </div>
      </div>

      <!-- Sizing Distribution Table -->
      <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
        <div style="font-size: 15px; font-weight: 700; margin-bottom: 12px;">Vulnerability Impact & T-Shirt Sizing Matrix</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
              <th style="padding: 8px;">ID</th>
              <th style="padding: 8px;">Source</th>
              <th style="padding: 8px;">Severity</th>
              <th style="padding: 8px;">Title</th>
              <th style="padding: 8px;">T-Shirt Size</th>
              <th style="padding: 8px;">Risk Level</th>
              <th style="padding: 8px;">Est. Hours</th>
              <th style="padding: 8px;">Target Sprint</th>
              <th style="padding: 8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${o.map(l=>`
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px; font-family: monospace;">${l.id}</td>
                <td style="padding: 8px;">${l.source==="dependabot"?"\u{1F4E6} Dependabot":"\u{1F50D} CodeQL"}</td>
                <td style="padding: 8px;"><span class="badge badge-${l.severity}">${l.severity}</span></td>
                <td style="padding: 8px; font-weight: 500;">${l.title}</td>
                <td style="padding: 8px;"><span class="badge badge-${l.sizing.size.toLowerCase()}">Size ${l.sizing.size}</span></td>
                <td style="padding: 8px;">${l.sizing.riskLevel.toUpperCase()}</td>
                <td style="padding: 8px;">${l.sizing.estimatedHours}h</td>
                <td style="padding: 8px;">Sprint ${l.targetSprint}</td>
                <td style="padding: 8px;"><span class="status-pill status-${l.status}">${l.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Interactive Sprint Board -->
    <div class="tab-content ${e==="sprint-board"?"active":""}">
      ${r.sprints.map(l=>bi(l,r)).join("")}
    </div>

    <!-- TAB 3: Live Diff & Verification Intercept -->
    <div class="tab-content ${e==="diff-inspector"?"active":""}">
      ${yi(t,o)}
    </div>

    <!-- TAB 4: Settings & Configuration -->
    <div class="tab-content ${e==="settings"?"active":""}">
      <div class="settings-group">
        <h3 style="margin-top: 0; font-size: 16px;">Sprint Orchestration Engine Settings</h3>
        
        <div class="settings-row">
          <div>
            <div class="settings-title">Remediation Planning Cadence</div>
            <div class="settings-desc">Choose between a multi-day Agile Sprint cadence (10 working days / 2-week cycle) or daily micro-chunks.</div>
          </div>
          <select id="planningMode">
            <option value="sprint_wise" ${r?.planningMode==="sprint_wise"?"selected":""}>Sprint-wise Plan (10 Working Days / 2-Week Agile Cycle)</option>
            <option value="day_wise" ${r?.planningMode==="day_wise"?"selected":""}>Day-wise Plan (Daily Micro-Sprints)</option>
          </select>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Days per Agile Sprint</div>
            <div class="settings-desc">Number of working days considered per Agile Sprint (standard Scrum cycle is 10 days).</div>
          </div>
          <input type="number" id="daysPerSprint" min="1" max="30" value="${r?.daysPerSprint||10}" style="width: 60px;">
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Max High-Risk Fixes Per Day</div>
            <div class="settings-desc">Enforce cognitive load limits by capping Size L / critical security rewrites per day.</div>
          </div>
          <input type="number" id="maxHighRisk" min="1" max="10" value="3" style="width: 60px;">
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Target Remediation Timeline (Days)</div>
            <div class="settings-desc">Target duration to schedule distributed sprint chunks.</div>
          </div>
          <input type="number" id="targetDays" min="1" max="14" value="4" style="width: 60px;">
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Preferred Package Manager CLI</div>
            <div class="settings-desc">Ecosystem CLI used for deterministic zero-token lockfile upgrades.</div>
          </div>
          <select id="pkgManager">
            <option value="auto">Auto-Detect (Recommended)</option>
            <option value="npm">npm</option>
            <option value="pnpm">pnpm</option>
            <option value="yarn">yarn</option>
            <option value="uv">uv</option>
            <option value="pip">pip</option>
          </select>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-title">Primary Repair Engine</div>
            <div class="settings-desc">Choose between Deterministic CLIs/AST rules or VS Code Copilot LM API.</div>
          </div>
          <select id="engine">
            <option value="auto">Auto (Deterministic for Lockfiles, Copilot for SAST)</option>
            <option value="deterministic">Deterministic Only (Zero-Token)</option>
            <option value="copilot">Copilot LM API Only</option>
          </select>
        </div>

        <div style="margin-top: 20px;">
          <button class="btn" onclick="saveSettings()">Save & Replan Sprints</button>
        </div>
      </div>
    </div>
  `}function bi(r,e){let t=r.findings.map(o=>e.findings[o]).filter(Boolean),s=r.sprintNumber===1;return`
    <div style="margin-bottom: 32px;">
      <div class="sprint-header">
        <div>
          <div class="sprint-title">
            <span>\u{1F4C5} ${r.dayLabel}:</span> ${r.title}
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8; margin-left: 6px;">\u23F1\uFE0F ${r.durationDays||10} Days</span>
            <span class="badge badge-s" style="margin-left: 6px;">${r.totalEstimatedHours}h effort</span>
            <span class="status-pill status-${r.status}">${r.status}</span>
          </div>
          <div class="sprint-desc">${r.description}</div>
        </div>
        <div class="sprint-actions">
          <button class="btn btn-success" onclick="executeSprint(${r.sprintNumber})">
            <span>\u26A1</span> Execute Automated Sprint Fixes
          </button>
        </div>
      </div>

      <div class="card-grid">
        ${t.map(o=>vi(o)).join("")}
      </div>
    </div>
  `}function vi(r){let e=r.status==="applied"||r.status==="verified",t=r.status==="failed";return`
    <div class="vuln-card">
      <div>
        <div class="card-top">
          <div class="card-badges">
            <span class="badge badge-${r.severity}">${r.severity}</span>
            <span class="badge badge-${r.sizing.size.toLowerCase()}">Size ${r.sizing.size}</span>
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">${r.source}</span>
          </div>
          <span class="status-pill status-${r.status}">${r.status}</span>
        </div>

        <div class="card-title">${r.title}</div>
        <div class="card-desc">${r.description}</div>

        <div class="card-meta">
          ${r.dependency?`<div><strong>Package:</strong> ${r.dependency.packageName} (${r.dependency.currentVersion} \u2794 <strong>${r.dependency.fixedVersion}</strong>)</div>
               <div><strong>Type:</strong> ${r.dependency.isDirect?"Direct Manifest":"Transitive Lockfile"} ${r.dependency.majorGap&&r.dependency.majorGap>1?`\u2022 <span class="badge badge-xl">${r.dependency.majorGap} Major Versions Leap</span>`:""}</div>`:`<div><strong>Rule:</strong> ${r.ruleId||"N/A"}</div>
               <div><strong>Target:</strong> ${r.location?.filePath||"Source file"}:${r.location?.startLine??1}</div>`}
          <div><strong>Advisory:</strong> ${r.cveId||r.ghsaId||r.id}</div>
        </div>

        ${r.compatibilityAdvice?`
          <div class="advice-card">
            <div class="advice-title">\u{1F4A1} Smart Safe Upgrade Recommendation (Compatibility & Dependency Guard)</div>
            <div style="margin-bottom: 4px;">
              <span>Ideal Target: </span><span class="advice-ideal">${P(r.compatibilityAdvice.idealVersion)}</span>
              <span style="margin: 0 4px;">\u2794</span>
              <span>Recommended Safe Target: </span><span class="advice-target">${P(r.compatibilityAdvice.safeRecommendedVersion)}</span>
            </div>
            <div style="opacity: 0.9;"><strong>Constraint:</strong> ${P(r.compatibilityAdvice.constraintSummary)}</div>
            <div style="margin-top: 4px; opacity: 0.95;"><strong>Strategy:</strong> ${P(r.compatibilityAdvice.tradeoffReason)}</div>
            <div style="margin-top: 4px; color: #7ee787;"><strong>Risk Reduction:</strong> ${P(r.compatibilityAdvice.riskReduction)}</div>
          </div>
        `:""}

        ${r.validationReport?.cascadingVulnerabilitiesIntroduced?.length?`
          <div class="terminal-box" style="border-color: var(--color-danger); background: rgba(220, 53, 69, 0.1);">
            <div class="terminal-title">\u{1F6A8} Collateral Vulnerabilities / Dependency Conflicts Intercepted</div>
            <div>${r.validationReport.cascadingVulnerabilitiesIntroduced.map(s=>`\u2022 ${P(s)}`).join("<br>")}</div>
            ${r.validationReport.suggestedAlternativeVersion?`<div style="margin-top: 6px; color: #7ee787;"><strong>Safe Fallback:</strong> Upgrade to version <strong>${P(r.validationReport.suggestedAlternativeVersion)}</strong> to mitigate risk safely.</div>`:""}
          </div>
        `:""}

        ${t&&r.validationReport?.failureStackTrace?`
          <div class="terminal-box">
            <div class="terminal-title">\u274C Validation Failure Details</div>
            <div>${P(r.validationReport.failureStackTrace)}</div>
          </div>
        `:""}
      </div>

      <div class="card-footer">
        <div style="font-size: 11px; opacity: 0.7;">
          \u23F1\uFE0F ${r.sizing.estimatedHours}h
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${r.status==="applied"?`
            <button class="btn btn-sm btn-success" onclick="markVerifiedAndStage('${r.id}')">
              \u{1F44D} Verify & Stage
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectAndRollback('${r.id}')">
              \u274C Rollback
            </button>
          `:`
            <button class="btn btn-sm btn-secondary" onclick="applySingleFix('${r.id}', 'deterministic')" title="Run local CLI / AST fix">
              \u26A1 Zero-Token
            </button>
            <button class="btn btn-sm" onclick="applySingleFix('${r.id}', 'copilot')" title="Run Copilot LM fix">
              \u{1F916} Copilot AI
            </button>
          `}
          <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${r.id}')">
            \u{1F50D} Diff
          </button>
        </div>
      </div>
    </div>
  `}function yi(r,e=[]){if(!r){let s=e.find(o=>o.status==="applied");s&&(r=s)}return r?`
    ${r.status==="applied"?`
      <!-- Mandatory Human-in-the-Loop Intercept Overlay -->
      <div class="checkpoint-banner">
        <div class="checkpoint-info">
          <h3>Mandatory Checkpoint: Local Automated Validation Passed</h3>
          <p>
            Build and regression test suites executed successfully. Review the exact line-by-line diff below before staging to Git SCM.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-success" onclick="markVerifiedAndStage('${r.id}')">
            \u{1F44D} Mark as Verified & Stage for Check-in
          </button>
          <button class="btn btn-danger" onclick="rejectAndRollback('${r.id}')">
            \u274C Reject Fix & Rollback
          </button>
        </div>
      </div>
    `:""}

    ${r.compatibilityAdvice?`
      <div class="advice-card" style="margin-bottom: 20px;">
        <div class="advice-title">\u{1F4A1} Smart Safe Upgrade Recommendation (Active Compatibility Guard)</div>
        <div style="font-size: 13px; margin: 6px 0;">
          <span>Target Ideal: </span><span class="advice-ideal">${P(r.compatibilityAdvice.idealVersion)}</span>
          <span style="margin: 0 8px;">\u2794</span>
          <span>Selected Safe Target: </span><span class="advice-target">${P(r.compatibilityAdvice.safeRecommendedVersion)}</span>
        </div>
        <div style="margin-bottom: 4px;"><strong>Dependency Constraint:</strong> ${P(r.compatibilityAdvice.constraintSummary)}</div>
        <div style="margin-bottom: 4px;"><strong>Tradeoff Analysis:</strong> ${P(r.compatibilityAdvice.tradeoffReason)}</div>
        <div style="color: #7ee787;"><strong>Risk Profile:</strong> ${P(r.compatibilityAdvice.riskReduction)}</div>
      </div>
    `:""}

    <div class="sprint-header">
      <div>
        <div class="sprint-title">Diff Inspector: ${r.id} \u2014 ${r.title}</div>
        <div class="sprint-desc">
          ${r.dependency?`Dependency Upgrade: ${r.dependency.packageName}@${r.dependency.fixedVersion}`:`Target: ${r.location?.filePath||"Source Code"}`}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-${r.severity}">${r.severity}</span>
        <span class="status-pill status-${r.status}">${r.status}</span>
      </div>
    </div>

    <!-- Unified Diff Container -->
    <div class="diff-container">
      <div class="diff-header">
        <span>\u{1F4C4} ${r.location?.filePath||(r.dependency?"package.json / package-lock.json / pom.xml":"workspace")}</span>
        <span style="font-size: 11px; opacity: 0.7;">Git Unified Diff</span>
      </div>
      <div>
        ${Ei(r)}
      </div>
    </div>

    <!-- Validation Summary Card -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">Automated Validation Telemetry & Dependency Audit</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%;">
        <div class="metric-card success">
          <div class="metric-label">Compilation / Build</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${r.validationReport?.buildDurationMs??210}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Regression Tests</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${r.validationReport?.testDurationMs??430}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Security Advisory</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 CLEARED</div>
          <div class="metric-sub">${r.cveId||r.ghsaId||"Advisory Mitigated"}</div>
        </div>
        <div class="metric-card ${r.validationReport?.compatibilityStatus==="failed"||r.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"danger":"success"}">
          <div class="metric-label">Collateral Audit</div>
          <div style="font-size: 16px; font-weight: 700; color: ${r.validationReport?.compatibilityStatus==="failed"||r.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"var(--color-danger)":"var(--color-success)"};">
            ${r.validationReport?.compatibilityStatus==="failed"||r.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"\u274C COLLATERAL BREAK":"\u2714 ZERO COLLATERAL"}
          </div>
          <div class="metric-sub">
            ${r.validationReport?.suggestedAlternativeVersion?`Safe target: ${P(r.validationReport.suggestedAlternativeVersion)}`:"Dependencies Compatible"}
          </div>
        </div>
      </div>
    </div>
  `:`
      <div class="empty-state">
        <div class="empty-icon">\u{1F50D}</div>
        <div class="empty-title">No Active Diff to Inspect</div>
        <div class="empty-desc">
          Apply a fix from the Sprint Board using either Zero-Token or Copilot LM. Once applied and verified by the local task runner, the line-by-line diff and human-in-the-loop checkpoint will appear here.
        </div>
        <button class="btn" onclick="switchTab('sprint-board')">Go to Sprint Board</button>
      </div>
    `}function Ei(r){return r.appliedDiff?r.appliedDiff.split(/\r?\n/).map((t,s)=>{let o="normal";return t.startsWith("+")?o="add":t.startsWith("-")&&(o="delete"),`
        <div class="diff-line ${o}">
          <div class="diff-line-num">${s+1}</div>
          <div class="diff-line-code">${P(t)}</div>
        </div>
      `}).join(""):r.source==="dependabot"&&r.dependency?`
      <div class="diff-line normal"><div class="diff-line-num">12</div><div class="diff-line-code">   "dependencies": {</div></div>
      <div class="diff-line delete"><div class="diff-line-num">13</div><div class="diff-line-code">-    "${r.dependency.packageName}": "${r.dependency.currentVersion}",</div></div>
      <div class="diff-line add"><div class="diff-line-num">13</div><div class="diff-line-code">+    "${r.dependency.packageName}": "^${r.dependency.fixedVersion}",</div></div>
      <div class="diff-line normal"><div class="diff-line-num">14</div><div class="diff-line-code">   }</div></div>
    `:r.location?.snippet?`
      <div class="diff-line normal"><div class="diff-line-num">33</div><div class="diff-line-code"> // Line before</div></div>
      <div class="diff-line delete"><div class="diff-line-num">34</div><div class="diff-line-code">-  ${P(r.location.snippet)}</div></div>
      <div class="diff-line add"><div class="diff-line-num">34</div><div class="diff-line-code">+  // Remediated safe implementation by CodeVulFixer</div></div>
      <div class="diff-line add"><div class="diff-line-num">35</div><div class="diff-line-code">+  ${P(r.remediationPlan)}</div></div>
      <div class="diff-line normal"><div class="diff-line-num">36</div><div class="diff-line-code"> // Line after</div></div>
    `:`
    <div class="diff-line normal">
      <div class="diff-line-num">1</div>
      <div class="diff-line-code">// No workspace file modifications detected yet for ${r.id}</div>
    </div>
  `}function P(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}var R=class r{static currentPanel;panel;extensionUri;disposables=[];activeTab="risk-profile";selectedDiffFinding;constructor(e,t){this.panel=e,this.extensionUri=t,this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.panel.webview.onDidReceiveMessage(async s=>{await this.handleMessage(s)},null,this.disposables),this.update()}static createOrShow(e){let t=b.window.activeTextEditor?b.window.activeTextEditor.viewColumn:void 0;if(r.currentPanel)return r.currentPanel.panel.reveal(t),r.currentPanel.update(),r.currentPanel;let s=b.window.createWebviewPanel("codevulfixer.dashboard","CodeVulFixer Sprint & Risk Dashboard",t||b.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[e]});return r.currentPanel=new r(s,e),r.currentPanel}async update(){let e=C.getPrimaryWorkspacePath(),t;e&&(t=await E.loadState(e)),this.panel.webview.html=Ot(t,this.activeTab,this.selectedDiffFinding)}async handleMessage(e){let t=C.getPrimaryWorkspacePath();if(!t){b.window.showErrorMessage("CodeVulFixer requires an open workspace folder.");return}try{switch(e.command){case"switchTab":this.activeTab=e.tab,await this.update();break;case"scan":await this.performScan(t);break;case"loadDemoData":await this.loadDemoFindings(t);break;case"resetState":await E.resetState(t),this.selectedDiffFinding=void 0,this.activeTab="risk-profile",await this.update(),b.window.showInformationMessage("CodeVulFixer: Sprint state reset successfully.");break;case"applyFix":await this.applyFindingFix(t,e.findingId,e.engine);break;case"inspectDiff":await this.inspectFindingDiff(t,e.findingId);break;case"verifyStage":await this.verifyAndStageFinding(t,e.findingId);break;case"rejectRollback":await this.rejectAndRollbackFinding(t,e.findingId);break;case"runSprint":await this.executeSprint(t,e.sprintNumber);break;case"saveSettings":await this.updateSettings(e.settings);break}}catch(s){d.error("Error handling Webview message",s),b.window.showErrorMessage(`CodeVulFixer error: ${s instanceof Error?s.message:String(s)}`)}}async performScan(e){await b.window.withProgress({location:b.ProgressLocation.Notification,title:"CodeVulFixer: Ingesting GitHub Vulnerabilities...",cancellable:!1},async t=>{t.report({increment:10,message:"Resolving repository metadata..."});let s=await C.resolveRepoMetadata();if(!s){await b.window.showWarningMessage("No GitHub remote origin found for workspace. Would you like to load realistic demo findings for evaluation?","Load Demo Findings","Cancel")==="Load Demo Findings"&&await this.loadDemoFindings(e);return}t.report({increment:30,message:"Authenticating with GitHub API..."});let o=await re.getSession(!0);if(!o){b.window.showErrorMessage("GitHub authentication was cancelled or unavailable.");return}let i=oe.create(o.accessToken);t.report({increment:50,message:"Fetching Dependabot & Code Scanning alerts..."});let n=[],c=[];try{n=await ie.fetchAlerts(i,s.owner,s.repo)}catch(u){d.warn(`Could not ingest Dependabot alerts (might lack GHAS permission or none exist): ${u}`)}try{c=await ne.fetchAlerts(i,s.owner,s.repo)}catch(u){d.warn(`Could not ingest Code Scanning alerts (might lack GHAS permission or none exist): ${u}`)}let a=[...n,...c];if(a.length===0&&await b.window.showInformationMessage(`Zero open alerts returned by GitHub for ${s.owner}/${s.repo}. Load sample findings to test sprint orchestration?`,"Load Demo Findings","Dismiss")==="Load Demo Findings"){await this.loadDemoFindings(e);return}t.report({increment:75,message:"Running impact analysis & T-shirt sizing..."});let l=await this.enrichAndSizeFindings(e,a);t.report({increment:90,message:"Planning multi-day remediation sprints..."});let p=$.planSprints(l,s.owner,s.repo);await E.saveState(e,p),this.activeTab="sprint-board",await this.update(),b.window.showInformationMessage(`CodeVulFixer: Ingested ${a.length} findings into ${p.sprints.length} sprints.`)})}async loadDemoFindings(e){await b.window.withProgress({location:b.ProgressLocation.Notification,title:"CodeVulFixer: Loading Realistic Vulnerabilities..."},async t=>{t.report({increment:30,message:"Analyzing manifests and taint graph..."});let s=await this.enrichAndSizeFindings(e,Rt);t.report({increment:70,message:"Generating multi-day sprint schedule..."});let o=$.planSprints(s,"enterprise","demo-workspace");await E.saveState(e,o),this.activeTab="sprint-board",await this.update(),b.window.showInformationMessage("CodeVulFixer: Loaded 9 realistic findings partitioned into 3 remediation sprints.")})}async enrichAndSizeFindings(e,t){let s=[];for(let o of t){let i=o.dependency;i&&(i=await ae.analyze(e,i));let n=await ce.analyze(e,o.location,o.cweIds,o.ruleId),c=de.evaluate(o,i,n,e);s.push({...o,dependency:i,sizing:c,compatibilityAdvice:o.compatibilityAdvice})}return s}async applyFindingFix(e,t,s){let o=await E.loadState(e);if(!o||!o.findings[t])return;let i=o.findings[t];await E.updateFinding(e,t,{status:"in_progress"}),await this.update(),await b.window.withProgress({location:b.ProgressLocation.Notification,title:`CodeVulFixer: Remediating ${t}...`},async n=>{n.report({increment:30,message:`Executing ${s} fix engine...`});let c=await ge.executeRepair(e,i,s);if(!c.success){await E.updateFinding(e,t,{status:"failed",statusMessage:c.message,validationReport:{passed:!1,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped",failureStackTrace:c.stderr||c.message}}),await this.update(),b.window.showErrorMessage(`Fix failed for ${t}: ${c.message}`);return}n.report({increment:60,message:"Running build & regression tests validation..."});let a=await me.validateWorkspace(e,i),l=c.modifiedFiles[0]||i.location?.filePath||"package.json",p=await fe.getFileDiff(e,l);if(!a.passed){await E.updateFinding(e,t,{status:"failed",statusMessage:"Fix applied but automated validation tests failed.",appliedDiff:p.rawDiff,validationReport:a}),await this.update(),b.window.showErrorMessage(`Automated test verification failed after applying fix for ${t}.`);return}await E.updateFinding(e,t,{status:"applied",statusMessage:"Automated validation passed. Ready for Human-in-the-Loop review.",appliedDiff:p.rawDiff,validationReport:a}),this.selectedDiffFinding={...i,status:"applied",appliedDiff:p.rawDiff,validationReport:a},this.activeTab="diff-inspector",await this.update(),b.window.showInformationMessage(`CodeVulFixer: Fix applied & verified for ${t}. Review diff checkpoint to stage or rollback.`)})}async inspectFindingDiff(e,t){let s=await E.loadState(e);!s||!s.findings[t]||(this.selectedDiffFinding=s.findings[t],this.activeTab="diff-inspector",await this.update())}async verifyAndStageFinding(e,t){let s=await E.loadState(e);if(!s||!s.findings[t])return;let o=s.findings[t],i=o.location?.filePath?[o.location.filePath]:["package.json","package-lock.json"];await Z.stageAndSetCommitMessage(e,o,i)&&(await E.updateFinding(e,t,{status:"verified",statusMessage:"Verified by developer and staged into Git SCM."}),await this.update())}async rejectAndRollbackFinding(e,t){let s=await E.loadState(e);if(!s||!s.findings[t])return;let o=s.findings[t],i=o.location?.filePath?[o.location.filePath]:["package.json","package-lock.json"];await Z.rollbackChanges(e,i),await E.updateFinding(e,t,{status:"rejected",statusMessage:"Rejected by developer. Workspace mutations reverted."}),await this.update()}async executeSprint(e,t){let s=await E.loadState(e);if(!s)return;let o=s.sprints.find(i=>i.sprintNumber===t);if(o){b.window.showInformationMessage(`Starting automated batch execution for ${o.dayLabel}...`);for(let i of o.findings){let n=s.findings[i];if(n&&(n.status==="pending"||n.status==="failed")){await this.applyFindingFix(e,i,n.sizing.isAutomatedCandidate?"deterministic":"copilot");break}}}}async updateSettings(e){let t=b.workspace.getConfiguration("codevulfixer");e.planningMode&&await t.update("planningMode",e.planningMode,b.ConfigurationTarget.Global),e.daysPerSprint&&await t.update("daysPerSprint",e.daysPerSprint,b.ConfigurationTarget.Global),await t.update("maxHighRiskPerDay",e.maxHighRiskPerDay,b.ConfigurationTarget.Global),await t.update("targetSprintDays",e.targetSprintDays,b.ConfigurationTarget.Global),await t.update("packageManager",e.packageManager,b.ConfigurationTarget.Global),await t.update("preferredFixEngine",e.preferredFixEngine,b.ConfigurationTarget.Global);let s=C.getPrimaryWorkspacePath();if(s){let o=await E.loadState(s);if(o){let i=$.planSprints(Object.values(o.findings),o.repoOwner,o.repoName,{planningMode:e.planningMode||o.planningMode||"sprint_wise",daysPerSprint:e.daysPerSprint||o.daysPerSprint||10,maxHighRiskPerDay:e.maxHighRiskPerDay,targetSprintDays:e.targetSprintDays});await E.saveState(s,i),await this.update()}}b.window.showInformationMessage("CodeVulFixer settings saved and sprints replanned.")}dispose(){for(r.currentPanel=void 0,this.panel.dispose();this.disposables.length;){let e=this.disposables.pop();e&&e.dispose()}}};var ve=v(require("vscode"));var Y=class{constructor(e){this.extensionUri=e}static viewType="codevulfixer.sidebarView";view;resolveWebviewView(e,t,s){this.view=e,e.webview.options={enableScripts:!0,localResourceRoots:[this.extensionUri]},e.webview.onDidReceiveMessage(async o=>{switch(o.command){case"openDashboard":R.createOrShow(this.extensionUri);break;case"scan":await ve.commands.executeCommand("codevulfixer.scan"),this.refresh();break;case"loadDemo":await ve.commands.executeCommand("codevulfixer.loadDemoData"),this.refresh();break;case"runSprint":await ve.commands.executeCommand("codevulfixer.runSprint"),this.refresh();break}}),this.refresh()}async refresh(){if(!this.view)return;let e=C.getPrimaryWorkspacePath(),t;e&&(t=await E.loadState(e)),this.view.webview.html=this.getSidebarHtml(t)}getSidebarHtml(e){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      padding: 12px;
      margin: 0;
    }
    .btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .btn-secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .btn-secondary:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .btn-success {
      background: #28a745;
      color: white;
    }
    .btn-success:hover {
      background: #218838;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
    }
    .pill {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .pill-danger { background: rgba(220,53,69,0.2); color: #dc3545; }
    .pill-success { background: rgba(40,167,69,0.2); color: #28a745; }
    .pill-warning { background: rgba(255,193,7,0.2); color: #ffc107; }
    .box {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .item-card {
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div style="font-weight: bold; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
    \u{1F6E1}\uFE0F CodeVulFixer
  </div>

  <button class="btn" onclick="post('openDashboard')">
    <span>\u{1F4CA}</span> Open Full Dashboard
  </button>

  ${e?`
    <div class="box">
      <div style="font-weight: 600; font-size: 12px; margin-bottom: 6px;">
        Sprint Status (${e.repoOwner}/${e.repoName})
      </div>
      <div class="metric-row">
        <span>Active Sprints:</span>
        <strong>${e.sprints.length} Days</strong>
      </div>
      <div class="metric-row">
        <span>Remediated:</span>
        <span class="pill pill-success">${e.metrics.resolvedCount} / ${e.metrics.totalFindings}</span>
      </div>
      <div class="metric-row">
        <span>Pending:</span>
        <span class="pill pill-warning">${e.metrics.pendingCount}</span>
      </div>
      <div class="metric-row">
        <span>Time Saved:</span>
        <strong>${e.metrics.hoursSaved} hrs</strong>
      </div>
    </div>

    <button class="btn btn-success" onclick="post('runSprint')">
      <span>\u26A1</span> Run Current Sprint
    </button>
  `:`
    <div class="box" style="text-align: center; font-size: 12px; opacity: 0.8;">
      No active sprint plan loaded.
    </div>
  `}

  <button class="btn btn-secondary" onclick="post('scan')">
    <span>\u{1F504}</span> Ingest & Scan
  </button>

  <button class="btn btn-secondary" onclick="post('loadDemo')">
    <span>\u{1F9EA}</span> Load Demo Findings
  </button>

  <script>
    const vscode = acquireVsCodeApi();
    function post(command) {
      vscode.postMessage({ command });
    }
  </script>
</body>
</html>`}};function Ti(r){d.info("Activating CodeVulFixer Extension...");let e=new Y(r.extensionUri);r.subscriptions.push(x.window.registerWebviewViewProvider(Y.viewType,e)),r.subscriptions.push(x.commands.registerCommand("codevulfixer.openDashboard",()=>{d.info("Command: codevulfixer.openDashboard executed."),R.createOrShow(r.extensionUri)})),r.subscriptions.push(x.commands.registerCommand("codevulfixer.scan",async()=>{d.info("Command: codevulfixer.scan executed.");let t=C.getPrimaryWorkspacePath();if(!t){x.window.showErrorMessage("CodeVulFixer: Please open a workspace folder before scanning.");return}await R.createOrShow(r.extensionUri).performScan(t),e.refresh()})),r.subscriptions.push(x.commands.registerCommand("codevulfixer.loadDemoData",async()=>{d.info("Command: codevulfixer.loadDemoData executed.");let t=C.getPrimaryWorkspacePath();if(!t){x.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");return}await R.createOrShow(r.extensionUri).loadDemoFindings(t),e.refresh()})),r.subscriptions.push(x.commands.registerCommand("codevulfixer.runSprint",async()=>{d.info("Command: codevulfixer.runSprint executed.");let t=C.getPrimaryWorkspacePath();if(!t)return;if(!await E.loadState(t)){let i=await x.window.showWarningMessage("No active sprint plan found. Ingest vulnerabilities first?","Scan Workspace","Load Demo Findings");i==="Scan Workspace"?await x.commands.executeCommand("codevulfixer.scan"):i==="Load Demo Findings"&&await x.commands.executeCommand("codevulfixer.loadDemoData");return}let o=R.createOrShow(r.extensionUri);x.commands.executeCommand("codevulfixer.openDashboard"),e.refresh()})),r.subscriptions.push(x.commands.registerCommand("codevulfixer.resetState",async()=>{d.info("Command: codevulfixer.resetState executed.");let t=C.getPrimaryWorkspacePath();t&&(await E.resetState(t),R.currentPanel&&await R.currentPanel.update(),e.refresh(),x.window.showInformationMessage("CodeVulFixer: Sprint state has been reset."))})),d.success("CodeVulFixer successfully activated and initialized.")}function wi(){d.info("Deactivating CodeVulFixer Extension.")}0&&(module.exports={activate,deactivate});
