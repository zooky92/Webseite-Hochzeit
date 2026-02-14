const translations = {
  de: {
    eyebrow: "Hochzeitseinladung",
    title: "Marisa &amp; Denny",
    subtitle: "Wir freuen uns, diesen besonderen Tag mit euch zu feiern und laden euch herzlich ein.",
    inviteTitle: "Einladung",
    inviteText: "Bitte gebt uns bis zum <strong>Datum eintragen</strong> Bescheid, ob ihr dabei seid. Wir freuen uns auf einen unvergesslichen Tag mit euch.",
    location: "<strong>Location:</strong> Adresse eintragen, Ort eintragen",
    note: "Hinweis: Datum und Adresse bitte ersetzen.",
    rsvpTitle: "Rückmeldung",
    decisionLabel: "Entscheidung (Bitte gebt eure Namen auch ein wenn ihr nicht kommt damit wir einfacher planen können)",
    attending: "Wir kommen",
    notAttending: "Wir kommen nicht",
    firstName: "Vorname",
    lastName: "Nachname",
    menu: "Menü",
    intolerances: "Unverträglichkeiten",
    addGuest: "Weitere Person hinzufügen",
    removeGuest: "Person entfernen",
    submit: "Antwort speichern",
    disclaimer: "Dieses Formular speichert keine Daten automatisch.",
    successMessage: "✓ Danke für eure Rückmeldung! Die Daten wurden gespeichert.",
    errorMessage: "Fehler beim Speichern. Bitte versuche es später erneut.",
    menuOptions: ["Fleisch", "Fisch", "Vegetarisch", "Vegan"],
  },
  en: {
    eyebrow: "Wedding Invitation",
    title: "Marisa &amp; Denny",
    subtitle: "We are delighted to celebrate this special day with you and warmly invite you.",
    inviteTitle: "Invitation",
    inviteText: "Please let us know by <strong>enter date</strong> whether you can make it. We look forward to an unforgettable day with you.",
    location: "<strong>Location:</strong> Enter address, enter location",
    note: "Note: Please replace date and address.",
    rsvpTitle: "RSVP",
    decisionLabel: "Decision (Please enter your names even if you can't make it so we can plan better)",
    attending: "We will attend",
    notAttending: "We cannot attend",
    firstName: "First Name",
    lastName: "Last Name",
    menu: "Menu",
    intolerances: "Dietary Restrictions",
    addGuest: "Add Another Person",
    removeGuest: "Remove Person",
    submit: "Submit Response",
    disclaimer: "This form does not save data automatically.",
    successMessage: "✓ Thank you for your response! Your data has been saved.",
    errorMessage: "Error saving data. Please try again later.",
    menuOptions: ["Meat", "Fish", "Vegetarian", "Vegan"],
  },
  hr: {
    eyebrow: "Poziv na vjenčanje",
    title: "Marisa &amp; Denny",
    subtitle: "Radujemo se što ćemo proslaviti ovaj poseban dan s vama i srdačno vas pozivamo.",
    inviteTitle: "Poziv",
    inviteText: "Molimo vas da nam javite do <strong>unesite datum</strong> možete li doći. Čekamo vas na nezaboravnom danu s vama.",
    location: "<strong>Lokacija:</strong> Unesite adresu, unesite mjesto",
    note: "Napomena: Molimo zamijenite datum i adresu.",
    rsvpTitle: "RSVP",
    decisionLabel: "Odgovor (Molimo unesite imena čak i ako ne možete doći kako bi nam bilo lakše planirati)",
    attending: "Dolazimo",
    notAttending: "Nismo u mogućnosti doći",
    firstName: "Ime",
    lastName: "Prezime",
    menu: "Meni",
    intolerances: "Alergije i prehrambene potrebe",
    addGuest: "Dodaj još jednu osobu",
    removeGuest: "Ukloni osobu",
    submit: "Pošalji odgovor",
    disclaimer: "Ovaj obrazac automatski ne sprema podatke.",
    successMessage: "✓ Hvala na odgovoru! Vaši podaci su spremljeni.",
    errorMessage: "Greška pri spremanju podataka. Molimo pokušajte kasnije.",
    menuOptions: ["Meso", "Riba", "Vegetarijansko", "Veganski"],
  },
};

function getTranslation(key, lang = getCurrentLanguage()) {
  return translations[lang]?.[key] || translations.de[key] || key;
}

function getCurrentLanguage() {
  return localStorage.getItem("selectedLanguage") || "de";
}

function setLanguage(lang) {
  localStorage.setItem("selectedLanguage", lang);
  updatePageLanguage(lang);
}

function updatePageLanguage(lang) {
  document.documentElement.lang = lang;

  // Aktualisiere alle Texte mit data-i18n Attribut
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.innerHTML = getTranslation(key, lang);
  });

  // Aktualisiere Dropdown auf neueste Sprache
  const languageSelect = document.getElementById("language-select");
  if (languageSelect) {
    languageSelect.value = lang;
  }
}

// Initialisiere die Sprache beim Laden
document.addEventListener("DOMContentLoaded", () => {
  const lang = getCurrentLanguage();
  updatePageLanguage(lang);
});
