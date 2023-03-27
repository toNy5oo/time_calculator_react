import moment from "moment";
import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
const Header = ({selectedDate}) => {
	return (
		// <Row justify={"center"} align={"middle"} className="mt-4 mb-2 mx-2 fs-6 border-bottom p-1">
			<div className={`text-muted text-center fs-5 border-bottom mt-4 p-2`}>
				<CalendarOutlined className="mx-2" />
				<strong>{moment(selectedDate, "DD/MM/YYYY").format("dddd")}</strong>
				<span className="mx-1">{selectedDate}</span>
			</div>
		// </Row>
	);
};

export default Header;
