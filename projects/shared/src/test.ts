// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/testing';
// tslint:disable-next-line: ordered-imports
import { getTestBed } from '@angular/core/testing';
import {
  platformBrowserDynamicTesting,
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.(spec|pact)\.ts$/);
// And load the modules.
context.keys().map(context);