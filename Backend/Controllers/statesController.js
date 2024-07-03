const State = require('../Models/state');

class StateController {
  async getAllStates(req, res) {
    try {
      const states = await State.find({}, { name: 1, _id: 1, districts: 1 }).sort({ name: 'asc' });
      res.status(200).send(states);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getState(req, res) {
    try {
      const states = await State.findOne({ _id: req.params.state_id }, { name: 1, _id: 1, districts: 1 });
      res.status(200).send(states);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getStateDistricts(req, res) {
    try {
      const districts = await State.findOne({ _id: req.params.state_id });
      if (districts) {
        res.status(200).send(districts.districts);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async saveState(req, res) {
    try {
      const alreadyState = await State.findOne({ name: req.body.state_name });
      if (!alreadyState) {
        const state = new State({
          name: req.body.state_name,
          districts: req.body.districts
        });
        await state.save();
        res.send({ status: "success", message: "Division Added" });
      }
      if (alreadyState) {
        res.send({ status: "failed", message: "Division Already Added" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async updateState(req, res) {
    try {
      const alreadyState = await State.findOne(
        {
          name: req.body.new_name
        }
      );
      if (alreadyState) return res.send({ status: "failed", message: "Already In Division" });
      const state = await State.findOne(
        {
          _id: req.body.state_id
        }
      );
      const result = await State.findOneAndUpdate(
        { _id: req.body.state_id },
        {
          $set: {
            name: req.body.new_name,
            districts: req.body.districts ? [...state.districts, req.body.districts] : [...state.districts]
          },
          $inc: {
            __v: 1,
          },
        },
        { new: true } // Return the updated document
      );
      if (result) {
        res.send({ status: "success", message: "Division Updated" });
      } else {
        res.send({ status: "failed", message: "Division Not Updated" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async deleteState(req, res) {
    try {
      const result = await State.deleteOne({ _id: req.params.state_id });
      if (result.deletedCount > 0) {
        res.send({ status: "success", message: "Division Is Deleted" });
      } else {
        res.send({ status: "failed", message: "Division Not Deleted" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }
}

module.exports = new StateController();