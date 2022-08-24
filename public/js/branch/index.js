window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'edit-branch-button')) {
      const target = ancestorWithClassName(event.target, 'edit-branch-button');
      const id = target.parentNode.id;

      window.location = '/branch/edit?id=' + id;
    }
  });
});
