const accounts = require("../model/accounts");
const checkin = require("../model/checkin");
const users = require("../model/users");
const work_day = require("../model/work_day");
const mongoose = require("mongoose");

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
        data: result,
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

      // Lấy danh sách các ngày làm việc trong tháng
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
      const monthlyStatistics = [];

      for (const workDay of workDaysInMonth) {
        const date = workDay.day;
        const checkins = workDay.checkin;
        const totalCheckins = checkins.length;
        const lateCheckins = checkins.filter((check) => check.late).length;
        const onTimeCheckins = totalCheckins - lateCheckins;
        const totalFees = checkins.reduce(
          (total, check) => total + check.fee,
          0
        );

        // Tạo các mảng để lưu thông tin nhân viên đi trễ và đúng giờ
        const lateEmployees = [];
        const onTimeEmployees = [];

        // Lặp qua từng checkin và thu thập thông tin
        for (const check of checkins) {
          const user = await users.findOne({ _id: check.employee.user });
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

        const dailyStatistics = {
          day: date,
          totalCheckins: totalCheckins,
          lateCheckins: lateCheckins,
          onTimeCheckins: onTimeCheckins,
          totalFees: totalFees,
          lateEmployees: lateEmployees,
          onTimeEmployees: onTimeEmployees,
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
}

module.exports = StatisticService;
