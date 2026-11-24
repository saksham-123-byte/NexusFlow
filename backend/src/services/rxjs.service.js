
const { of } = require("rxjs");

const {
    map,
    filter,
    tap
} = require("rxjs/operators");

// Create an Observable pipeline for workflow data
const createWorkflowObservable = (inputData) => {
    if (!Array.isArray(inputData)) {
        throw new Error("Input data must be an array");
    }

    return of(...inputData).pipe(
        map((value) => {
            if (typeof value !== "number" || !Number.isFinite(value)) {
                throw new Error("Workflow values must be finite numbers");
            }

            return value * 2;
        }),

        filter((value) => value > 10),

        tap((value) => {
            console.log("Processed workflow value:", value);
        })
    );
};

module.exports = {
    createWorkflowObservable
};
