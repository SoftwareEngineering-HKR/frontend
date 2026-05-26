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

describe("User-related WebSocket Messages", { sequential: true }, () => {
    let adminWS;
    let userWS;

    // log in as admin to be able to perform all user management actions
    // create user to test that users are not allowed to perform user actions
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

    afterAll(() => {
        userWS.close();
        adminWS.close();
    });

    describe("Get Users", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("get users");
            const res = await adminWS.waitFor((m) => m.type === "users");

            expect(res.payload).toHaveProperty("users");
            expect(Array.isArray(res.payload.users)).toBe(true);
            expect(res.payload.users.length).toBeGreaterThanOrEqual(2);

            console.log(res.payload.users);

            for (const user of res.payload.users) {
                expect(user).toHaveProperty("id");
                expect(user).toHaveProperty("username");
                expect(user).toHaveProperty("type");
                expect(typeof user.id).toBe("string");
                expect(typeof user.username).toBe("string");
                expect(typeof user.type).toBe("string");
            }
        });

        it("permission denied for users", async () => {
            userWS.send("get users");
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

    describe("Update Role", { sequential: true }, () => {
        it("successful promotion (user to admin)", async () => {
            adminWS.send("update user role", {
                name: TEST_USERS.user.username,
                role: "admin",
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "User role updated successfully!",
                },
            });
        });

        it("successful demotion (admin to user)", async () => {
            // test_user was promoted in previous test, so now it should be "admin"
            adminWS.send("update user role", {
                name: TEST_USERS.user.username,
                role: "user",
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "User role updated successfully!",
                },
            });
        });

        it("failure on same role (user to user)", async () => {
            // now test_user is back to being "user"
            adminWS.send("update user role", {
                userName: TEST_USERS.user.username,
                role: "user",
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message:
                        "Error, could not update the user to desired role!",
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("update user role", {
                userName: TEST_USERS.user.username,
                role: "admin",
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

    describe("Delete User", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("delete user", { name: TEST_USERS.user.username });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "Deleted user successfully!",
                },
            });
        });

        it("failure to delete non-existent user", async () => {
            adminWS.send("delete user", { name: "fakeUserName" });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message: "Error in deleting user!",
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("delete user", { name: "fakeUserName" });
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
