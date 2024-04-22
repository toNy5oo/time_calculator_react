import { Button, Col, Divider, Modal, Popconfirm, Row } from "antd";
import { BarsOutlined } from "@ant-design/icons";
import React from "react";
import {
    calculateCashOut,
    computeDrinksTotalToPay,
    findUserName,
    isEverythingSelected,
    selectAllDrinksToBePaid,
    setBackupArrayForTotalCashout,
    userHasActiveDrinks,
} from "../../../utils/drinksHelper";
import UserDrinkList from "../UserDrinkList";
import { showNotification } from "../../../utils/notifications";

export default function PayModal({
    itemsToCashout,
    db,
    drinks,
    userSelected,
    setIsUserModalOpen,
    setItemsToCashout,
    setBackupDrinks,
    backupDrinks,
    updateDatabaseState,
    isAddedToCashout,
    setUsers,
    setDrinks,
    isAllinCashout,
    users,
    isUserModalOpen,
    fetchDBUsersData,
}) {
    const closeUserModal = () => {
        setBackupDrinks(drinks);
        setItemsToCashout([]);
        setIsUserModalOpen(false);
    };

    const closeUserTab = async (id) => {
        /** Delete drinks records only if they exists */
        closeUserModal();

        if (userHasActiveDrinks(id, drinks)) {
            //Remove user record
            try {
                await db
                    .collection("drinks")
                    .doc({ uid: id })
                    .delete();
                //If the response is successful then remove the drinks from this user from the list
                updateDatabaseState();
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        /** Delete user after removing all his drinks */
        try {
            const response = await db
                .collection("users")
                .doc({ id: id })
                .delete();
            response.success &&
                setUsers(users.filter((d) => d.uid !== id));
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
            setItemsToCashout(
                itemsToCashout.filter((e) => e !== drink)
            );
        } else {
            setItemsToCashout(
                itemsToCashout.map((d) =>
                    d.key === drinkID
                        ? { ...d, amount: d.amount - 1 }
                        : d
                )
            );
        }
        setBackupDrinks(
            backupDrinks.map((d) =>
                d.key === drinkID ? { ...d, amount: d.amount + 1 } : d
            )
        );
    };

    const removeCashedOutDrinks = async () => {
        itemsToCashout.forEach(async (d) => {
            if (isAllinCashout(d.key)) {
                try {
                    await db
                        .collection("drinks")
                        .doc({ uid: userSelected, key: d.key })
                        .delete();
                    setDrinks(
                        drinks.filter(
                            (e) => e.key === d.key && e.uid === d.uid
                        )
                    );
                    updateDatabaseState();
                } catch (err) {
                    console.error(err);
                }
            } else {
                const [exDrinkRecord] = drinks.filter(
                    (exDrink) =>
                        exDrink.key === d.key &&
                        exDrink.uid === userSelected
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
                .reduce(
                    (prev, current) =>
                        prev + current.price * current.amount,
                    0
                );

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

    const payEverything = () => {
        setItemsToCashout(
            selectAllDrinksToBePaid(drinks, userSelected)
        );
        setBackupDrinks(
            setBackupArrayForTotalCashout(drinks, userSelected)
        );
    };

    return (
        <Modal
            width={"50%"}
            style={{ minWidth: "300px" }}
            title={`Drinklist von  ${findUserName(
                userSelected,
                users
            )}`}
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
                    {drinks.findIndex(
                        (d) => d.uid === userSelected
                    ) === -1 ? (
                        <Button
                            key="2"
                            danger
                            onClick={() => closeUserTab(userSelected)}
                        >
                            Remove User
                        </Button>
                    ) : (
                        <>
                            {calculateCashOut(itemsToCashout) > 0 &&
                                (isEverythingSelected(
                                    userSelected,
                                    backupDrinks
                                ) ? (
                                    computeDrinksTotalToPay(
                                        drinks,
                                        userSelected
                                    ) > 0 && (
                                        <Popconfirm
                                            placement="top"
                                            title={
                                                "Hat die mitglieder alles bezhalt?"
                                            }
                                            onConfirm={() =>
                                                closeUserTab(
                                                    userSelected
                                                )
                                            }
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
                                            calculateCashOut(
                                                itemsToCashout
                                            ) +
                                            " bezhalt?"
                                        }
                                        onConfirm={
                                            itemsToCashout.length >
                                                0 &&
                                            removeCashedOutDrinks
                                        }
                                        okText="Ja"
                                        cancelText="Nein"
                                    >
                                        <Button
                                            key="4"
                                            type="primary"
                                            className="mx-1"
                                        >
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
                <div className="my-1 fs-6 px-3 py-2">
                    Getränke Liste
                </div>
                <Button
                    icon={<BarsOutlined />}
                    type="link"
                    onClick={() => payEverything()}
                >
                    Select everything
                </Button>
            </Row>
            <UserDrinkList
                drinks={drinks}
                backupDrinks={backupDrinks}
                userSelected={userSelected}
                isAllinCashout={isAddedToCashout}
                isAddedToCashout={isAddedToCashout}
                removeFromCashout={removeFromCashout}
                addItemToCashout={addItemToCashout}
            />
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
    );
}
