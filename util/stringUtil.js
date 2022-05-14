
/**
 * Determines the Levenshtein distance between two given strings
 * @param {string} string 
 * @param {string} string
 * @returns {number}
 */
const levDistance = (S = '', T = '') => {
	let i, j;
	const n = S.length, m = T.length;
	let L = Array(n+1).fill().map(() => Array(m+1).fill());
	for (i=0; i < n+1; i++) {
		for (j=0; j < m+1; j++) {
			if (i == 0 || j == 0) {
				L[i][j] = Math.max(i, j);
			} else {
				L[i][j] = Math.min(L[i-1][j] + 1, L[i][j-1] + 1, L[i-1][j-1] + (S.charAt(i-1) != T.charAt(j-1) ? 1 : 0));
			}
		}
	}
	return L[n][m];
}

/**
* get's the `index` occurence of the `subString` in a `string`
* @param {string} string String in which to find the `n'th`character
* @param {string} subString the character to search the index of
* @param {number} index the occurence of the chracter which you would like to search for default is `1`
* @returns {number}
* if the `subString` is not found then it returns the length of the string
*/
function getPosition(string, subString, index = 1) {
	return string.toString().split(subString, index).join(subString).length;
}

module.exports = {
	getPosition,
	levDistance
}