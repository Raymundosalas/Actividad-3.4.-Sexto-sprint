const express = require("express");
const router = express.Router();
const db = require("../database");


// OBTENER PACIENTES
router.get("/", (req, res) => {
    db.query("SELECT * FROM pacientes", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// CREAR PACIENTE
router.post("/", (req, res) => {

    const { nombre, telefono, correo, observaciones } = req.body;

    const sql = `
        INSERT INTO pacientes(nombre, telefono, correo, observaciones)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql,
        [nombre, telefono, correo, observaciones],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                mensaje: "Paciente agregado",
                id: result.insertId
            });
        });
});


// ELIMINAR
router.delete("/:id", (req, res) => {

    db.query(
        "DELETE FROM pacientes WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                mensaje: "Paciente eliminado"
            });
        });
});

module.exports = router;
