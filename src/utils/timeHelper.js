import dayjs from "dayjs";

/** The initial minutes need to be a multiplier of 5
 * The function calculates the closest interval to the actual time and returns
 * a dayjs object with that minutes set.
 */
export const calculateInitalTime = () => {
	const now = dayjs();
	const minutes = dayjs().minute();
	console.log("Minutes =>", minutes);
	const mutiplier = parseInt(minutes / 5);
	console.log("Multiplier =>", mutiplier);
	now.minute(now.minute() - mutiplier);
	console.log(dayjs(now, "HH:mm"));
	return dayjs(dayjs().minute(5 * mutiplier), "HH:mm");
	// return now.format("DD/MM/YYYY HH:mm");
};

/** Calculate time played in seconds and rounds up the number divided by 60 */
export const timePlayed = (start, end) => {
	let startTime = dayjs(start, "DD-MM-YYYY hh:mm");
	let endTime = dayjs(end, "DD-MM-YYYY hh:mm");

	let minutesDiff = Math.floor(endTime.diff(startTime, "minute", true));
	console.log("Diff => ", minutesDiff);
	console.log("Diff => ", Math.round(minutesDiff));
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
