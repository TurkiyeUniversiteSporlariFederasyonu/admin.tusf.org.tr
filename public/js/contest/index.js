window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'delete-contest-button')) {
      const target = ancestorWithClassName(event.target, 'delete-contest-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu olimpiyatı silmek istediğinize emin misiniz?',
        text: 'Silinmiş olimpiyatları Silinmiş Olimpiyatlar menüsünden görebilir ve istediğiniz zaman silme işlemini geri alabilirsiniz.',
        accept: 'Sil',
        reject: 'Vazgeç'
      }, res => {
        if (!res) return;

        serverRequest('/contest/delete?id=' + id, 'POST', {}, res => {
          if (!res.success)
            return throwError(res.error);
  
          target.parentNode.remove();
        });
      });
    }

    if (ancestorWithClassName(event.target, 'edit-contest-button')) {
      const target = ancestorWithClassName(event.target, 'edit-contest-button');
      const id = target.parentNode.id;

      window.location = '/contest/edit?id=' + id;
    }
  });
});
