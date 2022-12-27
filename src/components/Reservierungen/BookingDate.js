import { Button, Col, Divider, Row } from "antd";
import React from "react";
import { Container } from "react-bootstrap";
import {ClockCircleOutlined, CalendarOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'

const BookingDate = ({ bookings, date, editBooking, deleteBooking }) => {
	console.log(bookings, date)
	return (
		<>
			<Container>
			<Divider><CalendarOutlined /> {date}</Divider>
			{bookings?.map((booking) => (
				<Row key={booking.id} justify={"space-between"} align={"middle"} className="mx-2 my-1 bg-light p-2 text-center">
					<Col span={4}><ClockCircleOutlined />{' '}{booking.time}</Col>
					<Col span={4}>{booking.name}</Col>
					<Col span={4}>{booking.table}</Col>
					<Col span={4}>{booking.phone}</Col>
					<Col span={4}>{booking.extra}</Col>
					<Col span={3}>
						<Button type="link" icon={<EditOutlined />} onClick={editBooking(booking.id)}/>
						<Button type="link" danger icon={<DeleteOutlined />} onClick={deleteBooking(booking.id)}/>
					</Col>
				</Row>
			))}
			</Container>
		</>
	);
};

export default BookingDate;
