let isUploading = false;

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.id == 'save-button' && !isUploading) {
      isUploading = true;

      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const oldId = document.getElementById('old-id-input').value;
      const gender = document.getElementById('gender-input').value;
      const subbranch = document.getElementById('subbranch-input').value;
      const category = document.getElementById('category-input').value;
      const universityIdList = [];

      if (!oldId || !oldId.trim().length) {
        isUploading = false;
        return error.innerHTML = 'Lütfen faaliyet IDsini yazınız.';
      }

      if (!gender || !gender.trim().length) {
        isUploading = false;
        return error.innerHTML = 'Lütfen faaliyetin cinsiyetini seçiniz.';
      }

      const universityNodes = document.getElementById('order-wrapper').children;
      for (let i = 0; i < universityNodes.length; i++)
        universityIdList.push(universityNodes[i].childNodes[0].id);
      
      serverRequest('/activity/result', 'POST', {
        old_id: oldId,
        gender,
        subbranch,
        category,
        order: universityIdList
      }, res => {
        if (!res.success) {
          isUploading = false;
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        isUploading = false;
        document.querySelector('.general-custom-input-items-wrapper').innerHTML = '';
      });
    }
  });
});
