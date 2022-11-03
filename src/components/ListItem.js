import { Avatar, List, Space, Typography } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import SimpleButton from './SimpleButton'
import {
    PlusOutlined,
    TeamOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    UserOutlined,
} from '@ant-design/icons'

const ListItem = ({ date, name, showModal }) => {
    const [isClosed, setIsClosed] = useState(
        moment(date, 'DD/MM/YYYY').day() === 1 ||
            moment(date, 'DD/MM/YYYY').day() === 2
    )

    return (
        <div>
            <List.Item
                actions={[
                    !isClosed ? (
                        name !== 'N/A' ? (
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
                        )
                    ) : (
                        <Typography.Text
                            strong={true}
                            style={{
                                color: 'FireBrick',
                                fontSize: 'min(14px)',
                            }}
                        >
                            {/* Poolcity ist zu */}
                        </Typography.Text>
                    ),
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
                                {name}
                            </Avatar>
                        </>
                    ) : (
                        <CloseCircleOutlined
                            style={{ fontSize: '40px', color: 'fireBrick' }}
                        />
                    )}

                    <Space
                        direction="vertical"
                        align="center"
                        style={{ marginLeft: '10px' }}
                    >
                        {/* <CalendarOutlined /> */}
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
                    </Space>
                </Space>
            </List.Item>
        </div>
    )
}

export default ListItem
