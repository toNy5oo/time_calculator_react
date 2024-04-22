import React, { useEffect, useRef, useState } from "react";
import Localbase from "localbase";
import "../assets/css/buttons.css";
import { DRINKS as drinklist } from "../assets/data/drinkList";
import Header from "./Header";
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
import AddDrinkModal from "./modals/AddDrinkModal";
import { showNotification } from "../../utils/notifications";
import PayModal from "./modals/PayModal";
import UserList from "./UsersList";

function Getranke() {
    let db = new Localbase("pooltime_DRINKS");
    //Comment to remove logger
    db.config.debug = false;
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [userSelected, setUserSelected] = useState(0);

    const [itemsToCashout, setItemsToCashout] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [backupDrinks, setBackupDrinks] = useState([]);
    const [isAddUser, setIsAddUser] = useState(false);
    const [newUser, setNewUser] = useState("");

    const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    let inputElement = useRef(null);
    let inputRef = useRef(null);

    //!------------------------------------------------------------------------ MODAL AND DRAWER UTILS -------------------------
    const hideDrinkModal = () => {
        setIsDrinkModalOpen(false);
    };

    const showDrinkModal = () => {
        setIsDrinkModalOpen(true);
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
            let usersDB = await db
                .collection("users")
                .orderBy("title", "asc")
                .get();
            usersDB && setUsers(usersDB);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    function nameAlreadyExists() {
        return users.some(
            (e) => e.title.toUpperCase() === newUser.toUpperCase()
        );
    }

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
            return cashoutDrink?.amount === drink.amount
                ? true
                : false;
        } else return false;
    };

    //! --------------------------------------------------------------------------------------------- USERS -------------------------------------------------------

    const addUser = () => {
        setIsAddUser(true);
    };

    // ? Checked
    const addUserToDB = async () => {
        if (nameAlreadyExists()) {
            showNotification(
                NAME_EX_TYPE,
                NAME_EX_TITL,
                NAME_EX__SUBT + newUser
            );
            return;
        }
        if (newUser === "") {
            showNotification(
                EMPTY_STR_TYPE,
                EMPTY_STR_TITL,
                EMPTY_STR_SUBT
            );
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
            showNotification(
                ADDUSR_ERR_TYPE,
                ADDUSR_ERR_TITL,
                ADDUSR_ERR_SUBT
            );
            console.error(err);
        }
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

            <UserList
                filteredUsers={filteredUsers}
                users={users}
                drinks={drinks}
                setUserSelected={setUserSelected}
                setIsAdd={setIsAdd}
                showDrinkModal={showDrinkModal}
                setIsUserModalOpen={setIsUserModalOpen}
            />

            {/* //! ----------------------------------------------------------------------- ADD DRINK MODAL --------------------------------- */}

            <AddDrinkModal
                db={db}
                userSelected={userSelected}
                users={users}
                drinklist={drinklist}
                setIsAdd={setIsAdd}
                setUserSelected={setUserSelected}
                hideDrinkModal={hideDrinkModal}
                drinks={drinks}
                isDrinkModalOpen={isDrinkModalOpen}
                updateDatabaseState={updateDatabaseState}
                fetchDBUsersData={fetchDBUsersData}
            />

            <PayModal
                itemsToCashout={itemsToCashout}
                db={db}
                drinks={drinks}
                userSelected={userSelected}
                setIsUserModalOpen={setIsUserModalOpen}
                setItemsToCashout={setItemsToCashout}
                setBackupDrinks={setBackupDrinks}
                backupDrinks={backupDrinks}
                fetchDBUsersData={fetchDBUsersData}
                updateDatabaseState={updateDatabaseState}
                setUsers={setUsers}
                isAddedToCashout={isAddedToCashout}
                isAllinCashout={isAllinCashout}
                setDrinks={setDrinks}
                users={users}
                isUserModalOpen={isUserModalOpen}
            />
        </>
    );
}
// return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
export default Getranke;
