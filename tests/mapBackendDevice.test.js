import { describe, it, expect } from "vitest";
import { mapBackendDevice } from "../src/hooks/wsMessages/deviceMapping";

describe("mapBackendDevice", () => {
  it("maps a toggle device correctly", () => {
    const input = {
      id: 1,
      type: "light",
      value: "1",
      min_value: "0",
      max_value: "1",
      online: true,
      room: "Bedroom",
    };

    const result = mapBackendDevice(input);

    expect(result.name).toBe("Light (1)");
    expect(result.actions[0].type).toBe("toggle");
    expect(result.actions[0].value).toBe(1);
    expect(result.actions[0].min).toBe(0);
    expect(result.actions[0].max).toBe(1);
  });

  it("maps sensor types correctly", () => {
    const input = {
      id: 3,
      type: "gas",
      value: "50",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].type).toBe("sensor");
  });

  it("maps slider devices correctly", () => {
    const input = {
      id: 6,
      type: "fan",
      value: "3",
      min_value: "0",
      max_value: "5",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].type).toBe("slider");
    expect(result.actions[0].variant).toBe("range");
  });

  it("uses fallback name and room when missing", () => {
    const input = {
      id: 2,
      type: "fan",
      value: "5",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.name).toBe("Fan (2)");
    expect(result.room).toBe("Unassigned");
  });

  it("sets binary variant correctly", () => {
    const input = {
      id: 4,
      type: "motion",
      value: "1",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].variant).toBe("binary");
  });

  it("parses numeric values from strings", () => {
    const input = {
      id: 5,
      type: "fan",
      value: "3",
      min_value: "0",
      max_value: "5",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].value).toBe(3);
    expect(result.actions[0].min).toBe(0);
    expect(result.actions[0].max).toBe(5);
  });

  it("handles unknown types", () => {
    const input = {
      id: 5,
      type: "weird_device",
      value: "10",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].type).toBe("unknown");
    expect(result.actions[0].label).toBe("weird_device");
  });

  it("uses correct label for known device type", () => {
    const input = {
      id: 1,
      type: "light",
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].label).toBe("Power");
  });

  it("handles null values", () => {
    const input = {
      id: 7,
      type: "fan",
      value: null,
      min_value: null,
      max_value: null,
      online: true,
    };

    const result = mapBackendDevice(input);

    expect(result.actions[0].value).toBeNull();
    expect(result.actions[0].min).toBeNull();
    expect(result.actions[0].max).toBeNull();
  });
});
