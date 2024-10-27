import jwt from "jsonwebtoken";
import config from "config";

class Myjwt {
  constructor(
    adminAccessKey,
    adminRefreshKey,
    adminAccessTime,
    adminRefreshTime
  ) {
    this.adminAccessTime = adminAccessTime;
    this.adminRefreshTime = adminRefreshTime;
    this.adminAccessKey = adminAccessKey;
    this.adminRefreshKey = adminRefreshKey;
  }
  generateTokens(payload) {
    const adminAccessToken = jwt.sign(payload, this.adminAccessKey, {
      expiresIn: this.adminAccessTime,
    });
    const adminRefreshToken = jwt.sign(payload, this.adminRefreshKey, {
      expiresIn: this.adminRefreshTime,
    });
    return {
      adminAccessToken,
      adminRefreshToken,
    };
  }
  async verifyAccessToken(token) {
    return jwt.verify(token, this.adminAccessKey);
  }
  async verifyRefreshToken(token) {
    return jwt.verify(token, this.adminRefreshKey);
  }
  
}

export default new Myjwt(
  config.get("admin_access_key"),
  config.get("admin_refresh_key"),
  config.get("admin_access_time"),
  config.get("admin_refresh_time")
);
