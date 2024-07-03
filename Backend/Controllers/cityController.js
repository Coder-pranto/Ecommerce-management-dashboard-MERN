const City = require('../Models/city');
const District = require('../Models/district');
const uuid = require('uuid');

class CityController {
    async getAllCity(req, res) {

        try {
            const cities = await City.find({}).sort({ name: 'asc' });
            res.status(200).send(cities);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async getCityState(req, res) {
        try {
            const state = await City.findOne({ name: req.params.city }, { _id: 0, state: 1 });
            if (state) {
                res.status(200).send(state.state);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async getCityDistrict(req, res) {
        try {
            const district = await City.findOne({ name: req.params.city }, { _id: 0, district: 1 });
            if (district) {
                res.status(200).send(district.district);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async getCityByDistrict(req, res) {
        try {
            const district = await District.findOne({ name: req.params.district_id })
            const cities = await City.find({ district: district ? district?._id : req.params.district_id });
            if (cities) {
                res.status(200).send(cities);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async saveCity(req, res) {
        try {
            const city = new City({
                name: req.body.name,
                state: req.body.state_id,
                district: req.body.district_id
            });
            const result = await city.save();
            const district = await District.findOne(
                {
                    _id: req.body.district_id
                }
            );
            const resultDistrict = await District.findOneAndUpdate(
                { _id: req.body.district_id },
                {
                    $set: {
                        cities: req.body.name ? [...district.cities, { id: result?._id.toString(), name: result?.name }] : [...district.cities]
                    },
                    $inc: {
                        __v: 1,
                    },
                },
                { new: true } // Return the updated document
            );
            if (result && resultDistrict) {
                res.send({ status: "success", message: "City Added" });
            } else {
                res.send({ status: "failed", message: "City Not Added" });
            }
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async updateCity(req, res) {
        try {
            // const alreadyCity = await City.findOne(
            //     {
            //         name: req.body.new_name
            //     }
            // );
            // if (alreadyCity) return res.sendStatus(409);
            const findCity = await City.findOne({ _id: req.body.city_id });

            if (findCity && req.body.district_id != 'false') {
                function removeObjectWithId(arr, id) {
                    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

                    if (objWithIdIndex > -1) {
                        arr.splice(objWithIdIndex, 1);
                    }
                    return arr;
                }

                if (req.body?.district_id && req.body?.district_id != findCity.district) {
                    const findDistrict = await District.findOne({ _id: findCity.district });
                    if (findDistrict) {
                        findDistrict?.cities?.forEach(async (city) => {
                            if (city.id === req.body.city_id) {
                                const newArray = removeObjectWithId(findDistrict.cities, req.body.city_id);
                                await District.findOneAndUpdate(
                                    { _id: findCity.district },
                                    {
                                        $set: {
                                            cities: newArray
                                        },
                                        $inc: {
                                            __v: 1,
                                        },
                                    },
                                    { new: true } // Return the updated document
                                );
                                const findAlreadyDistrict = await District.findOne({ _id: req.body.district_id });
                                const resultDistrict = await District.findOneAndUpdate(
                                    { _id: req.body.district_id },
                                    {
                                        $set: {
                                            cities: [...findAlreadyDistrict.cities, { id: city.id, name: city.name }]
                                        },
                                        $inc: {
                                            __v: 1,
                                        },
                                    },
                                    { new: true } // Return the updated document
                                );
                                const resultCity = await City.findOneAndUpdate(
                                    { _id: req.body.city_id },
                                    {
                                        $set: {
                                            name: req.body.new_name,
                                            state: req.body.state_id,
                                            district: req.body.district_id
                                        },
                                        $inc: {
                                            __v: 1,
                                        },
                                    },
                                    { new: true } // Return the updated document
                                );
                                if (resultCity && resultDistrict) {
                                    res.send({ status: "success", message: "City Updated" })
                                } else {
                                    res.send({ status: "failed", message: "City Not Updated" })
                                }
                            }
                        })
                    }
                    if (!findDistrict) {
                        const result = await City.findOneAndUpdate(
                            { _id: req.body.city_id },
                            {
                                $set: {
                                    name: req.body.new_name,
                                    state: req.body.state_id,
                                    district: req.body.district_id
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );
                        const findAlreadyDistrict = await District.findOne({ _id: req.body.district_id });
                        const findCity = await City.findOne({ _id: req.body.city_id });
                        const resultDistrict = await District.findOneAndUpdate(
                            { _id: req.body.city_id },
                            {
                                $set: {
                                    cities: [...findAlreadyDistrict.cities, { id: findCity._id.toString(), name: findCity.name }]
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );
                        if (resultDistrict && result) {
                            res.send({ status: "success", message: "City Updated" })
                        } else {
                            res.send({ status: "failed", message: "City Not Updated" })
                        }
                    }

                } else {
                    const findCity = await City.findOne({ _id: req.body.city_id });
                    const findDistrict = await District.findOne({ _id: findCity.district });
                    const result = await City.findOneAndUpdate(
                        { _id: req.body.city_id },
                        {
                            $set: {
                                name: req.body.new_name,
                                state: req.body.state_id,
                                district: req.body.district_id
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

                    if (!req.body.state_id) {
                        findDistrict?.cities?.forEach(async (city) => {
                            if (city.id === req.body.city_id) {
                                const newArray = removeObjectWithId(findDistrict.cities, req.body.city_id);
                                await District.findOneAndUpdate(
                                    { _id: findCity.district },
                                    {
                                        $set: {
                                            cities: newArray
                                        },
                                        $inc: {
                                            __v: 1,
                                        },
                                    },
                                    { new: true } // Return the updated document
                                );
                            }
                        })
                    }

                    const resultDistrict = await District.findOneAndUpdate(
                        { _id: findCity.district },
                        {
                            $set: {
                                cities: req.body.new_name ? [...findDistrict.cities, { id: req.body.city_id, name: req.body.new_name }] : [...findDistrict.cities]
                            },
                            $inc: {
                                __v: 1,
                            },
                        },
                        { new: true } // Return the updated document
                    );

                    if (result && resultDistrict) {
                        res.send({ status: "success", message: "City Updated" })
                    } else {
                        res.send({ status: "failed", message: "City Not Updated" })
                    }
                }
            }
        }
        catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async getCity(req, res) {
        try {
            const city = await City.findOne({ _id: req.params.city_id });
            res.status(200).send(city);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async deleteCity(req, res) {
        try {
            const findCity = await City.findOne({ _id: req.params.city_id });
            const findDistrict = await District.findOne({ _id: findCity.district });
            if (findDistrict) {
                function removeObjectWithId(arr, id) {
                    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

                    if (objWithIdIndex > -1) {
                        arr.splice(objWithIdIndex, 1);
                    }

                    return arr;
                }
                findDistrict.cities.forEach(async (city) => {
                    if (city.id === req.params.city_id) {
                        const newArray = removeObjectWithId(findDistrict.cities, req.params.city_id);
                        const resultDistrict = await District.findOneAndUpdate(
                            { _id: findDistrict._id },
                            {
                                $set: {
                                    cities: newArray
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );
                        const result = await City.deleteOne({ _id: req.params.city_id });

                        if (result.deletedCount > 0 && resultDistrict) {
                            res.send({ status: "success", message: "City Is Deleted" });
                        } else {
                            res.send({ status: "failed", message: "City Not Deleted" });
                        }
                    }
                })
            }
            if (!findDistrict) {
                const result = await City.deleteOne({ _id: req.params.city_id });

                if (result.deletedCount > 0) {
                    res.send({ status: "success", message: "City Is Deleted" });
                } else {
                    res.send({ status: "failed", message: "City Not Deleted" });
                }
            }
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async addArea(req, res) {
        try {
            const findCity = await City.findOne({ _id: req.body.city_id });

            const result = await City.findOneAndUpdate(
                { _id: findCity._id },
                {
                    $set: {
                        area: req.body.name ? [...findCity.area, { id: uuid.v4(), name: req.body.name }] : [...findCity.area]
                    },
                    $inc: {
                        __v: 1,
                    },
                },
                { new: true } // Return the updated document
            );

            if (result) {
                res.send({ status: "success", message: "Area Added" });
            } else {
                res.send({ status: "success", message: "Area Not Added" });
            }

        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }

    }

    async getArea(req, res) {
        try {
            const findCity = await City.findOne({ _id: req.params.city_id });
            res.status(200).send(findCity?.area.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }));
        } catch {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async updateArea(req, res) {
        try {
            const findCity = await City.findOne({ _id: req.body.city_id });
            if (findCity) {
                findCity.area.forEach(async (area) => {
                    if (area.id === req.body.area_id) {
                        area['name'] = req.body.new_name;
                        const result = await City.findOneAndUpdate(
                            { _id: req.body.city_id },
                            {
                                $set: {
                                    area: findCity.area
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );

                        if (result) {
                            res.send({ status: "success", message: "Area Updated" });
                        } else {
                            res.send({ status: "failed", message: "Area Not Updated" });
                        }
                    }
                })
            }
        } catch {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async deleteArea(req, res) {
        try {
            const findCity = await City.findOne({ _id: req.params.city_id });
            if (findCity) {
                function removeObjectWithId(arr, id) {
                    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

                    if (objWithIdIndex > -1) {
                        arr.splice(objWithIdIndex, 1);
                    }

                    return arr;
                }
                findCity.area.forEach(async (area) => {
                    if (area.id === req.params.area_id) {
                        const newArray = removeObjectWithId(findCity.area, req.params.area_id);
                        const result = await City.findOneAndUpdate(
                            { _id: req.params.city_id },
                            {
                                $set: {
                                    area: newArray
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );

                        if (result) {
                            res.send({ status: "success", message: "Area Is Deleted" });
                        } else {
                            res.send({ status: "failed", message: "Area Not Deleted" });
                        }
                    }
                })
            }

        } catch {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }
}

module.exports = new CityController();