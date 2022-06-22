const fs = require('fs');
const { getHTML } = require('../../util/scrapeUtil');

module.exports = {
	name: "scrape",
	usage: "/scrape <URL>",
	options: [
		{
			name: 'html',
			type: 3, // "STRING"
			description: "url of a website",
			required: true,
		},
	],
	category: "utility",
	description: "Scrape HTML Code of a webpage",
	ownerOnly: false,
	run: async (client, interaction) => {
		const urlRegEx = new RegExp('([a-zA-Z\d]+://)((\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?)', 'i')
		
		if (!interaction.options.getString('html').match(urlRegEx))
		return interaction.reply({content: "URL not valid, please make sure you include the protocol as well!", ephemeral: true})
		
		await interaction.deferReply().catch((_) => {});
		interaction.editReply({ content: "This may take some time..."})
		
		let HTMLgrabber = getHTML(interaction.options.getString('html'));
		fs.writeFile('./scraped/GrabbedHTML.html', await HTMLgrabber, err => {
			if (err) {
				console.error(err)
				return
			}
			interaction.channel.send({ files: [
				{
					name: './scraped/GrabbedHTML.html',
					attachment: './scraped/GrabbedHTML.html',
					description: "GrabbedHTML.html",
				}
			] })
		})
		interaction.editReply({ content: "Here are the requested files"})
	},
}
