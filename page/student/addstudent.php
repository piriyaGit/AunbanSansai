<?php
		$mysqli=connect();
		$fuc=new System();
		$crom= $fuc->showclassroom();
		$stea= $fuc->showUser();
 ?>

<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  เพิ่มข้อมูลนักเรียน
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">เพิ่มข้อมูล</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

        <form method="post" action="page/student/uploadstudent.php"  enctype="multipart/form-data">
 	      <!-- Modal body -->
 	      <div class="modal-body" >

 	        <input type="number" name="stu_studentID" class="form-control"  placeholder="รหัสประจำตัวนักเรียน" maxlength="13"  required>
 					<br>
 					<input type="number" name="stu_IDCard" class="form-control"  placeholder="เลขบัตรประจำตัวประชาชน" maxlength="13" required>
 				 <br>
 				 <input type="text" name="stu_fname" class="form-control"  placeholder="ชื่อ (พร้อมคำนำหน้า)" required>
 				 <br>
 				 <input type="text" name="stu_lname" class="form-control"  placeholder="นามสกุล" required>
 				 <br>
 				 <input type="text" name="stu_nname" class="form-control"  placeholder="ชื่อเล่น" >
 				 <br>
 				 <textarea name="stu_address" class="form-control" placeholder="ที่อยู่" required></textarea>
 				 <br>
 				 <select class="form-control" name="stu_sex" >
 					 <option value=" ">เพศ :</option>
 					 <option value="ชาย">ชาย</option>
 					 <option value="หญิง">หญิง</option>
 				 </select>
 				 <br>
 				 <select class="form-control" name="stu_lood">
 					 <option value=" ">กรุ๊ปเลือด :</option>
 					 <option value="A">A</option>
 					 <option value="B">B</option>
 					 <option value="O">O</option>
 					 <option value="AB">AB</option>
 				 </select>
 				 <br>
 				 <label>วันเกิด</label>
 				 <input type="date" name="stu_birdthday" class="form-control" required>
 					<br>
 					<input type="file" name="stu_img" class="form-control" required>
 					<br>
						<select class="form-control" name="stu_tea">
						 <option value=" ">ครูประจำชั้น :</option>
						 <?php
	 							foreach ($stea as $showtea){

	 						?>
						 		<option value="<?=$showtea['user_fname']?>  <?=$showtea['user_lname']?>"><?=$showtea['user_fname']?> <?=$showtea['user_lname']?></option>
							<?php  } ?>
					 </select>
					<br>
 					<select class="form-control" name="stu_room">
 					 <option value=" ">ศึกษาอยู่ชั้น :</option>
 					 <?php
 							foreach ($crom as $classroom){

 							?>
 							 <option value="<?=$classroom['cr_name']?>"><?=$classroom['cr_name']?></option>
 						<?php  } ?>
 				 </select>
 					<br>
 						<select class="form-control" name="stu_study">
 	 					 <option value=" ">สถานะการศึกษา :</option>
 	 					 <option value="กำลังศึกษาอยู่">กำลังศึกษาอยู่</option>
 	 					 <option value="พักการเรียน">พักการเรียน</option>
 						 <option value="สำเร็จการศึกษา">สำเร็จการศึกษา</option>
						 <option value="ลาออก">ลาออก</option>
 	 				 </select>
 					 <br>
 					<input type="text" name="stu_fatername" class="form-control"  placeholder="ชื่อ-นามสกุลบิดา" >
 					<br>
 					<input type="text" name="stu_fatertel" class="form-control"  placeholder="เบอร์โทรบิดา" >
 					<br>
					<input type="text" name="stu_matername" class="form-control"  placeholder="ชื่อ-นามสกุลมารดา" >
 					<br>
 					<input type="text" name="stu_matertel" class="form-control"  placeholder="เบอร์โทรมารดา" >
 					<br>
					<input type="text" name="stu_parentname" class="form-control"  placeholder="ชื่อ-นามสกุลผู้ปกครอง" >
 					<br>
 					<input type="text" name="stu_parenttel" class="form-control"  placeholder="เบอร์โทรผู้ปกครอง" >



 	      </div>

 	      <!-- Modal footer -->
				<div class="modal-footer">
	        <button type="button" class="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
	        <input type="submit" class="btn btn-primary"></input>
	      </div>

 	 	</form>

      </div>

    </div>
  </div>
</div>
