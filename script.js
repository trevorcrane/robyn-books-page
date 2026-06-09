(() => {
  const modal = document.getElementById('waitlist-modal');
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('form-success');
  const openers = document.querySelectorAll('[data-open-modal="waitlist"]');
  const closers = document.querySelectorAll('[data-close-modal]');
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const firstInput = modal.querySelector('input, button, a');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  openers.forEach((button) => button.addEventListener('click', openModal));
  closers.forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  form.addEventListener('submit', (event) => {
    const successMode = form.dataset.successMode || 'message';
    if (successMode === 'redirect') return;

    event.preventDefault();
    form.hidden = true;
    success.hidden = false;
    success.focus();

    try {
      const entries = Object.fromEntries(new FormData(form).entries());
      window.localStorage.setItem('robynWaitlistPlaceholder', JSON.stringify({ ...entries, submittedAt: new Date().toISOString() }));
    } catch (error) {
      // Non-critical: storage may be blocked. The visible success state still works.
    }
  });
})();
