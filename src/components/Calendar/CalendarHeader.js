import {
    Calendar,
    Col,
    Input,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Typography,
} from 'antd'
import { CalendarMode } from 'antd/es/calendar/generateCalendar'
import moment from 'moment'
import React, { useState } from 'react'

const CalendarHeader = () => {
    const [user, setUser] = useState('')
    const [value, setValue] = useState(() => moment())
    const [selectedValue, setSelectedValue] = useState(() => moment())
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [listData, setListData] = useState([
        { name: 'Tom', date: '20-11-22' },
        { name: 'Evi', date: '21-11-22' },
        { name: 'Flo', date: '22-11-22' },
        { name: 'Toni', date: '23-11-22' },
        { name: 'Numi', date: '24-11-22' },
    ])

    const dateCellRender = (value) => {
        //const listData = getListData(value)
        // console.log(value.format('DD-MM-YY'))
        return (
            <ul className="events">
                {listData.map(
                    (item) =>
                        item.date === value.format('DD-MM-YY') && (
                            <li key={item.date}>{item.name}</li>
                        )
                )}
            </ul>
        )
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
        let newItem = { name: user, date: selectedValue.format('DD-MM-YY') }
        setListData((prevState) => [...prevState, newItem])
        console.log(newItem)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onSelect = (newValue) => {
        setValue(newValue)
        setSelectedValue(newValue)
        showModal()
    }
    const onPanelChange = (newValue) => {
        setValue(newValue)
    }

    const onChange = (newValue) => {
        setUser(newValue.target.value)
    }
    const headerRender = () => {
        return <CalendarHeader />
    }

    return (
        <>
            <div className="site-calendar-customize-header-wrapper">
                <Calendar
                    onSelect={onSelect}
                    onPanelChange={onPanelChange}
                    dateCellRender={dateCellRender}
                    fullscreen={false}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                        const start = 0
                        const end = 12
                        const monthOptions = []

                        const current = value.clone()
                        const localeData = value.localeData()
                        const months = []
                        for (let i = 0; i < 12; i++) {
                            current.month(i)
                            months.push(localeData.monthsShort(current))
                        }

                        for (let i = start; i < end; i++) {
                            monthOptions.push(
                                <Select.Option
                                    key={i}
                                    value={i}
                                    className="month-item"
                                >
                                    {months[i]}
                                </Select.Option>
                            )
                        }

                        const year = value.year()
                        const month = value.month()
                        const options = []
                        for (let i = year; i < year + 2; i += 1) {
                            options.push(
                                <Select.Option
                                    key={i}
                                    value={i}
                                    className="year-item"
                                >
                                    {i}
                                </Select.Option>
                            )
                        }
                        return (
                            <div
                                style={{
                                    padding: 20,
                                    backgroundColor: 'lightblue',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography.Title level={4}>
                                    Thekendiest Plan
                                </Typography.Title>
                                <Row gutter={16}>
                                    <Col>
                                        <Select
                                            style={{ width: 100 }}
                                            dropdownMatchSelectWidth={false}
                                            value={month}
                                            onChange={(newMonth) => {
                                                const now = value
                                                    .clone()
                                                    .month(newMonth)
                                                onChange(now)
                                            }}
                                        >
                                            {monthOptions}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Select
                                            style={{ width: 100 }}
                                            dropdownMatchSelectWidth={false}
                                            className="my-year-select"
                                            value={year}
                                            onChange={(newYear) => {
                                                const now = value
                                                    .clone()
                                                    .year(newYear)
                                                onChange(now)
                                            }}
                                        >
                                            {options}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }}
                />
            </div>
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Space direction="vertical">
                    Day selected: {selectedValue?.format('DD-MM-YYYY')}
                    <Input placeholder="Name" onChange={onChange} />
                </Space>
            </Modal>
        </>
    )
}

export default CalendarHeader
