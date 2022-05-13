const request = require('request');
const cheerio = require('cheerio');
const { indexOf } = require('lodash');

/**
 * 
 * @param {string} url of type https://corsi.unibo.it/laurea/ or 
 * https://corsi.unibo.it/magistrale/
 * @returns {number}
 */
const getPages = async (url) => {
	let pages = 0;
	request({ url:url }, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			pages = $('nav[class="pagination"]')
			.find('ul > li')
			.toArray()
			.map(element => $(element).text().replace(/[\n ]/g, ''));
			pages = parseInt(pages.slice(pages.length - 2, pages.length - 1)[0]);
		} else {
			console.log("We've encountered an error in counting the pages of the pagination: " + error);
		}
	});
	while (!pages) await new Promise((re,rj) => setTimeout(re, 100));
	return pages;
}

/**
 * 
 * @param {string} url of type https://corsi.unibo.it/laurea/ or 
 * https://corsi.unibo.it/magistrale/
 * @returns {string[]}
 */
const getCourses = async (url) => {
	const pages = await getPages(url);
	let corsi = [];
	let i;
	for (i = 0; i < pages; i++) {
		let lauree;
		// ?b_start:int=0
		request({ url:url+`?b_start:int=${i * 20}` }, async (error, response, body) => {
			if (!error){
				let $ = cheerio.load(body.replace(/^\s+/gm, ''))
				
				lauree = $('div[class="entries"]')
				.find('div > article > header > span > a')
				.toArray()
				.map(element => { 
					return { 
						name: $(element).text().replace(/[\n ]/g, ''), 
						link: $(element).attr('href'),
					}
				});
				corsi = corsi.concat(lauree);
			} else {
				console.log("We've encountered an error in scraping the entries: " + error);
			}
		})
		while (!lauree) await new Promise((re,rj) => setTimeout(re, 10));
	}
	while (i !== pages) await new Promise((re,rj) => setTimeout(re, 100));
	return corsi;
}

/**
 * 
 * @param {string} courseURL of type https://corsi.unibo.it/laurea/test
 * @returns {string[]}
 */
const getProfessors = async (courseURL) => {
	const url = courseURL + "/docenti";
	let prof;
	request({ url:url }, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			prof = $('div[class="people-wrapper"]')
			.find('div > div > div > div[class="front"] > div[class="text-wrap"]')
			.toArray()
			.map(element => { 
				return { 
					name: $(element).find('h2[class="text-secondary"]').text().replace(/[\n ]/g, ''), 
					site: $(element).find('p > a').attr('href'),
				}
			});
		} else {
			console.log("We've encountered an error in scraping the professors: " + error);
		}
	})
	while (!prof) await new Promise((re,rj) => setTimeout(re, 100));
	return prof;
}
/**
 * 
 * @param {string} courseURL of type https://corsi.unibo.it/laurea/test
 * @returns {string[]}
 */
const getTopics = async (courseURL) => {
	const year = new Date().getFullYear() - 1
	const courseId = await getCourseId(courseURL);
	const url = courseURL + `/insegnamenti/piano/${year}/${courseId}/000/000/${year}`;
	let topics;
	request({ url:url }, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			topics = $('div[class="table-text"]')
			.find('div[class="table-text"] > table > tbody > tr')
			.toArray()
			.map((element) => {
				let siteLink = $(element).find('td[class="title"] > a').attr('href');
				
				return { 
					code: $(element).find('td[class="code"]').text(),
					title: $(element).find('td[class="title"]').text().replace(/[\n ]/g, ''), 
					site: siteLink ? siteLink : undefined,
				}
			});
		} else {
			console.log("We've encountered an error in getting the topics: " + error);
		}
	})

	// While this works, it's really bad, please fix
	while (!topics) await new Promise((re,rj) => setTimeout(re, 100));
	for (element of topics) {
		if (element.site) {
			// The cycle just waits here for a bit before returning :3
			// But this is also kinda the only way I found to get the correct values
			element.virtuale = await getVirtualLink(element.site);
		}
	}
	return topics;
}


function getPosition(string = '', subString = '', index = 0) {
	return string.toString().split(subString, index).join(subString).length;
}
/**
 * 
 * @param {string} courseURL 
 * @returns {number}
 */
const getCourseId = async (courseURL) => {
	const url = courseURL + `/insegnamenti`;
	let courseId = 0;
	request({ url:url }, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			courseId = $('ul[class="no-bullet"]')
			.find('ul > li')
			.toArray()
			.map(element => $(element).find('li > a').attr('href'));
		} else {
			console.log("We've encountered an error in getting the courseId: " + error);
		}
	})
	while (!courseId) await new Promise((re,rj) => setTimeout(re, 100));
	return parseInt(courseId.toString().substring(getPosition(courseId, '/', 8) + 1, getPosition(courseId, '/', 9)));
}

/**
 * 
 * @param {string} courseURL of type https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2021/320578
 * @returns {string}
 */
const getVirtualLink = async (courseURL) => {
	let link;
	request({ url:courseURL }, (error, response, body) => {
		if (!error) {
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))

			link = $('li[class="almadlcourseware"]')
			.find('li > p')
			.toArray()
			.map(element => $(element).find('p > a').attr('href'))
		} else {
			console.log("We've encountered an error in getting the Virtual E-Learning Platform Link" + error)
		}
	})
	while (!link) await new Promise((re,rj) => setTimeout(re, 10));
	return link[0];
}

/**
 * 
 * @param {string} URL 
 * @returns {string}
 */
const getHTML = async (URL) => {
	let HTML;
	request({ url:URL }, async (error, response, body) => {
		if (!error){
			HTML = body;
		} else {
			console.log("We've encountered an error in scraping the topics: " + error);
		}
	});
	while (!HTML) await new Promise((re,rj) => setTimeout(re, 100));
	return HTML;
}

module.exports = {getCourses, getProfessors, getTopics, getHTML, getVirtualLink, getCourseId };