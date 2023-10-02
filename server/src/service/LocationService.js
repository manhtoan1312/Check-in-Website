const location = require("../model/location");

class LocationService {
  async getAllLocation() {
    try {
      const allLocation = await location.find({});
      return {
        success: true,
        status: 200,
        data: allLocation,
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
        message: "An error occurred",
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

  async searchLocation(key) {
    try {
      const translate = key.replace(/\+/g, " ");
      const result = await location.find({
        $or: [
          { branch: { $regex: translate, $options: "i" } },
          { address: { $regex: key, $options: "i" } },
        ],
      });

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
