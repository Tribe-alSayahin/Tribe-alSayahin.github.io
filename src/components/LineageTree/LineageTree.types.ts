export interface TreeNode {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  source: string;
  reliability: 1 | 2 | 3;
  note: string;
}
