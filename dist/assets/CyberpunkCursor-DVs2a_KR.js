import{r as d,b as l}from"./vendor-react-ClUwnUMM.js";function re(){const k=d.useRef(null),L=d.useRef(null),N=d.useRef(null),C=d.useRef(null),M=d.useRef(null),R=d.useRef(null),[x,Y]=d.useState(!1),[D,K]=d.useState(()=>typeof window>"u"||document.documentElement.classList.contains("dark")?"dark":"light");d.useEffect(()=>{const s=new MutationObserver(()=>{const m=document.documentElement.classList.contains("dark");K(m?"dark":"light")});return s.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),()=>s.disconnect()},[]),d.useEffect(()=>{const s=x?"disable cursor":"activate cursor";let m="",i=null;const c=()=>{m=""},p=a=>{a.repeat||!a.key||a.key.length!==1||a.ctrlKey||a.metaKey||a.altKey||(clearTimeout(i),i=setTimeout(c,1500),m=(m+a.key.toLowerCase()).slice(-s.length),m===s&&(clearTimeout(i),Y(g=>!g)))};return document.addEventListener("keydown",p),()=>{clearTimeout(i),document.removeEventListener("keydown",p)}},[x]),d.useEffect(()=>{if(!x)return;const s=document.body,m=document.documentElement,i=k.current,c=i==null?void 0:i.getContext("2d"),p=L.current,a=N.current,g=C.current,b=M.current,f=R.current;if(!(i&&c&&p&&a&&g&&b&&f))return;const P=window.matchMedia("(prefers-reduced-motion: reduce)").matches,e={x:window.innerWidth*.5,y:window.innerHeight*.5,px:window.innerWidth*.5,py:window.innerHeight*.5,rx:window.innerWidth*.5,ry:window.innerHeight*.5,gx:window.innerWidth*.5,gy:window.innerHeight*.5,visible:!1,mode:"normal",lastEmit:0,hue:180,particles:[]},j=()=>{const t=Math.min(window.devicePixelRatio||1,2);i.width=Math.floor(window.innerWidth*t),i.height=Math.floor(window.innerHeight*t),i.style.width=`${window.innerWidth}px`,i.style.height=`${window.innerHeight}px`,c.setTransform(t,0,0,t,0,0)},u=(t,o,r)=>{t.style.left=`${o}px`,t.style.top=`${r}px`},I=(t,o,r=2)=>{if(!P)for(let n=0;n<r;n+=1)e.particles.push({x:t,y:o,vx:(Math.random()-.5)*(2.2+Math.random()*1.8),vy:(Math.random()-.5)*(2.2+Math.random()*1.8),life:1,size:.8+Math.random()*2.8,hue:e.hue+(Math.random()*32-16)})},O=(t,o,r=10)=>{if(!P)for(let n=0;n<r;n+=1)e.particles.push({x:t,y:o,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1,size:1+Math.random()*3.5,hue:e.hue+(Math.random()*70-35)})},U=(t,o)=>{const r=document.createElement("div");r.className="cp-click-wave",u(r,t,o),document.body.appendChild(r),r.addEventListener("animationend",()=>r.remove(),{once:!0})},G=t=>!!t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable),J=t=>!!t&&!!t.closest("[data-cursor='loading'], .loading-btn"),Q=t=>!!t&&!!t.closest("button, a, [role='button'], .magnetic, .cursor-hoverable, select, summary"),w=t=>{e.mode=t,s.classList.toggle("cp-pointer",t==="pointer"),s.classList.toggle("cp-text",t==="text"),s.classList.toggle("cp-loading",t==="loading")},W=t=>{if(J(t)){w("loading");return}if(G(t)){w("text");return}if(Q(t)){w("pointer");return}w("normal")},Z=t=>{e.visible=!0,e.x=t.clientX,e.y=t.clientY,e.hue=D==="light"?(210+e.x/window.innerWidth*60)%360:(180+e.x/window.innerWidth*170+e.y/window.innerHeight*40)%360,m.style.setProperty("--cursor-hue",String(e.hue)),m.style.setProperty("--cursor-accent",String((e.hue+120)%360));const o=document.elementFromPoint(e.x,e.y);W(o);const r=performance.now(),n=e.x-e.px,h=e.y-e.py;Math.hypot(n,h)>10&&r-e.lastEmit>10&&(e.lastEmit=r,I(e.x,e.y,e.mode==="pointer"?5:2)),e.px=e.x,e.py=e.y,u(p,e.x,e.y),u(b,e.x,e.y),u(f,e.x,e.y)},_=[...document.querySelectorAll(".magnetic")],T=[];_.forEach(t=>{let o=null;const r=()=>{o=t.getBoundingClientRect()},n=E=>{o=o||t.getBoundingClientRect();const te=E.clientX-(o.left+o.width/2),ne=E.clientY-(o.top+o.height/2),X=.18;t.style.transform=`translate3d(${te*X}px, ${ne*X}px, 0)`},h=()=>{t.style.transform=""};t.addEventListener("mouseenter",r),t.addEventListener("mousemove",n),t.addEventListener("mouseleave",h),T.push({el:t,onEnter:r,onMove:n,onLeave:h})});const y=()=>{if(!e.visible){requestAnimationFrame(y);return}e.rx+=(e.x-e.rx)*.22,e.ry+=(e.y-e.ry)*.22,e.gx+=(e.x-e.gx)*.12,e.gy+=(e.y-e.gy)*.12,u(a,e.rx,e.ry),u(g,e.gx,e.gy);const t=e.x-e.rx,o=e.y-e.ry;g.style.transform=`translate(-50%, -50%) translate(${t*.06}px, ${o*.06}px)`,c.clearRect(0,0,window.innerWidth,window.innerHeight),c.globalCompositeOperation="lighter";for(let r=e.particles.length-1;r>=0;r-=1){const n=e.particles[r];if(n.x+=n.vx,n.y+=n.vy,n.vx*=.98,n.vy*=.98,n.life-=.025,n.life<=0){e.particles.splice(r,1);continue}const h=Math.max(0,n.life);c.beginPath(),c.fillStyle=`hsla(${n.hue}, 100%, 65%, ${h})`,c.shadowBlur=16,c.shadowColor=`hsla(${n.hue}, 100%, 65%, ${h})`,c.arc(n.x,n.y,n.size,0,Math.PI*2),c.fill()}e.mode==="text"?(p.style.borderRadius="999px",a.style.borderRadius="10px"):(p.style.borderRadius="50%",a.style.borderRadius="50%"),requestAnimationFrame(y)};s.style.cursor="none",j();const z=[p,a,g,b,f],v=t=>{z.forEach(o=>{o.style.opacity=t?"1":"0"})},A=j,B=Z,$=()=>{v(!1),e.visible=!1},V=t=>{v(!0),e.visible=!0,e.x=t.clientX,e.y=t.clientY,e.px=t.clientX,e.py=t.clientY,u(p,e.x,e.y),u(b,e.x,e.y),u(f,e.x,e.y)},ee=()=>v(!0),F=t=>{s.classList.add("cp-click"),U(t.clientX,t.clientY),O(t.clientX,t.clientY,14),window.setTimeout(()=>s.classList.remove("cp-click"),420)},H=()=>s.classList.remove("cp-click"),S=t=>{const o=document.elementFromPoint(t.clientX,t.clientY);W(o)};return window.addEventListener("resize",A),window.addEventListener("mousemove",B,{passive:!0}),document.documentElement.addEventListener("mouseleave",$),document.documentElement.addEventListener("mouseenter",V),window.addEventListener("mousedown",F),window.addEventListener("mouseup",H),document.addEventListener("mousemove",S,{passive:!0}),v(!1),window.addEventListener("mousemove",ee,{once:!0}),y(),()=>{z.forEach(t=>{t.style.opacity=""}),s.style.cursor="",window.removeEventListener("resize",A),window.removeEventListener("mousemove",B),document.documentElement.removeEventListener("mouseleave",$),document.documentElement.removeEventListener("mouseenter",V),window.removeEventListener("mousedown",F),window.removeEventListener("mouseup",H),document.removeEventListener("mousemove",S),T.forEach(({el:t,onEnter:o,onMove:r,onLeave:n})=>{t.removeEventListener("mouseenter",o),t.removeEventListener("mousemove",r),t.removeEventListener("mouseleave",n)})}},[D,x]);const q=d.useMemo(()=>`
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
    `,[]);return l.jsxDEV(l.Fragment,{children:[l.jsxDEV("style",{children:q},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:605,columnNumber:4},this),x&&l.jsxDEV(l.Fragment,{children:[l.jsxDEV("canvas",{id:"cp-canvas",ref:k},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:608,columnNumber:6},this),l.jsxDEV("div",{ref:C,className:"cp-glow"},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:610,columnNumber:6},this),l.jsxDEV("div",{ref:N,className:"cp-ring"},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:611,columnNumber:6},this),l.jsxDEV("div",{ref:L,className:"cp-core"},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:612,columnNumber:6},this),l.jsxDEV("div",{ref:R,className:"cp-spinner"},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:613,columnNumber:6},this),l.jsxDEV("div",{ref:M,className:"cp-dot"},void 0,!1,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:614,columnNumber:6},this)]},void 0,!0,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:607,columnNumber:5},this)]},void 0,!0,{fileName:"/home/ccm/Desktop/A-Peronson-s-Website/src/components/ui/CyberpunkCursor.jsx",lineNumber:604,columnNumber:3},this)}export{re as default};
