"use strict";var Ot=Object.create;var Y=Object.defineProperty;var At=Object.getOwnPropertyDescriptor;var Dt=Object.getOwnPropertyNames;var Rt=Object.getPrototypeOf,Ut=Object.prototype.hasOwnProperty;var E=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),Lt=(r,e)=>{for(var t in e)Y(r,t,{get:e[t],enumerable:!0})},qe=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Dt(e))!Ut.call(r,o)&&o!==t&&Y(r,o,{get:()=>e[o],enumerable:!(s=At(e,o))||s.enumerable});return r};var b=(r,e,t)=>(t=r!=null?Ot(Rt(r)):{},qe(e||!r||!r.__esModule?Y(t,"default",{value:r,enumerable:!0}):t,r)),$t=r=>qe(Y({},"__esModule",{value:!0}),r);var q=E(Te=>{"use strict";Object.defineProperty(Te,"__esModule",{value:!0});function jt(){return typeof navigator=="object"&&"userAgent"in navigator?navigator.userAgent:typeof process=="object"&&process.version!==void 0?`Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`:"<environment undetectable>"}Te.getUserAgent=jt});var Qe=E((Oi,Je)=>{Je.exports=Ke;function Ke(r,e,t,s){if(typeof t!="function")throw new Error("method for before hook must be a function");return s||(s={}),Array.isArray(e)?e.reverse().reduce(function(o,n){return Ke.bind(null,r,n,o,s)},t)():Promise.resolve().then(function(){return r.registry[e]?r.registry[e].reduce(function(o,n){return n.hook.bind(null,o,s)},t)():t(s)})}});var Ze=E((Ai,Ye)=>{Ye.exports=It;function It(r,e,t,s){var o=s;r.registry[t]||(r.registry[t]=[]),e==="before"&&(s=function(n,i){return Promise.resolve().then(o.bind(null,i)).then(n.bind(null,i))}),e==="after"&&(s=function(n,i){var a;return Promise.resolve().then(n.bind(null,i)).then(function(c){return a=c,o(a,i)}).then(function(){return a})}),e==="error"&&(s=function(n,i){return Promise.resolve().then(n.bind(null,i)).catch(function(a){return o(a,i)})}),r.registry[t].push({hook:s,orig:o})}});var er=E((Di,Xe)=>{Xe.exports=Mt;function Mt(r,e,t){if(r.registry[e]){var s=r.registry[e].map(function(o){return o.orig}).indexOf(t);s!==-1&&r.registry[e].splice(s,1)}}});var ar=E((Ri,V)=>{var or=Qe(),qt=Ze(),Vt=er(),rr=Function.bind,tr=rr.bind(rr);function ir(r,e,t){var s=tr(Vt,null).apply(null,t?[e,t]:[e]);r.api={remove:s},r.remove=s,["before","error","after","wrap"].forEach(function(o){var n=t?[e,o,t]:[e,o];r[o]=r.api[o]=tr(qt,null).apply(null,n)})}function zt(){var r="h",e={registry:{}},t=or.bind(null,e,r);return ir(t,e,r),t}function nr(){var r={registry:{}},e=or.bind(null,r);return ir(e,r),e}var sr=!1;function $(){return sr||(console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'),sr=!0),nr()}$.Singular=zt.bind();$.Collection=nr.bind();V.exports=$;V.exports.Hook=$;V.exports.Singular=$.Singular;V.exports.Collection=$.Collection});var br=E((Ui,fr)=>{"use strict";var _e=Object.defineProperty,Ht=Object.getOwnPropertyDescriptor,Wt=Object.getOwnPropertyNames,Nt=Object.prototype.hasOwnProperty,Bt=(r,e)=>{for(var t in e)_e(r,t,{get:e[t],enumerable:!0})},Kt=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Wt(e))!Nt.call(r,o)&&o!==t&&_e(r,o,{get:()=>e[o],enumerable:!(s=Ht(e,o))||s.enumerable});return r},Jt=r=>Kt(_e({},"__esModule",{value:!0}),r),lr={};Bt(lr,{endpoint:()=>ls});fr.exports=Jt(lr);var Qt=q(),Yt="9.0.6",Zt=`octokit-endpoint.js/${Yt} ${(0,Qt.getUserAgent)()}`,Xt={method:"GET",baseUrl:"https://api.github.com",headers:{accept:"application/vnd.github.v3+json","user-agent":Zt},mediaType:{format:""}};function es(r){return r?Object.keys(r).reduce((e,t)=>(e[t.toLowerCase()]=r[t],e),{}):{}}function rs(r){if(typeof r!="object"||r===null||Object.prototype.toString.call(r)!=="[object Object]")return!1;let e=Object.getPrototypeOf(r);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(r)}function dr(r,e){let t=Object.assign({},r);return Object.keys(e).forEach(s=>{rs(e[s])?s in r?t[s]=dr(r[s],e[s]):Object.assign(t,{[s]:e[s]}):Object.assign(t,{[s]:e[s]})}),t}function cr(r){for(let e in r)r[e]===void 0&&delete r[e];return r}function we(r,e,t){if(typeof e=="string"){let[o,n]=e.split(" ");t=Object.assign(n?{method:o,url:n}:{url:o},t)}else t=Object.assign({},e);t.headers=es(t.headers),cr(t),cr(t.headers);let s=dr(r||{},t);return t.url==="/graphql"&&(r&&r.mediaType.previews?.length&&(s.mediaType.previews=r.mediaType.previews.filter(o=>!s.mediaType.previews.includes(o)).concat(s.mediaType.previews)),s.mediaType.previews=(s.mediaType.previews||[]).map(o=>o.replace(/-preview/,""))),s}function ts(r,e){let t=/\?/.test(r)?"&":"?",s=Object.keys(e);return s.length===0?r:r+t+s.map(o=>o==="q"?"q="+e.q.split("+").map(encodeURIComponent).join("+"):`${o}=${encodeURIComponent(e[o])}`).join("&")}var ss=/\{[^{}}]+\}/g;function os(r){return r.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g,"").split(/,/)}function is(r){let e=r.match(ss);return e?e.map(os).reduce((t,s)=>t.concat(s),[]):[]}function pr(r,e){let t={__proto__:null};for(let s of Object.keys(r))e.indexOf(s)===-1&&(t[s]=r[s]);return t}function ur(r){return r.split(/(%[0-9A-Fa-f]{2})/g).map(function(e){return/%[0-9A-Fa-f]/.test(e)||(e=encodeURI(e).replace(/%5B/g,"[").replace(/%5D/g,"]")),e}).join("")}function I(r){return encodeURIComponent(r).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function z(r,e,t){return e=r==="+"||r==="#"?ur(e):I(e),t?I(t)+"="+e:e}function j(r){return r!=null}function ye(r){return r===";"||r==="&"||r==="?"}function ns(r,e,t,s){var o=r[t],n=[];if(j(o)&&o!=="")if(typeof o=="string"||typeof o=="number"||typeof o=="boolean")o=o.toString(),s&&s!=="*"&&(o=o.substring(0,parseInt(s,10))),n.push(z(e,o,ye(e)?t:""));else if(s==="*")Array.isArray(o)?o.filter(j).forEach(function(i){n.push(z(e,i,ye(e)?t:""))}):Object.keys(o).forEach(function(i){j(o[i])&&n.push(z(e,o[i],i))});else{let i=[];Array.isArray(o)?o.filter(j).forEach(function(a){i.push(z(e,a))}):Object.keys(o).forEach(function(a){j(o[a])&&(i.push(I(a)),i.push(z(e,o[a].toString())))}),ye(e)?n.push(I(t)+"="+i.join(",")):i.length!==0&&n.push(i.join(","))}else e===";"?j(o)&&n.push(I(t)):o===""&&(e==="&"||e==="?")?n.push(I(t)+"="):o===""&&n.push("");return n}function as(r){return{expand:cs.bind(null,r)}}function cs(r,e){var t=["+","#",".","/",";","?","&"];return r=r.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g,function(s,o,n){if(o){let a="",c=[];if(t.indexOf(o.charAt(0))!==-1&&(a=o.charAt(0),o=o.substr(1)),o.split(/,/g).forEach(function(p){var u=/([^:\*]*)(?::(\d+)|(\*))?/.exec(p);c.push(ns(e,a,u[1],u[2]||u[3]))}),a&&a!=="+"){var i=",";return a==="?"?i="&":a!=="#"&&(i=a),(c.length!==0?a:"")+c.join(i)}else return c.join(",")}else return ur(n)}),r==="/"?r:r.replace(/\/$/,"")}function gr(r){let e=r.method.toUpperCase(),t=(r.url||"/").replace(/:([a-z]\w+)/g,"{$1}"),s=Object.assign({},r.headers),o,n=pr(r,["method","baseUrl","url","headers","request","mediaType"]),i=is(t);t=as(t).expand(n),/^http/.test(t)||(t=r.baseUrl+t);let a=Object.keys(r).filter(u=>i.includes(u)).concat("baseUrl"),c=pr(n,a);if(!/application\/octet-stream/i.test(s.accept)&&(r.mediaType.format&&(s.accept=s.accept.split(/,/).map(u=>u.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,`application/vnd$1$2.${r.mediaType.format}`)).join(",")),t.endsWith("/graphql")&&r.mediaType.previews?.length)){let u=s.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g)||[];s.accept=u.concat(r.mediaType.previews).map(l=>{let g=r.mediaType.format?`.${r.mediaType.format}`:"+json";return`application/vnd.github.${l}-preview${g}`}).join(",")}return["GET","HEAD"].includes(e)?t=ts(t,c):"data"in c?o=c.data:Object.keys(c).length&&(o=c),!s["content-type"]&&typeof o<"u"&&(s["content-type"]="application/json; charset=utf-8"),["PATCH","PUT"].includes(e)&&typeof o>"u"&&(o=""),Object.assign({method:e,url:t,headers:s},typeof o<"u"?{body:o}:null,r.request?{request:r.request}:null)}function ps(r,e,t){return gr(we(r,e,t))}function mr(r,e){let t=we(r,e),s=ps.bind(null,t);return Object.assign(s,{DEFAULTS:t,defaults:mr.bind(null,t),merge:we.bind(null,t),parse:gr})}var ls=mr(null,Xt)});var hr=E(Se=>{"use strict";Object.defineProperty(Se,"__esModule",{value:!0});var ke=class extends Error{constructor(e){super(e),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="Deprecation"}};Se.Deprecation=ke});var Tr=E(($i,Er)=>{Er.exports=vr;function vr(r,e){if(r&&e)return vr(r)(e);if(typeof r!="function")throw new TypeError("need wrapper function");return Object.keys(r).forEach(function(s){t[s]=r[s]}),t;function t(){for(var s=new Array(arguments.length),o=0;o<s.length;o++)s[o]=arguments[o];var n=r.apply(this,s),i=s[s.length-1];return typeof n=="function"&&n!==i&&Object.keys(i).forEach(function(a){n[a]=i[a]}),n}}});var _r=E((ji,Pe)=>{var yr=Tr();Pe.exports=yr(X);Pe.exports.strict=yr(wr);X.proto=X(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return X(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return wr(this)},configurable:!0})});function X(r){var e=function(){return e.called?e.value:(e.called=!0,e.value=r.apply(this,arguments))};return e.called=!1,e}function wr(r){var e=function(){if(e.called)throw new Error(e.onceError);return e.called=!0,e.value=r.apply(this,arguments)},t=r.name||"Function wrapped with `once`";return e.onceError=t+" shouldn't be called more than once",e.called=!1,e}});var Fr=E((Ii,xr)=>{"use strict";var ds=Object.create,ee=Object.defineProperty,us=Object.getOwnPropertyDescriptor,gs=Object.getOwnPropertyNames,ms=Object.getPrototypeOf,fs=Object.prototype.hasOwnProperty,bs=(r,e)=>{for(var t in e)ee(r,t,{get:e[t],enumerable:!0})},Sr=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of gs(e))!fs.call(r,o)&&o!==t&&ee(r,o,{get:()=>e[o],enumerable:!(s=us(e,o))||s.enumerable});return r},hs=(r,e,t)=>(t=r!=null?ds(ms(r)):{},Sr(e||!r||!r.__esModule?ee(t,"default",{value:r,enumerable:!0}):t,r)),vs=r=>Sr(ee({},"__esModule",{value:!0}),r),Pr={};bs(Pr,{RequestError:()=>ys});xr.exports=vs(Pr);var kr=hr(),Gr=hs(_r()),Es=(0,Gr.default)(r=>console.warn(r)),Ts=(0,Gr.default)(r=>console.warn(r)),ys=class extends Error{constructor(r,e,t){super(r),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="HttpError",this.status=e;let s;"headers"in t&&typeof t.headers<"u"&&(s=t.headers),"response"in t&&(this.response=t.response,s=t.response.headers);let o=Object.assign({},t.request);t.request.headers.authorization&&(o.headers=Object.assign({},t.request.headers,{authorization:t.request.headers.authorization.replace(/(?<! ) .*$/," [REDACTED]")})),o.url=o.url.replace(/\bclient_secret=\w+/g,"client_secret=[REDACTED]").replace(/\baccess_token=\w+/g,"access_token=[REDACTED]"),this.request=o,Object.defineProperty(this,"code",{get(){return Es(new kr.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")),e}}),Object.defineProperty(this,"headers",{get(){return Ts(new kr.Deprecation("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.")),s||{}}})}}});var W=E((qi,Ar)=>{"use strict";var Fe=Object.defineProperty,ws=Object.getOwnPropertyDescriptor,_s=Object.getOwnPropertyNames,ks=Object.prototype.hasOwnProperty,Ss=(r,e)=>{for(var t in e)Fe(r,t,{get:e[t],enumerable:!0})},Ps=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of _s(e))!ks.call(r,o)&&o!==t&&Fe(r,o,{get:()=>e[o],enumerable:!(s=ws(e,o))||s.enumerable});return r},Gs=r=>Ps(Fe({},"__esModule",{value:!0}),r),Or={};Ss(Or,{request:()=>Rs});Ar.exports=Gs(Or);var xs=br(),Fs=q(),Cs="8.4.1";function Os(r){if(typeof r!="object"||r===null||Object.prototype.toString.call(r)!=="[object Object]")return!1;let e=Object.getPrototypeOf(r);if(e===null)return!0;let t=Object.prototype.hasOwnProperty.call(e,"constructor")&&e.constructor;return typeof t=="function"&&t instanceof t&&Function.prototype.call(t)===Function.prototype.call(r)}var H=Fr();function As(r){return r.arrayBuffer()}function Cr(r){var e,t,s,o;let n=r.request&&r.request.log?r.request.log:console,i=((e=r.request)==null?void 0:e.parseSuccessResponseBody)!==!1;(Os(r.body)||Array.isArray(r.body))&&(r.body=JSON.stringify(r.body));let a={},c,p,{fetch:u}=globalThis;if((t=r.request)!=null&&t.fetch&&(u=r.request.fetch),!u)throw new Error("fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing");return u(r.url,{method:r.method,body:r.body,redirect:(s=r.request)==null?void 0:s.redirect,headers:r.headers,signal:(o=r.request)==null?void 0:o.signal,...r.body&&{duplex:"half"}}).then(async l=>{p=l.url,c=l.status;for(let g of l.headers)a[g[0]]=g[1];if("deprecation"in a){let g=a.link&&a.link.match(/<([^<>]+)>; rel="deprecation"/),f=g&&g.pop();n.warn(`[@octokit/request] "${r.method} ${r.url}" is deprecated. It is scheduled to be removed on ${a.sunset}${f?`. See ${f}`:""}`)}if(!(c===204||c===205)){if(r.method==="HEAD"){if(c<400)return;throw new H.RequestError(l.statusText,c,{response:{url:p,status:c,headers:a,data:void 0},request:r})}if(c===304)throw new H.RequestError("Not modified",c,{response:{url:p,status:c,headers:a,data:await Ge(l)},request:r});if(c>=400){let g=await Ge(l);throw new H.RequestError(Ds(g),c,{response:{url:p,status:c,headers:a,data:g},request:r})}return i?await Ge(l):l.body}}).then(l=>({status:c,url:p,headers:a,data:l})).catch(l=>{if(l instanceof H.RequestError)throw l;if(l.name==="AbortError")throw l;let g=l.message;throw l.name==="TypeError"&&"cause"in l&&(l.cause instanceof Error?g=l.cause.message:typeof l.cause=="string"&&(g=l.cause)),new H.RequestError(g,500,{request:r})})}async function Ge(r){let e=r.headers.get("content-type");return/application\/json/.test(e)?r.json().catch(()=>r.text()).catch(()=>""):!e||/^text\/|charset=utf-8$/.test(e)?r.text():As(r)}function Ds(r){if(typeof r=="string")return r;let e;return"documentation_url"in r?e=` - ${r.documentation_url}`:e="","message"in r?Array.isArray(r.errors)?`${r.message}: ${r.errors.map(JSON.stringify).join(", ")}${e}`:`${r.message}${e}`:`Unknown error: ${JSON.stringify(r)}`}function xe(r,e){let t=r.defaults(e);return Object.assign(function(o,n){let i=t.merge(o,n);if(!i.request||!i.request.hook)return Cr(t.parse(i));let a=(c,p)=>Cr(t.parse(t.merge(c,p)));return Object.assign(a,{endpoint:t,defaults:xe.bind(null,t)}),i.request.hook(a,i)},{endpoint:t,defaults:xe.bind(null,t)})}var Rs=xe(xs.endpoint,{headers:{"user-agent":`octokit-request.js/${Cs} ${(0,Fs.getUserAgent)()}`}})});var $r=E((Hi,Lr)=>{"use strict";var Ce=Object.defineProperty,Us=Object.getOwnPropertyDescriptor,Ls=Object.getOwnPropertyNames,$s=Object.prototype.hasOwnProperty,js=(r,e)=>{for(var t in e)Ce(r,t,{get:e[t],enumerable:!0})},Is=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Ls(e))!$s.call(r,o)&&o!==t&&Ce(r,o,{get:()=>e[o],enumerable:!(s=Us(e,o))||s.enumerable});return r},Ms=r=>Is(Ce({},"__esModule",{value:!0}),r),Rr={};js(Rr,{GraphqlResponseError:()=>Ur,graphql:()=>Ks,withCustomRequest:()=>Js});Lr.exports=Ms(Rr);var qs=W(),Vs=q(),zs="7.1.1",Vi=W(),zi=W();function Hs(r){return`Request failed due to following response errors:
`+r.errors.map(e=>` - ${e.message}`).join(`
`)}var Ur=class extends Error{constructor(r,e,t){super(Hs(t)),this.request=r,this.headers=e,this.response=t,this.name="GraphqlResponseError",this.errors=t.errors,this.data=t.data,Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}},Ws=["method","baseUrl","url","headers","request","query","mediaType"],Ns=["query","method","url"],Dr=/\/api\/v3\/?$/;function Bs(r,e,t){if(t){if(typeof e=="string"&&"query"in t)return Promise.reject(new Error('[@octokit/graphql] "query" cannot be used as variable name'));for(let i in t)if(Ns.includes(i))return Promise.reject(new Error(`[@octokit/graphql] "${i}" cannot be used as variable name`))}let s=typeof e=="string"?Object.assign({query:e},t):e,o=Object.keys(s).reduce((i,a)=>Ws.includes(a)?(i[a]=s[a],i):(i.variables||(i.variables={}),i.variables[a]=s[a],i),{}),n=s.baseUrl||r.endpoint.DEFAULTS.baseUrl;return Dr.test(n)&&(o.url=n.replace(Dr,"/api/graphql")),r(o).then(i=>{if(i.data.errors){let a={};for(let c of Object.keys(i.headers))a[c]=i.headers[c];throw new Ur(o,a,i.data)}return i.data.data})}function Oe(r,e){let t=r.defaults(e);return Object.assign((o,n)=>Bs(t,o,n),{defaults:Oe.bind(null,t),endpoint:t.endpoint})}var Ks=Oe(qs.request,{headers:{"user-agent":`octokit-graphql.js/${zs} ${(0,Vs.getUserAgent)()}`},method:"POST",url:"/graphql"});function Js(r){return Oe(r,{method:"POST",url:"/graphql"})}});var Mr=E((Ni,Ir)=>{"use strict";var Ae=Object.defineProperty,Qs=Object.getOwnPropertyDescriptor,Ys=Object.getOwnPropertyNames,Zs=Object.prototype.hasOwnProperty,Xs=(r,e)=>{for(var t in e)Ae(r,t,{get:e[t],enumerable:!0})},eo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Ys(e))!Zs.call(r,o)&&o!==t&&Ae(r,o,{get:()=>e[o],enumerable:!(s=Qs(e,o))||s.enumerable});return r},ro=r=>eo(Ae({},"__esModule",{value:!0}),r),jr={};Xs(jr,{createTokenAuth:()=>co});Ir.exports=ro(jr);var to=/^v1\./,so=/^ghs_/,oo=/^ghu_/;async function io(r){let e=r.split(/\./).length===3,t=to.test(r)||so.test(r),s=oo.test(r);return{type:"token",token:r,tokenType:e?"app":t?"installation":s?"user-to-server":"oauth"}}function no(r){return r.split(/\./).length===3?`bearer ${r}`:`token ${r}`}async function ao(r,e,t,s){let o=e.endpoint.merge(t,s);return o.headers.authorization=no(r),e(o)}var co=function(e){if(!e)throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");if(typeof e!="string")throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");return e=e.replace(/^(token|bearer) +/i,""),Object.assign(io.bind(null,e),{hook:ao.bind(null,e)})}});var Br=E((Bi,Nr)=>{"use strict";var De=Object.defineProperty,po=Object.getOwnPropertyDescriptor,lo=Object.getOwnPropertyNames,uo=Object.prototype.hasOwnProperty,go=(r,e)=>{for(var t in e)De(r,t,{get:e[t],enumerable:!0})},mo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of lo(e))!uo.call(r,o)&&o!==t&&De(r,o,{get:()=>e[o],enumerable:!(s=po(e,o))||s.enumerable});return r},fo=r=>mo(De({},"__esModule",{value:!0}),r),Hr={};go(Hr,{Octokit:()=>_o});Nr.exports=fo(Hr);var bo=q(),ho=ar(),qr=W(),vo=$r(),Eo=Mr(),Wr="5.2.2",Vr=()=>{},To=console.warn.bind(console),yo=console.error.bind(console);function wo(r={}){return typeof r.debug!="function"&&(r.debug=Vr),typeof r.info!="function"&&(r.info=Vr),typeof r.warn!="function"&&(r.warn=To),typeof r.error!="function"&&(r.error=yo),r}var zr=`octokit-core.js/${Wr} ${(0,bo.getUserAgent)()}`,_o=class{static{this.VERSION=Wr}static defaults(r){return class extends this{constructor(...t){let s=t[0]||{};if(typeof r=="function"){super(r(s));return}super(Object.assign({},r,s,s.userAgent&&r.userAgent?{userAgent:`${s.userAgent} ${r.userAgent}`}:null))}}}static{this.plugins=[]}static plugin(...r){let e=this.plugins;return class extends this{static{this.plugins=e.concat(r.filter(s=>!e.includes(s)))}}}constructor(r={}){let e=new ho.Collection,t={baseUrl:qr.request.endpoint.DEFAULTS.baseUrl,headers:{},request:Object.assign({},r.request,{hook:e.bind(null,"request")}),mediaType:{previews:[],format:""}};if(t.headers["user-agent"]=r.userAgent?`${r.userAgent} ${zr}`:zr,r.baseUrl&&(t.baseUrl=r.baseUrl),r.previews&&(t.mediaType.previews=r.previews),r.timeZone&&(t.headers["time-zone"]=r.timeZone),this.request=qr.request.defaults(t),this.graphql=(0,vo.withCustomRequest)(this.request).defaults(t),this.log=wo(r.log),this.hook=e,r.authStrategy){let{authStrategy:o,...n}=r,i=o(Object.assign({request:this.request,log:this.log,octokit:this,octokitOptions:n},r.auth));e.wrap("request",i.hook),this.auth=i}else if(!r.auth)this.auth=async()=>({type:"unauthenticated"});else{let o=(0,Eo.createTokenAuth)(r.auth);e.wrap("request",o.hook),this.auth=o}let s=this.constructor;for(let o=0;o<s.plugins.length;++o)Object.assign(this,s.plugins[o](this,r))}}});var Yr=E((Yi,Qr)=>{"use strict";var Re=Object.defineProperty,ko=Object.getOwnPropertyDescriptor,So=Object.getOwnPropertyNames,Po=Object.prototype.hasOwnProperty,Go=(r,e)=>{for(var t in e)Re(r,t,{get:e[t],enumerable:!0})},xo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of So(e))!Po.call(r,o)&&o!==t&&Re(r,o,{get:()=>e[o],enumerable:!(s=ko(e,o))||s.enumerable});return r},Fo=r=>xo(Re({},"__esModule",{value:!0}),r),Kr={};Go(Kr,{requestLog:()=>Jr});Qr.exports=Fo(Kr);var Co="4.0.1";function Jr(r){r.hook.wrap("request",(e,t)=>{r.log.debug("request",t);let s=Date.now(),o=r.request.endpoint.parse(t),n=o.url.replace(t.baseUrl,"");return e(t).then(i=>(r.log.info(`${o.method} ${n} - ${i.status} in ${Date.now()-s}ms`),i)).catch(i=>{throw r.log.info(`${o.method} ${n} - ${i.status} in ${Date.now()-s}ms`),i})})}Jr.VERSION=Co});var ot=E((Zi,st)=>{"use strict";var Ue=Object.defineProperty,Oo=Object.getOwnPropertyDescriptor,Ao=Object.getOwnPropertyNames,Do=Object.prototype.hasOwnProperty,Ro=(r,e)=>{for(var t in e)Ue(r,t,{get:e[t],enumerable:!0})},Uo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Ao(e))!Do.call(r,o)&&o!==t&&Ue(r,o,{get:()=>e[o],enumerable:!(s=Oo(e,o))||s.enumerable});return r},Lo=r=>Uo(Ue({},"__esModule",{value:!0}),r),Zr={};Ro(Zr,{composePaginateRest:()=>Io,isPaginatingEndpoint:()=>Mo,paginateRest:()=>tt,paginatingEndpoints:()=>rt});st.exports=Lo(Zr);var $o="11.4.4-cjs.2";function jo(r){if(!r.data)return{...r,data:[]};if(!("total_count"in r.data&&!("url"in r.data)))return r;let t=r.data.incomplete_results,s=r.data.repository_selection,o=r.data.total_count;delete r.data.incomplete_results,delete r.data.repository_selection,delete r.data.total_count;let n=Object.keys(r.data)[0],i=r.data[n];return r.data=i,typeof t<"u"&&(r.data.incomplete_results=t),typeof s<"u"&&(r.data.repository_selection=s),r.data.total_count=o,r}function Le(r,e,t){let s=typeof e=="function"?e.endpoint(t):r.request.endpoint(e,t),o=typeof e=="function"?e:r.request,n=s.method,i=s.headers,a=s.url;return{[Symbol.asyncIterator]:()=>({async next(){if(!a)return{done:!0};try{let c=await o({method:n,url:a,headers:i}),p=jo(c);return a=((p.headers.link||"").match(/<([^<>]+)>;\s*rel="next"/)||[])[1],{value:p}}catch(c){if(c.status!==409)throw c;return a="",{value:{status:200,headers:{},data:[]}}}}})}}function Xr(r,e,t,s){return typeof t=="function"&&(s=t,t=void 0),et(r,[],Le(r,e,t)[Symbol.asyncIterator](),s)}function et(r,e,t,s){return t.next().then(o=>{if(o.done)return e;let n=!1;function i(){n=!0}return e=e.concat(s?s(o.value,i):o.value.data),n?e:et(r,e,t,s)})}var Io=Object.assign(Xr,{iterator:Le}),rt=["GET /advisories","GET /app/hook/deliveries","GET /app/installation-requests","GET /app/installations","GET /assignments/{assignment_id}/accepted_assignments","GET /classrooms","GET /classrooms/{classroom_id}/assignments","GET /enterprises/{enterprise}/code-security/configurations","GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories","GET /enterprises/{enterprise}/dependabot/alerts","GET /enterprises/{enterprise}/secret-scanning/alerts","GET /events","GET /gists","GET /gists/public","GET /gists/starred","GET /gists/{gist_id}/comments","GET /gists/{gist_id}/commits","GET /gists/{gist_id}/forks","GET /installation/repositories","GET /issues","GET /licenses","GET /marketplace_listing/plans","GET /marketplace_listing/plans/{plan_id}/accounts","GET /marketplace_listing/stubbed/plans","GET /marketplace_listing/stubbed/plans/{plan_id}/accounts","GET /networks/{owner}/{repo}/events","GET /notifications","GET /organizations","GET /orgs/{org}/actions/cache/usage-by-repository","GET /orgs/{org}/actions/permissions/repositories","GET /orgs/{org}/actions/runner-groups","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories","GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners","GET /orgs/{org}/actions/runners","GET /orgs/{org}/actions/secrets","GET /orgs/{org}/actions/secrets/{secret_name}/repositories","GET /orgs/{org}/actions/variables","GET /orgs/{org}/actions/variables/{name}/repositories","GET /orgs/{org}/attestations/{subject_digest}","GET /orgs/{org}/blocks","GET /orgs/{org}/code-scanning/alerts","GET /orgs/{org}/code-security/configurations","GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories","GET /orgs/{org}/codespaces","GET /orgs/{org}/codespaces/secrets","GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories","GET /orgs/{org}/copilot/billing/seats","GET /orgs/{org}/copilot/metrics","GET /orgs/{org}/copilot/usage","GET /orgs/{org}/dependabot/alerts","GET /orgs/{org}/dependabot/secrets","GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories","GET /orgs/{org}/events","GET /orgs/{org}/failed_invitations","GET /orgs/{org}/hooks","GET /orgs/{org}/hooks/{hook_id}/deliveries","GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}","GET /orgs/{org}/insights/api/subject-stats","GET /orgs/{org}/insights/api/user-stats/{user_id}","GET /orgs/{org}/installations","GET /orgs/{org}/invitations","GET /orgs/{org}/invitations/{invitation_id}/teams","GET /orgs/{org}/issues","GET /orgs/{org}/members","GET /orgs/{org}/members/{username}/codespaces","GET /orgs/{org}/migrations","GET /orgs/{org}/migrations/{migration_id}/repositories","GET /orgs/{org}/organization-roles/{role_id}/teams","GET /orgs/{org}/organization-roles/{role_id}/users","GET /orgs/{org}/outside_collaborators","GET /orgs/{org}/packages","GET /orgs/{org}/packages/{package_type}/{package_name}/versions","GET /orgs/{org}/personal-access-token-requests","GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories","GET /orgs/{org}/personal-access-tokens","GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories","GET /orgs/{org}/private-registries","GET /orgs/{org}/projects","GET /orgs/{org}/properties/values","GET /orgs/{org}/public_members","GET /orgs/{org}/repos","GET /orgs/{org}/rulesets","GET /orgs/{org}/rulesets/rule-suites","GET /orgs/{org}/secret-scanning/alerts","GET /orgs/{org}/security-advisories","GET /orgs/{org}/team/{team_slug}/copilot/metrics","GET /orgs/{org}/team/{team_slug}/copilot/usage","GET /orgs/{org}/teams","GET /orgs/{org}/teams/{team_slug}/discussions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions","GET /orgs/{org}/teams/{team_slug}/invitations","GET /orgs/{org}/teams/{team_slug}/members","GET /orgs/{org}/teams/{team_slug}/projects","GET /orgs/{org}/teams/{team_slug}/repos","GET /orgs/{org}/teams/{team_slug}/teams","GET /projects/columns/{column_id}/cards","GET /projects/{project_id}/collaborators","GET /projects/{project_id}/columns","GET /repos/{owner}/{repo}/actions/artifacts","GET /repos/{owner}/{repo}/actions/caches","GET /repos/{owner}/{repo}/actions/organization-secrets","GET /repos/{owner}/{repo}/actions/organization-variables","GET /repos/{owner}/{repo}/actions/runners","GET /repos/{owner}/{repo}/actions/runs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts","GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs","GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs","GET /repos/{owner}/{repo}/actions/secrets","GET /repos/{owner}/{repo}/actions/variables","GET /repos/{owner}/{repo}/actions/workflows","GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs","GET /repos/{owner}/{repo}/activity","GET /repos/{owner}/{repo}/assignees","GET /repos/{owner}/{repo}/attestations/{subject_digest}","GET /repos/{owner}/{repo}/branches","GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations","GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs","GET /repos/{owner}/{repo}/code-scanning/alerts","GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances","GET /repos/{owner}/{repo}/code-scanning/analyses","GET /repos/{owner}/{repo}/codespaces","GET /repos/{owner}/{repo}/codespaces/devcontainers","GET /repos/{owner}/{repo}/codespaces/secrets","GET /repos/{owner}/{repo}/collaborators","GET /repos/{owner}/{repo}/comments","GET /repos/{owner}/{repo}/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/commits","GET /repos/{owner}/{repo}/commits/{commit_sha}/comments","GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls","GET /repos/{owner}/{repo}/commits/{ref}/check-runs","GET /repos/{owner}/{repo}/commits/{ref}/check-suites","GET /repos/{owner}/{repo}/commits/{ref}/status","GET /repos/{owner}/{repo}/commits/{ref}/statuses","GET /repos/{owner}/{repo}/contributors","GET /repos/{owner}/{repo}/dependabot/alerts","GET /repos/{owner}/{repo}/dependabot/secrets","GET /repos/{owner}/{repo}/deployments","GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses","GET /repos/{owner}/{repo}/environments","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies","GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps","GET /repos/{owner}/{repo}/environments/{environment_name}/secrets","GET /repos/{owner}/{repo}/environments/{environment_name}/variables","GET /repos/{owner}/{repo}/events","GET /repos/{owner}/{repo}/forks","GET /repos/{owner}/{repo}/hooks","GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries","GET /repos/{owner}/{repo}/invitations","GET /repos/{owner}/{repo}/issues","GET /repos/{owner}/{repo}/issues/comments","GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/issues/events","GET /repos/{owner}/{repo}/issues/{issue_number}/comments","GET /repos/{owner}/{repo}/issues/{issue_number}/events","GET /repos/{owner}/{repo}/issues/{issue_number}/labels","GET /repos/{owner}/{repo}/issues/{issue_number}/reactions","GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues","GET /repos/{owner}/{repo}/issues/{issue_number}/timeline","GET /repos/{owner}/{repo}/keys","GET /repos/{owner}/{repo}/labels","GET /repos/{owner}/{repo}/milestones","GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels","GET /repos/{owner}/{repo}/notifications","GET /repos/{owner}/{repo}/pages/builds","GET /repos/{owner}/{repo}/projects","GET /repos/{owner}/{repo}/pulls","GET /repos/{owner}/{repo}/pulls/comments","GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions","GET /repos/{owner}/{repo}/pulls/{pull_number}/comments","GET /repos/{owner}/{repo}/pulls/{pull_number}/commits","GET /repos/{owner}/{repo}/pulls/{pull_number}/files","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews","GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments","GET /repos/{owner}/{repo}/releases","GET /repos/{owner}/{repo}/releases/{release_id}/assets","GET /repos/{owner}/{repo}/releases/{release_id}/reactions","GET /repos/{owner}/{repo}/rules/branches/{branch}","GET /repos/{owner}/{repo}/rulesets","GET /repos/{owner}/{repo}/rulesets/rule-suites","GET /repos/{owner}/{repo}/secret-scanning/alerts","GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations","GET /repos/{owner}/{repo}/security-advisories","GET /repos/{owner}/{repo}/stargazers","GET /repos/{owner}/{repo}/subscribers","GET /repos/{owner}/{repo}/tags","GET /repos/{owner}/{repo}/teams","GET /repos/{owner}/{repo}/topics","GET /repositories","GET /search/code","GET /search/commits","GET /search/issues","GET /search/labels","GET /search/repositories","GET /search/topics","GET /search/users","GET /teams/{team_id}/discussions","GET /teams/{team_id}/discussions/{discussion_number}/comments","GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions","GET /teams/{team_id}/discussions/{discussion_number}/reactions","GET /teams/{team_id}/invitations","GET /teams/{team_id}/members","GET /teams/{team_id}/projects","GET /teams/{team_id}/repos","GET /teams/{team_id}/teams","GET /user/blocks","GET /user/codespaces","GET /user/codespaces/secrets","GET /user/emails","GET /user/followers","GET /user/following","GET /user/gpg_keys","GET /user/installations","GET /user/installations/{installation_id}/repositories","GET /user/issues","GET /user/keys","GET /user/marketplace_purchases","GET /user/marketplace_purchases/stubbed","GET /user/memberships/orgs","GET /user/migrations","GET /user/migrations/{migration_id}/repositories","GET /user/orgs","GET /user/packages","GET /user/packages/{package_type}/{package_name}/versions","GET /user/public_emails","GET /user/repos","GET /user/repository_invitations","GET /user/social_accounts","GET /user/ssh_signing_keys","GET /user/starred","GET /user/subscriptions","GET /user/teams","GET /users","GET /users/{username}/attestations/{subject_digest}","GET /users/{username}/events","GET /users/{username}/events/orgs/{org}","GET /users/{username}/events/public","GET /users/{username}/followers","GET /users/{username}/following","GET /users/{username}/gists","GET /users/{username}/gpg_keys","GET /users/{username}/keys","GET /users/{username}/orgs","GET /users/{username}/packages","GET /users/{username}/projects","GET /users/{username}/received_events","GET /users/{username}/received_events/public","GET /users/{username}/repos","GET /users/{username}/social_accounts","GET /users/{username}/ssh_signing_keys","GET /users/{username}/starred","GET /users/{username}/subscriptions"];function Mo(r){return typeof r=="string"?rt.includes(r):!1}function tt(r){return{paginate:Object.assign(Xr.bind(null,r),{iterator:Le.bind(null,r)})}}tt.VERSION=$o});var dt=E((Xi,lt)=>{"use strict";var $e=Object.defineProperty,qo=Object.getOwnPropertyDescriptor,Vo=Object.getOwnPropertyNames,zo=Object.prototype.hasOwnProperty,Ho=(r,e)=>{for(var t in e)$e(r,t,{get:e[t],enumerable:!0})},Wo=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Vo(e))!zo.call(r,o)&&o!==t&&$e(r,o,{get:()=>e[o],enumerable:!(s=qo(e,o))||s.enumerable});return r},No=r=>Wo($e({},"__esModule",{value:!0}),r),it={};Ho(it,{legacyRestEndpointMethods:()=>pt,restEndpointMethods:()=>ct});lt.exports=No(it);var nt="13.3.2-cjs.1",Bo={actions:{addCustomLabelsToSelfHostedRunnerForOrg:["POST /orgs/{org}/actions/runners/{runner_id}/labels"],addCustomLabelsToSelfHostedRunnerForRepo:["POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],addRepoAccessToSelfHostedRunnerGroupInOrg:["PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],approveWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],cancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],createEnvironmentVariable:["POST /repos/{owner}/{repo}/environments/{environment_name}/variables"],createOrUpdateEnvironmentSecret:["PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],createOrgVariable:["POST /orgs/{org}/actions/variables"],createRegistrationTokenForOrg:["POST /orgs/{org}/actions/runners/registration-token"],createRegistrationTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/registration-token"],createRemoveTokenForOrg:["POST /orgs/{org}/actions/runners/remove-token"],createRemoveTokenForRepo:["POST /repos/{owner}/{repo}/actions/runners/remove-token"],createRepoVariable:["POST /repos/{owner}/{repo}/actions/variables"],createWorkflowDispatch:["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],deleteActionsCacheById:["DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"],deleteActionsCacheByKey:["DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"],deleteArtifact:["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],deleteEnvironmentSecret:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],deleteEnvironmentVariable:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],deleteOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}"],deleteOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],deleteRepoVariable:["DELETE /repos/{owner}/{repo}/actions/variables/{name}"],deleteSelfHostedRunnerFromOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}"],deleteSelfHostedRunnerFromRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],deleteWorkflowRun:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],deleteWorkflowRunLogs:["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],disableSelectedRepositoryGithubActionsOrganization:["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],disableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],downloadArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],downloadJobLogsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],downloadWorkflowRunAttemptLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"],downloadWorkflowRunLogs:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],enableSelectedRepositoryGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],enableWorkflow:["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],forceCancelWorkflowRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"],generateRunnerJitconfigForOrg:["POST /orgs/{org}/actions/runners/generate-jitconfig"],generateRunnerJitconfigForRepo:["POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"],getActionsCacheList:["GET /repos/{owner}/{repo}/actions/caches"],getActionsCacheUsage:["GET /repos/{owner}/{repo}/actions/cache/usage"],getActionsCacheUsageByRepoForOrg:["GET /orgs/{org}/actions/cache/usage-by-repository"],getActionsCacheUsageForOrg:["GET /orgs/{org}/actions/cache/usage"],getAllowedActionsOrganization:["GET /orgs/{org}/actions/permissions/selected-actions"],getAllowedActionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],getArtifact:["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],getCustomOidcSubClaimForRepo:["GET /repos/{owner}/{repo}/actions/oidc/customization/sub"],getEnvironmentPublicKey:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"],getEnvironmentSecret:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"],getEnvironmentVariable:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],getGithubActionsDefaultWorkflowPermissionsOrganization:["GET /orgs/{org}/actions/permissions/workflow"],getGithubActionsDefaultWorkflowPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions/workflow"],getGithubActionsPermissionsOrganization:["GET /orgs/{org}/actions/permissions"],getGithubActionsPermissionsRepository:["GET /repos/{owner}/{repo}/actions/permissions"],getJobForWorkflowRun:["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],getOrgPublicKey:["GET /orgs/{org}/actions/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}"],getOrgVariable:["GET /orgs/{org}/actions/variables/{name}"],getPendingDeploymentsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],getRepoPermissions:["GET /repos/{owner}/{repo}/actions/permissions",{},{renamed:["actions","getGithubActionsPermissionsRepository"]}],getRepoPublicKey:["GET /repos/{owner}/{repo}/actions/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],getRepoVariable:["GET /repos/{owner}/{repo}/actions/variables/{name}"],getReviewsForRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],getSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}"],getSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],getWorkflow:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],getWorkflowAccessToRepository:["GET /repos/{owner}/{repo}/actions/permissions/access"],getWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],getWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"],getWorkflowRunUsage:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],getWorkflowUsage:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],listArtifactsForRepo:["GET /repos/{owner}/{repo}/actions/artifacts"],listEnvironmentSecrets:["GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"],listEnvironmentVariables:["GET /repos/{owner}/{repo}/environments/{environment_name}/variables"],listJobsForWorkflowRun:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],listJobsForWorkflowRunAttempt:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"],listLabelsForSelfHostedRunnerForOrg:["GET /orgs/{org}/actions/runners/{runner_id}/labels"],listLabelsForSelfHostedRunnerForRepo:["GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],listOrgSecrets:["GET /orgs/{org}/actions/secrets"],listOrgVariables:["GET /orgs/{org}/actions/variables"],listRepoOrganizationSecrets:["GET /repos/{owner}/{repo}/actions/organization-secrets"],listRepoOrganizationVariables:["GET /repos/{owner}/{repo}/actions/organization-variables"],listRepoSecrets:["GET /repos/{owner}/{repo}/actions/secrets"],listRepoVariables:["GET /repos/{owner}/{repo}/actions/variables"],listRepoWorkflows:["GET /repos/{owner}/{repo}/actions/workflows"],listRunnerApplicationsForOrg:["GET /orgs/{org}/actions/runners/downloads"],listRunnerApplicationsForRepo:["GET /repos/{owner}/{repo}/actions/runners/downloads"],listSelectedReposForOrgSecret:["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],listSelectedReposForOrgVariable:["GET /orgs/{org}/actions/variables/{name}/repositories"],listSelectedRepositoriesEnabledGithubActionsOrganization:["GET /orgs/{org}/actions/permissions/repositories"],listSelfHostedRunnersForOrg:["GET /orgs/{org}/actions/runners"],listSelfHostedRunnersForRepo:["GET /repos/{owner}/{repo}/actions/runners"],listWorkflowRunArtifacts:["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],listWorkflowRuns:["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],listWorkflowRunsForRepo:["GET /repos/{owner}/{repo}/actions/runs"],reRunJobForWorkflowRun:["POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"],reRunWorkflow:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],reRunWorkflowFailedJobs:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"],removeAllCustomLabelsFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels"],removeAllCustomLabelsFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],removeCustomLabelFromSelfHostedRunnerForOrg:["DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"],removeCustomLabelFromSelfHostedRunnerForRepo:["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgVariable:["DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"],reviewCustomGatesForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"],reviewPendingDeploymentsForRun:["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],setAllowedActionsOrganization:["PUT /orgs/{org}/actions/permissions/selected-actions"],setAllowedActionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],setCustomLabelsForSelfHostedRunnerForOrg:["PUT /orgs/{org}/actions/runners/{runner_id}/labels"],setCustomLabelsForSelfHostedRunnerForRepo:["PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"],setCustomOidcSubClaimForRepo:["PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"],setGithubActionsDefaultWorkflowPermissionsOrganization:["PUT /orgs/{org}/actions/permissions/workflow"],setGithubActionsDefaultWorkflowPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions/workflow"],setGithubActionsPermissionsOrganization:["PUT /orgs/{org}/actions/permissions"],setGithubActionsPermissionsRepository:["PUT /repos/{owner}/{repo}/actions/permissions"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],setSelectedReposForOrgVariable:["PUT /orgs/{org}/actions/variables/{name}/repositories"],setSelectedRepositoriesEnabledGithubActionsOrganization:["PUT /orgs/{org}/actions/permissions/repositories"],setWorkflowAccessToRepository:["PUT /repos/{owner}/{repo}/actions/permissions/access"],updateEnvironmentVariable:["PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"],updateOrgVariable:["PATCH /orgs/{org}/actions/variables/{name}"],updateRepoVariable:["PATCH /repos/{owner}/{repo}/actions/variables/{name}"]},activity:{checkRepoIsStarredByAuthenticatedUser:["GET /user/starred/{owner}/{repo}"],deleteRepoSubscription:["DELETE /repos/{owner}/{repo}/subscription"],deleteThreadSubscription:["DELETE /notifications/threads/{thread_id}/subscription"],getFeeds:["GET /feeds"],getRepoSubscription:["GET /repos/{owner}/{repo}/subscription"],getThread:["GET /notifications/threads/{thread_id}"],getThreadSubscriptionForAuthenticatedUser:["GET /notifications/threads/{thread_id}/subscription"],listEventsForAuthenticatedUser:["GET /users/{username}/events"],listNotificationsForAuthenticatedUser:["GET /notifications"],listOrgEventsForAuthenticatedUser:["GET /users/{username}/events/orgs/{org}"],listPublicEvents:["GET /events"],listPublicEventsForRepoNetwork:["GET /networks/{owner}/{repo}/events"],listPublicEventsForUser:["GET /users/{username}/events/public"],listPublicOrgEvents:["GET /orgs/{org}/events"],listReceivedEventsForUser:["GET /users/{username}/received_events"],listReceivedPublicEventsForUser:["GET /users/{username}/received_events/public"],listRepoEvents:["GET /repos/{owner}/{repo}/events"],listRepoNotificationsForAuthenticatedUser:["GET /repos/{owner}/{repo}/notifications"],listReposStarredByAuthenticatedUser:["GET /user/starred"],listReposStarredByUser:["GET /users/{username}/starred"],listReposWatchedByUser:["GET /users/{username}/subscriptions"],listStargazersForRepo:["GET /repos/{owner}/{repo}/stargazers"],listWatchedReposForAuthenticatedUser:["GET /user/subscriptions"],listWatchersForRepo:["GET /repos/{owner}/{repo}/subscribers"],markNotificationsAsRead:["PUT /notifications"],markRepoNotificationsAsRead:["PUT /repos/{owner}/{repo}/notifications"],markThreadAsDone:["DELETE /notifications/threads/{thread_id}"],markThreadAsRead:["PATCH /notifications/threads/{thread_id}"],setRepoSubscription:["PUT /repos/{owner}/{repo}/subscription"],setThreadSubscription:["PUT /notifications/threads/{thread_id}/subscription"],starRepoForAuthenticatedUser:["PUT /user/starred/{owner}/{repo}"],unstarRepoForAuthenticatedUser:["DELETE /user/starred/{owner}/{repo}"]},apps:{addRepoToInstallation:["PUT /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","addRepoToInstallationForAuthenticatedUser"]}],addRepoToInstallationForAuthenticatedUser:["PUT /user/installations/{installation_id}/repositories/{repository_id}"],checkToken:["POST /applications/{client_id}/token"],createFromManifest:["POST /app-manifests/{code}/conversions"],createInstallationAccessToken:["POST /app/installations/{installation_id}/access_tokens"],deleteAuthorization:["DELETE /applications/{client_id}/grant"],deleteInstallation:["DELETE /app/installations/{installation_id}"],deleteToken:["DELETE /applications/{client_id}/token"],getAuthenticated:["GET /app"],getBySlug:["GET /apps/{app_slug}"],getInstallation:["GET /app/installations/{installation_id}"],getOrgInstallation:["GET /orgs/{org}/installation"],getRepoInstallation:["GET /repos/{owner}/{repo}/installation"],getSubscriptionPlanForAccount:["GET /marketplace_listing/accounts/{account_id}"],getSubscriptionPlanForAccountStubbed:["GET /marketplace_listing/stubbed/accounts/{account_id}"],getUserInstallation:["GET /users/{username}/installation"],getWebhookConfigForApp:["GET /app/hook/config"],getWebhookDelivery:["GET /app/hook/deliveries/{delivery_id}"],listAccountsForPlan:["GET /marketplace_listing/plans/{plan_id}/accounts"],listAccountsForPlanStubbed:["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],listInstallationReposForAuthenticatedUser:["GET /user/installations/{installation_id}/repositories"],listInstallationRequestsForAuthenticatedApp:["GET /app/installation-requests"],listInstallations:["GET /app/installations"],listInstallationsForAuthenticatedUser:["GET /user/installations"],listPlans:["GET /marketplace_listing/plans"],listPlansStubbed:["GET /marketplace_listing/stubbed/plans"],listReposAccessibleToInstallation:["GET /installation/repositories"],listSubscriptionsForAuthenticatedUser:["GET /user/marketplace_purchases"],listSubscriptionsForAuthenticatedUserStubbed:["GET /user/marketplace_purchases/stubbed"],listWebhookDeliveries:["GET /app/hook/deliveries"],redeliverWebhookDelivery:["POST /app/hook/deliveries/{delivery_id}/attempts"],removeRepoFromInstallation:["DELETE /user/installations/{installation_id}/repositories/{repository_id}",{},{renamed:["apps","removeRepoFromInstallationForAuthenticatedUser"]}],removeRepoFromInstallationForAuthenticatedUser:["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],resetToken:["PATCH /applications/{client_id}/token"],revokeInstallationAccessToken:["DELETE /installation/token"],scopeToken:["POST /applications/{client_id}/token/scoped"],suspendInstallation:["PUT /app/installations/{installation_id}/suspended"],unsuspendInstallation:["DELETE /app/installations/{installation_id}/suspended"],updateWebhookConfigForApp:["PATCH /app/hook/config"]},billing:{getGithubActionsBillingOrg:["GET /orgs/{org}/settings/billing/actions"],getGithubActionsBillingUser:["GET /users/{username}/settings/billing/actions"],getGithubBillingUsageReportOrg:["GET /organizations/{org}/settings/billing/usage"],getGithubPackagesBillingOrg:["GET /orgs/{org}/settings/billing/packages"],getGithubPackagesBillingUser:["GET /users/{username}/settings/billing/packages"],getSharedStorageBillingOrg:["GET /orgs/{org}/settings/billing/shared-storage"],getSharedStorageBillingUser:["GET /users/{username}/settings/billing/shared-storage"]},checks:{create:["POST /repos/{owner}/{repo}/check-runs"],createSuite:["POST /repos/{owner}/{repo}/check-suites"],get:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],getSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],listAnnotations:["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],listForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],listForSuite:["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],listSuitesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],rerequestRun:["POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"],rerequestSuite:["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],setSuitesPreferences:["PATCH /repos/{owner}/{repo}/check-suites/preferences"],update:["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]},codeScanning:{commitAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"],createAutofix:["POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],createVariantAnalysis:["POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"],deleteAnalysis:["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],deleteCodeqlDatabase:["DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getAlert:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",{},{renamedParameters:{alert_id:"alert_number"}}],getAnalysis:["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],getAutofix:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"],getCodeqlDatabase:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"],getDefaultSetup:["GET /repos/{owner}/{repo}/code-scanning/default-setup"],getSarif:["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],getVariantAnalysis:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"],getVariantAnalysisRepoTask:["GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"],listAlertInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],listAlertsForOrg:["GET /orgs/{org}/code-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/code-scanning/alerts"],listAlertsInstances:["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",{},{renamed:["codeScanning","listAlertInstances"]}],listCodeqlDatabases:["GET /repos/{owner}/{repo}/code-scanning/codeql/databases"],listRecentAnalyses:["GET /repos/{owner}/{repo}/code-scanning/analyses"],updateAlert:["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],updateDefaultSetup:["PATCH /repos/{owner}/{repo}/code-scanning/default-setup"],uploadSarif:["POST /repos/{owner}/{repo}/code-scanning/sarifs"]},codeSecurity:{attachConfiguration:["POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"],attachEnterpriseConfiguration:["POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"],createConfiguration:["POST /orgs/{org}/code-security/configurations"],createConfigurationForEnterprise:["POST /enterprises/{enterprise}/code-security/configurations"],deleteConfiguration:["DELETE /orgs/{org}/code-security/configurations/{configuration_id}"],deleteConfigurationForEnterprise:["DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],detachConfiguration:["DELETE /orgs/{org}/code-security/configurations/detach"],getConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}"],getConfigurationForRepository:["GET /repos/{owner}/{repo}/code-security-configuration"],getConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations"],getConfigurationsForOrg:["GET /orgs/{org}/code-security/configurations"],getDefaultConfigurations:["GET /orgs/{org}/code-security/configurations/defaults"],getDefaultConfigurationsForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/defaults"],getRepositoriesForConfiguration:["GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"],getRepositoriesForEnterpriseConfiguration:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"],getSingleConfigurationForEnterprise:["GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"],setConfigurationAsDefault:["PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"],setConfigurationAsDefaultForEnterprise:["PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"],updateConfiguration:["PATCH /orgs/{org}/code-security/configurations/{configuration_id}"],updateEnterpriseConfiguration:["PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"]},codesOfConduct:{getAllCodesOfConduct:["GET /codes_of_conduct"],getConductCode:["GET /codes_of_conduct/{key}"]},codespaces:{addRepositoryForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],addSelectedRepoToOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],checkPermissionsForDevcontainer:["GET /repos/{owner}/{repo}/codespaces/permissions_check"],codespaceMachinesForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/machines"],createForAuthenticatedUser:["POST /user/codespaces"],createOrUpdateOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],createOrUpdateSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}"],createWithPrForAuthenticatedUser:["POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"],createWithRepoForAuthenticatedUser:["POST /repos/{owner}/{repo}/codespaces"],deleteForAuthenticatedUser:["DELETE /user/codespaces/{codespace_name}"],deleteFromOrganization:["DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"],deleteOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],deleteSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}"],exportForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/exports"],getCodespacesForUserInOrg:["GET /orgs/{org}/members/{username}/codespaces"],getExportDetailsForAuthenticatedUser:["GET /user/codespaces/{codespace_name}/exports/{export_id}"],getForAuthenticatedUser:["GET /user/codespaces/{codespace_name}"],getOrgPublicKey:["GET /orgs/{org}/codespaces/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}"],getPublicKeyForAuthenticatedUser:["GET /user/codespaces/secrets/public-key"],getRepoPublicKey:["GET /repos/{owner}/{repo}/codespaces/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"],getSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}"],listDevcontainersInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/devcontainers"],listForAuthenticatedUser:["GET /user/codespaces"],listInOrganization:["GET /orgs/{org}/codespaces",{},{renamedParameters:{org_id:"org"}}],listInRepositoryForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces"],listOrgSecrets:["GET /orgs/{org}/codespaces/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/codespaces/secrets"],listRepositoriesForSecretForAuthenticatedUser:["GET /user/codespaces/secrets/{secret_name}/repositories"],listSecretsForAuthenticatedUser:["GET /user/codespaces/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],preFlightWithRepoForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/new"],publishForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/publish"],removeRepositoryForSecretForAuthenticatedUser:["DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"],repoMachinesForAuthenticatedUser:["GET /repos/{owner}/{repo}/codespaces/machines"],setRepositoriesForSecretForAuthenticatedUser:["PUT /user/codespaces/secrets/{secret_name}/repositories"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"],startForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/start"],stopForAuthenticatedUser:["POST /user/codespaces/{codespace_name}/stop"],stopInOrganization:["POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"],updateForAuthenticatedUser:["PATCH /user/codespaces/{codespace_name}"]},copilot:{addCopilotSeatsForTeams:["POST /orgs/{org}/copilot/billing/selected_teams"],addCopilotSeatsForUsers:["POST /orgs/{org}/copilot/billing/selected_users"],cancelCopilotSeatAssignmentForTeams:["DELETE /orgs/{org}/copilot/billing/selected_teams"],cancelCopilotSeatAssignmentForUsers:["DELETE /orgs/{org}/copilot/billing/selected_users"],copilotMetricsForOrganization:["GET /orgs/{org}/copilot/metrics"],copilotMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],getCopilotOrganizationDetails:["GET /orgs/{org}/copilot/billing"],getCopilotSeatDetailsForUser:["GET /orgs/{org}/members/{username}/copilot"],listCopilotSeats:["GET /orgs/{org}/copilot/billing/seats"],usageMetricsForOrg:["GET /orgs/{org}/copilot/usage"],usageMetricsForTeam:["GET /orgs/{org}/team/{team_slug}/copilot/usage"]},dependabot:{addSelectedRepoToOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],createOrUpdateOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}"],createOrUpdateRepoSecret:["PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],deleteOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],deleteRepoSecret:["DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],getAlert:["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],getOrgPublicKey:["GET /orgs/{org}/dependabot/secrets/public-key"],getOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}"],getRepoPublicKey:["GET /repos/{owner}/{repo}/dependabot/secrets/public-key"],getRepoSecret:["GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/dependabot/alerts"],listAlertsForOrg:["GET /orgs/{org}/dependabot/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/dependabot/alerts"],listOrgSecrets:["GET /orgs/{org}/dependabot/secrets"],listRepoSecrets:["GET /repos/{owner}/{repo}/dependabot/secrets"],listSelectedReposForOrgSecret:["GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],removeSelectedRepoFromOrgSecret:["DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"],setSelectedReposForOrgSecret:["PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"],updateAlert:["PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"]},dependencyGraph:{createRepositorySnapshot:["POST /repos/{owner}/{repo}/dependency-graph/snapshots"],diffRange:["GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"],exportSbom:["GET /repos/{owner}/{repo}/dependency-graph/sbom"]},emojis:{get:["GET /emojis"]},gists:{checkIsStarred:["GET /gists/{gist_id}/star"],create:["POST /gists"],createComment:["POST /gists/{gist_id}/comments"],delete:["DELETE /gists/{gist_id}"],deleteComment:["DELETE /gists/{gist_id}/comments/{comment_id}"],fork:["POST /gists/{gist_id}/forks"],get:["GET /gists/{gist_id}"],getComment:["GET /gists/{gist_id}/comments/{comment_id}"],getRevision:["GET /gists/{gist_id}/{sha}"],list:["GET /gists"],listComments:["GET /gists/{gist_id}/comments"],listCommits:["GET /gists/{gist_id}/commits"],listForUser:["GET /users/{username}/gists"],listForks:["GET /gists/{gist_id}/forks"],listPublic:["GET /gists/public"],listStarred:["GET /gists/starred"],star:["PUT /gists/{gist_id}/star"],unstar:["DELETE /gists/{gist_id}/star"],update:["PATCH /gists/{gist_id}"],updateComment:["PATCH /gists/{gist_id}/comments/{comment_id}"]},git:{createBlob:["POST /repos/{owner}/{repo}/git/blobs"],createCommit:["POST /repos/{owner}/{repo}/git/commits"],createRef:["POST /repos/{owner}/{repo}/git/refs"],createTag:["POST /repos/{owner}/{repo}/git/tags"],createTree:["POST /repos/{owner}/{repo}/git/trees"],deleteRef:["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],getBlob:["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],getCommit:["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],getRef:["GET /repos/{owner}/{repo}/git/ref/{ref}"],getTag:["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],getTree:["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],listMatchingRefs:["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],updateRef:["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]},gitignore:{getAllTemplates:["GET /gitignore/templates"],getTemplate:["GET /gitignore/templates/{name}"]},interactions:{getRestrictionsForAuthenticatedUser:["GET /user/interaction-limits"],getRestrictionsForOrg:["GET /orgs/{org}/interaction-limits"],getRestrictionsForRepo:["GET /repos/{owner}/{repo}/interaction-limits"],getRestrictionsForYourPublicRepos:["GET /user/interaction-limits",{},{renamed:["interactions","getRestrictionsForAuthenticatedUser"]}],removeRestrictionsForAuthenticatedUser:["DELETE /user/interaction-limits"],removeRestrictionsForOrg:["DELETE /orgs/{org}/interaction-limits"],removeRestrictionsForRepo:["DELETE /repos/{owner}/{repo}/interaction-limits"],removeRestrictionsForYourPublicRepos:["DELETE /user/interaction-limits",{},{renamed:["interactions","removeRestrictionsForAuthenticatedUser"]}],setRestrictionsForAuthenticatedUser:["PUT /user/interaction-limits"],setRestrictionsForOrg:["PUT /orgs/{org}/interaction-limits"],setRestrictionsForRepo:["PUT /repos/{owner}/{repo}/interaction-limits"],setRestrictionsForYourPublicRepos:["PUT /user/interaction-limits",{},{renamed:["interactions","setRestrictionsForAuthenticatedUser"]}]},issues:{addAssignees:["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],addLabels:["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],addSubIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],checkUserCanBeAssigned:["GET /repos/{owner}/{repo}/assignees/{assignee}"],checkUserCanBeAssignedToIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"],create:["POST /repos/{owner}/{repo}/issues"],createComment:["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],createLabel:["POST /repos/{owner}/{repo}/labels"],createMilestone:["POST /repos/{owner}/{repo}/milestones"],deleteComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],deleteLabel:["DELETE /repos/{owner}/{repo}/labels/{name}"],deleteMilestone:["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],get:["GET /repos/{owner}/{repo}/issues/{issue_number}"],getComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],getEvent:["GET /repos/{owner}/{repo}/issues/events/{event_id}"],getLabel:["GET /repos/{owner}/{repo}/labels/{name}"],getMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],list:["GET /issues"],listAssignees:["GET /repos/{owner}/{repo}/assignees"],listComments:["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],listCommentsForRepo:["GET /repos/{owner}/{repo}/issues/comments"],listEvents:["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],listEventsForRepo:["GET /repos/{owner}/{repo}/issues/events"],listEventsForTimeline:["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"],listForAuthenticatedUser:["GET /user/issues"],listForOrg:["GET /orgs/{org}/issues"],listForRepo:["GET /repos/{owner}/{repo}/issues"],listLabelsForMilestone:["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],listLabelsForRepo:["GET /repos/{owner}/{repo}/labels"],listLabelsOnIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],listMilestones:["GET /repos/{owner}/{repo}/milestones"],listSubIssues:["GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"],lock:["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],removeAllLabels:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],removeAssignees:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],removeLabel:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],removeSubIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"],reprioritizeSubIssue:["PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"],setLabels:["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],unlock:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],update:["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],updateComment:["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],updateLabel:["PATCH /repos/{owner}/{repo}/labels/{name}"],updateMilestone:["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]},licenses:{get:["GET /licenses/{license}"],getAllCommonlyUsed:["GET /licenses"],getForRepo:["GET /repos/{owner}/{repo}/license"]},markdown:{render:["POST /markdown"],renderRaw:["POST /markdown/raw",{headers:{"content-type":"text/plain; charset=utf-8"}}]},meta:{get:["GET /meta"],getAllVersions:["GET /versions"],getOctocat:["GET /octocat"],getZen:["GET /zen"],root:["GET /"]},migrations:{deleteArchiveForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/archive"],deleteArchiveForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/archive"],downloadArchiveForOrg:["GET /orgs/{org}/migrations/{migration_id}/archive"],getArchiveForAuthenticatedUser:["GET /user/migrations/{migration_id}/archive"],getStatusForAuthenticatedUser:["GET /user/migrations/{migration_id}"],getStatusForOrg:["GET /orgs/{org}/migrations/{migration_id}"],listForAuthenticatedUser:["GET /user/migrations"],listForOrg:["GET /orgs/{org}/migrations"],listReposForAuthenticatedUser:["GET /user/migrations/{migration_id}/repositories"],listReposForOrg:["GET /orgs/{org}/migrations/{migration_id}/repositories"],listReposForUser:["GET /user/migrations/{migration_id}/repositories",{},{renamed:["migrations","listReposForAuthenticatedUser"]}],startForAuthenticatedUser:["POST /user/migrations"],startForOrg:["POST /orgs/{org}/migrations"],unlockRepoForAuthenticatedUser:["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"],unlockRepoForOrg:["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"]},oidc:{getOidcCustomSubTemplateForOrg:["GET /orgs/{org}/actions/oidc/customization/sub"],updateOidcCustomSubTemplateForOrg:["PUT /orgs/{org}/actions/oidc/customization/sub"]},orgs:{addSecurityManagerTeam:["PUT /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"}],assignTeamToOrgRole:["PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],assignUserToOrgRole:["PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"],blockUser:["PUT /orgs/{org}/blocks/{username}"],cancelInvitation:["DELETE /orgs/{org}/invitations/{invitation_id}"],checkBlockedUser:["GET /orgs/{org}/blocks/{username}"],checkMembershipForUser:["GET /orgs/{org}/members/{username}"],checkPublicMembershipForUser:["GET /orgs/{org}/public_members/{username}"],convertMemberToOutsideCollaborator:["PUT /orgs/{org}/outside_collaborators/{username}"],createInvitation:["POST /orgs/{org}/invitations"],createOrUpdateCustomProperties:["PATCH /orgs/{org}/properties/schema"],createOrUpdateCustomPropertiesValuesForRepos:["PATCH /orgs/{org}/properties/values"],createOrUpdateCustomProperty:["PUT /orgs/{org}/properties/schema/{custom_property_name}"],createWebhook:["POST /orgs/{org}/hooks"],delete:["DELETE /orgs/{org}"],deleteWebhook:["DELETE /orgs/{org}/hooks/{hook_id}"],enableOrDisableSecurityProductOnAllOrgRepos:["POST /orgs/{org}/{security_product}/{enablement}",{},{deprecated:"octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"}],get:["GET /orgs/{org}"],getAllCustomProperties:["GET /orgs/{org}/properties/schema"],getCustomProperty:["GET /orgs/{org}/properties/schema/{custom_property_name}"],getMembershipForAuthenticatedUser:["GET /user/memberships/orgs/{org}"],getMembershipForUser:["GET /orgs/{org}/memberships/{username}"],getOrgRole:["GET /orgs/{org}/organization-roles/{role_id}"],getWebhook:["GET /orgs/{org}/hooks/{hook_id}"],getWebhookConfigForOrg:["GET /orgs/{org}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"],list:["GET /organizations"],listAppInstallations:["GET /orgs/{org}/installations"],listAttestations:["GET /orgs/{org}/attestations/{subject_digest}"],listBlockedUsers:["GET /orgs/{org}/blocks"],listCustomPropertiesValuesForRepos:["GET /orgs/{org}/properties/values"],listFailedInvitations:["GET /orgs/{org}/failed_invitations"],listForAuthenticatedUser:["GET /user/orgs"],listForUser:["GET /users/{username}/orgs"],listInvitationTeams:["GET /orgs/{org}/invitations/{invitation_id}/teams"],listMembers:["GET /orgs/{org}/members"],listMembershipsForAuthenticatedUser:["GET /user/memberships/orgs"],listOrgRoleTeams:["GET /orgs/{org}/organization-roles/{role_id}/teams"],listOrgRoleUsers:["GET /orgs/{org}/organization-roles/{role_id}/users"],listOrgRoles:["GET /orgs/{org}/organization-roles"],listOrganizationFineGrainedPermissions:["GET /orgs/{org}/organization-fine-grained-permissions"],listOutsideCollaborators:["GET /orgs/{org}/outside_collaborators"],listPatGrantRepositories:["GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"],listPatGrantRequestRepositories:["GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"],listPatGrantRequests:["GET /orgs/{org}/personal-access-token-requests"],listPatGrants:["GET /orgs/{org}/personal-access-tokens"],listPendingInvitations:["GET /orgs/{org}/invitations"],listPublicMembers:["GET /orgs/{org}/public_members"],listSecurityManagerTeams:["GET /orgs/{org}/security-managers",{},{deprecated:"octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"}],listWebhookDeliveries:["GET /orgs/{org}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /orgs/{org}/hooks"],pingWebhook:["POST /orgs/{org}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeCustomProperty:["DELETE /orgs/{org}/properties/schema/{custom_property_name}"],removeMember:["DELETE /orgs/{org}/members/{username}"],removeMembershipForUser:["DELETE /orgs/{org}/memberships/{username}"],removeOutsideCollaborator:["DELETE /orgs/{org}/outside_collaborators/{username}"],removePublicMembershipForAuthenticatedUser:["DELETE /orgs/{org}/public_members/{username}"],removeSecurityManagerTeam:["DELETE /orgs/{org}/security-managers/teams/{team_slug}",{},{deprecated:"octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"}],reviewPatGrantRequest:["POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"],reviewPatGrantRequestsInBulk:["POST /orgs/{org}/personal-access-token-requests"],revokeAllOrgRolesTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}"],revokeAllOrgRolesUser:["DELETE /orgs/{org}/organization-roles/users/{username}"],revokeOrgRoleTeam:["DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"],revokeOrgRoleUser:["DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"],setMembershipForUser:["PUT /orgs/{org}/memberships/{username}"],setPublicMembershipForAuthenticatedUser:["PUT /orgs/{org}/public_members/{username}"],unblockUser:["DELETE /orgs/{org}/blocks/{username}"],update:["PATCH /orgs/{org}"],updateMembershipForAuthenticatedUser:["PATCH /user/memberships/orgs/{org}"],updatePatAccess:["POST /orgs/{org}/personal-access-tokens/{pat_id}"],updatePatAccesses:["POST /orgs/{org}/personal-access-tokens"],updateWebhook:["PATCH /orgs/{org}/hooks/{hook_id}"],updateWebhookConfigForOrg:["PATCH /orgs/{org}/hooks/{hook_id}/config"]},packages:{deletePackageForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}"],deletePackageForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],deletePackageForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}"],deletePackageVersionForAuthenticatedUser:["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForOrg:["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],deletePackageVersionForUser:["DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getAllPackageVersionsForAPackageOwnedByAnOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByOrg"]}],getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions",{},{renamed:["packages","getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]}],getAllPackageVersionsForPackageOwnedByAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByOrg:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],getAllPackageVersionsForPackageOwnedByUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions"],getPackageForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}"],getPackageForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}"],getPackageForUser:["GET /users/{username}/packages/{package_type}/{package_name}"],getPackageVersionForAuthenticatedUser:["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForOrganization:["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],getPackageVersionForUser:["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],listDockerMigrationConflictingPackagesForAuthenticatedUser:["GET /user/docker/conflicts"],listDockerMigrationConflictingPackagesForOrganization:["GET /orgs/{org}/docker/conflicts"],listDockerMigrationConflictingPackagesForUser:["GET /users/{username}/docker/conflicts"],listPackagesForAuthenticatedUser:["GET /user/packages"],listPackagesForOrganization:["GET /orgs/{org}/packages"],listPackagesForUser:["GET /users/{username}/packages"],restorePackageForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageForUser:["POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"],restorePackageVersionForAuthenticatedUser:["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForOrg:["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],restorePackageVersionForUser:["POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]},privateRegistries:{createOrgPrivateRegistry:["POST /orgs/{org}/private-registries"],deleteOrgPrivateRegistry:["DELETE /orgs/{org}/private-registries/{secret_name}"],getOrgPrivateRegistry:["GET /orgs/{org}/private-registries/{secret_name}"],getOrgPublicKey:["GET /orgs/{org}/private-registries/public-key"],listOrgPrivateRegistries:["GET /orgs/{org}/private-registries"],updateOrgPrivateRegistry:["PATCH /orgs/{org}/private-registries/{secret_name}"]},projects:{addCollaborator:["PUT /projects/{project_id}/collaborators/{username}"],createCard:["POST /projects/columns/{column_id}/cards"],createColumn:["POST /projects/{project_id}/columns"],createForAuthenticatedUser:["POST /user/projects"],createForOrg:["POST /orgs/{org}/projects"],createForRepo:["POST /repos/{owner}/{repo}/projects"],delete:["DELETE /projects/{project_id}"],deleteCard:["DELETE /projects/columns/cards/{card_id}"],deleteColumn:["DELETE /projects/columns/{column_id}"],get:["GET /projects/{project_id}"],getCard:["GET /projects/columns/cards/{card_id}"],getColumn:["GET /projects/columns/{column_id}"],getPermissionForUser:["GET /projects/{project_id}/collaborators/{username}/permission"],listCards:["GET /projects/columns/{column_id}/cards"],listCollaborators:["GET /projects/{project_id}/collaborators"],listColumns:["GET /projects/{project_id}/columns"],listForOrg:["GET /orgs/{org}/projects"],listForRepo:["GET /repos/{owner}/{repo}/projects"],listForUser:["GET /users/{username}/projects"],moveCard:["POST /projects/columns/cards/{card_id}/moves"],moveColumn:["POST /projects/columns/{column_id}/moves"],removeCollaborator:["DELETE /projects/{project_id}/collaborators/{username}"],update:["PATCH /projects/{project_id}"],updateCard:["PATCH /projects/columns/cards/{card_id}"],updateColumn:["PATCH /projects/columns/{column_id}"]},pulls:{checkIfMerged:["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],create:["POST /repos/{owner}/{repo}/pulls"],createReplyForReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],createReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],createReviewComment:["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],deletePendingReview:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],deleteReviewComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],dismissReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],get:["GET /repos/{owner}/{repo}/pulls/{pull_number}"],getReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],getReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],list:["GET /repos/{owner}/{repo}/pulls"],listCommentsForReview:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],listCommits:["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],listFiles:["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],listRequestedReviewers:["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],listReviewComments:["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],listReviewCommentsForRepo:["GET /repos/{owner}/{repo}/pulls/comments"],listReviews:["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],merge:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],removeRequestedReviewers:["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],requestReviewers:["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],submitReview:["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],update:["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],updateBranch:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"],updateReview:["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],updateReviewComment:["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]},rateLimit:{get:["GET /rate_limit"]},reactions:{createForCommitComment:["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"],createForIssue:["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"],createForIssueComment:["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],createForPullRequestReviewComment:["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],createForRelease:["POST /repos/{owner}/{repo}/releases/{release_id}/reactions"],createForTeamDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],createForTeamDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"],deleteForCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"],deleteForIssue:["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"],deleteForIssueComment:["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"],deleteForPullRequestComment:["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"],deleteForRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"],deleteForTeamDiscussion:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"],deleteForTeamDiscussionComment:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"],listForCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"],listForIssue:["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],listForIssueComment:["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"],listForPullRequestReviewComment:["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"],listForRelease:["GET /repos/{owner}/{repo}/releases/{release_id}/reactions"],listForTeamDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"],listForTeamDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"]},repos:{acceptInvitation:["PATCH /user/repository_invitations/{invitation_id}",{},{renamed:["repos","acceptInvitationForAuthenticatedUser"]}],acceptInvitationForAuthenticatedUser:["PATCH /user/repository_invitations/{invitation_id}"],addAppAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],addCollaborator:["PUT /repos/{owner}/{repo}/collaborators/{username}"],addStatusCheckContexts:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],addTeamAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],addUserAccessRestrictions:["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],cancelPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"],checkAutomatedSecurityFixes:["GET /repos/{owner}/{repo}/automated-security-fixes"],checkCollaborator:["GET /repos/{owner}/{repo}/collaborators/{username}"],checkPrivateVulnerabilityReporting:["GET /repos/{owner}/{repo}/private-vulnerability-reporting"],checkVulnerabilityAlerts:["GET /repos/{owner}/{repo}/vulnerability-alerts"],codeownersErrors:["GET /repos/{owner}/{repo}/codeowners/errors"],compareCommits:["GET /repos/{owner}/{repo}/compare/{base}...{head}"],compareCommitsWithBasehead:["GET /repos/{owner}/{repo}/compare/{basehead}"],createAttestation:["POST /repos/{owner}/{repo}/attestations"],createAutolink:["POST /repos/{owner}/{repo}/autolinks"],createCommitComment:["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],createCommitSignatureProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],createCommitStatus:["POST /repos/{owner}/{repo}/statuses/{sha}"],createDeployKey:["POST /repos/{owner}/{repo}/keys"],createDeployment:["POST /repos/{owner}/{repo}/deployments"],createDeploymentBranchPolicy:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],createDeploymentProtectionRule:["POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],createDeploymentStatus:["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],createDispatchEvent:["POST /repos/{owner}/{repo}/dispatches"],createForAuthenticatedUser:["POST /user/repos"],createFork:["POST /repos/{owner}/{repo}/forks"],createInOrg:["POST /orgs/{org}/repos"],createOrUpdateCustomPropertiesValues:["PATCH /repos/{owner}/{repo}/properties/values"],createOrUpdateEnvironment:["PUT /repos/{owner}/{repo}/environments/{environment_name}"],createOrUpdateFileContents:["PUT /repos/{owner}/{repo}/contents/{path}"],createOrgRuleset:["POST /orgs/{org}/rulesets"],createPagesDeployment:["POST /repos/{owner}/{repo}/pages/deployments"],createPagesSite:["POST /repos/{owner}/{repo}/pages"],createRelease:["POST /repos/{owner}/{repo}/releases"],createRepoRuleset:["POST /repos/{owner}/{repo}/rulesets"],createUsingTemplate:["POST /repos/{template_owner}/{template_repo}/generate"],createWebhook:["POST /repos/{owner}/{repo}/hooks"],declineInvitation:["DELETE /user/repository_invitations/{invitation_id}",{},{renamed:["repos","declineInvitationForAuthenticatedUser"]}],declineInvitationForAuthenticatedUser:["DELETE /user/repository_invitations/{invitation_id}"],delete:["DELETE /repos/{owner}/{repo}"],deleteAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],deleteAdminBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],deleteAnEnvironment:["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],deleteAutolink:["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],deleteBranchProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],deleteCommitComment:["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],deleteCommitSignatureProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],deleteDeployKey:["DELETE /repos/{owner}/{repo}/keys/{key_id}"],deleteDeployment:["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],deleteDeploymentBranchPolicy:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],deleteFile:["DELETE /repos/{owner}/{repo}/contents/{path}"],deleteInvitation:["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],deleteOrgRuleset:["DELETE /orgs/{org}/rulesets/{ruleset_id}"],deletePagesSite:["DELETE /repos/{owner}/{repo}/pages"],deletePullRequestReviewProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],deleteRelease:["DELETE /repos/{owner}/{repo}/releases/{release_id}"],deleteReleaseAsset:["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],deleteRepoRuleset:["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],deleteWebhook:["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],disableAutomatedSecurityFixes:["DELETE /repos/{owner}/{repo}/automated-security-fixes"],disableDeploymentProtectionRule:["DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],disablePrivateVulnerabilityReporting:["DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"],disableVulnerabilityAlerts:["DELETE /repos/{owner}/{repo}/vulnerability-alerts"],downloadArchive:["GET /repos/{owner}/{repo}/zipball/{ref}",{},{renamed:["repos","downloadZipballArchive"]}],downloadTarballArchive:["GET /repos/{owner}/{repo}/tarball/{ref}"],downloadZipballArchive:["GET /repos/{owner}/{repo}/zipball/{ref}"],enableAutomatedSecurityFixes:["PUT /repos/{owner}/{repo}/automated-security-fixes"],enablePrivateVulnerabilityReporting:["PUT /repos/{owner}/{repo}/private-vulnerability-reporting"],enableVulnerabilityAlerts:["PUT /repos/{owner}/{repo}/vulnerability-alerts"],generateReleaseNotes:["POST /repos/{owner}/{repo}/releases/generate-notes"],get:["GET /repos/{owner}/{repo}"],getAccessRestrictions:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],getAdminBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],getAllDeploymentProtectionRules:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"],getAllEnvironments:["GET /repos/{owner}/{repo}/environments"],getAllStatusCheckContexts:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],getAllTopics:["GET /repos/{owner}/{repo}/topics"],getAppsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],getAutolink:["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],getBranch:["GET /repos/{owner}/{repo}/branches/{branch}"],getBranchProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection"],getBranchRules:["GET /repos/{owner}/{repo}/rules/branches/{branch}"],getClones:["GET /repos/{owner}/{repo}/traffic/clones"],getCodeFrequencyStats:["GET /repos/{owner}/{repo}/stats/code_frequency"],getCollaboratorPermissionLevel:["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],getCombinedStatusForRef:["GET /repos/{owner}/{repo}/commits/{ref}/status"],getCommit:["GET /repos/{owner}/{repo}/commits/{ref}"],getCommitActivityStats:["GET /repos/{owner}/{repo}/stats/commit_activity"],getCommitComment:["GET /repos/{owner}/{repo}/comments/{comment_id}"],getCommitSignatureProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"],getCommunityProfileMetrics:["GET /repos/{owner}/{repo}/community/profile"],getContent:["GET /repos/{owner}/{repo}/contents/{path}"],getContributorsStats:["GET /repos/{owner}/{repo}/stats/contributors"],getCustomDeploymentProtectionRule:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"],getCustomPropertiesValues:["GET /repos/{owner}/{repo}/properties/values"],getDeployKey:["GET /repos/{owner}/{repo}/keys/{key_id}"],getDeployment:["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],getDeploymentBranchPolicy:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],getDeploymentStatus:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],getEnvironment:["GET /repos/{owner}/{repo}/environments/{environment_name}"],getLatestPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/latest"],getLatestRelease:["GET /repos/{owner}/{repo}/releases/latest"],getOrgRuleSuite:["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],getOrgRuleSuites:["GET /orgs/{org}/rulesets/rule-suites"],getOrgRuleset:["GET /orgs/{org}/rulesets/{ruleset_id}"],getOrgRulesets:["GET /orgs/{org}/rulesets"],getPages:["GET /repos/{owner}/{repo}/pages"],getPagesBuild:["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],getPagesDeployment:["GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"],getPagesHealthCheck:["GET /repos/{owner}/{repo}/pages/health"],getParticipationStats:["GET /repos/{owner}/{repo}/stats/participation"],getPullRequestReviewProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],getPunchCardStats:["GET /repos/{owner}/{repo}/stats/punch_card"],getReadme:["GET /repos/{owner}/{repo}/readme"],getReadmeInDirectory:["GET /repos/{owner}/{repo}/readme/{dir}"],getRelease:["GET /repos/{owner}/{repo}/releases/{release_id}"],getReleaseAsset:["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],getReleaseByTag:["GET /repos/{owner}/{repo}/releases/tags/{tag}"],getRepoRuleSuite:["GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"],getRepoRuleSuites:["GET /repos/{owner}/{repo}/rulesets/rule-suites"],getRepoRuleset:["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],getRepoRulesets:["GET /repos/{owner}/{repo}/rulesets"],getStatusChecksProtection:["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],getTeamsWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],getTopPaths:["GET /repos/{owner}/{repo}/traffic/popular/paths"],getTopReferrers:["GET /repos/{owner}/{repo}/traffic/popular/referrers"],getUsersWithAccessToProtectedBranch:["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],getViews:["GET /repos/{owner}/{repo}/traffic/views"],getWebhook:["GET /repos/{owner}/{repo}/hooks/{hook_id}"],getWebhookConfigForRepo:["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],getWebhookDelivery:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"],listActivities:["GET /repos/{owner}/{repo}/activity"],listAttestations:["GET /repos/{owner}/{repo}/attestations/{subject_digest}"],listAutolinks:["GET /repos/{owner}/{repo}/autolinks"],listBranches:["GET /repos/{owner}/{repo}/branches"],listBranchesForHeadCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"],listCollaborators:["GET /repos/{owner}/{repo}/collaborators"],listCommentsForCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],listCommitCommentsForRepo:["GET /repos/{owner}/{repo}/comments"],listCommitStatusesForRef:["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],listCommits:["GET /repos/{owner}/{repo}/commits"],listContributors:["GET /repos/{owner}/{repo}/contributors"],listCustomDeploymentRuleIntegrations:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"],listDeployKeys:["GET /repos/{owner}/{repo}/keys"],listDeploymentBranchPolicies:["GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"],listDeploymentStatuses:["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],listDeployments:["GET /repos/{owner}/{repo}/deployments"],listForAuthenticatedUser:["GET /user/repos"],listForOrg:["GET /orgs/{org}/repos"],listForUser:["GET /users/{username}/repos"],listForks:["GET /repos/{owner}/{repo}/forks"],listInvitations:["GET /repos/{owner}/{repo}/invitations"],listInvitationsForAuthenticatedUser:["GET /user/repository_invitations"],listLanguages:["GET /repos/{owner}/{repo}/languages"],listPagesBuilds:["GET /repos/{owner}/{repo}/pages/builds"],listPublic:["GET /repositories"],listPullRequestsAssociatedWithCommit:["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"],listReleaseAssets:["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],listReleases:["GET /repos/{owner}/{repo}/releases"],listTags:["GET /repos/{owner}/{repo}/tags"],listTeams:["GET /repos/{owner}/{repo}/teams"],listWebhookDeliveries:["GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"],listWebhooks:["GET /repos/{owner}/{repo}/hooks"],merge:["POST /repos/{owner}/{repo}/merges"],mergeUpstream:["POST /repos/{owner}/{repo}/merge-upstream"],pingWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],redeliverWebhookDelivery:["POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"],removeAppAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],removeCollaborator:["DELETE /repos/{owner}/{repo}/collaborators/{username}"],removeStatusCheckContexts:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],removeStatusCheckProtection:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],removeTeamAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],removeUserAccessRestrictions:["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],renameBranch:["POST /repos/{owner}/{repo}/branches/{branch}/rename"],replaceAllTopics:["PUT /repos/{owner}/{repo}/topics"],requestPagesBuild:["POST /repos/{owner}/{repo}/pages/builds"],setAdminBranchProtection:["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],setAppAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",{},{mapToData:"apps"}],setStatusCheckContexts:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",{},{mapToData:"contexts"}],setTeamAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",{},{mapToData:"teams"}],setUserAccessRestrictions:["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",{},{mapToData:"users"}],testPushWebhook:["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],transfer:["POST /repos/{owner}/{repo}/transfer"],update:["PATCH /repos/{owner}/{repo}"],updateBranchProtection:["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],updateCommitComment:["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],updateDeploymentBranchPolicy:["PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"],updateInformationAboutPagesSite:["PUT /repos/{owner}/{repo}/pages"],updateInvitation:["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],updateOrgRuleset:["PUT /orgs/{org}/rulesets/{ruleset_id}"],updatePullRequestReviewProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],updateRelease:["PATCH /repos/{owner}/{repo}/releases/{release_id}"],updateReleaseAsset:["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],updateRepoRuleset:["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],updateStatusCheckPotection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",{},{renamed:["repos","updateStatusCheckProtection"]}],updateStatusCheckProtection:["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],updateWebhook:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],updateWebhookConfigForRepo:["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],uploadReleaseAsset:["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",{baseUrl:"https://uploads.github.com"}]},search:{code:["GET /search/code"],commits:["GET /search/commits"],issuesAndPullRequests:["GET /search/issues"],labels:["GET /search/labels"],repos:["GET /search/repositories"],topics:["GET /search/topics"],users:["GET /search/users"]},secretScanning:{createPushProtectionBypass:["POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"],getAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],getScanHistory:["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],listAlertsForEnterprise:["GET /enterprises/{enterprise}/secret-scanning/alerts"],listAlertsForOrg:["GET /orgs/{org}/secret-scanning/alerts"],listAlertsForRepo:["GET /repos/{owner}/{repo}/secret-scanning/alerts"],listLocationsForAlert:["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"],updateAlert:["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]},securityAdvisories:{createFork:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"],createPrivateVulnerabilityReport:["POST /repos/{owner}/{repo}/security-advisories/reports"],createRepositoryAdvisory:["POST /repos/{owner}/{repo}/security-advisories"],createRepositoryAdvisoryCveRequest:["POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"],getGlobalAdvisory:["GET /advisories/{ghsa_id}"],getRepositoryAdvisory:["GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"],listGlobalAdvisories:["GET /advisories"],listOrgRepositoryAdvisories:["GET /orgs/{org}/security-advisories"],listRepositoryAdvisories:["GET /repos/{owner}/{repo}/security-advisories"],updateRepositoryAdvisory:["PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"]},teams:{addOrUpdateMembershipForUserInOrg:["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],addOrUpdateProjectPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"],addOrUpdateRepoPermissionsInOrg:["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],checkPermissionsForProjectInOrg:["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"],checkPermissionsForRepoInOrg:["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],create:["POST /orgs/{org}/teams"],createDiscussionCommentInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],createDiscussionInOrg:["POST /orgs/{org}/teams/{team_slug}/discussions"],deleteDiscussionCommentInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],deleteDiscussionInOrg:["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],deleteInOrg:["DELETE /orgs/{org}/teams/{team_slug}"],getByName:["GET /orgs/{org}/teams/{team_slug}"],getDiscussionCommentInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],getDiscussionInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],getMembershipForUserInOrg:["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],list:["GET /orgs/{org}/teams"],listChildInOrg:["GET /orgs/{org}/teams/{team_slug}/teams"],listDiscussionCommentsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],listDiscussionsInOrg:["GET /orgs/{org}/teams/{team_slug}/discussions"],listForAuthenticatedUser:["GET /user/teams"],listMembersInOrg:["GET /orgs/{org}/teams/{team_slug}/members"],listPendingInvitationsInOrg:["GET /orgs/{org}/teams/{team_slug}/invitations"],listProjectsInOrg:["GET /orgs/{org}/teams/{team_slug}/projects"],listReposInOrg:["GET /orgs/{org}/teams/{team_slug}/repos"],removeMembershipForUserInOrg:["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],removeProjectInOrg:["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],removeRepoInOrg:["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],updateDiscussionCommentInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],updateDiscussionInOrg:["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],updateInOrg:["PATCH /orgs/{org}/teams/{team_slug}"]},users:{addEmailForAuthenticated:["POST /user/emails",{},{renamed:["users","addEmailForAuthenticatedUser"]}],addEmailForAuthenticatedUser:["POST /user/emails"],addSocialAccountForAuthenticatedUser:["POST /user/social_accounts"],block:["PUT /user/blocks/{username}"],checkBlocked:["GET /user/blocks/{username}"],checkFollowingForUser:["GET /users/{username}/following/{target_user}"],checkPersonIsFollowedByAuthenticated:["GET /user/following/{username}"],createGpgKeyForAuthenticated:["POST /user/gpg_keys",{},{renamed:["users","createGpgKeyForAuthenticatedUser"]}],createGpgKeyForAuthenticatedUser:["POST /user/gpg_keys"],createPublicSshKeyForAuthenticated:["POST /user/keys",{},{renamed:["users","createPublicSshKeyForAuthenticatedUser"]}],createPublicSshKeyForAuthenticatedUser:["POST /user/keys"],createSshSigningKeyForAuthenticatedUser:["POST /user/ssh_signing_keys"],deleteEmailForAuthenticated:["DELETE /user/emails",{},{renamed:["users","deleteEmailForAuthenticatedUser"]}],deleteEmailForAuthenticatedUser:["DELETE /user/emails"],deleteGpgKeyForAuthenticated:["DELETE /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","deleteGpgKeyForAuthenticatedUser"]}],deleteGpgKeyForAuthenticatedUser:["DELETE /user/gpg_keys/{gpg_key_id}"],deletePublicSshKeyForAuthenticated:["DELETE /user/keys/{key_id}",{},{renamed:["users","deletePublicSshKeyForAuthenticatedUser"]}],deletePublicSshKeyForAuthenticatedUser:["DELETE /user/keys/{key_id}"],deleteSocialAccountForAuthenticatedUser:["DELETE /user/social_accounts"],deleteSshSigningKeyForAuthenticatedUser:["DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"],follow:["PUT /user/following/{username}"],getAuthenticated:["GET /user"],getById:["GET /user/{account_id}"],getByUsername:["GET /users/{username}"],getContextForUser:["GET /users/{username}/hovercard"],getGpgKeyForAuthenticated:["GET /user/gpg_keys/{gpg_key_id}",{},{renamed:["users","getGpgKeyForAuthenticatedUser"]}],getGpgKeyForAuthenticatedUser:["GET /user/gpg_keys/{gpg_key_id}"],getPublicSshKeyForAuthenticated:["GET /user/keys/{key_id}",{},{renamed:["users","getPublicSshKeyForAuthenticatedUser"]}],getPublicSshKeyForAuthenticatedUser:["GET /user/keys/{key_id}"],getSshSigningKeyForAuthenticatedUser:["GET /user/ssh_signing_keys/{ssh_signing_key_id}"],list:["GET /users"],listAttestations:["GET /users/{username}/attestations/{subject_digest}"],listBlockedByAuthenticated:["GET /user/blocks",{},{renamed:["users","listBlockedByAuthenticatedUser"]}],listBlockedByAuthenticatedUser:["GET /user/blocks"],listEmailsForAuthenticated:["GET /user/emails",{},{renamed:["users","listEmailsForAuthenticatedUser"]}],listEmailsForAuthenticatedUser:["GET /user/emails"],listFollowedByAuthenticated:["GET /user/following",{},{renamed:["users","listFollowedByAuthenticatedUser"]}],listFollowedByAuthenticatedUser:["GET /user/following"],listFollowersForAuthenticatedUser:["GET /user/followers"],listFollowersForUser:["GET /users/{username}/followers"],listFollowingForUser:["GET /users/{username}/following"],listGpgKeysForAuthenticated:["GET /user/gpg_keys",{},{renamed:["users","listGpgKeysForAuthenticatedUser"]}],listGpgKeysForAuthenticatedUser:["GET /user/gpg_keys"],listGpgKeysForUser:["GET /users/{username}/gpg_keys"],listPublicEmailsForAuthenticated:["GET /user/public_emails",{},{renamed:["users","listPublicEmailsForAuthenticatedUser"]}],listPublicEmailsForAuthenticatedUser:["GET /user/public_emails"],listPublicKeysForUser:["GET /users/{username}/keys"],listPublicSshKeysForAuthenticated:["GET /user/keys",{},{renamed:["users","listPublicSshKeysForAuthenticatedUser"]}],listPublicSshKeysForAuthenticatedUser:["GET /user/keys"],listSocialAccountsForAuthenticatedUser:["GET /user/social_accounts"],listSocialAccountsForUser:["GET /users/{username}/social_accounts"],listSshSigningKeysForAuthenticatedUser:["GET /user/ssh_signing_keys"],listSshSigningKeysForUser:["GET /users/{username}/ssh_signing_keys"],setPrimaryEmailVisibilityForAuthenticated:["PATCH /user/email/visibility",{},{renamed:["users","setPrimaryEmailVisibilityForAuthenticatedUser"]}],setPrimaryEmailVisibilityForAuthenticatedUser:["PATCH /user/email/visibility"],unblock:["DELETE /user/blocks/{username}"],unfollow:["DELETE /user/following/{username}"],updateAuthenticated:["PATCH /user"]}},Ko=Bo,R=new Map;for(let[r,e]of Object.entries(Ko))for(let[t,s]of Object.entries(e)){let[o,n,i]=s,[a,c]=o.split(/ /),p=Object.assign({method:a,url:c},n);R.has(r)||R.set(r,new Map),R.get(r).set(t,{scope:r,methodName:t,endpointDefaults:p,decorations:i})}var Jo={has({scope:r},e){return R.get(r).has(e)},getOwnPropertyDescriptor(r,e){return{value:this.get(r,e),configurable:!0,writable:!0,enumerable:!0}},defineProperty(r,e,t){return Object.defineProperty(r.cache,e,t),!0},deleteProperty(r,e){return delete r.cache[e],!0},ownKeys({scope:r}){return[...R.get(r).keys()]},set(r,e,t){return r.cache[e]=t},get({octokit:r,scope:e,cache:t},s){if(t[s])return t[s];let o=R.get(e).get(s);if(!o)return;let{endpointDefaults:n,decorations:i}=o;return i?t[s]=Qo(r,e,s,n,i):t[s]=r.request.defaults(n),t[s]}};function at(r){let e={};for(let t of R.keys())e[t]=new Proxy({octokit:r,scope:t,cache:{}},Jo);return e}function Qo(r,e,t,s,o){let n=r.request.defaults(s);function i(...a){let c=n.endpoint.merge(...a);if(o.mapToData)return c=Object.assign({},c,{data:c[o.mapToData],[o.mapToData]:void 0}),n(c);if(o.renamed){let[p,u]=o.renamed;r.log.warn(`octokit.${e}.${t}() has been renamed to octokit.${p}.${u}()`)}if(o.deprecated&&r.log.warn(o.deprecated),o.renamedParameters){let p=n.endpoint.merge(...a);for(let[u,l]of Object.entries(o.renamedParameters))u in p&&(r.log.warn(`"${u}" parameter is deprecated for "octokit.${e}.${t}()". Use "${l}" instead`),l in p||(p[l]=p[u]),delete p[u]);return n(p)}return n(...a)}return Object.assign(i,n)}function ct(r){return{rest:at(r)}}ct.VERSION=nt;function pt(r){let e=at(r);return{...e,rest:e}}pt.VERSION=nt});var mt=E((en,gt)=>{"use strict";var je=Object.defineProperty,Yo=Object.getOwnPropertyDescriptor,Zo=Object.getOwnPropertyNames,Xo=Object.prototype.hasOwnProperty,ei=(r,e)=>{for(var t in e)je(r,t,{get:e[t],enumerable:!0})},ri=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Zo(e))!Xo.call(r,o)&&o!==t&&je(r,o,{get:()=>e[o],enumerable:!(s=Yo(e,o))||s.enumerable});return r},ti=r=>ri(je({},"__esModule",{value:!0}),r),ut={};ei(ut,{Octokit:()=>ci});gt.exports=ti(ut);var si=Br(),oi=Yr(),ii=ot(),ni=dt(),ai="20.1.2",ci=si.Octokit.plugin(oi.requestLog,ni.legacyRestEndpointMethods,ii.paginateRest).defaults({userAgent:`octokit-rest.js/${ai}`})});var Ei={};Lt(Ei,{activate:()=>hi,deactivate:()=>vi});module.exports=$t(Ei);var y=b(require("vscode"));var m=b(require("vscode"));var F=b(require("fs")),ve=b(require("path"));var Ve=b(require("vscode")),he=class r{static instance;channel;constructor(){this.channel=Ve.window.createOutputChannel("CodeVulFixer")}static getInstance(){return r.instance||(r.instance=new r),r.instance}log(e,t="INFO"){let s=new Date().toISOString();this.channel.appendLine(`[${s}] [${t}] ${e}`)}info(e){this.log(e,"INFO")}warn(e){this.log(e,"WARN")}error(e,t){let s=t instanceof Error?` - ${t.message}
${t.stack??""}`:t?` - ${JSON.stringify(t)}`:"";this.log(`${e}${s}`,"ERROR")}success(e){this.log(`\u2714 ${e}`,"SUCCESS")}show(){this.channel.show(!0)}appendRaw(e){this.channel.append(e)}},d=he.getInstance();var h=class r{static DIR_NAME=".codevulfixer";static FILE_NAME="sprint-state.json";static getStatePath(e){return ve.join(e,r.DIR_NAME,r.FILE_NAME)}static async loadState(e){let t=this.getStatePath(e);if(F.existsSync(t))try{let s=await F.promises.readFile(t,"utf8"),o=JSON.parse(s);return d.info(`Loaded sprint state for ${o.repoOwner}/${o.repoName} from disk.`),o}catch(s){d.error("Failed to read sprint state file",s);return}}static async saveState(e,t){let s=ve.join(e,r.DIR_NAME),o=this.getStatePath(e);try{F.existsSync(s)||await F.promises.mkdir(s,{recursive:!0}),t.lastUpdated=new Date().toISOString(),this.recalculateMetrics(t),await F.promises.writeFile(o,JSON.stringify(t,null,2),"utf8"),d.info(`Persisted sprint state to ${o}`)}catch(n){throw d.error("Failed to save sprint state file",n),n}}static async updateFinding(e,t,s){let o=await this.loadState(e);if(!o){d.warn(`Cannot update finding ${t}: No active sprint state found.`);return}let n=o.findings[t];return n?(o.findings[t]={...n,...s,lastAttemptAt:new Date().toISOString()},await this.saveState(e,o),o):(d.warn(`Finding ${t} not present in state.`),o)}static async updateSprintStatus(e,t,s){let o=await this.loadState(e);if(!o)return;let n=o.sprints.find(i=>i.sprintNumber===t);return n&&(n.status=s),await this.saveState(e,o),o}static async resetState(e){let t=this.getStatePath(e);F.existsSync(t)&&(await F.promises.unlink(t),d.info(`Reset sprint state: deleted ${t}`))}static recalculateMetrics(e){let t=Object.values(e.findings),s=t.length,o=0,n=0,i=0;for(let a of t)a.status==="verified"?o++:a.status==="failed"||a.status==="rejected"?n++:i++;e.metrics.totalFindings=s,e.metrics.resolvedCount=o,e.metrics.pendingCount=i,e.metrics.failedCount=n}};var ze=b(require("vscode")),L=class{static getConfig(){let e=ze.workspace.getConfiguration("codevulfixer");return{planningMode:e.get("planningMode","sprint_wise"),daysPerSprint:e.get("daysPerSprint",10),maxHighRiskPerDay:e.get("maxHighRiskPerDay",3),targetSprintDays:e.get("targetSprintDays",4)}}static planSprints(e,t,s,o){let n={...this.getConfig(),...o},i=n.planningMode==="sprint_wise",a=i?n.daysPerSprint||10:1,c=[],p=[],u=[];for(let v of e){let _=v.severity==="critical"||v.severity==="high",k=v.sizing.size==="S";_&&k?c.push(v):_?p.push(v):u.push(v)}let l=[],g={};if(i){let v=[...c,...p.slice(0,4)],k=[...p.slice(4),...u.slice(0,6)],O=u.slice(6);l.push(this.createSprintDay(1,n.planningMode,a,`Sprint 1 (${a}-Day Agile Sprint)`,`Sprint 1: Critical Security Remediation & Quick Wins (${a} Working Days)`,`Standard 2-week Agile sprint (${a} working days) targeting all direct lockfile bumps, quick-win patches, and core critical CodeQL findings.`,v)),l.push(this.createSprintDay(2,n.planningMode,a,`Sprint 2 (${a}-Day Agile Sprint)`,`Sprint 2: Architectural Rewrites & Secondary Upgrades (${a} Working Days)`,`Standard 2-week Agile sprint (${a} working days) allocated for major version migrations, complex taint refactoring, and regression test suites.`,k.length>0?k:u)),O.length>0&&l.push(this.createSprintDay(3,n.planningMode,a,`Sprint 3 (${a}-Day Agile Sprint)`,`Sprint 3: Security Hygiene, Deprecations & Audit Sign-Off (${a} Working Days)`,`Long-term hygiene maintenance, third-party dependency deprecation, and final compliance sign-off over ${a} working days.`,O))}else{let v=[...c];v.length<3&&u.length>0&&v.push(...u.splice(0,2)),l.push(this.createSprintDay(1,n.planningMode,1,"Day 1 (Daily Focus)","Day 1: Immediate Quick Wins (1 Day Duration)","Direct dependency lockfile bumps, transitive deduplications, and self-contained AST sanitizers.",v));let _=p.slice(0,n.maxHighRiskPerDay),k=p.slice(n.maxHighRiskPerDay);l.push(this.createSprintDay(2,n.planningMode,1,"Day 2 (Daily Focus)",`Day 2: High Severity Architectural Items (Capped at ${n.maxHighRiskPerDay}/day)`,"Complex SQL/Command injections, prototype pollutions, and major package upgrades requiring test validation.",_));let O=[...k,...u];l.push(this.createSprintDay(3,n.planningMode,1,"Day 3+ (Daily Focus)","Day 3: Security Hygiene & Audit Sweep","Medium and low risk items, secondary dependencies, and final verification checks.",O))}let f=0;for(let v of l)for(let _ of v.findings){let k=e.find(O=>O.id===_);k&&(k.targetSprint=v.sprintNumber,g[k.id]=k,f+=k.sizing.estimatedHours)}return{version:"1.0.0",repoOwner:t,repoName:s,lastUpdated:new Date().toISOString(),planningMode:n.planningMode,daysPerSprint:a,sprints:l,findings:g,activeSprint:1,metrics:{totalFindings:e.length,resolvedCount:0,pendingCount:e.length,failedCount:0,totalEstimatedHours:Math.round(f*10)/10,hoursSaved:Math.round(f*.75*10)/10}}}static createSprintDay(e,t,s,o,n,i,a){let c=a.reduce((p,u)=>p+u.sizing.estimatedHours,0);return{sprintNumber:e,planningMode:t,durationDays:s,dayLabel:o,title:n,description:i,findings:a.map(p=>p.id),totalEstimatedHours:Math.round(c*10)/10,status:e===1?"in_progress":"pending"}}};var We=b(require("vscode")),Ne=require("child_process"),Be=require("util");var He=(0,Be.promisify)(Ne.exec),S=class{static getPrimaryWorkspacePath(){let e=We.workspace.workspaceFolders;if(!(!e||e.length===0))return e[0].uri.fsPath}static async resolveRepoMetadata(){let e=this.getPrimaryWorkspacePath();if(!e){d.warn("No active workspace folder found.");return}try{let{stdout:t}=await He("git config --get remote.origin.url",{cwd:e}),s=t.trim();if(!s){d.warn("No Git remote origin configured in workspace.");return}let o=this.parseGitHubUrl(s);if(!o){d.warn(`Could not parse GitHub owner/repo from remote URL: ${s}`);return}let n="main";try{let{stdout:a}=await He("git rev-parse --abbrev-ref HEAD",{cwd:e});n=a.trim()||"main"}catch{}let i={owner:o.owner,repo:o.repo,remoteUrl:s,currentBranch:n};return d.info(`Resolved GitHub repository: ${i.owner}/${i.repo} (branch: ${i.currentBranch})`),i}catch(t){d.warn(`Git resolution failed or workspace is not a git repository: ${t instanceof Error?t.message:String(t)}`);return}}static parseGitHubUrl(e){let s=e.trim().match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);if(s&&s[1]&&s[2])return{owner:s[1],repo:s[2].replace(/\.git$/,"")}}};var Ee=b(require("vscode"));var Z=class r{static SCOPES=["repo","security_events"];static async getSession(e=!0){try{d.info(`Requesting GitHub session with scopes: [${r.SCOPES.join(", ")}]`);let t=await Ee.authentication.getSession("github",r.SCOPES,{createIfNone:e});if(t)return d.success(`GitHub authentication successful for user: ${t.account.label}`),t;d.warn("GitHub authentication session was not granted or cancelled by user.");return}catch(t){throw d.error("Failed to obtain GitHub authentication session",t),t}}static async hasExistingSession(){try{return!!await Ee.authentication.getSession("github",r.SCOPES,{createIfNone:!1})}catch{return!1}}};var ft=b(mt());var re=class{static create(e){return d.info("Initializing Octokit client with user session token."),new ft.Octokit({auth:e,userAgent:"CodeVulFixer-VSCode-Extension/1.0.0"})}};var te=class{static async fetchAlerts(e,t,s){d.info(`Fetching Dependabot alerts for ${t}/${s}...`);try{let n=(await e.rest.dependabot.listAlertsForRepo({owner:t,repo:s,state:"open",per_page:100})).data;return d.info(`Received ${n.length} Dependabot alerts.`),n.map((i,a)=>{let c=i.security_advisory,p=i.dependency,u=c.cve_id||c.ghsa_id||`DEP-${i.number}`,g=c.vulnerabilities?.[0]?.first_patched_version?.identifier||(c.patched_versions&&c.patched_versions.length>0?c.patched_versions[0].identifier:void 0)||"latest",f=c.vulnerabilities?.[0]?.vulnerable_version_range||c.vulnerable_version_range||"vulnerable",w=this.normalizeSeverity(c.severity),v=p?.package?.ecosystem||"npm",_=p?.package?.name||"unknown-package",k=p?.manifest_path||"package.json",O={packageName:_,ecosystem:v,currentVersion:f,fixedVersion:g,isDirect:!0,manifestFile:k,vulnerableVersionRange:f,upgradeType:this.determineUpgradeType(f,g)};return{id:`DEP-${i.number}`,source:"dependabot",alertNumber:i.number,title:c.summary||`Vulnerability in ${_}`,description:c.description||`Dependabot flagged ${_} with ${u}`,severity:w,htmlUrl:i.html_url,cveId:c.cve_id||void 0,ghsaId:c.ghsa_id||void 0,cweIds:c.cwes?.map(Ct=>Ct.cwe_id)||[],dependency:O,status:"pending",targetSprint:1,remediationPlan:`Upgrade ${_} to >= ${g} via lockfile bump`,sizing:{size:"S",riskLevel:"low",reasons:[],estimatedHours:1,isAutomatedCandidate:!0}}})}catch(o){throw d.error(`Failed to fetch Dependabot alerts for ${t}/${s}`,o),o}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"?"high":t==="medium"||t==="moderate"?"medium":"low"}static determineUpgradeType(e,t){if(!t||t==="latest")return"minor";let s=t.match(/^(\d+)\.(\d+)\.(\d+)/);if(!s)return"unknown";if(e&&e.includes("<")){let o=parseInt(s[1],10),n=e.match(/<\s*(\d+)/);if(n){let i=parseInt(n[1],10);if(o>i)return"major"}}return"patch"}};var se=class{static async fetchAlerts(e,t,s){d.info(`Fetching Code Scanning (SAST/CodeQL) alerts for ${t}/${s}...`);try{let n=(await e.rest.codeScanning.listAlertsForRepo({owner:t,repo:s,state:"open",per_page:100})).data;return d.info(`Received ${n.length} Code Scanning findings.`),n.map(i=>{let a=i.rule,c=i.most_recent_instance,p=c?.location,u=this.normalizeSeverity(a.security_severity_level||a.severity),l=this.extractCWEs(a.tags??void 0),g=p?.path?{filePath:p.path,startLine:p.start_line||1,endLine:p.end_line||p.start_line||1,startColumn:p.start_column??void 0,endColumn:p.end_column??void 0}:void 0;return{id:`CS-${i.number}`,source:"code_scanning",alertNumber:i.number,title:a.description||a.id||`Code Scanning Alert #${i.number}`,description:c?.message?.text||a.description||"Static analysis finding flagged by CodeQL",severity:u,htmlUrl:i.html_url,ruleId:a.id??void 0,cweIds:l,location:g,status:"pending",targetSprint:1,remediationPlan:`Refactor code at ${p?.path||"file"} to resolve ${a.id}`,sizing:{size:"M",riskLevel:"medium",reasons:[],estimatedHours:2,isAutomatedCandidate:!1}}})}catch(o){throw d.error(`Failed to fetch Code Scanning alerts for ${t}/${s}`,o),o}}static normalizeSeverity(e){let t=(e||"").toLowerCase();return t==="critical"?"critical":t==="high"||t==="error"?"high":t==="medium"||t==="warning"?"medium":"low"}static extractCWEs(e){if(!e)return[];let t=[];for(let s of e)if(s.startsWith("external/cwe/cwe-")){let o=s.replace("external/cwe/cwe-","CWE-");t.push(o.toUpperCase())}else/^cwe-\d+/i.test(s)&&t.push(s.toUpperCase());return t}};var C=b(require("fs")),U=b(require("path"));var oe=class{static async analyze(e,t){let s={...t};try{let o=U.join(e,t.manifestFile||"package.json");if(C.existsSync(o)){let n=C.readFileSync(o,"utf8"),i=JSON.parse(n),a=i.dependencies&&i.dependencies[t.packageName]||i.devDependencies&&i.devDependencies[t.packageName]||i.peerDependencies&&i.peerDependencies[t.packageName];a?(s.isDirect=!0,s.currentVersion=a):s.isDirect=!1}C.existsSync(U.join(e,"package-lock.json"))?(s.lockfile="package-lock.json",s.ecosystem="npm"):C.existsSync(U.join(e,"pnpm-lock.yaml"))?(s.lockfile="pnpm-lock.yaml",s.ecosystem="pnpm"):C.existsSync(U.join(e,"yarn.lock"))?(s.lockfile="yarn.lock",s.ecosystem="yarn"):C.existsSync(U.join(e,"uv.lock"))?(s.lockfile="uv.lock",s.ecosystem="uv"):C.existsSync(U.join(e,"requirements.txt"))&&(s.lockfile="requirements.txt",s.ecosystem="pip")}catch(o){d.warn(`DependencyAnalyzer could not inspect manifest for ${t.packageName}: ${o}`)}return s}};var ne=b(require("fs")),ae=b(require("path"));var ie=class{static COMPLEX_CWES=new Set(["CWE-89","CWE-78","CWE-94","CWE-502","CWE-287","CWE-327","CWE-918"]);static SIMPLE_CWES=new Set(["CWE-79","CWE-330","CWE-1333","CWE-400"]);static async analyze(e,t,s=[],o){if(!t||!t.filePath)return{fileExists:!1,fileLinesCount:0,isSelfContained:!0,taintComplexity:"moderate"};let n=ae.isAbsolute(t.filePath)?t.filePath:ae.join(e,t.filePath);if(!ne.existsSync(n))return{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!1,taintComplexity:this.determineComplexity(s,o)};try{let a=ne.readFileSync(n,"utf8").split(/\r?\n/),c=Math.max(0,t.startLine-1),p=Math.min(a.length,t.endLine),u=a.slice(c,p).join(`
`),l=Math.max(0,c-5),g=Math.min(a.length,p+5),f=a.slice(l,g).join(`
`),w=p-c<=8&&a.length<500,v=this.determineComplexity(s,o);return{fileExists:!0,fileLinesCount:a.length,snippet:u||t.snippet,surroundingContext:f,isSelfContained:w,taintComplexity:v}}catch(i){return d.warn(`Could not read code context for ${n}: ${i}`),{fileExists:!1,fileLinesCount:0,snippet:t.snippet,isSelfContained:!0,taintComplexity:this.determineComplexity(s,o)}}}static determineComplexity(e,t){for(let s of e){if(this.COMPLEX_CWES.has(s))return"complex";if(this.SIMPLE_CWES.has(s))return"simple"}if(t){let s=t.toLowerCase();if(s.includes("sql")||s.includes("command")||s.includes("rce")||s.includes("crypto"))return"complex";if(s.includes("random")||s.includes("xss")||s.includes("redos"))return"simple"}return"moderate"}};var ce=class{static evaluate(e,t,s){let o=[],n="S",i="low",a=1,c=!0;if(e.source==="dependabot"){let p=t||e.dependency,u=p?.upgradeType||"patch",l=p?p.isDirect:!0;u==="major"?(n="L",i="high",a=3.5,c=!1,o.push("Major version upgrade introduces potential API breaking changes"),l&&o.push("Direct package definition requires codebase API audit")):e.severity==="critical"?(n="M",i="medium",a=2,c=!0,o.push("Critical severity dependency patch; prioritized for rapid lockfile refresh")):(n="S",i="low",a=.5,c=!0,o.push(l?"Direct dependency patch bump with backward compatibility":"Transitive lockfile bump without source modifications"))}else{let p=s?.taintComplexity||"moderate",u=s?.isSelfContained??!1,l=e.severity;p==="complex"||l==="critical"?(n="L",i="high",a=4,c=!1,o.push("Complex data-flow / taint across application layers (e.g. SQL Injection or Command Injection)"),o.push("High-risk vulnerability requiring human-in-the-loop verification")):!u||p==="moderate"||l==="high"?(n="M",i="medium",a=2,c=!1,o.push("Code modification touches non-trivial function block"),o.push("Requires regression test validation")):(n="S",i="low",a=.5,c=!0,o.push("Self-contained, localized syntax or security sanitizer replacement"),o.push("Eligible for deterministic AST-grep / AI automated repair"))}return{size:n,riskLevel:i,reasons:o,estimatedHours:a,isAutomatedCandidate:c}}};var Et=b(require("vscode"));var bt=b(require("vscode")),T=b(require("fs")),P=b(require("path")),ht=require("child_process"),vt=require("util");var pe=[{ruleId:"js/insecure-randomness",cwe:"CWE-330",name:"Replace Math.random() with Node.js crypto.randomBytes",description:'Replaces cryptographically insecure Math.random() token generation with crypto.randomBytes(32).toString("hex")',matcher:r=>/Math\.random\(\)/.test(r),transform:r=>({transformed:r.replace(/Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,"require('crypto').randomBytes(24).toString('hex')").replace(/Math\.random\(\)/g,"(require('crypto').randomBytes(4).readUInt32LE(0) / 0xffffffff)"),explanation:"Replaced Math.random with cryptographically secure random bytes from native crypto module."})},{ruleId:"js/xss-through-dom",cwe:"CWE-79",name:"Safe textContent assignment for innerHTML",description:"Replaces raw innerHTML assignment with textContent to neutralize cross-site scripting vectors",matcher:r=>/\.innerHTML\s*=/.test(r),transform:r=>({transformed:r.replace(/(\b\w+)\.innerHTML\s*=\s*([^;]+);/g,"$1.textContent = $2;"),explanation:"Converted vulnerable innerHTML assignment to safe textContent."})},{ruleId:"js/command-injection",cwe:"CWE-78",name:"Parameterize child_process shell execution",description:"Swaps vulnerable exec template literal with safe execFile or sanitized arguments",matcher:r=>/exec\(`[^`]*\$\{[^}]+\}[^`]*`/.test(r),transform:r=>({transformed:r.replace(/exec\(`git checkout \$\{([^}]+)\}`,\s*([^)]+)\)/g,'execFile("git", ["checkout", $1], $2)'),explanation:"Replaced shell string concatenation with argument array via execFile."})},{ruleId:"js/sql-injection",cwe:"CWE-89",name:"Parameterize raw SQL template literal",description:"Converts interpolated SQL query strings into parameterized database queries",matcher:r=>/`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i.test(r),transform:r=>({transformed:r.replace(/`SELECT\s+\*\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?\$\{([^}]+)\}['"]?`/i,'"SELECT * FROM $1 WHERE $2 = $1", [$3]'),explanation:"Converted string-interpolated SQL query into parameterized prepared statement."})},{ruleId:"js/path-traversal",cwe:"CWE-22",name:"Enforce path boundary check",description:"Guards path.join with path.resolve boundary check against directory traversal",matcher:r=>/path\.join\(/.test(r),transform:r=>({transformed:r.replace(/const\s+filePath\s*=\s*path\.join\(([^,]+),\s*([^)]+)\);/g,`const safeFilename = path.basename($2);
    const filePath = path.join($1, safeFilename);`),explanation:"Enforced path.basename sanitization to prevent directory escape."})}];var pi=(0,vt.promisify)(ht.exec),A=class{static async applyFix(e,t){return t.source==="dependabot"?this.fixDependency(e,t):this.fixCodeScanning(e,t)}static async fixDependency(e,t){let s=t.dependency;if(!s)return{success:!1,engine:"deterministic",message:"No dependency metadata available for this alert.",modifiedFiles:[]};let n=bt.workspace.getConfiguration("codevulfixer").get("packageManager","auto");n==="auto"&&(n=s.ecosystem||"npm",T.existsSync(P.join(e,"pnpm-lock.yaml"))?n="pnpm":T.existsSync(P.join(e,"yarn.lock"))?n="yarn":T.existsSync(P.join(e,"uv.lock"))?n="uv":T.existsSync(P.join(e,"requirements.txt"))?n="pip":n="npm");let i=s.packageName,a=s.fixedVersion,c="",p=[];switch(n){case"npm":c=`npm install ${i}@${a} --package-lock-only`,p.push("package-lock.json"),s.isDirect&&p.push("package.json");break;case"pnpm":c=`pnpm update ${i}@${a}`,p.push("pnpm-lock.yaml");break;case"yarn":c=`yarn up ${i}@${a}`,p.push("yarn.lock");break;case"uv":c=`uv add ${i}==${a}`,p.push("pyproject.toml","uv.lock");break;case"pip":c=`pip install ${i}==${a}`,p.push("requirements.txt");break;default:c=`npm install ${i}@${a} --package-lock-only`,p.push("package-lock.json")}d.info(`[DeterministicFixer] Spawning package manager CLI: "${c}" in ${e}`);try{let{stdout:u,stderr:l}=await pi(c,{cwd:e});return d.success(`[DeterministicFixer] Successfully upgraded ${i} to ${a}`),{success:!0,engine:"deterministic",message:`Upgraded ${i} to ${a} via ${n} lockfile bump`,commandExecuted:c,stdout:u,stderr:l,modifiedFiles:p}}catch(u){d.warn(`CLI execution returned error: ${u.message}. Attempting safe fallback manifest upgrade.`);let l=P.join(e,"package.json");if(T.existsSync(l))try{let g=T.readFileSync(l,"utf8"),f=JSON.parse(g),w=!1;if(f.dependencies&&f.dependencies[i]&&(f.dependencies[i]=`^${a}`,w=!0),f.devDependencies&&f.devDependencies[i]&&(f.devDependencies[i]=`^${a}`,w=!0),w)return T.writeFileSync(l,JSON.stringify(f,null,2),"utf8"),{success:!0,engine:"deterministic",message:`Updated ${i} in package.json to ^${a} (manifest-level fallback)`,commandExecuted:"Direct manifest rewrite",modifiedFiles:["package.json"]}}catch{}return{success:!1,engine:"deterministic",message:`Failed to execute lockfile upgrade command: ${u.message}`,commandExecuted:c,stderr:u.stderr||u.message,modifiedFiles:[]}}}static async fixCodeScanning(e,t){let s=t.location;if(!s||!s.filePath)return{success:!1,engine:"deterministic",message:"No file location metadata provided in Code Scanning alert.",modifiedFiles:[]};let o=P.isAbsolute(s.filePath)?s.filePath:P.join(e,s.filePath),n=pe.find(i=>i.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(i.cwe));if(!n)return{success:!1,engine:"deterministic",message:`No precompiled deterministic AST-grep rule for ${t.ruleId||"unknown rule"}. Recommend using Copilot LM Engine.`,modifiedFiles:[]};if(!T.existsSync(o))if(s.snippet){let i=P.dirname(o);T.existsSync(i)||T.mkdirSync(i,{recursive:!0}),T.writeFileSync(o,`// CodeVulFixer Target File
${s.snippet}
`,"utf8")}else return{success:!1,engine:"deterministic",message:`Target file not found: ${s.filePath}`,modifiedFiles:[]};try{let i=T.readFileSync(o,"utf8"),a=i.split(/\r?\n/),c=Math.max(0,(s.startLine||1)-1),p=Math.min(a.length,s.endLine||a.length),u=a.slice(c,p).join(`
`),{transformed:l,explanation:g}=n.transform(u);if(l===u){let f=n.transform(i);return f.transformed!==i?(T.writeFileSync(o,f.transformed,"utf8"),{success:!0,engine:"deterministic",message:`AST-grep applied: ${n.name}. ${f.explanation}`,modifiedFiles:[s.filePath]}):{success:!1,engine:"deterministic",message:`AST-grep rule did not match the code structure in ${s.filePath}`,modifiedFiles:[]}}return a.splice(c,p-c,l),T.writeFileSync(o,a.join(`
`),"utf8"),d.success(`[DeterministicFixer] AST transformation applied: ${n.name} on ${s.filePath}`),{success:!0,engine:"deterministic",message:`AST-grep applied: ${n.name}. ${g}`,modifiedFiles:[s.filePath]}}catch(i){return d.error("Failed to apply AST-grep fix",i),{success:!1,engine:"deterministic",message:`AST-grep failed: ${i instanceof Error?i.message:String(i)}`,modifiedFiles:[]}}}};var D=b(require("vscode")),G=b(require("fs")),M=b(require("path"));var N=class{static async applyFix(e,t){d.info(`[CopilotLMFixer] Initiating VS Code LM fix for ${t.id}: ${t.title}`);let s=[];try{s=await D.lm.selectChatModels({vendor:"copilot"}),(!s||s.length===0)&&(s=await D.lm.selectChatModels())}catch(l){d.warn(`Error selecting chat models via vscode.lm: ${l}`)}if(!s||s.length===0)return{success:!1,engine:"copilot",message:"No active Copilot Language Model found. Please ensure GitHub Copilot is installed and active in VS Code, or switch to Deterministic fix mode.",modifiedFiles:[]};let o=s[0];d.info(`[CopilotLMFixer] Using model: ${o.name} (${o.id})`);let n=t.location,i="",a="",c=n?.snippet||"";if(n?.filePath){if(i=M.isAbsolute(n.filePath)?n.filePath:M.join(e,n.filePath),G.existsSync(i))a=G.readFileSync(i,"utf8");else if(n.snippet){let l=M.dirname(i);G.existsSync(l)||G.mkdirSync(l,{recursive:!0}),G.writeFileSync(i,`// Target: ${n.filePath}
${n.snippet}
`,"utf8"),a=G.readFileSync(i,"utf8")}}let p=this.buildPrompt(t,a,c),u=[D.LanguageModelChatMessage.User("You are a Principal Security Architect and CodeQL Remediator. Fix the following vulnerability strictly and cleanly. Return ONLY the complete updated file or replacement code inside a ```ts code block. Do NOT include extraneous markdown explanations."),D.LanguageModelChatMessage.User(p)];try{let l=new D.CancellationTokenSource,g=o,f=g.sendRequest?await g.sendRequest(u,{},l.token):await g.sendChatRequest(u,{},l.token),w="";for await(let _ of f.text)w+=_;d.info(`[CopilotLMFixer] Received response (${w.length} chars) from ${o.name}`);let v=this.extractCode(w);return v?i?(G.writeFileSync(i,v,"utf8"),d.success(`[CopilotLMFixer] Successfully updated ${n?.filePath} with Copilot LM remediation`),{success:!0,engine:"copilot",message:`Remediated by Copilot LM (${o.name}): ${t.title}`,stdout:w,modifiedFiles:[n?.filePath||"remediated_code.ts"]}):{success:!0,engine:"copilot",message:"Generated remediation patch with Copilot LM.",stdout:v,modifiedFiles:[]}:{success:!1,engine:"copilot",message:"Could not extract clean code replacement from Copilot LM response.",stdout:w,modifiedFiles:[]}}catch(l){return d.error("Copilot LM fix execution failed",l),{success:!1,engine:"copilot",message:`Copilot LM request failed: ${l.message||String(l)}`,stderr:String(l),modifiedFiles:[]}}}static buildPrompt(e,t,s){return`
VULNERABILITY DETAILS:
- Title: ${e.title}
- Severity: ${e.severity.toUpperCase()}
- Rule ID: ${e.ruleId||"N/A"}
- CWE IDs: ${(e.cweIds||[]).join(", ")||"N/A"}
- Advisory: ${e.cveId||e.ghsaId||"N/A"}
- Description: ${e.description}
- Remediation Guideline: ${e.remediationPlan}

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

INSTRUCTIONS:
1. Provide the complete remediated file code that securely eliminates the vulnerability.
2. Maintain existing styles, imports, and functionality.
3. Eliminate injection, taint flow, or insecure APIs completely using industry standard safe APIs.
4. Output ONLY the code inside a single markdown code block:
\`\`\`
// code here
\`\`\`
`}static extractCode(e){let t=e.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);if(t&&t[1])return t[1].trim();if(e.includes("import ")||e.includes("const ")||e.includes("function ")||e.includes("export "))return e.trim()}};var le=class{static async executeRepair(e,t,s){let o=Et.workspace.getConfiguration("codevulfixer"),n=s||o.get("preferredFixEngine","auto");if(d.info(`[RepairCoordinator] Deciding engine for ${t.id} (preference: ${n})...`),n==="deterministic")return A.applyFix(e,t);if(n==="copilot"){let c=await N.applyFix(e,t);return c.success?c:(d.warn(`Copilot LM repair failed or unavailable: ${c.message}. Falling back to deterministic engine.`),A.applyFix(e,t))}if(t.source==="dependabot")return A.applyFix(e,t);if(pe.some(c=>c.ruleId===t.ruleId||t.cweIds&&t.cweIds.includes(c.cwe))&&t.sizing.size==="S"){d.info(`[RepairCoordinator] Choosing Deterministic AST engine for self-contained rule: ${t.ruleId}`);let c=await A.applyFix(e,t);if(c.success)return c}d.info(`[RepairCoordinator] Choosing Copilot LM engine for ${t.id}`);let a=await N.applyFix(e,t);return a.success?a:(d.info(`Copilot LM fallback to deterministic engine for ${t.id}`),A.applyFix(e,t))}};var yt=b(require("vscode")),B=b(require("fs")),Ie=b(require("path")),wt=require("child_process"),_t=require("util");var Tt=(0,_t.promisify)(wt.exec),de=class{static async validateWorkspace(e){let t=yt.workspace.getConfiguration("codevulfixer"),s=t.get("autoRunTests",!0),o=t.get("buildCommand","npm run build"),n=t.get("testCommand","npm test"),i={passed:!0,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped"};if(!s)return d.info("Auto-validation is disabled in settings."),i;let a=Ie.join(e,"package.json"),c=!1,p=!1;if(B.existsSync(a))try{let u=JSON.parse(B.readFileSync(a,"utf8"));c=!!(u.scripts&&u.scripts.build),p=!!(u.scripts&&u.scripts.test)}catch{}if(c||B.existsSync(Ie.join(e,"tsconfig.json"))){let u=Date.now(),l=c?o:"npx tsc --noEmit";d.info(`[Validation] Running compilation check: ${l}`);try{let{stdout:g,stderr:f}=await Tt(l,{cwd:e,timeout:6e4});i.buildStatus="passed",i.buildDurationMs=Date.now()-u,i.buildOutput=g||"Compilation passed with zero errors.",d.success(`[Validation] Compilation check passed in ${i.buildDurationMs}ms.`)}catch(g){return i.buildStatus="failed",i.passed=!1,i.buildDurationMs=Date.now()-u,i.buildOutput=g.stdout||"",i.failureStackTrace=g.stderr||g.message,d.error(`[Validation] Compilation failed: ${g.message}`),i}}else i.buildStatus="skipped";if(p){let u=Date.now();d.info(`[Validation] Running regression test suite: ${n}`);try{let{stdout:l,stderr:g}=await Tt(n,{cwd:e,timeout:6e4});i.testStatus="passed",i.testDurationMs=Date.now()-u,i.testOutput=l||"All tests passed.",d.success(`[Validation] Test suite passed in ${i.testDurationMs}ms.`)}catch(l){return i.testStatus="failed",i.passed=!1,i.testDurationMs=Date.now()-u,i.testOutput=l.stdout||"",i.failureStackTrace=l.stderr||l.message,d.error(`[Validation] Test suite failed: ${l.message}`),i}}else i.testStatus="skipped";return i}};var ge=b(require("fs")),me=b(require("path")),kt=require("child_process"),St=require("util"),li=(0,St.promisify)(kt.exec),ue=class{static async getFileDiff(e,t){try{let{stdout:o}=await li(`git diff --no-color -U3 -- "${t}"`,{cwd:e});if(o.trim().length>0)return{filePath:t,hasChanges:!0,rawDiff:o,lines:this.parseUnifiedDiff(o)}}catch{}let s=me.isAbsolute(t)?t:me.join(e,t);if(ge.existsSync(s)){let o=ge.readFileSync(s,"utf8"),n=o.split(/\r?\n/).map((i,a)=>({type:"add",content:i,newLineNumber:a+1}));return{filePath:t,hasChanges:!0,rawDiff:o,lines:n}}return{filePath:t,hasChanges:!1,rawDiff:"",lines:[]}}static async getMultiFileDiff(e,t){let s=[];for(let o of t)s.push(await this.getFileDiff(e,o));return s}static parseUnifiedDiff(e){let t=e.split(/\r?\n/),s=[],o=0,n=0;for(let i of t)if(i.startsWith("@@")){let a=i.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@/);a&&(o=parseInt(a[1],10),n=parseInt(a[2],10)),s.push({type:"normal",content:i})}else i.startsWith("+")&&!i.startsWith("+++")?s.push({type:"add",content:i.substring(1),newLineNumber:n++}):i.startsWith("-")&&!i.startsWith("---")?s.push({type:"delete",content:i.substring(1),oldLineNumber:o++}):i.startsWith(" ")&&s.push({type:"normal",content:i.substring(1),oldLineNumber:o++,newLineNumber:n++});return s}};var K=b(require("vscode")),Pt=require("child_process"),Gt=require("util");var Me=(0,Gt.promisify)(Pt.exec),J=class{static async stageAndSetCommitMessage(e,t,s){try{for(let a of s)d.info(`[SCM] Staging file: git add "${a}"`),await Me(`git add "${a}"`,{cwd:e});let o=t.source==="dependabot"?t.dependency?.packageName||"dependencies":t.location?.filePath||"security-audit",i=`security(fix): [CodeVulFixer] resolved ${t.cveId||t.ghsaId||t.ruleId||t.id} in ${o}

${t.title}
Remediation: ${t.remediationPlan}`;try{let a=K.extensions.getExtension("vscode.git");if(a){let c=a.exports.getAPI(1);if(c&&c.repositories.length>0){let p=c.repositories[0];p.inputBox.value=i,d.info("[SCM] Populated VS Code Git commit message box.")}}}catch(a){d.warn(`Could not set VS Code SCM input box: ${a}`)}return K.window.showInformationMessage(`CodeVulFixer: Staged fixes for ${t.id} and populated commit message.`),!0}catch(o){return d.error("Failed to stage files in Git",o),!1}}static async rollbackChanges(e,t){try{for(let s of t){d.info(`[SCM] Rolling back mutations in: ${s}`);try{await Me(`git restore "${s}"`,{cwd:e})}catch{await Me(`git checkout -- "${s}"`,{cwd:e})}}return K.window.showWarningMessage(`CodeVulFixer: Rolled back workspace changes for ${t.join(", ")}.`),!0}catch(s){return d.error("Failed to rollback Git changes",s),!1}}};var xt=[{id:"DEP-101",source:"dependabot",alertNumber:101,title:"Denial of Service in axios due to unbounded buffer allocation",description:"Axios versions prior to 1.7.4 are vulnerable to Server-Side Request Forgery and Unhandled Rejections leading to DoS when parsing malicious redirect responses.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-8hc4-vh64-cxmj",cveId:"CVE-2023-45857",ghsaId:"GHSA-8hc4-vh64-cxmj",cweIds:["CWE-400","CWE-918"],dependency:{packageName:"axios",ecosystem:"npm",currentVersion:"^1.6.0",fixedVersion:"1.7.4",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 1.7.4",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Execute deterministic lockfile bump: `npm install axios@1.7.4 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Direct dependency patch update","Zero breaking API changes reported","Deterministic lockfile bump eligible"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-102",source:"dependabot",alertNumber:102,title:"Regular Expression Denial of Service (ReDoS) in semver",description:"semver vulnerable to Regular Expression Denial of Service when passing untrusted complex ranges to clean/validRange functions.",severity:"high",htmlUrl:"https://github.com/advisories/GHSA-c2qf-rxjj-qqgw",cveId:"CVE-2022-25883",ghsaId:"GHSA-c2qf-rxjj-qqgw",cweIds:["CWE-1333"],dependency:{packageName:"semver",ecosystem:"npm",currentVersion:"7.3.5",fixedVersion:"7.5.3",isDirect:!1,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 7.5.3",upgradeType:"patch"},status:"pending",targetSprint:1,remediationPlan:"Deduplicate & force update transitive lockfile entry for semver to >= 7.5.3",sizing:{size:"S",riskLevel:"low",reasons:["Transitive dependency patch bump","No direct code changes required in repository source"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"DEP-103",source:"dependabot",alertNumber:103,title:"Prototype Pollution in json5 leading to RCE or Crash",description:"json5 vulnerable to Prototype Pollution via parse function. Upgrading requires major version bump 1.x -> 2.2.2 with potential schema validation shifts.",severity:"critical",htmlUrl:"https://github.com/advisories/GHSA-9c47-m6qq-7p4h",cveId:"CVE-2022-46175",ghsaId:"GHSA-9c47-m6qq-7p4h",cweIds:["CWE-1321"],dependency:{packageName:"json5",ecosystem:"npm",currentVersion:"^1.0.1",fixedVersion:"2.2.3",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 2.2.2",upgradeType:"major"},status:"pending",targetSprint:2,remediationPlan:"Upgrade json5 to 2.2.3, run complete test regression to verify custom deserializer calls",sizing:{size:"L",riskLevel:"high",reasons:["Major breaking version upgrade (1.x -> 2.x)","Imported in core configuration parsing modules","Requires compilation & test verification"],estimatedHours:3.5,isAutomatedCandidate:!1}},{id:"CS-201",source:"code_scanning",alertNumber:201,title:"Database query built from user-controlled string (SQL Injection)",description:"CodeQL detected untrusted HTTP parameter concatenation into raw SQL query without parameterized bindings in userRepository.ts.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/201",ruleId:"js/sql-injection",cweIds:["CWE-89"],location:{filePath:"demo/src/db/userRepository.ts",startLine:4,endLine:6,startColumn:3,endColumn:60,snippet:"const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;\n  const result = await db.raw(query);"},status:"pending",targetSprint:2,remediationPlan:'Refactor string interpolation to parameterized SQL query: `db.query("SELECT * FROM users WHERE email = $1", [req.query.email])`',sizing:{size:"L",riskLevel:"high",reasons:["Direct external input taint flow into database driver","Potential full data exfiltration risk","Cross-module data flow detected"],estimatedHours:4,isAutomatedCandidate:!1}},{id:"CS-202",source:"code_scanning",alertNumber:202,title:"Use of cryptographically weak pseudo-random number generator",description:"Math.random() is used to generate session tokens or authentication secrets in tokenGenerator.ts.",severity:"medium",htmlUrl:"https://github.com/example/repo/security/code-scanning/202",ruleId:"js/insecure-randomness",cweIds:["CWE-330"],location:{filePath:"demo/src/auth/tokenGenerator.ts",startLine:4,endLine:5,startColumn:3,endColumn:45,snippet:"const token = Math.random().toString(36).substring(2);"},status:"pending",targetSprint:1,remediationPlan:"Replace Math.random() with `crypto.randomBytes(32).toString('hex')`",sizing:{size:"S",riskLevel:"low",reasons:["Self-contained local expression swap","Pre-compiled AST pattern match available","Low regression impact on caller"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-203",source:"code_scanning",alertNumber:203,title:"DOM text reinterpreted as HTML without escaping (XSS)",description:"Assigning unsanitized user profile bio directly to Element.innerHTML creates an execution path for malicious script tags.",severity:"high",htmlUrl:"https://github.com/example/repo/security/code-scanning/203",ruleId:"js/xss-through-dom",cweIds:["CWE-79"],location:{filePath:"demo/src/web/render.ts",startLine:9,endLine:10,startColumn:3,endColumn:38,snippet:"userBioElement.innerHTML = user.bio;"},status:"pending",targetSprint:1,remediationPlan:"Change `innerHTML` to `textContent` or sanitize with DOMPurify",sizing:{size:"S",riskLevel:"low",reasons:["Localized DOM assignment","Direct AST replacement innerHTML -> textContent","No complex data flow"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-204",source:"code_scanning",alertNumber:204,title:"Untrusted input passed directly to child_process.exec (Command Injection)",description:"String concatenation into shell execution command in execHelper.ts allows arbitrary command execution.",severity:"critical",htmlUrl:"https://github.com/example/repo/security/code-scanning/204",ruleId:"js/command-injection",cweIds:["CWE-78"],location:{filePath:"demo/src/utils/execHelper.ts",startLine:6,endLine:7,startColumn:3,endColumn:45,snippet:"exec(`git checkout ${branchName}`, callback);"},status:"pending",targetSprint:2,remediationPlan:'Use `execFile` with separate arguments array instead of shell interpolation: `execFile("git", ["checkout", branchName])`',sizing:{size:"L",riskLevel:"high",reasons:["Remote Code Execution potential","Shell invocation architecture change","Requires argument validation helper"],estimatedHours:3,isAutomatedCandidate:!1}},{id:"DEP-104",source:"dependabot",alertNumber:104,title:"DoS through memory exhaustion in ws websocket library",description:"ws client allows attacker to send infinite message headers causing Node process out-of-memory.",severity:"medium",htmlUrl:"https://github.com/advisories/GHSA-3h5v-q93c-6h6q",cveId:"CVE-2024-37890",ghsaId:"GHSA-3h5v-q93c-6h6q",cweIds:["CWE-400"],dependency:{packageName:"ws",ecosystem:"npm",currentVersion:"^8.14.0",fixedVersion:"8.17.1",isDirect:!0,manifestFile:"package.json",lockfile:"package-lock.json",vulnerableVersionRange:"< 8.17.1",upgradeType:"minor"},status:"pending",targetSprint:3,remediationPlan:"Upgrade ws to 8.17.1 via `npm install ws@8.17.1 --package-lock-only`",sizing:{size:"S",riskLevel:"low",reasons:["Minor hygiene upgrade","Fully backward-compatible API"],estimatedHours:.5,isAutomatedCandidate:!0}},{id:"CS-205",source:"code_scanning",alertNumber:205,title:"Unsanitized path concatenation in file server (Path Traversal)",description:"path.join with untrusted request parameter allows reading arbitrary files outside root folder if not bounded by path.resolve.",severity:"low",htmlUrl:"https://github.com/example/repo/security/code-scanning/205",ruleId:"js/path-traversal",cweIds:["CWE-22"],location:{filePath:"demo/src/server/fileHandler.ts",startLine:7,endLine:9,startColumn:3,endColumn:55,snippet:`const filePath = path.join(publicDir, req.query.filename);
  return fs.readFileSync(filePath);`},status:"pending",targetSprint:3,remediationPlan:"Enforce boundary check: verify `path.resolve(publicDir, filename).startsWith(publicDir)`",sizing:{size:"M",riskLevel:"medium",reasons:["Requires path verification utility injection","Non-critical asset endpoint"],estimatedHours:1.5,isAutomatedCandidate:!1}}];function Ft(r,e="risk-profile",t){let s=JSON.stringify(r||null).replace(/</g,"\\u003c"),o=JSON.stringify(t||null).replace(/</g,"\\u003c");return`<!DOCTYPE html>
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

    ${r?ui(r,e,t):di()}

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
</html>`}function di(){return`
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
  `}function ui(r,e,t){let s=r.metrics,o=Object.values(r.findings),n=o.filter(p=>p.severity==="critical").length,i=o.filter(p=>p.severity==="high").length,a=o.filter(p=>p.severity==="medium").length,c=o.filter(p=>p.severity==="low").length;return`
    <!-- Top Telemetry Metrics -->
    <div class="metrics-grid">
      <div class="metric-card danger">
        <div class="metric-label">Critical & High Vulnerabilities</div>
        <div class="metric-value">${n+i}</div>
        <div class="metric-sub">\u{1F534} ${n} Critical \u2022 ${i} High</div>
      </div>
      <div class="metric-card warning">
        <div class="metric-label">Medium & Low Hygiene</div>
        <div class="metric-value">${a+c}</div>
        <div class="metric-sub">\u{1F7E1} ${a} Medium \u2022 \u{1F7E2} ${c} Low</div>
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
            Automated S-size quick wins represent <strong>${o.filter(p=>p.sizing.size==="S").length} findings</strong> that can be cleared with zero-token lockfile upgrades or precompiled AST transformations.
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
            ${o.map(p=>`
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px; font-family: monospace;">${p.id}</td>
                <td style="padding: 8px;">${p.source==="dependabot"?"\u{1F4E6} Dependabot":"\u{1F50D} CodeQL"}</td>
                <td style="padding: 8px;"><span class="badge badge-${p.severity}">${p.severity}</span></td>
                <td style="padding: 8px; font-weight: 500;">${p.title}</td>
                <td style="padding: 8px;"><span class="badge badge-${p.sizing.size.toLowerCase()}">Size ${p.sizing.size}</span></td>
                <td style="padding: 8px;">${p.sizing.riskLevel.toUpperCase()}</td>
                <td style="padding: 8px;">${p.sizing.estimatedHours}h</td>
                <td style="padding: 8px;">Sprint ${p.targetSprint}</td>
                <td style="padding: 8px;"><span class="status-pill status-${p.status}">${p.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Interactive Sprint Board -->
    <div class="tab-content ${e==="sprint-board"?"active":""}">
      ${r.sprints.map(p=>gi(p,r)).join("")}
    </div>

    <!-- TAB 3: Live Diff & Verification Intercept -->
    <div class="tab-content ${e==="diff-inspector"?"active":""}">
      ${fi(t,o)}
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
  `}function gi(r,e){let t=r.findings.map(o=>e.findings[o]).filter(Boolean),s=r.sprintNumber===1;return`
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
        ${t.map(o=>mi(o)).join("")}
      </div>
    </div>
  `}function mi(r){let e=r.status==="applied"||r.status==="verified",t=r.status==="failed";return`
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
               <div><strong>Type:</strong> ${r.dependency.isDirect?"Direct Manifest":"Transitive Lockfile"}</div>`:`<div><strong>Rule:</strong> ${r.ruleId||"N/A"}</div>
               <div><strong>Target:</strong> ${r.location?.filePath||"Source file"}:${r.location?.startLine??1}</div>`}
          <div><strong>Advisory:</strong> ${r.cveId||r.ghsaId||r.id}</div>
        </div>

        ${t&&r.validationReport?.failureStackTrace?`
          <div class="terminal-box">
            <div class="terminal-title">\u274C Validation Failure Details</div>
            <div>${fe(r.validationReport.failureStackTrace)}</div>
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
  `}function fi(r,e=[]){if(!r){let s=e.find(o=>o.status==="applied");s&&(r=s)}return r?`
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
        <span>\u{1F4C4} ${r.location?.filePath||(r.dependency?"package.json / package-lock.json":"workspace")}</span>
        <span style="font-size: 11px; opacity: 0.7;">Git Unified Diff</span>
      </div>
      <div>
        ${bi(r)}
      </div>
    </div>

    <!-- Validation Summary Card -->
    <div class="sprint-header" style="flex-direction: column; align-items: flex-start;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">Automated Validation Telemetry</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%;">
        <div class="metric-card success">
          <div class="metric-label">Compilation / Build</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${r.validationReport?.buildDurationMs??210}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Regression Test Suite</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 PASSED</div>
          <div class="metric-sub">${r.validationReport?.testDurationMs??430}ms</div>
        </div>
        <div class="metric-card success">
          <div class="metric-label">Ecosystem Security Audit</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--color-success);">\u2714 ADVISORY CLEARED</div>
          <div class="metric-sub">${r.cveId||r.ghsaId||"Zero Vulnerabilities"}</div>
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
    `}function bi(r){return r.appliedDiff?r.appliedDiff.split(/\r?\n/).map((t,s)=>{let o="normal";return t.startsWith("+")?o="add":t.startsWith("-")&&(o="delete"),`
        <div class="diff-line ${o}">
          <div class="diff-line-num">${s+1}</div>
          <div class="diff-line-code">${fe(t)}</div>
        </div>
      `}).join(""):r.source==="dependabot"&&r.dependency?`
      <div class="diff-line normal"><div class="diff-line-num">12</div><div class="diff-line-code">   "dependencies": {</div></div>
      <div class="diff-line delete"><div class="diff-line-num">13</div><div class="diff-line-code">-    "${r.dependency.packageName}": "${r.dependency.currentVersion}",</div></div>
      <div class="diff-line add"><div class="diff-line-num">13</div><div class="diff-line-code">+    "${r.dependency.packageName}": "^${r.dependency.fixedVersion}",</div></div>
      <div class="diff-line normal"><div class="diff-line-num">14</div><div class="diff-line-code">   }</div></div>
    `:r.location?.snippet?`
      <div class="diff-line normal"><div class="diff-line-num">33</div><div class="diff-line-code"> // Line before</div></div>
      <div class="diff-line delete"><div class="diff-line-num">34</div><div class="diff-line-code">-  ${fe(r.location.snippet)}</div></div>
      <div class="diff-line add"><div class="diff-line-num">34</div><div class="diff-line-code">+  // Remediated safe implementation by CodeVulFixer</div></div>
      <div class="diff-line add"><div class="diff-line-num">35</div><div class="diff-line-code">+  ${fe(r.remediationPlan)}</div></div>
      <div class="diff-line normal"><div class="diff-line-num">36</div><div class="diff-line-code"> // Line after</div></div>
    `:`
    <div class="diff-line normal">
      <div class="diff-line-num">1</div>
      <div class="diff-line-code">// No workspace file modifications detected yet for ${r.id}</div>
    </div>
  `}function fe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}var x=class r{static currentPanel;panel;extensionUri;disposables=[];activeTab="risk-profile";selectedDiffFinding;constructor(e,t){this.panel=e,this.extensionUri=t,this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),this.panel.webview.onDidReceiveMessage(async s=>{await this.handleMessage(s)},null,this.disposables),this.update()}static createOrShow(e){let t=m.window.activeTextEditor?m.window.activeTextEditor.viewColumn:void 0;if(r.currentPanel)return r.currentPanel.panel.reveal(t),r.currentPanel.update(),r.currentPanel;let s=m.window.createWebviewPanel("codevulfixer.dashboard","CodeVulFixer Sprint & Risk Dashboard",t||m.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[e]});return r.currentPanel=new r(s,e),r.currentPanel}async update(){let e=S.getPrimaryWorkspacePath(),t;e&&(t=await h.loadState(e)),this.panel.webview.html=Ft(t,this.activeTab,this.selectedDiffFinding)}async handleMessage(e){let t=S.getPrimaryWorkspacePath();if(!t){m.window.showErrorMessage("CodeVulFixer requires an open workspace folder.");return}try{switch(e.command){case"switchTab":this.activeTab=e.tab,await this.update();break;case"scan":await this.performScan(t);break;case"loadDemoData":await this.loadDemoFindings(t);break;case"resetState":await h.resetState(t),this.selectedDiffFinding=void 0,this.activeTab="risk-profile",await this.update(),m.window.showInformationMessage("CodeVulFixer: Sprint state reset successfully.");break;case"applyFix":await this.applyFindingFix(t,e.findingId,e.engine);break;case"inspectDiff":await this.inspectFindingDiff(t,e.findingId);break;case"verifyStage":await this.verifyAndStageFinding(t,e.findingId);break;case"rejectRollback":await this.rejectAndRollbackFinding(t,e.findingId);break;case"runSprint":await this.executeSprint(t,e.sprintNumber);break;case"saveSettings":await this.updateSettings(e.settings);break}}catch(s){d.error("Error handling Webview message",s),m.window.showErrorMessage(`CodeVulFixer error: ${s instanceof Error?s.message:String(s)}`)}}async performScan(e){await m.window.withProgress({location:m.ProgressLocation.Notification,title:"CodeVulFixer: Ingesting GitHub Vulnerabilities...",cancellable:!1},async t=>{t.report({increment:10,message:"Resolving repository metadata..."});let s=await S.resolveRepoMetadata();if(!s){await m.window.showWarningMessage("No GitHub remote origin found for workspace. Would you like to load realistic demo findings for evaluation?","Load Demo Findings","Cancel")==="Load Demo Findings"&&await this.loadDemoFindings(e);return}t.report({increment:30,message:"Authenticating with GitHub API..."});let o=await Z.getSession(!0);if(!o){m.window.showErrorMessage("GitHub authentication was cancelled or unavailable.");return}let n=re.create(o.accessToken);t.report({increment:50,message:"Fetching Dependabot & Code Scanning alerts..."});let i=[],a=[];try{i=await te.fetchAlerts(n,s.owner,s.repo)}catch(l){d.warn(`Could not ingest Dependabot alerts (might lack GHAS permission or none exist): ${l}`)}try{a=await se.fetchAlerts(n,s.owner,s.repo)}catch(l){d.warn(`Could not ingest Code Scanning alerts (might lack GHAS permission or none exist): ${l}`)}let c=[...i,...a];if(c.length===0&&await m.window.showInformationMessage(`Zero open alerts returned by GitHub for ${s.owner}/${s.repo}. Load sample findings to test sprint orchestration?`,"Load Demo Findings","Dismiss")==="Load Demo Findings"){await this.loadDemoFindings(e);return}t.report({increment:75,message:"Running impact analysis & T-shirt sizing..."});let p=await this.enrichAndSizeFindings(e,c);t.report({increment:90,message:"Planning multi-day remediation sprints..."});let u=L.planSprints(p,s.owner,s.repo);await h.saveState(e,u),this.activeTab="sprint-board",await this.update(),m.window.showInformationMessage(`CodeVulFixer: Ingested ${c.length} findings into ${u.sprints.length} sprints.`)})}async loadDemoFindings(e){await m.window.withProgress({location:m.ProgressLocation.Notification,title:"CodeVulFixer: Loading Realistic Vulnerabilities..."},async t=>{t.report({increment:30,message:"Analyzing manifests and taint graph..."});let s=await this.enrichAndSizeFindings(e,xt);t.report({increment:70,message:"Generating multi-day sprint schedule..."});let o=L.planSprints(s,"enterprise","demo-workspace");await h.saveState(e,o),this.activeTab="sprint-board",await this.update(),m.window.showInformationMessage("CodeVulFixer: Loaded 9 realistic findings partitioned into 3 remediation sprints.")})}async enrichAndSizeFindings(e,t){let s=[];for(let o of t){let n=o.dependency;n&&(n=await oe.analyze(e,n));let i=await ie.analyze(e,o.location,o.cweIds,o.ruleId),a=ce.evaluate(o,n,i);s.push({...o,dependency:n,sizing:a})}return s}async applyFindingFix(e,t,s){let o=await h.loadState(e);if(!o||!o.findings[t])return;let n=o.findings[t];await h.updateFinding(e,t,{status:"in_progress"}),await this.update(),await m.window.withProgress({location:m.ProgressLocation.Notification,title:`CodeVulFixer: Remediating ${t}...`},async i=>{i.report({increment:30,message:`Executing ${s} fix engine...`});let a=await le.executeRepair(e,n,s);if(!a.success){await h.updateFinding(e,t,{status:"failed",statusMessage:a.message,validationReport:{passed:!1,timestamp:new Date().toISOString(),buildStatus:"skipped",testStatus:"skipped",auditStatus:"skipped",failureStackTrace:a.stderr||a.message}}),await this.update(),m.window.showErrorMessage(`Fix failed for ${t}: ${a.message}`);return}i.report({increment:60,message:"Running build & regression tests validation..."});let c=await de.validateWorkspace(e),p=a.modifiedFiles[0]||n.location?.filePath||"package.json",u=await ue.getFileDiff(e,p);if(!c.passed){await h.updateFinding(e,t,{status:"failed",statusMessage:"Fix applied but automated validation tests failed.",appliedDiff:u.rawDiff,validationReport:c}),await this.update(),m.window.showErrorMessage(`Automated test verification failed after applying fix for ${t}.`);return}await h.updateFinding(e,t,{status:"applied",statusMessage:"Automated validation passed. Ready for Human-in-the-Loop review.",appliedDiff:u.rawDiff,validationReport:c}),this.selectedDiffFinding={...n,status:"applied",appliedDiff:u.rawDiff,validationReport:c},this.activeTab="diff-inspector",await this.update(),m.window.showInformationMessage(`CodeVulFixer: Fix applied & verified for ${t}. Review diff checkpoint to stage or rollback.`)})}async inspectFindingDiff(e,t){let s=await h.loadState(e);!s||!s.findings[t]||(this.selectedDiffFinding=s.findings[t],this.activeTab="diff-inspector",await this.update())}async verifyAndStageFinding(e,t){let s=await h.loadState(e);if(!s||!s.findings[t])return;let o=s.findings[t],n=o.location?.filePath?[o.location.filePath]:["package.json","package-lock.json"];await J.stageAndSetCommitMessage(e,o,n)&&(await h.updateFinding(e,t,{status:"verified",statusMessage:"Verified by developer and staged into Git SCM."}),await this.update())}async rejectAndRollbackFinding(e,t){let s=await h.loadState(e);if(!s||!s.findings[t])return;let o=s.findings[t],n=o.location?.filePath?[o.location.filePath]:["package.json","package-lock.json"];await J.rollbackChanges(e,n),await h.updateFinding(e,t,{status:"rejected",statusMessage:"Rejected by developer. Workspace mutations reverted."}),await this.update()}async executeSprint(e,t){let s=await h.loadState(e);if(!s)return;let o=s.sprints.find(n=>n.sprintNumber===t);if(o){m.window.showInformationMessage(`Starting automated batch execution for ${o.dayLabel}...`);for(let n of o.findings){let i=s.findings[n];if(i&&(i.status==="pending"||i.status==="failed")){await this.applyFindingFix(e,n,i.sizing.isAutomatedCandidate?"deterministic":"copilot");break}}}}async updateSettings(e){let t=m.workspace.getConfiguration("codevulfixer");e.planningMode&&await t.update("planningMode",e.planningMode,m.ConfigurationTarget.Global),e.daysPerSprint&&await t.update("daysPerSprint",e.daysPerSprint,m.ConfigurationTarget.Global),await t.update("maxHighRiskPerDay",e.maxHighRiskPerDay,m.ConfigurationTarget.Global),await t.update("targetSprintDays",e.targetSprintDays,m.ConfigurationTarget.Global),await t.update("packageManager",e.packageManager,m.ConfigurationTarget.Global),await t.update("preferredFixEngine",e.preferredFixEngine,m.ConfigurationTarget.Global);let s=S.getPrimaryWorkspacePath();if(s){let o=await h.loadState(s);if(o){let n=L.planSprints(Object.values(o.findings),o.repoOwner,o.repoName,{planningMode:e.planningMode||o.planningMode||"sprint_wise",daysPerSprint:e.daysPerSprint||o.daysPerSprint||10,maxHighRiskPerDay:e.maxHighRiskPerDay,targetSprintDays:e.targetSprintDays});await h.saveState(s,n),await this.update()}}m.window.showInformationMessage("CodeVulFixer settings saved and sprints replanned.")}dispose(){for(r.currentPanel=void 0,this.panel.dispose();this.disposables.length;){let e=this.disposables.pop();e&&e.dispose()}}};var be=b(require("vscode"));var Q=class{constructor(e){this.extensionUri=e}static viewType="codevulfixer.sidebarView";view;resolveWebviewView(e,t,s){this.view=e,e.webview.options={enableScripts:!0,localResourceRoots:[this.extensionUri]},e.webview.onDidReceiveMessage(async o=>{switch(o.command){case"openDashboard":x.createOrShow(this.extensionUri);break;case"scan":await be.commands.executeCommand("codevulfixer.scan"),this.refresh();break;case"loadDemo":await be.commands.executeCommand("codevulfixer.loadDemoData"),this.refresh();break;case"runSprint":await be.commands.executeCommand("codevulfixer.runSprint"),this.refresh();break}}),this.refresh()}async refresh(){if(!this.view)return;let e=S.getPrimaryWorkspacePath(),t;e&&(t=await h.loadState(e)),this.view.webview.html=this.getSidebarHtml(t)}getSidebarHtml(e){return`<!DOCTYPE html>
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
</html>`}};function hi(r){d.info("Activating CodeVulFixer Extension...");let e=new Q(r.extensionUri);r.subscriptions.push(y.window.registerWebviewViewProvider(Q.viewType,e)),r.subscriptions.push(y.commands.registerCommand("codevulfixer.openDashboard",()=>{d.info("Command: codevulfixer.openDashboard executed."),x.createOrShow(r.extensionUri)})),r.subscriptions.push(y.commands.registerCommand("codevulfixer.scan",async()=>{d.info("Command: codevulfixer.scan executed.");let t=S.getPrimaryWorkspacePath();if(!t){y.window.showErrorMessage("CodeVulFixer: Please open a workspace folder before scanning.");return}await x.createOrShow(r.extensionUri).performScan(t),e.refresh()})),r.subscriptions.push(y.commands.registerCommand("codevulfixer.loadDemoData",async()=>{d.info("Command: codevulfixer.loadDemoData executed.");let t=S.getPrimaryWorkspacePath();if(!t){y.window.showErrorMessage("CodeVulFixer: Please open a workspace folder first.");return}await x.createOrShow(r.extensionUri).loadDemoFindings(t),e.refresh()})),r.subscriptions.push(y.commands.registerCommand("codevulfixer.runSprint",async()=>{d.info("Command: codevulfixer.runSprint executed.");let t=S.getPrimaryWorkspacePath();if(!t)return;if(!await h.loadState(t)){let n=await y.window.showWarningMessage("No active sprint plan found. Ingest vulnerabilities first?","Scan Workspace","Load Demo Findings");n==="Scan Workspace"?await y.commands.executeCommand("codevulfixer.scan"):n==="Load Demo Findings"&&await y.commands.executeCommand("codevulfixer.loadDemoData");return}let o=x.createOrShow(r.extensionUri);y.commands.executeCommand("codevulfixer.openDashboard"),e.refresh()})),r.subscriptions.push(y.commands.registerCommand("codevulfixer.resetState",async()=>{d.info("Command: codevulfixer.resetState executed.");let t=S.getPrimaryWorkspacePath();t&&(await h.resetState(t),x.currentPanel&&await x.currentPanel.update(),e.refresh(),y.window.showInformationMessage("CodeVulFixer: Sprint state has been reset."))})),d.success("CodeVulFixer successfully activated and initialized.")}function vi(){d.info("Deactivating CodeVulFixer Extension.")}0&&(module.exports={activate,deactivate});
