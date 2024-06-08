import js from '@eslint/js';

export default [
	js.configs.all,
	{
		ignores: ['**/*.js', '*.js'],
	},
];
