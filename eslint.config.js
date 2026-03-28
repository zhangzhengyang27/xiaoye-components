import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "**/*.md",
      "apps/docs/.vitepress/cache/**",
      "apps/docs/.vitepress/dist/**",
      "apps/docs/.vitepress/.temp/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs,vue,mts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: tseslint.parser,
        extraFileExtensions: [".vue"]
      }
    },
    rules: {
      "no-undef": "off",
      "no-redeclare": "off",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ]
    }
  },
  {
    files: ["**/__tests__/**/*.spec.ts", "tests/types/fixtures/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "vue/one-component-per-file": "off"
    }
  },
  {
    files: ["apps/docs/examples/**/*.vue"],
    rules: {
      "vue/first-attribute-linebreak": "off",
      "vue/v-on-event-hyphenation": "off",
      "vue/attribute-hyphenation": "off"
    }
  },
  {
    files: ["apps/docs/.vitepress/theme/components/**/*.vue"],
    rules: {
      "vue/no-v-html": "off"
    }
  },
  {
    files: ["packages/components/**/*.vue"],
    rules: {
      "vue/no-required-prop-with-default": "off"
    }
  }
);
