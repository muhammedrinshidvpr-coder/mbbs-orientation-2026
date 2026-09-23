/**
 * MBBS Orientation 2026 — registration endpoint.
 * Paste into the Google Sheet's Extensions → Apps Script, then deploy as a Web App.
 */

const SPREADSHEET_ID = '14-NbCUmD8ymurZn10O736JDBba2q2IJ6v6XTUnuqUmI';
const SHEET_NAME = 'Registrations';
const HEADERS = ['Timestamp', 'Name', 'Phone', 'Gender', 'Joined College', 'College Name'];
const PHONE_COL = 3; // 1-based column index of Phone (Gender is the next column)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return json(register(data));
  } catch (err) {
    return json({ status: 'error', message: String(err.message || err) });
  }
}

function doGet() {
  return json({ status: 'ok', message: 'MBBS Orientation registration API is running' });
}

function register(data) {
  const name = String(data.name || '').trim();
  const phone = normalizePhone(data.phone);
  const gender = data.gender === 'Girl' ? 'Girl' : data.gender === 'Boy' ? 'Boy' : '';
  const joined = data.joinedCollege === 'Yes' ? 'Yes' : data.joinedCollege === 'No' ? 'No' : '';
  const college = joined === 'Yes' ? String(data.collegeName || '').trim() : '';

  if (!name) return { status: 'error', message: 'Name is required' };
  if (!phone) return { status: 'error', message: 'Enter a valid 10-digit mobile number' };
  if (!gender) return { status: 'error', message: 'Select Boy or Girl' };
  if (!joined) return { status: 'error', message: 'Select whether you have joined a college' };
  if (joined === 'Yes' && !college) return { status: 'error', message: 'College name is required' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const rows = sheet.getRange(2, PHONE_COL, lastRow - 1, 2).getValues(); // Phone, Gender
      for (const [storedPhone, storedGender] of rows) {
        if (normalizePhone(storedPhone) === phone) {
          return { status: 'duplicate', gender: storedGender === 'Girl' ? 'Girl' : 'Boy' };
        }
      }
    }
    // Leading apostrophe keeps the phone as text so Sheets doesn't mangle it.
    sheet.appendRow([new Date(), name, "'" + phone, gender, joined, college]);
    return { status: 'ok', gender: gender };
  } finally {
    lock.releaseLock();
  }
}

function normalizePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : '';
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
