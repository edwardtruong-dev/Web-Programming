/* =========================================
   E2: DARK MODE TOGGLE LOGIC
   ========================================= */
const themeBtn = document.querySelector('#theme-btn');
const themeIcon = document.querySelector('#theme-icon');
const themeText = document.querySelector('#theme-text');

if (themeBtn && themeIcon && themeText) {
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
}

/* =========================================
   E4: LIVE DIRECTORY SEARCH LOGIC
   ========================================= */
const searchInp = document.querySelector('#domain-search');
const domainCards = document.querySelectorAll('.domain-card');
const noResults = document.querySelector('#no-results');

if (searchInp && noResults) {
  searchInp.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    let visible = 0;

    domainCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const desc = card.querySelector('.card-desc').textContent.toLowerCase();
      const titleEl = card.querySelector('.card-title');

      if (name.includes(term) || desc.includes(term)) {
        card.style.display = '';
        visible++;

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
}

/* =========================================
   E3: INTERACTIVE TO-DO LIST LOGIC
   ========================================= */
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');
const emptyTodoMsg = document.querySelector('#empty-todo-msg');

if (todoInput && addBtn && todoList && emptyTodoMsg) {
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

  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('del-btn')) {
      e.target.parentElement.removeAttribute('data-task-id');
      e.target.parentElement.remove();
      updateTodoEmpty();
    }
  });

  updateTodoEmpty();
}

/* =========================================
   W6-MON: CONTACT & REGISTRATION FORM VALIDATION
   ========================================= */
function attachFormValidation(formSelector, feedbackSelector, successMessage) {
  const formEl = document.querySelector(formSelector);
  const feedbackEl = document.querySelector(feedbackSelector);
  if (!formEl || !feedbackEl) return;

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    formEl.classList.add('was-validated');

    if (!formEl.checkValidity()) {
      feedbackEl.classList.add('is-error');
      feedbackEl.textContent = 'Please fill in all required fields with valid formats.';
      formEl.reportValidity();
      return;
    }

    feedbackEl.classList.remove('is-error');
    feedbackEl.textContent = successMessage;
    formEl.reset();
    formEl.classList.remove('was-validated');
  });
}

attachFormValidation(
  '#contact-form',
  '#contact-feedback',
  '✓ Message validated and ready to send!'
);

attachFormValidation(
  '#registration-form',
  '#reg-feedback',
  '✓ Student registration validated successfully!'
);

/* =========================================
   W6-FRI: RANDOM JOKE FETCHER (FETCH API & ASYNC/AWAIT)
   ========================================= */
const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';
const FAV_JOKES_KEY = 'edward_fav_jokes_w6';

const loadJokeBtn = document.querySelector('#load-joke-btn');
const saveFavBtn = document.querySelector('#save-fav-btn');
const jokeSpinner = document.querySelector('#joke-spinner');
const jokeStatus = document.querySelector('#joke-status');
const jokeCard = document.querySelector('#joke-card');
const jokeSetup = document.querySelector('#joke-setup');
const jokePunchline = document.querySelector('#joke-punchline');
const favJokeList = document.querySelector('#fav-joke-list');
const emptyFavMsg = document.querySelector('#empty-fav-msg');

const FALLBACK_JOKES = [
  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs! 🐛' },
  { setup: 'Why do Java developers wear glasses?', punchline: 'Because they don’t C#.' },
  { setup: 'How many programmers does it take to change a light bulb?', punchline: 'None, that’s a hardware problem.' },
  { setup: 'What is a programmer’s favourite hangout place?', punchline: 'Foo Bar.' }
];

let currentJoke = null;

async function loadJoke() {
  if (!loadJokeBtn) return;
  loadJokeBtn.disabled = true;
  saveFavBtn.disabled = true;
  jokeSpinner.hidden = false;
  jokeStatus.classList.remove('is-error');
  jokeStatus.textContent = 'Loading…';

  try {
    // 1. Ưu tiên gọi API chính theo đề bài
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    currentJoke = {
      id: data.id || Date.now(),
      setup: data.setup,
      punchline: data.punchline
    };

    jokeSetup.textContent = currentJoke.setup;
    jokePunchline.textContent = currentJoke.punchline;
    jokeCard.hidden = false;
    jokeStatus.textContent = 'Joke loaded from internet!';
    saveFavBtn.disabled = false;
  } catch (primaryErr) {
    try {
      // 2. Nếu API chính rate-limit/chập chờn, tự động gọi API dự phòng online
      const backupRes = await fetch('https://v2.jokeapi.dev/joke/Programming?type=twopart');
      if (!backupRes.ok) {
        throw new Error(`HTTP ${backupRes.status}`);
      }
      const backupData = await backupRes.json();
      currentJoke = {
        id: backupData.id || Date.now(),
        setup: backupData.setup,
        punchline: backupData.delivery
      };

      jokeSetup.textContent = currentJoke.setup;
      jokePunchline.textContent = currentJoke.punchline;
      jokeCard.hidden = false;
      jokeStatus.textContent = 'Joke loaded from internet (backup API)!';
      saveFavBtn.disabled = false;
    } catch (err) {
      // 3. Chỉ dùng joke offline khi máy thực sự mất mạng (Offline)
      const fallback = FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
      currentJoke = {
        id: Date.now(),
        setup: fallback.setup,
        punchline: fallback.punchline
      };

      jokeSetup.textContent = currentJoke.setup;
      jokePunchline.textContent = currentJoke.punchline;
      jokeCard.hidden = false;
      jokeStatus.classList.add('is-error');
      jokeStatus.textContent = `Offline / API unreachable (${err.message}) — showing local backup joke.`;
      saveFavBtn.disabled = false;
    }
  } finally {
    jokeSpinner.hidden = true;
    loadJokeBtn.disabled = false;
  }
}

function getSavedJokes() {
  try {
    return JSON.parse(localStorage.getItem(FAV_JOKES_KEY)) || [];
  } catch {
    return [];
  }
}

function renderFavouriteJokes() {
  if (!favJokeList || !emptyFavMsg) return;
  const saved = getSavedJokes();
  favJokeList.innerHTML = '';
  emptyFavMsg.style.display = saved.length === 0 ? 'block' : 'none';

  saved.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const textBox = document.createElement('div');
    textBox.className = 'fav-item-text';
    textBox.textContent = item.setup;

    const punchSmall = document.createElement('small');
    punchSmall.textContent = item.punchline;
    textBox.appendChild(punchSmall);

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = '✕ Remove';
    delBtn.dataset.favIndex = index;

    li.appendChild(textBox);
    li.appendChild(delBtn);
    favJokeList.appendChild(li);
  });
}

if (saveFavBtn && favJokeList) {
  saveFavBtn.addEventListener('click', () => {
    if (!currentJoke) return;
    const saved = getSavedJokes();
    const exists = saved.some(item => item.setup === currentJoke.setup);

    if (exists) {
      jokeStatus.classList.remove('is-error');
      jokeStatus.textContent = 'This joke is already in your favourites!';
      return;
    }

    saved.unshift(currentJoke);
    localStorage.setItem(FAV_JOKES_KEY, JSON.stringify(saved));
    renderFavouriteJokes();
    jokeStatus.classList.remove('is-error');
    jokeStatus.textContent = 'Saved to favourites!';
  });

  favJokeList.addEventListener('click', (e) => {
    if (e.target.classList.contains('del-btn')) {
      const idx = Number(e.target.dataset.favIndex);
      const saved = getSavedJokes();
      saved.splice(idx, 1);
      localStorage.setItem(FAV_JOKES_KEY, JSON.stringify(saved));
      renderFavouriteJokes();
    }
  });

  renderFavouriteJokes();
}

/* =========================================
   W6-FRI: REAL-TIME JS FORM VALIDATION & ARIA
   ========================================= */
(() => {
  const regForm = document.querySelector('#w6fri-reg-form');
  const submitBtn = document.querySelector('#w6fri-submit-btn');
  const successBox = document.querySelector('#w6fri-success-box');
  const successText = document.querySelector('#w6fri-success-text');

  if (!regForm || !submitBtn) return;

  const snameEl = document.querySelector('#w6fri-sname');
  const sidEl = document.querySelector('#w6fri-sid');
  const semailEl = document.querySelector('#w6fri-semail');
  const pwEl = document.querySelector('#w6fri-pw');
  const pw2El = document.querySelector('#w6fri-pw2');

  function setValid(inputEl, errEl) {
    inputEl.setAttribute('aria-invalid', 'false');
    errEl.textContent = '';
  }

  function setInvalid(inputEl, errEl, msg) {
    inputEl.setAttribute('aria-invalid', 'true');
    errEl.textContent = msg;
  }

  function checkName() {
    const errEl = document.querySelector('#w6fri-err-sname');
    if (snameEl.validity.valueMissing) {
      setInvalid(snameEl, errEl, 'Full name is required.');
      return false;
    }
    if (snameEl.validity.tooShort) {
      setInvalid(snameEl, errEl, 'Full name must be at least 2 characters.');
      return false;
    }
    setValid(snameEl, errEl);
    return true;
  }

  function checkSid() {
    const errEl = document.querySelector('#w6fri-err-sid');
    if (sidEl.validity.valueMissing) {
      setInvalid(sidEl, errEl, 'Student ID is required.');
      return false;
    }
    if (!/^\d{9}$/.test(sidEl.value)) {
      setInvalid(sidEl, errEl, 'Must be exactly 9 digits (e.g. 202431234).');
      return false;
    }
    setValid(sidEl, errEl);
    return true;
  }

  function checkEmail() {
    const errEl = document.querySelector('#w6fri-err-semail');
    if (semailEl.validity.valueMissing) {
      setInvalid(semailEl, errEl, 'Email address is required.');
      return false;
    }
    if (semailEl.validity.typeMismatch) {
      setInvalid(semailEl, errEl, 'Enter a valid email address.');
      return false;
    }
    setValid(semailEl, errEl);
    return true;
  }

  function checkPassword() {
    const errEl = document.querySelector('#w6fri-err-pw');
    if (pwEl.validity.valueMissing) {
      setInvalid(pwEl, errEl, 'Password is required.');
      return false;
    }
    if (pwEl.validity.tooShort) {
      setInvalid(pwEl, errEl, 'Password must be at least 8 characters.');
      return false;
    }
    setValid(pwEl, errEl);
    return true;
  }

  function checkConfirmPassword() {
    const errEl = document.querySelector('#w6fri-err-pw2');
    if (pw2El.validity.valueMissing) {
      pw2El.setCustomValidity('');
      setInvalid(pw2El, errEl, 'Please confirm your password.');
      return false;
    }
    if (pw2El.value !== pwEl.value) {
      pw2El.setCustomValidity('Passwords do not match');
      setInvalid(pw2El, errEl, 'Passwords do not match.');
      return false;
    }
    pw2El.setCustomValidity('');
    setValid(pw2El, errEl);
    return true;
  }

  function syncSubmitButton() {
    submitBtn.disabled = !regForm.checkValidity();
  }

  snameEl.addEventListener('input', () => {
    checkName();
    syncSubmitButton();
  });

  sidEl.addEventListener('input', () => {
    checkSid();
    syncSubmitButton();
  });

  semailEl.addEventListener('input', () => {
    checkEmail();
    syncSubmitButton();
  });

  pwEl.addEventListener('input', () => {
    checkPassword();
    if (pw2El.value.length > 0) checkConfirmPassword();
    syncSubmitButton();
  });

  pw2El.addEventListener('input', () => {
    checkConfirmPassword();
    syncSubmitButton();
  });

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const ok =
      checkName() &
      checkSid() &
      checkEmail() &
      checkPassword() &
      checkConfirmPassword();

    if (ok) {
      successText.textContent = `Registered ${snameEl.value.trim()} (${sidEl.value}) with ${semailEl.value.trim()}.`;
      successBox.hidden = false;

      regForm.reset();
      [snameEl, sidEl, semailEl, pwEl, pw2El].forEach((el) => {
        el.removeAttribute('aria-invalid');
      });
      pw2El.setCustomValidity('');
      submitBtn.disabled = true;
    } else {
      successBox.hidden = true;
    }
  });
})();