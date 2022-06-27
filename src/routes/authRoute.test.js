const request = require("supertest");

const app = require("../index");
const mockAuthRepo = require("../repos/authRepo");
const mockJwt = require("jsonwebtoken");

describe("Auth Route", () => {
  test("returns jwt when passed an email and password", async () => {
    mockAuthRepo.authenticateUser = async () => {
      return { _id: "01" };
    };
    mockJwt.sign = () => "1234";

    const response = await request(app)
      .post("/authorize")
      .send({ email: "dan@test.com", password: "testPassword" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('{"accessToken":"1234"}');
  });

  test("does not return jwt when repo cannot find user", async () => {
    mockAuthRepo.authenticateUser = async () => {
      return { error: true, code: 401, message: "invalid credentials" };
    };
    mockJwt.sign = () => "1234";

    const response = await request(app)
      .post("/authorize")
      .send({ email: "dan@test.com" });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('"invalid credentials"');
  });

  test("reports an error when the repo throws an error", async () => {
    mockAuthRepo.authenticateUser = async () => {
      throw new error();
    };
    mockJwt.sign = () => "1234";

    const response = await request(app)
      .post("/authorize")
      .send({ email: "dan@test.com" });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('{"message":"Server error"}');
  });
});
