const accounts = require("../model/accounts");
const checkin = require("../model/checkin");
const users = require("../model/users");
const work_day = require("../model/work_day");
const ExcelJS = require("exceljs");
const { STATISTIC_PAGE_SIZE, EMPLOYEE_PAGE_SIZE } = process.env;
class StatisticService {
  async getPersonalWorkday(email, month, start, end) {
    try {
      const findAccount = await accounts.findOne({ email: email });
      if (!findAccount) {
        return {
          success: false,
          message: "Account was not found, please log in again",
        };
      }
      const now = new Date();
      const year = now.getFullYear().toString();
      const startDate = start ? start : new Date(year, month - 1, 1, 0, 0, 0);
      const endDate = end ? end : new Date(year, month, 1, 0, 0, 0);
      let totalLateDays = 0;
      let totalCheckins = 0;
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

        const createdDate = findAccount.create_at;
        if (checkday) {
          totalCheckins++;
          if (checkday.late) {
            totalLateDays++;
            totalFee += checkday.fee;
          }
          const newRecord = {
            day: dayOfWork.day,
            time: checkday.time,
            off: false,
            late: checkday.late,
            fee: checkday.fee,
          };

          result.push(newRecord);
        } else if (createdDate <= dayOfWork.day) {
          totalLeaveDays++;
          const newRecord = {
            day: dayOfWork.day,
            time: "",
            off: true,
            late: false,
            fee: 0,
          };

          result.push(newRecord);
        }
      }
      return {
        success: true,
        data: {
          email: email,
          detail: result,
          summary: {
            totalCheckins,
            totalLateDays,
            totalLeaveDays,
            totalFee,
          },
        },
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }

  async getMonthlyStatistics(month, page, start, end) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString();
      const startDate = start ? start : new Date(year, month - 1);
      const endDate = end ? end : new Date(year, month);
      const enabledUsers = await users.find({ enable: true });
      const npage = parseInt(page);
      const skip = (npage - 1) * STATISTIC_PAGE_SIZE;
      if (enabledUsers) {
        let workDaysInMonth
        if(page === 0)
        {
          workDaysInMonth = await work_day
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
          })
          
        }
        else{
          workDaysInMonth = await work_day
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
          }).skip(skip)
          .limit(STATISTIC_PAGE_SIZE);
        }
        const workDaysInMonth2 = await work_day
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
        const size = workDaysInMonth2.length;
        const result1 = await this.getMonthlyStatistics1(workDaysInMonth);
        const result2 = await this.getMonthlyStatistics2(
          workDaysInMonth2,
          page
        );
        if (result1.success && result2.success) {
          return {
            success: true,
            data: {
              detail: result1?.data,
              summary: result2?.data,
              size: size,
              empSize:result2?.empSize
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

        const validCheckins = checkins.filter(async (check) => {
          const user = await users.findOne({
            _id: check.employee.user,
            enable: true,
          });
          if (user) {
            const account = await accounts.findOne({ user: user._id });
            if (account.create_at <= date) {
              return true;
            }
          }
          return false;
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
            if (account.create_at <= date) {
              usersOnLeave.push({
                name: user.name,
                email: account.email,
              });
            }
          }
        }
        for (const check of checkins) {
          const user = await users.findOne({
            _id: check.employee.user,
            enable: true,
          });
          if (user) {
            const account = await accounts.findOne({ user: user._id });
            if (account.create_at <= date) {
              const employeeInfo = {
                name: user.name,
                email: check.employee.email,
                fee: check.fee,
                time: check.time,
              };

              if (check.late) {
                lateEmployees.push(employeeInfo);
              } else {
                onTimeEmployees.push(employeeInfo);
              }
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
        message: "An error occurred",
      };
    }
  }

  async getMonthlyStatistics2(workDaysInMonth, page) {
    try {
      const monthlyStatistics = [];
      const skip = (page - 1) * EMPLOYEE_PAGE_SIZE;
      const enabledUsers = await users
        .find({ enable: true })
        .skip(skip)
        .limit(EMPLOYEE_PAGE_SIZE);

      const lenght = await users.find({ enable: true }).countDocuments();
      for (const user of enabledUsers) {
        const userStats = {
          name: user.name,
          email: "",
          totalCheckins: 0,
          totalLeaveDays: 0,
          totalLateDays: 0,
          totalFee: 0,
        };

        const account = await accounts.findOne({ user: user._id });
        userStats.email = account.email;

        for (const workDay of workDaysInMonth) {
          const checkins = workDay.checkin;
          const userCheckins = checkins.filter((check) =>
            check.employee.user.equals(user._id)
          );

          if (userCheckins.length === 0) {
            const createdDate = account.create_at;
            if (createdDate <= workDay.day) {
              userStats.totalLeaveDays += 1;
            }
          } else {
            const checkin = userCheckins[0];
            userStats.totalCheckins++;
            if (checkin.late) {
              userStats.totalLateDays += 1;
            }
            userStats.totalFee += checkin.fee;
          }
        }
        monthlyStatistics.push(userStats);
      }

      return {
        success: true,
        data: monthlyStatistics,
        empSize: lenght
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }

  async exportPersonalExcelFile(email, month, start, end) {
    try {
      const result = await this.getPersonalWorkday(email, month, start, end);
      if (result.success) {
        const detail = result.data.detail;
        const summary = result.data.summary;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Statistic");
        worksheet.columns = [
          { header: "Day", key: "day", width: 32 },
          { header: "Leave", key: "leave", width: 10 },
          { header: "Late", key: "late", width: 10 },
          { header: "Time", key: "time", width: 20 },
          { header: "Fine", key: "fee", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };
        detail.forEach((item) => {
          const dateTimeString = item.day.toString();
          const datePart = dateTimeString.slice(0, 10);
          worksheet.addRow({
            day: datePart,
            leave: item.off,
            late: item.late,
            time: item.time,
            fee: item.fee,
          });
        });

        const summarysite = detail.length + 3;
        worksheet.getCell(`A${summarysite}`).value = "Total Late Days:";
        worksheet.getCell(`A${summarysite + 1}`).value = "Total Ontime Days:";
        worksheet.getCell(`A${summarysite + 2}`).value = "Total Leave Days:";
        worksheet.getCell(`A${summarysite + 3}`).value = "Total Fine:";
        worksheet.mergeCells(`A${summarysite}:C${summarysite}`);
        worksheet.mergeCells(`A${summarysite + 1}:C${summarysite + 1}`);
        worksheet.mergeCells(`A${summarysite + 2}:C${summarysite + 2}`);
        worksheet.mergeCells(`A${summarysite + 3}:C${summarysite + 3}`);
        for (let i = 0; i < 4; i++) {
          const cell = worksheet.getCell(`A${summarysite + i}`);
          cell.font = { bold: true };
        }
        worksheet.getCell(`D${summarysite}`).value = summary.totalLateDays;
        worksheet.getCell(`D${summarysite + 1}`).value =
          summarysite - 3 - summary.totalLateDays - summary.totalLeaveDays;
        worksheet.getCell(`D${summarysite + 2}`).value = summary.totalLeaveDays;
        worksheet.getCell(`D${summarysite + 3}`).value = summary.totalFee;
        return {
          success: true,
          data: workbook,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }

  async ExportExcelFileForAllEmployees(month, start, end) {
    try {
      const result = await this.getMonthlyStatistics(month,0, start, end);
      console.log(result)
      if (result?.success && result?.data) {
        const detail = result.data.detail;
        const summary = result.data.summary;
        const workbook = new ExcelJS.Workbook();
        const worksheetDetail = workbook.addWorksheet("Detail");
        const worksheetSummary = workbook.addWorksheet("Summary");

        //fill data for sheet detail
        const headersDetal = {
          A1: "day",
          B1: "total checkins",
          C1: "ontime checkins",
          D1: "late checkins",
          E1: "total leaves",
          F1: "ontime employees",
          I1: "late employees",
          M1: "total fine",
          N1: "on leave",
          F2: "name",
          G2: "email",
          H2: "time",
          I2: "name",
          J2: "email",
          K2: "fine",
          L2: "time",
          N2: "name",
          O2: "email",
        };
        const headersSummary = {
          A1: "name",
          B1: "email",
          C1: "total leave days",
          D1: "total late days",
          E1: "total fine",
        };

        Object.keys(headersDetal).forEach((coord) => {
          const cell = worksheetDetail.getCell(coord);
          cell.value = headersDetal[coord];
          cell.font = { bold: true, horizontal: "center" };
        });

        Object.keys(headersSummary).forEach((coord) => {
          const cell = worksheetSummary.getCell(coord);
          cell.value = headersSummary[coord];
          cell.font = { bold: true, horizontal: "center" };
        });

        worksheetDetail.mergeCells("A1:A2");
        worksheetDetail.mergeCells("B1:B2");
        worksheetDetail.mergeCells("C1:C2");
        worksheetDetail.mergeCells("D1:D2");
        worksheetDetail.mergeCells("E1:E2");
        worksheetDetail.mergeCells("M1:M2");
        worksheetDetail.mergeCells("F1:H1");
        worksheetDetail.mergeCells("I1:L1");
        worksheetDetail.mergeCells("N1:O1");

        let currentRow = 3;
        detail.forEach((item) => {
          const lateEmployeesCount = item.lateEmployees.length;
          const onTimeEmployeesCount = item.onTimeEmployees.length;
          const onLeaveCount = item.onLeave.length;
          const maxRowCount = Math.max(
            lateEmployeesCount,
            onTimeEmployeesCount,
            onLeaveCount
          );

          worksheetDetail.mergeCells(
            `A${currentRow}:A${currentRow + maxRowCount - 1}`
          );
          worksheetDetail.mergeCells(
            `B${currentRow}:B${currentRow + maxRowCount - 1}`
          );
          worksheetDetail.mergeCells(
            `C${currentRow}:C${currentRow + maxRowCount - 1}`
          );
          worksheetDetail.mergeCells(
            `D${currentRow}:D${currentRow + maxRowCount - 1}`
          );
          worksheetDetail.mergeCells(
            `E${currentRow}:E${currentRow + maxRowCount - 1}`
          );
          worksheetDetail.mergeCells(
            `M${currentRow}:M${currentRow + maxRowCount - 1}`
          );
          ["A", "B", "C", "D", "E", "M"].forEach((column) => {
            worksheetDetail.getColumn(column).alignment = {
              horizontal: "center",
            };
          });
          const dateTimeString = item.day.toString();
          const datePart = dateTimeString.slice(0, 10);
          worksheetDetail.getCell(`A${currentRow}`).value = datePart;
          worksheetDetail.getCell(`B${currentRow}`).value = item.totalCheckins;
          worksheetDetail.getCell(`C${currentRow}`).value = item.onTimeCheckins;
          worksheetDetail.getCell(`D${currentRow}`).value = item.lateCheckins;
          worksheetDetail.getCell(`E${currentRow}`).value = item.totalOff;
          worksheetDetail.getCell(`M${currentRow}`).value = item.totalFees;

          item.onTimeEmployees.forEach((employee, index) => {
            worksheetDetail.getCell(`F${currentRow + index}`).value =
              employee.name;
            worksheetDetail.getCell(`G${currentRow + index}`).value =
              employee.email;
            worksheetDetail.getCell(`H${currentRow + index}`).value =
              employee.time;
          });

          item.lateEmployees.forEach((employee, index) => {
            worksheetDetail.getCell(`I${currentRow + index}`).value =
              employee.name;
            worksheetDetail.getCell(`J${currentRow + index}`).value =
              employee.email;
            worksheetDetail.getCell(`K${currentRow + index}`).value =
              employee.fee;
            worksheetDetail.getCell(`L${currentRow + index}`).value =
              employee.time;
          });

          item.onLeave.forEach((employee, index) => {
            worksheetDetail.getCell(`N${currentRow + index}`).value =
              employee.name;
            worksheetDetail.getCell(`O${currentRow + index}`).value =
              employee.email;
          });

          currentRow += maxRowCount;
        });

        summary.forEach((item, index) => {
          worksheetSummary.getCell(`A${index + 2}`).value = item.name;
          worksheetSummary.getCell(`B${index + 2}`).value = item.email;
          worksheetSummary.getCell(`C${index + 2}`).value = item.totalLeaveDays;
          worksheetSummary.getCell(`D${index + 2}`).value = item.totalLateDays;
          worksheetSummary.getCell(`E${index + 2}`).value = item.totalFee;
        });

        worksheetDetail.columns.forEach((column, columnIndex) => {
          let maxLength = 0;

          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value;
            const cellText = cell.text;

            const cellWidth = cellText.length + 2;

            if (cellWidth > maxLength) {
              maxLength = cellWidth;
            }
          });

          worksheetDetail.getColumn(columnIndex + 1).width = maxLength;
        });

        worksheetSummary.columns.forEach((column, columnIndex) => {
          let maxLength = 0;

          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellText = cell.text;

            const cellWidth = cellText.length + 2;

            if (cellWidth > maxLength) {
              maxLength = cellWidth;
            }
          });
          worksheetSummary.getColumn(columnIndex + 1).width = maxLength;
        });
        return {
          success: true,
          data: workbook,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }
}

module.exports = StatisticService;
