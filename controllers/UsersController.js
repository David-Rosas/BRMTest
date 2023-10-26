const User = require("../models/User");
const randomCode = require("../helpers/randomCode");
var jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;
const bcryptjs = require("bcryptjs");
const Role = require("../models/Rol");

module.exports = {
  async RegisterUser(data, res) {
    try {
      let checkUserData = await User.findOne({
        where: { email: data.body.email },
      });

      if (checkUserData !== null) {
        res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "The email address is already registered.",
              path: "email",
              location: "body",
            },
          ],
        });
      } else {
        //encriptacion de contraseña
        const passwordHast = await bcryptjs.hash(data.body.password, 10);
        User.create({
          name: data.body.name,
          email: data.body.email,
          rol_id: data.body.rol_id,
          password: passwordHast,
        })
          .then((user) =>
            res.status(201).send({
              id: user.id,
              firstName: user.firstName,
              email: user.email,
            })
          )
          .catch((error) => {
            console.log(error);
            res.status(400).send(error);
          });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  async LoginUser(data, res) {
    try {
      const user = await User.findOne({
        where: { email: data.body.email },
        include: Role,
      });

      if (user !== null) {
        

        if (data.body.email == user.dataValues.email) {
          if (
            await bcryptjs.compare(data.body.password, user.dataValues.password)
          ) {
            var token = jwt.sign({ idUser: user.dataValues.id,  role: user.role.dataValues.name}, secretJWT);
            
            res.status(200).send({
              status: "success",
              message: "Login was successful for the user.",
              userData: {
                email: user.dataValues.email,
                name: user.dataValues.name,
                role: user.role.dataValues.name,
                token,
              },
            });
          } else {
            res.status(400).send({
              errors: [
                {
                  type: "field",
                  value: "",
                  msg: "Incorrect password.",
                  path: "password",
                  location: "body",
                },
              ],
            });
          }
        } else {
          res.status(400).send({
            errors: [
              {
                type: "field",
                value: "",
                msg: "Incorrect email address.",
                path: "email",
                location: "body",
              },
            ],
          });
        }
      } else {
        res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async validateUserToken(data, res) {
    try {
      const token = data.get("Authorization").split(" ")[1];
      if (token) {
        jwt.verify(token, secretJWT, async function (err, decoded) {
          let checkUserData = await User.findOne({
            where: { id: decoded.idUser },
            attributes: ["id", "name", "email"],
          });
          if (checkUserData.dataValues) {
            res.json({
              status: "success",
              data: checkUserData.dataValues,
              message: "Token validado correctamente",
            });
          }
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async generateCodeRecover(data, res) {
    try {
      let checkUserData = await User.findOne({
        where: { email: data.body.email },
      });

      if (checkUserData.dataValues) {
        let codeGenerate = randomCode.generateCodeRandom(30);
        let updateData = User.update(
          { codeRecover: codeGenerate },
          { where: { email: data.body.email } }
        );

        res.status(200).send({
          status: "success",
          message: "Recovery code generated correctly",
          code: codeGenerate,
        });
      } else {
        res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },

  async validateRecoverCode(data, res) {
    try {
      let checkUserData = User.findOne({ where: { email: data.body.email } });
      if (checkUserData.dataValues) {
        if (data.body.code == checkUserData.dataValues.codeRecover) {
          let codeGenerate = randomCode.generateCodeRandom(5);
          let updateData = User.update(
            { password: data.body.newPassword, codeRecover: codeGenerate },
            { where: { email: data.body.email } }
          );
          res.status(200).send({
            status: "success",
            message: "The password has been changed successfully",
          });
        } else {
          res.status(400).send({
            errors: [
              {
                type: "field",
                value: "",
                msg: "The code is incorrect",
                path: "code",
                location: "body",
              },
            ],
          });
        }
      } else {
        res.status(400).send({
          errors: [
            {
              type: "field",
              value: "",
              msg: "No user found with this email.",
              path: "email",
              location: "body",
            },
          ],
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error en servidor" });
    }
  },
};
