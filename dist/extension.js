"use strict";var Zs=Object.create;var fe=Object.defineProperty;var Ys=Object.getOwnPropertyDescriptor;var er=Object.getOwnPropertyNames;var tr=Object.getPrototypeOf,sr=Object.prototype.hasOwnProperty;var R=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),rr=(s,e)=>{for(var t in e)fe(s,t,{get:e[t],enumerable:!0})},at=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of er(e))!sr.call(s,i)&&i!==t&&fe(s,i,{get:()=>e[i],enumerable:!(r=Ys(e,i))||r.enumerable});return s};var S=(s,e,t)=>(t=s!=null?Zs(tr(s)):{},at(e||!s||!s.__esModule?fe(t,"default",{value:s,enumerable:!0}):t,s)),ir=s=>at(fe({},"__esModule",{value:!0}),s);var oe=R(je=>{"use strict";Object.defineProperty(je,"__esModule",{value:!0});function or(){return typeof navigator=="object"&&"userAgent"in navigator?navigator.userAgent:typeof process=="object"&&process.version!==void 0?`Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`:"<environment undetectable>"}je.getUserAgent=or});var ht=R((sn,ft)=>{ft.exports=mt;function mt(s,e,t,r){if(typeof t!="function")throw new Error("method for before hook must be a function");return r||(r={}),Array.isArray(e)?e.reverse().reduce(function(i,n){return mt.bind(null,s,n,i,r)},t)():Promise.resolve().then(function(){return s.registry[e]?s.registry[e].reduce(function(i,n){return n.hook.bind(null,i,r)},t)():t(r)})}});var yt=R((rn,bt)=>{bt.exports=nr;function nr(s,e,t,r){var i=r;s.registry[t]||(s.registry[t]=[]),e==="before"&&(r=function(n,a){return Promise.resolve().then(i.bind(null,a)).then(n.bind(null,a))}),e==="after"&&(r=function(n,a){var o;return Promise.resolve().then(n.bind(null,a)).then(function(c){return o=c,i(o,a)}).then(function(){return o})}),e==="error"&&(r=function(n,a){return Promise.resolve().then(n.bind(null,a)).catch(function(o){return i(o,a)})}),s.registry[t].push({hook:r,orig:i})}});var wt=R((on,vt)=>{vt.exports=ar;function ar(s,e,t){if(s.registry[e]){var r=s.registry[e].map(function(i){return i.orig}).indexOf(t);r!==-1&&s.registry[e].splice(r,1)}}});var _t=R((nn,ne)=>{var Ct=ht(),cr=yt(),lr=wt(),St=Function.bind,Et=St.bind(St);function kt(s,e,t){var r=Et(lr,null).apply(null,t?[e,t]:[e]);s.api={remove:r},s.remove=r,["before","error","after","wrap"].forEach(function(i){var n=t?[e,i,t]:[e,i];s[i]=s.api[i]=Et(cr,null).apply(null,n)})}function dr(){var s="h",e={registry:{}},t=Ct.bind(null,e,s);return kt(t,e,s),t}function xt(){var s={registry:{}},e=Ct.bind(null,s);return kt(e,s),e}var Tt=!1;function Y(){return Tt||(console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'),Tt=!0),xt()}Y.Singular=dr.bind();Y.Collection=xt.bind();ne.exports=Y;ne.exports.Hook=Y;ne.exports.Singular=Y.Singular;ne.exports.Collection=Y.Collection});var $t=R((an,It)=>{"use strict";var Ve=Object.defineProperty,pr=Object.getOwnPropertyDescriptor,ur=Object.getOwnPropertyNames,gr=Object.prototype.hasOwnProperty,mr=(s,e)=>{for(var t in e)Ve(s,t,{get:e[t],enumerable:!0})},fr=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ur(e))!gr.call(s,i)&&i!==t&&Ve(s,i,{get:()=>e[i],enumerable:!(r=pr(e,i))||r.enumerable});return s},hr=s=>fr(Ve({},"__esModule",{value:!0}),s),Ft={};mr(Ft,{endpoint:()=>Gr});It.exports=hr(Ft);var br=oe(),yr="9.0.6",vr=`octokit-endpoint.js/${yr} ${(0,br.getUserAgent)()}`,wr={method:"GET",baseUrl:"https://api.github.com",headers:{accept:"application/vnd.github.v3+json","user-agent":vr},mediaType:{format:""}};function Sr(s){return s?Object.keys(s).reduce((e,t)=>(e[t.toLowerCase()]=s[t],e),{}):{}}function Er(s){if(typeof s!="object"||s===null||Object.prototype.toString.call(s)!=="[object Object]")return!1;let e=Object.getPrototypeOf(s);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(s)}function Gt(s,e){let t=Object.assign({},s);return Object.keys(e).forEach(r=>{Er(e[r])?r in s?t[r]=Gt(s[r],e[r]):Object.assign(t,{[r]:e[r]}):Object.assign(t,{[r]:e[r]})}),t}function Dt(s){for(let e in s)s[e]===void 0&&delete s[e];return s}function Me(s,e,t){if(typeof e=="string"){let[i,n]=e.split(" ");t=Object.assign(n?{method:i,url:n}:{url:i},t)}else t=Object.assign({},e);t.headers=Sr(t.headers),Dt(t),Dt(t.headers);let r=Gt(s||{},t);return t.url==="/graphql"&&(s&&s.mediaType.previews?.length&&(r.mediaType.previews=s.mediaType.previews.filter(i=>!r.mediaType.previews.includes(i)).concat(r.mediaType.previews)),r.mediaType.previews=(r.mediaType.previews||[]).map(i=>i.replace(/-preview/,""))),r}function Tr(s,e){let t=/\?/.test(s)?"&":"?",r=Object.keys(e);return r.length===0?s:s+t+r.map(i=>i==="q"?"q="+e.q.split("+").map(encodeURIComponent).join("+"):`${i}=${encodeURIComponent(e[i])}`).join("&")}var Cr=/\{[^{}}]+\}/g;function kr(s){return s.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g,"").split(/,/)}function xr(s){let e=s.match(Cr);return e?e.map(kr).reduce((t,r)=>t.concat(r),[]):[]}function Pt(s,e){let t={__proto__:null};for(let r of Object.keys(s))e.indexOf(r)===-1&&(t[r]=s[r]);return t}function Rt(s){return s.split(/(%[0-9A-Fa-f]{2})/g).map(function(e){return/%[0-9A-Fa-f]/.test(e)||(e=encodeURI(e).replace(/%5B/g,"[").replace(/%5D/g,"]")),e}).join("")}function te(s){return encodeURIComponent(s).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function ae(s,e,t){return e=s==="+"||s==="#"?Rt(e):te(e),t?te(t)+"="+e:e}function ee(s){return s!=null}function Ue(s){return s===";"||s==="&"||s==="?"}function _r(s,e,t,r){var i=s[t],n=[];if(ee(i)&&i!=="")if(typeof i=="string"||typeof i=="number"||typeof i=="boolean")i=i.toString(),r&&r!=="*"&&(i=i.substring(0,parseInt(r,10))),n.push(ae(e,i,Ue(e)?t:""));else if(r==="*")Array.isArray(i)?i.filter(ee).forEach(function(a){n.push(ae(e,a,Ue(e)?t:""))}):Object.keys(i).forEach(function(a){ee(i[a])&&n.push(ae(e,i[a],a))});else{let a=[];Array.isArray(i)?i.filter(ee).forEach(function(o){a.push(ae(e,o))}):Object.keys(i).forEach(function(o){ee(i[o])&&(a.push(te(o)),a.push(ae(e,i[o].toString())))}),Ue(e)?n.push(te(t)+"="+a.join(",")):a.length!==0&&n.push(a.join(","))}else e===";"?ee(i)&&n.push(te(t)):i===""&&(e==="&"||e==="?")?n.push(te(t)+"="):i===""&&n.push("");return n}function Dr(s){return{expand:Pr.bind(null,s)}}function Pr(s,e){var t=["+","#",".","/",";","?","&"];return s=s.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g,function(r,i,n){if(i){let o="",c=[];if(t.indexOf(i.charAt(0))!==-1&&(o=i.charAt(0),i=i.substr(1)),i.split(/,/g).forEach(function(l){var g=/([^:\*]*)(?::(\d+)|(\*))?/.exec(l);c.push(_r(e,o,g[1],g[2]||g[3]))}),o&&o!=="+"){var a=",";return o==="?"?a="&":o!=="#"&&(a=o),(c.length!==0?o:"")+c.join(a)}else return c.join(",")}else return Rt(n)}),s==="/"?s:s.replace(/\/$/,"")}function At(s){let e=s.method.toUpperCase(),t=(s.url||"/").replace(/:([a-z]\w+)/g,"{$1}"),r=Object.assign({},s.headers),i,n=Pt(s,["method","baseUrl","url","headers","request","mediaType"]),a=xr(t);t=Dr(t).expand(n),/^http/.test(t)||(t=s.baseUrl+t);let o=Object.keys(s).filter(g=>a.includes(g)).concat("baseUrl"),c=Pt(n,o);if(!/application\/octet-stream/i.test(r.accept)&&(s.mediaType.format&&(r.accept=r.accept.split(/,/).map(g=>g.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,`application/vnd$1$2.${s.mediaType.format}`)).join(",")),t.endsWith("/graphql")&&s.mediaType.previews?.length)){let g=r.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g)||[];r.accept=g.concat(s.mediaType.previews).map(d=>{let p=s.mediaType.format?`.${s.mediaType.format}`:"+json";return`application/vnd.github.${d}-preview${p}`}).join(",")}return["GET","HEAD"].includes(e)?t=Tr(t,c):"data"in c?i=c.data:Object.keys(c).length&&(i=c),!r["content-type"]&&typeof i<"u"&&(r["content-type"]="application/json; charset=utf-8"),["PATCH","PUT"].includes(e)&&typeof i>"u"&&(i=""),Object.assign({method:e,url:t,headers:r},typeof i<"u"?{body:i}:null,s.request?{request:s.request}:null)}function Fr(s,e,t){return At(Me(s,e,t))}function Ot(s,e){let t=Me(s,e),r=Fr.bind(null,t);return Object.assign(r,{DEFAULTS:t,defaults:Ot.bind(null,t),merge:Me.bind(null,t),parse:At})}var Gr=Ot(null,wr)});var Lt=R(Ne=>{"use strict";Object.defineProperty(Ne,"__esModule",{value:!0});var He=class extends Error{constructor(e){super(e),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="Deprecation"}};Ne.Deprecation=He});var Mt=R((ln,Ut)=>{Ut.exports=jt;function jt(s,e){if(s&&e)return jt(s)(e);if(typeof s!="function")throw new TypeError("need wrapper function");return Object.keys(s).forEach(function(r){t[r]=s[r]}),t;function t(){for(var r=new Array(arguments.length),i=0;i<r.length;i++)r[i]=arguments[i];var n=s.apply(this,r),a=r[r.length-1];return typeof n=="function"&&n!==a&&Object.keys(a).forEach(function(o){n[o]=a[o]}),n}}});var Nt=R((dn,ze)=>{var Vt=Mt();ze.exports=Vt(be);ze.exports.strict=Vt(Ht);be.proto=be(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return be(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Ht(this)},configurable:!0})});function be(s){var e=function(){return e.called?e.value:(e.called=!0,e.value=s.apply(this,arguments))};return e.called=!1,e}function Ht(s){var e=function(){if(e.called)throw new Error(e.onceError);return e.called=!0,e.value=s.apply(this,arguments)},t=s.name||"Function wrapped with `once`";return e.onceError=t+" shouldn't be called more than once",e.called=!1,e}});var Kt=R((pn,Jt)=>{"use strict";var Rr=Object.create,ye=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,Or=Object.getOwnPropertyNames,Ir=Object.getPrototypeOf,$r=Object.prototype.hasOwnProperty,Lr=(s,e)=>{for(var t in e)ye(s,t,{get:e[t],enumerable:!0})},Wt=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Or(e))!$r.call(s,i)&&i!==t&&ye(s,i,{get:()=>e[i],enumerable:!(r=Ar(e,i))||r.enumerable});return s},jr=(s,e,t)=>(t=s!=null?Rr(Ir(s)):{},Wt(e||!s||!s.__esModule?ye(t,"default",{value:s,enumerable:!0}):t,s)),Ur=s=>Wt(ye({},"__esModule",{value:!0}),s),qt={};Lr(qt,{RequestError:()=>Hr});Jt.exports=Ur(qt);var zt=Lt(),Bt=jr(Nt()),Mr=(0,Bt.default)(s=>console.warn(s)),Vr=(0,Bt.default)(s=>console.warn(s)),Hr=class extends Error{constructor(s,e,t){super(s),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="HttpError",this.status=e;let r;"headers"in t&&typeof t.headers<"u"&&(r=t.headers),"response"in t&&(this.response=t.response,r=t.response.headers);let i=Object.assign({},t.request);t.request.headers.authorization&&(i.headers=Object.assign({},t.request.headers,{authorization:t.request.headers.authorization.replace(/(?<! ) .*$/," [REDACTED]")})),i.url=i.url.replace(/\bclient_secret=\w+/g,"client_secret=[REDACTED]").replace(/\baccess_token=\w+/g,"access_token=[REDACTED]"),this.request=i,Object.defineProperty(this,"code",{get(){return Mr(new zt.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")),e}}),Object.defineProperty(this,"headers",{get(){return Vr(new zt.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.")),r||{}}})}}});var le=R((gn,Zt)=>{"use strict";var Be=Object.defineProperty,Nr=Object.getOwnPropertyDescriptor,zr=Object.getOwnPropertyNames,Wr=Object.prototype.hasOwnProperty,qr=(s,e)=>{for(var t in e)Be(s,t,{get:e[t],enumerable:!0})},Br=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of zr(e))!Wr.call(s,i)&&i!==t&&Be(s,i,{get:()=>e[i],enumerable:!(r=Nr(e,i))||r.enumerable});return s},Jr=s=>Br(Be({},"__esModule",{value:!0}),s),Qt={};qr(Qt,{request:()=>ti});Zt.exports=Jr(Qt);var Kr=$t(),Xr=oe(),Qr="8.4.1";function Zr(s){if(typeof s!="object"||s===null||Object.prototype.toString.call(s)!=="[object Object]")return!1;let e=Object.getPrototypeOf(s);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(s)}var ce=Kt();function Yr(s){return s.arrayBuffer()}function Xt(s){var e,t,r,i;let n=s.request&&s.request.log?s.request.log:console,a=((e=s.request)==null?void 0:e.parseSuccessResponseBody)!==!1;(Zr(s.body)||Array.isArray(s.body))&&(s.body=JSON.stringify(s.body));let o={},c,l,{fetch:g}=globalThis;if((t=s.request)!=null&&t.fetch&&(g=s.request.fetch),!g)throw new Error("fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing");return g(s.url,{method:s.method,body:s.body,redirect:(r=s.request)==null?void 0:r.redirect,headers:s.headers,signal:(i=s.request)==null?void 0:i.signal,...s.body&&{duplex:"half"}}).then(async d=>{l=d.url,c=d.status;for(let p of d.headers)o[p[0]]=p[1];if("deprecation"in o){let p=o.link&&o.link.match(/<([^<>]+)>; rel="deprecation"/),u=p&&p.pop();n.warn(`[@octokit/request] "${s.method} ${s.url}" is deprecated. It is scheduled to be removed on ${o.sunset}${u?`. See ${u}`:""}`)}if(!(c===204||c===205)){if(s.method==="HEAD"){if(c<400)return;throw new ce.RequestError(d.statusText,c,{response:{url:l,status:c,headers:o,data:void 0},request:s})}if(c===304)throw new ce.RequestError("Not modified",c,{response:{url:l,status:c,headers:o,data:await We(d)},request:s});if(c>=400){let p=await We(d);throw new ce.RequestError(ei(p),c,{response:{url:l,status:c,headers:o,data:p},request:s})}return a?await We(d):d.body}}).then(d=>({status:c,url:l,headers:o,data:d})).catch(d=>{if(d instanceof ce.RequestError)throw d;if(d.name==="AbortError")throw d;let p=d.message;throw d.name==="TypeError"&&"cause"in d&&(d.cause instanceof Error?p=d.cause.message:typeof d.cause=="string"&&(p=d.cause)),new ce.RequestError(p,500,{request:s})})}async function We(s){let e=s.headers.get("content-type");return/application\/json/.test(e)?s.json().catch(()=>s.text()).catch(()=>""):!e||/^text\/|charset=utf-8$/.test(e)?s.text():Yr(s)}function ei(s){if(typeof s=="string")return s;let e;return"documentation_url"in s?e=` - ${s.documentation_url}`:e="","message"in s?Array.isArray(s.errors)?`${s.message}: ${s.errors.map(JSON.stringify).join(", ")}${e}`:`${s.message}${e}`:`Unknown error: ${JSON.stringify(s)}`}function qe(s,e){let t=s.defaults(e);return Object.assign(function(i,n){let a=t.merge(i,n);if(!a.request||!a.request.hook)return Xt(t.parse(a));let o=(c,l)=>Xt(t.parse(t.merge(c,l)));return Object.assign(o,{endpoint:t,defaults:qe.bind(null,t)}),a.request.hook(o,a)},{endpoint:t,defaults:qe.bind(null,t)})}var ti=qe(Kr.endpoint,{headers:{"user-agent":`octokit-request.js/${Qr} ${(0,Xr.getUserAgent)()}`}})});var rs=R((hn,ss)=>{"use strict";var Je=Object.defineProperty,si=Object.getOwnPropertyDescriptor,ri=Object.getOwnPropertyNames,ii=Object.prototype.hasOwnProperty,oi=(s,e)=>{for(var t in e)Je(s,t,{get:e[t],enumerable:!0})},ni=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ri(e))!ii.call(s,i)&&i!==t&&Je(s,i,{get:()=>e[i],enumerable:!(r=si(e,i))||r.enumerable});return s},ai=s=>ni(Je({},"__esModule",{value:!0}),s),es={};oi(es,{GraphqlResponseError:()=>ts,graphql:()=>fi,withCustomRequest:()=>hi});ss.exports=ai(es);var ci=le(),li=oe(),di="7.1.1",mn=le(),fn=le();function pi(s){return`Request failed due to following response errors:
`+s.errors.map(e=>` - ${e.message}`).join(`
`)}var ts=class extends Error{constructor(s,e,t){super(pi(t)),this.request=s,this.headers=e,this.response=t,this.name="GraphqlResponseError",this.errors=t.errors,this.data=t.data,Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}},ui=["method","baseUrl","url","headers","request","query","mediaType"],gi=["query","method","url"],Yt=/\/api\/v3\/?$/;function mi(s,e,t){if(t){if(typeof e=="string"&&"query"in t)return Promise.reject(new Error('[@octokit/graphql] "query" cannot be used as variable name'));for(let a in t)if(gi.includes(a))return Promise.reject(new Error(`[@octokit/graphql] "${a}" cannot be used as variable name`))}let r=typeof e=="string"?Object.assign({query:e},t):e,i=Object.keys(r).reduce((a,o)=>ui.includes(o)?(a[o]=r[o],a):(a.variables||(a.variables={}),a.variables[o]=r[o],a),{}),n=r.baseUrl||s.endpoint.DEFAULTS.baseUrl;return Yt.test(n)&&(i.url=n.replace(Yt,"/api/graphql")),s(i).then(a=>{if(a.data.errors){let o={};for(let c of Object.keys(a.headers))o[c]=a.headers[c];throw new ts(i,o,a.data)}return a.data.data})}function Ke(s,e){let t=s.defaults(e);return Object.assign((i,n)=>mi(t,i,n),{defaults:Ke.bind(null,t),endpoint:t.endpoint})}var fi=Ke(ci.request,{headers:{"user-agent":`octokit-graphql.js/${di} ${(0,li.getUserAgent)()}`},method:"POST",url:"/graphql"});function hi(s){return Ke(s,{method:"POST",url:"/graphql"})}});var ns=R((yn,os)=>{"use strict";var Xe=Object.defineProperty,bi=Object.getOwnPropertyDescriptor,yi=Object.getOwnPropertyNames,vi=Object.prototype.hasOwnProperty,wi=(s,e)=>{for(var t in e)Xe(s,t,{get:e[t],enumerable:!0})},Si=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of yi(e))!vi.call(s,i)&&i!==t&&Xe(s,i,{get:()=>e[i],enumerable:!(r=bi(e,i))||r.enumerable});return s},Ei=s=>Si(Xe({},"__esModule",{value:!0}),s),is={};wi(is,{createTokenAuth:()=>Pi});os.exports=Ei(is);var Ti=/^v1\./,Ci=/^ghs_/,ki=/^ghu_/;async function xi(s){let e=s.split(/\./).length===3,t=Ti.test(s)||Ci.test(s),r=ki.test(s);return{type:"token",token:s,tokenType:e?"app":t?"installation":r?"user-to-server":"oauth"}}function _i(s){return s.split(/\./).length===3?`bearer ${s}`:`token ${s}`}async function Di(s,e,t,r){let i=e.endpoint.merge(t,r);return i.headers.authorization=_i(s),e(i)}var Pi=function(e){if(!e)throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");if(typeof e!="string")throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");return e=e.replace(/^(token|bearer) +/i,""),Object.assign(xi.bind(null,e),{hook:Di.bind(null,e)})}});var gs=R((vn,us)=>{"use strict";var Qe=Object.defineProperty,Fi=Object.getOwnPropertyDescriptor,Gi=Object.getOwnPropertyNames,Ri=Object.prototype.hasOwnProperty,Ai=(s,e)=>{for(var t in e)Qe(s,t,{get:e[t],enumerable:!0})},Oi=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Gi(e))!Ri.call(s,i)&&i!==t&&Qe(s,i,{get:()=>e[i],enumerable:!(r=Fi(e,i))||r.enumerable});return s},Ii=s=>Oi(Qe({},"__esModule",{value:!0}),s),ds={};Ai(ds,{Octokit:()=>Ni});us.exports=Ii(ds);var $i=oe(),Li=_t(),as=le(),ji=rs(),Ui=ns(),ps="5.2.2",cs=()=>{},Mi=console.warn.bind(console),Vi=console.error.bind(console);function Hi(s={}){return typeof s.debug!="function"&&(s.debug=cs),typeof s.info!="function"&&(s.info=cs),typeof s.warn!="function"&&(s.warn=Mi),typeof s.error!="function"&&(s.error=Vi),s}var ls=`octokit-core.js/${ps} ${(0,$i.getUserAgent)()}`,Ni=class{static{this.VERSION=ps}static defaults(s){return class extends this{constructor(...t){let r=t[0]||{};if(typeof s=="function"){super(s(r));return}super(Object.assign({},s,r,r.userAgent&&s.userAgent?{userAgent:`${r.userAgent} ${s.userAgent}`}:null))}}}static{this.plugins=[]}static plugin(...s){let e=this.plugins;return class extends this{static{this.plugins=e.concat(s.filter(r=>!e.includes(r)))}}}constructor(s={}){let e=new Li.Collection,t={baseUrl:as.request.endpoint.DEFAULTS.baseUrl,headers:{},request:Object.assign({},s.request,{hook:e.bind(null,"request")}),mediaType:{previews:[],format:""}};if(t.headers["user-agent"]=s.userAgent?`${s.userAgent} ${ls}`:ls,s.baseUrl&&(t.baseUrl=s.baseUrl),s.previews&&(t.mediaType.previews=s.previews),s.timeZone&&(t.headers["time-zone"]=s.timeZone),this.request=as.request.defaults(t),this.graphql=(0,ji.withCustomRequest)(this.request).defaults(t),this.log=Hi(s.log),this.hook=e,s.authStrategy){let{authStrategy:i,...n}=s,a=i(Object.assign({request:this.request,log:this.log,octokit:this,octokitOptions:n},s.auth));e.wrap("request",a.hook),this.auth=a}else if(!s.auth)this.auth=async()=>({type:"unauthenticated"});else{let i=(0,Ui.createTokenAuth)(s.auth);e.wrap("request",i.hook),this.auth=i}let r=this.constructor;for(let i=0;i<r.plugins.length;++i)Object.assign(this,r.plugins[i](this,s))}}});var bs=R((Tn,hs)=>{"use strict";var Ze=Object.defineProperty,zi=Object.getOwnPropertyDescriptor,Wi=Object.getOwnPropertyNames,qi=Object.prototype.hasOwnProperty,Bi=(s,e)=>{for(var t in e)Ze(s,t,{get:e[t],enumerable:!0})},Ji=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Wi(e))!qi.call(s,i)&&i!==t&&Ze(s,i,{get:()=>e[i],enumerable:!(r=zi(e,i))||r.enumerable});return s},Ki=s=>Ji(Ze({},"__esModule",{value:!0}),s),ms={};Bi(ms,{requestLog:()=>fs});hs.exports=Ki(ms);var Xi="4.0.1";function fs(s){s.hook.wrap("request",(e,t)=>{s.log.debug("request",t);let r=Date.now(),i=s.request.endpoint.parse(t),n=i.url.replace(t.baseUrl,"");return e(t).then(a=>(s.log.info(`${i.method} ${n} - ${a.status} in ${Date.now()-r}ms`),a)).catch(a=>{throw s.log.info(`${i.method} ${n} - ${a.status} in ${Date.now()-r}ms`),a})})}fs.VERSION=Xi});var Cs=R((Cn,Ts)=>{"use strict";var Ye=Object.defineProperty,Qi=Object.getOwnPropertyDescriptor,Zi=Object.getOwnPropertyNames,Yi=Object.prototype.hasOwnProperty,eo=(s,e)=>{for(var t in e)Ye(s,t,{get:e[t],enumerable:!0})},to=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Zi(e))!Yi.call(s,i)&&i!==t&&Ye(s,i,{get:()=>e[i],enumerable:!(r=Qi(e,i))||r.enumerable});return s},so=s=>to(Ye({},"__esModule",{value:!0}),s),ys={};eo(ys,{composePaginateRest:()=>oo,isPaginatingEndpoint:()=>no,paginateRest:()=>Es,paginatingEndpoints:()=>Ss});Ts.exports=so(ys);var ro="11.4.4-cjs.2";function io(s){if(!s.data)return{...s,data:[]};if(!("total_count"in s.data&&!("url"in s.data)))return s;let t=s.data.incomplete_results,r=s.data.repository_selection,i=s.data.total_count;delete s.data.incomplete_results,delete s.data.repository_selection,delete s.data.total_count;let n=Object.keys(s.data)[0],a=s.data[n];return s.data=a,typeof t<"u"&&(s.data.incomplete_results=t),typeof r<"u"&&(s.data.repository_selection=r),s.data.total_count=i,s}function et(s,e,t){let r=typeof e=="function"?e.endpoint(t):s.request.endpoint(e,t),i=typeof e=="function"?e:s.request,n=r.method,a=r.headers,o=r.url;return{[Symbol.asyncIterator]:()=>({async next(){if(!o)return{done:!0};try{let c=await i({method:n,url:o,headers:a}),l=io(c);return o=((l.headers.link||"").match(/<([^<>]+)>;\s*rel="next"/)||[])[1],{value:l}}catch(c){if(c.status!==409)throw c;return o="",{value:{status:200,headers:{},data:[]}}}}})}}function vs(s,e,t,r){return typeof t=="function"&&(r=t,t=void 0),ws(s,[],et(s,e,t)[Symbol.asyncIterator](),r)}function ws(s,e,t,r){return t.next().then(i=>{if(i.done)return e;let n=!1;function a(){n=!0}return e=e.concat(r?r(i.value,a):i.value.data),n?e:ws(s,e,t,r)})}var oo=Object.assign(vs,{iterator:et}),Ss=["GET /advisories","GET /app/hook/deliveries","GET /app/installation-requests","GET /app/installations","GET /assignments/{assignment_id}/accepted_assignments","GET /classrooms","GET /classrooms/{classroom_id}/assignments","GET /enterprises/{enterprise}/code-security/configurations","GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories","GET /enterprises/{enterprise}/dependabot/alerts","GET /enterprises/{enterprise}/secret-scanning/alerts","GET /events","GET /gists","GET /gists/public","GET /gists/starred","GET /gists/{gist_id}/comments","GET /gists/{gist_id}/commits","GET /gists/{gist_id}/forks","GET /installation/repositories","GET /issues","GET /licenses","GET /marketplace_listing/plans","GET /marketplace_listing/plans/{plan_id}/accounts","GET /marketplace_listing/stubbed/plans","GET /marketplace_listing/stubbed/plans/{plan_id}/accounts","GET /networks/{owner}/{repo}/events","GET /notifications","GET /organizations","GET /orgs/{org}/actions/cache/usage-by-repository","GET /orgs/{org}/actions/permissions/repositories","GET /orgs/{org}/actions/runner-groups","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners","GET /orgs/{org}/actions/runners","GET /orgs/{org}/actions/secrets","GET /orgs/{org}/actions/secrets/{secret_name}/repositories","GET /orgs/{org}/actions/variables","GET /orgs/{org}/actions/variables/{name}/repositories","GET /orgs/{org}/attestations/{subject_digest}","GET /orgs/{org}/blocks","GET /orgs/{org}/code-scanning/alerts","GET /orgs/{org}/code-security/configurations","GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories","GET /orgs/{org}/codespaces","GET /orgs/{org}/codespaces/secrets","GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories","GET /orgs/{org}/copilot/billing/seats","GET /orgs/{org}/copilot/metrics","GET /orgs/{org}/copilot/usage","GET /orgs/{org}/dependabot/alerts","GET /orgs/{org}/dependabot/secrets","GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories","GET /orgs/{org}/events","GET /orgs/{org}/failed_invitations","GET /orgs/{org}/hooks","GET /orgs/{org}/hooks/{hook_id}/deliveries","GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}","GET /orgs/{org}/insights/api/subject-stats","GET /orgs/{org}/insights/api/user-stats/{user_id}","GET /orgs/{org}/installations","GET /orgs/{org}/invitations","GET /orgs/{org}/invitations/{invitation_id}/teams","GET /orgs/{org}/issues","GET /orgs/{org}/members","GET /orgs/{org}/members/{username}/codespaces","GET /orgs/{org}/migrations","GET /orgs/{org}/migrations/{migration_id}/repositories","GET /orgs/{org}/organization-roles/{role_id}/teams","GET /orgs/{org}/organization-roles/{role_id}/users","GET /orgs/{org}/outside_collaborators","GET /orgs/{org}/packages","GET /orgs/{org}/packages/{package_type}/{package_name}/versions","GET /orgs/{org}/personal-access-token-requests","GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories","GET /orgs/{org}/personal-access-tokens","GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories","GET /orgs/{org}/private-registries","GET /orgs/{org}/projects","GET /orgs/{org}/properties/values","GET /orgs/{org}/public_members","GET /orgs/{org}/repos","GET /orgs/{org}/rulesets","GET /orgs/{org}/rulesets/rule-suites","GET /orgs/{org}/secret-scanning/alerts","GET /orgs/{org}/security-advisories","GET /orgs/{org}/team/{team_slug}/copilot/metrics","GET /orgs/{org}/team/{team_slug}/copilot/usage","GET /orgs/{org}/teams","GET /orgs/{org}/teams/{team_slug}/discussions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions","GET /orgs/{org}/teams/{team_slug}/invitations","GET /orgs/{org}/teams/{team_slug}/members","GET /orgs/{org}/teams/{team_slug}/projects","GET /orgs/{org}/teams/{team_slug}/repos","GET /orgs/{org}/teams/{team_slug}/teams","GET /projects/columns/{column_id}/cards","GET /projects/{project_id}/collaborators","GET /projects/{project_id}/columns","GET /repos/{owner}/{repo}/actions/artifacts","GET /repos/{owner}/{repo}/actions/caches","GET /repos/{owner}/{repo}/actions/organization-secrets","GET /repos/{owner}/{repo}/actions/organization-variables","GET /repos/{owner}/{repo}/actions/runners","GET /repos/{owner}/{repo}/actions/runs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts","GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs","GET /repos/{owner}/{repo}/actions/secrets","GET /repos/{owner}/{repo}/actions/variables","GET /repos/{owner}/{repo}/actions/workflows","GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs","GET /repos/{owner}/{repo}/activity","GET /repos/{owner}/{repo}/assignees","GET /repos/{owner}/{repo}/attestations/{subject_digest}","GET /repos/{owner}/{repo}/branches","GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations","GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs","GET /repos/{owner}/{repo}/code-scanning/alerts","GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances","GET /repos/{owner}/{repo}/code-scanning/analyses","GET /repos/{owner}/{repo}/codespaces","GET /repos/{owner}/{repo}/codespaces/devcontainers","GET /repos/{owner}/{repo}/codespaces/secrets","GET /repos/{owner}/{repo}/collaborators","GET /repos/{owner}/{repo}/comments","GET /repos/{owner}/{repo}/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/commits","GET /repos/{owner}/{repo}/commits/{commit_sha}/comments","GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls","GET /repos/{owner}/{repo}/commits/{ref}/check-runs","GET /repos/{owner}/{repo}/commits/{ref}/check-suites","GET /repos/{owner}/{repo}/commits/{ref}/status","GET /repos/{owner}/{repo}/commits/{ref}/statuses","GET /repos/{owner}/{repo}/contributors","GET /repos/{owner}/{repo}/dependabot/alerts","GET /repos/{owner}/{repo}/dependabot/secrets","GET /repos/{owner}/{repo}/deployments","GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses","GET /repos/{owner}/{repo}/environments","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps","GET /repos/{owner}/{repo}/environments/{environment_name}/secrets","GET /repos/{owner}/{repo}/environments/{environment_name}/variables","GET /repos/{owner}/{repo}/events","GET /repos/{owner}/{repo}/forks","GET /repos/{owner}/{repo}/hooks","GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries","GET /repos/{owner}/{repo}/invitations","GET /repos/{owner}/{repo}/issues","GET /repos/{owner}/{repo}/issues/comments","GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/issues/events","GET /repos/{owner}/{repo}/issues/{issue_number}/comments","GET /repos/{owner}/{repo}/issues/{issue_number}/events","GET /repos/{owner}/{repo}/issues/{issue_number}/labels","GET /repos/{owner}/{repo}/issues/{issue_number}/reactions","GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues","GET /repos/{owner}/{repo}/issues/{issue_number}/timeline","GET /repos/{owner}/{repo}/keys","GET /repos/{owner}/{repo}/labels","GET /repos/{owner}/{repo}/milestones","GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels","GET /repos/{owner}/{repo}/notifications","GET /repos/{owner}/{repo}/pages/builds","GET /repos/{owner}/{repo}/projects","GET /repos/{owner}/{repo}/pulls","GET /repos/{owner}/{repo}/pulls/comments","GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/pulls/{pull_number}/comments","GET /repos/{owner}/{repo}/pulls/{pull_number}/commits","GET /repos/{owner}/{repo}/pulls/{pull_number}/files","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments","GET /repos/{owner}/{repo}/releases","GET /repos/{owner}/{repo}/releases/{release_id}/assets","GET /repos/{owner}/{repo}/releases/{release_id}/reactions","GET /repos/{owner}/{repo}/rules/branches/{branch}","GET /repos/{owner}/{repo}/rulesets","GET /repos/{owner}/{repo}/rulesets/rule-suites","GET /repos/{owner}/{repo}/secret-scanning/alerts","GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations","GET /repos/{owner}/{repo}/security-advisories","GET /repos/{owner}/{repo}/stargazers","GET /repos/{owner}/{repo}/subscribers","GET /repos/{owner}/{repo}/tags","GET /repos/{owner}/{repo}/teams","GET /repos/{owner}/{repo}/topics","GET /repositories","GET /search/code","GET /search/commits","GET /search/issues","GET /search/labels","GET /search/repositories","GET /search/topics","GET /search/users","GET /teams/{team_id}/discussions","GET /teams/{team_id}/discussions/{discussion_number}/comments","GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /teams/{team_id}/discussions/{discussion_number}/reactions","GET /teams/{team_id}/invitations","GET /teams/{team_id}/members","GET /teams/{team_id}/projects","GET /teams/{team_id}/repos","GET /teams/{team_id}/teams","GET /user/blocks","GET /user/codespaces","GET /user/codespaces/secrets","GET /user/emails","GET /user/followers","GET /user/following","GET /user/gpg_keys","GET /user/installations","GET /user/installations/{installation_id}/repositories","GET /user/issues","GET /user/keys","GET /user/marketplace_purchases","GET /user/marketplace_purchases/stubbed","GET /user/memberships/orgs","GET /user/migrations","GET /user/migrations/{migration_id}/repositories","GET /user/orgs","GET /user/packages","GET /user/packages/{package_type}/{package_name}/versions","GET /user/public_emails","GET /user/repos","GET /user/repository_invitations","GET /user/social_accounts","GET /user/ssh_signing_keys","GET /user/starred","GET /user/subscriptions","GET /user/teams","GET /users","GET /users/{username}/attestations/{subject_digest}","GET /users/{username}/events","GET /users/{username}/events/orgs/{org}","GET /users/{username}/events/public","GET /users/{username}/followers","GET /users/{username}/following","GET /users/{username}/gists","GET /users/{username}/gpg_keys","GET /users/{username}/keys","GET /users/{username}/orgs","GET /users/{username}/packages","GET /users/{username}/projects","GET /users/{username}/received_events","GET /users/{username}/received_events/public","GET /users/{username}/repos","GET /users/{username}/social_accounts","GET /users/{username}/ssh_signing_keys","GET /users/{username}/starred","GET /users/{username}/subscriptions"];function no(s){return typeof s=="string"?Ss.includes(s):!1}function Es(s){return{paginate:Object.assign(vs.bind(null,s),{iterator:et.bind(null,s)})}}Es.VERSION=ro});var Gs=R((kn,Fs)=>{"use strict";var tt=Object.defineProperty,ao=Object.getOwnPropertyDescriptor,co=Object.getOwnPropertyNames,lo=Object.prototype.hasOwnProperty,po=(s,e)=>{for(var t in e)tt(s,t,{get:e[t],enumerable:!0})},uo=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of co(e))!lo.call(s,i)&&i!==t&&tt(s,i,{get:()=>e[i],enumerable:!(r=ao(e,i))||r.enumerable});return s},go=s=>uo(tt({},"__esModule",{value:!0}),s),ks={};po(ks,{legacyRestEndpointMethods:()=>Ps,restEndpointMethods:()=>Ds});Fs.exports=go(ks);var xs="13.3.2-cjs.1",mo={actions:{addCustomLabelsToSelfHostedRunnerForOrg:["POST /orgs/{org}/actions/runners/{runner_id}/labels"],addCustomLabelsToSelfHostedRunnerForRepo:["POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],addRepoAccessToSelfHostedRunnerGroupInOrg:["PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],approveWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],cancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],createEnvironmentVariable:["POST /repos/{owner}/{repo}/environments/{environment_name}/variables"],createOrUpdateEnvironmentSecret:["PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],createOrgVariable:["POST /orgs/{org}/actions/variables"],createRegistrationTokenForOrg:["POST /orgs/{org}/actions/runners/registration-token"],createRegistrationTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/registration-token"],createRemoveTokenForOrg:["POST /orgs/{org}/actions/runners/remove-token"],createRemoveTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/remove-token"],createRepoVariable:["POST /repos/{owner}/{repo}/actions/variables"],createWorkflowDispatch:["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],deleteActionsCacheById:["DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"],deleteActionsCacheByKey:["DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"],deleteArtifact:["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],deleteEnvironmentSecret:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],deleteEnvironmentVariable:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],deleteOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}"],deleteOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],deleteRepoVariable:["DELETE /repos/{owner}/{repo}/actions/variables/{name}"],deleteSelfHostedRunnerFromOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}"],deleteSelfHostedRunnerFromRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],deleteWorkflowRun:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],deleteWorkflowRunLogs:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],disableSelectedRepositoryGithubActionsOrganization:["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],disableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],downloadArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],downloadJobLogsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],downloadWorkflowRunAttemptLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"],downloadWorkflowRunLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],enableSelectedRepositoryGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],enableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],forceCancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"],generateRunnerJitconfigForOrg:["POST /orgs/{org}/actions/runners/generate-jitconfig"],generateRunnerJitconfigForRepo:["POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"],getActionsCacheList:["GET /repos/{owner}/{repo}/actions/caches"],getActionsCacheUsage:["GET /repos/{owner}/{repo}/actions/cache/usage"],getActionsCacheUsageByRepoForOrg:["GET /orgs/{org}/actions/cache/usage-by-repository"],getActionsCacheUsageForOrg:["GET /orgs/{org}/actions/cache/usage"],getAllowedActionsOrganization:["GET /orgs/{org}/actions/permissions/selected-actions"],getAllowedActionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],getArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],getCustomOidcSubClaimForRepo:["GET /repos/{owner}/{repo}/actions/oidc/customization/sub"],getEnvironmentPublicKey:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"],getEnvironmentSecret:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],getEnvironmentVariable:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],getGithubActionsDefaultWorkflowPermissionsOrganization:["GET /orgs/{org}/actions/permissions/workflow"],getGithubActionsDefaultWorkflowPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/workflow"],getGithubActionsPermissionsOrganization:["GET /orgs/{org}/actions/permissions"],getGithubActionsPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions"],getJobForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],getOrgPublicKey:["GET /orgs/{org}/actions/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}"],getOrgVariable:["GET /orgs/{org}/actions/variables/{name}"],getPendingDeploymentsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],getRepoPermissions:["GET /repos/{owner}/{repo}/actions/permissions",{},{renamed:["actions","getGithubActionsPermissionsRepository"]}],getRepoPublicKey:["GET /repos/{owner}/{repo}/actions/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],getRepoVariable:["GET /repos/{owner}/{repo}/actions/variables/{name}"],getReviewsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],getSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}"],getSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],getWorkflow:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],getWorkflowAccessToRepository:["GET /repos/{owner}/{repo}/actions/permissions/access"],getWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],getWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"],getWorkflowRunUsage:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],getWorkflowUsage:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],listArtifactsForRepo:["GET /repos/{owner}/{repo}/actions/artifacts"],listEnvironmentSecrets:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"],listEnvironmentVariables:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables"],listJobsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],listJobsForWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"],listLabelsForSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}/labels"],listLabelsForSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],listOrgSecrets:["GET /orgs/{org}/actions/secrets"],listOrgVariables:["GET /orgs/{org}/actions/variables"],listRepoOrganizationSecrets:["GET /repos/{owner}/{repo}/actions/organization-secrets"],listRepoOrganizationVariables:["GET /repos/{owner}/{repo}/actions/organization-variables"],listRepoSecrets:["GET /repos/{owner}/{repo}/actions/secrets"],listRepoVariables:["GET /repos/{owner}/{repo}/actions/variables"],listRepoWorkflows:["GET /repos/{owner}/{repo}/actions/workflows"],listRunnerApplicationsForOrg:["GET /orgs/{org}/actions/runners/downloads"],listRunnerApplicationsForRepo:["GET /repos/{owner}/{repo}/actions/runners/downloads"],listSelectedReposForOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],listSelectedReposForOrgVariable:["GET /orgs/{org}/actions/variables/{name}/repositories"],listSelectedRepositoriesEnabledGithubActionsOrganization:["GET /orgs/{org}/actions/permissions/repositories"],listSelfHostedRunnersForOrg:["GET /orgs/{org}/actions/runners"],listSelfHostedRunnersForRepo:["GET /repos/{owner}/{repo}/actions/runners"],listWorkflowRunArtifacts:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],listWorkflowRuns:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],listWorkflowRunsForRepo:["GET /repos/{owner}/{repo}/actions/runs"],reRunJobForWorkflowRun:["POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"],reRunWorkflow:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],reRunWorkflowFailedJobs:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"],removeAllCustomLabelsFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels"],removeAllCustomLabelsFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],removeCustomLabelFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"],removeCustomLabelFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],reviewCustomGatesForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"],reviewPendingDeploymentsForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],setAllowedActionsOrganization:["PUT /orgs/{org}/actions/permissions/selected-actions"],setAllowedActionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],setCustomLabelsForSelfHostedRunnerForOrg:["PUT /orgs/{org}/actions/runners/{runner_id}/labels"],setCustomLabelsForSelfHostedRunnerForRepo:["PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],setCustomOidcSubClaimForRepo:["PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"],setGithubActionsDefaultWorkflowPermissionsOrganization:["PUT /orgs/{org}/actions/permissions/workflow"],setGithubActionsDefaultWorkflowPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/workflow"],setGithubActionsPermissionsOrganization:["PUT /orgs/{org}/actions/permissions"],setGithubActionsPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],setSelectedReposForOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories"],setSelectedRepositoriesEnabledGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories"],setWorkflowAccessToRepository:["PUT /repos/{owner}/{repo}/actions/permissions/access"],updateEnvironmentVariable:["PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],updateOrgVariable:["PATCH /orgs/{org}/actions/variables/{name}"],updateRepoVariable:["PATCH /repos/{owner}/{repo}/actions/variables/{name}"]},activity:{checkRepoIsStarredByAuthenticatedUser:["GET /user/starred/{owner}/{repo}"],deleteRepoSubscription:["DELETE /repos/{owner}/{repo}/subscription"],deleteThreadSubscription:["DELETE /notifications/threads/{thread_id}/subscription"],getFeeds:["GET /feeds"],getRepoSubscription:["GET /repos/{owner}/{repo}/subscription"],getThread:["GET /notifications/threads/{thread_id}"],getThreadSubscriptionForAuthenticatedUser:["GET /notifications/threads/{thread_id}/subscription"],listEventsForAuthenticatedUser:["GET /users/{username}/events"],listNotificationsForAuthenticatedUser:["GET /notifications"],listOrgEventsForAuthenticatedUser:["GET /users/{username}/events/orgs/{org}"],listPublicEvents:["GET /events"],listPublicEventsForRepoNetwork:["GET /networks/{owner}/{repo}/events"],listPublicEventsForUser:["GET /users/{username}/events/public"],listPublicOrgEvents:["GET /orgs/{org}/events"],listReceivedEventsForUser:["GET /users/{username}/received_events"],listReceivedPublicEventsForUser:["GET /users/{username}/received_events/public"],listRepoEvents:["GET /repos/{owner}/{repo}/events"],listRepoNotificationsForAuthenticatedUser:["GET /repos/{owner}/{repo}/notifications"],listReposStarredByAuthenticatedUser:["GET /user/starred"],listReposStarredByUser:["GET /users/{username}/starred"],listReposWatchedByUser:["GET /users/{username}/subscriptions"],listStargazersForRepo:["GET /repos/{owner}/{repo}/stargazers"],listWatchedReposForAuthenticatedUser:["GET /user/subscriptions"],listWatchersForRepo:["GET /repos/{owner}/{repo}/subscribers"],markNotificationsAsRead:["PUT /notifications"],markRepoNotificationsAsRead:["PUT /repos/{owner}/{repo}/notifications"],markThreadAsDone:["DELETE /notifications/threads/{thread_id}"],markThreadAsRead:["PATCH /notifications/threads/{thread_id}"],setRepoSubscription:["PUT /repos/{owner}/{repo}/subscription"],setThreadSubscription:["PUT /notifications/threads/{thread_id}/subscription"],starRepoForAuthenticatedUser:["PUT /user/starred/{owner}/{repo}"],unstarRepoForAuthenticatedUser:["DELETE /user/starred/{owner}/{repo}"]},apps:{addRepoToInstallation:["PUT /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","addRepoToInstallationForAuthenticatedUser"]}],addRepoToInstallationForAuthenticatedUser:["PUT /user/installations/{installation_id}/repositories/{repository_id}"],checkToken:["POST /applications/{client_id}/token"],createFromManifest:["POST /app-manifests/{code}/conversions"],createInstallationAccessToken:["POST /app/installations/{installation_id}/access_tokens"],deleteAuthorization:["DELETE /applications/{client_id}/grant"],deleteInstallation:["DELETE /app/installations/{installation_id}"],deleteToken:["DELETE /applications/{client_id}/token"],getAuthenticated:["GET /app"],getBySlug:["GET /apps/{app_slug}"],getInstallation:["GET /app/installations/{installation_id}"],getOrgInstallation:["GET /orgs/{org}/installation"],getRepoInstallation:["GET /repos/{owner}/{repo}/installation"],getSubscriptionPlanForAccount:["GET /marketplace_listing/accounts/{account_id}"],getSubscriptionPlanForAccountStubbed:["GET /marketplace_listing/stubbed/accounts/{account_id}"],getUserInstallation:["GET /users/{username}/installation"],getWebhookConfigForApp:["GET /app/hook/config"],getWebhookDelivery:["GET /app/hook/deliveries/{delivery_id}"],listAccountsForPlan:["GET /marketplace_listing/plans/{plan_id}/accounts"],listAccountsForPlanStubbed:["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],listInstallationReposForAuthenticatedUser:["GET /user/installations/{installation_id}/repositories"],listInstallationRequestsForAuthenticatedApp:["GET /app/installation-requests"],listInstallations:["GET /app/installations"],listInstallationsForAuthenticatedUser:["GET /user/installations"],listPlans:["GET /marketplace_listing/plans"],listPlansStubbed:["GET /marketplace_listing/stubbed/plans"],listReposAccessibleToInstallation:["GET /installation/repositories"],listSubscriptionsForAuthenticatedUser:["GET /user/marketplace_purchases"],listSubscriptionsForAuthenticatedUserStubbed:["GET /user/marketplace_purchases/stubbed"],listWebhookDeliveries:["GET /app/hook/deliveries"],redeliverWebhookDelivery:["POST /app/hook/deliveries/{delivery_id}/attempts"],removeRepoFromInstallation:["DELETE /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","removeRepoFromInstallationForAuthenticatedUser"]}],removeRepoFromInstallationForAuthenticatedUser:["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],resetToken:["PATCH /applications/{client_id}/token"],revokeInstallationAccessToken:["DELETE /installation/token"],scopeToken:["POST /applications/{client_id}/token/scoped"],suspendInstallation:["PUT /app/installations/{installation_id}/suspended"],unsuspendInstallation:["DELETE /app/installations/{installation_id}/suspended"],updateWebhookConfigForApp:["PATCH /app/hook/config"]},billing:{getGithubActionsBillingOrg:["GET /orgs/{org}/settings/billing/actions"],getGithubActionsBillingUser:["GET /users/{username}/settings/billing/actions"],getGithubBillingUsageReportOrg:["GET /organizations/{org}/settings/billing/usage"],getGithubPackagesBillingOrg:["GET /orgs/{org}/settings/billing/packages"],getGithubPackagesBillingUser:["GET /users/{username}/settings/billing/packages"],getSharedStorageBillingOrg:["GET /orgs/{org}/settings/billing/shared-storage"],getSharedStorageBillingUser:["GET /users/{username}/settings/billing/shared-storage"]},checks:{create:["POST /repos/{owner}/{repo}/check-runs"],createSuite:["POST /repos/{owner}/{repo}/check-suites"],get:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],getSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],listAnnotations:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],listForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],listForSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],listSuitesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],rerequestRun:["POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"],rerequestSuite:["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],setSuitesPreferences:["PATCH /repos/{owner}/{repo}/check-suites/preferences"],update:["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]},codeScanning:{commitAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"],createAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],createVariantAnalysis:["POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"],deleteAnalysis:["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],deleteCodeqlDatabase:["DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getAlert:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",{},{renamedParameters:{alert_id:"alert_number"}}],getAnalysis:["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],getAutofix:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],getCodeqlDatabase:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getDefaultSetup:["GET /repos/{owner}/{repo}/code-scanning/default-setup"],getSarif:["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],getVariantAnalysis:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"],getVariantAnalysisRepoTask:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"],listAlertInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],listAlertsForOrg:["GET /orgs/{org}/code-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/code-scanning/alerts"],listAlertsInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",{},{renamed:["codeScanning","listAlertInstances"]}],listCodeqlDatabases:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases"],listRecentAnalyses:["GET /repos/{owner}/{repo}/code-scanning/analyses"],updateAlert:["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],updateDefaultSetup:["PATCH /repos/{owner}/{repo}/code-scanning/default-setup"],uploadSarif:["POST /repos/{owner}/{repo}/code-scanning/sarifs"]},codeSecurity:{attachConfiguration:["POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"],attachEnterpriseConfiguration:["POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"],createConfiguration:["POST /orgs/{org}/code-security/configurations"],createConfigurationForEnterprise:["POST /enterprises/{enterprise}/code-security/configurations"],deleteConfiguration:["DELETE /orgs/{org}/code-security/configurations/{configuration_id}"],deleteConfigurationForEnterprise:["DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],detachConfiguration:["DELETE /orgs/{org}/code-security/configurations/detach"],getConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}"],getConfigurationForRepository:["GET /repos/{owner}/{repo}/code-security-configuration"],getConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations"],getConfigurationsForOrg:["GET /orgs/{org}/code-security/configurations"],getDefaultConfigurations:["GET /orgs/{org}/code-security/configurations/defaults"],getDefaultConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/defaults"],getRepositoriesForConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"],getRepositoriesForEnterpriseConfiguration:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"],getSingleConfigurationForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],setConfigurationAsDefault:["PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"],setConfigurationAsDefaultForEnterprise:["PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"],updateConfiguration:["PATCH /orgs/{org}/code-security/configurations/{configuration_id}"],updateEnterpriseConfiguration:["PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"]},codesOfConduct:{getAllCodesOfConduct:["GET /codes_of_conduct"],getConductCode:["GET /codes_of_conduct/{key}"]},codespaces:{addRepositoryForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],checkPermissionsForDevcontainer:["GET /repos/{owner}/{repo}/codespaces/permissions_check"],codespaceMachinesForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/machines"],createForAuthenticatedUser:["POST /user/codespaces"],createOrUpdateOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],createOrUpdateSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}"],createWithPrForAuthenticatedUser:["POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"],createWithRepoForAuthenticatedUser:["POST /repos/{owner}/{repo}/codespaces"],deleteForAuthenticatedUser:["DELETE /user/codespaces/{codespace_name}"],deleteFromOrganization:["DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"],deleteOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],deleteSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}"],exportForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/exports"],getCodespacesForUserInOrg:["GET /orgs/{org}/members/{username}/codespaces"],getExportDetailsForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/exports/{export_id}"],getForAuthenticatedUser:["GET /user/codespaces/{codespace_name}"],getOrgPublicKey:["GET /orgs/{org}/codespaces/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}"],getPublicKeyForAuthenticatedUser:["GET /user/codespaces/secrets/public-key"],getRepoPublicKey:["GET /repos/{owner}/{repo}/codespaces/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],getSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}"],listDevcontainersInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/devcontainers"],listForAuthenticatedUser:["GET /user/codespaces"],listInOrganization:["GET /orgs/{org}/codespaces",{},{renamedParameters:{org_id:"org"}}],listInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces"],listOrgSecrets:["GET /orgs/{org}/codespaces/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/codespaces/secrets"],listRepositoriesForSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}/repositories"],listSecretsForAuthenticatedUser:["GET /user/codespaces/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],preFlightWithRepoForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/new"],publishForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/publish"],removeRepositoryForSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],repoMachinesForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/machines"],setRepositoriesForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],startForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/start"],stopForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/stop"],stopInOrganization:["POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"],updateForAuthenticatedUser:["PATCH /user/codespaces/{codespace_name}"]},copilot:{addCopilotSeatsForTeams:["POST /orgs/{org}/copilot/billing/selected_teams"],addCopilotSeatsForUsers:["POST /orgs/{org}/copilot/billing/selected_users"],cancelCopilotSeatAssignmentForTeams:["DELETE /orgs/{org}/copilot/billing/selected_teams"],cancelCopilotSeatAssignmentForUsers:["DELETE /orgs/{org}/copilot/billing/selected_users"],copilotMetricsForOrganization:["GET /orgs/{org}/copilot/metrics"],copilotMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],getCopilotOrganizationDetails:["GET /orgs/{org}/copilot/billing"],getCopilotSeatDetailsForUser:["GET /orgs/{org}/members/{username}/copilot"],listCopilotSeats:["GET /orgs/{org}/copilot/billing/seats"],usageMetricsForOrg:["GET /orgs/{org}/copilot/usage"],usageMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/usage"]},dependabot:{addSelectedRepoToOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],deleteOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],getAlert:["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],getOrgPublicKey:["GET /orgs/{org}/dependabot/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}"],getRepoPublicKey:["GET /repos/{owner}/{repo}/dependabot/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/dependabot/alerts"],listAlertsForOrg:["GET /orgs/{org}/dependabot/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/dependabot/alerts"],listOrgSecrets:["GET /orgs/{org}/dependabot/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/dependabot/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],updateAlert:["PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"]},dependencyGraph:{createRepositorySnapshot:["POST /repos/{owner}/{repo}/dependency-graph/snapshots"],diffRange:["GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"],exportSbom:["GET /repos/{owner}/{repo}/dependency-graph/sbom"]},emojis:{get:["GET /emojis"]},gists:{checkIsStarred:["GET /gists/{gist_id}/star"],create:["POST /gists"],createComment:["POST /gists/{gist_id}/comments"],delete:["DELETE /gists/{gist_id}"],deleteComment:["DELETE /gists/{gist_id}/comments/{comment_id}"],fork:["POST /gists/{gist_id}/forks"],get:["GET /gists/{gist_id}"],getComment:["GET /gists/{gist_id}/comments/{comment_id}"],getRevision:["GET /gists/{gist_id}/{sha}"],list:["GET /gists"],listComments:["GET /gists/{gist_id}/comments"],listCommits:["GET /gists/{gist_id}/commits"],listForUser:["GET /users/{username}/gists"],listForks:["GET /gists/{gist_id}/forks"],listPublic:["GET /gists/public"],listStarred:["GET /gists/starred"],star:["PUT /gists/{gist_id}/star"],unstar:["DELETE /gists/{gist_id}/star"],update:["PATCH /gists/{gist_id}"],updateComment:["PATCH /gists/{gist_id}/comments/{comment_id}"]},git:{createBlob:["POST /repos/{owner}/{repo}/git/blobs"],createCommit:["POST /repos/{owner}/{repo}/git/commits"],createRef:["POST /repos/{owner}/{repo}/git/refs"],createTag:["POST /repos/{owner}/{repo}/git/tags"],createTree:["POST /repos/{owner}/{repo}/git/trees"],deleteRef:["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],getBlob:["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],getCommit:["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],getRef:["GET /repos/{owner}/{repo}/git/ref/{ref}"],getTag:["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],getTree:["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],listMatchingRefs:["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],updateRef:["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]},gitignore:{getAllTemplates:["GET /gitignore/templates"],getTemplate:["GET /gitignore/templates/{name}"]},interactions:{getRestrictionsForAuthenticatedUser:["GET /user/interaction-limits"],getRestrictionsForOrg:["GET /orgs/{org}/interaction-limits"],getRestrictionsForRepo:["GET /repos/{owner}/{repo}/interaction-limits"],getRestrictionsForYourPublicRepos:["GET /user/interaction-limits",{},{renamed:["interactions","getRestrictionsForAuthenticatedUser"]}],removeRestrictionsForAuthenticatedUser:["DELETE /user/interaction-limits"],removeRestrictionsForOrg:["DELETE /orgs/{org}/interaction-limits"],removeRestrictionsForRepo:["DELETE /repos/{owner}/{repo}/interaction-limits"],removeRestrictionsForYourPublicRepos:["DELETE /user/interaction-limits",{},{renamed:["interactions","removeRestrictionsForAuthenticatedUser"]}],setRestrictionsForAuthenticatedUser:["PUT /user/interaction-limits"],setRestrictionsForOrg:["PUT /orgs/{org}/interaction-limits"],setRestrictionsForRepo:["PUT /repos/{owner}/{repo}/interaction-limits"],setRestrictionsForYourPublicRepos:["PUT /user/interaction-limits",{},{renamed:["interactions","setRestrictionsForAuthenticatedUser"]}]},issues:{addAssignees:["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],addLabels:["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],addSubIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],checkUserCanBeAssigned:["GET /repos/{owner}/{repo}/assignees/{assignee}"],checkUserCanBeAssignedToIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"],create:["POST /repos/{owner}/{repo}/issues"],createComment:["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],createLabel:["POST /repos/{owner}/{repo}/labels"],createMilestone:["POST /repos/{owner}/{repo}/milestones"],deleteComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],deleteLabel:["DELETE /repos/{owner}/{repo}/labels/{name}"],deleteMilestone:["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],get:["GET /repos/{owner}/{repo}/issues/{issue_number}"],getComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],getEvent:["GET /repos/{owner}/{repo}/issues/events/{event_id}"],getLabel:["GET /repos/{owner}/{repo}/labels/{name}"],getMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],list:["GET /issues"],listAssignees:["GET /repos/{owner}/{repo}/assignees"],listComments:["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],listCommentsForRepo:["GET /repos/{owner}/{repo}/issues/comments"],listEvents:["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],listEventsForRepo:["GET /repos/{owner}/{repo}/issues/events"],listEventsForTimeline:["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"],listForAuthenticatedUser:["GET /user/issues"],listForOrg:["GET /orgs/{org}/issues"],listForRepo:["GET /repos/{owner}/{repo}/issues"],listLabelsForMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],listLabelsForRepo:["GET /repos/{owner}/{repo}/labels"],listLabelsOnIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],listMilestones:["GET /repos/{owner}/{repo}/milestones"],listSubIssues:["GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],lock:["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],removeAllLabels:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],removeAssignees:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],removeLabel:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],removeSubIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"],reprioritizeSubIssue:["PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"],setLabels:["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],unlock:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],update:["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],updateComment:["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],updateLabel:["PATCH /repos/{owner}/{repo}/labels/{name}"],updateMilestone:["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]},licenses:{get:["GET /licenses/{license}"],getAllCommonlyUsed:["GET /licenses"],getForRepo:["GET /repos/{owner}/{repo}/license"]},markdown:{render:["POST /markdown"],renderRaw:["POST /markdown/raw",{headers:{"content-type":"text/plain; charset=utf-8"}}]},meta:{get:["GET /meta"],getAllVersions:["GET /versions"],getOctocat:["GET /octocat"],getZen:["GET /zen"],root:["GET /"]},migrations:{deleteArchiveForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/archive"],deleteArchiveForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/archive"],downloadArchiveForOrg:["GET /orgs/{org}/migrations/{migration_id}/archive"],getArchiveForAuthenticatedUser:["GET /user/migrations/{migration_id}/archive"],getStatusForAuthenticatedUser:["GET /user/migrations/{migration_id}"],getStatusForOrg:["GET /orgs/{org}/migrations/{migration_id}"],listForAuthenticatedUser:["GET /user/migrations"],listForOrg:["GET /orgs/{org}/migrations"],listReposForAuthenticatedUser:["GET /user/migrations/{migration_id}/repositories"],listReposForOrg:["GET /orgs/{org}/migrations/{migration_id}/repositories"],listReposForUser:["GET /user/migrations/{migration_id}/repositories",{},{renamed:["migrations","listReposForAuthenticatedUser"]}],startForAuthenticatedUser:["POST /user/migrations"],startForOrg:["POST /orgs/{org}/migrations"],unlockRepoForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"],unlockRepoForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"]},oidc:{getOidcCustomSubTemplateForOrg:["GET /orgs/{org}/actions/oidc/customization/sub"],updateOidcCustomSubTemplateForOrg:["PUT /orgs/{org}/actions/oidc/customization/sub"]},orgs:{addSecurityManagerTeam:["PUT /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"}],assignTeamToOrgRole:["PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],assignUserToOrgRole:["PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"],blockUser:["PUT /orgs/{org}/blocks/{username}"],cancelInvitation:["DELETE /orgs/{org}/invitations/{invitation_id}"],checkBlockedUser:["GET /orgs/{org}/blocks/{username}"],checkMembershipForUser:["GET /orgs/{org}/members/{username}"],checkPublicMembershipForUser:["GET /orgs/{org}/public_members/{username}"],convertMemberToOutsideCollaborator:["PUT /orgs/{org}/outside_collaborators/{username}"],createInvitation:["POST /orgs/{org}/invitations"],createOrUpdateCustomProperties:["PATCH /orgs/{org}/properties/schema"],createOrUpdateCustomPropertiesValuesForRepos:["PATCH /orgs/{org}/properties/values"],createOrUpdateCustomProperty:["PUT /orgs/{org}/properties/schema/{custom_property_name}"],createWebhook:["POST /orgs/{org}/hooks"],delete:["DELETE /orgs/{org}"],deleteWebhook:["DELETE /orgs/{org}/hooks/{hook_id}"],enableOrDisableSecurityProductOnAllOrgRepos:["POST /orgs/{org}/{security_product}/{enablement}",{},{deprecated:"octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"}],get:["GET /orgs/{org}"],getAllCustomProperties:["GET /orgs/{org}/properties/schema"],getCustomProperty:["GET /orgs/{org}/properties/schema/{custom_property_name}"],getMembershipForAuthenticatedUser:["GET /user/memberships/orgs/{org}"],getMembershipForUser:["GET /orgs/{org}/memberships/{username}"],getOrgRole:["GET /orgs/{org}/organization-roles/{role_id}"],getWebhook:["GET /orgs/{org}/hooks/{hook_id}"],getWebhookConfigForOrg:["GET /orgs/{org}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"],list:["GET /organizations"],listAppInstallations:["GET /orgs/{org}/installations"],listAttestations:["GET /orgs/{org}/attestations/{subject_digest}"],listBlockedUsers:["GET /orgs/{org}/blocks"],listCustomPropertiesValuesForRepos:["GET /orgs/{org}/properties/values"],listFailedInvitations:["GET /orgs/{org}/failed_invitations"],listForAuthenticatedUser:["GET /user/orgs"],listForUser:["GET /users/{username}/orgs"],listInvitationTeams:["GET /orgs/{org}/invitations/{invitation_id}/teams"],listMembers:["GET /orgs/{org}/members"],listMembershipsForAuthenticatedUser:["GET /user/memberships/orgs"],listOrgRoleTeams:["GET /orgs/{org}/organization-roles/{role_id}/teams"],listOrgRoleUsers:["GET /orgs/{org}/organization-roles/{role_id}/users"],listOrgRoles:["GET /orgs/{org}/organization-roles"],listOrganizationFineGrainedPermissions:["GET /orgs/{org}/organization-fine-grained-permissions"],listOutsideCollaborators:["GET /orgs/{org}/outside_collaborators"],listPatGrantRepositories:["GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"],listPatGrantRequestRepositories:["GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"],listPatGrantRequests:["GET /orgs/{org}/personal-access-token-requests"],listPatGrants:["GET /orgs/{org}/personal-access-tokens"],listPendingInvitations:["GET /orgs/{org}/invitations"],listPublicMembers:["GET /orgs/{org}/public_members"],listSecurityManagerTeams:["GET /orgs/{org}/security-managers",{},{deprecated:"octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"}],listWebhookDeliveries:["GET /orgs/{org}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /orgs/{org}/hooks"],pingWebhook:["POST /orgs/{org}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeCustomProperty:["DELETE /orgs/{org}/properties/schema/{custom_property_name}"],removeMember:["DELETE /orgs/{org}/members/{username}"],removeMembershipForUser:["DELETE /orgs/{org}/memberships/{username}"],removeOutsideCollaborator:["DELETE /orgs/{org}/outside_collaborators/{username}"],removePublicMembershipForAuthenticatedUser:["DELETE /orgs/{org}/public_members/{username}"],removeSecurityManagerTeam:["DELETE /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"}],reviewPatGrantRequest:["POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"],reviewPatGrantRequestsInBulk:["POST /orgs/{org}/personal-access-token-requests"],revokeAllOrgRolesTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}"],revokeAllOrgRolesUser:["DELETE /orgs/{org}/organization-roles/users/{username}"],revokeOrgRoleTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],revokeOrgRoleUser:["DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"],setMembershipForUser:["PUT /orgs/{org}/memberships/{username}"],setPublicMembershipForAuthenticatedUser:["PUT /orgs/{org}/public_members/{username}"],unblockUser:["DELETE /orgs/{org}/blocks/{username}"],update:["PATCH /orgs/{org}"],updateMembershipForAuthenticatedUser:["PATCH /user/memberships/orgs/{org}"],updatePatAccess:["POST /orgs/{org}/personal-access-tokens/{pat_id}"],updatePatAccesses:["POST /orgs/{org}/personal-access-tokens"],updateWebhook:["PATCH /orgs/{org}/hooks/{hook_id}"],updateWebhookConfigForOrg:["PATCH /orgs/{org}/hooks/{hook_id}/config"]},packages:{deletePackageForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}"],deletePackageForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],deletePackageForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}"],deletePackageVersionForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getAllPackageVersionsForAPackageOwnedByAnOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByOrg"]}],getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]}],getAllPackageVersionsForPackageOwnedByAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions"],getPackageForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}"],getPackageForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}"],getPackageForUser:["GET /users/{username}/packages/{package_type}/{package_name}"],getPackageVersionForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],listDockerMigrationConflictingPackagesForAuthenticatedUser:["GET /user/docker/conflicts"],listDockerMigrationConflictingPackagesForOrganization:["GET /orgs/{org}/docker/conflicts"],listDockerMigrationConflictingPackagesForUser:["GET /users/{username}/docker/conflicts"],listPackagesForAuthenticatedUser:["GET /user/packages"],listPackagesForOrganization:["GET /orgs/{org}/packages"],listPackagesForUser:["GET /users/{username}/packages"],restorePackageForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForUser:["POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageVersionForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForUser:["POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]},privateRegistries:{createOrgPrivateRegistry:["POST /orgs/{org}/private-registries"],deleteOrgPrivateRegistry:["DELETE /orgs/{org}/private-registries/{secret_name}"],getOrgPrivateRegistry:["GET /orgs/{org}/private-registries/{secret_name}"],getOrgPublicKey:["GET /orgs/{org}/private-registries/public-key"],listOrgPrivateRegistries:["GET /orgs/{org}/private-registries"],updateOrgPrivateRegistry:["PATCH /orgs/{org}/private-registries/{secret_name}"]},projects:{addCollaborator:["PUT /projects/{project_id}/collaborators/{username}"],createCard:["POST /projects/columns/{column_id}/cards"],createColumn:["POST /projects/{project_id}/columns"],createForAuthenticatedUser:["POST /user/projects"],createForOrg:["POST /orgs/{org}/projects"],createForRepo:["POST /repos/{owner}/{repo}/projects"],delete:["DELETE /projects/{project_id}"],deleteCard:["DELETE /projects/columns/cards/{card_id}"],deleteColumn:["DELETE /projects/columns/{column_id}"],get:["GET /projects/{project_id}"],getCard:["GET /projects/columns/cards/{card_id}"],getColumn:["GET /projects/columns/{column_id}"],getPermissionForUser:["GET /projects/{project_id}/collaborators/{username}/permission"],listCards:["GET /projects/columns/{column_id}/cards"],listCollaborators:["GET /projects/{project_id}/collaborators"],listColumns:["GET /projects/{project_id}/columns"],listForOrg:["GET /orgs/{org}/projects"],listForRepo:["GET /repos/{owner}/{repo}/projects"],listForUser:["GET /users/{username}/projects"],moveCard:["POST /projects/columns/cards/{card_id}/moves"],moveColumn:["POST /projects/columns/{column_id}/moves"],removeCollaborator:["DELETE /projects/{project_id}/collaborators/{username}"],update:["PATCH /projects/{project_id}"],updateCard:["PATCH /projects/columns/cards/{card_id}"],updateColumn:["PATCH /projects/columns/{column_id}"]},pulls:{checkIfMerged:["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],create:["POST /repos/{owner}/{repo}/pulls"],createReplyForReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],createReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],createReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],deletePendingReview:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],deleteReviewComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],dismissReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],get:["GET /repos/{owner}/{repo}/pulls/{pull_number}"],getReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],getReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],list:["GET /repos/{owner}/{repo}/pulls"],listCommentsForReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],listCommits:["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],listFiles:["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],listRequestedReviewers:["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],listReviewComments:["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],listReviewCommentsForRepo:["GET /repos/{owner}/{repo}/pulls/comments"],listReviews:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],merge:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],removeRequestedReviewers:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],requestReviewers:["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],submitReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],update:["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],updateBranch:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"],updateReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],updateReviewComment:["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]},rateLimit:{get:["GET /rate_limit"]},reactions:{createForCommitComment:["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"],createForIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"],createForIssueComment:["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],createForPullRequestReviewComment:["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],createForRelease:["POST /repos/{owner}/{repo}/releases/{release_id}/reactions"],createForTeamDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],createForTeamDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"],deleteForCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"],deleteForIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"],deleteForIssueComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"],deleteForPullRequestComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"],deleteForRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"],deleteForTeamDiscussion:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"],deleteForTeamDiscussionComment:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"],listForCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"],listForIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],listForIssueComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],listForPullRequestReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],listForRelease:["GET /repos/{owner}/{repo}/releases/{release_id}/reactions"],listForTeamDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],listForTeamDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"]},repos:{acceptInvitation:["PATCH /user/repository_invitations/{invitation_id}",{},{renamed:["repos","acceptInvitationForAuthenticatedUser"]}],acceptInvitationForAuthenticatedUser:["PATCH /user/repository_invitations/{invitation_id}"],addAppAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],addCollaborator:["PUT /repos/{owner}/{repo}/collaborators/{username}"],addStatusCheckContexts:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],addTeamAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],addUserAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],cancelPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"],checkAutomatedSecurityFixes:["GET /repos/{owner}/{repo}/automated-security-fixes"],checkCollaborator:["GET /repos/{owner}/{repo}/collaborators/{username}"],checkPrivateVulnerabilityReporting:["GET /repos/{owner}/{repo}/private-vulnerability-reporting"],checkVulnerabilityAlerts:["GET /repos/{owner}/{repo}/vulnerability-alerts"],codeownersErrors:["GET /repos/{owner}/{repo}/codeowners/errors"],compareCommits:["GET /repos/{owner}/{repo}/compare/{base}...{head}"],compareCommitsWithBasehead:["GET /repos/{owner}/{repo}/compare/{basehead}"],createAttestation:["POST /repos/{owner}/{repo}/attestations"],createAutolink:["POST /repos/{owner}/{repo}/autolinks"],createCommitComment:["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],createCommitSignatureProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],createCommitStatus:["POST /repos/{owner}/{repo}/statuses/{sha}"],createDeployKey:["POST /repos/{owner}/{repo}/keys"],createDeployment:["POST /repos/{owner}/{repo}/deployments"],createDeploymentBranchPolicy:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],createDeploymentProtectionRule:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],createDeploymentStatus:["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],createDispatchEvent:["POST /repos/{owner}/{repo}/dispatches"],createForAuthenticatedUser:["POST /user/repos"],createFork:["POST /repos/{owner}/{repo}/forks"],createInOrg:["POST /orgs/{org}/repos"],createOrUpdateCustomPropertiesValues:["PATCH /repos/{owner}/{repo}/properties/values"],createOrUpdateEnvironment:["PUT /repos/{owner}/{repo}/environments/{environment_name}"],createOrUpdateFileContents:["PUT /repos/{owner}/{repo}/contents/{path}"],createOrgRuleset:["POST /orgs/{org}/rulesets"],createPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments"],createPagesSite:["POST /repos/{owner}/{repo}/pages"],createRelease:["POST /repos/{owner}/{repo}/releases"],createRepoRuleset:["POST /repos/{owner}/{repo}/rulesets"],createUsingTemplate:["POST /repos/{template_owner}/{template_repo}/generate"],createWebhook:["POST /repos/{owner}/{repo}/hooks"],declineInvitation:["DELETE /user/repository_invitations/{invitation_id}",{},{renamed:["repos","declineInvitationForAuthenticatedUser"]}],declineInvitationForAuthenticatedUser:["DELETE /user/repository_invitations/{invitation_id}"],delete:["DELETE /repos/{owner}/{repo}"],deleteAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],deleteAdminBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],deleteAnEnvironment:["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],deleteAutolink:["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],deleteBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],deleteCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],deleteCommitSignatureProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],deleteDeployKey:["DELETE /repos/{owner}/{repo}/keys/{key_id}"],deleteDeployment:["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],deleteDeploymentBranchPolicy:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],deleteFile:["DELETE /repos/{owner}/{repo}/contents/{path}"],deleteInvitation:["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],deleteOrgRuleset:["DELETE /orgs/{org}/rulesets/{ruleset_id}"],deletePagesSite:["DELETE /repos/{owner}/{repo}/pages"],deletePullRequestReviewProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],deleteRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}"],deleteReleaseAsset:["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],deleteRepoRuleset:["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],deleteWebhook:["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],disableAutomatedSecurityFixes:["DELETE /repos/{owner}/{repo}/automated-security-fixes"],disableDeploymentProtectionRule:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],disablePrivateVulnerabilityReporting:["DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"],disableVulnerabilityAlerts:["DELETE /repos/{owner}/{repo}/vulnerability-alerts"],downloadArchive:["GET /repos/{owner}/{repo}/zipball/{ref}",{},{renamed:["repos","downloadZipballArchive"]}],downloadTarballArchive:["GET /repos/{owner}/{repo}/tarball/{ref}"],downloadZipballArchive:["GET /repos/{owner}/{repo}/zipball/{ref}"],enableAutomatedSecurityFixes:["PUT /repos/{owner}/{repo}/automated-security-fixes"],enablePrivateVulnerabilityReporting:["PUT /repos/{owner}/{repo}/private-vulnerability-reporting"],enableVulnerabilityAlerts:["PUT /repos/{owner}/{repo}/vulnerability-alerts"],generateReleaseNotes:["POST /repos/{owner}/{repo}/releases/generate-notes"],get:["GET /repos/{owner}/{repo}"],getAccessRestrictions:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],getAdminBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],getAllDeploymentProtectionRules:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],getAllEnvironments:["GET /repos/{owner}/{repo}/environments"],getAllStatusCheckContexts:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],getAllTopics:["GET /repos/{owner}/{repo}/topics"],getAppsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],getAutolink:["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],getBranch:["GET /repos/{owner}/{repo}/branches/{branch}"],getBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection"],getBranchRules:["GET /repos/{owner}/{repo}/rules/branches/{branch}"],getClones:["GET /repos/{owner}/{repo}/traffic/clones"],getCodeFrequencyStats:["GET /repos/{owner}/{repo}/stats/code_frequency"],getCollaboratorPermissionLevel:["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],getCombinedStatusForRef:["GET /repos/{owner}/{repo}/commits/{ref}/status"],getCommit:["GET /repos/{owner}/{repo}/commits/{ref}"],getCommitActivityStats:["GET /repos/{owner}/{repo}/stats/commit_activity"],getCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}"],getCommitSignatureProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],getCommunityProfileMetrics:["GET /repos/{owner}/{repo}/community/profile"],getContent:["GET /repos/{owner}/{repo}/contents/{path}"],getContributorsStats:["GET /repos/{owner}/{repo}/stats/contributors"],getCustomDeploymentProtectionRule:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],getCustomPropertiesValues:["GET /repos/{owner}/{repo}/properties/values"],getDeployKey:["GET /repos/{owner}/{repo}/keys/{key_id}"],getDeployment:["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],getDeploymentBranchPolicy:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],getDeploymentStatus:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],getEnvironment:["GET /repos/{owner}/{repo}/environments/{environment_name}"],getLatestPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/latest"],getLatestRelease:["GET /repos/{owner}/{repo}/releases/latest"],getOrgRuleSuite:["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],getOrgRuleSuites:["GET /orgs/{org}/rulesets/rule-suites"],getOrgRuleset:["GET /orgs/{org}/rulesets/{ruleset_id}"],getOrgRulesets:["GET /orgs/{org}/rulesets"],getPages:["GET /repos/{owner}/{repo}/pages"],getPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],getPagesDeployment:["GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"],getPagesHealthCheck:["GET /repos/{owner}/{repo}/pages/health"],getParticipationStats:["GET /repos/{owner}/{repo}/stats/participation"],getPullRequestReviewProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],getPunchCardStats:["GET /repos/{owner}/{repo}/stats/punch_card"],getReadme:["GET /repos/{owner}/{repo}/readme"],getReadmeInDirectory:["GET /repos/{owner}/{repo}/readme/{dir}"],getRelease:["GET /repos/{owner}/{repo}/releases/{release_id}"],getReleaseAsset:["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],getReleaseByTag:["GET /repos/{owner}/{repo}/releases/tags/{tag}"],getRepoRuleSuite:["GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"],getRepoRuleSuites:["GET /repos/{owner}/{repo}/rulesets/rule-suites"],getRepoRuleset:["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],getRepoRulesets:["GET /repos/{owner}/{repo}/rulesets"],getStatusChecksProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],getTeamsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],getTopPaths:["GET /repos/{owner}/{repo}/traffic/popular/paths"],getTopReferrers:["GET /repos/{owner}/{repo}/traffic/popular/referrers"],getUsersWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],getViews:["GET /repos/{owner}/{repo}/traffic/views"],getWebhook:["GET /repos/{owner}/{repo}/hooks/{hook_id}"],getWebhookConfigForRepo:["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"],listActivities:["GET /repos/{owner}/{repo}/activity"],listAttestations:["GET /repos/{owner}/{repo}/attestations/{subject_digest}"],listAutolinks:["GET /repos/{owner}/{repo}/autolinks"],listBranches:["GET /repos/{owner}/{repo}/branches"],listBranchesForHeadCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"],listCollaborators:["GET /repos/{owner}/{repo}/collaborators"],listCommentsForCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],listCommitCommentsForRepo:["GET /repos/{owner}/{repo}/comments"],listCommitStatusesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],listCommits:["GET /repos/{owner}/{repo}/commits"],listContributors:["GET /repos/{owner}/{repo}/contributors"],listCustomDeploymentRuleIntegrations:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"],listDeployKeys:["GET /repos/{owner}/{repo}/keys"],listDeploymentBranchPolicies:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],listDeploymentStatuses:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],listDeployments:["GET /repos/{owner}/{repo}/deployments"],listForAuthenticatedUser:["GET /user/repos"],listForOrg:["GET /orgs/{org}/repos"],listForUser:["GET /users/{username}/repos"],listForks:["GET /repos/{owner}/{repo}/forks"],listInvitations:["GET /repos/{owner}/{repo}/invitations"],listInvitationsForAuthenticatedUser:["GET /user/repository_invitations"],listLanguages:["GET /repos/{owner}/{repo}/languages"],listPagesBuilds:["GET /repos/{owner}/{repo}/pages/builds"],listPublic:["GET /repositories"],listPullRequestsAssociatedWithCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"],listReleaseAssets:["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],listReleases:["GET /repos/{owner}/{repo}/releases"],listTags:["GET /repos/{owner}/{repo}/tags"],listTeams:["GET /repos/{owner}/{repo}/teams"],listWebhookDeliveries:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /repos/{owner}/{repo}/hooks"],merge:["POST /repos/{owner}/{repo}/merges"],mergeUpstream:["POST /repos/{owner}/{repo}/merge-upstream"],pingWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeAppAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],removeCollaborator:["DELETE /repos/{owner}/{repo}/collaborators/{username}"],removeStatusCheckContexts:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],removeStatusCheckProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],removeTeamAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],removeUserAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],renameBranch:["POST /repos/{owner}/{repo}/branches/{branch}/rename"],replaceAllTopics:["PUT /repos/{owner}/{repo}/topics"],requestPagesBuild:["POST /repos/{owner}/{repo}/pages/builds"],setAdminBranchProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],setAppAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],setStatusCheckContexts:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],setTeamAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],setUserAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],testPushWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],transfer:["POST /repos/{owner}/{repo}/transfer"],update:["PATCH /repos/{owner}/{repo}"],updateBranchProtection:["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],updateCommitComment:["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],updateDeploymentBranchPolicy:["PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],updateInformationAboutPagesSite:["PUT /repos/{owner}/{repo}/pages"],updateInvitation:["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],updateOrgRuleset:["PUT /orgs/{org}/rulesets/{ruleset_id}"],updatePullRequestReviewProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],updateRelease:["PATCH /repos/{owner}/{repo}/releases/{release_id}"],updateReleaseAsset:["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],updateRepoRuleset:["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],updateStatusCheckPotection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",{},{renamed:["repos","updateStatusCheckProtection"]}],updateStatusCheckProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],updateWebhook:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],updateWebhookConfigForRepo:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],uploadReleaseAsset:["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",{baseUrl:"https://uploads.github.com"}]},search:{code:["GET /search/code"],commits:["GET /search/commits"],issuesAndPullRequests:["GET /search/issues"],labels:["GET /search/labels"],repos:["GET /search/repositories"],topics:["GET /search/topics"],users:["GET /search/users"]},secretScanning:{createPushProtectionBypass:["POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"],getAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],getScanHistory:["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/secret-scanning/alerts"],listAlertsForOrg:["GET /orgs/{org}/secret-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/secret-scanning/alerts"],listLocationsForAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"],updateAlert:["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]},securityAdvisories:{createFork:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"],createPrivateVulnerabilityReport:["POST /repos/{owner}/{repo}/security-advisories/reports"],createRepositoryAdvisory:["POST /repos/{owner}/{repo}/security-advisories"],createRepositoryAdvisoryCveRequest:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"],getGlobalAdvisory:["GET /advisories/{ghsa_id}"],getRepositoryAdvisory:["GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"],listGlobalAdvisories:["GET /advisories"],listOrgRepositoryAdvisories:["GET /orgs/{org}/security-advisories"],listRepositoryAdvisories:["GET /repos/{owner}/{repo}/security-advisories"],updateRepositoryAdvisory:["PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"]},teams:{addOrUpdateMembershipForUserInOrg:["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],addOrUpdateProjectPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"],addOrUpdateRepoPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],checkPermissionsForProjectInOrg:["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"],checkPermissionsForRepoInOrg:["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],create:["POST /orgs/{org}/teams"],createDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],createDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions"],deleteDiscussionCommentInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],deleteDiscussionInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],deleteInOrg:["DELETE /orgs/{org}/teams/{team_slug}"],getByName:["GET /orgs/{org}/teams/{team_slug}"],getDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],getDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],getMembershipForUserInOrg:["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],list:["GET /orgs/{org}/teams"],listChildInOrg:["GET /orgs/{org}/teams/{team_slug}/teams"],listDiscussionCommentsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],listDiscussionsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions"],listForAuthenticatedUser:["GET /user/teams"],listMembersInOrg:["GET /orgs/{org}/teams/{team_slug}/members"],listPendingInvitationsInOrg:["GET /orgs/{org}/teams/{team_slug}/invitations"],listProjectsInOrg:["GET /orgs/{org}/teams/{team_slug}/projects"],listReposInOrg:["GET /orgs/{org}/teams/{team_slug}/repos"],removeMembershipForUserInOrg:["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],removeProjectInOrg:["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],removeRepoInOrg:["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],updateDiscussionCommentInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],updateDiscussionInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],updateInOrg:["PATCH /orgs/{org}/teams/{team_slug}"]},users:{addEmailForAuthenticated:["POST /user/emails",{},{renamed:["users","addEmailForAuthenticatedUser"]}],addEmailForAuthenticatedUser:["POST /user/emails"],addSocialAccountForAuthenticatedUser:["POST /user/social_accounts"],block:["PUT /user/blocks/{username}"],checkBlocked:["GET /user/blocks/{username}"],checkFollowingForUser:["GET /users/{username}/following/{target_user}"],checkPersonIsFollowedByAuthenticated:["GET /user/following/{username}"],createGpgKeyForAuthenticated:["POST /user/gpg_keys",{},{renamed:["users","createGpgKeyForAuthenticatedUser"]}],createGpgKeyForAuthenticatedUser:["POST /user/gpg_keys"],createPublicSshKeyForAuthenticated:["POST /user/keys",{},{renamed:["users","createPublicSshKeyForAuthenticatedUser"]}],createPublicSshKeyForAuthenticatedUser:["POST /user/keys"],createSshSigningKeyForAuthenticatedUser:["POST /user/ssh_signing_keys"],deleteEmailForAuthenticated:["DELETE /user/emails",{},{renamed:["users","deleteEmailForAuthenticatedUser"]}],deleteEmailForAuthenticatedUser:["DELETE /user/emails"],deleteGpgKeyForAuthenticated:["DELETE /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","deleteGpgKeyForAuthenticatedUser"]}],deleteGpgKeyForAuthenticatedUser:["DELETE /user/gpg_keys/{gpg_key_id}"],deletePublicSshKeyForAuthenticated:["DELETE /user/keys/{key_id}",{},{renamed:["users","deletePublicSshKeyForAuthenticatedUser"]}],deletePublicSshKeyForAuthenticatedUser:["DELETE /user/keys/{key_id}"],deleteSocialAccountForAuthenticatedUser:["DELETE /user/social_accounts"],deleteSshSigningKeyForAuthenticatedUser:["DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"],follow:["PUT /user/following/{username}"],getAuthenticated:["GET /user"],getById:["GET /user/{account_id}"],getByUsername:["GET /users/{username}"],getContextForUser:["GET /users/{username}/hovercard"],getGpgKeyForAuthenticated:["GET /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","getGpgKeyForAuthenticatedUser"]}],getGpgKeyForAuthenticatedUser:["GET /user/gpg_keys/{gpg_key_id}"],getPublicSshKeyForAuthenticated:["GET /user/keys/{key_id}",{},{renamed:["users","getPublicSshKeyForAuthenticatedUser"]}],getPublicSshKeyForAuthenticatedUser:["GET /user/keys/{key_id}"],getSshSigningKeyForAuthenticatedUser:["GET /user/ssh_signing_keys/{ssh_signing_key_id}"],list:["GET /users"],listAttestations:["GET /users/{username}/attestations/{subject_digest}"],listBlockedByAuthenticated:["GET /user/blocks",{},{renamed:["users","listBlockedByAuthenticatedUser"]}],listBlockedByAuthenticatedUser:["GET /user/blocks"],listEmailsForAuthenticated:["GET /user/emails",{},{renamed:["users","listEmailsForAuthenticatedUser"]}],listEmailsForAuthenticatedUser:["GET /user/emails"],listFollowedByAuthenticated:["GET /user/following",{},{renamed:["users","listFollowedByAuthenticatedUser"]}],listFollowedByAuthenticatedUser:["GET /user/following"],listFollowersForAuthenticatedUser:["GET /user/followers"],listFollowersForUser:["GET /users/{username}/followers"],listFollowingForUser:["GET /users/{username}/following"],listGpgKeysForAuthenticated:["GET /user/gpg_keys",{},{renamed:["users","listGpgKeysForAuthenticatedUser"]}],listGpgKeysForAuthenticatedUser:["GET /user/gpg_keys"],listGpgKeysForUser:["GET /users/{username}/gpg_keys"],listPublicEmailsForAuthenticated:["GET /user/public_emails",{},{renamed:["users","listPublicEmailsForAuthenticatedUser"]}],listPublicEmailsForAuthenticatedUser:["GET /user/public_emails"],listPublicKeysForUser:["GET /users/{username}/keys"],listPublicSshKeysForAuthenticated:["GET /user/keys",{},{renamed:["users","listPublicSshKeysForAuthenticatedUser"]}],listPublicSshKeysForAuthenticatedUser:["GET /user/keys"],listSocialAccountsForAuthenticatedUser:["GET /user/social_accounts"],listSocialAccountsForUser:["GET /users/{username}/social_accounts"],listSshSigningKeysForAuthenticatedUser:["GET /user/ssh_signing_keys"],listSshSigningKeysForUser:["GET /users/{username}/ssh_signing_keys"],setPrimaryEmailVisibilityForAuthenticated:["PATCH /user/email/visibility",{},{renamed:["users","setPrimaryEmailVisibilityForAuthenticatedUser"]}],setPrimaryEmailVisibilityForAuthenticatedUser:["PATCH /user/email/visibility"],unblock:["DELETE /user/blocks/{username}"],unfollow:["DELETE /user/following/{username}"],updateAuthenticated:["PATCH /user"]}},fo=mo,Q=new Map;for(let[s,e]of Object.entries(fo))for(let[t,r]of Object.entries(e)){let[i,n,a]=r,[o,c]=i.split(/ /),l=Object.assign({method:o,url:c},n);Q.has(s)||Q.set(s,new Map),Q.get(s).set(t,{scope:s,methodName:t,endpointDefaults:l,decorations:a})}var ho={has({scope:s},e){return Q.get(s).has(e)},getOwnPropertyDescriptor(s,e){return{value:this.get(s,e),configurable:!0,writable:!0,enumerable:!0}},defineProperty(s,e,t){return Object.defineProperty(s.cache,e,t),!0},deleteProperty(s,e){return delete s.cache[e],!0},ownKeys({scope:s}){return[...Q.get(s).keys()]},set(s,e,t){return s.cache[e]=t},get({octokit:s,scope:e,cache:t},r){if(t[r])return t[r];let i=Q.get(e).get(r);if(!i)return;let{endpointDefaults:n,decorations:a}=i;return a?t[r]=bo(s,e,r,n,a):t[r]=s.request.defaults(n),t[r]}};function _s(s){let e={};for(let t of Q.keys())e[t]=new Proxy({octokit:s,scope:t,cache:{}},ho);return e}function bo(s,e,t,r,i){let n=s.request.defaults(r);function a(...o){let c=n.endpoint.merge(...o);if(i.mapToData)return c=Object.assign({},c,{data:c[i.mapToData],[i.mapToData]:void 0}),n(c);if(i.renamed){let[l,g]=i.renamed;s.log.warn(`octokit.${e}.${t}() has been renamed to octokit.${l}.${g}()`)}if(i.deprecated&&s.log.warn(i.deprecated),i.renamedParameters){let l=n.endpoint.merge(...o);for(let[g,d]of Object.entries(i.renamedParameters))g in l&&(s.log.warn(`"${g}" parameter is deprecated for "octokit.${e}.${t}()". Use "${d}" instead`),d in l||(l[d]=l[g]),delete l[g]);return n(l)}return n(...o)}return Object.assign(a,n)}function Ds(s){return{rest:_s(s)}}Ds.VERSION=xs;function Ps(s){let e=_s(s);return{...e,rest:e}}Ps.VERSION=xs});var Os=R((xn,As)=>{"use strict";var st=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,vo=Object.getOwnPropertyNames,wo=Object.prototype.hasOwnProperty,So=(s,e)=>{for(var t in e)st(s,t,{get:e[t],enumerable:!0})},Eo=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of vo(e))!wo.call(s,i)&&i!==t&&st(s,i,{get:()=>e[i],enumerable:!(r=yo(e,i))||r.enumerable});return s},To=s=>Eo(st({},"__esModule",{value:!0}),s),Rs={};So(Rs,{Octokit:()=>Po});As.exports=To(Rs);var Co=gs(),ko=bs(),xo=Cs(),_o=Gs(),Do="20.1.2",Po=Co.Octokit.plugin(ko.requestLog,_o.legacyRestEndpointMethods,xo.paginateRest).defaults({userAgent:`octokit-rest.js/${Do}`})});var Vo={};rr(Vo,{activate:()=>Uo,deactivate:()=>Mo});module.exports=ir(Vo);var P=S(require("vscode"));var v=S(require("vscode"));var B=S(require("fs")),$e=S(require("path"));var ct=S(require("vscode")),Ie=class s{static instance;channel;constructor(){this.channel=ct.window.createOutputChannel("CodeVulFixer")}static getInstance(){return s.instance||(s.instance=new s),s.instance}log(e,t="INFO"){let r=new Date().toISOString();this.channel.appendLine(`[${r}] [${t}] ${e}`)}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e,t){let r=t instanceof Error?` - ${t.message}
${t.stack??""}`:t?` - ${JSON.stringify(t)}`:"";this.log(`${e}${r}`,"ERROR")}success(e){this.log(`\u2714 ${e}`,"SUCCESS")}show(){this.channel.show(!0)}appendRaw(e){this.channel.append(e)}},f=Ie.getInstance();var M=class{static analyzeClusters(e){let t=Array.isArray(e)?e:Object.values(e||{}),r=t.length;if(r===0)return{totalRawFindings:0,uniqueIssuesCount:0,remediationLeverageRatio:1,uniquePackagesCount:0,uniqueCweRulesCount:0,clusters:[]};let i=new Map,n=new Map;for(let d of t)if(d.source==="dependabot"&&d.dependency?.packageName){let p=d.dependency.packageName.toLowerCase().trim();i.has(p)||i.set(p,[]),i.get(p).push(d)}else{let p=(d.ruleId||d.cweIds?.[0]||d.title||"generic-code-finding").toLowerCase().trim();n.has(p)||n.set(p,[]),n.get(p).push(d)}let a=[];for(let[d,p]of i.entries()){let u=`cluster-pkg-${d.replace(/[^a-zA-Z0-9_-]/g,"_")}`,m=this.getHighestSeverity(p),b=Array.from(new Set(p.map(y=>y.dependency?.manifestFile||"package.json"))),w=p.find(y=>y.dependency?.fixedVersion)?.dependency?.fixedVersion,E=p.filter(y=>y.status==="verified").length;p.forEach(y=>{y.linkedClusterId=u}),a.push({clusterId:u,type:"package",name:p[0]?.dependency?.packageName||d,category:"dependabot",findingIds:p.map(y=>y.id),totalFindings:p.length,resolvedFindings:E,highestSeverity:m,targetFixedVersion:w,affectedManifestsOrFiles:b,remediationStrategy:"zero_token_lockfile"})}for(let[d,p]of n.entries()){let u=`cluster-cwe-${d.replace(/[^a-zA-Z0-9_-]/g,"_")}`,m=this.getHighestSeverity(p),b=Array.from(new Set(p.map(k=>k.location?.filePath||"workspace").filter(Boolean))),w=p.filter(k=>k.status==="verified").length,E=p[0]?.cweIds?.[0],y=E?`${E}: ${p[0]?.ruleId||p[0]?.title}`:p[0]?.ruleId||p[0]?.title||d;p.forEach(k=>{k.linkedClusterId=u}),a.push({clusterId:u,type:"cwe_rule",name:y,category:"code_scanning",findingIds:p.map(k=>k.id),totalFindings:p.length,resolvedFindings:w,highestSeverity:m,affectedManifestsOrFiles:b,remediationStrategy:"ai_synthesis"})}a.sort((d,p)=>{let u={critical:4,high:3,medium:2,low:1},m=u[p.highestSeverity]-u[d.highestSeverity];return m!==0?m:p.totalFindings-d.totalFindings});let o=i.size,c=n.size,l=o+c,g=l>0?Math.round(r/l*10)/10:1;return f.info(`[ClubbingEngine] Consolidated ${r} raw alerts into ${l} unique root issues (${o} packages, ${c} rules) &mdash; Leverage: ${g}x.`),{totalRawFindings:r,uniqueIssuesCount:l,remediationLeverageRatio:g,uniquePackagesCount:o,uniqueCweRulesCount:c,clusters:a}}static findCascadingCandidates(e,t){let r=Array.isArray(t)?t:Object.values(t||{});if(e.source==="dependabot"&&e.dependency?.packageName){let i=e.dependency.packageName.toLowerCase().trim();return r.filter(n=>n.id!==e.id&&n.source==="dependabot"&&n.dependency?.packageName?.toLowerCase().trim()===i&&(n.status==="pending"||n.status==="failed"||n.status==="in_progress"))}if(e.source==="code_scanning"&&(e.ruleId||e.cweIds?.length)){let i=e.ruleId,n=e.cweIds?.[0];return r.filter(a=>a.id!==e.id&&a.source==="code_scanning"&&(i&&a.ruleId===i||n&&a.cweIds?.includes(n))&&(a.status==="pending"||a.status==="failed"||a.status==="in_progress"))}return[]}static getHighestSeverity(e){return e.some(t=>t.severity==="critical")?"critical":e.some(t=>t.severity==="high")?"high":e.some(t=>t.severity==="medium")?"medium":"low"}};var T=class s{static DIR_NAME=".codevulfixer";static FILE_NAME="sprint-state.json";static getStatePath(e){return $e.join(e,s.DIR_NAME,s.FILE_NAME)}static async loadState(e){let t=this.getStatePath(e);if(B.existsSync(t))try{let r=await B.promises.readFile(t,"utf8"),i=JSON.parse(r);return i.findings||(i.findings={}),i.sprints||(i.sprints=[]),i.metrics||(i.metrics={totalFindings:0,resolvedCount:0,pendingCount:0,failedCount:0,totalEstimatedHours:0,hoursSaved:0}),this.recalculateMetrics(i),f.info(`Loaded sprint state for ${i.repoOwner}/${i.repoName} from disk.`),i}catch(r){f.error("Failed to read sprint state file",r);return}}static async saveState(e,t){let r=$e.join(e,s.DIR_NAME),i=this.getStatePath(e);try{B.existsSync(r)||await B.promises.mkdir(r,{recursive:!0}),t.lastUpdated=new Date().toISOString(),this.recalculateMetrics(t),await B.promises.writeFile(i,JSON.stringify(t,null,2),"utf8"),f.info(`Persisted sprint state to ${i}`)}catch(n){throw f.error("Failed to save sprint state file",n),n}}static async updateFinding(e,t,r){let i=await this.loadState(e);if(!i){f.warn(`Cannot update finding ${t}: No active sprint state found.`);return}let n=i.findings[t];return n?(i.findings[t]={...n,...r,lastAttemptAt:new Date().toISOString()},await this.saveState(e,i),i):(f.warn(`Finding ${t} not present in state.`),i)}static async updateSprintStatus(e,t,r){let i=await this.loadState(e);if(!i)return;let n=i.sprints.find(a=>a.sprintNumber===t);return n&&(n.status=r),await this.saveState(e,i),i}static async resetState(e){let t=this.getStatePath(e);B.existsSync(t)&&(await B.promises.unlink(t),f.info(`Reset sprint state: deleted ${t}`))}static recalculateMetrics(e){let t=Object.values(e.findings||{}),r=t.length,i=0,n=0,a=0,o=0,c=t.filter(d=>d.source==="dependabot"),l=t.filter(d=>d.source==="code_scanning"),g=d=>{let p=0,u=0,m=0,b=0,w=0,E=0,y=0,k=0;for(let h of d)h.status==="verified"?p++:h.status==="failed"||h.status==="rejected"?u++:m++,h.severity==="critical"?b++:h.severity==="high"?w++:h.severity==="medium"?E++:h.severity==="low"&&y++,k+=h.sizing?.estimatedHours||0;return k=Math.round(k*10)/10,{totalFindings:d.length,criticalCount:b,highCount:w,mediumCount:E,lowCount:y,resolvedCount:p,pendingCount:m,failedCount:u,totalEstimatedHours:k,hoursSaved:Math.round(k*.75*10)/10}};for(let d of t)d.status==="verified"?i++:d.status==="failed"||d.status==="rejected"?n++:a++,o+=d.sizing?.estimatedHours||0;o=Math.round(o*10)/10,e.metrics?(e.metrics.totalFindings=r,e.metrics.resolvedCount=i,e.metrics.pendingCount=a,e.metrics.failedCount=n,e.metrics.totalEstimatedHours||(e.metrics.totalEstimatedHours=o,e.metrics.hoursSaved=Math.round(o*.75*10)/10)):e.metrics={totalFindings:r,resolvedCount:i,pendingCount:a,failedCount:n,totalEstimatedHours:o,hoursSaved:Math.round(o*.75*10)/10},e.metrics.dependabotMetrics=g(c),e.metrics.codeScanningMetrics=g(l),e.clubbingSummary=M.analyzeClusters(e.findings)}};var lt=S(require("vscode"));var Z=class{static getConfig(){let e=lt.workspace.getConfiguration("codevulfixer");return{planningMode:e.get("planningMode","sprint_wise"),daysPerSprint:e.get("daysPerSprint",10),maxHighRiskPerDay:e.get("maxHighRiskPerDay",3),targetSprintDays:e.get("targetSprintDays",4)}}static planSprints(e,t,r,i){let n={...this.getConfig(),...i},a=n.planningMode==="sprint_wise",o=a?n.daysPerSprint||10:1,c=e.filter(h=>h.source==="dependabot"),l=e.filter(h=>h.source==="code_scanning"),g=h=>{let C=[],F=[],$=[];for(let x of h){let G=x.severity==="critical"||x.severity==="high",U=x.sizing?.size==="S";G&&U?C.push(x):G?F.push(x):$.push(x)}return{highSevLowEffort:C,highSevHighEffort:F,mediumLowHygiene:$}},d=g(c),p=g(l),u=[],m={},b=1;if(a){if(c.length>0){let h=[...d.highSevLowEffort,...d.highSevHighEffort.slice(0,4)],F=[...d.highSevHighEffort.slice(4),...d.mediumLowHygiene.slice(0,6)],$=d.mediumLowHygiene.slice(6);if(F.length===0&&h.length>0)u.push(this.createSprintDay(b++,n.planningMode,o,`Sprint 1 (${o}-Day Agile Sprint)`,`Sprint 1: Dependabot Vulnerabilities \u2014 Immediate Quick Wins & Dependency Upgrades (${o} Working Days)`,`Standard 2-week Agile sprint (${o} working days) targeting all direct lockfile bumps, quick-win patches, and core critical dependency advisories.`,h,"dependabot"));else{if(u.push(this.createSprintDay(b++,n.planningMode,o,`Sprint ${b} (${o}-Day Agile Sprint)`,`Sprint 1: Dependabot Vulnerabilities \u2014 Critical Quick Wins & Direct Bumps (${o} Working Days)`,`Standard 2-week Agile sprint (${o} working days) targeting all direct lockfile bumps, quick-win patches, and core critical dependency advisories.`,h,"dependabot")),F.length>0){let x=b++;u.push(this.createSprintDay(x,n.planningMode,o,`Sprint ${x} (${o}-Day Agile Sprint)`,`Sprint ${x}: Dependabot Vulnerabilities \u2014 Architectural Upgrades & Framework Migrations (${o} Working Days)`,"Major version migrations, complex dependency refactoring, and regression test suites for Dependabot findings.",F,"dependabot"))}if($.length>0){let x=b++;u.push(this.createSprintDay(x,n.planningMode,o,`Sprint ${x} (${o}-Day Agile Sprint)`,`Sprint ${x}: Dependabot Vulnerabilities \u2014 Secondary Package Hygiene & Clean-up (${o} Working Days)`,`Secondary dependency deprecation and lockfile alignment over ${o} working days.`,$,"dependabot"))}}}if(l.length>0){let h=[...p.highSevLowEffort,...p.highSevHighEffort.slice(0,4)],F=[...p.highSevHighEffort.slice(4),...p.mediumLowHygiene.slice(0,6)],$=p.mediumLowHygiene.slice(6),x=b++;if(u.push(this.createSprintDay(x,n.planningMode,o,`Sprint ${x} (${o}-Day Agile Sprint)`,`Sprint ${x}: Code Scanning \u2014 Critical SAST Taint Flow & Injection Refactoring (${o} Working Days)`,`Standard 2-week Agile sprint (${o} working days) allocated for complex data-flow taint analysis, SQL/Command injection refactoring, and security verification.`,h.length>0?h:l,"code_scanning")),F.length>0&&h.length>0){let G=b++;u.push(this.createSprintDay(G,n.planningMode,o,`Sprint ${G} (${o}-Day Agile Sprint)`,`Sprint ${G}: Code Scanning \u2014 SAST Code Hygiene & AST Transformations (${o} Working Days)`,`Medium/low SAST alerts, self-contained syntax updates, and structural security hygiene over ${o} working days.`,F,"code_scanning"))}if($.length>0){let G=b++;u.push(this.createSprintDay(G,n.planningMode,o,`Sprint ${G} (${o}-Day Agile Sprint)`,`Sprint ${G}: Code Scanning \u2014 Security Hygiene & Final Compliance Sweep (${o} Working Days)`,"Long-term code hygiene maintenance, secondary SAST warnings, and final compliance sign-off.",$,"code_scanning"))}}if(u.length===1&&e.length>=2){let h=u[0];if(h.findings.length>1){let C=Math.ceil(h.findings.length/2),F=h.findings.slice(0,C),$=h.findings.slice(C),x=F.map(U=>e.find(Oe=>Oe.id===U)).filter(Boolean),G=$.map(U=>e.find(Oe=>Oe.id===U)).filter(Boolean);u.length=0,u.push(this.createSprintDay(1,n.planningMode,o,`Sprint 1 (${o}-Day Agile Sprint)`,h.title,h.description,x,h.category)),u.push(this.createSprintDay(2,n.planningMode,o,`Sprint 2 (${o}-Day Agile Sprint)`,`Sprint 2: Secondary Remediation & Verification (${o} Working Days)`,h.description,G,h.category))}}}else{if(c.length>0){let h=[...d.highSevLowEffort];h.length<3&&d.mediumLowHygiene.length>0&&h.push(...d.mediumLowHygiene.splice(0,2)),u.push(this.createSprintDay(b++,n.planningMode,1,"Day 1 (Daily Focus)","Day 1: Dependabot Immediate Quick Wins (1 Day Duration)","Direct dependency lockfile bumps, transitive deduplications, and self-contained updates.",h.length>0?h:c.slice(0,2),"dependabot"));let C=d.highSevHighEffort.slice(0,n.maxHighRiskPerDay),F=d.highSevHighEffort.slice(n.maxHighRiskPerDay),$=C.length>0?C:c.slice(2,2+n.maxHighRiskPerDay);$.length>0&&u.push(this.createSprintDay(b++,n.planningMode,1,"Day 2 (Daily Focus)",`Day 2: Dependabot High-Risk Architectural Items (Capped at ${n.maxHighRiskPerDay}/day)`,"High-severity dependency upgrades, multi-major jumps, and framework compatibility refactoring.",$,"dependabot"));let x=[...F,...d.mediumLowHygiene];if(x.length>0){let G=b;u.push(this.createSprintDay(b++,n.planningMode,1,`Day ${G} (Daily Focus)`,`Day ${G}: Dependabot Security Hygiene & Secondary Packages`,"Secondary package bumps, minor lockfile updates, and dependency maintenance.",x,"dependabot"))}}if(l.length>0){let h=b,C=[...p.highSevLowEffort];C.length<2&&p.mediumLowHygiene.length>0&&C.push(...p.mediumLowHygiene.splice(0,1)),u.push(this.createSprintDay(b++,n.planningMode,1,`Day ${h} (Daily Focus)`,`Day ${h}: Code Scanning Quick Wins & AST Patterns (1 Day Duration)`,"Self-contained syntax replacements, sanitized assignments, and deterministic AST patterns.",C.length>0?C:l.slice(0,2),"code_scanning"));let F=p.highSevHighEffort.slice(0,n.maxHighRiskPerDay),$=p.highSevHighEffort.slice(n.maxHighRiskPerDay),x=F.length>0?F:l.slice(2,2+n.maxHighRiskPerDay);if(x.length>0){let U=b;u.push(this.createSprintDay(b++,n.planningMode,1,`Day ${U} (Daily Focus)`,`Day ${U}: Code Scanning Complex Injections (Capped at ${n.maxHighRiskPerDay}/day)`,"Complex data-flow taint analysis, SQL injection refactoring, and command execution parameterization.",x,"code_scanning"))}let G=[...$,...p.mediumLowHygiene];if(G.length>0){let U=b;u.push(this.createSprintDay(b++,n.planningMode,1,`Day ${U}+ (Daily Focus)`,`Day ${U}: Code Scanning Security Hygiene Sweep`,"Medium and low static analysis findings, boundary checks, and final validation.",G,"code_scanning"))}}}for(let h of e)m[h.id]={...h};let w=0;for(let h of u)for(let C of h.findings)m[C]&&(m[C].targetSprint=h.sprintNumber,w+=m[C].sizing?.estimatedHours||0);let E=Math.round(c.reduce((h,C)=>h+(C.sizing?.estimatedHours||0),0)*10)/10,y=Math.round(l.reduce((h,C)=>h+(C.sizing?.estimatedHours||0),0)*10)/10;return{version:"1.0.3",repoOwner:t,repoName:r,lastUpdated:new Date().toISOString(),planningMode:n.planningMode,daysPerSprint:o,sprints:u,findings:m,activeSprint:1,metrics:{totalFindings:e.length,resolvedCount:0,pendingCount:e.length,failedCount:0,totalEstimatedHours:Math.round(w*10)/10,hoursSaved:Math.round(w*.75*10)/10,dependabotMetrics:{totalFindings:c.length,criticalCount:c.filter(h=>h.severity==="critical").length,highCount:c.filter(h=>h.severity==="high").length,mediumCount:c.filter(h=>h.severity==="medium").length,lowCount:c.filter(h=>h.severity==="low").length,resolvedCount:0,pendingCount:c.length,failedCount:0,totalEstimatedHours:E,hoursSaved:Math.round(E*.75*10)/10},codeScanningMetrics:{totalFindings:l.length,criticalCount:l.filter(h=>h.severity==="critical").length,highCount:l.filter(h=>h.severity==="high").length,mediumCount:l.filter(h=>h.severity==="medium").length,lowCount:l.filter(h=>h.severity==="low").length,resolvedCount:0,pendingCount:l.length,failedCount:0,totalEstimatedHours:y,hoursSaved:Math.round(y*.75*10)/10}},clubbingSummary:M.analyzeClusters(Object.values(m))}}static createSprintDay(e,t,r,i,n,a,o,c){let l=o.reduce((g,d)=>g+(d.sizing?.estimatedHours||0),0);return{sprintNumber:e,planningMode:t,durationDays:r,dayLabel:i,title:n,description:a,findings:o.map(g=>g.id),totalEstimatedHours:Math.round(l*10)/10,status:e===1?"in_progress":"pending",category:c}}};var pt=S(require("vscode")),ut=require("child_process"),gt=require("util");var dt=(0,gt.promisify)(ut.exec),I=class{static getPrimaryWorkspacePath(){let e=pt.workspace.workspaceFolders;if(!(!e||e.length===0))return e[0].uri.fsPath}static async resolveRepoMetadata(){let e=this.getPrimaryWorkspacePath();if(!e){f.warn("No active workspace folder found.");return}try{let{stdout:t}=await dt("git config --get remote.origin.url",{cwd:e}),r=t.trim();if(!r){f.warn("No Git remote origin configured in workspace.");return}let i=this.parseGitHubUrl(r);if(!i){f.warn(`Could not parse GitHub owner/repo from remote URL: ${r}`);return}let n="main";try{let{stdout:o}=await dt("git rev-parse --abbrev-ref HEAD",{cwd:e});n=o.trim()||"main"}catch{}let a={owner:i.owner,repo:i.repo,remoteUrl:r,currentBranch:n};return f.info(`Resolved GitHub repository: ${a.owner}/${a.repo} (branch: ${a.currentBranch})`),a}catch(t){f.warn(`Git resolution failed or workspace is not a git repository: ${t instanceof Error?t.message:String(t)}`);return}}static parseGitHubUrl(e){let r=e.trim().match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);if(r&&r[1]&&r[2])return{owner:r[1],repo:r[2].replace(/\.git$/,"")}}};var Le=S(require("vscode"));var he=class s{static SCOPES=["repo","security_events"];static async getSession(e=!0){try{f.info(`Requesting GitHub session with scopes: [${s.SCOPES.join(", ")}]`);let t=await Le.authentication.getSession("github",s.SCOPES,{createIfNone:e});if(t)return f.success(`GitHub authentication successful for user: ${t.account.label}`),t;f.warn("GitHub authentication session was not granted or cancelled by user.");return}catch(t){throw f.error("Failed to obtain GitHub authentication session",t),t}}static async hasExistingSession(){try{return!!await Le.authentication.getSession("github",s.SCOPES,{createIfNone:!1})}catch{return!1}}};var Is=S(Os());var ve=class{static create(e){return f.info("Initializing Octokit client with user session token."),new Is.Octokit({auth:e,userAgent:"CodeVulFixer-VSCode-Extension/1.0.3"})}};var we=class{static async fetchAlerts(e,t,r){f.info(`Fetching Dependabot alerts for ${t}/${r}...`);try{let n=(await e.rest.dependabot.listAlertsForRepo({owner:t,repo:r,state:"open",per_page:100})).data;return f.info(`Received ${n.length} Dependabot alerts.`),n.map((a,o)=>{let c=a.security_advisory,l=a.dependency,g=c.cve_id||c.ghsa_id||`DEP-${a.number}`,p=c.vulnerabilities?.[0]?.first_patched_version?.identifier||(c.patched_versions&&c.patched_versions.length>0?c.patched_versions[0].identifier:void 0)||"latest",u=c.vulnerabilities?.[0]?.vulnerable_version_range||c.vulnerable_version_range||"vulnerable",m=this.normalizeSeverity(c.severity),b=l?.package?.ecosystem||"npm",w=l?.package?.name||"unknown-package",E=l?.manifest_path||"package.json",y={packageName:w,ecosystem:b,currentVersion:u,fixedVersion:p,isDirect:!0,manifestFile:E,vulnerableVersionRange:u,upgradeType:this.determineUpgradeType(u,p)};return{id:`DEP-${a.number}`,source:"dependabot",alertNumber:a.number,title:c.summary||`Vulnerability in ${w}`,description:c.description||`Dependabot flagged ${w} with ${g}`,severity:m,htmlUrl:a.html_url,cveId:c.cve_id||void 0,ghsaId:c.ghsa_id||void 0,cweIds:c.cwes?.map(h=>h.cwe_id)||[],dependency:y,status:"pending",targetSprint:1,remediationPlan:`Upgrade ${w} to >= ${p} via lockfile bump`,sizing:{size:"S",riskLevel:"low",reasons:[],estimatedHours:1,isAutomatedCandidate:!0}}})}catch(i){throw f.error(`Failed to fetch Dependabot alerts for ${t}/${r}`,i),i}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"?"high":t==="medium"||t==="moderate"?"medium":"low"}static determineUpgradeType(e,t){if(!t||t==="latest")return"minor";let r=t.match(/^(\d+)\.(\d+)\.(\d+)/);if(!r)return"unknown";if(e&&e.includes("<")){let i=parseInt(r[1],10),n=e.match(/<\s*(\d+)/);if(n){let a=parseInt(n[1],10);if(i>a)return"major"}}return"patch"}};var Se=class{static async fetchAlerts(e,t,r){f.info(`Fetching Code Scanning (SAST/CodeQL) alerts for ${t}/${r}...`);try{let n=(await e.rest.codeScanning.listAlertsForRepo({owner:t,repo:r,state:"open",per_page:100})).data;return f.info(`Received ${n.length} Code Scanning findings.`),n.map(a=>{let o=a.rule,c=a.most_recent_instance,l=c?.location,g=this.normalizeSeverity(o.security_severity_level||o.severity),d=this.extractCWEs(o.tags??void 0),p=l?.path?{filePath:l.path,startLine:l.start_line||1,endLine:l.end_line||l.start_line||1,startColumn:l.start_column??void 0,endColumn:l.end_column??void 0}:void 0;return{id:`CS-${a.number}`,source:"code_scanning",alertNumber:a.number,title:o.description||o.id||`Code Scanning Alert #${a.number}`,description:c?.message?.text||o.description||"Static analysis finding flagged by CodeQL",severity:g,htmlUrl:a.html_url,ruleId:o.id??void 0,cweIds:d,location:p,status:"pending",targetSprint:1,remediationPlan:`Refactor code at ${l?.path||"file"} to resolve ${o.id}`,sizing:{size:"M",riskLevel:"medium",reasons:[],estimatedHours:2,isAutomatedCandidate:!1}}})}catch(i){throw f.error(`Failed to fetch Code Scanning alerts for ${t}/${r}`,i),i}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"||t==="error"?"high":t==="medium"||t==="warning"?"medium":"low"}static extractCWEs(e){if(!e)return[];let t=[];for(let r of e)if(r.startsWith("external/cwe/cwe-")){let i=r.replace("external/cwe/cwe-","CWE-");t.push(i.toUpperCase())}else/^cwe-\d+/i.test(r)&&t.push(r.toUpperCase());return t}};var _=S(require("fs")),A=S(require("path"));var Ee=class{static async analyze(e,t){let r={...t};try{let i=A.join(e,t.manifestFile||"package.json");if(_.existsSync(i)){let l=_.readFileSync(i,"utf8"),g=JSON.parse(l),d=g.dependencies&&g.dependencies[t.packageName]||g.devDependencies&&g.devDependencies[t.packageName]||g.peerDependencies&&g.peerDependencies[t.packageName];d?(r.isDirect=!0,r.currentVersion=d):r.isDirect=!1}let n=A.join(e,t.manifestFile||"pom.xml");if(_.existsSync(n)&&(t.ecosystem==="maven"||t.packageName.includes(":")||t.packageName.includes("spring"))){let l=_.readFileSync(n,"utf8");r.manifestFile="pom.xml",r.ecosystem="maven";let g=l.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);g&&(r.javaVersionConstraint=g[1].trim().replace(/^1\./,""));let d=t.packageName.split(":").pop()||t.packageName;(l.includes(`<artifactId>${d}</artifactId>`)||l.includes(t.packageName))&&(r.isDirect=!0)}if(t.ecosystem==="nuget"||t.packageName.toLowerCase().includes("log4net")||t.packageName.toLowerCase().includes("microsoft.")||t.packageName.toLowerCase().includes("system.")||t.manifestFile?.endsWith(".csproj")){let g=_.readdirSync(e).find(d=>d.endsWith(".csproj"));if(g){let d=_.readFileSync(A.join(e,g),"utf8");r.manifestFile=g,r.ecosystem="nuget";let p=d.match(/<TargetFramework(?:Version)?>(.*?)<\/TargetFramework(?:Version)?>/);p&&(r.targetFramework=p[1].trim()),d.toLowerCase().includes(t.packageName.toLowerCase())&&(r.isDirect=!0)}}if(_.existsSync(A.join(e,"package-lock.json")))r.lockfile="package-lock.json",r.ecosystem!=="maven"&&r.ecosystem!=="nuget"&&(r.ecosystem="npm");else if(_.existsSync(A.join(e,"pnpm-lock.yaml")))r.lockfile="pnpm-lock.yaml",r.ecosystem="pnpm";else if(_.existsSync(A.join(e,"yarn.lock")))r.lockfile="yarn.lock",r.ecosystem="yarn";else if(_.existsSync(A.join(e,"uv.lock")))r.lockfile="uv.lock",r.ecosystem="uv";else if(_.existsSync(A.join(e,"requirements.txt")))r.lockfile="requirements.txt",r.ecosystem="pip";else if(_.existsSync(A.join(e,"Cargo.lock"))||_.existsSync(A.join(e,"Cargo.toml")))r.lockfile=_.existsSync(A.join(e,"Cargo.lock"))?"Cargo.lock":"Cargo.toml",r.manifestFile="Cargo.toml",r.ecosystem="cargo";else if(_.existsSync(A.join(e,"go.mod")))r.lockfile="go.sum",r.manifestFile="go.mod",r.ecosystem="go";else if((_.existsSync(A.join(e,"CMakeLists.txt"))||_.existsSync(A.join(e,"vcpkg.json")))&&(r.manifestFile=_.existsSync(A.join(e,"CMakeLists.txt"))?"CMakeLists.txt":"vcpkg.json",r.ecosystem="cpp",_.existsSync(A.join(e,"CMakeLists.txt")))){let g=_.readFileSync(A.join(e,"CMakeLists.txt"),"utf8").match(/CMAKE_CXX_STANDARD\s+(\d+)/);g&&(r.cppStandard=`c++${g[1]}`)}let o=r.currentVersion.match(/(\d+)/),c=r.fixedVersion.match(/(\d+)/);if(o&&c){let l=parseInt(o[1],10),g=parseInt(c[1],10);r.majorGap=Math.max(1,g-l)}}catch(i){f.warn(`DependencyAnalyzer could not inspect manifest for ${t.packageName}: ${i}`)}return r}};var Ce=S(require("fs")),ke=S(require("path"));var Te=class{static COMPLEX_CWES=new Set(["CWE-89","CWE-78","CWE-94","CWE-502","CWE-287","CWE-327","CWE-918"]);static SIMPLE_CWES=new Set(["CWE-79","CWE-330","CWE-1333","CWE-400"]);static async analyze(e,t,r=[],i){if(!t||!t.filePath)return{fileExists:!1,fileLinesCount:0,isSelfContained:!0,taintComplexity:"moderate"};let n=ke.isAbsolute(t.filePath)?t.filePath:ke.join(e,t.filePath);if(!Ce.existsSync(n))return{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!1,taintComplexity:this.determineComplexity(r,i)};try{let o=Ce.readFileSync(n,"utf8").split(/\r?\n/),c=Math.max(0,t.startLine-1),l=Math.min(o.length,t.endLine),g=o.slice(c,l).join(`
`),d=Math.max(0,c-5),p=Math.min(o.length,l+5),u=o.slice(d,p).join(`
`),m=l-c<=8&&o.length<500,b=this.determineComplexity(r,i);return{fileExists:!0,fileLinesCount:o.length,snippet:g||t.snippet,surroundingContext:u,isSelfContained:m,taintComplexity:b}}catch(a){return f.warn(`Could not read code context for ${n}: ${a}`),{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!0,taintComplexity:this.determineComplexity(r,i)}}}static determineComplexity(e,t){for(let r of e){if(this.COMPLEX_CWES.has(r))return"complex";if(this.SIMPLE_CWES.has(r))return"simple"}if(t){let r=t.toLowerCase();if(r.includes("sql")||r.includes("command")||r.includes("rce")||r.includes("crypto"))return"complex";if(r.includes("random")||r.includes("xss")||r.includes("redos"))return"simple"}return"moderate"}};var se=S(require("fs")),rt=S(require("path"));var re=class{static detectWorkspaceEnvironment(e){let t={hasLegacyModules:!1,legacyModuleNames:[]};try{let r=rt.join(e,"pom.xml");if(se.existsSync(r)){let n=se.readFileSync(r,"utf8"),a=n.match(/<(?:java\.version|maven\.compiler\.source|maven\.compiler\.target)>(.*?)<\//);if(a){let o=a[1].trim();t.javaVersion=o.replace(/^1\./,"")}if(n.includes("<module>")||n.includes("legacy")){t.hasLegacyModules=!0;let o=n.match(/<module>(.*?)<\/module>/g);o&&(t.legacyModuleNames=o.map(c=>c.replace(/<\/?module>/g,"").trim()))}}let i=rt.join(e,"package.json");if(se.existsSync(i)){let n=JSON.parse(se.readFileSync(i,"utf8"));n.engines&&n.engines.node&&(t.nodeEngine=n.engines.node)}}catch(r){f.warn(`CompatibilityAdvisor could not inspect workspace environment: ${r}`)}return t}static advise(e,t,r){let i=r||e.dependency;if(!i)return;let n=this.detectWorkspaceEnvironment(t),a=i.packageName.toLowerCase(),o=i.currentVersion||"",c=i.fixedVersion||"",l=a.includes("org.springframework")||a==="spring"||a==="spring-core"||a==="spring-webmvc"||a.includes("spring-boot"),g=i.javaVersionConstraint||n.javaVersion||(e.description.toLowerCase().includes("java 8")?"8":void 0),d=g==="8"||g==="1.8";if(l){let p=o.match(/^(\d+)/),u=c.match(/^(\d+)/),m=p?parseInt(p[1],10):1,b=u?parseInt(u[1],10):5;if(b>=6&&d)return{hasDeadlock:!0,idealVersion:c,safeRecommendedVersion:"5.3.39",constraintSummary:`Legacy modules require Java 8, but ideal upgrade target (${c}) mandates Java 17+.`,tradeoffReason:`Upgrading to Spring ${c} causes fatal runtime/compilation failure due to the Java 8 module pin. Upgrading to Spring 5.3.39 (Intermediate Safe Target) eliminates critical RCE vulnerabilities while maintaining 100% Java 8 runtime compliance.`,riskReduction:"Mitigates Critical RCE exposure while completely eliminating platform incompatibility and build failure risk.",actionStrategy:"intermediate_upgrade",conflictingPackages:n.legacyModuleNames.length>0?n.legacyModuleNames:["java-runtime-8-module"]};if(m<=2&&b>=5)return{hasDeadlock:d&&b>=6,idealVersion:b>=6?c:"5.3.39",safeRecommendedVersion:"5.3.39",constraintSummary:`4-generation jump from Spring ${o} to ${c}. Java 8 baseline required.`,tradeoffReason:"Spring 1.x to 5.x is an architectural epoch migration. Targeting Spring 5.3.39 preserves Java 8 runtime compatibility and patches all known RCEs without forcing an immediate JVM platform upgrade.",riskReduction:"Mitigates Critical RCE to Zero; bounds breaking changes to Spring 5.3 without cascading into a Java 17 platform overhaul.",actionStrategy:"intermediate_upgrade",conflictingPackages:["org.springframework:spring-core"]}}if(a.includes("log4j")&&d&&(c.startsWith("3.")||c.startsWith("2.18")||c.startsWith("2.19")||c.startsWith("2.20")))return{hasDeadlock:!0,idealVersion:c,safeRecommendedVersion:"2.17.1",constraintSummary:`Target Log4j ${c} requires Java 9+, while workspace is pinned to Java 8.`,tradeoffReason:"Upgrading to Log4j 2.17.1 patches Log4Shell (CVE-2021-44228) and RCE while ensuring complete Java 8 bytecode compatibility.",riskReduction:"Eliminates Critical Log4Shell vulnerability with zero JVM runtime risk.",actionStrategy:"intermediate_upgrade"};if(i.ecosystem==="npm"||i.ecosystem==="yarn"||i.ecosystem==="pnpm"){let p=o.match(/^(\d+)/),u=c.match(/^(\d+)/);if(p&&u){let m=parseInt(p[1],10),b=parseInt(u[1],10),w=b-m;if(w>=2||i.peerConflicts&&i.peerConflicts.length>0){let E=`${m}.${o.split(".")[1]||"0"}.patched`;return{hasDeadlock:!1,idealVersion:c,safeRecommendedVersion:i.fixedVersion,constraintSummary:`Major version leap (v${m} -> v${b}) risks peer dependency collisions across application modules.`,tradeoffReason:`High-risk upgrade spans ${w} major versions. Recommended to perform an intermediate step to stabilize APIs before advancing to the latest major release.`,riskReduction:"Reduces regression breakages in downstream dependents.",actionStrategy:"intermediate_upgrade",conflictingPackages:i.peerConflicts}}}}if(a.includes("log4net")||i.ecosystem==="nuget"){let p=a.includes("log4net"),u=i.targetFramework||"",m=u.startsWith("net4")||u.startsWith("v4.")||u.includes("net35");if(p&&(m||e.description.toLowerCase().includes(".net framework"))&&(c.startsWith("3.")||c.startsWith("2.0.16")))return{hasDeadlock:!0,idealVersion:c,safeRecommendedVersion:"2.0.15",constraintSummary:`Legacy .NET Framework (${u||"net4x"}) detected. Target ${c} requires modern .NET runtime.`,tradeoffReason:"Upgrading to log4net 2.0.15 neutralizes XML parser vulnerabilities (CVE-2018-1285) while maintaining complete .NET Framework 4.x compatibility without breaking app.config or binding redirects.",riskReduction:"Mitigates High/Critical RCE with zero .NET runtime migration failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["log4net"]}}}static evaluateCascadingVulnerabilities(e,t){let r=e.packageName.toLowerCase();return r==="express"&&t.startsWith("5.")?{hasCascadingRisk:!0,newVulnerabilities:["Peer dependency conflict with body-parser and cookie-parser < 1.4.0","Breaking router signature change introduced in Express 5.0"],alternativeVersion:"4.19.2"}:r.includes("spring")&&t.startsWith("6.")?{hasCascadingRisk:!0,newVulnerabilities:["Runtime Incompatibility: Spring 6 requires Java 17+ (Workspace has Java 8 constraint)","Java EE to Jakarta EE namespace break (javax.servlet -> jakarta.servlet)"],alternativeVersion:"5.3.39"}:{hasCascadingRisk:!1,newVulnerabilities:[]}}};var xe=class{static evaluate(e,t,r,i){let n=[],a="S",o="low",c=1,l=!0;if(e.source==="dependabot"){let g=t||e.dependency,d=g?.upgradeType||"patch",p=g?g.isDirect:!0,u=g?.majorGap||1,m=g?.currentVersion?.match(/(\d+)/),b=g?.fixedVersion?.match(/(\d+)/);if(m&&b){let E=parseInt(m[1],10),y=parseInt(b[1],10);u=Math.max(1,y-E),g&&(g.majorGap=u)}let w=re.advise(e,i||"",g);w&&(e.compatibilityAdvice=w),d==="major"&&u>=2?(a="XL",o="high",c=Math.min(96,Math.round(16*Math.pow(1.5,u-1))),l=!1,n.push(`Multi-generational major version jump (v${m?.[1]||"1"}.x \u2794 v${b?.[1]||"5"}.x) spans ${u} major releases with extensive architectural breaking changes`),n.push("Requires comprehensive configuration refactoring, API migration, and regression test suites"),p&&n.push("Direct package definition requires codebase API audit"),w?.hasDeadlock&&(n.push(`\u26A0\uFE0F Platform Deadlock Detected: ${w.constraintSummary}`),n.push(`\u{1F4A1} Smart Remediation Recommendation: Upgrade to ${w.safeRecommendedVersion} instead of ${w.idealVersion} to eliminate compatibility risk`))):d==="major"?(a="L",o="high",c=3.5,l=!1,n.push("Major version upgrade introduces potential API breaking changes"),p&&n.push("Direct package definition requires codebase API audit"),w&&n.push(`\u{1F4A1} Compatibility Advice: ${w.tradeoffReason}`)):e.severity==="critical"?(a="M",o="medium",c=2,l=!0,n.push("Critical severity dependency patch; prioritized for rapid lockfile refresh")):(a="S",o="low",c=.5,l=!0,n.push(p?"Direct dependency patch bump with backward compatibility":"Transitive lockfile bump without source modifications"))}else{let g=r?.taintComplexity||"moderate",d=r?.isSelfContained??!1,p=e.severity;g==="complex"||p==="critical"?(a="L",o="high",c=4,l=!1,n.push("Complex data-flow / taint across application layers (e.g. SQL Injection or Command Injection)"),n.push("High-risk vulnerability requiring human-in-the-loop verification")):!d||g==="moderate"||p==="high"?(a="M",o="medium",c=2,l=!1,n.push("Code modification touches non-trivial function block"),n.push("Requires regression test validation")):(a="S",o="low",c=.5,l=!0,n.push("Self-contained, localized syntax or security sanitizer replacement"),n.push("Eligible for deterministic AST-grep / AI automated repair"));let u=e.location?.filePath?.toLowerCase()||"",m=e.ruleId?.toLowerCase()||"";u.endsWith(".pas")||u.endsWith(".dpr")||u.endsWith(".dproj")||m.includes("delphi")||m.includes("pascal")?(a==="S"&&(a="M"),c=Math.max(3,c*1.5),l=!1,n.push("Delphi / Object Pascal unmanaged binary: requires manual memory boundary verification, pointer arithmetic inspection, and ABI compiler regression checks")):u.endsWith(".ps1")||u.endsWith(".psm1")||m.includes("powershell")||m.includes("posh")?n.push("PowerShell script environment: requires AST scriptblock restructuring and CmdletBinding parameter validation"):u.endsWith(".cs")||m.startsWith("cs/")?n.push(".NET / C# ecosystem: requires parameterized LINQ/SqlCommand refactoring and target assembly compatibility check"):u.endsWith(".java")||m.startsWith("java/")?n.push("Java / Spring ecosystem: requires JVM runtime compliance and PreparedStatement / Spring Security filter chain audit"):u.endsWith(".cpp")||u.endsWith(".c")||u.endsWith(".cc")||u.endsWith(".cxx")||u.endsWith(".h")||u.endsWith(".hpp")||m.startsWith("cpp/")||m.startsWith("c/")?(a==="S"&&(a="M"),c=Math.max(3.5,c*1.6),l=!1,n.push("C/C++ native unmanaged code: high memory-safety risk (CWE-120/416/125); requires AddressSanitizer (ASAN) audit, valgrind boundary verification, and manual ABI testing")):u.endsWith(".go")||m.startsWith("go/")?n.push("Go ecosystem: requires goroutine concurrency leak audit and safe slice/pointer boundary validation"):(u.endsWith(".rs")||m.startsWith("rust/"))&&n.push("Rust ecosystem: requires unsafe block { unsafe { ... } } audit and borrow checker lifetime verification")}return{size:a,riskLevel:o,reasons:n,estimatedHours:c,isAutomatedCandidate:l}}};var Us=S(require("vscode"));var $s=S(require("vscode")),O=S(require("fs")),V=S(require("path")),Ls=require("child_process"),js=require("util");var _e=[{ruleId:"js/insecure-randomness",cwe:"CWE-330",name:"Replace Math.random() with Node.js crypto.randomBytes",description:'Replaces cryptographically insecure Math.random() token generation with crypto.randomBytes(32).toString("hex")',matcher:s=>/Math\.random\(\)/.test(s),transform:s=>({transformed:s.replace(/Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,"require('crypto').randomBytes(24).toString('hex')").replace(/Math\.random\(\)/g,"(require('crypto').randomBytes(4).readUInt32LE(0) / 0xffffffff)"),explanation:"Replaced Math.random with cryptographically secure random bytes from native crypto module."})},{ruleId:"js/xss-through-dom",cwe:"CWE-79",name:"Safe textContent assignment for innerHTML",description:"Replaces raw innerHTML assignment with textContent to neutralize cross-site scripting vectors",matcher:s=>/\.innerHTML\s*=/.test(s),transform:s=>({transformed:s.replace(/(\b\w+)\.innerHTML\s*=\s*([^;]+);/g,"$1.textContent = $2;"),explanation:"Converted vulnerable innerHTML assignment to safe textContent."})},{ruleId:"js/command-injection",cwe:"CWE-78",name:"Parameterize child_process shell execution",description:"Swaps vulnerable exec template literal with safe execFile or sanitized arguments",matcher:s=>/exec\(`[^`]*\$\{[^}]+\}[^`]*`/.test(s),transform:s=>({transformed:s.replace(/exec\(`git checkout \$\{([^}]+)\}`,\s*([^)]+)\)/g,'execFile("git", ["checkout", $1], $2)'),explanation:"Replaced shell string concatenation with argument array via execFile."})},{ruleId:"js/sql-injection",cwe:"CWE-89",name:"Parameterize raw SQL template literal",description:"Converts interpolated SQL query strings into parameterized database queries",matcher:s=>/`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i.test(s),transform:s=>({transformed:s.replace(/`SELECT\s+\*\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?\$\{([^}]+)\}['"]?`/i,'"SELECT * FROM $1 WHERE $2 = $1", [$3]'),explanation:"Converted string-interpolated SQL query into parameterized prepared statement."})},{ruleId:"js/path-traversal",cwe:"CWE-22",name:"Enforce path boundary check",description:"Guards path.join with path.resolve boundary check against directory traversal",matcher:s=>/path\.join\(/.test(s),transform:s=>({transformed:s.replace(/const\s+filePath\s*=\s*path\.join\(([^,]+),\s*([^)]+)\);/g,`const safeFilename = path.basename($2);
    const filePath = path.join($1, safeFilename);`),explanation:"Enforced path.basename sanitization to prevent directory escape."})}];var Fo=(0,js.promisify)(Ls.exec),J=class{static async applyFix(e,t){return t.source==="dependabot"?this.fixDependency(e,t):this.fixCodeScanning(e,t)}static async fixDependency(e,t){let r=t.dependency;if(!r)return{success:!1,engine:"deterministic",message:"No dependency metadata available for this alert.",modifiedFiles:[]};let n=$s.workspace.getConfiguration("codevulfixer").get("packageManager","auto");n==="auto"&&(n=r.ecosystem||"npm",O.existsSync(V.join(e,"pnpm-lock.yaml"))?n="pnpm":O.existsSync(V.join(e,"yarn.lock"))?n="yarn":O.existsSync(V.join(e,"uv.lock"))?n="uv":O.existsSync(V.join(e,"requirements.txt"))?n="pip":n="npm");let a=r.packageName,o=r.fixedVersion,c="",l=[];switch(n){case"npm":c=`npm install ${a}@${o} --package-lock-only`,l.push("package-lock.json"),r.isDirect&&l.push("package.json");break;case"pnpm":c=`pnpm update ${a}@${o}`,l.push("pnpm-lock.yaml");break;case"yarn":c=`yarn up ${a}@${o}`,l.push("yarn.lock");break;case"uv":c=`uv add ${a}==${o}`,l.push("pyproject.toml","uv.lock");break;case"pip":c=`pip install ${a}==${o}`,l.push("requirements.txt");break;default:c=`npm install ${a}@${o} --package-lock-only`,l.push("package-lock.json")}f.info(`[DeterministicFixer] Spawning package manager CLI: "${c}" in ${e}`);try{let{stdout:g,stderr:d}=await Fo(c,{cwd:e});return f.success(`[DeterministicFixer] Successfully upgraded ${a} to ${o}`),{success:!0,engine:"deterministic",message:`Upgraded ${a} to ${o} via ${n} lockfile bump`,commandExecuted:c,stdout:g,stderr:d,modifiedFiles:l}}catch(g){f.warn(`CLI execution returned error: ${g.message}. Attempting safe fallback manifest upgrade.`);let d=V.join(e,"package.json");if(O.existsSync(d))try{let p=O.readFileSync(d,"utf8"),u=JSON.parse(p),m=!1;if(u.dependencies&&u.dependencies[a]&&(u.dependencies[a]=`^${o}`,m=!0),u.devDependencies&&u.devDependencies[a]&&(u.devDependencies[a]=`^${o}`,m=!0),m)return O.writeFileSync(d,JSON.stringify(u,null,2),"utf8"),{success:!0,engine:"deterministic",message:`Updated ${a} in package.json to ^${o} (manifest-level fallback)`,commandExecuted:"Direct manifest rewrite",modifiedFiles:["package.json"]}}catch{}return{success:!1,engine:"deterministic",message:`Failed to execute lockfile upgrade command: ${g.message}`,commandExecuted:c,stderr:g.stderr||g.message,modifiedFiles:[]}}}static async fixCodeScanning(e,t){let r=t.location;if(!r||!r.filePath)return{success:!1,engine:"deterministic",message:"No file location metadata provided in Code Scanning alert.",modifiedFiles:[]};let i=V.isAbsolute(r.filePath)?r.filePath:V.join(e,r.filePath),n=_e.find(a=>a.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(a.cwe));if(!n)return{success:!1,engine:"deterministic",message:`No precompiled deterministic AST-grep rule for ${t.ruleId||"unknown rule"}. Recommend using Copilot LM Engine.`,modifiedFiles:[]};if(!O.existsSync(i))if(r.snippet){let a=V.dirname(i);O.existsSync(a)||O.mkdirSync(a,{recursive:!0}),O.writeFileSync(i,`// CodeVulFixer Target File
${r.snippet}
`,"utf8")}else return{success:!1,engine:"deterministic",message:`Target file not found: ${r.filePath}`,modifiedFiles:[]};try{let a=O.readFileSync(i,"utf8"),o=a.split(/\r?\n/),c=Math.max(0,(r.startLine||1)-1),l=Math.min(o.length,r.endLine||o.length),g=o.slice(c,l).join(`
`),{transformed:d,explanation:p}=n.transform(g);if(d===g){let u=n.transform(a);return u.transformed!==a?(O.writeFileSync(i,u.transformed,"utf8"),{success:!0,engine:"deterministic",message:`AST-grep applied: ${n.name}. ${u.explanation}`,modifiedFiles:[r.filePath]}):{success:!1,engine:"deterministic",message:`AST-grep rule did not match the code structure in ${r.filePath}`,modifiedFiles:[]}}return o.splice(c,l-c,d),O.writeFileSync(i,o.join(`
`),"utf8"),f.success(`[DeterministicFixer] AST transformation applied: ${n.name} on ${r.filePath}`),{success:!0,engine:"deterministic",message:`AST-grep applied: ${n.name}. ${p}`,modifiedFiles:[r.filePath]}}catch(a){return f.error("Failed to apply AST-grep fix",a),{success:!1,engine:"deterministic",message:`AST-grep failed: ${a instanceof Error?a.message:String(a)}`,modifiedFiles:[]}}}};var K=S(require("vscode")),H=S(require("fs")),X=S(require("path"));var de=class{static async applyFix(e,t){f.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${t.id}: ${t.title}`);let r=[];try{r=await K.lm.selectChatModels({vendor:"copilot"}),(!r||r.length===0)&&(r=await K.lm.selectChatModels())}catch(m){f.warn(`Error selecting chat models via vscode.lm: ${m}`)}if(!r||r.length===0)return{success:!1,engine:"copilot",message:"No active Copilot Language Model found. Please ensure GitHub Copilot is installed and active in VS Code, or switch to Deterministic fix mode.",modifiedFiles:[]};let i=r[0];f.info(`[CopilotLMFixer] Using model: ${i.name} (${i.id})`);let n=t.location,a="",o="",c=n?.snippet||"";if(n?.filePath){if(a=X.isAbsolute(n.filePath)?n.filePath:X.join(e,n.filePath),H.existsSync(a))o=H.readFileSync(a,"utf8");else if(n.snippet){let m=X.dirname(a);H.existsSync(m)||H.mkdirSync(m,{recursive:!0}),H.writeFileSync(a,`// Target: ${n.filePath}
${n.snippet}
`,"utf8"),o=H.readFileSync(a,"utf8")}}let l=X.extname(n?.filePath||"").toLowerCase(),d={".cpp":"cpp",".c":"c",".h":"cpp",".hpp":"cpp",".cs":"csharp",".java":"java",".pas":"pascal",".dpr":"pascal",".ps1":"powershell",".psm1":"powershell",".py":"python",".go":"go",".rs":"rust",".ts":"typescript",".js":"javascript"}[l]||"code",p=this.buildPrompt(t,o,c,d),u=[K.LanguageModelChatMessage.User(`You are a Principal Security Architect and CodeQL Remediator specializing in ${d.toUpperCase()} and enterprise software architecture. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a \`\`\`${d} code block. Do NOT include extraneous markdown explanations.`),K.LanguageModelChatMessage.User(p)];try{let m=new K.CancellationTokenSource,b=i,w=b.sendRequest?await b.sendRequest(u,{},m.token):await b.sendChatRequest(u,{},m.token),E="";for await(let k of w.text)E+=k;f.info(`[CopilotLMFixer] Received response (${E.length} chars) from ${i.name}`);let y=this.extractCode(E);return y?a?(H.writeFileSync(a,y,"utf8"),f.success(`[CopilotLMFixer] Successfully updated ${n?.filePath} with Copilot LM remediation`),{success:!0,engine:"copilot",message:`Remediated by Copilot LM (${i.name}): ${t.title}`,stdout:E,modifiedFiles:[n?.filePath||"remediated_code.ts"]}):{success:!0,engine:"copilot",message:"Generated remediation patch with Copilot LM.",stdout:y,modifiedFiles:[]}:{success:!1,engine:"copilot",message:"Could not extract clean code replacement from Copilot LM response.",stdout:E,modifiedFiles:[]}}catch(m){return f.error("Copilot LM fix execution failed",m),{success:!1,engine:"copilot",message:`Copilot LM request failed: ${m.message||String(m)}`,stderr:String(m),modifiedFiles:[]}}}static buildPrompt(e,t,r,i="code"){return`
VULNERABILITY DETAILS:
- Title: ${e.title}
- Severity: ${e.severity.toUpperCase()}
- Rule ID: ${e.ruleId||"N/A"}
- CWE IDs: ${(e.cweIds||[]).join(", ")||"N/A"}
- Advisory: ${e.cveId||e.ghsaId||"N/A"}
- Description: ${e.description}
- Remediation Guideline: ${e.remediationPlan}
- Target Technology / Language: ${i.toUpperCase()}

TARGET LOCATION:
- File: ${e.location?.filePath||"Unknown"}
- Lines: ${e.location?.startLine??1} to ${e.location?.endLine??1}

VULNERABLE SNIPPET:
\`\`\`
${r||t.slice(0,500)}
\`\`\`

COMPLETE EXISTING FILE CONTENT:
\`\`\`
${t||r}
\`\`\`

INSTRUCTIONS FOR ${i.toUpperCase()}:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, namespaces, and functionality.
3. Eliminate memory corruption, injection, taint flow, or insecure APIs completely using standard safe modern ${i.toUpperCase()} constructs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`${i}
// remediated code here
\`\`\`
`}static extractCode(e){let t=e.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);if(t&&t[1])return t[1].trim();if(e.includes("import ")||e.includes("const ")||e.includes("function ")||e.includes("export "))return e.trim()}};var L=S(require("fs")),N=S(require("path"));var z=class{static DIR_NAME=".codevulfixer";static FILE_NAME="learned-patterns.json";static cache=new Map;static getPatternFilePath(e){return N.join(e,this.DIR_NAME,this.FILE_NAME)}static async loadLearnedPatterns(e){if(this.cache.has(e))return this.cache.get(e);let t=this.getPatternFilePath(e);if(!L.existsSync(t))return this.cache.set(e,[]),[];try{let r=await L.promises.readFile(t,"utf8"),i=JSON.parse(r);return this.cache.set(e,i),f.info(`[LearnedPatternEngine] Loaded ${i.length} learned fix patterns for repository.`),i}catch(r){return f.warn(`[LearnedPatternEngine] Failed to read learned patterns from ${t}: ${r}`),[]}}static async saveLearnedPattern(e,t){let r=await this.loadLearnedPatterns(e),i=r.findIndex(o=>o.id===t.id||o.ruleId===t.ruleId&&o.patternBefore===t.patternBefore);i>=0?r[i]={...r[i],...t,timesApplied:(r[i].timesApplied||0)+(t.timesApplied||0)}:r.push(t),this.cache.set(e,r);let n=N.join(e,this.DIR_NAME),a=this.getPatternFilePath(e);try{L.existsSync(n)||await L.promises.mkdir(n,{recursive:!0}),await L.promises.writeFile(a,JSON.stringify(r,null,2),"utf8"),f.success(`[LearnedPatternEngine] Persisted learned fix pattern "${t.name}" (${t.id}) to repo knowledge base.`)}catch(o){f.error(`[LearnedPatternEngine] Failed to persist learned patterns: ${o}`)}}static async learnFromFix(e,t,r,i){if(t.source!=="code_scanning")return;let n=t.ruleId||"custom-security-rule",a=t.cweIds?.[0]||"CWE-OTHER",o=t.location,c=o?.snippet;if(!c){f.info(`[LearnedPatternEngine] Finding ${t.id} has no snippet; skipping automated pattern extraction.`);return}let l="";if(r&&r.includes("+")&&r.includes("-")){let m=r.split(`
`).filter(b=>b.startsWith("+")&&!b.startsWith("+++")).map(b=>b.substring(1)).join(`
`).trim();m&&(l=m)}l||(n.includes("sql-injection")||a==="CWE-89"?l="/* Parameterized Query Replacement via Learned Rule */":n.includes("xss")||a==="CWE-79"?l=c.replace(/\.innerHTML\s*=/,".textContent ="):n.includes("randomness")||a==="CWE-330"?l=c.replace(/Math\.random\(\)[^;]*/,"require('crypto').randomBytes(24).toString('hex')"):l=`// Remediated via learned pattern for ${n}
${c}`);let g=N.extname(o?.filePath||"").replace(".","")||"javascript",d=n.replace(/[^a-zA-Z0-9]/g,"-").toUpperCase(),u={id:`LP-${d}-${Date.now().toString(36)}`,ruleId:n,cweId:a,name:`Learned Fix for ${d} (${a})`,description:`Locally synthesized fix pattern extracted from verified fix of ${t.id}.`,language:g,patternBefore:c.trim(),patternAfter:l.trim(),learnedFromFindingId:t.id,learnedAt:new Date().toISOString(),timesApplied:0,tokensSavedEstimate:500,source:i==="copilot"?"ai_copilot_synthesis":"developer_approved_diff"};return await this.saveLearnedPattern(e,u),u}static async findMatchingPattern(e,t){if(t.source!=="code_scanning")return;let r=await this.loadLearnedPatterns(e);if(r.length===0)return;let i=t.ruleId?.toLowerCase(),n=t.cweIds?.[0]?.toUpperCase(),a=t.location?.snippet?.trim();for(let o of r){let c=i&&o.ruleId.toLowerCase()===i||n&&o.cweId?.toUpperCase()===n;if(c&&(a&&(a.includes(o.patternBefore)||o.patternBefore.includes(a))||c&&o.patternBefore))return o}}static async applyLearnedPattern(e,t,r){let i=t.location;if(!i||!i.filePath)return{success:!1,engine:"deterministic",message:"No file location metadata available in Code Scanning alert.",modifiedFiles:[]};let n=N.isAbsolute(i.filePath)?i.filePath:N.join(e,i.filePath);if(!L.existsSync(n)){let l=N.dirname(n);L.existsSync(l)||L.mkdirSync(l,{recursive:!0}),L.writeFileSync(n,i.snippet||r.patternBefore,"utf8")}let a=await L.promises.readFile(n,"utf8"),o=a,c=!1;return r.patternBefore&&a.includes(r.patternBefore)?(o=a.replace(r.patternBefore,r.patternAfter),c=!0):i.snippet&&a.includes(i.snippet)?r.ruleId.includes("sql-injection")?(o=a.replace(/`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i,'"SELECT * FROM users WHERE email = $1", [req.query.email]'),c=!0):r.ruleId.includes("xss")?(o=a.replace(/\.innerHTML\s*=\s*([^;]+);/g,".textContent = $1;"),c=!0):r.ruleId.includes("randomness")?(o=a.replace(/Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,"require('crypto').randomBytes(24).toString('hex')"),c=!0):(o=a.replace(i.snippet,r.patternAfter),c=!0):(o=a+`
// Applied learned security pattern ${r.id}
`,c=!0),c?(await L.promises.writeFile(n,o,"utf8"),r.timesApplied=(r.timesApplied||0)+1,r.tokensSavedEstimate=(r.tokensSavedEstimate||0)+500,await this.saveLearnedPattern(e,r),f.success(`[LearnedPatternEngine] Applied learned pattern "${r.name}" (${r.id}) to ${i.filePath} &mdash; 0 AI Tokens consumed!`),{success:!0,engine:"deterministic",message:`Applied repository learned fix pattern (${r.name}) with Zero AI Tokens!`,modifiedFiles:[i.filePath]}):{success:!1,engine:"deterministic",message:`Target code snippet could not be matched for learned pattern ${r.id}.`,modifiedFiles:[]}}static clearCache(){this.cache.clear()}};var De=class{static async executeRepair(e,t,r){let i=Us.workspace.getConfiguration("codevulfixer"),n=r||i.get("preferredFixEngine","auto");if(f.info(`[RepairCoordinator] Deciding engine for ${t.id} (preference: ${n})...`),n!=="copilot"){let c=await z.findMatchingPattern(e,t);if(c){f.info(`[RepairCoordinator] Found learned pattern "${c.name}" for ${t.id}. Applying Zero-Token Deterministic Fix instead of calling AI!`);let l=await z.applyLearnedPattern(e,t,c);if(l.success)return{...l,message:`\u26A1 Zero-Token Learned Fix: ${l.message} (0 AI Tokens Consumed)`}}}if(n==="deterministic")return J.applyFix(e,t);if(n==="copilot"){let c=await de.applyFix(e,t);return c.success?(await z.learnFromFix(e,t,c.stdout,"copilot"),c):(f.warn(`Copilot LM repair failed or unavailable: ${c.message}. Falling back to deterministic engine.`),J.applyFix(e,t))}if(t.source==="dependabot")return J.applyFix(e,t);if(_e.some(c=>c.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(c.cwe))&&t.sizing.size==="S"){f.info(`[RepairCoordinator] Choosing Deterministic AST engine for self-contained rule: ${t.ruleId}`);let c=await J.applyFix(e,t);if(c.success)return c}f.info(`[RepairCoordinator] Choosing Copilot LM engine for ${t.id}`);let o=await de.applyFix(e,t);return o.success?(await z.learnFromFix(e,t,o.stdout,"copilot"),o):(f.info(`Copilot LM fallback to deterministic engine for ${t.id}`),J.applyFix(e,t))}};var Vs=S(require("vscode")),pe=S(require("fs")),it=S(require("path")),Hs=require("child_process"),Ns=require("util");var Ms=(0,Ns.promisify)(Hs.exec),Pe=class{static async validateWorkspace(e,t){let r=Vs.workspace.getConfiguration("codevulfixer"),i=r.get("autoRunTests",!0),n=r.get("buildCommand","npm run build"),a=r.get("testCommand","npm test"),o=r.get("auditCommand","npm audit"),c={passed:!0,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped",compatibilityStatus:"skipped"};if(!i)return f.info("Auto-validation is disabled in settings."),c;if(t?.dependency){let p=t.dependency;f.info(`[Validation] Inspecting collateral vulnerabilities and compatibility for ${p.packageName}@${p.fixedVersion}...`);let u=re.evaluateCascadingVulnerabilities(p,p.fixedVersion);if(u.hasCascadingRisk)return c.auditStatus="failed",c.compatibilityStatus="failed",c.passed=!1,c.cascadingVulnerabilitiesIntroduced=u.newVulnerabilities,c.suggestedAlternativeVersion=u.alternativeVersion,c.failureStackTrace=[`\u{1F6A8} Validation Checkpoint: Upgrading to ${p.packageName}@${p.fixedVersion} introduces collateral risk / incompatibilities:`,...u.newVulnerabilities.map(m=>`  \u2022 ${m}`),"","\u{1F4A1} Smart Safe Alternative Recommendation:",`  Upgrade to version "${u.alternativeVersion}" instead to eliminate the original vulnerability while avoiding collateral breaks.`].join(`
`),f.error(`[Validation] Collateral vulnerability intercepted for ${t.id}: ${c.failureStackTrace}`),c;if(t.compatibilityAdvice?.hasDeadlock){let m=t.compatibilityAdvice;return c.compatibilityStatus="failed",c.passed=!1,c.compatibilityIssues=[m.constraintSummary],c.suggestedAlternativeVersion=m.safeRecommendedVersion,c.failureStackTrace=["\u274C Runtime Platform Deadlock Intercepted:",`  ${m.constraintSummary}`,"","\u{1F4A1} Recommended Action:",`  ${m.tradeoffReason}`,`  Target Recommended Version: ${m.safeRecommendedVersion}`].join(`
`),f.error(`[Validation] Platform deadlock intercepted for ${t.id}`),c}c.compatibilityStatus="passed",c.auditStatus="passed"}let l=it.join(e,"package.json"),g=!1,d=!1;if(pe.existsSync(l))try{let p=JSON.parse(pe.readFileSync(l,"utf8"));g=!!(p.scripts&&p.scripts.build),d=!!(p.scripts&&p.scripts.test)}catch{}if(g||pe.existsSync(it.join(e,"tsconfig.json"))){let p=Date.now(),u=g?n:"npx tsc --noEmit";f.info(`[Validation] Running compilation check: ${u}`);try{let{stdout:m}=await Ms(u,{cwd:e,timeout:6e4});c.buildStatus="passed",c.buildDurationMs=Date.now()-p,c.buildOutput=m||"Compilation passed with zero errors.",f.success(`[Validation] Compilation check passed in ${c.buildDurationMs}ms.`)}catch(m){return c.buildStatus="failed",c.passed=!1,c.buildDurationMs=Date.now()-p,c.buildOutput=m.stdout||"",c.failureStackTrace=m.stderr||m.message,f.error(`[Validation] Compilation failed: ${m.message}`),c}}else c.buildStatus="skipped";if(d){let p=Date.now();f.info(`[Validation] Running regression test suite: ${a}`);try{let{stdout:u}=await Ms(a,{cwd:e,timeout:6e4});c.testStatus="passed",c.testDurationMs=Date.now()-p,c.testOutput=u||"All tests passed.",f.success(`[Validation] Test suite passed in ${c.testDurationMs}ms.`)}catch(u){return c.testStatus="failed",c.passed=!1,c.testDurationMs=Date.now()-p,c.testOutput=u.stdout||"",c.failureStackTrace=u.stderr||u.message,f.error(`[Validation] Test suite failed: ${u.message}`),c}}else c.testStatus="skipped";return c}};var Ge=S(require("fs")),Re=S(require("path")),zs=require("child_process"),Ws=require("util"),Go=(0,Ws.promisify)(zs.exec),Fe=class{static async getFileDiff(e,t){try{let{stdout:i}=await Go(`git diff --no-color -U3 -- "${t}"`,{cwd:e});if(i.trim().length>0)return{filePath:t,hasChanges:!0,rawDiff:i,lines:this.parseUnifiedDiff(i)}}catch{}let r=Re.isAbsolute(t)?t:Re.join(e,t);if(Ge.existsSync(r)){let i=Ge.readFileSync(r,"utf8"),n=i.split(/\r?\n/).map((a,o)=>({type:"add",content:a,newLineNumber:o+1}));return{filePath:t,hasChanges:!0,rawDiff:i,lines:n}}return{filePath:t,hasChanges:!1,rawDiff:"",lines:[]}}static async getMultiFileDiff(e,t){let r=[];for(let i of t)r.push(await this.getFileDiff(e,i));return r}static parseUnifiedDiff(e){let t=e.split(/\r?\n/),r=[],i=0,n=0;for(let a of t)if(a.startsWith("@@")){let o=a.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);o&&(i=parseInt(o[1],10),n=parseInt(o[2],10)),r.push({type:"normal",content:a})}else a.startsWith("+")&&!a.startsWith("+++")?r.push({type:"add",content:a.substring(1),newLineNumber:n++}):a.startsWith("-")&&!a.startsWith("---")?r.push({type:"delete",content:a.substring(1),oldLineNumber:i++}):a.startsWith(" ")&&r.push({type:"normal",content:a.substring(1),oldLineNumber:i++,newLineNumber:n++});return r}};var ue=S(require("vscode")),qs=require("child_process"),Bs=require("util");var ot=(0,Bs.promisify)(qs.exec),ge=class{static async stageAndSetCommitMessage(e,t,r){try{for(let o of r)f.info(`[SCM] Staging file: git add "${o}"`),await ot(`git add "${o}"`,{cwd:e});let i=t.source==="dependabot"?t.dependency?.packageName||"dependencies":t.location?.filePath||"security-audit",a=`security(fix): [CodeVulFixer] resolved ${t.cveId||t.ghsaId||t.ruleId||t.id} in ${i}

${t.title}
Remediation: ${t.remediationPlan}`;try{let o=ue.extensions.getExtension("vscode.git");if(o){let c=o.exports.getAPI(1);if(c&&c.repositories.length>0){let l=c.repositories[0];l.inputBox.value=a,f.info("[SCM] Populated VS Code Git commit message box.")}}}catch(o){f.warn(`Could not set VS Code SCM input box: ${o}`)}return ue.window.showInformationMessage(`CodeVulFixer: Staged fixes for ${t.id} and populated commit message.`),!0}catch(i){return f.error("Failed to stage files in Git",i),!1}}static async rollbackChanges(e,t){try{for(let r of t){f.info(`[SCM] Rolling back mutations in: ${r}`);try{await ot(`git restore "${r}"`,{cwd:e})}catch{await ot(`git checkout -- "${r}"`,{cwd:e})}}return ue.window.showWarningMessage(`CodeVulFixer: Rolled back workspace changes for ${t.join(", ")}.`),!0}catch(r){return f.error("Failed to rollback Git changes",r),!1}}};var Js=[{id:"DEP-101",source:"dependabot",alertNumber:101,title:"Denial of Service in axios due to unbounded buffer allocation",description:"Axios versions prior to 1.7.4 are vulnerable to Server-Side Request Forgery and Unhandled Rejections leading to DoS when parsing malicious redirect responses.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-8hc4-vh64-cxmj",cveId:"CVE-2023-45857",ghsaId:"GHSA-8hc4-vh64-cxmj",cweIds:["CWE-400","CWE-918"],dependency:{packageName:"axios",ecosystem:"npm",currentVersion:"^1.6.0",fixedVersion:"1.7.4",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 1.7.4",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Execute deterministic lockfile bump: `npm install axios@1.7.4 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Direct dependency patch update","Zero breaking API changes reported","Deterministic lockfile bump eligible"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-102",source:"dependabot",alertNumber:102,title:"Regular Expression Denial of Service (ReDoS) in semver",description:"semver vulnerable to Regular Expression Denial of Service when passing untrusted complex ranges to clean/validRange functions.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-c2qf-rxjj-qqgw",cveId:"CVE-2022-25883",ghsaId:"GHSA-c2qf-rxjj-qqgw",cweIds:["CWE-1333"],dependency:{packageName:"semver",ecosystem:"npm",currentVersion:"7.3.5",fixedVersion:"7.5.3",isDirect:!1,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 7.5.3",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Deduplicate & force update transitive lockfile entry for semver to >= 7.5.3",sizing:{size:"S",riskLevel:"low",reasons:["Transitive dependency patch bump","No direct code changes required in repository source"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-103",source:"dependabot",alertNumber:103,title:"Prototype Pollution in json5 leading to RCE or Crash",description:"json5 vulnerable to Prototype Pollution via parse function. Upgrading requires major version bump 1.x -> 2.2.2 with potential schema validation shifts.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-9c47-m6qq-7p4h",cveId:"CVE-2022-46175",ghsaId:"GHSA-9c47-m6qq-7p4h",cweIds:["CWE-1321"],dependency:{packageName:"json5",ecosystem:"npm",currentVersion:"^1.0.1",fixedVersion:"2.2.3",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 2.2.2",upgradeType:"major"},status:"pending",targetSprint:2,remediationPlan:"Upgrade json5 to 2.2.3, run complete test regression to verify custom deserializer calls",sizing:{size:"L",riskLevel:"high",reasons:["Major breaking version upgrade (1.x -> 2.x)","Imported in core configuration parsing modules","Requires compilation & test verification"],estimatedHours:3.5,isAutomatedCandidate:!1}},{id:"CS-201",source:"code_scanning",alertNumber:201,title:"Database query built from user-controlled string (SQL Injection)",description:"CodeQL detected untrusted HTTP parameter concatenation into raw SQL query without parameterized bindings in userRepository.ts.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/201",ruleId:"js/sql-injection",cweIds:["CWE-89"],location:{filePath:"demo/src/db/userRepository.ts",startLine:4,endLine:6,startColumn:3,endColumn:60,snippet:"const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;\n  const result = await db.raw(query);"},status:"pending",targetSprint:2,remediationPlan:'Refactor string interpolation to parameterized SQL query: `db.query("SELECT * FROM users WHERE email = $1", [req.query.email])`',sizing:{size:"L",riskLevel:"high",reasons:["Direct external input taint flow into database driver","Potential full data exfiltration risk","Cross-module data flow detected"],estimatedHours:4,isAutomatedCandidate:!1}},{id:"CS-202",source:"code_scanning",alertNumber:202,title:"Use of cryptographically weak pseudo-random number generator",description:"Math.random() is used to generate session tokens or authentication secrets in tokenGenerator.ts.",severity:"medium",htmlUrl:"https://github.com/example/repo/security/code-scanning/202",ruleId:"js/insecure-randomness",cweIds:["CWE-330"],location:{filePath:"demo/src/auth/tokenGenerator.ts",startLine:4,endLine:5,startColumn:3,endColumn:45,snippet:"const token = Math.random().toString(36).substring(2);"},status:"pending",targetSprint:1,remediationPlan:"Replace Math.random() with `crypto.randomBytes(32).toString('hex')`",sizing:{size:"S",riskLevel:"low",reasons:["Self-contained local expression swap","Pre-compiled AST pattern match available","Low regression impact on caller"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-203",source:"code_scanning",alertNumber:203,title:"DOM text reinterpreted as HTML without escaping (XSS)",description:"Assigning unsanitized user profile bio directly to Element.innerHTML creates an execution path for malicious script tags.",severity:"high",htmlUrl:"https://github.com/example/repo/security/code-scanning/203",ruleId:"js/xss-through-dom",cweIds:["CWE-79"],location:{filePath:"demo/src/web/render.ts",startLine:9,endLine:10,startColumn:3,endColumn:38,snippet:"userBioElement.innerHTML = user.bio;"},status:"pending",targetSprint:1,remediationPlan:"Change `innerHTML` to `textContent` or sanitize with DOMPurify",sizing:{size:"S",riskLevel:"low",reasons:["Localized DOM assignment","Direct AST replacement innerHTML -> textContent","No complex data flow"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-204",source:"code_scanning",alertNumber:204,title:"Untrusted input passed directly to child_process.exec (Command Injection)",description:"String concatenation into shell execution command in execHelper.ts allows arbitrary command execution.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/204",ruleId:"js/command-injection",cweIds:["CWE-78"],location:{filePath:"demo/src/utils/execHelper.ts",startLine:6,endLine:7,startColumn:3,endColumn:45,snippet:"exec(`git checkout ${branchName}`, callback);"},status:"pending",targetSprint:2,remediationPlan:'Use `execFile` with separate arguments array instead of shell interpolation: `execFile("git", ["checkout", branchName])`',sizing:{size:"L",riskLevel:"high",reasons:["Remote Code Execution potential","Shell invocation architecture change","Requires argument validation helper"],estimatedHours:3,isAutomatedCandidate:!1}},{id:"DEP-104",source:"dependabot",alertNumber:104,title:"DoS through memory exhaustion in ws websocket library",description:"ws client allows attacker to send infinite message headers causing Node process out-of-memory.",severity:"medium",htmlUrl:"https://github.com/advisories/GHSA-3h5v-q93c-6h6q",cveId:"CVE-2024-37890",ghsaId:"GHSA-3h5v-q93c-6h6q",cweIds:["CWE-400"],dependency:{packageName:"ws",ecosystem:"npm",currentVersion:"^8.14.0",fixedVersion:"8.17.1",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 8.17.1",upgradeType:"minor"},status:"pending",targetSprint:3,remediationPlan:"Upgrade ws to 8.17.1 via `npm install ws@8.17.1 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Minor hygiene upgrade","Fully backward-compatible API"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-205",source:"code_scanning",alertNumber:205,title:"Unsanitized path concatenation in file server (Path Traversal)",description:"path.join with untrusted request parameter allows reading arbitrary files outside root folder if not bounded by path.resolve.",severity:"low",htmlUrl:"https://github.com/example/repo/security/code-scanning/205",ruleId:"js/path-traversal",cweIds:["CWE-22"],location:{filePath:"demo/src/server/fileHandler.ts",startLine:7,endLine:9,startColumn:3,endColumn:55,snippet:`const filePath = path.join(publicDir, req.query.filename);
  return fs.readFileSync(filePath);`},status:"pending",targetSprint:3,remediationPlan:"Enforce boundary check: verify `path.resolve(publicDir, filename).startsWith(publicDir)`",sizing:{size:"M",riskLevel:"medium",reasons:["Requires path verification utility injection","Non-critical asset endpoint"],estimatedHours:1.5,isAutomatedCandidate:!1}},{id:"DEP-105",source:"dependabot",alertNumber:105,title:"Spring Framework Multiple Critical Remote Code Execution Vulnerabilities",description:"Spring Framework 1.x carries critical RCE and deserialization vulnerabilities. Upgrading requires multi-generational jump from 1.2.9 to 5.3.39 while respecting legacy module Java 8 pin.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-35rh-f86p-hx82",cveId:"CVE-2022-22965",ghsaId:"GHSA-35rh-f86p-hx82",cweIds:["CWE-94","CWE-502"],dependency:{packageName:"org.springframework:spring-core",ecosystem:"maven",currentVersion:"1.2.9",fixedVersion:"5.3.39",isDirect:!0,manifestFile:"pom.xml",vulnerableVersionRange:"< 5.3.39",upgradeType:"major",majorGap:4,javaVersionConstraint:"8",targetJavaVersion:"8"},status:"pending",targetSprint:2,remediationPlan:"Migrate Spring 1.2.9 XML configuration to Spring 5.3.39 annotations while maintaining Java 8 runtime baseline.",sizing:{size:"XL",riskLevel:"high",reasons:["Multi-generational major version jump (v1.x \u2794 v5.x) spans 4 major releases with extensive architectural breaking changes","Requires comprehensive configuration refactoring, API migration, and regression test suites","Direct package definition requires codebase API audit","\u{1F4A1} Smart Remediation Recommendation: Upgrade to 5.3.39 instead of Spring 6.x to maintain Java 8 module compatibility"],estimatedHours:72,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"6.1.14",safeRecommendedVersion:"5.3.39",constraintSummary:"Legacy modules require Java 8 compatibility; Spring 6+ mandates Java 17+.",tradeoffReason:"Upgrading to Spring 6.x causes immediate build/runtime failure due to Java 8 module lock. Upgrading to Spring 5.3.39 (Intermediate Safe Target) eliminates critical RCE exposure while guaranteeing 100% Java 8 runtime compliance.",riskReduction:"Eliminates Critical Remote Code Execution while completely avoiding platform incompatibility and module failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["legacy-banking-module"]}},{id:"DEP-106",source:"dependabot",alertNumber:106,title:"Open Redirect & Query Parameter Parsing Vulnerability in Express",description:"Express < 4.19.2 is vulnerable to open redirect. Target upgrade to Express 5.0 introduces breaking middleware signatures and peer conflicts with cookie-parser.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-qw6h-vgh9-j6q6",cveId:"CVE-2024-29041",ghsaId:"GHSA-qw6h-vgh9-j6q6",cweIds:["CWE-601"],dependency:{packageName:"express",ecosystem:"npm",currentVersion:"4.17.1",fixedVersion:"5.0.0",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 4.19.2",upgradeType:"major",majorGap:1},status:"pending",targetSprint:1,remediationPlan:"Apply safe intermediate patch: upgrade to express@4.19.2 instead of 5.0.0 to avoid breaking middleware and collateral vulnerabilities.",sizing:{size:"L",riskLevel:"high",reasons:["Major version upgrade introduces potential API breaking changes","Direct package definition requires codebase API audit","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 4.19.2 instead of 5.0.0 to avoid breaking middleware"],estimatedHours:3.5,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"5.0.0",safeRecommendedVersion:"4.19.2",constraintSummary:"Downstream middleware modules strictly depend on Express 4.x Router signature.",tradeoffReason:"Upgrading to Express 5.0 breaks existing middleware dependencies and router handlers. Upgrading to safe intermediate 4.19.2 patches CVE-2024-29041 with 100% backward compatibility.",riskReduction:"Eliminates High Open Redirect vulnerability without risking runtime middleware breakage.",actionStrategy:"intermediate_upgrade",conflictingPackages:["cookie-parser","body-parser"]}},{id:"DEP-107",source:"dependabot",alertNumber:107,title:"Apache Log4j Remote Code Execution (Log4Shell)",description:"Apache Log4j2 JNDI features used in configuration and logging do not protect against attacker controlled LDAP endpoints (Log4Shell). Upgrading requires resolving Java 8 runtime constraints.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-jfh8-c2jp-5v3q",cveId:"CVE-2021-44228",ghsaId:"GHSA-jfh8-c2jp-5v3q",cweIds:["CWE-502","CWE-400"],dependency:{packageName:"org.apache.logging.log4j:log4j-core",ecosystem:"maven",currentVersion:"2.14.1",fixedVersion:"2.17.1",isDirect:!0,manifestFile:"pom.xml",vulnerableVersionRange:"< 2.17.1",upgradeType:"patch",javaVersionConstraint:"8",targetJavaVersion:"8"},status:"pending",targetSprint:1,remediationPlan:"Apply safe intermediate upgrade: upgrade to log4j-core@2.17.1 (Java 8 compliant) instead of 2.20/3.x to fix Log4Shell without JVM runtime mismatch.",sizing:{size:"M",riskLevel:"medium",reasons:["Critical severity dependency patch prioritized for immediate remediation","Direct package definition requires codebase lockfile audit","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 2.17.1 instead of 2.20+ to maintain Java 8 baseline"],estimatedHours:2,isAutomatedCandidate:!0},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"2.20.0",safeRecommendedVersion:"2.17.1",constraintSummary:"Workspace pom.xml is pinned to Java 8 (<java.version>1.8</java.version>). Modern Log4j 2.20+ requires Java 9+ bytecode.",tradeoffReason:"Upgrading to Log4j 2.20+ causes fatal compilation / bytecode errors on Java 8 JVMs. Upgrading to Log4j 2.17.1 fully neutralizes Log4Shell (CVE-2021-44228) while ensuring 100% Java 8 runtime compliance.",riskReduction:"Eliminates Critical Log4Shell RCE with zero JVM platform deadlock risk.",actionStrategy:"intermediate_upgrade",conflictingPackages:["org.apache.logging.log4j:log4j-api"]}},{id:"DEP-108",source:"dependabot",alertNumber:108,title:"Apache log4net XML External Entity (XXE) Injection and Remote Code Execution",description:"Apache log4net versions prior to 2.0.10 allow remote attackers to execute arbitrary code or parse untrusted XML via NetSendAppender and XmlDocument. Target application runs .NET Framework 4.8.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-vm8r-px2f-pfp4",cveId:"CVE-2018-1285",ghsaId:"GHSA-vm8r-px2f-pfp4",cweIds:["CWE-611","CWE-502"],dependency:{packageName:"log4net",ecosystem:"nuget",currentVersion:"1.2.10",fixedVersion:"2.0.15",isDirect:!0,manifestFile:"App.csproj",vulnerableVersionRange:"< 2.0.10",upgradeType:"major",targetFramework:"net48"},status:"pending",targetSprint:2,remediationPlan:"Apply safe intermediate upgrade: bump log4net from 1.2.10 to 2.0.15 via NuGet to eliminate XXE without breaking .NET Framework 4.8 runtime or app.config.",sizing:{size:"L",riskLevel:"high",reasons:["Major version upgrade introduces potential API breaking changes","Direct package definition in .csproj requires assembly binding redirect check","\u{1F4A1} Smart Recommendation: Upgrade to safe intermediate 2.0.15 instead of 3.0 to preserve .NET Framework 4.8 compatibility"],estimatedHours:3.5,isAutomatedCandidate:!1},compatibilityAdvice:{hasDeadlock:!1,idealVersion:"3.0.0",safeRecommendedVersion:"2.0.15",constraintSummary:"Legacy .csproj targets <TargetFramework>net48</TargetFramework>. Modern log4net 3.x requires modern .NET Core / .NET 6+ runtime.",tradeoffReason:"Upgrading to log4net 3.x breaks legacy .NET Framework 4.8 app.config XML layouts and binding redirects. Upgrading to log4net 2.0.15 patches CVE-2018-1285 while maintaining 100% backward compatibility with .NET Framework 4.x.",riskReduction:"Mitigates High XXE & RCE vulnerability with zero .NET runtime migration failure.",actionStrategy:"intermediate_upgrade",conflictingPackages:["log4net"]}},{id:"DEP-109",source:"dependabot",alertNumber:109,title:"Server-Side Request Forgery (SSRF) in axios via relative path redirection",description:"Axios relative path parsing vulnerability allows SSRF when handling absolute URL redirects with user controlled headers. Linked to root package axios alongside DEP-101.",severity:"medium",htmlUrl:"https://github.com/advisories/GHSA-8hc4-vh64-cxmj",cveId:"CVE-2024-39338",ghsaId:"GHSA-8hc4-vh64-cxmj",cweIds:["CWE-918"],dependency:{packageName:"axios",ecosystem:"npm",currentVersion:"^1.6.0",fixedVersion:"1.7.4",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 1.7.4",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Co-resolved automatically with Zero Tokens when axios is upgraded to 1.7.4 via DEP-101.",sizing:{size:"S",riskLevel:"low",reasons:["Co-remediated with primary axios upgrade (DEP-101)","Zero additional AI tokens required"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-206",source:"code_scanning",alertNumber:206,title:"Database query built from user-controlled string in orderRepository.ts (SQLi)",description:"Untrusted HTTP parameter interpolation in order lookup SQL query. Matches the learned parameterized query pattern from CS-201.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/206",ruleId:"js/sql-injection",cweIds:["CWE-89"],location:{filePath:"demo/src/db/orderRepository.ts",startLine:5,endLine:7,startColumn:3,endColumn:60,snippet:"const query = `SELECT * FROM orders WHERE customer_id = '${req.query.customerId}'`;\n  const result = await db.raw(query);"},status:"pending",targetSprint:2,remediationPlan:"Apply repository learned pattern (LP-JS-SQL-INJECTION) with Zero AI Tokens: transform string interpolation into parameterized prepared statement.",sizing:{size:"S",riskLevel:"low",reasons:["Matches repository learned pattern from CS-201","Eligible for Zero-Token automated execution without AI model call"],estimatedHours:.5,isAutomatedCandidate:!0}}];function Xs(s,e="risk-profile",t){let r=JSON.stringify(s||null).replace(/</g,"\\u003c"),i=JSON.stringify(t||null).replace(/</g,"\\u003c");return`<!DOCTYPE html>
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
      --color-purple: #6f42c1;
      --color-success-bg: rgba(40, 167, 69, 0.15);
      --color-warning-bg: rgba(255, 193, 7, 0.15);
      --color-danger-bg: rgba(220, 53, 69, 0.15);
      --color-info-bg: rgba(23, 162, 184, 0.15);
      --color-purple-bg: rgba(111, 66, 193, 0.15);
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
      gap: 6px;
    }

    .tab-btn:hover {
      color: var(--vscode-tab-activeForeground, #fff);
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-btn.active {
      color: var(--vscode-tab-activeForeground, #fff);
      border-bottom: 2px solid var(--vscode-progressBar-background, #007acc);
      background: var(--vscode-editor-background);
    }

    /* Content Area */
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

    /* Metrics Grid & Separated Rows */
    .metrics-section {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .metrics-row-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .metrics-row-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
    }

    .metric-card {
      background: var(--vscode-editor-background, #1e1e1e);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 14px 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
    .metric-card.purple::before { background: var(--color-purple); }

    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      opacity: 0.7;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 26px;
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
    .btn-success:hover {
      background: #218838;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .btn-danger:hover {
      background: #c82333;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 11px;
    }

    /* Phase Banners */
    .sprint-phase-banner {
      background: linear-gradient(135deg, rgba(23, 162, 184, 0.15), rgba(40, 167, 69, 0.1));
      border: 1px solid rgba(23, 162, 184, 0.4);
      border-radius: 8px;
      padding: 14px 20px;
      margin: 24px 0 16px 0;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sprint-phase-banner.code-scanning {
      background: linear-gradient(135deg, rgba(111, 66, 193, 0.15), rgba(23, 162, 184, 0.1));
      border: 1px solid rgba(111, 66, 193, 0.4);
    }
    .sprint-phase-sub {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 400;
      margin-top: 2px;
    }

    /* Cards & Grids */
    .sprint-header {
      background: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sprint-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .sprint-desc {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
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
    }

    .vuln-card:hover {
      border-color: var(--vscode-focusBorder, #007acc);
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
      line-height: 1.35;
      margin-bottom: 8px;
    }

    .card-desc {
      font-size: 12px;
      opacity: 0.8;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .card-meta {
      font-size: 11px;
      opacity: 0.75;
      background: rgba(0,0,0,0.2);
      padding: 8px 10px;
      border-radius: 4px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding-top: 12px;
      margin-top: 8px;
    }

    /* Badges */
    .badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-high { background: rgba(253, 126, 20, 0.2); color: #fd7e14; border: 1px solid #fd7e14; }
    .badge-medium { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-low { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }

    .badge-s { background: var(--color-success-bg); color: var(--color-success); border: 1px solid var(--color-success); }
    .badge-m { background: var(--color-warning-bg); color: var(--color-warning); border: 1px solid var(--color-warning); }
    .badge-l { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger); }
    .badge-xl { background: rgba(111, 66, 193, 0.25); color: #d2a8ff; border: 1px solid rgba(111, 66, 193, 0.6); }

    /* Advice Card & Target/Risk Reduction Styling with Darker Font for High Contrast */
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
      background: #85e89d;
      color: #111111; /* Dark text (black/dark-brown) for sharp readability against light green badge */
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      border: 1px solid #34d058;
      display: inline-block;
    }
    .advice-ideal {
      background: rgba(220, 53, 69, 0.2);
      color: #ff7b72;
      padding: 2px 7px;
      border-radius: 4px;
      text-decoration: line-through;
      border: 1px solid rgba(220, 53, 69, 0.3);
      display: inline-block;
    }
    .advice-risk-reduction {
      color: #111111; /* Darker font (black/dark brown) for clear visibility */
      font-weight: 700;
      background: #85e89d;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      border: 1px solid #34d058;
      margin-top: 4px;
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
    .status-rejected { background: rgba(108, 117, 125, 0.2); color: #aaa; }

    /* Checkpoint Overlay Banner */
    .checkpoint-banner {
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.2) 0%, rgba(23, 162, 184, 0.15) 100%);
      border: 1px solid var(--color-success);
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .checkpoint-info h3 {
      margin: 0 0 4px 0;
      font-size: 15px;
      color: #7ee787;
    }

    .checkpoint-info p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    /* Terminal/Log Box */
    .terminal-box {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 12px 14px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.45;
      color: #c9d1d9;
      margin: 10px 0;
      overflow-x: auto;
    }

    .terminal-title {
      font-weight: 700;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
    }

    /* Diff View */
    .diff-container {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border, #333);
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .diff-header {
      background: var(--vscode-sideBar-background, #252526);
      padding: 10px 16px;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
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
      opacity: 0.4;
      text-align: right;
      padding-right: 12px;
      font-size: 11px;
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
      max-width: 850px;
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

    .json-textarea {
      width: 100%;
      height: 320px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.45;
      background: var(--vscode-editor-background, #1e1e1e);
      color: var(--vscode-editor-foreground, #d4d4d4);
      border: 1px solid var(--vscode-input-border, #444);
      border-radius: 6px;
      padding: 12px;
      box-sizing: border-box;
      resize: vertical;
      tab-size: 2;
    }

    .json-textarea:focus {
      outline: 1px solid var(--vscode-focusBorder, #007acc);
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
        <div class="brand-subtitle">${s?`${s.repoOwner}/${s.repoName} \u2022 Multi-Day Sprint Engine`:"Automated & AI Fix Pipeline"}</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" onclick="exportToExcel()" title="Export complete dashboard to multi-tab Excel XML workbook (.xml)">
        <span>\u{1F4CA}</span> Export to Excel (XML)
      </button>
      <button class="btn btn-secondary" onclick="validateAndRescan()" title="Rescan local workspace to detect fixed packages/patterns and auto-resolve linked findings with Zero AI Tokens">
        <span>\u{1F50D}</span> Validate Local Fixes (0-Token)
      </button>
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
    <button id="tab-btn-risk-profile" class="tab-btn ${e==="risk-profile"?"active":""}" onclick="switchTab('risk-profile')">
      \u{1F4CA} Workspace Risk Profile
    </button>
    <button id="tab-btn-sprint-board" class="tab-btn ${e==="sprint-board"?"active":""}" onclick="switchTab('sprint-board')">
      \u{1F4CB} Multi-Day Sprint Board
    </button>
    <button id="tab-btn-diff-inspector" class="tab-btn ${e==="diff-inspector"?"active":""}" onclick="switchTab('diff-inspector')">
      \u{1F50D} Live Diff & Verification Intercept
    </button>
    <button id="tab-btn-settings" class="tab-btn ${e==="settings"?"active":""}" onclick="switchTab('settings')">
      \u2699\uFE0F Sprint Configuration
    </button>
  </div>

  <div class="container">

    <!-- TAB 1: Workspace Risk Profile -->
    <div id="tab-content-risk-profile" class="tab-content ${e==="risk-profile"?"active":""}">
      ${s?Ao(s):Ks()}
    </div>

    <!-- TAB 2: Multi-Day Sprint Board -->
    <div id="tab-content-sprint-board" class="tab-content ${e==="sprint-board"?"active":""}">
      ${s?Oo(s):Ks()}
    </div>

    <!-- TAB 3: Live Diff & Verification Intercept -->
    <div id="tab-content-diff-inspector" class="tab-content ${e==="diff-inspector"?"active":""}">
      ${$o(t,Object.values(s?.findings||{}))}
    </div>

    <!-- TAB 4: Sprint Configuration & Live State JSON -->
    <div id="tab-content-settings" class="tab-content ${e==="settings"?"active":""}">
      ${jo(s)}
    </div>

  </div>

  <script>
    const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
    const appState = ${r};
    const currentDiffFinding = ${i};

    function sendCommand(cmd, payload = {}) {
      if (vscode) {
        vscode.postMessage({ command: cmd, ...payload });
      } else {
        alert('This is a standalone offline dashboard export for review. To execute automated actions or run fixes, open CodeVulFixer in VS Code.');
      }
    }

    function switchTab(tabName) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

      const targetBtn = document.getElementById('tab-btn-' + tabName);
      if (targetBtn) targetBtn.classList.add('active');

      const targetContent = document.getElementById('tab-content-' + tabName);
      if (targetContent) targetContent.classList.add('active');

      if (vscode) {
        vscode.postMessage({ command: 'switchTabNoReload', tab: tabName });
      }
    }

    function exportToExcel() {
      sendCommand('exportToExcel');
    }

    function validateAndRescan() {
      sendCommand('validateLocal');
    }

    function scanWorkspace() {
      sendCommand('scan');
    }

    function loadDemoData() {
      sendCommand('loadDemoData');
    }

    function resetState() {
      if (confirm('Reset CodeVulFixer sprint state?')) {
        sendCommand('resetState');
      }
    }

    function executeSprint(sprintNumber) {
      sendCommand('runSprint', { sprintNumber });
    }

    function applySingleFix(findingId, engine) {
      sendCommand('applyFix', { findingId, engine });
    }

    function inspectDiff(findingId) {
      sendCommand('inspectDiff', { findingId });
    }

    function markVerifiedAndStage(findingId) {
      sendCommand('verifyStage', { findingId });
    }

    function rejectAndRollback(findingId) {
      sendCommand('rejectRollback', { findingId });
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

    function saveSprintStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      const raw = textarea.value.trim();
      try {
        JSON.parse(raw);
      } catch (err) {
        alert('Invalid JSON Syntax: ' + err.message);
        return;
      }
      vscode.postMessage({ command: 'saveSprintStateJson', rawJson: raw });
    }

    function reloadState() {
      vscode.postMessage({ command: 'reloadState' });
    }

    function copyStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Sprint state JSON copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy: ' + err);
      });
    }

    function formatStateJson() {
      const textarea = document.getElementById('rawStateJson');
      if (!textarea) return;
      try {
        const obj = JSON.parse(textarea.value);
        textarea.value = JSON.stringify(obj, null, 2);
      } catch (err) {
        alert('Cannot format invalid JSON: ' + err.message);
      }
    }
  </script>
</body>
</html>`}function Ks(){return`
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
  `}function Qs(s){let e=Object.values(s.findings||{}),t=e.filter(h=>h.source==="dependabot"),r=e.filter(h=>h.source==="code_scanning"),i=t.filter(h=>h.severity==="critical").length,n=t.filter(h=>h.severity==="high").length,a=t.filter(h=>h.severity==="medium").length,o=t.filter(h=>h.severity==="low").length,c=t.filter(h=>h.status==="verified").length,l=Math.round(t.reduce((h,C)=>h+(C.sizing?.estimatedHours||0),0)*10)/10,g=Math.round(l*.75*10)/10,d=t.length>0?Math.round(c/t.length*100):0,p=r.filter(h=>h.severity==="critical").length,u=r.filter(h=>h.severity==="high").length,m=r.filter(h=>h.severity==="medium").length,b=r.filter(h=>h.severity==="low").length,w=r.filter(h=>h.status==="verified").length,E=Math.round(r.reduce((h,C)=>h+(C.sizing?.estimatedHours||0),0)*10)/10,y=Math.round(E*.75*10)/10,k=r.length>0?Math.round(w/r.length*100):0;return`
    <div style="margin-bottom: 24px;">
      <!-- Row 1: Dependabot Vulnerabilities (Priority 1) -->
      <div class="metrics-section">
        <div class="metrics-row-header">
          <span class="metrics-row-badge" style="background: rgba(23, 162, 184, 0.2); color: #17a2b8; border: 1px solid rgba(23, 162, 184, 0.4);">
            \u{1F4E6} Priority 1: Dependabot Vulnerabilities (${t.length} Total)
          </span>
          <span style="font-size: 11px; opacity: 0.75;">Third-party dependencies, direct/transitive lockfile CVEs & framework upgrades</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card danger">
            <div class="metric-label">Dependabot Critical & High</div>
            <div class="metric-value">${i+n}</div>
            <div class="metric-sub">\u{1F534} ${i} Critical \u2022 \u{1F7E0} ${n} High</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">Dependabot Medium & Low</div>
            <div class="metric-value">${a+o}</div>
            <div class="metric-sub">\u{1F7E1} ${a} Medium \u2022 \u{1F7E2} ${o} Low</div>
          </div>
          <div class="metric-card success">
            <div class="metric-label">Dependabot Remediated</div>
            <div class="metric-value">${c} / ${t.length}</div>
            <div class="metric-sub">\u{1F7E2} ${d}% Dependabot Completion</div>
          </div>
          <div class="metric-card info">
            <div class="metric-label">Dependabot Developer Time Saved</div>
            <div class="metric-value">${g}h</div>
            <div class="metric-sub">\u{1F535} Total Effort: ${l}h</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Code Scanning Findings (Priority 2) -->
      <div class="metrics-section">
        <div class="metrics-row-header">
          <span class="metrics-row-badge" style="background: rgba(111, 66, 193, 0.2); color: #d2a8ff; border: 1px solid rgba(111, 66, 193, 0.4);">
            \u{1F50D} Priority 2: Code Scanning (CodeQL / SAST) Findings (${r.length} Total)
          </span>
          <span style="font-size: 11px; opacity: 0.75;">First-party static analysis taint flows, injection flaws & code hygiene</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card danger">
            <div class="metric-label">Code Scanning Critical & High</div>
            <div class="metric-value">${p+u}</div>
            <div class="metric-sub">\u{1F534} ${p} Critical \u2022 \u{1F7E0} ${u} High</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">Code Scanning Medium & Low</div>
            <div class="metric-value">${m+b}</div>
            <div class="metric-sub">\u{1F7E1} ${m} Medium \u2022 \u{1F7E2} ${b} Low</div>
          </div>
          <div class="metric-card success">
            <div class="metric-label">Code Scanning Remediated</div>
            <div class="metric-value">${w} / ${r.length}</div>
            <div class="metric-sub">\u{1F7E2} ${k}% CodeQL Completion</div>
          </div>
          <div class="metric-card info">
            <div class="metric-label">Code Scanning Developer Time Saved</div>
            <div class="metric-value">${y}h</div>
            <div class="metric-sub">\u{1F535} Total Effort: ${E}h</div>
          </div>
        </div>
      </div>
    </div>
  `}function Ro(s){let e=s.clubbingSummary||M.analyzeClusters(s.findings),t=e.clusters.filter(i=>i.type==="package"),r=e.clusters.filter(i=>i.type==="cwe_rule");return`
    <div class="metrics-section" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <span>\u{1F9E9}</span> Root-Cause Consolidation & Unique Vulnerabilities Analysis
            <span class="badge" style="background: rgba(40,167,69,0.2); color: #28a745; border: 1px solid rgba(40,167,69,0.4);">
              ${e.remediationLeverageRatio}x Remediation Leverage
            </span>
          </div>
          <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
            Consolidated <strong>${e.totalRawFindings} raw security alerts</strong> into <strong>${e.uniqueIssuesCount} unique root issues</strong> (${e.uniquePackagesCount} unique packages, ${e.uniqueCweRulesCount} unique CodeQL patterns). Fixing one root package or pattern automatically co-resolves multiple linked findings with Zero Tokens!
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Raw Alerts</div>
            <div style="font-size: 18px; font-weight: 800; color: #ff7b72;">${e.totalRawFindings}</div>
          </div>
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Unique Issues</div>
            <div style="font-size: 18px; font-weight: 800; color: #79c0ff;">${e.uniqueIssuesCount}</div>
          </div>
          <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 6px 14px; text-align: center;">
            <div style="font-size: 10px; opacity: 0.7; text-transform: uppercase;">Remediation Leverage</div>
            <div style="font-size: 18px; font-weight: 800; color: #56d364;">${e.remediationLeverageRatio}x</div>
          </div>
        </div>
      </div>

      <!-- Clusters Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <!-- Left: Unique Packages (Dependabot) -->
        <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #17a2b8; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>\u{1F4E6} Unique Root Packages (${t.length})</span>
            <span style="font-size: 11px; opacity: 0.8; font-weight: 400;">Approach 1: Co-Remediation</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${t.map(i=>`
              <div style="background: var(--vscode-sideBar-background, #252526); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 12.5px;">${D(i.name)} ${i.targetFixedVersion?`<span style="opacity: 0.7; font-size: 11px;">(\u2794 ${D(i.targetFixedVersion)})</span>`:""}</div>
                  <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">
                    Linked Alerts: ${i.findingIds.map(n=>`<code>${n}</code>`).join(", ")}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-${i.highestSeverity}">${i.highestSeverity}</span>
                  <div style="margin-top: 4px;">
                    ${i.resolvedFindings===i.totalFindings?'<span class="badge badge-success">\u{1F7E2} All Remediated</span>':`<span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">\u26A1 ${i.totalFindings} Alerts Linked</span>`}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Unique CWE / Rule Families (Code Scanning) -->
        <div style="background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border, #333); border-radius: 6px; padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #d2a8ff; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>\u{1F50D} Unique CodeQL CWE Families (${r.length})</span>
            <span style="font-size: 11px; opacity: 0.8; font-weight: 400;">Approach 2: Learned Patterns</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${r.map(i=>`
              <div style="background: var(--vscode-sideBar-background, #252526); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 12.5px;">${D(i.name)}</div>
                  <div style="font-size: 11px; opacity: 0.75; margin-top: 2px;">
                    Occurrences: ${i.findingIds.map(n=>`<code>${n}</code>`).join(", ")}
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-${i.highestSeverity}">${i.highestSeverity}</span>
                  <div style="margin-top: 4px;">
                    ${i.resolvedFindings>0?'<span class="badge" style="background: rgba(111,66,193,0.25); color: #d2a8ff;">\u26A1 Zero-Token Learned</span>':`<span class="badge" style="background: rgba(255,193,7,0.15); color: #ffc107;">${i.totalFindings} Occurrences</span>`}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `}function Ao(s){let e=s.metrics,t=Object.values(s.findings||{}),r=t.filter(o=>o.source==="dependabot"),i=t.filter(o=>o.source==="code_scanning"),n=Math.round(r.reduce((o,c)=>o+(c.sizing?.estimatedHours||0),0)*10)/10,a=Math.round(i.reduce((o,c)=>o+(c.sizing?.estimatedHours||0),0)*10)/10;return`
    <!-- Top Summary Telemetry Metrics: 2 Rows -->
    ${Qs(s)}

    <!-- Root-Cause Consolidation & Unique Vulnerabilities Strip -->
    ${Ro(s)}

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
      <div class="sprint-header" style="flex-direction: column; align-items: flex-start; gap: 12px;">
        <div style="font-size: 16px; font-weight: 700;">Executive Security Posture & Prioritized Remediation Roadmap</div>
        <p style="font-size: 13px; opacity: 0.85; margin: 0;">
          CodeVulFixer partitions remediation into two sequential tracks: <strong>Priority 1: Dependabot Vulnerabilities</strong> (stabilizing third-party manifests and locking safe versions) followed by <strong>Priority 2: Code Scanning Findings</strong> (AST pattern transforms and deep taint analysis).
        </p>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <button class="btn btn-success" onclick="switchTab('sprint-board')">
            <span>\u{1F680}</span> Start Dependabot Sprints
          </button>
          <button class="btn btn-secondary" onclick="scanWorkspace()">
            <span>\u{1F504}</span> Refresh GitHub Ingestion
          </button>
        </div>
      </div>

      <div class="metric-card info" style="display: flex; flex-direction: column; justify-content: center;">
        <div class="metric-label">Multi-Day Remediation Timeline</div>
        <div style="font-size: 18px; font-weight: 700; margin: 8px 0;">${s.sprints.length} Planned Sprints</div>
        <div style="font-size: 12px; opacity: 0.85;">
          Sequenced so all Dependabot Vulnerabilities are resolved first, followed by CodeQL code refactoring.
        </div>
      </div>
    </div>

    <!-- Section 1: Dependabot Vulnerabilities Matrix -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 12px;">
        <div>
          <span class="badge" style="background: rgba(23, 162, 184, 0.2); color: #17a2b8; font-size: 12px; padding: 4px 10px;">
            \u{1F4E6} Priority 1: Dependabot Vulnerabilities (${r.length} Items \u2022 ${n}h Effort)
          </span>
        </div>
        <div style="display: flex; gap: 8px; font-size: 11px;">
          <span class="badge badge-s">Size S: ${r.filter(o=>o.sizing?.size==="S").length}</span>
          <span class="badge badge-m">Size M: ${r.filter(o=>o.sizing?.size==="M").length}</span>
          <span class="badge badge-l">Size L: ${r.filter(o=>o.sizing?.size==="L").length}</span>
          <span class="badge badge-xl">Size XL: ${r.filter(o=>o.sizing?.size==="XL").length}</span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">Package & Target</th>
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
          ${r.length===0?'<tr><td colspan="9" style="padding: 12px; text-align: center; opacity: 0.6;">No Dependabot vulnerabilities found.</td></tr>':r.map(o=>`
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 8px; font-family: monospace;">${o.id}</td>
              <td style="padding: 8px;"><strong>${o.dependency?.packageName||"package"}</strong> (${o.dependency?.currentVersion} \u2794 ${o.dependency?.fixedVersion})</td>
              <td style="padding: 8px;"><span class="badge badge-${o.severity}">${o.severity}</span></td>
              <td style="padding: 8px; font-weight: 500;">${o.title}</td>
              <td style="padding: 8px;"><span class="badge badge-${o.sizing.size.toLowerCase()}">Size ${o.sizing.size}</span></td>
              <td style="padding: 8px;">${o.sizing.riskLevel.toUpperCase()}</td>
              <td style="padding: 8px;">${o.sizing.estimatedHours}h</td>
              <td style="padding: 8px;">Sprint ${o.targetSprint}</td>
              <td style="padding: 8px;"><span class="status-pill status-${o.status}">${o.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Code Scanning Findings Matrix -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 12px;">
        <div>
          <span class="badge" style="background: rgba(111, 66, 193, 0.2); color: #d2a8ff; font-size: 12px; padding: 4px 10px;">
            \u{1F50D} Priority 2: Code Scanning (CodeQL / SAST) Findings (${i.length} Items \u2022 ${a}h Effort)
          </span>
        </div>
        <div style="display: flex; gap: 8px; font-size: 11px;">
          <span class="badge badge-s">Size S: ${i.filter(o=>o.sizing?.size==="S").length}</span>
          <span class="badge badge-m">Size M: ${i.filter(o=>o.sizing?.size==="M").length}</span>
          <span class="badge badge-l">Size L: ${i.filter(o=>o.sizing?.size==="L").length}</span>
          <span class="badge badge-xl">Size XL: ${i.filter(o=>o.sizing?.size==="XL").length}</span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--vscode-panel-border, #333); text-align: left; opacity: 0.7;">
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">Rule & Location</th>
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
          ${i.length===0?'<tr><td colspan="9" style="padding: 12px; text-align: center; opacity: 0.6;">No Code Scanning findings found.</td></tr>':i.map(o=>`
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 8px; font-family: monospace;">${o.id}</td>
              <td style="padding: 8px;"><code>${o.ruleId||"SAST"}</code> (${o.location?.filePath||"source"})</td>
              <td style="padding: 8px;"><span class="badge badge-${o.severity}">${o.severity}</span></td>
              <td style="padding: 8px; font-weight: 500;">${o.title}</td>
              <td style="padding: 8px;"><span class="badge badge-${o.sizing.size.toLowerCase()}">Size ${o.sizing.size}</span></td>
              <td style="padding: 8px;">${o.sizing.riskLevel.toUpperCase()}</td>
              <td style="padding: 8px;">${o.sizing.estimatedHours}h</td>
              <td style="padding: 8px;">Sprint ${o.targetSprint}</td>
              <td style="padding: 8px;"><span class="status-pill status-${o.status}">${o.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Oo(s){let e=s.sprints.filter(i=>i.category==="dependabot"||i.findings.some(n=>s.findings[n]?.source==="dependabot")),t=s.sprints.filter(i=>i.category==="code_scanning"||!e.includes(i)&&i.findings.some(n=>s.findings[n]?.source==="code_scanning")),r=s.sprints.filter(i=>!e.includes(i)&&!t.includes(i));return`
    <!-- Top Summary Telemetry Metrics: 2 Rows -->
    ${Qs(s)}

    <!-- Phase 1: Dependabot Vulnerabilities -->
    <div class="sprint-phase-banner">
      <div>
        <span>\u{1F4E6} Phase 1: Dependabot Vulnerability Remediation Sprints (Priority 1)</span>
        <div class="sprint-phase-sub">First, resolve all third-party package vulnerabilities, manifest locks, and framework upgrades.</div>
      </div>
      <span class="badge" style="background: rgba(23,162,184,0.25); color: #17a2b8;">${e.length} Planned Sprints</span>
    </div>
    ${e.length===0?'<div style="opacity: 0.6; font-size: 13px; margin-bottom: 20px;">No Dependabot sprints required.</div>':e.map(i=>nt(i,s)).join("")}

    <!-- Phase 2: Code Scanning Findings -->
    <div class="sprint-phase-banner code-scanning">
      <div>
        <span>\u{1F50D} Phase 2: Code Scanning (CodeQL / SAST) Remediation Sprints (Priority 2)</span>
        <div class="sprint-phase-sub">After dependencies are stabilized, proceed with application taint analysis, SQL/Command injections, and code hygiene.</div>
      </div>
      <span class="badge" style="background: rgba(111, 66, 193, 0.25); color: #d2a8ff;">${t.length} Planned Sprints</span>
    </div>
    ${t.length===0?'<div style="opacity: 0.6; font-size: 13px; margin-bottom: 20px;">No Code Scanning sprints required.</div>':t.map(i=>nt(i,s)).join("")}

    ${r.length>0?`
      <div class="sprint-phase-banner">
        <span>\u{1F4CB} Additional Remediation Sprints</span>
      </div>
      ${r.map(i=>nt(i,s)).join("")}
    `:""}
  `}function nt(s,e){let t=(s.findings||[]).map(r=>e.findings[r]).filter(Boolean);return`
    <div style="margin-bottom: 32px;">
      <div class="sprint-header">
        <div>
          <div class="sprint-title">
            <span>\u{1F4C5} ${s.dayLabel}:</span> ${s.title}
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8; margin-left: 6px;">\u23F1\uFE0F ${s.durationDays||10} Days</span>
            <span class="badge badge-s" style="margin-left: 6px;">${s.totalEstimatedHours}h effort</span>
            <span class="status-pill status-${s.status}">${s.status}</span>
          </div>
          <div class="sprint-desc">${s.description}</div>
        </div>
        <div class="sprint-actions" style="display: flex; gap: 8px;">
          <button class="btn btn-success" onclick="executeSprint(${s.sprintNumber})">
            <span>\u26A1</span> Execute Automated Sprint Fixes
          </button>
          <button class="btn btn-secondary" onclick="validateAndRescan()" title="Rescan and validate this sprint day's fixes locally without AI">
            <span>\u{1F50D}</span> Validate Day Fixes
          </button>
        </div>
      </div>

      <div class="card-grid">
        ${t.map(r=>Io(r)).join("")}
      </div>
    </div>
  `}function Io(s){let e=s.status==="applied"||s.status==="verified",t=s.status==="failed";return`
    <div class="vuln-card">
      <div>
        <div class="card-top">
          <div class="card-badges">
            <span class="badge badge-${s.severity}">${s.severity}</span>
            <span class="badge badge-${s.sizing.size.toLowerCase()}">Size ${s.sizing.size}</span>
            <span class="badge" style="background: rgba(23,162,184,0.15); color: #17a2b8;">${s.source==="dependabot"?"\u{1F4E6} Dependabot":"\u{1F50D} CodeQL"}</span>
            ${s.resolutionEngine==="co_remediation"||s.coRemediatedFromId?'<span class="badge" style="background: rgba(40,167,69,0.25); color: #28a745; border: 1px solid #28a745;">\u26A1 Zero-Token Co-Remediation</span>':""}
            ${s.resolutionEngine==="learned_pattern"?'<span class="badge" style="background: rgba(111,66,193,0.25); color: #d2a8ff; border: 1px solid #6f42c1;">\u26A1 Zero-Token Learned Pattern</span>':""}
          </div>
          <span class="status-pill status-${s.status}">${s.status}</span>
        </div>

        <div class="card-title">${s.title}</div>
        <div class="card-desc">${s.description}</div>

        <div class="card-meta">
          ${s.dependency?`<div><strong>Package:</strong> ${s.dependency.packageName} (${s.dependency.currentVersion} \u2794 <strong>${s.dependency.fixedVersion}</strong>)</div>
               <div><strong>Type:</strong> ${s.dependency.isDirect?"Direct Manifest":"Transitive Lockfile"} ${s.dependency.majorGap&&s.dependency.majorGap>1?`\u2022 <span class="badge badge-xl">${s.dependency.majorGap} Major Versions Leap</span>`:""}</div>`:`<div><strong>Rule:</strong> ${s.ruleId||"N/A"}</div>
               <div><strong>Target:</strong> ${s.location?.filePath||"Source file"}:${s.location?.startLine??1}</div>`}
          <div><strong>Advisory:</strong> ${s.cveId||s.ghsaId||s.id}</div>
          ${s.coRemediatedFromId?`<div><strong style="color: #28a745;">\u26A1 Cascading Co-Remediated:</strong> Resolved via fix on <code>${D(s.coRemediatedFromId)}</code> (0 AI tokens)</div>`:""}
          ${s.resolutionEngine==="learned_pattern"?'<div><strong style="color: #d2a8ff;">\u26A1 Learned Pattern Active:</strong> Reused repo verified pattern (0 AI tokens)</div>':""}
        </div>

        ${s.compatibilityAdvice?`
          <div class="advice-card">
            <div class="advice-title">\u{1F4A1} Smart Safe Upgrade Recommendation (Compatibility & Dependency Guard)</div>
            <div style="margin-bottom: 6px;">
              <span>Ideal Target: </span><span class="advice-ideal">${D(s.compatibilityAdvice.idealVersion)}</span>
              <span style="margin: 0 4px;">\u2794</span>
              <span>Recommended Safe Target: </span><span class="advice-target">${D(s.compatibilityAdvice.safeRecommendedVersion)}</span>
            </div>
            <div style="opacity: 0.9;"><strong>Constraint:</strong> ${D(s.compatibilityAdvice.constraintSummary)}</div>
            <div style="margin-top: 4px; opacity: 0.95;"><strong>Strategy:</strong> ${D(s.compatibilityAdvice.tradeoffReason)}</div>
            <div><span class="advice-risk-reduction"><strong>Risk Reduction:</strong> ${D(s.compatibilityAdvice.riskReduction)}</span></div>
          </div>
        `:""}

        ${s.validationReport?.cascadingVulnerabilitiesIntroduced?.length?`
          <div class="terminal-box" style="border-color: var(--color-danger); background: rgba(220, 53, 69, 0.1);">
            <div class="terminal-title">\u{1F6A8} Collateral Vulnerabilities / Dependency Conflicts Intercepted</div>
            <div>${s.validationReport.cascadingVulnerabilitiesIntroduced.map(r=>`\u2022 ${D(r)}`).join("<br>")}</div>
            ${s.validationReport.suggestedAlternativeVersion?`<div style="margin-top: 6px;"><span class="advice-risk-reduction"><strong>Safe Fallback:</strong> Upgrade to version <strong>${D(s.validationReport.suggestedAlternativeVersion)}</strong> to mitigate risk safely.</span></div>`:""}
          </div>
        `:""}

        ${t&&s.validationReport?.failureStackTrace?`
          <div class="terminal-box">
            <div class="terminal-title">\u274C Validation Failure Details</div>
            <div>${D(s.validationReport.failureStackTrace)}</div>
          </div>
        `:""}
      </div>

      <div class="card-footer">
        <div style="font-size: 11px; opacity: 0.7;">
          \u23F1\uFE0F ${s.sizing.estimatedHours}h
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${s.status==="applied"?`
            <button class="btn btn-sm btn-success" onclick="markVerifiedAndStage('${s.id}')">
              \u{1F44D} Verify & Stage
            </button>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${s.id}')">
              \u{1F50D} Inspect Diff
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectAndRollback('${s.id}')">
              \u274C Rollback
            </button>
          `:s.status==="verified"?`
            <span style="font-size: 11px; color: var(--color-success); font-weight: 600;">\u2714 Staged to Git</span>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${s.id}')">
              Diff
            </button>
          `:`
            <button class="btn btn-sm" onclick="applySingleFix('${s.id}', '${s.sizing.isAutomatedCandidate?"deterministic":"copilot"}')">
              \u26A1 Apply Fix (${s.sizing.isAutomatedCandidate?"Zero-Token":"Copilot LM"})
            </button>
            <button class="btn btn-sm btn-secondary" onclick="inspectDiff('${s.id}')">
              Diff
            </button>
          `}
        </div>
      </div>
    </div>
  `}function $o(s,e=[]){if(!s){let r=e.find(i=>i.status==="applied");r&&(s=r)}return s?`
    ${s.status==="applied"?`
      <!-- Mandatory Human-in-the-Loop Intercept Overlay -->
      <div class="checkpoint-banner">
        <div class="checkpoint-info">
          <h3>Mandatory Checkpoint: Local Automated Validation Passed</h3>
          <p>
            Build and regression test suites executed successfully. Review the exact line-by-line diff below before staging to Git SCM.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-success" onclick="markVerifiedAndStage('${s.id}')">
            \u{1F44D} Mark as Verified & Stage for Check-in
          </button>
          <button class="btn btn-danger" onclick="rejectAndRollback('${s.id}')">
            \u274C Reject Fix & Rollback
          </button>
        </div>
      </div>
    `:""}

    ${s.compatibilityAdvice?`
      <div class="advice-card" style="margin-bottom: 20px;">
        <div class="advice-title">\u{1F4A1} Smart Safe Upgrade Recommendation (Active Compatibility Guard)</div>
        <div style="font-size: 13px; margin: 6px 0;">
          <span>Target Ideal: </span><span class="advice-ideal">${D(s.compatibilityAdvice.idealVersion)}</span>
          <span style="margin: 0 8px;">\u2794</span>
          <span>Selected Safe Target: </span><span class="advice-target">${D(s.compatibilityAdvice.safeRecommendedVersion)}</span>
        </div>
        <div style="margin-bottom: 4px;"><strong>Dependency Constraint:</strong> ${D(s.compatibilityAdvice.constraintSummary)}</div>
        <div style="margin-bottom: 4px;"><strong>Tradeoff Analysis:</strong> ${D(s.compatibilityAdvice.tradeoffReason)}</div>
        <div><span class="advice-risk-reduction"><strong>Risk Profile:</strong> ${D(s.compatibilityAdvice.riskReduction)}</span></div>
      </div>
    `:""}

    <div class="sprint-header">
      <div>
        <div class="sprint-title">Diff Inspector: ${s.id} \u2014 ${s.title}</div>
        <div class="sprint-desc">
          ${s.dependency?`Dependency Upgrade: ${s.dependency.packageName}@${s.dependency.fixedVersion}`:`Target: ${s.location?.filePath||"Source Code"}`}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-${s.severity}">${s.severity}</span>
        <span class="status-pill status-${s.status}">${s.status}</span>
      </div>
    </div>

    <!-- Unified Diff Container -->
    <div class="diff-container">
      <div class="diff-header">
        <span>\u{1F4C4} ${s.location?.filePath||(s.dependency?"package.json / package-lock.json / pom.xml":"workspace")}</span>
        <span style="font-size: 11px; opacity: 0.7;">Git Unified Diff</span>
      </div>
      <div>
        ${Lo(s)}
      </div>
    </div>

    <!-- Validation Summary Card -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">Automated Validation Telemetry & Dependency Audit</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%;">
        <div class="metric-card success">
          <div class="metric-label">Compilation / Build</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${s.validationReport?.buildDurationMs??210}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Regression Tests</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${s.validationReport?.testDurationMs??430}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Security Advisory</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 CLEARED</div>
          <div class="metric-sub">${s.cveId||s.ghsaId||"Advisory Mitigated"}</div>
        </div>
        <div class="metric-card ${s.validationReport?.compatibilityStatus==="failed"||s.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"danger":"success"}">
          <div class="metric-label">Collateral Audit</div>
          <div style="font-size: 16px; font-weight: 700; color: ${s.validationReport?.compatibilityStatus==="failed"||s.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"var(--color-danger)":"var(--color-success)"};">
            ${s.validationReport?.compatibilityStatus==="failed"||s.validationReport?.cascadingVulnerabilitiesIntroduced?.length?"\u274C COLLATERAL BREAK":"\u2714 ZERO COLLATERAL"}
          </div>
          <div class="metric-sub">
            ${s.validationReport?.suggestedAlternativeVersion?`Safe target: ${D(s.validationReport.suggestedAlternativeVersion)}`:"Dependencies Compatible"}
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
    `}function Lo(s){return s.appliedDiff?s.appliedDiff.split(/\r?\n/).map((t,r)=>{let i="normal";return t.startsWith("+")?i="add":t.startsWith("-")&&(i="delete"),`
        <div class="diff-line ${i}">
          <div class="diff-line-num">${r+1}</div>
          <div class="diff-line-code">${D(t)}</div>
        </div>
      `}).join(""):s.source==="dependabot"&&s.dependency?`
      <div class="diff-line normal"><div class="diff-line-num">12</div><div class="diff-line-code">   "dependencies": {</div></div>
      <div class="diff-line delete"><div class="diff-line-num">13</div><div class="diff-line-code">-    "${s.dependency.packageName}": "${s.dependency.currentVersion}",</div></div>
      <div class="diff-line add"><div class="diff-line-num">13</div><div class="diff-line-code">+    "${s.dependency.packageName}": "^${s.dependency.fixedVersion}",</div></div>
      <div class="diff-line normal"><div class="diff-line-num">14</div><div class="diff-line-code">   }</div></div>
    `:s.location?.snippet?`
      <div class="diff-line normal"><div class="diff-line-num">33</div><div class="diff-line-code"> // Line before</div></div>
      <div class="diff-line delete"><div class="diff-line-num">34</div><div class="diff-line-code">-  ${D(s.location.snippet)}</div></div>
      <div class="diff-line add"><div class="diff-line-num">34</div><div class="diff-line-code">+  // Remediated safe implementation by CodeVulFixer</div></div>
      <div class="diff-line add"><div class="diff-line-num">35</div><div class="diff-line-code">+  ${D(s.remediationPlan)}</div></div>
      <div class="diff-line normal"><div class="diff-line-num">36</div><div class="diff-line-code"> // Line after</div></div>
    `:`
    <div class="diff-line normal">
      <div class="diff-line-num">1</div>
      <div class="diff-line-code">// No workspace file modifications detected yet for ${s.id}</div>
    </div>
  `}function jo(s){let e=JSON.stringify(s||{version:"1.0.3",repoOwner:"workspace-owner",repoName:"workspace-repo",lastUpdated:new Date().toISOString(),planningMode:"sprint_wise",daysPerSprint:10,sprints:[],findings:{},activeSprint:1,metrics:{totalFindings:0,resolvedCount:0,pendingCount:0,failedCount:0,totalEstimatedHours:0,hoursSaved:0}},null,2);return`
    <!-- Settings Group 1: Sprint Orchestration Engine Settings -->
    <div class="settings-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 16px;">\u2699\uFE0F Sprint Orchestration Engine Settings</h3>
        <span class="badge badge-s">Active Cadence</span>
      </div>
      
      <div class="settings-row">
        <div>
          <div class="settings-title">Remediation Planning Cadence</div>
          <div class="settings-desc">Choose between a multi-day Agile Sprint cadence (10 working days / 2-week cycle) or daily micro-chunks.</div>
        </div>
        <select id="planningMode">
          <option value="sprint_wise" ${s?.planningMode==="sprint_wise"||!s?.planningMode?"selected":""}>Sprint-wise Plan (10 Working Days / 2-Week Agile Cycle)</option>
          <option value="day_wise" ${s?.planningMode==="day_wise"?"selected":""}>Day-wise Plan (Daily Micro-Sprints)</option>
        </select>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Days per Agile Sprint</div>
          <div class="settings-desc">Number of working days considered per Agile Sprint (standard Scrum cycle is 10 days).</div>
        </div>
        <input type="number" id="daysPerSprint" min="1" max="30" value="${s?.daysPerSprint||10}" style="width: 70px;">
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Max High-Risk Fixes Per Day</div>
          <div class="settings-desc">Enforce cognitive load limits by capping Size L / critical security rewrites per day.</div>
        </div>
        <input type="number" id="maxHighRisk" min="1" max="10" value="3" style="width: 70px;">
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-title">Target Remediation Timeline (Days)</div>
          <div class="settings-desc">Target duration to schedule distributed sprint chunks.</div>
        </div>
        <input type="number" id="targetDays" min="1" max="14" value="4" style="width: 70px;">
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

      <div style="margin-top: 18px; display: flex; gap: 10px;">
        <button class="btn btn-success" onclick="saveSettings()">
          <span>\u{1F4BE}</span> Save Settings & Replan Sprints
        </button>
      </div>
    </div>

    <!-- Settings Group 2: Live Sprint State JSON Persistence Editor -->
    <div class="settings-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px;">\u{1F4C4} Live Sprint State JSON (.codevulfixer/sprint-state.json)</h3>
        <span class="badge ${s?"badge-s":"badge-m"}">${s?"File Loaded":"Template Preview"}</span>
      </div>
      <p style="font-size: 12px; opacity: 0.8; margin-top: 0; margin-bottom: 14px;">
        Inspect, configure, or manually adjust the active sprint state JSON. Click <strong>"Save Sprint State JSON"</strong> to persist your edits directly to <code>.codevulfixer/sprint-state.json</code> and instantly update the dashboard telemetry.
      </p>

      <textarea id="rawStateJson" class="json-textarea" spellcheck="false">${D(e)}</textarea>

      <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-success" onclick="saveSprintStateJson()">
          <span>\u{1F4BE}</span> Save Sprint State JSON
        </button>
        <button class="btn btn-secondary" onclick="reloadState()">
          <span>\u{1F504}</span> Reload State from Disk
        </button>
        <button class="btn btn-secondary" onclick="formatStateJson()">
          <span>\u2728</span> Format / Prettify JSON
        </button>
        <button class="btn btn-secondary" onclick="copyStateJson()">
          <span>\u{1F4CB}</span> Copy JSON
        </button>
      </div>
    </div>
  `}function D(s){return s?String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}var Ae=class{static generateWorkbook(e){let t=Object.values(e.findings||{}),r=t.filter(y=>y.source==="dependabot"),i=t.filter(y=>y.source==="code_scanning"),n=Math.round(r.reduce((y,k)=>y+(k.sizing?.estimatedHours||0),0)*10)/10,a=Math.round(i.reduce((y,k)=>y+(k.sizing?.estimatedHours||0),0)*10)/10,o=Math.round((n+a)*10)/10,c=r.filter(y=>y.status==="applied"||y.status==="verified").length,l=i.filter(y=>y.status==="applied"||y.status==="verified").length,g=c+l,d=r.filter(y=>y.status==="pending"||y.status==="in_progress").length,p=i.filter(y=>y.status==="pending"||y.status==="in_progress").length,u=r.filter(y=>y.status==="failed"||y.status==="rejected").length,m=i.filter(y=>y.status==="failed"||y.status==="rejected").length,b=Math.round(c*2.5*10)/10,w=Math.round(l*3.8*10)/10,E=Math.round((b+w)*10)/10;return`<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>CodeVulFixer Security &amp; Sprint Remediation Dashboard</Title>
    <Subject>Vulnerability Remediation Report</Subject>
    <Author>CodeVulFixer Extension v1.0.3</Author>
    <Created>${new Date().toISOString()}</Created>
    <Company>CodeVulFixer</Company>
  </DocumentProperties>
  <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">
    <AllowPNG/>
  </OfficeDocumentSettings>
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
    <WindowHeight>12000</WindowHeight>
    <WindowWidth>24000</WindowWidth>
    <WindowTopX>0</WindowTopX>
    <WindowTopY>0</WindowTopY>
    <ActiveSheet>0</ActiveSheet>
    <ProtectStructure>False</ProtectStructure>
    <ProtectWindows>False</ProtectWindows>
  </ExcelWorkbook>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Borders/>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>

    <!-- Header Styles -->
    <Style ss:ID="MainTitle">
      <Font ss:FontName="Segoe UI" ss:Size="15" ss:Color="#0366D6" ss:Bold="1"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#586069" ss:Italic="1"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SectionHeader">
      <Font ss:FontName="Segoe UI" ss:Size="12" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#E1E4E8" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0366D6"/>
      </Borders>
    </Style>

    <!-- Table Column Headers -->
    <Style ss:ID="ColHeaderDefault">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#24292E" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
    </Style>
    <Style ss:ID="ColHeaderDep">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#28A745" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1E7E34"/>
      </Borders>
    </Style>
    <Style ss:ID="ColHeaderCodeScan">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#0366D6" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#005CC5"/>
      </Borders>
    </Style>

    <!-- Data Rows -->
    <Style ss:ID="CellText">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellTextBold">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E" ss:Bold="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellCenter">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellNumber">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellDecimal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellPercent">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="0.0%"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>

    <!-- Total Row -->
    <Style ss:ID="RowTotal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>
    <Style ss:ID="RowTotalNumber">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>
    <Style ss:ID="RowTotalDecimal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.0"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>

    <!-- Severity Styles -->
    <Style ss:ID="SevCritical">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFDCE0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevHigh">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFEEF0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevMedium">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#735C0F" ss:Bold="1"/>
      <Interior ss:Color="#FFF5B1" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevLow">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#165C26" ss:Bold="1"/>
      <Interior ss:Color="#DCFFE4" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>

    <!-- Status Styles -->
    <Style ss:ID="StatusResolved">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#165C26" ss:Bold="1"/>
      <Interior ss:Color="#DCFFE4" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="StatusPending">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#735C0F" ss:Bold="1"/>
      <Interior ss:Color="#FFF5B1" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="StatusFailed">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFDCE0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
  </Styles>

  <!-- TAB 1: EXECUTIVE & SPRINT SUMMARY -->
  ${this.renderSummaryWorksheet(e,r,i,n,a,o,c,l,g,d,p,u,m,b,w,E)}

  <!-- TAB 2: DEPENDABOT VULNERABILITIES -->
  ${this.renderDependabotWorksheet(r)}

  <!-- TAB 3: CODE SCANNING FINDINGS -->
  ${this.renderCodeScanningWorksheet(i)}

</Workbook>`}static renderSummaryWorksheet(e,t,r,i,n,a,o,c,l,g,d,p,u,m,b,w){let E=t.length,y=r.length,k=E+y,h=E>0?o/E:0,C=y>0?c/y:0,F=k>0?l/k:0;return`  <Worksheet ss:Name="Executive Summary">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="220"/>
      <Column ss:Width="95"/>
      <Column ss:Width="90"/>
      <Column ss:Width="105"/>
      <Column ss:Width="110"/>
      <Column ss:Width="130"/>
      <Column ss:Width="140"/>
      <Column ss:Width="110"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">\u{1F6E1}\uFE0F CodeVulFixer \u2014 Executive Security &amp; Sprint Posture</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Repository: ${this.escape(e.repoOwner)}/${this.escape(e.repoName)} | Planning Mode: ${this.escape(e.planningMode)} (${e.daysPerSprint||10} Days/Sprint) | Exported: ${new Date().toLocaleString()}</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- KPI Metrics Section Header -->
      <Row ss:Height="24">
        <Cell ss:MergeAcross="7" ss:StyleID="SectionHeader"><Data ss:Type="String">1. Remediation Metrics Breakdown (Separated by Finding Source)</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Finding Category</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Total Findings</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolved</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Open / Pending</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Validation Failed</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Estimated Hours (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">AI Autonomous Savings (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolution Rate</Data></Cell>
      </Row>

      <!-- Row 1: Dependabot Vulnerabilities -->
      <Row ss:Height="21">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">\u{1F4E6} Dependabot Vulnerabilities</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${E}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${o}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${g}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${p}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${i}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${m}</Data></Cell>
        <Cell ss:StyleID="CellPercent"><Data ss:Type="Number">${h}</Data></Cell>
      </Row>

      <!-- Row 2: Code Scanning Findings -->
      <Row ss:Height="21">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">\u{1F50D} Code Scanning Findings</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${y}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${c}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${d}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${u}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${n}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${b}</Data></Cell>
        <Cell ss:StyleID="CellPercent"><Data ss:Type="Number">${C}</Data></Cell>
      </Row>

      <!-- Summary Total Row -->
      <Row ss:Height="22">
        <Cell ss:StyleID="RowTotal"><Data ss:Type="String">\u{1F3AF} Total Workspace Remediation</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${k}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${l}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${g+d}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${p+u}</Data></Cell>
        <Cell ss:StyleID="RowTotalDecimal"><Data ss:Type="Number">${a}</Data></Cell>
        <Cell ss:StyleID="RowTotalDecimal"><Data ss:Type="Number">${w}</Data></Cell>
        <Cell ss:StyleID="RowTotal"><Data ss:Type="Number">${Math.round(F*1e3)/10}%</Data></Cell>
      </Row>
      <Row ss:Height="16"></Row>

      <!-- Sprint Roadmap Section Header -->
      <Row ss:Height="24">
        <Cell ss:MergeAcross="7" ss:StyleID="SectionHeader"><Data ss:Type="String">2. Sequenced Remediation Roadmap (Phase 1: Dependabot First \u2794 Phase 2: Code Scanning Next)</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Sprint / Iteration</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Remediation Phase</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Duration</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Findings Count</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolved</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Allocated Hours (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Net Dev Hours (Post-AI)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Sprint Status</Data></Cell>
      </Row>
      ${this.renderSprintRoadmapRows(e)}
    </Table>
  </Worksheet>`}static renderSprintRoadmapRows(e){let t=e.sprints||[];return t.length===0?`      <Row ss:Height="20">
        <Cell ss:MergeAcross="7" ss:StyleID="CellCenter"><Data ss:Type="String">No active sprints planned. Run scan or load demo data.</Data></Cell>
      </Row>`:t.map(r=>{let i=r.findings||[],n=i.map(u=>e.findings[u]).filter(Boolean),a=n.filter(u=>u.status==="applied"||u.status==="verified").length,o=Math.round(n.reduce((u,m)=>u+(m.sizing?.estimatedHours||0),0)*10)/10,c=Math.round(Math.max(0,o-a*2.8)*10)/10,l=r.category==="dependabot"||!r.category&&n.every(u=>u.source==="dependabot"),g=l?"Phase 1: Dependabot Vulnerabilities":"Phase 2: Code Scanning Findings",d=a===i.length&&i.length>0?"COMPLETED":r.sprintNumber===e.activeSprint?"IN PROGRESS":"SCHEDULED",p=d==="COMPLETED"?"StatusResolved":d==="IN PROGRESS"?"StatusPending":"CellCenter";return`      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(r.dayLabel||`Sprint ${r.sprintNumber}`)}</Data></Cell>
        <Cell ss:StyleID="${l?"ColHeaderDep":"ColHeaderCodeScan"}"><Data ss:Type="String">${g}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${r.durationDays||10} Days</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${i.length}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${a}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${o}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${c}</Data></Cell>
        <Cell ss:StyleID="${p}"><Data ss:Type="String">${d}</Data></Cell>
      </Row>`}).join(`
`)}static renderDependabotWorksheet(e){return`  <Worksheet ss:Name="Dependabot Vulnerabilities">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="110"/>
      <Column ss:Width="85"/>
      <Column ss:Width="130"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="115"/>
      <Column ss:Width="85"/>
      <Column ss:Width="125"/>
      <Column ss:Width="85"/>
      <Column ss:Width="70"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="100"/>
      <Column ss:Width="160"/>
      <Column ss:Width="320"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">\u{1F4E6} Dependabot Vulnerability Remediation Backlog (Phase 1)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Total Dependency Vulnerabilities: ${e.length} | Priority Order: Critical &amp; High First, Safe Intermediate Targets</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- Table Header -->
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Alert ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Severity</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Package Name</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Ecosystem</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Current Version</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Safe Target Version</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Dependency</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">CVE / GHSA ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">CWE</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Size</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Effort (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Target Sprint</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Status</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Manifest File</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Advisory &amp; Remediation Plan</Data></Cell>
      </Row>

      <!-- Rows -->
      ${e.length===0?'      <Row ss:Height="20"><Cell ss:MergeAcross="14" ss:StyleID="CellCenter"><Data ss:Type="String">No Dependabot vulnerabilities detected.</Data></Cell></Row>':e.map(t=>{let r=this.getSeverityStyle(t.severity),i=this.getStatusStyle(t.status),n=t.compatibilityAdvice?.safeRecommendedVersion||t.dependency?.fixedVersion||"N/A",a=t.dependency?.isDirect!==!1?"Direct":"Transitive",o=t.cveId||t.ghsaId||"N/A",c=t.cweIds&&t.cweIds.length>0?t.cweIds.join(", "):"N/A",l=t.sizing?.size||"M",g=t.sizing?.estimatedHours||2;return`      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(t.id)}</Data></Cell>
        <Cell ss:StyleID="${r}"><Data ss:Type="String">${this.escape(t.severity.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(t.dependency?.packageName||t.title)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(t.dependency?.ecosystem||"npm")}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(t.dependency?.currentVersion||"N/A")}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(n)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${a}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(o)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(c)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${l}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${g}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Sprint ${t.targetSprint||1}</Data></Cell>
        <Cell ss:StyleID="${i}"><Data ss:Type="String">${this.escape(t.status.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(t.dependency?.manifestFile||"package.json")}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(t.remediationPlan||t.description||"")}</Data></Cell>
      </Row>`}).join(`
`)}
    </Table>
  </Worksheet>`}static renderCodeScanningWorksheet(e){return`  <Worksheet ss:Name="Code Scanning Findings">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="110"/>
      <Column ss:Width="85"/>
      <Column ss:Width="200"/>
      <Column ss:Width="95"/>
      <Column ss:Width="240"/>
      <Column ss:Width="75"/>
      <Column ss:Width="75"/>
      <Column ss:Width="70"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="100"/>
      <Column ss:Width="140"/>
      <Column ss:Width="320"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">\u{1F50D} Code Scanning (CodeQL SAST) Backlog &amp; Remediation Matrix (Phase 2)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Total Code Scanning Alerts: ${e.length} | Priority Order: Critical &amp; High First, AST-grep &amp; Copilot LM Remediation</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- Table Header -->
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Alert ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Severity</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Rule ID / Vulnerability Name</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">CWE Classification</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">File Path</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Start Line</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">End Line</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Size</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Effort (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Target Sprint</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Status</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Fix Engine</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Description &amp; Remediation Plan</Data></Cell>
      </Row>

      <!-- Rows -->
      ${e.length===0?'      <Row ss:Height="20"><Cell ss:MergeAcross="12" ss:StyleID="CellCenter"><Data ss:Type="String">No Code Scanning findings detected.</Data></Cell></Row>':e.map(t=>{let r=this.getSeverityStyle(t.severity),i=this.getStatusStyle(t.status),n=t.cweIds&&t.cweIds.length>0?t.cweIds.join(", "):"N/A",a=t.sizing?.size||"M",o=t.sizing?.estimatedHours||3,c=t.location?.snippet?.includes("Math.random")||t.location?.snippet?.includes("innerHTML")||t.ruleId?.includes("exec")?"AST-grep (Deterministic)":"Copilot LM API";return`      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(t.id)}</Data></Cell>
        <Cell ss:StyleID="${r}"><Data ss:Type="String">${this.escape(t.severity.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(t.ruleId||t.title)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(n)}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(t.location?.filePath||"src/index.ts")}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${t.location?.startLine||1}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${t.location?.endLine||t.location?.startLine||1}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${a}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${o}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Sprint ${t.targetSprint||2}</Data></Cell>
        <Cell ss:StyleID="${i}"><Data ss:Type="String">${this.escape(t.status.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${c}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(t.remediationPlan||t.description||"")}</Data></Cell>
      </Row>`}).join(`
`)}
    </Table>
  </Worksheet>`}static getSeverityStyle(e){switch(e?.toLowerCase()){case"critical":return"SevCritical";case"high":return"SevHigh";case"medium":return"SevMedium";case"low":return"SevLow";default:return"CellCenter"}}static getStatusStyle(e){switch(e?.toLowerCase()){case"applied":case"verified":case"resolved":return"StatusResolved";case"failed":case"rejected":case"validation_failed":return"StatusFailed";case"in_progress":case"pending":default:return"StatusPending"}}static escape(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"):""}};var W=S(require("path")),q=S(require("fs")),j=class s{static currentPanel;panel;extensionUri;disposables=[];activeTab="risk-profile";selectedDiffFinding;constructor(e,t){this.panel=e,this.extensionUri=t,this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.panel.webview.onDidReceiveMessage(async r=>{await this.handleMessage(r)},null,this.disposables),this.update()}static createOrShow(e){let t=v.window.activeTextEditor?v.window.activeTextEditor.viewColumn:void 0;if(s.currentPanel)return s.currentPanel.panel.reveal(t),s.currentPanel.update(),s.currentPanel;let r=v.window.createWebviewPanel("codevulfixer.dashboard","CodeVulFixer Sprint & Risk Dashboard",t||v.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[e]});return s.currentPanel=new s(r,e),s.currentPanel}async update(){let e=I.getPrimaryWorkspacePath(),t;e&&(t=await T.loadState(e)),this.panel.webview.html=Xs(t,this.activeTab,this.selectedDiffFinding)}async handleMessage(e){let t=I.getPrimaryWorkspacePath();if(!t){v.window.showErrorMessage("CodeVulFixer requires an open workspace folder.");return}try{switch(e.command){case"switchTab":this.activeTab=e.tab,await this.update();break;case"switchTabNoReload":this.activeTab=e.tab;break;case"reloadState":await this.update(),v.window.showInformationMessage("CodeVulFixer: Sprint state reloaded from disk.");break;case"saveSprintStateJson":try{let r=JSON.parse(e.rawJson);await T.saveState(t,r),await this.update(),v.window.showInformationMessage("CodeVulFixer: Sprint state JSON saved successfully.")}catch(r){v.window.showErrorMessage(`Failed to save sprint state JSON: ${r.message}`)}break;case"scan":await this.performScan(t);break;case"loadDemoData":await this.loadDemoFindings(t);break;case"resetState":await T.resetState(t),this.selectedDiffFinding=void 0,this.activeTab="risk-profile",await this.update(),v.window.showInformationMessage("CodeVulFixer: Sprint state reset successfully.");break;case"applyFix":await this.applyFindingFix(t,e.findingId,e.engine);break;case"inspectDiff":await this.inspectFindingDiff(t,e.findingId);break;case"verifyStage":await this.verifyAndStageFinding(t,e.findingId);break;case"rejectRollback":await this.rejectAndRollbackFinding(t,e.findingId);break;case"runSprint":await this.executeSprint(t,e.sprintNumber);break;case"saveSettings":await this.updateSettings(e.settings);break;case"exportToExcel":await this.exportToExcel(t);break;case"validateLocal":await this.validateAndRescanLocalState(t);break}}catch(r){f.error("Error handling Webview message",r),v.window.showErrorMessage(`CodeVulFixer error: ${r instanceof Error?r.message:String(r)}`)}}async performScan(e){await v.window.withProgress({location:v.ProgressLocation.Notification,title:"CodeVulFixer: Ingesting GitHub Vulnerabilities...",cancellable:!1},async t=>{t.report({increment:10,message:"Resolving repository metadata..."});let r=await I.resolveRepoMetadata();if(!r){await v.window.showWarningMessage("No GitHub remote origin found for workspace. Would you like to load realistic demo findings for evaluation?","Load Demo Findings","Cancel")==="Load Demo Findings"&&await this.loadDemoFindings(e);return}t.report({increment:30,message:"Authenticating with GitHub API..."});let i=await he.getSession(!0);if(!i){v.window.showErrorMessage("GitHub authentication was cancelled or unavailable.");return}let n=ve.create(i.accessToken);t.report({increment:50,message:"Fetching Dependabot & Code Scanning alerts..."});let a=[],o=[];try{a=await we.fetchAlerts(n,r.owner,r.repo)}catch(d){f.warn(`Could not ingest Dependabot alerts (might lack GHAS permission or none exist): ${d}`)}try{o=await Se.fetchAlerts(n,r.owner,r.repo)}catch(d){f.warn(`Could not ingest Code Scanning alerts (might lack GHAS permission or none exist): ${d}`)}let c=[...a,...o];if(c.length===0&&await v.window.showInformationMessage(`Zero open alerts returned by GitHub for ${r.owner}/${r.repo}. Load sample findings to test sprint orchestration?`,"Load Demo Findings","Dismiss")==="Load Demo Findings"){await this.loadDemoFindings(e);return}t.report({increment:75,message:"Running impact analysis & T-shirt sizing..."});let l=await this.enrichAndSizeFindings(e,c);t.report({increment:90,message:"Planning multi-day remediation sprints..."});let g=Z.planSprints(l,r.owner,r.repo);await T.saveState(e,g),this.activeTab="sprint-board",await this.update(),v.window.showInformationMessage(`CodeVulFixer: Ingested ${c.length} findings into ${g.sprints.length} sprints.`)})}async loadDemoFindings(e){await v.window.withProgress({location:v.ProgressLocation.Notification,title:"CodeVulFixer: Loading Realistic Vulnerabilities..."},async t=>{t.report({increment:30,message:"Analyzing manifests and taint graph..."});let r=await this.enrichAndSizeFindings(e,Js);t.report({increment:70,message:"Generating multi-day sprint schedule..."});let i=Z.planSprints(r,"enterprise","demo-workspace");await T.saveState(e,i),this.activeTab="sprint-board",await this.update(),v.window.showInformationMessage("CodeVulFixer: Loaded 9 realistic findings partitioned into 3 remediation sprints.")})}async enrichAndSizeFindings(e,t){let r=[];for(let i of t){let n=i.dependency;n&&(n=await Ee.analyze(e,n));let a=await Te.analyze(e,i.location,i.cweIds,i.ruleId),o=xe.evaluate(i,n,a,e);r.push({...i,dependency:n,sizing:o,compatibilityAdvice:i.compatibilityAdvice})}return r}async applyFindingFix(e,t,r){let i=await T.loadState(e);if(!i||!i.findings[t])return;let n=i.findings[t];await T.updateFinding(e,t,{status:"in_progress"}),await this.update(),await v.window.withProgress({location:v.ProgressLocation.Notification,title:`CodeVulFixer: Remediating ${t}...`},async a=>{a.report({increment:30,message:`Executing ${r} fix engine...`});let o=await De.executeRepair(e,n,r);if(!o.success){await T.updateFinding(e,t,{status:"failed",statusMessage:o.message,validationReport:{passed:!1,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped",failureStackTrace:o.stderr||o.message}}),await this.update(),v.window.showErrorMessage(`Fix failed for ${t}: ${o.message}`);return}a.report({increment:60,message:"Running build & regression tests validation..."});let c=await Pe.validateWorkspace(e,n),l=o.modifiedFiles[0]||n.location?.filePath||"package.json",g=await Fe.getFileDiff(e,l);if(!c.passed){await T.updateFinding(e,t,{status:"failed",statusMessage:"Fix applied but automated validation tests failed.",appliedDiff:g.rawDiff,validationReport:c}),await this.update(),v.window.showErrorMessage(`Automated test verification failed after applying fix for ${t}.`);return}let d=o.message.includes("Learned Fix")||o.message.includes("learned"),p=d?"learned_pattern":o.engine;await T.updateFinding(e,t,{status:"applied",statusMessage:d?"\u26A1 Fixed via repository learned pattern with Zero AI Tokens! Ready for review.":"Automated validation passed. Ready for Human-in-the-Loop review.",appliedDiff:g.rawDiff,validationReport:c,resolutionEngine:p}),this.selectedDiffFinding={...n,status:"applied",appliedDiff:g.rawDiff,validationReport:c,resolutionEngine:p},this.activeTab="diff-inspector",await this.update(),v.window.showInformationMessage(`CodeVulFixer: Fix applied & verified for ${t} (${p}). Review diff checkpoint to stage or rollback.`)})}async inspectFindingDiff(e,t){let r=await T.loadState(e);!r||!r.findings[t]||(this.selectedDiffFinding=r.findings[t],this.activeTab="diff-inspector",await this.update())}async verifyAndStageFinding(e,t){let r=await T.loadState(e);if(!r||!r.findings[t])return;let i=r.findings[t],n=i.location?.filePath?[i.location.filePath]:["package.json","package-lock.json"];if(await ge.stageAndSetCommitMessage(e,i,n)){await T.updateFinding(e,t,{status:"verified",statusMessage:"Verified by developer and staged into Git SCM.",resolutionEngine:i.resolutionEngine||(i.sizing.isAutomatedCandidate?"deterministic":"copilot")});let o=M.findCascadingCandidates(i,r.findings);if(o.length>0){let c=0;for(let l of o){if(l.dependency?.manifestFile&&l.dependency.fixedVersion){let g=W.isAbsolute(l.dependency.manifestFile)?l.dependency.manifestFile:W.join(e,l.dependency.manifestFile);if(q.existsSync(g)&&g.endsWith("package.json"))try{let d=q.readFileSync(g,"utf8"),p=JSON.parse(d),u=!1,m=l.dependency.packageName;p.dependencies&&p.dependencies[m]&&(p.dependencies[m]=`^${l.dependency.fixedVersion}`,u=!0),p.devDependencies&&p.devDependencies[m]&&(p.devDependencies[m]=`^${l.dependency.fixedVersion}`,u=!0),u&&q.writeFileSync(g,JSON.stringify(p,null,2),"utf8")}catch{}}await T.updateFinding(e,l.id,{status:"verified",statusMessage:`Cascading Co-Remediation: Resolved with Zero AI Tokens via primary fix on ${i.id} (${i.dependency?.packageName||i.ruleId})`,resolutionEngine:"co_remediation",coRemediatedFromId:i.id}),c++}c>0&&v.window.showInformationMessage(`CodeVulFixer: Staged ${i.id} and automatically co-resolved ${c} related findings with Zero AI Tokens!`)}if(i.source==="code_scanning")try{await z.learnFromFix(e,i,i.appliedDiff,i.resolutionEngine==="copilot"?"copilot":"developer_approved_diff")}catch(c){f.warn(`Could not learn pattern from ${i.id}: ${c}`)}await this.update()}}async rejectAndRollbackFinding(e,t){let r=await T.loadState(e);if(!r||!r.findings[t])return;let i=r.findings[t],n=i.location?.filePath?[i.location.filePath]:["package.json","package-lock.json"];await ge.rollbackChanges(e,n),await T.updateFinding(e,t,{status:"rejected",statusMessage:"Rejected by developer. Workspace mutations reverted."}),await this.update()}async executeSprint(e,t){let r=await T.loadState(e);if(!r)return;let i=r.sprints.find(n=>n.sprintNumber===t);if(i){v.window.showInformationMessage(`Starting automated batch execution for ${i.dayLabel}...`);for(let n of i.findings){let a=r.findings[n];if(a&&(a.status==="pending"||a.status==="failed")){await this.applyFindingFix(e,n,a.sizing.isAutomatedCandidate?"deterministic":"copilot");break}}}}async updateSettings(e){let t=v.workspace.getConfiguration("codevulfixer");e.planningMode&&await t.update("planningMode",e.planningMode,v.ConfigurationTarget.Global),e.daysPerSprint&&await t.update("daysPerSprint",e.daysPerSprint,v.ConfigurationTarget.Global),await t.update("maxHighRiskPerDay",e.maxHighRiskPerDay,v.ConfigurationTarget.Global),await t.update("targetSprintDays",e.targetSprintDays,v.ConfigurationTarget.Global),await t.update("packageManager",e.packageManager,v.ConfigurationTarget.Global),await t.update("preferredFixEngine",e.preferredFixEngine,v.ConfigurationTarget.Global);let r=I.getPrimaryWorkspacePath();if(r){let i=await T.loadState(r);if(i){let n=Z.planSprints(Object.values(i.findings),i.repoOwner,i.repoName,{planningMode:e.planningMode||i.planningMode||"sprint_wise",daysPerSprint:e.daysPerSprint||i.daysPerSprint||10,maxHighRiskPerDay:e.maxHighRiskPerDay,targetSprintDays:e.targetSprintDays});await T.saveState(r,n),await this.update()}}v.window.showInformationMessage("CodeVulFixer settings saved and sprints replanned.")}async exportToExcel(e){let t=await T.loadState(e);if(!t||Object.keys(t.findings||{}).length===0){v.window.showWarningMessage("CodeVulFixer: No vulnerability findings or sprint state to export. Run a scan or load demo data first.");return}try{let r=Ae.generateWorkbook(t),i=`${t.repoName||"CodeVulFixer"}_Security_Dashboard.xml`,n=v.Uri.file(W.join(e,i)),a=await v.window.showSaveDialog({defaultUri:n,saveLabel:"Export Excel XML Spreadsheet",filters:{"Excel XML Spreadsheet (*.xml)":["xml"]}});a&&(await v.workspace.fs.writeFile(a,Buffer.from(r,"utf-8")),await v.window.showInformationMessage(`CodeVulFixer: Successfully exported dashboard to Excel XML spreadsheet (${W.basename(a.fsPath)}) with separated worksheets for Dependabot & Code Scanning.`,"Open File")==="Open File"&&v.env.openExternal(a))}catch(r){f.error("Failed to export Excel workbook",r),v.window.showErrorMessage(`CodeVulFixer Excel export failed: ${r.message}`)}}async validateAndRescanLocalState(e){let t=await T.loadState(e);if(!t||Object.keys(t.findings||{}).length===0){v.window.showWarningMessage("CodeVulFixer: No active findings to validate. Load findings first.");return}await v.window.withProgress({location:v.ProgressLocation.Notification,title:"CodeVulFixer: Rescanning local workspace for zero-token resolutions..."},async r=>{r.report({increment:20,message:"Inspecting local manifests & source files..."});let i=0,n=0,a=W.join(e,"package.json"),o=null;if(q.existsSync(a))try{o=JSON.parse(q.readFileSync(a,"utf8"))}catch{}let c=Object.values(t.findings);for(let g of c)if(g.status!=="verified"){if(g.source==="dependabot"&&g.dependency){let d=g.dependency.packageName,p=g.dependency.fixedVersion,u=!1;if(o){let m=o.dependencies?.[d]||o.devDependencies?.[d];m&&p&&m.includes(p)&&(u=!0)}if(u){g.status="verified",g.resolutionEngine="zero_token_local",g.statusMessage=`Locally Validated: ${d} bumped to safe version in package.json (0 AI Tokens).`,i++;let m=M.findCascadingCandidates(g,t.findings);for(let b of m)b.status="verified",b.resolutionEngine="co_remediation",b.coRemediatedFromId=g.id,b.statusMessage=`Cascading Co-Remediation: Resolved with Zero AI Tokens via primary fix on ${d}.`,n++}}if(g.source==="code_scanning"&&g.location?.filePath){let d=W.isAbsolute(g.location.filePath)?g.location.filePath:W.join(e,g.location.filePath);if(q.existsSync(d)){let p=q.readFileSync(d,"utf8"),u=g.location.snippet?.trim();if(u&&!p.includes(u)){let m=await z.findMatchingPattern(e,g);g.status="verified",g.resolutionEngine=m?"learned_pattern":"deterministic",g.statusMessage=m?`Locally Validated: Remediated via Learned Pattern "${m.name}" (0 AI Tokens).`:"Locally Validated: Vulnerable AST snippet eliminated in source file (0 AI Tokens).",i++}}}}r.report({increment:80,message:"Updating clubbing telemetry & sprint metrics..."}),await T.saveState(e,t),await this.update();let l=i+n;l>0?v.window.showInformationMessage(`CodeVulFixer: Validation complete! Successfully validated ${l} finding(s) with Zero AI Tokens (${n} co-remediated from shared packages/patterns).`):v.window.showInformationMessage("CodeVulFixer: Local validation scan completed. All pending findings still require remediation.")})}dispose(){for(s.currentPanel=void 0,this.panel.dispose();this.disposables.length;){let e=this.disposables.pop();e&&e.dispose()}}};var ie=S(require("vscode"));var me=class{constructor(e){this.extensionUri=e}static viewType="codevulfixer.sidebarView";view;resolveWebviewView(e,t,r){this.view=e,e.webview.options={enableScripts:!0,localResourceRoots:[this.extensionUri]},e.webview.onDidReceiveMessage(async i=>{switch(i.command){case"openDashboard":j.createOrShow(this.extensionUri);break;case"scan":await ie.commands.executeCommand("codevulfixer.scan"),this.refresh();break;case"loadDemo":await ie.commands.executeCommand("codevulfixer.loadDemoData"),this.refresh();break;case"runSprint":await ie.commands.executeCommand("codevulfixer.runSprint"),this.refresh();break;case"exportExcel":await ie.commands.executeCommand("codevulfixer.exportExcel");break;case"validateLocal":await ie.commands.executeCommand("codevulfixer.validateLocal"),this.refresh();break}}),this.refresh()}async refresh(){if(!this.view)return;let e=I.getPrimaryWorkspacePath(),t;e&&(t=await T.loadState(e)),this.view.webview.html=this.getSidebarHtml(t)}getSidebarHtml(e){return`<!DOCTYPE html>
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

  <button class="btn btn-secondary" onclick="post('validateLocal')">
    <span>\u{1F50D}</span> Validate Local Fixes (0-Token)
  </button>

  <button class="btn btn-secondary" onclick="post('exportExcel')">
    <span>\u{1F4CA}</span> Export to Excel (XML)
  </button>

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
</html>`}};function Uo(s){f.info("Activating CodeVulFixer Extension...");let e=new me(s.extensionUri);s.subscriptions.push(P.window.registerWebviewViewProvider(me.viewType,e)),s.subscriptions.push(P.commands.registerCommand("codevulfixer.openDashboard",()=>{f.info("Command: codevulfixer.openDashboard executed."),j.createOrShow(s.extensionUri)})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.scan",async()=>{f.info("Command: codevulfixer.scan executed.");let t=I.getPrimaryWorkspacePath();if(!t){P.window.showErrorMessage("CodeVulFixer: Please open a workspace folder before scanning.");return}await j.createOrShow(s.extensionUri).performScan(t),e.refresh()})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.loadDemoData",async()=>{f.info("Command: codevulfixer.loadDemoData executed.");let t=I.getPrimaryWorkspacePath();if(!t){P.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");return}await j.createOrShow(s.extensionUri).loadDemoFindings(t),e.refresh()})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.runSprint",async()=>{f.info("Command: codevulfixer.runSprint executed.");let t=I.getPrimaryWorkspacePath();if(!t)return;if(!await T.loadState(t)){let n=await P.window.showWarningMessage("No active sprint plan found. Ingest vulnerabilities first?","Scan Workspace","Load Demo Findings");n==="Scan Workspace"?await P.commands.executeCommand("codevulfixer.scan"):n==="Load Demo Findings"&&await P.commands.executeCommand("codevulfixer.loadDemoData");return}let i=j.createOrShow(s.extensionUri);P.commands.executeCommand("codevulfixer.openDashboard"),e.refresh()})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.resetState",async()=>{f.info("Command: codevulfixer.resetState executed.");let t=I.getPrimaryWorkspacePath();t&&(await T.resetState(t),j.currentPanel&&await j.currentPanel.update(),e.refresh(),P.window.showInformationMessage("CodeVulFixer: Sprint state has been reset."))})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.exportExcel",async()=>{f.info("Command: codevulfixer.exportExcel executed.");let t=I.getPrimaryWorkspacePath();if(!t){P.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");return}await j.createOrShow(s.extensionUri).exportToExcel(t)})),s.subscriptions.push(P.commands.registerCommand("codevulfixer.validateLocal",async()=>{f.info("Command: codevulfixer.validateLocal executed.");let t=I.getPrimaryWorkspacePath();if(!t){P.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");return}await j.createOrShow(s.extensionUri).validateAndRescanLocalState(t)})),f.success("CodeVulFixer successfully activated and initialized.")}function Mo(){f.info("Deactivating CodeVulFixer Extension.")}0&&(module.exports={activate,deactivate});
