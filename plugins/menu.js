const TAG_DETAILS = {
  download: { icon: '📥', title: 'Download' },
  ai: { icon: '🧠', title: 'Artificial Intelligence' },
  search: { icon: '🔍', title: 'Search' },
  tools: { icon: '🛠️', title: 'Tools' },
  group: { icon: '👥', title: 'Group' },
  stalker: { icon: '🕵️', title: 'Stalker' },
  owner: { icon: '⚙️', title: 'Owner' },
  main: { icon: '🏠', title: 'Main' }
}

let handler = async (conn, m, { prefix, text, args }) => {
  const runtime = (seconds) => {
    seconds = Number(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor(seconds % (3600 * 24) / 3600)
    const mnt = Math.floor(seconds % 3600 / 60)
    const s = Math.floor(seconds % 60)
    return [
      d ? `${d} Hari` : '',
      h ? `${h} Jam` : '',
      mnt ? `${mnt} Menit` : '',
      s ? `${s} Detik` : ''
    ].filter(Boolean).join(' ')
  }

  const date = new Date()
  const tanggal = date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const waktu = date.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

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

  const category = args[0]?.toLowerCase()

  // ── Category menu ──────────────────────────────────────────────
  if (category && categories[category]) {
    const details = TAG_DETAILS[category] || { icon: '🔖', title: category.toUpperCase() }

    if (category === 'owner' && !m.isOwner) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Menu ini hanya untuk owner.' },
        { quoted: m }
      )
    }

    const featureList = categories[category]
      .map(plugin => {
        const help = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
        return help.map(h => `• *${prefix}${h}*`).join('\n')
      })
      .join('\n')

    const catText = `
${details.icon} *Menu ${details.title}*

${featureList}

━━━━━━━━━━━━━━━
Ketik *${prefix}menu* untuk kembali ke menu utama.`.trim()

    return await conn.sendMessage(
      m.chat,
      {
        image: { url: global.thumb },
        caption: catText,
        footer: `© ${global.nameBot}`,
        buttons: [
          { text: '🏠 Menu Utama', id: `${prefix}menu` },
          { text: '📋 All Menu', id: `${prefix}allmenu` }
        ]
      },
      { quoted: m }
    )
  }

  // ── Main menu ──────────────────────────────────────────────────
  const sortedTags = Object.keys(categories).sort()
  const mainText = `
𝙒𝙚𝙡𝗰𝗼𝗺𝗲 𝘁𝗼 ${global.nameBot}

❑ ᴜsᴇʀɴᴀᴍᴇ : ${m.pushName || 'User'}
❑ ᴅᴇᴠᴇʟᴏᴘᴇʀ : ${global.dev}
❑ ᴏᴡɴᴇʀ : ${global.ownerName}
❑ ᴘʀᴇғɪx : ${global.prefix}
❑ ᴠᴇʀsɪᴏɴ : ${global.version}

➥ ᴅᴀᴛᴇ : ${tanggal}
➥ ᴛɪᴍᴇ : ${waktu} WIB
➥ ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}

Pilih kategori menu di bawah.`

  await conn.sendMessage(
    m.chat,
    {
      image: { url: global.thumb },
      caption: mainText,
      footer: `© ${global.nameBot}`,
      buttons: [
        {
          text: 'Contact Owner',
          id: `${prefix}owner`
        },
        {
          text: 'Developer',
          id: `${prefix}dev`
        },
        {
          text: '📂 Pilih Kategori Menu',
          sections: [
            {
              title: '📂 Kategori Menu',
              rows: [
                {
                  title: '📋 All Menu',
                  description: 'Tampilkan semua fitur bot sekaligus',
                  id: `${prefix}allmenu`
                }
              ]
            },
            {
              title: '🗂️ Kategori',
              rows: sortedTags
                .filter(tag => tag !== 'owner' && tag !== 'main')
                .map(tag => {
                  const details = TAG_DETAILS[tag] || { icon: '🔖', title: tag.toUpperCase() }
                  return {
                    title: `${details.icon} ${details.title}`,
                    description: `${categories[tag].length} fitur tersedia`,
                    id: `${prefix}menu ${tag}`
                  }
                })
            },
            {
              title: '🔒 Owner Only',
              rows: categories['owner'] ? [
                {
                  title: '⚙️ Owner',
                  description: `${categories['owner'].length} fitur khusus owner`,
                  id: `${prefix}menu owner`
                }
              ] : []
            }
          ]
        }
      ]
    },
    { quoted: m }
  )
}

handler.command = ['menu']
handler.help = ['menu', 'menu <kategori>']
handler.tag = ['main']

export default handler
