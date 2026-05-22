import { describe, it, expect, vi } from "vitest";
import { HANDLERS } from "../../src/hooks/wsMessages/messageHandlers";

const handlerDeviceOnlineState = HANDLERS["update device onlineState"];

describe("handlerDeviceOnlineState", () => {
  const prevDevices = [
    { id: 1, name: "Light", isOnline: false },
    { id: 2, name: "Fan", isOnline: true },
  ];

  it("device turns online", () => {
    const setDevices = vi.fn();
    handlerDeviceOnlineState({ deviceID: 1, content: true }, { setDevices });
    const result = setDevices.mock.calls[0][0](prevDevices);
    expect(result.find((d) => d.id === 1).isOnline).toBe(true);
  });

  it("device turns offline", () => {
    const setDevices = vi.fn();
    handlerDeviceOnlineState({ deviceID: 2, content: false }, { setDevices });
    const result = setDevices.mock.calls[0][0](prevDevices);
    expect(result.find((d) => d.id === 2).isOnline).toBe(false);
  });
});
