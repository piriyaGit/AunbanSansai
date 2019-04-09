<?php
  $id=$_REQUEST['id'];
  $sql = "SELECT * FROM tb_student WHERE id= '$id'";
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  $showstu = mysqli_fetch_array($res);
  extract($showstu);

  $mysqli=connect();
  $fuc=new System();
  $crom= $fuc->showclassroom();
  	$stea= $fuc->showUser();
 ?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">แก้ไขข้อมูลส่วนตัวนักเรียน</h3>
            </div>
            <div class="box-body">

       <form method="post" action="page/student/updatestudent.php?id=<?=$id?>"  enctype="multipart/form-data">
		            <table class="table table-bordered">
		              <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>รหัสประจำตัวนักเรียน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="number" name="stu_studentID" class="form-control" value="<?=$showstu['stu_studentID']?>" required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เลขบัตรประจำตัวประชาชน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="number" name="stu_IDCard" class="form-control" value="<?=$showstu['stu_IDCard']?>"  required></td>
		              </tr>
                  <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_fname" class="form-control" value="<?=$showstu['stu_fname']?>" required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>นามสกุล</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_lname" class="form-control" value="<?=$showstu['stu_lname']?>"  required></td>
		              </tr>
		              <tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อเล่น</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_nname" class="form-control" value="<?=$showstu['stu_nname']?>"  required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ที่อยู่</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><textarea name="stu_address" class="form-control" value="ที่อยู่" required><?=$showstu['stu_address']?></textarea></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เพศ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="stu_sex" required>
             					 <option <?php if ($showstu['stu_sex'] =='ชาย') echo 'selected';?>>ชาย</option>
             					 <option <?php if ($showstu['stu_sex'] =='หญิง') echo 'selected';?>>หญิง</option>
             				 </select>
                    </td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>กรุ๊ปเลือด</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="stu_lood" required>
             					 <option <?php if ($showstu['stu_lood'] =='A') echo 'selected';?>>A</option>
             					 <option <?php if ($showstu['stu_lood'] =='B') echo 'selected';?>>B</option>
             					 <option <?php if ($showstu['stu_lood'] =='O') echo 'selected';?>>O</option>
             					 <option <?php if ($showstu['stu_lood'] =='AB') echo 'selected';?>>AB</option>
             				 </select>
                    </td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>วันเกิด</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="date" name="stu_birdthday" class="form-control" value="<?=$showstu['stu_birdthday']?>" required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ครูประจำชั้น</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                    <select class="form-control" name="stu_tea" required>

                      <?php
         	 							foreach ($stea as $showtea){
         	 						?>
         						 		<option value="<?=$showtea['user_fname']?>  <?=$showtea['user_lname']?>"><?=$showtea['user_fname']?> <?=$showtea['user_lname']?></option>
         							<?php  } ?>
                      </select>
                    </td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ศึกษาอยู่ชั้น</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" required>
                      <select class="form-control" name="stu_room">

            					 <?php
            							foreach ($crom as $classroom){

            							?>
            							 <option value="<?=$classroom['cr_name']?>"><?=$classroom['cr_name']?></option>
            						<?php  } ?>
            				 </select>
                    </td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>สถานะการศึกษา</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="stu_study" required >
          					    <option <?php if ($showstu['stu_study'] =='กำลังศึกษาอยู่') echo 'selected';?>>กำลังศึกษาอยู่</option>
          					    <option <?php if ($showstu['stu_study'] =='พักการเรียน') echo 'selected';?>>พักการเรียน</option>
          							<option <?php if ($showstu['stu_study'] =='สำเร็จการศึกษา') echo 'selected';?>>สำเร็จการศึกษา</option>
          							<option <?php if ($showstu['stu_study'] =='ลาออก') echo 'selected';?>>ลาออก</option>
          					  </select>
                    </td>
		              </tr>
                  <tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปภาพ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="file" name="stu_img" class="form-control"  ></td>

		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลบิดา</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_fatername" class="form-control" value="<?=$showstu['stu_fatername']?>"  ></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรบิดา</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_fatertel" class="form-control" value="<?=$showstu['stu_fatertel']?>"  ></td>
		              </tr>

									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลมารดา</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_matername" class="form-control" value="<?=$showstu['stu_matername']?>"  ></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรมารดา</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_matertel" class="form-control" value="<?=$showstu['stu_matertel']?>"  ></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลผู้ปกครอง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_parentname" class="form-control" value="<?=$showstu['stu_parentname']?>"  required></td>
                    <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรผู้ปกครอง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="stu_parenttel" class="form-control" value="<?=$showstu['stu_parenttel']?>" required ><br>
						        	<button type="submit" name="Submit" class="btn btn-primary">ยืนยัน</button>
										</td>
		              </tr>

		            </table>
  	 	</form>
            <br>
        </div>
  </div>
</section>
