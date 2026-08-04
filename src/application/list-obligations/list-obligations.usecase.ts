import type {
  IObligationRepository,
  ObligationListResult,
} from "../../infrastructure/repositories/neo4j-obligation/IObligation.repository.ts";
import type { ListObligationsDto } from "./list-obligations.dto.ts";

export class ListObligationsUseCase {
  constructor(private readonly obligations: IObligationRepository) {}

  async execute(input: ListObligationsDto): Promise<ObligationListResult> {
    return this.obligations.listByHospitalProfile(input);
  }
}
