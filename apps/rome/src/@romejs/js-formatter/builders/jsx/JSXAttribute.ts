/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Builder from '../../Builder';
import {Tokens, operator, concat} from '../../tokens';
import {jsxAttribute, AnyNode} from '@romejs/js-ast';

export default function(builder: Builder, node: AnyNode): Tokens {
  node = jsxAttribute.assert(node);

  const tokens: Tokens = builder.tokenize(node.name, node);

  if (node.value) {
    return [
      concat(tokens),
      operator('='),
      concat(builder.tokenize(node.value, node)),
    ];
  } else {
    return tokens;
  }
}
