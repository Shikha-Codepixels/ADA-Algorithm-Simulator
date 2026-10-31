const arrayInput =
    document.getElementById("arrayInput");

const visualizeBtn =
    document.getElementById("visualizeBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const playBtn =
    document.getElementById("playBtn");

const resetBtn =
    document.getElementById("resetBtn");

const stepTitle =
    document.getElementById("stepTitle");

const stepNumber =
    document.getElementById("stepNumber");

const totalSteps =
    document.getElementById("totalSteps");

const arrayVisualization =
    document.getElementById("arrayVisualization");

const pathContent =
    document.getElementById("pathContent");

const arrayViewBtn =
    document.getElementById("arrayViewBtn");

const treeViewBtn =
    document.getElementById("treeViewBtn");

const arrayView =
    document.getElementById("arrayVisualization");

const treeView =
    document.getElementById("treeVisualization");


let steps = [];

let currentStep = 0;

let playInterval = null;

let quickSortTree = null;

visualizeBtn.addEventListener(
    "click",
    async function () {

        const input =
            arrayInput.value.trim();

        if (!input) {

            alert("Please enter an array.");

            return;
        }


        const array =
            input
                .split(",")
                .map(value => Number(value.trim()));


        if (
            array.length === 0 ||
            array.some(
                value => Number.isNaN(value)
            )
        ) {

            alert(
                "Please enter valid numbers separated by commas."
            );

            return;
        }


        visualizeBtn.disabled = true;

        visualizeBtn.textContent =
            "Loading...";


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/api/quick-sort",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            array: array
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Backend error"
                );
            }


            steps = data.steps;

            currentStep = 0;

            quickSortTree = buildQuickSortTree(steps);
            quickSortTree.values = [...array];


            if (steps.length === 0) {

                throw new Error(
                    "No steps returned from C++."
                );
            }


            displayStep();

            updateControls();

        }

        catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend.\n\n" +
                error.message
            );

        }

        finally {

            visualizeBtn.disabled = false;

            visualizeBtn.textContent =
                "Visualize";
        }

    }
);



function displayStep() {

    if (steps.length === 0)
        return;


    const step =
        steps[currentStep];


    arrayVisualization.innerHTML =
        "";


    if (step.type === "partition") {

        let title = step.description
        .replace("Partitioning ", "")
        .replace(" of main array", "");

        let parts = title.split(" of ").reverse();

        if (parts.length === 0) {
            stepTitle.textContent = "Partitioning";
        } else if (parts.length === 1) {
            stepTitle.textContent =
                "Partitioning: " +
                parts[0].charAt(0).toUpperCase() +
                parts[0].slice(1);
        } else {
            stepTitle.textContent =
                "Partitioning: " +
                parts
                    .map(part =>
                        part.charAt(0).toUpperCase() +
                        part.slice(1)
                    )
                    .join(" → ");
        }


        updateRecursionPath(
            step.description
        );


        createArray(
            step.left,
            "Left"
        );

        createArray(
            [step.pivot],
            `Pivot · Position ${step.pivotIndex + 1}`,
            "pivot-block"
        );

        createArray(
            step.right,
            "Right"
        );

    }

    
    else if (step.type === "base") {

        let title = step.description
            .replace("Base case: ", "")
            .replace(" contains one element", "");

        let parts = title.split(" of ").reverse();

        stepTitle.textContent =
            "Base case: " +
            parts
                .map(part =>
                    part.charAt(0).toUpperCase() +
                    part.slice(1)
                )
                .join(" → ");

        updateRecursionPath(
            step.description
        );

        createArray(
            [step.pivot],
            "Single Element"
        );
    }

    else if (step.type === "sorted") {

        stepTitle.textContent =
            "Quick Sort completed";


        pathContent.innerHTML =
            "";


        const completed =
            document.createElement("span");


        completed.className =
            "path-item";


        completed.textContent =
            "Final Sorted Array";


        pathContent.appendChild(
            completed
        );


        createArray(
            step.result,
            "Sorted"
        );

    }


    stepNumber.textContent =
        currentStep + 1;


    totalSteps.textContent =
        steps.length;


    updateControls();
    updateQuickSortTree();
}


function createArray(
    values,
    label,
    extraClass = ""
) {

    const group =
        document.createElement("div");


    group.className =
        "array-group";


    const groupLabel =
        document.createElement("span");


    groupLabel.className =
        "array-label";


    groupLabel.textContent =
        label;


    const container =
        document.createElement("div");


    container.className =
        "array-container";


    values.forEach(value => {

        const block =
            document.createElement("div");


        block.className = `array-block ${extraClass}`;


        block.textContent =
            value;


        container.appendChild(block);

    });


    group.appendChild(groupLabel);

    group.appendChild(container);


    arrayVisualization.appendChild(group);
}


function updateRecursionPath(description) {

    pathContent.innerHTML = "";

    const main = document.createElement("span");

    main.className = "path-item";

    main.textContent = "Main Array";

    pathContent.appendChild(main);


    let path = "";


    if (description.startsWith("Partitioning ")) {

        path = description.replace(
            "Partitioning ",
            ""
        );

    }

    else if (description.startsWith("Base case: ")) {

        path = description.replace(
            "Base case: ",
            ""
        );

        path = path.split(" contains")[0];

    }


    if (!path || path.toLowerCase().trim() === "main array"){
        return;
    }


    const parts = path
        .replace(/ of main array/gi, "")
        .split(" of ")
        .reverse();


    parts.forEach(part => {

        const arrow =
            document.createElement("span");

        arrow.className =
            "path-arrow";

        arrow.textContent =
            "→";

        pathContent.appendChild(arrow);


        const item =
            document.createElement("span");

        item.className =
            "path-item";


        item.textContent =
            part.charAt(0).toUpperCase() +
            part.slice(1);


        pathContent.appendChild(item);

    });
}


function buildQuickSortTree(steps) {

    const root = {
        label: "Main Array",
        values: [],
        pivot: null,
        pivotIndex: -1,
        partitionStep: -1,
        baseStep: -1,
        createdAt: -1,
        children: []
    };

    function getPath(description) {

        let path = description
            .replace("Partitioning ", "")
            .replace("Base case: ", "")
            .replace(" contains one element", "")
            .replace(/ of main array$/i, "");

        if (path.toLowerCase() === "main array") {
            return [];
        }

        return path.split(" of ").reverse();
    }

    function findNode(path) {

        let current = root;

        for (const part of path) {

            current = current.children.find(
                child => child.label === part
            );

            if (!current) return null;
        }

        return current;
    }

    steps.forEach((step, index) => {

        if (step.type === "partition") {

            const path = getPath(step.description);
            const node = findNode(path);

            if (!node) return;

            node.partitionStep = index;
            node.pivot = step.pivot;
            node.pivotIndex = step.pivotIndex;

            node.children = [];

            if (step.left.length > 0) {

                node.children.push({
                    label: "Left",
                    values: [...step.left],
                    pivot: null,
                    pivotIndex: -1,
                    partitionStep: -1,
                    baseStep: -1,
                    createdAt: index,
                    children: []
                });
            }

            if (step.right.length > 0) {

                node.children.push({
                    label: "Right",
                    values: [...step.right],
                    pivot: null,
                    pivotIndex: -1,
                    partitionStep: -1,
                    baseStep: -1,
                    createdAt: index,
                    children: []
                });
            }
        }

        else if (step.type === "base") {

            const path = getPath(step.description);
            const node = findNode(path);

            if (!node) return;

            node.baseStep = index;
            node.values = [step.pivot];
            node.pivot = step.pivot;
            node.pivotIndex = step.pivotIndex;
        }
    });

    return root;
}


function renderQuickSortTree(node, container, stepIndex) {

    if (!node) return;

    const nodeElement = document.createElement("div");
    nodeElement.className = "quick-tree-node";

    const nodeBox = document.createElement("div");
    nodeBox.className = "quick-tree-node-box";

    const isPartitioned =
        node.partitionStep !== -1 &&
        stepIndex >= node.partitionStep;

    const isActive =
        node.partitionStep === stepIndex;

    const isBaseCase =
        node.baseStep !== -1 &&
        stepIndex >= node.baseStep;

    if (isPartitioned) {
        nodeBox.classList.add("partitioned");
    }

    if (isActive) {
        nodeBox.classList.add("active-pivot");
    }

    if (isBaseCase) {
        nodeBox.classList.add("base-case");
    }

    const label = document.createElement("span");
    label.className = "quick-tree-label";
    label.textContent = node.label;

    const values = document.createElement("strong");
    values.className = "quick-tree-values";
    values.textContent = `[${node.values.join(", ")}]`;

    nodeBox.appendChild(label);
    nodeBox.appendChild(values);

    if (isPartitioned) {

        const pivotInfo = document.createElement("span");
        pivotInfo.className = "quick-tree-pivot";

        pivotInfo.textContent =
            `Pivot: ${node.pivot} · Position: ${node.pivotIndex + 1}`;

        nodeBox.appendChild(pivotInfo);
    }

    if (isBaseCase) {

        const baseLabel = document.createElement("span");
        baseLabel.className = "quick-tree-base-label";
        baseLabel.textContent = "BASE CASE";

        nodeBox.appendChild(baseLabel);
    }

    nodeElement.appendChild(nodeBox);
    container.appendChild(nodeElement);

    const visibleChildren = node.children.filter(
        child => child.createdAt <= stepIndex
    );

    if (visibleChildren.length === 0) return;

    const childrenContainer = document.createElement("div");
    childrenContainer.className = "quick-tree-children";

    visibleChildren.forEach(child => {

        const childContainer = document.createElement("div");
        childContainer.className = "quick-tree-child";

        renderQuickSortTree(
            child,
            childContainer,
            stepIndex
        );

        childrenContainer.appendChild(childContainer);
    });

    nodeElement.appendChild(childrenContainer);
}


function updateQuickSortTree() {

    if (!quickSortTree) return;

    treeView.innerHTML = "";

    const canvas = document.createElement("div");
    canvas.className = "quick-tree-canvas";

    renderQuickSortTree(
        quickSortTree,
        canvas,
        currentStep
    );

    treeView.appendChild(canvas);
}


nextBtn.addEventListener(
    "click",
    function () {

        if (
            currentStep <
            steps.length - 1
        ) {

            currentStep++;

            displayStep();

        }

    }
);


prevBtn.addEventListener(
    "click",
    function () {

        if (currentStep > 0) {

            currentStep--;

            displayStep();

        }

    }
);


playBtn.addEventListener(
    "click",
    function () {

        if (steps.length === 0)
            return;


        if (playInterval) {

            clearInterval(
                playInterval
            );

            playInterval = null;

            playBtn.textContent =
                "▶ Play";

            return;
        }


        playBtn.textContent =
            "Ⅱ Pause";


        playInterval =
            setInterval(
                function () {

                    if (
                        currentStep >=
                        steps.length - 1
                    ) {

                        clearInterval(
                            playInterval
                        );

                        playInterval =
                            null;

                        playBtn.textContent =
                            "▶ Play";

                        return;
                    }


                    currentStep++;

                    displayStep();

                },
                1200
            );

    }
);


resetBtn.addEventListener(
    "click",
    function () {

        if (playInterval) {

            clearInterval(
                playInterval
            );

            playInterval = null;
        }


        currentStep = 0;


        if (steps.length > 0) {

            displayStep();

        }


        playBtn.textContent =
            "▶ Play";

    }
);


function updateControls() {

    prevBtn.disabled =
        currentStep === 0;


    nextBtn.disabled =
        currentStep >=
        steps.length - 1;


    playBtn.disabled =
        steps.length === 0;


    resetBtn.disabled =
        steps.length === 0;
}

// Switch to Array View
arrayViewBtn.addEventListener("click", function () {

    arrayView.style.display = "flex";
    treeView.style.display = "none";

    arrayViewBtn.classList.add("active");
    treeViewBtn.classList.remove("active");
});


// Switch to Tree View
treeViewBtn.addEventListener("click", function () {

    arrayView.style.display = "none";
    treeView.style.display = "block";

    treeViewBtn.classList.add("active");
    arrayViewBtn.classList.remove("active");

    updateQuickSortTree();
});