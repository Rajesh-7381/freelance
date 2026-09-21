import SocialLinks from './SocialLinks'

export default function Footer({ profile, social, credits }) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <SocialLinks links={social} className="footer-social" />
        <div className="credits">
          {credits.map((credit) => (
            <p key={credit.name}>
              <span>{credit.desc}</span>
              <img src={`/svg/${credit.icon}`} alt="" />
              <strong>{credit.name}</strong>
            </p>
          ))}
        </div>
        <p className="copyright">
          {`Copyright © ${year} ${profile.copyright_name}. All rights reserved${
            profile.copyright_credit ? ` by ${profile.copyright_credit}` : ''
          }.`}
          {profile.distributed_by ? (
            <>
              {' '}
              Distributed by{' '}
              <a href={profile.distributed_url || '#'} target="_blank" rel="noreferrer">
                {profile.distributed_by}
              </a>
            </>
          ) : null}
        </p>
      </div>
    </footer>
  )
}
