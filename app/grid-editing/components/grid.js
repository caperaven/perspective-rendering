class DataGrid extends HTMLElement {
    get grouping() {
        return this._grouping;
    }

    set grouping(newValue) {
        this._grouping = newValue;
        this.update();
    }

    get database() {
        return this._database;
    }

    set database(newValue) {
        this._database = newValue;
    }

    get store() {
        return this._store;
    }

    set store(newValue) {
        this._store = newValue;
    }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            const groupTemplate = this.querySelector("#group-template");
            crsbinding.inflationManager.register("grid-group-template", groupTemplate);

            this.gridContainer = this.querySelector(".grid-container");
        });
    }

    async disconnectedCallback() {
        crsbinding.inflationManager.unregister("grid-group-template");
        this.data = null;
        this.store = null;
        this.database = null;
        this.gridContainer = null;
    }

    async update() {
        if (this.grouping == null || this.database == null || this.store == null) {
            return;
        }

        console.log(this.grouping);

        this.gridContainer.innerHTML = "";
        await this.createParentGroupsFragment(this.grouping.root, null);
    }

    async createParentGroupsFragment(parentGroup, selectedElement) {
        const keys = Object.keys(parentGroup.children);
        let groupData = [];
        for (let key of keys) {
            groupData.push({
                caption: key,
                count: parentGroup.children[key]["child_count"]
            })
        }

        const fragment = await crs.intent.dom.elements_from_template({ args: {
            template_id: "grid-group-template",
            data: groupData,
        }});

        this.gridContainer?.appendChild(fragment);
    }

}

customElements.define("data-grid", DataGrid);