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
import {
	UserOutlined,
	PlusOutlined,
	SearchOutlined,
	BarsOutlined,
} from "@ant-design/icons";
import { DRINKS as drinklist } from "../assets/data/drinkList";
import { Container } from "react-bootstrap/";
import DrinkToAdd from "./DrinkToAdd";
import Header from "./Header";
import {
	belongsToUser,
	calculateCashOut,
	computeDrinksTotalToPay,
	findUserName,
	isEverythingSelected,
	selectAllDrinksToBePaid,
	setBackupArrayForTotalCashout,
	totalPerDrink,
	userHasActiveDrinks,
} from "../../utils/drinksHelper";
import { AddCircleRounded, MoneyBillWave, RemoveCircleRounded } from "./Icons";
import { motion } from "framer-motion";
import {
	ADDUSR_ERR_SUBT,
	ADDUSR_ERR_TITL,
	ADDUSR_ERR_TYPE,
	EMPTY_STR_SUBT,
	EMPTY_STR_TITL,
	EMPTY_STR_TYPE,
	NAME_EX_TITL,
	NAME_EX_TYPE,
	NAME_EX__SUBT,
} from "./strings";

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

	//!------------------------------------------------------------------------ MODAL AND DRAWER UTILS -------------------------

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

	//!------------------------------------------------------------------------ USE_EFFECT -------------------------

	useEffect(() => {
		updateDatabaseState();
	}, []);

	useEffect(() => {
		setBackupDrinks(drinks);
	}, [drinks]);

	//!------------------------------------------------------------------------ DB FUNCTIONS -------------------------

	const updateDatabaseState = () => {
		fetchDBDrinksData();
		fetchDBUsersData();
	};
	async function fetchDBDrinksData() {
		try {
			let drinksDB = await db.collection("drinks").get();
			drinksDB && setDrinks(drinksDB);
		} catch (error) {
			console.log("Error: ", error);
		}
	}

	/** Fetch the users from the DB sorted by amount to pay in descending order */
	async function fetchDBUsersData() {
		try {
			let usersDB = await db.collection("users").orderBy("title", "asc").get();
			usersDB && setUsers(usersDB);
		} catch (error) {
			console.log("error: ", error);
		}
	}

	//! --------------------------------------------------------------------------------------------- UTILS -------------------------------------------------------

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
			: "Keine Getränke";
	};

	// * Checks if the item has been added to the Cashout array
	const isAddedToCashout = (drinkID) =>
		itemsToCashout.findIndex(
			(e) => e.key === drinkID && e.uid === userSelected
		) !== -1
			? true
			: false;

	const isAllinCashout = (drinkID) => {
		if (isAddedToCashout(drinkID)) {
			const [drink] = drinks?.filter(
				(d) => d.key === drinkID && d.uid === userSelected
			);
			const [cashoutDrink] = itemsToCashout?.filter(
				(d) => d.key === drinkID && d.uid === userSelected
			);
			return cashoutDrink?.amount === drink.amount ? true : false;
		} else return false;
	};

	//! --------------------------------------------------------------------------------------------- USERS -------------------------------------------------------

	const addUser = () => {
		setIsAddUser(true);
	};

	// ? Checked
	const addUserToDB = async () => {
		if (nameAlreadyExists()) {
			showNotification(NAME_EX_TYPE, NAME_EX_TITL, NAME_EX__SUBT + newUser);
			return;
		}
		if (newUser === "") {
			showNotification(EMPTY_STR_TYPE, EMPTY_STR_TITL, EMPTY_STR_SUBT);
			return;
		}
		//Unique ID
		const uniqueID = Math.floor(Math.random() * Date.now());
		try {
			const response = await db.collection("users").add(
				{
					id: uniqueID,
					title: newUser,
					toPay: 0,
				},
				newUser + "_" + uniqueID //? <-- Key for the user in the DATABASE
			);
			if (response.success) {
				fetchDBUsersData();
				setIsAddUser(false);
				setNewUser("");
				setUserSelected(uniqueID);
				showDrinkModal();
			}
		} catch (err) {
			showNotification(ADDUSR_ERR_TYPE, ADDUSR_ERR_TITL, ADDUSR_ERR_SUBT);
			console.error(err);
		}
	};

	//! --------------------------------------------------------------------------------------------- ADD DRINKS -------------------------------------------------------

	const addDrinkToTemporaryList = (e, drinkID) => {
		e?.preventDefault();
		// * Get the drink description
		const [drink] = drinklist.filter((d) => d.key === drinkID);
		// * Add the standard amount of drinks = 1
		drink.amount = 1;
		// * Add the ID of the selected user
		drink.uid = userSelected;
		// * Add to the list of drinks to add to the current selected User
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
		//? Exit if there is nothing in the array of the drinks to be added */
		if (addToUser.length <= 0) {
			showNotification(
				"error",
				"Fehler",
				"Es gibt keine getränke ausgewählt " + findUserName(userSelected, users)
			);
			return;
		}

		// * Create temp array with drinks from selectedUser
		let userDrinksRecords = drinks.filter(
			(drink) => drink.uid === userSelected
		);

		try {
			addToUser.forEach(async (drinkToAdd) => {
				let [currentDrink] = userDrinksRecords.filter(
					(el) => drinkToAdd.key === el.key
				);
				if (!currentDrink)
					// * Create a new record
					await db.collection("drinks").add(drinkToAdd);
				// * Update the amount
				else {
					currentDrink.amount += drinkToAdd.amount;
					try {
						await db
							.collection("drinks")
							.doc({ uid: userSelected, key: drinkToAdd.key })
							.update({ amount: currentDrink.amount });
					} catch (err) {
						console.log(err);
					}
				}
				//Updates values in APP with DB data
				updateDatabaseState();
				//Set list of drinks to add to []
				setAddToUser([]);
				//Reset userSelected
				resetRowDetails();
			});
		} catch (error) {
			console.log("There was an error, do something else. ", error);
		}

		addAmountToPay(addToUser);

		showNotification(
			"success",
			"Getränke hinzufügen",
			"Getränke sind an der mitglieder " +
				findUserName(userSelected, users) +
				" hinzufügen"
		);
	}

	const addAmountToPay = async (drinks) => {
		try {
			// * Get the record from the selected user
			const userRecord = await db
				.collection("users")
				.doc({ id: userSelected })
				.get();
			let ext_total = userRecord.toPay;

			const total = drinks.reduce(
				(prev, current) => prev + current.price * current.amount,
				ext_total
			);

			// * Update DB data by key
			await db
				.collection("users")
				.doc(`${userRecord.title}_${userRecord.id}`) //? <-- Key on the DB
				.update({
					toPay: total,
				});

			fetchDBUsersData();
		} catch (err) {
			console.log("Error, ", err);
		}
	};

	//! --------------------------------------------------------------------------------------------- CASH OUT -------------------------------------------------------

	const removeCashedOutDrinks = async () => {
		itemsToCashout.forEach(async (d) => {
			if (isAllinCashout(d.key)) {
				try {
					await db
						.collection("drinks")
						.doc({ uid: userSelected, key: d.key })
						.delete();
					setDrinks(drinks.filter((e) => e.key === d.key && e.uid === d.uid));
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
		updateAmountToPay();
		closeUserModal();
		showNotification(
			"success",
			"Drinks removed",
			"Selected drinks have been removed from the list"
		);
	};

	const updateAmountToPay = async () => {
		try {
			const total = drinks
				.filter((d) => d.uid === userSelected)
				.reduce((prev, current) => prev + current.price * current.amount, 0);

			console.log(total);
			// * Update DB data by key
			await db
				.collection("users")
				.doc({ id: userSelected }) //? <-- Key on the DB
				.update({
					toPay: total,
				});

			fetchDBUsersData();
		} catch (err) {
			console.log("Error, ", err);
		}
	};

	// /** //!DOES NOT REMOVE THE USER FROM THE UI */
	// const removeCashedOutDrinks = async () => {
	// 	// * Create temp array with drinks from selectedUser
	// 	let userDrinksRecords = drinks.filter(
	// 		(drink) => drink.uid === userSelected
	// 	);

	// 	const updatedDrinks = [];

	// 	// * Creating a temporary array to reflect changes to apply on DB
	// 	userDrinksRecords.forEach((exDrink) => {
	// 		const [cashDrink] = itemsToCashout.filter((e) => e.key === exDrink.key);
	// 		if (cashDrink && exDrink.key === cashDrink.key) {
	// 			updatedDrinks.push({
	// 				...exDrink,
	// 				amount: exDrink.amount - cashDrink.amount,
	// 			});
	// 		} else updatedDrinks.push(exDrink);
	// 	});

	// 	updateAmountToPay(updatedDrinks, userSelected);

	// 	// * Editing or removing reecords
	// 	updatedDrinks.forEach((drink) => {
	// 		if (drink.amount !== 0) {
	// 			try {
	// 				db.collection("drinks")
	// 					.doc({ uid: userSelected, key: drink.key })
	// 					.set({
	// 						...drink,
	// 					});
	// 				updateDatabaseState();
	// 				console.log("Updated drinks");
	// 			} catch (err) {
	// 				console.log("Error ", err);
	// 			}
	// 		} else {
	// 			try {
	// 				db.collection("drinks")
	// 					.doc({ uid: userSelected, key: drink.key })
	// 					.delete();
	// 				console.log("Deleted record");
	// 				updateDatabaseState();
	// 			} catch (err) {
	// 				console.log("Error ", err);
	// 			}
	// 		}
	// 	});

	// 	closeUserModal();
	// 	showNotification(
	// 		"success",
	// 		"Drinks removed",
	// 		"Selected drinks have been removed from the list"
	// 	);
	// };

	const closeUserTab = async (id) => {
		/** Delete drinks records only if they exists */
		closeUserModal();

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

	const payEverything = () => {
		setItemsToCashout(selectAllDrinksToBePaid(drinks, userSelected));
		setBackupDrinks(setBackupArrayForTotalCashout(drinks, userSelected));
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
												<Tag color="orange" className="mx-2">
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
					<Row justify={"end"}>
						<Button key="1" onClick={closeUserModal}>
							Cancel
						</Button>
						{drinks.findIndex((d) => d.uid === userSelected) === -1 ? (
							<Button key="2" danger onClick={() => closeUserTab(userSelected)}>
								Remove User
							</Button>
						) : (
							<>
								{calculateCashOut(itemsToCashout) > 0 &&
									(isEverythingSelected(userSelected, backupDrinks) ? (
										computeDrinksTotalToPay(drinks, userSelected) > 0 && (
											<Popconfirm
												placement="top"
												title={"Hat die mitglieder alles bezhalt?"}
												onConfirm={() => closeUserTab(userSelected)}
												okText="Ja"
												cancelText="Nein"
											>
												<Button key="3" danger>
													Pay everything (
													{computeDrinksTotalToPay(
														drinks,
														userSelected
													).toFixed(2) + " €"}
													)
												</Button>
											</Popconfirm>
										)
									) : (
										<Popconfirm
											placement="top"
											title={
												"Hat die mitglieder " +
												calculateCashOut(itemsToCashout) +
												" bezhalt?"
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
									))}
							</>
						)}
					</Row>,
				]}
			>
				{/* //? -------------------------------------------------------------------------------- DRINK LIST --------------------------- */}{" "}
				<Row justify={"space-between"} align={"middle"}>
					<div className="my-1 fs-6 px-3 py-2">Getränke Liste</div>
					<Button
						icon={<BarsOutlined />}
						type="link"
						onClick={() => payEverything()}
					>
						Select everything
					</Button>
				</Row>
				{backupDrinks?.map((d, i) => {
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
						<strong className="text-warning">
							{calculateCashOut(itemsToCashout) + " €"}
						</strong>
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
