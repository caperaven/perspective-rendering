export const gridGenerateSchema = {
    id: "grid-generate",

    main: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "show_form_dialog",
                args: {
                    id: "input-form",
                    html: "$template.grid-editing-input",
                    url: "/templates/forms/grid-editing-input.html",
                    error_store: "input_validation"
                }
            }
        }
    }
}