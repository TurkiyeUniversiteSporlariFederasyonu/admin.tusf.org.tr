window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'delete-manager-button')) {
      const target = ancestorWithClassName(event.target, 'delete-manager-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
        text: 'Silinmiş kullanıcıları Silinmiş Kullanıcılar menüsünden görebilir ve istediğiniz zaman silme işlemini geri alabilirsiniz.',
        accept: 'Sil',
        reject: 'Vazgeç'
      }, res => {
        if (!res) return;

        serverRequest('/admin/manager/delete?id=' + id, 'POST', {}, res => {
          if (!res.success)
            return throwError(res.error);
  
          target.parentNode.remove();
        });
      });
    }

    if (ancestorWithClassName(event.target, 'edit-manager-button')) {
      const target = ancestorWithClassName(event.target, 'edit-manager-button');
      const id = target.parentNode.id;

      window.location = '/admin/manager/edit?id=' + id;
    }
  })
})
