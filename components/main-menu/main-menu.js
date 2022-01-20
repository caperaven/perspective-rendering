class MainMenu extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(async () => {
            const template = this.querySelector("template");
            crsbinding.inflationManager.register("menu-item", template);

            let router = document.querySelector("crs-router");
            let routes = router.routesDef.routes.filter(item => item.view != "404");

            await this.buildUI(routes);

            this.style.display = "block";
            routes = null;
            router = null;
        })
    }

    async buildUI(routes) {
        let fragment = crsbinding.inflationManager.get("menu-item", routes);
        this.querySelector("ul").appendChild(fragment);
    }

    async disconnectedCallback() {

    }
}

customElements.define("main-menu", MainMenu);