import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

/* AGENT DATA */

const agents = [
{
id:"datapulseanalytics",
name:"DataPulse Analytics",
industry:"Operations",
tier:"Enterprise",
rating:4.95,

desc:"Deep analytics and reporting automation for data-driven businesses.",

overview:
"DataPulse Analytics is an AI-powered analytics platform designed to automate business reporting and data visualization. It connects with multiple data sources and generates real-time dashboards, anomaly alerts, and predictive insights.",

demoVideo:"https://www.youtube.com/embed/p6nc1Uqbs6U",

screenshots:[
"/images/datapulse1.png",
"/images/datapulse2.png",
"/images/datapulse3.png"
],

features:[
"Real-time AI dashboards",
"Automated KPI reporting",
"Predictive analytics",
"Smart anomaly detection"
],

usecases:[
"Operations monitoring",
"Sales performance tracking",
"Marketing analytics",
"Financial forecasting"
],

autonomy:92,

industries:[
"Operations",
"Analytics",
"Business Intelligence",
"Automation"
]
}
];


/* SIMILAR AGENTS */

const similarAgents = [
{
name:"SalesForge AI",
desc:"AI-powered sales pipeline automation."
},
{
name:"SupportGenius",
desc:"Customer support automation agent."
},
{
name:"FinanceFlow Agent",
desc:"Financial analytics and forecasting AI."
}
];


function AgentDetails(){

const { agentId } = useParams();

const agent = agents.find(a => a.id === agentId);

if(!agent){
return(
<div style={{color:"white",padding:"120px",textAlign:"center"}}>
Agent not found
</div>
)
}

return(

<section className="agent-details">

<div className="container">


{/* HEADER */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="row align-items-center">

<div className="col-lg-6">

<h1>{agent.name}</h1>

<div className="d-flex gap-2 my-2">

<span className="tag">{agent.industry}</span>
<span className="tier">{agent.tier}</span>

</div>

<div className="rating d-flex align-items-center gap-2">

{[...Array(Math.round(agent.rating))].map((_,i)=>(
<FaStar key={i}/>
))}

<span>{agent.rating}</span>

</div>

</div>


<div className="col-lg-6 text-lg-end">

<p className="agent-desc">
{agent.desc}
</p>

<button className="activate-btn mt-3">
Activate Agent
</button>

</div>

</div>

</div>

</div>



{/* PRODUCT DEMO */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2 className="text-center mb-4">Product Demo</h2>

<div className="ratio ratio-16x9">
<iframe
src={agent.demoVideo}
title="Agent Demo"
allowFullScreen
></iframe>
</div>

</div>

</div>

</div>



{/* SCREENSHOTS */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2 className="text-center mb-4">Dashboard Preview</h2>

<div className="row g-4">

{agent.screenshots.map((img,i)=>(
<div className="col-12 col-md-6 col-lg-4" key={i}>
<img src={img} alt="dashboard" className="img-fluid rounded"/>
</div>
))}

</div>

</div>

</div>

</div>



{/* OVERVIEW */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2>Overview</h2>

<p>{agent.overview}</p>

</div>

</div>

</div>



{/* FEATURES */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2>Key Features</h2>

<ul>

{agent.features.map((f,i)=>(
<li key={i}>{f}</li>
))}

</ul>

</div>

</div>

</div>



{/* USE CASES */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2>Use Cases</h2>

<ul>

{agent.usecases.map((u,i)=>(
<li key={i}>{u}</li>
))}

</ul>

</div>

</div>

</div>



{/* AUTONOMY LEVEL */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2>Autonomy Level</h2>

<div className="progress">

<div
className="progress-bar bg-success"
style={{width:`${agent.autonomy}%`}}
>

{agent.autonomy}%

</div>

</div>

<p className="mt-3">
This AI agent operates autonomously by analyzing incoming data streams,
detecting anomalies, and generating reports automatically.
</p>

</div>

</div>

</div>



{/* INDUSTRIES */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2>Industries</h2>

<div className="d-flex flex-wrap gap-2">

{agent.industries.map((tag,i)=>(
<span key={i} className="tag">{tag}</span>
))}

</div>

</div>

</div>

</div>



{/* PRICING */}

<div className="row justify-content-center mb-5">

<div className="col-lg-10">

<div className="agent-section">

<h2 className="mb-4">Pricing Model</h2>

<div className="row g-4">

<div className="col-md-4">

<div className="pricing-box">

<h4>Free</h4>

<p>Demo</p>

</div>

</div>

<div className="col-md-4">

<div className="pricing-box">

<h4>Pro</h4>

<p>Advanced analytics and AI predictions</p>

</div>

</div>

<div className="col-md-4">

<div className="pricing-box">

<h4>Enterprise</h4>

<p>Unlimited automation and integrations</p>

</div>

</div>

</div>

</div>

</div>

</div>



{/* SIMILAR AGENTS */}

<div className="row justify-content-center">

<div className="col-lg-10">

<div className="agent-section">

<h2 className="mb-4">Similar Agents</h2>

<div className="row g-4">

{similarAgents.map((a,i)=>(
<div className="col-md-4" key={i}>

<div className="similar-agent-card">

<h5>{a.name}</h5>

<p>{a.desc}</p>

<Link to="/marketplace" className="view-btn">
View Agent
</Link>

</div>

</div>
))}

</div>

</div>

</div>

</div>


</div>

</section>

)

}

export default AgentDetails