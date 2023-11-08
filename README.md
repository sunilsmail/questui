# APPOINTMENT-UI

1. This project was created from [angularstarterkit-ui](https://git01.ops.medplus.com/myquest/angularstarterkit-ui.git) 

2. The above project [angularstarterkit-ui](https://git01.ops.medplus.com/myquest/angularstarterkit-ui.git) was generated with [Angular CLI](https://github.com/angular/angular-cli)

##Local Setup

1. google-key.service.ts
   uncocmment - this.configKey = 'AIzaSyB4fgYeb2KIF0HnF8oOdr04m7Sc1jo2RnU';
   npm install @qdx-billingweb/websdk@2.0.1 --registry=http://cdrepo01.ops.medplus.com:8080/artifactory/api/npm/qdx-npm/

## Points to note: 

### JSON: 

1. Added JSON according to component or module wise. 

2. If some text is used multiple time’s please keep at the end of the JSON after the buttons. Please don’t repeat the text.

## Installation
1.Run `npm install` and check the nodemodules.

## Development server
1. Run `ng serve appointment --port 4002` for a local development server to load UI Screens. Navigate to `http://localhost:4002/`. The app will automatically reload if you change any of the source files.

2. Run `ng serve appointment --port 4002 --proxy-config proxy.conf.json` or `npm run start:appointment` for a local development to load UI Screens and connect to backend to make service calls. Navigate to `http://localhost:4002/`. The app will automatically reload if you change any of the source files.

## Angular Workspace
This Angular [workspace][ng-workspace] contains multiple applications, as well as a shared code library that is used throughout all projects. Applications are under `projects/*` and shared modules are in `projects/shared`.

[ng-workspace]: https://github.com/angular/angular-cli/wiki/angular-workspace

## Code scaffolding

Run `ng generate component component-name[ --project=appointment|shared]` or for shared folder `ng generate component component-name[ --module= shared]` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`. Be sure to specify the project if you do not want it generated in the default.

## Monorepo Project Structure and Conventions

This repo is a monorepo that consists of 2 projects, appointment and Shared (a shared lib of services, components, directives, etc that can be shared across each project).

### appointment-ui

`projects/appointment` 

This is the bootstrap for the `appointment` application.

The only thing the lives in this project are the modules that are specific to the `appointment` Project.

### Shared (lib)

`projects/shared` 

This is where all shared resources live (listed below):
* Modules (both normal feature modules and Routing modules)
* Components
* Services
* Directives
* Guards
* Pipes
* Styles
* Utils
* Assets
* Spec Helpers
* Http Mocks

### General Folder Structure

#### Routing Modules
```
|-- modules
  |-- home
      |-- [+] components (shared components within module but not application)
      |-- home-routing.module.ts
      |-- home.module.ts
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Testing

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Contract tests
Contract tests allow us to decouple development of frontend and backend code while also verifying compatibility. We use [Pact](https://docs.pact.io/) to implement our tests. New contract tests should live next to the service communicating with a backend and have the name like `my.service.pact.ts`. A Pact mock server is started by Karma when running `ng test`. This server can be used to test expected interactions with a backend. The mock server log is written to `pacts/*_pact_server.log` and useful test failure information is often found in it.

To publish contract tests to a Pact Broker run _publish-pact-specs.js_:

    $ PACT_BROKER_HOST=http://localhost:8888 TAG=my_contracts ./publish-pact-specs.js

More information about contract tests can be found [here](https://git01.ops.medplus.com/CIT/contract-tests)

## Internationalization (i18n)

### Angular template i18n

* Mark a translatable string `<span i18n>Text content</span>`
* Mark a translatable w/ a custom key `<span i18n="@@customKey">Text content</span>`
* Mark an attribute translatable `<img i18n-alt alt="Alt text">`
* Translate text not enclosed in tag `<ng-container i18n>Translate me!</ng-container>`

### i18n polyfill code translations

See https://github.com/ngx-translate/i18n-polyfill

The API is quite simple, you get a service called `I18n` that takes 2 parameters: the content to translate
and the parameters (optional). It'll return the content translated synchronously.
The signature of the service is:

`I18n: (def: string | I18nDef, params?: {[key: string]: any}) => string`.

The content can be a simple string or an i18n definition:

```ts
I18nDef: {
  value: string;
  id?: string;
  meaning?: string;
  description?: string;
}
```

Example:

```typescript
/app.component.ts
import { Component } from "@angular/core";
import { I18n } from "@ngx-translate/i18n-polyfill";

@Component({
  selector: "app-root",
  template: "./app.component.html"
})
export class AppComponent {
  constructor(i18n: I18n) {
    console.log(i18n("This is a test {{myVar}} !", {myVar: "^_^"}));
  }
}
```

### Extraction

To extract all the translatable strings in your app use `npm run i18n`

This will extract the master translation file `messages.xlf` to `projects/projectname/locale`.
This will also create an `en` translation file `message.en.xlf`. with `<target>` translations that mimic the `<source>` value.

This works by running the default angular cli extraction command 'ng xi18n`. Then runs the i18n polyfil extraction command, and then lastly it uses https://github.com/martinroob/ngx-i18nsupport to generate and update the specific locale file.

Because of how the i18n polyfill library works, you must load the app using a translation file that has translations (a `<target>` for each `<source>`), otherwise the build will fail.

### Serve and Build

Serve or build with custom locale and translation

`ng serve --aot --i18nFile=projects/appointment/app/locale/messages.pt.xlf --i18nFormat=xlf --locale=pt`

## Deployed Environments

1.  Development
2.  QA
3.  Production

| App              | Environment | Branch  | URL                                    |
| ---------------- | ----------- | ------- | -------------------------------------- |
|  appointment-ui  | Development | develop | http://as-dev.mq.questdiagnostics.com/ |
|  appointment-ui  | QA          | release | http://as-qa.mq.questdiagnostics.com/  |
|  appointment-ui  | Production  | master  |                                        |

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
