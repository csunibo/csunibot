const fs = require('fs');
const { getHTML } = require('../../util/getUninfo');

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
		await interaction.deferReply().catch((_) => {});
		interaction.editReply({ content: "This may take some time..."})

		if (interaction.options.getString('html')){
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
		}
		interaction.editReply({ content: "Here are the requested files"})
	},
}
