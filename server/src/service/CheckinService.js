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
        message: "There is no corresponding business date in the database.",
      };
    }

    const Checkined = await checkin.exists({
      employee: accountIdToCheck,
      _id: { $in: workDay.checkin },
    });

    return { success: true, checked: Checkined ? true : false };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during checkin.",
      error: error,
    };
  }
}

class CheckinService {
  async checkin(user, userlocation) {
    try {
      const { latitude, longitude } = userlocation;
      const locates = await location.find({});
      let check = false;
      let check_location;
      for (const locate of locates) {
        const distance = getDistanceFromLatLonInKm(
          locate.Coordinate.Latitude,
          locate.Coordinate.Longitude,
          latitude,
          longitude
        );
        if (distance < MIN_CHECKIN_DISTANCE) {
          check = true;
          check_location = locate.branch;
          break; 
        }
      }
      //checking in in a valid area
      if (check) {
        const now = new Date();
        let time = now.getHours();
        let timecheckin;
        let fine;
        let message = `Check in successfully at ${check_location}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const account = await accounts.findOne({ email: user.email });
        const finduser = await users.findOne({ _id: account.user });
        //tokens still exist
        if (account && finduser) {
          const result = await checkAccountInWorkDay(account._id, today);
          //not error
          if (!result.error) {
            //ìf checked in
              if (result.checked) {
                return {
                  success: false,
                  message: "You checked in today!!!",
                };
              }
              //if Haven't checked in yet
              else {
                const usercheckin = {
                  employee: account._id,
                  late: time >= CHECKIN_TIME ? true : false,
                  fee:
                    time >= CHECKIN_TIME
                      ? (finduser.pine_times + 1) * 10000
                      : 0,
                };
                const newcheckin = await checkin.create(usercheckin);
                timecheckin = newcheckin.time;
                fine = newcheckin.fee;
                //checkin late
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
                  message = `You was late. Check in successfully at ${check_location}`;
                }       
                //if checkin date does not exist yet
                if (!result.success) {
                  //If this is the first working day of the year
                  if (now.getMonth == 0 && now.getDate == FIRST_WORK_DAY) {
                    await work_day.deleteMany({});
                    await checkin.deleteMany({});
                  }
                  const newWorkDay = { day: today, checkin: [newcheckin._id] };
                  await work_day.create(newWorkDay);
                }
                //if checkin date already exists
                else {
                  await work_day.updateOne(
                    { day: today },
                    { $push: { checkin: newcheckin._id } }
                  );
                }
                return {
                  success: true,
                  message: message,
                  time: timecheckin,
                  fine: fine,
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
            message: `Token is wrong or has expired, please log in again`,
          };
        }
      } else {
        return {
          success: false,
          message: `You must enter the company area to check in`,
        };
      }
    } catch (err) {
      console.log("error: ", err);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }
}

module.exports = CheckinService;
