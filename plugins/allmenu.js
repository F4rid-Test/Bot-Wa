let handler = async (conn, m, { prefix }) => {
  const p = prefix
  const text = `
*${global.nameBot} — All Menu*

Selamat datang di bot ${global.nameBot}.
Berikut daftar fitur yang tersedia dan dapat digunakan.

━━━━━━━━━━━━━━━
*MENU DOWNLOADER*

• ${p}mf <link_mediafire>
• ${p}tt <link_tiktok>

━━━━━━━━━━━━━━━
*MENU AI*

• ${p}gpt <text>
• ${p}claude <text>
• ${p}qwen-tts <text> <model>

━━━━━━━━━━━━━━━
*MENU GROUP*

• ${p}gc <open/close>
• ${p}pin <1/2/3> <reply pesan>
• ${p}unpin <reply pesan yang disematkan>
• ${p}kick <tag/reply/nomor>
• ${p}add <nomor>
• ${p}promote <tag/reply>
• ${p}demote <tag/reply>
• ${p}ht <teks>
• ${p}tagall <teks opsional>

━━━━━━━━━━━━━━━
*MENU TOOLS*

• ${p}tourl <reply gambar>
• ${p}rvo <reply pesan sekali lihat>
• ${p}ytplay <judul/link youtube>
• ${p}swytplay <judul/link youtube>

━━━━━━━━━━━━━━━
*MENU SEARCH*

• ${p}wiki <query>
• ${p}movie <query>
• ${p}pinsrch <query>

━━━━━━━━━━━━━━━
*MENU STALKER*

• ${p}ghstalk <username>
• ${p}ttstalk <username>

━━━━━━━━━━━━━━━
*MENU OWNER*

• ${p}> <kode javascript>
• ${p}plugin <reply code> <path>
• ${p}listplugin
• ${p}delplugin <path>
• ${p}getplugin <path>

━━━━━━━━━━━━━━━
© ${global.nameBot}`.trim()

  await conn.sendMessage(m.chat,
    {
      image: {
        url: global.thumb
      },
      caption: text,
      footer: global.nameBot,
      buttons: [
        {
          buttonId: `${p}owner`,
          buttonText: { displayText: 'Contact Owner' },
          type: 1
        },
        {
          buttonId: `${p}dev`,
          buttonText: { displayText: 'Developer' },
          type: 1
        },
        {
          buttonId: `${p}info`,
          buttonText: { displayText: 'Informasi Bot' },
          type: 1
        }
      ],
      headerType: 4,
      contextInfo: {
        forwardingScore: 999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: global.nameBot,
          newsletterJid: '120363420019948650@newsletter'
        }
      }
    },
    { quoted: m }
  )
}

handler.command = ['allmenu']
handler.help = ['allmenu']
handler.tag = ['main']

export default handler
