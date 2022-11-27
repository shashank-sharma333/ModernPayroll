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
    const [unregUsers, setUnregUsers] = useState({});
    const [walletAddress, setWalletAddress] = useState('');
    const [newSalary, setNewSalary] = useState('');
  
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

    const inputsHandler = (e) =>{
      console.log('E', e);
      if (e.target.name === 'newSalary') {
        setNewSalary(e.target.value)
      } else {
        setWalletAddress(e.target.value)
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

    const addMoney2 = async(amount) => {
      
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      // const accounts = await web3.eth.getAccounts();
  
      networkData = await Payroll.networks[networkId];
      // console.log(networkData);
      await web3.eth.sendTransaction({to:networkData.address, from:account, value:web3.utils.toWei(amount, "ether")})
      console.log(web3.eth.getBalance(networkData.address));
      // console.log(accounts);
    }
  
    const addEmployee = async() => {
      await payroll.methods.addEmployee("0x9fc6d69d2b500a06b87badca008abe8fd93ee147", "10").send({from: account});
      const x = await payroll.methods.checkEmployee(0).call();
      
      console.log("adding some string: " , await payroll.methods.getNumberOfEmployee().call());
    }
  
    const addEmployee2 = async(address, pay) => {
      console.log("AddressHERERE: ", address);
      console.log("Pay: ", pay);
      await payroll.methods.addEmployee(address, pay).send({from: account});
      const x = await payroll.methods.checkEmployee(0).call();

      console.log("checkkkk", x);
      console.log("adding some string: " , await payroll.methods.getNumberOfEmployee().call());
    }
  
    const updateEmployee = async() => {
      await payroll.methods.updateEmployee("0x9ef6506ec2abf21f61eb5c9ca95ac1437d62523d", "20").send({from: account});
      await payroll.methods.checkEmployee(0).call();
    }

    const updateEmployee2 = async(walletAddress, newSalary) => {
      await payroll.methods.updateEmployee(walletAddress, newSalary).send({from: account});
      await payroll.methods.checkEmployee(0).call();
    }
  
    const getPaid = async() => {
      await payroll.methods.getPaid().send({from: "0x9fc6d69d2b500a06b87badca008abe8fd93ee147"});
    }
  
    useEffect(()=>{
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
  
          const result = await (await axios.post('/api/users/getPayrollUnregisteredUsers',false)).data
          
          var index = 0;
          const salaries = [13,2, 4, 5,6 ,7, 8, 9,10, 11, 12, 1,20, 19, 18];
          for (var obj in result) {
            // console.log(`${property}: ${object[property]}`);
            // console.log(salaries[index], typeof salaries[index])
            // console.log(result[obj], result)
            result[obj].salary = salaries[index];
            if (index === salaries.length - 1) {
              index = 0;
            }
            index++;
          }
          setUnregUsers(result);
        } catch (error) {
          console.log(error);
          
        }
  
      }
  
      getData();
    }, []); // 👈️ empty dependencies array

    const onAddEmployeeClick = (address, pay, email) => {
        addEmployee2(address, pay);
        console.log('hererere', email);
        axios.put('/api/users/updateUserPayrollStatus',{email:email});
        alert('User with email ' + email + ' added successfully');
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

    const onAddMoneyClick = (amount) => {
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
    <React.Fragment>
        <div>
            {Object.keys(unregUsers).map((key, index) => {
                const userData = unregUsers[key];
                const walletId = userData.walletId;
                const value = userData.salary;                ;
                const name = userData.name;
                const email = userData.email;
                return (
                    <div key={index}>
                        <div className='add-employee-line'>
                            <button onClick = {() => onAddEmployeeClick(walletId, value, email)}>
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
        <div>
            <input 
            type="text" 
            name="walletAddress" 
            onChange={inputsHandler} 
            placeholder="1234" 
            value={walletAddress}/>

            <br/>

            <input 
            type="text" 
            name="newSalary" 
            onChange={inputsHandler} 
            placeholder="1234" 
            value={newSalary}/>

            <br/>

            <button onClick={() => onUpdateEmployeeClick(walletAddress, newSalary)}>Update Salary</button>
        </div>
        <div>
          
        </div>
        <div>
          
        </div>
    </React.Fragment>

    );
}

export default EmployerDashboard;
