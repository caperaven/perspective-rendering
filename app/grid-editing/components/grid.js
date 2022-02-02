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

        await crs.intent.dom.create_inflation_template({args: {
            template_id: "tpl_grid-cells",
            tag: "div",
            source: {
                code:           {classes: ["cell"]},
                description:    {classes: ["cell"]},
                number:         {classes: ["cell"]},
                date:           {classes: ["cell"]}
            }
        }});


        this.registerEvent(this, "click", this.gridClick.bind(this));
        this.registerEvent(this, "dblclick", this.gridDblClick.bind(this));
    }

    async disconnectedCallback() {
        crsbinding.inflationManager.unregister("grid-group-template");
        this.data = null;
        this.store = null;
        this.database = null;
        this.gridContainer = null;

        if (this.db != null) {
            await crs.intent.db.close({args: {db: this.db}});
            this.db = null;
        }
        crsbinding.dom.enableEvents(this);
        crsbinding.inflationManager.unregister("tpl_grid-cells");
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

            return fragment;
        }
        else if (parentGroup.rows != null) {
            if (this.db == null) {
                await this._openDatabase();
            }

            let rows = await crs.intent.db.get_from_index({args: {
                db: this.db,
                store: this.store,
                keys: parentGroup.rows
            }});

            fragment = await crs.intent.dom.elements_from_template({args: {
                template_id: "tpl_grid-cells",
                data: rows
            }})

            const element = document.createElement("div");
            element.classList.add("grid");
            element.appendChild(fragment);
            return element;
        }
    }

    async _openDatabase() {
        this.db = await crs.intent.db.open({ args: {
            name: this.database,
            version: 1
        }})
    }

    async gridClick(event) {
        if (event.target.dataset.expandable === "true") {
            const path = event.target.dataset.path.split("/c[").join(".children[").split("/").join("");
            let fn = new Function("context", `return context.${path};`);
            const obj = fn(this.grouping);
            fn = null;

            const fragment = await this.createParentGroupsFragment(obj, event.target.dataset.path, Number(event.target.dataset.level + 1));

            if (fragment instanceof HTMLDivElement) {
                event.target.dataset.count = 1;
            }

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

    async gridDblClick(event) {
        const element = event.target;
        const rows = await crs.intent.datafactory.perform({
            args: {count: 1, bId: this.bId}
        })

        await crs.intent.dom.update_cells({ args: {
            template_id     : "tpl_grid-cells",
            data            : rows,
            parent          : element.parentElement,
            row_index       : 0
        }}, this)
    }
}

customElements.define("data-grid", DataGrid);