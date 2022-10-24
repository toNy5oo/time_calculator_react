import { Col, Row } from 'antd'
import TimerHeader from './TimerHeader'
import Table from './Table'
import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import moment from 'moment'
import { useAutoAnimate } from '@formkit/auto-animate/react'

var standardTables = [7, 8, 9, 10]
const DEFAULT_TEMPLATE = [
    {
        tableNumber: 1,
        isActive: false,
        start: 0, // 3600sec * 18 (PM)
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 2,
        isActive: false,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 3,
        isActive: false,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 4,
        isActive: false,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 5,
        isActive: false,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 6,
        isActive: false,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 7,
        isActive: true,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 8,
        isActive: true,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 9,
        isActive: true,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
    {
        tableNumber: 10,
        isActive: true,
        start: 0,
        end: 0,
        played: 0,
        discount: false,
        toPay: 0,
    },
]

function Timer() {
    const [show, setShow] = useState(false)
    const [parent] = useAutoAnimate(/* optional config */)
    const [tables, setTables] = React.useState(
        localStorage.getItem('tables')
            ? JSON.parse(localStorage.getItem('tables'))
            : DEFAULT_TEMPLATE
    )

    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        tables.forEach((table) => {
            table.isActive && setIsEmpty(false)
        })
    }, [])

    useEffect(() => {
        localStorage.setItem('tables', JSON.stringify(tables))
    }, [tables])

    /**
     * Retrieving JSON string from localStorage to restore the state
     */

    //Add table from view
    const openTable = (tableNumber) => {
        // 👇️ passing function to setData method
        setTables((prevState) => {
            const newState = prevState.map((obj) => {
                // 👇️ if id equals tableNumber
                if (obj.tableNumber === parseInt(tableNumber)) {
                    console.log('Table activated: ' + obj)
                    return { ...obj, isActive: true }
                }
                // 👇️ otherwise return object as is
                return obj
            })
            return newState
        })
        //Setting a storage variable
        // localStorage.setItem('tables', JSON.stringify(tables))
    }

    //Remove table from view
    const closeTable = (tableNumber, showMessage) => {
        setShow(true)
        if (showMessage)
            message.info('Tisch ' + tableNumber + ' ist jetzt gespeichert')
        // 👇️ passing function to setData method
        setTables((prevState) => {
            const newState = prevState.map((obj) => {
                // 👇️ if id equals 2, update country property
                if (obj.tableNumber === tableNumber) {
                    return {
                        ...obj,
                        tableNumber: tableNumber,
                        isActive: standardTables.includes(obj.tableNumber)
                            ? true
                            : false,
                        start: 0,
                        end: 0,
                        played: 0,
                        discount: false,
                        toPay: 0,
                    }
                }
                // 👇️ otherwise return object as is
                return obj
            })

            return newState
        })
        //Setting a storage variable
        console.log(tables)
        // localStorage.setItem('tables', JSON.stringify(tables))
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
        //Setting a storage variable
        // localStorage.setItem('tables', JSON.stringify(tables))
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
        // localStorage.setItem('tables', JSON.stringify(tables))
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
            console.log('Dur ' + duration)
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
        // localStorage.setItem('tables', JSON.stringify(tables))
    }

    //Gets every table and closes it
    const resetAllTables = () => {
        tables.forEach((t, i) => {
            closeTable(i + 1, false)
        })
    }

    return (
        <main>
            <TimerHeader
                tables={tables}
                openTable={openTable}
                resetAllTables={resetAllTables}
            />{' '}
            <Row
                justify="space-around"
                align="middle"
                ref={parent}
                className="mx-5 mt-3"
            >
                {tables.map(
                    (table) =>
                        table.isActive && (
                            <Col
                                span={4}
                                offset={1}
                                className="d-flex justify-content-around my-3 p-1"
                            >
                                <Table
                                    table={table}
                                    key={table.tableNumber}
                                    closeTable={closeTable}
                                    startTime={startTime}
                                    endTime={endTime}
                                    toggleDiscount={toggleDiscount}
                                />{' '}
                            </Col>
                        )
                )}{' '}
            </Row>{' '}
            {isEmpty && (
                <Row justify="space-around" align="middle">
                    <Col className="text-center"> No active tables </Col>{' '}
                </Row>
            )}{' '}
        </main>
    )
}

export default Timer
