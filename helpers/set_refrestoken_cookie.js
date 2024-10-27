import config from "config";
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: config.get("refresh_time_ms"),
  });
};

export { setRefreshTokenCookie };
