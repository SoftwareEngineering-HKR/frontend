import { describe, it, expect, vi } from "vitest";
import { HANDLERS } from "../../../src/hooks/wsMessages/messageHandlers";

const handlerUpdateValue = HANDLERS["update value"];

describe("handlerUpdateValue", () => {
  const prevDevices = [
    { id: 1, name: "Light", isOnline: true, actions: [{ id: 1, value: 0 }] },
  ];

  it("resolves the pending promise for the device", () => {
    const resolve = vi.fn();
    const pendingRef = {
      current: { 1: { timerId: null, resolve, reject: vi.fn() } },
    };
    const setUserDevices = vi.fn();
    const payload = { deviceID: 1, content: "1" };

    handlerUpdateValue(payload, { setUserDevices, pendingRef });

    expect(resolve).toHaveBeenCalled();
    expect(pendingRef.current[1]).toBeUndefined();
  });

  it("updates the device action value in state", () => {
    const setUserDevices = vi.fn();
    const pendingRef = { current: {} };
    const payload = { deviceID: 1, content: "1" };

    handlerUpdateValue(payload, { setUserDevices, pendingRef });
    const result = setUserDevices.mock.calls[0][0](prevDevices);

    expect(result.find((d) => d.id === 1).actions[0].value).toBe(1);
  });
});
