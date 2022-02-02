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

        crsbinding.dom.enableEvents(this);

        this.registerEvent(this, "click", this.gridClick.bind(this));
    }

    async disconnectedCallback() {
        crsbinding.inflationManager.unregister("grid-group-template");
        this.data = null;
        this.store = null;
        this.database = null;
        this.gridContainer = null;
        crsbinding.dom.enableEvents(this);
    }

    async update() {
        if (this.grouping == null || this.database == null || this.store == null) {
            return;
        }

        console.log(this.grouping);

        this.gridContainer.innerHTML = "";
        const fragment = await this.createParentGroupsFragment(this.grouping.root, "root", 0);
        this.gridContainer.appendChild(fragment);
    }

    async createParentGroupsFragment(parentGroup, path, level) {
        let fragment;

        if (parentGroup.children != null) {
            const keys = Object.keys(parentGroup.children);
            let groupData = [];
            for (let key of keys) {
                const child = parentGroup.children[key];
                groupData.push({
                    field: child["field"],
                    caption: key,
                    count: child["child_count"],
                    path: `${path}/c["${key}"]/`,
                    level: level
                })
            }

            fragment = await crs.intent.dom.elements_from_template({ args: {
                template_id: "grid-group-template",
                data: groupData,
            }});

            const padding = `${(level) * 24}px`;

            for (let child of fragment.children) {
                child.style.paddingLeft = padding;
            }
        }

        return fragment;
    }

    async gridClick(event) {
        if (event.target.dataset.expandable === "true") {
            const path = event.target.dataset.path.split("/c[").join(".children[").split("/").join("");
            let fn = new Function("context", `return context.${path};`);
            const obj = fn(this.grouping);
            fn = null;

            const fragment = await this.createParentGroupsFragment(obj, event.target.dataset.path, Number(event.target.dataset.level + 1));

            const group = event.target.parentElement;
            group.parentElement.insertBefore(fragment, group.nextElementSibling);

            event.target.dataset.expandable = "false";
            event.target.textContent = "-";
        }
        else if (event.target.dataset.expandable === "false") {
            const count = event.target.dataset.count;
            const group = event.target.parentElement;

            for (let i = 0; i < count; i++) {
                group.nextElementSibling.parentElement.removeChild(group.nextElementSibling);
            }

            event.target.dataset.expandable = "true";
            event.target.textContent = "+";
        }
    }

}

customElements.define("data-grid", DataGrid);