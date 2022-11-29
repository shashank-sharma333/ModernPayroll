import React, { useState, useEffect } from "react";

import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";

import {Button, Form, Container} from 'react-bootstrap';

export default function Loginscreen() {


  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState(false)
  const [success, setsuccess] = useState(false)

  useEffect(() => {

    if (localStorage.getItem('currentUser')) {
      window.location.href = '/'
      debugger;
    }

  }, [])

  async function login(e) {
    e.preventDefault();
    const user = {

      email,
      password
    }
    try {
      setloading(true)
      const result = await (await axios.post('/api/users/login', user)).data
      console.log(result.role)
      if (result.role === 'employer') {
        window.location.href = '/employerdashboard'
      }
      else {
        window.location.href = '/employeedashboard'
      }
      localStorage.setItem('currentUser', JSON.stringify(result))
      debugger;
    } catch (error) {
      seterror(true)
      setloading(false)
      console.log(error);

    }
  }

  return (

    <Container className="d-flex justify-content-around" style={{ width:"100vw",height:"100vh"}}>
      <div className="card p-4 m-5" style={{boxShadow:"0px 0px 15px -8px black", borderRadius:"10px", width:"500px", height:"370px"}}>
      <Form>
      <Form.Text>
        <h1>Log In</h1>
        <hr />
        </Form.Text>
        <Form.Text>
          {loading && (<Loader />)}
          {error && (<Error error='Invalid Credentials' />)}
          {success && (<Success success='User Login Successfull' />)}
        </Form.Text>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="abc@gmail.com" value={email} onChange={(e) => { setemail(e.target.value); }} />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password}
            required
            onChange={(e) => { setpassword(e.target.value); }} />
        </Form.Group>        
        <Button variant="primary" type="submit" onClick={login} >
          Login
        </Button>
        <a href="/register" className="ml-2">Click Here To Register</a>
      </Form>
      </div>
    </Container>


  )
}




