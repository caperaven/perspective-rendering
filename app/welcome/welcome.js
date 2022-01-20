export default class Welcome extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.intent.dom.set_widget({
            args: {
                query: "#header-widget",
                html: "$template.welcome_header",
                url: "/templates/header-widgets/welcome.html"
            }
        })
    }
}