import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Avatar,
	Button,
	Drawer,
	InputNumber,
	List,
	Popconfirm,
	Tag,
} from "antd";
import React from "react";
import SharedBillButton from "./SharedBillButton";
import TableOnHold from "./TableOnHold";
import { CheckOutlined } from "@ant-design/icons";

const DrawerTablesOnHold = ({
	onClose,
	open,
	holdTables,
	showSharedBill,
	setHoldTableClicked,
	holdTableClicked,
	handleChangeInput,
	sharedBill,
	setShowSharedBill,
	closeHoldTable,
}) => {
	const closeAndNotify = (val) => {
		onClose();
		closeHoldTable(val);
	};

	return (
		<Drawer
			title="Offene Rechnungen"
			placement={"top"}
			closable={false}
			onClose={onClose}
			open={open}
			key={"right"}
			height={"46%"}
		>
			<List
				itemLayout="horizontal"
				dataSource={holdTables}
				renderItem={(item) => (
					<List.Item
						actions={[
							!showSharedBill ? (
								<SharedBillButton
									setHoldTableClicked={setHoldTableClicked}
									number={item.tableNumber}
									setShowSharedBill={setShowSharedBill(true)}
									icon={faPeopleGroup}
								/>
							) : holdTableClicked === item.tableNumber ? (
								<div className="d-flex flex-row justify-content-center align-items-center">
									<InputNumber
										onStep={handleChangeInput}
										prefix={
											<FontAwesomeIcon icon={faPeopleGroup} className="mx-2" />
										}
										controls="true"
										min={2}
										defaultValue={2}
									/>{" "}
									<div>
										<Tag
											color="blue"
											style={{
												fontSize: "16px",
												padding: "5px",
											}}
										>
											€{(item.toPay / sharedBill).toFixed(2)}{" "}
										</Tag>{" "}
									</div>{" "}
								</div>
							) : (
								<SharedBillButton
									setHoldTableClicked={setHoldTableClicked}
									number={item.tableNumber}
									setShowSharedBill={setShowSharedBill(true)}
									icon={faPeopleGroup}
								/>
							),

							<Popconfirm
								title="Wurde die Tischrechnung bezahlt?"
								placement={"left"}
								onConfirm={() => closeAndNotify(item.tableNumber)}
								okText="Yes"
								cancelText="No"
							>
								<Button type="primary" icon={<CheckOutlined />}>
									Close
								</Button>
							</Popconfirm>,
						]}
					>
						<List.Item.Meta
							avatar={
								<Avatar
									src={require(`../assets/img/${item.tableNumber}ball.png`)}
								/>
							}
							title={<TableOnHold table={item} />}
						/>
					</List.Item>
				)}
			/>
		</Drawer>
	);
};

export default DrawerTablesOnHold;
