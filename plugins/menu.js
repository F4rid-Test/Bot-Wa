const CATEGORIES = {
  download: {
    icon: '📥',
    title: 'Download',
    features: [
      { name: 'TikTok Download', desc: 'Download video TikTok tanpa watermark', cmd: 'tt' },
      { name: 'Mediafire Download', desc: 'Download file dari MediaFire', cmd: 'mf' }
    ]
  },
  ai: {
    icon: '🧠',
    title: 'Artificial Intelligence',
    features: [
      { name: 'GPT 5 Nano', desc: 'Chat dengan AI model GPT 5 Nano', cmd: 'gpt' },
      { name: 'Claude 3 Haiku', desc: 'Chat dengan AI model Claude 3 Haiku', cmd: 'claude' },
      { name: 'Qwen TTS', desc: 'Generate suara AI dari berbagai model', cmd: 'qwen-tts' }
    ]
  },
  search: {
    icon: '🔍',
    title: 'Search',
    features: [
      { name: 'Wikipedia', desc: 'Cari informasi di Wikipedia', cmd: 'wiki' },
      { name: 'Movie', desc: 'Cari movie di IMDB', cmd: 'movie' },
      { name: 'Pinterest Search', desc: 'Cari gambar di Pinterest', cmd: 'pinsrch' }
    ]
  },
  tools: {
    icon: '🛠️',
    title: 'Tools',
    features: [
      { name: 'To URL', desc: 'Ubah gambar/file menjadi URL', cmd: 'tourl' },
      { name: 'Reveal View Once', desc: 'Buka pesan sekali lihat (reply)', cmd: 'rvo' },
      { name: 'YouTube Play', desc: 'Download & kirim audio YouTube', cmd: 'ytplay' },
      { name: 'Status YT Play', desc: 'Upload audio YouTube ke status WA', cmd: 'swytplay' }
    ]
  },
  group: {
    icon: '👥',
    title: 'Group',
    features: [
      { name: 'Buka/Tutup Grup', desc: 'gc open / gc close', cmd: 'gc' },
      { name: 'Pin Pesan', desc: 'Sematkan pesan 24j/7h/30h (reply)', cmd: 'pin' },
      { name: 'Unpin Pesan', desc: 'Batalkan sematan pesan (reply)', cmd: 'unpin' },
      { name: 'Kick Anggota', desc: 'Keluarkan anggota dari grup', cmd: 'kick' },
      { name: 'Add Anggota', desc: 'Tambahkan anggota ke grup', cmd: 'add' },
      { name: 'Promote Admin', desc: 'Jadikan anggota sebagai admin', cmd: 'promote' },
      { name: 'Demote Admin', desc: 'Turunkan admin menjadi anggota', cmd: 'demote' },
      { name: 'Hide Tag', desc: 'Tag semua anggota tanpa terlihat', cmd: 'ht' },
      { name: 'Tag All', desc: 'Tag semua anggota grup', cmd: 'tagall' }
    ]
  },
  stalker: {
    icon: '🕵️',
    title: 'Stalker',
    features: [
      { name: 'GitHub Stalk', desc: 'Lihat profil GitHub seseorang', cmd: 'ghstalk' },
      { name: 'TikTok Stalk', desc: 'Lihat profil TikTok seseorang', cmd: 'ttstalk' }
    ]
  },
  owner: {
    icon: '⚙️',
    title: 'Owner',
    features: [
      { name: 'Eval', desc: 'Eksekusi kode JavaScript', cmd: '>' },
      { name: 'List Plugin', desc: 'Melihat semua daftar plugin', cmd: 'listplugin' },
      { name: 'Create Plugin', desc: 'Membuat plugin baru', cmd: 'plugin' },
      { name: 'Get Plugin', desc: 'Ambil isi plugin sebagai file .js', cmd: 'getplugin' },
      { name: 'Delete Plugin', desc: 'Menghapus plugin tertentu', cmd: 'delplugin' }
    ]
  }
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

  const category = args[0]?.toLowerCase()

  // ── Category menu ──────────────────────────────────────────────
  if (category && CATEGORIES[category]) {
    const cat = CATEGORIES[category]

    if (category === 'owner' && !m.isOwner) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Menu ini hanya untuk owner.' },
        { quoted: m }
      )
    }

    const featureList = cat.features
      .map(f => `• *${prefix}${f.cmd}*\n  ${f.desc}`)
      .join('\n\n')

    const catText = `
${cat.icon} *Menu ${cat.title}*

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
              rows: Object.entries(CATEGORIES)
                .filter(([key]) => key !== 'owner')
                .map(([key, cat]) => ({
                  title: `${cat.icon} ${cat.title}`,
                  description: `${cat.features.length} fitur tersedia`,
                  id: `${prefix}menu ${key}`
                }))
            },
            {
              title: '🔒 Owner Only',
              rows: [
                {
                  title: '⚙️ Owner',
                  description: `${CATEGORIES.owner.features.length} fitur khusus owner`,
                  id: `${prefix}menu owner`
                }
              ]
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
