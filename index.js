/* Copyright 2017-2018 Esri - Apache 2.0 */

/* jshint node: true */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-arcgis-portal-services',
  isDevelopingAddon: function () {
    return false;
  },

  included (/* app */) {
    this._super.included.apply(this, arguments);
    // bundle scripts from vendor folder
    this.import('vendor/@esri/arcgis-rest-request/request.umd.js');
    this.import('vendor/@esri/arcgis-rest-auth/auth.umd.js');
    this.import('vendor/@esri/arcgis-rest-sharing/sharing.umd.js');
    this.import('vendor/@esri/arcgis-rest-items/items.umd.js');
    this.import('vendor/shims/@esri/arcgis-rest-auth.js');
    this.import('vendor/shims/@esri/arcgis-rest-request.js');
    this.import('vendor/shims/@esri/arcgis-rest-sharing.js');
    this.import('vendor/shims/@esri/arcgis-rest-items.js');
  },

  treeForVendor (vendorTree) {
    var arcgisRequestTree = new Funnel(path.dirname(require.resolve('@esri/arcgis-rest-request/dist/umd/request.umd.js')), {
      files: ['request.umd.js', 'request.umd.js.map'],
      destDir: '@esri/arcgis-rest-request'
    });

    var arcgisAuthTree = new Funnel(path.dirname(require.resolve('@esri/arcgis-rest-auth/dist/umd/auth.umd.js')), {
      files: ['auth.umd.js', 'auth.umd.js.map'],
      destDir: '@esri/arcgis-rest-auth'
    });

    var arcgisSharingTree = new Funnel(path.dirname(require.resolve('@esri/arcgis-rest-sharing/dist/umd/sharing.umd.js')), {
      files: ['sharing.umd.js', 'sharing.umd.js.map'],
      destDir: '@esri/arcgis-rest-sharing'
    });

    var arcgisItemsTree = new Funnel(path.dirname(require.resolve('@esri/arcgis-rest-items/dist/umd/items.umd.js')), {
      files: ['items.umd.js', 'items.umd.js.map'],
      destDir: '@esri/arcgis-rest-items'
    });

    var treesToMerge = [arcgisRequestTree, arcgisAuthTree, arcgisSharingTree, arcgisItemsTree];
    // if we got a vendorTree, and add it in
    if (vendorTree) {
      treesToMerge.unshift(vendorTree);
    }

    return new MergeTrees(treesToMerge);
  }
};
