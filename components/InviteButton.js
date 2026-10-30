'use client';

import { useEffect, useRef, useState } from 'react';

const COPY = {
  athlete: {
    title: 'Invite an athlete',
    text: 'You should get sponsored for your next race — local businesses back athletes on Markd. Apply for a free page:',
    path: '/get-sponsored',
  },
  sponsor: {
    title: 'Invite a sponsor',
    text: 'Want your logo at the start line? Sponsor a local athlete’s race on Markd — any budget works:',
    path: '/sponsors',
  },
};

export default function InviteButton({ kind = 'athlete', className = 'btn btn-ghost', label }) {
  const dialog = useRef(null);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState(COPY[kind].path);
  const c = COPY[kind];

  useEffect(() => {
    setUrl(`${window.location.origin}${c.path}`);
  }, [c.path]);

  const full = `${c.text} ${url}`;
  const enc = encodeURIComponent(full);

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function open() {
    if (navigator.share && window.matchMedia('(max-width: 640px)').matches) {
      try {
        await navigator.share({ title: c.title, text: c.text, url });
        return;
      } catch {
        /* fall through to dialog */
      }
    }
    dialog.current?.showModal();
  }

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {label || c.title}
      </button>
      <dialog ref={dialog} className="modal" onClick={(e) => e.target === dialog.current && dialog.current.close()}>
        <div className="modal-inner">
          <div className="modal-head">
            <h2>{c.title}</h2>
            <button type="button" className="modal-x" aria-label="Close" onClick={() => dialog.current.close()}>×</button>
          </div>
          <label className="field">
            <span>Message</span>
            <textarea readOnly rows={4} value={full} />
          </label>
          <div className="share-grid">
            <a className="btn btn-ghost" href={`sms:?&body=${enc}`}>Text</a>
            <a className="btn btn-ghost" href={`mailto:?subject=${encodeURIComponent(c.title)}&body=${enc}`}>Email</a>
            <a className="btn btn-ghost" href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button type="button" className="btn btn-primary" onClick={copy}>{copied ? 'Copied ✓' : 'Copy link'}</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
