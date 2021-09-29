// @material-ui core components
import Tooltip from "@material-ui/core/Tooltip";

// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import SuiAvatar from "components/SuiAvatar";
import SuiProgress from "components/SuiProgress";

// Custom styles for the Projects
import styles from "layouts/dashboard/components/Projects/styles";



export default function data() {
  const classes = styles();

  return {
    columns: [
      { name: "month", align: "center" },
      { name: "doctor", align: "center" },
      { name: "count", align: "center" },
    ]
  };
}
