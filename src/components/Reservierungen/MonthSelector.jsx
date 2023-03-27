import React from 'react'
import { Segmented } from 'antd'
import moment from 'moment'

const MonthSelector = ({ value, changeMonthView, segmentedMonth }) => {
    return (
        <Segmented
            onChange={changeMonthView}
            defaultValue={moment(value).format('MMMM')}
            block={false}
            size={'large'}
            options={[
                segmentedMonth,
                moment()
                    .add(1, 'month')
                    .format('MMMM'),
                    moment()
                    .add(2, 'month')
                    .format('MMMM'),
            ]}
        />
    )
}

export default MonthSelector