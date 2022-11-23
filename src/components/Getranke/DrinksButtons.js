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
    faBeerMugEmpty,
    faPizzaSlice,
    faGlassWater,
    faMartiniGlass,
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import {
    QuestionCircleOutlined,
    PlusCircleFilled,
    PlusOutlined,
    CloseOutlined,
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons'
// import { beers, spirits, softs, extras, prices } from './assets/data/drinkList'
import { DRINKS as drinklist } from '../assets/data/drinkList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropdownButton from './DropdownButton'

const DrinksButtons = ({
    userSelected,
    resetRowDetails,
    setAddToUser,
    addToUser,
    addDrinksToUser,
    showNotification
}) => {
    //Menu
    const menu = (items) => (
        <Menu
            items={items}
            onClick={(e) => {
                const drink = drinklist.filter((d) => d.key === e.key)
                //Add the standard amount of drinks = 1
                drink[0].amount = 1
                //Add the ID of the selected user
                drink[0].uid = userSelected;
                //Add to the list of drinks to add to the current selected User
                addToUser.findIndex(d => d.key === drink[0].key) === -1 
                ? (setAddToUser((prevState) => [...prevState, ...drink]))
                : showNotification('Drink already added', drink[0].label + ' is already present in the list of drinks to add.')
            }}
        />
    )

    return (
        <Space>
            <a onClick={resetRowDetails} style={{color: 'red', marginRight: '10px'}}>
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </a>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 1 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                <DropdownButton icon={faBeerMugEmpty}></DropdownButton>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 2 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                    <DropdownButton icon={faGlassWater}></DropdownButton>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 3 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                <DropdownButton icon={faMartiniGlass}></DropdownButton>
                </a>
            </Dropdown>
            <Dropdown overlay={menu(drinklist.map((d) => d.cat === 4 && d))}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                <DropdownButton icon={faPizzaSlice}></DropdownButton>
                </a>
            </Dropdown>
            
        </Space>
    )
}

export default DrinksButtons
