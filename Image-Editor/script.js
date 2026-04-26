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
const cropBox = document.querySelector("#crop-box");
const cropModeBtn = document.querySelector("#crop-mode-btn");
const applyCropBtn = document.querySelector("#apply-crop-btn");
const canvasWrapper = document.querySelector("#canvas-wrapper");
let originalImage = null;

// Function to build filter sliders
function createFilterElement(key, name, unit, value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const p = document.createElement("p");
    p.textContent = `${name}: `;

    const span = document.createElement("span");
    span.id = `val-${key}`;
    span.textContent = `${value}${unit}`;

    p.appendChild(span);

    const input = document.createElement("input");
    input.type = "range";
    input.id = key;
    input.min = min;
    input.max = max;
    input.value = value;

    input.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        filters[key].value = val;
        span.textContent = `${val}${unit}`;
        removePresetActive();
        applyFilters();
    });

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
    canvasWrapper.style.display = "inline-block"; // Show the wrapper instead of just canvas
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

// --- Crop logic implementation ---

// Toggle Crop Mode UI
cropModeBtn.addEventListener("click", () => {
    if (!originalImage) return;
    const isVisible = cropBox.style.display === "block";
    if (!isVisible) {
        cropBox.style.display = "block";
        applyCropBtn.style.display = "flex";
        cropModeBtn.innerHTML = '<i class="ri-close-line"></i> Cancel';
        // Set initial box size and position
        cropBox.style.width = "200px";
        cropBox.style.height = "200px";
        cropBox.style.left = "0px";
        cropBox.style.top = "0px";
    } else {
        closeCropUI();
    }
});

function closeCropUI() {
    cropBox.style.display = "none";
    applyCropBtn.style.display = "none";
    cropModeBtn.innerHTML = '<i class="ri-crop-line"></i> Crop';
}

// Mouse dragging and resizing for the crop box
let isDragging = false;
cropBox.addEventListener("mousedown", (e) => {
    isDragging = true;
    let startX = e.clientX, startY = e.clientY;
    let startW = cropBox.offsetWidth, startH = cropBox.offsetHeight;
    let startL = cropBox.offsetLeft, startT = cropBox.offsetTop;
    
    // Get parent boundaries (the canvas wrapper)
    const parentW = imageCanvas.clientWidth;
    const parentH = imageCanvas.clientHeight;
    
    let type = e.target.classList.contains('handle') ? e.target.classList[1] : null;

    const onMouseMove = (me) => {
        if (!isDragging) return;
        let dx = me.clientX - startX;
        let dy = me.clientY - startY;

        if (!type) { 
            // --- DRAGGING THE BOX (with boundaries) ---
            let newLeft = startL + dx;
            let newTop = startT + dy;

            // Clamp to horizontal bounds
            if (newLeft < 0) newLeft = 0;
            if (newLeft + startW > parentW) newLeft = parentW - startW;
            
            // Clamp to vertical bounds
            if (newTop < 0) newTop = 0;
            if (newTop + startH > parentH) newTop = parentH - startH;

            cropBox.style.left = newLeft + "px";
            cropBox.style.top = newTop + "px";
        } else { 
            // --- RESIZING (with boundaries) ---
            if (type.includes('e')) {
                let newW = startW + dx;
                if (startL + newW > parentW) newW = parentW - startL;
                cropBox.style.width = Math.max(20, newW) + "px";
            }
            if (type.includes('s')) {
                let newH = startH + dy;
                if (startT + newH > parentH) newH = parentH - startT;
                cropBox.style.height = Math.max(20, newH) + "px";
            }
            if (type.includes('w')) {
                let newW = startW - dx;
                let newLeft = startL + dx;
                if (newLeft < 0) {
                    newW = startW + startL;
                    newLeft = 0;
                }
                if (newW > 20) {
                    cropBox.style.width = newW + "px";
                    cropBox.style.left = newLeft + "px";
                }
            }
            if (type.includes('n')) {
                let newH = startH - dy;
                let newTop = startT + dy;
                if (newTop < 0) {
                    newH = startH + startT;
                    newTop = 0;
                }
                if (newH > 20) {
                    cropBox.style.height = newH + "px";
                    cropBox.style.top = newTop + "px";
                }
            }
        }
    };

    const onMouseUp = () => { 
        isDragging = false; 
        document.removeEventListener("mousemove", onMouseMove); 
        document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Calculate crop coordinates and apply to image
applyCropBtn.addEventListener("click", () => {
    // Determine the scale between CSS display size and actual image pixels
    const scaleX = imageCanvas.width / imageCanvas.clientWidth;
    const scaleY = imageCanvas.height / imageCanvas.clientHeight;
    
    const x = cropBox.offsetLeft * scaleX;
    const y = cropBox.offsetTop * scaleY;
    const w = cropBox.offsetWidth * scaleX;
    const h = cropBox.offsetHeight * scaleY;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w; tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d");
    
    // Render the current canvas content (including filters) into the cropped area
    tempCtx.filter = canvasCtx.filter;
    tempCtx.drawImage(imageCanvas, x, y, w, h, 0, 0, w, h);

    const croppedImg = new Image();
    croppedImg.src = tempCanvas.toDataURL();
    croppedImg.onload = () => {
        originalImage = croppedImg;
        imageCanvas.width = w;
        imageCanvas.height = h;
        // Reset filter values back to default for the new cropped image
        Object.keys(filters).forEach(k => filters[k].value = filters[k].default);
        updateUI();
        applyFilters();
        closeCropUI();
    };
});

// --- End of crop logic ---

// Reset all settings
document.querySelector("#reset-btn").addEventListener("click", () => {
    Object.keys(filters).forEach(key => {
        filters[key].value = filters[key].default;
    });
    updateUI();
    removePresetActive();
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