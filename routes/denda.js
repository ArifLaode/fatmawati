const db = require('../db/db');
const express = require('express');
const router = express.Router();

function roundToSmallest500(value) {
    // Membulatkan nilai ke bawah ke kelipatan terkecil 500
    return Math.floor(value / 500) * 500;
}

function calculateBill(data) {
    const { nominal, tempo, bunga, sisa, waktu, cicilan } = data;

    const contractDate = new Date(waktu);
    const dueDate = new Date(contractDate);
    let waktuTempo;
    if (sisa === 0) {
        waktuTempo = 1;
    } else if (sisa < tempo) {
        waktuTempo = 1 + sisa;
    } else {
        return 0;
    }
    dueDate.setMonth(dueDate.getMonth() + waktuTempo);
    console.log(data);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const diffInMillis = currentDate - dueDate;
    const daysLate = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

    const baseBill = cicilan;

    let penalty = 0;
    if (daysLate > 0) {
        if (daysLate === 1) {
            penalty = 0.005 * nominal;
        } else if (daysLate > 1) {
            penalty = 0.005 * nominal + 25000;
        }
    }

    const comasBill = baseBill + penalty;
    const totalBill = roundToSmallest500(comasBill);

    return {
        baseBill,
        penalty,
        totalBill,
        daysLate,
        dueDate: dueDate.toISOString().split('T')[0],
    };
}

async function hitunganDenda() {
    const sql = 'SELECT * FROM tb_simpanpinjam as ts inner join tb_koperasi as tk on ts.id_data = tk.id_data';

    db.query(sql, async (err, result) => {
        if (err) throw err;

        const updates = result.map((row) => {
            return new Promise((resolve, reject) => {
                const data = {
                    nominal: row.nominal,
                    tempo: row.tempo,
                    bunga: row.bunga,
                    sisa: row.terbayar,
                    waktu: row.waktu,
                    cicilan: row.cicilan,
                };
                const bill = calculateBill(data);

                console.log(bill);

                const sql2 = 'UPDATE tb_simpanpinjam SET denda = ?, cicilan = ? WHERE id_data = ?';
                db.query(sql2, [bill.penalty, bill.baseBill, row.id_data], (err, result) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });

        try {
            await Promise.all(updates);
            console.log('Semua denda berhasil dihitung dan diupdate.');
        } catch (err) {
            console.error('Terjadi kesalahan:', err);
        }
    });
}


module.exports = hitunganDenda;
