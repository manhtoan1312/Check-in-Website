const LocationService = require("../service/LocationService");

module.exports = {
  getAllLocation: async (req, res) => {
    try {
      const locationService = new LocationService();
      const result = await locationService.getAllLocation();
      if (result?.success) {
        res.status(200).json(result?.data);
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
  getOldLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const locationService = new LocationService();
        const result = await locationService.getOldLocation();
        if (result?.success) {
          res.status(200).json(result?.data);
          return;
        } else {
          res.status(400).json({ success: false, message: result?.message });
          return;
        }
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
  addLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const Coordinate = req.body.Coordinate;
        const branch = req.body.branch;
        const locationService = new LocationService();
        const result = await locationService.addLocation(Coordinate, branch);
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
        const id = req.body._id;
        const Coordinate = req.body.Coordinate;
        const branch = req.body.branch;
        const locationService = new LocationService();
        const result = await locationService.updateLocation(
          id,
          Coordinate,
          branch
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
  restoreLocation: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id;
        const locationService = new LocationService();
        const result = await locationService.restoreLocation(id);
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
        const key = req.params.key;
        const locationService = new LocationService();
        const result = await locationService.searchLocation(key)
        res.status(result.status).json({
          success: result.success,
          message: result.data,
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
  }
};
