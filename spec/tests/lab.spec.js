const request = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");

const req = request(app);

describe("API Integration Tests:", () => {
  let testUser;
  let testTodo;
  let userToken;

  beforeAll(async () => {
    testUser = {
      name: "Ahmed Hamdy",
      email: "ahmed.hamdy@example.com",
      password: "Password123",
    };

    await req.post("/user/signup").send(testUser);

    const loginRes = await req.post("/user/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    
    userToken = loginRes.body.data;
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe("User Routes:", () => {
    it("GET /user/search - should return user details when searching by name", async () => {
      const res = await req.get(`/user/search?name=${testUser.name}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(testUser.name);
    });

    it("GET /user/search - should return error message for non-existent user", async () => {
      const res = await req.get("/user/search").query({ name: "NonExistent" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("There is no user with name: NonExistent");
    });
  });

  describe("Todo Routes:", () => {
    beforeAll(async () => {
      testTodo = {
        title: "Complete Test Suite",
        description: "Writing unit and integration tests",
        userId: testUser._id,
      };

      const todoRes = await req
        .post("/todo")
        .send(testTodo)
        .set({ authorization: userToken });

      testTodo._id = todoRes.body.data._id;
    });

    it("PATCH /todo/:id - should return error if no updates are provided", async () => {
      const res = await req
        .patch(`/todo/${testTodo._id}`)
        .send({})
        .set({ authorization: userToken });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("must provide title and id to edit todo");
    });

    it("PATCH /todo/:id - should update the todo title", async () => {
      const updatedTitle = "Updated Todo Title";
      const res = await req
        .patch(`/todo/${testTodo._id}`)
        .send({ title: updatedTitle })
        .set({ authorization: userToken });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(updatedTitle);
    });

    it("GET /todo/user - should return all todos for a user", async () => {
      const res = await req
        .get(`/todo/user`)
        .query({ userId: testUser._id })
        .set({ authorization: userToken });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it("GET /todo/user - should return no todos for a user without any", async () => {
      const anotherUser = {
        name: "Mostafa Hamdy",
        email: "Mostafa.Hamdy@example.com",
        password: "Test1234",
      };

      await req.post("/user/signup").send(anotherUser);

      const loginRes = await req.post("/user/login").send({
        email: anotherUser.email,
        password: anotherUser.password,
      });
      
      const anotherUserToken = loginRes.body.data;

      const res = await req
        .get(`/todo/user`)
        .query({ userId: anotherUser._id })
        .set({ authorization: anotherUserToken });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Couldn't find any todos for this user.");
    });
  });
});
