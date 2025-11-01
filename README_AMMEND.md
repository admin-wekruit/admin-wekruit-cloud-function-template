# Cloud Functions

Wekruit's serverless Google Cloud Functions

## Table of Contents

-   [Cloud Functions](#cloud-functions)
    -   [Table of Contents](#table-of-contents)
    -   [Organization](#organization)
        -   [File Structure](#file-structure)
            -   [`exports`](#exports)
            -   [`helper`](#helper)
            -   [`service`](#service)
            -   [`util`](#util)
        -   [Creating a Cloud Function](#creating-a-cloud-function)

## Environment

This project uses `Node 20`. Make sure you are using this in your node version manager of choice.

## Organization

We use [better-firebase-functions](https://github.com/george43g/better-firebase-functions) to handle the structuring of our cloud functions
to allow for easy deployment without the need of various barrel files.

### File Structure

#### `exports`

The `exports` folder is what is scanned for valid cloud functions. When you are writing a cloud function, make sure it is nested in one of `exports` subfolders.
Do **NOT** make an additional subfolder under a subfolder as the package only scans with a depth of 2 (parent -> subfolder).

#### `helper`

The `helper` folder is used to hold all helper functions that are used across multiple cloud functions, but are not necessarily a cloud function itself.

#### `service`

The `service` folder is used to initialize services such as Firebase, Algolia, and Stripe clients. They are kept separate in their own folder in an effort to reduce the number of times they are initialized across files.

#### `util`

The `util` folder is used to hold utility classes such as BigBatch. These classes are used to extend the functionality of packages used in the project to better fit our needs.

### Creating a Cloud Function

1. Create a new file in one of the `exports` subfolders. The name of this file will be the name of the cloud function.
2. Create a default export that is a member of `firebase-functions` (e.g. `export default functions.https.onCall(...)`).
3. Create your cloud function as you normally would. If you need to use a helper function or service, import it from `@/helper` or `@/service` respectively. [this is not working right now somehow, just refer the path directly]
4. npx eslint --fix .
5. Export your function to the cloud with `firebase deploy --only functions:<NAME>` where `<NAME>` is the name of the file you created in step 1.

### Define environment Variable

#### .env

#### set firebase env in functions

`firebase functions:secrets:set PAYPAL_CLIENT_ID`

#### get env in functions

`firebase functions:secrets:access PAYPAL_CLIENT_ID`
