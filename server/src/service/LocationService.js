const location = require("../model/location");
const LOCATION_PAGE_SIZE = process.env.LOCATION_PAGE_SIZE;

class LocationService {
  async getAllLocation(page) {
    try {
      let allLocation;
      if (page) {
        const Npage = parseInt(page);
        const skip = (Npage - 1) * LOCATION_PAGE_SIZE;
        allLocation = await location
          .find()
          .skip(skip)
          .limit(LOCATION_PAGE_SIZE);
      } else {
        allLocation = await location.find();
      }
      const length = await location.countDocuments();
      return {
        success: true,
        status: 200,
        data: allLocation,
        size: length,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred",
      };
    }
  }

  async addLocation(Coordinate, branch, address) {
    try {
      await location.create({
        Coordinate: Coordinate,
        branch: branch,
        address: address,
      });
      return {
        success: true,
        status: 200,
        message: "Location added successfully",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "You have entered the same branch name",
      };
    }
  }

  async updateLocation(id, Coordinate, branch, address) {
    try {
      await location.updateOne(
        { _id: id },
        { Coordinate: Coordinate, branch: branch, address: address }
      );
      return {
        success: true,
        status: 200,
        message: "Location update successful!!",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async deleteLocation(id) {
    try {
      await location.deleteOne({ _id: id });
      return {
        success: true,
        status: 200,
        message: "Deleted successfully!!",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async searchLocation(key, page) {
    try {
      console.log(key)
      const translate = key.replace(/\+/g, " ");
      const filter = {
        $or: [
          { branch: { $regex: translate, $options: "i" } },
          { address: { $regex: translate, $options: "i" } },
        ],
      };

      const skip = page ? (parseInt(page) - 1) * LOCATION_PAGE_SIZE : 0;
      const limit = page ? LOCATION_PAGE_SIZE : undefined;

      const result = await location.find(filter).skip(skip).limit(limit);
      const size = page ? await location.countDocuments(filter) : result.length;

      return {
        status: 200,
        success: true,
        message: result,
        size: size,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async getLocationByID(id) {
    try {
      const result = await location.findOne({ _id: id });
      return {
        status: 200,
        success: true,
        message: result,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "An error occurred",
      };
    }
  }
}

module.exports = LocationService;
