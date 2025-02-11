import AddInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn().mockReturnValue(Promise.resolve({})),
    find: jest.fn()
  }
}

describe("Add Invoice use case unit test", () => {

  it("should add a invoice", async () => {

    const repository = MockRepository()
    const useCase = new AddInvoiceUseCase(repository)

    const input = {
      name: "Lucian",
      document: "1234-5678",
      street:   "Rua 123",
      number:   "99",
      complement:   "Casa Verde",
      city:   "Criciúma",
      state:   "SC",
      zipCode:   "88888-888",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100
        }
      ]
    }

    const result =  await useCase.execute(input)

    expect(repository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.items.length).toEqual(input.items.length)
    expect(result.items[0].id).toEqual(input.items[0].id)
    expect(result.items[0].name).toEqual(input.items[0].name)
    expect(result.items[0].price).toEqual(input.items[0].price)
  })
})