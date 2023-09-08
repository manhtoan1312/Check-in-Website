const CheckinService = require('../service/CheckinService');

module.exports = {
  checkin:async (req, res) => {
    try {
        const checkinService = new CheckinService();
        const user= req.user
        const location = {
            latitude:req.body.latitude,
            longitude:req.body.longitude
        }
        const result = await checkinService.checkin(user,location )
        if(result.success){
          res.status(200).json(result)
        }
        else{
          res.status(400).json(result)
        }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },
};
