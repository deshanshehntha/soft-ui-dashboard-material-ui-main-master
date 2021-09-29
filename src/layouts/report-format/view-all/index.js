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

// @material-ui core components
import Card from "@material-ui/core/Card";

// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard Material-UI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Table";

// Custom styles for the Tables
import styles from "layouts/tables/styles";

// Data
import formatTableData from "../view-all/table/data/reportFormatColumnDef";
import { useEffect, useState } from "react";
import axios from "axios";
import SuiButton from "../../../components/SuiButton";
import Icon from "@material-ui/core/Icon";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import Header from "./view-header/index"

function ViewAllReportFormats() {
  const classes = styles();
  const { columns: prCols } = formatTableData;
  const [rows, setRows] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    fetchData()
  }, [])

  function deleteRecord(id) {
    axios.delete("http://localhost:2021/api/v1/reportFormat/" + id)
      .then(result => {
        fetchData();
        alert.success("Successfully Deleted");

      })
      .catch(error => {
        console.log(error);
      })
  }

  function fetchData() {
    axios.get("http://localhost:2021/api/v1/reportFormat/")
      .then(result => {
        const reports = result.data;
        if (reports !== null) {
          var dataArray = []
          reports.forEach(object => {
            const obj = {
              Id: <SuiTypography variant="button" fontWeight="medium">
                {object.reportFormatTitleId}
              </SuiTypography>,
              Title: <SuiTypography variant="button" fontWeight="medium">
                {object.reportTitle}
              </SuiTypography>,
              Action: (
                <SuiBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                  {/*<SuiBox mr={1}>*/}
                  {/*</SuiBox>*/}
                  <SuiButton variant="text" buttonColor="success" component={Link}
                             to={{pathname: `/newFormat/`, query: object.reportFormatTitleId}}>


                    <Icon className="material-icons-round">info</Icon>&nbsp;view
                  </SuiButton>
                  <SuiButton variant="text" buttonColor="error" onClick={() => {
                    deleteRecord(object.reportFormatTitleId);
                  }}>
                    <Icon className="material-icons-round">delete</Icon>&nbsp;delete
                  </SuiButton>
                </SuiBox>
              )
            };
            dataArray.push(obj);
          })

          setRows([...dataArray]);
        }

      })
      .catch(error => console.log(error))
  }

  return (
    <DashboardLayout>
      <Header/>
      <SuiBox py={3}>
        <Card>
          <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SuiTypography variant="h6">Report Formats</SuiTypography>
          </SuiBox>
          <SuiBox customClass={classes.tables_table}>
            <Table columns={prCols} rows={rows} />
          </SuiBox>
        </Card>
      </SuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ViewAllReportFormats;
