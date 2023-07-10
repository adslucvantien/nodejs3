const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());


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




app.post('/students', (req, res) => {
  const { name, age, grade } = req.body;
  const student = new Student(name, age, grade);

  const query = 'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)';
  const values = [student.name, student.age, student.grade];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating a student: ', err);
      res.status(500).json({ error: 'Failed to create student.' });
      return;
    }

    console.log('Student created successfully.');
    res.status(201).json({ id: results.insertId });
  });
});



// READ operation
app.get('/students/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM students WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error retrieving a student: ', err);
      res.status(500).json({ error: 'Failed to retrieve student.' });
      return;
    }

    if (results.length === 0) {
      console.log('Student not found.');
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    const studentData = results[0];
    const student = new Student(studentData.name, studentData.age, studentData.grade);
    console.log('Student retrieved successfully.');
    res.json(student);
  });
});




// UPDATE operation
app.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, grade } = req.body;
  const newData = new Student(name, age, grade);

  const query = 'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?';
  const values = [newData.name, newData.age, newData.grade, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating a student: ', err);
      res.status(500).json({ error: 'Failed to update student.' });
      return;
    }

    if (results.affectedRows === 0) {
      console.log('Student not found.');
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    console.log('Student updated successfully.');
    res.json({ success: true });
  });
});




// DELETE operation
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM students WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting a student: ', err);
      res.status(500).json({ error: 'Failed to delete student.' });
      return;
    }

    if (results.affectedRows === 0) {
      console.log('Student not found.');
      res.status(404).json({ error: 'Student not found.' });
      return;
    }

    console.log('Student deleted successfully.');
    res.json({ success: true });
  });
});






// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const closeConnection = () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing the database connection: ', err);
      return;
    }

    console.log('Database connection closed.');
  });
};


