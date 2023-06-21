import { addComments, removeComments } from '@babel/types';
import { clone, isEqual, isUndefined } from 'lodash';

import { THIRD_PARTY_MODULES_SPECIAL_WORD, newLineNode } from '../constants';
import { naturalSort } from '../natural-sort';
import { GetSortedNodes, ImportGroups, ImportOrLine } from '../types';
import { getImportNodesMatchedGroup } from './get-import-nodes-matched-group';
import { getPkgInfo } from './get-pkg-info';
import { getSortedImportSpecifiers } from './get-sorted-import-specifiers';
import { getSortedNodesGroup } from './get-sorted-nodes-group';

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param options
 */
export const getSortedNodes: GetSortedNodes = (nodes, options) => {
    naturalSort.insensitive = options.importOrderCaseInsensitive;

    let { importOrder } = options;

    const originOrders = clone(importOrder);

    const pkgInfo = getPkgInfo(options.base);
    const dependencies = Object.keys(pkgInfo.dependencies ?? {});
    const specifiedThirdPartyDeps = dependencies.some((d: string) =>
        originOrders.includes(d),
    );

    const {
        importOrderSeparation,
        importOrderSortSpecifiers,
        importOrderGroupNamespaceSpecifiers,
    } = options;

    const originalNodes = nodes.map(clone);
    const finalNodes: ImportOrLine[] = [];

    if (!importOrder.includes(THIRD_PARTY_MODULES_SPECIAL_WORD)) {
        if (specifiedThirdPartyDeps) {
            importOrder = [];

            originOrders.forEach((order) => {
                if (order === THIRD_PARTY_MODULES_SPECIAL_WORD) {
                    importOrder.push(THIRD_PARTY_MODULES_SPECIAL_WORD);
                }

                if (dependencies.includes(order)) {
                    importOrder.push(order);
                } else {
                    if (
                        !importOrder.includes(THIRD_PARTY_MODULES_SPECIAL_WORD)
                    ) {
                        importOrder.push(THIRD_PARTY_MODULES_SPECIAL_WORD);
                    }
                    importOrder.push(order);
                }
            });
        } else {
            importOrder = [THIRD_PARTY_MODULES_SPECIAL_WORD, ...importOrder];
        }
    }

    const importOrderGroups = importOrder.reduce<ImportGroups>(
        (groups, regexp) => ({
            ...groups,
            [regexp]: [],
        }),
        {},
    );

    const importOrderWithOutThirdPartyPlaceholder = importOrder.filter(
        (group) => group !== THIRD_PARTY_MODULES_SPECIAL_WORD,
    );

    for (const node of originalNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            node,
            importOrderWithOutThirdPartyPlaceholder,
            originOrders,
        );
        importOrderGroups[matchedGroup].push(node);
    }

    for (const group of importOrder) {
        const groupNodes = importOrderGroups[group];

        if (groupNodes.length === 0) continue;

        const sortedInsideGroup = getSortedNodesGroup(groupNodes, {
            importOrderGroupNamespaceSpecifiers,
        });

        // Sort the import specifiers
        if (importOrderSortSpecifiers) {
            sortedInsideGroup.forEach((node) =>
                getSortedImportSpecifiers(node),
            );
        }

        finalNodes.push(...sortedInsideGroup);

        if (importOrderSeparation) {
            finalNodes.push(newLineNode);
        }
    }

    if (finalNodes.length > 0 && !importOrderSeparation) {
        // a newline after all imports
        finalNodes.push(newLineNode);
    }

    // maintain a copy of the nodes to extract comments from
    const finalNodesClone = finalNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    finalNodes.forEach(removeComments);

    // insert comments other than the first comments
    finalNodes.forEach((node, index) => {
        if (isEqual(nodes[0].loc, node.loc)) return;

        addComments(
            node,
            'leading',
            finalNodesClone[index].leadingComments || [],
        );
    });

    if (firstNodesComments) {
        addComments(finalNodes[0], 'leading', firstNodesComments);
    }

    return finalNodes;
};
