let steps = [];
let currentStep = 0;
let playing = false;
let playInterval = null;


let mergeTree = null;

function createTreeNode(label, values) {
    return {
        label: label,
        values: [...values],
        children: [],
        divideStep: -1,
        mergeStep: -1
    };
}

function buildMergeTree(steps) {

    const divideSteps = steps
        .map((step, index) => ({ ...step, index }))
        .filter(step => step.type === "divide");

    const mergeSteps = steps
        .map((step, index) => ({ ...step, index }))
        .filter(step => step.type === "merge");

    if (divideSteps.length === 0) return null;

    const root = createTreeNode(
        "Main Array",
        [
            ...divideSteps[0].left,
            ...divideSteps[0].right
        ]
    );

    root.path = [];
    root.createdAt = -1;
    root.divideStep = 0;
    root.mergeStep = -1;

    // Locate a node using its Left/Right path
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

    // Construct the complete tree structure
    divideSteps.forEach(step => {

        let location = step.description
            .replace("Dividing ", "")
            .replace(/ of main array$/, "");

        const path = location.toLowerCase() === "main array"
            ? []
            : location.split(" of ").reverse();

        const targetNode = findNode(path);

        if (!targetNode || targetNode.children.length > 0) {
            return;
        }

        targetNode.divideStep = step.index;

        targetNode.children = [
            createTreeNode("Left", step.left),
            createTreeNode("Right", step.right)
        ];

        targetNode.children.forEach((child, index) => {

            child.path = [
                ...path,
                index === 0 ? "Left" : "Right"
            ];

            child.createdAt = step.index;
            child.divideStep = -1;
            child.mergeStep = -1;

        });
    });

    // Collect internal nodes in merge order
    const mergeOrder = [];

    function collectPostorder(node) {

        node.children.forEach(collectPostorder);

        if (node.children.length > 0) {
            mergeOrder.push(node);
        }
    }

    collectPostorder(root);

    // Associate merge steps with their parent nodes
    mergeOrder.forEach((node, index) => {

        if (!mergeSteps[index]) return;

        node.mergeStep = mergeSteps[index].index;
        node.mergedValues = mergeSteps[index].result;

    });

    return root;
}

function renderMergeTree(node, container, stepIndex) {

    if (!node) return;

    const nodeElement = document.createElement("div");
    nodeElement.className = "merge-tree-node";

    const nodeBox = document.createElement("div");
    nodeBox.className = "merge-tree-node-box";

    // Has this node completed merging?
    const isMerged =
        node.mergeStep !== -1 &&
        stepIndex >= node.mergeStep;

    const isActive =
        node.mergeStep === stepIndex;

    if (isMerged) {
        nodeBox.classList.add("merged");
    }

    if (isActive) {
        nodeBox.classList.add("active-merge");
    }

    const label = document.createElement("span");
    label.className = "merge-tree-label";
    label.textContent = node.label;

    const values = document.createElement("strong");
    values.className = "merge-tree-values";

    const displayedValues = isMerged
        ? node.mergedValues
        : node.values;

    values.textContent = `[${displayedValues.join(", ")}]`;

    nodeBox.appendChild(label);
    nodeBox.appendChild(values);

    nodeElement.appendChild(nodeBox);
    container.appendChild(nodeElement);

    // Only show children whose division has happened
    const visibleChildren = node.children.filter(
        child => child.createdAt <= stepIndex
    );

    if (visibleChildren.length === 0) return;

    const childrenContainer = document.createElement("div");
    childrenContainer.className = "merge-tree-children";

    visibleChildren.forEach(child => {

        const childContainer = document.createElement("div");
        childContainer.className = "merge-tree-child";

        renderMergeTree(
            child,
            childContainer,
            stepIndex
        );

        childrenContainer.appendChild(childContainer);
    });

    nodeElement.appendChild(childrenContainer);
}

function updateTreeView() {

    if (!mergeTree) return;

    treeView.innerHTML = "";

    const canvas = document.createElement("div");
    canvas.className = "merge-tree-canvas";

    renderMergeTree(
        mergeTree,
        canvas,
        currentStep
    );

    treeView.appendChild(canvas);
}


const arrayInput =
    document.getElementById("arrayInput");

const visualizeBtn =
    document.getElementById("visualizeBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const playBtn =
    document.getElementById("playBtn");

const resetBtn =
    document.getElementById("resetBtn");

const arrayVisualization =
    document.getElementById("arrayVisualization");

const stepTitle =
    document.getElementById("stepTitle");

const stepNumber =
    document.getElementById("stepNumber");

const totalSteps =
    document.getElementById("totalSteps");

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


visualizeBtn.addEventListener(
    "click",
    async function () {

        const input =
            arrayInput.value.trim();


        if (!input) {

            alert("Please enter some numbers.");

            return;
        }


        const array =
            input
                .split(",")
                .map(value => Number(value.trim()));


        if (
            array.length === 0 ||
            array.some(Number.isNaN)
        ) {

            alert("Please enter valid numbers.");

            return;
        }


        visualizeBtn.disabled = true;

        visualizeBtn.textContent =
            "Loading...";


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:5000/api/merge-sort",
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
                    "Something went wrong"
                );
            }


            steps = data.steps;

            currentStep = 0;

            mergeTree = buildMergeTree(steps);

            displayStep();


            previousBtn.disabled = true;

            nextBtn.disabled =
                steps.length <= 1;

            playBtn.disabled =
                steps.length <= 1;

            resetBtn.disabled = false;


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

arrayViewBtn.addEventListener("click", function () {

    arrayView.classList.remove("hidden");
    treeView.classList.add("hidden");

    arrayViewBtn.classList.add("active");
    treeViewBtn.classList.remove("active");

});


treeViewBtn.addEventListener("click", function () {

    treeView.classList.remove("hidden");
    updateTreeView();
    arrayView.classList.add("hidden");

    treeViewBtn.classList.add("active");
    arrayViewBtn.classList.remove("active");

});

function createArray(values, label) {

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


        block.className =
            "array-block";


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

    let location = description
        .replace("Dividing ", "")
        .replace(/ of main array$/, "");


    const main = document.createElement("span");

    main.className = "path-item";
    main.textContent = "Main Array";

    pathContent.appendChild(main);

    if(location.toLowerCase() === "main array"){
        return;
    }

    const path = location.split(" of ").reverse();

    path.forEach(part => {

        const arrow = document.createElement("span");

        arrow.className = "path-arrow";
        arrow.textContent = "→";

        pathContent.appendChild(arrow);


        const item = document.createElement("span");

        item.className = "path-item";

        item.textContent =
            part.charAt(0).toUpperCase() +
            part.slice(1);

        pathContent.appendChild(item);

    });
}


function displayStep() {

    if (steps.length === 0)
        return;


    const step =
        steps[currentStep];


    arrayVisualization.innerHTML =
        "";


    if (step.type === "divide") {

        stepTitle.textContent =
            step.description;

        updateRecursionPath(
            step.description 
        );

        createArray(
            step.left,
            "Left"
        );


        createArray(
            step.right,
            "Right"
        );

    }


    else if (step.type === "merge") {

        stepTitle.textContent =
            "Merging sorted arrays";

        pathContent.innerHTML = "";

        const main =
            document.createElement("span");
        
        main.className = "path-item";
        main.textContent = "Merging";

        pathContent.appendChild(main);

        createArray(
            step.result,
            "Merged"
        );

    }


    stepNumber.textContent =
        currentStep + 1;


    totalSteps.textContent =
        steps.length;


    updateControls();
    updateTreeView();
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


previousBtn.addEventListener(
    "click",
    function () {

        if (currentStep > 0) {

            currentStep--;

            displayStep();

        }

    }
);


resetBtn.addEventListener(
    "click",
    function () {

        stopPlaying();

        currentStep = 0;

        displayStep();

    }
);


playBtn.addEventListener(
    "click",
    function () {

        if (playing) {

            stopPlaying();

        } else {

            startPlaying();

        }

    }
);


function startPlaying() {

    playing = true;

    playBtn.textContent =
        "⏸ Pause";


    playInterval =
        setInterval(
            function () {

                if (
                    currentStep <
                    steps.length - 1
                ) {

                    currentStep++;

                    displayStep();

                } else {

                    stopPlaying();

                }

            },
            1000
        );
}


function stopPlaying() {

    playing = false;

    playBtn.textContent =
        "▶ Play";


    clearInterval(
        playInterval
    );
}


function updateControls() {

    previousBtn.disabled =
        currentStep === 0;


    nextBtn.disabled =
        currentStep >=
        steps.length - 1;

}