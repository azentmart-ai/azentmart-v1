import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {authService} from "../../services/authService";

export default function ResetPassword(){
  const nav=useNavigate();
  const [form,setForm]=useState({email:"",new_password:""});
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const submit=async event=>{
    event.preventDefault();setMessage("");setError("");
    try{const result=await authService.resetPassword(form);setMessage(result.message);setTimeout(()=>nav("/login"),800)}
    catch(err){setError(err.response?.data?.detail||"Unable to reset password.")}
  };
  return <div className="auth-page"><div className="auth-brand-panel"><div><h1>Reset your password.</h1><p>Reset an authorized HR account password.</p></div></div><div className="auth-form-panel"><div className="auth-card"><h2>Reset password</h2><p>Enter the HR account email and a new password.</p><form className="auth-form" onSubmit={submit}>{message&&<div className="auth-success">{message}</div>}{error&&<div className="auth-error">{error}</div>}<div className="form-group"><label>Email</label><input className="input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div className="form-group"><label>New password</label><input className="input" type="password" minLength={6} required value={form.new_password} onChange={e=>setForm({...form,new_password:e.target.value})}/></div><button className="btn btn-primary">Reset password</button></form><div className="auth-form-footer"><Link to="/login">Back to sign in</Link></div></div></div></div>
}
