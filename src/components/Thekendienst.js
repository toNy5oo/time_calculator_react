import React, { useEffect, useState } from 'react'
import 'moment/locale/en-gb'
import locale from 'antd/es/date-picker/locale/en_GB'
import {
    Alert,
    Calendar,
    Input,
    Modal,
    Space,
    Segmented,
    notification,
    Avatar,
    List,
    Skeleton,
    Typography,
    Divider,
} from 'antd'
import './assets/css/thekendienst.css'
import {
    StopOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    SmileOutlined,
    UserOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import { Container } from 'react-bootstrap/'
import ListItem from './ListItem'
import moment from 'moment'
import LocaleProvider from 'antd/lib/locale-provider'
import { locales } from 'moment'
import SimpleButton from './SimpleButton'

function Thekendienst() {
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [value, setValue] = useState(() => moment())
    const [selectedValue, setSelectedValue] = useState(() =>
        moment().format('DD/MM/YYYY')
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [calendarData, setCalendarData] = useState([])
    const [alertType, setAlertType] = useState(['info'])
    const [userIsMandatory, setUserIsMandatory] = useState('')
    const [width, setWindowWidth] = useState(0)

    const openNotification = (name, date) => {
        notification.open({
            message: 'Schicht hinzugefügt',
            description: (
                <>
                    <strong>{name}</strong> wird an dem <strong>{date}</strong>{' '}
                    an der Bar arbeiten'
                </>
            ),
            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
        })
    }

    useEffect(() => {
        updateDimensions()

        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)
    }

    useEffect(() => {
        setLoading(true)

        fetch(
            `https://server-theklendienst.onrender.com/api_calendar?date=${selectedValue}`
        )
            // fetch(`http://localhost:5000/api_calendar/?date=${selectedValue}`)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setCalendarData(data)
                console.log('List: ', calendarData)
            })
            .catch((error) => {
                setError(true)
                console.log('Error fetching data ,', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const showModal = () => {
        calendarData.map((el) => {
            if (el.date === selectedValue) {
                setUser(el.name)
            }
        })
        setIsModalOpen(true)
    }

    /*
     * Post to change or update the user that works a specific shift
     */
    const handleOk = () => {
        if (user !== '') {
            let month = moment(selectedValue, 'DD/MM/YYYY')
                .format('MMMM')
                .toLowerCase()
            const year = moment(selectedValue, 'DD/MM/YYYY')
                .format('YYYY')
                .toLowerCase()
            let newShift = { date: selectedValue, name: user }

            fetch(
                `https://server-theklendienst.onrender.com/api_calendar?month=${month.toLowerCase()}&year=${year.toLowerCase()}`,
                // `http://localhost:5000/api_calendar/?month=${month.toLowerCase()}&year=${year.toLowerCase()}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newShift),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response
                })
                .then((data) => {
                    setCalendarData(data)
                    console.log(data)
                    console.log('List: ', calendarData)
                })
                .catch((error) => {
                    setError(true)
                    console.log('Error fetching data ,', error)
                })
                .finally(() => {
                    setLoading(false)
                    setIsModalOpen(false)
                    openNotification(user, selectedValue)
                })
        } else {
            setUserIsMandatory('warning')
        }
    }

    //Calendar method
    const dateCellRender = (value) => {
        const style = {
            textAlign: 'center',
            marginBottom: 10,
            fontSize: 20,
            color: 'Green',
        }

        //If Monday or Tuesday
        if (moment(value).day() === 1 || moment(value).day() === 2) {
            return (
                <div style={style}>
                    <StopOutlined style={{ color: 'Crimson' }} />
                </div>
            )
        }

        return calendarData.map(
            (item) =>
                item.date === value.format('DD/MM/YYYY') && getName(item, style)
        )
    }

    function getName(item, style) {
        console.log('Item: ' + item)
        return item.name !== 'N/A' ? (
            <div key={item.date} style={style}>
                <Avatar
                    gap={5}
                    size={{
                        md: 42,
                        lg: 42,
                        xl: 46,
                        xxl: 46,
                    }}
                    style={{
                        backgroundColor: ' skyblue ',
                        color: 'black',
                        textTransform: 'uppercase',
                    }}
                >
                    {item.name}
                </Avatar>
            </div>
        ) : (
            <div style={style}>
                <PlusCircleOutlined
                    style={{ fontSize: 20, color: 'DarkOrange' }}
                />
            </div>
        )
    }

    //Modal method
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    //Modal change event
    const inputOnChange = (newValue) => {
        setUser(newValue.target.value)
    }

    const onSelect = (newValue) => {
        setValue(newValue)
        setSelectedValue(moment(newValue).format('DD/MM/YYYY'))
    }

    const onPanelChange = (newValue) => {
        setValue(newValue)
    }

    function alertMessage() {
        return calendarData.map((el) => {
            if (el.date === selectedValue) {
                el.name !== 'N/A'
                    ? setAlertType('info')
                    : setAlertType('warning')
                return el.name !== 'N/A' ? (
                    <>
                        Datum: <strong>{selectedValue}</strong> Thekendienst:{' '}
                        <strong>{el.name}</strong>
                    </>
                ) : (
                    <>
                        Datum: <strong>{selectedValue}</strong> Keine mitglieder
                        am Thekendienst
                    </>
                )
            }
        })
    }

    const renderListItem = (item) => {
        return (
            <>
                <ListItem
                    date={item.date}
                    name={item.name}
                    showModal={showModal}
                />
            </>
        )
    }

    const headerRender = ({ value, type, onChange, onTypeChange }) => {
        return (
            <>
                <div className="m-4 d-flex justify-content-around align-items-center">
                    <Alert
                        message={alertMessage()}
                        type={alertType}
                        showIcon
                        style={{
                            marginBottom: '10px',
                            marginTop: '20px',
                            width: '100%',
                        }}
                        action={
                            <Space>
                                {calendarData.map((el) => {
                                    if (el.date === selectedValue) {
                                        return el.name !== 'N/A' ? (
                                            <SimpleButton
                                                type="primary"
                                                text="Change"
                                                onClick={showModal}
                                                icon={<TeamOutlined />}
                                                style={{}}
                                            />
                                        ) : (
                                            <SimpleButton
                                                type="danger"
                                                text="Add"
                                                onClick={showModal}
                                                icon={<PlusOutlined />}
                                            />
                                        )
                                    }
                                })}
                            </Space>
                        }
                    />
                </div>
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 30,
                        fontSize: 14,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <StopOutlined style={{ color: 'crimson' }} />
                        <div>Verein zu</div>
                    </div>
                    <div>
                        <PlusCircleOutlined style={{ color: 'DarkOrange' }} />
                        <div>Unbelegt</div>
                    </div>
                    <div>
                        <CheckCircleOutlined style={{ color: 'Green' }} />
                        <div>Schön gebucht</div>
                    </div>
                </div>
                <div className="m-4 d-flex justify-content-center align-items-center gap-2">
                    <Segmented
                        defaultValue={moment(value, 'DD/MM/YYYY').format(
                            'MMMM'
                        )}
                        options={[
                            moment(value, 'DD/MM/YYYY').format('MMMM'),
                            // 'Next Month',
                        ]}
                    />
                </div>
            </>
        )
    }
    return (
        <>
            <Container className="p-3">
                <LocaleProvider locale={locales.en_GB}>
                    {width < 768 ? (
                        <List
                            style={{
                                backgroundColor: 'whitesmoke',
                                padding: '10px',
                                width: '100%',
                            }}
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={calendarData}
                            renderItem={renderListItem}
                            header={
                                <Typography.Text className="fw-bold text-uppercase">
                                    {moment(value, 'DD/MM/YYYY').format('MMMM')}
                                </Typography.Text>
                            }
                        />
                    ) : (
                        <Calendar
                            value={value}
                            onSelect={onSelect}
                            onPanelChange={onPanelChange}
                            headerRender={headerRender}
                            dateCellRender={dateCellRender}
                            locale={locale}
                            defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                        />
                    )}
                </LocaleProvider>
            </Container>
            <Modal
                title="Add to Calendar"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={350}
                style={{ textAlign: 'center' }}
                focusTriggerAfterClose={true}
            >
                <Space direction="vertical">
                    <p>Tag:</p>
                    <p>
                        <Alert
                            message={selectedValue}
                            type="info"
                            style={{
                                minWidth: '60%',
                                margin: '0px auto',
                                marginBottom: '0px',
                            }}
                        />
                    </p>
                    <p>Name:</p>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Mitglieders Name"
                        onChange={inputOnChange}
                        value={user !== 'N/A' ? user : ''}
                        status={userIsMandatory}
                    />
                </Space>
            </Modal>
        </>
    )
}

export default Thekendienst
