const { Client, Message, Util, Intents, MessageActionRow, MessageButton, MessageAttachment, MessageSelectMenu} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const { genEmbed } = require('../../../../Global/Init/Embed')
module.exports = {
    Isim: "bot",
    Komut: ["bot-dev","update-bots","botsu","acr-bot","bot-setting","dev-discord","bots","botpp"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
   
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let callbacks = require('../../../../Global/Settings/_system.json');

        // Bot Token's
    let Req = callbacks.TOKENS.Requirements
    let Stat = callbacks.TOKENS.Statistics
    let Voucher = callbacks.TOKENS.Voucher
    let SEC_MAIN = callbacks.TOKENS.SECURITY.MAIN
    let SEC_ONE = callbacks.TOKENS.SECURITY.SEC_ONE
    let SEC_TWO = callbacks.TOKENS.SECURITY.SEC_TWO
    let SEC_THREE = callbacks.TOKENS.SECURITY.SEC_THREE
    let SEC_FOUR = callbacks.TOKENS.SECURITY.SEC_FOUR
    let DISTS = callbacks.TOKENS.SECURITY.DISTS
    let WELCOME = callbacks.WELCOMES
        // Bot Token's

    let allTokens = [Req, Stat, Voucher, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR, DISTS, ...WELCOME]
    let pubTokens = [Req, Stat, Voucher, WELCOME, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR]
   
    let OWNBOTS = []

    allBots.forEach(bot => {
        OWNBOTS.push({
            value: bot.user.id,
            emoji: { id: "925127916310908968" },
            label: `${bot.user.tag}`,
            description: `${bot.user.id}`
        })
    })
    let Row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("selectBot")
        .setPlaceholder("?????? | G??ncellenecek Bir Bot Se??iniz!")
        .setOptions(
            [OWNBOTS]
        )
    )

    let msg = await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`${message.guild.emojiG??ster(emojiler.Icon)} A??a????da s??ralanmakta olan botlar??n, ismini veya da profil foto??raf??n?? de??i??mesini istedi??iniz bir botu se??iniz.`)],components: [Row]})
    const filter = i => i.user.id == message.member.id
    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })

    collector.on('collect', async (i) => {
        if(i.customId == "selectBot") {
            let type = i.values
            if(!type) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})

                let botId = i.values
                let botClient = allBots.find(bot => bot.user.id == type)
                if(!botClient) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})
                let updateRow = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId("selectAvatar")
                    .setEmoji("926954863647150140")
                    .setLabel("Profil Foto??raf?? De??i??iklili??i")
                    .setStyle("PRIMARY"),
                    new MessageButton()
                    .setCustomId("selectName")
                    .setEmoji("926955061446320208")
                    .setLabel("??sim De??i??iklili??i")
                    .setStyle("SUCCESS")
                )
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`Vahuu! ${botClient.user} isimli bot ??zerinde yapmak istedi??iniz de??i??iklili??i se??iniz?`)], components: [
                    updateRow
                ]}).then(msg => {
                    const filter = i => i.user.id == message.member.id 
                    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })
                    collector.on("collect", async (i) => {
                        let botClient = allBots.find(bot => bot.user.id == botId)
                        if(!botClient) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})
                        if(i.customId == "selectAvatar") {
                             msg.edit({embeds: [new genEmbed().setColor("DARK_GOLD").setDescription(`${message.guild.emojiG??ster(emojiler.Icon)} ${botClient.user} isimli botun yeni profil resmini y??kleyin veya ba??lant??s??n?? girin. ????lemi iptal etmek i??in (**iptal**) yazabilirsiniz. (**S??re**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiG??ster(emojiler.Iptal)).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} Profil resmi de??i??tirme i??lemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.avatarURL({dynamic: true})
                                  let bekle = await message.reply(`Bu i??lem biraz uzun s??rebilir, L??tfen bekleyin...`)
                                   let isim = m.content || m.attachments.first().url
                                    if(!isim) {
                                        message.react(message.guild.emojiG??ster(emojiler.Iptal)).catch(err => {})
                                        msg.delete().catch(err => {});
                                        await i.reply({content: `${cevaplar.prefix} Profil resmi belirtilmedi??i i??in i??lem iptal edildi.`, ephemeral: true})
                                        return;
                                    }
                                  botClient.user.setAvatar(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setFooter(`${tarihsel(Date.now())} tarihinde i??leme koyuldu.`).setDescription(`${message.member} taraf??ndan ${botClient.user} isimli botun profil resmi de??i??tirildi.`).setThumbnail(botClient.user.avatarURL())]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla! ${botClient.user} isimli botun profil resmi g??ncellendi!`).setThumbnail(botClient.user.avatarURL())]}).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Onay)).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Ba??ar??s??z! profil resmi g??ncelleyebilmem i??in biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Iptal)).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                        if(i.customId == "selectName") {
                            msg.edit({embeds: [new genEmbed().setColor("DARK_GOLD").setDescription(`${message.guild.emojiG??ster(emojiler.Icon)} ${botClient.user} isimli botun yeni ismini belirtin. ????lemi iptal etmek i??in (**iptal**) yazabilirsiniz. (**S??re**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiG??ster(emojiler.Iptal)).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} ??sim de??i??tirme i??lemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.username
                                  let bekle = await message.reply(`Bu i??lem biraz uzun s??rebilir, L??tfen bekleyin...`)
                                  let isim = m.content
                                  botClient.user.setUsername(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setFooter(`${tarihsel(Date.now())} tarihinde i??leme koyuldu.`).setDescription(`${message.member} taraf??ndan ${botClient.user} isimli botun ismi de??i??tirildi.\n**${eskinick}** \` ????????? \` **${botClient.user.username}** olarak g??ncellendi.`)]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla! **${eskinick}** \` ????????? \` **${botClient.user.username}** olarak de??i??tirildi.`)]}).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Onay)).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Ba??ar??s??z! isim de??i??tirebilmem i??in biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Iptal)).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                    })
                })
   
        }
    })

    collector.on("end", async () => {
        msg.delete().catch(err => {})
    })
  }
};