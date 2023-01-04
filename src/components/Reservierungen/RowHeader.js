import { Col, Row } from "antd";
import React from "react";
import {
	ClockCircleOutlined,
	UserOutlined,
	PhoneOutlined,
	InfoOutlined,
	HolderOutlined,
	NumberOutlined,
} from "@ant-design/icons";
import { Container } from "react-bootstrap";

const RowHeader = ({ isActualBookings }) => {
	return (
		<Container>
			<Row
				justify={"space-between"}
				align={"middle"}
				className="my-1 p-2 text-center text-muted"
				style={{ fontSize: "12px" }}
			>
				<Col span={2}>
					<ClockCircleOutlined />
				</Col>
				<Col span={6}>
					<UserOutlined />
				</Col>
				<Col span={1}>
					<NumberOutlined />
				</Col>
				<Col span={4}>
					<PhoneOutlined />
				</Col>
				<Col span={8}>
					<InfoOutlined />
				</Col>
				{isActualBookings && (
					<Col span={3}>
						<HolderOutlined />
					</Col>
				)}
			</Row>
		</Container>
	);
};

export default RowHeader;
