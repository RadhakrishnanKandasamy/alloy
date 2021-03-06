import { ClientFunction } from "testcafe";
import createFixture from "../../helpers/createFixture";
import orgMainConfigMain from "../../helpers/constants/configParts/orgMainConfigMain";
import configureAlloyInstance from "../../helpers/configureAlloyInstance";

createFixture({
  title:
    'C14410: Setting consent for other purposes, or to other values than "in" or "out" should fail'
});

test.meta({
  ID: "C14410",
  SEVERITY: "P0",
  TEST_RUN: "Regression"
});

const getErrorMessageFromConfigure = ClientFunction(config =>
  window.alloy("configure", config).then(() => undefined, e => e.message)
);

const getErrorMessageFromSetConsent = ClientFunction(consent =>
  window.alloy("setConsent", consent).then(() => undefined, e => e.message)
);

// This test was originally designed to be done using one test case. When the configure command fails
// from the validation to make sure that only once instance has a particular orgId, the validation
// state isn't reset, so when I had this all in one test, the third part here was failing because
// an instance was already configured with that orgId.

test("Test C14410: Configuring default consent to 'out' fails", async t => {
  const errorMessage = getErrorMessageFromConfigure({
    defaultConsent: "out",
    ...orgMainConfigMain
  });
  await t
    .expect(errorMessage)
    .ok("Expected the configure command to be rejected");
  await t.expect(errorMessage).contains("'defaultConsent':");
  await t.expect(errorMessage).contains("'out'");
});

test("Test C14410: Setting consent for unknown purposes fails", async t => {
  await configureAlloyInstance("alloy", {
    defaultConsent: "pending",
    ...orgMainConfigMain
  });
  const errorMessage = getErrorMessageFromSetConsent({
    consent: [
      { standard: "Adobe", version: "1.0", value: { analytics: "pending" } }
    ]
  });
  await t
    .expect(errorMessage)
    .ok("Expected the setConsent command to be rejected");
  await t.expect(errorMessage).contains("general' is a required option");
});

test("Test C14410: Setting consent to 'pending' fails", async t => {
  await configureAlloyInstance("alloy", {
    defaultConsent: "pending",
    ...orgMainConfigMain
  });
  const errorMessage = getErrorMessageFromSetConsent({
    consent: [
      { standard: "Adobe", version: "1.0", value: { general: "pending" } }
    ]
  });
  await t
    .expect(errorMessage)
    .ok("Expected the setConsent command to be rejected");
  await t.expect(errorMessage).contains("'pending'");
});
