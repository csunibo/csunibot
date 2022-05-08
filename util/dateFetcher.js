const { DateTime } = require("luxon");

// Returns a two extremes of the current week as an array of date formatted strings
const thisWeek = () => {
	const now = DateTime.now();
	// substring ensures that only the date part of the DateTime object gets returned, we don't really care for the times
	return [now.startOf("week").toString().substring(0, 10), now.endOf("week").plus({ days: 1 }).toString().substring(0, 10)];
}	// The `.plus({ days: 1 })` ensures that you can get dates into the coming week as well (if it's sunday for example)

module.exports = {
	thisWeek
}