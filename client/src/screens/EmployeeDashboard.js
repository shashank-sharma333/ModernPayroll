import React, {useEffect, useState, } from 'react';
import { render } from 'react-dom';

import Web3 from 'web3';

import Payroll from '../build/contracts/Payroll.json';
import axios from 'axios';
import Loader from "../components/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Table, Container, Col, Row } from 'react-bootstrap';



function EmployeeDashboard() {

    const user = JSON.parse(localStorage.getItem('currentUser'));
    //const salary = 20;
    const hours = 160;
    //const rate = 0.125;
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
    //const ethPrice = require('eth-price');


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
    var balance_before =0, balance_after=0;


    const getPaid = async() => {
      balance_before = await web3.utils.fromWei(await web3.eth.getBalance(user.walletId), "ether");
      // localStorage.setItem('currentUser',JSON.stringify(balance_before))
      console.log(balance_before);
      setBalance(balance_before);
      // setOldBal(balance_before);
      console.log(user.walletId);
      // window.location.reload(false);
      await payroll.methods.getPaid().send({from: user.walletId});
      balance_after = await web3.utils.fromWei(await web3.eth.getBalance(user.walletId), "ether");
      setBalance(balance_after-balance_before);
      console.log(balance_after);
        
    }

   
    const onGetPaid = () => {
        getPaid();
    }
    
    const[balance_2 , setBalance] = useState(0)
    

    
    const exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "PAY SLIP";
        const headers = [["Standard Pay", "Overtime Pay", "Holiday Pay", "Basic Pay", "Commision & Bonus", "Gross Pay"]];

        // const data = this.state.people.map(elt=> [elt.name, elt.profession]);

        let content = {
        startY: 50,
        head: headers,
        // body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")
    }

    
    // async function getPaid(){
    //   const balance_before = await web3.eth.getBalance(user.walletId)
    //   // localStorage.setItem('currentUser',JSON.stringify(balance_before))
    //   console.log(balance_before);
    //   // setOldBal(balance_before);
    //   console.log(user.walletId);
    //   window.location.reload(false);
    //   await payroll.methods.getPaid().send({from: user.walletId});
    //   const balance_after = await web3.eth.getBalance(user.walletId);
    //   console.log(balance_after);
  
    // }
    const sal = balance_2;
    const [finSalary, setNewSal] = useState(0);
    const [curr, setNewCurr] = useState('');
    //const data = ethPrice('usd,btc')
    //console.log(data)
    const inputsHandler = (e) => {
      console.log('E is', e.target.value);
      if(e.target.value === 'ETH'){
        setNewSal(sal);
        setNewCurr('ETH');
      }
      if(e.target.value === 'USD'){
        setNewSal(sal * 1219.24);
        setNewCurr('USD');
      }
      if(e.target.value === 'INR'){
        setNewSal(sal * 99521.37);
        setNewCurr('INR');
      }
      if(e.target.value === 'GBP'){
        setNewSal(sal * 1019.19);
        setNewCurr('GBP');
      }
    }
    const salary = finSalary;
    const currency = curr;
    return(
    <div>
      <Container className='mt-5'> 
        <div className='row' >
          <div style = {{justifyContent:"center", width:"100%"}}>
          <Table striped bordered hover size="sm" style={{ fontSize: "13px" }}>
              <thead className='bs'>
                <tr>
                  <th>EARNINGS</th>
                  <th>HOURS</th>  
                   <th>
                    <div className="dropdown">
                      <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        CURRENCY
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button className="dropdown-item" href="#" value="ETH" onClick= {inputsHandler}>ETH</button>
                        <button className="dropdown-item" href="#" value="USD" onClick= {inputsHandler}>USD</button>
                        <button className="dropdown-item" href="#" value="INR" onClick= {inputsHandler}>INR</button>
                        <button className="dropdown-item" href="#" value="GBP" onClick= {inputsHandler}>GBP</button>
                      </div>
                    </div>
                  </th>                                  
                  <th>RATE</th>
                  <th>CURRENT</th>
                  <th>YTD</th>
                </tr>
              </thead>
              <tbody className='bs'>
                  <tr>
                      <th>Standard Pay</th>
                      <th>{hours*0.7}</th>
                      <th>{currency}</th>
                      <th>{(salary*0.3)/(hours*0.7)}</th>
                      <th>{salary*0.3}</th>
                      <th>{salary*0.3}</th>
                  </tr>
                  <tr>
                      <th>Overtime Pay</th>
                      <th>{hours*0.025}</th>
                      <th>{currency}</th>
                      <th>{(salary*0.1)/(hours*0.025)}</th>
                      <th>{salary*0.1}</th>
                      <th>{salary*0.1}</th>
                  </tr>
                  <tr>
                      <th>Holiday Pay</th>
                      <th>{hours*0.025}</th>
                      <th>{currency}</th>
                      <th>{(salary*0.2)/(hours*0.025)}</th>
                      <th>{salary*0.2}</th>
                      <th>{salary*0.2}</th>
                  </tr>
                  <tr>
                      <th>Basic Pay</th>
                      <th>{hours*0.2}</th>
                      <th>{currency}</th>
                      <th>{(salary*0.35)/(hours*0.2)}</th>
                      <th>{salary*0.35}</th>
                      <th>{salary*0.35}</th>
                  </tr>
                  <tr>
                      <th>Commision and Bonus</th>
                      <th>{hours*0.05}</th>
                      <th>{currency}</th>
                      <th>{(salary*0.05)/(hours*0.05)}</th>
                      <th>{salary*0.05}</th>
                      <th>{salary*0.05}</th>
                  </tr>
                  <tr>
                      <th>Gross Pay</th>
                      <th></th>
                      <th>{currency}</th>
                      <th></th>
                      <th>{salary}</th>
                      <th>{salary}</th>
                  </tr>
              </tbody>           
            </Table>
          </div>
        </div>
      </Container>
      <Container className='mt-3'>
        <button className="btn btn-primary float-left" style={{height:"38px", fontSize:"12px"}} onClick={() => exportPDF()}>Download Pay Slip</button>
        <button className="btn btn-primary float-right" style={{height:"38px", fontSize:"12px"}} onClick={() => onGetPaid()}>Get Salary</button>
      </Container>
     </div>
    )

};

export default EmployeeDashboard;
