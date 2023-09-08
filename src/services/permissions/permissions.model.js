module.exports = class PermissionModel {

  constructor(model) {
    this._model = model;
  }

  async createPermission(permission) {
    return this._model.create(permission);
  }


  async getPermissionById(id, attributes) {
    return this._model.findByPk(id);
  }

  async getPermission(where, attributes, include = null) {
    return this._model.findOne({ where, attributes, include });
  }

  async getPermissions(where = null, attributes = null) {
    return this._model.findAll({ where, attributes });
  }

  async updatePermission(update, where) {
    return this._model.update(update, { where, returning: true });
  }

};
