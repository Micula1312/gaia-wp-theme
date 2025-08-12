function setupColumnFadeAnimations() {
  const columnGroups = document.querySelectorAll('.wp-block-columns');

  columnGroups.forEach(group => {
    const columns = group.querySelectorAll('.wp-block-column');

    columns.forEach((column, index) => {
      column.classList.add('fade-in', `delay-${index + 1}`);
      column.classList.add('in-view'); // Trigger the animation
    });
  });
}

// ✅ Remove in-view classes BEFORE new page loads
document.addEventListener('barba:before', () => {
  document.querySelectorAll('.wp-block-column.in-view').forEach(col => {
    col.classList.remove('in-view');
  });
});

// ✅ Run on initial load
document.addEventListener('DOMContentLoaded', setupColumnFadeAnimations);

// ✅ Run after Barba loads new page
document.addEventListener('barba:page', setupColumnFadeAnimations);
function setupColumnFadeAnimations() {
  const columnGroups = document.querySelectorAll('.wp-block-columns');

  columnGroups.forEach(group => {
    const columns = group.querySelectorAll('.wp-block-column');

    columns.forEach((column, index) => {
      column.classList.add('fade-in', `delay-${index + 1}`);
      column.classList.add('in-view'); // Trigger the animation
    });
  });
}

// ✅ Remove in-view classes BEFORE new page loads
document.addEventListener('barba:before', () => {
  document.querySelectorAll('.wp-block-column.in-view').forEach(col => {
    col.classList.remove('in-view');
  });
});

// ✅ Run on initial load
document.addEventListener('DOMContentLoaded', setupColumnFadeAnimations);

// ✅ Run after Barba loads new page
document.addEventListener('barba:page', setupColumnFadeAnimations);
function setupColumnFadeAnimations() {
  const columnGroups = document.querySelectorAll('.wp-block-columns');

  columnGroups.forEach(group => {
    const columns = group.querySelectorAll('.wp-block-column');

    columns.forEach((column, index) => {
      column.classList.add('fade-in', `delay-${index + 1}`);
      column.classList.add('in-view'); // Trigger the animation
    });
  });
}

// ✅ Remove in-view classes BEFORE new page loads
document.addEventListener('barba:before', () => {
  document.querySelectorAll('.wp-block-column.in-view').forEach(col => {
    col.classList.remove('in-view');
  });
});

// ✅ Run on initial load
document.addEventListener('DOMContentLoaded', setupColumnFadeAnimations);

// ✅ Run after Barba loads new page
document.addEventListener('barba:page', setupColumnFadeAnimations);
