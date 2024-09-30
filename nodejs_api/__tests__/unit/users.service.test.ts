// import { uploadProfilePicture } from "../../src/services/users.service";
// import { uploadFile } from "../../src/config/s3bucket.config";

// // Mock the uploadFile function
// jest.mock("../../src/config/s3bucket.config", () => ({
//     uploadFile: jest.fn(),
// }));

// describe("User Service - uploadProfilePicture", () => {
//     const mockUsername = "testuser";
//     const mockFile = {
//         originalname: "test.jpg",
//         buffer: Buffer.from("test file"),
//         mimetype: "image/jpeg",
//     } as Express.Multer.File; // Simulate the file input

//     afterEach(() => {
//         jest.clearAllMocks(); // Clear mocks between tests
//     });

//     it("should upload the profile picture successfully", async () => {
//         // Mock a successful uploadFile response
//         const mockPictureUrl = "https://s3.amazonaws.com/bucket/profile_pictures/testuser";
//         (uploadFile as jest.Mock).mockResolvedValueOnce(mockPictureUrl);

//         const result = await uploadProfilePicture(mockUsername, mockFile);

//         // Assertions
//         expect(uploadFile).toHaveBeenCalledWith("profile_pictures", mockUsername, mockFile);
//         expect(result).toEqual({ picture_url: mockPictureUrl });
//     });

//     it("should throw an error if file upload fails", async () => {
//         // Mock an error during the upload
//         const mockError = new Error("Upload failed");
//         (uploadFile as jest.Mock).mockRejectedValueOnce(mockError);

//         await expect(uploadProfilePicture(mockUsername, mockFile)).rejects.toThrow("Upload failed");

//         // Assertions
//         expect(uploadFile).toHaveBeenCalledWith("profile_pictures", mockUsername, mockFile);
//     });
// });
