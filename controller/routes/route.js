const express = require('express');
const moment = require('moment');
const connection = require('../../model/database');
const router = express.Router();
let username = '';
let mail = '';
let pass = '';
let input = '';
router.get('/', (req, res) => {
  console.log('Hi login');
  res.render('login', { success: '' });
});
router.get('/Register', (req, res) => {
  console.log('Hi Register');
  res.render('register');
});
router.get('/Login', (req, res) => {
  console.log('Hi login');
  res.render('Login', { success: '' });
});

/* admin */
router.get('/admin/dashboard', (req, res) => {
  res.render('admin_dashboard', { userData: username });
});
router.get('/admin/add_faculty', (req, res) => {
  res.render('add_faculty', { userData: username, success: '' });
});
router.get('/admin/add_student', (req, res) => {
  res.render('add_student', { userData: username, success: '' });
});
router.get('/admin/add_subject', (req, res) => {
  connection.query('select firstname,lastname from faculty ', (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.render('add_subject', {
        userData: username, faculty: results, success: ''
      });
    }
  });
});
router.get('/student/subject_info', (req, res) => {
  res.render('subject_info', { userData: username, subjectData: '', sem: '' });
});
router.get('/admin/faculty_subject', (req, res) => {
  res.render('faculty_subject', {
    userData: username, subjectData: '', sem: '', success: '',
  });
});


router.get('/admin/subject/edit/:sub_code', (req, res) => {
  connection.query('select * from subject where sub_code=?', [req.params.sub_code], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Subject Selected');
      res.render('edit_subject', { userData: username, subjectData: results, success: '' });
    }
  });
});
router.get('/student/class_student', (req, res) => {
  connection.query('select  count(*) as strength  from student ', (err, count) => {
    if (err) throw err;
    if (count.length > 0) {
      console.log(count);
      connection.query('select count(*) as male from student  where gender= "Male" ', (err, male) => {
        console.log(male);
        connection.query('select count(*) as female from student  where gender= "Female" ', (err, female) => {
          console.log(female);
          connection.query('select *  from class ', (err, classinfo) => {
            res.render('class_student', {
              class_info: classinfo, scount: count[0].strength, male_count: male[0].male, female_count: female[0].female, userData: username,
            });
          });
        });
      });
    }
  });
});
router.get('/admin/class_admin', (req, res) => {
  connection.query('select  count(*) as strength  from student ', (err, count) => {
    if (err) throw err;
    if (count.length > 0) {
      console.log(count);
      connection.query('select count(*) as male from student  where gender= "Male" ', (err, male) => {
        console.log(male);
        connection.query('select count(*) as female from student  where gender= "Female" ', (err, female) => {
          console.log(female);
          connection.query('select *  from class ', (err, classinfo) => {
            res.render('class_admin', {
              class_info: classinfo, scount: count[0].strength, male_count: male[0].male, female_count: female[0].female, userData: username,
            });
          });
        });
      });
    }
  });
});
router.post('/admin/subject/edit', (req, res, next) => {
  const { subcode } = req.body;
  const { subname } = req.body;
  const { credit } = req.body;
  const classIT = req.body.class;
  const { sem } = req.body;
  const { faculty_name } = req.body;
  const { position } = req.body;
  const values = [subcode, subname, credit, classIT, sem, faculty_name, position, subcode];
  const sql = 'UPDATE subject SET sub_code=?,sub_name=?,credit=?,class=?,sem=?,faculty_name=?,pos=? where sub_code= ?';
  connection.query(sql, values, (err, result) => {
  });
  connection.query('select * from subject where sub_code=?', [subcode], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Subject Selected');
      console.log(results);
      res.render('edit_subject', { userData: username, subjectData: results, success: 'Updated Successfully' });
    }
  });
});
router.get('/admin/subject/delete/:sub_code', (req, res) => {
  connection.query('delete from subject where sub_code=?', [req.params.sub_code], (err, results) => {
    if (err) throw err;
    console.log('subject deleted');
    const sem = input;
    connection.query('select * from subject where sem=? order by credit DESC', [sem], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        console.log('Subject Selected');
        res.render('faculty_subject', { subjectData: results, userData: username, sem: input });
      }
    });
  });
});
/* Student */
router.get('/student/dashboard', (req, res) => {
  res.render('student_dashboard', { userData: username });
});
router.get('/admin/students_list', (req, res) => {
  connection.query('select * from student order by rollno ', (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Students records displayed');
      res.render('students_list', { studentData: results, userData: username });
    }
  });
});
router.post('/admin/semester', (req, res) => {
  input = req.body.semester;
  connection.query('select * from subject where sem=? order by credit DESC', [input], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Subject Selected');
      res.render('faculty_subject', { subjectData: results, userData: username, sem: input });
    }
  });
});
router.post('/student/semester', (req, res) => {
  const inputsem = req.body.semester;
  connection.query('select * from subject where sem=?', [inputsem], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Subject Selected');
      res.render('subject_info', { subjectData: results, userData: username, sem: inputsem });
    }
  });
});

//LOGIN
router.post('/user/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email == "" && password ==""){
    setTimeout(() => {
      res.render('Login', { success: 'Enter your email and password' });
    }, 2000);
  }
  else if(email == ""){
    setTimeout(() => {
      res.render('Login', { success: 'Enter your email' });
    }, 2000);
  }
  else if(password == ""){
    setTimeout(() => {
      res.render('Login', { success: 'Enter your password' });
    }, 2000);
  }

  if (email && password) {
    const re = /\d/g;
    if (re.test(`${email}`)) {
      connection.query('select sname,semail from student_signup where semail = ? AND spassword=?', [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          console.log('Login Successfully');
          username = results[0].sname;
          mail = results[0].semail;
          console.log(results);
          connection.query('select count(*) as count from faculty', (err, faculty_count) => {
            var users= faculty_count[0].count + 33;
          res.render('student_dashboard', { userData: username ,count: faculty_count[0].count, user : users});         
          });
        } else {
          setTimeout(() => {
            res.render('Login', { success: 'Please try Again' });
          }, 2000);
        }

      });
    } else {
      connection.query('select fname,femail from faculty_signup where femail = ? AND fpassword=?', [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          console.log('Login Successfully');
          username = results[0].fname;
          mail = results[0].femail;
          console.log(results);
          connection.query('select count(*)as count from faculty', (err, faculty_count) => {
            var users= faculty_count[0].count + 33;
          res.render('admin_dashboard', { userData: username ,f_count: faculty_count[0].count, user : users});
          });
        } else {
          setTimeout(() => {
            res.render('Login', { success: 'Please try Again' });
          }, 2000);
        }
      });
    }
  }
  else {
    setTimeout(() => {
      res.render('Login', { success: 'Enter your valid credentials' });
    }, 2000);
  }
});
router.post('/user_signup', (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const pass = req.body.pwd1;
  const re = /\d/g;
  if (re.test(`${email}`)) {
    connection.query('insert into student_signup values(?,?,?)', [name, email, pass], (err, results) => {
      if (err) throw err;
      if (name.length != 0) {
        console.log('Values Inserted');
        setTimeout(() => {
          res.render('Login', { success: '' });
        }, 2000);
      } else {
        setTimeout(() => {
          res.render('register');
        }, 2000);
      }
    });
  } else {
    connection.query('insert into faculty_signup values(?,?,?)', [name, email, pass], (err, results) => {
      if (err) throw err;
      if (name.length != 0) {
        console.log('Values Inserted');
        setTimeout(() => {
          res.render('Login', { userData: username, success: '' });
        }, 2000);
      } else {
        setTimeout(() => {
          res.render('register');
        }, 2000);
      }
    });
  }
});
router.post('/add_student', (req, res) => {
  console.log('validated');
  const { fname } = req.body;
  const { lname } = req.body;
  const { rollno } = req.body;
  const { regno } = req.body;
  const { batch } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { hos_day } = req.body;
  const { gender } = req.body;
  const { address } = req.body;
  const { mobno } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { pincode } = req.body;
  connection.query('insert into student values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [fname, lname, rollno, regno, email, dob, hos_day, gender, address, mobno, city, state, pincode, batch], (err, results) => {
    if (err) throw err;
    if (results) {
      console.log('Student Inserted');
      res.render('add_student', { userData: username, success: 'Successfully Added!' });
    }
  });
});
router.post('/add_faculty', (req, res) => {
  console.log('validated');
  const { fname } = req.body;
  const { lname } = req.body;
  const { department } = req.body;
  const { position } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { gender } = req.body;
  const { address } = req.body;
  const { mobno } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { pincode } = req.body;
  connection.query('insert into faculty values(?,?,?,?,?,?,?,?,?,?,?,?)', [fname, lname, department, position, email, dob, gender, address, mobno, city, state, pincode], (err, results) => {
    if (err) throw err;
    if (results) {
      console.log('Faculty Inserted');
      res.render('add_faculty', { userData: username, success: 'Successfully Added!' });
    }
  });
});
router.post('/add-subject', (req, res) => {
  console.log('validated');
  const { subcode } = req.body;
  const { subname } = req.body;
  const { credit } = req.body;
  const classIT = req.body.class;
  const { sem } = req.body;
  const { faculty_name } = req.body;
  const { position } = req.body;
  connection.query('insert into subject values(?,?,?,?,?,?,?)', [subcode, subname, credit, classIT, sem, faculty_name, position], (err, results) => {
    if (err) throw err;
    if (results) {
      console.log('Subject Inserted');
      res.render('add_subject', { userData: username, success: 'Successfully Added!' });
    }
  });
});
router.get('/student/profile', (req, res) => {
  connection.query('select * from student where email = ? ', [mail], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('My profile');
      username = results[0].firstname;
      res.render('student_profile', { userData: results, name: username, success: '' });
    }
  });
});
router.get('/admin/faculty_profile', (req, res) => {
  connection.query('select * from faculty where email = ? ', [mail], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('My profile');
      username = results[0].firstname;
      res.render('faculty_profile', { userData: results, name: username, success: '' });
    }
  });
});
router.post('/admin/update', (req, res, next) => {
  const { fname } = req.body;
  const { lname } = req.body;
  const { department } = req.body;
  const { position } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { address } = req.body;
  const { mobno } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { pincode } = req.body;
  const values = [fname, lname, department, position, email, dob, address, mobno, city, state, pincode, mail];
  const sql = 'UPDATE faculty SET firstname =?,lastname=?,department=?,position=?,email=?,dob=?,address=?,mobileno=?,city=?,state=?,pincode=? where email= ?';
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('updated');
    username = result.firstname;
    console.log(username);
    connection.query('select * from faculty where email=?', [email], (err, results) => {
      console.log(results);
      res.render('faculty_profile', { userData: results, name: results[0].firstname, success: 'Profile Updated Successfully!' });
    });
  });
});
router.post('/student/update', (req, res, next) => {
  const { fname } = req.body;
  const { lname } = req.body;
  const { rollno } = req.body;
  const { regno } = req.body;
  const { batch } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { hos_day } = req.body;
  const { address } = req.body;
  const { mobno } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { pincode } = req.body;
  const values = [fname, lname, rollno, regno, email, dob, hos_day, address, mobno, city, state, pincode, batch, mail];
  const sql = 'UPDATE student SET firstname =?,lastname=?,rollno=?,regno=?,email=?,dob=?,hos_day=?,address=?,mobileno=?,city=?,state=?,pincode=?,batch=? where email= ?';
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('updated');
    username = result.firstname;
    connection.query('select * from student where email=?', [email], (err, results) => {
      res.render('student_profile', { userData: results, name: results[0].firstname, success: 'Profile Updated Successfully!' });
    });
  });
});
router.get('/admin/faculty', (req, res) => {
  connection.query('select * from faculty ', (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      console.log('Faculty List displayed');
      res.render('faculty', { facultyData: results, userData: username });
    }
  });
});
router.get('/admin/faculty/delete/:email', (req, res) => {
  connection.query('delete from faculty where email=?', [req.params.email], (err, results) => {
    if (err) throw err;
    console.log('Faculty deleted');
    res.redirect('/admin/faculty');
  });
});
module.exports = router;
