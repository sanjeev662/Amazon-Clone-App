import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./store";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Contextprovider from "./components/context/Contextprovider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Contextprovider>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  </Contextprovider>
);

reportWebVitals();
