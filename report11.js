document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("report11-search");
    const certificationFilter = document.getElementById("filter-certification");
    const skillFilter = document.getElementById("filter-skill");
    const tableBody = document.getElementById("report11-body");
    const emptyState = document.getElementById("report11-empty");
    const resultsCopy = document.getElementById("report11-results-copy");
    const sortButtons = document.querySelectorAll(".sort-button");

    const form = document.getElementById("report11-form");
    const formTitle = document.getElementById("report11-form-title");
    const formToggle = document.getElementById("report11-form-toggle");
    const formPanel = document.getElementById("report11-form-panel");
    const recordIdInput = document.getElementById("record-id");
    const groomerInput = document.getElementById("form-groomer");
    const skillInput = document.getElementById("form-skill");
    const certificationInput = document.getElementById("form-certification");
    const authorizedInput = document.getElementById("form-authorized");
    const evaluatedByInput = document.getElementById("form-evaluated-by");
    const evaluationDateInput = document.getElementById("form-evaluation-date");
    const notesInput = document.getElementById("form-notes");
    const resetButton = document.getElementById("report11-reset");
    const submitButton = document.getElementById("report11-submit");

    if (
        !searchInput ||
        !certificationFilter ||
        !skillFilter ||
        !tableBody ||
        !emptyState ||
        !resultsCopy ||
        !form ||
        !formTitle ||
        !formToggle ||
        !formPanel ||
        !recordIdInput ||
        !groomerInput ||
        !skillInput ||
        !certificationInput ||
        !authorizedInput ||
        !evaluatedByInput ||
        !evaluationDateInput ||
        !notesInput ||
        !resetButton ||
        !submitButton
    ) {
        return;
    }

    const rows = [
        {
            recordId: 1,
            name: "Jane Doe",
            skill: "Shampoo & Conditioner",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-12",
            notes: "Strong on puppy baths but still being reviewed for higher-volume bath days."
        },
        {
            recordId: 2,
            name: "Jane Doe",
            skill: "Blow Dry",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-13",
            notes: "Can assist with hand drying and finishing under supervision."
        },
        {
            recordId: 3,
            name: "Jane Doe",
            skill: "Standard Brushing",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-11",
            notes: "Cleared for standard brushing on routine bath packages."
        },
        {
            recordId: 4,
            name: "Jane Doe",
            skill: "Before/After Pet Photography",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-10",
            notes: "Required photo documentation completed correctly."
        },
        {
            recordId: 5,
            name: "Jane Doe",
            skill: "Ear Cleaning",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-10",
            notes: "Approved for routine ear cleaning during puppy and bath packages."
        },
        {
            recordId: 6,
            name: "Jane Doe",
            skill: "Face Tidy / Sanitary Trim",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-15",
            notes: "May complete light tidy work while Amanda checks finish quality."
        },
        {
            recordId: 7,
            name: "Jane Doe",
            skill: "Paw Pad Trim",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-09",
            notes: "Comfortable performing paw pad clean-up on puppy trims."
        },
        {
            recordId: 8,
            name: "Jane Doe",
            skill: "Haircut & Styling",
            certification: "Not Certified",
            authorized: "No",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-12",
            notes: "Not assigned to scissor or breed styling packages yet."
        },
        {
            recordId: 9,
            name: "Jane Doe",
            skill: "Teeth Brushing",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-08",
            notes: "Can independently perform standard add-on teeth brushing."
        },
        {
            recordId: 10,
            name: "John Doe",
            skill: "Shampoo & Conditioner",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-07",
            notes: "Approved for core bath prep on signature and bath packages."
        },
        {
            recordId: 11,
            name: "John Doe",
            skill: "Blow Dry",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-07",
            notes: "Handles standard blow dry work well on short and medium coats."
        },
        {
            recordId: 12,
            name: "John Doe",
            skill: "Standard Brushing",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-14",
            notes: "Still building speed on longer brushing workflows."
        },
        {
            recordId: 13,
            name: "John Doe",
            skill: "Nail Trimming",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-14",
            notes: "May assist while Amanda supervises handling."
        },
        {
            recordId: 14,
            name: "John Doe",
            skill: "Ear Cleaning",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-08",
            notes: "Approved for routine ear cleaning tasks."
        },
        {
            recordId: 15,
            name: "John Doe",
            skill: "Face Tidy / Sanitary Trim",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-09",
            notes: "Can complete mini-spaw tidy work and sanitary clean-up."
        },
        {
            recordId: 16,
            name: "John Doe",
            skill: "Paw Pad Trim",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-09",
            notes: "Consistent on paw pad trims and rounded foot clean-up."
        },
        {
            recordId: 17,
            name: "John Doe",
            skill: "Teeth Brushing",
            certification: "Not Certified",
            authorized: "No",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-14",
            notes: "Needs more training before assignment."
        },
        {
            recordId: 18,
            name: "John Doe",
            skill: "Deshed Treatment",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-16",
            notes: "Can assist with deshed baths but not assigned heavy coat blowouts alone."
        },
        {
            recordId: 19,
            name: "John Doe",
            skill: "Dematting",
            certification: "Not Certified",
            authorized: "No",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-16",
            notes: "Not cleared for dematting services or special coat recovery cases."
        },
        {
            recordId: 20,
            name: "John Doe",
            skill: "Extra Handling",
            certification: "In Progress",
            authorized: "Supervised Only",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-15",
            notes: "May support senior or anxious dogs with Amanda leading the appointment."
        },
        {
            recordId: 21,
            name: "John Doe",
            skill: "Before/After Pet Photography",
            certification: "Certified",
            authorized: "Yes",
            evaluatedBy: "Amanda",
            evaluationDate: "2026-03-08",
            notes: "Meets the required before and after photo documentation policy."
        }
    ];

    let nextRecordId = rows.length + 1;
    let sortKey = "name";
    let sortDirection = "asc";

    function getBadgeClass(value) {
        return value.toLowerCase().replace(/\s+/g, "-");
    }

    function formatDateForDisplay(value) {
        if (!value) return "";

        const [year, month, day] = value.split("-");
        return `${month}/${day}/${year}`;
    }

    function resetForm() {
        recordIdInput.value = "";
        form.reset();
        formTitle.textContent = "Add Skill Record";
        submitButton.textContent = "Save Skill Record";
    }

    function setFormOpen(isOpen) {
        formPanel.classList.toggle("hidden", !isOpen);
        formToggle.setAttribute("aria-expanded", String(isOpen));
        formToggle.textContent = isOpen ? "− Hide Skill Form" : "+ Add Skill Record";
    }

    function syncAuthorizedWithCertification() {
        if (certificationInput.value === "Certified" && !authorizedInput.value) {
            authorizedInput.value = "Yes";
        } else if (certificationInput.value === "In Progress" && !authorizedInput.value) {
            authorizedInput.value = "Supervised Only";
        } else if (certificationInput.value === "Not Certified" && !authorizedInput.value) {
            authorizedInput.value = "No";
        }
    }

    function updateSortButtons() {
        sortButtons.forEach(button => {
            const isActive = button.dataset.sort === sortKey;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-sort", isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none");

            const arrow = !isActive ? "" : sortDirection === "asc" ? " ↑" : " ↓";
            button.textContent = `${button.dataset.label || button.textContent.replace(/[ ↑↓]/g, "")}${arrow}`;
        });
    }

    function compareValues(a, b) {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    }

    function getFilteredRows() {
        const query = searchInput.value.trim().toLowerCase();

        return rows.filter(row => {
            const matchesQuery = !query || [row.name, row.skill, row.notes].some(value =>
                value.toLowerCase().includes(query)
            );
            const matchesCertification = certificationFilter.value === "all" || row.certification === certificationFilter.value;
            const matchesSkill = skillFilter.value === "all" || row.skill === skillFilter.value;

            return matchesQuery && matchesCertification && matchesSkill;
        });
    }

    function getSortedRows(filteredRows) {
        return [...filteredRows].sort((left, right) => {
            const leftValue = sortKey === "evaluationDate" ? formatDateForDisplay(left[sortKey]) : String(left[sortKey] || "");
            const rightValue = sortKey === "evaluationDate" ? formatDateForDisplay(right[sortKey]) : String(right[sortKey] || "");
            const result = compareValues(leftValue, rightValue);
            return sortDirection === "asc" ? result : -result;
        });
    }

    function renderTable() {
        const filteredRows = getFilteredRows();
        const sortedRows = getSortedRows(filteredRows);

        tableBody.innerHTML = "";

        sortedRows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.skill}</td>
                <td><span class="status-badge ${getBadgeClass(row.certification)}">${row.certification}</span></td>
                <td><span class="status-badge ${getBadgeClass(row.authorized)}">${row.authorized}</span></td>
                <td>${row.evaluatedBy}</td>
                <td>${formatDateForDisplay(row.evaluationDate)}</td>
                <td>${row.notes}</td>
                <td>
                    <div class="report11-row-actions">
                        <button type="button" class="secondary-button report11-action-button" data-action="edit" data-record-id="${row.recordId}">Edit</button>
                        <button type="button" class="secondary-button secondary-button-muted report11-action-button" data-action="delete" data-record-id="${row.recordId}">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        if (sortedRows.length === rows.length) {
            resultsCopy.textContent = `Showing all ${sortedRows.length} skill records`;
        } else {
            resultsCopy.textContent = `Showing ${sortedRows.length} of ${rows.length} skill records`;
        }

        emptyState.classList.toggle("hidden", sortedRows.length > 0);
        updateSortButtons();
    }

    function loadRecordIntoForm(recordId) {
        const record = rows.find(row => row.recordId === recordId);
        if (!record) return;

        recordIdInput.value = String(record.recordId);
        groomerInput.value = record.name;
        skillInput.value = record.skill;
        certificationInput.value = record.certification;
        authorizedInput.value = record.authorized;
        evaluatedByInput.value = record.evaluatedBy;
        evaluationDateInput.value = record.evaluationDate;
        notesInput.value = record.notes;
        formTitle.textContent = "Edit Skill Record";
        submitButton.textContent = "Update Skill Record";
        setFormOpen(true);
        form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function deleteRecord(recordId) {
        const index = rows.findIndex(row => row.recordId === recordId);
        if (index === -1) return;

        const record = rows[index];
        const shouldDelete = window.confirm(`Delete ${record.name}'s ${record.skill} record?`);
        if (!shouldDelete) return;

        rows.splice(index, 1);

        if (recordIdInput.value === String(recordId)) {
            resetForm();
        }

        renderTable();
    }

    sortButtons.forEach(button => {
        button.dataset.label = button.textContent;
    });

    sortButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nextKey = button.dataset.sort;
            if (!nextKey) return;

            if (sortKey === nextKey) {
                sortDirection = sortDirection === "asc" ? "desc" : "asc";
            } else {
                sortKey = nextKey;
                sortDirection = "asc";
            }

            renderTable();
        });
    });

    [searchInput, certificationFilter, skillFilter].forEach(control => {
        control.addEventListener("input", renderTable);
        control.addEventListener("change", renderTable);
    });

    certificationInput.addEventListener("change", () => {
        authorizedInput.value = "";
        syncAuthorizedWithCertification();
    });

    formToggle.addEventListener("click", () => {
        const isOpen = formToggle.getAttribute("aria-expanded") === "true";
        setFormOpen(!isOpen);
    });

    resetButton.addEventListener("click", resetForm);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const record = {
            name: groomerInput.value,
            skill: skillInput.value,
            certification: certificationInput.value,
            authorized: authorizedInput.value,
            evaluatedBy: evaluatedByInput.value,
            evaluationDate: evaluationDateInput.value,
            notes: notesInput.value.trim()
        };

        if (recordIdInput.value) {
            const existingRecord = rows.find(row => row.recordId === Number(recordIdInput.value));
            if (existingRecord) {
                Object.assign(existingRecord, record);
            }
        } else {
            rows.unshift({
                recordId: nextRecordId++,
                ...record
            });
        }

        resetForm();
        setFormOpen(false);
        renderTable();
    });

    tableBody.addEventListener("click", event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const actionButton = target.closest("[data-action]");
        if (!(actionButton instanceof HTMLElement)) return;

        const recordId = Number(actionButton.dataset.recordId);
        if (!recordId) return;

        if (actionButton.dataset.action === "edit") {
            loadRecordIntoForm(recordId);
        }

        if (actionButton.dataset.action === "delete") {
            deleteRecord(recordId);
        }
    });

    updateSortButtons();
    resetForm();
    setFormOpen(false);
    renderTable();
});
