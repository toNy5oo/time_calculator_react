import React, { useEffect, useRef, useState } from "react";
import Localbase from "localbase";
import "../assets/css/buttons.css";
import autoAnimate from "@formkit/auto-animate";
import {
	Alert,
	Button,
	Col,
	List,
	Popconfirm,
	Row,
	Skeleton,
	Space,
	Tag,
	notification,
	Tooltip,
	Modal,
	AutoComplete,
	Divider,
} from "antd";
import { faPlus, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { UserOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DRINKS as drinklist } from "../assets/data/drinkList";
import { Container } from "react-bootstrap/";
import DrinkToAdd from "./DrinkToAdd";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	belongsToUser,
	findUserName,
	totalPerDrink,
	userHasActiveDrinks,
} from "../../utils/drinksHelper";

const options = drinklist.map((d) => ({ value: d.label, id: d.key }));

function Getranke() {
	//Notification
	const showNotification = (title, msg) => {
		notification.open({
			message: title,
			description: msg,
		});
	};

	let db = new Localbase("db");
	//Comment to remove logger
	db.config.debug = false;
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [isAdd, setIsAdd] = useState(false);
	const [userSelected, setUserSelected] = useState(0);
	const [addToUser, setAddToUser] = useState([]);
	const [drinks, setDrinks] = useState([]);
	const [isAddUser, setIsAddUser] = useState(false);
	const parent = useRef(null);
	const [newUser, setNewUser] = useState("");
	const [autoCompleteSearch, setAutoCompleteSearch] = useState("");
	let inputElement = useRef(null);
	let inputRef = useRef(null);
	const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);

	const hideDrinkModal = () => {
		setIsDrinkModalOpen(false);
	};

	const openUserModal = (id) => {
		setUserSelected(id);
		setIsUserModalOpen(true);
	};
	const handleOk = () => {
		setIsUserModalOpen(false);
	};
	const closeUserModal = () => {
		setIsUserModalOpen(false);
	};

	useEffect(() => {
		fetchDBDrinksData();
		fetchDBUsersData();
	}, []);

	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

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

	const cashOutUser = async (id) => {
		/** Delete drinks records only if they exists */
		if (userHasActiveDrinks(id, drinks)) {
			//Remove user record
			try {
				const response = await db
					.collection("drinks")
					.doc({ uid: id })
					.delete();
				//If the response is successful then remove the drinks from this user from the list
				response.success && setDrinks(drinks.filter((d) => d.uid !== id));
			} catch (error) {
				console.log("Error: ", error);
			}
		}

		/** Delete user after removing all his drinks */
		try {
			const response = await db.collection("users").doc({ id: id }).delete();
			response && setUsers(users.filter((d) => d.id !== id));
		} catch (error) {
			console.log("Error: ", error);
		}

		/** Notify that the user has been removed from the list */
		showNotification(
			"User removed",
			"User has been removed from the active list"
		);
	};

	/** Get the id of the user and set it as selected user */
	const setRowDetails = (userId) => {
		setUserSelected(userId);
		setIsAdd(true);
		setIsDrinkModalOpen(true);
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
				fetchDBDrinksData();
				//Set list of drinks to add to []
				setAddToUser([]);
				//Reset userSelected
				resetRowDetails();
			});
			showNotification(
				"Getränke hinzufügen",
				"Getränke sind an der mitglieder " +
					findUserName(userSelected, users) + " hinzufügen"
			);
		} else {
			showNotification(
				"Fehler",
				"Es gibt keine getränke ausgewählt " +
					findUserName(userSelected, users)
			);
		}
	}

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

	const addUser = () => {
		setIsAddUser(true);
	};

	const addUserToDB = async () => {
		if (!nameAlreadyExists()) {
			if (newUser !== "") {
				//Unique ID
				const uniqueID = Math.floor(Math.random() * Date.now());
				try {
					const response = await db.collection("users").add({
						id: uniqueID,
						title: newUser,
						toPay: 0,
					});

					if (response.success) {
						setTimeout(() => {
							fetchDBUsersData();
							setIsAddUser(false);
							setNewUser("");
						}, 250);
					}
				} catch (err) {
					console.error(err);
				}
			} else
				showNotification(
					"No name entered",
					"Please provide a name for the new mitglieder"
				);
		} else
			showNotification(
				"User already present",
				"There is already a user with the name " + newUser
			);
	};

	function nameAlreadyExists() {
		return users.some((e) => e.title.toUpperCase() === newUser.toUpperCase());
	}

	// //View for the alert
	// const alertMessage = () => {
	// 	return (
	// 		<>
	// 			<Col>
	// 				Adding to {<strong>{findUserName(userSelected, users)}</strong>}
	// 			</Col>
	// 		</>
	// 	);
	// };

	//View for the alert
	const alertDescription = () => {
		return (
			<>
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
					<div className="text-muted text-sm">
						Suche eine getränke in der suchbox
					</div>
				)}
			</>
		);
	};

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
			<Container ref={parent}>
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
									className="addBtn mx-1"
									onClick={() => setRowDetails(userRecord.id)}
								>
									<FontAwesomeIcon icon={faPlus} />
								</Button>,
								<Popconfirm
									placement="left"
									title={"Hat die mitglieder alles bezhalt?"}
									onConfirm={() => cashOutUser(userRecord.id)}
									okText="Ja"
									cancelText="Nein"
								>
									<Tooltip title={`Cash Out ${userRecord.title}`}>
										<Button className="cashOutBtn">
											<FontAwesomeIcon icon={faEuroSign} />
										</Button>
									</Tooltip>
								</Popconfirm>,
							]}
						>
							<Skeleton
								avatar
								title={false}
								loading={userRecord.loading}
								active
							>
								<List.Item.Meta
									key={userRecord.id}
									ref={parent}
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
							</Skeleton>
						</List.Item>
					)}
				/>
			</Container>
			{/* Drink Add Modal */}
			<Modal
				width={"70%"}
				title={`Add drinks to ${findUserName(userSelected, users)}`}
				open={isDrinkModalOpen}
				onOk={addDrinksToUser}
				onCancel={hideDrinkModal}
				destroyOnClose={true}
			>
				<Alert
					// message={alertMessage()}
					description={alertDescription()}
					type={"info"}
					showIcon
					action={
						<>
							{" "}
							<Space>
								{
									<div className="fs-6 fw-bold">
										{calculateAmountToPay(addToUser)}
									</div>
								}{" "}
								{/* {calculateAmountToPay(addToUser) !== 0 && (
									<Button onClick={addDrinksToUser} type="primary">
										<CheckOutlined />
									</Button>
								)} */}
							</Space>
						</>
					}
				></Alert>
				<Row justify={"space-between"} align={"middle"} className="my-3">
					<Space>
						<SearchOutlined className="mx-1 text-secondary" />
						<AutoComplete
							allowClear
							autoFocus
							style={{
								width: "80%",
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
					</Space>
					{/* <Input placeholder="Search drinks" className="my-3" /> */}
					<div style={{ textAlign: "right" }}>
						{drinks.map((d) => {
							if (d.uid === userSelected) {
								return (
									<Tag
										closable
										closeIcon={<PlusOutlined />}
										onClose={(e) => addDrinkToTemporaryList(e, d.key)}
										color="blue"
									>
										{d.label}
									</Tag>
								);
							}
						})}
					</div>
				</Row>
			</Modal>
			{/* User Selected Modal */}
			<Modal
				width={"20%"}
				style={{ minWidth: "300px" }}
				title={`Drinklist von  ${findUserName(userSelected, users)}`}
				open={isUserModalOpen}
				onOk={handleOk}
				onCancel={closeUserModal}
				destroyOnClose={true}
			>
				{" "}
				<div className="text-muted">Getränke: </div>
				<Divider />
				<div>
					{drinks.map((d) => {
						if (d.uid === userSelected) {
							return <div>{`${d.amount} ${d.label}`}</div>;
						}
					})}
				</div>
			</Modal>
		</>
	);
}
// return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
export default Getranke;

//BUGS
//! Clicking ok on the drink modal shows notifications even when drinks list is empty
//! Clicking on User to open modal makes the total disappear
