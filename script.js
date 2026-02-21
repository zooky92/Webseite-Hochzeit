// ==================== PASSWORD PROTECTION ====================
const CORRECT_PASSWORD = "mdh060626";
const IBAN = "DE 83 1203 0000 1054 7276 54";

function initPasswordProtection() {
  const overlay = document.getElementById("password-overlay");
  const input = document.getElementById("password-input");
  const submitBtn = document.getElementById("password-submit");
  const errorMsg = document.getElementById("password-error");
  const mainContent = document.getElementById("main-content");

  // Stelle sicher, dass die Übersetzungen geladen sind
  const lang = getCurrentLanguage();
  updatePageLanguage(lang);

  // Check if password was already entered in this session
  if (sessionStorage.getItem("passwordAuthenticated") === "true") {
    overlay.style.display = "none";
    mainContent.style.display = "block";
    revealIBAN();
    return;
  }

  function authenticate() {
    if (input.value === CORRECT_PASSWORD) {
      sessionStorage.setItem("passwordAuthenticated", "true");
      overlay.style.display = "none";
      mainContent.style.display = "block";
      errorMsg.textContent = "";
      revealIBAN();
    } else {
      errorMsg.textContent = "Passwort falsch. Bitte versuchen Sie es erneut.";
      input.value = "";
      input.focus();
    }
  }

  submitBtn.addEventListener("click", authenticate);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      authenticate();
    }
  });

  // Focus input on load
  input.focus();
}

function revealIBAN() {
  // Nur nach Passwort-Authentifizierung zeigen
  if (sessionStorage.getItem("passwordAuthenticated") === "true") {
    // IBAN anzeigen
    const ibanDe = document.getElementById("iban-de");
    const ibanEn = document.getElementById("iban-en");
    const ibanHr = document.getElementById("iban-hr");
    
    if (ibanDe) ibanDe.textContent = IBAN;
    if (ibanEn) ibanEn.textContent = IBAN;
    if (ibanHr) ibanHr.textContent = IBAN;
    
    // PayPal-Links anzeigen
    const paypalLink = '<a href="https://paypal.me/dennysk92" target="_blank" rel="noopener">paypal.me/dennysk92</a>';
    const paypalLinkDe = document.getElementById("paypal-link-de");
    const paypalLinkEn = document.getElementById("paypal-link-en");
    const paypalLinkHr = document.getElementById("paypal-link-hr");
    
    if (paypalLinkDe) paypalLinkDe.innerHTML = paypalLink;
    if (paypalLinkEn) paypalLinkEn.innerHTML = paypalLink;
    if (paypalLinkHr) paypalLinkHr.innerHTML = paypalLink;
  }
}

// ==================== RSVP FORM LOGIC ====================
let guestCount = 0;

function buildGuestField(index, includeMenu = true) {
  const lang = getCurrentLanguage();
  const wrapper = document.createElement("div");
  wrapper.className = "guest-card";
  wrapper.id = `guest-${index}`;

  const title = document.createElement("h3");
  title.textContent = `Person ${index}`;

  const nameLabel = document.createElement("label");
  nameLabel.textContent = getTranslation("firstName", lang);
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = `guest_${index}_firstName`;
  nameLabel.appendChild(nameInput);

  const lastNameLabel = document.createElement("label");
  lastNameLabel.textContent = getTranslation("lastName", lang);
  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.name = `guest_${index}_lastName`;
  lastNameLabel.appendChild(lastNameInput);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-guest";
  removeBtn.textContent = getTranslation("removeGuest", lang);
  removeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    removeGuest(index);
  });

  wrapper.append(title, nameLabel, lastNameLabel);

  if (includeMenu) {
    const menuLabel = document.createElement("label");
    menuLabel.textContent = getTranslation("menu", lang);
    const menuSelect = document.createElement("select");
    menuSelect.name = `guest_${index}_menu`;
    const menuOptions = getTranslation("menuOptions", lang);
    menuOptions.forEach((option) => {
      const item = document.createElement("option");
      item.value = option;
      item.textContent = option;
      menuSelect.appendChild(item);
    });
    menuLabel.appendChild(menuSelect);
    wrapper.appendChild(menuLabel);

    const intoleranceLabel = document.createElement("label");
    intoleranceLabel.textContent = getTranslation("intolerances", lang);
    const intoleranceInput = document.createElement("input");
    intoleranceInput.type = "text";
    intoleranceInput.name = `guest_${index}_intolerances`;
    intoleranceLabel.appendChild(intoleranceInput);
    wrapper.appendChild(intoleranceLabel);
  }

  wrapper.appendChild(removeBtn);
  return wrapper;
}

const removeGuest = (index) => {
  const element = document.getElementById(`guest-${index}`);
  if (element) {
    element.remove();
  }
};

const addGuest = (includeMenu = true) => {
  const guestFields = document.getElementById("guest-fields");
  const currentCount = document.querySelectorAll(".guest-card").length;
  const nextIndex = currentCount + 1;
  guestCount = nextIndex;
  guestFields.appendChild(buildGuestField(nextIndex, includeMenu));
};

const updateGuestCardsLanguage = () => {
  const guestFields = document.getElementById("guest-fields");
  const attendanceValue = document.getElementById("attendance-input").value;
  if (!attendanceValue) return;

  const includeMenu = attendanceValue === "yes";
  const cards = document.querySelectorAll(".guest-card");
  if (!cards.length) return;

  const existingGuests = [];
  cards.forEach((card) => {
    const guestId = card.id.replace("guest-", "");
    existingGuests.push({
      firstName: document.querySelector(`input[name='guest_${guestId}_firstName']`)?.value || "",
      lastName: document.querySelector(`input[name='guest_${guestId}_lastName']`)?.value || "",
      menu: document.querySelector(`select[name='guest_${guestId}_menu']`)?.value || "",
      intolerances: document.querySelector(`input[name='guest_${guestId}_intolerances']`)?.value || "",
    });
  });

  guestFields.innerHTML = "";
  guestCount = 0;

  existingGuests.forEach((guest, index) => {
    const idx = index + 1;
    addGuest(includeMenu);
    const card = document.getElementById(`guest-${idx}`);
    if (!card) return;

    const firstNameInput = card.querySelector(`input[name='guest_${idx}_firstName']`);
    const lastNameInput = card.querySelector(`input[name='guest_${idx}_lastName']`);
    if (firstNameInput) firstNameInput.value = guest.firstName;
    if (lastNameInput) lastNameInput.value = guest.lastName;

    if (includeMenu) {
      const menuSelect = card.querySelector(`select[name='guest_${idx}_menu']`);
      const intoleranceInput = card.querySelector(`input[name='guest_${idx}_intolerances']`);
      if (menuSelect && guest.menu) menuSelect.value = guest.menu;
      if (intoleranceInput) intoleranceInput.value = guest.intolerances;
    }
  });
};

const submitToGoogleSheets = async () => {
  const lang = getCurrentLanguage();
  const form = document.getElementById("rsvp-form");

  const guestCards = document.querySelectorAll(".guest-card");
  const guestData = [];

  // Alle Gäste sammeln
  guestCards.forEach((card) => {
    const guestId = card.id.replace("guest-", "");
    const firstNameInput = card.querySelector(`input[name='guest_${guestId}_firstName']`);
    const lastNameInput = card.querySelector(`input[name='guest_${guestId}_lastName']`);
    const menuSelect = card.querySelector(`select[name='guest_${guestId}_menu']`);
    const intoleranceInput = card.querySelector(`input[name='guest_${guestId}_intolerances']`);
    
    guestData.push({
      firstName: firstNameInput?.value || "",
      lastName: lastNameInput?.value || "",
      menu: menuSelect?.value || "",
      intolerances: intoleranceInput?.value || "",
    });
  });

  // Validierung: Vor- und Nachname sind erforderlich
  for (const guest of guestData) {
    if (!guest.firstName.trim() || !guest.lastName.trim()) {
      alert(getTranslation("validationError", lang));
      return;
    }
  }

  // Datenstruktur vorbereiten: Erster Gast ist der Antworter
  const data = {
    firstName: guestData[0]?.firstName || "",
    lastName: guestData[0]?.lastName || "",
    attendance: document.getElementById("attendance-input").value,
    guests: guestData.slice(1).map(guest => ({
      firstName: guest.firstName,
      menu: guest.menu,
      intolerances: guest.intolerances,
    })),
  };

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });

    alert(getTranslation("successMessage", lang));
    form.reset();
    const guestFields = document.getElementById("guest-fields");
    guestFields.innerHTML = "";
    guestCount = 0;
    document.getElementById("guest-info").classList.add("hidden");
    
    // Reset buttons
    const attendanceBtns = document.querySelectorAll(".attendance-btn");
    attendanceBtns.forEach((btn) => btn.classList.remove("active"));
    document.getElementById("attendance-input").value = "";
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    alert(getTranslation("errorMessage", lang));
  }
};

// ==================== DOM CONTENT LOADED ====================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize password protection
  initPasswordProtection();

  // Initialize form elements
  const guestFields = document.getElementById("guest-fields");
  const addGuestBtn = document.getElementById("add-guest-btn");
  const attendanceInput = document.getElementById("attendance-input");
  const guestInfo = document.getElementById("guest-info");
  const attendanceBtns = document.querySelectorAll(".attendance-btn");
  const form = document.getElementById("rsvp-form");

  // Attendance button logic
  attendanceBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const value = btn.getAttribute("data-value");
      attendanceInput.value = value;

      // Set active button
      attendanceBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show guest info if attending
      if (value === "yes") {
        guestInfo.classList.remove("hidden");
        if (guestFields.querySelectorAll(".guest-card").length === 0) {
          addGuest(true);
        }
      } else {
        guestInfo.classList.add("hidden");
        guestFields.innerHTML = "";
        guestCount = 0;
      }
    });
  });

  // Add guest button
  addGuestBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const isAttending = attendanceInput.value === "yes";
    addGuest(isAttending);
  });

  // Form submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitToGoogleSheets();
  });

  // Language switcher
  const flagBtns = document.querySelectorAll(".flag-btn");
  flagBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
      updateGuestCardsLanguage();

      flagBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const currentLang = getCurrentLanguage();
  document.querySelector(`.flag-btn[data-lang="${currentLang}"]`)?.classList.add("active");

  // Tab switcher
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanels.forEach((panel) => {
        if (panel.getAttribute("data-tab") === target) {
          panel.classList.add("tab-panel-active");
        } else {
          panel.classList.remove("tab-panel-active");
        }
      });
    });
  });
});
