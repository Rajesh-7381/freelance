import { Icon } from '../lib/icons'

export default function Projects({ profile, projects }) {
  return (
    <section id="projects" className="projects">
      <div className="wrap">
        <h2 className="kicker shiny-sec">{profile.projects_kicker}</h2>
        <h3 className="section-title">{profile.projects_heading}</h3>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.title} className="project">
              <a href={project.preview || project.github || '#'} target="_blank" rel="noreferrer">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
              </a>
              <div className="project-meta">
                <div>
                  <h4>{project.title}</h4>
                  <span>{project.status}</span>
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
