import Link from 'next/link';
import ActionForm from '@/components/ActionForm';
import { sendContact } from '@/app/actions';
import { site } from '@/lib/site';

export const metadata = {
  title: 'About Markd — our mission',
  description: `${site.mission} Learn why Markd by Tempo exists and get in touch.`,
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>About</span></nav>
          <span className="eyebrow">About</span>
          <h1>Every athlete<br /><span className="accent">deserves a sponsor.</span></h1>
          <p>{site.mission}</p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap cmp-grid">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Why we built Markd</h2>
            <p>Sponsorship used to be for the elite — the athletes with agents and six-figure followings. Meanwhile, thousands of everyday racers train before work, pay their own entry fees and drive hours to the start line.</p>
            <p>Local businesses want exactly what those athletes have: real people, real stories and a community that shows up. Markd puts them together. Athletes list what they can offer; businesses pick a spot at any budget; everyone wins on race day.</p>
            <h2>What we believe</h2>
            <ul>
              <li><strong>Any size sponsorship counts.</strong> A $25 supporter is as welcome as a full-kit partner.</li>
              <li><strong>Athletes stay in control.</strong> They choose their spots and approve every sponsor.</li>
              <li><strong>Proof over promises.</strong> Race-day photos go up on every campaign.</li><li><strong>No hoops.</strong> No accounts or passwords — just a form.</li>
              <li><strong>Local first.</strong> Built in {site.region}, for communities everywhere.</li>
            </ul>
            <h2>{site.tagline}</h2>
          </div>
          <div className="panel" id="contact">
            <h2>Get in touch</h2>
            <ActionForm action={sendContact} submitLabel="Send message" pendingLabel="Sending…" submitClassName="btn btn-primary btn-block">
              <div className="hp" aria-hidden="true"><label>Company URL<input name="company_url" tabIndex={-1} autoComplete="off" /></label></div>
              <label className="field"><span>Name</span><input name="name" required autoComplete="name" /></label>
              <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
              <label className="field">
                <span>I’m a…</span>
                <select name="topic" defaultValue="athlete">
                  <option value="athlete">Athlete</option>
                  <option value="sponsor">Business / sponsor</option>
                  <option value="press">Press</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="field"><span>Message</span><textarea name="body" rows={5} required /></label>
            </ActionForm>
            <p className="muted small" style={{ marginTop: 14 }}>Or email <a className="accent" href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
        </div>
      </section>
      <div style={{ height: 64 }} />
    </>
  );
}
