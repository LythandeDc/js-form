document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('form-preview');
  const panel = document.getElementById('panel');

  const instructions = {
    label: 'Utilisez la zone de texte pour definir le texte du label, puis cliquez sur <strong>Ok</strong> pour l\'ajouter ou sur <strong>Annuler</strong> pour annuler.',
    input: 'Utilisez la zone de texte pour definir l\'id de l\'input, puis cliquez sur <strong>Ok</strong> pour l\'ajouter ou sur <strong>Annuler</strong> pour annuler.',
    button: 'Utilisez la zone de texte pour definir le texte du bouton, puis cliquez sur <strong>Ok</strong> pour l\'ajouter ou sur <strong>Annuler</strong> pour annuler.'
  };

  function clearPanel() {
    panel.innerHTML = '';
  }

  function showPanel(type, placeholder, instruction) {
    clearPanel();
    panel.innerHTML = `
      <div class="panel-info">${instruction}</div>
      <input type="text" id="panelInput" placeholder="${placeholder}">
      <div class="panel-actions">
        <button class="btn-ok" id="panelOk">Ok</button>
        <button class="btn-cancel" id="panelCancel">Annuler</button>
      </div>
    `;

    const input = document.getElementById('panelInput');
    input.focus();

    document.getElementById('panelOk').addEventListener('click', () => {
      const value = input.value.trim();
      if (!value) return;
      addElement(type, value);
      clearPanel();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (!value) return;
        addElement(type, value);
        clearPanel();
      }
    });

    document.getElementById('panelCancel').addEventListener('click', clearPanel);
  }

  function addElement(type, value) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('form-element');
    wrapper.dataset.type = type;
    wrapper.dataset.value = value;

    let html = '';
    if (type === 'label') {
      html = `<label>${escapeHtml(value)}</label>`;
    } else if (type === 'input') {
      html = `<input type="text" id="${escapeHtml(value)}" placeholder="${escapeHtml(value)}">`;
    } else if (type === 'button') {
      html = `<button>${escapeHtml(value)}</button>`;
    }

    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('btn-delete');
    deleteBtn.textContent = 'X';
    deleteBtn.title = 'Supprimer';
    deleteBtn.addEventListener('click', () => wrapper.remove());

    wrapper.innerHTML = html;
    wrapper.appendChild(deleteBtn);
    preview.appendChild(wrapper);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function generateCode() {
    const elements = preview.querySelectorAll('.form-element');
    if (elements.length === 0) {
      showCodeModal('<p>Aucun element dans le formulaire.</p>', true);
      return;
    }

    let code = '<form>\n';
    elements.forEach(el => {
      const type = el.dataset.type;
      const value = el.dataset.value;
      if (type === 'label') {
        code += `  <label>${escapeHtml(value)}</label>\n`;
      } else if (type === 'input') {
        code += `  <input type="text" id="${escapeHtml(value)}" name="${escapeHtml(value)}">\n`;
      } else if (type === 'button') {
        code += `  <button type="button">${escapeHtml(value)}</button>\n`;
      }
    });
    code += '</form>';

    showCodeModal(code, false);
  }

  function showCodeModal(content, isMessage) {
    const overlay = document.createElement('div');
    overlay.classList.add('code-modal-overlay');

    if (isMessage) {
      overlay.innerHTML = `
        <div class="code-modal">
          <h3>Code Formulaire</h3>
          ${content}
          <div class="panel-actions">
            <button class="btn-cancel">Fermer</button>
          </div>
        </div>
      `;
    } else {
      overlay.innerHTML = `
        <div class="code-modal">
          <h3>Code Formulaire</h3>
          <textarea readonly>${content}</textarea>
          <div class="panel-actions">
            <button class="btn-ok">Copier</button>
            <button class="btn-cancel">Fermer</button>
          </div>
        </div>
      `;
    }

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    const closeBtn = overlay.querySelector('.btn-cancel');
    closeBtn.addEventListener('click', () => overlay.remove());

    const copyBtn = overlay.querySelector('.btn-ok');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textarea = overlay.querySelector('textarea');
        textarea.select();
        navigator.clipboard.writeText(textarea.value).then(() => {
          copyBtn.textContent = 'Copie !';
          setTimeout(() => overlay.remove(), 800);
        });
      });
    }
  }

  // Event listeners per i bottoni principali
  document.getElementById('leLabel').addEventListener('click', () => {
    showPanel('label', 'Texte du label...', instructions.label);
  });

  document.getElementById('zTexte').addEventListener('click', () => {
    showPanel('input', 'Id de l\'input...', instructions.input);
  });

  document.getElementById('leBouton').addEventListener('click', () => {
    showPanel('button', 'Texte du bouton...', instructions.button);
  });

  document.getElementById('cForm').addEventListener('click', generateCode);
});
