// @material-ui core components
import Card from "@material-ui/core/Card";
import { Component } from "react";
// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard Material-UI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Custom styles for the Tables
import SuiInput from "../../../components/SuiInput";
import SuiButton from "../../../components/SuiButton";

// Data
import medicalReportInput from "../tables/data/medicalReportInputData";
import Table from "../../../examples/Table";
import Grid from "@material-ui/core/Grid";
import { withAlert } from "react-alert";
import axios from "axios";
import SuiTypography from "../../../components/SuiTypography";
import Searchable from "react-searchable-dropdown";
import Header from "./view-header/index";
import { Link } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const { columns: prCols, rows: prRows } = medicalReportInput;


class CreateMedicalReport extends Component {

  constructor(props) {
    super(props);
    this.onAddTestTitle = this.onAddTestTitle.bind(this);
    this.onCreateReport = this.onCreateReport.bind(this);
    this.onChangeValueInput = this.onChangeValueInput.bind(this);
    this.onCreateNewReport = this.onCreateNewReport.bind(this);
    this.printReport = this.printReport.bind(this);
    this.handleCloseDialogBox = this.handleCloseDialogBox.bind(this);
    this.runConfirmation = this.runConfirmation.bind(this);
    this.handleBackDrop = this.handleBackDrop.bind(this);

    this.state = {
      tests: [],
      rows: [],
      testAndValues: [],
      title: "",
      patientName: "",
      age: "",
      contactNo: "",
      refDoctor: "",
      reqDate: null,
      comment: "",
      viewMode: false,
      loading: false,
      open: false,
      backdrop : false
    };
  }

  handleBackDrop() {
    this.setState({
      backdrop : false
    })
  }

  handleCloseDialogBox() {
    this.setState({
      open : false
    })
  }

  printReport(){
    this.setState({
      open : false,
      backdrop : true
    })
    axios.get("http://localhost:2021/api/v1/medicalReport/" + this.state.createdId + "/print")
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

  runConfirmation() {
    this.setState({
      open : true
    })
  }



  onAddTestTitle(valueId) {
    if (valueId === null) {
      this.setState({
        rows: [],
      });
    } else {
      axios.get("http://localhost:2021/api/v1/reportFormat/" + valueId)
        .then(result => {
          let allInputRows = [];

          const reportTitle = result.data;
          if (reportTitle !== null) {
            reportTitle.reportFormats.forEach(object => {
              const obj = {
                Test: object.test,
                Unit: object.unit,
                Target: object.targetValue,
                Value: <SuiInput
                  placeholder="value"
                  onChange={(e) => {
                    const obj = {
                      test: object.reportFormatId,
                      value: e.target.value,
                    };
                    this.onChangeValueInput(obj);
                  }}
                />,
              };

              allInputRows.push(obj);
            });

            this.setState({
              rows: [...allInputRows],
              reportTitle: reportTitle.reportTitle,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });

    }
  }

  onCreateReport(event) {
    event.preventDefault();
    if (this.state.patientName === "") {
      this.props.alert.error("Please add patient name");
    } else {

      if (this.state.testAndValues.length === 0) {
        this.props.alert.error("Please add at least one test");
      } else {

        let tests = [];
        this.state.testAndValues.forEach(val => {
          const obj = {
            reportFormat: {
              reportFormatId: val.test,
            },
            value: val.value,
          };
          tests.push(obj);
        });

        let requestedDate;
        if(this.state.reqDate === null || this.state.reqDate === undefined) {
          requestedDate = null
        } else {
          requestedDate = this.state.reqDate + "T00:00"
        }

        const object = {
          patientName: this.state.patientName,
          doctorName: this.state.refDoctor,
          reportToFormatRelationships: tests,
          age: this.state.age,
          comment: this.state.comment,
          contact: this.state.contact,
          reportTitle: this.state.reportTitle,
          requiredDateTime : requestedDate
        };

        axios.post("http://localhost:2021/api/v1/medicalReport", object)
          .then(r => {
            this.onCreateNewReport(r.data.medicalReportDbId);
          })
          .catch(error => console.log(error));
      }
    }
  }

  onChangeValueInput(object) {
    console.log(object);

    let temArr = this.state.testAndValues;

    const test = temArr.find(obj => obj.test === object.test);

    if (test === undefined || test === null) {
      temArr.push(object);
      this.setState({
        testAndValues: temArr,
      });
    } else {
      let tempArray = temArr.filter(obj => obj.test !== object.test);
      tempArray.push(object);
      this.setState({
        testAndValues: tempArray,
      });
    }

    console.log(this.state.testAndValues);
  }

  onCreateNewReport(id) {
    this.setState({
      loading: true,
    });
    axios.get("http://localhost:2021/api/v1/medicalReport/" + id)
      .then(result => {
          this.setState({
            base64data: result.data,
            createdId: id,
            loading: false,
          });

        },
      )
      .catch(error => {
        console.log(error);
      });
    this.setState({
      viewMode: true,
    });
  }


  componentDidMount() {

    axios.get("http://localhost:2021/api/v1/reportFormat/")
      .then(result => {
        console.log(result.data);
        let array = [];
        if (result.data !== undefined && result.data !== []) {
          result.data.forEach(test => {
            const obj = {
              value: test.reportFormatTitleId,
              label: test.reportTitle,
            };
            array.push(obj);
          });
        }
        console.log(array);
        this.setState({
          tests: array,
        });


      })
      .catch(error => {
        console.log(error);
      });

  }


  render() {

    if (!this.state.viewMode) {
      return (
        <DashboardLayout>
          <Header />
          <SuiBox py={3}>
            <SuiBox mb={3}>
              <Card>
                <from onSubmit={this.onCreateReport}>
                  <SuiBox>
                    <Card>
                      <SuiBox pt={2} pb={3} px={3}>
                        <SuiBox component="form" role="form">

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Patient Name
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="text" placeholder="name"
                                      onChange={(e) => {
                                        this.setState({
                                          patientName: e.target.value,
                                        });
                                      }} />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Age
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="number" placeholder="age"
                                      onChange={(e) => {
                                        this.setState({
                                          age: e.target.value,
                                        });
                                      }}
                            />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Contact No.
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="number" placeholder="contact"
                                      onChange={(e) => {
                                        this.setState({
                                          contact: e.target.value,
                                        });
                                      }}
                            />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Ref. Doctor
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="text" placeholder="ref. doctor" onChange={(e) => {
                              this.setState({
                                refDoctor: e.target.value,
                              });
                            }} />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Req. Date/Time
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="date" placeholder="date time" onChange={(e) => {
                              this.setState({
                                reqDate: e.target.value,
                              });
                            }} />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Comment
                              </SuiTypography>
                            </SuiBox>
                            <SuiInput type="textarea" placeholder="comment" onChange={(e) => {
                              this.setState({
                                comment: e.target.value,
                              });
                            }} />
                          </SuiBox>

                          <SuiBox mb={2}>
                            <SuiBox mb={1} ml={0.5}>
                              <SuiTypography component="label" variant="caption" fontWeight="bold">
                                Select a report
                              </SuiTypography>
                            </SuiBox>
                            <Searchable
                              value=""
                              hideSelected
                              placeholder="Search" // by default "Search"
                              notFoundText="No result found" // by default "No result found"
                              options={this.state.tests}
                              onSelect={value => {
                                this.onAddTestTitle(value);
                              }}
                              listMaxHeight={200} //by default 140
                            />
                          </SuiBox>

                          <Grid item>
                            <SuiBox height="100%" mt={0.5}>
                              <SuiBox>
                                <Table columns={prCols} rows={this.state.rows} />
                              </SuiBox>
                            </SuiBox>
                          </Grid>
                          <SuiBox mt={4} mb={1}>
                            <SuiButton variant="gradient"
                                       buttonColor="dark"
                                       fullWidth type={"submit"}
                            >
                              Create
                            </SuiButton>
                          </SuiBox>
                        </SuiBox>
                      </SuiBox>
                    </Card>
                  </SuiBox>
                </from>
              </Card>
            </SuiBox>
          </SuiBox>
        </DashboardLayout>
      );
    } else {

      if(this.state.loading) {

        return (
          <DashboardLayout>
            <LinearProgress color="secondary" />
          </DashboardLayout>
        )

      } else {
        return (
          <DashboardLayout>
            <Header />
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
                               to={{ pathname: `/search/` }}>
                      <Icon className="material-icons-round">swap_horizontal_circle</Icon>&nbsp;back
                    </SuiButton>

                  </SuiBox>

                  <Dialog
                    open={this.state.open}
                    onClose={this.handleCloseDialogBox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
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

                  <img width="100%" height="100%"
                       src={`data:image/jpg;base64,${this.state.base64data}`} />
                </Card>
              </SuiBox>
            </SuiBox>
          </DashboardLayout>);
      }

    }
  }


}

export default withAlert()(CreateMedicalReport);
