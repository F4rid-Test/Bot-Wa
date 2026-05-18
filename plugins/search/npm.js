import axios from 'axios'

let handler = async (conn, m, { command, prefix, args }) => {
  try {
    const pkg = args[0]

    if (!pkg) {
      return await conn.sendMessage(m.chat, {
        richResponse: [{
          text: `*NPM Package Info*\n\nCara penggunaan:`
        }, {
          language: 'bash',
          code: [{
            highlightType: 0,
            codeContent: `${prefix}npm <nama-package>\n\nContoh:\n${prefix}npm axios\n${prefix}npm express\n${prefix}npm lodash`
          }]
        }]
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { text: `⏳ Mencari info package *${pkg}*...` }, { quoted: m })

    const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
      timeout: 15000
    })

    const latest = data['dist-tags']?.latest || Object.keys(data.versions || {}).pop()
    const info = data.versions?.[latest] || {}
    const time = data.time?.[latest]
    const created = data.time?.created
    const modified = data.time?.modified

    const fmtDate = (str) => str ? new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

    const deps = Object.keys(info.dependencies || {})
    const devDeps = Object.keys(info.devDependencies || {})
    const keywords = (data.keywords || []).slice(0, 6)
    const license = info.license || data.license || '-'
    const desc = data.description || info.description || 'Tidak ada deskripsi.'
    const homepage = info.homepage || data.homepage || '-'
    const repo = info.repository?.url?.replace(/^git\+|\.git$/g, '') || '-'
    const author = typeof info.author === 'object'
      ? (info.author?.name || '-')
      : (info.author || data.author?.name || '-')

    const installCode = `npm install ${pkg}`
    const usageCode = info.main
      ? `const ${pkg.replace(/[^a-zA-Z0-9]/g, '')} = require('${pkg}')\n// atau\nimport ${pkg.replace(/[^a-zA-Z0-9]/g, '')} from '${pkg}'`
      : `import ${pkg.replace(/[-@/]/g, '').replace(/\s/g, '')} from '${pkg}'`

    const tableRows = [
      { isHeading: true, items: ['Info', 'Detail'] },
      { isHeading: false, items: ['📦 Package', pkg] },
      { isHeading: false, items: ['🔖 Versi', latest] },
      { isHeading: false, items: ['👤 Author', author] },
      { isHeading: false, items: ['📜 Lisensi', license] },
      { isHeading: false, items: ['📅 Rilis', fmtDate(time)] },
      { isHeading: false, items: ['🆕 Dibuat', fmtDate(created)] },
      { isHeading: false, items: ['🔄 Update', fmtDate(modified)] },
      { isHeading: false, items: ['📦 Deps', deps.length > 0 ? `${deps.length} package` : 'Tidak ada'] },
      { isHeading: false, items: ['🔧 DevDeps', devDeps.length > 0 ? `${devDeps.length} package` : 'Tidak ada'] },
    ]

    const richParts = [
      { text: `*NPM Package Info — ${pkg}*\n\n📝 ${desc}` },
      { title: `📊 Informasi ${pkg}@${latest}`, table: tableRows },
      { text: `\n⚙️ *Instalasi:*` },
      {
        language: 'bash',
        code: [{ highlightType: 0, codeContent: installCode }]
      },
      { text: `\n📥 *Import/Require:*` },
      {
        language: 'javascript',
        code: [{ highlightType: 0, codeContent: usageCode }]
      }
    ]

    if (deps.length > 0) {
      richParts.push({ text: `\n🔗 *Dependencies (${deps.length}):*\n${deps.slice(0, 8).map(d => `• ${d}`).join('\n')}${deps.length > 8 ? `\n• ...dan ${deps.length - 8} lainnya` : ''}` })
    }

    if (keywords.length > 0) {
      richParts.push({ text: `\n🏷️ *Keywords:* ${keywords.join(', ')}` })
    }

    if (homepage !== '-') richParts.push({ text: `\n🌐 *Homepage:* ${homepage}` })
    if (repo !== '-') richParts.push({ text: `📂 *Repo:* ${repo}` })
    richParts.push({ text: `\n🔗 *NPM:* https://npmjs.com/package/${pkg}\n\n> © ${global.nameBot}` })

    await conn.sendMessage(m.chat, { richResponse: richParts }, { quoted: m })

  } catch (e) {
    console.log(e)
    const status = e?.response?.status
    await conn.sendMessage(m.chat, {
      text: status === 404
        ? `❌ Package *${args[0]}* tidak ditemukan di npm registry.`
        : `❌ *Error:* ${e.message}`
    }, { quoted: m })
  }
}

handler.command = ['npm', 'npminfo']
handler.help = ['npm <package>']
handler.tag = ['search']

export default handler
