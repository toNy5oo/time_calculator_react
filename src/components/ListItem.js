import { Avatar, Divider, List, Space, Typography } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import SimpleButton from './SimpleButton'
import {
    PlusOutlined,
    TeamOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    QuestionOutlined,
} from '@ant-design/icons'

const ListItem = ({ date, name, showModal }) => {
    const [isClosed, setIsClosed] = useState(
        moment(date, 'DD/MM/YYYY').day() === 1 ||
            moment(date, 'DD/MM/YYYY').day() === 2
    )

    return (
        <div>
            <Divider style={{ color: '#006699' }}>
                <CalendarOutlined className="mx-2" />
                {moment(date, 'DD/MM/YYYY').format('dddd')},{' '}
                <strong>
                    {moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                </strong>
            </Divider>
            <List.Item
                actions={[
                    !isClosed &&
                        (name !== 'N/A' ? (
                            <SimpleButton
                                type="primary"
                                text="Change"
                                onClick={showModal}
                                icon={<TeamOutlined />}
                                size="small"
                            />
                        ) : (
                            <SimpleButton
                                size="small"
                                type="danger"
                                text="Add"
                                onClick={showModal}
                                icon={<PlusOutlined />}
                            />
                        )),
                ]}
            >
                <Space align="center">
                    {!isClosed ? (
                        <>
                            <Avatar
                                size={40}
                                style={{
                                    backgroundColor:
                                        name !== 'N/A' ? 'skyblue' : 'orange',
                                    color: 'black',
                                }}
                            >
                                {name !== 'N/A' ? (
                                    <UserOutlined />
                                ) : (
                                    <QuestionOutlined />
                                )}
                            </Avatar>
                        </>
                    ) : (
                        <Avatar
                            size={40}
                            style={{
                                backgroundColor: '#339900 ',
                                color: 'black',
                            }}
                        >
                            <CloseCircleOutlined
                                style={{ fontSize: 'px', color: 'white' }}
                            />
                        </Avatar>
                    )}
                    <Typography.Text
                        strong={true}
                        style={{
                            color: 'DimGray',
                            fontSize: 'min(18px)',
                            marginLeft: '10px',
                        }}
                    >
                        {!isClosed
                            ? name !== 'N/A'
                                ? name
                                : 'Unbelegt'
                            : 'Poolcity ist Zu'}
                    </Typography.Text>
                    {/* <Space
                        direction="vertical"
                        align="center"
                        style={{ marginLeft: '10px' }}
                    >
                        <Typography.Text
                            strong={true}
                            style={{
                                color: 'black',
                                fontSize: 'min(14px)',
                            }}
                        >
                            {moment(date, 'DD/MM/YYYY').format('dddd')}
                        </Typography.Text>
                        <Typography.Text
                            strong={true}
                            style={{
                                color: '#696969',
                                fontSize: 'min(14px)',
                            }}
                        >
                            {moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                        </Typography.Text>
                    </Space> */}
                </Space>
            </List.Item>
        </div>
    )
}

export default ListItem
