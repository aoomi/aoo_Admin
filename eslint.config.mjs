import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import vue from 'eslint-plugin-vue';

export default [
	{ ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
	...vue.configs['flat/essential'],
	{
		files: ['src/**/*.{ts,vue}', 'tests/**/*.ts'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				ecmaVersion: 'latest',
				sourceType: 'module',
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'off',
			'vue/no-deprecated-slot-attribute': 'warn',
		},
	},
];
