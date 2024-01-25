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

    it("passwordValid returns incorrect password", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "misho", password: "123" })
        .expect(401);
      expect(response.body).toEqual({ msg: "Incorrect password" });
    });
    it("passwordValid returns token", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "misho", password: "54321" })
        .expect(200);
      expect(response.body).toBeDefined();
    });
    it("passwordValid returns bad request", async () => {
      const response = await request(app)
        .post("/login")
        .send({ username: "misho" })
        .expect(400);
      expect(response.body).toEqual({ msg: "Bad Request" });
    });
  });
  describe("registration", () => {
    it("should return registration complete", async () => {
      const response = await request(app)
        .post("/register")
        .send({ username: "foooo", password: "123" })
        .expect(201);
      expect(response.body).toEqual({ msg: "Registration complete" });
    });
    it("should return both fields required without username", async () => {
      const response = await request(app)
        .post("/register")
        .send({ password: "123" })
        .expect(400);
      expect(response.body).toEqual({ msg: "Both fields required" });
    });
  });
});

describe("movies requests", () => {
  it("returns all movies", async () => {
    const response = await request(app).get("/movies").expect(200);
    expect(response.body).toBeDefined();
  });
  it("creates new movie", async () => {
    const response = await request(app)
      .post("/movies")
      .send({ movie_name: "La que se avecina", movie_src: "www.foo.com" })
      .expect(201);
    expect(response.body).toBeDefined();
  });
  it("deletes a movie by id", async () => {
    const response = await request(app).delete("/movies/19").expect(200);
    expect(response.body).toEqual({ msg: "Movie is deleted" });
  });
  it("returns 404 if no id", async () => {
    const response = await request(app).delete("/movies/1").expect(404);
    expect(response.body).toEqual({ msg: "Bad id" });
  });
  it("returns movie by id", async () => {
    const response = await request(app).get("/movies/2").expect(200);
    expect(response.body).toBeDefined();
  });
  it("returns movie not found", async () => {
    const response = await request(app).get("/movies/100").expect(404);
    expect(response.body).toEqual({ msg: "Movie not found" });
  });
});
