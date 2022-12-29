import moment from "moment";

export const options = [
	{
		value: "0",
		label: "heute",
	},
	{
		value: "3",
		label: "3 Tage",
	},
	{
		value: "7",
		label: "7 Tage",
	},
	{
		value: "30",
		label: "30 Tage",
	},
];

export const disabledDateTime = () => ({
	disabledHours: () => range(0, 24).splice(0, 18),
});

export const disabledDate = (current) => {
	// Can not select days before today
	return current && current < moment().subtract(1, "day").endOf("day");
};

const range = (start, end) => {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
};



export const parseDate = (date, time) => {
	const dateTime = moment(date + " " + time, "DD/MM/YYYY HH:mm");
	return moment(dateTime);
};
