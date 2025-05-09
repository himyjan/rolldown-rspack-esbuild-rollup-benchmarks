/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TSExternalModuleReference,
  tsExternalModuleReference,
  AnyNode,
} from '@romejs/js-ast';

export default function(node: AnyNode) {
  node = tsExternalModuleReference.assert(node);
  throw new Error('unimplemented');
}
