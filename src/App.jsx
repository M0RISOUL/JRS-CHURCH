import { useState, useEffect } from "react";
import {
  NAV_ITEMS, LEADERSHIP, MINISTRIES, EVENTS,
  SONGS, ROLES, ROLE_ACCESS, ACCOUNTS
} from "./data";

// Helper: add to activity log
const addLog = (icon, msg, role, user) => { window.__activityLog = [{icon,msg,role,user:user||role,time:new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric"})+" · "+new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})}, ...(window.__activityLog||[])]; };

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
            <button className="btnOut" onClick={()=>go("Media")}>Watch Live</button>
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
          <div className="g2">
            {EVENTS.slice(0,4).map(e=>(
              <div key={e.title} className={`card ev-${e.type}`} style={{background:"#12121A",borderLeft:"3px solid",padding:"20px 24px",display:"flex",gap:20,alignItems:"center"}}>
                <div style={{textAlign:"center",minWidth:60}}>
                  <div className="font-sans" style={{fontSize:".7rem",color:"#C9A84C",letterSpacing:".1em"}}>{e.date.split(" ")[0].toUpperCase()}</div>
                  <div className="font-display" style={{fontSize:"1.8rem"}}>{e.date.split(" ")[1]}</div>
                </div>
                <div><div style={{fontWeight:600,marginBottom:4}}>{e.title}</div><div style={{color:"#9A9080",fontSize:".9rem"}}>{e.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <Hdr eye="A Word From Our Head" title="Welcome to JRS Church"/>
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
  const [f,setF]=useState({name:"",email:"",event:""});
  const [ok,setOk]=useState(false);
  return (
    <section>
      <Hdr eye="Plan Your Visit" title="Events Calendar"/>
      <div style={{marginBottom:60}}>
        {EVENTS.map(e=>(
          <div key={e.title} className={`card ev-${e.type}`} style={{background:"#12121A",borderLeft:"3px solid",padding:"24px 28px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div style={{display:"flex",gap:24,alignItems:"center"}}>
              <div style={{textAlign:"center",minWidth:70}}>
                <div className="font-sans" style={{fontSize:".65rem",color:"#C9A84C",letterSpacing:".15em"}}>{e.date.split(" ")[0].toUpperCase()}</div>
                <div className="font-display" style={{fontSize:"2rem"}}>{e.date.split(" ")[1]}</div>
              </div>
              <div><div style={{fontWeight:600,fontSize:"1.1rem",marginBottom:4}}>{e.title}</div><div style={{color:"#9A9080"}}>{e.time}</div></div>
            </div>
            <button className="btnOut" style={{padding:"8px 20px",fontSize:".75rem"}}>Register</button>
          </div>
        ))}
      </div>
      <div style={{background:"#12121A",border:"1px solid #22223A",padding:48,maxWidth:600,position:"relative"}}>
        <TL/>
        <h3 className="font-display" style={{fontSize:"1.3rem",marginBottom:8,color:"#E8CC7A"}}>Event Registration</h3>
        <p style={{color:"#9A9080",marginBottom:32}}>Sign up for an upcoming church event.</p>
        {ok?(
          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <h4 className="font-display" style={{color:"#C9A84C",marginBottom:8}}>Registered!</h4>
            <p style={{color:"#9A9080"}}>We'll see you there. God bless!</p>
            <button className="btnOut" style={{marginTop:24}} onClick={()=>setOk(false)}>Register for Another</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div><label>Full Name</label><input placeholder="Juan dela Cruz" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
            <div><label>Email</label><input type="email" placeholder="juan@email.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div>
            <div><label>Select Event</label>
              <select value={f.event} onChange={e=>setF({...f,event:e.target.value})}>
                <option value="">— Choose —</option>
                {EVENTS.map(ev=><option key={ev.title} value={ev.title}>{ev.date} — {ev.title}</option>)}
              </select>
            </div>
            <button className="btnGold" onClick={()=>{if(f.name&&f.email&&f.event)setOk(true);}}>Confirm Registration</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Media() {
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState("All");
  const getYouTubeId = (url) => {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };
  const catColor = (c) => c==="Praise"?"#C9A84C":c==="Worship"?"#B07BE0":c==="Hymn"?"#7B9EF0":c==="Special"?"#E07B7B":"#9A9080";
  const cats = ["All","Praise","Worship","Hymn","Special"];
  const filtered = filter === "All" ? SONGS : SONGS.filter(s=>s.category===filter);
  const cur = playing !== null ? filtered[playing] : null;
  const vid = cur ? getYouTubeId(cur.youtube) : null;
  return (
    <section>
      <Hdr eye="God's Word & Worship" title="Sermons & Media"/>
      <div style={{background:"#12121A",border:"1px solid #22223A",padding:48,marginBottom:48,position:"relative",textAlign:"center"}}>
        <TL/>
        <div style={{width:"100%",maxWidth:640,height:300,margin:"0 auto",background:"#0A0A0F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1px solid #22223A",marginBottom:24}}>
          <div className="aPulse" style={{width:72,height:72,borderRadius:"50%",background:"rgba(201,168,76,.15)",border:"2px solid #C9A84C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16}}>▶</div>
          <div className="font-sans" style={{fontSize:".8rem",letterSpacing:".15em",color:"#C9A84C"}}>LIVE STREAM</div>
          <div style={{color:"#9A9080",fontSize:".9rem",marginTop:8}}>Every Sunday at 9:00 AM</div>
        </div>
        <button className="btnGold">Watch Live on YouTube</button>
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
  const [f,setF]=useState({name:"",type:"tithe",amount:""});
  const [ok,setOk]=useState(false);
  return (
    <section>
      <Hdr eye="Give & Support" title="Online Offering" sub="Bring the whole tithe into the storehouse. — Malachi 3:10"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24,marginBottom:48}}>
        <div style={{background:"#12121A",border:"1px solid #22223A",padding:40,position:"relative"}}>
          <TL/>
          <h3 className="font-display" style={{color:"#E8CC7A",marginBottom:24}}>Give Now</h3>
          {ok?(
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:48,marginBottom:16}}>🙏</div>
              <h4 className="font-display" style={{color:"#C9A84C",marginBottom:8}}>Thank You!</h4>
              <p style={{color:"#9A9080"}}>Your offering has been recorded. God bless!</p>
              <button className="btnOut" style={{marginTop:24}} onClick={()=>setOk(false)}>Give Again</button>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div><label>Your Name</label><input placeholder="Juan dela Cruz" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
              <div><label>Offering Type</label>
                <select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>
                  <option value="tithe">Tithes</option><option value="offering">Offering</option>
                  <option value="mission">Mission Fund</option><option value="building">Building Fund</option>
                </select>
              </div>
              <div><label>Amount (PHP)</label><input type="number" placeholder="Any amount" value={f.amount} onChange={e=>setF({...f,amount:e.target.value})}/></div>
              <button className="btnGold" onClick={()=>{if(f.name&&f.amount)setOk(true);}}>Submit Offering</button>
            </div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[{color:"#4A6FBF",label:"📱 GCASH",info:[["Name","JRS Church Fund"],["Number","09XX-XXX-XXXX"]]},{color:"#7B4FCF",label:"🏦 BANK TRANSFER",info:[["Bank","BDO / BPI"],["Account Name","JRS JTROS Mission"],["Account No","XXXX-XXXX-XXXX"]]}].map(b=>(
            <div key={b.label} style={{background:"#12121A",border:"1px solid #22223A",padding:32,position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${b.color},transparent)`}}/>
              <h4 className="font-sans" style={{fontSize:".85rem",letterSpacing:".1em",color:b.color,marginBottom:16}}>{b.label}</h4>
              {b.info.map(([k,v])=><div key={k} style={{color:"#B0A898",lineHeight:1.9}}>{k}: <span style={{color:"#C9A84C"}}>{v}</span></div>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prayer() {
  const [f,setF]=useState({name:"",req:"",conf:false});
  const [ok,setOk]=useState(false);
  const submit = () => {
    if (!f.req) return;
    const entry = {
      id: Date.now(),
      name: f.name.trim() || "Anonymous",
      req: f.req,
      conf: f.conf,
      date: new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric"}),
      time: new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}),
    };
    window.__prayerRequests = [entry, ...(window.__prayerRequests||[])];
    // Add to activity log
    const logEntry = {
      icon:"🙏",
      msg: f.conf
        ? "A confidential prayer request was submitted"
        : `New prayer request from ${entry.name}`,
      role:"Guest",
      time: entry.date + " · " + entry.time,
    };
    window.__activityLog = [logEntry, ...(window.__activityLog||[])];
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
              <button className="btnGold" onClick={submit}>Submit Prayer Request</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Login({onLogin}) {
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [err,setErr]=useState("");
  const [shake,setShake]=useState(false);
  const tryLogin=()=>{
    const match=ACCOUNTS.find(a=>a.username===u.trim().toLowerCase()&&a.password===p);
    if(match){const rd=ROLES.find(r=>r.id===match.role);onLogin({...match,...rd});}
    else{setErr("Invalid username or password. Please try again.");setShake(true);setTimeout(()=>setShake(false),500);}
  };
  return (
    <section>
      <Hdr eye="Member Portal" title="Sign In" sub="Enter your username and password to access your dashboard."/>
      <div style={{maxWidth:420,margin:"0 auto"}}>
        <div className={shake?"aShake":""} style={{background:"#12121A",border:"1px solid #22223A",padding:48,position:"relative"}}>
          <TL/><Cross size={180} op={0.03} top="20px" right="-30px"/>
          <div style={{display:"flex",flexDirection:"column",gap:20,position:"relative"}}>
            <div><label>Username</label><input placeholder="Enter your username" value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></div>
            <div><label>Password</label><input type="password" placeholder="••••••••" value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></div>
            {err&&<div style={{background:"rgba(224,123,123,.1)",border:"1px solid rgba(224,123,123,.3)",padding:"12px 16px",color:"#E07B7B",fontSize:".9rem"}}>⚠️ {err}</div>}
            <button className="btnGold" onClick={tryLogin}>Sign In →</button>
            <div style={{background:"#1A1A28",padding:20,borderLeft:"3px solid #C9A84C"}}>
              <div className="font-sans" style={{fontSize:".7rem",color:"#C9A84C",letterSpacing:".1em",marginBottom:10}}>📋 DEMO CREDENTIALS</div>
              <div style={{color:"#9A9080",fontSize:".85rem",lineHeight:2}}>
                {[["Head","ivan","head2026"],["Treasurer","ange","treasurer2026"],["Financial","angie","finance2026"],["Financial","ariane","ariane2026"],["Events","ced","events2026"],["Events","pipper","pipper2026"],["Secretary","jam","secretary2026"],["Secretary","tine","tine2026"],["Performance","precious","perf2026"],["Performance","krislene","krislene2026"],["Member","member","member2026"]].map(([role,user,pass])=>(
                  <div key={role}><span style={{color:"#E8CC7A"}}>{role}</span>{" · "}<span style={{color:"#E8CC7A"}}>{user}</span>{" / "}<span style={{color:"#E8CC7A"}}>{pass}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PANELS ────────────────────────────────────────────────────────────────────
function MembersPanel() {
  const [members,setMembers]=useState([
    {id:1,name:"Kuya Ivan",role:"Head",status:"Active",joined:"Jan 2024"},
    {id:2,name:"Ange",role:"Treasurer",status:"Active",joined:"Jan 2024"},
    {id:3,name:"Angie",role:"Financial Dept",status:"Active",joined:"Jan 2024"},
    {id:4,name:"Ced",role:"Events / Engagement",status:"Active",joined:"Feb 2024"},
    {id:5,name:"Precious",role:"Performance Dept",status:"Active",joined:"Feb 2024"},
    {id:6,name:"Jam",role:"Secretary",status:"Active",joined:"Mar 2024"},
    {id:7,name:"Pipper",role:"Events Dept",status:"Active",joined:"Mar 2024"},
    {id:8,name:"Tine",role:"Events / Secretary",status:"Active",joined:"Mar 2024"},
    {id:9,name:"Krislene",role:"Performance Dept",status:"Active",joined:"Apr 2024"},
    {id:10,name:"Ariane",role:"Financial Dept",status:"Active",joined:"Apr 2024"},
  ]);
  const [form,setForm]=useState({name:"",role:"",status:"Active",joined:""});
  const [adding,setAdding]=useState(false);
  const add=()=>{if(!form.name||!form.role)return;setMembers([...members,{id:Date.now(),...form}]);addLog("👥","New member added: "+form.name,"Head","Kuya Ivan");setForm({name:"",role:"",status:"Active",joined:""});setAdding(false);};
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
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["#","Name","Role","Status","Joined","Action"].map(h=><th key={h} className="font-sans" style={{padding:"10px 16px",textAlign:"left",fontSize:".7rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{members.map((m,i)=>(
            <tr key={m.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1A1A28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{i+1}</td>
              <td style={{padding:"12px 16px",fontWeight:600}}>{m.name}</td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".9rem"}}>{m.role}</td>
              <td style={{padding:"12px 16px"}}><span style={{padding:"2px 10px",fontSize:".7rem",background:m.status==="Active"?"rgba(123,224,176,.1)":"rgba(224,123,123,.1)",color:m.status==="Active"?"#7BE0B0":"#E07B7B",border:`1px solid ${m.status==="Active"?"rgba(123,224,176,.3)":"rgba(224,123,123,.3)"}`}}>{m.status}</span></td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{m.joined}</td>
              <td style={{padding:"12px 16px"}}><button onClick={()=>setMembers(members.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{marginTop:16,color:"#9A9080",fontSize:".85rem"}}>Total: {members.length} members</div>
    </div>
  );
}

function FinancePanel() {
  const [records,setRecords]=useState([
    {id:1,name:"Kuya Ivan",type:"Tithe",amount:500,date:"Mar 1",status:"Verified"},
    {id:2,name:"Ange",type:"Offering",amount:200,date:"Mar 1",status:"Verified"},
    {id:3,name:"Angie",type:"Tithe",amount:300,date:"Mar 2",status:"Pending"},
    {id:4,name:"Ced",type:"Mission Fund",amount:150,date:"Mar 2",status:"Verified"},
    {id:5,name:"Precious",type:"Offering",amount:100,date:"Mar 3",status:"Pending"},
  ]);
  const [form,setForm]=useState({name:"",type:"Tithe",amount:"",date:"",status:"Pending"});
  const [adding,setAdding]=useState(false);
  const totalV=records.filter(r=>r.status==="Verified").reduce((s,r)=>s+r.amount,0);
  const totalP=records.filter(r=>r.status==="Pending").reduce((s,r)=>s+r.amount,0);
  const add=()=>{if(!form.name||!form.amount)return;setRecords([...records,{id:Date.now(),...form,amount:Number(form.amount)}]);addLog("💰","Recorded "+form.type+": "+form.name+" — ₱"+form.amount,"Financial","Treasurer/Financial");setForm({name:"",type:"Tithe",amount:"",date:"",status:"Pending"});setAdding(false);};
  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:24}}>💰 Finance Dashboard</h4>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32}}>
        {[{l:"Verified Total",v:`₱${totalV.toLocaleString()}`,c:"#7BE0B0"},{l:"Pending Total",v:`₱${totalP.toLocaleString()}`,c:"#E0B07B"},{l:"Total Records",v:records.length,c:"#7B9EF0"},{l:"Month",v:"March 2026",c:"#C9A84C"}].map(s=>(
          <div key={s.l} style={{background:"#1A1A28",padding:"20px 24px",borderLeft:`3px solid ${s.c}`}}>
            <div style={{fontSize:".75rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em"}}>{s.l}</div>
            <div className="font-display" style={{fontSize:"1.4rem",color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>Contribution Records</div>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Record Offering"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        <div><label>Name</label><input placeholder="Contributor" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label>Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["Tithe","Offering","Mission Fund","Building Fund"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label>Amount (₱)</label><input type="number" placeholder="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
        <div><label>Date</label><input placeholder="Mar 3" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
        <div style={{display:"flex",alignItems:"flex-end"}}><button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button></div>
      </div>)}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["Name","Type","Amount","Date","Status","Action"].map(h=><th key={h} className="font-sans" style={{padding:"10px 16px",textAlign:"left",fontSize:".7rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{records.map(r=>(
            <tr key={r.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1A1A28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px",fontWeight:600}}>{r.name}</td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".9rem"}}>{r.type}</td>
              <td style={{padding:"12px 16px",color:"#7BE0B0",fontWeight:600}}>₱{r.amount.toLocaleString()}</td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{r.date}</td>
              <td style={{padding:"12px 16px"}}><span style={{padding:"2px 10px",fontSize:".7rem",background:r.status==="Verified"?"rgba(123,224,176,.1)":"rgba(224,176,123,.1)",color:r.status==="Verified"?"#7BE0B0":"#E0B07B",border:`1px solid ${r.status==="Verified"?"rgba(123,224,176,.3)":"rgba(224,176,123,.3)"}`}}>{r.status}</span></td>
              <td style={{padding:"12px 16px"}}><div style={{display:"flex",gap:8}}>
                {r.status==="Pending"&&<button onClick={()=>setRecords(records.map(x=>x.id===r.id?{...x,status:"Verified"}:x))} style={{background:"none",border:"none",color:"#7BE0B0",cursor:"pointer",fontSize:".85rem"}}>✓ Verify</button>}
                <button onClick={()=>setRecords(records.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function EventsPanel({viewOnly=false}) {
  const [events,setEvents]=useState([...EVENTS]);
  const [form,setForm]=useState({date:"",title:"",time:"",type:"worship"});
  const [adding,setAdding]=useState(false);
  const add=()=>{if(!form.date||!form.title)return;setEvents([...events,{...form}]);addLog("📅","New event: "+form.title+" on "+form.date,"Events Dept","Events Dept");setForm({date:"",title:"",time:"",type:"worship"});setAdding(false);};
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
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {events.map(e=>(
          <div key={e.title} className={`card ev-${e.type}`} style={{background:"#1A1A28",borderLeft:"3px solid",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <div style={{textAlign:"center",minWidth:60}}>
                <div className="font-sans" style={{fontSize:".65rem",color:"#C9A84C",letterSpacing:".1em"}}>{e.date.split(" ")[0]?.toUpperCase()}</div>
                <div className="font-display" style={{fontSize:"1.5rem"}}>{e.date.split(" ")[1]}</div>
              </div>
              <div><div style={{fontWeight:600,marginBottom:2}}>{e.title}</div><div style={{color:"#9A9080",fontSize:".85rem"}}>{e.time}</div></div>
            </div>
            {!viewOnly&&<button onClick={()=>setEvents(events.filter(x=>x.title!==e.title))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsPanel() {
  const [posts,setPosts]=useState([
    {id:1,title:"Easter Sunday Special Service",body:"Join us for a special Easter Sunday celebration on April 6 at 8:00 AM.",date:"Mar 1",author:"Secretary"},
    {id:2,title:"Monthly Devotion Reminder",body:"By end of March, everyone is encouraged to share their devotion.",date:"Mar 2",author:"Head"},
  ]);
  const [form,setForm]=useState({title:"",body:""});
  const [adding,setAdding]=useState(false);
  const add=()=>{if(!form.title||!form.body)return;setPosts([...posts,{id:Date.now(),...form,date:"Mar "+new Date().getDate(),author:"Staff"}]);addLog("📢","Announcement posted: "+form.title,"Secretary","Secretary");setForm({title:"",body:""});setAdding(false);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📢 Announcements</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Post Announcement"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:12}}>
        <div><label>Title</label><input placeholder="Announcement title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
        <div><label>Message</label><textarea rows={4} placeholder="Write your announcement..." value={form.body} onChange={e=>setForm({...form,body:e.target.value})} style={{resize:"vertical"}}/></div>
        <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add}>Post</button>
      </div>)}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {posts.map(p=>(
          <div key={p.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div>
                <h5 style={{fontWeight:700,fontSize:"1rem",marginBottom:6}}>{p.title}</h5>
                <p style={{color:"#B0A898",lineHeight:1.7,fontSize:".95rem"}}>{p.body}</p>
                <div style={{marginTop:12,color:"#9A9080",fontSize:".8rem"}}>Posted {p.date} · by {p.author}</div>
              </div>
              <button onClick={()=>setPosts(posts.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",flexShrink:0}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsPanel() {
  const [docs,setDocs]=useState([
    {id:1,name:"March Meeting Minutes.pdf",type:"Meeting Minutes",date:"Mar 1",uploadedBy:"Jam",size:"24 KB"},
    {id:2,name:"Member List 2026.docx",type:"Member Records",date:"Mar 2",uploadedBy:"Jam",size:"12 KB"},
    {id:3,name:"Easter Program.pdf",type:"Event Program",date:"Mar 3",uploadedBy:"Jam",size:"48 KB"},
  ]);
  const [form,setForm]=useState({name:"",type:"Meeting Minutes"});
  const [adding,setAdding]=useState(false);
  const add=()=>{if(!form.name)return;setDocs([...docs,{id:Date.now(),...form,date:"Mar "+new Date().getDate(),uploadedBy:"Jam",size:"—"}]);addLog("📄","Document uploaded: "+form.name+" ("+form.type+")","Secretary","Jam");setForm({name:"",type:"Meeting Minutes"});setAdding(false);};
  const icon=(t)=>t==="Meeting Minutes"?"📝":t==="Member Records"?"👥":t==="Financial Report"?"💰":"📄";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📁 Upload Documents</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Upload Document"}</button>
      </div>
      {adding&&(<div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label>Document Name</label><input placeholder="e.g. March Minutes.pdf" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label>Document Type</label>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {["Meeting Minutes","Member Records","Event Program","Announcement","Financial Report","Other"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{border:"2px dashed #22223A",padding:32,textAlign:"center",color:"#9A9080",fontSize:".9rem",cursor:"pointer"}}>
          📎 Click to attach file — or enter document name above to record it
        </div>
        <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add}>Save Document</button>
      </div>)}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {docs.map(d=>(
          <div key={d.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{width:44,height:44,background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon(d.type)}</div>
              <div>
                <div style={{fontWeight:600,marginBottom:2}}>{d.name}</div>
                <div style={{color:"#9A9080",fontSize:".8rem"}}>{d.type} · {d.size} · Uploaded {d.date} by {d.uploadedBy}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12}}>
              <button style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem"}}>⬇ Download</button>
              <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendancePanel() {
  const allMembers=["Kuya Ivan","Ange","Angie","Ced","Precious","Jam","Pipper","Tine","Krislene","Ariane"];
  const [logs,setLogs]=useState([{id:1,date:"Mar 2 (Sunday)",present:["Kuya Ivan","Ange","Ced","Jam","Precious"],total:10}]);
  const [active,setActive]=useState(false);
  const [present,setPresent]=useState([]);
  const [dateStr,setDateStr]=useState("");
  const toggle=(name)=>setPresent(p=>p.includes(name)?p.filter(x=>x!==name):[...p,name]);
  const save=()=>{if(!dateStr)return;setLogs([...logs,{id:Date.now(),date:dateStr,present,total:allMembers.length}]);setActive(false);setPresent([]);setDateStr("");};
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
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {logs.map(l=>(
          <div key={l.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:12}}>
              <div><div style={{fontWeight:600,marginBottom:4}}>{l.date}</div><div style={{color:"#9A9080",fontSize:".85rem"}}>Present: {l.present.length} / {l.total}</div></div>
              <div style={{padding:"4px 14px",background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",color:"#7BE0B0",fontSize:".8rem"}}>{Math.round((l.present.length/l.total)*100)}% attendance</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {l.present.map(name=><span key={name} style={{padding:"3px 10px",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.2)",color:"#C9A84C",fontSize:".8rem"}}>{name}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SongsPanel() {
  const [songs, setSongs] = useState([...SONGS]);
  const [playing, setPlaying] = useState(null); // index of currently playing song
  const [form, setForm] = useState({title:"", author:"", category:"Praise", youtube:""});
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");

  const add = () => {
    if (!form.title) return;
    setSongs([...songs, {...form}]);
    addLog("🎵","Song added: \""+form.title+"\" by "+(form.author||"Unknown"),"Performance","Performance Dept");
    setForm({title:"", author:"", category:"Praise", youtube:""});
    setAdding(false);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const categories = ["All", "Praise", "Worship", "Hymn", "Special"];
  const filtered = filter === "All" ? songs : songs.filter(s => s.category === filter);

  const catColor = (c) => c==="Praise"?"#C9A84C":c==="Worship"?"#B07BE0":c==="Hymn"?"#7B9EF0":c==="Special"?"#E07B7B":"#9A9080";

  const currentSong = playing !== null ? filtered[playing] : null;
  const youtubeId = currentSong ? getYouTubeId(currentSong.youtube) : null;

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>🎵 Song List & Music Player</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>
          {adding ? "Cancel" : "+ Add Song"}
        </button>
      </div>

      {/* Add Song Form */}
      {adding && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          <div><label>Song Title</label><input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label>Author / Team</label><input placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></div>
          <div><label>Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {["Praise","Worship","Hymn","Special"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label>YouTube Link</label><input placeholder="https://youtube.com/watch?v=..." value={form.youtube} onChange={e=>setForm({...form,youtube:e.target.value})}/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <button className="btnGold" style={{padding:"12px 20px",fontSize:".75rem",width:"100%"}} onClick={add}>Save</button>
          </div>
        </div>
      )}

      {/* Now Playing */}
      {currentSong && (
        <div style={{background:"#12121A",border:"1px solid #B07BE0",padding:0,marginBottom:24,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#B07BE0,transparent)"}}/>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div>
              <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".12em",color:"#B07BE0",marginBottom:4}}>▶ NOW PLAYING</div>
              <div style={{fontWeight:700,fontSize:"1.05rem"}}>{currentSong.title}</div>
              <div style={{color:"#9A9080",fontSize:".85rem"}}>{currentSong.author}</div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={()=>setPlaying(playing > 0 ? playing-1 : filtered.length-1)}
                style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏮</button>
              <button onClick={()=>setPlaying(null)}
                style={{background:"rgba(224,123,123,.15)",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏹</button>
              <button onClick={()=>setPlaying(playing < filtered.length-1 ? playing+1 : 0)}
                style={{background:"rgba(176,123,224,.15)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>⏭</button>
            </div>
          </div>
          {/* YouTube embed */}
          {youtubeId ? (
            <div style={{position:"relative",paddingBottom:"42%",background:"#000"}}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{padding:"32px 20px",textAlign:"center",color:"#9A9080",fontSize:".9rem",background:"#0A0A0F"}}>
              🎵 No YouTube link for this song. <span style={{color:"#C9A84C"}}>Add a link to enable playback.</span>
            </div>
          )}
        </div>
      )}

      {/* Category filter */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {categories.map(c=>(
          <button key={c} onClick={()=>{setFilter(c);setPlaying(null);}}
            style={{padding:"6px 16px",background:filter===c?catColor(c):"transparent",border:`1px solid ${filter===c?catColor(c):"#22223A"}`,color:filter===c?"#0A0A0F":catColor(c),cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".75rem",letterSpacing:".08em",transition:"all .2s"}}>
            {c}
          </button>
        ))}
        <span style={{marginLeft:"auto",color:"#9A9080",fontSize:".85rem",alignSelf:"center"}}>{filtered.length} song{filtered.length!==1?"s":""}</span>
      </div>

      {/* Song list */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((s, i) => {
          const isPlaying = playing === i;
          const vid = getYouTubeId(s.youtube);
          return (
            <div key={i} style={{background:isPlaying?"#1E1A2E":"#1A1A28",border:`1px solid ${isPlaying?"#B07BE0":"#22223A"}`,padding:"14px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all .2s"}}
              onClick={()=>setPlaying(isPlaying ? null : i)}>
              {/* Play/pause icon */}
              <div style={{width:40,height:40,borderRadius:"50%",background:isPlaying?"#B07BE0":"rgba(176,123,224,.15)",border:`1px solid ${isPlaying?"#B07BE0":"rgba(176,123,224,.4)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",fontSize:16,color:isPlaying?"#0A0A0F":"#B07BE0"}}>
                {isPlaying ? "⏸" : "▶"}
              </div>
              {/* Song info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,marginBottom:2,color:isPlaying?"#E8CC7A":"#F0EAD6"}}>{s.title}</div>
                <div style={{color:"#9A9080",fontSize:".85rem"}}>{s.author}</div>
              </div>
              {/* Category badge */}
              <span style={{padding:"2px 10px",background:`${catColor(s.category)}15`,border:`1px solid ${catColor(s.category)}40`,color:catColor(s.category),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif",flexShrink:0}}>
                {s.category}
              </span>
              {/* YouTube indicator */}
              <span style={{fontSize:13,color:vid?"#E07B7B":"#3A3A50",flexShrink:0}} title={vid?"Has YouTube link":"No YouTube link"}>
                {vid ? "▶ YT" : "—"}
              </span>
              {/* Remove */}
              <button
                style={{background:"none",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",cursor:"pointer",fontSize:".75rem",flexShrink:0,padding:"4px 10px",fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".05em",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(224,123,123,.15)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
                onClick={e=>{
                  e.stopPropagation();
                  const actualIndex = songs.indexOf(s);
                  if (playing === i) setPlaying(null);
                  else if (playing !== null && playing > i) setPlaying(playing - 1);
                  setSongs(songs.filter((_, j) => j !== actualIndex));
                }}>
                🗑 Delete
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{textAlign:"center",padding:"40px 0",color:"#9A9080"}}>No songs in this category.</div>
      )}
    </div>
  );
}

function DevotionPanel() {
  const [devotions,setDevotions]=useState([
    {id:1,name:"Kuya Ivan",book:"Psalms",insight:"God is our rock and our strength in every trial.",date:"Feb 28",likes:5},
    {id:2,name:"Jam",book:"Proverbs",insight:"Wisdom begins with the fear of the Lord. This month I learned to trust His timing.",date:"Feb 28",likes:3},
  ]);
  const [form,setForm]=useState({name:"",book:"",insight:""});
  const [adding,setAdding]=useState(false);
  const add=()=>{if(!form.name||!form.insight)return;setDevotions([...devotions,{id:Date.now(),...form,date:"Mar "+new Date().getDate(),likes:0}]);addLog("📖",form.name+" shared a devotion from "+(form.book||"the Bible"),"Member",form.name);setForm({name:"",book:"",insight:""});setAdding(false);};
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
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {devotions.map(d=>(
          <div key={d.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#7B4FCF,transparent)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap",marginBottom:8}}>
              <div>
                <span style={{fontWeight:600}}>{d.name}</span>
                {d.book&&<span style={{marginLeft:10,padding:"2px 10px",background:"rgba(123,79,207,.1)",border:"1px solid rgba(123,79,207,.3)",color:"#B07BE0",fontSize:".75rem"}}>📖 {d.book}</span>}
              </div>
              <div style={{color:"#9A9080",fontSize:".8rem"}}>{d.date}</div>
            </div>
            <p style={{color:"#B0A898",lineHeight:1.8,fontStyle:"italic",marginBottom:12}}>"{d.insight}"</p>
            <button onClick={()=>setDevotions(devotions.map(x=>x.id===d.id?{...x,likes:x.likes+1}:x))} style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem"}}>🙏 Amen ({d.likes})</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GivingHistoryPanel() {
  const [records,setRecords]=useState([
    {id:1,type:"Tithe",amount:500,date:"Feb 1"},
    {id:2,type:"Offering",amount:200,date:"Feb 8"},
    {id:3,type:"Tithe",amount:500,date:"Mar 1"},
  ]);
  const [giving,setGiving]=useState(false);
  const [form,setForm]=useState({type:"Tithe",amount:"",note:""});
  const [ok,setOk]=useState(false);
  const submit=()=>{
    if(!form.amount)return;
    const d=new Date().toLocaleString("en-PH",{month:"short",day:"numeric"});
    setRecords([...records,{id:Date.now(),type:form.type,amount:Number(form.amount),date:d}]);
    addLog("💸","Member submitted a "+form.type+" offering \u2014 \u20b1"+form.amount,"Member","Member");
    setForm({type:"Tithe",amount:"",note:""});setOk(true);
    setTimeout(()=>{setOk(false);setGiving(false);},2500);
  };
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
              📱 <span style={{color:"#C9A84C"}}>GCash:</span> JRS Church Fund · 09XX-XXX-XXXX<br/>
              🏦 <span style={{color:"#C9A84C"}}>BDO/BPI:</span> JRS JTROS Mission · XXXX-XXXX-XXXX<br/>
              <span style={{fontSize:".8rem"}}>Please send payment before confirming.</span>
            </div>
            <button className="btnGold" style={{padding:"12px 28px"}} onClick={submit}>Confirm Offering →</button>
          </>
        )}
      </div>)}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32}}>
        {[{l:"Total Given",v:`₱${records.reduce((s,r)=>s+r.amount,0).toLocaleString()}`,c:"#7BE0B0"},{l:"Total Records",v:records.length,c:"#7B9EF0"},{l:"Last Giving",v:records[records.length-1]?.date||"—",c:"#C9A84C"}].map(s=>(
          <div key={s.l} style={{background:"#1A1A28",padding:"20px 24px",borderLeft:`3px solid ${s.c}`}}>
            <div style={{fontSize:".75rem",color:s.c,marginBottom:4,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em"}}>{s.l}</div>
            <div className="font-display" style={{fontSize:"1.4rem",color:s.c}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid #22223A"}}>{["Type","Amount","Date"].map(h=><th key={h} className="font-sans" style={{padding:"10px 16px",textAlign:"left",fontSize:".7rem",letterSpacing:".1em",color:"#9A9080",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{records.map(r=>(
            <tr key={r.id} style={{borderBottom:"1px solid #1A1A28"}} onMouseEnter={e=>e.currentTarget.style.background="#1A1A28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px",color:"#9A9080"}}>{r.type}</td>
              <td style={{padding:"12px 16px",color:"#7BE0B0",fontWeight:600}}>₱{r.amount.toLocaleString()}</td>
              <td style={{padding:"12px 16px",color:"#9A9080",fontSize:".85rem"}}>{r.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function ProfilePanel({user, onUpdateUser}) {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    fullName:   user.fullName   || user.username,
    username:   user.username,
    contact:    user.contact    || "—",
    address:    user.address    || "—",
    birthday:   user.birthday   || "—",
    joinedDate: user.joinedDate || "—",
    bio:        user.bio        || "—",
  });
  const [photo, setPhoto]       = useState(user.photo || null);
  const [saved, setSaved]       = useState(false);
  const [pwMode, setPwMode]     = useState(false);
  const [pwForm, setPwForm]     = useState({current:"", newPw:"", confirm:""});
  const [pwErr, setPwErr]       = useState("");
  const [pwOk, setPwOk]         = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!info.username.trim()) return;
    setSaved(true);
    setEditing(false);
    // bubble up new username + photo so nav chip updates too
    if (onUpdateUser) onUpdateUser({ username: info.username.trim(), photo, fullName: info.fullName });
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = () => {
    setPwErr("");
    if (pwForm.current !== user.password) { setPwErr("Current password is incorrect."); return; }
    if (pwForm.newPw.length < 6)          { setPwErr("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm)   { setPwErr("Passwords do not match."); return; }
    setPwOk(true);
    setPwMode(false);
    setPwForm({current:"",newPw:"",confirm:""});
    setTimeout(() => setPwOk(false), 2500);
  };

  const Field = ({label, field}) => (
    <div style={{borderBottom:"1px solid #22223A",paddingBottom:12,marginBottom:12}}>
      <div className="font-sans" style={{fontSize:".7rem",color:"#9A9080",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{label}</div>
      {editing
        ? <input value={info[field]} onChange={e=>setInfo({...info,[field]:e.target.value})} style={{padding:"8px 12px",fontSize:".95rem"}}/>
        : <div style={{color:"#F0EAD6",fontSize:"1rem"}}>{info[field]}</div>}
    </div>
  );

  return (
    <div style={{maxWidth:580}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>👤 My Profile</h4>
        <div style={{display:"flex",gap:10}}>
          {editing ? (
            <>
              <button className="btnGold" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={save}>Save Changes</button>
              <button className="btnOut"  style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btnOut" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>
      </div>

      {/* Success alerts */}
      {saved && <div style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",padding:"12px 16px",color:"#7BE0B0",marginBottom:16,fontSize:".9rem"}}>✅ Profile updated successfully!</div>}
      {pwOk  && <div style={{background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",padding:"12px 16px",color:"#7BE0B0",marginBottom:16,fontSize:".9rem"}}>🔒 Password changed successfully!</div>}

      {/* Avatar + basic info */}
      <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:32,position:"relative",marginBottom:16}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${user.color},transparent)`}}/>

        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,flexWrap:"wrap"}}>
          {/* Profile picture */}
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:90,height:90,borderRadius:"50%",overflow:"hidden",border:`2px solid ${user.color}80`,background:`radial-gradient(circle,${user.color}30,transparent)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>
              {photo
                ? <img src={photo} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : user.icon}
            </div>
            {/* Camera button */}
            <label htmlFor="photoUpload" style={{position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",background:"#C9A84C",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,border:"2px solid #0A0A0F"}}>
              📷
            </label>
            <input id="photoUpload" type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          </div>

          <div style={{flex:1,minWidth:0}}>
            {editing ? (
              <div style={{marginBottom:10}}>
                <div className="font-sans" style={{fontSize:".7rem",color:"#9A9080",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Display Name</div>
                <input value={info.fullName} onChange={e=>setInfo({...info,fullName:e.target.value})} style={{padding:"8px 12px",fontSize:"1rem",marginBottom:8}}/>
              </div>
            ) : (
              <h3 className="font-display" style={{fontSize:"1.1rem",marginBottom:8}}>{info.fullName}</h3>
            )}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{padding:"3px 12px",background:`${user.color}20`,border:`1px solid ${user.color}50`,color:user.color,fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".1em",textTransform:"uppercase"}}>{user.label}</span>
              <span style={{padding:"3px 12px",background:"rgba(123,224,176,.1)",border:"1px solid rgba(123,224,176,.3)",color:"#7BE0B0",fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif"}}>● Active</span>
            </div>
          </div>
        </div>

        {/* Username field (editable) */}
        <div style={{borderBottom:"1px solid #22223A",paddingBottom:12,marginBottom:12}}>
          <div className="font-sans" style={{fontSize:".7rem",color:"#9A9080",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Username</div>
          {editing
            ? <input value={info.username} onChange={e=>setInfo({...info,username:e.target.value})} style={{padding:"8px 12px",fontSize:".95rem"}}/>
            : <div style={{color:user.color,fontSize:"1rem",fontWeight:600}}>@{info.username}</div>}
        </div>

        <Field label="Contact No." field="contact"/>
        <Field label="Address"     field="address"/>
        <Field label="Birthday"    field="birthday"/>
        <Field label="Date Joined" field="joinedDate"/>

        <div>
          <div className="font-sans" style={{fontSize:".7rem",color:"#9A9080",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>About / Bio</div>
          {editing
            ? <textarea rows={3} value={info.bio} onChange={e=>setInfo({...info,bio:e.target.value})} style={{resize:"vertical"}}/>
            : <div style={{color:"#B0A898",lineHeight:1.8,fontSize:"1rem",fontStyle:"italic"}}>"{info.bio}"</div>}
        </div>
      </div>

      {/* Church info */}
      <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative",marginBottom:16}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#C9A84C,transparent)"}}/>
        <div className="font-sans" style={{fontSize:".7rem",color:"#C9A84C",letterSpacing:".1em",marginBottom:12,textTransform:"uppercase"}}>Church Info</div>
        <div style={{color:"#B0A898",lineHeight:2,fontSize:".95rem"}}>
          <div>Church: <span style={{color:"#C9A84C"}}>Jesus The Rock of Our Salvation Mission Church</span></div>
          <div>Username: <span style={{color:user.color}}>@{info.username}</span></div>
          <div>Member Since: <span style={{color:"#F0EAD6"}}>{info.joinedDate}</span></div>
        </div>
      </div>

      {/* Change password */}
      <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#E07B7B,transparent)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom: pwMode?20:0}}>
          <div className="font-sans" style={{fontSize:".7rem",color:"#E07B7B",letterSpacing:".1em",textTransform:"uppercase"}}>🔒 Change Password</div>
          <button className="btnOut" style={{padding:"6px 16px",fontSize:".7rem",borderColor:"#E07B7B",color:"#E07B7B"}} onClick={()=>{setPwMode(!pwMode);setPwErr("");}}>
            {pwMode?"Cancel":"Change"}
          </button>
        </div>
        {pwMode && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {pwErr && <div style={{background:"rgba(224,123,123,.1)",border:"1px solid rgba(224,123,123,.3)",padding:"10px 14px",color:"#E07B7B",fontSize:".85rem"}}>⚠️ {pwErr}</div>}
            <div><label>Current Password</label><input type="password" placeholder="••••••••" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})}/></div>
            <div><label>New Password</label><input type="password" placeholder="Min. 6 characters" value={pwForm.newPw} onChange={e=>setPwForm({...pwForm,newPw:e.target.value})}/></div>
            <div><label>Confirm New Password</label><input type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})}/></div>
            <button className="btnGold" style={{padding:"10px 24px",fontSize:".75rem",alignSelf:"flex-start"}} onClick={changePassword}>Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── EXPORT REPORTS PANEL ──────────────────────────────────────────────────────
function ExportPanel() {
  const [done, setDone] = useState(null);

  // ── DATA ──
  const MEMBERS_DATA = [
    {No:1,Name:"Kuya Ivan",Role:"Head",Status:"Active",Joined:"Jan 2024"},
    {No:2,Name:"Ange",Role:"Treasurer",Status:"Active",Joined:"Jan 2024"},
    {No:3,Name:"Angie",Role:"Financial Dept",Status:"Active",Joined:"Jan 2024"},
    {No:4,Name:"Ced",Role:"Events / Engagement",Status:"Active",Joined:"Feb 2024"},
    {No:5,Name:"Precious",Role:"Performance Dept",Status:"Active",Joined:"Feb 2024"},
    {No:6,Name:"Jam",Role:"Secretary",Status:"Active",Joined:"Mar 2024"},
    {No:7,Name:"Pipper",Role:"Events Dept",Status:"Active",Joined:"Mar 2024"},
    {No:8,Name:"Tine",Role:"Events / Secretary",Status:"Active",Joined:"Mar 2024"},
    {No:9,Name:"Krislene",Role:"Performance Dept",Status:"Active",Joined:"Apr 2024"},
    {No:10,Name:"Ariane",Role:"Financial Dept",Status:"Active",Joined:"Apr 2024"},
  ];
  const FINANCE_DATA = [
    {Name:"Kuya Ivan",Type:"Tithe",Amount:"₱500",Date:"Mar 1",Status:"Verified"},
    {Name:"Ange",Type:"Offering",Amount:"₱200",Date:"Mar 1",Status:"Verified"},
    {Name:"Angie",Type:"Tithe",Amount:"₱300",Date:"Mar 2",Status:"Pending"},
    {Name:"Ced",Type:"Mission Fund",Amount:"₱150",Date:"Mar 2",Status:"Verified"},
    {Name:"Precious",Type:"Offering",Amount:"₱100",Date:"Mar 3",Status:"Pending"},
  ];
  const ATTENDANCE_DATA = [
    {Date:"Mar 2 (Sunday)","Members Present":"Kuya Ivan, Ange, Ced, Jam, Precious",Count:5,Total:10,Rate:"50%"},
  ];
  const EVENTS_DATA = EVENTS.map(e=>({Date:e.date,Title:e.title,Time:e.time,Type:e.type}));

  // ── EXCEL (real .xlsx via SheetJS) ──
  const downloadExcel = async (reportKey, sheetName, data, summary) => {
    // dynamically load SheetJS
    if (!window.XLSX) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const sumRows = [
      ["Jesus The Rock of Our Salvation Mission Church"],
      [`${sheetName} — Generated: ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}`],
      [],
      ...summary.map(s => [s.label, String(s.value)]),
      [],
    ];
    const sumWS = XLSX.utils.aoa_to_sheet(sumRows);
    XLSX.utils.book_append_sheet(wb, sumWS, "Summary");

    // Data sheet
    const dataWS = XLSX.utils.json_to_sheet(data);
    // auto column width
    const cols = Object.keys(data[0]).map(k => ({wch: Math.max(k.length, ...data.map(r=>String(r[k]||"").length)) + 2}));
    dataWS["!cols"] = cols;
    XLSX.utils.book_append_sheet(wb, dataWS, sheetName);

    XLSX.writeFile(wb, `D2_${reportKey}_${new Date().getFullYear()}.xlsx`);
    setDone(reportKey+"_excel");
    setTimeout(()=>setDone(null), 2000);
  };

  // ── PDF (blob URL → new tab → auto print) ──
  const downloadPDF = (reportKey, title, headers, rows, summary) => {
    const tableRows = rows.map(row =>
      `<tr>${Object.values(row).map(v=>`<td>${v}</td>`).join("")}</tr>`
    ).join("");
    const sumCards = summary.map(s =>
      `<div class="sc"><div class="sl">${s.label}</div><div class="sv">${s.value}</div></div>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:Georgia,serif;background:#fff;color:#111;padding:36px 44px;}
      .top{text-align:center;border-bottom:3px double #C9A84C;padding-bottom:18px;margin-bottom:22px;}
      .church{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8A6A2A;margin-bottom:6px;}
      .cross{font-size:22px;color:#C9A84C;margin-bottom:6px;}
      h1{font-size:20px;font-weight:bold;margin-bottom:4px;}
      .date{font-size:11px;color:#777;}
      .sums{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:22px;}
      .sc{border:1px solid #C9A84C;padding:10px 16px;min-width:110px;}
      .sl{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8A6A2A;margin-bottom:3px;}
      .sv{font-size:17px;font-weight:bold;color:#C9A84C;}
      table{width:100%;border-collapse:collapse;font-size:11.5px;}
      thead tr{background:#1a1a2e;}
      th{color:#C9A84C;padding:9px 11px;text-align:left;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;}
      td{padding:8px 11px;border-bottom:1px solid #eee;color:#222;vertical-align:top;}
      tr:nth-child(even) td{background:#fafaf5;}
      .foot{margin-top:28px;text-align:center;font-size:9px;color:#aaa;border-top:1px solid #ddd;padding-top:10px;}
      @page{margin:16mm 14mm;}
      @media print{body{padding:0;}}
    </style></head><body>
    <div class="top">
      <div class="cross">✞</div>
      <div class="church">Jesus The Rock of Our Salvation Mission Church</div>
      <h1>${title}</h1>
      <div class="date">Generated: ${new Date().toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}</div>
    </div>
    <div class="sums">${sumCards}</div>
    <table>
      <thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="foot">JTROS Mission Church &nbsp;·&nbsp; Confidential Report &nbsp;·&nbsp; ${new Date().getFullYear()}</div>
    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`;

    const blob = new Blob([html], {type:"text/html"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    setDone(reportKey+"_pdf");
    setTimeout(()=>setDone(null), 2000);
  };

  const reports = [
    {
      key:"members", icon:"👥", title:"Member Records", color:"#7BE0B0",
      desc:"Full list of all church members with roles and status.",
      summary:[
        {label:"Total Members", value:MEMBERS_DATA.length},
        {label:"Active",        value:MEMBERS_DATA.filter(m=>m.Status==="Active").length},
        {label:"Inactive",      value:MEMBERS_DATA.filter(m=>m.Status==="Inactive").length},
      ],
      data: MEMBERS_DATA,
      pdfHeaders: Object.keys(MEMBERS_DATA[0]),
      pdfRows: MEMBERS_DATA,
    },
    {
      key:"finance", icon:"💰", title:"Finance Report", color:"#C9A84C",
      desc:"Monthly offerings, tithes, and contribution records.",
      summary:[
        {label:"Verified Total", value:`₱${[500,200,150].reduce((a,b)=>a+b,0).toLocaleString()}`},
        {label:"Pending Total",  value:`₱${[300,100].reduce((a,b)=>a+b,0).toLocaleString()}`},
        {label:"Total Records",  value:FINANCE_DATA.length},
      ],
      data: FINANCE_DATA,
      pdfHeaders: Object.keys(FINANCE_DATA[0]),
      pdfRows: FINANCE_DATA,
    },
    {
      key:"attendance", icon:"✅", title:"Attendance Report", color:"#7B9EF0",
      desc:"Attendance logs per session with attendance rate.",
      summary:[
        {label:"Sessions", value:ATTENDANCE_DATA.length},
        {label:"Last Session", value:ATTENDANCE_DATA[0]?.Date||"—"},
      ],
      data: ATTENDANCE_DATA,
      pdfHeaders: Object.keys(ATTENDANCE_DATA[0]),
      pdfRows: ATTENDANCE_DATA,
    },
    {
      key:"events", icon:"🗓", title:"Events Report", color:"#E07B7B",
      desc:"All upcoming and scheduled church events.",
      summary:[
        {label:"Total Events", value:EVENTS_DATA.length},
      ],
      data: EVENTS_DATA,
      pdfHeaders: Object.keys(EVENTS_DATA[0]),
      pdfRows: EVENTS_DATA,
    },
  ];

  const Btn = ({onClick, color, bg, icon, label, loading}) => (
    <button onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:8,padding:"11px 20px",
        background:loading?`${bg}`:bg, border:`1px solid ${color}`,
        color, cursor:"pointer", fontFamily:"'Tenor Sans',sans-serif",
        fontSize:".75rem", letterSpacing:".08em", textTransform:"uppercase",
        transition:"all .25s", opacity:loading?.7:1, whiteSpace:"nowrap"}}
      onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.color="#0A0A0F";}}
      onMouseLeave={e=>{e.currentTarget.style.background=bg;e.currentTarget.style.color=color;}}>
      <span style={{fontSize:15}}>{loading?"⏳":icon}</span>
      {loading ? "Generating..." : label}
    </button>
  );

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:8}}>📊 Export Reports</h4>
      <p style={{color:"#9A9080",marginBottom:28,fontSize:".95rem"}}>Download church records as a real Excel file or a printable PDF.</p>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {reports.map(r=>(
          <div key={r.key} style={{background:"#1A1A28",border:"1px solid #22223A",padding:28,position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${r.color},transparent)`}}/>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:20}}>
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:48,height:48,background:`${r.color}15`,border:`1px solid ${r.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {r.icon}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:"1.05rem",marginBottom:3}}>{r.title}</div>
                  <div style={{color:"#9A9080",fontSize:".85rem"}}>{r.desc}</div>
                </div>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                {/* Excel button */}
                <Btn
                  onClick={()=>downloadExcel(r.key, r.title, r.data, r.summary)}
                  color="#7BE0B0" bg="rgba(123,224,176,.1)"
                  icon="📊" label="Excel (.xlsx)"
                  loading={done===r.key+"_excel_loading"}
                />
                {/* PDF button */}
                <Btn
                  onClick={()=>downloadPDF(r.key, r.title, r.pdfHeaders, r.pdfRows, r.summary)}
                  color="#E07B7B" bg="rgba(224,123,123,.1)"
                  icon="📄" label="PDF (Print)"
                  loading={done===r.key+"_pdf_loading"}
                />
                {/* Success flash */}
                {(done===r.key+"_excel"||done===r.key+"_pdf") && (
                  <span style={{color:"#7BE0B0",fontSize:".85rem",animation:"fadeUp .3s ease"}}>
                    ✅ {done===r.key+"_excel"?"Excel downloaded!":"PDF opened!"}
                  </span>
                )}
              </div>
            </div>

            {/* Summary cards */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {r.summary.map(s=>(
                <div key={s.label} style={{padding:"10px 16px",background:"#12121A",border:`1px solid ${r.color}30`}}>
                  <div style={{fontSize:".68rem",color:r.color,fontFamily:"'Tenor Sans',sans-serif",letterSpacing:".08em",textTransform:"uppercase",marginBottom:2}}>{s.label}</div>
                  <div className="font-display" style={{fontSize:"1.15rem",color:r.color}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20,background:"#1A1A28",border:"1px solid #22223A",padding:"14px 20px",fontSize:".85rem",color:"#9A9080",borderLeft:"3px solid #C9A84C",lineHeight:1.9}}>
        📊 <strong style={{color:"#7BE0B0"}}>Excel (.xlsx)</strong> — bubukas sa Microsoft Excel o Google Sheets, may Summary at Data sheet.<br/>
        📄 <strong style={{color:"#E07B7B"}}>PDF (Print)</strong> — mag-o-open ng print dialog. Piliin ang <em style={{color:"#F0EAD6"}}>"Save as PDF"</em> sa printer options para mag-save.
      </div>
    </div>
  );
}



// ── REHEARSAL SCHEDULE PANEL ─────────────────────────────────────────────────
function RehearsalPanel() {
  const [schedules, setSchedules] = useState([
    {id:1, title:"Sunday Worship Rehearsal", date:"Mar 8 (Sat)", time:"3:00 PM", venue:"Main Hall", members:["Precious","Krislene"], status:"Confirmed"},
    {id:2, title:"Easter Special Rehearsal", date:"Mar 22 (Sat)", time:"4:00 PM", venue:"Main Hall", members:["Precious","Krislene"], status:"Confirmed"},
    {id:3, title:"Monthly Praise Night Prep", date:"Mar 29 (Sat)", time:"3:00 PM", venue:"Chapel", members:["Precious","Krislene"], status:"Tentative"},
  ]);
  const [form, setForm] = useState({title:"",date:"",time:"",venue:"",status:"Confirmed"});
  const [adding, setAdding] = useState(false);
  const add = () => {
    if(!form.title||!form.date) return;
    setSchedules([...schedules,{id:Date.now(),...form,members:["Performance Dept"]}]);
    addLog("🎭","Rehearsal scheduled: \""+form.title+"\" on "+form.date,"Performance","Performance Dept");
    setForm({title:"",date:"",time:"",venue:"",status:"Confirmed"});
    setAdding(false);
  };
  const statusColor = (s) => s==="Confirmed" ? "#7BE0B0" : s==="Tentative" ? "#E0B07B" : "#E07B7B";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>🎭 Rehearsal Schedule</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Add Schedule"}</button>
      </div>
      {adding && (
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
                {s.members?.length > 0 && (
                  <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                    {s.members.map(m=>(
                      <span key={m} style={{padding:"2px 10px",background:"rgba(176,123,224,.1)",border:"1px solid rgba(176,123,224,.3)",color:"#B07BE0",fontSize:".75rem"}}>{m}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={()=>setSchedules(schedules.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem",flexShrink:0}}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PRACTICE MATERIALS PANEL ─────────────────────────────────────────────────
function PracticePanel() {
  const [materials, setMaterials] = useState([
    {id:1, title:"Easter Sunday Song Set", type:"Song List", file:"easter_songs.pdf", uploadedBy:"Precious", date:"Mar 1", notes:"3 songs — include harmony parts"},
    {id:2, title:"Worship Chords — March", type:"Chords Sheet", file:"march_chords.pdf", uploadedBy:"Precious", date:"Mar 2", notes:"Updated chord sheets for all worship songs"},
    {id:3, title:"Performance Blocking Script", type:"Script", file:"blocking.docx", uploadedBy:"Krislene", date:"Mar 3", notes:"Stage positions for Easter presentation"},
    {id:4, title:"Vocal Warm-Up Guide", type:"Guide", file:"warmup.pdf", uploadedBy:"Precious", date:"Mar 3", notes:"Use before every rehearsal"},
  ]);
  const [form, setForm] = useState({title:"",type:"Song List",file:"",notes:""});
  const [adding, setAdding] = useState(false);
  const add = () => {
    if(!form.title) return;
    setMaterials([...materials,{id:Date.now(),...form,uploadedBy:"Performance Dept",date:"Mar "+new Date().getDate()}]);
    addLog("📚","Practice material uploaded: \""+form.title+"\" ("+form.type+")","Performance","Performance Dept");
    setForm({title:"",type:"Song List",file:"",notes:""});
    setAdding(false);
  };
  const typeIcon = (t) => t==="Song List"?"🎵":t==="Chords Sheet"?"🎸":t==="Script"?"📋":t==="Guide"?"📖":"📄";
  const typeColor = (t) => t==="Song List"?"#B07BE0":t==="Chords Sheet"?"#7BE0B0":t==="Script"?"#E0B07B":t==="Guide"?"#7B9EF0":"#C9A84C";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>📚 Practice Materials</h4>
        <button className="btnGold" style={{padding:"10px 20px",fontSize:".75rem"}} onClick={()=>setAdding(!adding)}>{adding?"Cancel":"+ Upload Material"}</button>
      </div>
      {adding && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",padding:24,marginBottom:24,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            <div><label>Title</label><input placeholder="Material title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
            <div><label>Type</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {["Song List","Chords Sheet","Script","Guide","Video Link","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label>File / Link Name</label><input placeholder="filename.pdf" value={form.file} onChange={e=>setForm({...form,file:e.target.value})}/></div>
          </div>
          <div><label>Notes</label><input placeholder="Additional notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          <div style={{border:"2px dashed #22223A",padding:24,textAlign:"center",color:"#9A9080",fontSize:".9rem",cursor:"pointer"}}>
            📎 Click to attach file
          </div>
          <button className="btnGold" style={{alignSelf:"flex-start",padding:"12px 24px",fontSize:".75rem"}} onClick={add}>Save Material</button>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {materials.map(m=>(
          <div key={m.id} style={{background:"#1A1A28",border:"1px solid #22223A",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",flex:1}}>
              <div style={{width:44,height:44,background:`${typeColor(m.type)}15`,border:`1px solid ${typeColor(m.type)}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{typeIcon(m.type)}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <div style={{fontWeight:700,fontSize:".95rem"}}>{m.title}</div>
                  <span style={{padding:"2px 8px",background:`${typeColor(m.type)}15`,border:`1px solid ${typeColor(m.type)}40`,color:typeColor(m.type),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>{m.type}</span>
                </div>
                {m.file && <div style={{color:"#C9A84C",fontSize:".85rem",marginBottom:4}}>📄 {m.file}</div>}
                {m.notes && <div style={{color:"#9A9080",fontSize:".85rem",marginBottom:4}}>{m.notes}</div>}
                <div style={{color:"#9A9080",fontSize:".8rem"}}>Uploaded {m.date} by {m.uploadedBy}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexShrink:0}}>
              <button style={{background:"none",border:"none",color:"#C9A84C",cursor:"pointer",fontSize:".85rem"}}>⬇ Download</button>
              <button onClick={()=>setMaterials(materials.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",color:"#E07B7B",cursor:"pointer",fontSize:".85rem"}}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD OVERVIEW PANEL ─────────────────────────────────────────────────
function DashboardOverviewPanel() {
  const [prayers, setPrayers] = useState(window.__prayerRequests || []);
  const [logs, setLogs] = useState(window.__activityLog || []);
  const [tab, setTab] = useState("log"); // "log" | "prayers"
  const [refresh, setRefresh] = useState(0);

  // Poll for new data every 3 seconds (simulates real-time)
  useEffect(() => {
    const t = setInterval(() => {
      setPrayers([...(window.__prayerRequests||[])]);
      setLogs([...(window.__activityLog||[])]);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    {icon:"👥", label:"Total Members",    value:"10",     color:"#7BE0B0", sub:"Active this month"},
    {icon:"💰", label:"March Offerings",  value:"₱1,250", color:"#C9A84C", sub:"Verified: ₱850"},
    {icon:"🗓", label:"Upcoming Events",  value:"6",      color:"#E07B7B", sub:"Next: Mar 9 Sunday"},
    {icon:"🙏", label:"Prayer Requests",  value:prayers.length, color:"#B07BE0", sub:`${prayers.filter(p=>!p.conf).length} public · ${prayers.filter(p=>p.conf).length} confidential`},
    {icon:"✅", label:"Last Attendance",  value:"5/10",   color:"#7B9EF0", sub:"Mar 2 Sunday Service"},
    {icon:"🎵", label:"Active Ministries",value:"6",      color:"#E0B07B", sub:"All departments active"},
  ];

  const roleColor = (r) =>
    r==="Head"?"#C9A84C":r==="Treasurer"?"#7BE0B0":r==="Financial"?"#7B9EF0":
    r==="Events Dept"?"#E07B7B":r==="Secretary"?"#E0B07B":r==="Performance"?"#B07BE0":"#9A9080";

  return (
    <div>
      <h4 className="font-display" style={{color:"#E8CC7A",marginBottom:8}}>📊 Dashboard Overview</h4>
      <p style={{color:"#9A9080",marginBottom:28,fontSize:".95rem"}}>Church summary at a glance — March 2026.</p>

      {/* Stats */}
      <div className="g3" style={{marginBottom:32}}>
        {stats.map(s=>(
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

      {/* Tab switcher */}
      <div style={{display:"flex",gap:0,marginBottom:0,borderBottom:"1px solid #22223A"}}>
        {[["log","📋 Activity Log"],["prayers","🙏 Prayer Requests"]].map(([k,lbl])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{padding:"12px 24px",background:"none",border:"none",borderBottom:tab===k?"2px solid #C9A84C":"2px solid transparent",color:tab===k?"#E8CC7A":"#9A9080",cursor:"pointer",fontFamily:"'Tenor Sans',sans-serif",fontSize:".8rem",letterSpacing:".08em",transition:"all .2s",marginBottom:"-1px"}}>
            {lbl}
            {k==="prayers" && prayers.length > 0 && (
              <span style={{marginLeft:8,background:"#B07BE0",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:".65rem",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{prayers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Activity Log Tab */}
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
                    {r.user && r.user !== r.role && <span style={{padding:"1px 8px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",color:"#E8CC7A",fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>👤 {r.user}</span>}
                    <span style={{padding:"1px 8px",background:`${roleColor(r.role)}15`,border:`1px solid ${roleColor(r.role)}40`,color:roleColor(r.role),fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>{r.role}</span>
                  </div>
                </div>
                <div style={{fontSize:".78rem",color:"#9A9080",flexShrink:0,textAlign:"right"}}>{r.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prayer Requests Tab */}
      {tab==="prayers" && (
        <div style={{background:"#1A1A28",border:"1px solid #22223A",borderTop:"none",padding:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div className="font-sans" style={{fontSize:".75rem",letterSpacing:".12em",color:"#B07BE0",textTransform:"uppercase"}}>All Prayer Requests</div>
            <span style={{fontSize:".8rem",color:"#9A9080"}}>{prayers.length} total</span>
          </div>
          {prayers.length === 0 && <div style={{textAlign:"center",padding:"32px 0",color:"#9A9080"}}>No prayer requests yet.</div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {prayers.map((p,i)=>(
              <div key={p.id||i} style={{background:"#12121A",border:`1px solid ${p.conf?"rgba(176,123,224,.3)":"#22223A"}`,padding:"16px 20px",position:"relative"}}>
                {p.conf && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#B07BE0,transparent)"}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontWeight:700,color:p.conf?"#B07BE0":"#E8CC7A"}}>{p.name}</span>
                    {p.conf && <span style={{padding:"2px 8px",background:"rgba(176,123,224,.1)",border:"1px solid rgba(176,123,224,.4)",color:"#B07BE0",fontSize:".7rem",fontFamily:"'Tenor Sans',sans-serif"}}>🔒 Confidential</span>}
                  </div>
                  <span style={{fontSize:".8rem",color:"#9A9080"}}>{p.date} · {p.time}</span>
                </div>
                <div style={{color:"#B0A898",fontSize:".95rem",lineHeight:1.7}}>{p.req}</div>
                <div style={{display:"flex",gap:12,marginTop:12}}>
                  <button onClick={()=>{window.__prayerRequests=(window.__prayerRequests||[]).filter(x=>x.id!==p.id);setPrayers([...window.__prayerRequests]);}} style={{background:"none",border:"1px solid rgba(224,123,123,.4)",color:"#E07B7B",cursor:"pointer",padding:"4px 12px",fontSize:".75rem",fontFamily:"'Tenor Sans',sans-serif"}}>✓ Mark Prayed</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SYSTEM SETTINGS PANEL ────────────────────────────────────────────────────
function SystemSettingsPanel({user, onUpdateUser}) {
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
  const save = () => { setSaved(true); setEditing(false); setTimeout(()=>setSaved(false), 2500); };
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
  return (
    <div style={{maxWidth:640}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <h4 className="font-display" style={{color:"#E8CC7A"}}>⚙️ System Settings</h4>
        <div style={{display:"flex",gap:10}}>
          {editing ? (
            <>
              <button className="btnGold" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={save}>Save Changes</button>
              <button className="btnOut"  style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btnOut" style={{padding:"8px 20px",fontSize:".75rem"}} onClick={()=>setEditing(true)}>✏️ Edit Settings</button>
          )}
        </div>
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
        <Toggle label="Allow New Signups"  field="allowSignup"      desc="Allow new members to register accounts."/>
        <Toggle label="Maintenance Mode"   field="maintenanceMode"  desc="Temporarily disable public access."/>
      </div>
    </div>
  );
}
// ── DASHBOARD — with openProfile trigger ──────────────────────────────────────
function Dashboard({user, onLogout, openProfileOnLoad, onUpdateUser}) {
  const access = ROLE_ACCESS[user.role] || [];
  const [activePanel, setActivePanel] = useState(openProfileOnLoad ? "My Profile" : null);

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
    if(n.includes("finance")||n.includes("donation")||n.includes("budget")||
       n.includes("contribut")||n.includes("financial"))           return <FinancePanel/>;
    if(n.includes("event"))                                         return <EventsPanel viewOnly={user.role==="member"}/>;
    if(n.includes("announcement"))                                  return <AnnouncementsPanel/>;
    if(n.includes("document"))                                      return <DocumentsPanel/>;
    if(n.includes("attendance")||n.includes("visitor")||n.includes("follow"))
                                                                    return <AttendancePanel/>;
    if(n.includes("rehearsal")||n.includes("rehearsal schedule"))  return <RehearsalPanel/>;
    if(n.includes("practice")||n.includes("practice materials"))    return <PracticePanel/>;
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
            <div className="g3" style={{marginBottom:32}}>
              {[{l:"Total Members",v:"10",i:"👥"},{l:"March Offerings",v:"₱1,250",i:"💰"},{l:"Upcoming Events",v:"6",i:"🗓"},{l:"Prayer Requests",v:"8",i:"🙏"},{l:"Last Sunday",v:"5/10",i:"✅"},{l:"Active Ministries",v:"6",i:"🎵"}].map(s=>(
                <div key={s.l} style={{background:"#12121A",border:"1px solid #22223A",padding:"20px 24px",position:"relative"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${user.color},transparent)`}}/>
                  <div style={{fontSize:24,marginBottom:8}}>{s.i}</div>
                  <div className="font-display" style={{fontSize:"1.8rem",color:user.color}}>{s.v}</div>
                  <div style={{color:"#9A9080",fontSize:".85rem"}}>{s.l}</div>
                </div>
              ))}
            </div>
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
if (!window.__prayerRequests) window.__prayerRequests = [
  {id:1, name:"Anonymous",    req:"Please pray for my family's healing.",          conf:false, date:"Mar 1", time:"9:12 AM"},
  {id:2, name:"Kuya Ivan",    req:"Prayer for this Sunday's sermon preparation.",   conf:false, date:"Mar 2", time:"10:05 AM"},
  {id:3, name:"Church Member",req:"Confidential prayer request.",                   conf:true,  date:"Mar 2", time:"11:30 AM"},
  {id:4, name:"Ange",         req:"Prayer for wisdom in managing the finances.",    conf:false, date:"Mar 3", time:"8:45 AM"},
  {id:5, name:"Anonymous",    req:"Please intercede for a sick loved one.",         conf:false, date:"Mar 3", time:"2:00 PM"},
];
if (!window.__activityLog) window.__activityLog = [
  {icon:"🙏", msg:"Prayer submitted — For our church family",           role:"Member",      user:"Anonymous",  time:"Mar 3 · 10:30 AM"},
  {icon:"💰", msg:"Recorded Tithe: Kuya Ivan — ₱500",              role:"Financial",   user:"Angie",      time:"Mar 1 · 09:15 AM"},
  {icon:"📅", msg:"New event: Easter Sunday Special on Apr 20",         role:"Events Dept", user:"Ced",        time:"Mar 1 · 08:00 AM"},
  {icon:"📢", msg:"Announcement posted: Holy Week Schedule",            role:"Secretary",   user:"Jam",        time:"Mar 2 · 11:00 AM"},
  {icon:"🎵", msg:"Song added: How Great Is Our God by Chris Tomlin",   role:"Performance", user:"Precious",   time:"Mar 2 · 02:00 PM"},
  {icon:"📄", msg:"Document uploaded: March Minutes.pdf",               role:"Secretary",   user:"Tine",       time:"Mar 2 · 03:30 PM"},
  {icon:"🎭", msg:"Rehearsal scheduled: Sunday Worship Rehearsal",      role:"Performance", user:"Krislene",   time:"Mar 3 · 09:00 AM"},
  {icon:"✅",    msg:"Attendance recorded — 5/10 present",                role:"Secretary",   user:"Tine",       time:"Mar 2 · 09:45 AM"},
];

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
  const updateUser = ({username, photo, fullName}) => {
    setUser(prev => ({...prev, username: username || prev.username, photo: photo || prev.photo, fullName: fullName || prev.fullName}));
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
    <>
      <style>{style}</style>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,transition:"all .3s",background:scrolled?"rgba(10,10,15,.95)":"rgba(10,10,15,.6)",backdropFilter:"blur(12px)",borderBottom:scrolled?"1px solid rgba(201,168,76,.2)":"1px solid transparent",padding:"0 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>user ? go("Dashboard") : go("Home")}>
            <div style={{fontSize:22,color:"#C9A84C"}}>✞</div>
            <div>
              <div className="font-display" style={{fontSize:".65rem",color:"#C9A84C",letterSpacing:".1em"}}>JESUS THE ROCK</div>
              <div className="font-sans" style={{fontSize:".55rem",color:"#8A6A2A",letterSpacing:".15em"}}>OF OUR SALVATION</div>
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
          <div className="font-sans" style={{fontSize:".7rem",letterSpacing:".15em",color:"#8A6A2A",marginBottom:24}}>· SERVING BY FAITH</div>
          <div className="ornament" style={{justifyContent:"center",marginBottom:24}}>
            <span style={{color:"#9A9080",fontStyle:"italic",fontSize:".95rem"}}>"He only is my rock and my salvation; he is my defence; I shall not be moved." — Psalm 62:6</span>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",marginBottom:32}}>
            {["Home","About","Ministries","Events","Give","Prayer"].map(n=>(
              <span key={n} className="navLink font-sans" style={{fontSize:".7rem",letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",color:"#9A9080"}} onClick={()=>go(n)}>{n}</span>
            ))}
          </div>
          {/* <div style={{color:"#3A3A50",fontSize:".8rem"}}>© 2026 Jesus The Rock of Our Salvation Mission Church · Built with Faith</div> */}
          <div style={{color:"#3A3A50",fontSize:".8rem"}}>© 2026 Morisoul</div>
        </div>
      </footer>
    </>
  );
}