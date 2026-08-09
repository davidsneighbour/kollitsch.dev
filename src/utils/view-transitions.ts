const CSS_CUSTOM_IDENT_SAFE_CHARACTER = /[^a-zA-Z0-9_-]/g;

export function getPostPreviewTransitionName(postId: string): string {
  const safePostId = postId.replace(CSS_CUSTOM_IDENT_SAFE_CHARACTER, '-');

  return `post-preview-${safePostId}`;
}

export function getPostPreviewMediaTransitionName(postId: string): string {
  const safePostId = postId.replace(CSS_CUSTOM_IDENT_SAFE_CHARACTER, '-');

  return `post-preview-media-${safePostId}`;
}
