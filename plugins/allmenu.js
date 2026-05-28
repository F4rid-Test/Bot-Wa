const TAG_DETAILS = {
  download: { icon: '📥', title: 'DOWNLOADER' },
  ai: { icon: '🧠', title: 'AI' },
  search: { icon: '🔍', title: 'SEARCH' },
  tools: { icon: '🛠️', title: 'TOOLS' },
  group: { icon: '👥', title: 'GROUP' },
  stalker: { icon: '🕵️', title: 'STALKER' },
  owner: { icon: '⚙️', title: 'OWNER' },
  main: { icon: '🏠', title: 'MAIN' }
}

let handler = async (conn, m, { prefix }) => {
  const p = prefix

  // Collect plugins and group by tag
  const categories = {}
  Object.values(global.plugins).forEach(plugin => {
    if (!plugin || !plugin.tag) return
    const tags = Array.isArray(plugin.tag) ? plugin.tag : [plugin.tag]
    tags.forEach(tag => {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(plugin)
    })
  })

  let menuText = `*${global.nameBot} — All Menu*\n\n`
  menuText += `Selamat datang di bot ${global.nameBot}.\n`
  menuText += `Berikut daftar fitur yang tersedia dan dapat digunakan.\n`

  const sortedTags = Object.keys(categories).sort()

  sortedTags.forEach(tag => {
    const details = TAG_DETAILS[tag] || { icon: '🔖', title: tag.toUpperCase() }
    menuText += `\n━━━━━━━━━━━━━━━\n`
    menuText += `*MENU ${details.title}*\n\n`

    categories[tag].forEach(plugin => {
      const help = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
      help.forEach(h => {
        menuText += `• ${p}${h}\n`
      })
    })
  })

  menuText += `\n━━━━━━━━━━━━━━━\n`
  menuText += `© ${global.nameBot}`

  await conn.sendMessage(m.chat,
    {
      image: {
        url: global.thumb
      },
      caption: menuText.trim(),
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
