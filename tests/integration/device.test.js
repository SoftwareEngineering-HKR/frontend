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
    let testDeviceId;

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
            testDeviceId = res.payload.devices[0].id;
            console.log(devices);
            console.log(testDeviceId);
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

    describe("Update Device Name and Description", { sequential: true }, () => {
        const newDeviceInfo = {
            name: "newDeviceName",
            description: "new device description",
        };

        it("success", async () => {
            adminWS.send("update device", {
                id: testDeviceId,
                name: newDeviceInfo.name,
                description: newDeviceInfo.description,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: `Successfully updated device ${testDeviceId}.`,
                },
            });

            // refresh device info
            adminWS.send("get all device info");
            const deviceRes = await adminWS.waitFor(
                (m) => m.type === "device info",
            );
            devices = deviceRes.payload.devices;

            expect(devices[0].name).toBe(newDeviceInfo.name);
            expect(devices[0].description).toBe(newDeviceInfo.description);
        });

        it("permission denied for users", async () => {
            userWS.send("update device", {
                id: testDeviceId,
                name: newDeviceInfo.name,
                description: newDeviceInfo.description,
            });
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
