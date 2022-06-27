const request = require("supertest");

const app = require("../index");
const mockAuthRepo = require("../repos/authRepo");
const mockPhotoRepo = require("../repos/photoRepo");

describe("Photo Route", () => {
  let token;

  mockAuthRepo.authenticateUser = async () => {
    return { _id: "01" };
  };

  beforeAll((done) => {
    request(app)
      .post("/authorize")
      .send({
        email: "test@unittests.com",
        password: "password",
      })
      .end((err, response) => {
        token = response.body.accessToken;
        done();
      });
  });

  test("deletePhoto reports that a photo has been deleted if the user uploaded the photo", async () => {
    mockPhotoRepo.getPhotoData = async () => {
      return { _id: "02", contributorId: "01" };
    };
    mockPhotoRepo.deletePhoto = async () => {
      return {};
    };
    const response = await request(app)
      .put("/deletePhoto")
      .set("Authorization", `Bearer ${token}`)
      .send({ photoId: "5678" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('{"message":"Photo deleted"}');
  });

  test("deletePhoto will report that a photo cannot be deleted if the user did not upload the photo", async () => {
    mockPhotoRepo.getPhotoData = async () => {
      return { _id: "02", contributorId: "02" }; // test userId is 01, this photo belongs to 02
    };
    mockPhotoRepo.deletePhoto = async () => {
      return {};
    };
    const response = await request(app)
      .put("/deletePhoto")
      .set("Authorization", `Bearer ${token}`)
      .send({ photoId: "5678" });

    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('{"message":"Cannot access file"}');
  });

  test("deletePhoto will report that a photo cannot be found when the repo function cannot locate the image", async () => {
    mockPhotoRepo.getPhotoData = async () => {
      return null;
    };
    const response = await request(app)
      .put("/deletePhoto")
      .set("Authorization", `Bearer ${token}`)
      .send({ photoId: "5678" });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('{"message":"Cannot find image"}');
  });

  test("viewPhoto will return an error if it cannot find an image", async () => {
    mockPhotoRepo.getPhotoData = async () => {
      return null;
    };
    const response = await request(app)
      .get("/viewPhoto/5678")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('{"message":"Cannot find image"}');
  });

  test("viewPhoto will not return an private image if the requester is not the one who uploaded the image", async () => {
    mockPhotoRepo.getPhotoData = async () => {
      return { _id: "02", contributorId: "02", isPublic: false };
    };

    const response = await request(app)
      .get("/viewPhoto/5678")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.text).toBe('{"message":"Cannot access file"}');
  });
});
