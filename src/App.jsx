import React, { useState, useEffect } from "react";
import {
  NAV_ITEMS, LEADERSHIP, MINISTRIES, EVENTS,
  SONGS, ROLES, ROLE_ACCESS, ACCOUNTS
} from "./data";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = {error:null}; }
  static getDerivedStateFromError(e) { return {error:e}; }
  render() {
    if(this.state.error) return (
      <div style={{padding:40,background:"#0A0A0F",minHeight:"100vh",color:"#E07B7B",fontFamily:"monospace"}}>
        <h2 style={{color:"#E8CC7A",marginBottom:16}}>⚠️ App Error</h2>
        <pre style={{whiteSpace:"pre-wrap",fontSize:".85rem",color:"#F0EAD6"}}>{this.state.error?.toString()}</pre>
        <pre style={{whiteSpace:"pre-wrap",fontSize:".75rem",color:"#9A9080",marginTop:16}}>{this.state.error?.stack}</pre>
        <button onClick={()=>this.setState({error:null})} style={{marginTop:24,padding:"10px 20px",background:"#C9A84C",border:"none",color:"#000",cursor:"pointer"}}>Try Again</button>
      </div>
    );
    return this.props.children;
  }
}


// ── SUPABASE CLIENT ────────────────────────────────────────────────────────────
const SUPA_URL = "https://fnzhxzvehungwmoxloqk.supabase.co";
const SUPA_KEY = "sb_publishable_6aslXdtBqurjvDOu3D6dYw_ut8QECjR";

const supaFetch = async (table, method="GET", body=null, query="") => {
  const url = `${SUPA_URL}/rest/v1/${table}${query}`;
  const headers = {
    "apikey": SUPA_KEY,
    "Authorization": `Bearer ${SUPA_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method==="POST" ? "return=representation" : "",
  };
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
  if (!res.ok) { console.error("Supabase error:", await res.text()); return null; }
  if (method==="DELETE") return true;
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const dbGet    = (table, query="?order=created_at.desc") => supaFetch(table,"GET",null,query);
const dbInsert = (table, row)  => supaFetch(table,"POST",row);
const dbDelete = (table, id)   => supaFetch(table,"DELETE",null,`?id=eq.${id}`);
const dbUpdate = (table, id, row) => supaFetch(table,"PATCH",row,`?id=eq.${id}`);

// Helper: log activity to Supabase
const addLog = (icon, msg, role, user) => {
  dbInsert("activity_log", { icon, msg, role, username: user||role });
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=Tenor+Sans&display=swap');
  :root {
    --gold:#C9A84C; --gold-light:#E8CC7A; --gold-dim:#8A6A2A;
    --deep:#0A0A0F; --surface2:#1A1A28; --surface3:#22223A;
    --text:#F0EAD6; --text-dim:#9A9080;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--deep);color:var(--text);font-family:'Crimson Pro',serif;overflow-x:hidden;}
  .font-display{font-family:'Cinzel Decorative',cursive;}
  .font-sans{font-family:'Tenor Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:var(--deep);}
  ::-webkit-scrollbar-thumb{background:var(--gold-dim);border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,.3);}50%{box-shadow:0 0 40px rgba(201,168,76,.6);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes cross-in{from{opacity:0;transform:scale(.5) rotate(-10deg);}to{opacity:1;transform:scale(1) rotate(0deg);}}
  @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}
  .aFadeUp{animation:fadeUp .8s ease forwards;}
  .aFloat{animation:float 3s ease-in-out infinite;}
  .aPulse{animation:pulse-glow 2s ease-in-out infinite;}
  .aCross{animation:cross-in 1s ease forwards;}
  .aShake{animation:shake .4s ease;}
  .goldText{
    background:linear-gradient(90deg,var(--gold-dim),var(--gold-light),var(--gold),var(--gold-light),var(--gold-dim));
    background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:shimmer 3s linear infinite;
  }
  .ornament{display:flex;align-items:center;gap:12px;}
  .ornament::before,.ornament::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
  .card{transition:transform .3s ease,box-shadow .3s ease;}
  .card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(201,168,76,.15);}
  .navLink{position:relative;transition:color .2s;cursor:pointer;}
  .navLink::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--gold);transition:width .3s;}
  .navLink:hover::after,.navLink.active::after{width:100%;}
  .navLink:hover,.navLink.active{color:var(--gold-light);}
  section{padding:80px 24px;max-width:1200px;margin:0 auto;}
  .btnGold{background:linear-gradient(135deg,var(--gold-dim),var(--gold),var(--gold-light));color:var(--deep);font-family:'Tenor Sans',sans-serif;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;padding:14px 32px;border:none;cursor:pointer;transition:all .3s;}
  .btnGold:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,.4);}
  .btnOut{background:transparent;border:1px solid var(--gold);color:var(--gold);font-family:'Tenor Sans',sans-serif;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;padding:12px 28px;cursor:pointer;transition:all .3s;}
  .btnOut:hover{background:var(--gold);color:var(--deep);}
  .btnRed{background:transparent;border:1px solid #E07B7B;color:#E07B7B;font-family:'Tenor Sans',sans-serif;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;padding:10px 24px;cursor:pointer;transition:all .3s;}
  .btnRed:hover{background:#E07B7B;color:var(--deep);}
  input,textarea,select{background:var(--surface2);border:1px solid var(--surface3);color:var(--text);padding:12px 16px;width:100%;font-family:'Crimson Pro',serif;font-size:1rem;outline:none;transition:border-color .3s;}
  input:focus,textarea:focus,select:focus{border-color:var(--gold);}
  input::placeholder,textarea::placeholder{color:var(--text-dim);}
  label{font-family:'Tenor Sans',sans-serif;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:6px;display:block;}
  .heroBg{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 20% 50%,rgba(74,111,191,.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(123,79,207,.1) 0%,transparent 50%),radial-gradient(ellipse at 50% 100%,rgba(201,168,76,.1) 0%,transparent 50%),#0A0A0F;
    overflow:hidden;padding:0 24px;text-align:center;}
  .geoPattern{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(201,168,76,.03) 60px,rgba(201,168,76,.03) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(201,168,76,.03) 60px,rgba(201,168,76,.03) 61px);}
  .g3{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
  .g2{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px;}
  .badge{display:inline-block;padding:3px 10px;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;font-family:'Tenor Sans',sans-serif;border:1px solid var(--gold-dim);color:var(--gold);}
  .ev-worship{border-left-color:var(--gold)!important;}
  .ev-prayer{border-left-color:#7B9EF0!important;}
  .ev-youth{border-left-color:#9B7BE0!important;}
  .ev-event{border-left-color:#E07B7B!important;}
  .ev-devotion{border-left-color:#7BE0B0!important;}
  @media(max-width:768px){
    .dNav{display:none!important;}
    section{padding:60px 16px;}
    .heroTitle{font-size:1.8rem!important;}
  }
  @media(min-width:769px){.mBtn{display:none!important;}}
`;

const TL = () => (
  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
);
const Cross = ({size=200,op=0.03,top,left,right,bottom}) => (
  <div style={{position:"absolute",userSelect:"none",pointerEvents:"none",opacity:op,fontSize:size,top,left,right,bottom,color:"#C9A84C",lineHeight:1}}>✞</div>
);
const Hdr = ({eye,title,sub}) => (
  <div style={{textAlign:"center",marginBottom:60}}>
    {eye && <div className="ornament" style={{justifyContent:"center",marginBottom:20}}>
      <span className="font-sans" style={{fontSize:".75rem",letterSpacing:".2em",textTransform:"uppercase",color:"#C9A84C"}}>{eye}</span>
    </div>}
    <h2 className="font-display goldText" style={{fontSize:"clamp(1.5rem,4vw,2.5rem)",marginBottom:16}}>{title}</h2>
    {sub && <p style={{color:"#9A9080",maxWidth:500,margin:"0 auto",lineHeight:1.8,fontSize:"1.1rem"}}>{sub}</p>}
  </div>
);

function Home({go}) {
  const [homeEvents, setHomeEvents] = useState([]);
  useEffect(()=>{dbGet("announcements","?author=eq.__upcoming__&order=created_at.asc").then(d=>{if(d)setHomeEvents(d);});},[]);
  return (
    <div>
      <div className="heroBg">
        <div className="geoPattern"/>
        <Cross size={500} op={0.025} top="-50px" left="-100px"/>
        <Cross size={300} op={0.02} bottom="0" right="0"/>
        <div style={{position:"relative",zIndex:2,animation:"fadeUp 1s ease forwards"}}>
          <div className="aCross" style={{width:100,height:100,margin:"0 auto 32px",background:"radial-gradient(circle,rgba(201,168,76,.2),transparent)",border:"2px solid rgba(201,168,76,.4)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>✞</div>
          <div className="ornament" style={{justifyContent:"center",marginBottom:16}}>
            <span className="font-sans" style={{fontSize:".7rem",letterSpacing:".25em",textTransform:"uppercase",color:"#C9A84C"}}>Est. by Faith</span>
          </div>
          <h1 className="font-display heroTitle goldText" style={{fontSize:"clamp(1.6rem,5vw,3.2rem)",lineHeight:1.3,marginBottom:12,maxWidth:700}}>
            Jesus The Rock<br/>of Our Salvation<br/>Mission Church
          </h1>
          <p style={{fontStyle:"italic",color:"#9A9080",fontSize:"1.2rem",marginBottom:8}}>"He only is my rock and my salvation"</p>
          <p className="font-sans" style={{fontSize:".8rem",letterSpacing:".15em",color:"#8A6A2A",marginBottom:40}}>PSALM 62:6</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btnGold aPulse" onClick={()=>go("Events")}>Join Us This Sunday</button>
            <a href="https://www.facebook.com/profile.php?id=61568763184691" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><button className="btnOut">📺 Watch Live</button></a>
          </div>
        </div>
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)"}} className="aFloat">
          <div style={{width:1,height:48,background:"linear-gradient(to bottom,var(--gold),transparent)",margin:"0 auto"}}/>
        </div>
      </div>
      <section>
        <Hdr eye="Come Worship With Us" title="Service Schedule"/>
        <div className="g3">
          {[{d:"Sunday",t:"9:00 AM",n:"Morning Worship Service",i:"☀️"},{d:"Wednesday",t:"7:00 PM",n:"Midweek Prayer Meeting",i:"🙏"},{d:"Monthly",t:"3:00 PM",n:"Devotion Sharing & Fellowship",i:"📖"}].map(s=>(
            <div key={s.d} className="card" style={{background:"#12121A",border:"1px solid #22223A",padding:32,position:"relative",overflow:"hidden"}}>
              <TL/><div style={{fontSize:32,marginBottom:16}}>{s.i}</div>
              <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".15em",color:"#C9A84C",marginBottom:8}}>{s.d.toUpperCase()}</div>
              <h3 className="font-display" style={{fontSize:"1rem",marginBottom:8}}>{s.n}</h3>
              <div style={{color:"#9A9080",fontSize:"1.1rem"}}>{s.t}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{background:"#0E0E18",padding:"80px 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <Hdr eye="What's Coming" title="Upcoming Events"/>
          {homeEvents.length===0
            ? <div style={{color:"#9A9080",textAlign:"center",padding:32}}>No upcoming events yet. Check back soon!</div>
            : <div className="g2">
              {homeEvents.map((e,i)=>{
                const typeColor = t=>t==="worship"?"#C9A84C":t==="prayer"?"#B07BE0":t==="youth"?"#7BE0B0":t==="event"?"#7B9EF0":t==="devotion"?"#E0B07B":"#9A9080";
                const typeIcon  = t=>t==="worship"?"✝️":t==="prayer"?"🙏":t==="youth"?"🌟":t==="event"?"🎉":t==="devotion"?"📖":"📅";
                let _p={};try{_p=JSON.parse(e.body||"{}");}catch{}
                const evType = _p.event_type||"event";
                const evDate = _p.date||"";
                const evTime = _p.time||"";
                const c = typeColor(evType);
                const parts = evDate.split(" ");
                return (
                  <div key={e.id||i} style={{background:"#12121A",borderLeft:`3px solid ${c}`,padding:"20px 24px",display:"flex",gap:20,alignItems:"center",transition:"all .2s",cursor:"default"}}
                    onMouseEnter={ev=>{ev.currentTarget.style.background="#1A1A28";ev.currentTarget.style.transform="translateY(-3px)";ev.currentTarget.style.boxShadow=`0 12px 32px ${c}25`;}}
                    onMouseLeave={ev=>{ev.currentTarget.style.background="#12121A";ev.currentTarget.style.transform="translateY(0)";ev.currentTarget.style.boxShadow="none";}}>
                    <div style={{textAlign:"center",minWidth:60}}>
                      <div className="font-sans" style={{fontSize:".7rem",color:c,letterSpacing:".1em"}}>{(parts[0]||"").toUpperCase()}</div>
                      <div className="font-display" style={{fontSize:"1.8rem",color:"#F0EAD6"}}>{parts[1]||""}</div>
                    </div>
                    <div style={{fontSize:"1.2rem"}}>{typeIcon(evType)}</div>
                    <div>
                      <div style={{fontWeight:600,marginBottom:4}}>{e.title}</div>
                      <div style={{color:"#9A9080",fontSize:".9rem"}}>{evTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
      <section>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <Hdr eye="A Word From Our Head" title="Welcome to JRSMC"/>
          <p style={{fontSize:"1.2rem",lineHeight:2,color:"#B0A898",fontStyle:"italic",marginBottom:32}}>
            "Welcome to Jesus The Rock of Our Salvation Mission Church. We are a community built on faith, love, and the unshakeable foundation of Christ. Whether you are searching, growing, or serving, there is a place for you here."
          </p>
          <div className="ornament" style={{justifyContent:"center"}}>
            <span style={{fontSize:".9rem",color:"#C9A84C"}}>— Kuya Ivan, Head</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function About() {
  return (
    <section>
      <Hdr eye="Who We Are" title="About Our Church" sub="Built on the Rock — Jesus Christ, our eternal foundation."/>
      <div className="g2" style={{marginBottom:60}}>
        {[{l:"Our Vision",i:"👁️",t:"To be a vibrant community of believers, firmly rooted in Jesus Christ — growing in faith, united in love, and sent into the world as living testimonies of His grace and salvation."},{l:"Our Mission",i:"🎯",t:"To proclaim the Gospel of Jesus Christ, make devoted disciples, nurture a family of worshippers, and extend God's kingdom through faithful service, compassionate outreach, and Spirit-filled living."}].map(m=>(
          <div key={m.l} className="card" style={{background:"#12121A",border:"1px solid #22223A",padding:40,position:"relative",overflow:"hidden"}}>
            <TL/><div style={{fontSize:36,marginBottom:16}}>{m.i}</div>
            <h3 className="font-display" style={{fontSize:"1.2rem",color:"#C9A84C",marginBottom:16}}>{m.l}</h3>
            <p style={{color:"#B0A898",lineHeight:1.9,fontSize:"1.05rem"}}>{m.t}</p>
          </div>
        ))}
      </div>
      <Hdr eye="What We Stand For" title="Core Values"/>
      <div className="g3" style={{marginBottom:60}}>
        {[{v:"Faith",d:"Trusting God completely in every season.",i:"✝️"},{v:"Love",d:"Loving God and one another as Christ commanded.",i:"❤️"},{v:"Worship",d:"Giving God glory through praise, prayer, and devotion.",i:"🎵"},{v:"Community",d:"Doing life together as a family of believers.",i:"🤝"},{v:"Service",d:"Using our gifts to serve God and others selflessly.",i:"🕊️"},{v:"Integrity",d:"Living transparently and accountably before God.",i:"🛡️"}].map(c=>(
          <div key={c.v} className="card" style={{background:"#12121A",border:"1px solid #22223A",padding:28,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>{c.i}</div>
            <h4 className="font-display" style={{fontSize:"1rem",color:"#C9A84C",marginBottom:8}}>{c.v}</h4>
            <p style={{color:"#9A9080",fontSize:".95rem",lineHeight:1.7}}>{c.d}</p>
          </div>
        ))}
      </div>
      <Hdr eye="Our Leaders" title="Leadership Team"/>
      <div className="g3">
        {LEADERSHIP.map(l=>(
          <div key={l.name} className="card" style={{background:"#12121A",border:"1px solid #22223A",padding:28}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,.2),rgba(201,168,76,.05))",border:"1px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16}}>{l.icon}</div>
            <h4 className="font-sans" style={{fontSize:"1rem",marginBottom:4}}>{l.name}</h4>
            <div className="badge" style={{marginBottom:12}}>{l.role}</div>
            <p style={{color:"#9A9080",fontSize:".9rem",lineHeight:1.7}}>{l.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ministries() {
  return (
    <section>
      <Hdr eye="Serving Together" title="Our Ministries" sub="Every ministry is vital to the body of Christ."/>
      <div className="g3">
        {MINISTRIES.map(m=>(
          <div key={m.name} className="card" style={{background:"#12121A",border:"1px solid #22223A",padding:36,position:"relative",overflow:"hidden"}}>
            <TL/>
            <div style={{fontSize:40,marginBottom:20}}>{m.icon}</div>
            <h3 className="font-display" style={{fontSize:"1.05rem",color:"#E8CC7A",marginBottom:12}}>{m.name}</h3>
            <p style={{color:"#9A9080",lineHeight:1.8}}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  useEffect(()=>{dbGet("events","?order=created_at.asc").then(d=>{if(d)setEvents(d);});},[]);
  const typeColor = t=>t==="worship"?"#C9A84C":t==="prayer"?"#B07BE0":t==="youth"?"#7BE0B0":t==="event"?"#7B9EF0":t==="devotion"?"#E0B07B":"#9A9080";
  const typeIcon  = t=>t==="worship"?"✝️":t==="prayer"?"🙏":t==="youth"?"🌟":t==="event"?"🎉":t==="devotion"?"📖":"📅";
  return (
    <section>
      <Hdr eye="Plan Your Visit" title="Events Calendar"/>
      <div style={{marginBottom:60}}>
        {events.length===0 && <div style={{color:"#9A9080",textAlign:"center",padding:32}}>No upcoming events yet. Check back soon!</div>}
        {events.map(e=>{
          const c = typeColor(e.type);
          const parts = (e.date||"").split(" ");
          return (
          <div key={e.id||e.title} style={{background:"#12121A",borderLeft:`3px solid ${c}`,padding:"24px 28px",marginBottom:16,display:"flex",gap:24,alignItems:"center",flexWrap:"wrap",transition:"all .2s",cursor:"default"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#1A1A28";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c}25`;}}
            onMouseLeave={e=>{e.currentTarget.style.background="#12121A";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{textAlign:"center",minWidth:64}}>
              <div className="font-sans" style={{fontSize:".65rem",color:c,letterSpacing:".15em"}}>{(parts[0]||"").toUpperCase()}</div>
              <div className="font-display" style={{fontSize:"2rem",color:"#F0EAD6"}}>{parts[1]||""}</div>
            </div>
            <div style={{fontSize:"1.5rem"}}>{typeIcon(e.type)}</div>
            <div>
              <div style={{fontWeight:600,fontSize:"1.1rem",marginBottom:4}}>{e.title}</div>
              <div style={{color:"#9A9080"}}>{e.time}</div>
              {e.type&&<div style={{marginTop:6,display:"inline-block",padding:"2px 10px",fontSize:".7rem",background:`${c}18`,color:c,border:`1px solid ${c}40`,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase"}}>{e.type}</div>}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
function Media() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState("All");
  useEffect(()=>{dbGet("songs","?order=created_at.asc").then(d=>{if(d)setSongs(d);});},[]);
  const getYouTubeId = (url) => {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };
  const catColor = (c) => c==="Praise"?"#C9A84C":c==="Worship"?"#B07BE0":c==="Hymn"?"#7B9EF0":c==="Special"?"#E07B7B":"#9A9080";
  const cats = ["All","Praise","Worship","Hymn","Special"];
  const filtered = filter === "All" ? songs : songs.filter(s=>s.category===filter);
  const cur = playing !== null ? filtered[playing] : null;
  const vid = cur ? getYouTubeId(cur.youtube) : null;
  return (
    <section>
      <Hdr eye="God's Word & Worship" title="Sermons & Media"/>
      <div style={{background:"#12121A",border:"1px solid #22223A",padding:48,marginBottom:48,position:"relative",textAlign:"center"}}>
        <TL/>
        <a href="https://www.facebook.com/profile.php?id=61568763184691" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
          <div style={{width:"100%",maxWidth:640,height:300,margin:"0 auto",background:"#0A0A0F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1px solid #22223A",marginBottom:24,cursor:"pointer",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.border="1px solid #C9A84C";e.currentTarget.style.background="#0F0F18";}}
            onMouseLeave={e=>{e.currentTarget.style.border="1px solid #22223A";e.currentTarget.style.background="#0A0A0F";}}>
            <div className="aPulse" style={{width:72,height:72,borderRadius:"50%",background:"rgba(201,168,76,.15)",border:"2px solid #C9A84C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16}}>▶</div>
            <div className="font-sans" style={{fontSize:".8rem",letterSpacing:".15em",color:"#C9A84C"}}>FACEBOOK LIVE</div>
            <div style={{color:"#9A9080",fontSize:".9rem",marginTop:8}}>Every Sunday at 9:00 AM</div>
            <div style={{color:"#C9A84C",fontSize:".75rem",marginTop:12,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".1em"}}>Click to watch →</div>
          </div>
        </a>
        <a href="https://www.facebook.com/profile.php?id=61568763184691" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><button className="btnGold">📺 Watch Live on Facebook</button></a>
      </div>
      <Hdr eye="Our Music" title="Song List & Music Player"/>
      {cur && (
        <div style={{background:"#12121A",border:"1px solid #B07BE0",marginBottom:28,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#B07BE0,transparent)"}}/>
          <div style={{padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div>
              <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".12em",color:"#B07BE0",marginBottom:4}}>▶ NOW PLAYING</div>
              <div style={{fontWeight:700,fontSize:"1.05rem"}}>{cur.title}</div>
              <div style={{color:"#9A9080",fontSize:".85rem"}}>{cur.author}</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPlaying(playing>0?playing-1:filtered.length-1)} style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:38,height:38,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏮</button>
              <button onClick={()=>setPlaying(null)} style={{background:"rgba(224,123,123,.15)",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",width:38,height:38,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏹</button>
              <button onClick={()=>setPlaying(playing<filtered.length-1?playing+1:0)} style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:38,height:38,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏭</button>
            </div>
          </div>
          {vid ? (
            <div style={{position:"relative",paddingBottom:"42%",background:"#000"}}>
              <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
            </div>
          ) : (
            <div style={{padding:"32px",textAlign:"center",color:"#9A9080",background:"#0A0A0F"}}>🎵 No YouTube link for this song.</div>
          )}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>{setFilter(c);setPlaying(null);}} style={{padding:"6px 16px",background:filter===c?catColor(c):"transparent",border:`1px solid ${filter===c?catColor(c):"#22223A"}`,color:filter===c?"#0A0A0F":catColor(c),cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".75rem",letterSpacing:".08em",transition:"all .2s"}}>{c}</button>
        ))}
        <span style={{marginLeft:"auto",color:"#9A9080",fontSize:".85rem"}}>{filtered.length} song{filtered.length!==1?"s":""}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((s,i)=>{
          const ip = playing===i;
          const sv = getYouTubeId(s.youtube);
          return (
            <div key={i} onClick={()=>setPlaying(ip?null:i)} style={{background:ip?"#1E1A2E":"#12121A",border:`1px solid ${ip?"#B07BE0":"#22223A"}`,padding:"14px 24px",display:"flex",alignItems:"center",gap:16,cursor:"pointer",transition:"all .2s"}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:ip?"#B07BE0":"rgba(176,123,224,.15)",border:`1px solid ${ip?"#B07BE0":"rgba(176,123,224,.4)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16,color:ip?"#0A0A0F":"#B07BE0",transition:"all .2s"}}>{ip?"⏸":"▶"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,marginBottom:2,color:ip?"#E8CC7A":"#F0EAD6"}}>{s.title}</div>
                <div style={{color:"#9A9080",fontSize:".85rem"}}>{s.author}</div>
              </div>
              <span style={{padding:"2px 10px",background:`${catColor(s.category)}15`,border:`1px solid ${catColor(s.category)}40`,color:catColor(s.category),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif",flexShrink:0}}>{s.category}</span>
              <span style={{fontSize:12,color:sv?"#E07B7B":"#3A3A50",flexShrink:0}}>{sv?"▶ YT":"—"}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function Give() {
  return (
    <section>
      <Hdr eye="Give & Support" title="Online Offering" sub="Bring the whole tithe into the storehouse. — Malachi 3:10"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24,marginBottom:48}}>
        {[{color:"#4A6FBF",label:"📱 GCASH",info:[["Name","JRSMC Fund"],["Number","09XX-XXX-XXXX"]]},{color:"#7B4FCF",label:"🏦 BANK TRANSFER",info:[["Bank","BDO / BPI"],["Account Name","JRSMC Mission"],["Account No","XXXX-XXXX-XXXX"]]}].map(b=>(
          <div key={b.label} style={{background:"#12121A",border:"1px solid #22223A",padding:32,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${b.color},transparent)`}}/>
            <h4 className="font-sans" style={{fontSize:".85rem",letterSpacing:".1em",color:b.color,marginBottom:16}}>{b.label}</h4>
            {b.info.map(([k,v])=><div key={k} style={{color:"#B0A898",lineHeight:1.9}}>{k}: <span style={{color:"#C9A84C"}}>{v}</span></div>)}
          </div>
        ))}
      </div>
    </section>
  );
}

function Prayer() {
  const [f,setF]=useState({name:"",req:"",conf:false});
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(false);
  const submit = async () => {
    if (!f.req) return;
    setLoading(true);
    const name = f.name.trim() || "Anonymous";
    await dbInsert("prayer_requests", { name, req: f.req, conf: f.conf });
    addLog("🙏", f.conf ? "A confidential prayer request was submitted" : `New prayer request from ${name}`, "Guest", name);
    window.dispatchEvent(new Event("prayerUpdate"));
    setLoading(false);
    setOk(true);
    setF({name:"",req:"",conf:false});
  };
  return (
    <section>
      <Hdr eye="We're Here For You" title="Prayer Requests" sub="Cast your burdens upon the Lord. — Psalm 55:22"/>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{background:"#12121A",border:"1px solid #22223A",padding:48,position:"relative"}}>
          <TL/><Cross size={200} op={0.04} top="0" right="-40px"/>
          {ok?(
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:48,marginBottom:16}}>🙏</div>
              <h4 className="font-display" style={{color:"#C9A84C",marginBottom:12}}>Prayer Submitted</h4>
              <p style={{color:"#9A9080",lineHeight:1.8}}>Our prayer team will intercede for you.</p>
              <button className="btnOut" style={{marginTop:24}} onClick={()=>setOk(false)}>Submit Another</button>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:20,position:"relative"}}>
              <div><label>Your Name (Optional)</label><input placeholder="Anonymous" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
              <div><label>Your Prayer Request</label><textarea rows={6} placeholder="Share what's on your heart..." value={f.req} onChange={e=>setF({...f,req:e.target.value})} style={{resize:"vertical"}}/></div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <input type="checkbox" id="conf" checked={f.conf} onChange={e=>setF({...f,conf:e.target.checked})} style={{width:"auto",accentColor:"#C9A84C"}}/>
                <label htmlFor="conf" style={{marginBottom:0,textTransform:"none",letterSpacing:0,fontSize:".95rem",cursor:"pointer"}}>🔒 Keep this request confidential</label>
              </div>
              <button className="btnGold" onClick={submit} disabled={loading}>{loading?"Submitting...":"Submit Prayer Request"}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Login({onLogin}) {
  const [mode, setMode] = useState("login");
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [err,setErr]=useState("");
  const [shake,setShake]=useState(false);
  const [reg, setReg] = useState({fullName:"", username:"", password:"", confirm:"", contact:""});
  const [regMsg, setRegMsg] = useState("");
  const [regOk, setRegOk] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const tryLogin = () => {
    const uname = u.trim().toLowerCase();
    // Check hardcoded accounts first (instant)
    const match = ACCOUNTS.find(a=>a.username===uname&&a.password===p);
    if(match){const rd=ROLES.find(r=>r.id===match.role);onLogin({...match,...rd});return;}
    // Check Supabase member_accounts
    dbGet("member_accounts","?username=eq."+uname).then(res=>{
      if(res&&res.length>0&&res[0].password===p){
        const acc=res[0];
        const rd=ROLES.find(r=>r.id==="member");
        onLogin({...rd, id:acc.id, username:acc.username, role:"member", fullName:acc.full_name, password:acc.password, email:acc.email||"", phone:acc.phone||"", bio:acc.bio||"", photo:acc.photo||null, label:"Member", icon:"👤", color:"#9A9080"});
      } else {
        setErr("Invalid username or password. Please try again.");
        setShake(true);setTimeout(()=>setShake(false),500);
      }
    }).catch(()=>{
      setErr("Invalid username or password. Please try again.");
      setShake(true);setTimeout(()=>setShake(false),500);
    });
  };

  const tryRegister = async () => {
    if(!reg.fullName||!reg.username||!reg.password) return setRegMsg("Please fill in all required fields.");
    if(reg.password!==reg.confirm) return setRegMsg("Passwords do not match.");
    if(reg.password.length<6) return setRegMsg("Password must be at least 6 characters.");
    const uname = reg.username.trim().toLowerCase();
    if(ACCOUNTS.find(a=>a.username===uname)) return setRegMsg("Username already taken.");
    setRegLoading(true);
    try {
      // Direct fetch to see exact error
      const url = `${SUPA_URL}/rest/v1/member_accounts`;
      const res = await fetch(url, {
        method:"POST",
        headers:{
          "apikey": SUPA_KEY,
          "Authorization": `Bearer ${SUPA_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({username:uname, password:reg.password, full_name:reg.fullName, role:"member"})
      });
      const text = await res.text();
      console.log("member_accounts insert status:", res.status);
      console.log("member_accounts insert response:", text);
      if(!res.ok){
        setRegMsg("Error: "+text);
        setRegLoading(false);
        return;
      }
      // Also add to members list
      await dbInsert("members",{name:reg.fullName, role:"member", status:"Active", joined:new Date().toLocaleDateString("en-PH",{month:"long",year:"numeric"})});
      setRegOk(true); setRegMsg("");
    } catch(e){
      console.error("Register error:", e);
      setRegMsg("Registration failed: "+e.message);
    }
    setRegLoading(false);
  };

  const tabBtn = (label, active, onClick) => (
    <button onClick={onClick} style={{flex:1,padding:"13px 0",background:"none",border:"none",borderBottom:active?"2px solid #C9A84C":"2px solid transparent",color:active?"#E8CC7A":"#9A9080",cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".85rem",letterSpacing:".1em",transition:"all .2s",marginBottom:"-1px"}}>{label}</button>
  );

  return (
    <section>
      <Hdr eye="Member Portal" title="Sign In" sub="Enter your credentials to access your dashboard."/>
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <div style={{background:"#12121A",border:"1px solid #22223A",padding:"0 0 40px",position:"relative"}}>
          <TL/><Cross size={180} op={0.03} top="20px" right="-30px"/>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #22223A",marginBottom:32}}>
            {tabBtn("🔑 SIGN IN", mode==="login", ()=>{setMode("login");setErr("");setRegMsg("");})}
            {tabBtn("📝 REGISTER", mode==="register", ()=>{setMode("register");setErr("");setRegMsg("");})}
          </div>

          <div style={{padding:"0 40px",position:"relative"}}>
            {/* Login Form */}
            {mode==="login" && (
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                <div><label>Username</label><input className={shake?"aShake":""} placeholder="Enter your username" value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></div>
                <div><label>Password</label><input type="password" placeholder="••••••••" value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></div>
                {err&&<div style={{background:"rgba(224,123,123,.1)",border:"1px solid rgba(224,123,123,.3)",padding:"12px 16px",color:"#E07B7B",fontSize:".9rem"}}>⚠️ {err}</div>}
                <button className="btnGold" onClick={tryLogin}>Sign In →</button>
                <div style={{textAlign:"center",color:"#9A9080",fontSize:".85rem"}}>
                  Don't have an account?{" "}
                  <span onClick={()=>setMode("register")} style={{color:"#C9A84C",cursor:"pointer",textDecoration:"underline"}}>Register here</span>
                </div>
              </div>
            )}

            {/* Register Form */}
            {mode==="register" && (
              regOk ? (
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <div style={{fontSize:48,marginBottom:16}}>✅</div>
                  <h4 className="font-display" style={{color:"#C9A84C",marginBottom:8}}>Registration Successful!</h4>
                  <p style={{color:"#9A9080",lineHeight:1.7,marginBottom:24}}>Your account has been created! You can now sign in using your username and password.</p>
                  <button className="btnOut" onClick={()=>{setMode("login");setRegOk(false);setReg({fullName:"",username:"",password:"",confirm:"",contact:""});}}>Back to Sign In</button>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div><label>Full Name <span style={{color:"#E07B7B"}}>*</span></label><input placeholder="Juan dela Cruz" value={reg.fullName} onChange={e=>setReg({...reg,fullName:e.target.value})}/></div>
                  <div><label>Username <span style={{color:"#E07B7B"}}>*</span></label><input placeholder="juandelacruz" value={reg.username} onChange={e=>setReg({...reg,username:e.target.value})}/></div>
                  <div><label>Contact No.</label><input placeholder="09XX-XXX-XXXX" value={reg.contact} onChange={e=>setReg({...reg,contact:e.target.value})}/></div>
                  <div><label>Password <span style={{color:"#E07B7B"}}>*</span></label><input type="password" placeholder="At least 6 characters" value={reg.password} onChange={e=>setReg({...reg,password:e.target.value})}/></div>
                  <div><label>Confirm Password <span style={{color:"#E07B7B"}}>*</span></label><input type="password" placeholder="Re-enter password" value={reg.confirm} onChange={e=>setReg({...reg,confirm:e.target.value})}/></div>
                  {regMsg&&<div style={{background:"rgba(224,123,123,.1)",border:"1px solid rgba(224,123,123,.3)",padding:"12px 16px",color:"#E07B7B",fontSize:".9rem"}}>⚠️ {regMsg}</div>}
                  <button className="btnGold" onClick={tryRegister} disabled={regLoading}>{regLoading?"Submitting...":"Submit Registration"}</button>
                  <div style={{textAlign:"center",color:"#9A9080",fontSize:".85rem"}}>
                    Already have an account?{" "}
                    <span onClick={()=>setMode("login")} style={{color:"#C9A84C",cursor:"pointer",textDecoration:"underline"}}>Sign in here</span>
                  </div>
                  <div style={{background:"#1A1A28",padding:14,borderLeft:"3px solid #E0B07B",fontSize:".82rem",color:"#9A9080"}}>
                    ℹ️ New accounts are automatically assigned as <span style={{color:"#E8CC7A"}}>Member</span>.
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PANELS ────────────────────────────────────────────────────────────────────
// ── CONFIRM DELETE DIALOG ────────────────────────────────────────────────────
function ConfirmDialog({onConfirm, onCancel, message="Are you sure you want to delete this?"}) {
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"#1A1A28",border:"1px solid #E07B7B",padding:32,maxWidth:360,width:"90%",position:"relative",textAlign:"center"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#E07B7B,transparent)"}}/>
        <div style={{fontSize:32,marginBottom:12}}>🗑️</div>
        <div style={{fontWeight:600,marginBottom:8,color:"#F0EAD6"}}>{message}</div>
        <div style={{color:"#9A9080",fontSize:".9rem",marginBottom:24}}>This action cannot be undone.</div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={onConfirm} style={{background:"rgba(224,123,123,.2)",border:"1px solid #E07B7B",color:"#E07B7B",cursor:"pointer",padding:"10px 28px",fontFamily:"'Tenor Sans',sans-serif",fontSize:".85rem",letterSpacing:".08em"}}>🗑 Delete</button>
          <button onClick={onCancel} style={{background:"rgba(255,255,255,.06)",border:"1px solid #22223A",color:"#9A9080",cursor:"pointer",padding:"10px 28px",fontFamily:"'Tenor Sans',sans-serif",fontSize:".85rem",letterSpacing:".08em"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function MembersPanel() {
  const [members,setMembers]=useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form,setForm]=useState({name:"",role:"",status:"Active",joined:""});
  const [adding,setAdding]=useState(false);
  const [loading,setLoading]=useState(true);
  const [editId,setEditId]=useState(null);
  const [editData,setEditData]=useState({});
  useEffect(()=>{dbGet("members","?order=created_at.asc").then(d=>{if(d)setMembers(d);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.name||!form.role)return;
    const r=await dbInsert("members",form);
    if(r&&r[0]){setMembers([...members,r[0]]);addLog("👥","New member added: "+form.name,"Head","Kuya Ivan");}
    setForm({name:"",role:"",status:"Active",joined:""});setAdding(false);
  };
  const remove=async(id)=>{await dbDelete("members",id);setMembers(members.filter(x=>x.id!==id));};
  const startEdit=(m)=>{setEditId(m.id);setEditData({role:m.role,status:m.status});};
  const saveEdit=async(id)=>{
    await dbUpdate("members",id,editData);
    setMembers(members.map(x=>x.id===id?{...x,...editData}:x));
    addLog("👥","Member record updated","Head","Kuya Ivan");
    setEditId(null);
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>👥 Member Records</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Member"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        <div><label>Name</label><input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label>Role</label><input placeholder="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/></div>
        <div><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Inactive</option></select></div>
        <div><label>Date Joined</label><input placeholder="Mar 2026" value={form.joined} onChange={e=>setForm({...form,joined:e.target.value})}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading members...</div>:(
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["#","Name","Role","Status","Joined","Action"].map(h=><th key={h} className="font-sans" style={{padding:"10px 16px",textAlign:"left",fontSize:".7rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{members.map((m,i)=>(
            <tr key={m.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1A1A28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{i+1}</td>
              <td style={{padding:"12px 16px",fontWeight:600}}>{m.name}</td>
              <td style={{padding:"12px 16px"}}>
                {editId===m.id
                  ? <input value={editData.role} onChange={e=>setEditData({...editData,role:e.target.value})} style={{padding:"6px 10px",background:"#12121A",border:"1px solid #C9A84C",color:"#F0EAD6",width:"100%",minWidth:120}}/>
                  : <span style={{color:"#9A9080",fontSize:".9rem"}}>{m.role}</span>}
              </td>
              <td style={{padding:"12px 16px"}}>
                {editId===m.id
                  ? <select value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})} style={{padding:"6px 10px",background:"#12121A",border:"1px solid #C9A84C",color:"#F0EAD6"}}>
                      <option>Active</option><option>Inactive</option>
                    </select>
                  : <span style={{padding:"2px 10px",fontSize:".7rem",background:m.status==="Active"?"rgba(123,224,176,.1)":"rgba(224,123,123,.1)",color:m.status==="Active"?"#7BE0B0":"#E07B7B",border:`1px solid ${m.status==="Active"?"rgba(123,224,176,.3)":"rgba(224,123,123,.3)"}`}}>{m.status}</span>}
              </td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{m.joined}</td>
              <td style={{padding:"12px 16px"}}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {editId===m.id
                  ? <>
                      <button onClick={()=>saveEdit(m.id)} style={{background:"none",border:"none",color:"#7BE0B0",cursor:"pointer",fontSize:".85rem"}}>✓ Save</button>
                      <button onClick={()=>setEditId(null)} style={{background:"none",border:"none",color:"#9A9080",cursor:"pointer",fontSize:".85rem"}}>Cancel</button>
                    </>
                  : <>
                      <button onClick={()=>startEdit(m)} style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem"}}>✏️ Edit</button>
                      <button onClick={()=>setConfirmId(m.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>
                    </>}
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>)}
      <div style={{marginTop:16,color:"#9A9080",fontSize:".85rem"}}>Total: {members.length} members</div>
    </div>
  );
}

function DonationRecordsPanel() {
  const [records, setRecords] = useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form, setForm] = useState({name:"",type:"Tithe",amount:"",date:"",status:"Pending"});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    dbGet("finance_records","?order=created_at.desc")
      .then(d=>{if(d)setRecords(d.filter(x=>x.source!=="financial"));setLoading(false);});
  },[]);
  const totalV = records.filter(r=>r.status==="Verified").reduce((s,r)=>s+Number(r.amount),0);
  const totalP = records.filter(r=>r.status==="Pending").reduce((s,r)=>s+Number(r.amount),0);
  const add = async () => {
    if(!form.name||!form.amount) return;
    const r = await dbInsert("finance_records",{name:form.name,type:form.type,amount:Number(form.amount),date:form.date,status:form.status,source:"donations"});
    if(r&&r[0]){setRecords([r[0],...records]);addLog("💰","Donation recorded: "+form.name+" — ₱"+form.amount,"Financial","Treasurer/Financial");}
    setForm({name:"",type:"Tithe",amount:"",date:"",status:"Pending"});setAdding(false);
  };
  const verify = async(id)=>{await dbUpdate("finance_records",id,{status:"Verified"});setRecords(records.map(x=>x.id===id?{...x,status:"Verified"}:x));};
  const remove = async(id)=>{await dbDelete("finance_records",id);setRecords(records.filter(x=>x.id!==id));};
  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:24}}>💵 Donation Records</h4>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,marginBottom:24}}>
        {[{l:"Verified Total",v:`₱${totalV.toLocaleString()}`,c:"#7BE0B0"},{l:"Pending Total",v:`₱${totalP.toLocaleString()}`,c:"#E0B07B"},{l:"Total Records",v:records.length,c:"#7B9EF0"}].map(s=>(
          <div key={s.l} style={{background:"#1A1A28",padding:"18px 22px",borderLeft:`3px solid ${s.c}`}}>
            <div style={{fontSize:".72rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase"}}>{s.l}</div>
            <div className="font-display" style={{fontSize:"1.5rem",color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>Member Donations</div>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Record Donation"}</button>
      </div>
      {adding&&(<div style={{background:"#12121A",border:"1px solid #22223A",padding:20,marginBottom:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
        <div><label>Name</label><input placeholder="Contributor" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Tithe","Offering","Mission Fund","Building Fund"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label>Amount (₱)</label><input type="number" placeholder="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
        <div><label>Date</label><input placeholder="Mar 9" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading...</div>:(
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["Name","Type","Amount","Date","Status","Action"].map(h=><th key={h} className="font-sans" style={{padding:"10px 14px",textAlign:"left",fontSize:".68rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {records.map(r=>(
              <tr key={r.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1E1E2E"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"11px 14px",fontWeight:600}}>{r.name}</td>
                <td style={{padding:"11px 14px",color:"#9A9080",fontSize:".9rem"}}>{r.type}</td>
                <td style={{padding:"11px 14px",color:"#7BE0B0",fontWeight:600}}>₱{Number(r.amount).toLocaleString()}</td>
                <td style={{padding:"11px 14px",color:"#9A9080",fontSize:".85rem"}}>{r.date||new Date(r.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}</td>
                <td style={{padding:"11px 14px"}}><span style={{padding:"2px 10px",fontSize:".68rem",background:r.status==="Verified"?"rgba(123,224,176,.1)":"rgba(224,176,123,.1)",color:r.status==="Verified"?"#7BE0B0":"#E0B07B",border:`1px solid ${r.status==="Verified"?"rgba(123,224,176,.3)":"rgba(224,176,123,.3)"}`}}>{r.status}</span></td>
                <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:8}}>
                  {r.status==="Pending"&&<button onClick={()=>verify(r.id)} style={{background:"none",border:"none",color:"#7BE0B0",cursor:"pointer",fontSize:".82rem"}}>✓ Verify</button>}
                  <button onClick={()=>setConfirmId(r.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".82rem"}}>Remove</button>
                </div></td>
              </tr>
            ))}
            {records.length===0&&<tr><td colSpan={6} style={{padding:32,textAlign:"center",color:"#9A9080"}}>No donations recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function FinancialReportsPanel() {
  const [records, setRecords] = useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form, setForm] = useState({name:"",type:"Expense",amount:"",date:"",status:"Pending",note:""});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    dbGet("finance_records","?order=created_at.desc")
      .then(d=>{
        if(d) setRecords(d.filter(x=>x.source==="financial"));
        setLoading(false);
      });
  },[]);
  const totalAll = records.reduce((s,r)=>s+Number(r.amount),0);
  const totalV   = records.filter(r=>r.status==="Verified").reduce((s,r)=>s+Number(r.amount),0);
  const totalP   = records.filter(r=>r.status==="Pending").reduce((s,r)=>s+Number(r.amount),0);
  const add = async () => {
    if(!form.name||!form.amount) return;
    const payload = {name:form.name, type:form.type, amount:Number(form.amount), date:form.date, status:form.status, source:"financial"};
    const r = await dbInsert("finance_records", payload);
    if(r&&r[0]){
      setRecords([{...r[0], source:"financial"},...records]);
      addLog("📊","Financial entry: "+form.name+" — ₱"+form.amount,"Financial","Treasurer");
    } else {
      // Fallback: show locally even if Supabase didn't return data
      setRecords([{...payload, id:Date.now(), created_at:new Date().toISOString()},...records]);
    }
    setForm({name:"",type:"Expense",amount:"",date:"",status:"Pending",note:""});setAdding(false);
  };
  const verify = async(id)=>{await dbUpdate("finance_records",id,{status:"Verified"});setRecords(records.map(x=>x.id===id?{...x,status:"Verified"}:x));};
  const remove = async(id)=>{await dbDelete("finance_records",id);setRecords(records.filter(x=>x.id!==id));};
  const typeBreakdown = ["Expense","Income","Salary","Utility","Maintenance","Other"].map(t=>({
    type:t, total:records.filter(r=>r.type===t).reduce((s,r)=>s+Number(r.amount),0),
    count:records.filter(r=>r.type===t).length,
  })).filter(t=>t.count>0);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📊 Financial Reports</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Entry"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:20,marginBottom:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
        <div><label>Description</label><input placeholder="e.g. Electricity" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Expense","Income","Salary","Utility","Maintenance","Other"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label>Amount (₱)</label><input type="number" placeholder="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
        <div><label>Date</label><input placeholder="Mar 9" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
        <div><label>Note</label><input placeholder="Optional" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading...</div>:(
      <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14,marginBottom:24}}>
          {[{l:"Total Amount",v:`₱${totalAll.toLocaleString()}`,c:"#C9A84C",sub:`${records.length} entries`},{l:"Verified",v:`₱${totalV.toLocaleString()}`,c:"#7BE0B0",sub:`${records.filter(r=>r.status==="Verified").length} records`},{l:"Pending",v:`₱${totalP.toLocaleString()}`,c:"#E0B07B",sub:`${records.filter(r=>r.status==="Pending").length} records`}].map(s=>(
            <div key={s.l} style={{background:"#1A1A28",padding:"18px 22px",borderLeft:`3px solid ${s.c}`}}>
              <div style={{fontSize:".72rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase"}}>{s.l}</div>
              <div className="font-display" style={{fontSize:"1.5rem",color:s.c}}>{s.v}</div>
              <div style={{fontSize:".75rem",color:"#9A9080",marginTop:4}}>{s.sub}</div>
            </div>
          ))}
        </div>
        {typeBreakdown.length>0&&(
          <div style={{marginBottom:24}}>
            <div className="font-sans" style={{fontSize:".72rem",color:"#9A9080",letterSpacing:".1em",marginBottom:12,textTransform:"uppercase"}}>By Category</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
              {typeBreakdown.map((t,i)=>{
                const colors=["#C9A84C","#7BE0B0","#B07BE0","#7B9EF0","#E0B07B","#E07B7B"];
                const c=colors[i%colors.length];
                const pct=totalAll>0?Math.round((t.total/totalAll)*100):0;
                return (
                  <div key={t.type} style={{background:"#1A1A28",border:`1px solid ${c}30`,padding:"14px 18px"}}>
                    <div style={{fontSize:".7rem",color:c,fontFamily:"'Tenor Sans',sans-serif",marginBottom:6}}>{t.type.toUpperCase()}</div>
                    <div className="font-display" style={{fontSize:"1.2rem",color:c,marginBottom:6}}>₱{t.total.toLocaleString()}</div>
                    <div style={{background:"#22223A",height:5,borderRadius:3,marginBottom:4}}>
                      <div style={{background:c,height:5,borderRadius:3,width:`${pct}%`}}/>
                    </div>
                    <div style={{color:"#9A9080",fontSize:".72rem"}}>{t.count} entries · {pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["Description","Type","Amount","Date","Note","Status","Action"].map(h=><th key={h} className="font-sans" style={{padding:"10px 14px",textAlign:"left",fontSize:".68rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>
              {records.map(r=>(
                <tr key={r.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1E1E2E"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"11px 14px",fontWeight:600}}>{r.name}</td>
                  <td style={{padding:"11px 14px",color:"#9A9080",fontSize:".9rem"}}>{r.type}</td>
                  <td style={{padding:"11px 14px",color:"#7BE0B0",fontWeight:600}}>₱{Number(r.amount).toLocaleString()}</td>
                  <td style={{padding:"11px 14px",color:"#9A9080",fontSize:".85rem"}}>{r.date||new Date(r.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}</td>
                  <td style={{padding:"11px 14px",color:"#9A9080",fontSize:".85rem"}}>{r.note||"—"}</td>
                  <td style={{padding:"11px 14px"}}><span style={{padding:"2px 10px",fontSize:".68rem",background:r.status==="Verified"?"rgba(123,224,176,.1)":"rgba(224,176,123,.1)",color:r.status==="Verified"?"#7BE0B0":"#E0B07B",border:`1px solid ${r.status==="Verified"?"rgba(123,224,176,.3)":"rgba(224,176,123,.3)"}`}}>{r.status}</span></td>
                  <td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:8}}>
                    {r.status==="Pending"&&<button onClick={()=>verify(r.id)} style={{background:"none",border:"none",color:"#7BE0B0",cursor:"pointer",fontSize:".82rem"}}>✓ Verify</button>}
                    <button onClick={()=>setConfirmId(r.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".82rem"}}>Remove</button>
                  </div></td>
                </tr>
              ))}
              {records.length===0&&<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"#9A9080"}}>No entries yet. Click "+ Add Entry" to start.</td></tr>}
            </tbody>
          </table>
        </div>
      </>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function MonthlyBudgetPanel() {
  const [budgets, setBudgets] = useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form, setBudgetForm] = useState({category:"",allocated:"",spent:"",note:""});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    dbGet("documents","?order=created_at.desc").then(d=>{
      if(d) setBudgets(d.filter(x=>x.type==="Budget").map(x=>{try{const p=JSON.parse(x.name||"{}");return{...x,...p};}catch{return x;}}));
      setLoading(false);
    });
  },[]);
  const add = async () => {
    if(!form.category||!form.allocated) return;
    const budgetData = JSON.stringify({category:form.category,allocated:Number(form.allocated),spent:Number(form.spent||0),note:form.note});
    const payload = {name:budgetData, type:"Budget", uploaded_by:"Treasurer"};
    const r = await dbInsert("documents", payload);
    if(r&&r[0]){setBudgets([...budgets,{...r[0],category:form.category,allocated:Number(form.allocated),spent:Number(form.spent||0),note:form.note}]);addLog("📋","Budget set: "+form.category+" — ₱"+form.allocated,"Financial","Treasurer");}
    setBudgetForm({category:"",allocated:"",spent:"",note:""});setAdding(false);
  };
  const updateSpent = async(b, newSpent) => {
    const newName = JSON.stringify({category:b.category,allocated:b.allocated,spent:Number(newSpent),note:b.note||""});
    await dbUpdate("documents",b.id,{name:newName});
    setBudgets(budgets.map(x=>x.id===b.id?{...x,spent:Number(newSpent)}:x));
  };
  const remove = async(id)=>{await dbDelete("documents",id);setBudgets(budgets.filter(x=>x.id!==id));};
  const totalAlloc = budgets.reduce((s,b)=>s+Number(b.allocated||0),0);
  const totalSpent = budgets.reduce((s,b)=>s+Number(b.spent||0),0);
  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:24}}>📋 Monthly Budget</h4>
      {budgets.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16,marginBottom:24}}>
          {[{l:"Total Allocated",v:`₱${totalAlloc.toLocaleString()}`,c:"#7B9EF0"},{l:"Total Spent",v:`₱${totalSpent.toLocaleString()}`,c:"#E0B07B"},{l:"Remaining",v:`₱${(totalAlloc-totalSpent).toLocaleString()}`,c:"#7BE0B0"}].map(s=>(
            <div key={s.l} style={{background:"#1A1A28",padding:"18px 22px",borderLeft:`3px solid ${s.c}`}}>
              <div style={{fontSize:".72rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase"}}>{s.l}</div>
              <div className="font-display" style={{fontSize:"1.5rem",color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>Budget Allocations</div>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Budget"}</button>
      </div>
      {adding&&(<div style={{background:"#12121A",border:"1px solid #22223A",padding:20,marginBottom:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>
        <div><label>Category</label><input placeholder="e.g. Utilities" value={form.category} onChange={e=>setBudgetForm({...form,category:e.target.value})}/></div>
        <div><label>Allocated (₱)</label><input type="number" placeholder="0" value={form.allocated} onChange={e=>setBudgetForm({...form,allocated:e.target.value})}/></div>
        <div><label>Spent so far (₱)</label><input type="number" placeholder="0" value={form.spent} onChange={e=>setBudgetForm({...form,spent:e.target.value})}/></div>
        <div><label>Note</label><input placeholder="Optional" value={form.note} onChange={e=>setBudgetForm({...form,note:e.target.value})}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {budgets.map(b=>{
          const alloc=Number(b.allocated)||0; const spent=Number(b.spent)||0;
          const pct=alloc>0?Math.min(100,Math.round((spent/alloc)*100)):0;
          const c=pct>=90?"#E07B7B":pct>=60?"#E0B07B":"#7BE0B0";
          return (
            <div key={b.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"18px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,marginBottom:2}}>{b.category}</div>{b.note&&<div style={{color:"#9A9080",fontSize:".82rem"}}>{b.note}</div>}</div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:".7rem",color:"#9A9080",fontFamily:"'Tenor Sans',sans-serif"}}>SPENT / ALLOCATED</div>
                    <div style={{fontWeight:700,color:c}}>₱{spent.toLocaleString()} / ₱{alloc.toLocaleString()}</div>
                  </div>
                  <input type="number" placeholder="Update spent" onBlur={e=>e.target.value&&updateSpent(b,e.target.value)}
                    style={{width:110,padding:"6px 10px",background:"#12121A",border:"1px solid #22223A",color:"#F0EAD6",fontSize:".82rem"}}/>
                  <button onClick={()=>setConfirmId(b.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".82rem"}}>Remove</button>
                </div>
              </div>
              <div style={{background:"#22223A",height:8,borderRadius:4,marginBottom:6}}>
                <div style={{background:c,height:8,borderRadius:4,width:`${pct}%`,transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"#9A9080"}}>
                <span style={{color:c}}>{pct}% used</span>
                <span>Remaining: <span style={{color:"#7BE0B0",fontWeight:600}}>₱{(alloc-spent).toLocaleString()}</span></span>
              </div>
            </div>
          );
        })}
        {budgets.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No budget allocations yet. Click "+ Add Budget" to start tracking.</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function UpcomingEventsPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({title:"",date:"",time:"",event_type:"worship"});
  const typeColor = t=>t==="worship"?"#C9A84C":t==="prayer"?"#B07BE0":t==="youth"?"#7BE0B0":t==="event"?"#7B9EF0":t==="devotion"?"#E0B07B":"#9A9080";
  const typeIcon  = t=>t==="worship"?"✝️":t==="prayer"?"🙏":t==="youth"?"🌟":t==="event"?"🎉":t==="devotion"?"📖":"📅";

  useEffect(()=>{
    dbGet("announcements","?author=eq.__upcoming__&order=created_at.asc")
      .then(d=>{if(d)setEvents(d);setLoading(false);});
  },[]);

  const add = async () => {
    if(!form.title||!form.date) return;
    const payload = {
      title: form.title,
      body: JSON.stringify({date:form.date, time:form.time, event_type:form.event_type}),
      author: "__upcoming__",
    };
    const r = await dbInsert("announcements", payload);
    if(r&&r[0]){
      setEvents([...events, {...r[0], _date:form.date, _time:form.time, _evtype:form.event_type}]);
      addLog("📅","Upcoming event added: "+form.title,"Events Dept","Events Dept");
    }
    setForm({title:"",date:"",time:"",event_type:"worship"});setAdding(false);
  };

  const remove = async(id)=>{await dbDelete("announcements",id);setEvents(events.filter(x=>x.id!==id));};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📅 Upcoming Events</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Event"}</button>
      </div>
      {adding&&(
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:20,marginBottom:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          <div><label>Title</label><input placeholder="Event name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label>Date</label><input placeholder="Apr 13" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
          <div><label>Time</label><input placeholder="9:00 AM" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
          <div><label>Type</label><select value={form.event_type} onChange={e=>setForm({...form,event_type:e.target.value})}>{["worship","prayer","youth","event","devotion"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
        </div>
      )}
      {loading?<div style={{color:"#9A9080",padding:32,textAlign:"center"}}>Loading...</div>:(
      <>
        {events.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:40}}>No upcoming events yet. Click "+ Add Event" to add one.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {events.map(e=>{
            let _parsed={};try{_parsed=JSON.parse(e.body||"{}");}catch{}
            const evType = _parsed.event_type||"event";
            const evDate = e._date||_parsed.date||"";
            const evTime = e._time||_parsed.time||"";
            const c = typeColor(evType);
            const parts = evDate.split(" ");
            return (
              <div key={e.id} style={{background:"#1A1A28",borderLeft:`3px solid ${c}`,padding:"18px 24px",display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",transition:"all .2s",cursor:"default"}}
                onMouseEnter={ev=>{ev.currentTarget.style.background="#22223A";ev.currentTarget.style.transform="translateY(-3px)";ev.currentTarget.style.boxShadow=`0 12px 32px ${c}25`;}}
                onMouseLeave={ev=>{ev.currentTarget.style.background="#1A1A28";ev.currentTarget.style.transform="translateY(0)";ev.currentTarget.style.boxShadow="none";}}>
                <div style={{textAlign:"center",minWidth:56,flexShrink:0}}>
                  <div className="font-sans" style={{fontSize:".6rem",color:c,letterSpacing:".15em",textTransform:"uppercase"}}>{(parts[0]||"").toUpperCase()}</div>
                  <div className="font-display" style={{fontSize:"1.8rem",lineHeight:1,color:"#F0EAD6"}}>{parts[1]||""}</div>
                </div>
                <div style={{fontSize:"1.3rem"}}>{typeIcon(evType)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:"1rem",marginBottom:2}}>{e.title}</div>
                  <div style={{color:"#9A9080",fontSize:".85rem"}}>{evTime}</div>
                </div>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{padding:"3px 12px",fontSize:".68rem",background:`${c}18`,color:c,border:`1px solid ${c}40`,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase"}}>{evType}</div>
                  <button onClick={()=>setConfirmId(e.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".82rem"}}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        {events.length>0&&<div style={{marginTop:12,color:"#9A9080",fontSize:".8rem",textAlign:"right",fontFamily:"'Tenor Sans',sans-serif"}}>{events.length} event{events.length!==1?"s":""} scheduled</div>}
      </>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function EventsPanel({viewOnly=false}) {
  const [events,setEvents]=useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form,setForm]=useState({date:"",title:"",time:"",type:"worship"});
  const [adding,setAdding]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{dbGet("events","?order=created_at.desc").then(d=>{if(d)setEvents(d);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.date||!form.title)return;
    const r=await dbInsert("events",form);
    if(r&&r[0]){setEvents([r[0],...events]);addLog("📅","New event: "+form.title+" on "+form.date,"Events Dept","Events Dept");}
    setForm({date:"",title:"",time:"",type:"worship"});setAdding(false);
  };
  const remove=async(id)=>{await dbDelete("events",id);setEvents(events.filter(x=>x.id!==id));};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>🗓 {viewOnly?"View Events":"Manage Events"}</h4>
        {!viewOnly&&<button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Event"}</button>}
      </div>
      {!viewOnly&&adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
        <div><label>Date</label><input placeholder="Apr 13" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
        <div><label>Title</label><input placeholder="Event name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
        <div><label>Time</label><input placeholder="9:00 AM" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
        <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["worship","prayer","youth","event","devotion"].map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading events...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {events.map(e=>(
          <div key={e.id} className={`card ev-${e.type}`} style={{background:"#1A1A28",borderLeft:"3px solid",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <div style={{textAlign:"center",minWidth:60}}>
                <div className="font-sans" style={{fontSize:".65rem",color:"#C9A84C",letterSpacing:".1em"}}>{(e.date||"").split(" ")[0]?.toUpperCase()}</div>
                <div className="font-display" style={{fontSize:"1.5rem"}}>{(e.date||"").split(" ")[1]}</div>
              </div>
              <div><div style={{fontWeight:600,marginBottom:2}}>{e.title}</div><div style={{color:"#9A9080",fontSize:".85rem"}}>{e.time}</div></div>
            </div>
            {!viewOnly&&<button onClick={()=>setConfirmId(e.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>}
          </div>
        ))}
        {events.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No events yet. Add one!</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function AnnouncementsPanel({canPost=false}) {
  const [posts,setPosts]=useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form,setForm]=useState({title:"",body:""});
  const [adding,setAdding]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{dbGet("announcements","?author=neq.__upcoming__&order=created_at.desc").then(d=>{if(d)setPosts(d);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.title||!form.body)return;
    const r=await dbInsert("announcements",{...form,author:"Staff"});
    if(r&&r[0]){setPosts([r[0],...posts]);addLog("📢","Announcement posted: "+form.title,"Secretary","Secretary");}
    setForm({title:"",body:""});setAdding(false);
  };
  const remove=async(id)=>{await dbDelete("announcements",id);setPosts(posts.filter(x=>x.id!==id));};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📢 Announcements</h4>
        {canPost&&<button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Post Announcement"}</button>}
      </div>
      {canPost&&adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:12}}>
        <div><label>Title</label><input placeholder="Announcement title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
        <div><label>Message</label><textarea rows={4} placeholder="Write your announcement..." value={form.body} onChange={e=>setForm({...form,body:e.target.value})} style={{resize:"vertical"}}/></div>
        <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add}>Post</button>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {posts.map(p=>(
          <div key={p.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div>
                <h5 style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>{p.title}</h5>
                <p style={{color:"#B0A898",lineHeight:1.7,fontSize:".95rem"}}>{p.body}</p>
                <div style={{marginTop:12,color:"#9A9080",fontSize:".8rem"}}>Posted {new Date(p.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})} · by {p.author}</div>
              </div>
              {canPost&&<button onClick={()=>setConfirmId(p.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",flexShrink:0}}>Delete</button>}
            </div>
          </div>
        ))}
        {posts.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No announcements yet.</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function DocumentsPanel({user}) {
  const [docs,setDocs]=useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form,setForm]=useState({name:"",type:"Meeting Minutes"});
  const [file,setFile]=useState(null);
  const [fileData,setFileData]=useState(null);
  const [adding,setAdding]=useState(false);
  const [loading,setLoading]=useState(true);
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{dbGet("documents","?order=created_at.desc").then(d=>{if(d)setDocs(d.filter(x=>x.type!=="Budget"));setLoading(false);});},[]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);
    if(!form.name) setForm(prev=>({...prev,name:f.name}));
    const reader = new FileReader();
    reader.onload = (ev) => setFileData(ev.target.result);
    reader.readAsDataURL(f);
  };

  const add = async () => {
    if(!form.name) return;
    setUploading(true);
    const uploader = user?.username || user?.role || "Staff";
    const payload = {name:form.name, type:form.type, uploaded_by:uploader, ...(fileData?{file_url:fileData}:{})};
    const r = await dbInsert("documents", payload);
    if(r&&r[0]){
      setDocs([r[0],...docs]);
      addLog("📄","Document uploaded: "+form.name+" ("+form.type+")",user?.role||"Secretary",uploader);
    }
    setForm({name:"",type:"Meeting Minutes"});
    setFile(null);setFileData(null);setAdding(false);setUploading(false);
  };

  const remove=async(id)=>{await dbDelete("documents",id);setDocs(docs.filter(x=>x.id!==id));};
  const icon=(t)=>t==="Meeting Minutes"?"📝":t==="Member Records"?"👥":t==="Financial Report"?"💰":t==="Event Program"?"🎉":t==="Announcement"?"📢":"📄";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📁 Upload Documents</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Upload Document"}</button>
      </div>
      {adding&&(
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label>Document Name</label><input placeholder="e.g. March Minutes" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div><label>Document Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {["Meeting Minutes","Member Records","Event Program","Announcement","Financial Report","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <label style={{display:"block",cursor:"pointer"}}>
            <div style={{border:"2px dashed "+(file?"#C9A84C":"#22223A"),padding:32,textAlign:"center",color:file?"#E8CC7A":"#9A9080",fontSize:".9rem",background:file?"rgba(201,168,76,.05)":"transparent",transition:"all .2s"}}
              onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#C9A84C";}}
              onDragLeave={e=>{e.currentTarget.style.borderColor=file?"#C9A84C":"#22223A";}}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const fakeEv={target:{files:[f]}};handleFile(fakeEv);}}}>
              {file
                ? <><div style={{fontSize:32,marginBottom:8}}>📎</div><div style={{fontWeight:600}}>{file.name}</div><div style={{fontSize:".8rem",marginTop:4,color:"#9A9080"}}>{(file.size/1024).toFixed(1)} KB · Click to change</div></>
                : <><div style={{fontSize:32,marginBottom:8}}>📂</div><div>Click to choose file or drag & drop</div><div style={{fontSize:".8rem",marginTop:4}}>PDF, DOC, XLSX, JPG, PNG supported</div></>}
            </div>
            <input type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.txt" onChange={handleFile} style={{display:"none"}}/>
          </label>
          <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add} disabled={uploading}>
            {uploading?"Saving...":"Save Document"}
          </button>
        </div>
      )}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading documents...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {docs.map(d=>(
          <div key={d.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#22223A";e.currentTarget.style.borderColor="#C9A84C33";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(201,168,76,.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1A1A28";e.currentTarget.style.borderColor="#22223A";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{width:44,height:44,background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon(d.type)}</div>
              <div>
                <div style={{fontWeight:600,marginBottom:2}}>{d.name}</div>
                <div style={{color:"#9A9080",fontSize:".8rem"}}>{d.type} · Uploaded {new Date(d.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})} by {d.uploaded_by}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {d.file_url&&<a href={d.file_url} download={d.name} style={{color:"#C9A84C",fontSize:".8rem",textDecoration:"none",fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".05em"}}>⬇ Download</a>}
              <button onClick={()=>setConfirmId(d.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Delete</button>
            </div>
          </div>
        ))}
        {docs.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No documents yet.</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}
function AttendancePanel() {
  const allMembers=["Kuya Ivan","Ange","Angie","Ced","Precious","Jam","Pipper","Tine","Krislene","Ariane"];
  const [logs,setLogs]=useState([]);
  const [active,setActive]=useState(false);
  const [present,setPresent]=useState([]);
  const [dateStr,setDateStr]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{dbGet("attendance","?order=created_at.desc").then(d=>{if(d)setLogs(d.map(x=>({...x,present:x.note?JSON.parse(x.note):[]})));setLoading(false);});},[]);
  const toggle=(name)=>setPresent(p=>p.includes(name)?p.filter(x=>x!==name):[...p,name]);
  const save=async()=>{
    if(!dateStr)return;
    const r=await dbInsert("attendance",{date:dateStr,present:present.length,total:allMembers.length,note:JSON.stringify(present)});
    if(r&&r[0]){setLogs([{...r[0],present},...logs]);addLog("✅","Attendance recorded — "+present.length+"/"+allMembers.length+" present","Secretary","Secretary");}
    setActive(false);setPresent([]);setDateStr("");
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>✅ Attendance Monitoring</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setActive(!active)}>{active?"Cancel":"+ New Attendance"}</button>
      </div>
      {active&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24}}>
        <div style={{marginBottom:16}}><label>Date / Session</label><input placeholder="e.g. Mar 9 (Sunday)" value={dateStr} onChange={e=>setDateStr(e.target.value)} style={{maxWidth:280}}/></div>
        <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".1em",color:"#9A9080",marginBottom:12,textTransform:"uppercase"}}>Mark Present:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
          {allMembers.map(name=>(
            <div key={name} onClick={()=>toggle(name)} style={{padding:"8px 16px",cursor:"pointer",border:`1px solid ${present.includes(name)?"#7BE0B0":"#22223A"}`,background:present.includes(name)?"rgba(123,224,176,.1)":"transparent",color:present.includes(name)?"#7BE0B0":"#9A9080",transition:"all .2s",fontSize:".9rem"}}>
              {present.includes(name)?"✓ ":""}{name}
            </div>
          ))}
        </div>
        <div style={{color:"#9A9080",fontSize:".85rem",marginBottom:16}}>Present: {present.length} / {allMembers.length}</div>
        <button className="btnGold" style={{padding:"10px 24px",fontSize:".75rem"}} onClick={save}>Save Attendance</button>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading attendance...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {logs.map(l=>(
          <div key={l.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:12}}>
              <div><div style={{fontWeight:600,marginBottom:4}}>{l.date}</div><div style={{color:"#9A9080",fontSize:".85rem"}}>Present: {l.present_count||l.present} / {l.total}</div></div>
              <div style={{padding:"4px 14px",background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",color:"#7BE0B0",fontSize:".8rem"}}>{Math.round(((l.present_count||l.present)/l.total)*100)}% attendance</div>
            </div>
            {Array.isArray(l.present)&&l.present.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {l.present.map(name=><span key={name} style={{padding:"3px 10px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.2)",color:"#C9A84C",fontSize:".8rem"}}>{name}</span>)}
              </div>
            )}
          </div>
        ))}
        {logs.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No attendance records yet.</div>}
      </div>)}
    </div>
  );
}

function SongsPanel() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [form, setForm] = useState({title:"", author:"", category:"Praise", youtube:""});
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    dbGet("songs","?order=created_at.asc").then(d=>{if(d)setSongs(d);setLoading(false);});
  },[]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const catColor = (c) => c==="Praise"?"#C9A84C":c==="Worship"?"#B07BE0":c==="Hymn"?"#7B9EF0":c==="Special"?"#E07B7B":"#9A9080";
  const cats = ["All","Praise","Worship","Hymn","Special"];
  const filtered = filter==="All" ? songs : songs.filter(s=>s.category===filter);
  const cur = playing!==null ? filtered[playing] : null;
  const vid = cur ? getYouTubeId(cur.youtube) : null;

  const addSong = async () => {
    if(!form.title)return;
    const r = await dbInsert("songs", form);
    if(r&&r[0]){setSongs([...songs,r[0]]);addLog("🎵","Song added: \""+form.title+"\" by "+(form.author||"Unknown"),"Performance","Performance Dept");}
    setForm({title:"", author:"", category:"Praise", youtube:""});
    setAdding(false);
  };

  const deleteSong = async (songId, idx) => {
    await dbDelete("songs", songId);
    const newSongs = songs.filter(s=>s.id!==songId);
    setSongs(newSongs);
    if(playing!==null){
      const actualFiltered = filter==="All"?songs:songs.filter(s=>s.category===filter);
      const deletedSong = actualFiltered[idx];
      if(playing===idx) setPlaying(null);
      else if(playing>idx) setPlaying(playing-1);
    }
  };

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:8}}>🎵 Song List & Music Player</h4>
      <p style={{color:"#9A9080",marginBottom:20,fontSize:".9rem"}}>Manage and play worship songs for rehearsal and service.</p>

      {cur && (
        <div style={{background:"#12121A",border:"1px solid #B07BE0",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#B07BE0,transparent)"}}/>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div>
              <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".12em",color:"#B07BE0",marginBottom:4}}>▶ NOW PLAYING</div>
              <div style={{fontWeight:700}}>{cur.title}</div>
              <div style={{color:"#9A9080",fontSize:".85rem"}}>{cur.author}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setPlaying(playing>0?playing-1:filtered.length-1)} style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:36,height:36,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⏮</button>
              <button onClick={()=>setPlaying(null)} style={{background:"rgba(224,123,123,.15)",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",width:36,height:36,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⏹</button>
              <button onClick={()=>setPlaying(playing<filtered.length-1?playing+1:0)} style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:36,height:36,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>⏭</button>
            </div>
          </div>
          {vid ? (
            <div style={{position:"relative",paddingBottom:"42%",background:"#000"}}>
              <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
            </div>
          ):(
            <div style={{padding:"24px",textAlign:"center",color:"#9A9080",background:"#0A0A0F"}}>🎵 No YouTube link for this song.</div>
          )}
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>{setFilter(c);setPlaying(null);}} style={{padding:"5px 14px",background:filter===c?catColor(c):"transparent",border:`1px solid ${filter===c?catColor(c):"#22223A"}`,color:filter===c?"#0A0A0F":catColor(c),cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".72rem",letterSpacing:".08em",transition:"all .2s"}}>{c}</button>
          ))}
        </div>
        <button className="btnGold" style={{padding:"8px 18px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Song"}</button>
      </div>

      {adding&&(
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:20,marginBottom:16,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          <div><label>Song Title</label><input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label>Author / Team</label><input placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></div>
          <div><label>Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {["Praise","Worship","Hymn","Special"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label>YouTube Link</label><input placeholder="https://youtube.com/watch?v=..." value={form.youtube} onChange={e=>setForm({...form,youtube:e.target.value})}/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={addSong}>Add Song</button></div>
        </div>
      )}

      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading songs...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((s,i)=>{
          const ip=playing===i;
          const sv=getYouTubeId(s.youtube);
          return(
            <div key={s.id||i} style={{background:ip?"#1E1A2E":"#12121A",border:`1px solid ${ip?"#B07BE0":"#22223A"}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:14,transition:"all .2s"}}>
              <div onClick={()=>setPlaying(ip?null:i)} style={{width:40,height:40,borderRadius:"50%",background:ip?"#B07BE0":"rgba(176,123,224,.15)",border:`1px solid ${ip?"#B07BE0":"rgba(176,123,224,.4)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,color:ip?"#0A0A0F":"#B07BE0",cursor:"pointer",transition:"all .2s"}}>{ip?"⏸":"▶"}</div>
              <div onClick={()=>setPlaying(ip?null:i)} style={{flex:1,minWidth:0,cursor:"pointer"}}>
                <div style={{fontWeight:600,marginBottom:2,color:ip?"#E8CC7A":"#F0EAD6"}}>{s.title}</div>
                <div style={{color:"#9A9080",fontSize:".82rem"}}>{s.author}</div>
              </div>
              <span style={{padding:"2px 8px",background:`${catColor(s.category)}15`,border:`1px solid ${catColor(s.category)}40`,color:catColor(s.category),fontSize:".68rem",fontFamily:"'Tenor Sans',sans-serif",flexShrink:0}}>{s.category}</span>
              <span style={{fontSize:11,color:sv?"#E07B7B":"#3A3A50",flexShrink:0}}>{sv?"▶ YT":"—"}</span>
              <button onClick={()=>deleteSong(s.id,i)} style={{background:"none",border:"1px solid rgba(224,123,123,.3)",color:"#E07B7B",cursor:"pointer",padding:"3px 10px",fontSize:".72rem",flexShrink:0,fontFamily:"'Tenor Sans',sans-serif"}}>🗑</button>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#9A9080"}}>No songs yet. Add one!</div>}
      </div>)}
    </div>
  );
}

function DevotionPanel() {
  const [devotions,setDevotions]=useState([]);
  const [confirmId,setConfirmId]=useState(null);
  const [form,setForm]=useState({name:"",book:"",insight:""});
  const [adding,setAdding]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{dbGet("devotions","?order=created_at.desc").then(d=>{if(d)setDevotions(d);setLoading(false);});},[]);
  const add=async()=>{
    if(!form.name||!form.insight)return;
    const r=await dbInsert("devotions",{...form,likes:0});
    if(r&&r[0]){setDevotions([r[0],...devotions]);addLog("📖",form.name+" shared a devotion from "+(form.book||"the Bible"),"Member",form.name);}
    setForm({name:"",book:"",insight:""});setAdding(false);
  };
  const like=async(id,likes)=>{await dbUpdate("devotions",id,{likes:likes+1});setDevotions(devotions.map(x=>x.id===id?{...x,likes:likes+1}:x));};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📖 Monthly Devotion Sharing</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Share Devotion"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label>Your Name</label><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label>Book of the Bible</label><input placeholder="e.g. Psalms" value={form.book} onChange={e=>setForm({...form,book:e.target.value})}/></div>
        </div>
        <div><label>Your Insight / Reflection</label><textarea rows={4} placeholder="Share what God has taught you..." value={form.insight} onChange={e=>setForm({...form,insight:e.target.value})} style={{resize:"vertical"}}/></div>
        <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add}>Share</button>
      </div>)}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading devotions...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {devotions.map(d=>(
          <div key={d.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#7B4FCF,transparent)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap",marginBottom:8}}>
              <div>
                <span style={{fontWeight:600}}>{d.name}</span>
                {d.book&&<span style={{marginLeft:10,padding:"2px 10px",background:"rgba(123,79,207,.1)",border:"1px solid rgba(123,79,207,.3)",color:"#B07BE0",fontSize:".75rem"}}>📖 {d.book}</span>}
              </div>
              <div style={{color:"#9A9080",fontSize:".8rem"}}>{new Date(d.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}</div>
            </div>
            <p style={{color:"#B0A898",lineHeight:1.8,fontStyle:"italic",marginBottom:12}}>"{d.insight}"</p>
            <button onClick={()=>like(d.id,d.likes)} style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem"}}>🙏 Amen ({d.likes})</button>
          </div>
        ))}
        {devotions.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No devotions yet. Be the first to share!</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function GivingHistoryPanel() {
  const [records,setRecords]=useState([]);
  const [giving,setGiving]=useState(false);
  const [form,setForm]=useState({type:"Tithe",amount:"",note:""});
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{dbGet("finance_records","?order=created_at.desc").then(d=>{if(d)setRecords(d);setLoading(false);});},[]);
  const submit=async()=>{
    if(!form.amount)return;
    const r=await dbInsert("finance_records",{name:"Member",type:form.type,amount:Number(form.amount),date:new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric"}),status:"Pending"});
    if(r&&r[0]){setRecords([r[0],...records]);addLog("💸","Member submitted a "+form.type+" offering — ₱"+form.amount,"Member","Member");}
    setForm({type:"Tithe",amount:"",note:""});setOk(true);
    setTimeout(()=>{setOk(false);setGiving(false);},2500);
  };
  const total=records.reduce((s,r)=>s+Number(r.amount),0);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>💝 Giving History</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>{setGiving(!giving);setOk(false);}}>{giving?"Cancel":"💰 Give Now"}</button>
      </div>
      {giving&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:32,marginBottom:32,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
        {ok?(
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>🙏</div>
            <h4 className="font-display" style={{color:"#C9A84C",marginBottom:8}}>Thank You!</h4>
            <p style={{color:"#9A9080"}}>Your offering has been recorded. God bless you!</p>
          </div>
        ):(
          <>
            <h5 className="font-display" style={{color:"#E8CC7A",marginBottom:20,fontSize:".95rem"}}>Submit Your Offering</h5>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:16}}>
              <div><label>Offering Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Tithe","Offering","Mission Fund","Building Fund"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label>Amount (₱)</label><input type="number" placeholder="Enter amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
              <div><label>Note (Optional)</label><input placeholder="e.g. For Easter Sunday" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></div>
            </div>
            <div style={{background:"#12121A",border:"1px solid #22223A",padding:16,marginBottom:20,fontSize:".85rem",color:"#9A9080",lineHeight:1.9}}>
              📱 <span style={{color:"#C9A84C"}}>GCash:</span> JRSMC Fund · 09XX-XXX-XXXX<br/>
              🏦 <span style={{color:"#C9A84C"}}>BDO/BPI:</span> JRSMC Mission · XXXX-XXXX-XXXX<br/>
              <span style={{fontSize:".8rem"}}>Please send payment before confirming.</span>
            </div>
            <button className="btnGold" style={{padding:"12px 28px"}} onClick={submit}>Confirm Offering →</button>
          </>
        )}
      </div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32}}>
        {[{l:"Total Given",v:`₱${total.toLocaleString()}`,c:"#7BE0B0"},{l:"Total Records",v:records.length,c:"#7B9EF0"},{l:"Last Giving",v:records[0]?new Date(records[0].created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"}):"—",c:"#C9A84C"}].map(s=>(
          <div key={s.l} style={{background:"#1A1A28",padding:"20px 24px",borderLeft:`3px solid ${s.c}`}}>
            <div style={{fontSize:".75rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em"}}>{s.l}</div>
            <div className="font-display" style={{fontSize:"1.4rem",color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading...</div>:(
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["Type","Amount","Date"].map(h=><th key={h} className="font-sans" style={{padding:"10px 16px",textAlign:"left",fontSize:".7rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{records.map(r=>(
            <tr key={r.id} style={{borderBottom:"1px solid #1A1A28"}}>
              <td style={{padding:"12px 16px",color:"#9A9080"}}>{r.type}</td>
              <td style={{padding:"12px 16px",color:"#7BE0B0",fontWeight:600}}>₱{Number(r.amount).toLocaleString()}</td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{r.date||new Date(r.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}</td>
            </tr>
          ))}</tbody>
        </table>
        {records.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No giving records yet.</div>}
      </div>)}
    </div>
  );
}

function RehearsalPanel({viewOnly=false}) {
  const [schedules, setSchedules] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({title:"",date:"",time:"",venue:"",status:"Confirmed"});
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{dbGet("rehearsals","?order=created_at.desc").then(d=>{setSchedules(d||[]);setLoading(false);});},[]);
  const add = async () => {
    if(!form.title||!form.date) return;
    const r = await dbInsert("rehearsals", form);
    if(r&&r[0]){setSchedules([r[0],...schedules]);addLog("🎭","Rehearsal scheduled: \""+form.title+"\" on "+form.date,"Performance","Performance Dept");}
    setForm({title:"",date:"",time:"",venue:"",status:"Confirmed"});
    setAdding(false);
  };
  const remove = async(id)=>{await dbDelete("rehearsals",id);setSchedules(schedules.filter(x=>x.id!==id));};
  const statusColor = (s) => s==="Confirmed" ? "#7BE0B0" : s==="Tentative" ? "#E0B07B" : "#E07B7B";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>🎭 Rehearsal Schedule</h4>
        {!viewOnly&&<button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Schedule"}</button>}
      </div>
      {!viewOnly&&adding && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          <div><label>Title</label><input placeholder="Rehearsal name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label>Date</label><input placeholder="Mar 15 (Sat)" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
          <div><label>Time</label><input placeholder="3:00 PM" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div>
          <div><label>Venue</label><input placeholder="Main Hall" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/></div>
          <div><label>Status</label>
            <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              {["Confirmed","Tentative","Cancelled"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button>
          </div>
        </div>
      )}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading schedules...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {schedules.map(s=>(
          <div key={s.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${statusColor(s.status)},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                  <h5 style={{fontWeight:700,fontSize:"1rem"}}>{s.title}</h5>
                  <span style={{padding:"2px 10px",background:`${statusColor(s.status)}15`,border:`1px solid ${statusColor(s.status)}50`,color:statusColor(s.status),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>{s.status}</span>
                </div>
                <div style={{display:"flex",gap:20,flexWrap:"wrap",color:"#9A9080",fontSize:".9rem"}}>
                  <span>📅 {s.date}</span>
                  <span>🕐 {s.time}</span>
                  {s.venue && <span>📍 {s.venue}</span>}
                </div>
              </div>
              {!viewOnly&&<button onClick={()=>setConfirmId(s.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem",flexShrink:0}}>Remove</button>}
            </div>
          </div>
        ))}
        {schedules.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No rehearsals scheduled yet.</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

// ── PRACTICE MATERIALS PANEL ─────────────────────────────────────────────────
function PracticePanel({viewOnly=false}) {
  const [materials, setMaterials] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({title:"",type:"Song List",notes:""});
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{dbGet("practice_materials","?order=created_at.desc").then(d=>{setMaterials(d||[]);setLoading(false);});},[]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);
    if(!form.title) setForm(prev=>({...prev,title:f.name}));
    const reader = new FileReader();
    reader.onload = (ev) => setFileData(ev.target.result);
    reader.readAsDataURL(f);
  };

  const add = async () => {
    if(!form.title) return;
    setUploading(true);
    const payload = {...form, uploaded_by:"Performance Dept", ...(fileData?{file_url:fileData, file:file?.name}:{})};
    const r = await dbInsert("practice_materials", payload);
    if(r&&r[0]){setMaterials([r[0],...materials]);addLog("📚","Practice material: \""+form.title+"\" ("+form.type+")","Performance","Performance Dept");}
    setForm({title:"",type:"Song List",notes:""});
    setFile(null);setFileData(null);setAdding(false);setUploading(false);
  };

  const remove = async(id)=>{await dbDelete("practice_materials",id);setMaterials(materials.filter(x=>x.id!==id));};
  const typeIcon = (t) => t==="Song List"?"🎵":t==="Chords Sheet"?"🎸":t==="Script"?"📋":t==="Guide"?"📖":"📄";
  const typeColor = (t) => t==="Song List"?"#B07BE0":t==="Chords Sheet"?"#7BE0B0":t==="Script"?"#E0B07B":t==="Guide"?"#7B9EF0":"#C9A84C";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📚 Practice Materials</h4>
        {!viewOnly&&<button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Upload Material"}</button>}
      </div>
      {!viewOnly&&adding && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            <div><label>Title</label><input placeholder="Material title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div><label>Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {["Song List","Chords Sheet","Script","Guide","Video Link","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label>Notes</label><input placeholder="Additional notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          {/* File Upload */}
          <label style={{display:"block",cursor:"pointer"}}>
            <div style={{border:"2px dashed "+(file?"#B07BE0":"#22223A"),padding:28,textAlign:"center",color:file?"#E8CC7A":"#9A9080",fontSize:".9rem",background:file?"rgba(176,123,224,.05)":"transparent",transition:"all .2s"}}
              onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#B07BE0";}}
              onDragLeave={e=>{e.currentTarget.style.borderColor=file?"#B07BE0":"#22223A";}}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){handleFile({target:{files:[f]}});}}}>
              {file
                ? <><div style={{fontSize:28,marginBottom:6}}>📎</div><div style={{fontWeight:600}}>{file.name}</div><div style={{fontSize:".8rem",marginTop:4,color:"#9A9080"}}>{(file.size/1024).toFixed(1)} KB · Click to change</div></>
                : <><div style={{fontSize:28,marginBottom:6}}>📂</div><div>Click to attach file or drag & drop</div><div style={{fontSize:".8rem",marginTop:4}}>PDF, DOC, MP3, MP4, JPG supported</div></>}
            </div>
            <input type="file" accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.jpeg,.png,.txt,.pptx" onChange={handleFile} style={{display:"none"}}/>
          </label>
          <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add} disabled={uploading}>
            {uploading?"Saving...":"Save Material"}
          </button>
        </div>
      )}
      {loading?<div style={{color:"#9A9080",padding:24,textAlign:"center"}}>Loading materials...</div>:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {materials.map(m=>(
          <div key={m.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#22223A";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(176,123,224,.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1A1A28";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",flex:1}}>
              <div style={{width:44,height:44,background:`${typeColor(m.type)}15`,border:`1px solid ${typeColor(m.type)}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{typeIcon(m.type)}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <div style={{fontWeight:700,fontSize:".95rem"}}>{m.title}</div>
                  <span style={{padding:"2px 8px",background:`${typeColor(m.type)}15`,border:`1px solid ${typeColor(m.type)}40`,color:typeColor(m.type),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>{m.type}</span>
                </div>
                {m.file&&<div style={{color:"#C9A84C",fontSize:".85rem",marginBottom:4}}>📎 {m.file}</div>}
                {m.notes&&<div style={{color:"#9A9080",fontSize:".85rem",marginBottom:4}}>{m.notes}</div>}
                <div style={{color:"#9A9080",fontSize:".8rem"}}>Uploaded {new Date(m.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric"})} by {m.uploaded_by}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center",flexShrink:0}}>
              {m.file_url&&<a href={m.file_url} download={m.file||m.title} style={{color:"#B07BE0",fontSize:".8rem",textDecoration:"none",fontFamily:"'Tenor Sans',sans-serif"}}>⬇ Download</a>}
              {!viewOnly&&<button onClick={()=>setConfirmId(m.id)} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>}
            </div>
          </div>
        ))}
        {materials.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:32}}>No practice materials yet. Click "+ Upload Material" to add one.</div>}
      </div>)}
      {confirmId&&<ConfirmDialog onConfirm={()=>{remove(confirmId);setConfirmId(null);}} onCancel={()=>setConfirmId(null)}/>}
    </div>


  );
}
function DashboardOverviewPanel() {
  const [prayers, setPrayers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("log");
  const [stats, setStats] = useState({members:0, activeMembers:0, verifiedTotal:0, pendingTotal:0, events:0, nextEvent:"—", attendance:"—", attendanceDate:"—", songs:0, prayers:0, pubPrayers:0, confPrayers:0});

  const fetchData = async () => {
    const [members, finance, events, attendance, songs, prayerData, logData] = await Promise.all([
      dbGet("members","?order=created_at.asc"),
      dbGet("finance_records","?order=created_at.desc"),
      dbGet("events","?order=created_at.asc"),
      dbGet("attendance","?order=created_at.desc&limit=1"),
      dbGet("songs","?order=created_at.asc"),
      dbGet("prayer_requests","?order=created_at.desc"),
      dbGet("activity_log","?order=created_at.desc&limit=30"),
    ]);
    const mList = members||[];
    const fList = finance||[];
    const eList = events||[];
    const aList = attendance||[];
    const sList = songs||[];
    const pList = prayerData||[];
    if(logData) setLogs(logData);
    if(pList) setPrayers(pList);
    const verified = fList.filter(r=>r.status==="Verified").reduce((s,r)=>s+Number(r.amount),0);
    const pending = fList.filter(r=>r.status==="Pending").reduce((s,r)=>s+Number(r.amount),0);
    const lastAtt = aList[0];
    const nextEv = eList[0];
    setStats({
      members: mList.length,
      activeMembers: mList.filter(m=>m.status==="Active").length,
      verifiedTotal: verified,
      pendingTotal: pending,
      events: eList.length,
      nextEvent: nextEv ? (nextEv.date||"Soon") : "None yet",
      attendance: lastAtt ? `${lastAtt.present}/${lastAtt.total}` : "—",
      attendanceDate: lastAtt ? lastAtt.date : "No record",
      songs: sList.length,
      prayers: pList.length,
      pubPrayers: pList.filter(p=>!p.conf).length,
      confPrayers: pList.filter(p=>p.conf).length,
    });
  };

  useEffect(()=>{
    fetchData();
    const t = setInterval(fetchData, 5000);
    const onPrayerUpdate = () => fetchData();
    window.addEventListener("prayerUpdate", onPrayerUpdate);
    return ()=>{ clearInterval(t); window.removeEventListener("prayerUpdate", onPrayerUpdate); };
  },[]);

  const statCards = [
    {icon:"👥", label:"Total Members",    value:stats.members,                       color:"#B07BE0", sub:`${stats.activeMembers} active`},
    {icon:"💰", label:"March Offerings",  value:`₱${stats.verifiedTotal.toLocaleString()}`, color:"#C9A84C", sub:`Pending: ₱${stats.pendingTotal.toLocaleString()}`},
    {icon:"🗓", label:"Upcoming Events",  value:stats.events,                        color:"#E07B7B", sub:`Next: ${stats.nextEvent}`},
    {icon:"🙏", label:"Prayer Requests",  value:stats.prayers,                       color:"#7B9EF0", sub:`${stats.pubPrayers} public · ${stats.confPrayers} confidential`},
    {icon:"✅", label:"Last Attendance",  value:stats.attendance,                    color:"#7BE0B0", sub:stats.attendanceDate},
    {icon:"🎵", label:"Songs in List",    value:stats.songs,                         color:"#E0B07B", sub:"Performance Dept"},
  ];

  const roleColor = (r) =>
    r==="Head"?"#C9A84C":r==="Treasurer"?"#7BE0B0":r==="Financial"?"#7B9EF0":
    r==="Events Dept"?"#E07B7B":r==="Secretary"?"#E0B07B":r==="Performance"?"#B07BE0":"#9A9080";

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:8}}>📊 Dashboard Overview</h4>
      <p style={{color:"#9A9080",marginBottom:28,fontSize:".95rem"}}>Church summary at a glance — March 2026.</p>

      <div className="g3" style={{marginBottom:32}}>
        {statCards.map(s=>(
          <div key={s.label} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"22px 24px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.color},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:".75rem",color:s.color,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
                <div className="font-display" style={{fontSize:"2rem",color:s.color,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:".8rem",color:"#9A9080"}}>{s.sub}</div>
              </div>
              <div style={{fontSize:32,opacity:.6}}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:0,marginBottom:0,borderBottom:"1px solid #22223A"}}>
        {[["log","📋 Activity Log"],["prayers","🙏 Prayer Requests"]].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{padding:"12px 24px",background:"none",border:"none",borderBottom:tab===k?"2px solid #C9A84C":"2px solid transparent",color:tab===k?"#E8CC7A":"#9A9080",cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".8rem",letterSpacing:".08em",transition:"all .2s",marginBottom:"-1px"}}>
            {lbl}
            {k==="prayers" && prayers.length > 0 && (
              <span className="aPulse" style={{marginLeft:8,background:"#B07BE0",color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:".65rem",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{prayers.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab==="log" && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",borderTop:"none",padding:28,position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".12em",color:"#C9A84C",textTransform:"uppercase"}}>Recent Activity</div>
            <span style={{fontSize:".8rem",color:"#9A9080"}}>{logs.length} entries</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {logs.slice(0,15).map((r,i)=>(
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"11px 0",borderBottom:i<Math.min(logs.length,15)-1?"1px solid #22223A":"none"}}>
                <div style={{width:34,height:34,background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{r.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:".9rem",color:"#F0EAD6",marginBottom:3}}>{r.msg}</div>
                  <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap",alignItems:"center"}}>
                    {r.username && <span style={{padding:"1px 8px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",color:"#E8CC7A",fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>👤 {r.username}</span>}
                    <span style={{padding:"1px 8px",background:`${roleColor(r.role)}15`,border:`1px solid ${roleColor(r.role)}40`,color:roleColor(r.role),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>{r.role}</span>
                  </div>
                </div>
                <div style={{fontSize:".78rem",color:"#9A9080",flexShrink:0,textAlign:"right"}}>{r.created_at ? new Date(r.created_at).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}</div>
              </div>
            ))}
            {logs.length===0&&<div style={{color:"#9A9080",textAlign:"center",padding:24}}>No activity yet.</div>}
          </div>
        </div>
      )}

      {tab==="prayers" && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",borderTop:"none",padding:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".12em",color:"#B07BE0",textTransform:"uppercase"}}>All Prayer Requests</div>
            <span style={{fontSize:".8rem",color:"#9A9080"}}>{prayers.length} total</span>
          </div>
          {prayers.length===0 && <div style={{textAlign:"center",padding:"32px 0",color:"#9A9080"}}>No prayer requests yet.</div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {prayers.map((p,i)=>(
              <div key={p.id||i} style={{background:"#12121A",border:`1px solid ${p.conf?"rgba(176,123,224,.3)":"#22223A"}`,padding:"16px 20px",position:"relative"}}>
                {p.conf && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#B07BE0,transparent)"}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontWeight:700,color:p.conf?"#B07BE0":"#E8CC7A"}}>{p.name}</span>
                    {p.conf && <span style={{padding:"2px 8px",background:"rgba(176,123,224,.1)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>🔒 Confidential</span>}
                  </div>
                  <span style={{fontSize:".8rem",color:"#9A9080"}}>{p.created_at ? new Date(p.created_at).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}</span>
                </div>
                <div style={{color:"#B0A898",fontSize:".95rem",lineHeight:1.7}}>{p.req}</div>
                <div style={{display:"flex",gap:12,marginTop:12}}>
                  <button onClick={async()=>{await dbDelete("prayer_requests",p.id);setPrayers(prayers.filter(x=>x.id!==p.id));}} style={{background:"none",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",cursor:"pointer",padding:"4px 12px",fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif"}}>✓ Mark Prayed</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── EXPORT REPORTS PANEL ─────────────────────────────────────────────────────
function ExportPanel() {
  const [data, setData] = useState({members:[],finance:[],attendance:[],events:[],budgets:[]});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([
      dbGet("members","?order=created_at.asc"),
      dbGet("finance_records","?order=created_at.desc"),
      dbGet("attendance","?order=created_at.desc"),
      dbGet("events","?order=created_at.asc"),
      dbGet("documents","?order=created_at.desc"),
    ]).then(([m,f,a,e,d])=>{
      const budgets = (d||[]).filter(x=>x.type==="Budget").map(x=>{
        try{ const p=JSON.parse(x.name||"{}"); return{...x,...p}; }catch{return x;}
      });
      setData({members:m||[],finance:f||[],attendance:a||[],events:e||[],budgets});
      setLoading(false);
    });
  },[]);

  const toCSV = (rows, cols) => {
    const header = cols.map(c=>c.label).join(",");
    const body = rows.map(r=>cols.map(c=>`"${(r[c.key]||"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    return header+"\n"+body;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = (title, rows, cols) => {
    const html = `<html><head><title>${title}</title><style>
      body{font-family:Arial,sans-serif;padding:24px;color:#222}
      h2{color:#333;margin-bottom:4px}p{color:#666;margin-bottom:16px;font-size:13px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th{background:#222;color:#fff;padding:10px 12px;text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
      td{padding:9px 12px;border-bottom:1px solid #eee}tr:nth-child(even) td{background:#f9f9f9}
      .footer{margin-top:24px;font-size:11px;color:#999}
    </style></head><body>
      <h2>${title}</h2><p>Jesus The Rock of Our Salvation Mission Church · Generated ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</p>
      <table><thead><tr>${cols.map(c=>`<th>${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${r[c.key]||"—"}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <div class="footer">Total records: ${rows.length}</div>
    </body></html>`;
    const w = window.open("","_blank"); w.document.write(html); w.document.close(); w.print();
  };

  const active = data.members.filter(m=>m.status==="Active").length;
  const inactive = data.members.length - active;
  const verified = data.finance.filter(r=>r.status==="Verified").reduce((s,r)=>s+Number(r.amount),0);
  const pending = data.finance.filter(r=>r.status==="Pending").reduce((s,r)=>s+Number(r.amount),0);
  const lastAtt = data.attendance[0];

  const reports = [
    {
      icon:"👥", title:"Member Records", color:"#B07BE0",
      desc:"Full list of all church members with roles and status.",
      stats:[{l:"TOTAL MEMBERS",v:data.members.length},{l:"ACTIVE",v:active},{l:"INACTIVE",v:inactive}],
      cols:[{key:"name",label:"Name"},{key:"role",label:"Role"},{key:"status",label:"Status"},{key:"joined",label:"Joined"}],
      rows:data.members, file:"members_report.csv", printTitle:"Member Records",
    },
    {
      icon:"💰", title:"Finance Report", color:"#C9A84C",
      desc:"Monthly offerings, tithes, and contribution records.",
      stats:[{l:"VERIFIED TOTAL",v:`₱${verified.toLocaleString()}`},{l:"PENDING TOTAL",v:`₱${pending.toLocaleString()}`},{l:"TOTAL RECORDS",v:data.finance.length}],
      cols:[{key:"name",label:"Name"},{key:"type",label:"Type"},{key:"amount",label:"Amount (₱)"},{key:"date",label:"Date"},{key:"status",label:"Status"}],
      rows:data.finance, file:"finance_report.csv", printTitle:"Finance Report",
    },
    {
      icon:"✅", title:"Attendance Report", color:"#7BE0B0",
      desc:"Attendance logs per session with attendance rate.",
      stats:[{l:"SESSIONS",v:data.attendance.length},{l:"LAST SESSION",v:lastAtt?lastAtt.date:"—"}],
      cols:[{key:"date",label:"Date"},{key:"present",label:"Present"},{key:"total",label:"Total"}],
      rows:data.attendance, file:"attendance_report.csv", printTitle:"Attendance Report",
    },
    {
      icon:"🗓", title:"Events Report", color:"#E07B7B",
      desc:"All upcoming and scheduled church events.",
      stats:[{l:"TOTAL EVENTS",v:data.events.length}],
      cols:[{key:"date",label:"Date"},{key:"title",label:"Event"},{key:"time",label:"Time"},{key:"type",label:"Type"}],
      rows:data.events, file:"events_report.csv", printTitle:"Events Report",
    },
    {
      icon:"📋", title:"Monthly Budget", color:"#7B9EF0",
      desc:"Budget allocations, spending, and remaining balance.",
      stats:[
        {l:"TOTAL ALLOCATED",v:`₱${data.budgets.reduce((s,b)=>s+Number(b.allocated||0),0).toLocaleString()}`},
        {l:"TOTAL SPENT",v:`₱${data.budgets.reduce((s,b)=>s+Number(b.spent||0),0).toLocaleString()}`},
        {l:"CATEGORIES",v:data.budgets.length},
      ],
      cols:[{key:"category",label:"Category"},{key:"allocated",label:"Allocated (₱)"},{key:"spent",label:"Spent (₱)"},{key:"note",label:"Note"}],
      rows:data.budgets, file:"budget_report.csv", printTitle:"Monthly Budget",
    },
  ];

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:8}}>📤 Export Reports</h4>
      <p style={{color:"#9A9080",marginBottom:28}}>Download church records as a real Excel file or a printable PDF.</p>
      {loading ? <div style={{color:"#9A9080",padding:32,textAlign:"center"}}>Loading data...</div> : (
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {reports.map(r=>(
          <div key={r.title} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${r.color},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:16}}>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <div style={{width:44,height:44,background:`${r.color}15`,border:`1px solid ${r.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{r.icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:"1rem",marginBottom:4}}>{r.title}</div>
                  <div style={{color:"#9A9080",fontSize:".85rem"}}>{r.desc}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>downloadCSV(toCSV(r.rows,r.cols),r.file)}
                  style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.4)",color:"#7BE0B0",cursor:"pointer",padding:"8px 16px",fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".06em",display:"flex",alignItems:"center",gap:6}}>
                  📊 EXCEL (.CSV)
                </button>
                <button onClick={()=>printTable(r.printTitle,r.rows,r.cols)}
                  style={{background:"rgba(224,123,123,.1)",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",cursor:"pointer",padding:"8px 16px",fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".06em",display:"flex",alignItems:"center",gap:6}}>
                  🖨 PDF (PRINT)
                </button>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {r.stats.map(s=>(
                <div key={s.l} style={{background:"#12121A",border:`1px solid ${r.color}30`,padding:"10px 20px",minWidth:100}}>
                  <div style={{fontSize:".65rem",color:r.color,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".1em",marginBottom:4}}>{s.l}</div>
                  <div className="font-display" style={{fontSize:"1.3rem",color:r.color}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{background:"#12121A",border:"1px solid #22223A",padding:16,fontSize:".82rem",color:"#9A9080",lineHeight:2}}>
          <div>📊 <span style={{color:"#7BE0B0"}}>Excel (.csv)</span> — Buksan sa Microsoft Excel o Google Sheets. May Summary at Data sheet.</div>
          <div>🖨 <span style={{color:"#E07B7B"}}>PDF (Print)</span> — mag-o-open ng print dialog. Piliin ang <strong style={{color:"#F0EAD6"}}>"Save as PDF"</strong> sa printer options para ma-save.</div>
        </div>
      </div>
      )}
    </div>
  );
}
// ── SYSTEM SETTINGS PANEL ────────────────────────────────────────────────────
function SystemSettingsPanel({user, onUpdateUser}) {
  const [tab, setTab] = useState("general");
  const [settings, setSettings] = useState({
    churchName: "Jesus The Rock of Our Salvation Mission Church",
    tagline:    "He only is my rock and my salvation — Psalm 62:6",
    gcash:      "09XX-XXX-XXXX",
    bank:       "XXXX-XXXX-XXXX",
    bankName:   "BDO / BPI",
    location:   "Pasig City",
    sunday:     "9:00 AM",
    midweek:    "7:00 PM",
    allowSignup: false,
    maintenanceMode: false,
  });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  // Page Content State
  const [pageContent, setPageContent] = useState({
    home:       { hero: "Welcome to Jesus The Rock of Our Salvation Mission Church", sub: "A community built on faith, love, and the Word of God.", verse: "Psalm 62:6", cta: "Join Our Community" },
    about:      { title: "About Our Church", body: "Jesus The Rock of Our Salvation Mission Church is a growing community of believers dedicated to spreading the Gospel and nurturing disciples of Christ.", vision: "To be a church that reflects the love and grace of Jesus Christ.", mission: "To make disciples of all nations through worship, fellowship, and service." },
    ministries: { intro: "We have various ministries designed to help every member grow in faith and serve the community." },
    events:     { intro: "Join us for our upcoming events and gatherings. Everyone is welcome!" },
    media:      { intro: "Watch our latest sermons and worship sessions. Be blessed wherever you are." },
    give:       { intro: "Your generous giving helps us continue the ministry and reach more lives for Christ.", note: "All donations are used for church operations, outreach, and community service." },
    prayer:     { intro: "We believe in the power of prayer. Submit your prayer requests and our team will pray for you.", note: "All prayer requests are kept confidential unless you choose to share publicly." },
  });

  const save = () => { setSaved(true); setEditing(false); setTimeout(()=>setSaved(false), 2500); };
  const saveContent = () => { setContentSaved(true); setTimeout(()=>setContentSaved(false), 2500); };

  const Field = ({label, field}) => (
    <div style={{marginBottom:16}}>
      <label>{label}</label>
      {editing
        ? <input value={settings[field]} onChange={e=>setSettings({...settings,[field]:e.target.value})}/>
        : <div style={{padding:"12px 16px",background:"#12121A",border:"1px solid #22223A",color:"#F0EAD6"}}>{settings[field]}</div>}
    </div>
  );
  const Toggle = ({label, field, desc}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:"1px solid #22223A"}}>
      <div>
        <div style={{fontWeight:600,marginBottom:2}}>{label}</div>
        <div style={{fontSize:".85rem",color:"#9A9080"}}>{desc}</div>
      </div>
      <div onClick={()=>setSettings({...settings,[field]:!settings[field]})}
        style={{width:48,height:26,borderRadius:13,background:settings[field]?"#C9A84C":"#22223A",position:"relative",cursor:"pointer",transition:"all .3s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:settings[field]?22:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"all .3s"}}/>
      </div>
    </div>
  );

  const pageIcons = {home:"🏠",about:"⛪",ministries:"🙏",events:"🎉",media:"🎬",give:"💝",prayer:"🕊️"};
  const pageLabels = {home:"Home",about:"About",ministries:"Ministries",events:"Events",media:"Media",give:"Give",prayer:"Prayer"};
  const [activePage, setActivePage] = useState("home");

  const ContentField = ({label, pageKey, fieldKey, multiline=false}) => (
    <div style={{marginBottom:14}}>
      <label style={{fontSize:".75rem"}}>{label}</label>
      {multiline
        ? <textarea rows={3} value={pageContent[pageKey][fieldKey]||""} onChange={e=>setPageContent({...pageContent,[pageKey]:{...pageContent[pageKey],[fieldKey]:e.target.value}})} style={{resize:"vertical"}}/>
        : <input value={pageContent[pageKey][fieldKey]||""} onChange={e=>setPageContent({...pageContent,[pageKey]:{...pageContent[pageKey],[fieldKey]:e.target.value}})}/>}
    </div>
  );

  const pageFields = {
    home:       [["Hero Title","hero"],["Subtitle","sub"],["Bible Verse","verse"],["CTA Button Text","cta"]],
    about:      [["Page Title","title"],["Description","body",true],["Vision","vision",true],["Mission","mission",true]],
    ministries: [["Intro Text","intro",true]],
    events:     [["Intro Text","intro",true]],
    media:      [["Intro Text","intro",true]],
    give:       [["Intro Text","intro",true],["Additional Note","note",true]],
    prayer:     [["Intro Text","intro",true],["Confidentiality Note","note",true]],
  };

  const TABS = [["general","⚙️ General"],["content","📝 Page Content"],["roles","🔐 Role Access"]];

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:24}}>⚙️ System Settings</h4>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid #22223A",marginBottom:28,overflowX:"auto"}}>
        {TABS.map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"12px 22px",background:"none",border:"none",borderBottom:tab===k?"2px solid #C9A84C":"2px solid transparent",color:tab===k?"#E8CC7A":"#9A9080",cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".8rem",letterSpacing:".08em",whiteSpace:"nowrap",transition:"all .2s",marginBottom:"-1px"}}>{lbl}</button>
        ))}
      </div>

      {/* General Tab */}
      {tab==="general" && (
        <div style={{maxWidth:640}}>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:20}}>
            {editing ? (
              <>
                <button className="btnGold" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={save}>Save Changes</button>
                <button className="btnOut" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btnOut" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(true)}>✏️ Edit Settings</button>
            )}
          </div>
          {saved && <div style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",padding:"12px 16px",color:"#7BE0B0",marginBottom:20,fontSize:".9rem"}}>✅ Settings saved!</div>}
          <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:28,marginBottom:16,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
            <div className="font-sans" style={{fontSize:".7rem",color:"#C9A84C",letterSpacing:".1em",marginBottom:16,textTransform:"uppercase"}}>⛪ Church Information</div>
            <Field label="Church Name" field="churchName"/>
            <Field label="Tagline / Verse" field="tagline"/>
            <Field label="Location" field="location"/>
          </div>
          <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:28,marginBottom:16,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#7B9EF0,transparent)"}}/>
            <div className="font-sans" style={{fontSize:".7rem",color:"#7B9EF0",letterSpacing:".1em",marginBottom:16,textTransform:"uppercase"}}>🕐 Service Schedule</div>
            <Field label="Sunday Worship Time" field="sunday"/>
            <Field label="Midweek Prayer Time" field="midweek"/>
          </div>
          <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:28,marginBottom:16,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#7BE0B0,transparent)"}}/>
            <div className="font-sans" style={{fontSize:".7rem",color:"#7BE0B0",letterSpacing:".1em",marginBottom:16,textTransform:"uppercase"}}>💳 Payment Details</div>
            <Field label="GCash Number" field="gcash"/>
            <Field label="Bank Name" field="bankName"/>
            <Field label="Bank Account No." field="bank"/>
          </div>
          <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:28,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#E07B7B,transparent)"}}/>
            <div className="font-sans" style={{fontSize:".7rem",color:"#E07B7B",letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>🔧 System Controls</div>
            <Toggle label="Allow New Signups" field="allowSignup" desc="Allow new members to register accounts."/>
            <Toggle label="Maintenance Mode" field="maintenanceMode" desc="Temporarily disable public access."/>
          </div>
        </div>
      )}

      {/* Page Content Tab */}
      {tab==="content" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div style={{color:"#9A9080",fontSize:".85rem"}}>Edit the text content shown on each public page.</div>
            <button className="btnGold" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={saveContent}>💾 Save Content</button>
          </div>
          {contentSaved&&<div style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",padding:"12px 16px",color:"#7BE0B0",marginBottom:20,fontSize:".9rem"}}>✅ Content saved!</div>}
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {/* Page selector sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:140}}>
              {Object.keys(pageFields).map(pg=>(
                <button key={pg} onClick={()=>setActivePage(pg)}
                  style={{padding:"10px 16px",background:activePage===pg?"rgba(201,168,76,.12)":"transparent",border:activePage===pg?"1px solid rgba(201,168,76,.4)":"1px solid transparent",color:activePage===pg?"#E8CC7A":"#9A9080",cursor:"pointer",textAlign:"left",fontFamily:"'Tenor Sans',sans-serif",fontSize:".8rem",letterSpacing:".06em",transition:"all .2s"}}>
                  {pageIcons[pg]} {pageLabels[pg]}
                </button>
              ))}
            </div>
            {/* Fields for selected page */}
            <div style={{flex:1,background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative",minWidth:260}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
              <div className="font-sans" style={{fontSize:".7rem",color:"#C9A84C",letterSpacing:".1em",marginBottom:20,textTransform:"uppercase"}}>{pageIcons[activePage]} {pageLabels[activePage]} Page</div>
              {(pageFields[activePage]||[]).map(([lbl,fld,multi])=>(
                <ContentField key={fld} label={lbl} pageKey={activePage} fieldKey={fld} multiline={!!multi}/>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role Access Tab */}
      {tab==="roles" && <RoleAccessManager/>}
    </div>
  );
}

function RoleAccessManager() {
  const ALL_PANELS = [
    "Dashboard Overview","Manage Members","Manage Events","Upcoming Events",
    "Donation Records","Financial Reports","Monthly Budget","Export Reports",
    "Post Announcements","Attendance Logs","System Settings",
    "Member Records","Upload Documents","Song List","Rehearsal Schedule",
    "Practice Materials","Attendance Monitoring","Visitor Follow-up","Member List",
    "My Profile","Devotion Submission","View Events","Giving History",
  ];
  const ROLES = ["head","treasurer","events","performance","secretary","engagement","member"];
  const [roleAccess, setRoleAccess] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const [openRole, setOpenRole] = useState(null);

  useEffect(()=>{
    dbGet("role_access","?order=role.asc").then(d=>{
      if(d&&d.length>0){
        const map = {};
        d.forEach(row=>{
          try{ map[row.role] = typeof row.panels==="string" ? JSON.parse(row.panels) : (row.panels||[]); }catch{ map[row.role]=[]; }
        });
        setRoleAccess(map);
      } else {
        // Initialize from hardcoded fallback
        setRoleAccess({...ROLE_ACCESS});
      }
      setLoading(false);
    });
  },[]);

  const toggle = (role, panel) => {
    const cur = roleAccess[role]||[];
    const updated = cur.includes(panel) ? cur.filter(p=>p!==panel) : [...cur, panel];
    setRoleAccess({...roleAccess, [role]: updated});
  };

  const saveRole = async (role) => {
    setSaving(role);
    const panels = JSON.stringify(roleAccess[role]||[]);
    // Try update first, then insert
    const existing = await dbGet("role_access","?role=eq."+role);
    if(existing&&existing.length>0){
      await dbUpdate("role_access", existing[0].id, {panels});
    } else {
      await dbInsert("role_access", {role, panels});
    }
    setSaving(null); setSaved(role);
    setTimeout(()=>setSaved(null),2000);
  };

  const roleLabel = r=>r==="head"?"👑 Head":r==="treasurer"?"💰 Treasurer":r==="events"?"🎉 Events":r==="performance"?"🎶 Performance":r==="secretary"?"📝 Secretary":r==="engagement"?"🤝 Engagement":"👤 Member";

  return (
    <div style={{marginTop:32}}>
      <div className="font-sans" style={{fontSize:".7rem",color:"#7B9EF0",letterSpacing:".1em",marginBottom:12,textTransform:"uppercase"}}>🔐 Role Access Manager</div>
      {loading ? <div style={{color:"#9A9080",padding:16}}>Loading...</div> : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ROLES.map(role=>(
            <div key={role} style={{background:"#12121A",border:"1px solid #22223A"}}>
              <div onClick={()=>setOpenRole(openRole===role?null:role)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background="#1A1A28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{fontWeight:600}}>{roleLabel(role)}</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:"#9A9080",fontSize:".8rem"}}>{(roleAccess[role]||[]).length} panels</span>
                  <span style={{color:"#9A9080"}}>{openRole===role?"▲":"▼"}</span>
                </div>
              </div>
              {openRole===role&&(
                <div style={{padding:"0 18px 18px"}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
                    {ALL_PANELS.map(panel=>{
                      const active = (roleAccess[role]||[]).includes(panel);
                      return (
                        <div key={panel} onClick={()=>toggle(role,panel)}
                          style={{padding:"5px 12px",fontSize:".75rem",cursor:"pointer",border:`1px solid ${active?"#C9A84C":"#22223A"}`,background:active?"rgba(201,168,76,.15)":"transparent",color:active?"#E8CC7A":"#9A9080",fontFamily:"'Tenor Sans',sans-serif",transition:"all .2s"}}>
                          {panel}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={()=>saveRole(role)} className="btnGold" style={{padding:"8px 20px",fontSize:".75rem"}}>
                    {saving===role?"Saving...":saved===role?"✅ Saved!":"Save Changes"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PROFILE PANEL ─────────────────────────────────────────────────────────────
function ProfilePanel({user, onUpdateUser}) {
  const [form, setForm] = useState({
    fullName: user.fullName || user.username,
    username: user.username,
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
  });
  const [photo, setPhoto] = useState(user.photo || null);
  const [pwForm, setPwForm] = useState({current:"", newPw:"", confirm:""});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [tab, setTab] = useState("info");

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    // Update in-app state
    onUpdateUser({...form, photo});
    // Save to member_accounts — find by username
    try {
      const existing = await dbGet("member_accounts", "?username=eq."+(user.username||"").toLowerCase());
      if(existing && existing.length > 0) {
        await dbUpdate("member_accounts", existing[0].id, {
          full_name: form.fullName,
          username: form.username.trim().toLowerCase(),
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          photo: photo||null,
        });
      }
      // Also update name in members table
      const memberRec = await dbGet("members", "?name=eq."+encodeURIComponent(user.fullName||user.username));
      if(memberRec && memberRec.length > 0) {
        await dbUpdate("members", memberRec[0].id, {name: form.fullName});
      }
    } catch(e) {}
    addLog("👤", "Profile updated: "+form.username, user.role, form.username);
    setSaving(false);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
  };

  const changePw = async () => {
    setPwMsg("");
    if (!pwForm.current) { setPwMsg("Enter your current password."); return; }
    if (pwForm.newPw.length < 4) { setPwMsg("New password must be at least 4 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("Passwords do not match."); return; }
    // Verify current password against stored password
    const storedPw = user.password || "";
    if (storedPw && pwForm.current !== storedPw) { setPwMsg("Current password is incorrect."); return; }
    setPwSaving(true);
    try {
      // Find the account by username and update password
      const existing = await dbGet("member_accounts", "?username=eq." + (user.username||"").toLowerCase());
      if (existing && existing.length > 0) {
        await dbUpdate("member_accounts", existing[0].id, {password: pwForm.newPw});
      }
      // Always update in-app state
      onUpdateUser({password: pwForm.newPw});
      setPwMsg("✅ Password updated successfully!");
      setPwForm({current:"", newPw:"", confirm:""});
      setTimeout(()=>setPwMsg(""), 3000);
    } catch(e) {
      setPwMsg("Failed to update. Please try again.");
    }
    setPwSaving(false);
  };

  return (
    <div style={{maxWidth:560}}>
      {/* Profile Header Card */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${user.color||"#C9A84C"},transparent)`}}/>
        {/* Avatar with upload */}
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:`${user.color||"#C9A84C"}20`,border:`2px solid ${user.color||"#C9A84C"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,overflow:"hidden"}}>
            {photo
              ? <img src={photo} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : (user.icon||"👤")}
          </div>
          <label style={{position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",background:user.color||"#C9A84C",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,border:"2px solid #0A0A0F"}}
            title="Change photo">
            📷
            <input type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          </label>
        </div>
        <div>
          <div className="font-display" style={{fontSize:"1.2rem",color:"#E8CC7A"}}>{form.fullName||user.username}</div>
          <div style={{color:user.color||"#C9A84C",fontSize:".85rem",marginTop:2}}>{user.label||user.role}</div>
          <div style={{color:"#9A9080",fontSize:".8rem",marginTop:2}}>@{form.username}</div>
          <div style={{color:"#9A9080",fontSize:".75rem",marginTop:4,fontFamily:"'Tenor Sans',sans-serif"}}>Click 📷 to change photo</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{display:"flex",borderBottom:"1px solid #22223A",marginBottom:0}}>
        {[["info","👤 Profile Info"],["security","🔒 Security"]].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"11px 22px",background:"none",border:"none",borderBottom:tab===k?"2px solid #C9A84C":"2px solid transparent",color:tab===k?"#E8CC7A":"#9A9080",cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".8rem",letterSpacing:".08em",marginBottom:"-1px"}}>{lbl}</button>
        ))}
      </div>

      {tab==="info" && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",borderTop:"none",padding:28}}>
          {saved && <div style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",padding:"10px 16px",color:"#7BE0B0",marginBottom:20,fontSize:".9rem"}}>✅ Profile saved!</div>}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label>Full Name</label><input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></div>
            <div><label>Username</label><input value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
            <div><label>Email</label><input type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div><label>Phone</label><input placeholder="09XX-XXX-XXXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            <div><label>Short Bio</label><textarea rows={3} placeholder="A little about you..." value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} style={{resize:"vertical"}}/></div>
            <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 28px"}} onClick={save} disabled={saving}>{saving?"Saving...":"Save Changes"}</button>
          </div>
        </div>
      )}

      {tab==="security" && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",borderTop:"none",padding:28}}>
          {pwMsg && <div style={{background:pwMsg.startsWith("✅")?"rgba(123,224,176,.1)":"rgba(224,123,123,.1)",border:`1px solid ${pwMsg.startsWith("✅")?"rgba(123,224,176,.3)":"rgba(224,123,123,.3)"}`,padding:"10px 16px",color:pwMsg.startsWith("✅")?"#7BE0B0":"#E07B7B",marginBottom:20,fontSize:".9rem"}}>{pwMsg}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label>Current Password</label><input type="password" placeholder="••••••••" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})}/></div>
            <div><label>New Password</label><input type="password" placeholder="Min. 4 characters" value={pwForm.newPw} onChange={e=>setPwForm({...pwForm,newPw:e.target.value})}/></div>
            <div><label>Confirm New Password</label><input type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})}/></div>
            <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 28px"}} onClick={changePw} disabled={pwSaving}>{pwSaving?"Updating...":"Update Password"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
// ── DASHBOARD — with openProfile trigger ──────────────────────────────────────
// ── QUICK STATS (live, shown on dashboard home for Head/Treasurer) ────────────
function QuickStats({color}) {
  const [s, setS] = useState({members:"-",offerings:"-",events:"-",prayers:"-",attendance:"-",songs:"-"});
  useEffect(()=>{
    Promise.all([
      dbGet("members","?order=created_at.asc"),
      dbGet("finance_records","?order=created_at.desc"),
      dbGet("events","?order=created_at.asc"),
      dbGet("prayer_requests","?order=created_at.desc"),
      dbGet("attendance","?order=created_at.desc&limit=1"),
      dbGet("songs","?order=created_at.asc"),
    ]).then(([m,f,e,p,a,sg])=>{
      const verified = (f||[]).filter(r=>r.status==="Verified").reduce((sum,r)=>sum+Number(r.amount),0);
      const lastAtt = (a||[])[0];
      setS({
        members: (m||[]).length,
        offerings: `₱${verified.toLocaleString()}`,
        events: (e||[]).length,
        prayers: (p||[]).length,
        attendance: lastAtt ? `${lastAtt.present}/${lastAtt.total}` : "—",
        songs: (sg||[]).length,
      });
    });
  },[]);
  const cards = [
    {l:"Total Members",    v:s.members,    i:"👥"},
    {l:"March Offerings",  v:s.offerings,  i:"💰"},
    {l:"Upcoming Events",  v:s.events,     i:"🗓"},
    {l:"Prayer Requests",  v:s.prayers,    i:"🙏"},
    {l:"Last Attendance",  v:s.attendance, i:"✅"},
    {l:"Songs in List",    v:s.songs,      i:"🎵"},
  ];
  return (
    <div className="g3" style={{marginBottom:32}}>
      {cards.map(c=>(
        <div key={c.l} style={{background:"#12121A",border:"1px solid #22223A",padding:"20px 24px",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
          <div style={{fontSize:24,marginBottom:8}}>{c.i}</div>
          <div className="font-display" style={{fontSize:"1.8rem",color:color}}>{c.v}</div>
          <div style={{color:"#9A9080",fontSize:".85rem"}}>{c.l}</div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({user, onLogout, openProfileOnLoad, onUpdateUser}) {
  const [access, setAccess] = useState(ROLE_ACCESS[user.role] || []);
  const [activePanel, setActivePanel] = useState(openProfileOnLoad ? "My Profile" : null);

  // Load role access from Supabase only
  useEffect(()=>{
    dbGet("role_access","?role=eq."+user.role).then(d=>{
      if(d&&d.length>0&&d[0].panels){
        try{
          const panels = typeof d[0].panels==="string" ? JSON.parse(d[0].panels) : d[0].panels;
          if(Array.isArray(panels)&&panels.length>0) setAccess(panels);
        }catch(e){}
      }
    }).catch(()=>{});
  },[user.role]);

  // expose setter so nav avatar can open profile
  useEffect(() => {
    window.__openProfile = () => setActivePanel("My Profile");
    window.__closePanels = () => setActivePanel(null);
    return () => { delete window.__openProfile; delete window.__closePanels; };
  }, []);

  const getPanel = (name) => {
    const n = name.toLowerCase();
    if(n.includes("dashboard overview")||n==="dashboard overview") return <DashboardOverviewPanel/>;
    if(n.includes("system")||n.includes("settings"))               return <SystemSettingsPanel user={user} onUpdateUser={onUpdateUser}/>;
    if(n.includes("member"))                                        return <MembersPanel/>;
    if(n.includes("export"))                                        return <ExportPanel/>;
    if(n.includes("donation record"))                               return <DonationRecordsPanel/>;
    if(n.includes("financial report")||n.includes("view financial")) return <FinancialReportsPanel/>;
    if(n.includes("monthly budget")||n.includes("budget"))          return <MonthlyBudgetPanel/>;
    if(n.includes("finance")||n.includes("record contribut")||
       n.includes("contribut"))                                     return <DonationRecordsPanel/>;
    if(n.includes("upcoming"))                                       return <UpcomingEventsPanel/>;
    if(n.includes("manage event")||n.includes("event"))              return <EventsPanel viewOnly={user.role==="member"}/>;
    if(n.includes("announcement"))                                  return <AnnouncementsPanel canPost={["head","secretary","events"].includes(user.role)}/>;
    if(n.includes("document"))                                      return <DocumentsPanel user={user}/>;
    if(n.includes("attendance")||n.includes("visitor")||n.includes("follow"))
                                                                    return <AttendancePanel/>;
    if(n.includes("rehearsal")||n.includes("rehearsal schedule"))  return <RehearsalPanel viewOnly={user.role!=="performance"}/>;
    if(n.includes("practice")||n.includes("practice materials"))    return <PracticePanel viewOnly={user.role!=="performance"}/>;
    if(n.includes("song")||n.includes("worship"))                   return <SongsPanel/>;
    if(n.includes("devotion"))                                      return <DevotionPanel/>;
    if(n.includes("giving"))                                        return <GivingHistoryPanel/>;
    if(n.includes("profile"))                                       return <ProfilePanel user={user} onUpdateUser={onUpdateUser}/>;
    return <div style={{textAlign:"center",padding:60}}><div style={{fontSize:48,marginBottom:16}}>🚧</div><h4 className="font-display" style={{color:"#C9A84C",marginBottom:8}}>{name}</h4><p style={{color:"#9A9080"}}>Coming soon!</p></div>;
  };

  return (
    <section>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40,flexWrap:"wrap",gap:16}}>
        <div>
          {activePanel&&<button onClick={()=>setActivePanel(null)} style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>← Back to Dashboard</button>}
          <div className="font-sans" style={{fontSize:".75rem",color:"#9A9080",letterSpacing:".1em",marginBottom:4}}>WELCOME BACK</div>
          <h2 className="font-display" style={{color:"#E8CC7A",fontSize:"1.5rem"}}>{user.icon} {user.label}</h2>
          <div style={{color:"#9A9080",marginTop:4}}>Logged in as: <span style={{color:user.color,fontWeight:600}}>{user.username}</span></div>
        </div>
        <button className="btnRed" onClick={onLogout}>🚪 Log Out</button>
      </div>
      {activePanel?(
        <div style={{background:"#12121A",border:"1px solid #22223A",padding:40,position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${user.color},transparent)`}}/>
          {getPanel(activePanel)}
        </div>
      ):(
        <>
          {(user.role==="head"||user.role==="treasurer")&&(
            <QuickStats color={user.color}/>
          )}
          <div style={{background:"#12121A",border:"1px solid #22223A",padding:40,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${user.color},transparent)`}}/>
            <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".15em",color:user.color,marginBottom:4,textTransform:"uppercase"}}>Your Access</div>
            <h3 className="font-display" style={{marginBottom:24}}>Dashboard Panel</h3>
            <div className="g3">
              {access.map(a=>(
                <div key={a} className="card" onClick={()=>setActivePanel(a)} style={{background:"#1A1A28",padding:"24px",borderLeft:`3px solid ${user.color}`,cursor:"pointer"}}>
                  <div style={{fontWeight:600,marginBottom:6}}>{a}</div>
                  <div style={{color:"#9A9080",fontSize:".85rem"}}>Click to open →</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
// ── GLOBAL ACTIVITY LOG (in-memory, shared across components) ────────────────

export default function App() {
  const [page, setPage]       = useState("Home");
  const [menu, setMenu]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser]       = useState(null);
  const [profileTrigger, setProfileTrigger] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => {
    if (p === "Dashboard" && page === "Dashboard") {
      if (window.__closePanels) window.__closePanels();
      setMenu(false); window.scrollTo(0, 0); return;
    }
    setPage(p); setMenu(false); window.scrollTo(0, 0);
  };
  const login = (u) => { setUser(u); setPage("Dashboard"); };
  const logout = () => { setUser(null); setPage("Home"); };

  // Called from ProfilePanel when user saves username/photo
  const updateUser = (updates) => {
    setUser(prev => ({...prev, ...updates}));
  };

  const openProfile = () => {
    if (page === "Dashboard") {
      if (window.__openProfile) window.__openProfile();
    } else {
      setProfileTrigger(true);
      go("Dashboard");
    }
  };

  const renderPage = () => {
    if (page === "Dashboard" && user) {
      const trigger = profileTrigger;
      if (profileTrigger) setProfileTrigger(false);
      return <Dashboard user={user} onLogout={logout} openProfileOnLoad={trigger} onUpdateUser={updateUser}/>;
    }
    switch(page){
      case "Home":       return <Home go={go}/>;
      case "About":      return <About/>;
      case "Ministries": return <Ministries/>;
      case "Events":     return <Events/>;
      case "Media":      return <Media/>;
      case "Give":       return <Give/>;
      case "Prayer":     return <Prayer/>;
      case "Login":      return <Login onLogin={login}/>;
      default:           return <Home go={go}/>;
    }
  };

  return (
    <ErrorBoundary>
      <style>{style}</style>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,transition:"all .3s",background:scrolled?"rgba(10,10,15,.95)":"rgba(10,10,15,.6)",backdropFilter:"blur(12px)",borderBottom:scrolled?"1px solid rgba(201,168,76,.2)":"1px solid transparent",padding:"0 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>user ? go("Dashboard") : go("Home")}>
            <div style={{fontSize:22,color:"#C9A84C"}}>✞</div>
            <div>
              <div className="font-display" style={{fontSize:".65rem",color:"#C9A84C",letterSpacing:".1em"}}>JESUS THE ROCK</div>
              <div className="font-sans" style={{fontSize:".55rem",color:"#8A6A2A",letterSpacing:".15em"}}>OF OUR SALVATION MISSION CHURCH</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="dNav" style={{display:"flex",gap:24,alignItems:"center"}}>
            {user ? (
            user.role === "head" ? (
              /* ── HEAD: full nav + avatar chip ── */
              <>
                {NAV_ITEMS.filter(n=>n!=="Login").map(n=>(
                  <span key={n} className={`navLink font-sans ${page===n?"active":""}`}
                    style={{fontSize:".75rem",letterSpacing:".1em",textTransform:"uppercase"}}
                    onClick={()=>go(n)}>{n}</span>
                ))}
                <div onClick={openProfile}
                  style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"6px 14px",border:`1px solid ${user.color}60`,background:`${user.color}15`,transition:"all .3s",borderRadius:2}}
                  onMouseEnter={e=>e.currentTarget.style.background=`${user.color}30`}
                  onMouseLeave={e=>e.currentTarget.style.background=`${user.color}15`}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`${user.color}30`,border:`1px solid ${user.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,overflow:"hidden"}}>
                    {user.photo ? <img src={user.photo} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : user.icon}
                  </div>
                  <div>
                    <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".08em",color:user.color,textTransform:"uppercase",lineHeight:1.2}}>{user.username}</div>
                    <div style={{fontSize:".65rem",color:"#9A9080",lineHeight:1.2}}>{user.label}</div>
                  </div>
                </div>
              </>
            ) : (
              /* ── OTHER ROLES: Home + avatar chip only ── */
              <>
                <span className={`navLink font-sans ${page==="Dashboard"?"active":""}`}
                  style={{fontSize:".75rem",letterSpacing:".1em",textTransform:"uppercase"}}
                  onClick={()=>go("Dashboard")}>Home</span>
                <div onClick={openProfile}
                  style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"6px 14px",border:`1px solid ${user.color}60`,background:`${user.color}15`,transition:"all .3s",borderRadius:2}}
                  onMouseEnter={e=>e.currentTarget.style.background=`${user.color}30`}
                  onMouseLeave={e=>e.currentTarget.style.background=`${user.color}15`}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`${user.color}30`,border:`1px solid ${user.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,overflow:"hidden"}}>
                    {user.photo ? <img src={user.photo} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : user.icon}
                  </div>
                  <div>
                    <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".08em",color:user.color,textTransform:"uppercase",lineHeight:1.2}}>{user.username}</div>
                    <div style={{fontSize:".65rem",color:"#9A9080",lineHeight:1.2}}>{user.label}</div>
                  </div>
                </div>
              </>
            )
            ) : (
              /* ── GUEST: full nav ── */
              NAV_ITEMS.map(n=>(
                <span key={n} className={`navLink font-sans ${page===n?"active":""}`}
                  style={{fontSize:".75rem",letterSpacing:".1em",textTransform:"uppercase"}}
                  onClick={()=>go(n)}>{n}</span>
              ))
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="mBtn" style={{background:"none",border:"none",color:"#C9A84C",fontSize:24,cursor:"pointer"}} onClick={()=>setMenu(!menu)}>
            {menu?"✕":"☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menu&&(
          <div style={{display:"flex",flexDirection:"column",background:"rgba(10,10,15,.98)",padding:"16px 32px 24px",gap:16,borderTop:"1px solid rgba(201,168,76,.2)"}}>
            {user ? (
              <>
                {user.role === "head" && NAV_ITEMS.filter(n=>n!=="Login").map(n=>(
                  <span key={n} className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0"}} onClick={()=>go(n)}>{n}</span>
                ))}
                {user.role !== "head" && (
                  <span className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0"}} onClick={()=>go("Home")}>Home</span>
                )}
                <span className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0",color:user.color}} onClick={()=>{openProfile();setMenu(false);}}>
                  {user.icon} {user.username} — My Profile
                </span>
                <span className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0"}} onClick={()=>{go("Dashboard");setMenu(false);}}>
                  📊 Dashboard
                </span>
                <span className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0",color:"#E07B7B"}} onClick={()=>{logout();setMenu(false);}}>
                  🚪 Log Out
                </span>
              </>
            ) : (
              NAV_ITEMS.map(n=>(
                <span key={n} className="navLink font-sans" style={{fontSize:".85rem",letterSpacing:".12em",textTransform:"uppercase",padding:"8px 0"}} onClick={()=>go(n)}>{n}</span>
              ))
            )}
          </div>
        )}
      </nav>

      {page!=="Home"&&<div style={{height:64}}/>}
      <main key={user ? "auth" : page} className="aFadeUp">{renderPage()}</main>

      <footer style={{background:"#080810",borderTop:"1px solid rgba(201,168,76,.15)",padding:"60px 32px 32px",textAlign:"center"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:32,color:"#C9A84C",marginBottom:16}}>✞</div>
          <div className="font-display goldText" style={{fontSize:"1.1rem",marginBottom:8}}>Jesus The Rock of Our Salvation Mission Church</div>
          <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".15em",color:"#8A6A2A",marginBottom:24}}>SERVING BY FAITH</div>
          <div className="ornament" style={{justifyContent:"center",marginBottom:24}}>
            <span style={{color:"#9A9080",fontStyle:"italic",fontSize:".95rem"}}>"He only is my rock and my salvation; he is my defence; I shall not be moved." — Psalm 62:6</span>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",marginBottom:32}}>
            {["Home","About","Ministries","Events","Give","Prayer"].map(n=>(
              <span key={n} className="navLink font-sans" style={{fontSize:".7rem",letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",color:"#9A9080"}} onClick={()=>go(n)}>{n}</span>
            ))}
          </div>
          <div style={{color:"#3A3A50",fontSize:".8rem"}}>© Morisoul</div>
        </div>
      </footer>
    </ErrorBoundary>
  );
}