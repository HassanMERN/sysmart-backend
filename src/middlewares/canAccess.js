const { sendErrorResponse } = require('../utils/sendResponse');
const UserModel = require('../services/users/users.model');
const RoleModel = require('../services/roles/roles.model');
const PermissionModel = require('../services/permissions/permissions.model');
const DBInitializer = require('../../db/connection');

module.exports = (permission) => async (req, res, next) => {
  let db = await DBInitializer();
  const User = new UserModel(db.models.User);
  const Role = new RoleModel(db.models.Role);
  const Permission = new PermissionModel(db.models.Permission);
  const { user } = req;

  const attributes = {
    exclude: ['createdAt', 'updatedAt'],
  };
  const include = [
    {
      model: db.models.Role,
      as: 'roles',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: db.models.Permission,
          as: 'permissions',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    },
  ];


  const authUser = await User.getUser(
    { id: user.user_id },
    attributes,
    include
  );


  const user_roles_permissions = await authUser.roles[0].permissions.map(
    (permission) => permission.name
  );
  console.log('user_roles_permissions>>>>>>>>>>>>', user_roles_permissions);
  if (user_roles_permissions.includes(permission)) {
    return next();
  }
  console.error('You do not have the authorization to access this.');
  return sendErrorResponse(
    res,
    403,
    'You do not have the authorization to access this'
  );
};
