// Data penyimpanan
let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
let transactions = JSON.parse(localStorage.getItem('inventoryTransactions')) || [];

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    localStorage.setItem('inventoryTransactions', JSON.stringify(transactions));
}

// Fungsi untuk menambah barang baru
function addItem() {
    const name = document.getElementById('item-name').value;
    const desc = document.getElementById('item-desc').value;
    const stock = parseInt(document.getElementById('initial-stock').value);
    
    if (name && desc && stock >= 0) {
        const newItem = { id: Date.now(), name, desc, stock };
        items.push(newItem);
        saveData();
        updateUI();
        // Reset form
        document.getElementById('item-name').value = '';
        document.getElementById('item-desc').value = '';
        document.getElementById('initial-stock').value = '';
    } else {
        alert('Isi semua field dengan benar!');
    }
}

// Fungsi untuk mencatat barang masuk
function recordIn() {
    const itemId = parseInt(document.getElementById('item-select').value);
    const qty = parseInt(document.getElementById('quantity').value);
    
    if (itemId && qty > 0) {
        const item = items.find(i => i.id === itemId);
        item.stock += qty;
        transactions.push({
            id: Date.now(),
            itemName: item.name,
            type: 'Masuk',
            quantity: qty,
            date: new Date().toLocaleString()
        });
        saveData();
        updateUI();
        document.getElementById('quantity').value = '';
    } else {
        alert('Pilih barang dan jumlah yang valid!');
    }
}

// Fungsi untuk mencatat barang keluar
function recordOut() {
    const itemId = parseInt(document.getElementById('item-select').value);
    const qty = parseInt(document.getElementById('quantity').value);
    
    if (itemId && qty > 0) {
        const item = items.find(i => i.id === itemId);
        if (item.stock >= qty) {
            item.stock -= qty;
            transactions.push({
                id: Date.now(),
                itemName: item.name,
                type: 'Keluar',
                quantity: qty,
                date: new Date().toLocaleString()
            });
            saveData();
            updateUI();
            document.getElementById('quantity').value = '';
        } else {
            alert('Stok tidak cukup!');
        }
    } else {
        alert('Pilih barang dan jumlah yang valid!');
    }
}

// Fungsi untuk menghapus barang
function deleteItem(id) {
    items = items.filter(i => i.id !== id);
    transactions = transactions.filter(t => t.itemName !== items.find(i => i.id === id)?.name);
    saveData();
    updateUI();
}

// Fungsi untuk update UI
function updateUI() {
    // Update daftar barang
    const itemList = document.getElementById('items');
    itemList.innerHTML = '';
    items.forEach(item => {
        itemList.innerHTML += `
            <div>
                <strong>${item.name}</strong> - ${item.desc} - Stok: ${item.stock}
                <button onclick="deleteItem(${item.id})">Hapus</button>
            </div>
        `;
    });
    
    // Update select option
    const select = document.getElementById('item-select');
    select.innerHTML = '<option value="">Pilih Barang</option>';
    items.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });
    
    // Update log transaksi
    const log = document.getElementById('transaction-log');
    log.innerHTML = '';
    transactions.forEach(t => {
        log.innerHTML += `
            <div>${t.date} - ${t.itemName} - ${t.type} ${t.quantity}</div>
        `;
    });
}

// Load UI saat halaman dimuat
updateUI();