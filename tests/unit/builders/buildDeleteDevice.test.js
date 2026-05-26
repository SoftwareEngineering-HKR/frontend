import { describe, it, expect } from "vitest";
import { BUILDERS } from "../../../src/hooks/wsMessages/messageBuilders";

const buildDeleteDevice = BUILDERS["delete device"];

describe("buildDeleteDevice", () => {
  it("builds the expected delete message", () => {
    const result = buildDeleteDevice({ id: "abc-123" });
    expect(result).toEqual({
      type: "delete device",
      payload: { id: "abc-123" },
    });
  });
});
