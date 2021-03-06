/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type TimelineTerminal$ref = any;
type TimelineTitle$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TimelineDeparture_routeStop$ref: FragmentReference;
export type TimelineDeparture_routeStop = {|
  +$fragmentRefs: TimelineTitle$ref & TimelineTerminal$ref,
  +$refType: TimelineDeparture_routeStop$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "TimelineDeparture_routeStop",
  "type": "RouteStop",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TimelineTitle",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TimelineTerminal",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '152d1d04d2d2cd4c8def6fccb8fb9f15';
module.exports = node;
