/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TSExpressionWithTypeArguments,
  tsExpressionWithTypeArguments,
  AnyNode,
} from '@romejs/js-ast';
import {Builder} from '@romejs/js-formatter';
import {Tokens} from '../../tokens';

export default function(
  builder: Builder,
  node: AnyNode,
): Tokens {
  node = tsExpressionWithTypeArguments.assert(node);

  return [
    ...builder.tokenize(node.expression, node),
    ...builder.tokenize(node.typeParameters, node),
  ];
}
