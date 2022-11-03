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
} from '@ant-design/icons'

const ListItem = ({ date, name, showModal }) => {
    const [isClosed, setIsClosed] = useState(
        moment(date, 'DD/MM/YYYY').day() === 1 ||
            moment(date, 'DD/MM/YYYY').day() === 2
    )

    return (
        <div>
            <Typography.Paragraph className="mx-1">
                <CalendarOutlined className="mx-2" />
                <Typography.Text className="mx-2">
                    <strong>
                        {moment(date, 'DD/MM/YYYY').format('dddd')}{' '}
                    </strong>
                </Typography.Text>
                {moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
            </Typography.Paragraph>

            <Space align="center">
                <List.Item
                    style={{
                        verticalAlign: 'middle',
                    }}
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
                    <Typography.Paragraph className="mx-1">
                        {!isClosed ? (
                            <>
                                <UserOutlined className="mx-2" />
                                <Typography.Text className="mx-2">
                                    <strong>{name}</strong>
                                </Typography.Text>
                            </>
                        ) : (
                            <>
                                <UserOutlined className="mx-2" />
                                <CloseCircleOutlined
                                    style={{
                                        fontSize: '18px',
                                        color: 'fireBrick',
                                    }}
                                    className="mx-2"
                                />
                            </>
                        )}
                    </Typography.Paragraph>
                    <Space
                        direction="vertical"
                        align="center"
                        style={{ marginLeft: '10px' }}
                    ></Space>
                </List.Item>
            </Space>
        </div>
    )
}

export default ListItem
