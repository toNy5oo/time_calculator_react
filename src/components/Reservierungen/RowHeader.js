import { Col, Row } from "antd";
import React from "react";
import {
	ClockCircleOutlined,
	UserOutlined,
	InfoOutlined,
	HolderOutlined,
	NumberOutlined,
} from "@ant-design/icons";
import { Container } from "react-bootstrap";

const RowHeader = () => {
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
				<Col span={7}>
					<UserOutlined />
				</Col>
				<Col span={2}>
					<NumberOutlined />
				</Col>
				<Col span={9}>
					<InfoOutlined />
				</Col>
				<Col span={2}>
					<HolderOutlined />
				</Col>
			</Row>
		</Container>
	);
};

export default RowHeader;
