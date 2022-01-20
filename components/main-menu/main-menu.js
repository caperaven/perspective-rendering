class MainMenu extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(async () => {
            // 1. Get template and add to inflation manager
            const template = this.querySelector("template");
            crsbinding.inflationManager.register("menu-item", template);

            // 2. Get rout data array for processing
            let router = document.querySelector("crs-router");
            let routes = router.routesDef.routes.filter(item => item.view != "404");

            // 3. Build the UI from the array of routes
            await this.buildUI(routes);

            // 4. Clean the memory
            this.style.display = "block";
            routes = null;
            router = null;
            crsbinding.inflationManager.unregister("menu-item");
        })
    }

    async buildUI(routes) {
        let fragment = crsbinding.inflationManager.get("menu-item", routes);
        this.querySelector("ul").appendChild(fragment);
    }
}

customElements.define("main-menu", MainMenu);