![Image](https://cdn.discordapp.com/attachments/929054977454911488/983658693985959966/unknown.png)

In the interaction class object, for each executed command, there is a set of properties, namely:
```ts
class Interaction<Cached extends CacheType = CacheType> extends Base {
  public locale: string;
  public guildLocale: CacheTypeReducer<Cached, string, string, string>;
}
```
Which could come in handy for managing different aliases based on someone's selected region in discord.

`guildLocale` is the property which defines the region in which the server has been centered upon (default server language)<br>
`locale` is the language which the single user, who interacted with the bot, has chosen to display everything on their discord app

These are the available locales (check [Discord Developer Portal](https://discord.com/developers/docs/reference#locales))
```ts
    EnglishUS = "en-US",
    EnglishGB = "en-GB",
    Bulgarian = "bg",
    ChineseCN = "zh-CN",
    ChineseTW = "zh-TW",
    Croatian = "hr",
    Czech = "cs",
    Danish = "da",
    Dutch = "nl",
    Finnish = "fi",
    French = "fr",
    German = "de",
    Greek = "el",
    Hindi = "hi",
    Hungarian = "hu",
    Italian = "it",
    Japanese = "ja",
    Korean = "ko",
    Lithuanian = "lt",
    Norwegian = "no",
    Polish = "pl",
    PortugueseBR = "pt-BR",
    Romanian = "ro",
    Russian = "ru",
    SpanishES = "es-ES",
    Swedish = "sv-SE",
    Thai = "th",
    Turkish = "tr",
    Ukrainian = "uk",
    Vietnamese = "vi"
```

Each one of those can be interpreted as an object property as well, not just string, for example:
```ts
    "en-US"?: string;
    "en-GB"?: string;
    bg?: string;
    "zh-CN"?: string;
    "zh-TW"?: string;
    hr?: string;
etc...
```
the locales can be set through methods, of the discord.js builders package, or directly through property manipulation. However, I've yet to test which of the two is most effective and/or usable
here are some examples:
```js
command.setLocalizedNames({
  'en-GB': 'test',
  'pt-BR': 'teste',
})
```
and 
```js
module.exports = {
    name: "test",
    description: "test command",
    name_localizations: {
        it: "prova",
    },
    description_localizations: {
        it: "commando di prova",
    },
    run: async(...) => {...}
}
```