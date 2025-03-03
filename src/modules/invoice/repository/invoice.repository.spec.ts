import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItems from "../domain/invoice-items.entity";
import {InvoiceItemsModel} from "./invoice-item.model";

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Product 1",
          price: 100
        })
      ]
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemsModel] })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)})

  it("should find a invoice", async () => {

    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Lucian',
      email: 'lucian@123.com',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const item1 = {
      id: '1',
      name: 'Product 1',
      price: 100,
      invoiceId: '1'
    }

    await InvoiceItemsModel.create(item1);


    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(result.items[0].id.id).toEqual(item1.id)
    expect(result.items[0].name).toEqual(item1.name)
    expect(result.items[0].price).toEqual(item1.price)
  })
})