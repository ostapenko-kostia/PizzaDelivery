const productsContainer = document.querySelector("#products-container");

// Запуск функції
getProducts();

// Асинхронна функція для отримання данних із файлу products.json
async function getProducts() {
    // Отримуємо данні
    const response = await fetch("./assets/js/products.json");
    // Парсим дані з json в js
    const productsArray = await response.json();
    // Запускаємо функцію рендера товарів
    renderProducts(productsArray);
}


function renderProducts(productsArray) {
    productsArray.forEach((item) => {
        const productHTML = `<div class="col-md-6">
        <div class="card mb-4" data-id="${item.id}">
            <img
                class="product-img"
                src="${item.imageSource}"
                alt=""
            />
            <div class="card-body text-center">
                <h4 class="item-title">${item.title}</h4>
                <div class="details-wrapper">
                    <div class="items counter-wrapper">
                        <div
                            onclick="counterButtonPressed(this)"
                            class="items__control"
                            data-action="minus"
                        >
                            -
                        </div>
                        <div
                            class="items__current"
                            data-counter
                        >
                            1
                        </div>
                        <div
                            onclick="counterButtonPressed(this)"
                            class="items__control"
                            data-action="plus"
                        >
                            +
                        </div>
                    </div>

                    <div class="price">
                        <div class="price__weight">
                            <img
                                src="assets/images/diametr.png"
                                height="15"
                            />
                            ${item.size}
                        </div>
                        <div class="price__currency">
                            ₴${item.price}
                        </div>
                    </div>
                </div>

                <button
                    onclick="cartButtonPressed(this)"
                    data-cart
                    type="button"
                    class="btn btn-block btn-outline-warning"
                >
                    + в корзину
                </button>
            </div>
        </div>`;

        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}
