// Paste the Apps Script Web App URL (ends with /exec) here after deploying apps-script/Code.gs
const SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';

const GROUP_LINKS = {
  Boy: 'https://chat.whatsapp.com/Epnr1xTECeA6HqDRQ3IYP1',
  Girl: 'https://chat.whatsapp.com/GUmjY1jHVMmBuiGjT0h0uC',
};

const REDIRECT_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 20000;

const form = document.getElementById('form');
const fields = form.elements;
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');
const collegeField = document.getElementById('collegeField');
const collegeInput = document.getElementById('collegeName');

fields.joinedCollege.forEach((radio) =>
  radio.addEventListener('change', () => {
    collegeField.hidden = fields.joinedCollege.value !== 'Yes';
    if (collegeField.hidden) setError('collegeName', '');
  })
);

form.addEventListener('input', (e) => {
  if (e.target.name) setError(e.target.name, '');
});
form.addEventListener('change', (e) => {
  if (e.target.name) setError(e.target.name, '');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const data = readForm();
  if (!validate(data)) return;

  if (!SCRIPT_URL.startsWith('https://')) {
    formError.textContent = 'Registration opens shortly. Please try again in a few minutes.';
    return;
  }

  setLoading(true);
  try {
    const res = await postWithTimeout(data);
    if (res.status === 'ok') {
      showResult('ok', res.gender || data.gender);
    } else if (res.status === 'duplicate') {
      showResult('duplicate', res.gender || data.gender);
    } else {
      formError.textContent = res.message || 'Something went wrong. Please try again.';
    }
  } catch {
    formError.textContent = "Couldn't register. Check your internet connection and try again.";
  } finally {
    setLoading(false);
  }
});

function readForm() {
  return {
    name: fields.name.value.trim(),
    phone: normalizePhone(fields.phone.value),
    gender: fields.gender.value,
    joinedCollege: fields.joinedCollege.value,
    collegeName: fields.joinedCollege.value === 'Yes' ? collegeInput.value.trim() : '',
  };
}

function validate(data) {
  let ok = true;
  const fail = (field, msg) => { setError(field, msg); ok = false; };

  if (!data.name) fail('name', 'Enter your full name');
  if (!data.phone) fail('phone', 'Enter a valid 10-digit mobile number');
  if (!data.gender) fail('gender', 'Select Boy or Girl');
  if (!data.joinedCollege) fail('joinedCollege', 'Select Yes or No');
  if (data.joinedCollege === 'Yes' && !data.collegeName) fail('collegeName', 'Enter your college name');

  if (!ok) form.querySelector('.invalid, .error:not(:empty)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return ok;
}

function normalizePhone(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : '';
}

function setError(field, msg) {
  const el = form.querySelector(`.error[data-for="${field}"]`);
  if (el) el.textContent = msg;
  const input = form.querySelector(`input[type="text"][name="${field}"], input[type="tel"][name="${field}"]`);
  if (input) input.classList.toggle('invalid', Boolean(msg));
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Registering…' : 'Register Now';
}

async function postWithTimeout(data) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    // text/plain avoids a CORS preflight, which Apps Script can't answer
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function showResult(kind, gender) {
  const link = GROUP_LINKS[gender] || GROUP_LINKS.Boy;
  const result = document.getElementById('result');
  const groupLabel = gender === 'Girl' ? "girls'" : "boys'";

  document.getElementById('groupBtn').href = link;
  result.classList.toggle('duplicate', kind === 'duplicate');
  result.querySelector('.result-icon').textContent = kind === 'duplicate' ? '!' : '✓';

  if (kind === 'duplicate') {
    document.getElementById('resultTitle').textContent = 'You have already registered';
    document.getElementById('resultText').textContent =
      `This number is already registered. If you haven't joined yet, tap below to join the ${groupLabel} WhatsApp group.`;
  } else {
    document.getElementById('resultTitle').textContent = 'Registration successful!';
    document.getElementById('resultText').textContent =
      `Taking you to the ${groupLabel} WhatsApp group. The Google Meet link will be shared there.`;
    setTimeout(() => { window.location.href = link; }, REDIRECT_DELAY_MS);
  }

  form.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
