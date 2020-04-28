import React from "react";
import { mount } from "enzyme";
import NotificationsList, {
  INotificationListTheme,
  getTypeColor,
  getTypeIcon,
  Notification,
  NotificationTypes,
} from "./NotificationsList";
import { WarningIcon } from "../atoms/Icons";
import SuccessIcon from "../atoms/Icons/SuccessIcon";
import { ThemeProvider } from "styled-components";

const dummyTheme: INotificationListTheme = {
  iconSize: 22,
  iconColor: "#fff",
  colors: {
    WARNING: "orange",
    ERROR: "red",
    SUCCESS: "green",
  },
};

describe("NotificationsList", () => {
  it("getTypeColor returns the right color based on notification type", () => {
    const result = getTypeColor(dummyTheme, NotificationTypes.ERROR);

    expect(result).toEqual("red");
  });

  describe("getTypeIcon", () => {
    it("returns WarningIcon when notification type is ERROR", () => {
      const result = getTypeIcon(dummyTheme, NotificationTypes.ERROR);

      const rootNode = mount(result);
      const foundIcon = rootNode.find(WarningIcon);

      expect(foundIcon.length).toBe(1);
    });
    it("returns SuccessIcon when notification type is SUCCESS", () => {
      const result = getTypeIcon(dummyTheme, NotificationTypes.SUCCESS);

      const rootNode = mount(result);
      const foundIcon = rootNode.find(SuccessIcon);

      expect(foundIcon.length).toBe(1);
    });
    it("returns WarningIcon when notification type is WARNING", () => {
      const result = getTypeIcon(dummyTheme, NotificationTypes.WARNING);

      const rootNode = mount(result);
      const foundIcon = rootNode.find(WarningIcon);

      expect(foundIcon.length).toBe(1);
    });
  });

  it("renders correct amount of notifications based on the data input", () => {
    const rootNode = mount(
      <ThemeProvider theme={{ notificationsList: dummyTheme }}>
        <NotificationsList
          notifications={[
            {
              body: "Please consider A",
              type: NotificationTypes.WARNING,
            },
            {
              body: "Something went wrong",
              type: NotificationTypes.ERROR,
            },
            {
              body: "Data was added",
              type: NotificationTypes.SUCCESS,
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(rootNode.find(Notification).length).toBe(3);
  });
});
