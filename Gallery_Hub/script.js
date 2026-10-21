
// 1. Theme Toggle
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// 2. Data Initialization
const galleryGrid = document.getElementById('galleryGrid');
const bentoSizes = ['bento-large', 'bento-small', 'bento-wide', 'bento-tall', 'bento-small'];

// 50 Hardcoded High-Quality Images
const hardcodedIds = {
    nature: ['1448375240586-882707db888b', '1505118380757-91f5f5632de0', '1464822759023-fed622ff2c3b', '1495616811223-4d98c6e9c869', '1473580044384-7ba9967e16a0', '1472214103451-9374bd1c798e', '1507525428034-b723cf961d3e', '1494500764479-0c8f2919a3d4', '1518837695005-2083093ee35b', '1465146344425-f00d5f5c8f07'],
    city: ['1477959858617-67f85cf4f1df', '1486406146926-c627a92ad1ab', '1449844908441-8829872d2607', '1494522855954-716499aae3cb', '1480714378408-67cf0d13bc1b', '1519501025264-65ba15a82390', '1470219556762-1771e7f9427d', '1444723121867-f0464522d113', '1445224319076-231a47814a6d', '1480843695279-d2b385e3a34a'],
    animals: ['1543466835-00a7907e9de1', '1514888286974-6c03e2ca1dba', '1549479361-b4ec8b9487de', '1474511320723-9a56873864b5', '1555169062-01246b7e1c18', '1504595403659-9088ce801e29', '1456926631375-92c8ce872def', '1583337130417-3346a1be7dee', '1517849845537-4d257902454a', '1526336024174-e58f5cdd8e13'],
    tech: ['1498050108023-c5249f4df085', '1499951360447-b19be8fe80f5', '1518770660439-4636190af475', '1525547719571-a2d4ac8945e2', '1517336714731-489689fd1ca8', '1550751827-4bd374c3f58b', '1504639725590-34d0984388bd', '1531297172869-8857a2c2b0e6', '1484417184920-56f8f117c244', '1519389953810-195581561073'],
    food: ['1513104890138-7c749659a591', '1497935586351-b67a49e012bf', '1484723091781-41d3fcda88dc', '1482049360875-e87f5b7af191', '1476224203463-b856b3e9447e', '1499028085609-8e49e91f6305', '1478145046317-39f10e56b5e9', '1460306855393-0410ed879e9a', '1504674900247-0877df9cc836', '1473093295043-cdd812d0e601']
};

let allImages = [];

Object.keys(hardcodedIds).forEach(cat => {
    hardcodedIds[cat].forEach(id => {
        allImages.push({
            url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`,
            highResUrl: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=90`,
            category: cat,
            title: cat + " aesthetic",
            author: "Curated"
        });
    });
});

const apiKey = 'Q-UgRuXyerKnVIILnSma1j2Y1Z5I6KaQtbm197W0KR4';
const apiUrl = `https://api.unsplash.com/search/photos?query=nature city animals tech food&per_page=50&client_id=${apiKey}`;

async function initializeGallery() {
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const data = await res.json();
            const fakeCats = ['nature', 'city', 'animals', 'tech', 'food'];

            data.results.forEach((img, i) => {
                allImages.push({
                    url: img.urls.regular,
                    highResUrl: img.urls.full,
                    category: fakeCats[i % fakeCats.length],
                    title: img.alt_description || 'Stunning Image',
                    author: img.user.name
                });
            });
        }
    } catch (err) {
        console.log("API failed, falling back to 50 hardcoded images only.", err);
    }

    allImages.sort(() => Math.random() - 0.5);
    renderGrid();
}

// 3. Render the Grid
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function renderGrid() {
    galleryGrid.innerHTML = '';

    allImages.forEach((img, index) => {
        const card = document.createElement('div');
        const size = bentoSizes[index % bentoSizes.length];

        card.className = `bento-card ${size}`;
        card.setAttribute('data-category', img.category);
        card.setAttribute('data-title', img.title);
        card.setAttribute('data-author', img.author);

        // Added onerror handling directly in the image tag
        card.innerHTML = `
                    <img src="${img.url}" alt="${img.title}" loading="lazy" onerror="this.closest('.bento-card').remove()">
                    <div class="card-label">${img.author}</div>
                `;

        card.addEventListener('click', () => {
            lightboxImg.src = img.highResUrl;
            lightbox.classList.add('active');
        });

        galleryGrid.appendChild(card);
    });
    setupFiltersAndSearch();
}

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    setTimeout(() => lightboxImg.src = "", 300);
});

// 4. Search and Filter
function setupFiltersAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allCards = document.querySelectorAll('.bento-card');
    const searchInput = document.getElementById('searchInput');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            allCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        allCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const author = card.getAttribute('data-author').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();

            if (title.includes(searchTerm) || author.includes(searchTerm) || category.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
}

// Start
initializeGallery();
