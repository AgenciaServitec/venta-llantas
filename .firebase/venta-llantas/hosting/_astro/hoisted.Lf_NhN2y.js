window.dataLayer=window.dataLayer||[];function _(){dataLayer.push(arguments)}_("js",new Date);_("config","AW-16522189292");const P=document.querySelector("#btn-submit"),se=document.querySelector("#error-message-wrapper"),U=document.querySelector("#fullName"),W=document.querySelector("#email"),Y=document.querySelector("#phoneNumber"),V=document.querySelector("#message"),ae=()=>{U.value="",W.value="",Y.value="",V.value=""},ie=e=>({contact:{fullName:e.fullName,email:e.email,phone:{countryCode:"+51",number:e.phoneNumber},message:e.message,hostname:"hankookalvillantas.com"}});P&&P.addEventListener("click",async()=>{const e={fullName:U.value,email:W.value,phoneNumber:Y.value,message:V.value};if(e.fullName===""||e.email===""||e.phoneNumber==="")return se.innerHTML=`<div class="error-message" style="border-radius: 1em;
      padding: 0.3em 1em;
      background: rgba(236, 11, 11, 0.22);
      width: auto;
      margin: auto auto 0.7em auto;
      color: #e1e1e1;
      border: 1px solid red;">Faltan los siguiente campos: ${e.fullName===""?"Nombres y apellidos, ":""} ${e.email===""?"Email, ":""} ${e.phoneNumber===""?"Teléfono":""}</div>`;const t=ie(e),n=await fetch("https://api-servitecsales.web.app/emails/contact",{method:"POST",headers:{"content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(t)});if(!n.ok)throw new Error(n.statusText);ae(),window.location.href="/success"});const O=document.querySelector("#header-item"),I="header-sticky";window.addEventListener("scroll",()=>{window.pageYOffset>93?O.classList.add(I):O.classList.remove(I)});const ce="astro:before-preparation",le="astro:after-preparation",ue="astro:before-swap",de="astro:after-swap",fe=e=>document.dispatchEvent(new Event(e));class X extends Event{from;to;direction;navigationType;sourceElement;info;newDocument;constructor(t,n,o,r,i,l,h,a,f){super(t,n),this.from=o,this.to=r,this.direction=i,this.navigationType=l,this.sourceElement=h,this.info=a,this.newDocument=f,Object.defineProperties(this,{from:{enumerable:!0},to:{enumerable:!0,writable:!0},direction:{enumerable:!0,writable:!0},navigationType:{enumerable:!0},sourceElement:{enumerable:!0},info:{enumerable:!0},newDocument:{enumerable:!0,writable:!0}})}}class me extends X{formData;loader;constructor(t,n,o,r,i,l,h,a,f){super(ce,{cancelable:!0},t,n,o,r,i,l,h),this.formData=a,this.loader=f.bind(this,this),Object.defineProperties(this,{formData:{enumerable:!0},loader:{enumerable:!0,writable:!0}})}}class he extends X{direction;viewTransition;swap;constructor(t,n,o){super(ue,void 0,t.from,t.to,t.direction,t.navigationType,t.sourceElement,t.info,t.newDocument),this.direction=t.direction,this.viewTransition=n,this.swap=o.bind(this,this),Object.defineProperties(this,{direction:{enumerable:!0},viewTransition:{enumerable:!0},swap:{enumerable:!0,writable:!0}})}}async function pe(e,t,n,o,r,i,l,h){const a=new me(e,t,n,o,r,i,window.document,l,h);return document.dispatchEvent(a)&&(await a.loader(),a.defaultPrevented||(fe(le),a.navigationType!=="traverse"&&D({scrollX,scrollY}))),a}async function we(e,t,n){const o=new he(e,t,n);return document.dispatchEvent(o),o.swap(),o}const ye=history.pushState.bind(history),k=history.replaceState.bind(history),D=e=>{history.state&&(history.scrollRestoration="manual",k({...history.state,...e},""))},N=!!document.startViewTransition,R=()=>!!document.querySelector('[name="astro-view-transitions-enabled"]'),B=(e,t)=>e.pathname===t.pathname&&e.search===t.search;let A,y,v=!1,j;const K=e=>document.dispatchEvent(new Event(e)),G=()=>K("astro:page-load"),ge=()=>{let e=document.createElement("div");e.setAttribute("aria-live","assertive"),e.setAttribute("aria-atomic","true"),e.className="astro-route-announcer",document.body.append(e),setTimeout(()=>{let t=document.title||document.querySelector("h1")?.textContent||location.pathname;e.textContent=t},60)},p="data-astro-transition-persist",J="data-astro-transition",z="data-astro-transition-fallback";let M,b=0;history.state?(b=history.state.index,scrollTo({left:history.state.scrollX,top:history.state.scrollY})):R()&&(k({index:b,scrollX,scrollY},""),history.scrollRestoration="manual");const be=(e,t)=>{let n=!1,o=!1;return(...r)=>{if(n){o=!0;return}e(...r),n=!0,setTimeout(()=>{o&&(o=!1,e(...r)),n=!1},t)}};async function ve(e,t){try{const n=await fetch(e,t),o=n.headers.get("content-type")?.replace(/;.*$/,"");return o!=="text/html"&&o!=="application/xhtml+xml"?null:{html:await n.text(),redirected:n.redirected?n.url:void 0,mediaType:o}}catch{return null}}function Q(){const e=document.querySelector('[name="astro-view-transitions-fallback"]');return e?e.getAttribute("content"):"animate"}function Te(){let e=Promise.resolve();for(const t of Array.from(document.scripts)){if(t.dataset.astroExec==="")continue;const n=document.createElement("script");n.innerHTML=t.innerHTML;for(const o of t.attributes){if(o.name==="src"){const r=new Promise(i=>{n.onload=i});e=e.then(()=>r)}n.setAttribute(o.name,o.value)}n.dataset.astroExec="",t.replaceWith(n)}return e}const Z=(e,t,n,o)=>{const r=B(t,e);let i=!1;if(e.href!==location.href&&!o)if(n.history==="replace"){const l=history.state;k({...n.state,index:l.index,scrollX:l.scrollX,scrollY:l.scrollY},"",e.href)}else ye({...n.state,index:++b,scrollX:0,scrollY:0},"",e.href);A=e,r||(scrollTo({left:0,top:0,behavior:"instant"}),i=!0),o?scrollTo(o.scrollX,o.scrollY):(e.hash?(history.scrollRestoration="auto",location.href=e.href):i||scrollTo({left:0,top:0,behavior:"instant"}),history.scrollRestoration="manual")};function Ee(e){const t=[];for(const n of e.querySelectorAll("head link[rel=stylesheet]"))if(!document.querySelector(`[${p}="${n.getAttribute(p)}"], link[rel=stylesheet][href="${n.getAttribute("href")}"]`)){const o=document.createElement("link");o.setAttribute("rel","preload"),o.setAttribute("as","style"),o.setAttribute("href",n.getAttribute("href")),t.push(new Promise(r=>{["load","error"].forEach(i=>o.addEventListener(i,r)),document.head.append(o)}))}return t}async function q(e,t,n,o){const r=(s,u)=>{const m=s.getAttribute(p),w=m&&u.head.querySelector(`[${p}="${m}"]`);if(w)return w;if(s.matches("link[rel=stylesheet]")){const g=s.getAttribute("href");return u.head.querySelector(`link[rel=stylesheet][href="${g}"]`)}return null},i=()=>{const s=document.activeElement;if(s?.closest(`[${p}]`)){if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement){const u=s.selectionStart,m=s.selectionEnd;return{activeElement:s,start:u,end:m}}return{activeElement:s}}else return{activeElement:null}},l=({activeElement:s,start:u,end:m})=>{s&&(s.focus(),(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement)&&(s.selectionStart=u,s.selectionEnd=m))},h=s=>{const u=document.documentElement,m=[...u.attributes].filter(({name:c})=>(u.removeAttribute(c),c.startsWith("data-astro-")));[...s.newDocument.documentElement.attributes,...m].forEach(({name:c,value:d})=>u.setAttribute(c,d));for(const c of document.scripts)for(const d of s.newDocument.scripts)if(!c.src&&c.textContent===d.textContent||c.src&&c.type===d.type&&c.src===d.src){d.dataset.astroExec="";break}for(const c of Array.from(document.head.children)){const d=r(c,s.newDocument);d?d.remove():c.remove()}document.head.append(...s.newDocument.head.children);const w=document.body,g=i();document.body.replaceWith(s.newDocument.body);for(const c of w.querySelectorAll(`[${p}]`)){const d=c.getAttribute(p),S=document.querySelector(`[${p}="${d}"]`);S&&S.replaceWith(c)}l(g)};async function a(s){function u(c){const d=c.effect;return!d||!(d instanceof KeyframeEffect)||!d.target?!1:window.getComputedStyle(d.target,d.pseudoElement).animationIterationCount==="infinite"}const m=document.getAnimations();document.documentElement.setAttribute(z,s);const g=document.getAnimations().filter(c=>!m.includes(c)&&!u(c));return Promise.all(g.map(c=>c.finished))}if(!v)document.documentElement.setAttribute(J,e.direction),o==="animate"&&await a("old");else throw new DOMException("Transition was skipped");const f=await we(e,y,h);Z(f.to,f.from,t,n),K(de),o==="animate"&&!v&&a("new").then(()=>j())}async function ee(e,t,n,o,r){if(!R()||location.origin!==n.origin){location.href=n.href;return}const i=r?"traverse":o.history==="replace"?"replace":"push";if(i!=="traverse"&&D({scrollX,scrollY}),B(t,n)&&n.hash){Z(n,t,o,r);return}const l=await pe(t,n,e,i,o.sourceElement,o.info,o.formData,h);if(l.defaultPrevented){location.href=n.href;return}async function h(a){const f=a.to.href,s={};a.formData&&(s.method="POST",s.body=a.formData);const u=await ve(f,s);if(u===null){a.preventDefault();return}if(u.redirected&&(a.to=new URL(u.redirected)),M??=new DOMParser,a.newDocument=M.parseFromString(u.html,u.mediaType),a.newDocument.querySelectorAll("noscript").forEach(w=>w.remove()),!a.newDocument.querySelector('[name="astro-view-transitions-enabled"]')&&!a.formData){a.preventDefault();return}const m=Ee(a.newDocument);m.length&&await Promise.all(m)}if(v=!1,N)y=document.startViewTransition(async()=>await q(l,o,r));else{const a=(async()=>{await new Promise(f=>setTimeout(f)),await q(l,o,r,Q())})();y={updateCallbackDone:a,ready:a,finished:new Promise(f=>j=f),skipTransition:()=>{v=!0}}}y.ready.then(async()=>{await Te(),G(),ge()}),y.finished.then(()=>{document.documentElement.removeAttribute(J),document.documentElement.removeAttribute(z)}),await y.ready}async function H(e,t){await ee("forward",A,new URL(e,location.href),t??{})}function Ae(e){if(!R()&&e.state){location.reload();return}if(e.state===null)return;const t=history.state,n=t.index,o=n>b?"forward":"back";b=n,ee(o,A,new URL(location.href),{},t)}const $=()=>{D({scrollX,scrollY})};{(N||Q()!=="none")&&(A=new URL(location.href),addEventListener("popstate",Ae),addEventListener("load",G),"onscrollend"in window?addEventListener("scrollend",$):addEventListener("scroll",be($,350),{passive:!0}));for(const e of document.scripts)e.dataset.astroExec=""}const te=new Set,T=new WeakSet;let L,ne,F=!1;function Se(e){F||(F=!0,L??=e?.prefetchAll??!1,ne??=e?.defaultStrategy??"hover",Le(),ke(),De())}function Le(){for(const e of["touchstart","mousedown"])document.body.addEventListener(e,t=>{E(t.target,"tap")&&x(t.target.href,{with:"fetch",ignoreSlowConnection:!0})},{passive:!0})}function ke(){let e;document.body.addEventListener("focusin",o=>{E(o.target,"hover")&&t(o)},{passive:!0}),document.body.addEventListener("focusout",n,{passive:!0}),re(()=>{for(const o of document.getElementsByTagName("a"))T.has(o)||E(o,"hover")&&(T.add(o),o.addEventListener("mouseenter",t,{passive:!0}),o.addEventListener("mouseleave",n,{passive:!0}))});function t(o){const r=o.target.href;e&&clearTimeout(e),e=setTimeout(()=>{x(r,{with:"fetch"})},80)}function n(){e&&(clearTimeout(e),e=0)}}function De(){let e;re(()=>{for(const t of document.getElementsByTagName("a"))T.has(t)||E(t,"viewport")&&(T.add(t),e??=Ne(),e.observe(t))})}function Ne(){const e=new WeakMap;return new IntersectionObserver((t,n)=>{for(const o of t){const r=o.target,i=e.get(r);o.isIntersecting?(i&&clearTimeout(i),e.set(r,setTimeout(()=>{n.unobserve(r),e.delete(r),x(r.href,{with:"link"})},300))):i&&(clearTimeout(i),e.delete(r))}})}function x(e,t){const n=t?.ignoreSlowConnection??!1;if(!Re(e,n))return;if(te.add(e),(t?.with??"link")==="link"){const r=document.createElement("link");r.rel="prefetch",r.setAttribute("href",e),document.head.append(r)}else fetch(e).catch(r=>{console.log(`[astro] Failed to prefetch ${e}`),console.error(r)})}function Re(e,t){if(!navigator.onLine||!t&&oe())return!1;try{const n=new URL(e,location.href);return location.origin===n.origin&&(location.pathname!==n.pathname||location.search!==n.search)&&!te.has(e)}catch{}return!1}function E(e,t){if(e?.tagName!=="A")return!1;const n=e.dataset.astroPrefetch;return n==="false"?!1:t==="tap"&&(n!=null||L)&&oe()?!0:n==null&&L||n===""?t===ne:n===t}function oe(){if("connection"in navigator){const e=navigator.connection;return e.saveData||/(2|3)g/.test(e.effectiveType)}return!1}function re(e){e();let t=!1;document.addEventListener("astro:page-load",()=>{if(!t){t=!0;return}e()})}function xe(){const e=document.querySelector('[name="astro-view-transitions-fallback"]');return e?e.getAttribute("content"):"animate"}function C(e){return e.dataset.astroReload!==void 0}(N||xe()!=="none")&&(document.addEventListener("click",e=>{let t=e.target;if(t instanceof Element&&(t=t.closest("a, area")),!(t instanceof HTMLAnchorElement)&&!(t instanceof SVGAElement)&&!(t instanceof HTMLAreaElement))return;const n=t instanceof HTMLElement?t.target:t.target.baseVal,o=t instanceof HTMLElement?t.href:t.href.baseVal,r=new URL(o,location.href).origin;C(t)||t.hasAttribute("download")||!t.href||n&&n!=="_self"||r!==location.origin||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.defaultPrevented||(e.preventDefault(),H(o,{history:t.dataset.astroHistory==="replace"?"replace":"auto",sourceElement:t}))}),document.addEventListener("submit",e=>{let t=e.target;if(t.tagName!=="FORM"||C(t))return;const n=t,o=e.submitter,r=new FormData(n,o);let i=o?.getAttribute("formaction")??n.action??location.pathname;const l=o?.getAttribute("formmethod")??n.method;if(l==="dialog")return;const h={sourceElement:o??n};if(l==="get"){const a=new URLSearchParams(r),f=new URL(i);f.search=a.toString(),i=f.toString()}else h.formData=r;e.preventDefault(),H(i,h)}),Se({prefetchAll:!0}));