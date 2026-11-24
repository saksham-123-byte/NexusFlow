
const {
    createWorkflowObservable
} = require("../src/services/rxjs.service");

// Test 1: Observable pipeline
const testObservablePipeline = () => {
    const results = [];

    createWorkflowObservable([2, 5, 8, 10])
        .subscribe({
            next: (value) => results.push(value),
            error: (error) => {
                throw error;
            },
            complete: () => {
                const expected = [16, 20];

                if (JSON.stringify(results) !== JSON.stringify(expected)) {
                    throw new Error("Unexpected Observable results");
                }

                console.log("PASS: Observable pipeline");
            }
        });
};

// Test 2: Reject non-array input
const testInvalidInput = () => {
    let errorOccurred = false;

    try {
        createWorkflowObservable("invalid");
    } catch (error) {
        errorOccurred = true;
    }

    if (!errorOccurred) {
        throw new Error("Invalid input was not rejected");
    }

    console.log("PASS: Reject non-array input");
};

// Test 3: Reject invalid stream values
const testInvalidStreamValue = () => {
    let errorOccurred = false;

    createWorkflowObservable([5, "invalid"])
        .subscribe({
            next: () => {},
            error: () => {
                errorOccurred = true;

                if (errorOccurred) {
                    console.log("PASS: Reject invalid stream values");
                }
            }
        });
};

testObservablePipeline();
testInvalidInput();
testInvalidStreamValue();
