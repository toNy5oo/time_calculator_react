import React, { useState, useEffect } from 'react'
import {
    QuestionCircleOutlined,
    PlusOutlined,
    PlusCircleFilled,
    CheckOutlined,
    ExclamationCircleOutlined,
    HourglassOutlined,
    EuroOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons'
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

function TimerHeader({
    tables,
    openTable,
    resetAllTables,
    activeTables,
    holdTables,
    closeHoldTable,
}) {
    const [holdTableClicked, setHoldTableClicked] = useState({})
    const [isHoldModalOpen, setIsHoldModalOpen] = useState(false)
    const [sharedBill, setSharedBill] = useState('2')
    const [open, setOpen] = useState(false)

    //Drawer visibility methods
    const showDrawer = () => {
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    const confirm = () => {
        Modal.destroyAll()
        Modal.confirm({
            title: 'Confirm close table',
            icon: <ExclamationCircleOutlined />,
            content: 'Bla bla ...',
            okText: 'Close',
            cancelText: 'Back',
            onOk: closeModals,
        })
    }

    function closeModals() {
        onClose()
        closeHoldTable(holdTableClicked.tableNumber)
    }

    function handleChangeInput(val) {
        setSharedBill(val)
    }

    const handleHoldOk = () => {
        setIsHoldModalOpen(false)
    }
    const handleHoldCancel = () => {
        setIsHoldModalOpen(false)
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
                    src={require(`./assets/img/${num}ball.png`)}
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
                    <Navbar.Brand>
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
                    </Navbar.Brand>
                    <Navbar.Brand></Navbar.Brand>
                    <Navbar.Brand>
                        <Popconfirm
                            title="Bist du sicher, dass du alle Tische zurücksetzen möchtest?"
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
                            <Button danger>Tische zurücksetzen</Button>
                        </Popconfirm>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <Badge count={holdTables.length}>
                            <Button onClick={showDrawer} className="btn-orange">
                                Offene Rechnungen
                            </Button>
                        </Badge>
                    </Navbar.Brand>
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
            <Modal
                title={`Geteilte Rechnung | Tisch ${holdTableClicked.tableNumber} - ${holdTableClicked.toPay}`}
                open={isHoldModalOpen}
                onOk={handleHoldOk}
                onCancel={handleHoldCancel}
                footer={[
                    <Button
                        key="click"
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={confirm}
                    >
                        Close table
                    </Button>,
                ]}
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
                            €{(holdTableClicked.toPay / sharedBill).toFixed(2)}{' '}
                        </Tag>{' '}
                    </div>{' '}
                </div>{' '}
            </Modal>{' '}
            <Drawer
                title="Offene Rechnungen"
                placement={'right'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'right'}
                width={window.innerWidth < 1024 ? '70%' : '35%'}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={holdTables}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    title="Wurde die Tischrechnung bezahlt?"
                                    placement={'left'}
                                    onConfirm={() =>
                                        closeHoldTable(item.tableNumber)
                                    }
                                    // onCancel={cancel}
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
                                        src={require(`./assets/img/${item.tableNumber}ball.png`)}
                                    />
                                }
                                title={
                                    <div className="mx-3 d-flex justify-content-between align-items-center">
                                        Tisch {item.tableNumber}
                                        {<strong>€ {item.toPay}</strong>}
                                    </div>
                                }
                                description={
                                    <>
                                        <Space className="my-2 d-flex justify-content-start align-items-center">
                                            <div>
                                                <HourglassOutlined
                                                    style={{
                                                        color: 'darkorange',
                                                        fontSize: '16px',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.start} : {item.end}
                                            </div>
                                            <div>
                                                <ClockCircleOutlined
                                                    style={{
                                                        color: 'purple',
                                                        fontSize: '16px',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.played}
                                            </div>
                                            <div>
                                                <EuroOutlined
                                                    style={{
                                                        color: 'green',
                                                        fontSize: '16px',
                                                    }}
                                                    className="mx-2"
                                                />
                                                {item.toPay}
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
