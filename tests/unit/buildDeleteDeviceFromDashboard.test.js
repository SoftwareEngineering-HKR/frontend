import { describe, it, expect } from "vitest";
import { BUILDERS } from "../../src/hooks/wsMessages/messageBuilders";

const buildDeleteDeviceFromDashboard = BUILDERS["delete yourself from device"];

describe("buildDeleteDeviceFromDashboard", () => {
  it("builds the expected remove message for dashboard removal", () => {
    const result = buildDeleteDeviceFromDashboard({ deviceId: "abc-123" });
    expect(result).toEqual({
      type: "delete yourself from device",
      payload: { deviceId: "abc-123" },
    });
  });
});
