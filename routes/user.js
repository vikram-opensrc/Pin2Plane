exports.login = function(req, res){
   var message = '';
   var sess = req.session; 
   var md5 = require('md5');
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= md5(post.password);
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){	  
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
			req.session.save();
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }         
};

exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
	  var md5 = require('md5');
      var post  = req.body;
      var name= post.user_name;
      var pass= md5(post.password);
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};

exports.dashboard = function(req, res, next){
	
	var user =  req.session.user,
	userId = req.session.userId;
	if(userId == null){
		res.redirect("/login");
		return;
	}else{		   
		 res.render('profile.ejs', {user:user});	  
		}	 
};

exports.user_details = function(req, res, next){
	var u_id=req.params.u_id;
	console.log("user_id is: "+u_id);
	console.log(req.session);
	var sql="SELECT * FROM `users` WHERE `id`="+u_id;                           
	db.query(sql, function(err, results){	  
	 if(results.length){
		var user=results[0];
		if(req.session.msg){
			user.msg=req.session.msg;
		}
		res.render('user_details.ejs', {user:user});
	 }
	 else{
		console.log(err);
		res.render('index.ejs');
	 }        
    });
};

exports.user_edit = function(req, res, next){
	var post=req.body;
	console.log(post);
	var id=req.params.u_id
	var name= post.user_name;
    var fname= post.first_name;
    var lname= post.last_name;
    var mob= post.mob_no;

	var sql="UPDATE `users` SET first_name='"+fname+"',last_name='"+lname+"',mob_no='"+mob+"',user_name='"+name+"' WHERE id="+id;
	db.query(sql, function(err, results){	  
		 if(results.length){
			req.session.msg="User details saved sucessfully.";
			req.session.save();
			res.redirect('/user/'+id);
		 }
		 else{
			console.log(err);
			req.session.msg="Error saving user details!!!";
			req.session.save();
			res.redirect('/user/'+id);
		 }
	});
};

exports.user_delete = function(req, res, next){
	var u_id=req.params.u_id;
	var sql="DELETE FROM `users` WHERE id="+u_id;
	db.query(sql);
	req.session.destroy();
	res.render('index.ejs');
};


exports.logout = function(req, res, next){	
  req.session.destroy(function(err) {
	  if(err) {
		console.log(err);
	  } else {
		res.redirect('/');
	  }
	}); 
};