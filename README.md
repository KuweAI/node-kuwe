# @selvian-ai/node

A collection of useful utility functions for JavaScript/TypeScript projects.

## Installation

```bash
npm install @selvian-ai/node
```

## Usage

### Import all functions

```typescript
import * as utils from '@selvian-ai/node';

// Use any function
const result = utils.capitalize('hello world'); // "Hello world"
```

### Import specific functions

```typescript
import { capitalize, chunk, deepClone } from '@selvian-ai/node';

const title = capitalize('hello world'); // "Hello world"
const chunks = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
const copy = deepClone(originalObject);
```

### Import by category

```typescript
import { StringUtils, ArrayUtils } from '@selvian-ai/node';

const camelCase = StringUtils.toCamelCase('hello world'); // "helloWorld"
const uniqueItems = ArrayUtils.unique([1, 1, 2, 3, 3]); // [1, 2, 3]
```

## API Reference

### String Utilities

#### `capitalize(str: string): string`
Capitalizes the first letter of a string.

```typescript
capitalize('hello world'); // "Hello world"
```

#### `toCamelCase(str: string): string`
Converts a string to camelCase.

```typescript
toCamelCase('hello world'); // "helloWorld"
toCamelCase('Hello World'); // "helloWorld"
```

#### `slugify(str: string): string`
Converts a string to a URL-friendly slug.

```typescript
slugify('Hello World!'); // "hello-world"
slugify('This is a test'); // "this-is-a-test"
```

### Array Utilities

#### `chunk<T>(array: T[], size: number): T[][]`
Splits an array into chunks of specified size.

```typescript
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk(['a', 'b', 'c', 'd'], 3); // [['a', 'b', 'c'], ['d']]
```

#### `unique<T>(array: T[]): T[]`
Returns an array with unique values.

```typescript
unique([1, 1, 2, 3, 3]); // [1, 2, 3]
unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
```

#### `groupBy<T, K>(array: T[], key: (item: T) => K): Record<K, T[]>`
Groups array elements by a key function.

```typescript
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 25 }
];

groupBy(users, user => user.age);
// { 25: [{ name: 'John', age: 25 }, { name: 'Bob', age: 25 }], 30: [{ name: 'Jane', age: 30 }] }
```

### Object Utilities

#### `deepClone<T>(obj: T): T`
Creates a deep copy of an object.

```typescript
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);
copy.b.c = 3; // original.b.c is still 2
```

#### `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`
Creates a new object without specified keys.

```typescript
const obj = { a: 1, b: 2, c: 3 };
omit(obj, ['b']); // { a: 1, c: 3 }
```

#### `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`
Creates a new object with only specified keys.

```typescript
const obj = { a: 1, b: 2, c: 3 };
pick(obj, ['a', 'c']); // { a: 1, c: 3 }
```

### Number Utilities

#### `clamp(value: number, min: number, max: number): number`
Clamps a number between min and max values.

```typescript
clamp(10, 1, 5); // 5
clamp(-5, 1, 5); // 1
clamp(3, 1, 5); // 3
```

#### `randomBetween(min: number, max: number): number`
Generates a random number between min and max.

```typescript
randomBetween(1, 10); // Random number between 1 and 10
```

#### `round(value: number, decimals?: number): number`
Rounds a number to specified decimal places.

```typescript
round(3.14159, 2); // 3.14
round(3.14159); // 3
```

### Async Utilities

#### `delay(ms: number): Promise<void>`
Creates a delay for the specified number of milliseconds.

```typescript
await delay(1000); // Wait for 1 second
```

#### `retry<T>(fn: () => Promise<T>, maxAttempts?: number, delayMs?: number): Promise<T>`
Retries an async function with exponential backoff.

```typescript
const result = await retry(
  () => fetchDataFromAPI(),
  3,    // max attempts
  1000  // delay between attempts
);
```

## TypeScript Support

This library is written in TypeScript and includes type definitions. You'll get full IntelliSense support in VS Code and other TypeScript-aware editors.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/node-selvian.git

# Install dependencies
npm install

# Build the library
npm run build

# Run linting
npm run lint
``` 