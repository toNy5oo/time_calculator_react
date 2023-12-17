import { notification } from "antd";

export const notifyOnClose = (num) => {
  notification.success({
    type: "success",
    message: `Tisch ${num} ist jetzt nochmal frei`,
    description:
      "The table has been closed and now is available again to be rented.",
  });
};

export const notifyOnHold = (_, message, desc) => {
  notification.success({
    message: `${message}`,
    description: `${desc}`,
  });
};
