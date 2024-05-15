-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Feb 2024 pada 06.50
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imin`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_akun`
--

CREATE TABLE `tb_akun` (
  `id_akun` varchar(12) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `posisi_saldo` text NOT NULL,
  `rekening` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_akun`
--

INSERT INTO `tb_akun` (`id_akun`, `nama`, `posisi_saldo`, `rekening`) VALUES
('3fa0b5c0-67e', 'koperasi klaim', 'Kredit', '7354367236531'),
('4c2af1e0-279', 'koperasi bayar', 'Debit', '54237653857'),
('74cd23ca-84b', 'koperai simpan', 'Debit', '34532642643'),
('9ca10809-04e', 'koperasi pinjam', 'Kredit', '53756346');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_koperasi`
--

CREATE TABLE `tb_koperasi` (
  `id_data` varchar(20) NOT NULL,
  `id_akun` varchar(20) NOT NULL,
  `nama` text NOT NULL,
  `NIK` text NOT NULL,
  `waktu` date NOT NULL,
  `nominal` double NOT NULL,
  `jangka` int(11) NOT NULL,
  `no_hp` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_koperasi`
--

INSERT INTO `tb_koperasi` (`id_data`, `id_akun`, `nama`, `NIK`, `waktu`, `nominal`, `jangka`, `no_hp`) VALUES
('23dda102-726d-4d0a-9', '9ca10809-04e', 'Fatmalasari', '7410024503930000', '2024-01-31', 12000000, 12, '0823213423'),
('2c69e031-5a92-40ed-9', '74cd23ca-84b', 'La Kalape', '740823764555301', '2024-02-07', 1500000, 2, '0856353226'),
('4e887720-6f13-4f49-8', '74cd23ca-84b', 'Juna Idi', '740823764555301', '2024-02-06', 1000000, 24, '0823213423'),
('6e97e816-f561-4822-8', '9ca10809-04e', 'Imin Walker', '7410020107770010', '2024-01-31', 2000000, 24, '0823213423'),
('8374f077-3ea2-4ebf-a', '9ca10809-04e', 'La Ode Muhammad Arif', '740823764555301', '2024-01-31', 21000000, 14, '0823213423'),
('83c286f4-d54f-4363-b', '9ca10809-04e', 'la Taliru', '7403250203990001', '2024-01-17', 120000, 12, '0823213423'),
('886d0b17-1a28-48fb-9', '74cd23ca-84b', 'Imin Walker', '7542864542001', '2024-02-05', 21000000, 24, '0856353226'),
('9c9e4e34-7510-4551-9', '74cd23ca-84b', 'Agus Semi', '740823764555301', '2024-02-05', 30000000, 4, '0856353226'),
('be5d160b-e08a-41cf-a', '9ca10809-04e', 'Christopher Roland', '7403250203990001', '2024-01-31', 3200000, 24, '0823213423'),
('ecb940b4-2acd-49a2-9', '4c2af1e0-279', 'La Ode Muhammad Arif', '740823764555301', '2024-02-03', 1575000, 0, '0823213423'),
('ef6c407e-56a1-4219-8', '4c2af1e0-279', 'Fatmalasari', '7410024503930000', '2024-02-03', 1040000, 0, '0823213423'),
('f841bdf7-46bc-4642-8', '74cd23ca-84b', 'Fatmalasari', '7410024503930000', '2024-02-05', 1200000, 12, '0823213423'),
('fa48a584-eb33-4a51-9', '9ca10809-04e', 'Hasan Jaya', '7542864542001', '2024-01-15', 2000000, 14, '0856353226');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(12) NOT NULL,
  `nama` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_akun`
--
ALTER TABLE `tb_akun`
  ADD PRIMARY KEY (`id_akun`);

--
-- Indeks untuk tabel `tb_koperasi`
--
ALTER TABLE `tb_koperasi`
  ADD PRIMARY KEY (`id_data`),
  ADD KEY `fk_akun` (`id_akun`);

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_koperasi`
--
ALTER TABLE `tb_koperasi`
  ADD CONSTRAINT `fk_akun` FOREIGN KEY (`id_akun`) REFERENCES `tb_akun` (`id_akun`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
