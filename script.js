const vitrine = document.getElementById("vitrine");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const chckoutBtn = document.getElementById("checkout-btn");
const closeBtn = document.getElementById("closed-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const dateSpan = document.getElementById("date-span");
let cart = [];
//abrir modal carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
});
//fechar modal carrinho
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none";
    } 
});
//fechar modal carrinho
closeBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

vitrine.addEventListener("click", function(event) { 

    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price); 
    }
});

//function to add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    }else{
        cart.push({ 
            name, 
            price,
            quantity: 1,
        })
    }
    updateCartModal();
}

//atualiza o carrinho
function updateCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex,", "justify-between", "mb-4","flex-col");
        cartItemElement.innerHTML = `
        <div class="flex justify-between">
            <div>
            <p class="font-bold">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class = "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
             
            <button class="remove-from-cart-btn" data-name="${item.name}">
                remove
            </button>
            
        </div>
        `
        total += item.price * item.quantity;
        
        cartItensContainer.appendChild(cartItemElement);

    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    cartCount.innerHTML= cart.length;


}

//remove item do carrinho
cartItensContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
})
//remove item do carrinho 2
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
    const item = cart[index];
       if (item.quantity > 1) {
        item.quantity -=1;
        updateCartModal();
        return;
    }
    cart.splice(index, 1);
    updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }

})
//finalziar compra
chckoutBtn.addEventListener("click", function() {
    const isOpen = checkEcommerceOpen();
    if (!isOpen) {

       Toastify({
        text: "Ops ECommerce está fechado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ef4444",
        },
        }).showToast();
        return;
    }
    if (cart.length === 0) {
        alert("Carrinho vazio");
        return;
    }
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

   const cartItems = cart.map(item => {
        return(
         `${item.name}  Quantidade: ${item.quantity} Preço ${item.price.toFixed(2)} /`
        )
    }).join("");
    const message = encodeURIComponent(cartItems);
    const phone = "+5587998097740";
    window.open(
        `https://wa.me/${phone}?text=Olá, gostaria de fazer um pedido: ${message} Endereço: ${addressInput.value}`, "_blank")
}) 
 
function checkEcommerceOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 20; 
    //true = aberto
}
const spanItem = document.getElementById("date-span");
const isOpen = checkEcommerceOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
    