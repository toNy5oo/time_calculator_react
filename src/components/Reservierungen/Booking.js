import { Divider } from "antd";
import React from "react";

const Booking = ({ booking }) => {
	return (
		<>
			<Divider>{booking.date}</Divider>
			<div>
				{booking.name} 
			</div>
		</>
	);
};

export default Booking;
