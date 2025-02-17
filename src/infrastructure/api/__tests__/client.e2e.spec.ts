import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/client")
      .send({
        name: "John",
        email: "j@j.com",
        document: "123456789",
        address: {
          street: "Street",
          number: 123,
          complement: "Complement",
          city: "City",
          state: "State",
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John");
    expect(response.body.email).toBe("j@j.com");
    expect(response.body.document).toBe("123456789");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.complement).toBe("Complement");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.state).toBe("State");
    expect(response.body.address.zipCode).toBe("12345");
  });

  it("should not create a client", async () => {
    const response = await request(app).post("/client").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });
});
