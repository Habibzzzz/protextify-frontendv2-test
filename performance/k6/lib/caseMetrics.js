import { Rate, Trend } from "k6/metrics";

export const casePassRate = new Rate("case_pass_rate");
export const caseDuration = new Trend("case_duration_ms", true);

export async function runCase(caseId, fn) {
  const startedAt = Date.now();
  let passed = true;
  try {
    const result = await fn();
    if (result === false) {
      passed = false;
    }
    return passed;
  } catch (_err) {
    passed = false;
    return false;
  } finally {
    casePassRate.add(passed ? 1 : 0, { case_id: caseId });
    caseDuration.add(Date.now() - startedAt, { case_id: caseId });
  }
}
