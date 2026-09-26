import React,{useEffect,useRef} from "react";
import {api,setAuth} from "../lib/api";
export default function GoogleLogin({onSuccess,onError}){
 const ref=useRef(null); const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
 useEffect(()=>{
   if(!clientId||!ref.current)return;
   const render=()=>{if(window.google&&ref.current){window.google.accounts.id.initialize({client_id:clientId,callback:async(r)=>{try{const d=await api.googleLogin({credential:r.credential});setAuth(d);onSuccess?.(d)}catch(e){onError?.(e.message)}}});window.google.accounts.id.renderButton(ref.current,{theme:"outline",size:"large",width:360,text:"continue_with"});}};
   if(window.google) render(); else {const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.defer=true;s.onload=render;document.body.appendChild(s);return()=>s.remove();}
 },[clientId]);
 if(!clientId)return <button type="button" className="google-placeholder" onClick={()=>onError?.("Google login is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend/.env.")}>Continue with Google</button>;
 return <div ref={ref} className="google-button-wrap"/>;
}
