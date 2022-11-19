import {
    Alert,
    Avatar,
    Button,
    Col,
    Dropdown,
    Container,
    Empty,
    List,
    Menu,
    Popconfirm,
    Row,
    Skeleton,
    Space,
    Typography,
} from 'antd'
import React from 'react'
import {
    QuestionCircleOutlined,
    PlusCircleFilled,
    CloseOutlined,
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
// import { beers, spirits, softs, extras, prices } from './assets/data/drinkList'
import { DRINKS as drinklist } from './assets/data/drinkList'

const DrinksButtons = ({
    resetRowDetails,
    setAddToUser,
    addToUser,
    addDrinksToUser,
}) => {
    //Menu
    const menu = (items) => (
        <Menu
            items={items}
            onClick={(e) => {
                const drink = drinklist.filter((d) => d.key === e.key)
                setAddToUser((prevState) => [...prevState, ...drink])
            }}
        />
    )

    return (
        <Space>
            <Button onClick={resetRowDetails}>
                <CloseOutlined />
            </Button>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 1 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <Button icon={<PlusCircleFilled />} placement="bottom">
                        Biere
                    </Button>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 2 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <Button
                        // type="primary"
                        icon={<PlusCircleFilled />}
                        placement="bottom"
                    >
                        Soft
                    </Button>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 3 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <Button
                        // type="primary"
                        icon={<PlusCircleFilled />}
                        placement="bottom"
                    >
                        Spirit
                    </Button>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 4 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <Button
                        // type="primary"
                        icon={<PlusCircleFilled />}
                        placement="bottom"
                    >
                        Extra
                    </Button>
                </a>
            </Dropdown>
        </Space>
    )
}

export default DrinksButtons
