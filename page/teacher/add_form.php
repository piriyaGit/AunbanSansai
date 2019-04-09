
<?php
		$mysqli=connect();
		$fuc=new System();
		$crom= $fuc->showclassroom();
 ?>
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
	  เพิ่มข้อมูลครู
	</button>

	<!-- The Modal -->
	<div class="modal fade" id="myModal">
	  <div class="modal-dialog">
	    <div class="modal-content">

	      <!-- Modal Header -->
	      <div class="modal-header">
	        <h4 class="modal-title">เพิ่มข้อมูลครู</h4>
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	      </div>

	     <form method="post" action="page/teacher/upload.php"  enctype="multipart/form-data">
	      <!-- Modal body -->
	      <div class="modal-body" >

	        <input type="number" name="user_teacherID" class="form-control"  placeholder="รหัสประจำตัวบุคลากร" maxlength="13"  required>
					<br>
					<input type="number" name="user_IDCard" class="form-control"  placeholder="เลขบัตรประจำตัวประชาชน" maxlength="13" required>
				 <br>
				 <input type="text" name="user_fname" class="form-control"  placeholder="ชื่อ (พร้อมคำนำหน้า)" required>
				 <br>
				 <input type="text" name="user_lname" class="form-control"  placeholder="นามสกุล" required>
				 <br>
				 <input type="text" name="user_nname" class="form-control"  placeholder="ชื่อเล่น" >
				 <br>
				 <input type="text" name="user_username" class="form-control"  placeholder="Username" >
				 <br>
				 <input type="text" name="user_password" class="form-control"  placeholder="Password" >
				 <br>
				 <textarea name="user_address" class="form-control" placeholder="ที่อยู่" required></textarea>
				 <br>
				 <select class="form-control" name="user_sex" >
					 <option value=" ">เพศ :</option>
					 <option value="ชาย">ชาย</option>
					 <option value="หญิง">หญิง</option>
				 </select>
				 <br>
				 <select class="form-control" name="user_lood">
					 <option value=" ">กรุ๊ปเลือด :</option>
					 <option value="A">A</option>
					 <option value="B">B</option>
					 <option value="O">O</option>
					 <option value="AB">AB</option>
				 </select>
				 <br>
				 <label>วันเกิด</label>
				 <input type="date" name="user_birdthday" class="form-control" required>
				 <br>
				 <input type="email" name="user_email" class="form-control"  placeholder="อีเมลล์" >
				 <br>
					<input type="tel" name="user_tel" class="form-control" maxlength="10" placeholder="เบอร์โทร" >
					<br>
					  <select class="form-control" name="user_fan" >
					    <option value=" ">สถานะ :</option>
					    <option value="โสด">โสด</option>
					    <option value="มีแฟนแล้ว">มีแฟนแล้ว</option>
							<option value="สมรส">สมรส</option>
							<option value="อย่าร้าง">อย่าร้าง</option>
							<option value="แยกกันอยู่">แยกกันอยู่</option>
					  </select>
					<br>
					<input type="file" name="user_img" class="form-control" required>
					<br>
					<input type="text" name="user2_rank" class="form-control" placeholder="ตำแหน่ง" required>
					<br>
					<select class="form-control" name="user2_rankcheak" >
						<option value=" ">ส่วนงาน :</option>
						<option value="Manager">Manager</option>
						<option value="Teacher">Teacher</option>
						<option value="User">User</option>
						<option value="Developers">Developers</option>
					</select>
				<br>
	        <label>วันที่เริ่มทำงาน</label>
	        <input type="date" name="user2_start" class="form-control" required>
					<br>
					<select class="form-control" name="user2_room">
					 <option value=" ">ประจำชั้น :</option>
					 <?php
							foreach ($crom as $classroom){

							?>
							 <option value="<?=$classroom['cr_name']?>"><?=$classroom['cr_name']?></option>
						<?php  } ?>
						 <option value="ส่วนงานอื่น">ส่วนงานอื่น</option>
				 </select>
					<br>
						<select class="form-control" name="user2_working">
	 					 <option value=" ">สถานะการทำงาน :</option>
	 					 <option value="ยังปฏิบัติงาน">ยังปฏิบัติงาน</option>
	 					 <option value="พักงาน">พักงาน</option>
						 <option value="ออกจากงาน">ออกจากงาน</option>
	 				 </select>
					 <br>
					<input type="text" name="user2_spouse" class="form-control"  placeholder="ชื่อ-นามสกุลคู่สมรส" >
					<br>
					<input type="text" name="user2_telspouse" class="form-control"  placeholder="เบอร์โทรคู่สมรส" >
					<br>
					<input type="text" name="user2_child" class="form-control"  placeholder="จำนวนบุตร" >
					<br>

	      </div>

	      <!-- Modal footer -->
	      <div class="modal-footer">
	        <button type="button" class="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
	        <button type="submit" name="Submit" class="btn btn-primary">เพิ่ม</button>

	      </div>

	 	</form>

	    </div>
	  </div>
	</div>
