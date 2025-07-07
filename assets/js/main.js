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
        ".nav__menu a[href*=" + sectionId + "]"
      );

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
sr.reveal(".home__burger", { delay: 1200, distance: "100px", duration: 1500 });
sr.reveal(".home__ingredient", { delay: 1600, interval: 100 });
sr.reveal(".recipe__img,.delivery__img, .contact__image", { origin: "left" });
sr.reveal(".recipe__data, .delivery__data, .contact__data", {
  origin: "right",
});
sr.reveal(".popular__card", { interval: 100 });

/*=============== CARRINHO DE COMPRAS ===============*/
let cart = [];
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Preços definidos
const pricing = {
  single: 2.7, // Preço por cookie individual
  box4: 10, // Box com 4 cookies
  box6: 15, // Box com 6 cookies
  potCookie: 3.0, // Produtos especiais (não afetados pelo desconto de box)
};
// Função para adicionar item ao carrinho
function addToCart(item) {
  const name = item.name;
  // Verifica se é um produto especial (como potCookie) ou usa o preço single
  const price = item.price || pricing.single; // Usa o preço passado ou o padrão
  const quantity = 1;

  // Verifica se já existe no carrinho
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.name === name
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
  showAddToCartFeedback(item.card);
}

// Mostrar feedback visual ao adicionar ao carrinho
function showAddToCartFeedback(card) {
  const button = card.querySelector(".popular__button");
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
}

// Atualizar o conteúdo do modal
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let cookieCount = 0; // Contador apenas para cookies individuais (não produtos especiais)

  // Mostrar itens no carrinho e calcular total
  cart.forEach((item) => {
    // Verifica se é um cookie individual (preço igual a pricing.single)
    if (item.price === pricing.single) {
      cookieCount += item.quantity;
    }

    total += item.price * item.quantity;

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
          <button class="quantity-btn" onclick="updateQuantity('${
            item.name
          }', -1)">
            <i class="ri-subtract-line"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${
            item.name
          }', 1)">
            <i class="ri-add-line"></i>
          </button>
          <button class="remove-btn" onclick="removeItem('${item.name}')">
            <i class="ri-delete-bin-6-line"></i>
          </button>
        </div>
      </div>
    `;
  });

  // Mostrar economia apenas para boxes de cookies individuais
  if (cookieCount === 4 || cookieCount === 6) {
    const boxPrice = cookieCount === 6 ? pricing.box6 : pricing.box4;
    const normalPrice = cookieCount * pricing.single;
    const savings = (normalPrice - boxPrice).toFixed(2);
    const boxType = cookieCount === 6 ? "6-pack" : "4-pack";

    // Ajusta o total para considerar a box
    total = total - cookieCount * pricing.single + boxPrice;

    cartItemsContainer.innerHTML += `
      <div class="savings-summary">
        <i class="ri-coins-line"></i>
        <span>Applied ${boxType} box discount (saving £${savings})</span>
      </div>
    `;
  }

  cartTotal.textContent = total.toFixed(2);
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
  }
}

// Remover item completamente do carrinho
function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartCount();
  updateCartModal();
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

// Event Listeners
cartIcon.addEventListener("click", showCartModal);
closeModal.addEventListener("click", hideCartModal);

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    hideCartModal();
  }
});

// Adicionar evento nos botões de adicionar ao carrinho
document.querySelectorAll(".popular__button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".popular__card");
    const name = card.querySelector(".popular__title").textContent.trim();
    const image = card.querySelector("img").src;

    addToCart({
      name,
      image,
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

// Atualizar o valor total do carrinho
function updateCartTotal() {
  let cartSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let addOnsTotal = 0;
  for (const drink in addOns.drinks) {
    addOnsTotal += addOns.drinks[drink] * itemPrices[drink];
  }
  for (const extra in addOns.extras) {
    addOnsTotal += addOns.extras[extra] * itemPrices[extra];
  }

  const total = (cartSubtotal + addOnsTotal).toFixed(2);
  document.getElementById("cart-total").textContent = `${total}`;
  return { cartSubtotal, addOnsTotal, total }; // Retorna valores para uso posterior
}

// Alternar entre os passos do formulário
function goToStep(step) {
  document.getElementById("form-step-1").style.display =
    step === 1 ? "block" : "none";
  document.getElementById("form-step-2").style.display =
    step === 2 ? "block" : "none";
}

// =================== EVENTOS ===================

// Navegar para o próximo passo
document.getElementById("next-step").addEventListener("click", function () {
  goToStep(2);
});

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
        `.addon-quantity[data-item="${item}"]`
      ).textContent =
        addOns.drinks[item] !== undefined
          ? addOns.drinks[item]
          : addOns.extras[item];

      updateCartTotal();
    });
  });
// =================== ENVIAR PEDIDO ===================
document.getElementById("submit-order").addEventListener("click", function () {
  const name = document.getElementById("customer-name").value;
  const address = document.getElementById("customer-address").value;
  const serviceType = document.getElementById("service-type").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const observation = document.getElementById("customer-observation").value;
  const addonsObservation = document.getElementById(
    "cream-cheese-observation"
  ).value;
  const deliveryDay = document.getElementById("delivery-day-select").value;
  const deliveryTime = document.getElementById("delivery-time-select").value;
  const deliveryLocation = document.getElementById(
    "delivery-location-select"
  ).value;
  const pickupDay = document.getElementById("pickup-day-select").value;
  const pickupTime = document.getElementById("pickup-time-select").value;

  if (!name || !address || cart.length === 0) {
    alert(
      "Please fill out all required fields and make sure you have items in your cart."
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

  // Calcular totais
  let cookieCount = 0; // Apenas cookies individuais
  let cartSubtotal = 0;
  let boxMessage = "";
  let hasBox = false;

  // Primeiro calculamos o subtotal normal
  cart.forEach((item) => {
    cartSubtotal += item.price * item.quantity;
    // Contamos apenas cookies individuais (preço igual a pricing.single)
    if (item.price === pricing.single) {
      cookieCount += item.quantity;
    }
  });

  // Verificamos se podemos aplicar desconto de box
  if (cookieCount === 4 || cookieCount === 6) {
    const boxPrice = cookieCount === 6 ? pricing.box6 : pricing.box4;
    const normalPrice = cookieCount * pricing.single;
    const savings = (normalPrice - boxPrice).toFixed(2);

    // Ajustamos o subtotal para refletir o desconto da box
    cartSubtotal = cartSubtotal - normalPrice + boxPrice;
    hasBox = true;
    boxMessage = `Box of ${cookieCount} cookies: £${boxPrice.toFixed(2)}\n`;
  }

  const { addOnsTotal } = updateCartTotal();
  let deliveryFee = 0;

  // Construir mensagem do WhatsApp
  let message = `${currentDate}\n\n *Service type:* ${serviceType}\n-------------------------------------------\nHello, my name is ${name}, I'd like to place an order.\n *Address:* ${address}\n\n *Products:*\n`;

  // Adicionar box se aplicável
  if (hasBox) {
    message += boxMessage;
  }

  // Adicionar todos os itens ao message
  cart.forEach((item) => {
    // Se for um cookie individual e tiver box, não listamos individualmente
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
      2
    )}`;
  } else if (serviceType === "Pick-up") {
    message += `\n\n *Pick-up Details:*\n- Day: ${pickupDay}\n- Time: ${pickupTime}\n- Address: 107 Baltylum Meadows, BT62 4BW, Craigavon, Northern Ireland`;
  }

  // Resumo financeiro
  const total = cartSubtotal + addOnsTotal + deliveryFee;
  message += `\n\n *Order Summary:*\n- Products: £${cartSubtotal.toFixed(2)}`;

  if (hasBox) {
    const normalPrice = cookieCount * pricing.single;
    const savings = (
      normalPrice - (cookieCount === 6 ? pricing.box6 : pricing.box4)
    ).toFixed(2);
    message += ` (Saved £${savings} with box discount)`;
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

// Item data with descriptions, adjusting image paths
const itemInfo = {
  "Lotus Cookie": {
    img: "assets/img/cookie-lutus-info.png",
    description:
      "A delightful cookie filled with Lotus cream, perfect for fans of unique flavours.",
  },
  "Lindt Cookie": {
    img: "assets/img/cookie-lindt-info.png",
    description:
      "An irresistible cookie filled with the rich Lindor chocolate by Lindt.",
  },
  "Oreo Cookie": {
    img: "assets/img/cookie-oreo-info.png",
    description:
      "A crunchy cookie with an irresistible blend of Oreo biscuit and chocolate.",
  },
  "100% Cocoa Cookie": {
    img: "assets/img/cookie-cacau-info.png",
    description:
      "An intensely flavoured cookie with a blend of 100% pure cocoa.",
  },
  "KitKat Cookie": {
    img: "assets/img/cookie-kitkat-info.png",
    description:
      "A crunchy cookie filled with the unmistakable crunch of KitKat.",
  },
  "Churro Cookie": {
    img: "assets/img/cookie-churro-info.png",
    description: "A perfect combination of churro biscuit and dulce de leche.",
  },
  "Traditional Cookie": {
    img: "assets/img/cookie-tradicional-info.png",
    description: "The classic cookie with a timeless taste.",
  },
  "Kinder Bueno Cookie": {
    img: "assets/img/cookie-avela-info.png",
    description:
      "A cookie filled with hazelnut cream inspired by the famous Kinder Bueno.",
  },
  "Red Velvet Cookie": {
    img: "assets/img/cookie-ganache-info.png",
    description:
      "An elegant Red Velvet cookie with a rich chocolate ganache filling.",
  },
  "Nutella Cookie": {
    img: "assets/img/cookie-nutella-info.png",
    description:
      "A cookie filled with the classic Nutella hazelnut cream for an unmistakable treat.",
  },
  "Dubai Cookie": {
    img: "assets/img/cookie-pistache-info.png",
    description:
      "A refined cookie filled with pistachio cream, inspired by the exotic flavours of Dubai.",
  },
};

// Função para abrir o modal com as informações do item
function openInfoModal(title) {
  const modal = document.getElementById("info-modal");
  const modalImg = document.getElementById("info-modal-img");
  const modalTitle = document.getElementById("info-modal-title");
  const modalDescription = document.getElementById("info-modal-description");

  // Verificar se o item existe no objeto itemInfo
  if (itemInfo[title]) {
    // Ajusta o caminho da imagem e o conteúdo do modal
    modalImg.src = itemInfo[title].img;
    modalTitle.textContent = title;
    modalDescription.textContent = itemInfo[title].description;
  } else {
    // Caso o item não seja encontrado, exibe uma mensagem de erro no modal
    modalTitle.textContent = "Item not found";
    modalImg.src = ""; // Não exibe nenhuma imagem
    modalDescription.textContent =
      "Sorry, no description available for this item.";
  }

  // Exibe o modal
  modal.style.display = "block";
}

// Seleciona todos os botões de informações e adiciona evento de clique
document.querySelectorAll(".info__button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = button.closest(".popular__card");
    const title = card.querySelector(".popular__title").textContent.trim();
    openInfoModal(title);
  });
});

// Fecha o modal ao clicar no botão de fechar
document.getElementById("close-info-modal").addEventListener("click", () => {
  document.getElementById("info-modal").style.display = "none";
});

/*=============== OPEN AND CLOSE SITE ===============*/
// Função modificada para buscar o status da loja do servidor
function isWithinOperatingHours() {
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
  const buttons = document.querySelectorAll(".popular__button");
  const statusModal = document.getElementById("status-modal");
  const closeModal = document.getElementById("close-status-modal");

  // Verifica o status da loja
  isWithinOperatingHours().then((isOpen) => {
    if (isOpen) {
      // Habilitar sacola e botões
      cartIcon.classList.remove("disabled");
      buttons.forEach((button) => {
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

  const startTime = 18; // 6 PM
  const startMinutes = 30; // 30 minutes
  const endTime = 22; // 10 PM
  const interval = 20; // Intervalo em minutos

  for (let hour = startTime; hour <= endTime; hour++) {
    for (
      let minutes = hour === startTime ? startMinutes : 0;
      minutes < 60;
      minutes += interval
    ) {
      if (hour === endTime && minutes > 0) break; // Garante que não ultrapasse 22:00

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
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".carousel-button.next");
const prevButton = document.querySelector(".carousel-button.prev");

let currentSlide = 0;

function updateSlide() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  // Nome e preço atualizados (fixos)
  document.querySelector(".new__title").textContent =
    "The golden bites";
  document.querySelector(".new__price").textContent = "£12.00";
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

// ==================== ADD TO CART ====================
document.querySelector(".new__button").addEventListener("click", function () {
  const name = "The golden bites";
  const price = 12;
  const image = document.querySelector(".carousel-slide.active img").src;

  addToCart({
    name,
    price,
    image,
    card: this.closest(".new__container"),
  });
});
