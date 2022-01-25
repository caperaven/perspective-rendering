import { gridGenerateSchema, translations, header } from "./schemas/generate.js";
import {createDate} from "./../../src/utils/data-factory.js";

export default class GridEditing extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        // 1. register the gridGenerateSchema
        crs.processSchemaRegistry.add(gridGenerateSchema);

        // 2. set the header content
        header.args.context = this;
        await crs.intent.dom.set_widget(header);

        // 3. add translations required
        await crsbinding.translations.add(translations, "grid_generate")
    }

    async disconnectedCallback() {
        // 1. remove the grid generate schema
        crs.processSchemaRegistry.remove("grid-generate");

        // 2. remove translations no longer required
        await crsbinding.translations.delete("grid_generate");

        // 3. clear the data store
        await crs.intent.db.clear_table({ args: {

            }})

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
        this.setProperty("progressMax", 100);
        this.setProperty("progress", 0);
        this.setProperty("currentStep", "Please generate data to proceed");
    }

    /**
     * Called from process if the dialog input was validated and ok
     * @returns {Promise<void>}
     */
    async update() {
        console.log(this.records);
        console.log(this.grouping);
        this.grouping = null;
    }
}