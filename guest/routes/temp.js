fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Gagal membaca file ${filePath}: ${err}`);
        return;
    }

    // Konversi data yang sudah ada menjadi array
    let dataArray = JSON.parse(data);

    // Tambahkan data baru ke dalam array
    dataArray.push(dataJson);

    // Konversi array kembali ke format JSON
    const jsonData = JSON.stringify(dataArray, null, 2);

    // Tulis kembali ke file
    fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
        if (err) {
            console.error(`Gagal menulis ke file ${filePath}: ${err}`);
            return;
        }
        console.log(`Data baru berhasil ditambahkan ke dalam file ${filePath}`);
    });
});