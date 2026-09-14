import{r as d,j as l}from"./vendor-react-Be1CJpd6.js";function oe(){const L=d.useRef(null),k=d.useRef(null),M=d.useRef(null),R=d.useRef(null),T=d.useRef(null),z=d.useRef(null),[x,K]=d.useState(!1),[j,q]=d.useState(()=>typeof window>"u"||document.documentElement.classList.contains("dark")?"dark":"light");d.useEffect(()=>{const s=new MutationObserver(()=>{const p=document.documentElement.classList.contains("dark");q(p?"dark":"light")});return s.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),()=>s.disconnect()},[]),d.useEffect(()=>{const s=x?"disable cursor":"activate cursor";let p="",i=null;const c=()=>{p=""},m=a=>{a.repeat||!a.key||a.key.length!==1||a.ctrlKey||a.metaKey||a.altKey||(clearTimeout(i),i=setTimeout(c,1500),p=(p+a.key.toLowerCase()).slice(-s.length),p===s&&(clearTimeout(i),K(g=>!g)))};return document.addEventListener("keydown",m),()=>{clearTimeout(i),document.removeEventListener("keydown",m)}},[x]),d.useEffect(()=>{if(!x)return;const s=document.body,p=document.documentElement,i=L.current,c=i==null?void 0:i.getContext("2d"),m=k.current,a=M.current,g=R.current,w=T.current,f=z.current;if(!(i&&c&&m&&a&&g&&w&&f))return;const B=window.matchMedia("(prefers-reduced-motion: reduce)").matches,e={x:window.innerWidth*.5,y:window.innerHeight*.5,px:window.innerWidth*.5,py:window.innerHeight*.5,rx:window.innerWidth*.5,ry:window.innerHeight*.5,gx:window.innerWidth*.5,gy:window.innerHeight*.5,visible:!1,mode:"normal",lastEmit:0,hue:180,particles:[]},C=()=>{const t=Math.min(window.devicePixelRatio||1,2);i.width=Math.floor(window.innerWidth*t),i.height=Math.floor(window.innerHeight*t),i.style.width=`${window.innerWidth}px`,i.style.height=`${window.innerHeight}px`,c.setTransform(t,0,0,t,0,0)},h=(t,r,o)=>{t.style.left=`${r}px`,t.style.top=`${o}px`},O=(t,r,o=2)=>{if(!B)for(let n=0;n<o;n+=1)e.particles.push({x:t,y:r,vx:(Math.random()-.5)*(2.2+Math.random()*1.8),vy:(Math.random()-.5)*(2.2+Math.random()*1.8),life:1,size:.8+Math.random()*2.8,hue:e.hue+(Math.random()*32-16)})},U=(t,r,o=10)=>{if(!B)for(let n=0;n<o;n+=1)e.particles.push({x:t,y:r,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1,size:1+Math.random()*3.5,hue:e.hue+(Math.random()*70-35)})},V=(t,r)=>{const o=document.createElement("div");o.className="cp-click-wave",h(o,t,r),document.body.appendChild(o),o.addEventListener("animationend",()=>o.remove(),{once:!0})},G=t=>!!t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable),J=t=>!!t&&!!t.closest("[data-cursor='loading'], .loading-btn"),Q=t=>!!t&&!!t.closest("button, a, [role='button'], .magnetic, .cursor-hoverable, select, summary"),b=t=>{e.mode=t,s.classList.toggle("cp-pointer",t==="pointer"),s.classList.toggle("cp-text",t==="text"),s.classList.toggle("cp-loading",t==="loading")},P=t=>{if(J(t)){b("loading");return}if(G(t)){b("text");return}if(Q(t)){b("pointer");return}b("normal")},Z=t=>{e.visible=!0,e.x=t.clientX,e.y=t.clientY,e.hue=j==="light"?(210+e.x/window.innerWidth*60)%360:(180+e.x/window.innerWidth*170+e.y/window.innerHeight*40)%360,p.style.setProperty("--cursor-hue",String(e.hue)),p.style.setProperty("--cursor-accent",String((e.hue+120)%360));const r=document.elementFromPoint(e.x,e.y);P(r);const o=performance.now(),n=e.x-e.px,u=e.y-e.py;Math.hypot(n,u)>10&&o-e.lastEmit>10&&(e.lastEmit=o,O(e.x,e.y,e.mode==="pointer"?5:2)),e.px=e.x,e.py=e.y,h(m,e.x,e.y),h(w,e.x,e.y),h(f,e.x,e.y)},_=[...document.querySelectorAll(".magnetic")],$=[];_.forEach(t=>{let r=null;const o=()=>{r=t.getBoundingClientRect()},n=E=>{r=r||t.getBoundingClientRect();const te=E.clientX-(r.left+r.width/2),ne=E.clientY-(r.top+r.height/2),D=.18;t.style.transform=`translate3d(${te*D}px, ${ne*D}px, 0)`},u=()=>{t.style.transform=""};t.addEventListener("mouseenter",o),t.addEventListener("mousemove",n),t.addEventListener("mouseleave",u),$.push({el:t,onEnter:o,onMove:n,onLeave:u})});const y=()=>{if(!e.visible){requestAnimationFrame(y);return}e.rx+=(e.x-e.rx)*.22,e.ry+=(e.y-e.ry)*.22,e.gx+=(e.x-e.gx)*.12,e.gy+=(e.y-e.gy)*.12,h(a,e.rx,e.ry),h(g,e.gx,e.gy);const t=e.x-e.rx,r=e.y-e.ry;g.style.transform=`translate(-50%, -50%) translate(${t*.06}px, ${r*.06}px)`,c.clearRect(0,0,window.innerWidth,window.innerHeight),c.globalCompositeOperation="lighter";for(let o=e.particles.length-1;o>=0;o-=1){const n=e.particles[o];if(n.x+=n.vx,n.y+=n.vy,n.vx*=.98,n.vy*=.98,n.life-=.025,n.life<=0){e.particles.splice(o,1);continue}const u=Math.max(0,n.life);c.beginPath(),c.fillStyle=`hsla(${n.hue}, 100%, 65%, ${u})`,c.shadowBlur=16,c.shadowColor=`hsla(${n.hue}, 100%, 65%, ${u})`,c.arc(n.x,n.y,n.size,0,Math.PI*2),c.fill()}e.mode==="text"?(m.style.borderRadius="999px",a.style.borderRadius="10px"):(m.style.borderRadius="50%",a.style.borderRadius="50%"),requestAnimationFrame(y)};s.style.cursor="none",C();const W=[m,a,g,w,f],v=t=>{W.forEach(r=>{r.style.opacity=t?"1":"0"})},F=C,H=Z,N=()=>{v(!1),e.visible=!1},S=t=>{v(!0),e.visible=!0,e.x=t.clientX,e.y=t.clientY,e.px=t.clientX,e.py=t.clientY,h(m,e.x,e.y),h(w,e.x,e.y),h(f,e.x,e.y)},ee=()=>v(!0),X=t=>{s.classList.add("cp-click"),V(t.clientX,t.clientY),U(t.clientX,t.clientY,14),window.setTimeout(()=>s.classList.remove("cp-click"),420)},Y=()=>s.classList.remove("cp-click"),A=t=>{const r=document.elementFromPoint(t.clientX,t.clientY);P(r)};return window.addEventListener("resize",F),window.addEventListener("mousemove",H,{passive:!0}),document.documentElement.addEventListener("mouseleave",N),document.documentElement.addEventListener("mouseenter",S),window.addEventListener("mousedown",X),window.addEventListener("mouseup",Y),document.addEventListener("mousemove",A,{passive:!0}),v(!1),window.addEventListener("mousemove",ee,{once:!0}),y(),()=>{W.forEach(t=>{t.style.opacity=""}),s.style.cursor="",window.removeEventListener("resize",F),window.removeEventListener("mousemove",H),document.documentElement.removeEventListener("mouseleave",N),document.documentElement.removeEventListener("mouseenter",S),window.removeEventListener("mousedown",X),window.removeEventListener("mouseup",Y),document.removeEventListener("mousemove",A),$.forEach(({el:t,onEnter:r,onMove:o,onLeave:n})=>{t.removeEventListener("mouseenter",r),t.removeEventListener("mousemove",o),t.removeEventListener("mouseleave",n)})}},[j,x]);const I=d.useMemo(()=>`
      :root {
        --cursor-x: 0px;
        --cursor-y: 0px;
        --cursor-hue: 180;
        --cursor-accent: 300;

        --shadow-a: rgba(0, 240, 255, 0.55);
        --shadow-b: rgba(255, 0, 200, 0.35);
        --ring: rgba(0, 240, 255, 0.95);
        --ring-2: rgba(255, 0, 200, 0.95);
        --glow-a: rgba(0, 240, 255, 0.25);
        --glow-b: rgba(255, 0, 200, 0.14);
      }

      html[data-theme='light'] {
        --shadow-a: rgba(13, 77, 155, 0.28);
        --shadow-b: rgba(117, 31, 99, 0.16);
        --ring: rgba(10, 40, 78, 0.92);
        --ring-2: rgba(128, 31, 97, 0.82);
        --glow-a: rgba(10, 40, 78, 0.05);
        --glow-b: rgba(128, 31, 97, 0.04);
      }

      #cp-canvas {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9990;
      }

      .cp-core,
      .cp-ring,
      .cp-glow,
      .cp-dot,
      .cp-spinner {
        position: fixed;
        left: 0;
        top: 0;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        will-change: transform, left, top, width, height, opacity;
      }

      .cp-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,1) 0 20%, rgba(0,240,255,1) 35%, rgba(0,240,255,0.2) 100%);
        box-shadow: 0 0 10px var(--shadow-a), 0 0 30px var(--shadow-b);
        z-index: 10002;
      }

      .cp-ring {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1.5px solid var(--ring);
        box-shadow: 0 0 14px var(--shadow-a), inset 0 0 8px var(--shadow-b);
        mix-blend-mode: screen;
        z-index: 10000;
        transition: width 180ms ease, height 180ms ease, border-color 180ms ease, opacity 180ms ease, box-shadow 180ms ease, border-radius 180ms ease;
      }

      html[data-theme='light'] .cp-ring {
        border: 1px solid rgba(16, 34, 56, 0.25);
        box-shadow: 0 6px 18px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9);
      }

      .cp-glow {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          hsla(var(--cursor-hue), 100%, 65%, 0.22) 0%,
          hsla(var(--cursor-accent), 100%, 60%, 0.12) 34%,
          rgba(0, 0, 0, 0) 72%
        );
        filter: blur(7px);
        opacity: 0.95;
        mix-blend-mode: screen;
        z-index: 9998;
        transition: width 220ms ease, height 220ms ease, opacity 220ms ease, filter 220ms ease;
      }

      html[data-theme='light'] .cp-glow {
        filter: blur(4px);
        opacity: 0.6;
      }

      .cp-core {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #00f0ff 40%, #ff00c8 100%);
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.9), 0 0 24px rgba(255, 0, 200, 0.55);
        z-index: 10003;
        transition: width 160ms ease, height 160ms ease, border-radius 160ms ease, background 160ms ease, opacity 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      }

      html[data-theme='light'] .cp-core {
        background: linear-gradient(135deg, #102238, #3b82f6);
        box-shadow: 0 0 10px rgba(59,130,246,0.25);
      }

      .cp-spinner {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid rgba(0, 240, 255, 0.18);
        border-top-color: var(--ring);
        border-right-color: var(--ring-2);
        opacity: 0;
        z-index: 10001;
        animation: cp-spin 0.85s linear infinite;
        transition: opacity 180ms ease, width 180ms ease, height 180ms ease;
        box-shadow: 0 0 16px var(--shadow-a);
      }

      @keyframes cp-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

      .cp-pointer .cp-ring {
        width: 52px;
        height: 52px;
        border-color: var(--ring-2);
        box-shadow: 0 0 18px rgba(255, 0, 200, 0.65), 0 0 42px rgba(0, 240, 255, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.08);
      }
      .cp-pointer .cp-core {
        width: 10px;
        height: 10px;
        box-shadow: 0 0 12px rgba(255, 0, 200, 0.95), 0 0 28px rgba(0, 240, 255, 0.8);
      }
      .cp-pointer .cp-glow {
        width: 120px;
        height: 120px;
        filter: blur(10px);
        opacity: 1;
      }

      .cp-text .cp-core {
        width: 3px;
        height: 28px;
        border-radius: 999px;
        background: var(--ring);
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.95), 0 0 24px rgba(255, 0, 200, 0.28);
        animation: cp-textBlink 1s steps(2, jump-none) infinite;
      }
      .cp-text .cp-ring {
        width: 18px;
        height: 42px;
        border-radius: 8px;
        border-color: var(--ring);
        box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
      }
      .cp-text .cp-glow { width: 60px; height: 60px; opacity: 0.7; }
      @keyframes cp-textBlink { 50% { opacity: 0.45; } }

      .cp-loading .cp-spinner { opacity: 1; width: 34px; height: 34px; }
      .cp-loading .cp-ring {
        width: 40px;
        height: 40px;
        border-color: rgba(0, 240, 255, 0.55);
        box-shadow: 0 0 18px rgba(0, 240, 255, 0.35);
      }
      .cp-loading .cp-core {
        width: 6px;
        height: 6px;
        background: #ffffff;
        box-shadow: 0 0 14px rgba(255,255,255,0.65);
      }
      .cp-loading .cp-glow { width: 110px; height: 110px; opacity: 1; }

      .cp-click .cp-ring { animation: cp-pulseRing 420ms ease-out; }
      .cp-click .cp-core { animation: cp-pulseDot 420ms ease-out; }
      @keyframes cp-pulseRing {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
      @keyframes cp-pulseDot {
        0% { transform: translate(-50%, -50%) scale(1); }
        60% { transform: translate(-50%, -50%) scale(1.6); }
        100% { transform: translate(-50%, -50%) scale(1); }
      }

      .cp-click-wave {
        position: fixed;
        left: 0;
        top: 0;
        width: 18px;
        height: 18px;
        border: 1px solid rgba(0, 240, 255, 0.9);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9997;
        box-shadow: 0 0 18px rgba(0, 240, 255, 0.7), 0 0 42px rgba(255, 0, 200, 0.3);
        animation: cp-wave 650ms ease-out forwards;
        mix-blend-mode: screen;
      }
      @keyframes cp-wave {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(8); }
      }

      html[data-theme='light'] body {
        background: radial-gradient(circle at top, rgba(59,130,246,0.06), transparent 40%),
                    linear-gradient(135deg, #f5f9ff, #eaf2ff);
      }
      html[data-theme='light'] body::before {
        opacity: 0.25;
      }

      @media (prefers-reduced-motion: reduce) {
        .cp-spinner,
        .cp-core,
        .cp-ring,
        .cp-glow,
        .cp-click-wave { animation: none !important; }
      }
    `,[]);return l.jsxs(l.Fragment,{children:[l.jsx("style",{children:I}),x&&l.jsxs(l.Fragment,{children:[l.jsx("canvas",{id:"cp-canvas",ref:L}),l.jsx("div",{ref:R,className:"cp-glow"}),l.jsx("div",{ref:M,className:"cp-ring"}),l.jsx("div",{ref:k,className:"cp-core"}),l.jsx("div",{ref:z,className:"cp-spinner"}),l.jsx("div",{ref:T,className:"cp-dot"})]})]})}export{oe as default};
