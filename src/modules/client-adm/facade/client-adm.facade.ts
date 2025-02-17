import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto, AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto> {
    const output = await this._addUsecase.execute(input);
    return {
      id: output.id,
      name: output.name,
      document: output.document,
      email: output.email,
      address: {
        street: output.address.street,
        number: output.address.number,
        complement: output.address.complement,
        city: output.address.city,
        state: output.address.state,
        zipCode: output.address.zipCode,
      },
    }
  }
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
