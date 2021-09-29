/**
=========================================================
* Soft UI Dashboard Material-UI - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// @material-ui core components
import Card from "@material-ui/core/Card";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard Materail-UI example components
import Table from "examples/Table";

// Custom styles for the Projects
import styles from "layouts/dashboard/components/Projects/styles";

// Data
import data from "layouts/dashboard/components/Projects/data";
import axios from "axios";
import SuiButton from "../../../../components/SuiButton";
import { Link } from "react-router-dom";
import SuiInput from "../../../../components/SuiInput";

function Doctors() {
  const { columns} = data();
  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const classes = styles();

  useEffect(() => {
    fetchData()
  }, [])


  function fetchData() {
    axios.get("http://localhost:2021/api/v1/medicalReport/status")
      .then(result => {
        let dataArray = [];

        if(result.data !== null) {

          result.data.forEach(doc => {
            let date = "";
            if(doc.month !== null && doc.month !== "") {
              const array = doc.month.split("T")
              let yearAndMonth = array[0].split("-")
              date = yearAndMonth[0] + "-" + yearAndMonth[1]
            }
            const obj = {
              month : date,
              count :  doc.count,
              doctor : doc.doctor
            }
            dataArray.push(obj);

          })
        }

        setRows([...dataArray]);


      }).catch(error => {
        console.log(error);
    })
  }

  function search(year, month) {
    axios.get("http://localhost:2021/api/v1/medicalReport/status?year="+ year + "&month=" + month)
      .then(result => {

        console.log(result);
        console.log("stats")
        let dataArray = [];

        if(result.data !== null) {

          result.data.forEach(doc => {
            let date = "";
            if(doc.month !== null && doc.month !== "") {
              const array = doc.month.split("T")
              let yearAndMonth = array[0].split("-")
              date = yearAndMonth[0] + "-" + yearAndMonth[1]
            }
            const obj = {
              month : date,
              count :  doc.count,
              doctor : doc.doctor
            }
            dataArray.push(obj);

          })
        }

        setRows([...dataArray]);


      }).catch(error => {
      console.log(error);
    })
  }


  return (
    <Card>
      <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <SuiBox>
          <SuiTypography variant="h6" gutterBottom>
            Reports By Doctors
          </SuiTypography>
          <SuiBox display="flex" alignItems="center" lineHeight={0}>

            <SuiInput type="date" placeholder="date time" onChange={(e) => {
              let val = e.target.value;
              const myArray = val.split("-");
              setYear(myArray[0]);
              setMonth(myArray[1]);
            }} />
            <SuiButton variant="text" buttonColor="info" onClick={()=> {
              search(year, month)
            }}>
              <Icon className="material-icons-round">touch_app</Icon>&nbsp;search
            </SuiButton>

          </SuiBox>
        </SuiBox>
        <SuiBox color="text" px={2}>
          {/*<Icon*/}
          {/*  className="material-icons-round cursor-pointer font-bold"*/}
          {/*  fontSize="small"*/}
          {/*  onClick={openMenu}*/}
          {/*>*/}
          {/*  more_vert*/}
          {/*</Icon>*/}
        </SuiBox>
      </SuiBox>
      <SuiBox customClass={classes.projects_table}>
        <Table columns={columns} rows={rows} />
      </SuiBox>
    </Card>
  );
}

export default Doctors;
