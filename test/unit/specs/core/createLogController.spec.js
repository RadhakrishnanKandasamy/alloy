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

import createLogController from "../../../../src/core/createLogController";

const instanceNamespace = "alloy123";

describe("createLogController", () => {
  let console;
  let locationSearch;
  let logger;
  let createLogger;
  let getDebugEnabled;
  let sessionStorage;
  let createNamespacedStorage;

  beforeEach(() => {
    console = { log() {} };
    locationSearch = "";
    logger = { log() {} };
    createLogger = jest.fn((_, _getDebugEnabled) => {
      getDebugEnabled = _getDebugEnabled;
      return logger;
    });
    sessionStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn()
    };
    createNamespacedStorage = jest.fn(() => ({
      session: sessionStorage
    }));
  });

  test("creates a namespaced storage", () => {
    createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });
    expect(createNamespacedStorage).toHaveBeenCalledWith("instance.alloy123.");
  });

  test("returns false for getDebugEnabled if storage item is not found", () => {
    createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });
    expect(getDebugEnabled()).toBe(false);
  });

  test("returns false for getDebugEnabled if storage item is false", () => {
    sessionStorage.getItem = () => "false";
    createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });
    expect(getDebugEnabled()).toBe(false);
  });

  test("returns true for getDebugEnabled if storage item is true", () => {
    sessionStorage.getItem = () => "true";
    createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });
    expect(getDebugEnabled()).toBe(true);
  });

  test("persists changes to debugEnabled if not set from config", () => {
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    logController.setDebugEnabled(true, { fromConfig: false });
    expect(sessionStorage.setItem).toHaveBeenCalledWith("debug", "true");
    expect(getDebugEnabled()).toBe(true);
  });

  test("does not persist changes to debugEnabled if set from config", () => {
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    logController.setDebugEnabled(true, { fromConfig: true });
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(getDebugEnabled()).toBe(true);
  });

  test("does not change debugEnabled from config if previously changed from something other than config on same page load", () => {
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    logController.setDebugEnabled(true, { fromConfig: false });
    logController.setDebugEnabled(false, { fromConfig: true });
    expect(sessionStorage.setItem).toHaveBeenCalledWith("debug", "true");
    expect(sessionStorage.setItem).not.toHaveBeenCalledWith("debug", "false");
    expect(getDebugEnabled()).toBe(true);
  });

  test("does not change debugEnabled from config if previously changed from something other than config on previous page load", () => {
    sessionStorage.getItem = () => "true";
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    logController.setDebugEnabled(false, { fromConfig: true });
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(getDebugEnabled()).toBe(true);
  });

  test("sets debugEnabled to true if query string parameter set to true", () => {
    locationSearch = "?alloy_debug=true";
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    // Make sure setting debugEnabled from config can't override it.
    logController.setDebugEnabled(false, { fromConfig: true });
    expect(sessionStorage.setItem).toHaveBeenCalledWith("debug", "true");
    expect(sessionStorage.setItem.mock.calls.length).toBe(1);
    expect(getDebugEnabled()).toBe(true);
  });

  test("sets debugEnabled to false if query string parameter set to false", () => {
    locationSearch = "?alloy_debug=false";
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    // Make sure setting debugEnabled from config can't override it.
    logController.setDebugEnabled(true, { fromConfig: true });
    expect(sessionStorage.setItem).toHaveBeenCalledWith("debug", "false");
    expect(sessionStorage.setItem.mock.calls.length).toBe(1);
    expect(getDebugEnabled()).toBe(false);
  });

  test("creates a logger", () => {
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });

    expect(createLogger).toHaveBeenCalledWith(
      console,
      expect.any(Function),
      "[alloy123]"
    );
    expect(logController.logger).toBe(logger);
  });

  test("creates a component logger", () => {
    const logController = createLogController({
      console,
      locationSearch,
      createLogger,
      instanceNamespace,
      createNamespacedStorage
    });
    const componentLogger = {};
    createLogger.mockReturnValue(componentLogger);
    const result = logController.createComponentLogger("Personalization");

    expect(createLogger).toHaveBeenCalledWith(
      console,
      getDebugEnabled,
      "[alloy123] [Personalization]"
    );
    expect(result).toBe(componentLogger);
  });
});
