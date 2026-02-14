const attendanceYes = document.getElementById("guest-info");
const guestFields = document.getElementById("guest-fields");
const addGuestBtn = document.getElementById("add-guest-btn");
const attendanceRadios = document.querySelectorAll("input[name='attendance']");

let guestCount = 0;

const menuOptions = ["Fleisch", "Fisch", "Vegetarisch", "Vegan"];

const removeGuest = (index) => {
  const element = document.getElementById(`guest-${index}`);
  if (element) {
    element.remove();
  }
};

const buildGuestField = (index) => {
  const wrapper = document.createElement("div");
  wrapper.className = "guest-card";
  wrapper.id = `guest-${index}`;

  const title = document.createElement("h3");
  title.textContent = `Person ${index}`;

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Vorname";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = `guest_${index}_firstName`;
  nameLabel.appendChild(nameInput);

  const lastNameLabel = document.createElement("label");
  lastNameLabel.textContent = "Nachname";
  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.name = `guest_${index}_lastName`;
  lastNameLabel.appendChild(lastNameInput);

  const menuLabel = document.createElement("label");
  menuLabel.textContent = "Menü";
  const menuSelect = document.createElement("select");
  menuSelect.name = `guest_${index}_menu`;
  menuOptions.forEach((option) => {
    const item = document.createElement("option");
    item.value = option;
    item.textContent = option;
    menuSelect.appendChild(item);
  });
  menuLabel.appendChild(menuSelect);

  const intoleranceLabel = document.createElement("label");
  intoleranceLabel.textContent = "Unverträglichkeiten";
  const intoleranceInput = document.createElement("input");
  intoleranceInput.type = "text";
  intoleranceInput.name = `guest_${index}_intolerances`;
  intoleranceLabel.appendChild(intoleranceInput);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-guest";
  removeBtn.textContent = "Person entfernen";
  removeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    removeGuest(index);
  });

  wrapper.append(title, nameLabel, lastNameLabel, menuLabel, intoleranceLabel, removeBtn);
  return wrapper;
};

const addGuest = () => {
  guestCount += 1;
  guestFields.appendChild(buildGuestField(guestCount));
};

attendanceRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    attendanceYes.classList.remove("hidden");
    
    if (guestCount === 0) {
      addGuest();
    }
  });
});

addGuestBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addGuest();
});

document.getElementById("rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitToGoogleSheets();
});

const submitToGoogleSheets = async () => {
  const form = document.getElementById("rsvp-form");
  const formData = new FormData(form);

  const data = {
    attendance: formData.get("attendance"),
    guests: [],
  };

  // Sammle nur die Gäste, die noch vorhanden sind
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

    alert("✓ Danke für eure Rückmeldung! Die Daten wurden gespeichert.");
    form.reset();
    guestFields.innerHTML = "";
    guestCount = 0;
    document.getElementById("guest-info").classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    alert("Fehler beim Speichern. Bitte versuche es später erneut.");
  }
};
