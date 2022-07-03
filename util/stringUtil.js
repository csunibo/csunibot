/*
Example Levenshtein matrix
			[j]	""	A	L	B	E	R	O > T
	┌─────────┬───┬───┬───┬───┬───┬───┬───┐
 S	│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │
 \/	├─────────┼───┼───┼───┼───┼───┼───┼───┤
 ""	│    0    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │
 L	│    1    │ 1 │ 1 │ 1 │ 2 │ 3 │ 4 │ 5 │
 I	│    2    │ 2 │ 2 │ 2 │ 2 │ 3 │ 4 │ 5 │
 B	│    3    │ 3 │ 3 │ 3 │ 2 │ 3 │ 4 │ 5 │
 R	│    4    │ 4 │ 4 │ 4 │ 3 │ 3 │ 3 │ 4 │
 O	│    5    │ 5 │ 5 │ 5 │ 4 │ 4 │ 4 │ 3 │
[i]	└─────────┴───┴───┴───┴───┴───┴───┴───┘
Iteration goes left->right - top->bottom

considering the costs:
insert : 1
remove : 1
replace : 1
none : 0
*/

/**
 * Determines the Levenshtein distance between two given strings
 * @param {string} string 
 * @param {string} string
 * @returns {number}
 */
const levDistance = (S = '', T = '') => {
	// iterator indexes
	let i, j;
	const n = S.length, m = T.length;
	// makes a 2 dimensional array ([n][m]) by mapping to each slot of the initial array (n) another array (m)
	let lev = Array(n + 1).fill().map(() => Array(m + 1).fill());

	// consider the `i` as the index for the vertial string
	// considerare le `j` as the index for the horizontal string
	for (i = 0; i < n + 1; i++) {
		for (j = 0; j < m + 1; j++) {
			if (i == 0 || j == 0) {
				lev[i][j] = Math.max(i, j); // initial cell for the row || column
			} else {
				// sets the distance in a cell according to the minimal edit required to change one string into the other
				lev[i][j] = Math.min(
					// which is the min /* between  */ (insertion, deletion, substitution) costs
					lev[i - 1][j] + 1, lev[i][j - 1] + 1, lev[i - 1][j - 1] + (S.charAt(i - 1) != T.charAt(j - 1) ? 1 : 0)// substitution cost
				);
			}
		}
	}
	return lev[n][m];
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