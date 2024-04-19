import { Button, List, Row, Tag, Tooltip } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { AddCircleRounded, MoneyBillWave } from "./Icons";
import {
    belongsToUser,
    totalPerDrink,
} from "../../utils/drinksHelper";

function User({
    userRecord,
    setUserSelected,
    setIsAdd,
    setIsUserModalOpen,
    showDrinkModal,
    drinks,
}) {
    const setRowDetails = (userId) => {
        setUserSelected(userId);
        setIsAdd(true);
        showDrinkModal();
    };

    const openUserModal = (id) => {
        setUserSelected(id);
        setIsUserModalOpen(true);
    };

    const calculatUserAmount = (userID) => {
        // get document by key
        let totalAmount = 0;
        drinks.forEach((drink) => {
            if (belongsToUser(drink.uid, userID))
                totalAmount += totalPerDrink(
                    drink.price,
                    drink.amount
                );
        });
        //* Price expressed in 2 decimal points
        return totalAmount.toFixed(2);
    };

    /**
     * Returns each single drink record as Tag
     */
    const drinksDescriptions = (id) => {
        return drinks.filter((d) => d.uid === id).length !== 0
            ? drinks.map(
                  (d) =>
                      d.uid === id && (
                          <Tag color="blue">
                              {d.amount + " " + d.label}
                          </Tag>
                      )
              )
            : "Keine Getränke";
    };

    return (
        <List.Item
            key={userRecord.id}
            className="bg-light px-4 rounded mt-1"
            actions={[
                <>
                    <div>
                        <Button
                            type="link"
                            className="fs-4"
                            onClick={() =>
                                setRowDetails(userRecord.id)
                            }
                        >
                            <AddCircleRounded />
                        </Button>
                        <Tooltip
                            title={`Cash Out ${userRecord.title}`}
                        >
                            <Button
                                type="link"
                                className="text-success fs-5"
                                onClick={() =>
                                    openUserModal(userRecord.id)
                                }
                            >
                                <MoneyBillWave />
                            </Button>
                        </Tooltip>
                    </div>

                    <div className="my-2 text-xl">
                        {
                            <Tag color="orange" className="px-4 py-1">
                                {calculatUserAmount(userRecord.id)} €
                            </Tag>
                        }
                    </div>
                </>,
            ]}
        >
            <List.Item.Meta
                key={userRecord.id + userRecord.title}
                // avatar={
                //     <UserOutlined
                //         style={{
                //             fontSize: "25px",
                //             marginTop: "10px",
                //             padding: "5px",
                //         }}
                //     />
                // }
                title={
                    <Row align={"middle"}>
                        <Button
                            type="link"
                            onClick={() =>
                                openUserModal(userRecord.id)
                            }
                        >
                            <div className="fs-6">
                                {userRecord.title}
                            </div>
                        </Button>
                    </Row>
                }
                description={drinksDescriptions(userRecord.id)}
            />
        </List.Item>
    );
}

export default User;
