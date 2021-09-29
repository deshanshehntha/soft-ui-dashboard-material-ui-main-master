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
import CreateHeader from "./create-header";
import ViewHeader from "./view-header";

// Data
import reportFormatInput from "./tables/data/reportFormatInput";
import Table from "../../../examples/Table";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withAlert } from "react-alert";
import axios from "axios";
import SuiTypography from "../../../components/SuiTypography";

const { columns: prCols, rows: prRows } = reportFormatInput;


class CreateReportFormat extends Component {

  constructor(props) {
    super(props);
    console.log(props.location.query)
    this.onAddTest = this.onAddTest.bind(this);
    this.createReport = this.createReport.bind(this);
    this.onChangeValueInput = this.onChangeValueInput.bind(this);
    this.getReportTitleById = this.getReportTitleById.bind(this);

    this.state = {
      tests: [],
      rows: [],
      title: "",
      disabled: false,
      id: props.location.query,
      viewMode : false
    };
  }

  componentDidMount() {
    console.log(this.state.id);

    if(this.state.id !== undefined) {
      this.setState({
        disabled : true,
        viewMode : true
      })
      this.getReportTitleById(this.state.id);

    }
  }

  getReportTitleById(id) {
    axios.get("http://localhost:2021/api/v1/reportFormat/" + id)
      .then(r => {
        console.log(r.data);

        let allInputRows = []

        r.data.reportFormats.forEach(object => {
            const obj = {
              Test: <SuiTypography variant="button" fontWeight="medium">
                {object.test}
              </SuiTypography>,
              Unit: <SuiTypography variant="button" fontWeight="medium">
                {object.unit}
              </SuiTypography>,
              Target: <SuiTypography variant="button" fontWeight="medium">
                {object.targetValue}
              </SuiTypography>,
            };

            allInputRows.push(obj);
          });


          this.setState({
            disabled: true,
            title: r.data.reportTitle,
            tests: [],
            rows: [...allInputRows],

          });
      })
      .catch(error => {
        console.log(error)
      })
  }

  onChangeValueInput(object) {

    const index = this.state.tests.findIndex(x => x.test === object.test);
    if (index < 0) {
      let obj = {
        test: object.test,
        unit: null,
        targetValue: null,
        name: null,
      };
      if (object.type === "name") {
        obj.name = object.value;
      } else if (object.type === "unit") {
        obj.unit = object.value;
      } else if (object.type === "targetValue") {
        obj.targetValue = object.value;
      }


      this.state.tests.push(obj);

    } else {

      let obj = this.state.tests[index];

      if (object.type === "name") {
        obj.name = object.value;
      } else if (object.type === "unit") {
        obj.unit = object.value;
      } else if (object.type === "targetValue") {
        obj.targetValue = object.value;
      }

      this.state.tests[index] = obj;
    }


    console.log(this.state.tests);

  }


  onAddTest() {
    const rowNumber = this.state.rows.length + 1;
    let tempRows = this.state.rows;
    const obj = {
      Test: <SuiInput
        placeholder="name"
        onChange={(e) => {
          const obj = {
            test: rowNumber,
            type: "name",
            value: e.target.value,
          };
          this.onChangeValueInput(obj);
        }}
      />,
      Unit: <SuiInput
        placeholder="unit"
        onChange={(e) => {
          const obj = {
            test: rowNumber,
            type: "unit",
            value: e.target.value,
          };
          this.onChangeValueInput(obj);
        }}
      />,
      Target: <SuiInput
        placeholder="target"
        onChange={(e) => {
          const obj = {
            test: rowNumber,
            type: "targetValue",
            value: e.target.value,
          };
          this.onChangeValueInput(obj);
        }}
      />,
    };

    tempRows.push(obj);
    this.setState({
      rows: [...tempRows],
    });
  }

  createReport(event) {

    event.preventDefault();

    if (this.state.title === "") {
      this.props.alert.error("Report title is compulsory");
    } else {
      if (this.state.tests.length === 0) {
        this.props.alert.error("Add one or more tests");
      } else {
        const reqObject = {
          reportTitle: this.state.title,
          reportFormats: null,
        };

        let reqTestObjArray = [];

        if (this.state.tests.length > 0) {
          this.state.tests.forEach(testObj => {
            const reqTestObj = {
              test: testObj.name,
              unit: testObj.unit,
              targetValue: testObj.targetValue,
            };
            reqTestObjArray.push(reqTestObj);
          });
        }

        reqObject.reportFormats = reqTestObjArray;
        console.log("Final request object");
        console.log(reqObject);

        axios.post("http://localhost:2021/api/v1/reportFormat", reqObject)
          .then(r => {
            this.setState({
              tests: [],
              rows: [],

            });
            this.props.alert.success("Successfully Created");

            let allInputRows = [];

            r.data.reportFormats.forEach(object => {


              const obj = {
                Test: <SuiTypography variant="button" fontWeight="medium">
                  {object.test}
                </SuiTypography>,
                Unit: <SuiTypography variant="button" fontWeight="medium">
                  {object.unit}
                </SuiTypography>,
                Target: <SuiTypography variant="button" fontWeight="medium">
                  {object.targetValue}
                </SuiTypography>,
              };

              allInputRows.push(obj);
            });


            this.setState({
              disabled: true,
              title: r.data.reportTitle,
              tests: [],
              rows: [...allInputRows],

            });
          })
          .catch(error => console.log(error));
      }
    }
  }


  render() {
    return (
      <DashboardLayout>
        {
          this.state.disabled ? <ViewHeader /> : <CreateHeader />
        }

        <SuiBox py={3}>
          <SuiBox mb={3}>
            <Card>
              <from onSubmit={this.createReport}>
                <SuiBox>
                  <Card>
                    <SuiBox pt={2} pb={3} px={3}>
                      <SuiBox component="form" role="form">

                        <SuiBox mb={2}>
                          <SuiBox mb={1} ml={0.5}>
                            <SuiTypography component="label" variant="caption" fontWeight="bold">
                              Report Title
                            </SuiTypography>
                          </SuiBox>
                          <SuiInput value={this.state.title} placeholder="Report Title" onChange={(e) => {
                            this.setState({
                              title: e.target.value,
                            });
                          }} disabled={this.state.disabled} />
                        </SuiBox>


                        <SuiBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                          <SuiBox mr={1}>
                            <SuiButton variant="text"
                                       buttonColor="dark" onClick={this.onAddTest}
                                       disabled={this.state.disabled}>
                              <Icon className="material-icons-round font-bold">add</Icon>
                              &nbsp;add new test </SuiButton>
                          </SuiBox>
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
                                     disabled={this.state.disabled}
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
  }


}

export default withAlert()(CreateReportFormat);
