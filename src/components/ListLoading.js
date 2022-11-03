import React from 'react'
import { Space, Spin, Typography } from 'antd'

const ListLoading = () => {
    return (
        <div className="example">
            <Space direction="vertical" align="center">
                <Typography.Text>Loading</Typography.Text>
                <Spin />
            </Space>
        </div>
    )
}

export default ListLoading
