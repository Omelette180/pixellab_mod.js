// ============================================================
//  Pixel Lab v1.0 — by Omelette
//  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HOW TO USE:
//  1. Upload this file to GitHub
//  2. Open Sandboxels → click the Mods button
//  3. Paste this URL:
//     https://raw.githubusercontent.com/Omelette180/pixellab_mod.js/main/pixellab_mod.js
//  4. Refresh the page
//  5. Click the 🧪 button in the bottom-right corner
//  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  WHAT IT DOES:
//  • Visual element builder — make custom elements with blocks
//  • Pre-made example elements in the Special category
//  • Built-in mod loader — load any other mod by URL
// ============================================================
(function(){
"use strict";
function waitForSandboxels(cb){
  if(typeof elements!=="undefined"&&typeof behaviors!=="undefined")cb();
  else setTimeout(function(){waitForSandboxels(cb);},200);
}
waitForSandboxels(function(){

var VER="1.0",AUTHOR="Omelette";
var SK="pl_ws",SKS="pl_s",SKL="pl_lib";
var SDEF={autosave:true,confirmDelete:true,animatedPreview:false,snapGrid:false,gridSize:20,snapNodes:true,defaultCategory:"special",showLogic:true,liveInject:false,theme:"dark",panelWidth:750};
var S=Object.assign({},SDEF,(function(){try{return JSON.parse(localStorage.getItem(SKS)||"{}");}catch{return{};}})());
var saveSett=function(){localStorage.setItem(SKS,JSON.stringify(S));};

var THEMES={
  dark:{bg:"#0d0e13",surf:"#13151c",panel:"#0f1016",border:"#22253a",text:"#e2e4ee",dim:"#454d60",acc:"#00e5cc",acc2:"#ff4d6a",acc3:"#ffd166",acc4:"#9d7bea",node:"#161820",nodehd:"#1c1f2e",conn:"#00e5cc",badge:"#1c1f2e"},
  neon:{bg:"#04040b",surf:"#0a0814",panel:"#06040a",border:"#1e0832",text:"#f0e0ff",dim:"#5a3070",acc:"#ff00ff",acc2:"#ff2255",acc3:"#ffee00",acc4:"#00ffff",node:"#0a0016",nodehd:"#10001e",conn:"#ff00ff",badge:"#10001e"},
  terminal:{bg:"#080c08",surf:"#0b100b",panel:"#070a07",border:"#162016",text:"#9fe89f",dim:"#3a5a3a",acc:"#00e040",acc2:"#ff4040",acc3:"#e0e000",acc4:"#40e0e0",node:"#0b100b",nodehd:"#0f160f",conn:"#00e040",badge:"#0f160f"},
  light:{bg:"#eef0f5",surf:"#ffffff",panel:"#f5f6fa",border:"#dde0eb",text:"#1c2030",dim:"#7a8099",acc:"#0055ff",acc2:"#e03050",acc3:"#c07000",acc4:"#6030c0",node:"#ffffff",nodehd:"#f0f2f8",conn:"#0055ff",badge:"#f0f2f8"},
};
var T=function(){return THEMES[S.theme]||THEMES.dark;};

// Library
var Lib=(function(){
  var load=function(){try{return JSON.parse(localStorage.getItem(SKL)||"[]");}catch{return[];}};
  var save=function(a){localStorage.setItem(SKL,JSON.stringify(a));};
  return{
    all:load,
    add:function(name,snap){var a=load();var i=a.findIndex(function(x){return x.name===name;});if(i>=0)a[i]={name:name,snap:snap,t:Date.now()};else a.unshift({name:name,snap:snap,t:Date.now()});save(a);},
    del:function(name){save(load().filter(function(x){return x.name!==name;}));},
  };
})();

// ── CSS ───────────────────────────────────────────────────────
var styleTag=document.createElement("style");
document.head.appendChild(styleTag);

function applyCSS(){
  var t=T();
  styleTag.textContent=`
#pl-fab{position:fixed;bottom:18px;right:18px;z-index:99990;background:${t.acc};color:#000;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;font-weight:800;padding:9px 18px;border-radius:6px;border:none;cursor:pointer;box-shadow:0 4px 16px ${t.acc}55;display:flex;align-items:center;gap:6px;transition:all .18s;user-select:none;letter-spacing:.3px;}
#pl-fab:hover{filter:brightness(1.08);transform:translateY(-1px);}
#pl-fab.open{background:${t.acc2};box-shadow:0 4px 16px ${t.acc2}55;}
#pl-rh{position:fixed;top:0;z-index:99993;width:5px;bottom:0;cursor:ew-resize;background:transparent;transition:background .15s;}
#pl-rh:hover,#pl-rh.drag{background:${t.acc}55;}
#pl-panel{position:fixed;top:0;right:0;bottom:0;z-index:99991;display:flex;flex-direction:column;background:${t.bg};font-family:'Segoe UI',system-ui,sans-serif;color:${t.text};box-shadow:-5px 0 28px rgba(0,0,0,.65);transform:translateX(100%);transition:transform .24s cubic-bezier(.4,0,.2,1);min-width:520px;max-width:96vw;}
#pl-panel.open{transform:translateX(0);}
#pl-top{height:46px;background:${t.surf};border-bottom:1px solid ${t.border};display:flex;align-items:center;padding:0 10px;gap:5px;flex-shrink:0;}
.pl-logo{font-size:13px;font-weight:900;color:${t.acc};letter-spacing:-.4px;}
.pl-logo em{color:${t.dim};font-style:normal;font-weight:400;}
.pl-vb{font-size:8px;font-weight:800;background:${t.acc};color:#000;padding:2px 5px;border-radius:3px;margin-left:2px;}
.pl-by{font-size:10px;color:${t.dim};font-style:italic;}
.pl-sep{width:1px;height:22px;background:${t.border};flex-shrink:0;margin:0 2px;}
#pl-elname{background:transparent;border:1px solid ${t.border};color:${t.text};font-size:11px;font-weight:700;padding:4px 8px;border-radius:4px;width:116px;outline:none;font-family:monospace;}
#pl-elname:focus{border-color:${t.acc};}
.pl-btn{background:${t.panel};border:1px solid ${t.border};color:${t.text};font-size:10px;font-weight:700;padding:4px 8px;border-radius:4px;cursor:pointer;transition:all .1s;font-family:inherit;white-space:nowrap;line-height:1.4;}
.pl-btn:hover{border-color:${t.acc};color:${t.acc};}
.pl-btn.ok{background:${t.acc};color:#000;border-color:${t.acc};}
.pl-btn.ok:hover{filter:brightness(1.08);}
.pl-btn.red{color:${t.acc2};}
.pl-btn.red:hover{border-color:${t.acc2};}
#pl-stat{font-size:9px;color:${t.dim};margin-left:auto;font-family:monospace;}
#pl-close{background:none;border:none;color:${t.dim};font-size:18px;cursor:pointer;padding:3px 6px;border-radius:4px;line-height:1;margin-left:2px;}
#pl-close:hover{color:${t.acc2};}
#pl-tabs{display:flex;border-bottom:1px solid ${t.border};background:${t.panel};flex-shrink:0;overflow-x:auto;}
.pl-tab{padding:7px 11px;font-size:10px;font-weight:700;color:${t.dim};cursor:pointer;border-bottom:2.5px solid transparent;transition:all .12s;user-select:none;white-space:nowrap;flex-shrink:0;}
.pl-tab.on{color:${t.acc};border-bottom-color:${t.acc};}
.pl-tab:hover:not(.on){color:${t.text};}
#pl-body{display:flex;flex:1;overflow:hidden;}
#pl-pal{width:168px;background:${t.surf};border-right:1px solid ${t.border};display:flex;flex-direction:column;overflow:hidden;flex-shrink:0;}
.pl-ph{padding:7px 9px 3px;font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:1px;}
#pl-psearch{margin:0 6px 4px;background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:10px;padding:4px 8px;border-radius:4px;outline:none;}
#pl-psearch:focus{border-color:${t.acc};}
#pl-plist{overflow-y:auto;flex:1;padding:0 3px 10px;}
.pl-gh{font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:.6px;padding:5px 4px 2px;cursor:pointer;display:flex;align-items:center;gap:3px;user-select:none;}
.pl-gh:hover{color:${t.text};}
.pl-gi{display:flex;align-items:center;gap:5px;padding:3px 5px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:600;color:${t.text};margin-bottom:1px;border:1px solid transparent;transition:all .08s;opacity:.85;}
.pl-gi:hover{background:${t.node};border-color:${t.border};opacity:1;}
.pl-ico{width:17px;height:17px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;}
#pl-cw{flex:1;position:relative;overflow:hidden;background:${t.bg};}
#pl-cbg{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(${t.border} 1px,transparent 1px);background-size:22px 22px;opacity:.45;}
#pl-ct{position:absolute;inset:0;transform-origin:0 0;}
#pl-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible;}
#pl-nodes{position:absolute;inset:0;z-index:2;}
#pl-hint{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:${t.border};font-size:11px;font-weight:700;pointer-events:none;line-height:2.8;z-index:0;}
#pl-zbar{position:absolute;bottom:9px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;background:${t.surf}ee;border:1px solid ${t.border};border-radius:16px;padding:3px 9px;z-index:10;font-size:10px;color:${t.dim};}
#pl-zbar button{background:none;border:none;color:${t.acc};cursor:pointer;font-size:13px;font-weight:900;padding:0 2px;line-height:1;}
#pl-zpct{font-family:monospace;color:${t.acc};font-weight:700;min-width:32px;text-align:center;font-size:10px;}
.pl-node{position:absolute;min-width:198px;background:${t.node};border:1.5px solid ${t.border};border-radius:7px;box-shadow:0 4px 16px rgba(0,0,0,.4);user-select:none;transition:border-color .08s;overflow:visible;}
.pl-node:hover{border-color:${t.dim};}
.pl-node.sel{border-color:${t.acc}!important;box-shadow:0 0 0 2px ${t.acc}1a,0 4px 16px rgba(0,0,0,.4);}
.pl-nh{padding:6px 8px;background:${t.nodehd};border-radius:6px 6px 0 0;display:flex;align-items:center;gap:5px;cursor:grab;border-bottom:1px solid ${t.border};}
.pl-nh:active{cursor:grabbing;}
.pl-nb2{font-size:8px;font-weight:800;padding:2px 5px;border-radius:3px;color:#000;text-transform:uppercase;flex-shrink:0;}
.pl-nl{font-size:10px;font-weight:700;color:${t.text};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pl-ndel{background:none;border:none;color:${t.dim};cursor:pointer;font-size:11px;padding:0 2px;line-height:1;transition:color .08s;}
.pl-ndel:hover{color:${t.acc2};}
.pl-nb{padding:5px 8px;display:flex;flex-direction:column;gap:4px;overflow:visible;}
.pl-row{display:flex;align-items:center;gap:5px;}
.pl-row label{font-size:9px;color:${t.dim};min-width:60px;font-weight:600;}
.pl-row input,.pl-row select{flex:1;background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:10px;padding:3px 5px;border-radius:3px;outline:none;font-family:monospace;}
.pl-row input:focus,.pl-row select:focus{border-color:${t.acc};}
.pl-row input[type=color]{padding:1px;height:22px;width:32px;cursor:pointer;}
.pl-row input[type=checkbox]{width:13px;height:13px;cursor:pointer;flex:none;accent-color:${t.acc};}
.pl-row textarea{flex:1;background:${t.bg};border:1px solid ${t.border};color:${t.acc4};font-size:9px;padding:4px 5px;border-radius:3px;outline:none;font-family:monospace;min-height:56px;resize:vertical;width:100%;}
.pl-row textarea:focus{border-color:${t.acc4};}
.pl-row select option{background:${t.surf};}
.pl-cz{position:relative;height:0;overflow:visible;}
.pl-dot{position:absolute;width:14px;height:14px;border-radius:50%;border:2.5px solid ${t.conn};background:${t.node};cursor:crosshair;z-index:50;transition:all .1s;box-shadow:0 0 0 2px ${t.bg};}
.pl-dot:hover{background:${t.conn};transform:scale(1.2);}
.pl-dot.on{background:${t.conn};}
.pl-dot.top{top:-8px;left:50%;transform:translateX(-50%);}
.pl-dot.top:hover{transform:translateX(-50%) scale(1.2);}
.pl-dot.top.on{transform:translateX(-50%);}
.pl-dot.bot{bottom:-8px;left:50%;transform:translateX(-50%);}
.pl-dot.bot:hover{transform:translateX(-50%) scale(1.2);}
.pl-dot.bot.on{transform:translateX(-50%);}
#pl-rp{width:200px;background:${t.surf};border-left:1px solid ${t.border};display:flex;flex-direction:column;flex-shrink:0;}
#pl-pv{display:flex;flex-direction:column;flex:1;overflow:hidden;}
#pl-pvh{padding:7px 9px 4px;font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${t.border};display:flex;align-items:center;justify-content:space-between;}
#pl-pvi{padding:9px;display:flex;flex-direction:column;align-items:center;gap:5px;}
#pl-pvc{border-radius:5px;image-rendering:pixelated;border:1px solid ${t.border};cursor:pointer;transition:border-color .12s;}
#pl-pvc:hover{border-color:${t.acc};}
.pl-pvtip{font-size:9px;color:${t.dim};text-align:center;}
#pl-pvn{font-size:12px;font-weight:900;color:${t.text};text-align:center;max-width:178px;overflow:hidden;text-overflow:ellipsis;}
#pl-pvbtns{padding:0 8px 6px;display:flex;flex-direction:column;gap:4px;}
.pl-inj{width:100%;background:${t.acc};color:#000;border:none;font-size:10px;font-weight:800;padding:7px;border-radius:4px;cursor:pointer;font-family:inherit;transition:all .1s;}
.pl-inj:hover{filter:brightness(1.08);}
.pl-inj.done{background:#2ecc71;}
#pl-savelib{width:100%;background:${t.panel};border:1px solid ${t.border};color:${t.acc4};font-size:9px;font-weight:700;padding:5px;border-radius:4px;cursor:pointer;font-family:inherit;transition:all .1s;}
#pl-savelib:hover{border-color:${t.acc4};}
#pl-props{padding:0 8px;overflow-y:auto;flex:1;}
.pl-pr{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid ${t.node};font-size:9px;}
.pl-pk{color:${t.dim};font-family:monospace;}
.pl-pv2{color:${t.acc};font-family:monospace;font-weight:700;max-width:86px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#pl-codeprev{margin:4px 6px;background:${t.bg};border:1px solid ${t.border};border-radius:4px;padding:5px;font-family:monospace;font-size:8px;color:${t.acc4};max-height:90px;overflow-y:auto;white-space:pre;flex-shrink:0;}
#pl-vce{display:none;flex-direction:column;flex:1;overflow:hidden;}
#pl-vce.on{display:flex;}
#pl-vceh{padding:6px 8px;background:${t.nodehd};border-bottom:1px solid ${t.border};display:flex;align-items:center;gap:5px;flex-shrink:0;}
#pl-vceh span{font-size:10px;font-weight:800;color:${t.acc};flex:1;}
#pl-vceback{background:none;border:none;color:${t.dim};cursor:pointer;font-size:11px;padding:2px 5px;border-radius:3px;}
#pl-vceback:hover{color:${t.text};}
#pl-vce-pal{overflow-y:auto;max-height:140px;border-bottom:1px solid ${t.border};padding:4px;flex-shrink:0;}
.vce-clabel{font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:.5px;padding:3px 3px 1px;display:flex;align-items:center;gap:3px;}
.vce-cdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.vce-add{display:inline-block;font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;cursor:pointer;margin:1px;border:1px solid transparent;transition:all .08s;background:transparent;}
.vce-add:hover{filter:brightness(1.15);}
#pl-vce-script{flex:1;overflow-y:auto;padding:5px;}
.vce-block{background:${t.node};border:1px solid ${t.border};border-radius:5px;margin-bottom:4px;overflow:hidden;}
.vce-bh{display:flex;align-items:center;gap:4px;padding:4px 7px;font-size:9px;font-weight:800;color:#000;cursor:default;}
.vce-bhdel{background:none;border:none;color:rgba(0,0,0,.4);cursor:pointer;font-size:10px;margin-left:auto;padding:0 2px;}
.vce-bhdel:hover{color:rgba(0,0,0,.8);}
.vce-bb{padding:2px 4px 4px;}
.vce-line{display:flex;align-items:center;flex-wrap:wrap;gap:2px;padding:3px 4px;border-radius:3px;font-size:9px;font-weight:600;margin-bottom:2px;min-height:20px;}
.vce-line:hover{background:rgba(255,255,255,.04);}
.vce-line.cond{border-left:2px solid #cc44ff;}
.vce-line.act{border-left:2px solid #00cc88;}
.vce-line.logic{border-left:2px solid #ff4455;}
.vce-inp{background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.14);color:${t.text};font-size:9px;padding:2px 4px;border-radius:3px;outline:none;min-width:30px;max-width:62px;font-family:monospace;}
.vce-inp:focus{border-color:${t.acc};}
.vce-del{background:none;border:none;color:rgba(255,255,255,.18);cursor:pointer;font-size:10px;margin-left:auto;padding:0 1px;line-height:1;flex-shrink:0;transition:color .08s;}
.vce-del:hover{color:${t.acc2};}
.vce-empty{text-align:center;color:${t.dim};font-size:10px;padding:14px 6px;line-height:1.9;}
#pl-vce-vars{padding:4px 5px;border-top:1px solid ${t.border};max-height:85px;overflow-y:auto;flex-shrink:0;}
.vce-vhd{font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:.6px;padding:2px 1px 3px;}
.vce-vitem{background:${t.panel};border:1px solid ${t.border};border-radius:3px;padding:2px 5px;margin-bottom:2px;display:flex;align-items:center;gap:4px;font-size:9px;}
.vce-vname{color:${t.acc3};font-weight:700;font-family:monospace;flex:1;}
.vce-vtype{color:${t.dim};font-size:8px;}
.vce-vdel{background:none;border:none;color:${t.dim};cursor:pointer;font-size:10px;padding:0;}
.vce-vdel:hover{color:${t.acc2};}
#pl-vce-btm{display:flex;gap:4px;padding:5px;background:${t.surf};border-top:1px solid ${t.border};flex-shrink:0;}
#pl-vce-apply{flex:1;background:${t.acc};color:#000;border:none;font-size:10px;font-weight:800;padding:6px;border-radius:4px;cursor:pointer;}
#pl-vce-apply:hover{filter:brightness(1.08);}
#pl-vce-clr{background:${t.panel};border:1px solid ${t.border};color:${t.dim};font-size:10px;padding:6px 8px;border-radius:4px;cursor:pointer;}
#pl-vce-clr:hover{color:${t.acc2};}
.pl-tabpage{display:none;flex:1;overflow-y:auto;background:${t.bg};padding:14px 18px;}
.pl-tabpage.on{display:block;}
.pl-tabpage h2{font-size:16px;font-weight:900;color:${t.acc};margin-bottom:10px;}
.pl-tabpage h3{font-size:11px;font-weight:800;color:${t.acc3};margin:12px 0 4px;}
.pl-tabpage p,.pl-tabpage li{font-size:11px;color:${t.text};opacity:.8;line-height:1.7;}
.pl-tabpage ul{padding-left:16px;margin-bottom:8px;}
.pl-tabpage code{background:${t.node};color:${t.acc};padding:1px 5px;border-radius:3px;font-family:monospace;font-size:10px;}
.pl-tabpage pre{background:${t.node};border:1px solid ${t.border};border-radius:5px;padding:9px;font-family:monospace;font-size:9px;color:${t.acc4};overflow-x:auto;margin:5px 0 10px;}
#pl-modloader{display:none;flex:1;flex-direction:column;overflow:hidden;}
#pl-modloader.on{display:flex;}
#pl-ml-top{padding:12px 16px;border-bottom:1px solid ${t.border};flex-shrink:0;background:${t.surf};}
#pl-ml-top h2{font-size:15px;font-weight:900;color:${t.acc};margin-bottom:6px;}
#pl-ml-top p{font-size:10px;color:${t.dim};margin-bottom:8px;}
#pl-ml-row{display:flex;gap:6px;}
#pl-ml-inp{flex:1;background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:11px;padding:6px 9px;border-radius:5px;outline:none;font-family:monospace;}
#pl-ml-inp:focus{border-color:${t.acc};}
#pl-ml-add{background:${t.acc};color:#000;border:none;font-size:11px;font-weight:800;padding:6px 14px;border-radius:5px;cursor:pointer;}
#pl-ml-add:hover{filter:brightness(1.08);}
#pl-ml-list{flex:1;overflow-y:auto;padding:10px 16px;}
.pl-ml-section{font-size:9px;font-weight:800;color:${t.dim};text-transform:uppercase;letter-spacing:1px;padding:6px 0 3px;}
.pl-ml-item{background:${t.node};border:1px solid ${t.border};border-radius:6px;padding:8px 10px;margin-bottom:5px;display:flex;align-items:center;gap:9px;transition:border-color .1s;}
.pl-ml-item:hover{border-color:${t.dim};}
.pl-ml-icon{font-size:15px;flex-shrink:0;}
.pl-ml-info{flex:1;}
.pl-ml-name{font-size:11px;font-weight:700;color:${t.text};}
.pl-ml-desc{font-size:10px;color:${t.dim};margin-top:1px;}
.pl-ml-badge{font-size:8px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:4px;vertical-align:middle;}
.pl-ml-load{background:${t.surf};border:1px solid ${t.border};color:${t.text};font-size:9px;font-weight:800;padding:4px 10px;border-radius:4px;cursor:pointer;white-space:nowrap;transition:all .1s;}
.pl-ml-load:hover{border-color:${t.acc};color:${t.acc};}
.pl-ml-load.loaded{background:#2ecc7133;border-color:#2ecc71;color:#2ecc71;}
.pl-ml-load.loading{opacity:.6;}
.pl-lib-empty{text-align:center;color:${t.dim};font-size:11px;padding:24px;line-height:2.2;}
.pl-lib-item{background:${t.node};border:1px solid ${t.border};border-radius:6px;padding:7px 10px;margin-bottom:5px;display:flex;align-items:center;gap:7px;transition:border-color .1s;}
.pl-lib-item:hover{border-color:${t.dim};}
.pl-lib-swatch{width:24px;height:24px;border-radius:4px;flex-shrink:0;}
.pl-lib-name{font-size:11px;font-weight:700;color:${t.text};flex:1;}
.pl-lib-date{font-size:9px;color:${t.dim};font-family:monospace;}
.pl-hist-item{background:${t.node};border:1px solid ${t.border};border-radius:4px;padding:5px 9px;margin-bottom:4px;display:flex;align-items:center;cursor:pointer;font-size:10px;color:${t.text};transition:all .08s;}
.pl-hist-item:hover{border-color:${t.acc};color:${t.acc};}
.pl-hist-item.cur{border-color:${t.acc};background:${t.acc}11;}
.pl-hist-time{font-size:9px;color:${t.dim};font-family:monospace;margin-left:auto;}
.pl-stabs{display:flex;gap:3px;margin-bottom:12px;flex-wrap:wrap;}
.pl-stab{padding:4px 9px;font-size:10px;font-weight:700;color:${t.dim};cursor:pointer;border-radius:4px;border:1px solid ${t.border};transition:all .1s;}
.pl-stab.on{background:${t.acc};color:#000;border-color:${t.acc};}
.pl-stab:hover:not(.on){color:${t.text};border-color:${t.dim};}
.pl-sp{display:none;}
.pl-sp.on{display:block;}
.pl-srow{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${t.border};}
.pl-srow:last-child{border-bottom:none;}
.pl-slabel{font-size:11px;color:${t.text};font-weight:600;}
.pl-sdesc{font-size:10px;color:${t.dim};margin-top:2px;max-width:270px;}
.pl-tog{position:relative;width:34px;height:19px;flex-shrink:0;}
.pl-tog input{opacity:0;width:0;height:0;}
.pl-tsl{position:absolute;inset:0;background:${t.border};border-radius:10px;cursor:pointer;transition:.18s;}
.pl-tsl:before{content:'';position:absolute;width:13px;height:13px;border-radius:50%;background:${t.dim};left:3px;top:3px;transition:.18s;}
.pl-tog input:checked+.pl-tsl{background:${t.acc};}
.pl-tog input:checked+.pl-tsl:before{transform:translateX(15px);background:#000;}
.pl-si{background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:10px;padding:3px 6px;border-radius:4px;outline:none;min-width:60px;}
.pl-ss{background:${t.bg};border:1px solid ${t.border};color:${t.text};font-size:10px;padding:3px 6px;border-radius:4px;outline:none;}
.pl-ss option{background:${t.surf};}
.pl-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;}
.pl-theme-card{background:${t.node};border:2px solid ${t.border};border-radius:6px;padding:8px;cursor:pointer;transition:all .1s;text-align:center;}
.pl-theme-card:hover,.pl-theme-card.on{border-color:${t.acc};}
.pl-tprev{height:20px;border-radius:3px;margin-bottom:4px;}
.pl-tname{font-size:10px;font-weight:700;color:${t.text};}
.pl-rst-btn{background:${t.acc2}22;border:1px solid ${t.acc2}66;color:${t.acc2};font-size:10px;font-weight:700;padding:6px 12px;border-radius:5px;cursor:pointer;font-family:inherit;transition:all .12s;margin-top:7px;}
.pl-rst-btn:hover{background:${t.acc2};color:#fff;}
.pl-key-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid ${t.border};font-size:10px;}
.pl-key-combo{display:flex;gap:3px;}
.pl-key{background:${t.node};border:1px solid ${t.border};color:${t.acc};font-family:monospace;font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;}
#pl-eb{display:none;background:${t.acc2}18;border-top:1px solid ${t.acc2};padding:4px 10px;font-size:10px;color:${t.acc2};font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;}
#pl-eb.on{display:block;}
#pl-mbg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:99999;align-items:center;justify-content:center;}
#pl-mbg.on{display:flex;}
#pl-modal{background:${t.surf};border:1px solid ${t.border};border-radius:8px;padding:18px;min-width:300px;max-width:460px;}
#pl-modal h3{font-size:13px;font-weight:900;color:${t.acc};margin-bottom:8px;}
#pl-mctxt{width:100%;height:170px;background:${t.bg};border:1px solid ${t.border};color:${t.acc4};font-family:monospace;font-size:9px;padding:7px;border-radius:4px;resize:none;outline:none;}
.pl-mbtns{display:flex;gap:6px;margin-top:9px;justify-content:flex-end;}
#pl-toast{display:none;position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:${t.acc};color:#000;font-size:11px;font-weight:800;padding:7px 15px;border-radius:5px;z-index:999999;pointer-events:none;font-family:inherit;}
#pl-toast.on{display:block;}
.pl-sidetag{font-size:8px;background:${t.acc}22;color:${t.acc};border:1px solid ${t.acc}44;border-radius:2px;padding:1px 3px;margin-left:2px;font-weight:700;}
*::-webkit-scrollbar{width:3px;}
*::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px;}
*::-webkit-scrollbar-track{background:transparent;}
`;
}
applyCSS();

// ── PART 2: HTML + Block definitions + Node engine ────────────

// HTML
var wrap=document.createElement("div");
wrap.innerHTML=`
<div id="pl-rh"></div>
<button id="pl-fab">🧪 Pixel Lab</button>
<div id="pl-panel">
  <div id="pl-top">
    <span class="pl-logo">PIXEL<em>LAB</em><span class="pl-vb">v${VER}</span></span>
    <span class="pl-by">by ${AUTHOR}</span>
    <div class="pl-sep"></div>
    <input type="text" id="pl-elname" placeholder="element_name" value="my_element"/>
    <div class="pl-sep"></div>
    <button class="pl-btn" id="pl-undo" title="Ctrl+Z">↩</button>
    <button class="pl-btn" id="pl-redo" title="Ctrl+Y">↪</button>
    <button class="pl-btn" id="pl-cpbtn" title="Copy (Ctrl+C)">⧉</button>
    <button class="pl-btn" id="pl-pstbtn" title="Paste (Ctrl+V)">⎘</button>
    <div class="pl-sep"></div>
    <button class="pl-btn red" id="pl-clr">🗑</button>
    <button class="pl-btn" id="pl-imp">📂</button>
    <button class="pl-btn" id="pl-sav" title="Ctrl+S">💾</button>
    <button class="pl-btn ok" id="pl-exp">⬆ Export</button>
    <span id="pl-stat">ready</span>
    <button id="pl-close">✕</button>
  </div>
  <div id="pl-tabs">
    <div class="pl-tab on" data-t="editor">🧪 Editor</div>
    <div class="pl-tab" data-t="mods">🔌 Mods</div>
    <div class="pl-tab" data-t="lib">📚 Library</div>
    <div class="pl-tab" data-t="hist">🕑 History</div>
    <div class="pl-tab" data-t="keys">⌨ Keys</div>
    <div class="pl-tab" data-t="tut">📖 Guide</div>
    <div class="pl-tab" data-t="sett">⚙ Settings</div>
    <div class="pl-tab" data-t="log">📋 Updates</div>
  </div>
  <div id="pl-body">
    <div id="pl-pal">
      <div class="pl-ph">Blocks</div>
      <input type="text" id="pl-psearch" placeholder="Search…"/>
      <div id="pl-plist"></div>
    </div>
    <div id="pl-cw">
      <div id="pl-cbg"></div>
      <div id="pl-ct"><svg id="pl-svg"></svg><div id="pl-nodes"></div></div>
      <div id="pl-hint">← Click a block to add it<br>Drag ● bottom dot to ● top dot to connect<br>Right-click a block for options<br>Click the preview to open Visual Code Editor</div>
      <div id="pl-zbar">
        <button id="pl-zoom-out">−</button>
        <span id="pl-zpct">100%</span>
        <button id="pl-zoom-in">+</button>
        <button id="pl-zoom-fit" style="font-size:9px;margin-left:3px">Fit</button>
      </div>
    </div>
    <div id="pl-rp">
      <div id="pl-pv">
        <div id="pl-pvh"><span>Preview</span><span id="pl-fps"></span></div>
        <div id="pl-pvi">
          <canvas id="pl-pvc" width="76" height="76"></canvas>
          <div class="pl-pvtip">Click → Visual Code Editor</div>
          <div id="pl-pvn">?</div>
        </div>
        <div id="pl-pvbtns">
          <button class="pl-inj" id="pl-inj">➕ Add to Sandboxels</button>
          <button id="pl-savelib">📚 Save to Library</button>
        </div>
        <div id="pl-props"></div>
        <div id="pl-codeprev"></div>
      </div>
      <div id="pl-vce">
        <div id="pl-vceh"><span>🧩 Visual Code Editor</span><button id="pl-vceback">← Back</button></div>
        <div id="pl-vce-pal"></div>
        <div id="pl-vce-script"></div>
        <div id="pl-vce-vars"><div class="vce-vhd">Variables</div><div id="pl-vce-varlist"></div></div>
        <div id="pl-vce-btm">
          <button id="pl-vce-apply">▶ Apply</button>
          <button id="pl-vce-clr">🗑</button>
        </div>
      </div>
    </div>
  </div>
  <div id="pl-modloader">
    <div id="pl-ml-top">
      <h2>🔌 Mod Loader</h2>
      <p>Load any mod by filename (e.g. <code>test_mod.js</code>) or full URL. Uses Sandboxels' own mod system.</p>
      <div id="pl-ml-row">
        <input type="text" id="pl-ml-inp" placeholder="test_mod.js or https://…"/>
        <button id="pl-ml-add">Load</button>
      </div>
    </div>
    <div id="pl-ml-list">
      <div class="pl-ml-section">Official Sandboxels Mods</div>
      <div class="pl-ml-item"><div class="pl-ml-icon">⚗️</div><div class="pl-ml-info"><div class="pl-ml-name">chem.js<span class="pl-ml-badge" style="background:#f9731655;color:#f97316">Chemistry</span></div><div class="pl-ml-desc">Real-world chemical reactions</div></div><button class="pl-ml-load" data-mod="chem.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">☢️</div><div class="pl-ml-info"><div class="pl-ml-name">clf3.js<span class="pl-ml-badge" style="background:#00c89655;color:#00c896">Chemistry</span></div><div class="pl-ml-desc">Chlorine trifluoride — extremely reactive</div></div><button class="pl-ml-load" data-mod="clf3.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">✨</div><div class="pl-ml-info"><div class="pl-ml-name">glow.js<span class="pl-ml-badge" style="background:#ffd16655;color:#ffd166">Visual</span></div><div class="pl-ml-desc">Adds glow effects to emissive pixels</div></div><button class="pl-ml-load" data-mod="glow.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">🌍</div><div class="pl-ml-info"><div class="pl-ml-name">the_ground.js<span class="pl-ml-badge" style="background:#7b61ff55;color:#9d7bea">World</span></div><div class="pl-ml-desc">Rock types, worldgen, gemstones</div></div><button class="pl-ml-load" data-mod="the_ground.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">🔬</div><div class="pl-ml-info"><div class="pl-ml-name">devtests.js<span class="pl-ml-badge" style="background:#ff4d6a55;color:#ff4d6a">Dev</span></div><div class="pl-ml-desc">Experimental dev features</div></div><button class="pl-ml-load" data-mod="devtests.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">🧬</div><div class="pl-ml-info"><div class="pl-ml-name">fey_and_more.js<span class="pl-ml-badge" style="background:#9d7bea55;color:#9d7bea">Life</span></div><div class="pl-ml-desc">Fairies, magic, new elements</div></div><button class="pl-ml-load" data-mod="fey_and_more.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">🍕</div><div class="pl-ml-info"><div class="pl-ml-name">aChefsDream2.js<span class="pl-ml-badge" style="background:#f9731655;color:#f97316">Food</span></div><div class="pl-ml-desc">Cooking mechanics and recipes</div></div><button class="pl-ml-load" data-mod="aChefsDream2.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">⚡</div><div class="pl-ml-info"><div class="pl-ml-name">velocity.js<span class="pl-ml-badge" style="background:#ffd16655;color:#ffd166">Physics</span></div><div class="pl-ml-desc">Explosion velocity and wind</div></div><button class="pl-ml-load" data-mod="velocity.js">Load</button></div>
      <div class="pl-ml-item"><div class="pl-ml-icon">💣</div><div class="pl-ml-info"><div class="pl-ml-name">subspace.js<span class="pl-ml-badge" style="background:#ff4d6a55;color:#ff4d6a">Weapons</span></div><div class="pl-ml-desc">Subspace traps and advanced explosives</div></div><button class="pl-ml-load" data-mod="subspace.js">Load</button></div>
      <div class="pl-ml-section" style="margin-top:10px">Your Custom Mods</div>
      <div id="pl-ml-custom"></div>
    </div>
  </div>
  <div class="pl-tabpage" id="pl-libtab"><h2>📚 Element Library</h2><div id="pl-liblist"></div></div>
  <div class="pl-tabpage" id="pl-histtab"><h2>🕑 Undo History</h2><div id="pl-histlist"></div></div>
  <div class="pl-tabpage" id="pl-keystab">
    <h2>⌨ Shortcuts</h2>
    <div class="pl-key-row"><span>Undo</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">Z</span></div></div>
    <div class="pl-key-row"><span>Redo</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">Y</span></div></div>
    <div class="pl-key-row"><span>Copy block</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">C</span></div></div>
    <div class="pl-key-row"><span>Paste block</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">V</span></div></div>
    <div class="pl-key-row"><span>Delete selected</span><div class="pl-key-combo"><span class="pl-key">Del</span></div></div>
    <div class="pl-key-row"><span>Select all</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">A</span></div></div>
    <div class="pl-key-row"><span>Inject element</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">Enter</span></div></div>
    <div class="pl-key-row"><span>Save .plab</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">S</span></div></div>
    <div class="pl-key-row"><span>Zoom in/out</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">+/−</span></div></div>
    <div class="pl-key-row"><span>Fit blocks</span><div class="pl-key-combo"><span class="pl-key">Ctrl</span><span class="pl-key">0</span></div></div>
    <div class="pl-key-row"><span>Close</span><div class="pl-key-combo"><span class="pl-key">Esc</span></div></div>
  </div>
  <div class="pl-tabpage" id="pl-tuttab">
    <h2>📖 Guide</h2>
    <h3>Quick start</h3>
    <ul>
      <li>Click any block in the left panel to add it.</li>
      <li>Fill in values — preview updates live.</li>
      <li>Drag bottom ● to top ● to connect blocks.</li>
      <li>Click "Add to Sandboxels" to inject live.</li>
      <li>Click the preview canvas to open the Visual Code Editor.</li>
    </ul>
    <h3>Why can't I place my element?</h3>
    <p>You need at least a <code>Set Behavior</code> block. The behavior must be: <code>POWDER</code>, <code>LIQUID</code>, <code>GAS</code>, <code>WALL</code>, <code>FIRE</code>, or <code>SUPPORT</code>.</p>
    <h3>Loading mods</h3>
    <p>Go to the 🔌 Mods tab. Paste a filename like <code>test_mod.js</code> or a full URL. It injects via <code>&lt;script&gt;</code> exactly like the official Mods button.</p>
    <h3>Exporting as a real mod</h3>
    <p>Click ⬆ Export → download the <code>.js</code> file → host on GitHub → paste the raw URL into the Mods tab or the game's Mods button.</p>
    <h3>States & behaviors</h3>
    <ul>
      <li><code>POWDER</code> — falls and piles up (sand, salt, sugar)</li>
      <li><code>LIQUID</code> — flows (water, lava, acid)</li>
      <li><code>GAS</code> — rises and spreads (steam, smoke)</li>
      <li><code>WALL</code> — static solid (stone, metal, wood)</li>
      <li><code>FIRE</code> — burns upward (fire, plasma)</li>
      <li><code>SUPPORT</code> — structural, holds weight</li>
      <li><code>AGPOWDER</code> — anti-gravity powder (floats up)</li>
      <li><code>DGAS</code> — dense gas (sinks down)</li>
    </ul>
    <h3>Sandboxels element categories</h3>
    <ul>
      <li><strong>Land</strong> — Dirt, Sand, Rock, Soil</li>
      <li><strong>Liquids</strong> — Water, Oil, Lava, Acid, Mercury</li>
      <li><strong>Life</strong> — Plants, Animals, Bacteria, Fungus</li>
      <li><strong>Powders</strong> — Sand, Salt, Sugar, Gunpowder</li>
      <li><strong>Solids</strong> — Metal, Wood, Glass, Ice</li>
      <li><strong>Energy</strong> — Fire, Plasma, Electricity, Laser</li>
      <li><strong>Weapons</strong> — Bomb, TNT, Nuke, C4</li>
      <li><strong>Gases</strong> — Steam, Smoke, Hydrogen, CO2</li>
      <li><strong>Food</strong> — Dough, Meat, Sugar, Flour</li>
      <li><strong>Machines</strong> — Engine, Pump, Filter, Sensor</li>
      <li><strong>Special</strong> — Void, Portal, Cloner, Mover</li>
      <li><strong>Tools</strong> — Heat, Cool, Erase, Pick</li>
    </ul>
  </div>
  <div class="pl-tabpage" id="pl-setttab">
    <h2>⚙ Settings</h2>
    <div class="pl-stabs">
      <div class="pl-stab on" data-s="gen">General</div>
      <div class="pl-stab" data-s="theme">Theme</div>
      <div class="pl-stab" data-s="canvas">Canvas</div>
      <div class="pl-stab" data-s="mod">Modding</div>
      <div class="pl-stab" data-s="about">About</div>
    </div>
    <div class="pl-sp on" id="sp-gen">
      <div class="pl-srow"><div><div class="pl-slabel">Autosave</div><div class="pl-sdesc">Auto-save workspace.</div></div><label class="pl-tog"><input type="checkbox" id="s-auto"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Confirm on Delete</div><div class="pl-sdesc">Ask before deleting a block.</div></div><label class="pl-tog"><input type="checkbox" id="s-conf"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Animated Preview</div><div class="pl-sdesc">Live animated pixel preview.</div></div><label class="pl-tog"><input type="checkbox" id="s-anim"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Default Category</div></div><input type="text" class="pl-si" id="s-cat" style="width:95px"></div>
      <div class="pl-srow" style="border:none;padding-top:10px"><button class="pl-rst-btn" id="pl-rst">🧹 Reset Settings</button></div>
    </div>
    <div class="pl-sp" id="sp-theme">
      <div class="pl-theme-grid">
        <div class="pl-theme-card" data-theme="dark"><div class="pl-tprev" style="background:linear-gradient(135deg,#0d0e13,#00e5cc)"></div><div class="pl-tname">🌙 Dark</div></div>
        <div class="pl-theme-card" data-theme="neon"><div class="pl-tprev" style="background:linear-gradient(135deg,#04040b,#ff00ff)"></div><div class="pl-tname">🌈 Neon</div></div>
        <div class="pl-theme-card" data-theme="terminal"><div class="pl-tprev" style="background:linear-gradient(135deg,#080c08,#00e040)"></div><div class="pl-tname">💻 Terminal</div></div>
        <div class="pl-theme-card" data-theme="light"><div class="pl-tprev" style="background:linear-gradient(135deg,#eef0f5,#0055ff)"></div><div class="pl-tname">☀️ Light</div></div>
      </div>
    </div>
    <div class="pl-sp" id="sp-canvas">
      <div class="pl-srow"><div><div class="pl-slabel">Snap to Grid</div></div><label class="pl-tog"><input type="checkbox" id="s-snap"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Snap Nodes Together</div><div class="pl-sdesc">Magnetic node snapping.</div></div><label class="pl-tog"><input type="checkbox" id="s-snapn"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Grid Size</div></div><input type="number" class="pl-si" id="s-grid" min="8" max="64" step="4"></div>
    </div>
    <div class="pl-sp" id="sp-mod">
      <div class="pl-srow"><div><div class="pl-slabel">Show Logic Blocks</div></div><label class="pl-tog"><input type="checkbox" id="s-logic"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel">Auto Re-inject on Change</div></div><label class="pl-tog"><input type="checkbox" id="s-live"><span class="pl-tsl"></span></label></div>
      <div class="pl-srow"><div><div class="pl-slabel" style="color:#ff4d6a">🧪 Experimental</div><div class="pl-sdesc" style="color:#ff4d6a">May break the game.</div></div><label class="pl-tog"><input type="checkbox" id="s-exp"><span class="pl-tsl"></span></label></div>
    </div>
    <div class="pl-sp" id="sp-about">
      <div style="padding:8px 0;line-height:2.3;font-size:11px">
        <strong style="font-size:16px;color:var(--acc,#00e5cc)">Pixel Lab v${VER}</strong><br>
        by <strong style="color:var(--acc,#00e5cc)">${AUTHOR}</strong><br>
        Visual element builder for Sandboxels<br>
        <a href="https://github.com/Omelette180/pixellab_mod.js" target="_blank" style="color:var(--acc4,#9d7bea)">github.com/Omelette180/pixellab_mod.js</a>
      </div>
    </div>
  </div>
  <!-- CHANGELOG TAB -->
  <div class="pl-tabpage" id="pl-logtab">
    <h2>📋 Update Log</h2>
    <p style="font-size:11px;opacity:.5;margin-bottom:16px">Everything that was built, fixed, and broken along the way.</p>

    <div style="border-left:2px solid var(--acc,#00e5cc);padding-left:14px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:900;color:var(--acc,#00e5cc)">v1.0 — The Big One</div>
      <div style="font-size:10px;color:var(--dim);margin-bottom:8px">Current version</div>
      <ul>
        <li>First-time tutorial overlay with 5 steps</li>
        <li>Demo element (pl_demo) auto-added on load</li>
        <li>4 UI themes: Dark, Neon, Terminal, Light</li>
        <li>Resizable panel — drag the left edge</li>
        <li>Zoom in/out on the node canvas (Ctrl+scroll)</li>
        <li>Connect blocks with bezier curves — drag ● to ●</li>
        <li>Copy/paste blocks (Ctrl+C / Ctrl+V)</li>
        <li>Undo/redo with full history panel (60 steps)</li>
        <li>Element library — save and reload elements</li>
        <li>Search &amp; replace values across all blocks</li>
        <li>Auto-arrange blocks in a grid</li>
        <li>Snap nodes together when dragging</li>
        <li>Keyboard shortcuts panel</li>
        <li>Export element as a .js file</li>
        <li>Save/load workspace as .plab file</li>
        <li>Autosave to localStorage</li>
        <li>Mod loader — type any .js filename or URL to load</li>
        <li>8 pre-made elements in Special category</li>
        <li>Visual Code Editor (click the preview canvas)</li>
        <li>Scratch-style block scripting in the VCE</li>
        <li>Variables in VCE: numbers and booleans</li>
        <li>All 13 Sandboxels categories supported</li>
        <li>All 8 behaviors: POWDER, LIQUID, GAS, WALL, FIRE, SUPPORT, AGPOWDER, DGAS</li>
        <li>All 8 element states: solid, powder, liquid, gas, plasma, energy, fire, special</li>
      </ul>
    </div>

    <div style="border-left:2px solid var(--border,#22253a);padding-left:14px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:800;color:var(--text,#e2e4ee)">Block Groups</div>
      <div style="font-size:10px;color:var(--dim);margin-bottom:8px">200+ blocks across 9 groups</div>
      <ul>
        <li>🏷 Identity — Name, Category, State, Tags, Description, Hidden</li>
        <li>🎨 Appearance — 3 colors, Glow, Glow Color, Opacity, Shimmer, Pixel Size</li>
        <li>⚙ Physics — Behavior, Density, Friction, Viscosity, Spread Rate, Gravity, Stickiness, Lifetime, Indestructible, Float, Wall, Hardness, Elasticity</li>
        <li>🌡 Temperature — Temp, High/Low transitions, Heat Conductivity, Flammable, Melt/Boil/Freeze points, Self Heat/Cool</li>
        <li>⚗ Reactions — Reactions (1 or 2 outputs), Explosion, Radioactive, Corrosive, Electricity, Toxic, Absorb, Contagious</li>
        <li>🔀 Logic — If/Then, Branches (if/else), Counters, Repeat, AND, OR, Age, Random, On Fire, Above/Below</li>
        <li>📦 Spawn — Above, Below, Left, Right, Random, Radius, Line, Clone, On Death</li>
        <li>🖥 Code — Custom Tick, On Create, On Touch, On Destroy, Comment</li>
        <li>🔒 Special — Generator, Timer, Void, Converter, Grow, Gravity Well, Black Hole, Nuke, Mimic, Portal, Heal, Quantum</li>
      </ul>
    </div>

    <div style="border-left:2px solid var(--border,#22253a);padding-left:14px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:800;color:var(--text,#e2e4ee)">Bug Fixes</div>
      <ul>
        <li>Fixed loading screen getting stuck on startup</li>
        <li>Fixed elements not being placeable (wrong tick signature)</li>
        <li>Fixed element button not showing in sidebar (wrong HTML element type)</li>
        <li>Fixed sidebar injection — now uses addElement() API correctly</li>
        <li>Fixed category names — must be lowercase to match Sandboxels</li>
        <li>Fixed stateHigh/stateLow property names (not tempHighElement)</li>
        <li>Fixed animated preview freezing the game — now throttled to 8fps and stops when panel is closed</li>
        <li>Fixed connector dots not showing — parent div was clipping overflow</li>
        <li>Fixed changePixel() calls — replaced with pixel.element = value</li>
        <li>Fixed mod loader to auto-fix GitHub blob URLs to raw URLs</li>
        <li>Fixed game crash when placing elements — tick function signature corrected</li>
        <li>Fixed panel resize handle</li>
        <li>Fixed copy/paste not working</li>
        <li>Fixed undo history not recording correctly</li>
      </ul>
    </div>

    <div style="border-left:2px solid var(--border,#22253a);padding-left:14px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:800;color:var(--text,#e2e4ee)">Made by</div>
      <div style="font-size:12px;line-height:2;margin-top:6px">
        <strong style="color:var(--acc,#00e5cc)">Omelette</strong> — built the whole thing<br>
        <strong style="color:var(--acc,#00e5cc)">R74n</strong> — made Sandboxels
      </div>
    </div>
  </div>

  <div id="pl-eb"></div>
</div>
<div id="pl-mbg"><div id="pl-modal"><h3>📋 Exported JS</h3><textarea id="pl-mctxt" readonly></textarea><div class="pl-mbtns"><button class="pl-btn" id="pl-mcopy">Copy</button><button class="pl-btn" id="pl-mdl">Download .js</button><button class="pl-btn red" id="pl-mclose">Close</button></div></div></div>
<div id="pl-toast"></div>
`;
document.body.appendChild(wrap);

// ── GUARANTEED FAB BUTTON (always shows even if CSS fails) ────
(function(){
  var fab = document.getElementById("pl-fab");
  if(!fab) return;
  // Force inline styles so it shows even if CSS template fails
  fab.style.cssText = [
    "position:fixed","bottom:18px","right:18px","z-index:99999",
    "background:#00ffcc","color:#000","font-family:sans-serif",
    "font-size:13px","font-weight:800","padding:10px 20px",
    "border-radius:6px","border:none","cursor:pointer",
    "box-shadow:0 4px 16px rgba(0,255,204,.5)","display:block"
  ].join(";");
  var panel = document.getElementById("pl-panel");
  if(!panel) return;
  // Force panel styles too
  panel.style.cssText = [
    "position:fixed","top:0","right:0","bottom:0","z-index:99998",
    "background:#0d0e13","color:#e2e4ee",
    "font-family:'Segoe UI',sans-serif",
    "box-shadow:-6px 0 28px rgba(0,0,0,.7)",
    "transform:translateX(100%)",
    "transition:transform .25s cubic-bezier(.4,0,.2,1)",
    "display:flex","flex-direction:column"
  ].join(";");
  fab.addEventListener("click", function(){
    var isOpen = panel.style.transform === "translateX(0px)" || panel.style.transform === "translateX(0)";
    panel.style.transform = isOpen ? "translateX(100%)" : "translateX(0)";
    fab.style.background = isOpen ? "#00ffcc" : "#ff4d6a";
    fab.textContent = isOpen ? "🧪 Pixel Lab" : "✕ Close";
  });
})();

// ── BLOCK GROUP COLORS ────────────────────────────────────────
var GC={"🏷 Identity":"#7b61ff","🎨 Appearance":"#ff5e5b","⚙ Physics":"#00c896","🌡 Temperature":"#ffe566","⚗ Reactions":"#f97316","🔀 Logic":"#e879f9","📦 Spawn":"#34d399","🖥 Code":"#a78bfa","🔒 Special":"#94a3b8"};

// ── ALL BLOCK DEFINITIONS ─────────────────────────────────────
// CATEGORIES match real Sandboxels categories
var CAT_OPTS=["land","liquids","life","powders","solids","energy","weapons","gases","food","machines","special","tools","other"];
var BEH_OPTS=["POWDER","LIQUID","GAS","WALL","FIRE","SUPPORT","AGPOWDER","DGAS"];
var STATE_OPTS=["solid","powder","liquid","gas","plasma","energy","fire","special"];

var ND=[
  // ── IDENTITY ──
  {g:"🏷 Identity",type:"setName",    label:"Set Name",       icon:"🏷",f:[{k:"name",t:"text",l:"Name",ph:"my_element"}]},
  {g:"🏷 Identity",type:"setCategory",label:"Set Category",   icon:"📁",f:[{k:"category",t:"sel",l:"Category",opts:CAT_OPTS}]},
  {g:"🏷 Identity",type:"setState",   label:"Set State",      icon:"💎",f:[{k:"state",t:"sel",l:"State",opts:STATE_OPTS}]},
  {g:"🏷 Identity",type:"setTags",    label:"Set Tags",       icon:"🔖",f:[{k:"tags",t:"text",l:"Tags",ph:"tag1,tag2"}]},
  {g:"🏷 Identity",type:"setDesc",    label:"Description",    icon:"📝",f:[{k:"desc",t:"text",l:"Desc",ph:"A cool element"}]},
  {g:"🏷 Identity",type:"setHidden",  label:"Hidden Element", icon:"👻",f:[{k:"hidden",t:"chk",l:"Hidden"}]},
  // ── APPEARANCE ──
  {g:"🎨 Appearance",type:"setColor",     label:"Set Color",    icon:"🎨",f:[{k:"color",t:"col",l:"Color",def:"#7b1fa2"}]},
  {g:"🎨 Appearance",type:"setColor2",    label:"Color 2",      icon:"🎨",f:[{k:"color2",t:"col",l:"Color 2",def:"#9c27b0"}]},
  {g:"🎨 Appearance",type:"setColor3",    label:"Color 3",      icon:"🎨",f:[{k:"color3",t:"col",l:"Color 3",def:"#6a1b9a"}]},
  {g:"🎨 Appearance",type:"setGlow",      label:"Set Glow",     icon:"✨",f:[{k:"glow",t:"num",l:"Glow",min:0,max:2,step:0.1,def:0}]},
  {g:"🎨 Appearance",type:"setGlowColor", label:"Glow Color",   icon:"💡",f:[{k:"glowColor",t:"col",l:"Color",def:"#00e5ff"}]},
  {g:"🎨 Appearance",type:"setOpacity",   label:"Set Opacity",  icon:"👁",f:[{k:"opacity",t:"num",l:"Opacity",min:0,max:1,step:0.05,def:1}]},
  {g:"🎨 Appearance",type:"setShimmer",   label:"Shimmer",      icon:"💫",f:[{k:"shimmer",t:"num",l:"Chance",min:0,max:1,step:0.05,def:0}]},
  {g:"🎨 Appearance",type:"setPixelSize", label:"Pixel Size",   icon:"🔲",f:[{k:"pixelSize",t:"num",l:"Size",min:1,max:4,step:1,def:1}]},
  // ── PHYSICS ──
  {g:"⚙ Physics",type:"setBehavior",    label:"Set Behavior",     icon:"⚙️",f:[{k:"behavior",t:"sel",l:"Behavior",opts:BEH_OPTS}]},
  {g:"⚙ Physics",type:"setDensity",     label:"Set Density",      icon:"⚖️",f:[{k:"density",t:"num",l:"Density",def:1000}]},
  {g:"⚙ Physics",type:"setFriction",    label:"Set Friction",     icon:"🔩",f:[{k:"friction",t:"num",l:"Friction",min:0,max:1,step:0.05,def:0.5}]},
  {g:"⚙ Physics",type:"setViscosity",   label:"Viscosity",        icon:"💧",f:[{k:"viscosity",t:"num",l:"Viscosity",min:0,max:1,step:0.05,def:0.5}]},
  {g:"⚙ Physics",type:"setSpreadRate",  label:"Spread Rate",      icon:"↔️",f:[{k:"spreadRate",t:"num",l:"Rate",min:1,max:10,def:1}]},
  {g:"⚙ Physics",type:"setGravity",     label:"Set Gravity",      icon:"🌍",f:[{k:"gravity",t:"num",l:"Gravity",step:0.1,def:1}]},
  {g:"⚙ Physics",type:"setStickiness",  label:"Stickiness",       icon:"🍯",f:[{k:"stickiness",t:"num",l:"Stickiness",min:0,max:1,step:0.1,def:0}]},
  {g:"⚙ Physics",type:"setLifetime",    label:"Set Lifetime",     icon:"⏱",f:[{k:"lifetime",t:"num",l:"Frames",def:0}]},
  {g:"⚙ Physics",type:"setIndestructible",label:"Indestructible", icon:"🛡",f:[{k:"indestructible",t:"chk",l:"Enable"}]},
  {g:"⚙ Physics",type:"setFloat",       label:"Float (anti-grav)", icon:"🎈",f:[{k:"float",t:"chk",l:"Float"}]},
  {g:"⚙ Physics",type:"setWall",        label:"Wall",             icon:"🧱",f:[{k:"wall",t:"chk",l:"Is Wall"}]},
  {g:"⚙ Physics",type:"setHardness",    label:"Hardness",         icon:"💪",f:[{k:"hardness",t:"num",l:"Hardness",min:0,max:1,step:0.1,def:0.5}]},
  {g:"⚙ Physics",type:"setElastic",     label:"Elasticity",       icon:"🏀",f:[{k:"elastic",t:"num",l:"Bounce",min:0,max:1,step:0.1,def:0}]},
  // ── TEMPERATURE ──
  {g:"🌡 Temperature",type:"setTemp",       label:"Starting Temp",    icon:"🌡",f:[{k:"temp",t:"num",l:"Temp °C",def:25}]},
  {g:"🌡 Temperature",type:"setTempHigh",   label:"Temp High →",      icon:"🔥",f:[{k:"tempHigh",t:"num",l:"°C",def:100},{k:"tempHighElem",t:"text",l:"→ Elem",ph:"steam"}]},
  {g:"🌡 Temperature",type:"setTempLow",    label:"Temp Low →",       icon:"❄️",f:[{k:"tempLow",t:"num",l:"°C",def:0},{k:"tempLowElem",t:"text",l:"→ Elem",ph:"ice"}]},
  {g:"🌡 Temperature",type:"setHeatConduct",label:"Heat Conductivity", icon:"♨️",f:[{k:"heatConduct",t:"num",l:"Conductivity",min:0,max:1,step:0.05,def:0.5}]},
  {g:"🌡 Temperature",type:"setFlammable",  label:"Flammable",        icon:"🕯",f:[{k:"flammable",t:"num",l:"Chance %",min:0,max:100,def:50}]},
  {g:"🌡 Temperature",type:"setMeltPoint",  label:"Melting Point",    icon:"🫠",f:[{k:"meltPt",t:"num",l:"°C",def:1000},{k:"meltElem",t:"text",l:"→ Elem",ph:"lava"}]},
  {g:"🌡 Temperature",type:"setBoilPoint",  label:"Boiling Point",    icon:"💨",f:[{k:"boilPt",t:"num",l:"°C",def:100},{k:"boilElem",t:"text",l:"→ Elem",ph:"steam"}]},
  {g:"🌡 Temperature",type:"setFreezePoint",label:"Freezing Point",   icon:"🧊",f:[{k:"freezePt",t:"num",l:"°C",def:0},{k:"freezeElem",t:"text",l:"→ Elem",ph:"ice"}]},
  {g:"🌡 Temperature",type:"setSelfHeat",   label:"Self Heating",     icon:"♨️",f:[{k:"selfHeat",t:"num",l:"Heat/tick",step:0.1,def:0}]},
  {g:"🌡 Temperature",type:"setSelfCool",   label:"Self Cooling",     icon:"🌬️",f:[{k:"selfCool",t:"num",l:"Cool/tick",step:0.1,def:0}]},
  // ── REACTIONS ──
  {g:"⚗ Reactions",type:"addReaction",  label:"Add Reaction",       icon:"⚗️",f:[{k:"touching",t:"text",l:"Touching",ph:"water"},{k:"becomes",t:"text",l:"Becomes",ph:"steam"},{k:"chance",t:"num",l:"%",def:100}]},
  {g:"⚗ Reactions",type:"addReaction2", label:"Reaction (2 outputs)",icon:"⚗️",f:[{k:"touching",t:"text",l:"Touching",ph:"water"},{k:"elem1",t:"text",l:"Out 1",ph:"steam"},{k:"elem2",t:"text",l:"Out 2",ph:"ash"},{k:"chance",t:"num",l:"%",def:100}]},
  {g:"⚗ Reactions",type:"addExplosion", label:"Add Explosion",      icon:"💥",f:[{k:"explosion",t:"num",l:"Power",min:0,max:20,step:0.5,def:3}]},
  {g:"⚗ Reactions",type:"setRadioactive",label:"Radioactive",       icon:"☢️",f:[{k:"radioactive",t:"num",l:"Chance %",min:0,max:100,def:10}]},
  {g:"⚗ Reactions",type:"setCorrosive", label:"Corrosive",          icon:"🧪",f:[{k:"corrosive",t:"num",l:"Strength",min:0,max:1,step:0.1,def:0.5}]},
  {g:"⚗ Reactions",type:"setConduct",   label:"Conducts Electricity",icon:"⚡",f:[{k:"conduct",t:"chk",l:"Enable"}]},
  {g:"⚗ Reactions",type:"setToxic",     label:"Toxic",              icon:"☠️",f:[{k:"toxic",t:"num",l:"Damage",min:0,max:1,step:0.1,def:0.2}]},
  {g:"⚗ Reactions",type:"setAbsorb",    label:"Absorb Element",     icon:"🌀",f:[{k:"absorbElem",t:"text",l:"Absorbs",ph:"water"},{k:"absorbResult",t:"text",l:"→ Becomes",ph:"wet_sand"}]},
  {g:"⚗ Reactions",type:"setContagious",label:"Contagious",         icon:"🦠",f:[{k:"infectElem",t:"text",l:"Turns into",ph:"fire"},{k:"infectChance",t:"num",l:"%",def:5}]},
  // ── LOGIC ──
  {g:"🔀 Logic",type:"ifTemp",        label:"If Temp > X →",      icon:"🌡",f:[{k:"tempVal",t:"num",l:"°C",def:100},{k:"thenElem",t:"text",l:"→ Becomes",ph:"steam"}]},
  {g:"🔀 Logic",type:"ifTempBelow",   label:"If Temp < X →",      icon:"❄️",f:[{k:"tempVal",t:"num",l:"°C",def:0},{k:"thenElem",t:"text",l:"→ Becomes",ph:"ice"}]},
  {g:"🔀 Logic",type:"ifTempRange",   label:"If Temp Between X–Y",icon:"🌡",f:[{k:"tempMin",t:"num",l:"Min",def:50},{k:"tempMax",t:"num",l:"Max",def:100},{k:"thenElem",t:"text",l:"→ Becomes",ph:"steam"}]},
  {g:"🔀 Logic",type:"ifAge",         label:"If Age > X frames",  icon:"⏳",f:[{k:"ageVal",t:"num",l:"Frames",def:200},{k:"thenElem",t:"text",l:"→ Becomes",ph:"ash"}]},
  {g:"🔀 Logic",type:"ifRandom",      label:"If Random < X%",     icon:"🎲",f:[{k:"randChance",t:"num",l:"%",def:10},{k:"thenElem",t:"text",l:"→ Becomes",ph:"fire"}]},
  {g:"🔀 Logic",type:"ifTouching",    label:"If Touching Elem",   icon:"👆",f:[{k:"touchElem",t:"text",l:"Element",ph:"water"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"steam"}]},
  {g:"🔀 Logic",type:"ifNotTouching", label:"If NOT Touching",    icon:"🚫",f:[{k:"touchElem",t:"text",l:"Element",ph:"water"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"fire"}]},
  {g:"🔀 Logic",type:"ifOnFire",      label:"If On Fire →",       icon:"🔥",f:[{k:"thenElem",t:"text",l:"→ Becomes",ph:"ash"}]},
  {g:"🔀 Logic",type:"ifAbove",       label:"If Above Elem",      icon:"⬆️",f:[{k:"aboveElem",t:"text",l:"Above",ph:"water"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"wet"}]},
  {g:"🔀 Logic",type:"ifBelow",       label:"If Below Elem",      icon:"⬇️",f:[{k:"belowElem",t:"text",l:"Below",ph:"lava"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"ash"}]},
  {g:"🔀 Logic",type:"counter",       label:"Counter Timer",      icon:"⏲",f:[{k:"countTo",t:"num",l:"Count to",def:100},{k:"thenElem",t:"text",l:"→ Becomes",ph:"ash"}]},
  {g:"🔀 Logic",type:"repeatEvery",   label:"Repeat Every N ticks",icon:"🔁",f:[{k:"repeatN",t:"num",l:"Every N",def:10},{k:"thenElem",t:"text",l:"→ Becomes",ph:"fire"}]},
  {g:"🔀 Logic",type:"andCondition",  label:"AND (both true)",    icon:"🔗",f:[{k:"condA",t:"text",l:"Cond A",ph:"temp>100"},{k:"condB",t:"text",l:"AND B",ph:"age>50"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"fire"}]},
  {g:"🔀 Logic",type:"orCondition",   label:"OR (either true)",   icon:"🔀",f:[{k:"condA",t:"text",l:"Cond A",ph:"temp>100"},{k:"condB",t:"text",l:"OR B",ph:"touching:fire"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"steam"}]},
  // BRANCH BLOCKS — if/else with two paths
  {g:"🔀 Logic",type:"branchTouch",   label:"If Touch → branch",  icon:"👆",f:[{k:"touchElem",t:"text",l:"Touching",ph:"water"},{k:"thenElem",t:"text",l:"If YES →",ph:"fire"},{k:"elseElem",t:"text",l:"If NO →",ph:"steam"}]},
  {g:"🔀 Logic",type:"branchTemp",    label:"If Temp → branch",   icon:"🌡",f:[{k:"tempVal",t:"num",l:"Temp °C",def:100},{k:"dir",t:"sel",l:"Direction",opts:["above","below"]},{k:"thenElem",t:"text",l:"If YES →",ph:"lava"},{k:"elseElem",t:"text",l:"If NO →",ph:"water"}]},
  {g:"🔀 Logic",type:"branchRandom",  label:"Random → branch",    icon:"🎲",f:[{k:"chance",t:"num",l:"Chance %",def:50},{k:"thenElem",t:"text",l:"If YES →",ph:"fire"},{k:"elseElem",t:"text",l:"If NO →",ph:"smoke"}]},
  {g:"🔀 Logic",type:"branchFire",    label:"On Fire → branch",   icon:"🔥",f:[{k:"thenElem",t:"text",l:"If ON FIRE →",ph:"ash"},{k:"elseElem",t:"text",l:"If NOT on fire →",ph:"wood"}]},
  {g:"🔀 Logic",type:"branchAge",     label:"Age → branch",       icon:"⏳",f:[{k:"ageVal",t:"num",l:"Frames",def:100},{k:"thenElem",t:"text",l:"If OLD →",ph:"ash"},{k:"elseElem",t:"text",l:"If YOUNG →",ph:"fire"}]},
  {g:"🔀 Logic",type:"branchNeighbor",label:"Neighbor → branch",  icon:"🔁",f:[{k:"elemA",t:"text",l:"If near A",ph:"water"},{k:"thenElem",t:"text",l:"→ Becomes",ph:"steam"},{k:"elemB",t:"text",l:"Or near B",ph:"lava"},{k:"elseElem",t:"text",l:"→ Becomes",ph:"rock"}]},
  // ── SPAWN ──
  {g:"📦 Spawn",type:"spawnAbove",  label:"Spawn Above",        icon:"⬆️",f:[{k:"spawnElem",t:"text",l:"Element",ph:"fire"},{k:"spawnChance",t:"num",l:"%",def:5}]},
  {g:"📦 Spawn",type:"spawnBelow",  label:"Spawn Below",        icon:"⬇️",f:[{k:"spawnElem",t:"text",l:"Element",ph:"smoke"},{k:"spawnChance",t:"num",l:"%",def:5}]},
  {g:"📦 Spawn",type:"spawnLeft",   label:"Spawn Left",         icon:"⬅️",f:[{k:"spawnElem",t:"text",l:"Element",ph:"spark"},{k:"spawnChance",t:"num",l:"%",def:5}]},
  {g:"📦 Spawn",type:"spawnRight",  label:"Spawn Right",        icon:"➡️",f:[{k:"spawnElem",t:"text",l:"Element",ph:"spark"},{k:"spawnChance",t:"num",l:"%",def:5}]},
  {g:"📦 Spawn",type:"spawnRandom", label:"Spawn Random Dir",   icon:"🔀",f:[{k:"spawnElem",t:"text",l:"Element",ph:"steam"},{k:"spawnChance",t:"num",l:"%",def:3}]},
  {g:"📦 Spawn",type:"spawnRadius", label:"Spawn in Radius",    icon:"🔵",f:[{k:"spawnElem",t:"text",l:"Element",ph:"fire"},{k:"spawnRadius",t:"num",l:"Radius",def:2},{k:"spawnChance",t:"num",l:"%",def:3}]},
  {g:"📦 Spawn",type:"cloneAround", label:"Clone Self",         icon:"🧬",f:[{k:"cloneChance",t:"num",l:"Chance %",def:1}]},
  {g:"📦 Spawn",type:"spawnOnDeath",label:"Spawn On Death",     icon:"💀",f:[{k:"spawnElem",t:"text",l:"Element",ph:"explosion"},{k:"spawnCount",t:"num",l:"Count",def:1}]},
  {g:"📦 Spawn",type:"spawnLine",   label:"Spawn Line",         icon:"📏",f:[{k:"spawnElem",t:"text",l:"Element",ph:"fire"},{k:"spawnDir",t:"sel",l:"Direction",opts:["up","down","left","right"]},{k:"spawnLen",t:"num",l:"Length",def:3}]},
  // ── CODE ──
  {g:"🖥 Code",type:"setCustomTick",label:"Custom Tick",  icon:"🖥",f:[{k:"customTick",t:"ta",ph:"exports.tick = function(pixel, pixelTicks, x, y, pixels) {\n  if ((pixel.temp||25) > 100) {\n    changePixel(x, y, 'steam'); return;\n  }\n  return { noop: true };\n};"}]},
  {g:"🖥 Code",type:"setOnCreate",  label:"On Create",    icon:"🆕",f:[{k:"onCreate",t:"ta",ph:"exports.onCreate = function(pixel) {\n  pixel.extra = { age: 0 };\n};"}]},
  {g:"🖥 Code",type:"setOnTouch",   label:"On Touch",     icon:"👆",f:[{k:"onTouch",t:"ta",ph:"exports.onTouch = function(pixel, neighbor) {\n  return { noop: true };\n};"}]},
  {g:"🖥 Code",type:"setOnDestroy", label:"On Destroy",   icon:"💀",f:[{k:"onDestroy",t:"ta",ph:"exports.onDestroy = function(pixel) {\n  // fires on death\n};"}]},
  {g:"🖥 Code",type:"setComment",   label:"Comment/Note", icon:"💬",f:[{k:"comment",t:"ta",ph:"// your notes here"}]},
  // ── SPECIAL ──
  {g:"🔒 Special",type:"setGenerator",label:"Generator",          icon:"♾️",f:[{k:"genElem",t:"text",l:"Generates",ph:"water"},{k:"genSide",t:"sel",l:"Side",opts:["up","down","left","right","all"]}]},
  {g:"🔒 Special",type:"setTimer",   label:"Self Destruct Timer",  icon:"⏲",f:[{k:"timerFrames",t:"num",l:"Frames",def:300},{k:"timerResult",t:"text",l:"→ Becomes",ph:"ash"}]},
  {g:"🔒 Special",type:"setVoid",    label:"Void (destroys all)",  icon:"🕳",f:[{k:"voidRadius",t:"num",l:"Radius",def:1}]},
  {g:"🔒 Special",type:"setConverter",label:"Converter",           icon:"🔄",f:[{k:"convertFrom",t:"text",l:"From",ph:"sand"},{k:"convertTo",t:"text",l:"→ To",ph:"glass"}]},
  {g:"🔒 Special",type:"setGrow",    label:"Grow Over Time",       icon:"🌿",f:[{k:"growElem",t:"text",l:"Grows into",ph:"wood"},{k:"growTime",t:"num",l:"Frames",def:200}]},
  {g:"🔒 Special",type:"setGravWell",label:"Gravity Well",         icon:"🕳",f:[{k:"wellStr",t:"num",l:"Strength",step:0.1,def:1}]},
  {g:"🔒 Special",type:"setBlackHole",label:"Black Hole",          icon:"⚫",f:[{k:"bhRadius",t:"num",l:"Radius",def:3},{k:"bhStr",t:"num",l:"Strength",step:0.1,def:1}]},
  {g:"🔒 Special",type:"setNuke",    label:"Nuke",                 icon:"💣",f:[{k:"nukeRadius",t:"num",l:"Radius",def:10},{k:"nukeDelay",t:"num",l:"Delay frames",def:60}]},
  {g:"🔒 Special",type:"setMimic",   label:"Mimic Element",        icon:"🪞",f:[{k:"mimicElem",t:"text",l:"Mimics",ph:"fire"}]},
  {g:"🔒 Special",type:"setPortal",  label:"Portal",               icon:"🌀",f:[{k:"portalId",t:"text",l:"Portal ID",ph:"portal_a"},{k:"portalOut",t:"text",l:"Exit ID",ph:"portal_b"}]},
  {g:"🔒 Special",type:"setHeal",    label:"Heals Elements",       icon:"💚",f:[{k:"healElem",t:"text",l:"Heals",ph:"wood"},{k:"healAmt",t:"num",l:"Amount",def:1}]},
  {g:"🔒 Special",type:"setQuantum", label:"Quantum State",        icon:"🎲",f:[{k:"stateA",t:"text",l:"State A",ph:"solid"},{k:"stateB",t:"text",l:"State B",ph:"gas"},{k:"qChance",t:"num",l:"%",def:50}]},
];

// ── STATE ─────────────────────────────────────────────────────
var nReg={},idC=1000,uPast=[],uFuture=[],drag=null,dOff={x:0,y:0},connFrom=null,injected={},pvF=null,liveT=null;
var selNode=null,clipboard=null,zoom=1,panX=0,panY=0;
var MAX_U=60;
var loadedMods={};
var customMods=[];
try{customMods=JSON.parse(localStorage.getItem("pl_custommods")||"[]");}catch{}

// ── UTILS ─────────────────────────────────────────────────────
var q=function(s){return document.querySelector(s);};
var qa=function(s,r){return Array.from((r||document).querySelectorAll(s));};
var _tt=null;
function toast(m,d){var t=q("#pl-toast");if(!t)return;t.textContent=m;t.classList.add("on");clearTimeout(_tt);_tt=setTimeout(function(){t.classList.remove("on");},d||2200);}
function setStat(s){var e=q("#pl-stat");if(e)e.textContent=s;}
function showErr(m){var b=q("#pl-eb");if(!b)return;b.textContent="⚠ "+m;b.classList.add("on");setTimeout(function(){b.classList.remove("on");},7000);}
function contrast(hex){try{var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(r*299+g*587+b*114)/1000>128?"#000":"#fff";}catch{return"#fff";}}
// ── PART 3: Node engine, connections, undo, build element, codegen ──

// ── RESIZE + ZOOM ─────────────────────────────────────────────
var panel=q("#pl-panel"),rh=q("#pl-rh"),_rw=false,_rx=0,_rpw=0;
function setPW(w){S.panelWidth=Math.max(520,Math.min(window.innerWidth*.96,w));panel.style.width=S.panelWidth+"px";rh.style.right=S.panelWidth+"px";}
setPW(S.panelWidth||750);
rh.addEventListener("mousedown",function(e){_rw=true;_rx=e.clientX;_rpw=S.panelWidth;rh.classList.add("drag");e.preventDefault();});

function applyZoom(){
  var ct=q("#pl-ct");if(ct)ct.style.transform="translate("+panX+"px,"+panY+"px) scale("+zoom+")";
  var z=q("#pl-zpct");if(z)z.textContent=Math.round(zoom*100)+"%";
}
function setZoom(z){zoom=Math.max(0.2,Math.min(3,z));applyZoom();}
function fitAll(){
  var ns=Object.values(nReg);if(!ns.length){zoom=1;panX=0;panY=0;applyZoom();return;}
  var xs=ns.map(function(n){return parseFloat(n.el.style.left)||0;});
  var ys=ns.map(function(n){return parseFloat(n.el.style.top)||0;});
  var x2=ns.map(function(n){return (parseFloat(n.el.style.left)||0)+(n.el.offsetWidth||200);});
  var y2=ns.map(function(n){return (parseFloat(n.el.style.top)||0)+(n.el.offsetHeight||110);});
  var mnX=Math.min.apply(null,xs),mnY=Math.min.apply(null,ys),mxX=Math.max.apply(null,x2),mxY=Math.max.apply(null,y2);
  var cw=q("#pl-cw");if(!cw)return;
  var scX=(cw.offsetWidth-60)/(mxX-mnX||1),scY=(cw.offsetHeight-60)/(mxY-mnY||1);
  zoom=Math.min(1,scX,scY);panX=30-mnX*zoom;panY=30-mnY*zoom;applyZoom();
}

// ── PALETTE ───────────────────────────────────────────────────
function buildPalette(f){
  f=f||"";var list=q("#pl-plist");if(!list)return;list.innerHTML="";
  var grps={};
  ND.forEach(function(d){
    if(!S.showLogic&&d.g==="🔀 Logic")return;
    if(f&&d.label.toLowerCase().indexOf(f.toLowerCase())<0&&d.g.toLowerCase().indexOf(f.toLowerCase())<0)return;
    if(!grps[d.g])grps[d.g]=[];grps[d.g].push(d);
  });
  Object.keys(grps).forEach(function(g){
    var defs=grps[g],gc=GC[g]||"#888";
    var w=document.createElement("div");
    var hd=document.createElement("div");hd.className="pl-gh";
    hd.innerHTML='<span style="color:'+gc+'">▾</span> '+g+' <span style="color:'+gc+';opacity:.4;font-size:8px">('+defs.length+')</span>';
    var bd=document.createElement("div");var col=false;
    hd.addEventListener("click",function(){col=!col;bd.style.display=col?"none":"";hd.querySelector("span").textContent=col?"▸":"▾";});
    defs.forEach(function(def){
      var item=document.createElement("div");item.className="pl-gi";
      item.innerHTML='<div class="pl-ico" style="background:'+gc+'22;color:'+gc+'">'+def.icon+'</div><span>'+def.label+'</span>';
      item.title=def.label;
      item.addEventListener("click",function(){addNode(def.type,50+Math.random()*160,50+Math.random()*110);});
      bd.appendChild(item);
    });
    w.appendChild(hd);w.appendChild(bd);list.appendChild(w);
  });
  var h=q("#pl-hint");if(h)h.style.display=Object.keys(nReg).length?"none":"block";
}

// ── ADD NODE ──────────────────────────────────────────────────
function addNode(type,x,y,data,fid){
  data=data||{};x=x||50;y=y||50;
  var def=null;for(var i=0;i<ND.length;i++){if(ND[i].type===type){def=ND[i];break;}}if(!def)return null;
  var id=fid||("n"+(++idC));
  var gc=GC[def.g]||"#888";
  var el=document.createElement("div");el.className="pl-node";el.dataset.id=id;
  el.style.left=x+"px";el.style.top=y+"px";
  var hd=document.createElement("div");hd.className="pl-nh";
  hd.innerHTML='<div class="pl-nb2" style="background:'+gc+'">'+def.icon+'</div><div class="pl-nl">'+def.label+'</div><button class="pl-ndel" title="Delete">✕</button>';
  el.appendChild(hd);
  var body=document.createElement("div");body.className="pl-nb";
  def.f.forEach(function(f){
    var row=document.createElement("div");row.className="pl-row";
    if(f.t==="ta"){
      var ta=document.createElement("textarea");ta.dataset.key=f.k;ta.placeholder=f.ph||"";
      ta.value=data[f.k]!==undefined?data[f.k]:(f.def||"");row.appendChild(ta);
    }else{
      if(f.l){var lb=document.createElement("label");lb.textContent=f.l;row.appendChild(lb);}
      var inp;
      if(f.t==="sel"){inp=document.createElement("select");(f.opts||[]).forEach(function(o){var op=document.createElement("option");op.value=o;op.textContent=o;inp.appendChild(op);});}
      else if(f.t==="chk"){inp=document.createElement("input");inp.type="checkbox";inp.checked=data[f.k]!==undefined?!!data[f.k]:false;}
      else{inp=document.createElement("input");inp.type=f.t==="col"?"color":f.t==="num"?"number":"text";if(f.ph)inp.placeholder=f.ph;if(f.min!=null)inp.min=f.min;if(f.max!=null)inp.max=f.max;if(f.step!=null)inp.step=f.step;}
      inp.dataset.key=f.k;
      if(f.t!=="chk"){var val=data[f.k]!==undefined?data[f.k]:(f.def!==undefined?f.def:"");inp.value=val||(f.t==="col"?"#7b1fa2":"");}
      row.appendChild(inp);
    }
    body.appendChild(row);
  });
  el.appendChild(body);
  var cz=document.createElement("div");cz.className="pl-cz";
  cz.innerHTML='<div class="pl-dot top" data-id="'+id+'" data-w="top"></div><div class="pl-dot bot" data-id="'+id+'" data-w="bot"></div>';
  el.appendChild(cz);
  q("#pl-nodes").appendChild(el);
  var node={id:id,type:type,def:def,el:el,x:x,y:y,parentId:null,childrenIds:[]};
  nReg[id]=node;
  hd.addEventListener("mousedown",function(e){
    if(e.target.classList.contains("pl-ndel"))return;
    e.preventDefault();drag=node;selNode=node;
    qa(".pl-node").forEach(function(n){n.classList.remove("sel");});el.classList.add("sel");
    var r=el.getBoundingClientRect();dOff.x=e.clientX-r.left;dOff.y=e.clientY-r.top;el.style.zIndex=9999;
  });
  hd.querySelector(".pl-ndel").addEventListener("click",function(){
    if(S.confirmDelete&&!confirm("Delete this block?"))return;
    pushSnap("Delete");removeNode(id);
  });
  el.addEventListener("contextmenu",function(e){
    e.preventDefault();selNode=node;qa(".pl-node").forEach(function(n){n.classList.remove("sel");});el.classList.add("sel");
    toast("Selected: "+def.label+" — Ctrl+C copy, Del delete");
  });
  qa("[data-key]",el).forEach(function(i){
    i.addEventListener("input",function(){updatePreview();autoSave();if(S.liveInject)schedLive();});
  });
  qa(".pl-dot",el).forEach(function(d){
    d.addEventListener("mousedown",function(e){e.stopPropagation();e.preventDefault();connFrom={nid:id,w:d.dataset.w,el:d};});
  });
  var h=q("#pl-hint");if(h)h.style.display="none";
  updatePreview();autoSave();return node;
}

function removeNode(id){
  var n=nReg[id];if(!n)return;
  if(n.parentId){var p=nReg[n.parentId];if(p)p.childrenIds=p.childrenIds.filter(function(c){return c!==id;});}
  n.childrenIds.forEach(function(cid){var c=nReg[cid];if(c)c.parentId=null;});
  n.el.remove();delete nReg[id];if(selNode&&selNode.id===id)selNode=null;
  drawConns();updatePreview();autoSave();
  var h=q("#pl-hint");if(h)h.style.display=Object.keys(nReg).length?"none":"block";
}

// ── COPY/PASTE ────────────────────────────────────────────────
function copyNode(id){
  var n=nReg[id];if(!n)return;
  var vals={};qa("[data-key]",n.el).forEach(function(i){vals[i.dataset.key]=i.type==="checkbox"?i.checked:i.value;});
  clipboard={type:n.type,data:vals};
  n.el.style.outline="2px solid "+T().acc;
  setTimeout(function(){if(n.el)n.el.style.outline="";},900);
  toast("Copied: "+n.def.label);
}
function pasteNode(){
  if(!clipboard){toast("Nothing to paste");return;}
  pushSnap("Paste");addNode(clipboard.type,65+Math.random()*80,65+Math.random()*55,clipboard.data);toast("Pasted!");
}

// ── MOUSE ─────────────────────────────────────────────────────
document.addEventListener("mousemove",function(e){
  if(_rw){setPW(_rpw+(_rx-e.clientX));return;}
  if(drag){
    var wr=q("#pl-cw").getBoundingClientRect();
    var nx=(e.clientX-wr.left-dOff.x-panX)/zoom;
    var ny=(e.clientY-wr.top-dOff.y-panY)/zoom;
    if(S.snapGrid){nx=Math.round(nx/S.gridSize)*S.gridSize;ny=Math.round(ny/S.gridSize)*S.gridSize;}
    if(S.snapNodes){
      Object.values(nReg).forEach(function(other){
        if(other.id===drag.id)return;
        var ox=parseFloat(other.el.style.left)||0,oy=parseFloat(other.el.style.top)||0;
        if(Math.abs(nx-ox)<13)nx=ox;if(Math.abs(ny-oy)<13)ny=oy;
        if(Math.abs(nx-(ox+205))<13)nx=ox+205;
      });
    }
    drag.el.style.left=nx+"px";drag.el.style.top=ny+"px";drawConns();
  }
  if(connFrom)drawConns(e);
});
document.addEventListener("mouseup",function(e){
  if(_rw){_rw=false;rh.classList.remove("drag");saveSett();return;}
  if(drag){drag.el.style.zIndex="";drag=null;autoSave();}
  if(connFrom){
    var tgt=document.elementFromPoint(e.clientX,e.clientY);
    if(tgt&&tgt.classList.contains("pl-dot")&&tgt.dataset.id!==connFrom.nid){
      var toId=tgt.dataset.id,toW=tgt.dataset.w,fn=nReg[connFrom.nid],tn=nReg[toId];
      if(fn&&tn){
        var par=null,ch=null;
        if(connFrom.w==="bot"&&toW==="top"){par=fn;ch=tn;}
        if(connFrom.w==="top"&&toW==="bot"){par=tn;ch=fn;}
        if(par&&ch){
          if(ch.parentId&&ch.parentId!==par.id){var op=nReg[ch.parentId];if(op)op.childrenIds=op.childrenIds.filter(function(x){return x!==ch.id;});}
          if(par.childrenIds.indexOf(ch.id)<0){pushSnap("Connect");par.childrenIds.push(ch.id);ch.parentId=par.id;toast("Connected ✓");}
          drawConns();updatePreview();autoSave();
        }
      }
    }
    connFrom=null;drawConns();
  }
});
q("#pl-cw").addEventListener("wheel",function(e){if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(zoom+(e.deltaY<0?.1:-.1));}},{passive:false});
q("#pl-zoom-in").addEventListener("click",function(){setZoom(zoom+.15);});
q("#pl-zoom-out").addEventListener("click",function(){setZoom(zoom-.15);});
q("#pl-zoom-fit").addEventListener("click",fitAll);

// ── SVG CONNECTIONS ───────────────────────────────────────────
function drawConns(me){
  var svg=q("#pl-svg");if(!svg)return;
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  var wr=q("#pl-nodes").getBoundingClientRect(),t=T();
  qa(".pl-dot").forEach(function(d){d.classList.remove("on");});
  Object.values(nReg).forEach(function(n){
    n.childrenIds.forEach(function(cid){
      var c=nReg[cid];if(!c)return;
      var pr=n.el.getBoundingClientRect(),cr=c.el.getBoundingClientRect();
      mkCurve(svg,pr.left+pr.width/2-wr.left,pr.bottom-wr.top,cr.left+cr.width/2-wr.left,cr.top-wr.top,t.conn,2.5,false);
      var bd=n.el.querySelector(".pl-dot.bot");if(bd)bd.classList.add("on");
      var td=c.el.querySelector(".pl-dot.top");if(td)td.classList.add("on");
    });
  });
  if(connFrom&&me){
    var fr=connFrom.el.getBoundingClientRect();
    mkCurve(svg,fr.left+fr.width/2-wr.left,fr.top+fr.height/2-wr.top,me.clientX-wr.left,me.clientY-wr.top,t.acc3,2,true);
  }
}
function mkCurve(svg,x1,y1,x2,y2,s,w,dash){
  var dy=Math.abs(y2-y1)*.5+38;
  var p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d","M"+x1+" "+y1+" C"+x1+" "+(y1+dy)+" "+x2+" "+(y2-dy)+" "+x2+" "+y2);
  p.setAttribute("stroke",s);p.setAttribute("stroke-width",w);p.setAttribute("fill","none");p.setAttribute("stroke-linecap","round");
  if(dash)p.setAttribute("stroke-dasharray","5,4");svg.appendChild(p);
}

// ── UNDO/REDO ─────────────────────────────────────────────────
function getSnap(){return{nodes:Object.values(nReg).map(function(n){var v={};qa("[data-key]",n.el).forEach(function(i){v[i.dataset.key]=i.type==="checkbox"?i.checked:i.value;});return{id:n.id,type:n.type,x:parseFloat(n.el.style.left)||0,y:parseFloat(n.el.style.top)||0,data:v,parentId:n.parentId,childrenIds:n.childrenIds.slice()};})}}
function applySnap(snap){Object.keys(nReg).forEach(function(id){try{nReg[id].el.remove();}catch{}delete nReg[id];});snap.nodes.forEach(function(n){addNode(n.type,n.x,n.y,n.data,n.id);});snap.nodes.forEach(function(n){var nd=nReg[n.id];if(!nd)return;nd.parentId=n.parentId||null;nd.childrenIds=(n.childrenIds||[]).slice();});drawConns();updatePreview();var h=q("#pl-hint");if(h)h.style.display=Object.keys(nReg).length?"none":"block";}
function pushSnap(lbl){uPast.push({l:lbl||"Edit",s:JSON.stringify(getSnap()),t:Date.now()});if(uPast.length>MAX_U)uPast.shift();uFuture=[];renderHist();}
function undo(){if(!uPast.length){toast("Nothing to undo");return;}uFuture.push({l:"undo",s:JSON.stringify(getSnap()),t:Date.now()});var item=uPast.pop();applySnap(JSON.parse(item.s));toast("Undo: "+(item.l||"Edit"));renderHist();}
function redo(){if(!uFuture.length){toast("Nothing to redo");return;}uPast.push({l:"redo",s:JSON.stringify(getSnap()),t:Date.now()});applySnap(JSON.parse(uFuture.pop().s));toast("Redo");renderHist();}
function renderHist(){
  var list=q("#pl-histlist");if(!list)return;list.innerHTML="";
  if(!uPast.length){list.innerHTML='<div style="text-align:center;color:var(--dim,#454d60);font-size:11px;padding:18px">No history yet</div>';return;}
  uPast.slice().reverse().forEach(function(item,i){
    var d=document.createElement("div");d.className="pl-hist-item"+(i===0?" cur":"");
    var dt=new Date(item.t);var ts=dt.getHours()+":"+String(dt.getMinutes()).padStart(2,"0")+":"+String(dt.getSeconds()).padStart(2,"0");
    d.innerHTML=(item.l||"Edit")+'<span class="pl-hist-time">'+ts+'</span>';
    var idx=uPast.length-1-i;
    d.addEventListener("click",function(){while(uPast.length>idx+1)uFuture.push(uPast.pop());var tgt=uPast[uPast.length-1];if(tgt){applySnap(JSON.parse(tgt.s));toast("Jumped to: "+tgt.l);renderHist();}});
    list.appendChild(d);
  });
}

// ── BUILD ELEMENT ─────────────────────────────────────────────
function gv(n,k){var i=n.el.querySelector('[data-key="'+k+'"]');if(!i)return undefined;return i.type==="checkbox"?i.checked:i.value;}
function pf(n,k,d){return parseFloat(gv(n,k))||d||0;}
function pi(n,k,d){return parseInt(gv(n,k))||d||0;}

function buildEl(){
  var el={
    name:(q("#pl-elname")||{}).value?.trim().replace(/\s+/g,"_")||"my_element",
    color:"#7b1fa2",color2:null,color3:null,glow:0,glowColor:"#00e5ff",opacity:1,shimmer:0,pixelSize:1,
    state:"solid",behavior:"POWDER",density:1000,friction:0.5,viscosity:0.5,spreadRate:1,gravity:1,
    stickiness:0,lifetime:0,indestructible:false,float:false,wall:false,hardness:0.5,elastic:0,
    temp:25,heatConduct:0.5,flammable:0,tempHigh:null,tempHighElem:"",tempLow:null,tempLowElem:"",
    meltPt:null,meltElem:"",boilPt:null,boilElem:"",freezePt:null,freezeElem:"",selfHeat:0,selfCool:0,
    category:S.defaultCategory,tags:[],reactions:{},radioactive:0,corrosive:0,explosion:null,conduct:false,toxic:0,
    logicBlocks:[],spawnDefs:[],customTick:null,onCreate:null,onTouch:null,onDestroy:null,
    special:{},desc:"",hidden:false
  };
  Object.values(nReg).forEach(function(n){
    var t=n.type;
    if(t==="setName")el.name=gv(n,"name")||el.name;
    if(t==="setCategory")el.category=gv(n,"category")||el.category;
    if(t==="setState")el.state=gv(n,"state")||el.state;
    if(t==="setTags")el.tags=(gv(n,"tags")||"").split(",").map(function(s){return s.trim();}).filter(Boolean);
    if(t==="setDesc")el.desc=gv(n,"desc")||"";
    if(t==="setHidden")el.hidden=!!gv(n,"hidden");
    if(t==="setColor")el.color=gv(n,"color")||el.color;
    if(t==="setColor2")el.color2=gv(n,"color2");
    if(t==="setColor3")el.color3=gv(n,"color3");
    if(t==="setGlow")el.glow=pf(n,"glow");
    if(t==="setGlowColor")el.glowColor=gv(n,"glowColor")||el.glowColor;
    if(t==="setOpacity")el.opacity=pf(n,"opacity",1);
    if(t==="setShimmer")el.shimmer=pf(n,"shimmer");
    if(t==="setPixelSize")el.pixelSize=pi(n,"pixelSize",1);
    if(t==="setBehavior")el.behavior=gv(n,"behavior")||el.behavior;
    if(t==="setDensity")el.density=pf(n,"density",1000);
    if(t==="setFriction")el.friction=pf(n,"friction",0.5);
    if(t==="setViscosity")el.viscosity=pf(n,"viscosity",0.5);
    if(t==="setSpreadRate")el.spreadRate=pi(n,"spreadRate",1);
    if(t==="setGravity")el.gravity=pf(n,"gravity",1);
    if(t==="setStickiness")el.stickiness=pf(n,"stickiness");
    if(t==="setLifetime")el.lifetime=pi(n,"lifetime");
    if(t==="setIndestructible")el.indestructible=!!gv(n,"indestructible");
    if(t==="setFloat")el.float=!!gv(n,"float");
    if(t==="setWall")el.wall=!!gv(n,"wall");
    if(t==="setHardness")el.hardness=pf(n,"hardness",0.5);
    if(t==="setElastic")el.elastic=pf(n,"elastic");
    if(t==="setTemp")el.temp=pf(n,"temp",25);
    if(t==="setTempHigh"){el.tempHigh=pf(n,"tempHigh",100);el.tempHighElem=gv(n,"tempHighElem")||"";}
    if(t==="setTempLow"){el.tempLow=pf(n,"tempLow",0);el.tempLowElem=gv(n,"tempLowElem")||"";}
    if(t==="setHeatConduct")el.heatConduct=pf(n,"heatConduct",0.5);
    if(t==="setFlammable")el.flammable=pi(n,"flammable");
    if(t==="setMeltPoint"){el.meltPt=pf(n,"meltPt",1000);el.meltElem=gv(n,"meltElem")||"";}
    if(t==="setBoilPoint"){el.boilPt=pf(n,"boilPt",100);el.boilElem=gv(n,"boilElem")||"";}
    if(t==="setFreezePoint"){el.freezePt=pf(n,"freezePt",0);el.freezeElem=gv(n,"freezeElem")||"";}
    if(t==="setSelfHeat")el.selfHeat=pf(n,"selfHeat");
    if(t==="setSelfCool")el.selfCool=pf(n,"selfCool");
    if(t==="addReaction"){var a=gv(n,"touching"),b=gv(n,"becomes"),c=pi(n,"chance",100);if(a&&b)el.reactions[a]={elem1:b,chance:c};}
    if(t==="addReaction2"){var a=gv(n,"touching"),b=gv(n,"elem1"),c2=gv(n,"elem2"),ch=pi(n,"chance",100);if(a&&b)el.reactions[a]={elem1:b,elem2:c2,chance:ch};}
    if(t==="addExplosion")el.explosion=pf(n,"explosion");
    if(t==="setRadioactive")el.radioactive=pi(n,"radioactive");
    if(t==="setCorrosive")el.corrosive=pf(n,"corrosive");
    if(t==="setConduct")el.conduct=!!gv(n,"conduct");
    if(t==="setToxic")el.toxic=pf(n,"toxic");
    var logicT=["ifTemp","ifTempBelow","ifTempRange","ifAge","ifRandom","ifTouching","ifNotTouching","ifOnFire","ifAbove","ifBelow","counter","repeatEvery","andCondition","orCondition","branch","branchTouch","branchTemp","branchRandom","branchFire","branchAge","branchNeighbor"];
    if(logicT.indexOf(t)>=0)el.logicBlocks.push(Object.assign({type:t},Object.fromEntries(n.def.f.map(function(f){return[f.k,gv(n,f.k)];}))));
    var spawnT=["spawnAbove","spawnBelow","spawnLeft","spawnRight","spawnRandom","spawnRadius","cloneAround","spawnOnDeath","spawnLine"];
    if(spawnT.indexOf(t)>=0)el.spawnDefs.push(Object.assign({type:t},Object.fromEntries(n.def.f.map(function(f){return[f.k,gv(n,f.k)];}))));
    if(t==="setCustomTick")el.customTick=gv(n,"customTick")||null;
    if(t==="setOnCreate")el.onCreate=gv(n,"onCreate")||null;
    if(t==="setOnTouch")el.onTouch=gv(n,"onTouch")||null;
    if(t==="setOnDestroy")el.onDestroy=gv(n,"onDestroy")||null;
    if(t==="setTimer")el.special.timer={frames:pi(n,"timerFrames",300),result:gv(n,"timerResult")||""};
    if(t==="setGenerator")el.special.generator={elem:gv(n,"genElem")||"",side:gv(n,"genSide")||"all"};
    if(t==="setVoid")el.special.void={radius:pi(n,"voidRadius",1)};
    if(t==="setConverter")el.special.converter={from:gv(n,"convertFrom")||"",to:gv(n,"convertTo")||""};
    if(t==="setGrow")el.special.grow={elem:gv(n,"growElem")||"",time:pi(n,"growTime",200)};
    if(t==="setBlackHole")el.special.blackhole={radius:pi(n,"bhRadius",3),strength:pf(n,"bhStr",1)};
    if(t==="setNuke")el.special.nuke={radius:pi(n,"nukeRadius",10),delay:pi(n,"nukeDelay",60)};
  });
  return el;
}

// ── CODE GENERATION ───────────────────────────────────────────
function buildLogicCode(el){
  if(!el.logicBlocks.length)return"";
  var L=["  // Logic — Pixel Lab v"+VER];
  el.logicBlocks.forEach(function(b){
    if(b.type==="ifTemp")L.push("  if((pixel.temp||25)>"+b.tempVal+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifTempBelow")L.push("  if((pixel.temp||25)<"+b.tempVal+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifTempRange")L.push("  if((pixel.temp||25)>="+b.tempMin+"&&(pixel.temp||25)<="+b.tempMax+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifAge")L.push("  if(!pixel.extra)pixel.extra={_a:0};pixel.extra._a++;if(pixel.extra._a>"+b.ageVal+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifRandom")L.push("  if(Math.random()*100<"+b.randChance+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifOnFire")L.push("  if(pixel.fire){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="counter")L.push("  if(!pixel.extra)pixel.extra={_c:0};pixel.extra._c++;if(pixel.extra._c>="+b.countTo+"){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="repeatEvery")L.push("  if(!pixel.extra)pixel.extra={_r:0};pixel.extra._r++;if(pixel.extra._r%"+(b.repeatN||10)+"===0){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifTouching")L.push("  if([[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.touchElem+"';})){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifNotTouching")L.push("  if([[0,-1],[0,1],[-1,0],[1,0]].every(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return!p||p.element!=='"+b.touchElem+"';})){pixel.element='"+b.thenElem+"';return;}");
    if(b.type==="ifAbove")L.push("  {var _pa=typeof getPixel!='undefined'&&getPixel(x,y-1);if(_pa&&_pa.element==='"+b.aboveElem+"'){pixel.element='"+b.thenElem+"';return;}}");
    if(b.type==="ifBelow")L.push("  {var _pb=typeof getPixel!='undefined'&&getPixel(x,y+1);if(_pb&&_pb.element==='"+b.belowElem+"'){pixel.element='"+b.thenElem+"';return;}}");
  });
  // Branch blocks
  el.logicBlocks.forEach(function(b){
    if(b.type==="branch"){
      var condCode="false";
      if(b.condition==="touching")condCode="[[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.condVal+"';})";
      if(b.condition==="temp>")condCode="(pixel.temp||25)>"+b.condVal;
      if(b.condition==="temp<")condCode="(pixel.temp||25)<"+b.condVal;
      if(b.condition==="random%")condCode="Math.random()*100<"+b.condVal;
      if(b.condition==="on_fire")condCode="pixel.fire";
      if(b.condition==="age>")condCode="(pixel.extra&&pixel.extra._a||0)>"+b.condVal;
      if(b.thenElem&&b.elseElem)L.push("  if("+condCode+"){pixel.element='"+b.thenElem+"';return;}else{pixel.element='"+b.elseElem+"';return;}");
      else if(b.thenElem)L.push("  if("+condCode+"){pixel.element='"+b.thenElem+"';return;}");
    }
    if(b.type==="branchTouch"){
      if(b.thenElem&&b.elseElem)L.push("  if([[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.touchElem+"';})){pixel.element='"+b.thenElem+"';return;}else{pixel.element='"+b.elseElem+"';return;}");
      else if(b.thenElem)L.push("  if([[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.touchElem+"';})){pixel.element='"+b.thenElem+"';return;}");
    }
    if(b.type==="branchTemp"){
      var op=b.dir==="above"?">":"<";
      if(b.thenElem&&b.elseElem)L.push("  if((pixel.temp||25)"+op+b.tempVal+"){pixel.element='"+b.thenElem+"';return;}else{pixel.element='"+b.elseElem+"';return;}");
    }
    if(b.type==="branchRandom"){
      if(b.thenElem&&b.elseElem)L.push("  if(Math.random()*100<"+b.chance+"){pixel.element='"+b.thenElem+"';return;}else{pixel.element='"+b.elseElem+"';return;}");
    }
    if(b.type==="branchFire"){
      if(b.thenElem&&b.elseElem)L.push("  if(pixel.fire){pixel.element='"+b.thenElem+"';return;}else{pixel.element='"+b.elseElem+"';return;}");
    }
    if(b.type==="branchAge"){
      if(b.thenElem&&b.elseElem)L.push("  if(!pixel.extra)pixel.extra={_a:0};pixel.extra._a++;if(pixel.extra._a>"+b.ageVal+"){pixel.element='"+b.thenElem+"';return;}else if(pixel.extra._a===1){pixel.element='"+b.elseElem+"';}");
    }
    if(b.type==="branchNeighbor"){
      L.push("  {var _nb=[[0,-1],[0,1],[-1,0],[1,0]];var _nA=_nb.some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.elemA+"';});var _nB=_nb.some(function(d){var p=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return p&&p.element==='"+b.elemB+"';});if(_nA){pixel.element='"+b.thenElem+"';return;}if(_nB){pixel.element='"+b.elseElem+"';return;}}");
    }
  });
  return L.join("\n");
}

function buildSpawnCode(el){
  if(!el.spawnDefs.length)return"";
  var L=["  // Spawn"],sf="typeof getPixel!='undefined'&&typeof createPixel!='undefined'";
  el.spawnDefs.forEach(function(s){
    var ch=s.spawnChance||5;
    if(s.type==="spawnAbove")L.push("  if("+sf+"&&Math.random()*100<"+ch+"&&!getPixel(x,y-1))createPixel('"+s.spawnElem+"',x,y-1);");
    if(s.type==="spawnBelow")L.push("  if("+sf+"&&Math.random()*100<"+ch+"&&!getPixel(x,y+1))createPixel('"+s.spawnElem+"',x,y+1);");
    if(s.type==="spawnLeft")L.push("  if("+sf+"&&Math.random()*100<"+ch+"&&!getPixel(x-1,y))createPixel('"+s.spawnElem+"',x-1,y);");
    if(s.type==="spawnRight")L.push("  if("+sf+"&&Math.random()*100<"+ch+"&&!getPixel(x+1,y))createPixel('"+s.spawnElem+"',x+1,y);");
    if(s.type==="spawnRandom")L.push("  {var _sd=[[0,-1],[0,1],[-1,0],[1,0]][Math.floor(Math.random()*4)];if("+sf+"&&Math.random()*100<"+ch+"&&!getPixel(x+_sd[0],y+_sd[1]))createPixel('"+s.spawnElem+"',x+_sd[0],y+_sd[1]);}");
    if(s.type==="cloneAround")L.push("  if("+sf+"&&Math.random()*100<"+(s.cloneChance||1)+"){var _sd=[[0,-1],[0,1],[-1,0],[1,0]][Math.floor(Math.random()*4)];if(!getPixel(x+_sd[0],y+_sd[1]))createPixel(pixel.element,x+_sd[0],y+_sd[1]);}");
  });
  return L.join("\n");
}

function generateJS(el){
  var beh=el.float?"behaviors.GAS":(el.wall?"behaviors.WALL":("behaviors."+(el.behavior||"POWDER")));
  var c="// Generated by Pixel Lab v"+VER+" — by "+AUTHOR+"\nelements['"+el.name+"'] = {\n";
  c+="  color: '"+el.color+"',\n";
  if(el.color2)c+="  color2: '"+el.color2+"',\n";
  if(el.color3)c+="  color3: '"+el.color3+"',\n";
  c+="  category: '"+el.category+"',\n  state: '"+el.state+"',\n";
  if(el.tags.length)c+="  tags: "+JSON.stringify(el.tags)+",\n";
  if(el.desc)c+="  desc: '"+el.desc.replace(/'/g,"\\'"
)+"',\n";
  if(el.hidden)c+="  hidden: true,\n";
  c+="  behavior: "+beh+",\n  density: "+el.density+",\n";
  if(el.friction!==0.5)c+="  friction: "+el.friction+",\n";
  if(el.viscosity!==0.5)c+="  viscosity: "+el.viscosity+",\n";
  if(el.spreadRate!==1)c+="  spreadRate: "+el.spreadRate+",\n";
  if(!el.float&&el.gravity!==1)c+="  gravity: "+el.gravity+",\n";
  if(el.stickiness)c+="  stickiness: "+el.stickiness+",\n";
  if(el.lifetime)c+="  lifetime: "+el.lifetime+",\n";
  if(el.opacity!==1)c+="  opacity: "+el.opacity+",\n";
  if(el.glow)c+="  glow: "+el.glow+",\n  glowColor: '"+el.glowColor+"',\n";
  if(el.temp!==25)c+="  temp: "+el.temp+",\n";
  if(el.heatConduct!==0.5)c+="  heatConduct: "+el.heatConduct+",\n";
  if(el.flammable)c+="  flammable: "+el.flammable+",\n";
  if(el.tempHigh!=null)c+="  tempHigh: "+el.tempHigh+",\n  tempHighElement: '"+el.tempHighElem+"',\n";
  if(el.tempLow!=null)c+="  tempLow: "+el.tempLow+",\n  tempLowElement: '"+el.tempLowElem+"',\n";
  if(el.radioactive)c+="  radioactive: "+el.radioactive+",\n";
  if(el.corrosive)c+="  corrosive: "+el.corrosive+",\n";
  if(el.explosion)c+="  explosion: "+el.explosion+",\n";
  if(el.conduct)c+="  conduct: true,\n";
  if(el.indestructible)c+="  indestructible: true,\n";
  if(Object.keys(el.reactions).length){c+="  reactions: {\n";Object.entries(el.reactions).forEach(function(kv){c+="    '"+kv[0]+"': {elem1:'"+kv[1].elem1+"'"+(kv[1].elem2?",elem2:'"+kv[1].elem2+"'":"")+(kv[1].chance!==100?",chance:"+kv[1].chance:"")+"},\n";});c+="  },\n";}
  var lg=buildLogicCode(el),sp=buildSpawnCode(el);
  var tp=[lg,sp];
  if(el.selfHeat)tp.push("  pixel.temp=(pixel.temp||25)+"+el.selfHeat+";");
  if(el.selfCool)tp.push("  pixel.temp=(pixel.temp||25)-"+el.selfCool+";");
  if(el.special.timer)tp.push("  if(!pixel.extra)pixel.extra={_t:0};pixel.extra._t++;if(pixel.extra._t>="+el.special.timer.frames+"){pixel.element='"+el.special.timer.result+"';return;}");
  if(el.special.grow)tp.push("  if(!pixel.extra)pixel.extra={_g:0};pixel.extra._g++;if(pixel.extra._g>="+el.special.grow.time+"){pixel.element='"+el.special.grow.elem+"';return;}");
  if(el.special.generator){var gd={up:"[[0,-1]]",down:"[[0,1]]",left:"[[-1,0]]",right:"[[1,0]]",all:"[[0,-1],[0,1],[-1,0],[1,0]]"};tp.push("  ("+(gd[el.special.generator.side]||"[[0,-1]]")+").forEach(function(d){if(typeof getPixel!='undefined'&&typeof createPixel!='undefined'&&!getPixel(x+d[0],y+d[1]))createPixel('"+el.special.generator.elem+"',x+d[0],y+d[1]);});");}
  if(el.customTick)tp.push("  (function(){\n    "+el.customTick.split("\n").join("\n    ")+"\n  }).call(this);");
  var allT=tp.filter(Boolean).join("\n");
  if(allT.trim())c+="  tick: function(pixel, x, y, pixels) {\n    try {\n"+allT+"\n    } catch(_e) {}\n  },\n";
  if(el.onCreate)c+="  onCreate: function(pixel) { try{\n    "+el.onCreate.split("\n").join("\n    ")+"\n  }catch(_e){} },\n";
  if(el.onTouch)c+="  onTouch: function(pixel, neighbor) { try{\n    "+el.onTouch.split("\n").join("\n    ")+"\n  }catch(_e){} },\n";
  c+="};\n";
  return c;
}
// ── PART 4: Inject, preview, VCE, mod loader, library, settings, wiring ──

// ── INJECT INTO SANDBOXELS ────────────────────────────────────
function injectEl(el){
  try{
    if(typeof elements==="undefined"){toast("⚠ Sandboxels not detected");return;}

    var beh;
    try{
      if(el.float)beh=behaviors.GAS;
      else if(el.wall)beh=behaviors.WALL;
      else beh=behaviors[el.behavior]||behaviors.POWDER;
      if(!beh)beh=behaviors.POWDER;
    }catch(_e){beh=behaviors.POWDER;}

    var obj={
      color: el.color||"#888888",
      behavior: beh,
      category: (el.category||"special").toLowerCase(),
      state: el.state||"solid",
    };

    if(el.color2)obj.color2=el.color2;
    if(el.color3)obj.color3=el.color3;
    if(el.density&&el.density!==1000)obj.density=el.density;
    if(el.glow){obj.glow=el.glow;obj.glowColor=el.glowColor;}
    if(el.opacity!==1)obj.opacity=el.opacity;
    if(el.desc)obj.desc=el.desc;
    if(el.hidden)obj.hidden=true;
    if(el.tags&&el.tags.length)obj.tags=el.tags;
    if(el.temp&&el.temp!==25)obj.temp=el.temp;
    if(el.heatConduct&&el.heatConduct!==0.5)obj.heatConduct=el.heatConduct;
    if(el.flammable)obj.flammable=el.flammable;
    if(el.explosion)obj.explosion=el.explosion;
    if(el.tempHigh!=null){obj.tempHigh=el.tempHigh;obj.stateHigh=el.tempHighElem;}
    if(el.tempLow!=null){obj.tempLow=el.tempLow;obj.stateLow=el.tempLowElem;}
    if(el.radioactive)obj.radioactive=el.radioactive;
    if(el.corrosive)obj.corrosive=el.corrosive;
    if(el.conduct)obj.conduct=true;
    if(el.indestructible)obj.indestructible=true;
    if(el.stickiness)obj.stickiness=el.stickiness;
    if(el.lifetime)obj.lifetime=el.lifetime;
    if(el.friction&&el.friction!==0.5)obj.friction=el.friction;
    if(el.viscosity&&el.viscosity!==0.5)obj.viscosity=el.viscosity;
    if(el.spreadRate&&el.spreadRate!==1)obj.spreadRate=el.spreadRate;
    if(!el.float&&el.gravity&&el.gravity!==1)obj.gravity=el.gravity;
    if(el.selfHeat)obj.selfHeat=el.selfHeat;
    if(el.selfCool)obj.selfCool=el.selfCool;
    if(Object.keys(el.reactions).length)obj.reactions=el.reactions;

    // Build tick — tick(pixel) only, use pixel.element = 'x' to change
    var tickParts=[];
    var lg=buildLogicCode(el);if(lg.trim())tickParts.push(lg);
    var sp=buildSpawnCode(el);if(sp.trim())tickParts.push(sp);
    if(el.selfHeat)tickParts.push("  pixel.temp=(pixel.temp||25)+"+el.selfHeat+";");
    if(el.selfCool)tickParts.push("  pixel.temp=(pixel.temp||25)-"+el.selfCool+";");
    if(el.special.timer)tickParts.push("  if(!pixel.extra)pixel.extra={_t:0};pixel.extra._t++;if(pixel.extra._t>="+el.special.timer.frames+"){pixel.element='"+el.special.timer.result+"';return;}");
    if(el.special.grow)tickParts.push("  if(!pixel.extra)pixel.extra={_g:0};pixel.extra._g++;if(pixel.extra._g>="+el.special.grow.time+"){pixel.element='"+el.special.grow.elem+"';return;}");
    if(el.special.generator){
      var gdirs={up:"[[0,-1]]",down:"[[0,1]]",left:"[[-1,0]]",right:"[[1,0]]",all:"[[0,-1],[0,1],[-1,0],[1,0]]"};
      tickParts.push("  ("+( gdirs[el.special.generator.side]||"[[0,-1]]" )+").forEach(function(d){var nx=pixel.x+d[0],ny=pixel.y+d[1];if(typeof getPixel==='function'&&typeof createPixel==='function'&&!getPixel(nx,ny))createPixel('"+el.special.generator.elem+"',nx,ny);});");
    }
    if(tickParts.length){
      try{obj.tick=new Function("pixel","try{"+tickParts.join("")+"}catch(_e){}");}
      catch(ce){showErr("Tick error: "+ce.message);}
    }

    // ── Register element — try addElement() first, fall back to direct assignment ──
    try{
      if(typeof addElement==="function") addElement(el.name, obj);
      else elements[el.name]=obj;
    }catch(e){ elements[el.name]=obj; }
    injected[el.name]=true;

    // Rebuild the sidebar so the button appears
    try{
      if(typeof rebuildMenu==="function") rebuildMenu();
      else if(typeof updateElementButtons==="function") updateElementButtons();
    }catch(e){}

    toast("✅ "+el.name+" added! Check the "+obj.category+" category.");
    setStat("injected: "+el.name);
    var injBtn=q("#pl-inj");
    if(injBtn){injBtn.textContent="✅ Injected!";injBtn.classList.add("done");setTimeout(function(){injBtn.textContent="➕ Add to Sandboxels";injBtn.classList.remove("done");},3000);}
    console.log("[PL] addElement called:",el.name,obj);

  }catch(e){showErr("Inject failed: "+e.message);console.error("[PL]",e);}
}

function injectSidebarBtn(el){
  // Sandboxels builds its own sidebar from the elements object when the game loads.
  // When injecting at runtime we need to manually add the button.
  // The sidebar uses input[type=button] elements inside category divs.
  try{
    var catName=(el.category||"special").toLowerCase();

    // Find the category container — Sandboxels uses id="category-land" etc.
    var catDiv=document.getElementById("category-"+catName);

    // Fallback to special, then any category
    if(!catDiv) catDiv=document.getElementById("category-special");
    if(!catDiv) catDiv=document.querySelector(".category");

    // Still nothing — create it
    if(!catDiv){
      catDiv=document.createElement("div");
      catDiv.id="category-"+catName;
      catDiv.className="category";
      var sidebar=document.getElementById("elementList")||document.getElementById("elements")||document.querySelector(".elementList");
      if(sidebar) sidebar.appendChild(catDiv);
      else document.body.appendChild(catDiv);
    }

    // Remove old button for this element if re-injecting
    var old=catDiv.querySelector("[data-pl='"+el.name+"']");
    if(old)old.remove();

    // Sandboxels uses <input type="button"> for element buttons, NOT <button>
    // The onclick calls selectElement(name)
    var btn=document.createElement("input");
    btn.type="button";
    btn.className="elementButton";
    btn.value=el.name.replace(/_/g," ");
    btn.setAttribute("data-pl",el.name);
    btn.title=el.desc||el.name;
    btn.onclick=function(){
      try{selectElement(el.name);}catch(e){
        // Fallback: set currentElement directly
        if(typeof currentElement!=="undefined") currentElement=el.name;
        console.log("[PL] selected:",el.name);
      }
    };
    // Style to match Sandboxels buttons
    btn.style.background=el.color;
    btn.style.color=contrast(el.color);
    btn.style.borderColor=el.color;

    catDiv.appendChild(btn);
    console.log("[PL] Sidebar button added:",el.name,"→ #category-"+catName);
  }catch(e){
    console.log("[PL] sidebar error:",e);
  }
}
function schedLive(){clearTimeout(liveT);liveT=setTimeout(function(){injectEl(buildEl());},1200);}

// ── PREVIEW ───────────────────────────────────────────────────
var _fc=0,_ft=performance.now();
// Preview — only runs when panel is open, throttled to 8fps max
var _pvLastTime=0;
function updatePreview(force){
  // Never run when panel is closed
  var panel=q("#pl-panel");
  if(!force&&(!panel||!panel.classList.contains("open")))return;
  var el=buildEl();
  var cv=q("#pl-pvc");if(!cv)return;
  var ctx=cv.getContext("2d");ctx.clearRect(0,0,76,76);
  var px=3,cols=Math.floor(76/px),rows=Math.floor(76/px);
  function h2r(h){try{return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}catch{return[100,100,100];}}
  function lerp(a,b,t){return Math.round(a+(b-a)*t);}
  var c1=h2r(el.color||"#7b1fa2"),c2=el.color2?h2r(el.color2):el.color3?h2r(el.color3):c1;
  for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
    if(Math.random()>.82)continue;
    var t2=Math.random(),rgb=[lerp(c1[0],c2[0],t2),lerp(c1[1],c2[1],t2),lerp(c1[2],c2[2],t2)];
    ctx.fillStyle="rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+(el.opacity||1)+")";
    ctx.fillRect(c*px,r*px,px,px);
  }
  if(el.glow>0){ctx.save();ctx.globalAlpha=Math.min(el.glow*.2,.42);ctx.shadowColor=el.glowColor;ctx.shadowBlur=20*el.glow;ctx.fillStyle=el.glowColor;ctx.fillRect(0,0,76,76);ctx.restore();}
  if(el.shimmer>0&&Math.random()<el.shimmer){ctx.save();ctx.globalAlpha=.9;ctx.fillStyle="#fff";ctx.fillRect(Math.random()*74,Math.random()*74,2,2);ctx.restore();}
  var pvn=q("#pl-pvn");if(pvn)pvn.textContent=el.name;
  var props=q("#pl-props");if(props){
    props.innerHTML="";
    var prows=[["state",el.state],["behavior",el.behavior],["density",el.density],["temp",el.temp+"°C"]];
    if(el.glow)prows.push(["glow",el.glow]);
    if(el.tempHigh!=null)prows.push(["hot→",el.tempHigh+"°→"+(el.tempHighElem||"?")]);
    if(el.tempLow!=null)prows.push(["cold→",el.tempLow+"°→"+(el.tempLowElem||"?")]);
    if(el.flammable)prows.push(["flammable",el.flammable+"%"]);
    if(el.explosion)prows.push(["explosion",el.explosion]);
    if(el.logicBlocks.length)prows.push(["logic",el.logicBlocks.length+" block(s)"]);
    if(el.spawnDefs.length)prows.push(["spawn",el.spawnDefs.length+" block(s)"]);
    Object.keys(el.reactions).slice(0,3).forEach(function(k){prows.push(["⚗ "+k,"→"+el.reactions[k].elem1]);});
    prows.forEach(function(rv){props.innerHTML+="<div class='pl-pr'><span class='pl-pk'>"+rv[0]+"</span><span class='pl-pv2'>"+rv[1]+"</span></div>";});
  }
  var cp=q("#pl-codeprev");if(cp){var full=generateJS(el);cp.textContent=full.length>400?full.slice(0,400)+"\n…":full;}
  // Throttled animation — max 8fps, only when panel open
  if(S.animatedPreview){
    cancelAnimationFrame(pvF);
    pvF=requestAnimationFrame(function(ts){
      if(ts-_pvLastTime>120){// ~8fps
        _pvLastTime=ts;
        if(q("#pl-panel")&&q("#pl-panel").classList.contains("open"))updatePreview();
      } else {
        pvF=requestAnimationFrame(function(ts2){_pvLastTime=ts2;if(q("#pl-panel")&&q("#pl-panel").classList.contains("open"))updatePreview();});
      }
    });
  }
}

// ── VCE ───────────────────────────────────────────────────────
var vceScripts=[],vceVars=[];
var VCE_CATS=[
  {name:"Events",color:"#ff9933",blocks:[{id:"on_tick",label:"🔄 On Every Tick"},{id:"on_create",label:"🆕 On Create"},{id:"on_touch",label:"👆 On Touch"}]},
  {name:"Conditions",color:"#cc44ff",blocks:[
    {id:"if_temp_gt",label:"🌡 If Temp >",params:[{k:"val",ph:"100",label:"°C"}]},
    {id:"if_temp_lt",label:"❄️ If Temp <",params:[{k:"val",ph:"0",label:"°C"}]},
    {id:"if_touching",label:"👆 If touching",params:[{k:"elem",ph:"water",label:"elem"}]},
    {id:"if_not_touching",label:"🚫 NOT touching",params:[{k:"elem",ph:"water",label:"elem"}]},
    {id:"if_age_gt",label:"⏳ If age >",params:[{k:"val",ph:"100",label:"frames"}]},
    {id:"if_random",label:"🎲 If random <",params:[{k:"val",ph:"10",label:"%"}]},
    {id:"if_on_fire",label:"🔥 If on fire"},
    {id:"if_health_lt",label:"❤️ If health <",params:[{k:"val",ph:"50",label:"hp"}]},
  ]},
  {name:"Actions",color:"#00cc88",blocks:[
    {id:"become",label:"🔄 Become",params:[{k:"elem",ph:"steam",label:"element"}]},
    {id:"spawn_above",label:"⬆️ Spawn above",params:[{k:"elem",ph:"fire",label:"element"},{k:"chance",ph:"10",label:"%"}]},
    {id:"spawn_below",label:"⬇️ Spawn below",params:[{k:"elem",ph:"smoke",label:"element"},{k:"chance",ph:"10",label:"%"}]},
    {id:"spawn_random",label:"🔀 Spawn random",params:[{k:"elem",ph:"spark",label:"element"},{k:"chance",ph:"5",label:"%"}]},
    {id:"explode",label:"💥 Explode",params:[{k:"power",ph:"3",label:"power"}]},
    {id:"delete_self",label:"💀 Delete self"},
    {id:"set_temp",label:"🌡 Set temp",params:[{k:"val",ph:"100",label:"°C"}]},
    {id:"add_temp",label:"🔥 Add temp",params:[{k:"val",ph:"10",label:"°C"}]},
    {id:"set_health",label:"❤️ Set health",params:[{k:"val",ph:"100",label:"hp"}]},
    {id:"add_health",label:"💊 Add health",params:[{k:"val",ph:"-10",label:"hp"}]},
    {id:"set_var",label:"📦 Set variable",params:[{k:"name",ph:"fuel",label:"var"},{k:"val",ph:"100",label:"value"}]},
    {id:"add_var",label:"➕ Add to var",params:[{k:"name",ph:"fuel",label:"var"},{k:"val",ph:"1",label:"amount"}]},
  ]},
  {name:"Logic",color:"#ff4455",blocks:[
    {id:"repeat_n",label:"🔁 Every N ticks",params:[{k:"n",ph:"10",label:"N"}]},
    {id:"counter_vce",label:"⏲ Counter",params:[{k:"n",ph:"100",label:"frames"},{k:"elem",ph:"ash",label:"→ become"}]},
  ]},
  {name:"Variables",color:"#66ccff",blocks:[
    {id:"add_num_var",label:"🔢 Add Number Var"},
    {id:"add_bool_var",label:"✅ Add Bool Var"},
  ]},
];

function buildVCEPalette(){
  var pal=q("#pl-vce-pal");if(!pal)return;pal.innerHTML="";
  VCE_CATS.forEach(function(cat){
    var lbl=document.createElement("div");lbl.className="vce-clabel";
    lbl.innerHTML='<div class="vce-cdot" style="background:'+cat.color+'"></div>'+cat.name;
    pal.appendChild(lbl);
    var row=document.createElement("div");row.style.cssText="display:flex;flex-wrap:wrap;gap:2px;padding:0 2px 3px;";
    cat.blocks.forEach(function(blk){
      var btn=document.createElement("button");btn.className="vce-add";
      btn.style.cssText="background:"+cat.color+"22;color:"+cat.color+";border-color:"+cat.color+"44;opacity:.85;";
      btn.textContent=blk.label;btn.title=blk.label;
      btn.addEventListener("click",function(){vceAddBlock(cat,blk);});
      row.appendChild(btn);
    });
    pal.appendChild(row);
  });
}

function vceAddBlock(cat,blk){
  if(blk.id.startsWith("on_")){
    if(vceScripts.find(function(s){return s.event===blk.id;})){toast("Event already added!");return;}
    vceScripts.push({event:blk.id,evDef:blk,catColor:cat.color,lines:[]});
    renderVCEScript();return;
  }
  if(blk.id==="add_num_var"||blk.id==="add_bool_var"){
    var name=prompt(blk.id==="add_bool_var"?"Bool variable name:":"Number variable name:","myVar");
    if(!name||!name.trim())return;
    name=name.trim().replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_]/g,"");
    if(vceVars.find(function(v){return v.name===name;})){toast("Variable exists!");return;}
    vceVars.push({name:name,type:blk.id==="add_bool_var"?"bool":"number",def:blk.id==="add_bool_var"?"false":"0"});
    renderVCEVars();toast("Added var: "+name);return;
  }
  if(!vceScripts.length){toast("Add an event block first (On Tick etc.)");return;}
  var params={};(blk.params||[]).forEach(function(p){params[p.k]=p.ph||"";});
  vceScripts[vceScripts.length-1].lines.push({id:blk.id,def:blk,cat:cat,params:params});
  renderVCEScript();
}

function renderVCEScript(){
  var container=q("#pl-vce-script");if(!container)return;container.innerHTML="";
  if(!vceScripts.length){container.innerHTML='<div class="vce-empty">Click an event block above<br>then add conditions and actions</div>';return;}
  vceScripts.forEach(function(script,si){
    var wrap=document.createElement("div");wrap.className="vce-block";
    var hd=document.createElement("div");hd.className="vce-bh";
    hd.style.background=script.catColor||"#888";
    hd.innerHTML='<span>'+script.evDef.label+'</span>';
    var del=document.createElement("button");del.className="vce-bhdel";del.textContent="✕";
    del.addEventListener("click",function(){vceScripts.splice(si,1);renderVCEScript();});
    hd.appendChild(del);wrap.appendChild(hd);
    var bb=document.createElement("div");bb.className="vce-bb";
    script.lines.forEach(function(line,li){
      var row=document.createElement("div");row.className="vce-line "+(line.cat.name==="Conditions"?"cond":line.cat.name==="Actions"?"act":"logic");
      var parts=line.def.label.split(" ");
      row.innerHTML='<span style="opacity:.5">'+parts[0]+'</span> <strong>'+parts.slice(1).join(" ")+'</strong> ';
      (line.def.params||[]).forEach(function(p){
        var inp=document.createElement("input");inp.className="vce-inp";
        inp.type=p.ph&&isNaN(p.ph)?"text":"number";inp.placeholder=p.ph||"";inp.value=line.params[p.k]||p.ph||"";
        inp.title=p.label;
        inp.addEventListener("input",function(){line.params[p.k]=inp.value;});
        row.appendChild(inp);
        var lbl=document.createElement("span");lbl.style.cssText="opacity:.35;font-size:8px;";lbl.textContent=p.label;row.appendChild(lbl);
      });
      var d2=document.createElement("button");d2.className="vce-del";d2.textContent="✕";
      d2.addEventListener("click",function(){script.lines.splice(li,1);renderVCEScript();});
      row.appendChild(d2);bb.appendChild(row);
    });
    wrap.appendChild(bb);container.appendChild(wrap);
  });
}

function renderVCEVars(){
  var list=q("#pl-vce-varlist");if(!list)return;list.innerHTML="";
  if(!vceVars.length){list.innerHTML='<div style="font-size:9px;color:var(--dim);padding:2px 1px">No variables</div>';return;}
  vceVars.forEach(function(v,i){
    var d=document.createElement("div");d.className="vce-vitem";
    d.innerHTML='<span class="vce-vname">'+v.name+'</span><span class="vce-vtype">'+v.type+'</span>';
    var del=document.createElement("button");del.className="vce-vdel";del.textContent="✕";
    del.addEventListener("click",function(){vceVars.splice(i,1);renderVCEVars();});
    d.appendChild(del);list.appendChild(d);
  });
}

function compileVCE(){
  var tickL=[],createL=[],touchL=[];
  var varInit="";
  if(vceVars.length){
    varInit="  if(!pixel.extra)pixel.extra={};\n";
    vceVars.forEach(function(v){
      var def=v.type==="bool"?"false":parseFloat(v.def)||0;
      varInit+="  if(pixel.extra."+v.name+"===undefined)pixel.extra."+v.name+"="+def+";\n";
    });
  }
  vceScripts.forEach(function(script){
    var lines=[],p;
    if(script.event==="on_tick"&&varInit)lines.push(varInit);
    script.lines.forEach(function(line){
      p=line.params||{};
      switch(line.id){
        case"if_temp_gt":lines.push("  if((pixel.temp||25)>"+p.val+"){");break;
        case"if_temp_lt":lines.push("  if((pixel.temp||25)<"+p.val+"){");break;
        case"if_touching":lines.push("  if([[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var _n=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return _n&&_n.element==='"+p.elem+"';})){");break;
        case"if_not_touching":lines.push("  if([[0,-1],[0,1],[-1,0],[1,0]].every(function(d){var _n=typeof getPixel!='undefined'&&getPixel(x+d[0],y+d[1]);return!_n||_n.element!=='"+p.elem+"';})){");break;
        case"if_age_gt":lines.push("  if(!pixel.extra)pixel.extra={};if(!pixel.extra._age)pixel.extra._age=0;pixel.extra._age++;if(pixel.extra._age>"+p.val+"){");break;
        case"if_random":lines.push("  if(Math.random()*100<"+p.val+"){");break;
        case"if_on_fire":lines.push("  if(pixel.fire){");break;
        case"if_health_lt":lines.push("  if(!pixel.extra)pixel.extra={};if(!pixel.extra._hp)pixel.extra._hp=100;if(pixel.extra._hp<"+p.val+"){");break;
        case"repeat_n":lines.push("  if(!pixel.extra)pixel.extra={};if(!pixel.extra._r)pixel.extra._r=0;pixel.extra._r++;if(pixel.extra._r%"+(p.n||10)+"===0){");break;
        case"become":lines.push("    pixel.element='"+p.elem+"';return;");lines.push("  }");return;
        case"spawn_above":lines.push("    if(typeof createPixel!='undefined'&&typeof getPixel!='undefined'&&Math.random()*100<"+(p.chance||10)+"&&!getPixel(x,y-1))createPixel('"+p.elem+"',x,y-1);");break;
        case"spawn_below":lines.push("    if(typeof createPixel!='undefined'&&typeof getPixel!='undefined'&&Math.random()*100<"+(p.chance||10)+"&&!getPixel(x,y+1))createPixel('"+p.elem+"',x,y+1);");break;
        case"spawn_random":lines.push("    {var _sd=[[0,-1],[0,1],[-1,0],[1,0]][Math.floor(Math.random()*4)];if(typeof createPixel!='undefined'&&typeof getPixel!='undefined'&&Math.random()*100<"+(p.chance||5)+"&&!getPixel(x+_sd[0],y+_sd[1]))createPixel('"+p.elem+"',x+_sd[0],y+_sd[1]);}");break;
        case"explode":lines.push("    pixel.element='explosion';return;");break;
        case"delete_self":lines.push("    pixel.element='air';return;");break;
        case"set_temp":lines.push("    pixel.temp="+(p.val||0)+";");break;
        case"add_temp":lines.push("    pixel.temp=(pixel.temp||25)+"+(p.val||0)+";");break;
        case"set_health":lines.push("    if(!pixel.extra)pixel.extra={};pixel.extra._hp="+(p.val||100)+";");break;
        case"add_health":lines.push("    if(!pixel.extra)pixel.extra={};if(!pixel.extra._hp)pixel.extra._hp=100;pixel.extra._hp+="+(p.val||0)+";");break;
        case"set_var":if(p.name)lines.push("    if(!pixel.extra)pixel.extra={};pixel.extra."+p.name+"="+(p.val||0)+";");break;
        case"add_var":if(p.name)lines.push("    if(!pixel.extra)pixel.extra={};if(!pixel.extra."+p.name+")pixel.extra."+p.name+"=0;pixel.extra."+p.name+"+="+(p.val||0)+";");break;
        case"counter_vce":lines.push("    if(!pixel.extra)pixel.extra={};if(!pixel.extra._cnt)pixel.extra._cnt=0;pixel.extra._cnt++;if(pixel.extra._cnt>="+(p.n||100)+"){if(typeof changePixel!='undefined')pixel.element='"+(p.elem||"ash")+"';return;}");break;
      }
      var condIds=["if_temp_gt","if_temp_lt","if_touching","if_not_touching","if_age_gt","if_random","if_on_fire","if_health_lt","repeat_n"];
      if(condIds.indexOf(line.id)>=0)lines.push("  }");
    });
    if(script.event==="on_tick")tickL=tickL.concat(lines);
    if(script.event==="on_create")createL=createL.concat(lines);
    if(script.event==="on_touch")touchL=touchL.concat(lines);
  });
  return{tick:tickL.join("\n"),onCreate:createL.join("\n"),onTouch:touchL.join("\n")};
}

function applyVCE(){
  var compiled=compileVCE();
  if(!compiled.tick&&!compiled.onCreate&&!compiled.onTouch){toast("Add some blocks first!");return;}
  function ensureNode(type,code){
    if(!code.trim())return;
    var key={setCustomTick:"customTick",setOnCreate:"onCreate",setOnTouch:"onTouch"}[type];
    var existing=Object.values(nReg).find(function(n){return n.type===type;});
    var fullCode="";
    if(type==="setCustomTick")fullCode="exports.tick = function(pixel, pixelTicks, x, y, pixels) {\n"+code+"\n  return { noop: true };\n};";
    else if(type==="setOnCreate")fullCode="exports.onCreate = function(pixel) {\n"+code+"\n};";
    else fullCode="exports.onTouch = function(pixel, neighbor) {\n"+code+"\n  return { noop: true };\n};";
    if(existing){var inp=existing.el.querySelector('[data-key="'+key+'"]');if(inp)inp.value=fullCode;}
    else{var n=addNode(type,60+Math.random()*50,60+Math.random()*50);if(n){var inp2=n.el.querySelector('[data-key="'+key+'"]');if(inp2)inp2.value=fullCode;}}
  }
  if(compiled.tick)ensureNode("setCustomTick",compiled.tick);
  if(compiled.onCreate)ensureNode("setOnCreate",compiled.onCreate);
  if(compiled.onTouch)ensureNode("setOnTouch",compiled.onTouch);
  updatePreview();autoSave();
  toast("✅ Script applied to element!");
}

// VCE open/close
q("#pl-pvc").addEventListener("click",function(){
  var pv=q("#pl-pv"),vce=q("#pl-vce");
  if(pv)pv.style.display="none";if(vce)vce.classList.add("on");
  buildVCEPalette();renderVCEScript();renderVCEVars();
});
q("#pl-vceback").addEventListener("click",function(){
  var pv=q("#pl-pv"),vce=q("#pl-vce");
  if(pv)pv.style.display="";if(vce)vce.classList.remove("on");
});
q("#pl-vce-apply").addEventListener("click",applyVCE);
q("#pl-vce-clr").addEventListener("click",function(){if(!confirm("Clear all scripts and variables?"))return;vceScripts=[];vceVars=[];renderVCEScript();renderVCEVars();toast("Cleared");});

// ── MOD LOADER ────────────────────────────────────────────────
function fixModUrl(raw){
  raw=raw.trim();
  // Auto-fix GitHub blob URL → raw URL
  if(raw.includes("github.com")&&raw.includes("/blob/")){
    raw=raw.replace("github.com","raw.githubusercontent.com").replace("/blob/","/");
  }
  // Auto-fix GitHub repo URL without raw
  if(raw.includes("github.com")&&!raw.includes("raw.githubusercontent")){
    raw=raw.replace("github.com","raw.githubusercontent.com").replace("/blob/","/");
  }
  // Add .js if missing
  if(!raw.endsWith(".js")&&!raw.includes("?"))raw+=".js";
  return raw;
}

function loadMod(modName){
  if(!modName||!modName.trim()){toast("Enter a mod name or URL");return;}
  modName=modName.trim();
  var isUrl=modName.startsWith("http");
  var url=isUrl?fixModUrl(modName):("https://sandboxels.r74n.com/mods/"+modName);

  // Try Sandboxels own mod system first
  if(typeof loadMod_==="function"){
    try{loadMod_(isUrl?url:modName);toast("Loading "+modName+"…");
      setTimeout(function(){loadedMods[modName]=true;updateModUI();},1000);return;}catch{}
  }
  if(typeof addMod==="function"){
    try{addMod(isUrl?url:modName);toast("Loading "+modName+"…");
      setTimeout(function(){loadedMods[modName]=true;updateModUI();},1000);return;}catch{}
  }

  // Inject via script tag — the standard way
  function injectScript(src,onOk,onFail){
    var s=document.createElement("script");s.src=src;s.async=true;
    s.onload=onOk;s.onerror=onFail;
    document.head.appendChild(s);
  }

  injectScript(url,
    function(){loadedMods[modName]=true;updateModUI();toast("✅ Loaded: "+modName);},
    function(){
      if(!isUrl){
        // Try official Sandboxels GitHub mods folder
        injectScript("https://raw.githubusercontent.com/R74nCom/sandboxels/main/mods/"+modName,
          function(){loadedMods[modName]=true;updateModUI();toast("✅ Loaded: "+modName);},
          function(){toast("❌ Not found: "+modName+" — use a full URL for custom mods");}
        );
      } else {
        toast("❌ Failed to load. Check the URL is accessible.");
      }
    }
  );
}

function updateModUI(){
  qa(".pl-ml-load").forEach(function(btn){
    var mod=btn.dataset.mod;if(!mod)return;
    if(loadedMods[mod]){btn.textContent="✓ Loaded";btn.classList.add("loaded");}
    else{btn.textContent="Load";btn.classList.remove("loaded");}
  });
  var cc=q("#pl-ml-custom");if(!cc)return;cc.innerHTML="";
  if(!customMods.length){cc.innerHTML='<div style="font-size:10px;color:var(--dim,#454d60);padding:6px 0">Paste a mod filename or URL above to add it.</div>';return;}
  customMods.forEach(function(mod,i){
    var div=document.createElement("div");div.className="pl-ml-item";
    div.innerHTML='<div class="pl-ml-icon">📦</div><div class="pl-ml-info"><div class="pl-ml-name">'+mod+'</div><div class="pl-ml-desc">Custom mod</div></div>';
    var load=document.createElement("button");load.className="pl-ml-load"+(loadedMods[mod]?" loaded":"");
    load.textContent=loadedMods[mod]?"✓ Loaded":"Load";load.setAttribute("data-mod",mod);
    load.addEventListener("click",function(){loadMod(mod);load.textContent="⏳";load.classList.add("loading");});
    var del=document.createElement("button");del.className="pl-btn red";del.textContent="🗑";del.style.marginLeft="4px";
    del.addEventListener("click",function(){customMods.splice(i,1);localStorage.setItem("pl_custommods",JSON.stringify(customMods));updateModUI();});
    div.appendChild(load);div.appendChild(del);cc.appendChild(div);
  });
}

q("#pl-ml-add").addEventListener("click",function(){
  var val=q("#pl-ml-inp").value.trim();if(!val)return;
  if(!val.endsWith(".js")&&!val.startsWith("http"))val+=".js";
  loadMod(val);
  if(customMods.indexOf(val)<0){customMods.unshift(val);localStorage.setItem("pl_custommods",JSON.stringify(customMods));}
  q("#pl-ml-inp").value="";
  setTimeout(updateModUI,1500);
});
q("#pl-ml-inp").addEventListener("keydown",function(e){if(e.key==="Enter")q("#pl-ml-add").click();});
qa(".pl-ml-load").forEach(function(btn){
  btn.addEventListener("click",function(){
    var mod=btn.dataset.mod;if(!mod)return;
    btn.textContent="⏳";btn.classList.add("loading");
    loadMod(mod);
    setTimeout(function(){btn.classList.remove("loading");updateModUI();},2000);
  });
});

// ── LIBRARY ───────────────────────────────────────────────────
function refreshLib(){
  var list=q("#pl-liblist");if(!list)return;
  var items=Lib.all();
  if(!items.length){list.innerHTML='<div class="pl-lib-empty">No saved elements yet.<br>Build one and click 📚 Save to Library.</div>';return;}
  list.innerHTML="";
  items.forEach(function(item){
    var div=document.createElement("div");div.className="pl-lib-item";
    var color="#7b1fa2";
    try{var snap=JSON.parse(item.snap);var cn=snap.nodes&&snap.nodes.find(function(n){return n.type==="setColor";});if(cn&&cn.data&&cn.data.color)color=cn.data.color;}catch{}
    var d=new Date(item.t);var ds=d.toLocaleDateString()+" "+d.getHours()+":"+String(d.getMinutes()).padStart(2,"0");
    div.innerHTML='<div class="pl-lib-swatch" style="background:'+color+'"></div><div style="flex:1"><div class="pl-lib-name">'+item.name+'</div><div class="pl-lib-date">'+ds+'</div></div>';
    var load=document.createElement("button");load.className="pl-btn";load.textContent="Load";load.style.marginRight="3px";
    load.addEventListener("click",function(){try{pushSnap("Load library");applySnap(JSON.parse(item.snap));q("#pl-elname").value=item.name;switchTab("editor");toast("Loaded: "+item.name);}catch{toast("Load failed");}});
    var del=document.createElement("button");del.className="pl-btn red";del.textContent="🗑";
    del.addEventListener("click",function(){if(!confirm("Remove?"))return;Lib.del(item.name);refreshLib();});
    div.appendChild(load);div.appendChild(del);list.appendChild(div);
  });
}
q("#pl-savelib").addEventListener("click",function(){var el=buildEl();Lib.add(el.name,JSON.stringify(getSnap()));refreshLib();toast("📚 Saved to library: "+el.name);});

// ── AUTOSAVE ──────────────────────────────────────────────────
var svT=null;
function autoSave(){if(!S.autosave)return;clearTimeout(svT);svT=setTimeout(function(){try{localStorage.setItem(SK,JSON.stringify(getSnap()));setStat("autosaved");}catch{}},2500);}
function loadSaved(){try{var r=localStorage.getItem(SK);if(r){applySnap(JSON.parse(r));setStat("restored");}}catch{}}

// ── SETTINGS UI ───────────────────────────────────────────────
function applySettUI(){
  function sc(id,v){var e=document.getElementById(id);if(e)e.checked=v;}
  function sv(id,v){var e=document.getElementById(id);if(e)e.value=v;}
  sc("s-auto",S.autosave);sc("s-conf",S.confirmDelete);sc("s-anim",S.animatedPreview);
  sc("s-snap",S.snapGrid);sc("s-snapn",S.snapNodes);sv("s-grid",S.gridSize||20);sv("s-cat",S.defaultCategory);
  sc("s-logic",S.showLogic);sc("s-live",S.liveInject);sc("s-exp",S.experimental||false);
  ["low","med","high"].forEach(function(p){var c=document.getElementById("pc-"+p);if(c)c.classList.toggle("on",(S.perf||"low")===p);});
  qa(".pl-theme-card").forEach(function(card){card.classList.toggle("on",card.dataset.theme===S.theme);});
}
function bindSettUI(){
  function tog(id,k,cb){var e=document.getElementById(id);if(!e)return;e.addEventListener("change",function(){S[k]=e.checked;saveSett();if(cb)cb(S[k]);});}
  function num(id,k){var e=document.getElementById(id);if(!e)return;e.addEventListener("change",function(){S[k]=parseFloat(e.value)||0;saveSett();});}
  function txt(id,k){var e=document.getElementById(id);if(!e)return;e.addEventListener("input",function(){S[k]=e.value;saveSett();});}
  tog("s-auto","autosave");tog("s-conf","confirmDelete");
  tog("s-anim","animatedPreview",function(v){if(!v)cancelAnimationFrame(pvF);else updatePreview();});
  tog("s-snap","snapGrid");tog("s-snapn","snapNodes");num("s-grid","gridSize");txt("s-cat","defaultCategory");
  tog("s-logic","showLogic",function(){buildPalette(q("#pl-psearch").value||"");});
  tog("s-live","liveInject");tog("s-exp","experimental");
  qa(".pl-theme-card").forEach(function(card){card.addEventListener("click",function(){S.theme=card.dataset.theme;saveSett();applyCSS();applySettUI();qa(".pl-theme-card").forEach(function(c){c.classList.toggle("on",c.dataset.theme===S.theme);});toast("Theme: "+S.theme);});});
  var rst=q("#pl-rst");if(rst)rst.addEventListener("click",function(){if(!confirm("Reset all settings?"))return;Object.assign(S,SDEF);saveSett();applyCSS();applySettUI();buildPalette();toast("Reset!");});
  qa(".pl-stab").forEach(function(tab){tab.addEventListener("click",function(){qa(".pl-stab").forEach(function(t){t.classList.remove("on");});tab.classList.add("on");qa(".pl-sp").forEach(function(p){p.classList.remove("on");});var pg=document.getElementById("sp-"+tab.dataset.s);if(pg)pg.classList.add("on");});});
}

// ── TAB SWITCHING ─────────────────────────────────────────────
function switchTab(name){
  qa(".pl-tab").forEach(function(t){t.classList.remove("on");});
  var at=document.querySelector(".pl-tab[data-t='"+name+"']");if(at)at.classList.add("on");
  q("#pl-body").style.display=name==="editor"?"flex":"none";
  var ml=q("#pl-modloader");if(ml)ml.classList.toggle("on",name==="mods");
  var pages=["lib","hist","keys","tut","sett","log"];
  pages.forEach(function(p){var el=document.getElementById("pl-"+p+"tab");if(el)el.classList.toggle("on",name===p);});
  if(name==="lib")refreshLib();
  if(name==="hist")renderHist();
  if(name==="editor"&&S.animatedPreview)updatePreview();else cancelAnimationFrame(pvF);
}
qa(".pl-tab").forEach(function(tab){tab.addEventListener("click",function(){switchTab(tab.dataset.t);});});

// ── MAIN BUTTON WIRING ────────────────────────────────────────
q("#pl-fab").addEventListener("click",function(){
  var p=q("#pl-panel"),open=p.classList.toggle("open");
  q("#pl-fab").classList.toggle("open",open);
  if(open&&S.animatedPreview)updatePreview();else cancelAnimationFrame(pvF);
});
q("#pl-close").addEventListener("click",function(){q("#pl-panel").classList.remove("open");q("#pl-fab").classList.remove("open");cancelAnimationFrame(pvF);});
q("#pl-undo").addEventListener("click",undo);
q("#pl-redo").addEventListener("click",redo);
q("#pl-cpbtn").addEventListener("click",function(){if(selNode)copyNode(selNode.id);else toast("Select a block first");});
q("#pl-pstbtn").addEventListener("click",pasteNode);
q("#pl-psearch").addEventListener("input",function(e){buildPalette(e.target.value);});
q("#pl-elname").addEventListener("input",function(){updatePreview();autoSave();});
q("#pl-inj").addEventListener("click",function(){pushSnap("Inject");injectEl(buildEl());});
q("#pl-clr").addEventListener("click",function(){
  if(!confirm("Clear all blocks?"))return;pushSnap("Clear");
  Object.keys(nReg).forEach(function(id){try{nReg[id].el.remove();}catch{}delete nReg[id];});
  drawConns();updatePreview();autoSave();selNode=null;
  var h=q("#pl-hint");if(h)h.style.display="block";toast("Cleared");
});
q("#pl-sav").addEventListener("click",function(){
  var a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(getSnap(),null,2)],{type:"application/json"}));
  a.download=(q("#pl-elname").value||"project")+".plab";
  document.body.appendChild(a);a.click();a.remove();toast("💾 Saved!");
});
q("#pl-imp").addEventListener("click",function(){
  var inp=document.createElement("input");inp.type="file";inp.accept=".plab,.json";
  inp.onchange=function(){var f=inp.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){try{pushSnap("Import");applySnap(JSON.parse(e.target.result));toast("📂 Imported!");}catch{toast("Import failed");}};r.readAsText(f);};inp.click();
});
q("#pl-exp").addEventListener("click",function(){q("#pl-mctxt").value=generateJS(buildEl());q("#pl-mbg").classList.add("on");});
q("#pl-mcopy").addEventListener("click",function(){navigator.clipboard.writeText(q("#pl-mctxt").value);toast("Copied!");});
q("#pl-mdl").addEventListener("click",function(){var el=buildEl(),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([q("#pl-mctxt").value],{type:"text/javascript"}));a.download=el.name+".js";document.body.appendChild(a);a.click();a.remove();});
q("#pl-mclose").addEventListener("click",function(){q("#pl-mbg").classList.remove("on");});
q("#pl-mbg").addEventListener("click",function(e){if(e.target===q("#pl-mbg"))q("#pl-mbg").classList.remove("on");});

// ── KEYBOARD ──────────────────────────────────────────────────
document.addEventListener("keydown",function(e){
  if(!q("#pl-panel").classList.contains("open"))return;
  var ctrl=e.ctrlKey||e.metaKey;
  if(ctrl&&e.key==="z"&&!e.shiftKey){e.preventDefault();undo();}
  if(ctrl&&(e.key==="y"||(e.shiftKey&&e.key==="Z"))){e.preventDefault();redo();}
  if(ctrl&&e.key==="c"&&selNode){e.preventDefault();copyNode(selNode.id);}
  if(ctrl&&e.key==="v"){e.preventDefault();pasteNode();}
  if(ctrl&&e.key==="a"){e.preventDefault();qa(".pl-node").forEach(function(n){n.classList.add("sel");});toast("All selected");}
  if(ctrl&&e.key==="Enter"){e.preventDefault();pushSnap("Inject");injectEl(buildEl());}
  if(ctrl&&e.key==="s"){e.preventDefault();q("#pl-sav").click();}
  if(ctrl&&(e.key==="="||e.key==="+")){e.preventDefault();setZoom(zoom+.15);}
  if(ctrl&&e.key==="-"){e.preventDefault();setZoom(zoom-.15);}
  if(ctrl&&e.key==="0"){e.preventDefault();fitAll();}
  if(e.key==="Delete"&&selNode&&!e.target.matches("input,textarea,select")){e.preventDefault();if(S.confirmDelete&&!confirm("Delete?"))return;pushSnap("Delete");removeNode(selNode.id);}
  if(e.key==="Escape"){q("#pl-mbg").classList.remove("on");}
});

// ── INIT ──────────────────────────────────────────────────────
buildPalette();applySettUI();bindSettUI();loadSaved();
if(!Object.keys(nReg).length){
  addNode("setColor",55,45);addNode("setBehavior",55,170);addNode("setDensity",55,295);
}
updatePreview();pushSnap("Initial");updateModUI();refreshLib();renderHist();
if(typeof mods!=="undefined")mods["Pixel Lab"]={name:"Pixel Lab",author:AUTHOR,version:VER};

// ── PRE-MADE EXAMPLE ELEMENTS ────────────────────────────────
// These appear in the Special category automatically
var _prebuilt=[
  {name:"neon_sand",     props:{color:"#00ffcc",color2:"#0088aa",behavior:behaviors.POWDER,category:"special",state:"powder",density:1200,glow:0.6,glowColor:"#00ffcc",desc:"Glowing neon sand"}},
  {name:"hot_liquid",    props:{color:"#ff5e00",color2:"#ffaa00",behavior:behaviors.LIQUID,category:"special",state:"liquid",density:800,temp:90,stateHigh:"steam",tempHigh:100,desc:"Evaporates when heated"}},
  {name:"blast_gas",     props:{color:"#ffe566",behavior:behaviors.GAS,category:"special",state:"gas",density:0.3,flammable:90,desc:"Explodes near fire",
    tick:function(pixel){
      var d=[[0,-1],[0,1],[-1,0],[1,0]];
      for(var i=0;i<d.length;i++){
        var n=typeof getPixel==="function"&&getPixel(pixel.x+d[i][0],pixel.y+d[i][1]);
        if(n&&(n.element==="fire"||n.element==="plasma")){pixel.element="explosion";return;}
      }
    }
  }},
  {name:"acid_powder",   props:{color:"#aaff00",color2:"#88cc00",behavior:behaviors.POWDER,category:"special",state:"powder",density:1500,corrosive:0.8,desc:"Eats through most things"}},
  {name:"void_creep",    props:{color:"#220022",color2:"#440044",behavior:behaviors.POWDER,category:"special",state:"powder",density:2000,desc:"Slowly destroys neighbors",
    tick:function(pixel){
      if(Math.random()<0.05){
        var d=[[0,-1],[0,1],[-1,0],[1,0]];
        var pick=d[Math.floor(Math.random()*4)];
        var n=typeof getPixel==="function"&&getPixel(pixel.x+pick[0],pixel.y+pick[1]);
        if(n&&n.element!=="void_creep"&&n.element!=="wall")pixel.element="void_creep";
      }
    }
  }},
  {name:"ice_crystal",   props:{color:"#aaddff",color2:"#ffffff",behavior:behaviors.POWDER,category:"special",state:"solid",density:900,temp:-10,stateHigh:"water",tempHigh:5,desc:"Melts into water when warm"}},
  {name:"rainbow_gas",   props:{color:"#ff0055",color2:"#ffaa00",color3:"#00ffcc",behavior:behaviors.GAS,category:"special",state:"gas",density:0.2,glow:0.4,glowColor:"#ff88ff",desc:"Pretty, does nothing",lifetime:300}},
  {name:"magma_powder",  props:{color:"#ff3300",color2:"#ff8800",behavior:behaviors.POWDER,category:"special",state:"powder",density:2200,temp:800,selfHeat:0.5,flammable:0,desc:"Extremely hot falling powder",
    tick:function(pixel){pixel.temp=(pixel.temp||800)+0.5;}
  }},
];

_prebuilt.forEach(function(el){
  try{
    if(typeof addElement==="function") addElement(el.name,el.props);
    else elements[el.name]=el.props;
  }catch(e){ try{elements[el.name]=el.props;}catch{} }
});
try{
  if(typeof rebuildMenu==="function") rebuildMenu();
  else if(typeof updateElementButtons==="function") updateElementButtons();
}catch(e){}
console.log("[PL] "+_prebuilt.length+" pre-made elements added to Special category");

// ── FIRST-TIME TUTORIAL ──────────────────────────────────────
var _firstTime = !localStorage.getItem("pl_seen");
if(_firstTime){
  localStorage.setItem("pl_seen","1");
  // Show tutorial overlay after a short delay
  setTimeout(function(){
    var t=T();
    var overlay=document.createElement("div");
    overlay.id="pl-tut-overlay";
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;";
    var steps=[
      {icon:"🧪",title:"Welcome to Pixel Lab!",desc:"A visual element builder for Sandboxels. Made by Omelette."},
      {icon:"👈",title:"Click a block to add it",desc:"Pick blocks from the left panel — like Set Color, Set Behavior, etc. They appear on the canvas."},
      {icon:"●",title:"Connect blocks",desc:"Drag the bottom ● dot to the top ● dot of another block to connect them visually."},
      {icon:'➕',title:'Add to Sandboxels',desc:'Click the Add to Sandboxels button to inject your element live into the game. Find it in the sidebar!'},
      {icon:"🎁",title:"Try the demo element!",desc:"We added a demo element called pl_demo to the Special category. Click it in the sidebar and place it down!"},
    ];
    var cur=0;
    function render(){
      var s=steps[cur];
      overlay.innerHTML='<div style="background:'+t.surf+';border:1px solid '+t.border+';border-radius:14px;padding:36px 40px;max-width:400px;text-align:center;">'+
        '<div style="font-size:52px;margin-bottom:12px">'+s.icon+'</div>'+
        '<div style="font-size:20px;font-weight:900;color:'+t.acc+';margin-bottom:10px">'+s.title+'</div>'+
        '<div style="font-size:13px;color:'+t.text+';opacity:.8;line-height:1.7;margin-bottom:24px">'+s.desc+'</div>'+
        '<div style="display:flex;gap:10px;justify-content:center;align-items:center;">'+
          (cur>0?'<button id="pl-tut-back" style="background:'+t.panel+';border:1px solid '+t.border+';color:'+t.text+';font-size:12px;font-weight:700;padding:9px 20px;border-radius:6px;cursor:pointer;">← Back</button>':'')+
          '<button id="pl-tut-next" style="background:'+t.acc+';border:none;color:#000;font-size:13px;font-weight:800;padding:10px 28px;border-radius:6px;cursor:pointer;">'+(cur===steps.length-1?"Let's go! 🚀":"Next →")+'</button>'+
        '</div>'+
        '<div style="margin-top:14px;font-size:10px;color:'+t.dim+'">'+(cur+1)+' / '+steps.length+'</div>'+
      '</div>';
      document.body.appendChild(overlay);
      var nb=document.getElementById("pl-tut-next");
      if(nb)nb.addEventListener("click",function(){
        cur++;
        if(cur>=steps.length){overlay.remove();}
        else render();
      });
      var bb=document.getElementById("pl-tut-back");
      if(bb)bb.addEventListener("click",function(){cur--;render();});
    }
    render();
  }, 1200);
}

// ── DEMO ELEMENT ─────────────────────────────────────────────
// Always inject a fun demo element so there's something to test
setTimeout(function(){
  try{
    var demoProps={
      color:"#00ffcc",color2:"#0088aa",color3:"#ff00ff",
      behavior:typeof behaviors!=="undefined"?behaviors.POWDER:null,
      category:"special",state:"powder",density:1100,
      glow:0.5,glowColor:"#00ffcc",
      desc:"Pixel Lab demo element — place me!",
      tick:function(pixel){
        // slowly changes colour based on temperature
        if((pixel.temp||25)>60){pixel.element="steam";}
        if(Math.random()<0.02){pixel.temp=(pixel.temp||25)+1;}
      }
    };
    if(!demoProps.behavior)return;
    if(typeof addElement==="function") addElement("pl_demo",demoProps);
    else if(typeof elements!=="undefined") elements["pl_demo"]=demoProps;
    try{if(typeof rebuildMenu==="function")rebuildMenu();}catch{}
    console.log("[PL] Demo element added — find 'pl_demo' in Special category");
  }catch(e){console.log("[PL] Demo element failed:",e);}
}, 500);

toast("Pixel Lab v"+VER+" — Click 🧪 bottom-right!",3000);
console.log("[PixelLab] v"+VER+" by "+AUTHOR+" — ready!");

}); // end waitForSandboxels()
})(); // end IIFE
