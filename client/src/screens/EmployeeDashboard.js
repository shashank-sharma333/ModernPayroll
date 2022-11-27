import React, {useEffect, useState} from 'react';
import { render } from 'react-dom';

import Web3 from 'web3';

import Payroll from '../build/contracts/Payroll.json';

function EmployeeDashboard(){


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
        // console.log("network data: ", networkData.address)
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

    useEffect(()=>{
        loadWeb3();
        loadBlockchain();
      })

    const getPaid = async() => {
        console.log(typeof(payroll))
        await payroll.methods.getPaid().send({from: "0xceade79f1e4e6d6e2273f8c0a923fca39d047924"});
        
    }
    const onGetPaid = () => {
        getPaid();
    }

    return(
        <button onClick = {() => onGetPaid()}>
                Give Money!
        </button>
    );
};

export default EmployeeDashboard;
