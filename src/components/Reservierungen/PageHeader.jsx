import { Button, Col, Row, Select } from "antd";
import React from "react";
import { Container } from "react-bootstrap";

import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { options } from "../../utils/bookingHelper";
import moment from "moment";

export const PageHeader = ({
	showSelectedDays,
	showDrawer,
	showOldBookings,
	isActualBookings,
}) => {
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
					{isActualBookings ? (
						<>
							<span className="fs-6 text-muted mx-2">
								Zukünftige Reservierungen
							</span>
							{/* <Select
								defaultValue="3"
								style={{ width: 120 }}
								onChange={showSelectedDays}
								options={options}
							></Select> */}
						</>
					) : (
						<span className="fs-6 text-muted mx-2">
							Reservierungen {calculateLastMonthDates()}
						</span>
					)}
				</Col>
				<Col className="m-4">
					{isActualBookings ? (
						<Button type="link" onClick={showOldBookings}>
							<EyeOutlined /> Letze Monate
						</Button>
					) : (
						<Button type="link" onClick={showOldBookings}>
							<EyeOutlined /> Aktuelle Reservierungen
						</Button>
					)}
					<Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
						{" "}
						Reservationen hinzufügen
					</Button>
				</Col>
			</Row>
		</Container>
	);
};
