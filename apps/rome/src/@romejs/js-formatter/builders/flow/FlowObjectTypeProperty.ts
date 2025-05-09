/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Builder from '../../Builder';
import {Tokens, word, space, operator} from '../../tokens';
import {
  FlowObjectTypeProperty,
  flowObjectTypeProperty,
  AnyNode,
} from '@romejs/js-ast';

export default function(builder: Builder, node: AnyNode) {
  node = flowObjectTypeProperty.assert(node);

  let tokens: Tokens = [];

  if (node.static === true) {
    tokens.push(word('static'));
    tokens.push(space);
  }

  tokens = [
    ...tokens,
    ...builder.tokenize(node.variance, node),
    ...builder.tokenize(node.key, node),
  ];

  if (node.optional === true) {
    tokens.push(operator('?'));
  }

  return [
    ...tokens,
    operator(':'),
    space,
    ...builder.tokenize(node.value, node),
  ];
}
