import React from 'react'
import { Space, Spin, Typography } from 'antd'

const ListLoading = () => {
    return (
        <div className="example text-center m-5">
            <Space direction="vertical" align="center">
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Loading data...
                </Typography.Title>
                <Spin className="m-3" />
            </Space>
        </div>
    )
}

export default ListLoading
