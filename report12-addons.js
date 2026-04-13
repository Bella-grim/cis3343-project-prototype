document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("report12-addons-search");
    const startDateInput = document.getElementById("report12-addons-start-date");
    const endDateInput = document.getElementById("report12-addons-end-date");
    const addonFilter = document.getElementById("report12-addon-filter");
    const topAddon = document.getElementById("report12-top-addon");
    const highestAddonRevenue = document.getElementById("report12-highest-addon-revenue");
    const bestUpsell = document.getElementById("report12-best-upsell");
    const totalSelections = document.getElementById("report12-total-selections");
    const addonResults = document.getElementById("report12-addons-results");
    const addonsBody = document.getElementById("report12-addons-body");
    const addonsEmpty = document.getElementById("report12-addons-empty");
    const addonSortButtons = document.querySelectorAll(".report12-addon-sort");

    if (
        !searchInput ||
        !startDateInput ||
        !endDateInput ||
        !addonFilter ||
        !topAddon ||
        !highestAddonRevenue ||
        !bestUpsell ||
        !totalSelections ||
        !addonResults ||
        !addonsBody ||
        !addonsEmpty
    ) {
        return;
    }

    const addonRows = [
        { serviceName: "Flea and Tick Treatment", timesAdded: 6, percentOfOrders: 3, revenueGenerated: 126, averageRevenuePerSelection: 21, trend: "Stable" },
        { serviceName: "Medicated Shampoo", timesAdded: 9, percentOfOrders: 5, revenueGenerated: 171, averageRevenuePerSelection: 19, trend: "Up" },
        { serviceName: "Oatmeal Bath", timesAdded: 11, percentOfOrders: 6, revenueGenerated: 176, averageRevenuePerSelection: 16, trend: "Stable" },
        { serviceName: "Hair Volumizing Treatment", timesAdded: 7, percentOfOrders: 4, revenueGenerated: 140, averageRevenuePerSelection: 20, trend: "Up" },
        { serviceName: "Leave In Conditioner", timesAdded: 10, percentOfOrders: 5, revenueGenerated: 120, averageRevenuePerSelection: 12, trend: "Stable" },
        { serviceName: "De-matting", timesAdded: 14, percentOfOrders: 8, revenueGenerated: 420, averageRevenuePerSelection: 30, trend: "Up" },
        { serviceName: "Face or Sanitary Tidy", timesAdded: 12, percentOfOrders: 7, revenueGenerated: 216, averageRevenuePerSelection: 18, trend: "Stable" },
        { serviceName: "Poodle Feet", timesAdded: 5, percentOfOrders: 3, revenueGenerated: 110, averageRevenuePerSelection: 22, trend: "Down" },
        { serviceName: "Nail Grinding", timesAdded: 18, percentOfOrders: 10, revenueGenerated: 270, averageRevenuePerSelection: 15, trend: "Up" },
        { serviceName: "Gland Expression", timesAdded: 21, percentOfOrders: 11, revenueGenerated: 315, averageRevenuePerSelection: 15, trend: "Up" },
        { serviceName: "Teeth Brush", timesAdded: 16, percentOfOrders: 9, revenueGenerated: 192, averageRevenuePerSelection: 12, trend: "Stable" },
        { serviceName: "Ear Pluck", timesAdded: 8, percentOfOrders: 4, revenueGenerated: 120, averageRevenuePerSelection: 15, trend: "Stable" },
        { serviceName: "Dog Safe Hair Dye", timesAdded: 4, percentOfOrders: 2, revenueGenerated: 180, averageRevenuePerSelection: 45, trend: "Up" },
        { serviceName: "Extra Handling", timesAdded: 9, percentOfOrders: 5, revenueGenerated: 225, averageRevenuePerSelection: 25, trend: "Up" },
        { serviceName: "Teeth Brushing with Foam and Spray", timesAdded: 6, percentOfOrders: 3, revenueGenerated: 96, averageRevenuePerSelection: 16, trend: "Stable" },
        { serviceName: "Paw Pad & Nose Balm", timesAdded: 13, percentOfOrders: 7, revenueGenerated: 156, averageRevenuePerSelection: 12, trend: "Up" },
        { serviceName: "Wrinkle Balm", timesAdded: 5, percentOfOrders: 3, revenueGenerated: 70, averageRevenuePerSelection: 14, trend: "Down" }
    ];

    let addonSortKey = "timesAdded";
    let addonSortDirection = "desc";

    function formatCurrency(value) {
        return `$${value.toLocaleString()}`;
    }

    function getTrendBadgeClass(value) {
        return `trend-badge ${value.toLowerCase()}`;
    }

    function compareValues(left, right) {
        if (typeof left === "number" && typeof right === "number") {
            return left - right;
        }

        return String(left).localeCompare(String(right), undefined, {
            numeric: true,
            sensitivity: "base"
        });
    }

    function updateSortButtons() {
        addonSortButtons.forEach(button => {
            const isActive = button.dataset.sort === addonSortKey;
            button.classList.toggle("active", isActive);
            const label = button.dataset.label || button.textContent.replace(/[ ↑↓]/g, "");
            const arrow = isActive ? (addonSortDirection === "asc" ? " ↑" : " ↓") : "";
            button.textContent = `${label}${arrow}`;
        });
    }

    function getFilteredRows() {
        const query = searchInput.value.trim().toLowerCase();
        return addonRows.filter(row => {
            const matchesSearch =
                !query ||
                [row.serviceName, row.trend].some(value =>
                    value.toLowerCase().includes(query)
                );
            const matchesAddon =
                addonFilter.value === "all" || row.serviceName === addonFilter.value;
            return matchesSearch && matchesAddon;
        });
    }

    function sortRows(rows) {
        return [...rows].sort((left, right) => {
            const result = compareValues(left[addonSortKey], right[addonSortKey]);
            return addonSortDirection === "asc" ? result : -result;
        });
    }

    function updateSummary(filteredRows) {
        const topRow = [...filteredRows].sort((a, b) => b.timesAdded - a.timesAdded)[0];
        const highestRevenueRow = [...filteredRows].sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];
        const bestUpsellRow = [...filteredRows].sort((a, b) => b.averageRevenuePerSelection - a.averageRevenuePerSelection)[0];

        topAddon.textContent = topRow ? topRow.serviceName : "None";
        highestAddonRevenue.textContent = highestRevenueRow ? formatCurrency(highestRevenueRow.revenueGenerated) : "$0";
        bestUpsell.textContent = bestUpsellRow ? bestUpsellRow.serviceName : "None";

        const start = startDateInput.value ? new Date(startDateInput.value) : null;
        const end = endDateInput.value ? new Date(endDateInput.value) : null;
        const baseSelections = 173;

        if (start && end && end >= start) {
            const dayDiff = Math.floor((end - start) / 86400000) + 1;
            totalSelections.textContent = String(Math.max(16, Math.round((baseSelections / 18) * dayDiff)));
        } else {
            totalSelections.textContent = String(baseSelections);
        }
    }

    function render() {
        const filteredRows = getFilteredRows();
        const sortedRows = sortRows(filteredRows);

        addonsBody.innerHTML = "";

        sortedRows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.serviceName}</td>
                <td>${row.timesAdded}</td>
                <td>${row.percentOfOrders}%</td>
                <td>${formatCurrency(row.revenueGenerated)}</td>
                <td>${formatCurrency(row.averageRevenuePerSelection)}</td>
                <td><span class="${getTrendBadgeClass(row.trend)}">${row.trend}</span></td>
            `;
            addonsBody.appendChild(tr);
        });

        addonResults.textContent =
            sortedRows.length === addonRows.length
                ? `Showing all ${sortedRows.length} add-on services`
                : `Showing ${sortedRows.length} of ${addonRows.length} add-on services`;

        addonsEmpty.classList.toggle("hidden", sortedRows.length > 0);
        updateSummary(filteredRows);
        updateSortButtons();
    }

    addonSortButtons.forEach(button => {
        button.dataset.label = button.textContent;
        button.addEventListener("click", () => {
            const nextKey = button.dataset.sort;
            if (!nextKey) return;

            if (addonSortKey === nextKey) {
                addonSortDirection = addonSortDirection === "asc" ? "desc" : "asc";
            } else {
                addonSortKey = nextKey;
                addonSortDirection = nextKey === "serviceName" || nextKey === "trend" ? "asc" : "desc";
            }

            render();
        });
    });

    [searchInput, startDateInput, endDateInput, addonFilter].forEach(control => {
        control.addEventListener("input", render);
        control.addEventListener("change", render);
    });

    updateSortButtons();
    render();
});
