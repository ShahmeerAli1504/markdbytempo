'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ label = 'Submit', pendingLabel = 'Saving…', className = 'btn btn-primary' }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function ActionForm({ action, children, submitLabel, pendingLabel, className = 'form', submitClassName }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.reset) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state?.error && <p className="form-msg is-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="form-msg is-ok" role="status">{state.message}</p>}
      {submitLabel && <SubmitButton label={submitLabel} pendingLabel={pendingLabel} className={submitClassName} />}
    </form>
  );
}
