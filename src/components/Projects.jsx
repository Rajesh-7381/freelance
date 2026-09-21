import { Icon } from '../lib/icons'
import { clearUploadedProjects, parseSpreadsheet, saveUploadedProjects } from '../lib/googleSheet'

export default function Projects({ profile, projects, projectsError, projectsSource, onProjectsLoaded }) {
  const onFile = async (event) => {
    const file = event.target.files?.[0]
  
    if (!file) {
      console.log('No file selected')
      return
    }
  
    console.log('FILE:', file)
    console.log('FILE NAME:', file.name)
    console.log('FILE TYPE:', file.type)
  
    try {
      const isCsv =
        file.name.toLowerCase().endsWith('.csv') ||
        file.type.includes('csv')
  
      console.log('IS CSV:', isCsv)
  
      const data = isCsv
        ? await file.text()
        : await file.arrayBuffer()
  
      console.log('DATA:', data)
  
      const parsed = parseSpreadsheet(
        data,
        isCsv ? 'csv' : 'xlsx'
      )
  
      console.log('PARSED PROJECTS:', parsed)
      console.log('PARSED LENGTH:', parsed.length)
  
      if (!parsed.length) {
        alert(
          'The file opened, but no project rows were found. Keep column headers in the first row.'
        )
        return
      }
  
      saveUploadedProjects(parsed)
  
      console.log('Calling onProjectsLoaded')
  
      onProjectsLoaded(parsed)
  
      console.log('Projects loaded successfully')
    } catch (error) {
      console.error('EXCEL ERROR:', error)
  
      alert(
        error.message || 'Could not read that spreadsheet.'
      )
    } finally {
      event.target.value = ''
    }
  }

  const reset = () => {
    clearUploadedProjects()
    window.location.reload()
  }

  return (
    <section id="projects" className="projects">
      <div className="wrap">
        <h2 className="kicker shiny-sec">{profile.projects_kicker}</h2>
        <div className="projects-heading">
          <h3 className="section-title">{profile.projects_heading}</h3>
          <label className="excel-load">
            Load Excel
            <input type="file" accept=".csv,.xlsx,.xls" onChange={onFile} hidden />
          </label>
          {projectsSource === 'upload' ? (
            <button type="button" className="excel-reset" onClick={reset}>
              Clear
            </button>
          ) : null}
        </div>
        <p className="projects-hint">
          Your Google Sheet URL is private, so the site cannot read it from the internet. Download it as Excel/CSV, then click Load Excel.
        </p>
        {projectsError ? <p className="projects-note">{projectsError}</p> : null}
        <div className="project-grid">
          {projects.map((project, index) => (
            <article key={`${project.title}-${index}`} className="project">
              <a href={project.preview || project.github || '#'} target="_blank" rel="noreferrer">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
              </a>
              <div className="project-meta">
                <div>
                  <h4>{project.title}</h4>
                  {project.status ? <span>{project.status}</span> : null}
                  {project.description ? <p className="project-desc">{project.description}</p> : null}
                  {project.tech ? <p className="project-tech">{project.tech}</p> : null}
                </div>
                <div className="project-actions">
                  {project.github ? (
                    <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-btn">
                      <Icon name="code" className="action-icon" />
                    </a>
                  ) : null}
                  {project.preview ? (
                    <a href={project.preview} target="_blank" rel="noreferrer" aria-label="Preview" className="icon-btn">
                      <Icon name="preview" className="action-icon" />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
        {profile.more_projects_url ? (
          <a
            className="more-projects"
            href={profile.more_projects_url}
            target="_blank"
            rel="noreferrer"
          >
            <span>{profile.more_projects_label}</span>
            <Icon name="github" className="more-icon" />
          </a>
        ) : null}
      </div>
    </section>
  )
}
