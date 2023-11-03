const LocationService = require("../service/LocationService");

module.exports = {
  getAllLocation: async (req, res) => {
    try {
      const page = req.params.page;
      const locationService = new LocationService();
      const result = await locationService.getAllLocation(page);
      if (result?.success) {
        res.status(200).json({data: result?.data, size:result?.size});
        return;
      } else {
        res.status(400).json({ success: false, message: result?.message });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  addLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const { Coordinate, branch, address } = req.body.location;
        const locationService = new LocationService();
        const result = await locationService.addLocation(
          Coordinate,
          branch,
          address
        );
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },
  updateLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.body.id;
        const { Coordinate, branch, address } = req.body.location;
        console.log(req.body)
        const locationService = new LocationService();
        const result = await locationService.updateLocation(
          id,
          Coordinate,
          branch,
          address
        );
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  deleteLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id;
        const locationService = new LocationService();
        const result = await locationService.deleteLocation(id);
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  searchLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const {key, page} = req.params;
        const locationService = new LocationService();
        const result = await locationService.searchLocation(key,page);
        res.status(result.status).json({
          result
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  getLocationByID: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id
        const locationService = new LocationService();
        const result = await locationService.getLocationByID(id);
        res.status(result.status).json({
          success: result?.success,
          message: result?.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },
};
