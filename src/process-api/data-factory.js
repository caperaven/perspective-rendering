import {createData} from "./../utils/data-factory.js"

export class DataFactory {
    static async perform(step, context, process, item) {
        const count = await crs.process.getValue(step.args.count, context, process, item);
        const bId =  await crs.process.getValue(step.args.bId, context, process, item);

        const result = await createData(count, bId);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }
}

crs.intent.datafactory = DataFactory;