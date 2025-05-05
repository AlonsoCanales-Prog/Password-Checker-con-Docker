const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const blacklist = fs.readFileSync(path.join(__dirname, '../blacklist.txt'), 'utf-8')
                   .split('\n').map(p => p.trim().toLowerCase());

function analyzePassword(pw) {
  const errors = [];
  if (pw.length < 8) errors.push("Debe tener al menos 8 caracteres");
  if (!/[A-Z]/.test(pw)) errors.push("Debe tener al menos una letra mayúscula");
  if (!/[a-z]/.test(pw)) errors.push("Debe tener al menos una letra minúscula");
  if (!/[0-9]/.test(pw)) errors.push("Debe tener al menos un número");
  if (!/[!@#$%^&*]/.test(pw)) errors.push("Debe tener al menos un símbolo (!@#$%^&*)");
  if (blacklist.includes(pw.toLowerCase())) errors.push("Está en la lista de contraseñas comunes");

  let score = "Fuerte";
  if (errors.length >= 4) score = "Débil";
  else if (errors.length >= 2) score = "Media";

  return { segura: errors.length === 0, score, errores: errors };
}

app.post('/validate', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "No se proporcionó contraseña" });

  const resultado = analyzePassword(password);
  res.json(resultado);
});

app.listen(3000, () => {
  console.log("Password Checker corriendo en puerto 3000");
});
