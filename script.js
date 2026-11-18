/* =========================================
   E2: DARK MODE TOGGLE LOGIC
   ========================================= */
const themeBtn = document.querySelector('#theme-btn');
const themeIcon = document.querySelector('#theme-icon');
const themeText = document.querySelector('#theme-text');

themeBtn.addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  
  if (isDark) {
    root.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark Mode';
  } else {
    root.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light Mode';
  }
});

/* =========================================
   E4: LIVE DIRECTORY SEARCH LOGIC
   ========================================= */
const searchInp = document.querySelector('#domain-search');
const domainCards = document.querySelectorAll('.domain-card');
const noResults = document.querySelector('#no-results');

searchInp.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  let visible = 0;
  
  domainCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const desc = card.querySelector('.card-desc').textContent.toLowerCase();
    const titleEl = card.querySelector('.card-title');
    
    // So sánh từ khóa với tiêu đề HOẶC nội dung mô tả
    if (name.includes(term) || desc.includes(term)) {
      card.style.display = ''; // Giữ cấu trúc Grid
      visible++;
      
      // Nổi bật (Highlight) từ khóa trùng khớp trong Tiêu đề
      if (term && name.includes(term)) {
        const rx = new RegExp(`(${term})`, 'gi');
        titleEl.innerHTML = card.dataset.name.replace(rx, '<mark>$1</mark>');
      } else {
        titleEl.textContent = card.dataset.name;
      }
    } else {
      card.style.display = 'none';
    }
  });
  
  noResults.style.display = visible === 0 ? 'block' : 'none';
});

/* =========================================
   E3: INTERACTIVE TO-DO LIST LOGIC
   ========================================= */
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');
const emptyTodoMsg = document.querySelector('#empty-todo-msg');

function updateTodoEmpty() {
  emptyTodoMsg.style.display = todoList.children.length === 0 ? 'block' : 'none';
}

function addTask() {
  const text = todoInput.value.trim();
  if (!text) return;
  
  const li = document.createElement('li');
  li.className = 'task-item';
  li.innerHTML = `<span>${text}</span><button class="del-btn">✕ Delete</button>`;
  
  todoList.appendChild(li);
  todoInput.value = '';
  updateTodoEmpty();
}

addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Delegation để xóa Task
todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('del-btn')) {
    e.target.parentElement.removeAttribute('data-task-id');
    e.target.parentElement.remove();
    updateTodoEmpty();
  }
});

updateTodoEmpty(); // Chạy hàm kiểm tra lúc tải trang