import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import logo from "../logo.png";
import React, { useState, useEffect } from "react";
import { Button } from "antd";

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
							<Nav.Link href="#">
								<Link to="/" className="m-3">
									<Button type="primary" size="medium" shape="round">
										Timer
									</Button>
								</Link>
							</Nav.Link>
							<Nav.Link href="#">
								<Link to="/getranke" className="m-3 text-right">
									<Button type="primary" size="medium" shape="round">
										Getränke
									</Button>
								</Link>
							</Nav.Link>
							<Nav.Link href="#">
								<Link to="/reservierungen" className="m-3">
									<Button type="primary" size="medium" shape="round">
										Reservierung
									</Button>
								</Link>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
					<Navbar.Collapse className="justify-content-end">
						<Navbar.Text>
							<h5
								style={{
									// margin: '20px auto',
									// padding: '15px 8px',
									color: "#fff",
									textAlign: "center",
								}}
							>
								{dateState.toLocaleString("en-US", {
									hour: "numeric",
									minute: "numeric",
									hour12: true,
								})}
							</h5>
						</Navbar.Text>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default BootNavbar;
