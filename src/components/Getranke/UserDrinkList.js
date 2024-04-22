import React from "react";
import { AddCircleRounded, RemoveCircleRounded } from "./Icons";
import { Button, Col, Row } from "antd";

export default function UserDrinkList({
    drinks,
    backupDrinks,
    userSelected,
    isAllinCashout,
    isAddedToCashout,
    removeFromCashout,
    addItemToCashout,
}) {
    return (
        <div>
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
                                            isAllinCashout(d.key)
                                                ? "line-through"
                                                : "none"
                                        }`,
                                    }}
                                >
                                    {d.label}
                                </Col>
                                <Col className="d-flex">
                                    {/* // ? --------------------------------  Remove Drink Button ---------------------------------*/}
                                    <Button
                                        type="link"
                                        disabled={
                                            !isAddedToCashout(d.key)
                                        }
                                        icon={
                                            <RemoveCircleRounded className="text-danger fs-6" />
                                        }
                                        onClick={() =>
                                            removeFromCashout(d.key)
                                        }
                                    />
                                    {/* // ? --------------------------------  Description Drink ---------------------------------*/}
                                    <div className="mx-2">
                                        {d.amount} /{" "}
                                        {drinks[i]?.amount}
                                    </div>
                                    {/* // ? --------------------------------  Add Drink Button ---------------------------------*/}
                                    <Button
                                        disabled={isAllinCashout(
                                            d.key
                                        )}
                                        className="disabled"
                                        type="link"
                                        icon={
                                            <AddCircleRounded className="text-success fs-6" />
                                        }
                                        onClick={() =>
                                            addItemToCashout(d.key)
                                        }
                                    />
                                </Col>
                            </Row>
                        </>
                    );
                } else return null;
            })}
        </div>
    );
}
