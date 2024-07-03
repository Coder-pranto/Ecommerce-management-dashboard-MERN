const UserType = require('../Models/userType');

class UserTypeController {
  async getAlluserTypes(req, res) {
    try {
      const userType = await UserType.find({}, { name: 1 });
      res.status(200).send(userType);
    } catch (error) {
      res.status(500).send({ error: 'An error occurred' });
    }
  }
}

module.exports = new UserTypeController();
