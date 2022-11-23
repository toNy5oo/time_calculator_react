import React, { useState, useEffect } from 'react'
import {
    QuestionCircleOutlined,
    PlusCircleFilled,
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
    faStopwatch,
    faPeopleGroup,
    faHourglass,
    faPercent,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Row,
    Dropdown,
    Menu,
    Space,
    Button,
    Popconfirm,
    Avatar,
    Alert,
    Col,
    Typography,
    Modal,
    InputNumber,
    Divider,
    Tag,
    Drawer,
    List,
    notification,
    Badge,
} from 'antd'

import Container from 'react-bootstrap/Container'
import { Navbar } from 'react-bootstrap'
import { moment } from 'moment/moment'
import SharedBillButton from './SharedBillButton'

function TimerHeader({
    tables,
    openTable,
    resetAllTables,
    activeTables,
    holdTables,
    closeHoldTable,
}) {
    const [holdTableClicked, setHoldTableClicked] = useState(0)
    const [sharedBill, setSharedBill] = useState('2')
    const [open, setOpen] = useState(false)
    const [showSharedBill, setShowSharedBill] = useState(false)

    //Drawer visibility methods
    const showDrawer = () => {
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false, setHoldTableClicked(0))
    }

    function handleChangeInput(val) {
        setSharedBill(val)
    }

    const onSelectedItems = ({ key }) => {
        openTable(key)
    }

    //SingleItem for menu
    const singleItem = (num) => {
        return (
            <Space align="center">
                Tisch
                <Avatar
                    src={require(`../assets/img/${num}ball.png`)}
                    size="small"
                    style={{ margin: '2px' }}
                />
            </Space>
        )
    }

    //Menu
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

    //View for the dropdown
    const actionMessage = () => {
        return (
            <Container className="d-flex justify-content-center align-items-center">
                <Space>
                    <Dropdown overlay={menu}>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            <Button
                                type="primary"
                                icon={<PlusCircleFilled />}
                                placement="bottom"
                            >
                                Tisch hinzufügen
                            </Button>
                        </a>
                    </Dropdown>
                    <Popconfirm
                        title="Bist du sicher, dass du alle Tische zurücksetzen möchtest?"
                        icon={
                            <QuestionCircleOutlined style={{ color: 'red' }} />
                        }
                        placement="bottom"
                        okText="Ja"
                        cancelText="Nein"
                        onConfirm={() => resetAllTables()}
                    >
                        <Button danger>Tische zurücksetzen</Button>
                    </Popconfirm>
                    {holdTables.length > 0 && (
                        <Badge count={holdTables.length}>
                            <Button onClick={showDrawer} className="btn-orange">
                                Offene Rechnungen
                            </Button>
                        </Badge>
                    )}
                </Space>
            </Container>
        )
    }

    //View for the alert
    const alertMessage = () => {
        return (
            <Typography.Text level={2}>
                Besetzte Tische: <strong>{activeTables}</strong>
            </Typography.Text>
        )
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col sm={24} md={24}>
                        <Alert
                            message={alertMessage()}
                            type={'info'}
                            showIcon
                            style={{
                                margin: '20px',
                            }}
                            action={actionMessage()}
                        ></Alert>
                    </Col>
                </Row>
            </Container>

            <Drawer
                title="Offene Rechnungen"
                placement={'top'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'right'}
                height={'46%'}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={holdTables}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                !showSharedBill ? (
                                    <SharedBillButton
                                        setHoldTableClicked={
                                            setHoldTableClicked
                                        }
                                        number={item.tableNumber}
                                        setShowSharedBill={setShowSharedBill(
                                            true
                                        )}
                                        icon={faPeopleGroup}
                                    />
                                ) : holdTableClicked === item.tableNumber ? (
                                    <div className="d-flex flex-row justify-content-center align-items-center">
                                        <InputNumber
                                            onStep={handleChangeInput}
                                            prefix={
                                                <FontAwesomeIcon
                                                    icon={faPeopleGroup}
                                                    className="mx-2"
                                                />
                                            }
                                            controls="true"
                                            min={2}
                                            defaultValue={2}
                                        />{' '}
                                        <div>
                                            <Tag
                                                color="blue"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '5px',
                                                }}
                                            >
                                                €
                                                {(
                                                    item.toPay / sharedBill
                                                ).toFixed(2)}{' '}
                                            </Tag>{' '}
                                        </div>{' '}
                                    </div>
                                ) : (
                                    <SharedBillButton
                                        setHoldTableClicked={
                                            setHoldTableClicked
                                        }
                                        number={item.tableNumber}
                                        setShowSharedBill={setShowSharedBill(
                                            true
                                        )}
                                        icon={faPeopleGroup}
                                    />
                                ),

                                <Popconfirm
                                    title="Wurde die Tischrechnung bezahlt?"
                                    placement={'left'}
                                    onConfirm={() =>
                                        closeHoldTable(item.tableNumber)
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                    >
                                        Close
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={require(`../assets/img/${item.tableNumber}ball.png`)}
                                    />
                                }
                                title={
                                    <>
                                        <div className="mx-3 d-flex justify-content-start align-items-center fw-semibold">
                                            Tisch {item.tableNumber}
                                            <Divider type="vertical">€</Divider>
                                            <div className="text-primary fw-bold">
                                                € {item.toPay}
                                            </div>
                                        </div>
                                        <Space className="my-2 d-flex justify-content-start align-items-center">
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faHourglass}
                                                    style={{
                                                        fontSize: '14px',
                                                        color: 'darkorange',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.start} : {item.end}
                                            </div>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faStopwatch}
                                                    style={{
                                                        color: 'purple',
                                                        fontSize: '16px',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.played}
                                            </div>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faPercent}
                                                    style={{
                                                        color: 'green',
                                                        fontSize: '16px',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.discount ? 'Ja' : 'Nein'}
                                            </div>
                                        </Space>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    )
}

export default TimerHeader
