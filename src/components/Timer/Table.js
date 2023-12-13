import {
  Button,
  Col,
  Divider,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
} from "antd";
import { Modal } from "antd";
import {
  faMoneyBillWave,
  faToggleOff,
  faHourglassHalf,
  faPercent,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Avatar, Card, TimePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isNotZero, parseTime } from "../../utils/timeHelper";
import dayjs from "dayjs";
import { HourAndMinFormat } from "../assets/const/const";

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledRangeTime() {
  return {
    disabledHours: () => range(0, 14),
  };
}

function Table({
  table,
  closeTable,
  startTime,
  endTime,
  toggleDiscount,
  addHoldTable,
  setEndTime,
}) {
  const [sharedBill, setSharedBill] = useState("2");

  function handleChangeInput(val) {
    setSharedBill(val);
  }

  function onOpenTable(time) {
    if (time !== null) startTime(time, table.tableNumber);
    startTime(0, table.tableNumber);
  }

  function onCloseTable(time) {
    if (time == null) endTime(0, table.tableNumber);
    endTime(time, table.tableNumber);
  }

  const descCardTime = (
    <Space direction="vertical">
      <TimePicker
        format={HourAndMinFormat}
        onChange={onOpenTable}
        minuteStep={5}
        disabledTime={disabledRangeTime}
        hideDisabledOptions={true}
        placeholder={"Angefangen"}
        allowClear={false}
        placement={"bottomRight"}
        value={isNotZero(table.start) ? dayjs(table.start) : ""}
      />{" "}
      <TimePicker
        format={HourAndMinFormat}
        onChange={onCloseTable}
        minuteStep={5}
        disabledTime={disabledRangeTime}
        hideDisabledOptions={true}
        allowClear={false}
        placeholder={"Fertig"}
        placement={"bottomRight"}
        disabled={isNotZero(table.start) ? false : true}
        value={table.end !== 0 ? dayjs(table.end) : ""}
        renderExtraFooter={() => (
          <Button
            size="small"
            type="primary"
            onClick={() => setEndTime(table.tableNumber)}
          >
            End at 24:00
          </Button>
        )}
      />{" "}
    </Space>
  );

  const descCardDiscount = (
    <Space direction="vertical">
      <Space align="center">
        <Switch
          checked={table.discount}
          checkedChildren="Ja"
          unCheckedChildren="Nein"
          onChange={() => toggleDiscount(table.tableNumber)}
        />{" "}
      </Space>{" "}
    </Space>
  );

  const headCard = (
    <Space className="rounded">
      <Avatar src={`/img/${table.tableNumber}ball.png`} />
      Tisch {table.tableNumber}{" "}
    </Space>
  );

  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);

  const showTotalModal = () => {
    setIsTotalModalOpen(true);
  };
  const handleTotalOk = () => {
    setIsTotalModalOpen(false);
  };
  const handleTotalCancel = () => {
    setIsTotalModalOpen(false);
  };

  return (
    <>
      <Card
        hoverable
        size="small"
        headStyle={
          +table.toPay !== 0
            ? {
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                padding: "6px 15px",
              }
            : { backgroundColor: "rgba(247, 247, 247, 0.8)" }
        }
        title={headCard}
        className="p-1 rounded fade-in"
        style={{ maxWidth: 260 }}
        extra={
          table.played ? (
            <div
              className={`fw-semibold ${
                table.toPay && "text-primary"
              }`}
            >
              {parseTime(table.played)}{" "}
            </div>
          ) : (
            <Spin tip="Spielen..." size="small" />
          )
        }
        actions={[
          <Popconfirm
            title="Der Tisch wird wieder verfügbar, die offene Zahlung findest du in offene Rechnungen"
            okText="Yes"
            cancelText="No"
            onConfirm={() => addHoldTable(table.tableNumber)}
          >
            <Space direction="vertical">
              <FontAwesomeIcon icon={faToggleOff} />
              <div>Behalten</div>
            </Space>
          </Popconfirm>,
          <Space direction="vertical" onClick={showTotalModal}>
            <FontAwesomeIcon
              icon={faPeopleGroup}
              style={{
                fontSize: "14px",
              }}
            />
            <div>Teilen</div>
          </Space>,
          <Popconfirm
            title="Hatten die Gäste bezhalt?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => closeTable(table.tableNumber, true)}
          >
            <Space direction="vertical">
              <FontAwesomeIcon icon={faMoneyBillWave} />
              <div>
                {table.toPay !== 0 ? (
                  <span
                    className={`fw-bold ${
                      table.toPay && "text-primary mx-2"
                    }`}
                  >
                    {table.toPay !== 0 && table.toPay}€
                  </span>
                ) : (
                  "Löschen"
                )}
              </div>
            </Space>
          </Popconfirm>,
        ]}
      >
        {/* //! ------ Inside parts of the card */}
        <Row justify={"space-between"} align={"middle"} gutter={10}>
          <Col>
            <FontAwesomeIcon
              icon={faHourglassHalf}
              style={{
                fontSize: "50px",
                color: "rgba(50,50,50, 0.3)",
              }}
            />
          </Col>
          <Col>{descCardTime}</Col>
        </Row>
        <Row
          justify={"space-around"}
          align={"middle"}
          className="pt-4"
        >
          <Col className="center">
            <FontAwesomeIcon
              icon={faPercent}
              style={{ fontSize: "18px", color: "#999" }}
            />
            <div className="center mx-2 fs-6 text-secondary">
              Rabatt
            </div>
          </Col>
          <Col>{descCardDiscount}</Col>
        </Row>
      </Card>
      {/* //! ------ Modal for changing amount of people */}
      <Modal
        title={`Geteilte Rechnung | Tisch ${table.tableNumber} - ${table.toPay}`}
        open={isTotalModalOpen}
        onOk={handleTotalOk}
        onCancel={handleTotalCancel}
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div>
            <p> Anzahl Personen </p>{" "}
            <InputNumber
              onStep={handleChangeInput}
              min={2}
              defaultValue={2}
            />{" "}
          </div>{" "}
          <Divider> Total per person </Divider>{" "}
          <div>
            <Tag
              color="blue"
              style={{ fontSize: "20px", padding: "10px" }}
            >
              €{(table.toPay / sharedBill).toFixed(2)}{" "}
            </Tag>{" "}
          </div>{" "}
        </div>{" "}
      </Modal>{" "}
    </>
  );
}

export default Table;
