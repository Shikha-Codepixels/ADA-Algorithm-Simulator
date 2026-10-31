
const weightsInput = document.getElementById("weightsInput");
const valuesInput = document.getElementById("valuesInput");
const capacityInput = document.getElementById("capacityInput");

const visualizeBtn = document.getElementById("visualizeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");

const stepTitle = document.getElementById("stepTitle");
const stepNumber = document.getElementById("stepNumber");
const totalSteps = document.getElementById("totalSteps");

const dpTableContainer = document.getElementById("dpTableContainer");
const decisionInfo = document.getElementById("decisionInfo");
const knapsackInfo = document.getElementById("knapsackInfo");

const selectedItemsPanel = document.getElementById("selectedItemsPanel");

let steps = [];
let currentStep = 0;
let playInterval = null;

let weights = [];
let values = [];
let capacity = 0;

visualizeBtn.addEventListener("click", async function () {
    stopPlaying();

    weights = weightsInput.value
        .split(",")
        .map(value => value.trim())
        .filter(value => value !== "")
        .map(Number);

    values = valuesInput.value
        .split(",")
        .map(value => value.trim())
        .filter(value => value !== "")
        .map(Number);

    capacity = Number(capacityInput.value);

    if (
        weights.length === 0 ||
        weights.length !== values.length ||
        [...weights, ...values].some(value => !Number.isInteger(value)) ||
        weights.some(weight => weight < 0) ||
        values.some(value => value < 0) ||
        !Number.isInteger(capacity) ||
        capacity < 0
    ) {
        alert("Please enter valid weights, values and capacity.");
        return;
    }

    visualizeBtn.disabled = true;
    visualizeBtn.textContent = "Loading...";

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/knapsack",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    weights,
                    values,
                    capacity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to generate steps");
        }

        steps = data.steps;
        currentStep = 0;

        totalSteps.textContent = steps.length;

        knapsackInfo.innerHTML = `
            <span>Items: ${weights.length}</span>
            <span>Capacity: ${capacity}</span>
        `;

        updateControls();
        displayStep();

    } catch (error) {
        alert(error.message);
    } finally {
        visualizeBtn.disabled = false;
        visualizeBtn.textContent = "Visualize";
    }
});

function displayStep() {
    if (steps.length === 0) return;

    const step = steps[currentStep];

    stepNumber.textContent = currentStep + 1;

    if (step.decision === "base") {
        stepTitle.textContent =
            `Base Case · Item ${step.item}, Capacity ${step.capacity}`;

        decisionInfo.textContent =
            "Base case: when there are no items or capacity is zero, the maximum value is 0.";
    } else {
        stepTitle.textContent =
            `Item ${step.item} · Capacity ${step.capacity}`;

        if (step.includeValue === -1) {
            decisionInfo.textContent =
                `Item ${step.item} is too heavy for capacity ${step.capacity}. Exclude it. Value = ${step.value}.`;
        } else {
            decisionInfo.textContent =
                `Exclude value: ${step.excludeValue} | Include value: ${step.includeValue} | Decision: ${step.decision.toUpperCase()}.`;
        }
    }

    renderDPTable();

    if (currentStep === steps.length - 1) {
        renderSelectedItems();
        selectedItemsPanel.style.display = "block";
    } else {
        selectedItemsPanel.style.display = "none";
    }

    updateControls();
}

function renderDPTable() {
    const n = weights.length;

    let table = document.createElement("table");
    table.className = "knapsack-dp-table";

    let header = document.createElement("tr");

    let corner = document.createElement("th");
    corner.textContent = "Items / W";
    header.appendChild(corner);

    for (let w = 0; w <= capacity; w++) {
        let th = document.createElement("th");
        th.textContent = w;
        header.appendChild(th);
    }

    table.appendChild(header);

    for (let i = 0; i <= n; i++) {
        let row = document.createElement("tr");

        let label = document.createElement("th");
        label.textContent = i === 0 ? "0" : `Item ${i}`;
        row.appendChild(label);

        for (let w = 0; w <= capacity; w++) {
            let cell = document.createElement("td");

            const cellIndex = i * (capacity + 1) + w;
            const cellStep = steps[cellIndex];

            if (cellStep && cellIndex <= currentStep) {
                cell.textContent = cellStep.value;

                if (cellIndex === currentStep) {
                    cell.classList.add("current-cell");
                } else if (cellStep.decision === "include") {
                    cell.classList.add("include-cell");
                } else if (cellStep.decision === "exclude") {
                    cell.classList.add("exclude-cell");
                }
            } else {
                cell.textContent = "–";
                cell.classList.add("pending-cell");
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    dpTableContainer.innerHTML = "";
    dpTableContainer.appendChild(table);
}


function renderSelectedItems() {
    const n = weights.length;
    let w = capacity;

    const selectedItems = [];

    // Trace backwards through the DP table
    for (let i = n; i > 0; i--) {

        const currentIndex = i * (capacity + 1) + w;
        const previousIndex = (i - 1) * (capacity + 1) + w;

        const currentValue = steps[currentIndex].value;
        const previousValue = steps[previousIndex].value;

        // If values differ, this item was included
        if (currentValue !== previousValue) {

            selectedItems.push({
                item: i,
                weight: weights[i - 1],
                value: values[i - 1]
            });

            w -= weights[i - 1];
        }
    }

    selectedItems.reverse();

    const totalWeight = selectedItems.reduce(
        (sum, item) => sum + item.weight,
        0
    );

    const maxValue = steps[steps.length - 1].value;

    selectedItemsPanel.innerHTML = `
        <h3>Optimal Item Selection</h3>

        <div class="selected-items-list">
            ${
                selectedItems.length > 0
                ? selectedItems.map(item => `
                    <div class="selected-item">
                        <span>Item ${item.item}</span>
                        <span>Weight: ${item.weight}</span>
                        <span>Value: ${item.value}</span>
                    </div>
                `).join("")
                : "<p>No items selected.</p>"
            }
        </div>

        <div class="selection-summary">
            <div>
                <span>Total Weight</span>
                <strong>${totalWeight} / ${capacity}</strong>
            </div>

            <div>
                <span>Maximum Value</span>
                <strong>${maxValue}</strong>
            </div>
        </div>
    `;
}


function updateControls() {
    prevBtn.disabled = steps.length === 0 || currentStep === 0;
    nextBtn.disabled =
        steps.length === 0 || currentStep === steps.length - 1;

    playBtn.disabled = steps.length === 0;
    resetBtn.disabled = steps.length === 0;

    playBtn.textContent = playInterval ? "❚❚ Pause" : "▶ Play";
}

prevBtn.addEventListener("click", function () {
    stopPlaying();

    if (currentStep > 0) {
        currentStep--;
        displayStep();
    }
});

nextBtn.addEventListener("click", function () {
    stopPlaying();

    if (currentStep < steps.length - 1) {
        currentStep++;
        displayStep();
    }
});

playBtn.addEventListener("click", function () {
    if (playInterval) {
        stopPlaying();
        return;
    }

    if (currentStep === steps.length - 1) {
        currentStep = 0;
        displayStep();
    }

    playInterval = setInterval(function () {
        if (currentStep < steps.length - 1) {
            currentStep++;
            displayStep();
        } else {
            stopPlaying();
        }
    }, 700);

    updateControls();
});

resetBtn.addEventListener("click", function () {
    stopPlaying();
    currentStep = 0;
    displayStep();
});

function stopPlaying() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }

    updateControls();
}
