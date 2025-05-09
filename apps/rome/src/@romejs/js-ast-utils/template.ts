/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AnyNode,
  AnyExpression,
  AnyStatement,
  AnyIdentifier,
  program,
} from '@romejs/js-ast';
import {Path, Context} from '@romejs/js-compiler';
import {DEFAULT_PROJECT_CONFIG} from '@romejs/project';
import removeLoc from './removeLoc';
import {parseJS} from '@romejs/js-parser';
import {createUnknownFilePath} from '@romejs/path';
import isIdentifierish from './isIdentifierish';
import {Dict} from '@romejs/typescript-helpers';

type Placeholder = {
  type: AnyIdentifier['type'];
  path: Array<string>;
};

type BuiltTemplate = {
  ast: AnyNode;
  placeholderPaths: Array<Placeholder>;
};

type TemplatePlaceholders = Dict<undefined | Placeholder>;

const templateCache: Map<TemplateStringsArray, BuiltTemplate> = new Map();

function getTemplate(strs: TemplateStringsArray): BuiltTemplate {
  const cached = templateCache.get(strs);
  if (cached) {
    return cached;
  }

  // calculate amount of placeholders to insert
  const pathCount = strs.length - 1;

  // create path ids
  let placeholders: TemplatePlaceholders = {};
  const placeholderIds: Array<string> = [];
  for (let i = 0; i < pathCount; i++) {
    const id = `__${String(i)}__`;
    placeholderIds.push(id);
    placeholders[id] = undefined;
  }

  // interpolate placeholders and original code
  let code = '';
  for (let i = 0; i < strs.length; i++) {
    // add original part of code
    code += strs[i];

    // add in placeholder
    const placeholder = placeholderIds[i];
    if (placeholder) {
      code += placeholder;
    }
  }

  // parse the interpolated code
  let ast = parseJS({
    input: code,
    sourceType: 'template',
    path: createUnknownFilePath('template'),
  });

  // remove `loc` properties
  ast = program.assert(removeLoc(ast));

  // traverse and find placeholders paths
  function collectPlaceholderPaths(path: Path) {
    const {node} = path;
    if (isIdentifierish(node) && node.name in placeholders) {
      placeholders[node.name] = {
        type: node.type,
        path: path.getPathKeys(),
      };
    }
    return node;
  }

  const context = new Context({
    ast,
    project: {
      folder: undefined,
      config: DEFAULT_PROJECT_CONFIG,
    },
  });
  context.reduce(ast, [
    {name: 'collectPlaceholderPaths', enter: collectPlaceholderPaths},
  ]);

  const placeholderPaths: BuiltTemplate['placeholderPaths'] = [];
  for (const id in placeholders) {
    const path = placeholders[id];
    if (path === undefined) {
      throw new Error(`Failed to find placeholder path for ${id}`);
    } else {
      placeholderPaths.push(path);
    }
  }

  return {ast, placeholderPaths};
}

type TemplateSubstitions = Array<AnyNode | string>;

function createIdentifier(
  substitute: AnyNode | string,
  expectedIdType: Placeholder['type'],
): AnyNode {
  if (typeof substitute === 'string') {
    // @ts-ignore: No idea why this error exists
    return {
      type: expectedIdType,
      name: substitute,
    };
  } else {
    return substitute;
  }
}

export default function(
  strs: TemplateStringsArray,...substitutions: TemplateSubstitions
): AnyNode {
  const {ast, placeholderPaths} = getTemplate(strs);

  // no substitutions so we can just return the ast!
  if (!substitutions.length) {
    return ast;
  }

  // this case should never be hit
  if (placeholderPaths.length !== substitutions.length) {
    throw new Error('Expected subtituions to be the same length as paths');
  }

  const newAst = {...ast};

  for (let i = 0; i < placeholderPaths.length; i++) {
    const {type, path} = placeholderPaths[i];

    const substitute: AnyNode = createIdentifier(substitutions[i], type);
    // rome-suppress-next-line lint/noExplicitAny
    let target: any = newAst;

    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      const isLast = i === path.length - 1;

      if (isLast) {
        target[key] = substitute;
      } else {
        let currTarget = target[key];
        if (Array.isArray(currTarget)) {
          currTarget = currTarget.slice();
        } else {
          currTarget = {...currTarget};
        }
        target[key] = currTarget;
        target = currTarget;
      }
    }
  }

  return newAst;
}

template.expression = (
  strs: TemplateStringsArray,...substitutions: TemplateSubstitions
): AnyExpression => {
  const first = template.statement(strs, ...substitutions);

  // Ensure that the single statement is an ExpressionStatement
  if (first.type !== 'ExpressionStatement') {
    throw new Error('Single statement should be an ExpressionStatement');
  }

  return first.expression;
};

template.statement = (
  strs: TemplateStringsArray,...substitutions: TemplateSubstitions
): AnyStatement => {
  // Parse the template, with caching
  const ast = program.assert(template(strs, ...substitutions));

  // Ensure that there's only a single statement in the Program body
  const body = ast.body;
  if (body.length !== 1) {
    throw new Error("More than one statement isn't allowed for a template.");
  }
  return body[0];
};
