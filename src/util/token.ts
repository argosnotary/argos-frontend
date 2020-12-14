export function isRefreshNeeded(error: any) {
  return error.response.data && error.response.data.message && error.response.data.message === "refresh token";
}
