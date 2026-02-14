# Google Sheets Setup

1. **Google Sheet erstellen:**
   - Öffne [Google Sheets](https://sheets.google.com)
   - Neue Tabelle: "Hochzeitsgäste"
   - Spaltenköpfe (Reihe 1):
     - A: Timestamp
     - B: Vorname
     - C: Nachname
     - D: Teilnahme (ja/nein)
     - E: Gast 1 Name
     - F: Gast 1 Menü
     - G: Gast 1 Unverträglichkeiten
     - H: Gast 2 Name, usw.

2. **Google Apps Script erstellen:**
   - Klicke `Tools > Script Editor`
   - Lösche default Code
   - Kopiere diesen Code:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSheet();
  
  const row = [
    new Date(),
    data.firstName || "",
    data.lastName || "",
    data.attendance || "",
  ];
  
  // Gäste hinzufügen
  if (data.guests && data.guests.length > 0) {
    data.guests.forEach(guest => {
      row.push(guest.firstName || "");
      row.push(guest.menu || "");
      row.push(guest.intolerances || "");
    });
  }
  
  sheet.appendRow(row);
  return ContentService.createTextOutput("ok");
}
```

3. **Apps Script deployieren:**
   - `Deploy > New Deployment > Web App`
   - Execute as: Dein Account
   - Who has access: Anyone
   - Copy Web App URL

4. **config.js updaten:**
   - Öffne `config.js`
   - Ersetze `YOUR_SCRIPT_ID` mit der Web App URL

5. **Hochladen auf GitHub Pages:**
   ```bash
   git add .
   git commit -m "Add Google Sheets integration"
   git remote add origin https://github.com/YOUR_USERNAME/Webseite-Hochzeit.git
   git branch -M main
   git push -u origin main
   ```
   - Gehe zu GitHub Repo Settings > Pages > Branch: main > Save
   - Nach 2 Min: https://YOUR_USERNAME.github.io/Webseite-Hochzeit/

