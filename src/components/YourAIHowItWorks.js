import React from "react";

import {
    BsCameraVideo,
    BsRobot,
    BsGraphUpArrow
} from "react-icons/bs";

const steps = [

    {
        icon:<BsCameraVideo />,
        number:"01",
        title:"Join Any Interview",
        desc:"Connect with Zoom, Google Meet or Microsoft Teams without changing your workflow."
    },

    {
        icon:<BsRobot />,
        number:"02",
        title:"AI Works In Real Time",
        desc:"Receive live coaching, coding hints, HR suggestions and confidence analysis."
    },

    {
        icon:<BsGraphUpArrow />,
        number:"03",
        title:"Improve Every Interview",
        desc:"Review detailed analytics, communication scores and technical performance."
    }

];

const YourAIHowItWorks = () => {

    return (

<section className="howworks">

<div className="howworks-container">

<span className="section-badge">

How It Works

</span>

<h2>

Ace Your Interview In

<span> 3 Simple Steps</span>

</h2>

<p className="section-desc">

From joining your interview to receiving
AI-powered feedback, AzentMart AI guides
you every step of the way.

</p>

<div className="steps">

{

steps.map((step,index)=>(

<div className="step-card" key={index}>

<div className="step-number">

{step.number}

</div>

<div className="step-icon">

{step.icon}

</div>

<h3>

{step.title}

</h3>

<p>

{step.desc}

</p>

</div>

))

}

</div>

<div className="workflow">

<div className="workflow-header">

<div className="workflow-dot red"></div>
<div className="workflow-dot yellow"></div>
<div className="workflow-dot green"></div>

</div>

<div className="workflow-body">

<div className="workflow-left">

<h3>Interview Session</h3>

<div className="timeline">

<div>🎤 Candidate Speaking</div>

<div>💻 AI Detecting Keywords</div>

<div>🤖 Generating Suggestions</div>

<div>📊 Performance Tracking</div>

<div>✅ Interview Completed</div>

</div>

</div>

<div className="workflow-right">

<div className="score-box">

Confidence

<strong>96%</strong>

</div>

<div className="score-box">

Technical

<strong>98%</strong>

</div>

<div className="score-box">

Communication

<strong>94%</strong>

</div>

</div>

</div>

</div>

</div>

</section>

    );

};

export default YourAIHowItWorks;