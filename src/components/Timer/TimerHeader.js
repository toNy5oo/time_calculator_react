import React, { useState } from "react";
import { QuestionCircleOutlined, PlusCircleFilled } from "@ant-design/icons";
import {
	Row,
	Dropdown,
	Menu,
	Space,
	Button,
	Popconfirm,
	Avatar,
	Col,
	Badge,
	Input,
} from "antd";

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

	const onSelectedItems = ({ key }) => {
		openTable(key);
	};

	//SingleItem for menu
	const singleItem = (num) => {
		return (
			<Space align="center">
				Tisch
				<Avatar
					src={require(`../assets/img/${num}ball.png`)}
					size="small"
					style={{ margin: "2px" }}
				/>
			</Space>
		);
	};

	//Menu
	const menu = (
		<Menu
			items={tables.map(
				(t, i) =>
					t.isActive === false && {
						key: t.tableNumber,
						label: singleItem(t.tableNumber),
					}
			)}
			onClick={onSelectedItems}
		/>
	);

	return (
		<>
			<Container>
				<Row justify="space-between" className="bg-light rounded my-3">
					<Col className="m-4">
						<Space>
							<span className="fs-6 text-muted mx-2">Besetzte Tische:</span>
							<strong>{activeTables}</strong>
							<Input
								className="invisible"
								allowClear={true}
								placeholder="Mitglieder suchen"
							></Input>
						</Space>
					</Col>
					<Col className="m-4">
						<Space>
							<Dropdown overlay={menu}>
								<a href="#" onClick={(e) => e.preventDefault()}>
									<Button
										type="primary"
										icon={<PlusCircleFilled />}
										placement="bottom"
									>
										Tisch hinzufügen
									</Button>
								</a>
							</Dropdown>
							<Popconfirm
								title="Bist du sicher, dass du alle Tische zurücksetzen möchtest?"
								icon={<QuestionCircleOutlined style={{ color: "red" }} />}
								placement="bottom"
								okText="Ja"
								cancelText="Nein"
								onConfirm={() => resetAllTables()}
							>
								<Button danger>Tische zurücksetzen</Button>
							</Popconfirm>
							{holdTables.length > 0 && (
								<Badge count={holdTables.length}>
									<Button onClick={showDrawer} className="btn-orange">
										Offene Rechnungen
									</Button>
								</Badge>
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
