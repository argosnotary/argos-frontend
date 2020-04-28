import React from "react";
import NotificationsList from "./NotificationsList";

export default {
  title: "NotificationsList",
};

const dummyNotifications = [
  {
    body: "Please consider A",
    type: "WARNING",
  },
  {
    body: "Something went wrong",
    type: "ERROR",
  },
  {
    body: "Data was added",
    type: "SUCCESS",
  },
];

export const notificationsList = () => (
  <NotificationsList notifications={dummyNotifications} />
);
