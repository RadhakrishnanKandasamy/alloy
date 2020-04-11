/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { defer } from "../../../../../src/utils";
import createPersonalization from "../../../../../src/components/Personalization";
import createConfig from "../../../../../src/core/config/createConfig";
import {
  PAGE_WIDE_SCOPE_DECISIONS_WITH_DOM_ACTION_SCHEMA_ITEMS,
  PAGE_WIDE_SCOPE_DECISIONS_WITHOUT_DOM_ACTION_SCHEMA_ITEMS,
  SCOPES_FOO1_FOO2_DECISIONS
} from "./responsesMock/eventResponses";

describe("Personalization", () => {
  const config = createConfig({ prehidingStyle: "" });
  const logger = {
    log() {},
    warn() {}
  };
  const eventManager = {
    createEvent() {},
    sendEvent() {}
  };

  let event;
  let response;

  beforeEach(() => {
    event = jasmine.createSpyObj("event", ["mergeQuery"]);
    response = jasmine.createSpyObj("response", ["getPayloadsByType"]);
  });

  it("should return an array of decisions in lifecycle::onResponse for provided decisions scopes", () => {
    const decisionsScopes = ["Foo1", "Foo3"];

    response.getPayloadsByType.and.returnValue(SCOPES_FOO1_FOO2_DECISIONS);

    const personalization = createPersonalization({
      config,
      logger,
      eventManager
    });

    const deferred = defer();
    const onResponse = func => {
      deferred.resolve(func({ response }));
    };

    personalization.lifecycle.onBeforeEvent({
      event,
      decisionsScopes,
      onResponse
    });

    return expectAsync(deferred.promise).toBeResolvedTo({
      decisions: SCOPES_FOO1_FOO2_DECISIONS
    });
  });

  it("should return an array of not rendered decisions in lifecycle::onResponse for provided decision scopes and the page wide scope", () => {
    const renderDecisionsEnabled = true;
    const decisionsScopes = ["Foo1", "Foo3"];
    const decisions = SCOPES_FOO1_FOO2_DECISIONS.concat(
      PAGE_WIDE_SCOPE_DECISIONS_WITH_DOM_ACTION_SCHEMA_ITEMS
    );
    response.getPayloadsByType.and.returnValue(decisions);

    const expectedResponse = SCOPES_FOO1_FOO2_DECISIONS.concat(
      PAGE_WIDE_SCOPE_DECISIONS_WITHOUT_DOM_ACTION_SCHEMA_ITEMS
    );
    const personalization = createPersonalization({
      config,
      logger,
      eventManager
    });

    const deferred = defer();
    const onResponse = func => {
      const result = func({ response });

      deferred.resolve(result);
    };

    personalization.lifecycle.onBeforeEvent({
      event,
      renderDecisionsEnabled,
      decisionsScopes,
      onResponse
    });

    return expectAsync(deferred.promise).toBeResolvedTo({
      decisions: expectedResponse
    });
  });
});
