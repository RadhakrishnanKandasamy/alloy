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

import initializeComponents from "../../../../src/core/initializeComponents";

describe("initializeComponents", () => {
  let lifecycle;
  let componentRegistry;
  let componentByNamespace;
  let componentCreators;
  let getImmediatelyAvailableTools;

  beforeEach(() => {
    lifecycle = {
      onComponentsRegistered: jest.fn(() => Promise.resolve())
    };
    componentRegistry = {
      register: jest.fn()
    };
    componentByNamespace = {
      Comp1: {},
      Comp2: {}
    };
    const componentCreator1 = jest.fn(() => componentByNamespace.Comp1);
    componentCreator1.namespace = "Comp1";
    const componentCreator2 = jest.fn(() => componentByNamespace.Comp2);
    componentCreator2.namespace = "Comp2";
    componentCreators = [componentCreator1, componentCreator2];

    getImmediatelyAvailableTools = componentNamespace => {
      return {
        tool1: {
          name: "tool1",
          componentNamespace
        },
        tool2: {
          name: "tool2",
          componentNamespace
        }
      };
    };
  });

  test("creates and registers components", () => {
    const initializeComponentsPromise = initializeComponents({
      componentCreators,
      lifecycle,
      componentRegistry,
      getImmediatelyAvailableTools
    });

    componentCreators.forEach(componentCreator => {
      const { namespace } = componentCreator;
      expect(componentCreator).toHaveBeenCalledWith({
        tool1: {
          name: "tool1",
          componentNamespace: componentCreator.namespace
        },
        tool2: {
          name: "tool2",
          componentNamespace: componentCreator.namespace
        }
      });
      expect(componentRegistry.register).toHaveBeenCalledWith(
        namespace,
        componentByNamespace[namespace]
      );
    });
    expect(lifecycle.onComponentsRegistered).toHaveBeenCalledWith({
      lifecycle
    });

    return initializeComponentsPromise.then(result => {
      expect(result).toBe(componentRegistry);
    });
  });

  test("throws error if component throws error during creation", () => {
    componentCreators[1].mockImplementation(() => {
      throw new Error("thrownError");
    });

    expect(() => {
      initializeComponents({
        componentCreators,
        lifecycle,
        componentRegistry,
        getImmediatelyAvailableTools
      });
    }).toThrowError(/\[Comp2\] An error occurred during component creation./);
  });
});
