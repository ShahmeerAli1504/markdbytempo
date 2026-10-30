import { site } from '@/lib/site';

export const metadata = {
  title: 'Terms of Service',
  description: `The terms for using ${site.name} as an athlete or sponsor.`,
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <section className="section">
      <div className="wrap prose">
        <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)' }}>Terms of Service</h1>
        <p className="muted">Last updated October 30, 2026</p>
        <p>These terms govern your use of {site.name} (“Markd”, “we”). By submitting a pledge, an athlete application or any other form, you agree to them.</p>
        <h2>1. What Markd does</h2>
        <p>Markd is a listing and messaging platform that helps athletes present sponsorship opportunities and helps businesses find athletes to sponsor. Markd coordinates sponsorships between athletes and sponsors but does not process card payments on this website.</p>
        <h2>2. Your information</h2>
        <p>You must provide accurate information and be at least 18, or have a parent or guardian apply on your behalf.</p>
        <h2>3. Athlete obligations</h2>
        <p>Athletes must describe spots honestly, deliver accepted sponsorships as described, post race-day proof where promised, and refund sponsors in full if they cannot deliver. Athletes are responsible for complying with the rules of their race and any governing body regarding apparel and logos.</p>
        <h2>4. Sponsor obligations</h2>
        <p>Sponsors must own or have the right to use any logo they upload, and must not request placements that are unlawful, misleading or offensive. Sponsors pay only after their pledge is confirmed, using the payment details we send.</p>
        <h2>5. Content</h2>
        <p>You keep ownership of content you upload and grant Markd a licence to display it on the platform and in promotion of your campaign. We may remove content that breaks these terms.</p>
        <h2>6. Disputes</h2>
        <p>Disputes about a sponsorship are between the athlete and sponsor. We may help mediate and may remove athletes or sponsors who don’t act in good faith.</p>
        <h2>7. Liability</h2>
        <p>Markd is provided “as is”. To the extent permitted by law, we are not liable for indirect losses or for the conduct of athletes or sponsors.</p>
        <h2>8. Contact</h2>
        <p>Questions: <a className="accent" href={`mailto:${site.email}`}>{site.email}</a></p>
      </div>
    </section>
  );
}
