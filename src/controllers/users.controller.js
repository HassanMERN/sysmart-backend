const { Op } = require("sequelize");
const { hash } = require("../utils/hashing");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const UserModel = require("../services/users/users.model");
const RoleModel = require("../services/roles/roles.model");
const PermissionsModel = require("../services/permissions/permissions.model");

const constants = require("../utils/constants");

/**
 * Description of the users controller.
 * @module users.controller
 * @type {{users:Function}}
 * @type {{createContact:Function}}
 * @type {{deleteContact:Function}}
 * @type {{getUserContacts:Function}}
 * @type {{updateContactbyId:Function}}
 */

module.exports = {
  /**
   * Description of the users controller. This function lets you retreive all the users.
   * @function users
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @return {sendErrorResponse|sendSuccessResponse}
   */

  async users(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      return sendSuccessResponse(
        res,
        200,
        await User.getUsers(),
        "All registered users"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  /**
   * Description of the createUsers controller. This function lets you create a new user.
   * @function createUser
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @return {sendErrorResponse|sendSuccessResponse}
   */

  async createUser(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      const Role = new RoleModel(db.models.Role);
      const Permission = new PermissionsModel(db.models.Permission);
      const { email, password, fullName, role } = req.body;
      let where = {
        email,
      };
      let user = await User.getUser(where);
      if (user && user.length) {
        return sendErrorResponse(
          res,
          422,
          "User with that email already exists"
        );
      }
      let newUser = await User.createUser({
        fullName,
        email,
        passwordHash: hash(password),
      });
      console.log("newUser>>>>>>>>>.", newUser);
      const userRole = await Role.getRole({
        name: role,
      });
      console.log("userRole>>>>>>>>>>>", userRole);

      const allPermissions = await Permission.getPermissions();
      if (userRole.name == constants.ROLE_SUPER_ADMIN) {
        const assignPermissionsToRole = await userRole.addPermissions(
          allPermissions
        );

        console.log(
          "assignPermissionsToRole>>>>>>>>>>>",
          assignPermissionsToRole
        );

        const assignedRole = await newUser.addRole(userRole);
        console.log("assigned>?>>>>>>>>>>>>.", assignedRole);
      }

      if (userRole.name == constants.ROLE_ADMIN) {
        let permissionsToAssign = [];
        for (const permission of allPermissions) {
          if (!permission.name.includes("delete")) {
            permissionsToAssign.push(permission);
          }
        }
        console.log("permissionsToAssign>>>>>>>>>>.", permissionsToAssign);
        const assignPermissionsToRole = await userRole.addPermissions(
          permissionsToAssign
        );
        console.log("assignPermissionsToRole>>>>>..", assignPermissionsToRole);

        const assignedRole = await newUser.addRole(userRole);
        console.log("assigned>?>>>>>>>>>>>>.", assignedRole);
      }

      if (userRole.name == constants.ROLE_USER) {
        let permissionsToAssign = [];
        for (const permission of allPermissions) {
          if (
            !permission.name.includes("delete") &&
            !permission.name.includes("update")
          ) {
            permissionsToAssign.push(permission);
          }
        }
        console.log("permissionsToAssign>>>>>>>>>>.", permissionsToAssign);
        const assignPermissionsToRole = await userRole.addPermissions(
          permissionsToAssign
        );
        console.log("assignPermissionsToRole>>>>>..", assignPermissionsToRole);

        const assignedRole = await newUser.addRole(userRole);
        console.log("assigned>?>>>>>>>>>>>>.", assignedRole);
      }
      return sendSuccessResponse(
        res,
        201,
        newUser.dataValues,
        "Account created successfully"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  /**
   * Description of the getUserById controller. This function lets you retreive the user with specified id.
   * @function getUserById
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @param {id} id - The id passed in the parameters
   * @return {sendErrorResponse|sendSuccessResponse}
   */

  async getUserById(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      return sendSuccessResponse(
        res,
        201,
        await User.getUserById(req.params.id),
        "A User data"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  /**
   * Description of the getUserByEmail controller. This function lets you retreive the user with specified email.
   * @function users
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @param {email} enail - The email passed in the parameters
   * @return {sendErrorResponse|sendSuccessResponse}
   */

  async getUserByEmail(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      return sendSuccessResponse(
        res,
        201,
        await User.getUser({ email: req.params.email }),
        "A User data"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  
  /**
   * Description of the updateUser controller. This function lets you update the specified user.
   * @function updateUser
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @return {sendErrorResponse|sendSuccessResponse}
   */
  
  async updateUser(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      const {
        email,
        passwordHash,
        firstName,
        lastName,
        username,
        phone,
        isActive,
        settings,
      } = req.body;
      let where = {
        [Op.or]: [{ email }, { phone }],
      };
      let user = await User.getUser(where);
      if (!user) {
        return sendErrorResponse(
          res,
          422,
          "User with that email or phone does not exist"
        );
      }
      const toBeUpdated = {
        firstName,
        lastName,
        username,
        phone,
        passwordHash: hash(passwordHash),
        settings,
        isActive,
      };
      const updatedUser = await User.updateUser(toBeUpdated, {
        [Op.or]: [{ email }, { phone }],
      });
      return sendSuccessResponse(
        res,
        201,
        updatedUser[1],
        "User Updated Successfully!"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  
  /**
   * Description of the deleteUser controller. This function lets you delete the specified user.
   * @function delete
   * @param {req} req - The coming request
   * @param {res} res - The response object to be sent
   * @return {sendErrorResponse|sendSuccessResponse}
   */
  async deleteUser(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      const existedUser = await User.getUserById(req.params.id);
      if (!existedUser) {
        return sendErrorResponse(res, 422, "User does not exist");
      }
      const deletedUser = await existedUser.destroy();
      return sendSuccessResponse(
        res,
        201,
        deletedUser,
        `User with ID: ${existedUser.id} Deleted Successfully`
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
