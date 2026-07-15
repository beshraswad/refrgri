"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const projects = [
  { name: "Baseline 52°C", ref: "R410A · 12 Jun", cop: 3.42, power: 1.84, cond: 52.1, water: 0, color: "#0f766e" },
  { name: "Fogging", ref: "R410A · 14 Jun", cop: 3.91, power: 1.62, cond: 47.8, water: 8.4, color: "#2f73da" },
  { name: "Misting", ref: "R410A · 16 Jun", cop: 3.77, power: 1.69, cond: 48.9, water: 6.2, color: "#8b5cf6" },
  { name: "Shading + Fogging", ref: "R410A · 18 Jun", cop: 4.08, power: 1.55, cond: 46.4, water: 8.1, color: "#e8793b" },
];

const states = [
  { n: 1, label: "Evaporator outlet", t: 7.2, p: 9.31, h: 421.8, s: 1.81 },
  { n: 2, label: "Compressor outlet", t: 77.4, p: 31.24, h: 455.6, s: 1.85 },
  { n: 3, label: "Condenser outlet", t: 43.1, p: 31.18, h: 271.5, s: 1.22 },
  { n: 4, label: "Expansion outlet", t: 2.8, p: 9.38, h: 271.5, s: 1.26 },
];

const icons: Record<string, string> = { Project: "▦", Refrigerant: "◉", "EES data": "⇩", Experimental: "⌁", Arduino: "⌁", Analysis: "⌬", Psychrometrics: "◒", Graphs: "⌁", Reports: "▤" };

export default function Home() {
  const [active, setActive] = useState("Analysis");
  const [selected, setSelected] = useState(0);
  const [checked, setChecked] = useState([0,1,2,3]);
  const [tab, setTab] = useState<"ph"|"ts">("ph");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<"none"|"compare"|"manual"|"refrigerant">("none");
  const fileRef = useRef<HTMLInputElement>(null);
  const p = projects[selected];
  const savings = useMemo(() => Math.round((1 - p.power/projects[0].power)*100), [p]);

  const notify = (msg:string) => { setToast(msg); window.setTimeout(() => setToast(""), 2600); };
  const importFile = (e:React.ChangeEvent<HTMLInputElement>) => { const f=e.target.files?.[0]; if(f) notify(`${f.name} imported · 4 state points detected`); };

  return <main className="app-shell">
    <header className="topbar">
      <div className="brandmark"><span className="mark">R</span><div><strong>RefrigLab</strong><small>THERMAL RESEARCH WORKSPACE</small></div></div>
      <div className="project-title"><span className="status-dot"/><div><strong>{p.name}</strong><small>Last saved 2 minutes ago</small></div><button aria-label="Project menu">⌄</button></div>
      <div className="top-actions"><button className="ghost" onClick={()=>notify("Project saved locally")}>✓ Saved</button><button className="primary" onClick={()=>notify("PDF report prepared for export")}>Export report <span>↗</span></button><button className="avatar">AM</button></div>
    </header>

    <aside className="sidebar">
      <button className="new-project" onClick={()=>notify("New project workspace created")}><span>＋</span> New project</button>
      <nav>{["Project","Refrigerant","EES data","Experimental","Arduino","Analysis","Psychrometrics","Graphs","Reports"].map(item=><button key={item} className={active===item?"active":""} onClick={()=>setActive(item)}><span>{icons[item]}</span>{item}{item==="Arduino"&&<em>OFF</em>}</button>)}</nav>
      <div className="sidebar-bottom"><p>PROJECT LIBRARY</p>{projects.slice(0,3).map((x,i)=><button key={x.name} onClick={()=>setSelected(i)}><i style={{background:x.color}}/>{x.name}</button>)}<button className="open" onClick={()=>notify("Project library opened")}>Open project <span>›</span></button><button className="help">? <span>Help & documentation</span></button></div>
    </aside>

    {active==="Psychrometrics"?<PsychrometricPage notify={notify}/>:active==="Refrigerant"?<RefrigerantPage notify={notify}/>:<section className="workspace">
      <div className="heading-row"><div><p className="eyebrow">THERMODYNAMIC ANALYSIS</p><h1>Cycle performance</h1><p>Steady-state vapor-compression analysis · R410A</p></div><div className="conditions"><span>Ambient <b>35.2 °C</b></span><span>Humidity <b>48.6%</b></span><span>Samples <b>1,240</b></span></div></div>

      <div className="metrics">
        <article><div className="metric-top"><span>COP</span><i className="up">↗ 14.3%</i></div><strong>{p.cop.toFixed(2)}</strong><small>Baseline 3.42</small><div className="spark"><b style={{width:`${p.cop/4.3*100}%`}}/></div></article>
        <article><div className="metric-top"><span>Refrigeration effect</span><i>kJ/kg</i></div><strong>150.3</strong><small>h₁ − h₄</small><div className="mini-line">⌁</div></article>
        <article><div className="metric-top"><span>Compressor work</span><i>kJ/kg</i></div><strong>38.4</strong><small>h₂ − h₁</small><div className="mini-line teal">⌁</div></article>
        <article><div className="metric-top"><span>Energy saving</span><i className="up">↗</i></div><strong>{Math.max(0,savings)}<sup>%</sup></strong><small>vs baseline case</small><div className="bars"><b/><b/><b/><b/></div></article>
      </div>

      <div className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-head"><div><h2>{tab==="ph"?"Pressure–enthalpy diagram":"Temperature–entropy diagram"}</h2><p>{tab==="ph"?"Logarithmic pressure scale":"Cycle temperature and entropy"} · R410A</p></div><div className="tabs"><button className={tab==="ph"?"selected":""} onClick={()=>setTab("ph")}>P–h</button><button className={tab==="ts"?"selected":""} onClick={()=>setTab("ts")}>T–s</button></div></div>
          <div className="chart">
            <div className="ylabel">{tab==="ph"?"PRESSURE (bar)":"TEMPERATURE (°C)"}</div><div className="gridlines"><i/><i/><i/><i/><i/></div>
            <div className="dome"><span/></div>
            <svg viewBox="0 0 700 330" preserveAspectRatio="none"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#e26d38"/></marker></defs><polyline className="cycle" points={tab==="ph"?"130,250 315,70 570,75 520,245 130,250":"130,245 300,55 570,110 430,260 130,245"}/></svg>
            {[[18,72],[45,17],[82,18],[75,72]].map((pt,i)=><button key={i} className="state-dot" style={{left:`${pt[0]}%`,top:`${pt[1]}%`}} title={states[i].label}>{i+1}</button>)}
            <span className="phase liquid">SUBCOOLED<br/>LIQUID</span><span className="phase two">TWO-PHASE<br/>REGION</span><span className="phase vapor">SUPERHEATED<br/>VAPOR</span><div className="xlabel">{tab==="ph"?"ENTHALPY (kJ/kg)":"ENTROPY (kJ/kg·K)"}</div>
          </div>
          <div className="legend"><span><i className="orange"/> Experimental cycle</span><span><i className="gray"/> Saturation dome</span><button onClick={()=>notify("Diagram downloaded as SVG")}>↓ SVG</button><button onClick={()=>notify("Diagram downloaded as PNG")}>↓ PNG</button></div>
        </article>

        <article className="panel state-panel"><div className="panel-head"><div><h2>State points</h2><p>Imported from EES · 10:42 AM</p></div><button className="more">•••</button></div><table><thead><tr><th>STATE</th><th>T °C</th><th>P bar</th><th>h kJ/kg</th></tr></thead><tbody>{states.map(s=><tr key={s.n}><td><b>{s.n}</b><span>{s.label}</span></td><td>{s.t}</td><td>{s.p}</td><td>{s.h}</td></tr>)}</tbody></table><button className="text-button" onClick={()=>fileRef.current?.click()}>⇩ Import new EES results</button><input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" hidden onChange={importFile}/></article>

        <article className="panel experiment-panel"><div className="panel-head"><div><h2>Experimental conditions</h2><p>Mean values over stable interval</p></div><button className="outline" onClick={()=>setModal("manual")}>＋ Add reading</button></div><div className="condition-grid">{[["Suction temp.","7.2","°C"],["Discharge temp.","77.4","°C"],["Suction pressure","9.31","bar"],["Discharge pressure","31.24","bar"],["Power","1.62","kW"],["Current","7.08","A"],["Voltage","229.4","V"],["Water usage",p.water.toFixed(1),"L/h"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]} <small>{x[2]}</small></strong></div>)}</div></article>

        <article className="panel compare-panel"><div className="panel-head"><div><h2>Quick comparison</h2><p>Four experimental configurations</p></div><button className="outline" onClick={()=>setModal("compare")}>Compare projects</button></div><div className="compare-chart"><div className="axis"><span>4.5</span><span>3.0</span><span>1.5</span><span>0</span></div>{projects.map((x,i)=><button key={x.name} onClick={()=>setSelected(i)} className={selected===i?"chosen":""}><div className="bar-wrap"><i style={{height:`${x.cop/4.5*100}%`,background:x.color}}><b>{x.cop}</b></i></div><span>{x.name.replace(" + "," +\n")}</span></button>)}</div><div className="compare-foot"><span><i/> COP</span><span>Higher is better ↑</span></div></article>
      </div>
    </section>}

    {modal!=="none"&&<div className="modal-backdrop" onMouseDown={()=>setModal("none")}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setModal("none")}>×</button>{modal==="compare"?<><p className="eyebrow">MULTI-CASE STUDY</p><h2>Compare projects</h2><p>Select the cases to overlay in the performance analysis.</p><div className="check-list">{projects.map((x,i)=><label key={x.name}><input type="checkbox" checked={checked.includes(i)} onChange={()=>setChecked(c=>c.includes(i)?c.filter(v=>v!==i):[...c,i])}/><i style={{background:x.color}}/>{x.name}<span>COP {x.cop}</span></label>)}</div><button className="primary wide" onClick={()=>{setModal("none");notify(`${checked.length} projects added to comparison`)}}>Generate comparison</button></>:modal==="manual"?<><p className="eyebrow">EXPERIMENTAL DATA</p><h2>Add manual reading</h2><div className="form-grid">{["Temperature (°C)","Pressure (bar)","Power (kW)","Current (A)","Voltage (V)","Humidity (%)"].map(x=><label key={x}>{x}<input placeholder="0.00"/></label>)}</div><button className="primary wide" onClick={()=>{setModal("none");notify("Experimental reading saved")}}>Save reading</button></>:<></>}</div></div>}
    {toast&&<div className="toast"><span>✓</span>{toast}</div>}
  </main>;
}

function PsychrometricPage({notify}:{notify:(s:string)=>void}) {
  const [points,setPoints]=useState([{label:"Outdoor air",db:35.2,rh:48.6,w:17.4,color:"#e26d38"},{label:"Condenser inlet",db:30.8,rh:64.1,w:17.5,color:"#0f766e"}]);
  const importRef=useRef<HTMLInputElement>(null);
  const handle=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(f){setPoints(p=>[...p,{label:f.name.replace(/\.[^.]+$/,""),db:27.4,rh:58.2,w:13.2,color:"#2f73da"}]);notify(`${f.name} imported to psychrometric chart`)}};
  return <section className="workspace"><div className="heading-row"><div><p className="eyebrow">AIR-SIDE ANALYSIS</p><h1>Psychrometric chart</h1><p>Visualize moist-air states and treatment processes</p></div><div><button className="outline" onClick={()=>importRef.current?.click()}>⇩ Import data</button><input hidden ref={importRef} type="file" accept=".csv,.xlsx,.xls" onChange={handle}/></div></div><div className="psych-layout"><article className="panel psych-chart"><div className="panel-head"><div><h2>Moist-air process</h2><p>Sea-level pressure · SI units</p></div><button className="outline" onClick={()=>notify("Psychrometric chart exported as PNG")}>↓ PNG</button></div><div className="psych-plot"><div className="rh-curves">{[1,2,3,4,5,6,7,8].map(n=><i key={n}/>)}</div><svg viewBox="0 0 760 390" preserveAspectRatio="none"><path className="sat-line" d="M20 365 C180 350 270 300 360 230 C470 140 580 70 740 25"/><polyline className="psych-process" points="500,150 405,205 320,250"/></svg>{points.map((x,i)=><button className="psych-point" key={x.label} style={{left:`${Math.min(88,20+x.db*1.8)}%`,bottom:`${Math.min(82,8+x.w*3)}%`,background:x.color}} title={x.label}>{i+1}</button>)}<span className="psych-y">HUMIDITY RATIO (g/kg dry air)</span><span className="psych-x">DRY-BULB TEMPERATURE (°C)</span></div></article><article className="panel psych-data"><div className="panel-head"><div><h2>Air state points</h2><p>{points.length} states in current dataset</p></div></div>{points.map((x,i)=><div className="air-row" key={x.label}><b style={{background:x.color}}>{i+1}</b><div><strong>{x.label}</strong><small>{x.db} °C dry bulb</small></div><span>{x.rh}%<small>RH</small></span><span>{x.w}<small>g/kg</small></span></div>)}<div className="data-note"><strong>Expected columns</strong><p>label, dry_bulb_c, relative_humidity_pct. Optional: pressure_kpa, wet_bulb_c, humidity_ratio.</p></div></article></div></section>
}

function RefrigerantPage({notify}:{notify:(s:string)=>void}) {
 const builtins=["R410A","R134a","R32","R22","R1234yf","Ammonia (R717)","CO₂ (R744)"];
 const ref=useRef<HTMLInputElement>(null); const [installed,setInstalled]=useState<string[]>([]);
 useEffect(()=>{fetch("/api/storage?type=refrigerant").then(r=>r.json()).then(x=>setInstalled(x.items||[])).catch(()=>{})},[]);
 const upload=async(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const content=await f.text();const name=f.name.replace(/\.csv$/i,"");try{await fetch("/api/storage",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"refrigerant",name,content})});setInstalled(x=>[...new Set([...x,name])]);notify(`${name} property table saved permanently`)}catch{notify("Upload could not be saved")}};
 return <section className="workspace"><div className="heading-row"><div><p className="eyebrow">PROPERTY LIBRARY</p><h1>Refrigerants</h1><p>Local property-table catalog for reproducible analysis</p></div><button className="primary" onClick={()=>ref.current?.click()}>＋ Add refrigerant</button><input hidden ref={ref} type="file" accept=".csv" onChange={upload}/></div><div className="refrigerant-grid">{builtins.map((x,i)=><article className="panel ref-card" key={x}><div className="ref-symbol">{x.includes("(")?x.match(/R\d+/)?.[0]:x}</div><h2>{x}</h2><p>Catalog entry included</p><span className={installed.includes(x)?"installed":"missing"}>{installed.includes(x)?"● Property table installed":"○ Property table required"}</span><button onClick={()=>ref.current?.click()}>{installed.includes(x)?"Replace CSV":"Import property CSV"}</button></article>)}<article className="panel ref-card custom"><div className="ref-symbol">＋</div><h2>Custom entry</h2><p>Add any refrigerant or mixture</p><button onClick={()=>ref.current?.click()}>Choose CSV</button></article></div><article className="panel schema-panel"><h2>CSV property-table format</h2><p>Upload once; it is stored in the Railway volume and becomes available to every future project.</p><code>temperature_c, pressure_bar, enthalpy_kj_kg, entropy_kj_kg_k, density_kg_m3, phase</code></article></section>
}
