// @material-ui core components
import Card from "@material-ui/core/Card";
import { Component } from "react";
// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard Material-UI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Custom styles for the Tables
import SuiButton from "../../../components/SuiButton";

// Data
import { withAlert } from "react-alert";
import axios from "axios";
import Header from "./view-header/index";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import PersonFilter from "../tables/data/PersonFilter";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { Backdrop, CircularProgress, LinearProgress } from "@material-ui/core";
import SuiTypography from "../../../components/SuiTypography";
import SuiInput from "../../../components/SuiInput";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const getRowStyle = params => {
  if (params.node.rowIndex % 2 === 1) {
    return { background: "#ffffff" };
  } else {
    return { background: "#d1dcff" };
  }
};

class SearchMedicalReports extends Component {

  constructor(props) {
    super(props);
    this.dateFormatter = this.dateFormatter.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
    this.printReport = this.printReport.bind(this);
    this.search = this.search.bind(this);
    this.setYear = this.setYear.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.setSearchName = this.setSearchName.bind(this);
    this.searchWithName = this.searchWithName.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
    this.handleCloseDialogBox = this.handleCloseDialogBox.bind(this);
    this.runConfirmation = this.runConfirmation.bind(this);
    this.handleBackDrop = this.handleBackDrop.bind(this);

    this.state = {
      columnDefs: [
        { headerName: "Report Id", field: "medicalReportDbId", sortable: true,  sort: 'desc' },
        { headerName: "Patient", field: "patientName", filter: "personFilter" },
        { headerName: "Ref. Doctor", field: "doctorName" },
        {
          headerName: "Created Date Time",
          field: "createdDateTime",
          sortable: true,
          'valueFormatter': params => this.dateFormatter(params),
        },
        { headerName: "Required Date", field: "requiredDateTime" , sortable: true},
        { headerName: "Age", field: "age" },
        { headerName: "Contact", field: "contact" },
        { headerName: "Comment", field: "comment" },
      ],
      frameworkComponents: {
        personFilter: PersonFilter,
      },
      rowData: [],
      base64data: "",
      viewMode: false,
      rowSelection: "single",
      currentSelectedId: "",
      loading: false,
      year: null,
      month : null,
      searchName : null,
      open: false,
      backdrop : false
    };
  }

  handleCloseDialogBox() {
    this.setState({
      open : false
    })
  }

  handleBackDrop() {
    this.setState({
      backdrop : false
    })
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = (data) => {
      this.setState({ rowData: data });
    };

    fetch("http://localhost:2021/api/v1/medicalReport")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  refreshTable() {
    const updateData = (data) => {
      this.setState({ rowData: data });
    };
    fetch("http://localhost:2021/api/v1/medicalReport")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    if(selectedRows !== undefined) {
      const id = selectedRows[0].medicalReportDbId;
      this.setState({
        loading: true,
      });
      axios.get("http://localhost:2021/api/v1/medicalReport/" + id)
        .then(result => {
            this.setState({
              base64data: result.data,
              loading: false,
            });

          },
        )
        .catch(error => {
          console.log(error);
        });
      this.setState({
        viewMode: true,
        currentSelectedId: id,
      });
    }
  };

  runConfirmation() {
    this.setState({
      open : true
    })
  }

  printReport(){

    this.setState({
      open : false,
      backdrop : true
    })

    axios.get("http://localhost:2021/api/v1/medicalReport/" + this.state.currentSelectedId + "/print")
      .then(result => {

        this.setState({
          backdrop : false
        })

        if(result.data) {
          this.props.alert.success("Print Successfull");
        } else {
          this.props.alert.error("Print failed");
        }

      })
      .catch(error => {
        console.log(error);
      })
  }

  deleteReport() {
    const selectedId = this.state.currentSelectedId
    console.log(selectedId)
    axios.delete("http://localhost:2021/api/v1/medicalReport/" + selectedId)
      .then(res => {
        if(res.data) {
          this.props.alert.success("Successfully deleted");
        } else {
          this.props.alert.error("Delete failed");
        }
        this.setState({
            viewMode: false,
            currentSelectedId: "",
            base64data: "",
            loading: false,
          });
        this.props.history.push("/search/")
      })
      .catch(error => {console.log(error)})
  }

  search() {
    axios.get("http://localhost:2021/api/v1/medicalReport?year=" + this.state.year + "&month=" + this.state.month)
      .then((res) => {
        console.log(res.data)
        this.setState({ rowData: res.data });
      })
      .catch(error => console.log(error))
  }


  dateFormatter(params) {
    var dateAsString = params.data.createdDateTime;
    var dateParts = dateAsString.split("T");

    var timeParts = dateParts[1].split(":");


    return `${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`;
  }


  componentDidMount() {
  }

  setYear(year) {
    this.setState({
      year: year
    })
  }

  setMonth(month) {
    this.setState({
      month : month
    })
  }

  setSearchName(name) {
    this.setState({
      searchName : name
    })
  }

  searchWithName() {
    axios.get("http://localhost:2021/api/v1/medicalReport?name=" + this.state.searchName)
      .then((res) => {
        console.log(res.data)
        this.setState({ rowData: res.data });
      })
      .catch(error => console.log(error))
  }

  render() {

    if (!this.state.viewMode) {
      return (
        <DashboardLayout>

          <SuiBox display="flex" p={3} spacing={1} justifyContent="flex-start">
            <SuiBox justifyContent="space-between" pr={10} spacing={1}>
              <SuiBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={0}>
                <SuiInput type="date" placeholder="date time" onChange={(e) => {
                  let val = e.target.value;
                  const myArray = val.split("-");

                  this.setYear(myArray[0]);
                  this.setMonth(myArray[1]);

                }} />
                <SuiButton variant="text" buttonColor="info" onClick={this.search}>
                  <Icon className="material-icons-round">touch_app</Icon>&nbsp;search
                </SuiButton>

              </SuiBox>
            </SuiBox>

            <SuiBox alignItems="right" justifyContent="space-between">
              <SuiBox display="flex" alignItems="center" lineHeight={0}>

                <SuiInput
                  placeholder="patient name.."
                  withIcon={{ icon: "search", direction: "left" }}
                  onChange={(e) => {
                    this.setSearchName(e.target.value)
                  }}
                />
                <SuiButton variant="text" buttonColor="info" onClick={this.searchWithName}>
                  <Icon className="material-icons-round">touch_app</Icon>&nbsp;search
                </SuiButton>

                <SuiButton variant="text" buttonColor="success" onClick={this.refreshTable}>
                  <Icon className="material-icons-round">cached</Icon>&nbsp;refresh
                </SuiButton>

              </SuiBox>
            </SuiBox>

          </SuiBox>


          <SuiBox py={3}>
            <SuiBox mb={3}>
              <div
                className="ag-theme-alpine"
                style={{
                  height: "500px",
                  width: "100%",
                }}
              >
                <AgGridReact
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.rowData}
                  // defaultColDef={this.state.defaultColDef}
                  rowSelection={this.state.rowSelection}
                  onGridReady={this.onGridReady}
                  onSelectionChanged={this.onSelectionChanged.bind(this)}
                  getRowStyle={getRowStyle}
                  frameworkComponents={this.state.frameworkComponents}
                >
                </AgGridReact>
              </div>
            </SuiBox>
          </SuiBox>
        </DashboardLayout>
      );
    } else {

      if (this.state.loading) {

        return (
          <DashboardLayout>
            <LinearProgress color="secondary" />
          </DashboardLayout>
        );

      } else {

        return (
          <DashboardLayout>
            <SuiBox py={3}>
              <SuiBox mb={3}>
                <Card>
                  <SuiBox display="flex" alignItems="center" mt={{ xs: 10, sm: 1 }} ml={{ xs: -1.5, sm: 0 }}>
                    {/*<SuiBox mr={1}>*/}
                    {/*</SuiBox>*/}

                    <SuiButton variant="text" buttonColor="success" onClick={this.runConfirmation}>
                      <Icon className="material-icons-round">info</Icon>&nbsp;print
                    </SuiButton>

                    <SuiButton variant="text" buttonColor="dark" component={Link}
                               to={{ pathname: `/search/` }} onClick={() => {
                      this.setState({
                        viewMode: false,
                        currentSelectedId: "",
                        base64data: "",
                        loading: false,
                      });
                    }}>
                      <Icon className="material-icons-round">swap_horizontal_circle</Icon>&nbsp;back
                    </SuiButton>

                    <SuiButton variant="text" buttonColor="error" onClick={this.deleteReport}>
                      <Icon className="material-icons-round">delete</Icon>&nbsp;delete
                    </SuiButton>

                    <Dialog
                      open={this.state.open}
                      onClose={this.handleCloseDialogBox}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      fullWidth
                      maxWidth="sm"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Are you sure ?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure do you want to print ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <SuiButton onClick={this.printReport} autoFocus>Yes</SuiButton>
                        <SuiButton onClick={this.handleCloseDialogBox} >No</SuiButton>
                      </DialogActions>
                    </Dialog>

                    <Dialog
                      open={this.state.backdrop}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      fullWidth
                      maxWidth="sm"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Print in progress.."}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Please wait...
                        </DialogContentText>
                        <CircularProgress/>
                      </DialogContent>
                    </Dialog>

                  </SuiBox>
                  <img width="100%" height="100%"
                       src={`data:image/jpg;base64,${this.state.base64data}`} />
                </Card>
              </SuiBox>
            </SuiBox>
          </DashboardLayout>
        );
      }
    }


  }


}

export default withAlert()(SearchMedicalReports);
