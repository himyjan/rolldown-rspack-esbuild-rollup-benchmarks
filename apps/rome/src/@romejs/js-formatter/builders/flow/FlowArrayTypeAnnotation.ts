/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Builder from '../../Builder';
import {Tokens, operator} from '../../tokens';
import {
  FlowArrayTypeAnnotation,
  flowArrayTypeAnnotation,
  AnyNode,
} from '@romejs/js-ast';

export default function(
  builder: Builder,
  node: AnyNode,
): Tokens {
  node = flowArrayTypeAnnotation.assert(node);

  return [
    ...builder.tokenize(node.elementType, node),
    operator('['),
    operator(']'),
  ];
}
