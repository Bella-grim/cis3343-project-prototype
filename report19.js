document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("report19-search");
    const startDateInput = document.getElementById("report19-start-date");
    const endDateInput = document.getElementById("report19-end-date");
    const packageFilter = document.getElementById("report19-package-filter");
    const topPackage = document.getElementById("report19-top-package");
    const highestPackageRevenue = document.getElementById("report19-highest-package-revenue");
    const risingPackage = document.getElementById("report19-rising-package");
    const totalOrders = document.getElementById("report19-total-orders");
    const packageResults = document.getElementById("report19-package-results");
    const packagesBody = document.getElementById("report19-packages-body");
    const packagesEmpty = document.getElementById("report19-packages-empty");
    const packageSortButtons = document.querySelectorAll(".report19-package-sort");

    if (
        !searchInput ||
        !startDateInput ||
        !endDateInput ||
        !packageFilter ||
        !topPackage ||
        !highestPackageRevenue ||
        !risingPackage ||
        !totalOrders ||
        !packageResults ||
        !packagesBody ||
        !packagesEmpty
    ) {
        return;
    }

    const packageRows = [
        { packageName: "Puppy Love", timesSelected: 12, percentOfOrders: 7, revenueGenerated: 660, commonServices: "Shampoo, brush, nail trim", trend: "Stable" },
        { packageName: "Puppy Trim Bath", timesSelected: 10, percentOfOrders: 5, revenueGenerated: 520, commonServices: "Bath, paw pads, sanitary trim", trend: "Up" },
        { packageName: "Puppy Bath", timesSelected: 14, percentOfOrders: 8, revenueGenerated: 630, commonServices: "Bath, ear cleaning, nail trim", trend: "Stable" },
        { packageName: "Senior Retreat", timesSelected: 8, percentOfOrders: 4, revenueGenerated: 760, commonServices: "Special handling, comfort care", trend: "Up" },
        { packageName: "Signature Groom (The Works)", timesSelected: 34, percentOfOrders: 18, revenueGenerated: 2720, commonServices: "Haircut, blow dry, ear cleaning", trend: "Up" },
        { packageName: "Glow Up Scissor Groom", timesSelected: 18, percentOfOrders: 10, revenueGenerated: 1710, commonServices: "Signature groom plus special styling", trend: "Up" },
        { packageName: "Bath and Blow Dry", timesSelected: 22, percentOfOrders: 12, revenueGenerated: 1210, commonServices: "Bath, blow dry, finishing spray", trend: "Stable" },
        { packageName: "Bath & Brush", timesSelected: 26, percentOfOrders: 14, revenueGenerated: 1430, commonServices: "Bath, brushing, nail trim", trend: "Up" },
        { packageName: "Mini Spaw", timesSelected: 16, percentOfOrders: 9, revenueGenerated: 1180, commonServices: "Bath, trim, paw pads, face tidy", trend: "Stable" },
        { packageName: "Shed-Control Bath", timesSelected: 11, percentOfOrders: 6, revenueGenerated: 880, commonServices: "Deshed shampoo, blow out, brushing", trend: "Up" },
        { packageName: "Double Coated & Long-Haired Shed Control Bath", timesSelected: 7, percentOfOrders: 4, revenueGenerated: 735, commonServices: "Shed control with extended drying", trend: "Stable" },
        { packageName: "Double Coated & Long-Haired Shed Control Bath & Tidy Combo", timesSelected: 6, percentOfOrders: 3, revenueGenerated: 720, commonServices: "Shed control plus tidy trim", trend: "Down" }
    ];

    let packageSortKey = "timesSelected";
    let packageSortDirection = "desc";

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
        packageSortButtons.forEach(button => {
            const isActive = button.dataset.sort === packageSortKey;
            button.classList.toggle("active", isActive);
            const label = button.dataset.label || button.textContent.replace(/[ ↑↓]/g, "");
            const arrow = isActive ? (packageSortDirection === "asc" ? " ↑" : " ↓") : "";
            button.textContent = `${label}${arrow}`;
        });
    }

    function getFilteredRows() {
        const query = searchInput.value.trim().toLowerCase();
        return packageRows.filter(row => {
            const matchesSearch =
                !query ||
                [row.packageName, row.commonServices, row.trend].some(value =>
                    value.toLowerCase().includes(query)
                );
            const matchesPackage =
                packageFilter.value === "all" || row.packageName === packageFilter.value;
            return matchesSearch && matchesPackage;
        });
    }

    function sortRows(rows) {
        return [...rows].sort((left, right) => {
            const result = compareValues(left[packageSortKey], right[packageSortKey]);
            return packageSortDirection === "asc" ? result : -result;
        });
    }

    function updateSummary(filteredRows) {
        const topRow = [...filteredRows].sort((a, b) => b.timesSelected - a.timesSelected)[0];
        const highestRevenueRow = [...filteredRows].sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];
        const risingRow = [...filteredRows].find(row => row.trend === "Up");

        topPackage.textContent = topRow ? topRow.packageName : "None";
        highestPackageRevenue.textContent = highestRevenueRow ? formatCurrency(highestRevenueRow.revenueGenerated) : "$0";
        risingPackage.textContent = risingRow ? risingRow.packageName : "None";

        const start = startDateInput.value ? new Date(startDateInput.value) : null;
        const end = endDateInput.value ? new Date(endDateInput.value) : null;
        const baseOrders = 184;

        if (start && end && end >= start) {
            const dayDiff = Math.floor((end - start) / 86400000) + 1;
            totalOrders.textContent = String(Math.max(18, Math.round((baseOrders / 18) * dayDiff)));
        } else {
            totalOrders.textContent = String(baseOrders);
        }
    }

    function render() {
        const filteredRows = getFilteredRows();
        const sortedRows = sortRows(filteredRows);

        packagesBody.innerHTML = "";

        sortedRows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.packageName}</td>
                <td>${row.timesSelected}</td>
                <td>${row.percentOfOrders}%</td>
                <td>${formatCurrency(row.revenueGenerated)}</td>
                <td>${row.commonServices}</td>
                <td><span class="${getTrendBadgeClass(row.trend)}">${row.trend}</span></td>
            `;
            packagesBody.appendChild(tr);
        });

        packageResults.textContent =
            sortedRows.length === packageRows.length
                ? `Showing all ${sortedRows.length} service packages`
                : `Showing ${sortedRows.length} of ${packageRows.length} service packages`;

        packagesEmpty.classList.toggle("hidden", sortedRows.length > 0);
        updateSummary(filteredRows);
        updateSortButtons();
    }

    packageSortButtons.forEach(button => {
        button.dataset.label = button.textContent;
        button.addEventListener("click", () => {
            const nextKey = button.dataset.sort;
            if (!nextKey) return;

            if (packageSortKey === nextKey) {
                packageSortDirection = packageSortDirection === "asc" ? "desc" : "asc";
            } else {
                packageSortKey = nextKey;
                packageSortDirection =
                    nextKey === "packageName" || nextKey === "commonServices" || nextKey === "trend"
                        ? "asc"
                        : "desc";
            }

            render();
        });
    });

    [searchInput, startDateInput, endDateInput, packageFilter].forEach(control => {
        control.addEventListener("input", render);
        control.addEventListener("change", render);
    });

    updateSortButtons();
    render();
});
