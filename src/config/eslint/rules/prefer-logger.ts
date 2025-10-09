// src/config/eslint/rules/prefer-logger.ts
import type { TSESTree } from '@typescript-eslint/types';
import type { Rule } from 'eslint';

/**
 * @file Enforce using the project logger instead of console.*.
 * @summary Flags direct and indirect (aliased) console usage.
 * @example
 *   // ❌ not allowed
 *   console.log('x');
 *   const { error } = console; error('boom');
 *   const log = console.log; log('x');
 *
 *   // ✅ allowed (use your logger)
 *   import { createLogger } from '@utils/logger';
 *   const log = createLogger({ slug: 'build' });
 *   log.info('x');
 */

/** Rule options. */
type Options = [
  {
    /** Allowlist for specific console methods (e.g. ['assert']). */
    allow?: string[];
    /**
     * Glob-like path fragments that should be ignored by this rule.
     * Useful for logger internals or tests.
     */
    allowInFiles?: string[];
  }
];

type MessageIds = 'preferLogger' | 'preferLoggerAlias';

/** Built-in console methods we typically want to forbid. */
const DEFAULT_BLOCKED = new Set(['log', 'info', 'debug', 'warn', 'error', 'trace']);

/**
 * Check if the current filename should be ignored based on allowInFiles substrings.
 * @param filename absolute or project-relative filename provided by ESLint
 * @param patterns list of substrings; if any matches, file is allowed
 */
function isAllowedFile(filename: string | null, patterns: string[] | undefined): boolean {
  if (!filename || !patterns || patterns.length === 0) return false;
  return patterns.some((frag) => filename.includes(frag));
}

/**
 * Retrieve property name of a MemberExpression safely.
 */
function getMemberPropName(node: TSESTree.MemberExpression): string | null {
  if (!node.computed && node.property.type === 'Identifier') {
    return node.property.name;
  }
  if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') {
    return node.property.value;
  }
  return null;
}

/**
 * ESLint rule: prefer-logger
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow console.* in favor of the project logger',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
          },
          allowInFiles: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferLogger:
        'Use the project logger (createLogger(...).{{method}}) instead of console.{{method}}.',
      preferLoggerAlias:
        'Use the project logger (createLogger(...).{{method}}) instead of an alias to console.{{method}}.',
    },
  },

  /** Create rule listener. */
  create(context) {
    const filename = context.getFilename?.() ?? null;
    const [{ allow = [], allowInFiles = [] } = {}] = context.options as Options;
    const allowed = new Set(allow);
    const blocked = new Set([...DEFAULT_BLOCKED].filter((m) => !allowed.has(m)));

    // Skip files explicitly allowed (e.g., logger internals, tests)
    if (isAllowedFile(filename, allowInFiles)) {
      return {};
    }

    // Track aliases to console methods:
    // - const log = console.log
    // - const { log, error } = console
    const aliased: Map<string, string> = new Map();

    /**
     * @param method console method name
     * @returns true if the method is considered blocked
     */
    const isBlockedMethod = (method: string | null): method is string => {
      return Boolean(method && blocked.has(method));
    };

    return {
      // Track aliasing from `console`
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        try {
          // const log = console.log
          if (
            node.init &&
            node.id.type === 'Identifier' &&
            node.init.type === 'MemberExpression' &&
            node.init.object.type === 'Identifier' &&
            node.init.object.name === 'console'
          ) {
            const method = getMemberPropName(node.init);
            if (isBlockedMethod(method)) {
              aliased.set(node.id.name, method);
            }
          }

          // const { log, error } = console
          if (
            node.init &&
            node.id.type === 'ObjectPattern' &&
            node.init.type === 'Identifier' &&
            node.init.name === 'console'
          ) {
            for (const prop of node.id.properties) {
              if (prop.type !== 'Property') continue;
              if (prop.key.type !== 'Identifier') continue;
              const method = prop.key.name;
              if (!isBlockedMethod(method)) continue;

              // const { log: myLog } = console
              let local = method;
              if (prop.value.type === 'Identifier') {
                local = prop.value.name;
              } else if (
                prop.value.type === 'AssignmentPattern' &&
                prop.value.left.type === 'Identifier'
              ) {
                local = prop.value.left.name;
              }
              aliased.set(local, method);
            }
          }
        } catch {
          // be safe and silent in rule evaluation
        }
      },

      // Direct calls: console.log(...), console['error'](...)
      CallExpression(node: TSESTree.CallExpression) {
        const callee = node.callee;

        // console.method(...)
        if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier' && callee.object.name === 'console') {
          const method = getMemberPropName(callee);
          if (isBlockedMethod(method)) {
            context.report({
              node: callee.property,
              messageId: 'preferLogger',
              data: { method },
            });
          }
          return;
        }

        // alias(...)
        if (callee.type === 'Identifier') {
          const method = aliased.get(callee.name) ?? null;
          if (isBlockedMethod(method)) {
            context.report({
              node: callee,
              messageId: 'preferLoggerAlias',
              data: { method },
            });
          }
        }
      },
    };
  },
};

export default rule;
