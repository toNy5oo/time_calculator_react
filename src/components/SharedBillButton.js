import React from 'react'
import { Button, Space } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SharedBillButton = ({
    number,
    icon,
    setHoldTableClicked,
    setShowSharedBill,
}) => {
    return (
        <Button
            type="outline"
            onClick={() => {
                setHoldTableClicked(number)
                setShowSharedBill(true)
            }}
        >
            <Space>
                <FontAwesomeIcon icon={icon} />
                Rechnung Teilen
            </Space>
        </Button>
    )
}

export default SharedBillButton
