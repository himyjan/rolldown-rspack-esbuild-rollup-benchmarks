/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Scope} from '../../scopes';
import {
  MixedKeywordTypeAnnotation,
  mixedKeywordTypeAnnotation,
  AnyNode,
} from '@romejs/js-ast';
import MixedT from '../../types/MixedT';

export default function(node: AnyNode, scope: Scope) {
  node = mixedKeywordTypeAnnotation.assert(node);
  return new MixedT(scope, node);
}
