export function buildCommentTree(comments) {
  const map = {};
  const tree = [];

  comments.forEach(comment => {
    comment.replies = [];
    map[comment.comment_id] = comment;
  });

  comments.forEach(comment => {
    if (comment.parent_comment_id) {
      const parent = map[comment.parent_comment_id];
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      tree.push(comment);
    }
  });

  return tree;
}
