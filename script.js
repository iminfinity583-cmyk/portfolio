let books = [];
let currentCategory = 'all';
const ADMIN_PASSWORD = 'vineet123';

/* Theme Toggle */
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  icon.classList.replace('fa-moon', 'fa-sun');
}
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
  icon.classList.replace(isLight ? 'fa-sun' : 'fa-moon', isLight ? 'fa-moon' : 'fa-sun');
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
});

/* Mobile Menu */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
});
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('active');
  document.body.classList.remove('no-scroll');
}));

/* Back to Top */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Load Books */
async function loadBooks() {
  try {
    const res = await fetch('data/books.json');
    const data = await res.json();
    books = data;
  } catch {
    books = [];
  }
  const local = localStorage.getItem('vineet_books');
  if (local) {
    const localBooks = JSON.parse(local);
    const existingIds = new Set(books.map(b => b.id));
    localBooks.forEach(b => { if (!existingIds.has(b.id)) books.push(b); });
  }
  renderCategories();
  renderBooks();
}

function renderCategories() {
  const cats = [...new Set(books.map(b => b.category))];
  const container = document.getElementById('categoryFilters');
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.onclick = function() { filterByCategory(cat, this); };
    container.appendChild(btn);
  });
}

function renderBooks() {
  const grid = document.getElementById('bookGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('bookCount');
  const title = document.getElementById('sectionTitle');

  let filtered = [...books];
  if (currentCategory !== 'all') {
    filtered = filtered.filter(b => b.category === currentCategory);
    title.textContent = currentCategory;
  } else {
    title.textContent = 'All Books';
  }

  const query = (document.getElementById('searchInput').value || '').toLowerCase();
  if (query) {
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    );
  }

  count.textContent = filtered.length + ' book' + (filtered.length !== 1 ? 's' : '');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(b => {
    const coverContent = b.cover
      ? `<img src="${b.cover}" alt="${b.title}">`
      : `<i class="fas fa-book"></i>`;
    const filePath = b.file || 'books/sample.pdf';
    return `
      <a class="book-card" href="reader.html?file=${encodeURIComponent(filePath)}&title=${encodeURIComponent(b.title)}">
        <div class="book-cover">${coverContent}</div>
        <div class="book-info">
          <h3>${b.title}</h3>
          <p class="book-author">${b.author}</p>
          <p class="book-desc">${b.description || ''}</p>
          <div class="book-meta">
            <span class="book-category">${b.category}</span>
            ${b.pages ? `<span class="book-pages">${b.pages} pages</span>` : ''}
          </div>
          <span class="book-read-btn">Read Now <i class="fas fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  }).join('');
}

function filterByCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBooks();
}

function filterBooks() {
  renderBooks();
}

/* Admin Modal */
function showAdmin(e) {
  if (e) e.preventDefault();
  document.getElementById('adminModal').classList.add('active');
  document.getElementById('adminPass').value = '';
  document.getElementById('adminError').textContent = '';
  document.getElementById('adminLogin').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
  document.body.classList.add('no-scroll');
}

function closeAdmin(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('adminModal').classList.remove('active');
  document.body.classList.remove('no-scroll');
}

function adminLogin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminList();
  } else {
    document.getElementById('adminError').textContent = 'Wrong password.';
  }
}

let pdfDataUrl = null;

function handlePdfUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    pdfDataUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

function addBook() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const description = document.getElementById('bookDesc').value.trim();
  const category = document.getElementById('bookCategory').value.trim();
  const pages = parseInt(document.getElementById('bookPages').value) || 0;
  const cover = document.getElementById('bookCover').value.trim();

  if (!title || !author) {
    alert('Title and Author are required.');
    return;
  }

  let filePath = document.getElementById('bookFile').value.trim();
  if (pdfDataUrl) {
    const saved = JSON.parse(localStorage.getItem('vineet_pdfs') || '{}');
    const id = Date.now();
    saved[id] = pdfDataUrl;
    localStorage.setItem('vineet_pdfs', JSON.stringify(saved));
    filePath = 'pdf:' + id;
    pdfDataUrl = null;
    document.getElementById('pdfUpload').value = '';
  }
  if (!filePath) filePath = 'books/sample.pdf';

  const newBook = {
    id: Date.now(),
    title,
    author,
    description,
    category: category || 'Uncategorized',
    pages,
    cover,
    file: filePath,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  const local = JSON.parse(localStorage.getItem('vineet_books') || '[]');
  local.push(newBook);
  localStorage.setItem('vineet_books', JSON.stringify(local));
  books.push(newBook);

  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookDesc').value = '';
  document.getElementById('bookCategory').value = '';
  document.getElementById('bookPages').value = '';
  document.getElementById('bookCover').value = '';
  document.getElementById('bookFile').value = '';

  renderCategories();
  renderBooks();
  renderAdminList();
  alert('Book added successfully!');
}

function renderAdminList() {
  const container = document.getElementById('adminBookList');
  const allBooks = getAllBooks();
  if (allBooks.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim)">No books yet.</p>';
    return;
  }
  container.innerHTML = allBooks.map(b => `
    <div class="admin-book-item">
      <div class="admin-book-item-info">
        <h4>${b.title}</h4>
        <p>${b.author} — ${b.category}</p>
      </div>
      <button class="admin-delete-btn" onclick="deleteBook(${b.id})" title="Delete"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function getAllBooks() {
  return books;
}

function deleteBook(id) {
  if (!confirm('Delete this book?')) return;
  const local = JSON.parse(localStorage.getItem('vineet_books') || '[]');
  const filtered = local.filter(b => b.id !== id);
  localStorage.setItem('vineet_books', JSON.stringify(filtered));
  books = books.filter(b => b.id !== id);

  const pdfs = JSON.parse(localStorage.getItem('vineet_pdfs') || '{}');
  const book = books.find(b => b.id === id);
  if (book && book.file && book.file.startsWith('pdf:')) {
    const pdfId = book.file.replace('pdf:', '');
    delete pdfs[pdfId];
    localStorage.setItem('vineet_pdfs', JSON.stringify(pdfs));
  }

  renderCategories();
  renderBooks();
  renderAdminList();
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('adminAdd').style.display = tab === 'add' ? 'block' : 'none';
  document.getElementById('adminManage').style.display = tab === 'manage' ? 'block' : 'none';
  if (tab === 'manage') renderAdminList();
}

/* Init */
document.addEventListener('DOMContentLoaded', loadBooks);
