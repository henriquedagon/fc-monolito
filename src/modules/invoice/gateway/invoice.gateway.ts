import Invoice from "../domain/invoice.entity";

export default interface InvoiceGateway {
    generate(input: Invoice): Promise<any>
    find(input: any): Promise<Invoice>
}