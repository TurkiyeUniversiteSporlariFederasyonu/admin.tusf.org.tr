window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'restore-activity-button')) {
      const target = ancestorWithClassName(event.target, 'restore-activity-button');
      const id = target.parentNode.id;

      createConfirm({
        title: 'Bu faaliyeti yerine koymak istediğinize emin misiniz?',
        text: 'Bir faaliyeti yerine koymanız halinde faaliyet yeniden görünür olacaktır. Yerine konmuş bir faaliyeti istediğiniz zaman yeniden silebilirsiniz.',
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
