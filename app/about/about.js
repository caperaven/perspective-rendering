export default class About extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.intent.dom.set_widget({
            args: {
                query: "#header-widget",
                html: "$template.about_header",
                url: "/templates/header-widgets/about.html"
            }
        })
    }
}