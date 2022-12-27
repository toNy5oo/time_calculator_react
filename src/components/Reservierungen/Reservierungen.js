import React, { useEffect, useState } from "react";
import {
	Empty,
	Form,
	Input,
	Button,
	DatePicker,
	Select,
	Drawer,
	Row,
	Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import Localbase from "localbase";
import { Container } from "react-bootstrap";
import Booking from "./BookingDate";

function Reservierungen() {
	const [bookings, setBookings] = useState([]);
	const [uniqueDates, setUniqueDates] = useState([]);
	const [interval, setInterval] = useState(
		moment().add(3, "days").format("DD/MM/YYYY")
	);

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
	}, [interval]);

	/** Fetch the reservations from the DB sorted by date to pay in ascending order*/
	async function fetchDBBookingsData() {
		try {
			const databaseResponse = await db
				.collection(collName)
				.orderBy("date", "asc")
				.get();

			/** Filter records by SelectedInterval of amount of reservations to show */
			const filtered = databaseResponse.filter((e) =>
				moment(e.date, "DD/MM/YYYY").isBefore(moment(interval, "DD/MM/YYYY"))
			);

			//Get unique list of dates
			const dateSet = new Set();

			for (const booking of filtered) {
				dateSet.add(booking.date);
			}

			//Create array from SET
			const dateArray = Array.from(dateSet);
			/** Ordering array by dates with moment objects */
			setUniqueDates(
				Array.from(
					dateArray.sort((a, b) =>
						moment(a, "DD/MM/YYYY").diff(moment(b, "DD/MM/YYYY"))
					)
				)
			);

			getOrderedBookings(databaseResponse, dateSet);
		} catch (error) {
			console.log("error: ", error);
		}
	}

	const getOrderedBookings = (bookingsDB, dateSet) => {
		/** Creates a subarray for each single date and add that to OrderedArray */
		const orderedBookings = [];
		for (const date of dateSet) {
			const singleDateBookings = bookingsDB.filter(
				(booking) => booking.date === date
			);
			orderedBookings.push(singleDateBookings);
		}
		setBookings(orderedBookings);
	};

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
		onClose();
	}

	/** Booking Schema */
	const createReservation = (form) => ({
		id: Math.floor(Math.random() * Date.now()),
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : "-",
		table: form.table ? form.table : "-",
		extra: form.extra ? form.extra : "-",
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
		// Can not select days before today
		return current && current < moment().subtract(1, "day").endOf("day");
	};

	//!TODO Implement action functions
	const editBooking = (recordID) => {
		console.log(recordID);
	};

	const deleteBooking = async (id) => {
		try {
			const response = await db.collection(collName).doc({ id: id }).delete();
			//If the response is successful then remove the drinks from this user from the list
			response.success && fetchDBBookingsData();
		} catch (error) {
			console.log("Error: ", error);
		}
		console.log(id);
	};

	const repeatBooking = (recordID) => {
		console.log(recordID);
	};

	const options = [
		{
			value: "0",
			label: "heute",
		},
		{
			value: "3",
			label: "3 Tage",
		},
		{
			value: "7",
			label: "7 Tage",
		},
		{
			value: "30",
			label: "30 Tage",
		},
	];

	const showSelectedDays = (val) => {
		const dateSelected = moment().add(val, "days").format("DD/MM/YYYY");
		setInterval(dateSelected);
		// fetchDBBookingsData();

		// // setBookings(
		// const newArray = bookings.map((dateBooking) =>
		// 	dateBooking.filter((singleBooking) =>
		// 		moment(singleBooking.date, "DD/MM/YYYY").isBefore(
		// 			moment(dateSelected, "DD/MM/YYYY")
		// 		)
		// 	)
		// );

		// newArray.filter((array) => array.length > 0);

		// setFilteredBookings(newArray.filter((array) => array.length > 0));

		// console.log("Filtered", filteredBookings);
	};

	return (
		<>
			<Container>
				<Row
					justify={"space-between"}
					align={"middle"}
					className="bg-light rounded my-3"
				>
					<Col className="m-4">
						<span className="fs-6 text-muted mx-2">
							Zeig reservierungen für
						</span>
						<Select
							defaultValue="3"
							style={{ width: 120 }}
							onChange={showSelectedDays}
							options={options}
						></Select>
					</Col>
					<Col className="m-4">
						<Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
							{" "}
							Reservationen hinzufügen
						</Button>
					</Col>
				</Row>
			</Container>
			{bookings?.length > 0 ? (
				bookings?.map((singleDateArray, index) => (
					<Booking
						key={index + singleDateArray.length}
						bookings={singleDateArray}
						date={uniqueDates[index]}
						editBooking={editBooking}
						deleteBooking={deleteBooking}
						repeatBooking={repeatBooking}
					/>
				))
			) : (
				<Empty />
			)}

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
