const accounts = require("../model/accounts");
const checkin = require("../model/checkin");
const location = require("../model/location");
const users = require("../model/users");
const work_day = require("../model/work_day");
const { CHECKIN_TIME, MIN_CHECKIN_DISTANCE, FIRST_WORK_DAY } = process.env;
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function checkAccountInWorkDay(accountIdToCheck, workday) {
  try {
    const workDay = await work_day.findOne({ day: workday });
    if (!workDay) {
      return {
        success: false,
        message: "Không có ngày làm việc tương ứng trong cơ sở dữ liệu.",
      };
    }

    const daCheckin = await checkin.exists({
      employee: accountIdToCheck,
      _id: { $in: workDay.checkin },
    });

    return { success: true, checked: daCheckin ? true : false };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình kiểm tra.",
      error: error,
    };
  }
}

class CheckinService {
  async checkin(user, userlocation) {
    try {
      const { latitude, longitude } = userlocation;
      const locates = await location.find({enable:true});
      let check = false;
      let check_location;
      locates.forEach((locate) => {
        const distance = getDistanceFromLatLonInKm(
          locate.Coordinate.Latitude,
          locate.Coordinate.Longitude,
          latitude,
          longitude
        );
        if (distance < MIN_CHECKIN_DISTANCE) {
          check = true;
          check_location = locate.branch;
          return;
        }
      });
      //nếu trong phạm vi các chi nhánh của công ty
      if (check) {
        const now = new Date();
        let time = now.getHours();
        let message = `Checkin thành công tại ${check_location}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const account = await accounts.findOne({ email: user.email });
        const finduser = await users.findOne({ _id: account.user });
        //token còn tồn tại
        if (account && finduser) {
          const result = await checkAccountInWorkDay(account._id, today);
          //không xảy ra lỗi
          if (!result.error) {
            //nếu đã checkin trong ngày
            if (result.success && result.checked) {
              return {
                success: false,
                message: "Bạn đã checkin vào ngày hôm nay!!!",
              };
            }
            //nếu chưa checkin
            else {
              if (now.getMonth == 0 && now.getDate == FIRST_WORK_DAY) {
                await checkin.deleteMany({});
              }
              const usercheckin = {
                employee: account._id,
                late: time >= CHECKIN_TIME ? true : false,
                fee:
                  time >= CHECKIN_TIME ? (finduser.pine_times + 1) * 10000 : 0,
              };
              const newcheckin = await checkin.create(usercheckin);
              //nếu checkin trễ
              if (time >= CHECKIN_TIME) {
                await users.updateOne(
                  { _id: finduser._id },
                  {
                    $set: {
                      pine_times:
                        finduser.pine_times + 1 >= 4
                          ? 0
                          : finduser.pine_times + 1,
                    },
                  }
                );
                message = `Bạn đã đi trễ. Checkin thành công tại ${check_location}`;
              }
              //nếu ngày checkin chưa tồn tại
              if (!result.success) {
                //nếu đây là ngày làm việc đầu năm
                if (now.getMonth == 0 && now.getDate == FIRST_WORK_DAY) {
                  await work_day.deleteMany({});
                }
                const newWorkDay = { day: today, checkin: [newcheckin._id] };
                await work_day.create(newWorkDay);
              }
              //nếu ngày checkin đã tồn tại
              else {
                await work_day.updateOne(
                  { day: today },
                  { $push: { checkin: newcheckin._id } }
                );
              }
              return {
                success: true,
                message: message,
              };
            }
          } else {
            return {
              success: false,
              message: result.error,
            };
          }
        } else {
          return {
            success: false,
            message: `Token sai hoặc đã hết hạn, vui lòng đăng nhập lại`,
          };
        }
      } else {
        return {
          success: false,
          message: `Bạn phải vào khu vực của công ty để checkin`,
        };
      }
    } catch (err) {
      console.log("error: ", err);
      return {
        success: false,
        message: err,
      };
    }
  }
}

module.exports = CheckinService;
