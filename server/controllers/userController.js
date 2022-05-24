const mysql = require("mysql");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query("SELECT * FROM users", (err, rows) => {
      connection.release();

      if(!err) {
        let removedUser = req.query.removed;
        res.render("home", { rows, removedUser });
      } else {
        console.log(err);
      }

      console.log("The data from the user table: \n ", rows);
    });
  });
};

// Find user by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;

    connection.query(
      "SELECT * FROM users WHERE FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        connection.release();

        if(!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from the user table: \n ", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

// Add new user
exports.create = (req, res) => {
  const {
    FirstName,
    LastName,
    Username,
    Password,
    Email,
    HomeNumber,
    MobileNumber,
    NoteTitle,
    NoteDescription,
    NoteDate,
  } = req.body;

  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;

    connection.query(
      "INSERT INTO users SET FirstName = ?, LastName = ?, Username = ?, Password = ?, Email = ?, HomeNumber = ?, MobileNumber= ?, NoteTitle = ?, NoteDescription = ?, NoteDate = ?",
      [
        FirstName,
        LastName,
        Username,
        Password,
        Email,
        HomeNumber,
        MobileNumber,
        NoteTitle,
        NoteDescription,
        NoteDate,
      ],
      (err, rows) => {
        connection.release();

        if(!err) {
          res.render("add-user", {
            alert: "SUCCESS! User Added Successfully..",
          });
        } else {
          console.log(err);
        }

        console.log("The data from the user table: \n ", rows);
      }
    );
  });
};

// Edit User
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();

        if(!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from the user table: \n ", rows);
      });
  });
};

// Update User
exports.update = (req, res) => {
  const {
    FirstName,
    LastName,
    Username,
    Email,
    HomeNumber,
    MobileNumber,
    NoteTitle,
    NoteDescription
  } = req.body;

  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "UPDATE users SET FirstName = ?, LastName = ?, Username = ?, Email = ?, HomeNumber = ?, MobileNumber = ?, NoteTitle = ?, NoteDescription = ? WHERE id = ?",
      [
        FirstName,
        LastName,
        Username,
        Email,
        HomeNumber,
        MobileNumber,
        NoteTitle,
        NoteDescription,
        req.params.id
      ],
      (err, rows) => {
        connection.release();
        if(!err) {
          pool.getConnection((err, connection) => {
            if(err) throw err;
            console.log("Connected as ID" + connection.threadId);

            connection.query(
              "SELECT * FROM users WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                connection.release();

                if(!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `SUCCESS! ${FirstName} Has been updated!`,
                  });
                } else {
                  console.log(err);
                }

                console.log("The data from the user table: \n ", rows);
              }
            );
          });
        } else {
          console.log(err);
        }

        console.log("The data from the user table: \n ", rows);
      }
    );
  });
};


// Delete User
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if(!err) {
          let removedUser = encodeURIComponent('User successfully removed.')
          res.redirect('/?removed=' + removedUser);
        } else {
          console.log(err);
        }

        console.log("The data from the user table: \n ", rows);
      });
  });
};

// View User
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err;
    console.log("Connected as ID" + connection.threadId);

    connection.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, rows) => {
      connection.release();

      if(!err) {
        res.render("view-user", { rows });
      } else {
        console.log(err);
      }

      console.log("The data from the user table: \n ", rows);
    });
  });
};