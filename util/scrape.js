const request = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { getPosition } = require('./string');

const campus = [
	'bologna', 'cesena', 'forli', 'ravenna', 'rimini',
	'Bologna', 'Cesena', 'Forli', 'Ravenna', 'Rimini',
]

/**
 * TODO: getCurricula for each course
 */

/**
 * 
 * @param {string} courseURL of type https://corsi.unibo.it/laurea/test
 * @returns {[ { year: string, value: number} ]}
 * 
 * ex: 
 * 
 * input: `https://corsi.unibo.it/laurea/informatica`
 * 
 * output: 
 * ```ts 
 * [{ year: '1° Anno', value: 1}, { year: '2° Anno', value: 2}, { year: '3° Anno', value: 3}] 
 * ```
 */
const getYears = async (courseURL) => {
	let years;
	const url = courseURL + '/orario-lezioni';
	request(url, async (error, response, body) => {
		if (!error) {
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))

			years = $('select[id="search-orari-anno"]')
			.find('option')
			.toArray()
			.map(element => { 
				return { 
					year: $(element).text().replace(/(?:^[^\n]*(\n))|(?:(\n)[^\n]*$)/g, ''),
					value: parseInt($(element).attr('value')),
				}
			});
		} else {
			console.log("We've encountered an error in counting the years of the course: " + error);
		}
	})
	while (!years) await new Promise((re,rj) => setTimeout(re, 50));
	return years;
}

/**
* Gets the number of pages on one of the parameter links
* @param {string} url of type https://corsi.unibo.it/laurea/ or 
* https://corsi.unibo.it/magistrale/
* @returns {number}
*/
const getPages = async (url) => {
	let pages = 0;
	request(url, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			pages = $('nav[class="pagination"]')
			.find('ul > li')
			.toArray()
			.map(element => $(element).text().replace(/(?:^[^\n]*(\n))|(?:(\n)[^\n]*$)/g, ''));
			pages = parseInt(pages.slice(pages.length - 2, pages.length - 1)[0]);
		} else {
			console.log("We've encountered an error in counting the pages of the pagination: " + error);
		}
	});
	while (!pages) await new Promise((re,rj) => setTimeout(re, 10));
	return pages;
}

/**
* Grabs all the names and links of the courses offered by the Univeristy of Bologna
* by reading all the pages on the parameter links
* @param {string} url of type https://corsi.unibo.it/laurea/ or 
* https://corsi.unibo.it/magistrale/
* @returns {[{name: string, link: string}]}
*/
const getCourses = async (url) => {
	const pages = await getPages(url);
	let corsi = [];
	for (let i = 0; i < pages; i++) {
		let lauree;
		request(url+`?b_start:int=${i * 20}`, async (error, response, body) => {
			if (!error){
				let $ = cheerio.load(body.replace(/^\s+/gm, ''))
				lauree = $('div[class="entries"]')
				.find('div > article > header > span > a')
				.toArray()
				.map(element => { 
					let type = url.substring(getPosition(url, '/', 3) + 1, url.lastIndexOf('/'));
					let name = $(element).text().replace(/(?:^[^\n]*(\n))|(?:(\n)[^\n]*$)/g, '') + ` ⟨⟨${type}⟩⟩`;
					let link = $(element).attr('href');
					let city;
					if (link.includes('-') && campus.includes(link.substring(link.lastIndexOf('-') + 1)))
					city = link.substring(link.lastIndexOf('-') + 1)
					return { 
						name: city ? `${name} ⟨⟨${city}⟩⟩` : `${name}`, 
						link: link,
					}
				});
			} else {
				console.log("We've encountered an error in scraping the entries: " + error);
			}
		})
		// Waits for the degrees on the current iterating page to be found
		while (!lauree) await new Promise((re,rj) => setTimeout(re, 50));
		corsi = corsi.concat(lauree);
	}
	return corsi;
}

/**
* Gets all the professors from a given course, independent of year
* @param {string} courseURL of type https://corsi.unibo.it/laurea/test
* @returns {[{name: string, role: string, site: string, image: string}]}
*/
const getProfessors = async (courseURL) => {
	const url = courseURL + "/docenti";
	let prof;
	request(url, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''))
			
			prof = $('div[class="people-wrapper"]')
			.find('div > div > div > div[class="front"]')
			.toArray()
			.map(element => { 
				return { 
					name: $(element).find('div[class="text-wrap"] > h2[class="text-secondary"]').text().replace(/(?:^[^\n]*(\n))|(?:(\n)[^\n]*$)/g, ''), 
					role: $(element).find('div[class="text-wrap"] > p').first().text(),
					site: $(element).find('div[class="text-wrap"] > p > a').attr('href'),
					image: $(element).find('img').attr('src'),
				}
			});
		} else {
			console.log("We've encountered an error in scraping the professors: " + error);
		}
	})
	while (!prof) await new Promise((re,rj) => setTimeout(re, 50));
	return prof;
}

/**
* Gets all the topics of a given course independent of year
* @param {string} courseURL of type https://corsi.unibo.it/laurea/test
* @returns {[{code: string, title: string, site?: string, virtuale?: string}]}
*
*/
const getTopics = async (courseURL) => {
	const year = new Date().getFullYear() - 1;
	const courseId = await getCourseId(courseURL);
	const url = courseURL + `/insegnamenti/piano/${year}/${courseId}/${year}`;
	let topics;
	request(url, async (error, response, body) => {
		if (!error){
			let $ = cheerio.load(body.replace(/^\s+/gm, ''));
			
			topics = $('div[class="table-text"]')
			.find('div[class="table-text"] > table > tbody > tr')
			.toArray()
			.map(async (element) => {
				//Parsing section
				let topicCode;
				let topicTitle = $(element).find('td[class="title"]').text();
				let siteLink = $(element).find('td[class="title"] > a').attr('href');
				
				if (parseInt(topicTitle)) {
					topicCode = parseInt(topicTitle).toString();
					topicTitle = topicTitle.substring(topicCode.length);
				} else {
					topicCode = $(element).find('td[class="code"]').text();
				}
				
				return { 
					code: topicCode,
					title: topicTitle.replace(/(?:^[^\n]*(\n))|(?:(\n)[^\n]*$)/g, ''),
					site: siteLink ? siteLink : undefined,
					virtuale: siteLink ? await getVirtualLink(siteLink) : undefined,
				}
			});
		} else {
			console.log("We've encountered an error in getting the topics: " + error);
		}
	})
	while (!topics) await new Promise((re,rj) => setTimeout(re, 100));
	topics = await Promise.all(topics).catch(err => console.log(err));

	return topics;
}

/**
* Gets the ID code of a course for the main site 
* @param {string} courseURL of type https://corsi.unibo.it/laurea/test
* @returns {string}
*/
const getCourseId = async (courseURL) => {
	const url = courseURL + `/insegnamenti`;
	let courseId = 0;
	request(url, async (error, response, body) => {
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
	// This is the part that actually gets the ID, by parsing the link it grabs from the appropriate course
	return courseId.toString().substring(getPosition(courseId, '/', 8) + 1, getPosition(courseId, '/', 11));
}

/**
* 
* @param {string} courseURL of type https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2021/460495 or
* https://www.unibo.it/it/didattica/insegnamenti?codiceMateria=13477&annoAccademico=2021&codiceCorso=8009&single=True&search=True
* @returns {string}
*/
const getVirtualLink = async (courseURL) => {
	let link;
	request(courseURL, (error, response, body) => {
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
	while (!link) await new Promise((re,rj) => setTimeout(re, 20));
	return link[0];
}

/**
* Gets the HTML from a site... all of it
* @param {string} URL 
* @returns {string}
*/
const getHTML = async (URL) => {
	let HTML;
	request(URL, async (error, response, body) => {
		if (!error){
			HTML = body;
		} else {
			console.log("We've encountered an error in scraping the site: " + error);
		}
	});
	while (!HTML) await new Promise((re,rj) => setTimeout(re, 100));
	return HTML;
}

/**
 * 
 * @param {string} imageUrl URL of the image you want to search for
 * @param {Object} callback Results of the search, provided through callback
 */
const reverseImageSearch = async (imageUrl, callback) => {
	const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
	const page = await browser.newPage();
	await page.goto('https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(imageUrl));

	const images = await page.evaluate(() => {
		return Array.from(document.body.querySelectorAll('div div a h3')).slice(2).map(e => e.parentNode).map(el => ({ url: el.href, title: el.querySelector('h3').innerHTML }))
	})
	callback(images);
	await browser.close();
}

module.exports = { 
	reverseImageSearch,
	getVirtualLink, 
	getProfessors, 
	getCourseId, 
	getCourses, 
	getTopics, 
	getYears,
	getHTML, 
};