window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'edit-year-button')) {
      const target = ancestorWithClassName(event.target, 'edit-year-button');
      const id = target.parentNode.id;

      window.location = '/year/edit?id=' + id;
    }
  });
});
