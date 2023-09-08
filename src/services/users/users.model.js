module.exports = class UserModel {
  constructor(model) {
    this.model = model;
  }

  async getUserById(id) {
    return this.model.findByPk(id);
  }

  async getUser(where, attributes = null, include = []) {
    const user = await this.model.findOne({ where, attributes, include });
    return user;
  }

  async createUser(user) {
    const newUser = await this.model.create(user);
    return newUser;
  }

  async updateUser(update, where) {
    return this.model.update(update, { where, returning: true });
  }

  async countUsers(where, include = null) {
    return this.model.count({
      where,
      distinct: true,
      include,
    });
  }

  async getUsers(
    where = null,
    attributes = null,
    limit = null,
    offset = null,
    include = null,
    order = null
  ) {
    return this.model.findAll({
      where,
      attributes,
      limit,
      offset,
      include,
      order,
      distinct: true,
    });
  }

  async getSingleUser(where, include) {
    return this.model.findOne({
      where,
      include,
    });
  }

  async deleteUser(where) {
    return this.model.destroy({ where });
  }

  async updateRecoverCode(recoveryCode, where) {
    try {
      return this.model.update(recoveryCode, { where, returning: true });
    } catch (error) {
      console.error("Error updating recovery code: ", error);
      throw error;
    }
  }

  async updatePassword(passwordHash, where) {
    return this.model.update(passwordHash, { where, returning: true });
  }
};
