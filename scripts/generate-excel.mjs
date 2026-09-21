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
  sheet('instructions', [
    {
      sheet: 'profile',
      how_to_edit:
        'Key/value rows. Change greeting, title, bio, highlight word, location, email, and links. Title can include a line break with \\n.',
    },
    {
      sheet: 'nav',
      how_to_edit:
        'One row per menu item. href is a page section id like #home. icon is home, projects, or contact.',
    },
    {
      sheet: 'social',
      how_to_edit:
        'One row per social button. icon is github, linkedin, or email. Put the full URL (or mailto:).',
    },
    {
      sheet: 'skills',
      how_to_edit:
        'Tech marquee. name is the label. icon is a file in public/svg (example: react.svg).',
    },
    {
      sheet: 'services',
      how_to_edit:
        'What I do accordion. Repeat the same category on multiple rows. icon is web, mobile, or design.',
    },
    {
      sheet: 'projects',
      how_to_edit:
        'One row per project. image can be a URL or /images/file.jpg in public. github and preview are links.',
    },
    {
      sheet: 'credits',
      how_to_edit: 'Footer “built with” lines. icon is a file in public/svg.',
    },
  ]),
  sheet('profile', [
    { key: 'name', value: 'Your Name' },
    { key: 'greeting', value: "Hi, I'm Your Name" },
    { key: 'title', value: 'Software\nDeveloper' },
    {
      key: 'bio',
      value:
        'Transforming ideas into interactive and seamless digital experiences with cutting-edge {highlight} development.',
    },
    { key: 'highlight', value: 'frontend' },
    { key: 'location', value: 'Your country' },
    { key: 'email', value: 'hello@example.com' },
    { key: 'site_title', value: 'Your Name | Portfolio' },
    { key: 'projects_kicker', value: 'My work' },
    { key: 'projects_heading', value: 'Projects' },
    { key: 'more_projects_label', value: 'More projects on' },
    { key: 'more_projects_url', value: 'https://github.com' },
    { key: 'contact_kicker', value: "Let's talk" },
    { key: 'contact_heading', value: 'Contact' },
    {
      key: 'contact_text',
      value: 'Have a question or a project in mind? Feel free to reach out.',
    },
    { key: 'form_endpoint', value: '' },
    { key: 'form_success', value: 'Thank you for your message!' },
    { key: 'services_heading', value: 'What I do?' },
    { key: 'copyright_name', value: 'Your Name' },
    { key: 'copyright_credit', value: 'Andres Hernandez' },
    { key: 'distributed_by', value: 'ThemeWagon' },
    { key: 'distributed_url', value: 'https://themewagon.com' },
  ]),
  sheet('nav', [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'Projects', href: '#projects', icon: 'projects' },
    { label: 'Contact', href: '#contact', icon: 'contact' },
  ]),
  sheet('social', [
    { label: 'GitHub', url: 'https://github.com', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:hello@example.com', icon: 'email' },
  ]),
  sheet('skills', [
    { name: 'Astro', icon: 'astro.svg' },
    { name: 'Vue', icon: 'vue.svg' },
    { name: 'React', icon: 'react.svg' },
    { name: 'TypeScript', icon: 'typeScript.svg' },
    { name: 'Tailwindcss', icon: 'tailwindcss.svg' },
    { name: 'Next', icon: 'next.svg' },
    { name: 'Nodejs', icon: 'nodejs.svg' },
    { name: 'HTML5', icon: 'HTML5.svg' },
    { name: 'CSS3', icon: 'CSS3.svg' },
    { name: 'JavaScript', icon: 'javaScript.svg' },
    { name: 'Git', icon: 'git.svg' },
    { name: 'Supabase', icon: 'supabase.svg' },
    { name: 'Mysql', icon: 'mysql.svg' },
    { name: 'Bash', icon: 'bash.svg' },
  ]),
  sheet('services', [
    { category: 'Web Development', item: 'Single Page Applications (SPAs)', icon: 'web' },
    { category: 'Web Development', item: 'Landing pages and business websites', icon: 'web' },
    { category: 'Web Development', item: 'Portfolio websites', icon: 'web' },
    { category: 'Mobile Development', item: 'Mobile-friendly web apps', icon: 'mobile' },
    { category: 'Mobile Development', item: 'React Native mobile apps', icon: 'mobile' },
    {
      category: 'UI/UX Design & Prototyping',
      item: 'UI design with Figma & Canva',
      icon: 'design',
    },
    {
      category: 'UI/UX Design & Prototyping',
      item: 'UX research & improvements',
      icon: 'design',
    },
    {
      category: 'UI/UX Design & Prototyping',
      item: 'Prototyping for websites & mobile apps',
      icon: 'design',
    },
  ]),
  sheet('projects', [
    {
      title: 'Project One',
      status: 'Deployed',
      image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+One',
      github: 'https://github.com',
      preview: '#!',
    },
    {
      title: 'Project Two',
      status: 'On Development',
      image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+Two',
      github: 'https://github.com',
      preview: '#!',
    },
    {
      title: 'Project Three',
      status: 'Contributor',
      image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+Three',
      github: 'https://github.com',
      preview: '#!',
    },
    {
      title: 'Project Four',
      status: 'Deployed',
      image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+Four',
      github: 'https://github.com',
      preview: '#!',
    },
  ]),
  sheet('credits', [
    { desc: 'Built with', name: 'React', icon: 'react.svg' },
    { desc: 'Styled with', name: 'CSS', icon: 'CSS3.svg' },
    { desc: 'Content from', name: 'Excel', icon: 'git.svg' },
  ]),
]

for (const { name, ws } of sheets) {
  XLSX.utils.book_append_sheet(workbook, ws, name)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
console.log(`Wrote ${outPath}`)
