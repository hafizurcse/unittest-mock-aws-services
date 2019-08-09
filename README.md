# Mocking AWS Services 

## Library Usage

### 1. NPM install
Cd to your project directory and run the following command:
```
npm install

```
This will install all necessary packages.

### 2. Importing a module
Example: If we want to import `commonFunc` module, then:
```
const commonFunc = require('./../lib/commonFunc');

```

### 3. Test
#### 3.1 Run all tests
Run the following command to run all the tests recursively:
```
npm run test
```
#### 3.2 Test coverage
For coverage:
```
npm run coverage
```
### 4. Linting

To find out linting errors:

```
eslint ./
```

To fix the linting errors automatically:
```
eslint ./ --fix
```
