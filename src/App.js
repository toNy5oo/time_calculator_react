import React, { Suspense, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import { Content } from "antd/lib/layout/layout";
import "./App.css";
import Getranke from "./components/Getranke/Getranke";
import Timer from "./components/Timer/Timer";
import Reservierungen from "./components/Reservierungen/Reservierungen";
import BootNavbar from "./components/BootNavbar";
import Settings from "./components/Settings/Settings";
import Reset from "./components/Reset";

// const { defaultAlgorithm, darkAlgorithm } = theme;
const routes = [
  { path: "/", component: <Timer /> },
  { path: "/getranke", component: <Getranke /> },
  { path: "/settings", component: <Settings /> },
  { path: "/reservierungen", component: <Reservierungen /> },
  { path: "/resetStorage", component: <Reset /> },
];

function App() {
  // const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    // <ConfigProvider
    // 	theme={{
    // 		algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    // 	}}
    // >
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Suspense fallback={<div> Loading... </div>}>
          {" "}
          <BootNavbar />
          <Content>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.component} />
              ))}
            </Routes>{" "}
          </Content>{" "}
        </Suspense>{" "}
      </Layout>{" "}
    </Router>
    // </ConfigProvider>
  );
}

export default App;
