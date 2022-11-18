import React from "react";
import Swal from "sweetalert2";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";
import { Tag, Divider } from 'antd';
import { Grid } from "antd";
import { Typography } from "antd";
import { Tabs } from "antd";
const { TabPane } = Tabs;



const user = JSON.parse(localStorage.getItem('currentUser'))
function Helpscreen() {
  return (
    <div className="mt-5 ml-3">
      <div className="text-center">
        <div className="col-md-9 " style={{ marginLeft: "150px" }}>
          <h3> WHO WE ARE </h3>
          <h1> A Modern Payroll System is designed in a way, to pay salaries to Employee in Ether.
          </h1>
          <h1>
            REACH US AT
          </h1>
          <h1>Email us on : ModernPayroll@gmail.com</h1>
          <h1>call us on  : 628-243-2430</h1>
        </div>
      </div>
    </div>
  );

}

export default Helpscreen;

