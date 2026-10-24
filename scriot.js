
const demoProperties = [
  {
    id: 1,
    title: "2BHK Family House",
    type: "Ghar",
    location: "Sarkanda, Bilaspur",
    rent: 8500,
    deposit: 15000,
    size: "2 Bedrooms",
    description: "Family ke liye sample house listing.",
    owner: "Demo Owner",
    phone: "",
    image: ""
  },
  {
    id: 2,
    title: "Single Room",
    type: "Room",
    location: "Koni, Bilaspur",
    rent: 3500,
    deposit: 5000,
    size: "Single Room",
    description: "Student ke liye sample room listing.",
    owner: "Demo Owner",
    phone: "",
    image: ""
  },
  {
    id: 3,
    title: "Residential Plot",
    type: "Plot",
    location: "Mopka, Bilaspur",
    rent: 6000,
    deposit: 10000,
    size: "1200 sq ft",
    description: "Sample plot listing.",
    owner: "Demo Owner",
    phone: "",
    image: ""
  }
];

const STORAGE_KEY = "apnaRentProperties";
let properties = [];

try {
  properties = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
} catch {
  properties = [];
}

let selectedType = "";

const grid = document.getElementById("propertyGrid");

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getAllProperties() {
  return [...properties, ...demoProperties];
}

function renderProperties() {
  const type = document.getElementById("searchType").value;
  const location = document.getElementById("searchLocation")
    .value.trim().toLowerCase();
  const budget = Number(
    document.getElementById("searchBudget").value
  );

  const filtered = getAllProperties().filter(property => {
    const typeMatch = !type || property.type === type;
    const locationMatch =
      !location ||
      property.location.toLowerCase().includes(location) ||
      property.title.toLowerCase().includes(location);
    const budgetMatch = !budget || Number(property.rent) <= budget;

    return typeMatch && locationMatch && budgetMatch;
  });

  document.getElementById("resultCount").textContent =
    `${filtered.length} properties mili`;

  grid.innerHTML = filtered.map(property => {
    const image = property.image &&
      /^https?:\/\//i.test(property.image)
      ? `<img src="${safeText(property.image)}"
          alt="${safeText(property.title)}"
          onerror="this.style.display='none'">`
      : `<div class="no-image">🏠</div>`;

    const contact = property.phone
      ? `<a href="https://wa.me/${property.phone.replace(/\D/g, "")}"
          target="_blank" rel="noopener noreferrer">
          <button type="button">WhatsApp Owner</button>
        </a>`
      : `<button type="button" class="demo-contact">
          Demo Listing
        </button>`;

    return `
      <article class="property-card">
        ${image}
        <div class="card-content">
          <h3>${safeText(property.title)}</h3>
          <p class="location">
            📍 ${safeText(property.location)}
          </p>
          <p><b>Type:</b> ${safeText(property.type)}</p>
          <p><b>Size:</b> ${safeText(property.size || "Not specified")}</p>
          <p>${safeText(property.description || "")}</p>
          <p class="rent">₹${formatMoney(property.rent)} / month</p>
          <p>Deposit: ₹${formatMoney(property.deposit)}</p>
          ${contact}
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".demo-contact").forEach(button => {
    button.addEventListener("click", () => {
      alert("Yeh sample listing hai. Owner ka real contact abhi available nahi hai.");
    });
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>Koi property nahi mili. Filters badal kar dekhein.</p>";
  }

  document.querySelectorAll(".categories button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.type === type
    );
  });
}

document.getElementById("searchBtn").addEventListener("click", renderProperties);

document.querySelectorAll(".categories button").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("searchType").value = button.dataset.type;
    renderProperties();
  });
});

document.getElementById("openPost").addEventListener("click", () => {
  document.getElementById("title").focus();
  document.getElementById("postForm").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

document.getElementById("postForm").addEventListener("submit", event => {
  event.preventDefault();

  const phone = document.getElementById("phone").value.trim();

  if (!/^[0-9+\-\s]{10,16}$/.test(phone)) {
    alert("Kripya valid contact number enter karein.");
    return;
  }

  const property = {
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    type: document.getElementById("type").value,
    location: document.getElementById("location").value.trim(),
    rent: Number(document.getElementById("rent").value),
    deposit: Number(document.getElementById("deposit").value || 0),
    size: document.getElementById("size").value.trim(),
    description: document.getElementById("description").value.trim(),
    owner: document.getElementById("owner").value.trim(),
    phone,
    image: document.getElementById("image").value.trim()
  };

  properties.unshift(property);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch {
    properties.shift();
    alert("Listing save nahi hui. Browser storage check karein.");
    return;
  }

  event.target.reset();
  document.getElementById("searchType").value = "";
  document.getElementById("searchLocation").value = "";
  document.getElementById("searchBudget").value = "";

  renderProperties();
  alert("Property listing is browser mein save ho gayi!");
  document.getElementById("propertyGrid").scrollIntoView({
    behavior: "smooth"
  });
});

renderProperties();
