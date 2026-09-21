/**
 * TUBE Coffee Privilege Coupons — Google Sheets backend
 *
 * Turns this Spreadsheet into a simple JSON API so the GitHub-hosted app
 * can read and write data instead of keeping everything in browser memory.
 *
 * SETUP:
 * 1. Create the 6 tabs listed in SHEET_SETUP.md with the exact column headers.
 * 2. Paste this whole file into Extensions > Apps Script (replace any default code).
 * 3. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the URL ending in /exec — that's what the app will call.
 * 5. Every time you edit this code, you must create a NEW deployment
 *    (or "Manage deployments" > edit > new version) for changes to go live.
 */

const SHEETS = ['Employees', 'Franchisees', 'Branches', 'Campaigns', 'Coupons', 'AuditLog'];

function getSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Sheet tab not found: ' + name + ' — check SHEET_SETUP.md');
  return sh;
}

function sheetToObjects_(sh) {
  const values = sh.getDataRange().getValues();
  if (values.length < 1) return [];
  const headers = values[0];
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i].every(function (c) { return c === ''; })) continue; // skip blank rows
    const obj = {};
    headers.forEach(function (h, idx) { obj[h] = values[i][idx]; });
    rows.push(obj);
  }
  return rows;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET requests — reading data.
 *  ?action=getAll                 -> { Employees:[...], Franchisees:[...], ... } all 6 tabs at once
 *  ?action=get&sheet=Employees    -> just that one tab, as an array of row objects
 */
function doGet(e) {
  try {
    const action = (e.parameter.action || 'getAll');
    if (action === 'getAll') {
      const result = {};
      SHEETS.forEach(function (name) { result[name] = sheetToObjects_(getSheet_(name)); });
      return jsonOut_(result);
    }
    if (action === 'get') {
      return jsonOut_(sheetToObjects_(getSheet_(e.parameter.sheet)));
    }
    return jsonOut_({ error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOut_({ error: String(err) });
  }
}

/** POST requests — writing data. Body is JSON:
 *  { sheet:'Employees', action:'upsert', row:{id:'TUB-00001', ...all columns} }
 *  { sheet:'Employees', action:'append', row:{...} }              // AuditLog always uses this
 *  { sheet:'Employees', action:'delete', id:'TUB-00001' }
 *  upsert matches on the 'id' column — updates that row if found, else appends.
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sh = getSheet_(body.sheet);
    const values = sh.getDataRange().getValues();
    const headers = values[0];

    function rowArrayFrom(obj) {
      return headers.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; });
    }
    function appendRow(obj) { sh.appendRow(rowArrayFrom(obj)); }
    function writeRowAt(rowIndex1based, obj) {
      sh.getRange(rowIndex1based, 1, 1, headers.length).setValues([rowArrayFrom(obj)]);
    }

    if (body.action === 'append') {
      appendRow(body.row);
    } else if (body.action === 'upsert') {
      const idCol = headers.indexOf('id');
      if (idCol === -1) throw new Error('Sheet "' + body.sheet + '" has no "id" column to upsert on.');
      const idVal = String(body.row.id);
      let found = -1;
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idCol]) === idVal) { found = i + 1; break; }
      }
      if (found > 0) writeRowAt(found, body.row); else appendRow(body.row);
    } else if (body.action === 'delete') {
      const idCol = headers.indexOf('id');
      const idVal = String(body.id);
      for (let i = values.length - 1; i >= 1; i--) {
        if (String(values[i][idCol]) === idVal) { sh.deleteRow(i + 1); break; }
      }
    } else {
      return jsonOut_({ ok: false, error: 'Unknown action: ' + body.action });
    }

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}
