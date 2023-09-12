const accounts = require("../model/accounts");
const checkin = require("../model/checkin");
const users = require("../model/users");
const work_day = require("../model/work_day");
const ExcelJS = require("exceljs");

class StatisticService {
  async getPersonalWorkday(email, month) {
    try {
      const findAccount = await accounts.findOne({ email: email });

      if (!findAccount) {
        return {
          success: false,
          message: "Không tìm thấy tài khoản của bạn, vui lòng đăng nhập lại",
        };
      }

      const now = new Date();
      const year = now.getFullYear().toString();
      const startDate = new Date(year, month - 1, 1, 0, 0, 0);
      const endDate = new Date(year, month, 1, 0, 0, 0);
      let totalAbsentDays = 0;
      let totalLeaveDays = 0;
      let totalFee = 0;
      const result = [];

      const workDayInMonth = await work_day.aggregate([
        {
          $match: {
            day: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
      ]);
      for (const dayOfWork of workDayInMonth) {
        let checkday;
        for (const check of dayOfWork.checkin) {
          checkday = await checkin.findOne({
            $and: [{ _id: check }, { employee: findAccount._id }],
          });
          if (checkday) {
            break;
          }
        }
        const isOff = !checkday;
        if (checkday && checkday.late) {
          totalAbsentDays++;
          totalFee += checkday.fee;
        } else {
          totalLeaveDays++;
        }

        const newRecord = {
          day: dayOfWork.day,
          time: isOff ? "" : checkday.time,
          off: isOff,
          late: isOff ? false : checkday.late,
          fee: isOff ? 0 : checkday.fee,
        };

        result.push(newRecord);
      }
      return {
        success: true,
        data: {
          detail: result,
          summary: {
            totalAbsentDays,
            totalLeaveDays,
            totalFee,
          },
        },
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "có lỗi xảy ra",
      };
    }
  }
  async getMonthlyStatistics(month) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString();
      const startDate = new Date(year, month - 1, 1, 0, 0, 0);
      const endDate = new Date(year, month, 1, 0, 0, 0);
      const enabledUsers = await users.find({ enable: true });
      if (enabledUsers) {
        const workDaysInMonth = await work_day
          .find({
            day: {
              $gte: startDate,
              $lt: endDate,
            },
          })
          .populate({
            path: "checkin",
            populate: {
              path: "employee",
              model: "accounts",
            },
          });
        const result1 = await this.getMonthlyStatistics1(workDaysInMonth);
        const result2 = await this.getMonthlyStatistics2(workDaysInMonth);
        if (result1.success && result2.success) {
          return {
            success: true,
            data: {
              detail: result1?.data,
              summary: result2?.data,
            },
          };
        }
      } else {
        return {
          success: true,
          data: [],
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "có lỗi xảy ra",
      };
    }
  }

  async getMonthlyStatistics1(workDaysInMonth) {
    try {
      const monthlyStatistics = [];
      const enabledUsers = await users.find({ enable: true });
      for (const workDay of workDaysInMonth) {
        const usersOnLeave = [];
        const date = workDay.day;
        const checkins = workDay.checkin;
        const validCheckins = checkins.filter((check) => {
          const us = enabledUsers.find((user) =>
            user._id.equals(check.employee.user)
          );
          return us && us.enable;
        });

        const totalCheckins = validCheckins.length;
        const lateCheckins = validCheckins.filter((check) => check.late).length;
        const onTimeCheckins = totalCheckins - lateCheckins;
        const totalFees = validCheckins.reduce(
          (total, check) => total + check.fee,
          0
        );

        const lateEmployees = [];
        const onTimeEmployees = [];

        for (const user of enabledUsers) {
          const hasCheckin = checkins.some((check) =>
            check.employee.user.equals(user._id)
          );

          if (!hasCheckin) {
            const account = await accounts.findOne({ user: user._id });
            usersOnLeave.push({
              name: user.name,
              email: account.email,
            });
          }
        }
        for (const check of checkins) {
          const user = await users.findOne({
            _id: check.employee.user,
            enable: true,
          });
          if (user) {
            const employeeInfo = {
              name: user.name,
              email: check.employee.email,
              fee: check.fee,
            };

            if (check.late) {
              lateEmployees.push(employeeInfo);
            } else {
              onTimeEmployees.push(employeeInfo);
            }
          }
        }
        const totalOff = usersOnLeave.length;
        const dailyStatistics = {
          day: date,
          totalCheckins: totalCheckins,
          lateCheckins: lateCheckins,
          onTimeCheckins: onTimeCheckins,
          totalOff: totalOff,
          totalFees: totalFees,
          lateEmployees: lateEmployees,
          onTimeEmployees: onTimeEmployees,
          onLeave: usersOnLeave,
        };

        monthlyStatistics.push(dailyStatistics);
      }

      return {
        success: true,
        data: monthlyStatistics,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Có lỗi xảy ra",
      };
    }
  }

  async;

  async getMonthlyStatistics2(workDaysInMonth) {
    try {
      const monthlyStatistics = [];
      const enabledUsers = await users.find({ enable: true });
      for (const user of enabledUsers) {
        const userStats = {
          name: user.name,
          email: "",
          totalLeaveDays: 0,
          totalAbsentDays: 0,
          totalFee: 0,
        };

        for (const workDay of workDaysInMonth) {
          const date = workDay.day;
          const checkins = workDay.checkin;
          const userCheckins = checkins.filter((check) =>
            check.employee.user.equals(user._id)
          );

          if (userCheckins.length === 0) {
            userStats.totalLeaveDays += 1;
          } else {
            if (userCheckins[0].late) {
              userStats.totalAbsentDays += 1;
            }
            userStats.totalFee += userCheckins[0].fee;
          }
        }

        userStats.email = await accounts.findOne({ user: user._id }).email;

        monthlyStatistics.push(userStats);
      }

      return {
        success: true,
        data: monthlyStatistics,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Có lỗi xảy ra",
      };
    }
  }

  async ExportExcelFileForAllEmployees(month) {
    try {
      const result = await this.getMonthlyStatistics(month);
      if (result.success && result?.data) {
        const detail = result.data.detail;
        const summary = result.data.summary;
        const workbook = new ExcelJS.Workbook();
        const worksheetDetail = workbook.addWorksheet("Detail");
        const worksheetSummary = workbook.addWorksheet("Summary");
       worksheetDetail.columns = [
        {header:"day", key:"day"},
        {header:"total checkin", key:"totalCheckins"},
        {header:"ontime checkin", key:"onTimeCheckins"},
        {header:"late checkin", key:"lateCheckins"},
        {header:"total of Leave", key:"totalOff"},
        {header:"ontime employees", key:""},
        {header:" ", key:""},
        {header:"", key:""},
        {header:"late employees", key:""},
        {header:"", key:""},
        {header:"", key:""},
        {header:"", key:""},
       ]
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Có lỗi xảy ra",
      };
    }
  }
}

module.exports = StatisticService;
