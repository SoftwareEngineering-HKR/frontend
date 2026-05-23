import { describe, it, expect, vi } from "vitest";
import { HANDLERS } from "../../../src/hooks/wsMessages/messageHandlers";

const handlerInitialDevices = HANDLERS["inital devices"];

describe("handleInitialDevices", () => {
  it("calls setDevices with the correct mapped devices from the payload", () => {
    const setDevices = vi.fn();
    const payload = {
      devices: [
        {
          id: 1,
          type: "light",
          value: "1",
          min_value: "0",
          max_value: "1",
          online: true,
          room: "Bedroom",
        },
        { id: 2, type: "gas", value: "50", online: true },
      ],
    };

    handlerInitialDevices(payload, { setDevices });

    expect(setDevices).toHaveBeenCalledOnce();
    const mappedDevices = setDevices.mock.calls[0][0];
    expect(mappedDevices).toHaveLength(2);
    expect(mappedDevices[0].id).toBe(1);
    expect(mappedDevices[1].id).toBe(2);
  });
});
