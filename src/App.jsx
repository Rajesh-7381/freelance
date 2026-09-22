import { useEffect, useState } from 'react'
import { loadPortfolio } from './lib/loadPortfolio'
import Nav from './components/Nav'
import Hero from './components/Hero'
import CardGrid from './components/CardGrid'
import Team from './components/Team'
import Process from './components/Process'
import WhyUs from './components/WhyUs'
import Cta from './components/Cta'
// import Projects from './components/Projects'
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
        <p>Could not load site data from Excel.</p>
        <p>{error}</p>
        <p>Put your file at public/content/portfolio.xlsx and refresh.</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="status-screen">
        <p>Loading…</p>
      </main>
    )
  }

  return (
    <>
      <Nav logo={data.profile.logo || data.profile.name} items={data.nav} />
      <Hero profile={data.profile} />
      <CardGrid id="services" heading={data.profile.services_heading} items={data.services} />
      <CardGrid id="builds" heading={data.profile.builds_heading} items={data.builds} />
      <Team heading={data.profile.team_heading} people={data.team} />
      <Process heading={data.profile.process_heading} steps={data.process} />
      <WhyUs heading={data.profile.why_heading} items={data.why} />
      <Cta profile={data.profile} />
      {/*
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
      */}
      <Contact profile={data.profile} />
      <Footer profile={data.profile} social={data.social} credits={data.credits} />
    </>
  )
}
