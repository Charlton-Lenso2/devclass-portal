const bcrypt = require("bcrypt");
const prisma = require("../config/db");

// GET /api/users/me — any logged-in user's own profile
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;
    const data = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);
    if (avatar !== undefined) data.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    res.json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" });
    }
    next(err);
  }
}

// GET /api/users — admin only, view all students
async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, getAllUsers };
