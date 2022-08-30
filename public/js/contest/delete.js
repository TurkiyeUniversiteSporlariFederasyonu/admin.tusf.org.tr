window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'restore-activity-button')) {
      const target = ancestorWithClassName(event.target, 'restore-activity-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu olimpiyatı yerine koymak istediğinize emin misiniz?',
        text: 'Bir olimpiyatı yerine koymanız halinde olimpiyat yeniden görünür olacaktır. Yerine konmuş bir olimpiyatı istediğiniz zaman yeniden silebilirsiniz.',
        accept: 'Yerine Koy',
        reject: 'Vazgeç'
      }, res => {
        if (!res) return;

        serverRequest('/activity/restore?id=' + id, 'POST', {}, res => {
          if (!res.success)
            return throwError(res.error);
  
          target.parentNode.remove();
        });
      });
    }
  })
})
