import {
	faHourglass,
	faPercent,
	faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Space } from "antd";
import React from "react";

const TableOnHold = ({ table }) => {
	return (
		<>
			<div className="mx-3 d-flex justify-content-start align-items-center fw-semibold">
				Tisch {table.tableNumber}
				<Divider type="vertical">€</Divider>
				<div className="text-primary fw-bold">€ {table.toPay}</div>
			</div>
			<Space className="my-2 d-flex justify-content-start align-items-center">
				<div>
					<FontAwesomeIcon
						icon={faHourglass}
						style={{
							fontSize: "14px",
							color: "darkorange",
						}}
						className="mx-2"
					/>
					{table.start} : {table.end}
				</div>
				<div>
					<FontAwesomeIcon
						icon={faStopwatch}
						style={{
							color: "purple",
							fontSize: "16px",
						}}
						className="mx-2"
					/>
					{table.played}
				</div>
				<div>
					<FontAwesomeIcon
						icon={faPercent}
						style={{
							color: "green",
							fontSize: "16px",
						}}
						className="mx-2"
					/>
					{table.discount ? "Ja" : "Nein"}
				</div>
			</Space>
		</>
	);
};

export default TableOnHold;
