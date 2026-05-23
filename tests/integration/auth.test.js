import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as authService from "../../src/service/api";
import { send, useWebSocket } from "../../src/hooks/useWebSocket";

const HTTP_URL = "http://localhost:8081";

describe("Authentication API", () => {

  const testUser = {
    username: "test",
    password: "testtest",
  }
  let accessToken = null;

  afterAll(async () => {
    console.log("access token after all tests", accessToken);
    if (!accessToken) return;

    try {
      const { send } = useWebSocket(true, accessToken);
      await send.deleteUser(testUser.username);
    } catch (err) {
      console.log(err);
    }
  })

  describe("/signup", () => {

    it("Successful Signup", async () => {
      const res = await authService.auth("signup", testUser);
      console.log(res);
      expect(res.success).toBeTruthy();
      expect(typeof res.accessToken).toBe("string");
      expect(res.accessToken).toBeDefined();
    });

    it("Attempt to sign up with existing username", async () => {
      const res = await authService.auth("signup", testUser);
      console.log(res);
      expect(res.success).toBeTruthy();
      expect(typeof res.accessToken).toBe("string");
      expect(res.accessToken).toBeDefined();
    });

  })

  describe("/logout", () => {

    it("Successful Logout", async () => {
      const res = await authService.logout();
      console.log(res);
      expect(res.success).toBeTruthy();      
    });
  })


  describe("/login", () => {

    it("Invalid Credentials", async () => {
      const res = await authService.auth("login", { username: "test", password: "123" });
      console.log(res);
      expect(res.success).toBeFalsy();
      expect(typeof res.error).toBe("string");
      expect(res.error).toBe("Invalid credentials")
      expect(res.accessToken).toBeUndefined();
    });

    it("Successful Login", async () => {
      const res = await authService.auth("login", testUser);
      console.log(res);
      expect(res.success).toBeTruthy();
      expect(typeof res.accessToken).toBe("string");
      expect(res.accessToken).toBeDefined();

      accessToken = res.accessToken;
    });

  })

});