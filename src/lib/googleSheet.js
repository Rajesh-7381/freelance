import * as XLSX from 'xlsx'

const STORAGE_KEY = 'freelance-portfolio-projects'

function normalizeKey(key) {
  return String(key || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function cell(row, aliases) {
  const map = {}
  for (const [key, value] of Object.entries(row)) {
    map[normalizeKey(key)] = value
  }
  for (const alias of aliases) {
    const value = map[normalizeKey(alias)]
    if (value != null && String(value).trim() !== '') return String(value).trim()
  }
  return ''
}

function firstValue(row) {
  for (const value of Object.values(row)) {
    const text = String(value ?? '').trim()
    if (text) return text
  }
  return ''
}

function urlsIn(row) {
  return Object.values(row)
    .map((value) => String(value ?? '').trim())
    .filter((value) => /^https?:\/\//i.test(value))
}

function driveImage(url) {
  if (!url) return ''
  const fileId =
    url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1]
  if (fileId && url.includes('drive.google.com')) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return url
}

function parseCsv(text) {
  const workbook = XLSX.read(text, { type: 'string' })
  return rowsFromWorkbook(workbook)
}

function rowsFromWorkbook(workbook) {
  const preferred = workbook.SheetNames.find((name) => /project/i.test(name))
  const sheetName = preferred || workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

export function mapProject(row, index) {
  let title = cell(row, ['title', 'name', 'project', 'projectname', 'projecttitle', 'client'])
  let image = driveImage(
    cell(row, ['image', 'imageurl', 'thumbnail', 'screenshot', 'photo', 'cover', 'banner', 'img', 'ss']),
  )
  let github = cell(row, ['github', 'githuburl', 'githublink', 'git', 'repo', 'repository', 'code', 'source'])
  let preview = cell(row, [
    'preview',
    'live',
    'demo',
    'url',
    'link',
    'website',
    'liveurl',
    'livelink',
    'livedemo',
    'projecturl',
    'projectlink',
    'weblink',
  ])
  const status = cell(row, ['status', 'state', 'stage', 'year'])
  const description = cell(row, ['description', 'desc', 'about', 'summary', 'details'])
  const tech = cell(row, ['tech', 'techstack', 'stack', 'tags', 'tools', 'technology', 'technologies'])

  const urls = urlsIn(row)
  if (!image) {
    image = driveImage(urls.find((url) => /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url) || /drive\.google|imgur|cloudinary|images/i.test(url)) || '')
  }
  if (!github) github = urls.find((url) => /github\.com/i.test(url)) || ''
  if (!preview) preview = urls.find((url) => url !== github && url !== image) || ''
  if (!title) title = firstValue(row)
  if (!title) return null

  const visible = cell(row, ['visible', 'show', 'published', 'active'])
  if (visible && /^(no|false|0|hide|hidden)$/i.test(visible)) return null

  return {
    title,
    status,
    image: image || `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
    github,
    preview,
    description,
    tech,
    _index: index,
  }
}

function rowsToProjects(rows) {
  return rows.map(mapProject).filter(Boolean)
}

export function parseSpreadsheet(data, kind) {
  const workbook =
    kind === 'csv'
      ? XLSX.read(data, { type: 'string' })
      : XLSX.read(data, { type: 'array' })
  return rowsToProjects(rowsFromWorkbook(workbook))
}

export function saveUploadedProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function clearUploadedProjects() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function loadProjects() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(cached) && cached.length) {
      return { projects: cached, source: 'upload' }
    }
  } catch {
    // Ignore bad cache and fall through to files.
  }

  const csv = await fetch('/content/projects.csv')
  if (csv.ok) {
    const projects = rowsToProjects(parseCsv(await csv.text()))
    if (projects.length) return { projects, source: 'csv' }
  }

  const xlsx = await fetch('/content/projects.xlsx')
  if (xlsx.ok) {
    const workbook = XLSX.read(await xlsx.arrayBuffer(), { type: 'array' })
    const projects = rowsToProjects(rowsFromWorkbook(workbook))
    if (projects.length) return { projects, source: 'xlsx' }
  }

  return {
    projects: [],
    source: 'none',
    error: 'Load your Excel/CSV with the button above. The Google Sheet itself is private, so the site cannot open that URL.',
  }
}
