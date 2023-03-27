import { Button, Col, Row } from "antd";
import React from "react";
import { Container } from "react-bootstrap";

import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";

export const PageHeader = ({ showDrawer, showOldBookings }) => {
	const calculateLastMonthDates = () => {
		const today = moment().format("DD/MM/YYYY");
		const initialDate = moment(today, "DD/MM/YYYY").subtract(30, "day");
		const yesterday = moment(today, "DD/MM/YYYY").subtract(1, "day");
		return `Von ${moment(initialDate).format("DD/MM/YYYY")} bis ${moment(
			yesterday
		).format("DD/MM/YYYY")}`;
	};

	return (
		<Container>
			<Row
				justify={"space-between"}
				align={"middle"}
				className="bg-light rounded my-3"
			>
				<Col className="m-4">
					<span className="fs-6 text-muted mx-2">
						Zukünftige Reservierungen
					</span>
				</Col>
				<Col className="m-4">
					<Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
						{" "}
						Reservationen hinzufügen
					</Button>
				</Col>
			</Row>
		</Container>
	);
};
