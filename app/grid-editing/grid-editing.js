import {gridGenerateSchema} from "./schemas/generate.js";

export default class GridEditing extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        // 1. register the gridGenerateSchema
        crs.processSchemaRegistry.add(gridGenerateSchema);

        // 2. set the header content
        await crs.intent.dom.set_widget({
            args: {
                query: "#header-widget",
                html: "$template.grid_editing_header",
                url: "/templates/header-widgets/grid_editing.html"
            }
        })

        // 3. add translations required
        await crsbinding.translations.add({
            buttons: {
                cancel: "Cancel",
                ok: "Ok"
            },
            labels: {
                rowCount: "Row count"
            }
        }, "grid_generate")
    }

    async disconnectedCallback() {
        // 1. remove the grid generate schema
        crs.processSchemaRegistry.remove("grid-generate");

        // 2. remove translations no longer required
        await crsbinding.translations.delete("grid_generate");

        await super.disconnectedCallback();
    }

    async showGenInput() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "grid-generate"
                }
            },
            parameters: {
                bId  : this._dataId
            }
        });
    }

    preLoad() {
        this.setProperty("rowCount", 10);
    }
}