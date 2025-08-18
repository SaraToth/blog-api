const prisma = require("../prisma/client");


// Gets Admin id (THERE CAN ONLY BE ONE ADMIN)
const getAdminId = async () => {
    const admin = await prisma.user.findFirst({
        where: {
            type: "ADMIN",
        }
    });

    if (!admin) return;

    return admin;
};

module.exports = getAdminId;