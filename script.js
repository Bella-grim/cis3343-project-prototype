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

        document.getElementById("totalDogsText").textContent =
            totalDogs + " dogs today";

        let percent = totalDogs === 0 ? 0 : Math.round((completedDogs / totalDogs) * 100);

        document.getElementById("completionBar").style.width = percent + "%";

        document.getElementById("completionText").textContent =
            completedDogs + " / " + totalDogs + " completed";

        // =====================
        // GROOMER BARS
        // =====================

        Object.keys(groomers).forEach(name => {
            let total = groomers[name].total;
            let active = groomers[name].active;

            let percent = total === 0 ? 0 : Math.round((active / total) * 100);

            document.getElementById(name + "Load").style.width = percent + "%";
            document.getElementById(name + "LoadText").textContent = percent + "%";
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

        document.getElementById("revenueTotal").textContent = "$" + totalRevenue;

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

    // RUN ON LOAD
    countStatuses();
    updateCapacity();
    updateRevenue();

});