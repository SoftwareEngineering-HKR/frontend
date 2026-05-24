import { describe, it, expect, afterAll, beforeAll } from "vitest";
import * as authService from "../../src/service/api";
import { createWsClient } from "./wsHelper";

const TEST_USERS = {
    user: {
        username: "test_user",
        password: "testtest",
    },
    admin: {
        username: "admin",
        password: "password",
    },
};

describe("Room-related WebSocket Messages", { sequential: true }, () => {
    let adminWS;
    let userWS;
    let testRoomId;

    // log in as admin to be able to perform all room management actions
    // log in as user to test that users are not allowed to perform room actions
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

        adminWS.send("delete user", { name: TEST_USERS.user.username });
        const res = await adminWS.waitFor((m) => m.type === "action response");

        console.log(`[cleanup] ${res.payload.message}`);

        adminWS.close();
    });

    describe("Create Room", { sequential: true }, () => {
        const testRoomName = "test_room";
        it("success", async () => {
            adminWS.send("create room", { room: testRoomName });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: `Successfully created room ${testRoomName}.`,
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("create room", { room: testRoomName });
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

    describe("Get Rooms", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("get all rooms");
            const res = await adminWS.waitFor((m) => m.type === "rooms");

            expect(res.payload).toHaveProperty("rooms");
            expect(Array.isArray(res.payload.rooms)).toBe(true);

            console.log(res.payload.rooms);

            for (const room of res.payload.rooms) {
                expect(room).toHaveProperty("id");
                expect(room).toHaveProperty("name");
                expect(typeof room.id).toBe("string");
                expect(typeof room.name).toBe("string");
            }

            testRoomId = res.payload.rooms.at(-1)?.id;
            expect(testRoomId).toBeDefined();
        });
    });

    describe("Delete Room", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("delete room", { id: testRoomId });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: `Successfully deleted room ${testRoomId}.`,
                },
            });
        });

        it("failure to delete non-existent room", async () => {
            adminWS.send("delete room", { id: "fakeRoomId" });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message: "Failed to delete room!",
                },
            });
        });

        it("permission denied to delete room", async () => {
            userWS.send("delete room", { id: "fakeRoomId" });
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
