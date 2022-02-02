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
                    error_store: "input_validation",
                },
                pass_step: "get_data"
            },

            get_data: {
                type: "datafactory",
                args: {
                    count: "$binding.rowCount",
                    bId: "$bId",
                    target: "$context.records"
                },
                next_step: "group_data",
                binding_before: {
                    currentStep: "generating data"
                }
            },

            group_data: {
                type: "data",
                action: "group",
                args: {
                    source: "$context.records",
                    fields: ["externalCode", "number"],
                    target: "$context.grouping"
                },
                binding_before: {
                    currentStep: "grouping data"
                },
                next_step: "add_to_store",
            },

            add_to_store: {
                type: "db",
                action: "create_data_dump",
                args: {
                    name: "perspective_data",
                    tables: {
                        grid_editing: {
                            indexes: {
                                id: { unique: true }
                            }
                        }
                    },
                    store: "grid_editing",
                    records: "$context.records"
                },
                binding_before: {
                    currentStep: "cache data"
                },
                next_step: "update_grid"
            },

            update_grid: {
                type: "dom",
                action: "set_properties",
                args: {
                    query: "data-grid",
                    properties: {
                        database: "perspective_data",
                        store: "grid_editing",
                        grouping: "$context.grouping",
                        bId: "$bId"
                    }
                },
            }
        }
    }
}

export const translations = {
    buttons: {
        cancel: "Cancel",
            ok: "Ok"
    },
    labels: {
        rowCount: "Row count"
    }
}

export const header = {
    args: {
        query: "#header-widget",
        html: "$template.grid_editing_header",
        url: "/templates/header-widgets/grid_editing.html"
    }
}