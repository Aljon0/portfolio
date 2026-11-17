import { TestimonialsMarquee } from "@/components/sections/TestimonialsMarquee";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { certifications, education, experience } from "@/data/portfolio";

export function Journey() {
  const verifiedCertifications = certifications.filter((c) => c.verified);

  return (
    <Section
      id="journey"
      index="02"
      label="Journey"
      title="Experience and feedback from the people I've worked with."
    >
      <div className="relative">
        <span
          aria-hidden="true"
          data-progress-line
          className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
        />
        <ol
          data-reveal-children="fade-left"
          className="space-y-12 border-l border-line-strong pl-6 sm:pl-10"
        >
          {experience.map((item) => (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                data-timeline-dot
                className="absolute left-[calc(-1.75rem-0.5px)] top-1 h-2 w-2 rounded-full bg-accent sm:left-[calc(-2.75rem-0.5px)]"
              />
              <p className="font-mono text-label text-accent-text">
                {item.startDate} – {item.endDate}
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">{item.role}</h3>
              <p className="text-muted">{item.organization}</p>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 grid gap-12 md:grid-cols-2">
        {education.length > 0 ? (
          <div>
            <h3 className="font-mono text-label text-muted">Education</h3>
            <ul className="mt-4 space-y-5">
              {education.map((item) => (
                <li key={item.id}>
                  <p className="font-display text-lg">{item.degree}</p>
                  <p className="text-muted">
                    {item.school}, {item.location}
                  </p>
                  <p className="mt-1 font-mono text-label text-accent-text">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {verifiedCertifications.length > 0 ? (
          <div>
            <h3 className="font-mono text-label text-muted">Certifications</h3>
            <ul className="mt-4 space-y-5">
              {verifiedCertifications.map((cert) => (
                <li key={cert.id}>
                  <p className="font-display text-lg">{cert.title}</p>
                  <p className="text-muted">
                    {cert.issuer}, {cert.year}
                  </p>
                  {cert.image ? (
                    <div className="mt-2">
                      <TextLink href={cert.image} external>
                        View certificate
                      </TextLink>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-20">
        <h3 className="font-mono text-label text-muted">Feedback</h3>
        <div data-reveal="fade-up" className="mt-6">
          <TestimonialsMarquee />
        </div>
      </div>
    </Section>
  );
}