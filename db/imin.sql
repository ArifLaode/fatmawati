-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2025 at 11:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `tb_akun`
--

CREATE TABLE `tb_akun` (
  `id_akun` varchar(12) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `posisi_saldo` text NOT NULL,
  `rekening` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_akun`
--

INSERT INTO `tb_akun` (`id_akun`, `nama`, `posisi_saldo`, `rekening`) VALUES
('3fa0b5c0-67e', 'koperasi klaim', 'Kredit', '7354367236532'),
('4c2af1e0-279', 'koperasi bayar', 'Debit', '5423765385712'),
('74cd23ca-84b', 'koperasi simpan', 'Debit', '34532642643'),
('9ca10809-04e', 'koperasi pinjam', 'Kredit', '53756346'),
('aa517539-c52', 'operasional', 'Kredit', '735436723653'),
('b792caaf-ac4', 'pemasukkan', 'Debit', '34532642643'),
('d6563284-bbc', 'aset', 'Kredit', '34532642643');

-- --------------------------------------------------------

--
-- Table structure for table `tb_koperasi`
--

CREATE TABLE `tb_koperasi` (
  `id_data` varchar(20) NOT NULL,
  `id_akun` varchar(20) NOT NULL,
  `nama` text DEFAULT NULL,
  `NIK` text DEFAULT NULL,
  `waktu` date NOT NULL,
  `nominal` double NOT NULL,
  `ket` varchar(100) DEFAULT NULL,
  `jangka` int(11) DEFAULT NULL,
  `no_hp` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_koperasi`
--

INSERT INTO `tb_koperasi` (`id_data`, `id_akun`, `nama`, `NIK`, `waktu`, `nominal`, `ket`, `jangka`, `no_hp`) VALUES
('0d87faa0-182a-4426-9', '9ca10809-04e', 'La Musuli', '2137182731827381', '2025-01-18', 700000, NULL, 5, '312312312312'),
('595e3122-6c52-49a3-b', '9ca10809-04e', 'La Musa', '2136712653712573', '2025-01-18', 2, NULL, 12, '213672613721'),
('6a456064-c587-4165-9', '9ca10809-04e', 'Fatmawati', '2131237676786484', '2025-01-18', 1, NULL, 10, '322767637467'),
('708b3875-8559-43b6-b', '9ca10809-04e', 'La Agus', '8636532655328784', '2024-12-08', 2000000, NULL, 6, '524216524617'),
('766e32d5-9955-40d2-8', '9ca10809-04e', 'gasdgajigduagu', '2648165745173517', '2025-01-12', 10000000, NULL, 24, '734912790182'),
('7a13c046-2246-4af1-a', '74cd23ca-84b', 'adqweqewqw', '1312211211311', '2024-12-18', 25000000, NULL, 3, '231213213123'),
('8143d71c-ee8d-4ae6-a', '74cd23ca-84b', 'hdajsggsvdffsg', '1125652434512544', '2024-11-19', 13000000, NULL, 12, '665452415454'),
('b1f108d2-2841-46ff-b', '9ca10809-04e', 'La ndurika', '6217831623128312', '2024-12-15', 10000000, NULL, 12, '76381273128'),
('de4b0f7d-4fb9-498c-a', '3fa0b5c0-67e', 'adqweqewqw', '1312211211311', '2025-01-18', 25750000, NULL, 0, '231213213123');

-- --------------------------------------------------------

--
-- Table structure for table `tb_simpanpinjam`
--

CREATE TABLE `tb_simpanpinjam` (
  `ID` varchar(20) NOT NULL,
  `id_data` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nominal` double NOT NULL,
  `tempo` int(11) NOT NULL,
  `bunga` double NOT NULL,
  `cicilan` double NOT NULL,
  `terbayar` int(11) NOT NULL,
  `denda` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_simpanpinjam`
--

INSERT INTO `tb_simpanpinjam` (`ID`, `id_data`, `nama`, `nominal`, `tempo`, `bunga`, `cicilan`, `terbayar`, `denda`) VALUES
('14b24102-ddf8-4647-9', '6a456064-c587-4165-9', 'Fatmawati', 1, 10, 4, 0, 0, 0),
('2053e5c0-0059-4229-b', '766e32d5-9955-40d2-8', 'gasdgajigduagu', 10000000, 24, 5, 437500, 0, 0),
('9fb8ad6b-70e5-47a5-8', '708b3875-8559-43b6-b', 'La Agus', 2000000, 6, 4, 0, 6, 0),
('a548e8fc-c182-462f-b', '595e3122-6c52-49a3-b', 'La Musa', 2, 12, 4, 0, 0, 0),
('b056c01e-8a4c-4280-8', 'b1f108d2-2841-46ff-b', 'La ndurika', 10000000, 12, 4, 866666.67, 0, 75000),
('b3742b31-6026-459d-8', '0d87faa0-182a-4426-9', 'La Musuli', 700000, 5, 3, 144200, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(12) NOT NULL,
  `nama` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id_user`, `nama`, `email`, `password`) VALUES
(1, 'Admin', 'admin@bumdes.com', '12345');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_akun`
--
ALTER TABLE `tb_akun`
  ADD PRIMARY KEY (`id_akun`);

--
-- Indexes for table `tb_koperasi`
--
ALTER TABLE `tb_koperasi`
  ADD PRIMARY KEY (`id_data`),
  ADD KEY `fk_akun` (`id_akun`);

--
-- Indexes for table `tb_simpanpinjam`
--
ALTER TABLE `tb_simpanpinjam`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `main_data` (`id_data`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_koperasi`
--
ALTER TABLE `tb_koperasi`
  ADD CONSTRAINT `fk_akun` FOREIGN KEY (`id_akun`) REFERENCES `tb_akun` (`id_akun`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tb_simpanpinjam`
--
ALTER TABLE `tb_simpanpinjam`
  ADD CONSTRAINT `main_data` FOREIGN KEY (`id_data`) REFERENCES `tb_koperasi` (`id_data`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
