/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Scope} from '../../scopes';
import {
  FlowDeclareInterface,
  flowDeclareInterface,
  AnyNode,
} from '@romejs/js-ast';
import FlowInterfaceDeclaration from './FlowInterfaceDeclaration';

export default function(node: AnyNode, scope: Scope) {
  node = flowDeclareInterface.assert(node);
  return FlowInterfaceDeclaration(node, scope);
}
