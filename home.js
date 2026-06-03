document.addEventListener("DOMContentLoaded", () => {
    // --- 0. Protected Route Logic ---
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.replace('login.html');
        return;
    }

    
    // --- 1. Theme Toggling (Dark/Light Mode) ---
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeBtn.title = 'Switch to light mode';
        } else {
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeBtn.title = 'Switch to dark mode';
        }
    }

    // --- 1.5 Logout Logic ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear user data on logout
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // --- 1.6 Load User Profile Data ---
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
        try {
            const user = JSON.parse(userDataStr);
            
            // Update Profile Header
            const nameEl = document.getElementById('display-profile-name');
            const emailEl = document.getElementById('display-profile-email');
            const phoneEl = document.getElementById('display-profile-phone');
            
            if (nameEl) nameEl.textContent = user.username || user.name || 'Traveler';
            if (emailEl) emailEl.textContent = user.email || user.mail || 'No email provided';
            if (phoneEl) phoneEl.textContent = user.phoneNumber || user.phone || 'No phone provided';

            // Update Settings Form
            const settingsName = document.getElementById('settings-name-input');
            const settingsEmail = document.getElementById('settings-email-input');
            const settingsPhone = document.getElementById('settings-phone-input');

            if (settingsName) settingsName.value = user.username || '';
            if (settingsEmail) settingsEmail.value = user.email || '';
            if (settingsPhone) settingsPhone.value = user.phoneNumber || '';

        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }

    // --- 2. SPA View Switching ---
    const navLinks = document.querySelectorAll('.nav-links a[data-view]');
    const logoLink = document.querySelector('.logo[data-view]');
    const viewPanels = document.querySelectorAll('.view-panel');

    let aboutRevealInit = false;

    function switchView(viewId) {
        // Update Nav Links Active State
        navLinks.forEach(link => {
            if(link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Panels
        viewPanels.forEach(panel => {
            if(panel.id === `view-${viewId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        if (viewId === 'about') {
            initAboutView();
        }
        
        // Close any open modals/panels when switching views
        closeAllModals();
    }

    window.switchView = switchView;

    function initAboutView() {
        const aboutPanel = document.getElementById('view-about');
        if (!aboutPanel) return;

        if (!aboutRevealInit) {
            aboutRevealInit = true;

            aboutPanel.querySelectorAll('.ab-reveal').forEach((el) => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.08, root: aboutPanel });
                observer.observe(el);
            });

            aboutPanel.querySelectorAll('.ab-faq-q').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const item = btn.closest('.ab-faq-item');
                    const isOpen = item.classList.contains('open');
                    aboutPanel.querySelectorAll('.ab-faq-item').forEach((i) => {
                        i.classList.remove('open');
                        i.querySelector('.ab-faq-q').setAttribute('aria-expanded', 'false');
                    });
                    if (!isOpen) {
                        item.classList.add('open');
                        btn.setAttribute('aria-expanded', 'true');
                    }
                });
            });

            const contactForm = document.getElementById('ab-contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Thank you! Your message has been sent. We will get back to you soon.');
                    contactForm.reset();
                });
            }
        }
    }

    document.querySelectorAll('[data-switch-view]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(el.getAttribute('data-switch-view'));
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.getAttribute('data-view'));
        });
    });

    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home');
    });

    // --- 3. Modal & Side Panel Logic ---
    const modalOverlay = document.getElementById('dynamic-modal');
    const modalContentContainer = document.getElementById('modal-content-container');
    const sidePanelOverlay = document.getElementById('dynamic-sidepanel');
    const sidePanelContentContainer = document.getElementById('sidepanel-content-container');
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close on clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeAllModals();
    });
    sidePanelOverlay.addEventListener('click', (e) => {
        if (e.target === sidePanelOverlay) closeAllModals();
    });

    function closeAllModals() {
        modalOverlay.classList.remove('active');
        sidePanelOverlay.classList.remove('active');
    }

    function openSidePanel(htmlContent) {
        sidePanelContentContainer.innerHTML = htmlContent;
        sidePanelOverlay.classList.add('active');
    }

    function openModal(htmlContent) {
        modalContentContainer.innerHTML = htmlContent;
        modalOverlay.classList.add('active');
    }

    // --- 4. Dynamic Data Injectors ---

    // Country Cards Click (Opens Side Panel with specific tourist data)
    const countryData = {
        "India": { places: ["Taj Mahal, Agra", "Jaipur Pink City", "Kerala Backwaters", "Goa Beaches", "Varanasi Ghats", "Hampi Ruins", "Ladakh Mountains", "Mysore Palace"], time: "October – March (Winter)", cost: "₹4,150 – ₹12,450" },
        "Dubai": { places: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari", "Dubai Marina", "Miracle Garden", "Gold Souk", "Atlantis Waterpark"], time: "November – March (Cool)", cost: "₹16,600 – ₹41,500" },
        "Singapore": { places: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown", "Clarke Quay", "Merlion Park", "Singapore Zoo"], time: "February – April (Dry)", cost: "₹12,450 – ₹29,050" },
        "Maldives": { places: ["Male Atoll", "Banana Reef", "Hulhumale Beach", "Veligandu Island", "Biyadhoo Island", "Sun Island", "Maafushi Island", "Artificial Beach"], time: "November – April (Dry)", cost: "₹20,750 – ₹49,800" },
        "Thailand": { places: ["Grand Palace, Bangkok", "Phi Phi Islands", "Chiang Mai Temples", "Pattaya Beach", "Ayutthaya Ruins", "Floating Markets", "Railay Beach", "White Temple"], time: "November – February (Cool)", cost: "₹3,320 – ₹9,960" },
        "Japan": { places: ["Mount Fuji", "Tokyo Tower", "Fushimi Inari Shrine", "Osaka Castle", "Hiroshima Peace Park", "Bamboo Grove, Kyoto", "Shibuya Crossing", "Nara Deer Park"], time: "March – May (Cherry Blossom)", cost: "₹8,300 – ₹24,900" },
        "South Korea": { places: ["Gyeongbokgung Palace", "N Seoul Tower", "Jeju Island", "Bukchon Hanok Village", "DMZ Tour", "Lotte World", "Nami Island", "Haedong Yonggungsa Temple"], time: "April – June & Sept – Nov", cost: "₹6,640 – ₹16,600" },
        "Switzerland": { places: ["Matterhorn", "Lake Lucerne", "Jungfraujoch", "Interlaken", "Zurich Old Town", "Rhine Falls", "Grindelwald", "Chapel Bridge"], time: "June – September (Summer)", cost: "₹16,600 – ₹41,500" },
        "France": { places: ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel", "French Riviera", "Palace of Versailles", "Château de Chambord", "Provence Lavender Fields", "Notre-Dame Cathedral"], time: "April – June & Sept – Nov", cost: "₹12,450 – ₹33,200" },
        "Italy": { places: ["Colosseum, Rome", "Venice Canals", "Leaning Tower of Pisa", "Amalfi Coast", "Florence Cathedral", "Cinque Terre", "Pompeii Ruins", "Trevi Fountain"], time: "April – June & Sept – Oct", cost: "₹9,960 – ₹29,050" },
        "Australia": { places: ["Sydney Opera House", "Great Barrier Reef", "Uluru (Ayers Rock)", "Bondi Beach", "Blue Mountains", "Great Ocean Road", "Kangaroo Island", "Daintree Rainforest"], time: "September – November (Spring)", cost: "₹12,450 – ₹33,200" },
        "Canada": { places: ["Niagara Falls", "Banff National Park", "CN Tower, Toronto", "Lake Louise", "Vancouver Stanley Park", "Old Montreal", "Whistler Mountains", "Parliament Hill, Ottawa"], time: "June – September (Summer)", cost: "₹9,960 – ₹29,050" },
        "USA": { places: ["Statue of Liberty", "Grand Canyon", "Times Square, NYC", "Golden Gate Bridge", "Yellowstone Park", "Walt Disney World", "Las Vegas Strip", "Hollywood Walk of Fame"], time: "April – June & Sept – Nov", cost: "₹12,450 – ₹33,200" },
        "UK": { places: ["Big Ben & Parliament", "Buckingham Palace", "Tower of London", "Stonehenge", "Edinburgh Castle", "Lake District", "Oxford University", "The Cotswolds"], time: "May – September (Summer)", cost: "₹12,450 – ₹33,200" },
        "Germany": { places: ["Brandenburg Gate", "Neuschwanstein Castle", "Berlin Wall Memorial", "Cologne Cathedral", "Black Forest", "Munich Marienplatz", "Rhine Valley", "Hamburg Harbour"], time: "May – October", cost: "₹9,960 – ₹24,900" },
        "Spain": { places: ["La Sagrada Familia", "Alhambra Palace", "Park Güell", "Plaza Mayor, Madrid", "Seville Cathedral", "Ibiza Beaches", "Camino de Santiago", "Tenerife Island"], time: "April – June & Sept – Nov", cost: "₹8,300 – ₹23,240" },
        "Greece": { places: ["Santorini Sunsets", "Acropolis of Athens", "Mykonos Beaches", "Meteora Monasteries", "Crete Island", "Delphi Ruins", "Corfu Old Town", "Navagio Beach, Zakynthos"], time: "April – October", cost: "₹8,300 – ₹20,750" },
        "New Zealand": { places: ["Milford Sound", "Hobbiton Movie Set", "Tongariro Crossing", "Queenstown", "Abel Tasman Park", "Franz Josef Glacier", "Rotorua Geysers", "Waitomo Glowworm Caves"], time: "December – February (Summer)", cost: "₹12,450 – ₹29,050" },
        "Indonesia": { places: ["Bali Rice Terraces", "Borobudur Temple", "Komodo Island", "Raja Ampat", "Mount Bromo", "Ubud Monkey Forest", "Gili Islands", "Prambanan Temple"], time: "April – October (Dry)", cost: "₹3,320 – ₹9,960" },
        "Turkey": { places: ["Hagia Sophia", "Cappadocia Hot Air Balloons", "Blue Mosque", "Pamukkale Terraces", "Ephesus Ruins", "Grand Bazaar", "Bosphorus Cruise", "Troy Ancient City"], time: "April – May & Sept – Nov", cost: "₹4,980 – ₹14,940" },
        "Egypt": { places: ["Pyramids of Giza", "Sphinx", "Valley of the Kings", "Luxor Temple", "Abu Simbel", "Egyptian Museum", "Nile River Cruise", "Red Sea Diving"], time: "October – April (Cool)", cost: "₹4,150 – ₹12,450" },
        "Brazil": { places: ["Christ the Redeemer", "Iguazu Falls", "Copacabana Beach", "Amazon Rainforest", "Sugarloaf Mountain", "Fernando de Noronha", "Salvador Pelourinho", "Lençóis Maranhenses"], time: "September – October", cost: "₹6,640 – ₹16,600" },
        "Vietnam": { places: ["Ha Long Bay", "Hoi An Ancient Town", "Phong Nha Caves", "Cu Chi Tunnels", "Sapa Rice Terraces", "Mekong Delta", "Imperial City Hue", "Golden Bridge, Da Nang"], time: "February – April & Aug – Oct", cost: "₹2,490 – ₹8,300" },
        "Mexico": { places: ["Chichen Itza", "Cancun Beaches", "Tulum Ruins", "Teotihuacan Pyramids", "Cenotes of Yucatan", "Mexico City Zocalo", "Oaxaca Valley", "Copper Canyon"], time: "December – April (Dry)", cost: "₹4,150 – ₹12,450" },
        "Morocco": { places: ["Marrakech Medina", "Sahara Desert Camp", "Chefchaouen Blue City", "Hassan II Mosque", "Fez Tanneries", "Atlas Mountains", "Essaouira Coast", "Ait Benhaddou Kasbah"], time: "March – May & Sept – Nov", cost: "₹3,320 – ₹9,960" },
        "Norway": { places: ["Northern Lights, Tromsø", "Geirangerfjord", "Bergen Bryggen", "Lofoten Islands", "Pulpit Rock", "Oslo Opera House", "Trolltunga", "Flåm Railway"], time: "June – August (Summer) & Dec – Feb (Aurora)", cost: "₹16,600 – ₹41,500" },
        "Portugal": { places: ["Belém Tower, Lisbon", "Algarve Caves", "Sintra Pena Palace", "Porto Wine Cellars", "Jerónimos Monastery", "Azores Islands", "Madeira Island", "Douro Valley"], time: "March – May & Sept – Oct", cost: "₹6,640 – ₹16,600" },
        "Sri Lanka": { places: ["Sigiriya Rock Fortress", "Temple of the Tooth", "Ella Train Ride", "Yala National Park", "Galle Fort", "Nuwara Eliya Tea Plantations", "Mirissa Whale Watching", "Dambulla Cave Temple"], time: "December – March (West) & April – September (East)", cost: "₹3,320 – ₹8,300" },
        "Malaysia": { places: ["Petronas Twin Towers", "Langkawi Island", "Batu Caves", "George Town, Penang", "Cameron Highlands", "Sipadan Island Diving", "Kinabalu National Park", "Malacca Historic City"], time: "March – October", cost: "₹3,320 – ₹9,960" },
        "Peru": { places: ["Machu Picchu", "Sacred Valley", "Rainbow Mountain", "Lake Titicaca", "Cusco Historic Centre", "Nazca Lines", "Colca Canyon", "Amazon Jungle, Iquitos"], time: "May – September (Dry)", cost: "₹4,980 – ₹14,940" }
    };

    const heroBg = document.querySelector('.hero-bg');
    const defaultBgSrc = heroBg.src;
    
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        // Change background on hover
        card.addEventListener('mouseenter', () => {
            heroBg.src = card.querySelector('img').src;
        });
        card.addEventListener('mouseleave', () => {
            heroBg.src = defaultBgSrc;
        });

        card.addEventListener('click', () => {
            const country = card.getAttribute('data-country');
            const imgSrc = card.querySelector('img').src;
            const data = countryData[country] || { places: ["Famous Landmarks", "Historic Sites", "Natural Wonders", "Local Markets"], time: "Year-round", cost: "₹8,300 – ₹24,900" };

            let placesHtml = data.places.map(p => `<span class="tag">${p}</span>`).join('');
            
            const html = `
                <img src="${imgSrc}" class="modal-header-img" style="height:200px;" alt="${country}">
                <div class="modal-body">
                    <h2 style="font-size: 2rem; color: var(--clr-primary);">${country}</h2>
                    <p style="color: var(--clr-text-muted);">Explore the beauty, culture, and luxury of ${country}.</p>
                    
                    <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-map-location-dot"></i> Famous Tourist Places</h4>
                    <div class="tags">${placesHtml}</div>

                    <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-cloud-sun"></i> Best Time to Visit</h4>
                    <p>${data.time}</p>

                    <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-wallet"></i> Daily Budget</h4>
                    <p>Average: <strong>${data.cost}</strong> per day (excluding flights)</p>

                    <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;" onclick="document.querySelector('[data-view=\\'flights\\']').click();">Search Flights to ${country}</button>
                </div>
            `;
            openSidePanel(html);
        });
    });

    // Hotel Cards Click (Opens Side Panel)
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h3').innerText;
            const imgSrc = card.querySelector('img').src;
            const price = card.querySelector('.card-price').innerText;
            const subtitleHtml = card.querySelector('.card-subtitle').innerHTML;
            
            // Randomly select a discount and feedback for demonstration
            const discounts = ["10% off with promo code LUXE10", "Free breakfast included", "15% Early Bird Discount", "Free Airport Transfer", "Stay 3 Nights, Pay 2"];
            const discount = discounts[Math.floor(Math.random() * discounts.length)];
            
            const feedbacks = [
                "\"Exceptional service and beautiful views!\" - 9.5/10",
                "\"A truly luxurious experience.\" - 9.2/10",
                "\"The staff went above and beyond.\" - 9.8/10",
                "\"Perfect location for exploring the city.\" - 8.9/10",
                "\"Best spa and wellness facilities.\" - 9.7/10"
            ];
            const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

            const html = `
                <img src="${imgSrc}" class="modal-header-img" style="height:250px;" alt="${name}">
                <div class="modal-body">
                    <h2 style="font-size: 1.8rem;">${name}</h2>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                        <span style="color: var(--clr-text-muted); font-weight: bold;">${subtitleHtml}</span>
                        <span style="font-size: 1.3rem; font-weight: bold; color: var(--clr-primary);">${price}</span>
                    </div>
                    
                    <div style="background: rgba(230, 57, 70, 0.1); border-left: 4px solid var(--clr-accent); padding: 0.8rem; margin-bottom: 1.5rem; border-radius: 4px;">
                        <span style="color: var(--clr-accent); font-weight: bold;"><i class="fa-solid fa-tag"></i> Special Offer:</span> ${discount}
                    </div>
                    
                    <p>Experience unparalleled luxury and comfort at ${name}. Featuring world-class dining, relaxing spas, and breathtaking views.</p>
                    
                    <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-comments"></i> Guest Feedback</h4>
                    <p style="font-style: italic; color: var(--clr-text-muted);">${feedback}</p>

                    <h4 style="margin-top: 1.5rem;"><i class="fa-solid fa-bell-concierge"></i> Facilities</h4>
                    <div class="tags">
                        <span class="tag"><i class="fa-solid fa-wifi"></i> Free WiFi</span>
                        <span class="tag"><i class="fa-solid fa-person-swimming"></i> Pool</span>
                        <span class="tag"><i class="fa-solid fa-spa"></i> Spa</span>
                        <span class="tag"><i class="fa-solid fa-utensils"></i> Restaurant</span>
                        <span class="tag"><i class="fa-solid fa-dumbbell"></i> Gym</span>
                        <span class="tag"><i class="fa-solid fa-martini-glass"></i> Bar</span>
                        <span class="tag"><i class="fa-solid fa-car"></i> Valet Parking</span>
                    </div>

                    <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;" onclick="openPaymentModal('${name.replace(/'/g, "\\'")}', '${price}')">Proceed to Booking</button>
                </div>
            `;
            openSidePanel(html);
        });
    });

    // Package Cards Click (Opens Modal)
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h3').innerText;
            const imgSrc = card.querySelector('img').src;
            const price = card.querySelector('.card-price') ? card.querySelector('.card-price').innerText : 'From ₹1,65,917';
            
            const html = `
                <img src="${imgSrc}" class="modal-header-img" alt="${name}">
                <div class="modal-body">
                    <h2>${name}</h2>
                    <p style="color: var(--clr-text-muted); margin-bottom: 2rem;">A fully curated experience. Flights, luxury stays, and guided tours included.</p>
                    
                    <h3>Full Itinerary</h3>
                    <div style="margin-top: 1.5rem;">
                        <div class="itinerary-item">
                            <h4>Day 1-2: Arrival & Welcome</h4>
                            <p>Airport transfer, welcome dinner, and luxury hotel check-in.</p>
                        </div>
                        <div class="itinerary-item">
                            <h4>Day 3-5: Guided Exploration</h4>
                            <p>VIP access to major tourist attractions with an expert local guide.</p>
                        </div>
                        <div class="itinerary-item">
                            <h4>Day 6: Leisure & Spa</h4>
                            <p>A full day dedicated to relaxation, shopping, or optional activities.</p>
                        </div>
                        <div class="itinerary-item" style="border-left: none;">
                            <h4>Day 7: Departure</h4>
                            <p>Breakfast and private transfer to the airport.</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="openPaymentModal('${name.replace(/'/g, "\\'")}', '${price}')">Book Package</button>
                        <button class="btn" style="border: 1px solid var(--clr-glass-border); flex: 1; color: var(--clr-text);" onclick="downloadBrochure('${name.replace(/'/g, "\\'")}', '${price}')"><i class="fa-solid fa-download"></i> Download Brochure</button>
                    </div>
                </div>
            `;
            openModal(html);
        });
    });

    // Function to handle brochure download
    window.downloadBrochure = function(packageName, price) {
        const itinerary = `========================================
       JOURNEYNEST TRAVEL BROCHURE
========================================
Package: ${packageName}
Price: ${price}

HIGHLIGHTS:
- A fully curated premium experience.
- Flights, luxury stays, and guided tours included.

ITINERARY:
Day 1-2: Arrival & Welcome
Airport transfer, welcome dinner, and luxury hotel check-in.

Day 3-5: Guided Exploration
VIP access to major tourist attractions with an expert local guide.

Day 6: Leisure & Spa
A full day dedicated to relaxation, shopping, or optional activities.

Day 7: Departure
Breakfast and private transfer to the airport.

========================================
Book now at JourneyNest!
========================================`;

        const blob = new Blob([itinerary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${packageName.replace(/\s+/g, '_')}_Brochure.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Flight Search Forms (Opens Modal with results)
    const flightForms = [document.getElementById('home-flight-search'), document.getElementById('detailed-flight-search')];
    flightForms.forEach(form => {
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const html = `
                    <div class="modal-body">
                        <h2 style="margin-bottom: 0.5rem;">Available Flights</h2>
                        <p style="color: var(--clr-text-muted); margin-bottom: 2rem;">Found 6 premium options for your route.</p>
                        
                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">Emirates</div>
                                <div class="flight-time">10:30 AM - 04:15 PM</div>
                                <div class="flight-duration">Non-stop • 5h 45m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹70,550</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('Emirates Flight', '₹70,550')">Select</button>
                            </div>
                        </div>

                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">Qatar Airways</div>
                                <div class="flight-time">02:15 PM - 09:30 PM</div>
                                <div class="flight-duration">1 Stop • 7h 15m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹59,760</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('Qatar Airways Flight', '₹59,760')">Select</button>
                            </div>
                        </div>

                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">Singapore Airlines</div>
                                <div class="flight-time">11:00 PM - 05:45 AM</div>
                                <div class="flight-duration">Non-stop • 6h 45m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹75,530</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('Singapore Airlines Flight', '₹75,530')">Select</button>
                            </div>
                        </div>

                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">Air India</div>
                                <div class="flight-time">06:00 AM - 10:30 AM</div>
                                <div class="flight-duration">Non-stop • 4h 30m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹45,200</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('Air India Flight', '₹45,200')">Select</button>
                            </div>
                        </div>

                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">British Airways</div>
                                <div class="flight-time">08:45 AM - 04:20 PM</div>
                                <div class="flight-duration">1 Stop • 7h 35m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹82,100</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('British Airways Flight', '₹82,100')">Select</button>
                            </div>
                        </div>

                        <div class="flight-result">
                            <div>
                                <div class="flight-airline">Lufthansa</div>
                                <div class="flight-time">01:30 PM - 10:45 PM</div>
                                <div class="flight-duration">1 Stop • 9h 15m</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.4rem; font-weight: bold; color: var(--clr-primary); margin-bottom: 0.5rem;">₹68,900</div>
                                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="openPaymentModal('Lufthansa Flight', '₹68,900')">Select</button>
                            </div>
                        </div>
                    </div>
                `;
                openModal(html);
            });
        }
    });

    setupBookingInteractions();

    function setupBookingInteractions() {
        const bookingCards = document.querySelectorAll('.booking-card');
        bookingCards.forEach(card => {
            const title = card.querySelector('.booking-header h4').innerText;
            const status = card.querySelector('.booking-status').innerText;
            const infoItems = Array.from(card.querySelectorAll('.booking-info-grid div')).map(div => div.innerText);
            const actionButtons = card.querySelectorAll('.booking-actions button');

            const bookingData = {
                title,
                status,
                flight: infoItems[0] || '',
                hotel: infoItems[1] || '',
                dates: infoItems[2] || ''
            };

            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                showBookingDetails(bookingData);
            });

            actionButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = button.innerText.trim().toLowerCase();
                    if (action.includes('view')) {
                        showBookingDetails(bookingData);
                    } else if (action.includes('manage')) {
                        showBookingManagement(bookingData);
                    } else if (action.includes('book again') || action.includes('rebook')) {
                        showBookingRepeat(bookingData);
                    } else if (action.includes('leave a review')) {
                        showBookingReview(bookingData);
                    }
                });
            });
        });
    }

    function showBookingDetails(data) {
        const html = `
            <div class="modal-body">
                <h2>${data.title}</h2>
                <p style="color: var(--clr-text-muted); margin-bottom: 1.2rem;">Status: <strong>${data.status}</strong></p>
                <div style="display:grid; gap:0.8rem; margin-bottom:1.5rem;">
                    <div><strong>Flight:</strong> ${data.flight}</div>
                    <div><strong>Hotel:</strong> ${data.hotel}</div>
                    <div><strong>Dates:</strong> ${data.dates}</div>
                </div>
                <h4>Experience Highlights</h4>
                <p style="color: var(--clr-text-muted);">Enjoy premium travel, luxury accommodation, and memorable experiences curated for your journey.</p>
                <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:1.5rem;">
                    <span class="tag"><i class="fa-solid fa-star"></i> Concierge Service</span>
                    <span class="tag"><i class="fa-solid fa-bell-concierge"></i> VIP Support</span>
                    <span class="tag"><i class="fa-solid fa-utensils"></i> Gourmet Dining</span>
                    <span class="tag"><i class="fa-solid fa-car-side"></i> Transfers Included</span>
                </div>
                <button class="btn btn-primary" style="width:100%; margin-top:2rem;" onclick="openPaymentModal('${data.title.replace(/'/g, "\\'")}', '₹0')">Modify Booking</button>
            </div>
        `;
        openModal(html);
    }

    function showBookingManagement(data) {
        const html = `
            <div class="modal-body">
                <h2>Manage ${data.title}</h2>
                <p style="color: var(--clr-text-muted); margin-bottom: 1.2rem;">Update or reschedule your existing booking.</p>
                <div style="display:grid; gap:1rem;">
                    <button class="btn btn-primary" style="width:100%;" onclick="alert('Request sent to JourneyNest support for ${data.title}.')">Request Date Change</button>
                    <button class="btn btn-primary" style="width:100%;" onclick="alert('Cancellation procedure started for ${data.title}.')">Cancel Booking</button>
                    <button class="btn btn-outline" style="width:100%;" onclick="closeAllModals()">Close</button>
                </div>
            </div>
        `;
        openSidePanel(html);
    }

    function showBookingRepeat(data) {
        const html = `
            <div class="modal-body">
                <h2>Rebook ${data.title}</h2>
                <p style="color: var(--clr-text-muted); margin-bottom: 1.2rem;">Ready to experience this trip again? Confirm your booking details below.</p>
                <button class="btn btn-primary" style="width:100%;" onclick="openPaymentModal('${data.title.replace(/'/g, "\\'")}', '₹45,000')">Book Again</button>
                <button class="btn btn-outline" style="width:100%; margin-top:1rem;" onclick="closeAllModals()">Not Now</button>
            </div>
        `;
        openModal(html);
    }

    function showBookingReview(data) {
        const html = `
            <div class="modal-body">
                <h2>Leave a Review</h2>
                <p style="color: var(--clr-text-muted); margin-bottom: 1.2rem;">Share your experience for ${data.title}.</p>
                <textarea id="review-text" rows="6" style="width:100%; padding:1rem; border-radius:16px; border:1px solid rgba(0,0,0,0.1); margin-bottom:1rem; font-family: inherit;" placeholder="Write your review..."></textarea>
                <button class="btn btn-primary" style="width:100%;" onclick="submitBookingReview('${data.title.replace(/'/g, "\\'")}')">Submit Review</button>
            </div>
        `;
        openModal(html);
    }

    window.submitBookingReview = function(title) {
        const textarea = document.getElementById('review-text');
        if (!textarea || !textarea.value.trim()) {
            alert('Please write a review before submitting.');
            return;
        }
        alert(`Thank you for reviewing ${title}!`);
        closeAllModals();
    };

    // Profile sidebar arrows → show matching content on the right
    const profileNav = document.getElementById('profile-nav');
    if (profileNav) {
        profileNav.addEventListener('click', (e) => {
            const btn = e.target.closest('.profile-nav-btn');
            if (!btn) return;
            switchProfileTab(btn.getAttribute('data-ptab'));
        });
    }

    document.querySelectorAll('.edit-profile-btn[data-ptab]').forEach((btn) => {
        btn.addEventListener('click', () => {
            switchProfileTab(btn.getAttribute('data-ptab'));
        });
    });

});

// ========== GLOBAL PAYMENT MODAL FUNCTION ==========
function openPaymentModal(itemName, itemPrice) {
    const modalOverlay = document.getElementById('dynamic-modal');
    const modalContentContainer = document.getElementById('modal-content-container');
    const sidePanelOverlay = document.getElementById('dynamic-sidepanel');

    // Close side panel if open
    sidePanelOverlay.classList.remove('active');

    const html = `
        <div class="payment-container">
            <h2><i class="fa-solid fa-lock" style="color: var(--clr-primary); margin-right: 0.5rem;"></i> Secure Payment</h2>
            <p class="payment-subtitle">Complete your booking for <strong>${itemName}</strong></p>

            <!-- Order Summary -->
            <div class="payment-summary">
                <div>
                    <div class="summary-label">Booking</div>
                    <div class="summary-item">${itemName}</div>
                </div>
                <div style="text-align: right;">
                    <div class="summary-label">Total Amount</div>
                    <div class="summary-amount">${itemPrice}</div>
                </div>
            </div>

            <!-- Payment Tabs -->
            <div class="payment-tabs">
                <button class="payment-tab active" onclick="switchPaymentTab('card', this)"><i class="fa-solid fa-credit-card"></i> Card</button>
                <button class="payment-tab" onclick="switchPaymentTab('upi', this)"><i class="fa-solid fa-mobile-screen"></i> UPI</button>
            </div>

            <!-- Card Section -->
            <div id="card-section">
                <!-- Card Preview -->
                <div class="card-preview" id="card-preview">
                    <div class="card-brand"><i class="fa-brands fa-cc-visa"></i></div>
                    <div class="card-chip"></div>
                    <div class="card-number-display" id="card-num-display">•••• •••• •••• ••••</div>
                    <div class="card-bottom">
                        <div class="card-holder-display" id="card-name-display">YOUR NAME</div>
                        <div class="card-expiry-display">
                            <span>VALID THRU</span>
                            <span id="card-exp-display">MM/YY</span>
                        </div>
                    </div>
                </div>

                <!-- Card Form -->
                <form id="payment-form" onsubmit="processPayment(event, '${itemName.replace(/'/g, "\\'")}', '${itemPrice}')">
                    <div class="pay-form-row">
                        <div class="pay-form-group">
                            <label for="pay-fullname"><i class="fa-solid fa-user"></i> Full Name</label>
                            <input type="text" id="pay-fullname" placeholder="John Doe" required autocomplete="name">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter your full name</div>
                        </div>
                        <div class="pay-form-group">
                            <label for="pay-email"><i class="fa-solid fa-envelope"></i> Email</label>
                            <input type="email" id="pay-email" placeholder="john@example.com" required autocomplete="email">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email</div>
                        </div>
                    </div>

                    <div class="pay-form-group">
                        <label for="pay-phone"><i class="fa-solid fa-phone"></i> Phone Number</label>
                        <input type="tel" id="pay-phone" placeholder="+91 98765 43210" required maxlength="15" autocomplete="tel">
                        <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid phone number (10+ digits)</div>
                    </div>

                    <div class="pay-form-group">
                        <label for="pay-cardnum"><i class="fa-solid fa-credit-card"></i> Card Number</label>
                        <input type="text" id="pay-cardnum" placeholder="1234 5678 9012 3456" required maxlength="19" autocomplete="cc-number">
                        <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid 16-digit card number</div>
                    </div>

                    <div class="pay-form-row-3">
                        <div class="pay-form-group">
                            <label for="pay-expiry"><i class="fa-solid fa-calendar"></i> Expiry</label>
                            <input type="text" id="pay-expiry" placeholder="MM/YY" required maxlength="5" autocomplete="cc-exp">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Invalid format</div>
                        </div>
                        <div class="pay-form-group">
                            <label for="pay-cvv"><i class="fa-solid fa-shield-halved"></i> CVV</label>
                            <input type="password" id="pay-cvv" placeholder="•••" required maxlength="4" autocomplete="cc-csc">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> 3-4 digits</div>
                        </div>
                        <div class="pay-form-group">
                            <label for="pay-zip"><i class="fa-solid fa-map-pin"></i> ZIP Code</label>
                            <input type="text" id="pay-zip" placeholder="600001" required maxlength="6" autocomplete="postal-code">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Required</div>
                        </div>
                    </div>

                    <button type="submit" class="pay-btn" id="pay-submit-btn">
                        <span class="btn-text"><i class="fa-solid fa-lock"></i> Pay ${itemPrice}</span>
                        <div class="btn-spinner"></div>
                    </button>
                </form>
            </div>

            <!-- UPI Section -->
            <div id="upi-section" class="upi-section">
                <i class="fa-solid fa-mobile-screen" style="font-size: 3rem; color: var(--clr-primary); margin-bottom: 1rem;"></i>
                <h3>Pay via UPI</h3>
                <p style="color: var(--clr-text-muted); font-size: 0.9rem;">Enter your UPI ID to complete the payment</p>
                
                <form onsubmit="processUPIPayment(event, '${itemName.replace(/'/g, "\\'")}', '${itemPrice}')">
                    <div class="pay-form-group" style="margin-top: 1.5rem;">
                        <label for="pay-upi"><i class="fa-solid fa-at"></i> UPI ID</label>
                        <input type="text" id="pay-upi" placeholder="yourname@paytm" required>
                        <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Enter a valid UPI ID (e.g., name@upi)</div>
                    </div>
                    <div class="pay-form-row">
                        <div class="pay-form-group">
                            <label for="pay-upi-name"><i class="fa-solid fa-user"></i> Full Name</label>
                            <input type="text" id="pay-upi-name" placeholder="John Doe" required>
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter your name</div>
                        </div>
                        <div class="pay-form-group">
                            <label for="pay-upi-phone"><i class="fa-solid fa-phone"></i> Phone</label>
                            <input type="tel" id="pay-upi-phone" placeholder="+91 98765 43210" required maxlength="15">
                            <div class="field-error"><i class="fa-solid fa-circle-exclamation"></i> Enter valid phone</div>
                        </div>
                    </div>
                    <button type="submit" class="pay-btn" id="upi-submit-btn">
                        <span class="btn-text"><i class="fa-solid fa-lock"></i> Pay ${itemPrice} via UPI</span>
                        <div class="btn-spinner"></div>
                    </button>
                </form>
            </div>

            <div class="secure-badge">
                <i class="fa-solid fa-shield-halved"></i>
                Secured with 256-bit SSL encryption • PCI DSS Compliant
            </div>
        </div>
    `;

    modalContentContainer.innerHTML = html;
    modalOverlay.classList.add('active');

    // --- Setup live card preview & validations ---
    setupCardPreview();
    setupFieldValidations();
}

// Switch between Card and UPI tabs
function switchPaymentTab(tab, btn) {
    document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const cardSection = document.getElementById('card-section');
    const upiSection = document.getElementById('upi-section');

    if (tab === 'card') {
        cardSection.style.display = 'block';
        upiSection.classList.remove('active');
    } else {
        cardSection.style.display = 'none';
        upiSection.classList.add('active');
    }
}

// Live card preview updates
function setupCardPreview() {
    const cardNumInput = document.getElementById('pay-cardnum');
    const nameInput = document.getElementById('pay-fullname');
    const expiryInput = document.getElementById('pay-expiry');

    if (cardNumInput) {
        cardNumInput.addEventListener('input', (e) => {
            // Auto-format: add spaces every 4 digits
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            let formatted = val.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = formatted;

            // Update preview
            const display = document.getElementById('card-num-display');
            if (display) {
                display.textContent = formatted || '•••• •••• •••• ••••';
            }

            // Detect card brand
            const brand = document.querySelector('.card-brand');
            if (brand) {
                if (val.startsWith('4')) brand.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
                else if (val.startsWith('5')) brand.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
                else if (val.startsWith('3')) brand.innerHTML = '<i class="fa-brands fa-cc-amex"></i>';
                else brand.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
            }
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const display = document.getElementById('card-name-display');
            if (display) {
                display.textContent = nameInput.value.toUpperCase() || 'YOUR NAME';
            }
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 2) {
                val = val.substring(0, 2) + '/' + val.substring(2);
            }
            e.target.value = val;

            const display = document.getElementById('card-exp-display');
            if (display) {
                display.textContent = val || 'MM/YY';
            }
        });
    }
}

// Field validations
function setupFieldValidations() {
    const fields = document.querySelectorAll('.pay-form-group input');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
            field.classList.remove('valid');
        });
    });
}

function validateField(field) {
    const id = field.id;
    let isValid = true;
    const val = field.value.trim();

    if (!val) {
        isValid = false;
    } else {
        switch(id) {
            case 'pay-email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                break;
            case 'pay-phone':
            case 'pay-upi-phone':
                isValid = val.replace(/\D/g, '').length >= 10;
                break;
            case 'pay-cardnum':
                isValid = val.replace(/\s/g, '').length === 16;
                break;
            case 'pay-expiry':
                isValid = /^\d{2}\/\d{2}$/.test(val);
                if (isValid) {
                    const [mm, yy] = val.split('/').map(Number);
                    isValid = mm >= 1 && mm <= 12 && yy >= 25;
                }
                break;
            case 'pay-cvv':
                isValid = /^\d{3,4}$/.test(val);
                break;
            case 'pay-zip':
                isValid = val.length >= 4;
                break;
            case 'pay-upi':
                isValid = /^[\w.\-]+@[\w]+$/.test(val);
                break;
        }
    }

    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }

    return isValid;
}

// Process Card Payment
function processPayment(e, itemName, itemPrice) {
    e.preventDefault();

    const fields = ['pay-fullname', 'pay-email', 'pay-phone', 'pay-cardnum', 'pay-expiry', 'pay-cvv', 'pay-zip'];
    let allValid = true;

    fields.forEach(id => {
        const field = document.getElementById(id);
        if (!validateField(field)) {
            allValid = false;
        }
    });

    if (!allValid) return;

    // Show loading
    const btn = document.getElementById('pay-submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        showPaymentSuccess(itemName, itemPrice, document.getElementById('pay-fullname').value);
    }, 2000);
}

// Process UPI Payment
function processUPIPayment(e, itemName, itemPrice) {
    e.preventDefault();

    const fields = ['pay-upi', 'pay-upi-name', 'pay-upi-phone'];
    let allValid = true;

    fields.forEach(id => {
        const field = document.getElementById(id);
        if (!validateField(field)) {
            allValid = false;
        }
    });

    if (!allValid) return;

    const btn = document.getElementById('upi-submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        showPaymentSuccess(itemName, itemPrice, document.getElementById('pay-upi-name').value);
    }, 2000);
}

// Show Payment Success
function showPaymentSuccess(itemName, itemPrice, customerName) {
    const modalContentContainer = document.getElementById('modal-content-container');
    const txnId = 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const html = `
        <div class="payment-success">
            <div class="success-icon-wrapper">
                <i class="fa-solid fa-check"></i>
            </div>
            <h2>Payment Successful!</h2>
            <p class="success-msg">Your booking for <strong>${itemName}</strong> has been confirmed.</p>

            <div class="txn-details">
                <div class="txn-row">
                    <span class="txn-label">Transaction ID</span>
                    <span>${txnId}</span>
                </div>
                <div class="txn-row">
                    <span class="txn-label">Booking</span>
                    <span>${itemName}</span>
                </div>
                <div class="txn-row">
                    <span class="txn-label">Customer</span>
                    <span>${customerName}</span>
                </div>
                <div class="txn-row">
                    <span class="txn-label">Date & Time</span>
                    <span>${dateStr}, ${timeStr}</span>
                </div>
                <div class="txn-row">
                    <span class="txn-label">Amount Paid</span>
                    <span>${itemPrice}</span>
                </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem;" onclick="document.getElementById('dynamic-modal').classList.remove('active')">
                <i class="fa-solid fa-house"></i> Back to Home
            </button>
            <div class="secure-badge" style="margin-top: 1.2rem;">
                <i class="fa-solid fa-circle-check"></i>
                A confirmation email has been sent to your registered email.
            </div>
        </div>
    `;

    modalContentContainer.innerHTML = html;

    // Launch confetti!
    launchConfetti();
}

// Confetti Animation
function launchConfetti() {
    const wrapper = document.createElement('div');
    wrapper.className = 'confetti-wrapper';
    document.body.appendChild(wrapper);

    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#0284c7', '#A0D4E0', '#A5856F'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 1.5 + 's';
        piece.style.animationDuration = (2 + Math.random() * 2) + 's';

        if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
            piece.style.borderRadius = '50%';
        }

        wrapper.appendChild(piece);
    }

    // Remove confetti after animation
    setTimeout(() => wrapper.remove(), 4000);
}

// ========== PROFILE TAB LOGIC ==========
function switchProfileTab(tabId) {
    const profileView = document.getElementById('view-profile');
    if (!profileView) return;

    profileView.querySelectorAll('.profile-nav-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-ptab') === tabId);
    });

    profileView.querySelectorAll('.profile-tab-content').forEach((content) => {
        content.classList.toggle('active', content.id === `ptab-${tabId}`);
    });

    const mainContent = profileView.querySelector('.profile-content');
    if (mainContent) mainContent.scrollTop = 0;
}

window.switchProfileTab = switchProfileTab;
