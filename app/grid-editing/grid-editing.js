import { gridGenerateSchema, translations, header } from "./schemas/generate.js";
import {createDate} from "./../../src/utils/data-factory.js";

export default class GridEditing extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        // 1. register the gridGenerateSchema
        crs.processSchemaRegistry.add(gridGenerateSchema);

        // 2. set the header content
        await crs.intent.dom.set_widget(header);

        // 3. add translations required
        await crsbinding.translations.add(translations, "grid_generate")
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

    /**
     * Called from process if the dialog input was validated and ok
     * @returns {Promise<void>}
     */
    async update() {
        console.log(this.records);
    }
}