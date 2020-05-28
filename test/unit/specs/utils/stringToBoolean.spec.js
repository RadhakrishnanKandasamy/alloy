import { stringToBoolean } from "../../../../src/utils";

describe("stringToBoolean", () => {
  ["true", "TRUE", "True"].forEach(str => {
    test(`parses '${str}' as true`, () => {
      expect(stringToBoolean(str)).toBe(true);
    });
  });

  ["false", "0", "foo", ""].forEach(str => {
    test(`parses '${str}' as false`, () => {
      expect(stringToBoolean(str)).toBe(false);
    });
  });
});
