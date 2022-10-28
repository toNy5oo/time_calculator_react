import React, { useEffect } from 'react'
import { Avatar, Badge, Calendar, Space, Col } from 'antd'
import './assets/css/thekendienst.css'
import { UserOutlined } from '@ant-design/icons'
import { Container } from 'react-bootstrap/'
import moment from 'moment'

const getListData = (value) => {
    let listData
    switch (value.date()) {
        case 8:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
            ]
            break
        case 10:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
                {
                    type: 'error',
                    content: 'This is error event.',
                },
            ]
            break
        case 15:
            listData = []
            break
        default:
    }
    return listData || []
}

const getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394
    }
}

function onPanelChange(value, mode) {
    console.log(value, mode)
}
function onChange(value, mode) {
    console.log(moment(value).format('MM/DD/YYYY'))
}
function onSelect(value, mode) {
    console.log(moment(value).format('MM/DD/YYYY'))
}

function Thekendienst() {
    useEffect(() => {
        /**
         * fetch data from db
         */
    })

    const monthCellRender = (value) => {
        const num = getMonthData(value)
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null
    }

    const dateCellRender = (value) => {
        const listData = getListData(value)
        return (
            <Space align="center">
                <Avatar src="https://joeschmoe.io/api/v1/random" />
                <h6>Name</h6>
            </Space>
        )
    }

    const dateFullCellRender = (date) => {
        const day = date.day()
        let style
        if (day === 1 || day === 2) {
            style = { border: '1px solid #d9d9d9' }
        } else {
            style = { border: '1px solid red' }
        }
        return <div style={style}>{day}</div>
    }
    // return <div>{moment(value).format('DD/MM')}</div>

    return (
        <Container>
            <Calendar
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
                dateFullCellRender={dateFullCellRender}
                fullscreen={true}
                validRange={[moment(), moment().add(2, 'years')]}
                // onChange={onChange}
                onPanelChange={onPanelChange}
                onSelect={onSelect}
            />
        </Container>
    )
}

export default Thekendienst
