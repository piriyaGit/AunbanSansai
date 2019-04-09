-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2019 at 12:24 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anubansansai_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_classroom`
--

CREATE TABLE `tb_classroom` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `cr_name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_classroom`
--

INSERT INTO `tb_classroom` (`id`, `cr_name`) VALUES
(0001, 'เตรียมอนุบาล'),
(0002, 'อนุบาลบาล 1/3'),
(0003, 'อนุบาลบาล 1/2'),
(0004, 'อนุบาลบาล 1/3'),
(0005, 'อนุบาลบาล 2/1'),
(0006, 'อนุบาลบาล 2/2'),
(0007, 'อนุบาลบาล 2/3'),
(0008, 'อนุบาลบาล 3/1'),
(0009, 'อนุบาลบาล 3/2'),
(0010, 'อนุบาลบาล 3/3');

-- --------------------------------------------------------

--
-- Table structure for table `tb_home`
--

CREATE TABLE `tb_home` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `home_name` text NOT NULL,
  `home_pic` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_home`
--

INSERT INTO `tb_home` (`id`, `home_name`, `home_pic`) VALUES
(0001, 'หน้าโรงเรียน', '6.png'),
(0002, 'สนามเด็กเล่นหน้าโรงเรียน555', '3.png'),
(0003, 'ห้องสมุดและห้องคอมพิวเตอร์', '7.png'),
(0004, 'โรงอาหาร', '1.png'),
(0005, 'อาคารเตรียมอนุบาล', '8.png'),
(0006, 'อาคารธุรการ', '9.png'),
(0007, 'สิ่งศักดิ์สิทธิ์ประจำโรงเรียน', '2.png'),
(0008, 'สนามเด็กเล่นอนุบาล3\r\n', '4.png'),
(0009, 'สระว่ายน้ำ', '5.png'),
(0010, 'อาคารอนุบาล 1', '10.png'),
(0011, 'อาคารอนุบาล 2', '11.png'),
(0012, 'อาคารอนุบาล 3 ', '12.png');

-- --------------------------------------------------------

--
-- Table structure for table `tb_information`
--

CREATE TABLE `tb_information` (
  `id` int(4) NOT NULL,
  `infor_namethai` varchar(200) NOT NULL,
  `infor_nameeng` varchar(200) NOT NULL,
  `infor_initials` varchar(10) NOT NULL,
  `infor_logo` text NOT NULL,
  `infor_important` text NOT NULL,
  `infor_header` text NOT NULL,
  `infor_background` text NOT NULL,
  `infor_history` text NOT NULL,
  `infor_another` text NOT NULL,
  `infor_tel` text NOT NULL,
  `infor_mail` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_information`
--

INSERT INTO `tb_information` (`id`, `infor_namethai`, `infor_nameeng`, `infor_initials`, `infor_logo`, `infor_important`, `infor_header`, `infor_background`, `infor_history`, `infor_another`, `infor_tel`, `infor_mail`) VALUES
(1, 'โรงเรียนอนุบาลสันทราย', 'Anuban Sansai School', 'อ.ท.ร.', 'login.png', 'โรงเรียนอนุบาลสันทราย โรงเรียนดี อบอุ่น ปลอดภัย ใกล้บ้าน ได้รับการรับรองมาตรฐานคุณภาพการศึกษาระดับปฐมวัยจากสำนักงานรับรองมาตรฐานการศึกษา (องค์กรมหาชน).', 'IMG_7409.JPG', 'IMG_7409.JPG', '   โรงเรียนอนุบาลสันทราย เป็นโรงเรียนที่จัดการศึกษาในระดับก่อนประถมศึกษา <br>สังกัดสำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน (สช.) กระทรวงศึกษาธิการ<br> ตั้งอยู่เลขที่ 124 หมู่ 9 ตำบลสันทรายน้อย  อำเภอสันทราย  จังหวัดเชียงใหม่ <br> เปิดทำการเรียนการสอนครั้งแรกเมื่อวันที่  1  พฤษภาคม 2538<br>  โดยมีนางสาวไพรินทร์  จันทร์สุก เป็นผู้รับใบอนุญาตและผู้จัดการ  <br>ได้รับอนุญาตให้จัดตั้งเป็นโรงเรียนประเภทสามัญศึกษา  รับนักเรียนได้ไม่เกิน 120 คน<br> จำนวน 3 ห้องเรียน  โดยขณะเปิดทำการเรียนการสอนปีแรก  มีจำนวนนักเรียนทั้งสิ้น 60 คน<br> และมีครูผู้สอนจำนวน 4 คน           ปัจจุบันโรงเรียนอนุบาลสันทรายตั้งอยู่ในเขตพื้นที่การศึกษา<br>ประถมศึกษาเชียงใหม่ เขต 2 ได้รับอนุญาตให้รับนักเรียนได้ไม่เกิน 240 คน จำนวน 6 ห้องเรียน', '<b>โรงเรียนอนุบาลสันทราย</b><br>เลขที่  124  หมู่  9  ตำบลสันทรายน้อย  อำเภอสันทราย  จังหวัดเชียงใหม่  50210 <br> วันเปิดทำการ : ทุกวันจันทร์-ศุกร์ เวลา 7.00-17.00 น. <br> วันหยุดทำการ : ทุกวันหยุดราชการและวันหยุดนักขัตฤกษ์', '053 – 491124', 'anubansansai@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `tb_itfix`
--

CREATE TABLE `tb_itfix` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `itfix_name` text NOT NULL,
  `itfix_position` text NOT NULL,
  `itfix_classroom` text NOT NULL,
  `itfix_room` varchar(255) NOT NULL,
  `itfix_symptom` text NOT NULL,
  `itfix_date` date NOT NULL,
  `itfix_method` text NOT NULL,
  `itfix_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_itfix`
--

INSERT INTO `tb_itfix` (`id`, `itfix_name`, `itfix_position`, `itfix_classroom`, `itfix_room`, `itfix_symptom`, `itfix_date`, `itfix_method`, `itfix_status`) VALUES
(00001, 'นายพิริยะ  ตามสัตย์ ', 'นักพัฒนาระบบ ', '', '0', 'คอมพัง', '2019-01-16', '', 'สำเร็จ'),
(00002, 'นายพิริยะ  ตามสัตย์ ', 'นักพัฒนาระบบ ', '', 'อาคารเตรียมอนุบาล', 'จอแตก', '2019-01-15', '', 'สำเร็จ'),
(00003, 'นายพิริยะ  ตามสัตย์ ', 'นักพัฒนาระบบ ', '', 'ห้องสมุดและห้องคอมพิวเตอร์', 'คอมหลุ', '2019-01-14', 'เผา', 'สำเร็จ'),
(00008, 'นายชนนท์ มูลศิริ ', 'นักพัฒนาระบบ ', '', 'อาคารอนุบาล 3 ', 'หน้าจอไม่ติด', '2019-01-14', 'เปลี่ยนจอ', 'สำเร็จ'),
(00009, 'นายชนนท์ มูลศิริ ', 'นักพัฒนาระบบ ', '', 'โรงอาหาร', 'cvgbcf', '2019-01-18', 'sss', 'สำเร็จ'),
(00010, 'นายพิริยะ ตามสัตย์ ', 'นักพัฒนาระบบ ', '', 'หน้าโรงเรียน', 'ป้ายพัง', '2019-01-16', 'ซื้อใหม่', 'สำเร็จ'),
(00011, 'นายพิริยะ ตามสัตย์ ', 'นักพัฒนาระบบ ', '', 'สนามเด็กเล่นหน้าโรงเรียน555', 'ม้านั่งล้ม', '2019-01-16', '', 'รอดำเนินการ');

-- --------------------------------------------------------

--
-- Table structure for table `tb_newinfor`
--

CREATE TABLE `tb_newinfor` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `newinfor_header` text NOT NULL,
  `newinfor_text` text NOT NULL,
  `newinfor_img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_newinfor`
--

INSERT INTO `tb_newinfor` (`id`, `newinfor_header`, `newinfor_text`, `newinfor_img`) VALUES
(0001, 'วิสัยทัศน์', '&nbsp;&nbsp;&nbsp;&nbsp; ภายในปีการศึกษา 2557 โรงเรียนอนุบาลสันทราย จะเป็นโรงเรียนที่จัดการศึกษาในระดับปฐมวัย ได้อย่างมีคุณภาพ  มาตรฐาน  สอดคล้องกับหลักสูตรการศึกษาปฐมวัย  ได้รับการยอมรับและยกย่องจากผู้เกี่ยวข้องทุกฝ่าย  เด็กทุกคนได้รับการพัฒนาทั้งทางด้านร่างกาย  อารมณ์จิตใจ  สังคม  และสติปัญญา  อย่างเหมาะสมกับวัยเต็มตามศักยภาพ และการศึกษาต่อในระดับประถมศึกษา เด็กทุกคนได้รับการปลูกฝังคุณธรรมจริยธรรม ค่านิยมที่พึงประสงค์ และยึดมั่นในการปกครองในระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุข', 'IMG_7252.JPG'),
(0002, 'พันธกิจ', '&nbsp;&nbsp;&nbsp;&nbsp;  จัดกิจกรรมส่งเสริมพัฒนาการทางด้านร่างกาย อารมณ์จิตใจ สังคม และสติปัญญาแบบองค์รวม  ให้แก่เด็กทุกคนเต็มตามศักยภาพ\nส่งเสริมและพัฒนาให้ผู้บริหารครูบุคลากรปฏิบัติหน้าที่อย่างมีประสิทธิภาพ  และบริหารจัดการศึกษาได้อย่างเป็นระบบ มีคุณภาพมาตรฐาน\nสร้าง ส่งเสริม และสนับสนุนสังคมแห่งการเรียนรู้\nส่งเสริมการพัฒนาสถานศึกษาให้บรรลุตามเป้าหมายที่ตั้งไว้\nส่งเสริมการพัฒนาสถานศึกษาเพื่อยกระดับคุณภาพการจัดการ', 'IMG_8858.jpg\r\n'),
(0003, 'อัตลักษณ์  ', '<b> “ระเบียบวินัยเด่น  พัฒนาการดี  มีมาตรฐาน  ทันสมัย”</b>\n          ระเบียบวินัยเด่น  หมายถึง  เด็กนักเรียนมีระเบียบวินัยในตนเองเหมาะสมกับวัย  สามารถเข้าแถวตามลำดับก่อนหลัง  รู้จักการรอคอย  รู้จักจัดเก็บสิ่งของต่าง ๆ เข้าที่\n          พัฒนาการดี  หมายถึง  เด็กนักเรียนมีพัฒนาการทางด้านร่างกาย อารมณ์จิตใจ สังคม และสติปัญญาอยู่ระดับดีจนถึงดีมาก\n          มีมาตรฐาน  หมายถึง  สถานศึกษาสามารถจัดการศึกษาในระดับปฐมวัยได้อย่างมีคุณภาพมาตรฐาน\n        ทันสมัย  หมายถึง  สถานศึกษามีการปรับปรุงพัฒนาการจัดการเรียนการสอนให้มีความทันสมัย  ก้าวทันต่อการเปลี่ยนแปลงของโลกในยุคปัจจุบัน', 'IMG_8233.JPG');

-- --------------------------------------------------------

--
-- Table structure for table `tb_student`
--

CREATE TABLE `tb_student` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `stu_studentID` varchar(13) NOT NULL,
  `stu_IDCard` varchar(13) NOT NULL,
  `stu_fname` varchar(100) NOT NULL,
  `stu_lname` varchar(100) NOT NULL,
  `stu_nname` varchar(100) NOT NULL,
  `stu_sex` varchar(5) NOT NULL,
  `stu_address` text NOT NULL,
  `stu_img` text NOT NULL,
  `stu_lood` varchar(5) NOT NULL,
  `stu_birdthday` date NOT NULL,
  `stu_tea` text NOT NULL,
  `stu_room` varchar(50) NOT NULL,
  `stu_study` varchar(50) NOT NULL,
  `stu_fatername` varchar(255) NOT NULL,
  `stu_fatertel` varchar(10) NOT NULL,
  `stu_matername` varchar(255) NOT NULL,
  `stu_matertel` varchar(10) NOT NULL,
  `stu_parentname` varchar(255) NOT NULL,
  `stu_parenttel` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_student`
--

INSERT INTO `tb_student` (`id`, `stu_studentID`, `stu_IDCard`, `stu_fname`, `stu_lname`, `stu_nname`, `stu_sex`, `stu_address`, `stu_img`, `stu_lood`, `stu_birdthday`, `stu_tea`, `stu_room`, `stu_study`, `stu_fatername`, `stu_fatertel`, `stu_matername`, `stu_matertel`, `stu_parentname`, `stu_parenttel`) VALUES
(00001, '1111111111111', '1111111111111', 'ด.ช.สิรวิช', 'สุวิทย์', 'เอ้ฒ', 'ชาย', 'เชียงใหม่', '11111111111111111111111111.png', 'A', '2019-01-15', 'นายชนนท์ มูลศิริ', 'เตรียมอนุบาล', 'กำลังศึกษาอยู่', 'ลุงเอ็ม', '0879654123', 'ป้าเอ็ม', '0874563219', 'ลุงเอ็ม', '0879654123'),
(00002, '2222222222222', '2222222222222', 'ด.ช.ธนาดล', 'เสมอใจ', 'นน', 'หญิง', 'สันทราย', '22222222222222222222222222.png', 'B', '2019-01-15', 'นายพิริยะ   ตามสัตย์', 'เตรียมอนุบาล', 'กำลังศึกษาอยู่', 'ลุงนน', '0874123654', 'ป้านน', '0987654321', 'ป้าแสง', '0987654321'),
(00003, '1111111111111', '1111111111111', 'ด.ช.เนย', 'เนย', 'เนย', 'ชาย', 'เชียงใหม่', '33333333333333333333333333.png', 'A', '0000-00-00', 'นายพิริยะ   ตามสัตย์', 'อนุบาลบาล 1/3', 'พักการเรียน', 'ลุงเนย', '', 'ป้าเนย', '0123456789', 'ลุงเนย', '0123456789'),
(00004, '886755354', '44444444454', 'ด.ช.ฟลุ๊ค', 'ฟลุ๊ค', 'ฟลุ๊ค', 'ชาย', '100/102', '88675535444444444454.jpg', 'B', '2018-02-07', 'นายพิริยะ  ตามสัตย์', 'เตรียมอนุบาล', 'กำลังศึกษาอยู่', 'ลุงเนยยยย', '0987654312', 'ป้าเนยยย', '0123456733', 'ลุงเนยยยย', '9999999999'),
(00005, '7777777777777', '7777777777777', 'ดช.', 'เนย', 'เนย', 'หญิง', 'ำะพะีหะด ภพ-พ ไๅ ะ ำะ', 'กดเกดะพพเะำพ.jpg', 'O', '2019-03-06', 'นายพิริยะ  ตามสัตย์', 'เตรียมอนุบาล', 'กำลังศึกษาอยู่', 'ป้า', '0987654321', 'ป้าเนย', '0123456789', 'ลุงเนย', '0123456789'),
(00006, '111', '45555', 'แก้ว', 'น้ำ', 'แก้ว', 'ชาย', 'แม่ริม', '11145555.png', 'A', '2019-01-04', 'นายพิริยะ  ตามสัตย์', 'เตรียมอนุบาล', 'กำลังศึกษาอยู่', 'แก้ว', '9999999999', 'แก้ว', '9999999999', 'แก้ว', '9999999999');

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `user_teacherID` varchar(13) NOT NULL,
  `user_IDCard` varchar(13) NOT NULL,
  `user_fname` varchar(100) NOT NULL,
  `user_lname` varchar(100) NOT NULL,
  `user_nname` varchar(30) NOT NULL,
  `user_sex` varchar(10) NOT NULL,
  `user_tel` varchar(10) NOT NULL,
  `user_address` text NOT NULL,
  `user_username` varchar(30) NOT NULL,
  `user_password` varchar(30) NOT NULL,
  `user_img` text NOT NULL,
  `user_lood` varchar(3) NOT NULL,
  `user_birdthday` date NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_fan` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id`, `user_teacherID`, `user_IDCard`, `user_fname`, `user_lname`, `user_nname`, `user_sex`, `user_tel`, `user_address`, `user_username`, `user_password`, `user_img`, `user_lood`, `user_birdthday`, `user_email`, `user_fan`) VALUES
(0001, '00000000005', '1501201129731', 'นายพิริยะ', 'ตามสัตย์', 'เปนเปน', 'ชาย', '0918526809', '11 หมู่ที่ 3 ', 'test', 'test', 'sp.jpg', 'O', '1999-09-03', 'piriya.cnx.1999@gmail.com', 'แยกกันอยู่'),
(0002, '00000000006', '1234567891234', 'นายชนน', 'มูลศิริ', 'นน', 'ชาย', '0918526809', 'สันทราย', 'chanon', 'chanon', 'non.jpg', 'O', '1999-09-03', 'canon@gmail.com', 'แยกกันอยู่'),
(0018, '00000000001', '1501201129731', 'นางสาวไพรินทร์', 'จันทร์สุข', 'ไพรินทร์', 'หญิง', '2222222222', 'สันทราย เชียงใหม่', 'pairan', 'pairan', '1111111111111.png', 'O', '1999-09-03', 'pairan@gmail.com', 'โสด'),
(0019, '00000000002', '1501201129731', 'นายสมาน', 'พลอยจันทร์', 'สมาน', 'ชาย', '1111111111', 'สันทราย เชียงใหม่', 'saman', 'saman', '2222222222222.png', 'O', '1999-09-03', 'piriya.cnx.1999@gmail.com', 'โสด'),
(0020, '00000000003', '1501201129731', 'นายสง่า', 'ยอเสน', 'สง่า', 'ชาย', '0000000000', 'สันทราย เชียงใหม่', 'saya', 'saya', '3333333333333.png', 'O', '1999-09-03', 'saya@gmail.com', 'โสด'),
(0021, '00000000004', '1501201129731', 'นางจรรยา', 'วรรณชัย', 'จรรยา', 'หญิง', '0987654321', 'สันทราย เชียงใหม่', 'janya', 'janya', '4444444444444.png', 'A', '1999-09-03', 'chanya@gmail.com', 'โสด');

-- --------------------------------------------------------

--
-- Table structure for table `tb_user2`
--

CREATE TABLE `tb_user2` (
  `user2_id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `user2_rank` text NOT NULL,
  `user2_rankcheak` varchar(25) NOT NULL,
  `user2_start` date NOT NULL,
  `user2_room` varchar(50) NOT NULL,
  `user2_working` varchar(50) NOT NULL,
  `user2_spouse` text NOT NULL,
  `user2_telspouse` varchar(10) NOT NULL,
  `user2_child` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_user2`
--

INSERT INTO `tb_user2` (`user2_id`, `user2_rank`, `user2_rankcheak`, `user2_start`, `user2_room`, `user2_working`, `user2_spouse`, `user2_telspouse`, `user2_child`) VALUES
(0001, 'นักพัฒนาระบบ', 'Developers', '2018-11-01', 'อนุบาลบาล 1/3', 'ยังปฏิบัติงาน', '', '', ''),
(0002, 'นักพัฒนาระบบ', 'Developers', '2018-11-01', 'เตรียมอนุบาล', 'ยังปฏิบัติงาน', '', '', ''),
(0018, 'ผู้รับใบอนุญาติ/ผู้จัดการ', 'Manager', '2018-11-01', 'เตรียมอนุบาล', 'ยังปฏิบัติงาน', '', '', ''),
(0019, 'ที่ปรึกษา/กรรมการบริหารโรงเรียน', 'Manager', '2018-11-01', 'เตรียมอนุบาล', 'ยังปฏิบัติงาน', '', '', ''),
(0020, 'ที่ปรึกษา', 'Manager', '2018-11-01', 'เตรียมอนุบาล', 'ยังปฏิบัติงาน', '', '', ''),
(0021, 'ผู้อำนวยการโรงเรียน', 'Manager', '2018-11-01', 'เตรียมอนุบาล', 'ยังปฏิบัติงาน', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_classroom`
--
ALTER TABLE `tb_classroom`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_home`
--
ALTER TABLE `tb_home`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_information`
--
ALTER TABLE `tb_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_itfix`
--
ALTER TABLE `tb_itfix`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_newinfor`
--
ALTER TABLE `tb_newinfor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_student`
--
ALTER TABLE `tb_student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_user2`
--
ALTER TABLE `tb_user2`
  ADD PRIMARY KEY (`user2_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_classroom`
--
ALTER TABLE `tb_classroom`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tb_home`
--
ALTER TABLE `tb_home`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `tb_information`
--
ALTER TABLE `tb_information`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tb_itfix`
--
ALTER TABLE `tb_itfix`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tb_newinfor`
--
ALTER TABLE `tb_newinfor`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_student`
--
ALTER TABLE `tb_student`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tb_user2`
--
ALTER TABLE `tb_user2`
  MODIFY `user2_id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
