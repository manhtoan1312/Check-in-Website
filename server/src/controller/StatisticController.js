const StatisticService = require("../service/StatisticService");
const fs = require("fs");
const path = require("path");
const accounts = require("../model/accounts");
const users = require("../model/users");
module.exports = {
  get_personal_workday: async (req, res) => {
    try {
      const email = req.user.email;
      let month = req.params.month;
      const statisticService = new StatisticService();
      const result = await statisticService.getPersonalWorkday(email, month);
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
  get_Monthly_Statistics: async (req, res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
      let month = req.params.month;
      const statisticService = new StatisticService();
      const result = await statisticService.getMonthlyStatistics(month);
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
  },
  getWorkdayByEmail: async (req, res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
      let email = req.params.email;
      let month = req.params.month;
      const statisticService = new StatisticService();
      const result = await statisticService.getPersonalWorkday(email, month);
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
  },

  getPersonalWorkdayByDate: async (req, res) => {
    const user = req.user;
    let email = user.email;
    let startDate = req.params.start;
    let endDate = req.params.end;
    const statisticService = new StatisticService();
    const result = await statisticService.getPersonalWorkday(
      email,
      0,
      startDate,
      endDate
    );
    if (result?.success) {
      res.status(200).json(result?.data);
      return;
    } else {
      res.status(400).json({ success: false, message: result?.message });
      return;
    }
  },

  getPersonalWorkdayByDateandEmail: async (req, res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
      let email = req.email;
      let startDate = req.params.start;
      let endDate = req.params.end;
      const statisticService = new StatisticService();
      const result = await statisticService.getPersonalWorkday(
        email,
        0,
        startDate,
        endDate
      );
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
  },

  getWorkdayByDate: async (req, res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
      let startDate = req.params.start;
      let endDate = req.params.end;
      const statisticService = new StatisticService();
      const result = await statisticService.getMonthlyStatistics(
        0,
        startDate,
        endDate
      );
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
  },

  download_Personal_Statistics: async (req, res) => {
    try {
      let email = req.params.email;
      let month = req.params.month;
      const statisticService = new StatisticService();
      const result = await statisticService.exportPersonalExcelFile(
        email,
        month
      );
      if (result?.success) {
        const workbook = result.data;
        const tempFilePath = path.join(
          __dirname,
          `../statistic_${month}.xlsx`
        );
        const account = await accounts.findOne({ email: email });
        const user = await users.findOne({ _id: account.user });
        await workbook.xlsx.writeFile(tempFilePath);
        res.download(
          tempFilePath,
          `statistic_${email}_${user.name}_${month}.xlsx`,
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi tải tệp Excel.",
              });
            } else {
              fs.unlinkSync(tempFilePath);
            }
          }
        );
      } else {
        res.status(400).json({ success: false, message: result?.message });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  download_Personal_Statistics_FormDate: async (req, res) => {
    try {
      let email = req.params.email;
      let start = req.params.start;
      let end = req.params.end;
      const statisticService = new StatisticService();
      const result = await statisticService.exportPersonalExcelFile(
        email,
        0,start,end
      );
      if (result?.success) {
        const workbook = result.data;
        const tempFilePath = path.join(
          __dirname,
          `../statistic_${month}.xlsx`
        );
        const account = await accounts.findOne({ email: email });
        const user = await users.findOne({ _id: account.user });
        await workbook.xlsx.writeFile(tempFilePath);
        res.download(
          tempFilePath,
          `statistic_${email}_${start}_${end}.xlsx`,
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi tải tệp Excel.",
              });
            } else {
              fs.unlinkSync(tempFilePath);
            }
          }
        );
      } else {
        res.status(400).json({ success: false, message: result?.message });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  download_Monthly_Statistics: async (req, res) => {
    try {
      const user = req.user;
      if (user.role == "MANAGER") {
        let month = req.params.month;
        const statisticService = new StatisticService();
        const result = await statisticService.ExportExcelFileForAllEmployees(
          month
        );
        if (result?.success) {
          const workbook = result.data;
          const tempFilePath = path.join(
            __dirname,
            `../statistic_${month}.xlsx`
          );
          await workbook.xlsx.writeFile(tempFilePath);
          res.download(tempFilePath, `statistic_${month}.xlsx`, (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi tải tệp Excel.",
              });
            } else {
              fs.unlinkSync(tempFilePath);
            }
          });
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

  download_Monthly_Statistics_formDate: async (req, res) => {
    try {
      const user = req.user;
      if (user.role == "MANAGER") {
        let start = req.params.start;
        let end = req.params.end;
        const statisticService = new StatisticService();
        const result = await statisticService.ExportExcelFileForAllEmployees(
          0,
          start,
          end
        );
        if (result?.success) {
          const workbook = result.data;
          const tempFilePath = path.join(
            __dirname,
            `../statistic_${start}-${end}.xlsx`
          );
          await workbook.xlsx.writeFile(tempFilePath);
          res.download(tempFilePath, `statistic_${start}-${end}.xlsx`, (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi tải tệp Excel.",
              });
            } else {
              fs.unlinkSync(tempFilePath);
            }
          });
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
};
