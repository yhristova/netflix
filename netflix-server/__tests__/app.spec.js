import request from "supertest";

import { extractBearerToken, app, createToken } from "../app";

describe("extractBearerToken", () => {
  it("returns false", () => {
    expect(extractBearerToken(1)).toBeFalsy();
  });

  it("returns token", () => {
    const token = "foo";
    const header = `bearer ${token}`;
    expect(extractBearerToken(header)).toBe(token);
  });
});

describe("createToken", () => {
  it("creates token", () => {
    expect(createToken({ id: 1, username: "foo" })).toBeDefined();
  });
});

describe("requests", () => {
  describe("checkTokenMiddleware", () => {
    it("should return need a token if no header", async () => {
      const response = await request(app).get("/me").expect(401);
      expect(response.body).toEqual({ msg: "need a token" });
    });

    it("should return need a token if no bearer in header", async () => {
      const response = await request(app)
        .get("/me")
        .set({ authorization: "foo" })
        .expect(401);
      expect(response.body).toEqual({ msg: "need a token" });
    });

    it("should return bad token", async () => {
      const response = await request(app)
        .get("/me")
        .set({ authorization: "bearer 123" })
        .expect(401);
      expect(response.body).toEqual({ msg: "bad token" });
    });
  });
  describe("login authenthication", () => {
    it("should return user not found if username is not correct", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "foo" })
        .expect(404);
      expect(response.body).toEqual({ msg: "User not found" });
    });

    it("passwordValid returns error", () => {});
  });
});
