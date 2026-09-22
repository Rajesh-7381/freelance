import * as XLSX from 'xlsx'

function sheetRows(workbook, name) {
  const sheet = workbook.Sheets[name]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

function toObject(rows) {
  const data = {}
  for (const row of rows) {
    const key = String(row.key ?? '').trim().toLowerCase()
    if (key) data[key] = String(row.value ?? '')
  }
  return data
}

export async function loadPortfolio() {
  const response = await fetch('/content/portfolio.xlsx', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Could not load Excel file (${response.status})`)
  }

  const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' })
  const profile = toObject(sheetRows(workbook, 'profile'))

  return {
    profile,
    nav: sheetRows(workbook, 'nav').map((row) => ({
      label: String(row.label ?? '').trim(),
      href: String(row.href ?? '').trim(),
    })),
    services: sheetRows(workbook, 'services').map((row) => ({
      name: String(row.name ?? row.category ?? '').trim(),
      icon: String(row.icon ?? 'web').trim() || 'web',
    })),
    builds: sheetRows(workbook, 'builds').map((row) => ({
      name: String(row.name ?? '').trim(),
      icon: String(row.icon ?? 'web').trim() || 'web',
    })),
    team: sheetRows(workbook, 'team').map((row) => ({
      name: String(row.name ?? '').trim(),
      role: String(row.role ?? '').trim(),
      photo: String(row.photo ?? '').trim(),
    })),
    process: sheetRows(workbook, 'process').map((row) => ({
      step: String(row.step ?? '').trim(),
      label: String(row.label ?? '').trim(),
    })),
    why: sheetRows(workbook, 'why')
      .map((row) => String(row.text ?? '').trim())
      .filter(Boolean),
    social: sheetRows(workbook, 'social').map((row) => ({
      label: String(row.label ?? '').trim(),
      url: String(row.url ?? '').trim(),
      icon: String(row.icon ?? 'github').trim() || 'github',
    })),
    credits: sheetRows(workbook, 'credits').map((row) => ({
      desc: String(row.desc ?? '').trim(),
      name: String(row.name ?? '').trim(),
      icon: String(row.icon ?? '').trim(),
    })),
  }
}
