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
    let initialDevices;

    // log in as admin to be able to perform all device management actions
    // create user to test that users are not allowed to perform device actions
    beforeAll(async () => {
        try {
            const adminRes = await authService.auth("login", TEST_USERS.admin);
            adminWS = createWsClient(adminRes.accessToken);
            const res = adminWS.waitFor((m) => m.type === "initial devices");
            initialDevices = res.payload.devices;
            console.log(initialDevices);

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
});
