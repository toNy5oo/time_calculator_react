import React, { useEffect, useRef, useState } from "react";
import Localbase from "localbase";
import "../assets/css/buttons.css";
import {
	Button,
	List,
	Row,
	Skeleton,
	Space,
	Tag,
	notification,
	Tooltip,
	Modal,
	AutoComplete,
	Divider,
	Col,
	Popconfirm,
} from "antd";
import { UserOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DRINKS as drinklist } from "../assets/data/drinkList";
import { Container } from "react-bootstrap/";
import DrinkToAdd from "./DrinkToAdd";
import Header from "./Header";
import {
	belongsToUser,
	findUserName,
	totalPerDrink,
	userHasActiveDrinks,
} from "../../utils/drinksHelper";
import { AddCircleRounded, MoneyBillWave, RemoveCircleRounded } from "./Icons";
import { motion } from "framer-motion";

const options = drinklist.map((d) => ({ value: d.label, id: d.key }));

function Getranke() {
	//Notification
	const showNotification = (type, title, msg) => {
		notification[type]({
			message: title,
			description: msg,
		});
	};

	let db = new Localbase("pooltime_DRINKS");
	//Comment to remove logger
	db.config.debug = false;
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [isAdd, setIsAdd] = useState(false);
	const [userSelected, setUserSelected] = useState(0);
	const [addToUser, setAddToUser] = useState([]);
	const [itemsToCashout, setItemsToCashout] = useState([]);
	const [drinks, setDrinks] = useState([]);
	const [backupDrinks, setBackupDrinks] = useState([]);
	const [isAddUser, setIsAddUser] = useState(false);
	const [newUser, setNewUser] = useState("");
	const [autoCompleteSearch, setAutoCompleteSearch] = useState("");
	let inputElement = useRef(null);
	let inputRef = useRef(null);
	const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);

	const hideDrinkModal = () => {
		setIsDrinkModalOpen(false);
	};

	const showDrinkModal = () => {
		setIsDrinkModalOpen(true);
	};

	const openUserModal = (id) => {
		setUserSelected(id);
		setIsUserModalOpen(true);
	};

	const closeUserModal = () => {
		setBackupDrinks(drinks);
		setItemsToCashout([]);
		setIsUserModalOpen(false);
	};

	useEffect(() => {
		updateDatabaseState();
	}, []);

	useEffect(() => {
		setBackupDrinks(drinks);
	}, [drinks]);

	const updateDatabaseState = () => {
		fetchDBDrinksData();
		fetchDBUsersData();
	};
	/** Fetch the users from the DB sorted by amount to pay in descending order */
	async function fetchDBUsersData() {
		try {
			let usersDB = await db.collection("users").orderBy("toPay", "desc").get();
			usersDB && setUsers(usersDB);
		} catch (error) {
			console.log("error: ", error);
		}
	}

	async function fetchDBDrinksData() {
		try {
			let drinksDB = await db.collection("drinks").get();
			drinksDB && setDrinks(drinksDB);
		} catch (error) {
			console.log("Error: ", error);
		}
	}

	/** Get the id of the user and set it as selected user */
	const setRowDetails = (userId) => {
		setUserSelected(userId);
		setIsAdd(true);
		showDrinkModal();
	};

	const resetRowDetails = () => {
		setIsAdd(false);
		setUserSelected();
		setAddToUser([]);
		hideDrinkModal();
	};

	//! --------------------------------------------------------------------------------------------- UTILS -------------------------------------------------------

	const calculatUserAmount = (userID) => {
		// get document by key
		let totalAmount = 0;
		drinks.forEach((drink) => {
			if (belongsToUser(drink.uid, userID))
				totalAmount += totalPerDrink(drink.price, drink.amount);
		});
		//* Price expressed in 2 decimal points
		return totalAmount.toFixed(2);
	};

	function nameAlreadyExists() {
		return users.some((e) => e.title.toUpperCase() === newUser.toUpperCase());
	}

	//* Sums up the items into the cashout array
	const calculateCashOut = () =>
		itemsToCashout
			.reduce((acc, val) => acc + val.price * val.amount, 0)
			.toFixed(2);

	/**
	 *
	 * @param {Array} drinks
	 * @returns String - Amount to be paid
	 */
	const calculateAmountToPay = (drinks) => {
		let amountToPay = 0;
		drinks.map(
			(drink) => (amountToPay += totalPerDrink(drink.amount, drink.price))
		);
		//* Price expressed in 2 decimal points
		return amountToPay.toFixed(2) + " €";
	};

	/**
	 * Returns each single drink record as Tag
	 */
	const drinksDescriptions = (id) => {
		return drinks.filter((d) => d.uid === id).length !== 0
			? drinks.map(
					(d) =>
						d.uid === id && <Tag color="blue">{d.amount + " " + d.label}</Tag>
			  )
			: "Keine Getranke";
	};

	//! --------------------------------------------------------------------------------------------- USERS -------------------------------------------------------

	const addUser = () => {
		setIsAddUser(true);
	};

	// ? Checked
	const addUserToDB = async () => {
		if (nameAlreadyExists()) {
			showNotification(
				"warning",
				"User already present",
				"There is already a user with the name " + newUser
			);
			return;
		}
		if (newUser === "") {
			showNotification(
				"warning",
				"No name entered",
				"Please provide a name for the new mitglieder"
			);
			return;
		}
		//Unique ID
		const uniqueID = Math.floor(Math.random() * Date.now());
		try {
			const response = await db.collection("users").add({
				id: uniqueID,
				title: newUser,
				toPay: 0,
			});
			if (response.success) {
				fetchDBUsersData();
				setIsAddUser(false);
				setNewUser("");
				setUserSelected(uniqueID);
				showDrinkModal();
			}
		} catch (err) {
			showNotification(
				"warning",
				"User not added",
				"An error occurred during the operation. Please try again"
			);
			console.error(err);
		}
	};

	//! --------------------------------------------------------------------------------------------- ADD DRINKS -------------------------------------------------------

	const addDrinkToTemporaryList = (e, drinkID) => {
		e?.preventDefault();
		const [drink] = drinklist.filter((d) => d.key === drinkID);
		console.log(drink);
		//Add the standard amount of drinks = 1
		drink.amount = 1;
		//Add the ID of the selected user
		drink.uid = userSelected;
		//Add to the list of drinks to add to the current selected User
		addToUser.findIndex((el) => el.key === drink.key) === -1
			? setAddToUser((prevState) => [...prevState, drink])
			: showNotification(
					"Drink already added",
					drink.label + " is already present in the list of drinks to add."
			  );
		setAutoCompleteSearch("");
	};

	/**
	 *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
	 */
	async function addDrinksToUser() {
		//Create temp array with drinks from selectedUser
		let existingDrinks = drinks.filter((drink) => drink.uid === userSelected);

		if (addToUser.length > 0) {
			addToUser.forEach(async (drinkToAdd) => {
				let [currentDrink] = existingDrinks.filter(
					(el) => drinkToAdd.key === el.key
				);

				if (!currentDrink) {
					//Create a new record
					try {
						await db.collection("drinks").add(drinkToAdd);
					} catch (error) {
						console.log("There was an error, do something else.");
					}
				} else {
					//update the amount
					currentDrink.amount += drinkToAdd.amount;
					//update the doc on the db
					try {
						await db
							.collection("drinks")
							.doc({ uid: userSelected, key: drinkToAdd.key })
							.update({ amount: currentDrink.amount });
					} catch (error) {
						console.log("There was an error, do something else.");
					}
				}
				//Updates values in APP with DB data
				updateDatabaseState();
				//Set list of drinks to add to []
				setAddToUser([]);
				//Reset userSelected
				resetRowDetails();
			});
			showNotification(
				"success",
				"Getränke hinzufügen",
				"Getränke sind an der mitglieder " +
					findUserName(userSelected, users) +
					" hinzufügen"
			);
		} else {
			showNotification(
				"error",
				"Fehler",
				"Es gibt keine getränke ausgewählt " + findUserName(userSelected, users)
			);
		}
	}

	//! --------------------------------------------------------------------------------------------- CASH OUT -------------------------------------------------------

	//* Checks if the item has been added to the Cashout array
	const isAddedToCashout = (drinkID) =>
		itemsToCashout.findIndex(
			(e) => e.key === drinkID && e.uid === userSelected
		) !== -1
			? true
			: false;

	const isAllinCashout = (drinkID) => {
		if (isAddedToCashout(drinkID)) {
			const [drink] = drinks.filter(
				(d) => d.key === drinkID && d.uid === userSelected
			);
			const [cashoutDrink] = itemsToCashout.filter(
				(d) => d.key === drinkID && d.uid === userSelected
			);
			return cashoutDrink.amount === drink.amount ? true : false;
		} else return false;
	};

	/** //!DOES NOT REMOVE THE USER FROM THE UI */
	const removeCashedOutDrinks = async () => {
		itemsToCashout.forEach(async (d) => {
			if (isAllinCashout(d.key)) {
				try {
					await db
						.collection("drinks")
						.doc({ uid: userSelected, key: d.key })
						.delete();
					updateDatabaseState();
				} catch (err) {
					console.error(err);
				}
			} else {
				const [exDrinkRecord] = drinks.filter(
					(exDrink) => exDrink.key === d.key && exDrink.uid === userSelected
				);
				try {
					await db
						.collection("drinks")
						.doc({ uid: userSelected, key: d.key })
						.update({
							amount: exDrinkRecord.amount - d.amount,
						});
					updateDatabaseState();
				} catch (err) {
					console.error(err);
				}
			}
		});
		closeUserModal();
		showNotification(
			"success",
			"Drinks removed",
			"Selected drinks have been removed from the list"
		);
	};

	const closeUserTab = async (id) => {
		/** Delete drinks records only if they exists */
		if (userHasActiveDrinks(id, drinks)) {
			//Remove user record
			try {
				await db.collection("drinks").doc({ uid: id }).delete();
				//If the response is successful then remove the drinks from this user from the list
				updateDatabaseState();
			} catch (error) {
				console.log("Error: ", error);
			}
		}
		/** Delete user after removing all his drinks */
		try {
			const response = await db.collection("users").doc({ id: id }).delete();
			response.success && setUsers(users.filter((d) => d.uid !== id));
			updateDatabaseState();
		} catch (error) {
			console.log("Error: ", error);
		}

		/** Notify that the user has been removed from the list */
		showNotification(
			"success",
			"User removed",
			"User has been removed from the active list"
		);
		closeUserModal();
	};

	const addItemToCashout = (drinkID) => {
		if (isAddedToCashout(drinkID)) {
			//* Drinks is already present in the array
			setItemsToCashout(
				itemsToCashout.map((d) =>
					d.key === drinkID && d.uid === userSelected
						? { ...d, amount: d.amount + 1 }
						: d
				)
			);
		} else {
			//* Drink is inserted for the first time

			let [selectedDrink] = drinks.filter(
				(d) => d.key === drinkID && d.uid === userSelected
			);
			setItemsToCashout((prevState) => [
				...prevState,
				{ ...selectedDrink, amount: 1 },
			]);
		}
		setBackupDrinks(
			backupDrinks.map((d) =>
				d.key === drinkID ? { ...d, amount: d.amount - 1 } : d
			)
		);
	};

	//* Removes item from cashout
	const removeFromCashout = (drinkID) => {
		const [drink] = itemsToCashout.filter(
			(d) => d.key === drinkID && d.uid === userSelected
		);
		if (drink.amount === 1) {
			setItemsToCashout(itemsToCashout.filter((e) => e !== drink));
		} else {
			setItemsToCashout(
				itemsToCashout.map((d) =>
					d.key === drinkID ? { ...d, amount: d.amount - 1 } : d
				)
			);
		}
		setBackupDrinks(
			backupDrinks.map((d) =>
				d.key === drinkID ? { ...d, amount: d.amount + 1 } : d
			)
		);
	};

	//! --------------------------------------------------------------------------------------------- RENDER -------------------------------------------------------

	return (
		<>
			<Header
				users={users}
				setFilteredUsers={setFilteredUsers}
				addUser={addUser}
				inputElement={inputElement}
				setIsAddUser={setIsAddUser}
				addUserToDB={addUserToDB}
				setNewUser={setNewUser}
				isAddUser={isAddUser}
				inputRef={inputRef}
			/>
			{/* List */}
			<Container>
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.8,
						delay: 0.2,
						ease: [0, 0.71, 0.2, 1.01],
					}}
				>
					<List
						className="demo-loadmore-list"
						itemLayout="horizontal"
						dataSource={filteredUsers.length !== 0 ? filteredUsers : users}
						renderItem={(userRecord) => (
							<List.Item
								key={userRecord.id}
								className="bg-light p-4 rounded mt-1"
								actions={[
									<Button
										type="link"
										className="fs-4"
										onClick={() => setRowDetails(userRecord.id)}
									>
										<AddCircleRounded />
									</Button>,
									<Tooltip title={`Cash Out ${userRecord.title}`}>
										<Button
											type="link"
											className="text-success fs-5"
											onClick={() => openUserModal(userRecord.id)}
										>
											<MoneyBillWave />
										</Button>
									</Tooltip>,
								]}
							>
								{/* <Skeleton
								avatar
								title={false}
								loading={userRecord.loading}
								active
							> */}
								<List.Item.Meta
									key={userRecord.id + userRecord.title}
									avatar={
										<UserOutlined
											style={{
												fontSize: "25px",
												marginTop: "10px",
												padding: "5px",
											}}
										/>
									}
									title={
										<Row align={"middle"}>
											<Button
												type="link"
												onClick={() => openUserModal(userRecord.id)}
											>
												<div className="fs-6">{userRecord.title}</div>
											</Button>
											{
												<Tag color="red" className="mx-2">
													{calculatUserAmount(userRecord.id)} €
												</Tag>
											}
										</Row>
									}
									description={drinksDescriptions(userRecord.id)}
								/>
								{/* </Skeleton> */}
							</List.Item>
						)}
					/>
				</motion.div>
			</Container>

			{/* //! ----------------------------------------------------------------------- ADD DRINK MODAL --------------------------------- */}

			<Modal
				width={"70%"}
				title={`Add drinks to ${findUserName(userSelected, users)}`}
				open={isDrinkModalOpen}
				afterClose={() => setAddToUser([])}
				onOk={addToUser.length > 0 && addDrinksToUser}
				onCancel={hideDrinkModal}
				destroyOnClose={true}
			>
				<Row justify={"space-between"} align={"middle"}>
					<Space>
						<SearchOutlined className="text-secondary" />
						<span className="mx-1 text-secondary fs-6">Getränke Suchen</span>
					</Space>
					<AutoComplete
						allowClear
						autoFocus={true}
						style={{
							width: "50%",
							minWidth: 180,
						}}
						notFoundContent={"No drink with that name"}
						options={options}
						placeholder="Getränke suchen..."
						filterOption={true}
						onSelect={(value, option) =>
							addDrinkToTemporaryList(null, option.id)
						}
						onSearch={(value) => setAutoCompleteSearch(value)}
						value={autoCompleteSearch}
					/>
				</Row>
				<div className="text-right my-2">
					{drinks.map((d) => {
						if (d.uid === userSelected) {
							return (
								<Button type="link" className="m-0 p-0">
									<Tag
										className="p-1"
										onClick={(e) => addDrinkToTemporaryList(e, d.key)}
										color="blue"
									>
										<PlusOutlined />
										<span>{d.label}</span>
									</Tag>
								</Button>
							);
						}
					})}
				</div>
				<Divider />
				<Row justify={"space-between"} align={"middle"} className="my-3">
					<Row justify={"start"} align={"middle"}>
						{addToUser.length > 0 ? (
							addToUser.map((e) => (
								<DrinkToAdd
									drinkName={e.label}
									addToUser={addToUser}
									setAddToUser={setAddToUser}
									drinkId={e.key}
									calculateAmountToPay={calculateAmountToPay}
								/>
							))
						) : (
							<div className="text-muted fs-6 mx-1">
								Keine getranke hinzufugt
							</div>
						)}
					</Row>
					{
						<div className="fs-6 fw-bold">
							{calculateAmountToPay(addToUser)}
						</div>
					}{" "}
				</Row>
			</Modal>

			{/* //! ----------------------------------------------------------------------- PAY MODAL --------------------------------- */}
			<Modal
				width={"50%"}
				style={{ minWidth: "300px" }}
				title={`Drinklist von  ${findUserName(userSelected, users)}`}
				open={isUserModalOpen}
				onCancel={closeUserModal}
				destroyOnClose={true}
				afterClose={() => setItemsToCashout([])}
				// //? ----------------------------------------------------------------- MODAL FOOTER ----------------------------------------
				footer={[
					<Row justify={"space-between"}>
						<Popconfirm
							placement="top"
							title={"Hat die mitglieder alles bezhalt?"}
							onConfirm={() => closeUserTab(userSelected)}
							okText="Ja"
							cancelText="Nein"
						>
							{drinks
								.filter((d) => d.uid === userSelected)
								.reduce((acc, val) => acc + val.price * val.amount, 0) > 0 && (
								<Button key="3" danger>
									Pay everything (
									{drinks
										.filter((d) => d.uid === userSelected)
										.reduce((acc, val) => acc + val.price * val.amount, 0)
										.toFixed(2) + " €"}
									)
								</Button>
							)}
						</Popconfirm>

						<div>
							<Button key="1" onClick={closeUserModal}>
								Cancel
							</Button>
							{drinks.findIndex((d) => d.uid === userSelected) === -1 ? (
								<Button
									key="2"
									danger
									onClick={() => closeUserTab(userSelected)}
								>
									Remove User
								</Button>
							) : (
								<>
									{calculateCashOut() > 0 && (
										<Popconfirm
											placement="top"
											title={
												"Hat die mitglieder " + calculateCashOut() + " bezhalt?"
											}
											onConfirm={
												itemsToCashout.length > 0 && removeCashedOutDrinks
											}
											okText="Ja"
											cancelText="Nein"
										>
											<Button key="4" type="primary" className="mx-1">
												Pay selected drinks
											</Button>
										</Popconfirm>
									)}
								</>
							)}
						</div>
					</Row>,
				]}
			>
				{/* //? -------------------------------------------------------------------------------- DRINK LIST --------------------------- */}{" "}
				<div className="my-1 fs-6 px-3 py-2">Getränke Liste</div>
				{backupDrinks.map((d, i) => {
					if (d.uid === userSelected) {
						return (
							<>
								<Row
									key={d.uid + d.key}
									justify={"space-between"}
									align={"middle"}
									className="my-1 bg-light p-2 px-3 rounded text-muted fs-6"
								>
									<Col
										style={{
											textDecorationLine: `${
												isAllinCashout(d.key) ? "line-through" : "none"
											}`,
										}}
									>
										{d.label}
									</Col>
									<Col className="d-flex">
										{/* // ? --------------------------------  Remove Drink Button ---------------------------------*/}
										<Button
											type="link"
											disabled={!isAddedToCashout(d.key)}
											icon={
												<RemoveCircleRounded className="text-danger fs-6" />
											}
											onClick={() => removeFromCashout(d.key)}
										/>
										{/* // ? --------------------------------  Description Drink ---------------------------------*/}
										<div className="mx-2">
											{d.amount} / {drinks[i]?.amount}
										</div>
										{/* // ? --------------------------------  Add Drink Button ---------------------------------*/}
										<Button
											disabled={isAllinCashout(d.key)}
											className="disabled"
											type="link"
											icon={<AddCircleRounded className="text-success fs-6" />}
											onClick={() => addItemToCashout(d.key)}
										/>
									</Col>
								</Row>
							</>
						);
					} else return null;
				})}
				<Divider className="my-2" />
				<Row
					justify={"space-between"}
					className="my-1 fs-6 text-muted px-3 py-2"
				>
					<Col>Ingesamt</Col>
					<Col>
						<strong>{calculateCashOut() + " €"}</strong>
					</Col>
				</Row>
				<div className="bg-success text-dark bg-opacity-10 rounded text-danger">
					{itemsToCashout.map(
						(d) =>
							d.uid === userSelected && (
								<Row
									justify={"space-between"}
									className="my-1 text-muted px-3 py-1"
								>
									<Col>{d.label}</Col>
									<Col>
										<strong>{d.amount} stk</strong>
									</Col>
								</Row>
							)
					)}
				</div>
			</Modal>
		</>
	);
}
// return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
export default Getranke;

//BUGS
//! Remove Old Reservations

{
	/* <Row
	justify={"space-between"}
	align={"middle"}
	className="my-1 bg-light p-2 px-3 rounded text-muted fs-6"
>
	<Col
		style={{
			textDecorationLine: `${
				isAddedToCashout(d.key) ? "line-through" : "none"
			}`,
		}}
	>{`${d.amount} ${d.label}`}</Col>
	<Button
		type="link"
		icon={
			isAddedToCashout(d.key) ? (
				<RemoveCircleRounded className="text-danger fs-6" />
			) : (
				<AddCircleRounded className="text-success fs-6" />
			)
		}
		onClick={() =>
			isAddedToCashout(d.key)
				? removeFromCashout(d.key)
				: setAddToCashout((prevState) => [...prevState, d])
		}
	/>
</Row>; */
}
