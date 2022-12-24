import moment from "moment";

/** The initial minutes need to be a multiplier of 5
 * The function calculates the closest interval to the actual time and returns
 * a moment object with that minutes set.
 */
export const calculateInitalTime = () => {
	const now = moment();
	const minutes = moment().minutes();
	const multiplier = parseInt(minutes / 5);
	now.minutes(5 * multiplier);
	return now;
};

/** Calculate time played in seconds and rounds up the number divided by 60 */
export const timePlayed = (start, end) => {
	let startTime = moment(start, "DD-MM-YYYY hh:mm");
	let endTime = moment(end, "DD-MM-YYYY hh:mm");

	let minutesDiff = Math.ceil(endTime.diff(startTime, "minutes", true));
	console.log("Diff => ", minutesDiff);
	console.log("Diff => ", Math.round(minutesDiff));
	console.log("Duration: ", moment.duration(2, "minutes"));
	return minutesDiff;
};

/**
 * Round to lowest number both hours and minutes and set them to 2 digits each
 * @param {number} minutesPlayed
 * @returns
 */
export function parseTime(minutesPlayed) {
	let hours = Math.floor(minutesPlayed / 60).toLocaleString("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});
	let minutes = Math.ceil(minutesPlayed % 60).toLocaleString("en-US", {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});
	return `${hours}h : ${minutes}m`;
}

export const isNotZero = (time) => time !== 0;
