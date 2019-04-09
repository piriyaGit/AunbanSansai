<?php
  $id=$_REQUEST['id'];
  $sql = "SELECT * FROM tb_home WHERE id= '$id'";
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  $showroom = mysqli_fetch_array($res);
  extract($showroom);
 ?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">แก้ไขข้อมูลอาคาร</h3>
            </div>
            <div class="box-body">

       <form method="post" action="page/home/homeadd.php?id=<?=$id?>"  enctype="multipart/form-data">
		            <table class="table table-bordered">
		              <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปภาพ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="file" name="home_pic" class="form-control"  ></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อสถานที่</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="home_name" class="form-control" value="<?=$showroom['home_name']?>"  >
                      <br>
                      <button type="submit" name="Submit" class="btn btn-primary">ยืนยัน</button>
                    </td>

		              </tr>
		            </table>
  	 	</form>
            <br>
        </div>
  </div>
</section>
