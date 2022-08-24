window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'edit-university-button')) {
      const target = ancestorWithClassName(event.target, 'edit-university-button');
      const id = target.parentNode.id;

      window.location = '/university/edit?id=' + id;
    }
  });
});
