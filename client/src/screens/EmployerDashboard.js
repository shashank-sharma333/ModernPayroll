import React, {useEffect, useState} from 'react';

import Web3 from 'web3';
import axios from "axios";


import Payroll from '../build/contracts/Payroll.json';

function EmployerDashboard() {

    let web3, accounts, networkId, networkData;
    const loadWeb3 = async() => {
      if(window.ethereum){
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("install metamask!");
      }
    }
  
    const [account, setAccount] = useState('');
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const loadBlockchain = async() => {
      web3 = window.web3;
      accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
  
      networkId = await web3.eth.net.getId();
  
      networkData = Payroll.networks[networkId];
      // console.log(networkData);
      if(networkData){
        const payroll = new web3.eth.Contract(
          Payroll.abi, networkData.address, 
          {from: account}
        );
        setPayroll(payroll);
        setLoading(false);
      } else {
        window.alert("Payroll not deployed!");
      }
    }
    
    const addMoney = async() => {
      
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      // const accounts = await web3.eth.getAccounts();
  
      networkData = await Payroll.networks[networkId];
      console.log(networkData);
      await web3.eth.sendTransaction({to:networkData.address, from:account, value:web3.utils.toWei("40", "ether")})
      console.log(web3.eth.getBalance(networkData.address));
      // console.log(accounts);
    }
  
    const addEmployee = async() => {
      await payroll.methods.addEmployee("0x9fc6d69d2b500a06b87badca008abe8fd93ee147", "10").send({from: account});
      await payroll.methods.checkEmployee(0).call();
      
      console.log("adding some string: " , await payroll.methods.getNumberOfEmployee().call());
    }
  
    const addEmployee2 = async(address, pay) => {
      console.log("Address: ", address);
      console.log("Pay: ", pay);
      await payroll.methods.addEmployee(address, pay).send({from: account});
      await payroll.methods.checkEmployee(0).call();
      
      console.log("adding some string: " , await payroll.methods.getNumberOfEmployee().call());
    }
  
    const updateEmployee = async() => {
      await payroll.methods.updateEmployee("0x9fc6d69d2b500a06b87badca008abe8fd93ee147", "20").send({from: account});
      await payroll.methods.checkEmployee(0).call();
    }
  
    const getPaid = async() => {
      await payroll.methods.getPaid().send({from: "0x9fc6d69d2b500a06b87badca008abe8fd93ee147"});
    }

    const getData = async() => {
      console.log("hello")
      const user = JSON.parse(localStorage.getItem("currentUser"));
      console.log("hello", user)


      try {
        console.log("Hii....")

        const result = await (await axios.post('/api/users/getDetailsByEmail',user.email)).data
        console.log(result.role)
        if(result.role==='employee')
        {
          window.location.href='/employerdashboard'
        }
        else{
          window.location.href='/employeedashboard'
        }
        localStorage.setItem('currentUser',JSON.stringify(result))
        debugger;
      } catch (error) {
        console.log(error);
        
      }

    }
  
    useEffect(()=>{
      loadWeb3();
      loadBlockchain();
    })
    

    React.useEffect(() => getData(), [])



    const onAddEmployeeClick = (address, pay) => {
        addEmployee2(address, pay);
    }
    

    const fakeData = {
        0: {
            Name: 'Abhishek',
            Address: '0x6ef106deda407410c2d24058d7c869dfb220dc4c',
            Value: '10',
        },
        1: {
            Name: 'Yashvi',
            Address: '0x8511dccd5a0fc12f8acdf473bb2d4179c6379062',
            Value: '20',
        },
        2: {
            Name: 'Shashank',
            Address: '0xf5c3a0a413a1c0a6141d1d49a2f18729487c078e',
            Value: '30',
        },
    };
    
    return (
    <React.Fragment>
        <div>
            {Object.keys(fakeData).map((key, index) => {
                const address = fakeData[key].Address;
                const value = fakeData[key].Value;
                const name = fakeData[key].Name;
                return (
                    <div key={index}>
                        <div className='add-employee-line'>
                            <button onClick = {() => onAddEmployeeClick(address, value)}>
                                Add Employee {name}
                            </button>
                        </div>
                        <div className='add-employee-line'>
                            <p>
                                {"Add " + name + " with salary: " + value} 
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </React.Fragment>

    );
}

export default EmployerDashboard;
