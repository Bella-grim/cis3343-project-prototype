document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("report-search-input");
    const filterButtons = document.querySelectorAll(".report-filter-pill");
    const reportGroups = document.querySelectorAll(".report-group");
    const reportsShell = document.querySelector(".reports-shell");

    if (!searchInput || filterButtons.length === 0 || reportGroups.length === 0 || !reportsShell) {
        return;
    }

    let activeFilter = "all";
    let emptyState = null;

    function getVisibleCards(group) {
        return Array.from(group.querySelectorAll(".report-card")).filter(card => !card.classList.contains("hidden"));
    }

    function ensureEmptyState() {
        if (!emptyState) {
            emptyState = document.createElement("div");
            emptyState.className = "reports-empty-state hidden";
            emptyState.innerHTML = `
                <h3>No matching reports</h3>
                <p>Try a different keyword or switch back to another report category.</p>
            `;
            reportsShell.appendChild(emptyState);
        }

        return emptyState;
    }

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        let anyVisible = false;

        reportGroups.forEach(group => {
            const groupCategory = group.dataset.category || "";
            const cards = group.querySelectorAll(".report-card");

            cards.forEach(card => {
                const searchText = (card.dataset.search || "").toLowerCase();
                const matchesCategory = activeFilter === "all" || groupCategory === activeFilter;
                const matchesSearch = !query || searchText.includes(query);

                card.classList.toggle("hidden", !(matchesCategory && matchesSearch));
            });

            const visibleCards = getVisibleCards(group);
            const countLabel = group.querySelector(".report-group-header span");

            if (countLabel) {
                countLabel.textContent = `${visibleCards.length} report${visibleCards.length === 1 ? "" : "s"}`;
            }

            const hasVisibleCards = visibleCards.length > 0;
            group.classList.toggle("hidden", !hasVisibleCards);

            if (hasVisibleCards) {
                anyVisible = true;
            }
        });

        const empty = ensureEmptyState();
        empty.classList.toggle("hidden", anyVisible);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter || "all";

            filterButtons.forEach(pill => {
                pill.classList.toggle("active", pill === button);
            });

            applyFilters();
        });
    });

    searchInput.addEventListener("input", applyFilters);

    applyFilters();
});
