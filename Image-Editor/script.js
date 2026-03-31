// Filter configuration with default values
const filters = {
    brightness: { value: 100, default: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, default: 100, min: 0, max: 200, unit: "%" },
    exposure: { value: 100, default: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, default: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, default: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, default: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, default: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, default: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, default: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, default: 0, min: 0, max: 100, unit: "%" },
}

// Select HTML elements
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const filtersContainer = document.querySelector(".filters");
let originalImage = null;

// Function to build filter sliders
function createFilterElement(key, name, unit, value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    // Create <p>
    const p = document.createElement("p");
    p.textContent = `${name}: `;

    // Create <span>
    const span = document.createElement("span");
    span.id = `val-${key}`;
    span.textContent = `${value}${unit}`;

    p.appendChild(span);

    // Create <input type="range">
    const input = document.createElement("input");
    input.type = "range";
    input.id = key;
    input.min = min;
    input.max = max;
    input.value = value;

    // Event listener
    input.addEventListener("input", (e) => {
        const val = Number(e.target.value); // ensure number
        filters[key].value = val;

        span.textContent = `${val}${unit}`; // no DOM lookup needed

        removePresetActive();
        applyFilters();
    });

    // Append everything
    div.appendChild(p);
    div.appendChild(input);

    return div;
}

// Initialize UI sliders
Object.keys(filters).forEach(key => {
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    const filterElement = createFilterElement(key, name, filters[key].unit, filters[key].value, filters[key].min, filters[key].max);
    filtersContainer.appendChild(filterElement);
});

// Handle image upload
imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    document.querySelector(".placeholder").style.display = "none";
    imageCanvas.style.display = "block";
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        originalImage = img;
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        applyFilters();
    }
});

// Apply filters to canvas
function applyFilters() {
    if (!originalImage) return;
    const f = filters;
    canvasCtx.filter = `
        brightness(${f.brightness.value}%)
        contrast(${f.contrast.value}%)
        saturate(${f.saturation.value}%)
        hue-rotate(${f.hueRotation.value}deg)
        blur(${f.blur.value}px)
        grayscale(${f.grayscale.value}%)
        sepia(${f.sepia.value}%)
        opacity(${f.opacity.value}%)
        invert(${f.invert.value}%)
    `;
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    canvasCtx.drawImage(originalImage, 0, 0);
}

// Reset all settings
document.querySelector("#reset-btn").addEventListener("click", () => {
    Object.keys(filters).forEach(key => {
        filters[key].value = filters[key].default;
    });
    updateUI();
    removePresetActive(); // Clear preset button highlights
    applyFilters();
});

// Download edited image
document.querySelector("#download-btn").addEventListener("click", () => {
    if (!originalImage) return;
    const link = document.createElement("a");
    link.download = "edited-photo.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});

// Preset Definitions
const presets = {
    vivid: { brightness: 110, contrast: 120, saturation: 150 },
    vintage: { sepia: 50, contrast: 90, brightness: 110, saturation: 80 },
    cool: { hueRotation: 180, saturation: 120, brightness: 105 },
    warm: { sepia: 30, saturation: 130, contrast: 110 },
    bw: { grayscale: 100, contrast: 120 },
    original: {}
};

// Handle Preset Clicks
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const presetName = btn.getAttribute('data-preset');
        const settings = presets[presetName];
        Object.keys(filters).forEach(key => {
            filters[key].value = filters[key].default;
        });
        Object.keys(settings).forEach(key => {
            if (filters[key]) filters[key].value = settings[key];
        });
        updateUI();
        applyFilters();
        removePresetActive();
        btn.classList.add('active');
    });
});

// Sync Sliders with logic
function updateUI() {
    Object.keys(filters).forEach(key => {
        const input = document.getElementById(key);
        const label = document.getElementById(`val-${key}`);
        if (input) input.value = filters[key].value;
        if (label) label.innerText = `${filters[key].value}${filters[key].unit}`;
    });
}

// Helper to remove active class from all buttons
function removePresetActive() {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}