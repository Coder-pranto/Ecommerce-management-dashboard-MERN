const District = require('../Models/district');
const State = require('../Models/state');

class DistrictsController {
  async saveDistrict(req, res) {
    try {
      const alreadyDistrict = await District.findOne({ name: req.body.name });
      if (!alreadyDistrict && req.body.state_id != 'false') {
        const district = new District({
          name: req.body.name,
          state: req.body.state_id,
          cities: req.body.cities
        });
        const resultDistrict = await district.save();
        const state = await State.findOne(
          {
            _id: req.body.state_id
          }
        );
        const result = await State.findOneAndUpdate(
          { _id: req.body.state_id },
          {
            $set: {
              districts: req.body.name ? [...state.districts, { id: resultDistrict?._id.toString(), name: req.body.name }] : [...state.districts]
            },
            $inc: {
              __v: 1,
            },
          },
          { new: true } // Return the updated document
        );

        res.send({ status: "success", message: "District Added" });
      }
      if (alreadyDistrict) {
        res.send({ status: "failed", message: "District Already Added" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async updateDistrict(req, res) {
    try {
      const alreadyDistrict = await District.findOne({ name: req.body.new_name });
      if (alreadyDistrict) {
        res.send({ status: "failed", message: "Alrady In District" });
      } else {
        const findDistrict = await District.findOne({ _id: req.body.district_id });
        if (findDistrict && req.body.state_id != 'false') {
          function removeObjectWithId(arr, id) {
            const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

            if (objWithIdIndex > -1) {
              arr.splice(objWithIdIndex, 1);
            }
            return arr;
          }

          if (req.body?.state_id && req.body?.state_id != findDistrict.state) {
            const findState = await State.findOne({ _id: findDistrict.state });
            if (findState) {
              findState?.districts?.forEach(async (district) => {
                if (district.id === req.body.district_id) {
                  const newArray = removeObjectWithId(findState.districts, req.body.district_id);
                  await State.findOneAndUpdate(
                    { _id: findDistrict.state },
                    {
                      $set: {
                        districts: newArray
                      },
                      $inc: {
                        __v: 1,
                      },
                    },
                    { new: true } // Return the updated document
                  );
                  const findAlreadyState = await State.findOne({ _id: req.body.state_id });
                  const resultState = await State.findOneAndUpdate(
                    { _id: req.body.state_id },
                    {
                      $set: {
                        districts: [...findAlreadyState.districts, { id: district.id, name: district.name }]
                      },
                      $inc: {
                        __v: 1,
                      },
                    },
                    { new: true } // Return the updated document
                  );
                  const resultDistrict = await District.findOneAndUpdate(
                    { _id: req.body.district_id },
                    {
                      $set: {
                        name: req.body.new_name,
                        state: req.body.state_id,
                        cities: req.body.cities
                      },
                      $inc: {
                        __v: 1,
                      },
                    },
                    { new: true } // Return the updated document
                  );
                  if (resultState && resultDistrict) {
                    res.send({ status: "success", message: "District Updated" })
                  } else {
                    res.send({ status: "failed", message: "District Not Updated" })
                  }
                }
              })
            }
            if (!findState) {
              const result = await District.findOneAndUpdate(
                { _id: req.body.district_id },
                {
                  $set: {
                    name: req.body.new_name,
                    state: req.body.state_id,
                    cities: req.body.cities
                  },
                  $inc: {
                    __v: 1,
                  },
                },
                { new: true } // Return the updated document
              );
              const findAlreadyState = await State.findOne({ _id: req.body.state_id });
              const findDistrict = await District.findOne({ _id: req.body.district_id });
              const resultState = await State.findOneAndUpdate(
                { _id: req.body.state_id },
                {
                  $set: {
                    districts: [...findAlreadyState.districts, { id: findDistrict._id.toString(), name: findDistrict.name }]
                  },
                  $inc: {
                    __v: 1,
                  },
                },
                { new: true } // Return the updated document
              );
              if (resultState && result) {
                res.send({ status: "success", message: "District Updated" })
              } else {
                res.send({ status: "failed", message: "District Not Updated" })
              }
            }

          } else {
            const findDistrict = await District.findOne({ _id: req.body.district_id });
            const findState = await State.findOne({ _id: findDistrict.state });
            const result = await District.findOneAndUpdate(
              { _id: req.body.district_id },
              {
                $set: {
                  name: req.body.new_name,
                  state: req.body.state_id,
                  cities: req.body.cities
                },
                $inc: {
                  __v: 1,
                },
              },
              { new: true } // Return the updated document
            );

            function removeObjectWithId(arr, id) {
              const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

              if (objWithIdIndex > -1) {
                arr.splice(objWithIdIndex, 1);
              }

              return arr;
            }

            findState?.districts?.forEach(async (district) => {
              if (district.id === req.body.district_id) {
                const newArray = removeObjectWithId(findState.districts, req.body.district_id);
                await State.findOneAndUpdate(
                  { _id: findDistrict.state },
                  {
                    $set: {
                      districts: newArray
                    },
                    $inc: {
                      __v: 1,
                    },
                  },
                  { new: true } // Return the updated document
                );
              }
            })

            const resultState = await State.findOneAndUpdate(
              { _id: findDistrict.state },
              {
                $set: {
                  districts: req.body.new_name ? [...findState.districts, { id: req.body.district_id, name: req.body.new_name }] : [...findState.districts]
                },
                $inc: {
                  __v: 1,
                },
              },
              { new: true } // Return the updated document
            );

            if (result && resultState) {
              res.send({ status: "success", message: "District Updated" })
            } else {
              res.send({ status: "failed", message: "District Not Updated" })
            }
          }
        }
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async deleteDistrict(req, res) {
    try {
      const findDistrict = await District.findOne({ _id: req.params.district_id });
      const findState = await State.findOne({ _id: findDistrict.state });
      if (findState) {
        function removeObjectWithId(arr, id) {
          const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

          if (objWithIdIndex > -1) {
            arr.splice(objWithIdIndex, 1);
          }

          return arr;
        }
        findState.districts.forEach(async (district) => {
          if (district.id === req.params.district_id) {
            const newArray = removeObjectWithId(findState.districts, req.params.district_id);
            const resultState = await State.findOneAndUpdate(
              { _id: findDistrict.state },
              {
                $set: {
                  districts: newArray
                },
                $inc: {
                  __v: 1,
                },
              },
              { new: true } // Return the updated document
            );
            const result = await District.deleteOne({ _id: req.params.district_id });

            if (result.deletedCount > 0 && resultState) {
              res.send({ status: "success", message: "District Is Deleted" });
            } else {
              res.send({ status: "failed", message: "District Not Deleted" });
            }
          }
        })
      }
      if (!findState) {
        const result = await District.deleteOne({ _id: req.params.district_id });

        if (result.deletedCount > 0) {
          res.send({ status: "success", message: "District Is Deleted" });
        } else {
          res.send({ status: "failed", message: "District Not Deleted" });
        }
      }
    } catch (error) {
      res.send({ status: "failed", message: "Something Went To Wrong" });
    }
  }

  async getAllDistrict(req, res) {
    try {
      const districts = await District.find({}, { name: 1, _id: 1, cities: 1 }).sort({ name: 'asc' });
      res.status(200).send(districts);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getDistrict(req, res) {
    try {
      const districts = await District.findOne({ _id: req.params.district_id }, { name: 1, _id: 1, cities: 1, state: 1 });
      res.status(200).send(districts);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getCitiesByDistrict(req, res) {
    try {
      const cities = await District.findOne({ name: req.params.district }, { _id: 0, cities: 1 });
      if (cities) {
        res.status(200).send(cities.cities);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getDistrictState(req, res) {
    try {
      const state = await District.findOne({ name: req.params.district }, { _id: 0, state: 1 });
      if (state) {
        res.status(200).send(state);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }

}

module.exports = new DistrictsController();