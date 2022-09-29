let isUploading = false;

window.addEventListener('load', () => {
  const results = JSON.parse(document.getElementById('results').value);
  const universities = JSON.parse(document.getElementById('universities').value);

  document.addEventListener('click', event => {
    if (event.target.id == 'save-button' && !isUploading) {
      isUploading = true;
      event.target.innerHTML = 'Kaydediliyor';

      const error = document.getElementById('error');
      error.innerHTML = '';
      
      const gender = document.getElementById('gender-input').value;
      const subbranch = document.getElementById('subbranch-input').value;
      const category = document.getElementById('category-input').value;
      const universityIdList = [];

      if (!gender || !gender.trim().length) {
        isUploading = false;
        event.target.innerHTML = 'Kaydet';
        return error.innerHTML = 'Lütfen faaliyetin cinsiyetini seçiniz.';
      }

      const universityNodes = document.getElementById('order-wrapper').children;
      for (let i = 0; i < universityNodes.length; i++)
        universityIdList.push(universityNodes[i].childNodes[0].id);
      
      serverRequest('/activity/result', 'POST', {
        gender,
        subbranch,
        category,
        order: universityIdList
      }, res => {
        if (!res.success) {
          isUploading = false;
          event.target.innerHTML = 'Kaydet';
          return error.innerHTML = 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        isUploading = false;
        event.target.innerHTML = 'Kaydedildi!';
        setTimeout(() => {
          event.target.innerHTML = 'Kaydet';
        }, 1500);
      });
    }

    if (event.target.id == 'reload-button') {
      document.getElementById('order-wrapper').innerHTML = '';

      const gender = document.getElementById('gender-input').value && document.getElementById('gender-input').value.length ? document.getElementById('gender-input').value : null; 
      const subbranch = document.getElementById('subbranch-input').value && document.getElementById('subbranch-input').value.length ? document.getElementById('subbranch-input').value : null; 
      const category = document.getElementById('category-input').value && document.getElementById('category-input').value.length ? document.getElementById('category-input').value : null; 

      const result = results.find(each => each.gender == gender && each.subbranch == subbranch && each.category == category);

      if (!result)
        return;

      for (let i = 0; i < result.order.length; i++)
        createCustomInputSelectItem(universities.find(each => each._id.toString() == result.order[i].toString()).name, result.order[i], document.getElementById('order-wrapper'));
    }
  });
});
