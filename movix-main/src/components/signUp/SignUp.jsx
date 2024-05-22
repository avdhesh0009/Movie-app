import React, { useState,useEffect }from 'react'
import registerimg from "./registerimg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate();
  var [userinfo,setuserinfo]=useState({
    email:"",
    password:""
  });

  useEffect(()=>{
   console.log('signup');
    auth2();
 
  },[]);

  var auth2= ()=>{
    var c=localStorage.getItem('ashokcookie');
    console.log(c);
    if(c!=null&&c.length>10){
      console.log( "u r logined")
      navigate('/');}
  }
  function Userdata(e){
   //console.log(e.target.name);
   //console.log(e.target.value);
   var {name,value}=e.target;
   if(name==="email"){
    setuserinfo((prevdata)=>{
     return {
      email:value,
      password:prevdata.password
     }
    })

   }
   else{
    setuserinfo((prevdata)=>{
      return {
       email:prevdata.email,
       password:value
      }
     })
   }
  }
  var handleRegister=async (e)=>{
    e.preventDefault();
 var {email,password}=userinfo;
 if(!email.includes("@gmail.com")||email.length<11){
  window.alert("enter a valid email");
  return;
 }
 if(password.length<8){
  window.alert("less than 8 characters is not alloud");
  return;
 }
 if(password.length>8){
  window.alert("greater than 8 characters is not alloud");
  return;
 }
 var data={
  useremail:email,
  userpassword:password
 };

  var d=await axios.post('/register', data,
  {headers: {'content-type': 'application/x-www-form-urlencoded'}}
);
  setuserinfo({
    email:"",
    password:""
  });
 
 if(d.data=="Registered"){
  window.alert("Registered");
  console.log('here');
  navigate("/login");
 }
 else{
  window.alert(d.data);
  return;
 } 
 
 

  }

  return (
    <div className='sign'>
    <div className='form-flex'>
      <div className='form-left'>
        <form  method='POST' className='form-cont'>
        <div  className='form-div'>
          <input type='email' placeholder='Enter Email' name="email" className='form-ele' value={userinfo.email} onChange={Userdata}></input>
         </div>
         <div className='form-div'>
          <input type='password' placeholder='Enter Password' name="password" className='form-ele' value={userinfo.password} onChange={Userdata}></input>
         </div>
          <div className='form-div'>
          <button type='submit' className='form-btn-login' onClick={handleRegister}>Register</button>
         </div>
         {/* <div className='form-div'>
         <button className='form-btn-login'>LOGIN WITH GOOGLE</button>
         </div> */}
         
         </form>
         <p className='form-or'>OR</p>
         <div className='form-div-google'>
          <a  className='form-google'>REGISTER WITH GOOGLE</a>
         </div>
        </div>
          <div className='form-img'>
         <img src={registerimg} className='img-form'/>
         </div>
    </div>
    </div>
  )
}