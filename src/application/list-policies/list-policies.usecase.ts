import type { Policy } from "../../domain/entities/policy.entity.ts";
import type { IPolicyRepository } from "../../infrastructure/repositories/neo4j-policy/IPolicy.repository.ts";

export class ListPoliciesUseCase {
  constructor(private readonly policies: IPolicyRepository) {}

  async execute(): Promise<Policy[]> {
    return this.policies.listAll();
  }
}
