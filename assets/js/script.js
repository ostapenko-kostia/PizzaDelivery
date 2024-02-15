const cartWrapper = document.querySelector("#cart__wrapper");
const dataCartEmpty = document.querySelector("[data-cart-empty]");
const orderForm = document.querySelector("#order-form");
const totalPriceElement = document.querySelector(".total-price");
const priceElement = document.querySelector(".order-price");
const deliveryCost = document.querySelector(".delivery-cost");

orderForm.classList.add("none");
totalPriceElement.parentElement.classList.add("none");
priceElement.parentElement.classList.add("none");
deliveryCost.parentElement.classList.add("none");
deliveryCost.classList.remove("free");

function toggleCartStatus() {
    if (cartWrapper.children.length > 0) {
        dataCartEmpty.classList.add("none");
        orderForm.classList.remove("none");
    } else {
        dataCartEmpty.classList.remove("none");
        orderForm.classList.add("none");
    }
}

function calcCartPrice() {
    const cartItems = document.querySelectorAll(".cart-item");
    let totalPrice = 0;
    let deliveryPrice = 0;


    cartItems.forEach((item) => {
        const count = item.querySelector("[data-counter]").innerText;
        const price = item
            .querySelector(".price__currency")
            .innerText.replace(/₴/i, "");

        totalPrice += parseInt(count) * parseInt(price);
    });

    if (totalPrice <= 0) {
        totalPriceElement.parentElement.classList.add("none");
        priceElement.parentElement.classList.add("none");
        deliveryCost.parentElement.classList.add("none");
    } else {
        totalPriceElement.parentElement.classList.remove("none");
        priceElement.parentElement.classList.remove("none");
        deliveryCost.parentElement.classList.remove("none");
    }

    if (parseInt(totalPrice) >= 500) {
        deliveryCost.classList.add("free");
        deliveryCost.innerText = "безкоштовно";
        deliveryPrice = 0;
    } else {
        deliveryCost.classList.remove("free");
        deliveryPrice = 70;
        deliveryCost.innerText = `${deliveryPrice} ₴`;
    }

    priceElement.innerText = totalPrice;
    totalPriceElement.innerText =
        parseInt(deliveryPrice) + parseInt(totalPrice);
}

// Опрацюваємо натиснення кнопки лічильника
function counterButtonPressed(button) {
    const label = button.parentElement.querySelector("[data-counter]");
    let number = parseInt(label.textContent);
    if (button.getAttribute("data-action") == "minus") {
        if (number > 1) {
            number--;
            label.textContent = number;
        } else {
            if (button.closest(".cart-wrapper")) {
                button.closest(".cart-item").remove();
                toggleCartStatus();
                calcCartPrice();
            }
        }
    } else if (button.getAttribute("data-action") == "plus") {
        if (number < 99) {
            number++;
            label.textContent = number;
        }
    }

    if (button.closest(".cart-wrapper")) {
        calcCartPrice();
        toggleCartStatus();
    }
}

// Опрацюваємо натиснення кнопки "+ в корзину"
function cartButtonPressed(button) {
    // Знаходимо товар
    const card = button.closest(".card");

    // Зчитуємо інформацію
    const productInfo = {
        id: card.dataset.id,
        imageSource: card.querySelector(".product-img").getAttribute("src"),
        title: card.querySelector(".item-title").textContent,
        size: card.querySelector(".price__weight").innerText,
        price: card.querySelector(".price__currency").innerText,
        count: card.querySelector("[data-counter]").innerText,
    };

    // Шаблон для нових товарів
    const cartInnerHTML = `<div class="cart-item" data-id="${productInfo.id}">
                            <div class="cart-item__top">
                                <div class="cart-item__img">
                                    <img
                                        src="${productInfo.imageSource}"
                                        alt=""
                                    />
                                </div>
                                <div class="cart-item__desc">
                                    <div class="cart-item__title">
                                        ${productInfo.title}
                                    </div>
                                    <div class="cart-item__weight">
                                        <img
                                            src="assets/images/diametr.png"
                                            height="15"
                                        />
                                        ${productInfo.size}
                                    </div>

                                    <!-- cart-item__details -->
                                    <div class="cart-item__details" id="cart-item__details">
                                        <div
                                            class="items items--small counter-wrapper"
                                        >
                                            <div
                                                class="items__control"
                                                onclick="counterButtonPressed(this)"
                                                data-action="minus"
                                            >
                                                -
                                            </div>
                                            <div
                                                class="items__current"
                                                data-counter=""
                                            >
                                                ${productInfo.count}
                                            </div>
                                            <div
                                                class="items__control"
                                                data-action="plus"
                                                onclick="counterButtonPressed(this)"
                                            >
                                                +
                                            </div>
                                        </div>

                                        <div class="price">
                                            <div
                                                class="price__currency"
                                            >
                                                ${productInfo.price}
                                            </div>
                                        </div>
                                    </div>
                                    <!-- // cart-item__details -->
                                </div>
                            </div>
                        </div>`;

    // Перевіряємо чи є вже товар в корзині, якщо немає - добавляємо, якщо є - змінюємо показник лічильника
    const itemInCart = cartWrapper.querySelector(
        `[data-id="${productInfo.id}"]`
    );
    if (itemInCart != null) {
        const counterElement = itemInCart.querySelector("[data-counter]");
        counterElement.innerText =
            parseInt(counterElement.innerText) + parseInt(productInfo.count);
    } else {
        cartWrapper.insertAdjacentHTML("beforeend", cartInnerHTML);
    }

    // Обнуляємо лічильник товару в магазині
    card.querySelector("[data-counter]").innerText = "1";

    // Змінюємо блок корзини в залежності від того чи є там товари чи ні
    toggleCartStatus();

    // Підраховуємо ціну
    calcCartPrice();
}
