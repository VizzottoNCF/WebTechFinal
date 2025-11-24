// wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {

    console.log("DOM Document Loaded");

    // const vars
    const backendUrl = 'http://localhost:8080';
    const productForm = document.getElementById('productForm');
    const getAllProductsBtn = document.getElementById('getAllProductsBtn');
    const productTableTBody = document.querySelector('#productTable tbody');
    const productIdField = document.getElementById('productIdField');
    const saveBtn = document.getElementById('saveBtn');

    // Debug: Check if elements exist
    console.log("Backend URL:", backendUrl);
    console.log("ProductForm:", productForm);
    console.log("ProductTableTBody:", productTableTBody);
    console.log("Save Button:", saveBtn);

    if (!productForm) {
        console.error("Product Form not found");
        return;
    }

    // form event listener
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // get values
        const productId = productIdField.value;
        const name = document.getElementById('name').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const supplier = document.getElementById('supplier').value;
        const barCode = name + supplier;

        console.log(productId, name, category, price, quantity, supplier, barCode);

        if (productId) {
            updateProduct(productId, name, category, price, quantity, supplier);
            console.log('Product Updated Successfully');
        } else {
            addProduct(name, category, price, quantity, supplier, barCode);
            console.log('Product Added Successfully');
        }
    });

    // get all products listener
    getAllProductsBtn.addEventListener('click', fetchProducts)


    // POST request to add product
    function addProduct(name, category, price, quantity, supplier, barCode) {
        console.log(`'Add product request | ${name} ${category} ${price} ${quantity} ${supplier} ${barCode}`);

        fetch(`${backendUrl}/loja/addProduct`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}&price=${encodeURIComponent(price)}
                &quantity=${encodeURIComponent(quantity)}&supplier=${encodeURIComponent(supplier)}&barCode=${encodeURIComponent(barCode)}`,
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                saveBtn.textContent = 'Save Product';
                productForm.reset();
                fetchProducts()
            }).catch(error => {
            console.error('Error', error);
        });
    }


    // PUT request to update product
    function updateProduct(productId, name, category, price, quantity, supplier) {
        const barCode = name + supplier;

        fetch(`${backendUrl}/loja/update/${productId}?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}&price=${encodeURIComponent(price)}&quantity=${encodeURIComponent(quantity)}&supplier=${encodeURIComponent(supplier)}&barCode=${encodeURIComponent(barCode)}`, {
            method: 'PUT'
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            productForm.reset();
            productIdField.value = '';
            fetchProducts()
        }).catch(error => console.error('Error:', error));
    }

    // DELETE request to delete product
    function deleteProduct(productId) {
        fetch(`${backendUrl}/loja/delete/${productId}`, {method: 'DELETE'})
            .then(response => response.text())
            .then(data => {
                console.log(`deleted product id ${productId} successfully`);
                alert(data);
                fetchProducts();
            }).catch(error => {
            console.error('Error:', error);
        });
    }

    // GET request to fetch products
    function fetchProducts() {
        fetch(`${backendUrl}/loja/all`).then(response => response.json()).then(products => {
            // clean table
            productTableTBody.innerHTML = '';

            // add each product
            products.forEach(product => {
                // create row
                const row = document.createElement('tr');

                // create cells
                const idCell = document.createElement('th');
                const nameCell = document.createElement('th');
                const categoryCell = document.createElement('th');
                const priceCell = document.createElement('th');
                const quantityCell = document.createElement('th');
                const supplierCell = document.createElement('th');
                const barcodeCell = document.createElement('th');
                const actionCell = document.createElement('td');

                // fill info
                idCell.textContent = product.id;
                nameCell.textContent = product.name;
                categoryCell.textContent = product.category;
                priceCell.textContent = product.price;
                quantityCell.textContent = product.quantity;
                supplierCell.textContent = product.supplier;
                barcodeCell.textContent = product.barcode;

                // create buttons
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => {

                    productIdField.value = product.id; // defines id in hidden field
                    document.getElementById('name').value = product.name;
                    document.getElementById('category').value = product.category;
                    document.getElementById('price').value = product.price;
                    document.getElementById('quantity').value = product.quantity;
                    document.getElementById('supplier').value = product.supplier;
                    document.getElementById('barcode').value = product.barcode;
                    saveBtn.textContent = 'Alter Product';
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                    if (confirm(`Are you sure you want to delete product ${product.id}?`)) {
                        deleteProduct(product.id);
                    }
                };

                // adds EDIT and DELETE button to cell
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);

                // appends cell to row
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(categoryCell);
                row.appendChild(priceCell);
                row.appendChild(quantityCell);
                row.appendChild(supplierCell);
                row.appendChild(barcodeCell);
                row.appendChild(actionCell);

                // appends row to table
                productTableTBody.appendChild(row);
            });


        }).catch(error => { console.error('Error:', error); });

    }
    console.log("Javascript initialization complete");
    fetchProducts();
});

