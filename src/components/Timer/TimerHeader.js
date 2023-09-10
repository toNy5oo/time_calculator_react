import React, { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Row, Space, Button, Popconfirm, Avatar, Col, Badge, Divider } from "antd";

import Container from "react-bootstrap/Container";
import DrawerTablesOnHold from "./DrawerTablesOnHold";

function TimerHeader({
	tables,
	openTable,
	resetAllTables,
	activeTables,
	holdTables,
	closeHoldTable,
}) {
	const [holdTableClicked, setHoldTableClicked] = useState(0);
	const [sharedBill, setSharedBill] = useState("2");
	const [open, setOpen] = useState(false);
	const [showSharedBill, setShowSharedBill] = useState(false);

	//Drawer visibility methods
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
		setHoldTableClicked(0);
	};

	function handleChangeInput(val) {
		setSharedBill(val);
	}

	const onSelectedItems = (key) => {
		openTable(key);
	};

	//SingleItem for menu
	const singleItem = (num) => {
		return (
			<Space align="center">
				{/* <div className="text-xs">Tisch</div> */}
				<Avatar
					src={`/img/${num}ball.png`}
					size="small"
					style={{ margin: "2px" }}
				/>
			</Space>
		);
	};

	return (
		<>
			<Container className="fade-in">
				<Row justify="space-between" className="bg-light rounded my-3">
					<Col className="m-4">
						<Space>
							<span className="fs-6 text-muted mx-2">Besetzte Tische:</span>
							<strong className="fs-5">{activeTables}</strong>
							<Divider type="vertical fs-6"/>
							<span className="fs-6 text-muted mx-2">Offene Rechnungen:</span>
							<strong className="fs-5">{holdTables.length}</strong>
						</Space>
					</Col>
					
					<Col className="center p-4 d-flex">
						<Popconfirm
							title="Bist du sicher, dass du alle Tische zurücksetzen möchtest?"
							icon={<QuestionCircleOutlined style={{ color: "red" }} />}
							placement="bottom"
							okText="Ja"
							cancelText="Nein"
							onConfirm={() => resetAllTables()}
						>
							{tables.some((table) => (table.isActive)) && <Button danger className="mx-2">
								Tische zurücksetzen
							</Button>}
						</Popconfirm>
						{holdTables.length > 0 && (
							<Badge count={holdTables.length}>
								<Button
									onClick={showDrawer}
									className="bg-secondary text-white"
								>
									Offene Rechnungen
								</Button>
							</Badge>
						)}
					</Col>
				</Row>
				<Row wrap>
					<Col className="mx-4">
						<Space size={"small"} wrap>
							<div className="fs-6 text-muted mx-2">Freie Tische:</div> 
							{tables.map(
								(table) =>
									!table.isActive && (
										<Button
											className="rounded p-3 align-middle center"
											key={table.tableNumber}
											onClick={() => onSelectedItems(table.tableNumber)}
										>
											{singleItem(table.tableNumber)}
										</Button>
									)
							)}
						</Space>
					</Col>
				</Row>
			</Container>

			<DrawerTablesOnHold
				onClose={onClose}
				open={open}
				holdTables={holdTables}
				showSharedBill={showSharedBill}
				setHoldTableClicked={setHoldTableClicked}
				holdTableClicked={holdTableClicked}
				handleChangeInput={handleChangeInput}
				sharedBill={sharedBill}
				setShowSharedBill={setShowSharedBill}
				closeHoldTable={closeHoldTable}
			/>
		</>
	);
}

export default TimerHeader;
