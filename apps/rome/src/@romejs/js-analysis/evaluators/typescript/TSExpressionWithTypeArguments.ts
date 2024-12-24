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

export default function(node: AnyNode) {
  node = tsExpressionWithTypeArguments.assert(node);
  throw new Error('unimplemented');
}
