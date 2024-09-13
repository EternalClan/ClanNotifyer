const always = "always";
const error = "error";
const never = "never";
const off = "off";
// eslint-disable-next-line no-unused-vars
const warn = "warn";

module.exports = {
	extends: "standard",
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		"brace-style": [
			error,
			"1tbs",
			{ allowSingleLine: true }
		],
		indent: [
			error,
			"tab"
		],
		"no-tabs": off,
		"no-unused-expressions": off,
		quotes: [
			error,
			"double"
		],
		semi: [
			error,
			always
		],
		"space-before-function-paren": off,
		yoda: [
			error,
			never
		]
	}
};
