const { DateTime } = require("luxon");

// Returns a two extremes of the current week as an array of date formatted strings
const thisWeek = () => {
	const now = DateTime.now();
	// substring ensures that only the date part of the DateTime object gets returned, we don't really care for the times
	return [now.startOf("week").toString().substring(0, 10), now.endOf("week").toString().substring(0, 10)];
}

module.exports = {
	thisWeek
}