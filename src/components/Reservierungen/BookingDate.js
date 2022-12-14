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
import RowHeader from "./RowHeader";

const BookingDate = ({
	bookings,
	date,
	showEditModal,
	deleteBooking,
	repeatBooking,
	isActualBookings,
}) => {
	return (
		<>
			<Container className="mb-5">
				<Row align={"middle"} className="mt-4 mb-2 mx-2 fs-6 border-bottom p-1">
					<div
						className={`${
							moment().format("DD/MM/YYYY") === date ? "" : "text-muted"
						}`}
					>
						<CalendarOutlined className="mx-2" />
						<strong>{moment(date, "DD/MM/YYYY").format("dddd")}</strong>
						<span className="mx-1">{date}</span>
					</div>
				</Row>
				<RowHeader isActualBookings={isActualBookings} />
				{/* </Divider> */}
				<div>
					{bookings?.map((booking) => (
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
									key={booking.id}
									justify={"space-between"}
									align={"middle"}
									className="mx-2 my-1 bg-light p-2 text-center"
								>
									<Col span={2}>{booking.time}</Col>
									<Col span={6}>{booking.name}</Col>
									<Col span={1}>{booking.table}</Col>
									<Col span={4}>{booking.phone}</Col>
									<Col span={8}>{booking.extra}</Col>
									{isActualBookings && (
										<Col span={3}>
											<Tooltip title="Reservierung bearbeiten">
												<Button
													type="link"
													icon={<EditOutlined />}
													onClick={() => showEditModal(booking.id)}
												/>
											</Tooltip>
											{/* <Button
								type="link"
								className="text-info"
								icon={<ReloadOutlined />}
								onClick={() => repeatBooking(booking.id)}
							/> */}
											<Popconfirm
												title="Are you sure to delete this booking"
												onConfirm={() => deleteBooking(booking.id)}
												// onCancel={cancel}
												okText="Yes"
												cancelText="No"
											>
												<Tooltip title="Reservierung l??schen">
													<Button
														type="link"
														danger
														icon={<DeleteOutlined />}
														// onClick={() => deleteBooking(booking.id)}
													/>
												</Tooltip>
											</Popconfirm>
										</Col>
									)}
								</Row>
							</motion.div>
						</AnimateSharedLayout>
					))}
				</div>
			</Container>
		</>
	);
};

export default BookingDate;
