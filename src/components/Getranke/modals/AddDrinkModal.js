import {
    AutoComplete,
    Button,
    Divider,
    Modal,
    Row,
    Space,
    Tag,
} from "antd";
import React, { useState } from "react";
import DrinkToAdd from "../DrinkToAdd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
    findUserName,
    totalPerDrink,
} from "../../../utils/drinksHelper";
import { showNotification } from "../../../utils/notifications";

/**
 *
 * @param {Array} drinks
 * @returns String - Amount to be paid
 */
const calculateAmountToPay = (drinks) => {
    let amountToPay = 0;
    drinks.map(
        (drink) =>
            (amountToPay += totalPerDrink(drink.amount, drink.price))
    );
    //* Price expressed in 2 decimal points
    return amountToPay.toFixed(2) + " €";
};

export default function AddDrinkModal({
    db,
    userSelected,
    users,
    drinklist,
    setIsAdd,
    setUserSelected,
    hideDrinkModal,
    drinks,
    isDrinkModalOpen,
    updateDatabaseState,
    fetchDBUsersData,
}) {
    const [addToUser, setAddToUser] = useState([]);
    const [autoCompleteSearch, setAutoCompleteSearch] = useState("");

    const options = drinklist.map((d) => ({
        value: d.label,
        id: d.key,
    }));

    const resetRowDetails = () => {
        setIsAdd(false);
        setUserSelected();
        setAddToUser([]);
        hideDrinkModal();
    };

    const addAmountToPay = async (drinks) => {
        try {
            // * Get the record from the selected user
            const userRecord = await db
                .collection("users")
                .doc({ id: userSelected })
                .get();
            let ext_total = userRecord.toPay;

            const total = drinks.reduce(
                (prev, current) =>
                    prev + current.price * current.amount,
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
                  drink.label +
                      " is already present in the list of drinks to add."
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
                "Es gibt keine getränke ausgewählt " +
                    findUserName(userSelected, users)
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
                            .doc({
                                uid: userSelected,
                                key: drinkToAdd.key,
                            })
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
            console.log(
                "There was an error, do something else. ",
                error
            );
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

    return (
        <Modal
            width={"70%"}
            title={`Add drinks to ${findUserName(
                userSelected,
                users
            )}`}
            open={isDrinkModalOpen}
            afterClose={() => setAddToUser([])}
            onOk={addToUser.length > 0 && addDrinksToUser}
            onCancel={hideDrinkModal}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Row justify={"space-between"} align={"middle"}>
                <Space>
                    <SearchOutlined className="text-secondary" />
                    <span className="mx-1 text-secondary fs-6">
                        Getränke Suchen
                    </span>
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
                                    onClick={(e) =>
                                        addDrinkToTemporaryList(
                                            e,
                                            d.key
                                        )
                                    }
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
            <Row
                justify={"space-between"}
                align={"middle"}
                className="my-3"
            >
                <Row justify={"start"} align={"middle"}>
                    {addToUser.length > 0 ? (
                        addToUser.map((e) => (
                            <DrinkToAdd
                                drinkName={e.label}
                                addToUser={addToUser}
                                setAddToUser={setAddToUser}
                                drinkId={e.key}
                                calculateAmountToPay={
                                    calculateAmountToPay
                                }
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
    );
}
