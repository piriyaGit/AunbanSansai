<?php
  $tid=$_REQUEST['id'];
  $sql = "SELECT * FROM tb_user
  LEFT JOIN tb_user2 ON tb_user2.user2_id=tb_user.id
  WHERE id= '$tid'";
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  $show2 = mysqli_fetch_array($res);
  extract($show2);
 ?>
 <section class="content-header">
   <div class="row">
         <div class="col-xs-12">
           <div class="box">
             <div class="box-header">
               <h3 class="box-title">ดูข้อมูลครู</h3>
             </div>
             <div class="box-body">
               <div class="row">
                 <div class="col-md-4">
                   <img src="img/<?=$show2['user_img']?>" class="img-img-fluid img-thumbnail"  width="100%" >
                 </div>
                 <div class="col-md-8">
                   <table class="table table-bordered">
                       <div style="font-size: 17px;">ส่วนข้อมูลส่วนบุคคล</div>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>รหัสประจำตัวบุคลากร</b></td>
                         <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_teacherID']?></td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>เลขบัตรประจำตัวประชาชน</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_IDCard']?></td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุล</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_fname']?> <?=$show2['user_lname']?></td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>ชื่อเล่น</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_nname']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>ที่อยู่</b></td>
                         <td width="2%;"></td>
                         <td style="font-size: 17px; text-align justify;" ><?=$show2['user_address']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>เพศ</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_sex']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>กรุ๊ปเลือด</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px; text-align justify;" ><?=$show2['user_lood']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>วันเกิด</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px; text-align justify;" ><?=DBThaiLongDate($show2['user_birdthday'])?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>อีเมลล์</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px; text-align justify;" ><?=$show2['user_email']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทร</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_tel']?> </td>
                       </tr>
                       <tr>
                         <td width="20%;" style="font-size: 17px;" class="text-right"><b>สถานะ</b></td>
                           <td width="2%;"></td>
                         <td style="font-size: 17px;" ><?=$show2['user_fan']?> </td>
                       </tr>
                   </table>
               </tbody>
               </table>
               </div>
           </div>
           <div style="font-size: 17px;">ส่วนข้อมูลการทำงาน</div>
           <table class="table table-bordered">
             <tr>
               <td width="15%;" style="font-size: 17px;" class="text-right"><b>ตำแหน่งปัจจุบัน</b></td>
                 <td width="2%;"></td>
               <td style="font-size: 17px;" ><?=$show2['user2_rank']?> </td>
             </tr>
             <tr>
               <td width="15%;" style="font-size: 17px;" class="text-right"><b>วันที่เริ่มทำงาน</b></td>
                 <td width="2%;"></td>
               <td style="font-size: 17px;" ><?=DBThaiLongDate($show2['user2_start'])?> </td>
             </tr>
             <tr>
               <td width="15%;" style="font-size: 17px;" class="text-right"><b>ประจำชั้น</b></td>
                 <td width="2%;"></td>
               <td style="font-size: 17px;" ><?=$show2['user2_room']?> </td>
             </tr>
             <tr>
               <td width="15%;" style="font-size: 17px;" class="text-right"><b>สถานะการทำงาน</b></td>
                 <td width="2%;"></td>
               <td style="font-size: 17px;" ><?=$show2['user2_working']?> </td>
             </tr>
           </table>
             <div style="font-size: 17px;">ส่วนข้อมูลคู่สมรส</div>
             <table class="table table-bordered">
               <tr>
                 <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลคู่สมรส</b></td>
                   <td width="2%;"></td>
                 <td style="font-size: 17px;" ><?=$show2['user2_spouse']?> </td>
               </tr>
               <tr>
                 <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรคู่สมรส</b></td>
                   <td width="2%;"></td>
                 <td style="font-size: 17px;" ><?=$show2['user2_telspouse']?> </td>
               </tr>
               <tr>
                 <td width="15%;" style="font-size: 17px;" class="text-right"><b>จำนวนบุตร</b></td>
                   <td width="2%;"></td>
                 <td style="font-size: 17px;" ><?=$show2['user2_child']?> </td>
               </tr>
               <tr>
                 <td colspan="3" style="font-size: 17px;" class="text-right">
                    <a href="main.php?page=edit_form&id=<?=$show2['id']?>"> <input type="button"  class="btn btn-primary" value="แก้ไขข้อมูล" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'disabled' : ''; ?>></a>
                 </td>
               </tr>

             </table>
             <br>
         </div>
   </div>
 </section>
