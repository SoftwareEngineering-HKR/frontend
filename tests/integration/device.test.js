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
    let testDevice;
    let newRoom;
    let users;

    // log in as admin to be able to perform all device management actions
    // create user to test that users are not allowed to perform device actions
    beforeAll(async () => {
        try {
            const adminRes = await authService.auth("login", TEST_USERS.admin);
            adminWS = createWsClient(adminRes.accessToken);

            const userRes = await authService.auth("signup", TEST_USERS.user);
            userWS = createWsClient(userRes.accessToken);

            // create new room
            adminWS.send("create room", { room: "test_room" });
            await adminWS.waitFor((m) => m.type === "action response");
            adminWS.send("get all rooms");
            const roomsRes = await adminWS.waitFor((m) => m.type === "rooms");
            newRoom = roomsRes.payload.rooms[0];
            console.log(newRoom);

            // get users (with IDs)
            adminWS.send("get users");
            const usersRes = await adminWS.waitFor((m) => m.type === "users");
            users = usersRes.payload.users;

            console.log(users);

            // assign a light to user
            adminWS.send("add user to device", {
                userId: users[0].id, // this is the admin user
                deviceId: "023DDB9F66B7",
            });
            let res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );
            console.log("assigning light to admin");
            console.log(res);
        } catch (err) {
            console.warn(
                `[setup] Could not set up initial logins ${err.message}`,
            );
        }
    });

    afterAll(async () => {
        userWS.close();

        // delete test user and test room at the end
        adminWS.send("delete user", { name: TEST_USERS.user.username });
        await adminWS.waitFor((m) => m.type === "action response");

        adminWS.send("delete room", { id: newRoom.id });
        await adminWS.waitFor((m) => m.type === "action response");

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
            testDevice = res.payload.devices.find(
                (d) => d.id !== "023DDB9F66B7",
            );
            console.log(devices);
            console.log(testDevice);
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
                id: testDevice.id,
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
                    message: `Successfully updated device ${testDevice.id}.`,
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

        it("failure on non-existent device", async () => {
            adminWS.send("update device", {
                id: "fakeDeviceID",
                name: newDeviceInfo.name,
                description: newDeviceInfo.description,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message: "Failed to update device!",
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("update device", {
                id: testDevice.id,
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

    describe("Update Device Room", { sequential: true }, async () => {
        it("success", async () => {
            adminWS.send("update device room", {
                deviceId: testDevice.id,
                roomId: newRoom.id,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: `Successfully updated ${testDevice.id}'s room.`,
                },
            });

            // refresh device info
            adminWS.send("get all device info");
            const deviceRes = await adminWS.waitFor(
                (m) => m.type === "device info",
            );
            devices = deviceRes.payload.devices;
            testDevice = devices.find((d) => d.id === testDevice.id);

            console.log(testDevice);

            expect(testDevice.room).toBe(newRoom.name);
        });

        it("failure on non-existent room", async () => {
            // create fake UUID, otherwise the test "passes" for incorrect reasons
            const fakeRoomUUID = "8cf2fed6-9f3e-41d5-b18b-6ee458996b3b";

            adminWS.send("update device room", {
                deviceId: testDevice.id,
                roomId: fakeRoomUUID,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message: "Failed to update device room!",
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("update device room", {
                deviceId: testDevice.id,
                roomId: newRoom.id,
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

    describe("Assign Device to User", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("add user to device", {
                userId: users[0].id,
                deviceId: testDevice.id,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "Successfully assigned device to user!",
                },
            });

            // refresh devices
            adminWS.send("get all device info");
            const deviceRes = await adminWS.waitFor(
                (m) => m.type === "device info",
            );
            devices = deviceRes.payload.devices;
            testDevice = devices.find((d) => d.id === testDevice.id);

            expect(testDevice.users).toContainEqual(users[0]);
        });

        it("permission denied for users", async () => {
            userWS.send("add user to device", {
                userId: users[1].id,
                deviceId: testDevice.id,
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

    describe("Update Device Value", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("update value", {
                deviceId: "023DDB9F66B7", // hardcoded a light ID
                value: 1, // turns the light on
            });
            const res = await adminWS.waitFor((m) => m.type === "update value");

            expect(res).toMatchObject({
                type: "update value",
                payload: {
                    deviceID: "023DDB9F66B7",
                    content: "1",
                },
            });
        });
    });

    describe("Remove Own Device Association", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("delete yourself from device", {
                deviceId: "023DDB9F66B7", // hardcoded a light ID
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "Successfully deleted user from device!",
                },
            });
        });
    });

    describe("Unassign Device to User", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("delete user from device", {
                userId: users[0].id,
                deviceId: testDevice.id,
            });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: "Successfully deleted user from device!",
                },
            });

            // refresh devices
            adminWS.send("get all device info");
            const deviceRes = await adminWS.waitFor(
                (m) => m.type === "device info",
            );
            devices = deviceRes.payload.devices;
            testDevice = devices.find((d) => d.id === testDevice.id);

            expect(testDevice.users).not.toContainEqual(users[0]);
        });

        it("permission denied for users", async () => {
            userWS.send("delete user from device", {
                userId: users[1].id,
                deviceId: testDevice.id,
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

    describe("Delete Device", { sequential: true }, () => {
        it("success", async () => {
            adminWS.send("delete device", { id: testDevice.id });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 200,
                    message: `Successfully deleted device ${testDevice.id}.`,
                },
            });
        });

        it("failure to delete non-existent device", async () => {
            adminWS.send("delete device", { id: "fakeDeviceID" });
            const res = await adminWS.waitFor(
                (m) => m.type === "action response",
            );

            expect(res).toMatchObject({
                type: "action response",
                payload: {
                    statusCode: 500,
                    message: "Failed to delete device!",
                },
            });
        });

        it("permission denied for users", async () => {
            userWS.send("delete device", { id: "fakeDeviceID" });
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
