// Shared by the kit map, the package ladder and the sponsor form.
// On the campaign page the form is present → select the spot and scroll to it.
// Anywhere else → go to the campaign page with ?spot= so the form opens on it.
export const PICK_EVENT = 'markd:pick-spot';

export function pickSpot(spotId, campaignHref) {
  if (typeof window === 'undefined') return;
  const form = document.getElementById('sponsor');
  if (form) {
    window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: spotId }));
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (campaignHref) {
    window.location.href = `${campaignHref}?spot=${encodeURIComponent(spotId)}#sponsor`;
  }
}
