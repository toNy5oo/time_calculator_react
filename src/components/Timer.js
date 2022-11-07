import { Col, Row } from 'antd'
import TimerHeader from './TimerHeader'
import Table from './Table'
import React, { useState, useEffect } from 'react'
import { notification } from 'antd'
import moment from 'moment'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { SmileOutlined } from '@ant-design/icons'
import { DEFAULT_TEMPLATE } from './assets/data/tablesArray'

const closeTableNotification = (num) => {
    notification.open({
        message: `Tisch ${num} ist gespeichert`,
        description: 'This is the content of the notification.',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    })
}

const holdTableNotification = (num, message, desc) => {
    notification.open({
        message: `${message}`,
        description: `${desc}`,
    })
}

function Timer() {
    const [parent] = useAutoAnimate(/* optional config */)
    const [tables, setTables] = React.useState(
        localStorage.getItem('tables')
            ? JSON.parse(localStorage.getItem('tables'))
            : DEFAULT_TEMPLATE
    )
    const [holdTables, setHoldTables] = React.useState(
        localStorage.getItem('holdtables')
            ? JSON.parse(localStorage.getItem('holdtables'))
            : []
    )
    const [activeTables, setActiveTables] = useState(0)
    const [isEmpty, setIsEmpty] = useState(true)

    const countActiveTables = () => tables.filter((obj) => obj.isActive)

    useEffect(() => {
        tables.map((table) => table.isActive && setIsEmpty(false))
        setActiveTables(countActiveTables().length)
        console.log(tables)
    }, [tables, holdTables])

    useEffect(() => {
        localStorage.setItem('tables', JSON.stringify(tables))
        localStorage.setItem('holdtables', JSON.stringify(holdTables))
    }, [tables, holdTables])

    /**
     * Retrieving JSON string from localStorage to restore the state
     */

    const closeHoldTable = (num) => {
        holdTableNotification(
            num,
            'Tisch ' + num,
            'Table has been successfully closed'
        )
        setHoldTables((state) =>
            state.filter((e) => e.tableNumber !== parseInt(num))
        )
    }

    //Deactivate the table but keeps the info
    const addHoldTable = (tableNumber) => {
        console.log(
            holdTables.filter((t) => t.tableNumber === parseInt(tableNumber))
                .length
        )
        if (
            holdTables.filter((t) => t.tableNumber === parseInt(tableNumber))
                .length === 0
        ) {
            const obj = tables.filter(
                (t) => t.tableNumber === parseInt(tableNumber)
            )

            if (obj[0].start !== 0 && obj[0].end !== 0) {
                obj[0].start = moment(obj[0].start).format('HH:mm')
                obj[0].end = moment(obj[0].end).format('HH:mm')
                setHoldTables((state) => [...state, ...obj])
                closeTable(tableNumber)
            } else {
                holdTableNotification(
                    tableNumber,
                    'Tisch ' + tableNumber + " can't be put on hold",
                    "Table doesn't have both a starting and ending time"
                )
            }
        } else
            holdTableNotification(
                tableNumber,
                'Tisch ' + tableNumber + " can't be put on hold",
                'There is already a previous table with same number pending. Please close that one before putting another one in hold'
            )
    }

    //Add table from view
    const openTable = (tableNumber) => {
        setTables((state) => {
            const list = state.map((item) => {
                // 👇️ Get the right table obj
                if (item.tableNumber === parseInt(tableNumber)) {
                    return { ...item, isActive: true }
                }
                return item
            })
            return list
        })
    }

    //Remove table from view
    const closeTable = (tableNumber, showMessage) => {
        // setShow(true)
        showMessage && closeTableNotification(tableNumber)

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
                    }
                }
                return item
            })
            return list
        })
    }

    //Update table on start time and minPlayed
    const startTime = (time, index) => {
        setTables((prevState) => {
            const newState = prevState.map((obj) => {
                // 👇️ if id equals 2, update country property
                let pay = 0
                let played = 0
                if (obj.tableNumber === index) {
                    if (time !== 0 && obj.end !== 0) {
                        played = timePlayed(time, obj.end)
                        pay = toPay(played[1], obj.discount)
                    }
                    return {
                        ...obj,
                        start: time,
                        played: played[0],
                        toPay: pay,
                    } //played: min, toPay: pay
                }
                // 👇️ otherwise return object as is
                return obj
            })
            return newState
        })
    }

    //Update table on end time and minPlayed
    const endTime = (time, index) => {
        setTables((prevState) => {
            const newState = prevState.map((obj) => {
                // 👇️ if id equals 2, update country property
                let pay = 0
                let played = 0
                if (obj.tableNumber === index) {
                    if (time !== 0 && obj.start !== 0) {
                        played = timePlayed(obj.start, time)
                        pay = toPay(played[1], obj.discount)
                    }
                    return { ...obj, end: time, played: played[0], toPay: pay } //played: min, toPay: pay
                }
                // 👇️ otherwise return object as is
                return obj
            })
            return newState
        })
    }

    /**
     * Calculate difference between ending time and starting time using parseTime function
     * @param {moment time} start
     * @param {moment time} end
     * @returns array[string: time, number: time]
     */
    const timePlayed = (start, end) => {
        if (end !== 0) {
            const duration = Math.ceil(
                moment.duration(end.diff(start, 'seconds') / 60)
            )
            return [parseTime(duration), duration]
        } else return 0
    }

    /**
     * Round to lowest number both hours and minutes and set them to 2 digits each
     * @param {number} minutesPlayed
     * @returns
     */
    function parseTime(minutesPlayed) {
        let hours = Math.floor(minutesPlayed / 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })
        let minutes = Math.floor(minutesPlayed % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })
        return `${hours}h : ${minutes}m`
    }

    /**
     * Calculate how much is to pay considered the time and if discount applies
     * @param {number} timePlayed
     * @param {boolean} discount
     * @returns
     */
    const toPay = (timePlayed, discount) => {
        return parseFloat(
            discount ? timePlayed * 0.075 : timePlayed * 0.15
        ).toFixed(2)
    }

    //Toggle discounts and recalculate amount to pay
    const toggleDiscount = (index) => {
        setTables((prevState) => {
            const newState = prevState.map((obj) => {
                // 👇️ if id equals 2, update country property
                let pay = 0
                if (obj.tableNumber === index) {
                    if (obj.toPay !== 0) {
                        if (!obj.discount)
                            pay = (parseFloat(obj.toPay) / 2).toFixed(2)
                        else pay = (parseFloat(obj.toPay) * 2).toFixed(2)
                    }
                    return { ...obj, discount: !obj.discount, toPay: pay }
                }
                // 👇️ otherwise return object as is
                return obj
            })
            return newState
        })
    }

    //Gets every table and closes it
    const resetAllTables = () => {
        tables.map((t, i) => {
            closeTable(i + 1, false)
        })
        setIsEmpty(true)
        setActiveTables(countActiveTables().length)
    }

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
                    <Col className="text-center p-5 fs-5">
                        {' '}
                        No active tables{' '}
                    </Col>{' '}
                </Row>
            ) : (
                <Row
                    justify="space-around"
                    align="center"
                    ref={parent}
                    className="mx-5 mt-3"
                >
                    {tables.map(
                        (table) =>
                            table.isActive && (
                                <Col
                                    xs={24}
                                    sm={12}
                                    xl={6}
                                    className="d-flex justify-content-around my-3 p-1"
                                >
                                    <Table
                                        table={table}
                                        key={table.tableNumber}
                                        closeTable={closeTable}
                                        startTime={startTime}
                                        endTime={endTime}
                                        toggleDiscount={toggleDiscount}
                                        addHoldTable={addHoldTable}
                                    />{' '}
                                </Col>
                            )
                    )}{' '}
                </Row>
            )}
        </main>
    )
}

export default Timer
