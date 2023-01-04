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

import moment from "moment";
import Localbase from "localbase";
import Booking from "./BookingDate";
import {
	disabledDate,
	disabledDateTime,
	parseDate,
} from "../../utils/bookingHelper";
import {
	ADD_ERR,
	ADD_ERR_DESC,
	ADD_ERR_TITLE,
	ADD_SUCC,
	ADD_SUCC_DESC,
	ADD_SUCC_TITLE,
	DEL_SUCC,
	DEL_SUCC_DESC,
	DEL_SUCC_TITLE,
	EDIT_ERR,
	EDIT_ERR_DESC,
	EDIT_ERR_TITLE,
	EDIT_SUCC,
	EDIT_SUCC_DESC,
	EDIT_SUCC_TITLE,
} from "./string";
import { PageHeader } from "./PageHeader";

function Reservierungen() {
	const [data, setData] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [oldBookings, setOldBookings] = useState([]);
	const [uniqueDates, setUniqueDates] = useState([]);
	const [uniqueOldDates, setUniqueOldDates] = useState([]);
	const [editRecord, setEditRecord] = useState([]);
	const [interval, setInterval] = useState(
		moment().add(3, "days").format("DD/MM/YYYY")
	);
	const [isActualBookings, setIsActualBookings] = useState(true);
	const EMPTY_STRING = "";
	const [open, setOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	let db = new Localbase("pooltime_BOOKINGS");
	const collName = "bookings";

	//Comment to remove logger
	db.config.debug = false;

	useEffect(() => {
		getDBdata();
	}, []);

	useEffect(() => {
		console.log("Data ", data);
		setBookingsArrays();
	}, [data]);

	// ! -------------------------------------- FETCHING DATA

	const getDBdata = async () => {
		try {
			const databaseResponse = await db
				.collection(collName)
				.orderBy("date", "asc")
				.get();

			setData(
				databaseResponse.filter((e) =>
					moment(e.date, "DD/MM/YYYY").isAfter(
						moment(moment().subtract(30, "day"), "DD/MM/YYYY")
					)
				)
			);
			removeOldBookingFromDB(databaseResponse);
		} catch (error) {
			console.log("error: ", error);
		}
	};

	const setBookingsArrays = () => {
		const bookingsFromToday = data.filter((e) =>
			moment(e.date, "DD/MM/YYYY").isAfter(
				moment(moment().subtract(1, "day"), "DD/MM/YYYY")
			)
		);

		/** Gets records until today */
		const bookingsUntilToday = data.filter((e) =>
			moment(e.date, "DD/MM/YYYY").isBefore(
				moment(moment().subtract(1, "day"), "DD/MM/YYYY")
			)
		);

		let dateSet = new Set();

		for (const booking of bookingsFromToday) {
			dateSet.add(booking.date);
		}
		//Create array from SET
		const uniqueActualDates = Array.from(dateSet).sort((a, b) =>
			moment(a, "DD/MM/YYYY").isAfter(moment(b, "DD/MM/YYYY"))
		);

		dateSet = new Set();

		for (const booking of bookingsUntilToday) {
			dateSet.add(booking.date);
		}
		//Create array from SET
		const uniqueOldDates = Array.from(dateSet).sort((a, b) =>
			moment(a, "DD/MM/YYYY").isAfter(moment(b, "DD/MM/YYYY"))
		);

		const orderedActualBookings = getOrderedBookings(
			bookingsFromToday,
			uniqueActualDates
		);

		const orderedOldBookings = getOrderedBookings(
			bookingsUntilToday,
			uniqueOldDates
		);

		setBookings(orderedActualBookings);
		setOldBookings(orderedOldBookings);

		setUniqueDates(createDatesArray(bookingsFromToday));
		setUniqueOldDates(createDatesArray(bookingsUntilToday));
	};

	const removeOldBookingFromDB = (databaseResponse) => {
		/** Removes past bookings */
		const pastBookings = databaseResponse.filter((e) =>
			moment(e.date, "DD/MM/YYYY").isBefore(
				moment(moment().subtract(1, "month"), "DD/MM/YYYY")
			)
		);

		// * Removes the bookings older than 30 days
		pastBookings?.map(async (b) => {
			try {
				await db.collection(collName).doc({ id: b.id }).delete();
			} catch (error) {
				console.log(error);
			}
		});
	};

	const createDatesArray = (response) => {
		//Get unique list of dates
		const dateSet = new Set();

		for (const booking of response) {
			dateSet.add(booking.date);
		}
		//Create array from SET
		return Array.from(dateSet).sort((a, b) =>
			moment(a, "DD/MM/YYYY").isAfter(moment(b, "DD/MM/YYYY"))
		);
	};

	const getOrderedBookings = (b, dateSet) => {
		console.log(b);
		console.log(dateSet);
		/** Creates a subarray for each single date and add that to OrderedArray */

		const orderedBookings = [];
		for (const date of dateSet) {
			const singleDateBookings = b.filter((booking) => booking.date === date);
			orderedBookings.push(singleDateBookings);
		}
		console.log(orderedBookings);
		return orderedBookings;
	};

	/**
	 *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
	 */
	async function addReservationsToDatabase(booking) {
		//Create a new record
		try {
			await db.collection(collName).add(booking);
			showNotification(ADD_SUCC, ADD_SUCC_TITLE, ADD_SUCC_DESC);
		} catch (error) {
			showNotification(ADD_ERR, ADD_ERR_TITLE, ADD_ERR_DESC);
			console.log("There was an error, do something else.");
		}
		getDBdata();
		onClose();
	}

	/**
	 *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
	 */
	async function editReservationsToDatabase(booking) {
		//Create a new record
		try {
			await db.collection(collName).doc({ id: booking.id }).update(booking);
			showNotification(EDIT_SUCC, EDIT_SUCC_TITLE, EDIT_SUCC_DESC);
		} catch (error) {
			showNotification(EDIT_ERR, EDIT_ERR_TITLE, EDIT_ERR_DESC);
			console.log("There was an error, do something else.");
		}
		getDBdata();
		onClose();
	}

	// ! -------------------------------------- UTILS

	/** Booking Schema */
	const createReservation = (form) => ({
		id: Math.floor(Math.random() * Date.now()),
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : EMPTY_STRING,
		table: form.table ? form.table : EMPTY_STRING,
		extra: form.extra ? form.extra : EMPTY_STRING,
	});

	/** Booking Schema */
	const updateReservation = (form) => ({
		id: form.id,
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		phone: form.phone ? form.phone : EMPTY_STRING,
		table: form.table ? form.table : EMPTY_STRING,
		extra: form.extra ? form.extra : EMPTY_STRING,
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
		const reservation = updateReservation(form);
		console.log(reservation);
		editReservationsToDatabase(reservation);
		closeModal();
	};

	const deleteBooking = async (id) => {
		try {
			const response = await db.collection(collName).doc({ id: id }).delete();
			//If the response is successful then remove the drinks from this user from the list
			response.success && getDBdata();
			showNotification(DEL_SUCC, DEL_SUCC_TITLE, DEL_SUCC_DESC);
		} catch (error) {
			console.log("Error: ", error);
		}
	};

	const repeatBooking = (recordID) => {
		console.log(recordID);
	};

	const showOldBookings = () => {
		setIsActualBookings(!isActualBookings);
	};

	// ! -------------------------------------- RENDER

	return (
		<>
			<PageHeader
				showSelectedDays={showSelectedDays}
				showDrawer={showDrawer}
				showOldBookings={showOldBookings}
				isActualBookings={isActualBookings}
			/>
			{/* //! ------------------------------ Actual bookings ------------------------------ */}
			{isActualBookings &&
				bookings.length > 0 &&
				bookings.map((singleDateArray, index) => (
					<Booking
						key={index + singleDateArray.length}
						bookings={singleDateArray}
						date={uniqueDates[index]}
						showEditModal={showEditModal}
						deleteBooking={deleteBooking}
						repeatBooking={repeatBooking}
						isActualBookings={isActualBookings}
					/>
				))}
			{/* //! ------------------------------ Old bookings ------------------------------ */}
			{!isActualBookings &&
				oldBookings?.length > 0 &&
				oldBookings?.map((singleDateArray, index) => (
					<Booking
						key={index + singleDateArray.length}
						bookings={singleDateArray}
						date={uniqueOldDates[index]}
						showEditModal={null}
						deleteBooking={null}
						repeatBooking={null}
						isActualBookings={isActualBookings}
					/>
				))}
			{/* //!--------------------------------------------------- DRAWER */}
			<Drawer
				title={"Neue Reservierung"}
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
