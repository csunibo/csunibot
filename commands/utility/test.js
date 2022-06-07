module.exports = {
    name: "test",
    description: "test command",
    options: [
        {
            name: 'question',
            type: 3, // "STRING"
            description: "question",
            required: true,
        },
    ],
    category: "utility",
    ownerOnly: true,
    run: async (client, interaction) => {
        interaction.channel.sendTyping();
        let eightball = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of the CS god',
            '||No||',
            '||Yes||',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
        ];
        setTimeout(() => {
            interaction.reply({
                content: eightball[Math.floor(Math.random() * Math.floor(eightball.length))],
            });
        }, 750);
    }
}
