/**
 * FEEDBACK WIDGET MODULE
 * Floating action button + modal for collecting user feedback.
 * Serializes to JSON format compatible with feedbackv01.md.
 */

const Feedback = (() => {

  function init() {
    injectStyles();
    injectFAB();
    injectModal();
  }

  // ── Styles ──
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .feedback-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 900;
        padding: 12px 20px;
        border: none;
        border-radius: 100px;
        background: linear-gradient(135deg, var(--green, #00C27C), var(--teal, #00B4D8));
        color: #0D0D0F;
        font-family: var(--font-body, 'DM Sans', sans-serif);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,194,124,0.3);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .feedback-fab:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(0,194,124,0.4);
      }

      .feedback-backdrop {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 950;
        background: rgba(0,0,0,0.6);
        animation: fbFadeIn 0.2s ease;
      }
      .feedback-backdrop.open { display: block; }

      .feedback-modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 960;
        width: 90%;
        max-width: 440px;
        max-height: 90vh;
        overflow-y: auto;
        background: var(--card, #141418);
        border: 1px solid var(--border, #242428);
        border-radius: 16px;
        padding: 28px 24px;
        animation: fbSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .feedback-modal.open { display: block; }

      .feedback-modal h3 {
        font-family: var(--font-display, 'Bebas Neue', sans-serif);
        font-size: 28px;
        letter-spacing: 0.03em;
        color: var(--text, #E8E8F0);
        margin-bottom: 4px;
      }

      .feedback-page-info {
        font-size: 11px;
        color: var(--muted, #6B6B75);
        margin-bottom: 20px;
        font-family: var(--font-mono, 'DM Mono', monospace);
        letter-spacing: 0.05em;
      }

      .fb-type-row {
        display: flex;
        gap: 6px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .fb-type-btn {
        flex: 1;
        min-width: 100px;
        padding: 10px 8px;
        border: 1px solid var(--border, #242428);
        border-radius: 10px;
        background: transparent;
        color: var(--sub, #A0A0B0);
        font-family: var(--font-body, 'DM Sans', sans-serif);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }
      .fb-type-btn:hover { border-color: var(--sub, #A0A0B0); }
      .fb-type-btn.active {
        border-color: var(--green, #00C27C);
        background: rgba(0,194,124,0.08);
        color: var(--text, #E8E8F0);
      }

      .fb-field { margin-bottom: 14px; }
      .fb-field label {
        display: block;
        font-size: 11px;
        font-weight: 500;
        color: var(--sub, #A0A0B0);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
      }
      .fb-field textarea,
      .fb-field input {
        width: 100%;
        padding: 10px 14px;
        background: var(--dark, #0D0D0F);
        border: 1px solid var(--border, #242428);
        border-radius: 8px;
        color: var(--text, #E8E8F0);
        font-family: var(--font-body, 'DM Sans', sans-serif);
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      .fb-field textarea { min-height: 100px; resize: vertical; }
      .fb-field textarea:focus,
      .fb-field input:focus { border-color: var(--green, #00C27C); }
      .fb-field textarea::placeholder,
      .fb-field input::placeholder { color: var(--muted, #6B6B75); }

      .fb-actions {
        display: flex;
        gap: 10px;
        margin-top: 18px;
      }
      .fb-actions button {
        flex: 1;
        padding: 12px;
        border-radius: 10px;
        font-family: var(--font-body, 'DM Sans', sans-serif);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .fb-btn-cancel {
        background: var(--card-alt, #1A1A1F);
        color: var(--sub, #A0A0B0);
        border: 1px solid var(--border, #242428) !important;
      }
      .fb-btn-submit {
        background: linear-gradient(135deg, var(--green, #00C27C), var(--teal, #00B4D8));
        color: #0D0D0F;
      }
      .fb-btn-submit:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .fb-success {
        text-align: center;
        padding: 20px 0;
      }
      .fb-success-icon { font-size: 40px; margin-bottom: 12px; }
      .fb-success p {
        font-size: 14px;
        color: var(--sub, #A0A0B0);
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .fb-success button {
        padding: 10px 20px;
        border-radius: 10px;
        border: 1px solid var(--border, #242428);
        background: var(--card, #141418);
        color: var(--text, #E8E8F0);
        font-family: var(--font-body, 'DM Sans', sans-serif);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      @keyframes fbFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes fbSlideUp {
        from { opacity: 0; transform: translate(-50%, -45%); }
        to   { opacity: 1; transform: translate(-50%, -50%); }
      }

      @media (max-width: 480px) {
        .feedback-fab { bottom: 80px; right: 16px; padding: 10px 16px; font-size: 12px; }
        .feedback-modal { width: 95%; padding: 20px 16px; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── FAB Button ──
  function injectFAB() {
    const fab = document.createElement('button');
    fab.className = 'feedback-fab';
    fab.innerHTML = `<span>💬</span> <span>${i18n('feedbackButtonLabel')}</span>`;
    fab.addEventListener('click', openModal);
    document.body.appendChild(fab);
  }

  // ── Modal ──
  function injectModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'feedback-backdrop';
    backdrop.id = 'fb-backdrop';
    backdrop.addEventListener('click', closeModal);

    const modal = document.createElement('div');
    modal.className = 'feedback-modal';
    modal.id = 'fb-modal';
    modal.addEventListener('click', e => e.stopPropagation());

    renderForm(modal);

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
  }

  function renderForm(modal) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    modal.innerHTML = `
      <h3>${i18n('feedbackTitle')}</h3>
      <div class="feedback-page-info">${i18n('feedbackPageLabel')}: ${page}</div>

      <div class="fb-type-row">
        <button class="fb-type-btn active" data-type="bug">${i18n('feedbackTypeBug')}</button>
        <button class="fb-type-btn" data-type="improvement">${i18n('feedbackTypeImprovement')}</button>
        <button class="fb-type-btn" data-type="positive">${i18n('feedbackTypePositive')}</button>
      </div>

      <div class="fb-field">
        <label>${i18n('feedbackDescriptionLabel')}</label>
        <textarea id="fb-message" placeholder="${i18n('feedbackDescriptionPlaceholder')}" maxlength="2000"></textarea>
      </div>

      <div class="fb-field">
        <label>${i18n('feedbackNameLabel')}</label>
        <input type="text" id="fb-name" maxlength="100">
      </div>

      <div class="fb-field">
        <label>${i18n('feedbackEmailLabel')}</label>
        <input type="email" id="fb-email" maxlength="200">
      </div>

      <div class="fb-actions">
        <button class="fb-btn-cancel" onclick="Feedback.close()">${i18n('feedbackCancel')}</button>
        <button class="fb-btn-submit" id="fb-submit" disabled>${i18n('feedbackSubmit')}</button>
      </div>
    `;

    // Type toggle
    modal.querySelectorAll('.fb-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.fb-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Enable submit when message is not empty
    const msgField = modal.querySelector('#fb-message');
    const submitBtn = modal.querySelector('#fb-submit');
    msgField.addEventListener('input', () => {
      submitBtn.disabled = msgField.value.trim().length === 0;
    });

    submitBtn.addEventListener('click', handleSubmit);
  }

  function handleSubmit() {
    const modal = document.getElementById('fb-modal');
    const activeType = modal.querySelector('.fb-type-btn.active');
    const page = window.location.pathname.split('/').pop() || 'index.html';

    const entry = {
      id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString(),
      page: page,
      type: activeType ? activeType.dataset.type : 'bug',
      message: modal.querySelector('#fb-message').value.trim(),
      user: {
        name: modal.querySelector('#fb-name').value.trim() || null,
        email: modal.querySelector('#fb-email').value.trim() || null
      }
    };

    // Log to console for development
    console.log('[ChronoProtein Feedback]', JSON.stringify(entry, null, 2));

    // Store in localStorage as a queue for future backend sync
    const stored = JSON.parse(localStorage.getItem('chronoFeedback') || '[]');
    stored.push(entry);
    localStorage.setItem('chronoFeedback', JSON.stringify(stored));

    // Show success
    modal.innerHTML = `
      <div class="fb-success">
        <div class="fb-success-icon">✅</div>
        <p>${i18n('feedbackSuccess')}</p>
        <button onclick="Feedback.reset()">${i18n('feedbackSendAnother')}</button>
      </div>
    `;
  }

  function openModal() {
    const modal = document.getElementById('fb-modal');
    renderForm(modal);
    document.getElementById('fb-backdrop').classList.add('open');
    modal.classList.add('open');
  }

  function closeModal() {
    document.getElementById('fb-backdrop').classList.remove('open');
    document.getElementById('fb-modal').classList.remove('open');
  }

  function reset() {
    const modal = document.getElementById('fb-modal');
    renderForm(modal);
  }

  return { init, close: closeModal, reset };

})();
