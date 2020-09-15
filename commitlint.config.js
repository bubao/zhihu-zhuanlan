module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"subject-empty": [0, "always"],
		"type-empty": [0, "always"]
	}
};
