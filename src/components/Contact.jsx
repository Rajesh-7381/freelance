import { useState } from 'react'

export default function Contact({ profile }) {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const form = event.currentTarget
    const data = new FormData(form)

    if (profile.form_endpoint) {
      try {
        const response = await fetch(profile.form_endpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Failed')
        form.reset()
        setSent(true)
      } catch {
        setError('There was a problem sending your message.')
      }
      return
    }

    form.reset()
    setSent(true)
  }

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <h2 className="kicker shiny-sec">{profile.contact_kicker}</h2>
        <h3 className="section-title">{profile.contact_heading}</h3>
        <div className="contact-grid">
          <div className="contact-copy">
            <p>{profile.contact_text}</p>
            {profile.location ? (
              <p>
                Location: <span>{profile.location}</span>
              </p>
            ) : null}
            {profile.mobile ? (
              <p>
                Mobile: <span>{profile.mobile}</span>
              </p>
            ) : null}
          </div>
          <div>
            {sent ? (
              <p className="form-success">{profile.form_success}</p>
            ) : (
              <form className="contact-form" onSubmit={onSubmit}>
                <input name="from_name" type="text" placeholder="Name" required />
                <input name="reply_to" type="email" placeholder="Email" required />
                <textarea name="message" placeholder="Message" rows="6" required />
                <button type="submit">Submit</button>
                {error ? <p className="form-error">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
