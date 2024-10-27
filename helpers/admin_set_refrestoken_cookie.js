import config from "config";
const adminSetRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("admin_refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: config.get("admin_refresh_time_ms"),
  });
};

export { adminSetRefreshTokenCookie };
