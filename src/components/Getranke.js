import React, { useEffect, useState } from 'react'
import {
    Alert,
    Avatar,
    Button,
    Col,
    Dropdown,
    Empty,
    List,
    Menu,
    Popconfirm,
    Row,
    Skeleton,
    Space,
    Typography,
} from 'antd'
import {
    QuestionCircleOutlined,
    PlusCircleFilled,
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import { DRINKS as drinklist } from './assets/data/drinkList'
import DrinksButtons from './DrinksButtons'
import { Container } from 'react-bootstrap/'

function Getranke() {
    const [users, setUsers] = useState([
        {
            key: 1,
            name: 'Toni',
            amount: 32,
            description: [{ label: 'augustiner', num: 2, price: 2.7 }],
        },
        {
            key: 2,
            name: 'Tom',
            amount: 42,
            description: [
                { label: 'keller', num: 1, price: 2.7 },
                { label: 'augustiner', num: 2, price: 2.7 },
            ],
        },
        {
            key: 3,
            name: 'Flo',
            amount: 29,
            description: [
                { label: 'keller', num: 1, price: 2.7 },
                { label: 'augustiner', num: 2, price: 2.8 },
            ],
        },
        {
            key: 4,
            name: 'Fredo',
            amount: 32,
            description: [
                { label: 'keller', num: 1, price: 2.7 },
                { label: 'augustiner', num: 2, price: 2.7 },
            ],
        },
    ])
    const [isAdd, setIsAdd] = useState(false)
    const [userSelected, setUserSelected] = useState(0)
    const [addToUser, setAddToUser] = useState([])

    useEffect(() => {
        console.log('Users ', users)
        console.log('To add ', addToUser)
    })

    //View for the alert
    const alertMessage = () => {
        return (
            <Typography.Text level={2}>
                Adding to the user: {addToUser.map((e) => '1 ' + e.label + ' ')}
            </Typography.Text>
        )
    }

    const setRowDetails = (key) => {
        setUserSelected(key)
        setIsAdd(true)
    }

    const resetRowDetails = () => {
        setIsAdd(false)
        setUserSelected()
    }

    const userDrinkList = (key) => {
        return users.map((user) => {
            if (user.key === key) {
                return user.description.map((e) => e.num + ' ' + e.label + '; ')
            }
        })
    }

    const calculateAmountToPay = (drinks) => {
        let amountToPay = 0
        drinks.map((e) => (amountToPay += e.num ? e.num : 1 * e.price))
        return amountToPay.toFixed(2) + ' €'
    }

    const addDrinksToUser = () => {
        users.map((user) => {
            if (user.key === userSelected) {
                const objToAdd = addToUser.map((e) => ({
                    label: e.label,
                    num: 1,
                    price: 2.7,
                }))
                const desc = [...user.description, ...objToAdd]
                console.log(desc)
                setUsers((prevState) => [
                    ...prevState,
                    { user, description: desc },
                ])
                return user
            }
        })
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
                            action={
                                <>
                                    {' '}
                                    <Space>
                                        {calculateAmountToPay(addToUser)}{' '}
                                        {calculateAmountToPay(addToUser) !==
                                            0 && (
                                            <Button onClick={addDrinksToUser}>
                                                <CheckOutlined />
                                            </Button>
                                        )}
                                    </Space>
                                </>
                            }
                        ></Alert>
                    </Col>
                </Row>
            </Container>
            {/* List */}
            <Container>
                <List
                    className="demo-loadmore-list"
                    // loading={initLoading}
                    itemLayout="horizontal"
                    dataSource={users}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                isAdd && item.key === userSelected ? (
                                    <DrinksButtons
                                        resetRowDetails={resetRowDetails}
                                        setAddToUser={setAddToUser}
                                        addToUser={addToUser}
                                        addDrinksToUser={addDrinksToUser}
                                    />
                                ) : (
                                    <>
                                        <Space>
                                            <Button
                                                onClick={() =>
                                                    setRowDetails(item.key)
                                                }
                                            >
                                                Add
                                            </Button>
                                            <Button>Delete</Button>
                                        </Space>
                                    </>
                                ),
                            ]}
                        >
                            <Skeleton
                                avatar
                                title={false}
                                loading={item.loading}
                                active
                            >
                                <List.Item.Meta
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setUserSelected(item.key)}
                                    avatar={
                                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                                    }
                                    title={
                                        <a href="https://ant.design">
                                            {item.name}
                                        </a>
                                    }
                                    description={userDrinkList(item.key)}
                                />
                                <div>
                                    {
                                        userSelected !== item.key &&
                                            calculateAmountToPay(
                                                item.description
                                            )
                                        // item.amount.toFixed(2) + ' €'
                                    }
                                </div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Container>
        </>
    )
}
// return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
export default Getranke
