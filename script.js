document.addEventListener('DOMContentLoaded', function() {
    const productListElement = document.getElementById('product-list');
    const featuredProductListElement = document.getElementById('featured-product-list');
    const productDetailPageElement = document.getElementById('product-detail-page');
    const productDetailsImage = document.getElementById('product-image');
    const productDetailsName = document.getElementById('product-name');
    const productDetailsDescription = document.getElementById('product-description');
    const productDetailsPrice = document.getElementById('product-price');
    const addToCartButton = document.querySelector('#product-detail-page .add-to-cart');
    const cartPageElement = document.getElementById('cart-page');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    const cartItemCountElement = document.getElementById('cart-item-count');
    const homePageElement = document.getElementById('home-page');
    const productListPageElement = document.getElementById('product-list-page');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Hàm tải dữ liệu sản phẩm từ JSON
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            products = await response.json();
            displayProducts(products);
            displayFeaturedProducts(products.slice(0, 3)); // Hiển thị 3 sản phẩm đầu tiên làm nổi bật
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
        }
    }

    // Hàm hiển thị danh sách sản phẩm
    function displayProducts(productList) {
        productListElement.innerHTML = '';
        productList.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price} triệu</p>
                <button class="view-details" data-id="${product.id}">Xem chi tiết</button>
            `;
            productListElement.appendChild(listItem);
        });

        // Thêm sự kiện click cho nút "Xem chi tiết"
        const detailButtons = document.querySelectorAll('#product-list .view-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                showProductDetail(productId);
            });
        });
    }

    // Hàm hiển thị sản phẩm nổi bật
    function displayFeaturedProducts(featuredProducts) {
        featuredProductListElement.innerHTML = '';
        featuredProducts.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price} triệu</p>
                <button class="view-details" data-id="${product.id}">Xem chi tiết</button>
            `;
            featuredProductListElement.appendChild(listItem);
        });

        const detailButtons = document.querySelectorAll('#featured-product-list .view-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                showProductDetail(productId);
            });
        });
    }

    // Hàm hiển thị chi tiết sản phẩm
    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            productDetailsImage.src = product.image;
            productDetailsImage.alt = product.name;
            productDetailsName.textContent = product.name;
            productDetailsDescription.textContent = product.description;
            productDetailsPrice.textContent = product.price;
            addToCartButton.dataset.productId = product.id;

            homePageElement.style.display = 'none';
            productListPageElement.style.display = 'none';
            productDetailPageElement.style.display = 'block';
            cartPageElement.style.display = 'none';
        }
    }

    // Hàm thêm sản phẩm vào giỏ hàng
    function addToCart(productId) {
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ productId: productId, quantity: 1 });
        }
        updateCart();
    }

    // Hàm hiển thị giỏ hàng
    function displayCart() {
        cartItemsElement.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const listItem = document.createElement('li');
                const itemTotal = product.price * item.quantity;
                listItem.innerHTML = `
                    <span>${product.name} x ${item.quantity}</span>
                    <span>${itemTotal.toFixed(2)} triệu</span>
                    <button class="remove-from-cart" data-id="${product.id}">Xóa</button>
                `;
                cartItemsElement.appendChild(listItem);
                total += itemTotal;
            }
        });
        cartTotalElement.textContent = total.toFixed(2);

        // Thêm sự kiện click cho nút "Xóa"
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productIdToRemove = parseInt(this.dataset.id);
                removeFromCart(productIdToRemove);
            });
        });
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(productId) {
        cart = cart.filter(item => item.productId !== productId);
        updateCart();
    }

    // Hàm cập nhật giỏ hàng và giao diện
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        cartItemCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Xử lý sự kiện click nút "Thêm vào giỏ hàng" ở trang chi tiết
    addToCartButton.addEventListener('click', function() {
        const productId = parseInt(this.dataset.productId);
        addToCart(productId);
    });

    // Xử lý chuyển đổi trang
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            homePageElement.style.display = targetId === 'home' ? 'block' : 'none';
            productListPageElement.style.display = targetId === 'products' ? 'block' : 'none';
            productDetailPageElement.style.display = targetId === 'product-detail' ? 'block' : 'none';
            cartPageElement.style.display = targetId === 'cart' ? 'block' : 'none';

            if (targetId === 'products' && products.length > 0) {
                displayProducts(products);
            } else if (targetId === 'cart') {
                displayCart();
            }
        });
    });

    // Tải sản phẩm khi trang được tải
    loadProducts();
    updateCart(); // Hiển thị số lượng ban đầu trong giỏ hàng
});