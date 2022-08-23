window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'restore-manager-button')) {
      const target = ancestorWithClassName(event.target, 'restore-manager-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu kullanıcıyı yerine koymak istediğinize emin misiniz?',
        text: 'Bir kullanıcıyı yerine koymanız halinde kullanıcı hesabına yeniden erişim kazanacaktır. Yerine konmuş bir kullanıcıyı istediğiniz zaman yeniden silebilirsiniz.',
        accept: 'Yerine Koy',
        reject: 'Vazgeç'
      }, res => {
        if (!res) return;

        serverRequest('/admin/manager/restore?id=' + id, 'POST', {}, res => {
          if (!res.success)
            return throwError(res.error);
  
          target.parentNode.remove();
        });
      });
    }
  })
})
