const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const UserServiceClient = require("../../api/userService"); 
// Configure Pact Mock Service
const provider = new Pact({
  consumer: "ConsumerApp",
  provider: "UserService",
  port: 4000,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "info",
});

describe("User Service Pact Test", () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe("when a request for user with id 1 is made", () => {
    beforeAll(() => {
      return provider.addInteraction({
        state: "user with id 1 exists",
        uponReceiving: "a request for user with id 1",
        withRequest: {
          method: "GET",
          path: "/users/1",
          headers: {
            "Accept": "application/json"
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            id: 1,
            name: "John Doe"
          }
        }
      });
    });

    test("should return the user data", async () => {
      const client = new UserServiceClient(provider.mockService.baseUrl);
      const response = await client.getUserById(1);

      expect(response.success).toBe(true);
      expect(response.data).toEqual({
        id: 1,
        name: "John Doe"
      });
    });
  });
});
describe("when requesting user with email field", () => {
  beforeAll(() => {
    return provider.addInteraction({
      state: "user with id 1 exists with email",
      uponReceiving: "a request for user with id 1 expecting email",
      withRequest: {
        method: "GET",
        path: "/users/1",
        headers: {
          "Accept": "application/json"
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com"  // NEW FIELD!
        }
      }
    });
  });

  test("should return user with email", async () => {
    const client = new UserServiceClient(provider.mockService.baseUrl);
    const response = await client.getUserById(1);

    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('email');
    expect(response.data.email).toContain('@');
  });
});