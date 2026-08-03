import type { Policy } from "../../domain/entities/policy.entity.ts";
import type { PolicyRepository } from "../../domain/repositories/policy.repository.ts";

export class ListPoliciesUseCase {
  constructor(private readonly policies: PolicyRepository) {}

  async execute(): Promise<Policy[]> {
    return this.policies.listAll();
  }
}
