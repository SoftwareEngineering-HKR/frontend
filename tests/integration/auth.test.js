import { describe, it, expect, afterAll } from "vitest";
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

describe("Authentication API", { sequential: true }, () => {
    describe("/signup", { sequential: true }, () => {
        it("Successful Signup", async () => {
            const res = await authService.auth("signup", TEST_USERS.user);

            expect(res.success).toBeTruthy();
            expect(typeof res.accessToken).toBe("string");
            expect(res.accessToken).toBeDefined();
        });

        it("Attempt to sign up with existing username", async () => {
            const res = await authService.auth("signup", TEST_USERS.user);

            expect(res.success).toBeFalsy();
            expect(typeof res.accessToken).toBe("undefined");
            expect(res.accessToken).toBeUndefined();
        });
    });

    describe("/login", { sequential: true }, () => {
        it("Invalid Credentials", async () => {
            const res = await authService.auth("login", {
                username: "test",
                password: "123",
            });

            expect(res.success).toBeFalsy();
            expect(typeof res.error).toBe("string");
            expect(res.error).toBe("Invalid credentials");
            expect(res.accessToken).toBeUndefined();
        });

        it("Successful Login", async () => {
            const res = await authService.auth("login", TEST_USERS.user);
            expect(res.success).toBeTruthy();
            expect(typeof res.accessToken).toBe("string");
            expect(res.accessToken).toBeDefined();
        });
    });

    // log in as admin to delete test user at the end of tests
    afterAll(async () => {
        try {
            let res = await authService.auth("login", TEST_USERS.admin);
            const ws = createWsClient(res.accessToken);
            const promise = ws.waitFor((m) => m.type === "action response");
            await ws.send("delete user", { name: TEST_USERS.user.username });
            res = await promise;
            console.log(`[cleanup] ${res.payload.message}`);
            ws.close();
        } catch (err) {
            console.warn(
                `[cleanup] Could not delete test user: ${err.message}`,
            );
        }
    });
});
