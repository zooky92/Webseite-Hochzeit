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

  wrapper.append(title, nameLabel, menuLabel, intoleranceLabel);
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
  alert("Danke für eure Rückmeldung! Bitte sendet die Angaben an die Gastgeber.");
});
