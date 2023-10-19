
const cartBtn = document.querySelector(".btncart");
const clearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".rounded-pill");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDom = document.querySelector(".products-dom");
// const favorites = document.querySelector(".favoriler");

const favoriBtn = document.querySelector(".btnFavori");
const clearFavBtn = document.querySelector(".btn-fav-clear");
const favItems = document.querySelector(".rounded-pill-fav");
const favContent = document.querySelector(".favoriler");

let cart = [];
let buttonsDOM = [];
let favori = [];
let favoriteDOM = [];


class Products {
  async getProducts() {
    try {
      let result = await fetch("http://localhost:8080/product/all");
      let data = await result.json();
      let products = data;
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    products.forEach((item) => {
      const cardDiv = document.createElement("li");
      cardDiv.className = "col-sm-1 col-lg-4 mb-4 ";
      const productDiv = document.createElement("div");
      productDiv.className = "block-4 text-center border item";
      const attr5 = document.createAttribute("data-price");
      attr5.value = item.carPrice;
      const attr6 = document.createAttribute("data-category");
      attr6.value = item.modelName.brand.name;
      cardDiv.setAttributeNode(attr5);
      cardDiv.setAttributeNode(attr6);
      cardDiv.appendChild(productDiv);
      productsDom.appendChild(cardDiv);

      const picture = document.createElement("picture");
      const productImage = document.createElement("img");
      productImage.src = item.imageUrl;
      productImage.className = "card-img-top";
      productImage.alt = "product";
      picture.appendChild(productImage)
      productDiv.appendChild(picture);

      const favDiv = document.createElement("div");
      favDiv.className = "badge  position-absolute ";
      favDiv.style = "top: -1rem; right: -0.65rem";

      const favBtn = document.createElement("button");
      favBtn.className = " icon icon-heart btn btn-light  position-absolute";
      favBtn.style = "top: 0.9rem; right: 1rem";
      const attr2 = document.createAttribute("data-id");
      attr2.value = item.id;
      favBtn.setAttributeNode(attr2);

      favDiv.appendChild(favBtn);
      productDiv.appendChild(favBtn);

      const discountDiv = document.createElement("div");
      discountDiv.className = "badge bg-dark text-white position-absolute";
      discountDiv.style = "top: 0.5rem; left: 0.5rem";
      discountDiv.innerText = "-10";
      productDiv.appendChild(discountDiv);

      const cbodyDiv = document.createElement("div");
      cbodyDiv.className = "card-body p-4";
      const textDiv = document.createElement("div");
      textDiv.className = "text-center color";
      const textTitle = document.createElement("h3");
      const linkTitle = document.createElement("strong");
      linkTitle.textContent = item.modelName.brand.name;
      textTitle.appendChild(linkTitle);
      textDiv.appendChild(textTitle);
      const textCategory = document.createElement("p");
      textCategory.className = "fw-normal";
      textCategory.textContent = item.description;
      textDiv.appendChild(textCategory);

      const textPrice = document.createElement("span");
      textPrice.className = "text-muted text-decoration-line-through";
      textPrice.textContent = item.oldPrice + "₺";
      const textPrice2 = document.createElement("span");
      textPrice2.className = "text-primary font-weight-bold";
      textPrice2.textContent = " " + item.carPrice + "₺";
      textDiv.appendChild(textPrice);
      textDiv.appendChild(textPrice2);
      cbodyDiv.appendChild(textDiv);
      productDiv.appendChild(cbodyDiv);

      const cFooterDiv = document.createElement("div");
      cFooterDiv.className = "card-footer p-2 pt-0 border-top-0 bg-transparent";
      const footerDiv2 = document.createElement("div");
      const button = document.createElement("button");
      button.className = "btn btn-secondary btn-sm mb-3 mt-auto";
      const attr = document.createAttribute("data-id");
      attr.value = item.id;
      button.setAttributeNode(attr);
      button.innerText = "Add To Cart";
      footerDiv2.appendChild(button);
      cFooterDiv.appendChild(footerDiv2);
      productDiv.appendChild(cFooterDiv);
    });
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".mt-auto")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.setAttribute("disabled", "disalbed");
        button.style.opacity = ".3";
      } else {
        button.addEventListener("click", (event) => {
          event.target.disabled = true;
          event.target.style.opacity = ".3";
          //* get product from products
          
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          //* add product to the cart
          cart = [...cart, cartItem];
          //* save cart in local storage
          Storage.saveCart(cart);
          //* save cart values
          this.saveCartValues(cart);
          //* display cart item
          this.addCartItem(cartItem);
          //* show the cart
          this.showCart();
        });
      }
    });
  }

  getBagButtons2() {
    const favoriteBtn = [...document.querySelectorAll(".icon-heart")];
    favoriteDOM = favoriteBtn;

    favoriteBtn.forEach((favorite) => {
      let id = favorite.dataset.id;
      let inFav = favori.find((item) => item.id === id);
      if (inFav) {
        favorite.setAttribute("disabled", "disabled");
        favorite.style.opacity = ".3";
      } else {
        favorite.addEventListener("focus", (event) => {
          event.target.style.color = "rgb(245, 134, 43)";
          event.target.disabled = true;
          event.target.style.opacity = ".5";
          //* get product from products
          let favItem = { ...Storage.getProduct(id), amount: 1 };
          favori = [...favori, favItem];
          //* save cart in local storage
          Storage.saveCart(favori);
          //* save cart values
          this.saveCartValues(favori);
          //* display cart item
          this.addFavoriteItem(favItem);

          this.showFav();
        });
      }
    });
  }

  saveCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.carPrice * item.amount ;
      itemsTotal += item.amount ;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    
    const li = document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML= `
            <div class="cart-left">
                <div class="cart-left-image">
                    <img src="${item.imageUrl}" alt="product" class="img-fluid" />
                </div>
                <div class="cart-left-info">
                    <a class="cart-left-info-title" href="#">${item.description}</a>
                    <span class="cart-left-info-price"> ${item.carPrice} ₺</span>
                </div>
            </div>
            <div class="cart-right">
                <div class="cart-right-quantity">
                    <button class=" btn quantity-minus" data-id=${item.id}>
                        <i class="icon icon-minus"></i>
                    </button>
                    <span class="quantity">${item.amount}</span>
                    <button class=" btn quantity-plus" data-id=${item.id}>
                        <i class="icon icon-plus"></i>
                    </button>
                </div>
                <div class="cart-right-remove">
                    <button class=" btn cart-remove-btn" data-id=${item.id}>
                        <i class="icon icon-trash"></i>
                    </button>
                </div>
            </div>
            
        `;
    cartContent.appendChild(li);
  }

  addFavoriteItem(item) {
    const div = document.createElement("");
    div.classList.add("col-sm-1 col-lg-4 mb-4");
    div.innerHTML = `
          <div class="block-4 text-center border">
          <img src="${item.imageUrl}" alt="" class="card-img-top">
          <button class="icon icon-heart btn  position-absolute"
              style="top: -1rem; right: -0.45rem" data-id="${item.id}"></button>
          <div class="badge bg-dark text-white position-absolute"
              style="top: 0.5rem; left: 0.5rem">-10</div>
          <div class="card-body p-4 ">
              <div class="text-center color">
                  <h3><a href="#">${item.description}</a></h3>
                  // <h4 class="fw-normal">${item.category}</h4>
                  <span class="text-muted text-decoration-line-through">${item.oldPrice}₺</span>
                  <span class="text-primary font-weight-bold"> ₺${item.carPrice} </span>
              </div>
          </div>
          <div class="card-footer p-2 pt-0 border-top-0 bg-transparent">
              <div>
                  <button class="btn btn-secondary btn-sm mb-3 mt-auto"
                      data-id="${item.id}">Add To Cart</button>
              </div>
          </div>
      </div>
      `;
    favContent.appendChild(div);
  }

  showCart() {
    cartBtn.click();
  }

  showFav() {
    favoriBtn.click();
  }

  setupAPP() {
    cart = Storage.getCart();
    this.saveCartValues(cart);
    this.populateCart(cart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart-remove-btn")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        removeItem.parentElement.parentElement.parentElement.remove();
        this.removeItem(id);
      } else if (event.target.classList.contains("quantity-minus")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === Number(id));
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.saveCartValues(cart);
          lowerAmount.nextElementSibling.innerText = tempItem.amount;
        } else {
          lowerAmount.parentElement.parentElement.parentElement.remove();
          this.removeItem(id);
        }
      } else if (event.target.classList.contains("quantity-plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === Number(id));
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.saveCartValues(cart);
        addAmount.previousElementSibling.innerText = tempItem.amount;
      }
    });
  }
  // cartLogic2() {
  //   clearFavBtn.addEventListener("click", () => {
  //     this.clearCart2();
  //   });

  //   favContent.addEventListener("click", (event) => {
  //     if (event.target.classList.contains("icon-heart")) {
  //       let removeItem = event.target;
  //       let id = removeItem.dataset.id;
  //       removeItem.parentElement.parentElement.parentElement.remove();
  //       this.removeItem(id);
  //     } else if (event.target.classList.contains("icon-heart")) {
  //       let addAmount = event.target;
  //       let id = addAmount.dataset.id;
  //       let tempItem = cart2.find((item) => item.id === id);
  //       tempItem.amount = tempItem.amount + 1;
  //       Storage.saveCart(cart2);
  //       this.saveCartValues(cart2);
  //       addAmount.previousElementSibling.innerText = tempItem.amount;
  //     }
  //   });
  // }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(Number(id)));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  // clearCart2() {
  //   let cartItems = cart2.map((item) => item.id);
  //   cartItems.forEach((id) => this.removeItem(id));
  //   while (favContent.children.length > 0) {
  //     favContent.removeChild(favContent.children[0]);
  //   }
  // }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.saveCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSinleButton(id);
    button.disabled = false;
    button.style.opacity = "1";
  }

  getSinleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === Number(id));
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupAPP();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.getBagButtons2();
      ui.cartLogic();
      // ui.cartLogic2();
    });
   

select.onchange = sortingValue;

function sortingValue() {
  let field = document.querySelector("item");
  let li = Array.from(field.children);
  let select = document.getElementById("select");
  let ar = [];
  
  for (let i of li) {
    const last = i.lastElementChild;
    const x = lasttextContent.trim();
    const y = Number(x.substring(1));
    i.setAttribute("itemPrice", y);
    ar.push(i);
  }

  if (this.value == "default") {
    while (field.firstChild) {
      field.removeChild(field.firstChild);
    }
    field.append(...ar);
    if (this.value == "LowToHigh") {
      sortElem(field, li, true);
    }
    if (this.value == "HighToLow") {
      sortElem(field, li, false);
    }
  }
  
}

function sortElem(field, li, asc) {
  let dm, sortLi;
  dm = asc ? 1 : -1;
  sortLi = li.sort((a, b) => {
    const ax = a.getAttribute("itemPrice");
    const bx = b.getAttribute("itemPrice");
    return ax > bx ? 1 * dm : 1 * dm;
  });
  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }
  field.append(...sortli);
}
});



