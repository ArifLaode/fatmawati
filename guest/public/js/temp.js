function generatePDF(data) {
    let totalDebit = 0;
    let totalKredit = 0;

    data.forEach((dataItem) => {
        const nominalValue = parseInt(dataItem.nominal, 10);

        if (dataItem['posisi_saldo'] === 'Debit') {
            totalDebit += nominalValue;
        } else if (dataItem['posisi_saldo'] === 'Kredit') {
            totalKredit += nominalValue;
        }
    });

    const totalValue = totalDebit - totalKredit;
    console.log(totalValue);
    formatCurrency(totalValue);
    console.log(data);
    var docDefinition = {
        pageSize: 'A4',
        content: [{
                text: `Buku Besar`,
                style: 'header'
            },
            {
                text: `Surat ini dikeluarkan resmi oleh bumdes desa dengan keterangan sebagai berikut:
nama    : Admin 
lokasi : Kantor Desa Umbele`,
                style: 'praph1'
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto'],
                    body: [
                        ['ID Akun', 'Waktu Transaksi', 'Nominal', 'Posisi Saldo'],
                        ...data.map(item => [
                            item["id_akun"],
                            item["tanggal"],
                            formatCurrency(item.nominal),
                            item["posisi_saldo"]
                        ]),
                        [{
                                text: 'Total:',
                                colSpan: 2,
                                alignment: 'right',
                                bold: true
                            },
                            {},
                            {
                                text: formatCurrency(totalValue),
                                colSpan: 2,
                                alignment: 'center'
                            },
                            {}
                        ]
                    ]
                }
            },
            {
                text: '\n'
            },
            {
                text: 'Demikian surat laporan disampaikan dengan sangat akurat sesuai dengan arahan dari admin. Apabila ada kesalahan dalam penulisan maka kami pihak dibawah ini akan siap bertanggung jawab.'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: 'Hormat Kami,'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                text: '\n'
            },
            {
                columns: [{
                        width: 'auto',
                        text: [
                            '(.............)',
                            '\n',
                            {
                                text: 'Kepala Desa',
                                bold: true
                            },
                        ]
                    },
                    {
                        alignment: 'right',
                        text: [
                            '(..............)',
                            '\n',
                            {
                                text: 'Admin',
                                bold: true
                            }
                        ]
                    }
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 12]
            },
            praph1: {
                margin: [0, 0, 0, 12]
            }
        }
    };

    // Generate and open the PDF
    pdfMake.createPdf(docDefinition).open();
}