import type { Policy } from "../../domain/entities/policy.entity.js";
import type { PolicyRepository } from "../../domain/repositories/policy.repository.js";

export class ListPoliciesUseCase {
  constructor(private readonly policies: PolicyRepository) {}

  async execute(): Promise<Policy[]> {
    return this.policies.listAll();
  }
}
