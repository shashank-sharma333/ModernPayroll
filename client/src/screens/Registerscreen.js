import React, { useState, useEffect } from "react";
import {useDispatch , useSelector} from 'react-redux'
import axios from "axios";
import './screen.css';
import Error from "../components/Error";
import Loader from "../components/Loader";
import { Button , Container, Form} from "react-bootstrap";
import { Checkbox } from "antd";
import {Routes, Route, useHistory} from "react-router-dom";
import Success from '../components/Success'
export default function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const[address,setaddress] = useState("");
  const[role,setrole] = useState("");
  const[walletId,setwalletId] = useState("");
  const [cpassword, setcpassword] = useState("");
  const[loading, setloading]=useState(false)
  const[error, seterror]=useState(false)
  const[success, setsuccess]=useState(false) 
  const navigate = useHistory();

  const navigateToHome = () => {
      // 👇️ navigate to /contacts
      register();
      navigate.push('/SelectionScreen');
  };

  async function register(){
  
      if(password!=cpassword)
      {
          alert("passwords not matched")
      }
      else{
          const user={
              name,
              email,
              password,
              role,
              walletId
          }
          
          try {
            setloading(true)
            const result = await axios.post('/api/users/register',user)
            setloading(false)
            setsuccess(true)
            setemail('')
            setname('')
            setaddress('')
            setwalletId('')
            setcpassword('')
            setpassword('')
            setrole('')
          } catch (error) {
            seterror(true)
            setloading(false)
            console.log(error);
          }
      
      }

  }

  return (
    <div className="register">
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded">

          {loading && (<Loader/>)}
          {success && (<Success success='User Registered Successfully' />)}
          {error && (<Error error='Email already registred' />)}

          <h2 className="text-center m-2" style={{ fontSize: "35px" }}>
            Register
          </h2>
          <div>
            <Form>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control required type="text" placeholder="Jane Doe" className="form-control" value={name} onChange={(e)=>{setname(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control required type="text" placeholder="San Fernando" className="form-control " value={address} onChange={(e)=>{setaddress(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Control required type="text" placeholder="Employee" className="form-control " value={role} onChange={(e)=>{setrole(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>WalletId</Form.Label>
              <Form.Control required type="password" placeholder="00axbccjd777987263" className="form-control" value={walletId} onChange={(e)=>{setwalletId(e.target.value)}} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="text" placeholder="abc@gmail.com" className="form-control " value={email} onChange={(e)=>{setemail(e.target.value)}} />
             </Form.Group> 
            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                required
                onChange={(e)=>{setpassword(e.target.value)}}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className="form-control "
                value={cpassword}
                required
                onChange={(e)=>{setcpassword(e.target.value)}}
              />
            </Form.Group>
              {/* <div class="rewards">
  <input type="checkbox" id="rewards" name="rewards"/>
  <label for="rewards">Opt in for Rewards</label>
</div> */}
            <Button onClick={register} variant="primary">REGISTER</Button>
            <a className="ml-2" style={{color:'black'}} href="/login">Click Here To Login</a>  &ensp;  &ensp;
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}