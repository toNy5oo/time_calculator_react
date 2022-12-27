import React, { useEffect, useState } from "react";
import {
	Empty,
	Form,
	Input,
	Button,
	DatePicker,
	Select,
	Drawer,
	Space,
	Row,
	Col,
	Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import Localbase from "localbase";
import { Container } from "react-bootstrap";
import Booking from "./BookingDate";

function Reservierungen() {
	const [bookings, setBookings] = useState([]);
	const [uniqueDates, setUniqueDates] = useState([]);

	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};
	let db = new Localbase("pooltime_BOOKINGS");
	const collName = "bookings";

	//Comment to remove logger
	db.config.debug = false;

	useEffect(() => {
		fetchDBBookingsData();
	}, []);

	/** Fetch the reservations from the DB sorted by date to pay in ascending order*/
	async function fetchDBBookingsData() {
		try {
			let bookingsDB = await db
				.collection(collName)
				.orderBy("date", "asc")
				.get();

			//Get unique list of dates
			const dateSet = new Set();
			bookingsDB && setBookings(bookingsDB);
			for (const booking of bookingsDB) {
				dateSet.add(booking.date);
			}

			//Create array from SET
			setUniqueDates(Array.from(dateSet));

			/** Creates a subarray for each single date and add that to OrderedArray */
			const orderedBookings = [];
			for (const date of uniqueDates) {
				const singleDateBookings = bookingsDB.filter(
					(booking) => booking.date === date
				);
				orderedBookings.push(singleDateBookings);
			}

			setBookings(orderedBookings);
		} catch (error) {
			console.log("error: ", error);
		}
	}

	/**
	 *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
	 */
	async function addReservationsToDatabase(booking) {
		//Create a new record
		try {
			await db.collection(collName).add(booking);
		} catch (error) {
			console.log("There was an error, do something else.");
		}

		fetchDBBookingsData();
	}

	/** Booking Schema */
	const createReservation = (form) => ({
		id: Math.floor(Math.random() * Date.now()),
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : "Keine handynummer",
		table: form.table ? form.table : "Keine Tisch gegeben",
		extra: form.extra ? form.extra : "Keine extra info",
	});

	const onFinish = (form) => {
		console.log(form);
		const reservation = createReservation(form);
		addReservationsToDatabase(reservation);
	};

	const range = (start, end) => {
		const result = [];
		for (let i = start; i < end; i++) {
			result.push(i);
		}
		return result;
	};

	const disabledDateTime = () => ({
		disabledHours: () => range(0, 24).splice(0, 18),
	});

	const disabledDate = (current) => {
		// Can not select days before today and today
		return current && current < moment().endOf("day");
	};

	const editBooking = (recordID) => {
		console.log(recordID);
	};
	const deleteBooking = (recordID) => {
		console.log(recordID);
	};

	return (
		<>
			<Container>
				<Row justify="space-between" className="bg-light rounded my-3">
					<Col className="m-4">
						<Space>
							<div className="fs-5 text-muted">
								Reservationen für die nächste 7 Tage
							</div>
						</Space>
					</Col>
					<Col className="m-4">
						<Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
							{" "}
							Reservationen hinzufügen
						</Button>
					</Col>
				</Row>
			</Container>


			{
			bookings?.length > 0
			?
			(
			bookings.map((singleDateArray, index) => (
				<Booking bookings={singleDateArray} date={uniqueDates[index]} editBooking={editBooking} deleteBooking={deleteBooking} />
			))
			)
			:
			(<Empty />)
			
			}

			<Drawer
				title="Neue Reservierungen"
				width={720}
				onClose={onClose}
				open={open}
				bodyStyle={{
					paddingBottom: 80,
				}}
			>
				<Form name="bookingForm" onFinish={onFinish} layout="vertical">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Name"
								rules={[
									{
										required: true,
										message: "Please enter a reference name",
									},
								]}
							>
								<Input placeholder="Please enter a name" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="date"
								label="Date"
								rules={[
									{
										required: true,
										message: "Please select a date",
									},
								]}
							>
								<DatePicker
									format="DD/MM/YYYY HH:mm"
									hideDisabledOptions
									minuteStep={5}
									disabledDate={disabledDate}
									disabledTime={disabledDateTime}
									showTime={{ defaultValue: moment("00:00:00", "HH:mm") }}
									style={{
										width: "100%",
									}}
									//  getPopupContainer={(trigger) => trigger.parentElement}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="phone"
								label="Handynummer"
								// rules={[
								// 	{
								// 		required: true,
								// 		message: "Please select an owner",
								// 	},
								// ]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="table"
								label="Tisch"
								// rules={[
								// 	{
								// 		required: true,
								// 		message: "Please choose the type",
								// 	},
								// ]}
							>
								<Select placeholder="Please choose a table">
									<Select.Option value="7">Tisch 7</Select.Option>
									<Select.Option value="8">Tisch 8</Select.Option>
									<Select.Option value="9">Tisch 9</Select.Option>
									<Select.Option value="10">Tisch 10</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="extra"
								label="Extra Info"
								// rules={[
								// 	{
								// 		required: true,
								// 		message: "please enter url description",
								// 	},
								// ]}
							>
								<Input.TextArea rows={4} placeholder="Extra informationen" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item>
								<Button type="primary" htmlType="submit" block className="mt-3">
									Submit
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	);
}

export default Reservierungen;
