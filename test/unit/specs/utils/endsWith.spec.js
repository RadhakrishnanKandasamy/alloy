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

import endsWith from "../../../../src/utils/endsWith";

const str = "The quick brown fox.";

describe("endsWith", () => {
  ["The quick brown fox.", "fox."].forEach(suffix => {
    test(`returns true when suffix is ${suffix}`, () => {
      expect(endsWith(str, suffix)).toBe(true);
    });
  });

  ["Extra The quick brown fox.", "bogus."].forEach(suffix => {
    test(`returns false when suffix is ${suffix}`, () => {
      expect(endsWith(str, suffix)).toBe(false);
    });
  });
});
