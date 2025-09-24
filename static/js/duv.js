// duv.js
// Script para duv.html (Central de Dúvidas)
// Requisitos no HTML: elementos com IDs:
// faqGrid, faqModal, answerModal, faqForm, answerForm, openFaqBtn, faqAuthor, faqQuestion, faqAnswer

const faqGrid = document.getElementById('faqGrid');
const faqModal = document.getElementById('faqModal');
const answerModal = document.getElementById('answerModal');
const faqForm = document.getElementById('faqForm');
const answerForm = document.getElementById('answerForm');
const openFaqBtn = document.getElementById('openFaqBtn');

let faqs = JSON.parse(localStorage.getItem('faqs') || '[]'); // array de objetos {author, question, answer}
let currentCardIndex = null; // índice do item sendo respondido

// Renderiza a lista (mais recente primeiro)
function renderFaqs() {
  faqGrid.innerHTML = '';

  if (!Array.isArray(faqs)) faqs = [];

  // iterar de trás pra frente para mostrar os itens mais novos primeiro
  for (let i = faqs.length - 1; i >= 0; i--) {
    const faq = faqs[i];
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <h3>${escapeHtml(faq.question)}</h3>
      <div class="answer ${faq.answer ? '' : 'empty'}">
        ${faq.answer ? `<strong>Resposta:</strong> ${escapeHtml(faq.answer)}` : '<em>Aguardando resposta...</em>'}
      </div>
      <small>Enviado por: ${escapeHtml(faq.author)}</small>
      <div style="margin-top:10px;">
        <button class="btn btn-secondary" data-action="reply" data-index="${i}">Responder</button>
        <button class="btn btn-delete" data-action="delete" data-index="${i}" style="margin-left:8px;background:#e53935;">Excluir</button>
      </div>
    `;

    faqGrid.appendChild(card);
  }
}

// --- Helpers de persistência ---
function saveStorage() {
  localStorage.setItem('faqs', JSON.stringify(faqs));
}

// --- Segurança: escape simples para evitar XSS quando inserimos texto na UI ---
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
  });
}

// --- Abrir/fechar modais (usa atributo hidden e style para compatibilidade) ---
function openModal() {
  faqModal.hidden = false;
  faqModal.style.display = 'flex';
  // foco no primeiro campo
  const author = document.getElementById('faqAuthor');
  if (author) author.focus();
}

function closeModal() {
  faqModal.hidden = true;
  faqModal.style.display = 'none';
  faqForm.reset();
}

function openAnswerModal(index) {
  currentCardIndex = index;
  answerModal.hidden = false;
  answerModal.style.display = 'flex';
  const answerField = document.getElementById('faqAnswer');
  if (answerField) {
    answerField.value = faqs[index].answer || '';
    answerField.focus();
  }
}

function closeAnswerModal() {
  answerModal.hidden = true;
  answerModal.style.display = 'none';
  answerForm.reset();
}

// --- CRUD básico ---
function addFaq(author, question) {
  faqs.push({ author, question, answer: '' });
  saveStorage();
  renderFaqs();
}

function addAnswer(index, answer) {
  if (faqs[index]) {
    faqs[index].answer = answer;
    saveStorage();
    renderFaqs();
  }
}

function deleteFaq(index) {
  if (!confirm('Deseja realmente excluir esta pergunta?')) return;
  faqs.splice(index, 1);
  saveStorage();
  renderFaqs();
}

// --- Listeners / integração com forms e botões ---
if (openFaqBtn) {
  openFaqBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
}

// Submissão do form nova pergunta
if (faqForm) {
  faqForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const author = (document.getElementById('faqAuthor') || {}).value || '';
    const question = (document.getElementById('faqQuestion') || {}).value || '';
    if (!author.trim() || !question.trim()) {
      alert('Por favor, preencha seu nome e a pergunta.');
      return;
    }
    addFaq(author.trim(), question.trim());
    closeModal();
  });
}

// Submissão do form resposta
if (answerForm) {
  answerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const answer = (document.getElementById('faqAnswer') || {}).value || '';
    if (!answer.trim()) {
      alert('Digite uma resposta antes de salvar.');
      return;
    }
    if (currentCardIndex === null) return;
    addAnswer(currentCardIndex, answer.trim());
    closeAnswerModal();
  });
}

// Delegação de eventos para os botões de responder/excluir dentro do grid
faqGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  if (action === 'reply') {
    openAnswerModal(index);
  } else if (action === 'delete') {
    deleteFaq(index);
  }
});

// fechar modal ao clicar fora do content
[faqModal, answerModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      modal.style.display = 'none';
      // reset do formulário correspondente
      if (modal === faqModal) faqForm.reset();
      if (modal === answerModal) answerForm.reset();
    }
  });
});

// fechar modais com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (faqModal && !faqModal.hidden) closeModal();
    if (answerModal && !answerModal.hidden) closeAnswerModal();
  }
});

// Expor funções usadas por botões inline (se existirem), para compatibilidade
window.openModal = openModal;
window.closeModal = closeModal;
window.openAnswerModal = openAnswerModal;
window.closeAnswerModal = closeAnswerModal;
window.saveFaq = function () { faqForm && faqForm.dispatchEvent(new Event('submit', { cancelable: true })); };
window.saveAnswer = function () { answerForm && answerForm.dispatchEvent(new Event('submit', { cancelable: true })); };
window.deleteFaq = deleteFaq;

// Render inicial
renderFaqs();
