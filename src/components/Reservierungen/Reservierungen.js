import React, { useEffect, useState } from "react";
import "./style.css";
import {
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
	Calendar,
	Tag,
} from "antd";


import "moment/locale/de";
import locale from "antd/es/date-picker/locale/zh_CN";
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
import RowHeader from "./RowHeader";
import MonthSelector from "./MonthSelector";
import Header from "./Header";

function Reservierungen() {
	const [data, setData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [selectedDate, setSelectedDate] = useState(
		moment().format("DD/MM/YYYY")
	);
	const [editRecord, setEditRecord] = useState([]);
	const EMPTY_STRING = "";
	const [open, setOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [segmentedMonth, setSegmentedMonth] = useState(() =>
		moment().format("MMMM")
	);
	const [value, setValue] = useState(() => moment());

	let db = new Localbase("pooltime_BOOKINGS");
	const collName = "bookings";

	// //Comment to remove logger
	db.config.debug = false;

	const colorsBadge = [
		{ table: "Snooker", color: "#090" },
		{ table: "7", color: "#c60" },
		{ table: "8", color: "black" },
		{ table: "9", color: "#ffae00" },
		{ table: "10", color: "#108ee9" },
	];

	useEffect(() => {
		getDBdata();
	}, []);

	useEffect(() => {
		setBookings(data.filter((b) => b.date === selectedDate));
		setMonthlyData(
			data.filter((b) => moment(b.date).format("MMMM") === segmentedMonth)
		);
	}, [data]);

	useEffect(() => {
		console.log("month changed", segmentedMonth);
		setMonthlyData(
			data.filter((b) => moment(b.date).format("MMMM") === segmentedMonth)
		);
	}, [value]);

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
		table: form.table ? form.table : EMPTY_STRING,
		extra: form.extra ? form.extra : EMPTY_STRING,
	});

	/** Booking Schema */
	const updateReservation = (form) => ({
		id: form.id,
		name: form.name,
		date: form.date.format("DD/MM/YYYY"),
		time: form.date.format("HH:mm"),
		table: form.table ? form.table : EMPTY_STRING,
		extra: form.extra ? form.extra : EMPTY_STRING,
	});

	const showNotification = (type, title, desc) => {
		notification[type]({
			message: title,
			description: desc,
		});
	};

	const getTableColor = (table) => {
		let color;
		colorsBadge.forEach((item) => {
			if (item.table === table) color = item.color;
		});
		return color;
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

	// // ! -------------------------------------- ACTIONS BUTTON

	// //!TODO Implement action functions
	const editBooking = (form) => {
		const reservation = updateReservation(form);
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

	// const repeatBooking = (recordID) => {
	// 	console.log(recordID);
	// };

	// ! -------------------------------------- RENDER

	const dateCellRender = (value) => {
		return (
			<ul className="events">
				{data.map(
					(item) =>
						moment(value).format("DD/MM/YYYY") === item.date && (
							<li key={item}>
								<Tag color={getTableColor(item.table)}>
									{item.time} | {item.name}
								</Tag>
							</li>
						)
				)}
			</ul>
		);
	};

	const onSelect = (value) => {
		const date = moment(value).format("DD/MM/YYYY");
		setSelectedDate(date);
		setBookings(data.filter((b) => b.date === date));
	};

	const changeMonthView = (val) => {
		setValue(moment(val, "MMMM"));
	};

	return (
		<>
			<PageHeader showDrawer={showDrawer} />
			<Header selectedDate={selectedDate} />
			
			<Row className="mb-4">
				<RowHeader />
				<Booking
					bookings={bookings}
					showEditModal={showEditModal}
					deleteBooking={deleteBooking}
				/>
			</Row>

			<Calendar
				value={value}
				dateCellRender={dateCellRender}
				onSelect={onSelect}
				locale={locale}
				defaultValue={moment().format("DD/MM/YYYY")}
				headerRender={() => (
					<Row justify={"center"} className="p-4 text-center">
						<Col>
							<MonthSelector
								value={value}
								changeMonthView={changeMonthView}
								segmentedMonth={segmentedMonth}
							/>
						</Col>
					</Row>
				)}
			/>

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
									minuteStep={15}
									disabledDate={disabledDate}
									disabledTime={disabledDateTime}
									showTime={{ defaultValue: moment("00:18:00", "HH:mm") }}
									style={{
										width: "100%",
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
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
									minuteStep={15}
									disabledDate={disabledDate}
									disabledTime={disabledDateTime}
									showTime={{ defaultValue: moment("00:18:00", "HH:mm") }}
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
