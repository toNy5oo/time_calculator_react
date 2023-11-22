import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { navBarItems} from "../components/assets/const/const"
import { SettingsIcon } from "./assets/Icons";


function BootNavbar() {
	const [dateState, setDateState] = useState(new Date());
	useEffect(() => {
		setInterval(() => {
			setDateState(new Date());
		}, 60000);
	}, []);

	
	return (
		<>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Container>
					<Image src={logo} alt="Pooltime | BC Hanunstetten" />
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">

							{ navBarItems.map((item) => (
								<Nav.Link href="#">
								<Link to={item.linkTo} className="m-3">
									<Button type="primary" size="medium" shape="round">
										{item.label}
									</Button>
								</Link>
							</Nav.Link>
							)) }
						</Nav>
					</Navbar.Collapse>
							
					<Navbar.Collapse className="justify-content-end">
						<Navbar.Text className="d-flex gap-2 justify-content-center align-middle">
						<div
							className="d-flex border border-primary fs-4 text-secondary p-2 bg-white rounded"
							>
								{dateState.toLocaleString("en-US", {
									hour: "numeric",
									minute: "numeric",
									hour12: true,
								})}
							</div>
							{/* Settings page */}
							{/* <Nav.Link href="#" className="d-flex align-middle fs-4 align-self-center pt-1">
								<Link to="/settings">
								<SettingsIcon />
								</Link>
							</Nav.Link> */}
							
						</Navbar.Text>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default BootNavbar;
