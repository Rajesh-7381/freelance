export default function Process({ heading, steps }) {
  return (
    <section id="about" className="band">
      <div className="wrap">
        <h2>{heading}</h2>
        <ol className="process">
          {steps.map((step, index) => (
            <li key={step.label}>
              <span className="process-step">{step.label}</span>
              {index < steps.length - 1 ? <span className="process-arrow">→</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
