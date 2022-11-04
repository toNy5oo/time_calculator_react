import { Button } from 'antd'
import React from 'react'

function SimpleButton({ text, onClick, type, icon, style, date }) {
    return (
        <Button
            size="default"
            type={type}
            onClick={onClick}
            icon={icon}
            style={style}
            key={date}
        >
            {' '}
            {text}{' '}
        </Button>
    )
}

export default SimpleButton
