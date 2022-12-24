import moment from "moment";
import React, { useEffect } from "react";

const Reservierungen = () => {
	useEffect(() => {
		let dateStr = "2017-03-13",
			timeStr = "18:00",
			date = moment(dateStr),
			time = moment(timeStr, "HH:mm");

		date.set({
			hour: time.get("hour"),
			minute: time.get("minute"),
			second: time.get("second"),
		});

		console.log(date);
	}, []);

	return <div>Reservierungen!</div>;
};

export default Reservierungen;
