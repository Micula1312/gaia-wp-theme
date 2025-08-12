document.addEventListener('DOMContentLoaded', function () {
  const isSinglePost = document.body.classList.contains('single');
  if (!isSinglePost) return;

  const columns = document.querySelectorAll('.wp-block-columns .wp-block-column');
  if (columns.length < 2) return;

  const firstColumn = columns[0];
  const secondColumn = columns[1];
  const contentBlocks = firstColumn.querySelectorAll('.wp-block-gallery, .wp-block-image');

  contentBlocks.forEach(block => {
    secondColumn.appendChild(block);
  });
});