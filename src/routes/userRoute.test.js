const request = require("supertest");
const app = require("../index");

describe("User Route", () => {
  test("createUser will not accept an invalid email", async () => {
    const response = await request(app)
      .post("/createUser")
      .send({ email: "notAnEmail", password: "password" });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('{"message":"Invalid email"}');
  });
});
