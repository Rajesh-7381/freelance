import { useEffect, useState } from 'react'
import { loadPortfolio } from './lib/loadPortfolio'
import Nav from './components/Nav'
import Home from './components/Home'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPortfolio()
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (data?.profile?.site_title) {
      document.title = data.profile.site_title
    }
  }, [data])

  if (error) {
    return (
      <main className="status-screen">
        <p>Could not load portfolio data from Excel.</p>
        <p>{error}</p>
        <p>Put your file at public/content/portfolio.xlsx and refresh.</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="status-screen">
        <p>Loading portfolio…</p>
      </main>
    )
  }

  return (
    <>
      <Nav items={data.nav} />
      <Home
        profile={data.profile}
        social={data.social}
        skills={data.skills}
        services={data.services}
      />
      <Projects
        profile={data.profile}
        projects={data.projects}
        projectsError={data.projectsError}
        projectsSource={data.projectsSource}
        onProjectsLoaded={(projects) =>
          setData((current) => ({
            ...current,
            projects,
            projectsSource: 'upload',
            projectsError: '',
          }))
        }
      />
      <Contact profile={data.profile} />
      <Footer profile={data.profile} social={data.social} credits={data.credits} />
    </>
  )
}
