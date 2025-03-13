import React from 'react';
import { utilityApps } from './apps/utility';
import { ecommerceApps } from './apps/ecommerce';
import { consultingApps } from './apps/consulting';
import { chamberApps } from './apps/chamber';
import { associationApps } from './apps/association';
import { logisticsApps } from './apps/logistics';

// Combined apps for the main grid
export const kiApps = [
  ...utilityApps,
  ...ecommerceApps,
  ...consultingApps,
  ...chamberApps,
  ...associationApps,
  ...logisticsApps
];

export {
  utilityApps,
  ecommerceApps,
  consultingApps,
  chamberApps,
  associationApps,
  logisticsApps
};