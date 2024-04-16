const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');


document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProduct();
});




function fetchCategories() {
  fetch('https://api.escuelajs.co/api/v1/categories')
    // gelen veriyi işleme
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 3).forEach((category) => {
        const { image, name } = category;
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
            <h3>${name}</h3>
        `;
        categoryList.appendChild(categoryDiv);
      })
    );
}

function fetchProduct() {
  fetch('https://api.escuelajs.co/api/v1/products')
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((item) => {
        // div oluştur
        const productDiv = document.createElement('div');
        // dive class ekle
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <p>${item.title}</p>
            <p>${item.category.name}</p>
            <div class="product-action">
              <p>${item.price} $</p>
              <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productDiv);
      })
    );
}

let basket = [];
let total = 0;

function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

openBtn.addEventListener('click', () => {
  modal.classList.add('active');
  addList();
  modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  modalList.innerHTML = '';
  total = 0;
});

function addList() {
  basket.forEach((product) => {
    console.log(product);
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
              <h2>${product.title}</h2>
              <h2 class="price">${product.price}  $</h2>
              <p>Amount: ${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Delete</button>
    `;
    modalList.appendChild(listItem);

    total += product.price * product.amount;
  });
}

function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

modalList.addEventListener('click', (e) => {
  if (e.target.id === 'del') {
    e.target.parentElement.remove();
  }
});

modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrapper')) {
    modal.classList.remove('active');
  }
});