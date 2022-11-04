import React from 'react'
import moment from 'moment/moment'
import { Segmented } from 'antd'

const MonthSelector = ({ value, changeMonthView, segmentedMonth }) => {
    return (
        <Segmented
            onChange={changeMonthView}
            defaultValue={moment(value, 'DD/MM/YYYY').format('MMMM')}
            block={false}
            size={'large'}
            options={[
                segmentedMonth,
                moment(moment(segmentedMonth, 'MMMM'), 'DD/MM/YYYY')
                    .add(1, 'month')
                    .format('MMMM'),
            ]}
        />
    )
}

export default MonthSelector
