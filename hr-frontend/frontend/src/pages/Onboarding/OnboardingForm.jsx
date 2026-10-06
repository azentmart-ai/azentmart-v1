import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, CheckCircle2, FileText, GraduationCap, Mail, ShieldCheck, Upload, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { onboardingService } from "../../services/onboardingService";
import api from "../../services/api";
import "./OnboardingForm.css";

const STORAGE_KEY = "azentmart_onboarding_draft_v2";
const steps = [
  [1, "Personal information", UserRound],
  [2, "Contact details", Mail],
  [3, "Employment", BriefcaseBusiness],
  [4, "Education & experience", GraduationCap],
  [5, "Documents", FileText],
  [6, "Review & submit", CheckCircle2],
];

const empty = {
  firstName:"",lastName:"",dateOfBirth:"",gender:"",maritalStatus:"",bloodGroup:"",
  email:"",phone:"",alternatePhone:"",emergencyContactName:"",emergencyContactPhone:"",currentAddress:"",permanentAddress:"",
  department:"",designation:"",reportingManager:"",joiningDate:"",employmentType:"Full-time",probationPeriod:"",location:"",salary:"",bankName:"",bankAccount:"",ifscCode:"",
  highestQualification:"",university:"",graduationYear:"",previousCompany:"",previousDesignation:"",totalExperience:"",experienceDetails:"",
  resume:null,passportPhoto:null,idProof:null,addressProof:null,educationCertificate:null,experienceCertificate:null,
};

function Field({label,required,type="text",value,onChange,placeholder,error,options,full=false}){
  return <label className={`ob-field ${full?"full":""}`}><span>{label} {required&&<b>*</b>}</span>{options?<select value={value||""} onChange={e=>onChange(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type} value={value||""} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>} {error&&<small className="ob-error">{error}</small>}</label>
}

function FileField({label,value,onChange,required=false}){
  return <label className="ob-file"><span>{label} {required&&<b>*</b>}</span><div className={value?"ob-file-box selected":"ob-file-box"}><Upload size={18}/><strong>{value?.name||"Choose file"}</strong><small>PDF, JPG, PNG, DOCX · max 10 MB</small><input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e=>onChange(e.target.files?.[0]||null)}/></div></label>
}

export default function OnboardingForm(){
  const navigate=useNavigate();
  const [step,setStep]=useState(1);
  const [data,setData]=useState(()=>{try{return {...empty,...JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")};}catch{return empty;}});
  const [errors,setErrors]=useState({});
  const [saving,setSaving]=useState(false);
  const [success,setSuccess]=useState(false);
  const [createdEmployee,setCreatedEmployee]=useState(null);

  useEffect(()=>{const copy={...data};for(const k of Object.keys(empty)) if(empty[k]===null) delete copy[k];localStorage.setItem(STORAGE_KEY,JSON.stringify(copy));},[data]);
  const update=(key,value)=>{setData(d=>({...d,[key]:value}));setErrors(e=>({...e,[key]:""}));};
  const validate=(targetStep=step, apply=true)=>{
    const e={};
    if(targetStep===1){if(!data.firstName.trim())e.firstName="Required";if(!data.lastName.trim())e.lastName="Required";if(!data.dateOfBirth)e.dateOfBirth="Required";if(!data.gender)e.gender="Required";if(!data.bloodGroup)e.bloodGroup="Required";}
    if(targetStep===2){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))e.email="Valid email required";if(!data.phone.trim())e.phone="Required";if(!data.emergencyContactName.trim())e.emergencyContactName="Required";if(!data.emergencyContactPhone.trim())e.emergencyContactPhone="Required";if(!data.currentAddress.trim())e.currentAddress="Required";}
    if(targetStep===3){if(!data.department)e.department="Required";if(!data.designation.trim())e.designation="Required";if(!data.joiningDate)e.joiningDate="Required";if(!data.employmentType)e.employmentType="Required";}
    if(targetStep===4){if(!data.highestQualification.trim())e.highestQualification="Required";if(!data.university.trim())e.university="Required";}
    if(targetStep===5){for(const k of ["resume","passportPhoto","idProof","addressProof","educationCertificate"]){if(!data[k])e[k]="Required";}}
    if(apply) setErrors(e);
    return Object.keys(e).length===0;
  };
  const next=()=>{if(!validate())return;setStep(s=>Math.min(6,s+1));window.scrollTo({top:0,behavior:"smooth"});};
  const previous=()=>setStep(s=>Math.max(1,s-1));
  const submit=async(e)=>{e.preventDefault();
    let firstInvalid=null;
    [1,2,3,4,5].forEach(n=>{ if(firstInvalid===null && !validate(n,false)) firstInvalid=n; });
    if(firstInvalid!==null){ setStep(firstInvalid); validate(firstInvalid,true); return; }setSaving(true);setErrors({});try{
    const employee=await employeeService.create({name:`${data.firstName.trim()} ${data.lastName.trim()}`,email:data.email.trim(),phone:data.phone.trim(),department:data.department,designation:data.designation,location:data.location||null,manager:data.reportingManager||null,employment_type:data.employmentType,salary:data.salary?Number(data.salary):null,date_of_birth:data.dateOfBirth||null,join_date:data.joiningDate||null,bank_name:data.bankName||null,bank_account:data.bankAccount||null,ifsc_code:data.ifscCode||null});
    setCreatedEmployee(employee);
    const onboarding=await onboardingService.create(employee.id,{details:data});
    for(const [key,category] of [["resume","Resume"],["passportPhoto","Profile Photo"],["idProof","Identity Proof"],["addressProof","Address Proof"],["educationCertificate","Education Certificate"],["experienceCertificate","Experience Certificate"]]){
      if(data[key]){const fd=new FormData();fd.append("file",data[key]);fd.append("employee_id",String(employee.id));fd.append("category",`Onboarding · ${category}`);await api.post("/documents/upload",fd);}
    }
    await onboardingService.updateDetails(onboarding.id,data);
    setSuccess(true);localStorage.removeItem(STORAGE_KEY);setTimeout(()=>navigate(`/onboarding/journey/${onboarding.id}`),900);
  }catch(err){setErrors({submit:err?.response?.data?.detail||err?.message||"Unable to complete onboarding."});}finally{setSaving(false);}};
  const progress=useMemo(()=>Math.round(((step-1)/5)*100),[step]);
  if(success)return <div className="ob-success"><div><div className="ob-success-icon"><CheckCircle2 size={38}/></div><h1>Onboarding created</h1><p>{createdEmployee?.name||"Employee"} has been added and the onboarding journey is ready.</p><span>Opening the employee journey…</span></div></div>;
  return <div className="ob-form-page">
    <div className="ob-form-head"><div><div className="ob-eyebrow"><i/>PEOPLE JOURNEY</div><h1>Start employee onboarding</h1><p>Create the employee record and move through the complete onboarding journey without leaving this page.</p></div><button className="ob-back" type="button" onClick={()=>navigate("/onboarding")}><ArrowLeft size={15}/> Back to onboarding</button></div>
    <div className="ob-progress"><div><span>Onboarding progress</span><strong>{progress}%</strong></div><div className="ob-progress-track"><span style={{width:`${progress}%`}}/></div></div>
    <div className="ob-stepper">{steps.map(([id,title,Icon],i)=><React.Fragment key={id}><button type="button" disabled={id>step} onClick={()=>id<step&&setStep(id)} className={`ob-step ${step===id?"active":""} ${step>id?"done":""}`}><span>{step>id?<Check size={16}/>:<Icon size={16}/>}</span><small>{String(id).padStart(2,"0")}</small><b>{title}</b></button>{i<steps.length-1&&<em className={step>id?"done":""}/>}</React.Fragment>)}</div>
    <form onSubmit={submit} className="ob-card">
      {step===1&&<section><header><div><span>01 · PERSONAL</span><h2>Personal information</h2><p>Start with the employee's identity and basic personal details.</p></div></header><div className="ob-grid"><Field label="First name" required value={data.firstName} error={errors.firstName} onChange={v=>update("firstName",v)} placeholder="Enter first name"/><Field label="Last name" required value={data.lastName} error={errors.lastName} onChange={v=>update("lastName",v)} placeholder="Enter last name"/><Field label="Date of birth" required type="date" value={data.dateOfBirth} error={errors.dateOfBirth} onChange={v=>update("dateOfBirth",v)}/><Field label="Gender" required options={["Male","Female","Other"]} value={data.gender} error={errors.gender} onChange={v=>update("gender",v)}/><Field label="Marital status" options={["Single","Married","Divorced","Widowed"]} value={data.maritalStatus} onChange={v=>update("maritalStatus",v)}/><Field label="Blood group" required options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} value={data.bloodGroup} error={errors.bloodGroup} onChange={v=>update("bloodGroup",v)}/></div></section>}
      {step===2&&<section><header><div><span>02 · CONTACT</span><h2>Contact details</h2><p>Capture contact, address and emergency information.</p></div></header><div className="ob-grid"><Field label="Email address" required type="email" value={data.email} error={errors.email} onChange={v=>update("email",v)} placeholder="name@company.com"/><Field label="Phone number" required value={data.phone} error={errors.phone} onChange={v=>update("phone",v)} placeholder="+91 98765 43210"/><Field label="Alternate phone" value={data.alternatePhone} onChange={v=>update("alternatePhone",v)} placeholder="Optional"/><Field label="Emergency contact name" required value={data.emergencyContactName} error={errors.emergencyContactName} onChange={v=>update("emergencyContactName",v)} placeholder="Contact person"/><Field label="Emergency contact phone" required value={data.emergencyContactPhone} error={errors.emergencyContactPhone} onChange={v=>update("emergencyContactPhone",v)} placeholder="Phone number"/><Field label="Current address" required full value={data.currentAddress} error={errors.currentAddress} onChange={v=>update("currentAddress",v)} placeholder="Current residential address"/><Field label="Permanent address" full value={data.permanentAddress} onChange={v=>update("permanentAddress",v)} placeholder="Permanent address"/></div></section>}
      {step===3&&<section><header><div><span>03 · EMPLOYMENT</span><h2>Employment details</h2><p>Set the employee's role, joining date, manager and payroll information.</p></div></header><div className="ob-grid"><Field label="Department" required options={["Human Resources","Engineering","Finance","Marketing","Operations","Sales","AI"]} value={data.department} error={errors.department} onChange={v=>update("department",v)}/><Field label="Designation" required value={data.designation} error={errors.designation} onChange={v=>update("designation",v)} placeholder="Job title"/><Field label="Reporting manager" value={data.reportingManager} onChange={v=>update("reportingManager",v)} placeholder="Manager name"/><Field label="Joining date" required type="date" value={data.joiningDate} error={errors.joiningDate} onChange={v=>update("joiningDate",v)}/><Field label="Employment type" required options={["Full-time","Part-time","Contract","Intern"]} value={data.employmentType} error={errors.employmentType} onChange={v=>update("employmentType",v)}/><Field label="Work location" value={data.location} onChange={v=>update("location",v)} placeholder="Chennai"/><Field label="Annual salary" type="number" value={data.salary} onChange={v=>update("salary",v)} placeholder="₹ 0"/><Field label="Probation period" value={data.probationPeriod} onChange={v=>update("probationPeriod",v)} placeholder="e.g. 3 months"/><Field label="Bank name" value={data.bankName} onChange={v=>update("bankName",v)} placeholder="Bank"/><Field label="Bank account" value={data.bankAccount} onChange={v=>update("bankAccount",v)} placeholder="Account number"/><Field label="IFSC code" value={data.ifscCode} onChange={v=>update("ifscCode",v)} placeholder="IFSC"/></div></section>}
      {step===4&&<section><header><div><span>04 · EDUCATION & EXPERIENCE</span><h2>Education & experience</h2><p>Record the employee's qualifications and previous experience.</p></div></header><div className="ob-grid"><Field label="Highest qualification" required value={data.highestQualification} error={errors.highestQualification} onChange={v=>update("highestQualification",v)} placeholder="MCA / BCA / MBA..."/><Field label="University / institution" required value={data.university} error={errors.university} onChange={v=>update("university",v)} placeholder="Institution name"/><Field label="Graduation year" value={data.graduationYear} onChange={v=>update("graduationYear",v)} placeholder="2026"/><Field label="Total experience" value={data.totalExperience} onChange={v=>update("totalExperience",v)} placeholder="e.g. 2 years"/><Field label="Previous company" value={data.previousCompany} onChange={v=>update("previousCompany",v)} placeholder="Company"/><Field label="Previous designation" value={data.previousDesignation} onChange={v=>update("previousDesignation",v)} placeholder="Role"/><Field label="Experience details" full value={data.experienceDetails} onChange={v=>update("experienceDetails",v)} placeholder="Key responsibilities, skills and achievements"/></div></section>}
      {step===5&&<section><header><div><span>05 · DOCUMENTS</span><h2>Documents & verification</h2><p>Upload the documents HR needs for verification. Files are stored against the employee record after submission.</p></div><ShieldCheck size={28} color="#2563eb"/></header><div className="ob-doc-grid"><FileField label="Resume" required value={data.resume} onChange={v=>update("resume",v)}/><FileField label="Passport photo" required value={data.passportPhoto} onChange={v=>update("passportPhoto",v)}/><FileField label="Government ID proof" required value={data.idProof} onChange={v=>update("idProof",v)}/><FileField label="Address proof" required value={data.addressProof} onChange={v=>update("addressProof",v)}/><FileField label="Education certificate" required value={data.educationCertificate} onChange={v=>update("educationCertificate",v)}/><FileField label="Experience certificate" value={data.experienceCertificate} onChange={v=>update("experienceCertificate",v)}/></div>{Object.keys(errors).length>0&&<p className="ob-doc-note">Complete all required documents before continuing.</p>}</section>}
      {step===6&&<section><header><div><span>06 · REVIEW</span><h2>Review & submit</h2><p>Check the employee information before creating the employee and onboarding journey.</p></div></header><div className="ob-review-grid">{[["Personal",`${data.firstName} ${data.lastName}`,"1"],["Contact",data.email,"2"],["Employment",`${data.designation || "-"} · ${data.department || "-"}`,"3"],["Joining",data.joiningDate || "-","3"],["Education",data.highestQualification || "-","4"],["Documents",`${["resume","passportPhoto","idProof","addressProof","educationCertificate","experienceCertificate"].filter(k=>data[k]).length}/6 uploaded`,"5"]].map(([title,value,n])=><button key={title} type="button" onClick={()=>setStep(Number(n))}><small>{title}</small><strong>{value}</strong><ArrowRight size={15}/></button>)}</div>{errors.submit&&<div className="ob-submit-error">{errors.submit}</div>}</section>}
      <footer className="ob-actions"><button type="button" className="ob-prev" disabled={step===1||saving} onClick={previous}><ArrowLeft size={15}/> Previous</button><span>Step {step} of 6</span>{step<6?<button type="button" className="ob-next" onClick={next}>Next <ArrowRight size={15}/></button>:<button type="submit" className="ob-next" disabled={saving}>{saving?"Creating…":"Create onboarding"} <CheckCircle2 size={15}/></button>}</footer>
    </form>
  </div>;
}
