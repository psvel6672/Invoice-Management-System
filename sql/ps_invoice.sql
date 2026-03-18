-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2026 at 11:18 AM
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
-- Database: `ps_invoice`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `custom_email` text NOT NULL,
  `invoice_date` varchar(255) NOT NULL,
  `invoice_due_date` varchar(255) NOT NULL,
  `subtotal` decimal(10,0) NOT NULL,
  `shipping` decimal(10,0) NOT NULL,
  `discount` decimal(10,0) NOT NULL,
  `tax` int(11) NOT NULL DEFAULT 0,
  `total` decimal(10,0) NOT NULL,
  `notes` text NOT NULL,
  `invoice_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `paid_via` varchar(100) DEFAULT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_no`, `customer_id`, `custom_email`, `invoice_date`, `invoice_due_date`, `subtotal`, `shipping`, `discount`, `tax`, `total`, `notes`, `invoice_type`, `status`, `paid_via`, `deleted`, `date_entered`, `date_modified`) VALUES
(1, 'INV202603120001', NULL, '', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'notes', 'invoice', 'paid', NULL, 1, '2026-03-12 17:58:10', '2026-03-12 18:09:46'),
(2, 'INV202603120002', NULL, '', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'notes', 'invoice', 'paid', NULL, 1, '2026-03-12 17:58:10', '2026-03-17 16:35:25'),
(3, 'INV202603120003', NULL, 'ps12@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test 1234', 'invoice', 'paid', NULL, 1, '2026-03-12 17:58:10', '2026-03-17 16:35:33'),
(4, 'INV202603120004', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 17:58:10', '2026-03-17 16:35:39'),
(5, 'INV202603120005', NULL, '', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 17:58:10', '2026-03-17 16:35:45'),
(6, 'INV202603120006', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 18:02:45', '2026-03-17 16:35:50'),
(7, 'INV202603120006', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 20:24:18', '2026-03-17 16:35:50'),
(8, 'INV202603120007', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 20:25:54', '2026-03-17 16:35:55'),
(9, 'INV202603120008', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 20:26:15', '2026-03-17 16:36:02'),
(10, 'INV202603120009', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 20:26:42', '2026-03-17 16:36:05'),
(11, 'INV202603120010', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'paid', NULL, 1, '2026-03-12 20:27:35', '2026-03-17 16:36:11'),
(12, 'INV202603120011', NULL, 'ps@gmail.com', '2026-03-12', '2026-03-12', 1000, 10, 200, 100, 910, 'Test', 'invoice', 'open', NULL, 1, '2026-03-12 22:48:32', '2026-03-17 16:36:16'),
(13, 'INV202603170001', NULL, '', '2026-03-17', '2026-03-17', 1872, 40, 38, 34, 1912, '', 'Invoice', 'Unpaid', 'Unpaid', 1, '2026-03-17 14:20:45', '2026-03-17 16:36:20'),
(14, 'INV202603170002', 2, '', '2026-03-17', '2026-03-17', 8108, 40, 40, 38, 8148, '', 'Invoice', 'paid', 'G-Pay', 0, '2026-03-17 14:24:11', '2026-03-17 14:31:09'),
(15, 'INV202603170003', 2, '', '2026-03-17', '2026-03-17', 8108, 40, 40, 38, 8148, '', 'Invoice', 'Paid', 'PhonePe', 0, '2026-03-17 14:31:35', '2026-03-17 14:31:35'),
(16, 'INV202603170004', 1, '', '2026-03-16', '2026-03-17', 1011, 10, 40, 38, 1021, '', 'Invoice', 'Paid', 'PhonePe', 0, '2026-03-17 14:35:31', '2026-03-17 14:35:31'),
(17, 'INV202603170005', 2, '', '2026-03-17', '2026-03-17', 187, 0, 38, 34, 187, '', 'Invoice', 'Unpaid', 'Unpaid', 0, '2026-03-17 16:14:09', '2026-03-17 16:14:09'),
(18, 'INV202603170006', 1, 'testemail@gmail.com', '2026-03-17', '2026-03-17', 108, 10, 2, 4, 118, 'Kadalai Mittai', 'Invoice', 'Paid', 'G-Pay', 0, '2026-03-17 16:15:20', '2026-03-17 16:15:20');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_customers`
--

CREATE TABLE `invoice_customers` (
  `id` int(11) NOT NULL,
  `invoice` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address_1` varchar(255) NOT NULL,
  `address_2` varchar(255) NOT NULL,
  `town` varchar(255) NOT NULL,
  `county` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `name_ship` varchar(255) NOT NULL,
  `address_1_ship` varchar(255) NOT NULL,
  `address_2_ship` varchar(255) NOT NULL,
  `town_ship` varchar(255) NOT NULL,
  `county_ship` varchar(255) NOT NULL,
  `postcode_ship` varchar(255) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `product_id` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `tax` int(11) NOT NULL DEFAULT 0,
  `price` varchar(255) NOT NULL,
  `discount` varchar(255) NOT NULL,
  `subtotal` varchar(255) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_no`, `product_id`, `quantity`, `tax`, `price`, `discount`, `subtotal`, `deleted`, `date_entered`, `date_modified`) VALUES
(1, 'INV202603120001', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-12 18:09:46'),
(2, 'INV202603120001', '2', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-12 18:09:46'),
(3, 'INV202603120002', '1', 20, 18, '80', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:25'),
(4, 'INV202603120002', '2', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-12 18:12:22'),
(5, 'INV202603120003', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:33'),
(6, 'INV202603120003', '2', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:33'),
(7, 'INV202603120004', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:39'),
(8, 'INV202603120004', '2', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:39'),
(9, 'INV202603120005', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:45'),
(10, 'INV202603120005', '2', 10, 18, '40', '10', '318', 1, '2026-03-12 17:58:58', '2026-03-17 16:35:45'),
(11, 'INV202603120006', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 18:02:45', '2026-03-12 18:13:15'),
(12, 'INV202603120006', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 20:24:18', '2026-03-17 16:35:50'),
(13, 'INV202603120007', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 20:25:54', '2026-03-17 16:35:55'),
(14, 'INV202603120008', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 20:26:15', '2026-03-17 16:36:02'),
(15, 'INV202603120009', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 20:26:42', '2026-03-17 16:36:05'),
(16, 'INV202603120010', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 20:27:35', '2026-03-17 16:36:11'),
(17, 'INV202603120011', '1', 10, 18, '40', '10', '318', 1, '2026-03-12 22:48:32', '2026-03-17 16:36:16'),
(18, 'INV202603170001', '2', 10, 18, '191', '20', '1871.80', 1, '2026-03-17 14:20:45', '2026-03-17 16:36:20'),
(19, 'INV202603170002', '2', 10, 18, '191', '20', '1871.80', 0, '2026-03-17 14:24:11', '2026-03-17 14:24:11'),
(20, 'INV202603170002', '3', 20, 0, '301', '0', '6020.00', 0, '2026-03-17 14:24:11', '2026-03-17 14:24:11'),
(21, 'INV202603170002', '6', 10, 18, '20', '10', '216.00', 0, '2026-03-17 14:24:11', '2026-03-17 14:24:11'),
(22, 'INV202603170003', '2', 10, 18, '191', '20', '1871.80', 0, '2026-03-17 14:31:35', '2026-03-17 14:31:35'),
(23, 'INV202603170003', '3', 20, 0, '301', '0', '6020.00', 0, '2026-03-17 14:31:35', '2026-03-17 14:31:35'),
(24, 'INV202603170003', '6', 10, 18, '20', '10', '216.00', 0, '2026-03-17 14:31:35', '2026-03-17 14:31:35'),
(25, 'INV202603170004', '2', 1, 18, '191', '20', '187.18', 0, '2026-03-17 14:35:31', '2026-03-17 14:35:31'),
(26, 'INV202603170004', '6', 1, 18, '20', '10', '21.60', 0, '2026-03-17 14:35:31', '2026-03-17 14:35:31'),
(27, 'INV202603170004', '3', 2, 0, '301', '0', '602.00', 0, '2026-03-17 14:35:31', '2026-03-17 14:35:31'),
(28, 'INV202603170004', '8', 5, 0, '40', '0', '200.00', 0, '2026-03-17 14:35:31', '2026-03-17 14:35:31'),
(29, 'INV202603170005', '2', 1, 18, '191', '20', '187.18', 0, '2026-03-17 16:14:09', '2026-03-17 16:14:09'),
(30, 'INV202603170006', '6', 5, 18, '20', '10', '108.00', 0, '2026-03-17 16:15:20', '2026-03-17 16:15:20');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` text NOT NULL,
  `product_desc` text NOT NULL,
  `product_price` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `discount` int(11) NOT NULL DEFAULT 0,
  `tax` int(11) NOT NULL DEFAULT 0,
  `deleted` int(10) NOT NULL DEFAULT 0,
  `date_entered` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_desc`, `product_price`, `quantity`, `discount`, `tax`, `deleted`, `date_entered`, `date_modified`) VALUES
(1, 'Sakthi Masala', 'Sakthi Masala - Food', '10', 0, 0, 0, 0, '2026-03-13 07:24:51', '2026-03-13 08:46:54'),
(2, 'Aachi Masala', 'Aachi Masala', '191', 250, 20, 18, 0, '2026-03-13 07:27:14', '2026-03-16 16:37:50'),
(3, 'Kadalai Parupu', 'Kadalai Parupu', '301', 0, 0, 0, 0, '2026-03-13 07:27:14', '2026-03-13 08:05:51'),
(4, 'Milagai Powder', 'Thani Milagai Thool', '20', 0, 0, 0, 0, '2026-03-13 07:28:02', '2026-03-13 08:46:05'),
(5, 'Kara boonthi', 'Karaboonthi', '40', 0, 0, 0, 1, '2026-03-13 08:40:59', '2026-03-16 06:27:33'),
(6, 'Kadalai Mittai', 'Kadalai Mittai', '20', 150, 10, 18, 0, '2026-03-16 06:26:45', '2026-03-16 16:38:06'),
(7, 'Lolly Pop', 'Lolly Pop', '10', 0, 0, 0, 0, '2026-03-16 06:27:15', '2026-03-16 06:27:15'),
(8, 'Kinder Joy', 'Kinder Joy', '40', 0, 0, 0, 0, '2026-03-16 06:27:15', '2026-03-16 06:27:15');

-- --------------------------------------------------------

--
-- Table structure for table `store_customers`
--

CREATE TABLE `store_customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address_1` varchar(255) NOT NULL,
  `address_2` varchar(255) NOT NULL,
  `town` varchar(255) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `name_ship` varchar(255) NOT NULL,
  `address_1_ship` varchar(255) NOT NULL,
  `address_2_ship` varchar(255) NOT NULL,
  `town_ship` varchar(255) NOT NULL,
  `country_ship` varchar(255) NOT NULL,
  `postcode_ship` varchar(255) NOT NULL,
  `deleted` int(10) NOT NULL DEFAULT 0,
  `date_entered` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `store_customers`
--

INSERT INTO `store_customers` (`id`, `name`, `email`, `address_1`, `address_2`, `town`, `state`, `country`, `postcode`, `phone`, `name_ship`, `address_1_ship`, `address_2_ship`, `town_ship`, `country_ship`, `postcode_ship`, `deleted`, `date_entered`, `date_modified`) VALUES
(1, 'John', 'john@gmail.com', 'As1', 'As2', 'Chennai One', NULL, 'India', '678906', '8908907901', 'John', 'As1', 'As2', 'Chennai', 'India', '678906', 0, '2026-03-13 12:36:59', '2026-03-16 06:28:04'),
(2, 'Doe', 'doe@gmail.com', 'Doe Home', 'Doe Home', 'Maduari1', NULL, 'India', '678967', '7897897890', 'Doe', 'Doe Addr1', 'Doe Addr2', 'Chennai', 'India', '600028', 0, '2026-03-13 12:36:59', '2026-03-16 06:27:54'),
(3, 'Riyaz', 'riyaz@gmail.com', '12', '', 'Coimbatore', NULL, '', '', '6789067890', 'Riyaz', '12', '', 'Coimbatore', '', '', 0, '2026-03-13 12:36:59', '2026-03-13 12:51:02'),
(4, 'Paari', 'paari@gmail.com', '', 'as1', 'Osur', NULL, '', '', '6543216543', '', '', '', '', '', '', 0, '2026-03-13 12:36:59', '2026-03-13 12:52:58'),
(5, 'Michel', 'mic@gmail.com', '', '', 'US', NULL, '', '', '789067891', '', '', '', '', '', '', 0, '2026-03-16 06:28:26', '2026-03-16 06:28:26'),
(6, 'Navin', 'navin@gmail.com', '', '', 'Chennai', NULL, '', '', '8432109876', '', '', '', '', '', '', 0, '2026-03-16 06:29:43', '2026-03-16 06:29:43'),
(7, 'Shrinivas', 'shrinivas@gmail.com', '', '', 'Trichy', NULL, '', '', '8907896780', '', '', '', '', '', '', 0, '2026-03-16 06:29:43', '2026-03-16 06:29:43'),
(8, 'Pandi', 'pandi@gmail.com', '', '', 'Nellai', NULL, '', '', '7896780988', '', '', '', '', '', '', 0, '2026-03-16 06:29:43', '2026-03-16 06:29:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `email`, `phone`, `status`, `password`, `deleted`, `date_entered`, `date_modified`) VALUES
(1, 'Admin', 'PS', 'admin@psinvoice.com', '7890654321', NULL, '$2b$10$qk/SpCOFEif2.MPrOC5UYuoBHW7Tdn2W.3h5L/lu0mjMaqnHkleoy', 0, '2026-03-17 16:38:23', '2026-03-17 16:38:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_customers`
--
ALTER TABLE `invoice_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `store_customers`
--
ALTER TABLE `store_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `invoice_customers`
--
ALTER TABLE `invoice_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `store_customers`
--
ALTER TABLE `store_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
