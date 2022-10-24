import {
    Divider,
    InputNumber,
    message,
    Popconfirm,
    Space,
    Switch,
    Tag,
} from 'antd'
import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import {
    ShareAltOutlined,
    CloseOutlined,
    PercentageOutlined,
    HourglassOutlined,
} from '@ant-design/icons'
import { Avatar, Card, TimePicker } from 'antd'
import moment from 'moment'

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
        // disabledMinutes: () => range(0, 60),
        // disabledSeconds: () => [55, 56],
    }
}

function Table({ table, closeTable, startTime, endTime, toggleDiscount }) {
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
            message.info(
                'Tisch ' + table.tableNumber + ' ist jetzt gespeichert'
            )
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
                />

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
                />
            </Space>
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
                    />
                </Space>
            </Space>
        </>
    )

    const headCard = (
        <>
            <Space>
                <Avatar
                    src={require(`./assets/img/${table.tableNumber}ball.png`)}
                />
                Tisch {table.tableNumber}
            </Space>
        </>
    )

    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <Card
            type="inner"
            title={headCard}
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
                        {table.played}
                    </div>
                ) : (
                    ''
                )
            }
            actions={[
                <Popconfirm
                    title="Are you sure delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => closeTable(table.tableNumber, true)}
                >
                    <CloseOutlined key="close" style={{ color: 'red' }} />
                </Popconfirm>,
                <ShareAltOutlined
                    key="share"
                    onClick={table.toPay && showModal}
                />,
                <div className={`fw-bold ${table.toPay && 'text-primary'}`}>
                    {table.toPay} €
                </div>,
            ]}
        >
            <Meta
                className="mb-2 mt-1"
                avatar={
                    <HourglassOutlined
                        style={{ fontSize: '20px', color: '#666' }}
                    />
                }
                title={<div className="text-muted">Zeit</div>}
                description={descCardTime}
            />
            <Meta
                className="my-2"
                avatar={
                    <PercentageOutlined
                        style={{ fontSize: '20px', color: '#666' }}
                    />
                }
                title={<div className="text-muted">Rabatt</div>}
                description={descCardDiscount}
            />
            <Modal
                title="Geteilte Rechnung"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div>
                        <p>Anzahl Personen</p>
                        <InputNumber
                            onStep={handleChangeInput}
                            min={2}
                            defaultValue={2}
                        />
                    </div>
                    <Divider>Total per person</Divider>
                    <div>
                        <Tag
                            color="blue"
                            style={{ fontSize: '20px', padding: '10px' }}
                        >
                            € {(table.toPay / sharedBill).toFixed(2)}
                        </Tag>
                    </div>
                </div>
            </Modal>
        </Card>
    )
}

export default Table
