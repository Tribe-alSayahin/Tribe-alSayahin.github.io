import type { TreeNode } from './LineageTree.types';

/** Return direct children of a node (inspired by getChildren in family-organogram). */
export function getChildren(nodeId: string, allNodes: TreeNode[]): TreeNode[] {
  return allNodes.filter((n) => n.parent_id === nodeId);
}

/**
 * Count all descendants of a node recursively.
 * Inspired by countDescendants in family-organogram/src/utils/relationships.ts.
 */
export function countDescendants(nodeId: string, allNodes: TreeNode[]): number {
  const visited = new Set<string>();
  const stack = [nodeId];

  while (stack.length > 0) {
    const id = stack.pop();
    if (!id) continue;
    const children = getChildren(id, allNodes);
    for (const child of children) {
      if (!visited.has(child.id)) {
        visited.add(child.id);
        stack.push(child.id);
      }
    }
  }

  return visited.size;
}

/**
 * Search nodes by name across all levels.
 * Improved over the original implementation which only searched level 1.
 */
export function searchNodes(query: string, allNodes: TreeNode[]): TreeNode[] {
  if (!query.trim()) return allNodes;
  const q = query.trim();
  return allNodes.filter((n) => n.name.includes(q));
}

/**
 * Get all ancestor node IDs of a given node, ordered from root to parent.
 * Useful for highlighting the path to a search result.
 */
export function getAncestorIds(nodeId: string, allNodes: TreeNode[]): string[] {
  const ancestors: string[] = [];
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
  let current = nodeMap.get(nodeId);
  while (current && current.parent_id) {
    ancestors.unshift(current.parent_id);
    current = nodeMap.get(current.parent_id);
  }
  return ancestors;
}

/**
 * Export tree data as a downloadable JSON file.
 * Inspired by the FamilyBackup pattern in family-organogram/src/types/family.ts.
 */
export function exportAsJson(nodes: TreeNode[], filename = 'سياحين-شجرة-النسب.json'): void {
  const backup = {
    version: 1,
    exported_at: new Date().toISOString(),
    tribe: 'السياحين من عتيبة',
    nodes,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export tree data as a simple GEDCOM-compatible text.
 * Inspired by gedcom-svg-tree's data model.
 * Generates a basic GEDCOM 5.5.1 file where each node is an INDI record.
 */
export function exportAsGedcom(nodes: TreeNode[], filename = 'سياحين-شجرة-النسب.ged'): void {
  const lines: string[] = [
    '0 HEAD',
    '1 GEDC',
    '2 VERS 5.5.1',
    '1 CHAR UTF-8',
    '1 SOUR سياحين-موقع-رسمي',
    '2 NAME الموقع الرسمي لقبيلة السياحين',
    '0 @F1@ FAM',
  ];

  const idToGedcom = (id: string) => `@I${id.replace(/[^a-zA-Z0-9]/g, '_')}@`;

  for (const node of nodes) {
    lines.push(`0 ${idToGedcom(node.id)} INDI`);
    lines.push(`1 NAME ${node.name}`);
    if (node.note) lines.push(`1 NOTE ${node.note}`);
    if (node.source) lines.push(`1 SOUR ${node.source}`);
    if (node.parent_id) {
      lines.push(`1 FAMC @F${node.parent_id.replace(/[^a-zA-Z0-9]/g, '_')}@`);
    }
  }

  lines.push('0 TRLR');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
