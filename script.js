const dropdowns = document.querySelectorAll(".status-dropdown");

// INITIAL DATA
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

const chart = new Chart(ctx, {
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
    }
});

// UPDATE CHART
function updateChart() {
    chart.data.datasets[0].data = [
        counts.scheduled,
        counts.inprogress,
        counts.ready,
        counts.completed,
        counts.cancelled
    ];
    chart.update();
}

// LISTEN FOR CHANGES
dropdowns.forEach(dropdown => {
    dropdown.addEventListener("change", countStatuses);
});

// RUN ON LOAD
countStatuses();