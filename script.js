document.addEventListener("DOMContentLoaded", () => {

    const dropdowns = document.querySelectorAll(".status-dropdown");

    // =====================
    // STATUS COUNT + CHART
    // =====================

    let counts = {
        scheduled: 0,
        inprogress: 0,
        ready: 0,
        completed: 0,
        cancelled: 0
    };

    function countStatuses() {
        counts = {
            scheduled: 0,
            inprogress: 0,
            ready: 0,
            completed: 0,
            cancelled: 0
        };

        dropdowns.forEach(dropdown => {
            let value = dropdown.value.toLowerCase().replace(/\s/g, '');

            if (value.includes("scheduled")) counts.scheduled++;
            if (value.includes("inprogress")) counts.inprogress++;
            if (value.includes("ready")) counts.ready++;
            if (value.includes("completed")) counts.completed++;
            if (value.includes("cancelled")) counts.cancelled++;
        });

        updateChart();
    }

    // CREATE CHART
    const ctx = document.getElementById("statusChart");

    let chart;
    if (ctx) {
        chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Scheduled", "In Progress", "Ready", "Completed", "Cancelled"],
                datasets: [{
                    label: "Appointments",
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        "#9fa8da",
                        "#ffd54f",
                        "#81d4fa",
                        "#a5d6a7",
                        "#ef9a9a"
                    ]
                }]
            },
            options: {
                plugins: {
                    legend: { position: "right" },
                    title: {
                        display: true,
                        text: "Appointment Status Distribution"
                    }
                }
            }
        });
    }

    function updateChart() {
        if (!chart) return;

        chart.data.datasets[0].data = [
            counts.scheduled,
            counts.inprogress,
            counts.ready,
            counts.completed,
            counts.cancelled
        ];
        chart.update();
    }

    // =====================
    // WORKLOAD + CAPACITY
    // =====================

    function updateCapacity() {
        const rows = document.querySelectorAll("table tr");
        const totalDogsText = document.getElementById("totalDogsText");
        const completionBar = document.getElementById("completionBar");
        const completionText = document.getElementById("completionText");

        if (!totalDogsText || !completionBar || !completionText) {
            return;
        }

        let totalDogs = 0;
        let completedDogs = 0;

        let groomers = {
            lucy: { total: 0, active: 0 },
            amanda: { total: 0, active: 0 },
            andy: { total: 0, active: 0 },
            susy: { total: 0, active: 0 }
        };

        rows.forEach((row, index) => {
            if (index === 0) return;

            const dropdown = row.querySelector(".status-dropdown");
            if (!dropdown) return;

            const status = dropdown.value.toLowerCase();
            const names = row.children[3].textContent.toLowerCase();

            // TOTAL DOGS (exclude cancelled)
            if (!status.includes("cancelled")) {
                totalDogs++;
            }

            // COMPLETED DOGS
            if (
                status.includes("completed") ||
                status.includes("ready")
            ) {
                completedDogs++;
            }

            // GROOMER LOGIC
            Object.keys(groomers).forEach(name => {
                if (names.includes(name)) {

                    if (!status.includes("cancelled")) {
                        groomers[name].total++;
                    }

                    if (
                        status.includes("in progress") ||
                        status.includes("ready") ||
                        status.includes("completed")
                    ) {
                        groomers[name].active++;
                    }
                }
            });
        });

        // =====================
        // WORKLOAD DISPLAY
        // =====================

        totalDogsText.textContent = totalDogs + " dogs today";

        let percent = totalDogs === 0 ? 0 : Math.round((completedDogs / totalDogs) * 100);

        completionBar.style.width = percent + "%";

        completionText.textContent = completedDogs + " / " + totalDogs + " completed";

        // =====================
        // GROOMER BARS
        // =====================

        Object.keys(groomers).forEach(name => {
            let total = groomers[name].total;
            let active = groomers[name].active;

            let percent = total === 0 ? 0 : Math.round((active / total) * 100);

            const groomerLoad = document.getElementById(name + "Load");
            const groomerLoadText = document.getElementById(name + "LoadText");

            if (groomerLoad && groomerLoadText) {
                groomerLoad.style.width = percent + "%";
                groomerLoadText.textContent = percent + "%";
            }
        });
    }

    // =====================
    // EVENT LISTENERS
    // =====================

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("change", () => {
            countStatuses();
            updateCapacity();
        });
    });

    let revenueChart;

    function updateRevenue() {
        const rows = document.querySelectorAll("table tr");
        const revenueTotal = document.getElementById("revenueTotal");

        if (!revenueTotal) return;

        let totalRevenue = 0;
        let revenueData = [];
        let labels = [];

        rows.forEach((row, index) => {
            if (index === 0) return;

            const dropdown = row.querySelector(".status-dropdown");
            if (!dropdown) return;

            const status = dropdown.value.toLowerCase();
            const service = row.children[2].textContent.toLowerCase();

            let price = 0;

            // SAMPLE PRICES
            if (service.includes("puppy")) price = 30;
            else if (service.includes("senior")) price = 60;
            else if (service.includes("signature")) price = 80;
            else if (service.includes("bath")) price = 50;

            if (status.includes("completed")) {
                totalRevenue += price;
                revenueData.push(price);
            } else {
                revenueData.push(0);
            }

            labels.push("Appt " + index);
        });

        revenueTotal.textContent = "$" + totalRevenue;

        createRevenueChart(labels, revenueData);
    }

    function createRevenueChart(labels, data) {
        const ctx = document.getElementById("revenueChart");
        if (!ctx) return;

        if (revenueChart) revenueChart.destroy();

        revenueChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Revenue from Completed Services",
                    data: data,
                    tension: 0.3
                }]
            }
        });
    }

    // =====================
    // EVENTS
    // =====================

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("change", () => {
            countStatuses();
            updateCapacity();
            updateRevenue();
        });
    });



const countryDropdown = document.getElementById("country");

if (countryDropdown) {
    fetch("https://restcountries.com/v3.1/all?fields=name")
        .then(response => response.json())
        .then(data => {

            countryDropdown.innerHTML = "";

            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Select Country";
            defaultOption.value = "";
            countryDropdown.appendChild(defaultOption);

            data.forEach(country => {
                const option = document.createElement("option");
                option.value = country.name.common;
                option.textContent = country.name.common;

                if (country.name.common === "United States") {
                    option.selected = true;
                }

                countryDropdown.appendChild(option);
            });

        })
        .catch(error => {
            console.error("Error loading countries:", error);
            countryDropdown.innerHTML = "<option>Error loading countries</option>";
        });
}

// =====================
// STATE DROPDOWN
// =====================

const stateDropdown = document.getElementById("state");

if (stateDropdown) {

    const states = [
        { name: "Alabama", abbr: "AL" },
        { name: "Alaska", abbr: "AK" },
        { name: "Arizona", abbr: "AZ" },
        { name: "Arkansas", abbr: "AR" },
        { name: "California", abbr: "CA" },
        { name: "Colorado", abbr: "CO" },
        { name: "Connecticut", abbr: "CT" },
        { name: "Delaware", abbr: "DE" },
        { name: "Florida", abbr: "FL" },
        { name: "Georgia", abbr: "GA" },
        { name: "Hawaii", abbr: "HI" },
        { name: "Idaho", abbr: "ID" },
        { name: "Illinois", abbr: "IL" },
        { name: "Indiana", abbr: "IN" },
        { name: "Iowa", abbr: "IA" },
        { name: "Kansas", abbr: "KS" },
        { name: "Kentucky", abbr: "KY" },
        { name: "Louisiana", abbr: "LA" },
        { name: "Maine", abbr: "ME" },
        { name: "Maryland", abbr: "MD" },
        { name: "Massachusetts", abbr: "MA" },
        { name: "Michigan", abbr: "MI" },
        { name: "Minnesota", abbr: "MN" },
        { name: "Mississippi", abbr: "MS" },
        { name: "Missouri", abbr: "MO" },
        { name: "Montana", abbr: "MT" },
        { name: "Nebraska", abbr: "NE" },
        { name: "Nevada", abbr: "NV" },
        { name: "New Hampshire", abbr: "NH" },
        { name: "New Jersey", abbr: "NJ" },
        { name: "New Mexico", abbr: "NM" },
        { name: "New York", abbr: "NY" },
        { name: "North Carolina", abbr: "NC" },
        { name: "North Dakota", abbr: "ND" },
        { name: "Ohio", abbr: "OH" },
        { name: "Oklahoma", abbr: "OK" },
        { name: "Oregon", abbr: "OR" },
        { name: "Pennsylvania", abbr: "PA" },
        { name: "Rhode Island", abbr: "RI" },
        { name: "South Carolina", abbr: "SC" },
        { name: "South Dakota", abbr: "SD" },
        { name: "Tennessee", abbr: "TN" },
        { name: "Texas", abbr: "TX" },
        { name: "Utah", abbr: "UT" },
        { name: "Vermont", abbr: "VT" },
        { name: "Virginia", abbr: "VA" },
        { name: "Washington", abbr: "WA" },
        { name: "West Virginia", abbr: "WV" },
        { name: "Wisconsin", abbr: "WI" },
        { name: "Wyoming", abbr: "WY" },

        // IMPORTANT (professor mentioned)
        { name: "District of Columbia", abbr: "DC" },
        { name: "Puerto Rico", abbr: "PR" }
    ];

    // Default option
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Select State";
    defaultOption.value = "";
    stateDropdown.appendChild(defaultOption);

    // Populate dropdown
    states.forEach(state => {
        const option = document.createElement("option");

        option.value = state.abbr;       // STORED (TX)
        option.textContent = state.name; // DISPLAYED (Texas)

        stateDropdown.appendChild(option);
    });
}

// =====================
// BREED PICKER
// =====================

const breedOptions = document.getElementById("breed-options");
const primaryBreedInput = document.getElementById("breed-primary");
const secondaryBreedGroup = document.getElementById("secondary-breed-group");
const secondaryBreedInput = document.getElementById("breed-secondary");
const addBreedButton = document.getElementById("add-breed-button");
const removeBreedButton = document.getElementById("remove-breed-button");
const petSection = document.getElementById("pet-section");
const togglePetSectionButton = document.getElementById("toggle-pet-section");
const hidePetSectionButton = document.getElementById("hide-pet-section");
const vaccineSection = document.getElementById("vaccine-section");
const toggleVaccineSectionButton = document.getElementById("toggle-vaccine-section");
const hideVaccineSectionButton = document.getElementById("hide-vaccine-section");
const addAnotherPetButton = document.getElementById("add-another-pet");
const customerForm = document.getElementById("customer-form");
const toggleCustomerFormButton = document.getElementById("toggle-customer-form");
const hideCustomerFormButton = document.getElementById("hide-customer-form");

if (breedOptions && primaryBreedInput) {
    const dogBreeds = [
        "Mixed Breed / Unknown",
        "Affenpinscher",
        "Afghan Hound",
        "Airedale Terrier",
        "Akita",
        "Alaskan Klee Kai",
        "Alaskan Malamute",
        "American Bulldog",
        "American English Coonhound",
        "American Eskimo Dog",
        "American Foxhound",
        "American Hairless Terrier",
        "American Leopard Hound",
        "American Staffordshire Terrier",
        "American Water Spaniel",
        "Anatolian Shepherd Dog",
        "Appenzeller Sennenhund",
        "Australian Cattle Dog",
        "Australian Kelpie",
        "Australian Shepherd",
        "Australian Stumpy Tail Cattle Dog",
        "Australian Terrier",
        "Azawakh",
        "Barbado da Terceira",
        "Barbet",
        "Basenji",
        "Basset Fauve de Bretagne",
        "Basset Hound",
        "Bavarian Mountain Scent Hound",
        "Beagle",
        "Bearded Collie",
        "Beauceron",
        "Bedlington Terrier",
        "Belgian Laekenois",
        "Belgian Malinois",
        "Belgian Sheepdog",
        "Belgian Tervuren",
        "Bergamasco Sheepdog",
        "Berger Picard",
        "Bernese Mountain Dog",
        "Bichon Frise",
        "Biewer Terrier",
        "Black and Tan Coonhound",
        "Black Russian Terrier",
        "Bloodhound",
        "Blue Picardy Spaniel",
        "Bluetick Coonhound",
        "Boerboel",
        "Bohemian Shepherd",
        "Bolognese",
        "Border Collie",
        "Border Terrier",
        "Borzoi",
        "Boston Terrier",
        "Bouvier des Ardennes",
        "Bouvier des Flandres",
        "Boxer",
        "Boykin Spaniel",
        "Bracco Italiano",
        "Braque du Bourbonnais",
        "Braque Francais Pyrenean",
        "Braque Saint-Germain",
        "Brazilian Terrier",
        "Briard",
        "Brittany",
        "Broholmer",
        "Brussels Griffon",
        "Bull Terrier",
        "Bulldog",
        "Bullmastiff",
        "Cairn Terrier",
        "Calupoh",
        "Canaan Dog",
        "Canadian Eskimo Dog",
        "Cane Corso",
        "Cardigan Welsh Corgi",
        "Carolina Dog",
        "Catahoula Leopard Dog",
        "Caucasian Shepherd Dog",
        "Cavalier King Charles Spaniel",
        "Central Asian Shepherd Dog",
        "Cesky Terrier",
        "Chesapeake Bay Retriever",
        "Chihuahua",
        "Chinese Crested",
        "Chinese Shar-Pei",
        "Chinook",
        "Chow Chow",
        "Cirneco dell’Etna",
        "Clumber Spaniel",
        "Cocker Spaniel",
        "Collie",
        "Coton de Tulear",
        "Croatian Sheepdog",
        "Curly-Coated Retriever",
        "Czechoslovakian Vlciak",
        "Dachshund",
        "Dalmatian",
        "Dandie Dinmont Terrier",
        "Danish-Swedish Farmdog",
        "Deutscher Wachtelhund",
        "Doberman Pinscher",
        "Dogo Argentino",
        "Dogue de Bordeaux",
        "Drentsche Patrijshond",
        "Drever",
        "Dutch Shepherd",
        "English Cocker Spaniel",
        "English Foxhound",
        "English Setter",
        "English Springer Spaniel",
        "English Toy Spaniel",
        "Entlebucher Mountain Dog",
        "Estrela Mountain Dog",
        "Eurasier",
        "Field Spaniel",
        "Finnish Lapphund",
        "Finnish Spitz",
        "Flat-Coated Retriever",
        "French Bulldog",
        "French Spaniel",
        "German Longhaired Pointer",
        "German Pinscher",
        "German Shepherd Dog",
        "German Shorthaired Pointer",
        "German Spitz",
        "German Wirehaired Pointer",
        "Giant Schnauzer",
        "Glen of Imaal Terrier",
        "Golden Retriever",
        "Gordon Setter",
        "Grand Basset Griffon Vendéen",
        "Great Dane",
        "Great Pyrenees",
        "Greater Swiss Mountain Dog",
        "Greyhound",
        "Hamiltonstovare",
        "Hanoverian Scenthound",
        "Harrier",
        "Havanese",
        "Hokkaido",
        "Hovawart",
        "Ibizan Hound",
        "Icelandic Sheepdog",
        "Irish Red and White Setter",
        "Irish Setter",
        "Irish Terrier",
        "Irish Water Spaniel",
        "Irish Wolfhound",
        "Italian Greyhound",
        "Jagdterrier",
        "Japanese Akitainu",
        "Japanese Chin",
        "Japanese Spitz",
        "Japanese Terrier",
        "Kai Ken",
        "Karelian Bear Dog",
        "Keeshond",
        "Kerry Blue Terrier",
        "Kishu Ken",
        "Komondor",
        "Korean Jindo Dog",
        "Kromfohrlander",
        "Kuvasz",
        "Labrador Retriever",
        "Lagotto Romagnolo",
        "Lakeland Terrier",
        "Lancashire Heeler",
        "Lapponian Herder",
        "Large Munsterlander",
        "Leonberger",
        "Lhasa Apso",
        "Lowchen",
        "Maltese",
        "Manchester Terrier (Standard)",
        "Manchester Terrier (Toy)",
        "Mastiff",
        "Miniature American Shepherd",
        "Miniature Bull Terrier",
        "Miniature Pinscher",
        "Miniature Schnauzer",
        "Mountain Cur",
        "Mudi",
        "Neapolitan Mastiff",
        "Nederlandse Kooikerhondje",
        "Newfoundland",
        "Norfolk Terrier",
        "Norrbottenspets",
        "Norwegian Buhund",
        "Norwegian Elkhound",
        "Norwegian Lundehund",
        "Norwich Terrier",
        "Nova Scotia Duck Tolling Retriever",
        "Old English Sheepdog",
        "Otterhound",
        "Papillon",
        "Parson Russell Terrier",
        "Pekingese",
        "Pembroke Welsh Corgi",
        "Peruvian Inca Orchid",
        "Petit Basset Griffon Vendéen",
        "Pharaoh Hound",
        "Plott Hound",
        "Pointer",
        "Polish Lowland Sheepdog",
        "Pomeranian",
        "Pont-Audemer Spaniel",
        "Poodle (Miniature)",
        "Poodle (Standard)",
        "Poodle (Toy)",
        "Porcelaine",
        "Portuguese Podengo",
        "Portuguese Podengo Pequeno",
        "Portuguese Pointer",
        "Portuguese Sheepdog",
        "Portuguese Water Dog",
        "Presa Canario",
        "Pudelpointer",
        "Pug",
        "Puli",
        "Pumi",
        "Pyrenean Mastiff",
        "Pyrenean Shepherd",
        "Rafeiro do Alentejo",
        "Rat Terrier",
        "Redbone Coonhound",
        "Rhodesian Ridgeback",
        "Romanian Carpathian Shepherd",
        "Romanian Mioritic Shepherd Dog",
        "Rottweiler",
        "Russell Terrier",
        "Russian Toy",
        "Russian Tsvetnaya Bolonka",
        "Saint Bernard",
        "Saluki",
        "Samoyed",
        "Schapendoes",
        "Schipperke",
        "Scottish Deerhound",
        "Scottish Terrier",
        "Sealyham Terrier",
        "Segugio Italiano",
        "Shetland Sheepdog",
        "Shiba Inu",
        "Shih Tzu",
        "Shikoku Ken",
        "Siberian Husky",
        "Silky Terrier",
        "Skye Terrier",
        "Sloughi",
        "Slovakian Wirehaired Pointer",
        "Slovensky Cuvac",
        "Slovensky Kopov",
        "Small Munsterlander",
        "Smooth Fox Terrier",
        "Soft Coated Wheaten Terrier",
        "Spanish Mastiff",
        "Spanish Water Dog",
        "Spinone Italiano",
        "Stabyhoun",
        "Staffordshire Bull Terrier",
        "Standard Schnauzer",
        "Sussex Spaniel",
        "Swedish Lapphund",
        "Swedish Vallhund",
        "Taiwan Dog",
        "Teddy Roosevelt Terrier",
        "Thai Bangkaew",
        "Thai Ridgeback",
        "Tibetan Mastiff",
        "Tibetan Spaniel",
        "Tibetan Terrier",
        "Tornjak",
        "Tosa",
        "Toy Fox Terrier",
        "Transylvanian Hound",
        "Treeing Tennessee Brindle",
        "Treeing Walker Coonhound",
        "Vizsla",
        "Volpino Italiano",
        "Weimaraner",
        "Welsh Springer Spaniel",
        "Welsh Terrier",
        "West Highland White Terrier",
        "Wetterhoun",
        "Whippet",
        "Wire Fox Terrier",
        "Wirehaired Pointing Griffon",
        "Wirehaired Vizsla",
        "Working Kelpie",
        "Xoloitzcuintli",
        "Yakutian Laika",
        "Yorkshire Terrier"
    ];

    dogBreeds.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed;
        breedOptions.appendChild(option);
    });
}

if (addBreedButton && secondaryBreedGroup && secondaryBreedInput) {
    addBreedButton.addEventListener("click", () => {
        secondaryBreedGroup.classList.remove("hidden");
        addBreedButton.classList.add("hidden");
        secondaryBreedInput.focus();
    });
}

if (removeBreedButton && secondaryBreedGroup && secondaryBreedInput && addBreedButton) {
    removeBreedButton.addEventListener("click", () => {
        secondaryBreedInput.value = "";
        secondaryBreedGroup.classList.add("hidden");
        addBreedButton.classList.remove("hidden");
    });
}

if (petSection && togglePetSectionButton) {
    togglePetSectionButton.addEventListener("click", () => {
        petSection.classList.remove("hidden");
        togglePetSectionButton.classList.add("hidden");
        if (addAnotherPetButton) {
            addAnotherPetButton.classList.remove("hidden");
        }
        if (primaryBreedInput) {
            primaryBreedInput.focus();
        }
    });
}

if (customerForm && toggleCustomerFormButton) {
    toggleCustomerFormButton.addEventListener("click", () => {
        customerForm.classList.remove("hidden");
        toggleCustomerFormButton.classList.add("hidden");
        const firstNameInput = document.getElementById("first-name");
        if (firstNameInput) {
            firstNameInput.focus();
        }
    });
}

if (customerForm && hideCustomerFormButton && toggleCustomerFormButton) {
    hideCustomerFormButton.addEventListener("click", () => {
        customerForm.classList.add("hidden");
        toggleCustomerFormButton.classList.remove("hidden");

        if (petSection && togglePetSectionButton) {
            petSection.classList.add("hidden");
            togglePetSectionButton.classList.remove("hidden");
        }

        if (vaccineSection && toggleVaccineSectionButton) {
            vaccineSection.classList.add("hidden");
            toggleVaccineSectionButton.classList.remove("hidden");
        }

        if (addAnotherPetButton) {
            addAnotherPetButton.classList.add("hidden");
        }
    });
}

if (petSection && hidePetSectionButton && togglePetSectionButton) {
    hidePetSectionButton.addEventListener("click", () => {
        petSection.classList.add("hidden");
        togglePetSectionButton.classList.remove("hidden");
        if (addAnotherPetButton) {
            addAnotherPetButton.classList.add("hidden");
        }

        if (vaccineSection && toggleVaccineSectionButton) {
            vaccineSection.classList.add("hidden");
            toggleVaccineSectionButton.classList.remove("hidden");
        }
    });
}

if (vaccineSection && toggleVaccineSectionButton) {
    toggleVaccineSectionButton.addEventListener("click", () => {
        vaccineSection.classList.remove("hidden");
        toggleVaccineSectionButton.classList.add("hidden");
    });
}

if (vaccineSection && hideVaccineSectionButton && toggleVaccineSectionButton) {
    hideVaccineSectionButton.addEventListener("click", () => {
        vaccineSection.classList.add("hidden");
        toggleVaccineSectionButton.classList.remove("hidden");
    });
}

if (addAnotherPetButton) {
    addAnotherPetButton.addEventListener("click", () => {
        window.alert("This button can lead to a second pet form next. For now, it marks where we can add another pet intake section.");
    });
}

// =====================
// CUSTOMER SEARCH + PROFILE DEMO
// =====================

const searchInput = document.getElementById("customer-search-input");
const customerFilter = document.getElementById("customer-filter");
const resultsContainer = document.getElementById("customer-results");
const resultsCount = document.getElementById("customer-results-count");
const profilePanel = document.getElementById("customer-profile-panel");
const viewProfileButton = document.getElementById("view-customer-profile");
const customerBrowser = document.getElementById("customer-browser");
const hideCustomerResultsButton = document.getElementById("hide-customer-results");
const customerSearchButton = document.getElementById("customer-search-button");

if (searchInput && customerFilter && resultsContainer && resultsCount && profilePanel) {
    const customerRecords = [
        {
            id: "cust-john-smith",
            firstName: "John",
            lastName: "Smith",
            fullName: "John Smith",
            phone: "(713) 555-0122",
            email: "johnsmith@gmail.com",
            preferredContact: "Text",
            status: "Active",
            addedDate: "2024-01-15",
            address: "1402 Heights Blvd",
            apartment: "",
            city: "Houston",
            state: "TX",
            zip: "77008",
            notes: "Preferred groomer: Lucy. Preferred shampoo: No scented products.",
            petName: "Cooper",
            petBreed: "Golden Retriever",
            petSecondBreed: "",
            weight: "68 lbs",
            temperament: "Calm and Sociable",
            firstGroom: "No",
            petFirstVisit: "2024-01-15",
            vaccineSummary: "Active vaccinations",
            lifetimeSpend: 840,
            visits: 12,
            lastVisit: "2026-03-17",
            authorizedPickup: "John Smith, Sandra Smith (wife)",
            creditBalance: "$0.00",
            appointmentHistory: [
                { date: "2026-03-17", service: "Full Groom + De-Shed", total: "$95" },
                { date: "2026-02-10", service: "Signature Groom", total: "$75" },
                { date: "2026-01-06", service: "Bath & Brush", total: "$50" }
            ]
        },
        {
            id: "cust-maria-garcia",
            firstName: "Maria",
            lastName: "Garcia",
            fullName: "Maria Garcia",
            phone: "(713) 555-0164",
            email: "maria.garcia@email.com",
            preferredContact: "Phone",
            status: "Active",
            addedDate: "2025-08-03",
            address: "511 W 19th St",
            apartment: "Apt 4B",
            city: "Houston",
            state: "TX",
            zip: "77008",
            notes: "Call before pickup. Daisy gets nervous around loud dryers.",
            petName: "Daisy",
            petBreed: "Shih Tzu",
            petSecondBreed: "",
            weight: "14 lbs",
            temperament: "Nervous",
            firstGroom: "No",
            petFirstVisit: "2025-08-03",
            vaccineSummary: "Vaccines on file",
            lifetimeSpend: 315,
            visits: 5,
            lastVisit: "2026-01-05",
            authorizedPickup: "Maria Garcia, Elena Garcia",
            creditBalance: "$0.00",
            appointmentHistory: [
                { date: "2026-01-05", service: "Mini Spaw", total: "$58" },
                { date: "2025-11-22", service: "Puppy Love", total: "$65" }
            ]
        }
    ];

    let selectedCustomerId = customerRecords[0].id;

    function formatDate(dateString) {
        if (!dateString) return "Not added yet";

        const date = new Date(`${dateString}T00:00:00`);
        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        });
    }

    function formatMonthYear(dateString) {
        if (!dateString) return "Unknown";

        const date = new Date(`${dateString}T00:00:00`);
        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        });
    }

    function getAddressLine(customer) {
        const apartment = customer.apartment ? `, ${customer.apartment}` : "";
        return `${customer.address}${apartment}, ${customer.city}, ${customer.state} ${customer.zip}`;
    }

    function getBreedLabel(customer) {
        return customer.petSecondBreed
            ? `${customer.petBreed} / ${customer.petSecondBreed}`
            : customer.petBreed;
    }

    function getLastVisitLabel(customer) {
        return customer.lastVisit ? formatDate(customer.lastVisit) : "First visit pending";
    }

    function buildProfile(customer) {
        const appointmentRows = customer.appointmentHistory.map(appointment => `
            <div class="appointment-row">
                <span>${formatDate(appointment.date)}</span>
                <span>${appointment.service}</span>
                <strong>${appointment.total}</strong>
            </div>
        `).join("");

        profilePanel.innerHTML = `
            <div class="profile-card">
                <div class="profile-summary">
                    <div>
                        <h3>${customer.fullName}</h3>
                        <p class="profile-subtext">Customer since ${formatMonthYear(customer.addedDate)} · ${customer.visits} visits · $${customer.lifetimeSpend} lifetime spend</p>
                    </div>
                    <span class="profile-status">${customer.status}</span>
                </div>

                <div>
                    <p class="profile-section-title">CONTACT INFORMATION</p>
                    <div class="profile-grid">
                        <div class="profile-block"><span>Phone</span><strong>${customer.phone}</strong></div>
                        <div class="profile-block"><span>Email</span><strong>${customer.email || "Not provided"}</strong></div>
                        <div class="profile-block"><span>Preferred contact</span><strong>${customer.preferredContact}</strong></div>
                        <div class="profile-block"><span>Last visit</span><strong>${getLastVisitLabel(customer)}</strong></div>
                        <div class="profile-block"><span>Address</span><strong>${getAddressLine(customer)}</strong></div>
                    </div>
                </div>

                <div>
                    <p class="profile-section-title">PREFERENCES</p>
                    <div class="profile-grid">
                        <div class="profile-block"><span>Customer notes</span><strong>${customer.notes || "No preferences on file"}</strong></div>
                        <div class="profile-block"><span>Authorized pickup</span><strong>${customer.authorizedPickup}</strong></div>
                    </div>
                </div>

                <div>
                    <p class="profile-section-title">ACCOUNT CREDIT</p>
                    <div class="profile-grid">
                        <div class="profile-block"><span>Credit balance</span><strong>${customer.creditBalance}</strong></div>
                    </div>
                </div>

                <div>
                    <p class="profile-section-title">LINKED PETS</p>
                    <div class="pet-chip">
                        <div class="pet-chip-meta">
                            <strong>${customer.petName}</strong>
                            <span>${getBreedLabel(customer)} · ${customer.weight} · ${customer.vaccineSummary}</span>
                        </div>
                        <span class="pet-eligibility">${customer.status === "Active" ? "Eligible" : "Pending"}</span>
                    </div>
                </div>

                <div>
                    <p class="profile-section-title">APPOINTMENT HISTORY</p>
                    <div class="appointment-history">
                        ${appointmentRows || `<div class="appointment-row"><span>No visits yet</span><span>New customer record</span><strong>-</strong></div>`}
                    </div>
                </div>
            </div>
        `;
    }

    function renderResults(customers) {
        resultsContainer.innerHTML = "";
        resultsCount.textContent = `${customers.length} customer${customers.length === 1 ? "" : "s"}`;

        if (customers.length === 0) {
            resultsContainer.innerHTML = `
                <div class="result-card">
                    <h4>No Matches Found</h4>
                    <p>Try searching by the customer's phone number, email, full name, or pet name.</p>
                </div>
            `;
            if (viewProfileButton) {
                viewProfileButton.disabled = true;
            }
            profilePanel.innerHTML = `
                <div class="profile-empty">
                    <h3>No Customer Selected</h3>
                    <p>Search for Jane Doe by name, email, or phone number after you save the customer.</p>
                </div>
            `;
            return;
        }

        if (!customers.some(customer => customer.id === selectedCustomerId)) {
            selectedCustomerId = customers[0].id;
        }

        customers.forEach(customer => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = `result-card${customer.id === selectedCustomerId ? " active" : ""}`;
            card.innerHTML = `
                <h4>${customer.fullName}</h4>
                <p>${customer.petName} · Last visit ${getLastVisitLabel(customer)}</p>
                <p>${customer.phone} · ${customer.email || "No email on file"}</p>
            `;

            card.addEventListener("click", () => {
                selectedCustomerId = customer.id;
                buildProfile(customer);
                renderResults(getFilteredCustomers());
                if (viewProfileButton) {
                    viewProfileButton.disabled = false;
                }
            });

            resultsContainer.appendChild(card);
        });

        const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId) || customers[0];
        buildProfile(selectedCustomer);

        if (viewProfileButton) {
            viewProfileButton.disabled = false;
        }
    }

    function getFilteredCustomers() {
        const query = searchInput.value.trim().toLowerCase();
        const filterValue = customerFilter.value;

        return customerRecords.filter(customer => {
            const searchMatches = !query || [
                customer.fullName,
                customer.firstName,
                customer.lastName,
                customer.phone,
                customer.email,
                customer.petName
            ].some(value => (value || "").toLowerCase().includes(query));

            if (!searchMatches) {
                return false;
            }

            if (filterValue === "Active Customers") {
                return customer.status === "Active";
            }

            if (filterValue === "New This Month") {
                const added = new Date(`${customer.addedDate}T00:00:00`);
                const today = new Date();

                return added.getMonth() === today.getMonth() && added.getFullYear() === today.getFullYear();
            }

            return true;
        });
    }

    function renderCustomerWorkspace() {
        renderResults(getFilteredCustomers());
    }

    function openCustomerResults() {
        if (customerBrowser) {
            customerBrowser.classList.remove("hidden");
        }
    }

    function runCustomerSearch() {
        const filteredCustomers = getFilteredCustomers();

        if (filteredCustomers.length > 0) {
            selectedCustomerId = filteredCustomers[0].id;
        }

        openCustomerResults();
        renderResults(filteredCustomers);
    }

    if (viewProfileButton) {
        viewProfileButton.addEventListener("click", () => {
            const selectedCustomer = customerRecords.find(customer => customer.id === selectedCustomerId);
            if (selectedCustomer) {
                openCustomerResults();
                buildProfile(selectedCustomer);
                profilePanel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    if (customerBrowser && hideCustomerResultsButton) {
        hideCustomerResultsButton.addEventListener("click", () => {
            customerBrowser.classList.add("hidden");
        });
    }

    if (customerSearchButton) {
        customerSearchButton.addEventListener("click", runCustomerSearch);
    }

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            runCustomerSearch();
        }
    });

    customerFilter.addEventListener("change", () => {
        if (customerBrowser && !customerBrowser.classList.contains("hidden")) {
            renderCustomerWorkspace();
        }
    });

    if (customerForm) {
        customerForm.addEventListener("submit", event => {
            event.preventDefault();

            const fullName = `${document.getElementById("first-name").value.trim()} ${document.getElementById("last-name").value.trim()}`.trim();
            const petName = document.getElementById("pet-name").value.trim();
            const primaryBreed = document.getElementById("breed-primary").value.trim();
            const secondaryBreed = secondaryBreedInput ? secondaryBreedInput.value.trim() : "";
            const customerCreditValue = document.getElementById("customer-credit").value.trim();
            const newCustomer = {
                id: `cust-${Date.now()}`,
                firstName: document.getElementById("first-name").value.trim(),
                lastName: document.getElementById("last-name").value.trim(),
                fullName,
                phone: document.getElementById("phone-number").value.trim(),
                email: document.getElementById("email").value.trim(),
                preferredContact: document.getElementById("preferred-contact").value,
                status: "Active",
                addedDate: document.getElementById("customer-added-date").value,
                address: document.getElementById("address").value.trim(),
                apartment: document.getElementById("apartment").value.trim(),
                city: document.getElementById("city").value.trim(),
                state: document.getElementById("state").value,
                zip: document.getElementById("zip-code").value.trim(),
                notes: document.getElementById("customer-notes").value.trim(),
                petName,
                petBreed: primaryBreed,
                petSecondBreed: secondaryBreed,
                weight: document.getElementById("weight").value.trim(),
                temperament: document.getElementById("temperament").value,
                firstGroom: document.getElementById("first-groom").value,
                petFirstVisit: document.getElementById("pet-first-visit").value,
                vaccineSummary: "Vaccination review needed",
                lifetimeSpend: 0,
                visits: 0,
                lastVisit: "",
                authorizedPickup: fullName,
                creditBalance: `$${Number(customerCreditValue || 0).toFixed(2)}`,
                appointmentHistory: []
            };

            customerRecords.unshift(newCustomer);
            selectedCustomerId = newCustomer.id;
            searchInput.value = newCustomer.fullName;
            openCustomerResults();
            renderCustomerWorkspace();

            customerForm.reset();

            if (secondaryBreedGroup && addBreedButton) {
                secondaryBreedGroup.classList.add("hidden");
                addBreedButton.classList.remove("hidden");
            }

            if (petSection && togglePetSectionButton) {
                petSection.classList.add("hidden");
                togglePetSectionButton.classList.remove("hidden");
            }

            if (vaccineSection && toggleVaccineSectionButton) {
                vaccineSection.classList.add("hidden");
                toggleVaccineSectionButton.classList.remove("hidden");
            }

            if (customerForm && toggleCustomerFormButton) {
                customerForm.classList.add("hidden");
                toggleCustomerFormButton.classList.remove("hidden");
            }

            if (addAnotherPetButton) {
                addAnotherPetButton.classList.add("hidden");
            }
        });
    }

    renderCustomerWorkspace();
}

    
    // RUN ON LOAD
    countStatuses();
    updateCapacity();
    updateRevenue();

});
