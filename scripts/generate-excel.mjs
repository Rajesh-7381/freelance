import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as XLSX from 'xlsx'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'public', 'content', 'portfolio.xlsx')

function sheet(name, rows) {
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.min(
      80,
      Math.max(
        key.length + 2,
        ...rows.map((row) => String(row[key] ?? '').length + 2),
      ),
    ),
  }))
  return { name, ws }
}

const workbook = XLSX.utils.book_new()

const sheets = [
  sheet('profile', [
    { key: 'logo', value: 'LOGO' },
    { key: 'name', value: 'Studio' },
    { key: 'site_title', value: 'Studio | We build digital products' },
    { key: 'hero_title', value: 'WE BUILD DIGITAL PRODUCTS' },
    { key: 'hero_tags', value: 'Mobile • Web • Backend • AI' },
    { key: 'hero_cta', value: 'Start a Project' },
    { key: 'services_heading', value: 'SERVICES' },
    { key: 'builds_heading', value: 'WHAT WE CAN BUILD' },
    { key: 'team_heading', value: 'OUR TEAM' },
    { key: 'process_heading', value: 'HOW WE WORK' },
    { key: 'why_heading', value: 'WHY US' },
    { key: 'cta_title', value: 'HAVE AN IDEA?' },
    { key: 'cta_subtitle', value: "LET'S BUILD IT." },
    { key: 'cta_button', value: 'Contact Us' },
    { key: 'location', value: 'Ameerpet, Hyderabad, 500016' },
    { key: 'mobile', value: '7095399332, 7381277084' },
    { key: 'email', value: 'hello@example.com' },
    { key: 'contact_kicker', value: "Let's talk" },
    { key: 'contact_heading', value: 'Contact' },
    { key: 'contact_text', value: 'Have a question or a project in mind? Feel free to reach out.' },
    { key: 'form_endpoint', value: '' },
    { key: 'form_success', value: 'Thank you for your message!' },
    { key: 'copyright_name', value: 'Studio' },
    { key: 'copyright_credit', value: '' },
    { key: 'distributed_by', value: '' },
    { key: 'distributed_url', value: '' },
  ]),
  sheet('nav', [
    { label: 'Services', href: '#services' },
    { label: 'Team', href: '#team' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]),
  sheet('services', [
    { name: 'Mobile', icon: 'mobile' },
    { name: 'Web', icon: 'web' },
    { name: 'Backend', icon: 'backend' },
    { name: 'AI', icon: 'ai' },
    { name: 'APIs', icon: 'api' },
    { name: 'UI/UX', icon: 'design' },
  ]),
  sheet('builds', [
    { name: 'Apps', icon: 'mobile' },
    { name: 'E-commerce', icon: 'shop' },
    { name: 'Booking', icon: 'booking' },
    { name: 'Delivery', icon: 'delivery' },
    { name: 'Business', icon: 'business' },
    { name: 'AI', icon: 'ai' },
  ]),
  sheet('team', [
    { name: 'Deekshith Chakilam', role: 'Developer', photo: '' },
    { name: 'Rajesh Swain', role: 'Developer', photo: '' },
  ]),
  sheet('process', [
    { step: '1', label: 'Discuss' },
    { step: '2', label: 'Plan' },
    { step: '3', label: 'Design' },
    { step: '4', label: 'Build' },
    { step: '5', label: 'Launch' },
  ]),
  sheet('why', [
    { text: 'Experienced team' },
    { text: 'Modern technology' },
    { text: 'Direct communication' },
    { text: 'End-to-end development' },
  ]),
  sheet('social', [
    { label: 'GitHub', url: 'https://github.com/Deekshith2-dot', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/deekshith-chakilam-b0074823b/', icon: 'linkedin' },
    { label: 'Email', url: 'deekshith2.chakilam@gmail.com', icon: 'email' },
  ]),
  sheet('credits', [
    { desc: 'Built with', name: 'React', icon: 'react.svg' },
    { desc: 'Content from', name: 'Excel', icon: 'git.svg' },
  ]),
]

for (const { name, ws } of sheets) {
  XLSX.utils.book_append_sheet(workbook, ws, name)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
console.log(`Wrote ${outPath}`)
