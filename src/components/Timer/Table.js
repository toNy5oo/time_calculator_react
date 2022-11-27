import { Divider, InputNumber, Popconfirm, Space, Switch, Tag } from 'antd'
import { Modal } from 'antd'
import {
    faMoneyBillWave,
    faToggleOff,
    faHourglassHalf,
    faPercent,
    faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { Avatar, Card, TimePicker } from 'antd'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from "framer-motion"

const { Meta } = Card
const format = 'HH:mm'

function range(start, end) {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}

function disabledRangeTime() {
    return {
        disabledHours: () => range(0, 18),
    }
}

function Table({
    table,
    closeTable,
    startTime,
    endTime,
    toggleDiscount,
    addHoldTable,
}) {
    const [sharedBill, setSharedBill] = useState('2')

    function handleChangeInput(val) {
        setSharedBill(val)
    }

    function onChangeStart(time) {
        if (time !== null) startTime(time, table.tableNumber)
        else startTime(0, table.tableNumber)
    }

    function onChangeEnd(time) {
        if (time !== null) {
            endTime(time, table.tableNumber)
        } else endTime(0, table.tableNumber)
    }

    const descCardTime = (
        <>
            <Space direction="vertical">
                <TimePicker
                    bordered={false}
                    format={format}
                    onChange={onChangeStart}
                    minuteStep={5}
                    disabledTime={disabledRangeTime}
                    hideDisabledOptions={true}
                    placeholder={'Angefangen'}
                    onClear={() => alert('cleared')}
                    value={table.start !== 0 ? moment(table.start) : ''}
                />{' '}
                <TimePicker
                    bordered={false}
                    format={format}
                    onChange={onChangeEnd}
                    minuteStep={5}
                    disabledTime={disabledRangeTime}
                    hideDisabledOptions={true}
                    placeholder={'Fertig'}
                    disabled={table.start !== 0 ? false : true}
                    value={table.end !== 0 ? moment(table.end) : ''}
                />{' '}
            </Space>{' '}
        </>
    )

    const descCardDiscount = (
        <>
            <Space direction="vertical">
                <Space align="center">
                    <Switch
                        checkedChildren="Ja"
                        unCheckedChildren="Nein"
                        onChange={() => toggleDiscount(table.tableNumber)}
                    />{' '}
                </Space>{' '}
            </Space>{' '}
        </>
    )

    const headCard = (
        <>
            <Space className='rounded'>
                <Avatar
                    src={require(`../assets/img/${table.tableNumber}ball.png`)}
                />
                Tisch {table.tableNumber}{' '}
            </Space>{' '}
        </>
    )

    const [isTotalModalOpen, setIsTotalModalOpen] = useState(false)

    const showTotalModal = () => {
        setIsTotalModalOpen(true)
    }
    const handleTotalOk = () => {
        setIsTotalModalOpen(false)
    }
    const handleTotalCancel = () => {
        setIsTotalModalOpen(false)
    }

    return (
        <>
        <AnimatePresence>
        <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: -0.5 }}
        transition={{ ease: "easeOut", duration: 0.5 }}>
        <Card
            type="inner"
            title={headCard}
            className='p-1 rounded'
            style={{
                minWidth: 300,
                maxWidth: 325,
            }}
            extra={
                table.played ? (
                    <div
                        className={`fw-semibold ${
                            table.toPay && 'text-primary'
                        }`}
                    >
                        {table.played}{' '}
                    </div>
                ) : (
                    ''
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
							<Space direction="vertical" onClick={table.toPay && showTotalModal}>
								<FontAwesomeIcon
									icon={faPeopleGroup}
									style={{
										fontSize: "20px",
									}}
								/>
								<div>Teilen</div>
							</Space>,
                <Popconfirm
                    title="Are you sure delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => closeTable(table.tableNumber, true)}
                >
                    <Space direction='vertical'>
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    <div>
                    {table.toPay !== 0 && (
                        <span
                            className={`fw-bold ${
                                table.toPay && 'text-primary mx-2'
                            }`}
                        >
                            {table.toPay !== 0 && table.toPay}€
                        </span>
                    )}
                    </div>
                    
                    
                    </Space>
                    
                    
                </Popconfirm>,
            ]}
        >
            {/* Inside parts of the card */}
            <Meta
                className="mb-2 mt-1"
                avatar={
                    <FontAwesomeIcon
                        icon={faHourglassHalf}
                        style={{ fontSize: '25px', color: '#666' }}
                    />
                }
                title={<div className="text-muted"> Zeit </div>}
                description={descCardTime}
            />{' '}
            <Meta
                className="my-2"
                avatar={
                    <FontAwesomeIcon
                        icon={faPercent}
                        style={{ fontSize: '25px', color: '#666' }}
                    />
                }
                title={<div className="text-muted"> Rabatt </div>}
                description={descCardDiscount}
            />{' '}
            <Modal
                title={`Geteilte Rechnung | Tisch ${table.tableNumber} - ${table.toPay}`}
                open={isTotalModalOpen}
                onOk={handleTotalOk}
                onCancel={handleTotalCancel}
            >
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div>
                        <p> Anzahl Personen </p>{' '}
                        <InputNumber
                            onStep={handleChangeInput}
                            min={2}
                            defaultValue={2}
                        />{' '}
                    </div>{' '}
                    <Divider> Total per person </Divider>{' '}
                    <div>
                        <Tag
                            color="blue"
                            style={{ fontSize: '20px', padding: '10px' }}
                        >
                            €{(table.toPay / sharedBill).toFixed(2)}{' '}
                        </Tag>{' '}
                    </div>{' '}
                </div>{' '}
            </Modal>{' '}
        </Card>
        </motion.div>
        </AnimatePresence>
        </>
    )
}

export default Table
