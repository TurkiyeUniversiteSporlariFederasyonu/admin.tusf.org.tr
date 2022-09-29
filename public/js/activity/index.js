window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'delete-activity-button')) {
      const target = ancestorWithClassName(event.target, 'delete-activity-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu faaliyeti silmek istediğinize emin misiniz?',
        text: 'Silinmiş faaliyetleri Silinmiş Faaliyetler menüsünden görebilir ve istediğiniz zaman silme işlemini geri alabilirsiniz.',
        accept: 'Sil',
        reject: 'Vazgeç'
      }, res => {
        if (!res) return;

        serverRequest('/activity/delete?id=' + id, 'POST', {}, res => {
          if (!res.success)
            return throwError(res.error);
  
          target.parentNode.remove();
        });
      });
    }

    if (ancestorWithClassName(event.target, 'edit-activity-button')) {
      const target = ancestorWithClassName(event.target, 'edit-activity-button');
      const id = target.parentNode.id;

      window.location = '/activity/edit?id=' + id;
    }

    if (ancestorWithClassName(event.target, 'result-activity-button')) {
      const target = ancestorWithClassName(event.target, 'result-activity-button');
      const id = target.parentNode.id;

      window.location = '/activity/result?id=' + id;
    }
  });
});
