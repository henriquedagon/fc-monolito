import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import InvoiceItems from "../domain/invoice-items.entity";
import {InvoiceItemsModel} from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {

  // Generate a new invoice and its items
  async generate(entity: Invoice): Promise<void> {
    // First, create the invoice record
    const invoice = await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });

    // Now, create the items and associate them with the invoice
    const invoiceItems = entity.items.map(item => ({
      id: item.id.id,
      name: item.name,
      price: item.price,
      invoiceId: invoice.id
    }));

    // Create invoice items in bulk
    await InvoiceItemsModel.bulkCreate(invoiceItems);
  }

  // Find an invoice by its ID along with the items
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemsModel]
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Return the mapped invoice object
    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
          invoice.street,
          invoice.number,
          invoice.complement,
          invoice.city,
          invoice.state,
          invoice.zipcode,
      ),
      items: invoice.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
