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

import { fireReferrerHideableImage } from "../../utils";
import processIdSyncsFactory from "./processIdSyncsFactory";
import configValidators from "./configValidators";

import createComponent from "./createComponent";

const createIdentity = ({
  config,
  logger,
  consent,
  eventManager,
  sendEdgeNetworkRequest
}) => {
  const processIdSyncs = processIdSyncsFactory({
    fireReferrerHideableImage,
    logger
  });
  return createComponent(
    processIdSyncs,
    config,
    logger,
    consent,
    eventManager,
    sendEdgeNetworkRequest
  );
};

createIdentity.namespace = "Identity";
createIdentity.configValidators = configValidators;

export default createIdentity;
