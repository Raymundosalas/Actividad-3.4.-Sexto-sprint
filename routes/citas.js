const express = require("express");
const router = express.Router();
const db = require("../database");


// OBTENER CITAS
router.get("/", (req, res) => {

    const sql = `
    SELECT citas.id,
           pacientes.nombre,
           citas.fecha,
           citas.hora,
           citas.observaciones
    FROM citas
    INNER JOIN pacientes
    ON citas.paciente_id = pacientes.id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// CREAR CITA
router.post("/", (req, res) => {

    const { paciente_id, fecha, hora, observaciones } = req.body;

    // VALIDAR DUPLICADO
    db.query(
        "SELECT * FROM citas WHERE fecha=? AND hora=?",
        [fecha, hora],
        (err, rows) => {

            if (rows.length > 0) {
                return res.status(400).json({
                    mensaje: "Horario ocupado"
                });
            }

            const sql = `
                INSERT INTO citas
                (paciente_id, fecha, hora, observaciones)
                VALUES (?, ?, ?, ?)
            `;

            db.query(sql,
                [paciente_id, fecha, hora, observaciones],
                (err, result) => {

                    if (err) return res.status(500).json(err);

                    res.json({
                        mensaje: "Cita creada",
                        id: result.insertId
                    });
                });
        });
});


// ELIMINAR
router.delete("/:id", (req, res) => {

    db.query(
        "DELETE FROM citas WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                mensaje: "Cita eliminada"
            });
        });
});

module.exports = router;
