import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const response = await request(app)
      .post("/invoice")
      .send({
        name: "John",
        document: "123456789",
        street: "Street",
        number: 123,
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "12345",
        items: [
          {
            id: "1",
            name: "Product 1",
            price: 100,
          },
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John");
    expect(response.body.document).toBe("123456789");
    expect(response.body.street).toBe("Street");
    expect(response.body.number).toBe(123);
    expect(response.body.complement).toBe("Complement");
    expect(response.body.city).toBe("City");
    expect(response.body.state).toBe("State");
    expect(response.body.zipCode).toBe("12345");
    expect(response.body.items[0].id).toBe("1");
    expect(response.body.items[0].name).toBe("Product 1");
    expect(response.body.items[0].price).toBe(100);
    expect(response.body.total).toBe(100);
  });

  it("should not create a invoice", async () => {
    const response = await request(app).post("/invoice").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });
});
