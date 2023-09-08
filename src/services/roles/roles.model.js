module.exports = class RoleModel {

  constructor(model) {
    this._model = model;
  }

  async createRole(role) {
    return this._model.create(role);
  }

  async getRoleById(id, attributes) {
    return this._model.findByPk(id);
  }

  async getRole(where, attributes, include = []) {
    return this._model.findOne({ where, attributes, include });
  }

  async getRoles(where = null, attributes, transaction = null) {
    return this._model.findAll({ where, attributes, transaction });
  }

  async updateRole(update, where) {
    return this._model.update(update, { where, returning: true });
  }
};
