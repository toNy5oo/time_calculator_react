import React, { useState } from "react";
import {
  OrderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Row,
  Space,
  Button,
  Popconfirm,
  Avatar,
  Col,
  Badge,
  Divider,
  Segmented,
} from "antd";

import Container from "react-bootstrap/Container";
import DrawerTablesOnHold from "./DrawerTablesOnHold";
import { DEFAULT_LAYOUT } from "../assets/data/tablesArray";

function TimerHeader({
  tables,
  openTable,
  resetAllTables,
  activeTables,
  holdTables,
  closeHoldTable,
  setLayout,
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

  const changeLayout = (layoutSelected) => {
    localStorage.setItem("layout", layoutSelected);
    setLayout(layoutSelected);
  };

  return (
    <>
      <Container className="fade-in">
        <Row
          justify="space-between"
          className="bg-light rounded my-3"
        >
          <Col className="m-4">
            <Space>
              <span className="fs-6 text-muted mx-2">
                Besetzte Tische:
              </span>
              <strong className="fs-5">{activeTables}</strong>
              <Divider type="vertical fs-6" />
              <span className="fs-6 text-muted mx-2">
                Offene Rechnungen:
              </span>
              <strong className="fs-5">{holdTables.length}</strong>
            </Space>
          </Col>

          <Col className="center p-4 d-flex">
            <Popconfirm
              title="Bist du sicher, dass du alle Tische zurücksetzen möchtest?"
              icon={
                <QuestionCircleOutlined style={{ color: "red" }} />
              }
              placement="bottom"
              okText="Ja"
              cancelText="Nein"
              onConfirm={() => resetAllTables()}
            >
              {tables.some((table) => table.isActive) && (
                <Button danger className="mx-2">
                  Tische zurücksetzen
                </Button>
              )}
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

        <Row align={"middle"} justify={"end"}>
          <Segmented
            defaultValue={
              localStorage.getItem("layout") || DEFAULT_LAYOUT
            }
            onChange={(value) => changeLayout(value)}
            options={[
              {
                label: "Grid",
                value: "grid",
                icon: <AppstoreOutlined />,
              },
              {
                label: "List",
                value: "list",
                icon: <OrderedListOutlined />,
              },
            ]}
          />
        </Row>

        <Row wrap>
          <Col className="mx-4">
            <Space size={"small"} wrap>
              <div className="fs-6 text-muted mx-2">
                Freie Tische:
              </div>
              {tables.map(
                (table) =>
                  !table.isActive && (
                    <Avatar
                      key={table.tableNumber}
                      src={`/img/${table.tableNumber}ball.png`}
                      size="small"
                      onClick={() =>
                        onSelectedItems(table.tableNumber)
                      }
                      className="mx-2 cursor-pointer"
                      style={{ cursor: "pointer" }}
                    />
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
