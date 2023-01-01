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
	Modal,
	notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import Localbase from "localbase";
import { Container } from "react-bootstrap";
import Booking from "./BookingDate";
import {
	disabledDate,
	disabledDateTime,
	options,
	parseDate,
	showSelectedDays,
} from "../../utils/bookingHelper";

function Reservierungen() {
	const [bookings, setBookings] = useState([]);
	const [uniqueDates, setUniqueDates] = useState([]);
	const [editRecord, setEditRecord] = useState([]);
	const [interval, setInterval] = useState(
		moment().add(3, "days").format("DD/MM/YYYY")
	);

	const [open, setOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	let db = new Localbase("pooltime_BOOKINGS");
	const collName = "bookings";

	//Comment to remove logger
	db.config.debug = false;

	useEffect(() => {
		fetchDBBookingsData();
	}, [interval]);

	// ! -------------------------------------- FETCHING DATA

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
			showNotification(
				"success",
				"Booking confirmed",
				"The booking has been registered correctly"
			);
		} catch (error) {
			showNotification(
				"error",
				"There was a problem",
				"The booking has not been registered."
			);
			console.log("There was an error, do something else.");
		}

		fetchDBBookingsData();
		onClose();
	}

	/**
	 *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
	 */
	async function editReservationsToDatabase(booking) {
		//Create a new record
		try {
			await db.collection(collName).doc({ id: booking.id }).update(booking);
			showNotification(
				"info",
				"Booking updated",
				"The booking has been updated correctly"
			);
		} catch (error) {
			showNotification(
				"error",
				"There was a problem",
				"The booking has not been registered."
			);
			console.log("There was an error, do something else.");
		}

		fetchDBBookingsData();
		onClose();
	}

	// ! -------------------------------------- UTILS

	/** Booking Schema */
	const createReservation = (form) => ({
		id: Math.floor(Math.random() * Date.now()),
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : "",
		table: form.table ? form.table : "",
		extra: form.extra ? form.extra : "",
	});

	/** Booking Schema */
	const updateReservation = (form) => ({
		id: form.id,
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : "",
		table: form.table ? form.table : "",
		extra: form.extra ? form.extra : "",
	});

	const showNotification = (type, title, desc) => {
		notification[type]({
			message: title,
			description: desc,
		});
	};

	/** Changes the interval from the Select of the amount of days */
	const showSelectedDays = (val) => {
		const dateSelected = moment().add(val, "days").format("DD/MM/YYYY");
		setInterval(dateSelected);
	};

	// ! -------------------------------------- MODAL

	const showEditModal = async (id) => {
		try {
			const response = await db.collection(collName).doc({ id: id }).get();
			response && setEditRecord(response);
		} catch (err) {
			console.log("%cReservierungen.js line:132 Error", "color: #007acc;", err);
		}
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const cancelEdit = () => {
		setEditRecord([]);
		setIsModalOpen(false);
	};

	// ! -------------------------------------- DRAWER
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};

	const createBooking = (form) => {
		const reservation = createReservation(form);
		addReservationsToDatabase(reservation);
	};

	// ! -------------------------------------- ACTIONS BUTTON

	//!TODO Implement action functions
	const editBooking = (form) => {
		console.log(
			"%cReservierungen.js line:179 In edit ",
			"color: #007acc;",
			form
		);
		const reservation = updateReservation(form);
		console.log(reservation);
		editReservationsToDatabase(reservation);
		closeModal();
	};

	const deleteBooking = async (id) => {
		try {
			const response = await db.collection(collName).doc({ id: id }).delete();
			//If the response is successful then remove the drinks from this user from the list
			response.success && fetchDBBookingsData();
			showNotification(
				"success",
				"Booking deleted",
				"The reservation has been deleted"
			);
		} catch (error) {
			console.log("Error: ", error);
		}
	};

	const repeatBooking = (recordID) => {
		console.log(recordID);
	};

	// ! -------------------------------------- RENDER

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
						showEditModal={showEditModal}
						deleteBooking={deleteBooking}
						repeatBooking={repeatBooking}
					/>
				))
			) : (
				<Empty />
			)}

			{/* //!--------------------------------------------------- DRAWER */}

			<Drawer
				title="Neue Reservierungen"
				width={720}
				onClose={onClose}
				open={open}
				bodyStyle={{
					paddingBottom: 80,
				}}
			>
				<Form name="bookingForm" onFinish={createBooking} layout="vertical">
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
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="phone" label="Handynummer">
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="table" label="Tisch">
								<Select placeholder="Please choose a table">
									<Select.Option value="7">Tisch 7</Select.Option>
									<Select.Option value="8">Tisch 8</Select.Option>
									<Select.Option value="9">Tisch 9</Select.Option>
									<Select.Option value="10">Tisch 10</Select.Option>
									<Select.Option value="Snooker">Snooker</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item name="extra" label="Extra Info">
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

			{/* //!--------------------------------------------------- MODAL */}

			<Modal
				title="Reservierung Bearbeiten"
				open={isModalOpen}
				// onOk={editBooking}
				onCancel={cancelEdit}
				destroyOnClose={true}
				footer={null}
			>
				<Form name="editForm" onFinish={editBooking} layout="vertical">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Name"
								initialValue={editRecord.name}
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
								initialValue={parseDate(editRecord.date, editRecord.time)}
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
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="phone"
								label="Handynummer"
								initialValue={editRecord?.phone}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="table"
								label="Tisch"
								initialValue={editRecord?.table}
							>
								<Select placeholder="Please choose a table">
									<Select.Option value="7">Tisch 7</Select.Option>
									<Select.Option value="8">Tisch 8</Select.Option>
									<Select.Option value="9">Tisch 9</Select.Option>
									<Select.Option value="10">Tisch 10</Select.Option>
									<Select.Option value="Snooker">Snooker</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="extra"
								label="Extra Info"
								initialValue={editRecord?.extra}
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
					<Form.Item hidden name="id" initialValue={editRecord.id} />
				</Form>
			</Modal>
		</>
	);
}

export default Reservierungen;
