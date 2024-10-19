const dotenv = require("dotenv");
const { finished } = require("stream");

dotenv.config();

jest.mock("./src/services/jobs.service", () => ({
    addJobToReadQueue: jest.fn(() => {
        return {
            finished: jest.fn()
        }
    }),
    addJobToWriteQueue: jest.fn(),
}));

