import { describe, it, expect, afterAll, beforeAll } from "vitest";
import * as authService from "../../src/service/api";
import { createWsClient } from "./wsHelper";

const TEST_USERS = {
    user: {
        username: `test_user`,
        password: "testtest",
    },
    admin: {
        username: "admin",
        password: "password",
    },
};

describe("Device-related WebSocket Messages", { sequential: true }, () => {
    let adminWS;
    let userWS;
    let devices;

    // log in as admin to be able to perform all device management actions
    // create user to test that users are not allowed to perform device actions
    beforeAll(async () => {
        try {
            const adminRes = await authService.auth("login", TEST_USERS.admin);
            adminWS = createWsClient(adminRes.accessToken);

            const userRes = await authService.auth("signup", TEST_USERS.user);
            userWS = createWsClient(userRes.accessToken);
        } catch (err) {
            console.warn(
                `[setup] Could not set up initial logins ${err.message}`,
            );
        }
    });

    afterAll(async () => {
        userWS.close();

        // delete test user at the end
        adminWS.send("delete user", { name: TEST_USERS.user.username });
        const res = await adminWS.waitFor((m) => m.type === "action response");

        console.log(`[cleanup] ${res.payload.message}`);
        adminWS.close();
    });

    describe("Get All Device Info", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("get all device info");
            const res = await adminWS.waitFor((m) => m.type === "device info");

            expect(res.payload).toHaveProperty("devices");
            expect(Array.isArray(res.payload.devices)).toBe(true);

            for (const device of res.payload.devices) {
                expect(device).toHaveProperty("id");
                expect(device).toHaveProperty("ip");
                expect(device).toHaveProperty("users");
                expect(typeof device.id).toBe("string");
                expect(typeof device.ip).toBe("string");
                expect(Array.isArray(device.users)).toBe(true);
            }

            devices = res.payload.devices;
            console.log(devices);
        });

        it("permission denied for users", async () => {
            userWS.send("get all device info");
            const res = await userWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 403,
                    message: "Permission denied!",
                },
            });
        });
    });
});
