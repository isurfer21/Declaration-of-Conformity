-- Adminer 4.2.5 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `Transaction`;
CREATE TABLE `Transaction` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `YourName` varchar(255) NOT NULL,
  `MaterialExchanged` longtext NOT NULL,
  `ActionPerformed` varchar(255) NOT NULL,
  `OtherPersonName` varchar(255) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Transaction` (`Id`, `YourName`, `MaterialExchanged`, `ActionPerformed`, `OtherPersonName`, `Timestamp`) VALUES
(1,	'Abhishek Kumar',	'Samsung S6 edge',	'Given to',	'Ranjan Sharma',	'2016-07-29 11:18:34'),
(2,	'Ranjan Sharma',	'iPhone version 8.3  Serial No. DNPGQ4DLDTC1',	'Taken from',	'Kunal Narayan',	'2016-08-01 06:46:33'),
(3,	'Abhishek Kumar',	'iPad',	'Given to',	'Aastha Arora',	'2016-08-02 13:11:44'),
(4,	'aastha arora',	'iphone 4s',	'Taken from',	'ranjan',	'2016-08-03 07:19:53'),
(5,	'Abhishek Kumar',	'Laptop with charger',	'Given to',	'Manish Jain',	'2016-08-03 11:09:33'),
(6,	'Manish Jain',	'Laptop with charger',	'Returned to',	'Abhishek Kumar',	'2016-08-04 05:30:00'),
(7,	'Abhishek Kumar',	'iPhone USB cable',	'Given to',	'Aastha Arora',	'2016-08-03 11:17:58'),
(8,	'aastha arora',	'iphone 4s',	'Given to',	'ranjan sharma',	'2016-08-05 12:03:18'),
(9,	'shiva',	'iphone 4s',	'Given to',	'ranjan',	'2016-08-08 13:46:30'),
(10,	'ranjan',	'iPhone 4s',	'Returned to',	'Musapeta Shiva',	'2016-08-10 03:52:20'),
(11,	'Inventory',	'Charger without cable of Samsung S4 whose battery is blotted',	'Given to',	'Vijay Pratap Singh',	'2016-08-16 09:36:18'),
(12,	'Inventory',	'Samsung 6s edge',	'Given to',	'Shiva',	'2016-08-26 10:01:25'),
(13,	'aastha arora',	'blackberry Q10',	'Taken from',	'abhishek kumar',	'2016-08-29 10:06:04'),
(14,	'shiva',	'iphone 4s',	'Given to',	'ranjan',	'2016-08-31 07:31:55'),
(15,	'shiva',	'Samsung 6s edge',	'Given to',	'rajni',	'2016-08-31 07:32:36'),
(16,	'Ranjan',	'iphone 4 with wire',	'Returned to',	'abhishek kumar',	'2016-09-06 11:55:34'),
(17,	'Ranjan',	'Sony Xperia Z2',	'Returned to',	'Abhishek Kumar',	'2016-09-06 11:57:12'),
(18,	'Ranjan',	'Iphone 4 with wire',	'Taken from',	'Abhishek Kumar',	'2016-09-15 06:07:29'),
(19,	'Ranjan',	'Sony Xperia Z2',	'Taken from',	'Abhishek Kumar',	'2016-09-15 06:08:08'),
(20,	'Ranjan',	'Iphone 4 with wire',	'Returned to',	'Abhishek Kumar',	'2016-09-16 06:51:48');

-- 2016-09-22 13:51:43