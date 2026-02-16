// ==================== PASSWORD PROTECTION ====================
const CORRECT_PASSWORD = "mdh060626";

function initPasswordProtection() {
  const overlay = document.getElementById("password-overlay");
  const input = document.getElementById("password-input");
  const submitBtn = document.getElementById("password-submit");
  const errorMsg = document.getElementById("password-error");
  const mainContent = document.getElementById("main-content");

  // Check if password was already entered in this session
  if (sessionStorage.getItem("passwordAuthenticated") === "true") {
    overlay.style.display = "none";
    mainContent.style.display = "block";
    return;
  }

  function authenticate() {
    if (input.value === CORRECT_PASSWORD) {
      sessionStorage.setItem("passwordAuthenticated", "true");
      overlay.style.display = "none";
      mainContent.style.display = "block";
      errorMsg.textContent = "";
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

// ==================== RSVP FORM LOGIC ====================
const guestFields = document.getElementById("guest-fields");
const addGuestBtn = document.getElementById("add-guest-btn");
const attendanceRadios = document.querySelectorAll("input[name='attendance']");

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
  const currentCount = document.querySelectorAll(".guest-card").length;
  const nextIndex = currentCount + 1;
  guestCount = nextIndex;
  guestFields.appendChild(buildGuestField(nextIndex, includeMenu));
};

const updateGuestCardsLanguage = () => {
  const attendanceInput = document.querySelector("input[name='attendance']:checked");
  if (!attendanceInput) return;

  const includeMenu = attendanceInput.value === "yes";
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

attendanceRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    document.getElementById("guest-info").classList.remove("hidden");
    guestFields.innerHTML = "";
    guestCount = 0;
    const isAttending = event.target.value === "yes";
    addGuest(isAttending);
  });
});

addGuestBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const isAttending = document.querySelector("input[name='attendance']:checked")?.value === "yes";
  addGuest(isAttending);
});

document.getElementById("rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitToGoogleSheets();
});

const submitToGoogleSheets = async () => {
  const lang = getCurrentLanguage();
  const form = document.getElementById("rsvp-form");
  const formData = new FormData(form);

  const data = {
    attendance: formData.get("attendance"),
    guests: [],
  };

  const guestCards = document.querySelectorAll(".guest-card");
  guestCards.forEach((card) => {
    const guestId = card.id.replace("guest-", "");
    data.guests.push({
      firstName: formData.get(`guest_${guestId}_firstName`),
      lastName: formData.get(`guest_${guestId}_lastName`),
      menu: formData.get(`guest_${guestId}_menu`),
      intolerances: formData.get(`guest_${guestId}_intolerances`),
    });
  });

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });

    alert(getTranslation("successMessage", lang));
    form.reset();
    guestFields.innerHTML = "";
    guestCount = 0;
    document.getElementById("guest-info").classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    alert(getTranslation("errorMessage", lang));
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Initialize password protection first
  initPasswordProtection();

  const flagBtns = document.querySelectorAll(".flag-btn");
  flagBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);

      // Aktualisiere vorhandene Gästekarten in die neue Sprache
      updateGuestCardsLanguage();

      flagBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const currentLang = getCurrentLanguage();
  document.querySelector(`.flag-btn[data-lang="${currentLang}"]`)?.classList.add("active");

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
