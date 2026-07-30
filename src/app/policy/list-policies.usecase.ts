import type { Policy } from "../../domain/policy/policy.entity.js";
import type { PolicyRepository } from "../../domain/policy/policy.repository.js";

export class ListPoliciesUseCase {
  constructor(private readonly policies: PolicyRepository) {}

  async execute(): Promise<Policy[]> {
    return this.policies.listAll();
  }
}
