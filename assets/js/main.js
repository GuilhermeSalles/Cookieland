/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== TOOLTIPS ===============*/
// Tooltips nativos (title) + aria-label para acessibilidade
const tooltipTargets = [
  ["#nav-toggle", "Open menu"],
  ["#nav-close", "Close menu"],
  ["#cart-icon", "View your bag"],
  [".info__button", "View photos and details"],
  [".popular__button", "Add to bag"],
  [".info-modal__add", "Add this item to your bag"],
  [".close", "Close"],
  [".scrollup", "Back to top"],
  [".note-toggle", "Tap to see an important note about this item"],
  ["a[href*='whatsapp']", "Chat with us on WhatsApp"],
  ["a[href*='instagram']", "Follow us on Instagram"],
  ["a[href*='tiktok']", "Follow us on TikTok"],
  ["a[href*='facebook']", "Find us on Facebook"],
];

tooltipTargets.forEach(([selector, text]) => {
  document.querySelectorAll(selector).forEach((el) => {
    if (!el.title) el.title = text;
    if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", text);
  });
});

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  this.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};
window.addEventListener("scroll", shadowHeader);

/*=============== SHOW SCROLL UP ===============*/
// const scrollUp = () => {
//   const scrollUp = document.getElementById("scroll-up");
// When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
//   this.scrollY >= 350
//     ? scrollUp.classList.add("show-scroll")
//     : scrollUp.classList.remove("show-scroll");
// };
// window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]",
      );

    // Seções sem link no menu (delivery, gallery, contact) são ignoradas
    if (!sectionsClass) return;

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 300,
  //reset: true, //Animations repeat
});

sr.reveal(".home__data, .footer, .popular__subtitle, .section__title");
sr.reveal(".home__dish", { delay: 500, distance: "100px", origin: "bottom" });
sr.reveal(".home__mosaic-item", {
  delay: 600,
  interval: 150,
  distance: "60px",
  origin: "bottom",
  duration: 1500,
});
sr.reveal(".home__badge", { delay: 1300, origin: "bottom", distance: "20px" });
sr.reveal(".recipe__img,.delivery__img, .contact__image", { origin: "left" });
sr.reveal(".recipe__data, .delivery__data, .contact__data", {
  origin: "right",
});
sr.reveal(".popular__card", { interval: 100 });
sr.reveal(".gallery__item", {
  interval: 80,
  origin: "bottom",
  distance: "40px",
  duration: 1500,
});

/*=============== CARRINHO DE COMPRAS ===============*/
let cart = [];
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Delegação de eventos para os botões +, - e remover dentro do carrinho
cartItemsContainer.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".cart-item-remove");
  if (removeBtn) {
    const name = decodeURIComponent(removeBtn.dataset.name || "");
    if (name) removeItem(name);
    return;
  }

  const btn = event.target.closest(".quantity-btn");
  if (!btn) return;

  const name = decodeURIComponent(btn.dataset.name || "");
  const change = parseInt(btn.dataset.change, 10);

  if (!name || isNaN(change)) return;

  updateQuantity(name, change);
});

// Preços definidos
const pricing = {
  single: 2.7, // Preço por cookie individual
  box4: 10, // Box com 4 cookies
  box6: 15, // Box com 6 cookies
  potCookie: 3.0, // Produtos especiais (não afetados pelo desconto de box)
};

// Calcula o subtotal dos cookies já com desconto de box (4 ou 6)
function calculateBoxAdjustedSubtotal() {
  let cartSubtotal = 0;
  let cookieCount = 0;

  cart.forEach((item) => {
    cartSubtotal += item.price * item.quantity;
    if (item.price === pricing.single) {
      cookieCount += item.quantity;
    }
  });

  let boxApplied = false;
  let boxPrice = 0;
  let savings = 0;

  if (cookieCount === 4 || cookieCount === 6) {
    boxPrice = cookieCount === 6 ? pricing.box6 : pricing.box4;
    const normalPrice = cookieCount * pricing.single;
    savings = normalPrice - boxPrice;

    // Ajusta subtotal para considerar o valor do pack
    cartSubtotal = cartSubtotal - normalPrice + boxPrice;
    boxApplied = true;
  }

  return { cartSubtotal, cookieCount, boxApplied, boxPrice, savings };
}

// Calcula o total dos add-ons (bebidas, extras, etc.)
function calculateAddOnsTotal() {
  let addOnsTotal = 0;

  for (const drink in addOns.drinks) {
    addOnsTotal += addOns.drinks[drink] * itemPrices[drink];
  }
  for (const extra in addOns.extras) {
    addOnsTotal += addOns.extras[extra] * itemPrices[extra];
  }

  return addOnsTotal;
}

// Função para adicionar item ao carrinho
function addToCart(item) {
  const name = item.name;
  // Verifica se é um produto especial (como potCookie) ou usa o preço single
  const price = item.price || pricing.single; // Usa o preço passado ou o padrão
  const quantity = 1;

  // Verifica se já existe no carrinho
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.name === name,
  );

  if (existingItemIndex !== -1) {
    // Item já existe, atualiza quantidade
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Adiciona novo item
    cart.push({
      name,
      price,
      image: item.image,
      quantity,
      originalName: item.name,
    });
  }

  updateCartCount();
  updateCartModal();
  updateCartTotal(); // <<< garante total certo com box + addons
  showAddToCartFeedback(item.card);
}

// Mostrar feedback visual ao adicionar ao carrinho
function showAddToCartFeedback(card) {
  const button = card?.querySelector(".popular__button");
  if (!button) return;
  button.innerHTML = '<i class="ri-check-line"></i>';
  button.style.backgroundColor = "hsl(130, 60%, 50%)";

  setTimeout(() => {
    button.innerHTML = '<i class="ri-shopping-bag-3-fill"></i>';
    button.style.backgroundColor = "";
  }, 1000);
}

// Atualizar contador de itens no ícone da sacola
function updateCartCount() {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = itemCount;

  cartCount.style.transform = "scale(1.2)";
  setTimeout(() => {
    cartCount.style.transform = "scale(1)";
  }, 200);

  updateCheckoutState(itemCount);
}

// Habilita/desabilita o checkout e atualiza o resumo conforme a sacola
function updateCheckoutState(itemCount) {
  const checkoutBtn = document.getElementById("checkout-btn");
  const summaryText = document.getElementById("checkout-summary-text");
  const isEmpty = cart.length === 0;

  checkoutBtn.disabled = isEmpty;

  summaryText.textContent = isEmpty
    ? "Your bag is empty — add some cookies first!"
    : `${itemCount} item${itemCount > 1 ? "s" : ""} in your bag. Fill in your details below and place your order.`;
}

// Atualizar o conteúdo do modal
function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  // Sacola vazia: estado amigável
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="ri-shopping-bag-3-line"></i>
        <p>Your bag is empty.<br>Add some cookies to make it happy!</p>
      </div>
    `;
    return;
  }

  // Renderiza os itens do carrinho
  cart.forEach((item) => {
    const encodedName = encodeURIComponent(item.name);

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="item-header">
            <h3>${item.name}</h3>
          </div>
          <p>£${item.price.toFixed(2)} each × ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn"
                  data-name="${encodedName}"
                  data-change="-1"
                  title="Remove one"
                  aria-label="Remove one">
            <i class="ri-subtract-line"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn"
                  data-name="${encodedName}"
                  data-change="1"
                  title="Add one"
                  aria-label="Add one">
            <i class="ri-add-line"></i>
          </button>
        </div>
        <button class="cart-item-remove"
                data-name="${encodedName}"
                title="Remove from bag"
                aria-label="Remove from bag">
          <i class="ri-delete-bin-6-line"></i>
        </button>
      </div>
    `;
  });

  // Mostra economia do box (4 ou 6) usando o helper
  const { cookieCount, boxApplied, savings } = calculateBoxAdjustedSubtotal();

  if (boxApplied) {
    const boxType = cookieCount === 6 ? "6-pack" : "4-pack";

    cartItemsContainer.innerHTML += `
      <div class="savings-summary">
        <i class="ri-coins-line"></i>
        <span>Applied ${boxType} box discount (saving £${savings.toFixed(
          2,
        )})</span>
      </div>
    `;
  } else if (cookieCount > 0 && cookieCount < 4) {
    // Incentivo: mostra quanto falta para o desconto do box de 4
    const missing = 4 - cookieCount;
    cartItemsContainer.innerHTML += `
      <div class="cart-hint">
        <i class="ri-coins-line"></i>
        <span>Add ${missing} more cookie${
          missing > 1 ? "s" : ""
        } to unlock the <strong>4-pack box for £10</strong>!</span>
      </div>
    `;
  } else if (cookieCount === 5) {
    cartItemsContainer.innerHTML += `
      <div class="cart-hint">
        <i class="ri-coins-line"></i>
        <span>Add 1 more cookie to unlock the <strong>6-pack box for £15</strong>!</span>
      </div>
    `;
  }

  // Valor final continua sendo calculado em updateCartTotal()
}

// Atualizar quantidade de itens no carrinho
function updateQuantity(name, change) {
  const itemIndex = cart.findIndex((cartItem) => cartItem.name === name);

  if (itemIndex !== -1) {
    const item = cart[itemIndex];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      item.quantity = newQuantity;
    }

    updateCartCount();
    updateCartModal();
    updateCartTotal(); // <<< recalcula total sempre
  }
}

// Remover item completamente do carrinho
function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartCount();
  updateCartModal();
  updateCartTotal(); // <<< garante consistência
}

// Exibir modal do carrinho
function showCartModal() {
  cartModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Fechar modal do carrinho
function hideCartModal() {
  cartModal.style.display = "none";
  document.body.style.overflow = "";
}

// Exibir tela de checkout
const checkoutModal = document.getElementById("checkout-modal");

function showCheckoutModal() {
  checkoutModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function hideCheckoutModal() {
  checkoutModal.style.display = "none";
  document.body.style.overflow = "";
}

// Event Listeners
cartIcon.addEventListener("click", showCartModal);
closeModal.addEventListener("click", hideCartModal);

// Sacola -> Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;
  hideCartModal();
  showCheckoutModal();
});

// Checkout -> Sacola
document.getElementById("back-to-bag").addEventListener("click", () => {
  hideCheckoutModal();
  showCartModal();
});

document
  .getElementById("close-checkout")
  .addEventListener("click", hideCheckoutModal);

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    hideCartModal();
  }
  if (event.target === checkoutModal) {
    hideCheckoutModal();
  }
});

// Adicionar evento nos botões de adicionar ao carrinho
document.querySelectorAll(".popular__button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".popular__card");
    // Itens "Available soon" não podem ser adicionados ao carrinho
    if (button.disabled || card.classList.contains("popular__card--soon")) return;
    const name = card.querySelector(".popular__title").textContent.trim();
    const image = card.querySelector("img").src;

    // NOVO: ler preço do card, se existir
    let priceText = card.querySelector(".popular__price")?.textContent || "";
    priceText = priceText.replace(/[£\s]/g, "");
    const parsed = parseFloat(priceText);
    const price = isNaN(parsed) ? undefined : parsed;

    addToCart({
      name,
      image,
      price, // passa preço quando houver; senão cai no pricing.single
      card,
    });
  });
});

// =================== VARIÁVEIS ===================
let addOns = {
  drinks: {
    Coke: 0,
    Fanta: 0,
  },
  extras: {
    Catupiry: 0,
    "Nutella Border": 0,
  },
};

const itemPrices = {
  Coke: 1.1,
  Fanta: 1.1,
  Catupiry: 2.0,
  "Nutella Border": 2.0,
};

// =================== FUNÇÕES ===================

// Atualizar o valor total do carrinho (pack + add-ons) na sacola e no checkout
function updateCartTotal() {
  const { cartSubtotal } = calculateBoxAdjustedSubtotal();
  const addOnsTotal = calculateAddOnsTotal();

  const total = cartSubtotal + addOnsTotal;

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("checkout-total").textContent = total.toFixed(2);
  return { cartSubtotal, addOnsTotal, total };
}

// =================== EVENTOS ===================

// Incrementar ou decrementar itens adicionais (drinks e cream cheese)
document
  .querySelectorAll(".addon-increment, .addon-decrement")
  .forEach((button) => {
    button.addEventListener("click", function () {
      const item = this.dataset.item;

      if (this.classList.contains("addon-increment")) {
        if (addOns.drinks[item] !== undefined) {
          addOns.drinks[item]++;
        } else if (addOns.extras[item] !== undefined) {
          addOns.extras[item]++;
        }
      } else if (this.classList.contains("addon-decrement")) {
        if (addOns.drinks[item] !== undefined && addOns.drinks[item] > 0) {
          addOns.drinks[item]--;
        } else if (
          addOns.extras[item] !== undefined &&
          addOns.extras[item] > 0
        ) {
          addOns.extras[item]--;
        }
      }

      document.querySelector(
        `.addon-quantity[data-item="${item}"]`,
      ).textContent =
        addOns.drinks[item] !== undefined
          ? addOns.drinks[item]
          : addOns.extras[item];

      updateCartTotal();
    });
  });
// =================== ENVIAR PEDIDO ===================
// =================== ENVIAR PEDIDO ===================
document.getElementById("submit-order").addEventListener("click", function () {
  const name = document.getElementById("customer-name").value;
  const address = document.getElementById("customer-address").value;
  const serviceType = document.getElementById("service-type").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const observation = document.getElementById("customer-observation").value;
  const addonsObservation = document.getElementById(
    "cream-cheese-observation",
  ).value;
  const deliveryDay = document.getElementById("delivery-day-select").value;
  const deliveryTime = document.getElementById("delivery-time-select").value;
  const deliveryLocation = document.getElementById(
    "delivery-location-select",
  ).value;
  const pickupDay = document.getElementById("pickup-day-select").value;
  const pickupTime = document.getElementById("pickup-time-select").value;

  if (!name || !address || cart.length === 0) {
    alert(
      "Please fill out all required fields and make sure you have items in your cart.",
    );
    return;
  }

  const now = new Date();
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  };
  const currentDate = new Intl.DateTimeFormat("en-GB", options)
    .format(now)
    .replace(",", " -");

  // Usa o helper do pack
  const { cartSubtotal, cookieCount, boxApplied, boxPrice, savings } =
    calculateBoxAdjustedSubtotal();
  const addOnsTotal = calculateAddOnsTotal();
  let deliveryFee = 0;

  let boxMessage = "";
  let hasBox = boxApplied;

  if (boxApplied) {
    boxMessage = `Box of ${cookieCount} cookies: £${boxPrice.toFixed(2)}\n`;
  }

  // Construir mensagem do WhatsApp
  let message = `${currentDate}\n\n *Service type:* ${serviceType}\n-------------------------------------------\nHello, my name is ${name}, I'd like to place an order.\n *Address:* ${address}\n\n *Products:*\n`;

  // Adicionar box se aplicável
  if (hasBox) {
    message += boxMessage;
  }

  // Adicionar todos os itens ao message
  cart.forEach((item) => {
    // Se for um cookie individual e tiver box, não listamos individualmente no resumo principal
    if (!(item.price === pricing.single && hasBox)) {
      message += `${item.name}: £${item.price.toFixed(2)} × ${item.quantity}\n`;
    }
  });

  // Listar sabores se tiver box
  if (hasBox) {
    message += "\n *Cookies included in box:*\n";
    cart.forEach((item) => {
      if (item.price === pricing.single) {
        message += `- ${item.name} × ${item.quantity}\n`;
      }
    });
  }

  // Detalhes dos add-ons
  let addOnsMessage = "\n *Add-ons:*\n";
  let hasAddOns = false;

  for (const drink in addOns.drinks) {
    if (addOns.drinks[drink] > 0) {
      addOnsMessage += `${drink}: ${itemPrices[drink]} × ${addOns.drinks[drink]}\n`;
      hasAddOns = true;
    }
  }

  for (const extra in addOns.extras) {
    if (addOns.extras[extra] > 0) {
      addOnsMessage += `${extra}: ${itemPrices[extra]} × ${addOns.extras[extra]}\n`;
      hasAddOns = true;
    }
  }

  if (!hasAddOns) {
    addOnsMessage += "None\n";
  }

  message += addOnsMessage;

  // Adicionar observações
  if (observation) {
    message += `\n*Observation:* ${observation}`;
  }
  if (addonsObservation) {
    message += `\n*Add-ons Observation:* ${addonsObservation}`;
  }

  // Informações de entrega/retirada
  if (serviceType === "Delivery") {
    if (deliveryLocation === "Portadown") deliveryFee = 3.0;
    else if (deliveryLocation === "Lugan") deliveryFee = 5.0;
    else if (deliveryLocation === "Craigavon") deliveryFee = 4.0;
    else if (deliveryLocation === "Dungannon") deliveryFee = 30.0;
    else if (deliveryLocation === "Belfast") deliveryFee = 30.0;

    message += `\n\n *Delivery Details:*\n- Day: ${deliveryDay}\n- Time: ${deliveryTime}\n- Location: ${deliveryLocation}\n- Fee: £${deliveryFee.toFixed(
      2,
    )}`;
  } else if (serviceType === "Pick-up") {
    message += `\n\n *Pick-up Details:*\n- Day: ${pickupDay}\n- Time: ${pickupTime}\n- Address: 107 Baltylum Meadows, BT62 4BW, Craigavon, Northern Ireland`;
  }

  // Resumo financeiro
  const total = cartSubtotal + addOnsTotal + deliveryFee;
  message += `\n\n *Order Summary:*\n- Products: £${cartSubtotal.toFixed(2)}`;

  if (hasBox) {
    message += ` (Saved £${savings.toFixed(2)} with box discount)`;
  }

  message += `\n- Add-ons: £${addOnsTotal.toFixed(2)}`;
  message += `\n- Delivery: £${deliveryFee.toFixed(2)}`;
  message += `\n- *Total: £${total.toFixed(2)}*`;

  // Informações de pagamento
  if (paymentMethod === "Bank Transfer") {
    message += `\n\n *Payment Method:* Bank Transfer (British Pound)\n\n*Account Details:*\n- Beneficiary: Veronica Martins\n- Sort code: 04-00-75\n- Account number: 75095661`;
  } else if (paymentMethod === "Cash") {
    message += `\n\n *Payment Method: Cash*`;
  }

  const whatsappMessage = encodeURIComponent(message);
  window.open(`https://wa.me/447850988160?text=${whatsappMessage}`, "_blank");
});

/*=============== MODAL INFORMAÇÕES DOS ITENS ===============*/
// Catálogo dos itens. Cada item pode ter VÁRIAS fotos em "images"
// (a primeira é a principal). Basta colocar as fotos novas na pasta
// do sabor em assets/img/cookies|sandwiches|pots|donuts e listar aqui.
const itemInfo = {
  /* ---------- CLASSIC COOKIES ---------- */
  "Nutella Cookie": {
    img: "assets/img/cookies/nutella/cookie-nutella-1.jpeg",
    images: [
      "assets/img/cookies/nutella/cookie-nutella-1.jpeg",
      "assets/img/cookies/nutella/cookie-nutella-2.jpeg",
      "assets/img/cookies/nutella/cookie-nutella-3.jpeg",
    ],
    description:
      "A cookie filled with the classic Nutella hazelnut cream for an unmistakable treat.",
  },
  "Traditional Cookie": {
    img: "assets/img/cookies/traditional/cookie-traditional-1.jpeg",
    images: [
      "assets/img/cookies/traditional/cookie-traditional-1.jpeg",
      "assets/img/cookies/traditional/cookie-traditional-2.jpeg",
      "assets/img/cookies/traditional/cookie-traditional-3.jpeg",
    ],
    description: "The classic cookie with a timeless taste.",
  },
  "Kinder Bueno Cookie": {
    img: "assets/img/cookies/kinder-bueno/cookie-kinder-bueno-3.jpeg",
    images: [
      "assets/img/cookies/kinder-bueno/cookie-kinder-bueno-3.jpeg",
      "assets/img/cookies/kinder-bueno/cookie-kinder-bueno-1.jpeg",
      "assets/img/cookies/kinder-bueno/cookie-kinder-bueno-2.jpeg",
    ],
    description:
      "A cookie filled with hazelnut cream inspired by the famous Kinder Bueno.",
  },
  "KitKat Cookie": {
    img: "assets/img/cookies/kitkat/cookie-kitkat-1.jpeg",
    images: [
      "assets/img/cookies/kitkat/cookie-kitkat-1.jpeg",
      "assets/img/cookies/kitkat/cookie-kitkat-2.jpeg",
      "assets/img/cookies/kitkat/cookie-kitkat-3.jpeg",
    ],
    description:
      "A crunchy cookie filled with the unmistakable crunch of KitKat.",
  },
  "M&M's Cookie": {
    img: "assets/img/cookies/mms/cookie-mms-2.jpeg",
    images: [
      "assets/img/cookies/mms/cookie-mms-2.jpeg",
      "assets/img/cookies/mms/cookie-mms-1.jpeg",
      "assets/img/cookies/mms/cookie-mms-3.jpeg",
    ],
    description:
      "A classic cookie packed with colourful mini M&M's, crispy on the outside and soft in the middle.",
  },
  "Snickers Cookie": {
    img: "assets/img/cookies/snickers/cookie-snickers-3.jpeg",
    images: [
      "assets/img/cookies/snickers/cookie-snickers-3.jpeg",
      "assets/img/cookies/snickers/cookie-snickers-1.jpeg",
      "assets/img/cookies/snickers/cookie-snickers-2.jpeg",
    ],
    description:
      "Soft cookie dough with Snickers chocolate pieces mixed in and a creamy Snickers filling in the centre.",
  },
  "Galaxy Cookie": {
    img: "assets/img/cookies/galaxy/cookie-galaxy-3.jpeg",
    images: [
      "assets/img/cookies/galaxy/cookie-galaxy-3.jpeg",
      "assets/img/cookies/galaxy/cookie-galaxy-1.jpeg",
      "assets/img/cookies/galaxy/cookie-galaxy-2.jpeg",
    ],
    description:
      "A rich cookie with a smooth Galaxy chocolate filling and Galaxy chunks on top.",
  },
  "Funfetti Cookie": {
    img: "assets/img/cookies/funfetti/cookie-funfetti-1.jpeg",
    images: [
      "assets/img/cookies/funfetti/cookie-funfetti-1.jpeg",
      "assets/img/cookies/funfetti/cookie-funfetti-2.jpeg",
      "assets/img/cookies/funfetti/cookie-funfetti-3.jpeg",
    ],
    description:
      "A colourful birthday-style cookie loaded with rainbow sprinkles and chocolate chips.",
  },
  "Red Velvet Cookie": {
    img: "assets/img/cookies/red-velvet/cookie-red-velvet-2.jpeg",
    images: [
      "assets/img/cookies/red-velvet/cookie-red-velvet-2.jpeg",
      "assets/img/cookies/red-velvet/cookie-red-velvet-1.jpeg",
      "assets/img/cookies/red-velvet/cookie-red-velvet-3.jpeg",
    ],
    description:
      "An elegant Red Velvet cookie with a rich chocolate ganache filling.",
  },
  "Alpino Cookie": {
    img: "assets/img/cookies/alpino/cookie-alpino-3.jpeg",
    images: [
      "assets/img/cookies/alpino/cookie-alpino-3.jpeg",
      "assets/img/cookies/alpino/cookie-alpino-1.jpeg",
      "assets/img/cookies/alpino/cookie-alpino-2.jpeg",
    ],
    description:
      "Cookie with chunks of smooth white chocolate and rich semi-sweet chocolate.",
  },
  "Lindt Cookie": {
    img: "assets/img/cookies/lindt/cookie-lindt.jpg",
    images: ["assets/img/cookies/lindt/cookie-lindt.jpg"],
    description:
      "An irresistible cookie filled with the rich Lindor chocolate by Lindt.",
  },
  "Dubai Cookie": {
    img: "assets/img/cookies/dubai/cookie-pistache.jpg",
    images: ["assets/img/cookies/dubai/cookie-pistache.jpg"],
    description:
      "A refined cookie filled with pistachio cream, inspired by the exotic flavours of Dubai.",
  },
  "Lotus Biscoff Cookie": {
    img: "assets/img/cookies/lotus-biscoff/cookie-lotus-biscoff-1.jpeg",
    images: [
      "assets/img/cookies/lotus-biscoff/cookie-lotus-biscoff-1.jpeg",
      "assets/img/cookies/lotus-biscoff/cookie-lotus-biscoff-2.jpeg",
      "assets/img/cookies/lotus-biscoff/cookie-lotus-biscoff-3.jpeg",
    ],
    description:
      "A delightful cookie filled with Lotus Biscoff cream, perfect for fans of unique flavours.",
  },

  /* ---------- COOKIE SANDWICHES ---------- */
  "Love Sandwich": {
    img: "assets/img/sandwiches/love/sandu-love.jpg",
    images: ["assets/img/sandwiches/love/sandu-love.jpg"],
    description:
      "Red Velvet cookie sandwich with vanilla and strawberry brigadeiro in the middle.",
  },
  "Ninho Sandwich": {
    img: "assets/img/sandwiches/ninho/sandu-ninho.jpg",
    images: ["assets/img/sandwiches/ninho/sandu-ninho.jpg"],
    description:
      "Milk powder brigadeiro with Nutella in the middle. Optionally topped with milk powder outside.",
  },
  "Chocolate Sandwich": {
    img: "assets/img/sandwiches/chocolate/sandu-choco.jpg",
    images: ["assets/img/sandwiches/chocolate/sandu-choco.jpg"],
    description:
      "Chocolate brigadeiro sandwich filled with chocolate chips on the outside.",
  },
  "Duo Sandwich": {
    img: "assets/img/sandwiches/duo/sandu-duo.jpg",
    images: ["assets/img/sandwiches/duo/sandu-duo.jpg"],
    description:
      "Half chocolate brigadeiro and half Ninho brigadeiro for a perfect duo.",
  },
  "Pistachio Sandwich": {
    img: "assets/img/sandwiches/pistachio/sandu-pista.jpg",
    images: ["assets/img/sandwiches/pistachio/sandu-pista.jpg"],
    description:
      "Pistachio cookie sandwich filled with creamy pistachio brigadeiro.",
  },

  /* ---------- COOKIE POTS ---------- */
  "Mini Cookie Pot": {
    img: "assets/img/pots/mini-cookie-pot/mini-cookie-pot-3.jpeg",
    images: [
      "assets/img/pots/mini-cookie-pot/mini-cookie-pot-3.jpeg",
      "assets/img/pots/mini-cookie-pot/mini-cookie-pot-4.jpeg",
    ],
    description:
      "Mini cookie pots topped with Lotus, Nutella or Kinder — little pots of pure happiness.",
  },
  "Prestigio Pot": {
    img: "assets/img/pots/prestigio/pot-prestigio-1.jpeg",
    images: [
      "assets/img/pots/prestigio/pot-prestigio-1.jpeg",
      "assets/img/pots/prestigio/pot-prestigio-2.jpeg",
    ],
    description:
      "Cookie pot with coconut and chocolate brigadeiro, inspired by the classic Prestígio.",
  },
  // Temporarily off the menu
  // "RedVelvet with Chantilly Pot": {
  //   img: "assets/img/icon.png",
  //   images: ["assets/img/icon.png"],
  //   description:
  //     "Red Velvet cookie pot layered with fresh chantilly cream. Photo coming soon!",
  // },
  "Duo Creme Pot": {
    img: "assets/img/pots/duo-creme/pot-duo-creme-1.jpeg",
    images: [
      "assets/img/pots/duo-creme/pot-duo-creme-1.jpeg",
      "assets/img/pots/duo-creme/pot-duo-creme-2.jpeg",
    ],
    description:
      "Cookie pot with two creamy layers — chocolate and milk powder brigadeiro.",
  },
  "Kinder Chocolate Pot": {
    img: "assets/img/pots/kinder-chocolate/pot-kinder-chocolate-1.jpeg",
    images: [
      "assets/img/pots/kinder-chocolate/pot-kinder-chocolate-1.jpeg",
      "assets/img/pots/kinder-chocolate/pot-kinder-chocolate-2.jpeg",
    ],
    description:
      "Cookie pot loaded with Kinder chocolate cream and a Kinder Bueno piece on top.",
  },

  /* ---------- COOKIE DONUTS ---------- */
  "Cookie Donuts": {
    img: "assets/img/donuts/tradicional/box-mini-cookies-open.jpeg",
    images: [
      "assets/img/donuts/tradicional/box-mini-cookies-open.jpeg",
      "assets/img/donuts/tradicional/box-mini-cookies.jpeg",
      "assets/img/donuts/red-velvet/box-mini-cookies-open.jpeg",
    ],
    description:
      "A mixed box of mini cookie donuts: classic Traditional glazed with chocolate and Red Velvet with white chocolate chips. Sold in our pink Cookieland box.",
  },
};

// Item atualmente aberto no modal (para o botão "Add to bag")
let infoModalItem = null;

// Função para abrir o modal com mosaico de fotos, descrição, preço e botão
function openInfoModal(title, card) {
  const modal = document.getElementById("info-modal");
  const mosaic = document.getElementById("info-modal-mosaic");
  const modalTitle = document.getElementById("info-modal-title");
  const modalDescription = document.getElementById("info-modal-description");
  const modalPrice = document.getElementById("info-modal-price");

  const info = itemInfo[title];
  const images = info ? info.images || [info.img] : [];

  // Monta o mosaico: 1 foto = destaque; 2 fotos = lado a lado;
  // 3+ fotos = primeira em destaque e as demais menores
  mosaic.innerHTML = "";
  images.forEach((src, index) => {
    const cell = document.createElement("div");
    cell.className = "info-modal__photo";
    if (images.length === 2) {
      cell.classList.add("info-modal__photo--tall");
    } else if (index === 0) {
      cell.classList.add("info-modal__photo--main");
    }
    cell.innerHTML = `<img src="${src}" alt="${title}" loading="lazy">`;
    mosaic.appendChild(cell);
  });

  modalTitle.textContent = info ? title : "Item not found";
  modalDescription.textContent = info
    ? info.description
    : "Sorry, no description available for this item.";

  // Preço e dados do botão vêm do card clicado
  const priceText = card?.querySelector(".popular__price")?.textContent || "";
  modalPrice.textContent = priceText;

  const parsed = parseFloat(priceText.replace(/[£\s]/g, ""));
  infoModalItem =
    info && card
      ? {
          name: title,
          image: images[0],
          price: isNaN(parsed) ? undefined : parsed,
          card,
        }
      : null;

  // Botão "Add to bag" do modal: desativar para itens "Available soon"
  const addBtn = document.getElementById("info-modal-add");
  if (addBtn) {
    const isSoon = card?.classList.contains("popular__card--soon");
    addBtn.disabled = !!isSoon;
    addBtn.classList.toggle("disabled", !!isSoon);
    addBtn.innerHTML = isSoon
      ? '<i class="ri-time-line"></i> Available soon'
      : '<i class="ri-shopping-bag-3-fill"></i> Add to bag';
  }

  modal.style.display = "block";
}

// Seleciona todos os botões de informações e adiciona evento de clique
document.querySelectorAll(".info__button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".popular__card");
    const title = card.querySelector(".popular__title").textContent.trim();
    openInfoModal(title, card);
  });
});

// Botão "Add to bag" do modal de informações
const infoModalAddBtn = document.getElementById("info-modal-add");
infoModalAddBtn.addEventListener("click", () => {
  if (!infoModalItem) return;
  // Itens "Available soon" não podem ser adicionados ao carrinho
  if (infoModalItem.card?.classList.contains("popular__card--soon")) return;
  addToCart(infoModalItem);

  infoModalAddBtn.innerHTML = '<i class="ri-check-line"></i> Added!';
  setTimeout(() => {
    infoModalAddBtn.innerHTML =
      '<i class="ri-shopping-bag-3-fill"></i> Add to bag';
    document.getElementById("info-modal").style.display = "none";
  }, 800);
});

// Fecha o modal ao clicar no botão de fechar ou fora dele
document.getElementById("close-info-modal").addEventListener("click", () => {
  document.getElementById("info-modal").style.display = "none";
});

window.addEventListener("click", (event) => {
  const infoModalEl = document.getElementById("info-modal");
  if (event.target === infoModalEl) {
    infoModalEl.style.display = "none";
  }
});

/*=============== OPEN AND CLOSE SITE ===============*/
// DEV: true = força a loja ABERTA (sacola e botões habilitados) para
// pré-visualização. Volte para false antes de publicar!
const FORCE_STORE_OPEN = true;
window.FORCE_STORE_OPEN = FORCE_STORE_OPEN;

// Função modificada para buscar o status da loja do servidor
function isWithinOperatingHours() {
  if (FORCE_STORE_OPEN) return Promise.resolve(true);

  return fetch("get_status.php")
    .then((response) => response.json())
    .then((data) => data.is_open) // Retorna true se a loja estiver aberta
    .catch((error) => {
      console.error("Erro ao verificar o status da loja:", error);
      return false; // Em caso de erro, assume que a loja está fechada
    });
}

// Função para habilitar/desabilitar botões e sacola com base no status da loja
function updateButtonAndCartState() {
  const cartIcon = document.getElementById("cart-icon");
  const buttons = document.querySelectorAll(
    ".popular__button, .info-modal__add",
  );
  const statusModal = document.getElementById("status-modal");
  const closeModal = document.getElementById("close-status-modal");

  // Verifica o status da loja
  isWithinOperatingHours().then((isOpen) => {
    if (isOpen) {
      // Habilitar sacola e botões
      cartIcon.classList.remove("disabled");
      buttons.forEach((button) => {
        // Mantém desativados os botões de itens "Available soon"
        const card = button.closest?.(".popular__card");
        if (card && card.classList.contains("popular__card--soon")) {
          button.disabled = true;
          button.classList.add("disabled");
          return;
        }
        button.disabled = false;
        button.classList.remove("disabled");
      });

      // Esconder modal de status
      statusModal.style.display = "none";
    } else {
      // Desabilitar sacola e botões
      cartIcon.classList.add("disabled");
      buttons.forEach((button) => {
        button.disabled = true;
        button.classList.add("disabled");
      });

      // Mostrar modal com horário de funcionamento
      statusModal.style.display = "block";
    }
  });

  // Fecha o modal ao clicar no botão de fechar
  closeModal.addEventListener("click", () => {
    statusModal.style.display = "none";
  });
}

// Verificar o estado no carregamento da página
window.onload = updateButtonAndCartState;

// /*=============== MODAL DELIVERY OU PICK-UP ===============*/
// document.getElementById("service-type").addEventListener("change", function () {
//   const deliveryDay = document.getElementById("delivery-day");
//   const deliveryTime = document.getElementById("delivery-time");
//   const deliveryLocation = document.getElementById("delivery-location");
//   const pickupDay = document.getElementById("pickup-day");
//   const pickupTime = document.getElementById("pickup-time");

//   if (this.value === "Delivery") {
//     // Mostrar selects para o dia, horário e cidade de entrega
//     deliveryDay.style.display = "block";
//     deliveryTime.style.display = "block";
//     deliveryLocation.style.display = "block";
//     pickupDay.style.display = "none";
//     pickupTime.style.display = "none";

//     // Preencher horários de entrega
//     populateTimeSelect("delivery-time-select");
//   } else if (this.value === "Pick-up") {
//     // Mostrar selects para o dia e horário de coleta
//     deliveryDay.style.display = "none";
//     deliveryTime.style.display = "none";
//     deliveryLocation.style.display = "none";
//     pickupDay.style.display = "block";
//     pickupTime.style.display = "block";

//     // Preencher horários de coleta
//     populateTimeSelect("pickup-time-select");
//   } else {
//     // Ocultar todos os selects
//     deliveryDay.style.display = "none";
//     deliveryTime.style.display = "none";
//     deliveryLocation.style.display = "none";
//     pickupDay.style.display = "none";
//     pickupTime.style.display = "none";
//   }
// });
// /*=============== SELECT TIMES FOR DELIVERY OR PICK-UP ===============*/
// // Função para preencher horários no select
// function populateTimeSelect(selectId, endHour) {
//   const timeSelect = document.getElementById(selectId);
//   if (!timeSelect) {
//     console.error(`Select element with ID "${selectId}" not found.`);
//     return;
//   }
//   timeSelect.innerHTML = ""; // Limpa o conteúdo do select

//   const startTime = 18; // 6 PM
//   const startMinutes = 30; // 30 minutos
//   const interval = 20; // Intervalo em minutos

//   for (let hour = startTime; hour <= endHour; hour++) {
//     for (
//       let minutes = hour === startTime ? startMinutes : 0;
//       minutes < 60;
//       minutes += interval
//     ) {
//       if (hour === endHour && minutes > 0) break; // Garante que não ultrapasse o horário final

//       const formattedHour = hour > 12 ? hour - 12 : hour;
//       const period = hour >= 12 ? "PM" : "AM";
//       const timeOption = `${formattedHour}:${
//         minutes < 10 ? "0" + minutes : minutes
//       } ${period}`;
//       const option = document.createElement("option");
//       option.value = timeOption;
//       option.textContent = timeOption;
//       timeSelect.appendChild(option);
//     }
//   }
// }

// // Função para atualizar os horários com base no dia selecionado
// function updateTimeSelect(daySelectId, timeSelectId) {
//   const daySelect = document.getElementById(daySelectId);
//   const timeSelect = document.getElementById(timeSelectId);

//   if (!daySelect || !timeSelect) {
//     console.error(`Elementos não encontrados: ${daySelectId}, ${timeSelectId}`);
//     return;
//   }

//   daySelect.addEventListener("change", () => {
//     const selectedDay = daySelect.value;
//     const endHour = selectedDay === "Sunday" ? 21 : 22; // Até 9 PM aos domingos, 10 PM nos outros dias
//     populateTimeSelect(timeSelectId, endHour);
//   });

//   // Atualiza imediatamente com o valor inicial
//   const initialDay = daySelect.value;
//   const initialEndHour = initialDay === "Sunday" ? 21 : 22;
//   populateTimeSelect(timeSelectId, initialEndHour);
// }

// // Inicializa os selects de horários
// updateTimeSelect("delivery-day-select", "delivery-time-select");
// updateTimeSelect("pickup-day-select", "pickup-time-select");

/*=============== MODAL DELIVERY OU PICK-UP ===============*/
document.getElementById("service-type").addEventListener("change", function () {
  const deliveryDay = document.getElementById("delivery-day");
  const deliveryTime = document.getElementById("delivery-time");
  const deliveryLocation = document.getElementById("delivery-location");
  const pickupDay = document.getElementById("pickup-day");
  const pickupTime = document.getElementById("pickup-time");

  if (this.value === "Delivery") {
    // Mostrar selects para o dia, horário e cidade de entrega
    deliveryDay.style.display = "block";
    deliveryTime.style.display = "block";
    deliveryLocation.style.display = "block";
    pickupDay.style.display = "none";
    pickupTime.style.display = "none";

    // Preencher horários de entrega
    populateTimeSelect("delivery-time-select");
  } else if (this.value === "Pick-up") {
    // Mostrar selects para o dia e horário de coleta
    deliveryDay.style.display = "none";
    deliveryTime.style.display = "none";
    deliveryLocation.style.display = "none";
    pickupDay.style.display = "block";
    pickupTime.style.display = "block";

    // Preencher horários de coleta
    populateTimeSelect("pickup-time-select");
  } else {
    // Ocultar todos os selects
    deliveryDay.style.display = "none";
    deliveryTime.style.display = "none";
    deliveryLocation.style.display = "none";
    pickupDay.style.display = "none";
    pickupTime.style.display = "none";
  }
});
/*=============== SELECT TIMES FOR DELIVERY OR PICK-UP ===============*/
// Função para preencher horários no select
function populateTimeSelect(selectId) {
  const timeSelect = document.getElementById(selectId);
  if (!timeSelect) {
    console.error(`Select element with ID "${selectId}" not found.`);
    return;
  }
  timeSelect.innerHTML = "";

  const startTime = 19; // 7 PM
  const startMinutes = 0; // 0 minutes
  const endTime = 21; // 9 PM
  const interval = 20; // Intervalo em minutos

  for (let hour = startTime; hour <= endTime; hour++) {
    for (
      let minutes = hour === startTime ? startMinutes : 0;
      minutes < 60;
      minutes += interval
    ) {
      if (hour === endTime && minutes > 0) break; // Garante que não ultrapasse 21:00

      const formattedHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      const timeOption = `${formattedHour}:${
        minutes < 10 ? "0" + minutes : minutes
      } ${period}`;
      const option = document.createElement("option");
      option.value = timeOption;
      option.textContent = timeOption;
      timeSelect.appendChild(option);
    }
  }
}

// ==================== CAROUSEL ====================
// Só roda se a seção do carrossel existir na página
// (evita TypeError que interrompia o script quando a seção foi removida)
const track = document.querySelector(".carousel-track");

if (track) {
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");

  const titleElement = document.querySelector(".new__title");
  const priceElement = document.querySelector(".new__price");
  const noteElement = document.querySelector(".new__note");

  let currentSlide = 0;

  const productData = [
    {
      name: "The golden bites",
      price: 12.5,
      showNote: true,
    },
    {
      name: "Pot Classic Cookies with Nutella",
      price: 3.0,
      showNote: false,
    },
  ];

  function updateSlide() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });

    const { name, price, showNote } = productData[currentSlide];

    titleElement.textContent = name;
    priceElement.textContent = `£${price.toFixed(2)}`;
    noteElement.style.display = showNote ? "block" : "none";
  }

  nextButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  });

  prevButton.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  });

  updateSlide();

  // Botão de adicionar do carrossel
  document
    .querySelector(".new__button")
    .addEventListener("click", function () {
      const { name, price } = productData[currentSlide];
      const image = document.querySelector(".carousel-slide.active img").src;

      addToCart({
        name,
        price,
        image,
        card: this.closest(".new__container"),
      });
    });
}
