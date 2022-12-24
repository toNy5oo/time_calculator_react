import React, { useEffect } from 'react'
import { Empty } from 'antd'
import moment from 'moment';

function Reservierungen() {
    useEffect(() => {
		let dateStr = "2017-03-13",
			timeStr = "23:50",
			date = moment(dateStr),
			time = moment(timeStr, "HH:mm");

            let dateStr2 = "2017-03-14",
			timeStr2 = "00:10",
			date2 = moment(dateStr2),
			time2 = moment(timeStr2, "HH:mm");

		date.set({
			hour: time.get("hour"),
			minute: time.get("minute"),
			second: time.get("second"),
		});

        date2.set({
			hour: time2.get("hour"),
			minute: time2.get("minute"),
			second: time2.get("second"),
		});

		console.log(date);
        console.log(date2);
		console.log(((date2.diff(date)/1000))/60+"min");

	}, []);
    return <Empty image = { Empty.PRESENTED_IMAGE_SIMPLE }
    />
}

export default Reservierungen