-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 18, 2025 lúc 04:46 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `swin_shop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `merchandises`
--

CREATE TABLE `merchandises` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `stock` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `remaining` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `merchandises`
--

INSERT INTO `merchandises` (`id`, `name`, `price`, `stock`, `image`, `remaining`) VALUES
(1, 'Swinburne T-Shirt', 180, 'Available', '/images/SwinTShirt.png', 1),
(2, 'Swinburne Hoodie (Red)', 420, 'Available', '/images/SwinRedHoodie.png', 11),
(3, 'Swinburne Teddy Bear (Brown)', 150, 'Out of Stock', '/images/SwinTeddyBear.png', 0),
(4, 'Swinburne Teddy Bear (Beige)', 200, 'Available', '/images/SwinTeddyBearBeige.jpg', 15),
(5, 'Swinburne Notebook and Pen', 30, 'Out of Stock', '/images/SwinNotebook.jpg', 0),
(6, 'Swinburne Thermal Bottle', 330, 'Out of Stock', '/images/SwinWaterBottle.png', 0),
(7, 'Swinburne Umbrella', 170, 'Available', '/images/SwinUmbrella.png', 5),
(8, 'Swinburne Tote (Black)', 140, 'Available', '/images/SwinToteBlack.jpg', 20);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(50) DEFAULT 'Completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `item_id`, `quantity`, `total_price`, `date`, `status`) VALUES
(12, 105243570, 4, 1, 200, '2025-07-18', 'Completed'),
(13, 105243570, 2, 1, 420, '2025-07-18', 'Completed');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `coins` int(11) DEFAULT 0,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `mail`, `coins`, `password`) VALUES
(105243570, 'Le Duc Duyet', '105243570@student.swin.edu.au', 95699, '12345'),
(105243571, 'Nguyen Van A', '105243571@student.swin.edu.au', 350, '12345'),
(105243572, 'Tran Thi B', '105243572@student.swin.edu.au', 200, '12345'),
(105243573, 'Pham Van C', '105243573@student.swin.edu.au', 800, '12345'),
(105243574, 'Hoang Thi D', '105243574@student.swin.edu.au', 100, '12345'),
(105243575, 'Vo Van E', '105243575@student.swin.edu.au', 650, '12345'),
(105243576, 'Le Thi F', '105243576@student.swin.edu.au', 450, '12345');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `merchandises`
--
ALTER TABLE `merchandises`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `merchandises`
--
ALTER TABLE `merchandises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105243577;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `merchandises` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
