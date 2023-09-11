const StatisticService = require("../service/StatisticService");

module.exports = {
  get_personal_workday: async (req, res) => {
    try {
      const email = req.user.email;
      let month=req.params.month
      const statisticService = new StatisticService();
      const result = await statisticService.getPersonalWorkday(email, month);
      if (result?.success) {
        res.status(200).json(result?.data)
        return
      }
      else{
        res.status(400).json({ success: false, message: result?.message });
        return
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },
  get_Monthly_Statistics: async (req,res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
        let month=req.params.month
        const statisticService = new StatisticService();
        const result = await statisticService.getMonthlyStatistics(month);
      if (result?.success) {
        res.status(200).json(result?.data)
        return
      }
      else{
        res.status(400).json({ success: false, message: result?.message });
        return
      }
    } else {
      res.status(403).json({ success: false, message: "Bạn không có quyền truy cập chức năng này" });
      return;
    }
  }
};
