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
import Icon from "@material-ui/core/Icon";

// Soft UI Dashboard PRO Material-UI components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard PRO Material-UI example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card className="h-100">
      <SuiBox pt={3} px={3}>
        <SuiTypography variant="h6" fontWeight="medium">
          Create a Medical Report
        </SuiTypography>
        <SuiBox mt={1} mb={2}>
        </SuiBox>
      </SuiBox>
      <SuiBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="Create Report Title/Format"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="Create a test template in report title"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Add patient details in Create Medical Report"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="Select Report type in Create Medical Report"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="View and Print"
        />
      </SuiBox>
    </Card>
  );
}

export default OrdersOverview;
