<?php
$mysqli=connect();
$fuc=new System();
$crom= $fuc->showclassroom();
 ?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">แก้ไขข้อมูลส่วนตัว</h3>
            </div>
            <div class="box-body">

       <form method="post" action="page/user/updateuser.php"  enctype="multipart/form-data">
		            <table class="table table-bordered">
		              <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>รหัสประจำตัวบุคลากร</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_teacherID" class="form-control" value="<?=$name_data['user_teacherID']?>"></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เลขบัตรประจำตัวประชาชน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_IDCard" class="form-control" value="<?=$name_data['user_IDCard']?>"  required></td>
		              </tr>
                  <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>Username</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_username" class="form-control" value="<?=$name_data['user_username']?>" required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>Password</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_password" class="form-control" value="<?=$name_data['user_password']?>"  required></td>
		              </tr>
		              <tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_fname" class="form-control" value="<?=$name_data['user_fname']?>"  required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>นามสกุล</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_lname" class="form-control" value="<?=$name_data['user_lname']?>"  required></td>
		              </tr>
		              <tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อเล่น</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_nname" class="form-control" value="<?=$name_data['user_nname']?>"  required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ที่อยู่</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><textarea name="user_address" class="form-control" value="ที่อยู่" required><?=$name_data['user_address']?></textarea></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เพศ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user_sex" >
             					 <option <?php if ($name_data['user_sex'] =='ชาย') echo 'selected';?>>ชาย</option>
             					 <option <?php if ($name_data['user_sex'] =='หญิง') echo 'selected';?>>หญิง</option>
             				 </select>
                    </td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>กรุ๊ปเลือด</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user_lood">
             					 <option <?php if ($name_data['user_lood'] =='A') echo 'selected';?>>A</option>
             					 <option <?php if ($name_data['user_lood'] =='B') echo 'selected';?>>B</option>
             					 <option <?php if ($name_data['user_lood'] =='O') echo 'selected';?>>O</option>
             					 <option <?php if ($name_data['user_lood'] =='AB') echo 'selected';?>>AB</option>
             				 </select>
                    </td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>วันเกิด</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="date" name="user_birdthday" class="form-control" value="<?=$name_data['user_birdthday']?>"></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>อีเมลล์</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_email" class="form-control" value="<?=$name_data['user_email']?>"  required></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทร</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user_tel" class="form-control" value="<?=$name_data['user_tel']?>"  required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>สถานะ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user_fan" >
          					    <option <?php if ($name_data['user_fan'] =='โสด') echo 'selected';?>>โสด</option>
          					    <option <?php if ($name_data['user_fan'] =='มีแฟนแล้ว') echo 'selected';?>>มีแฟนแล้ว</option>
          							<option <?php if ($name_data['user_fan'] =='สมรส') echo 'selected';?>>สมรส</option>
          							<option <?php if ($name_data['user_fan'] =='อย่าร้าง') echo 'selected';?>>อย่าร้าง</option>
          							<option <?php if ($name_data['user_fan'] =='แยกกันอยู่') echo 'selected';?>>แยกกันอยู่</option>
          					  </select>
                    </td>
		              </tr>
                  <tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปภาพ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="file" name="user_img" class="form-control"  ></td>
										<td width="15%;" style="font-size: 17px; " class="text-right"><b style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">ส่วนงาน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user2_rankcheak" style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">
                        <option <?php if ($name_data['user2_rankcheak'] =='Manager') echo 'selected';?>>Manager</option>
                        <option <?php if ($name_data['user2_rankcheak'] =='Teacher') echo 'selected';?>>Teacher</option>
                        <option <?php if ($name_data['user2_rankcheak'] =='User') echo 'selected';?>>User</option>
                        <option <?php if ($name_data['user2_rankcheak'] =='Developers') echo 'selected';?>>Developers</option>
                      </select>
                    </td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">ตำแหน่งปัจจุบัน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>" name="user2_rank" class="form-control" value="<?=$name_data['user2_rank']?>"  required></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>วันที่เริ่มทำงาน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="date" name="user2_start" class="form-control" value="<?=$name_data['user2_start']?>"  ></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">ประจำชั้น</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user2_room" style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">
                        <?php
                           foreach ($crom as $classroom){

                           ?>
                            <option <?php if ($name_data['user2_room'] ==$classroom['cr_name']) echo 'selected';?>><?=$classroom['cr_name']?></option>
                         <?php  } ?>
                      </select>
                    </td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">สถานะการทำงาน</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="user2_working" style=" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">
          	 					 <option <?php if ($name_data['user2_working'] =='ยังปฏิบัติงาน') echo 'selected';?>>ยังปฏิบัติงาน</option>
          	 					 <option <?php if ($name_data['user2_working'] =='พักงาน') echo 'selected';?>>พักงาน</option>
          						 <option <?php if ($name_data['user2_working'] =='ออกจากงาน') echo 'selected';?>>ออกจากงาน</option>
          	 				 </select>
                    </td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลคู่สมรส</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user2_spouse" class="form-control" value="<?=$name_data['user2_spouse']?>"  ></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทรคู่สมรส</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user2_telspouse" class="form-control" value="<?=$name_data['user2_telspouse']?>"  ></td>
		              </tr>
									<tr>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>จำนวนบุตร</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="user2_child" class="form-control" value="<?=$name_data['user2_child']?>"  ></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
						        	<button type="submit" name="Submit" class="btn btn-primary">ยืนยัน</button>
										</td>
		              </tr>

		            </table>
  	 	</form>
            <br>
        </div>
  </div>
</section>
