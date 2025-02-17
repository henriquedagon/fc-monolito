import express, {Request, Response} from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();
  try {
    const customerDto = {
      name: req.body.name,
      document: req.body.document,
      email: req.body.email,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zip
      ),
    };
    const output = await facade.add(customerDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});