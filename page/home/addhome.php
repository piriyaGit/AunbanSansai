
	<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
	  เพิ่มข้อมูลอาคาร
	</button>

	<!-- The Modal -->
	<div class="modal fade" id="myModal">
	  <div class="modal-dialog">
	    <div class="modal-content">

	      <!-- Modal Header -->
	      <div class="modal-header">
	        <h4 class="modal-title">เพิ่มข้อมูลอาคาร</h4>
	        <button type="button" class="close" data-dismiss="modal">&times;</button>
	      </div>

	     <form method="post" action="page/room/homeupload.php"  enctype="multipart/form-data">
	      <!-- Modal body -->
	      <div class="modal-body" >

	        <input type="text" name="home_name" class="form-control"  placeholder="ชื่ออาคาร" maxlength="13"  required>
					<br>

					<input type="file" name="user_img" class="form-control" required>

	      <!-- Modal footer -->
	      <div class="modal-footer">
	        <button type="button" class="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
	        <button type="submit" name="Submit" class="btn btn-primary">เพิ่ม</button>

	      </div>

	 	</form>

	    </div>
	  </div>
	</div>
