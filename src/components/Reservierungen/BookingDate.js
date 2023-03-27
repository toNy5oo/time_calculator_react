import { Button, Col, Popconfirm, Row, Tooltip } from "antd";
import React from "react";
import { Container } from "react-bootstrap";
import {
	CalendarOutlined,
	EditOutlined,
	DeleteOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { AnimateSharedLayout, motion } from "framer-motion";

const BookingDate = ({ bookings, showEditModal, deleteBooking }) => {
	return (
		<Container>
			{bookings.length > 0 ? (
				bookings.map((booking) => (
					<AnimateSharedLayout>
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.8,
								delay: 0.2,
								ease: [0, 0.71, 0.2, 1.01],
							}}
						>
							<Row
								justify={"space-between"}
								align={"middle"}
								className="my-1 p-2 text-center text-muted fs-6"
								style={{ fontSize: "12px" }}
							>
								<Col span={2}>{booking.time}</Col>
								<Col span={7}>{booking.name}</Col>
								<Col span={2}>{booking.table}</Col>
								<Col span={9}>{booking.extra}</Col>

								<Col span={2}>
									<Tooltip title="Reservierung bearbeiten">
										<Button
											type="link"
											icon={<EditOutlined />}
											onClick={() => showEditModal(booking.id)}
										/>
									</Tooltip>
									<Popconfirm
										title="Are you sure to delete this booking"
										onConfirm={() => deleteBooking(booking.id)}
										// onCancel={cancel}
										okText="Yes"
										cancelText="No"
									>
										<Tooltip title="Reservierung löschen">
											<Button
												type="link"
												danger
												icon={<DeleteOutlined />}
												// onClick={() => deleteBooking(booking.id)}
											/>
										</Tooltip>
									</Popconfirm>
								</Col>
							</Row>
						</motion.div>
					</AnimateSharedLayout>
				))
			) : (
				<Row
					justify={"space-between"}
					align={"middle"}
					className="my-1 p-2 fs-6 text-muted"
					style={{ fontSize: "12px" }}
				>
					<Col span={24}>No bookings</Col>
				</Row>
			)}
		</Container>
	);

	// 	<>
	// 		<Container className="mb-1">
	// 					<AnimateSharedLayout>
	// 						<motion.div
	// 							initial={{ opacity: 0, scale: 0.5 }}
	// 							animate={{ opacity: 1, scale: 1 }}
	// 							transition={{
	// 								duration: 0.8,
	// 								delay: 0.2,
	// 								ease: [0, 0.71, 0.2, 1.01],
	// 							}}
	// 						>
	// 							<Row
	// 								key={booking.id}
	// 								justify={"space-between"}
	// 								align={"middle"}
	// 								className="mx-2 my-1 bg-light p-2 text-center"
	// 							>
	// 								<Col span={4}>{booking.time}</Col>
	// 								<Col span={6}>{booking.name}</Col>
	// 								<Col span={1}>{booking.table}</Col>
	// 								<Col span={10}>{booking.extra}</Col>
	// 							</Row>
	// 						</motion.div>
	// 					</AnimateSharedLayout>
	// 		</Container>
	// 	</>
	// );
};

export default BookingDate;
