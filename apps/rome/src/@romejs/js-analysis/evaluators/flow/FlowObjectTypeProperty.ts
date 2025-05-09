/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Scope} from '../../scopes';
import {
  FlowObjectTypeProperty,
  flowObjectTypeProperty,
  AnyNode,
} from '@romejs/js-ast';
import ObjPropT from '../../types/ObjPropT';

export default function(node: AnyNode, scope: Scope) {
  node = flowObjectTypeProperty.assert(node);

  const {key, value} = node;

  let keyStr;
  if (key.type === 'Identifier') {
    keyStr = key.name;
  } else if (key.type === 'StringLiteral') {
    keyStr = key.value;
  } else {
    throw new Error('Unknown property key');
  }

  return new ObjPropT(scope, node, keyStr, scope.evaluate(value));
}
