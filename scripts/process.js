import tests from '../src/lib/tests.json' with { type: 'json'};

const result = {};

for (const test of tests) {
	result[test.name] = test.questions;
}

console.log(JSON.stringify(result, null, '\t'));
