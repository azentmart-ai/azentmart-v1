import json, re
from typing import Any
from ..db import settings

def _ask(prompt: str, system: str) -> str:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    from openai import OpenAI
    client=OpenAI(api_key=settings.openai_api_key)
    response=client.responses.create(model=settings.openai_model,instructions=system,input=prompt)
    return response.output_text.strip()

def ask_json(prompt: str, fallback: dict[str,Any], system="You are AzentMartAI, an evidence-based recruiting assistant. Return valid JSON only."):
    try:
        text=_ask(prompt,system)
        try: return json.loads(text)
        except json.JSONDecodeError:
            m=re.search(r"\{.*\}",text,re.S)
            return json.loads(m.group(0)) if m else fallback
    except Exception:
        return fallback

def generate_jd(title,seniority,skills,workplace,requirements="",department=""):
    skills=[s for s in skills if s]
    fallback={"title":title,"summary":f"We are looking for a {seniority} {title} to join the {department or 'team'} and deliver reliable, scalable solutions.","responsibilities":[f"Build and maintain systems for the {title} role.","Collaborate with product, engineering and stakeholders.","Write production-quality code and tests.","Contribute to technical design, delivery and documentation."],"requirements":[requirements or f"Relevant experience as a {title}.","Strong communication and problem-solving skills."],"skills":skills,"interview_focus":["Technical depth","Problem solving","Role-specific experience"]}
    return ask_json(f"Create a professional job description. Title: {title}; Department: {department}; Seniority: {seniority}; Workplace: {workplace}; Skills: {skills}; Requirements: {requirements}. Return JSON keys title,summary,responsibilities,requirements,skills,interview_focus.",fallback)

def match_candidate(job,candidate):
    required={x.lower() for x in job.get("skills",[])}
    actual={x.lower() for x in candidate.get("skills",[])}
    overlap=required & actual
    skill_score=(len(overlap)/len(required)*60) if required else 30
    exp=min(float(candidate.get("experience") or 0)/5,1)*25
    evidence=skill_score+exp+15
    score=round(min(100,evidence))
    strengths=[f"Matches: {', '.join(sorted(overlap))}"] if overlap else []
    gaps=[f"Missing listed skill: {x}" for x in sorted(required-actual)[:4]]
    fallback={"score":score,"summary":f"Matched {len(overlap)} of {len(required)} listed skills with available experience evidence.","strengths":strengths,"gaps":gaps,"evidence":[f"Candidate skills: {', '.join(candidate.get('skills',[])) or 'not provided'}",f"Experience: {candidate.get('experience') or 'not provided'}"],"recommendation":"shortlist" if score>=75 else ("review" if score>=55 else "hold")}
    prompt=f"Evaluate candidate against job using only supplied evidence. JOB={json.dumps(job)} CANDIDATE={json.dumps(candidate)}. Return JSON keys score 0-100, summary, strengths array, gaps array, evidence array, recommendation (review/shortlist/hold)."
    return ask_json(prompt,fallback)

def screen_resume(text,job=None):
    # Fallback parser is intentionally conservative; LLM improves extraction when configured.
    email=(re.search(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',text) or [None])[0]
    phone=(re.search(r'(\+?\d[\d\s().-]{8,}\d)',text) or [None])[0]
    first="Unknown"; last=""
    if text.strip():
        first_line=next((x.strip() for x in text.splitlines() if x.strip()),"Unknown")
        parts=first_line.split()
        if 1<=len(parts)<=4: first=parts[0]; last=" ".join(parts[1:])
    skills=[s for s in ["Python","Java","JavaScript","TypeScript","React","Node.js","FastAPI","Flask","SQL","PostgreSQL","MongoDB","AWS","Azure","GCP","Docker","Kubernetes","TensorFlow","PyTorch"] if re.search(rf"\b{re.escape(s)}\b",text,re.I)]
    years=None
    m=re.search(r'(\d+(?:\.\d+)?)\+?\s+years?',text,re.I)
    if m: years=float(m.group(1))
    fallback={"first_name":first,"last_name":last,"email":email,"phone":phone,"linkedin_url":None,"github_url":None,"portfolio_url":None,"total_experience_years":years,"skills":skills,"education":[],"experience":[],"summary":text[:500],"match_score":None,"strengths":[],"gaps":[]}
    return ask_json(f"Parse this resume into job-relevant JSON. RESUME={text[:30000]}. JOB={json.dumps(job or {})}. Return keys first_name,last_name,email,phone,linkedin_url,github_url,portfolio_url,total_experience_years,skills,education,experience,summary,match_score,strengths,gaps. Only extract supplied evidence.",fallback,system="You extract structured recruitment data from resumes. Return JSON only and never invent missing information.")

def interview_questions(job,candidate,count=6):
    qs=[("Technical","Explain a recent technical project relevant to this role and the decisions you made."),("Problem solving","Describe a difficult production problem you solved and how you approached it."),("Role depth",f"How would you approach the core responsibilities of a {job.get('title','this role')}?"),("Skills","Tell me about your hands-on experience with the most relevant skills listed for this role."),("Collaboration","Describe a situation where you had to resolve a technical disagreement with a teammate."),("Ownership","Tell me about a delivery you owned from planning through production.")]
    fallback={"questions":[{"category":c,"question":q,"follow_up":"What was the outcome and what would you do differently?"} for c,q in qs[:max(1,min(count,10))]]}
    return ask_json(f"Create {count} evidence-based interview questions for JOB={json.dumps(job)} CANDIDATE={json.dumps(candidate)}. Return JSON {{questions:[{{category,question,follow_up}}]}}.",fallback)

def evaluate_interview(job,candidate,transcript):
    answered=len([x for x in transcript if x.get("answer","").strip()])
    score=round(min(100,35+answered/max(1,len(transcript))*45+(10 if candidate.get("skills") else 0)))
    fallback={"score":score,"recommendation":"shortlist" if score>=75 else ("review" if score>=55 else "hold"),"summary":f"Evaluation based on {answered} captured response(s). Review the evidence and transcript before making a hiring decision.","strengths":["Responses were captured for review." if answered else "No responses captured."],"concerns":["Additional evidence may be needed."],"question_scores":[{"question":x.get("question",""),"score":70 if x.get("answer","").strip() else 0,"evidence":x.get("answer","")[:300]} for x in transcript],"next_steps":["Review transcript","Confirm role-specific evidence"]}
    return ask_json(f"Evaluate interview evidence only. JOB={json.dumps(job)} CANDIDATE={json.dumps(candidate)} TRANSCRIPT={json.dumps(transcript)}. Return JSON keys score,recommendation,summary,strengths,concerns,question_scores,next_steps.",fallback)

def candidate_chat(message,context=None):
    fallback=f"I can help with recruiting-process questions. Based on the available context, I can explain next steps, interview preparation, scheduling and application guidance. Your question was: {message}"
    try:
        return _ask(f"Candidate request: {message}\nContext: {json.dumps(context or {})}", "You are AzentMartAI Candidate Agent. Help with recruiting process, interview preparation, scheduling guidance and candidate FAQs. Never invent application status or commitments.")
    except Exception: return fallback

def campaign_content(job,candidate_count):
    title=job.get("title","open role")
    fallback={"subject":f"Opportunity: {title}","body":f"Hi {{candidate_name}},\n\nWe are reaching out about the {title} opportunity. Your background may be relevant to the role. If interested, reply to this message and the recruiting team can share next steps.\n\nRegards,\nRecruiting Team"}
    return ask_json(f"Create a concise recruiting outreach message for role {title}. Candidate count {candidate_count}. Return JSON subject,body. Avoid unsupported claims.",fallback)
