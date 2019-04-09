<?php
  $id=$_REQUEST['id'];
  $sql = "SELECT * FROM tb_student WHERE id= '$id'";
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  $showstu = mysqli_fetch_array($res);
  extract($showstu);
 ?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">ดูข้อมูลนักเรียน</h3>
            </div>
            <div class="box-body">
              <div class="row">
                <div class="col-md-4">
                  <img src="img/<?=$showstu['stu_img']?>" class="img-img-fluid img-thumbnail"  width="100%" >
                </div>
                <div class="col-md-8">
                  <table class="table table-bordered">
                      <div style="font-size: 17px;">ส่วนข้อมูลส่วนบุคคล</div>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>รหัสประจำตัวนักเรียน</b></td>
                        <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_studentID']?></td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>เลขบัตรประจำตัวประชาชน</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_IDCard']?></td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุล</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_fname']?> <?=$showstu['stu_lname']?></td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>ชื่อเล่น</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_nname']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>ที่อยู่</b></td>
                        <td width="2%;"></td>
                        <td style="font-size: 17px; text-align justify;" ><?=$showstu['stu_address']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>เพศ</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_sex']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>กรุ๊ปเลือด</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px; text-align justify;" ><?=$showstu['stu_lood']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>วันเกิด</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px; text-align justify;" ><?=DBThaiLongDate($showstu['stu_birdthday'])?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>ครูประจำชั้น</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px; text-align justify;" ><?=$showstu['stu_tea']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>ศึกษาอยู่ชั้น</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_room']?> </td>
                      </tr>
                      <tr>
                        <td width="20%;" style="font-size: 17px;" class="text-right"><b>สถานะการศึกษา</b></td>
                          <td width="2%;"></td>
                        <td style="font-size: 17px;" ><?=$showstu['stu_study']?> </td>
                      </tr>
                  </table>
              </tbody>
              </table>
              </div>
          </div>
          <div style="font-size: 17px;">ส่วนข้อมูลผู้ปกครอง</div>
          <table class="table table-bordered">
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลบิดา</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_fatername']?> </td>
            </tr>
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรบิดา</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_fatertel']?></td>
            </tr>
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลมารดา</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_matername']?> </td>
            </tr>
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรมารดา</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_matertel']?></td>
            </tr>
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลผู้ปกครอง</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_parentname']?> </td>
            </tr>
            <tr>
              <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรผู้ปกครอง</b></td>
                <td width="2%;"></td>
              <td style="font-size: 17px;" ><?=$showstu['stu_parenttel']?></td>
            </tr>

              <tr>
                <td colspan="3" style="font-size: 17px;" class="text-right">
                   <a href="main.php?page=editstudent&id=<?=$showstu['id']?>"> <input type="button"  class="btn btn-primary" value="แก้ไขข้อมูล" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'disabled' : ''; ?>></a>
                </td>
              </tr>

            </table>
            <br>
        </div>
  </div>
</section>
