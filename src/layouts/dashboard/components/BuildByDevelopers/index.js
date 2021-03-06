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
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";

// Soft UI Dashboard Material-UI components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Custom styles for the BuildByDevelopers
import styles from "layouts/dashboard/components/BuildByDevelopers/styles";

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";

function BuildByDevelopers() {
  const classes = styles();

  return (
    <Card>
      <SuiBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SuiBox display="flex" flexDirection="column" height="100%">
              <SuiBox pt={1} mb={0.5}>
                <SuiTypography variant="body2" textColor="text" fontWeight="medium">
                  Build by developers
                </SuiTypography>
              </SuiBox>
              <SuiTypography variant="h5" fontWeight="bold" gutterBottom>
                Soft UI Dashboard
              </SuiTypography>
              <SuiBox mb={6}>
                <SuiTypography variant="body2" textColor="text">
                  From colors, cards, typography to complex elements, you will find the full
                  documentation.
                </SuiTypography>
              </SuiBox>
              <SuiTypography
                component="a"
                href="#"
                variant="button"
                textColor="text"
                fontWeight="medium"
                customClass={classes.buildByDevelopers_button}
              >
                Read More
                <Icon className="material-icons-round font-bold">arrow_forward</Icon>
              </SuiTypography>
            </SuiBox>
          </Grid>
          <Grid item xs={12} lg={5} className="ml-auto relative">
            <SuiBox
              height="100%"
              display="grid"
              justifyContent="center"
              alignItems="center"
              backgroundColor="info"
              borderRadius="lg"
              backgroundGradient
            >
              <SuiBox
                component="img"
                src={wavesWhite}
                alt="waves"
                display="block"
                position="absolute"
                left={0}
                width="100%"
                height="100%"
              />
            </SuiBox>
          </Grid>
        </Grid>
      </SuiBox>
    </Card>
  );
}

export default BuildByDevelopers;
