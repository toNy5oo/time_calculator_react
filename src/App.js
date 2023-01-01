import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import { Content } from "antd/lib/layout/layout";
import "./App.css";
import Getranke from "./components/Getranke/Getranke";
import Timer from "./components/Timer/Timer";
import Reservierungen from "./components/Reservierungen/Reservierungen";
import BootNavbar from "./components/BootNavbar";

// const { defaultAlgorithm, darkAlgorithm } = theme;

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
							<Route path="/" element={<Timer />} />{" "}
							<Route path="/getranke" element={<Getranke />} />{" "}
							<Route path="/reservierungen" element={<Reservierungen />} />{" "}
						</Routes>{" "}
					</Content>{" "}
				</Suspense>{" "}
			</Layout>{" "}
		</Router>
		// </ConfigProvider>
	);
}

export default App;
