function uploadImage (file, callback) {
  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const res = JSON.parse(xhr.responseText);

      if (!res.success)
        return callback(res.error || 'unknown_error');

      return callback(null, res.url);
    }
  };
}

function createImagePicker (wrapper) {
  const settingsImagePicker = document.createElement('label');
  settingsImagePicker.classList.add('general-choose-image-input-text');

  const span = document.createElement('span');
  span.innerHTML = 'Bilgisayarınızdan seçmek için tıklayın.';
  settingsImagePicker.appendChild(span);

  const input = document.createElement('input');
  input.classList.add('display-none');
  input.classList.add('general-image-input');
  input.accept = 'image/*';
  input.type = 'file';

  settingsImagePicker.appendChild(input);

  wrapper.innerHTML = '';
  wrapper.appendChild(settingsImagePicker);
}

function createUploadedImage (url, wrapper) {
  const imageInputWrapper = document.createElement('div');
  imageInputWrapper.classList.add('general-image-input-wrapper');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('general-image-input-wrapper-image');
  const image = document.createElement('img');
  image.src = url;
  imageWrapper.appendChild(image);
  imageInputWrapper.appendChild(imageWrapper);

  const i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add('fa-times');
  i.classList.add('general-delete-image-button');
  imageInputWrapper.appendChild(i);

  wrapper.innerHTML = '';
  wrapper.appendChild(imageInputWrapper);
}

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('general-checked-input-item')) {
      if (event.target.classList.contains('general-checked-input-item-selected'))
        event.target.classList.remove('general-checked-input-item-selected');
      else
        event.target.classList.add('general-checked-input-item-selected');
    }

    if (ancestorWithClassName(event.target, 'general-select-input-wrapper')) {
      const target = ancestorWithClassName(event.target, 'general-select-input-wrapper');

      if (document.querySelector('.general-select-input-wrapper-opened')) {
        if (document.querySelector('.general-select-input-wrapper-opened') != target)
          document.querySelector('.general-select-input-wrapper-opened').classList.remove('general-select-input-wrapper-opened');
      }

      target.classList.add('general-select-input-wrapper-opened');
    } else if (document.querySelector('.general-select-input-wrapper-opened')) {
      document.querySelector('.general-select-input-wrapper-opened').classList.remove('general-select-input-wrapper-opened');
    }

    if (event.target.classList.contains('general-select-input-each-option')) {
      event.target.parentNode.parentNode.querySelector('.general-select-input-value').value = event.target.id.replace('select-input-', '');
      event.target.parentNode.parentNode.querySelector('.general-select-input-search').value = event.target.innerHTML;
      event.target.parentNode.parentNode.classList.remove('general-select-input-wrapper-opened');
    }

    if (event.target.classList.contains('general-delete-image-button')) {
      const wrapper = event.target.parentNode.parentNode;
      const url = event.target.parentNode.childNodes[0].childNodes[0].src;

      serverRequest(`/image/delete?url=${url}`, 'GET', {}, res => {
        if (!res.success) return throwError(res.error);

        createImagePicker(wrapper);
      });
    }
  });

  document.addEventListener('input', event => {
    if (event.target.classList.contains('general-select-input-search')) {
      event.target.parentNode.classList.add('general-select-input-wrapper-opened');
      const nodes = event.target.parentNode.querySelector('.general-select-input-options-wrapper').children;

      for (let i = 0; i < nodes.length; i++) {
        if (!event.target.value.length || nodes[i].innerHTML.trim().toLocaleLowerCase().includes(event.target.value.trim().toLocaleLowerCase())) {
          nodes[i].style.display = 'flex';

          if (nodes[i].innerHTML.trim().toLocaleLowerCase() == event.target.value.trim().toLocaleLowerCase())
            event.target.parentNode.querySelector('.general-select-input-value').value = nodes[i].id.replace('select-input-', '');
          else
            event.target.parentNode.querySelector('.general-select-input-value').value = '';
        } else {
          nodes[i].style.display = 'none';
        }
      }
    }
  });

  document.addEventListener('change', event => {
    if (event.target.classList.contains('general-image-input')) {
      const file = event.target.files[0];

      event.target.parentNode.style.cursor = 'progress';
      event.target.parentNode.childNodes[0].innerHTML = 'Yükleniyor...';
      event.target.parentNode.childNodes[1].type = 'text';

      uploadImage(file, (err, url) => {
        if (err)
          return throwError(err);

        createUploadedImage(url, event.target.parentNode.parentNode);
      });
    }
  });
});
