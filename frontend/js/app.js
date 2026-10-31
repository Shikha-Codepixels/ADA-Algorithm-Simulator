function openAlgorithm(algorithm) {
    if(algorithm == "merge-sort"){
        window.location.href = "merge-sort.html";
    }
}

const exploreButton = document.getElementById("exploreBtn");
exploreButton.addEventListener("click", function(){
    document 
        .getElementById("algorithms")
        .scrollIntoView({
            behavior: "smooth"
        });
});
