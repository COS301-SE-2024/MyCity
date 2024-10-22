jest.mock("./src/services/jobs.service", () => ({
    addJobToReadQueue: jest.fn(() => {
        return {
            finished: jest.fn()
        }
    }),
    addJobToWriteQueue: jest.fn(),
}));

jest.mock("bull");