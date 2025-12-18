

const validarEmail = {

    emailValidator: (req, res, next) => {

        const email =
            req.body?.data?.email ||
            req.body?.email;

        if (!email) {
            return res.status(400).json({
                error: "El correo es obligatorio"
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Correo electrónico inválido"
            });
        }

        next();
    }
};

module.exports = validarEmail