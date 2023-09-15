const location = require("../model/location");

class LocationService {
  async getAllLocation() {
    try {
      const allLocation = await location.find({enable:true});
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
        message: "có lỗi xảy ra",
      };
    }
  }

  async getOldLocation() {
    try {
      const allLocation = await location.find({enable:false});
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
        message: "có lỗi xảy ra",
      };
    }
  }

  async addLocation(Coordinate, branch){
    try {
        await location.create({Coordinate: Coordinate, branch:branch})
        return {
          success: true,
          status: 200,
          message:"thêm thành công!!",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          status: 500,
          message: "có lỗi xảy ra",
        };
      }
  }

  async updateLocation(id, Coordinate, branch){
    try {
        await location.updateOne({_id: id},{Coordinate: Coordinate, branch:branch})
        return {
          success: true,
          status: 200,
          message:"cập nhật thành công!!",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          status: 500,
          message: "có lỗi xảy ra",
        };
      }
  }

  async deleteLocation(id){
    try {
        await location.updateOne({_id: id},{enable:false})
        return {
          success: true,
          status: 200,
          message:"xóa thành công!!",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          status: 500,
          message: "có lỗi xảy ra",
        };
      }
  }

  async restoreLocation(id){
    try {
        await location.updateOne({_id: id},{enable:true})
        return {
          success: true,
          status: 200,
          message:"khôi phục thành công!!",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          status: 500,
          message: "có lỗi xảy ra",
        };
      }
  }

  async searchLocation(key){
    try {
      const translate = key.replace(/\+/g," ")
      const result = await location.find({branch: {$regex: translate, option:"$i"}})
      return {
        success:true,
        data: result
      }
      }
     catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra",
      };
    }
  }
}

module.exports = LocationService;
