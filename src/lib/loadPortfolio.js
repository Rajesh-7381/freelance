import * as XLSX from 'xlsx'
import { loadProjects } from './googleSheet'

function sheetRows(workbook, name) {
  const sheet = workbook.Sheets[name]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

function toObject(rows) {
  const data = {}
  for (const row of rows) {
    const key = String(row.key ?? '').trim()
    if (key) data[key] = String(row.value ?? '')
  }
  return data
}

function groupServices(rows) {
  const order = []
  const map = new Map()

  for (const row of rows) {
    const category = String(row.category ?? '').trim()
    if (!category) continue
    if (!map.has(category)) {
      map.set(category, {
        category,
        icon: String(row.icon ?? 'web').trim() || 'web',
        items: [],
      })
      order.push(category)
    }
    const item = String(row.item ?? '').trim()
    if (item) map.get(category).items.push(item)
  }

  return order.map((name) => map.get(name))
}

export async function loadPortfolio() {
  const response = await fetch('/content/portfolio.xlsx')
  if (!response.ok) {
    throw new Error(`Could not load Excel file (${response.status})`)
  }

  const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' })
  const profile = toObject(sheetRows(workbook, 'profile'))

  let projects = []
  let projectsSource = 'none'
  let projectsError = ''

  try {
    const loaded = await loadProjects()
    projects = loaded.projects
    projectsSource = loaded.source
    projectsError = loaded.error || ''
  } catch (error) {
    projectsError = error.message
  }

  return {
    profile,
    nav: sheetRows(workbook, 'nav').map((row) => ({
      label: String(row.label ?? '').trim(),
      href: String(row.href ?? '').trim(),
      icon: String(row.icon ?? 'home').trim() || 'home',
    })),
    social: sheetRows(workbook, 'social').map((row) => ({
      label: String(row.label ?? '').trim(),
      url: String(row.url ?? '').trim(),
      icon: String(row.icon ?? 'github').trim() || 'github',
    })),
    skills: sheetRows(workbook, 'skills').map((row) => ({
      name: String(row.name ?? '').trim(),
      icon: String(row.icon ?? '').trim(),
    })),
    services: groupServices(sheetRows(workbook, 'services')),
    projects,
    projectsSource,
    projectsError,
    credits: sheetRows(workbook, 'credits').map((row) => ({
      desc: String(row.desc ?? '').trim(),
      name: String(row.name ?? '').trim(),
      icon: String(row.icon ?? '').trim(),
    })),
  }
}
