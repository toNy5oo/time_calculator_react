import { Col, Row, Spin, notification, Space, Avatar } from "antd";
import TimerHeader from "./TimerHeader";
import Table from "./Table";
import React, { useEffect, useRef, useMemo } from "react";
import {
  DEFAULT_LAYOUT,
  DEFAULT_TEMPLATE,
} from "../../components/assets/data/tablesArray";
import dayjs from "dayjs";
import {
  currentTime,
  isNotZero,
  timePlayed,
} from "../../utils/timeHelper";
import autoAnimate from "@formkit/auto-animate";
import { useState } from "react";
import {
  FULL_PRICE_MIN,
  HALF_PRICE_MIN,
  HourAndMinFormat,
} from "../assets/const/const";
import {
  notifyOnClose,
  notifyOnHold,
} from "../../utils/notifications";

function Timer() {
  const [isDisplayed, setIsDisplayed] = useState(1);

  const [layout, setLayout] = useState(
    localStorage.getItem("layout") || DEFAULT_LAYOUT
  );

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

  // To render the first active table in the list view
  useEffect(() => {
    const firstTableActive = tables.find(
      (table) => table.isActive === true
    );
    if (firstTableActive)
      setIsDisplayed(firstTableActive.tableNumber);
  }, [tables]);

  const { isEmpty, activeTables } = useMemo(() => {
    const isEmpty = tables.every((table) => !table.isActive);
    const activeTables = tables.filter((obj) => obj.isActive).length;
    return { isEmpty, activeTables };
  }, [tables]);

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
    notifyOnHold(
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
    if (
      holdTables.filter((t) => t.tableNumber === tableNumber)
        .length === 0
    ) {
      const [obj] = tables.filter(
        (t) => t.tableNumber === tableNumber
      );
      if (obj.start !== 0 && obj.end !== 0) {
        obj.start = dayjs(obj.start).format(HourAndMinFormat);
        obj.end = dayjs(obj.end).format(HourAndMinFormat);
        setHoldTables((state) => [...state, obj]);
        closeTable(tableNumber);
      } else {
        notifyOnHold(
          tableNumber,
          "Tisch " + tableNumber + " kann nicht verschoben werden.",
          "Es fehlen entweder Start- oder Endzeit."
        );
      }
    } else
      notifyOnHold(
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
            start: currentTime(),
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
      showMessage && notifyOnClose(tableNumber);

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
        ? parseInt(timePlayed) * HALF_PRICE_MIN
        : parseInt(timePlayed) * FULL_PRICE_MIN
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
            if (!obj.discount)
              pay = (parseFloat(obj.toPay) / 2).toFixed(2);
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

  //Gets every table and close them
  const resetAllTables = () => {
    tables.forEach((t, i) => {
      closeTable(i + 1, false);
    });
    //Remove tables in hold
    setHoldTables([]);
  };

  const tableRow = (table) => {
    return (
      <div class="list-group px-2">
        <button
          className={`p-3 rounded my-2 list-group-item list-group-item-action ${
            isDisplayed === table.tableNumber && "active"
          }`}
          onClick={() => setIsDisplayed(table.tableNumber)}
        >
          <div class="d-flex justify-content-between">
            <Space className="rounded">
              <Avatar
                src={`/img/${table.tableNumber}ball.png`}
                size={"small"}
              />
              Tisch {table.tableNumber}
            </Space>
            <div>
              {table.played === 0 ? (
                <Spin size="small" />
              ) : (
                <div className="fw-bold">Fertig</div>
              )}
            </div>
          </div>
          {/* <div class="d-flex justify-content-between">
            <div class="mb-1">
              Angefangen {dayjs(table.start).format("HH:mm")}
            </div>
            <div class="mb-1">
              Fertig {dayjs(table.end).format("HH:mm")}
            </div>
          </div> */}
        </button>
      </div>
    );
  };

  const tableDetails = (table) => {
    return (
      <Table
        table={table}
        closeTable={closeTable}
        startTime={startTime}
        endTime={endTime}
        toggleDiscount={toggleDiscount}
        addHoldTable={addHoldTable}
        setEndTime={setEndTime}
      />
    );
  };

  if (isEmpty) {
    return (
      <>
        <TimerHeader
          tables={tables}
          openTable={openTable}
          resetAllTables={resetAllTables}
          activeTables={activeTables}
          holdTables={holdTables}
          closeHoldTable={closeHoldTable}
          setLayout={setLayout}
        />
        <Row justify="center" align="middle">
          <Col className="p-5 text-center fs-5">
            {" "}
            No active tables{" "}
          </Col>{" "}
        </Row>
      </>
    );
  }

  return (
    <main className="flex flex-row">
      <TimerHeader
        tables={tables}
        openTable={openTable}
        resetAllTables={resetAllTables}
        activeTables={activeTables}
        holdTables={holdTables}
        closeHoldTable={closeHoldTable}
        setLayout={setLayout}
      />

      {layout === "list" ? (
        <Row
          justify="space-around"
          align="center"
          className="mx-5 mt-4"
          ref={parent}
          gutter={16}
        >
          <Col span={6}>
            {tables.map((table) => table.isActive && tableRow(table))}
          </Col>
          <Col span={8}>
            {tables.map(
              (table) =>
                table.tableNumber === isDisplayed && (
                  <div>{tableDetails(table)}</div>
                )
            )}
          </Col>
        </Row>
      ) : (
        <Row
          justify="space-around"
          align="center"
          className="mx-5 mt-3"
          ref={parent}
        >
          {tables.map(
            (table, index) =>
              table.isActive && (
                <Col
                  key={table.tableNumber}
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
          )}
        </Row>
      )}
    </main>
  );
}

export default Timer;
