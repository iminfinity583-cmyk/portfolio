let pdfDoc = null;
let currentPage = 1;
let scale = 1.2;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function getBookFile() {
  const params = new URLSearchParams(window.location.search);
  return params.get('file') || 'books/sample.pdf';
}

function getBookTitle() {
  const params = new URLSearchParams(window.location.search);
  return params.get('title') || 'Untitled';
}

async function loadPDF() {
  const file = getBookFile();
  const title = getBookTitle();
  document.getElementById('readerTitle').textContent = title;

  try {
    pdfDoc = await pdfjsLib.getDocument(file).promise;
    document.getElementById('totalPages').textContent = pdfDoc.numPages;
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = pdfDoc.numPages <= 1;
    document.getElementById('pageInput').max = pdfDoc.numPages;
    renderPage(1);
  } catch (err) {
    document.getElementById('readerTitle').textContent = 'Failed to load PDF';
    canvas.style.display = 'none';
    const container = document.getElementById('readerContainer');
    container.innerHTML = `<div class="reader-error"><i class="fas fa-exclamation-triangle"></i><h3>Could not load PDF</h3><p>Make sure the file exists at: <code>${file}</code></p><a href="./" class="btn primary">Back to Library</a></div>`;
  }
}

function renderPage(num) {
  currentPage = num;
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const renderContext = { canvasContext: ctx, viewport };
    page.render(renderContext);

    document.getElementById('currentPage').textContent = num;
    document.getElementById('pageInput').value = num;
    document.getElementById('prevBtn').disabled = num <= 1;
    document.getElementById('nextBtn').disabled = num >= pdfDoc.numPages;
    document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';

    window.scrollTo(0, 0);
  });
}

function prevPage() {
  if (currentPage > 1) renderPage(currentPage - 1);
}

function nextPage() {
  if (currentPage < pdfDoc.numPages) renderPage(currentPage + 1);
}

function goToPage(num) {
  num = parseInt(num);
  if (num >= 1 && num <= pdfDoc.numPages) renderPage(num);
}

function zoomIn() {
  scale = Math.min(scale + 0.2, 3);
  renderPage(currentPage);
}

function zoomOut() {
  scale = Math.max(scale - 0.2, 0.4);
  renderPage(currentPage);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevPage();
  if (e.key === 'ArrowRight') nextPage();
});

loadPDF();
