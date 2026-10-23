// ============================================================
// TORQUE - car discovery and comparison
// Tip: to change a photo, edit the `img` link of any car below.
// ============================================================

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// ---------- 1. Data: an array of car objects ----------
const cars = [
  { id: 1, name: "911 GT3", brand: "Porsche", year: 2024, type: "Coupe", hp: 502, torque: 346, engine: "4.0L flat-6", accel: 3.2, price: 222000, featured: true, img: photo("1503376780353-7e6692767b70") },
  { id: 2, name: "296 GTB", brand: "Ferrari", year: 2024, type: "Supercar", hp: 819, torque: 546, engine: "3.0L twin-turbo V6 hybrid", accel: 2.8, price: 322000, featured: true, img: photo("1583121274602-3e2820c69888") },
  { id: 3, name: "Huracan Tecnica", brand: "Lamborghini", year: 2023, type: "Supercar", hp: 631, torque: 416, engine: "5.2L V10", accel: 3.2, price: 239000, featured: true, img: photo("1614162692292-7ac56d7f7f1e") },
  { id: 4, name: "750S", brand: "McLaren", year: 2024, type: "Supercar", hp: 740, torque: 590, engine: "4.0L twin-turbo V8", accel: 2.7, price: 324000, featured: false, img: photo("1544636331-e26879cd4d9b") },
  { id: 5, name: "Model S Plaid", brand: "Tesla", year: 2024, type: "Electric", hp: 1020, torque: 1050, engine: "Tri-motor electric", accel: 1.99, price: 89990, featured: false, img: photo("1617788138017-80ad40651399") },
  { id: 6, name: "Taycan Turbo S", brand: "Porsche", year: 2024, type: "Electric", hp: 750, torque: 774, engine: "Dual-motor electric", accel: 2.4, price: 195000, featured: false, img: photo("1580273916550-e323be2ae537") },
  { id: 7, name: "M3 Competition", brand: "BMW", year: 2024, type: "Sedan", hp: 503, torque: 479, engine: "3.0L twin-turbo I6", accel: 3.4, price: 83000, featured: false, img: photo("1555215695-3004980ad54e") },
  { id: 8, name: "AMG GT 63", brand: "Mercedes-AMG", year: 2024, type: "Coupe", hp: 577, torque: 590, engine: "4.0L twin-turbo V8", accel: 3.2, price: 160000, featured: false, img: photo("1618843479313-40f8afb4b4d8") },
  { id: 9, name: "Corvette Z06", brand: "Chevrolet", year: 2024, type: "Coupe", hp: 670, torque: 460, engine: "5.5L flat-plane V8", accel: 2.6, price: 110000, featured: false, img: photo("1494976388531-d1058494cdd8") },
  { id: 10, name: "Vantage", brand: "Aston Martin", year: 2024, type: "Coupe", hp: 656, torque: 590, engine: "4.0L twin-turbo V8", accel: 3.4, price: 191000, featured: false, img: photo("1492144534655-ae79c964c9d7") }
];

// ---------- 2. State: what the user has chosen ----------
let garage = loadGarage();   // array of car ids saved by the user
let compareList = [];        // array of up to 3 car ids

// ---------- 3. Grab elements from the page ----------
const searchBox = document.getElementById("search");
const brandFilter = document.getElementById("brandFilter");
const typeFilter = document.getElementById("typeFilter");
const sortSelect = document.getElementById("sort");
const carGrid = document.getElementById("carGrid");
const garageGrid = document.getElementById("garageGrid");
const featuredGrid = document.getElementById("featuredGrid");
const compareArea = document.getElementById("compareArea");

// ---------- 4. Small helper functions ----------
function findCar(id) {
  return cars.find((car) => car.id === id);
}

function money(n) {
  return "$" + n.toLocaleString("en-US");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------- 5. Dream Garage: saving with localStorage ----------
function loadGarage() {
  try {
    return JSON.parse(localStorage.getItem("torqueGarage")) || [];
  } catch (error) {
    return [];
  }
}

function saveGarage() {
  localStorage.setItem("torqueGarage", JSON.stringify(garage));
}

function toggleGarage(id) {
  const car = findCar(id);
  if (garage.includes(id)) {
    garage = garage.filter((savedId) => savedId !== id);
    showToast(car.brand + " " + car.name + " removed from your garage");
  } else {
    garage.push(id);
    showToast(car.brand + " " + car.name + " saved to your garage");
  }
  saveGarage();
  renderAll();
}

// ---------- 6. Compare: up to 3 cars ----------
function toggleCompare(id) {
  if (compareList.includes(id)) {
    compareList = compareList.filter((cid) => cid !== id);
  } else if (compareList.length >= 3) {
    showToast("You can compare up to 3 cars. Remove one first.");
    return;
  } else {
    compareList.push(id);
    showToast("Added to comparison (" + compareList.length + " of 3)");
  }
  renderAll();
}

// ---------- 7. Building the HTML for one car card ----------
function cardHTML(car) {
  const saved = garage.includes(car.id);
  const comparing = compareList.includes(car.id);
  return `
    <article class="card">
      <div class="card-img"><img src="${car.img}" alt="${car.brand} ${car.name}" loading="lazy" onerror="this.style.opacity=0"></div>
      <div class="card-body">
        <p class="meta">${car.brand} &middot; ${car.year} &middot; ${car.type}${car.isNew ? '<span class="tag">New</span>' : ""}</p>
        <h3>${car.name}</h3>
        <div class="specs">
          <div><b>${car.hp}</b><span>hp</span></div>
          <div><b>${car.torque}</b><span>lb-ft</span></div>
          <div><b>${car.accel}s</b><span>0-60 mph</span></div>
        </div>
        <p class="price">${money(car.price)}</p>
        <div class="card-actions">
          <button class="${comparing ? "on" : ""}" data-compare="${car.id}">${comparing ? "In comparison" : "Compare"}</button>
          <button class="${saved ? "on" : ""}" data-save="${car.id}">${saved ? "Saved" : "Save to garage"}</button>
        </div>
      </div>
    </article>`;
}

function renderCards(list, container, emptyMessage) {
  if (list.length === 0) {
    container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    return;
  }
  let html = "";
  for (const car of list) {
    html += cardHTML(car);
  }
  container.innerHTML = html;
}

// ---------- 8. Explorer: search, filter, sort ----------
function fillFilters() {
  const brands = [...new Set(cars.map((car) => car.brand))].sort();
  const types = [...new Set(cars.map((car) => car.type))].sort();
  brandFilter.innerHTML = `<option value="all">All brands</option>` + brands.map((b) => `<option>${b}</option>`).join("");
  typeFilter.innerHTML = `<option value="all">All types</option>` + types.map((t) => `<option>${t}</option>`).join("");
}

function getVisibleCars() {
  const text = searchBox.value.trim().toLowerCase();
  let result = cars.filter((car) => {
    const matchesText = (car.brand + " " + car.name + " " + car.engine).toLowerCase().includes(text);
    const matchesBrand = brandFilter.value === "all" || car.brand === brandFilter.value;
    const matchesType = typeFilter.value === "all" || car.type === typeFilter.value;
    return matchesText && matchesBrand && matchesType;
  });

  const sortBy = sortSelect.value;
  result.sort((a, b) => {
    if (sortBy === "hp-desc") return b.hp - a.hp;
    if (sortBy === "accel-asc") return a.accel - b.accel;
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (a.brand + a.name).localeCompare(b.brand + b.name);
  });
  return result;
}

function renderExplorer() {
  const visible = getVisibleCars();
  document.getElementById("resultCount").textContent = visible.length + (visible.length === 1 ? " car found" : " cars found");
  renderCards(visible, carGrid, "No cars match your search. Try clearing a filter.");
}

// ---------- 9. Comparison table ----------
function renderCompare() {
  document.getElementById("clearCompare").style.display = compareList.length ? "inline-block" : "none";
  if (compareList.length < 2) {
    compareArea.innerHTML = `<p class="empty">${compareList.length === 0 ? "No cars selected yet." : "Add at least one more car to start comparing."} Use the Compare button on any car.</p>`;
    return;
  }
  const picked = compareList.map(findCar);

  // Work out the best value in each row
  const bestHp = Math.max(...picked.map((c) => c.hp));
  const bestTorque = Math.max(...picked.map((c) => c.torque));
  const bestAccel = Math.min(...picked.map((c) => c.accel));

  const row = (label, getValue, isBest) =>
    `<tr><th>${label}</th>` + picked.map((c) => `<td class="${isBest && isBest(c) ? "best" : ""}">${getValue(c)}</td>`).join("") + `</tr>`;

  compareArea.innerHTML = `
    <div class="compare-wrap"><table>
      <tr><th></th>${picked.map((c) => `
        <td class="cmp-head">
          <div class="card-img"><img src="${c.img}" alt="" onerror="this.style.opacity=0"></div>
          <h3>${c.brand} ${c.name}</h3>
          <button class="cmp-remove" data-compare="${c.id}">Remove</button>
        </td>`).join("")}</tr>
      ${row("Horsepower", (c) => c.hp + " hp", (c) => c.hp === bestHp)}
      ${row("Torque", (c) => c.torque + " lb-ft", (c) => c.torque === bestTorque)}
      ${row("Engine", (c) => c.engine)}
      ${row("0-60 mph", (c) => c.accel + " s", (c) => c.accel === bestAccel)}
      ${row("Price", (c) => money(c.price))}
    </table></div>`;
}

// ---------- 10. Draw everything ----------
function renderAll() {
  renderExplorer();
  renderCards(cars.filter((c) => c.featured), featuredGrid, "");
  renderCards(garage.map(findCar), garageGrid, "Your garage is empty. Save a car to start your collection.");
  renderCompare();
  renderRecs();
  renderReminders();
  renderNotes();
  document.getElementById("garageCount").textContent = garage.length;
  document.getElementById("compareCount").textContent = compareList.length;
}

// ---------- 11. Events ----------
searchBox.addEventListener("input", renderExplorer);
brandFilter.addEventListener("change", renderExplorer);
typeFilter.addEventListener("change", renderExplorer);
sortSelect.addEventListener("change", renderExplorer);

// One click listener for every button (even ones created later)
document.addEventListener("click", (event) => {
  const saveBtn = event.target.closest("[data-save]");
  const compareBtn = event.target.closest("[data-compare]");
  if (saveBtn) toggleGarage(Number(saveBtn.dataset.save));
  if (compareBtn) toggleCompare(Number(compareBtn.dataset.compare));
});

document.getElementById("clearCompare").addEventListener("click", () => {
  compareList = [];
  renderAll();
});

// Mobile menu
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", () => navLinks.classList.remove("open"));

// ============================================================
// SMART FEATURES (all saved in localStorage, no backend)
// ============================================================

// Demo "new for sale" cars. The Simulate button adds them one at a time.
const newListings = [
  { id: 101, name: "Emira", brand: "Lotus", year: 2025, type: "Coupe", hp: 400, torque: 310, engine: "3.5L supercharged V6", accel: 3.9, price: 99900, isNew: true, img: photo("1503376780353-7e6692767b70") },
  { id: 102, name: "Air Sapphire", brand: "Lucid", year: 2025, type: "Electric", hp: 1234, torque: 1430, engine: "Tri-motor electric", accel: 1.89, price: 249000, isNew: true, img: photo("1617788138017-80ad40651399") },
  { id: 103, name: "12Cilindri", brand: "Ferrari", year: 2025, type: "Supercar", hp: 819, torque: 500, engine: "6.5L V12", accel: 2.9, price: 395000, isNew: true, img: photo("1583121274602-3e2820c69888") },
  { id: 104, name: "M5", brand: "BMW", year: 2025, type: "Sedan", hp: 717, torque: 738, engine: "4.4L twin-turbo V8 hybrid", accel: 3.4, price: 120000, isNew: true, img: photo("1555215695-3004980ad54e") },
  { id: 105, name: "RS6 Avant", brand: "Audi", year: 2025, type: "Wagon", hp: 621, torque: 627, engine: "4.0L twin-turbo V8", accel: 3.5, price: 126000, isNew: true, img: photo("1494976388531-d1058494cdd8") }
];

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let addedIds = readJSON("torqueNewCars", []);      // demo listings already added
let license = readJSON("torqueLicense", "");        // "YYYY-MM-DD" or ""
let reminders = readJSON("torqueReminders", []);   // [{id, label, date, daysBefore}]
let notes = readJSON("torqueNotes", []);           // [{key, kind, text, time, read}]

// Put previously added demo listings back into the car list
for (const id of addedIds) {
  const car = newListings.find((n) => n.id === id);
  if (car) cars.push(car);
}

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Personalized recommendations ----------
// Count the types and brands in the user's garage
function getTaste() {
  const types = {};
  const brands = {};
  for (const id of garage) {
    const car = findCar(id);
    if (!car) continue;
    types[car.type] = (types[car.type] || 0) + 1;
    brands[car.brand] = (brands[car.brand] || 0) + 1;
  }
  return { types, brands };
}

// Returns a sentence explaining the match, or "" if there is none
function matchReason(car) {
  const taste = getTaste();
  if (taste.types[car.type]) return "Matches the " + car.type + " cars in your garage.";
  if (taste.brands[car.brand]) return "You saved another " + car.brand + ".";
  return "";
}

function renderRecs() {
  const taste = getTaste();
  const score = (car) => (taste.types[car.type] || 0) * 2 + (taste.brands[car.brand] || 0);
  const picks = cars.filter((car) => !garage.includes(car.id) && score(car) > 0)
    .sort((a, b) => score(b) - score(a)).slice(0, 3);
  const favTypes = Object.keys(taste.types).join(", ");
  document.getElementById("recsNote").textContent = favTypes
    ? "Based on your garage, you like: " + favTypes + "."
    : "Save a few cars to your garage and we will learn what you like.";
  renderCards(picks, document.getElementById("recsGrid"), "No new matches yet. We will notify you when a match is listed.");
}

// ---------- Notifications ----------
function addNote(key, kind, text) {
  if (notes.some((n) => n.key === key)) return;   // never notify twice for the same thing
  notes.unshift({ key: key, kind: kind, text: text, time: new Date().toLocaleString(), read: false });
  writeJSON("torqueNotes", notes);
  showToast("New alert: " + text);
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Torque", { body: text });   // only works while the tab is open
  }
}

function renderNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = notes.length
    ? notes.map((n) => `<li class="${n.kind} ${n.read ? "" : "unread"}"><span>${esc(n.text)}<small>${esc(n.time)}</small></span></li>`).join("")
    : `<li>No alerts yet. New car matches and upcoming deadlines will appear here.</li>`;
  document.getElementById("alertCount").textContent = notes.filter((n) => !n.read).length;
}

// Simulate a new car arriving for sale
function simulateListing() {
  const car = newListings.find((n) => !addedIds.includes(n.id));
  if (!car) {
    showToast("All demo listings have been added.");
    return;
  }
  cars.push(car);
  addedIds.push(car.id);
  writeJSON("torqueNewCars", addedIds);

  const reason = matchReason(car);
  if (reason) {
    addNote("car-" + car.id, "match", "New listing: " + car.brand + " " + car.name + ". " + reason);
  } else {
    showToast(car.brand + " " + car.name + " listed. Not a match for your taste yet.");
  }
  const brand = brandFilter.value;
  const type = typeFilter.value;
  fillFilters();                         // new brand may need adding to the filter
  brandFilter.value = brand;
  typeFilter.value = type;
  renderAll();
}

// ---------- Deadlines ----------
function daysUntil(dateText) {
  const due = new Date(dateText + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function describeDays(n) {
  if (n < 0) return Math.abs(n) + (n === -1 ? " day overdue" : " days overdue");
  if (n === 0) return "due today";
  return n + (n === 1 ? " day left" : " days left");
}

function checkDeadlines() {
  if (license) {
    const n = daysUntil(license);
    if (n <= 60) {
      addNote("license-" + license + (n < 0 ? "-over" : "-soon"), "deadline", "Driver's license: " + describeDays(n) + " (expires " + license + ").");
    }
  }
  for (const r of reminders) {
    const n = daysUntil(r.date);
    if (n <= r.daysBefore) {
      addNote("rem-" + r.id + (n < 0 ? "-over" : "-soon"), "deadline", r.label + ": " + describeDays(n) + " (" + r.date + ").");
    }
  }
  renderNotes();
}

function renderReminders() {
  const status = document.getElementById("licenseStatus");
  if (license) {
    const n = daysUntil(license);
    status.textContent = "Expires " + license + ": " + describeDays(n) + ".";
    status.className = "status" + (n <= 60 ? " warn" : "");
  } else {
    status.textContent = "No expiry date saved. We remind you 60 days before.";
    status.className = "status";
  }
  const sorted = [...reminders].sort((a, b) => a.date.localeCompare(b.date));
  document.getElementById("reminderList").innerHTML = sorted.length
    ? sorted.map((r) => {
        const n = daysUntil(r.date);
        return `<li><span>${esc(r.label)}<small class="${n <= r.daysBefore ? "warn" : ""}">${r.date} &middot; ${describeDays(n)}</small></span><button data-del-rem="${r.id}">Delete</button></li>`;
      }).join("")
    : `<li>No vehicle dates yet. Add an insurance renewal or inspection above.</li>`;
}

// ---------- Events for the smart features ----------
document.getElementById("licenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  license = document.getElementById("licenseDate").value;
  writeJSON("torqueLicense", license);
  showToast("License date saved");
  checkDeadlines();
  renderReminders();
});

document.getElementById("reminderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("remNote").value.trim();
  const label = document.getElementById("remType").value + (note ? " (" + note + ")" : "");
  reminders.push({
    id: Date.now(),
    label: label,
    date: document.getElementById("remDate").value,
    daysBefore: Number(document.getElementById("remDays").value) || 0
  });
  writeJSON("torqueReminders", reminders);
  event.target.reset();
  showToast("Reminder added");
  checkDeadlines();
  renderReminders();
});

document.addEventListener("click", (event) => {
  const del = event.target.closest("[data-del-rem]");
  if (!del) return;
  reminders = reminders.filter((r) => r.id !== Number(del.dataset.delRem));
  writeJSON("torqueReminders", reminders);
  renderReminders();
});

document.getElementById("simulateBtn").addEventListener("click", simulateListing);
document.getElementById("readAll").addEventListener("click", () => {
  notes.forEach((n) => (n.read = true));
  writeJSON("torqueNotes", notes);
  renderNotes();
});
document.getElementById("clearNotes").addEventListener("click", () => {
  notes = [];
  writeJSON("torqueNotes", notes);
  renderNotes();
});
document.getElementById("enableAlerts").addEventListener("click", () => {
  if (!("Notification" in window)) {
    showToast("This browser does not support notifications.");
    return;
  }
  Notification.requestPermission().then((result) =>
    showToast(result === "granted" ? "Browser alerts on while this tab is open" : "Browser alerts were blocked"));
});

// ---------- 12. Start ----------
const heroImg = document.getElementById("heroImg");
heroImg.src = cars[1].img;
heroImg.onerror = () => (heroImg.style.opacity = 0);
fillFilters();
renderAll();
document.getElementById("licenseDate").value = license;
checkDeadlines();
setInterval(checkDeadlines, 30000);   // simulated background check, only runs while the page is open
