/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Builder from '../../Builder';
import {Tokens, word, operator, space, concat} from '../../tokens';
import {whileStatement, AnyNode} from '@romejs/js-ast';

export default function(builder: Builder, node: AnyNode): Tokens {
  node = whileStatement.assert(node);

  return [
    word('while'),
    space,
    operator('('),
    concat(builder.tokenize(node.test, node)),
    operator(')'),
    space,
    concat(builder.tokenize(node.body, node)),
  ];
}
