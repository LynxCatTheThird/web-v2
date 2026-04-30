(function() {
    window.renderers.push(() => {
        let background = document.getElementById("home-background");
        if (!background) return;
        let images = background.dataset.images.split(",");
        let id = Math.floor(Math.random() * images.length);
        background.style.backgroundImage = `url('${images[id]}')`;
        
        let menu = document.getElementById("menu");
        if (menu) menu.classList.add("menu-color");

        let homeInfo = document.getElementById("home-info");
        if (homeInfo) {
            homeInfo.addEventListener("click", () => {
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            });
        }
    });
})();
