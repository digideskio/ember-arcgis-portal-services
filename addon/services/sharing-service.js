import { deprecate } from '@ember/application/deprecations';
import { A } from '@ember/array';
import { debug } from '@ember/debug';
import { reject, resolve } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import serviceMixin from '../mixins/service-mixin';
import { 
  setItemAccess, 
  shareItemWithGroup,
  unshareItemWithGroup,
} from '@esri/arcgis-rest-sharing';

export default Service.extend(serviceMixin, {

  itemService: service('items-service'),
  groupService: service('groups-service'),

  /**
   * Set access
   * access options null | org | everyone
   */
  setAccess (owner, itemId, access = null, portalOpts) {
    if (access === 'everyone') {
      access = 'public';
    }

    const args = this.addOptions({
      id: itemId,
      owner,
      access,
    }, portalOpts);

    return setItemAccess(args);
  },

  /**
   * Share an item with a group, optionally with item control
   */
  shareWithGroup (owner, itemId, groupId, confirmItemControl = false, portalOpts) {
    debugger;
    const args = this.addOptions({
      id: itemId,
      owner,
      groupId,
      confirmItemControl
    }, portalOpts);

    return shareItemWithGroup(args);
  },
  
  /**
   * Unshare item with a group
   */
  unShareWithGroup (owner, itemId, groupId, portalOpts) {
    const args = this.addOptions({
      id: itemId,
      owner,
      groupId,
      confirmItemControl
    }, portalOpts);

    return unshareItemWithGroup(args);
  },

  /**
   * Deprecated but proxy to the new callls
   */
  shareItemWithEveryone (owner, itemId, portalOpts) {
    deprecate('use .setAccess(owner,itemId, access).', false, {id: 'shareWithEveryoneDeprecation', until: '10.0.0'});
    return this.setAccess(owner, itemId, 'everyone', portalOpts);
  },

  shareItemWithOrg (owner, itemId, portalOpts) {
    deprecate('use .setAccess(owner,itemId, access).', false, {id: 'shareWithEveryoneDeprecation', until: '10.0.0'});
    return this.setAccess(owner, itemId, 'org', portalOpts);
  },

  /**
   * Deprecated without proxies to new calls
   */
  shareItemsWithGroups (/* owner, items, groups */) {
    deprecate('use .shareWithGroup(owner,itemId, groupId, confirmItemControl).', false, {id: 'shareItemsWithGroupsDeprecation', until: '10.0.0'});
    return reject('sharing-service::shareItemsWithGroups is Deprecated. Use .shareItemWithGroup(owner,itemId, groupId, confirmItemControl).');
  },
  //
  shareItemsWithControl (/* owner, items, groups */) {
    deprecate('use .shareWithGroup(owner,itemId, groupId, confirmItemControl).', false, {id: 'shareItemsWithControlDeprecation', until: '10.0.0'});
    return reject('sharing-service::shareItemsWithControl is Deprecated. Use .shareItemWithGroup(owner,itemId, groupId, confirmItemControl).');
  },
  //
  shareItems (/* options */) {
    deprecate('use .shareItemWithGroup(...) or .setAccess(...)', false, {id: 'shareItemsDeprecation', until: '10.0.0'});
    return reject('sharing-service::shareItemsWithControl is Deprecated. Use .shareItemWithGroup(...) or .setAccess(...)');
  },

  /**
   * Shared logic for POST operations
   */
  _post (urlPath, data, portalOpts) {
    const options = {
      method: 'POST',
      data: data
    };

    return this.request(urlPath, options, portalOpts);
  },

});
