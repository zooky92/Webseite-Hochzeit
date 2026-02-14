const attendanceYes = document.getElementById("attendance-yes");
const attendanceNo = document.getElementById("attendance-no");
const guestCountInput = document.getElementById("guestCount");
const guestFields = document.getElementById("guest-fields");
const attendanceRadios = document.querySelectorAll("input[name='attendance']");

const menuOptions = ["Fleisch", "Fisch", "Vegetarisch", "Vegan"];

const buildGuestField = (index) => {
  const wrapper = document.createElement("div");
  wrapper.className = "guest-card";

  const title = document.createElement("h3");
  title.textContent = `Person ${index + 1}`;

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Vorname";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = `guest_${index + 1}_firstName`;
  nameLabel.appendChild(nameInput);

  const lastNameLabel = document.createElement("label");
  lastNameLabel.textContent = "Nachname";
  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.name = `guest_${index + 1}_lastName`;
  lastNameLabel.appendChild(lastNameInput);

  const menuLabel = document.createElement("label");
  menuLabel.textContent = "Menü";
  const menuSelect = document.createElement("select");
  menuSelect.name = `guest_${index + 1}_menu`;
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
  intoleranceInput.name = `guest_${index + 1}_intolerances`;
  intoleranceLabel.appendChild(intoleranceInput);

  wrapper.append(title, nameLabel, lastNameLabel, menuLabel, intoleranceLabel);
  return wrapper;
};

const renderGuestFields = (count) => {
  guestFields.innerHTML = "";
  const safeCount = Number.isNaN(count) ? 0 : Math.min(Math.max(count, 1), 10);

  for (let i = 0; i < safeCount; i += 1) {
    guestFields.appendChild(buildGuestField(i));
  }
};

attendanceRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const isYes = event.target.value === "yes";
    attendanceYes.classList.toggle("hidden", !isYes);
    attendanceNo.hidden = isYes;

    if (isYes) {
      renderGuestFields(parseInt(guestCountInput.value, 10));
    }
  });
});

guestCountInput.addEventListener("input", (event) => {
  const value = parseInt(event.target.value, 10);
  renderGuestFields(value);
});

document.getElementById("rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitToGoogleSheets();
});
guestCount: formData.get("guestCount"),
    guests: [],
  };

  if (data.attendance === "yes") {
    const guestCount = parseInt(data.guestCount, 10);
    for (let i = 1; i <= guestCount; i += 1) {
      data.guests.push({
        firstName: formData.get(`guest_${i}_firstName`),
        lastName: formData.get(`guest_${i}_la
  };

  if (data.attendance === "yes") {
    const guestCount = parseInt(data.guestCount, 10);
    for (let i = 1; i <= guestCount; i += 1) {
      data.guests.push({
        firstName: formData.get(`guest_${i}_firstName`),
        menu: formData.get(`guest_${i}_menu`),
        intolerances: formData.get(`guest_${i}_intolerances`),
      });
    }
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data),
    });

    alert("✓ Danke für eure Rückmeldung! Die Daten wurden gespeichert.");
    form.reset();
    document.getElementById("attendance-yes").classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Senden:", error);
    alert("Fehler beim Speichern. Bitte versuche es später erneut.");
  }
};
