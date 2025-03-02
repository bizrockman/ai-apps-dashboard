import { utilityApps } from './utility';
import { ecommerceApps } from './ecommerce';
import { consultingApps } from './consulting';
import { chamberApps } from './chamber';
import { associationApps } from './association';
import { logisticsApps } from './logistics';
import { constructionApps } from './construction';

export {
  utilityApps,
  ecommerceApps,
  consultingApps,
  chamberApps,
  associationApps,
  logisticsApps,
  constructionApps
};

// Combined apps for the main grid
export const kiApps = [
  ...utilityApps,
  ...ecommerceApps,
  ...consultingApps,
  ...chamberApps,
  ...associationApps,
  ...logisticsApps,
  ...constructionApps
];