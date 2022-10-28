import React, { useState, useEffect } from 'react'
import {
    DownOutlined,
    QuestionCircleOutlined,
    PlusOutlined,
    PlusCircleFilled,
    DownloadOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu, Space, Button, Popconfirm, Avatar } from 'antd'
import { Row, Col } from 'antd'

import Container from 'react-bootstrap/Container'
import { Navbar } from 'react-bootstrap'

function TimerHeader({ tables, openTable, resetAllTables }) {
    const [dateState, setDateState] = useState(new Date())

    const onSelectedItems = ({ key }) => {
        openTable(key)
    }

    const singleItem = (num) => {
        return (
            <Space align="center">
                Tisch
                <Avatar
                    src={require(`./assets/img/${num}ball.png`)}
                    size="small"
                    style={{ margin: '2px' }}
                />
            </Space>
        )
    }

    const menu = (
        <Menu
            items={tables.map(
                (t, i) =>
                    t.isActive === false && {
                        key: t.tableNumber,
                        label: singleItem(t.tableNumber),
                    }
            )}
            onClick={onSelectedItems}
        />
    )

    useEffect(() => {
        console.log(tables)
        setInterval(() => {
            setDateState(new Date())
        }, 60000)
    }, [])

    return (
        <>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand>
                        <Dropdown overlay={menu}>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    className="d-flex"
                                    icon={
                                        <PlusCircleFilled
                                            style={{
                                                fontSize: 18,
                                                alignSelf: 'center',
                                            }}
                                        />
                                    }
                                    size="large"
                                >
                                    Add table
                                </Button>
                            </a>
                        </Dropdown>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        {dateState.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <Popconfirm
                            title="Are you sure to reset all the tables?"
                            icon={
                                <QuestionCircleOutlined
                                    style={{ color: 'red' }}
                                />
                            }
                            placement="bottom"
                            okText="Ja"
                            cancelText="Nein"
                            onConfirm={() => resetAllTables()}
                        >
                            <Button danger shape="round" size="large">
                                Reset all tables
                            </Button>
                        </Popconfirm>
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default TimerHeader
