import { describe, it, expect } from "vitest";
import { BUILDERS } from "../../../src/hooks/wsMessages/messageBuilders";

const buildUpdateValue = BUILDERS["update value"];

describe("buildUpdateValue", () => {
  it("builds the expected update message", () => {
    const result = buildUpdateValue({ deviceId: "abc-123", value: 42 });
    expect(result).toEqual({
      type: "update value",
      payload: { id: "abc-123", value: 42 },
    });
  });
});
