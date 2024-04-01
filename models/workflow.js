import { Schema, model, models } from 'mongoose';

const WorkflowSchema = new Schema({
    name : {
        type: String,
        required: [true, 'Workflow name is required!'],
    },
    description: {
        type: String,
        required: [true, 'Workflow description is required!'],
    },
    cost : {
        type: Number,
        required: [true, 'Workflow cost is required!'],
    },
    // Input is an array of objects, each object has a type and required property
    input : {
        type: Array,
        required: [false, 'Workflow input is required!'],
    },
    // Output is an array of objects, each object has a type and required property
    output : {
        type: Array,
        required: [false, 'Workflow output is required!'],
    },
    status : {
        type: String,
        required: [true, 'Workflow status is required!'],
    },
    api_link : {
        type: String,
        required: [false, 'Workflow api link is required!'],
    },
});

const Workflow = models.Workflow || model("Workflow", WorkflowSchema);

export default Workflow;