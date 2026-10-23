# TORQUE Code Guide (script.js)

This guide explains `script.js` for people who are new to JavaScript. The source files stay clean; all explanations live here.

**How to use it:** Part 1 explains the building blocks once. Parts 2 to 9 follow the features in the same order as the file. Each part names the numbered section comment in `script.js` (for example "Section 5"). The smart features block has no number and sits just before Section 12.

---

## Part 1. How the three files work together

- `index.html` is the structure. It has empty containers such as `<div id="carGrid"></div>`.
- `style.css` is the look.
- `script.js` fills those containers with content and reacts to clicks and typing.

The `<script src="script.js">` tag is at the very bottom of `index.html` on purpose. The browser reads the page top to bottom, so by the time the script runs, every element it needs already exists.

**The pattern used by every feature:**

1. The user does something (click, type, pick an option).
2. An **event** runs a function.
3. The function changes **state** (an array or variable) and saves it if needed.
4. `renderAll()` redraws the page from the state.

If you remember only one idea, remember this: *the data is the truth, and the page is just a drawing of the data.*

---

## Part 2. JavaScript building blocks (explained once)

### Variables: `const` and `let`
```js
const name = "Torque";   // cannot be given a new value
let count = 0;           // can be changed later
count = 1;
```
Use `const` by default. Use `let` only when the variable must change. We use `let` for `garage`, `compareList`, `license`, `reminders` and `notes` because they are replaced as the user acts. `const` does not stop you changing what is *inside* an array or object (for example `cars.push(car)` works). It only stops you re-assigning the variable itself.

### Arrays `[ ]`
An ordered list. Items are numbered from 0.
```js
const colors = ["red", "blue"];
colors[0];        // "red"
colors.length;    // 2
```
Our arrays: `cars`, `garage` (list of ids), `compareList` (list of ids), `reminders`, `notes`, `newListings`.

### Objects `{ }`
A bundle of named values called **properties**. Each car is one object:
```js
{ id: 1, name: "911 GT3", brand: "Porsche", hp: 502, featured: true }
```
Read a property with a dot: `car.hp`. Square brackets work with a variable name: `types[car.type]`.

### Functions
A named, reusable set of instructions.
```js
function money(n) {          // n is a "parameter" (an input)
  return "$" + n.toLocaleString("en-US");   // return sends a value back
}
money(222000);               // "$222,000"
```
- **Arrow functions** are a shorter way to write one: `(id) => findCar(id)`. We use them mostly for tiny functions passed into array methods. `photo` is a whole arrow function stored in a `const`.
- **Hoisting:** `function name() {}` declarations can be used before the line where they are written. This is why `let garage = loadGarage();` works even though `loadGarage` is defined lower down.
- **Early `return`:** `return;` with nothing after it stops the function immediately (used in `toggleCompare` and `simulateListing`).

### Template literals (backticks)
```js
const text = `${car.brand} ${car.name}`;   // "Porsche 911 GT3"
```
Backticks allow `${ ... }` to insert values and allow text across several lines. Most of our HTML is built this way.

### Operators worth knowing
| Syntax | Meaning | Example in the code |
|---|---|---|
| `===` | equal in value *and* type | `car.id === id` |
| `&&` | both must be true | `matchesText && matchesBrand && matchesType` |
| `\|\|` | "or"; also gives a fallback value | `JSON.parse(...) \|\| []` |
| `condition ? a : b` | ternary: if true use a, else b | `saved ? "Saved" : "Save to garage"` |
| `!` | not | `!garage.includes(car.id)` |
| `...` (spread) | spreads an array's items out | `Math.max(...numbers)` |

### Array methods (used everywhere)
Each one takes a small function and runs it on every item.

| Method | What it does | Returns |
|---|---|---|
| `find(fn)` | first item where `fn` is true | one item (or `undefined`) |
| `filter(fn)` | keeps items where `fn` is true | a new, shorter array |
| `map(fn)` | changes each item | a new array, same length |
| `includes(x)` | is `x` in the array? | true or false |
| `some(fn)` | is *any* item true for `fn`? | true or false |
| `sort(fn)` | reorders the array **in place** | the same array |
| `slice(0, 3)` | copies the first 3 items | a new array |
| `push(x)` | adds `x` at the end | new length |
| `unshift(x)` | adds `x` at the start | new length |
| `join("")` | glues items into one string | a string |

Small example:
```js
const nums = [1, 2, 3, 4];
nums.filter((n) => n > 2);      // [3, 4]
nums.map((n) => n * 10);        // [10, 20, 30, 40]
```
**Sorting with a comparison function:** `sort((a, b) => a - b)`. If the function returns a negative number, `a` goes first; positive, `b` goes first; zero, no change. So `a.hp - b.hp` sorts low to high, and `b.hp - a.hp` sorts high to low.

### Loops
`for (const car of list) { ... }` runs the block once per item. It reads as "for each car in list". We also use `for` loops in the smart features to restore saved cars and check reminders.

### The DOM (Document Object Model)
The DOM is the browser's live copy of your HTML that JavaScript can change.

- `document.getElementById("carGrid")` finds the element with that `id`. We store the result in a variable so we do not search again.
- `element.innerHTML = "..."` replaces everything inside an element with new HTML.
- `element.textContent = "..."` sets plain text only (safer, because it never treats the text as HTML).
- `element.value` reads or sets what is inside an input or select.
- `element.classList.add("show")`, `.remove(...)`, `.toggle(...)` change CSS classes, which is how JavaScript triggers CSS animations.
- `element.style.opacity = 0` sets an inline style directly.

### Events
An event is something that happens: a click, typing, choosing an option, submitting a form.
```js
button.addEventListener("click", (event) => { ... });
```
`addEventListener(type, function)` means "when this happens, run this function". The function receives an `event` object that describes what happened (`event.target` is the exact element that was clicked). Common types here: `click`, `input` (fires on every keystroke), `change` (fires when a select changes), `submit` (a form was submitted).

### `data-` attributes and `dataset`
In HTML you can attach your own information to an element: `<button data-save="3">`. In JavaScript, `button.dataset.save` gives `"3"`. Dataset values are always **text**, so we convert with `Number("3")`.

### Event delegation and `closest`
Cards are created later by JavaScript, so we cannot attach a listener to buttons that do not exist yet. Instead, we put **one** listener on the whole `document`, then check what was clicked:
```js
const saveBtn = event.target.closest("[data-save]");
```
`closest(selector)` starts at the clicked element and walks upward until it finds one matching the selector (or returns `null`). This also works if the user clicks text inside the button.

### localStorage and JSON
`localStorage` is small storage inside the browser that survives refreshing and closing the tab. It only stores **text**, so we convert:
- `JSON.stringify(value)` turns an array or object into text.
- `JSON.parse(text)` turns that text back into an array or object.
```js
localStorage.setItem("key", JSON.stringify([1, 2]));
JSON.parse(localStorage.getItem("key"));   // [1, 2]
```
It is saved per browser and per website, so a different browser starts empty.

### `try` / `catch`
```js
try { /* risky code */ } catch (error) { /* runs only if it failed */ }
```
`JSON.parse` crashes if the saved text is broken. Wrapping it means the site carries on with a fallback value instead.

### Timers
- `setTimeout(fn, 2000)` runs `fn` once after 2000 milliseconds.
- `setInterval(fn, 30000)` runs `fn` every 30 seconds.
- `clearTimeout(timer)` cancels a timer that has not fired yet.

---

## Part 3. Data and state (Sections 1 to 3)

**File:** `script.js`, Sections 1 to 3.

- `photo(id)` builds a full Unsplash image link from a short photo id, so we do not repeat the long address ten times.
- `cars` is the main array. Every car object has the same properties: `id`, `name`, `brand`, `year`, `type`, `hp`, `torque`, `engine`, `accel` (0 to 60 mph seconds), `price`, `featured`, `img`. Because they are all the same shape, one function can draw any car.
- **State** means "what the user has chosen right now":
  - `garage`: an array of car **ids** the user saved. We store ids, not whole cars, so the data is never duplicated.
  - `compareList`: up to three car ids.
- Section 3 grabs the elements we will use again and again (`searchBox`, `carGrid`, and so on) and stores them in `const` variables.

---

## Part 4. Helper functions (Section 4)

- `findCar(id)` uses `cars.find(...)` to turn an id back into the full car object. Many other functions use it.
- `money(n)` formats `222000` as `$222,000`. `toLocaleString("en-US")` adds the commas.
- `showToast(message)` shows the small pop-up message:
  1. set its text,
  2. add the CSS class `show` (the CSS slides it up),
  3. cancel any older hide-timer with `clearTimeout`,
  4. start a new timer that removes `show` after 2 seconds.

  We store the timer as `showToast.timer`. Functions are objects in JavaScript, so they can hold properties. This avoids a separate global variable.

---

## Part 5. Dream Garage (Section 5)

- `loadGarage()` reads the saved text from localStorage and converts it back to an array. `JSON.parse(...) || []` means "if nothing is saved (`null`), use an empty array". `try/catch` protects against broken data.
- `saveGarage()` writes the current `garage` array to localStorage with `JSON.stringify`.
- `toggleGarage(id)`: "toggle" means flip on or off.
  - If the id is already in `garage` (`includes`), build a new array **without** it using `filter((savedId) => savedId !== id)`.
  - Otherwise `push(id)` to add it.
  - Then show a toast, call `saveGarage()`, and call `renderAll()` to redraw.

**Why `filter` to remove?** Arrays have no simple "remove this value" method. Keeping everything that is *not* the id does the same job.

---

## Part 6. Comparison tool (Sections 6 and 9)

**Choosing cars: `toggleCompare(id)`**
- Already in the list: remove it (same `filter` trick as the garage).
- Not in the list and `compareList.length >= 3`: show a toast and `return` early, so a fourth car is never added.
- Otherwise: `push(id)`.

**Drawing the table: `renderCompare()`**
1. Show or hide the "Clear comparison" button based on whether the list has items.
2. If fewer than 2 cars are chosen, show a helpful message and stop (`return`). A comparison needs at least two.
3. `compareList.map(findCar)` turns the list of ids into a list of car objects. We pass the function `findCar` itself (no brackets), and `map` calls it for each id.
4. Work out the best value in each row:
   ```js
   const bestHp = Math.max(...picked.map((c) => c.hp));
   ```
   `picked.map((c) => c.hp)` makes a list of horsepower numbers, and `...` spreads them into `Math.max`, which wants separate arguments, not an array. For acceleration the best is the **smallest** time, so `Math.min`.
5. The inner function `row(label, getValue, isBest)` builds one table row. It is reused five times, which avoids repeating the table code. `getValue` says what to show; `isBest` (optional) says when to add the `best` CSS class. `isBest && isBest(c)` means "only call it if it was given".
6. The finished table is built as one big template literal and placed in the page with `innerHTML`.

---

## Part 7. Car cards and the Explorer (Sections 7 and 8)

### Drawing cards: `cardHTML(car)` and `renderCards(...)`
- `cardHTML` returns the HTML text for one card. It uses ternaries so buttons change with state: if the car is in the garage, the button reads "Saved" and gets the `on` class (which the CSS colours burgundy).
- Each button carries `data-save="${car.id}"` or `data-compare="${car.id}"`, so the click handler knows which car was chosen.
- `onerror="this.style.opacity=0"` on the image hides a broken image so the burgundy background shows instead.
- `renderCards(list, container, emptyMessage)` is reused for the explorer, featured cars, recommendations and garage. If the list is empty it shows the message; otherwise it loops with `for...of`, adds each card's HTML to one string with `+=`, and sets `innerHTML` **once** (faster than updating the page for every card).

### Filters: `fillFilters()`
```js
[...new Set(cars.map((car) => car.brand))].sort()
```
Read it from the inside out:
1. `cars.map(...)` gives a list of brands with repeats.
2. `new Set(...)` is a collection that keeps each value only once.
3. `[...set]` turns it back into a normal array.
4. `.sort()` puts it in alphabetical order.

Then `map` builds `<option>` tags and `join("")` glues them into one string for the dropdown.

### Search, filter, sort: `getVisibleCars()`
1. `searchBox.value.trim().toLowerCase()` reads the text, removes spaces at the ends, and lowercases it so "FERRARI" matches "Ferrari".
2. `cars.filter(...)` keeps a car only if all three tests pass:
   - text appears inside brand + name + engine (`includes`),
   - brand is "all" or equals the chosen brand,
   - type is "all" or equals the chosen type.
3. `result.sort(...)` orders by the chosen option. For the default we use `localeCompare`, which compares text alphabetically.

Note that `filter` returns a **new** array, so sorting `result` does not change the original `cars` order.

`renderExplorer()` then updates the "X cars found" line (ternary for "car" vs "cars") and draws the cards.

---

## Part 8. Smart features

**File:** `script.js`, the block starting `SMART FEATURES`.

### 8.1 Saved data helpers
- `readJSON(key, fallback)` and `writeJSON(key, value)` wrap the localStorage + JSON steps from Part 2 so we write them once. `readJSON` returns the fallback if nothing is saved.
- Four pieces of saved data: `addedIds` (demo listings already added), `license` (a date text like `"2026-12-01"`), `reminders`, `notes`.
- The `for` loop under them puts previously added demo cars back into `cars` when the page reloads.
- `esc(text)` makes user-typed text safe. It puts the text into a temporary `div` using `textContent` (which treats it as plain text) and reads it back as `innerHTML` (now with `<` turned into `&lt;`). Without it, someone could type HTML or script code into a reminder note and it would run. This is called an **XSS** attack, and escaping prevents it.

### 8.2 Personalized recommendations
- `getTaste()` counts how many saved cars have each type and brand. It builds two objects used as counters:
  ```js
  types[car.type] = (types[car.type] || 0) + 1;
  ```
  If the type has not been seen, `types[car.type]` is `undefined`, so `|| 0` starts the count at 0, then `+ 1`.
- `matchReason(car)` returns a sentence if the car's type or brand is in the garage, or `""` (empty text, which counts as false) if not.
- `renderRecs()` gives each unsaved car a score (type matches count double, brand matches count once), keeps those above 0, sorts highest first, and `slice(0, 3)` keeps the top three. `Object.keys(taste.types)` lists the type names so we can write "you like: Coupe, Electric".

### 8.3 Notification Center
- `addNote(key, kind, text)` adds an alert. First it checks `notes.some((n) => n.key === key)`. The `key` is a unique label like `"car-101"`, so the same event can never alert twice. Then `unshift` puts the new alert at the top, saves it, shows a toast, and (if the user enabled it) uses the browser `Notification` API for a pop-up.
- `renderNotes()` draws the list and counts unread alerts with `notes.filter((n) => !n.read).length` for the nav badge.
- `simulateListing()` finds the first demo car not yet added (`find` with `!addedIds.includes(...)`). If none is left it stops. Otherwise it adds the car to `cars`, saves the id, and if `matchReason` found a match it calls `addNote`. Finally it rebuilds the filter lists (a new brand may exist) while keeping the user's selected values, and redraws.

**Real vs simulated:** a real "new listing" would come from a server. Here the `newListings` array pretends to be that feed, and the button pretends time has passed.

### 8.4 Deadlines and reminders
- `daysUntil(dateText)` makes a date object from `"2026-12-01T00:00:00"`, sets today to midnight (`setHours(0, 0, 0, 0)`) so the time of day does not matter, subtracts them (the result is in milliseconds), divides by `86400000` (milliseconds in one day), and rounds. Negative means the date has passed.
- `describeDays(n)` turns that number into words such as "5 days left", "due today" or "3 days overdue".
- `checkDeadlines()` checks the license (alert at 60 days or less) and every reminder (alert when days left is within that reminder's own `daysBefore`). The alert key includes `-soon` or `-over`, so you get one alert when it is approaching and a different one if it becomes overdue.
- `renderReminders()` shows the license status and the sorted list. `[...reminders]` copies the array first so sorting does not change the original. Dates in `YYYY-MM-DD` form sort correctly as plain text, so `localeCompare` is enough.

### 8.5 Forms
```js
form.addEventListener("submit", (event) => { event.preventDefault(); ... });
```
A form normally reloads the page when submitted. `event.preventDefault()` cancels that so our code can handle it. `Date.now()` (milliseconds since 1970) is used as a unique id for each reminder. `event.target.reset()` clears the form fields afterward. Delete buttons use delegation (Part 2) with `data-del-rem`.

---

## Part 9. Events, drawing everything and starting up (Sections 10 to 12)

- `renderAll()` (Section 10) calls every render function and updates the nav counters. Any change to the data ends with this call, so the page never disagrees with the data.
- Section 11 connects the controls: `input` for the search box, `change` for dropdowns, and one `click` listener on `document` for all Save and Compare buttons. Several `click` listeners on `document` can exist together; each one checks whether it cares about the click.
- The mobile menu button toggles the class `open` on the nav, and clicking a link removes it.
- Section 12 runs once when the page loads: sets the hero picture to `cars[1]` (the Ferrari; array index 1 is the second item), fills filters, draws everything, fills the saved license date into its input, runs `checkDeadlines()` once, then `setInterval(checkDeadlines, 30000)` repeats it while the page is open.

### How the features connect
| User action | State that changes | What redraws |
|---|---|---|
| Save a car | `garage` (saved) | garage grid, card buttons, **recommendations**, nav count |
| Simulate a listing | `cars`, `addedIds`, `notes` | explorer, recommendations, notification list |
| Save a license or reminder date | `license` / `reminders` | reminder list, then `checkDeadlines` may add `notes` |
| Choose cars to compare | `compareList` (not saved) | comparison table, card buttons |

The garage feeds recommendations, and recommendations feed new-listing matches. That chain is the "personalization".

---

## Part 10. Likely teacher questions

**1. Why do you store car ids in `garage` instead of the whole car?**
So the data lives in one place (`cars`). If a car's details change, every list shows the update automatically, and localStorage stays small.

**2. What is the difference between `const` and `let`?**
`const` cannot be re-assigned; `let` can. We use `let` for state that gets replaced, such as `garage`.

**3. What do `map`, `filter` and `find` do?**
`map` changes every item and returns a new array; `filter` keeps the matching items and returns a new array; `find` returns the first matching item.

**4. How does the garage still exist after refreshing?**
`saveGarage` writes the array to localStorage as JSON text. On load, `loadGarage` reads it and `JSON.parse` turns it back into an array.

**5. Why use `JSON.stringify` and `JSON.parse`?**
localStorage only stores text. `stringify` turns data into text, and `parse` turns it back.

**6. What is event delegation and why did you use it?**
One listener on `document` handles clicks for buttons that are created later. It uses `closest` and `data-` attributes to find which car was clicked.

**7. Why does `renderAll()` redraw everything instead of changing one card?**
It is simpler and avoids mismatches. The data is the single source of truth, and the page is rebuilt from it. For a small site this is fast enough. A big site would update only the parts that changed.

**8. What does `event.preventDefault()` do?**
It stops the browser's default action. For a form, that means stopping the page reload so our JavaScript can save the data.

**9. How do you limit comparison to 3 cars?**
`toggleCompare` checks `compareList.length >= 3` and uses `return` to stop before adding a fourth.

**10. How does the recommendation system work?**
It counts the types and brands in the garage, scores unsaved cars against those counts, and shows the top three. New listings run the same `matchReason` check to decide whether to alert.

**11. Are these real notifications?**
No. Alerts are checked on page load and every 30 seconds by `setInterval`, so they only work while the page is open. Real notifications when the site is closed need a backend server plus a service worker and the Push API.

**12. What is `esc()` for?**
It stops user-typed text from being treated as HTML, which would let someone inject code (XSS).

**13. Why does `sort` not change `cars`?**
We sort the array returned by `filter`, which is a copy. In `renderReminders` we copy with `[...reminders]` for the same reason.

**14. What are the limitations?**
Data is stored only in one browser and is not secure or shared between devices. The comparison list is not saved on refresh. The "new listings" are demo data. Car photos are linked from the internet and may fail to load.

**15. How would you improve it?**
Add a backend and database so users can log in and sync their data, use a real car listings API, add real push notifications, and save the comparison list too.
