import express, {Request, Response} from "express";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create();
    const output = await facade.addProduct(req.body);

    res.format({
        json: async () => res.send(output),
    });
});
