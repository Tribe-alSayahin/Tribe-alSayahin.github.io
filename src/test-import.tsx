import { fetchAllComments, type Comment } from '../../lib/comments';
import { useState } from 'react';

export function TestComp() {
  const [comments, setComments] = useState<Comment[]>([]);
  
  async function load() {
    const { data, error } = await fetchAllComments();
    if (error) {
      console.log(error.message);
    } else {
      setComments(data ?? []);
    }
  }
  
  void load();
  return <div>{comments.length}</div>;
}
