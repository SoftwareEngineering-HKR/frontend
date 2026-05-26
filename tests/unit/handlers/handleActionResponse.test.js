import { describe, it, expect, vi } from "vitest";
import { HANDLERS } from "../../../src/hooks/wsMessages/messageHandlers";

const handlerActionResponse = HANDLERS["action response"];

describe("handlerActionResponse", () => {
  it("rejects pending devices and sets ws error on device error", () => {
    const reject = vi.fn();
    const pendingRef = {
      current: { 1: { timerId: null, resolve: vi.fn(), reject } },
    };
    const setWsError = vi.fn();
    const actionResponseRef = { current: [] };
    const payload = { statusCode: 500, message: "Cannot connect to device" };

    handlerActionResponse(payload, {
      pendingRef,
      setWsError,
      actionResponseRef,
    });

    expect(reject).toHaveBeenCalledWith(new Error("Cannot connect to device"));
    expect(setWsError).toHaveBeenCalledWith("Cannot connect to device");
  });

  it("resolves on status 200 response", () => {
    const resolve = vi.fn();
    const pendingRef = { current: {} };
    const setWsError = vi.fn();
    const actionResponseRef = { current: [{ resolve, reject: vi.fn() }] };
    const payload = { statusCode: 200, message: "OK" };

    handlerActionResponse(payload, {
      pendingRef,
      setWsError,
      actionResponseRef,
    });

    expect(resolve).toHaveBeenCalledWith({ statusCode: 200, message: "OK" });
  });
});
