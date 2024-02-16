import { notification } from "antd";

export const closeTableNotification = (num) => {
  notification.success({
    type: "success",
    message: `Tisch ${num} ist jetzt nochmal frei`,
    description:
      "The table has been closed and now is available again to be rented.",
  });
};

export const holdTableNotification = (_, message, desc) => {
  notification.success({
    message: `${message}`,
    description: `${desc}`,
  });
};
