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

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// Soft UI Context Provider
import { SoftUIControllerProvider } from "context";
import { Backdrop } from "@material-ui/core";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER
};

ReactDOM.render(
  <BrowserRouter>
    <Provider template={AlertTemplate} {...options}>
    <SoftUIControllerProvider>
      <App />
    </SoftUIControllerProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);




