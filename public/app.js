/* =========================
   UNIFIED CLIPS — app.js
   Shared across all pages.
   Auth now loads from /auth/me (real session, not a stub).
========================= */

const civColors = {
  "Oracles":       "linear-gradient(135deg,#4169ff,#a25cff)",
  "Crabby's Civ":  "linear-gradient(135deg,#ff3b4e,#ffb13b)",
  "Liquid's Civ":  "linear-gradient(135deg,#4169ff,#3bdfff)",
  "Prite's Events":"linear-gradient(135deg,#ff3b4e,#a25cff)",
  "JCrimzy's Civ": "linear-gradient(135deg,#3bdfff,#4169ff)",
  "PrestonMC":     "linear-gradient(135deg,#ffb13b,#ff3b4e)",
  "Archie's Civ":  "linear-gradient(135deg,#a25cff,#ff3b4e)"
};

function thumbGradient(seed){
  const grads=[
    "linear-gradient(160deg,rgba(65,105,255,0.55),rgba(255,59,78,0.45))",
    "linear-gradient(160deg,rgba(162,92,255,0.5),rgba(65,105,255,0.4))",
    "linear-gradient(160deg,rgba(255,59,78,0.55),rgba(255,177,59,0.4))",
    "linear-gradient(160deg,rgba(59,223,255,0.5),rgba(65,105,255,0.45))",
    "linear-gradient(160deg,rgba(255,177,59,0.45),rgba(255,59,78,0.45))"
  ];
  return grads[seed%grads.length];
}

const spotlightData=[
  {name:"Oracles",desc:"Home of Vespera vs The Eye — the rivalry every Civ Union member is watching.",meta:"Season 2 · 200 active",color:civColors["Oracles"]},
  {name:"Crabby's Civ",desc:"The Union's oldest civilization server, four seasons deep and still growing.",meta:"Season 4 · 310 active",color:civColors["Crabby's Civ"]},
  {name:"Liquid's Civ",desc:"The biggest server in the Union, known for sharp PvPers and tight events.",meta:"Season 3 · 410 active",color:civColors["Liquid's Civ"]},
  {name:"PrestonMC",desc:"100-player civilization events with island strandings and building showdowns.",meta:"Event 3 · 100 active",color:civColors["PrestonMC"]}
];

const civData=[
  {name:"Oracles",desc:"Home of Vespera vs The Eye — the rivalry every Civ Union member is watching.",season:"Season 2",members:200,clips:1,status:"active"},
  {name:"Crabby's Civ",desc:"The Union's oldest civilization server, four seasons deep and still growing.",season:"Season 4",members:310,clips:1,status:"active"},
  {name:"Liquid's Civ",desc:"The biggest server in the Union, known for sharp PvPers and tight events.",season:"Season 3",members:410,clips:2,status:"active"},
  {name:"Prite's Events",desc:"Tight-knit roleplay-driven events with a focus on diplomacy arcs over raw PvP.",season:"Season 1",members:140,clips:0,status:"recruiting"},
  {name:"JCrimzy's Civ",desc:"Fast, chaotic servers — known for the ant invasions that took over a full season.",season:"Season 2",members:185,clips:1,status:"active"},
  {name:"PrestonMC",desc:"100-player civilization events with island strandings and building showdowns.",season:"Event 3",members:100,clips:2,status:"recruiting"},
  {name:"Archie's Civ",desc:"Election-driven civ with a history of votes that spiral into open conflict.",season:"Season 5",members:265,clips:2,status:"concluded"}
];

const feedData=[
  {title:"Salem survives a last-second assassination attempt",civ:"PrestonMC",time:"4m ago",duration:"0:31"},
  {title:"Waddle's save goes viral within the hour",civ:"PrestonMC",time:"12m ago",duration:"0:19"},
  {title:"Spawner-hoarding squad seals the win",civ:"Liquid's Civ",time:"26m ago",duration:"1:48"},
  {title:"Vespera's scouts spotted moving on The Eye's border",civ:"Oracles",time:"41m ago",duration:"0:53"},
  {title:"Sacred and ally hunted down as fugitives",civ:"PrestonMC",time:"1h ago",duration:"2:02"},
  {title:"Crabby's Civ opens season 4 with a surprise raid",civ:"Crabby's Civ",time:"2h ago",duration:"1:11"},
  {title:"JCrimzy's ants breach the eastern gate",civ:"JCrimzy's Civ",time:"3h ago",duration:"0:47"},
  {title:"Archie's Civ election results spark instant unrest",civ:"Archie's Civ",time:"5h ago",duration:"1:29"}
];

const eyeIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const heartIcon=`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C0.3 8.4 2 5 5.4 5c2 0 3.4 1.1 4.1 2.2C10.2 6.1 11.6 5 13.6 5 17 5 18.7 8.4 17 11.7 14.5 16.4 12 21 12 21Z"/></svg>`;

/* =========================
   AUTH — loads from /auth/me
========================= */
let currentUser = null;

async function loadAuthState(){
  try{
    const res = await fetch("/auth/me");
    const data = await res.json();
    currentUser = data.user || null;
  }catch{
    currentUser = null;
  }
  renderAuth();
  handleAuthQueryParam();
}

function renderAuth(){
  const isLoggedIn = !!currentUser;
  const authChip = document.getElementById("authChip");

  if(authChip){
    const avatarEl   = authChip.querySelector(".avatar");
    const usernameEl = authChip.querySelector(".username");
    if(isLoggedIn && currentUser.avatar){
      if(avatarEl) avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
      if(avatarEl) avatarEl.textContent = isLoggedIn ? currentUser.username.slice(0,2).toUpperCase() : "GU";
    }
    if(usernameEl) usernameEl.textContent = isLoggedIn ? currentUser.username : "guest_user";
    authChip.style.display = isLoggedIn ? "flex" : "none";
  }

  document.querySelectorAll("[data-auth-btn]").forEach(btn=>{
    btn.textContent = isLoggedIn ? "Log out" : "Login with Discord";
  });

  document.body.classList.toggle("is-authed", isLoggedIn);
}

function handleAuthClick(e){
  if(currentUser){
    // Logged in → log out
    fetch("/auth/logout",{method:"POST"}).then(()=>{
      currentUser = null;
      renderAuth();
    });
  } else {
    // Not logged in → kick off Discord OAuth
    window.location.href = "/auth/discord";
  }
}

// Show a toast if Discord redirected back with ?auth=...
function handleAuthQueryParam(){
  const params = new URLSearchParams(window.location.search);
  const auth = params.get("auth");
  if(!auth) return;

  // Clean the URL without reloading
  const clean = window.location.pathname;
  window.history.replaceState({}, "", clean);

  const messages = {
    success:        "Logged in successfully.",
    cancelled:      "Login cancelled.",
    not_in_server:  "You need to be in the Unified Events Discord server to log in.",
    error:          "Something went wrong. Try again.",
  };
  if(messages[auth]) showToast(messages[auth]);
}

/* =========================
   TOAST (shared)
========================= */
let _toastTimer;
function showToast(msg){
  let toast = document.getElementById("globalToast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    toast.innerHTML = `<span class="toast-dot"></span><span id="globalToastMsg"></span>`;
    document.body.appendChild(toast);
  }
  document.getElementById("globalToastMsg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(()=>toast.classList.remove("show"), 3500);
}

/* =========================
   CLIPS — live from /api/clips
========================= */
let allClips=[];
let clipsLoadFailed=false;

function escapeHtml(str){
  const d=document.createElement("div");
  d.textContent=str==null?"":String(str);
  return d.innerHTML;
}

function formatCount(n){
  if(n==null)return"0";
  if(n>=1000000)return(n/1000000).toFixed(1).replace(/\.0$/,"")+"M";
  if(n>=1000)return(n/1000).toFixed(1).replace(/\.0$/,"")+"K";
  return String(n);
}

function timeAgo(dateStr){
  if(!dateStr)return"";
  const then=new Date(dateStr).getTime();
  if(Number.isNaN(then))return"";
  const diffMs=Date.now()-then;
  const mins=Math.floor(diffMs/60000);
  if(mins<1)return"just now";
  if(mins<60)return`${mins}m ago`;
  const hrs=Math.floor(mins/60);
  if(hrs<24)return`${hrs}h ago`;
  return`${Math.floor(hrs/24)}d ago`;
}

function clipCardHTML(c,i){
  const avatar=c.uploaderAvatar
    ?`<img src="${escapeHtml(c.uploaderAvatar)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
    :"";
  return`
    <article class="clip-card reveal in">
      <div class="clip-thumb" style="background-image:${c.thumbnailUrl?`url('${escapeHtml(c.thumbnailUrl)}')`:thumbGradient(i)}">
        <span class="clip-tag">${escapeHtml(c.category||"")}</span>
        <button class="clip-play" aria-label="Play ${escapeHtml(c.title)}" data-video="${escapeHtml(c.videoUrl||"")}">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 3 L21 12 L5 21 Z" fill="currentColor"/></svg>
        </button>
        ${c.duration?`<span class="clip-duration">${escapeHtml(c.duration)}</span>`:""}
      </div>
      <div class="clip-info">
        <h3 class="clip-title">${escapeHtml(c.title)}</h3>
        <span class="clip-civ">${escapeHtml(c.civilization)}</span>
        <div class="clip-foot">
          <div class="clip-uploader"><span class="av">${avatar}</span>${escapeHtml(c.uploaderUsername)}</div>
          <div class="clip-stats">
            <span>${eyeIcon}${formatCount(c.views)}</span>
            <span>${heartIcon}${formatCount(c.likes)}</span>
          </div>
        </div>
      </div>
    </article>`;
}

function clipGridLoadingHTML(){
  return`<div class="clip-grid-state" style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:0.8rem;padding:3.5rem 1rem;color:var(--mist);">
    <div style="width:28px;height:28px;border-radius:50%;border:2.5px solid var(--line);border-top-color:var(--blue);animation:clip-spin 0.8s linear infinite;"></div>
    <span style="font-family:var(--font-mono);font-size:0.78rem;letter-spacing:0.04em;text-transform:uppercase;">Loading clips…</span>
  </div>
  <style>@keyframes clip-spin{to{transform:rotate(360deg);}}</style>`;
}

function clipGridEmptyHTML(filter){
  const lbl=filter&&filter!=="all"?` in "${escapeHtml(filter)}"` :"";
  return`<div class="clip-grid-state" style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:0.6rem;padding:3.5rem 1rem;text-align:center;">
    <div style="width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--void-soft);display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--mist)" stroke-width="1.6"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/></svg>
    </div>
    <h3 style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;">No clips yet${lbl}</h3>
    <p style="color:var(--mist);font-size:0.88rem;max-width:320px;">Be the first to upload one from this category once it's reviewed.</p>
  </div>`;
}

function clipGridErrorHTML(){
  return`<div class="clip-grid-state" style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:0.6rem;padding:3.5rem 1rem;text-align:center;">
    <h3 style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;">Couldn't load clips</h3>
    <p style="color:var(--mist);font-size:0.88rem;max-width:340px;">Something went wrong reaching the server. Try refreshing.</p>
  </div>`;
}

async function fetchClips(){
  const grid=document.getElementById("clipGrid");
  if(!grid)return;
  grid.innerHTML=clipGridLoadingHTML();
  try{
    const res=await fetch("/api/clips");
    if(!res.ok)throw new Error(`${res.status}`);
    const data=await res.json();
    if(!data.success)throw new Error(data.message||"Unknown error");
    allClips=data.clips||[];
    clipsLoadFailed=false;
  }catch(err){
    console.error("Failed to load clips:",err);
    allClips=[];
    clipsLoadFailed=true;
  }
  renderClips(getActiveFilter());
}

function getActiveFilter(){
  const t=document.querySelector("#trending .tab.active");
  return t?t.dataset.filter:"all";
}

function renderClips(filter="all"){
  const grid=document.getElementById("clipGrid");
  if(!grid)return;
  if(clipsLoadFailed){grid.innerHTML=clipGridErrorHTML();return;}
  const items=allClips.filter(c=>filter==="all"||c.category===filter);
  if(items.length===0){grid.innerHTML=clipGridEmptyHTML(filter);return;}
  grid.innerHTML=items.map((c,i)=>clipCardHTML(c,i)).join("");
}

/* =========================
   RENDER: SPOTLIGHT
========================= */
function renderSpotlight(){
  const grid=document.getElementById("spotlightGrid");
  if(!grid)return;
  grid.innerHTML=spotlightData.map(s=>`
    <div class="spotlight-card reveal in">
      <div class="spotlight-logo" style="background:${s.color}">${s.name.slice(0,2).toUpperCase()}</div>
      <h3 class="spotlight-name">${s.name}</h3>
      <p class="spotlight-desc">${s.desc}</p>
      <span class="spotlight-meta">${s.meta}</span>
      <a href="civilizations.html" class="btn btn-ghost btn-small">View Clips ↗</a>
    </div>`).join("");
}

/* =========================
   CIVILIZATIONS DIRECTORY
========================= */
const statusLabel={active:"Active Season",recruiting:"Recruiting",concluded:"Concluded"};
const directoryState={query:"",status:"all"};

function getFilteredCivs(){
  const q=directoryState.query.trim().toLowerCase();
  return civData.filter(c=>{
    const matchesStatus=directoryState.status==="all"||c.status===directoryState.status;
    const matchesQuery=!q||c.name.toLowerCase().includes(q);
    return matchesStatus&&matchesQuery;
  });
}

function renderDirectory(){
  const grid=document.getElementById("civDirectoryGrid");
  if(!grid)return;
  const countEl=document.getElementById("directoryCount");
  const emptyEl=document.getElementById("directoryEmpty");
  const items=getFilteredCivs();
  if(countEl) countEl.textContent=`${items.length} ${items.length===1?"civilization":"civilizations"}`;
  if(emptyEl) emptyEl.hidden=items.length!==0;
  grid.hidden=items.length===0;
  grid.innerHTML=items.map(c=>`
    <article class="directory-card reveal in">
      <div class="directory-card-top">
        <div class="directory-logo" style="background:${civColors[c.name]||"linear-gradient(135deg,var(--blue),var(--red))"}">${c.name.slice(0,2).toUpperCase()}</div>
        <span class="status-badge status-${c.status}"><span class="status-dot"></span>${statusLabel[c.status]}</span>
      </div>
      <h3 class="directory-name">${c.name}</h3>
      <p class="directory-desc">${c.desc}</p>
      <div class="directory-stats">
        <span><strong>${c.members}</strong> members</span>
        <span><strong>${c.season}</strong></span>
        <span><strong>${c.clips}</strong> ${c.clips===1?"clip":"clips"}</span>
      </div>
      <a href="index.html" class="btn btn-ghost btn-small">View Clips ↗</a>
    </article>`).join("");
}

function setupDirectoryControls(){
  const searchInput=document.getElementById("civSearch");
  const statusTabs=document.querySelectorAll(".civ-directory .tab");
  if(!searchInput&&statusTabs.length===0)return;
  searchInput?.addEventListener("input",(e)=>{directoryState.query=e.target.value;renderDirectory();});
  statusTabs.forEach(tab=>{
    tab.addEventListener("click",()=>{
      statusTabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      directoryState.status=tab.dataset.status;
      renderDirectory();
    });
  });
}

/* =========================
   RENDER: RECENT FEED
========================= */
function renderFeed(){
  const list=document.getElementById("feedList");
  if(!list)return;
  list.innerHTML=feedData.map((f,i)=>`
    <li class="feed-item">
      <div class="feed-thumb" style="background-image:${thumbGradient(i+2)}">
        <span class="clip-duration">${f.duration}</span>
      </div>
      <div class="feed-body">
        <div class="feed-title">${f.title}</div>
        <div class="feed-sub">${f.civ}</div>
      </div>
      <span class="feed-time">${f.time}</span>
    </li>`).join("");
}

/* =========================
   FILTER TABS
========================= */
function setupFilters(){
  const tabs=document.querySelectorAll("#trending .tab");
  tabs.forEach(tab=>{
    tab.addEventListener("click",()=>{
      tabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      renderClips(tab.dataset.filter);
    });
  });
}

/* =========================
   LOAD MORE
========================= */
function setupLoadMore(){
  const btn=document.getElementById("loadMoreBtn");
  if(!btn)return;
  btn.addEventListener("click",()=>{
    btn.textContent="You're all caught up";
    btn.disabled=true;
    btn.style.opacity="0.5";
  });
}

/* =========================
   NAV / MOBILE
========================= */
function setupNav(){
  const burgerBtn=document.getElementById("burgerBtn");
  const mobilePanel=document.getElementById("mobilePanel");
  burgerBtn?.addEventListener("click",()=>{
    const open=mobilePanel.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded",open);
  });
  document.querySelectorAll("#mobilePanel a, #mobilePanel button").forEach(el=>{
    el.addEventListener("click",()=>{
      mobilePanel.classList.remove("open");
      burgerBtn?.setAttribute("aria-expanded","false");
    });
  });
}

/* =========================
   SCROLL REVEAL
========================= */
function setupReveal(){
  const targets=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){targets.forEach(el=>el.classList.add("in"));return;}
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("in");observer.unobserve(entry.target);}
    });
  },{threshold:0.12});
  targets.forEach(el=>observer.observe(el));
}

/* =========================
   INIT
========================= */
async function init(){
  setupNav();
  await loadAuthState(); // fetch /auth/me first so auth chip is correct immediately
  fetchClips();
  renderSpotlight();
  renderFeed();
  setupFilters();
  setupLoadMore();
  renderDirectory();
  setupDirectoryControls();
  setupReveal();

  document.querySelectorAll("[data-auth-btn]").forEach(btn=>{
    btn.addEventListener("click", handleAuthClick);
  });
}

init();