import React, { useEffect, useState } from 'react';

import Web3 from 'web3';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { Table, Container, Card } from 'react-bootstrap';

import Payroll from '../build/contracts/Payroll.json';

function EmployerDashboard() {

  let web3, accounts, networkId, networkData;
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("install metamask!");
    }
  }

  const [account, setAccount] = useState('');
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unregUsers, setUnregUsers] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [addSalary, setAddSalary] = useState('');
  const [users, setusers] = useState();

  const loadBlockchain = async () => {
    web3 = window.web3;
    accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    networkId = await web3.eth.net.getId();

    networkData = Payroll.networks[networkId];
    // console.log(networkData);
    if (networkData) {
      const payroll = new web3.eth.Contract(
        Payroll.abi, networkData.address,
        { from: account }
      );
      setPayroll(payroll);
      setLoading(false);
    } else {
      window.alert("Payroll not deployed!");
    }
  }

  const inputsHandler = (e) => {
    console.log('E', e);
    if (e.target.name === 'walletAddress') {
      setWalletAddress(e.target.value);
    } else {
      setAddSalary(e.target.value);
    }
  }

  const addMoney = async () => {

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    // const accounts = await web3.eth.getAccounts();

    networkData = await Payroll.networks[networkId];
    console.log(networkData);
    await web3.eth.sendTransaction({ to: networkData.address, from: account, value: web3.utils.toWei("40", "ether") })
    console.log(web3.eth.getBalance(networkData.address));
    // console.log(accounts);
  }

  const addMoney2 = async (amount) => {

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    // const accounts = await web3.eth.getAccounts();

    networkData = await Payroll.networks[networkId];
    // console.log(networkData);
    await web3.eth.sendTransaction({ to: networkData.address, from: account, value: web3.utils.toWei(amount, "ether") })
    console.log(web3.eth.getBalance(networkData.address));
    // console.log(accounts);
  }

  const addEmployee = async () => {
    await payroll.methods.addEmployee("0x9fc6d69d2b500a06b87badca008abe8fd93ee147", "10").send({ from: account });
    const x = await payroll.methods.checkEmployee(0).call();

    console.log("adding some string: ", await payroll.methods.getNumberOfEmployee().call());
  }

  const addEmployee2 = async (address, pay) => {
    console.log("AddressHERERE: ", address);
    console.log("Pay: ", pay);
    await payroll.methods.addEmployee(address, pay).send({ from: account });
    const x = await payroll.methods.checkEmployee(0).call();

    console.log("checkkkk", x);
    console.log("adding some string: ", await payroll.methods.getNumberOfEmployee().call());
  }

  const updateEmployee = async () => {
    // await payroll.methods.updateEmployee(user.walletId, "20").send({from: user.walletId});
    await payroll.methods.checkEmployee(0).call();
  }

  const updateEmployee2 = async (walletAddress, newSalary) => {
    await payroll.methods.updateEmployee(walletAddress, newSalary).send({ from: account });
    await payroll.methods.checkEmployee(0).call();
  }

  const getPaid = async () => {
    await payroll.methods.getPaid().send({ from: "0x9fc6d69d2b500a06b87badca008abe8fd93ee147" });
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchain();
  })

  useEffect(() => {
    // 👇️ this only runs once
    console.log('useEffect ran');

    async function getData() {
      console.log("hello")
      try {
        console.log("Hii....")

        const result = await (await axios.post('/api/users/getPayrollUnregisteredUsers', false)).data

        // var index = 0;
        // const salaries = [13, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 20, 19, 18];
        // for (var obj in result) {
        //   // console.log(`${property}: ${object[property]}`);
        //   // console.log(salaries[index], typeof salaries[index])
        //   // console.log(result[obj], result)
        //   // result[obj].salary = salaries[index];
        //   if (index === salaries.length - 1) {
        //     index = 0;
        //   }
        //   index++;
        // }
        setUnregUsers(result);
      } catch (error) {
        console.log(error);

      }

    }

    async function getAllUsers() {
      try {
        const data = await (await axios.get('/api/users/getallusers')).data
        setusers(data)
      } catch (error) {
        console.log(error)
      }
    }

    getData();
    getAllUsers();
  }, []); // 👈️ empty dependencies array

  const onAddEmployeeClick = (address, pay, email) => {
    addEmployee2(address, pay);
    console.log('hererere', email);
    axios.put('/api/users/updateUserPayrollStatus', { email: email });
    alert('User with email ' + email + ' added successfully');
    // window.location.href = window.location.href;
  }

  const onAddEmployeeClickForm = async (e, uID, address, email) => {
    e.preventDefault();
    let newSalary = document.getElementById(uID).value;
    if (newSalary === '') {
      newSalary = '0';
    }
    // setSalary(newSalary);
    // debugger;

    await axios.put('/api/users/updateUserSalary', { email: email, newSalary: newSalary  });

    // addEmployee2(address, newSalary);
    console.log('hererere', email);
    axios.put('/api/users/updateUserPayrollStatus', { email: email });
    alert('User with email ' + email + ' added successfully');
    // reload page to update salary through DB
    window.location.href = window.location.href;
  }

  const onUpdateEmployeeClick = (walletAddress, newSalary) => {
    // console.log('inputFiled', inputField);
    console.log('inputs', typeof walletAddress, typeof newSalary);
    // updateEmployee2(walletAddress, newSalary);
    updateEmployee();

    // console.log('hererere', email);
    // axios.put('/api/users/updateUserPayrollStatus',{email:email});
    // alert('User with email ' + email + ' added successfully');
    // window.location.href = window.location.href;
  }

  const onAddMoneyClick = (e) => {
    e.preventDefault();
    let amount = document.getElementById('payment-input').value;
    if (amount === '') {
      amount = '0';
    }
    addMoney2(amount);
    // console.log('hererere', email);
    // axios.put('/api/users/updateUserPayrollStatus',{email:email});
    // alert('User with email ' + email + ' added successfully');
    // window.location.href = window.location.href;
  }

  const onGetPaidClick = () => {
    getPaid();
    // console.log('hererere', email);
    // axios.put('/api/users/updateUserPayrollStatus',{email:email});
    // alert('User with email ' + email + ' added successfully');
    // window.location.href = window.location.href;
  }

  return (
    <Container className='mt-3'>

    <div style={{ boxShadow:"0px 0px 15px -8px black", backgroundColor:"#c4c4c4"}}>
      <form style={{  paddingTop:"10px"}} className='d-flex justify-content-center'>
          <div className="form-group" >
            <input type="text" id="payment-input" className="form-control-sm" style={{height:"30px", fontSize:"12px"}} placeholder="Payment Amount" />
          </div>
          <button type="submit" className="btn btn-primary float-right" style={{height:"30px", fontSize:"12px"}} onClick={(event) => onAddMoneyClick(event)}>Add Money</button>
        </form> 
    </div>  

      <Table striped bordered hover size="sm" style={{ fontSize: "10px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registered?</th>
            <th>Set Employee Salary</th>
            <th>Add Unregistered Employees</th>
          </tr>
        </thead>

        <tbody>
          {users && (users.map((user, index) => {
            // const salaries = [3, 4, 12, 20, 8, 12, 10, 17, 15, 9, 8, 16, 20, 7, 5];
            // const salary = salaries[index % salaries.length];
            index++;
            const unregisteredNoSalary =  user.salary === '' && !user.isPayrollRegistered;
            const unregisteredWithSalary =  user.salary !== '' && !user.isPayrollRegistered;
            const registeredWithSalary =  user.salary !== '' && user.isPayrollRegistered;
            return <tr>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isPayrollRegistered ? 'YES' : 'NO'}</td>

              {
                user.isPayrollRegistered ? 
                <span style={{ fontSize: "10px", lineHeight: "30px" }}>
                  {"User " + user.name + " is already registered"}
                </span>                :
                <td style={{fontSize:"12px"}}>
                    <form className='d-flex justify-content-around'>
                      <div className="form-group" >
                        <input type="text" id={user._id} className="form-control-sm" style={{height:"30px", fontSize:"12px"}} placeholder="Set Salary" />
                      </div>
                      <button type="submit" id={"btn_" + user._id} className="btn btn-primary float-right" style={{height:"30px", fontSize:"12px"}} onClick={(event) => onAddEmployeeClickForm(event, user._id, user.walletId, user.email)}>Set</button>
                    </form>
                </td>
              }

              <td style={{ maxWidth: "30px" }}>
                {unregisteredNoSalary &&
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: "10px", lineHeight: "30px" }}>
                      {"Register user " + user.name + " and add salary"}
                    </span>

                    <Button className="m-1 float-right" style={{ height: "30px", fontSize: "12px" }} onClick={() => onAddEmployeeClick(user.walletId, user.salary, user.email)} variant="primary">Add</Button>{' '}

                  </div>
                }

                {unregisteredWithSalary &&
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: "10px", lineHeight: "30px" }}>
                    {"Add " + user.name + " with salary: " + user.salary}
                    </span>

                    <Button className="m-1 float-right" style={{ height: "30px", fontSize: "12px" }} onClick={() => onAddEmployeeClick(user.walletId, user.salary, user.email)} variant="primary">Add</Button>{' '}

                  </div>
                }

                {registeredWithSalary &&
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: "10px", lineHeight: "30px" }}>
                     {"User " + user.name + " has salary: " + user.salary}
                    </span>

                    {/* <Button className="m-1 float-right" style={{ height: "30px", fontSize: "12px" }} onClick={() => onAddEmployeeClick(user.walletId, salary, user.email)} variant="primary">Add</Button>{' '} */}

                  </div>
                }
              </td>

            </tr>
          }))}
        </tbody>
      </Table> 

    </Container>
  );
}

export default EmployerDashboard;
