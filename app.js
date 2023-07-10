const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aptech'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
  
    console.log('Connected to the database.');
  });


  class Student {
    constructor(name, age, grade) {
      this.name = name;
      this.age = age;
      this.grade = grade;
    }
  }


    // CREATE operation
    Student.create = (student, callback) => {
    const query = 'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)';
    const values = [student.name, student.age, student.grade];
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error creating a student: ', err);
        callback(err);
        return;
      }
  
      console.log('Student created successfully.');
      callback(null, results.insertId);
    });
  };
  

  const newStudent = new Student('lvtien2', 38, 'B');

  Student.create(newStudent, (err, insertedId) => {
    if (err) {
      console.error('Error creating a student:', err);
      return;
    }
  
    console.log('Inserted student ID:', insertedId);
});





Student.getById = (id, callback) => {
    const query = 'SELECT * FROM students WHERE id = ?';
  
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error retrieving a student: ', err);
        callback(err);
        return;
      }
  
      if (results.length === 0) {
        console.log('Student not found.');
        callback(null, null);
        return;
      }
  
      const studentData = results[0];
      const student = new Student(studentData.name, studentData.age, studentData.grade);
      console.log('Student retrieved successfully.');
      callback(null, student);
    });
  };


  Student.getById(3, (err, retrievedStudent) => {
    if (err) {
      console.error('Error retrieving a student:', err);
      return;
    }

    console.log('Retrieved student:', retrievedStudent);
})



connection.end((err) => {
    if (err) {
      console.error('Error closing the database connection: ', err);
      return;
    }
  
    console.log('Database connection closed.');
  });