import { Col, Row } from "antd";
import TimerHeader from "./TimerHeader";
import Table from "./Table";
import React, { useState, useEffect, useRef } from "react";
import { notification } from "antd";
import { DEFAULT_TEMPLATE } from "../../components/assets/data/tablesArray";
import * as price from "../assets/const/const";
import dayjs from "dayjs";
import {
	calculateInitalTime,
	isNotZero,
	timePlayed,
} from "../../utils/timeHelper";
import autoAnimate from "@formkit/auto-animate";

const closeTableNotification = (num) => {
	notification.success({
		type: "success",
		message: `Tisch ${num} ist jetzt nochmal frei`,
		description:
			"The table has been closed and now is available again to be rented.",
	});
};

const holdTableNotification = (num, message, desc) => {
	notification.success({
		message: `${message}`,
		description: `${desc}`,
	});
};

function Timer() {
	const parent = useRef(null);

	const [tables, setTables] = React.useState(
		localStorage.getItem("tables")
			? JSON.parse(localStorage.getItem("tables"))
			: DEFAULT_TEMPLATE
	);
	const [holdTables, setHoldTables] = React.useState(
		localStorage.getItem("holdtables")
			? JSON.parse(localStorage.getItem("holdtables"))
			: []
	);
	const [activeTables, setActiveTables] = useState(0);
	const [isEmpty, setIsEmpty] = useState(true);

	const countActiveTables = () => tables.filter((obj) => obj.isActive);

	useEffect(() => {
		tables.map((table) => table.isActive && setIsEmpty(false));
		setActiveTables(countActiveTables().length);
	}, [tables, holdTables]);

	useEffect(() => {
		localStorage.setItem("tables", JSON.stringify(tables));
		localStorage.setItem("holdtables", JSON.stringify(holdTables));
	}, [tables, holdTables]);

	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	/**
	 * Retrieving JSON string from localStorage to restore the state
	 */
	const closeHoldTable = (num) => {
		holdTableNotification(
			num,
			"Tisch " + num,
			"Tisch wurde abgerechnet und zurückgesetzt."
		);
		setHoldTables((state) =>
			state.filter((e) => e.tableNumber !== parseInt(num))
		);
	};

	//Deactivate the table but keeps the info
	const addHoldTable = (tableNumber) => {
		if (holdTables.filter((t) => t.tableNumber === tableNumber).length === 0) {
			const [obj] = tables.filter((t) => t.tableNumber === tableNumber);
			if (obj.start !== 0 && obj.end !== 0) {
				obj.start = dayjs(obj.start).format("HH:mm");
				obj.end = dayjs(obj.end).format("HH:mm");
				setHoldTables((state) => [...state, obj]);
				closeTable(tableNumber);
			} else {
				holdTableNotification(
					tableNumber,
					"Tisch " + tableNumber + " kann nicht verschoben werden.",
					"Es fehlen entweder Start- oder Endzeit."
				);
			}
		} else
			holdTableNotification(
				tableNumber,
				"Tisch " + tableNumber + " kann nicht verschoben werden.",
				"Es befindet sich bereits ein Tisch " +
					tableNumber +
					" in offene Rechnungen. Dieser Tisch muss zuerst abgerechnet werden."
			);
	};

	// ! -------------------------------------- OPEN TABLE

	//Add table from view
	const openTable = (tableNumber) => {
		setTables((state) => {
			const list = state.map((item) => {
				// 👇️ Get the right table obj
				if (item.tableNumber === parseInt(tableNumber)) {
					return {
						...item,
						isActive: true,
						start: calculateInitalTime(),
					};
				}
				return item;
			});
			return list;
		});
	};

	// ! -------------------------------------- CLOSE TABLE

	//Remove table from view
	const closeTable = (tableNumber, showMessage) => {
		// 👇️ Get the right table obj
		setTables((state) => {
			const list = state.map((item) => {
				if (item.tableNumber === parseInt(tableNumber)) {
					return {
						...item,
						isActive: false,
						start: 0,
						end: 0,
						played: 0,
						discount: false,
						toPay: 0,
					};
				}
				return item;
			});
			showMessage && closeTableNotification(tableNumber);
			return list;
		});
	};

	// ! -------------------------------------- START TIME

	//Update table on start time and minPlayed
	const startTime = (time, tableSelected) => {
		setTables((prevState) => {
			const newState = prevState.map((obj) => {
				let pay = 0;
				let played = 0;
				if (obj.tableNumber === tableSelected) {
					if (isNotZero(time) && isNotZero(obj.end)) {
						played = timePlayed(time, obj.end);
						pay = toPay(played, obj.discount);
					}
					return {
						...obj,
						start: time,
						played: played,
						toPay: pay,
					};
				}
				return obj;
			});
			return newState;
		});
	};

	// ! -------------------------------------- END TIME

	const setEndTime = (tableNumber) => {
		const lastTimeSlot = dayjs().hour(23).minute(59);
		endTime(lastTimeSlot, tableNumber);
	};

	//Update table on end time and minPlayed
	const endTime = (time, tableSelected) => {
		setTables((prevState) => {
			const newState = prevState.map((obj) => {
				let pay = 0;
				let played = 0;
				if (obj.tableNumber === tableSelected) {
					if (isNotZero(time) && isNotZero(obj.start)) {
						played = timePlayed(obj.start, time);
						pay = toPay(played, obj.discount);
					}
					return { ...obj, end: time, played: played, toPay: pay };
				}
				return obj;
			});
			return newState;
		});
	};

	// ! -------------------------------------- AMOUNT TO PAY

	/**
	 * Calculate how much is to pay considered the time and if discount applies
	 * @param {number} timePlayed
	 * @param {boolean} discount
	 * @returns
	 */
	const toPay = (timePlayed, discount) => {
		return parseFloat(
			discount
				? parseInt(timePlayed) * price.HALF_PRICE_MIN
				: parseInt(timePlayed) * price.FULL_PRICE_MIN
		).toFixed(2);
	};

	// ! -------------------------------------- TOGGLE DISCOUNT

	//Toggle discounts and recalculate amount to pay
	const toggleDiscount = (index) => {
		setTables((prevState) => {
			const newState = prevState.map((obj) => {
				let pay = 0;
				if (obj.tableNumber === index) {
					if (obj.toPay !== 0) {
						if (!obj.discount) pay = (parseFloat(obj.toPay) / 2).toFixed(2);
						else pay = (parseFloat(obj.toPay) * 2).toFixed(2);
					}
					return { ...obj, discount: !obj.discount, toPay: pay };
				}
				return obj;
			});
			return newState;
		});
	};

	// ! -------------------------------------- RESET ALL TABLES

	//Gets every table and closes it
	const resetAllTables = () => {
		tables.forEach((t, i) => {
			//If snooker table (has different table number)
			i !== 10 ? closeTable(i + 1, false) : closeTable(147, false);
		});
		//Remove tables in hold
		setHoldTables([]);

		setIsEmpty(true);
		//Count active tables
		setActiveTables(countActiveTables().length);
	};

	return (
		<main>
			<TimerHeader
				tables={tables}
				openTable={openTable}
				resetAllTables={resetAllTables}
				activeTables={activeTables}
				holdTables={holdTables}
				closeHoldTable={closeHoldTable}
			/>
			{isEmpty ? (
				<Row justify="center" align="middle">
					<Col className="p-5 text-center fs-5"> No active tables </Col>{" "}
				</Row>
			) : (
				<Row
					justify="space-around"
					align="center"
					className="mx-5 mt-3"
					ref={parent}
					gutter={16}
				>
					{tables.map(
						(table, index) =>
							table.isActive && (
								<Col
									key={`key${table.tableNumber}`}
									xs={24}
									sm={16}
									md={12}
									lg={6}
									xxl={4}
									className="my-2 d-flex justify-content-around"
								>
									<Table
										table={table}
										key={`${index}-${table.tableNumber}`}
										closeTable={closeTable}
										startTime={startTime}
										endTime={endTime}
										toggleDiscount={toggleDiscount}
										addHoldTable={addHoldTable}
										setEndTime={setEndTime}
									/>
								</Col>
							)
					)}{" "}
				</Row>
			)}
		</main>
	);
}

export default Timer;
