import React from "react";

export default function Links() {

  const adobeLink = event => {
    window.alloy("event", {
      eventType: "web.webinteraction.linkClicks",
      beacon: true,
      data: {
        "activitystreams:href": ["http://www.adobe.com"]
      }
    });
  };

  return (
    <div>
      <h2>Links</h2>
      <p>This page tests collecting events on link clicking.  For example, this link: 
      <a onClick={adobeLink} href="http://www.adobe.com">Adobe</a> should trigger a sendBeacon call 
      in browsers that support beacons</p>
    </div>
  );
}